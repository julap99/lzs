<template>
  <div>
    <h1 class="text-xl font-semibold mb-4">Laporan Bantuan Sewa Rumah</h1>

    <!-- Kriteria Carian -->
    <rs-card>
      <div class="p-4">
        <h2 class="text-base font-semibold">Kriteria Carian</h2>

        <!-- Baris 1: Read-only header -->
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

        <!-- Baris 2: Daerah & Kariah -->
        <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormKit
            type="select"
            label="Daerah"
            v-model="criteria.daerah"
            :options="daerahOptionsWithAll"
            placeholder="Semua Daerah"
          />
          <FormKit
            type="select"
            label="Kariah"
            v-model="criteria.kariah"
            :options="kariahOptionsWithAll"
            placeholder="Semua Kariah"
          />
        </div>

        <!-- Baris 3: Tarikh (inline range) -->
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

        <!-- Baris 4: Tahun -->
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
            <h3 class="text-base font-semibold">Senarai Bantuan Sewa Rumah</h3>
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
              <!-- Lajur ikut data yang diberi -->
              <table class="min-w-full table-fixed border-collapse">
                <thead>
                  <tr class="bg-slate-50 text-left text-sm text-slate-600">
                    <th class="px-3 py-2 font-medium border">Bil</th>
                    <th class="px-3 py-2 font-medium border">ID Asnaf</th>
                    <th class="px-3 py-2 font-medium border">Nama</th>
                    <th class="px-3 py-2 font-medium border">Jantina</th>
                    <th class="px-3 py-2 font-medium border">Umur</th>
                    <th class="px-3 py-2 font-medium border">Daerah</th>
                    <th class="px-3 py-2 font-medium border">Kariah</th>
                    <th class="px-3 py-2 font-medium border">Alamat Rumah Sewa</th>
                    <th class="px-3 py-2 font-medium border">Amaun Sewa Bulanan (RM)</th>
                    <th class="px-3 py-2 font-medium border">Amaun Bantuan (RM)</th>
                    <th class="px-3 py-2 font-medium border">Tempoh Bantuan (bulan)</th>
                    <th class="px-3 py-2 font-medium border">Tarikh Mula Bantuan</th>
                    <th class="px-3 py-2 font-medium border">Tarikh Tamat Bantuan</th>
                    <th class="px-3 py-2 font-medium border">Nama Tuan Rumah</th>
                    <th class="px-3 py-2 font-medium border">No Pengenalan</th>
                    <th class="px-3 py-2 font-medium border">Status Bantuan</th>
                    <th class="px-3 py-2 font-medium border">Catatan</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(r, i) in rows" :key="r.idAsnaf" class="text-sm">
                    <td class="px-3 py-2 border whitespace-nowrap">{{ i + 1 }}</td>
                    <td class="px-3 py-2 border whitespace-nowrap">{{ r.idAsnaf }}</td>
                    <td class="px-3 py-2 border whitespace-nowrap">{{ r.nama }}</td>
                    <td class="px-3 py-2 border whitespace-nowrap">{{ r.jantina }}</td>
                    <td class="px-3 py-2 border whitespace-nowrap">{{ r.umur }}</td>
                    <td class="px-3 py-2 border whitespace-nowrap">{{ r.daerah }}</td>
                    <td class="px-3 py-2 border whitespace-nowrap">{{ r.kariah }}</td>
                    <td class="px-3 py-2 border">{{ r.alamatSewa }}</td>
                    <td class="px-3 py-2 border text-right whitespace-nowrap">{{ formatRM(r.amaunSewaBulanan) }}</td>
                    <td class="px-3 py-2 border text-right whitespace-nowrap">{{ formatRM(r.amaunBantuan) }}</td>
                    <td class="px-3 py-2 border text-right">{{ r.tempohBantuanBulan }}</td>
                    <td class="px-3 py-2 border whitespace-nowrap">{{ formatDate(r.tarikhMula) }}</td>
                    <td class="px-3 py-2 border whitespace-nowrap">{{ formatDate(r.tarikhTamat) }}</td>
                    <td class="px-3 py-2 border whitespace-nowrap">{{ r.namaTuanRumah }}</td>
                    <td class="px-3 py-2 border whitespace-nowrap">{{ r.noPengenalan }}</td>
                    <td class="px-3 py-2 border">
                      <span class="px-2 py-1 rounded-lg text-xs font-medium" :class="statusClass(r.statusBantuan)">
                        {{ r.statusBantuan }}
                      </span>
                    </td>
                    <td class="px-3 py-2 border">{{ r.catatan || '-' }}</td>
                  </tr>

                  <tr v-if="rows.length === 0">
                    <td colspan="17" class="px-3 py-6 text-center text-slate-500 border">
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
definePageMeta({ title: 'Laporan Bantuan Sewa Rumah' })
import { reactive, ref, computed } from 'vue'

