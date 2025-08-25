<template>
  <div class="min-h-screen">
    <div class="">
      <LayoutsBreadcrumb :items="breadcrumb" />

      <!-- Page Header -->
      <div class="mt-6 mb-8">
        <div
          class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Siasatan Lapangan</h1>
            <p class="mt-1 text-sm text-gray-600">
              Kemaskini maklumat siasatan dan dapatan lapangan
            </p>
          </div>
          <rs-badge
            v-if="formData.statusPermohonan"
            :variant="getStatusVariant(formData.statusPermohonan)"
            class="text-sm px-4 py-2"
          >
            {{ getStatusText(formData.statusPermohonan) }}
          </rs-badge>
        </div>
      </div>

      <div class="space-y-6">
        <!-- Section 1: Maklumat Permohonan (Read-only) -->
        <rs-card class="shadow-sm border-0 bg-white">
          <template #header>
            <div class="flex items-center space-x-3">
              <div class="flex-shrink-0">
                <div
                  class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"
                >
                  <Icon name="ph:user-circle" class="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div>
                <h2 class="text-lg font-semibold text-gray-900">
                  Maklumat Permohonan
                </h2>
                <p class="text-sm text-gray-500">
                  Butiran pemohon dan status permohonan
                </p>
              </div>
            </div>
          </template>

          <template #body>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div class="space-y-1">
                <label class="text-sm font-medium text-gray-700"
                  >ID Permohonan</label
                >
                <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                  <span class="text-sm font-mono text-gray-900">{{
                    formData.idPermohonan
                  }}</span>
                </div>
              </div>

              <div class="space-y-1">
                <label class="text-sm font-medium text-gray-700"
                  >Nama Pemohon / Institusi</label
                >
                <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                  <span class="text-sm text-gray-900">{{
                    formData.namaPemohon
                  }}</span>
                </div>
              </div>

              <div class="space-y-1">
                <label class="text-sm font-medium text-gray-700">No IC</label>
                <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                  <span class="text-sm font-mono text-gray-900">{{
                    formData.noIc
                  }}</span>
                </div>
              </div>

              <div class="space-y-1 md:col-span-2">
                <label class="text-sm font-medium text-gray-700">Alamat</label>
                <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                  <span class="text-sm text-gray-900">{{
                    formData.alamat
                  }}</span>
                </div>
              </div>

              <div class="space-y-1">
                <label class="text-sm font-medium text-gray-700"
                  >Jenis Bantuan</label
                >
                <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                  <span class="text-sm text-gray-900">{{
                    formData.jenisBantuan
                  }}</span>
                </div>
              </div>

              <div class="space-y-1">
                <label class="text-sm font-medium text-gray-700">SEGERA</label>
                <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                  <input
                    type="checkbox"
                    :checked="formData.segera"
                    disabled
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span class="ml-2 text-sm text-gray-900">
                    {{ formData.segera ? "Ya" : "Tidak" }}
                  </span>
                </div>
              </div>

              <div class="space-y-1">
                <label class="text-sm font-medium text-gray-700"
                  >Tarikh Permohonan</label
                >
                <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                  <span class="text-sm text-gray-900">{{
                    formData.tarikhPermohonan
                  }}</span>
                </div>
              </div>

              <div class="space-y-1">
                <label class="text-sm font-medium text-gray-700"
                  >Status Permohonan</label
                >
                <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                  <rs-badge
                    :variant="getStatusVariant(formData.statusPermohonan)"
                    class="text-sm"
                  >
                    {{ getStatusText(formData.statusPermohonan) }}
                  </rs-badge>
                </div>
              </div>

              <div class="space-y-1">
                <label class="text-sm font-medium text-gray-700"
                  >Tarikh Dijadualkan Lawatan</label
                >
                <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                  <span class="text-sm text-gray-900">{{
                    formData.tarikhDijadualkanLawatan || "Tiada"
                  }}</span>
                </div>
              </div>

              <div class="space-y-1">
                <label class="text-sm font-medium text-gray-700"
                  >Status Lawatan</label
                >
                <FormKit
                  type="select"
                  :options="statusLawatanOptions"
                  v-model="formData.statusLawatan"
                  :classes="{ input: 'text-sm' }"
                />
              </div>
            </div>
          </template>
        </rs-card>

        <!-- Section 2: Dokumen Sokongan (Read-only) -->
        <rs-card class="shadow-sm border-0 bg-white">
          <template #header>
            <div class="flex items-center space-x-3">
              <div class="flex-shrink-0">
                <div
                  class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center"
                >
                  <Icon name="ph:folder-open" class="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div>
                <h2 class="text-lg font-semibold text-gray-900">
                  Dokumen Sokongan
                </h2>
                <p class="text-sm text-gray-500">
                  Dokumen yang dikemukakan oleh pemohon
                </p>
              </div>
            </div>
          </template>

          <template #body>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                v-for="(dokumen, index) in dokumenSokongan"
                :key="index"
                class="border border-gray-200 rounded-lg p-4"
              >
                <h4 class="font-medium text-gray-900 mb-2">
                  {{ dokumen.jenis }}
                </h4>
                <div class="flex items-center space-x-2">
                  <rs-button
                    size="xs"
                    variant="primary-outline"
                    @click="previewDocument(dokumen)"
                  >
                    <Icon name="ph:eye" class="w-4 h-4 mr-1" />
                    Preview
                  </rs-button>
                  <rs-button
                    size="xs"
                    variant="success-outline"
                    @click="downloadDocument(dokumen)"
                  >
                    <Icon name="ph:download" class="w-4 h-4 mr-1" />
                    Muat Turun
                  </rs-button>
                </div>
              </div>
            </div>
          </template>
        </rs-card>

        <!-- BQ, Laporan Gambar, Laporan Teknikal in Tabs -->
        <rs-tab variant="primary" type="card">
          <!-- Tab: BQ -->
          <rs-tab-item title="BQ" active>
            <rs-card class="shadow-sm border-0 bg-white">
              <template #header>
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <div class="flex-shrink-0">
                      <div
                        class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center"
                      >
                        <Icon
                          name="ph:file-text"
                          class="w-6 h-6 text-purple-600"
                        />
                      </div>
                    </div>
                    <div>
                      <h2 class="text-lg font-semibold text-gray-900">BQ</h2>
                      <p class="text-sm text-gray-500">
                        Bill of Quantity untuk kerja-kerja cadangan
                      </p>
                    </div>
                  </div>
                </div>
              </template>

              <template #body>
                <div class="overflow-x-auto">
                  <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                      <tr>
                        <th
                          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          No BQ
                        </th>
                        <th
                          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Nama BQ
                        </th>
                        <th
                          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Status
                        </th>
                        <th
                          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                      <tr v-for="(bq, index) in bqList" :key="index">
                        <td
                          class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                        >
                          {{ bq.noBQ }}
                        </td>
                        <td
                          class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                        >
                          {{ bq.namaBQ }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <rs-badge
                            :variant="getBQStatusVariant(bq.status)"
                            class="text-sm"
                          >
                            {{ bq.status }}
                          </rs-badge>
                        </td>
                        <td
                          class="px-6 py-4 whitespace-nowrap text-sm font-medium"
                        >
                          <rs-button
                            variant="primary"
                            @click="editBQ(bq)"
                          >
                            Edit
                          </rs-button>
                        </td>
                      </tr>
                      <tr v-if="bqList.length === 0">
                        <td
                          colspan="4"
                          class="px-6 py-4 text-center text-sm text-gray-500"
                        >
                          Tiada BQ dijumpai. Klik butang "Tambah Baru" untuk
                          menambah BQ.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </template>
            </rs-card>
          </rs-tab-item>

          <!-- Tab: Laporan Gambar -->
          <rs-tab-item title="Laporan Gambar">
            <rs-card class="shadow-sm border-0 bg-white">
              <template #header>
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <div class="flex-shrink-0">
                      <div
                        class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center"
                      >
                        <Icon name="ph:image" class="w-6 h-6 text-orange-600" />
                      </div>
                    </div>
                    <div>
                      <h2 class="text-lg font-semibold text-gray-900">
                        Laporan Gambar
                      </h2>
                      <p class="text-sm text-gray-500">
                        Gambar lokasi dan dokumentasi kerja
                      </p>
                    </div>
                  </div>
                  <rs-button variant="primary" @click="openLaporanGambar">
                    <Icon name="ph:camera" class="w-4 h-4 mr-2" />
                    Laporan Gambar
                  </rs-button>
                </div>
              </template>

              <template #body>
                <div
                  v-if="gambarLokasi.length > 0"
                  class="grid grid-cols-2 md:grid-cols-4 gap-4"
                >
                  <div
                    v-for="(gambar, index) in gambarLokasi"
                    :key="index"
                    class="relative aspect-square rounded-lg overflow-hidden border border-gray-200"
                  >
                    <img
                      :src="gambar.url"
                      :alt="gambar.catatan"
                      class="w-full h-full object-cover"
                    />
                    <div
                      class="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-opacity"
                    >
                      <div
                        class="absolute bottom-0 left-0 right-0 p-2 bg-black bg-opacity-50 text-white text-sm"
                      >
                        {{ gambar.catatan }}
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else class="text-center py-8 text-gray-500">
                  <Icon
                    name="ph:image"
                    class="w-12 h-12 mx-auto mb-2 text-gray-400"
                  />
                  <p>
                    Tiada gambar dimuat naik. Klik butang "Laporan Gambar" untuk
                    menambah gambar.
                  </p>
                </div>
              </template>
            </rs-card>
          </rs-tab-item>

          <!-- Tab: Laporan Teknikal -->
          <rs-tab-item title="Laporan Teknikal">
            <rs-card class="shadow-sm border-0 bg-white">
              <template #header>
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <div class="flex-shrink-0">
                      <div
                        class="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center"
                      >
                        <Icon
                          name="ph:file-doc"
                          class="w-6 h-6 text-teal-600"
                        />
                      </div>
                    </div>
                    <div>
                      <h2 class="text-lg font-semibold text-gray-900">
                        Laporan Teknikal
                      </h2>
                      <p class="text-sm text-gray-500">
                        Analisis teknikal dan cadangan kerja
                      </p>
                    </div>
                  </div>
                  <rs-button variant="primary" @click="openLaporanTeknikal">
                    <Icon name="ph:file-doc" class="w-4 h-4 mr-2" />
                    Laporan Teknikal
                  </rs-button>
                </div>
              </template>

              <template #body>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-1">
                    <label class="text-sm font-medium text-gray-700"
                      >Latar Belakang</label
                    >
                    <div
                      class="mt-1 p-3 bg-gray-50 rounded-lg border min-h-[100px]"
                    >
                      <span class="text-sm text-gray-900">{{
                        laporanTeknikal.latarBelakang || "Belum diisi"
                      }}</span>
                    </div>
                  </div>

                  <div class="space-y-1">
                    <label class="text-sm font-medium text-gray-700"
                      >Keperluan</label
                    >
                    <div
                      class="mt-1 p-3 bg-gray-50 rounded-lg border min-h-[100px]"
                    >
                      <span class="text-sm text-gray-900">{{
                        laporanTeknikal.keperluan || "Belum diisi"
                      }}</span>
                    </div>
                  </div>

                  <div class="space-y-1">
                    <label class="text-sm font-medium text-gray-700"
                      >Cadangan</label
                    >
                    <div
                      class="mt-1 p-3 bg-gray-50 rounded-lg border min-h-[100px]"
                    >
                      <span class="text-sm text-gray-900">{{
                        laporanTeknikal.cadangan || "Belum diisi"
                      }}</span>
                    </div>
                  </div>

                  <div class="space-y-1">
                    <label class="text-sm font-medium text-gray-700"
                      >Nilai Kerja Dicadangkan</label
                    >
                    <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                      <span class="text-sm font-medium text-gray-900">
                        RM
                        {{
                          laporanTeknikal.nilaiKerja?.toLocaleString() || "0"
                        }}
                      </span>
                    </div>
                  </div>
                </div>
              </template>
            </rs-card>
          </rs-tab-item>
        </rs-tab>

        <!-- Section 6: Catatan Lapangan (C/U/V) -->
        <rs-card class="shadow-sm border-0 bg-white">
          <template #header>
            <div class="flex items-center space-x-3">
              <div class="flex-shrink-0">
                <div
                  class="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center"
                >
                  <Icon name="ph:notebook" class="w-6 h-6 text-indigo-600" />
                </div>
              </div>
              <div>
                <h2 class="text-lg font-semibold text-gray-900">
                  Catatan Lapangan
                </h2>
                <p class="text-sm text-gray-500">
                  Nota dan dapatan semasa lawatan lapangan
                </p>
              </div>
            </div>
          </template>

          <template #body>
            <div class="space-y-4">
              <FormKit
                type="textarea"
                label="Catatan Lapangan"
                v-model="catatanLapangan.catatan"
                rows="6"
                placeholder="Masukkan catatan, dapatan dan pemerhatian semasa lawatan lapangan..."
                :classes="{ input: 'text-sm' }"
              />

              <div class="text-xs text-gray-500">
                <Icon name="ph:clock" class="w-4 h-4 inline mr-1" />
                Masa/Tarikh: {{ catatanLapangan.masaTarikh }}
              </div>
            </div>
          </template>
        </rs-card>

        <!-- Section 7 & 8: Combined - Status & Jumlah Bantuan -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Section 7: Status Lawatan -->
          <rs-card class="shadow-sm border-0 bg-white">
            <template #header>
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div
                    class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center"
                  >
                    <Icon
                      name="ph:check-circle"
                      class="w-6 h-6 text-yellow-600"
                    />
                  </div>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-gray-900">
                    Status Lawatan
                  </h2>
                  <p class="text-sm text-gray-500">
                    Update status siasatan lapangan
                  </p>
                </div>
              </div>
            </template>

            <template #body>
              <FormKit
                type="select"
                label="Status Lawatan"
                :options="statusLawatanOptions"
                v-model="formData.statusLawatan"
                :classes="{ input: 'text-sm' }"
              />
            </template>
          </rs-card>

          <!-- Section 8: Jumlah Bantuan & Catatan Pengesyoran -->
          <rs-card class="shadow-sm border-0 bg-white">
            <template #header>
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div
                    class="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center"
                  >
                    <Icon
                      name="ph:currency-circle-dollar"
                      class="w-6 h-6 text-emerald-600"
                    />
                  </div>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-gray-900">
                    Jumlah Bantuan & Pengesyoran
                  </h2>
                  <p class="text-sm text-gray-500">
                    Nilai bantuan berdasarkan BQ dan pengesyoran
                  </p>
                </div>
              </div>
            </template>

            <template #body>
              <div class="space-y-4">
                <div class="space-y-1">
                  <label class="text-sm font-medium text-gray-700"
                    >Jumlah Bantuan</label
                  >
                  <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                    <span class="text-lg font-semibold text-gray-900">
                      RM {{ jumlahBantuan.toLocaleString() }}
                    </span>
                    <span class="text-sm text-gray-500 ml-2"
                      >(Diambil dari BQ)</span
                    >
                  </div>
                </div>

                <div class="space-y-1">
                  <label class="text-sm font-medium text-gray-700"
                    >Catatan Pengesyoran</label
                  >
                  <div
                    class="mt-1 p-3 bg-gray-50 rounded-lg border min-h-[80px]"
                  >
                    <span class="text-sm text-gray-900">{{
                      catatanPengesyoran || "Diambil dari BQ"
                    }}</span>
                  </div>
                </div>

                <!-- Post-approval buttons (only shown after approval) -->
                <div v-if="isApproved" class="space-y-2 pt-4 border-t">
                  <rs-button
                    variant="success-outline"
                    @click="viewArahanKerja"
                    class="w-full !py-2 text-sm"
                  >
                    <Icon name="ph:file-text" class="w-4 h-4 mr-2" />
                    Lihat Arahan Kerja
                  </rs-button>

                  <rs-button
                    variant="info-outline"
                    @click="urusPemantauan"
                    class="w-full !py-2 text-sm"
                  >
                    <Icon name="ph:monitor" class="w-4 h-4 mr-2" />
                    Urus Pemantauan
                  </rs-button>
                </div>
              </div>
            </template>
          </rs-card>
        </div>

        <!-- Section 9: Action Buttons -->
        <rs-card class="shadow-sm border-0 bg-white">
          <template #body>
            <div class="flex flex-col sm:flex-row gap-3 justify-end">
              <rs-button
                variant="primary-outline"
                @click="handleSimpanDraf"
                :disabled="processing"
                class="!py-3 text-sm font-medium"
              >
                <Icon name="ph:floppy-disk" class="w-5 h-5 mr-2" />
                Simpan Draf
              </rs-button>

              <rs-button
                variant="secondary"
                @click="handleSimpanDrafDanSahkan"
                :disabled="processing"
                :loading="processing && actionType === 'draft_confirm'"
                class="!py-3 text-sm font-medium"
              >
                <Icon name="ph:check-circle" class="w-5 h-5 mr-2" />
                Simpan Draf & Sahkan Selesai Lawatan
              </rs-button>

              <rs-button
                variant="primary"
                @click="handleSelesaiDanHantar"
                :disabled="processing"
                :loading="processing && actionType === 'complete_submit'"
                class="!py-3 text-sm font-medium"
              >
                <Icon name="ph:paper-plane-tilt" class="w-5 h-5 mr-2" />
                Selesai dan Hantar ke Kelulusan
              </rs-button>

              <rs-button
                variant="danger-outline"
                @click="handleBatal"
                class="!py-3 text-sm font-medium"
              >
                <Icon name="ph:x" class="w-5 h-5 mr-2" />
                Batal
              </rs-button>
            </div>
          </template>
        </rs-card>
      </div>
    </div>

    <!-- BQ Modal -->
    <rs-modal v-model="showBQModal" size="xl" :closable="false">
      <template #header>
        <h3 class="text-lg font-semibold">
          {{ editingBQ ? "Edit" : "Tambah" }} BQ
        </h3>
      </template>
      <template #body>
        <!-- BQ form content will be added here -->
        <div class="text-center py-8 text-gray-500">
          <p>
            BQ Form content akan dibangunkan mengikut keperluan dalam
            REQUIREMENTS.md
          </p>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-3">
          <rs-button variant="primary-outline" @click="closeBQModal">
            Batal
          </rs-button>
          <rs-button variant="primary" @click="saveBQ"> Simpan </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";

const route = useRoute();
const router = useRouter();
const toast = useToast();
const processing = ref(false);
const actionType = ref("");

definePageMeta({
  title: "Siasatan Lapangan",
});

const breadcrumb = ref([
  {
    name: "Tugasan",
    type: "link",
    path: "/BF-BTN/tugasan",
  },
  {
    name: "Siasatan ke Lapangan",
    type: "link",
    path: "/BF-BTN/tugasan",
  },
  {
    name: "Kemaskini Siasatan",
    type: "current",
    path: `/BF-BTN/tugasan/bantuan/siasatan/${route.params.id}`,
  },
]);

// Section 1: Maklumat Permohonan data
const formData = ref({
  idPermohonan: "",
  namaPemohon: "",
  noIc: "",
  alamat: "",
  jenisBantuan: "",
  segera: false,
  tarikhPermohonan: "",
  statusPermohonan: "",
  tarikhDijadualkanLawatan: "",
  statusLawatan: "belum_selesai",
});

// Section 2: Dokumen Sokongan
const dokumenSokongan = ref([
  {
    jenis: "Quotation (baik pulih)",
    filename: "quotation.pdf",
    url: "#",
  },
  {
    jenis: "Geran Tanah (bina rumah)",
    filename: "geran_tanah.pdf",
    url: "#",
  },
  {
    jenis: "Carian Rasmi Pejabat Tanah",
    filename: "carian_rasmi.pdf",
    url: "#",
  },
]);

// Section 3: Draf BQ
const bqList = ref([
  {
    noBQ: "BQ01",
    namaBQ: "BQ MOHD ROSLI BIN SAAD",
    status: "Dalam Kelulusan",
  },
  {
    noBQ: "BQ02",
    namaBQ: "BQ MOHD ROSLI BIN SAAD 2",
    status: "Dalam Proses",
  },
]);

const showBQModal = ref(false);
const editingBQ = ref(null);

// Section 4: Laporan Gambar
const gambarLokasi = ref([
  {
    url: "/img/placeholder-image.jpg",
    catatan: "Keadaan semasa rumah",
    masaUpload: new Date().toISOString(),
  },
  {
    url: "/img/placeholder-image.jpg",
    catatan: "Bahagian yang perlu dibaiki",
    masaUpload: new Date().toISOString(),
  },
]);

// Section 5: Laporan Teknikal
const laporanTeknikal = ref({
  latarBelakang: "",
  keperluan: "",
  cadangan: "",
  nilaiKerja: 0,
});

// Section 6: Catatan Lapangan
const catatanLapangan = ref({
  catatan: "",
  masaTarikh: new Date().toLocaleString("ms-MY"),
});

// Section 8: Jumlah Bantuan & Catatan Pengesyoran
const jumlahBantuan = ref(25000);
const catatanPengesyoran = ref("");
const isApproved = ref(false); // This will be true after approval

// Dropdown options
const statusLawatanOptions = ref([
  { label: "Belum Selesai", value: "belum_selesai" },
  { label: "Selesai Lawatan Lapangan", value: "selesai_lawatan" },
]);

// Methods
const getStatusVariant = (status) => {
  const variants = {
    baru: "info",
    dalam_semakan: "warning",
    tidak_lengkap: "danger",
    lengkap: "success",
    menunggu_siasatan: "warning",
    lawatan_dijadualkan: "info",
    selesai_lawatan: "success",
  };
  return variants[status?.toLowerCase()] || "default";
};

const getStatusText = (status) => {
  const statusMap = {
    baru: "Baru",
    dalam_semakan: "Dalam Semakan",
    tidak_lengkap: "Tidak Lengkap",
    lengkap: "Lengkap",
    menunggu_siasatan: "Menunggu Siasatan Lapangan",
    lawatan_dijadualkan: "Lawatan Dijadualkan",
    selesai_lawatan: "Selesai Lawatan Lapangan",
  };
  return statusMap[status?.toLowerCase()] || status;
};

const getBQStatusVariant = (status) => {
  const variants = {
    "Dalam Kelulusan": "warning",
    "Dalam Proses": "info",
    Selesai: "success",
    Ditolak: "danger",
  };
  return variants[status] || "default";
};

const previewDocument = (dokumen) => {
  console.log("Previewing document:", dokumen);
  // Implement document preview functionality
};

const downloadDocument = (dokumen) => {
  console.log("Downloading document:", dokumen);
  // Implement document download functionality
};

// BQ Functions
const openBQForm = () => {
  editingBQ.value = null;
  showBQModal.value = true;
};

const editBQ = (bq) => {
  // Navigate to dedicated BQ drafting/editing page with current id and edit flag
  router.push(
    `/BF-BTN/permohonan/senarai-siasatan-lapangan/${route.params.id}/draf-bq?edit=true`
  );
};

const closeBQModal = () => {
  showBQModal.value = false;
  editingBQ.value = null;
};

const saveBQ = () => {
  // Implement BQ save functionality
  toast.success("BQ telah disimpan");
  closeBQModal();
};

// Navigation Functions
const openLaporanGambar = () => {
  router.push(
    `/BF-BTN/permohonan/senarai-siasatan-lapangan/${route.params.id}/laporan-gambar`
  );
};

const openLaporanTeknikal = () => {
  router.push(
    `/BF-BTN/permohonan/senarai-siasatan-lapangan/${route.params.id}/laporan-teknikal`
  );
};

const viewArahanKerja = () => {
  router.push(
    `/BF-BTN/permohonan/senarai-siasatan-lapangan/${route.params.id}/arahan-kerja`
  );
};

const urusPemantauan = () => {
  router.push(
    `/BF-BTN/permohonan/senarai-siasatan-lapangan/${route.params.id}/pemantauan`
  );
};

// Action Button Functions
const handleSimpanDraf = async () => {
  try {
    processing.value = true;

    // Implement save draft functionality
    console.log("Saving draft...");

    toast.success("Draf telah disimpan");
  } catch (error) {
    toast.error("Ralat semasa menyimpan draf");
    console.error(error);
  } finally {
    processing.value = false;
  }
};

const handleSimpanDrafDanSahkan = async () => {
  try {
    processing.value = true;
    actionType.value = "draft_confirm";

    // Implement save draft and confirm completion functionality
    console.log("Saving draft and confirming completion...");

    // Update status lawatan
    formData.value.statusLawatan = "selesai_lawatan";

    toast.success("Draf telah disimpan dan status lawatan telah dikemaskini");
  } catch (error) {
    toast.error("Ralat semasa menyimpan dan mengesahkan");
    console.error(error);
  } finally {
    processing.value = false;
    actionType.value = "";
  }
};

const handleSelesaiDanHantar = async () => {
  try {
    processing.value = true;
    actionType.value = "complete_submit";

    // Validate required fields before submission
    if (
      !formData.value.statusLawatan ||
      formData.value.statusLawatan === "belum_selesai"
    ) {
      toast.error(
        "Sila kemaskini status lawatan kepada 'Selesai Lawatan Lapangan'"
      );
      return;
    }

    // Implement complete and submit functionality
    console.log("Completing and submitting to approval...");

    toast.success("Siasatan telah selesai dan dihantar untuk kelulusan");

    // Navigate back to list
    router.push("/BF-BTN/permohonan/senarai-siasatan-lapangan");
  } catch (error) {
    toast.error("Ralat semasa menyelesaikan dan menghantar");
    console.error(error);
  } finally {
    processing.value = false;
    actionType.value = "";
  }
};

const handleBatal = () => {
  router.push("/BF-BTN/permohonan/senarai-siasatan-lapangan");
};

// Fetch application data on mount
onMounted(async () => {
  try {
    // Implement API call to fetch application data
    // This is mock data for now
    formData.value = {
      idPermohonan: route.params.id,
      namaPemohon: "MOHD ROSLI BIN SAAD",
      noIc: "880101-12-1234",
      alamat: "No. 123, Jalan Merdeka, Taman Sejahtera, 50000 Kuala Lumpur",
      jenisBantuan: "Bantuan Baik Pulih Rumah",
      segera: false,
      tarikhPermohonan: "15 Nov 2024",
      statusPermohonan: "lawatan_dijadualkan",
      tarikhDijadualkanLawatan: "20 Nov 2024",
      statusLawatan: "belum_selesai",
    };

    // Auto-populate laporan teknikal latar belakang from profiling
    laporanTeknikal.value.latarBelakang =
      "Berdasarkan profiling, pemohon tinggal di rumah yang memerlukan kerja-kerja baik pulih bumbung dan dinding yang rosak akibat cuaca.";

    // Auto-calculate jumlah bantuan from BQ (mock calculation)
    jumlahBantuan.value = 25000;
    catatanPengesyoran.value =
      "Cadangan kerja baik pulih bumbung bocor dan cat dinding luar untuk memastikan keselamatan dan keselesaan pemohon.";
  } catch (error) {
    toast.error("Ralat semasa memuatkan data permohonan");
    console.error(error);
  }
});
</script>

<style lang="scss" scoped>
// Custom animations and transitions
.group:hover .group-hover\:text-blue-600 {
  transition: color 0.2s ease-in-out;
}

// Enhanced focus states
.focus\:ring-2:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}

// Table row hover effect
.hover\:bg-gray-50:hover {
  background-color: #f9fafb;
}

// Document card styling
.border-gray-200 {
  border-color: #e5e7eb;
}

.bg-gray-50 {
  background-color: #f9fafb;
}
</style>
