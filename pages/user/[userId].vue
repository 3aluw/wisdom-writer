<template>
    <div class="typing-cont relative "></div>
    <p class="absolute opacity-40">{{ quote }}</p>
    <div class="example-hider"></div>
    <textarea class="relative w-full h-full" @keyup.once="timeObj.setStart()" v-model="writtenQuote">
</textarea>
</template>
<script setup lang="ts" >
import { useUserStore } from "~/store/userStore"
const userStore = useUserStore()
const runtimeConfig = useRuntimeConfig()
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
const client = new ConvexHttpClient(runtimeConfig.public.CONVEX_URL);
const route = useRoute();


const demoMode = ref(false)
onMounted(() => retrieveUser())
const retrieveUser = async () => {
    if (route.fullPath.match(/demo_1/)) { demoMode.value = true; return }

    const idFromPath = route.fullPath.match(/[^_]+$/)
    if (Array.isArray(idFromPath)) {
        const userId = idFromPath[0]
        const user = await client.query(api.user.getUserById, { userId: userId })
        user ? userStore.user = user : await navigateTo("/");
    } else {
        await navigateTo("/")
    }
}

const quote = "I'm selfish, impatient and a little insecure. I make mistakes, I am out of control and at  times hard to handle. But if you can't handle me at my worst, then you sure as hell don't deserve me at my best."
const writtenQuote = ref('')

const charsLeft = computed(() => {
    return quote.length - writtenQuote.value.length
})

let timeObj = {
    start: new Date(),
    end: new Date(),
    setStart() {
        this.start = new Date()
    },
    setEnd() {
        this.end = new Date()
    },
    calculateDifference() {

        return this.start.valueOf() - this.end.valueOf()
    }
}

</script>
<style scoped>
.example-hider {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: transparent;
    z-index: 5;
}
</style>