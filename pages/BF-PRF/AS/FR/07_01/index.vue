<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />
    <!-- Maklumat Pemohon - Iframe Component -->
    <rs-card class="mt-4">
        <template #header>
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold">Maklumat Pemohon</h2>
            <!-- <rs-badge variant="warning">
              Menunggu Siasatan
            </rs-badge> -->
          </div>
        </template>
        <template #body>
          <div class="w-full">
            <iframe
              src="https://lzs-nine.vercel.app/BF-PRF/AS/FR/02_readonly?iframe=true"
              class="w-full h-96 border-0 rounded-lg"
              title="Maklumat Pemohon"
            ></iframe>
          </div>
        </template>
      </rs-card>

    <!-- ===== Pengesahan Status ===== -->
    <rs-card class="mt-4">
      <template #header>
        <h2 class="text-xl font-semibold">Pengesahan Status</h2>
      </template>

      <template #body>
        <div class="space-y-6">
          <div
            class="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div
              class="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <!-- Maklumat Syor -->
              <section class="p-6">
                <h4
                  class="text-md font-semibold text-gray-900 mb-4 flex items-center">
                  <Icon
                    name="ph:clipboard-text"
                    class="w-5 h-5 mr-2 text-green-600" />
                  Maklumat Syor
                </h4>

                <!-- Summary Information -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <label
                      class="block text-xs uppercase tracking-wide font-bold">
                      Peratusan Perbezaan
                    </label>
                    <p class="text-gray-900 font-medium">
                      {{ profilingData.peratusanPerbezaan }}
                    </p>
                  </div>
                  <div>
                    <label
                      class="block text-xs uppercase tracking-wide font-bold">
                      Kategori Keluarga Asnaf
                    </label>
                    <p class="text-gray-900 font-medium">
                      {{ profilingData.kategoriKeluargaAsnaf }}
                    </p>
                  </div>
                  <div>
                    <label
                      class="block text-xs uppercase tracking-wide font-bold">
                      Kategori Asnaf
                    </label>
                    <p class="text-gray-900 font-medium">
                      {{ profilingData.kategoriAsnaf }}
                    </p>
                  </div>
                </div>

                <!-- Table for Individual Data -->
                <rs-table
                  :headers="tableHeaders"
                  :data="tableData"
                  :classes="{
                    table: 'min-w-full',
                    thead: 'bg-gray-50',
                    tbody: 'bg-white divide-y divide-gray-200',
                    th: 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
                    td: 'px-6 py-4 whitespace-nowrap text-sm text-gray-900',
                  }" />
                <!-- Row 3 in one column -->
                <div class="mt-4">
                  <label
                    class="block text-xs uppercase tracking-wide font-bold">
                    Merit Keluarga(Syor)
                  </label>
                  <p class="text-gray-900 font-medium">
                    {{ profilingData.meritKeluargaSyor }}
                  </p>

                  <label
                    class="block text-xs uppercase tracking-wide mt-4 font-bold">
                    Status Multidimensi Keluarga(Syor)
                  </label>
                  <p class="text-gray-900 font-medium">
                    {{ profilingData.statusMultidimensiKeluargaSyor }}
                  </p>

                  <label
                    class="block text-xs uppercase tracking-wide mt-4 font-bold">
                    Quadrant Multidimensi Keluarga(Syor)
                  </label>
                  <p class="text-gray-900 font-medium">
                    {{ profilingData.quadrantMultidimensiKeluargaSyor }}
                  </p>
                </div>
              </section>
            </div>

            <!-- S3: TUGASAN SIASATAN -->
            <section class="p-6 bg-amber-50">
              <h4
                class="text-md font-semibold text-gray-900 mb-4 flex items-center">
                <Icon name="ph:user-gear" class="w-5 h-5 mr-2 text-amber-600" />
                Tugasan Siasatan
              </h4>

              <!-- Status indicator -->
              <div
                v-if="!profilingData.assignSiasatan"
                class="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p class="text-sm text-yellow-800 flex items-center">
                  <Icon name="ph:info" class="w-4 h-4 mr-2" />
                  Pilih petugas siasatan untuk melihat bahagian Pengesahan
                  Status
                </p>
              </div>

              <!-- Success indicator when value is selected -->
              <div
                v-else
                class="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p class="text-sm text-green-800 flex items-center">
                  <Icon name="ph:check-circle" class="w-4 h-4 mr-2" />
                  Petugas siasatan telah dipilih:
                  <strong>{{
                    getAssignSiasatanLabel(profilingData.assignSiasatan)
                  }}</strong>
                </p>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormKit
                  type="select"
                  name="assignSiasatan"
                  label="Assign Siasatan"
                  :options="assignSiasatanOptions"
                  placeholder="Pilih petugas siasatan"
                  :classes="{
                    input: '!py-2.5',
                    label: 'text-sm font-medium text-gray-700',
                  }"
                  v-model="profilingData.assignSiasatan" />
                <div class="md:col-span-2 flex items-end justify-end">
                  <rs-button
                    variant="primary"
                    @click="handleTugasanHantar"
                    class="px-6 py-2.5">
                    <Icon name="ph:paper-plane-right" class="w-4 h-4 mr-2" />
                    Hantar
                  </rs-button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useToast } from "vue-toastification";

