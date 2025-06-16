<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Senarai Permohonan Bantuan</h2>
        </div>
      </template>

      <template #body>
        <!-- Search and Filter Section -->
        <div class="mb-6">
          <div class="flex flex-col md:flex-row gap-4">
            <div class="flex-1">
              <FormKit
                v-model="carianKataKunci"
                type="text"
                placeholder="Cari ID permohonan, jenis bantuan..."
                :classes="{
                  input: '!py-2',
                }"
              />
            </div>
            <div class="flex gap-2">
              <FormKit
                v-model="penapis.status"
                type="select"
                :options="pilihanStatus"
                :classes="{
                  input: '!py-2',
                }"
              />
              <FormKit
                v-model="penapis.jenisBantuan"
                type="select"
                :options="pilihanJenisBantuan"
                :classes="{
                  input: '!py-2',
                }"
              />
            </div>
          </div>
        </div>

        <!-- Applications Table -->
        <rs-table
          :data="permohonanDitapis"
          :showNoColumn="true"
          :options="{
            variant: 'default',
            borderless: true,
            hover: true,
          }"
          :pageSize="10"
        >
          <template v-slot:tarikhPermohonan="data">
            {{ formatTarikh(data.text) }}
          </template>
          <template v-slot:jenisPermohonan="data">
            <rs-badge :variant="dapatVarianJenisBantuan(data.text)">
              {{ data.text }}
            </rs-badge>
          </template>
          <template v-slot:noRujukan="data">
            <span class="font-mono text-sm">{{ data.text }}</span>
          </template>
          <template v-slot:status="data">
            <rs-badge :variant="dapatVarianStatus(data.text)">
              {{ data.text }}
            </rs-badge>
          </template>
          <template v-slot:tindakanTerakhir="data">
            {{ formatTarikh(data.text) }}
          </template>
          <template v-slot:tindakan="data">
            <rs-button
              variant="primary"
              size="sm"
              @click="lihatButiran(data.row)"
            >
              Lebih

              <Icon name="heroicons:chevron-right" size="15" />
            </rs-button>
          </template>
        </rs-table>
      </template>
    </rs-card>

    <!-- Details Modal -->
    <rs-modal v-model="modalButiranDilihat" title="Maklumat Permohonan">
      <div v-if="permohonanDipilih" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-gray-500">No. Rujukan</p>
            <p class="font-medium">{{ permohonanDipilih.noRujukan }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Tarikh Permohonan</p>
            <p class="font-medium">
              {{ formatTarikh(permohonanDipilih.tarikhPermohonan) }}
            </p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Jenis Permohonan</p>
            <p class="font-medium">{{ permohonanDipilih.jenisBantuan }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Status</p>
            <p class="font-medium">{{ permohonanDipilih.status }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">Tindakan Terakhir</p>
            <p class="font-medium">
              {{ formatTarikh(permohonanDipilih.tarikhTindakanTerakhir) }}
            </p>
          </div>
        </div>
      </div>

      <template #footer>
        <rs-button variant="primary" @click="modalButiranDilihat = false">
          Tutup
        </rs-button>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

definePageMeta({
  title: "Senarai Permohonan Bantuan",
});

const breadcrumb = ref([
  {
    name: "Status Tracking",
    type: "link",
    path: "/BF-DP/ST/02",
  },
  {
    name: "Senarai Permohonan Bantuan",
    type: "current",
    path: "/BF-DP/ST/02",
  },
]);

// State
const senaraiPermohonan = ref([
  {
    noRujukan: "APP-001",
    tarikhPermohonan: "2024-03-15",
    jenisBantuan: "Bantuan Kewangan",
    status: "Menunggu Siasatan",
    tarikhTindakanTerakhir: "2024-03-15",
    tindakan: 1,
  },
  {
    noRujukan: "APP-002",
    tarikhPermohonan: "2024-03-14",
    jenisBantuan: "Bantuan Makanan",
    status: "Disemak",
    tarikhTindakanTerakhir: "2024-03-14",
    tindakan: 2,
  },
  {
    noRujukan: "APP-003",
    tarikhPermohonan: "2024-03-13",
    jenisBantuan: "Bantuan Pendidikan",
    status: "Lulus",
    tarikhTindakanTerakhir: "2024-03-13",
    tindakan: 3,
  },
  {
    noRujukan: "APP-004",
    tarikhPermohonan: "2024-03-12",
    jenisBantuan: "Bantuan Kewangan",
    status: "Tidak Lulus",
    tarikhTindakanTerakhir: "2024-03-12",
    tindakan: 4,
  },
  {
    noRujukan: "APP-005",
    tarikhPermohonan: "2024-03-11",
    jenisBantuan: "Bantuan Makanan",
    status: "Diterima",
    tarikhTindakanTerakhir: "2024-03-11",
    tindakan: 5,
  },
]);

const permohonanDipilih = ref(null);
const modalButiranDilihat = ref(false);
const carianKataKunci = ref("");
const halamanSemasa = ref(1);
const saizHalaman = ref(10);

// Filters
const penapis = ref({
  status: "",
  jenisBantuan: "",
});

// Options
const pilihanStatus = [
  { label: "Semua Status", value: "" },
  { label: "Menunggu Siasatan", value: "Menunggu Siasatan" },
  { label: "Disemak", value: "Disemak" },
  { label: "Lulus", value: "Lulus" },
  { label: "Tidak Lulus", value: "Tidak Lulus" },
  { label: "Diterima", value: "Diterima" },
  { label: "Dibatalkan", value: "Dibatalkan" },
];

const pilihanJenisBantuan = [
  { label: "Semua Jenis", value: "" },
  { label: "Bantuan Kewangan", value: "Bantuan Kewangan" },
  { label: "Bantuan Makanan", value: "Bantuan Makanan" },
  { label: "Bantuan Pendidikan", value: "Bantuan Pendidikan" },
];

// Computed
const permohonanDitapis = computed(() => {
  let result = [...senaraiPermohonan.value];

  // Apply search
  if (carianKataKunci.value) {
    const query = carianKataKunci.value.toLowerCase();
    result = result.filter(
      (permohonan) =>
        permohonan.noRujukan.toLowerCase().includes(query) ||
        permohonan.jenisBantuan.toLowerCase().includes(query)
    );
  }

  // Apply filters
  if (penapis.value.status) {
    result = result.filter(
      (permohonan) => permohonan.status === penapis.value.status
    );
  }
  if (penapis.value.jenisBantuan) {
    result = result.filter(
      (permohonan) => permohonan.jenisBantuan === penapis.value.jenisBantuan
    );
  }

  return result;
});

// Methods
const dapatVarianStatus = (status) => {
  const variants = {
    "Menunggu Siasatan": "warning",
    Disemak: "info",
    Lulus: "success",
    "Tidak Lulus": "danger",
    Diterima: "success",
    Dibatalkan: "danger",
  };
  return variants[status] || "default";
};

const dapatVarianJenisBantuan = (jenis) => {
  const variants = {
    "Bantuan Kewangan": "success",
    "Bantuan Makanan": "warning",
    "Bantuan Pendidikan": "info",
  };
  return variants[jenis] || "default";
};

const lihatButiran = (permohonan) => {
  navigateTo(`/BF-DP/ST/03`);
};

const formatTarikh = (tarikhString) => {
  if (!tarikhString) return "";
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return new Date(tarikhString).toLocaleDateString("ms-MY", options);
};
</script>
