<script lang="ts" setup>
import { useRouter } from 'vue-router';
import { useWallet } from '../composables/useWallet';
import Avatar from './Avatar.vue';

const router = useRouter();
const wallet = useWallet();
</script>

<template>
    <div class="flex bg-gray-900 w-full items-center justify-center h-[75px] border-b border-gray-800">
        <div class="px-3 flex justify-between items-center w-full max-w-[1280px]">
            <div class="flex flex-col hover:text-gray-400 cursor-pointer select-none" @click="router.push('/')">
                <div class="text-xl font-bold">0xForum - AtomOne</div>
                <span class="text-xs text-gray-400">A Decentralized Forum for AtomOne</span>
            </div>
            <div
                class="cursor-pointer hover:opacity-50 border p-3 rounded border-gray-700 bg-gray-800 w-40 text-center"
                v-if="!wallet.state.address"
                @click="wallet.connect"
            >
                Connect Wallet
            </div>
            <div
                class="flex flex-row gap-3 items-center justify-center cursor-pointer hover:opacity-50 border p-3 rounded border-gray-700 bg-gray-800 w-40 text-center"
                v-else
                @click="wallet.disconnect"
            >
                <Avatar :hash="wallet.state.address" class="size-6 rounded-full" />
                <span>Disconnect</span>
            </div>
        </div>
    </div>
</template>
