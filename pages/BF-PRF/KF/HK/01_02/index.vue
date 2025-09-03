<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Butiran Had Kifayah Utama</h2>
          <div class="flex gap-2">
            <rs-button
              variant="primary-outline"
              @click="navigateTo('/BF-PRF/KF/HK/01_01')"
            >
              <Icon name="mdi:arrow-left" class="mr-1" /> Kembali
            </rs-button>
            <rs-button
              variant="primary"
              @click="openEditModal"
              v-if="configData.status !== 'Menunggu Kelulusan'"
              :disabled="hasPendingChanges"
            >
              <Icon name="mdi:pencil" class="mr-1" /> Kemaskini
            </rs-button>
          </div>
        </div>
      </template>

      <template #body>
                 <!-- Current Configuration -->
         <div class="mb-8">
           <h3 class="text-lg font-medium mb-4">Konfigurasi Semasa</h3>
           
           
           <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p class="text-sm text-gray-500">Kategori</p>
              <p class="font-medium">{{ configData.category }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Kategori Isi Rumah</p>
              <p class="font-medium">{{ configData.householdType }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Kadar Berbayar</p>
              <p class="font-medium">
                RM {{ formatCurrency(configData.paidHouseRate) }}
              </p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Kadar Percuma</p>
              <p class="font-medium">
                RM {{ formatCurrency(configData.freeHouseRate) }}
              </p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Tarikh Mula Kuat Kuasa</p>
              <p class="font-medium">
                {{ formatDate(configData.effectiveDate) }}
              </p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Status</p>
              <rs-badge :variant="getStatusVariant(configData.status)">
                {{ configData.status }}
              </rs-badge>
            </div>
          </div>
        </div>

        <!-- Pending Changes (if any) -->
        <div v-if="hasPendingChanges" class="border-t pt-6">
          <h3 class="text-lg font-medium mb-4">Perubahan Menunggu Kelulusan</h3>
          <div
            class="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-4"
          >
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p class="text-sm text-gray-500">Kategori</p>
                <p class="font-medium">
                  {{ pendingChanges.category }}
                  <span
                    v-if="pendingChanges.category !== configData.category"
                    class="text-xs text-yellow-700 bg-yellow-100 px-2 py-1 rounded ml-2"
                  >
                    Perubahan
                  </span>
                </p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Kategori Isi Rumah</p>
                <p class="font-medium">
                  {{ pendingChanges.householdType }}
                  <span
                    v-if="
                      pendingChanges.householdType !== configData.householdType
                    "
                    class="text-xs text-yellow-700 bg-yellow-100 px-2 py-1 rounded ml-2"
                  >
                    Perubahan
                  </span>
                </p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Kadar Berbayar</p>
                <p class="font-medium">
                  RM {{ formatCurrency(pendingChanges.paidHouseRate) }}
                  <span
                    v-if="
                      pendingChanges.paidHouseRate !== configData.paidHouseRate
                    "
                    class="text-xs text-yellow-700 bg-yellow-100 px-2 py-1 rounded ml-2"
                  >
                    {{
                      getChangeDirection(
                        configData.paidHouseRate,
                        pendingChanges.paidHouseRate
                      )
                    }}
                  </span>
                </p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Kadar Percuma</p>
                <p class="font-medium">
                  RM {{ formatCurrency(pendingChanges.freeHouseRate) }}
                  <span
                    v-if="
                      pendingChanges.freeHouseRate !== configData.freeHouseRate
                    "
                    class="text-xs text-yellow-700 bg-yellow-100 px-2 py-1 rounded ml-2"
                  >
                    {{
                      getChangeDirection(
                        configData.freeHouseRate,
                        pendingChanges.freeHouseRate
                      )
                    }}
                  </span>
                </p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Tarikh Mula Kuat Kuasa</p>
                <p class="font-medium">
                  {{ formatDate(pendingChanges.effectiveDate) }}
                  <span
                    v-if="
                      pendingChanges.effectiveDate !== configData.effectiveDate
                    "
                    class="text-xs text-yellow-700 bg-yellow-100 px-2 py-1 rounded ml-2"
                  >
                    Perubahan
                  </span>
                </p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Status</p>
                <rs-badge variant="warning"> Menunggu Kelulusan </rs-badge>
              </div>
            </div>
          </div>

          <div class="flex justify-end mt-4">
            <rs-button
              variant="danger-outline"
              size="sm"
              @click="cancelPendingChanges"
              :loading="isCancelling"
            >
              Batalkan Permohonan
            </rs-button>
          </div>
        </div>

        <!-- Change History -->
        <div class="border-t pt-6 mt-6">
          <h3 class="text-lg font-medium mb-4">Sejarah Perubahan</h3>
          <rs-table
            :data="changeHistory"
            :options="{
              variant: 'default',
              hover: true,
            }"
          >
            <template v-slot:changes="data">
              <div v-for="change in data.text" :key="change.field" class="mb-1">
                <span class="font-medium">{{ change.field }}:</span>
                <span
                  v-if="change.oldValue !== null"
                  class="text-gray-600 line-through mr-2"
                >
                  {{ change.oldValue }}
                </span>
                <span class="text-primary-600 font-medium">
                  {{ change.newValue }}
                </span>
              </div>
            </template>
          </rs-table>
        </div>
      </template>
    </rs-card>

    <!-- Edit Modal -->
    <rs-modal
      v-model="showEditModal"
      :title="isEditing ? 'Kemaskini Had Kifayah' : 'Tambah Had Kifayah'"
      size="lg"
      position="center"
      @close="resetForm"
    >
      <FormKit
        type="form"
        @submit="submitForm"
        :actions="false"
        v-model="formData"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormKit
            type="select"
            name="category"
            label="Kategori Kadar Had Kifayah"
            validation="required"
            :options="kategoriOptions"
            placeholder="Pilih kategori"
            :validation-messages="{
              required: 'Kategori adalah wajib',
            }"
          />

          <FormKit
            type="select"
            name="householdType"
            label="Kategori Isi Rumah"
            validation="required"
            :options="householdOptions"
            placeholder="Pilih kategori isi rumah"
            :validation-messages="{
              required: 'Kategori isi rumah adalah wajib',
            }"
          />

          <FormKit
            type="number"
            name="paidHouseRate"
            label="Kadar Kifayah Rumah Berbayar (RM)"
            validation="required|min:0"
            step="0.01"
            :validation-messages="{
              required: 'Kadar rumah berbayar adalah wajib',
              min: 'Nilai tidak boleh negatif',
            }"
          />

          <FormKit
            type="number"
            name="freeHouseRate"
            label="Kadar Kifayah Rumah Percuma (RM)"
            validation="required|min:0"
            step="0.01"
            :validation-messages="{
              required: 'Kadar rumah percuma adalah wajib',
              min: 'Nilai tidak boleh negatif',
            }"
          />

          <FormKit
            type="date"
            name="effectiveDate"
            label="Tarikh Mula Kuat Kuasa"
            validation="required"
            :validation-messages="{
              required: 'Tarikh mula adalah wajib',
            }"
          />

          <div
            class="bg-yellow-50 p-3 rounded border border-yellow-200 col-span-2"
          >
            <p class="text-yellow-800 text-sm">
              <Icon name="material-symbols:info-outline" class="mr-1" />
              Perhatian: Semua perubahan akan melalui proses kelulusan terlebih
              dahulu sebelum dikuat kuasa.
            </p>
          </div>
        </div>

        <div class="mt-6 flex justify-end gap-4">
          <rs-button
            variant="primary-outline"
            @click="showEditModal = false"
            type="button"
            :disabled="isSubmitting"
          >
            Batal
          </rs-button>
          <rs-button variant="primary" type="submit" :loading="isSubmitting">
            {{ isSubmitting ? "Menghantar..." : "Hantar Untuk Kelulusan" }}
          </rs-button>
        </div>
      </FormKit>

      <template #footer></template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";

