<script setup>
definePageMeta({
  title: "Laporan Penerbangan",
  breadcrumb: [
    {
      name: "Laporan Penerbangan",
      type: "current",
    },
  ],
});

const data = ref([
  {
    namaDepan: "Ahmad",
    namaBelakang: "Abdullah",
    lapangan: "KLIA",
    jenisPenerbangan: "Ketibaan",
    tarikhMasa: "2023-06-15 08:30",
    status: "Tiba",
  },
  {
    namaDepan: "Siti",
    namaBelakang: "Aminah",
    lapangan: "Lapangan Terbang Antarabangsa Bayan Lepas",
    jenisPenerbangan: "Berlepas",
    tarikhMasa: "2023-06-16 14:45",
    status: "Masih dalam penerbangan",
  },
  {
    namaDepan: "Mohd",
    namaBelakang: "Razak",
    lapangan: "Lapangan Terbang Sultan Abdul Aziz Shah",
    jenisPenerbangan: "Ketibaan",
    tarikhMasa: "2023-06-17 10:15",
    status: "Terlepas",
  },
  {
    namaDepan: "Nurul",
    namaBelakang: "Huda",
    lapangan: "Lapangan Terbang Antarabangsa Kota Kinabalu",
    jenisPenerbangan: "Berlepas",
    tarikhMasa: "2023-06-18 16:20",
    status: "Dibatalkan",
  },
  {
    namaDepan: "Tan",
    namaBelakang: "Wei Ling",
    lapangan: "Lapangan Terbang Antarabangsa Kuching",
    jenisPenerbangan: "Ketibaan",
    tarikhMasa: "2023-06-19 09:00",
    status: "Tiba",
  },
  {
    namaDepan: "Amir",
    namaBelakang: "Hassan",
    lapangan: "KLIA",
    jenisPenerbangan: "Berlepas",
    tarikhMasa: "2023-06-20 11:30",
    status: "Masih dalam penerbangan",
  },
  {
    namaDepan: "Farah",
    namaBelakang: "Lim",
    lapangan: "Lapangan Terbang Antarabangsa Penang",
    jenisPenerbangan: "Ketibaan",
    tarikhMasa: "2023-06-21 13:45",
    status: "Tiba",
  },
  {
    namaDepan: "Zain",
    namaBelakang: "Ismail",
    lapangan: "Lapangan Terbang Antarabangsa Langkawi",
    jenisPenerbangan: "Berlepas",
    tarikhMasa: "2023-06-22 07:15",
    status: "Terlepas",
  },
  {
    namaDepan: "Lily",
    namaBelakang: "Wong",
    lapangan: "Lapangan Terbang Antarabangsa Senai",
    jenisPenerbangan: "Ketibaan",
    tarikhMasa: "2023-06-23 18:00",
    status: "Tiba",
  },
  {
    namaDepan: "Ravi",
    namaBelakang: "Kumar",
    lapangan: "KLIA",
    jenisPenerbangan: "Berlepas",
    tarikhMasa: "2023-06-24 10:30",
    status: "Dibatalkan",
  },
  {
    namaDepan: "Aishah",
    namaBelakang: "Yusof",
    lapangan: "Lapangan Terbang Sultan Abdul Halim",
    jenisPenerbangan: "Ketibaan",
    tarikhMasa: "2023-06-25 12:45",
    status: "Tiba",
  },
  {
    namaDepan: "Chong",
    namaBelakang: "Wei Ming",
    lapangan: "Lapangan Terbang Antarabangsa Kota Kinabalu",
    jenisPenerbangan: "Berlepas",
    tarikhMasa: "2023-06-26 15:20",
    status: "Masih dalam penerbangan",
  },
  {
    namaDepan: "Salmah",
    namaBelakang: "Othman",
    lapangan: "Lapangan Terbang Antarabangsa Kuching",
    jenisPenerbangan: "Ketibaan",
    tarikhMasa: "2023-06-27 09:10",
    status: "Terlepas",
  },
  {
    namaDepan: "Raj",
    namaBelakang: "Muthu",
    lapangan: "KLIA",
    jenisPenerbangan: "Berlepas",
    tarikhMasa: "2023-06-28 14:00",
    status: "Masih dalam penerbangan",
  },
  {
    namaDepan: "Noor",
    namaBelakang: "Aziz",
    lapangan: "Lapangan Terbang Antarabangsa Bayan Lepas",
    jenisPenerbangan: "Ketibaan",
    tarikhMasa: "2023-06-29 17:30",
    status: "Tiba",
  },
]);

