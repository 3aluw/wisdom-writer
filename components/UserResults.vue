
<template>
    <div class="px-4">
        <div class="stats flex justify-between gap-4 flex-wrap ">
            <p>accuracy : <span :class="accuracyClass">{{ props.resObj.accuracy }}%</span> </p>
            <p>WPM: <span :class="WPMClass">{{ props.resObj.WPM }}</span></p>
        </div>
        <p class="mt-4"> You had typed {{ props.resObj.quoteLength }} characters in {{ props.resObj.duration }} s</p>
    </div>
</template>
<script setup>
const props = defineProps(["resObj"])


const accuracyClass = computed(() => {
    const accuracy = props.resObj.accuracy
    return accuracy < 30 ? "red" : accuracy < 70 ? "orange" : accuracy < 90 ? "yellow" : "green"
})
const WPMClass = computed(() => {
    const WPM = props.resObj.WPM
    return WPM < 15 ? "red" : WPM < 20 ? "orange" : WPM < 30 ? "yellow" : "green"
})
</script>
<style scoped>
p {
    font-family: "Inter" "Lucida Sans" "Ariel";
    font-size: 2.5rem;
}

.red {
    color: #d63838;
}

.orange {
    color: rgb(253, 196, 90);
}

.yellow {
    color: #f3f350;
}

.green {
    color: #348d34;
}
</style>