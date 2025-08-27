<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Permohonan Pemeriksaan Kerja
          </h2>
        </div>
      </template>

      <template #body>
        <FormKit
          type="form"
          @submit="handleSubmit"
          :actions="false"
          v-model="formData"
          class="space-y-8"
        >
          <!-- Project Details Section -->
          <rs-fieldset>
            <template #legend>
              <h3 class="text-lg font-semibold flex items-center">
                <Icon name="ph:buildings" class="w-5 h-5 mr-2" />
                Maklumat Projek
              </h3>
            </template>

            <div class="space-y-4">
              <div class="md:col-span-2">
                <FormKit
                  type="textarea"
                  name="projek"
                  label="PROJEK"
                  placeholder="CADANGAN MEMBINA DAN MENYIAPKAN BANGUNAN RUMAH KEDIAMAN 3 BILIK UNTUK FAKIR/MISKIN DAN MUALLAF LEMBAGA ZAKAT SELANGOR (MAIS)"
                  rows="3"
                  validation="required"
                  :validation-messages="{
                    required: 'Maklumat projek diperlukan',
                  }"
                />
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormKit
                  type="text"
                  name="daerahLokasi"
                  label="DAERAH/LOKASI PROJEK"
                  placeholder="Masukkan daerah/lokasi projek"
                  validation="required"
                  :validation-messages="{
                    required: 'Daerah/lokasi projek diperlukan',
                  }"
                />

                <FormKit
                  type="text"
                  name="namaKontraktor"
                  label="NAMA KONTRAKTOR"
                  placeholder="Masukkan nama kontraktor"
                  validation="required"
                  :validation-messages="{
                    required: 'Nama kontraktor diperlukan',
                  }"
                />

                <FormKit
                  type="date"
                  name="tarikhMohon"
                  label="TARIKH MOHON"
                  validation="required"
                  :validation-messages="{
                    required: 'Tarikh mohon diperlukan',
                  }"
                />

                <div>
                  <FormKit
                    type="select"
                    name="jenisPemeriksaan"
                    label="JENIS/KLASIFIKASI PEMERIKSAAN"
                    :options="jenisPemeriksaanOptions.map(opt => ({ label: opt.label, value: opt.value }))"
                    validation="required"
                    :validation-messages="{
                      required: 'Jenis pemeriksaan diperlukan',
                    }"
                  />
                  <div v-if="selectedInspectionType" class="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p class="text-sm text-blue-800">
                      <Icon name="ph:info" class="inline w-4 h-4 mr-1" />
                      {{ selectedInspectionType.description }}
                    </p>
                  </div>
                </div>

                <div class="md:col-span-2">
                  <FormKit
                    type="textarea"
                    name="perkara"
                    label="PERKARA"
                    placeholder="Sila nyatakan perkara pemeriksaan..."
                    rows="3"
                    validation="required"
                    :validation-messages="{
                      required: 'Perkara pemeriksaan diperlukan',
                    }"
                  />
                </div>

                <FormKit
                  type="date"
                  name="tarikhKerja"
                  label="TARIKH KERJA"
                  :min="minWorkDate"
                  validation="required"
                  :validation-messages="{
                    required: 'Tarikh kerja diperlukan',
                  }"
                  :help="`Tarikh kerja mesti sekurang-kurangnya 3 hari selepas tarikh mohon (${formData.tarikhMohon ? new Date(formData.tarikhMohon).toLocaleDateString('ms-MY') : 'belum ditetapkan'})`"
                />

                <div>
                  <FormKit
                    type="time"
                    name="masa"
                    label="MASA"
                    validation="required"
                    :validation-messages="{
                      required: 'Masa kerja diperlukan',
                    }"
                  />
                  <p class="text-xs text-gray-600 mt-1">
                    <Icon name="ph:clock" class="inline w-3 h-3 mr-1" />
                    Masa kerja yang disyorkan: 8:00 AM - 5:00 PM
                  </p>
                </div>
              </div>
            </div>
          </rs-fieldset>

          <!-- Checklist Section -->
          <rs-fieldset>
            <template #legend>
              <h3 class="text-lg font-semibold flex items-center">
                <Icon name="ph:clipboard-text" class="w-5 h-5 mr-2" />
                SENARAI SEMAK 
                <span class="text-sm font-normal text-gray-600 ml-2">(disemak oleh Eksekutif Teknikal)</span>
              </h3>
            </template>

            <div class="space-y-3">
              <div class="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p class="text-sm text-yellow-800">
                  <Icon name="ph:warning" class="inline w-4 h-4 mr-1" />
                  <strong>Arahan:</strong> Sila semak kesemua item yang berkenaan sebelum menandatangani borang ini.
                </p>
              </div>
              
              <div v-for="(item, index) in checklistItems" :key="index" 
                   :class="['checklist-item', { 'checked': formData.checklist[item.key] }]">
                <div class="flex items-start space-x-3">
                  <FormKit
                    type="checkbox"
                    :name="`checklist.${item.key}`"
                    :classes="{
                      wrapper: 'flex items-center',
                      input: '!w-5 !h-5 !mt-0',
                      label: 'sr-only',
                    }"
                  />
                  <div class="flex-1 min-w-0">
                    <div class="flex items-start space-x-2">
                      <span class="inline-flex items-center justify-center w-6 h-6 text-xs font-medium text-gray-500 bg-gray-100 rounded-full flex-shrink-0">
                        {{ index + 1 }}
                      </span>
                      <div class="flex-1">
                        <p class="text-sm font-medium text-gray-900">{{ item.label }}</p>
                        <p v-if="item.description" class="text-xs text-gray-500 mt-1">{{ item.description }}</p>
                      </div>
                    </div>
                  </div>
                  <div v-if="formData.checklist[item.key]" class="text-green-500">
                    <Icon name="ph:check-circle" class="w-5 h-5" />
                  </div>
                </div>
              </div>
              
              <!-- Checklist Summary -->
              <div class="mt-4 p-3 bg-gray-50 rounded-lg border">
                <div class="flex items-center justify-between">
                  <span class="text-sm font-medium text-gray-700">Progress Semakan:</span>
                  <span class="text-sm font-semibold" :class="checklistProgress === 100 ? 'text-green-600' : 'text-blue-600'">
                    {{ checkedItemsCount }}/{{ checklistItems.length }} ({{ checklistProgress }}%)
                  </span>
                </div>
                <div class="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div class="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                       :style="{ width: checklistProgress + '%' }">
                  </div>
                </div>
              </div>
            </div>
          </rs-fieldset>

          <!-- Technical Executive Comments Section -->
          <rs-fieldset>
            <template #legend>
              <h3 class="text-lg font-semibold flex items-center">
                <Icon name="ph:chat-text" class="w-5 h-5 mr-2" />
                Ulasan & Komen
              </h3>
            </template>

            <div class="space-y-4">
              <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <FormKit
                  type="textarea"
                  name="ulasanEksekutif"
                  label="ULASAN/KOMEN EKSEKUTIF TEKNIKAL"
                  placeholder="Contoh: Kerja konkrit perlu dilakukan mengikut spesifikasi yang ditetapkan. Pastikan acuan konkrit dan peralatan lengkap sebelum kerja dimulakan..."
                  rows="4"
                  :classes="{
                    input: '!border-0 !bg-white !shadow-sm',
                  }"
                />
                <div class="mt-2 flex items-center justify-between text-xs text-gray-500">
                  <span>
                    <Icon name="ph:note-pencil" class="inline w-3 h-3 mr-1" />
                    Ruang untuk ulasan dan komen tambahan
                  </span>
                  <span v-if="formData.ulasanEksekutif" class="text-blue-600">
                    {{ formData.ulasanEksekutif.length }} aksara
                  </span>
                </div>
              </div>
            </div>
          </rs-fieldset>

          <!-- Signatures Section -->
          <rs-fieldset>
            <template #legend>
              <h3 class="text-lg font-semibold flex items-center">
                <Icon name="ph:signature" class="w-5 h-5 mr-2" />
                Tandatangan & Kelulusan
              </h3>
            </template>
            
            <div class="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p class="text-sm text-blue-800">
                <Icon name="ph:info" class="inline w-4 h-4 mr-1" />
                <strong>Panduan:</strong> Gunakan tetikus atau sentuh skrin untuk menandatangani borang ini. Klik "Simpan" selepas menandatangani.
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <!-- Contractor Signature -->
              <div>
                <h4 class="font-medium text-gray-700 mb-4">DISEDIAKAN OLEH: Kontraktor</h4>
                
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Tandatangan Kontraktor <span class="text-red-500">*</span>
                    </label>
                    
                    <!-- Signature Pad -->
                    <div v-if="!formData.kontraktor.tandatangan" class="mb-4">
                      <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 hover:border-blue-400 hover:bg-blue-50 transition-colors">
                        <SignaturePad
                          v-model="formData.kontraktor.tandatangan"
                          @update:modelValue="(value) => formData.kontraktor.tandatangan = value"
                          @error="handleSignatureError"
                        />
                        <p class="text-xs text-gray-500 mt-2 text-center">
                          <Icon name="ph:hand-pointing" class="inline w-4 h-4 mr-1" />
                          Gunakan tetikus atau sentuh untuk menandatangani
                        </p>
                      </div>
                    </div>
                    
                    <!-- Signature Preview -->
                    <div v-if="formData.kontraktor.tandatangan" class="mb-4 signature-container">
                      <div class="border rounded-lg p-4 bg-gray-50">
                        <div class="flex items-center justify-between mb-2">
                          <span class="text-sm font-medium text-gray-700">
                            <Icon name="ph:check-circle" class="inline w-4 h-4 mr-1 text-green-500" />
                            Tandatangan Tersimpan:
                          </span>
                          <rs-button
                            variant="danger-outline"
                            size="sm"
                            @click="confirmClearSignature('kontraktor')"
                          >
                            <Icon name="ph:trash" class="w-4 h-4 mr-1" />
                            Padam & Tulis Semula
                          </rs-button>
                        </div>
                        <div class="relative">
                          <img 
                            :src="formData.kontraktor.tandatangan" 
                            alt="Tandatangan Kontraktor" 
                            class="max-w-full h-32 object-contain border rounded bg-white shadow-sm"
                          />
                          <div class="absolute top-2 right-2 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                            <Icon name="ph:seal-check" class="w-3 h-3 mr-1 inline" />Sah
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div v-if="!formData.kontraktor.tandatangan" class="text-sm text-red-500 mt-1">
                      Tandatangan diperlukan
                    </div>
                  </div>

                  <FormKit
                    type="text"
                    name="kontraktor.nama"
                    label="Nama"
                    placeholder="Masukkan nama penuh"
                    validation="required"
                    :validation-messages="{
                      required: 'Nama diperlukan',
                    }"
                  />

                  <FormKit
                    type="date"
                    name="kontraktor.tarikh"
                    label="Tarikh"
                    validation="required"
                    :validation-messages="{
                      required: 'Tarikh diperlukan',
                    }"
                  />
                </div>
              </div>

              <!-- Technical Executive Signature -->
              <div>
                <h4 class="font-medium text-gray-700 mb-4">DIPERIKSA OLEH: Eksekutif Teknikal</h4>
                
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Tandatangan Eksekutif Teknikal <span class="text-red-500">*</span>
                    </label>
                    
                    <!-- Signature Pad -->
                    <div v-if="!formData.eksekutif.tandatangan" class="mb-4">
                      <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 hover:border-blue-400 hover:bg-blue-50 transition-colors">
                        <SignaturePad
                          v-model="formData.eksekutif.tandatangan"
                          @update:modelValue="(value) => formData.eksekutif.tandatangan = value"
                          @error="handleSignatureError"
                        />
                        <p class="text-xs text-gray-500 mt-2 text-center">
                          <Icon name="ph:hand-pointing" class="inline w-4 h-4 mr-1" />
                          Gunakan tetikus atau sentuh untuk menandatangani
                        </p>
                      </div>
                    </div>
                    
                    <!-- Signature Preview -->
                    <div v-if="formData.eksekutif.tandatangan" class="mb-4 signature-container">
                      <div class="border rounded-lg p-4 bg-gray-50">
                        <div class="flex items-center justify-between mb-2">
                          <span class="text-sm font-medium text-gray-700">
                            <Icon name="ph:check-circle" class="inline w-4 h-4 mr-1 text-green-500" />
                            Tandatangan Tersimpan:
                          </span>
                          <rs-button
                            variant="danger-outline"
                            size="sm"
                            @click="confirmClearSignature('eksekutif')"
                          >
                            <Icon name="ph:trash" class="w-4 h-4 mr-1" />
                            Padam & Tulis Semula
                          </rs-button>
                        </div>
                        <div class="relative">
                          <img 
                            :src="formData.eksekutif.tandatangan" 
                            alt="Tandatangan Eksekutif" 
                            class="max-w-full h-32 object-contain border rounded bg-white shadow-sm"
                          />
                          <div class="absolute top-2 right-2 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                            <Icon name="ph:seal-check" class="w-3 h-3 mr-1 inline" />Sah
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div v-if="!formData.eksekutif.tandatangan" class="text-sm text-red-500 mt-1">
                      Tandatangan diperlukan
                    </div>
                  </div>

                  <FormKit
                    type="text"
                    name="eksekutif.nama"
                    label="Nama"
                    placeholder="Masukkan nama penuh"
                    validation="required"
                    :validation-messages="{
                      required: 'Nama diperlukan',
                    }"
                  />

                  <FormKit
                    type="date"
                    name="eksekutif.tarikh"
                    label="Tarikh"
                    validation="required"
                    :validation-messages="{
                      required: 'Tarikh diperlukan',
                    }"
                  />
                </div>
              </div>
            </div>
          </rs-fieldset>

          <!-- Important Notes Section -->
          <rs-fieldset>
            <template #legend>
              <h3 class="text-lg font-semibold text-red-600 flex items-center">
                <Icon name="ph:warning-octagon" class="w-5 h-5 mr-2" />
                PENTING
              </h3>
            </template>

            <div class="space-y-4">
              <div class="bg-red-50 border border-red-200 rounded-lg p-4">
                <div class="flex items-start space-x-2">
                  <Icon name="ph:shield-check" class="w-4 h-4 mt-0.5 text-red-500 flex-shrink-0" />
                  <p class="text-sm text-red-800">
                    Sila rujuk Polisi Perlindungan Data Peribadi Kami ("Notis Privasi"). Dengan memberikan data peribadi anda serta menandatangani borang ini, anda menyatakan kebenaran dan persetujuan anda kepada kami terhadap terma-terma yang terkandung didalam Notis tersebut. Notis tersebut boleh didapati di laman web kami di 
                    <a href="https://www.zakatselangor.com.my" target="_blank" class="text-blue-600 hover:text-blue-800 underline font-medium">
                      www.zakatselangor.com.my
                    </a>.
                  </p>
                </div>
              </div>

              <!-- Important Notes Grid -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div class="flex items-start space-x-2">
                    <Icon name="ph:calendar-x" class="w-4 h-4 mt-0.5 text-yellow-600 flex-shrink-0" />
                    <div>
                      <span class="text-yellow-700 font-bold text-sm">Tempoh Permohonan</span>
                      <p class="text-xs text-yellow-600 mt-1">Permohonan hendaklah dibuat sekurang-kurang 3 hari sebelum tarikh kerja dilaksanakan di tapak</p>
                    </div>
                  </div>
                </div>
                
                <div class="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div class="flex items-start space-x-2">
                    <Icon name="ph:hard-hat" class="w-4 h-4 mt-0.5 text-orange-600 flex-shrink-0" />
                    <div>
                      <span class="text-orange-700 font-bold text-sm">Kerja Kritikal</span>
                      <p class="text-xs text-orange-600 mt-1">Kerja konkrit in-situ, pemasangan kerangka bumbung yang bukan dari pembekal dan pemasangan tangki septik</p>
                    </div>
                  </div>
                </div>
                
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div class="flex items-start space-x-2">
                    <Icon name="ph:scissors" class="w-4 h-4 mt-0.5 text-blue-600 flex-shrink-0" />
                    <div>
                      <span class="text-blue-700 font-bold text-sm">Arahan Umum</span>
                      <p class="text-xs text-blue-600 mt-1">Potong yang mana tidak berkenaan dalam senarai semak di atas</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </rs-fieldset>

          <!-- Form Actions -->
          <div class="form-actions flex justify-end space-x-4 pt-6 border-t">
            <rs-button
              variant="secondary"
              @click="handleBack"
              class="px-6 py-2"
            >
              Kembali
            </rs-button>
            <rs-button
              variant="secondary-outline"
              @click="handleReset"
              class="px-6 py-2"
            >
              Reset
            </rs-button>
            <rs-button
              variant="primary"
              @click="handleSubmit"
              class="px-6 py-2"
              :disabled="!canSubmitForm"
            >
              <Icon name="ph:paper-plane-tilt" class="w-4 h-4 mr-2" />
              Hantar Permohonan
            </rs-button>
            
            <!-- Form Progress Indicator -->
            <div v-if="!canSubmitForm" class="text-xs text-gray-500 mt-2">
              <Icon name="ph:info" class="inline w-3 h-3 mr-1" />
              Sila lengkapkan semua maklumat yang diperlukan
            </div>
          </div>
        </FormKit>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import SignaturePad from "~/components/SignaturePad.vue";

