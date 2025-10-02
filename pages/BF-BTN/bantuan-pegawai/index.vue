<template>
    <div>
      <LayoutsBreadcrumb :items="breadcrumb" />

      <!-- Search and Filter Card -->
      <rs-card class="mt-4">
        <template #header>
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold">Carian Bantuan</h2>
          </div>
        </template>

        <template #body>
          <div class="flex items-center gap-4">
            <!-- Filter Dropdown -->
            <div class="flex items-center gap-2">
              <label class="text-sm font-medium text-gray-700">Filter by</label>
              <FormKit
                v-model="selectedFilter"
                type="select"
                :options="filterOptions"
                :classes="{
                  wrapper: 'w-40',
                  outer: 'mb-0',
                  input: '!rounded-lg',
                }"
              />
            </div>
            
            <!-- Search Input -->
            <div class="flex-1">
              <FormKit
                v-model="searchQuery"
                type="text"
                :placeholder="searchPlaceholder"
                :classes="{
                  wrapper: 'w-full',
                  outer: 'mb-0',
                  input: '!rounded-lg',
                }"
              />
            </div>
            
            <!-- Search Button -->
            <rs-button
              variant="primary"
              @click="handleSearch"
              class="px-6"
            >
              Cari
            </rs-button>
          </div>
        </template>
      </rs-card>

      <!-- Search Results Table -->
      <rs-card v-if="showSearchResults" class="mt-4">
        <template #header>
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold">Hasil Carian</h2>
            <rs-button
              variant="secondary"
              @click="showSearchResults = false"
              class="px-4"
            >
              Tutup
            </rs-button>
          </div>
        </template>

        <template #body>
          <rs-table
            :data="searchResultsData"
            :columns="searchResultsColumns"
            :pageSize="10"
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
            
            <!-- Make bantuan no clickable when filtering by bantuan no -->
            <template v-if="selectedFilter === 'bantuanNo'" #[selectedFilter]="{ text }">
              <button
                @click="navigateToBantuan(text)"
                class="text-blue-600 hover:text-blue-800 hover:underline font-medium cursor-pointer"
              >
                {{ text }}
              </button>
            </template>
            
            <!-- Make PA no clickable when filtering by PA no -->
            <template v-if="selectedFilter === 'paNo'" #[selectedFilter]="{ text }">
              <button
                @click="navigateToPaymentAdvice(text)"
                class="text-blue-600 hover:text-blue-800 hover:underline font-medium cursor-pointer"
              >
                {{ text }}
              </button>
            </template>
            
            <!-- Make GL no clickable when filtering by GL no -->
            <template v-if="selectedFilter === 'glNo'" #[selectedFilter]="{ text }">
              <button
                @click="navigateToTuntutan(text, 'glNo')"
                class="text-blue-600 hover:text-blue-800 hover:underline font-medium cursor-pointer"
              >
                {{ text }}
              </button>
            </template>
            
            <!-- Make Invoice no clickable when filtering by Invoice no -->
            <template v-if="selectedFilter === 'invoiceNo'" #[selectedFilter]="{ text }">
              <button
                @click="navigateToTuntutan(text, 'invoiceNo')"
                class="text-blue-600 hover:text-blue-800 hover:underline font-medium cursor-pointer"
              >
                {{ text }}
              </button>
            </template>
            
            <!-- Make CI no clickable when filtering by CI no -->
            <template v-if="selectedFilter === 'ciNo'" #[selectedFilter]="{ text }">
              <button
                @click="navigateToCashIssuance(text)"
                class="text-blue-600 hover:text-blue-800 hover:underline font-medium cursor-pointer"
              >
                {{ text }}
              </button>
            </template>
            
            <!-- Make No Pengenalan clickable when filtering by No Pengenalan -->
            <template v-if="selectedFilter === 'noPengenalan'" #[selectedFilter]="{ text }">
              <button
                @click="navigateToBantuanListing(text)"
                class="text-blue-600 hover:text-blue-800 hover:underline font-medium cursor-pointer"
              >
                {{ text }}
              </button>
            </template>
          </rs-table>
        </template>
      </rs-card>

      <!-- Senarai Bantuan Card -->
      <rs-card v-if="!showSearchResults" class="mt-4">
        <template #header>
          <div class="flex justify-between items-center">
            <!-- <h2 class="text-xl font-semibold">Senarai Bantuan</h2> -->
          </div>
        </template>
  
        <template #body>
          <!-- Custom Tabs Component -->
          <div class="bg-gray-50 p-6 rounded-lg">
            <!-- Tab Header -->
            <div class="flex items-center gap-3 mb-2">
              <div
                class="w-6 h-6 bg-teal-500 rounded flex items-center justify-center"
              >
                <svg
                  class="w-4 h-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"
                  />
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-800">Senarai Bantuan</h3>
            </div>
  
            <!-- Tab Description -->
            <!-- <p class="text-gray-600 mb-6">Tabs are used to organize content into different sections.</p> -->
  
            <!-- Tab Navigation -->
            <div class="flex border-b border-gray-200 mb-6">
              <button
                v-for="(tab, index) in tabs"
                :key="index"
                @click="activeTab = tab.id"
                :class="[
                  'px-6 py-3 text-sm font-medium transition-colors duration-200',
                  activeTab === tab.id
                    ? 'text-teal-600 border-b-2 border-teal-600'
                    : 'text-gray-700 hover:text-gray-900',
                ]"
              >
                {{ tab.title }}
              </button>
            </div>
  
            <!-- Tab Content -->
            <div class="tab-content">
              <!-- Permohonan Tab -->
              <div v-if="activeTab === 'permohonan'" class="space-y-4">
                <h4 class="text-lg font-semibold text-gray-800">Permohonan</h4>
                <!-- <p class="text-gray-600">This tab displays the applications submitted for assistance.</p> -->
  
                <!-- Applications Table -->
                <rs-table
                  :data="filteredPermohonanData"
                  :columns="bantuanColumns"
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
  
                  <template v-slot:aksi="{ text }">
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
                        variant="danger"
                        size="sm"
                        class="p-1 flex gap-2"
                        @click="handleCancel(text)"
                      >
                        Batal
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
                      {{ paginationEndPermohonan }} daripada
                      {{ totalPermohonanData }} entri
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
                        :disabled="currentPage === totalPagesPermohonan"
                        @click="currentPage++"
                      >
                        <Icon name="ic:round-keyboard-arrow-right" />
                      </rs-button>
                    </div>
                  </div>
                </div>
              </div>
  
              <!-- Lulus Tab -->
              <div v-if="activeTab === 'lulus'" class="space-y-4">
                <h4 class="text-lg font-semibold text-gray-800">Lulus</h4>
                <p class="text-gray-600">
                  This tab displays the approved applications.
                </p>
  
                <!-- Applications Table -->
                <rs-table
                  :data="filteredLulusData"
                  :columns="bantuanColumns"
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
  
                  <template v-slot:aksi="{ text }">
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
                        variant="danger"
                        size="sm"
                        class="p-1 flex gap-2"
                        @click="handleCancel(text)"
                      >
                        Batal
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
                      {{ paginationEndLulus }} daripada {{ totalLulusData }} entri
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
                        :disabled="currentPage === totalPagesLulus"
                        @click="currentPage++"
                      >
                        <Icon name="ic:round-keyboard-arrow-right" />
                      </rs-button>
                    </div>
                  </div>
                </div>
              </div>
  
              <!-- Ditolak Tab -->
              <div v-if="activeTab === 'ditolak'" class="space-y-4">
                <h4 class="text-lg font-semibold text-gray-800">Ditolak</h4>
                <p class="text-gray-600">
                  This tab displays the rejected applications.
                </p>
  
                <!-- Applications Table -->
                <rs-table
                  :data="filteredDitolakData"
                  :columns="bantuanColumns"
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
  
                  <template v-slot:aksi="{ text }">
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
                        variant="danger"
                        size="sm"
                        class="p-1 flex gap-2"
                        @click="handleCancel(text)"
                      >
                        Batal
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
                      {{ paginationEndDitolak }} daripada
                      {{ totalDitolakData }} entri
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
                        :disabled="currentPage === totalPagesDitolak"
                        @click="currentPage++"
                      >
                        <Icon name="ic:round-keyboard-arrow-right" />
                      </rs-button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </rs-card>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from "vue";
  
  definePageMeta({
    title: "Senarai Bantuan",
  });
  
  const breadcrumb = ref([
    {
      name: "Bantuan",
      type: "link",
      path: "/BF-BTN/bantuan",
    },
    {
      name: "Senarai",
      type: "current",
      path: "/BF-BTN/bantuan",
    },
  ]);
  
  // Tab configuration
  const tabs = [
    { id: "permohonan", title: "Permohonan" },
    { id: "lulus", title: "Lulus" },
    { id: "ditolak", title: "Ditolak" },
  ];
  
  const activeTab = ref("permohonan");
  
  // Table columns configuration for Bantuan tabs
  const bantuanColumns = [
    {
      key: "noBantuan",
      label: "No Bantuan",
      sortable: true,
    },
    {
      key: "namaBantuan",
      label: "Nama Bantuan",
      sortable: true,
    },
    {
      key: "status",
      label: "Status Permohonan",
      sortable: true,
    },
    {
      key: "kekerapan",
      label: "Kekerapan",
      sortable: true,
    },
    {
      key: "tarikhPermohonan",
      label: "Tarikh Permohonan",
      sortable: true,
    },
    {
      key: "aksi",
      label: "Aksi",
      sortable: false,
    },
  ];
  
  // State
  const searchQuery = ref("");
  const selectedFilter = ref("bantuanNo");
  const showSearchResults = ref(false);
  const filters = ref({
    status: "",
  });
  const currentPage = ref(1);
  const pageSize = ref(10);

  // Filter options
  const filterOptions = [
    { label: "Bantuan No", value: "bantuanNo" },
    { label: "GL No", value: "glNo" },
    { label: "Invoice No", value: "invoiceNo" },
    { label: "PA No", value: "paNo" },
    { label: "CI No", value: "ciNo" },
    { label: "No Pengenalan / Nama", value: "noPengenalan" },
  ];

  // Computed property for search placeholder
  const searchPlaceholder = computed(() => {
    const filter = filterOptions.find(f => f.value === selectedFilter.value);
    if (filter?.value === "noPengenalan") {
      return "Carian Bantuan by No Pengenalan/Nama...";
    }
    return filter ? `Carian ${filter.label}...` : "Carian...";
  });

  // Computed property for search results columns
  const searchResultsColumns = computed(() => {
    // Only show the specific columns you requested
    const columns = [
      {
        key: selectedFilter.value,
        label: filterOptions.find(f => f.value === selectedFilter.value)?.label || "Filter",
        sortable: true,
      },
      {
        key: "maklumatBantuan",
        label: "Maklumat Bantuan",
        sortable: true,
      },
      {
        key: "pemohon",
        label: "Pemohon",
        sortable: true,
      },
      {
        key: "namaPemohon",
        label: "Nama Pemohon",
        sortable: true,
      },
      {
        key: "noPengenalanPemohon",
        label: "No Pengenalan Pemohon",
        sortable: true,
      },
      {
        key: "namaPenerima",
        label: "Nama Penerima",
        sortable: true,
      },
      {
        key: "status",
        label: "Status",
        sortable: true,
      },
    ];

    return columns;
  });

  // Sample data for search results
  const searchResultsSampleData = ref([
    {
      noBantuan: "NAS-2025-0001",
      namaBantuan: "Bantuan Keperluan Hidup (Fakir)",
      status: "Dalam Semakan",
      glNo: "GL-2025-0001",
      invoiceNo: "INV-2025-0001",
      paNo: "PA-2025-0001",
      ciNo: "CI-2025-0001",
      noPengenalan: "123456789012",
      pemohon: "Asnaf",
      namaPemohon: "Ahmad bin Ali",
      noPengenalanPemohon: "123456789012",
      namaPenerima: "Ahmad bin Ali",
    },
    {
      noBantuan: "NAS-2025-0002",
      namaBantuan: "Bantuan Kewangan Bulanan (Fakir)",
      status: "Dalam Siasatan",
      glNo: "GL-2025-0002",
      invoiceNo: "INV-2025-0002",
      paNo: "PA-2025-0002",
      ciNo: "CI-2025-0002",
      noPengenalan: "987654321098",
      pemohon: "Organisasi",
      namaPemohon: "Masjid Al-Ikhlas",
      noPengenalanPemohon: "SSM-123456789",
      namaPenerima: "Masjid Al-Ikhlas",
    },
    {
      noBantuan: "NAS-2025-0003",
      namaBantuan: "Bantuan Pendidikan Anak Yatim",
      status: "Dalam Kelulusan",
      glNo: "GL-2025-0003",
      invoiceNo: "INV-2025-0003",
      paNo: "PA-2025-0003",
      ciNo: "CI-2025-0003",
      noPengenalan: "456789123456",
      pemohon: "Asnaf",
      namaPemohon: "Siti binti Hassan",
      noPengenalanPemohon: "456789123456",
      namaPenerima: "Siti binti Hassan",
    },
    {
      noBantuan: "NAS-2025-0004",
      namaBantuan: "Bantuan Perubatan Khas",
      status: "Selesai",
      glNo: "GL-2025-0004",
      invoiceNo: "INV-2025-0004",
      paNo: "PA-2025-0004",
      ciNo: "CI-2025-0004",
      noPengenalan: "789123456789",
      pemohon: "Organisasi",
      namaPemohon: "Surau Al-Hidayah",
      noPengenalanPemohon: "SSM-987654321",
      namaPenerima: "Surau Al-Hidayah",
    },
    {
      noBantuan: "NAS-2025-0005",
      namaBantuan: "Bantuan BaikPulih Rumah AM (Miskin)",
      status: "Selesai",
      glNo: "GL-2025-0005",
      invoiceNo: "INV-2025-0005",
      paNo: "PA-2025-0005",
      ciNo: "CI-2025-0005",
      noPengenalan: "111222333444",
      pemohon: "Asnaf",
      namaPemohon: "Mohd bin Abdullah",
      noPengenalanPemohon: "111222333444",
      namaPenerima: "Mohd bin Abdullah",
    },
  ]);

  // Helper function to get the correct field value based on filter
  const getFilterValue = (app, filterType) => {
    switch (filterType) {
      case "bantuanNo":
        return app.noBantuan;
      case "glNo":
        return app.glNo;
      case "invoiceNo":
        return app.invoiceNo;
      case "paNo":
        return app.paNo;
      case "ciNo":
        return app.ciNo;
      case "noPengenalan":
        return app.noPengenalan;
      default:
        return "";
    }
  };

  // Computed property for search results data
  const searchResultsData = computed(() => {
    // For testing, show all data if no query, otherwise filter
    if (!searchQuery.value) {
      return searchResultsSampleData.value.map((app, index) => ({
        // Only include the fields that will be displayed
        [selectedFilter.value]: getFilterValue(app, selectedFilter.value),
        maklumatBantuan: app.namaBantuan,
        pemohon: app.pemohon,
        namaPemohon: app.namaPemohon,
        noPengenalanPemohon: app.noPengenalanPemohon,
        namaPenerima: app.namaPenerima,
        status: app.status,
        // Always include bantuan number for navigation purposes
        noBantuan: app.noBantuan,
      }));
    }

    const query = searchQuery.value.toLowerCase();
    return searchResultsSampleData.value.filter((app) => {
      switch (selectedFilter.value) {
        case "bantuanNo":
          return app.noBantuan.toLowerCase().includes(query);
        case "glNo":
          return app.glNo?.toLowerCase().includes(query) || false;
        case "invoiceNo":
          return app.invoiceNo?.toLowerCase().includes(query) || false;
        case "paNo":
          return app.paNo?.toLowerCase().includes(query) || false;
        case "ciNo":
          return app.ciNo?.toLowerCase().includes(query) || false;
        case "noPengenalan":
          return app.noPengenalan?.toLowerCase().includes(query) || 
                 app.namaBantuan?.toLowerCase().includes(query) || false;
        default:
          return false;
      }
    }).map((app, index) => ({
      // Only include the fields that will be displayed
      [selectedFilter.value]: getFilterValue(app, selectedFilter.value),
      maklumatBantuan: app.namaBantuan,
      pemohon: app.pemohon,
      namaPemohon: app.namaPemohon,
      noPengenalanPemohon: app.noPengenalanPemohon,
      namaPenerima: app.namaPenerima,
      status: app.status,
      // Always include bantuan number for navigation purposes
      noBantuan: app.noBantuan,
    }));
  });
  
  // Mock data for Permohonan tab - applications with status: Permohonan Dihantar, Dalam Semakan, Dalam Siasatan, Dalam Kelulusan
  const permohonanData = ref([
    {
      noBantuan: "B001",
      namaBantuan: "Bantuan Makanan",
      status: "Permohonan Dihantar",
      kekerapan: "Bulanan",
      tarikhPermohonan: "2024-01-15",
      aksi: "B001",
    },
    {
      noBantuan: "B002",
      namaBantuan: "Bantuan Pendidikan",
      status: "Dalam Semakan",
      kekerapan: "Sekali",
      tarikhPermohonan: "2024-01-16",
      aksi: "B002",
    },
    {
      noBantuan: "B003",
      namaBantuan: "Bantuan Perubatan",
      status: "Dalam Siasatan",
      kekerapan: "Bulanan",
      tarikhPermohonan: "2024-01-17",
      aksi: "B003",
    },
    {
      noBantuan: "B004",
      namaBantuan: "Bantuan Rumah",
      status: "Dalam Kelulusan",
      kekerapan: "Sekali",
      tarikhPermohonan: "2024-01-18",
      aksi: "B004",
    },
  ]);
  
  // Mock data for Lulus tab - applications with status: Lulus
  const lulusData = ref([
    {
      noBantuan: "B005",
      namaBantuan: "Bantuan BaikPulih Rumah AM (Miskin)",
      status: "Lulus",
      kekerapan: "Sekali",
      tarikhPermohonan: "2024-01-10",
      aksi: "B005",
    },
    {
      noBantuan: "B006",
      namaBantuan: "Bantuan Kematian",
      status: "Lulus",
      kekerapan: "Sekali",
      tarikhPermohonan: "2024-01-12",
      aksi: "B006",
    },
    {
      noBantuan: "B007",
      namaBantuan: "Bantuan Kelahiran",
      status: "Lulus",
      kekerapan: "Sekali",
      tarikhPermohonan: "2024-01-14",
      aksi: "B007",
    },
    {
      noBantuan: "B010",
      namaBantuan: "(HQ) BANTUAN DERMASISWA SEKOLAH ASRAMA (FAKIR)",
      status: "Lulus",
      kekerapan: "Sekali",
      tarikhPermohonan: "2025-08-09",
      aksi: "B010",
    },
    {
      noBantuan: "B011",
      namaBantuan: "(HQ) DERMASISWA IPT DALAM NEGARA (FAKIR) - IPTA/IPTS)",
      status: "Lulus",
      kekerapan: "Sekali",
      tarikhPermohonan: "2025-09-09",
      aksi: "B011",
    },
  ]);
  
  // Mock data for Ditolak tab - applications with status: Tidak Lulus
  const ditolakData = ref([
    {
      noBantuan: "B008",
      namaBantuan: "Bantuan Perniagaan",
      status: "Tidak Lulus",
      kekerapan: "Sekali",
      tarikhPermohonan: "2024-01-05",
      aksi: "B008",
    },
  ]);
  
  // Simulasi Peranan (dropdown only, no logic)
  const selectedRole = ref("Penyemak");
  const roleOptions = [
    { label: "Penyemak", value: "Penyemak" },
    { label: "EOAD", value: "EOAD" },
    { label: "ETD", value: "ETD" },
    { label: "KOAD, KJ, KD", value: "KOAD,KJ,KD" },
  ];
  
  // Computed properties for Permohonan tab
  const filteredPermohonanData = computed(() => {
    let result = [...permohonanData.value];

    // Apply search based on selected filter
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      result = result.filter((app) => {
        switch (selectedFilter.value) {
          case "bantuanNo":
            return app.noBantuan.toLowerCase().includes(query);
          case "glNo":
            return app.glNo?.toLowerCase().includes(query) || false;
          case "invoiceNo":
            return app.invoiceNo?.toLowerCase().includes(query) || false;
          case "paNo":
            return app.paNo?.toLowerCase().includes(query) || false;
          case "ciNo":
            return app.ciNo?.toLowerCase().includes(query) || false;
          case "noPengenalan":
            return app.noPengenalan?.toLowerCase().includes(query) || 
                   app.namaBantuan?.toLowerCase().includes(query) || false;
          default:
            return (
              app.noBantuan.toLowerCase().includes(query) ||
              app.namaBantuan.toLowerCase().includes(query) ||
              app.status.toLowerCase().includes(query)
            );
        }
      });
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
  
  const totalPermohonanData = computed(() => {
    return permohonanData.value.length;
  });
  
  const totalPagesPermohonan = computed(() => {
    return Math.ceil(totalPermohonanData.value / pageSize.value);
  });
  
  const paginationStart = computed(() => {
    return (currentPage.value - 1) * pageSize.value + 1;
  });
  
  const paginationEndPermohonan = computed(() => {
    return Math.min(
      currentPage.value * pageSize.value,
      totalPermohonanData.value
    );
  });
  
  // Computed properties for Lulus tab
  const filteredLulusData = computed(() => {
    let result = [...lulusData.value];

    // Apply search based on selected filter
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      result = result.filter((app) => {
        switch (selectedFilter.value) {
          case "bantuanNo":
            return app.noBantuan.toLowerCase().includes(query);
          case "glNo":
            return app.glNo?.toLowerCase().includes(query) || false;
          case "invoiceNo":
            return app.invoiceNo?.toLowerCase().includes(query) || false;
          case "paNo":
            return app.paNo?.toLowerCase().includes(query) || false;
          case "ciNo":
            return app.ciNo?.toLowerCase().includes(query) || false;
          case "noPengenalan":
            return app.noPengenalan?.toLowerCase().includes(query) || 
                   app.namaBantuan?.toLowerCase().includes(query) || false;
          default:
            return (
              app.noBantuan.toLowerCase().includes(query) ||
              app.namaBantuan.toLowerCase().includes(query) ||
              app.status.toLowerCase().includes(query)
            );
        }
      });
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
  
  const totalLulusData = computed(() => {
    return lulusData.value.length;
  });
  
  const totalPagesLulus = computed(() => {
    return Math.ceil(totalLulusData.value / pageSize.value);
  });
  
  const paginationEndLulus = computed(() => {
    return Math.min(currentPage.value * pageSize.value, totalLulusData.value);
  });
  
  // Computed properties for Ditolak tab
  const filteredDitolakData = computed(() => {
    let result = [...ditolakData.value];

    // Apply search based on selected filter
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      result = result.filter((app) => {
        switch (selectedFilter.value) {
          case "bantuanNo":
            return app.noBantuan.toLowerCase().includes(query);
          case "glNo":
            return app.glNo?.toLowerCase().includes(query) || false;
          case "invoiceNo":
            return app.invoiceNo?.toLowerCase().includes(query) || false;
          case "paNo":
            return app.paNo?.toLowerCase().includes(query) || false;
          case "ciNo":
            return app.ciNo?.toLowerCase().includes(query) || false;
          case "noPengenalan":
            return app.noPengenalan?.toLowerCase().includes(query) || 
                   app.namaBantuan?.toLowerCase().includes(query) || false;
          default:
            return (
              app.noBantuan.toLowerCase().includes(query) ||
              app.namaBantuan.toLowerCase().includes(query) ||
              app.status.toLowerCase().includes(query)
            );
        }
      });
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
  
  const totalDitolakData = computed(() => {
    return ditolakData.value.length;
  });
  
  const totalPagesDitolak = computed(() => {
    return Math.ceil(totalDitolakData.value / pageSize.value);
  });
  
  const paginationEndDitolak = computed(() => {
    return Math.min(currentPage.value * pageSize.value, totalDitolakData.value);
  });
  
  // Methods
  const handleSearch = () => {
    // Reset to first page when searching
    currentPage.value = 1;
    // Show search results table
    showSearchResults.value = true;
    // The search functionality is already reactive through computed properties
    // This method can be used for additional search logic if needed
    console.log("Searching with query:", searchQuery.value, "Filter:", selectedFilter.value);
    console.log("Search results data:", searchResultsData.value);
    console.log("Show search results:", showSearchResults.value);
  };

  const handleReview = (noBantuan) => {
    console.log("Review bantuan:", noBantuan);
    navigateTo(`/BF-BTN/mohon-bantuan/${noBantuan}`);
  };

  const navigateToBantuan = (bantuanNo) => {
    console.log("Navigate to bantuan:", bantuanNo);
    const url = `/BF-BTN/bantuan/${bantuanNo}?from=bantuan-pegawai`;
    console.log("Navigating to:", url);
    navigateTo(url);
  };

  const navigateToPaymentAdvice = (paNo) => {
    console.log("Navigate to payment advice:", paNo);
    // Find the bantuan number that corresponds to this PA number
    const matchingBantuan = searchResultsSampleData.value.find(item => item.paNo === paNo);
    if (matchingBantuan) {
      const bantuanNo = matchingBantuan.noBantuan;
      console.log("Found matching bantuan number:", bantuanNo, "for PA:", paNo);
      const url = `/BF-BTN/bantuan/${bantuanNo}?from=bantuan-pegawai&tab=payment`;
      console.log("Navigating to:", url);
      navigateTo(url);
    } else {
      console.error("Could not find bantuan number for PA:", paNo);
    }
  };

  const navigateToTuntutan = (number, type) => {
    console.log("Navigate to tuntutan:", number, "Type:", type);
    // Find the bantuan number that corresponds to this GL/Invoice number
    const matchingBantuan = searchResultsSampleData.value.find(item => {
      if (type === 'glNo') {
        return item.glNo === number;
      } else if (type === 'invoiceNo') {
        return item.invoiceNo === number;
      }
      return false;
    });
    
    if (matchingBantuan) {
      const bantuanNo = matchingBantuan.noBantuan;
      console.log("Found matching bantuan number:", bantuanNo, "for", type, ":", number);
      const url = `/BF-BTN/bantuan/${bantuanNo}?from=bantuan-pegawai&tab=tuntutan`;
      console.log("Navigating to:", url);
      navigateTo(url);
    } else {
      console.error("Could not find bantuan number for", type, ":", number);
    }
  };

  const navigateToCashIssuance = (ciNo) => {
    console.log("Navigate to cash issuance:", ciNo);
    // Find the bantuan number that corresponds to this CI number
    const matchingBantuan = searchResultsSampleData.value.find(item => item.ciNo === ciNo);
    if (matchingBantuan) {
      const bantuanNo = matchingBantuan.noBantuan;
      console.log("Found matching bantuan number:", bantuanNo, "for CI:", ciNo);
      const url = `/BF-BTN/bantuan/${bantuanNo}?from=bantuan-pegawai&tab=cash`;
      console.log("Navigating to:", url);
      navigateTo(url);
    } else {
      console.error("Could not find bantuan number for CI:", ciNo);
    }
  };

  const navigateToBantuanListing = (noPengenalan) => {
    console.log("Navigate to bantuan listing for No Pengenalan:", noPengenalan);
    const url = `/BF-BTN/bantuan`;
    console.log("Navigating to:", url);
    navigateTo(url);
  };

  const handleCancel = (noBantuan) => {
    console.log("Cancel bantuan:", noBantuan);
    // Handle cancel logic - would be replaced with actual implementation
    // You can add confirmation modal or API call here
  };
  
  
  const getStatusVariant = (status) => {
    const variants = {
      "permohonan dihantar": "info",
      "dalam semakan": "warning",
      "dalam siasatan": "warning",
      "dalam kelulusan": "secondary",
      lulus: "success",
      "tidak lulus": "danger",
      draf: "default",
    };
    return variants[status.toLowerCase()] || "default";
  };
  </script>
  
  <style lang="scss" scoped></style>
  