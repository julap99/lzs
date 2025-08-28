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

      <!-- Step A: Maklumat Pendaftaran Organisasi -->
      <div v-if="currentStep === 1" class="space-y-6">
        <FormKit
          type="form"
          :actions="false"
          @submit="nextStep"
          #default="{ value }"
        >
          <FormKit
            type="text"
            name="organizationName"
            label="Nama Organisasi"
            validation="required"
            placeholder="Masukkan nama organisasi"
            v-model="formData.organizationName"
          />

          <FormKit
            type="text"
            name="registrationNumber"
            label="Nombor Pendaftaran Organisasi (SSM/ROS)"
            validation="required"
            placeholder="Contoh: 123456-A"
            v-model="formData.registrationNumber"
          />

          <FormKit
            type="select"
            name="organizationType"
            label="Jenis Organisasi"
            validation="required"
            placeholder="Pilih jenis organisasi"
            :options="[
              { label: 'Agensi', value: 'agensi' },
              { label: 'Masjid', value: 'masjid' },
              { label: 'Surau', value: 'surau' },
              { label: 'Institusi', value: 'institusi' },
              { label: 'Badan Berkanun', value: 'badan_berkanun' },
              { label: 'NGO', value: 'ngo' },
              { label: 'Dalaman LZS – Baitul', value: 'dalaman_lzs_baitul' },
            ]"
            v-model="formData.organizationType"
          />

          <FormKit
            type="select"
            name="registrationStatus"
            label="Status Pendaftaran"
            validation="required"
            placeholder="Pilih status pendaftaran"
            :options="[
              { label: 'Berdaftar', value: 'berdaftar' },
              { label: 'Tidak berdaftar', value: 'tidak_berdaftar' },
            ]"
            v-model="formData.registrationStatus"
          />

          <FormKit
            type="select"
            name="structure"
            label="Struktur"
            validation="required"
            placeholder="Pilih struktur"
            :options="[
              { label: 'HQ', value: 'hq' },
              { label: 'Cawangan', value: 'cawangan' },
            ]"
            v-model="formData.structure"
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
            name="addressLine1"
            label="Alamat 1"
            validation="required"
            placeholder="Masukkan alamat 1"
            v-model="formData.addressLine1"
          />

          <FormKit
            type="text"
            name="addressLine2"
            label="Alamat 2"
            placeholder="Masukkan alamat 2"
            v-model="formData.addressLine2"
          />

          <FormKit
            type="text"
            name="addressLine3"
            label="Alamat 3"
            placeholder="Masukkan alamat 3"
            v-model="formData.addressLine3"
          />

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormKit
              type="text"
              name="postcode"
              label="Poskod"
              validation="required|number|length:5"
              placeholder="Contoh: 43650"
              v-model="formData.postcode"
            />

            <FormKit
              type="select"
              name="city"
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
                'Kulai',
                'Batu Pahat',
                'Muar',
                'Kluang',
                'Pontian',
                'Segamat',
                'Yong Peng',
              ]"
              v-model="formData.city"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormKit
              type="select"
              name="district"
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
              v-model="formData.district"
            />

            <FormKit
              type="select"
              name="state"
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
              v-model="formData.state"
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

      <!-- Step C: Maklumat Kariah / Zon / Cawangan -->
      <div v-if="currentStep === 3" class="space-y-6">
        <FormKit
          type="form"
          :actions="false"
          @submit="nextStep"
          #default="{ value }"
        >
          <FormKit
            type="text"
            name="kariah"
            label="Kariah"
            validation="required"
            placeholder="Contoh: MASJID PEKAN BANGI"
            v-model="formData.kariah"
          />

          <FormKit
            type="text"
            name="branch"
            label="Branch / Cawangan"
            placeholder="Masukkan cawangan"
            v-model="formData.branch"
          />

          <FormKit
            type="text"
            name="zone"
            label="Kawasan / Zon (jika berkaitan)"
            placeholder="Masukkan kawasan/zon"
            v-model="formData.zone"
          />

          <div class="flex justify-between mt-6">
            <rs-button variant="primary-outline" @click="prevStep">
              Kembali
            </rs-button>

            <rs-button type="submit" @click="nextStep"> Seterusnya </rs-button>
          </div>
        </FormKit>
      </div>

      <!-- Step D: Maklumat Perhubungan -->
      <div v-if="currentStep === 4" class="space-y-6">
        <FormKit
          type="form"
          :actions="false"
          @submit="nextStep"
          #default="{ value }"
        >
          <div
            v-for="(representative, index) in formData.representatives"
            :key="index"
            class="border p-4 rounded-md space-y-4 mb-6 bg-gray-50"
          >
            <h3 class="font-semibold text-sm text-gray-700">
              Maklumat Wakil {{ index + 1 }}
            </h3>

            <FormKit
              type="text"
              :name="`representativeName${index}`"
              label="Nama Wakil / Pegawai Utama"
              validation="required"
              placeholder="Masukkan nama wakil"
              v-model="representative.name"
            />

            <FormKit
              type="text"
              :name="`representativeIc${index}`"
              label="ID Pengenalan"
              validation="required|length:12"
              placeholder="Contoh: 880101012222"
              v-model="representative.ic"
            />

            <FormKit
              type="tel"
              :name="`phoneNumber${index}`"
              label="No Telefon (Pejabat / HP)"
              validation="required"
              placeholder="Contoh: 012-3456789"
              v-model="representative.phoneNumber"
            />

            <FormKit
              type="email"
              :name="`email${index}`"
              label="Emel (jika ada)"
              validation="email"
              placeholder="Contoh: nama@domain.com"
              v-model="representative.email"
            />

            <div class="flex justify-end">
              <rs-button
                v-if="formData.representatives.length > 1"
                variant="danger-outline"
                size="sm"
                @click.prevent="removeRepresentative(index)"
              >
                Buang Maklumat Ini
              </rs-button>
            </div>
          </div>

          <rs-button
            variant="primary-outline"
            size="sm"
            @click.prevent="tambahMaklumatWakil"
          >
            + Tambah Wakil
          </rs-button>

          <div class="flex justify-between mt-6">
            <rs-button variant="primary-outline" @click="prevStep">
              Kembali
            </rs-button>

            <rs-button type="submit" @click="nextStep"> Seterusnya </rs-button>
          </div>
        </FormKit>
      </div>

      <!-- Step E: Maklumat Bank -->
      <div v-if="currentStep === 5" class="space-y-6">
        <FormKit
          type="form"
          :actions="false"
          @submit="nextStep"
          #default="{ value }"
        >
          <div class="border p-4 rounded-md space-y-4 mb-6 bg-gray-50">
            <h3 class="font-semibold text-sm text-gray-700">
              Maklumat Bank
            </h3>

            <FormKit
              type="select"
              name="bankName"
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
              v-model="formData.bankName"
            />

            <FormKit
              type="text"
              name="bankAccountNumber"
              label="Nombor Akaun Bank"
              validation="required"
              placeholder="Masukkan nombor akaun bank"
              v-model="formData.bankAccountNumber"
            />

            <FormKit
              type="text"
              name="penamaBank"
              label="Penama Akaun Bank"
              placeholder="Masukkan penama akaun bank"
              v-model="formData.penamaBank"
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

      <!-- Step F: Muat Naik Dokumen Sokongan -->
      <div v-if="currentStep === 6" class="space-y-6">
        <FormKit
          type="form"
          :actions="false"
          @submit="submitForm"
          #default="{ value }"
        >
          <div class="bg-yellow-50 text-yellow-800 p-4 rounded-md mb-4">
            <p class="font-medium">Sila muat naik dokumen berikut:</p>
            <ul class="list-disc ml-5 mt-2">
              <li>Sijil Pendaftaran SSM / ROS</li>
              <li>Surat Lantikan / Sokongan</li>
              <li>Bukti pemilikan akaun bank</li>
            </ul>
            <p class="mt-2">Format yang dibenarkan: PDF / JPG / PNG</p>
          </div>

          <FormKit
            type="file"
            name="registrationCertificate"
            label="Sijil Pendaftaran SSM / ROS"
            validation="required"
            accept=".pdf,.jpg,.jpeg,.png"
            help="Muat naik sijil pendaftaran organisasi anda"
            v-model="formData.registrationCertificate"
          />

          <FormKit
            type="file"
            name="appointmentLetter"
            label="Surat Lantikan / Sokongan"
            validation="required"
            accept=".pdf,.jpg,.jpeg,.png"
            help="Muat naik surat lantikan rasmi"
            v-model="formData.appointmentLetter"
          />

          <FormKit
            type="file"
            name="bankProof"
            label="Bukti Pemilikan Akaun Bank"
            validation="required"
            accept=".pdf,.jpg,.jpeg,.png"
            help="Muat naik bukti pemilikan akaun bank seperti penyata bank"
            v-model="formData.bankProof"
          />

          <FormKit
            type="file"
            name="additionalDocuments"
            label="Dokumen Tambahan (jika ada)"
            accept=".pdf,.jpg,.jpeg,.png"
            multiple="true"
            help="Muat naik dokumen tambahan yang berkaitan"
            v-model="formData.additionalDocuments"
          />

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
      <div v-if="currentStep === 7" class="text-center py-8">
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
          Kemaskini profil organisasi anda telah berjaya dihantar untuk semakan semula.
        </p>
        <div class="bg-gray-100 p-4 rounded-md inline-block mx-auto mb-6">
          <span class="font-mono text-lg font-bold">{{ referenceNumber }}</span>
        </div>
        <p class="text-gray-600 mb-6">
          Maklumat akan melalui proses pengesahan semula dan anda akan menerima notifikasi melalui emel.
        </p>
        <div class="flex justify-center space-x-4">
          <rs-button
            @click="navigateTo('/BF-PRF/OR/PP')"
            variant="primary-outline"
          >
            Kembali ke Senarai
          </rs-button>
          <rs-button
            @click="navigateTo(`/BF-PRF/OR/PP/view/${$route.params.id}`)"
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
    path: "/BF-PRF/OR/PP",
  },
  {
    name: "Senarai Organisasi",
    type: "link",
    path: "/BF-PRF/OR/PP",
  },
  {
    name: "Kemaskini Organisasi",
    type: "current",
    path: `/BF-PRF/OR/PP/kemaskini/${route.params.id}`,
  },
]);

