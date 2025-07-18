<template>
  <div v-if="isReady">
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Senarai Bantuan Tunai Bulanan (Bayaran Tunai)</h2>
          <rs-button variant="primary-outline" @click="navigateToSearch">
            <Icon name="material-symbols:arrow-back" class="mr-1" size="15" />
            Kembali ke Semakan
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
        
        <!-- Search and Filter Section -->
        <div class="mb-6">
          <div class="flex flex-col md:flex-row gap-4">
            <div class="flex-1">
              <FormKit
                v-model="searchQuery"
                type="text"
                placeholder="Cari No PA, Nama Bantuan, atau Status..."
                :classes="{ input: '!py-2' }"
              />
            </div>
            <div class="flex gap-2">
              <FormKit
                v-model="filters.status"
                type="select"
                :options="statusOptions"
                :classes="{ input: '!py-2' }"
              />
            </div>
          </div>
        </div>

        <!-- Status Pilihan Semasa & Reset -->
      <div v-if="selectedRows.length > 0" class="flex items-center justify-between mb-4 px-1">
        <div class="text-sm text-gray-700">
          ✅ <span class="font-medium">Sedang pilih:</span>
          <rs-badge :variant="getStatusVariant(selectedStatus)">
            {{ selectedStatus }} ({{ selectedRows.length }} rekod)
          </rs-badge>
        </div>
        <rs-button variant="danger-outline" size="sm" @click="resetSelection">
          Reset Pilihan
        </rs-button>
      </div>

      <!-- Butang Tindakan Bulk -->
      <div v-if="selectedRows.length > 0" class="mt-2 flex justify-end gap-2">
        <rs-button
          v-if="selectedStatus === 'Belum Serahan'"
          variant="primary"
          @click="handleBulkCashWithdrawal"
        >
          <Icon name="material-symbols:payments" class="mr-1" size="16" />
          Mohon Pengeluaran Tunai (Bulk)
        </rs-button>

        <rs-button
          v-if="selectedStatus === 'Diluluskan'"
          variant="success"
          @click="handleBulkConfirmDisbursement"
        >
          <Icon name="material-symbols:check-circle" class="mr-1" size="16" />
          Sahkan Agihan (Bulk)
        </rs-button>
      </div>



        <!-- BTB Listing Table -->
        <rs-table
          :data="paginatedList"
          :key="tableKey"
          :pageSize="pageSize"
          :showNoColumn="false"
          :options="{ variant: 'default' }"
        >
          <template v-slot:no="{ value }">
            <template v-if="value.statusSerahan !== 'Telah Diagih'">
              <input
                type="checkbox"
                class="form-checkbox h-4 w-4 text-primary-600"
                :value="value.noPA"
                :checked="selectedRows.includes(value.noPA)"
                @change="onCheckboxChange($event, value)"
              />
            </template>
          </template>
          <template v-slot:noPA="{ text }">
            {{ text }}
          </template> 

          <template v-slot:jumlah="{ text }">
            RM {{ formatAmount(parseFloat(text)) }}
          </template>
          <template v-slot:namaBantuan="{ text }">
            {{ text }}
          </template>
          <template v-slot:statusSerahan="{ value }">
            <rs-badge :variant="getStatusVariant(value.statusSerahan)">
              {{ value.statusSerahan }}
            </rs-badge>
          </template>
          <template v-slot:tindakan="{ value }">
            <div class="flex gap-2">
              <rs-button
                v-if="value.statusSerahan === 'Belum Serahan'"
                variant="primary"
                size="sm"
                @click="handleCashWithdrawal(value)"
              >
                <Icon name="material-symbols:payments" class="mr-1" size="15" />
                Mohon Pengeluaran Tunai
              </rs-button>
              <rs-button
                v-if="value.statusSerahan === 'Diluluskan'"
                variant="success"
                size="sm"
                @click="handleConfirmDisbursement(value)"
              >
                <Icon name="material-symbols:check-circle" class="mr-1" size="15" />
                Sahkan Agihan
              </rs-button>
            </div>
          </template>
        </rs-table>

        <!-- Pagination -->
        <div class="flex items-center justify-between px-5 mt-4">
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-700">Baris per halaman:</span>
            <FormKit
              v-model="pageSize"
              type="select"
              :options="[5, 10, 25]"
              :classes="{ wrapper: 'w-20', input: '!rounded-lg' }"
            />
          </div>
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-700">
              Menunjukkan {{ paginationStart }} hingga {{ paginationEnd }} daripada {{ totalRows }} entri
            </span>
            <div class="flex gap-1">
              <rs-button
                variant="primary-outline"
                class="!p-1 !w-8 !h-8"
                :disabled="currentPage === 1"
                @click="currentPage--"
              >
                <Icon name="ic:round-keyboard-arrow-left" />
              </rs-button>
              <rs-button
                variant="primary-outline"
                class="!p-1 !w-8 !h-8"
                :disabled="currentPage === totalPages"
                @click="currentPage++"
              >
                <Icon name="ic:round-keyboard-arrow-right" />
              </rs-button>
            </div>
          </div>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const isReady = ref(false);
