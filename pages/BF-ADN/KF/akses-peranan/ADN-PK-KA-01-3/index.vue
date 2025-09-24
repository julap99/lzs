<template>
  <div>
    <layouts-breadcrumb :items="breadcrumb" />

    <div class="flex justify-between items-center mb-3">
      <h1 class="text-2xl font-semibold flex items-center gap-2">
        <Icon name="ic:outline-info" />
        Butiran Akses Peranan
      </h1>

      <rs-button v-if="current" variant="secondary" @click="onClickKemaskini" class="whitespace-nowrap">
        <Icon name="ic:outline-edit" class="mr-1" />
        Kemaskini
      </rs-button>
    </div>

    <!-- Jika ID tidak wujud -->
    <rs-alert v-if="!current" variant="warning" class="mb-4">
      Rekod tidak dijumpai. Sila kembali ke Senarai Akses Peranan.
    </rs-alert>

    <template v-else>
      <!-- Konfigurasi Semasa -->
      <rs-card class="mb-6">
        <template #header>
          <div class="font-semibold">Konfigurasi Semasa</div>
        </template>
        <template #body>
          <div class="grid sm:grid-cols-[200px_1fr] gap-y-3">
            <div class="font-medium">Status Tugasan:</div>
            <div>{{ current.statusTugasan }}</div>

            <div class="font-medium">Mod Akses:</div>
            <div>{{ current.modAksesLabel }}</div>

            <div class="font-medium">
              {{ current.modAkses === 'group' ? 'Senarai Peranan:' : 'Senarai Individu:' }}
            </div>
            <div>{{ current.senaraiDipilih?.join(', ') || '-' }}</div>

            <div class="font-medium">Tarikh Mula Kuasa:</div>
            <div>{{ fmtDate(current.tarikhMulaKuasa) }}</div>

            <div class="font-medium">Status Konfigurasi:</div>
            <div>
              <rs-badge :variant="current.statusKonfigurasi ? 'success' : 'danger'">
                {{ current.statusKonfigurasi ? 'Aktif' : 'Tidak Aktif' }}
              </rs-badge>
            </div>
          </div>
        </template>
      </rs-card>

      <!-- Senarai Sejarah Perubahan -->
      <rs-card>
        <template #header>
          <div class="font-semibold">Senarai Sejarah Perubahan</div>
        </template>

        <template #body>
          <rs-table
            :data="historyRows"
            :columns="historyColumns"
            :advanced="false"
            :showSearch="false"
            :showFilter="false"
            :showNoColumn="false"
            :pageSize="10"
            class="table-wrapper"
          >
            <template #statusKonfigurasi="{ text }">
              <rs-badge :variant="text === 'Aktif' ? 'success' : 'danger'">{{ text }}</rs-badge>
            </template>

            <template #statusKelulusan="{ text }">
              <rs-badge :variant="text === 'Diluluskan' ? 'success' : (text === 'Ditolak' ? 'danger' : 'warning')">
                {{ text }}
              </rs-badge>
            </template>
          </rs-table>
        </template>
      </rs-card>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
definePageMeta({ title: 'Butiran Akses Peranan' })

const breadcrumb = [
  { name: 'Mengurus Konfigurasi', type: 'link', path: '/BF-ADN/KF' },
  { name: 'Senarai Akses Peranan', type: 'link', path: '/BF-ADN/KF/akses-peranan' },
  { name: 'Butiran Akses Peranan', type: 'text', path: '/BF-ADN/KF/akses-peranan/ADN-PK-KA-01-3' },
]

/** =======================
 * MOCK DATA by ID
 * ======================= */
