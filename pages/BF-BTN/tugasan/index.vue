<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Senarai</h2>
        </div>
      </template>

      <template #body>
        <!-- Main Tabs -->
        <rs-tab variant="primary" type="card">
          <rs-tab-item title="Profiling" active>
            <!-- Profiling Tab Content -->
            <div>
              <h3 class="text-lg font-semibold mb-4 text-gray-800">
                Profiling Data
              </h3>
              <!-- Applications Table -->
              <rs-table
                :data="filteredApplications"
                :columns="columns"
                :pageSize="pageSize"
                :showNoColumn="true"
                :options="{
                  variant: 'default',
                  hover: true,
                  striped: true,
                }"
                :options-advanced="{
                  sortable: true,
                  filterable: false,
                }"
                advanced
              >
                <template v-slot:status="{ text }">
                  <rs-badge :variant="getStatusVariant(text)">
                    {{ text }}
                  </rs-badge>
                </template>

                <template v-slot:tindakan="{ text }">
                  <div class="flex justify-center items-center gap-2">
                    <rs-button
                      variant="primary"
                      class="p-1 flex gap-2"
                      @click="handleReview(text)"
                    >
                      Semak
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
                    {{ paginationEnd }} daripada {{ totalApplications }} entri
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
            </div>
          </rs-tab-item>

          <rs-tab-item title="Bantuan">
            <!-- Bantuan Tab Content with Sub-tabs -->
            <div>
              <h3 class="text-lg font-semibold mb-4 text-gray-800">
                Bantuan Data
              </h3>

              <!-- Sub-tabs for Bantuan -->
              <rs-tab variant="secondary" type="border" class="mb-6">
                <rs-tab-item title="Permohonan" active>
                  <!-- Permohonan Sub-tab Content -->
                  <div>
                    <h4 class="text-md font-medium mb-3 text-gray-700">
                      Permohonan
                    </h4>
                    <rs-table
                      :data="filteredApplications"
                      :columns="columns"
                      :pageSize="pageSize"
                      :showNoColumn="true"
                      :options="{
                        variant: 'default',
                        hover: true,
                        striped: true,
                      }"
                      :options-advanced="{
                        sortable: true,
                        filterable: false,
                      }"
                      advanced
                    >
                      <template v-slot:status="{ text }">
                        <rs-badge :variant="getStatusVariant(text)">
                          {{ text }}
                        </rs-badge>
                      </template>

                      <template v-slot:tindakan="{ text }">
                        <div class="flex justify-center items-center gap-2">
                          <rs-button
                            variant="primary"
                            class="p-1 flex gap-2"
                            @click="handleReview(text)"
                          >
                            Semak
                          </rs-button>
                        </div>
                      </template>
                    </rs-table>

                    <!-- Pagination -->
                    <div class="flex items-center justify-between px-5 mt-4">
                      <div class="flex items-center gap-2">
                        <span class="text-sm text-gray-700"
                          >Baris per halaman:</span
                        >
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
                          {{ paginationEnd }} daripada
                          {{ totalApplications }} entri
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
                  </div>
                </rs-tab-item>

                <rs-tab-item title="Semakan">
                  <!-- Semakan Sub-tab Content -->
                  <div>
                    <h4 class="text-md font-medium mb-3 text-gray-700">
                      Semakan
                    </h4>
                    <rs-table
                      :data="semakanData"
                      :columns="semakanColumns"
                      :pageSize="pageSize"
                      :showNoColumn="true"
                      :options="{
                        variant: 'default',
                        hover: true,
                        striped: true,
                      }"
                      :options-advanced="{
                        sortable: true,
                        filterable: false,
                      }"
                      advanced
                    >
                      <template v-slot:status="{ text }">
                        <rs-badge :variant="getStatusVariant(text)">
                          {{ text }}
                        </rs-badge>
                      </template>

                      <template v-slot:tindakan="{ text }">
                        <div class="flex justify-center items-center gap-2">
                          <rs-button
                            variant="primary"
                            class="p-1 flex gap-2"
                            @click="handleReview(text)"
                          >
                            Semak
                          </rs-button>
                        </div>
                      </template>
                    </rs-table>

                    <!-- Pagination -->
                    <div class="flex items-center justify-between px-5 mt-4">
                      <div class="flex items-center gap-2">
                        <span class="text-sm text-gray-700"
                          >Baris per halaman:</span
                        >
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
                          {{ paginationEnd }} daripada
                          {{ totalApplications }} entri
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
                  </div>
                </rs-tab-item>

                <rs-tab-item title="Siasatan">
                  <!-- Siasatan Sub-tab Content -->
                  <div>
                    <h4 class="text-md font-medium mb-3 text-gray-700">
                      Siasatan
                    </h4>
                    <rs-table
                      :data="filteredSiasatanData"
                      :columns="siasatanColumns"
                      :pageSize="pageSize"
                      :showNoColumn="true"
                      :options="{
                        variant: 'default',
                        hover: true,
                        striped: true,
                      }"
                      :options-advanced="{
                        sortable: true,
                        filterable: false,
                      }"
                      advanced
                    >
                      <template v-slot:status="{ text }">
                        <rs-badge :variant="getStatusVariant(text)">
                          {{ text }}
                        </rs-badge>
                      </template>

                      <template v-slot:statusLaluan="{ text }">
                        <rs-badge :variant="getLaluanStatusVariant(text)">
                          {{ text }}
                        </rs-badge>
                      </template>

                      <template v-slot:tindakan="{ text, row }">
                        <div class="flex justify-center items-center gap-2">
                          <rs-button
                            variant="primary"
                            size="sm"
                            class="p-1 flex gap-2"
                            @click="handleReview(text)"
                          >
                            Semak
                          </rs-button>
                          <rs-button
                            variant="secondary"
                            size="sm"
                            class="p-1 flex gap-2"
                            @click="handleAssignTask(text)"
                          >
                            Tugas Kepada
                          </rs-button>
                        </div>
                      </template>
                    </rs-table>

                    <!-- Pagination -->
                    <div class="flex items-center justify-between px-5 mt-4">
                      <div class="flex items-center gap-2">
                        <span class="text-sm text-gray-700"
                          >Baris per halaman:</span
                        >
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
                          {{ paginationEnd }} daripada
                          {{ totalSiasatanData }} entri
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
                  </div>
                </rs-tab-item>

                <rs-tab-item title="Sokongan">
                  <!-- Sokongan Sub-tab Content -->
                  <div>
                    <h4 class="text-md font-medium mb-3 text-gray-700">
                      Sokongan
                    </h4>
                    <rs-table
                      :data="filteredApplications"
                      :columns="columns"
                      :pageSize="pageSize"
                      :showNoColumn="true"
                      :options="{
                        variant: 'default',
                        hover: true,
                        striped: true,
                      }"
                      :options-advanced="{
                        sortable: true,
                        filterable: false,
                      }"
                      advanced
                    >
                      <template v-slot:status="{ text }">
                        <rs-badge :variant="getStatusVariant(text)">
                          {{ text }}
                        </rs-badge>
                      </template>

                      <template v-slot:tindakan="{ text }">
                        <div class="flex justify-center items-center gap-2">
                          <rs-button
                            variant="primary"
                            class="p-1 flex gap-2"
                            @click="handleReview(text)"
                          >
                            Semak
                          </rs-button>
                        </div>
                      </template>
                    </rs-table>

                    <!-- Pagination -->
                    <div class="flex items-center justify-between px-5 mt-4">
                      <div class="flex items-center gap-2">
                        <span class="text-sm text-gray-700"
                          >Baris per halaman:</span
                        >
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
                          {{ paginationEnd }} daripada
                          {{ totalApplications }} entri
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
                  </div>
                </rs-tab-item>

                <rs-tab-item title="Kelulusan">
                  <!-- Kelulusan Sub-tab Content -->
                  <div>
                    <h4 class="text-md font-medium mb-3 text-gray-700">
                      Kelulusan
                    </h4>
                    <rs-table
                      :data="filteredApplications"
                      :columns="columns"
                      :pageSize="pageSize"
                      :showNoColumn="true"
                      :options="{
                        variant: 'default',
                        hover: true,
                        striped: true,
                      }"
                      :options-advanced="{
                        sortable: true,
                        filterable: true,
                      }"
                      advanced
                    >
                      <template v-slot:status="{ text }">
                        <rs-badge :variant="getStatusVariant(text)">
                          {{ text }}
                        </rs-badge>
                      </template>

                      <template v-slot:tindakan="{ text }">
                        <div class="flex justify-center items-center gap-2">
                          <rs-button
                            variant="primary"
                            class="p-1 flex gap-2"
                            @click="handleReview(text)"
                          >
                            Semak
                          </rs-button>
                        </div>
                      </template>
                    </rs-table>

                    <!-- Pagination -->
                    <div class="flex items-center justify-between px-5 mt-4">
                      <div class="flex items-center gap-2">
                        <span class="text-sm text-gray-700"
                          >Baris per halaman:</span
                        >
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
                          {{ paginationEnd }} daripada
                          {{ totalApplications }} entri
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
                  </div>
                </rs-tab-item>

                <rs-tab-item title="Selesai">
                  <!-- Selesai Sub-tab Content -->
                  <div>
                    <h4 class="text-md font-medium mb-3 text-gray-700">
                      Selesai
                    </h4>
                    <rs-table
                      :data="filteredApplications"
                      :columns="columns"
                      :pageSize="pageSize"
                      :showNoColumn="true"
                      :options="{
                        variant: 'default',
                        hover: true,
                        striped: true,
                      }"
                      :options-advanced="{
                        sortable: true,
                        filterable: true,
                      }"
                      advanced
                    >
                      <template v-slot:status="{ text }">
                        <rs-badge :variant="getStatusVariant(text)">
                          {{ text }}
                        </rs-badge>
                      </template>

                      <template v-slot:tindakan="{ text }">
                        <div class="flex justify-center items-center gap-2">
                          <rs-button
                            variant="primary"
                            class="p-1 flex gap-2"
                            @click="handleReview(text)"
                          >
                            Semak
                          </rs-button>
                        </div>
                      </template>
                    </rs-table>

                    <!-- Pagination -->
                    <div class="flex items-center justify-between px-5 mt-4">
                      <div class="flex items-center gap-2">
                        <span class="text-sm text-gray-700"
                          >Baris per halaman:</span
                        >
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
                          {{ paginationEnd }} daripada
                          {{ totalApplications }} entri
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
                  </div>
                </rs-tab-item>
              </rs-tab>
            </div>
          </rs-tab-item>
        </rs-tab>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

