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
            validation="matches:/^\\d{4}$/"
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
                    <th class="px-3 py-2 font-medium border">Bil</th>
                    <th class="px-3 py-2 font-medium border">ID Bantuan</th>
                    <th class="px-3 py-2 font-medium border">ID Asnaf</th>
                    <th class="px-3 py-2 font-medium border">Nama</th>
                    <th class="px-3 py-2 font-medium border">Aid Code</th>
                    <th class="px-3 py-2 font-medium border">Aid Name</th>
                    <th class="px-3 py-2 font-medium border">Tarikh Mula</th>
                    <th class="px-3 py-2 font-medium border">Tarikh Tamat</th>
                    <th class="px-3 py-2 font-medium border">Aging (Hari)</th>
                    <th class="px-3 py-2 font-medium border">Status Bantuan</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(r, i) in rows" :key="r.idBantuan" class="text-sm">
                    <td class="px-3 py-2 border whitespace-nowrap">{{ i + 1 }}</td>
                    <td class="px-3 py-2 border whitespace-nowrap">{{ r.idBantuan }}</td>
                    <td class="px-3 py-2 border whitespace-nowrap">{{ r.idAsnaf }}</td>
                    <td class="px-3 py-2 border whitespace-nowrap">{{ r.nama }}</td>
                    <td class="px-3 py-2 border whitespace-nowrap">{{ r.aidCode }}</td>
                    <td class="px-3 py-2 border whitespace-nowrap">{{ r.aidName }}</td>
                    <td class="px-3 py-2 border whitespace-nowrap">{{ formatDate(r.tarikhMula) }}</td>
                    <td class="px-3 py-2 border whitespace-nowrap">{{ r.tarikhTamat ? formatDate(r.tarikhTamat) : '—' }}</td>
                    <td class="px-3 py-2 border whitespace-nowrap text-right">{{ r.agingHari }}</td>
                    <td class="px-3 py-2 border">
                      <span class="px-2 py-0.5 rounded-full text-xs font-medium" :class="statusClass(r.statusBantuan)">
                        {{ r.statusBantuan }}
                      </span>
                    </td>
                  </tr>
                  <tr v-if="rows.length === 0">
                    <td colspan="10" class="px-3 py-6 text-center text-slate-500 border">
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

/* Opsyen lokasi (contoh) */
const opsiDaerah = ['Petaling', 'Klang', 'Gombak']
const petaKariah = {
  Petaling: ['MASJID SETIA ALAM', 'Surau Ar-Rahman', 'Surau Al-Mawaddah'],
  Klang: ['MASJID KAMPUNG PENDAMAR', 'MASJID NURUL AMIN, KAMPUNG DELEK', 'MASJID NURUL JANNAH, MERU', 'Masjid Al-Ikhlas', 'Masjid Al-Falah'],
  Gombak: ['MASJID SERI MELATI', 'MASJID SAUJANA UTAMA', 'Surau At-Taqwa', 'Masjid Al-Hidayah']
}

/* Dropdown options (label/value) */
const daerahOptionsWithAll = computed(() => [
  { label: 'Semua Daerah', value: '' },
  ...opsiDaerah.map(v => ({ label: v, value: v }))
])

const allKariah = computed(() => [...new Set(Object.values(petaKariah).flat())])
const kariahOptionsForDaerah = computed(() => {
  if (!criteria.daerah) return allKariah.value
  return petaKariah[criteria.daerah] || []
})
const kariahOptionsWithAll = computed(() => [
  { label: 'Semua Kariah', value: '' },
  ...kariahOptionsForDaerah.value.map(v => ({ label: v, value: v }))
])