const totalSteps = 6;
const currentStep = ref(1);
const referenceNumber = ref(
  "NAS-ORG-UPDATE-" +
    Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, "0")
);

// Confirmation modal state
const showConfirmationModal = ref(false);

const formData = ref({
  // Step 1: Maklumat Pendaftaran Organisasi
  organizationName: "",
  registrationNumber: "",
  organizationType: "",
  registrationStatus: "",
  structure: "",

  // Step 2: Maklumat Alamat
  addressLine1: "",
  addressLine2: "",
  addressLine3: "",
  postcode: "",
  city: "",
  district: "",
  state: "",

  // Step 3: Maklumat Kariah / Zon / Cawangan
  kariah: "",
  branch: "",
  zone: "",

  // Step 4: Maklumat Perhubungan
  representatives: [
    { name: "", ic: "", phoneNumber: "", email: "" },
  ],

  // Step 5: Maklumat Bank
  bankName: "",
  bankAccountNumber: "",
  penamaBank: "",

  // Step 6: Muat Naik Dokumen Sokongan
  registrationCertificate: null,
  appointmentLetter: null,
  bankProof: null,
  additionalDocuments: [],
});

const steps = computed(() => {
  return [
    { id: 1, label: "Maklumat Organisasi" },
    { id: 2, label: "Alamat" },
    { id: 3, label: "Kariah/Zon" },
    { id: 4, label: "Perhubungan" },
    { id: 5, label: "Bank" },
    { id: 6, label: "Dokumen" },
  ];
});

