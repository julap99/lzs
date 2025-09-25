<template>
    <div>
      <LayoutsBreadcrumb :items="breadcrumb" />
  
      <rs-card>
        <template #header>Senarai Aduan</template>
        <template #body>
          <rs-table
            class="mt-8"
            :key="filteredData"
            :data="filteredData"
            :pageSize="10"
            :showNoColumn="true"
            :options="{
              variant: 'default',
              hover: true,
            }"
          >
            <template v-slot:status="data">
              <div class="flex justify-center">
                <rs-badge :variant="getStatusVariant(data.text)" size="sm">
                  {{ data.text }}
                </rs-badge>
              </div>
            </template>
            <template v-slot:tahapKeperluan="data">
              <rs-badge
                :variant="getPernyataanMasalahVariant(data.text)"
                size="sm"
                class="w-4 h-4 rounded-full"
                :title="data.text"
              >
                <!-- {{ data.text }} -->
              </rs-badge>
            </template>
            <template v-slot:tarikhAduan="data">
              <span class="font-medium">{{ formatDate(data.text) }}</span>
            </template>
            <template v-slot:aksi="data">
              <rs-button
                v-if="!isStatusFinal(data.text)"
                variant="primary"
                size="sm"
                class="!px-2 !py-1"
                @click="navigateByStatus(data.text)"
              >
                Lebih
                <Icon name="mdi:chevron-right" class="ml-1" size="1rem" />
              </rs-button>
  
              <rs-button 
                v-if="!isKemaskiniFinal(data.text)"
                  variant="secondary"
                  size="sm"
                  class="!px-2 !py-1 mt-3"
                  @click="bukaPopup(data.text)"
                >
                  Kemaskini
                  <Icon name="mdi:pencil" class="ml-1" size="1rem" />
                </rs-button>
            </template>
          </rs-table>
        </template>
      </rs-card>
  
      <rs-modal v-model="showPopup" title="Kemaskini Status Aduan">
        <div class="space-y-4">
           <FormKit
            type="select"
            label="Status Aduan"
            v-model="form.status"
            :options="statusOptions"
          />
  
          <FormKit
            v-if="form.status !== 'Selesai' && form.status !== 'Ditutup'"
            type="select"
            label="Pilih Pegawai Baharu"
            v-model="form.pegawai"
            :options="pegawaiOptions"
          />
        </div>
  
        <template #footer>
          <div class="flex justify-end gap-2 mt-4">
            <rs-button variant="ghost" @click="showPopup = false">Batal</rs-button>
            <rs-button variant="primary" @click="submitKemaskini">Simpan</rs-button>
          </div>
        </template>
      </rs-modal>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  const showPopup = ref(false);
  const form = ref({ status: '', pegawai: '' });
  
  definePageMeta({
    title: "Senarai Aduan",
  });
  
  const breadcrumb = ref([
    {
      name: "Pengurusan Aduan",
      type: "link",
      path: `/BF-ADN/PA/AT/01`,
    },
    {
      name: "Senarai Aduan",
      type: "current",
      path: "/BF-ADN/PA/AT/01",
    },
  ]);
  
  const data = ref([
    {
      noAduan: "ADN-2024-001",
      namaPengadu: "Ahmad bin Abdullah",
      tahapKeperluan:
        "Terputus Bekalan Makanan/Tiada Tempat Tinggal (Kelas 1/Merah)",
      tarikhAduan: "2024-06-10",
      status: "Aduan Baru",
      aksi: "Aduan Baru",
    },
    {
      noAduan: "ADN-2024-002",
      namaPengadu: "Nur Aisyah binti Omar",
      tahapKeperluan:
        "Masih Ada Bekalan Makanan/Mempunyai Tempat Tinggal/Tiada Sumber Pendapatan (Kelas 2/Kuning)",
      tarikhAduan: "2024-06-09",
      status: "Dalam Proses - Quick Assessment",
      aksi: "Dalam Proses - Quick Assessment",
    },
    /* {
      noAduan: "ADN-2024-003",
      namaPengadu: "Mohamad Hafiz bin Rahim",
      tahapKeperluan: "Pendapatan Berkurangan/Keperluan Lain (Kelas 3/Hijau)",
      tarikhAduan: "2024-06-08",
      status: "Menunggu Kelulusan Bantuan",
      aksi: "Menunggu Kelulusan Bantuan",
    }, */
    {
      noAduan: "ADN-2024-004",
      namaPengadu: "Farah Nadia binti Kamal",
      tahapKeperluan:
        "Terputus Bekalan Makanan/Tiada Tempat Tinggal (Kelas 1/Merah)",
      tarikhAduan: "2024-06-07",
      status: "Dalam Proses - Siasatan Ringkas",
      aksi: "Dalam Proses - Siasatan Ringkas",
    },
    /* {
      noAduan: "ADN-2024-005",
      namaPengadu: "Mat bin Kool",
      tahapKeperluan:
        "Masih Ada Bekalan Makanan/Mempunyai Tempat Tinggal/Tiada Sumber Pendapatan (Kelas 2/Kuning)",
      tarikhAduan: "2024-06-06",
      status: "Menunggu Serahan Bantuan",
      aksi: "Menunggu Serahan Bantuan",
    }, */
    {
      noAduan: "ADN-2024-006",
      namaPengadu: "Muhammad Fakrul bin Razi",
      tahapKeperluan: "Pendapatan Berkurangan/Keperluan Lain (Kelas 3/Hijau)",
      tarikhAduan: "2024-06-05",
      status: "Dalam Proses - Siasatan Lapangan",
      aksi: "Dalam Proses - Siasatan Lapangan",
    },
    {
      noAduan: "ADN-2024-007",
      namaPengadu: "Nurul Asma binti Abu",
      tahapKeperluan:
        "Masih Ada Bekalan Makanan/Mempunyai Tempat Tinggal/Tiada Sumber Pendapatan (Kelas 2/Kuning)",
      tarikhAduan: "2024-06-04",
      status: "Selesai",
      aksi: "Selesai",
    },
    {
      noAduan: "ADN-2024-008",
      namaPengadu: "Hasim bin Osman",
      tahapKeperluan:
        "Terputus Bekalan Makanan/Tiada Tempat Tinggal (Kelas 1/Merah)",
      tarikhAduan: "2024-06-03",
      status: "Ditutup",
      aksi: "Ditutup",
    },
  ]);
  
  
  const criteria = ref([
    {
      label: "Nama Aduan",
      options: ["Aduan Keselamatan", "Aduan Kebersihan", "Aduan Infrastruktur"],
    },
    {
      label: "Pernyataan Masalah",
      options: [
        "Terputus Bekalan Makanan/Tiada Tempat Tinggal (Kelas 1/Merah)",
        "Masih Ada Bekalan Makanan/Mempunyai Tempat Tinggal/Tiada Sumber Pendapatan (Kelas 2/Kuning)",
        "Pendapatan Berkurangan/Keperluan Lain (Kelas 3/Hijau)",
      ],
    },
    {
      label: "Status",
      options: [
        "Aduan Baru",
        "Dalam Proses - Siasatan Ringkas",
        "Dalam Proses - Quick Assessment",
        "Dalam Proses - Siasatan Lapangan",
        "Menunggu Kelulusan Bantuan",
        "Menunggu Serahan Bantuan",
        "Selesai",
        "Ditutup",
      ],
    },
  ]);
  
  const selectedCriteria = ref({
    kriteria1: "",
    kriteria2: "",
    kriteria3: "",
  });
  
  const filteredData = ref([...data.value]);
  
  
  const getStatusVariant = (status) => {
    const variants = {
      "Aduan Baru": "warning",
      "Dalam Proses - Siasatan Ringkas": "primary",
      "Dalam Proses - Quick Assessment": "primary",
      "Dalam Proses - Siasatan Lapangan": "primary",
      "Menunggu Kelulusan Bantuan": "info",
      "Ditamatkan – Tukar Kategori": "info",
      "Selesai": "success",
      "Ditutup": "danger",
    };
    return variants[status] || "default";
  };
  
  const getPernyataanMasalahVariant = (pernyataan) => {
    if (pernyataan.includes("Kelas 1/Merah")) return "danger";
    if (pernyataan.includes("Kelas 2/Kuning")) return "warning";
    if (pernyataan.includes("Kelas 3/Hijau")) return "success";
    return "default";
  };
  
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("ms-MY", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
  };
  
  const navigateByStatus = (status) => {
    console.log(status)
    if (status === "Aduan Baru") {
      navigateTo("/BF-ADN/PA/AT/02");
    } else if (status === "Dalam Proses - Siasatan Ringkas") {
      navigateTo("/BF-ADN/PA/TS/02");
    } else if (status == "Dalam Proses - Siasatan Lapangan") {
      navigateTo("/BF-ADN/PA/TS/05");
    } else if (status == "Dalam Proses - Quick Assessment") {
      navigateTo("/BF-ADN/PA/QA/01");
    } 
    else if (status == "Dalam Proses - Quick Assessment") {
      navigateTo("/BF-ADN/PA/QA/01");
    }else {
      // Default fallback kalau nak
      navigateTo("/BF-ADN/PA/AT/02");
    }
  };
  
  
  const performSearch = () => {
    filteredData.value = data.value.filter((item) => {
      return (
        (!selectedCriteria.value.kriteria1 ||
          item.namaPengadu.includes(selectedCriteria.value.kriteria1)) &&
        (!selectedCriteria.value.kriteria2 ||
          item.pernyataanMasalah.includes(selectedCriteria.value.kriteria2)) &&
        (!selectedCriteria.value.kriteria3 ||
          item.status.includes(selectedCriteria.value.kriteria3))
      );
    });
  };
  
  const resetFilter = () => {
    selectedCriteria.value = {
      kriteria1: "",
      kriteria2: "",
      kriteria3: "",
    };
    filteredData.value = [...data.value];
  };
  
  
  
  const statusOptions = [
    'Dalam Proses - Quick Assessment',
    'Dalam Proses - Siasatan Ringkas',
    'Dalam Proses - Siasatan Lapangan',
    /* 'Agihan Semula', */
    'Selesai',
    'Ditutup'
  ];
  
  const pegawaiOptions = [
    'Pegawai 1',
    'Pegawai 2',
    'Pegawai 3'
  ];
  
  const bukaPopup = (row) => {
    showPopup.value = true;
  };
  
  const submitKemaskini = () => {
    console.log('Kemaskini:', form.value);
    showPopup.value = false;
  };
  
  const isStatusFinal = (status) => {
    return ["Ditutup", "Selesai", "Ditamatkan – Tukar Kategori"].includes(status);
  };
  
  const isKemaskiniFinal = (status) => {
    return ["Ditutup", "Selesai", "Ditamatkan – Tukar Kategori"].includes(status);
  };
  
  </script>
  
  <style lang="scss" scoped></style>
  