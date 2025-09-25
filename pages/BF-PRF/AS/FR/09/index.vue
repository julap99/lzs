<template>
  <div>
    <!-- ===== BREADCRUMB ===== -->
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- ===== MAKLUMAT PEMOHON ===== -->
    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Maklumat Pemohon</h2>
          <rs-badge
            v-if="formData.status"
            :variant="getStatusVariant(formData.status)">
            {{ formData.status }}
          </rs-badge>
        </div>
      </template>

      <template #body>
        <FormKit type="form" :actions="false" v-model="formData">
          <rs-fieldset class="mb-6">
            <template #legend>
              <h3 class="text-lg font-medium">Information</h3>
            </template>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Nama</label
                >
                <p class="text-gray-900">{{ formData.nama }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Alamat</label
                >
                <p class="text-gray-900">{{ formData.alamat }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Jenis Pengenalan</label
                >
                <p class="text-gray-900">{{ formData.jenisPengenalan }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >No Pengenalan</label
                >
                <p class="text-gray-900">{{ formData.noPengenalan }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >No Telefon</label
                >
                <p class="text-gray-900">{{ formData.noTelefon }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >E-mel</label
                >
                <p class="text-gray-900">{{ formData.email }}</p>
              </div>
            </div>
          </rs-fieldset>
        </FormKit>
      </template>
    </rs-card>

    <div class="flex flex-col lg:flex-row gap-4 mt-4">
      <rs-card class="flex-1">
        <template #header>
          <h2 class="text-xl font-semibold">Pengesahan Status</h2>
        </template>

        <template #body>
          <div class="space-y-6">
            <div
              class="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <!-- S2: Siasatan Dilapangan -->
              <section class="p-6">
                <h4
                  class="text-md font-semibold text-gray-900 mb-4 flex items-center">
                  <Icon
                    name="ph:clipboard-text"
                    class="w-5 h-5 mr-2 text-green-600" />
                  Siasatan Di Lapangan
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
            <div class="md:col-span-2 flex items-end justify-start mt-4">
              <rs-button
                variant="danger"
                @click="handleKembali"
                class="px-6 py-2.5">
                <Icon name="ph:paper-plane-right" class="w-4 h-4 mr-2" />
                Kembali
              </rs-button>
            </div>
          </div>
        </template>
      </rs-card>

      <rs-card class="flex-1">
        <template #header>
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-3">
              <h2 class="text-xl font-semibold">Maklumat Lawatan & Siasatan</h2>
            </div>
          </div>
        </template>

        <template #body>
          <!-- LAWATAN FORM -->
          <div class="space-y-6">
            <!-- Inputs -->
            <section>
              <h4 class="text-sm font-semibold text-gray-900 mb-3">
                Keadaan Siasatan
              </h4>
              <FormKit
                type="select"
                name="keadaanSiasatan"
                placeholder="Pilih keadaan siasatan"
                :options="keadaanSiasatanOptions"
                :classes="{ input: '!py-2.5' }" />
            </section>

            <section>
              <h4 class="text-sm font-semibold text-gray-900 mb-3">Kategori</h4>
              <FormKit
                type="select"
                name="kategori"
                placeholder="Pilih kategori"
                :options="kategoriOptions"
                :classes="{ input: '!py-2.5' }" />
            </section>

            <section class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 class="text-sm font-semibold text-gray-900 mb-3">
                  Tarikh Lawatan
                </h4>
                <FormKit
                  type="date"
                  name="tarikhLawatan"
                  :classes="{ input: '!py-2.5' }" />
              </div>
              <div>
                <h4 class="text-sm font-semibold text-gray-900 mb-3">
                  Masa Lawatan
                </h4>
                <FormKit
                  type="time"
                  name="masaLawatan"
                  :classes="{ input: '!py-2.5' }" />
              </div>
            </section>

            <section>
              <h4 class="text-sm font-semibold text-gray-900 mb-3">
                Tingkah laku Asnaf
              </h4>
              <FormKit
                type="select"
                name="tingkahLakuAsnaf"
                placeholder="Pilih tingkah laku asnaf"
                :options="tingkahLakuAsnafOptions"
                :classes="{ input: '!py-2.5' }"
                v-model="formData.tingkahLakuAsnaf" />

              <!-- Conditional textarea for "lain-lain" option -->
              <div
                v-if="formData.tingkahLakuAsnaf === 'lain-lain'"
                class="mt-3">
                <FormKit
                  type="textarea"
                  name="tingkahLakuAsnafLain"
                  placeholder="Sila nyatakan tingkah laku asnaf..."
                  rows="3"
                  :classes="{ input: '!py-2.5' }"
                  v-model="formData.tingkahLakuAsnafLain" />
              </div>
            </section>

            <section>
              <h4 class="text-sm font-semibold text-gray-900 mb-3">
                Catatan Lawatan
              </h4>
              <FormKit
                type="textarea"
                name="catatanLawatanETD"
                placeholder="Catatan lawatan..."
                rows="3"
                :classes="{ input: '!py-2.5' }" />
            </section>

            <section>
              <h4 class="text-sm font-semibold text-gray-900 mb-3">
                Status Lawatan
              </h4>
              <FormKit
                type="select"
                name="statusLawatan"
                placeholder="Pilih status lawatan"
                :options="statusLawatanOptions"
                :classes="{ input: '!py-2.5' }" />
              <div class="flex justify-between items-center mt-4">
                <rs-button
                  variant="success"
                  @click="handleSimpanDrafLawatan"
                  class="mt-4">
                  <Icon name="ph:floppy-disk" class="w-4 h-4 mr-2" />
                  Simpan Draf
                </rs-button>
                <rs-button
                  variant="primary"
                  @click="handleStatusLawatan"
                  class="mt-4">
                  <Icon name="ph:paper-plane-right" class="w-4 h-4 mr-2" />
                  Hantar
                </rs-button>
              </div>
            </section>
          </div>
        </template>
      </rs-card>
    </div>
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
  noTelefon: "0123456789",
  email: "adnan.abu@gmail.com",
  status: "Dalam Siasatan",
  keputusanSiasatan: "",
  tarikhLawatan: "",
  masaLawatan: "",
  catatanPenilianAwal: "",
  gambarLokasi: null as File | null,
  tingkahLakuAsnaf: "",
  tingkahLakuAsnafLain: "",
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

/* TABLE CONFIGURATION */
const tableHeaders = ref([
  { key: "pengenalanId", label: "Pengenalan ID" },
  { key: "nama", label: "Nama" },
  { key: "kategori", label: "Kategori" },
  { key: "meritIndividu", label: "Merit Individu" },
  { key: "statusMultidimensi", label: "Status Multidimensi" },
]);

// Computed property for table data - reactive and follows best practices
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

/* OPTIONS */
const assignSiasatanOptions = ref([
  { label: "PAK", value: "petugas_a" },
  { label: "PAK+", value: "petugas_b" },
  { label: "Pegawai LZS", value: "petugas_c" },
]);
const keadaanSiasatanOptions = ref([
  { label: "Selesai", value: "selesai" },
  { label: "Tertunda", value: "tertunda" },
  { label: "Batal", value: "batal" },
]);
const statusLawatanOptions = ref([
  { label: "Lengkap", value: "lengkap" },
  { label: "Tidak Lengkap", value: "tidak-lengkap" },
  { label: "Perlukan Lawatan Semula", value: "lawatan-semula" },
]);

const tingkahLakuAsnafOptions = ref([
  { label: "Beremosi", value: "beremosi" },
  { label: "Baran", value: "baran" },
  { label: "Lain-lain", value: "lain-lain" },
]);

const kategoriOptions = ref([
  { label: "Musafir", value: "musafir" },
  { label: "Mukim", value: "mukim" },
  { label: "Bemastautin", value: "bemastautin" },
]);

/* HELPERS */
function getStatusVariant(status: string) {
  if (status === "Dalam Siasatan") return "primary";
  if (status === "Diluluskan") return "success";
  if (status === "Ditolak") return "danger";
  return "default";
}

const handleStatusLawatan = () => {
  toast.success("Status lawatan telah dihantar");
  navigateTo("/BF-PRF/AS/FR/09_senaraiTugasan");
};

const handleSimpanDrafLawatan = () => {
  toast.success("Draf lawatan telah disimpan");
  // navigateTo('/BF-PRF/AS/FR/07_1');
};

const handleKembali = () => {
  navigateTo("/BF-PRF/AS/FR/09_senaraiTugasan");
};
</script>
