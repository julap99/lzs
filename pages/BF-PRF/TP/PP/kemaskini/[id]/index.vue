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
            :value="formData.jenisRecipient"
          />

          <FormKit
            v-if="formData.jenisRecipient === 'individu'"
            type="text"
            name="namaPenuh"
            label="Nama Penuh"
            validation="required"
            placeholder="Masukkan nama penuh"
            v-model="formData.namaPenuh"
            :value="formData.namaPenuh"
          />

          <FormKit
            v-if="formData.jenisRecipient === 'syarikat'"
            type="text"
            name="namaSyarikat"
            label="Nama Syarikat"
            validation="required"
            placeholder="Masukkan nama syarikat"
            v-model="formData.namaSyarikat"
            :value="formData.namaSyarikat"
          />

          <FormKit
            type="select"
            name="jenisPengenalan"
            label="Jenis Pengenalan"
            validation="required"
            placeholder="Pilih jenis pengenalan"
            :options="jenisPengenalanOptions"
            v-model="formData.jenisPengenalan"
            :value="formData.jenisPengenalan"
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
            :value="formData.idPengenalan"
          />

          <FormKit
            v-if="formData.jenisPengenalan === 'id_syarikat'"
            type="text"
            name="idSyarikat"
            label="ID Syarikat"
            validation="required"
            placeholder="Contoh: SY123456-X"
            v-model="formData.idSyarikat"
            :value="formData.idSyarikat"
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
            :value="formData.namaBank"
          />

          <FormKit
            type="text"
            name="noAkaunBank"
            label="No Akaun Bank"
            validation="required|length:10,16|number"
            placeholder="Masukkan nombor akaun bank (10-16 digit)"
            v-model="formData.noAkaunBank"
            :value="formData.noAkaunBank"
          />

          <FormKit
            type="text"
            name="penamaAkaunBank"
            label="Penama Akaun Bank"
            validation="required"
            placeholder="Masukkan nama pemilik akaun"
            v-model="formData.penamaAkaunBank"
            :value="formData.penamaAkaunBank"
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
          <div class="bg-blue-50 text-blue-800 p-4 rounded-md mb-4">
            <p class="font-medium">Muat naik Dokumen Sokongan</p>
            <p class="mt-2 text-sm">Format yang dibenarkan: PDF, JPG, PNG. Saiz maksimum: 10MB</p>
          </div>

          <FormKit
            type="file"
            name="dokumenPengenalan"
            label="Dokumen Pengenalan"
            validation="required"
            accept=".pdf,.jpg,.jpeg,.png"
            v-model="formData.dokumenPengenalan"
          />
          <div class="text-sm mt-1">
            <rs-badge :variant="hasDokumenPengenalan ? 'success' : 'danger'">
              {{ hasDokumenPengenalan ? 'Telah dilampirkan' : 'Tiada lampiran' }}
            </rs-badge>
          </div>

          <FormKit
            type="file"
            name="dokumenBank"
            label="Dokumen Sokongan Bank"
            validation="required"
            accept=".pdf,.jpg,.jpeg,.png"
            v-model="formData.dokumenBank"
          />
          <div class="text-sm mt-1">
            <rs-badge :variant="hasDokumenBank ? 'success' : 'danger'">
              {{ hasDokumenBank ? 'Telah dilampirkan' : 'Tiada lampiran' }}
            </rs-badge>
          </div>

          <FormKit
            type="file"
            name="dokumenTambahan"
            label="Dokumen Tambahan (jika ada)"
            accept=".pdf,.jpg,.jpeg,.png"
            multiple="true"
            v-model="formData.dokumenTambahan"
          />
          <div class="text-sm mt-1">
            <rs-badge :variant="dokumenTambahanCount > 0 ? 'success' : 'warning'">
              {{ dokumenTambahanCount > 0 ? (dokumenTambahanCount + ' dokumen') : 'Tiada dokumen tambahan' }}
            </rs-badge>
          </div>

          <div class="flex justify-between mt-6">
            <rs-button variant="primary-outline" @click="prevStep">
              Kembali
            </rs-button>
            <rs-button type="button" @click="showSubmissionModal">
              Hantar Kemaskini
            </rs-button>
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
          Kemaskini Berjaya Dihantar!
        </h2>
        <p class="text-gray-600 mb-4">
          Kemaskini maklumat recipient anda telah berjaya dihantar untuk semakan semula.
        </p>
        <div class="bg-gray-100 p-4 rounded-md inline-block mx-auto mb-6">
          <span class="font-mono text-lg font-bold">{{ referenceNumber }}</span>
        </div>
        <p class="text-gray-600 mb-6">
          Maklumat akan melalui proses pengesahan semula dan anda akan menerima notifikasi melalui emel.
        </p>
        <div class="flex justify-center space-x-4">
          <rs-button
            @click="navigateTo('/BF-PRF/TP/PP')"
            variant="primary-outline"
          >
            Kembali ke Senarai
          </rs-button>
          <rs-button
            @click="navigateTo(`/BF-PRF/TP/PP/view/${$route.params.id}`)"
            variant="primary"
          >
            Lihat Maklumat
          </rs-button>
        </div>
      </div>
    </rs-card>

    <!-- Confirmation Modal -->
    <rs-modal
      v-model="showConfirmationModal"
      title="Sahkan Kemaskini"
      size="md"
      position="center"
    >
      <template #body>
        <div class="space-y-4">
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div class="flex items-center space-x-2">
              <Icon name="ic:baseline-info" class="w-5 h-5 text-blue-600" />
              <span class="font-medium text-blue-800">Pengesahan Kemaskini</span>
            </div>
            <p class="text-sm text-blue-700 mt-2">
              Adakah anda pasti semua maklumat adalah benar dan tepat untuk dihantar semakan kemaskini?
            </p>
            <div class="mt-3 text-sm text-blue-600">
              <p><strong>Nota:</strong> Maklumat yang dihantar akan melalui proses pengesahan semula dan tidak boleh diubah semasa dalam proses semakan.</p>
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end space-x-2">
          <rs-button variant="primary-outline" @click="cancelSubmission">
            Batal
          </rs-button>
          <rs-button 
            variant="primary" 
            @click="confirmSubmission"
          >
            Ya, Hantar Kemaskini
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

