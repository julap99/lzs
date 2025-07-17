<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex items-center gap-3">
          <rs-button
            variant="ghost"
            @click="navigateTo('/BF-PS/PP')"
          >
            <Icon name="ic:baseline-arrow-back" class="mr-1" />
            Kembali
          </rs-button>
          <h2 class="text-xl font-semibold">{{ isEditMode ? 'Kemaskini Pengguna' : 'Daftar Pengguna Baharu' }}</h2>
          <rs-badge v-if="isEditMode" variant="warning">Mode Kemaskini</rs-badge>
          <rs-badge v-else variant="primary">Mode Pendaftaran</rs-badge>
        </div>
      </template>

      <template #body>
        <!-- Form Valid Success Indicator -->
        <div v-if="isFormValid && !isEditMode" class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div class="flex items-center gap-2">
            <Icon name="ic:baseline-check-circle" class="text-green-600" />
            <h4 class="font-medium text-green-900">Semua maklumat telah lengkap! Anda boleh menyimpan data sekarang.</h4>
          </div>
        </div>

        <!-- Subtle Validation Indicator for First-time Users -->
        <div v-if="validationErrorCount > 0 && !hasUserInteracted" class="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div class="flex items-center gap-2">
            <Icon name="ic:baseline-info" class="text-blue-600" />
            <span class="text-sm text-blue-800">Sila lengkapkan semua medan yang wajib untuk meneruskan.</span>
          </div>
        </div>

        <form @submit.prevent="saveForm" class="space-y-8">
          <!-- A. Maklumat Pengguna -->
          <div>
            <h3 class="text-lg font-semibold mb-4 text-gray-900 border-b pb-2">A. Maklumat Pengguna</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormKit
                v-model="form.jenisPengguna"
                type="select"
                label="Jenis Pengguna"
                :options="jenisPenggunaOptions"
                validation="required"
                @change="onJenisPenggunaChange"
                :disabled="isEditMode"
                :classes="{
                  input: jenisPenggunaValidation.isValid ? 'form-success' : 'form-error'
                }"
                :help="jenisPenggunaValidation.message"
              />

              <FormKit
                v-model="form.nama"
                type="text"
                label="Nama"
                placeholder="Nama penuh pengguna"
                validation="required"
                :classes="{
                  input: namaValidation.isValid ? 'form-success' : 'form-error'
                }"
                :help="namaValidation.message"
              />

              <FormKit
                v-model="form.jenisPengenalan"
                type="select"
                label="Jenis Pengenalan"
                :options="jenisPengenalanOptions"
                validation="required"
                @change="onJenisPengenalanChange"
                :classes="{
                  input: jenisPengenalanValidation.isValid ? 'form-success' : 'form-error'
                }"
                :help="jenisPengenalanValidation.message"
              />

              <FormKit
                v-model="form.noKp"
                type="text"
                label="No. MyKad / Foreign ID"
                :placeholder="getPlaceholderText()"
                validation="required"
                @blur="validateNoKp"
                :classes="{
                  input: noKpValidation.isValid ? 'form-success' : 'form-error'
                }"
                :help="noKpValidation.message"
              />

              <FormKit
                v-model="form.emel"
                type="email"
                label="Emel"
                placeholder="emel@contoh.com"
                validation="required|email"
                @blur="validateEmail"
                :classes="{
                  input: emelValidation.isValid ? 'form-success' : 'form-error'
                }"
                :help="emelValidation.message"
              />

              <FormKit
                v-model="form.noTel"
                type="text"
                label="No. Tel Bimbit"
                placeholder="012-3456789"
              />

              <FormKit
                v-model="form.status"
                type="select"
                label="Status"
                :options="statusOptions"
                validation="required"
                :classes="{
                  input: statusValidation.isValid ? 'form-success' : 'form-error'
                }"
                :help="statusValidation.message"
              />
            </div>
          </div>

          <!-- B. Maklumat Log Masuk -->
          <div>
            <h3 class="text-lg font-semibold mb-4 text-gray-900 border-b pb-2">B. Maklumat Log Masuk</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormKit
                v-model="form.idPengguna"
                type="text"
                label="ID Pengguna"
                disabled
                help="Disamakan dengan No. KP/ID"
              />

              <FormKit
                v-model="form.kataLaluan"
                type="password"
                label="Kata Laluan"
                placeholder="Auto-generate"
                disabled
                help="Auto-generate, tidak editable oleh Admin"
              />
            </div>
          </div>

          <!-- C. Senarai Peranan Pengguna -->
          <div>
            <h3 class="text-lg font-semibold mb-4 text-gray-900 border-b pb-2">C. Senarai Peranan Pengguna</h3>
            
            <!-- Debug Info (Temporary) -->
            <div class="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-xs">
              <p><strong>Debug Info:</strong></p>
              <p>Selected roles: {{ perananList.filter(p => p.selected).map(p => p.nama).join(', ') }}</p>
              <p>perananSemasa: {{ form.perananSemasa }}</p>
              <p>Validation isValid: {{ perananSemasaValidation.isValid }}</p>
              <p>Validation message: {{ perananSemasaValidation.message }}</p>
            </div>
            
            <div class="mb-4 p-3 bg-blue-50 rounded-lg">
              <p class="text-sm text-blue-800">
                <Icon name="ic:baseline-info" class="inline mr-1" />
                <strong>Arahan:</strong> Pilih jenis pengguna terlebih dahulu, kemudian tandakan peranan yang sesuai dan pilih satu peranan sebagai peranan semasa.
              </p>
            </div>
            
            <div v-if="filteredPeranan.length > 0" class="space-y-3">
              <div class="grid grid-cols-12 gap-4 p-3 bg-gray-50 rounded-lg font-medium text-sm">
                <div class="col-span-1">No</div>
                <div class="col-span-6">Nama Peranan</div>
                <div class="col-span-2 text-center">Pilih Peranan</div>
                <div class="col-span-3 text-center">Peranan Semasa</div>
              </div>
              
              <div
                v-for="(peranan, index) in filteredPeranan"
                :key="peranan.id"
                class="grid grid-cols-12 gap-4 p-3 border rounded-lg items-center hover:bg-gray-50"
              >
                <div class="col-span-1 text-sm text-gray-500">{{ index + 1 }}</div>
                <div class="col-span-6">{{ peranan.nama }}</div>
                <div class="col-span-2 flex justify-center">
                  <input
                    type="checkbox"
                    :checked="peranan.selected"
                    @change="(event) => { peranan.selected = event.target.checked; updatePerananSemasa(); }"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                </div>
                <div class="col-span-3 flex justify-center">
                  <input
                    type="radio"
                    :name="'peranan-semasa-' + form.jenisPengguna"
                    :value="peranan.id"
                    :checked="form.perananSemasa === peranan.id"
                    :disabled="!peranan.selected"
                    @change="(event) => { form.perananSemasa = event.target.value; hasUserInteracted = true; }"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                  />
                </div>
              </div>
            </div>
            
            <div v-else class="text-center py-8 text-gray-500">
              <Icon name="ic:baseline-people" class="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>Sila pilih jenis pengguna untuk melihat senarai peranan yang tersedia</p>
            </div>
          </div>

          <!-- Validation Summary - Only show when user has interacted or there are errors -->
          <div v-if="validationErrorCount > 0 && hasUserInteracted" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div class="flex items-center gap-2 mb-3">
              <Icon name="ic:baseline-error" class="text-red-600" />
              <h4 class="font-medium text-red-900">Sila Lengkapkan Maklumat Berikut ({{ validationErrorCount }} kesalahan):</h4>
            </div>
            <div class="space-y-1 text-sm text-red-800">
              <div v-if="!jenisPenggunaValidation.isValid" class="flex items-center gap-2">
                <Icon name="ic:baseline-close" class="w-3 h-3" />
                <span>{{ jenisPenggunaValidation.message }}</span>
              </div>
              <div v-if="!namaValidation.isValid" class="flex items-center gap-2">
                <Icon name="ic:baseline-close" class="w-3 h-3" />
                <span>{{ namaValidation.message }}</span>
              </div>
              <div v-if="!jenisPengenalanValidation.isValid" class="flex items-center gap-2">
                <Icon name="ic:baseline-close" class="w-3 h-3" />
                <span>{{ jenisPengenalanValidation.message }}</span>
              </div>
              <div v-if="!noKpValidation.isValid" class="flex items-center gap-2">
                <Icon name="ic:baseline-close" class="w-3 h-3" />
                <span>{{ noKpValidation.message }}</span>
              </div>
              <div v-if="!emelValidation.isValid" class="flex items-center gap-2">
                <Icon name="ic:baseline-close" class="w-3 h-3" />
                <span>{{ emelValidation.message }}</span>
              </div>
              <div v-if="!statusValidation.isValid" class="flex items-center gap-2">
                <Icon name="ic:baseline-close" class="w-3 h-3" />
                <span>{{ statusValidation.message }}</span>
              </div>
              <div v-if="!perananSemasaValidation.isValid" class="flex items-center gap-2">
                <Icon name="ic:baseline-close" class="w-3 h-3" />
                <span>{{ perananSemasaValidation.message }}</span>
              </div>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="flex justify-end gap-3 pt-6 border-t">
            <rs-button
              variant="ghost"
              @click="resetForm"
            >
              <Icon name="ic:baseline-refresh" class="mr-1" />
              Reset
            </rs-button>
            <rs-button
              variant="ghost"
              @click="navigateTo('/BF-PS/PP')"
            >
              <Icon name="ic:baseline-cancel" class="mr-1" />
              Batal
            </rs-button>
            <rs-button
              variant="outline"
              @click="saveForm"
              :loading="saving"
              :disabled="!isFormValid"
            >
              <Icon name="ic:baseline-save" class="mr-1" />
              {{ isFormValid ? 'Simpan' : `Simpan (${validationErrorCount} kesalahan)` }}
            </rs-button>
            <rs-button
              variant="primary"
              @click="registerUser"
              :loading="registering"
              :disabled="!isFormValid || !isDataSaved"
            >
              <Icon name="ic:baseline-person-add" class="mr-1" />
              {{ isEditMode ? 'Kemaskini & Daftar' : 'Daftar' }}
              <span v-if="!isDataSaved && isFormValid" class="ml-1 text-xs">(Sila simpan dahulu)</span>
            </rs-button>
          </div>
        </form>
      </template>
    </rs-card>

    <!-- Success Modal for Save -->
    <rs-modal
      v-model="showSaveSuccessModal"
      title="Data Berjaya Disimpan"
      size="md"
      position="center"
    >
      <template #body>
        <div class="text-center py-6">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="ic:baseline-check-circle" class="w-8 h-8 text-green-600" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Data Berjaya Disimpan!</h3>
          <p class="text-gray-600 mb-4">{{ saveSuccessMessage }}</p>
          <div class="bg-blue-50 p-3 rounded-lg text-sm">
            <p class="font-medium text-blue-900">Sistem telah dikemaskini</p>
            <p class="text-blue-700">Data pengguna telah disimpan ke pangkalan data</p>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-center">
          <rs-button variant="primary" @click="showSaveSuccessModal = false">
            <Icon name="ic:baseline-check" class="mr-1" />
            Terima Kasih
          </rs-button>
        </div>
      </template>
    </rs-modal>

    <!-- Success Modal for Registration -->
    <rs-modal
      v-model="showRegisterSuccessModal"
      title="Pendaftaran Berjaya"
      size="lg"
      position="center"
    >
      <template #body>
        <div class="text-center py-6">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="ic:baseline-check-circle" class="w-8 h-8 text-green-600" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Pengguna Berjaya Didaftarkan!</h3>
          <p class="text-gray-600 mb-4">{{ registerSuccessMessage }}</p>
          
          <!-- Notification Details -->
          <div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <h4 class="font-medium text-green-900 mb-2">Notifikasi Telah Dihantar:</h4>
            <div class="space-y-2 text-sm text-green-800">
              <div class="flex items-center gap-2">
                <Icon name="ic:baseline-email" class="w-4 h-4" />
                <span>Emel: {{ form.emel }}</span>
              </div>
              <div class="flex items-center gap-2">
                <Icon name="ic:baseline-sms" class="w-4 h-4" />
                <span>SMS: {{ form.noTel }}</span>
              </div>
            </div>
          </div>

          <!-- Account Details -->
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 class="font-medium text-blue-900 mb-2">Maklumat Akaun:</h4>
            <div class="grid grid-cols-2 gap-4 text-sm text-blue-800">
              <div>
                <span class="font-medium">ID Pengguna:</span>
                <p class="font-mono">{{ form.idPengguna }}</p>
              </div>
              <div>
                <span class="font-medium">Kata Laluan Sementara:</span>
                <p class="font-mono">{{ generatedPassword }}</p>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-center space-x-3">
          <rs-button variant="outline" @click="showRegisterSuccessModal = false">
            Tutup
          </rs-button>
          <rs-button variant="primary" @click="navigateTo('/BF-PS/PP')">
            <Icon name="ic:baseline-list" class="mr-1" />
            Lihat Senarai Pengguna
          </rs-button>
        </div>
      </template>
    </rs-modal>

    <!-- Error Modal -->
    <rs-modal
      v-model="showErrorModal"
      title="Ralat Sistem"
      size="md"
      position="center"
    >
      <template #body>
        <div class="text-center py-6">
          <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="ic:baseline-error" class="w-8 h-8 text-red-600" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Ralat Berlaku</h3>
          <p class="text-gray-600 mb-4">{{ errorMessage }}</p>
          <div class="bg-red-50 p-3 rounded-lg text-sm">
            <p class="font-medium text-red-900">Sila cuba lagi</p>
            <p class="text-red-700">Hubungi pentadbir sistem jika masalah berterusan</p>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-center">
          <rs-button variant="primary" @click="showErrorModal = false">
            <Icon name="ic:baseline-check" class="mr-1" />
            OK
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, reactive } from "vue";