definePageMeta({
  title: "Butiran Konfigurasi Had Kifayah",
});

const route = useRoute();
const router = useRouter();

const id = route.query.id;

const breadcrumb = ref([
  {
    name: "Profiling",
    type: "link",
    path: "/BF-PRF/KF/HK/01_01",
  },
  {
    name: "Had Kifayah Utama",
    type: "link",
    path: "/BF-PRF/KF/HK/01_01",
  },
  {
    name: "Butiran Konfigurasi",
    type: "current",
    path: `/BF-PRF/KF/HK/01_02?id=${id}`,
  },
]);

// Data
const configData = ref({
  id: parseInt(id),
  category: "Utama",
  householdType: "Ketua Keluarga",
  paidHouseRate: 1215.00,
  freeHouseRate: 780.00,
  effectiveDate: "2025-01-01",
  status: "Aktif",
});

// Function to fetch data based on ID
const fetchConfigData = (configId) => {
  console.log('fetchConfigData called with ID:', configId);
  // Mock data - in real app this would be an API call
  const mockData = {
    1: {
      id: 1,
      category: "Utama",
      householdType: "Ketua Keluarga",
      paidHouseRate: 1215.00,
      freeHouseRate: 780.00,
      effectiveDate: "2025-01-01",
      status: "Aktif",
    },
    2: {
      id: 2,
      category: "Utama",
      householdType: "Dewasa Bekerja",
      paidHouseRate: 412.00,
      freeHouseRate: 412.00,
      effectiveDate: "2025-01-01",
      status: "Menunggu Kelulusan",
    },
    3: {
      id: 3,
      category: "Utama",
      householdType: "Dewasa Tidak Bekerja",
      paidHouseRate: 167.00,
      freeHouseRate: 167.00,
      effectiveDate: "2025-01-01",
      status: "Aktif",
    },
    4: {
      id: 4,
      category: "Utama",
      householdType: "Tanggungan IPT",
      paidHouseRate: 613.00,
      freeHouseRate: 613.00,
      effectiveDate: "2025-01-01",
      status: "Tidak Aktif",
    },
    5: {
      id: 5,
      category: "Utama",
      householdType: "Tanggungan 7-17 Tahun",
      paidHouseRate: 408.00,
      freeHouseRate: 408.00,
      effectiveDate: "2025-01-01",
      status: "Aktif",
    },
    6: {
      id: 6,
      category: "Utama",
      householdType: "Tanggungan 6 Tahun ke Bawah",
      paidHouseRate: 175.00,
      freeHouseRate: 175.00,
      effectiveDate: "2025-01-01",
      status: "Menunggu Kelulusan",
    },
    7: {
      id: 7,
      category: "Tambahan",
      householdType: "OKU",
      paidHouseRate: 247.00,
      freeHouseRate: 247.00,
      effectiveDate: "2025-01-01",
      status: "Aktif",
    },
    8: {
      id: 8,
      category: "Tambahan",
      householdType: "Pesakit Kronik",
      paidHouseRate: 243.00,
      freeHouseRate: 243.00,
      effectiveDate: "2025-01-01",
      status: "Aktif",
    },
    9: {
      id: 9,
      category: "Tambahan",
      householdType: "Penjagaan Anak < 12 Tahun",
      paidHouseRate: 330.00,
      freeHouseRate: 330.00,
      effectiveDate: "2025-01-01",
      status: "Tidak Aktif",
    },
  };

  const data = mockData[configId];
  console.log('Found data for ID', configId, ':', data);
  if (data) {
    configData.value = { ...data };
    console.log('Updated configData:', configData.value);
  } else {
    // Handle case when ID not found
    console.error(`Configuration with ID ${configId} not found`);
  }
};