const breadcrumb = ref([
  {
    name: "Pengesahan",
    type: "link",
    path: "/BF-PRF/TP/PP",
  },
  {
    name: "Senarai Recipient",
    type: "link",
    path: "/BF-PRF/TP/PP",
  },
  {
    name: "Kemaskini Recipient",
    type: "current",
    path: `/BF-PRF/TP/PP/kemaskini/${route.params.id}`,
  },
]);

const totalSteps = 3; // 3 form steps (success step is separate)
const currentStep = ref(1);
const referenceNumber = ref(
  "NAS-REC-UPDATE-" +
    Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, "0")
);

// Confirmation modal state
const showConfirmationModal = ref(false);

// Guard to avoid resetting fields while initial data is being loaded
const isInitializing = ref(true);

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

  // Step 3: Dokumen Sokongan (selaras OR/PP/02)
  dokumenPengenalan: null,
  dokumenBank: null,
  dokumenTambahan: [],
});

const steps = [
  { id: 1, label: 'Maklumat Recipient' },
  { id: 2, label: 'Maklumat Bank' },
  { id: 3, label: 'Dokumen Sokongan' },
];

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

const getIdPlaceholder = () => {
  switch (formData.value.jenisPengenalan) {
    case "mykad": return "Contoh: 880101123456";
    case "passport_no": return "Contoh: A12345678 (A untuk Selangor)";
    default: return "Sila pilih jenis pengenalan dahulu";
  }
};

// Preserve initial mock attachment metadata for presentation (file inputs reset on mount)
const initialAttachments = ref({
  dokumenPengenalan: null,
  dokumenBank: null,
  dokumenTambahan: [],
});

// Attachment helpers for presentation
const dokumenTambahanCount = computed(() => {
  const f = formData.value.dokumenTambahan && formData.value.dokumenTambahan.length
    ? formData.value.dokumenTambahan
    : initialAttachments.value.dokumenTambahan;
  return Array.isArray(f) ? f.length : (f ? 1 : 0);
});

// More tolerant attachment presence check (for mocked objects)
const isAttachmentPresent = (f) => {
  if (!f) return false;
  if (Array.isArray(f)) return f.length > 0;
  if (typeof f === 'object') return Object.keys(f).length > 0 || !!f.name;
  return !!f;
};

// Helpers using tolerant check
const hasDokumenPengenalan = computed(() => {
  const f = formData.value.dokumenPengenalan || initialAttachments.value.dokumenPengenalan;
  return isAttachmentPresent(f);
});
const hasDokumenBank = computed(() => {
  const f = formData.value.dokumenBank || initialAttachments.value.dokumenBank;
  return isAttachmentPresent(f);
});

