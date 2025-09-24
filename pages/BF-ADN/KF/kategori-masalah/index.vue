<template>
  <div>
    <div>
      <layouts-breadcrumb :items="breadcrumb" />
    </div>

    <!-- Senarai Kategori Masalah -->
    <rs-card class="mt-4">
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <Icon name="ic:outline-table-view" class="mr-2" />
            Senarai Kategori Masalah
          </div>
          <!-- Button Tambah Kategori di kanan header card -->
          <rs-button variant="primary" @click="openAddModal">
            + Tambah Kategori
          </rs-button>
        </div>
      </template>

      <template #body>
        <rs-table
          :data="rows"
          :columns="tableColumns"
          :advanced="true"
          :showSearch="true"
          :showFilter="true"
          :showNoColumn="false"
          :pageSize="10"
          :sort="tableSort"
          class="table-wrapper"
        >
          <!-- Header custom untuk kolum Tindakan (left-align + padding match) -->
          <template #header.tindakan>
            <div class="w-full text-left pl-4">Tindakan</div>
          </template>

          <!-- ID -->
          <template #id="{ text }">
            <span class="!text-xs !px-3 !py-1 !rounded-full">
              {{ text }}
            </span>
          </template>

          <!-- Tahap Aduan -->
          <template #tahapAduan="{ text }">
            <rs-badge :variant="getTahapVariant(text)" class="!text-xs !px-3 !py-1 !rounded-full">
              {{ text }}
            </rs-badge>
          </template>

          <!-- Status -->
          <template #status="{ text }">
            <rs-badge :variant="getStatusVariant(text)" class="!text-xs !px-3 !py-1 !rounded-full">
              {{ text }}
            </rs-badge>
          </template>

          <!-- Tindakan (left-align + Kemaskini dahulu + padding match header) -->
          <template #tindakan="{ row }">
            <div class="flex items-center justify-start gap-3 min-w-[220px] whitespace-nowrap pl-4 text-left">
              <rs-button variant="secondary" @click="openUpdateModal(row)">Kemaskini</rs-button>
              <button
                @click="openView(row)"
                class="inline-flex items-center text-blue-600 hover:text-blue-900"
              >
                <Icon name="ic:outline-remove-red-eye" class="mr-1" size="16" />
                Lihat
              </button>
            </div>
          </template>
        </rs-table>
      </template>
    </rs-card>

    <!-- Modal Tambah Kategori -->
    <rs-modal v-model="showAddModal" size="lg">
      <template #header>
        <h3 class="text-lg font-semibold">Tambah Kategori Masalah</h3>
      </template>

      <template #body>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormKit
            type="select"
            label="Tahap Aduan"
            v-model="newCategory.tahapAduan"
            :options="[
              { value: '', label: '-- Sila Pilih --' },
              { value: 'Merah', label: 'Merah' },
              { value: 'Kuning', label: 'Kuning' },
              { value: 'Hijau', label: 'Hijau' }
            ]"
            validation="required"
            validation-visibility="submit"
            :classes="fkClasses"
          />

          <FormKit
            type="text"
            label="Nama Kategori Masalah"
            v-model="newCategory.namaMasalah"
            placeholder="Contoh: Tiada Tempat Tinggal"
            validation="required"
            validation-visibility="submit"
            :classes="fkClasses"
          />

          <FormKit
            type="date"
            label="Tarikh Mula Kuasa"
            v-model="newCategory.tarikhKuatKuasa"
            placeholder="dd/mm/yyyy"
            validation="required"
            validation-visibility="submit"
            :classes="fkClasses"
          />

          <FormKit
            type="select"
            label="Status Konfigurasi"
            v-model="newCategory.status"
            :options="[
              { value: 'Aktif', label: 'Aktif' },
              { value: 'Tidak Aktif', label: 'Tidak Aktif' }
            ]"
            validation="required"
            validation-visibility="submit"
            :classes="fkClasses"
          />

          <div class="md:col-span-2">
            <FormKit
              type="textarea"
              label="Catatan Permohonan"
              v-model="newCategory.catatan"
              placeholder="Nyatakan tujuan atau sebab tambah kategori"
              :classes="fkClasses"
            />
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex justify-between w-full">
          <rs-button variant="secondary" @click="resetAddForm">Set Semula</rs-button>
          <div class="flex gap-2">
            <rs-button variant="secondary" @click="showAddModal = false">Tutup</rs-button>
            <rs-button variant="primary" @click="addCategory" :disabled="!isAddReady">
              Hantar Permohonan
            </rs-button>
          </div>
        </div>
      </template>
    </rs-modal>

    <!-- Modal Kemaskini Kategori -->
    <rs-modal v-model="showUpdateModal" size="lg">
      <template #header>
        <h3 class="text-lg font-semibold">Kemaskini Kategori Masalah</h3>
      </template>

      <template #body>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormKit
            type="select"
            label="Tahap Aduan"
            v-model="editCategory.tahapAduan"
            :options="[
              { value: 'Merah', label: 'Merah' },
              { value: 'Kuning', label: 'Kuning' },
              { value: 'Hijau', label: 'Hijau' }
            ]"
            validation="required"
            validation-visibility="submit"
            :classes="fkClasses"
          />

          <FormKit
            type="text"
            label="Nama Kategori Masalah"
            v-model="editCategory.namaMasalah"
            validation="required"
            validation-visibility="submit"
            :classes="fkClasses"
          />

          <FormKit
            type="date"
            label="Tarikh Mula Kuasa"
            v-model="editCategory.tarikhKuatKuasa"
            validation="required"
            validation-visibility="submit"
            :classes="fkClasses"
          />

          <FormKit
            type="select"
            label="Status Konfigurasi"
            v-model="editCategory.status"
            :options="[
              { value: 'Aktif', label: 'Aktif' },
              { value: 'Tidak Aktif', label: 'Tidak Aktif' }
            ]"
            validation="required"
            validation-visibility="submit"
            :classes="fkClasses"
          />

          <div class="md:col-span-2">
            <FormKit
              type="textarea"
              label="Catatan Permohonan"
              v-model="editCategory.catatan"
              :classes="fkClasses"
            />
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex justify-between w-full">
          <rs-button variant="secondary" @click="resetUpdateForm">Set Semula</rs-button>
          <div class="flex gap-2">
            <rs-button variant="secondary" @click="showUpdateModal = false">Tutup</rs-button>
            <rs-button variant="primary" @click="updateCategory" :disabled="!isUpdateReady">
              Kemaskini
            </rs-button>
          </div>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const breadcrumb = [
  { name: 'Mengurus Konfigurasi', type: 'link', path: '/BF-ADN/KF' },
  { name: 'Senarai Kategori Masalah', type: 'text', path: '/BF-ADN/KF/kategori-masalah' },
]

