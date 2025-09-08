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

          <!-- Conditional Fields based on Organization Type and Structure -->
          
          <!-- HQ Dropdown - Show when Structure is Cawangan -->
          <FormKit
            v-if="showHQDropdown"
            type="select"
            name="hq"
            label="HQ"
            validation="required"
            placeholder="Pilih HQ"
            :options="hqOptions"
            v-model="formData.hq"
          />

          <!-- Kariah - Show when Organization Type is Surau -->
          <FormKit
            v-if="showKariah"
            type="text"
            name="kariah"
            label="Kariah"
            validation="required"
            placeholder="Contoh: MASJID PEKAN BANGI"
            v-model="formData.kariah"
          />

          <!-- Zone - Show when Organization Type is Masjid -->
          <FormKit
            v-if="showZone"
            type="text"
            name="zone"
            label="Kawasan / Zon (jika berkaitan)"
            placeholder="Masukkan kawasan/zon"
            v-model="formData.zone"
          />

          <!-- Branch - Show when Organization Type is NOT Masjid or Surau -->
          <FormKit
            v-if="showBranch"
            type="text"
            name="branch"
            label="Branch / Cawangan"
            placeholder="Masukkan cawangan"
            v-model="formData.branch"
          />

          <!-- Zone for Others - Show when Organization Type is NOT Masjid or Surau -->
          <FormKit
            v-if="showZoneForOthers"
            type="text"
            name="zone"
            label="Kawasan / Zon (jika berkaitan)"
            placeholder="Masukkan kawasan/zon"
            v-model="formData.zone"
          />

          <div class="flex justify-end mt-6">
            <!-- <FormKit
              type="submit"
              label="Seterusnya"
              input-class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md"
            /> -->

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
          <!-- Address Layout: Grid 2 columns as per BA requirements -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormKit
              type="text"
              name="addressLine1"
              label="Alamat 1"
              validation="required"
              placeholder="Masukkan alamat 1"
              v-model="formData.addressLine1"
            />

            <FormKit
              type="select"
              name="state"
              label="Negeri"
              validation="required"
              placeholder="Pilih negeri"
              :options="[
                'Selangor',
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
                'Terengganu',
                'Wilayah Persekutuan Kuala Lumpur',
                'Wilayah Persekutuan Labuan',
                'Wilayah Persekutuan Putrajaya',
              ]"
              v-model="formData.state"
            />

            <FormKit
              type="text"
              name="addressLine2"
              label="Alamat 2"
              placeholder="Masukkan alamat 2"
              v-model="formData.addressLine2"
            />

            <FormKit
              type="select"
              name="district"
              label="Daerah"
              validation="required"
              placeholder="Pilih daerah"
              :options="[
                'Petaling',
                'Klang',
                'Hulu Langat',
                'Sepang',
                'Hulu Selangor',
                'Kuala Selangor',
                'Sabak Bernam',
                'Gombak',
                'Kuala Langat',
              ]"
              v-model="formData.district"
            />

            <FormKit
              type="text"
              name="addressLine3"
              label="Alamat 3"
              placeholder="Masukkan alamat 3"
              v-model="formData.addressLine3"
            />

            <FormKit
              type="select"
              name="city"
              label="Pilih Bandar"
              validation="required"
              placeholder="Pilih bandar"
              :options="[
                'Shah Alam',
                'Petaling Jaya',
                'Subang Jaya',
                'Klang',
                'Ampang',
                'Cheras',
                'Kajang',
                'Bangi',
                'Puchong',
                'Selayang',
                'Gombak',
                'Rawang',
                'Sungai Buloh',
                'Batu Caves',
                'Kuala Selangor',
                'Bestari Jaya',
                'Ijok',
                'Tanjong Karang',
                'Sabak Bernam',
                'Sungai Besar',
                'Kuala Kubu Bharu',
                'Batang Kali',
                'Serendah',
                'Hulu Bernam',
                'Semenyih',
                'Beranang',
                'Sepang',
                'Cyberjaya',
                'Dengkil',
                'Banting',
                'Teluk Panglima Garang',
                'Port Klang'
              ]"
              v-model="formData.city"
            />

            <FormKit
              type="text"
              name="postcode"
              label="Poskod"
              validation="required|number|length:5"
              placeholder="Contoh: 43650"
              v-model="formData.postcode"
            />
          </div>

          <div class="flex justify-between mt-6">
            <!-- <FormKit
              type="button"
              label="Kembali"
              @click="prevStep"
              input-class="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-6 rounded-md"
            />
            <FormKit
              type="submit"
              label="Seterusnya"
              input-class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md"
            /> -->
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

      <!-- Step D: Maklumat Bank -->
      <div v-if="currentStep === 4" class="space-y-6">
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

            <!-- Bank HQ Logic - Show when Structure is Cawangan -->
            <div v-if="formData.structure === 'cawangan'" class="mb-4">
              <FormKit
                type="radio"
                name="bankSameAsHQ"
                label="Adakah maklumat Bank sama dengan HQ?"
                validation="required"
                :options="[
                  { label: 'Ya', value: 'ya' },
                  { label: 'Tidak', value: 'tidak' }
                ]"
                v-model="formData.bankSameAsHQ"
              />
            </div>

            <!-- HQ Bank Details (Read-only) - Show when bankSameAsHQ is 'ya' -->
            <div v-if="formData.structure === 'cawangan' && formData.bankSameAsHQ === 'ya'" class="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
              <h4 class="font-medium text-blue-800 mb-2">Maklumat Bank HQ</h4>
              <div class="space-y-2 text-sm">
                <div><strong>Nama Bank:</strong> Maybank</div>
                <div><strong>Nombor Akaun:</strong> 1234567890</div>
                <div><strong>Penama Akaun:</strong> UITM Jengka</div>
              </div>
            </div>

            <!-- Editable Bank Fields - Show when bankSameAsHQ is 'tidak' or structure is not Cawangan -->
            <div v-if="formData.structure !== 'cawangan' || formData.bankSameAsHQ === 'tidak'">
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
          </div>

          <div class="flex justify-between mt-6">
            <rs-button variant="primary-outline" @click="prevStep">
              Kembali
            </rs-button>

            <rs-button type="submit" @click="nextStep"> Seterusnya </rs-button>
          </div>
        </FormKit>
      </div>

      <!-- Step E: Muat Naik Dokumen Sokongan -->
      <div v-if="currentStep === 5" class="space-y-6">
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

            <div class="flex gap-3">
              <rs-button variant="secondary" @click="saveDraft">
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
      <div v-if="currentStep === 6" class="text-center py-8">
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
        <div>
          <FormKit
            type="button"
            label="Cetak Bukti Permohonan"
            @click="printApplication"
            input-class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md mr-4"
          />
          <FormKit
            type="button"
            label="Kembali ke Halaman Utama"
            @click="goToHomepage"
            input-class="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-6 rounded-md"
          />

          <div class="flex justify-center">
            <rs-button
              @click="navigateTo('/BF-PRF/OR/PP/kemaskini/ORG-NEW')"
              variant="primary-outline"
              >Ke skrin EOAD</rs-button
            >
          </div>
        </div>
      </div>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const breadcrumb = ref([
  {
    name: "Organisasi",
    type: "link",
    path: "/BF-PRF/OR/PP/01",
  },
  {
    name: "Pendaftaran Baru",
    type: "current",
    path: "/BF-PRF/OR/PP/02",
  },
]);

