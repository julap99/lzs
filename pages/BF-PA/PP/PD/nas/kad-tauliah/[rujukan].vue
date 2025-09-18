<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Jana Kad Tauliah - NAS System
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
          <div class="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <div class="flex justify-between items-center">
              <div>
                <h3 class="text-lg font-semibold text-purple-900">
                  Status Permohonan
                </h3>
                <p class="text-sm text-purple-600">
                  Rujukan: {{ application.rujukan }}
                </p>
              </div>
              <div class="flex gap-2">
                <rs-badge variant="success">
                  Tawaran Diterima
                </rs-badge>
                <rs-badge variant="info">
                  Sedia untuk Kad Tauliah
                </rs-badge>
              </div>
            </div>
          </div>

          <!-- Candidate Information -->
          <div class="mb-6 p-6 border border-gray-200 rounded-lg">
            <h3 class="text-lg font-semibold mb-4 text-gray-900">
              Maklumat Penolong Amil
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
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Institusi/Kariah
                </label>
                <p class="text-gray-900">{{ application.institusiKariah }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Sesi Perkhidmatan
                </label>
                <p class="text-gray-900">{{ application.sesiPerkhidmatan }}</p>
              </div>
            </div>
          </div>

          <!-- Card Generation Form -->
          <div class="mb-6 p-6 border border-gray-200 rounded-lg">
            <h3 class="text-lg font-semibold mb-4 text-gray-900">
              Jana Kad Tauliah
            </h3>
            
            <FormKit
              type="form"
              @submit="handleGenerateCard"
              :actions="false"
            >
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormKit
                  v-model="cardData.cardNumber"
                  type="text"
                  label="Nombor Kad Tauliah"
                  placeholder="Masukkan nombor kad tauliah"
                  :classes="{
                    input: '!py-2',
                  }"
                />
                
                <FormKit
                  v-model="cardData.issueDate"
                  type="date"
                  label="Tarikh Terbit"
                  :classes="{
                    input: '!py-2',
                  }"
                />
                
                <FormKit
                  v-model="cardData.expiryDate"
                  type="date"
                  label="Tarikh Tamat Tempoh"
                  :classes="{
                    input: '!py-2',
                  }"
                />
                
                <FormKit
                  v-model="cardData.authority"
                  type="text"
                  label="Pihak Berkuasa"
                  placeholder="Masukkan pihak berkuasa"
                  :classes="{
                    input: '!py-2',
                  }"
                />
                
                <FormKit
                  v-model="cardData.photo"
                  type="file"
                  label="Gambar Kad Tauliah"
                  accept="image/*"
                  :classes="{
                    input: '!py-2',
                  }"
                />
                
                <FormKit
                  v-model="cardData.signature"
                  type="file"
                  label="Tandatangan Digital"
                  accept="image/*"
                  :classes="{
                    input: '!py-2',
                  }"
                />
              </div>

              <div class="mt-6">
                <div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <div class="flex items-start">
                    <Icon name="ph:check-circle" class="text-green-600 mt-0.5 mr-2" size="20" />
                    <div>
                      <h4 class="text-sm font-medium text-green-800">
                        Maklumat Kad Tauliah
                      </h4>
                      <p class="text-sm text-green-700 mt-1">
                        Kad tauliah akan dijana secara automatik dengan maklumat calon yang telah disahkan. Kad ini akan dihantar melalui emel dan boleh dicetak oleh penolong amil.
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
                  <Icon name="ph:id-card" class="w-4 h-4 mr-1" />
                  Jana Kad Tauliah
                </rs-button>
              </div>
            </FormKit>
          </div>

          <!-- Card Preview -->
          <div class="mb-6 p-6 border border-gray-200 rounded-lg">
            <h3 class="text-lg font-semibold mb-4 text-gray-900">
              Preview Kad Tauliah
            </h3>
            
            <div class="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
              <div class="text-center mb-4">
                <h4 class="text-lg font-bold">KAD TAULIAH</h4>
                <p class="text-sm opacity-90">PENOLONG AMIL</p>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p class="text-xs opacity-75">Nama</p>
                  <p class="font-semibold">{{ application.nama }}</p>
                </div>
                
                <div>
                  <p class="text-xs opacity-75">No. KP</p>
                  <p class="font-semibold">{{ application.noKP }}</p>
                </div>
                
                <div>
                  <p class="text-xs opacity-75">Kategori</p>
                  <p class="font-semibold">{{ application.kategoriPenolongAmil }}</p>
                </div>
                
                <div>
                  <p class="text-xs opacity-75">Institusi</p>
                  <p class="font-semibold">{{ application.institusiKariah }}</p>
                </div>
                
                <div>
                  <p class="text-xs opacity-75">No. Kad Tauliah</p>
                  <p class="font-semibold">{{ cardData.cardNumber || 'PA-2024-001' }}</p>
                </div>
                
                <div>
                  <p class="text-xs opacity-75">Tempoh Sah</p>
                  <p class="font-semibold">{{ cardData.issueDate || '01-01-2024' }} - {{ cardData.expiryDate || '31-12-2024' }}</p>
                </div>
              </div>
              
              <div class="mt-4 text-center">
                <p class="text-xs opacity-75">Dikeluarkan oleh: {{ cardData.authority || 'Lembaga Zakat Selangor' }}</p>
              </div>
            </div>
          </div>

          <!-- Document Status -->
          <div class="mb-6 p-6 border border-gray-200 rounded-lg">
            <h3 class="text-lg font-semibold mb-4 text-gray-900">
              Status Dokumen
            </h3>
            
            <div class="space-y-3">
              <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div class="flex items-center">
                  <Icon name="ph:id-card" class="text-gray-500 mr-2" size="20" />
                  <span class="text-sm font-medium text-gray-700">Kad Tauliah</span>
                </div>
                <rs-badge variant="warning">Belum Dijana</rs-badge>
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
                  <Icon name="ph:printer" class="text-gray-500 mr-2" size="20" />
                  <span class="text-sm font-medium text-gray-700">Status Cetak</span>
                </div>
                <rs-badge variant="secondary">Belum Dicetak</rs-badge>
              </div>
            </div>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Success Modal -->
    <rs-modal
      v-model="showSuccessModal"
      title="Kad Tauliah Berjaya Dijana"
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
            Kad tauliah berjaya dijana untuk penolong amil.
          </p>
          <p class="text-gray-600">
            Kad tauliah telah dihantar melalui emel kepada {{ application.nama }} dan boleh dicetak untuk kegunaan rasmi.
          </p>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-center">
          <rs-button variant="primary" @click="handleModalClose">
            Selesai
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
  title: "Jana Kad Tauliah - NAS System",
  description: "Jana kad tauliah untuk penolong amil",
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
    name: "Kad Tauliah",
    type: "current",
    path: `/BF-PA/PP/PD/nas/kad-tauliah/${route.params.rujukan}`,
  },
]);

