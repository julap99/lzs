<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Kiraan Jumlah Elaun Mengikut Penolong Amil</h2>
          <rs-badge
            v-if="formData.status"
            :variant="getStatusVariant(formData.status)"
          >
            {{ formData.status }}
          </rs-badge>
        </div>
      </template>

      <template #body>
        <FormKit
          type="form"
          :actions="false"
          @submit="handleSubmit"
          v-model="formData"
        >
        
          <!-- Senarai Penolong Amil Section -->
          <div class="space-y-6 mt-8">
            <h3 class="text-lg font-medium">Senarai Kehadiran Penolong Amil</h3>
            <rs-table
              class="mt-4"
              :key="tableKey"
              :data="formData.senaraiPenolong"
              :pageSize="10"
              :showNoColumn="true"
              :columns="[
                { key: 'nama', label: 'Nama Penolong Amil' },
                { key: 'tarikh', label: 'Tarikh Aktiviti' }
              ]"
              :options="{
                variant: 'default',
                hover: true,
              }"
            >
              <template v-slot:nama="data">
                {{ data.text }}
              </template>
              <template v-slot:tarikh="data">
                {{ data.text }}
              </template>
            </rs-table>
          </div>

          <!-- Maklumat Pengiraan Section -->
          <div class="space-y-6 mt-8">
            <h3 class="text-lg font-medium">Maklumat Pengiraan</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit 
              type="text" 
              name="kadarElaun" 
              label="Kadar Elaun" 
              disabled 
              />
              <FormKit
                type="text"
                name="jumlahElaun"
                label="Jumlah Elaun"
                disabled
              />
            </div>
          </div>

          <!-- Remarks Section -->
          <div class="space-y-6 mt-8">
            <h3 class="text-lg font-medium">Ulasan</h3>
            <div class="grid grid-cols-1 gap-4">
              <FormKit
                type="textarea"
                name="remarks"
                label="Ulasan Eksekutif JPPA"
                validation="required"
                validation-label="Ulasan"
                placeholder="Sila masukkan ulasan anda..."
              />
            </div>
          </div>

          <!-- Form Actions -->
          <div class="flex justify-end space-x-4 mt-8">
            <rs-button
              variant="primary-outline"
              @click="navigateTo('/BF-PA/PE/MP/01')"
            >
              Kembali
            </rs-button>
            <rs-button variant="primary" @click="handleSubmit">
              Sahkan
            </rs-button>
          </div>
        </FormKit>
      </template>
    </rs-card>

    <!-- Confirmation Modal -->
    <rs-modal
      v-model="showSuccessModal"
      title="Hantar ke Pelulus"
      size="md"
      position="center"
    >
      <template #body>
        <div class="text-center">
          <Icon
            name="material-symbols:help-outline"
            class="text-blue-500 text-5xl mb-4"
          />
          <p class="text-lg mb-2">
            Adakah anda pasti untuk menghantar Kiraan Jumlah Elaun ini kepada Ketua JPPA?
          </p>
          <p class="text-gray-600">
            Semakan ini akan dihantar kepada pelulus untuk kelulusan seterusnya.
          </p>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-center space-x-4">
          <rs-button
            variant="primary-outline"
            @click="showSuccessModal = false"
          >
            Batal
          </rs-button>
          <rs-button variant="primary" @click="confirmSubmit">
            Sokong & Hantar
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useToast } from "vue-toastification";
import { useRoute } from "vue-router";

definePageMeta({
  title: "Semakan Bantuan",
  description: "Semak dan ulas permohonan bantuan",
});

const route = useRoute();
const toast = useToast();
const showSuccessModal = ref(false);

const breadcrumb = ref([
  {
    name: "Pengurusan Penolong Amil",
    type: "link",
    path: "/BF-PA/PE/MP/01",
  },
  {
    name: "Semakan dan Sokongan",
    type: "current",
    path: "/BF-PA/PE/MP/03",
  },
]);

const formData = ref({
  kadarElaun: "100.00",
  jumlahElaun: "500.00",
  senaraiPenolong: [
    {
      id: 1,
      nama: "Nama Penolong Amil",
      tarikh: "2024-12-31",
    },
    {
      id: 2,
      nama: "Nama Penolong Amil",
      tarikh: "2024-12-31",
    },
    {
      id: 3,
      nama: "Nama Penolong Amil",
      tarikh: "2024-12-31",
    },
    {
      id: 4,
      nama: "Nama Penolong Amil",
      tarikh: "2024-12-31",
    },
    {
      id: 5,
      nama: "Nama Penolong Amil",
      tarikh: "2024-12-31",
    },
  ],
});

const getStatusVariant = (status) => {
  const variants = {
    "Menunggu Semakan": "warning",
    Lulus: "success",
    Tolak: "danger",
    "Kembali untuk Pembetulan": "warning",
    "Dalam Pemerhatian": "warning",
  };
  return variants[status] || "default";
};

onMounted(async () => {
  // TODO: Fetch bantuan data based on ID from route.params.id
  // For now using mock data
  const mockData = {
    kadarElaun: "100.00",
    jumlahElaun: "500.00",
    senaraiPenolong: [
      {
        nama: "Nama Penolong Amil",
        tarikh: "2024-12-31",
      },
      {
        nama: "Nama Penolong Amil",
        tarikh: "2024-12-31",
      },
      {
        nama: "Nama Penolong Amil",
        tarikh: "2024-12-31",
      },
      {
        nama: "Nama Penolong Amil",
        tarikh: "2024-12-31",
      },
      {
        nama: "Nama Penolong Amil",
        tarikh: "2024-12-31",
      },
    ],
  };

  formData.value = { ...mockData };
});

const handleSubmit = async (formData) => {
  try {
    // Show confirmation modal
    showSuccessModal.value = true;
  } catch (error) {
    toast.error("Ralat semasa mengemaskini status bantuan");
    console.error("Error updating bantuan status:", error);
  }
};

const confirmSubmit = async () => {
  try {
    // TODO: Implement API call to update bantuan status
    console.log("Updating bantuan status:", formData.value);

    // Close modal
    showSuccessModal.value = false;

    // Show success toast
    toast.success("Semakan telah berjaya dihantar kepada pelulus");

    // Navigate back to list
    // navigateToList();
    navigateTo("/BF-PA/PE/MP/04");
  } catch (error) {
    toast.error("Ralat semasa mengemaskini status bantuan");
    console.error("Error updating bantuan status:", error);
  }
};

const navigateToList = () => {
  navigateTo("/BF-BTN/PB/BTLB/01");
};
</script>
