<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card>
      <template #header> Konfigurasi Tabung</template>
      <template #body>
        <FormKit
          type="form"
          @submit="handleSubmit"
          :actions="false"
          class="max-w-3xl mx-auto"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormKit
              type="text"
              name="namaCawangan"
              label="Nama & Kod Cawangan"
              validation="required"
              placeholder="Masukkan nama dan kod cawangan"
              v-model="formData.namaCawangan"
            />

            <FormKit
              type="select"
              name="jenisAkaun"
              label="Jenis Akaun Tabung"
              validation="required"
              placeholder="Pilih jenis akaun"
              :options="['Ekspres', 'Amil', 'Operasi Daerah']"
              v-model="formData.jenisAkaun"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormKit
              type="number"
              name="nilaiFloat"
              label="Nilai Float Tabung (RM)"
              validation="required|min:0"
              placeholder="Contoh: 2000"
              v-model="formData.nilaiFloat"
              :validation-messages="{
                required: 'Nilai float diperlukan',
                min: 'Nilai float mesti lebih daripada 0',
              }"
            />

            <FormKit
              type="number"
              name="hadMinimum"
              label="Had Minimum Baki (RM)"
              validation="required|min:0"
              placeholder="Contoh: 500"
              v-model="formData.hadMinimum"
              :validation-messages="{
                required: 'Had minimum diperlukan',
                min: 'Had minimum mesti lebih daripada 0',
              }"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormKit
              type="date"
              name="tarikhEfektif"
              label="Tarikh Efektif Konfigurasi"
              validation="required"
              v-model="formData.tarikhEfektif"
            />

            <FormKit
              type="select"
              name="kekerapanPemantauan"
              label="Kekerapan Pemantauan"
              validation="required"
              placeholder="Pilih kekerapan"
              :options="['Mingguan', 'Bulanan']"
              v-model="formData.kekerapanPemantauan"
            />
          </div>

          <FormKit
            type="select"
            name="status"
            label="Status Konfigurasi"
            validation="required"
            placeholder="Pilih status"
            :options="['Aktif', 'Tidak Aktif']"
            v-model="formData.status"
          />

          <div class="flex justify-end gap-4 mt-6">
            <rs-button variant="primary-outline" @click="resetForm"
              >Reset</rs-button
            >
            <rs-button type="submit" variant="primary" @click="handleSubmit"
              >Simpan</rs-button
            >
          </div>
        </FormKit>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref } from "vue";

definePageMeta({
  title: "Konfigurasi Tabung",
});

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
    name: "Konfigurasi Tabung",
    type: "current",
    path: "/BF-PTPC/PC/BE/01",
  },
]);

const formData = ref({
  namaCawangan: "",
  jenisAkaun: "",
  nilaiFloat: "",
  hadMinimum: "",
  tarikhEfektif: "",
  kekerapanPemantauan: "",
  status: "",
});

const handleSubmit = (formData) => {
  console.log("Form submitted:", formData);
  // TODO: Implement form submission logic

  navigateTo("/BF-PTPC/PC/BE/02");
};

const resetForm = () => {
  formData.value = {
    namaCawangan: "",
    jenisAkaun: "",
    nilaiFloat: "",
    hadMinimum: "",
    tarikhEfektif: "",
    kekerapanPemantauan: "",
    status: "",
  };
};
</script>
