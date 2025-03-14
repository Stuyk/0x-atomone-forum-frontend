<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useForum } from './composables/useForum';
import Navbar from './components/Navbar.vue';

const forum = useForum();

async function update() {
    await forum.update();
    await forum.getAllProposals();
}

const isDoneUpdating = computed(() => {
    return forum.isUpdating.value == false;
})

onMounted(update);
</script>

<template>
    <div class="bg-neutral-950 h-screen w-screen overflow-hidden text-white flex flex-col items-center">
        <Navbar />
        <div class="flex flex-col w-full box-border overflow-y-auto h-[100vh - 75px] items-center" v-if="isDoneUpdating">
            <div class="flex flex-col w-full max-w-[1280px] box-border">
                <RouterView />
            </div>
        </div>
    </div>
</template>
