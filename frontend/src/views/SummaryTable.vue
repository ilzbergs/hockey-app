<template>
  <SummaryTable :data="data"  />
</template>

<script setup lang="ts">
import SummaryTable from '../components/SummaryTable.vue'
import { usePredictionsStore, UserPrediction } from '../stores/predictionStore';
import { onMounted, ref } from 'vue'

const predictionStore = usePredictionsStore()
const data = ref<UserPrediction[]>([])
onMounted(async () => {
  data.value = await predictionStore.listAllUsersPredictions()
})

</script>
