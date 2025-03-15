<script setup lang="ts">
import { computed } from 'vue';
import { useForum } from '../composables/useForum';
import { useRouter } from 'vue-router';
import ThreadCreate from '../components/ThreadCreate.vue';
import Avatar from '../components/Avatar.vue';
import IconChevronRight from '../components/icons/IconChevronRight.vue';
import IconReplies from '../components/icons/IconReplies.vue';
import { useWallet } from '../composables/useWallet';

const router = useRouter();
const forum = useForum();
const wallet = useWallet();

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
        return new Date(b.updated).getTime() - new Date(a.updated).getTime();
    });
});
</script>

<template>
    <div class="flex flex-col pt-6 px-6 gap-6 box-border" v-if="content">
        <ThreadCreate v-if="wallet.state.address" />
        <div class="text-center text-gray-100 bg-red-900 border border-red-500 rounded p-3">
            Keep in mind that replies, and threads that are created may take some time to populate. Server infrastructure will improve at a later date.
        </div>
        <div
            v-if="forum.content"
            v-for="(thread, index) in threadsByDate"
            class="flex flex-col rounded overflow-hidden text-wrap box-border p-6 bg-gray-900 gap-3 border border-gray-700 md:flex-row"
            :key="index"
        >
            <div class="flex flex-col gap-3 grow pr-6">
                <div class="flex flex-row w-full gap-6 flex-wrap justify-center md:flex-nowrap md:justify-start">
                    <Avatar
                        :hash="thread.messages[0].author"
                        :size="32"
                        class="size-14 rounded-full border-2 border-gray-700"
                    />
                    <div class="flex flex-col gap-2 grow text-wrap break-all w-full text-center md:text-left">
                        <div class="text-gray-50 font-bold">{{ forum.getThreadTitle(thread.hash) }}</div>
                        <code class="w-full flex items-center justify-center md:justify-start text-xs text-gray-500">
                            BY: {{ thread.messages[0].author }}
                        </code>
                        <div class="flex flex-row h-full text-gray-400 justify-center md:justify-start">
                            {{ forum.getMessageContent(thread.hash, thread.messages[0].hash) }}
                        </div>
                    </div>
                </div>
                <div class="flex flex-col gap-3">

                    <div
                        class="flex flex-row gap-3 text-gray-600 items-center justify-between w-full text-wrap break-all md:pl-20 flex-wrap md:flex-nowrap"
                    >
                        <!-- Replies -->
                        <div class="flex flex-row gap-2 items-center select-none text-xs w-full grow flex-wrap justify-center text-center md:flex-nowrap md:justify-start md:text-left">
                            <IconReplies />
                            <span>
                                {{ thread.messages.length - 1 }}
                            </span>
                        </div>
                        <!-- Timestamp / Updated -->
                        <div class="text-sm text-center w-full select-none md:text-right">
                            Updated {{ new Date(thread.updated).toLocaleString() }}
                        </div>
                    </div>
                    <div class="flex flex-row w-full text-gray-600 text-xs text-wrap break-all md:pl-20 flex-wrap md:flex-nowrap">
                        <code class="w-full flex items-center justify-center md:justify-end text-center">
                            ID: {{ thread.hash }}
                        </code>
                    </div>
                </div>
            </div>
            <div class="flex h-full  justify-center items-center border-t pt-4 border-gray-800 cursor-pointer hover:text-gray-400 md:border-l md:pt-0 md:pl-6 md:border-t-0" @click="goTo(thread.hash)">
                <IconChevronRight class="size-8" />
            </div>
        </div>
        
    </div>
</template>
