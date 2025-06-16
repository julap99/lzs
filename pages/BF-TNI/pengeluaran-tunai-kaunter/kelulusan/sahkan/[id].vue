<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Sahkan Pengeluaran</h2>
        </div>
      </template>

      <template #body>
        <!-- Section 1: Maklumat Permohonan & Pengeluaran -->
        <rs-card class="mb-6">
          <template #header>
            <div class="flex justify-between items-center">
              <h3 class="text-lg font-semibold">Maklumat Permohonan & Pengeluaran</h3>
            </div>
          </template>

          <template #body>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Nama EKP</label>
                <p class="mt-1">{{ pengeluaranData.namaEKP }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">No Kaunter</label>
                <p class="mt-1">{{ pengeluaranData.noKaunter }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Jenis Bantuan</label>
                <p class="mt-1">{{ pengeluaranData.jenisBantuan }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Jumlah Diluluskan (RM)</label>
                <p class="mt-1 font-medium">RM {{ formatNumber(pengeluaranData.jumlahDiluluskan) }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Tarikh & Masa Serahan</label>
                <p class="mt-1">{{ formatDate(pengeluaranData.tarikhMasaSerahan) }}</p>
                <p class="text-sm text-gray-500">{{ formatTime(pengeluaranData.tarikhMasaSerahan) }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Nama / ID Peti Besi</label>
                <p class="mt-1">{{ pengeluaranData.namaPetiBesi }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Jenis Akaun Peti Besi</label>
                <p class="mt-1">{{ pengeluaranData.jenisAkaunPetiBesi }}</p>
              </div>
            </div>
          </template>
        </rs-card>

        <!-- Section 2: Info Baki -->
        <rs-card class="mb-6">
          <template #header>
            <div class="flex justify-between items-center">
              <h3 class="text-lg font-semibold">Info Baki</h3>
            </div>
          </template>

          <template #body>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- For Cawangan Account -->
              <template v-if="pengeluaranData.jenisAkaunPetiBesi === 'Cawangan'">
                <div>
                  <label class="block text-sm font-medium text-gray-700">Baki Tunai di Tangan PIC (before)</label>
                  <p class="mt-1 font-medium">RM {{ formatNumber(pengeluaranData.bakiTunaiPICBefore) }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Jumlah Diluluskan</label>
                  <p class="mt-1 font-medium">RM {{ formatNumber(pengeluaranData.jumlahDiluluskan) }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Baki Tunai di Tangan PIC (after)</label>
                  <p class="mt-1 font-medium">RM {{ formatNumber(pengeluaranData.bakiTunaiPICAfter) }}</p>
                </div>
              </template>

              <!-- For Non-Cawangan Account -->
              <template v-else>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Baki Semasa Peti Besi (before)</label>
                  <p class="mt-1 font-medium">RM {{ formatNumber(pengeluaranData.bakiPetiBesiBefore) }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Jumlah Diluluskan</label>
                  <p class="mt-1 font-medium">RM {{ formatNumber(pengeluaranData.jumlahDiluluskan) }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Baki Semasa Peti Besi (after)</label>
                  <p class="mt-1 font-medium">RM {{ formatNumber(pengeluaranData.bakiPetiBesiAfter) }}</p>
                </div>
              </template>
            </div>
          </template>
        </rs-card>

        <!-- Section 3: Action Buttons -->
        <div class="flex justify-end space-x-4 mt-6">
          <rs-button variant="secondary" @click="handleKembali">
            <Icon name="material-symbols:arrow-back" class="mr-1" size="15" />
            Kembali ke Senarai
          </rs-button>
          <rs-button variant="danger" @click="handleGagal">
            <Icon name="material-symbols:cancel" class="mr-1" size="15" />
            Gagal / Ditangguh
          </rs-button>
          <rs-button variant="primary" @click="handleSahkan">
            <Icon name="material-symbols:check-circle" class="mr-1" size="15" />
            Sahkan Pengeluaran Tunai
          </rs-button>
        </div>
      </template>
    </rs-card>

    <!-- Failure/Postponement Reason Modal -->
    <rs-modal
      v-model="showFailureModal"
      title="Sebab Kegagalan / Penangguhan"
      size="md"
      position="center"
    >
      <template #body>
        <FormKit
          type="form"
          :actions="false"
          @submit="handleFailureSubmit"
          v-model="failureForm"
        >
          <FormKit
            type="textarea"
            name="reason"
            label="Sebab"
            validation="required"
            validation-label="Sebab"
            placeholder="Sila masukkan sebab kegagalan atau penangguhan..."
          />
        </FormKit>
      </template>
      <template #footer>
        <div class="flex justify-end space-x-2">
          <rs-button variant="secondary" @click="showFailureModal = false">
            Batal
          </rs-button>
          <rs-button variant="danger" @click="handleFailureSubmit">
            Sahkan
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";

definePageMeta({
  title: "Sahkan Pengeluaran",
});

const router = useRouter();
const route = useRoute();
const id = route.params.id;

const breadcrumb = ref([
  {
    name: "Pengeluaran Tunai Kaunter",
    type: "link",
    path: "/BF-TNI/pengeluaran-tunai-kaunter",
  },
  {
    name: "Kelulusan",
    type: "link",
    path: "/BF-TNI/pengeluaran-tunai-kaunter/kelulusan",
  },
  {
    name: "Sahkan Pengeluaran",
    type: "current",
    path: `/BF-TNI/pengeluaran-tunai-kaunter/kelulusan/sahkan/${id}`,
  },
]);

// Modal control
const showFailureModal = ref(false);
const failureForm = ref({
  reason: "",
});

// Mock data - replace with actual API call
const pengeluaranData = ref({
  id: id,
  namaEKP: "Ahmad bin Abdullah",
  noKaunter: "K001",
  jenisBantuan: "Bantuan Bulanan",
  jumlahDiluluskan: 5000,
  tarikhMasaSerahan: new Date().toISOString(),
  namaPetiBesi: "PB001",
  jenisAkaunPetiBesi: "Cawangan",
  bakiTunaiPICBefore: 8000,
  bakiTunaiPICAfter: 3000,
  bakiPetiBesiBefore: 15000,
  bakiPetiBesiAfter: 10000,
});

// Methods
const handleKembali = () => {
  router.push("/BF-TNI/pengeluaran-tunai-kaunter/kelulusan");
};

const handleGagal = () => {
  showFailureModal.value = true;
};

const handleFailureSubmit = async () => {
  try {
    // TODO: Implement API call to mark as failed/postponed
    console.log("Failure reason:", failureForm.value.reason);
    
    // Show success message and redirect
    router.push("/BF-TNI/pengeluaran-tunai-kaunter/kelulusan");
  } catch (error) {
    console.error("Error marking as failed:", error);
  }
};

const handleSahkan = async () => {
  try {
    // TODO: Implement API call to confirm disbursement
    console.log("Confirming disbursement:", id);
    
    // Show success message and redirect
    //router.push("/BF-TNI/pengeluaran-tunai-kaunter/kelulusan");
    router.push("/BF-TNI/slip-penerimaan");
  } catch (error) {
    console.error("Error confirming disbursement:", error);
  }
};

// Helper functions
const formatNumber = (number) => {
  return new Intl.NumberFormat("ms-MY", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number);
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("ms-MY", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatTime = (date) => {
  return new Date(date).toLocaleTimeString("ms-MY", {
    hour: "2-digit",
    minute: "2-digit",
  });
};
</script>

<style lang="scss" scoped>
// Add any custom styles here
</style> 