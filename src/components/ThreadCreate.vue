<script lang="ts" setup>
import { ref } from 'vue';
import { useWallet } from '../composables/useWallet';
import IconClose from './icons/IconClose.vue';
import { useForum } from '../composables/useForum';

const MAX_TITLE_LENGTH = 24;
const MAX_CONTENT_LENGTH = 180 - MAX_TITLE_LENGTH;

const title = ref<string>('');
const content = ref<string>('');
const isCreatingThread = ref(false);

const wallet = useWallet();
const forum = useForum();

async function createThread() {
    if (title.value.length <= 0 || content.value.length <= 0) {
        return;
    }

    const result = await wallet.actionCreateThread(title.value, content.value);
    if (!result) {
        alert('Failed to create Thread');
        return;
    }

    if (!forum.isLiveUpdating.value) {
        forum.toggleLiveMode();
    }

    content.value = '';
    title.value = '';
    isCreatingThread.value = false;
    alert('Created thread, give the forum time to update.');
}
</script>

<template>
    <!-- Modal Overlay -->
    <div
        v-if="isCreatingThread"
        class="fixed inset-0 flex justify-center bg-[#000000aa] backdrop-blur-xs z-99 px-6 py-6"
    >
        <div class="flex flex-col gap-3 bg-gray-900 p-3 rounded border border-gray-700 w-full h-fit max-w-[640px]">
            <div class="flex flex-row justify-between border-b items-center pb-3 mb-1 border-gray-700">
                <div class="text-xl font-bold">Create Thread</div>
                <IconClose
                    class="size-8 border rounded bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700 hover:cursor-pointer hover:text-gray-200"
                    @click="isCreatingThread = false"
                />
            </div>
            <!-- Helpful Info -->
            <div class="flex flex-col gap-3 text-sm text-left">
                <span
                    >You can use <code class="text-blue-400">proposal:id</code> as title, and content to pull proposal
                    id, and proposal description. ie. <code class="text-blue-400">proposal:2</code></span
                >
                <span
                    >Reminder, everything you post on-chain will be on-chain forever. However, we reserve the right to
                    hide posts.</span
                >
            </div>
            <!-- Title -->
            <div class="flex rounded bg-gray-950 relative items-center">
                <input
                    class="bg-gray-950 p-3 outline-0 rounded text-white w-full"
                    placeholder="Title"
                    type="text"
                    :maxlength="MAX_TITLE_LENGTH"
                    v-model="title"
                />
                <div class="absolute right-0 bottom-2 pr-2 text-sm text-gray-500 select-none">
                    {{ title.length }}/{{ MAX_TITLE_LENGTH }}
                </div>
            </div>
            <!-- Content -->
            <div class="flex rounded bg-gray-950 relative">
                <input
                    class="bg-gray-950 p-3 outline-0 rounded text-white w-full"
                    placeholder="Content"
                    type="text"
                    :maxlength="MAX_CONTENT_LENGTH"
                    v-model="content"
                />
                <div class="absolute right-0 bottom-2 pr-2 text-sm text-gray-500 select-none">
                    {{ content.length }}/{{ MAX_CONTENT_LENGTH }}
                </div>
            </div>
            <!-- Post Thread & Close Buttons -->
            <div class="flex justify-end gap-2 border-t pt-3 border-gray-700 text-sm">
                <button
                    class="text-gray-300 bg-gray-800 hover:text-gray-100 hover:bg-gray-700 rounded px-4 py-2 cursor-pointer border border-gray-700 w-32 text-center"
                    @click="isCreatingThread = false"
                >
                    Cancel
                </button>
                <div
                    v-if="title.length >= 1 && content.length >= 1"
                    class="text-gray-300 bg-gray-800 hover:text-gray-100 hover:bg-gray-700 rounded px-4 py-2 cursor-pointer border border-gray-700 w-32 text-center"
                    @click="createThread"
                >
                    Submit
                </div>
                <div
                    v-else
                    class="text-gray-500 bg-gray-800 rounded px-4 py-2 cursor-not-allowed w-32 text-center"
                    @click="createThread"
                >
                    Submit
                </div>
            </div>
        </div>
    </div>

    <!-- Create Thread Button -->
    <div class="flex flex-row w-full justify-end">
        <div
            v-if="wallet && wallet.state.address"
            class="text-gray-300 text-sm bg-gray-900 hover:text-gray-100 hover:bg-gray-800 rounded p-3 select-none cursor-pointer text-center border border-gray-700"
            @click="isCreatingThread = true"
        >
            Create Thread
        </div>
        <div v-else>
            <div class="text-gray-500 bg-gray-900 rounded p-3 select-none">Connect to Post a Thread</div>
        </div>
    </div>
</template>
