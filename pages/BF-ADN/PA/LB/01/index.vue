<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Maklumat Aduan -->
      <rs-card>
        <template #header>
          <CardHeader icon="mdi:file-document-edit" title="Maklumat Aduan" subtitle="Maklumat aduan berdasarkan Quick Assessment" />
        </template>
        <template #body>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormKit type="text" label="No. Aduan" :value="aduan.noAduan" disabled />
            <FormKit type="text" label="Nama Pemohon" :value="aduan.nama" disabled />
            <FormKit type="text" label="Tarikh Aduan" :value="aduan.tarikh" disabled />
            <FormKit type="text" label="Kelas Aduan" :value="aduan.kelas" disabled />
          </div>
        </template>
      </rs-card>

      <!-- Quick Assessment -->
      <rs-card>
        <template #header>
          <CardHeader icon="mdi:clipboard-check" title="Penilaian Quick Assessment" subtitle="Hasil penilaian dan cadangan bantuan" />
        </template>
        <template #body>
          <div class="space-y-2 text-sm text-gray-700">
            <p><strong>Status Pemastautin:</strong> {{ quickAssessmentData.pemastautin }}</p>
            <p><strong>Cadangan Bantuan:</strong> B104 – Bantuan Keperluan Hidup (SEGERA)</p>
            <p><strong>Catatan Pegawai:</strong> {{ quickAssessmentData.catatan }}</p>
          </div>
        </template>
      </rs-card>

      <!-- Kelulusan -->
      <rs-card>
        <template #header>
          <CardHeader icon="mdi:check-decagram" title="Kelulusan Bantuan B104" subtitle="Luluskan bantuan SEGERA yang dicadangkan" />
        </template>
        <template #body>
          <FormKit type="select" label="Keputusan" v-model="formData.keputusan" :options="['Lulus', 'Perlu Siasatan Lapangan']" />
          <FormKit type="textarea" label="Justifikasi" v-model="formData.catatan" />

          <div class="mt-6 flex justify-end gap-4">
            <rs-button variant="primary-outline" @click="handleCancel">Batal</rs-button>
            <rs-button variant="primary" @click="handleSubmit">Simpan & Serah</rs-button>
          </div>
        </template>
      </rs-card>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const breadcrumb = [
  { name: 'Pengurusan Aduan', path: '/BF-ADN/PA', type: 'link' },
  { name: 'Kelulusan Bantuan SEGERA', type: 'current' }
];

const aduan = ref({
  noAduan: 'ADN-2025-009',
  nama: 'Siti Aminah bt Osman',
  tarikh: '2025-06-15',
  kelas: 'Kelas 2'
});

const quickAssessmentData = ref({
  pemastautin: 'Disahkan',
  catatan: 'Pemohon tinggal bersama keluarga, tiada pekerjaan tetap, sesuai diberi bantuan B104.'
});

const formData = ref({
  keputusan: '',
  catatan: ''
});

const handleSubmit = () => {
  alert('Keputusan kelulusan telah disimpan dan dihantar.');
};

const handleCancel = () => {
  window.history.back();
};
</script>
