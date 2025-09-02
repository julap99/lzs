<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Semakan Data Permohonan</h2>
        </div>
      </template>

      <template #body>
        <!--  SEMAKAN RADIO BUTTONS (Screenshot Style) -->
        <div class="mb-8">
          <rs-table
            class="w-full text-sm mb-6"
            :data="semakanRows"
            :field="semakanFields"
            :pageSize="semakanRows.length"
            :columns="[
              { key: 'label', label: 'Maklumat Lengkap?' },
              { key: 'ya', label: 'Ya' },
              { key: 'tidak', label: 'Tidak' },
              { key: 'tidakBerkenaan', label: 'Tidak Berkenaan' }
            ]"
             :options="{
            variant: 'default',
            hover: true,
            striped: true,
          }"
          :options-advanced="{
            sortable: true,
            filterable: true,
          }"
          >
            <template #ya="data">
              <div class="">
                <input type="radio" :name="data.value.name" value="Ya" v-model="data.value.selected" />
              </div>
            </template>
            <template #tidak="data">
              <div class="">
                <input type="radio" :name="data.value.name" value="Tidak" v-model="data.value.selected" />
              </div>
            </template>
            <template #tidakBerkenaan="data">
              <div class="">
                <input type="radio" :name="data.value.name" value="Tidak Berkenaan" v-model="data.value.selected" />
              </div>
            </template>
          </rs-table>
          <!-- Komen Penyemak and Dokumen Lengkap outside table -->
          <div class="mb-4 flex flex-col gap-4">
            <div>
              <label class="font-bold block mb-1">Komen Penyemak</label>
              <FormKit
                type="textarea"
                name="komen_penyemak"
                v-model="komenPenyemak"
                :rows="3"
                placeholder="Masukkan komen penyemak"
              />
            </div>
            
            <div>
              <label class="font-bold block mb-2">Dokumen Lengkap?</label>
              <FormKit
                type="radio"
                name="dokumen_lengkap"
                v-model="dokumenLengkap"
                :options="[
                  { label: 'Ya', value: 'Ya' },
                  { label: 'Tidak', value: 'Tidak' },
                ]"
                @input="handleDokumenLengkapChange"
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FormKit
                  type="text"
                  name="disemak_oleh"
                  label="Disemak Oleh"
                  v-model="disemakOleh"
                  :readonly="true"
                />
              </div>
              <div>
                <FormKit
                  type="text"
                  name="tarikh_semakan"
                  label="Tarikh Semakan"
                  v-model="tarikhSemakan"
                  :readonly="true"
                />
              </div>
            </div>  
          </div>
        </div>

        <!-- Popup Notification -->
        <div 
          v-if="showNotification" 
          class="fixed top-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded shadow-lg z-50 transition-all duration-300"
          :class="{ 'opacity-0': notificationFading }"
        >
          <div class="flex items-center">
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
            </svg>
            <span class="font-medium">{{ notificationMessage }}</span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end gap-3 mt-6">
          <rs-button type="button" variant="outline" @click="handleKembali">
            Kembali
          </rs-button>
          <rs-button type="button" variant="secondary" @click="handleSimpanDraf">
            Simpan Draf
          </rs-button>
          <rs-button type="button" variant="primary" @click="handleHantar">
            Hantar
          </rs-button>
      

        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

definePageMeta({
  title: 'Semakan Data Permohonan',
});

const breadcrumb = ref([
  {
    name: 'Permohonan',
    type: 'current',
    path: '/BF-PRF/AS/permohonan',
  },
  {
    name: 'Semakan Data',
    type: 'current',
    path: '/BF-PRF/AS/permohonan/semakan-data',
  },
]);

const komenPenyemak = ref('');
const disemakOleh = ref('penyemak');
const tarikhSemakan = ref(new Date().toLocaleDateString('ms-MY', { day: '2-digit', month: '2-digit', year: 'numeric' }));