definePageMeta({
  title: "Permohonan Pemeriksaan Kerja",
});

// Get route params
const route = useRoute();
const id = route.params.id;

// Computed properties for checklist progress
const checkedItemsCount = computed(() => {
  return Object.values(formData.value.checklist).filter(Boolean).length;
});

const checklistProgress = computed(() => {
  const total = checklistItems.length;
  const checked = checkedItemsCount.value;
  return Math.round((checked / total) * 100);
});

// Computed property for minimum work date (3 days after application date)
const minWorkDate = computed(() => {
  if (!formData.value.tarikhMohon) return new Date().toISOString().split('T')[0];
  
  const mohonDate = new Date(formData.value.tarikhMohon);
  mohonDate.setDate(mohonDate.getDate() + 3);
  return mohonDate.toISOString().split('T')[0];
});

// Computed property for selected inspection type details
const selectedInspectionType = computed(() => {
  return jenisPemeriksaanOptions.find(opt => opt.value === formData.value.jenisPemeriksaan);
});

// Computed property for form submission validation
const canSubmitForm = computed(() => {
  const hasValidDates = formData.value.tarikhMohon && formData.value.tarikhKerja;
  let dateValidation = true;
  
  if (hasValidDates) {
    const mohonDate = new Date(formData.value.tarikhMohon);
    const kerjaDate = new Date(formData.value.tarikhKerja);
    const daysDifference = Math.ceil((kerjaDate - mohonDate) / (1000 * 60 * 60 * 24));
    dateValidation = daysDifference >= 3;
  }
  
  return (
    formData.value.projek?.trim() &&
    formData.value.daerahLokasi?.trim() &&
    formData.value.namaKontraktor?.trim() &&
    formData.value.tarikhMohon &&
    formData.value.jenisPemeriksaan &&
    formData.value.perkara?.trim() &&
    formData.value.tarikhKerja &&
    formData.value.masa &&
    dateValidation &&
    formData.value.kontraktor.tandatangan &&
    formData.value.kontraktor.nama?.trim() &&
    formData.value.kontraktor.tarikh &&
    formData.value.eksekutif.tandatangan &&
    formData.value.eksekutif.nama?.trim() &&
    formData.value.eksekutif.tarikh
  );
});

