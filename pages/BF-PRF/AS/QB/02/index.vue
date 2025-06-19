<template>
    <div>
      <LayoutsBreadcrumb :items="breadcrumb" />
      
      <rs-card>
        <template #header>
          <div class="flex items-center">
            <Icon name="ic:outline-list-alt" class="mr-2" />
            Senarai Permohonan Pukal
          </div>
        </template>
  
        <template #body>
          <!-- Search Section -->
          <div class="mb-4">
            <rs-input
              v-model="searchQuery"
              placeholder="Cari..."
              prepend-icon="ic:outline-search"
            />
          </div>
  
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
              filterable: true,
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
                @click="handleView(text)"
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
  import { useRouter } from "vue-router";
  
  const router = useRouter();
  
  definePageMeta({
    title: "Senarai Permohonan Pukal",
    description: "Senarai permohonan pukal yang telah didaftarkan",
  });
  
  // Breadcrumb
  const breadcrumb = ref([
    {
      name: "BF-PRF",
      type: "link",
      path: "/BF-PRF",
    },
    {
      name: "AS",
      type: "link",
      path: "/BF-PRF/AS",
    },
    {
      name: "Pukal",
      type: "link",
      path: "/BF-PRF/AS/Pukal",
    },
    {
      name: "Senarai Pukal",
      type: "current",
      path: "/BF-PRF/AS/Pukal/list-pukal",
    },
  ]);
  
  // Table columns configuration
  const columns = [
    {
      key: "name",
      label: "Nama",
      sortable: true,
    },
    {
      key: "newIC",
      label: "No Kad Pengenalan",
      sortable: true,
    },
    {
      key: "familyCategory",
      label: "Kategori Asnaf",
      sortable: true,
    },
    {
      key: "helpAmount",
      label: "Amaun Bantuan (RM)",
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
      Nama: "Ahmad bin Abdullah",
      IC: "880101-1212",
      Kategori: "Fakir",
      JumlahBantuan: 1000,
      status: "Dalam Permohonan",
      tindakan: "PRF-2024-001",
    },
    {
      Nama: "Siti binti Ali",
      IC: "880102-1213",
      Kategori: "Miskin",
      JumlahBantuan: 1500,
      status: "Lulus",
      tindakan: "PRF-2024-002",
    },
    {
      Nama: "Mohd bin Ismail",
      IC: "880103-1214",
      Kategori: "Muallaf",
      JumlahBantuan: 2000,
      status: "Tidak Lulus",
      tindakan: "PRF-2024-003",
    },
    {
      Nama: "Noraini binti Hassan",
      IC: "900201-1456",
      Kategori: "Gharimin",
      JumlahBantuan: 1200,
      status: "Lulus",
      tindakan: "PRF-2024-004",
    },
    {
      Nama: "Zulkifli bin Omar",
      IC: "870305-1122",
      Kategori: "Fisabilillah",
      JumlahBantuan: 1800,
      status: "Dalam Permohonan",
      tindakan: "PRF-2024-005",
    },
  ]);
  
  // Computed properties
  const filteredApplications = computed(() => {
    let filtered = [...applications.value];
  
    // Apply search filter
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      filtered = filtered.filter(app => 
        app.name.toLowerCase().includes(query) ||
        app.newIC.toLowerCase().includes(query) ||
        app.familyCategory.toLowerCase().includes(query) ||
        (app.status && app.status.toLowerCase().includes(query))
      );
    }
  
    return filtered;
  });
  
  // Utility functions
  const getStatusVariant = (status) => {
    const variants = {
      "Dalam Permohonan": "warning",
      "Lulus": "success",
      "Tidak Lulus": "danger",
    };
    return variants[status] || "default";
  };
  
  const handleView = (id) => {
    router.push('/BF-PRF/AS/QB/03');
  };
  </script>
  