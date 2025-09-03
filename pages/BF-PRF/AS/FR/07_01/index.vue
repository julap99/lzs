<template>
  <div>
    <!-- ===== POPUP MESSAGE ===== -->
    <div v-if="showPopupMessage" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="fixed inset-0 bg-black bg-opacity-50"></div>
      <div class="relative bg-white rounded-lg shadow-xl p-6 max-w-md mx-4 transform transition-all duration-300 ease-out">
        <div class="flex items-center justify-center mb-4">
          <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <Icon name="ph:check-circle" class="w-6 h-6 text-green-600" />
          </div>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 text-center mb-2">Berjaya!</h3>
        <p class="text-gray-600 text-center">{{ popupMessage }}</p>
      </div>
    </div>

    <!-- ===== BREADCRUMB ===== -->
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- ===== MAKLUMAT PEMOHON ===== -->
    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Maklumat Pemohon</h2>
          <rs-badge v-if="formData.status" :variant="getStatusVariant(formData.status)">
            {{ formData.status }}
          </rs-badge>
        </div>
      </template>

      <template #body>
        <FormKit type="form" :actions="false" @submit="handleSubmit" v-model="formData">
          <rs-fieldset class="mb-6">
            <template #legend>
              <h3 class="text-lg font-medium">Information</h3>
            </template>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nama</label>
                <p class="text-gray-900">{{ formData.nama }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
                <p class="text-gray-900">{{ formData.alamat }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Jenis Pengenalan</label>
                <p class="text-gray-900">{{ formData.jenisPengenalan }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">No Pengenalan</label>
                <p class="text-gray-900">{{ formData.noPengenalan }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">No Telefon</label>
                <p class="text-gray-900">{{ formData.noTelefon }}</p>
              </div>
                             <div>
                 <label class="block text-sm font-medium text-gray-700 mb-1">E-mel</label>
                 <p class="text-gray-900">{{ formData.email }}</p>
               </div>
            </div>
          </rs-fieldset>
        </FormKit>
      </template>
    </rs-card>

    <!-- ===== TABS (STATUS & BANTUAN) ===== -->
    <div class="flex flex-col lg:flex-row gap-4 mt-4">
      <rs-card class="flex-1">
        <template #body>
                     <rs-tab variant="primary" type="card" v-model="forcedActiveTab">
                                       <!-- === TAB: PENGESAHAN STATUS === -->
              <rs-tab-item title="Pengesahan Status" name="pengesahan-status">
               <div class="space-y-6">
                 <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
                   <FormKit
                     type="form"
                     :actions="false"
                     @submit="handleProfilingSubmit"
                     v-model="profilingData"
                     class="divide-y divide-gray-200"
                   >
                     <!-- S1: (Hidden search area kept as placeholder) -->
                     <section class="p-6 bg-gray-50">
                       <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                         <!-- reserved -->
                       </div>
                     </section>

                                          <!-- S2: MAKLUMAT SYOR (only show when tugasan siasatan has value) -->
                      <section v-if="profilingData.assignSiasatan" class="p-6">
                        <h4 class="text-md font-semibold text-gray-900 mb-4 flex items-center">
                          <Icon name="ph:clipboard-text" class="w-5 h-5 mr-2 text-green-600" />
                          Maklumat Syor
                        </h4>

                       <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                         <div>
                           <label class="block text-xs uppercase tracking-wide text-gray-500"> %Had Kifayah (Syor) </label>
                           <p class="text-gray-900 font-medium">{{ profilingData.hadKifayahSyor }}</p>
                         </div>
                         <div>
                           <label class="block text-xs uppercase tracking-wide text-gray-500"> Kategori Keluarga Asnaf (Syor) </label>
                           <p class="text-gray-900 font-medium">{{ profilingData.kategoriKeluargaAsnafSyor }}</p>
                         </div>
                         <div>
                           <label class="block text-xs uppercase tracking-wide text-gray-500"> Kategori Asnaf (Syor) </label>
                           <p class="text-gray-900 font-medium">{{ profilingData.kategoriAsnafSyor }}</p>
                         </div>
                         <div>
                           <label class="block text-xs uppercase tracking-wide text-gray-500"> Tarikh Pengesyoran </label>
                           <p class="text-gray-900 font-medium">{{ profilingData.tarikhPengesyoran }}</p>
                         </div>
                         <div class="lg:col-span-2">
                           <label class="block text-xs uppercase tracking-wide text-gray-500"> Pengenalan ID Tanggungan </label>
                           <p class="text-gray-900 font-medium">
                             {{ profilingData.pengenalanIdTanggungan1 }}{{ profilingData.pengenalanIdTanggungan2 ? ', ' + profilingData.pengenalanIdTanggungan2 : '' }}
                           </p>
                         </div>
                         <div class="lg:col-span-2">
                           <label class="block text-xs uppercase tracking-wide text-gray-500"> Kategori Tanggungan (Syor) </label>
                           <p class="text-gray-900 font-medium">{{ profilingData.kategoriTanggunganSyor }}</p>
                         </div>
                       </div>
                     </section>

                                          <!-- S3: TUGASAN SIASATAN -->
                      <section class="p-6 bg-amber-50">
                        <h4 class="text-md font-semibold text-gray-900 mb-4 flex items-center">
                          <Icon name="ph:user-gear" class="w-5 h-5 mr-2 text-amber-600" />
                          Tugasan Siasatan
                        </h4>
                        
                        <!-- Status indicator -->
                        <div v-if="!profilingData.assignSiasatan" class="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p class="text-sm text-yellow-800 flex items-center">
                            <Icon name="ph:info" class="w-4 h-4 mr-2" />
                            Pilih petugas siasatan untuk melihat bahagian Pengesahan Status
                          </p>
                        </div>
                        
                        <!-- Success indicator when value is selected -->
                        <div v-else class="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <p class="text-sm text-green-800 flex items-center">
                            <Icon name="ph:check-circle" class="w-4 h-4 mr-2" />
                            Petugas siasatan telah dipilih: <strong>{{ getAssignSiasatanLabel(profilingData.assignSiasatan) }}</strong>
                          </p>
                        </div>

                       <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                   <FormKit
                            type="select"
                            name="assignSiasatan"
                            label="Assign Siasatan"
                            :options="assignSiasatanOptions"
                            placeholder="Pilih petugas siasatan"
                            :classes="{ input: '!py-2.5', label: 'text-sm font-medium text-gray-700' }"
                            v-model="profilingData.assignSiasatan"
                            @change="saveToLocalStorage"
                          />
                                                   <div class="md:col-span-2 flex items-end justify-end gap-3">
                            <rs-button variant="secondary" @click="resetForm" class="px-6 py-2.5">
                              <Icon name="ph:arrow-clockwise" class="w-4 h-4 mr-2" />
                              Reset
                            </rs-button>
                            <rs-button variant="primary" @click="handleTugasanHantar" class="px-6 py-2.5">
                              <Icon name="ph:paper-plane-right" class="w-4 h-4 mr-2" />
                              Hantar
                            </rs-button>
                          </div>
                       </div>
                     </section>

                     <!-- (COMMENTED) PROFILING ACTION BUTTONS -->
                     <!--
                     <section class="p-6 bg-white border-t border-gray-200">
                       <div class="flex flex-col sm:flex-row gap-3 justify-end">
                         <rs-button variant="secondary" @click="resetProfilingForm" class="flex items-center justify-center px-6 py-2.5">
                           <Icon name="ph:arrow-clockwise" class="w-4 h-4 mr-2" /> Reset
                         </rs-button>
                         <rs-button variant="primary-outline" @click="saveProfilingDraft" :loading="savingDraft" class="flex items-center justify-center px-6 py-2.5">
                           <Icon name="ph:floppy-disk" class="w-4 h-4 mr-2" /> Simpan Draf
                         </rs-button>
                         <rs-button variant="primary" @click="submitProfiling" :loading="submittingProfile" :disabled="!isProfilingFormValid" class="flex items-center justify-center px-6 py-2.5">
                           <Icon name="ph:check-circle" class="w-4 h-4 mr-2" /> Sahkan & Simpan
                         </rs-button>
                       </div>
                     </section>
                     -->
                   </FormKit>
                 </div>
               </div>
             </rs-tab-item>

            <!-- === TAB: BANTUAN === -->
            <rs-tab-item title="Bantuan" name="bantuan">
              <div class="p-6">
                <!-- Letak kandungan Bantuan sebenar anda di sini.
                     Buat sementara, kita papar placeholder kemas. -->
                <div class="rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-600">
                  Maklumat Bantuan akan dipaparkan di sini (jadual/rekod bantuan cadangan, agensi lain, dsb.).
                </div>
              </div>
            </rs-tab-item>
          </rs-tab>
        </template>
      </rs-card>

      <!-- ===== MAKLUMAT LAWATAN & SIASATAN ===== -->
      <rs-card v-if="hasSubmittedData" id="lawatan-siasatan-section" class="flex-1">
        <template #header>
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-3">
              <h2 class="text-xl font-semibold">Maklumat Lawatan & Siasatan</h2>
              <rs-badge v-if="comingFromInvestigation" variant="success" class="text-xs">
                <Icon name="ph:check-circle" class="w-3 h-3 mr-1" />
                Data Diterima
              </rs-badge>
            </div>
          </div>
        </template>

        <template #body>
          <!-- LAWATAN FORM -->
          <FormKit type="form" :actions="false" @submit="handleSubmitLawatan" v-model="investigationData">
            <div class="space-y-6">
              <!-- Ringkasan Profil -->
              <section class="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 class="text-sm font-semibold text-blue-900 mb-3">Ringkasan Profil</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <label class="block text-sm font-medium text-blue-800">Jenis Pekerjaan:</label>
                    <p class="mt-1 text-gray-900">{{ investigationData.jenisPekerjaan || 'Belum diisi' }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-blue-800">Status Kediaman:</label>
                    <p class="mt-1 text-gray-900">{{ investigationData.statusKediaman || 'Belum diisi' }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-blue-800">Jumlah Bayaran Rumah:</label>
                    <p class="mt-1 text-gray-900">{{ investigationData.jumlahBayaranRumah || 'Belum diisi' }}</p>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-blue-800">Bilangan Tanggungan:</label>
                    <p class="mt-1 text-gray-900">{{ investigationData.bilTanggungan || 'Belum diisi' }}</p>
                  </div>
                  <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-blue-800">Status Tanggungan:</label>
                    <p class="mt-1 text-gray-900">{{ investigationData.statusTanggungan || 'Belum diisi' }}</p>
                  </div>
                </div>
              </section>

              <!-- Inputs -->
              <section>
                <h4 class="text-sm font-semibold text-gray-900 mb-3">Keadaan Siasatan</h4>
                <FormKit
                  type="select"
                  name="keadaanSiasatan"
                  placeholder="Pilih keadaan siasatan"
                  :options="keadaanSiasatanOptions"
                  :classes="{ input: '!py-2.5' }"
                  v-model="investigationData.keadaanSiasatan"
                />
              </section>

              <section class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 class="text-sm font-semibold text-gray-900 mb-3">Tarikh Lawatan</h4>
                  <FormKit type="date" name="tarikhLawatan" :classes="{ input: '!py-2.5' }" v-model="investigationData.tarikhLawatan" />
                </div>
                <div>
                  <h4 class="text-sm font-semibold text-gray-900 mb-3">Masa Lawatan</h4>
                  <FormKit type="time" name="masaLawatan" :classes="{ input: '!py-2.5' }" v-model="investigationData.masaLawatan" />
                </div>
              </section>

              <section>
                <h4 class="text-sm font-semibold text-gray-900 mb-3">Ringkasan Pemerhatian</h4>
                <FormKit
                  type="textarea"
                  name="RingkasanPemerhatian"
                  placeholder="Ringkasan Pemerhatian..."
                  rows="4"
                  :classes="{ input: '!py-2.5' }"
                  v-model="investigationData.RingkasanPemerhatian"
                />

              </section>

              <section>
                <h4 class="text-sm font-semibold text-gray-900 mb-3">Catatan Lawatan</h4>
                <FormKit
                  type="textarea"
                  name="catatanLawatanETD"
                  placeholder="Catatan lawatan..."
                  rows="3"
                  :classes="{ input: '!py-2.5' }"
                  v-model="investigationData.catatanLawatanETD"
                />

              </section>

              <section>
                <h4 class="text-sm font-semibold text-gray-900 mb-3">Status Lawatan</h4>
                <FormKit
                  type="select"
                  name="statusLawatan"
                  placeholder="Pilih status lawatan"
                  :options="statusLawatanOptions"
                  :classes="{ input: '!py-2.5' }"
                  v-model="investigationData.statusLawatan"
                />
              </section>
            </div>
          </FormKit>

          <!-- SEMAKAN + FINALISASI (auto-appear when valid) -->
          <section v-if="isLawatanFormValid" class="mt-6 bg-white border border-gray-200 rounded-lg">
            <!-- Maklumat Semakan -->
            <div class="p-6">
              <h4 class="text-md font-semibold text-gray-900 mb-4 flex items-center">
                <Icon name="ph:clipboard-text" class="w-5 h-5 mr-2 text-blue-600" />
                Maklumat Semakan
              </h4>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Keadaan Siasatan</label>
                  <p class="text-gray-900">{{ investigationData.keadaanSiasatan || '-' }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Tarikh / Masa Lawatan</label>
                  <p class="text-gray-900">
                    {{ investigationData.tarikhLawatan || '-' }}<span v-if="investigationData.masaLawatan"> • {{ investigationData.masaLawatan }}</span>
                  </p>
                </div>
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Ringkasan Pemerhatian</label>
                  <p class="text-gray-900 whitespace-pre-line">{{ investigationData.RingkasanPemerhatian || '-' }}</p>

                </div>
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Catatan Lawatan</label>
                  <p class="text-gray-900 whitespace-pre-line">{{ investigationData.catatanLawatanETD || '-' }}</p>
                </div>
              </div>
            </div>

            <!-- Komen & Finalisasi -->
            <div class="px-6 pb-6">
              <h4 class="text-md font-semibold text-gray-900 mb-4 flex items-center">
                <Icon name="ph:note" class="w-5 h-5 mr-2 text-purple-600" />
                Komen & Finalisasi
              </h4>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormKit
                  type="textarea"
                  name="komenPengesahanLawatan"
                  label="Komen Pengesahan"
                  rows="4"
                  placeholder="Masukkan komen pengesahan..."
                  :classes="{ input: '!py-3', label: 'text-sm font-medium text-gray-700' }"
                  v-model="investigationData.komenPengesahanLawatan"
                />
                <div class="max-w-md">
                  <FormKit
                    type="date"
                    name="tarikhPengesyoranAkhir"
                    label="Tarikh Pengesyoran Akhir"
                    :classes="{ input: '!py-2.5', label: 'text-sm font-medium text-gray-700' }"
                    v-model="investigationData.tarikhPengesyoranAkhir"
                  />
                </div>
              </div>
            </div>

            <!-- Final Action Buttons -->
            <div class="px-6 pb-6">
              <div class="flex flex-col sm:flex-row gap-3 justify-end">
                <rs-button variant="primary-outline" @click="saveLawatanDraft" class="flex items-center justify-center px-6 py-2.5">
                  <Icon name="ph:floppy-disk" class="w-4 h-4 mr-2" /> Simpan Draf
                </rs-button>
                <rs-button
                  variant="primary"
                  @click="submitLawatanFinal"
                  class="flex items-center justify-center px-6 py-2.5"
                  :disabled="!canFinalizeLawatan"
                >
                  <Icon name="ph:check-circle" class="w-4 h-4 mr-2" /> Sahkan & Simpan
                </rs-button>
              </div>
            </div>
          </section>
        </template>
      </rs-card>

      <!-- Empty state (before assignment) -->
      <rs-card v-else class="flex-1">
        <template #header>
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold">Maklumat Lawatan & Siasatan</h2>
          </div>
        </template>
        <template #body>
          <div class="text-center py-12">
            <Icon name="ph:info" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 class="text-lg font-medium text-gray-900 mb-2">Tiada Data Siasatan</h3>
            <p class="text-gray-500">
              Data siasatan akan dipaparkan di sini selepas ia dihantar dari halaman Siasatan di Lapangan.
            </p>
          </div>
        </template>
      </rs-card>
    </div>

    <!-- ===== IMAGE PREVIEW MODAL ===== -->
    <rs-modal v-model="showPreviewModal" size="xl" :closable="true">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900">Preview Gambar</h3>
          <div v-if="previewingImage" class="flex items-center gap-3">
            <span class="text-sm text-gray-500">{{ formatFileSize(previewingImage.size) }}</span>
            <rs-button variant="primary-outline" size="sm" @click="downloadImage(previewingImage)">
              <Icon name="ph:download" class="w-4 h-4 mr-1" />
              Muat Turun
            </rs-button>
          </div>
        </div>
      </template>

      <template #body>
        <div v-if="previewingImage" class="space-y-4">
          <div class="relative bg-gray-100 rounded-lg overflow-hidden">
            <img
              :src="previewingImage.url"
              :alt="previewingImage.filename"
              class="w-full h-auto max-h-96 object-contain mx-auto"
              style="max-height: 70vh"
            />
          </div>

          <div class="bg-gray-50 rounded-lg p-4 space-y-3">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nama Fail</label>
                <p class="text-sm text-gray-900 bg-white p-2 rounded border">
                  {{ previewingImage.filename }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Saiz Fail</label>
                <p class="text-sm text-gray-900 bg-white p-2 rounded border">
                  {{ formatFileSize(previewingImage.size) }}
                </p>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Keterangan</label>
              <FormKit
                type="textarea"
                v-model="previewingImage.caption"
                placeholder="Tambah keterangan untuk gambar ini..."
                rows="3"
                :classes="{ outer: 'mb-0', input: 'text-sm !py-2' }"
              />
            </div>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex justify-end gap-3">
          <rs-button variant="secondary" @click="showPreviewModal = false">Tutup</rs-button>
          <rs-button variant="primary" @click="saveImageCaption">Simpan Keterangan</rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from "vue";
import { useInvestigationStore } from "~/stores/investigation";

/* PAGE META */
definePageMeta({ title: "Maklumat Pemohon - Siasatan EOAD" });

/* TYPES */
type PreviewFile = { url: string; filename: string; size: number; caption?: string };

/* BREADCRUMB */
const breadcrumb = ref([
  { name: "Tugasan", type: "link", path: "/BF-BTN/tugasan" },
  { name: "Siasatan", type: "link", path: "/BF-BTN/tugasan" },
  { name: "Maklumat Pemohon", type: "current", path: "/BF-BTN/tugasan/siasatan-eoad" },
]);

/* STORE */
const investigationStore = useInvestigationStore();

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
  gambarLokasi: null as File | null,
});

/* INVESTIGATION DATA */
const investigationData = ref({
  jenisPekerjaan: "Bekerja sebagai tukang sapu di sekolah",
  statusKediaman: "Rumah Sewa",
  jumlahBayaranRumah: "RM500",
  bilTanggungan: "2 Orang (Anak)",
  statusTanggungan: "Tanggungan Utama",
  keadaanSiasatan: "",
  tarikhLawatan: "",
  masaLawatan: "",
  catatanPenilianAwal: "",
  catatanLawatanETD: "",
  statusLawatan: "",
  RingkasanPemerhatian: "",
  komenPengesahanLawatan: "",
  tarikhPengesyoranAkhir: "",
});

/* PROFILING DATA */
const profilingData = ref({
  pengenalanId: "770319035991",
  nama: "Adnan bin Abu",
  hadKifayahSyor: "50.81",
  kategoriKeluargaAsnafSyor: "Miskin",
  kategoriAsnafSyor: "Miskin",
  tarikhPengesyoran: new Date().toLocaleDateString("ms-MY", { day: "2-digit", month: "2-digit", year: "numeric" }),
  pengenalanIdTanggungan1: "050101101234",
  pengenalanIdTanggungan2: "070202105678",
  kategoriTanggunganSyor: "Tanggungan Utama",
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

/* UI STATE */
const hasSubmittedData = ref(false); // shown after assignment
const showPreviewModal = ref(false);
const previewingImage = ref<PreviewFile | null>(null);
const searchingId = ref(false);
const savingDraft = ref(false);
const submittingProfile = ref(false);
const showPopupMessage = ref(false);
const popupMessage = ref("");
const comingFromInvestigation = ref(false); // Track if coming from investigation page
const activeTab = ref("pengesahan-status"); // Track active tab
const originalInvestigationData = ref(null); // Store original data from investigation

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
  { label: "Berjaya", value: "berjaya" },
  { label: "Gagal", value: "gagal" },
]);

/* COMPUTEDS */
const isProfilingFormValid = computed(() => {
  return (
    profilingData.value.hadKifayahSah &&
    profilingData.value.kategoriKeluargaAsnafSah &&
    profilingData.value.kategoriAsnafSah
  );
});
const isLawatanFormValid = computed(() => {
  const d = investigationData.value;
  return !!(d.keadaanSiasatan && d.tarikhLawatan && d.masaLawatan && d.RingkasanPemerhatian && d.statusLawatan);
});
const canFinalizeLawatan = computed(() => {
  return isLawatanFormValid.value && !!investigationData.value.komenPengesahanLawatan && !!investigationData.value.tarikhPengesyoranAkhir;
});
const showPengesahanStatus = computed(() => {
  return !!profilingData.value.assignSiasatan;
});

// Force active tab to be pengesahan-status when assignSiasatan has value
const forcedActiveTab = computed(() => {
  if (profilingData.value.assignSiasatan) {
    return "pengesahan-status";
  }
  return activeTab.value;
});

/* HELPERS */
function getStatusVariant(status: string) {
  if (status === "Dalam Siasatan") return "primary";
  if (status === "Diluluskan") return "success";
  if (status === "Ditolak") return "danger";
  return "default";
}
function formatFileSize(bytes?: number) {
  if (!bytes) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}
function getAssignSiasatanLabel(value: string) {
  const option = assignSiasatanOptions.value.find(opt => opt.value === value);
  return option ? option.label : value;
}

/* LOCAL STORAGE HELPERS */
function saveToLocalStorage() {
  try {
    const dataToSave = {
      assignSiasatan: profilingData.value.assignSiasatan,
      hasSubmittedData: hasSubmittedData.value,
      investigationData: investigationData.value
    };
    localStorage.setItem('lzs-07-01-data', JSON.stringify(dataToSave));
  } catch (error) {
    console.warn('Failed to save to localStorage:', error);
  }
}

async function loadFromLocalStorage() {
  try {
    const savedData = localStorage.getItem('lzs-07-01-data');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      
      // Restore profiling data
      if (parsed.assignSiasatan) {
        profilingData.value.assignSiasatan = parsed.assignSiasatan;
        // Automatically activate Pengesahan Status tab when tugasan siasatan has value
        activeTab.value = "pengesahan-status";
        
        // Ensure the tab is properly activated after component rendering
        await nextTick();
        setTimeout(() => {
          activeTab.value = "pengesahan-status";
        }, 100);
      }
      
      // Restore investigation data
      if (parsed.investigationData) {
        investigationData.value = { ...investigationData.value, ...parsed.investigationData };
      }
      
      // Restore UI state
      if (parsed.hasSubmittedData) {
        hasSubmittedData.value = parsed.hasSubmittedData;
      }
    }
  } catch (error) {
    console.warn('Failed to load from localStorage:', error);
  }
}

function clearLocalStorage() {
  try {
    localStorage.removeItem('lzs-07-01-data');
  } catch (error) {
    console.warn('Failed to clear localStorage:', error);
  }
}

/* LIFECYCLE */
onMounted(async () => {
  // Load saved data from localStorage first
  await loadFromLocalStorage();
  
  // Force tab activation if assignSiasatan has value with multiple timing strategies
  if (profilingData.value.assignSiasatan) {
    // Strategy 1: Immediate activation
    activeTab.value = "pengesahan-status";
    
    // Strategy 2: After nextTick
    await nextTick();
    activeTab.value = "pengesahan-status";
    
    // Strategy 3: Multiple delayed activations
    setTimeout(() => {
      activeTab.value = "pengesahan-status";
    }, 100);
    
    setTimeout(() => {
      activeTab.value = "pengesahan-status";
    }, 300);
    
    setTimeout(() => {
      activeTab.value = "pengesahan-status";
    }, 500);
    
    // Strategy 4: After a longer delay to ensure component is fully rendered
    setTimeout(() => {
      activeTab.value = "pengesahan-status";
    }, 1000);
  }
  
  // Check if there's investigation data from the store
  if (investigationStore.latestSubmission) {
    comingFromInvestigation.value = true;
    
    // Store original data for reference
    originalInvestigationData.value = { ...investigationStore.latestSubmission };
    
    // Populate investigation data from store
    const storeData = investigationStore.latestSubmission;
    investigationData.value = {
      ...investigationData.value,
      ...storeData,
      // Map catatanPenilianAwal to RingkasanPemerhatian
      RingkasanPemerhatian: storeData.catatanPenilianAwal || investigationData.value.RingkasanPemerhatian,
      // Map catatanLawatanETD to itself (ensure it's properly populated)
      catatanLawatanETD: storeData.catatanLawatanETD || investigationData.value.catatanLawatanETD
    };
    
    // Show the lawatan section
    hasSubmittedData.value = true;
    
    // Set active tab to Pengesahan Status and ensure it's properly activated
    activeTab.value = "pengesahan-status";
    
    // Force a reactive update by using nextTick
    await nextTick();
    
    // Add a small delay to ensure the tab component is fully rendered
    setTimeout(() => {
      activeTab.value = "pengesahan-status";
    }, 100);
    
    // Show popup message
    showPopupMessage.value = true;
    popupMessage.value = "Data siasatan telah diterima dari pegawai siasatan";
    
    // Hide popup after 5 seconds
    setTimeout(() => {
      showPopupMessage.value = false;
    }, 5000);
    
    // Clear the store data after using it
    investigationStore.clearSubmission();
  }
});

/* WATCHERS */
// Auto-save data when assignSiasatan changes
watch(() => profilingData.value.assignSiasatan, (newValue) => {
  if (newValue) {
    // Automatically switch to Pengesahan Status tab when tugasan siasatan is selected
    activeTab.value = "pengesahan-status";
    
    // Small delay to ensure all reactive updates are complete
    setTimeout(() => {
      saveToLocalStorage();
    }, 100);
  }
});

// Ensure tab is properly activated when component is fully mounted
watch(() => profilingData.value.assignSiasatan, (newValue) => {
  if (newValue && activeTab.value !== "pengesahan-status") {
    // Force tab activation with multiple timing strategies
    activeTab.value = "pengesahan-status";
    
    setTimeout(() => {
      activeTab.value = "pengesahan-status";
    }, 100);
    
    setTimeout(() => {
      activeTab.value = "pengesahan-status";
    }, 300);
    
    setTimeout(() => {
      activeTab.value = "pengesahan-status";
    }, 500);
    
    setTimeout(() => {
      activeTab.value = "pengesahan-status";
    }, 1000);
  }
}, { immediate: true });

// Auto-save data when investigation data changes
watch(() => investigationData.value, () => {
  // Small delay to ensure all reactive updates are complete
  setTimeout(() => {
    saveToLocalStorage();
  }, 100);
}, { deep: true });

// Additional watcher to ensure tab activation after component is fully ready
watch(() => activeTab.value, (newTab) => {
  // If we're trying to set to pengesahan-status but it's not working, force it again
  if (profilingData.value.assignSiasatan && newTab !== "pengesahan-status") {
    setTimeout(() => {
      activeTab.value = "pengesahan-status";
    }, 100);
  }
});

/* HANDLERS */
function handleSubmit(data: any) {
  console.log("Form submitted:", data);
}
function handleProfilingSubmit(data: any) {
  console.log("Profiling form submitted:", data);
}
async function handleTugasanHantar() {
  if (!profilingData.value.assignSiasatan) {
    alert("Sila pilih petugas siasatan terlebih dahulu.");
    return;
  }
  
  // Store the selected value (don't override it)
  const selectedValue = profilingData.value.assignSiasatan;
  
  // Switch to Pengesahan Status tab
  activeTab.value = "pengesahan-status";
  
  // Show popup message first
  showPopupMessage.value = true;
  popupMessage.value = "Tugasan telah diberikan kepada pegawai siasatan";
  
  // Hide popup after 5 seconds and then execute current functionality
  setTimeout(() => {
    showPopupMessage.value = false;
    
    // Execute current functionality after popup disappears
    hasSubmittedData.value = true;
    
    // Save data to localStorage
    saveToLocalStorage();
    
    requestAnimationFrame(() => {
      const el = document.getElementById("lawatan-siasatan-section");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, 5000);
}
function handleSubmitLawatan(data: any) {
  console.log("Lawatan form submitted:", data);
}

function resetForm() {
  // Reset all form data
  profilingData.value.assignSiasatan = "";
  hasSubmittedData.value = false;
  
  // Clear investigation data
  investigationData.value = {
    jenisPekerjaan: "Bekerja sebagai tukang sapu di sekolah",
    statusKediaman: "Rumah Sewa",
    jumlahBayaranRumah: "RM500",
    bilTanggungan: "2 Orang (Anak)",
    statusTanggungan: "Tanggungan Utama",
    keadaanSiasatan: "",
    tarikhLawatan: "",
    masaLawatan: "",
    catatanPenilianAwal: "",
    catatanLawatanETD: "",
    statusLawatan: "",
    RingkasanPemerhatian: "",
    komenPengesahanLawatan: "",
    tarikhPengesyoranAkhir: "",
  };
  
  // Clear localStorage
  clearLocalStorage();
  
  // Show success message
  showPopupMessage.value = true;
  popupMessage.value = "Form telah direset";
  setTimeout(() => {
    showPopupMessage.value = false;
  }, 3000);
}

/* (commented profiling actions retained for future use)
async function saveProfilingDraft() { ... }
async function submitProfiling() { ... }
function resetProfilingForm() { ... }
*/

async function saveLawatanDraft() {
  console.log("Saving Lawatan draft...", investigationData.value);
  await new Promise((res) => setTimeout(res, 800));
  console.log("Lawatan draft saved.");
}
async function submitLawatanFinal() {
  if (!canFinalizeLawatan.value) {
    alert("Sila lengkapkan Komen & Tarikh Pengesyoran Akhir.");
    return;
  }
  console.log("Finalizing Lawatan...", investigationData.value);
  await new Promise((res) => setTimeout(res, 1000));
  console.log("Lawatan finalized & saved.");
}

/* IMAGE MODAL */
function downloadImage(file: { url: string; filename: string }) {
  const link = document.createElement("a");
  link.href = file.url;
  link.download = file.filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
function saveImageCaption() {
  if (previewingImage.value) {
    console.log("Saving caption:", previewingImage.value.caption);
  }
  showPreviewModal.value = false;
}
</script>

<style lang="scss" scoped>
/* Card & spacing tweaks for tidy layout */
.rs-card :deep(.rs-card__body) { padding: 1rem; }

.image-upload-enter-active,
.image-upload-leave-active { transition: all 0.3s ease; }
.image-upload-enter-from { opacity: 0; transform: scale(0.9); }
.image-upload-leave-to   { opacity: 0; transform: scale(0.9); }

.group:hover .group-hover\:scale-105 { transform: scale(1.05); }

@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
.animate-spin { animation: spin 1s linear infinite; }

.progress-bar { transition: width 0.3s ease-in-out; }

.focus\:ring-2:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}
</style>
