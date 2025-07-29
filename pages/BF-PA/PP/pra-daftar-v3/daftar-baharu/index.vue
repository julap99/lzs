<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Borang Pendaftaran Calon Penolong Amil
          </h2>
          <div class="flex gap-2">
            <rs-button
              variant="secondary-outline"
              @click="handleImportExcel"
            >
              <Icon name="ph:download" class="w-4 h-4 mr-1" />
              Import dari Fail
            </rs-button>
          </div>
        </div>
      </template>

      <template #body>
        <div class="p-4">
          <!-- Institution Information -->
          <div class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div class="flex">
              <Icon name="ph:building" class="w-5 h-5 text-green-400 mt-0.5" />
              <div class="ml-3">
                <h3 class="text-sm font-medium text-green-800">
                  Maklumat Institusi PYB
                </h3>
                <p class="mt-1 text-sm text-green-700">
                  <strong>{{ currentInstitution.name }}</strong> - {{ currentInstitution.location }}
                </p>
                <p class="mt-1 text-sm text-green-600">
                  PIC: {{ currentInstitution.pic }} ({{ currentInstitution.picEmail }})
                </p>
              </div>
            </div>
          </div>

          <!-- Information Section -->
          <div class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div class="flex">
              <Icon name="ph:info" class="w-5 h-5 text-blue-400 mt-0.5" />
              <div class="ml-3">
                <h3 class="text-sm font-medium text-blue-800">
                  Maklumat Pendaftaran Calon
                </h3>
                <p class="mt-1 text-sm text-blue-700">
                  Sila isi maklumat calon penolong amil di bawah. Anda boleh menambah berbilang calon atau import dari fail Excel.
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

                <!-- No Kad Pengenalan (RTMF Required) -->
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

                <!-- Kategori Penolong Amil (Checkbox) -->
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Kategori Penolong Amil *
                  </label>
                  <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <label class="flex items-center">
                      <input 
                        type="checkbox" 
                        value="PAK"
                        v-model="editingCandidate.kategoriPenolongAmil"
                        class="mr-2"
                        :disabled="!canSelectCategory('PAK')"
                      />
                      <span class="text-sm">PAK (Penolong Amil Kariah)</span>
                    </label>
                    <label class="flex items-center">
                      <input 
                        type="checkbox" 
                        value="PAF"
                        v-model="editingCandidate.kategoriPenolongAmil"
                        class="mr-2"
                        :disabled="!canSelectCategory('PAF')"
                      />
                      <span class="text-sm">PAF (Penolong Amil Fitrah)</span>
                    </label>
                    <label class="flex items-center">
                      <input 
                        type="checkbox" 
                        value="PA Padi"
                        v-model="editingCandidate.kategoriPenolongAmil"
                        class="mr-2"
                        :disabled="!canSelectCategory('PA Padi')"
                      />
                      <span class="text-sm">PA Padi</span>
                    </label>
                    <label class="flex items-center">
                      <input 
                        type="checkbox" 
                        value="PAK+"
                        v-model="editingCandidate.kategoriPenolongAmil"
                        class="mr-2"
                        :disabled="!canSelectCategory('PAK+')"
                      />
                      <span class="text-sm">PAK+ (Penolong Amil Komuniti)</span>
                    </label>
                  </div>
                </div>

                <!-- Jawatan -->
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Jawatan *
                  </label>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label class="flex items-center">
                      <input 
                        type="checkbox" 
                        value="Penolong Amil"
                        v-model="editingCandidate.jawatan"
                        class="mr-2"
                      />
                      <span class="text-sm">Penolong Amil</span>
                    </label>
                    <label class="flex items-center">
                      <input 
                        type="checkbox" 
                        value="Ketua Penolong Amil"
                        v-model="editingCandidate.jawatan"
                        class="mr-2"
                      />
                      <span class="text-sm">Ketua Penolong Amil</span>
                    </label>
                  </div>
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

            <!-- Add Candidate Button - Moved here right after Maklumat Calon -->
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

          <!-- Maklumat Pencalonan Section - Shared for all candidates -->
          <div class="mb-8 p-6 border border-gray-200 rounded-lg">
            <h3 class="text-lg font-semibold mb-4 text-gray-900">
              Maklumat Pencalonan (Berkongsi untuk Semua Calon)
            </h3>
            <p class="text-sm text-gray-600 mb-4">
              Maklumat ini akan digunakan untuk semua calon dari {{ currentInstitution.name }}
            </p>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- ID Institusi (Hidden) -->
              <FormKit
                type="text"
                name="idInstitusi"
                label="ID Institusi"
                :value="currentInstitution.id"
                disabled
                help="Diisi automatik berdasarkan institusi pengguna"
              />

              <!-- Sesi Perkhidmatan -->
              <FormKit
                type="select"
                name="sesiPerkhidmatan"
                label="Sesi Perkhidmatan"
                :options="sesiPerkhidmatanOptions"
                validation="required"
                v-model="sharedPencalonanData.sesiPerkhidmatan"
              />

              <!-- Tarikh Pendaftaran (Hidden) -->
              <FormKit
                type="text"
                name="tarikhPendaftaran"
                label="Tarikh Pendaftaran"
                :value="currentDate"
                disabled
                help="Diisi automatik dengan tarikh semasa"
              />
            </div>
          </div>

          <!-- Supporting Documents Section - Moved to end as requested -->
          <div v-if="candidates.length > 0" class="mb-8 p-6 border border-gray-200 rounded-lg">
            <h3 class="text-lg font-semibold mb-4 text-gray-900">
              Dokumen Sokongan
            </h3>
            <p class="text-sm text-gray-600 mb-4">
              Dokumen sokongan untuk semua calon yang telah ditambah
            </p>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Surat Sokongan / Minit Mesyuarat -->
              <div class="md:col-span-2">
                <FormKit
                  type="file"
                  name="suratSokongan"
                  label="Surat Sokongan / Minit Mesyuarat"
                  accept=".pdf,.jpg,.jpeg,.png"
                  help="Format: PDF, JPG, JPEG, PNG. Saiz maksimum: 5MB"
                  validation="required"
                  v-model="supportingDocuments.suratSokongan"
                />
              </div>
            </div>
          </div>

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
                <div class="flex items-center space-x-2">
                  <div class="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      class="bg-green-500 h-2 rounded-full transition-all duration-300"
                      :style="{ width: `${progressPercentage}%` }"
                    ></div>
                  </div>
                  <span class="text-sm text-gray-600">{{ progressPercentage }}%</span>
                </div>
              </div>
            </div>

            <!-- Advanced Filtering -->
            <div class="mb-6 p-4 bg-gray-50 rounded-lg">
              <h4 class="text-sm font-medium text-gray-700 mb-3">Penapis Lanjutan</h4>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormKit
                  v-model="candidateFilters.searchQuery"
                  type="text"
                  placeholder="Cari nama, no KP..."
                  :classes="{ input: '!py-2' }"
                />
                <FormKit
                  v-model="candidateFilters.kategori"
                  type="select"
                  :options="[
                    { label: 'Semua Kategori', value: '' },
                    { label: 'PAK', value: 'PAK' },
                    { label: 'PAF', value: 'PAF' },
                    { label: 'PA Padi', value: 'PA Padi' },
                    { label: 'PAK+', value: 'PAK+' }
                  ]"
                  placeholder="Kategori"
                  :classes="{ input: '!py-2' }"
                />
                <FormKit
                  v-model="candidateFilters.status"
                  type="select"
                  :options="[
                    { label: 'Semua Status', value: '' },
                    { label: 'Layak', value: 'layak' },
                    { label: 'Penolong Amil Aktif', value: 'active' }
                  ]"
                  placeholder="Status"
                  :classes="{ input: '!py-2' }"
                />
              </div>
            </div>

            <!-- Bulk Operations -->
            <div class="mb-4 flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <label class="flex items-center">
                  <input 
                    type="checkbox" 
                    v-model="selectAll"
                    @change="toggleSelectAll"
                    class="mr-2"
                  />
                  <span class="text-sm font-medium">Pilih Semua</span>
                </label>
                <span class="text-sm text-gray-600">
                  {{ selectedCandidates.length }} dipilih
                </span>
              </div>
              <div class="flex space-x-2">
                <rs-button
                  variant="danger"
                  size="sm"
                  @click="removeSelectedCandidates"
                  :disabled="selectedCandidates.length === 0"
                >
                  <Icon name="ph:trash" class="w-4 h-4 mr-1" />
                  Hapus Dipilih
                </rs-button>
                <rs-button
                  variant="secondary-outline"
                  size="sm"
                  @click="exportCandidates"
                  :disabled="candidates.length === 0"
                >
                  <Icon name="ph:download" class="w-4 h-4 mr-1" />
                  Export
                </rs-button>
              </div>
            </div>
            
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
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
                      Sesi
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tindakan
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr 
                    v-for="(candidate, index) in filteredCandidates" 
                    :key="candidate.id"
                    :class="candidate.isActive ? 'bg-red-50' : ''"
                  >
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div 
                          :class="[
                            'w-3 h-3 rounded-full mr-2',
                            candidate.isActive ? 'bg-red-500' : 'bg-green-500'
                          ]"
                          :title="candidate.isActive ? 'Penolong Amil Aktif' : 'Layak'"
                        ></div>
                        <rs-badge 
                          :variant="candidate.isActive ? 'danger' : 'success'"
                          size="sm"
                        >
                          {{ candidate.isActive ? 'Penolong Amil Aktif' : 'Layak' }}
                        </rs-badge>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ candidate.namaCalon }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ candidate.noKP }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ candidate.kategoriPenolongAmil.join(', ') }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ candidate.sesiPerkhidmatan }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div class="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          :value="candidate.id"
                          v-model="selectedCandidates"
                          class="rounded"
                        />
                        <rs-button
                          variant="danger"
                          size="sm"
                          @click="removeCandidate(index)"
                        >
                          <Icon name="ph:trash" class="w-4 h-4 mr-1" />
                          Hapus
                        </rs-button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Submit Button - Moved outside the candidates list -->
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

    <!-- Import Excel Modal -->
    <rs-modal
      v-model="showImportModal"
      title="Import Calon dari Fail Excel"
      size="lg"
      position="center"
    >
      <template #body>
        <div class="py-4">
          <div class="mb-4">
            <h3 class="text-sm font-medium text-gray-900 mb-2">
              Muat Turun Templat Excel
            </h3>
            <rs-button
              variant="secondary-outline"
              @click="downloadTemplate"
            >
              <Icon name="ph:download" class="w-4 h-4 mr-1" />
              Muat Turun Templat
            </rs-button>
          </div>
          
          <div class="mb-4">
            <FormKit
              type="file"
              name="excelFile"
              label="Pilih Fail Excel"
              accept=".xlsx,.xls"
              help="Format: XLSX, XLS. Saiz maksimum: 10MB"
              v-model="excelFile"
            />
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end space-x-3">
          <rs-button
            variant="secondary-outline"
            @click="showImportModal = false"
          >
            Batal
          </rs-button>
          <rs-button
            variant="primary"
            @click="handleImportExcelFile"
            :disabled="!excelFile"
          >
            Import Calon
          </rs-button>
        </div>
      </template>
    </rs-modal>

    <!-- Confirmation Modal -->
    <rs-modal
      v-model="showConfirmationModal"
      title="Pengesahan Penghantaran"
      size="md"
      position="center"
    >
      <template #body>
        <div class="text-center py-4">
          <div class="flex justify-center mb-4">
            <div class="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
              <Icon name="ph:warning" class="text-yellow-600" size="32" />
            </div>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">
            Adakah anda pasti ingin menghantar senarai pencalonan ini?
          </h3>
          <p class="text-gray-600 mb-4">
            {{ candidates.length }} calon akan dihantar untuk proses saringan.
          </p>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-center space-x-3">
          <rs-button
            variant="secondary-outline"
            @click="showConfirmationModal = false"
          >
            Batal
          </rs-button>
          <rs-button
            variant="primary"
            @click="confirmSubmit"
          >
            Ya, Hantar
          </rs-button>
        </div>
      </template>
    </rs-modal>

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
          <div class="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p class="text-sm text-blue-800">
              Status: <strong>BELUM DISARING</strong>
            </p>
          </div>
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
            Terus ke Senarai Saringan
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

