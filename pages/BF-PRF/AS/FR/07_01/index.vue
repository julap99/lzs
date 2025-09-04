<template>
  <LayoutsBreadcrumb :items="breadcrumb" />
  <rs-card class="mt-4">
    <template #header>
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-semibold">Maklumat Pemohon</h2>
        <rs-badge
          v-if="formData.status"
          :variant="getStatusVariant(formData.status)"
        >
          {{ formData.status }}
        </rs-badge>
      </div>
    </template>

    <template #body>
      <rs-fieldset class="mb-6">
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
    </template>
  </rs-card>

  <!-- ===== Pengesahan Status ===== -->
  <rs-card class="mt-4">
    <template #header>
      <h2 class="text-xl font-semibold">Pengesahan Status</h2>
    </template>

    <template #body>
      <div class="space-y-6">
        <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">

            <!-- S2: MAKLUMAT SYOR -->
            <section class="p-6">
              <h4
                class="text-md font-semibold text-gray-900 mb-4 flex items-center"
              >
                <Icon
                  name="ph:clipboard-text"
                  class="w-5 h-5 mr-2 text-green-600"
                />
                Maklumat Syor
              </h4>

              <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div>
                  <label
                    class="block text-xs uppercase tracking-wide"
                  >
                    Pengenalan Id Tanggungan
                  </label>
                  <p class="text-gray-900 font-medium">
                    {{ profilingData.pengenalanIdTanggungan1 }}
                    <br />
                    {{ profilingData.pengenalanIdTanggungan2 }}
                    <br />
                    {{ profilingData.pengenalanIdTanggungan3 }}
                  </p>
                </div>
                <div>
                  <label
                    class="block text-xs uppercase tracking-wide"
                  >
                    Kategori Tanggungan (Syor)
                  </label>
                  <p class="text-gray-900 font-medium">
                    {{ profilingData.kategoriKeluargaAsnafSyor }}
                    <br />
                    {{ profilingData.kategoriKeluargaAsnafSyor }}
                    <br />
                    {{ profilingData.kategoriKeluargaAsnafSyor }}
                  </p>
                </div>
                <!-- spacer to align like screenshot: leave empty third column on first row -->
                <div class="hidden lg:block"></div>
                <div>
                  <label
                    class="block text-xs uppercase tracking-wide"
                  >
                    Pengenalan Id Asnaf/Tanggungan
                  </label>
                  <p class="text-gray-900 font-medium">
                    {{ profilingData.pengenalanId }}
                    <br />
                    {{ profilingData.pengenalanIdTanggungan1 }}
                    <br />
                    {{ profilingData.pengenalanIdTanggungan2 }}
                    <br />
                    {{ profilingData.pengenalanIdTanggungan3 }}
                  </p>
                </div>
                <div>
                  <label
                    class="block text-xs uppercase tracking-wide"
                  >
                    Merit Individu(Syor)
                  </label>
                  <p class="text-gray-900 font-medium">
                    {{ profilingData.merit }}
                    <br />
                    {{ profilingData.merit1 }}
                    <br />
                    {{ profilingData.merit2 }}
                    <br />
                    {{ profilingData.merit3 }}
                  </p>
                </div>
                <div>
                  <label
                    class="block text-xs uppercase tracking-wide"
                  >
                    Status Multidimensi(Syor)
                  </label>
                  <p class="text-gray-900 font-medium">
                    {{ profilingData.multidimensi }}
                    <br />
                    {{ profilingData.multidimensi1 }}
                    <br />
                    {{ profilingData.multidimensi2 }}
                    <br />
                    {{ profilingData.multidimensi3 }}
                  </p>
                </div>
                <!-- Row 3 in one column -->
                <div>
                  <label class="block text-xs uppercase tracking-wide">
                    Merit Keluarga(Syor)
                  </label>
                  <p class="text-gray-900 font-medium">
                    {{ profilingData.meritKeluargaSyor }}
                  </p>

                  <label class="block text-xs uppercase tracking-wide mt-4">
                    Status Multidimensi Keluarga(Syor)
                  </label>
                  <p class="text-gray-900 font-medium">
                    {{ profilingData.statusMultidimensiKeluargaSyor }}
                  </p>

                  <label class="block text-xs uppercase tracking-wide mt-4">
                    Quadrant Multidimensi Keluarga(Syor)
                  </label>
                  <p class="text-gray-900 font-medium">
                    {{ profilingData.quadrantMultidimensiKeluargaSyor }}
                  </p>
                </div>
              </div>
            </section>

            <!-- S3: TUGASAN SIASATAN -->
            <section class="p-6 bg-amber-50">
              <h4
                class="text-md font-semibold text-gray-900 mb-4 flex items-center"
              >
                <Icon name="ph:user-gear" class="w-5 h-5 mr-2 text-amber-600" />
                Tugasan Siasatan
              </h4>

              <!-- Status indicator -->
              <div
                v-if="!profilingData.assignSiasatan"
                class="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
              >
                <p class="text-sm text-yellow-800 flex items-center">
                  <Icon name="ph:info" class="w-4 h-4 mr-2" />
                  Pilih petugas siasatan untuk melihat bahagian Pengesahan
                  Status
                </p>
              </div>

              <!-- Success indicator when value is selected -->
              <div
                v-else
                class="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg"
              >
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
                  v-model="profilingData.assignSiasatan"
                />
                <div class="md:col-span-2 flex items-end justify-end">
                  <rs-button
                    variant="primary"
                    @click="handleTugasanHantar"
                    class="px-6 py-2.5"
                  >
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
</template>

