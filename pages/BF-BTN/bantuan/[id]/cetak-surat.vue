<!-- 
  RTMF SCREEN: BTN-Bantuan-Cetak-Surat
  PURPOSE: Paparan surat kelulusan bantuan untuk dicetak
  DESCRIPTION: Print letter screen for aid approval with proper formatting and table
  ROUTE: /BF-BTN/bantuan/[id]/cetak-surat
-->
<template>
  <div>
    <!-- Print Header - Only visible when printing -->
    <div class="print-only mb-6">
      <div class="flex justify-between items-center">
        <h1 class="text-xl font-bold text-gray-900">
          Surat Kelulusan Bantuan
        </h1>
        <div class="text-sm text-gray-600">
          {{ formatDate(new Date()) }}
        </div>
      </div>
    </div>

    <!-- Screen Header - Hidden when printing -->
    <div class="no-print mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 flex items-center">
            <Icon name="ph:printer" class="w-6 h-6 mr-3 text-primary" />
            Cetak Surat Kelulusan
          </h1>
          <p class="text-gray-600 mt-1">Surat kelulusan bantuan untuk {{ applicantInfo.namaPenuh }}</p>
        </div>
        <div class="flex gap-2">
          <rs-button
            variant="primary"
            @click="handlePrint"
          >
            <Icon name="ph:printer" class="w-4 h-4 mr-1" />
            Cetak Surat
          </rs-button>
          <rs-button
            variant="secondary-outline"
            @click="handleBack"
          >
            <Icon name="ph:arrow-left" class="w-4 h-4 mr-1" />
            Kembali
          </rs-button>
        </div>
      </div>
    </div>

    <!-- Letter Content -->
    <div class="letter-container bg-white p-8 shadow-lg">
      <!-- Letter Header (Retrieved from Profile) -->
      <div class="letter-header mb-8">
        <div class="text-center mb-6">
          <img 
            src="assets/img/logo/lzs-logo-main.png" 
            alt="MAIS Logo" 
            class="h-16 mx-auto mb-4"
          />
          <h2 class="text-lg font-bold text-gray-900">
            LEMBAGA ZAKAT SELANGOR (MAIS)
          </h2>
          <p class="text-sm text-gray-600">
            {{ profileInfo.alamatPejabat }}
          </p>
          <p class="text-sm text-gray-600">
            Tel: {{ profileInfo.noTelefon }} | Email: {{ profileInfo.emel }}
          </p>
        </div>
      </div>

      <!-- Letter Introduction (Retrieved from Template) -->
      <div class="letter-intro mb-8">
        <div class="mb-4">
          <p class="text-gray-900">
            <strong>Tuan / Puan,</strong>
          </p>
        </div>
        
        <div class="mb-4">
          <h3 class="text-lg font-bold text-gray-900 mb-2">
            MAKLUM BALAS PERMOHONAN BANTUAN ZAKAT DI LEMBAGA ZAKAT SELANGOR (MAIS)
          </h3>
        </div>
        
        <div class="mb-6 text-justify">
          <p class="text-gray-900 leading-relaxed">
            Semoga surat ini menemui tuan / puan di dalam kemanisan iman serta memperoleh keberkatan dan kerahmatan daripada Allah S.W.T., In Shaa Allah.
          </p>
        </div>
        
        <div class="mb-6 text-justify">
          <p class="text-gray-900 leading-relaxed">
            Sukacita dimaklumkan bahawa Lembaga Zakat Selangor (MAIS) telah <strong>MELULUSKAN</strong> permohonan bantuan zakat seperti berikut.
          </p>
        </div>
      </div>

      <!-- Information Table -->
      <div class="letter-table mb-8">
        <table class="w-full border-collapse border border-gray-300">
          <thead>
            <tr class="bg-gray-50">
              <th class="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900 w-16">
                No
              </th>
              <th class="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900 w-48">
                Perkara
              </th>
              <th class="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">
                Butir-butir
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="border border-gray-300 px-4 py-3 text-center font-medium">1</td>
              <td class="border border-gray-300 px-4 py-3 font-medium">No. Bantuan</td>
              <td class="border border-gray-300 px-4 py-3">{{ aidInfo.noBantuan }}</td>
            </tr>
            <tr>
              <td class="border border-gray-300 px-4 py-3 text-center font-medium">2</td>
              <td class="border border-gray-300 px-4 py-3 font-medium">Nama Penerima</td>
              <td class="border border-gray-300 px-4 py-3">{{ aidInfo.namaPenerima }}</td>
            </tr>
            <tr>
              <td class="border border-gray-300 px-4 py-3 text-center font-medium">3</td>
              <td class="border border-gray-300 px-4 py-3 font-medium">No KP Penerima</td>
              <td class="border border-gray-300 px-4 py-3">{{ aidInfo.noKpPenerima }}</td>
            </tr>
            <tr>
              <td class="border border-gray-300 px-4 py-3 text-center font-medium">4</td>
              <td class="border border-gray-300 px-4 py-3 font-medium">Jenis / Item Bantuan</td>
              <td class="border border-gray-300 px-4 py-3">{{ aidInfo.jenisBantuan }}</td>
            </tr>
            <tr v-if="aidInfo.namaVendor">
              <td class="border border-gray-300 px-4 py-3 text-center font-medium">5</td>
              <td class="border border-gray-300 px-4 py-3 font-medium">Nama Vendor (jika ada)</td>
              <td class="border border-gray-300 px-4 py-3">{{ aidInfo.namaVendor }}</td>
            </tr>
            <tr>
              <td class="border border-gray-300 px-4 py-3 text-center font-medium">{{ aidInfo.namaVendor ? '6' : '5' }}</td>
              <td class="border border-gray-300 px-4 py-3 font-medium">Jenis / Item Bantuan</td>
              <td class="border border-gray-300 px-4 py-3">{{ aidInfo.itemBantuan }}</td>
            </tr>
            <tr>
              <td class="border border-gray-300 px-4 py-3 text-center font-medium">{{ aidInfo.namaVendor ? '7' : '6' }}</td>
              <td class="border border-gray-300 px-4 py-3 font-medium">Jumlah Bantuan Keseluruhan</td>
              <td class="border border-gray-300 px-4 py-3 font-semibold">RM {{ aidInfo.jumlahBantuanKeseluruhan }}</td>
            </tr>
            <tr>
              <td class="border border-gray-300 px-4 py-3 text-center font-medium">{{ aidInfo.namaVendor ? '8' : '7' }}</td>
              <td class="border border-gray-300 px-4 py-3 font-medium">Tempoh</td>
              <td class="border border-gray-300 px-4 py-3">{{ aidInfo.tempoh }}</td>
            </tr>
            <tr>
              <td class="border border-gray-300 px-4 py-3 text-center font-medium">{{ aidInfo.namaVendor ? '9' : '8' }}</td>
              <td class="border border-gray-300 px-4 py-3 font-medium">Kaedah Penyaluran Bantuan</td>
              <td class="border border-gray-300 px-4 py-3">{{ aidInfo.kaedahPenyaluran }}</td>
            </tr>
            <tr v-if="aidInfo.melibatkanTuntutan">
              <td class="border border-gray-300 px-4 py-3 text-center font-medium">{{ aidInfo.namaVendor ? '10' : '9' }}</td>
              <td class="border border-gray-300 px-4 py-3 font-medium">Dokumen-dokumen Tuntutan Pembayaran</td>
              <td class="border border-gray-300 px-4 py-3">
                <p class="mb-2">(Sila lampirkan sewaktu tuntutan)</p>
                <ul class="list-disc list-inside space-y-1">
                  <li v-for="doc in aidInfo.dokumenTuntutan" :key="doc">{{ doc }}</li>
                </ul>
              </td>
            </tr>
            <tr>
              <td class="border border-gray-300 px-4 py-3 text-center font-medium">{{ getLastRowNumber() }}</td>
              <td class="border border-gray-300 px-4 py-3 font-medium">Maklumat Penting</td>
              <td class="border border-gray-300 px-4 py-3">
                <ul class="list-disc list-inside space-y-1">
                  <li v-for="info in aidInfo.maklumatPenting" :key="info">{{ info }}</li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Letter Footer -->
      <div class="letter-footer mt-12">
        <div class="text-right">
          <p class="text-gray-900 mb-4">
            Sekian, terima kasih.
          </p>
          <div class="mt-8">
            <p class="text-gray-900 font-semibold">
              Yang benar,
            </p>
            <div class="mt-8">
              <p class="text-gray-900 font-semibold">
                {{ profileInfo.namaPengarah }}
              </p>
              <p class="text-gray-900">
                {{ profileInfo.jawatanPengarah }}
              </p>
              <p class="text-gray-900">
                Lembaga Zakat Selangor (MAIS)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Page meta
definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

// Route params
const route = useRoute()
const aidId = route.params.id

// Sample data - replace with actual API calls
const profileInfo = ref({
  alamatPejabat: 'Tingkat 1, Wisma MAIS, No. 1, Jalan SS 6/2, 47301 Petaling Jaya, Selangor',
  noTelefon: '03-7954 2000',
  emel: 'info@mais.gov.my',
  namaPengarah: 'Dato\' Haji Mohd Shahir bin Haji Mohd Zain',
  jawatanPengarah: 'Ketua Pegawai Eksekutif'
})

const applicantInfo = ref({
  namaPenuh: 'Ahmad bin Abdullah',
  noKadPengenalan: '800101-01-1234'
})

const aidInfo = ref({
  noBantuan: 'B-2024-001234',
  namaPenerima: 'Ahmad bin Abdullah',
  noKpPenerima: '800101-01-1234',
  jenisBantuan: 'Bantuan Kewangan Bulanan',
  namaVendor: null, // Set to null if no vendor
  itemBantuan: 'Bantuan RM 500/bulan untuk keperluan asas keluarga',
  jumlahBantuanKeseluruhan: '6,000.00',
  tempoh: '12 bulan (Januari 2024 - Disember 2024)',
  kaedahPenyaluran: 'Pemindahan Bank - Maybank Akaun: 1234567890',
  melibatkanTuntutan: true,
  dokumenTuntutan: [
    'Salinan Kad Pengenalan',
    'Salinan Buku Bank',
    'Resit pembelian (jika ada)',
    'Dokumen sokongan lain yang berkaitan'
  ],
  maklumatPenting: [
    'Bantuan ini adalah berdasarkan kelayakan yang telah ditetapkan oleh Lembaga Zakat Selangor (MAIS)',
    'Penerima bertanggungjawab untuk menggunakan bantuan ini dengan sebaik-baiknya',
    'Sebarang perubahan maklumat hendaklah dimaklumkan kepada MAIS dengan segera',
    'Bantuan ini tertakluk kepada terma dan syarat yang telah ditetapkan'
  ]
})

