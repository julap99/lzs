<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Penilaian Prestasi Kontraktor
          </h2>
        </div>
      </template>

      <template #body>
        <form @submit.prevent="handleSubmit" class="space-y-8">
          <!-- Header Section -->
          <rs-fieldset>
            <template #legend>
              <h3 class="text-lg font-semibold flex items-center">
                <Icon name="ph:info" class="w-5 h-5 mr-2" />
                Maklumat Asas
              </h3>
            </template>

            <div class="space-y-4">
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">NAMA PROJEK</label>
                <textarea
                  v-model="formData.namaProjek"
                  placeholder="CADANGAN MEMBINA DAN MENYIAPKAN BANGUNAN RUMAH KEDIAMAN 3 BILIK / BAIK PULIH RUMAH UNTUK FAKIR/MISKIN DAN MUALLAF LEMBAGA ZAKAT SELANGOR (MAIS)"
                  rows="3"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                ></textarea>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">TARIKH PENILAIAN</label>
                  <input
                    type="date"
                    v-model="formData.tarikhPenilaian"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">NO. WO</label>
                  <input
                    type="text"
                    v-model="formData.noWO"
                    placeholder="Masukkan nombor WO"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">KONTRAKTOR</label>
                  <input
                    type="text"
                    v-model="formData.kontraktor"
                    placeholder="Masukkan nama kontraktor"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">KONTRAKTOR PERNAH MENGHADIRI TAKLIMAT KONTRAKTOR</label>
                  <select
                    v-model="formData.kontraktorBriefing"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Pilih pilihan</option>
                    <option value="ya">Ya</option>
                    <option value="tidak">Tidak</option>
                  </select>
                </div>
              </div>


              
              <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p class="text-sm text-blue-800 mb-2">
                  <Icon name="ph:info" class="inline w-4 h-4 mr-1" />
                  <strong>Panduan:</strong> Tandakan pada markah yang disediakan untuk kiraan keseluruhan bagi tujuan penggredan kontraktor.
                </p>
                <div class="text-xs text-blue-700 bg-blue-100 rounded-md p-2 mt-2">
                  <strong>Formula Pengiraan:</strong> (Jumlah Markah ÷ 43) × 100 = Peratusan
                </div>
              </div>
              
              <!-- Real-time Score Summary -->
              <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 class="font-semibold text-green-800 mb-2 flex items-center">
                  <Icon name="ph:chart-line" class="w-4 h-4 mr-2" />
                  Ringkasan Markah Semasa
                </h4>
                <div class="grid grid-cols-3 gap-4 text-sm">
                  <div class="text-center">
                    <div class="font-bold text-green-600">{{ sectionATotal }}</div>
                    <div class="text-gray-600">Bahagian A</div>
                  </div>
                  <div class="text-center">
                    <div class="font-bold text-blue-600">{{ sectionBTotal }}</div>
                    <div class="text-gray-600">Bahagian B</div>
                  </div>
                  <div class="text-center">
                    <div class="font-bold text-purple-600">{{ sectionCTotal }}</div>
                    <div class="text-gray-600">Bahagian C</div>
                  </div>
                </div>
                <div class="mt-3 pt-3 border-t border-green-200 text-center">
                  <div class="text-lg font-bold text-green-800">Jumlah: {{ overallTotal }} / 43</div>
                  <div class="text-sm text-gray-600">Peratusan: {{ percentage }}% | Gred: {{ grade }}</div>
                </div>
                

              </div>
            </div>
          </rs-fieldset>

          <!-- Section A: Contractor Understanding of Contract Work -->
          <rs-fieldset>
            <template #legend>
              <h3 class="text-lg font-semibold flex items-center">
                <Icon name="ph:clipboard-text" class="w-5 h-5 mr-2" />
                A: PEMAHAMAN KONTRAKTOR TERHADAP KONTRAK KERJA
                <span v-if="sectionAComplete" class="ml-2 text-green-500">
                  <Icon name="ph:check-circle" class="w-5 h-5" />
                </span>
              </h3>
            </template>

            <div :class="['scoring-section', { 'section-complete': sectionAComplete }]">
              <div class="space-y-6">
              <div v-for="(item, index) in sectionAItems" :key="index" class="border-b border-gray-200 pb-4">
                <div class="flex items-start space-x-3 mb-3">
                  <span class="text-sm font-medium text-gray-700 w-6">{{ index + 1 }}.</span>
                  <div class="flex-1">
                    <label class="block text-sm font-medium text-gray-700 mb-2">{{ item.label }}</label>
                    <div class="flex flex-wrap gap-3">
                      <div class="flex flex-wrap gap-3">
                        <label 
                          v-for="option in item.options" 
                          :key="option.value"
                          class="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"
                        >
                          <input
                            type="radio"
                            :name="`sectionA-${item.key}`"
                            :value="option.value"
                            v-model="formData.sectionA[item.key]"
                            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                            required
                          />
                          <span class="text-sm font-medium text-gray-700">{{ option.label }}</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex items-center space-x-3 pt-4 border-t border-gray-200">
                <span class="text-lg font-semibold text-gray-700">JUMLAH MARKAH:</span>
                <input
                  type="number"
                  :value="sectionATotal"
                  readonly
                  class="w-20 text-center font-bold text-lg bg-gray-100 border border-gray-300 rounded px-2 py-1"
                />
                <span class="text-lg font-semibold text-gray-700">/ 24</span>
                <div class="ml-4 text-sm text-gray-600">
                  Progress: {{ Math.round((sectionATotal / 24) * 100) }}%
                </div>
              </div>
              </div>
            </div>
          </rs-fieldset>

          <!-- Section B: Contractor's Good Relationship with Institution -->
          <rs-fieldset>
            <template #legend>
              <h3 class="text-lg font-semibold flex items-center">
                <Icon name="ph:handshake" class="w-5 h-5 mr-2" />
                B: PERHUBUNGAN BAIK KONTRAKTOR DENGAN INSTITUSI
                <span v-if="sectionBComplete" class="ml-2 text-green-500">
                  <Icon name="ph:check-circle" class="w-5 h-5" />
                </span>
              </h3>
            </template>

            <div :class="['scoring-section', { 'section-complete': sectionBComplete }]">
              <div class="space-y-6">
              <div v-for="(item, index) in sectionBItems" :key="index" class="border-b border-gray-200 pb-4">
                <div class="flex items-start space-x-3 mb-3">
                  <span class="text-sm font-medium text-gray-700 w-6">{{ index + 1 }}.</span>
                  <div class="flex-1">
                    <label class="block text-sm font-medium text-gray-700 mb-2">{{ item.label }}</label>
                    <div class="flex flex-wrap gap-3">
                      <div class="flex flex-wrap gap-3">
                        <label 
                          v-for="option in item.options" 
                          :key="option.value"
                          class="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"
                        >
                          <input
                            type="radio"
                            :name="`sectionB-${item.key}`"
                            :value="option.value"
                            v-model="formData.sectionB[item.key]"
                            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                            required
                          />
                          <span class="text-sm font-medium text-gray-700">{{ option.label }}</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex items-center space-x-3 pt-4 border-t border-gray-200">
                <span class="text-lg font-semibold text-gray-700">JUMLAH MARKAH:</span>
                <input
                  type="number"
                  :value="sectionBTotal"
                  readonly
                  class="w-20 text-center font-bold text-lg bg-gray-100 border border-gray-300 rounded px-2 py-1"
                />
                <span class="text-lg font-semibold text-gray-700">/ 9</span>
                <div class="ml-4 text-sm text-gray-600">
                  Progress: {{ Math.round((sectionBTotal / 9) * 100) }}%
                </div>
              </div>
              </div>
            </div>
          </rs-fieldset>

          <!-- Section C: Recommended Action Against Contractor -->
          <rs-fieldset>
            <template #legend>
              <h3 class="text-lg font-semibold flex items-center">
                <Icon name="ph:gavel" class="w-5 h-5 mr-2" />
                C: CADANGAN TINDAKAN TERHADAP KONTRAKTOR
                <span v-if="sectionCComplete" class="ml-2 text-green-500">
                  <Icon name="ph:check-circle" class="w-5 h-5" />
                </span>
              </h3>
            </template>

            <div :class="['scoring-section', { 'section-complete': sectionCComplete }]">
              <div class="space-y-6">
              <div v-for="(item, index) in sectionCItems" :key="index" class="border-b border-gray-200 pb-4">
                <div class="flex items-start space-x-3 mb-3">
                  <span class="text-sm font-medium text-gray-700 w-6">{{ index + 1 }}.</span>
                  <div class="flex-1">
                    <label class="block text-sm font-medium text-gray-700 mb-2">{{ item.label }}</label>
                    <div class="flex flex-wrap gap-3">
                      <div class="flex flex-wrap gap-3">
                        <label 
                          v-for="option in item.options" 
                          :key="option.value"
                          class="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"
                        >
                          <input
                            type="radio"
                            :name="`sectionC-${item.key}`"
                            :value="option.value"
                            v-model="formData.sectionC[item.key]"
                            required
                            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                          />
                          <span class="text-sm font-medium text-gray-700">{{ option.label }}</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex items-center space-x-3 pt-4 border-t border-gray-200">
                <span class="text-lg font-semibold text-gray-700">JUMLAH MARKAH:</span>
                <input
                  type="number"
                  :value="sectionCTotal"
                  readonly
                  class="w-20 text-center font-bold text-lg bg-gray-100 border border-gray-300 rounded px-2 py-1"
                />
                <span class="text-lg font-semibold text-gray-700">/ 10</span>
                <div class="ml-4 text-sm text-gray-600">
                  Progress: {{ Math.round((sectionCTotal / 10) * 100) }}%
                </div>
              </div>
              </div>
            </div>
          </rs-fieldset>

          <!-- Overall Scoring Section -->
          <rs-fieldset>
            <template #legend>
              <h3 class="text-lg font-semibold flex items-center">
                <Icon name="ph:calculator" class="w-5 h-5 mr-2" />
                Pemarkahan Keseluruhan
              </h3>
            </template>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <!-- Scoring Calculation -->
              <div class="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-6 border border-blue-200">
                <h4 class="font-semibold text-blue-800 mb-4 flex items-center">
                  <Icon name="ph:chart-bar" class="w-4 h-4 mr-2" />
                  Kiraan Markah
                </h4>
                
                <div class="space-y-6">
                  <div class="flex items-center justify-between">
                    <span class="text-sm font-medium text-gray-700">JUMLAH MARKAH:</span>
                    <div class="flex items-center space-x-2">
                      <span class="text-2xl font-bold text-blue-600">{{ overallTotal }}</span>
                      <span class="text-lg text-gray-500">/ 43</span>
                    </div>
                  </div>

                  <div class="flex items-center justify-between">
                    <span class="text-sm font-medium text-gray-700">PERATUSAN:</span>
                    <div class="flex items-center space-x-2">
                      <span class="text-2xl font-bold text-green-600">{{ percentage }}%</span>
                    </div>
                  </div>

                  <div class="flex items-center justify-between">
                    <span class="text-sm font-medium text-gray-700">GRED:</span>
                    <div :class="['px-4 py-2 rounded-full text-xl font-bold grade-indicator', gradeClass]">
                      {{ grade }}
                    </div>
                  </div>
                  
                  <!-- Progress Bar -->
                  <div class="mt-6">
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-xs font-medium text-gray-600">Progress Keseluruhan</span>
                      <span class="text-xs font-medium text-gray-600">{{ percentage }}%</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        class="h-3 rounded-full transition-all duration-500 ease-out"
                        :class="{
                          'bg-green-500': percentage >= 85,
                          'bg-blue-500': percentage >= 65 && percentage < 85,
                          'bg-orange-500': percentage >= 51 && percentage < 65,
                          'bg-red-500': percentage < 51
                        }"
                        :style="{ width: percentage + '%' }"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Grading Scale -->
              <div class="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h4 class="font-semibold text-gray-700 mb-4 flex items-center">
                  <Icon name="ph:medal" class="w-4 h-4 mr-2" />
                  SKALA PEMARKAHAN
                </h4>
                <div class="space-y-3">
                  <div :class="['flex items-center justify-between p-3 rounded-lg transition-all', percentage < 51 ? 'bg-red-100 border border-red-300' : 'bg-white border']">
                    <span class="font-medium text-sm">0-50%</span>
                    <span class="text-red-600 font-medium text-sm">Disenaraihitam</span>
                    <div class="w-3 h-3 rounded-full bg-red-500"></div>
                  </div>
                  <div :class="['flex items-center justify-between p-3 rounded-lg transition-all', percentage >= 51 && percentage < 65 ? 'bg-orange-100 border border-orange-300' : 'bg-white border']">
                    <span class="font-medium text-sm">51-64%</span>
                    <span class="text-orange-600 font-medium text-sm">Gred C (Memuaskan)</span>
                    <div class="w-3 h-3 rounded-full bg-orange-500"></div>
                  </div>
                  <div :class="['flex items-center justify-between p-3 rounded-lg transition-all', percentage >= 65 && percentage < 85 ? 'bg-blue-100 border border-blue-300' : 'bg-white border']">
                    <span class="font-medium text-sm">65-84%</span>
                    <span class="text-blue-600 font-medium text-sm">Gred B (Baik)</span>
                    <div class="w-3 h-3 rounded-full bg-blue-500"></div>
                  </div>
                  <div :class="['flex items-center justify-between p-3 rounded-lg transition-all', percentage >= 85 ? 'bg-green-100 border border-green-300' : 'bg-white border']">
                    <span class="font-medium text-sm">85-100%</span>
                    <span class="text-green-600 font-medium text-sm">Gred A (Cemerlang)</span>
                    <div class="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                </div>
              </div>
            </div>
          </rs-fieldset>

          <!-- Assessor's Notes Section -->
          <rs-fieldset>
            <template #legend>
              <h3 class="text-lg font-semibold flex items-center">
                <Icon name="ph:note-pencil" class="w-5 h-5 mr-2" />
                Catatan Penilai
              </h3>
            </template>

            <div class="space-y-4">
              <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">CATATAN PENILAI</label>
                <textarea
                  v-model="formData.catatanPenilai"
                  placeholder="Contoh: Kontraktor menunjukkan komitmen yang baik dalam melaksanakan kerja. Perlu dipantau dari segi ketepatan masa. Kerjasama dengan pegawai teknikal adalah memuaskan..."
                  rows="4"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
                ></textarea>
                <div class="mt-2 flex items-center justify-between text-xs text-gray-500">
                  <span>
                    <Icon name="ph:lightbulb" class="inline w-3 h-3 mr-1" />
                    Catatan tambahan untuk rujukan masa hadapan
                  </span>
                  <span v-if="formData.catatanPenilai" class="text-blue-600">
                    {{ formData.catatanPenilai.length }} aksara
                  </span>
                </div>
              </div>
            </div>
          </rs-fieldset>

          <!-- Signature Section -->
          <rs-fieldset>
            <template #legend>
              <h3 class="text-lg font-semibold flex items-center">
                <Icon name="ph:signature" class="w-5 h-5 mr-2" />
                Tandatangan & Cop
              </h3>
            </template>
            
            <div class="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p class="text-sm text-blue-800">
                <Icon name="ph:info" class="inline w-4 h-4 mr-1" />
                <strong>Panduan:</strong> Gunakan tetikus atau sentuh skrin untuk menandatangani borang ini. Klik "Simpan" selepas menandatangani.
              </p>
            </div>

            <div class="space-y-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Tandatangan Eksekutif Teknikal <span class="text-red-500">*</span>
                </label>
                
                <!-- Signature Pad -->
                <div v-if="!formData.tandatangan" class="mb-4">
                  <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 hover:border-blue-400 hover:bg-blue-50 transition-colors">
                    <SignaturePad
                      v-model="formData.tandatangan"
                      @update:modelValue="(value) => formData.tandatangan = value"
                      @error="handleSignatureError"
                    />
                    <p class="text-xs text-gray-500 mt-2 text-center">
                      <Icon name="ph:hand-pointing" class="inline w-4 h-4 mr-1" />
                      Gunakan tetikus atau sentuh untuk menandatangani
                    </p>
                  </div>
                </div>
                
                <!-- Signature Preview -->
                <div v-if="formData.tandatangan" class="mb-4 signature-container">
                  <div class="border rounded-lg p-4 bg-gray-50">
                    <div class="flex items-center justify-between mb-2">
                      <span class="text-sm font-medium text-gray-700">
                        <Icon name="ph:check-circle" class="inline w-4 h-4 mr-1 text-green-500" />
                        Tandatangan Tersimpan:
                      </span>
                      <rs-button
                        variant="danger-outline"
                        size="sm"
                        @click="confirmClearSignature"
                      >
                        <Icon name="ph:trash" class="w-4 h-4 mr-1" />
                        Padam & Tulis Semula
                      </rs-button>
                    </div>
                    <div class="relative">
                      <img 
                        :src="formData.tandatangan" 
                        alt="Tandatangan Eksekutif Teknikal" 
                        class="max-w-full h-32 object-contain border rounded bg-white shadow-sm"
                      />
                      <div class="absolute top-2 right-2 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                        <Icon name="ph:seal-check" class="w-3 h-3 mr-1 inline" />Sah
                      </div>
                    </div>
                  </div>
                </div>
                
                <div v-if="!formData.tandatangan" class="text-sm text-red-500 mt-1">
                  Tandatangan diperlukan
                </div>
              </div>

              <div class="bg-gray-100 border border-gray-200 rounded-lg p-4">
                <p class="text-sm text-gray-700 text-center">
                  <strong>Eksekutif Teknikal</strong><br>
                  Lembaga Zakat Selangor
                </p>
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
              Simpan Penilaian
            </rs-button>
            
            <!-- Form Status Indicator -->
            <div class="text-xs text-gray-500 mt-2">
              <div v-if="!canSubmitForm" class="flex items-center">
                <Icon name="ph:warning" class="inline w-3 h-3 mr-1 text-yellow-500" />
                Sila lengkapkan semua maklumat dan tandatangan
              </div>
              <div v-else class="flex items-center text-green-600">
                <Icon name="ph:check-circle" class="inline w-3 h-3 mr-1" />
                Borang siap untuk dihantar (Gred: {{ grade }})
              </div>
            </div>
          </div>
        </form>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import SignaturePad from "~/components/SignaturePad.vue";

