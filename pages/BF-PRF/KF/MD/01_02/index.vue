<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Loading State -->
    <div v-if="loading" class="mt-4 text-center">
      <Icon name="mdi:loading" class="animate-spin text-blue-500 mb-2" size="32px" />
      <p class="text-gray-600">Memuatkan maklumat...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="mt-4">
      <rs-card>
        <template #body>
          <div class="text-center py-8">
            <Icon name="mdi:alert-circle" class="text-red-500 mb-4" size="48px" />
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Ralat</h3>
            <p class="text-gray-600">{{ error }}</p>
            <rs-button variant="primary" @click="goBack" class="mt-4">
              <Icon name="mdi:arrow-left" class="mr-2" /> Kembali
            </rs-button>
          </div>
        </template>
      </rs-card>
    </div>

    <!-- Main Content -->
    <div v-else-if="selectedMultidimensi" class="space-y-6">
      <!-- Header Card -->
      <rs-card>
        <template #header>
          <h2 class="text-xl font-semibold">Multidimensi</h2>
        </template>
      </rs-card>

      <!-- Action Buttons Below Title Card -->
      <div class="flex justify-end gap-3"></div>

      <!-- Toolbar Above Maklumat Multidimensi Section -->
      <div class="flex justify-end">
        <rs-button variant="primary" class="px-6 py-3" @click="openEditMaklumatAsas">
          <Icon name="mdi:pencil" class="mr-2" /> Kemaskini Maklumat
        </rs-button>
      </div>

      <!-- Main Information Card -->
      <rs-card>
        <template #header>
          <h3 class="text-lg font-semibold">Maklumat Multidimensi</h3>
        </template>
        <template #body>
          <div class="space-y-4">
            <div class="flex items-center py-2 border-b border-gray-100">
              <span class="text-sm font-medium text-gray-600 w-40">Nama:</span>
              <span class="text-sm text-gray-900">{{ selectedMultidimensi.namaHadKifayah }}</span>
            </div>
            <div class="flex items-center py-2 border-b border-gray-100">
              <span class="text-sm font-medium text-gray-600 w-40">Keterangan:</span>
              <span class="text-sm text-gray-900">{{ selectedMultidimensi.keterangan || 'N/A' }}</span>
            </div>
            <div class="flex items-center py-2 border-b border-gray-100">
              <span class="text-sm font-medium text-gray-600 w-40">Formula 19:</span>
              <span class="text-sm text-gray-900">{{ selectedMultidimensi.Formula_19 || 'N/A' }}</span>
            </div>
            <div class="flex items-center py-2 border-b border-gray-100">
              <span class="text-sm font-medium text-gray-600 w-40">Formula 18:</span>
              <span class="text-sm text-gray-900">{{ selectedMultidimensi.Formula_18 || 'N/A' }}</span>
            </div>
            <div class="flex items-center py-2 border-b border-gray-100">
              <span class="text-sm font-medium text-gray-600 w-40">Tarikh Mula:</span>
              <span class="text-sm text-gray-900">{{ formatDate(selectedMultidimensi.tarikhMula) }}</span>
            </div>
            <div class="flex items-center py-2 border-b border-gray-100">
              <span class="text-sm font-medium text-gray-600 w-40">Tarikh Tamat:</span>
              <span class="text-sm text-gray-900">{{ formatDate(selectedMultidimensi.tarikhTamat) }}</span>
            </div>
            <div class="flex items-center py-2 border-b border-gray-100">
              <span class="text-sm font-medium text-gray-600 w-40">Status:</span>
              <rs-badge :variant="getStatusVariant(selectedMultidimensi.status)">
                {{ selectedMultidimensi.status }}
              </rs-badge>
            </div>
            <div class="flex items-center py-2 border-b border-gray-100">
              <span class="text-sm font-medium text-gray-600 w-40">Status Data:</span>
              <rs-badge :variant="getStatusVariant(selectedMultidimensi.statusData || selectedMultidimensi.status)">
                {{ selectedMultidimensi.statusData || selectedMultidimensi.status || 'Draf' }}
              </rs-badge>
            </div>
          </div>
        </template>
      </rs-card>

      <!-- Toolbar Above Kategori Multidimensi Section -->
      <div class="flex justify-end gap-3">
        <rs-button
          variant="primary"
          @click="navigateTo(`/BF-PRF/KF/MD/01_03?id=${selectedId}`)"
          class="px-6 py-3"
        >
          <Icon name="mdi:folder-plus" class="mr-2" /> Tambah Kategori Multidimensi
        </rs-button>
      </div>

      <!-- Kategori Multidimensi Section -->
      <rs-card v-if="kategoriData.length > 0">
        <template #header>
          <h3 class="text-lg font-semibold">Kategori Multidimensi</h3>
        </template>
        <template #body>
          <rs-table
            class="mt-4"
            :data="kategoriData"
            :field="['kategori', 'pemberat', 'skor_tertinggi', 'status', 'status_data', 'jadual_skor_lov', 'tarikhMula', 'tarikhTamat', 'tindakan']"
            :pageSize="10"
            :showNoColumn="true"
            :options="{
              variant: 'default',
              hover: true,
            }"
          >
            <template v-slot:kategori="data">
              <span class="font-medium">{{ data.value.kategori }}</span>
            </template>
            <template v-slot:pemberat="data">{{ data.value.pemberat }}</template>
            <template v-slot:skor_tertinggi="data">{{ data.value.skor_tertinggi }}</template>
            <template v-slot:status="data">
              <rs-badge :variant="getStatusVariant(data.value.status)">
                {{ data.value.status }}
              </rs-badge>
            </template>
            <template v-slot:status_data="data">
              <rs-badge :variant="getStatusVariant(data.value.statusData || data.value.status)">
                {{ data.value.statusData || data.value.status || 'Draf' }}
              </rs-badge>
            </template>
            <template v-slot:jadual_skor_lov="data">
              <div class="flex flex-wrap gap-1">
                <span 
                  v-for="(lov, idx) in (data.value.jadual_skor_lov_array || [])" 
                  :key="idx"
                  class="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                >
                  {{ lov }}
                </span>
              </div>
            </template>
            <template v-slot:tarikhMula="data">{{ formatDate(data.value.tarikhMula) }}</template>
            <template v-slot:tarikhTamat="data">{{ formatDate(data.value.tarikhTamat) }}</template>
            <template v-slot:tindakan="data">
              <rs-button
                variant="primary"
                size="sm"
                class="!px-2 !py-1"
                @click="openEditKategori(data.value, data.index)"
              >
                Kemaskini
                <Icon name="mdi:pencil" class="ml-1" size="1rem" />
              </rs-button>
              <rs-button
                variant="danger"
                size="sm"
                class="!px-2 !py-1 ml-2"
                @click="deleteKategori(data.value, data.index)"
              >
                Buang
                <Icon name="mdi:delete" class="ml-1" size="1rem" />
              </rs-button>
            </template>
          </rs-table>
        </template>
      </rs-card>

      <!-- Toolbar Above Kuadran Section -->
      <div class="flex justify-end gap-3">
        <rs-button
          variant="secondary"
          @click="navigateTo(`/BF-PRF/KF/MD/01_06?id=${selectedId}`)"
          class="px-6 py-3"
        >
          <Icon name="mdi:chart-box" class="mr-2" /> Kuadran
        </rs-button>
      </div>

      <!-- Kuadran Section -->
      <rs-card v-if="kuadranData.length > 0">
        <template #header>
          <h3 class="text-lg font-semibold">Kuadran</h3>
        </template>
        <template #body>
          <rs-table
            class="mt-4"
            :data="kuadranData"
            :field="['kuadran', 'min_merit', 'max_merit', 'status_multidimensi', 'status', 'status_data', 'tarikhMula', 'tarikhTamat', 'tindakan']"
            :pageSize="10"
            :showNoColumn="true"
            :options="{
              variant: 'default',
              hover: true,
            }"
          >
            <template v-slot:kuadran="data">
              <span class="font-medium">{{ data.value.kuadran || data.value.namaKuadran || 'N/A' }}</span>
            </template>
            <template v-slot:min_merit="data">{{ data.value.min_merit || 'N/A' }}</template>
            <template v-slot:max_merit="data">{{ data.value.max_merit || 'N/A' }}</template>
            <template v-slot:status_multidimensi="data">
              <rs-badge :variant="getStatusVariant(data.value.status_multidimensi)">
                {{ data.value.status_multidimensi || 'N/A' }}
              </rs-badge>
            </template>
            <template v-slot:status="data">
              <rs-badge :variant="getStatusVariant(data.value.status)">
                {{ data.value.status || 'Aktif' }}
              </rs-badge>
            </template>
            <template v-slot:status_data="data">
              <rs-badge :variant="getStatusVariant(data.value.status_data)">
                {{ data.value.status_data || 'N/A' }}
              </rs-badge>
            </template>
            <template v-slot:tarikhMula="data">{{ formatDate(data.value.tarikhMula) }}</template>
            <template v-slot:tarikhTamat="data">{{ formatDate(data.value.tarikhTamat) }}</template>
            <template v-slot:tindakan="data">
              <rs-button
                variant="primary"
                size="sm"
                class="!px-2 !py-1"
                @click="openEditKuadran(data.value, data.index)"
              >
                Kemaskini
                <Icon name="mdi:pencil" class="ml-1" size="1rem" />
              </rs-button>
              <rs-button
                variant="danger"
                size="sm"
                class="!px-2 !py-1 ml-2"
                @click="deleteKuadran(data.value, data.index)"
              >
                Buang
                <Icon name="mdi:delete" class="ml-1" size="1rem" />
              </rs-button>
            </template>
          </rs-table>
        </template>
      </rs-card>

      

      <!-- Edit Maklumat Modal -->
      <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-black/40" @click="closeEditMaklumatAsas"></div>
        <div class="relative bg-white rounded-lg shadow-xl w-full max-w-xl mx-4">
          <div class="px-6 py-4 border-b">
            <h3 class="text-lg font-semibold">Kemaskini Maklumat Multidimensi</h3>
          </div>
          <div class="px-6 py-4 space-y-4">
            <div class="flex items-center">
              <label class="text-sm font-medium text-gray-700 w-40">Nama</label>
              <input v-model="editForm.namaHadKifayah" type="text" class="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div class="flex items-center">
              <label class="text-sm font-medium text-gray-700 w-40">Keterangan</label>
              <input v-model="editForm.keterangan" type="text" class="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div class="flex items-center">
              <label class="text-sm font-medium text-gray-700 w-40">Formula 19</label>
              <input v-model="editForm.Formula_19" type="text" class="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div class="flex items-center">
              <label class="text-sm font-medium text-gray-700 w-40">Formula 18</label>
              <input v-model="editForm.Formula_18" type="text" class="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div class="flex items-center">
              <label class="text-sm font-medium text-gray-700 w-40">Tarikh Mula</label>
              <input v-model="editForm.tarikhMula" type="date" class="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div class="flex items-center">
              <label class="text-sm font-medium text-gray-700 w-40">Tarikh Tamat</label>
              <input v-model="editForm.tarikhTamat" type="date" class="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div class="flex items-center">
              <label class="text-sm font-medium text-gray-700 w-40">Status</label>
              <select v-model="editForm.status" class="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="Aktif">Aktif</option>
                <option value="Tidak Aktif">Tidak Aktif</option>
                <option value="Menunggu Kelulusan">Menunggu Kelulusan</option>
              </select>
            </div>
            <div class="flex items-center">
              <label class="text-sm font-medium text-gray-700 w-40">Status Data</label>
              <select v-model="editForm.statusData" class="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="Draf">Draf</option>
                <option value="Menunggu Kelulusan">Menunggu Kelulusan</option>
              </select>
            </div>
          </div>
          <div class="px-6 py-4 border-t flex justify-end gap-2">
            <rs-button variant="secondary" @click="closeEditMaklumatAsas">Batal</rs-button>
            <rs-button variant="primary" @click="saveMaklumatAsas">
              <Icon name="mdi:content-save" class="mr-2" /> Simpan
            </rs-button>
          </div>
        </div>
      </div>

      <!-- Edit Kategori Modal -->
      <div v-if="showKategoriModal" class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-black/40" @click="closeEditKategori"></div>
        <div class="relative bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
          <div class="px-6 py-4 border-b">
            <h3 class="text-lg font-semibold">Kemaskini Kategori</h3>
          </div>
          <div class="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="text-sm font-medium text-gray-700">Kategori</label>
              <input v-model="kategoriForm.kategori" type="text" class="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Pemberat</label>
              <input v-model="kategoriForm.pemberat" type="text" class="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Skor Tertinggi</label>
              <input v-model="kategoriForm.skor_tertinggi" type="text" class="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div class="md:col-span-2">
              <label class="text-sm font-medium text-gray-700">Jadual Skor LOV</label>
              <input v-model="kategoriForm.jadual_skor_lov" type="text" placeholder="Contoh: Skor 1, Skor 2, Skor 3" class="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <p class="text-xs text-gray-500 mt-1">Pisahkan dengan koma. Contoh: A, B, C</p>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Status</label>
              <select v-model="kategoriForm.status" class="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="Aktif">Aktif</option>
                <option value="Tidak Aktif">Tidak Aktif</option>
              </select>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Status Data</label>
              <select v-model="kategoriForm.statusData" class="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="Draf">Draf</option>
                <option value="Menunggu Kelulusan">Menunggu Kelulusan</option>
              </select>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Tarikh Mula</label>
              <input v-model="kategoriForm.tarikhMula" type="date" class="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Tarikh Tamat</label>
              <input v-model="kategoriForm.tarikhTamat" type="date" class="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div class="px-6 py-4 border-t flex justify-end gap-2">
            <rs-button variant="secondary" @click="closeEditKategori">Batal</rs-button>
            <rs-button variant="primary" @click="saveKategori">
              <Icon name="mdi:content-save" class="mr-2" /> Simpan
            </rs-button>
          </div>
        </div>
      </div>

      <!-- Edit Kuadran Modal -->
      <div v-if="showKuadranModal" class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-black/40" @click="closeEditKuadran"></div>
        <div class="relative bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
          <div class="px-6 py-4 border-b">
            <h3 class="text-lg font-semibold">Kemaskini Kuadran</h3>
          </div>
          <div class="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="text-sm font-medium text-gray-700">Kuadran</label>
              <input v-model="kuadranForm.kuadran" type="text" class="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Min Merit</label>
              <input v-model="kuadranForm.min_merit" type="text" class="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Max Merit</label>
              <input v-model="kuadranForm.max_merit" type="text" class="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Status Multidimensi</label>
              <select v-model="kuadranForm.status_multidimensi" class="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="Aktif">Aktif</option>
                <option value="Tidak Aktif">Tidak Aktif</option>
              </select>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Status</label>
              <select v-model="kuadranForm.status" class="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="Aktif">Aktif</option>
                <option value="Tidak Aktif">Tidak Aktif</option>
              </select>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Status Data</label>
              <select v-model="kuadranForm.status_data" class="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="Draf">Draf</option>
                <option value="Menunggu Kelulusan">Menunggu Kelulusan</option>
              </select>
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Tarikh Mula</label>
              <input v-model="kuadranForm.tarikhMula" type="date" class="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label class="text-sm font-medium text-gray-700">Tarikh Tamat</label>
              <input v-model="kuadranForm.tarikhTamat" type="date" class="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div class="px-6 py-4 border-t flex justify-end gap-2">
            <rs-button variant="secondary" @click="closeEditKuadran">Batal</rs-button>
            <rs-button variant="primary" @click="saveKuadran">
              <Icon name="mdi:content-save" class="mr-2" /> Simpan
            </rs-button>
          </div>
        </div>
      </div>

    </div>

    <!-- Not Found State -->
    <div v-else class="mt-4">
      <rs-card>
        <template #body>
          <div class="text-center py-8">
            <Icon name="mdi:file-search" class="text-gray-400 mb-4" size="48px" />
            <h3 class="text-lg font-semibold text-gray-900 mb-2">Rekod Tidak Ditemui</h3>
            <p class="text-gray-600">Maklumat Had Kifayah dengan ID "{{ selectedId }}" tidak ditemui.</p>
            <rs-button variant="primary" @click="goBack" class="mt-4">
              <Icon name="mdi:arrow-left" class="mr-2" /> Kembali
            </rs-button>
          </div>
        </template>
      </rs-card>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onActivated, nextTick } from "vue";

