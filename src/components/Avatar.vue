<script lang="ts" setup>
import { hashicon } from '@emeraldpay/hashicon';
import { onMounted, ref } from 'vue';

const model = defineModel<string>();
const avatar = ref<HTMLElement | null>(null);

function addAvatar() {
    avatar.value?.appendChild(hashicon(model.value as string, { size: 32 }));
}

onMounted(addAvatar);
</script>

<template>
    <div class="avatar-wrapper" ref="avatar" />
</template>

<style scoped>
.avatar-wrapper {
    min-width: 32px;
    min-height: 32px;
    max-width: 32px;
    max-height: 32px;
}
</style>