definePageMeta({
  title: "Senarai Permohonan untuk Disemak",
});

const breadcrumb = ref([
  {
    name: "Permohonan Bantuan",
    type: "link",
    path: "/BF-BTN/senarai",
  },
  {
    name: "Senarai",
    type: "current",
    path: "/BF-BTN/senarai",
  },
]);

// Table columns configuration for Profiling tab
const columns = [
  {
    key: "noRujukan",
    label: "No Rujukan Permohonan",
    sortable: true,
  },
  {
    key: "namaPemohon",
    label: "Nama Pemohon",
    sortable: true,
  },
  {
    key: "status",
    label: "Status Permohonan",
    sortable: true,
  },
  {
    key: "tarikhTerima",
    label: "Tarikh Terima Permohonan",
    sortable: true,
  },
  {
    key: "namaPegawai",
    label: "Nama Pegawai",
    sortable: true,
  },
  {
    key: "tindakan",
    label: "Aksi",
    sortable: false,
  },
];

const semakanColumns = [
  {
    key: "noRujukan",
    label: "No Rujukan Permohonan",
    sortable: true,
  },
  {
    key: "namaPemohon",
    label: "Nama Pemohon",
    sortable: true,
  },
  {
    key: "status",
    label: "Status Permohonan",
    sortable: true,
  },
  {
    key: "tarikhTerima",
    label: "Tarikh Terima Permohonan",
    sortable: true,
  },
  {
    key: "namaPegawai",
    label: "Nama Pegawai",
    sortable: true,
  },
  {
    key: "tindakan",
    label: "Aksi",
    sortable: false,
  },
];

