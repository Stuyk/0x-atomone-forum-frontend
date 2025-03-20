export const ACTION_CODES = {
    THREAD_CREATE: '0',
    MESSAGE_ADD: '1',
    MESSAGE_REMOVE: '2',
    THREAD_REMOVE: '3',
    ADMIN_ADD: '4',
    ADMIN_REMOVE: '5',
    MESSAGE_UPVOTE: '6',
};

export interface Forum {
    admins: string[];
    owner: string;
    threads: Thread[];
    lastBlock: string;
}

export interface Thread {
    title: string;
    hash: string;
    updated: string;
    messages: Message[];
}

export interface Message {
    author: string;
    hash: string;
    message: string;
    timestamp: string;
    upvotes: string[];
}

export interface Proposal {
    proposal: {
        id: string;
        messages: Array<any>;
        status: string;
        final_tally_result: {
            yes_count: string;
            abstain_count: string;
            no_count: string;
        };
        submit_time: string;
        deposit_end_time: string;
        total_deposit: Array<{
            denom: string;
            amount: string;
        }>;
        voting_start_time: any;
        voting_end_time: any;
        metadata: string;
        title: string;
        summary: string;
        proposer: string;
    };
}

export interface Action {
    hash: string;
    height: string;
    timestamp: string;
    from_address: string;
    to_address: string;
    memo: string;
    amounts: Array<{
        denom: string;
        amount: string;
    }>;
}
