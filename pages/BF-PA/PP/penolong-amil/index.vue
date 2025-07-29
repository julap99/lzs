<template>
  <div>
    <!-- Page Header -->
    <div class="mb-6">
      <div class="text-center mb-4">
        <div class="text-2xl font-bold mb-2 text-gray-800" dir="rtl" lang="ar">
          اَلسَلامُ عَلَيْكُم وَرَحْمَةُ اَللهِ وَبَرَكاتُهُ‎
        </div>
        <h1 class="text-2xl font-semibold text-gray-900">
          Selamat Datang ke New Agihan System
        </h1>
        <p class="mt-2 text-sm text-gray-600">
          Sistem Pengurusan Zakat Digital - Semakan Tawaran Pelantikan
        </p>
      </div>
    </div>

    <!-- User Profile Card -->
    <rs-card class="mb-6">
      <template #body>
        <div class="flex items-center justify-between p-4">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-lg">
              A
            </div>
            <div>
              <h2 class="text-lg font-semibold text-gray-900">Ahmad bin Abdullah</h2>
              <p class="text-sm text-gray-600">Calon Penolong Amil</p>
              <p class="text-xs text-primary font-medium">Log Masuk Pertama - Semakan Tawaran Diperlukan</p>
            </div>
          </div>
          <rs-button size="sm" variant="primary-outline" @click="showSuratTawaran = true" title="Surat Tawaran">
            <Icon name="heroicons:document-text" size="20" class="mr-2" />
            Semak Surat Tawaran
          </rs-button>
        </div>
      </template>
    </rs-card>

    <!-- Instructions Card -->
    <rs-card class="mb-6">
      <template #header>
        <div class="flex items-center">
          <Icon name="heroicons:information-circle" class="mr-2 text-primary" />
          Arahan Penting
        </div>
      </template>
      <template #body>
        <div class="space-y-4">
          <div class="bg-warning/5 border border-warning/20 rounded-lg p-4">
            <div class="flex items-start gap-3">
              <Icon name="heroicons:exclamation-triangle" class="text-warning mt-0.5" size="20" />
              <div>
                <p class="font-semibold text-warning mb-2">Tindakan Diperlukan</p>
                <p class="text-gray-700 text-sm">
                  Ini adalah log masuk pertama anda. Anda perlu membuat keputusan mengenai tawaran pelantikan sebagai Penolong Amil sebelum dapat menggunakan sistem.
                </p>
              </div>
            </div>
          </div>
          
          <div class="space-y-3">
            <p class="text-gray-700">
              <strong>Langkah-langkah yang perlu diikuti:</strong>
            </p>
            <ol class="list-decimal list-inside space-y-2 text-sm text-gray-700 ml-4">
              <li>Klik butang "Semak Surat Tawaran" untuk membaca dokumen tawaran pelantikan</li>
              <li>Pilih kategori perkhidmatan yang ditawarkan kepada anda</li>
              <li>Buat keputusan sama ada untuk menerima atau menolak tawaran</li>
              <li>Setelah keputusan dibuat, anda akan diarahkan ke dashboard yang sesuai</li>
            </ol>
          </div>
          
          <div class="bg-primary/5 border border-primary/20 rounded-lg p-3">
            <div class="flex items-center gap-2">
              <Icon name="heroicons:check-circle" class="text-primary" size="16" />
              <span class="text-sm font-medium text-primary">
                Pilih sekurang-kurangnya satu kategori untuk meneruskan permohonan
              </span>
            </div>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Categories Selection -->
    <rs-card class="mb-6">
      <template #header>
        <div class="flex items-center">
          <Icon name="heroicons:squares-2x2" class="mr-2 text-primary" />
          Pilih Kategori Perkhidmatan
        </div>
      </template>
      <template #body>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="(category, key) in categories"
            :key="key"
            class="category-card"
            :class="{ 'selected': selectedKategori[key] }"
            @click="toggleCategory(key)"
            role="button"
            tabindex="0"
            @keydown.enter="toggleCategory(key)"
            @keydown.space.prevent="toggleCategory(key)"
            :aria-pressed="selectedKategori[key]"
          >
            <div class="category-card-header">
              <div class="flex items-center justify-between">
                <h4 class="category-title">{{ category.name }}</h4>
                <div class="category-checkbox" :class="{ 'checked': selectedKategori[key] }">
                  <Icon name="heroicons:check" size="16" v-if="selectedKategori[key]" />
                </div>
              </div>
            </div>
            
            <div class="category-card-body">
              <div class="category-detail">
                <Icon name="heroicons:building-library" size="16" />
                <span>{{ category.jenis }}</span>
              </div>
              <div class="category-detail">
                <Icon name="heroicons:building-office" size="16" />
                <span>{{ category.institusi }}</span>
              </div>
              <div class="category-detail">
                <Icon name="heroicons:calendar-days" size="16" />
                <span>{{ category.tempoh }}</span>
              </div>
              <div class="category-detail">
                <Icon name="heroicons:map-pin" size="16" />
                <span>{{ category.lokasi }}</span>
              </div>
              <div v-if="category.jawatan" class="category-detail">
                <Icon name="heroicons:identification" size="16" />
                <span class="text-primary">{{ category.jawatan }}</span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Action Buttons -->
    <rs-card>
      <template #body>
        <div class="flex flex-col sm:flex-row justify-center gap-4 p-4">
          <rs-button 
            variant="primary" 
            size="lg"
            @click="showAcceptModal = true" 
            :disabled="!isAnyKategoriSelected"
            class="flex items-center justify-center gap-2"
          >
            <Icon name="heroicons:check-circle" size="20" />
            Saya Terima Tawaran
          </rs-button>
          
          <rs-button 
            variant="danger-outline" 
            size="lg"
            @click="showRejectModal = true"
            class="flex items-center justify-center gap-2"
          >
            <Icon name="heroicons:x-circle" size="20" />
            Saya Tolak Tawaran
          </rs-button>
        </div>
      </template>
    </rs-card>

    <!-- Accept Modal -->
    <rs-modal v-model="showAcceptModal" title="Pengesahan Terima Tawaran" size="md" position="center">
      <template #body>
        <div class="space-y-6">
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0 w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
              <Icon name="heroicons:check-circle" size="24" class="text-success" />
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Pengesahan Penerimaan</h3>
              <p class="text-gray-700">
                Saya dengan ini mengesahkan bahawa saya menerima tawaran pelantikan sebagai Penolong Amil 
                untuk kategori yang telah dipilih.
              </p>
            </div>
          </div>

          <!-- Selected Categories -->
          <div>
            <h4 class="text-sm font-semibold text-gray-900 mb-3">Kategori yang Dipilih:</h4>
            <div class="space-y-2">
              <div 
                v-for="(category, key) in categories" 
                :key="key"
                v-if="selectedKategori[key]"
                class="flex items-center gap-2 bg-primary/5 px-3 py-2 rounded-lg"
              >
                <Icon name="heroicons:check-circle" size="16" class="text-primary" />
                <span class="text-sm font-medium text-primary">{{ category.name }}</span>
              </div>
            </div>
          </div>

          <!-- Confirmation Checkbox -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <div class="flex items-start gap-3">
              <input 
                type="checkbox" 
                v-model="acceptConfirmed" 
                id="accept-terms"
                class="mt-1 w-4 h-4 text-primary rounded focus:ring-primary"
              />
              <label for="accept-terms" class="text-sm text-gray-700">
                Saya telah membaca dan bersetuju dengan syarat-syarat yang ditetapkan. 
                Saya faham tanggungjawab sebagai Penolong Amil dan berkomitmen untuk melaksanakan 
                tugas dengan amanah.
              </label>
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-3">
          <rs-button variant="primary-outline" @click="showAcceptModal = false">
            Batal
          </rs-button>
          <rs-button variant="primary" @click="acceptOffer" :disabled="!acceptConfirmed">
            <Icon name="heroicons:paper-airplane" size="16" class="mr-2" />
            Hantar Pengesahan
          </rs-button>
        </div>
      </template>
    </rs-modal>

    <!-- Reject Modal -->
    <rs-modal v-model="showRejectModal" title="Pengesahan Tolak Tawaran" size="md" position="center">
      <template #body>
        <div class="space-y-6">
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0 w-12 h-12 bg-danger/10 rounded-full flex items-center justify-center">
              <Icon name="heroicons:x-circle" size="24" class="text-danger" />
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Pengesahan Penolakan</h3>
              <p class="text-gray-700">
                Saya tidak berminat untuk meneruskan tawaran pelantikan sebagai Penolong Amil pada masa ini.
              </p>
            </div>
          </div>
          
          <div class="bg-danger/5 border border-danger/20 rounded-lg p-4">
            <div class="flex items-start gap-3">
              <Icon name="heroicons:exclamation-triangle" size="20" class="text-danger mt-0.5" />
              <div class="text-sm">
                <p class="font-semibold text-danger mb-2">Amaran Penting:</p>
                <div class="text-gray-700 space-y-2">
                  <p>
                    <strong>Akaun ini akan dipadamkan secara automatik</strong> sekiranya anda menolak tawaran ini.
                  </p>
                  <p>
                    Anda tidak akan dapat log masuk semula sehingga tawaran baharu dihantar kepada anda pada masa hadapan.
                  </p>
                  <p>
                    Setelah menolak tawaran ini, anda mungkin perlu menunggu untuk tawaran akan datang. 
                    Pastikan keputusan anda adalah muktamad.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-3">
          <rs-button variant="primary-outline" @click="showRejectModal = false">
            Kembali
          </rs-button>
          <rs-button variant="danger" @click="rejectOffer">
            <Icon name="heroicons:x-mark" size="16" class="mr-2" />
            Sahkan Penolakan
          </rs-button>
        </div>
      </template>
    </rs-modal>

    <!-- Letter Modal -->
    <rs-modal v-model="showSuratTawaran" title="Surat Tawaran Pelantikan" size="lg" position="center">
      <template #body>
        <div class="space-y-6">
          <!-- Letter Header -->
          <div class="flex justify-between items-start pb-4 border-b">
            <div class="flex-1">
              <img src="https://www.zakatselangor.com.my/wp-content/uploads/2018/10/lzs-logo.png" alt="LZS" class="h-12 mb-4" />
              <div class="text-sm text-gray-600">
                <div class="font-semibold text-gray-900">Lembaga Zakat Selangor</div>
                <div>Majlis Agama Islam Selangor</div>
                <div>Menara Selatan, Bangunan Sultan Idris Shah</div>
                <div>Persiaran Masjid, Seksyen 5</div>
                <div>40000 Shah Alam, Selangor</div>
              </div>
            </div>
            <div class="text-right text-sm text-gray-600">
              <div class="font-semibold text-gray-900 mb-2">Kepada:</div>
              <div class="font-semibold">Ahmad bin Abdullah</div>
              <div>880429-10-5605</div>
              <div>Masjid Wilayah Persekutuan</div>
              <div>Kuala Lumpur</div>
            </div>
          </div>

          <!-- Letter Content -->
          <div class="space-y-6">
            <div class="text-center">
              <h2 class="text-xl font-bold text-gray-900">
                SURAT TAWARAN PELANTIKAN PENOLONG AMIL
              </h2>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
              <div class="text-sm">
                <span class="font-semibold text-gray-700">No. Rujukan:</span>
                <span class="text-gray-900">LZS/PA/2024/FITRAH01</span>
              </div>
              <div class="text-sm">
                <span class="font-semibold text-gray-700">Tarikh:</span>
                <span class="text-gray-900">01 Januari 2024</span>
              </div>
              <div class="text-sm">
                <span class="font-semibold text-gray-700">Tempoh Perkhidmatan:</span>
                <span class="text-gray-900">1 Januari 2024 - 31 Disember 2027</span>
              </div>
              <div class="text-sm">
                <span class="font-semibold text-gray-700">Kategori:</span>
                <span class="text-gray-900">Penolong Amil</span>
              </div>
            </div>

            <div class="bg-primary/5 p-4 rounded-lg">
              <h3 class="font-semibold text-gray-900 mb-3">Maklumat Penolong Amil:</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div><span class="font-semibold">Nama:</span> Ahmad bin Abdullah</div>
                <div><span class="font-semibold">No. Kad Pengenalan:</span> 880429-10-5605</div>
                <div><span class="font-semibold">Kod:</span> FITRAH01</div>
                <div><span class="font-semibold">Institusi:</span> Masjid Wilayah Persekutuan</div>
              </div>
            </div>

            <div class="text-sm leading-relaxed space-y-4">
              <p>Tuan/Puan,</p>
              <p>Dengan segala hormatnya perkara di atas adalah dirujuk.</p>
              <p>
                Sukacita dimaklumkan bahawa tuan telah dipilih untuk dilantik sebagai 
                <span class="font-semibold">Penolong Amil</span> bagi tempoh yang dinyatakan di atas.
              </p>
              
              <div class="bg-warning/5 border-l-4 border-warning p-4">
                <h4 class="font-semibold text-gray-900 mb-2">Langkah Seterusnya:</h4>
                <ul class="list-disc pl-5 space-y-1">
                  <li>Sila hadir ke pejabat Lembaga Zakat Selangor untuk pengesahan dokumen</li>
                  <li>Penerimaan kad tauliah digital akan diberikan selepas pengesahan</li>
                  <li>Sebarang pertanyaan boleh diajukan ke info@zakatselangor.com.my</li>
                </ul>
              </div>
              
              <p>Sekian, terima kasih.</p>
              
              <div class="pt-4 border-t">
                <div class="text-right">
                  <div>Yang benar,</div>
                  <div class="font-bold mt-2">Lembaga Zakat Selangor</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-center gap-3">
          <rs-button variant="success-outline" @click="downloadLetter">
            <Icon name="heroicons:arrow-down-tray" size="16" class="mr-2" />
            Muat Turun PDF
          </rs-button>
          <rs-button variant="primary-outline" @click="showSuratTawaran = false">
            <Icon name="heroicons:x-mark" size="16" class="mr-2" />
            Tutup Surat
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'

