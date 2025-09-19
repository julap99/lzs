<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <h2 class="text-xl font-semibold">
          Notifikasi Pembayaran - {{ route.params.id }}
        </h2>
      </template>

      <template #body>
        <div class="space-y-6">
          <!-- Alert -->
          <div v-if="alertMsg" :class="['p-4 rounded-lg border', alertClass]" role="alert">
            <div class="flex items-center gap-2">
              <Icon :name="getAlertIcon()" class="w-5 h-5" />
              <span class="font-medium">{{ alertMsg }}</span>
            </div>
          </div>

          <!-- Form Section -->
          <rs-fieldset title="Konfigurasi Notifikasi Pembayaran">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit
                type="select"
                label="Pilih Payload"
                v-model="selected"
                :options="payloadOptions"
                :classes="{
                  input: '!py-2',
                }"
              />
            </div>
            
            <div class="mt-4">
              <rs-button
                variant="primary"
                @click="triggerToast"
              >
                <Icon name="heroicons:paper-airplane" class="w-4 h-4 mr-2" />
                Hantar Notifikasi
              </rs-button>
            </div>
          </rs-fieldset>

          <!-- Preview Section -->
          <rs-fieldset title="Pratonton Notifikasi Pembayaran">
            <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div class="space-y-2">
                  <div class="flex items-center gap-2">
                    <Icon :name="getStatusIcon()" class="w-4 h-4" />
                    <span><strong>Status:</strong> {{ payload.statusBayar }}</span>
                  </div>
                  <div><strong>No. Rujukan:</strong> {{ route.params.id }}</div>
                  <div><strong>Nama:</strong> {{ payload.nama }} ({{ payload.noKp }})</div>
                  <div><strong>Jumlah:</strong> RM {{ payload.jumlahBayaran }}</div>
                </div>
                <div class="space-y-2">
                  <div><strong>Kaedah:</strong> {{ payload.kaedahBayar }}</div>
                  <div><strong>Tarikh:</strong> {{ payload.tarikhBayaran }}</div>
                  <div v-if="payload.noTransaksiSAP"><strong>No Transaksi SAP:</strong> {{ payload.noTransaksiSAP }}</div>
                  <div v-if="payload.catatan"><strong>Catatan:</strong> {{ payload.catatan }}</div>
                </div>
              </div>

              <div v-if="selected === 'gagal'" class="pt-4 border-t border-gray-200">
                <rs-button
                  variant="warning"
                  @click="gotoKemaskini"
                >
                  <Icon name="heroicons:pencil-square" class="w-4 h-4 mr-2" />
                  Arahan Kemaskini
                </rs-button>
              </div>
            </div>
          </rs-fieldset>
        </div>
        
        <!-- Action Buttons -->
        <div class="flex justify-end mt-6 pt-4 border-t">
          <rs-button
            variant="secondary-outline"
            @click="goToList"
          >
            <Icon name="heroicons:arrow-left" class="w-4 h-4 mr-2" />
            Ke Senarai
          </rs-button>
        </div>
      </template>
    </rs-card>

    <!-- Toasts -->
    <div class="fixed bottom-4 right-4 space-y-2 z-50">
      <div v-for="t in toasts" :key="t.id" class="px-4 py-2 rounded shadow bg-black text-white text-sm">
        {{ t.msg }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, navigateTo } from '#app'

definePageMeta({
  title: 'Notifikasi Pembayaran',
  description: 'Hantar notifikasi pembayaran permohonan bantuan khas'
})

const route = useRoute()

const breadcrumb = ref([
  {
    name: "Bantuan",
    type: "link",
    path: "/BF-BTN",
  },
  {
    name: "Permohonan Bantuan",
    type: "link",
    path: "/BF-BTN/PB",
  },
  {
    name: "Kelulusan Khas",
    type: "link",
    path: "/BF-BTN/PB/KH/01",
  },
  {
    name: "Notifikasi Pembayaran",
    type: "current",
    path: `/BF-BTN/PB/KH/04/${route.params.id}`,
  },
])

