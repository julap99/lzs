<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Kemaskini Konfigurasi Peti Besi</h2>
        </div>
      </template>

      <template #body>
        <FormKit
          type="form"
          @submit="handleSubmit"
          :actions="false"
          class="max-w-2xl mx-auto"
          v-model="formData"
        >
          <div class="grid grid-cols-1 gap-4">
            <FormKit
              type="select"
              name="cawangan"
              label="Cawangan"
              placeholder="Pilih cawangan"
              validation="required"
              :validation-messages="{
                required: 'Sila pilih cawangan',
              }"
              :options="[
                {
                  label: 'Cawangan Kuala Lumpur',
                  value: 'Cawangan Kuala Lumpur',
                },
                {
                  label: 'Cawangan Johor Bahru',
                  value: 'Cawangan Johor Bahru',
                },
                {
                  label: 'Cawangan Pulau Pinang',
                  value: 'Cawangan Pulau Pinang',
                },
              ]"
            />

            <FormKit
              type="select"
              name="jenisAkaun"
              label="Jenis Akaun"
              placeholder="Pilih jenis akaun"
              validation="required"
              :validation-messages="{
                required: 'Sila pilih jenis akaun',
              }"
              :options="[
                { label: 'Tunai', value: 'Tunai' },
                { label: 'Amil', value: 'Amil' },
                { label: 'Operasi Daerah', value: 'Operasi Daerah' },
              ]"
            />

            <FormKit
              type="number"
              name="nilaiAsas"
              label="Nilai Asas (RM)"
              placeholder="Masukkan nilai asas"
              validation="required|min:0"
              :validation-messages="{
                required: 'Sila masukkan nilai asas',
                min: 'Nilai asas mesti lebih besar daripada 0',
              }"
            />

            <FormKit
              type="number"
              name="ambangMinimum"
              label="Ambang Minimum (RM)"
              placeholder="Masukkan ambang minimum"
              validation="required|min:0"
              :validation-messages="{
                required: 'Sila masukkan ambang minimum',
                min: 'Ambang minimum mesti lebih besar daripada 0',
              }"
            />

            <FormKit
              type="select"
              name="kekerapanPemantauan"
              label="Kekerapan Pemantauan"
              placeholder="Pilih kekerapan pemantauan"
              validation="required"
              :validation-messages="{
                required: 'Sila pilih kekerapan pemantauan',
              }"
              :options="[
                { label: 'Harian', value: 'Harian' },
                { label: 'Mingguan', value: 'Mingguan' },
                { label: 'Bulanan', value: 'Bulanan' },
              ]"
            />

            <FormKit
              type="select"
              name="status"
              label="Status"
              placeholder="Pilih status"
              validation="required"
              :validation-messages="{
                required: 'Sila pilih status',
              }"
              :options="[
                { label: 'Aktif', value: 'Aktif' },
                { label: 'Tidak Aktif', value: 'Tidak Aktif' },
              ]"
            />
          </div>

          <div class="flex justify-end gap-2 mt-6">
            <rs-button
              variant="primary-outline"
              @click="navigateTo('/BF-TNI/MT/KT/01')"
            >
              Batal
            </rs-button>
            <rs-button type="submit" variant="primary" :loading="isSubmitting">
              Simpan
            </rs-button>
          </div>
        </FormKit>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

definePageMeta({
  title: "Kemaskini Konfigurasi Peti Besi",
  description: "Kemaskini konfigurasi peti besi dalam sistem",
});

const route = useRoute();
const isSubmitting = ref(false);
const formData = ref({
  cawangan: "",
  jenisAkaun: "",
  nilaiAsas: "",
  ambangMinimum: "",
  kekerapanPemantauan: "",
  status: "",
});

const breadcrumb = ref([
  {
    name: "Pengurusan Tunai",
    type: "link",
    path: "/BF-TNI/MT/KT",
  },
  {
    name: "Mengurus Tunai",
    type: "link",
    path: "/BF-TNI/MT/KT/01",
  },
  {
    name: "Kemaskini Konfigurasi Peti Besi",
    type: "current",
    path: "/BF-TNI/MT/KT/03",
  },
]);

// Load existing data when component mounts
onMounted(async () => {
  try {
    const mockData = {
      cawangan: "Cawangan Kuala Lumpur",
      jenisAkaun: "Tunai",
      nilaiAsas: 10000,
      ambangMinimum: 5000,
      kekerapanPemantauan: "Harian",
      status: "Aktif",
    };
    formData.value = mockData;
  } catch (error) {
    console.error("Error loading data:", error);
    alert("Ralat semasa memuatkan data");
  }
});

const handleSubmit = async (formData) => {
  try {
    isSubmitting.value = true;
    // TODO: Implement API call to update the data
    console.log("Form submitted:", formData);

    // Show success message
    alert("Konfigurasi peti besi berjaya dikemaskini");

    // Navigate back to list page
    navigateTo("/BF-TNI/MT/KT/01");
  } catch (error) {
    console.error("Error updating data:", error);
    alert("Ralat semasa mengemaskini data");
  } finally {
    isSubmitting.value = false;
  }
};
</script>