definePageMeta({
  title: "Maklumat Had Kifayah",
});

// Get query parameters
const route = useRoute();
const selectedId = route.query.id;

const breadcrumb = ref([
  {
    name: "Profiling",
    type: "link",
    path: "/BF-PRF/KF/MD/admin",
  },
  {
    name: "Senarai Multidimensi",
    type: "link",
    path: "/BF-PRF/KF/MD/01_01",
  },
  {
    name: "Maklumat Multidimensi",
    type: "current",
    path: "/BF-PRF/KF/MD/01_02",
  },
]);

// State management
const loading = ref(true);
const error = ref(null);
const selectedMultidimensi = ref(null);
const allMultidimensiData = ref([]);
const isSubmitting = ref(false);
const showEditModal = ref(false);
const kategoriData = ref([]);
const kuadranData = ref([]);
const showKategoriModal = ref(false);
const showKuadranModal = ref(false);
const editingKategoriIndex = ref(-1);
const editingKuadranIndex = ref(-1);
const kategoriForm = ref({
  kategori: '',
  pemberat: '',
  skor_tertinggi: '',
  status: 'Aktif',
  jadual_skor_lov: '',
  jadual_skor_lov_array: [],
  statusData: 'Draf',
  tarikhMula: '',
  tarikhTamat: ''
});
const kuadranForm = ref({
  kuadran: '',
  min_merit: '',
  max_merit: '',
  status_multidimensi: 'Aktif',
  status: 'Aktif',
  status_data: 'Draf',
  tarikhMula: '',
  tarikhTamat: ''
});
const editForm = ref({
  namaHadKifayah: '',
  keterangan: '',
  Formula_19: '',
  Formula_18: '',
  tarikhMula: '',
  tarikhTamat: '',
  status: 'Aktif',
  statusData: 'Draf'
});

