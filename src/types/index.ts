export interface Forum {
    admins: string[]
    owner: string
    threads: Thread[]
    lastBlock: string
  }
  
  export interface Thread {
    title: string
    hash: string
    updated: string
    messages: Message[]
  }
  
  export interface Message {
    author: string
    hash: string
    message: string
    timestamp: string
  }
  