<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Borang Pendaftaran Tabung Baharu</h2>
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
                <label class="block text-sm font-medium text-gray-700">Nama Tabung</label>
                <p class="mt-1">{{ applicationData.namaTabung }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Pemohon</label>
                <p class="mt-1">{{ applicationData.pemohon }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Status</label>
                <rs-badge variant="success">{{ applicationData.status }}</rs-badge>
              </div>
            </div>
          </div>

          <!-- Borang Pendaftaran -->
          <div class="bg-white border border-gray-200 p-4 rounded-lg">
            <h3 class="text-lg font-semibold mb-4">Maklumat Tabung</h3>
            <FormKit
              type="form"
              @submit="handleSubmit"
              :actions="false"
              v-model="formData"
            >
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Nama Akaun -->
                <FormKit
                  type="text"
                  name="namaAkaun"
                  label="Nama Akaun"
                  placeholder="Masukkan nama akaun tabung"
                  validation="required"
                  :validation-messages="{
                    required: 'Nama akaun adalah wajib',
                  }"
                />

                <!-- Jenis Akaun -->
                <FormKit
                  type="select"
                  name="jenisAkaun"
                  label="Jenis Akaun"
                  placeholder="Pilih jenis akaun"
                  validation="required"
                  :validation-messages="{
                    required: 'Jenis akaun adalah wajib',
                  }"
                  :options="[
                    { label: 'Cawangan', value: 'Cawangan' },
                    { label: 'Amil', value: 'Amil' },
                    { label: 'Operasi Daerah', value: 'Operasi Daerah' },
                    { label: 'Baitul', value: 'Baitul' },
                  ]"
                />

                <!-- Nilai Asas -->
                <FormKit
                  type="number"
                  name="nilaiAsas"
                  label="Nilai Asas (RM)"
                  placeholder="Masukkan nilai asas"
                  validation="required|min:0"
                  :validation-messages="{
                    required: 'Nilai asas adalah wajib',
                    min: 'Nilai asas mesti lebih besar daripada 0',
                  }"
                  step="0.01"
                  min="0"
                />

                <!-- Had Minimum Baki -->
                <FormKit
                  type="number"
                  name="hadMinimumBaki"
                  label="Had Minimum Baki (RM)"
                  placeholder="Masukkan had minimum baki"
                  validation="required|min:0"
                  :validation-messages="{
                    required: 'Had minimum baki adalah wajib',
                    min: 'Had minimum baki mesti lebih besar daripada 0',
                  }"
                  step="0.01"
                  min="0"
                />

                <!-- Kaedah Pemindahan -->
                <FormKit
                  type="select"
                  name="kaedahPemindahan"
                  label="Kaedah Pemindahan"
                  placeholder="Pilih kaedah pemindahan"
                  validation="required"
                  :validation-messages="{
                    required: 'Kaedah pemindahan adalah wajib',
                  }"
                  :options="[
                    { label: 'Tunai', value: 'Tunai' },
                    { label: 'eWallet', value: 'eWallet' },
                  ]"
                />

                <!-- Lokasi -->
                <FormKit
                  type="text"
                  name="lokasi"
                  label="Lokasi"
                  placeholder="Masukkan lokasi tabung"
                  validation="required"
                  :validation-messages="{
                    required: 'Lokasi adalah wajib',
                  }"
                />
              </div>

              <div class="flex justify-end gap-4 mt-6">
                <rs-button variant="secondary" @click="handleCancel">
                  Batal
                </rs-button>
                <rs-button type="submit" variant="primary" :loading="isSubmitting">
                  Simpan & Sahkan
                </rs-button>
              </div>
            </FormKit>
          </div>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

definePageMeta({
  title: "Borang Pendaftaran Tabung Baharu",
  description: "Pentadbir sistem lengkapkan pendaftaran tabung",
});

const route = useRoute();
const isSubmitting = ref(false);

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
    name: "Daftar Tabung",
    type: "link",
    path: "/BF-TNI/peti-besi/konfigurasi/daftar",
  },
  {
    name: "Borang Pendaftaran",
    type: "current",
    path: `/BF-TNI/peti-besi/konfigurasi/daftar/borang/${route.params.id}`,
  },
]);

// Mock application data
const applicationData = ref({
  id: "TB-2024-003",
  namaTabung: "Tabung Amil Daerah",
  pemohon: "Ahmad bin Abdullah",
  status: "Disokong KJ",
});

const formData = ref({
  namaAkaun: "",
  jenisAkaun: "",
  nilaiAsas: "",
  hadMinimumBaki: "",
  kaedahPemindahan: "",
  lokasi: "",
});

onMounted(async () => {
  try {
    // Load application data based on ID
    console.log("TNI-KO-PB-03_2: Borang Pendaftaran Tabung Baharu - Memuatkan data untuk ID:", route.params.id);
    
    // Pre-populate form with application data
    formData.value.namaAkaun = applicationData.value.namaTabung;
  } catch (error) {
    console.error("Error loading application data:", error);
  }
});

const handleSubmit = async (formData) => {
  try {
    isSubmitting.value = true;
    
    // Set status to "Didaftarkan"
    console.log("TNI-KO-PB-03_2: Borang Pendaftaran Tabung Baharu - Status diset kepada 'Didaftarkan'");
    console.log("Data pendaftaran:", formData);
    
    // Show success message
    alert("Tabung berjaya didaftarkan");
    
    // Navigate back to list
    navigateTo("/BF-TNI/peti-besi/konfigurasi/daftar");
  } catch (error) {
    console.error("Error registering tabung:", error);
    alert("Ralat semasa mendaftarkan tabung");
  } finally {
    isSubmitting.value = false;
  }
};

const handleCancel = () => {
  navigateTo("/BF-TNI/peti-besi/konfigurasi/daftar");
};
</script>

<style lang="scss" scoped>
// Add any custom styles here if needed
</style> 