// Breadcrumb configuration
const breadcrumb = ref([
  {
    name: "Senarai Pemantauan",
    type: "link",
    path: `/BF-BTN/permohonan/pemantauan`,
  },
  {
    name: "Pemantauan",
    type: "link",
    path: `/BF-BTN/permohonan/pemantauan/${id}`,
  },
  {
    name: "Permohonan Pemeriksaan Kerja",
    type: "current",
    path: `/BF-BTN/permohonan/pemantauan/${id}/borang/permohonan-pemeriksaan-kerja`,
  },
]);

// Options for form fields
const jenisPemeriksaanOptions = [
  { 
    label: "🏗️ Kerja Konkrit In-Situ/Pemasangan Kerangka Bumbung/Pemasangan Tangki Septik", 
    value: "konkrit_bumbung_tangki",
    description: "Pemeriksaan menyeluruh untuk kerja kritikal" 
  },
  { 
    label: "🧱 Kerja Konkrit In-Situ", 
    value: "konkrit_in_situ",
    description: "Pemeriksaan khusus untuk kerja konkrit di tapak" 
  },
  { 
    label: "🏠 Pemasangan Kerangka Bumbung", 
    value: "kerangka_bumbung",
    description: "Pemeriksaan struktur bumbung dan pemasangan" 
  },
  { 
    label: "🚰 Pemasangan Tangki Septik", 
    value: "tangki_septik",
    description: "Pemeriksaan sistem perparitan dan tangki septik" 
  },
  { 
    label: "⚙️ Lain-lain", 
    value: "lain_lain",
    description: "Pemeriksaan untuk kerja-kerja lain" 
  },
];

