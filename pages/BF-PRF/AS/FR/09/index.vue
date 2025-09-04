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
            :variant="getStatusVariant(formData.status)"
          >
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
              class="bg-white border border-gray-200 rounded-lg overflow-hidden"
            >
              <!-- S2: Siasatan Dilapangan -->
              <section class="p-6">
                <h4
                  class="text-md font-semibold text-gray-900 mb-4 flex items-center"
                >
                  <Icon
                    name="ph:clipboard-text"
                    class="w-5 h-5 mr-2 text-green-600"
                  />
                  Siasatan Di Lapangan
                </h4>

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div>
                  <label class="block text-xs uppercase tracking-wide">
                   Jumlah Had Kifayah
                  </label>
                  <p class="text-gray-900 font-medium">
                    {{ profilingData.jumlahHadKifayahSah }}
                  </p>

                  <label class="block text-xs uppercase tracking-wide mt-4">
                    Baki Pendapatan
                  </label>
                  <p class="text-gray-900 font-medium">
                    {{ profilingData.bakiHadKifayahSah }}
                  </p>

                  <label class="block text-xs uppercase tracking-wide mt-4">
                    Peratusan Perbezaan
                  </label>
                  <p class="text-gray-900 font-medium">
                    {{ profilingData.peratusanPerbezaan }}
                  </p>
                  <label class="block text-xs uppercase tracking-wide mt-4">
                    Kategori Keluarga Asnaf
                  </label>
                  <p class="text-gray-900 font-medium">
                    {{ profilingData.kategoriKeluargaAsnaf }}
                  </p>
                </div>
                <div class="hidden lg:block"></div>
                <div class="hidden lg:block"></div>
                  <div>
                    <label class="block text-xs uppercase tracking-wide">
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
                    <label class="block text-xs uppercase tracking-wide">
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
                    <label class="block text-xs uppercase tracking-wide">
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
                    <label class="block text-xs uppercase tracking-wide">
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
                    <label class="block text-xs uppercase tracking-wide">
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
                </div>
                <!-- Row 3 in one column -->
                <div class="mt-4">
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
              </section>
              
            </div>
            <div class="md:col-span-2 flex items-end justify-start mt-4">
                    <rs-button variant="danger" @click="handleKembali" class="px-6 py-2.5">
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
                :classes="{ input: '!py-2.5' }"
              />
            </section>

            <section class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 class="text-sm font-semibold text-gray-900 mb-3">
                  Tarikh Lawatan
                </h4>
                <FormKit
                  type="date"
                  name="tarikhLawatan"
                  :classes="{ input: '!py-2.5' }"
                />
              </div>
              <div>
                <h4 class="text-sm font-semibold text-gray-900 mb-3">
                  Masa Lawatan
                </h4>
                <FormKit
                  type="time"
                  name="masaLawatan"
                  :classes="{ input: '!py-2.5' }"
                />
              </div>
            </section>

            <section>
              <h4 class="text-sm font-semibold text-gray-900 mb-3">
                Tingkah laku Asnaf
              </h4>
              <FormKit
                type="textarea"
                name="tingkahLakuAsnaf"
                placeholder="Pemerhatian..."
                value="Asnaf Garang dan Baran, perlukan bantuan masyarakat"
                rows="4"
                readonly="true"
                :classes="{ input: '!py-2.5' }"
              />
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
                :classes="{ input: '!py-2.5' }"
              />
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
                :classes="{ input: '!py-2.5' }"
              />
              <div class="flex justify-between items-center mt-4">
                <rs-button
                  variant="success"
                  @click="handleSimpanDrafLawatan"
                  class="mt-4"
                >
                  <Icon name="ph:floppy-disk" class="w-4 h-4 mr-2" />
                  Simpan Draf
                </rs-button>
                <rs-button
                  variant="primary"
                  @click="handleStatusLawatan"
                  class="mt-4"
                >
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
  email: "adnan.abu@gmail.com",
  status: "Dalam Siasatan",
  keputusanSiasatan: "",
  tarikhLawatan: "",
  masaLawatan: "",
  catatanPenilianAwal: "",
  gambarLokasi: null as File | null,
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
  meritKeluargaSyor: "0.55",
  statusMultidimensiKeluargaSyor: "Produktif C",
  quadrantMultidimensiKeluargaSyor: "Asnaf Produktif Sementara",
  bakiHadKifayahSah: "RM-968.00",
  peratusanPerbezaan: "50.81%",
  kategoriKeluargaAsnaf: "Miskin",
  kategoriAsnaf: "Miskin",
  jumlahHadKifayahSah: "RM1968.00",
  assignSiasatan: "",
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
  { label:"Perlukan Lawatan Semula",value:"lawatan-semula"}
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
  navigateTo('/BF-PRF/AS/FR/09_senaraiTugasan');
};

const handleSimpanDrafLawatan = () => {
  toast.success("Draf lawatan telah disimpan");
  // navigateTo('/BF-PRF/AS/FR/07_1');
};

const handleKembali = () => {
  navigateTo('/BF-PRF/AS/FR/09_senaraiTugasan');
};
</script>
