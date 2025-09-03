<template>
  <div>

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Senarai Bantuan</h2>
        </div>
      </template>

      <template #body>
        <!-- <div class="mb-6">
          <div class="flex flex-col md:flex-row gap-4">
            <div class="flex-1">
              <FormKit
                v-model="searchQuery"
                type="text"
                placeholder="Cari No Bantuan, Nama Pemohon..."
                :classes="{
                  input: '!py-2',
                }"
              />
            </div>
          </div>
        </div> -->

        <!-- Main Table -->
        <RsTable
          :data="tableDataWithNo"
          :columns="columns"
          advanced
          :showSearch="true"
          :showFilter="true"
          :showNoColumn="false"
          :options="{
            variant: 'default',
            striped: true,
            bordered: false,
            borderless: false,
            hover: true
          }"
          :optionsAdvanced="{
                sortable: true,
                filterable: true,
                responsive: true,
                outsideBorder: true
              }"
        >
          <!-- Custom column templates -->
          <template v-slot:no="{ value, index }">
            <div class="flex items-center gap-2">
              <span>{{ value.no }}</span>
            </div>
          </template>

          <template v-slot:maklumatBantuan="{ text }">
            <div>{{ text }}</div>
          </template>

          <template v-slot:namaPemohon="{ text }">
            <div>{{ text }}</div>
          </template>

          <template v-slot:noKPPemohon="{ text }">
            <div>{{ text }}</div>
          </template>

          <template v-slot:namaPenerima="{ text }">
            <div>{{ text }}</div>
          </template>

          <template v-slot:tarikhMohon="{ text }">
            <div>{{ formatDate(text) }}</div>
          </template>

          <template v-slot:status="{ text }">
            <rs-badge :variant="statusVariant(text)" :icon="statusIcon(text)">
              {{ prettyStatus(text) }}
            </rs-badge>
          </template>

         <template v-slot:tindakan="{ text }">
            <rs-button
              variant="ghost"
              size="sm"
              class="p-1 flex flex-col items-center bg-transparent border-0 shadow-none text-blue-600 hover:text-blue-800"
              @click="handleTindakan(text.noBantuan)"
            >
              <!-- Plus Icon -->
              <Icon name="material-symbols:add" size="24" class="mb-2" />

              <!-- Label that shows on hover -->
              <span class="absolute left-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Mohon Tuntutan
              </span>
            </rs-button>
          </template>




        </RsTable>

        <!-- Pagination -->
        <div class="flex items-center justify-between px-5 mt-4">
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-700">Baris per halaman:</span>
            <FormKit
              v-model="pageSize"
              type="select"
              :options="[10, 25, 50]"
              :classes="{
                wrapper: 'w-20',
                outer: 'mb-0',
                input: '!rounded-lg',
              }"
            />
          </div>
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-700">
              Menunjukkan {{ paginationStart }} hingga
              {{ paginationEnd }} daripada {{ totalBantuan }} entri
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

    <!-- Bulk Approval Button at Bottom -->
    <div v-if="selectedRows.length > 0" class="mt-4 flex justify-end">
      <rs-button
        variant="success"
        @click="handleBulkApproval"
        :disabled="processing"
      >
        <Icon name="material-symbols:approval" class="w-4 h-4 mr-1" />
        Pengesahan (Bulk) ({{ selectedRows.length }})
      </rs-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useNuxtApp, navigateTo } from '#app'
definePageMeta({
  title: 'Senarai Bantuan',
});

const breadcrumb = ref([
  {
    name: 'Bantuan',
    type: 'link',
    path: '/bantuan',
  },
  {
    name: 'Senarai Bantuan',
    type: 'current',
    path: '/bantuan/senarai',
  },
]);

// Table columns configuration
const columns = [
  { key: 'no', label: 'No.' }, // add this if you want to show your computed "no"
  { key: 'noBantuan', label: 'No. Bantuan', sortable: true },
  { key: 'maklumatBantuan', label: 'Maklumat Bantuan', sortable: true },
  { key: 'namaPemohon', label: 'Nama Pemohon', sortable: true },
  { key: 'noKPPemohon', label: 'No. KP Pemohon', sortable: true },
  { key: 'namaPenerima', label: 'Nama Penerima', sortable: true },
  { key: 'tarikhMohon', label: 'Tarikh Mohon', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'tindakan', label: 'Tindakan', sortable: false },
];

const searchQuery = ref('');
const filters = ref({ status: '' });
const pageSize = ref(10);
const currentPage = ref(1);
const selectedRows = ref([]);
const processing = ref(false);

