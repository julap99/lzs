<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Enhanced Header Notice for Code Maintenance -->
    <div class="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-6 mb-6">
      <div class="flex items-center gap-4">
        <div class="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
          <Icon name="ic:baseline-code" class="text-indigo-600 w-8 h-8" />
        </div>
        <div>
          <h1 class="text-xl font-bold text-indigo-900 mb-2">Pusat Penyelenggaraan Kod Sistem</h1>
          <p class="text-indigo-700">Konfigurasi dan pengurusan kod rujukan sistem. Kategori kod digunakan untuk mengklasifikasikan data dalam sistem NAS.</p>
        </div>
        <div class="ml-auto">
          <rs-badge variant="info" size="lg">
            <Icon name="ic:baseline-security" class="mr-1" />
            Akses Terkawal
          </rs-badge>
        </div>
      </div>
    </div>

    <!-- Code Management Statistics -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <!-- Total Categories -->
      <div class="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white p-6 rounded-xl shadow-lg stats-card hover-lift">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-indigo-100 text-sm font-medium">Jumlah Kategori</p>
            <p class="text-3xl font-bold">{{ totalCategories }}</p>
            <div class="flex items-center mt-2">
              <Icon name="ic:baseline-category" class="w-4 h-4 text-indigo-200 mr-1" />
              <span class="text-indigo-200 text-xs">Aktif dalam sistem</span>
            </div>
          </div>
          <div class="bg-indigo-400 bg-opacity-30 p-3 rounded-lg">
            <Icon name="ic:baseline-folder" class="w-8 h-8 text-indigo-100" />
          </div>
        </div>
      </div>

      <!-- Total Codes -->
      <div class="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white p-6 rounded-xl shadow-lg stats-card hover-lift">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-emerald-100 text-sm font-medium">Jumlah Kod</p>
            <p class="text-3xl font-bold">{{ totalCodes }}</p>
            <div class="flex items-center mt-2">
              <Icon name="ic:baseline-code" class="w-4 h-4 text-emerald-200 mr-1" />
              <span class="text-emerald-200 text-xs">Kod rujukan</span>
            </div>
          </div>
          <div class="bg-emerald-400 bg-opacity-30 p-3 rounded-lg">
            <Icon name="ic:baseline-list" class="w-8 h-8 text-emerald-100" />
          </div>
        </div>
      </div>

      <!-- Active Codes -->
      <div class="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg stats-card hover-lift">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-blue-100 text-sm font-medium">Kod Aktif</p>
            <p class="text-3xl font-bold">{{ activeCodes }}</p>
            <div class="flex items-center mt-2">
              <Icon name="ic:baseline-check-circle" class="w-4 h-4 text-blue-200 mr-1" />
              <span class="text-blue-200 text-xs">Dalam kegunaan</span>
            </div>
          </div>
          <div class="bg-blue-400 bg-opacity-30 p-3 rounded-lg">
            <Icon name="ic:baseline-verified" class="w-8 h-8 text-blue-100" />
          </div>
        </div>
      </div>

      <!-- Recent Updates -->
      <div class="bg-gradient-to-br from-violet-500 to-violet-600 text-white p-6 rounded-xl shadow-lg stats-card hover-lift">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-violet-100 text-sm font-medium">Kemaskini Terkini</p>
            <p class="text-3xl font-bold">{{ recentUpdates }}</p>
            <div class="flex items-center mt-2">
              <Icon name="ic:baseline-schedule" class="w-4 h-4 text-violet-200 mr-1" />
              <span class="text-violet-200 text-xs">7 hari terakhir</span>
            </div>
          </div>
          <div class="bg-violet-400 bg-opacity-30 p-3 rounded-lg">
            <Icon name="ic:baseline-update" class="w-8 h-8 text-violet-100" />
          </div>
        </div>
      </div>
    </div>

    <!-- Section 1: Parent Table (Kategori Kod) -->
    <rs-card class="mt-4" v-if="!showChildCodes">
      <template #header>
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-4">
            <h2 class="text-xl font-semibold">Konfigurasi Kategori & Kod</h2>
            <rs-badge variant="info">{{ categories.length }} kategori</rs-badge>
          </div>
          <div class="flex gap-2">
            <rs-button
              variant="outline"
              @click="refreshCategories"
              :loading="refreshingCategories"
            >
              <Icon name="ic:baseline-refresh" class="mr-1" />
              {{ refreshingCategories ? 'Memuat...' : 'Muat Semula' }}
            </rs-button>
            <rs-button
              variant="success-outline"
              @click="exportCategories"
            >
              <Icon name="ic:baseline-download" class="mr-1" />
              Eksport
            </rs-button>
            <rs-button
              variant="primary"
              @click="addCategory"
            >
              <Icon name="ic:baseline-add" class="mr-1" />
              Tambah Kategori
            </rs-button>
          </div>
        </div>
      </template>

      <template #body>
        <!-- Search and Filter -->
        <div class="mb-6">
          <div class="flex flex-col md:flex-row gap-4">
            <div class="flex-1">
              <FormKit
                v-model="categorySearch"
                type="text"
                placeholder="Cari kategori kod..."
                :classes="{
                  input: '!py-2',
                }"
              />
            </div>
            <div class="flex gap-2">
              <FormKit
                v-model="categoryStatusFilter"
                type="select"
                :options="statusFilterOptions"
                placeholder="Status"
                :classes="{
                  input: '!py-2',
                }"
              />
            </div>
          </div>
        </div>

        <!-- Categories Table -->
        <rs-table
          :data="filteredCategories"
          :columns="categoryColumns"
          :pageSize="pageSize"
          :showNoColumn="true"
          :options="{
            variant: 'default',
            hover: true,
            striped: true,
          }"
          :options-advanced="{
            sortable: true,
            filterable: true,
          }"
          advanced
        >
          <template v-slot:status="{ text }">
            <rs-badge :variant="getStatusVariant(text)">
              {{ text }}
            </rs-badge>
          </template>

          <template v-slot:tindakan="{ text }">
            <div class="flex justify-center items-center gap-2">
              <rs-button
                variant="primary"
                size="sm"
                @click="editCategory(text)"
                title="Kemaskini Kategori"
              >
                <Icon name="ic:baseline-edit" class="w-4 h-4" />
              </rs-button>
              <rs-button
                variant="danger"
                size="sm"
                @click="confirmDeleteCategory(text)"
                title="Hapus Kategori"
              >
                <Icon name="ic:baseline-delete" class="w-4 h-4" />
              </rs-button>
              <rs-button
                variant="success"
                size="sm"
                @click="viewCodes(text)"
                title="Konfigurasi Kod"
              >
                <Icon name="ic:baseline-settings" class="w-4 h-4" />
              </rs-button>
            </div>
          </template>
        </rs-table>
      </template>
    </rs-card>

    <!-- Section 3: Child Table (Kod under selected Kategori) -->
    <rs-card class="mt-4" v-if="showChildCodes">
      <template #header>
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-4">
            <rs-button
              variant="ghost"
              @click="backToCategories"
            >
              <Icon name="ic:baseline-arrow-back" class="mr-1" />
              Kembali
            </rs-button>
            <h2 class="text-xl font-semibold">Senarai Kod {{ selectedCategory?.kategoriKod }}</h2>
            <rs-badge variant="info">{{ filteredCodes.length }} kod</rs-badge>
          </div>
          <div class="flex gap-2">
            <rs-button
              variant="outline"
              @click="refreshCodes"
              :loading="refreshingCodes"
            >
              <Icon name="ic:baseline-refresh" class="mr-1" />
              {{ refreshingCodes ? 'Memuat...' : 'Muat Semula' }}
            </rs-button>
            <rs-button
              variant="success-outline"
              @click="exportCodes"
            >
              <Icon name="ic:baseline-download" class="mr-1" />
              Eksport Kod
            </rs-button>
            <rs-button
              variant="primary"
              @click="addCode"
            >
              <Icon name="ic:baseline-add" class="mr-1" />
              Tambah Kod
            </rs-button>
          </div>
        </div>
      </template>

      <template #body>
        <!-- Search and Category Filter -->
        <div class="mb-6">
          <div class="flex flex-col md:flex-row gap-4">
            <div class="flex-1">
              <FormKit
                v-model="codeSearch"
                type="text"
                placeholder="Cari kod..."
                :classes="{
                  input: '!py-2',
                }"
              />
            </div>
            <div class="flex gap-2">
              <FormKit
                v-model="selectedCategoryFilter"
                type="select"
                :options="categoryFilterOptions"
                placeholder="Pilih Kategori"
                :classes="{
                  input: '!py-2',
                }"
              />
              <FormKit
                v-model="codeStatusFilter"
                type="select"
                :options="statusFilterOptions"
                placeholder="Status"
                :classes="{
                  input: '!py-2',
                }"
              />
            </div>
          </div>
        </div>

        <!-- Codes Table -->
        <rs-table
          :data="filteredCodes"
          :columns="codeColumns"
          :pageSize="pageSize"
          :showNoColumn="true"
          :options="{
            variant: 'default',
            hover: true,
            striped: true,
          }"
          :options-advanced="{
            sortable: true,
            filterable: true,
          }"
          advanced
        >
          <template v-slot:status="{ text }">
            <rs-badge :variant="getStatusVariant(text)">
              {{ text }}
            </rs-badge>
          </template>

          <template v-slot:tindakan="{ text }">
            <div class="flex justify-center items-center gap-2">
              <rs-button
                variant="primary"
                size="sm"
                @click="editCode(text)"
                title="Kemaskini Kod"
              >
                <Icon name="ic:baseline-edit" class="w-4 h-4" />
              </rs-button>
              <rs-button
                variant="danger"
                size="sm"
                @click="confirmDeleteCode(text)"
                title="Hapus Kod"
              >
                <Icon name="ic:baseline-delete" class="w-4 h-4" />
              </rs-button>
            </div>
          </template>
        </rs-table>
      </template>
    </rs-card>

    <!-- Section 2: Add/Edit Kategori Form (Modal) -->
    <rs-modal
      v-model="showCategoryModal"
      :title="isEditingCategory ? 'Kemaskini Kategori' : 'Tambah Kategori Baharu'"
      size="md"
      position="center"
    >
      <template #body>
        <div class="space-y-4">
          <FormKit
            type="text"
            name="idKategori"
            label="ID Kategori"
            v-model="currentCategory.idKategori"
            disabled
            help="Auto-generated"
          />
          <FormKit
            type="text"
            name="kategoriKod"
            label="Kategori Kod"
            v-model="currentCategory.kategoriKod"
            placeholder="Contoh: NEGERI, AGAMA, BANK"
            validation="required"
            :validation-messages="{
              required: 'Kategori Kod diperlukan'
            }"
          />
          <FormKit
            type="text"
            name="keterangan"
            label="Keterangan"
            v-model="currentCategory.keterangan"
            placeholder="Masukkan keterangan kategori"
            validation="required"
            :validation-messages="{
              required: 'Keterangan diperlukan'
            }"
          />
          <FormKit
            type="select"
            name="status"
            label="Status"
            v-model="currentCategory.status"
            :options="statusOptions"
            validation="required"
          />
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end space-x-2">
          <rs-button 
            variant="outline" 
            @click="resetCategoryForm"
          >
            Reset
          </rs-button>
          <rs-button 
            variant="primary-outline" 
            @click="showCategoryModal = false"
          >
            Batal
          </rs-button>
          <rs-button 
            variant="primary" 
            @click="saveCategory"
            :loading="saving"
          >
            {{ isEditingCategory ? "Kemaskini" : "Simpan" }}
          </rs-button>
        </div>
      </template>
    </rs-modal>

    <!-- Section 4: Add/Edit Kod Form (Modal) -->
    <rs-modal
      v-model="showCodeModal"
      :title="isEditingCode ? 'Kemaskini Kod' : 'Tambah Kod Baharu'"
      size="md"
      position="center"
    >
      <template #body>
        <div class="space-y-4">
          <FormKit
            type="text"
            name="idKod"
            label="ID Kod"
            v-model="currentCode.idKod"
            disabled
            help="Auto-generated"
          />
          
          <!-- Basic fields for all categories -->
          <FormKit
            type="text"
            name="keterangan"
            label="Keterangan"
            v-model="currentCode.keterangan"
            placeholder="Masukkan keterangan kod"
            validation="required"
          />

          <!-- Additional fields based on category type -->
          <template v-if="selectedCategory?.kategoriKod === 'BANK'">
            <FormKit
              type="text"
              name="swiftCode"
              label="Swift Code"
              v-model="currentCode.swiftCode"
              placeholder="Masukkan Swift Code"
            />
            <FormKit
              type="number"
              name="accountMinLength"
              label="Account Min Length"
              v-model="currentCode.accountMinLength"
              placeholder="Minimum panjang akaun"
            />
            <FormKit
              type="number"
              name="accountMaxLength"
              label="Account Max Length"
              v-model="currentCode.accountMaxLength"
              placeholder="Maksimum panjang akaun"
            />
          </template>

          <FormKit
            type="select"
            name="status"
            label="Status"
            v-model="currentCode.status"
            :options="statusOptions"
            validation="required"
          />
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end space-x-2">
          <rs-button 
            variant="outline" 
            @click="resetCodeForm"
          >
            Reset
          </rs-button>
          <rs-button 
            variant="primary-outline" 
            @click="showCodeModal = false"
          >
            Batal
          </rs-button>
          <rs-button 
            variant="primary" 
            @click="saveCode"
            :loading="saving"
          >
            {{ isEditingCode ? "Kemaskini" : "Simpan" }}
          </rs-button>
        </div>
      </template>
    </rs-modal>

    <!-- Delete Confirmation Modals -->
    <rs-modal
      v-model="showDeleteCategoryModal"
      title="Sahkan Padam Kategori"
      size="md"
      position="center"
    >
      <template #body>
        <div class="bg-red-50 p-4 rounded-lg mb-4">
          <Icon name="ic:baseline-warning" class="text-red-600 w-6 h-6 mb-2" />
          <p class="text-red-800 font-medium">Amaran Kritikal!</p>
        </div>
        <p>Adakah anda pasti ingin memadam kategori <strong>"{{ categoryToDelete?.kategoriKod }}"</strong>?</p>
        <p class="text-red-600 font-medium mt-2">
          Pemadaman kategori akan turut memadam semua kod yang berkaitan dan mungkin menjejaskan sistem lain.
        </p>
      </template>
      <template #footer>
        <div class="flex justify-end space-x-2">
          <rs-button variant="primary-outline" @click="showDeleteCategoryModal = false">
            Batal
          </rs-button>
          <rs-button variant="danger" @click="deleteCategory">
            Sahkan Padam
          </rs-button>
        </div>
      </template>
    </rs-modal>

    <rs-modal
      v-model="showDeleteCodeModal"
      title="Sahkan Padam Kod"
      size="md"
      position="center"
    >
      <template #body>
        <p>Adakah anda pasti ingin memadam kod <strong>"{{ codeToDelete?.keterangan }}"</strong>?</p>
        <p class="text-red-600 font-medium mt-2">
          Pemadaman kod mungkin menjejaskan dropdown dan sistem lain yang menggunakan kod ini.
        </p>
      </template>
      <template #footer>
        <div class="flex justify-end space-x-2">
          <rs-button variant="primary-outline" @click="showDeleteCodeModal = false">
            Batal
          </rs-button>
          <rs-button variant="danger" @click="deleteCode">
            Sahkan Padam
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

