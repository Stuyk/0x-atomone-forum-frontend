<script lang="ts" setup>
import { ref } from 'vue';
import { useWallet } from '../composables/useWallet';

const MAX_TITLE_LENGTH = 24;
const MAX_CONTENT_LENGTH = 180 - MAX_TITLE_LENGTH;

const title = ref<string>('');
const content = ref<string>('');
const isCreatingThread = ref(false);

const wallet = useWallet();

async function createThread() {
    if (title.value.length <= 0) {
        return;
    }

    if (content.value.length <= 0) {
        return;
    }

    const result = await wallet.actionCreateThread(title.value, content.value);
    if (!result) {
        alert('Failed to create Thread');
        return;
    }

    content.value = '';
    title.value = '';
    isCreatingThread.value = false;
}
</script>

<template>
    <div class="flex flex-col" v-if="isCreatingThread">
        <div class="flex flex-row w-full" v-if="wallet">
            <div v-if="wallet.state.address" class="flex flex-col w-full bg-neutral-900 p-3 gap-3 rounded-md">
                <!-- Title -->
                <div class="flex rounded-md bg-neutral-950 relative p-1">
                    <input
                        class="bg-neutral-950 p-3 outline-0 rounded-md text-white w-full"
                        placeholder="Title."
                        type="text"
                        :maxlength="MAX_TITLE_LENGTH"
                        v-model="title"
                    />
                    <div class="absolute right-0 bottom-2 pr-2 text-sm text-neutral-500 select-none">
                        {{ title.length }}/{{ MAX_TITLE_LENGTH }}
                    </div>
                </div>
                <!-- Content -->
                <div class="flex rounded-md bg-neutral-950 relative p-1">
                    <input
                        class="bg-neutral-950 p-3 outline-0 rounded-md text-white w-full"
                        placeholder="Type to start add content to thread..."
                        type="text"
                        :maxlength="MAX_CONTENT_LENGTH"
                        v-model="content"
                    />
                    <div class="absolute right-0 bottom-2 pr-2 text-sm text-neutral-500 select-none">
                        {{ content.length }}/{{ MAX_CONTENT_LENGTH }}
                    </div>
                </div>
                <!-- Post Thread -->
                <div
                    class="text-neutral-300 bg-neutral-800 hover:text-neutral-100 hover:bg-neutral-700 rounded-md p-3 select-none cursor-pointer text-center font-bold uppercase"
                    v-if="title.length >= 1"
                    @click="createThread"
                >
                    Post Thread
                </div>
                <div class="flex flex-col">
                    <strong>Additional Help</strong>
                    <div>You can put <code class="text-emerald-400">proposal:id</code> in the title, and content to pull proposal data from chain.</div>
                </div>
            </div>
            <div v-else class="flex flex-row w-full justify-end">
                <div class="text-neutral-500 bg-neutral-900 rounded-md p-3 select-none">Connect to Post a Thread</div>
            </div>
        </div>
    </div>
    <div class="flex flex-row w-full justify-end" v-else>
        <div 
            v-if="wallet && wallet.state.address"
            class="text-neutral-300 bg-neutral-800 hover:text-neutral-100 hover:bg-neutral-700 rounded-md p-3 select-none cursor-pointer text-center"
            @click="isCreatingThread = true"
        >
            Create Thread
        </div>
        <div v-else class="flex flex-row w-full justify-end">
            <div class="text-neutral-500 bg-neutral-900 rounded-md p-3 select-none">Connect to Post a Thread</div>
        </div>
    </div>
</template>
