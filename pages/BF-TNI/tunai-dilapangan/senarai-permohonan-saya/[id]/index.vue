<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-2">
            <h2 class="text-xl font-semibold">Butiran Permohonan</h2>
          </div>
          <div class="flex gap-2">
            <rs-button variant="primary-outline" @click="router.back()">
              <Icon name="material-symbols:arrow-back" class="mr-1" size="15" />
              Kembali
            </rs-button>
            <rs-button variant="success" @click="handleRekodPengeluaran">
              <Icon name="material-symbols:payments" class="mr-1" size="15" />
              Rekod Pengeluaran Tunai
            </rs-button>
            <rs-button variant="info" @click="handleRekodSerahan">
              <Icon name="material-symbols:handshake" class="mr-1" size="15" />
              Rekod Serahan Tunai
            </rs-button>
          </div>
        </div>
      </template>

      <template #body>
        <div v-if="isLoading" class="flex justify-center items-center py-8">
          <rs-spinner size="lg" />
        </div>

        <div v-else-if="!permohonan" class="text-center py-8">
          <p class="text-gray-500">Permohonan tidak dijumpai</p>
        </div>

        <div v-else class="space-y-6">
          <!-- Status Badge -->
          <div class="flex justify-end">
            <rs-badge :variant="getStatusVariant(permohonan.status)">
              {{ permohonan.status }}
            </rs-badge>
          </div>

          <!-- Maklumat Permohonan -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >ID Permohonan</label
                >
                <p class="mt-1 text-gray-900">{{ permohonan.idPermohonan }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Nama Pemohon (EOAD)</label
                >
                <p class="mt-1 text-gray-900">{{ permohonan.namaEoad }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Lokasi Agihan</label
                >
                <p class="mt-1 text-gray-900">
                  {{ permohonan.lokasiLapangan }}
                </p>
              </div>
            </div>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Jumlah Tunai Dimohon (RM)</label
                >
                <p class="mt-1 text-gray-900 font-medium">
                  RM {{ formatNumber(permohonan.jumlahTunai) }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Tujuan Bantuan</label
                >
                <p class="mt-1 text-gray-900">{{ permohonan.tujuanBantuan }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Tarikh Permohonan</label
                >
                <p class="mt-1 text-gray-900">
                  {{ formatDate(permohonan.tarikhPermohonan) }}
                </p>
              </div>
            </div>
          </div>

          <!-- Audit Trail -->
          <div v-if="permohonan.auditTrail?.length" class="mt-8">
            <h3 class="text-lg font-medium mb-4">Audit Trail</h3>
            <div class="space-y-4">
              <div
                v-for="(audit, index) in permohonan.auditTrail"
                :key="index"
                class="bg-gray-50 p-4 rounded-lg"
              >
                <div class="flex justify-between items-start">
                  <div>
                    <p class="font-medium">{{ audit.action }}</p>
                    <p class="text-sm text-gray-500">{{ audit.namaEoad }}</p>
                  </div>
                  <p class="text-sm text-gray-500">
                    {{ formatDateTime(audit.tarikhMasa) }}
                  </p>
                </div>
                <p v-if="audit.catatan" class="mt-2 text-sm text-gray-600">
                  {{ audit.catatan }}
                </p>
              </div>
            </div>
          </div>
        </div>
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
          <!-- <div class="formkit-field">
            <label class="formkit-label">Tandatangan Digital Penerima</label>
            <SignaturePad v-model="serahanForm.tandatangan" />
            <div v-if="!serahanForm.tandatangan" class="formkit-message formkit-message-error">
              Tandatangan diperlukan
            </div>
          </div> -->
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
import { useRoute, useRouter } from "vue-router";
import SignaturePad from '~/components/SignaturePad.vue';

const route = useRoute();
const router = useRouter();
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
    type: "link",
    path: "/BF-TNI/tunai-dilapangan/senarai-permohonan-saya",
  },
  {
    name: "Butiran Permohonan",
    type: "current",
    path: `/BF-TNI/tunai-dilapangan/senarai-permohonan-saya/${route.params.id}`,
  },
]);

// State
const isLoading = ref(true);
const permohonan = ref(null);
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
const fetchPermohonanDetails = async () => {
  isLoading.value = true;
  try {
    // Mock data for development
    permohonan.value = {
      idPermohonan: "TNI-2024-001",
      namaEoad: "Ahmad bin Abdullah",
      lokasiLapangan: "Kampung Baru, Kuala Lumpur",
      jumlahTunai: 2500.0,
      tujuanBantuan: "Bantuan Kecemasan - Fakir",
      tarikhPermohonan: "2024-03-15T10:30:00",
      status: "Diluluskan",
      auditTrail: [
        {
          action: "Permohonan Dihantar",
          namaEoad: "Ahmad bin Abdullah",
          tarikhMasa: "2024-03-15T10:30:00",
          catatan: "Permohonan bantuan kecemasan telah dihantar",
        },
        {
          action: "Permohonan Disemak",
          namaEoad: "Mohd Ali bin Hassan",
          tarikhMasa: "2024-03-15T14:20:00",
          catatan: "Permohonan telah disemak dan disahkan lengkap",
        },
        {
          action: "Permohonan Diluluskan",
          namaEoad: "Siti binti Ismail",
          tarikhMasa: "2024-03-16T09:15:00",
          catatan: "Permohonan telah diluluskan untuk agihan tunai",
        },
      ],
    };
  } catch (error) {
    toast.error("Gagal mendapatkan butiran permohonan");
  } finally {
    isLoading.value = false;
  }
};

const handleRekodPengeluaran = () => {
  pengeluaranForm.value = {
    namaEoad: "Nama EOAD", // TODO: Get from auth
    tarikhMasa: new Date().toISOString().slice(0, 16),
    catatan: "",
  };
  showPengeluaranModal.value = true;
};

const handleRekodSerahan = () => {
  selectedPermohonan.value = permohonan.value;
  serahanForm.value = {
    namaEoad: "Nama EOAD", // TODO: Get from auth
    tarikhMasa: new Date().toISOString().slice(0, 16),
    jumlahDiagih: permohonan.value.jumlahTunai,
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
    //   permohonanId: route.params.id,
    //   ...pengeluaranForm.value
    // });
    toast.success("Rekod pengeluaran berjaya disimpan");
    showPengeluaranModal.value = false;
    fetchPermohonanDetails();
  } catch (error) {
    toast.error("Gagal menyimpan rekod pengeluaran");
  }
};

const submitSerahan = async () => {
  try {
    // TODO: Implement API call to submit serahan
    // await api.submitSerahan({
    //   permohonanId: route.params.id,
    //   ...serahanForm.value
    // });
    toast.success("Rekod serahan berjaya disimpan");
    showSerahanModal.value = false;
    fetchPermohonanDetails();
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

const formatDateTime = (dateTime) => {
  if (!dateTime) return "";
  return new Date(dateTime).toLocaleString("ms-MY", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
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
  fetchPermohonanDetails();
});
</script>

<style lang="scss" scoped>
.rs-card {
  :deep(.rs-card-body) {
    @apply p-6;
  }
}
</style>
