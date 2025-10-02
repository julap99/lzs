<template>
  <div>
    <h1 class="text-xl font-semibold mb-4">Laporan Penerima Bantuan Semasa</h1>

    <!-- Carian -->
    <rs-card>
      <div class="p-4">
        <h2 class="text-base font-semibold">Kriteria Carian</h2>

        <!-- Read-only header -->
        <div class="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex flex-col">
            <label class="mb-1 text-sm font-medium text-slate-700">Jenis Laporan (DOAA)</label>
            <div class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700">
              {{ jenisLaporan }}
            </div>
          </div>
          <div class="flex flex-col">
            <label class="mb-1 text-sm font-medium text-slate-700">Nama Laporan (Nama Laporan yang di Pilih)</label>
            <div class="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700">
              {{ namaLaporan }}
            </div>
          </div>
        </div>

        <!-- Row: Daerah & Kariah -->
        <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormKit
            v-model="criteria.daerah"
            type="select"
            label="Daerah"
            :options="daerahOptionsWithAll"
            placeholder="Semua Daerah"
          />
          <FormKit
            v-model="criteria.kariah"
            type="select"
            label="Kariah"
            :options="kariahOptionsWithAll"
            placeholder="Semua Kariah"
            :disabled="kariahOptionsWithAll.length === 1"
          />
        </div>

        <!-- Tarikh (inline range) -->
        <div class="mt-4">
          <label class="mb-1 block text-sm font-medium text-slate-700">Tarikh</label>
          <div class="flex items-center gap-3">
            <FormKit
              v-model="criteria.tarikhDari"
              name="tarikhDari"
              type="date"
              :label="null"
              input-class="w-full"
              placeholder="dd/mm/yyyy"
            />
            <span class="text-slate-400">—</span>
            <FormKit
              v-model="criteria.tarikhHingga"
              name="tarikhHingga"
              type="date"
              :label="null"
              input-class="w-full"
              placeholder="dd/mm/yyyy"
            />
          </div>
          <p v-if="!dateRangeValid" class="mt-1 text-sm text-red-600">
            Tarikh Hingga mestilah pada atau selepas Tarikh Dari.
          </p>
        </div>

        <!-- Tahun -->
        <div class="mt-4 max-w-xs">
          <FormKit
            v-model="criteria.tahun"
            name="tahun"
            type="text"
            label="Tahun"
            placeholder="cth: 2025"
            validation="matches:/^\d{4}$/"
            :validation-messages="{ matches: 'Masukkan 4 digit tahun.' }"
            validation-visibility="live"
            inputmode="numeric"
          />
        </div>

        <!-- Actions -->
        <div class="mt-5 flex justify-end gap-2">
          <rs-button variant="secondary-outline" size="md" @click="onReset">Reset</rs-button>
          <rs-button variant="primary" size="md" :disabled="!isValid" @click="onSearch">Cari</rs-button>
        </div>
      </div>
    </rs-card>

    <!-- Senarai -->
    <div class="mt-6">
      <rs-card>
        <div class="p-4">
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold">Laporan Penerima Bantuan Semasa</h3>
            <div class="flex items-center gap-2">
              <rs-button size="sm" variant="secondary-outline" @click="onExport('excel')">Excel</rs-button>
              <rs-button size="sm" variant="secondary-outline" @click="onExport('pdf')">PDF</rs-button>
            </div>
          </div>

          <p class="mt-1 text-xs text-slate-500">Rekod dipaparkan: {{ totalRekod }}</p>

          <div
            v-if="!hasSearched"
            class="mt-4 flex h-40 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 text-slate-500"
          >
            <div class="text-xl">∨</div>
            <div class="mt-1 text-sm">Sila buat carian dahulu</div>
          </div>

          <div v-else>
            <div class="overflow-auto mt-4">
              <table class="min-w-full table-fixed border-collapse">
                <thead>
                  <tr class="bg-slate-50 text-left text-sm text-slate-600">
                    <th class="px-3 py-2 font-medium border w-14">Bil</th>
                    <th class="px-3 py-2 font-medium border">ID Asnaf</th>
                    <th class="px-3 py-2 font-medium border">Nama</th>
                    <th class="px-3 py-2 font-medium border">Jantina</th>
                    <th class="px-3 py-2 font-medium border">Umur</th>
                    <th class="px-3 py-2 font-medium border">Bilangan Tanggungan</th>
                    <th class="px-3 py-2 font-medium border">Total Distribution</th>
                    <th class="px-3 py-2 font-medium border">Daerah</th>
                    <th class="px-3 py-2 font-medium border">Kariah</th>
                    <th class="px-3 py-2 font-medium border">Aid Code</th>
                    <th class="px-3 py-2 font-medium border">Aid Name</th>
                    <th class="px-3 py-2 font-medium border">Aid Product</th>
                    <th class="px-3 py-2 font-medium border">Product Package</th>
                    <th class="px-3 py-2 font-medium border">Entitlement Product</th>
                    <th class="px-3 py-2 font-medium border">Start Date</th>
                    <th class="px-3 py-2 font-medium border">Nama Organisasi (Masjid/Surau)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(r, i) in rows" :key="r.idAsnaf + '-' + i" class="text-sm">
                    <td class="px-3 py-2 border whitespace-nowrap">{{ i + 1 }}</td>
                    <td class="px-3 py-2 border whitespace-nowrap">{{ r.idAsnaf }}</td>
                    <td class="px-3 py-2 border whitespace-nowrap">{{ r.nama }}</td>
                    <td class="px-3 py-2 border whitespace-nowrap">{{ r.jantina }}</td>
                    <td class="px-3 py-2 border whitespace-nowrap text-right">{{ r.umur }}</td>
                    <td class="px-3 py-2 border whitespace-nowrap text-right">{{ r.bilTanggungan }}</td>
                    <td class="px-3 py-2 border whitespace-nowrap text-right">{{ r.totalDistribution }}</td>
                    <td class="px-3 py-2 border whitespace-nowrap">{{ r.daerah }}</td>
                    <td class="px-3 py-2 border whitespace-nowrap">{{ r.kariah }}</td>
                    <td class="px-3 py-2 border whitespace-nowrap">{{ r.aidCode }}</td>
                    <td class="px-3 py-2 border whitespace-nowrap">{{ r.aidName }}</td>
                    <td class="px-3 py-2 border whitespace-nowrap">{{ r.aidProduct }}</td>
                    <td class="px-3 py-2 border whitespace-nowrap">{{ r.productPackage }}</td>
                    <td class="px-3 py-2 border whitespace-nowrap">{{ r.entitlementProduct }}</td>
                    <td class="px-3 py-2 border whitespace-nowrap">{{ formatDate(r.startDate) }}</td>
                    <td class="px-3 py-2 border whitespace-nowrap">{{ r.namaOrganisasi }}</td>
                  </tr>
                  <tr v-if="rows.length === 0">
                    <td colspan="16" class="px-3 py-6 text-center text-slate-500 border">
                      Tiada rekod mengikut kriteria carian.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </rs-card>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ title: 'Laporan Penerima Bantuan Semasa' })