// Form data
const formData = reactive({
  namaHadKifayah: "",
  keterangan: "",
  Formula_19: "",
  Formula_18: "",
  
  tarikhMula: "",
  tarikhTamat: "",
  status: "",
  statusData: "",
});

// Status options
const statusOptions = [
  { label: "Aktif", value: "Aktif" },
  { label: "Tidak Aktif", value: "Tidak Aktif" },
  { label: "Menunggu Kelulusan", value: "Menunggu Kelulusan" },
];

// Status Data options
const statusDataOptions = [
  { label: "Draf", value: "Draf" },
  { label: "Menunggu Kelulusan", value: "Menunggu Kelulusan" },
];

// Default data (fallback if no data in localStorage)
const defaultData = [
  {
    idHadKifayah: "HK001",
    namaHadKifayah: "Ketua Keluarga",
    kategori: "Utama",
    jenisIsiRumah: "Ketua Keluarga",
    kadarBerbayar: 1215.00,
    kadarPercuma: 780.00,
    tarikhMula: "2025-01-01",
    tarikhTamat: "2025-12-31",
    status: "Aktif",
    tindakan: 1,
    keterangan: "Had kifayah untuk ketua keluarga",
    Formula_19: "Formula 19 Value",
    Formula_18: "Formula 18 Value",
  },
];

