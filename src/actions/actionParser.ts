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


export function parseActions(actions: Action[]): Forum {
    const forum: Forum = { admins: [ OWNER ], owner: OWNER, threads: [], lastBlock: '' }

    for(let action of actions) {
        const params = new URLSearchParams(action.memo);
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

    return forum;
}