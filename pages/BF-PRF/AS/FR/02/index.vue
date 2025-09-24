<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card v-if="currentSection == 1" class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Borang Permohonan Lengkap Online
          </h2>
          <div class="text-sm text-gray-600">
            Langkah {{ currentStepA }} dari {{ totalStepsA }}
          </div>
        </div>
      </template>

      <template #body>
        <!-- Progress indicator -->
        <div class="mb-6">
          <div class="flex justify-between mb-2">
            <div
              v-for="step in stepsA"
              :key="step.id"
              class="text-center flex-1"
              :class="{ 'font-semibold': currentStepA >= step.id }"
              @click="goToStepA(step.id)"
            >
              {{ step.label }}
            </div>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2.5">
            <div
              class="bg-primary h-2.5 rounded-full transition-all duration-300"
              :style="`width: ${
                currentStepA >= totalStepsA
                  ? 100
                  : (currentStepA / totalStepsA) * 100
              }%`"
            ></div>
          </div>
        </div>

        <!-- Section A Form - Step 1: Maklumat Peribadi -->
        <PeribadiForms
          v-if="currentStepA == 1"
          :form-data="formData"
          @next-step="nextStepA"
          @save-step="handleSaveStepA1"
        />

        <!-- Section A Form - Step 2: Maklumat Alamat -->
        <AlamatForms
          v-if="currentStepA === 2"
          :form-data="formData"
          @next-step="nextStepA"
          @prev-step="prevStepA"
          @save-step="handleSaveStepA2"
        />

        <!-- Section A Form - Step 3: Maklumat Pendidikan -->
        <PendidikanForms
          v-if="currentStepA === 3"
          :form-data="formData"
          @next-step="nextStepA"
          @prev-step="prevStepA"
          @save-step="handleSaveStepA3"
        />

        <!-- Section A Form - Step 4: Maklumat Islam -->
        <PengislamanForms
          v-if="currentStepA === 4"
          :form-data="formData"
          @next-step="nextStepA"
          @prev-step="prevStepA"
          @save-step="handleSaveStepA4"
        />

        <!-- Section A Form - Step 5: Maklumat Bank -->
        <PerbankanForms
          v-if="currentStepA === 5"
          :form-data="formData"
          @next-step="nextStepA"
          @prev-step="prevStepA"
          @save-step="handleSaveStepA5"
        />

        <!-- Section A Form - Step 6: Maklumat Kesihatan -->
        <KesihatanForms
          v-if="currentStepA === 6"
          :form-data="formData"
          @next-step="nextStepA"
          @prev-step="prevStepA"
          @save-step="handleSaveStepA6"
        />

        <!-- Section A Form - Step 7: Kemahiran -->
        <KemahiranForms
          v-if="currentStepA === 7"
          :form-data="formData"
          @next-step="nextStepA"
          @prev-step="prevStepA"
          @save-step="handleSaveStepA7"
        />

        <!-- Section A Form - Step 8: Maklumat Pinjaman Harta -->
        <PinjamanHartaForms
          v-if="currentStepA === 8"
          :form-data="formData"
          @next-step="nextStepA"
          @prev-step="prevStepA"
          @save-step="handleSaveStepA8"
        />

        <!-- Section A Form - Step 9: Maklumat Pemilikan Aset -->
        <PemilikanAsetForms
          v-if="currentStepA === 9"
          :form-data="formData"
          @next-step="nextStepA"
          @prev-step="prevStepA"
          @save-step="handleSaveStepA9"
        />

        <!-- Section A Form - Step 10: Maklumat Pekerjaan -->
        <PekerjaanForms
          v-if="currentStepA === 10"
          :form-data="formData"
          @next-step="nextStepA"
          @prev-step="prevStepA"
          @save-step="handleSaveStepA10"
        />

        <!-- Section A Form - Step 11: Maklumat Pendapatan & Perbelanjaan -->
        <PendapatanPerbelanjaanForms
          v-if="currentStepA === 11"
          :form-data="formData"
          @next-step="nextStepA"
          @prev-step="prevStepA"
          @save-step="handleSaveStepA11"
        />
      </template>
    </rs-card>

    <rs-card v-if="currentSection == 2" class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Borang Tanggungan Asnaf</h2>
          <div class="text-sm text-gray-600">
            Langkah {{ currentStepB }} dari {{ filteredStepsB.length }}
          </div>
        </div>
      </template>

      <template #body>
        <!-- Progress indicator -->
        <div class="mb-6">
          <div class="flex justify-between mb-2">
            <div
              v-for="step in filteredStepsB"
              :key="step.id"
              class="text-center flex-1 cursor-pointer relative group"
              :class="{ 'font-semibold': currentStepB >= step.id }"
              @click="goToStepB(step.id)"
            >
              {{ step.label }}
              <!-- Tooltip for Pengesahan Pendapatan -->
              <div
                v-if="step.tooltip"
                class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 max-w-xs"
              >
                {{ step.tooltip }}
                <!-- Arrow -->
                <div
                  class="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"
                ></div>
              </div>
            </div>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2.5">
            <div
              class="bg-primary h-2.5 rounded-full transition-all duration-300"
              :style="`width: ${
                currentStepB >= filteredStepsB.length
                  ? 100
                  : (currentStepB / filteredStepsB.length) * 100
              }%`"
            ></div>
          </div>
        </div>

        <!-- Section B Form Steps -->
        <!-- Tanggungan Selector and Management (Visible only during Steps 1-9) -->
        <div
          v-if="currentStepB >= 1 && currentStepB <= 9"
          class="mb-6 p-4 bg-gray-50 rounded-lg"
        >
          <div class="flex justify-between items-center mb-4">
            <h4 class="text-lg font-semibold">Senarai Tanggungan</h4>
            <rs-button
              type="button"
              variant="primary"
              @click="addTanggungan"
              class="text-sm"
              :disabled="tanggunganList.length >= 3"
            >
              + Tambah Tanggungan
              {{ tanggunganList.length >= 3 ? "(Maksimum 3)" : "" }}
            </rs-button>
          </div>

          <!-- Tanggungan Cards Display -->
          <div
            v-if="tanggunganList.length > 0"
            class="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <div
              v-for="(tanggungan, index) in tanggunganList"
              :key="tanggungan.id"
              class="p-4 bg-white rounded-lg border cursor-pointer hover:shadow-md transition-all"
              :class="{
                'ring-2 ring-blue-500 border-blue-300':
                  currentTanggunganIndex === index,
                'border-green-300 bg-green-50':
                  isTanggunganComplete(tanggungan) &&
                  currentTanggunganIndex !== index,
                'border-yellow-300 bg-yellow-50':
                  !isTanggunganComplete(tanggungan) &&
                  currentTanggunganIndex !== index,
                'border-gray-200':
                  currentTanggunganIndex !== index &&
                  !isTanggunganComplete(tanggungan),
              }"
              @click="selectTanggungan(index)"
            >
              <!-- Card Header -->
              <div class="flex justify-between items-start mb-3">
                <div class="flex-1 text-center">
                  <!-- <h5 class="font-semibold text-gray-900">
                      Tanggungan {{ index + 1 }}
                    </h5> -->
                  <p class="text-sm text-gray-600">
                    {{ tanggungan.nama_tanggungan || "Nama belum diisi" }}
                  </p>
                  <p class="text-sm text-gray-600">
                    {{ tanggungan.hubungan_pemohon || "Hubungan belum diisi" }}
                  </p>
                </div>

                <!-- Status Badge -->
                <span
                  class="px-2 py-1 text-xs rounded-full"
                  :class="{
                    'bg-green-100 text-green-800':
                      isTanggunganComplete(tanggungan),
                    'bg-yellow-100 text-yellow-800':
                      !isTanggunganComplete(tanggungan),
                  }"
                >
                  {{
                    isTanggunganComplete(tanggungan)
                      ? "Lengkap"
                      : "Tidak Lengkap"
                  }}
                </span>
              </div>

              <!-- Key Information -->
              <!-- <div class="space-y-2 text-sm text-gray-600">
                <div v-if="tanggungan.hubungan_pemohon">
                  <span class="font-medium">Hubungan:</span>
                  {{ tanggungan.hubungan_pemohon }}
                </div>
                <div v-if="tanggungan.jenis_id_tanggungan">
                  <span class="font-medium">ID:</span>
                  {{ tanggungan.jenis_id_tanggungan }}
                </div>
                <div v-if="tanggungan.jantina_tanggungan">
                  <span class="font-medium">Jantina:</span>
                  {{ tanggungan.jantina_tanggungan }}
                </div>
              </div> -->

              <!-- Action Buttons -->
              <div class="flex gap-2 mt-4">
                <button
                  @click.stop="selectTanggungan(index)"
                  class="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                >
                  {{
                    currentTanggunganIndex === index ? "Sedang Edit" : "Edit"
                  }}
                </button>
                <!-- <button
                  v-if="tanggunganList.length > 1"
                  @click.stop="removeTanggungan(index)"
                  class="px-3 py-2 text-red-600 hover:text-red-800 text-sm rounded border border-red-300 hover:bg-red-50 transition-colors"
                  title="Buang tanggungan ini">
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button> -->
              </div>
            </div>
          </div>
        </div>

        <!-- Section B Form - Step 1: Maklumat Peribadi Tanggungan -->
        <TanggunganPeribadiForms
          v-if="currentStepB === 1"
          :get-current-tanggungan="getCurrentTanggungan"
          :current-tanggungan-index="currentTanggunganIndex"
          :form-data="formData"
          :show-lain-lain-hubungan="showLainLainHubungan"
          :show-dokumen-surat-nikah="showDokumenSuratNikah"
          :show-lain-lain-warganegara="showLainLainWarganegara"
          :show-passport-fields="showPassportFields"
          :show-passport-expiry-warning="showPassportExpiryWarning"
          :show-lain-lain-agama="showLainLainAgama"
          :show-lain-lain-bangsa="showLainLainBangsa"
          :show-lain-lain-status-perkahwinan="showLainLainStatusPerkahwinan"
          :calculate-age="calculateAge"
          :calculate-total-tanggungan="calculateTotalTanggungan"
          @next-step="nextStepB"
          @prev-step="prevStepB"
          @save-step="handleSaveStepB1"
        />

        <!-- Section B Form - Step 2: Maklumat Islam Tanggungan -->
        <TanggunganPengislamanForms
          v-if="currentStepB === 2"
          :get-current-tanggungan="getCurrentTanggungan"
          @next-step="nextStepB"
          @prev-step="prevStepB"
          @save-step="handleSaveStepB2"
        />

        <!-- Section B Form - Step 3: Maklumat Bank Tanggungan -->
        <TanggunganPerbankanForms
          v-if="currentStepB === 3"
          :get-current-tanggungan="getCurrentTanggungan"
          :bank-options="bankOptions"
          :no-payment-reason-options="noPaymentReasonOptions"
          :show-lain-lain-sebab-tiada-akaun-tanggungan="
            showLainLainSebabTiadaAkaunTanggungan
          "
          :get-swift-code-for-bank="getSwiftCodeForBank"
          @next-step="nextStepB"
          @prev-step="prevStepB"
          @save-step="handleSaveStepB3"
          @add-bank-account-tanggungan="addBankAccountTanggungan"
          @remove-bank-account-tanggungan="removeBankAccountTanggungan"
          @add-pengenalan-id-tanggungan="addPengenalanIdTanggungan"
          @remove-pengenalan-id-tanggungan="removePengenalanIdTanggungan"
        />

        <!-- Section B Form - Step 4: Maklumat Pendidikan Tanggungan -->
        <TanggunganPendidikanForms
          v-if="currentStepB === 4"
          :get-current-tanggungan="getCurrentTanggungan"
          :get-filtered-school-options="getFilteredSchoolOptions"
          @next-step="nextStepB"
          @prev-step="prevStepB"
          @save-step="handleSaveStepB4"
          @add-education-entry-tanggungan="addEducationEntryTanggungan"
          @remove-education-entry-tanggungan="removeEducationEntryTanggungan"
          @on-select-school-tanggungan="onSelectSchoolTanggungan"
        />

        <!-- Section B Form - Step 5: Maklumat Kesihatan Tanggungan -->
        <TanggunganKesihatanForms
          v-if="currentStepB === 5"
          :get-current-tanggungan="getCurrentTanggungan"
          @next-step="nextStepB"
          @prev-step="prevStepB"
          @save-step="handleSaveStepB5"
        />

        <!-- Section B Form - Step 6: Maklumat Kemahiran Tanggungan -->
        <TanggunganKemahiranForms
          v-if="currentStepB === 6"
          :get-current-tanggungan="getCurrentTanggungan"
          @next-step="nextStepB"
          @prev-step="prevStepB"
          @save-step="handleSaveStepB6"
        />

        <!-- Section B Form - Step 7: Maklumat Pekerjaan Tanggungan -->
        <TanggunganPekerjaanForms
          v-if="currentStepB === 7"
          :get-current-tanggungan="getCurrentTanggungan"
          :show-lain-lain-sektor-tanggungan="showLainLainSektorTanggungan"
          @next-step="nextStepB"
          @prev-step="prevStepB"
          @save-step="handleSaveStepB7"
        />

        <!-- Section B Form - Step 8: Maklumat Pemilikan Aset (Tanggungan) -->
        <TanggunganPemilikanAsetForms
          v-if="currentStepB === 8"
          :get-current-tanggungan="getCurrentTanggungan"
          @next-step="nextStepB"
          @prev-step="prevStepB"
          @save-step="handleSaveStepB8"
        />

        <!-- Section B Form - Step 9: Maklumat Pinjaman Harta (Tanggungan) -->
        <TanggunganPinjamanHartaForms
          v-if="currentStepB === 9"
          :get-current-tanggungan="getCurrentTanggungan"
          :jenis-pinjaman-options="jenisPinjamanOptions"
          @next-step="nextStepB"
          @prev-step="prevStepB"
          @save-step="handleSaveStepB9"
        />

        <!-- Section B Form - Step 10: Pengesahan -->
        <TanggunganPengesahanForms
          v-if="currentStepB === 10"
          :screen-type="screenType"
          :dibantu-penolong-amil="dibantuPenolongAmil"
          :form-data="formData"
          :kariah-options="kariahOptions"
          :pak-officers-options-bantuan="pakOfficersOptionsBantuan"
          @next-step="nextStepB"
          @prev-step="prevStepB"
          @save-step="handleSaveStepB10"
          @update:dibantu-penolong-amil="dibantuPenolongAmil = $event"
        />

        <!-- Section B Form - Step 11: Pengesahan Pendapatan -->
        <TanggunganPengesahanPendapatanForms
          v-if="currentStepB === 11"
          :form-data="formData"
          @next-step="nextStepB"
          @prev-step="prevStepB"
          @save-step="handleSaveStepB11"
        />

        <!-- Section B Form - Step 12: Pengesahan Bermastautin -->
        <TanggunganPengesahanBermastauntinForms
          v-if="currentStepB === 12"
          :form-data="formData"
          :kariah-options="kariahOptions"
          :uploaded-documents="uploadedDocuments"
          @next-step="nextStepB"
          @prev-step="prevStepB"
          @save-step="handleSaveStepB12"
          @download-document="downloadDocument"
        />

        <!-- Section B Form - Step 13: Pegawai Pendaftar -->
        <TanggunganPegawaiPendaftarForms
          v-if="currentStepB === 13"
          @prev-step="prevStepB"
          @save-step="handleSaveStepB13"
          @submit-form="handleSubmit"
        />
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useToast } from "vue-toastification";
import { useRouter } from "vue-router";
import PeribadiForms from "~/components/forms/borang-permohonan-lengkap/SectionA/PeribadiForms.vue";
import AlamatForms from "~/components/forms/borang-permohonan-lengkap/SectionA/AlamatForms.vue";
import PendidikanForms from "~/components/forms/borang-permohonan-lengkap/SectionA/PendidikanForms.vue";
import PengislamanForms from "~/components/forms/borang-permohonan-lengkap/SectionA/PengislamanForms.vue";
import PerbankanForms from "~/components/forms/borang-permohonan-lengkap/SectionA/PerbankanForms.vue";
import KesihatanForms from "~/components/forms/borang-permohonan-lengkap/SectionA/KesihatanForms.vue";
import KemahiranForms from "~/components/forms/borang-permohonan-lengkap/SectionA/KemahiranForms.vue";
import PinjamanHartaForms from "~/components/forms/borang-permohonan-lengkap/SectionA/PinjamanHartaForms.vue";
import PemilikanAsetForms from "~/components/forms/borang-permohonan-lengkap/SectionA/PemilikanAsetForms.vue";
import PekerjaanForms from "~/components/forms/borang-permohonan-lengkap/SectionA/PekerjaanForms.vue";
import PendapatanPerbelanjaanForms from "~/components/forms/borang-permohonan-lengkap/SectionA/PendapatanPerbelanjaanForms.vue";
import TanggunganKemahiranForms from "~/components/forms/borang-permohonan-lengkap/SectionB/TanggunganKemahiranForms.vue";
import TanggunganPeribadiForms from "~/components/forms/borang-permohonan-lengkap/SectionB/TanggunganPeribadiForms.vue";
import TanggunganPendidikanForms from "~/components/forms/borang-permohonan-lengkap/SectionB/TanggunganPendidikanForms.vue";
import TanggunganPemilikanAsetForms from "~/components/forms/borang-permohonan-lengkap/SectionB/TanggunganPemilikanAsetForms.vue";
import TanggunganPinjamanHartaForms from "~/components/forms/borang-permohonan-lengkap/SectionB/TanggunganPinjamanHartaForms.vue";
import TanggunganPengislamanForms from "~/components/forms/borang-permohonan-lengkap/SectionB/TanggunganPengislamanForms.vue";
import TanggunganPengesahanPendapatanForms from "~/components/forms/borang-permohonan-lengkap/SectionB/TanggunganPengesahanPendapatanForms.vue";
import TanggunganPengesahanBermastauntinForms from "~/components/forms/borang-permohonan-lengkap/SectionB/TanggunganPengesahanBermastauntinForms.vue";
import TanggunganPegawaiPendaftarForms from "~/components/forms/borang-permohonan-lengkap/SectionB/TanggunganPegawaiPendaftarForms.vue";
import TanggunganPerbankanForms from "~/components/forms/borang-permohonan-lengkap/SectionB/TanggunganPerbankanForms.vue";
import TanggunganKesihatanForms from "~/components/forms/borang-permohonan-lengkap/SectionB/TanggunganKesihatanForms.vue";
import TanggunganPekerjaanForms from "~/components/forms/borang-permohonan-lengkap/SectionB/TanggunganPekerjaanForms.vue";
import TanggunganPengesahanForms from "~/components/forms/borang-permohonan-lengkap/SectionB/TanggunganPengesahanForms.vue";

// ============================================================================
// ROUTER & TOAST SETUP
// ============================================================================
const router = useRouter();
const toast = useToast();

definePageMeta({
  title: "Borang Permohonan Lengkap",
});

// ============================================================================
// BREADCRUMB CONFIGURATION
// ============================================================================
const breadcrumb = ref([
  {
    name: "Profiling",
    type: "link",
    path: "/BF-PRF/AS/FR/02",
  },
  {
    name: "Asnaf",
    type: "link",
    path: "/BF-PRF/AS/FR/02",
  },
  {
    name: " Pendaftaran Lengkap",
    type: "current",
    path: "/BF-PRF/AS/FR/02",
  },
]);

// ============================================================================
// SECTION & STEP MANAGEMENT
// ============================================================================
const processing = ref(false);
const currentSection = ref(1);

// Section A - Main Form Steps
const currentStepA = ref(1);
const totalStepsA = 11;
const stepsA = [
  { id: 1, label: "Peribadi" },
  { id: 2, label: "Alamat" },
  { id: 3, label: "Pendidikan" },
  { id: 4, label: "Pengislaman" },
  { id: 5, label: "Perbankan" },
  { id: 6, label: "Kesihatan" },
  { id: 7, label: "Kemahiran" },
  { id: 8, label: "Pinjaman Harta" },
  { id: 9, label: "Pemilikan Aset" },
  { id: 10, label: "Pekerjaan" },
  { id: 11, label: "Pendapatan & Perbelanjaan" },
];

// Section B - Tanggungan Form Steps (13 steps with separate tabs for different info sections)
const currentStepB = ref(1);
const totalStepsB = 13;
const stepsB = [
  { id: 1, label: "Peribadi" },
  { id: 2, label: "Pengislaman" },
  { id: 3, label: "Perbankan" },
  { id: 4, label: "Pendidikan" },
  { id: 5, label: "Kesihatan" },
  { id: 6, label: "Kemahiran" },
  { id: 7, label: "Pekerjaan" },
  { id: 8, label: "Pemilikan Aset" },
  { id: 9, label: "Pinjaman Harta" },
  { id: 10, label: "Pengesahan" },
  {
    id: 11,
    label: "Pengesahan Pendapatan",
    tooltip:
      "Wakil Rakyat/Penghulu/Ketua Kampung/Ketua Penduduk/Nazir Masjid/Pengerusi Surau/Penolong Amil/Guru Pembimbing Asnaf Muallaf/Eksekutif LZS/Ketua Operasi Agihan Daerah LZS/Ketua Jabatan LZS/Pengurus LZS/Ketua Cawangan LZS",
  },
  { id: 12, label: "Pengesahan Bermastautin" },
  { id: 13, label: "Pegawai Pendaftar" },
];

// Computed property to filter stepsB based on current tanggungan's age
const filteredStepsB = computed(() => {
  const currentTanggungan = getCurrentTanggungan();
  if (!currentTanggungan) return stepsB;

  const age = parseInt(
    currentTanggungan.umur_tanggungan ||
      calculateAge(currentTanggungan.tarikh_lahir_tanggungan)
  );

  // Hide Kemahiran tab (id: 6) if age is less than 19
  if (age < 19) {
    return stepsB.filter((step) => step.id !== 6);
  }

  return stepsB;
});

// Mock data for Sekolah Agama
const sekolahAgamaOptions = [
  // Sekolah Rendah Agama (SRA)
  {
    label: "SRA Al-Amin Kuala Lumpur",
    value: "sra-al-amin-kl",
    kategori: "SRA",
    alamat1: "Jalan Ampang, Kuala Lumpur",
    alamat2: "Wilayah Persekutuan",
    alamat3: "50450 Kuala Lumpur",
    daerah: "Kuala Lumpur",
    bandar: "Kuala Lumpur",
    poskod: "50450",
  },
  {
    label: "SRA Al-Hidayah Shah Alam",
    value: "sra-al-hidayah-sa",
    kategori: "SRA",
    alamat1: "Jalan Masjid, Shah Alam",
    alamat2: "Selangor",
    alamat3: "40000 Shah Alam",
    daerah: "Shah Alam",
    bandar: "Shah Alam",
    poskod: "40000",
  },
  {
    label: "SRA Al-Ikhlas Petaling Jaya",
    value: "sra-al-ikhlas-pj",
    kategori: "SRA",
    alamat1: "Jalan SS2, Petaling Jaya",
    alamat2: "Selangor",
    alamat3: "47300 Petaling Jaya",
    daerah: "Petaling Jaya",
    bandar: "Petaling Jaya",
    poskod: "47300",
  },
  // KAFA
  {
    label: "KAFA Al-Falah Kuala Lumpur",
    value: "kafa-al-falah-kl",
    kategori: "KAFA",
    alamat1: "Jalan TAR, Kuala Lumpur",
    alamat2: "Wilayah Persekutuan",
    alamat3: "50100 Kuala Lumpur",
    daerah: "Kuala Lumpur",
    bandar: "Kuala Lumpur",
    poskod: "50100",
  },
  {
    label: "KAFA Al-Munawwarah Klang",
    value: "kafa-al-munawwarah-klang",
    kategori: "KAFA",
    alamat1: "Jalan Meru, Klang",
    alamat2: "Selangor",
    alamat3: "41050 Klang",
    daerah: "Klang",
    bandar: "Klang",
    poskod: "41050",
  },
  // IPT (Islamic)
  {
    label: "Universiti Islam Antarabangsa Malaysia (UIAM)",
    value: "uiam",
    kategori: "IPT",
    alamat1: "Jalan Gombak, Gombak",
    alamat2: "Selangor",
    alamat3: "53100 Gombak",
    daerah: "Gombak",
    bandar: "Gombak",
    poskod: "53100",
  },
  {
    label: "Kolej Universiti Islam Selangor (KUIS)",
    value: "kuis",
    kategori: "IPT",
    alamat1: "Bandar Seri Putra, Kajang",
    alamat2: "Selangor",
    alamat3: "43000 Kajang",
    daerah: "Kajang",
    bandar: "Kajang",
    poskod: "43000",
  },
];

// Mock data for Sekolah Kebangsaan
const sekolahKebangsaanOptions = [
  // Sekolah Rendah Kebangsaan (SRK)
  {
    label: "SK Taman Tun Dr Ismail",
    value: "sk-ttdi",
    kategori: "SRK",
    alamat1: "Jalan TTD1, Taman Tun Dr Ismail",
    alamat2: "Kuala Lumpur",
    alamat3: "60000 Kuala Lumpur",
    daerah: "Kuala Lumpur",
    bandar: "Kuala Lumpur",
    poskod: "60000",
  },
  {
    label: "SK Bandar Utama",
    value: "sk-bandar-utama",
    kategori: "SRK",
    alamat1: "Jalan BU 3/1, Bandar Utama",
    alamat2: "Petaling Jaya",
    alamat3: "47800 Petaling Jaya",
    daerah: "Petaling Jaya",
    bandar: "Petaling Jaya",
    poskod: "47800",
  },
  {
    label: "SK Seksyen 7, Shah Alam",
    value: "sk-seksyen-7-sa",
    kategori: "SRK",
    alamat1: "Jalan Seksyen 7, Shah Alam",
    alamat2: "Selangor",
    alamat3: "40000 Shah Alam",
    daerah: "Shah Alam",
    bandar: "Shah Alam",
    poskod: "40000",
  },
  // Sekolah Menengah Kebangsaan (SEK.MEN)
  {
    label: "SMK Taman Melawati",
    value: "smk-taman-melawati",
    kategori: "SEK.MEN",
    alamat1: "Jalan Melawati, Taman Melawati",
    alamat2: "Kuala Lumpur",
    alamat3: "53100 Kuala Lumpur",
    daerah: "Kuala Lumpur",
    bandar: "Kuala Lumpur",
    poskod: "53100",
  },
  {
    label: "SMK Bandar Baru Bangi",
    value: "smk-bandar-baru-bangi",
    kategori: "SEK.MEN",
    alamat1: "Jalan 2/1, Bandar Baru Bangi",
    alamat2: "Selangor",
    alamat3: "43650 Bandar Baru Bangi",
    daerah: "Bangi",
    bandar: "Bangi",
    poskod: "43650",
  },
  {
    label: "SMK Seksyen 18, Shah Alam",
    value: "smk-seksyen-18-sa",
    kategori: "SEK.MEN",
    alamat1: "Jalan Seksyen 18, Shah Alam",
    alamat2: "Selangor",
    alamat3: "40000 Shah Alam",
    daerah: "Shah Alam",
    bandar: "Shah Alam",
    poskod: "40000",
  },
  // IPT (Public/Private)
  {
    label: "Universiti Malaya (UM)",
    value: "um",
    kategori: "IPT",
    alamat1: "Jalan Universiti, Kuala Lumpur",
    alamat2: "Wilayah Persekutuan",
    alamat3: "50603 Kuala Lumpur",
    daerah: "Kuala Lumpur",
    bandar: "Kuala Lumpur",
    poskod: "50603",
  },
  {
    label: "Universiti Putra Malaysia (UPM)",
    value: "upm",
    kategori: "IPT",
    alamat1: "Universiti Putra Malaysia",
    alamat2: "Serdang, Seri Kembangan",
    alamat3: "43400 UPM Serdang",
    daerah: "Serdang",
    bandar: "Seri Kembangan",
    poskod: "43400",
  },
  {
    label: "Universiti Teknologi Malaysia (UTM)",
    value: "utm",
    kategori: "IPT",
    alamat1: "Jalan Sultan Yahya Petra",
    alamat2: "Kuala Lumpur",
    alamat3: "54100 Kuala Lumpur",
    daerah: "Kuala Lumpur",
    bandar: "Kuala Lumpur",
    poskod: "54100",
  },
];

// Combined school options for backward compatibility
const schoolOptions = [...sekolahAgamaOptions, ...sekolahKebangsaanOptions];

// ============================================================================
// COMPUTED PROPERTIES FOR SCHOOL FILTERING
// ============================================================================
// Computed property to get filtered school options based on kategori sekolah
const getFilteredSchoolOptions = (kategoriSekolah) => {
  if (!kategoriSekolah) return schoolOptions;

  return schoolOptions.filter((school) => school.kategori === kategoriSekolah);
};

// ============================================================================
// FORM STATE VARIABLES
// ============================================================================

// Relationship Variables
const dibantuPenolongAmil = ref("");

// Modal Variables
const showKursusModal = ref(false);
const selectedKelas = ref(null);

// Tanggungan Management Variables
const currentTanggunganIndex = ref(0);
const tanggunganList = ref([]);
const showTanggunganSummary = ref(false);

// Screen context: 'selfservice' or 'pendaftar'
const screenType = ref("pendaftar");

// ============================================================================
// FORM DATA STRUCTURE
// ============================================================================
const formData = ref({
  // Section A - Maklumat Peribadi Asnaf
  jenis_id: "",
  no_pengenalan: "",
  nama: "",
  warganegara: "",
  tarikh_lahir: "",
  umur: "",
  tempat_lahir: "",
  jantina: "",
  agama: "",
  bangsa: "",
  no_telefon_bimbit: "",
  no_telefon_rumah: "",
  emel: "",
  bersekolah: "",
  pendidikan_tertinggi: "",
  status_perkahwinan: "",
  status_poligami: "",
  bilangan_isteri: "",
  isteri_list: [],
  dokumen_surat_nikah: null,
  taraf_penduduk: "",
  nopassportlama: "",
  lain_warganegara: "",
  dokumen_id: null,
  agama_lain: "",
  bangsa_lain: "",

  // Section A - Maklumat Pendidikan
  masih_bersekolah: "",
  pendidikan_tertinggi: "",
  lain_pendidikan_tertinggi: "",
  tahap_pendidikan: [],
  lain_tahap_pendidikan: "",
  sijil_pendidikan: null,
  // Multiple education entries (new)
  education_entries: [],
  // Passport dates for foreign IDs (Peribadi)
  passportStartDate: "",
  passportEndDate: "",
  jenis_sekolah: "",
  kategori_sekolah: "",
  tahun_bersekolah: "",
  tahun_tingkatan: "",
  nama_sekolah: "",
  alamat_sekolah_1: "",
  alamat_sekolah_2: "",
  alamat_sekolah_3: "",
  daerah_sekolah: "",
  bandar_sekolah: "",
  poskod_sekolah: "",
  tinggal_bersama_keluarga: "",
  asrama_rumah_sewa: "",
  nama_baitul: "",
  bidang_kursus: "",
  jurusan_bidang: "",
  pembiayaan_pengajian: [],
  lain_pembiayaan: "",
  catatan_pendidikan: "",

  // Section A - Maklumat Islam
  adakah_muallaf: "",
  tarikh_masuk_islam: "",
  tarikh_masuk_kfam: "",
  nama_selepas_islam: "",
  nama_sebelum_islam: "",
  tarikh_keluar_muallaf: "",
  dokumen_pengislaman: null,

  // Bank Information
  nama_bank: "",
  no_akaun_bank: "",
  nama_pemegang_akaun: "",
  swift_code: "",
  ada_akaun_bank: "",
  sebab_tiada_akaun: "",
  lain_lain_sebab_tiada_akaun: "",
  sebab_tunai: "",
  // Multiple bank accounts (new)
  bank_accounts: [],

  // Section B - Maklumat Kesihatan
  tahap_kesihatan: "",
  keadaan_kesihatan_sakit: "",
  kos_penjagaan_sakit: "",
  perbelanjaan_bulanan_sakit: "",
  kesempurnaan_fizikal: "",
  sebab_kecacatan: "",
  tahap_kecacatan: "",
  perbelanjaan_bulanan_oku: "",
  keadaan_kesihatan_uzur: "",
  kos_penjagaan_uzur: "",
  perbelanjaan_bulanan_uzur: "",
  dokumen_sokongan_kesihatan: null,

  // Section C - Kemahiran
  kemahiran: "",
  lain_lain_kemahiran: "",

  // Section D - Maklumat Pekerjaan
  status_pekerjaan: "",
  jenis_pekerjaan: "",
  sektor_pekerjaan: "",
  lain_lain_sektor: "",
  no_telefon_pejabat: "",
  nama_majikan: "",
  no_telefon_majikan: "",
  alamat_majikan_1: "",
  alamat_majikan_2: "",
  alamat_majikan_3: "",
  bandar_majikan: "",
  poskod_majikan: "",
  daerah_majikan: "",
  negeri_majikan: "",
  negara_majikan: "",
  jawatan: "",
  status_jawatan: "",
  pendapatan_kasar: "",
  pengesahan_pendapatan: [],
  sumber_pendapatan: [],
  lain_lain_sumber_pendapatan: "",

  // Section E - Maklumat Pendapatan
  gaji_elaun_pendapatan: "",
  pendapatan_isteri_suami_ibubapa_penjaga: "",
  pencen_perkeso: "",
  sumbangan_anak_anak: "",
  bantuan_jkm: "",
  takaful: "",
  sewa_rumah_tanah_kedai: "",
  pendapatan_tanggungan_serumah: "",
  pendapatan_lain_lain: [{ amount: "" }],
  perbelanjaan_makanan_minuman: "",
  sewa_bayaran_pinjaman_perumahan: "",
  perbelanjaan_persekolahan_anak: "",
  pengangkutan_tambang_bas_sekolah: "",
  bil_utiliti: "",

  // Section F - Maklumat Alamat
  addressInfo: {
    alamat1: "",
    alamat2: "",
    alamat3: "",
    location: "",
    negeri: "Selangor",
    daerah: "",
    bandar: "",
    poskod: "",
    kariah: "",
    geolokasi: "",
    tempoh_menetap_selangor: "",
    tempoh_menetap_selangor_nilai: "",
    tempoh_menetap_selangor_unit: "",
    kategori_menetap: "",
    kelulusan_khas: "",
    kursus_terpilih: "",
    selectedKursus: null,
    selectedGuru: null,
    // Maklumat Tempat Tinggal
    status_kediaman: "",
    keadaan_kediaman: "",
    kadar_bayaran_bulanan: "",
    kadar_sewa_bulanan: "",
    dokumen_perjanjian_sewa: null,
    lain_lain_status_kediaman: "",
  },

  // Section H - Maklumat Pemilikan
  wang_simpanan: "",
  emas: "",
  saham: "",
  jenis_kenderaan: [],
  kenderaan_total: "",
  rumah_kedai: "",
  tanah_sawah: "",
  dokumen_pemilikan: null,

  // Section H1 - Maklumat Pinjaman Harta
  nama_institusi_pemberi_pinjaman: "",
  jenis_pinjaman: "",
  amaun_bayaran_bulanan: "",
  jumlah_keseluruhan_perbelanjaan: "",
  tahun_mula_pinjaman: "",
  tahun_akhir_pinjaman: "",
  dokumen_perjanjian_pinjaman: null,

  // Section J - Pengesahan
  pengesahan: {
    dibantu_penolong_amil: "",
    kariah_bantuan: "",
    nama_penolong_amil_bantuan: "",
    tarikh_bantuan: "",
    hubungan_pak: "",
    kariah_hubungan_pak: "",
    nama_pak_hubungan: "",
    jenis_hubungan_pak: "",
    tarikh_hubungan_pak: "",
    pdpa_consent: false,
    pendapatan_consent: false,
    hubungan_kakitangan_lzs: "",
    nama_kakitangan: "",
    jawatan_kakitangan: "",
    pejabat_kakitangan: "",
    hubungan_kakitangan: "",
    tarikh_perakuan: new Date().toISOString().slice(0, 10),
    // Fake data for PAK officer information display in bermastautin
    kariah_bermastautin: "masjid-al-hidayah",
    nama_pak_bermastautin: "ustaz-ahmad-abdullah",
    // Fake data for form fields in bermastautin
    nama_pengesah: "Ustaz Ahmad bin Abdullah",
    jawatan_pengesah: "Pegawai PAK",
    no_telefon_pengesah: "012-3456789",
    tarikh_pengesahan_permastautin: "2024-01-15",
  },

  // Section J1 - Pengesahan Pendapatan
  pengesahan_pendapatan: {
    nama_penolong_amil: "",
    jawatan_penolong_amil: "",
    no_telefon_penolong_amil: "",
    tarikh_pengesahan_pendapatan: "",
    dokumen_pengesahan_pendapatan: null,
    nama_pegawai_lzs: "",
    jawatan_pegawai_lzs: "",
    no_telefon_pegawai_lzs: "",
    tarikh_pengesahan_pegawai_lzs: "",
    dokumen_pengesahan_pegawai_lzs: null,
  },

  // Section K - Pengesahan Bermastautin
  ulasan_pengesahan: "",
  surat_pengesahan_bermastautin: null,

  // Section L - Maklumat Penolong Amil
  nama_penolong_amil: "",
  jenis_permohonan: "",
  tarikh_proses: "",

  // Section M - Penilaian Awal
  komitmen_tinggi: "",
  keperluan_mendesak: [],
  lain_keperluan: "",
  dokumen_sokongan: [],

  // Section B (Tanggungan) - Maklumat Peribadi Tanggungan
  // Note: Individual tanggungan fields are now handled in tanggunganList array
  // These fields are kept for backward compatibility but will be replaced

  // Tanggungan array for multiple dependents
  tanggungan: [],
});

// Mock file data for demonstration
onMounted(() => {
  // Set mock file data
  formData.value.dokumen_surat_nikah = [
    {
      name: "surat_nikah_sample.pdf",
      size: 2048576, // 2MB in bytes
      type: "application/pdf",
      file: new File(["mock content"], "surat_nikah_sample.pdf", {
        type: "application/pdf",
      }),
    },
  ];
});

// ============================================================================
// OPTIONS DATA
// ============================================================================

// No Payment Reason Options
const noPaymentReasonOptions = [
  { label: "Bukan Warganegara", value: "bukan-warganegara" },
  { label: "Sakit Terlantar", value: "sakit" },
  { label: "Lain-lain", value: "lain-lain" },
];

// Bank Options with SWIFT Codes
const bankOptions = [
  { label: "Maybank", value: "maybank", swiftCode: "MBBEMYKL" },
  { label: "CIMB", value: "cimb", swiftCode: "CIBBMYKL" },
  { label: "RHB", value: "rhb", swiftCode: "RHBBMYKL" },
  { label: "Bank Islam", value: "bank-islam", swiftCode: "BIMBMYKL" },
  { label: "Bank Rakyat", value: "bank-rakyat", swiftCode: "BKRMYKL" },
  { label: "Public Bank", value: "public-bank", swiftCode: "PBBEMYKL" },
  { label: "Hong Leong Bank", value: "hong-leong", swiftCode: "HLBBMYKL" },
  { label: "Ambank", value: "ambank", swiftCode: "ARBKMYKL" },
  { label: "BSN", value: "bsn", swiftCode: "BSNAMYKL" },
  { label: "Affin Bank", value: "affin", swiftCode: "PHBMMYKL" },
  { label: "UOB", value: "uob", swiftCode: "UOVBMYKL" },
  { label: "OCBC", value: "ocbc", swiftCode: "OCBCMYKL" },
  {
    label: "Standard Chartered",
    value: "standard-chartered",
    swiftCode: "SCBLMYKL",
  },
  { label: "Alliance Bank", value: "alliance", swiftCode: "MFBBMYKL" },
  { label: "Agrobank", value: "agrobank", swiftCode: "AGOBMYKL" },
];

// District Options
const daerahOptions = [
  { label: "Gombak", value: "gombak" },
  { label: "Hulu Langat", value: "hulu-langat" },
  { label: "Hulu Selangor", value: "hulu-selangor" },
  { label: "Klang", value: "klang" },
  { label: "Kuala Langat", value: "kuala-langat" },
  { label: "Kuala Selangor", value: "kuala-selangor" },
  { label: "Petaling", value: "petaling" },
  { label: "Sabak Bernam", value: "sabak-bernam" },
  { label: "Sepang", value: "sepang" },
];

// Mosque Parish Options
const kariahOptions = [
  { label: "Kariah Masjid Al-Hidayah", value: "masjid-al-hidayah" },
  { label: "Kariah Masjid Al-Ikhlas", value: "masjid-al-ikhlas" },
  { label: "Kariah Masjid Al-Muttaqin", value: "masjid-al-muttaqin" },
  { label: "Kariah Masjid Al-Rahman", value: "masjid-al-rahman" },
  { label: "Kariah Masjid Al-Salam", value: "masjid-al-salam" },
  { label: "Kariah Masjid Al-Taqwa", value: "masjid-al-taqwa" },
  { label: "Kariah Masjid An-Nur", value: "masjid-an-nur" },
  { label: "Kariah Masjid Ar-Rahman", value: "masjid-ar-rahman" },
  { label: "Kariah Masjid As-Salam", value: "masjid-as-salam" },
  { label: "Kariah Masjid At-Taqwa", value: "masjid-at-taqwa" },
];

// PAK Officers by Mosque Parish
const pakOfficersByKariah = {
  "masjid-al-hidayah": [
    { label: "Ustaz Ahmad bin Abdullah", value: "ustaz-ahmad-abdullah" },
    { label: "Ustazah Siti binti Mohamed", value: "ustazah-siti-mohamed" },
    { label: "Ustaz Mohd bin Hassan", value: "ustaz-mohd-hassan" },
  ],
  "masjid-al-ikhlas": [
    { label: "Ustaz Ismail bin Omar", value: "ustaz-ismail-omar" },
    { label: "Ustazah Fatimah binti Ali", value: "ustazah-fatimah-ali" },
    { label: "Ustaz Kamal bin Ibrahim", value: "ustaz-kamal-ibrahim" },
  ],
  "masjid-al-muttaqin": [
    { label: "Ustaz Rahman bin Sulaiman", value: "ustaz-rahman-sulaiman" },
    { label: "Ustazah Aminah binti Yusof", value: "ustazah-aminah-yusof" },
    { label: "Ustaz Zulkifli bin Ahmad", value: "ustaz-zulkifli-ahmad" },
  ],
  "masjid-al-rahman": [
    { label: "Ustaz Aziz bin Mohamed", value: "ustaz-aziz-mohamed" },
    { label: "Ustazah Nor binti Hassan", value: "ustazah-nor-hassan" },
    { label: "Ustaz Hamid bin Abdullah", value: "ustaz-hamid-abdullah" },
  ],
  "masjid-al-salam": [
    { label: "Ustaz Yusof bin Ahmad", value: "ustaz-yusof-ahmad" },
    { label: "Ustazah Mariam binti Omar", value: "ustazah-mariam-omar" },
    { label: "Ustaz Khalid bin Ismail", value: "ustaz-khalid-ismail" },
  ],
  "masjid-al-taqwa": [
    { label: "Ustaz Omar bin Hassan", value: "ustaz-omar-hassan" },
    { label: "Ustazah Zainab binti Ali", value: "ustazah-zainab-ali" },
    { label: "Ustaz Ibrahim bin Mohamed", value: "ustaz-ibrahim-mohamed" },
  ],
  "masjid-an-nur": [
    { label: "Ustaz Hassan bin Abdullah", value: "ustaz-hassan-abdullah" },
    { label: "Ustazah Aishah binti Yusof", value: "ustazah-aishah-yusof" },
    { label: "Ustaz Mohamed bin Khalid", value: "ustaz-mohamed-khalid" },
  ],
  "masjid-ar-rahman": [
    { label: "Ustaz Abdullah bin Omar", value: "ustaz-abdullah-omar" },
    {
      label: "Ustazah Khadijah binti Hassan",
      value: "ustazah-khadijah-hassan",
    },
    { label: "Ustaz Ali bin Ismail", value: "ustaz-ali-ismail" },
  ],
  "masjid-as-salam": [
    { label: "Ustaz Sulaiman bin Ahmad", value: "ustaz-sulaiman-ahmad" },
    {
      label: "Ustazah Safiyah binti Mohamed",
      value: "ustazah-safiyah-mohamed",
    },
    { label: "Ustaz Yusof bin Khalid", value: "ustaz-yusof-khalid" },
  ],
  "masjid-at-taqwa": [
    { label: "Ustaz Khalid bin Abdullah", value: "ustaz-khalid-abdullah" },
    { label: "Ustazah Aminah binti Omar", value: "ustazah-aminah-omar" },
    { label: "Ustaz Ismail bin Hassan", value: "ustaz-ismail-hassan" },
  ],
};

// ============================================================================
// COMPUTED PROPERTIES
// ============================================================================
// (Penilaian Awal removed)

const showLainLainSektor = computed(() => {
  return formData.value.sektor_pekerjaan === "Lain-lain";
});

const showLainLainSektorTanggungan = computed(() => {
  const currentTanggungan = getCurrentTanggungan();
  return currentTanggungan?.sektor_pekerjaan === "Lain-lain";
});

const showLainLainSebabTiadaAkaun = computed(() => {
  return formData.value.sebab_tiada_akaun === "lain-lain";
});

const showLainLainSebabTiadaAkaunTanggungan = computed(() => {
  const currentTanggungan = getCurrentTanggungan();
  return currentTanggungan?.sebab_tiada_akaun_tanggungan === "lain-lain";
});

const showLainLainSumberPendapatan = computed(() => {
  return (
    formData.value.sumber_pendapatan &&
    formData.value.sumber_pendapatan.includes("Lain-lain")
  );
});

const selectedBankSwiftCode = computed(() => {
  const selectedBank = bankOptions.find(
    (bank) => bank.value === formData.value.nama_bank
  );
  return selectedBank ? selectedBank.swiftCode : "";
});

// Add/remove multiple bank accounts and helper
const addBankAccount = () => {
  formData.value.bank_accounts.push({
    nama_bank: "",
    no_akaun_bank: "",
    nama_pemegang_akaun: "",
    jenis_akaun: "",
    id_pengenalan: "",
    nama_bersama: "",
    hubungan: "",
  });
};

const removeBankAccount = (index) => {
  formData.value.bank_accounts.splice(index, 1);
};

// Add/remove multiple pendapatan lain-lain entries
const addPendapatanLainLain = () => {
  formData.value.pendapatan_lain_lain.push({
    amount: "",
  });
};

const removePendapatanLainLain = (index) => {
  formData.value.pendapatan_lain_lain.splice(index, 1);
};

// Helper to get swift code for a given bank value
const getSwiftCodeForBank = (bankValue) => {
  const selectedBank = bankOptions.find((bank) => bank.value === bankValue);
  return selectedBank ? selectedBank.swiftCode : "";
};

const selectedBankSwiftCodeTanggungan = computed(() => {
  const selectedBank = bankOptions.find(
    (bank) => bank.value === formData.value.nama_bank_tanggungan
  );
  return selectedBank ? selectedBank.swiftCode : "";
});

const selectedDaerah = computed(() => {
  const daerah = daerahOptions.find(
    (d) => d.value === formData.value.addressInfo.daerah
  );
  return daerah ? daerah.label : "";
});

// Show doc info when certain keperluan are selected
const shouldShowDocInfo = computed(() => {
  const list = formData.value.keperluan_mendesak || [];
  const triggerValues = [
    "perubatan_kritikal",
    "bencana",
    "konflik_keluarga",
    "tiada_tempat_tinggal",
    "terputus_bekalan_makanan",
    "masih_ada_bekalan_makanan",
    "tiada_sumber_pendapatan",
    "pendapatan_berkurangan",
    "selain_dari_di_atas",
  ];
  return Array.isArray(list) && list.some((v) => triggerValues.includes(v));
});

// Check if perubatan kritikal is selected
const isPerubatanKritikal = computed(() => {
  const list = formData.value.keperluan_mendesak || [];
  return Array.isArray(list) && list.includes("perubatan_kritikal");
});

// Dokumen Sokongan table state
const dokumenSokonganRows = ref([
  { id: 1, jenis: "", keterangan: "", file: null },
]);

const jenisDokumenOptions = computed(() => {
  const baseOptions = [
    {
      label: "Pengesahan Pendapatan / Slip Gaji",
      value: "pengesahan_pendapatan",
    },
    { label: "Penyata KWSP", value: "penyata_kwsp" },
    { label: "Lain-lain", value: "lain" },
  ];

  if (isPerubatanKritikal.value) {
    return [
      {
        label: "Borang Pengesahan Kesihatan",
        value: "borang_pengesahan_kesihatan",
      },
      {
        label: "Pengesahan Pendapatan / Slip Gaji",
        value: "pengesahan_pendapatan",
      },
      {
        label: "Pengesahan Pegawai Dietetik/Rehab",
        value: "pengesahan_dietetik",
      },
      { label: "Penyata KWSP", value: "penyata_kwsp" },
      { label: "GL/Surat Kelulusan Sebelum Ini", value: "gl_surat_kelulusan" },
      { label: "Sebut Harga", value: "sebut_harga" },
      { label: "Lain-lain", value: "lain" },
    ];
  } else {
    return [
      ...baseOptions,
      { label: "Surat Temujanji Perubatan", value: "surat_temujanji" },
      { label: "Bil Utiliti", value: "bil_utiliti" },
      { label: "Bil/Resit Berkaitan", value: "bil_resit" },
      { label: "Surat Tuntutan Hutang", value: "surat_tuntutan" },
      {
        label: "Laporan Polis/Bomba/Pihak Berkuasa",
        value: "laporan_berkuasa",
      },
      { label: "Gambar Bukti Kejadian", value: "gambar_bukti" },
    ];
  }
});

function addDokumenRow() {
  const nextId = dokumenSokonganRows.value.length
    ? Math.max(...dokumenSokonganRows.value.map((r) => r.id)) + 1
    : 1;
  dokumenSokonganRows.value.push({
    id: nextId,
    jenis: "",
    keterangan: "",
    file: null,
  });
}

function removeDokumenRow() {
  if (dokumenSokonganRows.value.length > 1) {
    dokumenSokonganRows.value.pop();
  }
}

function onFileChange(index, event) {
  const files = event?.target?.files;
  dokumenSokonganRows.value[index].file = files && files[0] ? files[0] : null;
}

function getTemplateUrl(jenis) {
  // Map jenis to template URLs if available; return empty to disable when not available
  const map = {
    // Perubatan Kritikal templates
    borang_pengesahan_kesihatan: "",
    pengesahan_dietetik: "",
    gl_surat_kelulusan: "",
    sebut_harga: "",
    // Common templates
    pengesahan_pendapatan: "",
    penyata_kwsp: "",
    // Other cases templates
    surat_temujanji: "",
    bil_utiliti: "",
    bil_resit: "",
    surat_tuntutan: "",
    laporan_berkuasa: "",
    gambar_bukti: "",
  };
  return map[jenis] || "";
}

function downloadTemplate(jenis) {
  const url = getTemplateUrl(jenis);
  if (!url) return;
  window.open(url, "_blank");
}

const pakOfficersOptionsBantuan = computed(() => {
  const selectedKariah = formData.value.pengesahan.kariah_bantuan;
  return selectedKariah ? pakOfficersByKariah[selectedKariah] || [] : [];
});

const pakOfficersOptionsHubungan = computed(() => {
  const selectedKariah = formData.value.pengesahan.kariah_hubungan_pak;
  return selectedKariah ? pakOfficersByKariah[selectedKariah] || [] : [];
});

const pakOfficersOptionsBermastautin = computed(() => {
  const selectedKariah = formData.value.pengesahan.kariah_bermastautin;
  return selectedKariah ? pakOfficersByKariah[selectedKariah] || [] : [];
});

const uploadedDocuments = computed(() => {
  const documents = [];

  // Add sample document for demonstration
  if (formData.value.pengesahan.surat_pengesahan_bermastautin) {
    documents.push({
      name: "pengesahan_bermastautin.pdf",
      type: "application/pdf",
      size: "2.0 MB",
    });
  }

  return documents;
});

// Computed properties for tanggungan conditional fields
const showLainLainHubungan = computed(() => {
  const currentTanggungan = getCurrentTanggungan();
  return currentTanggungan?.hubungan_pemohon === "Lain-lain";
});
const showDokumenSuratNikah = computed(() => {
  const currentTanggungan = getCurrentTanggungan();
  return currentTanggungan?.hubungan_pemohon === "Pasangan Pemohon";
});

const showLainLainWarganegara = computed(() => {
  const currentTanggungan = getCurrentTanggungan();
  return currentTanggungan?.warganegara_tanggungan === "Lain-lain";
});

const showPassportFields = computed(() => {
  const currentTanggungan = getCurrentTanggungan();
  return (
    currentTanggungan?.warganegara_tanggungan === "Lain-lain" &&
    currentTanggungan?.jenis_pengenalan_tanggungan === "ForeignId"
  );
});

const showLainLainAgama = computed(() => {
  const currentTanggungan = getCurrentTanggungan();
  return currentTanggungan?.agama_tanggungan === "Lain-lain";
});

const showLainLainBangsa = computed(() => {
  const currentTanggungan = getCurrentTanggungan();
  return currentTanggungan?.bangsa_tanggungan === "Lain-lain";
});

const showLainLainStatusPerkahwinan = computed(() => {
  const currentTanggungan = getCurrentTanggungan();
  return currentTanggungan?.status_perkahwinan_tanggungan === "Lain-lain";
});

// Computed property to check if tanggungan is Muallaf
const isTanggunganMuallaf = computed(() => {
  const currentTanggungan = getCurrentTanggungan();
  return currentTanggungan?.adakah_muallaf_tanggungan === "Y";
});

// Computed property to check if passport is expired
const isPassportExpired = computed(() => {
  const currentTanggungan = getCurrentTanggungan();
  if (
    !currentTanggungan?.tarikh_tamat_pasport ||
    currentTanggungan?.warganegara_tanggungan === "Malaysia"
  ) {
    return false;
  }

  try {
    const expiryDate = new Date(currentTanggungan.tarikh_tamat_pasport);
    const today = new Date();
    return expiryDate < today;
  } catch (error) {
    return false;
  }
});

// Computed property to show passport expiry warning
const showPassportExpiryWarning = computed(() => {
  return isPassportExpired.value;
});

// Helper function to get Swift Code for current tanggungan
const getSelectedBankSwiftCodeTanggungan = () => {
  const currentTanggungan = getCurrentTanggungan();
  if (!currentTanggungan?.nama_bank_tanggungan) return "";
  const selectedBank = bankOptions.find(
    (bank) => bank.value === currentTanggungan.nama_bank_tanggungan
  );
  return selectedBank ? selectedBank.swiftCode : "";
};

// Computed property to validate Islamic dates for tanggungan
const islamicDatesValidationTanggungan = computed(() => {
  const currentTanggungan = getCurrentTanggungan();
  if (
    !currentTanggungan?.adakah_muallaf_tanggungan ||
    currentTanggungan.adakah_muallaf_tanggungan !== "Y"
  ) {
    return { isValid: true, message: "" };
  }

  const tarikhMasukIslam = currentTanggungan.tarikh_masuk_islam_tanggungan;
  const tarikhMasukKFAM = currentTanggungan.tarikh_masuk_kfam_tanggungan;

  if (tarikhMasukIslam && tarikhMasukKFAM) {
    try {
      const islamDate = new Date(tarikhMasukIslam);
      const kfamDate = new Date(tarikhMasukKFAM);

      if (kfamDate < islamDate) {
        return {
          isValid: false,
          message:
            "Tarikh Masuk KFAM tidak boleh lebih awal daripada Tarikh Masuk Islam",
        };
      }
    } catch (error) {
      console.error("Error validating Islamic dates:", error);
    }
  }

  return { isValid: true, message: "" };
});

// Computed property for calculating Tarikh Keluar Muallaf
const tarikhKeluarMuallaf = computed(() => {
  if (formData.value.adakah_muallaf !== "Y") {
    return "";
  }

  const tarikhMasukIslam = formData.value.tarikh_masuk_islam;
  const tarikhMasukKFAM = formData.value.tarikh_masuk_kfam;

  if (!tarikhMasukIslam && !tarikhMasukKFAM) {
    return "";
  }

  // Parse dates and add 5 years
  let tarikhMasukIslamPlus5 = null;
  let tarikhMasukKFAMPlus5 = null;

  if (tarikhMasukIslam) {
    const [day, month, year] = tarikhMasukIslam.split("/");
    if (day && month && year) {
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      // Validate that the date is not in the future
      if (date > new Date()) {
        return "";
      }
      date.setFullYear(date.getFullYear() + 5);
      tarikhMasukIslamPlus5 = date;
    }
  }

  if (tarikhMasukKFAM) {
    const [day, month, year] = tarikhMasukKFAM.split("/");
    if (day && month && year) {
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      // Validate that the date is not in the future
      if (date > new Date()) {
        return "";
      }
      date.setFullYear(date.getFullYear() + 5);
      tarikhMasukKFAMPlus5 = date;
    }
  }

  // Return the later date
  if (tarikhMasukIslamPlus5 && tarikhMasukKFAMPlus5) {
    const laterDate =
      tarikhMasukIslamPlus5 > tarikhMasukKFAMPlus5
        ? tarikhMasukIslamPlus5
        : tarikhMasukKFAMPlus5;
    return `${String(laterDate.getDate()).padStart(2, "0")}/${String(
      laterDate.getMonth() + 1
    ).padStart(2, "0")}/${laterDate.getFullYear()}`;
  } else if (tarikhMasukIslamPlus5) {
    return `${String(tarikhMasukIslamPlus5.getDate()).padStart(
      2,
      "0"
    )}/${String(tarikhMasukIslamPlus5.getMonth() + 1).padStart(
      2,
      "0"
    )}/${tarikhMasukIslamPlus5.getFullYear()}`;
  } else if (tarikhMasukKFAMPlus5) {
    return `${String(tarikhMasukKFAMPlus5.getDate()).padStart(2, "0")}/${String(
      tarikhMasukKFAMPlus5.getMonth() + 1
    ).padStart(2, "0")}/${tarikhMasukKFAMPlus5.getFullYear()}`;
  }

  return "";
});

// Computed property for validating Islamic dates
const islamicDatesValidation = computed(() => {
  if (formData.value.adakah_muallaf !== "Y") {
    return { isValid: true, message: "" };
  }

  const tarikhMasukIslam = formData.value.tarikh_masuk_islam;
  const tarikhMasukKFAM = formData.value.tarikh_masuk_kfam;

  if (tarikhMasukIslam && tarikhMasukKFAM) {
    const [day1, month1, year1] = tarikhMasukIslam.split("/");
    const [day2, month2, year2] = tarikhMasukKFAM.split("/");

    if (day1 && month1 && year1 && day2 && month2 && year2) {
      const islamDate = new Date(
        parseInt(year1),
        parseInt(month1) - 1,
        parseInt(day1)
      );
      const kfamDate = new Date(
        parseInt(year2),
        parseInt(month2) - 1,
        parseInt(day2)
      );

      if (kfamDate < islamDate) {
        return {
          isValid: false,
          message:
            "Tarikh Masuk KFAM tidak boleh lebih awal daripada Tarikh Masuk Islam",
        };
      }
    }
  }

  return { isValid: true, message: "" };
});

// ============================================================================
// WATCHERS
// ============================================================================
// Auto-populate applicant birth date from MyKad
watch(
  () => formData.value.no_pengenalan,
  (newVal) => {
    if (
      newVal &&
      !isInitializingMockData.value &&
      formData.value.jenis_id === "mykad"
    ) {
      if (newVal.length === 12 && /^\d{12}$/.test(newVal)) {
        const year = newVal.substring(0, 2);
        const month = newVal.substring(2, 4);
        const day = newVal.substring(4, 6);

        const century = parseInt(year) <= 29 ? "20" : "19";
        const fullYear = century + year;

        const birthDate = `${fullYear}-${month}-${day}`;
        formData.value.tarikh_lahir = birthDate;
      }
    }
  }
);

watch(
  () => formData.value.tarikh_lahir,
  (newVal) => {
    if (newVal) {
      formData.value.umur = calculateAge(newVal);
    } else {
      formData.value.umur = "";
    }
  },
  { immediate: true }
);

// Watch for kategori sekolah changes to clear nama sekolah selection
watch(
  () => formData.value.education_entries,
  (newEntries) => {
    if (!newEntries) return;
    newEntries.forEach((entry, index) => {
      // Watch each entry's kategori_sekolah
      watch(
        () => entry.kategori_sekolah,
        (newKategori, oldKategori) => {
          if (newKategori !== oldKategori && entry.nama_sekolah) {
            // Clear nama sekolah when kategori changes
            entry.nama_sekolah = "";
            entry.alamat_sekolah_1 = "";
            entry.alamat_sekolah_2 = "";
            entry.alamat_sekolah_3 = "";
            entry.daerah_sekolah = "";
            entry.bandar_sekolah = "";
            entry.poskod_sekolah = "";
          }
        },
        { deep: true }
      );
    });
  },
  { deep: true }
);

watch(
  () => formData.value.nama_bank,
  (newVal) => {
    if (newVal) {
      const selectedBank = bankOptions.find((bank) => bank.value === newVal);
      if (selectedBank) {
        formData.value.swift_code = selectedBank.swiftCode;
      }
    } else {
      formData.value.swift_code = "";
    }
  }
);

// Ensure at least one bank account entry when method is 'ya'
watch(
  () => formData.value.ada_akaun_bank,
  (method) => {
    if (method === "Y" && formData.value.bank_accounts.length === 0) {
      addBankAccount();
    }
  },
  { immediate: true }
);

// Ensure all existing tanggungan bank accounts have pengenalan_ids field
watch(
  () => tanggunganList.value,
  (tanggunganList) => {
    if (tanggunganList) {
      tanggunganList.forEach((tanggungan) => {
        if (tanggungan.bank_accounts) {
          tanggungan.bank_accounts.forEach((account) => {
            if (!account.pengenalan_ids) {
              account.pengenalan_ids = [];
            }
          });
        }
      });
    }
  },
  { deep: true, immediate: true }
);

// Keep legacy string `tempoh_menetap_selangor` in sync with split inputs
watch(
  () => [
    formData.value.addressInfo.tempoh_menetap_selangor_nilai,
    formData.value.addressInfo.tempoh_menetap_selangor_unit,
  ],
  ([nilai, unit]) => {
    if (nilai !== undefined && unit) {
      formData.value.addressInfo.tempoh_menetap_selangor = String(nilai);
    } else {
      formData.value.addressInfo.tempoh_menetap_selangor = "";
    }
  }
);

// Keep legacy string `tempoh_menetap_selangor_tanggungan` in sync with split inputs for all tanggungan
watch(
  () => formData.value.tanggungan,
  (tanggunganList) => {
    if (tanggunganList) {
      tanggunganList.forEach((tanggungan) => {
        if (
          tanggungan.tempoh_menetap_selangor_tanggungan_nilai !== undefined &&
          tanggungan.tempoh_menetap_selangor_tanggungan_unit
        ) {
          tanggungan.tempoh_menetap_selangor_tanggungan = String(
            tanggungan.tempoh_menetap_selangor_tanggungan_nilai
          );
        } else {
          tanggungan.tempoh_menetap_selangor_tanggungan = "";
        }
      });
    }
  },
  { deep: true }
);

// Seed one education entry when masih_bersekolah === 'Y'
watch(
  () => formData.value.masih_bersekolah,
  (val) => {
    if (val === "Y" && formData.value.education_entries.length === 0) {
      addEducationEntry();
    }
  },
  { immediate: true }
);

watch(
  () => formData.value.nama_bank_tanggungan,
  (newVal) => {
    if (newVal) {
      const selectedBank = bankOptions.find((bank) => bank.value === newVal);
      if (selectedBank) {
        formData.value.swift_code_tanggungan = selectedBank.swiftCode;
      }
    } else {
      formData.value.swift_code_tanggungan = "";
    }
  }
);

// Watch for employment status changes to handle conditional validation
watch(
  () => formData.value.status_pekerjaan,
  (newVal) => {
    if (newVal === "tidak_bekerja") {
      // Clear employment-related fields when not working
      formData.value.jenis_pekerjaan = "";
      formData.value.sektor_pekerjaan = "";
      formData.value.lain_lain_sektor = "";
      formData.value.no_telefon_pejabat = "";
      formData.value.nama_majikan = "";
      formData.value.no_telefon_majikan = "";
      formData.value.alamat_majikan_1 = "";
      formData.value.alamat_majikan_2 = "";
      formData.value.alamat_majikan_3 = "";
      formData.value.bandar_majikan = "";
      formData.value.poskod_majikan = "";
      formData.value.daerah_majikan = "";
      formData.value.negeri_majikan = "";
      formData.value.negara_majikan = "";
      formData.value.jawatan = "";
      formData.value.status_jawatan = "";
      formData.value.pendapatan_kasar = "";
      formData.value.pengesahan_pendapatan = [];
      formData.value.sumber_pendapatan = [];

      // Watch for tanggungan birth date changes to auto-populate age
      watch(
        () => getCurrentTanggungan()?.tarikh_lahir_tanggungan,
        (newVal) => {
          if (newVal && !isInitializingMockData.value) {
            const currentTanggungan = getCurrentTanggungan();
            if (currentTanggungan && !currentTanggungan.umur_tanggungan) {
              // Only calculate age if it's not already set (for mock data)
              currentTanggungan.umur_tanggungan = calculateAge(newVal);
            }
          }
        }
      );

      // Watch for tanggungan MyKad changes to auto-populate birth date for Malaysians
      watch(
        () => getCurrentTanggungan()?.pengenalan_id_tanggungan,
        (newVal) => {
          if (
            newVal &&
            !isInitializingMockData.value &&
            getCurrentTanggungan()?.jenis_pengenalan_tanggungan === "MyKad" &&
            getCurrentTanggungan()?.warganegara_tanggungan === "Malaysia"
          ) {
            const currentTanggungan = getCurrentTanggungan();
            if (newVal.length === 12 && /^\d{12}$/.test(newVal)) {
              // Extract birth date from MyKad (format: YYMMDD)
              const year = newVal.substring(0, 2);
              const month = newVal.substring(2, 4);
              const day = newVal.substring(4, 6);

              // Determine century (00-29 = 2000s, 30-99 = 1900s)
              const century = parseInt(year) <= 29 ? "20" : "19";
              const fullYear = century + year;

              // Format as YYYY-MM-DD for date input
              const birthDate = `${fullYear}-${month}-${day}`;
              currentTanggungan.tarikh_lahir_tanggungan = birthDate;
              // Only calculate age if it's not already set (for mock data)
              if (!currentTanggungan.umur_tanggungan) {
                currentTanggungan.umur_tanggungan = calculateAge(birthDate);
              }
            }
          }
        }
      );

      // Watch for tanggungan Islamic dates changes to auto-calculate Tarikh Keluar Muallaf
      watch(
        () => [
          getCurrentTanggungan()?.adakah_muallaf_tanggungan,
          getCurrentTanggungan()?.tarikh_masuk_islam_tanggungan,
          getCurrentTanggungan()?.tarikh_masuk_kfam_tanggungan,
        ],
        () => {
          const currentTanggungan = getCurrentTanggungan();
          if (currentTanggungan?.adakah_muallaf_tanggungan === "Y") {
            currentTanggungan.tarikh_keluar_muallaf_tanggungan =
              calculateTarikhKeluarMuallafTanggungan();
          }
        },
        { deep: true }
      );

      // Watch mohon_ketua_keluarga for adults to auto-set situasi & kelulusan
      watch(
        () => [
          getCurrentTanggungan()?.mohon_ketua_keluarga,
          getCurrentTanggungan()?.tarikh_lahir_tanggungan,
        ],
        () => {
          const currentTanggungan = getCurrentTanggungan();
          if (!currentTanggungan) return;

          const age = parseInt(
            calculateAge(currentTanggungan.tarikh_lahir_tanggungan)
          );
          if (Number.isFinite(age) && age < 18) {
            if (currentTanggungan.mohon_ketua_keluarga) {
              currentTanggungan.situasi_kelulusan_khas = "Profiling";
              currentTanggungan.kelulusan_khas = "Y";
            } else {
              currentTanggungan.kelulusan_khas = "N";
              currentTanggungan.situasi_kelulusan_khas = "";
            }
          }
        },
        { deep: true }
      );

      // Watch for bank selection to auto-populate Swift Code
      watch(
        () => getCurrentTanggungan()?.nama_bank_tanggungan,
        (newBankName) => {
          const currentTanggungan = getCurrentTanggungan();
          if (currentTanggungan && newBankName) {
            const selectedBank = bankOptions.find(
              (bank) => bank.value === newBankName
            );
            if (selectedBank) {
              currentTanggungan.swift_code_tanggungan = selectedBank.swiftCode;
            }
          }
        },
        { deep: true }
      );
      formData.value.lain_lain_sumber_pendapatan = "";
    }
  }
);

// Watch for Islamic dates changes to automatically calculate Tarikh Keluar Muallaf
watch(
  [
    () => formData.value.tarikh_masuk_islam,
    () => formData.value.tarikh_masuk_kfam,
  ],
  () => {
    if (formData.value.adakah_muallaf === "Y") {
      formData.value.tarikh_keluar_muallaf = tarikhKeluarMuallaf.value;
    }
  }
);

// Watch for muallaf status changes to clear Islamic fields when not muallaf
watch(
  () => formData.value.adakah_muallaf,
  (newVal) => {
    if (newVal === "T") {
      // Clear all Islamic fields when not muallaf
      formData.value.tarikh_masuk_islam = "";
      formData.value.tarikh_masuk_kfam = "";
      formData.value.nama_selepas_islam = "";
      formData.value.nama_sebelum_islam = "";
      formData.value.tarikh_keluar_muallaf = "";
      formData.value.dokumen_pengislaman = null;
    }
  }
);

// ============================================================================
// STEP NAVIGATION FUNCTIONS
// ============================================================================
const nextStepA = () => {
  if (currentStepA.value < totalStepsA) {
    currentStepA.value++;
  } else if (currentStepA.value === totalStepsA) {
    // When Section A is complete, move to Section B
    nextSection();
  }
};

const prevStepA = () => {
  if (currentStepA.value > 1) {
    currentStepA.value--;
  }
};

const nextStepB = () => {
  // Save current tanggungan data before moving to next step
  if (getCurrentTanggungan()) {
    const currentTanggungan = getCurrentTanggungan();
    // Update the tanggunganList with current form data
    tanggunganList.value[currentTanggunganIndex.value] = {
      ...currentTanggungan,
    };
    formData.value.tanggungan = tanggunganList.value;
  }

  // Get the next step, skipping kemahiran if age < 19
  let nextStep = currentStepB.value + 1;
  const currentTanggungan = getCurrentTanggungan();

  if (currentTanggungan) {
    const age = parseInt(
      currentTanggungan.umur_tanggungan ||
        calculateAge(currentTanggungan.tarikh_lahir_tanggungan)
    );

    // Skip kemahiran step (id: 6) if age is less than 19
    if (age < 19 && nextStep === 6) {
      nextStep = 7; // Skip to Pekerjaan step
    }
  }

  if (nextStep <= totalStepsB) {
    currentStepB.value = nextStep;
  } else {
    // All steps completed, submit form
    submitForm();
  }
};

const prevStepB = () => {
  // If already at first step of Section B, go back to Section A
  if (currentStepB.value === 1) {
    prevSection();
    return;
  }

  if (currentStepB.value > 1) {
    let prevStep = currentStepB.value - 1;
    const currentTanggungan = getCurrentTanggungan();

    if (currentTanggungan) {
      const age = parseInt(
        currentTanggungan.umur_tanggungan ||
          calculateAge(currentTanggungan.tarikh_lahir_tanggungan)
      );

      // Skip kemahiran step (id: 6) if age is less than 19
      if (age < 19 && prevStep === 6) {
        prevStep = 5; // Skip to Kesihatan step
      }
    }

    currentStepB.value = prevStep;
  }
};

const nextSection = () => {
  currentSection.value = 2;
};

const prevSection = () => {
  currentSection.value = 1;
};

const goToPeribadi = () => {
  currentStepB.value = 1;
};

// ============================================================================
// TANGGUNGAN MANAGEMENT FUNCTIONS
// ============================================================================
const addTanggungan = (showNotification = true) => {
  // Prevent adding more than 3 tanggungan
  if (tanggunganList.value.length >= 3) {
    toast.error("Maksimum 3 tanggungan sahaja dibenarkan");
    return;
  }

  const newTanggungan = {
    id: Date.now(), // Unique ID for each tanggungan

    // Step 1: Maklumat Peribadi Tanggungan
    hubungan_pemohon: "",
    lain_lain_hubungan: "",
    nama_tanggungan: "",
    jenis_pengenalan_tanggungan: "",
    pengenalan_id_tanggungan: "",
    warganegara_tanggungan: "",
    lain_lain_warganegara: "",
    no_pasport_lama: "",
    taraf_penduduk_tetap: "",
    no_pasport: "",
    tarikh_mula_pasport: "",
    tarikh_tamat_pasport: "",
    tarikh_lahir_tanggungan: "",
    umur_tanggungan: "",
    mohon_ketua_keluarga: false,
    tempat_lahir_tanggungan: "",
    jantina_tanggungan: "",
    agama_tanggungan: "",
    lain_lain_agama: "",
    bangsa_tanggungan: "",
    lain_lain_bangsa: "",
    no_telefon_bimbit_tanggungan: "",
    no_telefon_rumah_tanggungan: "",
    emel_tanggungan: "",
    tempoh_menetap_selangor_tanggungan: "",
    tempoh_menetap_selangor_tanggungan_nilai: "",
    tempoh_menetap_selangor_tanggungan_unit: "",
    status_perkahwinan_tanggungan: "",
    lain_lain_status_perkahwinan: "",
    jumlah_tanggungan: "",

    // Special Approval for Minors
    situasi_kelulusan_khas: "",
    kelulusan_khas: "",

    // Legacy fields for backward compatibility
    jenis_id_tanggungan: "",
    no_pengenalan_tanggungan: "",
    tempoh_menetap_selangor: "",
    no_telefon_tanggungan: "",

    // Islamic Information (for Step 2)
    adakah_muallaf_tanggungan: "",
    nama_sebelum_islam_tanggungan: "",
    tarikh_masuk_islam_tanggungan: "",
    tarikh_masuk_kfam_tanggungan: "",
    nama_selepas_islam_tanggungan: "",
    tarikh_keluar_muallaf_tanggungan: "",
    dokumen_pengislaman_tanggungan: null,

    // Step 2: Maklumat Perbankan Tanggungan
    nama_bank_tanggungan: "",
    swift_code_tanggungan: "",
    no_akaun_bank_tanggungan: "",
    nama_pemegang_akaun_tanggungan: "",
    ada_akaun_bank_tanggungan: "",
    sebab_tiada_akaun_tanggungan: "",
    lain_lain_sebab_tiada_akaun_tanggungan: "",
    // Multiple bank accounts for tanggungan (new)
    bank_accounts: [],

    // Step 3: Maklumat Pendidikan Tanggungan
    masih_bersekolah: "",
    bersekolah_tanggungan: "",
    pendidikan_tertinggi_tanggungan: "",
    lain_pendidikan_tertinggi_tanggungan: "",
    tahap_pendidikan_dicapai: [],
    lain_tahap_pendidikan_dicapai: "",
    sijil_pendidikan_tanggungan: null,
    jenis_sekolah_institusi: "",
    kategori_sekolah_institusi: "",
    tahun_bersekolah: "",
    tahun_tingkatan_pengajian: "",
    nama_sekolah_institusi: "",
    alamat1_sekolah: "",
    alamat2_sekolah: "",
    alamat3_sekolah: "",
    daerah_sekolah: "",
    bandar_sekolah: "",
    poskod_sekolah: "",
    tinggal_bersama_keluarga: "",
    asrama_rumah_sewa: "",
    nama_baitul: "",
    bidang_kursus_pengajian: "",
    jurusan_bidang: "",
    pembiayaan_pengajian: [],
    lain_pembiayaan_pengajian: "",
    catatan_pendidikan_tanggungan: "",
    // Multiple education entries for tanggungan (new)
    education_entries: [],
    // Legacy fields for backward compatibility
    jenis_sekolah: "",
    nama_sekolah: "",
    alamat_sekolah: "",
    negeri_sekolah: "",
    nama_sekolah_agama: "",
    alamat_sekolah_agama: "",
    daerah_sekolah_agama: "",
    negeri_sekolah_agama: "",
    poskod_sekolah_agama: "",

    // Step 4: Maklumat Kesihatan Tanggungan
    tahap_kesihatan_tanggungan: "",
    keadaan_kesihatan_sakit_tanggungan: "",
    kos_penjagaan_sakit_tanggungan: "",
    perbelanjaan_bulanan_sakit_tanggungan: "",
    kesempurnaan_fizikal_tanggungan: "",
    sebab_kecacatan_tanggungan: "",
    tahap_kecacatan_tanggungan: "",
    perbelanjaan_bulanan_oku_tanggungan: "",
    keadaan_kesihatan_uzur_tanggungan: "",
    kos_penjagaan_uzur_tanggungan: "",
    perbelanjaan_bulanan_uzur_tanggungan: "",
    // Dokumen Sokongan Kesihatan
    dokumen_sakit_kronik_tanggungan: null,
    dokumen_oku_tanggungan: null,
    dokumen_uzur_tanggungan: null,

    // Step 5: Kemahiran Tanggungan
    kemahiran_tanggungan: "",

    // Step 6: Maklumat Pekerjaan Tanggungan
    pekerjaan_status: "",

    // Sumber Pendapatan
    sumber_pendapatan: [],
    lain_lain_sumber_pendapatan: "",

    // Butiran Pekerjaan
    jenis_pekerjaan: "",
    sektor_pekerjaan: "",
    lain_lain_sektor_pekerjaan: "",
    jawatan: "",
    status_jawatan: "",
    pendapatan_kasar: "",
    pengesahan_pendapatan: null,

    // Maklumat Majikan
    no_telefon_pejabat: "",
    nama_majikan: "",
    no_tel_majikan: "",
    alamat_majikan_1: "",
    alamat_majikan_2: "",
    alamat_majikan_3: "",
    bandar_majikan: "",
    poskod_majikan: "",
    daerah_majikan: "",
    negeri_majikan: "",
    negara_majikan: "",

    // Jawatan & Status
    jawatan: "",
    status_jawatan: "",

    // Pendapatan
    pendapatan_kasar: "",
    dokumen_pendapatan: null,
  };

  tanggunganList.value.push(newTanggungan);
  currentTanggunganIndex.value = tanggunganList.value.length - 1;
  currentStepB.value = 1;

  // Update formData.tanggungan array
  formData.value.tanggungan = tanggunganList.value;

  // Log to console for debugging
  console.log(
    `Tanggungan ${tanggunganList.value.length} ditambah:`,
    newTanggungan
  );
  console.log("Total tanggungan sekarang:", tanggunganList.value.length);

  // Only show notification if requested
  if (showNotification) {
    toast.success(`Tanggungan ${tanggunganList.value.length} berjaya ditambah`);
  }
};

const selectTanggungan = (index) => {
  // Save current tanggungan data before switching
  if (getCurrentTanggungan()) {
    const currentTanggungan = getCurrentTanggungan();
    tanggunganList.value[currentTanggunganIndex.value] = {
      ...currentTanggungan,
    };
    formData.value.tanggungan = tanggunganList.value;
    console.log(
      "Saved data for Tanggungan",
      currentTanggunganIndex.value + 1,
      "before switching"
    );
  }

  currentTanggunganIndex.value = index;
  currentStepB.value = 1;

  // Debug: Log the selected tanggungan data
  const selectedTanggungan = getCurrentTanggungan();
  console.log("Selected Tanggungan:", selectedTanggungan);
  console.log("Selected Tanggungan Name:", selectedTanggungan?.nama_tanggungan);
  console.log(
    "Selected Tanggungan Relationship:",
    selectedTanggungan?.hubungan_pemohon
  );
  console.log("Selected Tanggungan Age:", selectedTanggungan?.umur_tanggungan);
  console.log(
    "Selected Tanggungan Birth Date:",
    selectedTanggungan?.tarikh_lahir_tanggungan
  );
};

// Helper functions for simplified interface
const isTanggunganComplete = (tanggungan) => {
  return (
    tanggungan.nama_tanggungan &&
    tanggungan.hubungan_pemohon &&
    tanggungan.jenis_id_tanggungan &&
    tanggungan.jantina_tanggungan &&
    tanggungan.tarikh_lahir_tanggungan
  );
};

const getCompletedCount = () => {
  return tanggunganList.value.filter((t) => isTanggunganComplete(t)).length;
};

const getIncompleteCount = () => {
  return tanggunganList.value.filter((t) => !isTanggunganComplete(t)).length;
};

const getCurrentTanggungan = () => {
  if (tanggunganList.value.length === 0) {
    // Initialize with first tanggungan if none exists
    addTanggungan(false); // Don't show notification during initialization
  }
  return tanggunganList.value[currentTanggunganIndex.value];
};

// Helper function to calculate age from birth date
const calculateAge = (birthDate) => {
  if (!birthDate) return "";

  try {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age.toString();
  } catch (error) {
    return "";
  }
};

// Helper function to calculate total tanggungan
const calculateTotalTanggungan = () => {
  if (tanggunganList.value.length === 0) return "0";

  // Count active tanggungan (excluding those with expired passports)
  let activeCount = 0;

  tanggunganList.value.forEach((tanggungan) => {
    if (tanggungan.warganegara_tanggungan === "Malaysia") {
      activeCount++;
    } else {
      // Check if passport is expired for non-Malaysians
      if (tanggungan.tarikh_tamat_pasport) {
        try {
          const expiryDate = new Date(tanggungan.tarikh_tamat_pasport);
          const today = new Date();
          if (expiryDate > today) {
            activeCount++;
          }
        } catch (error) {
          // If date parsing fails, count as active
          activeCount++;
        }
      } else {
        activeCount++;
      }
    }
  });

  return activeCount.toString();
};

// Helper function to calculate Tarikh Keluar Muallaf for tanggungan
const calculateTarikhKeluarMuallafTanggungan = () => {
  const currentTanggungan = getCurrentTanggungan();
  if (
    !currentTanggungan?.adakah_muallaf_tanggungan ||
    currentTanggungan.adakah_muallaf_tanggungan !== "Y"
  ) {
    return "";
  }

  const tarikhMasukIslam = currentTanggungan.tarikh_masuk_islam_tanggungan;
  const tarikhMasukKFAM = currentTanggungan.tarikh_masuk_kfam_tanggungan;

  if (!tarikhMasukIslam && !tarikhMasukKFAM) {
    return "";
  }

  // Parse dates and add 5 years
  let tarikhMasukIslamPlus5 = null;
  let tarikhMasukKFAMPlus5 = null;

  if (tarikhMasukIslam) {
    try {
      const date = new Date(tarikhMasukIslam);
      // Validate that the date is not in the future
      if (date > new Date()) {
        return "";
      }
      date.setFullYear(date.getFullYear() + 5);
      tarikhMasukIslamPlus5 = date;
    } catch (error) {
      console.error("Error parsing tarikh masuk Islam:", error);
    }
  }

  if (tarikhMasukKFAM) {
    try {
      const date = new Date(tarikhMasukKFAM);
      // Validate that the date is not in the future
      if (date > new Date()) {
        return "";
      }
      date.setFullYear(date.getFullYear() + 5);
      tarikhMasukKFAMPlus5 = date;
    } catch (error) {
      console.error("Error parsing tarikh masuk KFAM:", error);
    }
  }

  // Return the later date (more recent)
  if (tarikhMasukIslamPlus5 && tarikhMasukKFAMPlus5) {
    const laterDate =
      tarikhMasukIslamPlus5 > tarikhMasukKFAMPlus5
        ? tarikhMasukIslamPlus5
        : tarikhMasukKFAMPlus5;
    return laterDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD
  } else if (tarikhMasukIslamPlus5) {
    return tarikhMasukIslamPlus5.toISOString().split("T")[0];
  } else if (tarikhMasukKFAMPlus5) {
    return tarikhMasukKFAMPlus5.toISOString().split("T")[0];
  }

  return "";
};

// Flag to prevent watchers from running during mock data initialization
const isInitializingMockData = ref(true);

// Initialize with 3 tanggungan by default on component mount
onMounted(() => {
  // Initialize mock data for Section A - Maklumat Peribadi
  formData.value = {
    ...formData.value,
    // Mock data for Maklumat Peribadi
    jenis_id: "mykad",
    dokumen_id: "mykad.pdf",
    no_pengenalan: "770319035991",
    nama: "Adnan bin Abu",
    warganegara: "Malaysia",
    tarikh_lahir: "1977-03-19",
    umur: "48",
    tempat_lahir: "Kelantan",
    jantina: "Lelaki",
    agama: "Islam",
    bangsa: "Melayu",
    no_telefon_bimbit: "0191105544",
    emel: "adnan.abu@gmail.com",
    status_perkahwinan: "Berkahwin",
    status_poligami: "tidak",

    // Mock data for Maklumat Pendidikan
    masih_bersekolah: "T",
    pendidikan_tertinggi: "Peringkat Rendah",
    tahap_pendidikan: ["Peringkat Rendah"],

    // Mock data for Maklumat Islam
    adakah_muallaf: "T",

    // Mock data for Maklumat Perbankan
    ada_akaun_bank: "Y",
    bank_accounts: [
      {
        nama_bank: "bank-islam",
        no_akaun_bank: "3063020371170",
        nama_pemegang_akaun: "adnan bin abu",
        jenis_akaun: "individu",
        id_pengenalan: "801004035672",
        nama_bersama: "",
        hubungan: "",
      },
    ],

    // Mock data for Maklumat Kesihatan
    tahap_kesihatan: "Sihat",

    // Mock data for Maklumat Kemahiran
    kemahiran: ["Perniagaan"],

    // Mock data for Maklumat Pekerjaan
    status_pekerjaan: "bekerja",
    jenis_pekerjaan: "Berniaga",
    sektor_pekerjaan: "Kerja Sendiri",
    // lain_lain_sektor: "",
    // no_telefon_pejabat: "038881234",
    // nama_majikan: "Syarikat Pengangkutan Maju Sdn Bhd",
    // no_telefon_majikan: "038881234",
    // alamat_majikan_1: "Lot 123, Kawasan Perindustrian Bangi",
    // alamat_majikan_2: "Seksyen 15, Bandar Baru Bangi",
    // alamat_majikan_3: "",
    // bandar_majikan: "Bangi",
    // poskod_majikan: "43000",
    // daerah_majikan: "Hulu Langat",
    // negeri_majikan: "Selangor",
    // negara_majikan: "Malaysia",
    // jawatan: "Pemandu Lori",
    // status_jawatan: "Tetap",
    pendapatan_kasar: "1000.00",
    pengesahan_pendapatan: [],
    sumber_pendapatan: ["Lain-lain"],
    lain_lain_sumber_pendapatan: "Perniagaan",

    // Mock data for Maklumat Pendapatan & Perbelanjaan
    gaji_elaun_pendapatan: "1000.00",
    pendapatan_isteri_suami_ibubapa_penjaga: "0.00",
    pencen_perkeso: "0.00",
    sumbangan_anak_anak: "0.00",
    bantuan_jkm: "0.00",
    takaful: "0.00",
    sewa_rumah_tanah_kedai: "0.00",
    pendapatan_tanggungan_serumah: "0.00",
    pendapatan_lain_lain: [{ amount: "300.00" }],
    perbelanjaan_makanan_minuman: "500.00",
    sewa_bayaran_pinjaman_perumahan: "0.00",
    perbelanjaan_persekolahan_anak: "100.00",
    pengangkutan_tambang_bas_sekolah: "50.00",
    bil_utiliti: "100.00",

    // Mock data for Maklumat Pinjaman Harta
    // nama_institusi_pemberi_pinjaman: "Bank Islam Malaysia Berhad",
    // jenis_pinjaman: "Pinjaman Peribadi",
    // amaun_bayaran_bulanan: "500.00",
    // jumlah_keseluruhan_perbelanjaan: "15000.00",
    // tahun_mula_pinjaman: "2023-01-01",
    // tahun_akhir_pinjaman: "2025-12-31",
    // dokumen_perjanjian_pinjaman: null,

    // Mock data for Maklumat Tempat Tinggal
    addressInfo: {
      ...formData.value.addressInfo,
      alamat1: "32,jalan4/7a",
      alamat2: "bandar baru bangi",
      negeri: "selangor",
      daerah: "hulu-langat",
      bandar: "kajang",
      poskod: "43000",
      kariah: "kariah masjid al hidayah",
      geolokasi: "lokasi semasa",
      tempoh_menetap_selangor: "28",
      status_kediaman: "Milik Sendiri Tidak Berbayar",
      keadaan_kediaman: "Baik",
    },

    // Mock data for Maklumat Pendapatan & Perbelanjaan
  };

  if (tanggunganList.value.length === 0) {
    // Add 3 tanggungan by default with mock data
    addTanggungan(false); // First tanggungan
    addTanggungan(false); // Second tanggungan
    addTanggungan(false); // Third tanggungan

    // Set mock data for the 3 tanggungan
    if (tanggunganList.value.length === 3) {
      // First Tanggungan - Pasangan Pemohon
      tanggunganList.value[0] = {
        ...tanggunganList.value[0],
        hubungan_pemohon: "Pasangan Pemohon",
        nama_tanggungan: "ROHANA BINTI AHMAD",
        dokumen_surat_nikah: "test.pdf",
        jenis_pengenalan_tanggungan: "MyKad",
        pengenalan_id_tanggungan: "801004035672",
        warganegara_tanggungan: "Malaysia",
        taraf_penduduk_tetap: "Y",
        tarikh_lahir_tanggungan: "1980-10-04",
        umur_tanggungan: "43",
        tempat_lahir_tanggungan: "Kelantan",
        jantina_tanggungan: "Perempuan",
        agama_tanggungan: "Islam",
        bangsa_tanggungan: "Melayu",
        no_telefon_bimbit_tanggungan: "0138202398",
        no_telefon_rumah_tanggungan: "038881234",
        emel_tanggungan: "rohana@email.com",
        tempoh_menetap_selangor_tanggungan: "20",
        tempoh_menetap_selangor_tanggungan_nilai: "20",
        tempoh_menetap_selangor_tanggungan_unit: "tahun",
        status_perkahwinan_tanggungan: "Berkahwin",

        // Special Approval for Minors
        situasi_kelulusan_khas: "Profiling",
        kelulusan_khas: "Y",

        // Legacy fields for backward compatibility
        jenis_id_tanggungan: "MyKad",
        no_pengenalan_tanggungan: "801004035672",
        tempoh_menetap_selangor: "20",
        no_telefon_tanggungan: "0138202398",

        // Islamic Information
        adakah_muallaf_tanggungan: "N",
        nama_sebelum_islam_tanggungan: "ROHANA BINTI WONG",
        tarikh_masuk_islam_tanggungan: "1995-01-01",
        tarikh_masuk_kfam_tanggungan: "1995-01-01",
        nama_selepas_islam_tanggungan: "ROHANA BINTI AHMAD",
        tarikh_keluar_muallaf_tanggungan: "2000-01-01",
        dokumen_pengislaman_tanggungan: null,

        // Maklumat Perbankan Tanggungan
        nama_bank_tanggungan: "maybank",
        swift_code_tanggungan: "MBBEMYKL",
        no_akaun_bank_tanggungan: "1234567890",
        nama_pemegang_akaun_tanggungan: "ROHANA BINTI AHMAD",
        kaedah_pembayaran_tanggungan: "akaun",
        sebab_tiada_akaun_tanggungan: "",

        // Pendidikan Tanggungan
        masih_bersekolah: "T",
        bersekolah_tanggungan: "Tidak",
        pendidikan_tertinggi_tanggungan: "Diploma",
        lain_pendidikan_tertinggi_tanggungan: "",
        tahap_pendidikan_dicapai: ["SPM", "Sijil", "Diploma"],
        lain_tahap_pendidikan_dicapai: "",
        sijil_pendidikan_tanggungan: null,
        jenis_sekolah_institusi: "SMK",
        kategori_sekolah_institusi: "SEK.MEN",
        tahun_bersekolah: "2020",
        tahun_tingkatan_pengajian: "Tingkatan 5",
        nama_sekolah_institusi: "SMK Kuala Lumpur",
        alamat1_sekolah: "Jalan Sultan, Kuala Lumpur",
        alamat2_sekolah: "",
        alamat3_sekolah: "",
        daerah_sekolah: "Kuala Lumpur",
        bandar_sekolah: "Kuala Lumpur",
        poskod_sekolah: "50000",
        tinggal_bersama_keluarga: "Y",
        asrama_rumah_sewa: "",
        bidang_kursus_pengajian: "Diploma",
        jurusan_bidang: "Pengurusan Perniagaan",
        pembiayaan_pengajian: ["PTPTN"],
        lain_pembiayaan_pengajian: "",
        catatan_pendidikan_tanggungan: "Tamat pengajian pada tahun 2020",
        // Legacy fields for backward compatibility
        jenis_sekolah: "Sekolah Menengah",
        nama_sekolah: "SMK Kuala Lumpur",
        alamat_sekolah: "Jalan Sultan, Kuala Lumpur",
        negeri_sekolah: "Kuala Lumpur",
        nama_sekolah_agama: "Sekolah Agama Kuala Lumpur",
        alamat_sekolah_agama: "Jalan Agama, Kuala Lumpur",
        daerah_sekolah_agama: "Kuala Lumpur",
        negeri_sekolah_agama: "Kuala Lumpur",
        poskod_sekolah_agama: "50000",

        // Maklumat Kesihatan Tanggungan
        tahap_kesihatan_tanggungan: "Sihat",
        keadaan_kesihatan_sakit_tanggungan: "Tidak",
        kos_penjagaan_sakit_tanggungan: "0",
        perbelanjaan_bulanan_sakit_tanggungan: "0",
        kesempurnaan_fizikal_tanggungan: "Sempurna",
        sebab_kecacatan_tanggungan: "",
        tahap_kecacatan_tanggungan: "",
        perbelanjaan_bulanan_oku_tanggungan: "0",
        keadaan_kesihatan_uzur_tanggungan: "Tidak",
        kos_penjagaan_uzur_tanggungan: "0",
        perbelanjaan_bulanan_uzur_tanggungan: "0",

        // Kemahiran Tanggungan
        kemahiran_tanggungan: "Komputer, Bahasa Inggeris",

        // Maklumat Pekerjaan Tanggungan
        pekerjaan_status: "Bekerja",

        // Sumber Pendapatan
        sumber_pendapatan: ["Pengajian", "Sumbangan Keluarga"],
        lain_lain_sumber_pendapatan: "",

        // Butiran Pekerjaan
        jenis_pekerjaan: "Kerani",
        sektor_pekerjaan: "Swasta",
        lain_lain_sektor_pekerjaan: "",
        jawatan: "Kerani Pentadbiran",
        status_jawatan: "Tetap",
        pendapatan_kasar: "2500.00",
        pengesahan_pendapatan: null,

        // Maklumat Majikan
        no_telefon_pejabat: "038881234",
        nama_majikan: "Syarikat ABC Sdn Bhd",
        no_tel_majikan: "038881234",
        alamat_majikan_1: "Jalan Majikan, Kuala Lumpur",
        alamat_majikan_2: "",
        alamat_majikan_3: "",
        bandar_majikan: "Kuala Lumpur",
        poskod_majikan: "50000",
        daerah_majikan: "Kuala Lumpur",
        negeri_majikan: "Kuala Lumpur",
        negara_majikan: "Malaysia",

        // Jawatan & Status
        jawatan: "Kerani",
        status_jawatan: "Tetap",

        // Pendapatan
        pendapatan_kasar: "2500.00",
        dokumen_pendapatan: null,
      };

      // Second Tanggungan - Anak Perempuan
      tanggunganList.value[1] = {
        ...tanggunganList.value[1],
        hubungan_pemohon: "Anak",
        nama_tanggungan: "NUR NAJWA BINTI ADNAN",
        jenis_pengenalan_tanggungan: "MyKad",
        pengenalan_id_tanggungan: "060802030272",
        warganegara_tanggungan: "Malaysia",
        taraf_penduduk_tetap: "Y",
        tarikh_lahir_tanggungan: "2000-08-02",
        umur_tanggungan: "23",
        tempat_lahir_tanggungan: "Shah Alam",
        jantina_tanggungan: "Perempuan",
        agama_tanggungan: "Islam",
        bangsa_tanggungan: "Melayu",
        no_telefon_bimbit_tanggungan: "0197883456",
        no_telefon_rumah_tanggungan: "038881234",
        emel_tanggungan: "najwa@email.com",
        tempoh_menetap_selangor_tanggungan: "19",
        tempoh_menetap_selangor_tanggungan_nilai: "19",
        tempoh_menetap_selangor_tanggungan_unit: "tahun",
        status_perkahwinan_tanggungan: "Bujang",

        // Adult Status - Eligible for Head of Household
        situasi_kelulusan_khas: "Dewasa",
        kelulusan_khas: "N",

        // Legacy fields for backward compatibility
        jenis_id_tanggungan: "MyKad",
        no_pengenalan_tanggungan: "060802030272",
        tempoh_menetap_selangor: "19",
        no_telefon_tanggungan: "0197883456",

        // Islamic Information
        adakah_muallaf_tanggungan: "N",
        nama_sebelum_islam_tanggungan: "",
        tarikh_masuk_islam_tanggungan: "",
        tarikh_masuk_kfam_tanggungan: "",
        nama_selepas_islam_tanggungan: "",
        tarikh_keluar_muallaf_tanggungan: "",
        dokumen_pengislaman_tanggungan: null,

        // Maklumat Perbankan Tanggungan
        nama_bank_tanggungan: "cimb",
        swift_code_tanggungan: "CIBBMYKL",
        no_akaun_bank_tanggungan: "0987654321",
        nama_pemegang_akaun_tanggungan: "NUR NAJWA BINTI ADNAN",
        kaedah_pembayaran_tanggungan: "akaun",
        sebab_tiada_akaun_tanggungan: "",

        // Pendidikan Tanggungan
        masih_bersekolah: "T",
        bersekolah_tanggungan: "Ya",
        pendidikan_tertinggi_tanggungan: "SPM",
        lain_pendidikan_tertinggi_tanggungan: "",
        tahap_pendidikan_dicapai: ["SPM"],
        lain_tahap_pendidikan_dicapai: "",
        sijil_pendidikan_tanggungan: null,
        jenis_sekolah_institusi: "IPTA",
        kategori_sekolah_institusi: "IPTA",
        tahun_bersekolah: "2025",
        tahun_tingkatan_pengajian: "Tahun 1 / Semester 2",
        nama_sekolah_institusi: "Universiti Putra Malaysia (UPM)",
        alamat1_sekolah: "Universiti Putra Malaysia",
        alamat2_sekolah: "Serdang, Seri Kembangan",
        alamat3_sekolah: "",
        daerah_sekolah: "Seri Petaling",
        bandar_sekolah: "Serdang",
        poskod_sekolah: "43400",
        tinggal_bersama_keluarga: "Y",
        asrama_rumah_sewa: "",
        bidang_kursus_pengajian: "Diploma",
        jurusan_bidang: "Perniagaan Tani",
        pembiayaan_pengajian: ["Tiada"],
        lain_pembiayaan_pengajian: "",
        catatan_pendidikan_tanggungan: "Upload sijil SPM",
        // Legacy fields for backward compatibility
        jenis_sekolah: "Sekolah Menengah",
        nama_sekolah: "SMK Shah Alam",
        alamat_sekolah: "Jalan Sekolah, Shah Alam",
        negeri_sekolah: "Selangor",
        nama_sekolah_agama: "Sekolah Agama Shah Alam",
        alamat_sekolah_agama: "Jalan Agama, Shah Alam",
        daerah_sekolah_agama: "Petaling",
        negeri_sekolah_agama: "Selangor",
        poskod_sekolah_agama: "40000",

        // Maklumat Kesihatan Tanggungan
        tahap_kesihatan_tanggungan: "Sihat",
        keadaan_kesihatan_sakit_tanggungan: "Tidak",
        kos_penjagaan_sakit_tanggungan: "0",
        perbelanjaan_bulanan_sakit_tanggungan: "0",
        kesempurnaan_fizikal_tanggungan: "Sempurna",
        sebab_kecacatan_tanggungan: "",
        tahap_kecacatan_tanggungan: "",
        perbelanjaan_bulanan_oku_tanggungan: "0",
        keadaan_kesihatan_uzur_tanggungan: "Tidak",
        kos_penjagaan_uzur_tanggungan: "0",
        perbelanjaan_bulanan_uzur_tanggungan: "0",

        // Kemahiran Tanggungan
        kemahiran_tanggungan: "Bahasa Melayu, Matematik, Sains",

        // Maklumat Pekerjaan Tanggungan
        pekerjaan_status: "Tidak Bekerja",

        // Sumber Pendapatan
        sumber_pendapatan: [],
        lain_lain_sumber_pendapatan: "",

        // Butiran Pekerjaan
        jenis_pekerjaan: "",
        sektor_pekerjaan: "",
        lain_lain_sektor_pekerjaan: "",
        jawatan: "",
        status_jawatan: "",
        pendapatan_kasar: "",
        pengesahan_pendapatan: null,

        // Maklumat Majikan
        no_telefon_pejabat: "",
        nama_majikan: "",
        no_tel_majikan: "",
        alamat_majikan_1: "",
        alamat_majikan_2: "",
        alamat_majikan_3: "",
        bandar_majikan: "",
        poskod_majikan: "",
        daerah_majikan: "",
        negeri_majikan: "",
        negara_majikan: "",

        // Jawatan & Status
        jawatan: "",
        status_jawatan: "",

        // Pendapatan
        pendapatan_kasar: "",
        dokumen_pendapatan: null,
      };

      // Third Tanggungan - Anak Perempuan
      tanggunganList.value[2] = {
        ...tanggunganList.value[2],
        hubungan_pemohon: "Anak",
        nama_tanggungan: "NUR QISTINA BINTI ADNAN",
        jenis_pengenalan_tanggungan: "MyKad",
        pengenalan_id_tanggungan: "091108030442",
        warganegara_tanggungan: "Malaysia",
        taraf_penduduk_tetap: "Y",
        tarikh_lahir_tanggungan: "2009-11-08",
        umur_tanggungan: "14",
        tempat_lahir_tanggungan: "Petaling Jaya",
        jantina_tanggungan: "Perempuan",
        agama_tanggungan: "Islam",
        bangsa_tanggungan: "Melayu",
        no_telefon_bimbit_tanggungan: "01299982378",
        no_telefon_rumah_tanggungan: "038881234",
        emel_tanggungan: "qistina@email.com",
        tempoh_menetap_selangor_tanggungan: "13",
        tempoh_menetap_selangor_tanggungan_nilai: "13",
        tempoh_menetap_selangor_tanggungan_unit: "tahun",
        status_perkahwinan_tanggungan: "Bujang",

        // Special Approval for Minors
        situasi_kelulusan_khas: "Profiling",
        kelulusan_khas: "Y",

        // Legacy fields for backward compatibility
        jenis_id_tanggungan: "MyKad",
        no_pengenalan_tanggungan: "091108030442",
        tempoh_menetap_selangor: "16",
        no_telefon_tanggungan: "01299982378",

        // Islamic Information
        adakah_muallaf_tanggungan: "N",
        nama_sebelum_islam_tanggungan: "",
        tarikh_masuk_islam_tanggungan: "",
        tarikh_masuk_kfam_tanggungan: "",
        nama_selepas_islam_tanggungan: "",
        tarikh_keluar_muallaf_tanggungan: "",
        dokumen_pengislaman_tanggungan: null,

        // Maklumat Perbankan Tanggungan
        nama_bank_tanggungan: "",
        swift_code_tanggungan: "",
        no_akaun_bank_tanggungan: "",
        nama_pemegang_akaun_tanggungan: "",
        ada_akaun_bank_tanggungan: "T",
        sebab_tiada_akaun_tanggungan: "bukan-warganegara",

        // Pendidikan Tanggungan
        masih_bersekolah: "Y",
        bersekolah_tanggungan: "Ya",
        pendidikan_tertinggi_tanggungan: "UPSR",
        lain_pendidikan_tertinggi_tanggungan: "",
        tahap_pendidikan_dicapai: ["Peringkat Rendah"],
        lain_tahap_pendidikan_dicapai: "",
        sijil_pendidikan_tanggungan: null,
        jenis_sekolah_institusi: "SRK",
        kategori_sekolah_institusi: "SRK",
        tahun_bersekolah: "2024",
        tahun_tingkatan_pengajian: "Tahun 6",
        nama_sekolah_institusi: "SK Petaling Jaya",
        alamat1_sekolah: "Jalan Sekolah, Petaling Jaya",
        alamat2_sekolah: "",
        alamat3_sekolah: "",
        daerah_sekolah: "Petaling",
        bandar_sekolah: "Petaling Jaya",
        poskod_sekolah: "46000",
        tinggal_bersama_keluarga: "Y",
        asrama_rumah_sewa: "",
        bidang_kursus_pengajian: "",
        jurusan_bidang: "",
        pembiayaan_pengajian: ["Tiada"],
        lain_pembiayaan_pengajian: "",
        catatan_pendidikan_tanggungan: "Masih bersekolah di Tahun 6",
        // Legacy fields for backward compatibility
        jenis_sekolah: "Sekolah Rendah",
        nama_sekolah: "SK Petaling Jaya",
        alamat_sekolah: "Jalan Sekolah, Petaling Jaya",
        negeri_sekolah: "Selangor",
        nama_sekolah_agama: "Sekolah Agama Petaling Jaya",
        alamat_sekolah_agama: "Jalan Agama, Petaling Jaya",
        daerah_sekolah_agama: "Petaling",
        negeri_sekolah_agama: "Selangor",
        poskod_sekolah_agama: "46000",

        // Maklumat Kesihatan Tanggungan
        tahap_kesihatan_tanggungan: "Sihat",
        keadaan_kesihatan_sakit_tanggungan: "Tidak",
        kos_penjagaan_sakit_tanggungan: "0",
        perbelanjaan_bulanan_sakit_tanggungan: "0",
        kesempurnaan_fizikal_tanggungan: "Sempurna",
        sebab_kecacatan_tanggungan: "",
        tahap_kecacatan_tanggungan: "",
        perbelanjaan_bulanan_oku_tanggungan: "0",
        keadaan_kesihatan_uzur_tanggungan: "Tidak",
        kos_penjagaan_uzur_tanggungan: "0",
        perbelanjaan_bulanan_uzur_tanggungan: "0",

        // Kemahiran Tanggungan
        kemahiran_tanggungan: "Membaca, Menulis, Mengira",

        // Maklumat Pekerjaan Tanggungan
        pekerjaan_status: "Tidak Bekerja",

        // Sumber Pendapatan
        sumber_pendapatan: [],
        lain_lain_sumber_pendapatan: "",

        // Butiran Pekerjaan
        jenis_pekerjaan: "",
        sektor_pekerjaan: "",
        lain_lain_sektor_pekerjaan: "",
        jawatan: "",
        status_jawatan: "",
        pendapatan_kasar: "",
        pengesahan_pendapatan: null,

        // Maklumat Majikan
        no_telefon_pejabat: "",
        nama_majikan: "",
        no_tel_majikan: "",
        alamat_majikan_1: "",
        alamat_majikan_2: "",
        alamat_majikan_3: "",
        bandar_majikan: "",
        poskod_majikan: "",
        daerah_majikan: "",
        negeri_majikan: "",
        negara_majikan: "",

        // Jawatan & Status
        jawatan: "",
        status_jawatan: "",

        // Pendapatan
        pendapatan_kasar: "",
        dokumen_pendapatan: null,
      };

      // Update formData.tanggungan array
      formData.value.tanggungan = tanggunganList.value;

      // Ensure Section B defaults to the first tanggungan on initial load
      currentTanggunganIndex.value = 0;

      // Set flag to false after mock data initialization is complete
      isInitializingMockData.value = false;

      console.log("Mock data loaded for 3 tanggungan:", tanggunganList.value);
      console.log(
        "Rohana relationship:",
        tanggunganList.value[0]?.hubungan_pemohon
      );
      console.log(
        "Najwa relationship:",
        tanggunganList.value[1]?.hubungan_pemohon
      );
      console.log(
        "Qistina relationship:",
        tanggunganList.value[2]?.hubungan_pemohon
      );
    }
  }
});

// ============================================================================
// STEP JUMP FUNCTIONS
// ============================================================================
const goToStepA = (stepNumber) => {
  currentStepA.value = stepNumber;
};

const goToStepB = (stepNumber) => {
  const currentTanggungan = getCurrentTanggungan();

  if (currentTanggungan) {
    const age = parseInt(
      currentTanggungan.umur_tanggungan ||
        calculateAge(currentTanggungan.tarikh_lahir_tanggungan)
    );

    // Prevent navigation to kemahiran step (id: 6) if age is less than 19
    if (age < 19 && stepNumber === 6) {
      return; // Do not navigate to kemahiran step
    }
  }

  // Allow direct navigation to any step
  currentStepB.value = stepNumber;
};

// ============================================================================
// FORM SUBMISSION FUNCTIONS
// ============================================================================
const submitForm = () => {
  // Save current tanggungan data before submission
  if (getCurrentTanggungan()) {
    const currentTanggungan = getCurrentTanggungan();
    tanggunganList.value[currentTanggunganIndex.value] = {
      ...currentTanggungan,
    };
    formData.value.tanggungan = tanggunganList.value;
  }

  // Log summary of all tanggungan
  console.log(
    `Form submitted with ${tanggunganList.value.length} tanggungan:`,
    tanggunganList.value
  );

  processing.value = true;
  navigateTo(`/BF-PRF/AS/FR/03`);
};

const handleSubmit = async () => {
  try {
    console.log("Form submitted:", formData.value);
    toast.success("Permohonan berjaya dihantar");
    router.push("/BF-PRF/AS/FR/01");
  } catch (error) {
    toast.error("Ralat! Permohonan tidak berjaya dihantar");
    console.error("Submission error:", error);
  }
};

const handleSave = async () => {
  try {
    console.log("Form saved:", formData.value);
    toast.success("Permohonan berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Permohonan tidak berjaya disimpan");
    console.error("Save error:", error);
  }
};

// ============================================================================
// STEP SAVE FUNCTIONS - SECTION A
// ============================================================================
const handleSaveStepA1 = async () => {
  try {
    console.log("Step A1 saved:", formData.value);
    toast.success("Maklumat Peribadi berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
    console.error("Save Step A1 error:", error);
  }
};

const handleSaveStepA2 = async () => {
  try {
    console.log("Step A2 saved:", formData.value);
    toast.success("Maklumat Alamat berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
    console.error("Save Step A2 error:", error);
  }
};

const handleSaveStepA3 = async () => {
  try {
    console.log("Step A3 saved:", formData.value);
    toast.success("Maklumat Pendidikan berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
    console.error("Save Step A3 error:", error);
  }
};

const handleSaveStepA4 = async () => {
  try {
    console.log("Step A4 saved:", formData.value);
    toast.success("Maklumat Pengislaman berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
    console.error("Save Step A4 error:", error);
  }
};

const handleSaveStepA5 = async () => {
  try {
    console.log("Step A5 saved:", formData.value);
    toast.success("Maklumat Perbankan berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
    console.error("Save Step A5 error:", error);
  }
};

const handleSaveStepA6 = async () => {
  try {
    console.log("Step A6 saved:", formData.value);
    toast.success("Maklumat Kesihatan berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
    console.error("Save Step A6 error:", error);
  }
};

const handleSaveStepA7 = async () => {
  try {
    console.log("Step A7 saved:", formData.value);
    toast.success("Maklumat Kemahiran berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
    console.error("Save Step A7 error:", error);
  }
};

const handleSaveStepA8 = async () => {
  try {
    console.log("Step A8 saved:", formData.value);
    toast.success("Maklumat Pinjaman Harta berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
    console.error("Save Step A8 error:", error);
  }
};

const handleSaveStepA9 = async () => {
  try {
    console.log("Step A9 saved:", formData.value);
    toast.success("Maklumat Pemilikan berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
    console.error("Save Step A9 error:", error);
  }
};

const handleSaveStepA10 = async () => {
  try {
    console.log("Step A10 saved:", formData.value);
    toast.success("Maklumat Pekerjaan berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
    console.error("Save Step A10 error:", error);
  }
};

const handleSaveStepA11 = async () => {
  try {
    console.log("Step A11 saved:", formData.value);
    toast.success("Maklumat Pendapatan & Perbelanjaan berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
    console.error("Save Step A11 error:", error);
  }
};

// ============================================================================
// STEP SAVE FUNCTIONS - SECTION B
// ============================================================================
const handleSaveStepB1 = async () => {
  try {
    // Save current tanggungan data before saving
    if (getCurrentTanggungan()) {
      const currentTanggungan = getCurrentTanggungan();
      // Update the tanggunganList with current form data
      tanggunganList.value[currentTanggunganIndex.value] = {
        ...currentTanggungan,
      };
      formData.value.tanggungan = tanggunganList.value;

      console.log(
        "Step B1 saved for Tanggungan",
        currentTanggunganIndex.value + 1,
        ":",
        currentTanggungan
      );
      console.log("Updated tanggunganList:", tanggunganList.value);
    }

    toast.success("Maklumat Peribadi Tanggungan berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
    console.error("Save Step B1 error:", error);
  }
};

const handleSaveStepB2 = async () => {
  try {
    console.log("Step B2 saved:", formData.value);
    toast.success("Maklumat Pengislaman Tanggungan berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
    console.error("Save Step B2 error:", error);
  }
};

const handleSaveStepB3 = async () => {
  try {
    console.log("Step B3 saved:", formData.value);
    toast.success("Maklumat Perbankan Tanggungan berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
    console.error("Save Step B3 error:", error);
  }
};

const handleSaveStepB4 = async () => {
  try {
    console.log("Step B4 saved:", formData.value);
    toast.success("Maklumat Pendidikan Tanggungan berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
    console.error("Save Step B4 error:", error);
  }
};

const handleSaveStepB5 = async () => {
  try {
    console.log("Step B5 saved:", formData.value);
    toast.success("Maklumat Kesihatan Tanggungan berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
    console.error("Save Step B5 error:", error);
  }
};

const handleSaveStepB6 = async () => {
  try {
    console.log("Step B6 saved:", formData.value);
    toast.success("Maklumat Kemahiran Tanggungan berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
    console.error("Save Step B6 error:", error);
  }
};

const handleSaveStepB7 = async () => {
  try {
    console.log("Step B7 saved:", formData.value);
    toast.success("Maklumat Pekerjaan Tanggungan berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
    console.error("Save Step B7 error:", error);
  }
};

const handleSaveStepB8 = async () => {
  try {
    console.log("Step B8 saved:", formData.value);
    toast.success("Maklumat Pemilikan Aset berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
    console.error("Save Step B8 error:", error);
  }
};

const handleSaveStepB9 = async () => {
  try {
    console.log("Step B9 saved:", formData.value);
    toast.success("Maklumat Pinjaman Harta berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
    console.error("Save Step B9 error:", error);
  }
};

const handleSaveStepB10 = async () => {
  try {
    console.log("Step B10 saved:", formData.value);
    toast.success("Maklumat Pengesahan berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
    console.error("Save Step B10 error:", error);
  }
};

const handleSaveStepB11 = async () => {
  try {
    console.log("Step B11 saved:", formData.value);
    toast.success("Maklumat Pengesahan Pendapatan berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
    console.error("Save Step B11 error:", error);
  }
};

const handleSaveStepB12 = async () => {
  try {
    console.log("Step B12 saved:", formData.value);
    toast.success("Maklumat Pengesahan Bermastautin berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
    console.error("Save Step B12 error:", error);
  }
};

const handleSaveStepB13 = async () => {
  try {
    console.log("Step B13 saved:", formData.value);
    toast.success("Maklumat Pegawai Pendaftar berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
    console.error("Save Step B13 error:", error);
  }
};

// ============================================================================
// EDUCATION ENTRIES MANAGEMENT FUNCTIONS
// ============================================================================
const addEducationEntry = () => {
  formData.value.education_entries.push({
    jenis_sekolah: "",
    sekolah_rendah_kategori: [],
    kategori_sekolah: "",
    tarikh_mula_pengajian: "",
    tarikh_tamat_pengajian: "",
    tahun_bersekolah: "",
    tahun_tingkatan: "",
    nama_sekolah: "",
    alamat_sekolah_1: "",
    alamat_sekolah_2: "",
    alamat_sekolah_3: "",
    daerah_sekolah: "",
    bandar_sekolah: "",
    poskod_sekolah: "",
    tinggal_bersama_keluarga: "",
    asrama_rumah_sewa: "",
    bidang_kursus: "",
    jurusan_bidang: "",
    pembiayaan_pengajian: [],
    lain_pembiayaan: "",
    catatan: "",
  });
};

// ============================================================================
// TANGGUNGAN EDUCATION ENTRIES MANAGEMENT FUNCTIONS
// ============================================================================
const addEducationEntryTanggungan = () => {
  const currentTanggungan = getCurrentTanggungan();
  if (!currentTanggungan.education_entries) {
    currentTanggungan.education_entries = [];
  }

  currentTanggungan.education_entries.push({
    jenis_sekolah: "",
    sekolah_rendah_kategori: [],
    kategori_sekolah: "",
    tarikh_mula_pengajian: "",
    tarikh_tamat_pengajian: "",
    tahun_bersekolah: "",
    tahun_tingkatan: "",
    nama_sekolah: "",
    alamat_sekolah_1: "",
    alamat_sekolah_2: "",
    alamat_sekolah_3: "",
    daerah_sekolah: "",
    bandar_sekolah: "",
    poskod_sekolah: "",
    tinggal_bersama_keluarga: "",
    asrama_rumah_sewa: "",
    bidang_kursus: "",
    jurusan_bidang: "",
    pembiayaan_pengajian: [],
    lain_pembiayaan: "",
    catatan: "",
  });
};

const removeEducationEntryTanggungan = (index) => {
  const currentTanggungan = getCurrentTanggungan();
  if (currentTanggungan.education_entries) {
    currentTanggungan.education_entries.splice(index, 1);
  }
};

const onSelectSchoolTanggungan = (index, selectedValue) => {
  const selected = schoolOptions.find((s) => s.value === selectedValue);
  if (!selected) return;
  const currentTanggungan = getCurrentTanggungan();
  if (!currentTanggungan || !currentTanggungan.education_entries) return;
  const entry = currentTanggungan.education_entries[index];
  if (!entry) return;

  // Auto-check kategori sekolah based on selected school
  entry.kategori_sekolah = selected.kategori;

  // Auto-check sekolah rendah kategori if it's a religious school
  if (selected.kategori === "SRA" || selected.kategori === "KAFA") {
    entry.sekolah_rendah_kategori = ["agama"];
  } else if (selected.kategori === "SRK" || selected.kategori === "SEK.MEN") {
    entry.sekolah_rendah_kategori = ["kebangsaan"];
  }

  // Populate address fields
  entry.alamat_sekolah_1 = selected.alamat1 || "";
  entry.alamat_sekolah_2 = selected.alamat2 || "";
  entry.alamat_sekolah_3 = selected.alamat3 || "";
  entry.daerah_sekolah = selected.daerah || "";
  entry.bandar_sekolah = selected.bandar || "";
  entry.poskod_sekolah = selected.poskod || "";
};

// ============================================================================
// TANGGUNGAN BANK ACCOUNTS MANAGEMENT FUNCTIONS
// ============================================================================
const addBankAccountTanggungan = () => {
  const currentTanggungan = getCurrentTanggungan();
  if (!currentTanggungan.bank_accounts) {
    currentTanggungan.bank_accounts = [];
  }

  currentTanggungan.bank_accounts.push({
    nama_bank: "",
    no_akaun_bank: "",
    nama_pemegang_akaun: "",
    jenis_akaun: "",
    id_pengenalan: "",
    nama_bersama: "",
    hubungan: "",
    pengenalan_ids: [], // Array to store multiple pengenalan IDs
  });
};

const removeBankAccountTanggungan = (index) => {
  const currentTanggungan = getCurrentTanggungan();
  if (currentTanggungan.bank_accounts) {
    currentTanggungan.bank_accounts.splice(index, 1);
  }
};

// Add/remove pengenalan ID for tanggungan bank accounts
const addPengenalanIdTanggungan = (accountIndex) => {
  const currentTanggungan = getCurrentTanggungan();
  const account = currentTanggungan.bank_accounts[accountIndex];
  if (account && account.pengenalan_ids.length < 2) {
    account.pengenalan_ids.push({
      id: "",
      nama: "",
      hubungan: "",
    });
  }
};

const removePengenalanIdTanggungan = (accountIndex, idIndex) => {
  const currentTanggungan = getCurrentTanggungan();
  const account = currentTanggungan.bank_accounts[accountIndex];
  if (account && account.pengenalan_ids) {
    account.pengenalan_ids.splice(idIndex, 1);
  }
};
</script>

<style scoped></style>