definePageMeta({
  title: "Penilaian Prestasi Kontraktor",
});

// Get route params
const route = useRoute();
const id = route.params.id;

// Section A Items
const sectionAItems = [
  {
    key: "kepatuhanArahan",
    label: "Kepatuhan kepada Arahan Pegawai LZS",
    options: [
      { label: "5 - Mematuhi", value: 5 },
      { label: "3 - Sebahagian", value: 3 },
      { label: "0 - Tidak Mematuhi", value: 0 }
    ]
  },
  {
    key: "kepatuhanTempoh",
    label: "Kepatuhan terhadap tempoh masa yang diberikan",
    options: [
      { label: "5 - Mematuhi", value: 5 },
      { label: "3 - E.O.T", value: 3 },
      { label: "0 - Tidak Mematuhi", value: 0 }
    ]
  },
  {
    key: "memoTeguran",
    label: "Kekerapan Kontraktor menerima Memo TEGURAN Tapak",
    options: [
      { label: "5 - Tiada", value: 5 },
      { label: "3 - 1 Memo", value: 3 },
      { label: "1 - Lebih", value: 1 }
    ]
  },
  {
    key: "tahapKualiti",
    label: "Tahap kualiti keseluruhan bagi kerja yang dilaksanakan",
    options: [
      { label: "5 - Cemerlang", value: 5 },
      { label: "3 - Baik", value: 3 },
      { label: "1 - Sederhana", value: 1 }
    ]
  },
  {
    key: "kerjaTambahan",
    label: "Kerja-kerja tambahan yang dilaksanakan tanpa tuntutan",
    options: [
      { label: "1 - Ada", value: 1 },
      { label: "0 - Tiada", value: 0 }
    ]
  },
  {
    key: "pengetahuanPenyelesaian",
    label: "Pengetahuan kontraktor dalam menyelesaikan masalah",
    options: [
      { label: "3 - Cemerlang", value: 3 },
      { label: "2 - Baik", value: 2 },
      { label: "1 - Sederhana", value: 1 }
    ]
  }
];

