<template>
  <div class="py-6 px-4">
    <h1 class="text-2xl font-bold mb-6">Filter Bantuan</h1>
    
    <!-- Filter Section -->
    <rs-card class="mb-6">
      <template #header>
        <h2 class="text-lg font-semibold">Penapis Bantuan</h2>
      </template>
      <template #body>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Tanggungan Filter -->
          <div>
            <label class="block font-medium mb-2">Tanggungan</label>
            <select v-model="filters.tanggungan" class="form-select w-full border rounded px-3 py-2">
              <option value="">Semua Tanggungan</option>
              <option v-for="t in tanggunganOptions" :key="t" :value="t">{{ t }}</option>
            </select>
          </div>

          <!-- Kategori Asnaf Filter -->
          <div>
            <label class="block font-medium mb-2">Kategori Asnaf</label>
            <select v-model="filters.kategoriAsnaf" class="form-select w-full border rounded px-3 py-2">
              <option value="">Semua Kategori</option>
              <option value="Fakir">Fakir</option>
              <option value="Miskin">Miskin</option>
              <option value="Mualaf">Mualaf</option>
            </select>
          </div>

          <!-- Umur Filter -->
          <div>
            <label class="block font-medium mb-2">Umur</label>
            <select v-model="filters.umur" class="form-select w-full border rounded px-3 py-2">
              <option value="">Semua Umur</option>
              <option value="0-17">0-17 tahun</option>
              <option value="18-30">18-30 tahun</option>
              <option value="31-50">31-50 tahun</option>
              <option value="51-65">51-65 tahun</option>
              <option value="65+">65+ tahun</option>
            </select>
          </div>

          <!-- Status Kesihatan Filter -->
          <div>
            <label class="block font-medium mb-2">Status Kesihatan</label>
            <select v-model="filters.statusKesihatan" class="form-select w-full border rounded px-3 py-2">
              <option value="">Semua Status</option>
              <option value="Sihat">Sihat</option>
              <option value="Kurang Sihat">Kurang Sihat</option>
              <option value="Sakit Kronik">Sakit Kronik</option>
              <option value="OKU">OKU</option>
            </select>
          </div>
        </div>

        <!-- Search Button -->
        <div class="mt-6 flex justify-end">
          <rs-button variant="primary" @click="handleSearch" :loading="isLoading">
            <template #prepend>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </template>
            Cari
          </rs-button>
        </div>
      </template>
    </rs-card>

    <!-- Results Section -->
    <transition name="fade">
      <div v-if="showResults" class="mt-6">
        <rs-card>
          <template #header>
            <div class="flex justify-between items-center">
              <h2 class="text-lg font-semibold">Senarai Bantuan</h2>
              <div class="text-sm text-gray-600">
                {{ filteredUsers.length }} keputusan dijumpai
              </div>
            </div>
          </template>
          <template #body>
            <div v-if="filteredUsers.length > 0" class="overflow-x-auto">
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
                    <th class="px-3 py-2 border text-center text-sm font-medium">Tindakan</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(user, idx) in filteredUsers" :key="user.ic" class="hover:bg-gray-50">
                    <td class="px-3 py-2 border text-sm">{{ idx + 1 }}</td>
                    <td class="px-3 py-2 border text-sm font-medium">{{ user.nama }}</td>
                    <td class="px-3 py-2 border text-sm">{{ user.ic }}</td>
                    <td class="px-3 py-2 border text-sm">
                      <span :class="getTanggunganBadgeClass(user.tanggungan)">{{ user.tanggungan }}</span>
                    </td>
                    <td class="px-3 py-2 border text-sm">
                      <span :class="getKategoriAsnafBadgeClass(user.kategoriAsnaf)">{{ user.kategoriAsnaf }}</span>
                    </td>
                    <td class="px-3 py-2 border text-sm">{{ user.umur }} tahun</td>
                    <td class="px-3 py-2 border text-sm">
                      <span :class="getStatusKesihatanBadgeClass(user.statusKesihatan)">{{ user.statusKesihatan }}</span>
                    </td>
                    <td class="px-3 py-2 border text-center">
                      <input type="checkbox" v-model="user.selected" class="w-4 h-4" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else class="text-center py-8">
              <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p class="text-gray-500">Tiada keputusan dijumpai untuk kriteria yang dipilih.</p>
            </div>
          </template>
        </rs-card>

        <!-- Action Buttons -->
        <div v-if="filteredUsers.length > 0" class="mt-4 flex justify-between items-center">
          <div class="text-sm text-gray-600">
            {{ selectedUsersCount }} daripada {{ filteredUsers.length }} dipilih
          </div>
          <div class="flex gap-2">
            <rs-button variant="outline" @click="selectAll">
              Pilih Semua
            </rs-button>
            <rs-button variant="outline" @click="deselectAll">
              Batal Pilih
            </rs-button>
            <rs-button variant="success" @click="processSelected" :disabled="selectedUsersCount === 0">
              Proses Dipilih ({{ selectedUsersCount }})
            </rs-button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { navigateTo } from '#imports'

