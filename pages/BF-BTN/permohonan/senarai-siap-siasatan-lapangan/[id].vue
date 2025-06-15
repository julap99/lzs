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
              Semakan & Siasatan Permohonan
            </h1>
            <p class="mt-1 text-sm text-gray-600">
              Semak maklumat permohonan dan input dapatan siasatan
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

      <div class="space-y-6">
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

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Left Column -->
          <div class="space-y-6">
            <!-- Section 2: Senarai Bantuan Dipohon -->
            <rs-card class="shadow-sm border-0 bg-white">
              <template #header>
                <div class="flex items-center justify-between">
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
                        Senarai Bantuan Dipohon
                      </h2>
                      <p class="text-sm text-gray-500">
                        Bantuan yang dipohon dalam permohonan ini
                      </p>
                    </div>
                  </div>
                  <rs-button
                    variant="primary"
                    size="sm"
                    @click="addNewAssistance"
                    class="!px-3 !py-2"
                  >
                    <Icon name="ph:plus" class="w-4 h-4 mr-1" />
                    Tambah Bantuan
                  </rs-button>
                </div>
              </template>

              <template #body>
                <div class="overflow-x-auto">
                  <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                      <tr>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nama Bantuan
                        </th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Kadar (RM)
                        </th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status Dokumen
                        </th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status Proses
                        </th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Layak
                        </th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                        <td class="px-4 py-4">
                          <div class="text-sm font-medium text-gray-900">
                            {{ assistance.code }} - {{ assistance.name }}
                          </div>
                          <div class="text-sm text-gray-500">
                            ({{ assistance.category }})
                          </div>
                        </td>
                        <td class="px-4 py-4 whitespace-nowrap">
                          <div class="text-sm font-medium text-gray-900">
                            {{ assistance.amount.toLocaleString() }}
                          </div>
                        </td>
                        <td class="px-4 py-4 whitespace-nowrap">
                          <rs-badge
                            :variant="getDocumentStatusVariant(assistance.documentStatus)"
                            class="text-xs"
                          >
                            {{ assistance.documentStatus }}
                          </rs-badge>
                        </td>
                        <td class="px-4 py-4 whitespace-nowrap">
                          <div class="text-sm text-gray-900">
                            {{ assistance.processStatus }}
                          </div>
                        </td>
                        <td class="px-4 py-4 whitespace-nowrap">
                          <rs-badge
                            :variant="assistance.eligible ? 'success' : 'danger'"
                            class="text-xs"
                          >
                            {{ assistance.eligible ? '✅ Ya' : '❌ Tidak' }}
                          </rs-badge>
                        </td>
                        <td class="px-4 py-4 whitespace-nowrap">
                          <div class="flex space-x-2">
                            <rs-button
                              variant="primary-outline"
                              size="sm"
                              @click="editAssistance(assistance)"
                              class="!px-2 !py-1"
                            >
                              <Icon name="ph:pencil" class="w-3 h-3" />
                            </rs-button>
                            <rs-button
                              variant="danger-outline"
                              size="sm"
                              @click="deleteAssistance(assistance, index)"
                              class="!px-2 !py-1"
                            >
                              <Icon name="ph:trash" class="w-3 h-3" />
                            </rs-button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </template>
            </rs-card>

            <!-- Section 3: Bantuan Aktif (Telah Diluluskan) -->
            <rs-card class="shadow-sm border-0 bg-white">
              <template #header>
                <div class="flex items-center space-x-3">
                  <div class="flex-shrink-0">
                    <div
                      class="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center"
                    >
                      <Icon name="ph:check-circle" class="w-6 h-6 text-emerald-600" />
                    </div>
                  </div>
                  <div>
                    <h2 class="text-lg font-semibold text-gray-900">
                      Bantuan Aktif (Telah Diluluskan)
                    </h2>
                    <p class="text-sm text-gray-500">
                      Bantuan yang sedang aktif untuk pemohon ini
                    </p>
                  </div>
                </div>
              </template>

              <template #body>
                <div class="overflow-x-auto">
                  <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                      <tr>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nama Bantuan
                        </th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Kadar (RM)
                        </th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Frekuensi (Bulan)
                        </th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                      <tr
                        v-for="(activeAssistance, index) in activeAssistanceList"
                        :key="index"
                        class="hover:bg-gray-50"
                      >
                        <td class="px-4 py-4">
                          <div class="text-sm font-medium text-gray-900">
                            {{ activeAssistance.code }} - {{ activeAssistance.name }}
                          </div>
                          <div class="text-sm text-gray-500">
                            ({{ activeAssistance.category }})
                          </div>
                        </td>
                        <td class="px-4 py-4 whitespace-nowrap">
                          <div class="text-sm font-medium text-gray-900">
                            {{ activeAssistance.amount.toLocaleString() }}
                          </div>
                        </td>
                        <td class="px-4 py-4 whitespace-nowrap">
                          <div class="text-sm text-gray-900">
                            {{ activeAssistance.frequency }}
                          </div>
                        </td>
                        <td class="px-4 py-4 whitespace-nowrap">
                          <rs-badge
                            variant="success"
                            class="text-xs"
                          >
                            ✅ {{ activeAssistance.status }}
                          </rs-badge>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </template>
            </rs-card>
          </div>

          <!-- Right Column -->
          <div class="space-y-6">
            <!-- Section 4: Input Dapatan Siasatan -->
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
                      Input Dapatan Siasatan
                    </h2>
                    <p class="text-sm text-gray-500">Maklumat lawatan dan siasatan</p>
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
                    <!-- Ringkasan Profil (Read-only) -->
                    <div class="space-y-2">
                      <label class="text-sm font-medium text-gray-700">
                        Ringkasan Profil
                      </label>
                      <div class="p-3 bg-gray-50 rounded-lg border">
                        <div class="text-sm text-gray-900 space-y-1">
                          <div>• {{ formData.ringkasanProfil.status }}</div>
                          <div>• {{ formData.ringkasanProfil.tanggungan }}</div>
                          <div>• {{ formData.ringkasanProfil.rumah }}</div>
                          <div>• {{ formData.ringkasanProfil.pekerjaan }}</div>
                          <div>• {{ formData.ringkasanProfil.khasus }}</div>
                        </div>
                      </div>
                    </div>

                    <!-- Tarikh & Masa Lawatan -->
                    <div class="grid grid-cols-2 gap-4">
                      <FormKit
                        type="date"
                        name="tarikhLawatan"
                        label="Tarikh Lawatan"
                        v-model="formData.tarikhLawatan"
                        validation="required"
                      />
                      <FormKit
                        type="time"
                        name="masaLawatan"
                        label="Masa Lawatan"
                        v-model="formData.masaLawatan"
                        validation="required"
                      />
                    </div>

                    <!-- Gambar Lokasi / Bukti Visual -->
                    <FormKit
                      type="file"
                      name="gambarLokasi"
                      label="Gambar Lokasi / Bukti Visual"
                      accept="image/*"
                      multiple
                      v-model="formData.gambarLokasi"
                      help="Boleh upload beberapa gambar sekaligus"
                    />

                    <!-- Catatan Lawatan EOAD -->
                    <FormKit
                      type="textarea"
                      name="catatanLawatan"
                      label="Catatan Lawatan EOAD"
                      placeholder="Masukkan catatan lawatan..."
                      rows="4"
                      v-model="formData.catatanLawatan"
                      validation="required"
                    />

                    <!-- Status Siasatan -->
                    <FormKit
                      type="select"
                      name="statusSiasatan"
                      label="Status Siasatan"
                      :options="statusSiasatanOptions"
                      placeholder="Pilih status siasatan"
                      v-model="formData.statusSiasatan"
                      validation="required"
                    />

                    <!-- Section 5: Action Buttons -->
                    <div class="space-y-3 pt-4 border-t">
                      <rs-button
                        variant="primary"
                        @click="handleSimpan"
                        :disabled="processing"
                        :loading="processing"
                        class="w-full !py-3 text-sm font-medium"
                      >
                        <Icon name="ph:floppy-disk" class="w-5 h-5 mr-2" />
                        Simpan
                      </rs-button>

                      <rs-button
                        variant="success"
                        @click="handleHantarKelulusan"
                        :disabled="processing || !canSubmitForApproval"
                        class="w-full !py-3 text-sm font-medium"
                      >
                        <Icon name="ph:paper-plane-tilt" class="w-5 h-5 mr-2" />
                        Hantar Kelulusan
                      </rs-button>

                      <rs-button
                        variant="primary-outline"
                        @click="handleCancel"
                        class="w-full !py-3 text-sm font-medium"
                      >
                        <Icon name="ph:arrow-left" class="w-5 h-5 mr-2" />
                        Batal / Kembali
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
  title: "Semakan & Siasatan Permohonan",
});