// Table fields and rows for Semakan (use RsTable)
const semakanFields = ['label', 'ya', 'tidak', 'tidakBerkenaan'];
const semakanRows = ref([
  { label: 'Peribadi', ya: '', tidak: '', tidakBerkenaan: '', name: 'peribadi', selected: '' },
  { label: 'Pendidikan', ya: '', tidak: '', tidakBerkenaan: '', name: 'pendidikan', selected: '' },
  { label: 'Pengislaman', ya: '', tidak: '', tidakBerkenaan: '', name: 'pengislaman', selected: '' },
  { label: 'Perbankan', ya: '', tidak: '', tidakBerkenaan: '', name: 'perbankan', selected: '' },
  { label: 'Kesihatan', ya: '', tidak: '', tidakBerkenaan: '', name: 'kesihatan', selected: '' },
  { label: 'Kemahiran', ya: '', tidak: '', tidakBerkenaan: '', name: 'kemahiran', selected: '' },
  { label: 'Alamat dan Tempat Tinggal', ya: '', tidak: '', tidakBerkenaan: '', name: 'alamat', selected: '' },
  { label: 'Pinjaman', ya: '', tidak: '', tidakBerkenaan: '', name: 'pinjaman', selected: '' },
  { label: 'Pemilikan Aset', ya: '', tidak: '', tidakBerkenaan: '', name: 'aset', selected: '' },
  { label: 'Pemilikan Barangan Rumah', ya: '', tidak: '', tidakBerkenaan: '', name: 'barang', selected: '' },
  { label: 'Pekerjaan Ketua Keluarga', ya: '', tidak: '', tidakBerkenaan: '', name: 'pekerjaan', selected: '' },
  { label: 'Pendapatan dan Perbelanjaan Seisi Rumah', ya: '', tidak: '', tidakBerkenaan: '', name: 'pendapatan', selected: '' },
  { label: 'Waris', ya: '', tidak: '', tidakBerkenaan: '', name: 'waris', selected: '' },
  { label: 'Peribadi Tanggungan', ya: '', tidak: '', tidakBerkenaan: '', name: 'peribadi_tanggungan', selected: '' },
  { label: 'Pengislaman Tanggungan', ya: '', tidak: '', tidakBerkenaan: '', name: 'pengislaman_tanggungan', selected: '' },
  { label: 'Pendidikan Tanggungan', ya: '', tidak: '', tidakBerkenaan: '', name: 'pendidikan_tanggungan', selected: '' },
  { label: 'Kesihatan Tanggungan', ya: '', tidak: '', tidakBerkenaan: '', name: 'kesihatan_tanggungan', selected: '' },
  { label: 'Kemahiran Tanggungan', ya: '', tidak: '', tidakBerkenaan: '', name: 'kemahiran_tanggungan', selected: '' },
  { label: 'Pekerjaan Tanggungan', ya: '', tidak: '', tidakBerkenaan: '', name: 'pekerjaan_tanggungan', selected: '' },
  { label: 'Perakuan Ketua Keluarga', ya: '', tidak: '', tidakBerkenaan: '', name: 'perakuan_ketua_keluarga', selected: '' },
  { label: 'Pengesahan Permastautin', ya: '', tidak: '', tidakBerkenaan: '', name: 'pengesahan_permastautin', selected: '' },
  { label: 'Pengesahan Pendapatan', ya: '', tidak: '', tidakBerkenaan: '', name: 'pengesahan_pendapatan', selected: '' },
]);

// Auto-generate Komen Penyemak when any row is marked 'Tidak'
const generateAutoComments = () => {
  const messages = semakanRows.value
    .filter((row) => row.selected === 'Tidak')
    .map((row) => `${row.label.toLowerCase()} tidak lengkap`);
  komenPenyemak.value = messages.join('\n');
};

watch(semakanRows, generateAutoComments, { deep: true });

