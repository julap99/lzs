<script setup>
import { useLayoutStore } from "~/stores/layout";
import { useWindowSize } from "vue-window-size";

const layoutStore = useLayoutStore();
const mobileWidth = layoutStore.mobileWidth;

const { width } = useWindowSize();
const windowWidth = ref(width);

const props = defineProps({
  field: {
    type: Array,
    default: () => [],
  },
  data: {
    type: Array,
    default: () => [],
  },
  basic: {
    type: Boolean,
    default: true,
  },
  advanced: {
    type: Boolean,
    default: false,
  },
  options: {
    type: Object,
    default: () => ({
      variant: "default",
      striped: false,
      bordered: false,
      borderless: false,
      hover: false,
    }),
  },
  optionsAdvanced: {
    type: Object,
    default: () => ({
      sortable: true,
      filterable: true,
      responsive: false,
      outsideBorder: false,
    }),
  },
  grid: {
    type: Boolean,
    default: false,
  },
  pageSize: {
    type: Number,
    default: 5,
  },
  sort: {
    type: Object,
    default: () => ({
      column: "",
      direction: "asc",
    }),
  },
});

// Default varaiable
const columnTitle = ref([]);
const dataTable = ref([]);
const dataTitle = ref([]);
const dataLength = ref(0);

// Advanced Option Variable
const currentSort = ref(0);
const currentSortDir = ref("asc");
const currentPage = ref(1);
const pageSize = ref(props.pageSize);
const maxPageShown = ref(3);

// Searching Variable
const keyword = ref("");

// Filtering Variable
const filter = ref([]);
const openFilter = ref(false);

const hideTable = ref(false);

// Other Variable
const sortColumnFirstTime = ref(false);

const isDesktop = computed(() => {
  return windowWidth.value >= mobileWidth ? true : false;
});

if (props.optionsAdvanced.responsive) {
  if (isDesktop.value) {
    hideTable.value = false;
  } else {
    hideTable.value = true;
  }
}

const camelCasetoTitle = (str, exclusions = []) => {
  if (exclusions.includes(str)) {
    return str.replace(/([A-Z])/g, " $1").trim();
  } else if (/\(.*\)/.test(str)) {
    return str; // if the string contains parentheses, return the original string
  } else {
    return str.replace(/([A-Z])/g, " $1").replace(/^./, (str) => {
      return str.toUpperCase();
    });
  }
};

const spacingCharactertoCamelCase = (array) => {
  // Loop array string and convert to camel case

  let result = [];

  array.forEach((element) => {
    if (element.charAt(0) == element.charAt(0).toUpperCase()) {
      // Camelcase the string and remove spacing
      // and if there is () in the string, do Uppercase inside the () and dont spacing it

      let camelCase = element
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => {
          return str.toUpperCase();
        })
        .replace(/\s/g, "");

      let resultCamelCase = camelCase.replace(/\(([^)]+)\)/, (str) => {
        return str.toUpperCase();
      });

      result.push(resultCamelCase);
    } else {
      result.push(element);
    }
  });

  // console.log(result);
  return result;
};

// watch props.data change and redo all the data
watch(
  () => [props.data, props.field],
  () => {
    if (props.data && props.data.length > 0) {
      dataTable.value = props.data;
      dataLength.value = props.data.length;
      if (props.field && props.field.length > 0) {
        columnTitle.value = spacingCharactertoCamelCase(props.field);
        dataTitle.value = spacingCharactertoCamelCase(props.field);
      } else {
        columnTitle.value = Object.keys(dataTable.value[0]);
        dataTitle.value = Object.keys(dataTable.value[0]);
      }
    } else {
      dataTable.value = [];
      dataLength.value = 0;
      columnTitle.value = [];
      dataTitle.value = [];
    }
  },
  { immediate: true }
);

const setColumnTitle = (data) => {
  try {
    if (props.field && props.field.length == 0) {
      columnTitle.value = Object.keys(data);
    } else {
      columnTitle.value = spacingCharactertoCamelCase(props.field);
    }
  } catch (error) {
    console.log(error);
  }
};

const filteredDatabyTitle = (data, title) => {
  let result = "";
  try {
    if (props.field && props.field.length == 0) {
      Object.entries(data).forEach(([key, value]) => {
        if (key === title) {
          result = value;
          return;
        }
      });
    } else {
      // Get index title from columnTitle
      let index = columnTitle.value.indexOf(title);

      // Convert data json to array
      let arr = Object.values(data);

      result = arr[index];
    }
    if (result === "" || result === null) result = "-";
    return result;
  } catch (error) {
    console.log(error);
    return "-";
  }
};

