<template>
  <div class="min-h-screen">
    <div class="">
      <LayoutsBreadcrumb :items="breadcrumb" />

      <!-- Page Header -->
      <div class="mt-6 mb-8">
        <div
          class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 class="text-2xl font-bold text-gray-900">
              Semakan & Kemaskini Permohonan
            </h1>
            <p class="mt-1 text-sm text-gray-600">
              Semak maklumat permohonan dan kemaskini penilaian awal
            </p>
          </div>
          <rs-badge
            v-if="formData.statusPermohonan"
            :variant="getStatusVariant(formData.statusPermohonan)"
            class="text-sm px-4 py-2"
          >
            {{ getStatusText(formData.statusPermohonan) }}
          </rs-badge>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Section 1: Maklumat Permohonan (Read-only) -->
          <rs-card class="shadow-sm border-0 bg-white">
            <template #header>
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div
                    class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"
                  >
                    <Icon name="ph:user-circle" class="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-gray-900">
                    Maklumat Permohonan
                  </h2>
                  <p class="text-sm text-gray-500">
                    Butiran pemohon dan status permohonan
                  </p>
                </div>
              </div>
            </template>

            <template #body>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-1">
                  <label class="text-sm font-medium text-gray-700"
                    >ID Permohonan</label
                  >
                  <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                    <span class="text-sm font-mono text-gray-900">{{
                      formData.idPermohonan
                    }}</span>
                  </div>
                </div>

                <div class="space-y-1">
                  <label class="text-sm font-medium text-gray-700"
                    >Nama Pemohon</label
                  >
                  <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                    <span class="text-sm text-gray-900">{{
                      formData.namaPemohon
                    }}</span>
                  </div>
                </div>

                <div class="space-y-1">
                  <label class="text-sm font-medium text-gray-700"
                    >No IC</label
                  >
                  <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                    <span class="text-sm font-mono text-gray-900">{{
                      formData.noIc
                    }}</span>
                  </div>
                </div>

                <div class="space-y-1">
                  <label class="text-sm font-medium text-gray-700"
                    >Tarikh Permohonan</label
                  >
                  <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                    <span class="text-sm text-gray-900">{{
                      formData.tarikhPermohonan
                    }}</span>
                  </div>
                </div>

                <div class="space-y-1 md:col-span-2">
                  <label class="text-sm font-medium text-gray-700"
                    >Status Permohonan</label
                  >
                  <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                    <rs-badge
                      :variant="getStatusVariant(formData.statusPermohonan)"
                      class="text-sm"
                    >
                      {{ getStatusText(formData.statusPermohonan) }}
                    </rs-badge>
                  </div>
                </div>
              </div>
            </template>
          </rs-card>

          <!-- Section 2: Bantuan Berkaitan -->
          <rs-card class="shadow-sm border-0 bg-white">
            <template #header>
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div
                    class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center"
                  >
                    <Icon name="ph:money" class="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-gray-900">
                    Bantuan Berkaitan
                  </h2>
                  <p class="text-sm text-gray-500">
                    Senarai bantuan yang berkaitan dengan permohonan ini
                  </p>
                </div>
              </div>
            </template>

            <template #body>
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nama Bantuan
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Kadar (RM)
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status Dokumen
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr
                      v-for="(assistance, index) in assistanceList"
                      :key="index"
                      class="hover:bg-gray-50"
                    >
                      <td class="px-6 py-4">
                        <div class="text-sm font-medium text-gray-900">
                          {{ assistance.code }} - {{ assistance.name }}
                        </div>
                        <div class="text-sm text-gray-500">
                          {{ assistance.category }}
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm font-medium text-gray-900">
                          RM {{ assistance.amount.toLocaleString() }}
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <rs-badge
                          :variant="getDocumentStatusVariant(assistance.documentStatus)"
                          class="text-xs" 
                        >
                          {{ assistance.documentStatus }}
                        </rs-badge>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <rs-button
                          variant="primary-outline"
                          size="sm"
                          @click="editAssistance(assistance)"
                          class="!px-3 !py-1.5"
                        >
                          <Icon name="ph:pencil" class="w-4 h-4 mr-1" />
                          Edit
                        </rs-button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </template>
          </rs-card>
        </div>

        <!-- Sidebar - Section 3: Kemaskini Permohonan -->
        <div class="lg:col-span-1 space-y-6">
          <rs-card class="shadow-sm border-0 bg-white sticky top-6">
            <template #header>
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div
                    class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center"
                  >
                    <Icon
                      name="ph:clipboard-text"
                      class="w-6 h-6 text-purple-600"
                    />
                  </div>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-gray-900">
                    Kemaskini Permohonan
                  </h2>
                  <p class="text-sm text-gray-500">Penilaian dan tindakan</p>
                </div>
              </div>
            </template>

            <template #body>
              <FormKit
                type="form"
                :actions="false"
                @submit="handleSubmit"
                v-model="formData"
              >
                <div class="space-y-6">
                  <!-- Catatan Penilaian Awal -->
                  <FormKit
                    type="textarea"
                    name="catatanPenilaianAwal"
                    label="Catatan Penilaian Awal"
                    placeholder="Masukkan catatan penilaian awal..."
                    rows="4"
                    v-model="formData.catatanPenilaianAwal"
                    help="Catatan ini adalah pilihan"
                  />

                  <!-- Kaedah Siasatan -->
                  <FormKit
                    type="select"
                    name="kaedahSiasatan"
                    label="Kaedah Siasatan"
                    :options="kaedahSiasatanOptions"
                    placeholder="Pilih kaedah siasatan"
                    v-model="formData.kaedahSiasatan"
                    validation="required"
                  />

                  <!-- Tarikh Lawatan -->
                  <FormKit
                    type="date"
                    name="tarikhLawatan"
                    label="Tarikh Lawatan"
                    v-model="formData.tarikhLawatan"
                    validation="date_after:today"
                    :validation-messages="{
                      date_after: 'Tarikh lawatan mesti selepas hari ini'
                    }"
                  />

                  <!-- Masa Lawatan -->
                  <FormKit
                    type="select"
                    name="masaLawatan"
                    label="Masa Lawatan"
                    :options="masaLawatanOptions"
                    placeholder="Pilih masa lawatan"
                    v-model="formData.masaLawatan"
                  />

                  <!-- Status Pengesahan Lawatan -->
                  <FormKit
                    type="select"
                    name="statusPengesahanLawatan"
                    label="Status Pengesahan Lawatan"
                    :options="statusPengesahanOptions"
                    placeholder="Pilih status pengesahan"
                    v-model="formData.statusPengesahanLawatan"
                    validation="required"
                  />

                  <!-- Action Buttons -->
                  <div class="space-y-3 pt-4 border-t">
                    <rs-button
                      variant="primary"
                      @click="handleSave"
                      :disabled="processing"
                      :loading="processing"
                      class="w-full !py-3 text-sm font-medium"
                    >
                      <Icon name="ph:floppy-disk" class="w-5 h-5 mr-2" />
                      Simpan Kemaskini
                    </rs-button>

                    <rs-button
                      variant="primary-outline"
                      @click="handleCancel"
                      class="w-full !py-3 text-sm font-medium"
                    >
                      <Icon name="ph:arrow-left" class="w-5 h-5 mr-2" />
                      Kembali ke Senarai
                    </rs-button>
                  </div>
                </div>
              </FormKit>
            </template>
          </rs-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";