// Section B Items
const sectionBItems = [
  {
    key: "persefahaman",
    label: "Persefahaman Kontraktor dengan pegawai LZS",
    options: [
      { label: "3 - Baik", value: 3 },
      { label: "2 - Sederhana", value: 2 },
      { label: "0 - Tidak berhubung", value: 0 }
    ]
  },
  {
    key: "kerjasama",
    label: "Kerjasama kontraktor dengan pegawai LZS",
    options: [
      { label: "3 - Baik", value: 3 },
      { label: "2 - Sederhana", value: 2 },
      { label: "0 - Tidak berhubung", value: 0 }
    ]
  },
  {
    key: "kesediaanTeguran",
    label: "Kesediaan kontraktor menerima teguran pegawai LZS",
    options: [
      { label: "3 - Baik", value: 3 },
      { label: "2 - Sederhana", value: 2 },
      { label: "0 - Tiada", value: 0 }
    ]
  }
];

// Section C Items
const sectionCItems = [
  {
    key: "penamatanKontrak",
    label: "Kontraktor disyorkan ditamatkan kontrak",
    options: [
      { label: "5 - Tidak", value: 5 },
      { label: "0 - Ya", value: 0 }
    ]
  },
  {
    key: "penolakanBayaran",
    label: "Disyorkan untuk penolakan bayaran jika kesalahan disebabkan oleh kontraktor",
    options: [
      { label: "5 - Tidak", value: 5 },
      { label: "0 - Ya", value: 0 }
    ]
  }
];

