<script setup>
import { ref, onMounted, computed } from 'vue'
import { navigateTo } from '#imports'

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

const bantuanData = ref(null)
const showModal = ref(false)
const isProcessing = ref(false)
const isSuccess = ref(false)

onMounted(() => {
  const data = localStorage.getItem('bantuanConfirm')
  if (data) {
    bantuanData.value = JSON.parse(data)
  }
})

const computedKadarBantuan = computed(() => {
  if (!bantuanData.value) return 0
  const t = bantuanData.value.tanggungan
  const k = bantuanData.value.kategori
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

const totalBantuan = computed(() => {
  if (!bantuanData.value || !Array.isArray(bantuanData.value.dependents)) return 0
  return bantuanData.value.dependents.length * computedKadarBantuan.value
})

function getKategoriBadgeClass(kategori) {
  const classes = {
    'Fakir': 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800',
    'Miskin': 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800',
    'Mualaf': 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'
  }
  return classes[kategori] || 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800'
}

function handleSend() {
  showModal.value = true
}
function handleConfirmSend() {
  isProcessing.value = true
  setTimeout(() => {
    isProcessing.value = false
    isSuccess.value = true
    localStorage.removeItem('bantuanConfirm')
    setTimeout(() => {
      showModal.value = false
      isSuccess.value = false
      navigateTo('/BF-BTN/BU/bantuan-ramadhan-dan-hari-raya/01')
    }, 1500)
  }, 1500)
}
function handleCancel() {
  showModal.value = false
}
</script>

<template>
  <div class="py-6 px-4">
    <h1 class="text-2xl font-bold mb-6">Pengesahan Jumlah Bantuan</h1>
    <div v-if="bantuanData && Array.isArray(bantuanData.dependents)">
      <!-- Summary Card -->
      <div class="mb-6">
        <rs-card>
          <template #header>
            <h2 class="text-lg font-semibold">Ringkasan Bantuan</h2>
          </template>
          <template #body>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div class="text-center p-4 bg-blue-50 rounded-lg">
                <div class="text-2xl font-bold text-blue-600">{{ bantuanData.ketua }}</div>
                <div class="text-sm text-gray-600 mt-1">Ketua Keluarga</div>
              </div>
              <div class="text-center p-4 bg-green-50 rounded-lg">
                <div class="text-2xl font-bold text-green-600">{{ bantuanData.dependents.length }}</div>
                <div class="text-sm text-gray-600 mt-1">Bilangan Tanggungan</div>
              </div>
              <div class="text-center p-4 bg-yellow-50 rounded-lg">
                <div class="text-2xl font-bold text-yellow-600">
                  <span :class="getKategoriBadgeClass(bantuanData.kategori)">{{ bantuanData.kategori }}</span>
                </div>
                <div class="text-sm text-gray-600 mt-1">Kategori</div>
              </div>
              <div class="text-center p-4 bg-purple-50 rounded-lg">
                <div class="text-2xl font-bold text-purple-600">RM {{ totalBantuan }}</div>
                <div class="text-sm text-gray-600 mt-1">Jumlah Bantuan</div>
              </div>
            </div>
            <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span class="font-medium">Tanggungan:</span>
                <span class="text-sm">{{ bantuanData.tanggungan }}</span>
              </div>
              <div class="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span class="font-medium">
                  Kadar per Tanggungan:
                  <span class="text-xs text-gray-500 ml-1" title="Kadar bantuan untuk setiap tanggungan">ⓘ</span>
                </span>
                <span class="text-sm font-semibold text-green-600">RM {{ computedKadarBantuan }}</span>
              </div>
            </div>
            <div v-if="bantuanData.lastDateReview" class="mt-3 text-xs text-gray-500">
              Last Date Review: {{ bantuanData.lastDateReview }}
            </div>
          </template>
        </rs-card>
      </div>

      <!-- Confirmation Table -->
      <rs-card>
        <template #header>
          <h2 class="text-lg font-semibold">Senarai Tanggungan yang Dipilih</h2>
        </template>
        <template #body>
          <div class="overflow-x-auto">
            <table class="min-w-full border">
              <thead class="bg-gray-100 sticky top-0">
                <tr>
                  <th class="px-3 py-2 border text-left text-sm font-medium">No.</th>
                  <th class="px-3 py-2 border text-left text-sm font-medium">Nama</th>
                  <th class="px-3 py-2 border text-left text-sm font-medium">IC</th>
                  <th class="px-3 py-2 border text-center text-sm font-medium">Kategori</th>
                  <th class="px-3 py-2 border text-center text-sm font-medium">Tanggungan</th>
                  <th class="px-3 py-2 border text-center text-sm font-medium">Kadar Bantuan (RM)</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(d, idx) in bantuanData.dependents" :key="d.ic" class="hover:bg-gray-50">
                  <td class="px-3 py-2 border text-sm">{{ idx + 1 }}</td>
                  <td class="px-3 py-2 border text-sm">{{ d.nama }}</td>
                  <td class="px-3 py-2 border text-sm">{{ d.ic }}</td>
                  <td class="px-3 py-2 border text-center">
                    <span :class="getKategoriBadgeClass(bantuanData.kategori)">{{ bantuanData.kategori }}</span>
                  </td>
                  <td class="px-3 py-2 border text-center text-sm">{{ bantuanData.tanggungan }}</td>
                  <td class="px-3 py-2 border text-center text-sm font-semibold text-green-600">{{ computedKadarBantuan }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="mt-4 flex justify-between items-center">
            <rs-button variant="secondary" @click="() => navigateTo('/BF-BTN/BU/bantuan-ramadhan-dan-hari-raya/01')">Kembali</rs-button>
            <div class="flex items-center gap-4">
              <div class="text-right">
                <div class="text-sm text-gray-600">Jumlah Bantuan:</div>
                <div class="text-xl font-bold text-green-600">RM {{ totalBantuan }}</div>
              </div>
              <rs-button variant="primary" @click="handleSend">Hantar Bantuan</rs-button>
            </div>
          </div>
        </template>
      </rs-card>

      <!-- Confirmation Modal -->
      <rs-modal v-model="showModal" title="Pengesahan" size="md">
        <template #body>
          <div v-if="isProcessing" class="flex flex-col items-center justify-center py-6">
            <svg class="animate-spin h-8 w-8 text-blue-600 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
            <span>Memproses bantuan...</span>
          </div>
          <div v-else-if="isSuccess" class="flex flex-col items-center justify-center py-6">
            <svg class="h-8 w-8 text-green-600 mb-2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span class="text-green-700 font-semibold">Bantuan telah berjaya dihantar</span>
          </div>
          <div v-else>
            <div class="text-center mb-4">
              <svg class="mx-auto h-12 w-12 text-blue-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p class="text-lg font-medium">Adakah anda pasti ingin menghantar bantuan ini?</p>
            </div>
            <div class="bg-gray-50 p-4 rounded-lg">
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span class="font-medium">Ketua Keluarga:</span>
                  <div>{{ bantuanData.ketua }}</div>
                </div>
                <div>
                  <span class="font-medium">Jumlah Bantuan:</span>
                  <div class="text-green-600 font-semibold">RM {{ totalBantuan }}</div>
                </div>
                <div>
                  <span class="font-medium">Bilangan Tanggungan:</span>
                  <div>{{ bantuanData.dependents.length }} orang</div>
                </div>
                <div>
                  <span class="font-medium">Kategori:</span>
                  <div><span :class="getKategoriBadgeClass(bantuanData.kategori)">{{ bantuanData.kategori }}</span></div>
                </div>
              </div>
            </div>
          </div>
        </template>
        <template #footer>
          <div v-if="!isProcessing && !isSuccess" class="flex justify-end gap-2">
            <rs-button variant="secondary" @click="handleCancel">Batal</rs-button>
            <rs-button variant="success" @click="handleConfirmSend">Ya, Hantar</rs-button>
          </div>
        </template>
      </rs-modal>

      <!-- Debug output for troubleshooting -->
      <div v-if="false" class="mt-4 text-xs text-gray-400">
        <pre>{{ bantuanData }}</pre>
      </div>
    </div>
    <div v-else class="text-center mt-12">
      <svg class="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <h3 class="text-lg font-medium text-gray-900 mb-2">Tiada Data Bantuan</h3>
      <p class="text-gray-500 mb-6">Tiada data bantuan untuk disahkan atau data tidak lengkap.</p>
      <rs-button variant="primary" @click="() => navigateTo('/BF-BTN/BU/bantuan-ramadhan-dan-hari-raya/01')">
        Kembali ke Carian
      </rs-button>
    </div>
  </div>
</template>