definePageMeta({
  title: "Daftar Pengguna Baharu",
});

const route = useRoute();

// Determine if we're in edit mode
const isEditMode = computed(() => route.query.mode === 'edit');
const userId = computed(() => route.query.userId);

// Update breadcrumb based on mode
const breadcrumb = computed(() => [
  {
    name: "Pentadbir Sistem",
    type: "link",
    path: "/BF-PS",
  },
  {
    name: "Pengurusan Pengguna",
    type: "link",
    path: "/BF-PS/PP",
  },
  {
    name: isEditMode.value ? "Kemaskini Pengguna" : "Daftar Pengguna Baharu",
    type: "current",
    path: "/BF-PS/PP/01",
  },
]);

// Reactive form data
const form = ref({
  jenisPengguna: '',
  nama: '',
  jenisPengenalan: '',
  noKp: '',
  emel: '',
  noTel: '',
  status: '',
  idPengguna: '',
  kataLaluan: '',
  perananSemasa: ''
});

// Form validation errors
const errors = ref({
  jenisPengguna: '',
  nama: '',
  jenisPengenalan: '',
  noKp: '',
  emel: '',
  noTel: '',
  status: '',
  perananSemasa: ''
});

// Validation status for each field
const jenisPenggunaValidation = computed(() => ({
  isValid: !!form.value.jenisPengguna,
  message: form.value.jenisPengguna ? '' : 'Jenis pengguna adalah wajib'
}));