// Computed properties for scoring
const sectionATotal = computed(() => {
  let total = 0;
  Object.values(formData.value.sectionA).forEach(value => {
    if (value !== null && value !== undefined) {
      total += value;
    }
  });
  return total;
});

const sectionBTotal = computed(() => {
  let total = 0;
  Object.values(formData.value.sectionB).forEach(value => {
    if (value !== null && value !== undefined) {
      total += value;
    }
  });
  return total;
});

const sectionCTotal = computed(() => {
  let total = 0;
  Object.values(formData.value.sectionC).forEach(value => {
    if (value !== null && value !== undefined) {
      total += value;
    }
  });
  return total;
});

const overallTotal = computed(() => {
  return sectionATotal.value + sectionBTotal.value + sectionCTotal.value;
});

const percentage = computed(() => {
  const maxScore = 43; // 24 (Section A) + 9 (Section B) + 10 (Section C)
  return maxScore > 0 ? Math.round((overallTotal.value / maxScore) * 100) : 0;
});

const grade = computed(() => {
  const score = percentage.value;
  if (score >= 85) return "A";
  if (score >= 65) return "B";
  if (score >= 51) return "C";
  return "D";
});

// Computed properties for section completion status
const sectionAComplete = computed(() => {
  return Object.values(formData.value.sectionA).every(value => value !== null && value !== undefined);
});

