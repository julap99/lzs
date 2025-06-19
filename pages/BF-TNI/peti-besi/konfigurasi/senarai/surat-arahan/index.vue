<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Surat Arahan</h2>
          <div class="flex gap-3">
            <rs-button
              variant="primary-outline"
              @click="handlePrint"
              :loading="isPrinting"
            >
              <template #icon>
                <Icon name="heroicons:printer" class="w-5 h-5" />
              </template>
              Cetak
            </rs-button>
            <rs-button
              variant="primary-outline"
              @click="handleDownload"
              :loading="isDownloading"
            >
              <template #icon>
                <Icon name="heroicons:arrow-down-tray" class="w-5 h-5" />
              </template>
              Muat Turun
            </rs-button>
          </div>
        </div>
      </template>

      <template #body>
        <div class="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-sm">
          <!-- Letterhead -->
          <div class="text-center mb-8">
            <h1 class="text-2xl font-bold mb-2">SURAT ARAHAN</h1>
            <p class="text-gray-600">
              No. Rujukan: {{ generateReferenceNumber() }}
            </p>
          </div>

          <!-- Date and Recipient -->
          <div class="mb-8">
            <p class="mb-2">{{ formatDate(new Date()) }}</p>
            <p class="mb-2">Kepada:</p>
            <p class="font-medium mb-1">{{ getRecipientName() }}</p>
            <p>{{ getRecipientAddress() }}</p>
          </div>

          <!-- Subject -->
          <div class="mb-6">
            <p class="font-medium">Perkara: {{ getSubject() }}</p>
          </div>

          <!-- Content -->
          <div class="mb-8 space-y-4">
            <p>Dengan hormatnya dimaklumkan bahawa,</p>

            <div class="pl-4 space-y-2">
              <p>1. {{ getFirstParagraph() }}</p>
              <p>2. {{ getSecondParagraph() }}</p>
              <p>3. {{ getThirdParagraph() }}</p>
            </div>

            <p>Sekian, terima kasih.</p>
          </div>

          <!-- Signature -->
          <div class="mt-12">
            <p class="mb-8">Yang menjalankan tugas,</p>
            <p class="font-medium mb-1">{{ currentUser.name }}</p>
            <p>{{ currentUser.position }}</p>
          </div>

          <!-- Footer -->
          <div class="mt-12 pt-8 border-t border-gray-200">
            <p class="text-sm text-gray-600">
              Surat ini dijana secara automatik dan tidak memerlukan tandatangan
              fizikal.
            </p>
          </div>

          <!-- Action Buttons -->
          <div class="mt-8 flex justify-end gap-4">
            <rs-button variant="secondary" @click="handleBack">
              Kembali
            </rs-button>
            <rs-button variant="primary" @click="openConfirmationModal">
              Sahkan & Hantar Arahan
            </rs-button>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Confirmation Modal -->
    <rs-modal
      v-model="showConfirmationModal"
      title="Sahkan Hantar Arahan"
      size="md"
      position="center"
    >
      <template #body>
        <div class="space-y-4">
          <p>Adakah anda pasti untuk menghantar arahan ini?</p>
          <div class="bg-gray-50 p-4 rounded-lg">
            <p class="font-medium mb-2">Notifikasi akan dihantar kepada:</p>
            <ul class="list-disc list-inside space-y-1">
              <li>Ketua Cawangan</li>
              <li>Pegawai Kewangan yang menghantar arahan</li>
            </ul>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-3">
          <rs-button variant="secondary" @click="showConfirmationModal = false">
            Batal
          </rs-button>
          <rs-button
            variant="primary"
            @click="handleConfirm"
            :loading="isSubmitting"
          >
            Sahkan
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

definePageMeta({
  title: "Surat Arahan",
});

// Breadcrumb
const breadcrumb = ref([
  {
    name: "Peti Besi",
    type: "link",
    path: "/BF-TNI/peti-besi/konfigurasi/senarai",
  },
  {
    name: "Konfigurasi",
    type: "link",
    path: "/BF-TNI/peti-besi/konfigurasi/senarai",
  },
  {
    name: "Senarai",
    type: "link",
    path: "/BF-TNI/peti-besi/konfigurasi/senarai",
  },
  {
    name: "Surat Arahan",
    type: "current",
    path: "/BF-TNI/peti-besi/konfigurasi/senarai/surat-arahan",
  },
]);

