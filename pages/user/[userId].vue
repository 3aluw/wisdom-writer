<template>
    <section class="flex items-center">
        <v-progress-linear v-model="charsLeft" max="200"></v-progress-linear>
        <div class="typing-cont relative w-full">
            <p class=" opacity-40 text-xl px-4">{{ quote }}</p>
            <div class="example-hider"></div>
            <textarea class="absolute w-full h-full text-xl px-4" :disabled="disableTextarea"
                @keyup.once="timeObj.setStart()" v-model="writtenQuote"></textarea>
        </div>

    </section>
    <section>
        <div class="w-full md:w-5/12">
            <ClientOnly>
                <apexchart width="100%" type="line" :options="ordersChartOptions" :series="orderSeries"></apexchart>
            </ClientOnly>
        </div>
    </section>
</template>
<script setup lang="ts" >
import { useUserStore } from "~/store/userStore"
const userStore = useUserStore()
const runtimeConfig = useRuntimeConfig()
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
const client = new ConvexHttpClient(runtimeConfig.public.CONVEX_URL as string);
const route = useRoute();

//handle user
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

//handle The text
const disableTextarea = ref(false)
const quote = "I'm selfish, impatient and a little insecure. I make mistakes, I am out of control and at  times hard to handle. But if you can't handle me at my worst, then you sure as hell don't deserve me at my best."
const writtenQuote = ref('')

const charsLeft = computed(() => {
    const charsLeft = quote.length - writtenQuote.value.length;
    if (charsLeft <= 0) {
        timeObj.setEnd();
        todaysResults.value.accuracy = calculateAccuracy()
        todaysResults.value.duration = timeObj.calculateDifference()
        todaysResults.value.WPM = calculateWPM(todaysResults.value.duration)
    }
    return charsLeft;
})

//handle timing
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

        return (this.end.getTime() - this.start.getTime()) / 1000
    }
}
//handle accuracy 
const calculateAccuracy = () => {
    let differences = 0;
    for (let i = 0; i < quote.length; i++) {
        if (quote[i] !== writtenQuote.value[i]) {
            differences++;
        }
    }
    return 100 - (differences * 100) / quote.length;
}

const calculateWPM = (duration: number) => {
    return (quote.length / 5) / (duration / 60)
}
const todaysResults = ref({
    duration: 0,
    WPM: 0,
    accuracy: 0
})


//second section logic
const ordersChartOptions = ref({
    colors: ['#009DFF'],
    chart: {
        id: "orders-chart",
        toolbar: {
            show: false,
        }
    },
    xaxis: {
        type: "datetime"
    },
    stroke: {
        curve: 'smooth',
    },
    markers: {
        size: 5,
    },
    title: {
        text: "Your CPM tracker",
    },
    fill: {
        colors: ['black', '#E91E63', '#9C27B0']
    }
})


const orderSeries = ref([
    {
        name: "orders",
        data: [
            { x: 10 / 12 / 2023, y: 5 },
            { x: 11 / 12 / 2023, y: 5 },
            { x: 12 / 12 / 2023, y: 5 },
        ],
    }
])
</script>
<style scoped>
section {
    min-height: 100vh;
}

.typing-cont {
    font-family: 'Ubuntu Mono', monospace;
}

.example-hider {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: transparent;
    z-index: 5;
}

textarea {
    resize: none;
    outline: none;
    top: 0;
    left: 0;
}

.v-progress-linear {
    position: absolute;
}
</style>