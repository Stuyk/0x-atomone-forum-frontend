<script lang="ts" setup>
import { computed } from 'vue';
import type { Message } from '../types';

import { useWallet } from '../composables/useWallet';
import { useForum } from '../composables/useForum';

import Avatar from './Avatar.vue';
import MarkdownWrapper from './MarkdownWrapper.vue';
import IconHeart from './icons/IconHeart.vue';

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

function upvoteInvalid() {
    alert('Must be logged in to upvote');
}
</script>

<template>
    <div class="flex flex-row gap-3 box-border flex-wrap" :id="props.message.hash" v-if="isReady">
        <!-- Message Upvotes -->
        <!-- <div
            class="flex flex-col bg-gray-900 p-6 rounded-md border border-gray-700 items-center justify-center text-gray-500 hover:text-gray-200 cursor-pointer max-h-24"
            @click="wallet.state.address ? wallet.actionUpvoteMessage(props.thread, props.message.hash) : upvoteInvalid()"
        >
            <IconChevronRight class="-rotate-90" />
            <span class="text-xs pb-1">{{ forum.getMessageUpvotes(props.thread, props.message.hash) }}</span>
        </div> -->
        <!-- Message Content -->
        <div
            class="flex flex-col w-full bg-gray-900 p-3 rounded border border-gray-700 items-center justify-center text-gray-500"
        >
            <!-- Top Section -->
            <div class="flex flex-row gap-3 w-full items-center md:justify-start border-b pb-3 mb-3 border-gray-700">
                <Avatar :hash="props.message.author" :size="32" class="size-14 rounded-md border-2 border-gray-700" />
                <div class="flex flex-col w-full">
                    <span class="text-gray-300 font-bold text-left text-wrap break-all w-full">
                        {{
                            props.message.author.slice(0, 5) +
                            '...' +
                            props.message.author.slice(props.message.author.length - 8, props.message.author.length)
                        }}
                    </span>
                    <span class="text-xs text-gray-400 text-left text-wrap break-all grow w-full">
                        {{ props.message.author }}
                    </span>
                </div>
            </div>
            <div class="flex flex-col w-full gap-3 min-h-16 bg-gray-900 rounded-b-md">
                <div class="flex flex-row h-full text-gray-300" v-if="!isProposal">
                    {{ forum.getMessageContent(props.thread, props.message.hash) }}
                </div>
                <MarkdownWrapper v-else :content="forum.getMessageContent(props.thread, props.message.hash, true)" />
            </div>
            <div class="flex flex-row w-full border-t gap-3 border-gray-700 mt-3 pt-3 items-center text-sm flex-wrap md:flex-nowrap">
                <!-- Upvotes -->
                <div class="flex flex-row gap-1 items-center hover:text-gray-200 hover:cursor-pointer">
                    <IconHeart
                        title="Upvote"
                        alt="Upvote"
                        class="size-4"
                        @click="
                            wallet.state.address
                                ? wallet.actionUpvoteMessage(props.thread, props.message.hash)
                                : upvoteInvalid()
                        "
                    />
                    <span class="text-sm">{{ forum.getMessageUpvotes(props.thread, props.message.hash) }}</span>
                </div>
                <span class="text-xs text-left text-wrap break-all">
                    {{ new Date(props.message.timestamp).toLocaleString() }}
                </span>
                <div
                    v-if="(isAdmin || isOwner) && !isFirstPost"
                    class="hover:text-red-500 cursor-pointer"
                    @click="wallet.actionRemoveMessage(props.thread, props.message.hash)"
                >
                    Remove Post
                </div>
                <div
                    v-if="(isAdmin || isOwner) && isFirstPost"
                    class="hover:text-red-500 cursor-pointer"
                    @click="wallet.actionRemoveThread(props.thread)"
                >
                    Remove Thread
                </div>
                <a
                    class="text-gray-500 hover:text-gray-300 text-wrap break-all"
                    target="_blank"
                    :href="`https://www.mintscan.io/atomone/tx/${props.message.hash}`"
                >
                    Transaction &#x2197;
                </a>
            </div>
        </div>
    </div>

    <!-- 
     {{ forum.getMessageUpvotes(props.thread, props.message.hash) }} updoots 
    <div
        class="flex flex-col rounded-md bg-gray-900 p-6 rounded-t-md border border-gray-700 gap-3"
        :id="props.message.hash"
        v-if="isReady"
    >
        <div class="flex flex-row gap-3 grow items-center justify-center w-full border-b border-gray-700 pb-3 flex-wrap md:flex-nowrap md:justify-between">
            <div class="flex flex-row gap-3 w-full items-center grow text-wrap break-all justify-center flex-wrap md:flex-nowrap md:justify-start">
                <Avatar :hash="props.message.author" :size="32" class="size-14 rounded-full border-2 border-gray-700" />
                <div class="flex flex-col w-full">
                    <span class="text-gray-300 font-bold text-center w-full md:text-left">
                        {{
                            props.message.author.slice(0, 5) +
                            '...' +
                            props.message.author.slice(props.message.author.length - 8, props.message.author.length)
                        }}
                    </span>
                    <span class="text-xs text-gray-400 text-center md:text-left grow w-full">
                        {{ props.message.author }}
                    </span>
                </div>
            </div>
            <div class="flex flex-col w-full justify-center text-gray-500 items-center text-xs text-wrap break-all text-center md:text-right md:items-end">
                {{ new Date(props.message.timestamp).toLocaleString() }}
            </div>
        </div>
        <div class="flex flex-col w-full gap-3 min-h-16 bg-gray-900 rounded-b-md">
            <div class="flex flex-row h-full text-gray-300" v-if="!isProposal">
                {{ forum.getMessageContent(props.thread, props.message.hash) }}
            </div>
            <MarkdownWrapper v-else :content="forum.getMessageContent(props.thread, props.message.hash, true)" />
        </div>
        <div class="flex flex-row gap-3 items-start justify-between border-t pt-3 border-gray-700" >
            <a
                    class="text-gray-500 items-end self-end text-xs hover:text-gray-300 text-wrap break-all"
                    target="_blank"
                    :href="`https://www.mintscan.io/atomone/tx/${props.message.hash}`"
                >
                    {{ props.message.hash }}&#x2197;
            </a>
            
        </div>
    </div> -->
</template>
