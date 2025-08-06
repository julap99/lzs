<template>
  <div>
    <!-- Page screen: TNI-KO-KT-06 -->
    <!-- Actor: Kewangan -->
    <!-- Roles: Kewangan Pemeriksa -->
    
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Semakan Permohonan Tambah Nilai Tunai</h2>
        </div>
      </template>

      <template #body>
        <div v-if="requestData" class="space-y-6">
          <!-- Maklumat Permohonan -->
          <rs-fieldset label="Maklumat Permohonan">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">ID Permohonan</label>
                <p class="text-gray-900">{{ requestData.id }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Tarikh Permohonan</label>
                <p class="text-gray-900">{{ formatDate(requestData.tarikh) }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Lokasi Tabung</label>
                <p class="text-gray-900">{{ requestData.lokasiTabung }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Kaedah Tambah Nilai</label>
                <p class="text-gray-900">{{ requestData.kaedah }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Jumlah Tambah Nilai</label>
                <p class="text-gray-900 font-medium">RM {{ formatNumber(requestData.jumlah) }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <rs-badge :variant="getStatusVariant(requestData.status)">
                  {{ requestData.status }}
                </rs-badge>
              </div>
            </div>

            <div class="mt-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Tujuan</label>
              <p class="text-gray-900 whitespace-pre-line">{{ requestData.tujuan }}</p>
            </div>
          </rs-fieldset>

          <!-- Action Buttons -->
          <div class="flex justify-end gap-4 pt-6">
            <rs-button
              variant="secondary"
              @click="goBack"
            >
              Kembali
            </rs-button>
            <rs-button
              variant="danger"
              @click="showRejectionModal = true"
            >
              Tolak Permohonan
            </rs-button>
            <rs-button
              variant="success"
              @click="approveRequest"
            >
              Sahkan dan Teruskan
            </rs-button>
          </div>
        </div>

        <!-- Loading State -->
        <div v-else class="flex justify-center items-center h-64">
          <div class="text-center">
            <Icon name="ic:outline-sync" class="animate-spin text-4xl text-primary mb-4" />
            <p class="text-gray-600">Memuatkan maklumat permohonan...</p>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Rejection Modal -->
    <rs-modal
      v-model="showRejectionModal"
      title="Tolak Permohonan"
      size="md"
    >
      <template #body>
        <div class="space-y-4">
          <p class="text-gray-700">Sila berikan sebab penolakan permohonan ini:</p>
          
          <FormKit
            type="textarea"
            v-model="rejectionReason"
            label="Sebab Penolakan"
            validation="required"
            :validation-messages="{
              required: 'Sila masukkan sebab penolakan'
            }"
            placeholder="Masukkan sebab penolakan..."
            rows="4"
          />
        </div>
      </template>

      <template #footer>
        <div class="flex justify-end gap-3">
          <rs-button
            variant="secondary"
            @click="showRejectionModal = false"
          >
            Batal
          </rs-button>
          <rs-button
            variant="danger"
            @click="rejectRequest"
            :loading="isSubmitting"
          >
            Tolak Permohonan
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
const router = useRouter();
const route = useRoute();

definePageMeta({
  title: "Semakan Permohonan Tambah Nilai Tunai",
});

// State
const requestData = ref(null);
const showRejectionModal = ref(false);
const rejectionReason = ref("");
const isSubmitting = ref(false);

// Breadcrumb
const breadcrumb = ref([
  {
    name: "Pentadbiran",
    type: "link",
    path: "/BF-TNI",
  },
  {
    name: "Tambah Nilai Tunai",
    type: "link",
    path: "/BF-TNI/tambah-nilai-tunai",
  },
  {
    name: "Senarai Permohonan",
    type: "link",
    path: "/BF-TNI/tambah-nilai-tunai/mohon-tambah-nilai-tunai",
  },
  {
    name: "Semakan Permohonan",
    type: "current",
    path: `/BF-TNI/tambah-nilai-tunai/semak/${route.params.id}`,
  },
]);

// Load request data
onMounted(async () => {
  await loadRequestData();
});

const loadRequestData = async () => {
  try {
    // Mock data - replace with API call
    requestData.value = {
      id: route.params.id,
      tarikh: "2024-03-19",
      lokasiTabung: "Cawangan Johor Bahru",
      kaedah: "eWallet",
      jumlah: 30000,
      status: "Menunggu Semakan",
      tujuan: "Untuk menambah nilai tabung cawangan yang telah mencapai had minimum. Permohonan ini dibuat untuk memastikan operasi cawangan dapat berjalan dengan lancar.",
    };
    
    console.log("TNI-KO-KT-03: Semakan Permohonan - Memuatkan data untuk ID:", route.params.id);
  } catch (error) {
    console.error("Error loading request data:", error);
  }
};

// Helper functions
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
    case 'Menunggu Semakan':
      return 'warning';
    case 'Lulus Semakan – Menunggu Pindahan':
      return 'info';
    case 'Ditolak':
      return 'danger';
    default:
      return 'default';
  }
};

// Action handlers
const approveRequest = async () => {
  try {
    isSubmitting.value = true;
    
    // TODO: Implement API call to approve request
    console.log("TNI-KO-KT-03: Semakan Permohonan - Permohonan diluluskan");
    console.log("Request ID:", route.params.id);
    console.log("Status: Lulus Semakan – Menunggu Pindahan");
    
    // Mock API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    alert("Permohonan berjaya diluluskan");
    goBack();
  } catch (error) {
    console.error("Error approving request:", error);
    alert("Ralat: " + error.message);
  } finally {
    isSubmitting.value = false;
  }
};

const rejectRequest = async () => {
  try {
    isSubmitting.value = true;
    
    if (!rejectionReason.value.trim()) {
      alert("Sila masukkan sebab penolakan");
      return;
    }
    
    // TODO: Implement API call to reject request
    console.log("TNI-KO-KT-03: Semakan Permohonan - Permohonan ditolak");
    console.log("Request ID:", route.params.id);
    console.log("Rejection reason:", rejectionReason.value);
    console.log("Status: Ditolak");
    
    // Mock API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    showRejectionModal.value = false;
    rejectionReason.value = "";
    alert("Permohonan berjaya ditolak");
    goBack();
  } catch (error) {
    console.error("Error rejecting request:", error);
    alert("Ralat: " + error.message);
  } finally {
    isSubmitting.value = false;
  }
};

const goBack = () => {
  router.push("/BF-TNI/tambah-nilai-tunai/mohon-tambah-nilai-tunai");
};
</script> 