import { ACTION_CODES, type Action, type Forum } from '../types';
import type { ActionMessageAdd } from '../types/actionQueries';
import { paramsToObject } from './shared';

export function actionMessageAdd(jsonData: Forum, action: Action) {
    const query = paramsToObject<ActionMessageAdd>(new URLSearchParams(action.memo.replace('0xForum?', '')))
    if (query.a != ACTION_CODES.MESSAGE_ADD) {
        console.warn(`Skipped ${action.hash}, action code was not valid.`);
        return;
    }

    if (!query.th) {
        console.warn(`Skipped ${action.hash}, missing ThreadHash at position 1`);
        return;
    }

    if (!query.c) {
        console.warn(`Skipped ${action.hash}, missing Content at position 2`);
        return;
    }

    const threadIndex = jsonData.threads.findIndex((x) => x.hash === query.th);
    if (threadIndex <= -1) {
        console.warn(`Skipped ${action.hash}, invalid thread hash at position 1`);
        return;
    }

    const msgIdx = jsonData.threads[threadIndex].messages.findIndex((x) => x.hash === action.hash);
    if (msgIdx >= 0) {
        console.warn(`Skipped ${action.hash}, message already exists.`);
        return;
    }

    jsonData.threads[threadIndex].updated = new Date(action.timestamp).toISOString();
    jsonData.threads[threadIndex].messages.push({
        author: action.from_address,
        hash: action.hash,
        message: query.c,
        timestamp: action.timestamp,
        upvotes: []
    });

    console.log(`Add Message Action Invoked`);
}
