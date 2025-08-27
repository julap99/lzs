<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Borang Laporan Harian
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
              <h3 class="text-lg font-semibold">Maklumat Projek</h3>
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
                  name="tarikh"
                  label="TARIKH"
                  validation="required"
                  :validation-messages="{
                    required: 'Tarikh diperlukan',
                  }"
                />

                <FormKit
                  type="select"
                  name="hari"
                  label="HARI"
                  :options="hariOptions"
                  validation="required"
                  :validation-messages="{
                    required: 'Hari diperlukan',
                  }"
                />
              </div>
            </div>
          </rs-fieldset>

          <!-- Labor Details Section -->
          <rs-fieldset>
            <template #legend>
              <h3 class="text-lg font-semibold">A: KETERANGAN BURUH</h3>
            </template>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div v-for="(buruh, index) in buruhList" :key="index" class="labor-input-group">
                <div class="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div class="flex-1">
                    <label class="block text-sm font-medium text-gray-700 mb-1">{{ buruh.label }}</label>
                    <FormKit
                      type="number"
                      :name="`buruh.${buruh.key}`"
                      placeholder="0"
                      min="0"
                      max="999"
                      :classes="{
                        input: '!py-2 !text-center !border-gray-300 focus:!border-blue-500',
                        wrapper: '!mb-0',
                      }"
                    />
                  </div>
                  <div class="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded">
                    orang
                  </div>
                </div>
              </div>
            </div>
          </rs-fieldset>

          <!-- Machinery Details Section -->
          <rs-fieldset>
            <template #legend>
              <h3 class="text-lg font-semibold">B: KETERANGAN JENTERA</h3>
            </template>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <!-- Column 1 -->
              <div class="space-y-3">
                <h4 class="font-medium text-gray-700 mb-3 flex items-center">
                  <Icon name="ph:engine" class="w-4 h-4 mr-2" />
                  Jentera 1-10
                </h4>
                <div v-for="(jentera, index) in jenteraList.slice(0, 10)" :key="index" class="machinery-input-group">
                  <div class="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div class="flex-1">
                      <label class="block text-sm font-medium text-gray-700 mb-1">{{ jentera.label }}</label>
                      <FormKit
                        type="number"
                        :name="`jentera.${jentera.key}`"
                        placeholder="0"
                        min="0"
                        max="99"
                        :classes="{
                          input: '!py-2 !text-center !border-gray-300 focus:!border-blue-500',
                          wrapper: '!mb-0',
                        }"
                      />
                    </div>
                    <div class="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded">
                      unit
                    </div>
                  </div>
                </div>
              </div>

              <!-- Column 2 -->
              <div class="space-y-3">
                <h4 class="font-medium text-gray-700 mb-3 flex items-center">
                  <Icon name="ph:gear" class="w-4 h-4 mr-2" />
                  Jentera 11-19
                </h4>
                <div v-for="(jentera, index) in jenteraList.slice(10)" :key="index" class="machinery-input-group">
                  <div class="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div class="flex-1">
                      <label class="block text-sm font-medium text-gray-700 mb-1">{{ jentera.label }}</label>
                      <FormKit
                        type="number"
                        :name="`jentera.${jentera.key}`"
                        placeholder="0"
                        min="0"
                        max="99"
                        :classes="{
                          input: '!py-2 !text-center !border-gray-300 focus:!border-blue-500',
                          wrapper: '!mb-0',
                        }"
                      />
                    </div>
                    <div class="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded">
                      unit
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </rs-fieldset>

          <!-- Daily Activities Section -->
          <rs-fieldset>
            <template #legend>
              <h3 class="text-lg font-semibold">Aktiviti Harian</h3>
            </template>

            <div class="space-y-4">
              <FormKit
                type="textarea"
                name="aktiviti"
                label="AKTIVITI"
                placeholder="Sila nyatakan aktiviti harian yang dijalankan..."
                rows="4"
                validation="required"
                :validation-messages="{
                  required: 'Aktiviti harian diperlukan',
                }"
              />

              <!-- Weather Section with Clock-like Interface -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-3">CUACA</label>
                <div class="weather-clock-container">
                  <div class="weather-clock">
                    <div class="weather-clock-face">
                      <!-- Time markers -->
                      <div class="time-markers">
                        <div class="time-marker time-12">12</div>
                        <div class="time-marker time-3">3</div>
                        <div class="time-marker time-6">6</div>
                        <div class="time-marker time-9">9</div>
                      </div>
                      
                      <!-- Weather input fields positioned around the clock -->
                      <div class="weather-input weather-9am">
                        <div class="weather-input-wrapper">
                          <FormKit
                            type="select"
                            name="cuaca.sembilanPagi"
                            :options="cuacaOptions"
                            placeholder="9AM"
                            :classes="{
                              input: '!w-20 !text-xs !text-center !py-1',
                              wrapper: '!mb-0',
                            }"
                          />
                          <span class="time-label">9AM</span>
                        </div>
                      </div>
                      <div class="weather-input weather-12pm">
                        <div class="weather-input-wrapper">
                          <FormKit
                            type="select"
                            name="cuaca.duaBelasTengahHari"
                            :options="cuacaOptions"
                            placeholder="12PM"
                            :classes="{
                              input: '!w-20 !text-xs !text-center !py-1',
                              wrapper: '!mb-0',
                            }"
                          />
                          <span class="time-label">12PM</span>
                        </div>
                      </div>
                      <div class="weather-input weather-3pm">
                        <div class="weather-input-wrapper">
                          <FormKit
                            type="select"
                            name="cuaca.tigaPetang"
                            :options="cuacaOptions"
                            placeholder="3PM"
                            :classes="{
                              input: '!w-20 !text-xs !text-center !py-1',
                              wrapper: '!mb-0',
                            }"
                          />
                          <span class="time-label">3PM</span>
                        </div>
                      </div>
                      <div class="weather-input weather-6pm">
                        <div class="weather-input-wrapper">
                          <FormKit
                            type="select"
                            name="cuaca.enamPetang"
                            :options="cuacaOptions"
                            placeholder="6PM"
                            :classes="{
                              input: '!w-20 !text-xs !text-center !py-1',
                              wrapper: '!mb-0',
                            }"
                          />
                          <span class="time-label">6PM</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="weather-legend mt-4">
                    <p class="text-xs text-gray-600 text-center">
                      <Icon name="ph:sun" class="inline w-3 h-3 mr-1" />
                      Pilih keadaan cuaca untuk setiap masa yang ditunjukkan
                    </p>
                  </div>
                </div>
                
                <!-- Mobile Weather Alternative -->
                <div class="weather-mobile-alternative md:hidden mt-4">
                  <div class="grid grid-cols-2 gap-4">
                    <FormKit
                      type="select"
                      name="cuaca.sembilanPagi"
                      label="9:00 AM"
                      :options="cuacaOptions"
                      placeholder="Pilih cuaca"
                    />
                    <FormKit
                      type="select"
                      name="cuaca.duaBelasTengahHari"
                      label="12:00 PM"
                      :options="cuacaOptions"
                      placeholder="Pilih cuaca"
                    />
                    <FormKit
                      type="select"
                      name="cuaca.tigaPetang"
                      label="3:00 PM"
                      :options="cuacaOptions"
                      placeholder="Pilih cuaca"
                    />
                    <FormKit
                      type="select"
                      name="cuaca.enamPetang"
                      label="6:00 PM"
                      :options="cuacaOptions"
                      placeholder="Pilih cuaca"
                    />
                  </div>
                </div>
              </div>
            </div>
          </rs-fieldset>

          <!-- Materials and Instructions Section -->
          <rs-fieldset>
            <template #legend>
              <h3 class="text-lg font-semibold">Maklumat Tambahan</h3>
            </template>

            <div class="space-y-4">
              <FormKit
                type="textarea"
                name="penerimaanBahan"
                label="PENERIMAAN BAHAN BINAAN"
                placeholder="Sila senaraikan bahan binaan yang diterima hari ini..."
                rows="3"
              />

              <FormKit
                type="textarea"
                name="arahanEksekutif"
                label="ARAHAN EKSEKUTIF TEKNIKAL"
                placeholder="Sila nyatakan arahan dari eksekutif teknikal..."
                rows="3"
              />
            </div>
          </rs-fieldset>

          <!-- Signatures Section -->
          <rs-fieldset>
            <template #legend>
              <h3 class="text-lg font-semibold">Tandatangan & Kelulusan</h3>
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
                <h4 class="font-medium text-gray-700 mb-4">DISEDIAKAN OLEH</h4>
                
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
                <h4 class="font-medium text-gray-700 mb-4">DISEMAK OLEH</h4>
                
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
              Hantar Laporan
            </rs-button>
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
  title: "Borang Laporan Harian",
});

