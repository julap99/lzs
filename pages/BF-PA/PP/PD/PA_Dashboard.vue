<template>
  <div>
    <!-- Breadcrumb Navigation -->
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- User Profile Card -->
    <rs-card class="mb-6">
      <template #body>
        <div class="flex items-center justify-between p-4">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-lg">
              M
            </div>
            <div>
              <h2 class="text-lg font-semibold text-gray-900">Mohd Shahban bin Mohd Nordin</h2>
              <p class="text-sm text-gray-600">Penolong Amil - MAAHAD AL-TAHZIB WA AL-TAALIM</p>
              <p class="text-xs text-primary font-medium">Kod: MTWT03 | Tempoh: 2022 - 2027</p>
            </div>
          </div>
          <div class="flex gap-2">
            <rs-button size="sm" variant="primary-outline" @click="showKadTauliah = true" title="Kad Tauliah">
              <Icon name="heroicons:identification" size="20" class="mr-2" />
              Kad Tauliah
            </rs-button>
            <rs-button size="sm" variant="primary-outline" @click="showSuratTawaran = true" title="Surat Tawaran">
              <Icon name="heroicons:document-text" size="20" class="mr-2" />
              Surat Tawaran
            </rs-button>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <rs-card
        v-for="card in cards"
        :key="card.title"
        class="group transition-all duration-300 hover:shadow-md cursor-pointer"
        @click="openCardModal(card)"
      >
        <template #body>
          <div class="p-4">
            <div class="flex items-center justify-between mb-3">
              <div class="p-2 rounded-lg" :class="card.iconBg">
                <Icon :name="card.icon" size="24" :class="card.iconColor" />
              </div>
              <div class="text-xs font-medium px-2 py-1 rounded-full" :class="card.changeBadge">
                {{ card.changeText }}
              </div>
            </div>
            <div>
              <p class="text-2xl font-bold text-gray-900 mb-1">{{ card.value }}</p>
              <h3 class="text-sm font-semibold text-gray-700 mb-1">{{ card.title }}</h3>
              <p class="text-xs text-gray-600">{{ card.description }}</p>
            </div>
          </div>
        </template>
      </rs-card>
    </div>

    <!-- Tasks Section -->
    <rs-card class="mb-6">
      <template #header>
        <div class="flex items-center">
          <Icon name="heroicons:clipboard-document-list" class="mr-2 text-primary" />
          Senarai Tugasan
        </div>
      </template>
      <template #body>
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left">
            <thead class="text-xs uppercase bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3">Tugasan</th>
                <th scope="col" class="px-6 py-3 text-center">Status</th>
                <th scope="col" class="px-6 py-3 text-center">Tarikh</th>
                <th scope="col" class="px-6 py-3 text-center">Tindakan</th>
              </tr>
            </thead>
            <tbody>
              <!-- Tugasan Belum Selesai -->
              <tr class="bg-danger/5">
                <td colspan="4" class="px-6 py-2 font-semibold text-danger text-sm">
                  <Icon name="heroicons:exclamation-triangle" size="16" class="inline mr-2" />
                  Tugasan Belum Selesai
                </td>
              </tr>
              <tr class="bg-white border-b hover:bg-gray-50">
                <td class="px-6 py-4 font-medium text-gray-900">Lengkapkan Maklumat Peribadi</td>
                <td class="px-6 py-4 text-center">
                  <rs-badge variant="danger">Tindakan Segera</rs-badge>
                </td>
                <td class="px-6 py-4 text-center text-gray-600">01-06-2024</td>
                <td class="px-6 py-4 text-center">
                  <rs-button size="sm" variant="primary-outline" @click="navigateTo('/BF-PA/PP/PD/09')">
                    <Icon name="heroicons:pencil-square" class="mr-1" size="16" />
                    Lengkapkan
                  </rs-button>
                </td>
              </tr>
              <tr class="bg-white border-b hover:bg-gray-50">
                <td class="px-6 py-4 font-medium text-gray-900">Muat naik dokumen peribadi</td>
                <td class="px-6 py-4 text-center">
                  <rs-badge variant="warning">Dalam Proses</rs-badge>
                </td>
                <td class="px-6 py-4 text-center text-gray-600">02-06-2024</td>
                <td class="px-6 py-4 text-center">
                  <rs-button size="sm" variant="primary-outline">
                    <Icon name="heroicons:arrow-up-tray" class="mr-1" size="16" />
                    Muat Naik
                  </rs-button>
                </td>
              </tr>
              <tr class="bg-white border-b hover:bg-gray-50">
                <td class="px-6 py-4 font-medium text-gray-900">Lengkapkan Borang Penilaian</td>
                <td class="px-6 py-4 text-center">
                  <rs-badge variant="warning">Dalam Proses</rs-badge>
                </td>
                <td class="px-6 py-4 text-center text-gray-600">03-06-2024</td>
                <td class="px-6 py-4 text-center">
                  <rs-button size="sm" variant="primary-outline">
                    <Icon name="heroicons:document-text" class="mr-1" size="16" />
                    Lengkapkan
                  </rs-button>
                </td>
              </tr>
              
              <!-- Tugasan Sedang Berjalan -->
              <tr class="bg-info/5">
                <td colspan="4" class="px-6 py-2 font-semibold text-info text-sm">
                  <Icon name="heroicons:clock" size="16" class="inline mr-2" />
                  Tugasan Sedang Berjalan
                </td>
              </tr>
              <tr class="bg-white border-b hover:bg-gray-50">
                <td class="px-6 py-4 font-medium text-gray-900">Sahkan Kehadiran Mesyuarat</td>
                <td class="px-6 py-4 text-center">
                  <rs-badge variant="info">Sedang Berjalan</rs-badge>
                </td>
                <td class="px-6 py-4 text-center text-gray-600">04-06-2024</td>
                <td class="px-6 py-4 text-center">
                  <rs-button size="sm" variant="primary-outline">
                    <Icon name="heroicons:check-circle" class="mr-1" size="16" />
                    Sahkan
                  </rs-button>
                </td>
              </tr>
              <tr class="bg-white border-b hover:bg-gray-50">
                <td class="px-6 py-4 font-medium text-gray-900">Hantar Laporan Aktiviti</td>
                <td class="px-6 py-4 text-center">
                  <rs-badge variant="info">Sedang Berjalan</rs-badge>
                </td>
                <td class="px-6 py-4 text-center text-gray-600">05-06-2024</td>
                <td class="px-6 py-4 text-center">
                  <rs-button size="sm" variant="primary-outline">
                    <Icon name="heroicons:document-text" class="mr-1" size="16" />
                    Hantar
                  </rs-button>
                </td>
              </tr>
              
              <!-- Tugasan Selesai -->
              <tr class="bg-success/5">
                <td colspan="4" class="px-6 py-2 font-semibold text-success text-sm">
                  <Icon name="heroicons:check-circle" size="16" class="inline mr-2" />
                  Tugasan Selesai
                </td>
              </tr>
              <tr class="bg-white border-b hover:bg-gray-50">
                <td class="px-6 py-4 font-medium text-gray-900">Kemaskini Maklumat Diri</td>
                <td class="px-6 py-4 text-center">
                  <rs-badge variant="success">Selesai</rs-badge>
                </td>
                <td class="px-6 py-4 text-center text-gray-600">06-06-2024</td>
                <td class="px-6 py-4 text-center text-gray-400">-</td>
              </tr>
              <tr class="bg-white border-b hover:bg-gray-50">
                <td class="px-6 py-4 font-medium text-gray-900">Hantar Borang Akuan</td>
                <td class="px-6 py-4 text-center">
                  <rs-badge variant="success">Selesai</rs-badge>
                </td>
                <td class="px-6 py-4 text-center text-gray-600">07-06-2024</td>
                <td class="px-6 py-4 text-center text-gray-400">-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </rs-card>

    <!-- Card Details Modal -->
    <rs-modal v-model="showModal" title="Maklumat Terperinci" size="md" position="center">
      <template #body>
        <div v-if="selectedCard" class="space-y-4">
          <div class="flex items-center gap-4">
            <div class="p-3 rounded-lg" :class="selectedCard.iconBg">
              <Icon :name="selectedCard.icon" size="32" :class="selectedCard.iconColor" />
            </div>
            <div>
              <h3 class="text-xl font-semibold text-gray-900">{{ selectedCard.title }}</h3>
              <p class="text-2xl font-bold text-primary">{{ selectedCard.value }}</p>
            </div>
          </div>
          <div class="bg-gray-50 p-4 rounded-lg">
            <p class="text-sm text-gray-700 whitespace-pre-line">{{ selectedCard.details }}</p>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-center">
          <rs-button variant="primary-outline" @click="closeModal">
            Tutup
          </rs-button>
        </div>
      </template>
    </rs-modal>

    <!-- Kad Tauliah Modal -->
    <rs-modal v-model="showKadTauliah" title="Kad Tauliah Digital" size="md" position="center">
      <template #body>
        <div class="flex justify-center p-4">
          <div class="bg-gradient-to-br from-primary/10 to-white rounded-xl shadow-lg p-4 w-full max-w-sm border border-primary/30 relative overflow-hidden">
            <!-- Header Strip -->
            <div class="bg-primary h-3 w-full -mx-4 -mt-4 mb-4"></div>
            
            <!-- Logo Section -->
            <div class="flex justify-between items-center mb-4">
              <img src="https://www.zakatselangor.com.my/wp-content/uploads/2018/10/lzs-logo.png" alt="LZS" class="h-8" />
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPSu8_4ST1QlO2uMoJFrGcLEJpy7dBh0E0BQ&s" alt="Penolong Amil" class="h-8" />
            </div>
            
            <!-- Profile Section -->
            <div class="flex flex-col items-center mb-4">
              <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Profile" class="w-24 h-24 rounded-full border-4 border-primary/20 mb-3 shadow-md" />
              <div class="text-center space-y-1">
                <div class="font-bold text-sm text-gray-800">MOHD SHAHBAN BIN MOHD NORDIN</div>
                <div class="text-xs text-gray-600 font-semibold">880429-10-5605</div>
                <div class="text-xs text-primary font-semibold">MTWT03</div>
                <div class="text-xs text-gray-600 font-medium">MAAHAD AL-TAHZIB WA AL-TAALIM</div>
                <div class="text-xs text-gray-600">1 JANUARI 2022 - 31 DISEMBER 2027</div>
              </div>
            </div>
            
            <!-- QR Code -->
            <div class="flex justify-center mb-4">
              <div class="w-20 h-20 bg-white border border-gray-300 flex items-center justify-center rounded shadow-sm">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=MTWT03-880429105605" alt="QR Code" class="w-16 h-16" />
              </div>
            </div>
            
            <!-- Footer Strip -->
            <div class="bg-primary h-3 w-full -mx-4 -mb-4 mt-4"></div>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-center gap-3">
          <rs-button variant="success-outline" @click="downloadKadTauliah">
            <Icon name="heroicons:arrow-down-tray" size="16" class="mr-2" />
            Muat Turun
          </rs-button>
          <rs-button variant="primary-outline" @click="showKadTauliah = false">
            Tutup
          </rs-button>
        </div>
      </template>
    </rs-modal>

    <!-- Surat Tawaran Modal -->
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
              <div class="font-semibold">Mohd Shahban bin Mohd Nordin</div>
              <div>880429-10-5605</div>
              <div>MAAHAD AL-TAHZIB WA AL-TAALIM</div>
              <div>Selangor</div>
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
                <span class="text-gray-900">LZS/PA/2022/MTWT03</span>
              </div>
              <div class="text-sm">
                <span class="font-semibold text-gray-700">Tarikh:</span>
                <span class="text-gray-900">01 Januari 2022</span>
              </div>
              <div class="text-sm">
                <span class="font-semibold text-gray-700">Tempoh Perkhidmatan:</span>
                <span class="text-gray-900">1 Januari 2022 - 31 Disember 2027</span>
              </div>
              <div class="text-sm">
                <span class="font-semibold text-gray-700">Kategori:</span>
                <span class="text-gray-900">Penolong Amil</span>
              </div>
            </div>

            <div class="bg-primary/5 p-4 rounded-lg">
              <h3 class="font-semibold text-gray-900 mb-3">Maklumat Penolong Amil:</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div><span class="font-semibold">Nama:</span> Mohd Shahban bin Mohd Nordin</div>
                <div><span class="font-semibold">No. Kad Pengenalan:</span> 880429-10-5605</div>
                <div><span class="font-semibold">Kod:</span> MTWT03</div>
                <div><span class="font-semibold">Institusi:</span> Maahad Al-Tahzib wa Al-Taalim</div>
              </div>
            </div>

            <div class="text-sm leading-relaxed space-y-4">
              <p>Tuan/Puan,</p>
              <p>Dengan segala hormatnya perkara di atas adalah dirujuk.</p>
              <p>
                Sukacita dimaklumkan bahawa tuan telah dilantik sebagai 
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
          <rs-button variant="success-outline" @click="downloadSuratTawaran">
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
import { ref } from 'vue'