const DATA = {
  1: {
    id: 1,
    statusTugasan: 'Siasatan Ringkas',
    modAkses: 'group', // 'group' | 'person'
    modAksesLabel: 'Kumpulan',
    senaraiDipilih: ['KOAD', 'EPOAD', 'SSU'],
    tarikhMulaKuasa: '2025-08-01',
    statusKonfigurasi: true, // Aktif
    history: [
      {
        statusTugasan: 'Siasatan Ringkas',
        perananAtauIndividu: 'KOAD, EPOAD, SSU',
        tarikhMulaKuasa: '2025-07-01',
        statusKonfigurasi: 'Tidak Aktif',
        dikemaskiniOleh: 'admin1',
        tarikhKemaskini: '2025-06-30',
        catatan: 'Kemaskini akses dari individu ke kumpulan',
        statusKelulusan: 'Diluluskan',
        diluluskanOleh: 'Ketua Jabatan',
        tarikhDiluluskan: '2025-07-01',
      },
    ],
  },
  2: {
    id: 2,
    statusTugasan: 'Semakan Bantuan',
    modAkses: 'person',
    modAksesLabel: 'Per Individu',
    senaraiDipilih: ['Ahmad Zaki', 'Noraini Musa'],
    tarikhMulaKuasa: '2025-09-01',
    statusKonfigurasi: false, // Tidak Aktif
    history: [
      {
        statusTugasan: 'Semakan Bantuan',
        perananAtauIndividu: 'Ahmad Zaki',
        tarikhMulaKuasa: '2025-08-01',
        statusKonfigurasi: 'Aktif',
        dikemaskiniOleh: 'admin2',
        tarikhKemaskini: '2025-07-25',
        catatan: 'Tambah Noraini Musa',
        statusKelulusan: 'Menunggu Kelulusan',
        diluluskanOleh: '-',
        tarikhDiluluskan: '-',
      },
    ],
  },
}

/** Ambil ID dari query dan resolve current record */
const id = computed(() => Number(route.query.id ?? NaN))
const current = computed(() => {
  const rec = DATA[id.value]
  return rec ?? null
})

/** Bina rows untuk jadual sejarah */
const historyRows = computed(() => {
  if (!current.value) return []
  return current.value.history.map((h, idx) => ({
    no: idx + 1,
    statusTugasan: h.statusTugasan,
    perananIndividu: h.perananAtauIndividu,
    tarikhMulaKuasa: fmtDate(h.tarikhMulaKuasa),
    statusKonfigurasi: h.statusKonfigurasi,
    dikemaskiniOleh: h.dikemaskiniOleh,
    tarikhKemaskini: fmtDate(h.tarikhKemaskini),
    catatan: h.catatan,
    statusKelulusan: h.statusKelulusan,
    diluluskanOleh: h.diluluskanOleh,
    tarikhDiluluskan: fmtDate(h.tarikhDiluluskan),
  }))
})

const historyColumns = [
  { key: 'no',                label: 'No',                   sortable: false },
  { key: 'statusTugasan',     label: 'Status Tugasan',       sortable: false },
  { key: 'perananIndividu',   label: 'Peranan/Individu',     sortable: false },
  { key: 'tarikhMulaKuasa',   label: 'Tarikh Mula Kuasa',    sortable: false },
  { key: 'statusKonfigurasi', label: 'Status Konfigurasi',   sortable: false },
  { key: 'dikemaskiniOleh',   label: 'Dikemaskini Oleh',     sortable: false },
  { key: 'tarikhKemaskini',   label: 'Tarikh Kemaskini',     sortable: false },
  { key: 'catatan',           label: 'Catatan Kemaskini',    sortable: false },
  { key: 'statusKelulusan',   label: 'Status Kelulusan',     sortable: false },
  { key: 'diluluskanOleh',    label: 'Diluluskan Oleh',      sortable: false },
  { key: 'tarikhDiluluskan',  label: 'Tarikh Diluluskan',    sortable: false },
]

/** Format tarikh dd/mm/yyyy; jika '-' atau falsy, kekalkan */
function fmtDate(d) {
  if (!d || d === '-') return d || '-'
  const dt = new Date(d)
  if (isNaN(+dt)) return d
  const dd = String(dt.getDate()).padStart(2, '0')
  const mm = String(dt.getMonth() + 1).padStart(2, '0')
  const yyyy = dt.getFullYear()
  return `${dd}/${mm}/${yyyy}`
}

/** Kemaskini → ke skrin tambah/kemaskini (ADN-PK-KA-01-2) sambil bawa id */
async function onClickKemaskini() {
  if (!current.value) return
  await router.push({
    path: '/BF-ADN/KF/akses-peranan/ADN-PK-KA-01-4',
    query: { id: String(current.value.id), mode: 'edit' },
  })
}
</script>

<style scoped>
.table-wrapper :deep(table thead th),
.table-wrapper :deep(table tbody td) {
  white-space: nowrap;
}
</style>