const toast = useToast();

/* PAGE META */
definePageMeta({ title: "Maklumat Pemohon - Siasatan EOAD" });

/* BREADCRUMB */
const breadcrumb = ref([
  { name: "Tugasan", type: "link", path: "/BF-BTN/tugasan" },
  { name: "Siasatan", type: "link", path: "/BF-BTN/tugasan" },
  {
    name: "Maklumat Pemohon",
    type: "current",
    path: "/BF-BTN/tugasan/siasatan-eoad",
  },
]);

/* FORM DATA */
const formData = ref({
  nama: "Adnan bin Abu",
  alamat: "No. 123, Jalan Merdeka, Taman Sejahtera, 50000 Kuala Lumpur",
  jenisPengenalan: "MyKad",
  noPengenalan: "770319035991",
  noTelefon: "0191105544",
  email: "adnan.abu@gmail.com",
  status: "Menunggu Siasatan",
  keputusanSiasatan: "",
  tarikhLawatan: "",
  masaLawatan: "",
  catatanPenilianAwal: "",
});

/* PROFILING DATA */
const profilingData = ref({
  // Main applicant data
  pengenalanId: "770319035991",
  nama: "Adnan bin Abu",
  merit: "0.69",
  multidimensi: "Produktif C",

  // Dependents data - structured array for better maintainability
  dependents: [
    {
      pengenalanId: "801004035672",
      nama: "ROHANA BINTI AHMAD",
      merit: "0.64",
      multidimensi: "Produktif C",
    },
    {
      pengenalanId: "060802030272",
      nama: "NUR NAJWA BINTI ADNAN",
      merit: "0.38",
      multidimensi: "Tidak Produktif",
    },
    {
      pengenalanId: "091108030442",
      nama: "NUR QISTINA BINTI ADNAN",
      merit: "0.40",
      multidimensi: "Tidak Produktif",
    },
  ],

  // Family and category data
  hadKifayahSyor: "50.81",
  kategoriKeluargaAsnafSyor: "Miskin",
  kategoriAsnafSyor: "Miskin",
  kategoriTanggunganSyor: "Tanggungan Utama",
  meritKeluargaSyor: "0.55",
  statusMultidimensiKeluargaSyor: "Produktif C",
  quadrantMultidimensiKeluargaSyor: "Asnaf Produktif Sementara",

  // Financial data
  bakiHadKifayahSah: "RM-968.00",
  peratusanPerbezaan: "50.81%",
  kategoriKeluargaAsnaf: "Miskin",
  kategoriAsnaf: "Miskin",
  jumlahHadKifayahSah: "RM1968.00",

  // System data
  tarikhPengesyoran: new Date().toLocaleDateString("ms-MY", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }),
  assignSiasatan: "",
});

const tableData = computed(() => {
  // Main applicant
  const mainApplicant = {
    pengenalanId: profilingData.value.pengenalanId,
    nama: profilingData.value.nama,
    merit: profilingData.value.merit,
    multidimensi: profilingData.value.multidimensi,
  };

  // Combine main applicant and dependents
  return [mainApplicant, ...profilingData.value.dependents].map((person) => ({
    pengenalanId: person.pengenalanId,
    nama: person.nama,
    kategori: profilingData.value.kategoriAsnafSyor,
    meritIndividu: person.merit,
    statusMultidimensi: person.multidimensi,
  }));
});

const tableHeaders = ref([
  { key: "pengenalanId", label: "Pengenalan ID" },
  { key: "nama", label: "Nama" },
  { key: "kategori", label: "Kategori" },
  { key: "meritIndividu", label: "Merit Individu" },
  { key: "statusMultidimensi", label: "Status Multidimensi" },
]);

/* OPTIONS */
const assignSiasatanOptions = ref([
  { label: "PAK", value: "petugas_a" },
  { label: "PAK+", value: "petugas_b" },
  { label: "Pegawai LZS", value: "petugas_c" },
]);

const handleTugasanHantar = () => {
  toast.success("Tugasan telah diberikan kepada pegawai siasatan");
  navigateTo("/BF-PRF/AS/FR/07_1");
};

/* HELPERS */
function getStatusVariant(status: string) {
  if (status === "Menunggu Siasatan") return "primary";
  if (status === "Diluluskan") return "success";
  if (status === "Ditolak") return "danger";
  return "default";
}

function getAssignSiasatanLabel(value: string) {
  const option = assignSiasatanOptions.value.find((opt) => opt.value === value);
  return option ? option.label : value;
}
</script>