const tableKey = ref(0);
const searchQuery = ref('');
const filters = ref({ status: '' });
const pageSize = ref(10);
const currentPage = ref(1);

const applicantInfo = ref(null);
const btbList = ref([]);

const breadcrumb = ref([
  { name: "Pengeluaran Tunai Kaunter", type: "link", path: "/BF-TNI/pengeluaran-tunai-kaunter" },
  { name: "Permohonan", type: "link", path: "/BF-TNI/pengeluaran-tunai-kaunter/permohonan" },
  { name: "Senarai Bantuan Tunai Bulanan", type: "current" },
]);

const statusOptions = [
  { label: 'Semua', value: '' },
  { label: 'Belum Serahan', value: 'Belum Serahan' },
  { label: 'Tunggu Kelulusan', value: 'Tunggu Kelulusan' },
  { label: 'Diluluskan', value: 'Diluluskan' },
  { label: 'Ditolak', value: 'Ditolak' },
  { label: 'Telah Diagih', value: 'Telah Diagih' },
];

const formatAmount = (amount) => {
  return new Intl.NumberFormat("ms-MY", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

const getStatusVariant = (status) => {
  const variants = {
    "Belum Serahan": "warning",
    "Tunggu Kelulusan": "info",
    "Diluluskan": "success",
    "Ditolak": "danger",
    "Telah Diagih": "default",
  };
  return variants[status] || "default";
};

const navigateToSearch = () => {
  router.push("/BF-TNI/pengeluaran-tunai-kaunter/permohonan");
};

const handleCashWithdrawal = (record) => {
  router.push(`/BF-TNI/pengeluaran-tunai-kaunter/permohonan/form/${record.noPA}`);
};

const handleConfirmDisbursement = (record) => {
  router.push(`/BF-TNI/pengeluaran-tunai-kaunter/permohonan/sahkan/${record.noPA}`);
};

const filteredList = computed(() => {
  let result = [...btbList.value];
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    result = result.filter(item =>
      item.noPA.toLowerCase().includes(q) ||
      item.namaBantuan.toLowerCase().includes(q) ||
      item.statusSerahan.toLowerCase().includes(q)
    );
  }
  if (filters.value.status) {
    result = result.filter(item => item.statusSerahan === filters.value.status);
  }
  return result;
});

const totalRows = computed(() => filteredList.value.length);
const totalPages = computed(() => Math.ceil(totalRows.value / pageSize.value));
const paginationStart = computed(() => (currentPage.value - 1) * pageSize.value + 1);
const paginationEnd = computed(() =>
  Math.min(currentPage.value * pageSize.value, totalRows.value)
);
const paginatedList = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredList.value.slice(start, end);
});