const namaValidation = computed(() => ({
  isValid: !!form.value.nama && form.value.nama.trim().length > 0,
  message: form.value.nama ? '' : 'Nama adalah wajib'
}));

const jenisPengenalanValidation = computed(() => ({
  isValid: !!form.value.jenisPengenalan,
  message: form.value.jenisPengenalan ? '' : 'Jenis pengenalan adalah wajib'
}));

const noKpValidation = computed(() => ({
  isValid: !!form.value.noKp && !errors.value.noKp,
  message: errors.value.noKp || (form.value.noKp ? '' : 'No. KP/ID adalah wajib')
}));

const emelValidation = computed(() => ({
  isValid: !!form.value.emel && !errors.value.emel,
  message: errors.value.emel || (form.value.emel ? '' : 'Emel adalah wajib')
}));

const statusValidation = computed(() => ({
  isValid: !!form.value.status,
  message: form.value.status ? '' : 'Status adalah wajib'
}));

const perananSemasaValidation = computed(() => {
  // Check if any roles are selected
  const selectedPeranan = perananList.filter(p => p.selected);
  const hasSelectedRoles = selectedPeranan.length > 0;
  
  return {
    isValid: hasSelectedRoles,
    message: hasSelectedRoles ? '' : 'Sila pilih sekurang-kurangnya satu peranan'
  };
});

