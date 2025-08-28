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

      <!-- Step A: Maklumat Asas Recipient -->
      <div v-if="currentStep === 1" class="space-y-6">
        <FormKit
          type="form"
          :actions="false"
          @submit="nextStep"
          #default="{ value }"
        >
          <FormKit
            type="text"
            name="namaRecipient"
            label="Nama Recipient"
            validation="required"
            placeholder="Masukkan nama recipient"
            v-model="formData.namaRecipient"
          />

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
            type="select"
            name="jenisPengenalan"
            label="Jenis Pengenalan"
            validation="required"
            placeholder="Pilih jenis pengenalan"
            :options="[
              { label: 'MyKad', value: 'mykad' },
              { label: 'Foreign ID', value: 'foreign_id' },
              { label: 'ID Syarikat', value: 'id_syarikat' },
              { label: 'Passport', value: 'passport' },
            ]"
            v-model="formData.jenisPengenalan"
          />

          <FormKit
            type="text"
            name="noPengenalan"
            label="No. Pengenalan"
            validation="required"
            placeholder="Masukkan no. pengenalan"
            v-model="formData.noPengenalan"
          />

          <!-- Company specific fields -->
          <div v-if="formData.jenisRecipient === 'syarikat'">
            <FormKit
              type="text"
              name="noSyarikat"
              label="No. Syarikat (SSM)"
              validation="required"
              placeholder="Contoh: 201801012345"
              v-model="formData.noSyarikat"
            />
          </div>

          <div class="flex justify-end mt-6">
            <rs-button type="submit" @click="nextStep"> Seterusnya </rs-button>
          </div>
        </FormKit>
      </div>

      <!-- Step B: Maklumat Alamat -->
      <div v-if="currentStep === 2" class="space-y-6">
        <FormKit
          type="form"
          :actions="false"
          @submit="nextStep"
          #default="{ value }"
        >
          <FormKit
            type="text"
            name="alamat1"
            label="Alamat 1"
            validation="required"
            placeholder="Masukkan alamat 1"
            v-model="formData.alamat.alamat1"
          />

          <FormKit
            type="text"
            name="alamat2"
            label="Alamat 2"
            placeholder="Masukkan alamat 2"
            v-model="formData.alamat.alamat2"
          />

          <FormKit
            type="text"
            name="alamat3"
            label="Alamat 3"
            placeholder="Masukkan alamat 3"
            v-model="formData.alamat.alamat3"
          />

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormKit
              type="text"
              name="poskod"
              label="Poskod"
              validation="required|number|length:5"
              placeholder="Contoh: 43650"
              v-model="formData.alamat.poskod"
            />

            <FormKit
              type="select"
              name="bandar"
              label="Bandar"
              validation="required"
              placeholder="Pilih bandar"
              :options="[
                'Kuala Lumpur',
                'Shah Alam',
                'Petaling Jaya',
                'Subang Jaya',
                'Klang',
                'Ampang',
                'Cheras',
                'Kajang',
                'Bangi',
                'Putrajaya',
                'Cyberjaya',
                'Puchong',
                'Selayang',
                'Gombak',
                'Rawang',
                'Johor Bahru',
                'Skudai',
                'Iskandar Puteri',
              ]"
              v-model="formData.alamat.bandar"
            />
          </div>

          <FormKit
            type="select"
            name="negeri"
            label="Negeri"
            validation="required"
            placeholder="Pilih negeri"
            :options="[
              'Johor',
              'Kedah',
              'Kelantan',
              'Melaka',
              'Negeri Sembilan',
              'Pahang',
              'Perak',
              'Perlis',
              'Pulau Pinang',
              'Sabah',
              'Sarawak',
              'Selangor',
              'Terengganu',
              'Wilayah Persekutuan Kuala Lumpur',
              'Wilayah Persekutuan Labuan',
              'Wilayah Persekutuan Putrajaya',
            ]"
            v-model="formData.alamat.negeri"
          />

          <div class="flex justify-between mt-6">
            <rs-button variant="primary-outline" @click="prevStep">
              Kembali
            </rs-button>

            <rs-button type="submit" @click="nextStep"> Seterusnya </rs-button>
          </div>
        </FormKit>
      </div>

      <!-- Step C: Maklumat Perhubungan -->
      <div v-if="currentStep === 3" class="space-y-6">
        <FormKit
          type="form"
          :actions="false"
          @submit="nextStep"
          #default="{ value }"
        >
          <FormKit
            type="tel"
            name="telefon"
            label="No. Telefon"
            validation="required"
            placeholder="Contoh: 012-3456789"
            v-model="formData.perhubungan.telefon"
          />

          <FormKit
            type="email"
            name="emel"
            label="Emel"
            validation="email"
            placeholder="Contoh: nama@domain.com"
            v-model="formData.perhubungan.emel"
          />

          <FormKit
            type="tel"
            name="telefonAlternatif"
            label="No. Telefon Alternatif"
            placeholder="Contoh: 019-8765432"
            v-model="formData.perhubungan.telefonAlternatif"
          />

          <!-- Individual specific fields -->
          <div v-if="formData.jenisRecipient === 'individu'">
            <FormKit
              type="text"
              name="namaWaris"
              label="Nama Waris/Penjaga"
              placeholder="Masukkan nama waris atau penjaga"
              v-model="formData.perhubungan.namaWaris"
            />
          </div>

          <div class="flex justify-between mt-6">
            <rs-button variant="primary-outline" @click="prevStep">
              Kembali
            </rs-button>

            <rs-button type="submit" @click="nextStep"> Seterusnya </rs-button>
          </div>
        </FormKit>
      </div>

      <!-- Step D: Maklumat Kesihatan (untuk Individu) / Bank (untuk Syarikat) -->
      <div v-if="currentStep === 4" class="space-y-6">
        <FormKit
          type="form"
          :actions="false"
          @submit="submitForm"
          #default="{ value }"
        >
          <!-- Individual health information -->
          <div v-if="formData.jenisRecipient === 'individu'" class="border p-4 rounded-md space-y-4 mb-6 bg-gray-50">
            <h3 class="font-semibold text-sm text-gray-700">
              Maklumat Kesihatan
            </h3>

            <FormKit
              type="select"
              name="kategoriKesihatan"
              label="Kategori Kesihatan"
              placeholder="Pilih kategori kesihatan"
              :options="[
                'Dialisis',
                'Kanser',
                'Jantung',
                'OKU',
                'Lain-lain'
              ]"
              v-model="formData.kesihatan.kategori"
            />

            <FormKit
              type="text"
              name="kondisiKhusus"
              label="Kondisi Khusus"
              placeholder="Terangkan kondisi kesihatan khusus"
              v-model="formData.kesihatan.kondisiKhusus"
            />

            <FormKit
              type="text"
              name="hospitalRujukan"
              label="Hospital Rujukan"
              placeholder="Nama hospital yang dirujuk"
              v-model="formData.kesihatan.hospitalRujukan"
            />

            <FormKit
              type="text"
              name="noKadOKU"
              label="No. Kad OKU (jika berkaitan)"
              placeholder="Masukkan no. kad OKU"
              v-model="formData.kesihatan.noKadOKU"
            />
          </div>

          <!-- Company bank information -->
          <div v-if="formData.jenisRecipient === 'syarikat'" class="border p-4 rounded-md space-y-4 mb-6 bg-gray-50">
            <h3 class="font-semibold text-sm text-gray-700">
              Maklumat Bank
            </h3>

            <FormKit
              type="select"
              name="namaBank"
              label="Nama Bank"
              placeholder="Pilih bank"
              validation="required"
              :options="[
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
              ]"
              v-model="formData.bank.namaBank"
            />

            <FormKit
              type="text"
              name="noAkaun"
              label="Nombor Akaun Bank"
              validation="required"
              placeholder="Masukkan nombor akaun bank"
              v-model="formData.bank.noAkaun"
            />

            <FormKit
              type="text"
              name="namaPemilik"
              label="Nama Pemilik Akaun Bank"
              validation="required"
              placeholder="Masukkan nama pemilik akaun bank"
              v-model="formData.bank.namaPemilik"
            />
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
      <div v-if="currentStep === 5" class="text-center py-8">
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
import { ref, computed, onMounted } from "vue";
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