// Checklist items
const checklistItems = [
  { 
    key: "lukisanKerja", 
    label: "Lukisan Kerja (Work Drawings)",
    description: ""
  },
  { 
    key: "peralatanKerja", 
    label: "Peralatan Kerja Bersesuaian (Suitable Work Equipment)",
    description: ""
  },
  { 
    key: "methodStatement", 
    label: "Method of Statement/Kaedah Kerja (Method Statement/Work Method)",
    description: ""
  },
  { 
    key: "acuanUjian", 
    label: "Acuan bagi Ujian Bancuhan Konkrit (untuk kerja konkrit)",
    description: "Mould for Concrete Mix Test (for concrete work)"
  },
  { 
    key: "doSijilBarangan", 
    label: "DO/Sijil Barangan (untuk Kerangka Bumbung & Tangki Septik)",
    description: "Delivery Order/Certificate of Goods (for Roof Truss & Septic Tank)"
  },
  { 
    key: "sijilKemahiran", 
    label: "Sijil Kemahiran (jika Kerangka bumbung dipasang oleh pihak Kontraktor)",
    description: "Skill Certificate (if Roof Truss is installed by Contractor)"
  },
];

// Form data structure
const formData = ref({
  projek: "CADANGAN MEMBINA DAN MENYIAPKAN BANGUNAN RUMAH KEDIAMAN 3 BILIK UNTUK FAKIR/MISKIN DAN MUALLAF LEMBAGA ZAKAT SELANGOR (MAIS)",
  daerahLokasi: "",
  namaKontraktor: "",
  tarikhMohon: "",
  jenisPemeriksaan: "",
  perkara: "",
  tarikhKerja: "",
  masa: "",
  checklist: {
    lukisanKerja: false,
    peralatanKerja: false,
    methodStatement: false,
    acuanUjian: false,
    doSijilBarangan: false,
    sijilKemahiran: false,
  },
  ulasanEksekutif: "",
  kontraktor: {
    tandatangan: "", // Will store signature data URL
    nama: "",
    tarikh: "",
  },
  eksekutif: {
    tandatangan: "", // Will store signature data URL
    nama: "",
    tarikh: "",
  },
});

