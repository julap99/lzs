<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Sejarah Surat Arahan</h2>
        </div>
      </template>

      <template #body>
        <!-- Filter Panel -->
        <div class="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <!-- Daerah / Cawangan -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">Daerah / Cawangan</label>
              <div class="relative">
                <div 
                  class="flex items-center justify-between w-full px-3 py-2 border border-gray-300 rounded-md cursor-pointer hover:border-primary-500"
                  @click="showDaerahDropdown = !showDaerahDropdown"
                >
                  <div class="flex flex-wrap gap-1">
                    <template v-if="selectedDaerah.length > 0">
                      <rs-badge
                        v-for="item in selectedDaerah"
                        :key="item.value"
                        variant="primary"
                        class="flex items-center gap-1"
                      >
                        {{ item.label }}
                        <Icon 
                          name="material-symbols:close" 
                          size="14" 
                          class="cursor-pointer"
                          @click.stop="removeDaerah(item)"
                        />
                      </rs-badge>
                    </template>
                    <span v-else class="text-gray-500">Pilih Daerah / Cawangan</span>
                  </div>
                  <Icon 
                    :name="showDaerahDropdown ? 'material-symbols:expand-less' : 'material-symbols:expand-more'" 
                    size="20"
                  />
                </div>
                
                <!-- Dropdown Menu -->
                <div 
                  v-if="showDaerahDropdown"
                  class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
                >
                  <div class="p-2">
                    <FormKit
                      type="text"
                      v-model="daerahSearch"
                      placeholder="Cari daerah / cawangan..."
                      outer-class="mb-2"
                    />
                    <div class="space-y-1">
                      <div
                        v-for="item in filteredDaerahOptions"
                        :key="item.value"
                        class="flex items-center px-3 py-2 hover:bg-gray-100 rounded cursor-pointer"
                        @click="toggleDaerah(item)"
                      >
                        <input
                          type="checkbox"
                          :checked="isDaerahSelected(item)"
                          class="mr-2"
                          @click.stop
                        />
                        <span>{{ item.label }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Tarikh Arahan -->
            <FormKit
              type="date"
              name="tarikhArahan"
              label="Tarikh Arahan"
              range
              outer-class="mb-0"
            />

            <!-- Nama Pegawai -->
            <FormKit
              type="text"
              name="namaPegawai"
              label="Nama Pegawai Yang Diberi Kuasa"
              outer-class="mb-0"
            />

            <!-- No. Kad Pengenalan -->
            <FormKit
              type="text"
              name="noKp"
              label="No. Kad Pengenalan Pegawai"
              outer-class="mb-0"
            />

            <!-- Status Surat -->
            <FormKit
              type="select"
              name="statusSurat"
              label="Status Surat"
              :options="statusSuratOptions"
              outer-class="mb-0"
            />

            <!-- Action Buttons -->
            <div class="flex items-end space-x-2">
              <rs-button variant="primary" @click="handleSearch">
                <Icon name="material-symbols:search" class="mr-1" /> Cari
              </rs-button>
              <rs-button variant="secondary" @click="handleReset">
                <Icon name="material-symbols:refresh" class="mr-1" /> Reset
              </rs-button>
            </div>
          </div>
        </div>

        <!-- Table Section -->
        <rs-table
          class="mt-4"
          :key="tableKey"
          :data="suratArahanList"
          :pageSize="10"
          :showNoColumn="true"
          :options="{
            variant: 'default',
            hover: true,
          }"
        >
          <template v-slot:rujukan="data">
            <div>
              <div class="font-medium">{{ data.text.rujukan }}</div>
              <div class="text-sm text-gray-500">ID: {{ data.text.idArahan }}</div>
            </div>
          </template>

          <template v-slot:daerahCawangan="data">
            <div>
              <div class="font-medium">{{ data.text.nama }}</div>
              <div class="text-sm text-gray-500">Kod: {{ data.text.kod }}</div>
            </div>
          </template>

          <template v-slot:lokasiPengambilan="data">
            {{ data.text }}
          </template>

          <template v-slot:pegawai="data">
            <div>
              <div class="font-medium">{{ data.text.nama }}</div>
              <div class="text-sm text-gray-500">No. KP: {{ data.text.noKp }}</div>
            </div>
          </template>

          <template v-slot:noTelefon="data">
            {{ data.text }}
          </template>

          <template v-slot:jumlahWang="data">
            <div class="font-medium text-right">
              RM {{ formatNumber(data.text) }}
            </div>
          </template>

          <template v-slot:tarikhMasa="data">
            <div>
              <div class="font-medium">{{ formatDate(data.text) }}</div>
              <div class="text-sm text-gray-500">{{ formatTime(data.text) }}</div>
            </div>
          </template>

          <template v-slot:status="data">
            <rs-badge :variant="getStatusVariant(data.text)">
              {{ data.text }}
            </rs-badge>
          </template>

          <template v-slot:lastDownload="data">
            <div v-if="data.text">
              <div class="font-medium">{{ formatDate(data.text) }}</div>
              <div class="text-sm text-gray-500">{{ formatTime(data.text) }}</div>
            </div>
            <span v-else class="text-gray-400">-</span>
          </template>

          <template v-slot:tindakan="data">
            <div class="flex space-x-2">
              <rs-button
                v-if="data.text.hasPdf"
                variant="primary"
                size="sm"
                class="!px-2 !py-1"
                @click="downloadPdf(data.text.id)"
              >
                <Icon name="material-symbols:download" size="15" class="mr-1" />
                Muat Turun PDF
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
  title: "Sejarah Surat Arahan",
});