const goToStep = (stepNumber) => {
  // Allow navigation to any step within total steps (same as OR/PP/02 reference page)
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

// Confirmation modal functions
const showSubmissionModal = () => {
  showConfirmationModal.value = true;
};

const cancelSubmission = () => {
  showConfirmationModal.value = false;
};

const confirmSubmission = () => {
  showConfirmationModal.value = false;
  submitForm();
};

const submitForm = () => {
  // Here you would normally handle the API submission for updates
  console.log("Updated recipient data to be submitted:", formData.value);

  // For demo purposes, just go to success screen
  currentStep.value = 4;
  window.scrollTo(0, 0);
};

// Load existing recipient data when component mounts
onMounted(async () => {
  // Simulate loading existing recipient data
  // In real implementation, this would fetch data from API based on route.params.id
  await loadExistingData();
});

const loadExistingData = async () => {
  // Simulate API call to load existing recipient data
  setTimeout(() => {
    // Mock existing data based on ID - replace with actual API call
    const mockData = {
      'RE-202507-0011': {
        jenisRecipient: "individu",
        namaPenuh: "Ahmad Bin Abdullah",
        jenisPengenalan: "mykad",
        idPengenalan: "880101011234",
        namaBank: "Maybank",
        noAkaunBank: "1234567890",
        penamaAkaunBank: "Ahmad Bin Abdullah",
        // Mocked attachment metadata for presentation only
        dokumenPengenalan: { name: 'ic_ahmad.pdf', size: 123456, type: 'application/pdf' },
        dokumenBank: { name: 'penyata_bank_maybank.pdf', size: 234567, type: 'application/pdf' },
        dokumenTambahan: [
          { name: 'surat_sokongan.pdf', size: 345678, type: 'application/pdf' },
        ],
      },
      'RE-202506-0012': {
        jenisRecipient: "syarikat",
        namaSyarikat: "Pusat Dialisis As-Salam Shah Alam",
        jenisPengenalan: "id_syarikat",
        idSyarikat: "PPM-2021-015",
        namaBank: "Public Bank",
        noAkaunBank: "9876543210",
        penamaAkaunBank: "Pusat Dialisis As-Salam Shah Alam",
        dokumenPengenalan: { name: 'ssm_dialisis.pdf', size: 111111, type: 'application/pdf' },
        dokumenBank: { name: 'penyata_bank_public.pdf', size: 222222, type: 'application/pdf' },
        dokumenTambahan: [ { name: 'surat_sokongan.pdf', size: 345678, type: 'application/pdf' } ],
      },
      'RE-202505-0013': {
        jenisRecipient: "individu",
        namaPenuh: "Siti Fatimah Binti Ali",
        jenisPengenalan: "passport_no",
        idPengenalan: "A12345678",
        namaBank: "CIMB Bank",
        noAkaunBank: "8765432109",
        penamaAkaunBank: "Siti Fatimah Binti Ali",
        dokumenPengenalan: { name: 'passport_siti.jpg', size: 456789, type: 'image/jpeg' },
        dokumenBank: { name: 'penyata_bank_cimb.pdf', size: 210000, type: 'application/pdf' },
        dokumenTambahan: [ { name: 'surat_sokongan.pdf', size: 345678, type: 'application/pdf' } ],
      },
      'RE-202507-0014': {
        jenisRecipient: "syarikat",
        namaSyarikat: "Klinik Kesihatan Al-Ikhlas",
        jenisPengenalan: "id_syarikat",
        idSyarikat: "PPM-2022-008",
        namaBank: "CIMB Bank",
        noAkaunBank: "8765432109876",
        penamaAkaunBank: "Klinik Kesihatan Al-Ikhlas",
        dokumenPengenalan: { name: 'ssm_klinik.pdf', size: 333333, type: 'application/pdf' },
        dokumenBank: { name: 'penyata_bank_cimb.pdf', size: 444444, type: 'application/pdf' },
        dokumenTambahan: [ { name: 'surat_sokongan.pdf', size: 345678, type: 'application/pdf' } ],
      },
      'RE-202506-0015': {
        jenisRecipient: "individu",
        namaPenuh: "Zainab Binti Hassan",
        jenisPengenalan: "mykad",
        idPengenalan: "850720025678",
        namaBank: "Bank Islam",
        noAkaunBank: "7654321098",
        penamaAkaunBank: "Zainab Binti Hassan",
        dokumenPengenalan: { name: 'ic_zainab.png', size: 98765, type: 'image/png' },
        dokumenBank: { name: 'penyata_bank_bi.pdf', size: 200000, type: 'application/pdf' },
        dokumenTambahan: [ { name: 'surat_sokongan.pdf', size: 345678, type: 'application/pdf' } ],
      },
      'RE-202505-0016': {
        jenisRecipient: "syarikat",
        namaSyarikat: "Pembekal Makanan Halal Al-Amin Sdn Bhd",
        jenisPengenalan: "id_syarikat",
        idSyarikat: "PPM-2022-008",
        namaBank: "Bank Islam",
        noAkaunBank: "7654321098765",
        penamaAkaunBank: "Pembekal Makanan Halal Al-Amin Sdn Bhd",
        dokumenPengenalan: { name: 'ssm_pembekal.pdf', size: 555555, type: 'application/pdf' },
        dokumenBank: { name: 'penyata_bank_bi.pdf', size: 666666, type: 'application/pdf' },
        dokumenTambahan: [ { name: 'surat_sokongan.pdf', size: 345678, type: 'application/pdf' } ],
      },
      'RE-202507-0017': {
        jenisRecipient: "individu",
        namaPenuh: "Mohd Zaki bin Hassan",
        jenisPengenalan: "mykad",
        idPengenalan: "750512123456",
        namaBank: "AmBank",
        noAkaunBank: "6789012345678",
        penamaAkaunBank: "Mohd Zaki bin Hassan",
        dokumenPengenalan: { name: 'ic_zaki.pdf', size: 77777, type: 'application/pdf' },
        dokumenBank: { name: 'penyata_bank_ambank.pdf', size: 205000, type: 'application/pdf' },
        dokumenTambahan: [ { name: 'surat_sokongan.pdf', size: 345678, type: 'application/pdf' } ],
      }
    };

    // Load data based on route ID
    const id = route.params.id;
    if (mockData[id]) {
      // Normalize mock values to expected option values to ensure fields render
      const incoming = { ...mockData[id] };
      const jr = String(incoming.jenisRecipient || '').toLowerCase().trim();
      if (['individu', 'syarikat'].includes(jr)) {
        incoming.jenisRecipient = jr;
      }
      const jp = String(incoming.jenisPengenalan || '').toLowerCase().trim();
      if (jr === 'individu') {
        // Accept aliases and normalize
        if (jp === 'mykad' || jp === 'ic' || jp === 'kad_pengenalan') incoming.jenisPengenalan = 'mykad';
        else if (jp === 'passport' || jp === 'passport no' || jp === 'passport_no') incoming.jenisPengenalan = 'passport_no';
      } else if (jr === 'syarikat') {
        if (jp === 'id_syarikat' || jp === 'ssm' || jp === 'roc') incoming.jenisPengenalan = 'id_syarikat';
      }
      formData.value = { ...formData.value, ...incoming };
      // Preserve initial attachments for presentation badges
      initialAttachments.value = {
        dokumenPengenalan: incoming.dokumenPengenalan || null,
        dokumenBank: incoming.dokumenBank || null,
        dokumenTambahan: incoming.dokumenTambahan || [],
      };
      // Ensure parent and dependent selects are valid and visible after options compute
      nextTick(() => {
        // Validate jenisRecipient preselection
        if (!['individu', 'syarikat'].includes(formData.value.jenisRecipient)) {
          formData.value.jenisRecipient = 'individu';
        }

        const options = jenisPengenalanOptions.value || [];
        if (
          formData.value.jenisRecipient &&
          options.length > 0 &&
          !options.some(opt => opt.value === formData.value.jenisPengenalan)
        ) {
          formData.value.jenisPengenalan = options[0].value;
        }
        isInitializing.value = false;
      });
    } else {
      // No mock match; end init to avoid locking watchers
      isInitializing.value = false;
    }
  }, 500);
};

// Watch for changes in jenisRecipient to reset dependent fields
watch(
  () => formData.value.jenisRecipient,
  () => { 
    if (isInitializing.value) return;
    formData.value.jenisPengenalan = "";
    formData.value.idPengenalan = "";
    formData.value.idSyarikat = "";
  }
);

// Watch for changes in jenisPengenalan to reset ID fields
watch(
  () => formData.value.jenisPengenalan,
  () => { 
    if (isInitializing.value) return;
    formData.value.idPengenalan = "";
    formData.value.idSyarikat = "";
  }
);
</script>

<style lang="scss" scoped>
.recipient-update {
  background-color: #f3f4f6;
  min-height: 100vh;
}

@media print {
  .recipient-update {
    background-color: white;
  }
}
</style> 