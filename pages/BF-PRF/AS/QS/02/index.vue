<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Isi Borang Permohonan Online</h2>
        </div>
      </template>

      <template #body>
        <!-- Progress indicator -->
        <div class="mb-6">
          <div class="w-full bg-gray-200 rounded-full h-2.5">
            <div
              class="bg-primary h-2.5 rounded-full"
              :style="`width: ${(currentStep / totalStep) * 100}%`"
            ></div>
          </div>
        </div>

        <!-- Form Section -->
        <div class="mb-6">
          <FormKit type="form" :actions="false" @submit="handleSubmit">
            <!-- Step 1: Maklumat Peribadi Asnaf -->
            <div v-if="currentStep === 1">
              <h3 class="text-lg font-medium mb-4">
                A) Maklumat Peribadi Asnaf
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormKit
                  type="select"
                  name="idType"
                  label="Jenis ID"
                  validation="required"
                  :options="idTypeOptions"
                  placeholder="Pilih jenis ID"
                  v-model="formData.personalInfo.idType"
                  :validation-messages="{
                    required: 'Jenis ID adalah wajib',
                  }"
                />

                <FormKit
                  type="text"
                  name="idNumber"
                  label="Nombor ID"
                  validation="required"
                  v-model="formData.personalInfo.idNumber"
                  :validation-messages="{
                    required: 'Nombor ID adalah wajib',
                  }"
                  :placeholder="getPlaceholder()"
                />

                <FormKit
                  type="text"
                  name="name"
                  label="Nama"
                  validation="required"
                  v-model="formData.personalInfo.name"
                  :validation-messages="{
                    required: 'Nama adalah wajib',
                  }"
                />

                <FormKit
                  type="tel"
                  name="phone"
                  label="No Telefon"
                  validation="required"
                  v-model="formData.personalInfo.phone"
                  :validation-messages="{
                    required: 'No Telefon adalah wajib',
                  }"
                />

                <FormKit
                  type="text"
                  name="bankName"
                  label="Nama Bank"
                  validation="required"
                  v-model="formData.personalInfo.bankName"
                  :validation-messages="{
                    required: 'Nama Bank adalah wajib',
                  }"
                />

                <FormKit
                  type="text"
                  name="bankAccount"
                  label="No Akaun Bank"
                  validation="required"
                  v-model="formData.personalInfo.bankAccount"
                  :validation-messages="{
                    required: 'No Akaun Bank adalah wajib',
                  }"
                />
              </div>

              <div class="flex justify-end">
                <rs-button type="submit" variant="primary" @click="nextStep"
                  >Seterusnya ke Maklumat Kesihatan</rs-button
                >
              </div>
            </div>

            <!-- Step 2: Maklumat Pasangan -->
            <div v-if="currentStep === 2">
              <h3 class="text-lg font-medium mb-4">B) Maklumat Pasangan</h3>

              <FormKit
                type="select"
                name="status_perkahwinan"
                label="11. Status Perkahwinan"
                :options="[
                  '-- pilih --',
                  'Berkahwin',
                  'Bujang',
                  'Janda',
                  'Ibu Tinggal',
                  'Bapa Tinggal',
                  'Duda',
                  'Balu',
                ]"
                validation="required"
                v-model="statusKahwin"
              />

              <div
                v-if="statusKahwin == 'Berkahwin'"
                class="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <FormKit
                  type="select"
                  name="spouseIdType"
                  label="Jenis ID Pasangan"
                  validation="required"
                  :options="idTypeOptions"
                  placeholder="Pilih jenis ID"
                  v-model="formData.spouseInfo.idType"
                  :validation-messages="{
                    required: 'Jenis ID adalah wajib',
                  }"
                />

                <FormKit
                  type="text"
                  name="spouseIdNumber"
                  label="Nombor ID Pasangan"
                  validation="required"
                  v-model="formData.spouseInfo.idNumber"
                  :validation-messages="{
                    required: 'Nombor ID adalah wajib',
                  }"
                />

                <FormKit
                  type="text"
                  name="spouseName"
                  label="Nama Pasangan"
                  validation="required"
                  v-model="formData.spouseInfo.name"
                  :validation-messages="{
                    required: 'Nama adalah wajib',
                  }"
                />
              </div>

              <div v-else class="bg-gray-50 p-4 rounded-lg">
                <p>
                  Tiada maklumat pasangan diperlukan berdasarkan status
                  perkahwinan yang dipilih.
                </p>
              </div>

              <div class="flex justify-between gap-3 mt-6">
                <rs-button
                  type="button"
                  variant="primary-outline"
                  @click="prevStep"
                  >Kembali</rs-button
                >
                <rs-button type="submit" variant="primary" @click="nextStep"
                  >Seterusnya</rs-button
                >
              </div>
            </div>

            <!-- Step 3: Maklumat Alamat -->
            <div v-if="currentStep === 3">
              <h3 class="text-lg font-medium mb-4">C) Maklumat Alamat</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="md:col-span-2">
                  <FormKit
                    type="textarea"
                    name="address"
                    label="Alamat Terkini"
                    validation="required"
                    v-model="formData.addressInfo.address"
                    :validation-messages="{
                      required: 'Alamat adalah wajib',
                    }"
                  />
                </div>

                <FormKit
                  type="text"
                  name="district"
                  label="Daerah"
                  validation="required"
                  v-model="formData.addressInfo.district"
                  :validation-messages="{
                    required: 'Daerah adalah wajib',
                  }"
                />

                <FormKit
                  type="text"
                  name="postcode"
                  label="Poskod"
                  validation="required|length:5"
                  v-model="formData.addressInfo.postcode"
                  :validation-messages="{
                    required: 'Poskod adalah wajib',
                    length: 'Poskod mestilah 5 digit',
                  }"
                />

                <FormKit
                  type="text"
                  name="kariah"
                  label="Kariah"
                  validation="required"
                  v-model="formData.addressInfo.kariah"
                  :validation-messages="{
                    required: 'Kariah adalah wajib',
                  }"
                />

                <div class="md:col-span-2">
                  <FormKit
                    type="select"
                    name="residenceStatus"
                    label="Status Kediaman"
                    validation="required"
                    :options="residenceStatusOptions"
                    placeholder="Pilih status kediaman"
                    v-model="formData.addressInfo.residenceStatus"
                    :validation-messages="{
                      required: 'Status Kediaman adalah wajib',
                    }"
                  />
                </div>

                <div
                  v-if="
                    formData.addressInfo.residenceStatus === 'milik-sendiri'
                  "
                  class="md:col-span-2"
                >
                  <FormKit
                    type="radio"
                    name="paymentStatus"
                    label="Status Pembayaran"
                    :options="[
                      { label: 'Berbayar', value: 'berbayar' },
                      { label: 'Tidak Berbayar', value: 'tidak-berbayar' },
                    ]"
                    v-model="formData.addressInfo.paymentStatus"
                  />
                </div>

                <div
                  v-if="
                    formData.addressInfo.residenceStatus === 'milik-sendiri' &&
                    formData.addressInfo.paymentStatus === 'berbayar'
                  "
                >
                  <FormKit
                    type="number"
                    name="monthlyPayment"
                    label="Bayaran Bulanan (RM)"
                    validation="required|number"
                    v-model="formData.addressInfo.monthlyPayment"
                    :validation-messages="{
                      required: 'Bayaran bulanan adalah wajib',
                      number: 'Sila masukkan nombor yang sah',
                    }"
                  />
                </div>

                <div v-if="formData.addressInfo.residenceStatus === 'sewa'">
                  <FormKit
                    type="number"
                    name="rentAmount"
                    label="Kadar Sewa Bulanan (RM)"
                    validation="required|number"
                    v-model="formData.addressInfo.rentAmount"
                    :validation-messages="{
                      required: 'Kadar sewa adalah wajib',
                      number: 'Sila masukkan nombor yang sah',
                    }"
                  />
                </div>

                <div
                  v-if="formData.addressInfo.residenceStatus === 'lain-lain'"
                  class="md:col-span-2"
                >
                  <FormKit
                    type="text"
                    name="otherResidenceDetail"
                    label="Nyatakan"
                    validation="required"
                    v-model="formData.addressInfo.otherResidenceDetail"
                    :validation-messages="{
                      required: 'Maklumat ini adalah wajib',
                    }"
                  />
                </div>
              </div>

              <div class="flex justify-between gap-3 mt-6">
                <rs-button
                  type="button"
                  variant="primary-outline"
                  @click="prevStep"
                  >Kembali</rs-button
                >
                <rs-button type="submit" variant="primary" @click="nextStep"
                  >Seterusnya</rs-button
                >
              </div>
            </div>

            <!-- Step 4: Maklumat Tanggungan  -->
            <div v-if="currentStep === 4">
              <h3 class="text-lg font-medium mb-4">D) Maklumat Tanggungan</h3>

              <div
                v-for="(dependent, index) in formData.schoolDependents"
                :key="index"
                class="mb-8 p-4 border border-gray-200 rounded-lg"
              >
                <div class="flex justify-between items-center mb-4">
                  <h4 class="text-md font-medium">
                    Tanggungan #{{ index + 1 }}
                  </h4>
                  <button
                    type="button"
                    @click="removeSchoolDependent(index)"
                    class="text-red-500 hover:text-red-700"
                  >
                    <Icon name="mdi:delete" size="1.25rem" />
                  </button>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormKit
                    type="text"
                    :name="`schoolDependent${index}Name`"
                    label="Nama"
                    validation="required"
                    v-model="dependent.name"
                    :validation-messages="{
                      required: 'Nama adalah wajib',
                    }"
                  />

                  <FormKit
                    type="text"
                    :name="`schoolDependent${index}IdNumber`"
                    label="No Kad Pengenalan"
                    validation="required"
                    v-model="dependent.idNumber"
                    :validation-messages="{
                      required: 'No Kad Pengenalan adalah wajib',
                    }"
                  />

                  <FormKit
                    type="select"
                    :name="`schoolDependent${index}EducationLevel`"
                    label="Status"
                    validation="required"
                    :options="educationLevelOptions"
                    placeholder="Pilih status"
                    v-model="dependent.educationLevel"
                    :validation-messages="{
                      required: 'Tahap pendidikan adalah wajib',
                    }"
                  />

                  <FormKit
                    type="text"
                    :name="`schoolDependent${index}IslamDate`"
                    label="Pendapatan (Jika bekerja)"
                    v-model="dependent.islamDate"
                  />
                </div>
              </div>

              <div class="flex justify-center mt-4">
                <rs-button
                  variant="secondary"
                  @click="addSchoolDependent"
                  type="button"
                >
                  <Icon name="mdi:plus" class="mr-1" size="1rem" />
                  Tambah Tanggungan
                </rs-button>
              </div>

              <div class="flex justify-between gap-3 mt-6">
                <rs-button
                  type="button"
                  variant="primary-outline"
                  @click="prevStep"
                  >Kembali</rs-button
                >
                <rs-button type="submit" variant="primary" @click="handleSubmit"
                  >Hantar Permohonan</rs-button
                >
              </div>
            </div>
          </FormKit>
        </div>
      </template></rs-card
    >
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

