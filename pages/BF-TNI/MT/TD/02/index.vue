<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Kelulusan Permohonan Keluar Tunai (KOAD / EKS HQ)
          </h2>
          <rs-badge :variant="getStatusBadgeVariant()">
            {{ applicationData?.status || "Menunggu Kelulusan" }}
          </rs-badge>
        </div>
      </template>

      <template #body>
        <div class="p-4">
          <!-- Maklumat Permohonan & Justifikasi -->
          <div class="mb-8">
            <h3 class="text-lg font-semibold mb-4">
              Maklumat Permohonan & Justifikasi
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- ID Permohonan (V) -->
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >ID Permohonan</label
                >
                <p class="mt-1">{{ applicationData.id }}</p>
              </div>

              <!-- Nama & No KP Pemohon (EOAD) (V) -->
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Nama & No KP Pemohon (EOAD)</label
                >
                <p class="mt-1">
                  {{ applicationData.namaPemohon }} ({{ applicationData.noKp }})
                </p>
              </div>

              <!-- Jumlah Tunai Dimohon (RM) (C/U/V) -->
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Jumlah Tunai Dimohon (RM)</label
                >
                <p class="mt-1">
                  RM {{ formatCurrency(applicationData.jumlahTunai) }}
                </p>
              </div>

              <!-- Baki Peti Besi Semasa (V) -->
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Baki Peti Besi Semasa (RM)</label
                >
                <p class="mt-1">
                  RM {{ formatCurrency(applicationData.bakiPetiBesi) }}
                </p>
              </div>

              <!-- Lokasi / Laluan Agihan (V) -->
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Lokasi / Laluan Agihan</label
                >
                <p class="mt-1">{{ applicationData.lokasiAgihan }}</p>
              </div>

              <!-- Tujuan Bantuan / Catatan Tambahan (C/U/V) -->
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Tujuan Bantuan / Catatan Tambahan</label
                >
                <p class="mt-1">{{ applicationData.tujuanBantuan }}</p>
              </div>
            </div>
          </div>

          <!-- Maklumat Kelulusan -->
          <div class="mt-8 border-t pt-6">
            <h3 class="text-lg font-semibold mb-4">Maklumat Kelulusan</h3>
            <FormKit
              type="form"
              :actions="false"
              @submit="handleSubmit"
              v-model="approvalData"
            >
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Nama Pegawai Pelulus (KOAD / EKS HQ) (V) -->
                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >Nama Pegawai Pelulus (KOAD / EKS HQ)</label
                  >
                  <p class="mt-1">{{ currentUserName }}</p>
                </div>

                <!-- Tarikh & Masa Kelulusan (V) -->
                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >Tarikh & Masa Kelulusan</label
                  >
                  <p class="mt-1">{{ formatDateTime(new Date()) }}</p>
                </div>

                <!-- Status Permohonan (C/U) -->
                <FormKit
                  type="radio"
                  name="status"
                  label="Status Permohonan"
                  validation="required"
                  :options="[
                    { label: 'Diluluskan', value: 'DILULUSKAN' },
                    { label: 'Ditolak', value: 'DITOLAK' },
                  ]"
                  :validation-messages="{
                    required: 'Status permohonan adalah wajib',
                  }"
                />

                <!-- Sebab Penolakan (C/U) -->
                <FormKit
                  v-if="approvalData.status === 'DITOLAK'"
                  type="textarea"
                  name="sebabPenolakan"
                  label="Sebab Penolakan"
                  validation="required"
                  :validation-messages="{
                    required: 'Sebab penolakan adalah wajib',
                  }"
                  rows="3"
                />
              </div>

              <div class="flex justify-end gap-4 mt-6">
                <rs-button
                  type="button"
                  variant="primary-outline"
                  @click="resetForm"
                >
                  Reset
                </rs-button>
                <rs-button
                  type="submit"
                  variant="primary"
                  :loading="isSubmitting"
                  @click="handleSubmit"
                >
                  Hantar Keputusan
                </rs-button>
              </div>
            </FormKit>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Confirmation Modal -->
    <rs-modal
      v-model="showConfirmationModal"
      :title="
        approvalData.status === 'DILULUSKAN'
          ? 'Pengesahan Kelulusan'
          : 'Pengesahan Penolakan'
      "
      ok-title="Sahkan"
      cancel-title="Batal"
      position="center"
      @ok="handleConfirm"
    >
      <template #body>
        <p class="mb-4">
          Adakah anda pasti untuk
          {{ approvalData.status === "DILULUSKAN" ? "meluluskan" : "menolak" }}
          permohonan ini?
        </p>
        <div class="bg-gray-50 p-4 rounded-lg">
          <p class="font-medium">ID Permohonan: {{ applicationData.id }}</p>
          <p class="font-medium">
            Nama Pemohon: {{ applicationData.namaPemohon }}
          </p>
          <p class="font-medium">
            Jumlah Dimohon: RM {{ formatCurrency(applicationData.jumlahTunai) }}
          </p>
          <p v-if="approvalData.status === 'DITOLAK'" class="font-medium">
            Sebab Penolakan: {{ approvalData.sebabPenolakan }}
          </p>
          <p class="text-sm text-gray-600 mt-2">
            Pastikan keputusan yang dipilih adalah tepat sebelum mengesahkan.
          </p>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

definePageMeta({
  title: "Kelulusan Permohonan Keluar Tunai",
});

const router = useRouter();
const isSubmitting = ref(false);
const showConfirmationModal = ref(false);

const breadcrumb = ref([
  {
    name: "Pengurusan Tunai",
    type: "link",
    path: "/BF-TNI/MT/TD/01",
  },
  {
    name: "Tunai Dilapangan",
    type: "link",
    path: "/BF-TNI/MT/TD/01",
  },
  {
    name: "Kelulusan Permohonan Keluar Tunai (KOAD / EKS HQ)",
    type: "current",
    path: "/BF-TNI/MT/TD/02",
  },
]);

// Mock data - replace with actual data from API
const currentUserName = ref("Siti binti Ali (KOAD)");
const applicationData = ref({
  id: "TD-2024-001",
  namaPemohon: "Ahmad bin Abdullah",
  noKp: "880101121234",
  jumlahTunai: 5000.0,
  bakiPetiBesi: 10000.0,
  lokasiAgihan: "Kuala Lumpur",
  tujuanBantuan: "Bantuan Lapangan - Operasi Banjir",
  status: "Menunggu Kelulusan",
});

const approvalData = ref({
  status: "",
  sebabPenolakan: "",
});

const formatCurrency = (value: number) => {
  return value.toLocaleString("ms-MY", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const formatDateTime = (date: Date) => {
  return date.toLocaleString("ms-MY", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusBadgeVariant = () => {
  switch (applicationData.value.status) {
    case "Diluluskan":
      return "success";
    case "Ditolak":
      return "danger";
    case "Menunggu Kelulusan":
      return "warning";
    default:
      return "default";
  }
};

const resetForm = () => {
  approvalData.value = {
    status: "",
    sebabPenolakan: "",
  };
};

const handleSubmit = async () => {
  showConfirmationModal.value = true;
};

const handleConfirm = async () => {
  try {
    isSubmitting.value = true;
    // TODO: Implement API call to submit approval decision
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Update application status
    applicationData.value.status = approvalData.value.status;

    showConfirmationModal.value = false;
    // Show success message and redirect
    navigateTo("/BF-TNI/MT/TD/03");
  } catch (error) {
    console.error("Error submitting approval:", error);
  } finally {
    isSubmitting.value = false;
    showConfirmationModal.value = false;
  }
};
</script>

<style scoped></style>
