<template>
    <div class="cont flex flex-col items-center justify-evenly py-8">
        <div class="text-center">
            <h1>👋 Hi there
            </h1>
            <p>How fast is your typing today ?</p>
        </div>

        <div class="flex gap-6 flex-wrap">
            <NuxtLink to="user/demo_1"><v-btn color="#3DF5E5" variant="outlined">Demo</v-btn> </NuxtLink>

            <div class="dialog-cont">
                <v-dialog v-model="newUserDialog" theme="dark">
                    <template v-slot:activator="{ props }">
                        <v-btn v-bind="props" color="#3DF5E5" class="text-black" v-if="!userLinkLocalStorage.length">Get
                            started</v-btn>
                    </template>

                    <v-card class="px-2 py-2">
                        <div class="mb-2">
                            chose a username
                            <v-text-field label="chose a unique username" hide-details="auto"
                                v-model="username"></v-text-field>

                        </div>

                        chose some themes (5 at least):
                        <div class="checkboxes-cont pr-12  grid grid-cols-2 md:grid-cols-3">
                            <v-checkbox class="checkbox" v-for="category in textCategories" v-model="chosenCategories"
                                :value="category" hide-details>{{ category
                                }}</v-checkbox>
                        </div>
                        <v-card-actions>
                            <v-btn color="primary" block @click="createUser">start the app</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                <v-btn color="#3DF5E5" class="text-black" v-if="userLinkLocalStorage.length"
                    @click="router.push(userLinkLocalStorage)">Continue </v-btn>
            </div>

        </div>

        <div class="howto-cont flex flex-col gap-4 items-center ">
            <div class="step">Ai will give you a text to type</div>
            <div class="step">type it and track your development </div>
            <div class="step">remember that <strong>consistency</strong> is the 🔑</div>
        </div>


    </div>
</template>
<script setup lang="ts" >
const runtimeConfig = useRuntimeConfig()
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
const client = new ConvexHttpClient(runtimeConfig.public.CONVEX_URL);
const router = useRouter()
import { useStorage } from '@vueuse/core';

let userLinkLocalStorage: Ref<string> = useStorage('userLinkLocalStorage', '')

const newUserDialog = ref(false)
const username = ref('')
const textCategories = [
    "Inspirational",
    "Motivational",
    "Love",
    "Life",
    "Happiness",
    "Success",
    "Friendship",
    "Wisdom",
    "Positive Thinking",
    "Change",
    "Courage",
    "Hope",
    "Family",
    "Nature",
    "Creativity",
    "Art",
    "Travel",
    "Knowledge",
    "Time",
    "Gratitude",
    "discipline",
    "diligence",
    "news report",
    "simple essay"
];
const chosenCategories: Ref<string[]> = ref([])


const createUser = async () => {
    if (!username.value.length || chosenCategories.value.length < 3) return
    const userId = await client.mutation(api.user.createUser, { username: username.value, preferences: [...chosenCategories.value] })

    const userLinkParam = `${username.value}_${userId}`
    userLinkLocalStorage.value = `/user/${userLinkParam}`
    router.push(`/user/${userLinkParam}`)
}
</script>
<style scoped>
.cont {
    background-color: #3c433d;
    min-height: 100vh;
    font-family: "inter", Arial, Helvetica, sans-serif;
    color: white;
    justify-content: space-between;
    background-color: #232323;
    opacity: 1;
    background: repeating-linear-gradient(-45deg, #244554, #244554 17.5px, #232323 17.5px, #232323 87.5px);
}

h1 {
    color: #00cbc9;
    font-family: "Lucida Sans", "inter", Arial, Helvetica, sans-serif;
    font-size: 3rem;
}

.step {
    background: #C0FCF9;
    border-radius: 3.0625rem;
    padding: 1rem;
    width: max-content;
    color: black;
}

.step:nth-child(3) {
    font-size: 1.2rem;
}

.step:nth-child(2) {
    font-size: 1.1rem;
}

.step:nth-child(1) {
    font-size: 1rem;
}

.checkbox {
    justify-self: flex-end;

}
</style>
<style>
.v-selection-control__wrapper {
    justify-content: flex-end !important;
}
</style>