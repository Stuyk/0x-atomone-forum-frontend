<script lang="ts" setup>
import { computed } from 'vue';
import type { Message } from '../types';
import { useWallet } from '../composables/useWallet';
import { useForum } from '../composables/useForum';
import Avatar from './Avatar.vue';
import MarkdownWrapper from './MarkdownWrapper.vue';

const props = defineProps<{ message: Message; thread: string; isFirstPost: boolean }>();
const wallet = useWallet();
const forum = useForum();

const isAdmin = computed(() => {
    return forum.isAdmin(wallet.state.address ?? '');
});

const isOwner = computed(() => {
    return props.message.author === wallet.state.address;
});

const isReady = computed(() => {
    return forum.isUpdating.value == false;
});

const isProposal = computed(() => {
    return forum.isProposalMessage(props.thread, props.message.hash);
});
</script>

<template>
    <div class="flex flex-col bg-neutral-900 rounded-md" :id="props.message.hash" v-if="isReady">
        <div
            class="flex flex-row w-full gap-3 items-center bg-neutral-800 p-3 rounded-t-md border-b border-neutral-700"
        >
            <div class="flex flex-row gap-3 grow items-center">
                <Avatar v-model="props.message.author" />
                <a
                    class="text-neutral-400 hover:text-neutral-200"
                    :href="`https://www.mintscan.io/atomone/address/${props.message.author}`"
                    target="_blank"
                >
                    {{ props.message.author }}&#x2197;</a
                >
            </div>
            <div class="flex flex-row gap-3 items-center" v-if="(isAdmin || isOwner) && !isFirstPost">
                <div
                    class="text-sm hover:text-red-500 cursor-pointer"
                    @click="wallet.actionRemoveMessage(props.thread, props.message.hash)"
                >
                    Remove Post
                </div>
            </div>
        </div>
        <div class="flex flex-col w-full gap-3 p-3 bg-neutral-800 rounded-b-md">
            <div class="flex flex-row h-full text-neutral-300 text-lg" v-if="!isProposal">
                {{ forum.getMessageContent(props.thread, props.message.hash) }}
            </div>
            <MarkdownWrapper v-else :content="forum.getMessageContent(props.thread, props.message.hash, true)"/>
            <div class="flex flex-row">
                <div class="text-neutral-500 text-sm text-left w-full">
                    Last Reply {{ new Date(props.message.timestamp).toLocaleString() }}
                </div>
                <a
                    class="text-neutral-600 items-end self-end text-xs hover:text-neutral-200"
                    target="_blank"
                    :href="`https://www.mintscan.io/atomone/tx/${props.message.hash}`"
                >
                    {{ props.message.hash }}&#x2197;
                </a>
            </div>
        </div>
    </div>
</template>