// Get route params
const route = useRoute();
const id = route.params.id;

// Computed property for form submission validation
const canSubmitForm = computed(() => {
  return (
    formData.value.projek?.trim() &&
    formData.value.daerahLokasi?.trim() &&
    formData.value.namaKontraktor?.trim() &&
    formData.value.tarikh &&
    formData.value.hari &&
    formData.value.aktiviti?.trim() &&
    formData.value.kontraktor.tandatangan &&
    formData.value.kontraktor.tarikh &&
    formData.value.eksekutif.tandatangan &&
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
    name: "Borang Laporan Harian",
    type: "current",
    path: `/BF-BTN/permohonan/pemantauan/${id}/borang/laporan-harian`,
  },
]);

// Options for form fields
const hariOptions = [
  { label: "Isnin", value: "isnin" },
  { label: "Selasa", value: "selasa" },
  { label: "Rabu", value: "rabu" },
  { label: "Khamis", value: "khamis" },
  { label: "Jumaat", value: "jumaat" },
  { label: "Sabtu", value: "sabtu" },
  { label: "Ahad", value: "ahad" },
];

const cuacaOptions = [
  { label: "☀️ Cerah", value: "cerah" },
  { label: "⛅ Mendung", value: "mendung" },
  { label: "🌦️ Hujan Ringan", value: "hujan_ringan" },
  { label: "🌧️ Hujan Lebat", value: "hujan_lebat" },
  { label: "🌫️ Berkabus", value: "berkabus" },
  { label: "💨 Angin Kencang", value: "angin_kencang" },
];

