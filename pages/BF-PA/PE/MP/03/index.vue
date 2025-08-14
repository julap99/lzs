<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Senarai Kehadiran Penolong Amil </h2>
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
          <!-- 🔹 Maklumat Aktiviti -->
          <div class="space-y-4 mt-4">
            <h3 class="text-lg font-medium">Maklumat Aktiviti</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit type="text" name="idAktiviti" label="ID Aktiviti" :value="formData.idAktiviti" disabled />
              <FormKit type="text" name="namaAktiviti" label="Nama Aktiviti" :value="formData.namaAktiviti" disabled />
              <FormKit type="text" name="tarikhAktiviti" label="Tarikh Aktiviti" :value="formData.tarikhAktiviti" disabled />
              <FormKit type="text" name="jenisAktiviti" label="Jenis Aktiviti" :value="formData.jenisAktiviti" disabled />
            </div>
          </div>

          <!-- 🔹 Maklumat Kehadiran -->
          <div class="space-y-6 mt-8">
            <h3 class="text-lg font-medium">Maklumat Kehadiran</h3>

            <!-- Filter Buttons -->
            <div class="flex space-x-4 mt-2">
              <rs-button :variant="selectedFilter === 'Semua' ? 'primary' : 'primary-outline'" @click="filterStatus('Semua')">Semua</rs-button>
              <rs-button :variant="selectedFilter === 'Hadir' ? 'primary' : 'primary-outline'" @click="filterStatus('Hadir')">Hadir</rs-button>
              <rs-button :variant="selectedFilter === 'Tidak Hadir' ? 'primary' : 'primary-outline'" @click="filterStatus('Tidak Hadir')">Tidak Hadir</rs-button>
            </div>

            <!-- Kehadiran Table -->
            <rs-table
              class="mt-4"
              :data="filteredKehadiran"
              :pageSize="10"
              :showNoColumn="true"
              :columns="[
                { key: 'nama', label: 'Nama' },
                { key: 'noKP', label: 'No Kad Pengenalan' },
                { key: 'status', label: 'Status Kehadiran' }
              ]"
              :options="{ variant: 'default', hover: true }"
            >
              <template v-slot:status="data">
                <rs-badge :variant="data.text === 'Hadir' ? 'success' : 'danger'">
                  {{ data.text }}
                </rs-badge>
              </template>
            </rs-table>
          </div>

          <!-- 🔹 Form Actions -->
          <div class="flex justify-end space-x-4 mt-8">
            <rs-button variant="primary-outline" @click="navigateTo('/BF-PA/PE/MP')">Kembali</rs-button>
            <rs-button variant="primary" @click="handleSubmit">Sahkan</rs-button>
          </div>
        </FormKit>
      </template>
    </rs-card>

    <!-- 🔹 Confirmation Modal -->
    <rs-modal v-model="showSuccessModal" title="Hantar ke Pelulus" size="md" position="center">
      <template #body>
        <div class="text-center">
          <Icon name="material-symbols:help-outline" class="text-blue-500 text-5xl mb-4" />
          <p class="text-lg mb-2">Adakah anda pasti untuk menghantar Kiraan Jumlah Elaun ini kepada Eksekutif?</p>
          <p class="text-gray-600">Semakan ini akan dihantar kepada pelulus untuk kelulusan seterusnya.</p>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-center space-x-4">
          <rs-button variant="primary-outline" @click="showSuccessModal = false">Batal</rs-button>
          <rs-button variant="primary" @click="confirmSubmit">Hantar</rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useToast } from "vue-toastification";
import { useRoute } from "vue-router";

definePageMeta({
  title: "Semakan Bantuan",
  description: "Semak dan ulas permohonan bantuan",
});

const route = useRoute();
const toast = useToast();
const showSuccessModal = ref(false);

const breadcrumb = ref([
  { name: "Pengurusan Penolong Amil", type: "link", path: "/BF-PA/PE/MP" },
  { name: "Semakan dan Sokongan", type: "current", path: "/BF-PA/PE/MP/03" },
]);

const formData = ref({
  idAktiviti: "ACT-789",
  namaAktiviti: "Taklimat Penyelarasan PA Zon Tengah",
  tarikhAktiviti: "2025-08-10",
  jenisAktiviti: "Program",
  status: "Menunggu Semakan",
  kadarElaun: "100.00",
  jumlahElaun: "500.00",
  senaraiPenolong: [
    { id: 1, nama: "Nama Penolong Amil", tarikh: "2025-08-10" },
    { id: 2, nama: "Nama Penolong Amil", tarikh: "2025-08-10" },
  ],
  maklumatKehadiran: [
    { nama: "Ahmad bin Ali", noKP: "900101-10-1010", status: "Hadir" },
    { nama: "Siti Nurhaliza", noKP: "850505-05-5555", status: "Tidak Hadir" },
    { nama: "Ali bin Abu", noKP: "910202-14-2222", status: "Hadir" },
  ],
});

// 🔹 Filter Logic
const selectedFilter = ref("Semua");
const filterStatus = (status) => { selectedFilter.value = status };
const filteredKehadiran = computed(() => {
  if (selectedFilter.value === "Semua") return formData.value.maklumatKehadiran;
  return formData.value.maklumatKehadiran.filter(item => item.status === selectedFilter.value);
});

// 🔹 Badge Variant Mapping
const getStatusVariant = (status) => {
  const variants = {
    "Menunggu Semakan": "warning",
    "Lulus": "success",
    "Tolak": "danger",
    "Kembali untuk Pembetulan": "warning",
    "Dalam Pemerhatian": "warning",
  };
  return variants[status] || "default";
};

// 🔹 Submit Logic
const handleSubmit = async () => {
  showSuccessModal.value = true;
};

const confirmSubmit = async () => {
  try {
    showSuccessModal.value = false;
    toast.success("Semakan telah berjaya dihantar kepada pelulus");
    navigateTo("/BF-PA/PE/MP/04");
  } catch (error) {
    toast.error("Ralat semasa menghantar semakan");
    console.error("Submit error:", error);
  }
};
</script>
