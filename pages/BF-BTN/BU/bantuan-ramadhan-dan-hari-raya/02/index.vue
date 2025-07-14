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
      <rs-card>
        <template #header>
          <h2 class="text-lg font-semibold">Bantuan kepada {{ bantuanData.ketua }}</h2>
          <div v-if="bantuanData.lastDateReview" class="text-xs text-gray-500 mt-1">Last Date Review: {{ bantuanData.lastDateReview }}</div>
        </template>
        <template #body>
          <div class="overflow-x-auto">
            <table class="min-w-full border">
              <thead>
                <tr class="bg-gray-100">
                  <th class="px-4 py-2 border">No.</th>
                  <th class="px-4 py-2 border">Nama</th>
                  <th class="px-4 py-2 border">Kategori</th>
                  <th class="px-4 py-2 border">Tanggungan</th>
                  <th class="px-4 py-2 border">Kadar Bantuan (RM)</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(d, idx) in bantuanData.dependents" :key="d.ic">
                  <td class="px-4 py-2 border">{{ idx + 1 }}</td>
                  <td class="px-4 py-2 border">{{ d.nama }}</td>
                  <td class="px-4 py-2 border">{{ bantuanData.kategori }}</td>
                  <td class="px-4 py-2 border">{{ bantuanData.tanggungan }}</td>
                  <td class="px-4 py-2 border">{{ computedKadarBantuan }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="mt-4 flex justify-between">
            <rs-button variant="secondary" @click="() => navigateTo('/BF-BTN/BU/bantuan-ramadhan-dan-hari-raya/01')">Kembali</rs-button>
            <rs-button variant="primary" @click="handleSend">Hantar Bantuan</rs-button>
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
            <p>Adakah anda pasti ingin menghantar bantuan ini?</p>
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
      <p class="mb-4">Tiada data bantuan untuk disahkan atau data tidak lengkap.</p>
      <rs-button variant="primary" @click="() => navigateTo('/BF-BTN/BU/bantuan-ramadhan-dan-hari-raya/01')">
        Kembali ke Carian
      </rs-button>
    </div>
  </div>
</template>