// Labor list
const buruhList = [
  { key: "tukangKayu", label: "Tukang Kayu" },
  { key: "tukangBesi", label: "Tukang Besi" },
  { key: "tukangKonkrit", label: "Tukang Konkrit" },
  { key: "mason", label: "Mason" },
  { key: "pekerjaME", label: "Pekerja M&E" },
  { key: "operator", label: "Operator" },
  { key: "tukangBata", label: "Tukang Bata" },
  { key: "pekerjaAm", label: "Pekerja Am" },
  { key: "plasterer", label: "Plasterer" },
  { key: "penyeliaTapak", label: "Penyelia Tapak" },
];

// Machinery list
const jenteraList = [
  { key: "concreteMixer", label: "Concrete Mixer" },
  { key: "backhoe", label: "Backhoe" },
  { key: "lorry", label: "Lorry" },
  { key: "roller", label: "Roller" },
  { key: "excavator", label: "Excavator" },
  { key: "compactor", label: "Compactor" },
  { key: "barbendMachine", label: "Barbend Machine" },
  { key: "rebarCutter", label: "Rebar Cutter" },
  { key: "vibrationPoker", label: "Vibration Poker" },
  { key: "weldingSet", label: "Welding Set" },
  { key: "oxyCutter", label: "Oxy Cutter" },
  { key: "elecDrill", label: "Elec Drill" },
  { key: "waterPump", label: "Water Pump" },
  { key: "breakerTool", label: "Breaker Tool" },
  { key: "genset", label: "Genset" },
  { key: "paverTool", label: "Paver Tool" },
  { key: "mobileCrane", label: "Mobile Crane" },
  { key: "pipingTool", label: "Piping Tool" },
  { key: "meTool", label: "M&E Tool" },
];

