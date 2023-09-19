<template>
    <section class="flex items-center justify-center">
        <Loader v-if="showLoader" />
        <v-progress-linear v-model="charsLeft" max="200"></v-progress-linear>
        <div class="typing-cont relative w-full" v-if="!isTypingFinished">
            <p class=" opacity-40 text-xl px-4">{{ quote }}</p>
            <div class="example-hider"></div>
            <textarea class="absolute w-full h-full text-xl px-4" :disabled="isTypingFinished"
                @keyup.once="timeObj.setStart()" @keydown.enter.prevent v-model="writtenQuote"></textarea>
        </div>
        <UserResults v-if="isTypingFinished" :resObj="userResults" />
        <v-btn :disabled="!isTypingFinished" icon="mdi-arrow-down" color="#47817E" variant="outlined"
            class="!absolute bottom-2" href="#charts"> </v-btn>
    </section>
    <section v-if="isTypingFinished" id="charts">
        <div class="flex flex-wrap h-screen items-center justify-around">
            <div class="w-full md:w-5/12">
                <ClientOnly>
                    <apexchart width="100%" type="line" :options="WPMChartOptions" :series="WPMSeries"></apexchart>
                </ClientOnly>
            </div>
            <div class="w-full md:w-5/12">
                <ClientOnly>
                    <apexchart width="100%" type="line" :options="accuracyChartOptions" :series="accuracySeries">

                    </apexchart>
                </ClientOnly>
            </div>


        </div>
    </section>
</template>
<script setup lang="ts" >
import { useUserStore } from "~/store/userStore"
const userStore = useUserStore()
const runtimeConfig = useRuntimeConfig()
import { useStorage } from '@vueuse/core'
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
const client = new ConvexHttpClient(runtimeConfig.public.CONVEX_URL as string);
const route = useRoute();
const userLocalResults = useStorage('userLocalResults', { duration: 10, quoteLength: 203 })
const showLoader = ref(true)



//handle The text
let quote = "I'm selfish, impatient and a little insecure. I make mistakes, I am out of control and at  times hard to handle. But if you can't handle me at my worst, then you sure as hell don't deserve me at my best."
const generateQuote = async (isTest: boolean) => {
    if (isTest) {
        const response = await fetch('https://api.quotable.io/quotes/random?minLength=50') as any
        let json = await response.json()
        quote = json[0]["content"]
        showLoader.value = false
    }
}


//handle user
const demoMode = ref(false)

const userResultsHistory: Ref<{ WPM: number[], quality: number[] }> = ref({ WPM: [], quality: [] })
const retrieveUser = async () => {
    if (route.fullPath.match(/demo_1/)) {
        demoMode.value = true;
        generateQuote(true)
        userResultsHistory.value = userStore.demoResObject;
        return
    }
    const idFromPath = route.fullPath.match(/[^_]+$/)
    if (Array.isArray(idFromPath)) {
        const userId = idFromPath[0]
        const user = await client.query(api.user.getUserById, { userId: userId })
        user ? userStore.user = user : await navigateTo("/");
        createUserHistory(userStore.user._id);
    } else {

        await navigateTo("/")
    }

}
retrieveUser();




