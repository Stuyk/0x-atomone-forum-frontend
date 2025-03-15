import { ref } from 'vue';
import type { Forum } from '../types';
import forumInfo from '../forum-config.json';
import { useProposals } from './useProposals';

const ENDPOINT_URLS = forumInfo.dataApi;
const { proposals, fetchProposal } = useProposals();

const content = ref<Forum | null>()
const isUpdating = ref(false);

export function useForum() {
    const update = async () => {
        isUpdating.value = true;

        for(let api of ENDPOINT_URLS) {
            try {
                const result = await fetch(api);
                if (!result.ok) {
                    console.error(new Error(`Failed to fetch from ${api}`))
                    continue;
                }
    
                content.value = await result.json();
                isUpdating.value = false;
                break;
            } catch(err) {
                console.error(new Error(`Failed to fetch from ${api}`))
                console.error(err);
            }
        }

        isUpdating.value = false;
    }

    const isAdmin = (address: string) => {
        if (!content.value) {
            console.log('no content?')
            return false;
        }

        if (content.value.admins.find(x => x == address)) {
            return true;
        }

        if (content.value.owner === address) {
            return true;
        }

        return false;
    }

    const getThreadTitle = (hash: string) => {
        if (!content.value) {
            return 'No Title Found';
        }

        const idx = content.value.threads.findIndex(x => x.hash === hash);
        if (idx <= -1) {
            return 'Thread Not Found';
        }

        if (content.value.threads[idx].title.includes('proposal:')) {
            const [_, id] = content.value.threads[idx].title.split(':');
            if (!proposals.value[id]) {
                return `Prop #${id}`;
            }

            return `Prop #${id} - ${proposals.value[id].proposal.content.title}`
        }

        return content.value.threads[idx].title;
    }

    const getMessageContent = (forumHash: string, msgHash: string, isFull = false) => {
        if (!content.value) {
            return 'No Content Found';
        }

        const threadIndex = content.value.threads.findIndex(x => x.hash === forumHash);
        if (threadIndex <= -1) {
            return 'Thread Not Found';
        }

        const msgIndex = content.value.threads[threadIndex].messages.findIndex(x => x.hash == msgHash);
        if (msgIndex <= -1) {
            return 'Message Not Found';
        }

        const msg = content.value.threads[threadIndex].messages[msgIndex].message;

        if (msg.includes('proposal:')) {
            const [_, id] = msg.split(':');
            if (!proposals.value[id]) {
                return `Prop #${id}`;
            }

            if (isFull) {
                return proposals.value[id].proposal.content.description;
            }

            return proposals.value[id].proposal.content.description.slice(0, forumInfo.maxContentLength) + '...';
        }

        return msg;
    }

    const getAllProposals = async () => {
        isUpdating.value = true;

        if (!content.value) {
            return;
        }

        const promises: Promise<any>[] = [];

        for(let thread of content.value.threads.filter(x => x.title.includes('proposal:'))) {
            const [_, id] = thread.title.split(':');
            promises.push(fetchProposal(id));
        }

        await Promise.all(promises);
        isUpdating.value = false;
    };

    const isProposalMessage = (forumHash: string, msgHash: string) => {
        if (!content.value) {
            return false;
        }

        const threadIndex = content.value.threads.findIndex(x => x.hash === forumHash);
        if (threadIndex <= -1) {
            return false;
        }

        const msgIndex = content.value.threads[threadIndex].messages.findIndex(x => x.hash == msgHash);
        if (msgIndex <= -1) {
            return false;
        }

        return content.value.threads[threadIndex].title.includes('proposal:') && content.value.threads[threadIndex].messages[msgIndex].message.includes('proposal:')
    }

    const isProposalThread = (threadHash: string) => {
        if (!content.value) {
            return false;
        }

        const threadIndex = content.value.threads.findIndex(x => x.hash === threadHash);
        if (threadIndex <= -1) {
            return false;
        }

        return content.value.threads[threadIndex].title.includes('proposal:')
    }

    return {
        content,
        getAllProposals,
        getThreadTitle,
        getMessageContent,
        isUpdating,
        isProposalThread,
        isProposalMessage,
        isAdmin,
        update
    }
}