definePageMeta({
  title: "Isi Permohonan Ringkas",
});

const breadcrumb = ref([
  {
    name: "Dashboard",
    type: "link",
    path: "/dashboard",
  },
  {
    name: "Borang Permohonan",
    type: "current",
    path: "/BF-PRF/AS/QS/02",
  },
]);

const currentStep = ref(1);
const totalStep = 5;

// Form data structure
const formData = ref({
  personalInfo: {
    idType: "",
    idNumber: "",
    name: "",
    phone: "",
    bankName: "",
    bankAccount: "",
    maritalStatus: "",
    healthStatus: "",
    islamDate: "",
    kfamDate: "",
  },
  spouseInfo: {
    idType: "",
    idNumber: "",
    name: "",
    phone: "",
    bankName: "",
    bankAccount: "",
    healthStatus: "",
    islamDate: "",
    kfamDate: "",
  },
  addressInfo: {
    address: "",
    district: "",
    postcode: "",
    kariah: "",
    residenceStatus: "",
    paymentStatus: "",
    monthlyPayment: "",
    rentAmount: "",
    otherResidenceDetail: "",
  },
  schoolDependents: [],
  nonSchoolDependents: [],
  declaration: {
    hasLZSRelationship: "",
    staffName: "",
    staffPosition: "",
    staffOffice: "",
    relationship: "",
    date: "",
  },
  verification: {
    comments: "",
    name: "",
    position: "",
    phone: "",
  },
  income: {
    familyHeadName: "",
    familyHeadIdNumber: "",
    employmentStatus: "",
    incomeSource: "",
    employmentSector: "",
    jobType: "",
    positionStatus: "",
    employerName: "",
    incomeAmount: "",
    declarationDate: "",
  },
});