<script setup lang="ts">
import { ref } from "vue";
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
  email: "adnan@gmail.com",
  status: "Dalam Siasatan",
  keputusanSiasatan: "",
  tarikhLawatan: "",
  masaLawatan: "",
  catatanPenilianAwal: "",
});

/* PROFILING DATA */
const profilingData = ref({
  pengenalanId: "770319035991",
  nama: "Adnan bin Abu",
  merit:"0.69",
  multidimensi:"Produktif C",
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
  merit1:"0.64",
  merit2:"0.38",
  merit3:"0.40",
  multidimensi1:"Produktif C",
  multidimensi2:"Tidak Produktif",
  multidimensi3:"Tidak Produktif",
  kategoriTanggunganSyor: "Tanggungan Utama",
  meritKeluargaSyor: "0.55",
  statusMultidimensiKeluargaSyor: "Produktif C",
  quadrantMultidimensiKeluargaSyor: "Asnaf Produktif Sementara",
  assignSiasatan: "",
  hadKifayahSah: null as number | null,
  kategoriKeluargaAsnafSah: "",
  kategoriAsnafSah: "",
  pengenalanIdTanggunganSah1: "",
  pengenalanIdTanggunganSah2: "",
  kategoriTanggunganSah1: "",
  kategoriTanggunganSah2: "",
  komenPengesahan: "",
  tarikhPengesyoranBottom: "",
});


/* OPTIONS */
const assignSiasatanOptions = ref([
  { label: "PAK", value: "petugas_a" },
  { label: "PAK+", value: "petugas_b" },
  { label: "Pegawai LZS", value: "petugas_c" },
]);

const handleTugasanHantar = () =>{

  toast.success("Tugasan telah diberikan kepada pegawai siasatan");
  navigateTo('/BF-PRF/AS/FR/07_1');
}


/* HELPERS */
function getStatusVariant(status: string) {
  if (status === "Dalam Siasatan") return "primary";
  if (status === "Diluluskan") return "success";
  if (status === "Ditolak") return "danger";
  return "default";
}

function getAssignSiasatanLabel(value: string) {
  const option = assignSiasatanOptions.value.find((opt) => opt.value === value);
  return option ? option.label : value;
}

</script>
