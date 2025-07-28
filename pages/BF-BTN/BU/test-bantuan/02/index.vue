<template>
  <div class="py-6 px-4">
    <h1 class="text-2xl font-bold mb-6">Semakan & Pengesahan Bantuan</h1>
    
    <!-- Selected Recipients Summary -->
    <rs-card class="mb-6">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-lg font-semibold">Senarai Penerima Dipilih</h2>
          <div class="text-sm text-gray-600">
            {{ selectedRecipients.length }} penerima dipilih
          </div>
        </div>
      </template>
      <template #body>
        <div v-if="selectedRecipients.length > 0" class="overflow-x-auto">
          <table class="min-w-full border">
            <thead class="bg-gray-100 sticky top-0">
              <tr>
                <th class="px-3 py-2 border text-left text-sm font-medium">No.</th>
                <th class="px-3 py-2 border text-left text-sm font-medium">Nama</th>
                <th class="px-3 py-2 border text-left text-sm font-medium">IC</th>
                <th class="px-3 py-2 border text-left text-sm font-medium">Tanggungan</th>
                <th class="px-3 py-2 border text-left text-sm font-medium">Kategori Asnaf</th>
                <th class="px-3 py-2 border text-left text-sm font-medium">Umur</th>
                <th class="px-3 py-2 border text-left text-sm font-medium">Status Kesihatan</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(recipient, idx) in selectedRecipients" :key="recipient.ic" class="hover:bg-gray-50">
                <td class="px-3 py-2 border text-sm">{{ idx + 1 }}</td>
                <td class="px-3 py-2 border text-sm font-medium">{{ recipient.nama }}</td>
                <td class="px-3 py-2 border text-sm">{{ recipient.ic }}</td>
                <td class="px-3 py-2 border text-sm">
                  <span :class="getTanggunganBadgeClass(recipient.tanggungan)">{{ recipient.tanggungan }}</span>
                </td>
                <td class="px-3 py-2 border text-sm">
                  <span :class="getKategoriAsnafBadgeClass(recipient.kategoriAsnaf)">{{ recipient.kategoriAsnaf }}</span>
                </td>
                <td class="px-3 py-2 border text-sm">{{ recipient.umur }} tahun</td>
                <td class="px-3 py-2 border text-sm">
                  <span :class="getStatusKesihatanBadgeClass(recipient.statusKesihatan)">{{ recipient.statusKesihatan }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="text-center py-8">
          <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p class="text-gray-500">Tiada penerima dipilih. Sila kembali ke halaman sebelumnya.</p>
          <rs-button variant="outline" class="mt-4" @click="goBack">
            Kembali ke Penapis
          </rs-button>
        </div>
      </template>
    </rs-card>

    <!-- Invitation Form -->
    <div v-if="selectedRecipients.length > 0">
      <rs-card class="mb-6">
        <template #header>
          <h2 class="text-lg font-semibold">Maklumat Jemputan</h2>
        </template>
        <template #body>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Program Type -->
            <div>
              <label class="block font-medium mb-2">Jenis Program</label>
              <select v-model="invitationForm.programType" class="form-select w-full border rounded px-3 py-2">
                <option value="">Pilih Jenis Program</option>
                <option value="Bantuan Ramadhan">Bantuan Ramadhan</option>
                <option value="Bantuan Hari Raya">Bantuan Hari Raya</option>
                <option value="Bantuan Kecemasan">Bantuan Kecemasan</option>
                <option value="Bantuan Bulanan">Bantuan Bulanan</option>
                <option value="Bantuan Khas">Bantuan Khas</option>
              </select>
            </div>

            <!-- Event Date -->
            <div>
              <label class="block font-medium mb-2">Tarikh Program</label>
              <input type="date" v-model="invitationForm.eventDate" class="form-input w-full border rounded px-3 py-2" />
            </div>

            <!-- Event Time -->
            <div>
              <label class="block font-medium mb-2">Masa Program</label>
              <input type="time" v-model="invitationForm.eventTime" class="form-input w-full border rounded px-3 py-2" />
            </div>

            <!-- Venue -->
            <div>
              <label class="block font-medium mb-2">Tempat</label>
              <input type="text" v-model="invitationForm.venue" placeholder="Masjid Al-Hidayah" class="form-input w-full border rounded px-3 py-2" />
            </div>

            <!-- Contact Person -->
            <div>
              <label class="block font-medium mb-2">Orang Perhubungan</label>
              <input type="text" v-model="invitationForm.contactPerson" placeholder="Ustaz Ahmad" class="form-input w-full border rounded px-3 py-2" />
            </div>

            <!-- Contact Number -->
            <div>
              <label class="block font-medium mb-2">Nombor Telefon</label>
              <input type="tel" v-model="invitationForm.contactNumber" placeholder="012-3456789" class="form-input w-full border rounded px-3 py-2" />
            </div>

            <!-- Additional Notes -->
            <div class="md:col-span-2">
              <label class="block font-medium mb-2">Nota Tambahan</label>
              <textarea v-model="invitationForm.notes" rows="3" placeholder="Sila bawa dokumen yang diperlukan..." class="form-textarea w-full border rounded px-3 py-2"></textarea>
            </div>
          </div>
        </template>
      </rs-card>

      <!-- Action Buttons -->
      <div class="flex justify-between items-center">
        <rs-button variant="outline" @click="goBack">
          <template #prepend>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </template>
          Kembali
        </rs-button>

        <rs-button variant="success" @click="showConfirmationModal" :disabled="!isFormValid">
          <template #prepend>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </template>
          Hantar untuk Pengesahan
        </rs-button>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div class="flex items-center mb-4">
          <div class="flex-shrink-0">
            <svg class="h-8 w-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-lg font-medium text-gray-900">Sahkan Penghantaran</h3>
          </div>
        </div>
        <div class="mb-4">
          <p class="text-sm text-gray-600">
            Anda akan menghantar {{ selectedRecipients.length }} penerima untuk pengesahan oleh penyelia. 
            Adakah anda pasti mahu meneruskan?
          </p>
        </div>
        <div class="flex justify-end space-x-3">
          <rs-button variant="outline" @click="showModal = false">
            Batal
          </rs-button>
          <rs-button variant="success" @click="submitForApproval" :loading="isSubmitting">
            Ya, Hantar
          </rs-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { navigateTo } from '#imports'

// Data from page 01
const selectedRecipients = ref([])
const showModal = ref(false)
const isSubmitting = ref(false)

// Invitation form
const invitationForm = ref({
  programType: '',
  eventDate: '',
  eventTime: '',
  venue: '',
  contactPerson: '',
  contactNumber: '',
  notes: ''
})

// Computed properties
const isFormValid = computed(() => {
  return invitationForm.value.programType && 
         invitationForm.value.eventDate && 
         invitationForm.value.eventTime && 
         invitationForm.value.venue && 
         invitationForm.value.contactPerson && 
         invitationForm.value.contactNumber
})

// Helper functions for badge styling
function getTanggunganBadgeClass(tanggungan) {
  const baseClass = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium'
  if (tanggungan === 'Tiada') {
    return `${baseClass} bg-gray-100 text-gray-800`
  }
  return `${baseClass} bg-blue-100 text-blue-800`
}

function getKategoriAsnafBadgeClass(kategoriAsnaf) {
  const classes = {
    'Fakir': 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800',
    'Miskin': 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800',
    'Mualaf': 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'
  }
  return classes[kategoriAsnaf] || 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800'
}

function getStatusKesihatanBadgeClass(status) {
  const classes = {
    'Sihat': 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800',
    'Kurang Sihat': 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800',
    'Sakit Kronik': 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800',
    'OKU': 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800'
  }
  return classes[status] || 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800'
}

// Load data from localStorage
onMounted(() => {
  const storedData = localStorage.getItem('selectedBantuanRecipients')
  if (storedData) {
    selectedRecipients.value = JSON.parse(storedData)
  }
})

// Navigation functions
function goBack() {
  navigateTo('/BF-BTN/BU/test-bantuan/01')
}

function showConfirmationModal() {
  showModal.value = true
}

async function submitForApproval() {
  isSubmitting.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Show success toast
    showToast('Berjaya! Permohonan telah dihantar untuk pengesahan.', 'success')
    
    // Clear stored data
    localStorage.removeItem('selectedBantuanRecipients')
    
    // Navigate back to filter page
    setTimeout(() => {
      navigateTo('/BF-BTN/BU/test-bantuan/01')
    }, 1500)
    
  } catch (error) {
    showToast('Ralat! Gagal menghantar permohonan. Sila cuba lagi.', 'error')
  } finally {
    isSubmitting.value = false
    showModal.value = false
  }
}

// Toast notification function
function showToast(message, type = 'info') {
  // Create toast element
  const toast = document.createElement('div')
  toast.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${
    type === 'success' ? 'bg-green-500 text-white' : 
    type === 'error' ? 'bg-red-500 text-white' : 
    'bg-blue-500 text-white'
  }`
  toast.innerHTML = `
    <div class="flex items-center">
      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        ${type === 'success' ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />' :
          type === 'error' ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />' :
          '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />'}
      </svg>
      <span>${message}</span>
    </div>
  `
  
  document.body.appendChild(toast)
  
  // Remove toast after 3 seconds
  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast)
    }
  }, 3000)
}
</script>

<style scoped>
.form-input, .form-select, .form-textarea {
  @apply border-gray-300 focus:border-blue-500 focus:ring-blue-500;
}
</style>