// Function to validate and sanitize data item
const validateDataItem = (item) => {
  return {
    ...item,
    // Ensure numeric values are valid
    kadarBerbayar: isNaN(parseFloat(item.kadarBerbayar)) ? 0 : parseFloat(item.kadarBerbayar),
    kadarPercuma: isNaN(parseFloat(item.kadarPercuma)) ? 0 : parseFloat(item.kadarPercuma),
    // Ensure dates are valid
    tarikhMula: item.tarikhMula && !isNaN(new Date(item.tarikhMula).getTime()) ? item.tarikhMula : "2025-01-01",
    tarikhTamat: item.tarikhTamat && !isNaN(new Date(item.tarikhTamat).getTime()) ? item.tarikhTamat : "2025-12-31",
    // Ensure status is valid
    status: item.status || "Aktif"
  };
};


// Function to load data from localStorage
const loadData = () => {
  try {
    loading.value = true;
    error.value = null;
    
    const savedData = localStorage.getItem('multidimensi');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      // Validate and sanitize parsed data
      const validatedData = parsedData.map(validateDataItem);
      
      // Merge with default data, giving priority to saved data
      const mergedData = [...defaultData];
      validatedData.forEach(savedItem => {
        // Check if item already exists in default data
        const existingIndex = mergedData.findIndex(item => item.idHadKifayah === savedItem.idHadKifayah);
        if (existingIndex >= 0) {
          // Replace existing item
          mergedData[existingIndex] = validateDataItem(savedItem);
        } else {
          // Add new item
          mergedData.push(validateDataItem(savedItem));
        }
      });
      allMultidimensiData.value = assignRowNumbers(mergedData);
    } else {
      allMultidimensiData.value = assignRowNumbers(defaultData);
    }
    
    // Find the selected item
    if (selectedId) {
      // Prefer matching by stable IDs first (string compare)
      selectedMultidimensi.value = allMultidimensiData.value.find(item => String(item.idMultidimensi || item.idHadKifayah) === String(selectedId));
      // Fallback to legacy numeric row selection
      if (!selectedMultidimensi.value) {
        const numericId = Number(selectedId);
        selectedMultidimensi.value = allMultidimensiData.value.find(item => item.no === numericId);
      }
      if (!selectedMultidimensi.value) {
        error.value = `Rekod dengan ID "${selectedId}" tidak ditemui.`;
      } else {
        // Load kategori and kuadran data when record is found
        loadKategoriData();
        loadKuadranData();
      }
    } else {
      error.value = "ID Multidimensi tidak disediakan.";
    }
    
  } catch (error) {
    console.error('Error loading data:', error);
    error.value = "Ralat semasa memuatkan data.";
    allMultidimensiData.value = defaultData;
  } finally {
    loading.value = false;
  }
};

