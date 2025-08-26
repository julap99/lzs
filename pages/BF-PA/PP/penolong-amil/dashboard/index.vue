<!-- 
  RTMF SCREEN: PA-PP-PD-09_02
  PURPOSE: Penolong Amil Dashboard - Dashboard untuk Penolong Amil Kariah (PAK) yang telah menerima tawaran
  DESCRIPTION: Dashboard utama untuk Penolong Amil Kariah yang fokus pada aktiviti agihan
  ROUTE: /BF-PA/PP/penolong-amil/dashboard
-->
<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Welcome Header -->
    <rs-card class="mb-6 bg-gradient-to-r from-primary/5 to-secondary/5 border-l-4 border-primary">
      <template #body>
        <div class="text-center py-6">
          <h1 class="text-3xl font-bold text-primary mb-2">Selamat Datang ke Dashboard Penolong Amil</h1>
          <p class="text-xl text-gray-700 mb-3">اَلسَلامُ عَلَيْكُم وَرَحْمَةُ اَللهِ وَبَرَكاتُهُ‎</p>
          <p class="text-lg text-gray-600">Selamat menjalankan amanah agihan zakat kepada asnaf</p>
        </div>
      </template>
    </rs-card>

         <!-- User Profile Card -->
     <rs-card class="mb-6">
       <template #body>
         <div class="flex items-center justify-between p-4">
           <div class="flex items-center gap-4">
             <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-lg">
               {{ userProfile.nama.charAt(0) }}
             </div>
                           <div>
                <h2 class="text-lg font-semibold text-gray-900">{{ userProfile.nama }}</h2>
                <p class="text-sm text-gray-600">{{ userProfile.kategori }}</p>
                <p class="text-xs text-success font-medium">Status: {{ userProfile.status }}</p>
                <p class="text-xs text-primary font-medium">Kariah: {{ userProfile.kariah }}</p>
                <p class="text-xs text-info font-medium">Kategori: {{ getKategoriDisplayNames.join(', ') }}</p>
              </div>
           </div>
                       <div class="flex gap-2">
              <rs-button size="sm" variant="primary-outline" @click="showKadTauliah = true" title="Kad Tauliah">
                <Icon name="heroicons:identification" size="16" class="mr-2" />
                Kad Tauliah
              </rs-button>
              <rs-button size="sm" variant="primary-outline" @click="showSuratTawaran = true" title="Surat Tawaran">
                <Icon name="heroicons:document-text" size="16" class="mr-2" />
                Surat Tawaran
              </rs-button>
            </div>
         </div>
       </template>
     </rs-card>

    <!-- PAK Quick Stats - Focus on Agihan -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <rs-card>
        <template #body>
          <div class="text-center">
            <div class="text-2xl font-bold text-primary">{{ stats.totalAgihan }}</div>
            <div class="text-sm text-gray-600">Jumlah Agihan</div>
            <div class="text-xs text-success mt-1">Bulan Ini</div>
          </div>
        </template>
      </rs-card>
      
      <rs-card>
        <template #body>
          <div class="text-center">
            <div class="text-2xl font-bold text-success">{{ stats.asnafDibantu }}</div>
            <div class="text-sm text-gray-600">Asnaf Dibantu</div>
            <div class="text-xs text-info mt-1">Aktif</div>
          </div>
        </template>
      </rs-card>
      
      <rs-card>
        <template #body>
          <div class="text-center">
            <div class="text-2xl font-bold text-warning">{{ stats.tugasanTertunda }}</div>
            <div class="text-sm text-gray-600">Tugasan Agihan</div>
            <div class="text-xs text-warning mt-1">Tertunda</div>
          </div>
        </template>
      </rs-card>
      
      <rs-card>
        <template #body>
          <div class="text-center">
            <div class="text-2xl font-bold text-info">{{ stats.prestasiAgihan }}</div>
            <div class="text-sm text-gray-600">Prestasi Agihan</div>
            <div class="text-xs text-success mt-1">Cemerlang</div>
          </div>
        </template>
      </rs-card>
    </div>

    <!-- Senarai Tugasan Table -->
    <rs-card class="mb-6">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900">Senarai Tugasan</h3>
        </div>
      </template>
      <template #body>
        <rs-table
          class="mt-4"
          :key="filteredAduanData"
          :data="filteredAduanData"
          :columns="aduanColumns"
          :pageSize="5"
          :showNoColumn="true"
          :options="{
            variant: 'default',
            hover: true,
          }"
        >
          <template v-slot:status="{ text }">
            <rs-badge :variant="getStatusVariant(text)" size="sm">
              {{ text }}
            </rs-badge>
          </template>
          <template v-slot:tarikhAduan="{ text }">
            <span class="font-medium">{{ formatDate(text) }}</span>
          </template>
          <template v-slot:aksi="{ value }">
            <div class="flex gap-3">
              <button
                @click="viewAduan(value.noRujukan)"
                title="Lihat"
                class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <Icon name="ic:baseline-visibility" size="20" class="text-secondary" />
              </button>
              <button
                v-if="!isStatusFinal(value.status)"
                @click="handleAduan(value.noRujukan)"
                title="Semak"
                class="flex items-center justify-center w-8 h-8 p-0 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <Icon name="ic:baseline-chevron-right" size="20" class="text-primary" />
              </button>
            </div>
          </template>
        </rs-table>
      </template>
    </rs-card>

   

    <!-- Profile Modal -->
    <rs-modal v-model="showProfile" title="Profil Penolong Amil">
      <template #body>
        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nama Penuh</label>
              <p class="text-gray-900">{{ userProfile.nama }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">No. KP</label>
              <p class="text-gray-900">{{ userProfile.noKP }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Emel</label>
              <p class="text-gray-900">{{ userProfile.emel }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
              <p class="text-gray-900">{{ userProfile.telefon }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
              <p class="text-gray-900">{{ userProfile.kategori }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Kariah</label>
              <p class="text-gray-900">{{ userProfile.kariah }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Institusi</label>
              <p class="text-gray-900">{{ userProfile.institusi }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tarikh Lantikan</label>
              <p class="text-gray-900">{{ userProfile.tarikhLantikan }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <rs-badge variant="success">{{ userProfile.status }}</rs-badge>
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <rs-button variant="secondary-outline" @click="showProfile = false">
            Tutup
          </rs-button>
          <rs-button variant="primary" @click="navigateTo('/BF-PA/PP/pra-daftar-v3/profile/edit')">
            Kemaskini Profil
          </rs-button>
        </div>
      </template>
    </rs-modal>

    <!-- Kad Tauliah Modal -->
    <rs-modal v-model="showKadTauliah" :title="`Kad Tauliah Penolong Amil - ${getKategoriDisplayNames.join(', ')}`" size="xl" position="center">
      <template #body>
        <div class="space-y-6">
          <!-- Kad Tauliah Image Display -->
          <div class="text-center">
            <div class="mb-4">
              <!-- <rs-badge variant="primary" size="lg">
                Kategori: {{ getKategoriDisplayNames.join(', ') }}
              </rs-badge> -->
            </div>
            
            <!-- Select All option for multiple images -->
            <div v-if="kadTauliahImages.length > 1" class="mb-4 p-3 bg-gray-50 rounded-lg border">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-700">Pilih Semua Kad Tauliah:</span>
                <div class="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="select-all"
                    v-model="selectAllKadTauliah"
                    @change="toggleSelectAll"
                    class="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2"
                  />
                  <label for="select-all" class="text-sm font-medium text-gray-700">
                    {{ selectAllKadTauliah ? 'Hapus Semua' : 'Pilih Semua' }}
                  </label>
                </div>
              </div>
            </div>
            
            <!-- Display multiple images if multiple kategori selected -->
            <div v-if="kadTauliahImages.length > 1" class="space-y-6">
              <div 
                v-for="(image, index) in kadTauliahImages" 
                :key="index"
                class="border-b border-gray-200 pb-6 last:border-b-0"
              >
                <div class="flex items-center justify-between mb-3">
                  <rs-badge variant="primary" size="lg">
                    Kad Tauliah {{ getKategoriDisplayNames[index] }}
                  </rs-badge>
                  <div class="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      :id="`kad-${index}`"
                      v-model="selectedKadTauliah[index]"
                      class="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2"
                    />
                    <label :for="`kad-${index}`" class="text-sm font-medium text-gray-700">
                      Pilih untuk muat turun
                    </label>
                  </div>
                </div>
                <img 
                  :src="image" 
                  :alt="`Kad Tauliah ${getKategoriDisplayNames[index]}`" 
                  class="max-w-full h-auto mx-auto rounded-lg shadow-lg border-2 border-primary/20"
                  style="max-height: 400px;"
                />
              </div>
            </div>
            
            <!-- Display single image if only one kategori selected -->
            <div v-else>
              <div class="flex items-center justify-between mb-3">
                <rs-badge variant="primary" size="lg">
                  Kad Tauliah {{ getKategoriDisplayName }}
                </rs-badge>
                <div class="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="kad-single"
                    v-model="selectedKadTauliah[0]"
                    class="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2"
                  />
                  <label for="kad-single" class="text-sm font-medium text-gray-700">
                    Pilih untuk muat turun
                  </label>
                </div>
              </div>
              <img 
                :src="kadTauliahImage" 
                :alt="`Kad Tauliah ${getKategoriDisplayName}`" 
                class="max-w-full h-auto mx-auto rounded-lg shadow-lg border-2 border-primary/20"
                style="max-height: 500px;"
              />
            </div>
          </div>
          
          <!-- Selection Summary -->
          <div v-if="kadTauliahImages.length > 1" class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div class="flex items-center justify-between">
              <div class="text-sm text-blue-800">
                <span class="font-medium">Kad Tauliah yang dipilih:</span>
                <span class="ml-2">{{ getSelectedKadTauliahCount }} daripada {{ kadTauliahImages.length }}</span>
              </div>
              <div class="text-xs text-blue-600">
                Setiap kad tauliah akan dimuat turun sebagai fail berasingan
              </div>
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <rs-button variant="secondary-outline" @click="showKadTauliah = false">
            Tutup
          </rs-button>
          <rs-button 
            variant="primary" 
            @click="downloadKadTauliah"
            :disabled="getSelectedKadTauliahCount === 0"
          >
            <Icon name="ic:baseline-download" class="w-4 h-4 mr-2" />
            Muat Turun {{ getSelectedKadTauliahCount > 0 ? `(${getSelectedKadTauliahCount})` : '' }}
          </rs-button>
        </div>
      </template>
    </rs-modal>

         <!-- Surat Tawaran Modal -->
     <rs-modal v-model="showSuratTawaran" title="Surat Tawaran Pelantikan" size="xl" position="center">
       <template #body> 
         <div class="space-y-6 font-serif text-sm leading-relaxed">
           <!-- Letter Header -->
           <div class="mb-6">
             <!-- LZS Logo and Lembaga Zakat Information -->
             <div class="flex justify-between items-start mb-4">
               <!-- LZS Logo on the left -->
               <div class="flex-shrink-0">
                 <img src="https://www.zakatselangor.com.my/wp-content/uploads/2018/10/lzs-logo.png" alt="LZS" class="h-16" />
               </div>
               
               <!-- Lembaga Zakat Information on the right -->
               <div class="text-right space-y-2">
                 <!-- Organization Name and Address -->
                 <div class="space-y-1">
                   <div class="font-bold text-base">Lembaga Zakat Selangor (MAIS)</div>
                   <div class="text-sm">Menara Zakat Sultan Idris Shah,</div>
                   <div class="text-sm">No. 1, Persiaran Bandar Raya, Seksyen 14,</div>
                   <div class="text-sm">40000 Shah Alam, Selangor Darul Ehsan.</div>
                 </div>
                 
                 <!-- Contact Details -->
                 <div class="text-sm space-y-1">
                   <div>Tel: +603 8314 2222</div>
                   <div>Faks: +603 8314 2233/2244</div>
                 </div>
               </div>
             </div>
             
             <!-- Reference and Date - Separate left side section -->
             <div class="text-left space-y-1">
               <div class="text-sm">
                 <span class="font-semibold">Rujukan kami: </span>
                 <span class="font-semibold">LZS/DOAA/JPPA/T/600/PELANTIKAN PA Bil (413/2025)</span>
               </div>
               <div class="text-sm">
                 <span class="font-semibold">Tarikh: </span>
                 <span class="font-semibold">06 Jun 2025</span>
               </div>
               <div class="text-sm">
                 <span class="font-semibold">09 Zulhijjah 1446H</span>
               </div>
             </div>
           </div>

           <!-- Title -->
           <div class="text-center my-8">
             <h2 class="text-xl font-bold uppercase tracking-wider">SURAT TAWARAN PELANTIKAN</h2>
           </div>

           <!-- Recipient Address -->
           <div class="space-y-1">
             <p class="font-bold text-lg">{{ userProfile.nama }}</p>
             <p>No.8, Jalan Gp 3/4</p>
             <p>Taman Gombak Permai</p>
             <p>68100 Batu Caves</p>
             <p>SELANGOR DARUL EHSAN.</p>
           </div>

           <!-- Greeting -->
           <div class="my-6">
             <p class="font-semibold">Tuan,</p>
           </div>

           <!-- Subject -->
           <div class="my-6">
             <p class="font-bold text-lg">PELANTIKAN SEBAGAI KETUA PENOLONG AMIL KARIAH LEMBAGA ZAKAT SELANGOR (MAIS) SESI 2025</p>
             <div class="border-b-2 border-gray-400 mt-2"></div>
           </div>

           <!-- Islamic Greeting -->
           <div class="text-center my-6">
             <p class="text-lg font-semibold ">السلام عليكم ورحمة الله وبركاته</p>
           </div>

           <!-- Opening -->
           <div class="my-4">
             <p>Semoga surat ini menemui tuan dalam kemanisan iman serta mendapat keberkatan dan kerahmatan daripada Allah S.W.T., In Shaa Allah.</p>
           </div>

           <!-- Paragraph 2 -->
           <div class="my-4">
             <p class="mb-2">2. Sukacita dimaklumkan bahawa Pemegang Amanah Lembaga Zakat Selangor (MAIS), Berdaftar (selepas ini dirujuk sebagai "LZS") bersetuju melantik pihak tuan sebagai Ketua Penolong Amil Kariah sebagaimana maklumat yang dinyatakan di dalam Butiran Pelantikan. Terma dan syarat pelantikan adalah sebagaimana Terma dan Syarat Umum Pelantikan dan Panduan Pengurusan Penolong Amil Kariah dan Komuniti yang dilampirkan. Surat Tawaran Pelantikan ini hendaklah menjadi kontrak mengikat sah di antara LZS dan pihak tuan.</p>
           </div>

           <!-- Paragraph 3 -->
           <div class="my-4">
             <p class="mb-2">3. Sekiranya pihak tuan bersetuju dengan semua terma dan syarat yang dinyatakan di dalam Surat Tawaran Pelantikan ini, pihak tuan dikehendaki mengisi dan mengembalikan Borang Setuju Terima dalam tempoh empat belas (14) hari bekerja dari tarikh penerimaan Surat Tawaran Pelantikan ini. LZS menganggap pihak tuan tidak berminat untuk menerima tawaran di atas sekiranya tiada sebarang jawapan diberikan dalam tempoh tiga puluh (30) bekerja daripada tarikh Surat Tawaran Pelantikan ini.</p>
           </div>

           <!-- Paragraph 4 -->
           <div class="my-4">
             <p class="mb-2">4. Segala kerjasama daripada pihak tuan amat dihargai dan didahului dengan ucapan ribuan terima kasih. Diharapkan agar pihak tuan dapat menjalankan tugas dan tanggungjawab dengan baik dan amanah serta mematuhi terma-terma dan syarat-syarat yang ditetapkan oleh LZS.</p>
           </div>

           <!-- Paragraph 5 -->
           <div class="my-4">
             <p class="mb-2">5. Sebarang pertanyaan mengenai perkara di atas pihak tuan boleh menghubungi Talian Zakat Selangor 1-300-88-4343.</p>
           </div>

           <!-- Closing -->
           <div class="my-6">
             <p>Sekian.</p>
           </div>

           <!-- Signature Section -->
           <div class="mt-12">
             <div class="text-left">
               <p class=" mb-8">Yang benar,</p>
               <p class="font-bold text-lg mb-2">PEMEGANG AMANAH</p>
               <p class="font-bold text-lg mb-2">LEMBAGA ZAKAT SELANGOR (MAIS), BERDAFTAR</p>
               <p class="font-bold text-lg mb-8">MD YUSMIZAN BIN YUSUF</p>
               <p class="font-semibold">Timbalan Ketua Divisyen Operasi Agihan Asnaf</p>
             </div>
           </div>

           
         </div>
       </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <rs-button variant="secondary-outline" @click="showSuratTawaran = false">
            Tutup
          </rs-button>
          <rs-button variant="primary" @click="downloadSuratTawaran">
            <Icon name="ic:baseline-download" class="w-4 h-4 mr-2" />
            Muat Turun
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, nextTick } from "vue";

definePageMeta({
  title: "Dashboard Penolong Amil",
  description: "Dashboard utama untuk Penolong Amil yang telah aktif",
});

const breadcrumb = ref([
  {
    name: "Penolong Amil",
    type: "link",
    path: "/BF-PA/PP/PM/01",
  },
  {
    name: "Pra Daftar V3",
    type: "link",
    path: "/BF-PA/PP/pra-daftar-v3",
  },
  {
    name: "Dashboard Penolong Amil",
    type: "current",
    path: "/BF-PA/PP/penolong-amil/dashboard",
  },
]);

// User profile data
const userProfile = ref({
  nama: "Ahmad bin Abdullah",
  noKP: "901231012345",
  emel: "ahmad.abdullah@email.com",
  telefon: "0123456789",
  kategori: "Penolong Amil Kariah (PAK)",
  institusi: "Masjid Wilayah Persekutuan",
  tarikhLantikan: "15-01-2024",
  status: "Aktif",
  kariah: "Kariah A"
});

// Function to get kategori from localStorage and update userProfile
const updateKategoriFromStorage = () => {
  const storedKategori = localStorage.getItem('penolongAmilKategori')
  if (storedKategori) {
    try {
      // Parse the stored kategori (now stored as JSON array)
      const selectedKategori = JSON.parse(storedKategori)
      
      if (Array.isArray(selectedKategori) && selectedKategori.length > 0) {
        // Map the stored kategori to the full kategori names
        const kategoriMapping = {
          'Fitrah': 'Penolong Amil Fitrah (PAF)',
          'Padi': 'Penolong Amil Padi (PAP)',
          'Kariah': 'Penolong Amil Kariah (PAK)',
          'Komuniti': 'Penolong Amil Komuniti (PAK+)'
        }
        
        // Create combined kategori text
        const fullKategoriNames = selectedKategori.map(kat => kategoriMapping[kat]).filter(Boolean)
        if (fullKategoriNames.length > 0) {
          userProfile.value.kategori = fullKategoriNames.join(', ')
          console.log('Kategori loaded from storage:', userProfile.value.kategori)
        }
      }
    } catch (error) {
      console.error('Error parsing stored kategori:', error)
      // Fallback for old format (single kategori)
      const kategoriMapping = {
        'Fitrah': 'Penolong Amil Fitrah (PAF)',
        'Padi': 'Penolong Amil Padi (PAP)',
        'Kariah': 'Penolong Amil Kariah (PAK)',
        'Komuniti': 'Penolong Amil Komuniti (PAK+)'
      }
      
      if (kategoriMapping[storedKategori]) {
        userProfile.value.kategori = kategoriMapping[storedKategori]
        console.log('Kategori loaded from storage (fallback):', userProfile.value.kategori)
      }
    }
  }
};

// Stats data - PAK focused on Agihan
const stats = ref({
  totalAgihan: 120,
  asnafDibantu: 80,
  tugasanTertunda: 5,
  prestasiAgihan: "4.9/5"
});

// Recent agihan activities
const recentAgihanActivities = ref([
  {
    id: 1,
    title: "Agihan Zakat Fitrah",
    description: "Berjaya mengagihkan zakat fitrah kepada 50 asnaf",
    timestamp: "2 jam yang lalu",
    icon: "ic:baseline-favorite",
    status: "Berjaya",
    statusVariant: "success"
  },
  {
    id: 2,
    title: "Laporan Bulanan",
    description: "Menyerahkan laporan agihan bulanan",
    timestamp: "1 hari yang lalu",
    icon: "ic:baseline-bar-chart",
    status: "Selesai",
    statusVariant: "success"
  },
  {
    id: 3,
    title: "Tugasan Baru",
    description: "Menerima tugasan agihan zakat di kawasan baru",
    timestamp: "2 hari yang lalu",
    icon: "ic:baseline-checklist",
    status: "Tertunda",
    statusVariant: "warning"
  },
  {
    id: 4,
    title: "Bancian Asnaf",
    description: "Mengemaskini maklumat asnaf kariah",
    timestamp: "3 hari yang lalu",
    icon: "ic:baseline-assignment",
    status: "Selesai",
    statusVariant: "success"
  }
]);

// Kariah Information
const kariahInfo = ref({
  totalAhli: 150,
  totalAsnaf: 200,
  kawasanAgihan: "Kawasan A, Kawasan B, Kawasan C"
});

// Aduan data for Penolong Amil
const aduanData = ref([
  {
    noRujukan: "ADN-2024-001",
    namaIndividu: "Ahmad bin Ismail",
    tarikhAduan: "2024-03-15",
    status: "Aduan Baru",
    aksi: "Aduan Baru",
  },
  {
    noRujukan: "ADN-2024-002",
    namaIndividu: "Siti binti Hassan",
    tarikhAduan: "2024-03-14",
    status: "Dalam Proses",
    aksi: "Dalam Proses",
  },
  {
    noRujukan: "ADN-2024-003",
    namaIndividu: "Mohamad bin Ali",
    tarikhAduan: "2024-03-13",
    status: "Selesai",
    aksi: "Selesai",
  },
  {
    noRujukan: "ADN-2024-004",
    namaIndividu: "Noraini binti Omar",
    tarikhAduan: "2024-03-12",
    status: "Menunggu Kelulusan",
    aksi: "Menunggu Kelulusan",
  },
  {
    noRujukan: "ADN-2024-005",
    namaIndividu: "Zulkifli bin Rashid",
    tarikhAduan: "2024-03-11",
    status: "Ditutup",
    aksi: "Ditutup",
  },
]);

const filteredAduanData = ref([...aduanData.value]);

// Table columns for Aduan
const aduanColumns = [
  { key: "noRujukan", label: "No. Rujukan", sortable: true },
  { key: "namaIndividu", label: "Nama Individu", sortable: true },
  { key: "tarikhAduan", label: "Tarikh Aduan", sortable: true },
  { key: "status", label: "Status", sortable: true },
  { key: "aksi", label: "Tindakan", sortable: false },
];

const showProfile = ref(false);
const showKadTauliah = ref(false);
const showSuratTawaran = ref(false);

// Reactive array to track which kad tauliah are selected for download
const selectedKadTauliah = ref([]);
const selectAllKadTauliah = ref(false);


const downloadKadTauliah = () => {
  const selectedKadTauliahList = getSelectedKadTauliahList();
  
  if (selectedKadTauliahList.length === 0) {
    alert('Sila pilih sekurang-kurangnya satu Kad Tauliah untuk dimuat turun.');
    return;
  }
  
  // In real implementation, this would generate and download PDFs for each selected kad tauliah
  alert(`Muat turun ${selectedKadTauliahList.length} Kad Tauliah...\n\nKad Tauliah yang dipilih:\n${selectedKadTauliahList.map(item => `- ${item.kategori}`).join('\n')}`);
  
  // Reset selections after download
  resetKadTauliahSelection();
  showKadTauliah.value = false;
};

// Function to get list of selected kad tauliah
const getSelectedKadTauliahList = () => {
  const selectedList = [];
  selectedKadTauliah.value.forEach((isSelected, index) => {
    if (isSelected && kadTauliahImages.value[index]) {
      selectedList.push({
        image: kadTauliahImages.value[index],
        kategori: getKategoriDisplayNames.value[index],
        index: index
      });
    }
  });
  return selectedList;
};

// Function to toggle select all
const toggleSelectAll = () => {
  if (selectAllKadTauliah.value) {
    // Select all
    selectedKadTauliah.value = selectedKadTauliah.value.map(() => true);
  } else {
    // Deselect all
    selectedKadTauliah.value = selectedKadTauliah.value.map(() => false);
  }
};

// Function to reset kad tauliah selection
const resetKadTauliahSelection = () => {
  selectedKadTauliah.value = selectedKadTauliah.value.map(() => false);
  selectAllKadTauliah.value = false;
};

// Function to initialize kad tauliah selection when modal opens
const initializeKadTauliahSelection = () => {
  const imageCount = kadTauliahImages.value.length;
  selectedKadTauliah.value = new Array(imageCount).fill(false);
  selectAllKadTauliah.value = false;
};

const downloadSuratTawaran = () => {
  // In real implementation, this would generate and download PDF
  alert('Muat turun Surat Tawaran...');
  showSuratTawaran.value = false;
};

// Helper functions for Aduan table
const getStatusVariant = (status) => {
  const variants = {
    "Aduan Baru": "warning",
    "Dalam Proses": "primary",
    "Menunggu Kelulusan": "info",
    "Selesai": "success",
    "Ditutup": "danger",
  };
  return variants[status] || "default";
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("ms-MY", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const isStatusFinal = (status) => {
  return ["Ditutup", "Selesai"].includes(status);
};

const viewAduan = (aduanId) => {
  // Navigate to aduan detail view
  navigateTo(`/BF-PA/PP/penolong-amil/aduan/${aduanId}`);
};

const handleAduan = (aduanId) => {
  // Navigate to aduan handling page
  navigateTo(`/BF-PA/PP/penolong-amil/aduan/${aduanId}/urus`);
};

// Computed property to get all kad tauliah images based on selected kategori
const kadTauliahImages = computed(() => {
  const storedKategori = localStorage.getItem('penolongAmilKategori')
  if (!storedKategori) return ['/penolongamil/Kad-tauliah-Kariah.JPG'] // Default
  
  try {
    const selectedKategori = JSON.parse(storedKategori)
    if (Array.isArray(selectedKategori)) {
      return selectedKategori.map(kat => {
        switch (kat) {
          case 'Fitrah':
            return '/penolongamil/Kad-tauliah-Fitrah.JPG'
          case 'Padi':
            return '/penolongamil/Kad-tauliah-Padi.JPG'
          case 'Kariah':
            return '/penolongamil/Kad-tauliah-Kariah.JPG'
          case 'Komuniti':
            return '/penolongamil/Kad-tauliah-Kariah.JPG' // Use Kariah image for Komuniti
          default:
            return '/penolongamil/Kad-tauliah-Kariah.JPG'
        }
      })
    }
  } catch (error) {
    console.error('Error parsing stored kategori:', error)
  }
  
  // Fallback for single kategori (old format)
  const kategori = userProfile.value.kategori.toLowerCase()
  if (kategori.includes('fitrah') || kategori.includes('paf')) {
    return ['/penolongamil/Kad-tauliah-Fitrah.JPG']
  } else if (kategori.includes('padi') || kategori.includes('pap')) {
    return ['/penolongamil/Kad-tauliah-Padi.JPG']
  } else if (kategori.includes('kariah') || kategori.includes('pak')) {
    return ['/penolongamil/Kad-tauliah-Kariah.JPG']
  } else {
    return ['/penolongamil/Kad-tauliah-Kariah.JPG'] // Default
  }
});

// Helper function to get kategori display names
const getKategoriDisplayNames = computed(() => {
  const storedKategori = localStorage.getItem('penolongAmilKategori')
  if (!storedKategori) return ['Kariah'] // Default
  
  try {
    const selectedKategori = JSON.parse(storedKategori)
    if (Array.isArray(selectedKategori)) {
      return selectedKategori
    }
  } catch (error) {
    console.error('Error parsing stored kategori:', error)
  }
  
  // Fallback for single kategori (old format)
  const kategori = userProfile.value.kategori.toLowerCase()
  if (kategori.includes('fitrah') || kategori.includes('paf')) {
    return ['Fitrah']
  } else if (kategori.includes('padi') || kategori.includes('pap')) {
    return ['Padi']
  } else if (kategori.includes('kariah') || kategori.includes('pak')) {
    return ['Kariah']
  } else {
    return ['Kariah'] // Default
  }
});

// Computed property to get the correct kad tauliah image based on kategori (for backward compatibility)
const kadTauliahImage = computed(() => {
  return kadTauliahImages.value[0] || '/penolongamil/Kad-tauliah-Kariah.JPG'
});

// Helper function to get kategori display name (for backward compatibility)
const getKategoriDisplayName = computed(() => {
  return getKategoriDisplayNames.value[0] || 'Kariah'
});

// Computed property to count selected kad tauliah
const getSelectedKadTauliahCount = computed(() => {
  return selectedKadTauliah.value.filter(Boolean).length;
});

// Watch for modal open to initialize selection
watch(showKadTauliah, (newValue) => {
  if (newValue) {
    // Modal is opening, initialize selection
    nextTick(() => {
      initializeKadTauliahSelection();
    });
  }
});

onMounted(() => {
  // In real implementation, fetch user profile and stats
  console.log("Loading Penolong Amil dashboard");
  
  // Load kategori from localStorage
  updateKategoriFromStorage();
  
  // Ensure sidebar is visible by removing menu-hide class
  const vLayout = document.querySelector('.v-layout')
  if (vLayout) {
    vLayout.classList.remove('menu-hide')
  }
  
  // Also ensure menu overlay is not hidden
  const menuOverlay = document.querySelector('.menu-overlay')
  if (menuOverlay) {
    menuOverlay.classList.remove('hide')
  }
});
</script>

