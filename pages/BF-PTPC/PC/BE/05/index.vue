<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card>
      <template #header>Terima & Sahkan Penerimaan Tunai</template>
      <template #body>
        <!-- Info Details Section -->
        <div class="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 class="text-lg font-medium mb-4">Maklumat Aktiviti</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-600">Nama Pegawai</p>
              <p class="font-medium">{{ currentUserName }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Tarikh</p>
              <p class="font-medium">{{ formattedCurrentDate }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Rujukan</p>
              <p class="font-medium">{{ transferDetails.rujukan }}</p>
            </div>
          </div>
        </div>

        <!-- Success Message - Only shown after completion -->
        <div v-if="isCompleted" class="mb-6">
          <div class="flex items-center gap-2 mb-4">
            <Icon name="mdi:check-circle" class="text-green-500" size="1.5rem" />
            <p class="text-green-600 font-medium">
              Penerimaan tunai berjaya disahkan dan direkodkan
            </p>
          </div>
        </div>

        <!-- Form Section -->
        <FormKit
          type="form"
          @submit="handleSubmit"
          :actions="false"
          class="max-w-3xl mx-auto"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormKit
              type="select"
              name="lokasiPenerimaan"
              label="Lokasi Penerimaan"
              validation="required"
              placeholder="Pilih lokasi penerimaan"
              :options="lokasiOptions"
              v-model="formData.lokasiPenerimaan"
              :validation-messages="{
                required: 'Sila pilih lokasi penerimaan',
              }"
            />

            <FormKit
              type="select"
              name="jenisLokasi"
              label="Jenis Lokasi"
              validation="required"
              placeholder="Pilih jenis lokasi"
              :options="jenisLokasiOptions"
              v-model="formData.jenisLokasi"
              :validation-messages="{
                required: 'Sila pilih jenis lokasi',
              }"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormKit
              type="text"
              name="namaPegawaiPenerima"
              label="Nama Pegawai Penerima"
              validation="required"
              placeholder="Masukkan nama pegawai penerima"
              v-model="formData.namaPegawaiPenerima"
              :validation-messages="{
                required: 'Nama pegawai penerima diperlukan',
              }"
            />

            <FormKit
              type="text"
              name="noKadPengenalan"
              label="No Kad Pengenalan"
              validation="required|length:12"
              placeholder="Masukkan no kad pengenalan"
              v-model="formData.noKadPengenalan"
              :validation-messages="{
                required: 'No kad pengenalan diperlukan',
                length: 'No kad pengenalan mesti 12 digit',
              }"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormKit
              type="number"
              name="jumlahTunaiDiterima"
              label="Jumlah Tunai Diterima (RM)"
              validation="required|min:0"
              placeholder="Masukkan jumlah tunai diterima"
              v-model="formData.jumlahTunaiDiterima"
              :validation-messages="{
                required: 'Jumlah tunai diterima diperlukan',
                min: 'Jumlah tunai mesti lebih daripada 0',
              }"
            />

            <FormKit
              type="datetime-local"
              name="tarikhMasaPenerimaan"
              label="Tarikh dan Masa Penerimaan"
              validation="required"
              v-model="formData.tarikhMasaPenerimaan"
              :validation-messages="{
                required: 'Tarikh dan masa penerimaan diperlukan',
              }"
            />
          </div>

          <div class="grid grid-cols-1 gap-4">
            <FormKit
              type="textarea"
              name="catatan"
              label="Catatan"
              placeholder="Masukkan catatan tambahan (jika ada)"
              v-model="formData.catatan"
            />
          </div>

          <div class="flex justify-end gap-4 mt-6">
            <rs-button variant="primary-outline" @click="resetForm"
              >Reset</rs-button
            >
            <rs-button
              type="submit"
              variant="primary"
              @click="handleSubmit"
              >Sah & Terima</rs-button
            >
          </div>
        </FormKit>
      </template>
    </rs-card>

    <!-- Confirmation Modal -->
    <rs-modal
      title="Sahkan Penerimaan Tunai"
      v-model="showConfirmationModal"
      ok-title="Sahkan"
      cancel-title="Batal"
      position="center"
    >
      <template #body>
        <p class="mb-4">
          Adakah anda pasti untuk mengesahkan penerimaan tunai ini?
        </p>
        <div class="bg-gray-50 p-4 rounded-lg">
          <p class="font-medium">
            Lokasi Penerimaan: {{ formData.lokasiPenerimaan }}
          </p>
          <p class="font-medium">
            Jenis Lokasi: {{ formData.jenisLokasi }}
          </p>
          <p class="font-medium">
            Nama Pegawai Penerima: {{ formData.namaPegawaiPenerima }}
          </p>
          <p class="font-medium">
            Jumlah Tunai Diterima: RM {{ formData.jumlahTunaiDiterima || "0.00" }}
          </p>
          <p class="text-sm text-gray-600 mt-2">
            Pastikan jumlah yang diterima adalah tepat dan sepadan dengan jumlah
            yang telah disahkan untuk penerimaan.
          </p>
        </div>
      </template>

      <template #footer>
        <rs-button
          @click="showConfirmationModal = false"
          :disabled="processing"
          variant="primary-outline"
        >
          Tutup
        </rs-button>

        <rs-button @click="handleConfirm()" :disabled="processing">
          <span v-if="processing">
            <Icon name="eos-icons:loading" class="ml-1" size="1rem" />
          </span>
          <span v-else>Sah & Terima</span>
        </rs-button>
      </template>
    </rs-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

