<script setup lang="ts">
import { computed } from 'vue';
import { useForum } from '../composables/useForum';
import { useRoute } from 'vue-router';
import { useWallet } from '../composables/useWallet';
import Message from '../components/Message.vue';
import ThreadReply from '../components/ThreadReply.vue';

const route = useRoute();
const forum = useForum();
const wallet = useWallet();

const thread = computed(() => {
    const hash = route.params.hash;
    if (!forum.content.value) {
        return null;
    }

    return forum.content.value.threads.find((x) => x.hash === hash);
});

const isAdmin = computed(() => {
    return forum.isAdmin(wallet.state.address ?? '');
});

const isOwner = computed(() => {
    return thread.value?.messages[0].author == wallet.state.address;
});
</script>

<template>
    <div class="flex flex-col p-6 gap-6" v-if="thread">
        <div class="flex flex-col gap-6 rounded-md">
            <div class="flex flex-row justify-between pb-3">
                <div class="flex flex-col gap-2">
                    <div class="text-2xl font-bold rounded-md pt-3 select-none">{{ forum.getThreadTitle(thread.hash) }}</div>
                    <a
                        class="text-bg-500 text-xs hover:text-bg-200 text-wrap break-all"
                        target="_blank"
                        :href="`https://www.mintscan.io/atomone/tx/${thread.hash}`"
                    >
                        {{ thread.hash }}&#x2197;
                    </a>
                </div>
                <div class="flex flex-row gap-3 items-end" v-if="(isAdmin || isOwner)">
                    <div
                        class="text-sm hover:text-red-500 cursor-pointer"
                        @click="wallet.actionRemoveThread(thread.hash)"
                    >
                        Remove Thread
                    </div>
                </div>
            </div>
            <Message
                v-for="(msg, index) in thread.messages"
                :message="msg"
                :thread="thread.hash"
                :key="index"
                :isFirstPost="index === 0"
            />
        </div>
        <ThreadReply :thread="thread.hash" />
    </div>
</template>
