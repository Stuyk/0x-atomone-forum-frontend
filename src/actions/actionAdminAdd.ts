import { ACTION_CODES, type Action, type Forum } from '../types';
import type { ActionAdminAdd } from '../types/actionQueries';
import { paramsToObject } from './shared';

export function actionAdminAdd(jsonData: Forum, action: Action) {
    const query = paramsToObject<ActionAdminAdd>(new URLSearchParams(action.memo))
    if (query.a != ACTION_CODES.ADMIN_ADD) {
        console.warn(`Skipped ${action.hash}, action code was not valid.`);
        return;
    }

    if (!query.addr) {
        console.warn(`Skipped ${action.hash}, missing Address at position 1`);
        return;
    }

    if (action.from !== jsonData.owner) {
        console.warn(`Skipped ${action.hash}, not owner of board`);
        return;
    }

    const idx = jsonData.admins.findIndex((x) => x == query.addr);
    if (idx >= 0) {
        console.warn(`Skipped ${action.hash}, admin already added`);
        return;
    }

    jsonData.admins.push(query.addr);
    console.log(`Add Admin Invoked`);
}
