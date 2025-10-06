<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Main Card with Tabs -->
    <rs-card class="mt-4">
      <template #header>
        <h3 class="text-lg font-semibold text-gray-900">Permohonan Pembatalan Bantuan</h3>
      </template>
      
      <template #body>
        <!-- Tab Navigation -->
        <div class="border-b border-gray-200">
          <div class="flex">
            <button
              @click="activeTab = 'pembatalan'"
              :class="[
                'px-6 py-3 text-sm font-medium transition-colors duration-200',
                activeTab === 'pembatalan'
                  ? 'text-white bg-blue-500 rounded-t-lg'
                  : 'text-gray-700 bg-gray-100 hover:bg-gray-200',
              ]"
            >
              Pembatalan
            </button>
            <button
              @click="activeTab = 'pengakuan'"
              :class="[
                'px-6 py-3 text-sm font-medium transition-colors duration-200 ml-1',
                activeTab === 'pengakuan'
                  ? 'text-white bg-blue-500 rounded-t-lg'
                  : 'text-gray-700 bg-gray-100 hover:bg-gray-200',
              ]"
            >
              Pengakuan
            </button>
          </div>
        </div>

        <!-- Tab Content -->
        <div class="p-6" v-if="activeTab === 'pembatalan'">
          <!-- Two Column Layout: Labels on Left, Data on Right -->
          <div>
            <!-- No Bantuan -->
            <div class="grid grid-cols-3 gap-4 mb-4">
              <label class="text-sm font-medium text-gray-700 pt-3">
                No Bantuan
              </label>
              <div class="col-span-2">
                <div class="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <p class="text-sm text-gray-900 font-medium">{{ bantuanInfo.noBantuan }}</p>
                </div>
              </div>
            </div>

            <!-- Nama Bantuan -->
            <div class="grid grid-cols-3 gap-4 mb-4">
              <label class="text-sm font-medium text-gray-700 pt-3">
                Nama Bantuan
              </label>
              <div class="col-span-2">
                <div class="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <p class="text-sm text-gray-900">{{ bantuanInfo.namaBantuan }}</p>
                </div>
              </div>
            </div>

            <!-- Status -->
            <div class="grid grid-cols-3 gap-4 mb-4">
              <label class="text-sm font-medium text-gray-700 pt-3">
                Status
              </label>
              <div class="col-span-2">
                <div class="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <rs-badge variant="success">{{ bantuanInfo.status }}</rs-badge>
                </div>
              </div>
            </div>

            <!-- Tarikh Mula -->
            <div class="grid grid-cols-3 gap-4 mb-4">
              <label class="text-sm font-medium text-gray-700 pt-3">
                Tarikh Mula
              </label>
              <div class="col-span-2">
                <div class="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <p class="text-sm text-gray-900">{{ bantuanInfo.tarikhMula }}</p>
                </div>
              </div>
            </div>

            <!-- Tarikh Tamat -->
            <div class="grid grid-cols-3 gap-4 mb-4">
              <label class="text-sm font-medium text-gray-700 pt-3">
                Tarikh Tamat
              </label>
              <div class="col-span-2">
                <div class="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <p class="text-sm text-gray-900">{{ bantuanInfo.tarikhTamat }}</p>
                </div>
              </div>
            </div>

            <!-- Nyatakan Sebab Pembatalan -->
            <div class="grid grid-cols-3 gap-4 mb-6">
              <label class="text-sm font-medium text-gray-700 pt-3">
                Nyatakan Sebab Pembatalan
              </label>
              <div class="col-span-2">
                <FormKit
                  v-model="sebabPembatalan"
                  type="textarea"
                  placeholder="Masukkan sebab pembatalan..."
                  :classes="{
                    input: '!rounded-lg min-h-[120px]',
                  }"
                />
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-end gap-3">
              <rs-button
                variant="secondary-outline"
                @click="handleKembali"
              >
                Kembali
              </rs-button>
              <rs-button
                variant="primary"
                @click="activeTab = 'pengakuan'"
              >
                Simpan & Seterusnya
              </rs-button>
            </div>
          </div>
        </div>

        <!-- Pengakuan Tab Content -->
        <div class="p-6" v-if="activeTab === 'pengakuan'">
          <!-- Checkbox Declaration -->
          <div class="mb-6">
            <label class="flex items-start gap-3">
              <input
                type="checkbox"
                v-model="pengakuanChecked"
                class="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span class="text-sm text-gray-700">
                <p class="mb-2">Saya mengaku bahawa maklumat-maklumat yang terkandung di dalam permohonan ini adalah benar dan kenyataan-kenyataan adalah betul.</p>
                <p>Dengan ini saya memohon agar Permohonan Pembatalan Bantuan ini diluluskan.</p>
              </span>
            </label>
          </div>

          <!-- Pemohon Information Section -->
          <div>
            <h4 class="text-md font-semibold text-gray-800 mb-4">Maklumat Pemohon</h4>
            
            <!-- Nama Pemohon -->
            <div class="grid grid-cols-3 gap-4 mb-4">
              <label class="text-sm font-medium text-gray-700 pt-3">
                Nama Pemohon
              </label>
              <div class="col-span-2">
                <div class="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <p class="text-sm text-gray-900">{{ pemohonInfo.nama }}</p>
                </div>
              </div>
            </div>

            <!-- Jenis Pengenalan -->
            <div class="grid grid-cols-3 gap-4 mb-4">
              <label class="text-sm font-medium text-gray-700 pt-3">
                Jenis Pengenalan
              </label>
              <div class="col-span-2">
                <div class="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <p class="text-sm text-gray-900">{{ pemohonInfo.jenisPengenalan }}</p>
                </div>
              </div>
            </div>

            <!-- No Pengenalan -->
            <div class="grid grid-cols-3 gap-4 mb-4">
              <label class="text-sm font-medium text-gray-700 pt-3">
                No Pengenalan
              </label>
              <div class="col-span-2">
                <div class="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <p class="text-sm text-gray-900">{{ pemohonInfo.noKad }}</p>
                </div>
              </div>
            </div>

            <!-- Alamat -->
            <div class="grid grid-cols-3 gap-4 mb-4">
              <label class="text-sm font-medium text-gray-700 pt-3">
                Alamat
              </label>
              <div class="col-span-2">
                <div class="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <p class="text-sm text-gray-900">{{ pemohonInfo.alamat }}</p>
                </div>
              </div>
            </div>

            <!-- Poskod -->
            <div class="grid grid-cols-3 gap-4 mb-4">
              <label class="text-sm font-medium text-gray-700 pt-3">
                Poskod
              </label>
              <div class="col-span-2">
                <div class="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <p class="text-sm text-gray-900">{{ pemohonInfo.poskod }}</p>
                </div>
              </div>
            </div>

            <!-- Bandar and Negeri in one row -->
            <div class="grid grid-cols-3 gap-4 mb-4">
              <label class="text-sm font-medium text-gray-700 pt-3">
                Bandar
              </label>
              <div class="col-span-2">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <div class="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <p class="text-sm text-gray-900">{{ pemohonInfo.bandar }}</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-3">
                    <label class="text-sm font-medium text-gray-700 whitespace-nowrap">
                      Negeri
                    </label>
                    <div class="bg-gray-50 p-3 rounded-lg border border-gray-200 flex-1">
                      <p class="text-sm text-gray-900">{{ pemohonInfo.negeri }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Alamat Emel and No. Telefon in one row -->
            <div class="grid grid-cols-3 gap-4 mb-4">
              <label class="text-sm font-medium text-gray-700 pt-3">
                Alamat Emel
              </label>
              <div class="col-span-2">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <div class="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <p class="text-sm text-gray-900">{{ pemohonInfo.emel }}</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-3">
                    <label class="text-sm font-medium text-gray-700 whitespace-nowrap">
                      No. Telefon
                    </label>
                    <div class="bg-gray-50 p-3 rounded-lg border border-gray-200 flex-1">
                      <p class="text-sm text-gray-900">{{ pemohonInfo.telefon }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Tarikh Mohon -->
            <div class="grid grid-cols-3 gap-4 mb-4">
              <label class="text-sm font-medium text-gray-700 pt-3">
                Tarikh Mohon
              </label>
              <div class="col-span-2">
                <FormKit
                  v-model="tarikhMohon"
                  type="date"
                  :classes="{
                    input: '!rounded-lg',
                  }"
                />
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-end gap-3 mt-6">
              <rs-button
                variant="secondary-outline"
                @click="activeTab = 'pembatalan'"
              >
                Kembali
              </rs-button>
              <rs-button
                variant="primary"
                @click="handleSubmit"
                :disabled="!pengakuanChecked"
              >
                Simpan & Seterusnya
              </rs-button>
            </div>
          </div>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref } from 'vue';

