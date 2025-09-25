<template>
  <div>
    <layouts-breadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <Icon name="ic:outline-table-view" class="mr-2" />
            Senarai Kategori Masalah
          </div>

          <!-- Tambah: buka modal -->
          <rs-button variant="primary" @click="openAddModal">
            + Tambah Kategori
          </rs-button>
        </div>
      </template>

      <template #body>
        <rs-table
          :data="rowsForTable"
          :columns="tableColumns"
          :advanced="true"
          :showSearch="true"
          :showFilter="true"
          :showNoColumn="false"
          :pageSize="10"
          :sort="tableSort"
          class="table-wrapper"
        >
          <!-- Header kolum Tindakan -->
          <template #header.tindakan>
            <div class="w-full text-center">Tindakan</div>
          </template>

          <!-- Badge Tahap -->
          <template #tahap="{ text }">
            <rs-badge :variant="getTahapVariant(text)" class="!text-xs !px-3 !py-1 !rounded-full">
              {{ text }}
            </rs-badge>
          </template>

          <!-- Badge Status -->
          <template #status="{ text }">
            <rs-badge :variant="getStatusVariant(text)" class="!text-xs !px-3 !py-1 !rounded-full">
              {{ text }}
            </rs-badge>
          </template>

          <!-- Tindakan: Kemaskini (modal) & Lihat (route) -->
          <template #tindakan="{ text }">
            <div class="w-full text-center flex items-center justify-center gap-2">
              <rs-button class="rs-btn rs-btn-light !text-xs" @click="openEditModal(text)">
                Kemaskini
              </rs-button>
              <button
                @click="openView(text)"
                class="rs-btn rs-btn-light !text-xs flex items-center gap-1 text-blue-600 hover:text-blue-900"
                aria-label="Lihat kategori"
              >
                <Icon name="ic:outline-remove-red-eye" class="mr-1" size="16" />
                Lihat
              </button>
            </div>
          </template>
        </rs-table>
      </template>
    </rs-card>

    <!-- MODAL: TAMBAH -->
    <rs-modal v-model="showAdd" title="Tambah Kategori Masalah" size="lg">
      <form @submit.prevent="saveAdd">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="rs-label">Tahap Aduan</label>
            <select v-model="formAdd.tahap" class="rs-input w-full" required>
              <option disabled value="">-- Pilih --</option>
              <option>Merah</option>
              <option>Kuning</option>
              <option>Hijau</option>
            </select>
          </div>
          <div>
            <label class="rs-label">Status</label>
            <select v-model="formAdd.status" class="rs-input w-full" required>
              <option>Aktif</option>
              <option>Tidak Aktif</option>
            </select>
          </div>
          <div class="col-span-2">
            <label class="rs-label">Nama Kategori Masalah</label>
            <input v-model.trim="formAdd.nama" class="rs-input w-full" required />
          </div>
        </div>
      </form>
      <!-- footer pada aras rs-modal -->
      <template #footer>
        <div class="flex justify-end gap-2">
          <rs-button variant="light" @click="showAdd=false">Tutup</rs-button>
          <rs-button variant="primary" @click="saveAdd">Simpan</rs-button>
        </div>
      </template>
    </rs-modal>

    <!-- MODAL: KEMASKINI (papar id) -->
    <rs-modal v-model="showEdit" :title="`Kemaskini Kategori #${editId ?? '-'}`" size="lg">
      <form @submit.prevent="saveEdit">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="rs-label">Tahap Aduan</label>
            <select v-model="formEdit.tahap" class="rs-input w-full" required>
              <option>Merah</option>
              <option>Kuning</option>
              <option>Hijau</option>
            </select>
          </div>
          <div>
            <label class="rs-label">Status</label>
            <select v-model="formEdit.status" class="rs-input w-full" required>
              <option>Aktif</option>
              <option>Tidak Aktif</option>
            </select>
          </div>
          <div class="col-span-2">
            <label class="rs-label">Nama Kategori Masalah</label>
            <input v-model.trim="formEdit.nama" class="rs-input w-full" required />
          </div>
        </div>
      </form>
      <template #footer>
        <div class="flex justify-end gap-2">
          <rs-button variant="light" @click="showEdit=false">Tutup</rs-button>
          <rs-button variant="primary" @click="saveEdit">Simpan</rs-button>
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