definePageMeta({
  title: "Borang Pendaftaran Calon Penolong Amil",
  description: "Borang pendaftaran calon penolong amil",
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
    name: "Daftar Baharu",
    type: "current",
    path: "/BF-PA/PP/pra-daftar-v3/daftar-baharu",
  },
]);

// RTMF Required Options
const sesiPerkhidmatanOptions = [
  { label: "Sila pilih sesi perkhidmatan", value: "" },
  { label: "Pelantikan Penolong Amil Fitrah 2024-2026", value: "Pelantikan Penolong Amil Fitrah 2024-2026" },
  { label: "Pelantikan Penolong Amil Kariah 2025-2027", value: "Pelantikan Penolong Amil Kariah 2025-2027" },
];

// Current date for registration
const currentDate = computed(() => {
  return new Date().toLocaleDateString('ms-MY');
});

// Institution type (for category logic)
const institutionType = ref("masjid"); // "masjid" or "bukan-masjid"

// Current institution data (based on logged-in PYB)
const currentInstitution = ref({
  id: "MASJID_NEGERI_001",
  name: "Masjid Negeri",
  type: "masjid",
  location: "Kuala Lumpur",
  pic: "Ahmad bin Abdullah",
  picEmail: "ahmad.abdullah@masjidnegeri.gov.my",
});

