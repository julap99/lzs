<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Semakan & Kelulusan Akhir</h2>
          <rs-badge :variant="getStatusVariant(applicationData.status)">
            {{ applicationData.status }}
          </rs-badge>
        </div>
      </template>

      <template #body>
        <div class="space-y-6">
          <!-- Maklumat Permohonan -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="text-lg font-semibold mb-4">Maklumat Permohonan</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">ID Permohonan</label>
                <p class="mt-1">{{ applicationData.id }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Tarikh Mohon</label>
                <p class="mt-1">{{ formatDate(applicationData.tarikhMohon) }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Nama Tabung</label>
                <p class="mt-1">{{ applicationData.namaTabung }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Pemohon</label>
                <p class="mt-1">{{ applicationData.pemohon }}</p>
              </div>
            </div>
          </div>

          <!-- Butiran Tabung -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="text-lg font-semibold mb-4">Butiran Tabung</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Jenis Akaun</label>
                <p class="mt-1">{{ applicationData.jenisAkaun }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Nilai Asas (RM)</label>
                <p class="mt-1">RM {{ formatNumber(applicationData.nilaiAsas) }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Had Minimum Baki (RM)</label>
                <p class="mt-1">RM {{ formatNumber(applicationData.hadMinimumBaki) }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Kaedah Pemindahan</label>
                <p class="mt-1">{{ applicationData.kaedahPemindahan }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Lokasi</label>
                <p class="mt-1">{{ applicationData.lokasi }}</p>
              </div>
            </div>
          </div>

          <!-- Ulasan KJ -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="text-lg font-semibold mb-4">Ulasan Ketua Jabatan</h3>
            <div>
              <label class="block text-sm font-medium text-gray-700">Catatan Tambahan</label>
              <p class="mt-1">{{ applicationData.ulasanKJ }}</p>
            </div>
          </div>

          <!-- Tindakan Pelulus -->
          <div class="bg-white border border-gray-200 p-4 rounded-lg">
            <h3 class="text-lg font-semibold mb-4">Tindakan Pelulus</h3>
            <div class="flex space-x-4">
              <rs-button
                variant="success"
                @click="handleApprove"
                :loading="isSubmitting"
              >
                <Icon name="ph:check-circle" class="mr-2" size="1rem" />
                Lulus
              </rs-button>
              <rs-button
                variant="danger"
                @click="showRejectModal = true"
                :loading="isSubmitting"
              >
                <Icon name="ph:x-circle" class="mr-2" size="1rem" />
                Tolak
              </rs-button>
            </div>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Rejection Modal -->
    <rs-modal
      v-model="showRejectModal"
      title="Tolak Permohonan"
      size="md"
      position="center"
    >
      <template #body>
        <div class="space-y-4">
          <p class="text-gray-700">
            Sila berikan sebab penolakan untuk permohonan ini:
          </p>
          <FormKit
            type="textarea"
            v-model="rejectionReason"
            label="Sebab Penolakan"
            placeholder="Masukkan sebab penolakan..."
            validation="required"
            :validation-messages="{
              required: 'Sebab penolakan adalah wajib',
            }"
            rows="4"
          />
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end space-x-2">
          <rs-button variant="secondary" @click="showRejectModal = false">
            Batal
          </rs-button>
          <rs-button variant="danger" @click="handleReject">
            Tolak Permohonan
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

definePageMeta({
  title: "Semakan & Kelulusan Akhir",
  description: "Pelulus mengesahkan atau menolak pendaftaran tabung",
});

const route = useRoute();
const isSubmitting = ref(false);
const showRejectModal = ref(false);
const rejectionReason = ref("");

const breadcrumb = ref([
  {
    name: "Tabung",
    type: "link",
    path: "/BF-TNI/peti-besi/konfigurasi/senarai",
  },
  {
    name: "Konfigurasi",
    type: "link",
    path: "/BF-TNI/peti-besi/konfigurasi/senarai",
  },
  {
    name: "Kelulusan",
    type: "current",
    path: `/BF-TNI/peti-besi/konfigurasi/kelulusan/${route.params.id}`,
  },
]);

// Mock application data
const applicationData = ref({
  id: "TB-2024-003",
  tarikhMohon: "2024-03-18",
  namaTabung: "Tabung Amil Daerah",
  pemohon: "Ahmad bin Abdullah",
  status: "Didaftarkan",
  jenisAkaun: "Amil",
  nilaiAsas: 50000,
  hadMinimumBaki: 10000,
  kaedahPemindahan: "Tunai",
  lokasi: "Daerah Kuala Lumpur",
  ulasanKJ: "Permohonan ini adalah wajar dan perlu untuk operasi amil di daerah ini. Sokongan diberikan untuk penubuhan tabung ini.",
});

onMounted(async () => {
  try {
    // Load application data based on ID
    console.log("TNI-KO-PB-04_2: Semakan & Kelulusan Akhir - Memuatkan data untuk ID:", route.params.id);
  } catch (error) {
    console.error("Error loading application data:", error);
  }
});

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("ms-MY", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatNumber = (number) => {
  return new Intl.NumberFormat('ms-MY').format(number);
};

const getStatusVariant = (status) => {
  switch (status) {
    case 'Didaftarkan':
      return 'info';
    case 'Lulus Pelulus':
      return 'success';
    case 'Ditolak':
      return 'danger';
    default:
      return 'default';
  }
};

const handleApprove = async () => {
  try {
    isSubmitting.value = true;
    
    // Set status to "Lulus Pelulus"
    applicationData.value.status = "Lulus Pelulus";
    
    console.log("TNI-KO-PB-04_2: Semakan & Kelulusan Akhir - Permohonan diluluskan");
    
    // Show success message
    alert("Permohonan berjaya diluluskan");
    
    // Navigate back to list
    navigateTo("/BF-TNI/peti-besi/konfigurasi/senarai");
  } catch (error) {
    console.error("Error approving application:", error);
  } finally {
    isSubmitting.value = false;
  }
};

const handleReject = async () => {
  try {
    isSubmitting.value = true;
    
    // Set status to "Ditolak"
    applicationData.value.status = "Ditolak";
    
    console.log("TNI-KO-PB-04_2: Semakan & Kelulusan Akhir - Permohonan ditolak:", rejectionReason.value);
    
    showRejectModal.value = false;
    
    // Show success message
    alert("Permohonan berjaya ditolak");
    
    // Navigate back to list
    navigateTo("/BF-TNI/peti-besi/konfigurasi/senarai");
  } catch (error) {
    console.error("Error rejecting application:", error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style lang="scss" scoped>
// Add any custom styles here if needed
</style> 