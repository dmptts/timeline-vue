<script setup lang="ts">
import { DxButton, DxDateBox } from 'devextreme-vue';
import { DxDateBoxTypes } from "devextreme-vue/date-box"
import { ref } from 'vue';
import Timeline from './Timeline.vue';

const startDate = ref<Date>((() => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - 3);
  return date;
})())
const endDate = ref<Date>((() => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + 4);
  return date;
})());
const selectedDate = ref<Date>();

const onButtonClick = () => {
  const newDate = selectedDate.value ? new Date(selectedDate.value) : new Date(startDate.value);
  newDate.setDate(newDate.getDate() + 1);
  selectedDate.value = newDate;
};
</script>
<template>
  <Timeline :start-date="startDate" :end-date="endDate" v-model:selectedDate="selectedDate"/>
  <div class="container">
    <DxButton text="add Day" @click="onButtonClick"/>
    <DxDateBox
        width="300"
        :value="startDate"
        label="Дата начала"
        display-format="dd.MM.yyyy"
        @value-changed="(e: DxDateBoxTypes.ValueChangedEvent) => startDate = e.value"
    />
    <DxDateBox
        width="300"
        :value="endDate"
        label="Дата конца"
        display-format="dd.MM.yyyy"
        @value-changed="(e: DxDateBoxTypes.ValueChangedEvent) => endDate = e.value"
    />
  </div>
</template>

<style scoped>
</style>