import { reactive, ref, computed, watch } from 'vue'

/* Header */
const jenisLaporan = 'DOAA'
const namaLaporan  = 'Laporan Penerima Bantuan Semasa'

/* === Dataset: ikut jadual yang diberi === */
const DATA_PENERIMA = [
  { idAsnaf:'A100', nama:'Ahmad Ali', jantina:'Lelaki', umur:64, bilTanggungan:2, totalDistribution:9,  daerah:'Petaling', kariah:'MASJID NURUL EHSAN TAMAN MEDAN', aidCode:'B105', aidName:'BANTUAN KEWANGAN BULANAN (FAKIR)', aidProduct:'BANTUAN KEWANGAN BULANAN (FAKIR)', productPackage:'KEWANGAN BULANAN (FAKIR) - T2', entitlementProduct:'KEWANGAN BULANAN (FAKIR) - T2', startDate:'2025-10-12', namaOrganisasi:'Surau Al-Mawaddah' },
  { idAsnaf:'A101', nama:'Siti Aminah', jantina:'Perempuan', umur:25, bilTanggungan:1, totalDistribution:9, daerah:'Klang', kariah:'MASJID KAMPUNG PENDAMAR', aidCode:'B105', aidName:'BANTUAN KEWANGAN BULANAN (FAKIR)', aidProduct:'BANTUAN KEWANGAN BULANAN (FAKIR)', productPackage:'KEWANGAN BULANAN (FAKIR) - T1', entitlementProduct:'KEWANGAN BULANAN (FAKIR) - T1', startDate:'2025-08-07', namaOrganisasi:'Masjid Al-Ikhlas' },
  { idAsnaf:'A102', nama:'Mohd Faiz', jantina:'Perempuan', umur:33, bilTanggungan:3, totalDistribution:1, daerah:'Klang', kariah:'MASJID NURUL AMIN, KAMPUNG DELEK', aidCode:'B105', aidName:'BANTUAN KEWANGAN BULANAN (FAKIR)', aidProduct:'BANTUAN KEWANGAN BULANAN (FAKIR)', productPackage:'KEWANGAN BULANAN (FAKIR) - T3', entitlementProduct:'KEWANGAN BULANAN (FAKIR) - T3', startDate:'2025-06-25', namaOrganisasi:'Masjid An-Nur' },
  { idAsnaf:'A103', nama:'Nor Aisyah', jantina:'Perempuan', umur:42, bilTanggungan:6, totalDistribution:10, daerah:'Klang', kariah:'MASJID NURUL JANNAH, MERU', aidCode:'B105', aidName:'BANTUAN KEWANGAN BULANAN (FAKIR)', aidProduct:'BANTUAN KEWANGAN BULANAN (FAKIR)', productPackage:'KEWANGAN BULANAN (FAKIR) - T6', entitlementProduct:'KEWANGAN BULANAN (FAKIR) - T6', startDate:'2025-07-28', namaOrganisasi:'Masjid Al-Falah' },
  { idAsnaf:'A104', nama:'Hafiz Rahman', jantina:'Perempuan', umur:43, bilTanggungan:2, totalDistribution:7, daerah:'Petaling', kariah:'MASJID SETIA ALAM', aidCode:'B105', aidName:'BANTUAN KEWANGAN BULANAN (FAKIR)', aidProduct:'BANTUAN KEWANGAN BULANAN (FAKIR)', productPackage:'KEWANGAN BULANAN (FAKIR) - T2', entitlementProduct:'KEWANGAN BULANAN (FAKIR) - T2', startDate:'2025-12-26', namaOrganisasi:'Surau Ar-Rahman' },
  { idAsnaf:'A105', nama:'Zainab Omar', jantina:'Perempuan', umur:67, bilTanggungan:1, totalDistribution:15, daerah:'Petaling', kariah:'MASJID SETIA ALAM', aidCode:'B106', aidName:'BANTUAN MAKANAN BULANAN (MISKIN)', aidProduct:'MAKANAN BULANAN (MISKIN)', productPackage:'MAKANAN BULANAN TERAS (MISKIN) - K1', entitlementProduct:'K1 MISKIN - (5KG BERAS, 1KG TEPUNG, 1KG MINYAK, 1KG GULA, 1 BIHUN, 1 KICAP)', startDate:'2025-10-28', namaOrganisasi:'Masjid Al-Hidayah' },
  { idAsnaf:'A106', nama:'Azlan Ismail', jantina:'Lelaki', umur:35, bilTanggungan:3, totalDistribution:9, daerah:'Gombak', kariah:'MASJID SERI MELATI', aidCode:'B106', aidName:'BANTUAN MAKANAN BULANAN (MISKIN)', aidProduct:'MAKANAN BULANAN (MISKIN)', productPackage:'MAKANAN BULANAN TERAS (MISKIN) - K2', entitlementProduct:'K2 MISKIN - (10KG BERAS, 2KG TEPUNG, 2KG MINYAK, 2KG GULA, 2 BIHUN, 1 KICAP)', startDate:'2025-11-17', namaOrganisasi:'Masjid An-Nur' },
  { idAsnaf:'A107', nama:'Nurul Huda', jantina:'Perempuan', umur:67, bilTanggungan:7, totalDistribution:15, daerah:'Gombak', kariah:'MASJID SERI MELATI', aidCode:'B106', aidName:'BANTUAN MAKANAN BULANAN (MISKIN)', aidProduct:'MAKANAN BULANAN (MISKIN)', productPackage:'MAKANAN BULANAN TERAS (MISKIN) - K3', entitlementProduct:'K3 MISKIN - (15KG BERAS, 2KG TEPUNG, 4KG MINYAK, 2KG GULA, 2 BIHUN, 1 KICAP)', startDate:'2025-03-17', namaOrganisasi:'Masjid Al-Falah' },
  { idAsnaf:'A108', nama:'Farid Jamal', jantina:'Lelaki', umur:56, bilTanggungan:3, totalDistribution:12, daerah:'Gombak', kariah:'MASJID SERI MELATI', aidCode:'B103', aidName:'(HQ) BANTUAN PERUBATAN DIALISIS (FAKIR)', aidProduct:'(HQ) KATEGORI HEMODIALISIS (FAKIR)', productPackage:'(GL) (HQ) HEMODIALISIS (FAKIR)', entitlementProduct:'(GL) (HQ) HEMODIALISIS (FAKIR)', startDate:'2025-10-10', namaOrganisasi:'Surau At-Taqwa' },
  { idAsnaf:'A109', nama:'Aminah Latif', jantina:'Perempuan', umur:27, bilTanggungan:2, totalDistribution:9, daerah:'Gombak', kariah:'MASJID SAUJANA UTAMA', aidCode:'B103', aidName:'(HQ) BANTUAN PERUBATAN DIALISIS (FAKIR)', aidProduct:'(HQ) KATEGORI HEMODIALISIS (FAKIR)', productPackage:'(GL) (HQ) SUNTIKAN EPO (FAKIR)', entitlementProduct:'(GL) (HQ) SUNTIKAN EPO (FAKIR)', startDate:'2025-05-16', namaOrganisasi:'Masjid Al-Hidayah' },
  { idAsnaf:'A110', nama:'Syafiq Zulkifli', jantina:'Perempuan', umur:59, bilTanggungan:1, totalDistribution:2, daerah:'Gombak', kariah:'MASJID SAUJANA UTAMA', aidCode:'B103', aidName:'(HQ) BANTUAN PERUBATAN DIALISIS (FAKIR)', aidProduct:'(HQ) KATEGORI HEMODIALISIS (FAKIR)', productPackage:'(GL) (HQ) HEMODIALISIS SAHAJA (FAKIR)', entitlementProduct:'(GL) (HQ) HEMODIALISIS SAHAJA (FAKIR)', startDate:'2025-05-20', namaOrganisasi:'Surau Al-Mawaddah' },
]