const isFormValid = computed(() => {
  return jenisPenggunaValidation.value.isValid &&
         namaValidation.value.isValid &&
         jenisPengenalanValidation.value.isValid &&
         noKpValidation.value.isValid &&
         emelValidation.value.isValid &&
         statusValidation.value.isValid &&
         perananSemasaValidation.value.isValid;
});

// Count validation errors
const validationErrorCount = computed(() => {
  const validations = [
    jenisPenggunaValidation.value,
    namaValidation.value,
    jenisPengenalanValidation.value,
    noKpValidation.value,
    emelValidation.value,
    statusValidation.value,
    perananSemasaValidation.value
  ];
  return validations.filter(validation => !validation.isValid).length;
});

// Loading states
const saving = ref(false);
const registering = ref(false);

// Modal states
const showSaveSuccessModal = ref(false);
const showRegisterSuccessModal = ref(false);
const showErrorModal = ref(false);
const saveSuccessMessage = ref('');
const registerSuccessMessage = ref('');
const errorMessage = ref('');
const generatedPassword = ref('');

// Track if data has been saved
const isDataSaved = ref(false);

// Track if user has interacted with the form
const hasUserInteracted = ref(false);

// Options for form fields
const jenisPenggunaOptions = [
  { label: 'Sila Pilih Jenis Pengguna', value: '', disabled: true },
  { label: 'AD', value: 'AD' },
  { label: 'NPS', value: 'NPS' },
  { label: 'Awam', value: 'Awam' }
];

