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

      <!-- Step A: Maklumat Pendaftaran Organisasi -->
      <div v-if="currentStep === 1" class="space-y-6">
        <h2 class="text-xl font-semibold border-b pb-2">
          A) Maklumat Pendaftaran Organisasi
        </h2>

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
              /* { label: 'Non NGO', value: 'non-ngo' }, */
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
        <h2 class="text-xl font-semibold border-b pb-2">B) Maklumat Alamat</h2>

        <FormKit
          type="form"
          :actions="false"
          @submit="nextStep"
          #default="{ value }"
        >
          <FormKit
            type="text"
            name="addressLine1"
            label="Alamat Baris 1"
            validation="required"
            placeholder="Masukkan alamat baris 1"
            v-model="formData.addressLine1"
          />

          <FormKit
            type="text"
            name="addressLine2"
            label="Alamat Baris 2"
            placeholder="Masukkan alamat baris 2"
            v-model="formData.addressLine2"
          />

          <FormKit
            type="text"
            name="addressLine3"
            label="Alamat Baris 3"
            placeholder="Masukkan alamat baris 3"
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

      <!-- Step C: Maklumat Kariah / Zon / Cawangan -->
      <div v-if="currentStep === 3" class="space-y-6">
        <h2 class="text-xl font-semibold border-b pb-2">
          C) Maklumat Kariah / Zon / Cawangan
        </h2>

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
        <h2 class="text-xl font-semibold border-b pb-2">
          D) Maklumat Perhubungan
        </h2>

        <FormKit
          type="form"
          :actions="false"
          @submit="nextStep"
          #default="{ value }"
        >
          <FormKit
            type="text"
            name="representativeName"
            label="Nama Wakil / Pegawai Utama"
            validation="required"
            placeholder="Masukkan nama wakil"
            v-model="formData.representativeName"
          />

          <FormKit
            type="tel"
            name="phoneNumber"
            label="No Telefon (Pejabat / HP)"
            validation="required"
            placeholder="Contoh: 012-3456789"
            v-model="formData.phoneNumber"
          />

          <FormKit
            type="email"
            name="email"
            label="Emel (jika ada)"
            validation="email"
            placeholder="Contoh: nama@domain.com"
            v-model="formData.email"
          />

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
        <h2 class="text-xl font-semibold border-b pb-2">E) Maklumat Bank</h2>

        <FormKit
          type="form"
          :actions="false"
          @submit="nextStep"
          #default="{ value }"
        >
           <div
              v-for="(bank, index) in formData.banks"
              :key="index"
              class="border p-4 rounded-md space-y-4 mb-6 bg-gray-50"
            >
              <h3 class="font-semibold text-sm text-gray-700">
                Maklumat Bank {{ index + 1 }}
              </h3>

              <FormKit
                type="select"
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
                v-model="bank.bankName"
              />

              <FormKit
                type="text"
                label="Nombor Akaun Bank"
                validation="required"
                placeholder="Masukkan nombor akaun bank"
                v-model="bank.bankAccountNumber"
              />

              <FormKit
                type="text"
                label="Penama Akaun Bank"
                placeholder=""
                v-model="bank.penamaBank"
              />

              <!-- <FormKit
                type="select"
                label="Kaedah Pembayaran"
                validation="required"
                placeholder="Pilih kaedah pembayaran"
                :options="['Direct Bank In', 'Cheque', 'Cash', 'Online Transfer']"
                v-model="bank.paymentMethod"
              /> -->

              <div class="flex justify-end">
                <rs-button
                  v-if="formData.banks.length > 1"
                  variant="danger-outline"
                  size="sm"
                  @click.prevent="removeBank(index)"
                >
                  Buang Maklumat Ini
                </rs-button>
              </div>
            </div>

            <rs-button
              variant="primary-outline"
              size="sm"
              @click.prevent="tambahMaklumatBank"
            >
              + Tambah Maklumat Bank
            </rs-button>

         <!--    <FormKit
              type="select"
              name="bankName"
              label="Nama Bank"
              validation="required"
              placeholder="Pilih bank"
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
                'UOB Bank',
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
              name="swiftCode"
              label="SWIFT Code (jika berkenaan)"
              placeholder="Contoh: MBBEMYKL"
              v-model="formData.swiftCode"
            />

            <FormKit
              type="select"
              name="paymentMethod"
              label="Kaedah Pembayaran"
              validation="required"
              placeholder="Pilih kaedah pembayaran"
              :options="['Direct Bank In', 'Cheque', 'Cash', 'Online Transfer']"
              v-model="formData.paymentMethod"
            /> -->

          <div class="flex justify-between mt-6">
            <rs-button variant="primary-outline" @click="prevStep">
              Kembali
            </rs-button>

            <rs-button type="submit" @click="nextStep"> Seterusnya </rs-button>
          </div>
        </FormKit>
      </div>

      <!-- Step F: Maklumat Tambahan Masjid/Surau -->
      <div v-if="currentStep === 6" class="space-y-6">
        <h2 class="text-xl font-semibold border-b pb-2">
          F) Maklumat Tambahan Masjid/Surau
        </h2>

        <FormKit
          type="form"
          :actions="false"
          @submit="nextStep"
          #default="{ value }"
        >
          <h3 class="font-medium mb-2">Senarai Penolong Amil (PAK)</h3>

          <div
            v-for="(pak, index) in formData.pakList"
            :key="index"
            class="bg-gray-50 p-4 rounded-md mb-4"
          >
            <div class="flex justify-between items-center mb-2">
              <h4 class="font-medium">Penolong Amil #{{ index + 1 }}</h4>
              <FormKit
                v-if="index > 0"
                type="button"
                label="Buang"
                @click="removePak(index)"
                input-class="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-md text-sm"
              />
            </div>

            <div class="space-y-4">
              <FormKit
                type="text"
                :name="`pakName${index}`"
                label="Nama Penuh"
                validation="required"
                placeholder="Masukkan nama penuh"
                v-model="pak.name"
              />

              <FormKit
                type="text"
                :name="`pakIc${index}`"
                label="No. Kad Pengenalan"
                validation="required|length:12"
                placeholder="Contoh: 880101012222"
                v-model="pak.ic"
              />

              <FormKit
                type="select"
                :name="`pakType${index}`"
                label="Jenis PAK"
                validation="required"
                placeholder="Pilih jenis PAK"
                :options="['Kariah', 'Komuniti', 'IPTA']"
                v-model="pak.type"
              />
            </div>
          </div>

          <FormKit
            type="button"
            label="Tambah Penolong Amil"
            @click="addNewPak"
            input-class="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md mb-6"
          />

          <FormKit
            type="text"
            name="mosqueCode"
            label="Kod Masjid/Kariah"
            placeholder="Contoh: C15"
            v-model="formData.mosqueCode"
          />

          <FormKit
            type="select"
            name="responsibleOfficer"
            label="Pegawai Bertanggungjawab"
            placeholder="Pilih pegawai"
            :options="['EO', 'ESH', 'EZAD', 'EZKP']"
            v-model="formData.responsibleOfficer"
          />

          <div class="flex justify-between mt-6">
            <rs-button variant="primary-outline" @click="prevStep">
              Kembali
            </rs-button>

            <rs-button type="submit" @click="nextStep"> Seterusnya </rs-button>
          </div>
        </FormKit>
      </div>

      <!-- Step G: Muat Naik Dokumen Sokongan -->
      <div v-if="currentStep === 7" class="space-y-6">
        <h2 class="text-xl font-semibold border-b pb-2">
          G) Muat Naik Dokumen Sokongan
        </h2>

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
              Hantar Permohonan
            </rs-button>
          </div>
        </FormKit>
      </div>

      <!-- Submission Success -->
      <div v-if="currentStep === 8" class="text-center py-8">
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
              @click="navigateTo('/BF-PRF/OR/PP/03')"
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

