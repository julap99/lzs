<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Senarai Permohonan Pengeluaran Tunai</h2>
        </div>
      </template>

      <template #body>
        <!-- Search & Filter -->
        <div class="mb-6 flex flex-col md:flex-row gap-4">
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

        <!-- Jadual Permohonan -->
        <rs-table
          :data="paginatedList"
          :key="tableKey"
          :pageSize="pageSize"
          :showNoColumn="true"
          :options="{ variant: 'default' }"
        >
          <template v-slot:noPA="{ text }">
            {{ text }}
          </template>

           <template v-slot:nama="{ text }">
            {{ text }}
          </template>

           <template v-slot:ic="{ text }">
            {{ text }}
          </template>

          <template v-slot:jumlah="{ text }">
            RM {{ formatAmount(parseFloat(text)) }}
          </template>

          <template v-slot:status="{ value }">
            <rs-badge :variant="getStatusVariant(value.status)">
              {{ value.status }}
            </rs-badge>
          </template>

          <template v-slot:tindakan="{ value }">
            <div class="flex gap-2">
              <rs-button
                v-if="value.status === 'Belum Serahan'"
                variant="primary"
                size="sm"
                @click="handleReview(value)"
              >
                <Icon name="material-symbols:payments" class="mr-1" size="15" />
                Mohon Pengeluaran Tunai
              </rs-button>
              <rs-button
                v-if="value.status === 'Diluluskan'"
                variant="success"
                size="sm"
                @click="handleApprove(value)"
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
import { useRouter } from 'vue-router';

const router = useRouter();
const tableKey = ref(0);
const searchQuery = ref('');
const filters = ref({ status: '' });
const pageSize = ref(10);
const currentPage = ref(1);

const permohonanList = ref([
  {
    noPA: 'PA-2024-101',
    nama: 'Ahmad bin Hassan',
    ic: '900101065533',
    jumlah: 1000,
    namaBantuan: 'Bantuan Kewangan Bulanan',
    status: 'Tunggu Kelulusan',
    tindakan: ''
  },
  {
    noPA: 'PA-2024-102',
    nama: 'Nurul Aisyah binti Ismail',
    ic: '910202085522',
    jumlah: 850,
    namaBantuan: 'Bantuan Pendidikan',
    status: 'Diluluskan',
    tindakan: ''
  },
  {
    noPA: 'PA-2024-103',
    nama: 'Zulkifli bin Omar',
    ic: '851231055512',
    jumlah: 500,
    namaBantuan: 'Bantuan Ramadhan',
    status: 'Tunggu Kelulusan',
    tindakan: ''
  },
  {
    noPA: 'PA-2024-104',
    nama: 'Siti Aminah binti Kamal',
    ic: '890908105566',
    jumlah: 600,
    namaBantuan: 'Bantuan Sewa Rumah',
    status: 'Ditolak',
    tindakan: ''
  },
  {
    noPA: 'PA-2024-105',
    nama: 'Hafiz bin Ahmad',
    ic: '920715065422',
    jumlah: 700,
    namaBantuan: 'Bantuan Keperluan Asas',
    status: 'Telah Diagih',
    tindakan: ''
  }
]);


const statusOptions = [
  { label: 'Semua', value: '' },
  { label: 'Belum Serahan', value: 'Belum Serahan' },
  { label: 'Diluluskan', value: 'Diluluskan' },
];

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


const formatAmount = (value) => {
  return new Intl.NumberFormat('ms-MY', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value || 0);
};

const filteredList = computed(() => {
  let result = [...permohonanList.value];
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    result = result.filter(item =>
      item.noPA.toLowerCase().includes(q) ||
      item.namaBantuan.toLowerCase().includes(q) ||
      item.status.toLowerCase().includes(q)
    );
  }
  if (filters.value.status) {
    result = result.filter(item => item.status === filters.value.status);
  }
  return result;
});

const totalRows = computed(() => filteredList.value.length);
const totalPages = computed(() => Math.ceil(totalRows.value / pageSize.value));
const paginationStart = computed(() => (currentPage.value - 1) * pageSize.value + 1);
const paginationEnd = computed(() => Math.min(currentPage.value * pageSize.value, totalRows.value));
const paginatedList = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredList.value.slice(start, end);
});

const handleReview = (record) => {
  router.push(`/BF-TNI/permohonan/${record.noPA}/form`);
};

const handleApprove = (record) => {
   router.push(`/BF-TNI/pengeluaran-tunai-kaunter/permohonan/sahkan/${record.noPA}`);
};
</script>

<style scoped></style>
