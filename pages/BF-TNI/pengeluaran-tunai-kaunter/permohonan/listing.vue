<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Senarai Bantuan Tunai Bulanan</h2>
          <rs-button variant="primary-outline" @click="navigateToSearch">
            <Icon name="material-symbols:arrow-back" class="mr-1" size="15" />
            Kembali ke Carian
          </rs-button>
        </div>
      </template>

      <template #body>
        <!-- Applicant Info Summary -->
        <rs-card v-if="applicantInfo" class="mb-6">
          <template #header>
            <div class="flex justify-between items-center">
              <h3 class="text-lg font-semibold">Maklumat Pemohon</h3>
            </div>
          </template>

          <template #body>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >No Kad Pengenalan Pemohon</label
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
            </div>
          </template>
        </rs-card>

        <!-- BTB Listing Table -->
        <rs-table
          :data="btbList"
          :key="tableKey"
          :pageSize="10"
          :showNoColumn="true"
          :options="{
            variant: 'default',
          }"
        >
          <template v-slot:noPA="data">
            {{ data.text }}
          </template>
          <template v-slot:jumlah="data">
            RM {{ formatAmount(parseFloat(data.text)) }}
          </template>
          <template v-slot:status="data: { value: BTBRecord }">
            <rs-badge :variant="getStatusVariant(data.value.status)">
              {{ data.value.status }}
            </rs-badge>
          </template>
          <template v-slot:tindakan="data: { value: BTBRecord }">
            <div class="flex gap-2">
              <rs-button
                v-if="data.value.status === 'Belum Permohonan'"
                variant="primary"
                size="sm"
                @click="handleCashWithdrawal(data.value)"
              >
                <Icon name="material-symbols:payments" class="mr-1" size="15" />
                Mohon Pengeluaran Tunai
              </rs-button>
              <rs-button
                v-if="data.value.status === 'Diluluskan'"
                variant="success"
                size="sm"
                @click="handleConfirmDisbursement(data.value)"
              >
                <Icon
                  name="material-symbols:check-circle"
                  class="mr-1"
                  size="15"
                />
                Sahkan Agihan
              </rs-button>
              <!-- <rs-button
                v-if="['Ditolak', 'Telah Diagih'].includes(data.value.status)"
                variant="secondary"
                size="sm"
                @click="handleViewDetails(data.value)"
              >
                <Icon
                  name="material-symbols:visibility"
                  class="mr-1"
                  size="15"
                />
                Lihat Butiran
              </rs-button> -->
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
  noPA: string;
  tarikhResit: string;
  jumlah: number;
  kategori: string;
  status: string;
  tindakan: number;
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

const breadcrumb = ref([
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
    name: "Senarai Bantuan Tunai Bulanan",
    type: "current",
    path: "/BF-TNI/pengeluaran-tunai-kaunter/permohonan/listing",
  },
]);

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

const getStatusVariant = (status: string) => {
  switch (status) {
    case "Belum Permohonan":
      return "warning";
    case "Tunggu Kelulusan":
      return "info";
    case "Diluluskan":
      return "success";
    case "Ditolak":
      return "danger";
    case "Telah Diagih":
      return "default";
    default:
      return "default";
  }
};

// Navigation handlers
const navigateToSearch = () => {
  router.push("/BF-TNI/pengeluaran-tunai-kaunter/permohonan");
};

const handleCashWithdrawal = (record: BTBRecord) => {
  router.push(
    `/BF-TNI/pengeluaran-tunai-kaunter/permohonan/form/${record.noPA}`
  );
};

const handleConfirmDisbursement = (record: BTBRecord) => {
  router.push(
    `/BF-TNI/pengeluaran-tunai-kaunter/permohonan/sahkan/${record.noPA}`
  );
};

const handleViewDetails = (record: BTBRecord) => {
  router.push(
    `/BF-TNI/pengeluaran-tunai-kaunter/permohonan/view/${record.noPA}`
  );
};

// Load data
onMounted(async () => {
  const icNumber = route.query.icNumber as string;

  console.log("route query: ", route.query);

  // if (!icNumber) {
  //   router.push('/BF-TNI/pengeluaran-tunai-kaunter/permohonan/search');
  //   return;
  // }

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
        noPA: "PA-2024-001",
        tarikhResit: new Date().toISOString(),
        jumlah: 1000.0,
        kategori: "Bantuan Bulanan",
        status: "Belum Permohonan",
        tindakan: 1,
      },
      {
        noPA: "PA-2024-002",
        tarikhResit: new Date().toISOString(),
        jumlah: 500.0,
        kategori: "Bantuan Khas",
        status: "Tunggu Kelulusan",
        tindakan: 2,
      },
      {
        noPA: "PA-2024-003",
        tarikhResit: new Date().toISOString(),
        jumlah: 750.0,
        kategori: "Bantuan Bulanan",
        status: "Diluluskan",
        tindakan: 3,
      },
      {
        noPA: "PA-2024-004",
        tarikhResit: new Date().toISOString(),
        jumlah: 300.0,
        kategori: "Bantuan Khas",
        status: "Ditolak",
        tindakan: 4,
      },
      {
        noPA: "PA-2024-005",
        tarikhResit: new Date().toISOString(),
        jumlah: 1200.0,
        kategori: "Bantuan Bulanan",
        status: "Telah Diagih",
        tindakan: 5,
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
