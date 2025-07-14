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
              <!-- Nama Ketua Keluarga (Autocomplete) -->
              <div>
                <label class="block font-medium mb-1">Nama Ketua Keluarga</label>
                <input
                  v-model="selectedKetuaKeluarga"
                  list="ketuaKeluargaList"
                  class="form-input w-full border rounded px-3 py-2"
                  placeholder="Cari nama..."
                />
                <datalist id="ketuaKeluargaList">
                  <option v-for="k in ketuaKeluargaOptions" :key="k.ic" :value="k.nama" />
                </datalist>
              </div>
              <!-- Kategori (Radio) -->
              <div>
                <label class="block font-medium mb-1">Kategori</label>
                <div class="flex gap-4">
                  <label v-for="k in kategoriOptions" :key="k" class="flex items-center gap-1">
                    <input type="radio" v-model="selectedKategori" :value="k" /> {{ k }}
                  </label>
                </div>
              </div>
              <!-- Tanggungan (Dropdown) -->
              <div>
                <label class="block font-medium mb-1">Tanggungan</label>
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
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="font-medium">Bil:</span>
                <span>{{ computedDependentsCount }}</span>
              </div>
              <div class="flex justify-between">
                <span class="font-medium">Kadar Bantuan (RM):</span>
                <span>{{ computedKadarBantuan }}</span>
              </div>
            </div>
            <!-- Debug output for troubleshooting -->
            <div v-if="false" class="mt-2 text-xs text-gray-400">
              <div>selectedKategori: {{ selectedKategori }}</div>
              <div>selectedTanggungan: {{ selectedTanggungan }}</div>
              <div>computedKadarBantuan: {{ computedKadarBantuan }}</div>
            </div>
          </template>
        </rs-card>
      </div>
    </div>

    <!-- Section B: Table of Dependents -->
    <div v-if="showResults" class="mt-8">
      <rs-card>
        <template #header>
          <h2 class="text-lg font-semibold">
            Senarai Tanggungan {{ selectedKategori }} dibawah {{ selectedKetuaKeluarga }}
          </h2>
        </template>
        <template #body>
          <div class="overflow-x-auto">
            <table class="min-w-full border">
              <thead>
                <tr class="bg-gray-100">
                  <th class="px-4 py-2 border">No.</th>
                  <th class="px-4 py-2 border">Nama</th>
                  <th class="px-4 py-2 border">IC</th>
                  <th class="px-4 py-2 border">Tindakan</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(d, idx) in filteredDependents" :key="d.ic">
                  <td class="px-4 py-2 border">{{ idx + 1 }}</td>
                  <td class="px-4 py-2 border">{{ d.nama }}</td>
                  <td class="px-4 py-2 border">{{ d.ic }}</td>
                  <td class="px-4 py-2 border text-center">
                    <input type="checkbox" v-model="d.selected" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="mt-4 flex justify-end">
            <rs-button variant="success" @click="handleConfirm">Sahkan</rs-button>
          </div>
        </template>
      </rs-card>
    </div>
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
    // Reset if not found
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

function handleSearch() {
  // Find selected family head
  const ketua = ketuaKeluargaOptions.find(k => k.nama === selectedKetuaKeluarga.value)
  // Prepare dependents list
  filteredDependents.value = (ketua ? ketua.dependents : []).map(d => ({ ...d, selected: true }))
  showResults.value = true
}

function handleConfirm() {
  // Store selection in localStorage for demo
  localStorage.setItem('bantuanConfirm', JSON.stringify({
    ketua: selectedKetuaKeluarga.value,
    kategori: selectedKategori.value,
    tanggungan: selectedTanggungan.value,
    lastDateReview: lastDateReview.value,
    dependents: filteredDependents.value.filter(d => d.selected),
    kadar: computedKadarBantuan.value,
  }))
  navigateTo('/BF-BTN/BU/bantuan-ramadhan-dan-hari-raya/02')
}
</script>