const totalSteps = 4;
const currentStep = ref(1);
const referenceNumber = ref(
  "NAS-REC-UPDATE-" +
    Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, "0")
);

// Confirmation modal state
const showConfirmationModal = ref(false);

const formData = ref({
  // Step 1: Maklumat Asas
  namaRecipient: "",
  jenisRecipient: "",
  jenisPengenalan: "",
  noPengenalan: "",
  noSyarikat: "",

  // Step 2: Maklumat Alamat
  alamat: {
    alamat1: "",
    alamat2: "",
    alamat3: "",
    poskod: "",
    bandar: "",
    negeri: "",
  },

  // Step 3: Maklumat Perhubungan
  perhubungan: {
    telefon: "",
    emel: "",
    telefonAlternatif: "",
    namaWaris: "",
  },

  // Step 4: Maklumat Kesihatan (Individu) / Bank (Syarikat)
  kesihatan: {
    kategori: "",
    kondisiKhusus: "",
    hospitalRujukan: "",
    noKadOKU: "",
  },
  bank: {
    namaBank: "",
    noAkaun: "",
    namaPemilik: "",
  },
});

const steps = computed(() => {
  return [
    { id: 1, label: "Maklumat Asas" },
    { id: 2, label: "Alamat" },
    { id: 3, label: "Perhubungan" },
    { id: 4, label: formData.value.jenisRecipient === 'syarikat' ? "Bank" : "Kesihatan" },
  ];
});

