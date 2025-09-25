<template>
  <div>
    <layouts-breadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <h1 class="text-xl font-bold">Senarai Permohonan Kelulusan Kawalan Validasi</h1>
      </template>

      <template #body>
        <rs-table
          :data="tableData"
          :columns="tableColumns"
          :advanced="true"
          :showSearch="true"
          :showFilter="true"
          :showNoColumn="false"
          :pageSize="10"
          :sort="tableSort"
          class="table-wrapper"
          :options="{ variant:'default', hover:true, fixed:false, striped:false, bordered:false, borderless:false }"
          :optionsAdvanced="{ sortable:true, filterable:true, responsive:true, outsideBorder:true }"
        >
          <!-- No Permohonan -->
          <template #noPermohonan="{ text }">
            <span class="font-medium">{{ text }}</span>
          </template>

          <!-- Jenis Validasi (tiada badge) -->
          <template #jenisValidasi="{ text }">
            <span class="text-sm">{{ text }}</span>
          </template>

          <!-- Status Konfigurasi -->
          <template #statusKonfigurasi="{ text }">
            <rs-badge :variant="getStatusKonfigurasiVariant(text)" class="!text-xs !px-3 !py-1 !rounded-full">
              {{ text }}
            </rs-badge>
          </template>

          <!-- Status Permohonan -->
          <template #statusPermohonan="{ text }">
            <rs-badge :variant="getStatusPermohonanVariant(text)" class="!text-xs !px-3 !py-1 !rounded-full">
              {{ text }}
            </rs-badge>
          </template>

          <!-- Tarikh Mula Kuasa -->
          <template #tarikhMulaKuasa="{ text }">
            <span>{{ formatDate(text) }}</span>
          </template>

          <!-- Header Tindakan: center -->
          <template #header.tindakan>
            <div class="w-full text-center">Tindakan</div>
          </template>

          <!-- Tindakan: center + lebar konsisten -->
          <template #tindakan="{ text }">
            <div class="flex items-center justify-center">
              <rs-button
                v-if="text?.statusPermohonan === 'Menunggu Kelulusan' && isKetuaJabatan"
                variant="primary" size="sm"
                class="w-40 text-center"
                @click="goToSemakan(text.noPermohonan)"
              >
                Semakan & Kelulusan
              </rs-button>

              <rs-button
                v-else-if="text?.statusPermohonan === 'Ditolak' || text?.statusPermohonan === 'Diluluskan'"
                variant="success" size="sm"
                class="w-40 text-center"
                @click="goToLihat(text.noPermohonan)"
              >
                Lihat
              </rs-button>
            </div>
          </template>
        </rs-table>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

definePageMeta({ title: 'Semakan Kelulusan Kawalan Validasi' })

const breadcrumb = [
  { name: 'Mengurus Konfigurasi', type: 'link', path: '/BF-ADN/KF' },
  { name: 'Semakan Kelulusan Kawalan Validasi', type: 'text', path: '/BF-ADN/KF/semakan-kelulusan-kawalan-validasi' },
]

/* DATA CONTOH — ganti API bila sedia */
const raw = ref([
  {
    noPermohonan: 'KV-PR-0001',
    jenisValidasi: 'Validasi IC',
    statusKonfigurasi: 'Aktif',
    tarikhMulaKuasa: '2025-09-14',
    statusPermohonan: 'Menunggu Kelulusan',
  },
  {
    noPermohonan: 'KV-PR-0002',
    jenisValidasi: 'Validasi Negeri Dibenarkan',
    statusKonfigurasi: 'Tidak Aktif',
    tarikhMulaKuasa: '2025-09-13',
    statusPermohonan: 'Diluluskan',
  },
  {
    noPermohonan: 'KV-PR-0003',
    jenisValidasi: 'Validasi Warganegara',
    statusKonfigurasi: 'Aktif',
    tarikhMulaKuasa: '2025-09-15',
    statusPermohonan: 'Ditolak',
  },
])

/* Kolum jadual */
const tableColumns = [
  { key: 'noPermohonan',      label: 'No Permohonan', sortable: true },
  { key: 'jenisValidasi',     label: 'Jenis Validasi', sortable: true },
  { key: 'statusKonfigurasi', label: 'Status Konfigurasi', sortable: true },
  { key: 'tarikhMulaKuasa',   label: 'Tarikh Mula Kuasa', sortable: true },
  { key: 'statusPermohonan',  label: 'Status Permohonan', sortable: true },
  { key: 'tindakan',          label: 'Tindakan', sortable: false },
]

const tableSort = { column: 'noPermohonan', direction: 'asc' }  // Susunan berdasarkan 'noPermohonan'

const isKetuaJabatan = ref(true) // Set this to true if logged in user is Ketua Jabatan

/* Pastikan slot 'tindakan' menerima objek melalui { text } */
const tableData = computed(() => {
  return raw.value
    .slice()
    .sort((a, b) => (a.noPermohonan < b.noPermohonan ? -1 : 1)) // Susunan ikut noPermohonan
    .map(r => ({
      ...r,
      tindakan: { noPermohonan: r.noPermohonan, statusPermohonan: r.statusPermohonan },
    }))
})

/* Helpers */
function formatDate (iso) {
  if (!iso) return ''
  const d = new Date(iso)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function getStatusKonfigurasiVariant (t) {
  if (t === 'Aktif') return 'success'
  if (t === 'Tidak Aktif') return 'danger'
  return 'secondary'
}

function getStatusPermohonanVariant (t) {
  if (t === 'Diluluskan') return 'success'
  if (t === 'Ditolak') return 'danger'
  if (t === 'Menunggu Kelulusan') return 'warning'
  return 'secondary'
}

/* Navigasi */
async function goToSemakan (noPermohonan) {
  await navigateTo(`/BF-ADN/KF/senarai-permohonan-kelulusan-kawalan-validasi/ADN-PK-KK-02-2?noPermohonan=${encodeURIComponent(noPermohonan)}`)
}

async function goToLihat (noPermohonan) {
  await navigateTo(`/BF-ADN/KF/senarai-permohonan-kelulusan-kawalan-validasi/ADN-PK-KK-02-3?noPermohonan=${encodeURIComponent(noPermohonan)}`)
}
</script>

<style scoped>
/* Tiada scroll mendatar */
.table-wrapper { overflow-x: visible; }

/* Padat & balut teks */
:deep(table) { table-layout: fixed; width: 100%; }
:deep(th), :deep(td) {
  white-space: normal;
  word-break: break-word;
  vertical-align: middle;
}

/* Kolum terakhir: tiada padding kanan supaya benar-benar center */
:deep(td:last-child) { padding-right: 0; }
</style>
