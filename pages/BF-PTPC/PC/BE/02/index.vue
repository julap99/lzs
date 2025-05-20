<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card>
      <template #header>Penambahan Tunai Tabung</template>
      <template #body>
        <FormKit
          type="form"
          @submit="handleTopUpSubmit"
          :actions="false"
          class="max-w-3xl mx-auto"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormKit
              type="select"
              name="selectedCawangan"
              label="Nama & Kod Cawangan"
              validation="required"
              placeholder="Pilih cawangan"
              :options="cawanganOptions"
              v-model="topUpData.selectedCawangan"
              :validation-messages="{
                required: 'Sila pilih cawangan',
              }"
            />

            <FormKit
              type="select"
              name="jenisAkaun"
              label="Jenis Akaun Tabung"
              validation="required"
              placeholder="Pilih jenis akaun"
              :options="jenisAkaunOptions"
              v-model="topUpData.jenisAkaun"
              :validation-messages="{
                required: 'Sila pilih jenis akaun',
              }"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormKit
              type="number"
              name="bakiSemasa"
              label="Baki Semasa Tabung"
              disabled
              v-model="topUpData.bakiSemasa"
            />

            <FormKit
              type="number"
              name="hadMinimum"
              label="Had Minimum Baki"
              disabled
              v-model="topUpData.hadMinimum"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormKit
              type="number"
              name="jumlahTopUp"
              label="Jumlah Topup Dicadangkan"
              validation="required|min:0"
              placeholder="Masukkan jumlah topup"
              v-model="topUpData.jumlahTopUp"
              :validation-messages="{
                required: 'Jumlah topup diperlukan',
                min: 'Jumlah topup mesti lebih daripada 0',
              }"
            />

            <FormKit
              type="text"
              name="pegawaiMenentukan"
              label="Nama Pegawai yang Menentukan"
              disabled
              v-model="topUpData.pegawaiMenentukan"
            />
          </div>

          <div class="flex justify-end gap-4 mt-6">
            <rs-button variant="primary-outline" @click="resetTopUpForm"
              >Reset</rs-button
            >
            <rs-button
              type="submit"
              variant="primary"
              @click="handleTopUpSubmit"
              >Simpan</rs-button
            >
          </div>
        </FormKit>
      </template>
    </rs-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";

definePageMeta({
  title: "Penambahan Tunai Tabung",
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
    name: "Penambahan Tunai",
    type: "current",
    path: "/BF-PTPC/PC/BE/02",
  },
]);

interface CawanganData {
  bakiSemasa: string;
  hadMinimum: string;
  pegawaiMenentukan: string;
}

interface MockCawanganData {
  [key: string]: CawanganData;
}

// Constants
const jenisAkaunOptions = ["Ekspres", "Amil", "Operasi Daerah"];

// Mock data for cawangan options - replace with actual data from API
const cawanganOptions = computed(() => [
  { label: "Cawangan A (CA001)", value: "CA001" },
  { label: "Cawangan B (CA002)", value: "CA002" },
]);

// Mock data for demonstration
const mockCawanganData: MockCawanganData = {
  CA001: {
    bakiSemasa: "1500.00",
    hadMinimum: "2000.00",
    pegawaiMenentukan: "Ahmad bin Abdullah",
  },
  CA002: {
    bakiSemasa: "2500.00",
    hadMinimum: "3000.00",
    pegawaiMenentukan: "Siti binti Mohamed",
  },
};

// Form data
const topUpData = ref({
  selectedCawangan: "",
  jenisAkaun: "",
  bakiSemasa: 0,
  hadMinimum: 0,
  jumlahTopUp: 0,
  pegawaiMenentukan: "Ahmad bin Abdullah",
});

// Form handlers
const handleTopUpSubmit = (formData: typeof topUpData.value) => {
  console.log("Top-up form submitted:", formData);
  // TODO: Implement top-up submission logic

  navigateTo("/BF-PTPC/PC/BE/03");
};

const resetTopUpForm = () => {
  topUpData.value = {
    selectedCawangan: "",
    jenisAkaun: "",
    bakiSemasa: "",
    hadMinimum: "",
    jumlahTopUp: "",
    pegawaiMenentukan: "",
  };
};

// Watch for cawangan selection changes
watch(
  () => topUpData.value.selectedCawangan,
  (newValue) => {
    if (newValue && mockCawanganData[newValue]) {
      const cawanganData = mockCawanganData[newValue];
      topUpData.value.bakiSemasa = cawanganData.bakiSemasa;
      topUpData.value.hadMinimum = cawanganData.hadMinimum;
      topUpData.value.pegawaiMenentukan = cawanganData.pegawaiMenentukan;
    }
  }
);
</script>