const totalSteps = 5; // Reduced from 6 to 5 (removed Kariah/Zon step)
const currentStep = ref(1);
const referenceNumber = ref(
  "NAS-ORG-" +
    Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, "0")
);

// Mock HQ data for realistic dropdown options
const hqOptions = [
  { label: 'UITM Jengka', value: 'uitm_jengka' },
  { label: 'UITM Shah Alam', value: 'uitm_shah_alam' },
  { label: 'UITM Kuala Lumpur', value: 'uitm_kuala_lumpur' },
  { label: 'Universiti Malaya', value: 'universiti_malaya' },
  { label: 'Universiti Putra Malaysia', value: 'universiti_putra_malaysia' },
  { label: 'Universiti Teknologi Malaysia', value: 'universiti_teknologi_malaysia' },
  { label: 'Yayasan Insan Malaysia', value: 'yayasan_insan_malaysia' },
  { label: 'Pertubuhan Amal Jariah', value: 'pertubuhan_amal_jariah' },
  { label: 'Yayasan Pendidikan Islami Malaysia', value: 'yayasan_pendidikan_islami_malaysia' },
  { label: 'Institut Dakwah Malaysia', value: 'institut_dakwah_malaysia' },
  { label: 'Pertubuhan Kebajikan Islam', value: 'pertubuhan_kebajikan_islam' },
  { label: 'Yayasan Tahfiz Al-Quran', value: 'yayasan_tahfiz_al_quran' },
];

