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

      <!-- HQ Organization Details (Read-only) -->
      <div class="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 class="text-lg font-medium mb-4">Maklumat Organisasi HQ</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <label class="block text-gray-600 font-medium mb-1">Nama Organisasi HQ</label>
            <p class="text-gray-900 bg-white p-2 rounded border">{{ hqData.namaOrganisasi }}</p>
          </div>
          <div>
            <label class="block text-gray-600 font-medium mb-1">SSM / ROS / ID Organisasi NAS</label>
            <p class="text-gray-900 bg-white p-2 rounded border">{{ hqData.kodOrganisasi }}</p>
          </div>
          <div>
            <label class="block text-gray-600 font-medium mb-1">Zon / Negeri HQ (R)</label>
            <p class="text-gray-900 bg-white p-2 rounded border">{{ hqData.zonNegeriStatus }}</p>
          </div>
        </div>
      </div>

      <!-- Step 1: Maklumat Cawangan -->
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
            name="alamat1"
            label="Alamat 1 (Jalan)"
            validation="required"
            placeholder="Masukkan alamat jalan"
            v-model="formData.alamat1"
          />

          <FormKit
            type="text"
            name="alamat2"
            label="Alamat 2 (Seksyen)"
            placeholder="Masukkan alamat seksyen"
            v-model="formData.alamat2"
          />

          <FormKit
            type="text"
            name="alamat3"
            label="Alamat 3 (Kawasan)"
            placeholder="Masukkan alamat kawasan"
            v-model="formData.alamat3"
          />

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormKit
              type="text"
              name="poskod"
              label="Poskod"
              validation="required|number|length:5"
              placeholder="Contoh: 43650"
              v-model="formData.poskod"
            />

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
              v-model="formData.negeri"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                'Kulai',
                'Batu Pahat',
                'Muar',
                'Kluang',
                'Pontian',
                'Segamat',
                'Yong Peng',
              ]"
              v-model="formData.bandar"
            />
          </div>

          <FormKit
            type="text"
            name="kariahZon"
            label="Kariah/Zon"
            validation="required"
            placeholder="Masukkan kariah/zon"
            v-model="formData.kariahZon"
          />

          <FormKit
            type="email"
            name="emel"
            label="Emel (jika ada)"
            placeholder="Masukkan alamat emel"
            v-model="formData.emel"
          />

          <div class="flex justify-end mt-6">
            <rs-button type="submit" @click="nextStep"> Seterusnya </rs-button>
          </div>
        </FormKit>
      </div>

      <!-- Step 2: Pegawai Yang Bertanggungjawab -->
      <div v-if="currentStep === 2" class="space-y-6">
        <FormKit
          type="form"
          :actions="false"
          @submit="nextStep"
          #default="{ value }"
        >
          <div v-for="(pic, index) in formData.pics" :key="index" class="border border-gray-200 rounded-lg p-4 mb-4">
            <div class="flex justify-between items-center mb-4">
              <h4 class="font-medium">Pegawai {{ index + 1 }}</h4>
              <rs-button
                v-if="formData.pics.length > 1"
                variant="danger"
                size="sm"
                @click="removePic(index)"
              >
                <Icon name="mdi:trash-can" class="w-4 h-4" />
              </rs-button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit
                type="text"
                :name="`pics.${index}.namapenuh`"
                label="Nama Penuh"
                validation="required"
                placeholder="Masukkan nama penuh"
                v-model="pic.namaPenuh"
              />

              <FormKit
                type="text"
                :name="`pics.${index}.jawatan`"
                label="Jawatan (Jika ada)"
                placeholder="Masukkan jawatan"
                v-model="pic.jawatan"
              />

              <FormKit
                type="text"
                :name="`pics.${index}.nokp`"
                label="No. Kad Pengenalan (Jika Individu)"
                placeholder="Contoh: 123456-12-1234"
                v-model="pic.noKp"
              />

              <FormKit
                type="text"
                :name="`pics.${index}.notelefon`"
                label="No Telefon PIC (Pejabat / Bimbit)"
                validation="required"
                placeholder="Contoh: 03-12345678 / 012-3456789"
                v-model="pic.noTelefon"
              />

              <FormKit
                type="email"
                :name="`pics.${index}.emel`"
                label="Emel (jika ada)"
                placeholder="Masukkan alamat emel"
                v-model="pic.emel"
              />
            </div>
          </div>

          <div class="flex justify-center mb-4">
            <rs-button
              variant="primary-outline"
              @click="addPic"
            >
              <Icon name="mdi:plus" class="w-4 h-4 mr-2" />
              Tambah Pegawai
            </rs-button>
          </div>

          <div class="flex justify-between mt-6">
            <rs-button variant="primary-outline" @click="prevStep">
              Kembali
            </rs-button>

            <rs-button type="submit" @click="nextStep"> Seterusnya </rs-button>
          </div>
        </FormKit>
      </div>

      <!-- Step 3: Maklumat Akaun Bank -->
      <div v-if="currentStep === 3" class="space-y-6">
        <FormKit
          type="form"
          :actions="false"
          @submit="nextStep"
          #default="{ value }"
        >
          <p class="text-sm text-gray-600 mb-4">*Sila masukkan akaun bank yang aktif*</p>

          <FormKit
            type="text"
            name="namaBank"
            label="Nama Bank"
            validation="required"
            placeholder="Contoh: Maybank, CIMB Bank, Bank Islam"
            v-model="formData.namaBank"
          />

          <FormKit
            type="text"
            name="noAkaunBank"
            label="No Akaun Bank"
            validation="required|number|length:10,16"
            placeholder="Masukkan nombor akaun (10-16 digit)"
            help="Format semakan 10-16 digit"
            v-model="formData.noAkaunBank"
          />

          <FormKit
            type="text"
            name="pemilikAkaun"
            label="Pemilik Akaun Bank"
            validation="required"
            placeholder="Masukkan nama pemilik akaun"
            v-model="formData.pemilikAkaun"
          />

          <div class="flex justify-between mt-6">
            <rs-button variant="primary-outline" @click="prevStep">
              Kembali
            </rs-button>

            <rs-button type="submit" @click="nextStep"> Seterusnya </rs-button>
          </div>
        </FormKit>
      </div>

      <!-- Step 4: Dokumen Sokongan -->
      <div v-if="currentStep === 4" class="space-y-6">
        <FormKit
          type="form"
          :actions="false"
          @submit="submitForm"
          #default="{ value }"
        >
          <p class="text-sm text-gray-600 mb-6">*Format yang dibenarkan: PDF / JPG / PNG (maks 10MB setiap fail)</p>

          <FormKit
            type="file"
            name="suratLantikan"
            label="Muat naik Surat Lantikan Cawangan oleh HQ"
            validation="required"
            accept=".pdf,.jpg,.jpeg,.png"
            help="Format yang dibenarkan: PDF, JPG, PNG. Saiz maksimum: 10MB"
            v-model="formData.suratLantikan"
          />

          <FormKit
            type="file"
            name="suratKuasa"
            label="Muat naik Surat Kuasa / Surat Pengesahan"
            validation="required"
            accept=".pdf,.jpg,.jpeg,.png"
            help="Format yang dibenarkan: PDF, JPG, PNG. Saiz maksimum: 10MB"
            v-model="formData.suratKuasa"
          />

          <FormKit
            type="file"
            name="cartaOrganisasi"
            label="Muat naik Carta Organisasi (jika ada)"
            accept=".pdf,.jpg,.jpeg,.png"
            help="Format yang dibenarkan: PDF, JPG, PNG. Saiz maksimum: 10MB"
            v-model="formData.cartaOrganisasi"
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
          Permohonan Cawangan Berjaya Dihantar!
        </h2>
        <p class="text-gray-600 mb-4">
          Permohonan pendaftaran cawangan anda telah berjaya dihantar. Sila ambil perhatian terhadap
          ID cawangan yang dijana:
        </p>
        <div class="bg-gray-100 p-4 rounded-md inline-block mx-auto mb-6">
          <span class="font-mono text-lg font-bold">{{ branchId }}</span>
        </div>
        <p class="text-gray-600 mb-6">
          Kami akan memproses permohonan anda dalam masa 3-5 hari bekerja. Anda
          akan menerima notifikasi melalui emel yang didaftarkan.
        </p>
        <div class="flex justify-center space-x-4">
          <rs-button
            @click="navigateTo('/BF-PRF/OR/PB/01')"
            variant="primary-outline"
          >
            Kembali ke Carian
          </rs-button>
          <rs-button
            @click="navigateTo('/BF-PRF/OR/PB/')"
            variant="primary"
          >
            Ke Senarai Permohonan
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
  { name: 'Pendaftaran Organisasi', type: 'link', path: '/BF-PRF/OR/PP/01' },
  { name: 'Carian HQ', type: 'link', path: '/BF-PRF/OR/PB/01' },
  { name: 'Pendaftaran Cawangan', type: 'current', path: '/BF-PRF/OR/PB/02' },
]);

