<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Senarai Arahan Aktif - Terima & Sahkan Penerimaan Tunai</h2>
        </div>
      </template>

      <template #body>
        <!-- Filter Panel -->
        <div class="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <!-- Kod Cawangan / Peti Besi -->
            <FormKit
              type="text"
              name="kodCawangan"
              label="Kod Cawangan / Peti Besi"
              placeholder="Cari kod cawangan..."
            />

            <!-- Status Terimaan -->
            <FormKit
              type="select"
              name="statusTerimaan"
              label="Status Terimaan"
              :options="[
                { label: 'Diterima', value: 'diterima' },
                { label: 'Gagal', value: 'gagal' },
                { label: 'Ditangguh', value: 'ditangguh' },
                { label: 'Belum Diterima', value: 'belum_diterima' }
              ]"
            />

            <!-- Tarikh Pindahan -->
            <FormKit
              type="date"
              name="tarikhPindahan"
              label="Tarikh Pindahan"
              range
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
          :data="instructionList"
          :pageSize="10"
          :showNoColumn="true"
          :options="{
            variant: 'default',
            hover: true,
          }"
        >
          <template v-slot:kodCawangan="data">
            {{ data.text }}
          </template>

          <template v-slot:jenisAkaun="data">
            {{ data.text }}
          </template>

          <template v-slot:jumlahTunai="data">
            <div class="font-medium text-right">
              RM {{ formatNumber(data.text) }}
            </div>
          </template>

          <template v-slot:namaPegawai="data">
            {{ data.text }}
          </template>

          <template v-slot:tarikhMasaPindahan="data">
            <div>
              <div class="font-medium">{{ formatDate(data.text) }}</div>
              <div class="text-sm text-gray-500">{{ formatTime(data.text) }}</div>
            </div>
          </template>

          <template v-slot:rujukan="data">
            <a 
              href="#" 
              class="text-primary-600 hover:text-primary-800"
              @click.prevent="viewReference(data.text)"
            >
              {{ data.text }}
            </a>
          </template>

          <template v-slot:statusTerimaan="data">
            <rs-badge :variant="getStatusVariant(data.text)">
              {{ data.text }}
            </rs-badge>
          </template>

          <template v-slot:tindakan="data">
            <div class="flex space-x-2">
              <rs-button
                variant="primary"
                size="sm"
                class="!px-2 !py-1"
                :disabled="data.text.isConfirmed"
                @click="confirmReceipt(data.text.id)"
              >
                <Icon name="material-symbols:check-circle" size="15" class="mr-1" />
                Sahkan Penerimaan
              </rs-button>
            </div>
          </template>
        </rs-table>
      </template>
    </rs-card>

    <!-- Confirmation Dialog -->
    <rs-dialog
      v-model="showConfirmationDialog"
      title="Pengesahan Penerimaan Tunai"
      size="lg"
    >
      <template #body>
        <!-- Read-Only Information Section -->
        <div class="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <h3 class="text-lg font-semibold mb-4">Maklumat Pengeluaran Tunai</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">ID Pengeluaran Tunai</label>
                <div class="mt-1 text-gray-900">{{ selectedWithdrawal.id }}</div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Lokasi / Akaun Peti Besi</label>
                <div class="mt-1 text-gray-900">{{ selectedWithdrawal.location }}</div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Jumlah Tunai Dikeluarkan (RM)</label>
                <div class="mt-1 text-gray-900 font-medium">RM {{ formatNumber(selectedWithdrawal.amount) }}</div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Nama Pengguna (PKP)</label>
                <div class="mt-1 text-gray-900">{{ selectedWithdrawal.pkpName }}</div>
              </div>
            </div>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Nama PIC Penerima Tunai</label>
                <div class="mt-1 text-gray-900">{{ selectedWithdrawal.receiverName }}</div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Tujuan Pengeluaran</label>
                <div class="mt-1 text-gray-900">{{ selectedWithdrawal.purpose }}</div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Tarikh & Masa Pengeluaran</label>
                <div class="mt-1">
                  <div class="text-gray-900">{{ formatDate(selectedWithdrawal.withdrawalDateTime) }}</div>
                  <div class="text-sm text-gray-500">{{ formatTime(selectedWithdrawal.withdrawalDateTime) }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Confirmation Form Section -->
        <div class="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <h3 class="text-lg font-semibold mb-4">Borang Pengesahan</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormKit
              type="select"
              name="confirmationStatus"
              label="Status Pengesahan"
              :options="[
                { label: 'Disahkan', value: 'confirmed' },
                { label: 'Tidak Disahkan', value: 'not_confirmed' }
              ]"
              validation="required"
              validation-label="Status Pengesahan"
            />

            <div>
              <label class="block text-sm font-medium text-gray-700">Tarikh & Masa Pengesahan</label>
              <div class="mt-1">
                <div class="text-gray-900">{{ formatDate(confirmationData.confirmationDateTime) }}</div>
                <div class="text-sm text-gray-500">{{ formatTime(confirmationData.confirmationDateTime) }}</div>
              </div>
            </div>

            <div class="md:col-span-2">
              <FormKit
                type="textarea"
                name="additionalNotes"
                label="Catatan Tambahan"
                placeholder="Masukkan catatan tambahan jika ada..."
                rows="3"
              />
            </div>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex justify-end space-x-2">
          <rs-button variant="secondary" @click="showConfirmationDialog = false">
            Batal
          </rs-button>
          <rs-button variant="primary" @click="handleSaveConfirmation">
            <Icon name="material-symbols:save" class="mr-1" /> Simpan Pengesahan
          </rs-button>
        </div>
      </template>
    </rs-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