// Editing candidate data
const editingCandidate = ref({
  jenisPengenalan: "MyKad",
  noKP: "",
  namaCalon: "",
  emel: "",
  telefon: "",
  kategoriPenolongAmil: [],
  jawatan: [],
  salinanKadPengenalan: null,
  tarikhPendaftaran: currentDate.value,
});

// Candidates list
const candidates = ref([]);

// Bulk selection
const selectedCandidates = ref([]);

// Filter states
const candidateFilters = ref({
  searchQuery: "",
  kategori: "",
  status: "",
});

// Modal states
const showImportModal = ref(false);
const showConfirmationModal = ref(false);
const showSuccessModal = ref(false);

// Loading states
const isAdding = ref(false);
const isSubmitting = ref(false);

// Excel file for import
const excelFile = ref(null);

// Supporting documents for all candidates
const supportingDocuments = ref({
  suratSokongan: null,
});

// Shared pencalonan data for all candidates
const sharedPencalonanData = ref({
  sesiPerkhidmatan: "",
  tarikhPendaftaran: currentDate.value,
});

// Computed properties
const isCandidateValid = computed(() => {
  return editingCandidate.value.noKP &&
         editingCandidate.value.namaCalon &&
         editingCandidate.value.emel &&
         editingCandidate.value.telefon &&
         editingCandidate.value.kategoriPenolongAmil.length > 0 &&
         editingCandidate.value.jawatan.length > 0;
});