// Table columns configuration for Siasatan tab
const siasatanColumns = [
  {
    key: "no",
    label: "No",
    sortable: true,
  },
  {
    key: "pemohon",
    label: "Pemohon",
    sortable: true,
  },
  {
    key: "kariah",
    label: "Kariah",
    sortable: true,
  },
  {
    key: "daerah",
    label: "Daerah",
    sortable: true,
  },
  {
    key: "bilanganBantuan",
    label: "Bilangan Bantuan",
    sortable: true,
  },
  {
    key: "status",
    label: "Status",
    sortable: true,
  },
  {
    key: "statusLaluan",
    label: "Status Laluan Proses",
    sortable: true,
  },
  {
    key: "noRujukan",
    label: "No Rujukan",
    sortable: true,
  },
  {
    key: "tindakan",
    label: "Tindakan",
    sortable: false,
  },
];

// Options for filters
const statusOptions = [
  { label: "Semua Status", value: "" },
  { label: "Baru", value: "baru" },
  { label: "Dalam Semakan", value: "dalam_semakan" },
  { label: "Tidak Lengkap", value: "tidak_lengkap" },
  { label: "Untuk Siasatan", value: "untuk_siasatan" },
];

// State
const searchQuery = ref("");
const filters = ref({
  status: "",
});
const currentPage = ref(1);
const pageSize = ref(10);