const breadcrumb = ref([
  {
    name: "Pentadbiran",
    type: "link",
    path: "/BF-TNI/peti-besi",
  },
  {
    name: "Peti Besi",
    type: "link",
    path: "/BF-TNI/peti-besi",
  },
  {
    name: "Konfigurasi",
    type: "link",
    path: "/BF-TNI/peti-besi/konfigurasi",
  },
  {
    name: "Surat Arahan",
    type: "current",
    path: "/BF-TNI/peti-besi/konfigurasi/surat-arahan",
  },
]);

// Table data and reactivity control
const tableKey = ref(0);
const suratArahanList = ref([
  {
    rujukan: { rujukan: "PB-2024-001", idArahan: "AR-2024-001" },
    daerahCawangan: { nama: "Daerah Kuala Lumpur", kod: "KL001" },
    lokasiPengambilan: "Cawangan Kuala Lumpur",
    pegawai: { nama: "Ahmad bin Abdullah", noKp: "880101121234" },
    noTelefon: "0123456789",
    jumlahWang: 5000,
    tarikhMasa: new Date().toISOString(),
    status: "Dijana",
    lastDownload: new Date().toISOString(),
    tindakan: { id: "AR-2024-001", hasPdf: true }
  },
  {
    rujukan: { rujukan: "PB-2024-002", idArahan: "AR-2024-002" },
    daerahCawangan: { nama: "Daerah Selangor", kod: "SGR001" },
    lokasiPengambilan: "Cawangan Shah Alam",
    pegawai: { nama: "Siti binti Ali", noKp: "880202121234" },
    noTelefon: "0123456788",
    jumlahWang: 3000,
    tarikhMasa: new Date().toISOString(),
    status: "Tidak Dijana",
    lastDownload: null,
    tindakan: { id: "AR-2024-002", hasPdf: false }
  }
]);

// Filter options
const daerahCawanganOptions = [
  { label: "Daerah Kuala Lumpur", value: "KL001" },
  { label: "Daerah Selangor", value: "SGR001" },
  { label: "Daerah Johor", value: "JHR001" }
];

const statusSuratOptions = [
  { label: "Dijana", value: "dijana" },
  { label: "Tidak Dijana", value: "tidak_dijana" },
  { label: "Gagal", value: "gagal" }
];

// Filter state
const showDaerahDropdown = ref(false);
const daerahSearch = ref("");
const selectedDaerah = ref([]);

// Computed property for filtered daerah options
const filteredDaerahOptions = computed(() => {
  if (!daerahSearch.value) return daerahCawanganOptions;
  
  const search = daerahSearch.value.toLowerCase();
  return daerahCawanganOptions.filter(option => 
    option.label.toLowerCase().includes(search)
  );
});

// Methods for daerah selection
const toggleDaerah = (item) => {
  const index = selectedDaerah.value.findIndex(d => d.value === item.value);
  if (index === -1) {
    selectedDaerah.value.push(item);
  } else {
    selectedDaerah.value.splice(index, 1);
  }
};

const removeDaerah = (item) => {
  const index = selectedDaerah.value.findIndex(d => d.value === item.value);
  if (index !== -1) {
    selectedDaerah.value.splice(index, 1);
  }
};

const isDaerahSelected = (item) => {
  return selectedDaerah.value.some(d => d.value === item.value);
};

// Methods
const handleSearch = () => {
  // Use selectedDaerah.value for search
  console.log('Selected Daerah:', selectedDaerah.value);
  // Implement other search logic...
  tableKey.value++; // Force table refresh
};

const handleReset = () => {
  selectedDaerah.value = [];
  daerahSearch.value = "";
  showDaerahDropdown.value = false;
  // Reset other form fields...
  tableKey.value++; // Force table refresh
};

const downloadPdf = (id) => {
  // Implement PDF download logic
  console.log("Downloading PDF for ID:", id);
};

// Helper functions
const formatNumber = (number) => {
  return new Intl.NumberFormat('ms-MY', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(number);
};

const formatDate = (dateTime) => {
  if (!dateTime) return "-";
  return new Date(dateTime).toLocaleDateString("ms-MY", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
};

const formatTime = (dateTime) => {
  if (!dateTime) return "-";
  return new Date(dateTime).toLocaleTimeString("ms-MY", {
    hour: "2-digit",
    minute: "2-digit"
  });
};

const formatDateTime = (dateTime) => {
  if (!dateTime) return "-";
  return new Date(dateTime).toLocaleString("ms-MY", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
};

const getStatusVariant = (status) => {
  switch (status.toLowerCase()) {
    case 'dijana':
      return 'success';
    case 'tidak dijana':
      return 'warning';
    case 'gagal':
      return 'danger';
    default:
      return 'default';
  }
};
</script>

<style lang="scss" scoped></style>