definePageMeta({
  title: "Terima & Sahkan Penerimaan Tunai",
});

const router = useRouter();
const isCompleted = ref(false);
const processing = ref(false);
const showConfirmationModal = ref(false);

const breadcrumb = ref([
  {
    name: "Pengurusan Tunai",
    type: "link",
    path: `/BF-PTPC/PC/BE/01`,
  },
  {
    name: "Petty Cash",
    type: "link",
    path: `/BF-PTPC/PC/BE/01`,
  },
  {
    name: "Terima & Sahkan Penerimaan Tunai",
    type: "current",
    path: "/BF-PTPC/PC/BE/05",
  },
]);

// Mock data for options - replace with actual data from API
const lokasiOptions = [
  { label: "Bank A", value: "BA001" },
  { label: "Bank B", value: "BA002" },
  { label: "Divisyen Kewangan HQ", value: "HQ001" },
];

const jenisLokasiOptions = [
  { label: "Cawangan & Amil", value: "CA" },
  { label: "Operasi Daerah (di daerah)", value: "OD" },
  { label: "Cawangan, Amil & Operasi Daerah (di HQ Menara Zakat)", value: "HQ" },
];

interface FormData {
  lokasiPenerimaan: string;
  jenisLokasi: string;
  namaPegawaiPenerima: string;
  noKadPengenalan: string;
  jumlahTunaiDiterima: string;
  tarikhMasaPenerimaan: string;
  catatan: string;
}

// Form data
const formData = ref<FormData>({
  lokasiPenerimaan: "",
  jenisLokasi: "",
  namaPegawaiPenerima: "",
  noKadPengenalan: "",
  jumlahTunaiDiterima: "0",
  tarikhMasaPenerimaan: new Date().toISOString().slice(0, 16),
  catatan: "",
});

const currentUserName = ref("Sarah binti Omar");
const formattedCurrentDate = computed(() => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date().toLocaleDateString("ms-MY", options);
});

const transferDetails = ref({
  rujukan: "TRF-" + new Date().toISOString().slice(0, 10).replace(/-/g, ""),
});

const currentDateTime = computed(() => {
  return new Date().toISOString().slice(0, 16);
});

// Form handlers
const handleSubmit = async (formData: FormData) => {
  showConfirmationModal.value = true;
};

const handleConfirm = async () => {
  processing.value = true;
  try {
    // TODO: Implement API call to save the data
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
    isCompleted.value = true;
    showConfirmationModal.value = false;
    
    // Navigate to next page after successful submission
    setTimeout(() => {
      router.push("/BF-PTPC/PC/BE/06");
    }, 2000);
  } catch (error) {
    console.error("Error submitting form:", error);
  } finally {
    processing.value = false;
  }
};

const resetForm = () => {
  formData.value = {
    lokasiPenerimaan: "",
    jenisLokasi: "",
    namaPegawaiPenerima: "",
    noKadPengenalan: "",
    jumlahTunaiDiterima: "0",
    tarikhMasaPenerimaan: new Date().toISOString().slice(0, 16),
    catatan: "",
  };
  isCompleted.value = false;
};
</script>

<style scoped>
.form-container {
  max-width: 800px;
  margin: 0 auto;
}
</style> 