const pendingChanges = ref(null);
const isCancelling = ref(false);
const changeHistory = ref([
  {
    date: "2025-03-15",
    changedBy: "Ahmad bin Ali",
    changes: [
      { field: "Kadar Berbayar", oldValue: "RM 200.00", newValue: "RM 250.00" },
      {
        field: "Tarikh Mula",
        oldValue: "15 Mac 2025",
        newValue: "1 April 2025",
      },
    ],
    status: "Tidak Diluluskan",
  },
  {
    date: "2025-01-10",
    changedBy: "Siti binti Abu",
    changes: [{ field: "Status", oldValue: "Tidak Aktif", newValue: "Aktif" }],
    status: "Diluluskan",
  },
  {
    date: "2024-12-01",
    changedBy: "System",
    changes: [
      {
        field: "Rekod dicipta",
        oldValue: null,
        newValue: "Konfigurasi baharu",
      },
    ],
    status: "Diluluskan",
  },
]);

// Form state
const showEditModal = ref(false);
const isEditing = ref(false);
const isSubmitting = ref(false);
const formData = ref({
  id: null,
  category: "",
  householdType: "",
  paidHouseRate: 0,
  freeHouseRate: 0,
  effectiveDate: "",
});

// Options
const kategoriOptions = [
  { label: "Utama", value: "Utama" },
  { label: "Tambahan", value: "Tambahan" },
];