// Options for filters
const statusOptions = [
  { label: 'Semua Status', value: '' },
  { label: 'Diluluskan', value: 'Diluluskan' },
  { label: 'Ditolak', value: 'Ditolak' },
];

// Sample data - in real app, this would come from an API
const bantuanList = ref([
  {
    noBantuan: 'APP-2025-001481',
    maklumatBantuan: '(HQ)PE<BAngunan Pendidikan OKU',
    namaPemohon: 'MOHD FARHAN BIN ALI',
    noKPPemohon: '940511146045',
    namaPenerima: 'KIDDOS PLAY LAB REHAB CENTRE',
    tarikhMohon: new Date().toISOString(),
    status: 'LULUS',
    tindakan: { noBantuan: 'APP-2025-001481', status: 'LULUS' }
  },
  {
    noBantuan: 'APP-2025-001482',
    maklumatBantuan: '(HQ)PE<BAngunan Pendidikan OKU',
    namaPemohon: 'ALI BIN MOHAMED',
    noKPPemohon: '850610146523',
    namaPenerima: 'SCHOOL OF EXCELLENCE',
    tarikhMohon: new Date(Date.now() - 86400000).toISOString(),
    status: 'DILULUSKAN',
    tindakan: { noBantuan: 'APP-2025-001482', status: 'DILULUSKAN' }
  },
  {
    noBantuan: 'APP-2025-001483',
    maklumatBantuan: '(HQ)PE<BAngunan Pendidikan OKU',
    namaPemohon: 'FATIMAH BINTI AHMAD',
    noKPPemohon: '920511146555',
    namaPenerima: 'LEARNING CENTER OF ASIA',
    tarikhMohon: new Date(Date.now() - 172800000).toISOString(),
    status: 'TUNGGU',
    tindakan: { noBantuan: 'APP-2025-001483', status: 'TUNGGU' }
  },
  {
    noBantuan: 'APP-2025-001484',
    maklumatBantuan: '(HQ)PE<BAngunan Pendidikan OKU',
    namaPemohon: 'ZAINAB BINTI MOHD',
    noKPPemohon: '940211146012',
    namaPenerima: 'PUSAT PENDIDIKAN MALAYSIA',
    tarikhMohon: new Date(Date.now() - 259200000).toISOString(),
    status: 'DILULUSKAN',
    tindakan: { noBantuan: 'APP-2025-001484', status: 'DILULUSKAN' }
  },
  {
    noBantuan: 'APP-2025-001485',
    maklumatBantuan: '(HQ)PE<BAngunan Pendidikan OKU',
    namaPemohon: 'ABDUL RAZAK BIN ABU',
    noKPPemohon: '940801146089',
    namaPenerima: 'SCHOOL OF INTEGRATED LEARNING',
    tarikhMohon: new Date(Date.now() - 345600000).toISOString(),
    status: 'DITOLAK',
    tindakan: { noBantuan: 'APP-2025-001485', status: 'DITOLAK' }
  },
  {
    noBantuan: 'APP-2025-001486',
    maklumatBantuan: '(HQ)PE<BAngunan Pendidikan OKU',
    namaPemohon: 'MOHAMAD FIRDAUS BIN ZULKIFLI',
    noKPPemohon: '890509146211',
    namaPenerima: 'KIDS EDUCATION CENTRE',
    tarikhMohon: new Date(Date.now() - 432000000).toISOString(),
    status: 'LULUS',
    tindakan: { noBantuan: 'APP-2025-001486', status: 'LULUS' }
  },
  {
    noBantuan: 'APP-2025-001487',
    maklumatBantuan: '(HQ)PE<BAngunan Pendidikan OKU',
    namaPemohon: 'AHMAD NASRUL BIN ZAHARI',
    noKPPemohon: '880210146321',
    namaPenerima: 'HARMONY SCHOOL OF LEARNING',
    tarikhMohon: new Date(Date.now() - 518400000).toISOString(),
    status: 'TUNGGU',
    tindakan: { noBantuan: 'APP-2025-001487', status: 'TUNGGU' }
  },
  {
    noBantuan: 'APP-2025-001488',
    maklumatBantuan: '(HQ)PE<BAngunan Pendidikan OKU',
    namaPemohon: 'SARAH BINTI ABDULLAH',
    noKPPemohon: '920708146788',
    namaPenerima: 'LEARNING ADVANCEMENT SCHOOL',
    tarikhMohon: new Date(Date.now() - 604800000).toISOString(),
    status: 'DILULUSKAN',
    tindakan: { noBantuan: 'APP-2025-001488', status: 'DILULUSKAN' }
  },
  {
    noBantuan: 'APP-2025-001489',
    maklumatBantuan: '(HQ)PE<BAngunan Pendidikan OKU',
    namaPemohon: 'FATIMAH BINTI RAZAK',
    noKPPemohon: '880311146134',
    namaPenerima: 'PUSAT PENDIDIKAN KUALA LUMPUR',
    tarikhMohon: new Date(Date.now() - 691200000).toISOString(),
    status: 'DITOLAK',
    tindakan: { noBantuan: 'APP-2025-001489', status: 'DITOLAK' }
  },
  {
    noBantuan: 'APP-2025-001490',
    maklumatBantuan: '(HQ)PE<BAngunan Pendidikan OKU',
    namaPemohon: 'MOHD AZRUL BIN ISMAIL',
    noKPPemohon: '950211146232',
    namaPenerima: 'SCHOOL OF VISIONARY EDUCATION',
    tarikhMohon: new Date(Date.now() - 777600000).toISOString(),
    status: 'LULUS',
    tindakan: { noBantuan: 'APP-2025-001490', status: 'LULUS' }
  }
]);


