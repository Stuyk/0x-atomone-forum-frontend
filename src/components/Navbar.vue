<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { useWallet } from '../composables/useWallet';
import Avatar from './Avatar.vue';

const router = useRouter();
const wallet = useWallet();
</script>

<template>
    <div class="flex bg-gray-900 w-full items-center justify-center h-[75px] border-b border-gray-800">
        <div class="p-6 flex justify-between items-center w-full max-w-[1280px]">
            <div class="flex flex-col hover:text-gray-400 cursor-pointer select-none" @click="router.push('/')">
                <div class="text-2xl font-bold">0xForum - AtomOne</div>
                <span class="text-xs text-gray-400">A Decentralized Forum for AtomOne</span>
            </div>
            <div class="cursor-pointer hover:opacity-50" v-if="!wallet.state.address" @click="wallet.connect">
                Connect Keplr
            </div>
            <div
                class="flex flex-row gap-2 items-center cursor-pointer hover:opacity-80 hover:text-gray-400"
                v-else
                @click="wallet.disconnect"
            >
                <span>Disconnect</span>
                <Avatar :hash="wallet.state.address" :size="32" class="size-10 rounded-full" />
            </div>
        </div>
    </div>
</template>