definePageMeta({
  title: "Konfigurasi Kategori & Kod",
});

const breadcrumb = ref([
  {
    name: "Pentadbir Sistem",
    type: "link",
    path: "/BF-PS",
  },
  {
    name: "Penyelenggaraan Kod",
    type: "link", 
    path: "/BF-PS/PK",
  },
  {
    name: "Konfigurasi Kategori & Kod",
    type: "current",
    path: "/BF-PS/PK",
  },
]);

// State management
const showChildCodes = ref(false);
const selectedCategory = ref(null);
const categorySearch = ref("");
const codeSearch = ref("");
const categoryStatusFilter = ref("");
const codeStatusFilter = ref("");
const selectedCategoryFilter = ref("");
const pageSize = ref(10);
const saving = ref(false);

// Modal states
const showCategoryModal = ref(false);
const showCodeModal = ref(false);
const showDeleteCategoryModal = ref(false);
const showDeleteCodeModal = ref(false);
const isEditingCategory = ref(false);
const isEditingCode = ref(false);

// Form data
const currentCategory = ref({
  idKategori: '',
  kategoriKod: '',
  keterangan: '',
  status: 'Aktif'
});

const currentCode = ref({
  idKod: '',
  keterangan: '',
  status: 'Aktif',
  swiftCode: '',
  accountMinLength: '',
  accountMaxLength: ''
});