const householdOptions = [
  // Kategori Utama - Default (cannot be added via form)
  { label: "Ketua Keluarga", value: "Ketua Keluarga" },
  { label: "Dewasa Bekerja", value: "Dewasa Bekerja" },
  { label: "Dewasa Tidak Bekerja", value: "Dewasa Tidak Bekerja" },
  { label: "Tanggungan IPT", value: "Tanggungan IPT" },
  { label: "Tanggungan 7-17 Tahun", value: "Tanggungan 7-17 Tahun" },
  { label: "Tanggungan 6 Tahun ke Bawah", value: "Tanggungan 6 Tahun ke Bawah" },
  
  // Kategori Utama - Additional
  { label: "Penjaga Bukan Keluarga", value: "Penjaga Bukan Keluarga" },
  { label: "Tanggungan Tahfiz", value: "Tanggungan Tahfiz" },
  { label: "Anak Angkat", value: "Anak Angkat" },
  { label: "Ibu Bapa Tiri", value: "Ibu Bapa Tiri" },
  { label: "Saudara Kandung", value: "Saudara Kandung" },
  { label: "Nenek/Datuk", value: "Nenek/Datuk" },
  { label: "Cucu", value: "Cucu" },
  { label: "Penjaga Khas", value: "Penjaga Khas" },
  { label: "Tanggungan Dewasa OKU", value: "Tanggungan Dewasa OKU" },
  { label: "Anak Yatim Piatu", value: "Anak Yatim Piatu" },
  
  // Kategori Tambahan - Default
  { label: "OKU", value: "OKU" },
  { label: "Pesakit Kronik", value: "Pesakit Kronik" },
  { label: "Penjagaan Anak < 12 Tahun", value: "Penjagaan Anak < 12 Tahun" },
  
  // Kategori Tambahan - Additional
  { label: "Warga Emas", value: "Warga Emas" },
  { label: "Keperluan Terapi", value: "Keperluan Terapi" },
  { label: "Keperluan Pemulihan", value: "Keperluan Pemulihan" },
  { label: "Bantuan Perubatan", value: "Bantuan Perubatan" },
  { label: "Keperluan Diet Khas", value: "Keperluan Diet Khas" },
  { label: "Alat Bantu Mobility", value: "Alat Bantu Mobility" },
  { label: "Keperluan Pendidikan Khas", value: "Keperluan Pendidikan Khas" },
  { label: "Rawatan Jangka Panjang", value: "Rawatan Jangka Panjang" },
  { label: "Keperluan Penjagaan Harian", value: "Keperluan Penjagaan Harian" },
  { label: "Bantuan Teknologi Assistive", value: "Bantuan Teknologi Assistive" },
];

// Computed
const hasPendingChanges = computed(() => {
  return pendingChanges.value !== null;
});

// Fetch data when component mounts
onMounted(() => {
  console.log('Component mounted, ID:', id);
  if (id) {
    console.log('Fetching data for ID:', id);
    fetchConfigData(parseInt(id));
  } else {
    console.log('No ID found in query parameters');
  }
});

// Watch for route changes
watch(() => route.query.id, (newId) => {
  console.log('Route query ID changed to:', newId);
  if (newId) {
    fetchConfigData(parseInt(newId));
  }
}, { immediate: true });

// Methods
const openEditModal = () => {
  isEditing.value = true;
  formData.value = {
    ...configData.value,
    paidHouseRate: parseFloat(configData.value.paidHouseRate),
    freeHouseRate: parseFloat(configData.value.freeHouseRate),
    effectiveDate: formatDateForPicker(configData.value.effectiveDate),
  };
  showEditModal.value = true;
};

const submitForm = async () => {
  isSubmitting.value = true;

  try {
    // Validate form data
    if (!formData.value.category || !formData.value.householdType) {
      throw new Error("Sila isi semua medan yang diperlukan");
    }

    // Create pending changes
    pendingChanges.value = {
      ...formData.value,
      status: "Menunggu Kelulusan",
    };

    alert("Permohonan kemaskini telah dihantar untuk kelulusan");
    showEditModal.value = false;
  } catch (error) {
    alert("Ralat semasa menyimpan perubahan");
  } finally {
    isSubmitting.value = false;
  }
};

const cancelPendingChanges = async () => {
  isCancelling.value = true;
  try {
    // In real app, call API to cancel pending changes
    pendingChanges.value = null;
    alert("Permohonan kemaskini telah dibatalkan");
  } catch (error) {
    alert("Gagal membatalkan permohonan");
  } finally {
    isCancelling.value = false;
  }
};

const resetForm = () => {
  formData.value = {
    id: null,
    category: "",
    householdType: "",
    paidHouseRate: 0,
    freeHouseRate: 0,
    effectiveDate: "",
  };
  isEditing.value = false;
};

// Helper functions
const formatDate = (dateString) => {
  if (!dateString) return "";
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString("ms-MY", options);
};

const formatDateForPicker = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
};

const formatCurrency = (value) => {
  if (value === undefined || value === null) return "0.00";
  return parseFloat(value).toFixed(2);
};

const getStatusVariant = (status) => {
  switch (status) {
    case "Aktif":
      return "success";
    case "Tidak Aktif":
      return "danger";
    case "Menunggu Kelulusan":
      return "warning";
    default:
      return "default";
  }
};

const getChangeDirection = (oldValue, newValue) => {
  if (newValue > oldValue) return "↑ Naik";
  if (newValue < oldValue) return "↓ Turun";
  return "Tiada perubahan";
};
</script>
