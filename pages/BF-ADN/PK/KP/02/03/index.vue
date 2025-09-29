<template>
  <div>
    <!-- Breadcrumb + Kembali -->
    <div class="flex justify-between items-center mb-6">
      <LayoutsBreadcrumb :items="breadcrumb" />
      <NuxtLink to="/BF-ADN/PK/KP/02/01">
        <rs-button variant="secondary" size="sm">Kembali</rs-button>
      </NuxtLink>
    </div>

    <!-- Title -->
    <h2 class="text-xl font-bold mb-6">Butiran Kelulusan Konfigurasi Penutupan Aduan</h2>

    <!-- Application Details -->
    <div class="border rounded-lg shadow p-4 bg-white mb-6">
      <h3 class="font-semibold mb-4">Butiran Permohonan</h3>
      <p><b>Sebab Penutupan:</b> Bantuan telah diterima daripada agensi lain</p>
      <p><b>Tarikh Mula Kuasa:</b> 25/10/2025</p>
      <p>
        <b>Status Konfigurasi:</b>
        <span class="bg-green-500 text-white px-2 py-1 text-xs rounded">Aktif</span>
      </p>
      <p>
        <b>Catatan Permohonan:</b>
        Konfigurasi tambahan untuk menyokong standardisasi proses penutupan aduan.
      </p>
      <p><b>Tarikh Permohonan:</b> 15/09/2025</p>
      <p><b>Dimohon Oleh:</b> Siti Norlia</p>
    </div>

    <!-- Approval Section (Approved) -->
    <div class="border rounded-lg shadow p-4 bg-white mb-6">
      <h3 class="font-semibold mb-4">Maklumat Kelulusan</h3>
      <p><b>Diluluskan Oleh:</b> Ketua Jabatan</p>
      <p><b>Tarikh Kelulusan:</b> 16/09/2025</p>
      <p><b>Ulasan Ketua Jabatan:</b> Semua butiran lengkap dan telah disemak.</p>
      <p>
        <b>Status Kelulusan:</b>
        <span class="bg-green-500 text-white px-2 py-1 text-xs rounded">Diluluskan</span>
      </p>
    </div>

    <!-- Approval Section (Rejected) -->
    <div class="border rounded-lg shadow p-4 bg-white mb-6">
      <h3 class="font-semibold mb-4">Maklumat Kelulusan</h3>
      <p><b>Disemak Oleh:</b> Ketua Jabatan</p>
      <p><b>Tarikh Semakan:</b> 16/09/2025</p>
      <p><b>Ulasan Ketua Jabatan:</b> Permohonan tidak memenuhi kriteria yang ditetapkan.</p>
      <p>
        <b>Status Kelulusan:</b>
        <span class="bg-red-500 text-white px-2 py-1 text-xs rounded">Ditolak</span>
      </p>
    </div>

    <!-- Approval Section (Pending) -->
    <div class="border rounded-lg shadow p-4 bg-white">
      <h3 class="font-semibold mb-4">Maklumat Kelulusan</h3>
      <p>
        <b>Status Kelulusan:</b>
        <span class="bg-yellow-500 text-white px-2 py-1 text-xs rounded">Menunggu Kelulusan</span>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

definePageMeta({
  title: "Butiran Kelulusan Konfigurasi Penutupan Aduan",
  path: "/BF-ADN/PK/KP/02/03",
});

const breadcrumb = ref([
  { name: "Pengurusan SLA", type: "link", path: "/BF-ADN/SLA" },
  { name: "Senarai Permohonan Kelulusan", type: "link", path: "/BF-ADN/PK/KP/02/01" },
  { name: "Butiran Kelulusan Konfigurasi Penutupan Aduan", type: "current" },
]);
</script>
