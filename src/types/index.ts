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
      id: string
      messages: Array<any>
      status: string
      final_tally_result: {
        yes_count: string
        abstain_count: string
        no_count: string
      }
      submit_time: string
      deposit_end_time: string
      total_deposit: Array<{
        denom: string
        amount: string
      }>
      voting_start_time: any
      voting_end_time: any
      metadata: string
      title: string
      summary: string
      proposer: string
    }
  }
