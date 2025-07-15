<script setup>
import { ref, onMounted } from 'vue'
import { navigateTo } from '#imports'

const bantuanData = ref(null)
const showModal = ref(false)
const isProcessing = ref(false)
const isSuccess = ref(false)

onMounted(() => {
  const data = localStorage.getItem('bantuanSummary')
  if (data) {
    bantuanData.value = JSON.parse(data)
  }
})

function handleSend() {
  showModal.value = true
}
function handleConfirmSend() {
  isProcessing.value = true
  setTimeout(() => {
    isProcessing.value = false
    isSuccess.value = true
    localStorage.removeItem('bantuanSummary')
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
    <h1 class="text-2xl font-bold mb-6">Pengesahan Bantuan Ramadhan & Hari Raya</h1>
    <div v-if="bantuanData && bantuanData.dependents && bantuanData.dependents.length">
      <rs-card>
        <template #header>
          <h2 class="text-lg font-semibold">Bantuan kepada {{ bantuanData.ketua }}</h2>
          <div v-if="bantuanData.lastDateReview" class="text-xs text-gray-500 mt-1">Last Date Review: {{ bantuanData.lastDateReview }}</div>
        </template>
        <template #body>
          <div class="overflow-x-auto">
            <table class="min-w-full border">
              <thead class="bg-gray-100 sticky top-0">
                <tr>
                  <th class="px-3 py-2 border text-left text-sm font-medium">No.</th>
                  <th class="px-3 py-2 border text-left text-sm font-medium">Nama</th>
                  <th class="px-3 py-2 border text-left text-sm font-medium">IC</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(d, idx) in bantuanData.dependents" :key="d.ic" class="hover:bg-gray-50">
                  <td class="px-3 py-2 border text-sm">{{ idx + 1 }}</td>
                  <td class="px-3 py-2 border text-sm">{{ d.nama }}</td>
                  <td class="px-3 py-2 border text-sm">{{ d.ic }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="mt-4 flex justify-between">
            <rs-button variant="secondary" @click="() => navigateTo('/BF-BTN/BU/bantuan-ramadhan-dan-hari-raya/01')">Kembali</rs-button>
            <rs-button variant="primary" @click="handleSend">Hantar</rs-button>
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