<template>
  <div>
    <layouts-breadcrumb :items="breadcrumb" />

    <!-- Butiran Konfigurasi Kategori Masalah Semasa -->
    <rs-card class="mt-4">
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <Icon name="ic:outline-info" class="mr-2" />
            Butiran Konfigurasi Kategori Masalah Semasa
          </div>
          <rs-button variant="secondary" @click="goBack">Kembali</rs-button>
        </div>
      </template>

      <template #body>
        <div class="p-2">
          <h2 class="text-2xl font-bold mb-4">{{ current?.namaMasalah ?? '-' }}</h2>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Tahap Aduan -->
            <div>
              <div class="text-sm text-gray-500">Tahap Aduan:</div>
              <div class="mt-1">
                <rs-badge :variant="tahapVariant(current?.tahapAduan)">
                  {{ labelTahap(current?.tahapAduan) }}
                </rs-badge>
              </div>
            </div>

            <!-- Nama Kategori -->
            <div>
              <div class="text-sm text-gray-500">Nama Kategori:</div>
              <div class="mt-1 font-semibold">
                {{ current?.namaMasalah ?? '-' }}
              </div>
            </div>

            <!-- Status -->
            <div>
              <div class="text-sm text-gray-500">Status:</div>
              <div class="mt-1">
                <rs-badge :variant="statusVariant(current?.status)">
                  {{ current?.status ?? '-' }}
                </rs-badge>
              </div>
            </div>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Senarai Perubahan (Mock) -->
    <rs-card class="mt-6">
      <template #header>
        <div class="flex items-center">
          <Icon name="ic:outline-list" class="mr-2" />
          Senarai Perubahan
        </div>
      </template>

      <template #body>
        <rs-table
          :data="changeRows"
          :columns="changeColumns"
          :advanced="true"
          :showSearch="true"
          :showFilter="true"
          :showNoColumn="false"
          :pageSize="10"
          class="table-wrapper"
        >
          <template #status="{ text }">
            <rs-badge :variant="statusVariant(text)">{{ text }}</rs-badge>
          </template>
          <template #statusPermohonan="{ text }">
            <rs-badge :variant="text === 'Diluluskan' ? 'success' : 'warning'">{{ text }}</rs-badge>
          </template>
          <template #tahapAduan="{ text }">
            <rs-badge :variant="tahapVariant(text)">{{ labelTahap(text) }}</rs-badge>
          </template>
        </rs-table>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

/** Breadcrumb */
const breadcrumb = computed(() => ([
  { name: 'Mengurus Konfigurasi', type: 'link', path: '/BF-ADN/KF' },
  { name: 'Senarai Kategori Masalah', type: 'link', path: '/BF-ADN/KF/kategori-masalah' },
  { name: 'Butiran Kategori Masalah', type: 'text', path: '/BF-ADN/KF/kategori-masalah/ADN-PK-KT-01-3' },
]))

/** Mock sumber data (sementara) */
const list = [
  { id: 1, tahapAduan: 'Hijau',  namaMasalah: 'Masalah Sosial Am',       status: 'Tidak Aktif' },
  { id: 2, tahapAduan: 'Kuning', namaMasalah: 'Kurang Sumber Pendapatan', status: 'Aktif' },
  { id: 3, tahapAduan: 'Merah',  namaMasalah: 'Tiada Tempat Tinggal',     status: 'Aktif' },
]

/** Ambil ID dari params (fallback ke query) */
const kategoriId = computed(() => {
  const p = route.params.kategoriId ?? route.query.kategoriId
  const n = Number(p)
  return Number.isFinite(n) ? n : null
})

/** Rekod semasa berdasarkan ID */
const current = computed(() => list.find(x => x.id === kategoriId.value))

/** Helpers untuk badge label/variant */
function tahapVariant(t) {
  if (t === 'Merah')  return 'danger'
  if (t === 'Kuning') return 'warning'
  if (t === 'Hijau')  return 'success'
  return 'secondary'
}
function statusVariant(s) {
  if (s === 'Aktif') return 'success'
  if (s === 'Tidak Aktif') return 'danger'
  return 'secondary'
}
function labelTahap(t) {
  if (t === 'Merah')  return 'Kelas 1 (Merah)'
  if (t === 'Kuning') return 'Kelas 2 (Kuning)'
  if (t === 'Hijau')  return 'Kelas 3 (Hijau)'
  return '-'
}

/** Jadual mock Senarai Perubahan */
const changeColumns = [
  { key: 'no',              label: '#',                   sortable: false },
  { key: 'kategoriMasalah', label: 'Kategori Masalah',    sortable: true  },
  { key: 'tahapAduan',      label: 'Tahap Aduan',         sortable: true  },
  { key: 'status',          label: 'Status',              sortable: true  },
  { key: 'dikemaskiniOleh', label: 'Dikemaskini Oleh',    sortable: true  },
  { key: 'tarikhKemaskini', label: 'Tarikh Kemaskini',    sortable: true  },
  { key: 'catatan',         label: 'Catatan Kemaskini',   sortable: false },
  { key: 'statusPermohonan',label: 'Status Permohonan',   sortable: true  },
  { key: 'diluluskanOleh',  label: 'Diluluskan Oleh',     sortable: true  },
  { key: 'tarikhKelulusan', label: 'Tarikh Kelulusan',    sortable: true  },
]

/* Data mock – ubah ikut suka; hanya untuk acah-acah paparan */
const changeRows = computed(() => {
  // contoh: baris pertama ikut current untuk nampak konsisten
  const first = current.value ? {
    no: 1,
    kategoriMasalah: current.value.namaMasalah,
    tahapAduan: current.value.tahapAduan,
    status: current.value.status,
    dikemaskiniOleh: 'Eksekutif_A',
    tarikhKemaskini: '2025-09-10',
    catatan: 'Kemaskini tahap aduan dan penerangan',
    statusPermohonan: 'Diluluskan',
    diluluskanOleh: 'Ketua Jabatan',
    tarikhKelulusan: '2025-09-12',
  } : null

  const others = [
    {
      no: 'KM-V1-0002',
      kategoriMasalah: 'Tiada Makanan',
      tahapAduan: 'Merah',
      status: 'Aktif',
      dikemaskiniOleh: 'Eksekutif_B',
      tarikhKemaskini: '2025-09-06',
      catatan: 'Penetapan semula label kategori',
      statusPermohonan: 'Diluluskan',
      diluluskanOleh: 'Ketua Jabatan',
      tarikhKelulusan: '2025-09-08',
    },
    {
      no: 'KM-V1-0003',
      kategoriMasalah: 'Kekurangan Sumber Pendapatan',
      tahapAduan: 'Kuning',
      status: 'Tidak Aktif',
      dikemaskiniOleh: 'Eksekutif_C',
      tarikhKemaskini: '2025-08-30',
      catatan: 'Dinonaktifkan sementara untuk semakan',
      statusPermohonan: 'Diluluskan',
      diluluskanOleh: 'Ketua Jabatan',
      tarikhKelulusan: '2025-09-01',
    }
  ]

  return first ? [first, ...others] : others
})

/** Back nav */
function goBack() {
  router.push('/BF-ADN/KF/kategori-masalah')
}
</script>
