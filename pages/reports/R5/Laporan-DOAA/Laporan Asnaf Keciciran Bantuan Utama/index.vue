<template>
  <div>
    <h1 class="text-xl font-semibold mb-4">Laporan Asnaf Keciciran Bantuan Utama</h1>

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
            <h3 class="text-base font-semibold">Senarai Keciciran</h3>
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
              <!-- Lajur ikut URS -->
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
                    <th class="px-3 py-2 font-medium border">Bantuan Utama</th>
                    <th class="px-3 py-2 font-medium border">Aid Product</th>
                    <th class="px-3 py-2 font-medium border">Product Package</th>
                    <th class="px-3 py-2 font-medium border">Entitlement Product</th>
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
                    <td class="px-3 py-2 border">{{ r.bantuanUtama }}</td>
                    <td class="px-3 py-2 border">{{ r.aidProduct }}</td>
                    <td class="px-3 py-2 border">{{ r.productPackage }}</td>
                    <td class="px-3 py-2 border">{{ r.entitlementProduct }}</td>
                    <td class="px-3 py-2 border whitespace-nowrap">{{ formatDate(r.tarikhSemakanTerakhir) }}</td>
                    <td class="px-3 py-2 border text-right">{{ kiraAging(r.tarikhSemakanTerakhir) }}</td>
                    <td class="px-3 py-2 border">
                      <span class="px-2 py-1 rounded-lg text-xs font-medium" :class="statusClass(r.statusReview)">
                        {{ r.statusReview }}
                      </span>
                    </td>
                    <td class="px-3 py-2 border">{{ r.catatan || '-' }}</td>
                  </tr>

                  <tr v-if="rows.length === 0">
                    <td colspan="15" class="px-3 py-6 text-center text-slate-500 border">
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
definePageMeta({ title: 'Laporan Asnaf Keciciran Bantuan Utama' })
import { reactive, ref, computed } from 'vue'

/* Read-only header */
const jenisLaporan = 'DOAA'
const namaLaporan  = 'Laporan Asnaf Keciciran Bantuan Utama'

