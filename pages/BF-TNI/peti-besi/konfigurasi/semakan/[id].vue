<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Semakan Tabung Baharu</h2>
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
            </div>
          </div>

          <!-- Justifikasi -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="text-lg font-semibold mb-4">Justifikasi</h3>
            <div>
              <label class="block text-sm font-medium text-gray-700">Tujuan Penubuhan</label>
              <p class="mt-1">{{ applicationData.tujuanPenubuhan }}</p>
            </div>
            <div class="mt-4">
              <label class="block text-sm font-medium text-gray-700">Keperluan Operasi</label>
              <p class="mt-1">{{ applicationData.keperluanOperasi }}</p>
            </div>
          </div>

          <!-- Tindakan KJ -->
          <div class="bg-white border border-gray-200 p-4 rounded-lg">
            <h3 class="text-lg font-semibold mb-4">Tindakan Ketua Jabatan</h3>
            <div class="flex space-x-4">
              <rs-button
                variant="success"
                @click="handleSupport"
                :loading="isSubmitting"
              >
                <Icon name="ph:thumbs-up" class="mr-2" size="1rem" />
                Sokong
              </rs-button>
              <rs-button
                variant="danger"
                @click="showRejectModal = true"
                :loading="isSubmitting"
              >
                <Icon name="ph:thumbs-down" class="mr-2" size="1rem" />
                Tidak Sokong
              </rs-button>
            </div>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Rejection Modal -->
    <rs-modal
      v-model="showRejectModal"
      title="Tidak Sokong Permohonan"
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
  title: "Semakan Tabung Baharu",
  description: "Ketua Jabatan menyemak butiran permohonan tabung",
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
    name: "Semakan Tabung",
    type: "current",
    path: `/BF-TNI/peti-besi/konfigurasi/semakan/${route.params.id}`,
  },
]);

// Mock application data
const applicationData = ref({
  id: "TB-2024-001",
  tarikhMohon: "2024-03-20",
  namaTabung: "Tabung Bantuan Kecemasan",
  pemohon: "Ahmad bin Abdullah",
  status: "Menunggu Semakan KJ",
  jenisAkaun: "Bantuan",
  nilaiAsas: 50000,
  hadMinimumBaki: 10000,
  kaedahPemindahan: "Tunai",
  tujuanPenubuhan: "Untuk membantu mangsa bencana alam dan kecemasan",
  keperluanOperasi: "Memerlukan dana segera untuk operasi bantuan kecemasan di seluruh negeri",
});

onMounted(async () => {
  try {
    // Load application data based on ID
    console.log("TNI-KO-PB-02_2: Semakan Tabung Baharu - Memuatkan data untuk ID:", route.params.id);
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
    case 'Menunggu Semakan KJ':
      return 'warning';
    case 'Sokong KJ':
      return 'success';
    case 'Ditolak':
      return 'danger';
    default:
      return 'default';
  }
};

const handleSupport = async () => {
  try {
    isSubmitting.value = true;
    
    // Update status to "Sokong KJ"
    applicationData.value.status = "Sokong KJ";
    
    console.log("TNI-KO-PB-02_2: Semakan Tabung Baharu - Permohonan disokong");
    
    // Navigate to next step
    navigateTo(`/BF-TNI/peti-besi/konfigurasi/ulasan/${route.params.id}`);
  } catch (error) {
    console.error("Error supporting application:", error);
  } finally {
    isSubmitting.value = false;
  }
};

const handleReject = async () => {
  try {
    isSubmitting.value = true;
    
    // Update status to "Ditolak"
    applicationData.value.status = "Ditolak";
    
    console.log("TNI-KO-PB-02_2: Semakan Tabung Baharu - Permohonan ditolak:", rejectionReason.value);
    
    showRejectModal.value = false;
    
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