const breadcrumb = ref([
  {
    name: "Permohonan Bantuan",
    type: "link",
    path: "/BF-BTN/permohonan/senarai",
  },
  {
    name: "Siap Siasatan Lapangan",
    type: "link",
    path: "/BF-BTN/permohonan/senarai-siap-siasatan-lapangan",
  },
  {
    name: "Semakan & Siasatan",
    type: "current",
    path: `/BF-BTN/permohonan/senarai-siap-siasatan-lapangan/${route.params.id}`,
  },
]);

// Form data
const formData = ref({
  idPermohonan: "",
  namaPemohon: "",
  noIc: "",
  tarikhPermohonan: "",
  statusPermohonan: "",
  ringkasanProfil: {
    status: "Pemohon seorang bapa tunggal",
    tanggungan: "4 tanggungan",
    rumah: "Menyewa rumah",
    pekerjaan: "Tukang sapu sekolah",
    khasus: "Anak OKU"
  },
  tarikhLawatan: "",
  masaLawatan: "",
  gambarLokasi: [],
  catatanLawatan: "",
  statusSiasatan: "",
});

// Assistance list data (Section 2)
const assistanceList = ref([
  {
    code: "B112",
    name: "Bantuan Sewaan/Ansuran Rumah",
    category: "Miskin",
    amount: 800,
    documentStatus: "Lengkap",
    processStatus: "Dalam Proses",
    eligible: true,
  },
  {
    code: "B104",
    name: "Bantuan Tunggakan Pembiayaan Rumah",
    category: "Miskin",
    amount: 1000,
    documentStatus: "Lengkap",
    processStatus: "Dalam Proses ke Kelulusan Khas",
    eligible: false,
  },
]);

