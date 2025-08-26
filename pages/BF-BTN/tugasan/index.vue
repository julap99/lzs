<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Senarai</h2>
          <div class="flex gap-3 items-center">
            <div class="flex items-center gap-2">
              <span class="text-sm text-gray-700">Cari:</span>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Cari mengikut no rujukan atau nama..."
                class="border border-gray-300 rounded-lg px-3 py-2 text-sm w-64"
              />
            </div>
            <select
              v-model="filters.status"
              class="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="">Semua Status</option>
              <option value="Baru">Baru</option>
              <option value="Dalam Semakan">Dalam Semakan</option>
              <option value="Tidak Lengkap">Tidak Lengkap</option>
              <option value="Untuk Siasatan">Untuk Siasatan</option>
            </select>
          </div>
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
                    <rs-button variant="primary" @click="handleReview(text)">
                      Semak
                    </rs-button>
                  </div>
                </template>
              </rs-table>

              <TablePagination
                v-model:currentPage="currentPage"
                v-model:pageSize="pageSize"
                :total="totalFilteredApplications"
              />
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
                      :data="filteredPermohonanData"
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
                            @click="handleReview(text)"
                          >
                            Semak
                          </rs-button>
                        </div>
                      </template>
                    </rs-table>

                    <TablePagination
                      v-model:currentPage="currentPage"
                      v-model:pageSize="pageSize"
                      :total="totalFilteredPermohonanData"
                    />
                  </div>
                </rs-tab-item>

                <rs-tab-item title="Semakan">
                  <!-- Semakan Sub-tab Content -->
                  <div>
                    <h4 class="text-md font-medium mb-3 text-gray-700">
                      Semakan
                    </h4>
                    <rs-table
                      :data="filteredSemakanData"
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
                            @click="handleReview(text)"
                          >
                            Semak
                          </rs-button>
                        </div>
                      </template>
                    </rs-table>

                    <TablePagination
                      v-model:currentPage="currentPage"
                      v-model:pageSize="pageSize"
                      :total="totalFilteredSemakanData"
                    />
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

                      <template v-slot:tindakan="{ text }">
                        <div class="flex justify-center items-center gap-2">
                          <rs-button
                            variant="primary"
                            @click="handleReview(text)"
                          >
                            Semak
                          </rs-button>
                          <rs-button
                            variant="secondary"
                            @click="handleAssignTask(text)"
                          >
                            Tugas Kepada
                          </rs-button>
                        </div>
                      </template>
                    </rs-table>

                    <TablePagination
                      v-model:currentPage="currentPage"
                      v-model:pageSize="pageSize"
                      :total="totalFilteredSiasatanData"
                    />
                  </div>
                </rs-tab-item>

                <rs-tab-item title="Sokongan">
                  <!-- Sokongan Sub-tab Content -->
                  <div>
                    <h4 class="text-md font-medium mb-3 text-gray-700">
                      Sokongan
                    </h4>
                    <rs-table
                      :data="filteredSokonganData"
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
                            @click="handleReview(text)"
                          >
                            Semak
                          </rs-button>
                        </div>
                      </template>
                    </rs-table>

                    <TablePagination
                      v-model:currentPage="currentPage"
                      v-model:pageSize="pageSize"
                      :total="totalFilteredSokonganData"
                    />
                  </div>
                </rs-tab-item>

                <rs-tab-item title="Kelulusan">
                  <!-- Kelulusan Sub-tab Content -->
                  <div>
                    <h4 class="text-md font-medium mb-3 text-gray-700">
                      Kelulusan
                    </h4>
                    <rs-table
                      :data="filteredKelulusanData"
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
                            @click="handleReview(text)"
                          >
                            Semak
                          </rs-button>
                        </div>
                      </template>
                    </rs-table>

                    <TablePagination
                      v-model:currentPage="currentPage"
                      v-model:pageSize="pageSize"
                      :total="totalFilteredKelulusanData"
                    />
                  </div>
                </rs-tab-item>

                <rs-tab-item title="Selesai">
                  <!-- Selesai Sub-tab Content -->
                  <div>
                    <h4 class="text-md font-medium mb-3 text-gray-700">
                      Selesai
                    </h4>
                    <rs-table
                      :data="filteredSelesaiData"
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
                            @click="handleReview(text)"
                          >
                            Semak
                          </rs-button>
                        </div>
                      </template>
                    </rs-table>

                    <TablePagination
                      v-model:currentPage="currentPage"
                      v-model:pageSize="pageSize"
                      :total="totalFilteredSelesaiData"
                    />
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
  title: "Senarai Tugasan",
});

const breadcrumb = ref([
  {
    name: "Tugasan",
    type: "link",
    path: "/BF-BTN/tugasan",
  },
]);

// Table columns configuration
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

// State
const searchQuery = ref("");
const filters = ref({
  status: "",
});
const currentPage = ref(1);
const pageSize = ref(10);

// Mock data - would be replaced with API calls
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

