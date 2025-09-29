<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="p-6">
      <div class="mb-6">
        <!-- Progress indicator -->
        <div class="mb-6">
          <div class="flex justify-between mb-3">
            <div
              v-for="step in steps"
              :key="step.id"
              class="text-center flex-1 cursor-pointer px-2 py-1 rounded transition-all duration-200"
              :class="{ 
                'font-semibold text-primary': currentStep >= step.id,
                'text-gray-600 hover:text-gray-800': currentStep < step.id
              }"
              @click="goToStep(step.id)"
            >
              <div class="text-xs sm:text-sm">{{ step.label }}</div>
            </div>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2.5">
            <div
              class="bg-primary h-2.5 rounded-full transition-all duration-300"
              :style="`width: ${currentStep >= totalSteps ? 100 : (currentStep / totalSteps) * 100}%`"
            ></div>
          </div>
        </div>
      </div>

      <!-- Step 1: Maklumat Recipient -->
      <div v-if="currentStep === 1" class="space-y-6">
        <FormKit
          type="form"
          :actions="false"
          @submit="nextStep"
          #default="{ value }"
        >
          <FormKit
            type="select"
            name="jenisRecipient"
            label="Jenis Recipient"
            validation="required"
            placeholder="Pilih jenis recipient"
            :options="[
              { label: 'Individu', value: 'individu' },
              { label: 'Syarikat', value: 'syarikat' },
            ]"
            v-model="formData.jenisRecipient"
          />

          <FormKit
            v-if="formData.jenisRecipient === 'individu'"
            type="text"
            name="namaPenuh"
            label="Nama Penuh"
            validation="required"
            placeholder="Masukkan nama penuh"
            v-model="formData.namaPenuh"
          />

          <FormKit
            v-if="formData.jenisRecipient === 'syarikat'"
            type="text"
            name="namaSyarikat"
            label="Nama Syarikat"
            validation="required"
            placeholder="Masukkan nama syarikat"
            v-model="formData.namaSyarikat"
          />

          <FormKit
            type="select"
            name="jenisPengenalan"
            label="Jenis Pengenalan"
            validation="required"
            placeholder="Pilih jenis pengenalan"
            :options="jenisPengenalanOptions"
            v-model="formData.jenisPengenalan"
            :disabled="!formData.jenisRecipient"
          />

          <FormKit
            v-if="['mykad', 'passport_no'].includes(formData.jenisPengenalan)"
            type="text"
            name="idPengenalan"
            label="ID Pengenalan"
            validation="required"
            :placeholder="getIdPlaceholder()"
            v-model="formData.idPengenalan"
          />

          <FormKit
            v-if="formData.jenisPengenalan === 'id_syarikat'"
            type="text"
            name="idSyarikat"
            label="ID Syarikat"
            validation="required"
            placeholder="Contoh: SY123456-X"
            v-model="formData.idSyarikat"
          />

          <div class="flex justify-end mt-6">
            <rs-button type="submit" @click="nextStep">Seterusnya</rs-button>
          </div>
        </FormKit>
      </div>

      <!-- Step 2: Maklumat Akaun Bank -->
      <div v-if="currentStep === 2" class="space-y-6">
        <FormKit
          type="form"
          :actions="false"
          @submit="nextStep"
          #default="{ value }"
        >
          <FormKit
            type="select"
            name="namaBank"
            label="Nama Bank"
            validation="required"
            placeholder="Pilih bank"
            :options="bankOptions"
            v-model="formData.namaBank"
          />

          <FormKit
            type="text"
            name="noAkaunBank"
            label="No Akaun Bank"
            validation="required|length:10,16|number"
            placeholder="Masukkan nombor akaun bank (10-16 digit)"
            v-model="formData.noAkaunBank"
          />

          <FormKit
            type="text"
            name="penamaAkaunBank"
            label="Penama Akaun Bank"
            validation="required"
            placeholder="Masukkan nama pemilik akaun"
            v-model="formData.penamaAkaunBank"
          />

          <FormKit
            type="text"
            name="swiftCode"
            label="Swift Code"
            v-model="formData.swiftCode"
            readonly
            help="Swift code akan dipaparkan secara automatik berdasarkan bank yang dipilih"
          />

          <div class="flex justify-between mt-6">
            <rs-button variant="primary-outline" @click="prevStep">
              Kembali
            </rs-button>
            <rs-button type="submit" @click="nextStep">Seterusnya</rs-button>
          </div>
        </FormKit>
      </div>

      <!-- Step 3: Dokumen Sokongan -->
      <div v-if="currentStep === 3" class="space-y-6">
        <FormKit
          type="form"
          :actions="false"
          @submit="submitForm"
          #default="{ value }"
        >
          <div class="bg-yellow-50 text-yellow-800 p-4 rounded-md mb-4">
            <p class="font-medium">Sila muat naik dokumen berikut:</p>
            <ul class="list-disc ml-5 mt-2">
              <li>Dokumen Pengenalan (ID Pengenalan/Passport No/ID Syarikat)</li>
              <li>Dokumen Sokongan Bank</li>
              <li>Dokumen Tambahan (jika ada)</li>
            </ul>
            <p class="mt-2">Format yang dibenarkan: PDF / JPG / PNG</p>
          </div>

          <FormKit
            type="file"
            name="dokumenPengenalan"
            label="Dokumen Pengenalan"
            validation="required"
            accept=".pdf,.jpg,.jpeg,.png"
            help="Muat naik dokumen pengenalan (ID Pengenalan/Passport No/ID Syarikat)"
            v-model="formData.dokumenPengenalan"
          />

          <FormKit
            type="file"
            name="dokumenSokonganBank"
            label="Dokumen Sokongan Bank"
            validation="required"
            accept=".pdf,.jpg,.jpeg,.png"
            help="Muat naik dokumen sokongan bank seperti penyata bank"
            v-model="formData.dokumenSokonganBank"
          />

          <FormKit
            type="file"
            name="dokumenTambahan"
            label="Dokumen Tambahan (jika ada)"
            accept=".pdf,.jpg,.jpeg,.png"
            multiple="true"
            help="Muat naik dokumen tambahan yang berkaitan"
            v-model="formData.dokumenTambahan"
          />

          <div class="flex justify-between mt-6">
            <rs-button variant="primary-outline" @click="prevStep">
              Kembali
            </rs-button>
            <div class="flex gap-3">
              <rs-button type="button" variant="secondary" @click="showDraftModal = true">
                Simpan DRAF
              </rs-button>
              <rs-button type="submit" @click="submitForm">
                Hantar Permohonan
              </rs-button>
            </div>
          </div>
        </FormKit>
      </div>

      <!-- Submission Success -->
      <div v-if="currentStep === 4" class="text-center py-8">
        <div class="mb-6">
          <div
            class="mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-8 w-8 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
        <h2 class="text-2xl font-bold text-green-600 mb-2">
          Permohonan Berjaya Dihantar!
        </h2>
        <p class="text-gray-600 mb-4">
          Permohonan anda telah berjaya dihantar. Sila ambil perhatian terhadap
          nombor rujukan anda:
        </p>
        <div class="bg-gray-100 p-4 rounded-md inline-block mx-auto mb-6">
          <span class="font-mono text-lg font-bold">{{ referenceNumber }}</span>
        </div>
        <p class="text-gray-600 mb-6">
          Kami akan memproses permohonan anda dalam masa 5-7 hari bekerja. Anda
          akan menerima notifikasi melalui emel yang didaftarkan.
        </p>
        <div class="flex justify-center gap-4">
          <rs-button variant="primary-outline" @click="printApplication">
            Cetak Bukti Permohonan
          </rs-button>
          <rs-button variant="primary" @click="goToHomepage">
            Kembali ke Halaman Utama
          </rs-button>
        </div>
      </div>
    </rs-card>

    <!-- Simpan DRAF Confirmation Modal -->
    <rs-modal v-model="showDraftModal" title="Sahkan Simpan DRAF" size="lg">
      <template #body>
        <div class="space-y-4">
          <p class="text-sm text-gray-700">Sila semak ringkasan maklumat sebelum simpan:</p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <label class="block text-gray-600 font-medium">Jenis Recipient</label>
              <p class="text-gray-900">{{ formData.jenisRecipient || '-' }}</p>
            </div>
            <div v-if="formData.jenisRecipient === 'individu'">
              <label class="block text-gray-600 font-medium">Nama Penuh</label>
              <p class="text-gray-900">{{ formData.namaPenuh || '-' }}</p>
            </div>
            <div v-if="formData.jenisRecipient === 'syarikat'">
              <label class="block text-gray-600 font-medium">Nama Syarikat</label>
              <p class="text-gray-900">{{ formData.namaSyarikat || '-' }}</p>
            </div>
            <div>
              <label class="block text-gray-600 font-medium">Jenis Pengenalan</label>
              <p class="text-gray-900">{{ getJenisPengenalanLabel() || '-' }}</p>
            </div>
            <div v-if="formData.jenisPengenalan === 'mykad' || formData.jenisPengenalan === 'passport_no'">
              <label class="block text-gray-600 font-medium">ID Pengenalan</label>
              <p class="text-gray-900">{{ formData.idPengenalan || '-' }}</p>
            </div>
            <div v-if="formData.jenisPengenalan === 'id_syarikat'">
              <label class="block text-gray-600 font-medium">ID Syarikat</label>
              <p class="text-gray-900">{{ formData.idSyarikat || '-' }}</p>
            </div>
            <div class="md:col-span-2"><hr class="my-2" /></div>
            <div>
              <label class="block text-gray-600 font-medium">Nama Bank</label>
              <p class="text-gray-900">{{ formData.namaBank || '-' }}</p>
            </div>
            <div>
              <label class="block text-gray-600 font-medium">No Akaun Bank</label>
              <p class="text-gray-900">{{ formData.noAkaunBank || '-' }}</p>
            </div>
            <div>
              <label class="block text-gray-600 font-medium">Penama Akaun Bank</label>
              <p class="text-gray-900">{{ formData.penamaAkaunBank || '-' }}</p>
            </div>
            <div>
              <label class="block text-gray-600 font-medium">Swift Code</label>
              <p class="text-gray-900">{{ getSwiftCode(formData.namaBank) || '-' }}</p>
            </div>
            <div>
              <label class="block text-gray-600 font-medium">Dokumen Pengenalan</label>
              <rs-badge :variant="hasDokumenPengenalan ? 'success' : 'danger'">{{ hasDokumenPengenalan ? 'Dilampirkan' : 'Tiada' }}</rs-badge>
            </div>
            <div>
              <label class="block text-gray-600 font-medium">Dokumen Sokongan Bank</label>
              <rs-badge :variant="hasDokumenSokonganBank ? 'success' : 'danger'">{{ hasDokumenSokonganBank ? 'Dilampirkan' : 'Tiada' }}</rs-badge>
            </div>
            <div>
              <label class="block text-gray-600 font-medium">Dokumen Tambahan</label>
              <rs-badge :variant="dokumenTambahanCount > 0 ? 'success' : 'warning'">{{ dokumenTambahanCount > 0 ? (dokumenTambahanCount + ' dokumen') : 'Tiada' }}</rs-badge>
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <rs-button variant="secondary-outline" @click="showDraftModal = false">Batal</rs-button>
          <rs-button variant="primary" @click="confirmSaveDraft">Ya, Simpan</rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const breadcrumb = ref([
  {
    name: "Recipient",
    type: "link",
    path: "/BF-PRF/TP/PP/01",
  },
  {
    name: "Pendaftaran Baru",
    type: "current",
    path: "/BF-PRF/TP/PP/02",
  },
]);

