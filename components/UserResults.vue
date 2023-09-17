
<template>
    <div class="px-4">
        <div class="stats flex justify-between gap-4 flex-wrap ">
            <p>accuracy : {{ props.resObj.accuracy }}%</p>
            <p>WPM: {{ props.resObj.WPM }}</p>
        </div>
        <p class="mt-4"> You had typed {{ props.resObj.quoteLength }} characters in {{ props.resObj.duration }} s</p>
    </div>
</template>
<script setup>
const props = defineProps(["resObj"])

</script>
<style scoped>
p {
    font-family: "Inter" "Lucida Sans" "Ariel";
    font-size: 2.5rem;
}
</style>