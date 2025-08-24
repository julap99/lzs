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
              { label: 'NGO', value: 'ngo' },
              { label: 'Masjid', value: 'masjid' },
              { label: 'Syarikat', value: 'syarikat' },
              { label: 'IPT', value: 'ipt' },
              { label: 'Lain-lain', value: 'others' },
            ]"
            v-model="formData.organizationType"
          />

          <FormKit
            v-if="formData.organizationType === 'others'"
            type="text"
            name="otherOrganizationType"
            label="Sila Nyatakan"
            validation="required"
            placeholder="Nyatakan jenis organisasi"
            v-model="formData.otherOrganizationType"
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
              type="text"
              name="city"
              label="Bandar"
              validation="required"
              placeholder="Contoh: Bangi"
              v-model="formData.city"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormKit
              type="text"
              name="district"
              label="Daerah"
              validation="required"
              placeholder="Contoh: Hulu Langat"
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

          <FormKit
            type="select"
            name="country"
            label="Negara"
            validation="required"
            placeholder="Pilih negara"
            :options="[
              'Malaysia',
              'Singapura',
              'Brunei',
              'Indonesia',
              'Thailand',
            ]"
            v-model="formData.country"
          />

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

            <rs-button type="submit" @click="submitForm">
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
          Kemaskini profil organisasi anda telah berjaya dihantar. Sila ambil perhatian terhadap
          nombor rujukan anda:
        </p>
        <div class="bg-gray-100 p-4 rounded-md inline-block mx-auto mb-6">
          <span class="font-mono text-lg font-bold">{{ referenceNumber }}</span>
        </div>
        <p class="text-gray-600 mb-6">
          Kami akan memproses kemaskini anda dalam masa 3-5 hari bekerja. Anda
          akan menerima notifikasi melalui emel yang didaftarkan.
        </p>
        <div class="flex justify-center space-x-4">
          <rs-button
            @click="navigateTo('/BF-PRF/OR/PP/01')"
            variant="primary-outline"
          >
            Kembali ke Carian
          </rs-button>
          <rs-button
            @click="navigateTo('/BF-PRF/OR/PP/04')"
            variant="primary"
          >
            Ke Semakan
          </rs-button>
        </div>
      </div>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

const breadcrumb = ref([
  {
    name: "Organisasi",
    type: "link",
    path: "/BF-PRF/OR/PP/01",
  },
  {
    name: "Kemaskini Profil",
    type: "current",
    path: "/BF-PRF/OR/PP/03",
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

const formData = ref({
  // Step 1: Maklumat Pendaftaran Organisasi
  organizationName: "",
  registrationNumber: "",
  organizationType: "",
  otherOrganizationType: "",

  // Step 2: Maklumat Alamat
  addressLine1: "",
  addressLine2: "",
  addressLine3: "",
  postcode: "",
  city: "",
  district: "",
  state: "",
  country: "Malaysia",

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
    { id: 1, label: "Pendaftaran" },
    { id: 2, label: "Alamat" },
    { id: 3, label: "Kariah/Zon" },
    { id: 4, label: "Perhubungan" },
    { id: 5, label: "Bank" },
    { id: 6, label: "Dokumen" },
  ];
});

const goToStep = (stepId) => {
  // Prevent navigation to completion screen (step 8)
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

const submitForm = () => {
  // Here you would normally handle the API submission for updates
  console.log("Updated form data to be submitted:", formData.value);

  // For demo purposes, just go to success screen
  currentStep.value = 7;
  window.scrollTo(0, 0);
};

// Load existing organization data when component mounts
onMounted(async () => {
  // Simulate loading existing organization data
  // In real implementation, this would fetch data from API based on organization ID
  await loadExistingData();
});

const loadExistingData = async () => {
  // Simulate API call to load existing organization data
  // This would typically come from route params or API call
  setTimeout(() => {
    // Mock existing data - replace with actual API call
    formData.value = {
      organizationName: "Masjid Al-Hidayah",
      registrationNumber: "123456-A",
      organizationType: "masjid",
      otherOrganizationType: "",
      addressLine1: "No. 123, Jalan Utama",
      addressLine2: "Taman Bangi",
      addressLine3: "",
      postcode: "43650",
      city: "Bangi",
      district: "Hulu Langat",
      state: "Selangor",
      country: "Malaysia",
      kariah: "MASJID PEKAN BANGI",
      branch: "Cawangan Utama",
      zone: "Zon A",
      representatives: [
        { name: "Ahmad bin Abdullah", ic: "880101012222", phoneNumber: "012-3456789", email: "ahmad@masjid.com" },
      ],
      bankName: "Maybank",
      bankAccountNumber: "1234567890",
      penamaBank: "Masjid Al-Hidayah",
      registrationCertificate: null,
      appointmentLetter: null,
      bankProof: null,
      additionalDocuments: [],
    };
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