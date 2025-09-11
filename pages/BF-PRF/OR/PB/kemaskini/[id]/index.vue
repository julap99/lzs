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

      <!-- Step A: Maklumat Cawangan -->
      <div v-if="currentStep === 1" class="space-y-6">
        <FormKit
          type="form"
          :actions="false"
          @submit="nextStep"
          #default="{ value }"
        >
          <FormKit
            type="text"
            name="namaCawangan"
            label="Nama Cawangan"
            validation="required"
            placeholder="Masukkan nama cawangan"
            v-model="formData.namaCawangan"
          />

          <FormKit
            type="text"
            name="namaHQ"
            label="Nama HQ"
            validation="required"
            placeholder="Masukkan nama HQ"
            v-model="formData.namaHQ"
          />

          <FormKit
            type="select"
            name="jenisOrganisasi"
            label="Jenis Organisasi"
            validation="required"
            placeholder="Pilih jenis organisasi"
            :options="[
              { label: 'NGO', value: 'ngo' },
              { label: 'Masjid', value: 'masjid' },
              { label: 'Surau', value: 'surau' },
              { label: 'Institusi', value: 'institusi' },
              { label: 'Badan Berkanun', value: 'badan_berkanun' },
              { label: 'Dalaman LZS – Baitul', value: 'dalaman_lzs_baitul' },
            ]"
            v-model="formData.jenisOrganisasi"
          />

          <FormKit
            type="select"
            name="daerah"
            label="Daerah"
            validation="required"
            placeholder="Pilih daerah"
            :options="[
              'Kuala Lumpur',
              'Petaling',
              'Klang',
              'Hulu Langat',
              'Sepang',
              'Hulu Selangor',
              'Kuala Selangor',
              'Sabak Bernam',
              'Gombak',
              'Kuala Langat',
              'Johor Bahru',
              'Kulai',
              'Pontian',
              'Kluang',
              'Batu Pahat',
              'Muar',
              'Segamat',
              'Mersing',
              'Kota Tinggi',
              'Tangkak',
            ]"
            v-model="formData.daerah"
          />

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
            type="text"
            name="namaWakil"
            label="Nama Wakil / Pegawai Utama"
            validation="required"
            placeholder="Masukkan nama wakil"
            v-model="formData.wakil.nama"
          />

          <FormKit
            type="text"
            name="idPengenalan"
            label="ID Pengenalan"
            validation="required|length:12"
            placeholder="Contoh: 880101012222"
            v-model="formData.wakil.idPengenalan"
          />

          <FormKit
            type="tel"
            name="telefon"
            label="No Telefon (Pejabat / HP)"
            validation="required"
            placeholder="Contoh: 012-3456789"
            v-model="formData.wakil.telefon"
          />

          <FormKit
            type="email"
            name="emel"
            label="Emel"
            validation="email"
            placeholder="Contoh: nama@domain.com"
            v-model="formData.wakil.emel"
          />

          <FormKit
            type="text"
            name="jawatan"
            label="Jawatan"
            validation="required"
            placeholder="Contoh: Pengurus"
            v-model="formData.wakil.jawatan"
          />

          <div class="flex justify-between mt-6">
            <rs-button variant="primary-outline" @click="prevStep">
              Kembali
            </rs-button>

            <rs-button type="submit" @click="nextStep"> Seterusnya </rs-button>
          </div>
        </FormKit>
      </div>

      <!-- Step D: Maklumat Bank -->
      <div v-if="currentStep === 4" class="space-y-6">
        <FormKit
          type="form"
          :actions="false"
          @submit="submitForm"
          #default="{ value }"
        >
          <div class="border p-4 rounded-md space-y-4 mb-6 bg-gray-50">
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
          Kemaskini maklumat cawangan anda telah berjaya dihantar untuk semakan semula.
        </p>
        <div class="bg-gray-100 p-4 rounded-md inline-block mx-auto mb-6">
          <span class="font-mono text-lg font-bold">{{ referenceNumber }}</span>
        </div>
        <p class="text-gray-600 mb-6">
          Maklumat akan melalui proses pengesahan semula dan anda akan menerima notifikasi melalui emel.
        </p>
        <div class="flex justify-center space-x-4">
          <rs-button
            @click="navigateTo('/BF-PRF/OR/PB')"
            variant="primary-outline"
          >
            Kembali ke Senarai
          </rs-button>
          <rs-button
            @click="navigateTo(`/BF-PRF/OR/PB/view/${$route.params.id}`)"
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
    path: "/BF-PRF/OR/PB",
  },
  {
    name: "Senarai Cawangan",
    type: "link",
    path: "/BF-PRF/OR/PB",
  },
  {
    name: "Kemaskini Cawangan",
    type: "current",
    path: `/BF-PRF/OR/PB/kemaskini/${route.params.id}`,
  },
]);