// Ensure each row has a stable `no` field; preserve existing `no` if present
const assignRowNumbers = (items) => {
  return (items || []).map((item, index) => ({ ...item, no: item.no || index + 1 }));
};

// Navigation function
const goBack = () => {
  navigateTo('/BF-PRF/KF/MD/01_01');
};

// Edit modal handlers (mirror HK behaviour, adapted to MD fields)
const openEditMaklumatAsas = () => {
  if (!selectedMultidimensi.value) return;
  editForm.value = {
    namaHadKifayah: selectedMultidimensi.value.namaHadKifayah || '',
    keterangan: selectedMultidimensi.value.keterangan || '',
    Formula_19: selectedMultidimensi.value.Formula_19 || '',
    Formula_18: selectedMultidimensi.value.Formula_18 || '',
    tarikhMula: selectedMultidimensi.value.tarikhMula || '',
    tarikhTamat: selectedMultidimensi.value.tarikhTamat || '',
    status: selectedMultidimensi.value.status || 'Aktif',
    statusData: selectedMultidimensi.value.statusData || selectedMultidimensi.value.status || 'Draf'
  };
  showEditModal.value = true;
};

const closeEditMaklumatAsas = () => {
  showEditModal.value = false;
};

const saveMaklumatAsas = () => {
  if (!selectedMultidimensi.value) return;
  // Update the selected item
  const updated = {
    ...selectedMultidimensi.value,
    ...editForm.value,
  };
  selectedMultidimensi.value = updated;

  // Persist back into the array kept in localStorage ("multidimensi")
  try {
    const savedDataRaw = localStorage.getItem('multidimensi');
    let all = [];
    if (savedDataRaw) {
      all = JSON.parse(savedDataRaw);
    }
    const idx = all.findIndex(item => String(item.idMultidimensi || item.idHadKifayah) === String(selectedId));
    if (idx >= 0) {
      all[idx] = { ...all[idx], ...updated };
    } else {
      all.push({ ...(updated || {}), idMultidimensi: selectedId });
    }
    localStorage.setItem('multidimensi', JSON.stringify(all));
    const { $toast } = useNuxtApp();
    if ($toast) $toast.success('Maklumat telah dikemaskini');
  } catch (e) {
    console.error('Gagal menyimpan data multidimensi:', e);
  }

  showEditModal.value = false;
};