// Mock data - get details from KH-02 data
const details = [
  {
    noRujukan: 'B102',
    nama: 'Ahmad Bin Ali',
    noKp: '850101-10-1234',
    aidName: 'Barangan Dapur Asas',
  },
  {
    noRujukan: 'B300',
    nama: 'Siti Aminah',
    noKp: '900303-10-9999',
    aidName: 'Sewa Rumah',
  },
  {
    noRujukan: 'B307',
    nama: 'Mohd Razak bin Ibrahim',
    noKp: '780315-08-5678',
    aidName: 'Bantuan Perubatan',
  },
  {
    noRujukan: 'B201',
    nama: 'Fatimah binti Omar',
    noKp: '920505-12-3456',
    aidName: 'Bantuan Pendidikan',
  },
  {
    noRujukan: 'B305',
    nama: 'Rashid Bin Omar',
    noKp: '880912-05-7890',
    aidName: 'Bantuan Makanan',
  },
  {
    noRujukan: 'B108',
    nama: 'Aishah Bt Abdullah',
    noKp: '850203-11-2468',
    aidName: 'Bantuan Rumah',
  },
  {
    noRujukan: 'B402',
    nama: 'Ismail Bin Ahmad',
    noKp: '900101-03-1357',
    aidName: 'Bantuan Kenderaan',
  }
]

const detail = computed(() => details.find(d => d.noRujukan === String(route.params.id)) || null)

const selected = ref('berjaya')

const payloadOptions = [
  { label: 'Berjaya', value: 'berjaya' },
  { label: 'Gagal (profil/bank)', value: 'gagal' },
  { label: 'Tertangguh', value: 'tangguh' }
]

const payloads = computed(() => ({
  berjaya: {
    idPermohonan: route.params.id,
    nama: detail.value?.nama || 'Ahmad Bin Ali',
    noKp: detail.value?.noKp || '850101-10-1234',
    jumlahBayaran: 300,
    tarikhBayaran: '2025-07-28',
    kaedahBayar: 'EFT',
    statusBayar: 'Berjaya',
    catatan: 'Dikreditkan',
    noTransaksiSAP: 'SAP-TRX-998877',
  },
  gagal: {
    idPermohonan: route.params.id,
    nama: detail.value?.nama || 'Ahmad Bin Ali',
    noKp: detail.value?.noKp || '850101-10-1234',
    jumlahBayaran: 300,
    tarikhBayaran: '2025-07-28',
    kaedahBayar: 'EFT',
    statusBayar: 'Gagal',
    catatan: 'Nama akaun tidak sepadan',
    noTransaksiSAP: null,
  },
  tangguh: {
    idPermohonan: route.params.id,
    nama: detail.value?.nama || 'Ahmad Bin Ali',
    noKp: detail.value?.noKp || '850101-10-1234',
    jumlahBayaran: 300,
    tarikhBayaran: '2025-07-28',
    kaedahBayar: 'EFT',
    statusBayar: 'Tertangguh',
    catatan: 'Menunggu pemprosesan SAP',
    noTransaksiSAP: null,
  }
}))

const payload = computed(() => payloads.value[selected.value])

const alertMsg = computed(() => {
  if (selected.value === 'berjaya') return 'Pembayaran berjaya dikreditkan.'
  if (selected.value === 'gagal') return 'Pembayaran gagal. Sila kemaskini maklumat profil/bank.'
  return 'Pembayaran sedang diproses oleh SAP.'
})

const alertClass = computed(() => {
  if (selected.value === 'berjaya') return 'bg-green-100 text-green-800 border-green-200'
  if (selected.value === 'gagal') return 'bg-red-100 text-red-800 border-red-200'
  return 'bg-yellow-100 text-yellow-900 border-yellow-200'
})

const getAlertIcon = () => {
  if (selected.value === 'berjaya') return 'heroicons:check-circle'
  if (selected.value === 'gagal') return 'heroicons:x-circle'
  return 'heroicons:clock'
}

const getStatusIcon = () => {
  if (selected.value === 'berjaya') return 'heroicons:check-circle'
  if (selected.value === 'gagal') return 'heroicons:x-circle'
  return 'heroicons:clock'
}

let toastId = 1
const toasts = ref([])

function toast(msg) {
  const id = toastId++
  toasts.value.push({ id, msg })
  setTimeout(() => { toasts.value = toasts.value.filter(t => t.id !== id) }, 3000)
}

function triggerToast() {
  if (selected.value === 'berjaya') {
    toast('Pembayaran berjaya dikreditkan.')
  } else if (selected.value === 'gagal') {
    toast('Pembayaran gagal. Sila kemaskini maklumat.')
  } else {
    toast('Pembayaran sedang diproses oleh SAP.')
  }
}

function goToList() { 
  navigateTo('/BF-BTN/PB/KH/01') 
}

function gotoKemaskini() { 
  navigateTo('/profil/kemaskini') 
}
</script>