const totalSteps = 8;
const currentStep = ref(1);
const referenceNumber = ref(
  "NAS-ORG-" +
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
  representativeName: "",
  phoneNumber: "",
  email: "",

  // Step 5: Maklumat Bank
  banks: [
    {
      bankName: '',
      bankAccountNumber: '',
      penamaBank: '',
      paymentMethod: '',
    },
  ],

  /* bankName: "",
  bankAccountNumber: "",
  swiftCode: "",
  paymentMethod: "", */

  // Step 6: Maklumat Tambahan Masjid/Surau
  pakList: [{ name: "", ic: "", type: "" }],
  mosqueCode: "",
  responsibleOfficer: "",

  // Step 7: Muat Naik Dokumen Sokongan
  registrationCertificate: null,
  appointmentLetter: null,
  bankProof: null,
  additionalDocuments: [],
});

const tambahMaklumatBank = () => {
  formData.value.banks.push({
    bankName: '',
    bankAccountNumber: '',
    swiftCode: '',
    paymentMethod: '',
  });
};

const removeBank = (index) => {
  formData.value.banks.splice(index, 1);
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

const addNewPak = () => {
  formData.value.pakList.push({ name: "", ic: "", type: "" });
};

const removePak = (index) => {
  formData.value.pakList.splice(index, 1);
};

const submitForm = () => {
  // Here you would normally handle the API submission
  console.log("Form data to be submitted:", formData.value);

  // For demo purposes, just go to success screen
  currentStep.value = 8;
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