const totalSteps = 4;
const currentStep = ref(1);
const referenceNumber = ref(
  "NAS-CAW-UPDATE-" +
    Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, "0")
);

// Confirmation modal state
const showConfirmationModal = ref(false);

const formData = ref({
  // Step 1: Maklumat Cawangan
  namaCawangan: "",
  namaHQ: "",
  jenisOrganisasi: "",
  daerah: "",

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
  wakil: {
    nama: "",
    idPengenalan: "",
    telefon: "",
    emel: "",
    jawatan: "",
  },

  // Step 4: Maklumat Bank
  bank: {
    namaBank: "",
    noAkaun: "",
    namaPemilik: "",
  },
});

const steps = computed(() => {
  return [
    { id: 1, label: "Maklumat Cawangan" },
    { id: 2, label: "Alamat" },
    { id: 3, label: "Perhubungan" },
    { id: 4, label: "Bank" },
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
  console.log("Updated cawangan data to be submitted:", formData.value);

  // For demo purposes, just go to success screen
  currentStep.value = 5;
  window.scrollTo(0, 0);
};

// Load existing cawangan data when component mounts
onMounted(async () => {
  // Simulate loading existing cawangan data
  // In real implementation, this would fetch data from API based on route.params.id
  await loadExistingData();
});

const loadExistingData = async () => {
  // Simulate API call to load existing cawangan data
  setTimeout(() => {
    // Mock existing data based on ID - replace with actual API call
    const mockData = {
      'CB-240501': {
        namaCawangan: "Cawangan Seri Damai",
        namaHQ: "Yayasan Insan Malaysia",
        jenisOrganisasi: "ngo",
        daerah: "Kuala Lumpur",
        alamat: {
          alamat1: "No. 123, Jalan Seri Damai 5/2",
          alamat2: "Taman Seri Damai",
          alamat3: "",
          poskod: "43650",
          bandar: "Bangi",
          negeri: "Selangor",
        },
        wakil: {
          nama: "Ahmad bin Abdullah",
          idPengenalan: "880101012222",
          telefon: "012-3456789",
          emel: "ahmad@seridamai.org",
          jawatan: "Pengurus",
        },
        bank: {
          namaBank: "Maybank",
          noAkaun: "1234567890123",
          namaPemilik: "Cawangan Seri Damai",
        },
      },
      'CB-240502': {
        namaCawangan: "Cawangan Taman Ilmu",
        namaHQ: "Pertubuhan Amal Jariah",
        jenisOrganisasi: "ngo",
        daerah: "Selangor",
        alamat: {
          alamat1: "No. 67, Jalan Ilmu 2/1",
          alamat2: "Taman Ilmu Cemerlang",
          alamat3: "",
          poskod: "40460",
          bandar: "Shah Alam",
          negeri: "Selangor",
        },
        wakil: {
          nama: "Puan Siti Hajar binti Mansor",
          idPengenalan: "770808074567",
          telefon: "03-33445566",
          emel: "hajar@amaljariah.org",
          jawatan: "Pengarah",
        },
        bank: {
          namaBank: "Bank Islam",
          noAkaun: "1122334455667",
          namaPemilik: "Cawangan Taman Ilmu",
        },
      },
      'PB-240513': {
        namaCawangan: "Cawangan Bandar Baru",
        namaHQ: "Yayasan Pendidikan Islami Malaysia",
        jenisOrganisasi: "institusi",
        daerah: "Johor",
        alamat: {
          alamat1: "No. 123, Jalan Bandar Baru 5/3",
          alamat2: "Taman Bandar Baru",
          alamat3: "Seksyen 5",
          poskod: "81200",
          bandar: "Johor Bahru",
          negeri: "Johor",
        },
        wakil: {
          nama: "Dr. Mohd Azhar bin Sulaiman",
          idPengenalan: "690515036789",
          telefon: "07-22334455",
          emel: "azhar@ypim.edu.my",
          jawatan: "Pengetua",
        },
        bank: {
          namaBank: "Public Bank",
          noAkaun: "2233445566778",
          namaPemilik: "Cawangan Bandar Baru",
        },
      },
      'PB-240514': {
        namaCawangan: "Cawangan Wangsa Maju",
        namaHQ: "Institut Dakwah Malaysia",
        jenisOrganisasi: "institusi",
        daerah: "Kuala Lumpur",
        alamat: {
          alamat1: "No. 89, Jalan Wangsa Maju 9/2",
          alamat2: "Taman Wangsa Maju",
          alamat3: "",
          poskod: "53300",
          bandar: "Kuala Lumpur",
          negeri: "Wilayah Persekutuan Kuala Lumpur",
        },
        wakil: {
          nama: "Ustaz Abdul Rahim bin Yusoff",
          idPengenalan: "720310047890",
          telefon: "03-41234567",
          emel: "rahim@idm.org.my",
          jawatan: "Koordinator",
        },
        bank: {
          namaBank: "AmBank",
          noAkaun: "3344556677889",
          namaPemilik: "Cawangan Wangsa Maju",
        },
      },
      'PB-240515': {
        namaCawangan: "Cawangan Subang Jaya",
        namaHQ: "Pertubuhan Kebajikan Islam",
        jenisOrganisasi: "ngo",
        daerah: "Selangor",
        alamat: {
          alamat1: "No. 45, Jalan SS15/4D",
          alamat2: "Subang Jaya",
          alamat3: "",
          poskod: "47500",
          bandar: "Subang Jaya",
          negeri: "Selangor",
        },
        wakil: {
          nama: "Encik Farid bin Ahmad",
          idPengenalan: "800225058901",
          telefon: "03-56789012",
          emel: "farid@pki.org.my",
          jawatan: "Setiausaha",
        },
        bank: {
          namaBank: "RHB Bank",
          noAkaun: "4455667788990",
          namaPemilik: "Cawangan Subang Jaya",
        },
      },
      'PB-240516': {
        namaCawangan: "Cawangan Batu Pahat",
        namaHQ: "Yayasan Tahfiz Al-Quran",
        jenisOrganisasi: "institusi",
        daerah: "Johor",
        alamat: {
          alamat1: "No. 78, Jalan Tahfiz 3/1",
          alamat2: "Taman Al-Quran",
          alamat3: "",
          poskod: "83000",
          bandar: "Batu Pahat",
          negeri: "Johor",
        },
        wakil: {
          nama: "Ustaz Hafiz bin Abdullah",
          idPengenalan: "750920049012",
          telefon: "07-43456789",
          emel: "hafiz@tahfizalquran.org",
          jawatan: "Pengasuh",
        },
        bank: {
          namaBank: "CIMB Bank",
          noAkaun: "5566778899001",
          namaPemilik: "Cawangan Batu Pahat",
        },
      },
      'CB-240503': {
        namaCawangan: "Sekolah Menengah Tahfiz Al-Amin - Cawangan Kajang",
        namaHQ: "Sekolah Menengah Tahfiz Al-Amin",
        jenisOrganisasi: "institusi",
        daerah: "Hulu Langat",
        alamat: {
          alamat1: "No. 15, Jalan Pendidikan 5/1",
          alamat2: "Taman Ilmu",
          alamat3: "Seksyen 5",
          poskod: "43000",
          bandar: "Kajang",
          negeri: "Selangor",
        },
        wakil: {
          nama: "Ustazah Siti Fatimah binti Ali",
          idPengenalan: "820315234567",
          telefon: "03-55551234",
          emel: "fatimah@tahfizalamin.edu.my",
          jawatan: "Pengetua",
        },
        bank: {
          namaBank: "Bank Islam",
          noAkaun: "2098765432109",
          namaPemilik: "Sekolah Menengah Tahfiz Al-Amin",
        },
      },
      'CB-240504': {
        namaCawangan: "Syarikat Teknologi Maju Sdn Bhd - Cawangan Cyberjaya",
        namaHQ: "Syarikat Teknologi Maju Sdn Bhd",
        jenisOrganisasi: "swasta",
        daerah: "Sepang",
        alamat: {
          alamat1: "No. 123, Jalan Teknologi 3/1",
          alamat2: "Taman Teknologi Malaysia",
          alamat3: "",
          poskod: "63000",
          bandar: "Cyberjaya",
          negeri: "Selangor",
        },
        wakil: {
          nama: "Encik Ahmad bin Abdullah",
          idPengenalan: "800123456789",
          telefon: "03-12345678",
          emel: "ahmad@teknologimaju.com",
          jawatan: "Pengurus",
        },
        bank: {
          namaBank: "CIMB Bank",
          noAkaun: "8001234567890",
          namaPemilik: "Syarikat Teknologi Maju Sdn Bhd",
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
.cawangan-update {
  background-color: #f3f4f6;
  min-height: 100vh;
}

@media print {
  .cawangan-update {
    background-color: white;
  }
}
</style> 