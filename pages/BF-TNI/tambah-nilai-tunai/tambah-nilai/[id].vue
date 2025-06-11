<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Form Tambah Nilai Tunai (KP-03)</h2>
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
              <p class="text-sm text-gray-600">Baki Semasa (RM)</p>
              <p class="font-medium">RM {{ formatNumber(safeBoxInfo.bakiSemasa) }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Had Minimum (RM)</p>
              <p class="font-medium">RM {{ formatNumber(safeBoxInfo.hadMinimum) }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Nilai Asas</p>
              <p class="font-medium">RM {{ formatNumber(safeBoxInfo.nilaiAsas) }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Jumlah Dicadangkan Sistem</p>
              <p class="font-medium">RM {{ formatNumber(safeBoxInfo.jumlahDicadangkan) }}</p>
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
          <div class=" mx-auto space-y-6">
            <!-- Jumlah Tambah Nilai -->
            <FormKit
              type="number"
              name="jumlahTambahNilai"
              label="Jumlah Tambah Nilai (RM)"
              validation="required|number|min:0"
              :validation-messages="{
                required: 'Sila masukkan jumlah tambah nilai',
                number: 'Sila masukkan nilai yang sah',
                min: 'Jumlah tidak boleh negatif'
              }"
              :min="0"
              :step="0.01"
              :value="safeBoxInfo.jumlahDicadangkan"
            />

            <!-- Tarikh & Masa Penetapan -->
            <FormKit
              type="datetime-local"
              name="tarikhMasaPenetapan"
              label="Tarikh & Masa Penetapan Tambah Nilai"
              :value="currentDateTime"
              disabled
            />

            <!-- Nama Pegawai Penetap -->
            <FormKit
              type="text"
              name="namaPegawaiPenetap"
              label="Nama Pegawai Penetap"
              :value="currentUserName"
              disabled
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
                Simpan Tambah Nilai
              </rs-button>
            </div>
          </div>
        </FormKit>
      </template>
    </rs-card>

    <!-- Confirmation Modal -->
    <rs-modal
      v-model="showConfirmationModal"
      title="Sahkan Tambah Nilai"
      size="md"
      position="center"
    >
      <template #body>
        <p>Adakah anda pasti untuk menambah nilai peti besi ini?</p>
        <div class="mt-4 space-y-2">
          <p><strong>ID Peti Besi:</strong> {{ safeBoxInfo.idPetiBesi }}</p>
          <p><strong>Jumlah Tambah Nilai:</strong> RM {{ formatNumber(formData.jumlahTambahNilai) }}</p>
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
  title: "Form Tambah Nilai Tunai (KP-03)",
  description: "Form untuk menambah nilai peti besi",
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
    name: "Form Tambah Nilai Tunai (KP-03)",
    type: "current",
    path: `/BF-TNI/tambah-nilai-tunai/tambah-nilai/${route.params.id}`,
  },
]);

// Mock data - In real app, fetch from API
const safeBoxInfo = ref({
  idPetiBesi: "PB001",
  namaCawangan: "Cawangan Kuala Lumpur (KL001)",
  jenisAkaun: "Amil",
  bakiSemasa: 5000.00,
  hadMinimum: 10000.00,
  nilaiAsas: 15000.00,
  jumlahDicadangkan: 10000.00,
  sourceTrigger: "Auto",
  status: "Perlu Proses"
});

// Form data
const formData = ref({
  jumlahTambahNilai: safeBoxInfo.value.jumlahDicadangkan,
  tarikhMasaPenetapan: "",
  namaPegawaiPenetap: ""
});

// Modal control
const showConfirmationModal = ref(false);
const isSubmitting = ref(false);

// Computed
const currentDateTime = computed(() => {
  return new Date().toISOString().slice(0, 16);
});

const currentUserName = computed(() => {
  return "Ahmad bin Abdullah"; // In real app, get from auth store
});

// Methods
const handleSubmit = (formData) => {
  showConfirmationModal.value = true;
};

const handleConfirm = async () => {
  isSubmitting.value = true;
  try {
    // TODO: Implement API call to save tambah nilai
    console.log("Saving tambah nilai:", formData.value);
    
    // Close modal and navigate to KP-04 form
    showConfirmationModal.value = false;
    navigateTo(`/BF-TNI/tambah-nilai-tunai/keluarkan-arahan/${route.params.id}`);
  } catch (error) {
    console.error("Error saving tambah nilai:", error);
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
</script>

<style lang="scss" scoped></style> 