const statusKahwin = ref(null);

// Options for select fields
const idTypeOptions = [
  { label: "Kad Pengenalan", value: "ic" },
  { label: "Pasport", value: "passport" },
  { label: "Sijil Lahir", value: "birth-cert" },
];

const maritalStatusOptions = [
  { label: "Bujang", value: "single" },
  { label: "Berkahwin", value: "married" },
  { label: "Duda", value: "widower" },
  { label: "Janda", value: "widow" },
  { label: "Bercerai", value: "divorced" },
];

const healthStatusOptions = [
  { label: "Sihat", value: "healthy" },
  { label: "Kurang Upaya", value: "disabled" },
  { label: "Sakit Kronik", value: "chronic-illness" },
];

const healthStatusOptionsExtended = [
  ...healthStatusOptions,
  { label: "OKU", value: "oku" },
  { label: "Warga Emas", value: "elderly" },
];

const residenceStatusOptions = [
  { label: "Milik Sendiri", value: "milik-sendiri" },
  { label: "Sewa", value: "sewa" },
  { label: "Tumpang", value: "tumpang" },
  { label: "Lain-lain", value: "lain-lain" },
];

const educationLevelOptions = [
  { label: "Sekolah", value: "sekolah" },
  { label: "Tidak Bersekolah", value: "tidak-bersekolah" },
  { label: "Bekerja", value: "bekerja" },
  { label: "Tidak Bekerja", value: "tidak-bekerja" },
  // Add more education levels as needed
];

