<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card>
      <template #header>
        <div class="flex justify-between items-center">
          <h1 class="text-2xl font-bold">Butiran Aduan</h1>
          <div class="flex items-center gap-4">
            <rs-button
              v-if="!isAccepted"
              variant="primary"
              @click="showAcceptModal = true"
            >
              Terima Tugasan
            </rs-button>
            <rs-badge v-if="isAccepted" variant="success" size="lg">
              Tugasan Diambil
            </rs-badge>
            <rs-button
              v-if="isAccepted"
              variant="primary"
              @click="navigateToTask"
            >
              Pergi ke Tugasan
              <Icon name="mdi:arrow-right" class="ml-2" size="1rem" />
            </rs-button>
          </div>
        </div>
      </template>

      <template #body>
        <div class="space-y-8">
          <!-- Maklumat Aduan -->
          <div class="bg-white p-6 rounded-lg border border-gray-200">
            <h2 class="text-lg font-semibold mb-4">Maklumat Aduan</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p class="text-sm text-gray-500">No. Aduan</p>
                <p class="font-medium">{{ aduanData.noAduan }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Tarikh Aduan</p>
                <p class="font-medium">
                  {{ formatDate(aduanData.tarikhAduan) }}
                </p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Nama Aduan</p>
                <p class="font-medium">{{ aduanData.namaAduan }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Status</p>
                <rs-badge
                  :variant="getStatusVariant(aduanData.status)"
                  size="sm"
                >
                  {{ aduanData.status }}
                </rs-badge>
              </div>
            </div>
          </div>

          <!-- Butiran Aduan -->
          <div class="bg-white p-6 rounded-lg border border-gray-200">
            <h2 class="text-lg font-semibold mb-4">Butiran Aduan</h2>
            <div class="space-y-6">
              <div>
                <p class="text-sm text-gray-500 mb-2">Pernyataan Masalah</p>
                <rs-badge
                  :variant="
                    getPernyataanMasalahVariant(aduanData.pernyataanMasalah)
                  "
                  size="sm"
                >
                  {{ aduanData.pernyataanMasalah }}
                </rs-badge>
              </div>
              <div>
                <p class="text-sm text-gray-500 mb-2">Ringkasan Aduan</p>
                <p class="text-gray-700">{{ aduanData.ringkasanAduan }}</p>
              </div>
            </div>
          </div>

          <!-- Maklumat Individu Dibantu -->
          <div class="bg-white p-6 rounded-lg border border-gray-200">
            <h2 class="text-lg font-semibold mb-4">
              Maklumat Individu Dibantu
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p class="text-sm text-gray-500">Nama Penuh</p>
                <p class="font-medium">{{ aduanData.namaPenuh }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">No. Kad Pengenalan</p>
                <p class="font-medium">{{ aduanData.noKadPengenalan }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Emel</p>
                <p class="font-medium">{{ aduanData.emel }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">No. Telefon</p>
                <p class="font-medium">{{ aduanData.noTelefon }}</p>
              </div>
            </div>

            <div class="mt-6">
              <h3 class="text-md font-medium text-gray-700 mb-4">Alamat</h3>
              <div class="space-y-2">
                <p class="font-medium">{{ aduanData.alamatBaris1 }}</p>
                <p class="font-medium">{{ aduanData.alamatBaris2 }}</p>
                <p class="font-medium">{{ aduanData.daerah }}</p>
                <p class="font-medium">{{ aduanData.kariah }}</p>
              </div>
            </div>
          </div>

          <!-- Lampiran -->
          <div
            v-if="aduanData.lampiran && aduanData.lampiran.length > 0"
            class="bg-white p-6 rounded-lg border border-gray-200"
          >
            <h2 class="text-lg font-semibold mb-4">Lampiran</h2>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div
                v-for="(file, index) in aduanData.lampiran"
                :key="index"
                class="relative"
              >
                <img
                  v-if="isImage(file)"
                  :src="file"
                  :alt="'Lampiran ' + (index + 1)"
                  class="w-full h-32 object-cover rounded-lg"
                />
                <div
                  v-else
                  class="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center"
                >
                  <i class="fas fa-file-pdf text-4xl text-red-500"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Accept Task Modal -->
    <rs-modal
      v-model="showAcceptModal"
      title="Terima Tugasan"
      :show-close="true"
      @close="showAcceptModal = false"
      position="center"
      ok-title="Ya, Terima"
      :ok-callback="handleAcceptTask"
      cancel-title="Tidak"
      :cancel-callback="() => (showAcceptModal = false)"
    >
      <template #default>
        <p class="text-center mb-6">
          Adakah anda pasti untuk menerima tugasan ini?
        </p>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const showAcceptModal = ref(false);
const isAccepted = ref(false);

definePageMeta({
  title: "Butiran Aduan",
});

const breadcrumb = ref([
  {
    name: "Pengurusan Aduan",
    type: "link",
    path: "/BF-ADN/PA/AT/01",
  },
  {
    name: "Butiran Aduan",
    type: "current",
    path: "/BF-ADN/PA/AT/02",
  },
]);

// Sample data - In real application, this would come from an API
const aduanData = ref({
  noAduan: "ADN-2024-001",
  namaAduan: "Aduan Keselamatan",
  pernyataanMasalah:
    "Terputus Bekalan Makanan/Tiada Tempat Tinggal (Kelas 1/Merah)",
  ringkasanAduan:
    "Individu ini memerlukan bantuan segera kerana tiada tempat tinggal dan bekalan makanan. Keadaan kesihatan juga tidak stabil.",
  tarikhAduan: "2024-03-15",
  status: "Masih Kosong",
  namaPenuh: "Ahmad bin Abdullah",
  noKadPengenalan: "800101-01-1234",
  emel: "ahmad@email.com",
  noTelefon: "0123456789",
  alamatBaris1: "No. 123, Jalan Merdeka",
  alamatBaris2: "Taman Seri Indah",
  daerah: "Kuala Lumpur",
  kariah: "Masjid Jamek",
  lampiran: [
    "https://example.com/image1.jpg",
    "https://example.com/document.pdf",
  ],
});

const getStatusVariant = (status) => {
  const variants = {
    "Masih Kosong": "warning",
    Diambil: "success",
  };
  return variants[status] || "default";
};

const getPernyataanMasalahVariant = (pernyataan) => {
  if (pernyataan.includes("Kelas 1/Merah")) return "danger";
  if (pernyataan.includes("Kelas 2/Kuning")) return "warning";
  if (pernyataan.includes("Kelas 3/Hijau")) return "success";
  return "default";
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("ms-MY", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const isImage = (file) => {
  return /\.(jpg|jpeg|png)$/i.test(file);
};

const handleAcceptTask = () => {
  // In real application, this would be an API call
  aduanData.value.status = "Diambil";
  isAccepted.value = true;
  showAcceptModal.value = false;

  // Show success message
  // You can use your preferred notification system here
};

const navigateToTask = () => {
  // Navigate to task management page
  router.push(`/BF-ADN/PA/TS/02`);
};

onMounted(() => {
  // In real application, fetch aduan data based on route.params.id
  const aduanId = route.params.id;
  // Fetch aduan data from API
});
</script>

<style lang="scss" scoped></style>
