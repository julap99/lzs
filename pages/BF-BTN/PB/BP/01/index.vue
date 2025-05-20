<template>
  <div class="">
    <LayoutsBreadcrumb :items="breadcrumb" />

    <div class="mb-6">
      <h1 class="text-2xl font-semibold text-gray-900">
        Senarai Pemohon Bantuan
      </h1>
      <p class="mt-2 text-sm text-gray-600">
        Semak dan sahkan senarai pemohon bantuan yang telah didaftarkan melalui
        proses integrasi
      </p>
    </div>

    <rs-card class="py-5">
      <FormKit
        type="form"
        :classes="{
          messages: 'px-5',
        }"
        :actions="false"
        @submit="handleApprove"
      >
        <div
          class="flex flex-col md:flex-row justify-between items-start md:items-center gap-y-2 mb-5 px-5"
        >
          <div>
            <h5 class="font-semibold">Senarai Pemohon</h5>
            <span class="text-sm text-gray-500">
              Pilih pemohon yang layak untuk diteruskan ke peringkat kelulusan
            </span>
          </div>

          <div class="flex gap-3">
            <rs-button
              variant="primary-outline"
              class="mb-4"
              @click="handleSelectAll"
            >
              {{ isAllSelected ? "Tidak Pilih Semua" : "Pilih Semua" }}
            </rs-button>
            <rs-button
              btnType="submit"
              class="mb-4"
              :disabled="!selectedApplicants.length"
              @click="handleApprove"
            >
              Sahkan Senarai
            </rs-button>
          </div>
        </div>

        <div class="px-5 mb-4">
          <div
            class="flex flex-col md:flex-row gap-4 items-start md:items-center"
          >
            <FormKit
              v-model="searchQuery"
              type="search"
              placeholder="Cari pemohon..."
              :classes="{
                wrapper: 'w-full md:w-64',
                outer: 'mb-0',
                input: '!rounded-lg',
              }"
            />
            <div class="flex gap-2">
              <rs-button
                variant="primary-outline"
                class="!px-3"
                @click="isFilterOpen = !isFilterOpen"
              >
                <Icon name="ic:outline-filter-alt" class="mr-1" size="1rem" />
                <span>Penapis</span>
              </rs-button>
              <rs-button
                variant="primary-outline"
                class="!px-3"
                @click="handleRefresh"
              >
                <Icon name="ic:outline-refresh" class="mr-1" size="1rem" />
                <span>Segar Semula</span>
              </rs-button>
            </div>
          </div>

          <!-- Filter Panel -->
          <div v-if="isFilterOpen" class="mt-4 p-4 bg-gray-50 rounded-lg">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormKit
                v-model="filters.status"
                type="select"
                label="Status"
                :options="statusOptions"
                :classes="{
                  outer: 'mb-0',
                  input: '!rounded-lg',
                }"
              />
              <FormKit
                v-model="filters.aidType"
                type="select"
                label="Jenis Bantuan"
                :options="aidTypeOptions"
                :classes="{
                  outer: 'mb-0',
                  input: '!rounded-lg',
                }"
              />
              <FormKit
                v-model="filters.batchNumber"
                type="select"
                label="No. Batch"
                :options="batchOptions"
                :classes="{
                  outer: 'mb-0',
                  input: '!rounded-lg',
                }"
              />
            </div>
          </div>
        </div>

        <div class="relative overflow-x-auto">
          <table class="w-full text-sm text-left">
            <thead class="text-xs uppercase bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3">
                  <div class="flex items-center">
                    <FormKit
                      v-model="isAllSelected"
                      type="checkbox"
                      :classes="{
                        wrapper: 'mb-0',
                        outer: 'mb-0',
                        input: 'icon-check rounded',
                      }"
                      @change="handleSelectAll"
                    />
                  </div>
                </th>
                <th scope="col" class="px-6 py-3">Nama Pemohon</th>
                <th scope="col" class="px-6 py-3">Jenis Bantuan</th>
                <th scope="col" class="px-6 py-3">Status</th>
                <th scope="col" class="px-6 py-3">No. Batch</th>
                <th scope="col" class="px-6 py-3 text-center">Tindakan</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="applicant in filteredApplicants"
                :key="applicant.id"
                class="bg-white border-b hover:bg-gray-50"
              >
                <td class="px-6 py-4">
                  <FormKit
                    v-model="applicant.selected"
                    type="checkbox"
                    :classes="{
                      wrapper: 'mb-0',
                      outer: 'mb-0',
                      input: 'icon-check rounded',
                    }"
                    @change="handleSelectionChange(applicant)"
                  />
                </td>
                <td class="px-6 py-4">
                  <div class="flex flex-col">
                    <span class="font-medium">{{ applicant.name }}</span>
                    <span class="text-sm text-gray-500">{{
                      applicant.icNumber
                    }}</span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <rs-badge :variant="getAidTypeVariant(applicant.aidType)">
                    {{ applicant.aidType }}
                  </rs-badge>
                </td>
                <td class="px-6 py-4">
                  <rs-badge :variant="getStatusVariant(applicant.status)">
                    {{ applicant.status }}
                  </rs-badge>
                </td>
                <td class="px-6 py-4">
                  <span class="font-mono text-sm">{{
                    applicant.batchNumber
                  }}</span>
                </td>
                <td class="px-6 py-4 text-center">
                  <div class="flex justify-center items-center gap-2">
                    <rs-button
                      variant="primary-outline"
                      class="p-1 w-6 h-6"
                      @click="handleViewDetails(applicant)"
                    >
                      <Icon name="ph:eye" />
                    </rs-button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="flex items-center justify-between px-5 mt-4">
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-700">Baris per halaman:</span>
            <FormKit
              v-model="pageSize"
              type="select"
              :options="[10, 25, 50, 100]"
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
              {{ paginationEnd }} daripada {{ totalApplicants }} entri
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

        <div v-if="selectedApplicants.length > 0" class="px-5 mt-4">
          <div class="bg-primary/5 p-4 rounded-lg">
            <div class="flex items-center justify-between">
              <div>
                <span class="font-medium"
                  >{{ selectedApplicants.length }} pemohon dipilih</span
                >
                <p class="text-sm text-gray-500 mt-1">
                  Klik "Sahkan Senarai" untuk meneruskan pemohon yang dipilih ke
                  peringkat kelulusan
                </p>
              </div>
              <rs-button variant="danger-outline" @click="handleClearSelection">
                Kosongkan Pilihan
              </rs-button>
            </div>
          </div>
        </div>
      </FormKit>
    </rs-card>

    <!-- View Details Modal -->
    <rs-modal
      v-model="isDetailsModalVisible"
      title="Maklumat Pemohon"
      size="md"
      position="center"
    >
      <div v-if="selectedApplicant" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-gray-500">Nama</p>
            <p class="font-medium">{{ selectedApplicant.name }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">No. IC</p>
            <p class="font-medium">{{ selectedApplicant.icNumber }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Jenis Bantuan</p>
            <p class="font-medium">{{ selectedApplicant.aidType }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Status</p>
            <p class="font-medium">{{ selectedApplicant.status }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">No. Batch</p>
            <p class="font-medium">{{ selectedApplicant.batchNumber }}</p>
          </div>
        </div>
      </div>

      <template #footer>
        <rs-button variant="primary" @click="isDetailsModalVisible = false">
          Tutup
        </rs-button>
      </template>
    </rs-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

definePageMeta({
  title: "Senarai Pemohon Bantuan",
});

const breadcrumb = ref([
  {
    name: "Pengurusan Bantuan",
    type: "link",
    path: "/BF-BTN/PB/BP/01",
  },
  {
    name: "Senarai Pemohon Bantuan (Bulk)",
    type: "current",
    path: "/BF-BTN/PB/BP/01",
  },
]);

interface Applicant {
  id: string;
  name: string;
  icNumber: string;
  aidType: string;
  status: string;
  batchNumber: string;
  selected?: boolean;
}

interface Filters {
  status: string;
  aidType: string;
  batchNumber: string;
}

// State
const applicants = ref<Applicant[]>([
  {
    id: "1",
    name: "Ahmad bin Abdullah",
    icNumber: "800101-01-1234",
    aidType: "Bantuan Kewangan",
    status: "Menunggu",
    batchNumber: "BATCH-001",
    selected: false,
  },
  {
    id: "2",
    name: "Siti binti Mohamed",
    icNumber: "850505-05-5678",
    aidType: "Bantuan Makanan",
    status: "Diluluskan",
    batchNumber: "BATCH-001",
    selected: false,
  },
  {
    id: "3",
    name: "Mohd Ali bin Hassan",
    icNumber: "780808-08-9012",
    aidType: "Bantuan Pendidikan",
    status: "Menunggu",
    batchNumber: "BATCH-002",
    selected: false,
  },
  {
    id: "4",
    name: "Nurul Huda binti Ismail",
    icNumber: "900909-09-3456",
    aidType: "Bantuan Kewangan",
    status: "Ditolak",
    batchNumber: "BATCH-002",
    selected: false,
  },
  {
    id: "5",
    name: "Abdul Rahman bin Omar",
    icNumber: "750707-07-7890",
    aidType: "Bantuan Makanan",
    status: "Menunggu",
    batchNumber: "BATCH-003",
    selected: false,
  },
  {
    id: "6",
    name: "Fatimah binti Yusof",
    icNumber: "820202-02-2345",
    aidType: "Bantuan Pendidikan",
    status: "Diluluskan",
    batchNumber: "BATCH-003",
    selected: false,
  },
  {
    id: "7",
    name: "Ismail bin Ibrahim",
    icNumber: "880808-08-6789",
    aidType: "Bantuan Kewangan",
    status: "Menunggu",
    batchNumber: "BATCH-004",
    selected: false,
  },
  {
    id: "8",
    name: "Aminah binti Ahmad",
    icNumber: "920202-02-0123",
    aidType: "Bantuan Makanan",
    status: "Ditolak",
    batchNumber: "BATCH-004",
    selected: false,
  },
  {
    id: "9",
    name: "Zulkifli bin Abdullah",
    icNumber: "770707-07-4567",
    aidType: "Bantuan Pendidikan",
    status: "Menunggu",
    batchNumber: "BATCH-005",
    selected: false,
  },
  {
    id: "10",
    name: "Noraini binti Mohamed",
    icNumber: "870707-07-8901",
    aidType: "Bantuan Kewangan",
    status: "Diluluskan",
    batchNumber: "BATCH-005",
    selected: false,
  },
  {
    id: "11",
    name: "Hassan bin Omar",
    icNumber: "790909-09-2345",
    aidType: "Bantuan Makanan",
    status: "Menunggu",
    batchNumber: "BATCH-006",
    selected: false,
  },
  {
    id: "12",
    name: "Rohana binti Ismail",
    icNumber: "910101-01-6789",
    aidType: "Bantuan Pendidikan",
    status: "Ditolak",
    batchNumber: "BATCH-006",
    selected: false,
  },
  {
    id: "13",
    name: "Mohd Faiz bin Abdullah",
    icNumber: "860606-06-0123",
    aidType: "Bantuan Kewangan",
    status: "Menunggu",
    batchNumber: "BATCH-007",
    selected: false,
  },
  {
    id: "14",
    name: "Nurul Ain binti Hassan",
    icNumber: "930303-03-4567",
    aidType: "Bantuan Makanan",
    status: "Diluluskan",
    batchNumber: "BATCH-007",
    selected: false,
  },
  {
    id: "15",
    name: "Ahmad Firdaus bin Mohamed",
    icNumber: "810101-01-8901",
    aidType: "Bantuan Pendidikan",
    status: "Menunggu",
    batchNumber: "BATCH-008",
    selected: false,
  },
]);

const selectedApplicants = ref<Applicant[]>([]);
const isDetailsModalVisible = ref(false);
const selectedApplicant = ref<Applicant | null>(null);
const searchQuery = ref("");
const isFilterOpen = ref(false);
const currentPage = ref(1);
const pageSize = ref(10);

// Filters
const filters = ref<Filters>({
  status: "",
  aidType: "",
  batchNumber: "",
});

// Options
const statusOptions = [
  { label: "Semua Status", value: "" },
  { label: "Menunggu", value: "Menunggu" },
  { label: "Diluluskan", value: "Diluluskan" },
  { label: "Ditolak", value: "Ditolak" },
];

const aidTypeOptions = [
  { label: "Semua Jenis", value: "" },
  { label: "Bantuan Kewangan", value: "Bantuan Kewangan" },
  { label: "Bantuan Makanan", value: "Bantuan Makanan" },
  { label: "Bantuan Pendidikan", value: "Bantuan Pendidikan" },
];

const batchOptions = [
  { label: "Semua Batch", value: "" },
  { label: "BATCH-001", value: "BATCH-001" },
  { label: "BATCH-002", value: "BATCH-002" },
  { label: "BATCH-003", value: "BATCH-003" },
  { label: "BATCH-004", value: "BATCH-004" },
  { label: "BATCH-005", value: "BATCH-005" },
  { label: "BATCH-006", value: "BATCH-006" },
  { label: "BATCH-007", value: "BATCH-007" },
  { label: "BATCH-008", value: "BATCH-008" },
];

// Computed
const isAllSelected = computed(() => {
  return (
    filteredApplicants.value.length > 0 &&
    filteredApplicants.value.every((applicant) => applicant.selected)
  );
});

const filteredApplicants = computed(() => {
  let result = [...applicants.value];

  // Apply search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (applicant) =>
        applicant.name.toLowerCase().includes(query) ||
        applicant.icNumber.toLowerCase().includes(query) ||
        applicant.batchNumber.toLowerCase().includes(query)
    );
  }

  // Apply filters
  if (filters.value.status) {
    result = result.filter(
      (applicant) => applicant.status === filters.value.status
    );
  }
  if (filters.value.aidType) {
    result = result.filter(
      (applicant) => applicant.aidType === filters.value.aidType
    );
  }
  if (filters.value.batchNumber) {
    result = result.filter(
      (applicant) => applicant.batchNumber === filters.value.batchNumber
    );
  }

  // Apply pagination
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return result.slice(start, end);
});

const totalApplicants = computed(() => {
  return applicants.value.length;
});

const totalPages = computed(() => {
  return Math.ceil(totalApplicants.value / pageSize.value);
});

const paginationStart = computed(() => {
  return (currentPage.value - 1) * pageSize.value + 1;
});

const paginationEnd = computed(() => {
  return Math.min(currentPage.value * pageSize.value, totalApplicants.value);
});

// Methods
const getStatusVariant = (status: string) => {
  const variants: Record<string, string> = {
    Menunggu: "warning",
    Diluluskan: "success",
    Ditolak: "danger",
  };
  return variants[status] || "default";
};

const getAidTypeVariant = (type: string) => {
  const variants: Record<string, string> = {
    "Bantuan Kewangan": "success",
    "Bantuan Makanan": "warning",
    "Bantuan Pendidikan": "info",
  };
  return variants[type] || "default";
};

const handleViewDetails = (applicant: Applicant) => {
  selectedApplicant.value = applicant;
  isDetailsModalVisible.value = true;
};

const handleSelectionChange = (applicant: Applicant) => {
  // Find the applicant in the main applicants array
  const mainApplicant = applicants.value.find((a) => a.id === applicant.id);
  if (mainApplicant) {
    mainApplicant.selected = applicant.selected;
  }

  // Update selectedApplicants array
  if (applicant.selected) {
    if (!selectedApplicants.value.some((a) => a.id === applicant.id)) {
      selectedApplicants.value.push(mainApplicant || applicant);
    }
  } else {
    const index = selectedApplicants.value.findIndex(
      (a) => a.id === applicant.id
    );
    if (index !== -1) {
      selectedApplicants.value.splice(index, 1);
    }
  }
};

const handleSelectAll = () => {
  const newState = !isAllSelected.value;

  // Update all filtered applicants
  filteredApplicants.value.forEach((applicant) => {
    applicant.selected = newState;
  });

  // Update main applicants array
  applicants.value.forEach((applicant) => {
    if (filteredApplicants.value.some((fa) => fa.id === applicant.id)) {
      applicant.selected = newState;
    }
  });

  // Update selectedApplicants array
  if (newState) {
    // Add all filtered applicants
    filteredApplicants.value.forEach((applicant) => {
      if (!selectedApplicants.value.some((a) => a.id === applicant.id)) {
        selectedApplicants.value.push(applicant);
      }
    });
  } else {
    // Remove all filtered applicants
    selectedApplicants.value = selectedApplicants.value.filter(
      (a) => !filteredApplicants.value.some((fa) => fa.id === a.id)
    );
  }
};

const handleClearSelection = () => {
  // Clear selection in both arrays
  applicants.value.forEach((applicant) => {
    applicant.selected = false;
  });
  selectedApplicants.value = [];
};

const handleRefresh = () => {
  // Reset all filters and search
  searchQuery.value = "";
  filters.value = {
    status: "",
    aidType: "",
    batchNumber: "",
  };
  currentPage.value = 1;
  isFilterOpen.value = false;
};

const handleApprove = () => {
  if (selectedApplicants.value.length === 0) {
    // Use the project's notification system
    return;
  }

  // TODO: Implement approval logic
  // 1. Update status to "Menunggu Kelulusan"
  // 2. Save to database
  // 3. Show success message
  // 4. Send notifications to relevant parties
  navigateTo("/BF-BTN/PB/BP/02");
};
</script>