// Navigation handler
const handleBack = () => {
  navigateTo(`/BF-BTN/permohonan/pemantauan/${id}`);
};

// Form submission handler
const handleSubmit = async () => {
  // Comprehensive validation before submission
  const validationErrors = [];
  
  // Check required fields
  if (!formData.value.projek?.trim()) {
    validationErrors.push('Maklumat projek diperlukan');
  }
  
  if (!formData.value.daerahLokasi?.trim()) {
    validationErrors.push('Daerah/lokasi projek diperlukan');
  }
  
  if (!formData.value.namaKontraktor?.trim()) {
    validationErrors.push('Nama kontraktor diperlukan');
  }
  
  if (!formData.value.tarikhMohon) {
    validationErrors.push('Tarikh mohon diperlukan');
  }
  
  if (!formData.value.jenisPemeriksaan) {
    validationErrors.push('Jenis pemeriksaan diperlukan');
  }
  
  if (!formData.value.perkara?.trim()) {
    validationErrors.push('Perkara pemeriksaan diperlukan');
  }
  
  if (!formData.value.tarikhKerja) {
    validationErrors.push('Tarikh kerja diperlukan');
  }
  
  if (!formData.value.masa) {
    validationErrors.push('Masa kerja diperlukan');
  }
  
  // Validate work date is at least 3 days after application date
  if (formData.value.tarikhMohon && formData.value.tarikhKerja) {
    const mohonDate = new Date(formData.value.tarikhMohon);
    const kerjaDate = new Date(formData.value.tarikhKerja);
    const daysDifference = Math.ceil((kerjaDate - mohonDate) / (1000 * 60 * 60 * 24));
    
    if (daysDifference < 3) {
      validationErrors.push('Tarikh kerja mesti sekurang-kurangnya 3 hari selepas tarikh mohon');
    }
  }
  
  // Validate work time is within business hours (optional warning)
  if (formData.value.masa) {
    const [hours] = formData.value.masa.split(':').map(Number);
    if (hours < 7 || hours > 17) {
      // This is just a warning, not blocking validation
      useToast().add({
        title: "Perhatian",
        description: "Masa kerja yang dipilih di luar waktu kerja biasa (7:00 AM - 5:00 PM)",
        color: "yellow",
      });
    }
  }
  
  if (!formData.value.kontraktor.tandatangan) {
    validationErrors.push('Tandatangan Kontraktor diperlukan');
  }
  
  if (!formData.value.kontraktor.nama?.trim()) {
    validationErrors.push('Nama Kontraktor diperlukan');
  }
  
  if (!formData.value.kontraktor.tarikh) {
    validationErrors.push('Tarikh tandatangan Kontraktor diperlukan');
  }
  
  if (!formData.value.eksekutif.tandatangan) {
    validationErrors.push('Tandatangan Eksekutif Teknikal diperlukan');
  }
  
  if (!formData.value.eksekutif.nama?.trim()) {
    validationErrors.push('Nama Eksekutif Teknikal diperlukan');
  }
  
  if (!formData.value.eksekutif.tarikh) {
    validationErrors.push('Tarikh tandatangan Eksekutif Teknikal diperlukan');
  }
  
  // Validate signature format
  if (formData.value.kontraktor.tandatangan && !formData.value.kontraktor.tandatangan.startsWith('data:image/')) {
    validationErrors.push('Format tandatangan Kontraktor tidak sah');
  }
  
  if (formData.value.eksekutif.tandatangan && !formData.value.eksekutif.tandatangan.startsWith('data:image/')) {
    validationErrors.push('Format tandatangan Eksekutif Teknikal tidak sah');
  }
  
  if (validationErrors.length > 0) {
    useToast().add({
      title: "Ralat Validasi",
      description: `${validationErrors.length} ralat dijumpai: ${validationErrors.slice(0, 3).join(', ')}${validationErrors.length > 3 ? '...' : ''}`,
      color: "red",
    });
    
    // Scroll to first error
    const firstErrorElement = document.querySelector('.formkit-message[data-message-type="error"], .text-red-500');
    if (firstErrorElement) {
      firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return;
  }

  try {
    // Show loading state
    useToast().add({
      title: "Memproses",
      description: "Sedang menghantar permohonan...",
      color: "blue",
    });
    
    // Here you would typically send the form data to your API
    console.log("Form data submitted:", formData.value);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Show success message with additional details
    const checkedItems = Object.values(formData.value.checklist).filter(Boolean).length;
    useToast().add({
      title: "Berjaya",
      description: `Permohonan pemeriksaan kerja telah berjaya dihantar dengan ${checkedItems} item senarai semak yang disemak`,
      color: "green",
    });
    
    // Optionally redirect or show success page
    // await navigateTo(`/BF-BTN/permohonan/pemantauan/${id}`);
    
  } catch (error) {
    console.error("Error submitting form:", error);
    
    // Show error message
    useToast().add({
      title: "Ralat Sistem",
      description: "Gagal menghantar permohonan. Sila cuba lagi atau hubungi sokongan teknikal.",
      color: "red",
    });
  }
};

// Signature clearing confirmation
const confirmClearSignature = (signatureType) => {
  if (confirm('Adakah anda pasti ingin memadamkan tandatangan ini?')) {
    if (signatureType === 'kontraktor') {
      formData.value.kontraktor.tandatangan = '';
    } else if (signatureType === 'eksekutif') {
      formData.value.eksekutif.tandatangan = '';
    }
    
    useToast().add({
      title: "Berjaya",
      description: "Tandatangan telah dipadamkan",
      color: "blue",
    });
  }
};

// Form reset handler
const handleReset = () => {
  formData.value = {
    projek: "CADANGAN MEMBINA DAN MENYIAPKAN BANGUNAN RUMAH KEDIAMAN 3 BILIK UNTUK FAKIR/MISKIN DAN MUALLAF LEMBAGA ZAKAT SELANGOR (MAIS)",
    daerahLokasi: "",
    namaKontraktor: "",
    tarikhMohon: "",
    jenisPemeriksaan: "",
    perkara: "",
    tarikhKerja: "",
    masa: "",
    checklist: {
      lukisanKerja: false,
      peralatanKerja: false,
      methodStatement: false,
      acuanUjian: false,
      doSijilBarangan: false,
      sijilKemahiran: false,
    },
    ulasanEksekutif: "",
    kontraktor: {
      tandatangan: "",
      nama: "",
      tarikh: "",
    },
    eksekutif: {
      tandatangan: "",
      nama: "",
      tarikh: "",
    },
  };
  
  useToast().add({
    title: "Berjaya",
    description: "Borang telah direset",
    color: "blue",
  });
};

// Handle signature errors
const handleSignatureError = (error) => {
  console.error('Signature error:', error);
  useToast().add({
    title: "Ralat Tandatangan",
    description: "Terdapat masalah dengan tandatangan. Sila cuba lagi.",
    color: "red",
  });
};

// Auto-set current date for signature dates
const setCurrentDate = (field) => {
  const today = new Date().toISOString().split('T')[0];
  if (field === 'kontraktor') {
    formData.value.kontraktor.tarikh = today;
  } else if (field === 'eksekutif') {
    formData.value.eksekutif.tarikh = today;
  }
};

// Watch for signature changes to auto-set dates
watch(() => formData.value.kontraktor.tandatangan, (newVal) => {
  if (newVal && !formData.value.kontraktor.tarikh) {
    setCurrentDate('kontraktor');
  }
});

watch(() => formData.value.eksekutif.tandatangan, (newVal) => {
  if (newVal && !formData.value.eksekutif.tarikh) {
    setCurrentDate('eksekutif');
  }
});

// Watch for application date changes to update work date if needed
watch(() => formData.value.tarikhMohon, (newDate) => {
  if (newDate && formData.value.tarikhKerja) {
    const mohonDate = new Date(newDate);
    const kerjaDate = new Date(formData.value.tarikhKerja);
    const daysDifference = Math.ceil((kerjaDate - mohonDate) / (1000 * 60 * 60 * 24));
    
    // If work date is less than 3 days after application date, auto-adjust
    if (daysDifference < 3) {
      const newWorkDate = new Date(mohonDate);
      newWorkDate.setDate(newWorkDate.getDate() + 3);
      formData.value.tarikhKerja = newWorkDate.toISOString().split('T')[0];
      
      useToast().add({
        title: "Tarikh Diselaraskan",
        description: "Tarikh kerja telah diselaraskan kepada minimum 3 hari selepas tarikh mohon",
        color: "blue",
      });
    }
  }
});

// Auto-set current date when form loads
onMounted(() => {
  const today = new Date().toISOString().split('T')[0];
  formData.value.tarikhMohon = today;
  
  // Set default work time to 9:00 AM
  formData.value.masa = '09:00';
});
</script>

<style lang="scss" scoped>
// Custom styles for the table form inputs
:deep(.formkit-input) {
  &:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }
}

