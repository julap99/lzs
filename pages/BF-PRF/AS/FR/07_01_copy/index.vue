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
            <!-- S2: MAKLUMAT SYOR -->
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
                  readOnly="true"
                  type="select"
                  name="assignSiasatan"
                  label="Assign Siasatan"
                  value="petugas_a"
                  :options="assignSiasatanOptions"
                  placeholder="Pilih petugas siasatan"
                  :classes="{
                    input: '!py-2.5',
                    label: 'text-sm font-medium text-gray-700',
                  }"
                  v-model="profilingData.assignSiasatan" />
                <div class="md:col-span-2 flex items-end justify-end">
                  <rs-button
                    disabled
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

    <rs-card class="mt-4">
      <template #header>
        <h2 class="text-xl font-semibold">Pengesahan Status</h2>
      </template>

      <template #body>
        <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <!-- S2: MAKLUMAT SYOR (Editable Table) -->
          <section class="p-6">
            <h4
              class="text-md font-semibold text-gray-900 mb-4 flex items-center">
              <Icon
                name="ph:clipboard-text"
                class="w-5 h-5 mr-2 text-green-600" />
              Maklumat Syor
            </h4>

            <rs-table
              :columns="tableHeaders"
              :data="editableRows"
              :advanced="false"
              :showSearch="false"
              :showFilter="false"
              :options="{ variant: 'default', striped: false, hover: false }"
            >
              <template #pengenalanId="{ text }">
                {{ text }}
              </template>
              <template #nama="{ value }">
                <FormKit
                  type="text"
                  :model-value="getRowField(value, 'nama')"
                  @input="val => updateNama(value, String(val))"
                  outer-class="mb-0"
                  :classes="{ input: '!py-1.5 !text-sm !border-gray-300' }"
                />
              </template>
              <template #kategori="{ value }">
                <FormKit
                  type="select"
                  :model-value="getRowField(value, 'kategori')"
                  :options="kategoriAsnafOptions"
                  @input="val => updateKategori(String(val))"
                  outer-class="mb-0"
                  :classes="{ input: '!py-1.5 !text-sm !border-gray-300' }"
                />
              </template>
              <template #statusMultidimensi="{ value }">
                <FormKit
                  type="select"
                  :model-value="getRowField(value, 'statusMultidimensi')"
                  :options="statusMultidimensiOptions"
                  @input="val => updateStatusMultidimensi(value, String(val))"
                  outer-class="mb-0"
                  :classes="{ input: '!py-1.5 !text-sm !border-gray-300' }"
                />
              </template>
              <template #pelarasan="{ value }">
                <FormKit
                  type="checkbox"
                  :model-value="Boolean((value as any).pelarasan)"
                  @input="val => updatePelarasan(value, Boolean(val))"
                  outer-class="mb-0 flex justify-center"
                  :classes="{
                    wrapper: 'flex items-center justify-center',
                    input: 'w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2',
                    label: 'sr-only'
                  }"
                />
              </template>
            </rs-table>
          </section>

          <!-- Pengesahan Fields -->
          <section class="p-6 bg-gray-50 border-t border-gray-200">
            <h4
              class="text-md font-semibold text-gray-900 mb-4 flex items-center">
              <Icon name="ph:check-circle" class="w-5 h-5 mr-2 text-blue-600" />
              Pengesahan
            </h4>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormKit
                type="textarea"
                name="komenPengesahan"
                label="Komen Pengesahan"
                placeholder="Masukkan komen pengesahan..."
                rows="4"
                :classes="{
                  label: 'text-sm font-medium text-gray-700',
                  input: '!py-3 !text-gray-900 !font-medium resize-none',
                }"
                v-model="profilingData.komenPengesahan" />

              <FormKit
                type="date"
                name="tarikhPengesahan"
                label="Tarikh Pengesahan"
                :classes="{
                  label: 'text-sm font-medium text-gray-700',
                  input: '!py-3 !text-gray-900 !font-medium',
                }"
                v-model="profilingData.tarikhPengesahan" />

              <FormKit
                type="text"
                name="nama"
                label="Nama Pengesah"
                value="admin"
                readonly="true"
                :classes="{
                  label: 'text-sm font-medium text-gray-700',
                  input: '!py-3 !text-gray-900 !font-medium',
                }"
                v-model="profilingData.namaPengesah" />
            </div>

            <div class="flex justify-between gap-3 mt-6">
              <rs-button variant="primary" @click="handleKembali">
                <Icon name="ph:x" class="w-4 h-4 mr-2" /> Kembali
              </rs-button>
              <div class="flex gap-3">
                <rs-button variant="secondary" @click="handleLihat">
                  <Icon name="ph:eye" class="w-4 h-4 mr-2" /> Siasatan
                </rs-button>
                <rs-button variant="success" @click="handleHantar">
                  <Icon name="ph:paper-plane-right" class="w-4 h-4 mr-2" />
                  Hantar
                </rs-button>
              </div>
            </div>
          </section>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { ComputedRef } from "vue";
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
  status: "Menunggu Pengesahan",
  keputusanSiasatan: "",
  tarikhLawatan: "",
  masaLawatan: "",
  catatanPenilianAwal: "",
});