// Mock application data
const application = ref({
  rujukan: route.params.rujukan,
  noKP: "901231012345",
  nama: "Ahmad bin Abdullah",
  emel: "ahmad.abdullah@email.com",
  kategoriPenolongAmil: "Fitrah",
  institusiKariah: "Masjid Wilayah Persekutuan",
  sesiPerkhidmatan: "Sesi 1",
  statusPendaftaran: "Approved",
  statusLantikan: "Active",
});

// Card generation form data
const cardData = ref({
  cardNumber: "",
  issueDate: "",
  expiryDate: "",
  authority: "Lembaga Zakat Selangor",
  photo: null,
  signature: null,
});

const isSubmitting = ref(false);
const showSuccessModal = ref(false);

// Action handlers
const handleBack = () => {
  navigateTo("/BF-PA/PP/PD");
};

const handleGenerateCard = async () => {
  isSubmitting.value = true;
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  isSubmitting.value = false;
  showSuccessModal.value = true;
};

const handleModalClose = () => {
  showSuccessModal.value = false;
  navigateTo("/BF-PA/PP/PD");
};

onMounted(() => {
  // Set default dates
  const today = new Date();
  const nextYear = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());
  
  cardData.value.issueDate = today.toISOString().split('T')[0];
  cardData.value.expiryDate = nextYear.toISOString().split('T')[0];
  
  // Generate card number
  cardData.value.cardNumber = `PA-${today.getFullYear()}-${application.value.rujukan.split('-')[2]}`;
});
</script>

<style scoped>
/* Custom styles for NAS system */
</style> 