const categoryToDelete = ref(null);
const codeToDelete = ref(null);

// Options
const statusOptions = [
  { label: "Aktif", value: "Aktif" },
  { label: "Tidak Aktif", value: "Tidak Aktif" }
];

const statusFilterOptions = [
  { label: "Semua Status", value: "" },
  { label: "Aktif", value: "Aktif" },
  { label: "Tidak Aktif", value: "Tidak Aktif" }
];

// Mock data - Categories
const categories = ref([
  {
    id: 1,
    idKategori: 'KAT-001',
    kategoriKod: 'NEGERI',
    keterangan: 'Senarai negeri dalam Malaysia',
    status: 'Aktif'
  },
  {
    id: 2,
    idKategori: 'KAT-002', 
    kategoriKod: 'AGAMA',
    keterangan: 'Senarai agama yang diiktiraf',
    status: 'Aktif'
  },
  {
    id: 3,
    idKategori: 'KAT-003',
    kategoriKod: 'BANK',
    keterangan: 'Senarai bank tempatan dan asing',
    status: 'Aktif'
  },
  {
    id: 4,
    idKategori: 'KAT-004',
    kategoriKod: 'STATUS_PERMOHONAN',
    keterangan: 'Status permohonan dalam sistem',
    status: 'Aktif'
  },
  {
    id: 5,
    idKategori: 'KAT-005',
    kategoriKod: 'PENDIDIKAN',
    keterangan: 'Tahap pendidikan',
    status: 'Tidak Aktif'
  }
]);