const jenisPengenalanOptions = [
  { label: 'Sila Pilih Jenis Pengenalan', value: '', disabled: true },
  { label: 'MyKad', value: 'MyKad' },
  { label: 'Foreign ID', value: 'Foreign ID' }
];

const statusOptions = [
  { label: 'Sila Pilih Status', value: '', disabled: true },
  { label: 'Aktif', value: 'Aktif' },
  { label: 'Tidak Aktif', value: 'Tidak Aktif' }
];

// Enhanced mock user data with multiple roles
const mockUsers = ref([
  {
    id: 1,
    jenisPengguna: 'AD',
    nama: 'Ahmad bin Abdullah',
    noKp: '800101015432',
    emel: 'ahmad.abdullah@nas.gov.my',
    perananSemasa: [1, 3], // Admin Sistem, Pegawai Sistem
    jenisSumberData: 'NAS',
    status: 'Aktif',
    noTel: '012-3456789'
  },
  {
    id: 2,
    jenisPengguna: 'NPS',
    nama: 'Siti binti Mohamed',
    noKp: '850505025678',
    emel: 'siti.mohamed@example.com',
    perananSemasa: [2, 5], // Pegawai Bantuan, Pegawai Lapangan
    jenisSumberData: 'AD',
    status: 'Aktif',
    noTel: '013-4567890'
  },
  {
    id: 3,
    jenisPengguna: 'AD',
    nama: 'Mohd Ali bin Hassan',
    noKp: '820202036789',
    emel: 'ali.hassan@nas.gov.my',
    perananSemasa: [3, 4], // Pegawai Sistem, Pegawai Audit
    jenisSumberData: 'NPS',
    status: 'Tidak Aktif',
    noTel: '014-5678901'
  },
  {
    id: 4,
    jenisPengguna: 'AD',
    nama: 'Nurul Ain binti Ibrahim',
    noKp: '870707047890',
    emel: 'nurul.ain@nas.gov.my',
    perananSemasa: [4], // Pegawai Audit
    jenisSumberData: 'NAS',
    status: 'Aktif',
    noTel: '015-6789012'
  },
  {
    id: 5,
    jenisPengguna: 'NPS',
    nama: 'Abdul Rahman bin Sulaiman',
    noKp: '830303038901',
    emel: 'abdul.rahman@example.com',
    perananSemasa: [5], // Pegawai Lapangan
    jenisSumberData: 'AD',
    status: 'Aktif',
    noTel: '016-7890123'
  },
  {
    id: 6,
    jenisPengguna: 'AD',
    nama: 'Fatimah binti Ahmad',
    noKp: '860606069012',
    emel: 'fatimah.ahmad@nas.gov.my',
    perananSemasa: [7], // Pegawai Pentadbir
    jenisSumberData: 'NPS',
    status: 'Aktif',
    noTel: '017-8901234'
  },
  {
    id: 7,
    jenisPengguna: 'Awam',
    nama: 'Ismail bin Omar',
    noKp: '840404049123',
    emel: 'ismail.omar@example.com',
    perananSemasa: [6], // Pengguna Awam
    jenisSumberData: 'Awam',
    status: 'Tidak Aktif',
    noTel: '018-9012345'
  },
  {
    id: 8,
    jenisPengguna: 'AD',
    nama: 'Zainab binti Yusof',
    noKp: '880808089234',
    emel: 'zainab.yusof@nas.gov.my',
    perananSemasa: [1, 7], // Admin Sistem, Pegawai Pentadbir
    jenisSumberData: 'NAS',
    status: 'Aktif',
    noTel: '019-0123456'
  }
]);

