<script lang="ts" setup>
import { ref } from 'vue';
import { useWallet } from '../composables/useWallet';

const MAX_REPLY_LENGTH = 180;

const props = defineProps<{ thread: string }>();
const reply = ref<string>('');

const wallet = useWallet();

function createReply() {
    if (reply.value.length <= 0) {
        return;
    }

    const result = wallet.actionReply(props.thread, reply.value);
    if (!result) {
        alert('Failed to create reply');
        return;
    }

    reply.value = '';
    alert('Created reply, give the forum time to update.')
}
</script>

<template>
    <div class="flex flex-row w-full" v-if="wallet">
        <div v-if="wallet.state.address" class="flex flex-col w-full bg-neutral-900 p-3 gap-3 rounded-md">
            <div class="flex rounded-md bg-neutral-950 relative p-1">
                <input
                    class="bg-neutral-950 p-3 outline-0 rounded-md text-white w-full"
                    placeholder="Type to start replying to thread..."
                    type="text"
                    :maxlength="MAX_REPLY_LENGTH"
                    v-model="reply"
                />
                <div class="absolute right-0 bottom-2 pr-2 text-sm text-neutral-500 select-none">
                    {{ reply.length }}/{{ MAX_REPLY_LENGTH }}
                </div>
            </div>
            <div
                class="text-neutral-300 bg-neutral-800 hover:text-neutral-100 hover:bg-neutral-700 rounded-md p-3 select-none cursor-pointer text-center font-bold uppercase"
                v-if="reply.length >= 1"
                @click="createReply"
            >
                Reply
            </div>
        </div>
        <div v-else class="flex flex-row w-full justify-end">
            <div class="text-neutral-500 bg-neutral-900 rounded-md p-3 select-none">Connect to Reply</div>
        </div>
    </div>
</template>
