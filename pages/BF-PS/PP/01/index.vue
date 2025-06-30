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
          <h2 class="text-xl font-semibold">Daftar Pengguna Baharu</h2>
        </div>
      </template>

      <template #body>
        <form @submit.prevent="submitForm" class="space-y-8">
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
              />

              <FormKit
                v-model="form.nama"
                type="text"
                label="Nama"
                placeholder="Nama penuh pengguna"
                validation="required"
              />

              <FormKit
                v-model="form.noKp"
                type="text"
                label="No. KP / Passport / Foreign ID"
                placeholder="Contoh: 800101015432"
                validation="required"
                @blur="validateNoKp"
              />

              <FormKit
                v-model="form.emel"
                type="email"
                label="Emel"
                placeholder="emel@contoh.com"
                validation="required|email"
                @blur="validateEmail"
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
            <div class="mb-4 p-3 bg-blue-50 rounded-lg">
              <p class="text-sm text-blue-800">
                <Icon name="ic:baseline-info" class="inline mr-1" />
                Senarai peranan yang tersedia untuk jenis pengguna: 
                <span class="font-medium">{{ form.jenisPengguna || 'Pilih jenis pengguna terlebih dahulu' }}</span>
              </p>
            </div>
            
            <div v-if="filteredPeranan.length > 0" class="space-y-3">
              <div class="grid grid-cols-12 gap-4 p-3 bg-gray-50 rounded-lg font-medium text-sm">
                <div class="col-span-1">No</div>
                <div class="col-span-6">Nama Peranan</div>
                <div class="col-span-2 text-center">Peranan</div>
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
                  <FormKit
                    v-model="peranan.selected"
                    type="checkbox"
                    @change="updatePerananSemasa"
                  />
                </div>
                <div class="col-span-3 flex justify-center">
                  <FormKit
                    v-model="form.perananSemasa"
                    type="radio"
                    :value="peranan.id"
                    :disabled="!peranan.selected"
                  />
                </div>
              </div>
            </div>
            
            <div v-else class="text-center py-8 text-gray-500">
              <Icon name="ic:baseline-people" class="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>Sila pilih jenis pengguna untuk melihat senarai peranan yang tersedia</p>
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
              @click="saveAsDraft"
              :loading="saving"
            >
              <Icon name="ic:baseline-save" class="mr-1" />
              Simpan
            </rs-button>
            <rs-button
              variant="primary"
              type="submit"
              :loading="submitting"
              :disabled="!isFormValid"
            >
              <Icon name="ic:baseline-person-add" class="mr-1" />
              Daftar
            </rs-button>
          </div>
        </form>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";

definePageMeta({
  title: "Daftar Pengguna Baharu",
});

const breadcrumb = ref([
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
    name: "Daftar Pengguna Baharu",
    type: "current",
    path: "/BF-PS/PP/01",
  },
]);

// Reactive form data
const form = ref({
  jenisPengguna: '',
  nama: '',
  noKp: '',
  emel: '',
  noTel: '',
  status: 'Aktif',
  idPengguna: '',
  kataLaluan: '',
  perananSemasa: ''
});

// Form validation errors
const errors = ref({
  nama: '',
  noKp: '',
  emel: '',
  noTel: ''
});

// Loading states
const submitting = ref(false);
const saving = ref(false);

// Options for form fields
const jenisPenggunaOptions = [
  { label: 'Staf', value: 'Staf' },
  { label: 'Bukan Staf', value: 'Bukan Staf' }
];

const statusOptions = [
  { label: 'Aktif', value: 'Aktif' },
  { label: 'Tidak Aktif', value: 'Tidak Aktif' }
];

// Peranan data - filtered by jenis pengguna
const perananList = ref([
  { id: 1, nama: 'Admin Sistem', jenisPengguna: 'Staf', selected: false },
  { id: 2, nama: 'Pegawai Bantuan', jenisPengguna: 'Bukan Staf', selected: false },
  { id: 3, nama: 'Pegawai Sistem', jenisPengguna: 'Staf', selected: false },
  { id: 4, nama: 'Pegawai Audit', jenisPengguna: 'Staf', selected: false },
  { id: 5, nama: 'Pegawai Lapangan', jenisPengguna: 'Bukan Staf', selected: false },
  { id: 6, nama: 'Pengguna Awam', jenisPengguna: 'Bukan Staf', selected: false },
  { id: 7, nama: 'Pegawai Pentadbir', jenisPengguna: 'Staf', selected: false }
]);

