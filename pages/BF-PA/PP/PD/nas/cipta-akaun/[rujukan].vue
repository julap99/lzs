<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Cipta Akaun Login - NAS System
          </h2>
          <div class="flex gap-2">
            <rs-button
              variant="secondary-outline"
              @click="handleBack"
            >
              <Icon name="ph:arrow-left" class="w-4 h-4 mr-1" />
              Kembali
            </rs-button>
          </div>
        </div>
      </template>

      <template #body>
        <div class="p-4">
          <!-- Application Status -->
          <div class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div class="flex justify-between items-center">
              <div>
                <h3 class="text-lg font-semibold text-blue-900">
                  Status Permohonan
                </h3>
                <p class="text-sm text-blue-600">
                  Rujukan: {{ application.rujukan }}
                </p>
              </div>
              <div class="flex gap-2">
                <rs-badge variant="success">
                  Diluluskan
                </rs-badge>
                <rs-badge variant="info">
                  Sedia untuk Akaun
                </rs-badge>
              </div>
            </div>
          </div>

          <!-- Candidate Information -->
          <div class="mb-6 p-6 border border-gray-200 rounded-lg">
            <h3 class="text-lg font-semibold mb-4 text-gray-900">
              Maklumat Calon Penolong Amil
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Nombor Kad Pengenalan
                </label>
                <p class="text-gray-900">{{ application.noKP }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Nama Penuh
                </label>
                <p class="text-gray-900">{{ application.nama }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Emel
                </label>
                <p class="text-gray-900">{{ application.emel }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Kategori Penolong Amil
                </label>
                <p class="text-gray-900">{{ application.kategoriPenolongAmil }}</p>
              </div>
            </div>
          </div>

          <!-- Account Creation Form -->
          <div class="mb-6 p-6 border border-gray-200 rounded-lg">
            <h3 class="text-lg font-semibold mb-4 text-gray-900">
              Cipta Akaun Login NAS
            </h3>
            
            <FormKit
              type="form"
              @submit="handleCreateAccount"
              :actions="false"
            >
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormKit
                  v-model="accountData.username"
                  type="text"
                  label="Username"
                  placeholder="Masukkan username"
                  :classes="{
                    input: '!py-2',
                  }"
                />
                
                <FormKit
                  v-model="accountData.email"
                  type="email"
                  label="Emel"
                  placeholder="Masukkan emel"
                  :classes="{
                    input: '!py-2',
                  }"
                />
                
                <FormKit
                  v-model="accountData.password"
                  type="password"
                  label="Kata Laluan"
                  placeholder="Masukkan kata laluan"
                  :classes="{
                    input: '!py-2',
                  }"
                />
                
                <FormKit
                  v-model="accountData.confirmPassword"
                  type="password"
                  label="Sahkan Kata Laluan"
                  placeholder="Masukkan semula kata laluan"
                  :classes="{
                    input: '!py-2',
                  }"
                />
              </div>

              <div class="mt-6">
                <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <div class="flex items-start">
                    <Icon name="ph:warning" class="text-yellow-600 mt-0.5 mr-2" size="20" />
                    <div>
                      <h4 class="text-sm font-medium text-yellow-800">
                        Maklumat Penting
                      </h4>
                      <p class="text-sm text-yellow-700 mt-1">
                        Akaun login akan dihantar melalui emel kepada calon. Pastikan emel yang dimasukkan adalah betul dan aktif.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex justify-end gap-3 mt-6">
                <rs-button
                  variant="secondary-outline"
                  @click="handleBack"
                >
                  Batal
                </rs-button>
                <rs-button
                  type="submit"
                  variant="primary"
                  :loading="isSubmitting"
                >
                  <Icon name="ph:user-plus" class="w-4 h-4 mr-1" />
                  Cipta Akaun
                </rs-button>
              </div>
            </FormKit>
          </div>

          <!-- Account Status -->
          <div class="mb-6 p-6 border border-gray-200 rounded-lg">
            <h3 class="text-lg font-semibold mb-4 text-gray-900">
              Status Akaun
            </h3>
            
            <div class="space-y-3">
              <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div class="flex items-center">
                  <Icon name="ph:clock" class="text-gray-500 mr-2" size="20" />
                  <span class="text-sm font-medium text-gray-700">Status Akaun</span>
                </div>
                <rs-badge variant="warning">Belum Dicipta</rs-badge>
              </div>
              
              <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div class="flex items-center">
                  <Icon name="ph:envelope" class="text-gray-500 mr-2" size="20" />
                  <span class="text-sm font-medium text-gray-700">Emel Notifikasi</span>
                </div>
                <rs-badge variant="secondary">Belum Dihantar</rs-badge>
              </div>
              
              <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div class="flex items-center">
                  <Icon name="ph:calendar" class="text-gray-500 mr-2" size="20" />
                  <span class="text-sm font-medium text-gray-700">Tarikh Ciptaan</span>
                </div>
                <span class="text-sm text-gray-500">-</span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Success Modal -->
    <rs-modal
      v-model="showSuccessModal"
      title="Akaun Berjaya Dicipta"
      size="md"
      position="center"
    >
      <template #body>
        <div class="text-center">
          <div class="flex justify-center mb-4">
            <Icon
              name="material-symbols:check-circle"
              class="text-green-500"
              size="48"
            />
          </div>
          <p class="mb-2">
            Akaun login NAS berjaya dicipta untuk calon.
          </p>
          <p class="text-gray-600">
            Maklumat login telah dihantar melalui emel kepada {{ application.nama }}.
          </p>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-center">
          <rs-button variant="primary" @click="handleModalClose">
            Teruskan ke Surat Tawaran
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const route = useRoute();

definePageMeta({
  title: "Cipta Akaun Login - NAS System",
  description: "Cipta akaun login untuk calon penolong amil",
});

const breadcrumb = ref([
  {
    name: "Penolong Amil",
    type: "link",
    path: "/BF-PA/PP/PM/01",
  },
  {
    name: "Pendaftaran",
    type: "link",
    path: "/BF-PA/PP/PM/01",
  },
  {
    name: "Pra Daftar",
    type: "link",
    path: "/BF-PA/PP/PD",
  },
  {
    name: "Cipta Akaun",
    type: "current",
    path: `/BF-PA/PP/PD/nas/cipta-akaun/${route.params.rujukan}`,
  },
]);

// Mock application data
const application = ref({
  rujukan: route.params.rujukan,
  noKP: "901231012345",
  nama: "Ahmad bin Abdullah",
  emel: "ahmad.abdullah@email.com",
  kategoriPenolongAmil: "Fitrah",
  statusPendaftaran: "Approved",
  statusLantikan: "Pending",
});

// Account creation form data
const accountData = ref({
  username: "",
  email: application.value.emel,
  password: "",
  confirmPassword: "",
});

const isSubmitting = ref(false);
const showSuccessModal = ref(false);

// Action handlers
const handleBack = () => {
  navigateTo("/BF-PA/PP/PD");
};

const handleCreateAccount = async () => {
  isSubmitting.value = true;
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  isSubmitting.value = false;
  showSuccessModal.value = true;
};

const handleModalClose = () => {
  showSuccessModal.value = false;
  // Navigate to offer letter generation
  navigateTo(`/BF-PA/PP/PD/nas/surat-tawaran/${route.params.rujukan}`);
};

onMounted(() => {
  // Pre-fill email from application data
  accountData.value.email = application.value.emel;
  // Generate username from name
  accountData.value.username = application.value.nama.toLowerCase().replace(/\s+/g, '.');
});
</script>

<style scoped>
/* Custom styles for NAS system */
</style> 