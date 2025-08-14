<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Semakan & Kelulusan Manual Kuasa</h2>
        </div>
      </template>

      <template #body>
        <!-- 1. Maklumat Aktiviti -->
        <div class="space-y-4 mt-6">
          <h3 class="text-lg font-medium">Maklumat Aktiviti</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormKit type="text" name="idAktiviti" label="ID Aktiviti" :value="formData.idAktiviti" disabled />
            <FormKit type="text" name="namaAktiviti" label="Nama Aktiviti" :value="formData.namaAktiviti" disabled />
            <FormKit type="text" name="tarikhAktiviti" label="Tarikh Aktiviti" :value="formData.tarikhAktiviti" disabled />
            <FormKit type="text" name="jenisAktiviti" label="Jenis Aktiviti" :value="formData.jenisAktiviti" disabled />
          </div>
        </div>

        <!-- 2. Filter + Cetak -->
        <div class="space-y-4 mt-8">
          <h3 class="text-lg font-medium">Senarai Penolong Amil</h3>
          <div class="flex flex-wrap gap-4">
            <rs-button :variant="selectedFilter === 'Semua' ? 'primary' : 'primary-outline'" @click="filterStatus('Semua')">Semua</rs-button>
            <rs-button :variant="selectedFilter === 'Hadir' ? 'primary' : 'primary-outline'" @click="filterStatus('Hadir')">Hadir</rs-button>
            <rs-button :variant="selectedFilter === 'Tidak Hadir' ? 'primary' : 'primary-outline'" @click="filterStatus('Tidak Hadir')">Tidak Hadir</rs-button>
            <rs-button variant="primary-outline" icon="material-symbols:download" @click="cetakXLSX">Cetak XLSX</rs-button>
            <rs-button variant="primary-outline" icon="material-symbols:picture-as-pdf" @click="cetakPDF">Cetak PDF</rs-button>
          </div>

          <rs-table
            class="mt-4"
            :data="filteredPeserta"
            :pageSize="10"
            :showNoColumn="true"
            :columns="[
              { key: 'nama', label: 'Nama' },
              { key: 'noKP', label: 'No KP' },
              { key: 'kategori', label: 'Kategori' },
              { key: 'jawatan', label: 'Jawatan' },
              { key: 'daerah', label: 'Daerah' },
              { key: 'status', label: 'Status Kehadiran' },
              { key: 'elaun', label: 'Elaun (RM)' }
            ]"
          >
            <template v-slot:status="data">
              <rs-badge :variant="data.text === 'Hadir' ? 'success' : 'danger'">{{ data.text }}</rs-badge>
            </template>
            <template v-slot:elaun="data">
              RM {{ parseFloat(data.text).toFixed(2) }}
            </template>
          </rs-table>

          <div class="text-right font-semibold text-lg mt-4">
            Jumlah Keseluruhan Elaun: RM {{ jumlahKeseluruhan.toFixed(2) }}
          </div>

          <div class="mt-2 text-sm" :class="hadLulus ? 'text-green-600' : 'text-red-600'">
            <span v-if="hadLulus">
              ✅ Jumlah elaun berada dalam had kelulusan anda. Sila teruskan kelulusan jika bersetuju.
            </span>
            <span v-else>
              ❌ Kelulusan tidak tersedia kerana jumlah melebihi had kelulusan yang dibenarkan.
            </span>
          </div>
        </div>

        <!-- 3. Keputusan Kelulusan -->
        <div class="space-y-4 mt-8">
          <h3 class="text-lg font-medium">Keputusan Ketua Jabatan</h3>
          <div class="flex gap-4">
            <rs-button variant="success" :disabled="!hadLulus" @click="setKeputusan('Lulus')">Lulus</rs-button>
            <rs-button variant="danger" @click="setKeputusan('Tidak Lulus')">Tidak Lulus</rs-button>
          </div>

          <div v-if="keputusan === 'Tidak Lulus'" class="mt-4">
            <FormKit
              type="textarea"
              name="ulasan"
              label="Ulasan Penolakan"
              placeholder="Sila nyatakan sebab penolakan permohonan ini."
              v-model="ulasan"
              validation="required"
            />
          </div>
        </div>

        <!-- 4. Tindakan Akhir -->
        <div class="flex justify-end space-x-4 mt-8">
          <rs-button variant="primary-outline" @click="navigateTo('/BF-PA/PE/MP/01')">Kembali</rs-button>
          <rs-button variant="primary" :disabled="keputusan === null || (keputusan === 'Tidak Lulus' && !ulasan)" @click="sahkanKeputusan">
            Sahkan Keputusan
          </rs-button>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useToast } from 'vue-toastification'

const toast = useToast()
const selectedFilter = ref('Semua')
const keputusan = ref(null)
const ulasan = ref('')
const hadKelulusan = 200 // Had kelulusan Ketua Jabatan

const breadcrumb = ref([
  { name: "Pengurusan Penolong Amil", type: "link", path: "/BF-PA/PE/MP/01" },
  { name: "Semakan & Kelulusan Manual Kuasa", type: "current", path: "/BF-PA/PE/MP/03" }
])

const formData = ref({
  idAktiviti: "ACT-456",
  namaAktiviti: "Mesyuarat Zon Selatan",
  tarikhAktiviti: "2025-08-05",
  jenisAktiviti: "Mesyuarat",
  senaraiPeserta: [
    { nama: "Hasan bin Omar", noKP: "801212-01-1111", kategori: "PAK", jawatan: "Pembantu", daerah: "Sepang", status: "Hadir", elaun: 90 },
    { nama: "Ramlah binti Musa", noKP: "850505-02-2222", kategori: "PAF", jawatan: "Setiausaha", daerah: "Klang", status: "Tidak Hadir", elaun: 0 },
    { nama: "Jamilah binti Ghani", noKP: "870101-03-3333", kategori: "PAK", jawatan: "Pembantu", daerah: "Sabak Bernam", status: "Hadir", elaun: 110 }
  ]
})

const filteredPeserta = computed(() => {
  if (selectedFilter.value === 'Semua') return formData.value.senaraiPeserta
  return formData.value.senaraiPeserta.filter(p => p.status === selectedFilter.value)
})

const jumlahKeseluruhan = computed(() => {
  return formData.value.senaraiPeserta.reduce((sum, p) => sum + (parseFloat(p.elaun) || 0), 0)
})

const hadLulus = computed(() => jumlahKeseluruhan.value <= hadKelulusan)

const filterStatus = (status) => {
  selectedFilter.value = status
}

const setKeputusan = (val) => {
  keputusan.value = val
  if (val === 'Lulus') ulasan.value = ''
}

const sahkanKeputusan = () => {
  if (keputusan.value === 'Lulus') {
    toast.success("Elaun telah diluluskan. Terus ke proses Payment Advice.")
  } else {
    toast.error(`Elaun ditolak. Ulasan: ${ulasan.value}`)
  }
  navigateTo('/BF-PA/PE/MP/06')
}

const cetakXLSX = () => toast.info("Fungsi eksport ke .xlsx belum disambung.")
const cetakPDF = () => toast.info("Fungsi eksport ke .pdf belum disambung.")
</script>