// Peranan data - filtered by jenis pengguna
const perananList = reactive([
  { id: 1, nama: 'Admin Sistem', jenisPengguna: 'AD', selected: false },
  { id: 2, nama: 'Pegawai Bantuan', jenisPengguna: 'NPS', selected: false },
  { id: 3, nama: 'Pegawai Sistem', jenisPengguna: 'AD', selected: false },
  { id: 4, nama: 'Pegawai Audit', jenisPengguna: 'AD', selected: false },
  { id: 5, nama: 'Pegawai Lapangan', jenisPengguna: 'NPS', selected: false },
  { id: 6, nama: 'Pengguna Awam', jenisPengguna: 'Awam', selected: false },
  { id: 7, nama: 'Pegawai Pentadbir', jenisPengguna: 'AD', selected: false },
  { id: 8, nama: 'Pegawai Khas', jenisPengguna: 'NPS', selected: false }
]);

// Computed properties
const filteredPeranan = computed(() => {
  if (!form.value.jenisPengguna) return [];
  return perananList.filter(peranan => 
    peranan.jenisPengguna === form.value.jenisPengguna
  );
});

// Methods
const getPlaceholderText = () => {
  if (form.value.jenisPengenalan === 'MyKad') {
    return 'Contoh: 800101015432';
  } else if (form.value.jenisPengenalan === 'Foreign ID') {
    return 'Contoh: A1234567B';
  } else {
    return 'Pilih jenis pengenalan terlebih dahulu';
  }
};