//handle user interactivity
const writtenQuote = ref('')
const isTypingFinished = ref(false)
const charsLeft = computed(() => {
    const charsLeft = quote.length - writtenQuote.value.length;
    if (charsLeft <= 0) handleTypingFinish()
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

        return Math.floor((this.end.getTime() - this.start.getTime()) / 1000)
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
    return Math.floor(100 - (differences * 100) / quote.length);
}

const calculateWPM = (duration: number) => {
    return Math.floor((quote.length / 5) / (duration / 60))
}
const userResults = ref({
    duration: 0,
    quoteLength: 0,
    WPM: 0,
    accuracy: 0
})

const createUserHistory = async (userId: string) => {
    const history = await client.query(api.user.getUserHistory, { userId })

    userResultsHistory.value.WPM = history.map((obj) => obj.WPM)
    userResultsHistory.value.quality = history.map((obj) => obj.accuracy)
    const datesObj = history.map((obj) => obj._creationTime) as number[]

    // check if the user used the app today show him the todays' results
    didUserTypeToday(history[0]._creationTime)
    generateSeriesData(datesObj)
}

const didUserTypeToday = (timestamp: number) => {
    const today = new Date().setHours(0, 0, 0, 0);
    const lastUseDate = new Date(timestamp).setHours(0, 0, 0, 0);
    if (today === lastUseDate) {
        //don't allow the user to type if he had today
        userResults.value.duration = userLocalResults.value.duration
        userResults.value.quoteLength = userLocalResults.value.quoteLength
        userResults.value.accuracy = userResultsHistory.value.quality.at(-1)!
        userResults.value.WPM = userResultsHistory.value.WPM.at(-1)!
        isTypingFinished.value = true;
    }
    showLoader.value = false
}
//handle typing finish 
const handleTypingFinish = () => {
    //calculate results & push new results to store
    timeObj.setEnd();
    userResults.value.duration = timeObj.calculateDifference()
    userResults.value.quoteLength = quote.length

    userResultsHistory.value.WPM.push(calculateWPM(userResults.value.duration))
    console.log('userResultsHistory: ', userResultsHistory);
    userResultsHistory.value.quality.push(calculateAccuracy())

    userResults.value.accuracy = userResultsHistory.value.quality.at(-1)!
    userResults.value.WPM = userResultsHistory.value.WPM.at(-1)!
    //finish typing and show results component
    isTypingFinished.value = true;


    //if it is not demo mode push the new results to convex / save duration and quote length to local storage as they are not saved on convex
    if (!demoMode.value) {
        insertNewResults(userResults.value.WPM, userResults.value.accuracy);
        userLocalResults.value.duration = userResults.value.duration
        userLocalResults.value.quoteLength = userResults.value.quoteLength
    }
    // generate charts
    generateSeriesData()
}

const insertNewResults = async (WPM: number, accuracy: number) => {
    const newResultId = await client.mutation(api.user.insertResult, { WPM, accuracy, userId: userStore.user._id })
}

//second section logic
const WPMSeriesData: Ref<{ x: string, y: number }[]> = ref([])
const accuracySeriesData: Ref<{ x: string, y: number }[]> = ref([])

const generateSeriesData = (datesObj?: number[]) => {
    if (demoMode.value) {
        const today = new Date();
        const day = new Date(today);
        userResultsHistory.value.WPM.forEach((WPMRes: number, index: number) => {
            const datetime = day.setDate(today.getDate() - (5 - index));
            const dateFormatter = new Intl.DateTimeFormat();
            const dateString = dateFormatter.format(datetime);
            WPMSeriesData.value.push({ x: dateString, y: WPMRes })
            //push to accuracySeries too
            accuracySeriesData.value.push({ x: dateString, y: userResultsHistory.value.quality[index] })
        })
    }
    else {
        userResultsHistory.value.WPM.forEach((WPMRes: number, index: number) => {
            const date = formatDate(datesObj![index])
            WPMSeriesData.value.push({ x: date, y: WPMRes })
            accuracySeriesData.value.push({ x: date, y: userResultsHistory.value.quality[index] })
        }
        )
        console.log('accuracySeriesData.value: ', accuracySeriesData.value);
    }
}
const formatDate = (date: number) => {
    const dateFormatter = new Intl.DateTimeFormat();
    const dateString = dateFormatter.format(date)
    return dateString
}

//WPM chart
const WPMChartOptions = ref({
    theme: { mode: 'dark', },
    colors: ['#1b9419'],
    chart: {
        id: "WPM-chart", background: 'transparent',
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
        size: 2,
    },
    title: {
        text: "Your WPM tracker",
    }
})
const accuracyChartOptions = ref({
    theme: { mode: 'dark', },
    colors: ['#f3f350'],
    chart: {
        id: "accuracy-chart", background: 'transparent',
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
        size: 2,
    },
    title: {
        text: "The quality of your typing (%)",
    },

})
const WPMSeries = ref([
    {
        name: "WPM",
        data: WPMSeriesData.value
    }
])
const accuracySeries = ref([
    {
        name: "accuracy",
        data: accuracySeriesData.value
    }
])
</script>
<style scoped>
section {
    min-height: 100vh;
    background-color: #1D1B1B;
    color: white;
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