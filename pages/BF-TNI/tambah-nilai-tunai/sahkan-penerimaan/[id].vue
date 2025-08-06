<template>
  <div>
    <!-- Page screen: TNI-KO-KT-09 -->
    <!-- Actor: CC/EPOAD -->
    <!-- Roles: Eksekutif -->
    
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Pengesahan Serahan Tunai</h2>
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
            </div>
          </rs-fieldset>

          <!-- Maklumat Arahan Pindahan -->
          <rs-fieldset label="Maklumat Arahan Pindahan">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Lokasi Pengambilan</label>
                <p class="text-gray-900">{{ transferOrder.lokasiPengambilan }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nama Pegawai Bertugas</label>
                <p class="text-gray-900">{{ transferOrder.namaPegawaiBertugas }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Tarikh & Masa Arahan</label>
                <p class="text-gray-900">{{ formatDateTime(transferOrder.tarikhMasa) }}</p>
              </div>
            </div>
          </rs-fieldset>

          <!-- Form Pengesahan -->
          <rs-fieldset label="Pengesahan Penerimaan">
            <FormKit
              type="form"
              v-model="formData"
              :actions="false"
              @submit="handleSubmit"
            >
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormKit
                  type="datetime-local"
                  name="tarikhMasaTerima"
                  label="Tarikh & Masa Terima"
                  :value="currentDateTime"
                  readonly
                  help="Tarikh dan masa tunai diterima"
                />
                <FormKit
                  type="text"
                  name="namaPenyerah"
                  label="Nama Penyerah"
                  validation="required"
                  :validation-messages="{
                    required: 'Sila masukkan nama penyerah'
                  }"
                  placeholder="Masukkan nama penyerah tunai"
                />
                <FormKit
                  type="text"
                  name="namaPenerima"
                  label="Nama Penerima"
                  :value="currentUserName"
                  readonly
                  help="Nama penerima (pengguna semasa)"
                />
                <FormKit
                  type="number"
                  name="jumlahTunaiTerima"
                  label="Jumlah Tunai Terima (RM)"
                  :value="requestData.jumlah"
                  validation="required|number|min:0"
                  :validation-messages="{
                    required: 'Sila masukkan jumlah tunai terima',
                    number: 'Sila masukkan nilai yang sah',
                    min: 'Jumlah tidak boleh negatif'
                  }"
                  step="0.01"
                  min="0"
                />
              </div>

              <div class="mt-4">
                <FormKit
                  type="textarea"
                  name="catatan"
                  label="Catatan"
                  placeholder="Masukkan catatan tambahan jika perlu..."
                  help="Catatan mengenai penerimaan tunai"
                />
              </div>

              <div class="mt-4">
                <FormKit
                  type="checkbox"
                  name="pengesahan"
                  label="Saya mengesahkan bahawa tunai telah diterima dengan lengkap dan betul"
                  validation="required"
                  :validation-messages="{
                    required: 'Sila sahkan penerimaan tunai'
                  }"
                />
              </div>

              <!-- Action Buttons -->
              <div class="flex justify-end gap-4 pt-6">
                <rs-button
                  variant="secondary"
                  @click="goBack"
                >
                  Batal
                </rs-button>
                <rs-button
                  variant="success"
                  type="submit"
                  :loading="isSubmitting"
                >
                  Sahkan Terima
                </rs-button>
              </div>
            </FormKit>
          </rs-fieldset>
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
  title: "Pengesahan Serahan Tunai",
});

// State
const requestData = ref(null);
const transferOrder = ref(null);
const formData = ref({
  tarikhMasaTerima: "",
  namaPenyerah: "",
  namaPenerima: "",
  jumlahTunaiTerima: "",
  catatan: "",
  pengesahan: false,
});
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
    name: "Pengesahan Serahan Tunai",
    type: "current",
    path: `/BF-TNI/tambah-nilai-tunai/sahkan-penerimaan/${route.params.id}`,
  },
]);

// Computed
const currentDateTime = computed(() => {
  return new Date().toISOString().slice(0, 16);
});

const currentUserName = computed(() => {
  return "Ahmad bin Abdullah"; // Mock user name
});

// Load request data
onMounted(async () => {
  await loadRequestData();
});

const loadRequestData = async () => {
  try {
    // Mock data - replace with API call
    requestData.value = {
      id: route.params.id,
      tarikh: "2024-03-17",
      lokasiTabung: "Cawangan Melaka",
      kaedah: "eWallet",
      jumlah: 25000,
      status: "Tunai Diterima – Menunggu Pengesahan",
    };

    transferOrder.value = {
      lokasiPengambilan: "Maybank Melaka",
      namaPegawaiBertugas: "Siti binti Ahmad",
      tarikhMasa: "2024-03-20T14:30:00",
    };

    // Pre-fill form data
    formData.value.tarikhMasaTerima = currentDateTime.value;
    formData.value.namaPenerima = currentUserName.value;
    formData.value.jumlahTunaiTerima = requestData.value.jumlah;
    
    console.log("TNI-KO-KT-09: Pengesahan Serahan Tunai - Memuatkan data untuk ID:", route.params.id);
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

// Action handlers
const handleSubmit = async (formData) => {
  try {
    isSubmitting.value = true;
    
    // TODO: Implement API call to confirm receipt
    console.log("TNI-KO-KT-09: Pengesahan Serahan Tunai - Penerimaan disahkan");
    console.log("Request ID:", route.params.id);
    console.log("Form data:", formData);
    console.log("Status: Sah & Siap");
    
    // Mock API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    alert("Pengesahan penerimaan berjaya disimpan");
    goBack();
  } catch (error) {
    console.error("Error confirming receipt:", error);
    alert("Ralat: " + error.message);
  } finally {
    isSubmitting.value = false;
  }
};

const goBack = () => {
  router.push("/BF-TNI/tambah-nilai-tunai/mohon-tambah-nilai-tunai");
};
</script> 