// Mock data - Codes
const codes = ref([
  // NEGERI codes
  { id: 1, idKod: 'NEG-001', keterangan: 'Johor', status: 'Aktif', kategoriId: 1 },
  { id: 2, idKod: 'NEG-002', keterangan: 'Kedah', status: 'Aktif', kategoriId: 1 },
  { id: 3, idKod: 'NEG-003', keterangan: 'Kelantan', status: 'Aktif', kategoriId: 1 },
  { id: 4, idKod: 'NEG-004', keterangan: 'Melaka', status: 'Aktif', kategoriId: 1 },
  
  // AGAMA codes
  { id: 5, idKod: 'AGM-001', keterangan: 'Islam', status: 'Aktif', kategoriId: 2 },
  { id: 6, idKod: 'AGM-002', keterangan: 'Buddha', status: 'Aktif', kategoriId: 2 },
  { id: 7, idKod: 'AGM-003', keterangan: 'Kristian', status: 'Aktif', kategoriId: 2 },
  { id: 8, idKod: 'AGM-004', keterangan: 'Hindu', status: 'Aktif', kategoriId: 2 },
  
  // BANK codes  
  { id: 9, idKod: 'BNK-001', keterangan: 'Bank Islam Malaysia', status: 'Aktif', kategoriId: 3, swiftCode: 'BIMBMYKL', accountMinLength: 10, accountMaxLength: 16 },
  { id: 10, idKod: 'BNK-002', keterangan: 'Maybank', status: 'Aktif', kategoriId: 3, swiftCode: 'MBBEMYKL', accountMinLength: 8, accountMaxLength: 14 },
  { id: 11, idKod: 'BNK-003', keterangan: 'CIMB Bank', status: 'Aktif', kategoriId: 3, swiftCode: 'CIBBMYKL', accountMinLength: 10, accountMaxLength: 15 },
  
  // STATUS_PERMOHONAN codes
  { id: 12, idKod: 'STS-001', keterangan: 'Baharu', status: 'Aktif', kategoriId: 4 },
  { id: 13, idKod: 'STS-002', keterangan: 'Dalam Proses', status: 'Aktif', kategoriId: 4 },
  { id: 14, idKod: 'STS-003', keterangan: 'Lulus', status: 'Aktif', kategoriId: 4 },
  { id: 15, idKod: 'STS-004', keterangan: 'Ditolak', status: 'Aktif', kategoriId: 4 },
  
  // PENDIDIKAN codes
  { id: 16, idKod: 'EDU-001', keterangan: 'SPM', status: 'Tidak Aktif', kategoriId: 5 },
  { id: 17, idKod: 'EDU-002', keterangan: 'Diploma', status: 'Tidak Aktif', kategoriId: 5 },
  { id: 18, idKod: 'EDU-003', keterangan: 'Ijazah', status: 'Tidak Aktif', kategoriId: 5 }
]);

