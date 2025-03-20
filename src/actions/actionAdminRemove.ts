import { ACTION_CODES, type Action, type Forum } from '../types';
import type { ActionAdminRemove } from '../types/actionQueries';
import { paramsToObject } from './shared';

export function actionAdminRemove(jsonData: Forum, action: Action) {
    const query = paramsToObject<ActionAdminRemove>(new URLSearchParams(action.memo.replace('0xForum?', '')))
    if (query.a != ACTION_CODES.ADMIN_REMOVE) {
        console.warn(`Skipped ${action.hash}, action code was not valid.`);
        return;
    }

    if (!query.addr) {
        console.warn(`Skipped ${action.hash}, missing Address at position 1`);
        return;
    }

    if (action.from_address !== jsonData.owner) {
        console.warn(`Skipped ${action.hash}, not owner of board`);
        return;
    }

    const idx = jsonData.admins.findIndex(x => x == query.addr);
    if (idx <= -1) {
        console.warn(`Skipped ${action.hash}, admin does not exist`);
        return;
    }

    jsonData.admins.splice(idx, 1);
    console.log(`Remove Admin Invoked`)
}
