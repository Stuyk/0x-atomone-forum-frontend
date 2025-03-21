import { ref } from 'vue';
import { type Action, ACTION_CODES, type Forum } from "../types";
import { actionAdminAdd } from "./actionAdminAdd";
import { actionAdminRemove } from "./actionAdminRemove";
import { actionMessageAdd } from "./actionMessageAdd";
import { actionMessageRemove } from "./actionMessageRemove";
import { actionMessageUpvote } from "./actionMessageUpvote";
import { actionThreadCreate } from "./actionThreadCreate";
import { actionThreadRemove } from "./actionThreadRemove";

const OWNER = 'atone1uq6zjslvsa29cy6uu75y8txnl52mw06j6fzlep'

const ActionMapping = {
    [ACTION_CODES.THREAD_CREATE]: actionThreadCreate,
    [ACTION_CODES.MESSAGE_ADD]: actionMessageAdd,
    [ACTION_CODES.MESSAGE_REMOVE]: actionMessageRemove,
    [ACTION_CODES.THREAD_REMOVE]: actionThreadRemove,
    [ACTION_CODES.ADMIN_ADD]: actionAdminAdd,
    [ACTION_CODES.ADMIN_REMOVE]: actionAdminRemove,
    [ACTION_CODES.MESSAGE_UPVOTE]: actionMessageUpvote
};

const lastBlock = ref<string>('');

export function parseActions(actions: Action[], existingData: Forum | null = null): Forum {
    let forum: Forum = { admins: [ OWNER ], owner: OWNER, threads: [], lastBlock: '' }
    let skipToLastBlock = false;

    if (existingData) {
        forum = existingData;
        skipToLastBlock = true;
    }

    for(let action of actions) {
        if (skipToLastBlock && action.height != lastBlock.value) {
            continue;
        }

        skipToLastBlock = false;
        if (action.height == lastBlock.value) {
            continue;
        }
        
        const params = new URLSearchParams(action.memo.replace('0xForum?', ''))
        const actionCode = params.get('a');
        if (!actionCode) {
            console.warn(`Skipped Action ${action.hash}, invalid parameters`);
            continue;
        }

        if (!ActionMapping[actionCode]) {
            console.warn(`Invalid action code ${actionCode}`);
            continue;
        }

        ActionMapping[actionCode](forum, action);
    }

    lastBlock.value = actions[actions.length - 1].height;
    return forum;
}