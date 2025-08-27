<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Borang Penggunaan & Pemeriksaan Bahan / Peralatan / Mock-up
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

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="md:col-span-2">
                <FormKit
                  type="textarea"
                  name="projek"
                  label="PROJEK"
                  placeholder="CADANGAN MEMBINA DAN MENYIAPKAN BANGUNAN RUMAH KEDIAMAN 3BILIK UNTUK FAKIR/MISKIN DAN MUALLAF LEMBAGA ZAKAT SELANGOR (MAIS)"
                  rows="3"
                  validation="required"
                  :validation-messages="{
                    required: 'Maklumat projek diperlukan',
                  }"
                />
              </div>

              <FormKit
                type="text"
                name="noKontrak"
                label="NO. KONTRAK"
                placeholder="Masukkan nombor kontrak"
                validation="required"
                :validation-messages="{
                  required: 'Nombor kontrak diperlukan',
                }"
              />

              <div class="md:col-span-2">
                <FormKit
                  type="textarea"
                  name="kontraktorPembekal"
                  label="KONTRAKTOR/PEMBEKAL"
                  placeholder="Masukkan maklumat kontraktor/pembekal"
                  rows="3"
                  validation="required"
                  :validation-messages="{
                    required: 'Maklumat kontraktor/pembekal diperlukan',
                  }"
                />
              </div>
            </div>
          </rs-fieldset>

          <!-- Item Description Table Section -->
          <rs-fieldset>
            <template #legend>
              <h3 class="text-lg font-semibold">Senarai Item</h3>
            </template>

            <div class="overflow-x-auto">
              <table class="w-full border-collapse border border-gray-300">
                <thead>
                  <tr class="bg-gray-100">
                    <th
                      class="border border-gray-300 p-3 text-left font-semibold w-1/3"
                    >
                      Deskripsi Item
                    </th>
                    <th
                      class="border border-gray-300 p-3 text-center font-semibold"
                    >
                      TANGKI AIR
                    </th>
                    <th
                      class="border border-gray-300 p-3 text-center font-semibold"
                    >
                      BUMBUNG
                    </th>
                    <th
                      class="border border-gray-300 p-3 text-center font-semibold"
                    >
                      TANGKI SEPTIK
                    </th>
                    <th
                      class="border border-gray-300 p-3 text-center font-semibold w-1/6"
                    >
                      Kod Item
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="border border-gray-300 p-3 font-medium">
                      Pengilang
                    </td>
                    <td class="border border-gray-300 p-3">
                      <FormKit
                        type="text"
                        name="tangkiAir.pengilang"
                        placeholder="Masukkan pengilang"
                        :classes="{
                          input: '!border-0 !p-0 !shadow-none !bg-transparent',
                        }"
                      />
                    </td>
                    <td class="border border-gray-300 p-3">
                      <FormKit
                        type="text"
                        name="bumbung.pengilang"
                        placeholder="Masukkan pengilang"
                        :classes="{
                          input: '!border-0 !p-0 !shadow-none !bg-transparent',
                        }"
                      />
                    </td>
                    <td class="border border-gray-300 p-3">
                      <FormKit
                        type="text"
                        name="tangkiSeptik.pengilang"
                        placeholder="Masukkan pengilang"
                        :classes="{
                          input: '!border-0 !p-0 !shadow-none !bg-transparent',
                        }"
                      />
                    </td>
                    <td class="border border-gray-300 p-3">
                      <FormKit
                        type="text"
                        name="kodItem.pengilang"
                        placeholder="Kod"
                        :classes="{
                          input: '!border-0 !p-0 !shadow-none !bg-transparent',
                        }"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td class="border border-gray-300 p-3 font-medium">
                      Negara Asal
                    </td>
                    <td class="border border-gray-300 p-3">
                      <FormKit
                        type="text"
                        name="tangkiAir.negaraAsal"
                        placeholder="Masukkan negara asal"
                        :classes="{
                          input: '!border-0 !p-0 !shadow-none !bg-transparent',
                        }"
                      />
                    </td>
                    <td class="border border-gray-300 p-3">
                      <FormKit
                        type="text"
                        name="bumbung.negaraAsal"
                        placeholder="Masukkan negara asal"
                        :classes="{
                          input: '!border-0 !p-0 !shadow-none !bg-transparent',
                        }"
                      />
                    </td>
                    <td class="border border-gray-300 p-3">
                      <FormKit
                        type="text"
                        name="tangkiSeptik.negaraAsal"
                        placeholder="Masukkan negara asal"
                        :classes="{
                          input: '!border-0 !p-0 !shadow-none !bg-transparent',
                        }"
                      />
                    </td>
                    <td class="border border-gray-300 p-3">
                      <FormKit
                        type="text"
                        name="kodItem.negaraAsal"
                        placeholder="Kod"
                        :classes="{
                          input: '!border-0 !p-0 !shadow-none !bg-transparent',
                        }"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td class="border border-gray-300 p-3 font-medium">
                      Pengedar Tempatan
                    </td>
                    <td class="border border-gray-300 p-3">
                      <FormKit
                        type="text"
                        name="tangkiAir.pengedarTempatan"
                        placeholder="Masukkan pengedar tempatan"
                        :classes="{
                          input: '!border-0 !p-0 !shadow-none !bg-transparent',
                        }"
                      />
                    </td>
                    <td class="border border-gray-300 p-3">
                      <FormKit
                        type="text"
                        name="bumbung.pengedarTempatan"
                        placeholder="Masukkan pengedar tempatan"
                        :classes="{
                          input: '!border-0 !p-0 !shadow-none !bg-transparent',
                        }"
                      />
                    </td>
                    <td class="border border-gray-300 p-3">
                      <FormKit
                        type="text"
                        name="tangkiSeptik.pengedarTempatan"
                        placeholder="Masukkan pengedar tempatan"
                        :classes="{
                          input: '!border-0 !p-0 !shadow-none !bg-transparent',
                        }"
                      />
                    </td>
                    <td class="border border-gray-300 p-3">
                      <FormKit
                        type="text"
                        name="kodItem.pengedarTempatan"
                        placeholder="Kod"
                        :classes="{
                          input: '!border-0 !p-0 !shadow-none !bg-transparent',
                        }"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td class="border border-gray-300 p-3 font-medium">
                      Model
                    </td>
                    <td class="border border-gray-300 p-3">
                      <FormKit
                        type="text"
                        name="tangkiAir.model"
                        placeholder="Masukkan model"
                        :classes="{
                          input: '!border-0 !p-0 !shadow-none !bg-transparent',
                        }"
                      />
                    </td>
                    <td class="border border-gray-300 p-3">
                      <FormKit
                        type="text"
                        name="bumbung.model"
                        placeholder="Masukkan model"
                        :classes="{
                          input: '!border-0 !p-0 !shadow-none !bg-transparent',
                        }"
                      />
                    </td>
                    <td class="border border-gray-300 p-3">
                      <FormKit
                        type="text"
                        name="tangkiSeptik.model"
                        placeholder="Masukkan model"
                        :classes="{
                          input: '!border-0 !p-0 !shadow-none !bg-transparent',
                        }"
                      />
                    </td>
                    <td class="border border-gray-300 p-3">
                      <FormKit
                        type="text"
                        name="kodItem.model"
                        placeholder="Kod"
                        :classes="{
                          input: '!border-0 !p-0 !shadow-none !bg-transparent',
                        }"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </rs-fieldset>

          <!-- Contractor/Supplier Declaration Section -->
          <rs-fieldset>
            <template #legend>
              <h3 class="text-lg font-semibold">
                Perakuan Kontraktor/Pembekal
              </h3>
            </template>

            <div class="space-y-4">
              <p class="text-gray-700 italic">
                Saya dengan ini berjanji akan memastikan bahan/peralatan/mock up
                yang dicadangkan mengikut spesifikasi dan berfungsi seperti di
                dalam kontrak.
              </p>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-3"
                  >Disertakan:</label
                >
                <div
                  class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"
                >
                  <FormKit
                    type="checkbox"
                    name="dokumen.katalog"
                    label="Katalog"
                    :classes="{
                      wrapper: 'flex items-center space-x-2',
                      input: '!w-4 !h-4',
                      label: '!text-sm !font-medium',
                    }"
                  />
                  <FormKit
                    type="checkbox"
                    name="dokumen.lukisan"
                    label="Lukisan"
                    :classes="{
                      wrapper: 'flex items-center space-x-2',
                      input: '!w-4 !h-4',
                      label: '!text-sm !font-medium',
                    }"
                  />
                  <FormKit
                    type="checkbox"
                    name="dokumen.sample"
                    label="Sample/DO"
                    :classes="{
                      wrapper: 'flex items-center space-x-2',
                      input: '!w-4 !h-4',
                      label: '!text-sm !font-medium',
                    }"
                  />
                  <FormKit
                    type="checkbox"
                    name="dokumen.spesifikasi"
                    label="Spesifikasi"
                    :classes="{
                      wrapper: 'flex items-center space-x-2',
                      input: '!w-4 !h-4',
                      label: '!text-sm !font-medium',
                    }"
                  />
                  <FormKit
                    type="checkbox"
                    name="dokumen.sijil"
                    label="Sijil"
                    :classes="{
                      wrapper: 'flex items-center space-x-2',
                      input: '!w-4 !h-4',
                      label: '!text-sm !font-medium',
                    }"
                  />
                </div>
              </div>
            </div>
          </rs-fieldset>

          <!-- Important Notice Section -->
          <rs-fieldset>
            <template #legend>
              <h3 class="text-lg font-semibold text-red-600">PENTING</h3>
            </template>

            <div class="bg-red-50 border border-red-200 rounded-lg p-4">
              <p class="text-sm text-red-800">
                Sila rujuk Polisi Perlindungan Data Peribadi Kami ("Notis
                Privasi"). Dengan memberikan data peribadi anda serta
                menandatangani borang ini, anda menyatakan kebenaran dan
                persetujuan anda kepada kami terhadap terma-terma yang
                terkandung didalam Notis tersebut. Notis tersebut boleh didapati
                di laman web kami di
                <a
                  href="https://www.zakatselangor.com.my"
                  target="_blank"
                  class="text-blue-600 hover:text-blue-800 underline"
                >
                  www.zakatselangor.com.my </a
                >.
              </p>
            </div>
          </rs-fieldset>

          <!-- Contractor/Supplier Signature Section -->
          <rs-fieldset>
            <template #legend>
              <h3 class="text-lg font-semibold">
                Tandatangan Kontraktor/Pembekal
              </h3>
            </template>
            
            <div class="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p class="text-sm text-blue-800">
                <Icon name="ph:info" class="inline w-4 h-4 mr-1" />
                <strong>Panduan:</strong> Gunakan tetikus atau sentuh skrin untuk menandatangani borang ini. Klik "Simpan" selepas menandatangani.
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Tandatangan Kontraktor/Pembekal <span class="text-red-500">*</span>
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
                name="kontraktor.jawatan"
                label="Jawatan"
                placeholder="Masukkan jawatan"
                validation="required"
                :validation-messages="{
                  required: 'Jawatan diperlukan',
                }"
              />

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
          </rs-fieldset>

          <!-- Technical Executive Decision Section -->
          <rs-fieldset>
            <template #legend>
              <h3 class="text-lg font-semibold">
                Keputusan Eksekutif Teknikal
              </h3>
            </template>

            <div class="space-y-4">
              <div class="flex flex-col space-y-3">
                <FormKit
                  type="radio"
                  name="keputusan.status"
                  :options="[
                    { label: 'Dipersetujui', value: 'dipersetujui' },
                    {
                      label: 'Ditolak dan perlu kemukakan semula',
                      value: 'ditolak',
                    },
                  ]"
                  validation="required"
                  :validation-messages="{
                    required: 'Sila pilih keputusan',
                  }"
                  :classes="{
                    fieldset: 'border-0 !p-0',
                    legend: '!font-semibold !text-sm mb-0',
                    options: '!flex !flex-col gap-3 mt-3',
                  }"
                />
              </div>

              <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p class="text-sm text-yellow-800">
                  <strong>Nota:</strong> Walaupun perkara di atas dipersetujui,
                  adalah menjadi tanggungjawab kontraktor bagi memastikan
                  bahan/peralatan/mock up mematuhi kehendak spesifikasi dan
                  berfungsi seperti yang telah dinyatakan dalam kontrak.
                </p>
              </div>
            </div>
          </rs-fieldset>

          <!-- Technical Executive Signature Section -->
          <rs-fieldset>
            <template #legend>
              <h3 class="text-lg font-semibold">
                Tandatangan Eksekutif Teknikal
              </h3>
            </template>
            
            <div class="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p class="text-sm text-blue-800">
                <Icon name="ph:info" class="inline w-4 h-4 mr-1" />
                <strong>Panduan:</strong> Gunakan tetikus atau sentuh skrin untuk menandatangani borang ini. Klik "Simpan" selepas menandatangani.
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="md:col-span-2">
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
                name="eksekutif.jawatan"
                label="Jawatan/Cop Rasmi"
                placeholder="Masukkan jawatan"
                validation="required"
                :validation-messages="{
                  required: 'Jawatan diperlukan',
                }"
              />

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
              Hantar Borang
            </rs-button>
          </div>
        </FormKit>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import SignaturePad from "~/components/SignaturePad.vue";

