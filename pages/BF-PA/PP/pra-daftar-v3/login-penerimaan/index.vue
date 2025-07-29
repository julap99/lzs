<!-- 
  RTMF SCREEN: PA-PP-PD-09_01
  PURPOSE: First Login Acceptance - Skrin Terima Tawaran Pertama Kali Login
  DESCRIPTION: First-time login acceptance screen
  ROUTE: /BF-PA/PP/pra-daftar-v3/login-penerimaan
-->
<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Penerimaan Pelantikan Penolong Amil
          </h2>
        </div>
      </template>

      <template #body>
        <div class="p-4">
          <!-- Welcome Message -->
          <div class="mb-6 p-6 border border-green-200 rounded-lg bg-green-50">
            <div class="flex items-center mb-4">
              <Icon name="ph:check-circle" class="text-green-600 mr-3" size="24" />
              <h3 class="text-lg font-semibold text-green-900">
                Tahniah! Permohonan Anda Telah Diluluskan
              </h3>
            </div>
            <p class="text-green-800">
              Selamat datang ke sistem Penolong Amil. Sila lengkapkan maklumat profil anda dan terima pelantikan untuk memulakan perkhidmatan.
            </p>
          </div>

          <!-- Application Summary -->
          <div class="mb-6 p-6 border border-gray-200 rounded-lg">
            <h3 class="text-lg font-semibold mb-4 text-gray-900">
              Ringkasan Permohonan
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Nombor Rujukan
                </label>
                <p class="text-gray-900 font-semibold">{{ application.rujukan }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Nama Penuh
                </label>
                <p class="text-gray-900">{{ application.nama }}</p>
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
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Tarikh Kelulusan
                </label>
                <p class="text-gray-900">{{ application.approvalDate }}</p>
              </div>
            </div>
          </div>

          <!-- Acceptance Form -->
          <div class="mb-6 p-6 border border-blue-200 rounded-lg bg-blue-50">
            <h3 class="text-lg font-semibold mb-4 text-blue-900">
              Penerimaan Pelantikan
            </h3>
            
            <FormKit
              type="form"
              id="acceptanceForm"
              :actions="false"
              @submit="handleSubmit"
            >
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Acceptance Declaration -->
                <div class="md:col-span-2">
                  <FormKit
                    type="checkbox"
                    name="acceptDeclaration"
                    label="Saya mengesahkan bahawa saya menerima pelantikan sebagai Penolong Amil dan bersetuju untuk mematuhi semua peraturan dan prosedur yang ditetapkan."
                    validation="required"
                    :validation-messages="{
                      required: 'Anda mesti menerima pengisytiharan ini',
                    }"
                    v-model="formData.acceptDeclaration"
                  />
                </div>

                <!-- Terms and Conditions -->
                <div class="md:col-span-2">
                  <FormKit
                    type="checkbox"
                    name="acceptTerms"
                    label="Saya telah membaca dan bersetuju dengan Terma dan Syarat perkhidmatan Penolong Amil."
                    validation="required"
                    :validation-messages="{
                      required: 'Anda mesti bersetuju dengan terma dan syarat',
                    }"
                    v-model="formData.acceptTerms"
                  />
                </div>

                <!-- Privacy Policy -->
                <div class="md:col-span-2">
                  <FormKit
                    type="checkbox"
                    name="acceptPrivacy"
                    label="Saya bersetuju dengan Dasar Privasi dan pemprosesan data peribadi saya."
                    validation="required"
                    :validation-messages="{
                      required: 'Anda mesti bersetuju dengan dasar privasi',
                    }"
                    v-model="formData.acceptPrivacy"
                  />
                </div>

                <!-- Additional Comments -->
                <div class="md:col-span-2">
                  <FormKit
                    type="textarea"
                    name="additionalComments"
                    label="Ulasan Tambahan (Opsional)"
                    placeholder="Sila berikan sebarang ulasan atau maklumat tambahan..."
                    v-model="formData.additionalComments"
                    :classes="{
                      input: 'min-h-[100px]',
                    }"
                  />
                </div>
              </div>

              <!-- Submit Buttons -->
              <div class="flex justify-end gap-4 mt-6">
                <rs-button
                  type="button"
                  variant="primary"
                  @click="handleSubmitDirect"
                  :disabled="isSubmitting"
                >
                  <Icon
                    v-if="isSubmitting"
                    name="ph:spinner"
                    class="w-4 h-4 mr-2 animate-spin"
                  />
                  {{ isSubmitting ? 'Menghantar...' : 'Terima Pelantikan' }}
                </rs-button>
              </div>
            </FormKit>
          </div>

          <!-- Next Steps Information -->
          <div class="mb-6 p-6 border border-yellow-200 rounded-lg bg-yellow-50">
            <h3 class="text-lg font-semibold mb-4 text-yellow-900">
              Langkah Seterusnya
            </h3>
            
            <div class="space-y-3">
              <div class="flex items-start">
                <Icon name="ph:number-circle-one" class="text-yellow-600 mr-3 mt-1" size="20" />
                <div>
                  <p class="text-yellow-900 font-medium">Terima Pelantikan</p>
                  <p class="text-yellow-800 text-sm">Klik butang "Terima Pelantikan" di atas untuk mengesahkan penerimaan anda.</p>
                </div>
              </div>
              
              <div class="flex items-start">
                <Icon name="ph:number-circle-two" class="text-yellow-600 mr-3 mt-1" size="20" />
                <div>
                  <p class="text-yellow-900 font-medium">Lengkapkan Profil</p>
                  <p class="text-yellow-800 text-sm">Anda akan diarahkan ke halaman untuk melengkapkan maklumat profil anda.</p>
                </div>
              </div>
              
              <div class="flex items-start">
                <Icon name="ph:number-circle-three" class="text-yellow-600 mr-3 mt-1" size="20" />
                <div>
                  <p class="text-yellow-900 font-medium">Mulakan Perkhidmatan</p>
                  <p class="text-yellow-800 text-sm">Setelah profil dilengkapkan, anda boleh mula menggunakan sistem Penolong Amil.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