const totalSteps = 3; // 3 form steps (success step is separate)
const currentStep = ref(1);
const showDraftModal = ref(false);

const steps = [
  { id: 1, label: 'Maklumat Recipient' },
  { id: 2, label: 'Maklumat Bank' },
  { id: 3, label: 'Dokumen Sokongan' },
];

const referenceNumber = ref(
  "NAS-RE-" +
    Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, "0")
);

const formData = ref({
  // Step 1: Maklumat Recipient
  jenisRecipient: "",
  namaPenuh: "",
  namaSyarikat: "",
  jenisPengenalan: "",
  idPengenalan: "",
  idSyarikat: "",

  // Step 2: Maklumat Akaun Bank
  namaBank: "",
  noAkaunBank: "",
  penamaAkaunBank: "",
  swiftCode: "",

  // Step 3: Dokumen Sokongan
  dokumenPengenalan: null,
  dokumenSokonganBank: null,
  dokumenTambahan: [],
});

// Computed options for Jenis Pengenalan based on Jenis Recipient
const jenisPengenalanOptions = computed(() => {
  if (formData.value.jenisRecipient === "individu") {
    return [
      { label: "ID Pengenalan", value: "mykad" },
      { label: "Passport No", value: "passport_no" },
    ];
  } else if (formData.value.jenisRecipient === "syarikat") {
    return [
      { label: "ID Syarikat", value: "id_syarikat" },
    ];
  }
  return [];
});

