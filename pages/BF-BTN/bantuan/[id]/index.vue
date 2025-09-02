<!-- 
  RTMF SCREEN: BTN-Bantuan-Detail
  PURPOSE: Paparan terperinci maklumat bantuan dengan tab interface
  DESCRIPTION: Detailed view for aid information with tabbed interface for different sections
  ROUTE: /BF-BTN/bantuan/[id]
-->
<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Header Section -->
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 flex items-center">
            <Icon name="ph:hand-heart" class="w-6 h-6 mr-3 text-primary" />
            Maklumat Bantuan
          </h1>
          <p class="text-gray-600 mt-1">Maklumat lengkap bantuan dan agihan</p>
        </div>
        <div class="flex gap-2">
          <rs-button
            variant="info"
            @click="handlePrintLetter"
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

    <!-- Maklumat Pemohon Section -->
    <rs-card class="mb-6">
      <template #header>
        <h3 class="text-lg font-semibold text-gray-900">
          Maklumat Pemohon
        </h3>
      </template>
      <template #body>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Nama Penuh
              </label>
              <p class="text-gray-900">{{ applicantInfo.namaPenuh }}</p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                No. Kad Pengenalan/No Syarikat
              </label>
              <p class="text-gray-900">{{ applicantInfo.noKadPengenalan }}</p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                No. Telefon
              </label>
              <p class="text-gray-900">{{ applicantInfo.noTelefon }}</p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Emel
              </label>
              <p class="text-gray-900">{{ applicantInfo.emel }}</p>
            </div>
            
            <div class="md:col-span-2 lg:col-span-3">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Alamat
              </label>
              <p class="text-gray-900">{{ applicantInfo.alamat }}</p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Status Household
              </label>
              <rs-badge :variant="getStatusVariant(applicantInfo.statusHousehold)">
                {{ applicantInfo.statusHousehold }}
              </rs-badge>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Status Individu
              </label>
              <rs-badge :variant="getStatusVariant(applicantInfo.statusIndividu)">
                {{ applicantInfo.statusIndividu }}
              </rs-badge>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Status Multidimensi
              </label>
              <rs-badge :variant="getStatusVariant(applicantInfo.statusMultidimensi)">
                {{ applicantInfo.statusMultidimensi }}
              </rs-badge>
            </div>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Tabbed Interface for Maklumat Bantuan -->
    <rs-card>
      <template #header>
        <h3 class="text-lg font-semibold text-gray-900">
          Maklumat Bantuan
        </h3>
      </template>
      <template #body>
        <div class="p-6">
          <rs-tab variant="primary" type="card">
            <rs-tab-item title="Agihan Bantuan" active>
              <!-- Maklumat Agihan Bantuan -->
              <div class="mb-6">
                <h4 class="text-md font-semibold text-gray-800 mb-4">
                  Maklumat Agihan Bantuan
                </h4>
                
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Aid
                    </label>
                    <p class="text-gray-900">{{ aidInfo.aid }}</p>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Aid Product
                    </label>
                    <p class="text-gray-900">{{ aidInfo.aidProduct }}</p>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Product Package
                    </label>
                    <p class="text-gray-900">{{ aidInfo.productPackage }}</p>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Entitlement Product
                    </label>
                    <p class="text-gray-900">{{ aidInfo.entitlementProduct }}</p>
                  </div>
                  
                  <div class="md:col-span-2 lg:col-span-3">
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Catatan Sebab Memohon Bantuan
                    </label>
                    <p class="text-gray-900">{{ aidInfo.catatanSebabMemohon }}</p>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Kadar Bantuan
                    </label>
                    <p class="text-gray-900 font-semibold">RM {{ aidInfo.kadarBantuan }}</p>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Tempoh / Kekerapan Bantuan
                    </label>
                    <p class="text-gray-900">{{ aidInfo.tempohKekerapan }}</p>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Tarikh Mula
                    </label>
                    <p class="text-gray-900">{{ formatDate(aidInfo.tarikhMula) }}</p>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Tarikh Tamat
                    </label>
                    <p class="text-gray-900">{{ formatDate(aidInfo.tarikhTamat) }}</p>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Jumlah Keseluruhan Bantuan Diterima
                    </label>
                    <p class="text-gray-900 font-semibold text-lg">RM {{ aidInfo.jumlahKeseluruhan }}</p>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Kod Bajet
                    </label>
                    <p class="text-gray-900">{{ aidInfo.kodBajet }}</p>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Penerima
                    </label>
                    <rs-badge :variant="getRecipientVariant(aidInfo.penerima)">
                      {{ aidInfo.penerima }}
                    </rs-badge>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Nama Penerima
                    </label>
                    <p class="text-gray-900">{{ aidInfo.namaPenerima }}</p>
                  </div>
                  
                  <!-- Conditional fields based on payment method -->
                  <div v-if="aidInfo.kaedahPembayaran !== 'Tunai'">
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Nama Pemegang Akaun
                    </label>
                    <p class="text-gray-900">{{ aidInfo.namaPemegangAkaun }}</p>
                  </div>
                  
                  <div v-if="aidInfo.kaedahPembayaran !== 'Tunai'">
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Bank
                    </label>
                    <p class="text-gray-900">{{ aidInfo.bank }}</p>
                  </div>
                  
                  <div v-if="aidInfo.kaedahPembayaran !== 'Tunai'">
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      No. Akaun Bank
                    </label>
                    <p class="text-gray-900">{{ aidInfo.noAkaunBank }}</p>
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      SAP Code
                    </label>
                    <p class="text-gray-900">{{ aidInfo.sapCode }}</p>
                  </div>
                </div>
              </div>

              <!-- Distribution Item List -->
              <div>
                <h4 class="text-md font-semibold text-gray-800 mb-4">
                  Senarai Distribution Item
                </h4>
                
                <rs-table
                  :data="distributionItems"
                  :field="distributionItemFieldKeys"
                  :columns="distributionItemFields"
                  :options="{
                    variant: 'default',
                    striped: true,
                    bordered: true,
                    hover: true
                  }"
                  :showNoColumn="true"
                />
              </div>
            </rs-tab-item>

            <rs-tab-item title="Tuntutan">
              <div class="p-4 text-center text-gray-500">
                <Icon name="ph:file-text" class="w-12 h-12 mx-auto mb-2" />
                <p>Maklumat Tuntutan akan dipaparkan di sini</p>
              </div>
            </rs-tab-item>

            <rs-tab-item title="Payment Advice">
              <div class="p-4 text-center text-gray-500">
                <Icon name="ph:credit-card" class="w-12 h-12 mx-auto mb-2" />
                <p>Maklumat Payment Advice akan dipaparkan di sini</p>
              </div>
            </rs-tab-item>

            <rs-tab-item title="Cash Issuance">
              <div class="p-4 text-center text-gray-500">
                <Icon name="ph:banknotes" class="w-12 h-12 mx-auto mb-2" />
                <p>Maklumat Cash Issuance akan dipaparkan di sini</p>
              </div>
            </rs-tab-item>

            <rs-tab-item title="Purchase Requisition">
              <div class="p-4 text-center text-gray-500">
                <Icon name="ph:shopping-cart" class="w-12 h-12 mx-auto mb-2" />
                <p>Maklumat Purchase Requisition akan dipaparkan di sini</p>
              </div>
            </rs-tab-item>

            <rs-tab-item title="Pemantauan">
              <div class="p-4 text-center text-gray-500">
                <Icon name="ph:chart-line" class="w-12 h-12 mx-auto mb-2" />
                <p>Maklumat Pemantauan akan dipaparkan di sini</p>
              </div>
            </rs-tab-item>

            <rs-tab-item title="Lampiran">
              <div class="p-4 text-center text-gray-500">
                <Icon name="ph:paperclip" class="w-12 h-12 mx-auto mb-2" />
                <p>Maklumat Lampiran akan dipaparkan di sini</p>
              </div>
            </rs-tab-item>
          </rs-tab>
        </div>
      </template>
    </rs-card>

    <!-- Maklumat Laluan Proses Permohonan -->
    <rs-card class="mt-6">
      <template #header>
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-semibold text-gray-900">
            Maklumat Laluan Proses Permohonan
          </h3>
          <rs-button
            variant="primary"
            @click="handleCheck"
          >
            <Icon name="ph:check-circle" class="w-4 h-4 mr-1" />
            Semak
          </rs-button>
        </div>
      </template>
      <template #body>
        <div class="p-6">
          <div class="space-y-4">
            <div 
              v-for="(process, index) in processFlow" 
              :key="index"
              class="border-l-4 border-primary pl-4 pb-4"
            >
              <div class="flex items-center justify-between mb-2">
                <rs-badge :variant="getProcessStatusVariant(process.status)">
                  {{ process.status }}
                </rs-badge>
                <span class="text-sm text-gray-500">
                  {{ formatDateTime(process.tarikhMasa) }}
                </span>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Nama Pegawai
                  </label>
                  <p class="text-gray-900">{{ process.namaPegawai }}</p>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Catatan
                  </label>
                  <p class="text-gray-900">{{ process.catatan }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </rs-card>
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

// Breadcrumb
const breadcrumb = ref([
  {
    name: "Bantuan",
    type: "link",
    path: "/BF-BTN/bantuan",
  },
  {
    name: "Senarai",
    type: "current",
    path: "/BF-BTN/bantuan",
  },
  {
    name: "Maklumat Bantuan",
    type: "current",
    path: `/BF-BTN/bantuan/${route.params.id}`,
  },
]);


// Sample data - replace with actual API calls
const applicantInfo = ref({
  namaPenuh: 'Ahmad bin Abdullah',
  noKadPengenalan: '800101-01-1234',
  noTelefon: '+60123456789',
  emel: 'ahmad@example.com',
  alamat: 'No. 123, Jalan Merdeka, Taman Merdeka, 50000 Kuala Lumpur',
  statusHousehold: 'Aktif',
  statusIndividu: 'Lulus',
  statusMultidimensi: 'Miskin'
})

const aidInfo = ref({
  aid: 'Bantuan Asnaf',
  aidProduct: 'Bantuan Kewangan Bulanan',
  productPackage: 'Paket Asnaf Standard',
  entitlementProduct: 'Bantuan RM 500/bulan',
  catatanSebabMemohon: 'Memerlukan bantuan kewangan untuk keperluan asas keluarga',
  kadarBantuan: '500.00',
  tempohKekerapan: 'Bulanan',
  tarikhMula: '2024-01-01',
  tarikhTamat: '2024-12-31',
  jumlahKeseluruhan: '6000.00',
  kodBajet: 'BUD-2024-001',
  penerima: 'Asnaf',
  namaPenerima: 'Ahmad bin Abdullah',
  kaedahPembayaran: 'Bank Transfer',
  namaPemegangAkaun: 'Ahmad bin Abdullah',
  bank: 'Maybank',
  noAkaunBank: '1234567890',
  sapCode: 'SAP-001'
})

const distributionItems = ref([
  {
    diNo: 'DI-2024-001',
    entitlementProduct: 'Bantuan RM 500/bulan',
    penerima: 'Ahmad bin Abdullah',
    bulan: 'Januari',
    tahun: '2024',
    status: 'Dibayar',
    amaun: '500.00'
  },
  {
    diNo: 'DI-2024-002',
    entitlementProduct: 'Bantuan RM 500/bulan',
    penerima: 'Ahmad bin Abdullah',
    bulan: 'Februari',
    tahun: '2024',
    status: 'Dibayar',
    amaun: '500.00'
  },
  {
    diNo: 'DI-2024-003',
    entitlementProduct: 'Bantuan RM 500/bulan',
    penerima: 'Ahmad bin Abdullah',
    bulan: 'Mac',
    tahun: '2024',
    status: 'Menunggu',
    amaun: '500.00'
  }
])

const distributionItemFields = [
  { key: 'diNo', label: 'DI No' },
  { key: 'entitlementProduct', label: 'Entitlement Product' },
  { key: 'penerima', label: 'Penerima' },
  { key: 'bulan', label: 'Bulan' },
  { key: 'tahun', label: 'Tahun' },
  { key: 'status', label: 'Status' },
  { key: 'amaun', label: 'Amaun (RM)' }
]

const distributionItemFieldKeys = [
  'diNo', 
  'entitlementProduct',
  'penerima',
  'bulan',
  'tahun',
  'status',
  'amaun'
]

const processFlow = ref([
  {
    status: 'Permohonan',
    namaPegawai: 'Siti binti Ali',
    tarikhMasa: '2024-01-01 09:00:00',
    catatan: 'Permohonan diterima dan sedang diproses'
  },
  {
    status: 'Semak',
    namaPegawai: 'Ahmad bin Hassan',
    tarikhMasa: '2024-01-02 14:30:00',
    catatan: 'Dokumen lengkap, layak untuk bantuan'
  },
  {
    status: 'Sokong',
    namaPegawai: 'Fatimah binti Omar',
    tarikhMasa: '2024-01-03 11:15:00',
    catatan: 'Menyokong permohonan bantuan'
  },
  {
    status: 'Lulus',
    namaPegawai: 'Mohd bin Ibrahim',
    tarikhMasa: '2024-01-04 16:45:00',
    catatan: 'Permohonan diluluskan untuk bantuan bulanan'
  }
])

// Utility functions
const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('ms-MY')
}

