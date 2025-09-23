<template>
  <div>
    <layouts-breadcrumb :items="breadcrumb" />

 

    <!-- Report Header Section -->
    <rs-card class="mb-6">
      <template #body>
        <div class="space-y-4">
          <!-- Logo LZS -->
          <div class="flex justify-start">
            <img src="https://www.zakatselangor.com.my/wp-content/uploads/2018/10/lzs-logo.png" alt="LZS Logo" class="h-16" />
          </div>

          <!-- Report Details -->
          <div class="space-y-2">
            <p class="text-sm font-bold"> RP0002</p>
            <p class="text-lg font-semibold"> Surat Pengesahan Permastautin</p>
            <p class="text-md font-medium text-center"> BORANG PENGESAHAN PEMASTAUTIN OLEH PENGHULU, KETUA KAMPUNG, PENGERUSI JKKK, NAZIR MASJID, PENGERUSI JAWATANKUASA PENDUDUK/TAMAN PERUMAHAN DALAM NEGERI SELANGOR DARUL EHSAN</p>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Bahagian A: Butiran Pemohon/Ibu/Bapa/Penjaga (Form Fields) -->
    <rs-card class="mb-6">
      <template #body>
        <div class="space-y-4">
          <h3 class="text-lg font-semibold">BAHAGIAN A: BUTIRAN PEMOHON/IBU/BAPA/PENJAGA</h3>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nama Pemohon/Ibu/Bapa/Penjaga:</label>
            <input v-model="formData.namaPemohon" type="text" class="form-input w-full p-2 border rounded" />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">No Kad Pengenalan:</label>
            <input v-model="formData.noKP" type="text" class="form-input w-full p-2 border rounded" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Jantina:</label>
            <input v-model="formData.jantina" type="text" class="form-input w-full p-2 border rounded" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tempat Kelahiran:</label>
            <input v-model="formData.tempatKelahiran" type="text" class="form-input w-full p-2 border rounded" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Alamat Dalam Kad Pengenalan:</label>
            <input v-model="formData.alamatKadPengenalan" type="text" class="form-input w-full p-2 border rounded" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Alamat Tempat Tinggal Sekarang:</label>
            <input v-model="formData.alamatSekarang" type="text" class="form-input w-full p-2 border rounded" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">No Telefon (HP):</label>
            <input v-model="formData.telefon" type="text" class="form-input w-full p-2 border rounded" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">No Telefon (R):</label>
            <input v-model="formData.telefonRumah" type="text" class="form-input w-full p-2 border rounded" />
          </div>


          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tempoh Masa Telah Menetap (Tahun/Bulan/Hari):</label>
            <input v-model="formData.tempohMasaMenetap" type="text" class="form-input w-full p-2 border rounded" />
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Bahagian B: Perakuan Pengesahan Permastautin (Form Fields) -->
    <rs-card class="mb-6">
      <template #body>
        <div class="space-y-4">
          <h3 class="text-lg font-semibold">BAHAGIAN B: PERAKUAN PENGESAHAN PEMASTAUTIN</h3>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nama Pegawai Yang Mengesahkan:</label>
            <input v-model="formData.namaPegawai" type="text" class="form-input w-full p-2 border rounded" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">No Kad Pengenalan:</label>
            <input v-model="formData.noKPPegawai" type="text" class="form-input w-full p-2 border rounded" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Jawatan:</label>
            <input v-model="formData.jawatan" type="text" class="form-input w-full p-2 border rounded" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tarikh:</label>
            <input v-model="formData.tarikh" type="date" class="form-input w-full p-2 border rounded" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tandatangan, Cop Rasmi, Nama & Alamat Pegawai Yang Mengesahkan:</label>
            <input v-model="formData.tandatangan" type="text" class="form-input w-full p-2 border rounded" />
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Footer with buttons -->
    <rs-modal v-model="showSurat" title="Surat Pengesahan Permastautin">
      <template #footer>
        <div class="flex justify-end gap-2">
          <rs-button variant="secondary-outline" @click="showSurat = false">
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
import { ref } from 'vue'

definePageMeta({ title: 'Surat Pengesahan Permastautin' })

const breadcrumb = [
  { name: 'Pelaporan', type: 'link', path: '/BF-PRF/AS/pelaporan' },
  { name: 'Surat Pengesahan Permastautin', type: 'link', path: '/BF-PRF/AS/pelaporan/asnaf/pengesahan-permastautin' },
]

// Form Data
const formData = ref({
  namaPemohon: '',
  noKP: '',
  jantina: '',
  tempatKelahiran: '',
  alamatKadPengenalan: '',
  alamatSekarang: '',
  telefon: '',
  telefonRumah: '',
  tempohMasaMenetap: '',
  namaPegawai: '',
  noKPPegawai: '',
  jawatan: '',
  tarikh: '',
  tandatangan: ''
})

const showSurat = ref(false)

const downloadSuratTawaran = () => {
  // Functionality to download Surat Tawaran
  alert('Muat turun Surat Pengesahan Permastautin...')
  showSurat.value = false
}
</script>