definePageMeta({
  title: "Senarai Arahan Aktif - Terima & Sahkan Penerimaan Tunai",
});

const breadcrumb = ref([
  {
    name: "Pentadbiran",
    type: "link",
    path: "/BF-TNI/opening-akaun",
  },
  {
    name: "Opening Akaun",
    type: "link",
    path: "/BF-TNI/opening-akaun",
  },
  {
    name: "Terima & Sahkan Penerimaan Tunai",
    type: "current",
    path: "/BF-TNI/opening-akaun/terima-sah-penerimaan-tunai",
  },
]);

// Table data and reactivity control
const tableKey = ref(0);
const showConfirmationDialog = ref(false);
const selectedWithdrawal = ref({});
const confirmationData = ref({
  confirmationDateTime: new Date().toISOString(),
});

const instructionList = ref([
  {
    kodCawangan: "PB001",
    jenisAkaun: "Amil",
    jumlahTunai: 5000,
    namaPegawai: "Ahmad bin Abdullah",
    tarikhMasaPindahan: new Date().toISOString(),
    rujukan: "KT-04-2024-001",
    statusTerimaan: "Belum Diterima",
    tindakan: { id: "AR-2024-001", isConfirmed: false }
  },
  {
    kodCawangan: "PB002",
    jenisAkaun: "Operasi Daerah",
    jumlahTunai: 3000,
    namaPegawai: "Siti binti Ali",
    tarikhMasaPindahan: new Date().toISOString(),
    rujukan: "KT-04-2024-002",
    statusTerimaan: "Diterima",
    tindakan: { id: "AR-2024-002", isConfirmed: true }
  }
]);

// Methods
const handleSearch = () => {
  // Implement search logic
  tableKey.value++; // Force table refresh
};

const handleReset = () => {
  // Reset form fields
  tableKey.value++; // Force table refresh
};

const viewReference = (reference) => {
  // Implement view reference logic
  console.log("Viewing reference:", reference);
};

const confirmReceipt = (id) => {
  // Navigate to confirmation page
  navigateTo(`/BF-TNI/opening-akaun/terima-sah-penerimaan-tunai/sahkan/${id}`);
};

const handleSaveConfirmation = async () => {
  try {
    // Implement save confirmation logic
    console.log("Saving confirmation...");
    showConfirmationDialog.value = false;
    tableKey.value++; // Refresh table
  } catch (error) {
    console.error("Error saving confirmation:", error);
  }
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

const getStatusVariant = (status) => {
  switch (status.toLowerCase()) {
    case 'diterima':
      return 'success';
    case 'gagal':
      return 'danger';
    case 'ditangguh':
      return 'warning';
    case 'belum diterima':
      return 'default';
    default:
      return 'default';
  }
};
</script>

<style lang="scss" scoped></style>