// Signature area styling
.signature-area {
  border: 2px dashed #d1d5db;
  border-radius: 0.5rem;
  padding: 1rem;
  background-color: #f9fafb;
  
  &:hover {
    border-color: #60a5fa;
    background-color: #eff6ff;
  }
}

// Table styling improvements
table {
  border-collapse: collapse;
  
  th, td {
    vertical-align: top;
  }
  
  th {
    background-color: #f3f4f6;
    color: #374151;
  }
  
  td {
    background-color: #ffffff;
  }
}

// Ensure table cells maintain proper spacing
table {
  border-collapse: collapse;
  
  th, td {
    vertical-align: top;
  }
}

// Responsive table adjustments
@media (max-width: 768px) {
  .overflow-x-auto {
    margin: 0 -1rem;
  }
  
  // Improve signature display on mobile
  .signature-container {
    img {
      max-height: 120px;
    }
  }
  
  // Stack form buttons on mobile
  .form-actions {
    flex-direction: column;
    gap: 0.75rem;
    
    .rs-button {
      width: 100%;
    }
  }
}

// Checkbox styling improvements
:deep(.formkit-input[type="checkbox"]) {
  &:checked {
    background-color: #2563eb;
    border-color: #2563eb;
  }
  
  &:focus {
    box-shadow: 0 0 0 2px #ffffff, 0 0 0 4px #3b82f6;
  }
}

// Time input styling
:deep(.formkit-input[type="time"]) {
  &::-webkit-calendar-picker-indicator {
    cursor: pointer;
  }
}

// Checklist item styling
.checklist-item {
  transition: all 0.2s ease;
  border-radius: 0.5rem;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  
  &:hover {
    background-color: #f9fafb;
    border-color: #d1d5db;
  }
  
  &.checked {
    background-color: #eff6ff;
    border-color: #3b82f6;
  }
}

// Enhanced form sections
.form-section {
  background: #ffffff;
  border-radius: 0.75rem;
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

// Form validation indicators
.form-field-valid {
  border-left: 4px solid #10b981;
  background-color: #f0fdf4;
}

.form-field-invalid {
  border-left: 4px solid #ef4444;
  background-color: #fef2f2;
}

// Enhanced responsive design
@media (max-width: 640px) {
  .checklist-item {
    padding: 0.75rem;
  }
  
  .weather-input-wrapper {
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }
}
</style>
