import { ACTION_CODES, type Action, type Forum } from '../types';
import type { ActionMessageUpvote } from '../types/actionQueries';
import { paramsToObject } from './shared';

export function actionMessageUpvote(jsonData: Forum, action: Action) {
    const query = paramsToObject<ActionMessageUpvote>(new URLSearchParams(action.memo))
    if (query.a != ACTION_CODES.MESSAGE_UPVOTE) {
        console.warn(`Skipped ${action.hash}, action code was not valid.`);
        return;
    }

    if (!query.th) {
        console.warn(`Skipped ${action.hash}, missing ThreadHash at position 1`);
        return;
    }

    if (!query.mh) {
        console.warn(`Skipped ${action.hash}, missing Content at position 2`);
        return;
    }

    const threadIndex = jsonData.threads.findIndex((x) => x.hash === query.th);
    if (threadIndex <= -1) {
        console.warn(`Skipped ${action.hash}, invalid thread hash at position 1`);
        return;
    }

    const msgIdx = jsonData.threads[threadIndex].messages.findIndex((x) => x.hash === query.mh);
    if (msgIdx <= -1) {
        console.warn(`Skipped ${action.hash}, message could not be found.`);
        return;
    }

    // Create upvotes array if it does not already exist.
    if (!jsonData.threads[threadIndex].messages[msgIdx].upvotes) {
        jsonData.threads[threadIndex].messages[msgIdx].upvotes = [action.from];
        jsonData.threads[threadIndex].updated = new Date(action.timestamp).toISOString();
        console.log(`Upvote Message Action Invoked`);
        return
    }

    const upvoteIndex = jsonData.threads[threadIndex].messages[msgIdx].upvotes.findIndex(x => x == action.from);
    if (upvoteIndex >= 0) {
        console.warn(`Skipped ${action.hash}, upvote already counted.`);
        return;
    }

    jsonData.threads[threadIndex].messages[msgIdx].upvotes.push(action.from);
    jsonData.threads[threadIndex].updated = new Date(action.timestamp).toISOString();
    console.log(`Upvote Message Action Invoked`);
}
