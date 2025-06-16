<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Pengesahan Penerimaan Tunai</h2>
        </div>
      </template>

      <template #body>
        <!-- Read-Only Information Section -->
        <div class="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <h3 class="text-lg font-semibold mb-4">Maklumat Pengeluaran Tunai</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >ID Pengeluaran Tunai</label
                >
                <div class="mt-1 text-gray-900">{{ withdrawalData.id }}</div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Lokasi / Akaun Peti Besi</label
                >
                <div class="mt-1 text-gray-900">
                  {{ withdrawalData.location }}
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Jumlah Tunai Dikeluarkan (RM)</label
                >
                <div class="mt-1 text-gray-900 font-medium">
                  RM {{ formatNumber(withdrawalData.amount) }}
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Nama Pengguna (PKP)</label
                >
                <div class="mt-1 text-gray-900">
                  {{ withdrawalData.pkpName }}
                </div>
              </div>
            </div>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Nama PIC Penerima Tunai</label
                >
                <div class="mt-1 text-gray-900">
                  {{ withdrawalData.receiverName }}
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Tujuan Pengeluaran</label
                >
                <div class="mt-1 text-gray-900">
                  {{ withdrawalData.purpose }}
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Tarikh & Masa Pengeluaran</label
                >
                <div class="mt-1">
                  <div class="text-gray-900">
                    {{ formatDate(withdrawalData.withdrawalDateTime) }}
                  </div>
                  <div class="text-sm text-gray-500">
                    {{ formatTime(withdrawalData.withdrawalDateTime) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Confirmation Form Section -->
        <div class="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <h3 class="text-lg font-semibold mb-4">Borang Pengesahan</h3>
          <FormKit type="form" :actions="false" @submit="handleSubmit">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit
                type="select"
                name="confirmationStatus"
                label="Status Pengesahan"
                :options="[
                  { label: 'Disahkan', value: 'confirmed' },
                  { label: 'Tidak Disahkan', value: 'not_confirmed' },
                ]"
                validation="required"
                validation-label="Status Pengesahan"
              />

              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Tarikh & Masa Pengesahan</label
                >
                <div class="mt-1">
                  <div class="text-gray-900">
                    {{ formatDate(confirmationData.confirmationDateTime) }}
                  </div>
                  <div class="text-sm text-gray-500">
                    {{ formatTime(confirmationData.confirmationDateTime) }}
                  </div>
                </div>
              </div>

              <div class="md:col-span-2">
                <FormKit
                  type="textarea"
                  name="additionalNotes"
                  label="Catatan Tambahan"
                  placeholder="Masukkan catatan tambahan jika ada..."
                  rows="3"
                />
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-end space-x-2 mt-6">
              <rs-button variant="secondary" @click="handleCancel">
                Batal
              </rs-button>
              <rs-button variant="primary" @click="handleSubmit">
                <!-- <Icon name="material-symbols:check-circle" class="mr-1" /> -->
                Sahkan Penerimaan
              </rs-button>
            </div>
          </FormKit>
        </div>
      </template>
    </rs-card>

    <!-- Confirmation Modal -->
    <rs-modal
      v-model="showConfirmationModal"
      title="Sahkan Penerimaan"
      size="md"
      position="center"
    >
      <div class="px-6 py-6">
        <div class="flex items-start">
          <div>
            <p class="mb-4 text-gray-800">
              Adakah anda pasti untuk mengesahkan penerimaan tunai ini?
            </p>
            <div class="">
              <p class="font-medium mb-2">Maklumat Pengeluaran:</p>
              <p class="text-sm text-gray-600">
                ID Pengeluaran:
                <span class="font-medium text-gray-800">{{
                  withdrawalData.id
                }}</span>
              </p>
              <p class="text-sm text-gray-600">
                Jumlah:
                <span class="font-medium text-gray-800"
                  >RM {{ formatNumber(withdrawalData.amount) }}</span
                >
              </p>
              <p class="text-sm text-gray-600">
                Lokasi:
                <span class="font-medium text-gray-800">{{
                  withdrawalData.location
                }}</span>
              </p>
            </div>
            <p class="text-sm text-gray-600 mt-4">
              Pastikan status pengesahan yang dipilih adalah tepat sebelum
              mengesahkan.
            </p>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-4">
          <rs-button variant="secondary" @click="showConfirmationModal = false">
            Batal
          </rs-button>
          <rs-button
            variant="primary"
            @click="handleConfirmSubmit"
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
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

definePageMeta({
  title: "Pengesahan Penerimaan Tunai",
});

const breadcrumb = ref([
  {
    name: "Pentadbiran",
    type: "link",
    path: "/BF-TNI/opening-akaun",
  },
  {
    name: "Opening Akaun",
    type: "link",
    path: "/BF-TNI/opening-akaun",
  },
  {
    name: "Terima & Sahkan Penerimaan Tunai",
    type: "link",
    path: "/BF-TNI/opening-akaun/terima-sah-penerimaan-tunai",
  },
  {
    name: "Pengesahan Penerimaan Tunai",
    type: "current",
    path: route.fullPath,
  },
]);

// Data
const withdrawalData = ref({
  id: "",
  location: "",
  amount: 0,
  pkpName: "",
  receiverName: "",
  purpose: "",
  withdrawalDateTime: "",
});

const confirmationData = ref({
  confirmationDateTime: new Date().toISOString(),
});

// Add new refs for modal control
const showConfirmationModal = ref(false);
const isSubmitting = ref(false);
const formData = ref(null);

// Methods
const fetchWithdrawalData = async (id) => {
  try {
    // TODO: Replace with actual API call
    // Mock data for now
    withdrawalData.value = {
      id: id,
      location: "Peti Besi Utama",
      amount: 5000.0,
      pkpName: "Ahmad bin Abdullah",
      receiverName: "Siti binti Ali",
      purpose: "Pembayaran Zakat",
      withdrawalDateTime: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error fetching withdrawal data:", error);
    // Handle error (show notification, etc.)
  }
};

const handleSubmit = (data) => {
  formData.value = data;
  showConfirmationModal.value = true;
};

const handleConfirmSubmit = async () => {
  try {
    isSubmitting.value = true;
    // TODO: Implement actual API call
    console.log("Submitting confirmation:", formData.value);

    // Show success notification
    // Navigate back to list page
    router.push("/BF-TNI/opening-akaun/terima-sah-penerimaan-tunai");
  } catch (error) {
    console.error("Error submitting confirmation:", error);
    // Handle error (show notification, etc.)
  } finally {
    isSubmitting.value = false;
    showConfirmationModal.value = false;
  }
};

const handleCancel = () => {
  router.push("/BF-TNI/opening-akaun/terima-sah-penerimaan-tunai");
};

// Helper functions
const formatNumber = (number) => {
  return new Intl.NumberFormat("ms-MY", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number);
};

const formatDate = (dateTime) => {
  if (!dateTime) return "-";
  return new Date(dateTime).toLocaleDateString("ms-MY", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatTime = (dateTime) => {
  if (!dateTime) return "-";
  return new Date(dateTime).toLocaleTimeString("ms-MY", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Lifecycle hooks
onMounted(async () => {
  const id = route.params.id;
  if (id) {
    await fetchWithdrawalData(id);
  }
});
</script>

<style lang="scss" scoped></style>
