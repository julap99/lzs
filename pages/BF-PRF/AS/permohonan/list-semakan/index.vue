<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />
    
    <rs-card>
      <template #header>
        <div class="flex items-center">
          <Icon name="ic:outline-list-alt" class="mr-2" />
          Senarai Permohonan untuk Disemak
        </div>
      </template>

      <template #body>
        <!-- Table Section -->
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
          <!-- Custom column templates -->
          <template v-slot:status="{ text }">
            <rs-badge :variant="getStatusVariant(text)">
              {{ text }}
            </rs-badge>
          </template>

          <template v-slot:tindakan="{ text }">
            <rs-button
              variant="primary"
              size="sm"
              @click="handleSemak(text)"
            >
              Semak
            </rs-button>
          </template>
        </rs-table>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

definePageMeta({
  title: "Senarai Permohonan untuk Disemak",
  description: "Senarai permohonan yang menunggu untuk disemak",
});

// Breadcrumb
const breadcrumb = ref([
  // {
  //   name: "BF-PRF",
  //   type: "link",
  //   path: "/BF-PRF",
  // },
  // {
  //   name: "AS",
  //   type: "link",
  //   path: "/BF-PRF/AS",
  // },
  // {
  //   name: "Permohonan",
  //   type: "link",
  //   path: "/BF-PRF/AS/permohonan",
  // },
  {
    name: "Senarai Semakan",
    type: "current",
    path: "/BF-PRF/AS/permohonan/list-semakan",
  },
]);

// Table columns configuration
const columns = [
  {
    key: "nama",
    label: "Nama",
    sortable: true,
  },
  {
    key: "tarikhMohon",
    label: "Tarikh Mohon",
    sortable: true,
  },
  {
    key: "jenisPendaftaran",
    label: "Jenis Pendaftaran",
    sortable: true,
  },
  {
    key: "status",
    label: "Status",
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
const pageSize = ref(10);
const currentPage = ref(1);

// Mock data - would be replaced with API call
const applications = ref([
  {
    nama: "Adnan bin Abu",
    tarikhMohon: "2024-03-20",
    jenisPendaftaran: "Pendaftaran Lengkap  ",
    status: "Menunggu Kelulusan",
    tindakan: "PRF-2024-001",
  },
  {
    nama: "Siti binti Ali",
    tarikhMohon: "2024-03-19",
    jenisPendaftaran: "Self Service Pendaftaran Lengkap",
    status: "Lulus",
    tindakan: "PRF-2024-002",
  },
  {
    nama: "Mohd bin Ismail",
    tarikhMohon: "2024-03-18",
    jenisPendaftaran: "Pendaftaran Lengkap",
    status: "Tidak Lulus",
    tindakan: "PRF-2024-003",
  },
]);

// Computed properties
const filteredApplications = computed(() => {
  let filtered = [...applications.value];

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(app => 
      app.nama.toLowerCase().includes(query) ||
      app.jenisPendaftaran.toLowerCase().includes(query)
    );
  }

  return filtered;
});

// Utility functions
const getStatusVariant = (status) => {
  const variants = {
    "Menunggu Kelulusan": "warning",
    "Lulus": "success",
    "Tidak Lulus": "danger",
  };
  return variants[status] || "default";
};

const handleSemak = (id) => {
  navigateTo('/BF-PRF/AS/permohonan/list-semakan/semakan-data-lengkap');
};
</script>
