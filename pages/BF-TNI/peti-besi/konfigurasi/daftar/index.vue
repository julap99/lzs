<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Senarai Permohonan Untuk Daftar Tabung</h2>
        </div>
      </template>

      <template #body>
        <!-- Search Input -->
        <div class="mb-4">
          <FormKit
            type="text"
            v-model="searchQuery"
            placeholder="Cari permohonan untuk daftar..."
            outer-class="mb-0"
          />
        </div>

        <!-- Applications Table -->
        <rs-table
          class="mt-4"
          :key="tableKey"
          :data="filteredApplications"
          :pageSize="10"
          :showNoColumn="true"
          :options="{
            variant: 'default',
            hover: true,
          }"
        >
          <template v-slot:status="data">
            <rs-badge :variant="getApplicationStatusVariant(data.text)">
              {{ data.text }}
            </rs-badge>
          </template>

                      <template v-slot:tindakan="data">
              <div class="flex space-x-2">
                <rs-button
                  variant="primary"
                  size="sm"
                  class="!px-2 !py-1"
                  @click="handleRegister(data.text)"
                >
                  <Icon name="ph:user-plus" size="15" class="mr-1" />
                  Hantar Untuk Kelulusan
                </rs-button>
              </div>
            </template>
        </rs-table>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

definePageMeta({
  title: "Senarai Permohonan Untuk Daftar Tabung",
  description: "Pentadbir sistem melihat senarai permohonan yang telah disokong KJ dan perlu didaftarkan",
});

const breadcrumb = ref([
  {
    name: "Tabung",
    type: "link",
    path: "/BF-TNI/peti-besi/konfigurasi/senarai",
  },
  {
    name: "Konfigurasi",
    type: "link",
    path: "/BF-TNI/peti-besi/konfigurasi/senarai",
  },
  {
    name: "Daftar Tabung",
    type: "current",
    path: "/BF-TNI/peti-besi/konfigurasi/daftar",
  },
]);

// Table data and search
const tableKey = ref(0);
const searchQuery = ref("");

// Pentadbir Sistem Data (Permohonan yang telah "Disokong KJ")
const applications = ref([
  {
    id: "TB-2024-003",
    tarikhMohon: "2024-03-18",
    namaTabung: "Tabung Amil Daerah",
    status: "Disokong KJ",
    tindakan: "TB-2024-003"
  },
  {
    id: "TB-2024-004",
    tarikhMohon: "2024-03-17",
    namaTabung: "Tabung Bantuan Masyarakat",
    status: "Disokong KJ",
    tindakan: "TB-2024-004"
  },
  {
    id: "TB-2024-005",
    tarikhMohon: "2024-03-16",
    namaTabung: "Tabung Operasi Khas",
    status: "Disokong KJ",
    tindakan: "TB-2024-005"
  }
]);

// Computed properties
const filteredApplications = computed(() => {
  if (!searchQuery.value) return applications.value;
  
  const query = searchQuery.value.toLowerCase();
  return applications.value.filter(app => 
    app.id.toLowerCase().includes(query) ||
    app.namaTabung.toLowerCase().includes(query)
  );
});

// Helper functions
const getApplicationStatusVariant = (status) => {
  switch (status) {
    case 'Disokong KJ':
      return 'success';
    case 'Didaftarkan':
      return 'info';
    default:
      return 'default';
  }
};

// Action handlers
const handleRegister = (id) => {
  navigateTo(`/BF-TNI/peti-besi/konfigurasi/daftar/borang/${id}`);
};
</script>

<style lang="scss" scoped>
// Add any custom styles here if needed
</style> 