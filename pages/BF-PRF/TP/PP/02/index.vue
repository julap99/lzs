<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="p-6">
      <div class="mb-6">
        <div class="flex items-center mb-4">
          <div class="flex-1 h-2 bg-gray-200 rounded-full">
            <div
              class="h-2 bg-blue-600 rounded-full"
              :style="{ width: `${(currentStep / totalSteps) * 100}%` }"
            ></div>
          </div>
          <span class="ml-4 text-sm font-medium"
            >{{ currentStep }}/{{ totalSteps }}</span
          >
        </div>
      </div>

      <!-- Step 1: Maklumat Recipient -->
      <div v-if="currentStep === 1" class="space-y-6">
        <h2 class="text-xl font-semibold border-b pb-2">
          Maklumat Recipient
        </h2>

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
            v-if="['mykad', 'foreign_id'].includes(formData.jenisPengenalan)"
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
            <rs-button type="submit" @click="nextStep"> Seterusnya </rs-button>
          </div>
        </FormKit>
      </div>

      <!-- Step 2: Maklumat Akaun Bank -->
      <div v-if="currentStep === 2" class="space-y-6">
        <h2 class="text-xl font-semibold border-b pb-2">Maklumat Akaun Bank</h2>

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
            help="Sila masukkan akaun bank yang aktif"
            :options="bankOptions"
            v-model="formData.namaBank"
          />

          <FormKit
            type="text"
            name="noAkaunBank"
            label="No Akaun Bank"
            validation="required|length:10,16|number"
            placeholder="Masukkan nombor akaun bank (10-16 digit)"
            help="Format semakan 10-16 digit"
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

          <div class="flex justify-between mt-6">
            <rs-button variant="primary-outline" @click="prevStep">
              Kembali
            </rs-button>
            <rs-button type="submit" @click="nextStep"> Seterusnya </rs-button>
          </div>
        </FormKit>
      </div>

      <!-- Step 3: Dokumen Sokongan (Maklumat Bank) -->
      <div v-if="currentStep === 3" class="space-y-6">
        <h2 class="text-xl font-semibold border-b pb-2">
          Dokumen Sokongan (Maklumat Bank)
        </h2>

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
            name="dokumenSokongan"
            label="Dokumen Sokongan Bank"
            validation="required"
            accept=".pdf,.jpg,.jpeg,.png"
            help="Muat naik dokumen sokongan untuk maklumat bank (contoh: penyata bank, slip deposit)"
            v-model="formData.dokumenSokongan"
          />

          <div class="flex justify-between mt-6">
            <rs-button variant="primary-outline" @click="prevStep">
              Kembali
            </rs-button>
            <rs-button type="submit" @click="submitForm">
              Hantar Permohonan
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

const totalSteps = 4; // 3 form steps + 1 success step
const currentStep = ref(1);
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

  // Step 3: Dokumen Sokongan
  dokumenSokongan: null,
});

// Computed options for Jenis Pengenalan based on Jenis Recipient
const jenisPengenalanOptions = computed(() => {
  if (formData.value.jenisRecipient === "individu") {
    return [
      { label: "MyKad", value: "mykad" },
      { label: "Foreign ID", value: "foreign_id" },
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
    case "foreign_id": return "Contoh: A12345678";
    default: return "Sila pilih jenis pengenalan dahulu";
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