// Utility functions
const formatDate = (date) => {
  if (!date) return '-'
  const d = new Date(date)
  return d.toLocaleDateString('ms-MY', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getLastRowNumber = () => {
  let baseNumber = 9 // Base number without vendor
  if (aidInfo.value.namaVendor) baseNumber = 10 // With vendor
  if (aidInfo.value.melibatkanTuntutan) baseNumber += 1 // With claim documents
  return baseNumber
}

// Event handlers
const handleBack = () => {
  navigateTo(`/BF-BTN/bantuan/${aidId}`)
}

const handlePrint = () => {
  window.print()
}

// Fetch data on mount
onMounted(async () => {
  try {
    // Replace with actual API calls
    // const response = await $fetch(`/api/bantuan/${aidId}/cetak-surat`)
    // profileInfo.value = response.profileInfo
    // applicantInfo.value = response.applicantInfo
    // aidInfo.value = response.aidInfo
  } catch (error) {
    console.error('Error fetching letter data:', error)
  }
})
</script>

<style lang="scss" scoped>
/* Print Styles */
@media print {
  .no-print {
    display: none !important;
  }
  
  .print-only {
    display: block !important;
  }
  
  .letter-container {
    box-shadow: none !important;
    padding: 0 !important;
    margin: 0 !important;
  }
  
  body {
    font-size: 12pt;
    line-height: 1.4;
  }
  
  h1, h2, h3 {
    page-break-after: avoid;
  }
  
  table {
    page-break-inside: avoid;
  }
  
  .letter-table {
    page-break-inside: avoid;
  }
}

/* Screen Styles */
.print-only {
  display: none;
}

.letter-container {
  max-width: 800px;
  margin: 0 auto;
  min-height: 100vh;
}

.letter-header {
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 2rem;
}

.letter-intro {
  line-height: 1.8;
}

.letter-table {
  table {
    font-size: 14px;
  }
  
  th, td {
    vertical-align: top;
  }
  
  td:first-child {
    text-align: center;
    font-weight: 600;
  }
}

.letter-footer {
  border-top: 2px solid #e5e7eb;
  padding-top: 2rem;
}
</style>