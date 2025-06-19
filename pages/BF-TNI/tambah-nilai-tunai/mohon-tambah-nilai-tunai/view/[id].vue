<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Butiran Permohonan Tambah Nilai Tunai</h2>
        </div>
      </template>

      <template #body>
        <div v-if="request" class="space-y-6">
          <!-- Header Info -->
          <rs-fieldset label="Maklumat Pemohon" class="mb-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nama Pemohon</label>
                <p class="text-gray-900">{{ request.namaPemohon }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Lokasi / Akaun Peti Besi</label>
                <p class="text-gray-900">{{ request.lokasiAkaun }}</p>
              </div>
            </div>
          </rs-fieldset>

          <!-- Request Details -->
          <rs-fieldset label="Maklumat Permohonan">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">ID Permohonan</label>
                <p class="text-gray-900">{{ request.id }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Tarikh Permohonan</label>
                <p class="text-gray-900">{{ request.tarikhPermohonan }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Jumlah Dipohon (RM)</label>
                <p class="text-gray-900">{{ request.jumlahDipohon }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Status Permohonan</label>
                <span 
                  class="px-3 py-1 rounded-full text-sm font-medium"
                  :class="getStatusClass(request.status)"
                >
                  {{ request.status }}
                </span>
              </div>
            </div>

            <div class="mt-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Justifikasi / Catatan Tambahan</label>
              <p class="text-gray-900 whitespace-pre-line">{{ request.justifikasi }}</p>
            </div>
          </rs-fieldset>

          <!-- Action Buttons -->
          <div class="flex justify-end gap-4 mt-6">
            <rs-button @click="goBack">
              Kembali
            </rs-button>
            <rs-button
              v-if="request.status === 'Draft'"
              variant="primary"
              @click="editRequest"
            >
              Edit Permohonan
            </rs-button>
          </div>
        </div>

        <!-- Loading State -->
        <div v-else class="flex justify-center items-center h-64">
          <div class="text-center">
            <Icon name="ic:outline-sync" class="animate-spin text-4xl text-primary mb-4" />
            <p class="text-gray-600">Memuatkan butiran permohonan...</p>
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
  title: 'Butiran Permohonan Tambah Nilai Tunai',
  middleware: ['auth']
});

// State
const request = ref(null);

// Breadcrumb
const breadcrumb = ref([
  {
    name: 'Tambah Nilai Tunai',
    type: 'current',
    path: '/BF-TNI/tambah-nilai-tunai'
  },
  {
    name: 'Mohon Tambah Nilai Tunai',
    type: 'current',
    path: '/BF-TNI/tambah-nilai-tunai/mohon-tambah-nilai-tunai'
  },
  {
    name: 'Butiran Permohonan',
    type: 'current',
    path: `/BF-TNI/tambah-nilai-tunai/mohon-tambah-nilai-tunai/view/${route.params.id}`
  }
]);

// Methods
const loadRequestData = async () => {
  try {
    // TODO: Implement API call to fetch request data
    // Mock data for now
    await new Promise(resolve => setTimeout(resolve, 1000));
    request.value = {
      id: 'REQ-001',
      namaPemohon: 'John Doe',
      lokasiAkaun: 'Peti Besi A-123',
      tarikhPermohonan: '2024-03-20',
      jumlahDipohon: '5,000.00',
      status: 'Menunggu Proses',
      justifikasi: 'Sample justification text\nWith multiple lines'
    };
  } catch (error) {
    console.error('Error loading request data:', error);
    // TODO: Show error message
    alert('Ralat: ' + error.message);
  }
};

const getStatusClass = (status) => {
  const classes = {
    'Draft': 'bg-gray-100 text-gray-800',
    'Menunggu Proses': 'bg-blue-100 text-blue-800',
    'Selesai': 'bg-green-100 text-green-800',
    'Ditolak': 'bg-red-100 text-red-800'
  };
  return classes[status] || 'bg-gray-100 text-gray-800';
};

const editRequest = () => {
  router.push(`/BF-TNI/tambah-nilai-tunai/mohon-tambah-nilai-tunai/form/${request.value.id}`);
};

const goBack = () => {
  router.push('/BF-TNI/tambah-nilai-tunai/mohon-tambah-nilai-tunai');
};

// Load request data on mount
onMounted(() => {
  loadRequestData();
});
</script>

<style lang="scss" scoped>
// Add any custom styles here
</style> 