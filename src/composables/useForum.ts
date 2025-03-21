import { ref } from 'vue';
import type { Action, Forum } from '../types';
import forumInfo from '../forum-config.json';
import { useProposals } from './useProposals';
import { parseActions } from '../actions/actionParser';
import { createHash } from 'crypto';

const { proposals, fetchProposal } = useProposals();

const content = ref<Forum | null>();
const contentHash = ref<string>('');

const isUpdating = ref(false);
const isLiveUpdating = ref(false);
const liveInterval = ref<NodeJS.Timeout | undefined>(undefined);



export function useForum() {
    const update = async () => {
        isUpdating.value = true;

        try {
            const response = await fetch(`https://forum.terrible-ape-79.telebit.io/data`);
            if (!response.ok) {
                isUpdating.value = false;
                return;
            }

            const actions = (await response.json()) as { data: Action[], total: number, limit: number, offset: number };
            const newContent = parseActions(actions.data, content.value);
            const newContentHash = createHash('sha256').update(JSON.stringify(newContent)).digest('hex');
            if (contentHash.value === newContentHash) {
                isUpdating.value = false;
                return;
            }

            contentHash.value = newContentHash;
            content.value = newContent;
        } catch (err) {
            console.error(new Error(`Failed to fetch data for forum.`));
            console.error(err);
        }

        isUpdating.value = false;
    };

    const isAdmin = (address: string) => {
        if (!content.value) {
            console.log('no content?');
            return false;
        }

        if (content.value.admins.find((x) => x == address)) {
            return true;
        }

        if (content.value.owner === address) {
            return true;
        }

        return false;
    };

    const getThreadTitle = (hash: string) => {
        if (!content.value) {
            return 'No Title Found';
        }

        const idx = content.value.threads.findIndex((x) => x.hash === hash);
        if (idx <= -1) {
            return 'Thread Not Found';
        }

        if (content.value.threads[idx].title.includes('proposal:')) {
            const [_, id] = content.value.threads[idx].title.split(':');
            if (!proposals.value[id]) {
                return `Prop #${id}`;
            }

            return `Prop #${id} - ${proposals.value[id].proposal.title}`;
        }

        return content.value.threads[idx].title;
    };

    const getMessageContent = (threadHash: string, msgHash: string, isFull = false) => {
        if (!content.value) {
            return 'No Content Found';
        }

        const threadIndex = content.value.threads.findIndex((x) => x.hash === threadHash);
        if (threadIndex <= -1) {
            return 'Thread Not Found';
        }

        const msgIndex = content.value.threads[threadIndex].messages.findIndex((x) => x.hash == msgHash);
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
                return proposals.value[id].proposal.summary;
            }

            return proposals.value[id].proposal.summary.slice(0, forumInfo.maxContentLength) + '...';
        }

        return msg;
    };

    const getMessageUpvotes = (threadHash: string, msgHash: string) => {
        if (!content.value) {
            return 0;
        }

        const threadIndex = content.value.threads.findIndex((x) => x.hash === threadHash);
        if (threadIndex <= -1) {
            return 0;
        }

        const msgIndex = content.value.threads[threadIndex].messages.findIndex((x) => x.hash == msgHash);
        if (msgIndex <= -1) {
            return 'Message Not Found';
        }

        if (content.value.threads[threadIndex].messages[msgIndex].upvotes) {
            return content.value.threads[threadIndex].messages[msgIndex].upvotes.length;
        }

        return 0;
    };

    const getAllProposals = async () => {
        isUpdating.value = true;

        if (!content.value) {
            return;
        }

        const promises: Promise<any>[] = [];

        for (let thread of content.value.threads.filter((x) => x.title.includes('proposal:'))) {
            const [_, id] = thread.title.split(thread.title.includes(':') ? ':' : '%3A');
            promises.push(fetchProposal(id));
        }

        await Promise.all(promises);
        isUpdating.value = false;
    };

    const isProposalMessage = (forumHash: string, msgHash: string) => {
        if (!content.value) {
            return false;
        }

        const threadIndex = content.value.threads.findIndex((x) => x.hash === forumHash);
        if (threadIndex <= -1) {
            return false;
        }

        const msgIndex = content.value.threads[threadIndex].messages.findIndex((x) => x.hash == msgHash);
        if (msgIndex <= -1) {
            return false;
        }

        return (
            content.value.threads[threadIndex].title.includes('proposal:') &&
            content.value.threads[threadIndex].messages[msgIndex].message.includes('proposal:')
        );
    };

    const isProposalThread = (threadHash: string) => {
        if (!content.value) {
            return false;
        }

        const threadIndex = content.value.threads.findIndex((x) => x.hash === threadHash);
        if (threadIndex <= -1) {
            return false;
        }

        return content.value.threads[threadIndex].title.includes('proposal:');
    };

    const toggleLiveMode = () => {
        isLiveUpdating.value = !isLiveUpdating.value;

        if (isLiveUpdating.value) {
            liveInterval.value = setInterval(update, 5000);
        } else {
            clearInterval(liveInterval.value);
        }
    }

    return {
        content,
        getAllProposals,
        getThreadTitle,
        getMessageContent,
        getMessageUpvotes,
        isUpdating,
        isLiveUpdating,
        isProposalThread,
        isProposalMessage,
        isAdmin,
        toggleLiveMode,
        update,
    };
}