const sectionBComplete = computed(() => {
  return Object.values(formData.value.sectionB).every(value => value !== null && value !== undefined);
});

const sectionCComplete = computed(() => {
  return Object.values(formData.value.sectionC).every(value => value !== null && value !== undefined);
});

// Computed property for grade class
const gradeClass = computed(() => {
  const gradeValue = grade.value;
  return `grade-${gradeValue.toLowerCase()}`;
});

// Computed property for form submission validation
const canSubmitForm = computed(() => {
  const basicInfoComplete = (
    formData.value.namaProjek?.trim() &&
    formData.value.tarikhPenilaian &&
    formData.value.noWO?.trim() &&
    formData.value.kontraktor?.trim() &&
    formData.value.kontraktorBriefing
  );
  
  const allSectionsComplete = (
    sectionAComplete.value &&
    sectionBComplete.value &&
    sectionCComplete.value
  );
  
  return basicInfoComplete && allSectionsComplete && formData.value.tandatangan;
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
    name: "Penilaian Prestasi Kontraktor",
    type: "current",
    path: `/BF-BTN/permohonan/pemantauan/${id}/borang/penilaian-prestasi-kontraktor`,
  },
]);

// Form data structure
const formData = ref({
  namaProjek: "CADANGAN MEMBINA DAN MENYIAPKAN BANGUNAN RUMAH KEDIAMAN 3 BILIK / BAIK PULIH RUMAH UNTUK FAKIR/MISKIN DAN MUALLAF LEMBAGA ZAKAT SELANGOR (MAIS)",
  tarikhPenilaian: "",
  noWO: "",
  kontraktor: "",
  kontraktorBriefing: "",
  sectionA: {
    kepatuhanArahan: null,
    kepatuhanTempoh: null,
    memoTeguran: null,
    tahapKualiti: null,
    kerjaTambahan: null,
    pengetahuanPenyelesaian: null,
  },
  sectionB: {
    persefahaman: null,
    kerjasama: null,
    kesediaanTeguran: null,
  },
  sectionC: {
    penamatanKontrak: null,
    penolakanBayaran: null,
  },
  catatanPenilai: "",
  tandatangan: "", // Will store signature data URL
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
  if (!formData.value.namaProjek?.trim()) {
    validationErrors.push('Nama projek diperlukan');
  }
  
  if (!formData.value.tarikhPenilaian) {
    validationErrors.push('Tarikh penilaian diperlukan');
  }
  
  if (!formData.value.noWO?.trim()) {
    validationErrors.push('Nombor WO diperlukan');
  }
  
  if (!formData.value.kontraktor?.trim()) {
    validationErrors.push('Nama kontraktor diperlukan');
  }
  
  if (!formData.value.kontraktorBriefing) {
    validationErrors.push('Sila pilih sama ada kontraktor pernah menghadiri taklimat');
  }
  
  // Check if all sections have been filled
  const sectionACompleteCheck = Object.values(formData.value.sectionA).every(value => value !== null);
  const sectionBCompleteCheck = Object.values(formData.value.sectionB).every(value => value !== null);
  const sectionCCompleteCheck = Object.values(formData.value.sectionC).every(value => value !== null);
  
  if (!sectionACompleteCheck) {
    validationErrors.push('Sila lengkapkan semua item dalam Bahagian A');
  }
  
  if (!sectionBCompleteCheck) {
    validationErrors.push('Sila lengkapkan semua item dalam Bahagian B');
  }
  
  if (!sectionCCompleteCheck) {
    validationErrors.push('Sila lengkapkan semua item dalam Bahagian C');
  }
  
  // Add warning for low scores
  if (percentage.value < 51) {
    useToast().add({
      title: "Amaran Gred Rendah",
      description: "Gred prestasi kontraktor adalah rendah (D). Kontraktor mungkin perlu disenaraihitam.",
      color: "yellow",
    });
  }
  
  if (!formData.value.tandatangan) {
    validationErrors.push('Tandatangan diperlukan');
  }
  
  // Validate signature format
  if (formData.value.tandatangan && !formData.value.tandatangan.startsWith('data:image/')) {
    validationErrors.push('Format tandatangan tidak sah');
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
      description: "Sedang menyimpan penilaian...",
      color: "blue",
    });
    
    // Here you would typically send the form data to your API
    console.log("Form data submitted:", formData.value);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Show success message with detailed feedback
    const gradeDescription = {
      'A': 'Cemerlang',
      'B': 'Baik', 
      'C': 'Memuaskan',
      'D': 'Perlu Dipantau'
    };
    
    useToast().add({
      title: "Penilaian Berjaya Disimpan",
      description: `Kontraktor mendapat gred ${grade.value} (${gradeDescription[grade.value]}) dengan markah ${overallTotal.value}/43 (${percentage.value}%)`,
      color: "green",
    });
    
    // Optionally redirect or show success page
    // await navigateTo(`/BF-BTN/permohonan/pemantauan/${id}`);
    
  } catch (error) {
    console.error("Error submitting form:", error);
    
    // Show error message
    useToast().add({
      title: "Ralat Sistem",
      description: "Gagal menyimpan penilaian. Sila cuba lagi atau hubungi sokongan teknikal.",
      color: "red",
    });
  }
};

