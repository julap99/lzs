<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Permohonan Bantuan Awal (Pre Registration) (EPOAD)
          </h2>
        </div>
      </template>

      <template #body>
        <div class="p-4">
          <FormKit
            type="form"
            id="preRegistrationForm"
            @submit="handleSubmit"
            :actions="false"
            v-model="formData"
          >
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Maklumat Pemohon -->
              <div class="md:col-span-2">
                <h3 class="text-lg font-semibold mb-4">Maklumat Pemohon</h3>
              </div>

              <FormKit
                type="text"
                name="namaPemohon"
                label="Nama Pemohon"
                placeholder="Masukkan nama penuh pemohon"
                validation="required"
                :validation-messages="{
                  required: 'Nama pemohon diperlukan',
                }"
              />

              <FormKit
                type="text"
                name="noKadPengenalan"
                label="No. Kad Pengenalan"
                placeholder="Contoh: 901231012345"
                validation="required|length:12"
                :validation-messages="{
                  required: 'No. kad pengenalan diperlukan',
                  length: 'No. kad pengenalan mesti 12 digit',
                }"
              />

              <FormKit
                type="textarea"
                name="alamat"
                label="Alamat & Lokasi Bantuan"
                placeholder="Masukkan alamat penuh"
                validation="required"
                :validation-messages="{
                  required: 'Alamat diperlukan',
                }"
                rows="3"
              />

              <FormKit
                type="select"
                name="jenisBantuan"
                label="Jenis Bantuan"
                :options="[
                  'Bantuan Kewangan',
                  'Bantuan Makanan',
                  'Bantuan Pendidikan',
                  'Bantuan Perubatan',
                  'Bantuan Rumah',
                  'Lain-lain',
                ]"
                validation="required"
                :validation-messages="{
                  required: 'Jenis bantuan diperlukan',
                }"
              />

              <FormKit
                type="number"
                name="jumlahBantuan"
                label="Amaun Bantuan Dicadangkan (RM)"
                placeholder="0.00"
                validation="required|min:0"
                step="0.01"
                :validation-messages="{
                  required: 'Jumlah bantuan diperlukan',
                  min: 'Jumlah tidak boleh negatif',
                }"
              />

              <FormKit
                type="date"
                name="tarikhPermohonan"
                label="Tarikh Permohonan"
                validation="required"
                :validation-messages="{
                  required: 'Tarikh permohonan diperlukan',
                }"
              />

              <FormKit
                type="file"
                name="dokumenSokongan"
                label="Dokumen Sokongan"
                accept=".pdf,.jpg,.jpeg,.png"
                multiple
                help="Muat naik gambar, salinan IC, atau pernyataan aduan (PDF, JPG, PNG)"
              />

              <FormKit
                type="textarea"
                name="justifikasi"
                label="Justifikasi Pemberian Bantuan"
                placeholder="Masukkan justifikasi pemberian bantuan"
                validation="required"
                :validation-messages="{
                  required: 'Justifikasi diperlukan',
                }"
                rows="4"
              />
            </div>

            <!-- Submit Button -->
            <div class="mt-6 flex justify-end space-x-3">
              <rs-button
                type="submit"
                variant="primary"
                :loading="isSubmitting"
                @click="handleSubmit"
              >
                Hantar Permohonan
              </rs-button>
            </div>
          </FormKit>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const breadcrumb = ref([
  {
    name: "Pengurusan Tunai",
    type: "link",
    path: `/BF-PTPC/PC/TD/01`,
  },
  {
    name: "Tunai Dilapangan",
    type: "link",
    path: `/BF-PTPC/PC/TD/01`,
  },
  {
    name: "Permohonan Bantuan Awal (Pre Registration) (EPOAD)",
    type: "current",
    path: "/BF-PTPC/PC/TD/02",
  },
]);

const formData = ref({
  namaPemohon: "",
  noKadPengenalan: "",
  alamat: "",
  jenisBantuan: "",
  jumlahBantuan: "",
  tarikhPermohonan: "",
  dokumenSokongan: [],
  justifikasi: "",
});

const isSubmitting = ref(false);

const handleSubmit = async (submittedData: any) => {
  try {
    isSubmitting.value = true;
    // TODO: Implement form submission logic
    console.log("Form submitted:", submittedData);

    navigateTo("/BF-PTPC/PC/TD/03");
  } catch (error) {
    console.error("Error submitting form:", error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>