const bankOptions = [
  'Maybank',
  'CIMB Bank',
  'Public Bank',
  'RHB Bank',
  'Hong Leong Bank',
  'AmBank',
  'Bank Islam',
  'Bank Rakyat',
  'Bank Muamalat',
  'OCBC Bank',
  'HSBC Bank',
  'Standard Chartered Bank',
  'Citibank',
  'UOB Bank'
];

// Swift code mapping for Malaysian banks
const swiftCodeMapping = {
  'Maybank': 'MBBEMYKL',
  'CIMB Bank': 'CIBBMYKL',
  'Public Bank': 'PBBEMYKL',
  'RHB Bank': 'RHBBMYKL',
  'Hong Leong Bank': 'HLBBMYKL',
  'AmBank': 'ARBKMYKL',
  'Bank Islam': 'BIMBMYKL',
  'Bank Rakyat': 'RABBMYKL',
  'Bank Muamalat': 'BMMBMYKL',
  'OCBC Bank': 'OCBCMYKL',
  'HSBC Bank': 'HBMBMYKL',
  'Standard Chartered Bank': 'SCBLMYKX',
  'Citibank': 'CITIMYKL',
  'UOB Bank': 'UOVBMYKL'
};

const getIdPlaceholder = () => {
  switch (formData.value.jenisPengenalan) {
    case "mykad": return "Contoh: 880101123456";
    case "passport_no": return "Contoh: A12345678 (A untuk Selangor)";
    default: return "Sila pilih jenis pengenalan dahulu";
  }
};

