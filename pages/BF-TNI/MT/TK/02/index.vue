<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Permohonan Pengeluaran Tunai dari Peti Besi
          </h2>
        </div>
      </template>

      <template #body>
        <!-- Info Details Section -->
        <div class="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 class="text-lg font-medium mb-4">Keterangan Aktiviti</h3>
          <p>
            EKP menyemak maklumat bantuan pemohon berkaitan Bayaran Tunai
            Bulanan (BTB). Selepas semakan, EKP akan membuat permohonan rasmi
            untuk pengeluaran tunai daripada Peti Besi di dalam sistem NAS.
          </p>

          <h4 class="text-md font-medium mt-3 mb-2">Kaedah/Operasi:</h4>
          <ol class="list-decimal ml-5 space-y-1">
            <li>Semak Maklumat Bantuan</li>
            <li>Buat Permohonan Pengeluaran Tunai dari Peti Besi</li>
          </ol>
        </div>

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

          <!-- Maklumat Permohonan Pengeluaran Peti Besi -->
          <div class="bg-white rounded-lg border border-gray-200">
            <div class="p-4 border-b border-gray-200">
              <h3 class="text-lg font-medium">
                Maklumat Permohonan Pengeluaran Peti Besi
              </h3>
            </div>
            <div class="p-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >Nama / Kod Peti Besi</label
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
                    >Lokasi Serahan Tunai</label
                  >
                  <p class="mt-1">{{ safeBoxInfo?.cashHandoverLocation }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >Jumlah Tunai Dipohon (RM)</label
                  >
                  <p class="mt-1">
                    RM {{ formatAmount(safeBoxInfo?.requestedAmount || 0) }}
                  </p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >Kategori Agihan</label
                  >
                  <p class="mt-1">{{ safeBoxInfo?.distributionCategory }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >Status Permohonan</label
                  >
                  <p class="mt-1">{{ safeBoxInfo?.applicationStatus }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >Nama & ID EKP</label
                  >
                  <p class="mt-1">
                    {{ safeBoxInfo?.ekpName }} ({{ safeBoxInfo?.ekpId }})
                  </p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >Tarikh & Masa Tindakan EKP</label
                  >
                  <p class="mt-1">
                    {{ formatDateTime(safeBoxInfo?.ekpActionDateTime || "") }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end mt-6">
            <rs-button
              variant="primary"
              :loading="isSubmitting"
              @click="handleCashWithdrawal"
            >
              <Icon name="ph:money" class="mr-2" size="1rem" />
              Mohon Pengeluaran Tunai
            </rs-button>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Confirmation Modal -->
    <rs-modal
      title="Pengesahan Permohonan"
      v-model="showConfirmationModal"
      ok-title="Teruskan"
      cancel-title="Batal"
      position="center"
      :ok-callback="handleConfirmWithdrawal"
    >
      <template #body>
        <p class="mb-4">
          Permohonan pengeluaran tunai ini memerlukan kelulusan. Adakah anda
          pasti untuk meneruskan?
        </p>
        <div class="bg-gray-50 p-4 rounded-lg">
          <p class="font-medium">Nama Pemohon: {{ applicantInfo.name }}</p>
          <p class="font-medium">
            No. Kad Pengenalan: {{ applicantInfo.icNumber }}
          </p>
          <p class="font-medium">
            Jumlah Dipohon: RM {{ formatAmount(applicantInfo.approvedAmount) }}
          </p>
          <p class="text-sm text-gray-600 mt-2">
            Pastikan maklumat di atas adalah tepat sebelum meneruskan
            permohonan.
          </p>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";

definePageMeta({
  title: "Permohonan Pengeluaran Tunai dari Peti Besi",
});

const route = useRoute();
const router = useRouter();
const isSubmitting = ref(false);
const showConfirmationModal = ref(false);

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
    name: "Permohonan Pengeluaran Tunai dari Peti Besi",
    type: "current",
    path: "/BF-TNI/MT/TK/02",
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
  cashHandoverLocation: string;
  requestedAmount: number;
  distributionCategory: string;
  applicationStatus: string;
  ekpName: string;
  ekpId: string;
  ekpActionDateTime: string;
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
  accountType: "Cawangan",
  cashHandoverLocation: "Cawangan Kuala Lumpur",
  requestedAmount: 500.0,
  distributionCategory: "BTB",
  applicationStatus: "Menunggu Semakan",
  ekpName: "Siti binti Ali",
  ekpId: "EKP001",
  ekpActionDateTime: "2024-03-20T10:35:00",
});

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("ms-MY", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatDateTime = (dateTime: string) => {
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

const handleCashWithdrawal = async () => {
  showConfirmationModal.value = true;
};

const handleConfirmWithdrawal = async () => {
  try {
    isSubmitting.value = true;
    // TODO: Implement API call for cash withdrawal request
    await new Promise((resolve) => setTimeout(resolve, 1000));

    showConfirmationModal.value = false;
    // Show success message
    await router.push("/BF-TNI/MT/TK/03");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    isSubmitting.value = false;
    showConfirmationModal.value = false;
  }
};
</script>

<style scoped></style>
