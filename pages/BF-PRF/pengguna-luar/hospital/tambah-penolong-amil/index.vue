<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Borang Pendaftaran Calon Penolong Amil - Hospital
          </h2>
        </div>
      </template>

      <template #body>
        <div class="p-4">
          <!-- Institution Information -->
          <div class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div class="flex">
              <Icon name="ph:buildings" class="w-5 h-5 text-blue-400 mt-0.5" />
              <div class="ml-3">
                <h3 class="text-sm font-medium text-blue-800">
                  Maklumat Institusi Hospital
                </h3>
                <p class="mt-1 text-sm text-blue-700">
                  <strong>{{ hospitalInstitution.name }}</strong>
                </p>
                <p class="mt-1 text-sm text-blue-600">
                  PIC: {{ hospitalInstitution.pic }} ({{ hospitalInstitution.picEmail }})
                </p>
                <p class="mt-1 text-sm text-blue-600">
                  Lokasi: {{ hospitalInstitution.location }}
                </p>
              </div>
            </div>
          </div>

          <!-- Candidate Registration Form -->
          <FormKit
            type="form"
            id="candidateForm"
            :actions="false"
            @submit="handleAddCandidate"
          >
            <!-- Maklumat Calon Section -->
            <div class="mb-8 p-6 border border-gray-200 rounded-lg">
              <h3 class="text-lg font-semibold mb-4 text-gray-900">
                Maklumat Calon
              </h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Jenis Pengenalan (Hidden/Default) -->
                <FormKit
                  type="text"
                  name="jenisPengenalan"
                  label="Jenis Pengenalan"
                  value="MyKad"
                  disabled
                  help="Default: MyKad untuk semua calon"
                />

                <!-- No Kad Pengenalan -->
                <FormKit
                  type="text"
                  name="noKP"
                  label="Nombor Kad Pengenalan"
                  placeholder="Contoh: 901231012345"
                  help="Masukkan nombor kad pengenalan 12 digit tanpa dash"
                  validation="required|length:12|number"
                  validation-label="Nombor Kad Pengenalan"
                  :validation-messages="{
                    required: 'Nombor kad pengenalan adalah wajib',
                    length: 'Sila masukkan nombor kad pengenalan 12 digit tanpa dash',
                    number: 'Hanya nombor dibenarkan'
                  }"
                  v-model="editingCandidate.noKP"
                />

                <!-- Nama Calon -->
                <FormKit
                  type="text"
                  name="namaCalon"
                  label="Nama"
                  placeholder="Masukkan nama penuh"
                  validation="required"
                  v-model="editingCandidate.namaCalon"
                />

                <!-- Emel -->
                <FormKit
                  type="email"
                  name="emel"
                  label="Emel"
                  placeholder="contoh@email.com"
                  validation="required|email"
                  :validation-messages="{
                    required: 'Emel adalah wajib',
                    email: 'Sila masukkan emel yang sah'
                  }"
                  v-model="editingCandidate.emel"
                />

                <!-- No Telefon -->
                <FormKit
                  type="tel"
                  name="telefon"
                  label="No Telefon"
                  placeholder="0123456789"
                  validation="required|number"
                  :validation-messages="{
                    required: 'Nombor telefon adalah wajib',
                    number: 'Hanya nombor dibenarkan'
                  }"
                  v-model="editingCandidate.telefon"
                />

                <!-- Kategori Penolong Amil (PAK+ only for Hospital) -->
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Kategori Penolong Amil * (Hospital: PAK+ sahaja)
                  </label>
                  
                  <div class="relative" v-click-outside="closeKategoriDropdown">
                    <button
                      type="button"
                      @click="toggleKategoriDropdown"
                      class="w-full px-3 py-2 text-left border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      :class="{
                        'border-blue-500 ring-2 ring-blue-500': showKategoriDropdown
                      }"
                    >
                      <span v-if="editingCandidate.kategoriPenolongAmil.length === 0" class="text-gray-500">
                        Pilih kategori penolong amil
                      </span>
                      <span v-else class="text-gray-900">
                        {{ editingCandidate.kategoriPenolongAmil.length }} kategori dipilih
                      </span>
                      <Icon 
                        name="ph:caret-down" 
                        class="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                        :class="{ 'rotate-180': showKategoriDropdown }"
                      />
                    </button>
                    
                    <!-- Dropdown Menu -->
                    <div 
                      v-if="showKategoriDropdown"
                      class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
                    >
                      <div class="p-2">
                        <div class="mb-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Pilih Kategori ({{ editingCandidate.kategoriPenolongAmil.length }} dipilih)
                        </div>
                        
                        <div class="space-y-1">
                          <label 
                            v-for="option in kategoriPenolongAmilOptions" 
                            :key="option.value"
                            class="flex items-center px-3 py-2 rounded-md hover:bg-gray-100 cursor-pointer"
                            :class="{ 'bg-blue-50': editingCandidate.kategoriPenolongAmil.includes(option.value) }"
                          >
                            <input 
                              type="checkbox"
                              :value="option.value"
                              v-model="editingCandidate.kategoriPenolongAmil"
                              :disabled="option.disabled"
                              class="mr-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span 
                              class="text-sm"
                              :class="{ 'text-gray-400': option.disabled, 'text-gray-900': !option.disabled }"
                            >
                              {{ option.label }}
                            </span>
                            <span v-if="option.disabled" class="ml-2 text-xs text-gray-400">
                              (Tidak tersedia untuk hospital)
                            </span>
                          </label>
                        </div>
                        
                        <!-- Clear Selection Button -->
                        <div v-if="editingCandidate.kategoriPenolongAmil.length > 0" class="mt-3 pt-2 border-t border-gray-200">
                          <button
                            type="button"
                            @click="clearKategoriSelection"
                            class="text-xs text-red-600 hover:text-red-800"
                          >
                            Kosongkan Pilihan
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Help Text -->
                  <p class="mt-1 text-xs text-gray-500">
                    Hospital boleh memilih PAK+ (Penolong Amil Komuniti) sahaja
                  </p>
                  
                  <!-- Validation Error -->
                  <p v-if="kategoriValidationError" class="mt-1 text-xs text-red-600">
                    {{ kategoriValidationError }}
                  </p>
                </div>

                <!-- Salinan Kad Pengenalan -->
                <div class="md:col-span-2">
                  <FormKit
                    type="file"
                    name="salinanKadPengenalan"
                    label="Salinan Kad Pengenalan"
                    accept=".pdf,.jpg,.jpeg,.png"
                    help="Format: PDF, JPG, JPEG, PNG. Saiz maksimum: 5MB"
                    validation="required"
                    v-model="editingCandidate.salinanKadPengenalan"
                  />
                </div>
              </div>
            </div>

            <!-- Add Candidate Button -->
            <div class="flex justify-end gap-4 mb-8">
              <rs-button
                type="button"
                variant="secondary-outline"
                @click="clearForm"
              >
                Kosongkan Borang
              </rs-button>
              <rs-button
                type="button"
                variant="primary"
                @click="handleAddCandidate"
                :disabled="!isCandidateValid || isAdding"
              >
                <Icon v-if="isAdding" name="ph:spinner" class="w-4 h-4 mr-2 animate-spin" />
                {{ isAdding ? 'Menambah...' : 'Tambah Calon' }}
              </rs-button>
            </div>
          </FormKit>

          <!-- Candidates List Section -->
          <div v-if="candidates.length > 0" class="mb-8 p-6 border border-gray-200 rounded-lg">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900">
                Senarai Calon Ditambah
              </h3>
              <div class="flex items-center space-x-3">
                <span class="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full">
                  {{ candidates.length }} {{ candidates.length === 1 ? 'Calon' : 'Calon' }}
                </span>
              </div>
            </div>

            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nama
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      No KP
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kategori
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr 
                    v-for="(candidate, index) in candidates" 
                    :key="candidate.id"
                  >
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ candidate.namaCalon }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ candidate.noKP }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ candidate.kategoriPenolongAmil.join(', ') }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <rs-badge variant="success" size="sm">
                        Layak
                      </rs-badge>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Submit Button -->
          <div v-if="candidates.length > 0" class="flex justify-end mt-6">
            <rs-button
              variant="primary"
              @click="handleSubmit"
              :disabled="!canSubmit || isSubmitting"
            >
              <Icon v-if="isSubmitting" name="ph:spinner" class="w-4 h-4 mr-2 animate-spin" />
              {{ isSubmitting ? 'Menghantar...' : 'Hantar' }}
            </rs-button>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Success Modal -->
    <rs-modal
      v-model="showSuccessModal"
      title="Pendaftaran Berjaya"
      size="md"
      position="center"
    >
      <template #body>
        <div class="text-center py-4">
          <div class="flex justify-center mb-4">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <Icon name="ph:check-circle" class="text-green-600" size="32" />
            </div>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">
            Maklumat pendaftaran calon telah disimpan
          </h3>
          <p class="text-gray-600 mb-4">
            {{ candidates.length }} calon telah berjaya didaftarkan dan dihantar untuk proses saringan.
          </p>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-center space-x-3">
          <rs-button
            variant="primary-outline"
            @click="showSuccessModal = false"
          >
            Tutup
          </rs-button>
          <rs-button variant="primary" @click="handleModalClose">
            Kembali ke Dashboard
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

