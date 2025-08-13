<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Rekod Serahan Tunai
          </h2>
          <rs-badge :variant="getStatusBadgeVariant()">
            {{ formData.status || "Menunggu Lampiran" }}
          </rs-badge>
        </div>
      </template>

      <template #body>
        <div class="p-4">
          <FormKit
            type="form"
            @submit="handleSubmit"
            :actions="false"
            v-model="formData"
          >
            <!-- Maklumat Pelaksanaan Agihan -->
            <div class="mb-8">
              <h3 class="text-lg font-semibold mb-4">Maklumat Pelaksanaan Agihan</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- ID Permohonan Agihan Lapangan -->
                <FormKit
                  type="text"
                  name="idPermohonan"
                  label="ID Permohonan Agihan Lapangan"
                  :value="applicationData.id"
                  disabled
                />

                <!-- Nama Pegawai EOAD -->
                <FormKit
                  type="text"
                  name="namaPegawai"
                  label="Nama Pegawai EOAD"
                  validation="required"
                  :validation-messages="{
                    required: 'Nama pegawai diperlukan',
                  }"
                />

                <!-- Tarikh Pelaksanaan Agihan Sebenar -->
                <FormKit
                  type="date"
                  name="tarikhPelaksanaan"
                  label="Tarikh Pelaksanaan Agihan Sebenar"
                  validation="required"
                  :validation-messages="{
                    required: 'Tarikh pelaksanaan diperlukan',
                  }"
                />

                <!-- Jumlah Sebenar Diagih -->
                <FormKit
                  type="number"
                  name="jumlahDiagih"
                  label="Jumlah Sebenar Diagih (RM)"
                  validation="required|min:0"
                  step="0.01"
                  :validation-messages="{
                    required: 'Jumlah diagih diperlukan',
                    min: 'Jumlah tidak boleh negatif',
                  }"
                />

                <!-- Lokasi / Kawasan Serahan -->
                <FormKit
                  type="text"
                  name="lokasiSerahan"
                  label="Lokasi / Kawasan Serahan"
                  validation="required"
                  :validation-messages="{
                    required: 'Lokasi serahan diperlukan',
                  }"
                />

                <!-- Catatan Tambahan Pelaksanaan -->
                <FormKit
                  type="textarea"
                  name="catatanTambahan"
                  label="Catatan Tambahan Pelaksanaan"
                  rows="3"
                />
              </div>
            </div>

            <!-- Maklumat Bukti Serahan -->
            <div class="mt-8 border-t pt-6">
              <h3 class="text-lg font-semibold mb-4">Maklumat Bukti Serahan</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Lampiran Bukti Gambar Agihan -->
                <FormKit
                  type="file"
                  name="buktiGambar"
                  label="Lampiran Bukti Gambar Agihan"
                  accept="image/*"
                  multiple
                  :validation-messages="{
                    required: 'Sila muat naik sekurang-kurangnya satu gambar',
                  }"
                />

                <!-- Fail Tambahan -->
                <FormKit
                  type="file"
                  name="failTambahan"
                  label="Fail Tambahan"
                  multiple
                />

                <!-- Status Rekod -->
                <FormKit
                  type="select"
                  name="status"
                  label="Status Rekod"
                  :options="[
                    { label: 'Selesai', value: 'Selesai' },
                    { label: 'Menunggu Lampiran', value: 'Menunggu Lampiran' },
                  ]"
                  validation="required"
                  :validation-messages="{
                    required: 'Status rekod diperlukan',
                  }"
                />
              </div>
            </div>

            <!-- Submit Button -->
            <div class="mt-6 flex justify-end space-x-3">
              <rs-button
                type="button"
                variant="secondary"
                @click="router.push('/BF-TNI/MT/TD/01')"
              >
                Kembali
              </rs-button>
              <rs-button
                type="submit"
                variant="primary"
                :loading="isSubmitting"
                @click="handleSubmit"
              >
                Simpan Rekod
              </rs-button>
            </div>
          </FormKit>
        </div>
      </template>
    </rs-card>

    <!-- Success Modal -->
    <rs-modal
      v-model="showSuccessModal"
      title="Rekod Berjaya Disimpan"
      size="md"
      position="center"
    >
      <template #body>
        <div class="text-center py-4">
          <div class="mb-4">
            <i class="fas fa-check-circle text-success text-5xl"></i>
          </div>
          <p class="text-gray-700">
            Rekod serahan tunai telah berjaya disimpan.
          </p>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end">
          <rs-button
            variant="primary"
            @click="handleSuccessModalClose"
          >
            Kembali ke Senarai
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

definePageMeta({
  title: "Rekod Serahan Tunai",
});

const router = useRouter();
const isSubmitting = ref(false);
const showSuccessModal = ref(false);

const breadcrumb = ref([
  {
    name: "Pengurusan Tunai",
    type: "link",
    path: "/BF-TNI/MT/TD/01",
  },
  {
    name: "Tunai Dilapangan",
    type: "link",
    path: "/BF-TNI/MT/TD/01",
  },
  {
    name: "Rekod Serahan Tunai",
    type: "current",
    path: "/BF-TNI/MT/TD/04",
  },
]);

// Mock data - replace with actual data from API
const applicationData = ref({
  id: "TD-2024-001",
  namaPemohon: "Ahmad bin Abdullah",
  noKp: "880101121234",
  jumlahTunai: 5000.0,
  bakiPetiBesi: 10000.0,
  lokasiAgihan: "Kuala Lumpur",
  tujuanBantuan: "Bantuan Lapangan - Operasi Banjir",
  status: "Diluluskan",
});

const formData = ref({
  idPermohonan: applicationData.value.id,
  namaPegawai: "",
  tarikhPelaksanaan: "",
  jumlahDiagih: 0,
  lokasiSerahan: "",
  catatanTambahan: "",
  buktiGambar: [],
  failTambahan: [],
  status: "Menunggu Lampiran",
});

const handleSubmit = async (submittedData: any) => {
  isSubmitting.value = true;
  try {
    // TODO: Implement API call to save the record
    console.log("Form submitted:", submittedData);
    // Show success modal
    showSuccessModal.value = true;
  } catch (error) {
    console.error("Error submitting form:", error);
  } finally {
    isSubmitting.value = false;
  }
};

const handleSuccessModalClose = () => {
  showSuccessModal.value = false;
  router.push("/BF-TNI/MT/TD/01");
};

const getStatusBadgeVariant = () => {
  return formData.value.status === "Selesai" ? "success" : "warning";
};
</script>

<style scoped></style>