const criteria = ref([
  {
    label: "Nama Depan",
    options: ["Ahmad", "Siti", "Mohd", "Nurul", "Tan"],
  },
  {
    label: "Nama Belakang",
    options: ["Abdullah", "Aminah", "Razak", "Huda", "Wei Ling"],
  },
  {
    label: "Lapangan Terbang",
    options: [
      "KLIA",
      "Lapangan Terbang Antarabangsa Bayan Lepas",
      "Lapangan Terbang Sultan Abdul Aziz Shah",
      "Lapangan Terbang Antarabangsa Kota Kinabalu",
      "Lapangan Terbang Antarabangsa Kuching",
    ],
  },
  {
    label: "Tarikh",
    options: [
      "2023-06-15",
      "2023-06-16",
      "2023-06-17",
      "2023-06-18",
      "2023-06-19",
    ],
  },
  {
    label: "Status",
    options: ["Tiba", "Masih dalam penerbangan", "Terlepas", "Dibatalkan"],
  },
]);

const selectedCriteria = ref({
  kriteria1: "",
  kriteria2: "",
  kriteria3: "",
  kriteria4: "",
  kriteria5: "",
});

const filteredData = ref([...data.value]);

const performSearch = () => {
  filteredData.value = data.value.filter((item) => {
    return (
      (!selectedCriteria.value.kriteria1 ||
        item.namaDepan.includes(selectedCriteria.value.kriteria1)) &&
      (!selectedCriteria.value.kriteria2 ||
        item.namaBelakang.includes(selectedCriteria.value.kriteria2)) &&
      (!selectedCriteria.value.kriteria3 ||
        item.lapangan.includes(selectedCriteria.value.kriteria3)) &&
      (!selectedCriteria.value.kriteria4 ||
        item.tarikhMasa.includes(selectedCriteria.value.kriteria4)) &&
      (!selectedCriteria.value.kriteria5 ||
        item.status.includes(selectedCriteria.value.kriteria5))
    );
  });
};

const resetFilter = () => {
  selectedCriteria.value = {
    kriteria1: "",
    kriteria2: "",
    kriteria3: "",
    kriteria4: "",
    kriteria5: "",
  };
  filteredData.value = [...data.value];
};
</script>
<template>
  <div>
    <LayoutsBreadcrumb />

    <rs-card>
      <template #header> Laporan Penerbangan</template>
      <template #body>
        <FormKit type="form" :actions="false">
          <div class="grid grid-cols-2 gap-4 mb-4">
            <FormKit
              v-for="(item, index) in criteria.slice(0, 2)"
              :key="index"
              type="select"
              :name="item.label.toLowerCase().replace(' ', '_')"
              :label="item.label"
              :options="item.options"
              v-model="selectedCriteria[`kriteria${index + 1}`]"
              placeholder="Pilih pilihan"
            >
              <template #label>
                <label
                  class="formkit-label text-gray-700 dark:text-gray-200 block mb-2 font-semibold text-sm formkit-invalid:text-red-500"
                >
                  {{ item.label }}
                </label>
              </template>
            </FormKit>
          </div>

          <div class="grid grid-cols-3 gap-4">
            <FormKit
              v-for="(item, index) in criteria.slice(2)"
              :key="index"
              type="select"
              :name="item.label.toLowerCase().replace(' ', '_')"
              :label="item.label"
              :options="item.options"
              v-model="selectedCriteria[`kriteria${index + 3}`]"
              placeholder="Pilih pilihan"
            >
              <template #label>
                <label
                  class="formkit-label text-gray-700 dark:text-gray-200 block mb-2 font-semibold text-sm formkit-invalid:text-red-500"
                >
                  {{ item.label }}
                </label>
              </template>
            </FormKit>
          </div>

          <div class="flex justify-end items-center gap-2">
            <rs-button @click="resetFilter" variant="primary-outline"
              >Tetapkan Semula</rs-button
            >
            <rs-button type="submit" @click="performSearch">
              Hantar Laporan
            </rs-button>
          </div>
        </FormKit>

        <rs-table
          class="mt-8"
          :key="filteredData"
          :data="filteredData"
          :pageSize="100"
        >
          <template v-slot:status="data">
            <rs-badge
              :variant="
                data.text === 'Tiba'
                  ? 'success'
                  : data.text === 'Masih dalam penerbangan'
                  ? 'warning'
                  : data.text === 'Terlepas'
                  ? 'danger'
                  : data.text === 'Dibatalkan'
                  ? 'disabled'
                  : 'default'
              "
            >
              {{ data.text }}
            </rs-badge>
          </template>
        </rs-table>
      </template>
    </rs-card>
  </div>
</template>