const siasatanData = ref([
  {
    pemohon: "Ahmad bin Abdullah (800101-01-1234)",
    kariah: "Masjid Al-Hidayah",
    daerah: "Kuala Lumpur",
    bilanganBantuan: 2,
    status: "Dalam Siasatan",
    statusLaluan: "Untuk Siasatan",
    noRujukan: "NAS-2025-0001",
    tindakan: "bantuan/siasatan/siasatan-eoad",
  },
  {
    pemohon: "Siti binti Hassan (850505-05-5678)",
    kariah: "Masjid Al-Ikhlas",
    daerah: "Selangor",
    bilanganBantuan: 1,
    status: "Selesai Siasatan",
    statusLaluan: "Untuk Kelulusan",
    noRujukan: "NAS-2025-0002",
    tindakan: "bantuan/siasatan/siasatan-eoad",
  },
]);

const sokonganData = ref([
  {
    noRujukan: "NAS-2025-0001",
    namaPemohon: "Ahmad bin Abdullah",
    status: "Baru",
    tarikhTerima: "2024-03-20",
    namaPegawai: "Siti binti Ali",
    tindakan: "bantuan/sokongan/NAS-2025-0001",
  },
  {
    noRujukan: "NAS-2025-0002",
    namaPemohon: "Mohd bin Ismail",
    status: "Dalam Semakan",
    tarikhTerima: "2024-03-19",
    namaPegawai: "Aminah binti Hassan",
    tindakan: "bantuan/sokongan/NAS-2025-0002",
  },
]);

const kelulusanData = ref([
  {
    noRujukan: "NAS-2025-0001",
    namaPemohon: "Ahmad bin Abdullah",
    status: "Baru",
    tarikhTerima: "2024-03-20",
    namaPegawai: "Siti binti Ali",
    tindakan: "bantuan/kelulusan/siasatan-eoad",
  },
  {
    noRujukan: "NAS-2025-0002",
    namaPemohon: "Mohd bin Ismail",
    status: "Dalam Semakan",
    tarikhTerima: "2024-03-19",
    namaPegawai: "Aminah binti Hassan",
    tindakan: "bantuan/kelulusan/siasatan-eoad",
  },
]);

const selesaiData = ref([
  {
    noRujukan: "NAS-2025-0003",
    namaPemohon: "Fatimah binti Ahmad",
    status: "Selesai",
    tarikhTerima: "2024-03-15",
    namaPegawai: "Zulkifli bin Omar",
    tindakan: "bantuan/selesai/NAS-2025-0003",
  },
]);

// Helper function to filter data
const createFilteredData = (data) => {
  return computed(() => {
    let result = [...data.value];

    // Apply search
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      result = result.filter(
        (item) =>
          (item.noRujukan && item.noRujukan.toLowerCase().includes(query)) ||
          (item.namaPemohon &&
            item.namaPemohon.toLowerCase().includes(query)) ||
          (item.pemohon && item.pemohon.toLowerCase().includes(query)) ||
          (item.kariah && item.kariah.toLowerCase().includes(query)) ||
          (item.daerah && item.daerah.toLowerCase().includes(query))
      );
    }

    // Apply status filter
    if (filters.value.status) {
      result = result.filter((item) => item.status === filters.value.status);
    }

    // Apply pagination
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return result.slice(start, end);
  });
};

// Helper function to get total count
const createTotalCount = (data) => {
  return computed(() => {
    let result = [...data.value];

    // Apply search
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      result = result.filter(
        (item) =>
          (item.noRujukan && item.noRujukan.toLowerCase().includes(query)) ||
          (item.namaPemohon &&
            item.namaPemohon.toLowerCase().includes(query)) ||
          (item.pemohon && item.pemohon.toLowerCase().includes(query)) ||
          (item.kariah && item.kariah.toLowerCase().includes(query)) ||
          (item.daerah && item.daerah.toLowerCase().includes(query))
      );
    }

    // Apply status filter
    if (filters.value.status) {
      result = result.filter((item) => item.status === filters.value.status);
    }

    return result.length;
  });
};

// Computed properties for each tab
const filteredApplications = createFilteredData(applications);
const totalFilteredApplications = createTotalCount(applications);

const filteredPermohonanData = createFilteredData(applications);
const totalFilteredPermohonanData = createTotalCount(applications);

const filteredSemakanData = createFilteredData(semakanData);
const totalFilteredSemakanData = createTotalCount(semakanData);

const filteredSiasatanData = createFilteredData(siasatanData);
const totalFilteredSiasatanData = createTotalCount(siasatanData);

const filteredSokonganData = createFilteredData(sokonganData);
const totalFilteredSokonganData = createTotalCount(sokonganData);

const filteredKelulusanData = createFilteredData(kelulusanData);
const totalFilteredKelulusanData = createTotalCount(kelulusanData);

const filteredSelesaiData = createFilteredData(selesaiData);
const totalFilteredSelesaiData = createTotalCount(selesaiData);

// Methods
const handleReview = (noRujukan) => {
  console.log(noRujukan);
  navigateTo(`/BF-BTN/tugasan/${noRujukan}`);
};

const handleAssignTask = (noRujukan) => {
  console.log(`Assigning task for: ${noRujukan}`);
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
    selesai: "success",
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