/* PROFILING DATA */
const profilingData = ref({
  pengenalanId: "770319035991",
  nama: "Adnan bin Abu",
  merit: "0.69",
  multidimensi: "Produktif C",
  hadKifayahSyor: "50.81",
  kategoriKeluargaAsnafSyor: "Miskin",
  kategoriAsnafSyor: "Miskin",
  tarikhPengesyoran: new Date().toLocaleDateString("ms-MY", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }),
  pengenalanIdTanggungan1: "801004035672",
  pengenalanIdTanggungan2: "060802030272",
  pengenalanIdTanggungan3: "091108030442",
  merit1: "0.64",
  merit2: "0.38",
  merit3: "0.40",
  multidimensi1: "Produktif C",
  multidimensi2: "Tidak Produktif",
  multidimensi3: "Tidak Produktif",
  kategoriTanggunganSyor: "Tanggungan Utama",
  kategoriTanggunganSyor1: "Miskin",
  kategoriTanggunganSyor2: "Miskin",
  kategoriTanggunganSyor3: "Miskin",
  tanggunganCheckbox1: false,
  tanggunganCheckbox2: false,
  tanggunganCheckbox3: false,
  meritKeluargaSyor: "0.55",
  statusMultidimensiKeluargaSyor: "Produktif C",
  quadrantMultidimensiKeluargaSyor: "Asnaf Produktif Sementara",
  bakiHadKifayahSah: "RM-968.00",
  peratusanPerbezaan: "50.81%",
  kategoriKeluargaAsnaf: "Miskin",
  kategoriAsnaf: "Miskin",
  jumlahHadKifayahSah: "RM1968.00",
  assignSiasatan: "petugas_a",
  komenPengesahan: "",
  namaPengesah: "admin",
  tarikhPengesahan: new Date().toISOString().split("T")[0], // Default to today's date
  pemohonCheckbox: false,
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
});

const tableData = computed(() => {
  // Main applicant
  const mainApplicant = {
    pengenalanId: profilingData.value.pengenalanId,
    nama: profilingData.value.nama,
    multidimensi: profilingData.value.multidimensi,
  };

  // Combine main applicant and dependents
  return [mainApplicant, ...profilingData.value.dependents].map((person) => ({
    pengenalanId: person.pengenalanId,
    nama: person.nama,
    kategori: profilingData.value.kategoriAsnafSyor,
    statusMultidimensi: person.multidimensi,
  }));
});

const tableHeaders = ref([
  { key: "pengenalanId", label: "Pengenalan ID" },
  { key: "nama", label: "Nama" },
  { key: "kategori", label: "Kategori" },
  { key: "statusMultidimensi", label: "Status Multidimensi" },
  { key: "pelarasan", label: "Pelarasan" },
]);

type EditableRow = {
  pengenalanId: string;
  nama: string;
  kategori: string;
  statusMultidimensi: string;
  pelarasan?: boolean;
};