const onJenisPenggunaChange = () => {
  // Reset peranan selection when jenis pengguna changes
  perananList.forEach(p => p.selected = false);
  form.value.perananSemasa = '';
  
  // Auto-set ID Pengguna to No. KP
  if (form.value.noKp) {
    form.value.idPengguna = form.value.noKp;
  }
  
  // Mark that user has interacted
  hasUserInteracted.value = true;
};

const onJenisPengenalanChange = () => {
  // Clear the ID number when changing identification type
  form.value.noKp = '';
  form.value.idPengguna = '';
  errors.value.noKp = '';
  
  // Mark that user has interacted
  hasUserInteracted.value = true;
};

const validateNoKp = async () => {
  // Mark that user has interacted
  hasUserInteracted.value = true;
  
  if (!form.value.noKp) {
    errors.value.noKp = 'No. MyKad / Foreign ID adalah wajib';
    return;
  }

  if (!form.value.jenisPengenalan) {
    errors.value.noKp = 'Sila pilih jenis pengenalan terlebih dahulu';
    return;
  }
  
  // Format validation based on identification type
  if (form.value.jenisPengenalan === 'MyKad') {
    // MyKad should be 12 digits
    const myKadRegex = /^\d{12}$/;
    if (!myKadRegex.test(form.value.noKp)) {
      errors.value.noKp = 'No. MyKad mesti mengandungi 12 digit sahaja';
      return;
    }
  } else if (form.value.jenisPengenalan === 'Foreign ID') {
    // Foreign ID should be at least 6 characters
    if (form.value.noKp.length < 6) {
      errors.value.noKp = 'No. Foreign ID mesti sekurang-kurangnya 6 aksara';
      return;
    }
  }
  
  // Check for uniqueness (mock validation)
  const existingUsers = [
    '800101015432',
    '850505025678',
    '820202036789',
    '870707047890',
    '830303038901',
    '860606069012',
    '840404049123',
    '880808089234',
    'A1234567B',
    'P9876543C'
  ];
  
  if (existingUsers.includes(form.value.noKp) && !isEditMode.value) {
    errors.value.noKp = 'No. MyKad / Foreign ID sudah wujud dalam sistem';
  } else {
    errors.value.noKp = '';
    // Auto-set ID Pengguna
    form.value.idPengguna = form.value.noKp;
  }
};

const validateEmail = () => {
  // Mark that user has interacted
  hasUserInteracted.value = true;
  
  if (!form.value.emel) {
    errors.value.emel = 'Emel adalah wajib';
    return;
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(form.value.emel)) {
    errors.value.emel = 'Format emel tidak sah';
    return;
  }
  
  errors.value.emel = '';
};

const updatePerananSemasa = () => {
  // Get all selected peranan
  const selectedPeranan = perananList.filter(p => p.selected);
  
  if (selectedPeranan.length > 0) {
    // Set the first selected peranan as the current peranan
    form.value.perananSemasa = selectedPeranan[0].id;
  } else {
    // Clear peranan semasa if no roles are selected
    form.value.perananSemasa = '';
  }
  
  // Mark that user has interacted
  hasUserInteracted.value = true;
};