definePageMeta({
  title: "Borang Penggunaan & Pemeriksaan Bahan",
});

// Get route params
const route = useRoute();
const id = route.params.id;

// Computed property for form submission validation
const canSubmitForm = computed(() => {
  return (
    formData.value.projek?.trim() &&
    formData.value.noKontrak?.trim() &&
    formData.value.kontraktorPembekal?.trim() &&
    formData.value.kontraktor.tandatangan &&
    formData.value.kontraktor.nama?.trim() &&
    formData.value.kontraktor.jawatan?.trim() &&
    formData.value.kontraktor.tarikh &&
    formData.value.keputusan.status &&
    formData.value.eksekutif.tandatangan &&
    formData.value.eksekutif.nama?.trim() &&
    formData.value.eksekutif.jawatan?.trim() &&
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
    name: "Borang Penggunaan & Pemeriksaan Bahan",
    type: "current",
    path: `/BF-BTN/permohonan/pemantauan/${id}/borang/penggunaan-pemeriksaan-bahan`,
  },
]);

// Form data structure
const formData = ref({
  projek:
    "CADANGAN MEMBINA DAN MENYIAPKAN BANGUNAN RUMAH KEDIAMAN 3BILIK UNTUK FAKIR/MISKIN DAN MUALLAF LEMBAGA ZAKAT SELANGOR (MAIS)",
  noKontrak: "",
  kontraktorPembekal: "",
  tangkiAir: {
    pengilang: "",
    negaraAsal: "",
    pengedarTempatan: "",
    model: "",
  },
  bumbung: {
    pengilang: "",
    negaraAsal: "",
    pengedarTempatan: "",
    model: "",
  },
  tangkiSeptik: {
    pengilang: "",
    negaraAsal: "",
    pengedarTempatan: "",
    model: "",
  },
  kodItem: {
    pengilang: "",
    negaraAsal: "",
    pengedarTempatan: "",
    model: "",
  },
  dokumen: {
    katalog: false,
    lukisan: false,
    sample: false,
    spesifikasi: false,
    sijil: false,
  },
      kontraktor: {
      tandatangan: "", // Will store signature data URL
      jawatan: "",
      nama: "",
      tarikh: "",
    },
  keputusan: {
    status: "",
  },
  eksekutif: {
    tandatangan: "", // Will store signature data URL
    jawatan: "",
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
  
  if (!formData.value.noKontrak?.trim()) {
    validationErrors.push('Nombor kontrak diperlukan');
  }
  
  if (!formData.value.kontraktorPembekal?.trim()) {
    validationErrors.push('Maklumat kontraktor/pembekal diperlukan');
  }
  
  if (!formData.value.kontraktor.tandatangan) {
    validationErrors.push('Tandatangan Kontraktor/Pembekal diperlukan');
  }
  
  if (!formData.value.kontraktor.nama?.trim()) {
    validationErrors.push('Nama Kontraktor diperlukan');
  }
  
  if (!formData.value.kontraktor.jawatan?.trim()) {
    validationErrors.push('Jawatan Kontraktor diperlukan');
  }
  
  if (!formData.value.kontraktor.tarikh) {
    validationErrors.push('Tarikh tandatangan Kontraktor diperlukan');
  }
  
  if (!formData.value.keputusan.status) {
    validationErrors.push('Keputusan Eksekutif Teknikal diperlukan');
  }
  
  if (!formData.value.eksekutif.tandatangan) {
    validationErrors.push('Tandatangan Eksekutif Teknikal diperlukan');
  }
  
  if (!formData.value.eksekutif.nama?.trim()) {
    validationErrors.push('Nama Eksekutif Teknikal diperlukan');
  }
  
  if (!formData.value.eksekutif.jawatan?.trim()) {
    validationErrors.push('Jawatan Eksekutif Teknikal diperlukan');
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
      description: "Sedang menghantar borang...",
      color: "blue",
    });
    
    // Here you would typically send the form data to your API
    console.log("Form data submitted:", formData.value);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Show success message
    useToast().add({
      title: "Berjaya",
      description: "Borang telah berjaya dihantar dan disimpan",
      color: "green",
    });

    // Optionally redirect or show success page
    // await navigateTo(`/BF-BTN/permohonan/pemantauan/${id}`);
  } catch (error) {
    console.error("Error submitting form:", error);

    // Show error message
    useToast().add({
      title: "Ralat Sistem",
      description: "Gagal menghantar borang. Sila cuba lagi atau hubungi sokongan teknikal.",
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
    projek:
      "CADANGAN MEMBINA DAN MENYIAPKAN BANGUNAN RUMAH KEDIAMAN 3BILIK UNTUK FAKIR/MISKIN DAN MUALLAF LEMBAGA ZAKAT SELANGOR (MAIS)",
    noKontrak: "",
    kontraktorPembekal: "",
    tangkiAir: {
      pengilang: "",
      negaraAsal: "",
      pengedarTempatan: "",
      model: "",
    },
    bumbung: {
      pengilang: "",
      negaraAsal: "",
      pengedarTempatan: "",
      model: "",
    },
    tangkiSeptik: {
      pengilang: "",
      negaraAsal: "",
      pengedarTempatan: "",
      model: "",
    },
    kodItem: {
      pengilang: "",
      negaraAsal: "",
      pengedarTempatan: "",
      model: "",
    },
    dokumen: {
      katalog: false,
      lukisan: false,
      sample: false,
      spesifikasi: false,
      sijil: false,
    },
    kontraktor: {
      tandatangan: "",
      jawatan: "",
      nama: "",
      tarikh: "",
    },
    keputusan: {
      status: "",
    },
    eksekutif: {
      tandatangan: "",
      jawatan: "",
      nama: "",
      tarikh: "",
    },
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

  useToast().add({
    title: "Berjaya",
    description: "Borang telah direset",
    color: "blue",
  });
};

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

  th,
  td {
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
</style>