/* Read-only header */
const jenisLaporan = 'DOAA'
const namaLaporan  = 'Laporan Bantuan Sewa Rumah'

/* ===== Dataset: menggunakan data yang diberi (dinormalkan ke ISO untuk penapisan) ===== */
const DATA_SEWA = [
  {
    idAsnaf: 'SR001',
    nama: 'Ahmad Ali',
    jantina: 'Lelaki',
    umur: 36,
    daerah: 'Gombak',
    kariah: 'Masjid Al-Hidayah',
    alamatSewa: 'No.12, Jalan Melati, Taman Gombak',
    amaunSewaBulanan: 800,
    amaunBantuan: 600,
    tempohBantuanBulan: 12,
    tarikhMula: '2024-01-01',
    tarikhTamat: '2024-12-31',
    namaTuanRumah: 'Ahmad bin Ali',
    noPengenalan: '570416115111',
    statusBantuan: 'Aktif',
    catatan: 'Bayaran bulan Ogos tertangguh'
  },
  {
    idAsnaf: 'SR002',
    nama: 'Siti Aminah',
    jantina: 'Perempuan',
    umur: 42,
    daerah: 'Klang',
    kariah: 'Surau At-Taqwa',
    alamatSewa: 'Apt 5-2, Jalan Kasih, Klang',
    amaunSewaBulanan: 700,
    amaunBantuan: 500,
    tempohBantuanBulan: 6,
    tarikhMula: '2024-03-01',
    tarikhTamat: '2024-08-31',
    namaTuanRumah: 'Roslan bin Omar',
    noPengenalan: '570416115111',
    statusBantuan: 'Tidak Aktif',
    catatan: 'Perlu mohon sambungan'
  },
  {
    idAsnaf: 'SR003',
    nama: 'Mohd Faiz',
    jantina: 'Lelaki',
    umur: 29,
    daerah: 'Shah Alam',
    kariah: 'Masjid Al-Falah',
    alamatSewa: 'No.25, Jalan Mawar, Seksyen 7',
    amaunSewaBulanan: 950,
    amaunBantuan: 700,
    tempohBantuanBulan: 12,
    tarikhMula: '2024-06-01',
    tarikhTamat: '2025-05-31',
    namaTuanRumah: 'Siti binti Rahman',
    noPengenalan: '570416115114',
    statusBantuan: 'Aktif',
    catatan: '-'
  },
  {
    idAsnaf: 'SR004',
    nama: 'Nor Aisyah',
    jantina: 'Perempuan',
    umur: 55,
    daerah: 'Petaling',
    kariah: 'Masjid An-Nur',
    alamatSewa: 'No.8, Jalan Seri Petaling',
    amaunSewaBulanan: 650,
    amaunBantuan: 500,
    tempohBantuanBulan: 9,
    tarikhMula: '2024-04-01',
    tarikhTamat: '2024-12-31',
    namaTuanRumah: 'Faridah binti Musa',
    noPengenalan: '570416115116',
    statusBantuan: 'Aktif',
    catatan: '-'
  },
  {
    idAsnaf: 'SR005',
    nama: 'Hafiz Rahman',
    jantina: 'Lelaki',
    umur: 47,
    daerah: 'Hulu Langat',
    kariah: 'Surau Ar-Rahman',
    alamatSewa: 'No.3, Jalan Damai, Kajang',
    amaunSewaBulanan: 750,
    amaunBantuan: 600,
    tempohBantuanBulan: 12,
    tarikhMula: '2024-02-01',
    tarikhTamat: '2025-01-31',
    namaTuanRumah: 'Faridah binti Musa',
    noPengenalan: '570416115116',
    statusBantuan: 'Aktif',
    catatan: 'Bayaran konsisten'
  }
]

