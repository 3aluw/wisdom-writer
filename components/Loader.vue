<template>
    <div class="h-screen w-screen absolute flex flex-col gap-4 items-center justify-center cont">
        <v-progress-circular indeterminate color="green" :size="100" :width="10"></v-progress-circular>
        <p>Mr. Ai is thinking</p>
    </div>
</template>
<script setup></script>
<style scoped>
.cont {
    background-color: #1D1B1B;
    z-index: 10;
}

p {
    font-family: 'Ubuntu Mono', monospace;
    font-size: 1.5rem;
}
</style>