const canSubmit = computed(() => {
  return candidates.value.length > 0 && 
         !candidates.value.some(c => c.isActive) &&
         sharedPencalonanData.value.sesiPerkhidmatan &&
         supportingDocuments.value.suratSokongan;
});

// Progress tracking (from V2)
const progressPercentage = computed(() => {
  if (candidates.value.length === 0) return 0;
  const eligibleCandidates = candidates.value.filter(c => !c.isActive).length;
  return Math.round((eligibleCandidates / candidates.value.length) * 100);
});

// Filtered candidates
const filteredCandidates = computed(() => {
  let result = [...candidates.value];

  // Apply search filter
  if (candidateFilters.value.searchQuery) {
    const query = candidateFilters.value.searchQuery.toLowerCase();
    result = result.filter(candidate =>
      candidate.namaCalon.toLowerCase().includes(query) ||
      candidate.noKP.toLowerCase().includes(query)
    );
  }

  // Apply category filter
  if (candidateFilters.value.kategori) {
    result = result.filter(candidate =>
      candidate.kategoriPenolongAmil.includes(candidateFilters.value.kategori)
    );
  }

  // Apply status filter
  if (candidateFilters.value.status) {
    if (candidateFilters.value.status === 'layak') {
      result = result.filter(candidate => !candidate.isActive);
    } else if (candidateFilters.value.status === 'active') {
      result = result.filter(candidate => candidate.isActive);
    }
  }

  return result;
});

