<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Form Arahan Pindahan Tunai (KP-04)</h2>
        </div>
      </template>

      <template #body>
        <!-- Header Info Section -->
        <div class="bg-gray-50 rounded-lg p-6 mb-8">
          <h3 class="text-lg font-medium mb-4">Maklumat Peti Besi</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <p class="text-sm text-gray-600">ID Peti Besi</p>
              <p class="font-medium">{{ safeBoxInfo.idPetiBesi }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Lokasi / Cawangan</p>
              <p class="font-medium">{{ safeBoxInfo.namaCawangan }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Jenis Akaun Peti Besi</p>
              <p class="font-medium">{{ safeBoxInfo.jenisAkaun }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Jumlah Tambah Nilai (RM)</p>
              <p class="font-medium">RM {{ formatNumber(safeBoxInfo.jumlahTambahNilai) }}</p>
            </div>
          </div>
        </div>

        <!-- Form Section -->
        <FormKit
          type="form"
          @submit="handleSubmit"
          :actions="false"
          v-model="formData"
        >
          <div class="space-y-6">
            <!-- Daerah -->
            <FormKit
              type="select"
              name="daerah"
              label="Daerah"
              validation="required"
              :validation-messages="{
                required: 'Sila pilih daerah'
              }"
              :options="daerahOptions"
            />

            <!-- Lokasi Pengambilan -->
            <FormKit
              type="select"
              name="lokasiPengambilan"
              label="Lokasi Pengambilan"
              validation="required"
              :validation-messages="{
                required: 'Sila pilih lokasi pengambilan'
              }"
              :options="lokasiOptions"
            />

            <!-- Nama Pegawai LZS -->
            <FormKit
              type="text"
              name="namaPegawaiLZS"
              label="Nama Pegawai LZS Diberi Kuasa"
              validation="required"
              :validation-messages="{
                required: 'Sila masukkan nama pegawai'
              }"
            />

            <!-- No KP Pegawai -->
            <FormKit
              type="text"
              name="noKPPegawai"
              label="No KP Pegawai"
              validation="required|length:12"
              :validation-messages="{
                required: 'Sila masukkan nombor KP',
                length: 'Nombor KP mesti 12 digit'
              }"
            />

            <!-- No Telefon Pegawai -->
            <FormKit
              type="text"
              name="noTelefonPegawai"
              label="No Telefon Pegawai"
              validation="required"
              :validation-messages="{
                required: 'Sila masukkan nombor telefon'
              }"
            />

            <!-- Tarikh & Masa Pindahan -->
            <FormKit
              type="datetime-local"
              name="tarikhMasaPindahan"
              label="Tarikh & Masa Pindahan"
              validation="required"
              :validation-messages="{
                required: 'Sila pilih tarikh dan masa pindahan'
              }"
              :min="currentDateTime"
            />

            <!-- Action Buttons -->
            <div class="flex justify-end space-x-4 pt-6">
              <rs-button
                variant="secondary"
                @click="navigateTo('/BF-TNI/tambah-nilai-tunai/senarai-peti-besi-perlu-tambah-nilai')"
              >
                Kembali ke Senarai
              </rs-button>
              <rs-button
                variant="primary"
                type="submit"
                :loading="isSubmitting"
                @click="handleSubmit"
              >
                Sahkan & Hantar Arahan
              </rs-button>
            </div>
          </div>
        </FormKit>
      </template>
    </rs-card>

    <!-- Confirmation Modal -->
    <rs-modal
      v-model="showConfirmationModal"
      title="Sahkan Arahan Pindahan"
      size="md"
      position="center"
    >
      <template #body>
        <p>Adakah anda pasti untuk menghantar arahan pindahan ini?</p>
        <div class="mt-4 space-y-2">
          <p><strong>ID Peti Besi:</strong> {{ safeBoxInfo.idPetiBesi }}</p>
          <p><strong>Jumlah Pindahan:</strong> RM {{ formatNumber(safeBoxInfo.jumlahTambahNilai) }}</p>
          <p><strong>Pegawai LZS:</strong> {{ formData.namaPegawaiLZS }}</p>
          <p><strong>Tarikh & Masa:</strong> {{ formatDateTime(formData.tarikhMasaPindahan) }}</p>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end space-x-2">
          <rs-button variant="secondary" @click="showConfirmationModal = false">
            Batal
          </rs-button>
          <rs-button variant="primary" @click="handleConfirm" :loading="isSubmitting">
            Sahkan
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

definePageMeta({
  title: "Form Arahan Pindahan Tunai (KP-04)",
  description: "Form untuk mengeluarkan arahan pindahan tunai",
});

const route = useRoute();
const router = useRouter();

const breadcrumb = ref([
  {
    name: "Tambah Nilai Tunai",
    type: "link",
    path: "/BF-TNI/tambah-nilai-tunai",
  },
  {
    name: "Senarai Peti Besi Perlu Tambah Nilai",
    type: "link",
    path: "/BF-TNI/tambah-nilai-tunai/senarai-peti-besi-perlu-tambah-nilai",
  },
  {
    name: "Form Arahan Pindahan Tunai (KP-04)",
    type: "current",
    path: `/BF-TNI/tambah-nilai-tunai/keluarkan-arahan/${route.params.id}`,
  },
]);

// Mock data - In real app, fetch from API
const safeBoxInfo = ref({
  idPetiBesi: "PB001",
  namaCawangan: "Cawangan Kuala Lumpur (KL001)",
  jenisAkaun: "Amil",
  jumlahTambahNilai: 10000.00
});

// Form data
const formData = ref({
  daerah: "",
  lokasiPengambilan: "",
  namaPegawaiLZS: "",
  noKPPegawai: "",
  noTelefonPegawai: "",
  tarikhMasaPindahan: ""
});

// Options
const daerahOptions = [
  { label: "Kuala Lumpur", value: "kl" },
  { label: "Selangor", value: "selangor" },
  { label: "Putrajaya", value: "putrajaya" }
];

const lokasiOptions = [
  { label: "Pejabat LZS KL", value: "lzs_kl" },
  { label: "Pejabat LZS Selangor", value: "lzs_selangor" },
  { label: "Pejabat LZS Putrajaya", value: "lzs_putrajaya" }
];

// Modal control
const showConfirmationModal = ref(false);
const isSubmitting = ref(false);

// Computed
const currentDateTime = computed(() => {
  return new Date().toISOString().slice(0, 16);
});

// Methods
const handleSubmit = (formData) => {
  showConfirmationModal.value = true;
};

const handleConfirm = async () => {
  isSubmitting.value = true;
  try {
    // TODO: Implement API call to save arahan pindahan
    console.log("Saving arahan pindahan:", formData.value);
    
    // Close modal and navigate back to listing
    showConfirmationModal.value = false;
    navigateTo("/BF-TNI/tambah-nilai-tunai/senarai-peti-besi-perlu-tambah-nilai");
  } catch (error) {
    console.error("Error saving arahan pindahan:", error);
  } finally {
    isSubmitting.value = false;
  }
};

// Helper functions
const formatNumber = (number) => {
  return new Intl.NumberFormat('ms-MY', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(number);
};

const formatDateTime = (dateTime) => {
  if (!dateTime) return "";
  return new Date(dateTime).toLocaleString("ms-MY", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
};
</script>

<style lang="scss" scoped></style> 