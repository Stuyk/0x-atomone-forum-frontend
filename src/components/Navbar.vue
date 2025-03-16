<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useWallet } from '../composables/useWallet';
import Avatar from './Avatar.vue';
import WalletSelect from './WalletSelect.vue';

const router = useRouter();
const wallet = useWallet();

const isSelectingWallet = ref(false);
</script>

<template>
    <div
        v-if="isSelectingWallet"
        class="fixed inset-0 flex justify-center bg-[#000000aa] backdrop-blur-xs z-99 px-6 py-6"
    >
        <WalletSelect @onSelect="isSelectingWallet = false" @onCancel="isSelectingWallet = false" />
    </div>
    <div class="flex bg-gray-900 w-full items-center justify-center h-[75px] border-b border-gray-700 py-3 z-10">
        <div class="px-3 flex justify-between items-center w-full max-w-[1280px]">
            <div class="flex flex-col hover:text-gray-400 cursor-pointer select-none" @click="router.push('/')">
                <div class="text-xl font-bold">0xForum - AtomOne</div>
                <span class="text-xs text-gray-400">A Decentralized Forum for AtomOne</span>
            </div>
            <div
                class="flex flex-row gap-3 text-sm items-center justify-center cursor-pointer border p-3 rounded border-gray-700 bg-gray-800 hover:bg-gray-700 hover:text-gray-100 text-center"
                v-if="!wallet.state.address"
                @click="isSelectingWallet = true"
            >
                Connect Wallet
            </div>
            <div class="flex flex-row gap-3 items-center justify-center" v-else>
                
                <div
                    @click="wallet.disconnect"
                    class="flex flex-row gap-3 text-sm items-center justify-center cursor-pointer border p-3 rounded border-gray-700 bg-gray-800 hover:bg-gray-700 hover:text-gray-100 text-center"
                >
                    Disconnect
                </div>
                <Avatar :hash="wallet.state.address" class="size-12 rounded border border-gray-600" />
            </div>
        </div>
    </div>
</template>