// Table columns
const categoryColumns = [
  {
    key: "idKategori",
    label: "Id Kategori", 
    sortable: true,
  },
  {
    key: "kategoriKod",
    label: "Kategori Kod", 
    sortable: true,
  },
  {
    key: "keterangan",
    label: "Keterangan",
    sortable: true,
  },
  {
    key: "status", 
    label: "Status",
    sortable: true,
  },
  {
    key: "tindakan",
    label: "Tindakan",
    sortable: false,
  },
];

const codeColumns = [
  {
    key: "idKod",
    label: "ID Kod",
    sortable: true,
  },
  {
    key: "keterangan", 
    label: "Keterangan",
    sortable: true,
  },
  {
    key: "status",
    label: "Status", 
    sortable: true,
  },
  {
    key: "tindakan",
    label: "Tindakan",
    sortable: false,
  },
];

// Computed properties
const filteredCategories = computed(() => {
  let filtered = categories.value.map(category => ({
    idKategori: category.idKategori,
    kategoriKod: category.kategoriKod,
    keterangan: category.keterangan,
    status: category.status,
    tindakan: category
  }));

  if (categorySearch.value) {
    const query = categorySearch.value.toLowerCase();
    filtered = filtered.filter(category => 
      category.kategoriKod.toLowerCase().includes(query) ||
      category.keterangan.toLowerCase().includes(query)
    );
  }

  if (categoryStatusFilter.value) {
    filtered = filtered.filter(category => category.status === categoryStatusFilter.value);
  }

  return filtered;
});