// Editable rows for third card table
const editableRows: ComputedRef<EditableRow[]> = computed(() => {
  const main = {
    pengenalanId: profilingData.value.pengenalanId,
    nama: profilingData.value.nama,
    kategori: profilingData.value.kategoriAsnafSyor ?? profilingData.value.kategoriAsnaf,
    statusMultidimensi: profilingData.value.multidimensi,
    pelarasan: Boolean(profilingData.value.pemohonCheckbox),
  };
  const dependents: EditableRow[] = (profilingData.value.dependents || []).map((d: any, idx: number) => ({
    pengenalanId: d.pengenalanId,
    nama: d.nama,
    kategori: profilingData.value.kategoriAsnafSyor ?? profilingData.value.kategoriAsnaf,
    statusMultidimensi: d.multidimensi,
    pelarasan:
      idx === 0
        ? Boolean(profilingData.value.tanggunganCheckbox1)
        : idx === 1
        ? Boolean(profilingData.value.tanggunganCheckbox2)
        : idx === 2
        ? Boolean(profilingData.value.tanggunganCheckbox3)
        : false,
  }));
  return [main, ...dependents];
});

function updateNama(row: EditableRow, newValue: string) {
  const id = row.pengenalanId;
  if (id === profilingData.value.pengenalanId) {
    profilingData.value.nama = newValue;
    return;
  }
  const target = profilingData.value.dependents.find((d: any) => d.pengenalanId === id);
  if (target) target.nama = newValue;
}

function updateKategori(newValue: string) {
  // Apply category to whole household, matching second table behavior
  profilingData.value.kategoriAsnafSyor = newValue;
}

function updateMerit(row: EditableRow, newValue: string) {
  const id = row.pengenalanId;
  if (id === profilingData.value.pengenalanId) {
    profilingData.value.merit = newValue;
    return;
  }
  const target = profilingData.value.dependents.find((d: any) => d.pengenalanId === id);
  if (target) target.merit = newValue;
}

function updateStatusMultidimensi(row: EditableRow, newValue: string) {
  const id = row.pengenalanId;
  if (id === profilingData.value.pengenalanId) {
    profilingData.value.multidimensi = newValue;
    return;
  }
  const target = profilingData.value.dependents.find((d: any) => d.pengenalanId === id);
  if (target) target.multidimensi = newValue;
}

function getRowField(row: EditableRow, key: keyof EditableRow): string {
  return String(row[key] ?? "");
}

function updatePelarasan(row: EditableRow, checked: boolean) {
  const id = row.pengenalanId;
  if (id === profilingData.value.pengenalanId) {
    profilingData.value.pemohonCheckbox = checked;
    return;
  }
  const idx = profilingData.value.dependents.findIndex((d: any) => d.pengenalanId === id);
  if (idx === 0) profilingData.value.tanggunganCheckbox1 = checked;
  if (idx === 1) profilingData.value.tanggunganCheckbox2 = checked;
  if (idx === 2) profilingData.value.tanggunganCheckbox3 = checked;
}

/* OPTIONS */
const assignSiasatanOptions = ref([
  { label: "PAK", value: "petugas_a" },
  { label: "PAK+", value: "petugas_b" },
  { label: "Pegawai LZS", value: "petugas_c" },
]);

const kategoriKeluargaOptions = ref([
  { label: "Miskin", value: "Miskin" },
  { label: "Sederhana", value: "Sederhana" },
  { label: "Kaya", value: "Kaya" },
]);

const kategoriAsnafOptions = ref([
  { label: "Miskin", value: "Miskin" },
  { label: "Fakir", value: "Fakir" },
  { label: "Muallaf", value: "Muallaf" },
  { label: "Riqab", value: "Riqab" },
  { label: "Gharimin", value: "Gharimin" },
  { label: "Fisabilillah", value: "Fisabilillah" },
  { label: "Ibnus Sabil", value: "Ibnus Sabil" },
]);

