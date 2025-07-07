<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <FormKit type="form" @submit="updateStatus" class="mt-4" :actions="false">
      <div class="bg-white rounded-lg shadow-sm overflow-hidden">
        <!-- Header -->
        <div
          class="flex justify-between items-center px-4 py-3 border-b border-gray-200"
        >
          <h2 class="text-xl font-semibold">
            Kemaskini Status Household / Individu
          </h2>
        </div>

        <!-- Body -->
        <div class="p-4">
          <div v-if="isLoading" class="flex justify-center items-center py-12">
            <div
              class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
            ></div>
            <span class="ml-3">Memuat data...</span>
          </div>

          <div v-else class="space-y-6">
            <!-- Basic Information Section -->
            <div class="bg-gray-50 p-4 rounded-lg">
              <h3 class="text-lg font-medium mb-4">Maklumat Asas</h3>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Status Asnaf -->
                <FormKit
                  type="select"
                  name="statusAsnaf"
                  label="Status Asnaf"
                  v-model="statusData.statusAsnaf"
                  placeholder="Contoh: Fakir, Miskin, dll."
                  validation="required"
                  validation-visibility="blur"
                  :validation-messages="{
                    required: 'Status Asnaf tidak boleh kosong',
                  }"
                  :options="asnafOptions"
                />

                <!-- Kategori Selection -->
                <FormKit
                  type="select"
                  name="kategori"
                  label="Kategori"
                  v-model="statusData.kategori"
                  :options="kategoriOptions"
                  validation="required"
                  validation-visibility="blur"
                  :validation-messages="{
                    required: 'Sila pilih kategori',
                  }"
                />
              </div>
            </div>

            <!-- Description Section -->
            <div class="bg-gray-50 p-4 rounded-lg">
              <h3 class="text-lg font-medium mb-4">Penerangan</h3>

              <FormKit
                type="textarea"
                name="keterangan"
                label="Keterangan"
                v-model="statusData.keterangan"
                placeholder="Masukkan penerangan tentang status asnaf ini..."
                rows="4"
              />
            </div>

            <!-- Status & Settings Section -->
            <div class="bg-gray-50 p-4 rounded-lg">
              <h3 class="text-lg font-medium mb-4">Status & Tetapan</h3>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Status Aktif -->
                <FormKit
                  type="select"
                  name="statusAktif"
                  label="Status Aktif"
                  v-model="statusData.statusAktif"
                  :options="statusOptions"
                  validation="required"
                  validation-visibility="blur"
                  :validation-messages="{
                    required: 'Sila pilih status',
                  }"
                />
              </div>
            </div>

            <!-- Form Actions -->
            <div class="flex justify-end space-x-3 pt-4">
              <rs-button
                variant="primary-outline"
                @click="navigateTo('/BF-PRF/KF/SHI/admin')"
                outer-class="m-0"
              >
                Batal
              </rs-button>
              <rs-button
                type="submit"
                :disabled="isSubmitting"
                :actions="false"
                @click="updateStatus"
              >
                <span v-if="isSubmitting" class="flex items-center">
                  <div
                    class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"
                  ></div>
                  Menyimpan...
                </span>
                <span v-else>Hantar Untuk Kelulusan</span>
              </rs-button>
            </div>
          </div>
        </div>
      </div>
    </FormKit>

    <rs-card class="mt-6">
      <template #header>
        <div>
          <h3 class="text-lg font-medium mb-4">Sejarah Kemaskini</h3>
        </div>
      </template>
      <template #body>
        <!-- History & Audit Section -->
        <div class="">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Tarikh
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Pengguna
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Tindakan
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Butiran
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="(item, index) in auditHistory" :key="index">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ formatDate(item.tarikh) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ item.pengguna }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ item.tindakan }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ item.butiran }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useToast } from "vue-toastification";

definePageMeta({
  title: "Kemaskini Status Household / Individu",
});