const totalSteps = 4;
const currentStep = ref(1);
const branchId = ref(
  "NAS-BRANCH-" +
    Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, "0")
);

// HQ Data from query params
const hqData = ref({
  namaOrganisasi: 'Yayasan Pendidikan Islami Malaysia',
  kodOrganisasi: 'SSM-123456-A',
  zonNegeriStatus: 'Zon Tengah / Selangor / Aktif'
});

const formData = ref({
  // Step 1: Maklumat Cawangan
  namaCawangan: "",
  alamat1: "",
  alamat2: "",
  alamat3: "",
  poskod: "",
  negeri: "Selangor", // Default to Selangor
  daerah: "",
  bandar: "",
  kariahZon: "",
  emel: "",

  // Step 2: Pegawai Yang Bertanggungjawab
  pics: [
    {
      namaPenuh: "",
      jawatan: "",
      noKp: "",
      noTelefon: "",
      emel: ""
    }
  ],

  // Step 3: Maklumat Akaun Bank
  namaBank: "",
  noAkaunBank: "",
  pemilikAkaun: "",

  // Step 4: Dokumen Sokongan
  suratLantikan: null,
  suratKuasa: null,
  cartaOrganisasi: null,
});

const steps = computed(() => {
  return [
    { id: 1, label: "Maklumat Cawangan" },
    { id: 2, label: "Pegawai Yang Bertanggungjawab" },
    { id: 3, label: "Maklumat Akaun Bank" },
    { id: 4, label: "Dokumen Sokongan" },
  ];
});

const goToStep = (stepId) => {
  if (stepId <= currentStep.value) {
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

// PIC Management Functions
const addPic = () => {
  formData.value.pics.push({
    namaPenuh: "",
    jawatan: "",
    noKp: "",
    noTelefon: "",
    emel: ""
  });
};

const removePic = (index) => {
  if (formData.value.pics.length > 1) {
    formData.value.pics.splice(index, 1);
  }
};

const submitForm = () => {
  // Move to success step
  currentStep.value = 5;
  window.scrollTo(0, 0);
};

// Initialize HQ data from query params
onMounted(() => {
  if (route.query.hqData) {
    try {
      const parsedHqData = JSON.parse(route.query.hqData);
      hqData.value = parsedHqData;
    } catch (error) {
      console.warn('Could not parse HQ data from query params');
    }
  }
});
</script>