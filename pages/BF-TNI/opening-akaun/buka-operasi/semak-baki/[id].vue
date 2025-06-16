<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Rekod Semakan Baki Semasa</h2>
        </div>
      </template>

      <template #body>
        <!-- Info Details Section -->
        <div class="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 class="text-lg font-medium mb-4">Maklumat Aktiviti</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-600">Nama Pengguna</p>
              <p class="font-medium">{{ currentUserName }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Tarikh & Masa</p>
              <p class="font-medium">{{ formattedCurrentDateTime }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">ID Akaun Peti Besi</p>
              <p class="font-medium">{{ safeBoxInfo.idAkaun }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Lokasi / Cawangan</p>
              <p class="font-medium">{{ safeBoxInfo.lokasi }}</p>
            </div>
          </div>
        </div>

        <!-- Form Section -->
        <FormKit
          type="form"
          :actions="false"
          @submit="handleSubmit"
          v-model="formData"
        >
          <!-- Baki Fizikal Tunai -->
          <FormKit
            type="number"
            name="bakiFizikal"
            label="Baki Fizikal Tunai (RM)"
            validation="required|number|min:0"
            validation-label="Baki Fizikal Tunai"
            :validation-messages="{
              required: 'Sila masukkan baki fizikal tunai',
              number: 'Sila masukkan nilai yang sah',
              min: 'Nilai tidak boleh negatif'
            }"
          />

          <!-- Tarikh & Masa Semakan -->
          <FormKit
            type="datetime-local"
            name="tarikhMasaSemakan"
            label="Tarikh & Masa Semakan"
            :value="currentDateTime"
            validation="required"
            validation-label="Tarikh & Masa Semakan"
          />

          <!-- Baki Rekod Sistem Sebelum -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Baki Rekod Sistem Sebelum
            </label>
            <p class="text-lg font-semibold">
              RM {{ formatNumber(safeBoxInfo.bakiSistem) }}
            </p>
          </div>

          <!-- Had Minimum Baki -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Had Minimum Baki (Threshold)
            </label>
            <p class="text-lg font-semibold">
              RM {{ formatNumber(safeBoxInfo.hadMinimum) }}
            </p>
          </div>

          <!-- Catatan Tambahan -->
          <FormKit
            type="textarea"
            name="catatan"
            label="Catatan Tambahan (jika ada)"
            rows="3"
          />

          <!-- Action Buttons -->
          <div class="flex justify-end space-x-2 mt-6">
            <rs-button variant="primary-outline" @click="handleCancel">
              Batal
            </rs-button>
            <rs-button variant="primary" type="submit" @click="handleSubmit">
              Simpan Rekod Semakan
            </rs-button>
          </div>
        </FormKit>
      </template>
    </rs-card>

    <!-- Confirmation Modal -->
    <rs-modal
      v-model="showConfirmationModal"
      title="Perlu Keluarkan Tunai?"
      size="md"
      position="center"
    >
      <template #body>
        <p>Adakah anda perlu mengeluarkan tunai dari peti besi ini?</p>
      </template>
      <template #footer>
        <div class="flex justify-end space-x-2">
          <rs-button variant="primary-outline" @click="handleNoWithdrawal">
            Tidak
          </rs-button>
          <rs-button variant="primary" @click="handleWithdrawal">
            Ya
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

definePageMeta({
  title: "Rekod Semakan Baki Semasa",
});

const route = useRoute();
const router = useRouter();

const breadcrumb = ref([
  {
    name: "Pentadbiran",
    type: "link",
    path: "/BF-TNI/opening-akaun",
  },
  {
    name: "Buka Operasi",
    type: "link",
    path: "/BF-TNI/opening-akaun/buka-operasi",
  },
  {
    name: "Rekod Semakan Baki",
    type: "current",
    path: `/BF-TNI/opening-akaun/buka-operasi/semak-baki/${route.params.id}`,
  },
]);

// Current user info
const currentUserName = ref("Ahmad bin Abdullah"); // Replace with actual user data
const currentDateTime = computed(() => {
  return new Date().toISOString().slice(0, 16);
});
const formattedCurrentDateTime = computed(() => {
  return new Date().toLocaleString("ms-MY", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
});

// Safe box info
const safeBoxInfo = ref({
  idAkaun: "PB001",
  lokasi: "Cawangan Kuala Lumpur",
  bakiSistem: 10000,
  hadMinimum: 5000,
});

// Form data
const formData = ref({
  bakiFizikal: 0,
  tarikhMasaSemakan: currentDateTime.value,
  catatan: "",
});

// Modal control
const showConfirmationModal = ref(false);

// Methods
const handleSubmit = async (formData) => {
  // Save the balance check record
  showConfirmationModal.value = true;
};

const handleCancel = () => {
  router.back();
};

const handleWithdrawal = () => {
  showConfirmationModal.value = false;
  // Navigate to cash withdrawal page
  router.push(`/BF-TNI/opening-akaun/buka-operasi/keluarkan-tunai/${route.params.id}`);
};

const handleNoWithdrawal = () => {
  showConfirmationModal.value = false;
  // Navigate to next flow
  router.push("/BF-TNI/opening-akaun/buka-operasi");
};

// Helper functions
const formatNumber = (number) => {
  return new Intl.NumberFormat("ms-MY", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number);
};
</script>

<style lang="scss" scoped></style> 