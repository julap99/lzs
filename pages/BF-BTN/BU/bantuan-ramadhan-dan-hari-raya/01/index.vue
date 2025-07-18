<template>
  <div class="py-6 px-4">
    <h1 class="text-2xl font-bold mb-6">Bantuan Ramadhan & Hari Raya</h1>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Section A: Filtering Form -->
      <div class="md:col-span-2">
        <rs-card>
          <template #header>
            <h2 class="text-lg font-semibold">Carian & Penapisan</h2>
          </template>
          <template #body>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Nama Ketua Keluarga (Autocomplete Dropdown) -->
              <div class="relative">
                <label class="block font-medium mb-1">Nama Ketua Keluarga</label>
                <input
                  v-model="selectedKetuaKeluarga"
                  @input="showDropdown = true"
                  @focus="showDropdown = true"
                  @blur="() => setTimeout(() => showDropdown = false, 150)"
                  :class="['form-input w-full border rounded px-3 py-2', errorNama ? 'border-red-500' : '']"
                  placeholder="Cari nama..."
                  autocomplete="off"
                />
                <ul v-if="showDropdown && selectedKetuaKeluarga && filteredKeluargaList.length > 0" class="absolute z-10 bg-white border w-full mt-1 rounded shadow max-h-40 overflow-y-auto">
                  <li v-for="k in filteredKeluargaList" :key="k.ic" @mousedown.prevent="selectKeluarga(k.nama)" class="px-3 py-2 hover:bg-blue-100 cursor-pointer">
                    {{ k.nama }} <span class="text-xs text-gray-400">({{ k.ic }})</span>
                  </li>
                </ul>
                <div v-if="selectedKetuaKeluarga && !isValidKeluarga" class="text-xs text-red-600 mt-1">Nama tidak dijumpai dalam senarai.</div>
                <div v-if="!selectedKetuaKeluarga" class="text-xs text-gray-400 mt-1">Sila pilih nama Ketua Keluarga.</div>
              </div>
              <!-- Kategori (Radio) -->
              <div>
                <label class="block font-medium mb-1">
                  Kategori
                  <span class="text-xs text-gray-500 ml-1" title="Pilih kategori asnaf untuk menentukan kadar bantuan">ⓘ</span>
                </label>
                <div class="flex gap-4">
                  <label v-for="k in kategoriOptions" :key="k" class="flex items-center gap-1">
                    <input type="radio" v-model="selectedKategori" :value="k" /> 
                    <span :class="getKategoriBadgeClass(k)">{{ k }}</span>
                  </label>
                </div>
              </div>
              <!-- Tanggungan (Dropdown) -->
              <div>
                <label class="block font-medium mb-1">
                  Tanggungan
                  <span class="text-xs text-gray-500 ml-1" title="Bilangan tanggungan keluarga - mempengaruhi kadar bantuan">ⓘ</span>
                </label>
                <select v-model="selectedTanggungan" class="form-select w-full border rounded px-3 py-2">
                  <option v-for="t in tanggunganOptions" :key="t" :value="t">{{ t }}</option>
                </select>
              </div>
              <!-- Last Date Review (Date Picker) -->
              <div>
                <label class="block font-medium mb-1">Last Date Review</label>
                <input type="date" v-model="lastDateReview" class="form-input w-full border rounded px-3 py-2" disabled />
                <p class="text-xs text-gray-500 mt-1">Tarikh ini akan dikemaskini secara automatik selepas carian.</p>
              </div>
            </div>
            <div class="mt-4 flex justify-end">
              <rs-button variant="primary" @click="handleSearch">Search</rs-button>
            </div>
            <div v-if="errorNama" class="text-red-600 text-sm mt-2">Sila pilih nama Ketua Keluarga yang sah sebelum membuat carian.</div>
          </template>
        </rs-card>
      </div>
      <!-- Info Bantuan Widget -->
      <div>
        <rs-card>
          <template #header>
            <h2 class="text-lg font-semibold">Info Bantuan</h2>
          </template>
          <template #body>
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="font-medium">Bil:</span>
                <span class="text-lg font-semibold">{{ computedAggregateCount }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="font-medium">Kategori:</span>
                <span :class="getKategoriBadgeClass(selectedKategori)">{{ selectedKategori }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="font-medium">Tanggungan:</span>
                <span class="text-sm">{{ selectedTanggungan }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="font-medium">
                  Kadar (RM):
                  <span class="text-xs text-gray-500 ml-1" title="Kadar bantuan berdasarkan kategori dan tanggungan">ⓘ</span>
                </span>
                <span class="text-lg font-bold text-green-600">{{ computedAggregateKadar }}</span>
              </div>
            </div>
            <!-- Debug output for troubleshooting -->
            <div v-if="false" class="mt-2 text-xs text-gray-400">
              <div>selectedKategori: {{ selectedKategori }}</div>
              <div>selectedTanggungan: {{ selectedTanggungan }}</div>
              <div>computedKadarBantuan: {{ computedAggregateKadar }}</div>
            </div>
          </template>
        </rs-card>
      </div>
    </div>

    <!-- Section B: Table of Dependents -->
    <transition name="fade">
      <div v-if="showResults" class="mt-8">
        <rs-card>
          <template #header>
            <h2 class="text-lg font-semibold">
              Senarai Tanggungan {{ selectedKategori }} dibawah {{ selectedKetuaKeluarga }}
            </h2>
          </template>
          <template #body>
            <div v-if="filteredDependents.length > 0" class="overflow-x-auto">
              <table class="min-w-full border">
                <thead class="bg-gray-100 sticky top-0">
                  <tr>
                    <th class="px-3 py-2 border text-left text-sm font-medium">No.</th>
                    <th class="px-3 py-2 border text-left text-sm font-medium">Nama</th>
                    <th class="px-3 py-2 border text-left text-sm font-medium">IC</th>
                    <th class="px-3 py-2 border text-center text-sm font-medium">Tindakan</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(kk, idx) in filteredDependents" :key="kk.ic" class="hover:bg-gray-50">
                    <td class="px-3 py-2 border text-sm">{{ idx + 1 }}</td>
                    <td class="px-3 py-2 border text-sm">{{ kk.nama }}</td>
                    <td class="px-3 py-2 border text-sm">{{ kk.ic }}</td>
                    <td class="px-3 py-2 border text-center">
                      <input type="checkbox" v-model="kk.selected" class="w-4 h-4" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else class="text-center py-8">
              <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p class="text-gray-500">Tiada keluarga dijumpai untuk kriteria ini.</p>
            </div>
            <div class="mt-4 flex justify-end">
              <rs-button variant="success" @click="goToSummary" :disabled="!hasSelectedDependents">
                Sahkan ({{ selectedDependentsCount }} dipilih)
              </rs-button>
            </div>
          </template>
        </rs-card>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { navigateTo } from '#imports'

// Mock data
const ketuaKeluargaOptions = [
  { nama: 'Ahmad bin Ali', ic: '800101-14-1234', lastDateReview: '2024-05-01', kategori: 'Fakir', tanggungan: 'T2', dependents: [
    { nama: 'Siti binti Ahmad', ic: '010101-14-5678' },
    { nama: 'Ali bin Ahmad', ic: '030303-14-9999' },
  ] },
  { nama: 'Fatimah binti Osman', ic: '750202-10-4321', lastDateReview: '2024-04-15', kategori: 'Mualaf', tanggungan: 'Tiada', dependents: [
    { nama: 'Osman bin Ali', ic: '990909-10-8888' },
  ] },
  { nama: 'Zainal Abidin', ic: '690303-08-2222', lastDateReview: '2024-03-20', kategori: 'Miskin', tanggungan: 'T5', dependents: [
    { nama: 'Aminah binti Zainal', ic: '120202-08-3333' },
    { nama: 'Rahim bin Zainal', ic: '150505-08-4444' },
    { nama: 'Siti binti Zainal', ic: '180808-08-5555' },
    { nama: 'Rosli bin Zainal', ic: '200101-08-6666' },
    { nama: 'Noraini binti Zainal', ic: '220202-08-7777' },
  ] },
  { nama: 'Noraini binti Hassan', ic: '820404-10-1111', lastDateReview: '2024-02-10', kategori: 'Fakir', tanggungan: 'T13', dependents: [
    { nama: 'Hassan bin Ahmad', ic: '500101-10-8888' },
    { nama: 'Siti binti Hassan', ic: '040404-10-9999' },
    { nama: 'Ali bin Hassan', ic: '060606-10-0000' },
    { nama: 'Fatimah binti Hassan', ic: '080808-10-1112' },
    { nama: 'Rahman bin Hassan', ic: '100101-10-2222' },
    { nama: 'Aisyah binti Hassan', ic: '120202-10-3333' },
    { nama: 'Zainab binti Hassan', ic: '140404-10-4444' },
    { nama: 'Yusof bin Hassan', ic: '160606-10-5555' },
    { nama: 'Salmah binti Hassan', ic: '180808-10-6666' },
    { nama: 'Khalid bin Hassan', ic: '200101-10-7777' },
    { nama: 'Rashid bin Hassan', ic: '220202-10-8888' },
    { nama: 'Sulaiman bin Hassan', ic: '240404-10-9999' },
    { nama: 'Latifah binti Hassan', ic: '260606-10-0001' },
  ] },
  { nama: 'Musa bin Salleh', ic: '600505-12-3333', lastDateReview: '2024-01-05', kategori: 'Miskin', tanggungan: 'T14', dependents: [
    { nama: 'Salleh bin Musa', ic: '630303-12-4444' },
    { nama: 'Aminah binti Musa', ic: '660606-12-5555' },
    { nama: 'Rahmah binti Musa', ic: '690909-12-6666' },
    { nama: 'Yahya bin Musa', ic: '720202-12-7777' },
    { nama: 'Fatimah binti Musa', ic: '750505-12-8888' },
    { nama: 'Siti binti Musa', ic: '780808-12-9999' },
    { nama: 'Ali bin Musa', ic: '810101-12-0000' },
    { nama: 'Zainab binti Musa', ic: '840404-12-1111' },
    { nama: 'Rahim bin Musa', ic: '870707-12-2222' },
    { nama: 'Noraini binti Musa', ic: '900101-12-3333' },
    { nama: 'Rosli bin Musa', ic: '930303-12-4444' },
    { nama: 'Aisyah binti Musa', ic: '960606-12-5555' },
    { nama: 'Khalid bin Musa', ic: '990909-12-6666' },
    { nama: 'Rashid bin Musa', ic: '020202-12-7777' },
  ] },
]
const kategoriOptions = ['Fakir', 'Miskin', 'Mualaf']
const tanggunganOptions = ['Tiada', 'T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12', 'T13', 'T14', 'T15']
const kadarTable = {
  Tiada: { Fakir: 350, Miskin: 300, Mualaf: 300 },
  T1: { Fakir: 400, Miskin: 350, Mualaf: 350 },
  T2: { Fakir: 450, Miskin: 400, Mualaf: 400 },
  T3: { Fakir: 500, Miskin: 450, Mualaf: 450 },
  T4: { Fakir: 550, Miskin: 500, Mualaf: 500 },
  T5: { Fakir: 600, Miskin: 550, Mualaf: 550 },
  T6: { Fakir: 650, Miskin: 600, Mualaf: 600 },
  T7: { Fakir: 700, Miskin: 650, Mualaf: 650 },
  T8: { Fakir: 750, Miskin: 700, Mualaf: 700 },
  T9: { Fakir: 800, Miskin: 750, Mualaf: 750 },
  T10: { Fakir: 850, Miskin: 800, Mualaf: 800 },
  T11: { Fakir: 900, Miskin: 850 },
  T12: { Fakir: 950, Miskin: 900 },
  T13: { Fakir: 1000, Miskin: 950 },
  T14: { Miskin: 1000 },
  T15: {},
}

const selectedKetuaKeluarga = ref('')
const selectedKategori = ref('Fakir')
const selectedTanggungan = ref('Tiada')
const lastDateReview = ref('')
const showResults = ref(false)
const filteredDependents = ref([])

// Auto-populate Section A when family head is selected
watch(selectedKetuaKeluarga, (newVal) => {
  const ketua = ketuaKeluargaOptions.find(k => k.nama === newVal)
  if (ketua) {
    selectedKategori.value = ketua.kategori
    selectedTanggungan.value = ketua.tanggungan
    lastDateReview.value = ketua.lastDateReview
  } else {
    selectedKategori.value = 'Fakir'
    selectedTanggungan.value = 'Tiada'
    lastDateReview.value = ''
    showResults.value = false
    filteredDependents.value = []
  }
})

const computedDependentsCount = computed(() => {
  const ketua = ketuaKeluargaOptions.find(k => k.nama === selectedKetuaKeluarga.value)
  return ketua ? ketua.dependents.length : 0
})

const computedKadarBantuan = computed(() => {
  // Capping logic for each kategori
  const t = selectedTanggungan.value
  const k = selectedKategori.value
  // Mualaf: max T10, Fakir: max T13, Miskin: max T14
  let cappedT = t
  if (k === 'Mualaf') {
    const allowed = tanggunganOptions.slice(0, 11) // Tiada to T10
    cappedT = allowed.includes(t) ? t : 'T10'
  } else if (k === 'Fakir') {
    const allowed = tanggunganOptions.slice(0, 14) // Tiada to T13
    cappedT = allowed.includes(t) ? t : 'T13'
  } else if (k === 'Miskin') {
    const allowed = tanggunganOptions.slice(0, 15) // Tiada to T14
    cappedT = allowed.includes(t) ? t : 'T14'
  }
  return kadarTable[cappedT]?.[k] || 0
})

const showDropdown = ref(false)
const errorNama = ref(false)

const filteredKeluargaList = computed(() => {
  // Only show dropdown if input is not empty
  if (!selectedKetuaKeluarga.value) return []
  return ketuaKeluargaOptions.filter(k =>
    k.nama.toLowerCase().includes(selectedKetuaKeluarga.value.toLowerCase())
  )
})

const isValidKeluarga = computed(() => {
  return !!ketuaKeluargaOptions.find(k => k.nama === selectedKetuaKeluarga.value)
})

const selectedDependentsCount = computed(() => filteredDependents.value.filter(d => d.selected).length)
const hasSelectedDependents = computed(() => selectedDependentsCount.value > 0)

function getKategoriBadgeClass(kategori) {
  const classes = {
    'Fakir': 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800',
    'Miskin': 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800',
    'Mualaf': 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'
  }
  return classes[kategori] || 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800'
}

function selectKeluarga(nama) {
  selectedKetuaKeluarga.value = nama
  showDropdown.value = false
}

function handleSearch() {
  errorNama.value = false
  if (!isValidKeluarga.value) {
    errorNama.value = true
    showResults.value = false
    filteredDependents.value = []
    return
  }
  const ketua = ketuaKeluargaOptions.find(k => k.nama === selectedKetuaKeluarga.value)
  if (ketua) {
    filteredDependents.value = ketua.dependents.map(d => ({ ...d, selected: true }))
    showResults.value = true
  } else {
    showResults.value = false
    filteredDependents.value = []
  }
}

function selectKK(kk) {
  // This function is no longer needed as dependents are checked by default
  // Keeping it for now, but it will not be called from the template
}

const computedAggregateCount = computed(() => filteredDependents.value.length)
const computedAggregateKadar = computed(() => {
  // Capping logic for each kategori
  const t = selectedTanggungan.value
  const k = selectedKategori.value
  let cappedT = t
  if (k === 'Mualaf') {
    const allowed = tanggunganOptions.slice(0, 11)
    cappedT = allowed.includes(t) ? t : 'T10'
  } else if (k === 'Fakir') {
    const allowed = tanggunganOptions.slice(0, 14)
    cappedT = allowed.includes(t) ? t : 'T13'
  } else if (k === 'Miskin') {
    const allowed = tanggunganOptions.slice(0, 15)
    cappedT = allowed.includes(t) ? t : 'T14'
  }
  return kadarTable[cappedT]?.[k] || 0
})

function goToSummary() {
  // Only pass selected dependents
  const ketua = ketuaKeluargaOptions.find(k => k.nama === selectedKetuaKeluarga.value)
  localStorage.setItem('bantuanSummary', JSON.stringify({
    ketua: ketua ? ketua.nama : '',
    kategori: selectedKategori.value,
    tanggungan: selectedTanggungan.value,
    lastDateReview: lastDateReview.value,
    dependents: filteredDependents.value.filter(d => d.selected),
  }))
  navigateTo('/BF-BTN/BU/bantuan-ramadhan-dan-hari-raya/02')
}
</script>

<style>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>