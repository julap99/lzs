<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Senarai Permohonan Saya</h2>
        </div>
      </template>

      <template #body>
        <!-- Main Table -->
        <rs-table
          :data="permohonanList"
          :options="{
            variant: 'default',
          }"
          :pageSize="pageSize"
          :show-no-column="true"
        >
          <template v-slot:idPermohonan="data">
            <a
              href="#"
              class="text-primary-600 hover:text-primary-800"
              @click.prevent="viewDetails(data.text)"
            >
              {{ data.text }}
            </a>
          </template>

          <template v-slot:tarikhPermohonan="data">
            {{ formatDate(data.text) }}
          </template>

          <template v-slot:jumlahTunai="data">
            <div class="font-medium text-right">
              RM {{ formatNumber(data.text) }}
            </div>
          </template>

          <template v-slot:status="data">
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
                @click="viewDetails(data.value)"
              >
                Lihat Butiran
              </rs-button>
              <rs-button
                v-if="data.value.status === 'Diluluskan'"
                variant="success"
                size="sm"
                class="!px-2 !py-1"
                @click="handleRekodPengeluaran(data.value)"
              >
                Rekod Pengeluaran Tunai
              </rs-button>
              <rs-button
                v-if="data.value.status === 'Sedia untuk Agihan'"
                variant="info"
                size="sm"
                class="!px-2 !py-1"
                @click="handleRekodSerahan(data.value)"
              >
                Rekod Serahan Tunai
              </rs-button>
            </div>
          </template>
        </rs-table>
      </template>
    </rs-card>

    <!-- Rekod Pengeluaran Modal -->
    <rs-modal
      v-model="showPengeluaranModal"
      title="Rekod Pengeluaran Tunai"
      size="md"
      position="center"
    >
      <template #body>
        <FormKit
          type="form"
          :actions="false"
          @submit="submitPengeluaran"
          v-model="pengeluaranForm"
        >
          <FormKit
            type="text"
            label="Nama EOAD"
            v-model="pengeluaranForm.namaEoad"
            disabled
          />
          <FormKit
            type="datetime-local"
            label="Tarikh & Masa Pengeluaran"
            v-model="pengeluaranForm.tarikhMasa"
            validation="required"
          />
          <FormKit
            type="textarea"
            label="Catatan Tambahan"
            v-model="pengeluaranForm.catatan"
            placeholder="Masukkan catatan tambahan jika ada..."
          />
        </FormKit>
      </template>
      <template #footer>
        <div class="flex justify-end space-x-2">
          <rs-button
            variant="primary-outline"
            @click="showPengeluaranModal = false"
          >
            Batal
          </rs-button>
          <rs-button variant="primary" @click="submitPengeluaran">
            Sahkan Rekod Pengeluaran
          </rs-button>
        </div>
      </template>
    </rs-modal>

    <!-- Rekod Serahan Modal -->
    <rs-modal
      v-model="showSerahanModal"
      title="Rekod Serahan Tunai"
      size="md"
      position="center"
    >
      <template #body>
        <FormKit
          type="form"
          :actions="false"
          @submit="submitSerahan"
          v-model="serahanForm"
        >
          <FormKit
            type="text"
            label="Nama EOAD"
            v-model="serahanForm.namaEoad"
            disabled
          />
          <FormKit
            type="datetime-local"
            label="Tarikh & Masa Serahan"
            v-model="serahanForm.tarikhMasa"
            validation="required"
          />
          <FormKit
            type="number"
            label="Jumlah Sebenar Diagih (RM)"
            v-model="serahanForm.jumlahDiagih"
            validation="required|number|min:0"
          />
          <FormKit
            type="textarea"
            label="Catatan Pelaksanaan"
            v-model="serahanForm.catatan"
            placeholder="Masukkan catatan pelaksanaan jika ada..."
          />
          <FormKit
            type="file"
            label="Lampiran Bukti Gambar Agihan"
            v-model="serahanForm.buktiGambar"
            accept="image/*,.pdf"
            validation="required"
          />
          <div class="formkit-field">
            <label class="formkit-label">Tandatangan Digital Penerima</label>
            <SignaturePad v-model="serahanForm.tandatangan" />
            <div v-if="!serahanForm.tandatangan" class="formkit-message formkit-message-error">
              Tandatangan diperlukan
            </div>
          </div>
        </FormKit>
      </template>
      <template #footer>
        <div class="flex justify-end space-x-2">
          <rs-button
            variant="primary-outline"
            @click="showSerahanModal = false"
          >
            Batal
          </rs-button>
          <rs-button variant="primary" @click="submitSerahan">
            Sahkan Rekod Serahan
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useToast } from "vue-toastification";
import SignaturePad from '~/components/SignaturePad.vue';

const toast = useToast();

// Breadcrumb
const breadcrumb = ref([
  {
    name: "Tunai Dilapangan",
    type: "link",
    path: "/BF-TNI/tunai-dilapangan",
  },
  {
    name: "Senarai Permohonan Saya",
    type: "current",
    path: "/BF-TNI/tunai-dilapangan/senarai-permohonan-saya",
  },
]);

