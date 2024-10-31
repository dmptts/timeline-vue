<script setup lang="ts">
import { DxTooltip } from 'devextreme-vue';
import { computed, ref, watch } from 'vue';

const { startDate, endDate, selectedDate } = defineProps({
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  selectedDate: {
    type: Date,
    default: null,
  },
});

const emit = defineEmits(['update:selectedDate']);

const timeline = ref<HTMLElement | null>(null);
const _selectedDate = ref<Date | null>(selectedDate);
const isCursorTooltipVisible = ref(false);
const isSelectedDateTooltipVisible = ref(false);
const tooltipDate = ref<Date | null>(null);
const cursorX = ref(0);

const onMouseMove = (e: MouseEvent) => {
  isCursorTooltipVisible.value = true;
  cursorX.value = calculateCursorTimelineX(e.clientX);
  tooltipDate.value = calculateTimeOnTimelinePosition(cursorX.value);
};

const onMouseLeave = () => {
  isCursorTooltipVisible.value = false;
};

const onClick = () => {
  _selectedDate.value = calculateTimeOnTimelinePosition(cursorX.value);
  emit('update:selectedDate', _selectedDate.value);

  if (_selectedDate.value) {
    isSelectedDateTooltipVisible.value = true;
  }
};

const calculateCursorTimelineX = (clientX: number) => {
  if (!timeline.value) return 0;

  const timelineRect = timeline.value.getBoundingClientRect();

  // Получаем положение курсора относительно таймлайна
  return clientX - timelineRect.left;
};

const calculateTimeOnTimelinePosition = (timelineX: number) => {
  if (!timeline.value) return null;

  const timelineWidth = timeline.value.getBoundingClientRect().width;

  // Получаем положение курсора относительно левого края таймлайна
  const percentage = timelineX / timelineWidth;

  // Вычисляем соответствующую дату
  const timeSpan = endDate.getTime() - startDate.getTime();
  return new Date(startDate.getTime() + percentage * timeSpan);
};

const calculateTimelinePositionOnTime = (date: Date) => {
  if (date.getTime() < startDate.getTime() || date.getTime() > endDate.getTime()) return;

  // Полная длительность таймлайна в миллисекундах
  const timelineDuration = endDate.getTime() - startDate.getTime();

  // Длительность от начала таймлайна до целевой даты в миллисекундах
  const timeSinceStart = date.getTime() - startDate.getTime();

  // Отступ слева от начала таймлайна в процентах
  return (timeSinceStart / timelineDuration) * 100;
};

function formatDate(date: Date, withTime: boolean = false) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return withTime ? `${day}.${month}.${year} ${hours}:${minutes}` : `${day}.${month}.${year}`;
}

const cursorTooltipPosition = computed(() => ({
  my: 'bottom',
  at: 'top left',
  offset: `${cursorX.value} 0`,
}));

const selectedDateTooltipPosition = computed(() => {
  if (!timeline.value || !_selectedDate.value) return null;

  const timelineWidth = timeline.value.getBoundingClientRect().width;
  const datePosition = calculateTimelinePositionOnTime(_selectedDate.value);

  if (!datePosition) return null;

  return ({
    my: 'bottom',
    at: 'top left',
    offset: `${timelineWidth * datePosition / 100} 0`,
  });
});

const labelDates = computed(() => {
  const result: Date[] = [];
  const currentDate = new Date(startDate);
  currentDate.setHours(0, 0, 0, 0);

  while (currentDate.getTime() < endDate.getTime()) {
    if (currentDate.getTime() >= startDate.getTime()) {
      result.push(new Date(currentDate)); // Добавляем копию текущей даты
    }
    currentDate.setDate(currentDate.getDate() + 1); // Переходим на следующий день
  }

  return result;
});

const timelineGradient = computed(() => {
  if (!_selectedDate.value) return `linear-gradient(to right, #F9DB99 0, #5F6062 0)`;

  return `linear-gradient(to right, #F9DB99 ${calculateTimelinePositionOnTime(_selectedDate.value)}%, #5F6062 ${calculateTimelinePositionOnTime(_selectedDate.value)}%)`;
});

watch(
    () => selectedDate,
    (newValue) => {
      if (newValue.getTime() < startDate.getTime() || newValue.getTime() > endDate.getTime()) return;
      _selectedDate.value = newValue;
      emit('update:selectedDate', newValue);
    },
);
</script>

<template>
  <div class="container">
    <div ref="timeline" id="timeline" class="timeline" @mousemove="onMouseMove" @mouseleave="onMouseLeave"
         @click="onClick" :style="{ background: timelineGradient }">
      <div
          v-for="(date, index) in labelDates"
          :key="index"
          :class="{
            'timeline-label': true,
            'timeline-label--with-line': date.getTime() !== startDate.getTime(),
            'timeline-label--past-date': _selectedDate && date.getTime() < _selectedDate?.getTime()
          }"
          :style="{ left: `calc(${calculateTimelinePositionOnTime(new Date(date))}% + 5px)` }"
      >
        {{ formatDate(date) }}
      </div>
      <div class="current-time-mark" :style="{ left: `${calculateTimelinePositionOnTime(new Date())}%`}"></div>
    </div>
    <DxTooltip
        target="#timeline"
        :visible="isCursorTooltipVisible"
        :position="cursorTooltipPosition"
    >
      <template #content>
        {{ tooltipDate && formatDate(tooltipDate, true) }}
      </template>
    </DxTooltip>
    <DxTooltip
        target="#timeline"
        :visible="isSelectedDateTooltipVisible"
        :position="selectedDateTooltipPosition"
        :hide-on-outside-click="false"
    >
      <template #content>
        {{ _selectedDate && formatDate(_selectedDate, true) }}
      </template>
    </DxTooltip>
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  margin: 20px auto;
  text-align: center;
}

.timeline {
  position: relative;
  width: 100%;
  height: 8px;
  background: linear-gradient(to right, #F9DB99 0, #5F6062 0);
  border-radius: 4px;
  margin-top: 20px;
  cursor: pointer;
}

.current-time-mark {
  position: absolute;
  top: -2px;
  width: 12px;
  height: 12px;
  background: #FE3D3D;
  border-radius: 50%;

  &::before {
    position: absolute;
    top: -5px;
    left: 50%;
    content: '';
    width: 1px;
    height: 22px;
    background: #FE3D3D;
    transform: translateX(-50%);
  }
}

.timeline-label {
  position: absolute;
  bottom: -25px;
  font-size: 12px;
  color: #333;
}

.timeline-label--with-line::before {
  position: absolute;
  top: -7px;
  bottom: 0;
  left: -5px;
  content: '';
  width: 1px;
  background-color: #333
}

.timeline-label--past-date {
  color: #F9DB99;

  &::before {
    background-color: #F9DB99;
  }
}
</style>