// Handle form submission
const handleSubmit = async (formData) => {
  isSubmitting.value = true;
  
  try {
    // Load existing data
    const existingData = loadExistingData();
    
    // Find the current record and update it (support both idMultidimensi and legacy idHadKifayah)
    const recordIndex = existingData.findIndex(item => (item.idMultidimensi || item.idHadKifayah) == selectedId);
    
    if (recordIndex >= 0) {
      // Update existing record
      existingData[recordIndex] = {
        ...existingData[recordIndex],
        namaHadKifayah: formData.namaHadKifayah,
        keterangan: formData.keterangan,
        Formula_19: formData.Formula_19,
        Formula_18: formData.Formula_18,
        
        tarikhMula: formData.tarikhMula,
        tarikhTamat: formData.tarikhTamat,
        status: formData.status,
        statusData: formData.statusData,
      };
    } else {
      // Create new record if not found
      const newRecord = {
        idMultidimensi: selectedId,
        namaHadKifayah: formData.namaHadKifayah,
        keterangan: formData.keterangan,
        Formula_19: formData.Formula_19,
        Formula_18: formData.Formula_18,
        
        tarikhMula: formData.tarikhMula,
        tarikhTamat: formData.tarikhTamat,
        status: formData.status,
        statusData: formData.statusData,
        tindakan: existingData.length + 1,
      };
      existingData.push(newRecord);
    }
    
    // Save to localStorage
    localStorage.setItem('multidimensi', JSON.stringify(existingData));
    
    // Show success message
    console.log('Data saved successfully:', formData);
    alert('Data berjaya disimpan!');
    
    // Navigate back
    await navigateTo('/BF-PRF/KF/MD/01_01');
    
  } catch (error) {
    console.error('Error saving data:', error);
    alert('Ralat semasa menyimpan data.');
  } finally {
    isSubmitting.value = false;
  }
};