// Mock data
const currentUser = ref({
  name: "Ahmad bin Abdullah",
  position: "Pegawai Pentadbir",
});

const isPrinting = ref(false);
const isDownloading = ref(false);

// Randomly determine if this is a cash or eWallet instruction
const isCashInstruction = Math.random() > 0.5;

// Helper functions
const formatDate = (date) => {
  return new Intl.DateTimeFormat("ms-MY", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};

const generateReferenceNumber = () => {
  const prefix = isCashInstruction ? "SA-CASH" : "SA-EW";
  const date = new Date().toISOString().slice(2, 10).replace(/-/g, "");
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `${prefix}/${date}/${random}`;
};

const getRecipientName = () => {
  return isCashInstruction ? "Ketua Pegawai Kewangan" : "Pengurus eWallet";
};

const getRecipientAddress = () => {
  return isCashInstruction
    ? "Bahagian Kewangan\nPejabat Pusat\n50000 Kuala Lumpur"
    : "Bahagian Teknologi\nPejabat Pusat\n50000 Kuala Lumpur";
};

const getSubject = () => {
  return isCashInstruction
    ? "Arahan Pengeluaran Tunai untuk Top-up Peti Besi"
    : "Arahan Pemindahan eWallet untuk Top-up Peti Besi";
};

const getFirstParagraph = () => {
  return isCashInstruction
    ? "Sukacita dimaklumkan bahawa pihak kami memerlukan pengeluaran tunai sebanyak RM 5,000.00 untuk tujuan top-up Peti Besi Utama di Pejabat Pusat."
    : "Sukacita dimaklumkan bahawa pihak kami memerlukan pemindahan eWallet sebanyak RM 5,000.00 untuk tujuan top-up Peti Besi Utama di Pejabat Pusat.";
};

const getSecondParagraph = () => {
  return isCashInstruction
    ? "Pengeluaran tunai ini adalah untuk memastikan baki minimum Peti Besi sentiasa mencukupi mengikut keperluan operasi."
    : "Pemindahan eWallet ini adalah untuk memastikan baki minimum Peti Besi sentiasa mencukupi mengikut keperluan operasi.";
};

const getThirdParagraph = () => {
  return isCashInstruction
    ? "Sila proseskan pengeluaran tunai ini dan serahkan kepada pegawai yang ditugaskan pada hari yang sama."
    : "Sila proseskan pemindahan eWallet ini dan hantar notifikasi kepada pegawai yang ditugaskan selepas pemindahan selesai.";
};

// Action handlers
const handlePrint = async () => {
  try {
    isPrinting.value = true;
    // Implement print functionality
    await new Promise((resolve) => setTimeout(resolve, 1000));
    window.print();
  } catch (error) {
    console.error("Error printing:", error);
  } finally {
    isPrinting.value = false;
  }
};

const handleDownload = async () => {
  try {
    isDownloading.value = true;
    // Implement download functionality
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Mock download
    const link = document.createElement("a");
    link.href = "#";
    link.download = `surat-arahan-${generateReferenceNumber()}.pdf`;
    link.click();
  } catch (error) {
    console.error("Error downloading:", error);
  } finally {
    isDownloading.value = false;
  }
};

const router = useRouter();
const showConfirmationModal = ref(false);
const isSubmitting = ref(false);

const openConfirmationModal = () => {
  showConfirmationModal.value = true;
};

const handleBack = () => {
  router.back();
};

const handleConfirm = async () => {
  try {
    isSubmitting.value = true;
    // TODO: Implement the actual submission logic here
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulated API call

    // Close modal and show success message
    showConfirmationModal.value = false;
    // You might want to add a success notification here

    // Redirect back or to another page
    router.push("/BF-TNI/peti-besi/konfigurasi/senarai");
  } catch (error) {
    console.error("Error submitting instruction:", error);
    // Handle error appropriately
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style lang="scss" scoped>
@media print {
  .rs-card {
    box-shadow: none !important;
  }

  .rs-button {
    display: none !important;
  }
}
</style>