// Page metadata
definePageMeta({
  title: 'Dashboard Penolong Amil'
})

// Breadcrumb navigation
const breadcrumb = ref([
  {
    name: 'Dashboard',
    type: 'current'
  }
])

// Statistics cards data
const cards = ref([
  {
    title: 'Asnaf Berdaftar',
    value: '150',
    icon: 'heroicons:users',
    description: '+10% dari bulan lepas',
    details: 'Senarai asnaf yang telah berdaftar di bawah jagaan anda.\n\nContoh:\n- Ahmad bin Ali (Fakir)\n- Siti binti Abu (Miskin)\n- Fatimah binti Hassan (Miskin)',
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
    changeBadge: 'bg-success/10 text-success',
    changeText: '+10%'
  },
  {
    title: 'Bantuan',
    value: '75',
    icon: 'heroicons:hand-raised',
    description: '5 permohonan menunggu kelulusan',
    details: 'Permohonan bantuan yang sedang diproses atau telah diluluskan.\n\nContoh:\n- Bantuan Kewangan Bulanan\n- Bantuan Pendidikan\n- Bantuan Perubatan',
    iconBg: 'bg-warning/10',
    iconColor: 'text-warning',
    changeBadge: 'bg-warning/10 text-warning',
    changeText: '5 Menunggu'
  },
  {
    title: 'Tugasan',
    value: '50',
    icon: 'heroicons:calendar-days',
    description: '+3 aktiviti baru',
    details: 'Maklumat tambahan atau statistik lain yang relevan untuk Penolong Amil.\n\nContoh:\n- Aktiviti komuniti\n- Program latihan\n- Kempen kesedaran',
    iconBg: 'bg-success/10',
    iconColor: 'text-success',
    changeBadge: 'bg-success/10 text-success',
    changeText: '+3 Baru'
  },
  {
    title: 'Insentif',
    value: '25',
    icon: 'heroicons:bell-alert',
    description: '1 notis perlu tindakan segera',
    details: 'Laporan ringkas berkaitan tugasan anda.\n\nContoh:\n- Notis mesyuarat\n- Pengumuman terkini\n- Peringatan deadline',
    iconBg: 'bg-danger/10',
    iconColor: 'text-danger',
    changeBadge: 'bg-danger/10 text-danger',
    changeText: '1 Segera'
  }
])

// Modal states
const showModal = ref(false)
const selectedCard = ref(null)
const showKadTauliah = ref(false)
const showSuratTawaran = ref(false)

// Methods
const openCardModal = (card) => {
  selectedCard.value = card
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedCard.value = null
}

const navigateTo = (path) => {
  window.location.href = path
}

const downloadKadTauliah = () => {
  alert('Kad Tauliah Digital sedang dimuat turun...')
  // Implementation for PDF/image download would go here
}

const downloadSuratTawaran = () => {
  alert('Surat Tawaran sedang dimuat turun...')
  // Implementation for PDF download would go here
}
</script>

<style scoped>
/* Custom styles if needed */
</style> 