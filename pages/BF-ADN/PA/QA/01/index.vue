<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Seksyen Kiri -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Maklumat Aduan & Profil -->
        <rs-card>
          <template #header>
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Icon name="ph:info" class="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 class="text-lg font-semibold text-gray-900">Maklumat Aduan & Profil</h2>
                <p class="text-sm text-gray-500">Semakan profil dan ringkasan aduan</p>
              </div>
            </div>
          </template>
          <template #body>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit type="text" label="No. Aduan" :value="aduan.noAduan" disabled />
              <FormKit type="text" label="Nama Penuh" :value="aduan.nama" disabled />
              <FormKit type="text" label="Tarikh Aduan" :value="aduan.tarikh" disabled />
              <FormKit type="text" label="Kelas Aduan" :value="aduan.kategori" disabled />
              <FormKit type="text" label="Status Profil" :value="aduan.statusProfil" disabled />
              <FormKit type="text" label="Alamat" :value="aduan.alamat" disabled />
              <FormKit type="textarea" label="Penyataan Masalah" :value="aduan.pernyataanMasalah" disabled />
              <FormKit type="textarea" label="Ringkasan Aduan" :value="aduan.ringkasan" disabled />
            </div>
          </template>
        </rs-card>

        <!-- Senarai Dokumen Sokongan -->
        <rs-card>
          <template #header>
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Icon name="ph:paperclip" class="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 class="text-lg font-semibold text-gray-900">Dokumen Sokongan</h2>
                <p class="text-sm text-gray-500">Senarai fail dimuat naik</p>
              </div>
            </div>
          </template>
          <template #body>
            <ul class="list-disc pl-5 space-y-1 text-gray-800">
              <li v-for="(doc, index) in aduan.dokumen" :key="index">{{ doc }}</li>
            </ul>
          </template>
        </rs-card>

        <!-- Cadangan Bantuan -->
        <rs-card>
          <template #header>
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Icon name="ph:list-plus" class="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h2 class="text-lg font-semibold text-gray-900">Syor Bantuan</h2>
                <p class="text-sm text-gray-500">Isi bantuan dicadangkan oleh sistem</p>
              </div>
            </div>
          </template>
          <template #body>
            <FormKit type="checkbox" label="Sahkan alamat pemastautin adalah tepat" v-model="formData.sahAlamat" />

            <div v-for="(bantuan, index) in formData.bantuanList" :key="index" class="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
              <FormKit type="text" label="Jenis Bantuan" v-model="bantuan.jenis" />
              <FormKit type="number" label="Kuantiti/Jumlah (RM)" v-model="bantuan.jumlah" />
              <FormKit type="text" label="Tempoh (jika berulang)" v-model="bantuan.tempoh" />
              <FormKit type="textarea" label="Justifikasi" v-model="bantuan.justifikasi" />
            </div>

            <div class="mt-4">
              <rs-button variant="primary-outline" @click="tambahBarisBantuan">+ Tambah Bantuan</rs-button>
            </div>
          </template>
        </rs-card>
      </div>

      <!-- Sidebar Kanan -->
      <div class="space-y-6">
        <rs-card>
          <template #header>
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Icon name="ph:check-circle" class="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h2 class="text-lg font-semibold text-gray-900">Keputusan Quick Assessment</h2>
                <p class="text-sm text-gray-500">Pilih status dan serah untuk kelulusan</p>
              </div>
            </div>
          </template>
          <template #body>
            <FormKit type="select" label="Status" v-model="formData.status" :options="['Layak', 'Tidak Layak', 'Perlu Siasatan Lapangan']" />
            <FormKit type="textarea" label="Catatan Penilaian" v-model="formData.catatan" />
            <div class="flex justify-end gap-4 mt-6">
              <rs-button variant="primary-outline" @click="handleCancel">Batal</rs-button>
              <rs-button variant="primary" @click="handleSubmit">Simpan & Serah</rs-button>
            </div>
          </template>
        </rs-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const breadcrumb = [
  { name: 'Pengurusan Aduan', path: '/BF-ADN/PA', type: 'link' },
  { name: 'Quick Assessment', type: 'current' }
];

const aduan = ref({
  noAduan: 'ADN-2025-007',
  nama: 'Siti binti Hasan',
  tarikh: '2025-06-16',
  kategori: 'Kelas 2',
  statusProfil: 'Sudah Berdaftar',
  alamat: 'No. 12, Jalan Mawar, Taman Seri Impian',
  pernyataanMasalah: 'Pendapatan tidak mencukupi untuk menampung keperluan asas',
  ringkasan: 'Individu merupakan ibu tunggal dengan 3 anak, tiada pekerjaan tetap.',
  dokumen: ['Salinan Kad Pengenalan.pdf', 'Bil Utiliti.jpg']
});

const formData = ref({
  sahAlamat: false,
  bantuanList: [
    { jenis: 'Bantuan Keperluan Hidup (B104)', jumlah: 300, tempoh: '1 bulan', justifikasi: '' }
  ],
  status: '',
  catatan: ''
});

const tambahBarisBantuan = () => {
  formData.value.bantuanList.push({ jenis: '', jumlah: null, tempoh: '', justifikasi: '' });
};

const handleSubmit = () => {
  alert('Quick Assessment disimpan dan dihantar ke EOAD.');
};

const handleCancel = () => {
  window.history.back();
};
</script>
