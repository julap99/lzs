<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />
    <div class="container mx-auto px-4 py-6">
      <h2 class="text-2xl font-bold mb-4">
        Ringkasan Had Kifayah & Multidimensi
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Had Kifayah Summary -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold mb-2">Had Kifayah</h3>
          <div class="mb-2">
            Jurang Had Kifayah: <span class="font-bold">RM-968</span>
          </div>
          <div class="mb-2">
            Peratusan Perbezaan: <span class="font-bold">50.81%</span>
          </div>
          <div class="mb-2">
            Kategori Keluarga Asnaf: <span class="font-bold">Miskin</span>
          </div>
          <div class="mb-2">
            Kategori Asnaf: <span class="font-bold">Miskin</span>
          </div>
          <div class="mb-2">
            Jumlah Had Kifayah: <span class="font-bold">RM1968.00 </span>
          </div>
        </div>
        <!-- Multidimensi Summary -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold mb-2">Multidimensi</h3>
          <div class="mb-2">
            Merit Keluarga: <span class="font-bold">0.55</span>
          </div>
          <div class="mb-2">
            Status Multidimensi: <span class="font-bold">Produktif C</span>
          </div>
          <div class="mb-2">
            Quadrant: <span class="font-bold">Asnaf Produktif Sementara</span>
          </div>
        </div>
      </div>
      <div class="flex justify-between items-center mt-6">
        <rs-button variant="primary-outline" @click="handleKembali"
          >Kembali</rs-button
        >
        <rs-button variant="primary" @click="handleSeterusnya"
          >Seterusnya</rs-button
        >
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  title: "Ringkasan",
});

const breadcrumb = ref([
  {
    name: "Profiling",
    type: "link",
    path: "/BF-PRF/AS/FR/05",
  },
  {
    name: "Ringkasan",
    type: "current",
    path: "/BF-PRF/AS/FR/05_01",
  },
]);

const handleKembali = () => {
  navigateTo("/BF-PRF/AS/FR/05");
};
const handleSeterusnya = () => {
  navigateTo("/BF-BTN/tugasan/bantuan/siasatan/siasatan-eoad-2/NAS-2025-0004");
};
</script>
