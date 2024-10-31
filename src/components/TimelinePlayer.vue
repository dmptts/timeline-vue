<script setup lang="ts">
import { DxButton } from 'devextreme-vue';
import { computed, ref } from 'vue';
import Timeline from './Timeline.vue';

const startDate = computed(() => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - 3);
  return date;
});
const endDate = computed(() => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + 4);
  return date;
});
const selectedDate = ref<Date>();

const onButtonClick = () => {
  const newDate = selectedDate.value ? new Date(selectedDate.value) : new Date(startDate.value);
  newDate.setDate(newDate.getDate() + 1);
  selectedDate.value = newDate;
};
</script>
<template>
  <Timeline :start-date="startDate" :end-date="endDate" v-model:selectedDate="selectedDate"/>
  <DxButton text="add Day" @click="onButtonClick"/>
</template>

<style scoped>

</style>