<template>
  <LayoutsBreadcrumb :breadcrumb="breadcrumb" />
  <rs-card>
    <template #header>
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-semibold">Tambah / Kemaskini Maklumat Aktiviti</h2>
      </div>
    </template>
    <template #body>
      <FormKit
        type="form"
        @submit="handleSubmit"
        :actions="false"
      >
        <!-- Nama Aktiviti -->
        <FormKit
          type="text"
          name="namaAktiviti"
          label="Nama Aktiviti"
          placeholder="Masukkan nama aktiviti"
          validation="required"
          validation-label="Nama aktiviti"
        />

        <!-- Lokasi/Tempat -->
        <FormKit
          type="text"
          name="lokasi"
          label="Lokasi/Tempat"
          placeholder="Masukkan lokasi atau tempat"
          validation="required"
          validation-label="Lokasi"
        />

        <!-- Sesi -->
        <FormKit
          type="select"
          name="sesi"
          label="Sesi"
          placeholder="Pilih bilangan sesi"
          :options="[
            { label: '1 Sesi', value: '1' },
            { label: '2 Sesi', value: '2' }
          ]"
          validation="required"
          validation-label="Sesi"
        />

        <!-- Tarikh dan Masa Mula -->
        <FormKit
          type="datetime-local"
          name="tarikhMasaMula"
          label="Tarikh dan Masa Mula"
          validation="required"
          validation-label="Tarikh dan masa mula"
        />

        <!-- Tarikh dan Masa Tamat -->
        <FormKit
          type="datetime-local"
          name="tarikhMasaTamat"
          label="Tarikh dan Masa Tamat"
          validation="required"
          validation-label="Tarikh dan masa tamat"
        />

        <!-- Jenis Aktiviti -->
        <FormKit
          type="select"
          name="jenisAktiviti"
          label="Jenis Aktiviti"
          placeholder="Pilih jenis aktiviti"
          :options="[
            { label: 'Mesyuarat', value: 'MESYUARAT' },
            { label: 'Program', value: 'PROGRAM' },
            { label: 'Latihan', value: 'LATIHAN' }
          ]"
          validation="required"
          validation-label="Jenis aktiviti"
        />

        <!-- Kategori Amil -->
        <FormKit
          type="select"
          name="kategoriAmil"
          label="Kategori Amil"
          placeholder="Pilih kategori amil"
          :options="[
            { label: 'Fitrah', value: 'FITRAH' },
            { label: 'Padi', value: 'PADI' },
            { label: 'Kariah', value: 'KARIAH' },
            { label: 'Komuniti', value: 'KOMUNITI' }
          ]"
          validation="required"
          validation-label="Kategori amil"
        />

        <!-- Senarai Peserta -->
        <FormKit
          type="select"
          name="senaraiPeserta"
          label="Senarai Peserta"
          placeholder="Pilih peserta"
          :options="[
            { label: 'Semua Penolong Amil', value: 'SEMUA' },
            { label: 'Berdasarkan Kategori', value: 'KATEGORI' },
            { label: 'Berdasarkan Daerah', value: 'DAERAH' },
            { label: 'Berdasarkan Jawatan', value: 'JAWATAN' }
          ]"
          validation="required"
          validation-label="Senarai peserta"
        />

        <!-- Submit Button -->
        <div class="flex justify-end mt-6">
          <FormKit
            type="submit"
            label="Simpan dan Hantar"
            input-class="btn btn-primary"
          />
        </div>
      </FormKit>
    </template>
  </rs-card>
</template>

<script setup>
import { ref } from 'vue';
import { useToast } from "vue-toastification";

const toast = useToast();

// Page metadata
useHead({
  title: 'Tambah / Kemaskini Maklumat Aktiviti',
  meta: [
    {
      name: 'description',
      content: 'Halaman untuk menambah atau mengemaskini maklumat aktiviti'
    }
  ]
});

// Breadcrumb data
const breadcrumb = ref([
  {
    title: 'Utama',
    path: '/'
  },
  {
    title: 'BF-PA',
    path: '/BF-PA'
  },
  {
    title: 'Konfigurasi',
    path: '/BF-PA/KF'
  },
  {
    title: 'Aktiviti',
    path: '/BF-PA/KF/MP'
  },
  {
    title: 'Tambah / Kemaskini',
    path: '/BF-PA/KF/MP/01'
  }
]);

// Handle form submission
const handleSubmit = (formData) => {
  toast.success("Maklumat aktiviti telah berjaya disimpan");
  navigateTo("/BF-PA/KF/MP/02");
};
</script> 