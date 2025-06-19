<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Keluarkan Arahan Pindahan Tunai (Kewangan)
          </h2>
        </div>
      </template>

      <template #body>
        <FormKit
          type="form"
          :actions="false"
          @submit="handleSubmit"
          v-model="formData"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Daerah -->
            <FormKit
              type="select"
              name="district"
              label="Daerah"
              :options="districts"
              validation="required"
            />

            <!-- Lokasi Pengambilan -->
            <FormKit
              type="select"
              name="pickupLocation"
              label="Lokasi Pengambilan"
              :options="pickupLocations"
              validation="required"
            />

            <!-- Nama Pegawai LZS -->
            <FormKit
              type="text"
              name="officerName"
              label="Nama Pegawai LZS Yang Diberi Kuasa"
              validation="required"
            />

            <!-- No Kad Pengenalan -->
            <FormKit
              type="text"
              name="officerIC"
              label="No Kad Pengenalan Pegawai LZS Yang Diberi Kuasa"
              validation="required|length:12"
              validation-label="No Kad Pengenalan"
            />

            <!-- No Telefon -->
            <FormKit
              type="text"
              name="officerPhone"
              label="No Telefon Pegawai LZS Yang Diberi Kuasa"
              validation="required|matches:/^[0-9]{10,11}$/"
              validation-label="No Telefon"
            />

            <!-- Jumlah Pindahan Wang -->
            <FormKit
              type="number"
              name="transferAmount"
              label="Jumlah Pindahan Wang (RM)"
              validation="required|min:1"
              validation-label="Jumlah Pindahan Wang"
            />

            <!-- Tarikh dan Masa Pindahan -->
            <FormKit
              type="datetime-local"
              name="transferDateTime"
              label="Tarikh dan Masa Pindahan"
              validation="required"
              validation-label="Tarikh dan Masa Pindahan"
            />
          </div>

          <div class="flex justify-end mt-6 space-x-2">
            <rs-button
              variant="primary-outline"
              @click="navigateTo('/BF-TNI/MT/KT/04')"
            >
              Batal
            </rs-button>
            <rs-button variant="primary" @click="showConfirmModal = true">
              Sahkan & Hantar Arahan
            </rs-button>
          </div>
        </FormKit>
      </template>
    </rs-card>

    <!-- Confirmation Modal -->
    <rs-modal
      v-model="showConfirmModal"
      title="Sahkan & Hantar Arahan"
      size="md"
      position="center"
    >
      <template #body>
        <p>
          Adakah anda pasti ingin mengesahkan dan menghantar arahan pindahan
          tunai ini?
        </p>
        <div class="mt-4 space-y-2">
          <p class="font-medium">Ringkasan:</p>
          <div class="bg-gray-50 p-3 rounded">
            <p>
              <span class="font-medium">Daerah:</span>
              {{ getDistrictLabel(formData.district) }}
            </p>
            <p>
              <span class="font-medium">Lokasi Pengambilan:</span>
              {{ getPickupLocationLabel(formData.pickupLocation) }}
            </p>
            <p>
              <span class="font-medium">Nama Pegawai:</span>
              {{ formData.officerName }}
            </p>
            <p>
              <span class="font-medium">No Kad Pengenalan:</span>
              {{ formData.officerIC }}
            </p>
            <p>
              <span class="font-medium">No Telefon:</span>
              {{ formData.officerPhone }}
            </p>
            <p>
              <span class="font-medium">Jumlah Pindahan:</span> RM
              {{ formData.transferAmount }}
            </p>
            <p>
              <span class="font-medium">Tarikh & Masa:</span>
              {{ formatDateTime(formData.transferDateTime) }}
            </p>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end space-x-2">
          <rs-button
            variant="primary-outline"
            @click="showConfirmModal = false"
          >
            Batal
          </rs-button>
          <rs-button variant="primary" @click="handleSubmit">
            Sahkan & Hantar Arahan
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref } from "vue";

definePageMeta({
  title: "Keluarkan Arahan Pindahan Tunai",
  description: "Mengeluarkan arahan rasmi pemindahan tunai ke Peti Besi",
});

const breadcrumb = ref([
  {
    name: "Pengurusan Tunai",
    type: "link",
    path: "/BF-TNI/MT/KT",
  },
  {
    name: "Mengurus Tunai",
    type: "link",
    path: "/BF-TNI/MT/KT/01",
  },
  {
    name: "Keluarkan Arahan Pindahan Tunai (Kewangan)",
    type: "current",
    path: "/BF-TNI/MT/KT/05",
  },
]);

// Form data
const formData = ref({
  district: "",
  pickupLocation: "",
  officerName: "",
  officerIC: "",
  officerPhone: "",
  transferAmount: "",
  transferDateTime: "",
});

// Districts options
const districts = [
  { label: "Kuala Lumpur", value: "kl" },
  { label: "Selangor", value: "selangor" },
  { label: "Putrajaya", value: "putrajaya" },
];

// Pickup locations options
const pickupLocations = [
  { label: "Pejabat LZS KL", value: "lzs_kl" },
  { label: "Pejabat LZS Selangor", value: "lzs_selangor" },
  { label: "Pejabat LZS Putrajaya", value: "lzs_putrajaya" },
];

// Modal control
const showConfirmModal = ref(false);

// Helper functions
const getDistrictLabel = (value) => {
  const district = districts.find((d) => d.value === value);
  return district ? district.label : value;
};

const getPickupLocationLabel = (value) => {
  const location = pickupLocations.find((l) => l.value === value);
  return location ? location.label : value;
};

const formatDateTime = (dateTime) => {
  if (!dateTime) return "";
  return new Date(dateTime).toLocaleString("ms-MY", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Handle form submission
const handleSubmit = async () => {
  try {
    // Here you would typically make an API call to save the data
    console.log("Form submitted:", formData.value);

    // Close the modal
    showConfirmModal.value = false;

    // Show success message
    alert("Arahan pindahan tunai berjaya dikeluarkan");

    // Navigate back to the list page
    navigateTo("/BF-TNI/MT/KT/06");
  } catch (error) {
    console.error("Error submitting form:", error);
    alert("Ralat: Gagal menghantar arahan pindahan tunai");
  }
};
</script>