// Select all computed
const selectAll = computed({
  get() {
    return filteredCandidates.value.length > 0 && 
           filteredCandidates.value.every(candidate => selectedCandidates.value.includes(candidate.id));
  },
  set(value) {
    if (value) {
      selectedCandidates.value = filteredCandidates.value.map(candidate => candidate.id);
    } else {
      selectedCandidates.value = [];
    }
  }
});

// Mock candidates data for import simulation (from V2)
const mockCandidatesData = [
  {
    jenisPengenalan: "MyKad",
    noKP: "900101031234",
    namaCalon: "Ahmad Bin Abdullah",
    emel: "ahmad.abdullah@email.com",
    telefon: "0123456789",
    kategoriPenolongAmil: ["PAK", "PAF"],
    jawatan: ["Penolong Amil"],
    salinanKadPengenalan: null,
    sesiPerkhidmatan: "Pelantikan Penolong Amil Fitrah 2024-2026",
    tarikhPendaftaran: currentDate.value,
    isActive: false,
  },
  {
    jenisPengenalan: "MyKad",
    noKP: "850315071234",
    namaCalon: "Siti Fatimah Binti Hassan",
    emel: "siti.fatimah@email.com",
    telefon: "0134567890",
    kategoriPenolongAmil: ["PAK+"],
    jawatan: ["Ketua Penolong Amil"],
    salinanKadPengenalan: null,
    sesiPerkhidmatan: "Pelantikan Penolong Amil Kariah 2025-2027",
    tarikhPendaftaran: currentDate.value,
    isActive: false,
  },
  {
    jenisPengenalan: "MyKad",
    noKP: "920525081234",
    namaCalon: "Muhammad Syafiq Bin Omar",
    emel: "syafiq.omar@email.com",
    telefon: "0145678901",
    kategoriPenolongAmil: ["PA Padi"],
    jawatan: ["Penolong Amil"],
    salinanKadPengenalan: null,
    sesiPerkhidmatan: "Pelantikan Penolong Amil Fitrah 2024-2026",
    tarikhPendaftaran: currentDate.value,
    isActive: false,
  },
];

// Category selection logic based on institution type
const canSelectCategory = (category) => {
  if (currentInstitution.value.type === "masjid") {
    return ["PAK", "PAF", "PA Padi"].includes(category);
  } else {
    return category === "PAK+";
  }
};

// Check if candidate is active Penolong Amil
const checkActivePenolongAmil = (noKP) => {
  // Mock check - in real implementation, this would query the database
  const activePenolongAmil = [
    { noKP: "850315071234", kategori: "PAK", tempoh: "2022-2024" },
    { noKP: "880420082345", kategori: "PAF", tempoh: "2023-2025" },
  ];
  
  const active = activePenolongAmil.find(pa => pa.noKP === noKP);
  return active ? {
    isActive: true,
    kategori: active.kategori,
    tempoh: active.tempoh
  } : { isActive: false };
};

// Add candidate to list with shared pencalonan data
const handleAddCandidate = async () => {
  if (!isCandidateValid.value) {
    alert("Sila lengkapkan semua maklumat calon");
    return;
  }

  if (!sharedPencalonanData.value.sesiPerkhidmatan) {
    alert("Sila pilih Sesi Perkhidmatan dalam Maklumat Pencalonan terlebih dahulu");
    return;
  }

  try {
    isAdding.value = true;
    
    // Check if candidate is active Penolong Amil
    const activeCheck = checkActivePenolongAmil(editingCandidate.value.noKP);
    
    if (activeCheck.isActive) {
      alert(`Calon ialah Penolong Amil aktif (Kategori: ${activeCheck.kategori}, Tempoh: ${activeCheck.tempoh}). Sila keluarkan calon dari senarai sebelum meneruskan.`);
      return;
    }

    // Add candidate to list with shared pencalonan data
    const newCandidate = {
      ...editingCandidate.value,
      id: Date.now(),
      isActive: false,
      sesiPerkhidmatan: sharedPencalonanData.value.sesiPerkhidmatan,
      tarikhPendaftaran: sharedPencalonanData.value.tarikhPendaftaran,
    };

    candidates.value.push(newCandidate);
    
    // Clear form for next candidate
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
    jawatan: [],
    salinanKadPengenalan: null,
    tarikhPendaftaran: currentDate.value,
  };
  // Don't clear shared pencalonan data as it's for all candidates
};