// Mock data for Profiling tab - would be replaced with API call
const applications = ref([
  {
    noRujukan: "NAS-2025-0001",
    namaPemohon: "Ahmad bin Abdullah",
    status: "Baru",
    tarikhTerima: "2024-03-20",
    namaPegawai: "Siti binti Ali",
    tindakan: "NAS-2025-0001",
  },
  {
    noRujukan: "NAS-2025-0002",
    namaPemohon: "Mohd bin Ismail",
    status: "Dalam Semakan",
    tarikhTerima: "2024-03-19",
    namaPegawai: "Aminah binti Hassan",
    tindakan: "NAS-2025-0002",
  },
]);

const semakanData = ref([
  {
    noRujukan: "NAS-2025-0001",
    namaPemohon: "Ahmad bin Abdullah",
    status: "Baru",
    tarikhTerima: "2024-03-20",
    namaPegawai: "Siti binti Ali",
    tindakan: "bantuan/semakan/NAS-2025-0001",
  },
  {
    noRujukan: "NAS-2025-0002",
    namaPemohon: "Mohd bin Ismail",
    status: "Dalam Semakan",
    tarikhTerima: "2024-03-19",
    namaPegawai: "Aminah binti Hassan",
    tindakan: "bantuan/semakan/NAS-2025-0002",
  },
]);

// Mock data for Siasatan tab - would be replaced with API call
const siasatanData = ref([
  {
    pemohon: "Ahmad bin Abdullah (800101-01-1234)",
    kariah: "Masjid Al-Hidayah",
    daerah: "Kuala Lumpur",
    bilanganBantuan: 2,
    status: "Dalam Siasatan",
    statusLaluan: "Untuk Siasatan",
    noRujukan: "NAS-2025-0001",
    tindakan: "bantuan/siasatan/NAS-2025-0001",
  },
  {
    pemohon: "Siti binti Hassan (850505-05-5678)",
    kariah: "Masjid Al-Ikhlas",
    daerah: "Selangor",
    bilanganBantuan: 1,
    status: "Selesai Siasatan",
    statusLaluan: "Untuk Kelulusan",
    noRujukan: "NAS-2025-0002",
    tindakan: "bantuan/siasatan/NAS-2025-0002",
  },
]);

// Computed properties for Profiling tab
const filteredApplications = computed(() => {
  let result = [...applications.value];

  // Apply search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (app) =>
        app.noRujukan.toLowerCase().includes(query) ||
        app.namaPemohon.toLowerCase().includes(query)
    );
  }

  // Apply filters
  if (filters.value.status) {
    result = result.filter((app) => app.status === filters.value.status);
  }

  // Apply pagination
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return result.slice(start, end);
});

const totalApplications = computed(() => {
  return applications.value.length;
});

// Computed properties for Siasatan tab
const filteredSiasatanData = computed(() => {
  let result = [...siasatanData.value];

  // Apply search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (app) =>
        app.noRujukan.toLowerCase().includes(query) ||
        app.pemohon.toLowerCase().includes(query) ||
        app.kariah.toLowerCase().includes(query) ||
        app.daerah.toLowerCase().includes(query)
    );
  }

  // Apply filters
  if (filters.value.status) {
    result = result.filter((app) => app.status === filters.value.status);
  }

  // Apply pagination
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return result.slice(start, end);
});

const totalSiasatanData = computed(() => {
  return siasatanData.value.length;
});

const totalPages = computed(() => {
  return Math.ceil(totalSiasatanData.value / pageSize.value);
});

const paginationStart = computed(() => {
  return (currentPage.value - 1) * pageSize.value + 1;
});

const paginationEnd = computed(() => {
  return Math.min(currentPage.value * pageSize.value, totalSiasatanData.value);
});

// Methods
const handleViewDetails = (noRujukan) => {
  navigateTo(`/BF-BTN/PB/senarai/${noRujukan}`);
};

const handleReview = (noRujukan) => {
  console.log(noRujukan);
  navigateTo(`/BF-BTN/tugasan/${noRujukan}`);
};

const handleAssignTask = (noRujukan) => {
  // Handle task assignment - would be replaced with actual implementation
  console.log(`Assigning task for: ${noRujukan}`);
  // You can add navigation or modal logic here
};

const getStatusVariant = (status) => {
  const variants = {
    baru: "info",
    dalam_semakan: "warning",
    tidak_lengkap: "danger",
    untuk_siasatan: "secondary",
    "dalam siasatan": "warning",
    "selesai siasatan": "success",
    "menunggu siasatan": "info",
  };
  return variants[status.toLowerCase()] || "default";
};

const getLaluanStatusVariant = (status) => {
  const variants = {
    "untuk semakan": "info",
    "untuk pengesahan lawatan": "warning",
    "untuk siasatan": "secondary",
    "untuk kelulusan": "success",
  };
  return variants[status.toLowerCase()] || "default";
};
</script>

<style lang="scss" scoped></style>