const goToStep = (stepId) => {
  // Prevent navigation to completion screen (step 7)
  if (stepId <= totalSteps) {
    currentStep.value = stepId;
    window.scrollTo(0, 0);
  }
};

const tambahMaklumatWakil = () => {
  formData.value.representatives.push({ name: "", ic: "", phoneNumber: "", email: "" });
};

const removeRepresentative = (index) => {
  formData.value.representatives.splice(index, 1);
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
  console.log("Updated organisation data to be submitted:", formData.value);

  // For demo purposes, just go to success screen
  currentStep.value = 7;
  window.scrollTo(0, 0);
};

// Load existing organisation data when component mounts
onMounted(async () => {
  // Simulate loading existing organisation data
  // In real implementation, this would fetch data from API based on route.params.id
  await loadExistingData();
});

const loadExistingData = async () => {
  // Simulate API call to load existing organisation data
  setTimeout(() => {
    // Mock existing data based on ID - replace with actual API call
    const mockData = {
      'ORG-240501': {
        organizationName: "Syarikat Teknologi Maju Sdn Bhd",
        registrationNumber: "201801012345",
        organizationType: "ngo",
        registrationStatus: "berdaftar",
        structure: "hq",
        addressLine1: "No. 45, Jalan Teknologi 2/1",
        addressLine2: "Taman Perindustrian Teknologi",
        addressLine3: "Seksyen 2",
        postcode: "40000",
        city: "Shah Alam",
        district: "Petaling",
        state: "Selangor",
        kariah: "MASJID PEKAN SHAH ALAM",
        branch: "Cawangan Utama",
        zone: "Zon A",
        representatives: [
          { name: "Dato' Ahmad bin Hassan", ic: "750101014567", phoneNumber: "03-55123456", email: "ahmad.hassan@teknologimaju.com" },
          { name: "Siti Zainab binti Omar", ic: "820515023456", phoneNumber: "019-2345678", email: "zainab.omar@teknologimaju.com" }
        ],
        bankName: "CIMB Bank",
        bankAccountNumber: "8001234567890",
        penamaBank: "Syarikat Teknologi Maju Sdn Bhd",
      },
      'ORG-240502': {
        organizationName: "Pertubuhan Amal Iman Malaysia",
        registrationNumber: "PPM-123/2020",
        organizationType: "ngo",
        registrationStatus: "berdaftar",
        structure: "hq",
        addressLine1: "No. 88, Jalan Amal 1/3",
        addressLine2: "Taman Iman Jaya",
        addressLine3: "",
        postcode: "53100",
        city: "Kuala Lumpur",
        district: "Kuala Lumpur",
        state: "Wilayah Persekutuan Kuala Lumpur",
        kariah: "MASJID WILAYAH KL",
        branch: "Cawangan Utama",
        zone: "Zon B",
        representatives: [
          { name: "Ustaz Ibrahim bin Yusof", ic: "730505045678", phoneNumber: "03-22345678", email: "ibrahim@amaliman.org" }
        ],
        bankName: "Maybank",
        bankAccountNumber: "5123456789012",
        penamaBank: "Pertubuhan Amal Iman Malaysia",
      },
      'ORG-240503': {
        organizationName: "Sekolah Menengah Tahfiz Al-Amin",
        registrationNumber: "IPT-456/2019",
        organizationType: "institusi",
        registrationStatus: "berdaftar",
        structure: "hq",
        addressLine1: "No. 15, Jalan Pendidikan 5/1",
        addressLine2: "Taman Ilmu",
        addressLine3: "Seksyen 5",
        postcode: "28400",
        city: "Mentakab",
        district: "Temerloh",
        state: "Pahang",
        kariah: "MASJID TEMERLOH",
        branch: "Sekolah Utama",
        zone: "Zon Pahang",
        representatives: [
          { name: "Dr. Ahmad Fauzi bin Abdul Rahman", ic: "650815056789", phoneNumber: "09-33456789", email: "fauzi@tahfizalamin.edu.my" }
        ],
        bankName: "Bank Islam",
        bankAccountNumber: "2098765432109",
        penamaBank: "Sekolah Menengah Tahfiz Al-Amin",
      },
      'ORG-240504': {
        organizationName: "Institut Latihan Kemahiran Malaysia",
        registrationNumber: "INST-789/2018",
        organizationType: "institusi",
        registrationStatus: "berdaftar",
        structure: "hq",
        addressLine1: "No. 200, Jalan Kemahiran 3/7",
        addressLine2: "Kawasan Perindustrian",
        addressLine3: "Seksyen 3",
        postcode: "40150",
        city: "Shah Alam",
        district: "Petaling",
        state: "Selangor",
        kariah: "MASJID SHAH ALAM",
        branch: "Institut Utama",
        zone: "Zon Selangor",
        representatives: [
          { name: "Encik Mohd Rashid bin Hassan", ic: "700301067890", phoneNumber: "03-55567890", email: "rashid@ilkm.gov.my" }
        ],
        bankName: "RHB Bank",
        bankAccountNumber: "3456789012345",
        penamaBank: "Institut Latihan Kemahiran Malaysia",
      },
      'ORG-240505': {
        organizationName: "Syarikat Pembangunan Hartanah Sdn Bhd",
        registrationNumber: "201901098765",
        organizationType: "agensi",
        registrationStatus: "berdaftar",
        structure: "hq",
        addressLine1: "No. 77, Jalan Pembangunan 2/4",
        addressLine2: "Pusat Komersial",
        addressLine3: "Tingkat 15",
        postcode: "50450",
        city: "Kuala Lumpur",
        district: "Kuala Lumpur",
        state: "Wilayah Persekutuan Kuala Lumpur",
        kariah: "MASJID BUKIT BINTANG",
        branch: "Ibu Pejabat",
        zone: "Zon KL",
        representatives: [
          { name: "Dato Sri Azman bin Abdullah", ic: "680220078901", phoneNumber: "03-21234567", email: "azman@sph.com.my" }
        ],
        bankName: "Public Bank",
        bankAccountNumber: "4567890123456",
        penamaBank: "Syarikat Pembangunan Hartanah Sdn Bhd",
      },
      'ORG-240506': {
        organizationName: "Persatuan Belia Islam Malaysia",
        registrationNumber: "ROS-456/2017",
        organizationType: "ngo",
        registrationStatus: "berdaftar",
        structure: "hq",
        addressLine1: "No. 33, Jalan Belia 4/2",
        addressLine2: "Taman Belia Cemerlang",
        addressLine3: "",
        postcode: "47100",
        city: "Puchong",
        district: "Petaling",
        state: "Selangor",
        kariah: "MASJID PUCHONG",
        branch: "Ibu Pejabat",
        zone: "Zon Puchong",
        representatives: [
          { name: "Saudara Fikri bin Omar", ic: "850610089012", phoneNumber: "03-80123456", email: "fikri@pbim.org" },
          { name: "Saudari Nurul Ain binti Zaki", ic: "870315091234", phoneNumber: "019-7654321", email: "nurul@pbim.org" }
        ],
        bankName: "AmBank",
        bankAccountNumber: "6789012345678",
        penamaBank: "Persatuan Belia Islam Malaysia",
      },
      'ORG-240507': {
        organizationName: "Universiti Teknologi Malaysia",
        registrationNumber: "UTM-001/1975",
        organizationType: "institusi",
        registrationStatus: "berdaftar",
        structure: "hq",
        addressLine1: "81310 UTM Skudai",
        addressLine2: "Johor Bahru",
        addressLine3: "",
        postcode: "81310",
        city: "Johor Bahru",
        district: "Johor Bahru",
        state: "Johor",
        kariah: "MASJID UTM",
        branch: "Kampus Utama",
        zone: "Zon Johor",
        representatives: [
          { name: "Prof. Dr. Ahmad Fauzi bin Ismail", ic: "601205012345", phoneNumber: "07-55345678", email: "fauzi@utm.my" }
        ],
        bankName: "HSBC Bank",
        bankAccountNumber: "7890123456789",
        penamaBank: "Universiti Teknologi Malaysia",
      },
      'ORG-NEW': {
        organizationName: "",
        registrationNumber: "",
        organizationType: "",
        registrationStatus: "",
        structure: "",
        addressLine1: "",
        addressLine2: "",
        addressLine3: "",
        postcode: "",
        city: "",
        district: "",
        state: "",
        kariah: "",
        branch: "",
        zone: "",
        representatives: [
          { name: "", ic: "", phoneNumber: "", email: "" }
        ],
        bankName: "",
        bankAccountNumber: "",
        penamaBank: "",
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
.organization-update {
  background-color: #f3f4f6;
  min-height: 100vh;
}

@media print {
  .organization-update {
    background-color: white;
  }
}
</style> 