/* === Opsyen lokasi: dibina dari dataset supaya konsisten === */
const semuaDaerah = [...new Set(DATA_PENERIMA.map(r => r.daerah))].sort()
const petaKariah = Object.fromEntries(
  semuaDaerah.map(d => [d, [...new Set(DATA_PENERIMA.filter(r => r.daerah === d).map(r => r.kariah))].sort()])
)

const daerahOptionsWithAll = computed(() => [
  { label: 'Semua Daerah', value: '' },
  ...semuaDaerah.map(v => ({ label: v, value: v }))
])

const allKariah = computed(() => [...new Set(DATA_PENERIMA.map(r => r.kariah))].sort())
const kariahOptionsForDaerah = computed(() => {
  if (!criteria.daerah) return allKariah.value
  return petaKariah[criteria.daerah] || []
})
const kariahOptionsWithAll = computed(() => [
  { label: 'Semua Kariah', value: '' },
  ...kariahOptionsForDaerah.value.map(v => ({ label: v, value: v }))
])

/* Criteria */
const criteria = reactive({
  daerah: '',       // '' = Semua Daerah
  kariah: '',       // '' = Semua Kariah
  tarikhDari: '',
  tarikhHingga: '',
  tahun: ''
})

/* Reset kariah bila daerah berubah */
watch(() => criteria.daerah, () => {
  criteria.kariah = ''
})

