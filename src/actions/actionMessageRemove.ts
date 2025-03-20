import { ACTION_CODES, type Action, type Forum } from '../types';
import type { ActionMessageRemove } from '../types/actionQueries';
import { paramsToObject } from './shared';

export function actionMessageRemove(jsonData: Forum, action: Action) {
    const query = paramsToObject<ActionMessageRemove>(new URLSearchParams(action.memo.replace('0xForum?', '')))
    if (query.a != ACTION_CODES.MESSAGE_REMOVE) {
        console.warn(`Skipped ${action.hash}, action code was not valid.`);
        return;
    }

    if (!query.th) {
        console.warn(`Skipped ${action.hash}, missing ThreadHash at position 1`);
        return;
    }

    if (!query.mh) {
        console.warn(`Skipped ${action.hash}, missing MessageHash at position 2`);
        return;
    }

    const threadIndex = jsonData.threads.findIndex((x) => x.hash === query.th);
    if (threadIndex <= -1) {
        console.warn(`Skipped ${action.hash}, invalid thread hash at position 1`);
        return;
    }

    const msgIndex = jsonData.threads[threadIndex].messages.findIndex((x) => x.hash === query.mh);
    if (msgIndex <= -1) {
        console.warn(`Skipped ${action.hash}, invalid msg hash at position 2`);
        return;
    }

    const msg = jsonData.threads[threadIndex].messages[msgIndex];
    if (action.from_address !== msg.author && action.from_address !== jsonData.owner && !jsonData.admins.includes(action.from_address)) {
        console.warn(`Skipped ${action.hash}, not owner of message`);
        return;
    }

    jsonData.threads[threadIndex].updated = new Date(Date.now()).toISOString();
    jsonData.threads[threadIndex].messages.splice(msgIndex, 1);
    console.log(`Remove Message Action Invoked`);
}
