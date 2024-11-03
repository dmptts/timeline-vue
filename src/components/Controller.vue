<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { fetchTimestamps } from '../api.ts';
import { Timestamps } from '../types.ts';
import TimelinePlayer from './TimelinePlayer.vue';

const timestamps = ref<[Date, string][] | null>(null);
const startDate = computed(() => timestamps.value ? new Date(timestamps.value[0][0]) : null);
const endDate = computed(() => timestamps.value ? new Date(timestamps.value[timestamps.value.length - 1][0]) : null);

function transformToDateUrlTupleArray(data: Timestamps): [Date, string][] {
  const dateUrlTupleArray: [Date, string][] = [];

  for (const [date, times] of Object.entries(data)) {
    for (const [time, details] of Object.entries(times)) {
      // Преобразуем дату и время в объект Date
      const dateTime = new Date(`${date}T${time}`);
      dateUrlTupleArray.push([dateTime, details.gisUrl]);
    }
  }

  return dateUrlTupleArray;
}

const getTimestamps = async () => {
  try {
    timestamps.value = transformToDateUrlTupleArray(await fetchTimestamps());
  } catch (error) {
    console.error('Error');
  }
}

onMounted(() => {
  getTimestamps();
})
</script>

<template>
  <TimelinePlayer :end-date="endDate" :start-date="startDate"/>
</template>

<style scoped>

</style>