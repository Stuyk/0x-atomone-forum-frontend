<script lang="ts" setup>
import { computed } from 'vue';
import { useForum } from '../composables/useForum';
import { useProposals } from '../composables/useProposals';
import MarkdownWrapper from './MarkdownWrapper.vue';
import IconLink from './icons/IconLink.vue';

const forum = useForum();
const proposals = useProposals();

const props = defineProps<{ threadHash: string; msgHash: string }>();

const id = computed(() => {
    if (!forum.content.value) {
        return -1;
    }

    const threadIndex = forum.content.value.threads.findIndex((x) => x.hash === props.threadHash);
    if (threadIndex <= -1) {
        return 'Thread Not Found';
    }

    const msgIndex = forum.content.value.threads[threadIndex].messages.findIndex((x) => x.hash == props.msgHash);
    if (msgIndex <= -1) {
        return 'Message Not Found';
    }

    const splitContent = forum.content.value.threads[threadIndex].messages[msgIndex].message.split(':');
    return parseInt(splitContent[splitContent.length - 1]);
});

const proposal = computed(() => {
    return proposals.proposals.value[id.value].proposal;
});

const status = computed(() => {
    switch(proposal.value.status) {
        case "PROPOSAL_STATUS_VOTING_PERIOD":
            return "Voting"
        case "PROPOSAL_STATUS_DEPOSIT_PERIOD":
            return "Depositing"
        case "PROPOSAL_STATUS_PASSED":
            return "Passed";
        case "PROPOSAL_STATUS_REJECTED":
            return "Rejected";
        case "PROPOSAL_STATUS_FAILED":
            return "Failed";
        default:
            return "Unknown"
    }
});
</script>

<template>
    <div class="flex flex-col gap-3 w-full">
        <MarkdownWrapper :content="forum.getMessageContent(props.threadHash, props.msgHash, true)" />
        <div class="flex flex-row gap-3 w-full justify-end border-t pt-3 border-gray-700">
            <div class="flex flex-row gap-1 bg-gray-800 p-3 border rounded text-gray-400 border-gray-700 text-center text-xs">
                <span>{{ status }}</span>
            </div>
            <div class="flex flex-row gap-1 bg-gray-800 p-3 border rounded text-gray-400 border-gray-700 text-center text-xs">
                <span>{{ new Date(proposal.voting_start_time).toLocaleString() }}</span>
                <span>to</span>
                <span>{{ new Date(proposal.voting_end_time).toLocaleString() }}</span>
            </div>
            <a 
            class="flex flex-row gap-1 bg-gray-800 p-3 border rounded text-gray-400 border-gray-700 text-center text-xs hover:bg-gray-700 hover:text-gray-200 hover:cursor-pointer"
            target="_blank"
            :href="`https://gov.atom.one/proposals/${id}`"
            >
                <span>{{ status === 'Voting' ? 'Vote' : 'View' }}</span>
                <IconLink class="size-4" />
            </a>
        </div>
    </div>
</template>
