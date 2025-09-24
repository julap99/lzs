<template>
  <div>
    <layouts-breadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <Icon name="ic:outline-table-view" class="mr-2" />
            Senarai Akses Peranan
          </div>
          <div>
            <rs-button
              @click="onClickTambah"
              class="inline-flex items-center gap-1 font-medium text-blue-600 hover:text-blue-800"
              aria-label="Tambah akses peranan"
            >
              <Icon name="ic:outline-add-box" size="16" />
              <span>Tambah Akses Baharu</span>
            </rs-button>
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

          <!-- Tindakan (Lihat) → ADN-PK-KA-01-3?id={id} -->
          <template #tindakan="data">
            <div class="w-full text-center">
              <button
                @click="onClickLihat(data.text)"
                class="inline-flex items-center gap-1 font-medium text-blue-600 hover:text-blue-800 whitespace-nowrap"
                aria-label="Lihat butiran akses peranan"
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
  { name: 'Senarai Akses Peranan', type: 'text', path: '/BF-ADN/KF/akses-peranan' },
]

/** DATA MOCKUP */
const list = ref([
  { id: 1, statusTugasan: 'Semakan Ringkas', modAkses: 'Admin', status: 'Aktif' },
  { id: 2, statusTugasan: 'Semakan Bantuan', modAkses: 'User', status: 'Tidak Aktif' },
])

/** Format data untuk jadual */
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
  { key: 'id',            label: 'No',               sortable: true  },
  { key: 'statusTugasan', label: 'Status Tugasan',   sortable: false },
  { key: 'modAkses',      label: 'Mod Akses',        sortable: false },
  { key: 'status',        label: 'Status',           sortable: false },
  { key: 'tindakan',      label: 'Tindakan',         sortable: false },
]

const tableSort = { column: 'id', direction: 'asc' }

function getStatusVariant(s) {
  return s === 'Aktif' ? 'success' : 'danger'
}

/** 👉 Tambah → pergi ke skrin tambah (ADN-PK-KA-01-2) */
async function onClickTambah() {
  await router.push({
    path: '/BF-ADN/KF/akses-peranan/ADN-PK-KA-01-2',
  })
}

/** 👉 Lihat → pergi ke skrin butiran (ADN-PK-KA-01-3) dengan query id */
async function onClickLihat(codeOrId) {
  const str = String(codeOrId ?? '')
  const match = str.match(/\d+/)
  const num   = match ? Number(match[0]) : NaN
  if (!Number.isFinite(num) || num <= 0) {
    console.error('Kod/ID tidak sah untuk butiran:', codeOrId)
    return
  }
  await router.push({
    path: '/BF-ADN/KF/akses-peranan/ADN-PK-KA-01-3',
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
