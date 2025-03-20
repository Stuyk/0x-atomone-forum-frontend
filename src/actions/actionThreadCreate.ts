import { ACTION_CODES, type Action, type Forum } from '../types';
import type { ActionThreadCreate } from '../types/actionQueries';
import { paramsToObject } from './shared';

export function actionThreadCreate(jsonData: Forum, action: Action) {
    const query = paramsToObject<ActionThreadCreate>(new URLSearchParams(action.memo.replace('0xForum?', '')))
    if (query.a != ACTION_CODES.THREAD_CREATE) {
        console.warn(`Skipped ${action.hash}, action code was not valid.`);
        return;
    }

    if (!query.t) {
        console.warn(`Skipped ${action.hash}, missing title at position 1`);
        return;
    }

    if (!query.c) {
        console.warn(`Skipped ${action.hash}, missing content at position 2`);
        return;
    }

    const threadIdx = jsonData.threads.findIndex((x) => x.hash === action.hash);
    if (threadIdx >= 0) {
        console.warn(`Skipped ${action.hash}, thread already exists.`);
        return;
    }

    jsonData.threads.push({
        title: query.t,
        hash: action.hash,
        updated: new Date(action.timestamp).toISOString(),
        messages: [
            {
                author: action.from_address,
                hash: action.hash,
                message: query.c,
                timestamp: new Date(action.timestamp).toISOString(),
                upvotes: [],
            },
        ],
    });

    console.log(`Create Thread Action Invoked`);
}