// Active assistance list data (Section 3)
const activeAssistanceList = ref([
  {
    code: "B104",
    name: "Bantuan Kewangan Bulanan",
    category: "Miskin",
    amount: 800,
    frequency: 6,
    status: "Lulus",
  },
  {
    code: "B104",
    name: "Bantuan Makanan Bulanan",
    category: "Miskin",
    amount: 1000,
    frequency: 6,
    status: "Lulus",
  },
]);

// Dropdown options
const statusSiasatanOptions = ref([
  { 
    label: "Selesai Siasatan Lapangan", 
    value: "selesai_siasatan_lapangan",
    description: "Proceed ke BDS-07"
  },
  { 
    label: "Lawatan Tidak Selesai", 
    value: "lawatan_tidak_selesai",
    description: "Kekal dalam status 'Siap Untuk Siasatan Lapangan'"
  },
]);

// Computed properties
const canSubmitForApproval = computed(() => {
  return formData.value.statusSiasatan === 'selesai_siasatan_lapangan' &&
         formData.value.tarikhLawatan &&
         formData.value.masaLawatan &&
         formData.value.catatanLawatan;
});

// Methods
const getStatusVariant = (status) => {
  const variants = {
    baru: "info",
    dalam_semakan: "warning",
    tidak_lengkap: "danger",
    lengkap: "success",
    selesai_lawatan: "info",
    disokong: "success",
  };
  return variants[status?.toLowerCase()] || "default";
};

const getStatusText = (status) => {
  const statusMap = {
    baru: "Baru",
    dalam_semakan: "Dalam Semakan",
    tidak_lengkap: "Tidak Lengkap",
    lengkap: "Lengkap",
    selesai_lawatan: "Selesai Lawatan",
    disokong: "Disokong",
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

const addNewAssistance = () => {
  // Navigate to add new assistance page
  console.log("Adding new assistance");
  // Example: router.push(`/BF-BTN/bantuan/add?permohonan=${route.params.id}`);
};

const editAssistance = (assistance) => {
  // Navigate to edit assistance page
  console.log("Editing assistance:", assistance);
  // Example: router.push(`/BF-BTN/bantuan/edit/${assistance.code}?permohonan=${route.params.id}`);
};

const deleteAssistance = (assistance, index) => {
  // Confirm and delete assistance
  if (confirm(`Adakah anda pasti untuk memadamkan bantuan ${assistance.name}?`)) {
    assistanceList.value.splice(index, 1);
    toast.success("Bantuan telah dipadamkan");
  }
};

const handleSimpan = async () => {
  try {
    processing.value = true;
    // Implement API call to save the updates
    // Update status to "Selesai Lawatan"
    toast.success("Dapatan siasatan telah disimpan");
  } catch (error) {
    toast.error("Ralat semasa menyimpan dapatan siasatan");
    console.error(error);
  } finally {
    processing.value = false;
  }
};

const handleHantarKelulusan = async () => {
  if (!canSubmitForApproval.value) {
    toast.error("Sila lengkapkan semua maklumat yang diperlukan");
    return;
  }

  try {
    processing.value = true;
    // Implement API call to submit for approval
    // Update status to "Disokong"
    toast.success("Permohonan telah dihantar untuk kelulusan");
    // Redirect to appropriate page
    router.push("/BF-BTN/permohonan/senarai-siap-siasatan-lapangan");
  } catch (error) {
    toast.error("Ralat semasa menghantar untuk kelulusan");
    console.error(error);
  } finally {
    processing.value = false;
  }
};

const handleCancel = () => {
  router.push("/BF-BTN/permohonan/senarai-siap-siasatan-lapangan");
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