const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return '-'
  const date = new Date(dateTimeString)
  return date.toLocaleString('ms-MY')
}

const getStatusVariant = (status) => {
  const variants = {
    'Aktif': 'success',
    'Lulus': 'success',
    'Miskin': 'warning',
    'Tidak Aktif': 'danger',
    'Tidak Lulus': 'danger'
  }
  return variants[status] || 'primary'
}

const getRecipientVariant = (recipient) => {
  const variants = {
    'Asnaf': 'warning',
    'Third Party': 'info',
    'Organisasi': 'primary',
    'PAK': 'success'
  }
  return variants[recipient] || 'primary'
}

const getProcessStatusVariant = (status) => {
  const variants = {
    'Permohonan': 'info',
    'Semak': 'warning',
    'Sokong': 'primary',
    'Lulus': 'success'
  }
  return variants[status] || 'primary'
}

// Event handlers
const handleBack = () => {
  navigateTo('/BF-BTN/bantuan')
}

const handlePrintLetter = () => {
  // Implement print letter functionality
  console.log('Print letter for aid ID:', aidId)
  navigateTo(`/BF-BTN/bantuan/${aidId}/cetak-surat`)
}

const handleCheck = () => {
  // Implement check functionality
  console.log('Check process for aid ID:', aidId)
}

// Fetch data on mount
onMounted(async () => {
  try {
    // Replace with actual API calls
    // const response = await $fetch(`/api/bantuan/${aidId}`)
    // applicantInfo.value = response.applicantInfo
    // aidInfo.value = response.aidInfo
    // distributionItems.value = response.distributionItems
    // processFlow.value = response.processFlow
  } catch (error) {
    console.error('Error fetching aid information:', error)
  }
})
</script>

<style lang="scss" scoped>
// Custom styles if needed
</style>