const filteredCodes = computed(() => {
  let filtered = codes.value;

  // Filter by selected category
  if (selectedCategory.value) {
    filtered = filtered.filter(code => code.kategoriId === selectedCategory.value.id);
  }

  // Filter by category dropdown
  if (selectedCategoryFilter.value) {
    filtered = filtered.filter(code => code.kategoriId === parseInt(selectedCategoryFilter.value));
  }

  // Filter by search query
  if (codeSearch.value) {
    const query = codeSearch.value.toLowerCase();
    filtered = filtered.filter(code => 
      code.idKod.toLowerCase().includes(query) ||
      code.keterangan.toLowerCase().includes(query)
    );
  }

  // Filter by status
  if (codeStatusFilter.value) {
    filtered = filtered.filter(code => code.status === codeStatusFilter.value);
  }

  return filtered.map(code => ({
    idKod: code.idKod,
    keterangan: code.keterangan,
    status: code.status,
    tindakan: code
  }));
});

const categoryFilterOptions = computed(() => {
  return [
    { label: "Semua Kategori", value: "" },
    ...categories.value.map(cat => ({
      label: cat.kategoriKod,
      value: cat.id.toString()
    }))
  ];
});

// Methods
// Enhanced Statistics for PK Module
const totalCategories = computed(() => categories.value.length);
const totalCodes = computed(() => codes.value.length);
const activeCodes = computed(() => codes.value.filter(code => code.status === 'Aktif').length);
const recentUpdates = computed(() => 8); // Mock recent updates count

// Enhanced Loading States
const refreshingCategories = ref(false);
const refreshingCodes = ref(false);

// Enhanced Methods
const getStatusVariant = (status) => {
  return status === 'Aktif' ? 'success' : 'danger';
};

const refreshCategories = async () => {
  refreshingCategories.value = true;
  console.log('🔄 Refreshing categories...');
  
  try {
    // Simulate refresh delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('✅ Categories refreshed successfully');
  } finally {
    refreshingCategories.value = false;
  }
};