// Page metadata
definePageMeta({
  title: 'Tawaran Penolong Amil - Log Masuk Pertama'
})

// Reactive data
const showAcceptModal = ref(false)
const showRejectModal = ref(false)
const showSuratTawaran = ref(false)
const acceptConfirmed = ref(false)

const selectedKategori = reactive({
  Fitrah: false,
  Padi: false,
  Kariah: false,
  Komuniti: false
})

const categories = {
  Fitrah: {
    name: 'Fitrah',
    jenis: 'Zakat Fitrah',
    institusi: 'Masjid Wilayah Persekutuan',
    tempoh: '2024 - 2027',
    lokasi: 'Shah Alam'
  },
  Padi: {
    name: 'Padi',
    jenis: 'Zakat Padi',
    institusi: 'Masjid Al-Khairiyah',
    tempoh: '2024 - 2027',
    lokasi: 'Selangor'
  },
  Kariah: {
    name: 'Kariah',
    jenis: 'Zakat Kariah',
    institusi: 'Masjid Bandar Utama',
    tempoh: '2024 - 2027',
    lokasi: 'Petaling Jaya'
  }
}

// Computed properties
const isAnyKategoriSelected = computed(() => {
  return Object.values(selectedKategori).some(value => value)
})

// Methods
const toggleCategory = (key) => {
  selectedKategori[key] = !selectedKategori[key]
}