// Sample form data - in real application, this would come from your API/backend
const formData = ref({
  // Section A - Maklumat Peribadi Asnaf
  nama_ketua_keluarga: 'Adnan bin Abu',
  jenis_id: 'Kad Pengenalan',
  nombor_id: '880101121234',
  nama: 'Adnan bin Abu',
  nama_selepas_islam: 'Adnan bin Abu',
  no_pengenalan: '880101121234',
  tarikh_lahir: '01/01/1988',
  jantina: 'Lelaki',
  bangsa: 'Melayu',
  warganegara: 'Warganegara',
  pendidikan_tertinggi: 'Ijazah',
  tarikh_masuk_islam: '01/01/2010',
  tarikh_masuk_kfam: '01/02/2010',
  status_perkahwinan: 'Berkahwin',
  
  // Section B - Maklumat Kesihatan
  tahap_kesihatan: 'Sihat',
  keadaan_kesihatan_sakit: 'Tidak Terlantar',
  kos_penjagaan_sakit: 'Berbayar',
  perbelanjaan_bulanan_sakit: '500.00',
  kesempurnaan_fizikal: 'Sempurna',
  sebab_kecacatan: '-',
  tahap_kecacatan: '-',
  perbelanjaan_bulanan_oku: '0.00',
  keadaan_kesihatan_uzur: 'Tidak Terlantar',
  kos_penjagaan_uzur: 'Berbayar',
  perbelanjaan_bulanan_uzur: '300.00',

  // Section C - Kemahiran
  kemahiran: 'Kemahiran Komputer, Kemahiran Memasak',

  // Section D - Maklumat Kediaman
  status_kediaman: 'Rumah Sendiri',
  tapak_rumah: '40000',
  jenis_rumah: 'Terrace',
  binaan_rumah: 'Batu',
  keadaan_kediaman: 'Baik/Sempurna',
  bekalan_air: 'Ada',
  bil_air: '50.00',
  bekalan_elektrik: 'Ada',
  bil_elektrik: '150.00',
  penyelenggaraan: 'Ada',
  bil_penyelenggaraan: '100.00',

  // Section E - Maklumat Pinjaman
  pemberi_pinjaman: 'Bank Islam',
  jenis_pinjaman: 'Perumahan',
  bayaran_bulanan: '1500.00',
  jumlah_perbelanjaan: '300000.00',
  tahun_mula_pinjaman: '2020-01-01',
  tahun_akhir_pinjaman: '2030-01-01',

  // Section F - Maklumat Pemilikan
  wang_simpanan: '5000.00',
  emas: '50.00',
  saham: '10000.00',
  kenderaan: 'Kereta 1, Motor 1',
  rumah_kedai: '0',
  tanah_sawah: '0',

  // Section G - Pengesahan
  dibantu_penolong_amil: 'Ya',
  nama_penolong_amil_bantuan: 'Ahmad bin Abdullah',
  kariah_bantuan: 'Masjid Al-Hidayah',
  tarikh_bantuan: '2024-01-15',
  hubungan_kakitangan_lzs: 'Tidak',
  nama_kakitangan: '-',
  jawatan_kakitangan: '-',
  pejabat_kakitangan: '-',
  hubungan_kakitangan: '-',
  tarikh_perakuan: '2024-01-15',

  // Section H - Pengesahan Bermastautin
  ulasan_pengesahan: 'Pengesahan Bermastautin',
  nama_pengesah: 'Mohd Yusof bin Ibrahim',
  jawatan_pengesah: 'Penghulu',
  no_telefon_pengesah: '0123456789',
  tarikh_pengesahan_permastautin: '2024-01-15',

  // Section I - Maklumat Penolong Amil
  nama_penolong_amil: 'Ahmad bin Abdullah',
  jenis_permohonan: 'Baru',
  tarikh_proses: '2024-01-15',

  // Section J - Penilaian Awal
  komitmen_tinggi: 'Ya',
  keperluan_mendesak: ['Perubatan', 'Pendidikan'],
  lain_keperluan: '-',
  dokumen_sokongan: ['Sijil Lahir', 'Kad Pengenalan', 'Slip Gaji'],

  // Section G: Maklumat Waris
  waris: [
    {
      nama: 'SITI BINTI MOHAMED',
      hubungan: 'Isteri',
      no_id: '880101121235',
      tarikh_lahir: '01/01/1988',
      jantina: 'Perempuan',
      bangsa: 'Melayu',
      warganegara: 'Warganegara',
      status_perkahwinan: 'Berkahwin',
      pekerjaan: 'Suri Rumah',
      pendapatan: '0.00'
    },
    {
      nama: 'MOHAMED BIN AHMAD',
      hubungan: 'Anak',
      no_id: '100101121236',
      tarikh_lahir: '01/01/2010',
      jantina: 'Lelaki',
      bangsa: 'Melayu',
      warganegara: 'Warganegara',
      status_perkahwinan: 'Bujang',
      pekerjaan: 'Pelajar',
      pendapatan: '0.00'
    }
  ],

  // Section K: Maklumat Peribadi Tanggungan
  tanggungan: [
    {
      // Maklumat Peribadi
      nama: 'ALI BIN AHMAD',
      jenis_id: 'Kad Pengenalan',
      no_id: '880101121237',
      no_pengenalan: '880101121237',
      jantina: 'Lelaki',
      tarikh_lahir: '01/01/1988',
      tempat_lahir: 'Kuala Lumpur',
      bangsa: 'Melayu',
      warganegara: 'Warganegara',
      status_perkahwinan: 'Berkahwin',
      tarikh_masuk_islam: '01/01/2010',
      tarikh_masuk_kfam: '01/02/2010',
      tempoh_menetap_selangor: '10',
      no_telefon: '0123456789',
      // Maklumat Perbankan
      nama_pemegang_akaun: 'ALI BIN AHMAD',
      bank: 'Bank Islam',
      no_akaun_bank: '1234567890',
      cara_pembayaran: 'Akaun',
      // Maklumat Pendidikan
      bersekolah: 'Ya',
      pendidikan_tertinggi: 'SPM',
      nama_sekolah: 'SMK Taman Melati',
      alamat_sekolah: 'Jalan Melati 1, Taman Melati',
      daerah_sekolah: 'Gombak',
      negeri_sekolah: 'Selangor',
      poskod_sekolah: '53100',
      jenis_sekolah: 'Sekolah Menengah Kebangsaan',
      // Maklumat Kesihatan
      tahap_kesihatan: 'Sihat',
      keadaan_kesihatan_sakit: 'Tidak Terlantar',
      kos_penjagaan_sakit: 'Berbayar',
      perbelanjaan_bulanan_sakit: '500.00',
      // Maklumat Pekerjaan
      pekerjaan_status: 'Bekerja',
      sektor_pekerjaan: 'Swasta',
      nama_majikan: 'ABC Sdn Bhd',
      no_tel_majikan: '0312345678',
      alamat_majikan: 'Jalan Industri 1, Taman Industri',
      bandar_majikan: 'Shah Alam',
      poskod_majikan: '40000',
      daerah_majikan: 'Petaling',
      negeri_majikan: 'Selangor',
      jawatan: 'Pekerja Am',
      negara_pekerjaan: 'Malaysia',
      status_jawatan: 'Tetap'
    }
  ],

  // Section L: Penilaian Awal
  penilaian_awal: {
    komitmen_tinggi: 'Ya',
    keperluan_mendesak: ['Makanan', 'Pendidikan', 'Kesihatan'],
    lain_keperluan: 'Bantuan kewangan untuk perubatan',
    dokumen_sokongan: [
      'Penyata bank.pdf',
      'Slip gaji.pdf',
      'Surat pengesahan.pdf'
    ]
  }
});