/* Dataset contoh */
const DATA_AGING = [
  { idBantuan:'B1001', idAsnaf:'A300', nama:'Ahmad Ali',   aidCode:'B112', aidName:'BANTUAN SEWAAN/ANSURAN RUMAH (MISKIN)',  tarikhMula:'2025-01-15', tarikhTamat:'2025-06-15',  agingHari:151, statusBantuan:'Tamat',         daerah:'Petaling', kariah:'Surau Ar-Rahman' },
  { idBantuan:'B1002', idAsnaf:'A301', nama:'Siti Aminah', aidCode:'B112', aidName:'BANTUAN SEWAAN/ANSURAN RUMAH (MISKIN)',  tarikhMula:'2025-03-01', tarikhTamat:'',             agingHari:201, statusBantuan:'Aktif',         daerah:'Klang',    kariah:'MASJID KAMPUNG PENDAMAR' },
  { idBantuan:'B1003', idAsnaf:'A302', nama:'Mohd Faiz',   aidCode:'B112', aidName:'BANTUAN SEWAAN/ANSURAN RUMAH (MUALLAF)', tarikhMula:'2025-04-10', tarikhTamat:'',             agingHari:161, statusBantuan:'Perlu Disemak', daerah:'Klang',    kariah:'MASJID NURUL AMIN, KAMPUNG DELEK' },
  { idBantuan:'B1004', idAsnaf:'A303', nama:'Nor Aisyah',  aidCode:'B112', aidName:'BANTUAN SEWAAN/ANSURAN RUMAH (MUALLAF)', tarikhMula:'2025-05-20', tarikhTamat:'',             agingHari:121, statusBantuan:'Aktif',         daerah:'Klang',    kariah:'MASJID NURUL JANNAH, MERU' },
  { idBantuan:'B1005', idAsnaf:'A304', nama:'Hafiz Rahman',aidCode:'B104', aidName:'(HQ) BANTUAN KEPERLUAN HIDUP (FAKIR)',   tarikhMula:'2025-02-12', tarikhTamat:'2025-08-15',   agingHari:184, statusBantuan:'Tamat',         daerah:'Petaling', kariah:'MASJID SETIA ALAM' },
  { idBantuan:'B1006', idAsnaf:'A305', nama:'Zainab Omar', aidCode:'B104', aidName:'(HQ) BANTUAN KEPERLUAN HIDUP (FAKIR)',   tarikhMula:'2025-07-01', tarikhTamat:'',             agingHari:79,  statusBantuan:'Aktif',         daerah:'Klang',    kariah:'Masjid Al-Ikhlas' },
  { idBantuan:'B1007', idAsnaf:'A306', nama:'Azlan Ismail',aidCode:'B105', aidName:'BANTUAN KEWANGAN BULANAN (MUALLAF)',     tarikhMula:'2025-06-18', tarikhTamat:'',             agingHari:92,  statusBantuan:'Aktif',         daerah:'Gombak',   kariah:'MASJID SERI MELATI' },
  { idBantuan:'B1008', idAsnaf:'A307', nama:'Nurul Huda',  aidCode:'B105', aidName:'BANTUAN KEWANGAN BULANAN (MUALLAF)',     tarikhMula:'2025-03-25', tarikhTamat:'',             agingHari:178, statusBantuan:'Perlu Disemak', daerah:'Gombak',   kariah:'MASJID SERI MELATI' },
  { idBantuan:'B1009', idAsnaf:'A308', nama:'Farid Jamal', aidCode:'B146', aidName:'(HQ) BANTUAN BENCANA (MISKIN)',          tarikhMula:'2025-08-20', tarikhTamat:'',             agingHari:29,  statusBantuan:'Aktif',         daerah:'Gombak',   kariah:'Surau At-Taqwa' },
  { idBantuan:'B1010', idAsnaf:'A309', nama:'Aminah Latif',aidCode:'B146', aidName:'(HQ) BANTUAN BENCANA (MISKIN)',          tarikhMula:'2024-12-10', tarikhTamat:'2025-05-10',   agingHari:151, statusBantuan:'Tamat',         daerah:'Gombak',   kariah:'MASJID SAUJANA UTAMA' },
]

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

  rows.value = DATA_AGING.filter(r => {
    const start = new Date(r.tarikhMula)
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
function statusClass (s) {
  return {
    'bg-emerald-100 text-emerald-700': s === 'Aktif',
    'bg-amber-100 text-amber-700': s === 'Perlu Disemak',
    'bg-rose-100 text-rose-700': s === 'Tamat'
  }
}
</script>
