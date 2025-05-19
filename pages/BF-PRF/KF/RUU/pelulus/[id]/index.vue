<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Kelulusan Perubahan Konfigurasi</h2>
          <rs-badge variant="warning" class="text-sm">
            <Icon name="mdi:clock-outline" class="mr-1" />
            Menunggu Kelulusan
          </rs-badge>
        </div>
      </template>

      <template #body>
        <!-- Approval Details Section -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Current Configuration -->
          <div class="border rounded-lg p-4">
            <h3 class="font-medium text-lg mb-4">Konfigurasi Semasa</h3>
            <div class="space-y-4">
              <div>
                <p class="text-sm text-gray-500">Dimensi</p>
                <p class="font-medium">{{ approvalData.dimensi }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Item</p>
                <p class="font-medium">{{ approvalData.item }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Skor Semasa</p>
                <p class="font-medium text-blue-600">
                  {{ approvalData.skorLama }}
                </p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Dikemaskini Oleh</p>
                <p class="font-medium">{{ approvalData.createdBy }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Tarikh Permohonan</p>
                <p class="font-medium">
                  {{ formatDate(approvalData.tarikhPermohonan) }}
                </p>
              </div>
            </div>
          </div>

          <!-- Proposed Changes -->
          <div class="border rounded-lg p-4">
            <h3 class="font-medium text-lg mb-4">Cadangan Perubahan</h3>
            <div class="space-y-4">
              <div>
                <p class="text-sm text-gray-500">Skor Baru</p>
                <p class="font-medium text-green-600">
                  {{ approvalData.skorBaru }}
                </p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Perbezaan</p>
                <p
                  class="font-medium"
                  :class="
                    scoreDifference >= 0 ? 'text-green-600' : 'text-red-600'
                  "
                >
                  {{ scoreDifference > 0 ? "+" : "" }}{{ scoreDifference }}
                </p>
              </div>
              <div>
                <p class="text-sm text-gray-500">Alasan Perubahan</p>
                <p class="font-medium">{{ approvalData.alasan }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Approval Form -->
        <div class="mt-8 border-t pt-6">
          <FormKit type="form" @submit="handleApproval" :actions="false">
            <FormKit
              type="textarea"
              name="catatan"
              label="Catatan (Pilihan)"
              placeholder="Masukkan catatan jika perlu"
              rows="3"
            />

            <div class="flex justify-end gap-3 mt-6">
              <rs-button
                variant="danger-outline"
                @click="rejectApproval"
                :loading="rejecting"
              >
                Tolak
              </rs-button>
              <rs-button
                variant="primary"
                @click="approveChanges"
                :loading="approving"
              >
                Lulus
              </rs-button>
            </div>
          </FormKit>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
const route = useRoute();
const approvalId = route.params.id;

// Sample approval data - in real app this would come from API
const approvalData = ref({
  dimensi: "Umur",
  item: "21-40 tahun",
  skorLama: 4,
  skorBaru: 5,
  alasan: "Penyesuaian dengan standard baru berdasarkan kajian terkini",
  tarikhPermohonan: "2025-05-18T14:30:00",
  status: "Menunggu Kelulusan",
  createdBy: "Admin A",
});

const approving = ref(false);
const rejecting = ref(false);

const breadcrumb = ref([
  {
    name: "Profiling",
    type: "link",
    path: "/BF-PRF/KF/MD/pelulus",
  },
  {
    name: "Kelulusan Dimensi",
    type: "link",
    path: "/BF-PRF/KF/MD/pelulus",
  },
  {
    name: "Detail Kelulusan",
    type: "current",
    path: `/BF-PRF/KF/MD/pelulus/${approvalId}`,
  },
]);

// Computed properties
const scoreDifference = computed(() => {
  return approvalData.value.skorBaru - approvalData.value.skorLama;
});

// Methods
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

const approveChanges = async () => {
  approving.value = true;
  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Update status
    approvalData.value.status = "Diluluskan";

    // Show success message
    alert("Perubahan telah diluluskan");

    // Navigate back to approval list
    navigateTo("/BF-PRF/KF/MD/pelulus");
  } catch (error) {
    alert("Gagal meluluskan perubahan");
  } finally {
    approving.value = false;
  }
};

const rejectApproval = async () => {
  rejecting.value = true;
  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Update status
    approvalData.value.status = "Ditolak";

    // Show success message
    alert("Perubahan telah ditolak");

    // Navigate back to approval list
    navigateTo("/BF-PRF/KF/MD/pelulus");
  } catch (error) {
    alert("Gagal menolak perubahan");
  } finally {
    rejecting.value = false;
  }
};

const handleApproval = (formData) => {
  // This would handle form submission if needed
  console.log("Catatan:", formData.catatan);
};
</script>

<style scoped>
/* Add any custom styles here */
</style>
