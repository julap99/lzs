<<<<<<< HEAD
<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Sahkan Agihan Pengeluaran Tunai</h2>
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
              <h3 class="text-lg font-semibold">
                Maklumat Bantuan Tunai Bulanan
              </h3>
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
                <span class="font-medium">Aids:</span>
                <span class="ml-2">{{ btbInfo.category }}</span>
              </div>
              <div>
                <span class="font-medium">Aid Product:</span>
                <span class="ml-2">{{ btbInfo.aidProduct }}</span>
              </div>
              <div>
                <span class="font-medium">Product Package:</span>
                <span class="ml-2">{{ btbInfo.productPackage }}</span>
              </div>
               <div>
                <span class="font-medium">Entitletement Product:</span>
                <span class="ml-2">{{ btbInfo.entitlementProduct }}</span>
              </div>
            </div>
          </template>
        </rs-card>

        <!-- Withdrawal Info Card -->
        <rs-card v-if="withdrawalInfo" class="mb-6">
          <template #header>
            <div class="flex justify-between items-center">
              <h3 class="text-lg font-semibold">Maklumat Pengeluaran Tunai</h3>
            </div>
          </template>

          <template #body>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span class="font-medium">Tarikh Pengeluaran:</span>
                <span class="ml-2">{{
                  formatDate(withdrawalInfo.withdrawalDate)
                }}</span>
              </div>
              <div>
                <span class="font-medium">Masa Pengeluaran:</span>
                <span class="ml-2">{{ withdrawalInfo.withdrawalTime }}</span>
              </div>
              <div>
                <span class="font-medium">Lokasi Pengeluaran:</span>
                <span class="ml-2">{{
                  withdrawalInfo.withdrawalLocation
                }}</span>
              </div>
            </div>
          </template>
        </rs-card>

        <!-- Disbursement Confirmation Form -->
        <FormKit
          v-if="withdrawalInfo"
          type="form"
          :actions="false"
          @submit="handleSubmit"
          v-model="formData"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <FormKit
              type="text"
              name="disbursementDate"
              label="Tarikh Agihan"
              :disabled="true"
              :value="formatDate(new Date().toISOString())"
            />
            <FormKit
              type="text"
              name="disbursementTime"
              label="Masa Agihan"
              :disabled="true"
              :value="
                new Date().toLocaleTimeString('ms-MY', {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              "
            />
            <FormKit
              type="text"
              name="disbursementLocation"
              label="Lokasi Agihan"
              :disabled="true"
              :value="withdrawalInfo.withdrawalLocation"
            />
            <FormKit
              type="text"
              name="disbursementAmount"
              label="Jumlah Agihan (RM)"
              :disabled="true"
              :value="formatAmount(btbInfo?.amount || 0)"
            />
          </div>

          <div class="mb-6">
            <h4 class="text-md font-semibold mb-2">Nota:</h4>
            <ul class="list-disc list-inside text-sm text-gray-600">
              <li>
                Pemohon perlu hadir ke lokasi agihan pada tarikh dan masa yang
                ditetapkan
              </li>
              <li>Pemohon perlu membawa kad pengenalan asal</li>
              <li>Pemohon perlu menandatangani borang pengesahan agihan</li>
            </ul>
          </div>

          <div class="flex justify-end gap-2">
            <rs-button variant="primary-outline" @click="handleCancel">
              Batal
            </rs-button>
            <rs-button
              type="submit"
              :loading="isSubmitting"
              @click="showConfirmationModal = true"
            >
              Sahkan Agihan
            </rs-button>
          </div>
        </FormKit>
      </template>
    </rs-card>

    <!-- Confirmation Modal -->
    <rs-modal
      v-model="showConfirmationModal"
      title="Sahkan Agihan"
      size="md"
      position="center"
    >
      <template #body>
        <div class="space-y-4">
          <div class="text-center">
            <Icon
              name="ph:warning-circle"
              class="mx-auto text-warning"
              size="3rem"
            />
            <h3 class="mt-4 text-lg font-medium text-gray-900">
              Sahkan Agihan Pengeluaran Tunai
            </h3>
            <p class="mt-2 text-sm text-gray-500">
              Adakah anda pasti untuk mengesahkan agihan pengeluaran tunai ini?
            </p>
          </div>

          <div class="bg-gray-50 p-4 rounded-lg space-y-2">
            <div class="flex justify-between">
              <span class="font-medium">No PA:</span>
              <span>{{ btbInfo?.paNumber }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-medium">Nama Pemohon:</span>
              <span>{{ applicantInfo?.name }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-medium">Jumlah Agihan:</span>
              <span>RM {{ formatAmount(btbInfo?.amount || 0) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-medium">Lokasi Agihan:</span>
              <span>{{ withdrawalInfo?.withdrawalLocation }}</span>
            </div>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex justify-end gap-3">
          <rs-button
            variant="primary-outline"
            @click="showConfirmationModal = false"
            :disabled="isSubmitting"
          >
            Batal
          </rs-button>
          <rs-button
            variant="primary"
            @click="handleSubmit"
            :disabled="isSubmitting"
          >
            Sahkan
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";

definePageMeta({
  title: "Sahkan Agihan Pengeluaran Tunai",
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
  aidProduct: string;
  status: string;
  productPackage: string;
  entitlementProduct: string;
}

interface WithdrawalInfo {
  withdrawalDate: string;
  withdrawalTime: string;
  withdrawalLocation: string;
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
    name: "Sahkan Agihan",
    type: "current",
    path: `/BF-TNI/pengeluaran-tunai-kaunter/permohonan/sahkan/${paNumber}`,
  },
]);

// State management
const isSubmitting = ref(false);
const showConfirmationModal = ref(false);
const applicantInfo = ref<ApplicantInfo | null>(null);
const btbInfo = ref<BTBRecord | null>(null);
const withdrawalInfo = ref<WithdrawalInfo | null>(null);
const formData = ref({
  disbursementDate: "",
  disbursementTime: "",
  disbursementLocation: "",
  disbursementAmount: "",
});

// Helper functions
const formatAmount = (amount: number) => {
  return new Intl.NumberFormat("ms-MY", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("ms-MY", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Form handlers
const handleSubmit = async () => {
  try {
    isSubmitting.value = true;

    // TODO: Implement API call to confirm disbursement
    console.log("Confirming disbursement:", {
      paNumber,
      ...formData.value,
    });

    await new Promise((resolve) => setTimeout(resolve, 1000));

    showConfirmationModal.value = false;

    // Navigate back to listing page after successful submission
    //router.push("/BF-TNI/pengeluaran-tunai-kaunter/permohonan/listing");
    router.push("/BF-TNI/slip-penerimaan");
  } catch (error) { 
    console.error("Error confirming disbursement:", error);
  } finally {
    isSubmitting.value = false;
    showConfirmationModal.value = false;
  }
};

const handleCancel = () => {
  router.push("/BF-TNI/pengeluaran-tunai-kaunter/permohonan");
};

// Load data on mount
onMounted(async () => {
  try {
    // TODO: Implement API call to fetch applicant, BTB, and withdrawal info
    // Mock data for now
    applicantInfo.value = {
      icNumber: "123456789012",
      name: "Ahmad bin Abdullah",
      asnafStatus: "Aktif",
      asnafCategory: "Fakir",
    };

    btbInfo.value = {
      paNumber,
      receiptDate: new Date().toISOString(),
      amount: 400.0,
      category: "B105 - BANTUAN KEWANGAN BULANAN (FAKIR)",
      aidProduct: "BANTUAN KEWANGAN BULANAN (FAKIR)",
      productPackage: "KEWANGAN BULANAN (FAKIR) - T3",
      entitlementProduct: "KEWANGAN BULANAN (FAKIR) - T3",
      status: "Diluluskan",
    };

    withdrawalInfo.value = {
      withdrawalDate: new Date().toISOString(),
      withdrawalTime: "10:00 AM",
      withdrawalLocation: "Pejabat Zakat Negeri",
    };

    // Set initial form values
    if (withdrawalInfo.value && btbInfo.value) {
      formData.value.disbursementDate = formatDate(new Date().toISOString());
      formData.value.disbursementTime = new Date().toLocaleTimeString("ms-MY", {
        hour: "2-digit",
        minute: "2-digit",
      });
      formData.value.disbursementLocation =
        withdrawalInfo.value.withdrawalLocation;
      formData.value.disbursementAmount = formatAmount(btbInfo.value.amount);
    }
  } catch (error) {
    console.error("Error loading data:", error);
  }
});
</script>

<style lang="scss" scoped>
// Add any custom styles here
</style>
=======
<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Sahkan Agihan Pengeluaran Tunai</h2>
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
              <h3 class="text-lg font-semibold">
                Maklumat Bantuan Tunai Bulanan
              </h3>
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
                <span class="font-medium">Aids:</span>
                <span class="ml-2">{{ btbInfo.category }}</span>
              </div>
              <div>
                <span class="font-medium">Aid Product:</span>
                <span class="ml-2">{{ btbInfo.aidProduct }}</span>
              </div>
              <div>
                <span class="font-medium">Product Package:</span>
                <span class="ml-2">{{ btbInfo.productPackage }}</span>
              </div>
               <div>
                <span class="font-medium">Entitletement Product:</span>
                <span class="ml-2">{{ btbInfo.entitlementProduct }}</span>
              </div>
            </div>
          </template>
        </rs-card>

        <!-- Withdrawal Info Card -->
        <rs-card v-if="withdrawalInfo" class="mb-6">
          <template #header>
            <div class="flex justify-between items-center">
              <h3 class="text-lg font-semibold">Maklumat Pengeluaran Tunai</h3>
            </div>
          </template>

          <template #body>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span class="font-medium">Tarikh Pengeluaran:</span>
                <span class="ml-2">{{
                  formatDate(withdrawalInfo.withdrawalDate)
                }}</span>
              </div>
              <div>
                <span class="font-medium">Masa Pengeluaran:</span>
                <span class="ml-2">{{ withdrawalInfo.withdrawalTime }}</span>
              </div>
              <div>
                <span class="font-medium">Lokasi Pengeluaran:</span>
                <span class="ml-2">{{
                  withdrawalInfo.withdrawalLocation
                }}</span>
              </div>
            </div>
          </template>
        </rs-card>

        <!-- Disbursement Confirmation Form -->
        <FormKit
          v-if="withdrawalInfo"
          type="form"
          :actions="false"
          @submit="handleSubmit"
          v-model="formData"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <FormKit
              type="text"
              name="disbursementDate"
              label="Tarikh Agihan"
              :disabled="true"
              :value="formatDate(new Date().toISOString())"
            />
            <FormKit
              type="text"
              name="disbursementTime"
              label="Masa Agihan"
              :disabled="true"
              :value="
                new Date().toLocaleTimeString('ms-MY', {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              "
            />
            <FormKit
              type="text"
              name="disbursementLocation"
              label="Lokasi Agihan"
              :disabled="true"
              :value="withdrawalInfo.withdrawalLocation"
            />
            <FormKit
              type="text"
              name="disbursementAmount"
              label="Jumlah Agihan (RM)"
              :disabled="true"
              :value="formatAmount(btbInfo?.amount || 0)"
            />
          </div>

          <div class="mb-6">
            <h4 class="text-md font-semibold mb-2">Nota:</h4>
            <ul class="list-disc list-inside text-sm text-gray-600">
              <li>
                Pemohon perlu hadir ke lokasi agihan pada tarikh dan masa yang
                ditetapkan
              </li>
              <li>Pemohon perlu membawa kad pengenalan asal</li>
              <li>Pemohon perlu menandatangani borang pengesahan agihan</li>
            </ul>
          </div>

          <div class="flex justify-end gap-2">
            <rs-button variant="primary-outline" @click="handleCancel">
              Batal
            </rs-button>
            <rs-button
              type="submit"
              :loading="isSubmitting"
              @click="showConfirmationModal = true"
            >
              Sahkan Agihan
            </rs-button>
          </div>
        </FormKit>
      </template>
    </rs-card>

    <!-- Confirmation Modal -->
    <rs-modal
      v-model="showConfirmationModal"
      title="Sahkan Agihan"
      size="md"
      position="center"
    >
      <template #body>
        <div class="space-y-4">
          <div class="text-center">
            <Icon
              name="ph:warning-circle"
              class="mx-auto text-warning"
              size="3rem"
            />
            <h3 class="mt-4 text-lg font-medium text-gray-900">
              Sahkan Agihan Pengeluaran Tunai
            </h3>
            <p class="mt-2 text-sm text-gray-500">
              Adakah anda pasti untuk mengesahkan agihan pengeluaran tunai ini?
            </p>
          </div>

          <div class="bg-gray-50 p-4 rounded-lg space-y-2">
            <div class="flex justify-between">
              <span class="font-medium">No PA:</span>
              <span>{{ btbInfo?.paNumber }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-medium">Nama Pemohon:</span>
              <span>{{ applicantInfo?.name }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-medium">Jumlah Agihan:</span>
              <span>RM {{ formatAmount(btbInfo?.amount || 0) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-medium">Lokasi Agihan:</span>
              <span>{{ withdrawalInfo?.withdrawalLocation }}</span>
            </div>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex justify-end gap-3">
          <rs-button
            variant="primary-outline"
            @click="showConfirmationModal = false"
            :disabled="isSubmitting"
          >
            Batal
          </rs-button>
          <rs-button
            variant="primary"
            @click="handleSubmit"
            :disabled="isSubmitting"
          >
            Sahkan
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";

definePageMeta({
  title: "Sahkan Agihan Pengeluaran Tunai",
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
  aidProduct: string;
  status: string;
  productPackage: string;
  entitlementProduct: string;
}

interface WithdrawalInfo {
  withdrawalDate: string;
  withdrawalTime: string;
  withdrawalLocation: string;
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
    name: "Sahkan Agihan",
    type: "current",
    path: `/BF-TNI/pengeluaran-tunai-kaunter/permohonan/sahkan/${paNumber}`,
  },
]);

// State management
const isSubmitting = ref(false);
const showConfirmationModal = ref(false);
const applicantInfo = ref<ApplicantInfo | null>(null);
const btbInfo = ref<BTBRecord | null>(null);
const withdrawalInfo = ref<WithdrawalInfo | null>(null);
const formData = ref({
  disbursementDate: "",
  disbursementTime: "",
  disbursementLocation: "",
  disbursementAmount: "",
});

// Helper functions
const formatAmount = (amount: number) => {
  return new Intl.NumberFormat("ms-MY", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("ms-MY", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Form handlers
const handleSubmit = async () => {
  try {
    isSubmitting.value = true;

    // TODO: Implement API call to confirm disbursement
    console.log("Confirming disbursement:", {
      paNumber,
      ...formData.value,
    });

    await new Promise((resolve) => setTimeout(resolve, 1000));

    showConfirmationModal.value = false;

    // Navigate back to listing page after successful submission
    //router.push("/BF-TNI/pengeluaran-tunai-kaunter/permohonan/listing");
    router.push("/BF-TNI/slip-penerimaan");
  } catch (error) { 
    console.error("Error confirming disbursement:", error);
  } finally {
    isSubmitting.value = false;
    showConfirmationModal.value = false;
  }
};

const handleCancel = () => {
  router.push("/BF-TNI/pengeluaran-tunai-kaunter/permohonan");
};

// Load data on mount
onMounted(async () => {
  try {
    // TODO: Implement API call to fetch applicant, BTB, and withdrawal info
    // Mock data for now
    applicantInfo.value = {
      icNumber: "123456789012",
      name: "Ahmad bin Abdullah",
      asnafStatus: "Aktif",
      asnafCategory: "Fakir",
    };

    btbInfo.value = {
      paNumber,
      receiptDate: new Date().toISOString(),
      amount: 400.0,
      category: "B105 - BANTUAN KEWANGAN BULANAN (FAKIR)",
      aidProduct: "BANTUAN KEWANGAN BULANAN (FAKIR)",
      productPackage: "KEWANGAN BULANAN (FAKIR) - T3",
      entitlementProduct: "KEWANGAN BULANAN (FAKIR) - T3",
      status: "Diluluskan",
    };

    withdrawalInfo.value = {
      withdrawalDate: new Date().toISOString(),
      withdrawalTime: "10:00 AM",
      withdrawalLocation: "Pejabat Zakat Negeri",
    };

    // Set initial form values
    if (withdrawalInfo.value && btbInfo.value) {
      formData.value.disbursementDate = formatDate(new Date().toISOString());
      formData.value.disbursementTime = new Date().toLocaleTimeString("ms-MY", {
        hour: "2-digit",
        minute: "2-digit",
      });
      formData.value.disbursementLocation =
        withdrawalInfo.value.withdrawalLocation;
      formData.value.disbursementAmount = formatAmount(btbInfo.value.amount);
    }
  } catch (error) {
    console.error("Error loading data:", error);
  }
});
</script>

<style lang="scss" scoped>
// Add any custom styles here
</style>
>>>>>>> 3dcc227fdaa7aaa5e054a6ffebfa8addde014eae