// Mock data for demonstration
const mockUsers = [
  // Fakir Category - Various Tanggungan
  { nama: 'Ahmad bin Ali', ic: '800101-14-1234', tanggungan: 'T2', kategoriAsnaf: 'Fakir', umur: 45, statusKesihatan: 'Sihat', selected: false },
  { nama: 'Noraini binti Hassan', ic: '820404-10-1111', tanggungan: 'T13', kategoriAsnaf: 'Fakir', umur: 35, statusKesihatan: 'Sihat', selected: false },
  { nama: 'Siti binti Ahmad', ic: '010101-14-5678', tanggungan: 'T1', kategoriAsnaf: 'Fakir', umur: 22, statusKesihatan: 'Sihat', selected: false },
  { nama: 'Aminah binti Zainal', ic: '120202-08-3333', tanggungan: 'T4', kategoriAsnaf: 'Fakir', umur: 15, statusKesihatan: 'Sihat', selected: false },
  { nama: 'Siti binti Zainal', ic: '180808-08-5555', tanggungan: 'T7', kategoriAsnaf: 'Fakir', umur: 9, statusKesihatan: 'Sihat', selected: false },
  { nama: 'Noraini binti Zainal', ic: '220202-08-7777', tanggungan: 'T9', kategoriAsnaf: 'Fakir', umur: 3, statusKesihatan: 'Sihat', selected: false },
  { nama: 'Siti binti Hassan', ic: '040404-10-9999', tanggungan: 'T11', kategoriAsnaf: 'Fakir', umur: 42, statusKesihatan: 'Sihat', selected: false },
  { nama: 'Fatimah binti Hassan', ic: '080808-10-1112', tanggungan: 'T13', kategoriAsnaf: 'Fakir', umur: 55, statusKesihatan: 'Sakit Kronik', selected: false },
  { nama: 'Aisyah binti Hassan', ic: '120202-10-3333', tanggungan: 'T15', kategoriAsnaf: 'Fakir', umur: 25, statusKesihatan: 'Sihat', selected: false },
  { nama: 'Khalid bin Ismail', ic: '750505-08-1111', tanggungan: 'T3', kategoriAsnaf: 'Fakir', umur: 48, statusKesihatan: 'Kurang Sihat', selected: false },
  { nama: 'Rashidah binti Omar', ic: '820606-10-2222', tanggungan: 'T5', kategoriAsnaf: 'Fakir', umur: 39, statusKesihatan: 'Sihat', selected: false },
  { nama: 'Sulaiman bin Yusof', ic: '700707-12-3333', tanggungan: 'T8', kategoriAsnaf: 'Fakir', umur: 62, statusKesihatan: 'Sakit Kronik', selected: false },
  { nama: 'Latifah binti Rahman', ic: '850808-14-4444', tanggungan: 'T6', kategoriAsnaf: 'Fakir', umur: 29, statusKesihatan: 'Sihat', selected: false },
  { nama: 'Yusof bin Abdullah', ic: '680909-16-5555', tanggungan: 'T10', kategoriAsnaf: 'Fakir', umur: 71, statusKesihatan: 'OKU', selected: false },
  { nama: 'Zainab binti Mohamed', ic: '901010-18-6666', tanggungan: 'T12', kategoriAsnaf: 'Fakir', umur: 18, statusKesihatan: 'Sihat', selected: false },

  // Miskin Category - Various Tanggungan
  { nama: 'Zainal Abidin', ic: '690303-08-2222', tanggungan: 'T5', kategoriAsnaf: 'Miskin', umur: 68, statusKesihatan: 'Sakit Kronik', selected: false },
  { nama: 'Musa bin Salleh', ic: '600505-12-3333', tanggungan: 'T14', kategoriAsnaf: 'Miskin', umur: 75, statusKesihatan: 'OKU', selected: false },
  { nama: 'Ali bin Ahmad', ic: '030303-14-9999', tanggungan: 'T3', kategoriAsnaf: 'Miskin', umur: 28, statusKesihatan: 'Sihat', selected: false },
  { nama: 'Rahim bin Zainal', ic: '150505-08-4444', tanggungan: 'T6', kategoriAsnaf: 'Miskin', umur: 12, statusKesihatan: 'Sihat', selected: false },
  { nama: 'Rosli bin Zainal', ic: '200101-08-6666', tanggungan: 'T8', kategoriAsnaf: 'Miskin', umur: 6, statusKesihatan: 'Sihat', selected: false },
  { nama: 'Hassan bin Ahmad', ic: '500101-10-8888', tanggungan: 'T10', kategoriAsnaf: 'Miskin', umur: 65, statusKesihatan: 'Kurang Sihat', selected: false },
  { nama: 'Ali bin Hassan', ic: '060606-10-0000', tanggungan: 'T12', kategoriAsnaf: 'Miskin', umur: 38, statusKesihatan: 'Sihat', selected: false },
  { nama: 'Rahman bin Hassan', ic: '100101-10-2222', tanggungan: 'T14', kategoriAsnaf: 'Miskin', umur: 70, statusKesihatan: 'OKU', selected: false },
  { nama: 'Zainab binti Hassan', ic: '140404-10-4444', tanggungan: 'T1', kategoriAsnaf: 'Miskin', umur: 33, statusKesihatan: 'Sihat', selected: false },
  { nama: 'Abdul Rahman bin Omar', ic: '720202-08-7777', tanggungan: 'T4', kategoriAsnaf: 'Miskin', umur: 51, statusKesihatan: 'Kurang Sihat', selected: false },
  { nama: 'Salmah binti Ismail', ic: '780303-10-8888', tanggungan: 'T7', kategoriAsnaf: 'Miskin', umur: 44, statusKesihatan: 'Sihat', selected: false },
  { nama: 'Mohamed bin Yusof', ic: '650404-12-9999', tanggungan: 'T9', kategoriAsnaf: 'Miskin', umur: 58, statusKesihatan: 'Sakit Kronik', selected: false },
  { nama: 'Aminah binti Abdullah', ic: '880505-14-0000', tanggungan: 'T11', kategoriAsnaf: 'Miskin', umur: 26, statusKesihatan: 'Sihat', selected: false },
  { nama: 'Rahim bin Mohamed', ic: '700606-16-1111', tanggungan: 'T13', kategoriAsnaf: 'Miskin', umur: 73, statusKesihatan: 'OKU', selected: false },
  { nama: 'Fatimah binti Omar', ic: '830707-18-2222', tanggungan: 'T15', kategoriAsnaf: 'Miskin', umur: 31, statusKesihatan: 'Sihat', selected: false },
  { nama: 'Ismail bin Rahman', ic: '670808-20-3333', tanggungan: 'T2', kategoriAsnaf: 'Miskin', umur: 56, statusKesihatan: 'Kurang Sihat', selected: false },

  // Mualaf Category - Various Tanggungan
  { nama: 'Fatimah binti Osman', ic: '750202-10-4321', tanggungan: 'Tiada', kategoriAsnaf: 'Mualaf', umur: 52, statusKesihatan: 'Kurang Sihat', selected: false },
  { nama: 'Osman bin Ali', ic: '990909-10-8888', tanggungan: 'Tiada', kategoriAsnaf: 'Mualaf', umur: 19, statusKesihatan: 'Sihat', selected: false },
  { nama: 'Sarah binti David', ic: '850101-08-1234', tanggungan: 'T1', kategoriAsnaf: 'Mualaf', umur: 37, statusKesihatan: 'Sihat', selected: false },
  { nama: 'Michael bin John', ic: '900202-10-5678', tanggungan: 'T2', kategoriAsnaf: 'Mualaf', umur: 24, statusKesihatan: 'Sihat', selected: false },
  { nama: 'Aisha binti Robert', ic: '880303-12-9012', tanggungan: 'T3', kategoriAsnaf: 'Mualaf', umur: 41, statusKesihatan: 'Kurang Sihat', selected: false },
  { nama: 'Ahmed bin William', ic: '920404-14-3456', tanggungan: 'T4', kategoriAsnaf: 'Mualaf', umur: 21, statusKesihatan: 'Sihat', selected: false },
  { nama: 'Mariam binti James', ic: '870505-16-7890', tanggungan: 'T5', kategoriAsnaf: 'Mualaf', umur: 46, statusKesihatan: 'Sihat', selected: false },
  { nama: 'Omar bin Thomas', ic: '940606-18-2345', tanggungan: 'T6', kategoriAsnaf: 'Mualaf', umur: 18, statusKesihatan: 'Sihat', selected: false },
  { nama: 'Noor binti Daniel', ic: '890707-20-6789', tanggungan: 'T7', kategoriAsnaf: 'Mualaf', umur: 43, statusKesihatan: 'Kurang Sihat', selected: false },
  { nama: 'Hassan bin Christopher', ic: '960808-22-0123', tanggungan: 'T8', kategoriAsnaf: 'Mualaf', umur: 16, statusKesihatan: 'Sihat', selected: false },
  { nama: 'Amina binti Matthew', ic: '910909-24-4567', tanggungan: 'T9', kategoriAsnaf: 'Mualaf', umur: 23, statusKesihatan: 'Sihat', selected: false },
  { nama: 'Yusuf bin Anthony', ic: '981010-26-8901', tanggungan: 'T10', kategoriAsnaf: 'Mualaf', umur: 14, statusKesihatan: 'Sihat', selected: false },

  // Additional Diverse Cases
  { nama: 'Rashid bin Mohamed', ic: '720101-08-1111', tanggungan: 'T1', kategoriAsnaf: 'Fakir', umur: 61, statusKesihatan: 'Sakit Kronik', selected: false },
  { nama: 'Siti Aisyah binti Omar', ic: '850202-10-2222', tanggungan: 'T2', kategoriAsnaf: 'Miskin', umur: 29, statusKesihatan: 'Sihat', selected: false },
  { nama: 'Abdullah bin Ismail', ic: '680303-12-3333', tanggungan: 'T3', kategoriAsnaf: 'Fakir', umur: 67, statusKesihatan: 'OKU', selected: false },
  { nama: 'Nurul Ain binti Rahman', ic: '900404-14-4444', tanggungan: 'T4', kategoriAsnaf: 'Miskin', umur: 20, statusKesihatan: 'Sihat', selected: false },
  { nama: 'Mohamed bin Yusof', ic: '740505-16-5555', tanggungan: 'T5', kategoriAsnaf: 'Fakir', umur: 59, statusKesihatan: 'Kurang Sihat', selected: false },
  { nama: 'Aminah binti Abdullah', ic: '870606-18-6666', tanggungan: 'T6', kategoriAsnaf: 'Miskin', umur: 27, statusKesihatan: 'Sihat', selected: false },
  { nama: 'Zainal bin Omar', ic: '700707-20-7777', tanggungan: 'T7', kategoriAsnaf: 'Fakir', umur: 63, statusKesihatan: 'Sakit Kronik', selected: false },
  { nama: 'Fatimah binti Ismail', ic: '920808-22-8888', tanggungan: 'T8', kategoriAsnaf: 'Miskin', umur: 17, statusKesihatan: 'Sihat', selected: false },
  { nama: 'Rahman bin Mohamed', ic: '760909-24-9999', tanggungan: 'T9', kategoriAsnaf: 'Fakir', umur: 57, statusKesihatan: 'OKU', selected: false },
  { nama: 'Siti Nur binti Abdullah', ic: '891010-26-0000', tanggungan: 'T10', kategoriAsnaf: 'Miskin', umur: 25, statusKesihatan: 'Sihat', selected: false },
  { nama: 'Ismail bin Omar', ic: '721111-28-1111', tanggungan: 'T11', kategoriAsnaf: 'Fakir', umur: 65, statusKesihatan: 'Kurang Sihat', selected: false },
  { nama: 'Noraini binti Yusof', ic: '941212-30-2222', tanggungan: 'T12', kategoriAsnaf: 'Miskin', umur: 13, statusKesihatan: 'Sihat', selected: false },
  { nama: 'Omar bin Rahman', ic: '780101-32-3333', tanggungan: 'T13', kategoriAsnaf: 'Fakir', umur: 55, statusKesihatan: 'Sakit Kronik', selected: false },
  { nama: 'Aisyah binti Mohamed', ic: '960202-34-4444', tanggungan: 'T14', kategoriAsnaf: 'Miskin', umur: 11, statusKesihatan: 'Sihat', selected: false },
  { nama: 'Yusof bin Abdullah', ic: '740303-36-5555', tanggungan: 'T15', kategoriAsnaf: 'Fakir', umur: 69, statusKesihatan: 'OKU', selected: false },
  { nama: 'Rashidah binti Omar', ic: '980404-38-6666', tanggungan: 'T1', kategoriAsnaf: 'Miskin', umur: 8, statusKesihatan: 'Sihat', selected: false },
  { nama: 'Sulaiman bin Ismail', ic: '760505-40-7777', tanggungan: 'T2', kategoriAsnaf: 'Fakir', umur: 61, statusKesihatan: 'Kurang Sihat', selected: false },
  { nama: 'Latifah binti Rahman', ic: '990606-42-8888', tanggungan: 'T3', kategoriAsnaf: 'Miskin', umur: 6, statusKesihatan: 'Sihat', selected: false },
  { nama: 'Abdul Rahman bin Mohamed', ic: '780707-44-9999', tanggungan: 'T4', kategoriAsnaf: 'Fakir', umur: 53, statusKesihatan: 'Sakit Kronik', selected: false },
  { nama: 'Salmah binti Abdullah', ic: '920808-46-0000', tanggungan: 'T5', kategoriAsnaf: 'Miskin', umur: 4, statusKesihatan: 'Sihat', selected: false },
  { nama: 'Mohamed bin Omar', ic: '800909-48-1111', tanggungan: 'T6', kategoriAsnaf: 'Fakir', umur: 71, statusKesihatan: 'OKU', selected: false },
  { nama: 'Aminah binti Yusof', ic: '941010-50-2222', tanggungan: 'T7', kategoriAsnaf: 'Miskin', umur: 2, statusKesihatan: 'Sihat', selected: false },
  { nama: 'Rahim bin Ismail', ic: '821111-52-3333', tanggungan: 'T8', kategoriAsnaf: 'Fakir', umur: 49, statusKesihatan: 'Kurang Sihat', selected: false },
  { nama: 'Fatimah binti Rahman', ic: '961212-54-4444', tanggungan: 'T9', kategoriAsnaf: 'Miskin', umur: 1, statusKesihatan: 'Sihat', selected: false },
  { nama: 'Zainal bin Mohamed', ic: '840101-56-5555', tanggungan: 'T10', kategoriAsnaf: 'Fakir', umur: 47, statusKesihatan: 'Sakit Kronik', selected: false },
  { nama: 'Noraini binti Abdullah', ic: '980202-58-6666', tanggungan: 'T11', kategoriAsnaf: 'Miskin', umur: 0, statusKesihatan: 'Sihat', selected: false },
  { nama: 'Omar bin Yusof', ic: '860303-60-7777', tanggungan: 'T12', kategoriAsnaf: 'Fakir', umur: 45, statusKesihatan: 'OKU', selected: false },
  { nama: 'Aisyah binti Ismail', ic: '990404-62-8888', tanggungan: 'T13', kategoriAsnaf: 'Miskin', umur: 0, statusKesihatan: 'Sihat', selected: false },
  { nama: 'Rahman bin Omar', ic: '880505-64-9999', tanggungan: 'T14', kategoriAsnaf: 'Fakir', umur: 43, statusKesihatan: 'Kurang Sihat', selected: false },
  { nama: 'Siti Nur binti Mohamed', ic: '910606-66-0000', tanggungan: 'T15', kategoriAsnaf: 'Miskin', umur: 0, statusKesihatan: 'Sihat', selected: false },
]