// Fake documents array (follow QB/03)
const documents = [
  {
    name: 'Sijil Nikah',
    type: 'PDF',
    url: '#',
  },
  {
    name: 'Salinan Kad Pengenalan',
    type: 'PDF',
    url: '#',
  },
  {
    name: 'Slip Gaji',
    type: 'PDF',
    url: '#',
  },
];

// Handle document download (demo)
function downloadDocument(doc) {
  // For demo, just log the document info
  // In production, you would trigger a real download
  // eslint-disable-next-line no-console
  console.log('Download document:', doc);
}

const handleHantar = () => {
  // Check if dokumen lengkap is "Tidak" before proceeding
  if (dokumenLengkap.value === 'Tidak') {
    // Show notification when "Tidak" is selected and Hantar is clicked
    showNotificationMessage('Notifikasi sudah dihantar ke pemohon.');
    return; // Don't proceed with navigation
  }
  
  // TODO: Implement send/hantar logic
  router.push('/BF-PRF/AS/FR/04');
};

const handleSimpanDraf = () => {
  // TODO: Implement save draft logic
  alert('Permohonan disimpan sebagai draf.');
};

const handleKembali = () => {
  // TODO: Implement back/kembali logic
  router.back();
};

// State for document completeness
const dokumenLengkap = ref('');

