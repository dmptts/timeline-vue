<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { DxTooltip } from 'devextreme-vue';

  const { startDate, endDate } = defineProps({
    startDate: {
      type: Date,
      default: () => {
        const date = new Date();
        date.setHours(0, 0, 0, 0);
        date.setDate(date.getDate() - 3);
        return date;
      },
    },
    endDate: {
      type: Date,
      default: () => {
        const date = new Date();
        date.setHours(0, 0, 0, 0);
        date.setDate(date.getDate() + 4);
        return date;
      },
    },
  });

  const timeline = ref<HTMLElement | null>(null);
  const isTooltipVisible = ref(false);
  const tooltipDate = ref<Date | null>(null);
  const cursorX = ref(0);

  const onMouseMove = (e: MouseEvent) => {
    isTooltipVisible.value = true;
    cursorX.value = calculateCursorTimelineX(e.clientX);
    tooltipDate.value = calculateTimeOnTimelinePosition(cursorX.value);
  }

  const onMouseLeave = () => {
    isTooltipVisible.value = false;
  }

  const calculateCursorTimelineX = (clientX: number) => {
    if (!timeline.value) return 0;

    const timelineRect = timeline.value.getBoundingClientRect();

    // Получаем положение курсора относительно таймлайна
    return clientX - timelineRect.left;
  }

  const calculateTimeOnTimelinePosition = (timelineX: number) => {
    if (!timeline.value) return null;

    const timelineRect = timeline.value.getBoundingClientRect();
    const timelineWidth = timelineRect.width;

    // Получаем положение курсора относительно таймлайна
    const x = timelineX - timelineRect.left;
    const percentage = x / timelineWidth;

    // Вычисляем соответствующую дату
    const timeSpan = endDate.getTime() - startDate.getTime();
    return new Date(startDate.getTime() + percentage * timeSpan);
  }

  const calculateTimelinePositionOnTime = (date: Date) => {
    if (date.getTime() < startDate.getTime() || date.getTime() > endDate.getTime()) return;

    // Полная длительность таймлайна в миллисекундах
    const timelineDuration = endDate.getTime() - startDate.getTime();

    // Длительность от начала таймлайна до целевой даты в миллисекундах
    const timeSinceStart = date.getTime() - startDate.getTime();

    // Отступ слева от начала таймлайна в процентах
    return (timeSinceStart / timelineDuration) * 100;
  }

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
  })
</script>

<template>
  <div class="container">
    <div ref="timeline" id="timeline" class="timeline" @mousemove="onMouseMove" @mouseleave="onMouseLeave">
      <div
          v-for="(date, index) in labelDates"
          :key="index"
          class="timeline-label"
          :style="{ left: `calc(${calculateTimelinePositionOnTime(new Date(date))}% + 6px)` }"
      >
        {{ formatDate(date) }}
      </div>
      <div class="current-time-mark" :style="{ left: `${calculateTimelinePositionOnTime(new Date())}%`}"></div>
    </div>
    <DxTooltip
        target="#timeline"
        :visible="isTooltipVisible"
        :position="cursorTooltipPosition"
    >
      <template #content>
        {{ tooltipDate && formatDate(tooltipDate, true) }}
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
  background: #ddd;
  border-radius: 4px;
  margin-top: 20px;
  cursor: pointer;
}

.current-time-mark {
  position: absolute;
  top: -4px;
  width: 12px;
  height: 12px;
  background: red;
  border-radius: 50%;
}

.timeline-label {
  position: absolute;
  bottom: -25px;
  font-size: 12px;
  color: #333;

  &::before {
    position: absolute;
    top: -7px;
    bottom: 0;
    left: -3px;
    content: '';
    width: 1px;
    background-color: #333;
  }
}
</style>
