<template>
  <div>
    <!-- Page screen: TNI-KO-KT-11 -->
    <!-- Actor: Kewangan -->
    <!-- Roles: Kewangan Pegawai -->
    
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Pengesahan Penerimaan Tunai oleh Penerima</h2>
        </div>
      </template>

      <template #body>
        <div v-if="processData" class="space-y-6">
          <!-- Ringkasan Permohonan -->
          <rs-fieldset label="Ringkasan Permohonan">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">ID Permohonan</label>
                <p class="text-gray-900 font-medium">{{ processData.id }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Tarikh Permohonan</label>
                <p class="text-gray-900">{{ formatDate(processData.tarikhPermohonan) }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Lokasi Tabung</label>
                <p class="text-gray-900">{{ processData.lokasiTabung }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Kaedah Tambah Nilai</label>
                <p class="text-gray-900">{{ processData.kaedah }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Jumlah Tambah Nilai</label>
                <p class="text-gray-900 font-medium text-lg">RM {{ formatNumber(processData.jumlah) }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Status Akhir</label>
                <rs-badge :variant="getStatusVariant(processData.status)" class="text-sm">
                  {{ processData.status }}
                </rs-badge>
              </div>
            </div>

            <div class="mt-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Tujuan</label>
              <p class="text-gray-900 whitespace-pre-line">{{ processData.tujuan }}</p>
            </div>
          </rs-fieldset>

          <!-- Maklumat Kelulusan -->
          <rs-fieldset label="Maklumat Kelulusan">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Tarikh Kelulusan</label>
                <p class="text-gray-900">{{ formatDate(processData.tarikhKelulusan) }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Pelulus</label>
                <p class="text-gray-900">{{ processData.pelulus }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Status Kelulusan</label>
                <rs-badge variant="success" class="text-sm">
                  Lulus
                </rs-badge>
              </div>
            </div>
          </rs-fieldset>

          <!-- Maklumat Arahan Pindahan -->
          <rs-fieldset label="Maklumat Arahan Pindahan">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Tarikh Arahan</label>
                <p class="text-gray-900">{{ formatDateTime(processData.tarikhArahan) }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Lokasi Pengambilan</label>
                <p class="text-gray-900">{{ processData.lokasiPengambilan }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nama Pegawai Bertugas</label>
                <p class="text-gray-900">{{ processData.namaPegawaiBertugas }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Status Arahan</label>
                <rs-badge variant="success" class="text-sm">
                  Telah Diarahkan
                </rs-badge>
              </div>
            </div>
          </rs-fieldset>

          <!-- Maklumat Penerimaan -->
          <rs-fieldset label="Maklumat Penerimaan Tunai">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Tarikh & Masa Terima</label>
                <p class="text-gray-900">{{ formatDateTime(processData.tarikhMasaTerima) }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nama Penerima</label>
                <p class="text-gray-900">{{ processData.namaPenerima }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Jumlah Tunai Terima</label>
                <p class="text-gray-900 font-medium text-lg">RM {{ formatNumber(processData.jumlahTunaiTerima) }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Status Penerimaan</label>
                <rs-badge variant="success" class="text-sm">
                  Sah & Siap
                </rs-badge>
              </div>
            </div>
            <div class="mt-4" v-if="processData.catatan">
              <label class="block text-sm font-medium text-gray-700 mb-1">Catatan</label>
              <p class="text-gray-900 whitespace-pre-line">{{ processData.catatan }}</p>
            </div>
          </rs-fieldset>

          <!-- Timeline Proses -->
          <rs-fieldset label="Timeline Proses">
            <div class="space-y-4">
              <div class="flex items-center space-x-4">
                <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Icon name="ph:check" class="text-white" size="16" />
                </div>
                <div class="flex-1">
                  <p class="font-medium text-gray-900">Permohonan Dihantar</p>
                  <p class="text-sm text-gray-600">{{ formatDateTime(processData.timeline.dihantar) }}</p>
                </div>
              </div>
              
              <div class="flex items-center space-x-4">
                <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Icon name="ph:check" class="text-white" size="16" />
                </div>
                <div class="flex-1">
                  <p class="font-medium text-gray-900">Semakan & Kelulusan</p>
                  <p class="text-sm text-gray-600">{{ formatDateTime(processData.timeline.diluluskan) }}</p>
                </div>
              </div>
              
              <div class="flex items-center space-x-4">
                <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Icon name="ph:check" class="text-white" size="16" />
                </div>
                <div class="flex-1">
                  <p class="font-medium text-gray-900">Arahan Pindahan Dikeluarkan</p>
                  <p class="text-sm text-gray-600">{{ formatDateTime(processData.timeline.diarahkan) }}</p>
                </div>
              </div>
              
              <div class="flex items-center space-x-4">
                <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Icon name="ph:check" class="text-white" size="16" />
                </div>
                <div class="flex-1">
                  <p class="font-medium text-gray-900">Penerimaan Disahkan</p>
                  <p class="text-sm text-gray-600">{{ formatDateTime(processData.timeline.diterima) }}</p>
                </div>
              </div>
            </div>
          </rs-fieldset>

          <!-- Action Buttons -->
          <div class="flex justify-end gap-4 pt-6">
            <rs-button
              variant="secondary"
              @click="goBack"
            >
              Kembali ke Senarai Permohonan
            </rs-button>
            <rs-button
              variant="primary"
              @click="downloadReport"
            >
              <Icon name="ph:download" class="mr-1" />
              Muat Turun Laporan
            </rs-button>
          </div>
        </div>

        <!-- Loading State -->
        <div v-else class="flex justify-center items-center h-64">
          <div class="text-center">
            <Icon name="ic:outline-sync" class="animate-spin text-4xl text-primary mb-4" />
            <p class="text-gray-600">Memuatkan maklumat status tamat...</p>
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
  title: "Pengesahan Penerimaan Tunai oleh Penerima",
});

// State
const processData = ref(null);

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
    name: "Status Tamat Proses",
    type: "current",
    path: `/BF-TNI/tambah-nilai-tunai/status-tamat/${route.params.id}`,
  },
]);

// Load process data
onMounted(async () => {
  await loadProcessData();
});

const loadProcessData = async () => {
  try {
    // Mock data - replace with API call
    processData.value = {
      id: route.params.id,
      tarikhPermohonan: "2024-03-17",
      lokasiTabung: "Cawangan Melaka",
      kaedah: "eWallet",
      jumlah: 25000,
      status: "Sah & Siap",
      tujuan: "Untuk menambah nilai tabung cawangan yang telah mencapai had minimum. Permohonan ini dibuat untuk memastikan operasi cawangan dapat berjalan dengan lancar.",
      
      // Approval data
      tarikhKelulusan: "2024-03-18",
      pelulus: "Ahmad bin Abdullah",
      
      // Transfer order data
      tarikhArahan: "2024-03-19T10:30:00",
      lokasiPengambilan: "Maybank Melaka",
      namaPegawaiBertugas: "Siti binti Ahmad",
      
      // Receipt data
      tarikhMasaTerima: "2024-03-20T14:30:00",
      namaPenerima: "Ahmad bin Abdullah",
      jumlahTunaiTerima: 25000,
      catatan: "Tunai diterima dengan lengkap dan betul. Proses tambah nilai telah selesai.",
      
      // Timeline
      timeline: {
        dihantar: "2024-03-17T09:00:00",
        diluluskan: "2024-03-18T14:30:00",
        diarahkan: "2024-03-19T10:30:00",
        diterima: "2024-03-20T14:30:00"
      }
    };
    
    console.log("TNI-KO-KT-11: Pengesahan Penerimaan oleh Penerima - Memuatkan data untuk ID:", route.params.id);
  } catch (error) {
    console.error("Error loading process data:", error);
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
    case 'Sah & Siap':
      return 'success';
    case 'Ditolak':
      return 'danger';
    default:
      return 'default';
  }
};

// Action handlers
const goBack = () => {
  router.push("/BF-TNI/tambah-nilai-tunai/mohon-tambah-nilai-tunai");
};

const downloadReport = () => {
      console.log("TNI-KO-KT-11: Pengesahan Penerimaan oleh Penerima - Muat turun laporan");
  console.log("Request ID:", route.params.id);
  alert("Laporan berjaya dimuat turun");
};
</script> 