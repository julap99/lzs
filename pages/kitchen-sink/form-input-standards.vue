<script setup>
import { ref, computed, watch } from 'vue';
import { useDebounceFn } from '~/composables/useDebounceFn';

definePageMeta({
  title: "Form Input Standards",
  breadcrumb: [
    {
      name: "Kitchen Sink",
      path: "/kitchen-sink",
    },
    {
      name: "Form Input Standards",
      type: "current",
    },
  ],
});

// Calendar examples state
const singleDate = ref(null);
const startDate = ref(null);
const endDate = ref(null);
const disabledDate = ref(null);
const workingDaysOnly = ref(null);
const errorState = ref(null);

// Restrict dates for end date
const minEndDate = computed(() => {
  return startDate.value ? startDate.value : null;
});

// Function to disable weekend dates
const disableWeekends = (date) => {
  const day = new Date(date).getDay();
  return day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
};

// Set a date to make the range invalid for demonstration
const setInvalidRange = () => {
  startDate.value = new Date(new Date().setDate(new Date().getDate() + 5));
  endDate.value = new Date(new Date().setDate(new Date().getDate() + 2));
  errorState.value = "Tarikh tamat tidak boleh sebelum tarikh mula";
};

// Reset calendar inputs
const resetCalendars = () => {
  singleDate.value = null;
  startDate.value = null;
  endDate.value = null;
  disabledDate.value = null;
  workingDaysOnly.value = null;
  errorState.value = null;
};

// Search examples state
const basicSearchTerm = ref('');
const validatedSearchTerm = ref('');
const isSearching = ref(false);
const searchResults = ref([]);
const noResultsFound = ref(false);
const searchError = ref('');

// Debounced search function
const debouncedSearch = useDebounceFn(() => {
  performSearch();
}, 300);

// Perform search with validation
const performSearch = () => {
  // Reset states
  searchError.value = '';
  isSearching.value = true;
  noResultsFound.value = false;
  
  // Validate search term
  if (validatedSearchTerm.value.length < 3) {
    searchError.value = 'Sila masukkan sekurang-kurangnya 3 aksara';
    isSearching.value = false;
    searchResults.value = [];
    return;
  }
  
  // Regex validation - only allow alphanumeric and some symbols
  const validPattern = /^[a-zA-Z0-9\-\s]+$/;
  if (!validPattern.test(validatedSearchTerm.value)) {
    searchError.value = 'Hanya aksara abjad angka dan tanda sempang dibenarkan';
    isSearching.value = false;
    searchResults.value = [];
    return;
  }
  
  // Simulate search delay
  setTimeout(() => {
    // Mock results based on search term
    if (validatedSearchTerm.value.toLowerCase().includes('ahmad')) {
      searchResults.value = [
        { id: 'APP-001', name: 'Ahmad bin Hassan', status: 'LULUS' },
        { id: 'APP-008', name: 'Ahmad Zulkifli', status: 'MENUNGGU' },
      ];
    } else if (validatedSearchTerm.value.toLowerCase().includes('app')) {
      searchResults.value = [
        { id: 'APP-001', name: 'Ahmad bin Hassan', status: 'LULUS' },
        { id: 'APP-002', name: 'Siti Aminah', status: 'MENUNGGU' },
      ];
    } else {
      searchResults.value = [];
      noResultsFound.value = true;
    }
    
    isSearching.value = false;
  }, 800);
};

// Execute search on button click
const executeSearch = () => {
  performSearch();
};

// Clear search
const clearSearch = () => {
  validatedSearchTerm.value = '';
  searchResults.value = [];
  noResultsFound.value = false;
  searchError.value = '';
};

// For controlled search input, watch for changes and apply debounce
watch(validatedSearchTerm, (newVal) => {
  if (newVal.length >= 3) {
    debouncedSearch();
  } else {
    searchResults.value = [];
    noResultsFound.value = false;
  }
});
</script>