// Computed properties
const filteredBantuan = computed(() => {
  let filtered = [...bantuanList.value];

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(item => 
      item.noBantuan.toLowerCase().includes(query) ||
      item.namaPemohon.toLowerCase().includes(query)
    );
  }

  if (filters.value.status) {
    filtered = filtered.filter(item => 
      item.status === filters.value.status
    );
  }

  return filtered;
});

const totalBantuan = computed(() => filteredBantuan.value.length);
const totalPages = computed(() => Math.ceil(totalBantuan.value / pageSize.value));
const paginationStart = computed(() => ((currentPage.value - 1) * pageSize.value) + 1);
const paginationEnd = computed(() => Math.min(currentPage.value * pageSize.value, totalBantuan.value));

const tableDataWithNo = computed(() =>
  filteredBantuan.value.map((row, idx) => {
    return Object.assign({ no: idx + 1 }, row);
  })
);

// Methods
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('ms-MY');
};

// Helpers for status badge
const normalizeStatus = (s) => (s ?? '').toString().trim().toUpperCase();

const statusVariant = (status) => {
  switch (normalizeStatus(status)) {
    case 'LULUS':
    case 'DILULUSKAN':
      return 'success';
    case 'DALAM SEMAKAN':
    case 'TUNGGU':
    case 'PENDING':
      return 'warning';
    case 'DITOLAK':
    case 'TIDAK LULUS':
      return 'danger';
    default:
      return 'info';
  }
};

const prettyStatus = (status) => {
  switch (normalizeStatus(status)) {
    case 'DILULUSKAN': return 'Diluluskan';
    case 'LULUS': return 'Lulus';
    case 'DALAM SEMAKAN': return 'Dalam Semakan';
    case 'TUNGGU': return 'Tunggu';
    case 'PENDING': return 'Pending';
    case 'DITOLAK': return 'Ditolak';
    case 'TIDAK LULUS': return 'Tidak Lulus';
    default: return status || '-';
  }
};

const statusIcon = (status) => {
  switch (normalizeStatus(status)) {
    case 'LULUS':
    case 'DILULUSKAN':
      return 'material-symbols:check-circle-rounded';
    case 'DALAM SEMAKAN':
    case 'TUNGGU':
    case 'PENDING':
      return 'material-symbols:schedule';
    case 'DITOLAK':
    case 'TIDAK LULUS':
      return 'material-symbols:cancel-rounded';
    default:
      return '';
  }
};


const handleTindakan = (noBantuan) => {
  navigateTo(`/BF-BTN/tuntutan-dengan-siasatan/mohon-tuntutan`);
};

const handleBulkApproval = async () => {
  try {
    processing.value = true;
    const result = await $swal.fire({
      icon: 'question',
      title: 'Pengesahan (Bulk)',
      text: `Adakah anda pasti untuk mengesahkan ${selectedRows.value.length} bantuan yang dipilih?`,
      showCancelButton: true,
      confirmButtonText: 'Ya, Sahkan',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#10b981',
    });
    if (result.isConfirmed) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      await $swal.fire({
        icon: 'success',
        title: 'Berjaya!',
        text: `Semua permohonan yang dipilih telah berjaya disahkan`,
        confirmButtonText: 'OK'
      });
      selectedRows.value = [];
    }
  } catch (error) {
    await $swal.fire({
      icon: 'error',
      title: 'Ralat',
      text: 'Ralat telah berlaku semasa memproses pengesahan bulk',
      confirmButtonText: 'OK'
    });
  } finally {
    processing.value = false;
  }
};
</script>

<style lang="scss" scoped>
/* Add any custom styles here if needed */
</style>