const kategoriTanggunganOptions = ref([
  { label: "Miskin", value: "Miskin" },
  { label: "Sederhana", value: "Sederhana" },
  { label: "Kaya", value: "Kaya" },
  { label: "Tanggungan Utama", value: "Tanggungan Utama" },
]);

const statusMultidimensiOptions = ref([
  { label: "Produktif A", value: "Produktif A" },
  { label: "Produktif B", value: "Produktif B" },
  { label: "Produktif C", value: "Produktif C" },
  { label: "Tidak Produktif", value: "Tidak Produktif" },
]);

const quadrantMultidimensiOptions = ref([
  { label: "Asnaf Produktif Sementara", value: "Asnaf Produktif Sementara" },
  { label: "Asnaf Produktif Tetap", value: "Asnaf Produktif Tetap" },
  {
    label: "Asnaf Tidak Produktif Sementara",
    value: "Asnaf Tidak Produktif Sementara",
  },
  {
    label: "Asnaf Tidak Produktif Tetap",
    value: "Asnaf Tidak Produktif Tetap",
  },
]);

const handleTugasanHantar = () => {
  toast.success("Tugasan telah diberikan kepada pegawai siasatan");
  navigateTo("/BF-PRF/AS/FR/07_1");
};

const handleFormSubmit = (formData: any) => {
  console.log("Form submitted:", formData);
  toast.success("Maklumat Pengesahan Status part 2 telah disimpan");
};

const handleFormReset = () => {
  // Reset to original values
  profilingData.value = {
    pengenalanId: "770319035991",
    nama: "Adnan bin Abu",
    merit: "0.69",
    multidimensi: "Produktif C",
    hadKifayahSyor: "50.81",
    kategoriKeluargaAsnafSyor: "Miskin",
    kategoriAsnafSyor: "Miskin",
    tarikhPengesyoran: new Date().toLocaleDateString("ms-MY", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }),
    pengenalanIdTanggungan1: "801004035672",
    pengenalanIdTanggungan2: "060802030272",
    pengenalanIdTanggungan3: "091108030442",
    merit1: "0.64",
    merit2: "0.38",
    merit3: "0.40",
    multidimensi1: "Produktif C",
    multidimensi2: "Tidak Produktif",
    multidimensi3: "Tidak Produktif",
    kategoriTanggunganSyor: "Tanggungan Utama",
    kategoriTanggunganSyor1: "Miskin",
    kategoriTanggunganSyor2: "Miskin",
    kategoriTanggunganSyor3: "Miskin",
    tanggunganCheckbox1: false,
    tanggunganCheckbox2: false,
    tanggunganCheckbox3: false,
    meritKeluargaSyor: "0.55",
    statusMultidimensiKeluargaSyor: "Produktif C",
    quadrantMultidimensiKeluargaSyor: "Asnaf Produktif Sementara",
    bakiHadKifayahSah: "RM-968.00",
    peratusanPerbezaan: "50.81%",
    kategoriKeluargaAsnaf: "Miskin",
    kategoriAsnaf: "Miskin",
    jumlahHadKifayahSah: "RM1968.00",
    assignSiasatan: "petugas_a",
    komenPengesahan: "",
    namaPengesah: "admin",
    tarikhPengesahan: new Date().toISOString().split("T")[0], // Default to today's date
    pemohonCheckbox: false,
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
  };
  toast.info("Form telah direset kepada nilai asal");
};

const handleKembali = () => {
  navigateTo("/BF-PRF/AS/FR/07_1");
};

const handleHantar = () => {
  toast.success("Maklumat Pengesahan Status telah disimpan");
};

const handleLihat = () => {
  navigateTo("/BF-PRF/AS/FR/09");
};

/* HELPERS */
function getStatusVariant(status: string) {
  if (status === "Menunggu Pengesahan") return "primary";
  if (status === "Diluluskan") return "success";
  if (status === "Ditolak") return "danger";
  return "default";
}

function getAssignSiasatanLabel(value: string) {
  const option = assignSiasatanOptions.value.find((opt) => opt.value === value);
  return option ? option.label : value;
}
</script>