// Remove candidate from list
const removeCandidate = (index) => {
  candidates.value.splice(index, 1);
};

// Bulk operations
const toggleSelectAll = () => {
  if (selectAll.value) {
    selectedCandidates.value = filteredCandidates.value.map(candidate => candidate.id);
  } else {
    selectedCandidates.value = [];
  }
};

const removeSelectedCandidates = () => {
  if (selectedCandidates.value.length === 0) return;
  
  candidates.value = candidates.value.filter(candidate => 
    !selectedCandidates.value.includes(candidate.id)
  );
  selectedCandidates.value = [];
};

// Export functionality
const exportCandidates = () => {
  const exportData = candidates.value.map(candidate => ({
    'Nama': candidate.namaCalon,
    'No KP': candidate.noKP,
    'Emel': candidate.emel,
    'Telefon': candidate.telefon,
    'Kategori': candidate.kategoriPenolongAmil.join(', '),
    'Jawatan': candidate.jawatan.join(', '),
    'Sesi Perkhidmatan': candidate.sesiPerkhidmatan,
    'Status': candidate.isActive ? 'Penolong Amil Aktif' : 'Layak',
    'Tarikh Pendaftaran': candidate.tarikhPendaftaran,
  }));

  // Create CSV content
  const headers = Object.keys(exportData[0]);
  const csvContent = [
    headers.join(','),
    ...exportData.map(row => headers.map(header => `"${row[header]}"`).join(','))
  ].join('\n');

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `calon-penolong-amil-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Handle submit (show confirmation)
const handleSubmit = () => {
  if (!canSubmit.value) {
    alert("Sila pastikan semua calon layak untuk dihantar");
    return;
  }
  
  showConfirmationModal.value = true;
};

// Confirm submit
const confirmSubmit = async () => {
  try {
    isSubmitting.value = true;
    showConfirmationModal.value = false;
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Update status to "BELUM DISARING"
    candidates.value.forEach(candidate => {
      candidate.statusPendaftaran = "BELUM DISARING";
    });
    
    showSuccessModal.value = true;
    
  } catch (error) {
    alert("Ralat berlaku semasa menghantar permohonan");
  } finally {
    isSubmitting.value = false;
  }
};

// Handle import Excel
const handleImportExcel = () => {
  showImportModal.value = true;
};

// Download Excel template
const downloadTemplate = () => {
  // In real implementation, this would download an Excel template
  alert("Templat Excel akan dimuat turun");
};

// Simulate Excel import (from V2)
const handleImportExcelFile = async () => {
  if (!excelFile.value) {
    alert("Sila pilih fail Excel terlebih dahulu");
    return;
  }

  try {
    isAdding.value = true;
    showImportModal.value = false;
    
    // Simulate file processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Add mock candidates to the list
    const newCandidates = mockCandidatesData.map(candidate => ({
      ...candidate,
      id: Date.now() + Math.random(),
    }));
    
    candidates.value.push(...newCandidates);
    
    // Clear the file input
    excelFile.value = null;
    
    alert(`Berjaya mengimport ${newCandidates.length} calon dari fail Excel.`);
    
  } catch (error) {
    alert("Ralat berlaku semasa mengimport data. Sila cuba lagi.");
  } finally {
    isAdding.value = false;
  }
};

// Handle modal close
const handleModalClose = () => {
  showSuccessModal.value = false;
  navigateTo("/BF-PA/PP/pra-daftar-v3/saringan");
};

// Handle cancel
const handleCancel = () => {
  navigateTo("/BF-PA/PP/pra-daftar-v3");
};
</script>

<style scoped>
/* Custom styles for RTMF compliance */
</style> 