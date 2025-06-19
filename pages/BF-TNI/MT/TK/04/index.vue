<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Terima Tunai & Agih Tunai (EKP)</h2>
        </div>
      </template>

      <template #body>
        <div class="space-y-6">
          <!-- Maklumat Serahan Tunai -->
          <div class="bg-white rounded-lg border border-gray-200">
            <div class="p-4 border-b border-gray-200">
              <h3 class="text-lg font-medium">Maklumat Serahan Tunai</h3>
            </div>
            <div class="p-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >ID Permohonan</label
                  >
                  <p class="mt-1">{{ distributionInfo.applicationId }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >Nama Pemohon</label
                  >
                  <p class="mt-1">{{ distributionInfo.applicantName }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >No Kad Pengenalan Pemohon</label
                  >
                  <p class="mt-1">{{ distributionInfo.applicantIc }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >Jenis Bantuan</label
                  >
                  <p class="mt-1">{{ distributionInfo.aidType }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >Amaun Tunai Diagihkan (RM)</label
                  >
                  <p class="mt-1">
                    RM {{ formatAmount(distributionInfo.distributedAmount) }}
                  </p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >Tarikh & Masa Serahan</label
                  >
                  <p class="mt-1">
                    {{ formatDateTime(distributionInfo.distributionDateTime) }}
                  </p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >Lokasi Serahan</label
                  >
                  <p class="mt-1">
                    {{ distributionInfo.distributionLocation }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Maklumat Pegawai & Pengesahan -->
          <div class="bg-white rounded-lg border border-gray-200">
            <div class="p-4 border-b border-gray-200">
              <h3 class="text-lg font-medium">Maklumat Pegawai & Pengesahan</h3>
            </div>
            <div class="p-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >Nama EKP Penyerah Tunai</label
                  >
                  <p class="mt-1">{{ officerInfo.ekpName }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >ID PKP Pemberi Tunai</label
                  >
                  <p class="mt-1">{{ officerInfo.pkpId }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >Slip Penerimaan Tunai</label
                  >
                  <p class="mt-1">{{ officerInfo.receiptSlip }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >Status Agihan</label
                  >
                  <p class="mt-1">{{ officerInfo.distributionStatus }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end space-x-4 mt-6">
            <rs-button
              variant="danger"
              :loading="isSubmitting"
              @click="handlePostpone"
            >
              <Icon name="ph:clock" class="mr-2" size="1rem" />
              Tangguh
            </rs-button>
            <rs-button
              variant="primary"
              :loading="isSubmitting"
              @click="handleConfirm"
            >
              <Icon name="ph:check-circle" class="mr-2" size="1rem" />
              Sahkan Agihan
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
  title: "Terima Tunai & Agih Tunai",
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
    name: "Terima Tunai & Agih Tunai (EKP)",
    type: "current",
    path: "/BF-TNI/MT/TK/04",
  },
]);

interface DistributionInfo {
  applicationId: string;
  applicantName: string;
  applicantIc: string;
  aidType: string;
  distributedAmount: number;
  distributionDateTime: string;
  distributionLocation: string;
}

interface OfficerInfo {
  ekpName: string;
  pkpId: string;
  receiptSlip: string;
  distributionStatus: string;
}

const distributionInfo = ref<DistributionInfo>({
  applicationId: "APP-2024-001",
  applicantName: "Ahmad bin Abdullah",
  applicantIc: "880101121234",
  aidType: "Cash Tunai",
  distributedAmount: 500.0,
  distributionDateTime: new Date().toISOString(),
  distributionLocation: "Cawangan Kuala Lumpur",
});

const officerInfo = ref<OfficerInfo>({
  ekpName: "Siti binti Ali",
  pkpId: "PKP001",
  receiptSlip: "SLIP-2024-001",
  distributionStatus: "Menunggu Pengesahan",
});

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

const handleConfirm = async () => {
  try {
    isSubmitting.value = true;
    // TODO: Implement API call for confirmation
    officerInfo.value.distributionStatus = "Berjaya";
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Show success message
    await router.push("/BF-TNI/MT/TK/05");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    isSubmitting.value = false;
  }
};

const handlePostpone = async () => {
  try {
    isSubmitting.value = true;
    // TODO: Implement API call for postponement
    officerInfo.value.distributionStatus = "Ditangguh";
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Show success message
    await router.push("/BF-TNI/MT/TK/01");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped></style>
