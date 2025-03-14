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
}

export interface Proposal {
    proposal: {
        proposal_id: string;
        content: {
            '@type': string;
            title: string;
            description: string;
            changes: Array<{
                subspace: string;
                key: string;
                value: string;
            }>;
        };
        status: string;
        final_tally_result: {
            yes: string;
            abstain: string;
            no: string;
            no_with_veto: string;
        };
        submit_time: string;
        deposit_end_time: string;
        total_deposit: Array<{
            denom: string;
            amount: string;
        }>;
        voting_start_time: string;
        voting_end_time: string;
    };
}
