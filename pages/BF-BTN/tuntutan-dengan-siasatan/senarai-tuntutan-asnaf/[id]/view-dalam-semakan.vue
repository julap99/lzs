<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Lihat Tuntutan GL (Dalam Semakan)</h2>
          <rs-button
            variant="secondary"
            @click="handleBack"
          >
            <Icon name="material-symbols:arrow-back" class="w-4 h-4 mr-1" />
            Kembali
          </rs-button>
        </div>
      </template>

      <template #body>
        <!-- Section 1: Pilih GL -->
        <div class="mb-8">
          <h3 class="text-lg font-medium mb-4">Pilih GL</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Nombor GL
              </label>
              <p class="text-gray-900">{{ tuntutanData.noGL }}</p>
            </div>
          </div>
        </div>

        <!-- Section 2: Maklumat Bantuan -->
        <div class="mb-8">
          <h3 class="text-lg font-medium mb-4">Maklumat Bantuan</h3>
          <div class="bg-gray-50 p-4 rounded-lg mb-6">
            <h4 class="text-md font-medium mb-4">Butiran Asas Jenis Bantuan</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Kod Bantuan
                </label>
                <p class="text-gray-900">{{ bantuanData.kodBantuan }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Jenis Bantuan
                </label>
                <p class="text-gray-900">{{ bantuanData.jenisBantuan }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Bahan Bantuan
                </label>
                <p class="text-gray-900">{{ bantuanData.bahanBantuan }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Pakej Bantuan
                </label>
                <p class="text-gray-900">{{ bantuanData.pakejBantuan }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Kelayakan Bantuan
                </label>
                <p class="text-gray-900">{{ bantuanData.kelayakanBantuan }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Section 3: Maklumat Tuntutan -->
        <div class="mb-8">
          <h3 class="text-lg font-medium mb-4">Maklumat Tuntutan</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                No. GL
              </label>
              <p class="text-gray-900">{{ tuntutanData.noGL }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Amaun Tuntutan (RM)
              </label>
              <p class="text-gray-900">RM {{ formatNumber(tuntutanData.amaunTuntutan) }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Tarikh
              </label>
              <p class="text-gray-900">{{ formatDate(tuntutanData.tarikh) }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Catatan Tambahan
              </label>
              <p class="text-gray-900">{{ tuntutanData.catatanTambahan || '-' }}</p>
            </div>
          </div>
        </div>

        <!-- Section 4: Muat Naik Dokumen Sokongan -->
        <div class="mb-8">
          <h3 class="text-lg font-medium mb-4">Dokumen Sokongan</h3>
          <div class="space-y-2">
            <div
              v-for="(doc, index) in tuntutanData.dokumenSokongan"
              :key="index"
              class="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
            >
              <span class="text-gray-900">{{ doc.nama }}</span>
              <div class="flex space-x-2">
                <rs-button
                  variant="secondary"
                  size="sm"
                  @click="viewDocument(doc)"
                >
                  <Icon name="material-symbols:visibility" class="mr-1" />
                  Lihat
                </rs-button>
                <rs-button
                  variant="secondary"
                  size="sm"
                  @click="downloadDocument(doc)"
                >
                  <Icon name="material-symbols:download" class="mr-1" />
                  Muat Turun
                </rs-button>
              </div>
            </div>
          </div>
        </div>

        <!-- Section 5: Status & Timeline -->
        <div class="mb-8">
          <h3 class="text-lg font-medium mb-4">Status & Timeline</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Status Semasa
              </label>
              <rs-badge variant="warning" class="text-lg">
                Dalam Semakan
              </rs-badge>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Tarikh Hantar
              </label>
              <p class="text-gray-900">{{ formatDate(tuntutanData.tarikhHantar) }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Pemohon
              </label>
              <p class="text-gray-900">{{ tuntutanData.pemohon }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Pegawai Semakan
              </label>
              <p class="text-gray-900">{{ tuntutanData.pegawaiSemakan || 'Belum ditugaskan' }}</p>
            </div>
          </div>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

definePageMeta({
  title: "Lihat Tuntutan GL (Dalam Semakan)",
});

const route = useRoute();

const breadcrumb = ref([
  {
    name: "Tuntutan dengan Siasatan",
    type: "link",
    path: "/BF-BTN/tuntutan-dengan-siasatan",
  },
  {
    name: "Senarai Tuntutan",
    type: "link",
    path: "/BF-BTN/tuntutan-dengan-siasatan/senarai-tuntutan",
  },
  {
    name: "Lihat Tuntutan Dalam Semakan",
    type: "current",
    path: `/BF-BTN/tuntutan-dengan-siasatan/senarai-tuntutan/${route.params.id}/view-dalam-semakan`,
  },
]);

// Sample data - in real app, this would be fetched from API
const tuntutanData = ref({
  id: route.params.id,
  noGL: "GL-2025-001",
  amaunTuntutan: 5000.00,
  tarikh: "2024-03-20",
  catatanTambahan: "Catatan tambahan untuk tuntutan ini...",
  tarikhHantar: "2024-03-21T10:30:00",
  pemohon: "Ahmad bin Abdullah",
  pegawaiSemakan: "Siti Aminah binti Omar",
  dokumenSokongan: [
    {
      id: "DOC-001",
      nama: "GL_Bantuan_Sumbangan_Karpet.pdf",
      url: "/documents/gl_bantuan_sumbangan_karpet.pdf",
    },
    {
      id: "DOC-002",
      nama: "Invoice_March2024.pdf",
      url: "/documents/invoice_march2024.pdf",
    },
  ],
});

// Sample bantuan data - in real app, this would be fetched from API based on GL
const bantuanData = ref({
  kodBantuan: "B400",
  jenisBantuan: "(HQ) BANTUAN SUMBANGAN PERALATAN & BINA/BAIKPULIH INSTITUSI AGAMA",
  bahanBantuan: "(HQ) BANTUAN SUMBANGAN PERALATAN INSTITUSI AGAMA",
  pakejBantuan: "(GL) (HQ) BANTUAN SUMBANGAN KARPET INSTITUSI AGAMA",
  kelayakanBantuan: "(GL) (HQ) BANTUAN SUMBANGAN KARPET INSTITUSI AGAMA",
});

// Load data on mount
onMounted(async () => {
  await loadTuntutanData();
});

// Load tuntutan data
const loadTuntutanData = async () => {
  try {
    // In real app, fetch data from API based on route.params.id
    console.log("Loading tuntutan data for ID:", route.params.id);
    // API call would go here
  } catch (error) {
    console.error("Error loading tuntutan data:", error);
  }
};

// Utility functions
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("ms-MY");
};

const formatNumber = (number) => {
  return new Intl.NumberFormat("ms-MY", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number);
};

const viewDocument = (doc) => {
  // Implement document viewing logic
  window.open(doc.url, "_blank");
};

const downloadDocument = (doc) => {
  // Implement document download logic
  const link = document.createElement("a");
  link.href = doc.url;
  link.download = doc.nama;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Handle back
const handleBack = () => {
  navigateTo('/BF-BTN/tuntutan-dengan-siasatan/senarai-tuntutan');
};
</script>

<style lang="scss" scoped>
// Add any additional styles here
</style> 