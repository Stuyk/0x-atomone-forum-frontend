<script setup lang="ts">
import { computed } from 'vue';
import { useForum } from '../composables/useForum';
import { useRoute } from 'vue-router';
import Message from '../components/Message.vue';
import ThreadReply from '../components/ThreadReply.vue';


const route = useRoute();
const forum = useForum();

const thread = computed(() => {
    const hash = route.params.hash;
    if (!forum.content.value) {
        return null;
    }

    return forum.content.value.threads.find((x) => x.hash === hash);
});
</script>

<template>
    <div class="flex flex-col px-3 gap-3" v-if="thread">
        <div class="flex flex-row justify-between items-end">
            <div class="text-2xl font-bold rounded-md pt-3 select-none">
                {{ forum.getThreadTitle(thread.hash) }}
            </div>
            <a
                class="text-bg-500 text-xs hover:text-bg-200 text-wrap break-all text-gray-400 hover:text-gray-200"
                target="_blank"
                :href="`https://www.mintscan.io/atomone/tx/${thread.hash}`"
            >
                Transaction &#x2197;
            </a>
        </div>
        <Message
            v-for="(msg, index) in thread.messages"
            :message="msg"
            :thread="thread.hash"
            :key="index"
            :isFirstPost="index === 0"
        />
        <ThreadReply :thread="thread.hash" />
    </div>
</template>
