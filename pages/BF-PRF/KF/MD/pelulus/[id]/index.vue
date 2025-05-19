<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Butiran Konfigurasi Had Kifayah</h2>
          <rs-button
            variant="primary-outline"
            @click="navigateTo('/BF-ADM/APPR/01')"
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
              <p class="text-sm text-gray-500">Kategori</p>
              <p class="font-medium">{{ configData.category }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Kategori Isi Rumah</p>
              <p class="font-medium">{{ configData.householdType }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Kadar Berbayar</p>
              <p class="font-medium">
                RM {{ formatCurrency(configData.paidHouseRate) }}
              </p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Kadar Percuma</p>
              <p class="font-medium">
                RM {{ formatCurrency(configData.freeHouseRate) }}
              </p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Tarikh Mula Kuat Kuasa</p>
              <p class="font-medium">
                {{ formatDate(configData.effectiveDate) }}
              </p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Status</p>
              <rs-badge :variant="getStatusVariant(configData.status)">
                {{ configData.status }}
              </rs-badge>
            </div>
          </div>
        </div>

        <!-- Pending Changes -->
        <div class="border-t pt-6">
          <h3 class="text-lg font-medium mb-4">Perubahan Menunggu Kelulusan</h3>
          <div class="">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p class="text-sm text-gray-500">Kategori</p>
                <p class="font-medium">
                  {{ pendingChanges.category }}
                  <span
                    v-if="pendingChanges.category !== configData.category"
                    class="text-xs text-yellow-700 bg-yellow-100 px-2 py-1 rounded ml-2"
                  >
                    Perubahan
                  </span>
                </p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Kategori Isi Rumah</p>
                <p class="font-medium">
                  {{ pendingChanges.householdType }}
                  <span
                    v-if="
                      pendingChanges.householdType !== configData.householdType
                    "
                    class="text-xs text-yellow-700 bg-yellow-100 px-2 py-1 rounded ml-2"
                  >
                    Perubahan
                  </span>
                </p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Kadar Berbayar</p>
                <p class="font-medium">
                  RM {{ formatCurrency(pendingChanges.paidHouseRate) }}
                  <span
                    v-if="
                      pendingChanges.paidHouseRate !== configData.paidHouseRate
                    "
                    class="text-xs text-yellow-700 bg-yellow-100 px-2 py-1 rounded ml-2"
                  >
                    {{
                      getChangeDirection(
                        configData.paidHouseRate,
                        pendingChanges.paidHouseRate
                      )
                    }}
                  </span>
                </p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Kadar Percuma</p>
                <p class="font-medium">
                  RM {{ formatCurrency(pendingChanges.freeHouseRate) }}
                  <span
                    v-if="
                      pendingChanges.freeHouseRate !== configData.freeHouseRate
                    "
                    class="text-xs text-yellow-700 bg-yellow-100 px-2 py-1 rounded ml-2"
                  >
                    {{
                      getChangeDirection(
                        configData.freeHouseRate,
                        pendingChanges.freeHouseRate
                      )
                    }}
                  </span>
                </p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Tarikh Mula Kuat Kuasa</p>
                <p class="font-medium">
                  {{ formatDate(pendingChanges.effectiveDate) }}
                  <span
                    v-if="
                      pendingChanges.effectiveDate !== configData.effectiveDate
                    "
                    class="text-xs text-yellow-700 bg-yellow-100 px-2 py-1 rounded ml-2"
                  >
                    Perubahan
                  </span>
                </p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Status</p>
                <rs-badge variant="warning">Menunggu Kelulusan</rs-badge>
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
      </template>
    </rs-card>
  </div>
</template>

<script setup>
const route = useRoute();
const router = useRouter();

const id = route.params.id;

const breadcrumb = ref([
  {
    name: "Kelulusan",
    type: "link",
    path: "/BF-ADM/APPR/01",
  },
  {
    name: "Senarai Kelulusan",
    type: "link",
    path: "/BF-ADM/APPR/01",
  },
  {
    name: "Butiran Konfigurasi",
    type: "current",
    path: `/BF-PRF/KF/HK/${id}`,
  },
]);

// Data
const configData = ref({
  id: parseInt(id),
  category: "Utama",
  householdType: "Ketua Keluarga",
  paidHouseRate: 1200.0,
  freeHouseRate: 1000.0,
  effectiveDate: "2025-01-01",
  status: "Aktif",
});

const pendingChanges = ref({
  id: parseInt(id),
  category: "Utama",
  householdType: "Ketua Keluarga",
  paidHouseRate: 1500.0,
  freeHouseRate: 1200.0,
  effectiveDate: "2025-06-01",
  status: "Menunggu Kelulusan",
  catatan: "Perubahan kadar berdasarkan indeks harga pengguna semasa",
  requestedBy: "Ahmad bin Ali",
  requestDate: "2025-05-15",
});

const approvalNotes = ref("");
const isProcessing = ref(false);

// Methods
const handleApprove = async () => {
  isProcessing.value = true;
  try {
    // API call to approve changes
    configData.value = {
      ...pendingChanges.value,
      status: "Aktif",
    };

    // Show success message and redirect
    alert("Permohonan telah diluluskan");
    navigateTo("/BF-PRF/KF/HK/pelulus");
  } catch (error) {
    alert("Gagal meluluskan permohonan");
  } finally {
    isProcessing.value = false;
  }
};

const handleReject = async () => {
  isProcessing.value = true;
  try {
    // API call to reject changes
    // Show success message and redirect
    alert("Permohonan telah ditolak");
    navigateTo("/BF-PRF/KF/HK/pelulus");
  } catch (error) {
    alert("Gagal menolak permohonan");
  } finally {
    isProcessing.value = false;
  }
};

// Helper functions
const formatDate = (dateString) => {
  if (!dateString) return "";
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString("ms-MY", options);
};

const formatCurrency = (value) => {
  if (value === undefined || value === null) return "0.00";
  return parseFloat(value).toFixed(2);
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

const getChangeDirection = (oldValue, newValue) => {
  if (newValue > oldValue) return "↑ Naik";
  if (newValue < oldValue) return "↓ Turun";
  return "Tiada perubahan";
};
</script>
