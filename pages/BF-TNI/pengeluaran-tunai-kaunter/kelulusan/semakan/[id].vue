<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Semakan Permohonan</h2>
        </div>
      </template>

      <template #body>
        <!-- Section 1: Maklumat Permohonan -->
        <rs-card class="mb-6">
          <template #header>
            <div class="flex justify-between items-center">
              <h3 class="text-lg font-semibold">Maklumat Permohonan</h3>
            </div>
          </template>

          <template #body>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Nama EKP</label>
                <p class="mt-1">{{ permohonanData.namaEKP }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">No Kaunter</label>
                <p class="mt-1">{{ permohonanData.noKaunter }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Jumlah Pengeluaran (RM)</label>
                <p class="mt-1 font-medium">RM {{ formatNumber(permohonanData.jumlahPengeluaran) }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Tarikh & Masa Permohonan</label>
                <p class="mt-1">{{ formatDate(permohonanData.tarikhMasaPermohonan) }}</p>
                <p class="text-sm text-gray-500">{{ formatTime(permohonanData.tarikhMasaPermohonan) }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Nama / ID Peti Besi</label>
                <p class="mt-1">{{ permohonanData.namaPetiBesi }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Jenis Akaun Peti Besi</label>
                <p class="mt-1">{{ permohonanData.jenisAkaunPetiBesi }}</p>
              </div>
            </div>
          </template>
        </rs-card>

        <!-- Section 2: Info Baki (Only for Akaun = Cawangan) -->
        <rs-card v-if="permohonanData.jenisAkaunPetiBesi === 'Cawangan'" class="mb-6">
          <template #header>
            <div class="flex justify-between items-center">
              <h3 class="text-lg font-semibold">Info Baki</h3>
            </div>
          </template>

          <template #body>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Baki Tunai di Tangan PIC (RM)</label>
                <p class="mt-1 font-medium">RM {{ formatNumber(permohonanData.bakiTunaiPIC) }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Jumlah Pengeluaran Dipohon (RM)</label>
                <p class="mt-1 font-medium">RM {{ formatNumber(permohonanData.jumlahPengeluaran) }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Nilai Float & Minimum Had</label>
                <p class="mt-1 text-sm text-gray-500">RM {{ formatNumber(permohonanData.nilaiFloat) }} / RM {{ formatNumber(permohonanData.minimumHad) }}</p>
              </div>
            </div>

            <!-- System Check Warning -->
            <div v-if="!isBalanceSufficient" class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div class="flex items-center">
                <Icon name="material-symbols:warning" class="text-red-500 mr-2" size="20" />
                <p class="text-red-700">Baki tunai di tangan tidak mencukupi untuk pengeluaran ini.</p>
              </div>
            </div>
          </template>
        </rs-card>

        <!-- Section 3: Action Buttons -->
        <div class="flex justify-end space-x-4 mt-6">
          <rs-button variant="secondary" @click="handleKembali">
            <Icon name="material-symbols:arrow-back" class="mr-1" size="15" />
            Kembali ke Senarai
          </rs-button>
          <rs-button variant="danger" @click="handleTolak">
            <Icon name="material-symbols:cancel" class="mr-1" size="15" />
            Tolak
          </rs-button>
          <!-- <rs-button 
            variant="primary" 
            :disabled="permohonanData.jenisAkaunPetiBesi === 'Cawangan' && !isBalanceSufficient"
            @click="handleLuluskan"
          > -->
          <rs-button 
            variant="primary" 
            @click="handleLuluskan"
          >
            <Icon name="material-symbols:check-circle" class="mr-1" size="15" />
            Luluskan
          </rs-button>
        </div>
      </template>
    </rs-card>

    <!-- Rejection Reason Modal -->
    <rs-modal
      v-model="showRejectionModal"
      title="Sebab Penolakan"
      size="md"
      position="center"
    >
      <template #body>
        <FormKit
          type="form"
          :actions="false"
          @submit="handleRejectionSubmit"
          v-model="rejectionForm"
        >
          <FormKit
            type="textarea"
            name="reason"
            label="Sebab Penolakan"
            validation="required"
            validation-label="Sebab penolakan"
            placeholder="Sila masukkan sebab penolakan..."
          />
        </FormKit>
      </template>
      <template #footer>
        <div class="flex justify-end space-x-2">
          <rs-button variant="secondary" @click="showRejectionModal = false">
            Batal
          </rs-button>
          <rs-button variant="danger" @click="handleRejectionSubmit">
            Sahkan Penolakan
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";

definePageMeta({
  title: "Semakan Permohonan",
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
    name: "Semakan Permohonan",
    type: "current",
    path: `/BF-TNI/pengeluaran-tunai-kaunter/kelulusan/semakan/${id}`,
  },
]);

// Modal control
const showRejectionModal = ref(false);
const rejectionForm = ref({
  reason: "",
});

// Mock data - replace with actual API call
const permohonanData = ref({
  id: id,
  namaEKP: "Ahmad bin Abdullah",
  noKaunter: "K001",
  jumlahPengeluaran: 5000,
  tarikhMasaPermohonan: new Date().toISOString(),
  namaPetiBesi: "PB001",
  jenisAkaunPetiBesi: "Cawangan",
  bakiTunaiPIC: 3000,
  nilaiFloat: 10000,
  minimumHad: 5000,
});

// Computed properties
const isBalanceSufficient = computed(() => {
  if (permohonanData.value.jenisAkaunPetiBesi !== "Cawangan") return true;
  return permohonanData.value.bakiTunaiPIC >= permohonanData.value.jumlahPengeluaran;
});

// Methods
const handleKembali = () => {
  router.push("/BF-TNI/pengeluaran-tunai-kaunter/kelulusan");
};

const handleTolak = () => {
  showRejectionModal.value = true;
};

const handleRejectionSubmit = async () => {
  try {
    // TODO: Implement API call to reject application
    console.log("Rejection reason:", rejectionForm.value.reason);
    
    // Show success message and redirect
    router.push("/BF-TNI/pengeluaran-tunai-kaunter/kelulusan");
  } catch (error) {
    console.error("Error rejecting application:", error);
  }
};

const handleLuluskan = async () => {
  try {
    // TODO: Implement API call to approve application
    console.log("Approving application:", id);
    
    // Show success message and redirect
    router.push("/BF-TNI/pengeluaran-tunai-kaunter/kelulusan");
  } catch (error) {
    console.error("Error approving application:", error);
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