// Function to load existing data from localStorage
const loadExistingData = () => {
  try {
    const savedData = localStorage.getItem('multidimensi');
    if (savedData) {
      return JSON.parse(savedData);
    }
  } catch (error) {
    console.error('Error loading existing data:', error);
  }
  return [];
};

// Populate form with existing data
const populateForm = () => {
  if (selectedMultidimensi.value) {
    formData.namaHadKifayah = selectedMultidimensi.value.namaHadKifayah || "";
    formData.keterangan = selectedMultidimensi.value.keterangan || "";
    formData.Formula_19 = selectedMultidimensi.value.Formula_19 || "";
    formData.Formula_18 = selectedMultidimensi.value.Formula_18 || "";
    formData.kadarBerbayar = selectedMultidimensi.value.kadarBerbayar || "";
    formData.tarikhMula = selectedMultidimensi.value.tarikhMula || "";
    formData.tarikhTamat = selectedMultidimensi.value.tarikhTamat || "";
    formData.status = selectedMultidimensi.value.status || "";
    formData.statusData = selectedMultidimensi.value.statusData || selectedMultidimensi.value.status || "Draf";
  }
};


// Make sure the data loads when component mounts
onMounted(() => {
  loadData();
  // Populate form after data is loaded
  nextTick(() => {
    populateForm();
  });
});

// Also refresh when the page becomes visible
onActivated(() => {
  loadData();
});

// Load kategori data for the selected multidimensi
const loadKategoriData = () => {
  try {
    const savedKategori = localStorage.getItem('multidimensi_kategori');
    if (savedKategori && selectedId) {
      const allKategori = JSON.parse(savedKategori);
      kategoriData.value = allKategori[selectedId] || [];
    } else {
      kategoriData.value = [];
    }
  } catch (error) {
    console.error('Error loading kategori data:', error);
    kategoriData.value = [];
  }
};

// Load kuadran data for the selected multidimensi
const loadKuadranData = () => {
  try {
    const savedKuadran = localStorage.getItem('multidimensi_kuadran');
    if (savedKuadran && selectedId) {
      const allKuadran = JSON.parse(savedKuadran);
      kuadranData.value = allKuadran[selectedId] || [];
    } else {
      kuadranData.value = [];
    }
  } catch (error) {
    console.error('Error loading kuadran data:', error);
    kuadranData.value = [];
  }
};

// Kategori functions
const openEditKategori = (kategori, index) => {
  editingKategoriIndex.value = index;
  kategoriForm.value = {
    kategori: kategori.kategori || '',
    pemberat: kategori.pemberat || '',
    skor_tertinggi: kategori.skor_tertinggi || '',
    status: kategori.status || 'Aktif',
    jadual_skor_lov: kategori.jadual_skor_lov || (Array.isArray(kategori.jadual_skor_lov_array) ? kategori.jadual_skor_lov_array.join(', ') : ''),
    jadual_skor_lov_array: kategori.jadual_skor_lov_array || [],
    statusData: kategori.statusData || kategori.status || 'Draf',
    tarikhMula: kategori.tarikhMula || '',
    tarikhTamat: kategori.tarikhTamat || ''
  };
  showKategoriModal.value = true;
};

const closeEditKategori = () => {
  showKategoriModal.value = false;
  editingKategoriIndex.value = -1;
};

