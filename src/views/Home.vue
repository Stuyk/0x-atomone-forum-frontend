<script setup lang="ts">
import { computed } from 'vue';
import { useForum } from '../composables/useForum';
import { useWallet } from '../composables/useWallet';

import ThreadCreate from '../components/ThreadCreate.vue';
import Thread from '../components/Thread.vue';

const wallet = useWallet();
const forum = useForum();

const content = computed(() => {
    return forum.content.value;
});

const threadsByDate = computed(() => {
    if (!forum.content.value) {
        return [];
    }

    return forum.content.value.threads.sort((a, b) => {
        return new Date(b.updated).getTime() - new Date(a.updated).getTime();
    });
});
</script>

<template>
    <div class="flex flex-col pt-3 px-3 gap-3 box-border" v-if="content">
        <div class="text-center text-gray-100 bg-red-900 border border-red-500 rounded p-3">
            Keep in mind that replies, and threads that are created may take some time to populate. Server infrastructure will improve at a later date.
        </div>
        <div class="text-center text-gray-100 bg-gray-600 border border-gray-500 rounded p-3">
            Never input your private keys anywhere on this website. We will never ask for your keys.
        </div>
        <ThreadCreate v-if="wallet.state.address" />
        <Thread
            v-if="forum.content"
            v-for="(thread, index) in threadsByDate"
            :thread="thread"
            :key="index"
        />
    </div>
</template>
