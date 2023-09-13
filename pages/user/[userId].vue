<template>
    game page
</template>
<script setup lang="ts" >
//const userStore = useUserStore()
const runtimeConfig = useRuntimeConfig()
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
const client = new ConvexHttpClient(runtimeConfig.public.CONVEX_URL);

const route = useRoute();

onMounted(() => retrieveUser())

const retrieveUser = async () => {
    const idFromPath = route.fullPath.match(/[^_]+$/)
    if (Array.isArray(idFromPath)) {
        const userId = idFromPath[0]
        const user = await client.query(api.user.getUserById, { userId: userId })
        //    user ? userStore.user = user : await navigateTo("/");
    } else {
        await navigateTo("/")
    }
}
</script>