const saveKategori = () => {
  if (editingKategoriIndex.value >= 0) {
    const normalized = { ...kategoriForm.value };
    // Normalize jadual_skor_lov into array field as well
    if (typeof normalized.jadual_skor_lov === 'string') {
      normalized.jadual_skor_lov_array = normalized.jadual_skor_lov
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
    }
    kategoriData.value[editingKategoriIndex.value] = normalized;
    // Save to localStorage
    const savedKategori = localStorage.getItem('multidimensi_kategori');
    const allKategori = savedKategori ? JSON.parse(savedKategori) : {};
    allKategori[selectedId] = kategoriData.value;
    localStorage.setItem('multidimensi_kategori', JSON.stringify(allKategori));
    
    const { $toast } = useNuxtApp();
    if ($toast) $toast.success('Kategori berjaya dikemaskini');
  }
  closeEditKategori();
};

const deleteKategori = (kategori, index) => {
  if (confirm('Adakah anda pasti mahu memadamkan kategori ini?')) {
    kategoriData.value.splice(index, 1);
    // Save to localStorage
    const savedKategori = localStorage.getItem('multidimensi_kategori');
    const allKategori = savedKategori ? JSON.parse(savedKategori) : {};
    allKategori[selectedId] = kategoriData.value;
    localStorage.setItem('multidimensi_kategori', JSON.stringify(allKategori));
    
    const { $toast } = useNuxtApp();
    if ($toast) $toast.success('Kategori berjaya dipadamkan');
  }
};

// Kuadran functions
const openEditKuadran = (kuadran, index) => {
  editingKuadranIndex.value = index;
  kuadranForm.value = {
    kuadran: kuadran.kuadran || kuadran.namaKuadran || '',
    min_merit: kuadran.min_merit || '',
    max_merit: kuadran.max_merit || '',
    status_multidimensi: kuadran.status_multidimensi || 'Aktif',
    status: kuadran.status || 'Aktif',
    status_data: kuadran.status_data || 'Draf',
    tarikhMula: kuadran.tarikhMula || '',
    tarikhTamat: kuadran.tarikhTamat || ''
  };
  showKuadranModal.value = true;
};

const closeEditKuadran = () => {
  showKuadranModal.value = false;
  editingKuadranIndex.value = -1;
};

const saveKuadran = () => {
  if (editingKuadranIndex.value >= 0) {
    kuadranData.value[editingKuadranIndex.value] = { ...kuadranForm.value };
    // Save to localStorage
    const savedKuadran = localStorage.getItem('multidimensi_kuadran');
    const allKuadran = savedKuadran ? JSON.parse(savedKuadran) : {};
    allKuadran[selectedId] = kuadranData.value;
    localStorage.setItem('multidimensi_kuadran', JSON.stringify(allKuadran));
    
    const { $toast } = useNuxtApp();
    if ($toast) $toast.success('Kuadran berjaya dikemaskini');
  }
  closeEditKuadran();
};

const deleteKuadran = (kuadran, index) => {
  if (confirm('Adakah anda pasti mahu memadamkan kuadran ini?')) {
    kuadranData.value.splice(index, 1);
    // Save to localStorage
    const savedKuadran = localStorage.getItem('multidimensi_kuadran');
    const allKuadran = savedKuadran ? JSON.parse(savedKuadran) : {};
    allKuadran[selectedId] = kuadranData.value;
    localStorage.setItem('multidimensi_kuadran', JSON.stringify(allKuadran));
    
    const { $toast } = useNuxtApp();
    if ($toast) $toast.success('Kuadran berjaya dipadamkan');
  }
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  
  // Handle different date formats and validate
  let date;
  if (typeof dateString === 'string') {
    // Check if it's a valid date string
    date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Tarikh Tidak Sah";
    }
  } else if (dateString instanceof Date) {
    date = dateString;
    if (isNaN(date.getTime())) {
      return "Tarikh Tidak Sah";
    }
  } else {
    return "Tarikh Tidak Sah";
  }
  
  const options = { year: "numeric", month: "short", day: "numeric" };
  return date.toLocaleDateString("ms-MY", options);
};

const formatCurrency = (value) => {
  if (value === undefined || value === null || value === "") return "0.00";
  
  // Convert to number and validate
  const numValue = parseFloat(value);
  if (isNaN(numValue)) {
    return "0.00";
  }
  
  // Ensure it's a valid number and format to 2 decimal places
  return numValue.toFixed(2);
};

// Helper function to determine badge variant based on status
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
</script>