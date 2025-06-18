<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Carian Asnaf</h2>
        </div>
      </template>

      <template #body>
        <!-- Form Section -->
        <div class="mb-6">
          <h3 class="text-lg font-medium mb-4">Carian Asnaf</h3>
          <FormKit type="form" :actions="false" @submit="handleSubmit">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormKit
                type="select"
                name="kariah"
                label="Kariah"
                validation="required"
                :options="kariahOptions"
                placeholder="Pilih Kariah"
                v-model="formData.kariah"
                :validation-messages="{
                  required: 'Kariah adalah wajib',
                }"
              />

              <FormKit
                type="select"
                name="kategoriAsnaf"
                label="Kategori Asnaf"
                :options="kategoriAsnafOptions"
                placeholder="Pilih Kategori Asnaf"
                v-model="formData.kategoriAsnaf"
                :validation-messages="{
                  required: 'Kategori Asnaf adalah wajib',
                }"
              />

              <FormKit
                type="text"
                name="noKp"
                label="No KP"
                v-model="formData.noKp"
                placeholder="Masukkan No KP (Opsional)"
              />
            </div>

            <div class="mt-6 flex justify-end gap-4">
              <div>
                <rs-button variant="primary-outline" @click="resetForm">
                  Reset
                </rs-button>
              </div>

              <div>
                <rs-button
                  variant="primary"
                  class="ml-auto"
                  @click="validateAndSearch"
                  :disabled="processing"
                >
                  <span v-if="processing">
                    <Icon name="eos-icons:loading" class="ml-1" size="1rem" />
                  </span>
                  <span v-else>Cari</span>
                </rs-button>
              </div>
            </div>
          </FormKit>
        </div>
      </template>
    </rs-card>

    <!-- Search Result Section -->
    <rs-card v-if="searchCompleted" class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-medium">Senarai Asnaf</h3>
          <div class="text-sm text-gray-600">
            {{ searchResults.length }} rekod dijumpai
          </div>
        </div>
      </template>

      <template #body>
        <div v-if="searchResults.length > 0">
          <!-- Table -->
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      v-model="selectAll"
                      @change="toggleSelectAll"
                      class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama Asnaf
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kariah
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kategori Asnaf
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tarikh
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="(item, index) in searchResults" :key="index" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      v-model="selectedItems"
                      :value="item.id"
                      class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ item.namaAsnaf }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ item.kariah }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ item.kategoriAsnaf }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ formatDate(item.tarikh) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Tarikh Akhir Form -->
          <div class="mt-6">
            <FormKit
              type="date"
              name="tarikhAkhir"
              label="Tarikh Akhir"
              validation="required" 
              v-model="tarikhAkhir"
              placeholder="Pilih Tarikh Akhir"
              class="max-w-xs"
              :validation-messages="{
                required: 'Tarikh Akhir adalah wajib',
              }"
            />
          </div>

          <!-- Action Button -->
          <div class="mt-6 flex justify-end">
            <rs-button
              variant="primary"
              @click="handleHantar"
              :disabled="selectedItems.length === 0"
            >
              Hantar ({{ selectedItems.length }} dipilih)
            </rs-button>
          </div>
        </div>

        <!-- No Results -->
        <div v-else class="text-center py-8">
          <Icon name="mdi:alert-circle" size="3rem" class="text-gray-400 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">Tiada Rekod Dijumpai</h3>
          <p class="text-gray-500">Tiada asnaf ditemui dengan kriteria carian yang diberikan.</p>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, computed, watch, inject } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from 'vue-toastification';

definePageMeta({
  title: "Carian Asnaf",
});

const processing = ref(false);
const searchCompleted = ref(false);
const selectAll = ref(false);
const selectedItems = ref([]);
const tarikhAkhir = ref("");

const breadcrumb = ref([
  {
    name: "Profiling",
    type: "link",
    path: "/BF-PRF/AS/KA/01",
  },
  {
    name: "Asnaf",
    type: "link",
    path: "/BF-PRF/AS/KA/01",
  },
  {
    name: "Carian Asnaf",
    type: "current",
    path: "/BF-PRF/AS/KA/01",
  },
]);

const kariahOptions = [
  { label: "Kariah A", value: "kariah_a" },
  { label: "Kariah B", value: "kariah_b" },
  { label: "Kariah C", value: "kariah_c" },
  { label: "Kariah D", value: "kariah_d" },
];

const kategoriAsnafOptions = [
  { label: "Fakir", value: "fakir" },
  { label: "Miskin", value: "miskin" },
];

const formData = ref({
  kariah: "",
  kategoriAsnaf: "",
  noKp: "",
});

const searchResults = ref([]);

const toast = useToast();

const resetForm = () => {
  formData.value.kariah = "";
  formData.value.kategoriAsnaf = "";
  formData.value.noKp = "";
  searchCompleted.value = false;
  selectedItems.value = [];
  selectAll.value = false;
};

const validateAndSearch = () => {
  // Allow search if at least one field is filled
  if (!formData.value.kariah && !formData.value.kategoriAsnaf && !formData.value.noKp) {
    return;
  }

  performSearch();
};

const performSearch = async () => {
  processing.value = true;
  searchCompleted.value = false;
  selectedItems.value = [];
  selectAll.value = false;

  // Simulate API call to search for asnaf
  setTimeout(() => {
    processing.value = false;
    
    // Generate mock data based on search criteria
    const mockData = generateMockData();
    searchResults.value = mockData;
    searchCompleted.value = true;
  }, 1000);
};

const generateMockData = () => {
  const mockNames = [
    "Ahmad bin Abdullah",
    "Siti binti Mohamed",
    "Mohamed bin Ali",
    "Fatimah binti Hassan",
    "Abdul Rahman bin Omar",
    "Aminah binti Ibrahim",
    "Hassan bin Ahmad",
    "Zainab binti Mohamed",
  ];

  const mockKariah = [
    "Kariah A",
    "Kariah B", 
    "Kariah C",
    "Kariah D"
  ];

  const mockKategori = [
    "Fakir",
    "Miskin"
  ];

  // Generate 3-8 random records
  const count = Math.floor(Math.random() * 6) + 3;
  const results = [];

  for (let i = 0; i < count; i++) {
    results.push({
      id: i + 1,
      namaAsnaf: mockNames[Math.floor(Math.random() * mockNames.length)],
      kariah: mockKariah[Math.floor(Math.random() * mockKariah.length)],
      kategoriAsnaf: mockKategori[Math.floor(Math.random() * mockKategori.length)],
      tarikh: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
    });
  }

  return results;
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('ms-MY', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const toggleSelectAll = () => {
  if (selectAll.value) {
    selectedItems.value = searchResults.value.map(item => item.id);
  } else {
    selectedItems.value = [];
  }
};

const handleHantar = () => {
  if (selectedItems.value.length === 0) {
    return;
  }

  // Get selected items data
  const selectedData = searchResults.value.filter(item => 
    selectedItems.value.includes(item.id)
  );

  // Show toast notification
  toast.success(`notifikasi telah dihantar kepada ${selectedItems.value.length} pemohon`, {
    timeout: 2000
  });
};

const handleSubmit = (data) => {
  console.log("Form submitted:", data);
  validateAndSearch();
};

// Watch for changes in selected items to update select all checkbox
watch(selectedItems, (newValue) => {
  if (searchResults.value.length > 0) {
    selectAll.value = newValue.length === searchResults.value.length;
  }
}, { deep: true });
</script>

<style lang="scss" scoped>
// Add any custom styles here if needed
</style>