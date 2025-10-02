<template>
  <div>
    <h1 class="text-xl font-semibold mb-4">Laporan Aging Asnaf Review</h1>

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

        <!-- Baris 2: Daerah & Kariah (sebaris seperti gambar) -->
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
            <h3 class="text-base font-semibold">Senarai Aging Asnaf</h3>
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
                    <th class="px-3 py-2 font-medium border">ID Asnaf</th>
                    <th class="px-3 py-2 font-medium border">Nama</th>
                    <th class="px-3 py-2 font-medium border">Jantina</th>
                    <th class="px-3 py-2 font-medium border">Umur</th>
                    <th class="px-3 py-2 font-medium border">Daerah</th>
                    <th class="px-3 py-2 font-medium border">Kariah</th>
                    <th class="px-3 py-2 font-medium border">Aid</th>
                    <th class="px-3 py-2 font-medium border">Tarikh Semakan Terakhir</th>
                    <th class="px-3 py-2 font-medium border">Aging (Hari)</th>
                    <th class="px-3 py-2 font-medium border">Status Review</th>
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
                    <td class="px-3 py-2 border whitespace-nowrap">{{ r.aid }}</td>
                    <td class="px-3 py-2 border whitespace-nowrap">{{ formatDate(r.tarikhSemakan) }}</td>
                    <td class="px-3 py-2 border text-right whitespace-nowrap">{{ r.aging }}</td>
                    <td class="px-3 py-2 border whitespace-nowrap">
                      <span class="px-2 py-1 rounded-full text-xs" :class="statusClass(r.statusReview)">
                        {{ r.statusReview }}
                      </span>
                    </td>
                    <td class="px-3 py-2 border whitespace-nowrap">{{ r.catatan }}</td>
                  </tr>

                  <tr v-if="rows.length === 0">
                    <td colspan="12" class="px-3 py-6 text-center text-slate-500 border">
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
definePageMeta({ title: 'Laporan Aging Asnaf Review' })
import { reactive, ref, computed, watch } from 'vue'

/* Read-only header */
const jenisLaporan = 'DOAA'
const namaLaporan  = 'Laporan Aging Asnaf Review'

/* Daerah & Kariah (contoh) */
const daerahList = ['Klang', 'Petaling', 'Gombak', 'Hulu Langat', 'Sepang']
const petaKariah = {
  Klang: ['MASJID AL-FALAH JALAN KEBUN'],
  Petaling: ['MASJID SETIA ALAM', 'MASJID KOTA DAMANSARA'],
  Gombak: ['MASJID SAUJANA UTAMA', 'MASJID AL-IKHWANIAH'],
  'Hulu Langat': ['MASJID TERAS JERNANG'],
  Sepang: []
}

/* Options with “Semua …” + cascading */
const daerahOptionsWithAll = computed(() => [
  { label: 'Semua Daerah', value: '' },
  ...daerahList.map(v => ({ label: v, value: v }))
])
const kariahOptionsForDaerah = computed(() => {
  if (!criteria.daerah) {
    // Semua daerah → gabung semua kariah unik
    const all = new Set(Object.values(petaKariah).flat())
    return Array.from(all)
  }
  return petaKariah[criteria.daerah] || []
})
const kariahOptionsWithAll = computed(() => [
  { label: 'Semua Kariah', value: '' },
  ...kariahOptionsForDaerah.value.map(v => ({ label: v, value: v }))
])

/* ===== Dataset (contoh) ===== */
const DATA_BANTUAN = [
  { idAsnaf: 'A200', nama: 'Ahmad Ali', jantina: 'Lelaki', umur: 36, daerah: 'Klang',    kariah: 'MASJID AL-FALAH JALAN KEBUN', aid: 'TDS', tarikhSemakan: '2025-08-25', aging: 24,  statusReview: 'Selesai',      catatan: '-' },
  { idAsnaf: 'A201', nama: 'Siti Aminah', jantina: 'Lelaki', umur: 65, daerah: 'Klang',  kariah: 'MASJID AL-FALAH JALAN KEBUN', aid: 'TDS', tarikhSemakan: '2024-12-12', aging: 280, statusReview: 'Perlu Disemak', catatan: 'Melebihi 6 bulan' },
  // ...tambahkan data lain jika ada
]

/* Criteria */
const criteria = reactive({
  tarikhDari: '',
  tarikhHingga: '',
  tahun: '',
  daerah: '',   // '' = Semua Daerah
  kariah: ''    // '' = Semua Kariah
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

  rows.value = DATA_BANTUAN.filter(r => {
    const t = new Date(r.tarikhSemakan)
    if (from && t < from) return false
    if (to && t > to) return false
    if (y && t.getFullYear() !== y) return false
    if (criteria.daerah && r.daerah !== criteria.daerah) return false
    if (criteria.kariah && r.kariah !== criteria.kariah) return false
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
    'bg-emerald-100 text-emerald-700': s === 'Selesai',
    'bg-amber-100 text-amber-700': s === 'Sedang Semakan',
    'bg-rose-100 text-rose-700': s === 'Perlu Disemak'
  }
}
</script>
