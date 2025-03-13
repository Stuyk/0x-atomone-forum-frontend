<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { useWallet } from '../composables/useWallet';
import Avatar from './Avatar.vue';

const router = useRouter();
const wallet = useWallet();
</script>

<template>
    <div class="flex bg-neutral-900 w-full items-center justify-center h-[75px]">
        <div class="p-6 flex justify-between items-center w-full max-w-[1280px]">
            <div class="text-2xl font-bold select-none grow cursor-pointer hover:opacity-50" @click="router.push('/')">
                0xForum - AtomOne
            </div>
            <div class="cursor-pointer hover:opacity-50" v-if="!wallet.state.address" @click="wallet.connect">
                Connect Keplr
            </div>
            <div
                class="flex flex-row gap-2 items-center cursor-pointer hover:opacity-50"
                v-else
                @click="wallet.disconnect"
            >
                <Avatar v-model="wallet.state.address" />
                <span>Disconnect</span>
            </div>
        </div>
    </div>
</template>