// Click outside directive
const vClickOutside = {
  mounted(el, binding) {
    el._clickOutside = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event);
      }
    };
    document.addEventListener('click', el._clickOutside);
  },
  unmounted(el) {
    document.removeEventListener('click', el._clickOutside);
  }
};

definePageMeta({
  title: "Tambah Penolong Amil - Hospital",
  description: "Borang pendaftaran calon penolong amil untuk hospital",
});

// Hospital institution data
const hospitalInstitution = ref({
  id: "HOSPITAL_SELANGOR_001",
  name: "Hospital Selangor",
  type: "hospital",
  location: "Klang, Selangor",
  pic: "Dr. Siti Fatimah binti Hassan",
  picEmail: "siti.fatimah@hospitalselangor.gov.my",
});

// Kategori Penolong Amil Options (Hospital: PAK+ only)
const kategoriPenolongAmilOptions = ref([
  { label: "PAK (Penolong Amil Kariah)", value: "PAK", disabled: true },
  { label: "PAF (Penolong Amil Fitrah)", value: "PAF", disabled: true },
  { label: "PAP (Penolong Amil Padi)", value: "PAP", disabled: true },
  { label: "PAK+ (Penolong Amil Komuniti)", value: "PAK+", disabled: false },
]);

// Editing candidate data
const editingCandidate = ref({
  jenisPengenalan: "MyKad",
  noKP: "",
  namaCalon: "",
  emel: "",
  telefon: "",
  kategoriPenolongAmil: [],
  salinanKadPengenalan: null,
});