// Computed properties
const filteredPeranan = computed(() => {
  if (!form.value.jenisPengguna) return [];
  return perananList.value.filter(peranan => 
    peranan.jenisPengguna === form.value.jenisPengguna
  );
});

const isFormValid = computed(() => {
  return form.value.jenisPengguna &&
         form.value.nama &&
         form.value.noKp &&
         form.value.emel &&
         form.value.perananSemasa &&
         !errors.value.nama &&
         !errors.value.noKp &&
         !errors.value.emel &&
         !errors.value.noTel;
});

// Methods
const onJenisPenggunaChange = () => {
  // Reset peranan selection when jenis pengguna changes
  perananList.value.forEach(p => p.selected = false);
  form.value.perananSemasa = '';
  
  // Auto-set ID Pengguna to No. KP
  if (form.value.noKp) {
    form.value.idPengguna = form.value.noKp;
  }
};

const validateNoKp = async () => {
  if (!form.value.noKp) {
    errors.value.noKp = 'No. KP / Passport / Foreign ID adalah wajib';
    return;
  }
  
  // Basic format validation
  if (form.value.noKp.length < 6) {
    errors.value.noKp = 'No. KP / Passport / Foreign ID mesti sekurang-kurangnya 6 aksara';
    return;
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
    '880808089234'
  ];
  
  if (existingUsers.includes(form.value.noKp)) {
    errors.value.noKp = 'No. KP / Passport / Foreign ID sudah wujud dalam sistem';
  } else {
    errors.value.noKp = '';
    // Auto-set ID Pengguna
    form.value.idPengguna = form.value.noKp;
  }
};

const validateEmail = () => {
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
  // Ensure only one peranan semasa is selected
  const selectedPeranan = perananList.value.filter(p => p.selected);
  if (selectedPeranan.length === 1) {
    form.value.perananSemasa = selectedPeranan[0].id;
  } else if (selectedPeranan.length === 0) {
    form.value.perananSemasa = '';
  }
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

const submitForm = async () => {
  if (!isFormValid.value) {
    $toast.error('Sila isi semua medan yang wajib');
    return;
  }
  
  try {
    submitting.value = true;
    
    // Generate password
    const password = generatePassword();
    form.value.kataLaluan = password;
    
    // Prepare data for API
    const userData = {
      ...form.value,
      peranan: perananList.value.filter(p => p.selected).map(p => p.id)
    };
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    $toast.success('Pengguna berjaya didaftarkan');
    
    // Show password notification
    await $alert({
      title: 'Pendaftaran Berjaya',
      message: `Pengguna "${form.value.nama}" telah berjaya didaftarkan. Kata laluan sementara: ${password}`,
      confirmText: 'OK',
      color: 'green'
    });
    
    // Navigate back to user list
    navigateTo('/BF-PS/PP');
    
  } catch (error) {
    $toast.error('Ralat semasa mendaftarkan pengguna');
  } finally {
    submitting.value = false;
  }
};

const saveAsDraft = async () => {
  try {
    saving.value = true;
    
    // Save as draft (status: draft)
    const draftData = {
      ...form.value,
      status: 'Draft',
      peranan: perananList.value.filter(p => p.selected).map(p => p.id)
    };
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    $toast.success('Data disimpan sebagai draf');
    
  } catch (error) {
    $toast.error('Ralat semasa menyimpan draf');
  } finally {
    saving.value = false;
  }
};

const resetForm = () => {
  form.value = {
    jenisPengguna: '',
    nama: '',
    noKp: '',
    emel: '',
    noTel: '',
    status: 'Aktif',
    idPengguna: '',
    kataLaluan: '',
    perananSemasa: ''
  };
  
  errors.value = {
    nama: '',
    noKp: '',
    emel: '',
    noTel: ''
  };
  
  perananList.value.forEach(p => p.selected = false);
};

// Watch for changes to auto-set ID Pengguna
watch(() => form.value.noKp, (newValue) => {
  if (newValue && form.value.jenisPengguna) {
    form.value.idPengguna = newValue;
  }
});

// Initialize form
onMounted(() => {
  // Set default status
  form.value.status = 'Aktif';
});
</script>

<style scoped>
/* Custom styles if needed */
</style>