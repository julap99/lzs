<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Butiran Konfigurasi Status Household / Individu</h2>
          <rs-button
            variant="primary-outline"
            @click="navigateTo('/BF-PRF/KF/SHI/pelulus')"
          >
            <Icon name="mdi:arrow-left" class="mr-1" /> Kembali
          </rs-button>
        </div>
      </template>

      <template #body>
        <!-- Current Configuration -->
        <div class="mb-8">
          <h3 class="text-lg font-medium mb-4">Konfigurasi Semasa</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p class="text-sm text-gray-500">Status Asnaf</p>
              <p class="font-medium">{{ currentConfig.statusAsnaf }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Kategori</p>
              <p class="font-medium">{{ currentConfig.kategori }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Status Aktif</p>
              <rs-badge :variant="getStatusVariant(currentConfig.statusAktif)">
                {{ currentConfig.statusAktif }}
              </rs-badge>
            </div>
            <div>
              <p class="text-sm text-gray-500">Keterangan</p>
              <p class="font-medium">{{ currentConfig.keterangan }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Tarikh Cipta</p>
              <p class="font-medium">{{ formatDate(currentConfig.tarikhCipta) }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Dicipta Oleh</p>
              <p class="font-medium">{{ currentConfig.pengguna }}</p>
            </div>
          </div>
        </div>

        <!-- Pending Changes -->
        <div class="border-t pt-6">
          <h3 class="text-lg font-medium mb-4">Perubahan Menunggu Kelulusan</h3>
          <div class="">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p class="text-sm text-gray-500">Status Asnaf</p>
                <p class="font-medium">
                  {{ pendingChanges.statusAsnaf }}
                  <span
                    v-if="pendingChanges.statusAsnaf !== currentConfig.statusAsnaf"
                    class="text-xs text-yellow-700 bg-yellow-100 px-2 py-1 rounded ml-2"
                  >
                    Perubahan
                  </span>
                </p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Kategori</p>
                <p class="font-medium">
                  {{ pendingChanges.kategori }}
                  <span
                    v-if="pendingChanges.kategori !== currentConfig.kategori"
                    class="text-xs text-yellow-700 bg-yellow-100 px-2 py-1 rounded ml-2"
                  >
                    Perubahan
                  </span>
                </p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Status Aktif</p>
                <p class="font-medium">
                  <rs-badge :variant="getStatusVariant(pendingChanges.statusAktif)">
                    {{ pendingChanges.statusAktif }}
                  </rs-badge>
                  <span
                    v-if="pendingChanges.statusAktif !== currentConfig.statusAktif"
                    class="text-xs text-yellow-700 bg-yellow-100 px-2 py-1 rounded ml-2"
                  >
                    {{ getStatusChangeDirection(currentConfig.statusAktif, pendingChanges.statusAktif) }}
                  </span>
                </p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Keterangan</p>
                <p class="font-medium">
                  {{ pendingChanges.keterangan }}
                  <span
                    v-if="pendingChanges.keterangan !== currentConfig.keterangan"
                    class="text-xs text-yellow-700 bg-yellow-100 px-2 py-1 rounded ml-2"
                  >
                    Perubahan
                  </span>
                </p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Pemohon</p>
                <p class="font-medium">{{ pendingChanges.requestedBy }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Tarikh Permohonan</p>
                <p class="font-medium">{{ formatDate(pendingChanges.requestDate) }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Status Kelulusan</p>
                <rs-badge variant="warning">{{ pendingChanges.approvalStatus }}</rs-badge>
              </div>
            </div>

            <!-- Catatan from requester -->
            <div class="mt-4" v-if="pendingChanges.catatan">
              <p class="text-sm text-gray-500">Catatan Pemohon</p>
              <p class="font-medium">{{ pendingChanges.catatan }}</p>
            </div>

            <!-- Approval Actions -->
            <div class="mt-6">
              <h4 class="text-md font-medium mb-2">Tindakan Kelulusan</h4>
              <div class="grid grid-cols-1 gap-4">
                <FormKit
                  type="textarea"
                  v-model="approvalNotes"
                  label="Catatan (Pilihan)"
                  placeholder="Sila nyatakan catatan jika perlu"
                  rows="2"
                />
                <div class="flex justify-end gap-2">
                  <rs-button
                    variant="danger-outline"
                    @click="handleReject"
                    :loading="isProcessing"
                  >
                    Tolak
                  </rs-button>
                  <rs-button
                    variant="primary"
                    @click="handleApprove"
                    :loading="isProcessing"
                  >
                    Luluskan
                  </rs-button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Audit History Section -->
        <div class="border-t pt-6 mt-8">
          <h3 class="text-lg font-medium mb-4">Sejarah Audit</h3>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tarikh
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tindakan
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pengguna
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Catatan
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="(item, index) in auditHistory" :key="index">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ formatDate(item.tarikh) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <rs-badge :variant="getAuditActionVariant(item.tindakan)">
                      {{ item.tindakan }}
                    </rs-badge>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ item.pengguna }}
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-900">
                    {{ item.catatan || "-" }}
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
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useToast } from "vue-toastification";

definePageMeta({
  title: "Semakan & Kelulusan Status Household / Individu",
  middleware: ["auth", "approver"],
});

const route = useRoute();
const toast = useToast();
const approvalId = ref(null);
const isProcessing = ref(false);
const approvalNotes = ref("");

const breadcrumb = ref([
  {
    name: "Kelulusan",
    type: "link",
    path: "/BF-PRF/KF/SHI/pelulus",
  },
  {
    name: "Senarai Kelulusan",
    type: "link",
    path: "/BF-PRF/KF/SHI/pelulus",
  },
  {
    name: "Butiran Konfigurasi",
    type: "current",
    path: `/BF-PRF/KF/SHI/pelulus/${route.params.id}`,
  },
]);

// Current configuration data (last approved state)
const currentConfig = ref({
  statusAsnaf: "Fakir",
  kategori: "Household",
  statusAktif: "Aktif", // This is the last approved state
  keterangan: "Orang yang tidak mempunyai harta dan tiada mata pencarian yang boleh memenuhi keperluan asas diri dan tanggungannya.",
  tarikhCipta: "2025-01-10T09:00:00",
  pengguna: "admin.zakat",
});

// Pending changes data (what requester wants to change to)
const pendingChanges = ref({
  statusAsnaf: "Fakir",
  kategori: "Household",
  statusAktif: "Tidak Aktif", // This is what the requester wants to change it to
  keterangan: "Orang yang tidak mempunyai harta dan tiada mata pencarian yang boleh memenuhi keperluan asas diri dan tanggungannya.",
  requestedBy: "Ahmad bin Ali",
  requestDate: "2025-01-15T10:30:00",
  catatan: "Perubahan status dari Aktif ke Tidak Aktif kerana perlu semakan semula kriteria.",
  approvalStatus: "Menunggu Kelulusan", // The overall approval status
});

// Audit history data
const auditHistory = ref([
  {
    tarikh: "2025-01-15T10:30:00",
    tindakan: "Permohonan Kelulusan",
    pengguna: "Ahmad bin Ali",
    catatan: "Perubahan status dari Aktif ke Tidak Aktif kerana perlu semakan semula kriteria.",
  },
  {
    tarikh: "2025-01-12T14:20:00",
    tindakan: "Kemaskini",
    pengguna: "admin.zakat",
    catatan: "Kemaskini keterangan status Fakir",
  },
  {
    tarikh: "2025-01-10T09:00:00",
    tindakan: "Cipta",
    pengguna: "admin.zakat",
    catatan: "Penciptaan status Fakir baharu",
  },
]);

// Load data
onMounted(async () => {
  try {
    approvalId.value = route.params.id;
    
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // In a real app, you would fetch the approval details from API
    console.log("Loading approval details for ID:", approvalId.value);
    
  } catch (error) {
    toast.error("Ralat memuat data. Sila cuba lagi.");
    console.error(error);
  }
});

// Approval actions
const handleApprove = async () => {
  try {
    isProcessing.value = true;
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Update the current configuration with the approved changes
    // This is what happens when approval is successful
    currentConfig.value = {
      ...currentConfig.value,
      statusAktif: pendingChanges.value.statusAktif, // Apply the approved status
      // Other fields would be updated as well
    };
    
    // Add approval entry to audit history
    const newAuditEntry = {
      tarikh: new Date().toISOString(),
      tindakan: "Diluluskan",
      pengguna: "pelulus.zakat", // This would come from current user
      catatan: approvalNotes.value || "Permohonan diluluskan",
    };
    auditHistory.value.unshift(newAuditEntry);
    
    // Success handling
    toast.success("Permohonan berjaya diluluskan");
    navigateTo("/BF-PRF/KF/SHI/pelulus");
    
  } catch (error) {
    toast.error("Ralat semasa meluluskan permohonan. Sila cuba lagi.");
    console.error(error);
  } finally {
    isProcessing.value = false;
  }
};

const handleReject = async () => {
  try {
    isProcessing.value = true;
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Add rejection entry to audit history
    const newAuditEntry = {
      tarikh: new Date().toISOString(),
      tindakan: "Ditolak",
      pengguna: "pelulus.zakat", // This would come from current user
      catatan: approvalNotes.value || "Permohonan ditolak",
    };
    auditHistory.value.unshift(newAuditEntry);
    
    // Success handling
    toast.success("Permohonan telah ditolak");
    navigateTo("/BF-PRF/KF/SHI/pelulus");
    
  } catch (error) {
    toast.error("Ralat semasa menolak permohonan. Sila cuba lagi.");
    console.error(error);
  } finally {
    isProcessing.value = false;
  }
};

// Helper functions
const formatDate = (dateString) => {
  if (!dateString) return "";
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(dateString).toLocaleDateString("ms-MY", options);
};

const getStatusVariant = (status) => {
  switch (status) {
    case "Aktif":
      return "success";
    case "Tidak Aktif":
      return "danger";
    case "Menunggu Kelulusan":
      return "warning";
    default:
      return "default";
  }
};

const getAuditActionVariant = (action) => {
  switch (action) {
    case "Diluluskan":
      return "success";
    case "Ditolak":
      return "danger";
    case "Permohonan Kelulusan":
      return "warning";
    case "Kemaskini":
      return "info";
    case "Cipta":
      return "primary";
    default:
      return "default";
  }
};

const getStatusChangeDirection = (oldStatus, newStatus) => {
  if (oldStatus === "Aktif" && newStatus === "Tidak Aktif") {
    return "↓ Tidak Aktif";
  }
  if (oldStatus === "Tidak Aktif" && newStatus === "Aktif") {
    return "↑ Aktif";
  }
  return "Perubahan";
};
</script> 