<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card>
      <template #header>Sejarah Buka Operasi</template>
      <template #body>
        <!-- Penapis -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <FormKit type="select" label="Status" v-model="selectedFilters.status" :options="statusOptions" />
          <FormKit type="date" label="Tarikh Dari" v-model="selectedFilters.tarikhDari" />
          <FormKit type="date" label="Tarikh Hingga" v-model="selectedFilters.tarikhHingga" />
        </div>

        <div class="flex justify-end space-x-2 mb-4">
          <rs-button variant="primary" @click="performSearch">Cari</rs-button>
          <rs-button variant="secondary" @click="resetFilter">Reset</rs-button>
        </div>

        <!-- Jadual -->
        <rs-table
          class="mt-4"
          :key="filteredData"
          :data="filteredData"
          :pageSize="10"
          :showNoColumn="true"
          :options="{ variant: 'default', hover: true }"
        >
          <template v-slot:tarikh="data">
            <span class="font-medium">{{ formatDate(data.text) }}</span>
          </template>

          <template v-slot:pengguna="data">
            <span>{{ data.text }}</span>
          </template>

          <template v-slot:status="data">
            <div class="flex justify-center">
              <rs-badge :variant="getStatusVariant(data.text)" size="sm">{{ data.text }}</rs-badge>
            </div>
          </template>

          <template v-slot:aksi="data">
            <rs-button variant="primary" size="sm" class="!px-2 !py-1" @click="lihatRekod(data.record)">
              Lihat
              <Icon name="mdi:eye" class="ml-1" size="1rem" />
            </rs-button>
          </template>
        </rs-table>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref } from "vue";

const breadcrumb = ref([
  { name: "Pengurusan Tunai", type: "link", path: "/BF-TNI/MT/OP/01" },
  { name: "Sejarah Buka Operasi", type: "current", path: "/BF-TNI/MT/OP/history" },
]);

const data = ref([
  {
    tarikh: "2025-06-14T08:00:00",
    pengguna: "Ali bin Ahmad",
    status: "Dibuka",
    aksi: ""
  },
  {
    tarikh: "2025-06-13T08:05:00",
    pengguna: "Zarina binti Husin",
    status: "Ditutup",
    aksi: ""
  },
  {
    tarikh: "2025-06-12T07:55:00",
    pengguna: "Rashid bin Omar",
    status: "Ditutup",
    aksi: ""
  },
]);

const filteredData = ref([...data.value]);

const selectedFilters = ref({
  lokasi: "",
  status: "",
  tarikhDari: "",
  tarikhHingga: "",
});

const lokasiOptions = ["Peti Besi Cawangan Klang", "Peti Besi Cawangan Shah Alam"];
const statusOptions = ["Dibuka", "Ditutup"];

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("ms-MY", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusVariant = (status) => {
  return { Dibuka: "info", Ditutup: "success" }[status] || "default";
};

const performSearch = () => {
  const { lokasi, status, tarikhDari, tarikhHingga } = selectedFilters.value;
  filteredData.value = data.value.filter((item) => {
    const itemDate = new Date(item.tarikh);
    const from = tarikhDari ? new Date(tarikhDari) : null;
    const to = tarikhHingga ? new Date(tarikhHingga) : null;

    return (
      (!lokasi || item.lokasi === lokasi) &&
      (!status || item.status === status) &&
      (!from || itemDate >= from) &&
      (!to || itemDate <= to)
    );
  });
};

const resetFilter = () => {
  selectedFilters.value = {
    lokasi: "",
    status: "",
    tarikhDari: "",
    tarikhHingga: "",
  };
  filteredData.value = [...data.value];
};

const lihatRekod = (rekod) => {
  console.log("Lihat rekod:", rekod);
  navigateTo(`/BF-TNI/opening-akaun/sejarah-buka-operasi/01`)
};

</script>

<style lang="scss" scoped></style>