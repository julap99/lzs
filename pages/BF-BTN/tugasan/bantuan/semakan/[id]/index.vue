<template>
  <div class="min-h-screen">
    <div class="  ">
      <LayoutsBreadcrumb :items="breadcrumb" />

      <!-- Page Header -->
      <div class="mt-6 mb-8">
        <div
          class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Semakan Permohonan</h1>
            <p class="mt-1 text-sm text-gray-600">
              Semak dan kemaskini status permohonan bantuan
            </p>
          </div>
          <rs-badge
            :variant="getStatusVariant(permohonanData.status)"
            class="text-sm px-4 py-2"
          >
            {{ permohonanData.status }}
          </rs-badge>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Maklumat Pemohon Card -->
          <rs-card class="shadow-sm border-0 bg-white">
            <template #header>
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div
                    class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"
                  >
                    <Icon name="ph:user" class="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-gray-900">
                    Maklumat Pemohon
                  </h2>
                  <p class="text-sm text-gray-500">
                    Butiran pemohon dari profil
                  </p>
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
                      >Tarikh Permohonan</label
                    >
                    <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                      <span class="text-sm text-gray-900">{{
                        formData.tarikhPermohonan
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
                      >No. Kad Pengenalan / No Syarikat</label
                    >
                    <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                      <span class="text-sm font-mono text-gray-900">{{
                        formData.noKadPengenalan
                      }}</span>
                    </div>
                  </div>

                  <div class="space-y-1 md:col-span-2">
                    <label class="text-sm font-medium text-gray-700"
                      >Alamat</label
                    >
                    <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                      <span class="text-sm text-gray-900">{{
                        formData.alamatPremis
                      }}</span>
                    </div>
                  </div>

                  <div class="space-y-1">
                    <label class="text-sm font-medium text-gray-700"
                      >No. Telefon</label
                    >
                    <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                      <span class="text-sm text-gray-900">{{
                        formData.nomorTelefon
                      }}</span>
                    </div>
                  </div>

                  <div class="space-y-1">
                    <label class="text-sm font-medium text-gray-700"
                      >Emel</label
                    >
                    <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                      <span class="text-sm text-gray-900">{{
                        formData.emel
                      }}</span>
                    </div>
                  </div>

                  <div class="space-y-1">
                    <label class="text-sm font-medium text-gray-700"
                      >Status Household</label
                    >
                    <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                      <span class="text-sm text-gray-900">{{
                        formData.statusHousehold
                      }}</span>
                    </div>
                  </div>

                  <div class="space-y-1">
                    <label class="text-sm font-medium text-gray-700"
                      >Status Individu</label
                    >
                    <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                      <span class="text-sm text-gray-900">{{
                        formData.statusIndividu
                      }}</span>
                    </div>
                  </div>

                  <div class="space-y-1 md:col-span-2">
                    <label class="text-sm font-medium text-gray-700"
                      >Status Multidimensi</label
                    >
                    <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                      <span class="text-sm text-gray-900">{{
                        formData.statusMultidimensi
                      }}</span>
                    </div>
                  </div>
                </div>
              </FormKit>
            </template>
          </rs-card>

          <!-- Senarai Bantuan Card -->
          <rs-card class="shadow-sm border-0 bg-white">
            <template #header>
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div
                    class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center"
                  >
                    <Icon
                      name="ph:list-bullets"
                      class="w-6 h-6 text-purple-600"
                    />
                  </div>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-gray-900">
                    Senarai Bantuan
                  </h2>
                  <p class="text-sm text-gray-500">
                    Bantuan yang dipohon dan status dokumen
                  </p>
                </div>
              </div>
            </template>

            <template #body>
              <div class="overflow-x-auto">
                <table class="w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        No
                      </th>
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        No Bantuan
                      </th>
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Aid
                      </th>
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Aid Product
                      </th>
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Product Package
                      </th>
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Entitlement Product
                      </th>
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Kadar (RM)
                      </th>
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Tarikh Permohonan
                      </th>
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        SLA
                      </th>
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status Dokumen
                      </th>
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Tindakan
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr
                      v-for="(bantuan, index) in formData.senaraiBantuan"
                      :key="bantuan.id"
                      class="hover:bg-gray-50 transition-colors duration-200"
                      :class="getTableRowClass(bantuan.statusDokumen)"
                    >
                      <!-- No -->
                      <td
                        class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                      >
                        {{ index + 1 }}
                      </td>
                      <!-- No Bantuan -->
                      <td
                        class="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900"
                      >
                        {{ bantuan.noBantuan }}
                      </td>
                      <!-- Aid -->
                      <td
                        class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                      >
                        {{ bantuan.aid }}
                      </td>
                      <!-- Aid Product -->
                      <td
                        class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                      >
                        {{ bantuan.aidProduct }}
                      </td>
                      <!-- Product Package -->
                      <td
                        class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                      >
                        {{ bantuan.productPackage }}
                      </td>
                      <!-- Entitlement Product -->
                      <td
                        class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                      >
                        {{ bantuan.entitlementProduct }}
                      </td>
                      <!-- Kadar -->
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm font-semibold text-green-700">
                          {{ bantuan.kadar.toLocaleString() }}
                        </div>
                      </td>
                      <!-- Status -->
                      <td class="px-6 py-4 whitespace-nowrap">
                        <rs-badge
                          :variant="getStatusVariant(bantuan.status)"
                          class="text-xs"
                          >{{ bantuan.status }}</rs-badge
                        >
                      </td>
                      <!-- Tarikh Permohonan -->
                      <td
                        class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                      >
                        {{ bantuan.tarikhPermohonan }}
                      </td>
                      <!-- SLA -->
                      <td
                        class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                      >
                        {{ bantuan.sla }}
                      </td>
                      <!-- Status Dokumen -->
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm font-semibold text-green-700">
                          <rs-badge variant="primary" class="text-xs">{{
                            bantuan.statusDokumen?.toUpperCase()
                          }}</rs-badge>
                        </div>
                      </td>
                      <!-- Tindakan -->
                      <td class="px-6 py-4 whitespace-nowrap">
                        <rs-button
                          variant="primary-outline"
                          size="sm"
                          @click="editBantuan(bantuan.id)"
                          class="!px-3 !py-2"
                        >
                          <Icon
                            name="ph:magnifying-glass"
                            class="w-4 h-4 mr-1"
                          />
                          Semak
                        </rs-button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </template>
          </rs-card>
        </div>

        <!-- Sidebar -->
        <div class="lg:col-span-1 space-y-6">
          <!-- Status Update Card -->
          <rs-card class="shadow-sm border-0 bg-white sticky top-6">
            <template #header>
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div
                    class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center"
                  >
                    <Icon
                      name="ph:clipboard-text"
                      class="w-6 h-6 text-orange-600"
                    />
                  </div>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-gray-900">
                    Kemaskini Status
                  </h2>
                  <p class="text-sm text-gray-500">
                    Status dan catatan permohonan
                  </p>
                </div>
              </div>
            </template>

            <template #body>
              <div class="space-y-6">
                <!-- General Notes -->
                <div class="space-y-1">
                  <FormKit
                    type="textarea"
                    name="catatanUmumPegawai"
                    label="Catatan Umum Pegawai"
                    rows="4"
                    placeholder="Masukkan catatan umum (pilihan)"
                    :classes="{ outer: 'mb-0' }"
                  />
                </div>

                <!-- Action Buttons -->
                <div class="space-y-3 pt-4 border-t">
                  <rs-button
                    variant="primary"
                    @click="handleSimpanLengkap"
                    class="w-full !py-3 text-sm font-medium"
                  >
                    <Icon name="ph:check-circle" class="w-5 h-5 mr-2" />
                    Hantar
                  </rs-button>

                  <!-- <rs-button
                    variant="danger"
                    @click="handleTandakanTidakLengkap"
                    class="w-full !py-3 text-sm font-medium"
                  >
                    <Icon name="ph:x-circle" class="w-5 h-5 mr-2" />
                    Tandakan Tidak Lengkap
                  </rs-button> -->

                  <rs-button
                    variant="primary-outline"
                    @click="handleCancel"
                    class="w-full !py-3 text-sm font-medium"
                  >
                    <Icon name="ph:arrow-left" class="w-5 h-5 mr-2" />
                    Kembali
                  </rs-button>
                </div>

                <!-- Information Note -->
                <div class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div class="flex">
                    <Icon name="ph:info" class="w-5 h-5 text-blue-400 mt-0.5" />
                    <div class="ml-3">
                      <h3 class="text-sm font-medium text-blue-800">
                        Tindakan Permohonan
                      </h3>
                      <p class="mt-1 text-xs text-blue-700">
                        Pilih tindakan yang sesuai berdasarkan semakan dokumen
                        dan maklumat bantuan.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </rs-card>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <rs-modal
      v-model="showSuccessModal"
      title="Kemaskini Berjaya"
      size="md"
      position="center"
    >
      <template #body>
        <div class="space-y-6">
          <div class="text-center">
            <div
              class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100"
            >
              <Icon name="ph:check-circle" class="h-8 w-8 text-green-600" />
            </div>
            <h3 class="mt-4 text-lg font-semibold text-gray-900">
              Kemaskini Berjaya
            </h3>
            <p class="mt-2 text-sm text-gray-600">
              Status permohonan telah berjaya dikemaskini.
            </p>
          </div>

          <div class="bg-gray-50 p-4 rounded-lg space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-sm font-medium text-gray-700"
                >ID Permohonan:</span
              >
              <span class="text-sm font-mono text-gray-900">{{
                formData.idPermohonan
              }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm font-medium text-gray-700"
                >Status Baharu:</span
              >
              <rs-badge
                :variant="getStatusVariant(formData.statusPermohonanBaru)"
                class="text-xs"
              >
                {{ formData.statusPermohonanBaru }}
              </rs-badge>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm font-medium text-gray-700"
                >Tarikh Kemaskini:</span
              >
              <span class="text-sm text-gray-900">{{
                formatDateTime(new Date())
              }}</span>
            </div>
          </div>

          <div class="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p class="text-sm text-green-800 flex items-center">
              <Icon
                name="ph:check-circle"
                class="w-5 h-5 mr-2 flex-shrink-0 text-green-600"
              />
              Permohonan telah dikemaskini dan siap untuk langkah seterusnya.
            </p>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex justify-center">
          <rs-button variant="primary" @click="handleBackToList">
            OK
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

definePageMeta({
  title: "Semakan Permohonan",
});

const breadcrumb = ref([
  {
    name: "Tugasan",
    type: "link",
    path: "/BF-BTN/tugasan",
  },
  {
    name: "Senarai untuk Disemak",
    type: "link",
    path: "/BF-BTN/tugasan",
  },
  {
    name: "Semakan Permohonan",
    type: "current",
    path: `/BF-BTN/tugasan/bantuan/${route.params.id}`,
  },
]);

// Mock data - would be replaced with API call
const permohonanData = ref({
  status: "Dalam Semakan",
});

// Form data
const formData = ref({
  // Section 1: Maklumat Pemohon
  idPermohonan: "NAS-2025-0001",
  namaPemohon: "Ahmad bin Abdullah", // Read-only (C/V)
  noKadPengenalan: "800101-01-1234", // Read-only (C/V)
  alamatPremis: "No. 123, Jalan ABC, Taman XYZ, 50000 Kuala Lumpur", // Read-only (C/V)
  nomorTelefon: "012-3456789", // Read-only (C/V)
  emel: "ahmad@email.com", // Read-only (C/V)
  tarikhPermohonan: "15 Januari 2025",
  statusPermohonan: "Dalam Semakan",
  statusHousehold: "Fakir",
  statusIndividu: "Fakir",
  statusMultidimensi: "Asnaf tidak produktif",

  // Section 2: Senarai Bantuan
  senaraiBantuan: [
    {
      id: "B125-001",
      noBantuan: "B125-001",
      aid: "B125 - BANTUAN BAIKPULIH RUMAH (MISKIN)",
      aidProduct: "BAIKPULIH RUMAH (MISKIN)",
      productPackage: "PAKEJ TERAS (MISKIN)",
      entitlementProduct: "ENTITLEMENT BAIKPULIH (MISKIN)",
      kadar: 800,
      status: "Segera",
      tarikhPermohonan: "15 Jan 2025",
      sla: "3h",
      statusDokumen: "Lengkap",
    },
    /* {
      id: "B210", 
      nama: "B210 - Bantuan Modal (Miskin)",
      kadar: 5000,
      statusDokumen: "Lengkap",
    },
    {
      id: "B104",
      nama: "B104 - Bantuan Tunggakan Pembiayaan Rumah (Miskin)", 
      kadar: 1000,
      statusDokumen: "Lengkap",
    } */
  ],

  // Section 3: Status update
  statusPermohonanBaru: "",
  catatanUmumPegawai: "",
});

onMounted(() => {
  formData.value.senaraiBantuan.forEach((item) => {
    item.statusDokumen = "Lengkap";
  });
});

// Configuration data
const statusBantuanOptions = [
  { label: "-- Pilih Status --", value: "", disabled: true },
  { label: "Lengkap", value: "Lengkap" },
  { label: "Tak Lengkap", value: "Tak Lengkap" },
];

// Modals
const showSuccessModal = ref(false);

// Computed
const reviewedBantuan = computed(() => {
  return (
    formData.value.senaraiBantuan?.filter(
      (bantuan) => bantuan.statusDokumen && bantuan.statusDokumen !== ""
    ).length || 0
  );
});

// Methods
const getStatusVariant = (status) => {
  const variants = {
    baru: "info",
    "dalam semakan": "warning",
    "tidak lengkap": "danger",
    "untuk siasatan": "secondary",
    lengkap: "success",
    "tidak lengkap - untuk tindakan pemohon / pegawai": "danger",
  };
  return variants[status.toLowerCase()] || "default";
};

const formatDateTime = (date) => {
  return new Date(date).toLocaleString("ms-MY", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const editBantuan = (bantuanId) => {
  // Navigate to bantuan details page
  router.push(`/BF-BTN/tugasan/bantuan/semakan/${route.params.id}/${bantuanId}`);
};

const handleSimpanLengkap = () => {
  // Set status to "Untuk Siasatan" and save
  formData.value.statusPermohonanBaru = "Untuk Siasatan";
  console.log("Submitting form with status: Untuk Siasatan");

  // Show success modal
  showSuccessModal.value = true;
};

const handleCancel = () => {
  router.push("/BF-BTN/tugasan");
};

const handleBackToList = () => {
  showSuccessModal.value = false;
  router.push("/BF-BTN/tugasan");
};

const getTableRowClass = (status) => {
  switch (status) {
    case "Lengkap":
      return "bg-green-50/30";
    case "Tak Lengkap":
      return "bg-red-50/30";
    default:
      return "";
  }
};
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

// Progress bar animation
.transition-all {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