const relationshipOptions = [
  { label: "Anak", value: "child" },
  { label: "Ibu Bapa", value: "parent" },
  { label: "Adik-beradik", value: "sibling" },
  { label: "Saudara-mara", value: "relative" },
  { label: "Lain-lain", value: "other" },
];

const incomeSourceOptions = [
  { label: "Gaji", value: "salary" },
  { label: "Bekerja Sendiri", value: "self-employed" },
  { label: "Pencen", value: "pension" },
  { label: "Bantuan Kerajaan", value: "government-aid" },
  { label: "Lain-lain", value: "other" },
];

const employmentSectorOptions = [
  { label: "Kerajaan", value: "government" },
  { label: "Swasta", value: "private" },
  { label: "Sendiri", value: "self-employed" },
];

const positionStatusOptions = [
  { label: "Tetap", value: "permanent" },
  { label: "Kontrak", value: "contract" },
  { label: "Sementara", value: "temporary" },
];

// Computed properties
const hasSpouse = computed(() => {
  return ["married", "widower", "widow"].includes(
    formData.value.personalInfo.maritalStatus
  );
});

const isMuallaf = computed(() => {
  // Logic to determine if applicant is muallaf
  // This might need to be adjusted based on your actual requirements
  return false;
});

// Methods
const getPlaceholder = () => {
  switch (formData.value.personalInfo.idType) {
    case "ic":
      return "Contoh: 901231025678";
    case "passport":
      return "Contoh: A12345678";
    case "birth-cert":
      return "Contoh: 12345678";
    default:
      return "";
  }
};

const addSchoolDependent = () => {
  formData.value.schoolDependents.push({
    name: "",
    idNumber: "",
    educationLevel: "",
    hostel: "",
    islamDate: "",
    healthStatus: "",
  });
};

const removeSchoolDependent = (index) => {
  formData.value.schoolDependents.splice(index, 1);
};

const addNonSchoolDependent = () => {
  formData.value.nonSchoolDependents.push({
    name: "",
    idNumber: "",
    relationship: "",
    age: "",
    islamDate: "",
    healthStatus: "",
    livingWithFamily: "",
    notes: "",
  });
};

const removeNonSchoolDependent = (index) => {
  formData.value.nonSchoolDependents.splice(index, 1);
};

const handleSubmit = () => {
  // Handle form submission
  console.log("Form submitted:", formData.value);
  // Add your submission logic here (API call, etc.)


  navigateTo("/BF-PRF/AS/FR/04")
};

const prevStep = () => {
  currentStep.value--;
};

const nextStep = () => {
  currentStep.value++;
};

// Watchers
watch(
  () => formData.value.personalInfo.maritalStatus,
  (newVal) => {
    if (!hasSpouse.value) {
      // Clear spouse info if no spouse
      formData.value.spouseInfo = {
        idType: "",
        idNumber: "",
        name: "",
        phone: "",
        bankName: "",
        bankAccount: "",
        healthStatus: "",
        islamDate: "",
        kfamDate: "",
      };
    }
  }
);
</script>
