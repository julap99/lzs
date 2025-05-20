<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Keluar Tunai & Agih Tunai</h2>
        </div>
      </template>

      <template #body>
        <div class="space-y-6">
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="text-lg font-semibold mb-2">Keterangan Aktiviti</h3>
            <p class="text-gray-700">
              Proses pengeluaran tunai secara fizikal oleh EPOAD dari Tabung Operasi Daerah dan agihan bantuan dibuat secara langsung kepada pemohon di lokasi aduan.
            </p>
          </div>

          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="text-lg font-semibold mb-2">Kaedah/Operasi</h3>
            <ol class="list-decimal list-inside space-y-2 text-gray-700">
              <li>EPOAD mengakses sistem NAS dan membuka permohonan bantuan yang telah diluluskan.</li>
              <li>Pegawai mengeluarkan tunai dari Tabung Operasi Daerah seperti jumlah diluluskan.</li>
              <li>Turun ke lokasi penerima berdasarkan maklumat aduan.</li>
              <li>Serahkan wang tunai secara fizikal kepada pemohon.</li>
              <li>Ambil bukti penerimaan seperti cap jari, gambar, atau tandatangan digital.</li>
            </ol>
          </div>

          <div class="flex justify-end mt-6">
            <rs-button variant="primary-outline" @click="goBack">
              Kembali
            </rs-button>
          </div>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

definePageMeta({
  title: "Keluar Tunai & Agih Tunai",
});

const router = useRouter();

const breadcrumb = ref([
  {
    name: "Pengurusan Tunai",
    type: "link",
    path: `/BF-PTPC/PC/TD/01`,
  },
  {
    name: "Tunai Dilapangan",
    type: "link",
    path: `/BF-PTPC/PC/TD/01`,
  },
  {
    name: "Keluar Tunai & Agih Tunai",
    type: "current",
    path: "/BF-PTPC/PC/TD/04",
  },
]);

const goBack = () => {
  router.push("/BF-PTPC/PC/TD/01");
};
</script>