// Computed properties for conditional field visibility
const showKariah = computed(() => {
  return formData.value.organizationType === 'surau';
});

const showZone = computed(() => {
  return formData.value.organizationType === 'masjid';
});

const showBranch = computed(() => {
  return formData.value.organizationType && 
         !['masjid', 'surau'].includes(formData.value.organizationType);
});

const showZoneForOthers = computed(() => {
  return formData.value.organizationType && 
         !['masjid', 'surau'].includes(formData.value.organizationType);
});

const showHQDropdown = computed(() => {
  return formData.value.structure === 'cawangan' && 
         !['masjid', 'surau'].includes(formData.value.organizationType);
});

const formData = ref({
  // Step 1: Maklumat Pendaftaran Organisasi
  organizationName: "",
  registrationNumber: "",
  organizationType: "",
  registrationStatus: "",
  structure: "",
  
  // Conditional fields moved from Step 3 to Step 1
  kariah: "",
  branch: "",
  zone: "",
  hq: "", // New field for HQ selection when structure is Cawangan

  // Step 2: Maklumat Alamat
  addressLine1: "",
  addressLine2: "",
  addressLine3: "",
  postcode: "",
  city: "",
  district: "",
  state: "",

  // Step 3: Maklumat Perhubungan (renumbered from Step 4)
  representatives: [
    { name: "", ic: "", phoneNumber: "", email: "" },
  ],

  // Step 4: Maklumat Bank (renumbered from Step 5)
  bankName: "",
  bankAccountNumber: "",
  penamaBank: "",
  paymentMethod: "",
  bankSameAsHQ: "", // New field for bank HQ logic

  // Step 5: Muat Naik Dokumen Sokongan (renumbered from Step 6)
  registrationCertificate: null,
  appointmentLetter: null,
  bankProof: null,
  additionalDocuments: [],
});

const steps = computed(() => {
  return [
    { id: 1, label: "Maklumat Organisasi" },
    { id: 2, label: "Alamat" },
    { id: 3, label: "Perhubungan" },
    { id: 4, label: "Bank" },
    { id: 5, label: "Dokumen" },
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

const saveDraft = () => {
  // Here you would normally handle the draft saving to API
  console.log("Draft data to be saved:", formData.value);

  // Show toast notification
  // In a real implementation, you would use a toast library like vue-toastification
  alert("Maklumat Permohonan telah berjaya disimpan");
  
  // For demo purposes, we'll just log the action
  console.log("Draft saved successfully");
};

const submitForm = () => {
  // Here you would normally handle the API submission
  console.log("Form data to be submitted:", formData.value);

  // For demo purposes, just go to success screen
  currentStep.value = 6;
  window.scrollTo(0, 0);
};

const printApplication = () => {
  window.print();
};

const goToHomepage = () => {
  router.push("/");
};
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