// State
const isLoading = ref(false);
const pageSize = ref(10);
const currentPage = ref(1);
const totalRecords = ref(0);
const permohonanList = ref([]);

// Modal States
const showPengeluaranModal = ref(false);
const showSerahanModal = ref(false);
const selectedPermohonan = ref(null);

// Form Data
const pengeluaranForm = ref({
  namaEoad: "",
  tarikhMasa: "",
  catatan: "",
});

const serahanForm = ref({
  namaEoad: "",
  tarikhMasa: "",
  jumlahDiagih: "",
  catatan: "",
  buktiGambar: null,
  tandatangan: "",
});

// Methods
const fetchPermohonanList = async () => {
  isLoading.value = true;
  try {
    // Mock data for demonstration
    const mockData = [
      {
        idPermohonan: "TD-001",
        tarikhPermohonan: "2024-03-15",
        namaEoad: "Ahmad bin Abdullah",
        lokasiLapangan: "Masjid Al-Hidayah, Shah Alam",
        jumlahTunai: 5000.0,
        status: "Menunggu Kelulusan",
        tindakan: 1,
      },
      {
        idPermohonan: "TD-002",
        tarikhPermohonan: "2024-03-14",
        namaEoad: "Ahmad bin Abdullah",
        lokasiLapangan: "Masjid Al-Ikhlas, Petaling Jaya",
        jumlahTunai: 3000.0,
        status: "Diluluskan",
        tindakan: 2,
      },
      {
        idPermohonan: "TD-003",
        tarikhPermohonan: "2024-03-13",
        namaEoad: "Ahmad bin Abdullah",
        lokasiLapangan: "Masjid Al-Amin, Subang Jaya",
        jumlahTunai: 4500.0,
        status: "Sedia untuk Agihan",
        tindakan: 3,
      },
      {
        idPermohonan: "TD-004",
        tarikhPermohonan: "2024-03-12",
        namaEoad: "Ahmad bin Abdullah",
        lokasiLapangan: "Masjid Al-Hidayah, Shah Alam",
        jumlahTunai: 2500.0,
        status: "Serahan Selesai",
        tindakan: 4,
      },
    ];

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    permohonanList.value = mockData;
    totalRecords.value = mockData.length;
  } catch (error) {
    toast.error("Gagal mendapatkan senarai permohonan");
  } finally {
    isLoading.value = false;
  }
};

const handlePageChange = (page) => {
  currentPage.value = page;
  fetchPermohonanList();
};

const handleSortChange = (sort) => {
  // TODO: Implement sorting
  fetchPermohonanList();
};

const viewDetails = (permohonan) => {
  navigateTo(
    `/BF-TNI/tunai-dilapangan/senarai-permohonan-saya/${permohonan.idPermohonan}`
  );
};

const handleRekodPengeluaran = (permohonan) => {
  selectedPermohonan.value = permohonan;
  pengeluaranForm.value = {
    namaEoad: "Nama EOAD", // TODO: Get from auth
    tarikhMasa: new Date().toISOString().slice(0, 16),
    catatan: "",
  };
  showPengeluaranModal.value = true;
};

const handleRekodSerahan = (permohonan) => {
  selectedPermohonan.value = permohonan;
  serahanForm.value = {
    namaEoad: "Nama EOAD", // TODO: Get from auth
    tarikhMasa: new Date().toISOString().slice(0, 16),
    jumlahDiagih: permohonan.jumlahTunai,
    catatan: "",
    buktiGambar: null,
    tandatangan: "",
  };
  showSerahanModal.value = true;
};

const submitPengeluaran = async () => {
  try {
    // TODO: Implement API call to submit pengeluaran
    // await api.submitPengeluaran({
    //   permohonanId: selectedPermohonan.value.id,
    //   ...pengeluaranForm.value
    // });
    toast.success("Rekod pengeluaran berjaya disimpan");
    showPengeluaranModal.value = false;
    fetchPermohonanList();
  } catch (error) {
    toast.error("Gagal menyimpan rekod pengeluaran");
  }
};

const submitSerahan = async () => {
  try {
    // TODO: Implement API call to submit serahan
    // await api.submitSerahan({
    //   permohonanId: selectedPermohonan.value.id,
    //   ...serahanForm.value
    // });
    toast.success("Rekod serahan berjaya disimpan");
    showSerahanModal.value = false;
    fetchPermohonanList();
  } catch (error) {
    toast.error("Gagal menyimpan rekod serahan");
  }
};

// Utility Functions
const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("ms-MY", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};

const formatNumber = (value) => {
  if (!value) return "0.00";
  return parseFloat(value).toLocaleString("ms-MY", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const getStatusVariant = (status) => {
  const variants = {
    "Menunggu Kelulusan": "warning",
    Diluluskan: "success",
    "Sedia untuk Agihan": "info",
    "Serahan Selesai": "success",
  };
  return variants[status] || "default";
};

// Lifecycle
onMounted(() => {
  fetchPermohonanList();
});
</script>

<style lang="scss" scoped>
.rs-table {
  :deep(th) {
    @apply bg-gray-50;
  }
}
</style>