onMounted(() => {
  const ic = route.query.icNumber || 'DEFAULT_IC';
  applicantInfo.value = {
    icNumber: ic,
    name: "Ahmad bin Abdullah",
    asnafStatus: "Aktif",
    asnafCategory: "Fakir",
  };

  btbList.value = [
    {
      no: 1,
      noPA: "PA-2024-001",
      tarikhResit: new Date().toISOString(),
      jumlah: 400.0,
      namaBantuan: "B105 - Bantuan Kewangan Bulanan",
      statusSerahan: "Belum Serahan",
      tindakan: ""
    },
    /* {
      no: 2,
      noPA: "PA-2024-003",
      tarikhResit: new Date().toISOString(),
      jumlah: 150.0,
      namaBantuan: "Bantuan Pendidikan",
      statusSerahan: "Diluluskan",
      tindakan: ""
    }, */
    {
      no: 3,
      noPA: "PA-2024-004",
      tarikhResit: new Date().toISOString(),
      jumlah: 400.0,
      namaBantuan: "B105 - Bantuan Kewangan Bulanan",
      statusSerahan: "Belum Serahan",
      tindakan: ""
    },
    /* {
      no: '',
      noPA: "PA-2024-005",
      tarikhResit: new Date().toISOString(),
      jumlah: 800.0,
      namaBantuan: "Bantuan Hari Raya",
      statusSerahan: "Telah Diagih",
      tindakan: ""
    }, */
  ];
  isReady.value = true;
  tableKey.value++;
});

const selectedRows = ref([]);
const selectedStatus = ref("");

const toggleSelection = (noPA, statusSerahan) => {
  const isSelected = selectedRows.value.includes(noPA);

  if (selectedRows.value.length === 0) {
    selectedRows.value.push(noPA);
    selectedStatus.value = statusSerahan;
  } else if (statusSerahan === selectedStatus.value) {
    if (isSelected) {
      selectedRows.value = selectedRows.value.filter(id => id !== noPA);
      if (selectedRows.value.length === 0) selectedStatus.value = '';
    } else {
      selectedRows.value.push(noPA);
    }
  } else {
    alert(`Anda hanya boleh pilih rekod dengan status "${selectedStatus.value}" sahaja.`);
    // Auto-untick balik checkbox jika bercanggah status
    const checkbox = document.querySelector(`input[type=checkbox][value="${noPA}"]`);
    if (checkbox) checkbox.checked = false;
  }
};


const resetSelection = () => {
  selectedRows.value = [];
  selectedStatus.value = "";
};

const onCheckboxChange = (event, row) => {
  const isChecked = event.target.checked;
  const { noPA, statusSerahan } = row;

  if (selectedRows.value.length === 0) {
    selectedRows.value.push(noPA);
    selectedStatus.value = statusSerahan;
  } else if (statusSerahan === selectedStatus.value) {
    if (isChecked) {
      if (!selectedRows.value.includes(noPA)) {
        selectedRows.value.push(noPA);
      }
    } else {
      selectedRows.value = selectedRows.value.filter(id => id !== noPA);
      if (selectedRows.value.length === 0) selectedStatus.value = '';
    }
  } else {
    // ❗ Status tidak seragam, reset checkbox automatik
    alert(`Anda hanya boleh pilih rekod dengan status "${selectedStatus.value}" sahaja.`);
    event.target.checked = false;
  }
};

const handleBulkCashWithdrawal = () => {
  alert(`Pengeluaran Tunai akan diproses untuk: ${selectedRows.value.join(', ')}`);
  // TODO: Replace with actual API or navigation
  // router.push(`/BF-TNI/....?bulk=${selectedRows.value.join(',')}`);
};

const handleBulkConfirmDisbursement = () => {
  alert(`Agihan akan disahkan untuk: ${selectedRows.value.join(', ')}`);
  // TODO: Replace with actual API
};


</script>
