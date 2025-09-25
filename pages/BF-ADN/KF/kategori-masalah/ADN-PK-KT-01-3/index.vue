<template>
  <div>
    <layouts-breadcrumb :items="breadcrumb" />

    <!-- BUTIRAN SEMASA -->
    <rs-card class="mt-4">
      <template #header>
        <h2 class="text-lg font-semibold">Butiran Konfigurasi Kategori Masalah Semasa</h2>
      </template>

      <template #body>
        <div v-if="data" class="p-4 md:p-6 bg-white border-l-4 border-blue-600 rounded">
          <div class="text-2xl font-extrabold mb-4">{{ data.namaMasalah }}</div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div class="text-sm font-semibold">Tahap Aduan:</div>
              <div class="text-gray-800">{{ tahapDisplay(data.tahapAduan) }}</div>
            </div>
            <div>
              <div class="text-sm font-semibold">Nama Kategori:</div>
              <div class="text-gray-800">{{ data.namaMasalah }}</div>
            </div>
            <div>
              <div class="text-sm font-semibold">Status:</div>
              <rs-badge :variant="getStatusVariant(data.status)" class="!px-3 !py-1 !rounded-full">
                {{ data.status }}
              </rs-badge>
            </div>
          </div>
        </div>

        <div v-else class="py-16 text-center">
          <div class="text-lg font-semibold mb-2">Rekod tidak dijumpai</div>
          <div class="text-gray-600">Semak semula pautan atau kembali ke senarai.</div>
        </div>
      </template>
    </rs-card>

    <!-- SENARAI PERUBAHAN -->
    <rs-card class="mt-6">
      <template #header>
        <h2 class="text-lg font-semibold">Senarai Perubahan</h2>
      </template>

      <template #body>
        <rs-table
          :data="rows"
          :columns="tableColumns"
          :advanced="false"
          :showSearch="false"
          :showFilter="false"
          :showNoColumn="false"
          :pageSize="10"
          class="table-wrapper"
        >
          <!-- Badge kolum Status -->
          <template #status="{ text }">
            <rs-badge :variant="getStatusVariant(text)" class="!px-3 !py-1 !rounded-full">
              {{ text }}
            </rs-badge>
          </template>

          <!-- Badge kolum Status Permohonan -->
          <template #statusPermohonan="{ text }">
            <rs-badge :variant="text === 'Diluluskan' ? 'success' : 'warning'" class="!px-3 !py-1 !rounded-full">
              {{ text }}
            </rs-badge>
          </template>

          <!-- Format Tahap Aduan -->
          <template #tahapAduan="{ text }">
            {{ tahapDisplay(text) }}
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

const breadcrumb = [
  { name: 'Mengurus Konfigurasi', type: 'link', path: '/BF-ADN/KF' },
  { name: 'Senarai Kategori Masalah', type: 'link', path: '/BF-ADN/KF/kategori-masalah' },
  { name: 'Butiran Kategori', type: 'text', path: '/BF-ADN/KF/kategori-masalah/ADN-PK-KT-01-3' },
]

// ===== Mock utama (ikut senarai kamu) =====
const mockById = {
  1: { id: 1, namaMasalah: 'Tiada Tempat Tinggal',        tahapAduan: 'Merah',  status: 'Aktif' },
  2: { id: 2, namaMasalah: 'Kurang Sumber Pendapatan', tahapAduan: 'Kuning', status: 'Aktif' },
  3: { id: 3, namaMasalah: 'Masalah Sosial Am',     tahapAduan: 'Hijau',  status: 'Tidak Aktif' },
}

// ===== Ambil kategoriId dari query/params (robust) =====
const kategoriId = computed(() => {
  const src = route.query.kategoriId ?? route.params.kategoriId ?? route.query.id ?? route.params.id
  const raw = Array.isArray(src) ? src[0] : src
  const n = Number(raw)
  return Number.isFinite(n) ? n : null
})

const data = computed(() => (kategoriId.value != null ? mockById[kategoriId.value] : null))