// Function to handle document completeness change
const handleDokumenLengkapChange = () => {
  try {
    // Validate that dokumenLengkap has a value
    if (!dokumenLengkap.value) {
      console.warn('Dokumen Lengkap value is undefined or null');
      return;
    }
    
    // This function is called when the radio button changes
    // The popup will now only show when Hantar button is clicked
    // eslint-disable-next-line no-console
    console.log('Dokumen Lengkap changed to:', dokumenLengkap.value);
    
    // Automatically update komen penyemak based on selection
    if (dokumenLengkap.value === 'Tidak') {
      komenPenyemak.value = 'Tidak Lengkap';
    } else if (dokumenLengkap.value === 'Ya') {
      komenPenyemak.value = '';
    }
  } catch (error) {
    console.error('Error handling dokumen lengkap change:', error);
  }
};

// State for notification
const showNotification = ref(false);
const notificationMessage = ref('');
const notificationFading = ref(false);

// Function to show notification
const showNotificationMessage = (message) => {
  notificationMessage.value = message;
  showNotification.value = true;
  setTimeout(() => {
    notificationFading.value = true;
    setTimeout(() => {
      showNotification.value = false;
      notificationFading.value = false;
    }, 300); // Transition duration
  }, 5000); // Show for 5 seconds
};

// New state for semakan data
const semakanData = ref({
  peribadi: 'Ya',
  pendidikan: 'Ya',
  pengislaman: 'Ya',
  perbankan: 'Ya',
  kesihatan: 'Ya',
  kemahiran: 'Ya',
  alamat: 'Ya',
  pinjaman: 'Ya',
  aset: 'Ya',
  barang: 'Ya',
  pekerjaan: 'Ya',
  pendapatan: 'Ya',
  waris: 'Ya',
  peribadi_tanggungan: 'Ya',
  pengislaman_tanggungan: 'Ya',
  pendidikan_tanggungan: 'Ya',
  kesihatan_tanggungan: 'Ya',
  kemahiran_tanggungan: 'Ya',
  pekerjaan_tanggungan: 'Ya',
  perakuan_ketua_keluarga: 'Ya',
  pengesahan_permastautin: 'Ya',
  pengesahan_pendapatan: 'Ya',
});

// Function to set all semakan radio buttons to "Ya"
const setAllSemakanToYa = () => {
  try {
    // Validate that semakanData exists
    if (!semakanData.value) {
      console.error('Semakan data is not initialized');
      return;
    }
    
    // Set all fields to "Ya"
    semakanData.value.peribadi = 'Ya';
    semakanData.value.pendidikan = 'Ya';
    semakanData.value.pengislaman = 'Ya';
    semakanData.value.perbankan = 'Ya';
    semakanData.value.kesihatan = 'Ya';
    semakanData.value.kemahiran = 'Ya';
    semakanData.value.alamat = 'Ya';
    semakanData.value.pinjaman = 'Ya';
    semakanData.value.aset = 'Ya';
    semakanData.value.barang = 'Ya';
    semakanData.value.pekerjaan = 'Ya';
    semakanData.value.pendapatan = 'Ya';
    semakanData.value.waris = 'Ya';
    semakanData.value.peribadi_tanggungan = 'Ya';
    semakanData.value.pengislaman_tanggungan = 'Ya';
    semakanData.value.pendidikan_tanggungan = 'Ya';
    semakanData.value.kesihatan_tanggungan = 'Ya';
    semakanData.value.kemahiran_tanggungan = 'Ya';
    semakanData.value.pekerjaan_tanggungan = 'Ya';
    semakanData.value.perakuan_ketua_keluarga = 'Ya';
    semakanData.value.pengesahan_permastautin = 'Ya';
    semakanData.value.pengesahan_pendapatan = 'Ya';
    
    // Show success notification
    showNotificationMessage('Semua pilihan semakan telah diubah ke Ya.');
  } catch (error) {
    console.error('Error setting all semakan to Ya:', error);
    showNotificationMessage('Ralat berlaku semasa mengubah pilihan semakan.');
  }
};

</script>

<style scoped>
@media print {
  .rs-button {
    display: none;
  }
}
</style>
