<template>
  <div>
    <layouts-breadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <Icon name="ic:outline-table-view" class="mr-2" />
            Senarai Validasi Input
          </div>
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
          <!-- Header custom utk kolum Tindakan -->
          <template #header.tindakan>
            <div class="w-full text-center">Tindakan</div>
          </template>

          <!-- Status badge -->
          <template #status="{ text }">
            <rs-badge :variant="getStatusVariant(text)" class="!text-xs !px-3 !py-1 !rounded-full">
              {{ text }}
            </rs-badge>
          </template>

          <!-- Tindakan (center) — gunakan data.text (ID terformat VIxxx) -->
          <template #tindakan="data">
            <div class="w-full text-center">
              <button
                @click="onClickLihat(data.text)"
                class="inline-flex items-center gap-1 font-medium text-blue-600 hover:text-blue-800 whitespace-nowrap"
                aria-label="Lihat butiran validasi"
              >
                <Icon name="ic:outline-remove-red-eye" size="16" />
                <span>Lihat</span>
              </button>
            </div>
          </template>
        </rs-table>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const breadcrumb = [
  { name: 'Mengurus Konfigurasi', type: 'link', path: '/BF-ADN/KF' },
  { name: 'Senarai Validasi Input', type: 'text', path: '/BF-ADN/KF/validasi-input' },
]

/** DATA MOCKUP (ID disimpan & jadi kunci urutan) */
const list = ref([
  { id: 1, jenisKawalan: 'Validasi IC (1 Aduan / hari)', parameter: 'Tempoh: 1 Hari', status: 'Aktif' },
  { id: 2, jenisKawalan: 'Warganegara Sahaja',            parameter: 'Status: Dibenarkan', status: 'Aktif' },
  { id: 3, jenisKawalan: 'Negeri dalam Alamat',           parameter: 'Selangor, WP Kuala Lumpur', status: 'Aktif' },
])

/** Susun mengikut ID (menaik) & jadikan kolum `tindakan` = kod VIxxx (cth: id=1 -> VI001) */
const rows = computed(() =>
  list.value
    .slice()
    .sort((a, b) => a.id - b.id)
    .map(r => ({
      ...r,
      tindakan: `VI${String(r.id).padStart(3, '0')}`,
    }))
)

const tableColumns = [
  { key: 'id',            label: 'Id',             sortable: true  },
  { key: 'jenisKawalan',  label: 'Jenis Kawalan',  sortable: false },
  { key: 'parameter',     label: 'Parameter',      sortable: false },
  { key: 'status',        label: 'Status',         sortable: false },
  { key: 'tindakan',      label: 'Tindakan',       sortable: false },
]
const tableSort = { column: 'id', direction: 'asc' }

function getStatusVariant(s) {
  return s === 'Aktif' ? 'success' : 'danger'
}

/** Lihat → terima kod "VI001", extract nombor → 1, navigate ?id=1 */
async function onClickLihat(codeOrId) {
  const str = String(codeOrId ?? '')
  const match = str.match(/\d+/)       // ambil angka sahaja
  const num   = match ? Number(match[0]) : NaN
  if (!Number.isFinite(num) || num <= 0) {
    console.error('Kod/ID tidak sah untuk butiran:', codeOrId)
    return
  }
  await router.push({
    path: '/BF-ADN/KF/validasi-input/ADN-PK-KK-01-2',
    query: { id: String(num) },
  })
}
</script>

<style scoped>
/* Pusatkan kolum Tindakan */
:deep(.table-wrapper table thead th:last-child),
:deep(.table-wrapper table tbody td:last-child) {
  text-align: center;
  padding-right: 0;
}
</style>
