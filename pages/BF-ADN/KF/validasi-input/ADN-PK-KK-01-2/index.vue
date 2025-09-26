<template>
  <div>
    <layouts-breadcrumb :items="breadcrumb" />


  <div class="flex items-center justify-between w-full">
    <h1>
      Butiran Kawalan Validasi
    </h1>
    <rs-button variant="secondary" @click="goKembali" class="whitespace-nowrap">
      <Icon name="ic:round-arrow-back" class="mr-1" />
      Kembali
    </rs-button>
  </div>


    <rs-card class="mt-4">
      <template #header>
        <div class="flex items-center justify-between w-full">
          <div class="flex items-center">
            <Icon name="ic:outline-description" class="mr-2" />
            {{ headerTitle }}
          </div>

          <!-- Actions kanan: Kembali + Kemaskini -->
          <div class="flex items-center gap-2">
            <rs-button variant="primary" @click="goKemaskini" class="whitespace-nowrap">
              Kemaskini
            </rs-button>
          </div>
        </div>
      </template>

      <template #body>
        <div class="space-y-8">
          <!-- Konfigurasi Semasa -->
          <div>
            <h3 class="text-base font-semibold mb-3">Konfigurasi Semasa</h3>

            <!-- IC -->
            <div v-if="isIC" class="rounded-md border p-4">
              <div class="text-sm text-gray-600 mb-2">Validasi IC - Semak Duplikasi</div>
              <div class="grid md:grid-cols-2 gap-6">
                <div>
                  <div class="text-sm text-gray-500">Tempoh Semakan (hari)</div>
                  <div class="mt-1 px-3 py-2 rounded-md border bg-gray-50">
                    {{ current.tempohSemakanHari }} hari
                  </div>
                </div>
                <div>
                  <div class="text-sm text-gray-500">Status Konfigurasi</div>
                  <div class="mt-1">
                    <rs-badge :variant="badgeVariant(current.statusKonfigurasi)" class="!text-sm !px-3 !py-1 !rounded-full">
                      {{ current.statusKonfigurasi }}
                    </rs-badge>
                  </div>
                </div>
                <div>
                  <div class="text-sm text-gray-500">Tarikh Mula Kuasa</div>
                  <div class="mt-1 px-3 py-2 rounded-md border bg-gray-50">
                    {{ current.tarikhMulaKuasa }}
                  </div>
                </div>
                <div class="md:col-span-2">
                  <div class="text-sm text-gray-500">Catatan Kemaskini</div>
                  <div class="mt-1 px-3 py-2 rounded-md border bg-gray-50">
                    {{ current.catatan || '-' }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Warganegara -->
            <div v-else-if="isWarga" class="rounded-md border p-4">
              <div class="text-sm text-gray-600 mb-2">Validasi Warganegara</div>
              <div class="grid md:grid-cols-2 gap-6">
                <div>
                  <div class="text-sm text-gray-500">Status Warganegara</div>
                  <div class="mt-1 px-3 py-2 rounded-md border bg-gray-50">
                    {{ current.warganegaraStatus }}
                  </div>
                </div>
                <div>
                  <div class="text-sm text-gray-500">Status Konfigurasi</div>
                  <div class="mt-1">
                    <rs-badge :variant="badgeVariant(current.statusKonfigurasi)" class="!text-sm !px-3 !py-1 !rounded-full">
                      {{ current.statusKonfigurasi }}
                    </rs-badge>
                  </div>
                </div>
                <div>
                  <div class="text-sm text-gray-500">Tarikh Mula Kuasa</div>
                  <div class="mt-1 px-3 py-2 rounded-md border bg-gray-50">
                    {{ current.tarikhMulaKuasa }}
                  </div>
                </div>
                <div class="md:col-span-2">
                  <div class="text-sm text-gray-500">Catatan Kemaskini</div>
                  <div class="mt-1 px-3 py-2 rounded-md border bg-gray-50">
                    {{ current.catatan || '-' }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Negeri -->
            <div v-else-if="isNegeri" class="rounded-md border p-4">
              <div class="text-sm text-gray-600 mb-2">Validasi Negeri yang Dibenarkan</div>
              <div class="grid md:grid-cols-2 gap-6">
                <div class="md:col-span-2">
                  <div class="text-sm text-gray-500">List of negeri</div>
                  <div class="mt-1 rounded-md border bg-gray-50 p-3">
                    <div class="flex flex-wrap gap-2">
                      <span
                        v-for="(n, idx) in current.negeriDibenarkan"
                        :key="idx"
                        class="px-3 py-1 rounded-full border bg-white text-sm"
                      >
                        {{ n }}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <div class="text-sm text-gray-500">Status Konfigurasi</div>
                  <div class="mt-1">
                    <rs-badge :variant="badgeVariant(current.statusKonfigurasi)" class="!text-sm !px-3 !py-1 !rounded-full">
                      {{ current.statusKonfigurasi }}
                    </rs-badge>
                  </div>
                </div>
                <div>
                  <div class="text-sm text-gray-500">Tarikh Mula Kuasa</div>
                  <div class="mt-1 px-3 py-2 rounded-md border bg-gray-50">
                    {{ current.tarikhMulaKuasa }}
                  </div>
                </div>
                <div class="md:col-span-2">
                  <div class="text-sm text-gray-500">Catatan Kemaskini</div>
                  <div class="mt-1 px-3 py-2 rounded-md border bg-gray-50">
                    {{ current.catatan || '-' }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Senarai Sejarah Perubahan -->
          <div>
            <h3 class="text-base font-semibold mb-3">Senarai Sejarah Perubahan</h3>
            <rs-table
              :data="historyRows"
              :columns="historyColumns"
              :advanced="true"
              :showSearch="true"
              :showFilter="true"
              :showNoColumn="false"
              :pageSize="10"
              class="table-wrapper"
            >
              <template #header.no>
                <div class="w-full text-center">No</div>
              </template>
              <template #no="{ text }">
                <div class="w-full text-center">{{ text }}</div>
              </template>
            </rs-table>
          </div>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

definePageMeta({
  middleware: 'auth',
  layout: 'default',
  title: 'Butiran Kawalan Validasi',
})

const route  = useRoute()

const breadcrumb = [
  { name: 'Mengurus Konfigurasi', type: 'link', path: '/BF-ADN/KF' },
  { name: 'Senarai Validasi Input', type: 'text', path: '/BF-ADN/KF/validasi-input' },
  { name: 'Butiran Kawalan Validasi', type: 'text', path: '/BF-ADN/KF/validasi-input/ADN-PK-KK-01-2' },
]

/** id: 1 = IC, 2 = Warganegara, 3 = Negeri */
const master = ref([
  {
    id: 1,
    jenis: 'IC',
    header: 'Butiran Validasi IC',
    current: {
      tempohSemakanHari: 1,
      statusKonfigurasi: 'Aktif',
      tarikhMulaKuasa: '15/08/2025',
      catatan: 'Disemak harian oleh SSU',
    },
    history: [
      { no: 1, tempohSemakan: '1 hari', tarikhMulaKuasa: '15/08/2025', statusKonfigurasi: 'Aktif', dikemaskiniOleh: 'Siti Noraini', tarikhKemaskini: '15/08/2025', catatanKemaskini: 'Kekalkan tempoh', statusKelulusan: 'Diluluskan', diluluskanOleh: 'KOAD', tarikhDiluluskan: '15/08/2025' },
      { no: 2, tempohSemakan: '2 hari', tarikhMulaKuasa: '10/08/2025', statusKonfigurasi: 'Tidak Aktif', dikemaskiniOleh: 'Zulhimi Ariff', tarikhKemaskini: '10/08/2025', catatanKemaskini: '-', statusKelulusan: 'Ditolak', diluluskanOleh: '-', tarikhDiluluskan: '-' },
    ],
  },
  {
    id: 2,
    jenis: 'WARGA',
    header: 'Butiran Validasi Warganegara',
    current: {
      warganegaraStatus: 'Dibenarkan',
      statusKonfigurasi: 'Aktif',
      tarikhMulaKuasa: '12/08/2025',
      catatan: 'Hanya MyKad',
    },
    history: [
      { no: 1, tarikhMulaKuasa: '12/08/2025', statusKonfigurasi: 'Aktif', dikemaskiniOleh: 'Zulhimi Ariff', tarikhKemaskini: '12/08/2025', catatanKemaskini: '-', statusKelulusan: 'Diluluskan', diluluskanOleh: 'KOAD', tarikhDiluluskan: '12/08/2025' },
    ],
  },
  {
    id: 3,
    jenis: 'NEGERI',
    header: 'Butiran Validasi Negeri yang Dibenarkan',
    current: {
      negeriDibenarkan: ['Selangor', 'WP Kuala Lumpur'],
      statusKonfigurasi: 'Aktif',
      tarikhMulaKuasa: '11/08/2025',
      catatan: 'Selaras zon operasi',
    },
    history: [
      { no: 1, nilaiDibenarkan: 'Selangor, WP Kuala Lumpur', statusKonfigurasi: 'Aktif', dikemaskiniOleh: 'Rohana Bt Ismail', tarikhKemaskini: '11/08/2025', catatanKemaskini: '-', statusKelulusan: 'Diluluskan', diluluskanOleh: 'KOAD', tarikhDiluluskan: '11/08/2025' },
    ],
  },
])

const activeId = computed(() => Number(route.query.id || 1))
const record   = computed(() => master.value.find(m => m.id === activeId.value) || master.value[0])

const isIC     = computed(() => record.value?.jenis === 'IC')
const isWarga  = computed(() => record.value?.jenis === 'WARGA')
const isNegeri = computed(() => record.value?.jenis === 'NEGERI')

const headerTitle = computed(() => record.value?.header || 'Butiran Kawalan Validasi')
const current     = computed(() => record.value?.current || {})

function badgeVariant(s) {
  return s === 'Aktif' ? 'success' : 'danger'
}

const historyColumns = computed(() => {
  if (isIC.value) {
    return [
      { key: 'no',                label: 'No' },
      { key: 'tempohSemakan',     label: 'Tempoh Semakan' },
      { key: 'tarikhMulaKuasa',   label: 'Tarikh Mula Kuasa' },
      { key: 'statusKonfigurasi', label: 'Status Konfigurasi' },
      { key: 'dikemaskiniOleh',   label: 'Dikemaskini Oleh' },
      { key: 'tarikhKemaskini',   label: 'Tarikh Kemaskini' },
      { key: 'catatanKemaskini',  label: 'Catatan Kemaskini' },
      { key: 'statusKelulusan',   label: 'Status Kelulusan' },
      { key: 'diluluskanOleh',    label: 'Diluluskan Oleh' },
      { key: 'tarikhDiluluskan',  label: 'Tarikh Diluluskan' },
    ]
  }
  if (isWarga.value) {
    return [
      { key: 'no',                label: 'No' },
      { key: 'tarikhMulaKuasa',   label: 'Tarikh Mula Kuasa' },
      { key: 'statusKonfigurasi', label: 'Status Konfigurasi' },
      { key: 'dikemaskiniOleh',   label: 'Dikemaskini Oleh' },
      { key: 'tarikhKemaskini',   label: 'Tarikh Kemaskini' },
      { key: 'catatanKemaskini',  label: 'Catatan Kemaskini' },
      { key: 'statusKelulusan',   label: 'Status Kelulusan' },
      { key: 'diluluskanOleh',    label: 'Diluluskan Oleh' },
      { key: 'tarikhDiluluskan',  label: 'Tarikh Diluluskan' },
    ]
  }
  return [
    { key: 'no',                label: 'No' },
    { key: 'nilaiDibenarkan',   label: 'Nilai Dibenarkan' },
    { key: 'statusKonfigurasi', label: 'Status Konfigurasi' },
    { key: 'dikemaskiniOleh',   label: 'Dikemaskini Oleh' },
    { key: 'tarikhKemaskini',   label: 'Tarikh Kemaskini' },
    { key: 'catatanKemaskini',  label: 'Catatan Kemaskini' },
    { key: 'statusKelulusan',   label: 'Status Kelulusan' },
    { key: 'diluluskanOleh',    label: 'Diluluskan Oleh' },
    { key: 'tarikhDiluluskan',  label: 'Tarikh Diluluskan' },
  ]
})

const historyRows = computed(() => record.value?.history || [])

/** Navigasi */
async function goKemaskini() {
  await navigateTo(`/BF-ADN/KF/validasi-input/ADN-PK-KK-01-3?id=${encodeURIComponent(activeId.value)}`)
}
async function goKembali() {
  await navigateTo('/BF-ADN/KF/validasi-input')
}
</script>
