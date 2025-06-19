<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Senarai Sahkan Pemulangan Tunai</h2>
          <rs-button variant="primary-outline" @click="refreshList">
            <Icon name="material-symbols:refresh" class="mr-1" size="15" />
            Refresh List
          </rs-button>
        </div>
      </template>

      <template #body>
        <rs-table
          class="mt-4"
          :key="tableKey"
          :data="returnList"
          :pageSize="10"
          :showNoColumn="true"
          :options="{
            variant: 'default',
            hover: true,
          }"
        >
          <template v-slot:idPermohonan="data">
            <a
              href="#"
              class="text-primary-600 hover:text-primary-800"
              @click.prevent="viewApplication(data.value)"
            >
              {{ data.text }}
            </a>
          </template>

          <template v-slot:namaPemohon="data">
            {{ data.text }}
          </template>

          <template v-slot:lokasiPetiBesi="data">
            {{ data.text }}
          </template>

          <template v-slot:tarikhMasaPemulangan="data">
            <div>
              <div class="font-medium">{{ formatDate(data.text) }}</div>
              <div class="text-sm text-gray-500">
                {{ formatTime(data.text) }}
              </div>
            </div>
          </template>

          <template v-slot:jumlahTunai="data">
            <div class="font-medium text-right">
              RM {{ formatNumber(data.text) }}
            </div>
          </template>

          <template v-slot:status="data">
            <rs-badge variant="warning">
              {{ data.text }}
            </rs-badge>
          </template>

          <template v-slot:tindakan="data">
            <div class="flex space-x-2">
              <rs-button
                variant="primary"
                size="sm"
                class="!px-2 !py-1"
                @click="confirmReturn(data.value)"
              >
                <Icon
                  name="material-symbols:check-circle"
                  size="15"
                  class="mr-1"
                />
                Sahkan Pemulangan Tunai
              </rs-button>
            </div>
          </template>
        </rs-table>
      </template>
    </rs-card>

    <!-- Confirmation Modal -->
    <rs-modal
      v-model="showConfirmationModal"
      title="Sahkan Pemulangan Tunai"
      size="md"
      position="center"
    >
      <template #body>
        <FormKit
          type="form"
          :actions="false"
          @submit="handleConfirmation"
          v-model="confirmationForm"
        >
          <FormKit
            type="radio"
            name="status"
            label="Status Pengesahan"
            :options="[
              { label: 'Disahkan', value: 'confirmed' },
              { label: 'Tidak Disahkan', value: 'rejected' },
            ]"
            validation="required"
          />

          <FormKit
            type="textarea"
            name="catatan"
            label="Catatan Pengesahan (jika ada)"
            placeholder="Masukkan catatan pengesahan..."
          />

          <div class="flex justify-end gap-2 mt-4">
            <rs-button
              variant="secondary"
              @click="showConfirmationModal = false"
            >
              Kembali ke Senarai
            </rs-button>
            <rs-button type="submit" variant="primary" :loading="isSubmitting">
              Simpan Pengesahan
            </rs-button>
          </div>
        </FormKit>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

definePageMeta({
  title: "Senarai Sahkan Pemulangan Tunai",
  description: "Senarai permohonan pemulangan tunai yang sedia untuk disahkan",
});

// Breadcrumb
const breadcrumb = ref([
  {
    name: "Pemulangan Tunai",
    type: "link",
    path: "/BF-TNI/pemulangan-tunai",
  },
  {
    name: "Senarai Sahkan",
    type: "current",
    path: "/BF-TNI/pemulangan-tunai/senarai-sah",
  },
]);

// Table data and reactivity control
const tableKey = ref(0);
const returnList = ref([
  {
    id: "PT-001",
    namaPemohon: "Ahmad bin Abdullah",
    lokasiPetiBesi: "Peti Besi Utama",
    tarikhMasaPemulangan: "2024-03-20T10:30:00",
    jumlahTunai: 5000.0,
    status: "Tunai Dipulangkan",
    tindakan: 1,
  },
  // Add more sample data as needed
]);

// Confirmation modal state
const showConfirmationModal = ref(false);
const selectedReturn = ref(null);
const isSubmitting = ref(false);
const confirmationForm = ref({
  status: "",
  catatan: "",
});

// Methods
const refreshList = () => {
  // TODO: Implement API call to refresh the list
  tableKey.value++;
};

const viewApplication = (id) => {
  // TODO: Implement navigation to view application details
  console.log("View application:", id);
};

const confirmReturn = (returnData) => {
  selectedReturn.value = returnData;

  navigateTo(`/BF-TNI/pemulangan-tunai/senarai-sah/${returnData.id}`);
};

const handleConfirmation = async (formData) => {
  isSubmitting.value = true;
  try {
    // TODO: Implement API call to save confirmation
    console.log("Saving confirmation:", {
      returnId: selectedReturn.value.id,
      ...formData,
    });

    // Close modal and refresh list
    showConfirmationModal.value = false;
    refreshList();
  } catch (error) {
    console.error("Error saving confirmation:", error);
  } finally {
    isSubmitting.value = false;
  }
};

// Helper functions
const formatDate = (dateString) => {
  if (!dateString) return "";
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString("ms-MY", options);
};

const formatTime = (dateString) => {
  if (!dateString) return "";
  const options = { hour: "2-digit", minute: "2-digit" };
  return new Date(dateString).toLocaleTimeString("ms-MY", options);
};

const formatNumber = (value) => {
  if (value === undefined || value === null) return "0.00";
  return parseFloat(value).toLocaleString("ms-MY", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
</script>

<style lang="scss" scoped>
// Add any custom styles here if needed
</style>