// Function to get Swift code based on selected bank
const getSwiftCode = (bankName) => {
  return swiftCodeMapping[bankName] || '';
};

// Helper function to get the label for jenis pengenalan
const getJenisPengenalanLabel = () => {
  const option = jenisPengenalanOptions.value.find(opt => opt.value === formData.value.jenisPengenalan);
  return option ? option.label : '';
};

// Computed properties to check if documents are attached
const hasDokumenPengenalan = computed(() => {
  const f = formData.value.dokumenPengenalan;
  return !!(f && ((Array.isArray(f) && f.length > 0) || (!Array.isArray(f) && f.name)));
});

const hasDokumenSokonganBank = computed(() => {
  const f = formData.value.dokumenSokonganBank;
  return !!(f && ((Array.isArray(f) && f.length > 0) || (!Array.isArray(f) && f.name)));
});

const dokumenTambahanCount = computed(() => {
  const f = formData.value.dokumenTambahan;
  return Array.isArray(f) ? f.length : (f ? 1 : 0);
});

const goToStep = (stepNumber) => {
  // Allow navigation to any step within total steps (same as reference pages)
  if (stepNumber <= totalSteps) {
    currentStep.value = stepNumber;
    window.scrollTo(0, 0);
  }
};

const nextStep = () => {
  if (currentStep.value < totalSteps) {
    currentStep.value++;
    window.scrollTo(0, 0);
  }
};

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
    window.scrollTo(0, 0);
  }
};

const submitForm = () => {
  // Here you would normally handle the API submission
  console.log("Form data to be submitted:", formData.value);

  // For demo purposes, just go to success screen
  currentStep.value = 4;
  window.scrollTo(0, 0);
};

const printApplication = () => {
  window.print();
};

const goToHomepage = () => {
  router.push("/");
};

// Draft save functionality
const confirmSaveDraft = () => {
  showDraftModal.value = false;
  
  // Here you would normally handle the API submission for draft
  console.log("Draft data to be saved:", formData.value);
  
  // For demo purposes, show success message
  alert('Draf telah berjaya disimpan!');
  
  // In real implementation, you might want to:
  // 1. Save to localStorage or send to API
  // 2. Show a success toast
  // 3. Redirect to a draft list or continue editing
};

// Watch for changes in jenisRecipient to reset dependent fields
watch(
  () => formData.value.jenisRecipient,
  () => { 
    formData.value.jenisPengenalan = "";
    formData.value.idPengenalan = "";
    formData.value.idSyarikat = "";
    formData.value.namaPenuh = "";
    formData.value.namaSyarikat = "";
  }
);

// Watch for changes in jenisPengenalan to reset ID fields
watch(
  () => formData.value.jenisPengenalan,
  () => { 
    formData.value.idPengenalan = "";
    formData.value.idSyarikat = "";
  }
);

// Watch for changes in bank selection to update Swift code
watch(
  () => formData.value.namaBank,
  (newBank) => {
    formData.value.swiftCode = getSwiftCode(newBank);
  }
);
</script>

<style lang="scss" scoped>
.organization-registration {
  background-color: #f3f4f6;
  min-height: 100vh;
}

@media print {
  .organization-registration {
    background-color: white;
  }
}
</style>
