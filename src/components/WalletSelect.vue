<script lang="ts" setup>
import { watch } from 'vue';
import { useWallet } from '../composables/useWallet';
import IconChevronRight from './icons/IconChevronRight.vue';
import IconKeplrWallet from './icons/IconKeplrWallet.vue';
import IconClose from './icons/IconClose.vue';

const wallet = useWallet();

const emits = defineEmits<{ (e: 'onSelect'): void; (e: 'onCancel'): void }>();

watch(
    () => wallet.state.address,
    (_newValue, _oldValue) => {
        emits('onSelect');
    }
);
</script>

<template>
    <div class="flex flex-col gap-3 bg-gray-900 p-3 rounded border border-gray-700 w-full h-fit max-w-[640px]">
        <div class="flex flex-row justify-between border-b items-center pb-3 mb-1 border-gray-700">
            <div class="text-xl font-bold">Select Wallet</div>
            <IconClose
                class="size-8 border rounded bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700 hover:cursor-pointer hover:text-gray-200"
                 @click="emits('onCancel')"
            />
        </div>
        <div
            class="flex flex-row items-center justify-between gap-3 bg-gray-800 p-3 rounded border text-gray-300 hover:text-gray-100 border-gray-700 hover:bg-gray-700 hover:cursor-pointer"
            @click="wallet.connect"
        >
            <div class="flex flex-row gap-3">
                <IconKeplrWallet />
                <span>Keplr Wallet</span>
            </div>
            <IconChevronRight />
        </div>
    </div>
</template>