const tanggunganOptions = ['Tiada', 'T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12', 'T13', 'T14', 'T15']

// Reactive data
const filters = ref({
  tanggungan: '',
  kategoriAsnaf: '',
  umur: '',
  statusKesihatan: ''
})

const showResults = ref(false)
const isLoading = ref(false)
const filteredUsers = ref([])

// Computed properties
const selectedUsersCount = computed(() => {
  return filteredUsers.value.filter(user => user.selected).length
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

// Filter function
function filterUsers() {
  let filtered = [...mockUsers]

  // Filter by Tanggungan
  if (filters.value.tanggungan) {
    filtered = filtered.filter(user => user.tanggungan === filters.value.tanggungan)
  }

  // Filter by Kategori Asnaf
  if (filters.value.kategoriAsnaf) {
    filtered = filtered.filter(user => user.kategoriAsnaf === filters.value.kategoriAsnaf)
  }

  // Filter by Umur
  if (filters.value.umur) {
    const [min, max] = filters.value.umur.split('-').map(Number)
    if (filters.value.umur === '65+') {
      filtered = filtered.filter(user => user.umur >= 65)
    } else if (filters.value.umur === '0-17') {
      filtered = filtered.filter(user => user.umur >= 0 && user.umur <= 17)
    } else {
      filtered = filtered.filter(user => user.umur >= min && user.umur <= max)
    }
  }

  // Filter by Status Kesihatan
  if (filters.value.statusKesihatan) {
    filtered = filtered.filter(user => user.statusKesihatan === filters.value.statusKesihatan)
  }

  return filtered
}

// Search function
async function handleSearch() {
  isLoading.value = true
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  filteredUsers.value = filterUsers().map(user => ({ ...user, selected: false }))
  showResults.value = true
  isLoading.value = false
}

// Selection functions
function selectAll() {
  filteredUsers.value.forEach(user => {
    user.selected = true
  })
}

function deselectAll() {
  filteredUsers.value.forEach(user => {
    user.selected = false
  })
}

function processSelected() {
  const selectedUsers = filteredUsers.value.filter(user => user.selected)
  
  if (selectedUsers.length === 0) {
    alert('Sila pilih sekurang-kurangnya satu penerima sebelum meneruskan.')
    return
  }
  
  // Store selected users in localStorage
  localStorage.setItem('selectedBantuanRecipients', JSON.stringify(selectedUsers))
  
  // Navigate to page 02 for review and approval
  navigateTo('/BF-BTN/BU/test-bantuan/02')
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { 
  transition: opacity 0.3s; 
}
.fade-enter-from, .fade-leave-to { 
  opacity: 0; 
}
</style>