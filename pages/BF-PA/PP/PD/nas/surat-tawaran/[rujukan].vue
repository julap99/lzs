<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Jana Surat Tawaran dan Setuju Terima - NAS System
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
          <div class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div class="flex justify-between items-center">
              <div>
                <h3 class="text-lg font-semibold text-green-900">
                  Status Permohonan
                </h3>
                <p class="text-sm text-green-600">
                  Rujukan: {{ application.rujukan }}
                </p>
              </div>
              <div class="flex gap-2">
                <rs-badge variant="success">
                  Akaun Dicipta
                </rs-badge>
                <rs-badge variant="info">
                  Sedia untuk Surat Tawaran
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

          <!-- Offer Letter Generation -->
          <div class="mb-6 p-6 border border-gray-200 rounded-lg">
            <h3 class="text-lg font-semibold mb-4 text-gray-900">
              Jana Surat Tawaran
            </h3>
            
            <FormKit
              type="form"
              @submit="handleGenerateOfferLetter"
              :actions="false"
            >
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormKit
                  v-model="offerData.effectiveDate"
                  type="date"
                  label="Tarikh Berkuatkuasa"
                  :classes="{
                    input: '!py-2',
                  }"
                />
                
                <FormKit
                  v-model="offerData.expiryDate"
                  type="date"
                  label="Tarikh Tamat Tempoh"
                  :classes="{
                    input: '!py-2',
                  }"
                />
                
                <FormKit
                  v-model="offerData.position"
                  type="text"
                  label="Jawatan"
                  placeholder="Masukkan jawatan"
                  :classes="{
                    input: '!py-2',
                  }"
                />
                
                <FormKit
                  v-model="offerData.location"
                  type="text"
                  label="Lokasi Perkhidmatan"
                  placeholder="Masukkan lokasi"
                  :classes="{
                    input: '!py-2',
                  }"
                />
                
                <FormKit
                  v-model="offerData.terms"
                  type="textarea"
                  label="Terma dan Syarat"
                  placeholder="Masukkan terma dan syarat"
                  :classes="{
                    input: '!py-2',
                  }"
                />
                
                <FormKit
                  v-model="offerData.notes"
                  type="textarea"
                  label="Nota Tambahan"
                  placeholder="Masukkan nota tambahan (jika ada)"
                  :classes="{
                    input: '!py-2',
                  }"
                />
              </div>

              <div class="mt-6">
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <div class="flex items-start">
                    <Icon name="ph:info" class="text-blue-600 mt-0.5 mr-2" size="20" />
                    <div>
                      <h4 class="text-sm font-medium text-blue-800">
                        Maklumat Surat Tawaran
                      </h4>
                      <p class="text-sm text-blue-700 mt-1">
                        Surat tawaran akan dijana secara automatik dan dihantar melalui emel kepada calon. Calon perlu log masuk ke sistem NAS untuk menerima atau menolak tawaran.
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
                  <Icon name="ph:file-text" class="w-4 h-4 mr-1" />
                  Jana Surat Tawaran
                </rs-button>
              </div>
            </FormKit>
          </div>

          <!-- Document Status -->
          <div class="mb-6 p-6 border border-gray-200 rounded-lg">
            <h3 class="text-lg font-semibold mb-4 text-gray-900">
              Status Dokumen
            </h3>
            
            <div class="space-y-3">
              <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div class="flex items-center">
                  <Icon name="ph:file-text" class="text-gray-500 mr-2" size="20" />
                  <span class="text-sm font-medium text-gray-700">Surat Tawaran</span>
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
                  <Icon name="ph:user-check" class="text-gray-500 mr-2" size="20" />
                  <span class="text-sm font-medium text-gray-700">Status Terima</span>
                </div>
                <rs-badge variant="secondary">Menunggu Respons</rs-badge>
              </div>
            </div>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Success Modal -->
    <rs-modal
      v-model="showSuccessModal"
      title="Surat Tawaran Berjaya Dijana"
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
            Surat tawaran berjaya dijana dan dihantar kepada calon.
          </p>
          <p class="text-gray-600">
            Calon telah dihantar notifikasi melalui emel untuk log masuk ke sistem NAS dan menerima atau menolak tawaran.
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
  title: "Jana Surat Tawaran - NAS System",
  description: "Jana surat tawaran untuk calon penolong amil",
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
    name: "Surat Tawaran",
    type: "current",
    path: `/BF-PA/PP/PD/nas/surat-tawaran/${route.params.rujukan}`,
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
  statusLantikan: "Pending",
});

// Offer letter form data
const offerData = ref({
  effectiveDate: "",
  expiryDate: "",
  position: "Penolong Amil Fitrah",
  location: "Masjid Wilayah Persekutuan",
  terms: "Calon bersetuju untuk menjalankan tugas sebagai Penolong Amil mengikut garis panduan yang ditetapkan.",
  notes: "",
});

const isSubmitting = ref(false);
const showSuccessModal = ref(false);

// Action handlers
const handleBack = () => {
  navigateTo("/BF-PA/PP/PD");
};

const handleGenerateOfferLetter = async () => {
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
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, today.getDate());
  
  offerData.value.effectiveDate = today.toISOString().split('T')[0];
  offerData.value.expiryDate = nextMonth.toISOString().split('T')[0];
});
</script>

<style scoped>
/* Custom styles for NAS system */
</style> 