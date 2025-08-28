import "@fullcalendar/core/vdom"; // solve problem with Vite
import FullCalendar from "@fullcalendar/vue3";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import scrollGrid from "@fullcalendar/scrollgrid";
import luxon2Plugin from "@fullcalendar/luxon2";

FullCalendar.options = {
  plugins: [
    interactionPlugin,
    dayGridPlugin,
    timeGridPlugin,
    listPlugin,
    scrollGrid,
    luxon2Plugin,
  ],
};

export default defineNuxtPlugin((/* nuxtApp */) => {
  return {
    provide: {
      FullCalendar,
    },
  };
});