definePageMeta({
  title: "Penerimaan Pelantikan Penolong Amil",
  description: "Halaman penerimaan pelantikan untuk calon yang diluluskan",
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
    name: "Pra Daftar V3",
    type: "link",
    path: "/BF-PA/PP/pra-daftar-v3",
  },
  {
    name: "Penerimaan Pelantikan",
    type: "current",
    path: "/BF-PA/PP/pra-daftar-v3/login-penerimaan",
  },
]);

// Form Data
const formData = ref({
  acceptDeclaration: false,
  acceptTerms: false,
  acceptPrivacy: false,
  additionalComments: "",
});

const isSubmitting = ref(false);

// Mock application data based on RTMF requirements
const application = ref({
  rujukan: "PA-2024-001",
  nama: "Ahmad bin Abdullah",
  kategoriPenolongAmil: "Fitrah",
  institusiKariah: "Masjid Wilayah Persekutuan",
  sesiPerkhidmatan: "Sesi 1",
  approvalDate: "05/04/2024",
  status: "Approved",
  timeline: [
    {
      action: "Permohonan Dihantar",
      date: "15/03/2024 10:30 AM",
      notes: "Permohonan berjaya dihantar untuk semakan"
    },
    {
      action: "Semakan PT",
      date: "20/03/2024 14:30 PM",
      notes: "Calon lulus semakan PT"
    },
    {
      action: "Sokongan Eksekutif",
      date: "25/03/2024 11:30 AM",
      notes: "Calon disokong oleh eksekutif"
    },
    {
      action: "Pengesahan Ketua Jabatan",
      date: "30/03/2024 15:45 PM",
      notes: "Calon disahkan oleh ketua jabatan"
    },
    {
      action: "Kelulusan Ketua Divisyen",
      date: "05/04/2024 10:00 AM",
      notes: "Calon diluluskan oleh ketua divisyen"
    }
  ]
});

// Action handlers
const handleSubmit = async (formData) => {
  // Form submission handler
};

const handleSubmitDirect = async () => {
  try {
    isSubmitting.value = true;
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Show success message
    // Appointment acceptance submitted successfully
    
    // Navigate to profile update page
    navigateTo(`/BF-PA/PP/pra-daftar-v3/login-penerimaan/profile/${application.value.rujukan}`);
    
  } catch (error) {
    alert("Ralat berlaku semasa menerima pelantikan. Sila cuba lagi.");
  } finally {
    isSubmitting.value = false;
  }
};



onMounted(() => {
  // In real implementation, fetch application data based on user session or token
      // Loading approved application for first login
});
</script>

<style scoped>
/* Custom styles for RTMF compliance */
</style> 