// ===== Senarai perubahan (mock ikut contoh UI) =====
const changeHistoryById = {
  1: [
    { no: '1',           kategoriMasalah: 'Tiada Tempat Tinggal', tahapAduan: 'Merah',  status: 'Aktif',       dikemaskiniOleh: 'Eksekutif_A', tarikhKemaskini: '2025-09-10', catatan: 'Kemaskini tahap aduan dan penerangan', statusPermohonan: 'Diluluskan', diluluskanOleh: 'Ketua Jabatan', tarikhKelulusan: '2025-09-12' },
    { no: 'KM-V1-0002',  kategoriMasalah: 'Tiada Makanan',        tahapAduan: 'Merah',  status: 'Aktif',       dikemaskiniOleh: 'Eksekutif_B', tarikhKemaskini: '2025-09-06', catatan: 'Penetapan semula label kategori',     statusPermohonan: 'Diluluskan', diluluskanOleh: 'Ketua Jabatan', tarikhKelulusan: '2025-09-08' },
    { no: 'KM-V1-0003',  kategoriMasalah: 'Kekurangan Sumber Pendapatan', tahapAduan: 'Kuning', status: 'Tidak Aktif', dikemaskiniOleh: 'Eksekutif_C', tarikhKemaskini: '2025-08-30', catatan: 'Dinonaktifkan sementara untuk semakan', statusPermohonan: 'Diluluskan', diluluskanOleh: 'Ketua Jabatan', tarikhKelulusan: '2025-09-01' },
  ],
  2: [
    { no: '1',           kategoriMasalah: 'Kurang Sumber Pendapatan', tahapAduan: 'Kuning', status: 'Aktif', dikemaskiniOleh: 'Eksekutif_A', tarikhKemaskini: '2025-09-10', catatan: 'Penetapan kadar bantuan', statusPermohonan: 'Diluluskan', diluluskanOleh: 'Ketua Jabatan', tarikhKelulusan: '2025-09-12' },
    { no: 'KM-V1-0002',  kategoriMasalah: 'Tiada Makanan',            tahapAduan: 'Merah',  status: 'Aktif', dikemaskiniOleh: 'Eksekutif_B', tarikhKemaskini: '2025-09-06', catatan: 'Tambah label kritikal',  statusPermohonan: 'Diluluskan', diluluskanOleh: 'Ketua Jabatan', tarikhKelulusan: '2025-09-08' },
    { no: 'KM-V1-0003',  kategoriMasalah: 'Pekerjaan Tidak Stabil',   tahapAduan: 'Kuning', status: 'Tidak Aktif', dikemaskiniOleh: 'Eksekutif_C', tarikhKemaskini: '2025-08-30', catatan: 'Dinonaktifkan sementara', statusPermohonan: 'Diluluskan', diluluskanOleh: 'Ketua Jabatan', tarikhKelulusan: '2025-09-01' },
  ],
  3: [
    { no: '1',           kategoriMasalah: 'Masalah Sosial Am',   tahapAduan: 'Hijau',  status: 'Tidak Aktif', dikemaskiniOleh: 'Eksekutif_X', tarikhKemaskini: '2025-09-10', catatan: 'Semakan semula skop masalah', statusPermohonan: 'Diluluskan', diluluskanOleh: 'Ketua Jabatan', tarikhKelulusan: '2025-09-12' },
    { no: 'KM-V1-0002',  kategoriMasalah: 'Isu Sosial Ringan',   tahapAduan: 'Hijau',  status: 'Aktif',       dikemaskiniOleh: 'Eksekutif_Y', tarikhKemaskini: '2025-09-06', catatan: 'Aktifkan sementara',           statusPermohonan: 'Diluluskan', diluluskanOleh: 'Ketua Jabatan', tarikhKelulusan: '2025-09-08' },
    { no: 'KM-V1-0003',  kategoriMasalah: 'Persekitaran Tidak Sihat', tahapAduan: 'Kuning', status: 'Tidak Aktif', dikemaskiniOleh: 'Eksekutif_Z', tarikhKemaskini: '2025-08-30', catatan: 'Nonaktif untuk semakan', statusPermohonan: 'Diluluskan', diluluskanOleh: 'Ketua Jabatan', tarikhKelulusan: '2025-09-01' },
  ],
}


const rows = computed(() => (data.value ? changeHistoryById[data.value.id] : []))

// Definisi kolum jadual
const tableColumns = [
  { key: 'no',               label: '#',                 sortable: false },
  { key: 'kategoriMasalah',  label: 'Kategori Masalah',  sortable: true  },
  { key: 'tahapAduan',       label: 'Tahap Aduan',       sortable: true  },
  { key: 'status',           label: 'Status',            sortable: true  },
  { key: 'dikemaskiniOleh',  label: 'Dikemaskini Oleh',  sortable: true  },
  { key: 'tarikhKemaskini',  label: 'Tarikh Kemaskini',  sortable: true  },
  { key: 'catatan',          label: 'Catatan Kemaskini', sortable: false },
  { key: 'statusPermohonan', label: 'Status Permohonan', sortable: true  },
  { key: 'diluluskanOleh',   label: 'Diluluskan Oleh',   sortable: true  },
  { key: 'tarikhKelulusan',  label: 'Tarikh Kelulusan',  sortable: true  },
]

// Helpers
function tahapDisplay(t) {
  if (t === 'Merah')  return 'Kelas 1 (Merah)'
  if (t === 'Kuning') return 'Kelas 2 (Kuning)'
  if (t === 'Hijau')  return 'Kelas 3 (Hijau)'
  return t
}
function getStatusVariant(s) {
  if (s === 'Aktif') return 'success'
  if (s === 'Tidak Aktif') return 'danger'
  return 'secondary'
}
</script>
