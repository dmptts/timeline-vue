<script setup lang="ts">
import { DxButton, DxDateBox } from 'devextreme-vue';
import { DxDateBoxTypes } from "devextreme-vue/date-box"
import { ref, watch } from 'vue';
import Timeline from './Timeline.vue';

const { startDate, endDate, selectedDate } = defineProps<{
  startDate?: Date | null;
  endDate?: Date | null;
  selectedDate?: Date | null;
}>()

const _startDate = ref<Date>(startDate ?? (() => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - 3);
  return date;
})())
const _endDate = ref<Date>(endDate ?? (() => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + 4);
  return date;
})());
const _selectedDate = ref<Date | null>(selectedDate ?? null);

const onButtonClick = () => {
  const newDate = _selectedDate.value ? new Date(_selectedDate.value) : new Date(_startDate.value);
  newDate.setDate(newDate.getDate() + 1);
  _selectedDate.value = newDate;
};

watch(
    () => startDate,
    (newStartDate) => {
      if (newStartDate) {
        console.log('Start date updated:', newStartDate);
        _startDate.value = newStartDate;
      }
    }
);

watch(
    () => endDate,
    (newEndDate) => {
      if (newEndDate) {
        console.log('End date updated:', newEndDate);
        _endDate.value = newEndDate;
      }
    }
);
</script>
<template>
  <Timeline :start-date="_startDate" :end-date="_endDate" v-model:selectedDate="_selectedDate"/>
  <div class="container">
    <DxButton text="add Day" @click="onButtonClick"/>
    <DxDateBox
        width="300"
        :value="_startDate"
        label="Дата начала"
        display-format="dd.MM.yyyy"
        @value-changed="(e: DxDateBoxTypes.ValueChangedEvent) => _startDate = e.value"
    />
    <DxDateBox
        width="300"
        :value="_endDate"
        label="Дата конца"
        display-format="dd.MM.yyyy"
        @value-changed="(e: DxDateBoxTypes.ValueChangedEvent) => _endDate = e.value"
    />
  </div>
</template>

<style scoped>
</style>