<template>
  <div class="container mx-auto px-4 py-6">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-primary mb-2">Form Input Standards</h1>
      <p class="text-gray-600">Documentation for calendar inputs and search field standards</p>
    </div>

    <!-- Calendar Input Standards Section -->
    <div class="mb-12">
      <div class="border-b border-gray-200 pb-2 mb-6">
        <h2 class="text-xl font-semibold text-gray-800">5.4 Calendar Input Standards</h2>
      </div>

      <!-- Calendar Display and Layout -->
      <div class="mb-8">
        <h3 class="text-lg font-medium text-gray-700 mb-4">5.4.1 Calendar Display and Layout</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Default Calendar -->
          <div class="bg-white rounded-lg shadow-sm p-4">
            <div class="mb-3">
              <h4 class="text-sm font-semibold text-gray-600 mb-1">Default Calendar</h4>
              <p class="text-xs text-gray-500 mb-3">Displays current month with today highlighted</p>
            </div>
            <div class="form-control">
              <label class="form-label">Pilih Tarikh</label>
              <input
                type="date"
                v-model="singleDate"
                class="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                placeholder="dd/mm/yyyy"
              />
            </div>
          </div>

          <!-- Disabled Dates Calendar -->
          <div class="bg-white rounded-lg shadow-sm p-4">
            <div class="mb-3">
              <h4 class="text-sm font-semibold text-gray-600 mb-1">Disabled Dates</h4>
              <p class="text-xs text-gray-500 mb-3">Past dates are disabled (future-only selection)</p>
            </div>
            <div class="form-control">
              <label class="form-label">Pilih Tarikh Masa Hadapan</label>
              <input
                type="date"
                v-model="disabledDate"
                class="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                :min="new Date()"
              />
            </div>
          </div>

          <!-- Working Days Only Calendar -->
          <div class="bg-white rounded-lg shadow-sm p-4">
            <div class="mb-3">
              <h4 class="text-sm font-semibold text-gray-600 mb-1">Working Days Only</h4>
              <p class="text-xs text-gray-500 mb-3">Weekend dates (Saturday & Sunday) are disabled</p>
            </div>
            <div class="form-control">
              <label class="form-label">Pilih Hari Bekerja</label>
              <input
                type="date"
                v-model="workingDaysOnly"
                class="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              />
              <div class="text-xs text-gray-500 mt-1">(HTML date inputs don't support disabling specific dates)</div>
            </div>
          </div>

          <!-- Error State Calendar -->
          <div class="bg-white rounded-lg shadow-sm p-4">
            <div class="mb-3">
              <h4 class="text-sm font-semibold text-gray-600 mb-1">Error State</h4>
              <p class="text-xs text-gray-500 mb-3">Calendar displaying validation error</p>
            </div>
            <div class="form-control">
              <label class="form-label">Pilih Tarikh</label>
              <input
                type="date"
                v-model="singleDate"
                class="border border-red-500 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-red-500/50"
                placeholder="dd/mm/yyyy"
              />
              <div class="text-red-500 text-xs mt-1">Sila pilih tarikh yang sah</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Start and End Date Usage -->
      <div class="mb-8">
        <h3 class="text-lg font-medium text-gray-700 mb-4">5.4.2 Start and End Date Usage</h3>
        
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="mb-4">
            <h4 class="text-sm font-semibold text-gray-600 mb-1">Date Range Selection</h4>
            <p class="text-xs text-gray-500 mb-3">End date is restricted based on start date selection</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Start Date -->
            <div class="form-control">
              <label class="form-label">Tarikh Mula</label>
              <input
                type="date"
                v-model="startDate"
                class="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              />
            </div>

            <!-- End Date -->
            <div class="form-control">
              <label class="form-label">Tarikh Tamat</label>
              <input
                type="date"
                v-model="endDate"
                class="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                :min="minEndDate"
                :disabled="!startDate"
              />
              <div v-if="!startDate" class="text-xs text-gray-500 mt-1">Sila pilih tarikh mula terlebih dahulu</div>
            </div>
          </div>

          <!-- Invalid Range Example -->
          <div class="mt-6">
            <div class="mb-3">
              <h4 class="text-sm font-semibold text-gray-600">Invalid Date Range Example</h4>
              <p class="text-xs text-gray-500 mb-2">Demonstrates error state when end date precedes start date</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="form-control">
                <label class="form-label">Tarikh Mula</label>
                <input
                  type="text"
                  :value="startDate ? new Date(startDate).toLocaleDateString('ms-MY') : ''"
                  class="border border-gray-300 rounded-md px-3 py-2 w-full bg-gray-50"
                  readonly
                />
              </div>

              <div class="form-control">
                <label class="form-label">Tarikh Tamat</label>
                <input
                  type="text"
                  :value="endDate ? new Date(endDate).toLocaleDateString('ms-MY') : ''"
                  class="border border-red-500 rounded-md px-3 py-2 w-full bg-gray-50"
                  readonly
                />
                <div class="text-red-500 text-xs mt-1">{{ errorState }}</div>
              </div>
            </div>

            <div class="mt-4 flex space-x-2">
              <button @click="setInvalidRange" class="px-3 py-1.5 bg-red-100 text-red-600 rounded-md text-sm">
                Tunjuk Ralat Julat
              </button>
              <button @click="resetCalendars" class="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-md text-sm">
                Set Semula
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Visual States and Responsiveness -->
      <div class="mb-8">
        <h3 class="text-lg font-medium text-gray-700 mb-4">5.4.3 Visual States and Responsiveness</h3>
        
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="mb-4">
            <h4 class="text-sm font-semibold text-gray-600 mb-1">Calendar Visual States</h4>
            <p class="text-xs text-gray-500 mb-3">Different visual states for calendar inputs</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Default State -->
            <div class="form-control">
              <label class="form-label">Default (Placeholder)</label>
              <input
                type="text"
                placeholder="dd/mm/yyyy"
                class="border border-gray-300 rounded-md px-3 py-2 w-full"
              />
              <div class="text-xs text-gray-500 mt-1">Placeholder visible, no value selected</div>
            </div>

            <!-- Selected State -->
            <div class="form-control">
              <label class="form-label">Selected</label>
              <input
                type="text"
                value="12/05/2023"
                class="border border-gray-300 rounded-md px-3 py-2 w-full bg-white"
              />
              <div class="text-xs text-gray-500 mt-1">Date is selected and displayed</div>
            </div>

            <!-- Disabled State -->
            <div class="form-control">
              <label class="form-label">Disabled</label>
              <input
                type="text"
                placeholder="dd/mm/yyyy"
                class="border border-gray-200 rounded-md px-3 py-2 w-full bg-gray-100 text-gray-400 cursor-not-allowed"
                disabled
              />
              <div class="text-xs text-gray-500 mt-1">Input is disabled, no interaction</div>
            </div>

            <!-- Focused State -->
            <div class="form-control">
              <label class="form-label">Focused</label>
              <input
                type="text"
                placeholder="dd/mm/yyyy"
                class="border-2 border-primary rounded-md px-3 py-2 w-full"
              />
              <div class="text-xs text-gray-500 mt-1">Input is focused, calendar would open</div>
            </div>

            <!-- Error State -->
            <div class="form-control">
              <label class="form-label">Error</label>
              <input
                type="text"
                value="31/02/2023"
                class="border border-red-500 rounded-md px-3 py-2 w-full"
              />
              <div class="text-red-500 text-xs mt-1">Tarikh tidak sah</div>
            </div>

            <!-- Mobile View Simulation -->
            <div class="form-control">
              <label class="form-label">Mobile View</label>
              <div class="border border-dashed border-gray-300 rounded-md p-3 bg-gray-50 text-center">
                <div class="text-sm text-gray-500 mb-2">Sistem kalendar natif</div>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div class="text-xs text-gray-500 mt-2">Paparan modal penuh skrin pada peranti mudah alih</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Search Field Behavior Standards Section -->
    <div class="mb-12">
      <div class="border-b border-gray-200 pb-2 mb-6">
        <h2 class="text-xl font-semibold text-gray-800">5.5 Search Field Behavior Standards</h2>
      </div>

      <!-- Controlled Input Trigger -->
      <div class="mb-8">
        <h3 class="text-lg font-medium text-gray-700 mb-4">5.5.1 Controlled Input Trigger</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Button Triggered Search -->
          <div class="bg-white rounded-lg shadow-sm p-4">
            <div class="mb-3">
              <h4 class="text-sm font-semibold text-gray-600 mb-1">Button Triggered Search</h4>
              <p class="text-xs text-gray-500 mb-3">Search executed only on button click</p>
            </div>
            <div class="flex">
              <input
                type="text"
                v-model="basicSearchTerm"
                placeholder="Cari nama, emel atau ID permohonan"
                class="border border-gray-300 rounded-l-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              />
              <button
                @click="executeSearch"
                class="bg-primary text-white px-4 py-2 rounded-r-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <Icon name="ic:baseline-search" class="text-lg" />
              </button>
            </div>
            <div class="text-xs text-gray-500 mt-2">Carian hanya dilaksanakan apabila butang diklik</div>
          </div>

          <!-- Debounced Search -->
          <div class="bg-white rounded-lg shadow-sm p-4">
            <div class="mb-3">
              <h4 class="text-sm font-semibold text-gray-600 mb-1">Debounced Search (300ms)</h4>
              <p class="text-xs text-gray-500 mb-3">Auto-triggers after 3 characters with 300ms debounce</p>
            </div>
            <div class="relative">
              <div class="flex">
                <div class="relative flex-grow">
                  <input
                    type="text"
                    v-model="validatedSearchTerm"
                    placeholder="Cari nama, emel atau ID permohonan"
                    class="border border-gray-300 rounded-l-md pl-3 pr-8 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                    :class="{ 'border-red-500': searchError }"
                  />
                  <button
                    v-if="validatedSearchTerm"
                    @click="clearSearch"
                    class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <Icon name="ic:baseline-close" class="text-lg" />
                  </button>
                </div>
                <button
                  class="bg-primary text-white px-4 py-2 rounded-r-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <Icon v-if="!isSearching" name="ic:baseline-search" class="text-lg" />
                  <span v-else class="animate-spin block h-5 w-5">
                    <Icon name="ic:baseline-refresh" class="text-lg" />
                  </span>
                </button>
              </div>
              
              <div v-if="searchError" class="text-red-500 text-xs mt-1">{{ searchError }}</div>
              <div v-else class="text-xs text-gray-500 mt-1">Carian bermula selepas 3 aksara dimasukkan</div>
            </div>

            <!-- Results display -->
            <div v-if="searchResults.length > 0" class="mt-4 border rounded-md divide-y">
              <div v-for="result in searchResults" :key="result.id" class="p-2 hover:bg-gray-50">
                <div class="flex justify-between items-center">
                  <div>
                    <div class="font-medium">{{ result.name }}</div>
                    <div class="text-xs text-gray-500">{{ result.id }}</div>
                  </div>
                  <div>
                    <rs-badge :type="result.status.toLowerCase()">{{ result.status }}</rs-badge>
                  </div>
                </div>
              </div>
            </div>

            <div v-else-if="noResultsFound" class="mt-4 p-3 text-center bg-gray-50 rounded-md">
              <Icon name="ic:baseline-search-off" class="text-2xl text-gray-400" />
              <div class="text-gray-500 mt-1">Tiada padanan ditemui</div>
            </div>

            <div v-else-if="isSearching" class="mt-4 p-3 text-center bg-gray-50 rounded-md">
              <div class="animate-pulse">
                <div class="h-4 bg-gray-200 rounded-full mb-2.5 w-3/4 mx-auto"></div>
                <div class="h-3 bg-gray-200 rounded-full mb-2.5 w-1/2 mx-auto"></div>
                <div class="h-3 bg-gray-200 rounded-full w-2/3 mx-auto"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pattern Matching and Validation -->
      <div class="mb-8">
        <h3 class="text-lg font-medium text-gray-700 mb-4">5.5.2 Pattern Matching and Validation</h3>
        
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="mb-4">
            <h4 class="text-sm font-semibold text-gray-600 mb-1">Search Validation Rules</h4>
            <p class="text-xs text-gray-500 mb-3">Pattern matching and validation for search inputs</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Validation: Minimum Characters -->
            <div class="form-control border border-gray-200 rounded-md p-3">
              <h5 class="text-sm font-medium text-gray-600 mb-2">Minimum 3 Aksara</h5>
              <div class="flex">
                <input
                  type="text"
                  value="ab"
                  class="border border-red-500 rounded-l-md px-3 py-2 w-full"
                />
                <button
                  class="bg-primary text-white px-4 py-2 rounded-r-md opacity-70 cursor-not-allowed"
                  disabled
                >
                  <Icon name="ic:baseline-search" class="text-lg" />
                </button>
              </div>
              <div class="text-red-500 text-xs mt-1">Sila masukkan sekurang-kurangnya 3 aksara</div>
            </div>

            <!-- Validation: Valid Pattern -->
            <div class="form-control border border-gray-200 rounded-md p-3">
              <h5 class="text-sm font-medium text-gray-600 mb-2">Abjad Angka Sahaja</h5>
              <div class="flex">
                <input
                  type="text"
                  value="app@123"
                  class="border border-red-500 rounded-l-md px-3 py-2 w-full"
                />
                <button
                  class="bg-primary text-white px-4 py-2 rounded-r-md opacity-70 cursor-not-allowed"
                  disabled
                >
                  <Icon name="ic:baseline-search" class="text-lg" />
                </button>
              </div>
              <div class="text-red-500 text-xs mt-1">Hanya aksara abjad angka dan tanda sempang dibenarkan</div>
            </div>

            <!-- Valid Search Examples -->
            <div class="form-control border border-gray-200 rounded-md p-3 col-span-1 md:col-span-2">
              <h5 class="text-sm font-medium text-gray-600 mb-2">Contoh Carian Sah</h5>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <div class="text-xs font-medium text-gray-500 mb-1">Nama Penuh</div>
                  <div class="border border-gray-300 rounded-md px-3 py-2 bg-gray-50 text-sm">
                    Ahmad bin Hassan
                  </div>
                </div>
                <div>
                  <div class="text-xs font-medium text-gray-500 mb-1">ID Aplikasi</div>
                  <div class="border border-gray-300 rounded-md px-3 py-2 bg-gray-50 text-sm">
                    APP-2023-001
                  </div>
                </div>
                <div>
                  <div class="text-xs font-medium text-gray-500 mb-1">Nombor Kad Pengenalan</div>
                  <div class="border border-gray-300 rounded-md px-3 py-2 bg-gray-50 text-sm">
                    890512-14-5566
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Interface Feedback and UX -->
      <div class="mb-8">
        <h3 class="text-lg font-medium text-gray-700 mb-4">5.5.3 Interface Feedback and UX</h3>
        
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="mb-4">
            <h4 class="text-sm font-semibold text-gray-600 mb-1">Search Feedback States</h4>
            <p class="text-xs text-gray-500 mb-3">Visual feedback for different search states</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Loading State -->
            <div class="border border-gray-200 rounded-md p-3">
              <h5 class="text-sm font-medium text-gray-600 mb-2">Loading State</h5>
              <div class="flex mb-3">
                <input
                  type="text"
                  value="Ahmad"
                  class="border border-gray-300 rounded-l-md px-3 py-2 w-full"
                  readonly
                />
                <button
                  class="bg-primary text-white px-4 py-2 rounded-r-md"
                >
                  <span class="animate-spin block h-5 w-5">
                    <Icon name="ic:baseline-refresh" class="text-lg" />
                  </span>
                </button>
              </div>
              
              <div class="p-4 bg-gray-50 rounded-md">
                <div class="animate-pulse flex space-x-4">
                  <div class="flex-1 space-y-3 py-1">
                    <div class="h-2.5 bg-gray-200 rounded-full"></div>
                    <div class="h-2 bg-gray-200 rounded-full w-3/4"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- No Results State -->
            <div class="border border-gray-200 rounded-md p-3">
              <h5 class="text-sm font-medium text-gray-600 mb-2">No Results State</h5>
              <div class="flex mb-3">
                <div class="relative flex-grow">
                  <input
                    type="text"
                    value="XYZ123"
                    class="border border-gray-300 rounded-l-md pl-3 pr-8 py-2 w-full"
                    readonly
                  />
                  <button
                    class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <Icon name="ic:baseline-close" class="text-lg" />
                  </button>
                </div>
                <button
                  class="bg-primary text-white px-4 py-2 rounded-r-md"
                >
                  <Icon name="ic:baseline-search" class="text-lg" />
                </button>
              </div>
              
              <div class="p-4 bg-gray-50 rounded-md text-center">
                <Icon name="ic:baseline-search-off" class="text-2xl text-gray-400" />
                <div class="text-gray-500 mt-1">Tiada padanan ditemui</div>
              </div>
            </div>

            <!-- Results State -->
            <div class="border border-gray-200 rounded-md p-3 col-span-1 md:col-span-2">
              <h5 class="text-sm font-medium text-gray-600 mb-2">Results Display</h5>
              <div class="flex mb-3">
                <div class="relative flex-grow">
                  <input
                    type="text"
                    value="Ahmad"
                    class="border border-gray-300 rounded-l-md pl-3 pr-8 py-2 w-full"
                    readonly
                  />
                  <button
                    class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <Icon name="ic:baseline-close" class="text-lg" />
                  </button>
                </div>
                <button
                  class="bg-primary text-white px-4 py-2 rounded-r-md"
                >
                  <Icon name="ic:baseline-search" class="text-lg" />
                </button>
              </div>
              
              <div class="border rounded-md divide-y">
                <div class="p-2 hover:bg-gray-50">
                  <div class="flex justify-between items-center">
                    <div>
                      <div class="font-medium">Ahmad bin Hassan</div>
                      <div class="text-xs text-gray-500">APP-001</div>
                    </div>
                    <div>
                      <rs-badge type="lulus">LULUS</rs-badge>
                    </div>
                  </div>
                </div>
                <div class="p-2 hover:bg-gray-50">
                  <div class="flex justify-between items-center">
                    <div>
                      <div class="font-medium">Ahmad Zulkifli</div>
                      <div class="text-xs text-gray-500">APP-008</div>
                    </div>
                    <div>
                      <rs-badge type="menunggu">MENUNGGU</rs-badge>
                    </div>
                  </div>
                </div>
                <div class="p-2 hover:bg-gray-50">
                  <div class="flex justify-between items-center">
                    <div>
                      <div class="font-medium">Nurul Ahmad</div>
                      <div class="text-xs text-gray-500">APP-015</div>
                    </div>
                    <div>
                      <rs-badge type="ditolak">DITOLAK</rs-badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 