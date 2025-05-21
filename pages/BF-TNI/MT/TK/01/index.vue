<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Semak Maklumat & Mohon Pengeluaran Tunai
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
            <li>Cari Permohonan Berdasarkan IC</li>
            <li>Semak Maklumat Bantuan</li>
            <li>Buat Permohonan Pengeluaran Tunai dari Peti Besi</li>
          </ol>
        </div>

        <!-- Form Section -->
        <div class="mb-6">
          <FormKit type="form" :actions="false" @submit="handleSubmit">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormKit
                type="text"
                name="icNumber"
                label="No. Kad Pengenalan"
                validation="required|length:12"
                v-model="formData.icNumber"
                :validation-messages="{
                  required: 'No. Kad Pengenalan adalah wajib',
                  length: 'No. Kad Pengenalan mesti 12 digit',
                }"
                placeholder="Contoh: 880101121234"
              />
            </div>

            <div class="mt-6 flex justify-end gap-4">
              <div>
                <rs-button variant="primary-outline" @click="resetForm">
                  Reset
                </rs-button>
              </div>

              <div>
                <rs-button
                  variant="primary"
                  class="ml-auto"
                  @click="validateAndSearch"
                  :disabled="processing"
                >
                  <span v-if="processing">
                    <Icon name="eos-icons:loading" class="ml-1" size="1rem" />
                  </span>
                  <span v-else>Cari</span>
                </rs-button>
              </div>
            </div>
          </FormKit>
        </div>

        <!-- Applicant Information Section -->
        <div v-if="applicantInfo" class="space-y-6">
          <el-divider content-position="left">Maklumat Pemohon</el-divider>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Nama</label
                >
                <p class="mt-1">{{ applicantInfo.name }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Nombor PA</label
                >
                <p class="mt-1">{{ applicantInfo.paNumber }}</p>
              </div>
            </div>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Tarikh Terimaan</label
                >
                <p class="mt-1">{{ formatDate(applicantInfo.receiptDate) }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Jumlah Bantuan</label
                >
                <p class="mt-1">RM {{ formatAmount(applicantInfo.amount) }}</p>
              </div>
            </div>
          </div>

          <div class="mt-6 space-y-4">
            <div class="max-w-md">
              <FormKit
                type="select"
                name="safeBox"
                label="Pilih Peti Besi"
                v-model="selectedSafeBox"
                :options="safeBoxes.map(box => ({
                  label: `${box.name} - ${box.cawangan} (${box.daerah})`,
                  value: box.id
                }))"
                placeholder="Sila pilih peti besi"
                validation="required"
                :validation-messages="{
                  required: 'Sila pilih peti besi'
                }"
                :disabled="isSubmitting"
              />
            </div>

            <div class="flex justify-end">
              <rs-button
                variant="primary"
                :loading="isSubmitting"
                @click="handleCashWithdrawal"
                :disabled="!selectedSafeBox"
              >
                <Icon name="ph:money" class="mr-2" size="1rem" />
                Mohon Pengeluaran Tunai
              </rs-button>
            </div>
          </div>
        </div>

        <!-- No Results Message -->
        <div v-else-if="hasSearched" class="text-center py-8">
          <el-empty description="Tiada maklumat dijumpai" />
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";

definePageMeta({
  title: "Semak Maklumat & Mohon Pengeluaran Tunai",
});

const route = useRoute();
const router = useRouter();
const processing = ref(false);
const hasSearched = ref(false);
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
    name: "Semak Maklumat & Mohon Pengeluaran Tunai",
    type: "current",
    path: "/BF-TNI/MT/TK/01",
  },
]);

interface ApplicantInfo {
  name: string;
  paNumber: string;
  receiptDate: string;
  amount: number;
}

interface SafeBox {
  id: string;
  name: string;
  location: string;
  cawangan: string;
  daerah: string;
}

const safeBoxes = ref<SafeBox[]>([
  { 
    id: '1', 
    name: 'Peti Besi 1', 
    location: 'Tingkat 1',
    cawangan: 'Cawangan Kuala Lumpur',
    daerah: 'Daerah Kuala Lumpur'
  },
  { 
    id: '2', 
    name: 'Peti Besi 2', 
    location: 'Tingkat 2',
    cawangan: 'Cawangan Selangor',
    daerah: 'Daerah Petaling Jaya'
  },
  { 
    id: '3', 
    name: 'Peti Besi 3', 
    location: 'Tingkat 3',
    cawangan: 'Cawangan Johor',
    daerah: 'Daerah Johor Bahru'
  },
]);

const selectedSafeBox = ref<string>('');

const formData = reactive({
  icNumber: "",
});

const applicantInfo = ref<ApplicantInfo | null>(null);

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("ms-MY", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatAmount = (amount: number) => {
  return amount.toLocaleString("ms-MY", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const resetForm = () => {
  formData.icNumber = "";
  hasSearched.value = false;
  applicantInfo.value = null;
  selectedSafeBox.value = "";
};

const validateAndSearch = () => {
  if (!formData.icNumber || formData.icNumber.length !== 12) {
    return;
  }

  performSearch();
};

const performSearch = async () => {
  processing.value = true;
  hasSearched.value = false;

  try {
    // TODO: Implement API call to fetch applicant information
    // Mock data for demonstration
    await new Promise((resolve) => setTimeout(resolve, 1000));
    applicantInfo.value = {
      name: "Ahmad bin Abdullah",
      paNumber: "PA123456",
      receiptDate: "2024-03-20",
      amount: 500.0,
    };
    hasSearched.value = true;
  } catch (error) {
    console.error("Error:", error);
  } finally {
    processing.value = false;
  }
};

const handleCashWithdrawal = async () => {
  if (!applicantInfo.value || !selectedSafeBox.value) return;

  try {
    isSubmitting.value = true;
    // TODO: Implement API call for cash withdrawal request with selectedSafeBox.value
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Show success message

    navigateTo("/BF-TNI/MT/TK/02");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    isSubmitting.value = false;
  }
};

const handleSubmit = (data: any) => {
  console.log("Form submitted:", data);
  validateAndSearch();
};
</script>

<style scoped></style>