const generatePassword = () => {
  // Generate a random password
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

// Load user data for edit mode
const loadUserData = (userId) => {
  const user = mockUsers.value.find(u => u.id == userId);
  if (user) {
    form.value = {
      jenisPengguna: user.jenisPengguna,
      nama: user.nama,
      jenisPengenalan: user.noKp.length === 12 ? 'MyKad' : 'Foreign ID',
      noKp: user.noKp,
      emel: user.emel,
      noTel: user.noTel,
      status: user.status,
      idPengguna: user.noKp,
      kataLaluan: '********',
      perananSemasa: Array.isArray(user.perananSemasa) ? user.perananSemasa[0] : user.perananSemasa
    };

    // Set selected roles
    perananList.forEach(p => {
      p.selected = Array.isArray(user.perananSemasa) 
        ? user.perananSemasa.includes(p.id)
        : user.perananSemasa === p.id;
    });
    
    // Mark as user interaction since we're in edit mode
    hasUserInteracted.value = true;
  }
};

// Save form data
const saveForm = async () => {
  if (!isFormValid.value) {
    errorMessage.value = 'Sila isi semua medan yang wajib';
    showErrorModal.value = true;
    return;
  }
  
  try {
    saving.value = true;
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    isDataSaved.value = true;
    saveSuccessMessage.value = isEditMode.value 
      ? `Maklumat pengguna "${form.value.nama}" telah berjaya disimpan.`
      : `Data pengguna "${form.value.nama}" telah berjaya disimpan ke pangkalan data.`;
    
    showSaveSuccessModal.value = true;
    
  } catch (error) {
    errorMessage.value = 'Ralat berlaku semasa menyimpan data. Sila cuba lagi.';
    showErrorModal.value = true;
  } finally {
    saving.value = false;
  }
};

// Register user (final step)
const registerUser = async () => {
  if (!isDataSaved.value) {
    errorMessage.value = 'Sila simpan data terlebih dahulu sebelum mendaftar pengguna.';
    showErrorModal.value = true;
    return;
  }
  
  try {
    registering.value = true;
    
    // Generate password
    generatedPassword.value = generatePassword();
    
    // Simulate API call for registration
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    registerSuccessMessage.value = isEditMode.value
      ? `Pengguna "${form.value.nama}" telah berjaya dikemaskini dan didaftarkan semula.`
      : `Pengguna "${form.value.nama}" telah berjaya didaftarkan ke dalam sistem.`;
    
    showRegisterSuccessModal.value = true;
    
  } catch (error) {
    errorMessage.value = 'Ralat berlaku semasa mendaftar pengguna. Sila cuba lagi.';
    showErrorModal.value = true;
  } finally {
    registering.value = false;
  }
};

const resetForm = () => {
  form.value = {
    jenisPengguna: '',
    nama: '',
    jenisPengenalan: '',
    noKp: '',
    emel: '',
    noTel: '',
    status: '',
    idPengguna: '',
    kataLaluan: '',
    perananSemasa: ''
  };
  
  errors.value = {
    jenisPengguna: '',
    nama: '',
    jenisPengenalan: '',
    noKp: '',
    emel: '',
    noTel: '',
    status: '',
    perananSemasa: ''
  };
  
  // Reset peranan selection
  perananList.forEach(p => p.selected = false);
  isDataSaved.value = false;
  hasUserInteracted.value = false;
};

// Watch for changes to auto-set ID Pengguna
watch(() => form.value.noKp, (newValue) => {
  if (newValue && form.value.jenisPengguna) {
    form.value.idPengguna = newValue;
  }
  hasUserInteracted.value = true;
});

// Watch for form field changes to track user interaction
watch(() => form.value.nama, () => {
  hasUserInteracted.value = true;
});

watch(() => form.value.emel, () => {
  hasUserInteracted.value = true;
});

watch(() => form.value.status, () => {
  hasUserInteracted.value = true;
});

// Initialize form based on mode
onMounted(() => {
  if (isEditMode.value && userId.value) {
    loadUserData(userId.value);
  }
});
</script>

<style scoped>
/* Form validation styling */
.form-error {
  border-color: #ef4444;
}

.form-error:focus {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

/* Success state styling */
.form-success {
  border-color: #10b981;
}

.form-success:focus {
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

/* Modal animations */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* Button states */
.btn-disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-loading {
  position: relative;
  color: transparent;
}

.btn-loading::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 16px;
  height: 16px;
  margin: -8px 0 0 -8px;
  border: 2px solid transparent;
  border-top-color: currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>