definePageMeta({
  title: "Pembatalan Bantuan",
  layout: "default",
});

const route = useRoute();
const router = useRouter();

// Breadcrumb
const breadcrumb = ref([
  {
    name: "Bantuan",
    type: "link",
    path: "/BF-BTN/bantuan",
  },
  {
    name: "Senarai",
    type: "link",
    path: "/BF-BTN/bantuan",
  },
  {
    name: "Pembatalan",
    type: "current",
    path: "/BF-BTN/bantuan/pembatalan",
  },
]);

// Get bantuan number from query params
const noBantuan = route.query.noBantuan || 'NAS-2025-000?';

// Active tab
const activeTab = ref('pembatalan');

// Bantuan Information (mock data - should be fetched from API)
const bantuanInfo = ref({
  noBantuan: noBantuan,
  namaBantuan: '',
  status: 'Lulus',
  tarikhMula: '1/1/2025',
  tarikhTamat: '12/31/2025',
});

// Form data
const sebabPembatalan = ref('');
const pengakuanChecked = ref(false);
const tarikhMohon = ref('2025-10-02');

// Pemohon Information (mock data)
const pemohonInfo = ref({
  nama: 'Ali bin Ahmad',
  jenisPengenalan: 'MyKad',
  noKad: '850615-10-5432',
  jawatan: '',
  alamat: 'A-7370 1ST FLOOR, JALAN KUBANG BUAYA,',
  poskod: '25350',
  bandar: 'Shah Alam',
  negeri: 'Selangor',
  emel: 'ali.ahmad@gmail.com',
  telefon: '013-5678901',
});

