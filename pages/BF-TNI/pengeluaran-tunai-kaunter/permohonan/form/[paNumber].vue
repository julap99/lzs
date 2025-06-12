<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Permohonan Pengeluaran Tunai</h2>
        </div>
      </template>

      <template #body>
        <!-- Applicant Info Card -->
        <rs-card v-if="applicantInfo" class="mb-6">
          <template #header>
            <div class="flex justify-between items-center">
              <h3 class="text-lg font-semibold">Maklumat Pemohon</h3>
            </div>
          </template>

          <template #body>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span class="font-medium">No Kad Pengenalan Pemohon:</span>
                <span class="ml-2">{{ applicantInfo.icNumber }}</span>
              </div>
              <div>
                <span class="font-medium">Nama Pemohon:</span>
                <span class="ml-2">{{ applicantInfo.name }}</span>
              </div>
              <div>
                <span class="font-medium">Status Asnaf / Kelayakan:</span>
                <span class="ml-2">{{ applicantInfo.asnafStatus }}</span>
              </div>
              <div>
                <span class="font-medium">Kategori Asnaf:</span>
                <span class="ml-2">{{ applicantInfo.asnafCategory }}</span>
              </div>
            </div>
          </template>
        </rs-card>

        <!-- BTB Info Card -->
        <rs-card v-if="btbInfo" class="mb-6">
          <template #header>
            <div class="flex justify-between items-center">
              <h3 class="text-lg font-semibold">Maklumat Bantuan Tunai Bulanan</h3>
            </div>
          </template>

          <template #body>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span class="font-medium">No PA:</span>
                <span class="ml-2">{{ btbInfo.paNumber }}</span>
              </div>
              <div>
                <span class="font-medium">Tarikh Terimaan:</span>
                <span class="ml-2">{{ formatDate(btbInfo.receiptDate) }}</span>
              </div>
              <div>
                <span class="font-medium">Jumlah Bantuan (RM):</span>
                <span class="ml-2">{{ formatAmount(btbInfo.amount) }}</span>
              </div>
              <div>
                <span class="font-medium">Kategori Bantuan:</span>
                <span class="ml-2">{{ btbInfo.category }}</span>
              </div>
            </div>
          </template>
        </rs-card>

        <!-- Cash Withdrawal Form -->
        <FormKit
          v-if="btbInfo"
          type="form"
          :actions="false"
          @submit="handleSubmit"
          v-model="formData"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <FormKit
              type="text"
              name="withdrawalAmount"
              label="Jumlah Pengeluaran (RM)"
              :disabled="true"
              :value="formatAmount(btbInfo.amount)"
            />
            <FormKit
              type="text"
              name="withdrawalDate"
              label="Tarikh Pengeluaran"
              :disabled="true"
              :value="formatDate(new Date().toISOString())"
            />
            <FormKit
              type="text"
              name="withdrawalLocation"
              label="Lokasi Pengeluaran"
              placeholder="Masukkan lokasi pengeluaran"
              validation="required"
              :validation-messages="{
                required: 'Lokasi pengeluaran diperlukan'
              }"
            />
            <FormKit
              type="text"
              name="withdrawalTime"
              label="Masa Pengeluaran"
              placeholder="Masukkan masa pengeluaran"
              validation="required"
              :validation-messages="{
                required: 'Masa pengeluaran diperlukan'
              }"
            />
          </div>

          <div class="mb-6">
            <h4 class="text-md font-semibold mb-2">Nota:</h4>
            <ul class="list-disc list-inside text-sm text-gray-600">
              <li>Pemohon perlu hadir ke lokasi pengeluaran pada tarikh dan masa yang ditetapkan</li>
              <li>Pemohon perlu membawa kad pengenalan asal</li>
              <li>Pemohon perlu menandatangani borang pengeluaran tunai</li>
            </ul>
          </div>

          <div class="flex justify-end gap-2">
            <rs-button
              variant="primary-outline"
              @click="handleCancel"
            >
              Batal
            </rs-button>
            <rs-button
              type="submit"
              :loading="isSubmitting"
            >
              Hantar Permohonan
            </rs-button>
          </div>
        </FormKit>
      </template>
    </rs-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

definePageMeta({
  title: "Permohonan Pengeluaran Tunai",
});

interface ApplicantInfo {
  icNumber: string;
  name: string;
  asnafStatus: string;
  asnafCategory: string;
}

interface BTBRecord {
  paNumber: string;
  receiptDate: string;
  amount: number;
  category: string;
  status: string;
}

const router = useRouter();
const route = useRoute();
const paNumber = route.params.paNumber as string;

const breadcrumb = ref([
  {
    name: "Pentadbiran",
    type: "link",
    path: "/BF-TNI/pengeluaran-tunai-kaunter",
  },
  {
    name: "Pengeluaran Tunai Kaunter",
    type: "link",
    path: "/BF-TNI/pengeluaran-tunai-kaunter",
  },
  {
    name: "Permohonan",
    type: "link",
    path: "/BF-TNI/pengeluaran-tunai-kaunter/permohonan",
  },
  {
    name: "Form Pengeluaran Tunai",
    type: "current",
    path: `/BF-TNI/pengeluaran-tunai-kaunter/permohonan/form/${paNumber}`,
  },
]);

// State management
const isSubmitting = ref(false);
const applicantInfo = ref<ApplicantInfo | null>(null);
const btbInfo = ref<BTBRecord | null>(null);
const formData = ref({
  withdrawalAmount: "",
  withdrawalDate: "",
  withdrawalLocation: "",
  withdrawalTime: "",
});

// Helper functions
const formatAmount = (amount: number) => {
  return new Intl.NumberFormat('ms-MY', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('ms-MY', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Form handlers
const handleSubmit = async () => {
  try {
    isSubmitting.value = true;
    
    // TODO: Implement API call to submit withdrawal request
    console.log('Submitting withdrawal request:', {
      paNumber,
      ...formData.value
    });

    // Navigate back to listing page after successful submission
    router.push('/BF-TNI/pengeluaran-tunai-kaunter/permohonan');
  } catch (error) {
    console.error('Error submitting withdrawal request:', error);
  } finally {
    isSubmitting.value = false;
  }
};

const handleCancel = () => {
  router.push('/BF-TNI/pengeluaran-tunai-kaunter/permohonan');
};

// Load data on mount
onMounted(async () => {
  try {
    // TODO: Implement API call to fetch applicant and BTB info
    // Mock data for now
    applicantInfo.value = {
      icNumber: "123456789012",
      name: "Ahmad bin Abdullah",
      asnafStatus: "Aktif",
      asnafCategory: "Fakir"
    };

    btbInfo.value = {
      paNumber,
      receiptDate: new Date().toISOString(),
      amount: 1000.00,
      category: "Bantuan Bulanan",
      status: "Belum Permohonan"
    };

    // Set initial form values
    if (btbInfo.value) {
      formData.value.withdrawalAmount = formatAmount(btbInfo.value.amount);
      formData.value.withdrawalDate = formatDate(new Date().toISOString());
    }
  } catch (error) {
    console.error('Error loading data:', error);
  }
});
</script>

<style lang="scss" scoped>
// Add any custom styles here
</style> 