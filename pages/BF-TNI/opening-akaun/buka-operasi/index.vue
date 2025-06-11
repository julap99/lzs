<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Senarai Buka Operasi</h2>
        </div>
      </template>

      <template #body>
        <!-- Filter Panel -->
        <div class="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <!-- ID Akaun Peti Besi -->
            <FormKit
              type="text"
              name="idAkaun"
              label="ID Akaun Peti Besi"
              placeholder="Cari ID akaun..."
            />

            <!-- Lokasi / Cawangan -->
            <FormKit
              type="text"
              name="lokasi"
              label="Lokasi / Cawangan"
              placeholder="Cari lokasi..."
            />

            <!-- Status Operasi -->
            <FormKit
              type="select"
              name="statusOperasi"
              label="Status Operasi"
              :options="[
                { label: 'Aktif', value: 'aktif' },
                { label: 'Tidak Aktif', value: 'tidak_aktif' }
              ]"
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
          :data="safeBoxList"
          :pageSize="10"
          :showNoColumn="true"
          :options="{
            variant: 'default',
            hover: true,
          }"
        >
          <template v-slot:idAkaun="data">
            {{ data.text }}
          </template>

          <template v-slot:lokasi="data">
            {{ data.text }}
          </template>

          <template v-slot:statusOperasi="data">
            <rs-badge :variant="getStatusVariant(data.text)">
              {{ data.text }}
            </rs-badge>
          </template>

          <template v-slot:tarikhMasaBukaOperasi="data">
            <div>
              <div class="font-medium">{{ formatDate(data.text) }}</div>
              <div class="text-sm text-gray-500">{{ formatTime(data.text) }}</div>
            </div>
          </template>

          <template v-slot:namaPengguna="data">
            {{ data.text }}
          </template>

          <template v-slot:tindakan="data">
            <div class="flex space-x-2">
              <rs-button
                variant="primary"
                size="sm"
                class="!px-2 !py-1"
                :disabled="data.text.status === 'Aktif'"
                @click="openOperation(data.text)"
              >
                Buka Operasi
              </rs-button>
            </div>
          </template>
        </rs-table>
      </template>
    </rs-card>

    <!-- Confirmation Modal -->
    <rs-modal
      v-model="showConfirmationModal"
      title="Sahkan Buka Operasi"
      size="md"
      position="center"
    >
      <template #body>
        <p>Anda pasti ingin memulakan sesi Buka Operasi untuk Akaun Peti Besi <strong>{{ selectedSafeBox?.idAkaun }}</strong>?</p>
      </template>
      <template #footer>
        <div class="flex justify-end space-x-2">
          <rs-button variant="primary-outline" @click="showConfirmationModal = false">
            Batal
          </rs-button>
          <rs-button variant="primary" @click="handleConfirm">
            Sahkan
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

definePageMeta({
  title: "Senarai Buka Operasi",
});

const breadcrumb = ref([
  {
    name: "Pentadbiran",
    type: "link",
    path: "/BF-TNI/opening-akaun",
  },
  {
    name: "Buka Operasi",
    type: "current",
    path: "/BF-TNI/opening-akaun/buka-operasi",
  },
]);

// Table data and reactivity control
const tableKey = ref(0);
const safeBoxList = ref([
  {
    idAkaun: "PB001",
    lokasi: "Cawangan Kuala Lumpur",
    statusOperasi: "Tidak Aktif",
    tarikhMasaBukaOperasi: new Date().toISOString(),
    namaPengguna: "Ahmad bin Abdullah",
    tindakan: { id: "PB001", status: "Tidak Aktif" }
  },
  {
    idAkaun: "PB002",
    lokasi: "Cawangan Johor Bahru",
    statusOperasi: "Aktif",
    tarikhMasaBukaOperasi: new Date().toISOString(),
    namaPengguna: "Siti binti Ali",
    tindakan: { id: "PB002", status: "Aktif" }
  }
]);

// Modal control
const showConfirmationModal = ref(false);
const selectedSafeBox = ref(null);

// Methods
const handleSearch = () => {
  // Implement search logic
  tableKey.value++; // Force table refresh
};

const handleReset = () => {
  // Reset form fields
  tableKey.value++; // Force table refresh
};

const openOperation = (safeBox) => {
  selectedSafeBox.value = safeBox;
  showConfirmationModal.value = true;
};

const handleConfirm = async () => {
  showConfirmationModal.value = false;
  // Navigate to balance check page
  navigateTo(`/BF-TNI/opening-akaun/buka-operasi/semak-baki/${selectedSafeBox.value.id}`);
};

// Helper functions
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

const getStatusVariant = (status) => {
  switch (status.toLowerCase()) {
    case 'aktif':
      return 'success';
    case 'tidak aktif':
      return 'danger';
    default:
      return 'default';
  }
};
</script>

<style lang="scss" scoped></style>