const refreshCodes = async () => {
  refreshingCodes.value = true;
  console.log('🔄 Refreshing codes...');
  
  try {
    // Simulate refresh delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('✅ Codes refreshed successfully');
  } finally {
    refreshingCodes.value = false;
  }
};

const exportCategories = async () => {
  console.log('📊 Exporting categories...');
  // Simulate export delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  console.log('✅ Categories exported successfully');
};

const exportCodes = async () => {
  console.log('📊 Exporting codes...');
  // Simulate export delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  console.log('✅ Codes exported successfully');
};

const addCategory = () => {
  isEditingCategory.value = false;
  currentCategory.value = {
    idKategori: generateCategoryId(),
    kategoriKod: '',
    keterangan: '',
    status: 'Aktif'
  };
  showCategoryModal.value = true;
};

const editCategory = (category) => {
  isEditingCategory.value = true;
  currentCategory.value = { ...category };
  showCategoryModal.value = true;
};

const saveCategory = async () => {
  try {
    saving.value = true;
    
    // Simulate validation
    if (!currentCategory.value.kategoriKod || !currentCategory.value.keterangan) {
      $toast.error('Sila lengkapkan semua field yang diperlukan');
      return;
    }

    // Check for duplicate category code
    const isDuplicate = categories.value.some(cat => 
      cat.kategoriKod.toLowerCase() === currentCategory.value.kategoriKod.toLowerCase() && 
      cat.id !== currentCategory.value.id
    );
    
    if (isDuplicate) {
      $toast.error('Kategori Kod sudah wujud. Sila gunakan kod yang berbeza.');
      return;
    }

    // Simulate save delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (isEditingCategory.value) {
      // Update existing category
      const index = categories.value.findIndex(cat => cat.id === currentCategory.value.id);
      if (index > -1) {
        categories.value[index] = { ...currentCategory.value };
      }
      logAuditAction('Kemaskini', 'Kategori', currentCategory.value.kategoriKod);
      $toast.success('Kategori berjaya dikemaskini');
    } else {
      // Add new category
      const newId = Math.max(...categories.value.map(cat => cat.id), 0) + 1;
      categories.value.push({
        id: newId,
        ...currentCategory.value
      });
      logAuditAction('Tambah', 'Kategori', currentCategory.value.kategoriKod);
      $toast.success('Kategori berjaya ditambah');
    }

    showCategoryModal.value = false;
  } catch (error) {
    $toast.error('Ralat semasa menyimpan kategori');
  } finally {
    saving.value = false;
  }
};

const confirmDeleteCategory = (category) => {
  categoryToDelete.value = category;
  showDeleteCategoryModal.value = true;
};

const deleteCategory = () => {
  const index = categories.value.findIndex(cat => cat.id === categoryToDelete.value.id);
  if (index > -1) {
    // Also delete related codes
    codes.value = codes.value.filter(code => code.kategoriId !== categoryToDelete.value.id);
    categories.value.splice(index, 1);
    
    logAuditAction('Hapus', 'Kategori', categoryToDelete.value.kategoriKod);
    $toast.success('Kategori dan kod berkaitan berjaya dipadamkan');
  }
  showDeleteCategoryModal.value = false;
  categoryToDelete.value = null;
};

const viewCodes = (category) => {
  selectedCategory.value = category;
  showChildCodes.value = true;
  selectedCategoryFilter.value = category.id.toString();
  $toast.success(`Melihat kod untuk kategori: ${category.kategoriKod}`);
};

const backToCategories = () => {
  showChildCodes.value = false;
  selectedCategory.value = null;
  selectedCategoryFilter.value = "";
  codeSearch.value = "";
  codeStatusFilter.value = "";
};

const addCode = () => {
  isEditingCode.value = false;
  currentCode.value = {
    idKod: generateCodeId(),
    keterangan: '',
    status: 'Aktif',
    swiftCode: '',
    accountMinLength: '',
    accountMaxLength: ''
  };
  showCodeModal.value = true;
};

const editCode = (code) => {
  isEditingCode.value = true;
  currentCode.value = { ...code };
  showCodeModal.value = true;
};