const route = useRoute();
const router = useRouter();
const toast = useToast();
const processing = ref(false);

definePageMeta({
  title: "Semakan & Kemaskini Permohonan",
});

const breadcrumb = ref([
  {
    name: "Permohonan Bantuan",
    type: "link",
    path: "/BF-BTN/permohonan/senarai",
  },
  {
    name: "Untuk Siasatan",
    type: "link",
    path: "/BF-BTN/permohonan/senarai-untuk-siasatan",
  },
  {
    name: "Semakan & Kemaskini",
    type: "current",
    path: `/BF-BTN/permohonan/senarai-untuk-siasatan/${route.params.id}`,
  },
]);

// Form data
const formData = ref({
  idPermohonan: "",
  namaPemohon: "",
  noIc: "",
  tarikhPermohonan: "",
  statusPermohonan: "",
  catatanPenilaianAwal: "",
  kaedahSiasatan: "",
  tarikhLawatan: "",
  masaLawatan: "",
  statusPengesahanLawatan: "",
});

// Assistance list data
const assistanceList = ref([
  {
    code: "B112",
    name: "Bantuan Sewaan/Ansuran Rumah",
    category: "Miskin",
    amount: 800,
    documentStatus: "Lengkap",
  },
  {
    code: "B104",
    name: "Bantuan Tunggakan Pembiayaan Rumah",
    category: "Miskin",
    amount: 1000,
    documentStatus: "Lengkap",
  },
]);