/* Table state */
const rows = ref([])
const hasSearched = ref(false)
const totalRekod = computed(() => rows.value.length)

/* Validation */
const dateRangeValid = computed(() => {
  if (!criteria.tarikhDari || !criteria.tarikhHingga) return true
  return new Date(criteria.tarikhHingga) >= new Date(criteria.tarikhDari)
})
const tahunValid = computed(() => !criteria.tahun || /^\d{4}$/.test(criteria.tahun))
const isValid = computed(() => dateRangeValid.value && tahunValid.value)

/* Actions */
function onReset () {
  criteria.daerah = ''
  criteria.kariah = ''
  criteria.tarikhDari = ''
  criteria.tarikhHingga = ''
  criteria.tahun = ''
  rows.value = []
  hasSearched.value = false
}

function onSearch () {
  if (!isValid.value) return
  hasSearched.value = true

  const from = criteria.tarikhDari ? new Date(criteria.tarikhDari) : null
  const to   = criteria.tarikhHingga ? new Date(criteria.tarikhHingga) : null
  const y    = criteria.tahun ? Number(criteria.tahun) : null

  rows.value = DATA_PENERIMA.filter(r => {
    const start = new Date(r.startDate)
    if (criteria.daerah && r.daerah !== criteria.daerah) return false
    if (criteria.kariah && r.kariah !== criteria.kariah) return false
    if (from && start < from) return false
    if (to && start > to) return false
    if (y && start.getFullYear() !== y) return false
    return true
  })
}

function onExport (type) {
  console.log('Export:', type, { ...criteria, jenisLaporan, namaLaporan, rekod: rows.value.length })
}

/* Helpers */
function formatDate (iso) {
  const d = new Date(iso)
  if (isNaN(d)) return iso
  return d.toLocaleDateString('ms-MY', { day: '2-digit', month: '2-digit', year: 'numeric' })
}
</script>