// Signature clearing confirmation
const confirmClearSignature = () => {
  if (confirm('Adakah anda pasti ingin memadamkan tandatangan ini?')) {
    formData.value.tandatangan = '';
    
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
    namaProjek: "CADANGAN MEMBINA DAN MENYIAPKAN BANGUNAN RUMAH KEDIAMAN 3 BILIK / BAIK PULIH RUMAH UNTUK FAKIR/MISKIN DAN MUALLAF LEMBAGA ZAKAT SELANGOR (MAIS)",
    tarikhPenilaian: "",
    noWO: "",
    kontraktor: "",
    kontraktorBriefing: "",
    sectionA: {
      kepatuhanArahan: null,
      kepatuhanTempoh: null,
      memoTeguran: null,
      tahapKualiti: null,
      kerjaTambahan: null,
      pengetahuanPenyelesaian: null,
    },
    sectionB: {
      persefahaman: null,
      kerjasama: null,
      kesediaanTeguran: null,
    },
    sectionC: {
      penamatanKontrak: null,
      penolakanBayaran: null,
    },
    catatanPenilai: "",
    tandatangan: "",
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

// Test calculation function for debugging
const testCalculations = () => {
  console.log('=== CALCULATION TEST ===');
  console.log('Section A Values:', formData.value.sectionA);
  console.log('Section B Values:', formData.value.sectionB);
  console.log('Section C Values:', formData.value.sectionC);
  console.log('Section A Total:', sectionATotal.value);
  console.log('Section B Total:', sectionBTotal.value);
  console.log('Section C Total:', sectionCTotal.value);
  console.log('Overall Total:', overallTotal.value);
  console.log('Percentage:', percentage.value);
  console.log('Grade:', grade.value);
  console.log('=======================');
  
  // Test with sample data to verify calculations
  const testData = {
    sectionA: { kepatuhanArahan: 5, kepatuhanTempoh: 5, memoTeguran: 5, tahapKualiti: 5, kerjaTambahan: 1, pengetahuanPenyelesaian: 3 },
    sectionB: { persefahaman: 3, kerjasama: 3, kesediaanTeguran: 3 },
    sectionC: { penamatanKontrak: 5, penolakanBayaran: 5 }
  };
  
  const expectedA = 24; // 5+5+5+5+1+3
  const expectedB = 9;  // 3+3+3
  const expectedC = 10; // 5+5
  const expectedTotal = 43; // 24+9+10
  const expectedPercentage = 100; // (43/43)*100
  const expectedGrade = 'A'; // 100% = Grade A
  
  console.log('=== EXPECTED RESULTS ===');
  console.log('Section A Expected:', expectedA, 'Actual:', sectionATotal.value);
  console.log('Section B Expected:', expectedB, 'Actual:', sectionBTotal.value);
  console.log('Section C Expected:', expectedC, 'Actual:', sectionCTotal.value);
  console.log('Total Expected:', expectedTotal, 'Actual:', overallTotal.value);
  console.log('Percentage Expected:', expectedPercentage, 'Actual:', percentage.value);
  console.log('Grade Expected:', expectedGrade, 'Actual:', grade.value);
  console.log('=======================');
  
  // Show test results in toast
  const allCorrect = (
    sectionATotal.value === expectedA &&
    sectionBTotal.value === expectedB &&
    sectionCTotal.value === expectedC &&
    overallTotal.value === expectedTotal &&
    percentage.value === expectedPercentage &&
    grade.value === expectedGrade
  );
  
  useToast().add({
    title: allCorrect ? "Pengiraan Betul!" : "Ralat Pengiraan",
    description: allCorrect ? 
      "Semua pengiraan berfungsi dengan betul" : 
      "Terdapat masalah dengan pengiraan. Sila periksa console untuk maklumat lanjut.",
    color: allCorrect ? "green" : "red",
  });
};

// Populate form with test data for demonstration
const populateTestData = () => {
  formData.value.sectionA = {
    kepatuhanArahan: 5,
    kepatuhanTempoh: 5,
    memoTeguran: 5,
    tahapKualiti: 5,
    kerjaTambahan: 1,
    pengetahuanPenyelesaian: 3
  };
  
  formData.value.sectionB = {
    persefahaman: 3,
    kerjasama: 3,
    kesediaanTeguran: 3
  };
  
  formData.value.sectionC = {
    penamatanKontrak: 5,
    penolakanBayaran: 5
  };
  
  formData.value.kontraktor = "Kontraktor Test Sdn Bhd";
  formData.value.noWO = "WO-2024-001";
  formData.value.kontraktorBriefing = "ya";
  formData.value.catatanPenilai = "Ini adalah data test untuk menguji pengiraan markah. Kontraktor menunjukkan prestasi yang cemerlang dalam semua aspek.";
  
  useToast().add({
    title: "Data Test Dimasukkan",
    description: "Borang telah diisi dengan data test. Klik 'Test Pengiraan' untuk mengesahkan pengiraan.",
    color: "blue",
  });
};

// Show current form data for debugging
const showFormData = () => {
  console.log('=== CURRENT FORM DATA ===');
  console.log('Form Data:', formData.value);
  console.log('Section A:', formData.value.sectionA);
  console.log('Section B:', formData.value.sectionB);
  console.log('Section C:', formData.value.sectionC);
  console.log('=======================');
  
  // Show in toast
  const sectionAValues = Object.values(formData.value.sectionA).filter(v => v !== null && v !== undefined);
  const sectionBValues = Object.values(formData.value.sectionB).filter(v => v !== null && v !== undefined);
  const sectionCValues = Object.values(formData.value.sectionC).filter(v => v !== null && v !== undefined);
  
  useToast().add({
    title: "Data Borang Semasa",
    description: `A: ${sectionAValues.length}/6, B: ${sectionBValues.length}/3, C: ${sectionCValues.length}/2`,
    color: "info",
  });
};

// Auto-set current date when form loads
onMounted(() => {
  const today = new Date().toISOString().split('T')[0];
  formData.value.tarikhPenilaian = today;
  
  // Initialize all section values to null to ensure proper calculation
  Object.keys(formData.value.sectionA).forEach(key => {
    if (formData.value.sectionA[key] === undefined) {
      formData.value.sectionA[key] = null;
    }
  });
  
  Object.keys(formData.value.sectionB).forEach(key => {
    if (formData.value.sectionB[key] === undefined) {
      formData.value.sectionB[key] = null;
    }
  });
  
  Object.keys(formData.value.sectionC).forEach(key => {
    if (formData.value.sectionC[key] === undefined) {
      formData.value.sectionC[key] = null;
    }
  });
  

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

// Radio button styling improvements
:deep(.formkit-input[type="radio"]) {
  &:checked {
    background-color: #2563eb;
    border-color: #2563eb;
  }
  
  &:focus {
    box-shadow: 0 0 0 2px #ffffff, 0 0 0 4px #3b82f6;
  }
}

// Readonly input styling
:deep(.formkit-input[readonly]) {
  cursor: default;
  
  &:focus {
    outline: none;
    box-shadow: none;
  }
}

// Scoring section styling
.scoring-section {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 0.75rem;
  padding: 1.5rem;
  border: 2px solid #e2e8f0;
  transition: all 0.3s ease;
  
  &.section-complete {
    border-color: #10b981;
    background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
  }
}

// Grade indicator styling
.grade-indicator {
  &.grade-a { 
    color: #16a34a; 
    background-color: #dcfce7; 
    border: 2px solid #16a34a;
  }
  &.grade-b { 
    color: #2563eb; 
    background-color: #dbeafe; 
    border: 2px solid #2563eb;
  }
  &.grade-c { 
    color: #ea580c; 
    background-color: #fed7aa; 
    border: 2px solid #ea580c;
  }
  &.grade-d { 
    color: #dc2626; 
    background-color: #fecaca; 
    border: 2px solid #dc2626;
  }
}

// Responsive adjustments
@media (max-width: 768px) {
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
  
  // Adjust scoring display on mobile
  .grid-cols-1.md\\:grid-cols-2 {
    grid-template-columns: 1fr;
  }
}
</style>