// Dropdown options
const kaedahSiasatanOptions = ref([
  { label: "Telefon", value: "telefon" },
  { label: "Semak Dokumen Sahaja", value: "dokumen" },
  { label: "Lapangan", value: "lapangan" },
]);

const statusPengesahanOptions = ref([
  { label: "Sah", value: "sah" },
  { label: "Belum Sah", value: "belum_sah" },
]);

// Generate time options (9:00 - 18:00, every 30 minutes)
const masaLawatanOptions = computed(() => {
  const times = [];
  for (let hour = 9; hour <= 18; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      if (hour === 18 && minute > 0) break; // Stop at 18:00
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      times.push({
        label: timeString,
        value: timeString,
      });
    }
  }
  return times;
});

// Methods
const getStatusVariant = (status) => {
  const variants = {
    baru: "info",
    dalam_semakan: "warning",
    tidak_lengkap: "danger",
    lengkap: "success",
  };
  return variants[status?.toLowerCase()] || "default";
};

const getStatusText = (status) => {
  const statusMap = {
    baru: "Baru",
    dalam_semakan: "Untuk Siasatan",
    tidak_lengkap: "Tidak Lengkap",
    lengkap: "Lengkap",
  };
  return statusMap[status?.toLowerCase()] || status;
};

const getDocumentStatusVariant = (status) => {
  const variants = {
    lengkap: "success",
    tidak_lengkap: "danger",
    dalam_semakan: "warning",
  };
  return variants[status?.toLowerCase()] || "default";
};

const editAssistance = (assistance) => {
  // Implement navigation to edit assistance page
  console.log("Editing assistance:", assistance);
  router.push(`/BF-BTN/permohonan/senarai-untuk-disemak/${route.params.id}/bantuan/${assistance}`);
};

const handleSave = async () => {
  try {
    processing.value = true;
    // Implement API call to save the updates
    toast.success("Kemaskini telah disimpan");
  } catch (error) {
    toast.error("Ralat semasa menyimpan kemaskini");
    console.error(error);
  } finally {
    processing.value = false;
  }
};

const handleCancel = () => {
  router.push("/BF-BTN/permohonan/senarai-untuk-siasatan");
};

// Fetch application data on mount
onMounted(async () => {
  try {
    // Implement API call to fetch application data
    // This is mock data for now
    formData.value = {
      ...formData.value,
      idPermohonan: route.params.id,
      namaPemohon: "Ahmad bin Abdullah",
      noIc: "880101-12-1234",
      tarikhPermohonan: "15 Nov 2024",
      statusPermohonan: "dalam_semakan",
    };
  } catch (error) {
    toast.error("Ralat semasa memuatkan data permohonan");
    console.error(error);
  }
});
</script>

<style lang="scss" scoped>
// Custom animations and transitions
.group:hover .group-hover\:text-blue-600 {
  transition: color 0.2s ease-in-out;
}

// Enhanced focus states
.focus\:ring-2:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}

// Table row hover effect
.hover\:bg-gray-50:hover {
  background-color: #f9fafb;
}
</style>