const saveCode = async () => {
  try {
    saving.value = true;
    
    // Simulate validation
    if (!currentCode.value.keterangan) {
      $toast.error('Keterangan diperlukan');
      return;
    }

    // Simulate save delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (isEditingCode.value) {
      // Update existing code
      const index = codes.value.findIndex(code => code.id === currentCode.value.id);
      if (index > -1) {
        codes.value[index] = { ...currentCode.value };
      }
      logAuditAction('Kemaskini', 'Kod', currentCode.value.keterangan);
      $toast.success('Kod berjaya dikemaskini');
    } else {
      // Add new code
      const newId = Math.max(...codes.value.map(code => code.id), 0) + 1;
      const categoryId = selectedCategory.value?.id || parseInt(selectedCategoryFilter.value);
      codes.value.push({
        id: newId,
        kategoriId: categoryId,
        ...currentCode.value
      });
      logAuditAction('Tambah', 'Kod', currentCode.value.keterangan);
      $toast.success('Kod berjaya ditambah');
    }

    showCodeModal.value = false;
  } catch (error) {
    $toast.error('Ralat semasa menyimpan kod');
  } finally {
    saving.value = false;
  }
};

const confirmDeleteCode = (code) => {
  codeToDelete.value = code;
  showDeleteCodeModal.value = true;
};

const deleteCode = () => {
  const index = codes.value.findIndex(code => code.id === codeToDelete.value.id);
  if (index > -1) {
    codes.value.splice(index, 1);
    logAuditAction('Hapus', 'Kod', codeToDelete.value.keterangan);
    $toast.success('Kod berjaya dipadamkan');
  }
  showDeleteCodeModal.value = false;
  codeToDelete.value = null;
};

const resetCategoryForm = () => {
  currentCategory.value = {
    idKategori: generateCategoryId(),
    kategoriKod: '',
    keterangan: '',
    status: 'Aktif'
  };
};

const resetCodeForm = () => {
  currentCode.value = {
    idKod: generateCodeId(),
    keterangan: '',
    status: 'Aktif',
    swiftCode: '',
    accountMinLength: '',
    accountMaxLength: ''
  };
};

const generateCategoryId = () => {
  const nextId = categories.value.length + 1;
  return `KAT-${nextId.toString().padStart(3, '0')}`;
};

const generateCodeId = () => {
  const nextId = codes.value.length + 1;
  const categoryCode = selectedCategory.value?.kategoriKod?.substring(0, 3) || 'COD';
  return `${categoryCode}-${nextId.toString().padStart(3, '0')}`;
};

const logAuditAction = (action, type, item) => {
  // Simulate audit logging
  const auditLog = {
    username: 'AdminNAS01',
    userRole: 'Admin Sistem',
    action: `${action} ${type}`,
    item: item,
    timestamp: new Date().toLocaleString('ms-MY'),
    module: 'Konfigurasi Kategori & Kod'
  };
  
  console.log('Audit Log:', auditLog);
  
  // In real system, this would be sent to audit trail API
};

// Initialize
onMounted(() => {
  // Set initial data
  console.log('🔧 Penyelenggaraan Kod module initialized');
});
</script>

<style scoped>
/* Enhanced Code Maintenance Styling */
.stats-card {
  transition: all 0.3s ease-in-out;
}

.hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
}

/* Fade-in animations */
.fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Table hover effects */
.table-row-hover {
  transition: all 0.2s ease-in-out;
}

.table-row-hover:hover {
  background-color: #f8fafc;
  transform: scale(1.002);
}

/* Button enhancements */
.btn-enhanced {
  transition: all 0.2s ease-in-out;
}

.btn-enhanced:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Loading states */
.loading-overlay {
  backdrop-filter: blur(2px);
}

/* Status badge animations */
.status-badge {
  transition: all 0.2s ease-in-out;
}

.status-badge:hover {
  transform: scale(1.05);
}

/* Code category cards */
.category-card {
  transition: all 0.2s ease-in-out;
  border-left: 4px solid transparent;
}

.category-card:hover {
  border-left-color: #6366f1;
  background-color: #f8fafc;
  transform: translateX(4px);
}
</style>

<style scoped>
/* Custom styles if needed */
</style>