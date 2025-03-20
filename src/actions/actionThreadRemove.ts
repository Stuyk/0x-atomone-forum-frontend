import { ACTION_CODES, type Action, type Forum } from '../types';
import type { ActionThreadRemove } from '../types/actionQueries';
import { paramsToObject } from './shared';

export function actionThreadRemove(jsonData: Forum, action: Action) {
    const query = paramsToObject<ActionThreadRemove>(new URLSearchParams(action.memo))
    if (query.a != ACTION_CODES.THREAD_REMOVE) {
        console.warn(`Skipped ${action.hash}, action code was not valid.`);
        return;
    }

    if (!query.th) {
        console.warn(`Skipped ${action.hash}, missing ThreadHash at position 1`);
        return;
    }

    const threadIndex = jsonData.threads.findIndex((x) => x.hash === query.th);
    if (threadIndex <= -1) {
        console.warn(`Skipped ${action.hash}, invalid thread hash at position 1`);
        return;
    }

    if (action.from !== jsonData.threads[threadIndex].messages[0].author && action.from !== jsonData.owner && !jsonData.admins.includes(action.from)) {
        console.warn(`Skipped ${action.hash}, not owner of message`);
        return;
    }

    jsonData.threads.splice(threadIndex, 1);
    console.log('Remove Thread Invoked')
}
