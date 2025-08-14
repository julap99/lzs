<script setup>
import { DateTime } from "luxon";

const props = defineProps({
  events: {
    type: Array,
    default: () => [],
  },
});

const dateNow = ref(DateTime.now());
const arrDate = ref([]);

const dayInWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const monthInYear = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const label = (date) => {
  //   console.log(date.toString());
  return date.toFormat("d");
};

const nextMonth = () => {
  dateNow.value = DateTime.local(
    dateNow.value.year,
    dateNow.value.month,
    dateNow.value.day
  ).plus({
    months: 1,
  });
};

const prevMonth = () => {
  dateNow.value = DateTime.local(
    dateNow.value.year,
    dateNow.value.month,
    dateNow.value.day
  ).minus({
    months: 1,
  });
};

const getDateInMonth = () => {
  const date = DateTime.local(dateNow.value.year, dateNow.value.month);
  const dayInMonth = date.daysInMonth;

  arrDate.value = [];

  for (let i = 0; i < dayInMonth; i++) {
    const day = i + 1;
    const date = DateTime.local(dateNow.value.year, dateNow.value.month, day);
    const toDay = date.toFormat("ccc");
    // Start of the Date
    if (i == 0) {
      const toDayIndex = dayInWeek.indexOf(toDay);

      for (let i = 0; i < toDayIndex; i++) {
        const dayBefore = toDayIndex - i;
        const dateBefore = date.minus({ days: dayBefore });

        updateArrDate(dateBefore, false, false);
      }
      if (DateTime.now().toISODate() == date.toISODate())
        updateArrDate(date, true, true);
      else updateArrDate(date, true, false);
    }
    // End of the Date
    else if (i == dayInMonth - 1) {
      const toDayIndex = dayInWeek.length - dayInWeek.indexOf(toDay) - 1;

      if (DateTime.now().toISODate() == date.toISODate())
        updateArrDate(date, true, true);
      else updateArrDate(date, true, false);

      for (let i = 0; i < toDayIndex; i++) {
        const dayAfter = i + 1;
        const dateAfter = date.plus({ days: dayAfter });

        updateArrDate(dateAfter, false, false);
      }
    } else {
      if (DateTime.now().toISODate() == date.toISODate())
        updateArrDate(date, true, true);
      else updateArrDate(date, true, false);
    }
  }

  // console.log(arrDate.value);
};

const updateArrDate = (date, currentMonth, isToday) => {
  arrDate.value.push({
    date: date,
    isCurrentMonth: currentMonth,
    isToday: isToday,
    event: checkEvent(date),
  });
};

// Check props.event start and end date with date given
const checkEvent = (date) => {
  let result = false;
  props.events.forEach((event) => {
    if (event.startDate) {
      let startDate = "";
      let endDate = "";
      startDate = DateTime.fromISO(event.startDate);
      if (event.endDate) {
        endDate = DateTime.fromISO(event.endDate);
      }
      if (date.toISODate() == startDate.toISODate())
        result = [
          {
            position: "start",
            title: event.title,
          },
        ];
      else if (
        date.toISODate() > startDate.toISODate() &&
        date.toISODate() < endDate.toISODate()
      )
        result = [
          {
            position: "between",
            title: event.title,
          },
        ];
      else if (date.toISODate() == endDate.toISODate())
        result = [
          {
            position: "end",
            title: event.title,
          },
        ];
      else result = false;
    }
  });
  return result; // return result
};

onMounted(() => {
  getDateInMonth();
});

watch(dateNow, () => {
  getDateInMonth();
});
</script>

<template>
  <div class="calendar">
    <div class="calendar-header">
      <!-- <div class="flex">1</div> -->
      <div class="flex justify-between items-center my-4">
        <h5>
          {{ date.toFormat("LLLL yyyy") }}
        </h5>
        <div class="flex gap-5">
          <button
            @click="prevMonth"
            class="flex items-center px-2 py-2 rounded-md shadow-md bg-white text-primary hover:bg-primary/80 hover:text-white"
          >
            <Icon size="20px" name="ic:round-keyboard-arrow-left"></Icon>
          </button>
          <button
            @click="nextMonth"
            class="flex items-center px-2 py-2 rounded-md shadow-md bg-white text-primary hover:bg-primary/80 hover:text-white"
          >
            <Icon size="20px" name="ic:round-keyboard-arrow-right"></Icon>
          </button>
        </div>
      </div>
    </div>
    <div class="calendar-body rounded-md border border-primary/20">
      <div class="calendar-body-header max-w-full">
        <ul
          class="grid grid-cols-7 list-none bg-primary/50 text-primary rounded-t-md"
        >
          <li
            class="flex justify-center items-center p-5"
            v-for="(val, index) in dayInWeek"
            :key="index"
          >
            <span class="font-semibold text-base">{{ val }}</span>
          </li>
        </ul>
      </div>
      <div class="calendar-body-content">
        <ul class="grid grid-cols-7 list-none">
          <li
            class="relative flex justify-center items-center h-30 border border-primary/10 whitespace-nowrap"
            :class="{
              'bg-primary/5': val.isToday,
            }"
            v-for="(val, index) in allDate"
            :key="index"
          >
            <div class="flex-1">
              <label
                class="absolute top-2 right-3 font-semibold"
                :class="{
                  'text-primary/20': !val.isCurrentMonth,
                  'text-primary/70': val.isCurrentMonth,
                }"
                for="day"
                >{{ label(val.date) }}</label
              >
              <div class="event" v-if="val.event">
                <div
                  class="font-semibold p-5 bg-primary text-white rounded-md"
                  style="min-height: 5rem"
                  :class="{
                    'rounded-r-none ml-5': event.position === 'start',
                    'rounded-r-none rounded-l-none':
                      event.position === 'between',
                    'rounded-l-none mr-5': event.position === 'end',
                  }"
                  v-for="(event, index) in val.event"
                  :key="index"
                >
                  {{ event.position == "start" ? event.title : " " }}
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
