<script lang="ts" setup>
import { ref } from 'vue';
import { useWallet } from '../composables/useWallet';

const MAX_CONTENT_LENGTH = 180;

const props = defineProps<{ thread: string }>();

const content = ref<string>('');
const isReplying = ref(false);

const wallet = useWallet();

async function replyThread() {
    if (content.value.length <= 0) {
        return;
    }

    const result = await wallet.actionReply(props.thread, content.value);
    if (!result) {
        alert('Failed to create Thread');
        return;
    }

    content.value = '';
    isReplying.value = false;
    alert('Created thread, give the forum time to update.');
}
</script>

<template>
    <!-- Modal Overlay -->
    <div
        v-if="isReplying"
        class="fixed inset-0 flex justify-center bg-[#000000aa] backdrop-blur-xs z-99 px-6 py-6"
    >
        <div class="flex flex-col gap-3 bg-gray-900 p-6 rounded border border-gray-700 w-full h-fit max-w-[1280px]">
            <div class="text-2xl">Reply</div>
            <!-- Helpful Info -->
            <div class="flex flex-col gap-3 text-sm text-left">
                <span>Reminder, everything you post on-chain will be on-chain forever. However, we reserve the right to hide posts.</span>
            </div>
            <!-- Content -->
            <div class="flex rounded bg-gray-950 relative mb-3">
                <div class="flex text-sm bg-gray-800 h-12 items-center justify-center rounded-l w-32 text-center">
                    Content
                </div>
                <input
                    class="bg-gray-950 p-3 outline-0 rounded text-white w-full"
                    placeholder="Content..."
                    type="text"
                    v-model="content"
                    :maxlength="MAX_CONTENT_LENGTH"
                />
                <div class="absolute right-0 bottom-2 pr-2 text-sm text-gray-500 select-none">
                    {{ content.length }}/{{ MAX_CONTENT_LENGTH }}
                </div>
            </div>
            <!-- Post Thread & Close Buttons -->
            <div class="flex justify-end gap-2">
                <button
                    class="text-gray-300 bg-gray-800 hover:text-gray-100 hover:bg-gray-700 rounded px-4 py-2 cursor-pointer border border-gray-700 w-32 text-center"
                    @click="isReplying = false"
                >
                    Cancel
                </button>
                <div
                    v-if="content.length >= 1"
                    class="text-gray-300 bg-gray-800 hover:text-gray-100 hover:bg-gray-700 rounded px-4 py-2 cursor-pointer border border-gray-700 w-32 text-center"
                    @click="replyThread"
                >
                    Submit
                </div>
                <div
                    v-else
                    class="text-gray-500 bg-gray-800 rounded px-4 py-2 cursor-not-allowed w-32 text-center"
                    @click="replyThread"
                >
                    Submit
                </div>
            </div>
        </div>
    </div>
    <div class="">
        <div
            v-if="wallet && wallet.state.address"
            class="text-gray-300 bg-gray-800 hover:text-gray-100 hover:bg-gray-700 rounded p-3 select-none cursor-pointer text-center border border-gray-700"
            @click="isReplying = true"
        >
            Reply
        </div>
    </div>
</template>
