<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Kelulusan Permohonan Bagi Pengeluaran Tunai (PKP)
          </h2>
        </div>
      </template>

      <template #body>
        <!-- Applicant Information Section -->
        <div class="space-y-6">
          <!-- Maklumat Profil Pemohon -->
          <div class="bg-white rounded-lg border border-gray-200">
            <div class="p-4 border-b border-gray-200">
              <h3 class="text-lg font-medium">Maklumat Profil Pemohon</h3>
            </div>
            <div class="p-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >No. Kad Pengenalan Pemohon</label
                  >
                  <p class="mt-1">{{ applicantInfo.icNumber }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >Nama Pemohon</label
                  >
                  <p class="mt-1">{{ applicantInfo.name }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >Status Asnaf / Kelayakan</label
                  >
                  <p class="mt-1">{{ applicantInfo.asnafStatus }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >Kategori Asnaf</label
                  >
                  <p class="mt-1">{{ applicantInfo.asnafCategory }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >Kategori Permohonan</label
                  >
                  <p class="mt-1">{{ applicantInfo.applicationCategory }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >Jenis Bantuan Dimohon</label
                  >
                  <p class="mt-1">{{ applicantInfo.aidType }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >Rekod Bantuan Sedia Ada / Terdahulu</label
                  >
                  <p class="mt-1">{{ applicantInfo.previousAidRecord }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >Amaun Bantuan Diluluskan (RM)</label
                  >
                  <p class="mt-1">
                    RM {{ formatAmount(applicantInfo.approvedAmount) }}
                  </p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >Tarikh & Masa Permohonan</label
                  >
                  <p class="mt-1">
                    {{ formatDateTime(applicantInfo.applicationDateTime) }}
                  </p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >Lokasi Kaunter / Cawangan</label
                  >
                  <p class="mt-1">{{ applicantInfo.counterLocation }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Maklumat Peti Besi & Kelulusan -->
          <div class="bg-white rounded-lg border border-gray-200">
            <div class="p-4 border-b border-gray-200">
              <h3 class="text-lg font-medium">
                Maklumat Peti Besi & Kelulusan
              </h3>
            </div>
            <div class="p-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >Nama / ID Peti Besi</label
                  >
                  <p class="mt-1">{{ safeBoxInfo?.name }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >Jenis Akaun Peti Besi</label
                  >
                  <p class="mt-1">{{ safeBoxInfo?.accountType }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >Baki Semasa Peti Besi</label
                  >
                  <p class="mt-1">
                    RM {{ formatAmount(safeBoxInfo?.currentBalance || 0) }}
                  </p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >Nilai Float & Minimum Had</label
                  >
                  <p class="mt-1">
                    RM {{ formatAmount(safeBoxInfo?.floatValue || 0) }}
                  </p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >Jumlah Pengeluaran (RM)</label
                  >
                  <p class="mt-1">
                    RM {{ formatAmount(safeBoxInfo?.requestedAmount || 0) }}
                  </p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >Tarikh & Masa Kelulusan</label
                  >
                  <p class="mt-1">
                    {{ formatDateTime(safeBoxInfo?.approvalDateTime || "") }}
                  </p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >Nama EKP</label
                  >
                  <p class="mt-1">{{ safeBoxInfo?.ekpName }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >Status Permohonan</label
                  >
                  <p class="mt-1">{{ safeBoxInfo?.applicationStatus }}</p>
                </div>
                <div
                  v-if="safeBoxInfo?.applicationStatus === 'Ditolak'"
                  class="md:col-span-2"
                >
                  <label class="block text-sm font-medium text-gray-700"
                    >Sebab Penolakan</label
                  >
                  <p class="mt-1">{{ safeBoxInfo?.rejectionReason }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end space-x-4 mt-6">
            <rs-button
              variant="danger"
              :loading="isSubmitting"
              @click="handleReject"
            >
              <Icon name="ph:x-circle" class="mr-2" size="1rem" />
              Tolak
            </rs-button>
            <rs-button
              variant="primary"
              :loading="isSubmitting"
              @click="handleApprove"
            >
              <Icon name="ph:check-circle" class="mr-2" size="1rem" />
              Luluskan
            </rs-button>
          </div>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";

definePageMeta({
  title: "Kelulusan Permohonan Bagi Pengeluaran Tunai",
});

const route = useRoute();
const router = useRouter();
const isSubmitting = ref(false);

const breadcrumb = ref([
  {
    name: "Pengurusan Tunai",
    type: "link",
    path: "/BF-TNI/MT/TK/01",
  },
  {
    name: "Tunai Kaunter",
    type: "link",
    path: "/BF-TNI/MT/TK/01",
  },
  {
    name: "Kelulusan Permohonan Bagi Pengeluaran Tunai (PKP)",
    type: "current",
    path: "/BF-TNI/MT/TK/03",
  },
]);

interface ApplicantInfo {
  icNumber: string;
  name: string;
  asnafStatus: string;
  asnafCategory: string;
  applicationCategory: string;
  aidType: string;
  previousAidRecord: string;
  approvedAmount: number;
  applicationDateTime: string;
  counterLocation: string;
}

interface SafeBoxInfo {
  name: string;
  accountType: string;
  currentBalance: number;
  floatValue: number;
  requestedAmount: number;
  approvalDateTime: string;
  ekpName: string;
  applicationStatus: string;
  rejectionReason?: string;
}

const applicantInfo = ref<ApplicantInfo>({
  icNumber: "880101121234",
  name: "Ahmad bin Abdullah",
  asnafStatus: "Layak",
  asnafCategory: "Fakir",
  applicationCategory: "Baru",
  aidType: "Kecemasan",
  previousAidRecord: "Tiada",
  approvedAmount: 500.0,
  applicationDateTime: "2024-03-20T10:30:00",
  counterLocation: "Cawangan Kuala Lumpur",
});

const safeBoxInfo = ref<SafeBoxInfo>({
  name: "PB001",
  accountType: "Tunai",
  currentBalance: 10000.0,
  floatValue: 1000.0,
  requestedAmount: 500.0,
  approvalDateTime: "",
  ekpName: "Siti binti Ali",
  applicationStatus: "Menunggu Kelulusan",
});

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("ms-MY", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatDateTime = (dateTime: string) => {
  if (!dateTime) return "-";
  return new Date(dateTime).toLocaleString("ms-MY", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatAmount = (amount: number) => {
  return amount.toLocaleString("ms-MY", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const handleApprove = async () => {
  try {
    isSubmitting.value = true;
    // TODO: Implement API call for approval
    safeBoxInfo.value.applicationStatus = "Diluluskan";
    safeBoxInfo.value.approvalDateTime = new Date().toISOString();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Show success message
    await router.push("/BF-TNI/MT/TK/04");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    isSubmitting.value = false;
  }
};

const handleReject = async () => {
  try {
    isSubmitting.value = true;
    // TODO: Implement API call for rejection
    safeBoxInfo.value.applicationStatus = "Ditolak";
    safeBoxInfo.value.rejectionReason = "Jumlah melebihi had yang dibenarkan";
    safeBoxInfo.value.approvalDateTime = new Date().toISOString();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Show success message
    await router.push("/BF-TNI/MT/TK/04");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped></style>
