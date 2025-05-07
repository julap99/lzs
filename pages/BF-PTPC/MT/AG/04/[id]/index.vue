<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Sahkan Jumlah Tunai (KC)</h2>
        </div>
      </template>

      <template #body>
        <!-- Bantuan Details Section -->
        <div class="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 class="text-lg font-medium mb-4">Maklumat Bantuan</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-600">Nama Asnaf</p>
              <p class="font-medium">{{ bantuanDetails.namaAsnaf }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">No. Kad Pengenalan</p>
              <p class="font-medium">{{ bantuanDetails.noKadPengenalan }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Jenis Bantuan</p>
              <p class="font-medium">{{ bantuanDetails.jenisBantuan }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Jumlah Bantuan</p>
              <p class="font-medium text-lg text-primary-600">
                {{ bantuanDetails.jumlahBantuan }}
              </p>
            </div>
            <div>
              <p class="text-sm text-gray-600">No. PA</p>
              <p class="font-medium">{{ bantuanDetails.paNombor }}</p>
            </div>
          </div>
        </div>

        <!-- Success Message - Only shown after approval -->
        <div v-if="isApproved" class="mb-6">
          <div class="flex items-center gap-2 mb-4">
            <Icon name="mdi:check-circle" class="text-green-500" size="1.5rem" />
            <p class="text-green-600 font-medium">Bantuan telah disahkan</p>
          </div>
        </div>

        <!-- Details Section (formerly Form) -->
        <div class="mb-6">
          <h3 class="text-lg font-medium mb-4">Maklumat Arahan Pindahan Tunai</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p class="text-sm text-gray-600">Daerah</p>
              <p class="font-medium">{{ transferDetails.district }}</p>
            </div>

            <div>
              <p class="text-sm text-gray-600">Cawangan Maybank</p>
              <p class="font-medium">{{ transferDetails.bankBranch }}</p>
            </div>

            <div>
              <p class="text-sm text-gray-600">Nama Pegawai LZS Yang Diberi Kuasa</p>
              <p class="font-medium">{{ transferDetails.officerName }}</p>
            </div>

            <div>
              <p class="text-sm text-gray-600">
                No Kad Pengenalan Pegawai LZS Yang Diberi Kuasa
              </p>
              <p class="font-medium">{{ transferDetails.officerIC }}</p>
            </div>

            <div>
              <p class="text-sm text-gray-600">
                No Telefon Pegawai LZS Yang Diberi Kuasa
              </p>
              <p class="font-medium">{{ transferDetails.officerPhone }}</p>
            </div>

            <div>
              <p class="text-sm text-gray-600">Jumlah Pindahan Wang</p>
              <p class="font-medium text-primary-600">
                {{ transferDetails.transferAmount }}
              </p>
            </div>

            <div>
              <p class="text-sm text-gray-600">Tarikh dan Masa Pindahan</p>
              <p class="font-medium">
                {{ formatDateTime(transferDetails.transferDateTime) }}
              </p>
            </div>
          </div>

          <div class="mt-6 flex justify-end gap-4">
            <rs-button
              variant="primary-outline"
              v-if="!isApproved"
              @click="navigateTo('/BF-PTPC/MT/AG/01')"
            >
              Kembali
            </rs-button>

            <rs-button
              v-if="!isApproved"
              variant="primary"
              @click="showConfirmationModal = true"
            >
              Sah
            </rs-button>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Confirmation Modal -->
    <rs-modal
      title="Sahkan Bantuan"
      v-model="showConfirmationModal"
      ok-title="Sahkan"
      cancel-title="Batal"
      position="center"
    >
      <template #body>
        <p class="mb-4">Adakah anda pasti untuk sahkan bantuan ini?</p>
        <div class="bg-gray-50 p-4 rounded-lg">
          <p class="font-medium">Jumlah Bantuan: {{ bantuanDetails.jumlahBantuan }}</p>
          <p class="text-sm text-gray-600">
            Pastikan jumlah bantuan adalah betul sebelum disahkan.
          </p>
        </div>
      </template>

      <template #footer>
        <rs-button
          @click="showConfirmationModal = false"
          :disabled="approving"
          variant="primary-outline"
        >
          Tutup
        </rs-button>

        <rs-button @click="handleConfirm()" :disabled="approving">
          <span v-if="approving">
            <Icon name="eos-icons:loading" class="ml-1" size="1rem" />
          </span>
          <span v-else> Sah & Terima </span>
        </rs-button>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const isApproved = ref(false);
const approving = ref(false);
const showConfirmationModal = ref(false);
const breadcrumb = ref([
  {
    name: "Sahkan Jumlah Tunai (KC)",
    type: "current",
    path: `/BF-PTPC/MT/AG/04/${route.params.id}`,
  },
]);

const bantuanDetails = ref({
  namaAsnaf: "",
  noKadPengenalan: "",
  jenisBantuan: "",
  jumlahBantuan: "",
  paNombor: "",
});

const transferDetails = ref({
  district: "",
  bankBranch: "",
  officerName: "",
  officerIC: "",
  officerPhone: "",
  transferAmount: "",
  transferDateTime: "",
});

definePageMeta({
  title: "Sahkan Jumlah Tunai",
});

onMounted(() => {
  // Mock data for bantuan details
  bantuanDetails.value = {
    namaAsnaf: "Ahmad bin Abdullah",
    noKadPengenalan: "800101-01-1234",
    jenisBantuan: "Bantuan Kewangan",
    jumlahBantuan: "RM 1,000.00",
    paNombor: route.params.id,
  };

  // Mock data for transfer details - these would come from the database in a real app
  transferDetails.value = {
    district: "Shah Alam",
    bankBranch: "Maybank Shah Alam",
    officerName: "Mohamed bin Salleh",
    officerIC: "850212045678",
    officerPhone: "012-3456789",
    transferAmount: "RM 1,000.00",
    transferDateTime: "2025-05-08T10:30:00",
  };
});

const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return "";
  const date = new Date(dateTimeString);
  return date.toLocaleString("ms-MY", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const handleConfirm = async () => {
  console.log("Handle confirm");
  approving.value = true;

  setTimeout(async () => {
    showConfirmationModal.value = false;
    await navigateTo(`/BF-PTPC/MT/AG/05/${route.params.id}`);
  }, 2000);
};
</script>