// Methods
const handleKembali = () => {
  router.back();
};

const handleSubmit = async () => {
  if (!pengakuanChecked.value) {
    console.log('Please accept the declaration');
    return;
  }

  console.log('Submitting cancellation:', {
    noBantuan: bantuanInfo.value.noBantuan,
    sebabPembatalan: sebabPembatalan.value,
    tarikhMohon: tarikhMohon.value,
    pengakuan: pengakuanChecked.value,
  });

  // Here you would call API to submit the cancellation
  // After successful save, show success message
  const { $swal } = useNuxtApp();
  await $swal.fire({
    icon: 'success',
    title: 'Berjaya!',
    text: 'Permohonan Pembatalan Bantuan telah dihantar.',
    confirmButtonText: 'OK',
    confirmButtonColor: '#6366f1',
    showConfirmButton: true,
    allowOutsideClick: false,
    customClass: {
      confirmButton: 'px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600',
    },
  });

  // Navigate back after user clicks OK
  router.push('/BF-BTN/bantuan');
};

// Fetch bantuan details based on noBantuan
onMounted(() => {
  // Mock data based on noBantuan - replace with actual API call
  const mockData = {
    'NAS-2025-0001': {
      namaBantuan: 'Bantuan BaikPulih Rumah AM (Miskin)',
      status: 'Lulus',
      tarikhMula: '1/1/2025',
      tarikhTamat: '12/31/2025',
    },
    'NAS-2025-0002': {
      namaBantuan: 'Bantuan Kematian',
      status: 'Lulus',
      tarikhMula: '1/1/2025',
      tarikhTamat: '12/31/2025',
    },
    'NAS-2025-0003': {
      namaBantuan: 'Bantuan Kelahiran',
      status: 'Lulus',
      tarikhMula: '1/1/2025',
      tarikhTamat: '12/31/2025',
    },
    'NAS-2025-0004': {
      namaBantuan: '(HQ) BANTUAN DERMASISWA SEKOLAH ASRAMA (FAKIR)',
      status: 'Lulus',
      tarikhMula: '1/1/2025',
      tarikhTamat: '12/31/2025',
    },
  };

  if (mockData[noBantuan]) {
    bantuanInfo.value = {
      noBantuan: noBantuan,
      ...mockData[noBantuan],
    };
  }
});
</script>

<style scoped>
</style>