/** DATA MOCKUP (id = kolum No) */
const list = ref([
  { id: 1, tahap: 'Merah',  nama: 'Tiada Tempat Tinggal',     status: 'Aktif' },
  { id: 2, tahap: 'Kuning', nama: 'Kurang Sumber Pendapatan', status: 'Aktif' },
  { id: 3, tahap: 'Hijau',  nama: 'Masalah Sosial Am',        status: 'Tidak Aktif' },
])

/** Penapis */
const filterTahap = ref('')

/** Table mapping */
const rowsForTable = computed(() => {
  return list.value
    .filter(r => (filterTahap.value ? r.tahap === filterTahap.value : true))
    .slice()
    .sort((a, b) => a.id - b.id)
    .map(r => ({
      id: r.id,           // dipaparkan sebagai No & digunakan sebagai ID
      tahap: r.tahap,
      nama: r.nama,
      status: r.status,
      tindakan: r.id,     // slot tindakan akan terima 'id' ini
    }))
})

const tableColumns = [
  { key: 'id',       label: 'No',                    sortable: true },
  { key: 'tahap',    label: 'Tahap Aduan',           sortable: false },
  { key: 'nama',     label: 'Nama Kategori Masalah', sortable: false },
  { key: 'status',   label: 'Status',                sortable: false },
  { key: 'tindakan', label: 'Tindakan',              sortable: false },
]
const tableSort = { column: 'id', direction: 'asc' }

/** Badges */
function getStatusVariant(s){ return s === 'Aktif' ? 'success' : 'danger' }
function getTahapVariant(s){ return s === 'Merah' ? 'danger' : s === 'Kuning' ? 'warning' : 'success' }

/** ======= MODALS & ACTIONS ======= */
const showAdd  = ref(false)
const showEdit = ref(false)
const editId   = ref(null)

const formAdd  = ref({ tahap: '', status: 'Aktif', nama: '' })
const formEdit = ref({ tahap: 'Merah', status: 'Aktif', nama: '' })

function openAddModal(){
  formAdd.value = { tahap: '', status: 'Aktif', nama: '' }
  showAdd.value = true
}

function openEditModal(idCell){
  const id = toId(idCell)
  const row = list.value.find(x => x.id === id)
  if(!row) return
  editId.value = id
  formEdit.value = { tahap: row.tahap, status: row.status, nama: row.nama }
  showEdit.value = true
}

function saveAdd(){
  if(!formAdd.value.nama || !formAdd.value.tahap) return
  const nextId = Math.max(0, ...list.value.map(x => x.id)) + 1
  list.value.push({ id: nextId, ...formAdd.value })
  showAdd.value = false
  // TODO: panggil API create di sini
}

function saveEdit(){
  const idx = list.value.findIndex(x => x.id === editId.value)
  if(idx !== -1){
    list.value[idx] = { id: editId.value, ...formEdit.value }
  }
  showEdit.value = false
  // TODO: panggil API update di sini (guna editId.value)
}

/** Lihat → navigate ke ADN-PK-KT-01-3?id=<id> */
function openView(idCell){
  const id = toId(idCell)
  if(!id) return
  router.push({
    path: '/BF-ADN/KF/kategori-masalah/ADN-PK-KT-01-3',
    query: { id: String(id) },
  })
}

/** util: extract nombor dari cell */
function toId(v){
  const m = String(v ?? '').match(/\d+/)
  const n = m ? Number(m[0]) : NaN
  return Number.isFinite(n) && n > 0 ? n : 0
}
</script>

<style scoped>
/* Pusatkan kolum Tindakan */
:deep(.table-wrapper table thead th:last-child),
:deep(.table-wrapper table tbody td:last-child){
  text-align:center;
  padding-right:0;
}
.rs-input{
  display:inline-block;
  border:1px solid #dcdfe6;
  border-radius:6px;
  padding:6px 10px;
  background:#fff;
}
.rs-label{ display:block; margin-bottom:6px; font-weight:600; }
</style>
