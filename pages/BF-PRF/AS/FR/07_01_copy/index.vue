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
                  <!-- <label class="block text-xs uppercase tracking-wide">
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
                  </p> -->

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
                  <label class="block text-xs uppercase tracking-wide mt-4">
                    Kategori Asnaf
                  </label>
                  <p class="text-gray-900 font-medium">
                    {{ profilingData.kategoriAsnaf }}
                  </p>
                </div>
                <div class="hidden lg:block"></div>
                <div class="hidden lg:block"></div>
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
  <rs-card class="mt-4">
    <template #header>
      <h2 class="text-xl font-semibold">Pengesahan Status 02</h2>
    </template>

    <template #body>
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
                <FormKit
                  type="text"
                  name="peratusanPerbezaan"
                  label="Peratusan Perbezaan"
                  :classes="{
                    label: 'text-xs uppercase tracking-wide font-medium text-gray-700',
                    input: '!py-2.5 !text-gray-900 !font-medium'
                  }"
                  v-model="profilingData.peratusanPerbezaan"
                />
                
                <FormKit
                  type="select"
                  name="kategoriKeluargaAsnaf"
                  label="Kategori Keluarga Asnaf"
                  :options="kategoriKeluargaOptions"
                  :classes="{
                    label: 'text-xs uppercase tracking-wide font-medium text-gray-700 mt-4',
                    input: '!py-2.5 !text-gray-900 !font-medium'
                  }"
                  v-model="profilingData.kategoriKeluargaAsnaf"
                />
                
                <FormKit
                  type="select"
                  name="kategoriAsnaf"
                  label="Kategori Asnaf"
                  :options="kategoriAsnafOptions"
                  :classes="{
                    label: 'text-xs uppercase tracking-wide font-medium text-gray-700 mt-4',
                    input: '!py-2.5 !text-gray-900 !font-medium'
                  }"
                  v-model="profilingData.kategoriAsnaf"
                />
              </div>
              
              <div class="hidden lg:block"></div>
              <div class="hidden lg:block"></div>
              
              <div>
                <FormKit
                  type="text"
                  name="pengenalanIdTanggungan1"
                  label="Pengenalan Id Tanggungan 1"
                  :classes="{
                    label: 'text-xs uppercase tracking-wide font-medium text-gray-700',
                    input: '!py-2.5 !text-gray-900 !font-medium'
                  }"
                  v-model="profilingData.pengenalanIdTanggungan1"
                />
                
                <FormKit
                  type="text"
                  name="pengenalanIdTanggungan2"
                  label="Pengenalan Id Tanggungan 2"
                  :classes="{
                    label: 'text-xs uppercase tracking-wide font-medium text-gray-700 mt-4',
                    input: '!py-2.5 !text-gray-900 !font-medium'
                  }"
                  v-model="profilingData.pengenalanIdTanggungan2"
                />
                
                <FormKit
                  type="text"
                  name="pengenalanIdTanggungan3"
                  label="Pengenalan Id Tanggungan 3"
                  :classes="{
                    label: 'text-xs uppercase tracking-wide font-medium text-gray-700 mt-4',
                    input: '!py-2.5 !text-gray-900 !font-medium'
                  }"
                  v-model="profilingData.pengenalanIdTanggungan3"
                />
              </div>
              
              <div>
                <div class="grid gap-4 grid-cols-[1fr_160px] md:grid-cols-[1fr_200px]">
                  <!-- Left column: all selects stacked -->
                  <div>
                    <FormKit
                      type="select"
                      name="kategoriTanggunganSyor1"
                      label="Kategori Tanggungan (Syor) 1"
                      :options="kategoriTanggunganOptions"
                      :classes="{
                        label: 'text-xs uppercase tracking-wide font-medium text-gray-700',
                        input: '!py-2.5 !text-gray-900 !font-medium'
                      }"
                      v-model="profilingData.kategoriTanggunganSyor1"
                    />
                    <FormKit
                      type="select"
                      name="kategoriTanggunganSyor2"
                      label="Kategori Tanggungan (Syor) 2"
                      :options="kategoriTanggunganOptions"
                      :classes="{
                        label: 'text-xs uppercase tracking-wide font-medium text-gray-700 mt-4',
                        input: '!py-2.5 !text-gray-900 !font-medium'
                      }"
                      v-model="profilingData.kategoriTanggunganSyor2"
                    />
                    <FormKit
                      type="select"
                      name="kategoriTanggunganSyor3"
                      label="Kategori Tanggungan (Syor) 3"
                      :options="kategoriTanggunganOptions"
                      :classes="{
                        label: 'text-xs uppercase tracking-wide font-medium text-gray-700 mt-4',
                        input: '!py-2.5 !text-gray-900 !font-medium'
                      }"
                      v-model="profilingData.kategoriTanggunganSyor3"
                    />
                  </div>

                  <!-- Right column: header + checkboxes stacked -->
                  <div class="pt-1 w-[160px] md:w-[200px]">
                    <div class="text-xs uppercase tracking-wide font-medium text-gray-700 mb-2 text-center">
                      Pelarasan
                    </div>
                    <div class="flex flex-col items-center gap-4">
                      <FormKit
                        type="checkbox"
                        name="tanggunganCheckbox1"
                        :classes="{
                          wrapper: 'flex items-center justify-center',
                          input: 'w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2',
                          label: 'sr-only'
                        }"
                        v-model="profilingData.tanggunganCheckbox1"
                      />
                      <FormKit
                        type="checkbox"
                        name="tanggunganCheckbox2"
                        :classes="{
                          wrapper: 'flex items-center justify-center',
                          input: 'w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2',
                          label: 'sr-only'
                        }"
                        v-model="profilingData.tanggunganCheckbox2"
                      />
                      <FormKit
                        type="checkbox"
                        name="tanggunganCheckbox3"
                        :classes="{
                          wrapper: 'flex items-center justify-center',
                          input: 'w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2',
                          label: 'sr-only'
                        }"
                        v-model="profilingData.tanggunganCheckbox3"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- spacer to align like screenshot: leave empty third column on first row -->
              <div class="hidden lg:block"></div>
              
              <div>
                <FormKit
                  type="text"
                  name="pengenalanId"
                  label="Pengenalan Id Asnaf/Tanggungan"
                  :classes="{
                    label: 'text-xs uppercase tracking-wide font-medium text-gray-700',
                    input: '!py-2.5 !text-gray-900 !font-medium'
                  }"
                  v-model="profilingData.pengenalanId"
                />
              </div>
              
              <div>
                <FormKit
                  type="text"
                  name="merit"
                  label="Merit Individu(Syor)"
                  :classes="{
                    label: 'text-xs uppercase tracking-wide font-medium text-gray-700',
                    input: '!py-2.5 !text-gray-900 !font-medium'
                  }"
                  v-model="profilingData.merit"
                />
              </div>
              
              <div>
                <FormKit
                  type="select"
                  name="multidimensi"
                  label="Status Multidimensi(Syor)"
                  :options="statusMultidimensiOptions"
                  :classes="{
                    label: 'text-xs uppercase tracking-wide font-medium text-gray-700',
                    input: '!py-2.5 !text-gray-900 !font-medium'
                  }"
                  v-model="profilingData.multidimensi"
                />
              </div>
              
              <!-- Row 3 in one column -->
              <div>
                <FormKit
                  type="text"
                  name="meritKeluargaSyor"
                  label="Merit Keluarga(Syor)"
                  :classes="{
                    label: 'text-xs uppercase tracking-wide font-medium text-gray-700',
                    input: '!py-2.5 !text-gray-900 !font-medium'
                  }"
                  v-model="profilingData.meritKeluargaSyor"
                />

                <FormKit
                  type="select"
                  name="statusMultidimensiKeluargaSyor"
                  label="Status Multidimensi Keluarga(Syor)"
                  :options="statusMultidimensiOptions"
                  :classes="{
                    label: 'text-xs uppercase tracking-wide font-medium text-gray-700 mt-4',
                    input: '!py-2.5 !text-gray-900 !font-medium'
                  }"
                  v-model="profilingData.statusMultidimensiKeluargaSyor"
                />

                <FormKit
                  type="select"
                  name="quadrantMultidimensiKeluargaSyor"
                  label="Quadrant Multidimensi Keluarga(Syor)"
                  :options="quadrantMultidimensiOptions"
                  :classes="{
                    label: 'text-xs uppercase tracking-wide font-medium text-gray-700 mt-4',
                    input: '!py-2.5 !text-gray-900 !font-medium'
                  }"
                  v-model="profilingData.quadrantMultidimensiKeluargaSyor"
                />
              </div>
            </div>
          </section>

          <!-- Pengesahan Fields -->
          <section class="p-6 bg-gray-50 border-t border-gray-200">
            <h4
              class="text-md font-semibold text-gray-900 mb-4 flex items-center"
            >
              <Icon
                name="ph:check-circle"
                class="w-5 h-5 mr-2 text-blue-600"
              />
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
                  input: '!py-3 !text-gray-900 !font-medium resize-none'
                }"
                v-model="profilingData.komenPengesahan"
              />
              
              <FormKit
                type="date"
                name="tarikhPengesahan"
                label="Tarikh Pengesahan"
                :classes="{
                  label: 'text-sm font-medium text-gray-700',
                  input: '!py-3 !text-gray-900 !font-medium'
                }"
                v-model="profilingData.tarikhPengesahan"
              />

              <FormKit
                type="text"
                name="nama"
                label="Nama Pengesah"
                value="admin"
                readonly="true"
                :classes="{
                  label: 'text-sm font-medium text-gray-700',
                  input: '!py-3 !text-gray-900 !font-medium'
                }"
                v-model="profilingData.namaPengesah"
              />
            </div>

            <div class="flex justify-between gap-3 mt-6">
              <rs-button variant="primary" @click="handleKembali">
                <Icon name="ph:x" class="w-4 h-4 mr-2" /> Kembali
              </rs-button>
              <div class="flex gap-3">
                <rs-button variant="secondary" @click="handleLihat">
                  <Icon name="ph:eye" class="w-4 h-4 mr-2" /> Lihat
                </rs-button>
                <rs-button variant="success" @click="handleHantar">
                  <Icon name="ph:paper-plane-right" class="w-4 h-4 mr-2" /> Hantar
                </rs-button>
              </div>
            </div>
          </section>

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
  noTelefon: "0191105544",
  email: "adnan.abu@gmail.com",
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
  assignSiasatan: "",
  komenPengesahan: "",
  namaPengesah: "admin",
  tarikhPengesahan: new Date().toISOString().split('T')[0], // Default to today's date
});


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
  { label: "Asnaf Tidak Produktif Sementara", value: "Asnaf Tidak Produktif Sementara" },
  { label: "Asnaf Tidak Produktif Tetap", value: "Asnaf Tidak Produktif Tetap" },
]);

const handleTugasanHantar = () =>{
  toast.success("Tugasan telah diberikan kepada pegawai siasatan");
  navigateTo('/BF-PRF/AS/FR/07_1');
}

const handleFormSubmit = (formData: any) => {
  console.log('Form submitted:', formData);
  toast.success("Maklumat Pengesahan Status part 2 telah disimpan");
}

const handleFormReset = () => {
  // Reset to original values
  profilingData.value = {
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
    assignSiasatan: "",
    komenPengesahan: "",
    namaPengesah: "admin",
    tarikhPengesahan: new Date().toISOString().split('T')[0], // Default to today's date
  };
  toast.info("Form telah direset kepada nilai asal");
}

const handleKembali = () => {
  navigateTo('/BF-PRF/AS/FR/07_1');
}

const handleHantar = () => {
  toast.success("Maklumat Pengesahan Status part 2 telah disimpan");
}

const handleLihat = () => {
  navigateTo('/BF-PRF/AS/FR/09');
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