const acceptOffer = () => {
  // Show success message and redirect to dashboard
  alert('Terima kasih! Pengesahan penerimaan tawaran telah dihantar. Anda akan diarahkan ke dashboard.')
  window.location.href = '/BF-PA/PP/pra-daftar-v3/penolong-amil-dashboard'
}

const rejectOffer = () => {
  // Show message and redirect to logout/login
  alert('Tawaran telah ditolak. Akaun anda akan dipadamkan. Terima kasih atas pertimbangan anda.')
  window.location.href = '/logout'
}

const downloadLetter = () => {
  // Generate and download the letter as PDF
  // This would typically call an API endpoint to generate the PDF
  alert('Surat tawaran sedang dimuat turun...')
  // Implementation for PDF download would go here
}
</script>

<style scoped>
.category-card {
  @apply bg-white rounded-lg border-2 border-gray-200 p-4 cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary/30;
}

.category-card:focus {
  @apply outline-none ring-2 ring-primary/50 ring-offset-2;
}

.category-card.selected {
  @apply border-primary bg-primary/5 shadow-sm;
}

.category-card-header {
  @apply mb-3;
}

.category-title {
  @apply text-lg font-semibold text-gray-900;
}

.category-checkbox {
  @apply w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center transition-all duration-200;
}

.category-checkbox.checked {
  @apply bg-primary border-primary text-white;
}

.category-card-body {
  @apply space-y-2;
}

.category-detail {
  @apply flex items-center gap-2 text-sm text-gray-600;
}

.category-detail svg {
  @apply flex-shrink-0 text-gray-400;
}

.category-card.selected .category-detail {
  @apply text-gray-700;
}

.category-card.selected .category-detail svg {
  @apply text-primary;
}

.category-card.selected .category-title {
  @apply text-primary;
}

/* Mobile responsiveness */
@media (max-width: 640px) {
  .category-card {
    @apply p-3;
  }
  
  .category-title {
    @apply text-base;
  }
}
</style>