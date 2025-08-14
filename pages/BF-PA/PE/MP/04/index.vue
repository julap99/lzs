<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Pengiraan Elaun</h2>
          <rs-badge v-if="formData.status" :variant="getStatusVariant(formData.status)">
            {{ formData.status }}
          </rs-badge>
        </div>
      </template>

      <template #body>
        <FormKit type="form" :actions="false" @submit="handleSubmit" v-model="formData">
          <!-- 1. Maklumat Aktiviti -->
          <div class="space-y-4 mt-6">
            <h3 class="text-lg font-medium">Maklumat Aktiviti</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit type="text" name="idAktiviti" label="ID Aktiviti" disabled />
              <FormKit type="text" name="namaAktiviti" label="Nama Aktiviti" disabled />
              <FormKit type="text" name="tarikhAktiviti" label="Tarikh Aktiviti" disabled />
              <FormKit type="text" name="jenisAktiviti" label="Jenis Aktiviti" disabled />
            </div>
          </div>

          <!-- 2. Penapis Status Kehadiran -->
          <div class="space-y-4 mt-8">
            <h3 class="text-lg font-medium">Senarai Penolong Amil</h3>
            <div class="flex flex-wrap gap-4">
              <rs-button :variant="selectedFilter === 'Semua' ? 'primary' : 'primary-outline'" @click="filterStatus('Semua')">Semua</rs-button>
              <rs-button :variant="selectedFilter === 'Hadir' ? 'primary' : 'primary-outline'" @click="filterStatus('Hadir')">Hadir</rs-button>
              <rs-button :variant="selectedFilter === 'Tidak Hadir' ? 'primary' : 'primary-outline'" @click="filterStatus('Tidak Hadir')">Tidak Hadir</rs-button>
              <rs-button variant="primary-outline" icon="material-symbols:download" @click="cetakXLSX">Cetak XLSX</rs-button>
              <rs-button variant="primary-outline" icon="material-symbols:picture-as-pdf" @click="cetakPDF">Cetak PDF</rs-button>
            </div>

            <!-- 3. Jadual Penolong Amil -->
            <rs-table
              class="mt-4"
              :data="filteredPeserta"
              :pageSize="10"
              :showNoColumn="true"
              :columns="[
                { key: 'nama', label: 'Nama' },
                { key: 'noKP', label: 'No Kad Pengenalan' },
                { key: 'kategori', label: 'Kategori' },
                { key: 'jawatan', label: 'Jawatan' },
                { key: 'daerah', label: 'Daerah' },
                { key: 'status', label: 'Status Kehadiran' },
                { key: 'elaun', label: 'Jumlah Elaun (RM)' }
              ]"
              :options="{ variant: 'default', hover: true }"
            >
              <template v-slot:status="data">
                <rs-badge :variant="data.text === 'Hadir' ? 'success' : 'danger'">{{ data.text }}</rs-badge>
              </template>
              <template v-slot:elaun="data">
                RM {{ parseFloat(data.text).toFixed(2) }}
              </template>
            </rs-table>

            <!-- 4. Jumlah Keseluruhan -->
            <div class="text-right font-semibold text-lg mt-4">
              Jumlah Keseluruhan Elaun (RM): RM {{ jumlahKeseluruhan.toFixed(2) }}
            </div>
          </div>

          <!-- 5. Butang Tindakan -->
          <div class="flex justify-end space-x-4 mt-8">
            <rs-button variant="primary-outline" @click="navigateTo('/BF-PA/PE/MP')">Kembali</rs-button>
            <rs-button variant="primary" @click="handleSubmit">Sokong</rs-button>
          </div>
        </FormKit>
      </template>
    </rs-card>

    <!-- Modal Pengesahan -->
    <rs-modal v-model="showSuccessModal" title="Hantar Pengiraan" size="md" position="center">
      <template #body>
        <div class="text-center">
          <Icon name="material-symbols:help-outline" class="text-blue-500 text-5xl mb-4" />
          <p class="text-lg mb-2">Adakah anda pasti untuk menghantar pengiraan jumlah elaun ini?</p>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-center space-x-4">
          <rs-button variant="primary-outline" @click="showSuccessModal = false">Batal</rs-button>
          <rs-button variant="primary" @click="confirmSubmit">Hantar</rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useToast } from 'vue-toastification'
import { useRoute } from 'vue-router'

const toast = useToast()
const showSuccessModal = ref(false)
const selectedFilter = ref('Semua')

const breadcrumb = ref([
  { name: "Pengurusan Penolong Amil", type: "link", path: "/BF-PA/PE/MP" },
  { name: "Pengiraan Elaun", type: "current", path: "/BF-PA/PE/MP/03" }
])

const formData = ref({
  status: "Menunggu Semakan",
  idAktiviti: "ACT-123",
  namaAktiviti: "Taklimat Dana Asnaf",
  tarikhAktiviti: "2025-08-01",
  jenisAktiviti: "Latihan",
  senaraiPeserta: [
    { nama: "Ali bin Abu", noKP: "900101-01-1111", kategori: "PAK", jawatan: "Setiausaha", daerah: "Gombak", status: "Hadir", elaun: 100 },
    { nama: "Fatimah binti Zakaria", noKP: "910202-02-2222", kategori: "PAF", jawatan: "Pembantu", daerah: "Petaling", status: "Tidak Hadir", elaun: 0 },
    { nama: "Zainal bin Kassim", noKP: "920303-03-3333", kategori: "PAK", jawatan: "Setiausaha", daerah: "Hulu Langat", status: "Hadir", elaun: 120 }
  ]
})

const filteredPeserta = computed(() => {
  if (selectedFilter.value === 'Semua') return formData.value.senaraiPeserta
  return formData.value.senaraiPeserta.filter(p => p.status === selectedFilter.value)
})

const jumlahKeseluruhan = computed(() => {
  return filteredPeserta.value.reduce((sum, p) => sum + (parseFloat(p.elaun) || 0), 0)
})

const filterStatus = (status) => {
  selectedFilter.value = status
}

const getStatusVariant = (status) => {
  return {
    "Menunggu Semakan": "warning",
    "Lulus": "success",
    "Tolak": "danger"
  }[status] || "default"
}

const handleSubmit = () => {
  showSuccessModal.value = true
}

const confirmSubmit = () => {
  showSuccessModal.value = false
  toast.success("Pengiraan elaun telah dihantar untuk semakan.")
  navigateTo('/BF-PA/PE/MP/05')
}

// Dummy Export
const cetakXLSX = () => toast.info("Export ke .xlsx belum disambung.")
const cetakPDF = () => toast.info("Export ke .pdf belum disambung.")
</script>