onMounted(() => {
  if (dataTable.value.length > 0) {
    setColumnTitle(dataTable.value[0]);
  }
});

// Computed data
const computedData = computed(() => {
  let result = [];
  let totalData = 0;
  result = dataTable.value
    .slice()
    .sort((a, b) => {
      let modifier = 1;

      columnTitle.value.forEach((title, index) => {
        // console.log(title, props.sort.column);
        // First sort by column title
        if (title === props.sort.column && !sortColumnFirstTime.value) {
          currentSort.value = index;
          currentSortDir.value = props.sort.direction;
          sortColumnFirstTime.value = true;
        }
      });

      // Check if column title is number or string and convert spacing to camelcase
      let a1 = filteredDatabyTitle(a, columnTitle.value[currentSort.value]);
      let b1 = filteredDatabyTitle(b, columnTitle.value[currentSort.value]);

      if (typeof a1 === "string") a1 = a1.toLowerCase();
      if (typeof b1 === "string") b1 = b1.toLowerCase();

      // Convert string to number if possible
      if (isNumeric(a1)) a1 = parseFloat(a1);
      if (isNumeric(b1)) b1 = parseFloat(b1);

      if (currentSortDir.value === "desc") modifier = -1;
      if (a1 < b1) return -1 * modifier;
      if (a1 > b1) return 1 * modifier;
      return 0;
    })
    .filter((row) => {
      // Search all json object if keyword not equal null
      if (keyword.value === "") return true;
      let result = false;
      Object.entries(row).forEach(([key, value]) => {
        try {
          if (
            value.toString().toLowerCase().includes(keyword.value.toLowerCase())
          ) {
            result = true;
            currentPage.value = 1;
          }
        } catch (error) {
          result = false;
        }
      });
      return result;
    })
    .filter((_, index) => {
      let start = (currentPage.value - 1) * pageSize.value;
      let end = currentPage.value * pageSize.value;
      totalData++;
      if (index >= start && index < end) return true;
    });
  dataLength.value = totalData;
  return result;
});