/* ===== Dataset contoh (selaras dengan URS) ===== */
const DATA_KECICIRAN = [
  {
    idAsnaf: 'A500',
    nama: 'Ahmad Ali',
    jantina: 'Lelaki',
    umur: 36,
    daerah: 'Gombak',
    kariah: 'Masjid Al-Hidayah',
    bantuanUtama: 'BANTUAN RAMADHAN & HARI RAYA (FAKIR)',
    aidProduct: 'RAMADHAN & HARI RAYA (FAKIR)',
    productPackage: 'PROGRAM DYMM (FAKIR) - T1',
    entitlementProduct: 'PROGRAM DYMM - PEMBERIAN SULTAN (MUALLAF) - T1',
    tarikhSemakanTerakhir: '2025-05-15',
    statusReview: 'Perlu Disemak',
    catatan: ''
  },
  {
    idAsnaf: 'A501',
    nama: 'Siti Aminah',
    jantina: 'Perempuan',
    umur: 42,
    daerah: 'Klang',
    kariah: 'Surau At-Taqwa',
    bantuanUtama: 'BANTUAN RAMADHAN & HARI RAYA (FAKIR)',
    aidProduct: 'RAMADHAN & HARI RAYA (FAKIR)',
    productPackage: 'PROGRAM DYMM (FAKIR) - T1',
    entitlementProduct: 'PROGRAM DYMM - WANG TAMBAHAN (MUALLAF) - T1',
    tarikhSemakanTerakhir: '2025-06-02',
    statusReview: 'Perlu Disemak',
    catatan: 'Semak dokumen sokongan'
  },
  {
    idAsnaf: 'A502',
    nama: 'Mohd Faiz',
    jantina: 'Lelaki',
    umur: 29,
    daerah: 'Shah Alam',
    kariah: 'Masjid Al-Falah',
    bantuanUtama: 'BANTUAN KEPERLUAN PENDIDIKAN SEKOLAH (FAKIR)',
    aidProduct: 'ELAUN KEHADIRAN PROGRAM (BANTUAN KEPERLUAN PENDIDIKAN SEKOLAH - FAKIR)',
    productPackage: 'ELAUN KEHADIRAN PROGRAM (FAKIR)',
    entitlementProduct: 'ELAUN KEHADIRAN PROGRAM',
    tarikhSemakanTerakhir: '2025-03-30',
    statusReview: 'Perlu Disemak',
    catatan: ''
  },
  {
    idAsnaf: 'A503',
    nama: 'Nor Aisyah',
    jantina: 'Perempuan',
    umur: 55,
    daerah: 'Petaling',
    kariah: 'Masjid An-Nur',
    bantuanUtama: 'BANTUAN KEPERLUAN PENDIDIKAN SEKOLAH (FAKIR)',
    aidProduct: 'ELAUN KEHADIRAN PROGRAM (BANTUAN KEPERLUAN PENDIDIKAN SEKOLAH - FAKIR)',
    productPackage: 'ELAUN KEHADIRAN PROGRAM (FAKIR)',
    entitlementProduct: 'ELAUN KEHADIRAN PROGRAM (FAKIR)',
    tarikhSemakanTerakhir: '2025-07-01',
    statusReview: 'Aktif',
    catatan: 'Dalam pemantauan'
  },
  {
    idAsnaf: 'A504',
    nama: 'Hafiz Rahman',
    jantina: 'Lelaki',
    umur: 47,
    daerah: 'Hulu Langat',
    kariah: 'Surau Ar-Rahman',
    bantuanUtama: 'BANTUAN KEPERLUAN PENDIDIKAN SEKOLAH (FAKIR)',
    aidProduct: 'BANTUAN KEPERLUAN PENDIDIKAN SEKOLAH (FAKIR)',
    productPackage: 'KPS - BUKAN ASASI (FAKIR)',
    entitlementProduct: 'MENENGAH KEBANGSAAN PEREMPUAN - KEPERLUAN SEKOLAH (FAKIR)',
    tarikhSemakanTerakhir: '2025-01-18',
    statusReview: 'Perlu Disemak',
    catatan: 'Lambat kemaskini'
  }
]

/* === Options (Daerah, Kariah) === */
const daerahOptions = computed(() => {
  const set = new Set(DATA_KECICIRAN.map(d => d.daerah))
  return Array.from(set).map(v => ({ label: v, value: v }))
})

const daerahOptionsWithAll = computed(() => [
  { label: 'Semua Daerah', value: '' },
  ...daerahOptions.value
])

const kariahByDaerah = computed(() => {
  const map = {}
  DATA_KECICIRAN.forEach(d => {
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
  const set = new Set(DATA_KECICIRAN.map(d => d.kariah))
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

  rows.value = DATA_KECICIRAN.filter(r => {
    const last = new Date(r.tarikhSemakanTerakhir)
    if (from && last < from) return false
    if (to && last > to) return false
    if (y && last.getFullYear() !== y) return false
    if (criteria.daerah && r.daerah !== criteria.daerah) return false
    if (criteria.kariah && r.kariah !== criteria.kariah) return false
    return true
  })
}

function onExport (type) {
  // Integrasi ke modul eksport sebenar bila sedia (XLSX/PDF)
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

function kiraAging (iso) {
  const d = new Date(iso)
  const today = new Date()
  const msPerDay = 24 * 60 * 60 * 1000
  const diff = Math.floor(
    (Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) -
     Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())) / msPerDay
  )
  return diff < 0 ? 0 : diff
}

function statusClass (s) {
  return {
    'bg-emerald-100 text-emerald-700': s === 'Aktif',
    'bg-amber-100 text-amber-700': s === 'Perlu Disemak',
    'bg-rose-100 text-rose-700': s === 'Tamat'
  }
}
</script>
