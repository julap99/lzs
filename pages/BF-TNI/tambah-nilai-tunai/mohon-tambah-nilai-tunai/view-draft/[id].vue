<template>
  <div>
    <!-- Page screen: TNI-KO-KT-03 -->
    <!-- Actor: KC/KB/Eksekutif/KOAD -->
    <!-- Roles: Eksekutif -->
    
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Lihat Permohonan (Draft)</h2>
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
              variant="primary"
              @click="editRequest"
            >
              Edit
            </rs-button>
            <rs-button
              variant="success"
              @click="submitRequest"
              :loading="isSubmitting"
            >
              Hantar
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
  </div>
</template>

<script setup>
const router = useRouter();
const route = useRoute();

definePageMeta({
  title: "Lihat Permohonan (Draft)",
});

// State
const requestData = ref(null);
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
    name: "Lihat Permohonan (Draft)",
    type: "current",
    path: `/BF-TNI/tambah-nilai-tunai/mohon-tambah-nilai-tunai/view-draft/${route.params.id}`,
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
      tarikh: "2024-03-20",
      lokasiTabung: "Cawangan Kuala Lumpur",
      kaedah: "Tunai",
      jumlah: 50000,
      status: "Draft",
      tujuan: "Untuk menambah nilai tabung cawangan yang telah mencapai had minimum. Permohonan ini dibuat untuk memastikan operasi cawangan dapat berjalan dengan lancar.",
    };
    
    console.log("TNI-KO-KT-03: Lihat Permohonan (Draft) - Memuatkan data untuk ID:", route.params.id);
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
    case 'Draft':
      return 'default';
    case 'Menunggu Semakan':
      return 'warning';
    default:
      return 'default';
  }
};

// Action handlers
const editRequest = () => {
  router.push(`/BF-TNI/tambah-nilai-tunai/mohon-tambah-nilai-tunai/form?id=${route.params.id}`);
};

const submitRequest = async () => {
  try {
    isSubmitting.value = true;
    
    // TODO: Implement API call to submit request
    console.log("TNI-KO-KT-03: Lihat Permohonan (Draft) - Permohonan dihantar");
    console.log("Request ID:", route.params.id);
    console.log("Status: Menunggu Semakan");
    
    // Mock API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    alert("Permohonan berjaya dihantar");
    goBack();
  } catch (error) {
    console.error("Error submitting request:", error);
    alert("Ralat: " + error.message);
  } finally {
    isSubmitting.value = false;
  }
};

const goBack = () => {
  router.push("/BF-TNI/tambah-nilai-tunai/mohon-tambah-nilai-tunai");
};
</script> 