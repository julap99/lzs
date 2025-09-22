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
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                name="daerah"
                label="Daerah"
                :options="daerahOptions"
                placeholder="Pilih Daerah"
                v-model="formData.daerah"
                :validation-messages="{
                  required: 'Daerah adalah wajib',
                }"
              />

              <FormKit
                type="date"
                name="tarikhAkhir"
                label="Tarikh Akhir"
                v-model="formData.tarikhAkhir"
                placeholder="Pilih Tarikh Akhir"
              />

              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">Had Kifayah</label>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormKit
                    type="number"
                    name="hadKifayahMinima"
                    label="Minima"
                    v-model="formData.hadKifayahMinima"
                    placeholder="Masukkan Minima"
                  />

                  <FormKit
                    type="number"
                    name="hadKifayahMaksima"
                    label="Maksima"
                    v-model="formData.hadKifayahMaksima"
                    placeholder="Masukkan Maksima"
                  />
                </div>
              </div>

              
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

      <!-- use standard html table because of the checkbox (rs-table is not working properly with checkbox)  -->
      <template #body>
        <div v-if="searchResults.length > 0">
          <!-- Table -->
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs uppercase tracking-wider">
                    Jenis Pengenalan ID
                  </th>
                  <th class="px-6 py-3 text-left text-xs uppercase tracking-wider">
                    Pengenalan ID
                  </th>
                  <th class="px-6 py-3 text-left text-xs uppercase tracking-wider">
                    Nama
                  </th>
                  <th class="px-6 py-3 text-left text-xs uppercase tracking-wider">
                    Kariah
                  </th>
                  <th class="px-6 py-3 text-left text-xs uppercase tracking-wider">
                    Daerah
                  </th>
                  <th class="px-6 py-3 text-left text-xs uppercase tracking-wider">
                    Tarikh Akhir
                  </th>
                  <th class="px-6 py-3 text-left text-xs uppercase tracking-wider">
                    % Had Kifayah
                  </th>
                  <th class="px-6 py-3 text-left text-xs uppercase tracking-wider">
                    Tindakan
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      :checked="selectAll"
                      @change="toggleSelectAll"
                      class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="(item, index) in searchResults" :key="index" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    {{ item.jenisPengenalanId || 'IC' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    {{ item.pengenalanId || item.noKp || '123456789012' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    {{ item.nama || item.namaAsnaf }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    {{ item.kariah }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    {{ item.daerah }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    {{ formatDate(item.tarikh) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    {{ item.hadKifayah || '85%' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <rs-button
                      variant="primary"
                      size="sm"
                      @click="handleSemak"
                    >
                      Semak
                    </rs-button>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      :checked="selectedItems.includes(item.id)"
                      @change="toggleItemSelection(item.id)"
                      class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
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
              label="Tarikh Akhir Asnaf Membuat Kemaskini Maklumat"
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
  // {
  //   name: "Profiling",
  //   type: "link",
  //   path: "/BF-PRF/AS/KA/01",
  // },
  // {
  //   name: "Asnaf",
  //   type: "link",
  //   path: "/BF-PRF/AS/KA/01",
  // },
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

const daerahOptions = [
  { label: "Gombak", value: "gombak" },
  { label: "Hulu Langat", value: "hulu_langat" },
  { label: "Hulu Selangor", value: "hulu_selangor" },
  { label: "Klang", value: "klang" },
  { label: "Kuala Langat", value: "kuala_langat" },
  { label: "Kuala Selangor", value: "kuala_selangor" },
  { label: "Petaling", value: "petaling" },
  { label: "Sabak Bernam", value: "sabak_bernam" },
  { label: "Sepang", value: "sepang" },
];

const formData = ref({
  kariah: "",
  daerah: "",
  hadKifayahMinima: "",
  hadKifayahMaksima: "",
  tarikhAkhir: "",
});

const searchResults = ref([]);


const toast = useToast();

const resetForm = () => {
  formData.value.kariah = "";
  formData.value.daerah = "";
  formData.value.hadKifayahMinima = "";
  formData.value.hadKifayahMaksima = "";
  formData.value.tarikhAkhir = "";
  searchCompleted.value = false;
  selectedItems.value = [];
  selectAll.value = false;
};

const validateAndSearch = () => {
  // Allow search if at least one field is filled
  if (!formData.value.kariah && !formData.value.daerah && !formData.value.hadKifayahMinima && !formData.value.hadKifayahMaksima && !formData.value.tarikhAkhir) {
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

  const mockDaerah = [
    "Gombak",
    "Hulu Langat",
    "Hulu Selangor",
    "Klang",
    "Kuala Langat",
    "Kuala Selangor",
    "Petaling",
    "Sabak Bernam",
    "Sepang"
  ];

  // Generate 3-8 random records
  const count = Math.floor(Math.random() * 6) + 3;
  const results = [];

  const jenisPengenalanOptions = [ 'Foreign ID', 'MyKad'];
  const hadKifayahOptions = ['75%', '80%', '85%', '90%', '95%'];

  for (let i = 0; i < count; i++) {
    results.push({
      id: i + 1,
      jenisPengenalanId: jenisPengenalanOptions[Math.floor(Math.random() * jenisPengenalanOptions.length)],
      pengenalanId: Math.floor(Math.random() * 900000000000) + 100000000000, // 12-digit number
      nama: mockNames[Math.floor(Math.random() * mockNames.length)],
      namaAsnaf: mockNames[Math.floor(Math.random() * mockNames.length)], // Keep for backward compatibility
      kariah: mockKariah[Math.floor(Math.random() * mockKariah.length)],
      daerah: mockDaerah[Math.floor(Math.random() * mockDaerah.length)],
      tarikh: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
      hadKifayah: hadKifayahOptions[Math.floor(Math.random() * hadKifayahOptions.length)],
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
  selectAll.value = !selectAll.value;
  if (selectAll.value) {
    // If selectAll is true, select all items
    selectedItems.value = [...searchResults.value.map(item => item.id)];
  } else {
    // If selectAll is false, deselect all items
    selectedItems.value = [];
  }
};

const toggleItemSelection = (itemId) => {
  const index = selectedItems.value.indexOf(itemId);
  if (index > -1) {
    selectedItems.value.splice(index, 1);
  } else {
    selectedItems.value.push(itemId);
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

const handleSemak = () => {
  navigateTo("/BF-PRF/AS/FR/02_readonly");
};

// Watch for changes in selected items to update select all checkbox
watch(selectedItems, (newValue) => {
  if (searchResults.value.length > 0) {
    selectAll.value = newValue.length === searchResults.value.length;
  }
}, { deep: true });

// Watch for changes in selectAll to update selectedItems
watch(selectAll, (newValue) => {
  if (newValue) {
    selectedItems.value = [...searchResults.value.map(item => item.id)];
  } else {
    selectedItems.value = [];
  }
});
</script>

<style lang="scss" scoped>
// Add any custom styles here if needed
</style>