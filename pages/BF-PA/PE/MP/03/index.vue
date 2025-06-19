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
              @click="goBack"
            >
              Kembali
            </rs-button>
            <rs-button 
              variant="danger-outline"
              @click="handleReject"
            >
              Tolak
            </rs-button>
            <rs-button 
              variant="primary" 
              @click="handleApprove"
            >
              Sokong
            </rs-button>
          </div>
        </FormKit>
      </template>
    </rs-card>

    <!-- Success Modal for Approval -->
    <rs-modal
      v-model="showSuccessModal"
      title="Sokongan Berjaya Dihantar"
      size="md"
      position="center"
    >
      <template #body>
        <div class="text-center">
          <div class="flex justify-center mb-4">
            <Icon
              name="material-symbols:check-circle"
              class="text-green-500"
              size="48"
            />
          </div>
          <p class="mb-2">
            Permohonan elaun penolong amil berjaya disokong dan dihantar.
          </p>
          <p class="text-gray-600">
            Status permohonan telah dikemaskini kepada "Menunggu Kelulusan Ketua JPPA".
          </p>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-center">
          <rs-button variant="primary" @click="handleModalClose">
            Tutup
          </rs-button>
        </div>
      </template>
    </rs-modal>

    <!-- Success Modal for Rejection -->
    <rs-modal
      v-model="showRejectSuccessModal"
      title="Permohonan Ditolak"
      size="md"
      position="center"
    >
      <template #body>
        <div class="text-center">
          <div class="flex justify-center mb-4">
            <Icon
              name="material-symbols:check-circle"
              class="text-red-500"
              size="48"
            />
          </div>
          <p class="mb-2">
            Permohonan elaun penolong amil telah ditolak.
          </p>
          <p class="text-gray-600">
            Status permohonan telah dikemaskini kepada "Ditolak".
          </p>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-center">
          <rs-button variant="primary" @click="handleRejectModalClose">
            Kembali ke Senarai
          </rs-button>
        </div>
      </template>
    </rs-modal>

    <!-- Confirmation Modal -->
    <rs-modal
      v-model="showConfirmModal"
      :title="isRejecting ? 'Pengesahan Tolak' : 'Pengesahan Sokong'"
      size="md"
      position="center"
    >
      <template #body>
        <div>
          <p class="mb-4">
            {{ isRejecting 
              ? 'Adakah anda pasti untuk menolak permohonan elaun penolong amil ini?'
              : 'Adakah anda pasti untuk menyokong permohonan elaun penolong amil ini?'
            }}
          </p>
          <p class="text-gray-600 text-sm">
            {{ isRejecting 
              ? 'Selepas ditolak, permohonan ini tidak boleh dihantar semula. Notifikasi akan dihantar kepada pemohon.'
              : 'Selepas disokong, permohonan akan dihantar kepada Ketua JPPA untuk kelulusan.'
            }}
          </p>
          <div class="mt-4">
            <FormKit
              type="textarea"
              name="remarks"
              :label="isRejecting ? 'Sebab Penolakan (Pilihan)' : 'Ulasan / Justifikasi (Pilihan)'"
              :placeholder="isRejecting ? 'Masukkan sebab penolakan permohonan (jika ada)' : 'Masukkan ulasan dan justifikasi sokongan (jika ada)'"
              rows="3"
              v-model="remarks"
            />
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end space-x-3">
          <rs-button variant="outline" @click="showConfirmModal = false">
            Batal
          </rs-button>
          <rs-button 
            :variant="isRejecting ? 'danger' : 'primary'" 
            @click="confirmSubmission"
          >
            {{ isRejecting ? 'Tolak' : 'Sokong' }}
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
const showRejectSuccessModal = ref(false);
const showConfirmModal = ref(false);
const isRejecting = ref(false);
const remarks = ref('');

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
  kadarElaun: "25.00",
  jumlahElaun: "125.00",
  senaraiPenolong: [
    {
      id: 1,
      nama: "Ahmad bin Abdullah",
      tarikh: "2024-12-31",
      elaun: "25.00"
    },
    {
      id: 2,
      nama: "Siti Aminah binti Hassan",
      tarikh: "2024-12-31",
      elaun: "25.00"
    },
    {
      id: 3,
      nama: "Mohd Razak bin Ibrahim",
      tarikh: "2024-12-31",
      elaun: "25.00"
    },
    {
      id: 4,
      nama: "Nurul Aisyah binti Omar",
      tarikh: "2024-12-31",
      elaun: "25.00"
    },
    {
      id: 5,
      nama: "Ali bin Hassan",
      tarikh: "2024-12-31",
      elaun: "25.00"
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
    kadarElaun: "25.00",
    jumlahElaun: "125.00",
    senaraiPenolong: [
      {
        nama: "Ahmad bin Abdullah",
        tarikh: "2024-12-31",
        elaun: "25.00"
      },
      {
        nama: "Siti Aminah binti Hassan",
        tarikh: "2024-12-31",
        elaun: "25.00"
      },
      {
        nama: "Mohd Razak bin Ibrahim",
        tarikh: "2024-12-31",
        elaun: "25.00"
      },
      {
        nama: "Nurul Aisyah binti Omar",
        tarikh: "2024-12-31",
        elaun: "25.00"
      },
      {
        nama: "Ali bin Hassan",
        tarikh: "2024-12-31",
        elaun: "25.00"
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

const handleApprove = () => {
  isRejecting.value = false;
  showConfirmModal.value = true;
};

const handleReject = () => {
  isRejecting.value = true;
  showConfirmModal.value = true;
};

const goBack = () => {
  navigateTo('/BF-PA/PE/MP/Paparan_JPPA');
};

const handleModalClose = () => {
  showSuccessModal.value = false;
  navigateTo('/BF-PA/PE/MP/Paparan_JPPA');
};

const handleRejectModalClose = () => {
  showRejectSuccessModal.value = false;
  navigateTo('/BF-PA/PE/MP/Paparan_JPPA');
};

const confirmSubmission = async () => {
  try {
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    showConfirmModal.value = false;
    remarks.value = '';
    
    if (isRejecting.value) {
      showRejectSuccessModal.value = true;
    } else {
      showSuccessModal.value = true;
    }
  } catch (error) {
    console.error('Error processing submission:', error);
  }
};
</script>
