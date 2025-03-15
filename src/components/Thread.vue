<script lang="ts" setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import type { Thread } from '../types';

import { useForum } from '../composables/useForum';

import Avatar from '../components/Avatar.vue';
import IconReplies from '../components/icons/IconReplies.vue';
import IconClock from './icons/IconClock.vue';

const router = useRouter();
const forum = useForum();

const props = defineProps<{ thread: Thread }>();

function goTo(hash: string) {
    router.push(`/thread/${hash}`);
}

const lastReply = computed(() => {
    const date = new Date(props.thread.messages[props.thread.messages.length - 1].timestamp).getTime();
    const now = Date.now();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 24) {
        return `${diffHours}h`;
    }
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d`;
});
</script>

<template>
    <div
        class="flex flex-row rounded overflow-hidden text-wrap box-border p-3 bg-gray-900 gap-3 border border-gray-700 items-center w-full hover:border-gray-600 hover:bg-gray-800 cursor-pointer"
        @click="goTo(props.thread.hash)"
    >
        <Avatar :hash="props.thread.messages[0].author" class="size-10 rounded-full border-2 border-gray-700" />
        <div class="flex flex-col w-full grow">
            <div class="text-gray-50 font-bold text-wrap break-all">{{ forum.getThreadTitle(props.thread.hash) }}</div>
            <code class="w-full flex items-center justify-start text-xs text-gray-500 text-wrap break-all">
                {{ props.thread.messages[0].author }}
            </code>
        </div>
        <div class="flex flex-col gap-2 items-center select-none text-xs py-3 px-6 border rounded border-gray-700">
            <IconClock class="size-5" />
            <span>
                {{ lastReply }}
            </span>
        </div>
        <div class="flex flex-col gap-2 items-center select-none text-xs py-3 px-6 border rounded border-gray-700">
            <IconReplies  class="size-5" />
            <span>
                {{ props.thread.messages.length - 1 }}
            </span>
        </div>
    </div>
</template>
