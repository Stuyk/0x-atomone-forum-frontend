<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useForum } from '../composables/useForum';
import { useRouter } from 'vue-router';
import ThreadCreate from '../components/ThreadCreate.vue';

const router = useRouter();
const forum = useForum();

const content = computed(() => {
    return forum.content.value;
});

function goTo(hash: string) {
    router.push(`/thread/${hash}`);
}

const threadsByDate = computed(() => {
    if (!forum.content.value) {
        return [];
    }

    return forum.content.value.threads.sort((a, b) => {
        return (new Date(a.updated)).getMilliseconds() - (new Date(b.updated)).getMilliseconds()
    });
});

onMounted(async () => {});
</script>

<template>
    <div class="flex flex-col p-6 gap-3 box-border" v-if="content">
        <p class="text-center text-red-300">Keep in mind that replies, and threads that are created may take some time to populate. It currently runs off GitHub actions.</p>
        <div class="text-2xl font-bold">Threads</div>
        <div
            v-if="forum.content"
            v-for="(thread, index) in threadsByDate"
            class="flex flex-col rounded-md hover:opacity-50 cursor-pointer overflow-hidden text-wrap box-border"
            :key="index"
            @click="goTo(thread.hash)"
        >
            <div class="flex flex-row gap-1 justify-between grow w-full bg-neutral-800 p-2">
                <div class="text-neutral-400 text-1xl font-bold">{{ forum.getThreadTitle(thread.hash) }}</div>
                <div class="text-neutral-400 text-1xl font-bold">{{ thread.messages.length - 1 }} Replies</div>
            </div>
            <div class="flex flex-col h-full text-neutral-400 bg-neutral-900 w-full p-3 gap-3">
                <div class="flex flex-row h-full text-neutral-300 text-lg">{{ forum.getMessageContent(thread.hash, thread.messages[0].hash) }}</div>
                <div class="flex flex-row justify-between">
                    <div class="text-neutral-500 text-sm text-left w-full">Last Reply {{ new Date(thread.updated).toLocaleString() }} </div>
                    <div class="text-neutral-500 text-sm text-right w-full">{{ thread.hash }}</div>
                </div>
            </div>
        </div>
        <ThreadCreate />
    </div>
</template>
