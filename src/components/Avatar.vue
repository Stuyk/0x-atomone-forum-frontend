<script lang="ts" setup>
const props = defineProps<{ hash: string }>();
</script>

<template>
    <img :src="`https://api.dicebear.com/9.x/thumbs/svg?seed=${props.hash}&backgroundColor=transparent`" alt="avatar" class="bg-gray-800" />
</template>
