<template>
  <LayoutsBreadcrumb :breadcrumb="breadcrumb" />
  <rs-card>
    <template #header>
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-semibold">Semakan Dan Kelulusan</h2>
      </div>
    </template>
    <template #body>
      <FormKit
        type="form"
        :actions="false"
      >
        <!-- Nama Aktiviti -->
        <FormKit
          type="text"
          name="namaAktiviti"
          label="Nama Aktiviti"
          :disabled="true"
          :value="formData.namaAktiviti"
        />

        <!-- Lokasi/Tempat -->
        <FormKit
          type="text"
          name="lokasi"
          label="Lokasi/Tempat"
          :disabled="true"
          :value="formData.lokasi"
        />

        <!-- Tarikh dan Masa Mula -->
        <FormKit
          type="datetime-local"
          name="tarikhMasaMula"
          label="Tarikh dan Masa Mula"
          :disabled="true"
          :value="formData.tarikhMasaMula"
        />

        <!-- Tarikh dan Masa Tamat -->
        <FormKit
          type="datetime-local"
          name="tarikhMasaTamat"
          label="Tarikh dan Masa Tamat"
          :disabled="true"
          :value="formData.tarikhMasaTamat"
        />

        <!-- Jenis Aktiviti -->
        <FormKit
          type="select"
          name="jenisAktiviti"
          label="Jenis Aktiviti"
          :disabled="true"
          :value="formData.jenisAktiviti"
          :options="[
            { label: 'Mesyuarat', value: 'MESYUARAT' },
            { label: 'Program', value: 'PROGRAM' },
            { label: 'Latihan', value: 'LATIHAN' }
          ]"
        />

        <!-- Kategori Amil -->
        <FormKit
          type="select"
          name="kategoriAmil"
          label="Kategori Amil"
          :disabled="true"
          :value="formData.kategoriAmil"
          :options="[
            { label: 'Fitrah', value: 'FITRAH' },
            { label: 'Padi', value: 'PADI' },
            { label: 'Kariah', value: 'KARIAH' },
            { label: 'Komuniti', value: 'KOMUNITI' }
          ]"
        />

        <!-- Senarai Peserta -->
        <FormKit
          type="select"
          name="senaraiPeserta"
          label="Senarai Peserta"
          :disabled="true"
          :value="formData.senaraiPeserta"
          :options="[
            { label: 'Semua Penolong Amil', value: 'SEMUA' },
            { label: 'Berdasarkan Kategori', value: 'KATEGORI' },
            { label: 'Berdasarkan Daerah', value: 'DAERAH' },
            { label: 'Berdasarkan Jawatan', value: 'JAWATAN' }
          ]"
        />

        <!-- Action Buttons -->
        <div class="flex justify-end gap-4 mt-6">
          <button
            type="button"
            class="btn btn-danger"
            @click="showRejectModal = true"
          >
            Tolak Lulus
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="handleApprove"
          >
            Lulus
          </button>
        </div>
      </FormKit>
    </template>
  </rs-card>

  <!-- Rejection Modal -->
  <rs-modal
    v-model="showRejectModal"
    title="Tolak Lulus"
    size="md"
  >
    <template #body>
      <FormKit
        type="form"
        @submit="submitRejection"
        :actions="false"
      >
        <FormKit
          type="textarea"
          name="reason"
          label="Sebab Penolakan"
          placeholder="Masukkan sebab penolakan"
          validation="required"
          validation-label="Sebab penolakan"
        />
        <div class="flex justify-end gap-4 mt-6">
          <button
            type="button"
            class="btn btn-secondary"
            @click="showRejectModal = false"
          >
            Batal
          </button>
          <button
            type="submit"
            class="btn btn-danger"
          >
            Hantar
          </button>
        </div>
      </FormKit>
    </template>
  </rs-modal>
</template>

<script setup>
import { ref } from 'vue';

// Page metadata
useHead({
  title: 'Semakan Dan Kelulusan',
  meta: [
    {
      name: 'description',
      content: 'Halaman untuk semakan dan kelulusan aktiviti'
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
    title: 'Semakan',
    path: '/BF-PA/KF/MP/02'
  }
]);

// Form data (would be populated from API/store in real app)
const formData = ref({
  namaAktiviti: "Mesyuarat Bulanan Penolong Amil",
  lokasi: "Dewan Utama",
  tarikhMasaMula: "2024-03-20T09:00",
  tarikhMasaTamat: "2024-03-20T12:00",
  jenisAktiviti: "MESYUARAT",
  kategoriAmil: "KOMUNITI",
  senaraiPeserta: "SEMUA"
});

// Modal state
const showRejectModal = ref(false);

// Handle approval
const handleApprove = () => {
  alert("Aktiviti tersebut telah diluluskan");
  navigateTo("/BF-PA/KF/MP/03");
};

// Submit rejection
const submitRejection = () => {
  alert("Aktiviti tersebut telah ditolak");
  showRejectModal.value = false;
  navigateTo("/BF-PA/KF/MP");
};
</script> 