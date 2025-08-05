<template>
  <div>
    <!-- Page screen: TNI-KO-KT-04 -->
    <!-- Actor: KC/KB/Eksekutif/KOAD -->
    <!-- Roles: Eksekutif -->
    
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
                <p class="text-gray-900">{{ formatDate(request.tarikh) }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Lokasi Tabung</label>
                <p class="text-gray-900">{{ request.lokasiTabung }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Kaedah Tambah Nilai</label>
                <p class="text-gray-900">{{ request.kaedah }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Jumlah Tambah Nilai</label>
                <p class="text-gray-900 font-medium">RM {{ formatNumber(request.jumlah) }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Status Permohonan</label>
                <rs-badge :variant="getStatusVariant(request.status)">
                  {{ request.status }}
                </rs-badge>
              </div>
            </div>

            <div class="mt-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Tujuan</label>
              <p class="text-gray-900 whitespace-pre-line">{{ request.tujuan }}</p>
            </div>
          </rs-fieldset>

          <!-- Conditional Sections -->
          <rs-fieldset v-if="request.status === 'Disahkan'" label="Maklumat Penerimaan Tunai">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Tarikh & Masa Terima</label>
                <p class="text-gray-900">{{ formatDateTime(request.tarikhMasaTerima) }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nama Penerima</label>
                <p class="text-gray-900">{{ request.namaPenerima }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Jumlah Tunai Terima</label>
                <p class="text-gray-900 font-medium">RM {{ formatNumber(request.jumlahTunaiTerima) }}</p>
              </div>
            </div>
            <div class="mt-4" v-if="request.catatan">
              <label class="block text-sm font-medium text-gray-700 mb-1">Catatan</label>
              <p class="text-gray-900 whitespace-pre-line">{{ request.catatan }}</p>
            </div>
          </rs-fieldset>

          <rs-fieldset v-if="request.status === 'Ditolak'" label="Sebab Penolakan">
            <div class="bg-red-50 border border-red-200 rounded-lg p-4">
              <p class="text-red-800">{{ request.sebabPenolakan }}</p>
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
    name: "Lihat Permohonan",
    type: "current",
    path: `/BF-TNI/tambah-nilai-tunai/mohon-tambah-nilai-tunai/view/${route.params.id}`,
  },
]);

// Methods
const loadRequestData = async () => {
  try {
    // TODO: Implement API call to fetch request data
    // Mock data for now
    await new Promise(resolve => setTimeout(resolve, 1000));
    request.value = {
      id: route.params.id,
      tarikh: "2024-03-19",
      lokasiTabung: "Cawangan Johor Bahru",
      kaedah: "eWallet",
      jumlah: 30000,
      status: "Menunggu Semakan",
      tujuan: "Untuk menambah nilai tabung cawangan yang telah mencapai had minimum. Permohonan ini dibuat untuk memastikan operasi cawangan dapat berjalan dengan lancar.",
      // Conditional data for different statuses
      tarikhMasaTerima: "2024-03-21T14:30:00",
      namaPenerima: "Ahmad bin Abdullah",
      jumlahTunaiTerima: 30000,
      catatan: "Tunai diterima dengan lengkap dan betul",
      sebabPenolakan: "Jumlah yang dipohon melebihi had yang dibenarkan untuk cawangan ini."
    };
    
    console.log("TNI-KO-KT-04: Lihat Permohonan - Memuatkan data untuk ID:", route.params.id);
  } catch (error) {
    console.error('Error loading request data:', error);
    alert('Ralat: ' + error.message);
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

const formatDateTime = (dateTime) => {
  return new Date(dateTime).toLocaleString("ms-MY", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
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
    case 'Lulus Semakan – Menunggu Pindahan':
      return 'info';
    case 'Surat Arahan Disahkan':
      return 'success';
    case 'Tunai Diterima – Menunggu Pengesahan':
      return 'warning';
    case 'Disahkan':
      return 'success';
    case 'Ditolak':
      return 'danger';
    default:
      return 'default';
  }
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