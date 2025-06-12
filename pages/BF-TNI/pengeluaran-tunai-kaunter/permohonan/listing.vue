<template>
  <div>
    <rs-card>
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Senarai Bantuan Tunai Bulanan</h2>
          <rs-button variant="primary-outline" @click="navigateToSearch">
            Kembali ke Carian
          </rs-button>
        </div>
      </template>

      <template #body>
        <!-- Applicant Info Summary -->
        <div v-if="applicantInfo" class="mb-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span class="font-medium">No Kad Pengenalan Pemohon:</span>
              <span class="ml-2">{{ applicantInfo.icNumber }}</span>
            </div>
            <div>
              <span class="font-medium">Nama Pemohon:</span>
              <span class="ml-2">{{ applicantInfo.name }}</span>
            </div>
          </div>
        </div>

        <!-- BTB Listing Table -->
        <rs-table
          :data="btbList"
          :key="tableKey"
          :pageSize="10"
          :showNoColumn="true"
          :columns="[
            { key: 'paNumber', label: 'No PA' },
            { key: 'receiptDate', label: 'Tarikh Terimaan' },
            { key: 'amount', label: 'Jumlah Bantuan (RM)' },
            { key: 'category', label: 'Kategori Bantuan' },
            { key: 'status', label: 'Status Bantuan' },
            { key: 'actions', label: 'Tindakan' },
          ]"
          :options="{
            variant: 'default',
            hover: true,
          }"
        >
          <template v-slot:amount="data: TableSlotData">
            {{ formatAmount(data.value.amount) }}
          </template>
          <template v-slot:actions="data: TableSlotData">
            <div class="flex gap-2">
              <rs-button
                v-if="data.value.status === 'Belum Permohonan'"
                size="sm"
                @click="handleCashWithdrawal(data.value)"
              >
                Mohon Pengeluaran Tunai
              </rs-button>
              <rs-button
                v-if="data.value.status === 'Diluluskan'"
                size="sm"
                @click="handleConfirmDisbursement(data.value)"
              >
                Sahkan Agihan
              </rs-button>
            </div>
          </template>
        </rs-table>
      </template>
    </rs-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";

definePageMeta({
  title: "Senarai Bantuan Tunai Bulanan",
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

interface TableSlotData {
  text: string | number;
  value: BTBRecord;
}

const router = useRouter();
const route = useRoute();

const tableKey = ref(0);
const applicantInfo = ref<ApplicantInfo | null>(null);
const btbList = ref<BTBRecord[]>([]);

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

// Navigation handlers
const navigateToSearch = () => {
  router.push('/BF-TNI/pengeluaran-tunai-kaunter/permohonan/search');
};

const handleCashWithdrawal = (record: BTBRecord) => {
  router.push(
    `/BF-TNI/pengeluaran-tunai-kaunter/permohonan/form/${record.paNumber}`
  );
};

const handleConfirmDisbursement = (record: BTBRecord) => {
  router.push(
    `/BF-TNI/pengeluaran-tunai-kaunter/permohonan/sahkan/${record.paNumber}`
  );
};

// Load data
onMounted(async () => {
  const icNumber = route.query.icNumber as string;
  if (!icNumber) {
    router.push('/BF-TNI/pengeluaran-tunai-kaunter/permohonan/search');
    return;
  }

  try {
    // TODO: Implement API call to fetch applicant info and BTB list
    // Mock data for now
    applicantInfo.value = {
      icNumber: icNumber,
      name: "Ahmad bin Abdullah",
      asnafStatus: "Aktif",
      asnafCategory: "Fakir",
    };

    btbList.value = [
      {
        paNumber: "PA-2024-001",
        receiptDate: new Date().toISOString(),
        amount: 1000.0,
        category: "Bantuan Bulanan",
        status: "Belum Permohonan",
      },
      {
        paNumber: "PA-2024-002",
        receiptDate: new Date().toISOString(),
        amount: 500.0,
        category: "Bantuan Khas",
        status: "Diluluskan",
      },
    ];

    tableKey.value++;
  } catch (error) {
    console.error("Error loading data:", error);
  }
});
</script>

<style lang="scss" scoped>
// Add any custom styles here
</style> 