const isNumeric = (n) => {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

const totalEntries = computed(() => {
  return dataLength.value;
});

const sort = (index) => {
  if (index === currentSort.value) {
    currentSortDir.value = currentSortDir.value === "asc" ? "desc" : "asc";
  } else if (index !== currentSort.value && currentSortDir.value == "desc") {
    currentSortDir.value = "asc";
  }
  currentSort.value = index;
};

const pages = computed(() => {
  let totalPG = Math.ceil(dataLength.value / pageSize.value);
  const numShown = Math.min(maxPageShown.value, totalPG);
  let first = currentPage.value - Math.floor(numShown / 2);
  first = Math.max(first, 1);
  first = Math.min(first, totalPG - numShown + 1);
  return [...Array(numShown)].map((k, i) => i + first);
});

const totalPage = computed(() => {
  return Math.ceil(dataLength.value / pageSize.value);
});

const pageChange = (page) => {
  currentPage.value = page;
};

const nextPage = () => {
  if (currentPage.value * pageSize.value < dataLength.value)
    currentPage.value++;
};
const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const firstPage = () => {
  currentPage.value = 1;
};

const lastPage = () => {
  currentPage.value = totalPage.value;
};

const hideColumn = (key) => {
  if (!getFilter(key)) {
    // insert into filter variable to tell there is a change in filter
    setFilter(key, "hide", true);
  } else {
    // update filter variable to tell there is a change in filter
    setFilter(key, "hide", false);
  }
};

const setFilter = (key, action, condition) => {
  // Check if key exist inside filter
  let index = filter.value.findIndex((item) => item.key === key);

  if (index == -1) {
    // If key not exist, insert new filter
    filter.value.push({
      key: key,
      action: {
        [action]: condition,
      },
    });
  } else {
    // If key exist, update filter
    filter.value[index].action[action] = condition;
    // console.log(filter.value);
  }
};

const getFilter = (key) => {
  let result = false;
  filter.value.forEach((item) => {
    if (item.key === key) {
      result = item.action.hide;
    }
  });
  return result;
};

// Watch filter.value
watch(
  () => filter.value,
  () => {
    // console.log(filter.value);
    // Loop json object filter.value
    filter.value.forEach((item) => {
      // Hide Column
      if (item.action.hide) {
        // Get index title from columnTitle
        let index = columnTitle.value.indexOf(item.key);

        if (index !== -1) {
          // Remove column from columnTitle
          columnTitle.value.splice(index, 1);
        }
      } else if (!item.action.hide) {
        // Get index title from dataTitle
        let indexData = dataTitle.value.indexOf(item.key);

        if (!columnTitle.value.includes(item.key)) {
          // Add Column back to its original position
          columnTitle.value.splice(indexData, 0, item.key);

          // Sort the columnTitle like dataTitle
          columnTitle.value.sort((a, b) => {
            let indexA = dataTitle.value.indexOf(a);
            let indexB = dataTitle.value.indexOf(b);
            return indexA - indexB;
          });
        }
      }
    });
  },
  { deep: true }
);

const filterComputed = computed(() => {
  let result = [];
  let i = 0;
  filter.value.forEach((item) => {
    if (item.action.hide) {
      result.push({
        title: item.key,
        hide: item.action.hide,
      });
    }
    i++;
  });
  // console.log(result);
  return result;
});

// watch pinia getter windowWidth
watch(
  () => windowWidth.value,
  () => {
    if (props.optionsAdvanced.responsive) {
      if (windowWidth.value <= mobileWidth) {
        hideTable.value = true;
      } else {
        hideTable.value = false;
      }
    }
  },
  { deep: true }
);
</script>

<template>
  <div
    v-if="dataTable && dataTable.length > 0"
    class="table-wrapper"
    :class="{
      '!border': advanced && !hideTable && optionsAdvanced.outsideBorder,
    }"
  >
    <div
      class="table-header"
      :class="{
        open: openFilter,
        '!max-h-full': !optionsAdvanced.filterable,
      }"
      v-if="advanced"
    >
      <div
        class="table-header-filter"
        :class="{
          '!items-center !gap-3': !optionsAdvanced.filterable,
        }"
      >
        <div>
          <div class="flex gap-x-2">
            <FormKit
              v-model="keyword"
              type="search"
              placeholder="Search..."
              outer-class="mb-0"
            />
            <rs-button
              v-if="optionsAdvanced.filterable"
              class="!px-3 sm:!px-6"
              @click="openFilter ? (openFilter = false) : (openFilter = true)"
            >
              <Icon
                name="ic:outline-filter-alt"
                class="mr-0 md:mr-1"
                size="1rem"
              />
              <span class="hidden sm:block">Filter</span>
            </rs-button>
          </div>
        </div>
        <div class="flex justify-center items-center gap-x-2">
          <span class="text-[rgb(var(--text-color))]">Result per page:</span>
          <FormKit
            type="select"
            v-model="pageSize"
            :options="[5, 10, 25, 100]"
            outer-class="mb-0"
          />
        </div>
      </div>
      <div
        class="flex flex-wrap items-center justify-start gap-x-3"
        v-if="optionsAdvanced.filterable"
      >
        <rs-dropdown
          :title="camelCasetoTitle(val)"
          size="sm"
          class="mt-3"
          v-for="(val, index) in dataTitle"
          :key="index"
        >
          <rs-dropdown-item @click="hideColumn(val)">
            {{ getFilter(val) ? "Show Column" : "Hide Column" }}
            <Icon
              :name="getFilter(val) ? 'mdi:eye-outline' : 'mdi:eye-off-outline'"
              size="1rem"
              class="ml-auto"
            ></Icon>
          </rs-dropdown-item>
        </rs-dropdown>
      </div>
    </div>
    <div
      v-if="filterComputed.length > 0"
      class="table-header-filter-list w-full m-4"
    >
      <div class="flex flex-wrap items-center justify-start gap-x-2">
        <div
          class="flex items-center justify-center gap-x-2 border border-primary text-primary rounded-lg py-1 px-2"
          v-for="(val, index) in filterComputed"
          :key="index"
        >
          {{ val ? camelCasetoTitle(val.title) : "" }}
          <Icon
            name="ic:round-close"
            class="mr-0 md:mr-1 hover:text-red-500 cursor-pointer"
            size="1rem"
            @click="hideColumn(val.title)"
          ></Icon>
        </div>
      </div>
    </div>
    <div class="w-full overflow-x-auto">
      <client-only>
        <table
          v-if="!hideTable"
          class="table-content"
          :class="{
            '!border-y !border-0 border-[rgb(var(--bg-1))]': advanced,
            'table-fixed': options.fixed,
            'table-auto': !options.fixed,
          }"
        >
          <thead
            class="text-left border-[rgb(var(--border-color))]"
            :class="{
              'border-y': !options.borderless,
              'border-[rgb(var(--border-color))] bg-[rgb(var(--bg-2))]':
                options.variant === 'default',
              'border-primary/50 bg-primary text-white':
                options.variant === 'primary',
              'border-secondary/50 bg-secondary text-white':
                options.variant === 'secondary',
              'border-info/50 bg-info text-white ': options.variant === 'info',
              'border-success/50 bg-success text-white':
                options.variant === 'success',
              'border-warning/50 bg-warning text-white':
                options.variant === 'warning',
              'border-danger/50 bg-danger text-white':
                options.variant === 'danger',
            }"
          >
            <tr>
              <th
                class="relative py-3 pl-5 pr-8 whitespace-nowrap"
                :class="{
                  'border-r last:border-l last:border-r-0':
                    options.bordered && !options.borderless,
                  'border-[rgb(var(--border-color))]':
                    options.variant === 'default',
                  'border-primary/80': options.variant === 'primary',
                  'border-secondary/80': options.variant === 'secondary',
                  'border-info/80': options.variant === 'info',
                  'border-success/80': options.variant === 'success',
                  'border-warning/80': options.variant === 'warning',
                  'border-danger/80': options.variant === 'danger',
                  'w-36': options.fixed,
                  'cursor-pointer': optionsAdvanced.sortable && advanced,
                }"
                style="min-width: 100px"
                @click="
                  optionsAdvanced.sortable && advanced ? sort(index) : null
                "
                v-for="(val, index) in columnTitle"
                :key="index"
              >
                {{ camelCasetoTitle(val) }}
                <div
                  v-if="optionsAdvanced.sortable && advanced"
                  class="sortable"
                >
                  <Icon
                    class="absolute top-3 right-2 opacity-20"
                    size="1.25rem"
                    name="carbon:chevron-sort"
                  />
                  <Icon
                    v-if="currentSort == index && currentSortDir == 'asc'"
                    class="absolute top-3 right-2 opacity-50"
                    size="1.25rem"
                    name="carbon:chevron-sort-up"
                  />
                  <Icon
                    v-else-if="currentSort == index && currentSortDir == 'desc'"
                    class="absolute top-3 right-2 opacity-50"
                    size="1.25rem"
                    name="carbon:chevron-sort-down"
                  />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              :class="{
                'border-y border-[rgb(var(--border-color))]':
                  !options.bordered && !options.borderless,
                'border-b': options.bordered && !options.borderless,
                'border-b-0': options.borderless,
                'border-[rgb(var(--border-color))] odd:bg-[rgb(var(--bg-1))] even:bg-[rgb(var(--bg-2))]':
                  options.variant === 'default' && options.striped,
                'border-primary/20 odd:bg-white even:bg-primary/5':
                  options.variant === 'primary' && options.striped,
                'border-secondary/20 odd:bg-white even:bg-secondary/5':
                  options.variant === 'secondary' && options.striped,
                'border-info/20 odd:bg-white even:bg-info/5':
                  options.variant === 'info' && options.striped,
                'border-success/20 odd:bg-white even:bg-success/5':
                  options.variant === 'success' && options.striped,
                'border-warning/20 odd:bg-white even:bg-warning/5':
                  options.variant === 'warning' && options.striped,
                'border-danger/20 odd:bg-white even:bg-danger/5':
                  options.variant === 'danger' && options.striped,
                'cursor-pointer hover:bg-slate-300':
                  options.hover && options.variant === 'default',
                'cursor-pointer hover:bg-primary/5':
                  options.hover && options.variant === 'primary',
                'cursor-pointer hover:bg-secondary/5':
                  options.hover && options.variant === 'secondary',
                'cursor-pointer hover:bg-info/5':
                  options.hover && options.variant === 'info',
                'cursor-pointer hover:bg-success/5':
                  options.hover && options.variant === 'success',
                'cursor-pointer hover:bg-warning/5':
                  options.hover && options.variant === 'warning',
                'cursor-pointer hover:bg-danger/5':
                  options.hover && options.variant === 'danger',
              }"
              v-for="(val1, index1) in computedData"
              :key="index1"
            >
              <td
                class="p-4 pl-5 break-words"
                :class="{
                  'border-r last:border-l last:border-r-0':
                    options.bordered && !options.borderless,
                  'border-[rgb(var(--border-color))]':
                    options.variant === 'default',
                  'border-primary/20': options.variant === 'primary',
                  'border-secondary/20': options.variant === 'secondary',
                  'border-info/20': options.variant === 'info',
                  'border-success/20': options.variant === 'success',
                  'border-warning/20': options.variant === 'warning',
                  'border-danger/20': options.variant === 'danger',
                }"
                v-for="(val2, index2) in columnTitle"
                :key="index2"
              >
                <slot
                  :name="val2"
                  :text="filteredDatabyTitle(val1, val2)"
                  :value="val1"
                >
                  {{ filteredDatabyTitle(val1, val2) }}
                </slot>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-else>
          <rs-collapse v-if="computedData.length > 0" accordion>
            <rs-collapse-item v-for="(val, index) in computedData" :key="index">
              <template #title>
                <div class="grid grid-cols-2">
                  <div class="flex flex-col col-span-1">
                    <span class="font-semibold leading-tight">
                      {{ Object.values(val)[0] }}
                    </span>
                    <span class="text-sm"> {{ Object.values(val)[1] }} </span>
                  </div>
                  <div class="flex justify-end items-center col-span-1">
                    <div class="mr-4">
                      {{ Object.values(val)[computedData.length] }}
                    </div>
                  </div>
                </div>
              </template>
              <template #default>
                <div
                  class="flex justify-between items-center even:bg-inherit odd:bg-[rgb(var(--bg-1))] rounded-lg p-3"
                  v-for="(val1, index1) in Object.entries(val).slice(
                    2,
                    Object.entries(val).length
                  )"
                  :key="index1"
                >
                  <span>
                    {{ camelCasetoTitle(val1[0]) }}
                  </span>
                  <span>
                    {{ val1[1] }}
                  </span>
                </div>
              </template>
            </rs-collapse-item>
          </rs-collapse>
        </div>
      </client-only>
    </div>
    <div v-if="advanced" class="table-footer">
      <div class="flex justify-center items-center gap-x-2">
        <span class="text-sm text-[rgb(var(--text-color))] hidden md:block"
          >Showing {{ pageSize * currentPage - pageSize + 1 }} to
          {{ pageSize * currentPage }} of {{ totalEntries }} entries</span
        >
      </div>
      <div class="table-footer-page">
        <rs-button
          :variant="`${
            options.variant == 'default' ? 'primary' : options.variant
          }-outline`"
          class="!rounded-full !p-1 !w-8 !h-8"
          @click="firstPage"
          :disabled="currentPage == 1"
        >
          <Icon name="ic:round-keyboard-double-arrow-left" size="1rem"></Icon>
        </rs-button>
        <rs-button
          :variant="`${
            options.variant == 'default' ? 'primary' : options.variant
          }-outline`"
          class="!rounded-full !p-1 !w-8 !h-8"
          @click="prevPage"
          :disabled="currentPage == 1"
        >
          <Icon name="ic:round-keyboard-arrow-left" size="1rem"></Icon>
        </rs-button>
        <rs-button
          :variant="`${
            currentPage == val && options.variant != 'default'
              ? options.variant
              : currentPage == val && options.variant == 'default'
              ? 'primary'
              : options.variant == 'default'
              ? 'primary-outline'
              : options.variant + '-outline'
          }`"
          class="!rounded-full !p-1 !w-8 !h-8"
          v-for="(val, index) in pages"
          :key="index"
          @click="pageChange(val)"
        >
          {{ val }}
        </rs-button>
        <rs-button
          :variant="`${
            options.variant == 'default' ? 'primary' : options.variant
          }-outline`"
          class="!rounded-full !p-1 !w-8 !h-8"
          @click="nextPage"
          :disabled="currentPage == totalPage"
        >
          <Icon name="ic:round-keyboard-arrow-right" size="1rem"></Icon>
        </rs-button>
        <rs-button
          :variant="`${
            options.variant == 'default' ? 'primary' : options.variant
          }-outline`"
          class="!rounded-full !p-1 !w-8 !h-8"
          @click="lastPage"
          :disabled="currentPage == totalPage"
        >
          <Icon name="ic:round-keyboard-double-arrow-right" size="1rem"></Icon>
        </rs-button>
      </div>
    </div>
  </div>
  <div v-else class="table-wrapper p-4">
    <div
      class="border border-[rgb(var(--border-color))] rounded-lg overflow-hidden"
    >
      <div
        class="bg-[rgb(var(--bg-2))] p-4 border-b border-[rgb(var(--border-color))]"
      >
        <h3 class="text-lg font-semibold text-[rgb(var(--text-color))]"></h3>
      </div>
      <div class="p-8 text-center">
        <Icon name="mdi:table-off" class="text-gray-300 mb-4" size="48px" />
        <p class="text-[rgb(var(--text-color))] text-lg font-medium">
          Tiada data
        </p>
        <p class="text-gray-500 mt-2">
          Tiada entri untuk dipaparkan pada masa ini.
        </p>
      </div>
    </div>
  </div>
</template>