/** Data contoh */
const categories = ref([
  { id: 1, tahapAduan: 'Hijau', namaMasalah: 'Masalah Sosial Am', status: 'Tidak Aktif' },
  { id: 2, tahapAduan: 'Kuning', namaMasalah: 'Kurang Sumber Pendapatan', status: 'Aktif' },
  { id: 3, tahapAduan: 'Merah', namaMasalah: 'Tiada Tempat Tinggal', status: 'Aktif' },
])

// rows dengan field 'tindakan' supaya kolum tak hilang bila slot digunakan
const rows = computed(() => {
  return categories.value
    .slice()
    .sort((a, b) => a.id - b.id)
    .map(r => ({ ...r, tindakan: true }))
})

/** Definisi kolum */
const tableColumns = [
  { key: 'id',          label: 'ID',                     sortable: true },
  { key: 'tahapAduan',  label: 'Tahap Aduan',            sortable: true },
  { key: 'namaMasalah', label: 'Nama Kategori Masalah',  sortable: true },
  { key: 'status',      label: 'Status',                 sortable: true },
  { key: 'tindakan',    label: 'Tindakan',               sortable: false },
]
const tableSort = { column: 'id', direction: 'asc' }

/** Badge helpers */
function getTahapVariant(t) {
  if (t === 'Merah')  return 'danger'
  if (t === 'Kuning') return 'warning'
  if (t === 'Hijau')  return 'success'
  return 'secondary'
}
function getStatusVariant(s) {
  if (s === 'Aktif') return 'success'
  if (s === 'Tidak Aktif') return 'danger'
  return 'secondary'
}