const route = useRoute();
const toast = useToast();
const statusId = ref(null);
const isLoading = ref(true);
const isSubmitting = ref(false);

const breadcrumb = ref([
  {
    name: "Profiling",
    type: "link",
    path: "/BF-PRF/KF/SHI/admin",
  },
  {
    name: "Konfigurasi Status Household / Individu",
    type: "link",
    path: "/BF-PRF/KF/SHI/admin",
  },
  {
    name: "Kemaskini",
    type: "current",
    path: "/BF-PRF/KF/SHI/admin/kemaskini",
  },
]);

// Form data
const statusData = reactive({
  statusAsnaf: "",
  kategori: "",
  keterangan: "",
  statusAktif: "",
  keutamaan: 1,
  tarikhCipta: "",
  pengguna: "",
});

// Audit history data
const auditHistory = ref([
  {
    tarikh: "2025-04-15T10:30:00",
    pengguna: "admin.zakat",
    tindakan: "Kemaskini",
    butiran: "Mengubah status dari Tidak Aktif ke Aktif",
  },
  {
    tarikh: "2025-03-22T14:15:00",
    pengguna: "supervisor.zakat",
    tindakan: "Kemaskini",
    butiran: "Mengubah keterangan",
  },
  {
    tarikh: "2025-02-10T09:00:00",
    pengguna: "admin.zakat",
    tindakan: "Tambah",
    butiran: "Status baharu ditambah ke sistem",
  },
]);

// Options for select inputs
const asnafOptions = [
  { label: "Fakir", value: "fakir" }, // Extremely poor with no means
  { label: "Miskin", value: "miskin" }, // Poor with some means but insufficient
  { label: "Amil", value: "amil" }, // Zakat administrators/collectors
  { label: "Mu'allaf", value: "muallaf" }, // Those whose hearts are to be reconciled
  { label: "Riqab", value: "riqab" }, // Slaves seeking freedom
  { label: "Gharimin", value: "gharimin" }, // Debtors in genuine difficulty
  { label: "Fisabilillah", value: "fisabilillah" }, // Those fighting in Allah's cause
  { label: "Ibn Sabil", value: "ibnsabil" }, // Stranded travelers in need
];

const kategoriOptions = [
  { label: "Household", value: "Household" },
  { label: "Individu", value: "Individu" },
];

const statusOptions = [
  { label: "Aktif", value: "Aktif" },
  { label: "Tidak Aktif", value: "Tidak Aktif" },
];

// Load data
onMounted(async () => {
  try {
    statusId.value = route.params.id;

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock data for demonstration purposes
    const mockData = {
      id: statusId.value,
      statusAsnaf: "Fakir",
      kategori: "Household",
      keterangan:
        "Orang yang tidak mempunyai harta dan tiada mata pencarian yang boleh memenuhi keperluan asas diri dan tanggungannya.",
      statusAktif: "Aktif",
      keutamaan: 1,
      tarikhCipta: "10/02/2025",
      pengguna: "admin.zakat",
    };

    // Populate form data
    Object.assign(statusData, mockData);
  } catch (error) {
    toast.error("Ralat memuat data. Sila cuba lagi.");
    console.error(error);
  } finally {
    isLoading.value = false;
  }
});

// Form submission
const updateStatus = async () => {
  try {
    isSubmitting.value = true;

    // Simulate API call with timeout
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Update audit history
    const newAuditEntry = {
      tarikh: new Date().toISOString(),
      pengguna: "current.user",
      tindakan: "Kemaskini",
      butiran: "Kemaskini maklumat status",
    };

    auditHistory.value.unshift(newAuditEntry);

    // Success handling
    toast.success("Status berjaya dihantar untuk kelulusan");
  } catch (error) {
    // Error handling
    toast.error("Ralat semasa mengemaskini status. Sila cuba lagi.");
    console.error(error);
  } finally {
    isSubmitting.value = false;
  }
};

// Helper function to format dates
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("ms-MY", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
</script> 