/* === Options (Daerah, Kariah) === */
const daerahOptions = computed(() => {
  const set = new Set(DATA_SEWA.map(d => d.daerah))
  return Array.from(set).map(v => ({ label: v, value: v }))
})
const daerahOptionsWithAll = computed(() => [
  { label: 'Semua Daerah', value: '' },
  ...daerahOptions.value
])

const kariahByDaerah = computed(() => {
  const map = {}
  DATA_SEWA.forEach(d => {
    map[d.daerah] ||= new Set()
    map[d.daerah].add(d.kariah)
  })
  const obj = {}
  Object.keys(map).forEach(k => {
    obj[k] = Array.from(map[k]).map(v => ({ label: v, value: v }))
  })
  return obj
})
const allKariahOptions = computed(() => {
  const set = new Set(DATA_SEWA.map(d => d.kariah))
  return Array.from(set).map(v => ({ label: v, value: v }))
})
const kariahOptionsForSelectedDaerah = computed(() => {
  if (!criteria.daerah) return allKariahOptions.value
  return kariahByDaerah.value[criteria.daerah] || []
})
const kariahOptionsWithAll = computed(() => [
  { label: 'Semua Kariah', value: '' },
  ...kariahOptionsForSelectedDaerah.value
])

/* Criteria */
const criteria = reactive({
  tarikhDari: '',
  tarikhHingga: '',
  tahun: '',
  daerah: '',
  kariah: ''
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
  criteria.tarikhDari = ''
  criteria.tarikhHingga = ''
  criteria.tahun = ''
  criteria.daerah = ''
  criteria.kariah = ''
  rows.value = []
  hasSearched.value = false
}

function onSearch () {
  if (!isValid.value) return
  hasSearched.value = true

  const from = criteria.tarikhDari ? new Date(criteria.tarikhDari) : null
  const to   = criteria.tarikhHingga ? new Date(criteria.tarikhHingga) : null
  const y    = criteria.tahun ? Number(criteria.tahun) : null

  // Penapisan ikut Tarikh Mula (seperti pola carian sebelum ini)
  rows.value = DATA_SEWA.filter(r => {
    const start = new Date(r.tarikhMula)
    if (from && start < from) return false
    if (to && start > to) return false
    if (y && start.getFullYear() !== y) return false
    if (criteria.daerah && r.daerah !== criteria.daerah) return false
    if (criteria.kariah && r.kariah !== criteria.kariah) return false
    return true
  })
}

function onExport (type) {
  // Placeholder – sambung ke util eksport sebenar (XLSX/PDF) bila sedia
  console.log('Export:', type, {
    ...criteria,
    jenisLaporan,
    namaLaporan,
    rekod: rows.value.length
  })
}

/* Helpers */
function formatDate (iso) {
  const d = new Date(iso)
  if (isNaN(d)) return iso
  return d.toLocaleDateString('ms-MY', { day: '2-digit', month: '2-digit', year: 'numeric' })
}
function formatRM (n) {
  if (typeof n !== 'number') return n
  return n.toLocaleString('ms-MY', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}
function statusClass (s) {
  return {
    'bg-emerald-100 text-emerald-700': s === 'Aktif',
    'bg-amber-100 text-amber-700': s === 'Tidak Aktif' || s === 'Tertangguh',
    'bg-slate-100 text-slate-700': !s
  }
}
</script>