const goToStep = (stepId) => {
  // Prevent navigation to completion screen (step 5)
  if (stepId <= totalSteps) {
    currentStep.value = stepId;
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
  currentStep.value = 5;
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
      'RE-240511': {
        namaRecipient: "Ahmad Bin Abdullah",
        jenisRecipient: "individu",
        jenisPengenalan: "mykad",
        noPengenalan: "880101011234",
        alamat: {
          alamat1: "No. 789, Jalan Harmoni 3/5",
          alamat2: "Taman Harmoni",
          alamat3: "",
          poskod: "43650",
          bandar: "Bangi",
          negeri: "Selangor",
        },
        perhubungan: {
          telefon: "012-3456789",
          emel: "ahmad.abdullah@email.com",
          telefonAlternatif: "019-8765432",
          namaWaris: "Siti Aminah binti Ahmad",
        },
        kesihatan: {
          kategori: "Dialisis",
          kondisiKhusus: "Buah Pinggang Kronik",
          hospitalRujukan: "Hospital Putrajaya",
          noKadOKU: "OKU123456789",
        },
      },
      'RE-240512': {
        namaRecipient: "Pusat Dialisis Al-Falah Sdn Bhd",
        jenisRecipient: "syarikat",
        jenisPengenalan: "id_syarikat",
        noPengenalan: "SSM-201801023456",
        noSyarikat: "201801023456",
        alamat: {
          alamat1: "No. 55, Jalan Kesihatan 4/2",
          alamat2: "Taman Medik Al-Falah",
          alamat3: "",
          poskod: "47810",
          bandar: "Petaling Jaya",
          negeri: "Selangor",
        },
        perhubungan: {
          telefon: "03-78901234",
          emel: "admin@dialisisalfalah.com",
          telefonAlternatif: "03-78901235",
          namaWaris: "",
        },
        bank: {
          namaBank: "Public Bank",
          noAkaun: "9876543210",
          namaPemilik: "Pusat Dialisis Al-Falah Sdn Bhd",
        },
      },
      'RE-240513': {
        namaRecipient: "Siti Fatimah Binti Ali",
        jenisRecipient: "individu",
        jenisPengenalan: "foreign_id",
        noPengenalan: "FID123456789",
        alamat: {
          alamat1: "No. 22, Jalan Harmoni 1/5",
          alamat2: "Taman Sejahtera",
          alamat3: "",
          poskod: "43000",
          bandar: "Kajang",
          negeri: "Selangor",
        },
        perhubungan: {
          telefon: "011-22334455",
          emel: "fatimah.ali@email.com",
          telefonAlternatif: "017-87654321",
          namaWaris: "Hassan bin Ali",
        },
        kesihatan: {
          kategori: "Kanser",
          kondisiKhusus: "Kanser Payudara",
          hospitalRujukan: "Hospital Serdang",
          noKadOKU: "",
        },
      },
      'RE-240514': {
        namaRecipient: "Klinik Kesihatan Sejahtera",
        jenisRecipient: "syarikat",
        jenisPengenalan: "id_syarikat",
        noPengenalan: "SSM-201902076543",
        noSyarikat: "201902076543",
        alamat: {
          alamat1: "No. 99, Jalan Sejahtera 2/8",
          alamat2: "Pusat Komersial Sejahtera",
          alamat3: "Tingkat 3",
          poskod: "52100",
          bandar: "Kuala Lumpur",
          negeri: "Wilayah Persekutuan Kuala Lumpur",
        },
        perhubungan: {
          telefon: "03-20123456",
          emel: "info@klineksejahtera.com",
          telefonAlternatif: "03-20123457",
          namaWaris: "",
        },
        bank: {
          namaBank: "CIMB Bank",
          noAkaun: "8765432109876",
          namaPemilik: "Klinik Kesihatan Sejahtera",
        },
      },
      'RE-240515': {
        namaRecipient: "Zainab Binti Hassan",
        jenisRecipient: "individu",
        jenisPengenalan: "mykad",
        noPengenalan: "850720025678",
        alamat: {
          alamat1: "No. 111, Jalan Mawar 3/4",
          alamat2: "Taman Mawar Indah",
          alamat3: "",
          poskod: "81300",
          bandar: "Skudai",
          negeri: "Johor",
        },
        perhubungan: {
          telefon: "013-4567890",
          emel: "zainab.hassan@gmail.com",
          telefonAlternatif: "07-55123456",
          namaWaris: "Aminah binti Abdullah",
        },
        kesihatan: {
          kategori: "Jantung",
          kondisiKhusus: "Penyakit Jantung Kronik",
          hospitalRujukan: "Hospital Sultan Ismail",
          noKadOKU: "OKU987654321",
        },
      },
      'RE-240516': {
        namaRecipient: "Pembekal Makanan Halal Sdn Bhd",
        jenisRecipient: "syarikat",
        jenisPengenalan: "id_syarikat",
        noPengenalan: "SSM-201804154321",
        noSyarikat: "201804154321",
        alamat: {
          alamat1: "No. 88, Jalan Halal 5/6",
          alamat2: "Kawasan Perindustrian Halal",
          alamat3: "Fasa 2",
          poskod: "42700",
          bandar: "Banting",
          negeri: "Selangor",
        },
        perhubungan: {
          telefon: "03-31234567",
          emel: "sales@makananhalal.com.my",
          telefonAlternatif: "03-31234568",
          namaWaris: "",
        },
        bank: {
          namaBank: "Bank Islam",
          noAkaun: "7654321098765",
          namaPemilik: "Pembekal Makanan Halal Sdn Bhd",
        },
      }
    };

    // Load data based on route ID
    const id = route.params.id;
    if (mockData[id]) {
      formData.value = { ...formData.value, ...mockData[id] };
    }
  }, 500);
};
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