/** ==== Navigation untuk Lihat ==== */
function openView(row) {
  const id = row?.id ?? row?.original?.id ?? row?.data?.id
  if (!id) return
  router.push({
    path: '/BF-ADN/KF/kategori-masalah/ADN-PK-KT-01-3',
    query: { kategoriId: String(id) },
  })
}


/** ==== Modal Tambah ==== */
const showAddModal = ref(false)
const newCategory = ref({
  tahapAduan: '',
  namaMasalah: '',
  tarikhKuatKuasa: '',
  status: 'Aktif',
  catatan: ''
})

const fkClasses = {
  outer: 'space-y-1',
  label: '!text-sm !font-medium',
  input: '!rounded-md',
  help: '!text-xs',
  message: '!text-xs !text-red-600'
}

function openAddModal() {
  showAddModal.value = true
}

function resetAddForm() {
  newCategory.value = {
    tahapAduan: '',
    namaMasalah: '',
    tarikhKuatKuasa: '',
    status: '',
    catatan: ''
  }
}

function addCategory() {
  const newId = categories.value.length + 1
  categories.value.push({
    id: newId,
    ...newCategory.value,
    status: 'Menunggu Kelulusan',
    tahapAduan: newCategory.value.tahapAduan || 'Merah',
    tindakan: true,
  })
  resetAddForm()
  showAddModal.value = false
}

/** ==== Modal Kemaskini ==== */
const showUpdateModal = ref(false)
const editCategory = ref({
  id: null,
  tahapAduan: '',
  namaMasalah: '',
  tarikhKuatKuasa: '',
  status: '',
  catatan: ''
})

function openUpdateModal(row) {
  // salin data sedia ada untuk diedit
  editCategory.value = {
    id: row?.id ?? null,
    tahapAduan: row?.tahapAduan ?? '',
    namaMasalah: row?.namaMasalah ?? '',
    tarikhKuatKuasa: row?.tarikhKuatKuasa ?? '',
    status: row?.status ?? '',
    catatan: row?.catatan ?? ''
  }
  showUpdateModal.value = true
}

function resetUpdateForm() {
  editCategory.value = {
    id: null,
    tahapAduan: '',
    namaMasalah: '',
    tarikhKuatKuasa: '',
    status: '',
    catatan: ''
  }
}

function updateCategory() {
  const idx = categories.value.findIndex(c => c.id === editCategory.value.id)
  if (idx > -1) categories.value[idx] = { ...categories.value[idx], ...editCategory.value }
  showUpdateModal.value = false
}

/** Enable button TAMBAH bila semua medan terisi */
const isAddReady = computed(() =>
  !!newCategory.value.tahapAduan &&
  !!newCategory.value.namaMasalah?.trim() &&
  !!newCategory.value.tarikhKuatKuasa &&
  !!newCategory.value.status &&
  !!newCategory.value.catatan?.trim()
)

/** Enable button KEMASKINI bila semua medan terisi */
const isUpdateReady = computed(() =>
  !!editCategory.value.tahapAduan &&
  !!editCategory.value.namaMasalah?.trim() &&
  !!editCategory.value.tarikhKuatKuasa &&
  !!editCategory.value.status &&
  !!editCategory.value.catatan?.trim()
)
</script>
