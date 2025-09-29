<template>
  <div>
    <layouts-breadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <h1 class="text-xl font-bold">Senarai Permohonan Kelulusan Akses Peranan</h1>
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
          <!-- No (id) -->
          <template #id="{ text }">
            <span class="font-medium">{{ text }}</span>
          </template>

          <!-- Status Tugasan -->
          <template #statusTugasan="{ text }">
            <span class="text-sm">{{ text }}</span>
          </template>

          <!-- Mod Akses -->
          <template #modAkses="{ text }">
            <span class="text-sm">{{ text }}</span>
          </template>

          <!-- Peranan/Individu -->
          <template #perananIndividu="{ text }">
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

          <!-- Tindakan (bersyarat) -->
          <template #tindakan="{ text }">
            <div class="flex items-center justify-center">
              <rs-button
                v-if="text?.statusPermohonan === 'Menunggu Kelulusan' && isKetuaJabatan"
                variant="primary" size="sm"
                class="w-48 text-center"
                @click="goToSemakan(text.id)"
              >
                Semakan & Kelulusan
              </rs-button>

              <rs-button
                v-else-if="text?.statusPermohonan === 'Ditolak' || text?.statusPermohonan === 'Diluluskan'"
                variant="success" size="sm"
                class="w-48 text-center"
                @click="goToLihat(text.id)"
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

definePageMeta({ title: 'Senarai Permohonan Kelulusan Akses Peranan' })

const breadcrumb = [
  { name: 'Akses Peranan', type: 'link', path: '/BF-ADN/KA' },
  { name: 'Senarai Permohonan Kelulusan Akses Peranan', type: 'text', path: '/BF-ADN/KA/senarai-permohonan-kelulusan' },
]

/* MOCK DATA (2 rekod) */
const raw = ref([
  {
    id: 1,                                 // Papar sebagai "No"
    statusTugasan: 'Siasatan Ringkas',
    modAkses: 'Kumpulan',
    perananIndividu: 'EOAD',
    statusKonfigurasi: 'Aktif',
    tarikhMulaKuasa: '2025-09-20',
    statusPermohonan: 'Menunggu Kelulusan',
  },
  {
    id: 2,
    statusTugasan: 'Quick Assessment',
    modAkses: 'Per Individu',
    perananIndividu: 'Nazri Bin Ali',
    statusKonfigurasi: 'Aktif',
    tarikhMulaKuasa: '2025-09-18',
    statusPermohonan: 'Diluluskan',
  },
])

/* Kolum jadual ikut URS */
const tableColumns = [
  { key: 'id',                label: 'No', sortable: true },
  { key: 'statusTugasan',     label: 'Status Tugasan', sortable: true },
  { key: 'modAkses',          label: 'Mod Akses', sortable: true },
  { key: 'perananIndividu',   label: 'Peranan/Individu', sortable: true },
  { key: 'statusKonfigurasi', label: 'Status Konfigurasi', sortable: true },
  { key: 'tarikhMulaKuasa',   label: 'Tarikh Mula Kuasa', sortable: true },
  { key: 'statusPermohonan',  label: 'Status Permohonan', sortable: true },
  { key: 'tindakan',          label: 'Tindakan', sortable: false },
]

const tableSort = { column: 'id', direction: 'asc' }
const isKetuaJabatan = ref(true) // ubah ikut role sebenar

/* Pastikan slot 'tindakan' dapat { id, statusPermohonan } */
const tableData = computed(() => {
  return raw.value.map(r => ({
    ...r,
    tindakan: { id: r.id, statusPermohonan: r.statusPermohonan },
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

/* Navigasi (ikut kod skrin yang Siti tetapkan) */
async function goToSemakan (id) {
  await navigateTo(`/BF-ADN/KF/senarai-permohonan-kelulusan-akses-peranan/ADN-PK-KA-02-2?id=${id}`)
}
async function goToLihat (id) {
  await navigateTo(`/BF-ADN/KF/senarai-permohonan-kelulusan-akses-peranan/ADN-PK-KA-02-3?id=${id}`)
}
</script>

<style scoped>
.table-wrapper { overflow-x: visible; }
:deep(table) { table-layout: fixed; width: 100%; }
:deep(th), :deep(td) { white-space: normal; word-break: break-word; vertical-align: middle; }
:deep(td:last-child) { padding-right: 0; }
</style>