// Candidates list
const candidates = ref([]);

// Loading states
const isAdding = ref(false);
const isSubmitting = ref(false);

// Modal states
const showSuccessModal = ref(false);

// Multi-select dropdown logic
const showKategoriDropdown = ref(false);
const kategoriValidationError = ref(null);

// Computed properties
const isCandidateValid = computed(() => {
  return editingCandidate.value.noKP &&
         editingCandidate.value.namaCalon &&
         editingCandidate.value.emel &&
         editingCandidate.value.telefon &&
         editingCandidate.value.kategoriPenolongAmil.length > 0;
});

const canSubmit = computed(() => {
  return candidates.value.length > 0;
});

// Breadcrumb items
const breadcrumb = ref([
  {
    name: "Pengguna Luar",
    type: "link",
    path: "/BF-PRF/pengguna-luar/dashboard",
  },
  {
    name: "Hospital",
    type: "link",
    path: "/BF-PRF/pengguna-luar/hospital",
  },
  {
    name: "Tambah Penolong Amil",
    type: "current",
    path: "/BF-PRF/pengguna-luar/hospital/tambah-penolong-amil",
  },
]);

// Add candidate to list
const handleAddCandidate = async () => {
  if (!isCandidateValid.value) {
    alert("Sila lengkapkan semua maklumat calon");
    return;
  }

  try {
    isAdding.value = true;
    
    const newCandidate = {
      ...editingCandidate.value,
      id: Date.now(),
    };

    candidates.value.push(newCandidate);
    clearForm();
    alert("Calon berjaya ditambah ke senarai");
    
  } catch (error) {
    alert("Ralat berlaku semasa menambah calon");
  } finally {
    isAdding.value = false;
  }
};

// Clear form
const clearForm = () => {
  editingCandidate.value = {
    jenisPengenalan: "MyKad",
    noKP: "",
    namaCalon: "",
    emel: "",
    telefon: "",
    kategoriPenolongAmil: [],
    salinanKadPengenalan: null,
  };
};

// Handle submit
const handleSubmit = () => {
  if (!canSubmit.value) {
    alert("Sila tambah sekurang-kurangnya satu calon");
    return;
  }
  
  showSuccessModal.value = true;
};

// Handle modal close
const handleModalClose = () => {
  showSuccessModal.value = false;
  navigateTo("/BF-PRF/pengguna-luar/dashboard");
};

// Multi-select dropdown functions
const toggleKategoriDropdown = () => {
  showKategoriDropdown.value = !showKategoriDropdown.value;
  kategoriValidationError.value = null;
};

const clearKategoriSelection = () => {
  editingCandidate.value.kategoriPenolongAmil = [];
  kategoriValidationError.value = null;
};

const closeKategoriDropdown = () => {
  showKategoriDropdown.value = false;
};
</script>

<style scoped>
/* Custom styles */
</style>
