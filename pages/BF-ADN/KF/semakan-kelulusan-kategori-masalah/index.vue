<template>
  <div>
    <layouts-breadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <h1 class="text-xl font-bold">Senarai Permohonan Kelulusan Kategori Masalah</h1>
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

          <!-- Jenis Permohonan -->
          <template #jenisPermohonan="{ text }">
            <rs-badge :variant="getJenisPermohonanVariant(text)" class="!text-xs !px-3 !py-1 !rounded-full">
              {{ text }}
            </rs-badge>
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
                v-if="text?.statusPermohonan === 'Menunggu Kelulusan'"
                variant="primary" size="sm"
                class="w-40 text-center"
                @click="goToSemakan(text.noPermohonan)"
              >
                Semakan & Kelulusan
              </rs-button>

              <rs-button
                v-else
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

definePageMeta({ title: 'Semakan Kelulusan Kategori Masalah' })

const breadcrumb = [
  { name: 'Mengurus Konfigurasi', type: 'link', path: '/BF-ADN/KF' },
  { name: 'Semakan Kelulusan Kategori Masalah', type: 'text', path: '/BF-ADN/KF/semakan-kelulusan-kategori-masalah' },
]

/* DATA CONTOH — ganti API bila sedia */
const raw = ref([
  {
    noPermohonan: 'KM-PR-0012',
    jenisPermohonan: 'Baru',
    tahapAduan: 'Kelas 1 (Merah)',
    kategoriMasalah: 'Tiada Tempat Tinggal',
    statusKonfigurasi: 'Aktif',
    tarikhMulaKuasa: '2025-09-14',
    statusPermohonan: 'Menunggu Kelulusan',
  },
  {
    noPermohonan: 'KM-PR-0013',
    jenisPermohonan: 'Kemaskini',
    tahapAduan: 'Kelas 2 (Kuning)',
    kategoriMasalah: 'Kekurangan Sumber Pendapatan',
    statusKonfigurasi: 'Tidak Aktif',
    tarikhMulaKuasa: '2025-09-13',
    statusPermohonan: 'Diluluskan',
  },
])

/* Kolum jadual */
const tableColumns = [
  { key: 'noPermohonan',      label: 'No Permohonan', sortable: true },
  { key: 'jenisPermohonan',   label: 'Jenis Permohonan', sortable: true },
  { key: 'tahapAduan',        label: 'Tahap Aduan', sortable: true },
  { key: 'kategoriMasalah',   label: 'Kategori Masalah', sortable: true },
  { key: 'statusKonfigurasi', label: 'Status Konfigurasi', sortable: true },
  { key: 'tarikhMulaKuasa',   label: 'Tarikh Mula Kuasa', sortable: true },
  { key: 'statusPermohonan',  label: 'Status Permohonan', sortable: true },
  { key: 'tindakan',          label: 'Tindakan', sortable: false },
]

const tableSort = { column: 'tarikhMulaKuasa', direction: 'desc' }

/* Pastikan slot 'tindakan' menerima objek melalui { text } */
const tableData = computed(() => {
  return raw.value
    .slice()
    .sort((a, b) => (a.tarikhMulaKuasa < b.tarikhMulaKuasa ? 1 : -1))
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
function getJenisPermohonanVariant (t) {
  if (t === 'Baru') return 'primary'
  if (t === 'Kemaskini') return 'warning'
  return 'secondary'
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
  await navigateTo(`/BF-ADN/KF/semakan-kelulusan-kategori-masalah/ADN-PK-KT-02-2?noPermohonan=${encodeURIComponent(noPermohonan)}`)
}
async function goToLihat (noPermohonan) {
  await navigateTo(`/BF-ADN/KF/semakan-kelulusan-kategori-masalah/ADN-PK-KT-02-3?noPermohonan=${encodeURIComponent(noPermohonan)}`)
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

/* Badge kecil */
:deep(.rs-badge) { line-height: 1.1; }

/* Kolum terakhir: tiada padding kanan supaya benar-benar center */
:deep(td:last-child) { padding-right: 0; }
</style>
