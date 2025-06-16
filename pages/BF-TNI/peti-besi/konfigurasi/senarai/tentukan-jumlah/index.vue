<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Tetapkan Jumlah Peti Besi</h2>
        </div>
      </template>

      <template #body>
        <FormKit
          type="form"
          @submit="handleSubmit"
          :actions="false"
          class="max-w-2xl mx-auto"
          v-model="formData"
        >
          <!-- View Only Fields -->
          <div class="grid grid-cols-1 gap-4">
            <!-- Nama Akaun & Lokasi Peti Besi -->
            <FormKit
              type="text"
              name="namaAkaun"
              label="Nama Akaun & Lokasi Peti Besi"
              :disabled="true"
              :value="
                safeBoxData.namaAkaun.nama +
                ' - ' +
                safeBoxData.namaAkaun.lokasi
              "
            />

            <!-- Jenis Akaun Peti Besi -->
            <FormKit
              type="text"
              name="jenisAkaun"
              label="Jenis Akaun Peti Besi"
              :disabled="true"
              :value="safeBoxData.jenisAkaun"
            />

            <!-- Nilai Asas Peti Besi -->
            <FormKit
              type="text"
              name="nilaiAsas"
              label="Nilai Asas Peti Besi (RM)"
              :disabled="true"
              :value="formatCurrency(safeBoxData.nilaiAsas)"
            />

            <!-- Baki Semasa Peti Besi -->
            <FormKit
              type="text"
              name="bakiSemasa"
              label="Baki Semasa Peti Besi (RM)"
              :disabled="true"
              :value="formatCurrency(safeBoxData.bakiSemasa)"
            />

            <!-- Had Minimum Baki -->
            <FormKit
              type="text"
              name="hadMinimumBaki"
              label="Had Minimum Baki (RM)"
              :disabled="true"
              :value="formatCurrency(safeBoxData.hadMinimumBaki)"
            />

            <!-- Kaedah Pemindahan -->
            <FormKit
              type="select"
              name="kaedahPemindahan"
              label="Kaedah Pemindahan"
              :options="[
                { label: 'Tunai', value: 'Tunai' },
                { label: 'eWallet', value: 'eWallet' },
              ]"
              validation="required"
              :validation-messages="{
                required: 'Sila pilih kaedah pemindahan',
              }"
            />

            <!-- Jumlah Top-up -->
            <FormKit
              type="number"
              name="jumlahTopup"
              label="Jumlah Top-up (RM)"
              :value="calculateTopupAmount"
              @input="handleTopupChange"
              validation="required|min:0"
              :validation-messages="{
                required: 'Jumlah top-up diperlukan',
                min: 'Jumlah top-up tidak boleh negatif',
              }"
              step="0.01"
            />

            <!-- Nama Pegawai Menentukan -->
            <FormKit
              type="text"
              name="namaPegawai"
              label="Nama Pegawai Menentukan"
              :disabled="true"
              :value="currentUser.name"
            />
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end gap-4 mt-6">
            <rs-button
              type="button"
              variant="primary-outline"
              @click="handleCancel"
            >
              Batal
            </rs-button>
            <rs-button type="submit" variant="primary" :loading="isSubmitting" @click="handleSubmit">
              Simpan
            </rs-button>
          </div>
        </FormKit>
      </template>
    </rs-card>

    <!-- Confirmation Modal -->
    <rs-modal
      v-model="showConfirmationModal"
      title="Sahkan Tetapan Jumlah"
      size="md"
      position="center"
    >
      <template #body>
        <div class="space-y-4">
          <p class="text-gray-600">
            Adakah anda pasti untuk meneruskan dengan tetapan jumlah berikut?
          </p>
          
          <div class="bg-gray-50 p-4 rounded-lg space-y-2">
            <div class="flex justify-between">
              <span class="font-medium">Kaedah Pemindahan:</span>
              <span>{{ formData.kaedahPemindahan }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-medium">Jumlah Top-up:</span>
              <span>{{ formatCurrency(formData.jumlahTopup) }}</span>
            </div>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex justify-end gap-3">
          <rs-button
            variant="primary-outline"
            @click="showConfirmationModal = false"
          >
            Batal
          </rs-button>
          <rs-button
            variant="primary"
            :loading="isSubmitting"
            @click="confirmSubmit"
          >
            Sahkan
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";

definePageMeta({
  title: "Tetapkan Jumlah Peti Besi",
});

const route = useRoute();
const isSubmitting = ref(false);

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
    name: "Tetapkan Jumlah",
    type: "current",
    path: "/BF-TNI/peti-besi/konfigurasi/senarai/tentukan-jumlah",
  },
]);

// Mock data - In real application, this would come from API
const safeBoxData = ref({
  namaAkaun: { nama: "Peti Besi Utama", lokasi: "Pejabat Pusat" },
  jenisAkaun: "Cawangan",
  nilaiAsas: 10000,
  hadMinimumBaki: 5000,
  bakiSemasa: 15000,
});

// Mock current user - In real application, this would come from auth store
const currentUser = ref({
  name: "Ahmad bin Abdullah",
});

// Form data
const formData = ref({
  kaedahPemindahan: "",
  jumlahTopup: 0,
});

// Computed property for auto-calculated top-up amount
const calculateTopupAmount = computed(() => {
  const minimumRequired = safeBoxData.value.hadMinimumBaki;
  const currentBalance = safeBoxData.value.bakiSemasa;

  if (currentBalance < minimumRequired) {
    return minimumRequired - currentBalance;
  }
  return 0;
});

// Helper functions
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("ms-MY", {
    style: "currency",
    currency: "MYR",
    minimumFractionDigits: 2,
  }).format(amount);
};

const handleTopupChange = (event) => {
  formData.value.jumlahTopup = parseFloat(event.target.value) || 0;
};

const handleCancel = () => {
  navigateTo("/BF-TNI/peti-besi/konfigurasi/senarai");
};

// Add new refs
const showConfirmationModal = ref(false);

// Modify handleSubmit
const handleSubmit = async (formData) => {
  showConfirmationModal.value = true;
};

// Add new method
const confirmSubmit = async () => {
  try {
    isSubmitting.value = true;
    
    // Determine which page to navigate to based on kaedahPemindahan
    if (formData.value.kaedahPemindahan === "Tunai") {
      navigateTo("/BF-TNI/peti-besi/konfigurasi/senarai/surat-arahan");
    } else {
      navigateTo("/BF-TNI/peti-besi/konfigurasi/senarai/surat-arahan");
    }
  } catch (error) {
    console.error("Error submitting form:", error);
  } finally {
    isSubmitting.value = false;
    showConfirmationModal.value = false;
  }
};
</script>

<style lang="scss" scoped>
// Add any custom styles here if needed
</style>