// Form data structure
const formData = ref({
  projek: "CADANGAN MEMBINA DAN MENYIAPKAN BANGUNAN RUMAH KEDIAMAN 3 BILIK UNTUK FAKIR/MISKIN DAN MUALLAF LEMBAGA ZAKAT SELANGOR (MAIS)",
  daerahLokasi: "",
  namaKontraktor: "",
  tarikh: "",
  hari: "",
  buruh: {
    tukangKayu: 0,
    tukangBesi: 0,
    tukangKonkrit: 0,
    mason: 0,
    pekerjaME: 0,
    operator: 0,
    tukangBata: 0,
    pekerjaAm: 0,
    plasterer: 0,
    penyeliaTapak: 0,
  },
  jentera: {
    concreteMixer: 0,
    backhoe: 0,
    lorry: 0,
    roller: 0,
    excavator: 0,
    compactor: 0,
    barbendMachine: 0,
    rebarCutter: 0,
    vibrationPoker: 0,
    weldingSet: 0,
    oxyCutter: 0,
    elecDrill: 0,
    waterPump: 0,
    breakerTool: 0,
    genset: 0,
    paverTool: 0,
    mobileCrane: 0,
    pipingTool: 0,
    meTool: 0,
  },
  aktiviti: "",
  cuaca: {
    sembilanPagi: "",
    duaBelasTengahHari: "",
    tigaPetang: "",
    enamPetang: "",
  },
  penerimaanBahan: "",
  arahanEksekutif: "",
  kontraktor: {
    tandatangan: "", // Will store signature data URL
    tarikh: "",
  },
  eksekutif: {
    tandatangan: "", // Will store signature data URL
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
  
  if (!formData.value.tarikh) {
    validationErrors.push('Tarikh diperlukan');
  }
  
  if (!formData.value.hari) {
    validationErrors.push('Hari diperlukan');
  }
  
  if (!formData.value.aktiviti?.trim()) {
    validationErrors.push('Aktiviti harian diperlukan');
  }
  
  if (!formData.value.kontraktor.tandatangan) {
    validationErrors.push('Tandatangan Kontraktor diperlukan');
  }
  
  if (!formData.value.kontraktor.tarikh) {
    validationErrors.push('Tarikh tandatangan Kontraktor diperlukan');
  }
  
  if (!formData.value.eksekutif.tandatangan) {
    validationErrors.push('Tandatangan Eksekutif Teknikal diperlukan');
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
      description: "Sedang menghantar laporan...",
      color: "blue",
    });
    
    // Here you would typically send the form data to your API
    console.log("Form data submitted:", formData.value);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Show success message
    useToast().add({
      title: "Berjaya",
      description: "Laporan harian telah berjaya dihantar dan disimpan",
      color: "green",
    });
    
    // Optionally redirect or show success page
    // await navigateTo(`/BF-BTN/permohonan/pemantauan/${id}`);
    
  } catch (error) {
    console.error("Error submitting form:", error);
    
    // Show error message
    useToast().add({
      title: "Ralat Sistem",
      description: "Gagal menghantar laporan. Sila cuba lagi atau hubungi sokongan teknikal.",
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
    tarikh: "",
    hari: "",
    buruh: {
      tukangKayu: 0,
      tukangBesi: 0,
      tukangKonkrit: 0,
      mason: 0,
      pekerjaME: 0,
      operator: 0,
      tukangBata: 0,
      pekerjaAm: 0,
      plasterer: 0,
      penyeliaTapak: 0,
    },
    jentera: {
      concreteMixer: 0,
      backhoe: 0,
      lorry: 0,
      roller: 0,
      excavator: 0,
      compactor: 0,
      barbendMachine: 0,
      rebarCutter: 0,
      vibrationPoker: 0,
      weldingSet: 0,
      oxyCutter: 0,
      elecDrill: 0,
      waterPump: 0,
      breakerTool: 0,
      genset: 0,
      paverTool: 0,
      mobileCrane: 0,
      pipingTool: 0,
      meTool: 0,
    },
    aktiviti: "",
    cuaca: {
      sembilanPagi: "",
      duaBelasTengahHari: "",
      tigaPetang: "",
      enamPetang: "",
    },
    penerimaanBahan: "",
    arahanEksekutif: "",
    kontraktor: {
      tandatangan: "",
      tarikh: "",
    },
    eksekutif: {
      tandatangan: "",
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

// Auto-set current date when form loads
onMounted(() => {
  const today = new Date();
  const dateString = today.toISOString().split('T')[0];
  const dayNames = ['ahad', 'isnin', 'selasa', 'rabu', 'khamis', 'jumaat', 'sabtu'];
  const dayName = dayNames[today.getDay()];
  
  formData.value.tarikh = dateString;
  formData.value.hari = dayName;
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

// Weather clock styling
.weather-clock-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.weather-clock {
  position: relative;
  width: 12rem;
  height: 12rem;
}

.weather-clock-face {
  position: relative;
  width: 100%;
  height: 100%;
  border: 4px solid #d1d5db;
  border-radius: 50%;
  background-color: #f9fafb;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0.5rem;
    height: 0.5rem;
    background-color: #374151;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    z-index: 10;
  }
}

.time-markers {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  
  .time-marker {
    position: absolute;
    color: #6b7280;
    font-weight: 600;
    font-size: 0.75rem;
    
    &.time-12 {
      top: 0.5rem;
      left: 50%;
      transform: translateX(-50%);
    }
    
    &.time-3 {
      right: 0.5rem;
      top: 50%;
      transform: translateY(-50%);
    }
    
    &.time-6 {
      bottom: 0.5rem;
      left: 50%;
      transform: translateX(-50%);
    }
    
    &.time-9 {
      left: 0.5rem;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}

.weather-input {
  position: absolute;
  z-index: 20;
  
  .weather-input-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    
    .time-label {
      font-size: 0.625rem;
      color: #374151;
      font-weight: 500;
      text-align: center;
      background: white;
      padding: 0.125rem 0.25rem;
      border-radius: 0.25rem;
      border: 1px solid #e5e7eb;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    }
  }
  
  &.weather-9am {
    top: -0.75rem;
    left: 50%;
    transform: translateX(-50%);
  }
  
  &.weather-12pm {
    top: 50%;
    right: -0.75rem;
    transform: translateY(-50%);
    
    .weather-input-wrapper {
      flex-direction: row-reverse;
      gap: 0.5rem;
    }
  }
  
  &.weather-3pm {
    bottom: -0.75rem;
    left: 50%;
    transform: translateX(-50%);
    
    .weather-input-wrapper {
      flex-direction: column-reverse;
    }
  }
  
  &.weather-6pm {
    top: 50%;
    left: -0.75rem;
    transform: translateY(-50%);
    
    .weather-input-wrapper {
      flex-direction: row;
      gap: 0.5rem;
    }
  }
}

// Hide clock on mobile, show alternative
.weather-mobile-alternative {
  display: none;
}

@media (max-width: 768px) {
  .weather-clock-container {
    display: none;
  }
  
  .weather-mobile-alternative {
    display: block;
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
  
  // Weather clock adjustments for tablets
  .weather-clock {
    width: 10rem;
    height: 10rem;
  }
  
  .weather-input {
    :deep(.formkit-input) {
      width: 4.5rem !important;
      font-size: 0.7rem !important;
    }
    
    .weather-input-wrapper {
      .time-label {
        font-size: 0.6rem;
      }
    }
  }
}

// Labor and machinery input styling
:deep(.formkit-input[type="number"]) {
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    appearance: none;
    margin: 0;
  }
  
  &[type=number] {
    -moz-appearance: textfield;
    appearance: textfield;
  }
}
</style>
