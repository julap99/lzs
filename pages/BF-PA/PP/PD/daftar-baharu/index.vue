<!-- 
  RTMF SCREEN: PA-PP-PD-01_03
  PURPOSE: Registration Form - Borang Pendaftaran Calon Penolong Amil
  DESCRIPTION: Multi-candidate registration form with Excel import and bulk operations
  ROUTE: /BF-PA/PP/PD/daftar-baharu
-->
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
              type="button"
              variant="primary-outline"
              size="sm"
              @click="handleImportExcel"
              :disabled="isImporting"
              class="flex items-center space-x-2"
            >
              <Icon
                :name="isImporting ? 'ph:spinner' : 'ph:download'"
                size="16"
                :class="{ 'animate-spin': isImporting }"
              />
              <span>{{
                isImporting ? "Mengimport..." : "Muat Turun dari Fail"
              }}</span>
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
                  Maklumat Institusi
                </h3>
                <p class="mt-1 text-sm text-green-700">
                  <strong>{{ currentInstitution.name }}</strong>
                </p>
                <p class="mt-1 text-sm text-green-600">
                  PIC: {{ currentInstitution.pic }} ({{ currentInstitution.picEmail }})
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

                <!-- Kategori Penolong Amil (Dynamic Multi-Select) -->
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Kategori Penolong Amil *
                  </label>
                  
                  <!-- Multi-Select Dropdown -->
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
                              (Tidak tersedia untuk institusi ini)
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
                    Anda boleh memilih lebih daripada satu kategori
                  </p>
                  
                  <!-- Validation Error -->
                  <p v-if="kategoriValidationError" class="mt-1 text-xs text-red-600">
                    {{ kategoriValidationError }}
                  </p>
                </div>

                <!-- Kategori Details (Jawatan & Sesi Perkhidmatan) -->
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Butiran Kategori *
                  </label>
                  <div class="space-y-4">
                    <!-- Dynamic Category Details -->
                    <div v-for="kategori in editingCandidate.kategoriPenolongAmil" :key="kategori" class="p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <div class="flex items-center mb-3">
                        <div class="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                        <h4 class="text-sm font-medium text-gray-800">
                          {{ getKategoriDisplayName(kategori) }}
                        </h4>
                      </div>
                      
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <!-- Jawatan for this category -->
                        <div>
                          <FormKit
                            type="select"
                            :name="`jawatan-${kategori}`"
                            label="Jawatan"
                            :options="getJawatanOptionsForKategori(kategori)"
                            placeholder="Pilih jawatan"
                            validation="required"
                            :validation-messages="{
                              required: 'Sila pilih jawatan untuk kategori ini'
                            }"
                            v-model="editingCandidate.jawatanPerKategori[kategori]"
                            :classes="{
                              input: '!py-2',
                              label: 'text-sm font-medium text-gray-700 mb-2'
                            }"
                          />
                          <p v-if="getJawatanValidationError(kategori)" class="mt-1 text-xs text-red-600">
                            {{ getJawatanValidationError(kategori) }}
                          </p>
                        </div>
                        
                        <!-- Sesi Perkhidmatan for this category -->
                        <div>
                          <FormKit
                            type="select"
                            :name="`sesi-${kategori}`"
                            label="Sesi Perkhidmatan"
                            :options="getSesiOptionsForKategori(kategori)"
                            placeholder="Pilih sesi"
                            validation="required"
                            :validation-messages="{
                              required: 'Sila pilih sesi perkhidmatan untuk kategori ini'
                            }"
                            v-model="editingCandidate.sesiPerKategori[kategori]"
                            :classes="{
                              input: '!py-2',
                              label: 'text-sm font-medium text-gray-700 mb-2'
                            }"
                          />
                          <p v-if="getSesiValidationError(kategori)" class="mt-1 text-xs text-red-600">
                            {{ getSesiValidationError(kategori) }}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Show message when no categories selected -->
                    <div v-if="editingCandidate.kategoriPenolongAmil.length === 0" class="text-sm text-gray-500 italic text-center py-4">
                      Sila pilih Kategori Penolong Amil terlebih dahulu untuk menentukan Jawatan dan Sesi Perkhidmatan
                    </div>
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

            <div class="mb-6 p-4 bg-gray-50 rounded-lg">
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
                    { label: '.....', value: '' },
                    { label: 'PAK', value: 'PAK' },
                    { label: 'PAF', value: 'PAF' },
                    { label: 'PAP', value: 'PAP' },
                    { label: 'PAK+', value: 'PAK+' }
                  ]"
                  placeholder="Kategori"
                  :classes="{ input: '!py-2' }"
                />
                <FormKit
                  v-model="candidateFilters.status"
                  type="select"
                  :options="[
                    { label: '.....', value: '' },
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
                  Keluarkan
                </rs-button>
                <rs-button
                  variant="secondary-outline"
                  size="sm"
                  @click="exportCandidates"
                  :disabled="candidates.length === 0"
                >
                  <Icon name="ph:download" class="w-4 h-4 mr-1" />
                  Muat Turun
                </rs-button>
              </div>
            </div>
            
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                      <input 
                        type="checkbox" 
                        v-model="selectAll"
                        @change="toggleSelectAll"
                        class="form-checkbox h-4 w-4 text-primary-600"
                      />
                    </th>
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
                      Jawatan
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sesi
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
                      <input 
                        type="checkbox" 
                        :value="candidate.id"
                        v-model="selectedCandidates"
                        class="form-checkbox h-4 w-4 text-primary-600"
                      />
                    </td>
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
                      {{ formatCandidateJawatan(candidate) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ Object.values(candidate.sesiPerKategori || {}).join(', ') }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Supporting Documents Section - Moved after Candidates List -->
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

          <!-- Submit Button - Moved after Supporting Documents -->
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
      title="Muat Turun Calon dari Fail Excel"
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
            Muat Turun Calon
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
            {{ candidates.length }} calon telah berjaya didaftarkan dan dihantar untuk proses saringan oleh Jabatan Pengurusan Risiko.
          </p>
          <div class="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p class="text-sm text-blue-800">
              Status: <strong>BELUM DISARING</strong><br>
              <span class="text-xs">Calon akan disaring oleh Jabatan Pengurusan Risiko</span>
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
            Kembali ke Dashboard
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";

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
  title: "Borang Pendaftaran Calon Penolong Amil",
  description: "Borang pendaftaran calon penolong amil",
});

// Fetch categories when component mounts
onMounted(() => {
  fetchKategoriPenolongAmil();
  fetchJawatanOptions(); // Fetch jawatan options when component mounts
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
    name: "Daftar Baharu",
    type: "current",
    path: "/BF-PA/PP/PD/daftar-baharu",
  },
]);

// RTMF Required Options - Updated with category-specific sessions
const sesiPerkhidmatanOptions = {
  PAK: [
    { label: "Sila pilih sesi perkhidmatan PAK", value: "" },
    { label: "2025-2027", value: "2025-2027" },
    { label: "2026-2028", value: "2026-2028" },
  ],
  PAF: [
    { label: "Sila pilih sesi perkhidmatan PAF", value: "" },
    { label: "2024-2026", value: "2024-2026" },
    { label: "2025-2027", value: "2025-2027" },
  ],
  PAP: [
    { label: "Sila pilih sesi perkhidmatan PAP", value: "" },
    { label: "2024-2026", value: "2024-2026" },
    { label: "2025-2027", value: "2025-2027" },
  ],
  "PAK+": [
    { label: "Sila pilih sesi perkhidmatan PAK+", value: "" },
    { label: "2024-2026", value: "2024-2026" },
    { label: "2025-2027", value: "2025-2027" },
  ],
};

// Dynamic Kategori Penolong Amil Options (from database)
const kategoriPenolongAmilOptions = ref([
  { label: "PAK (Penolong Amil Kariah)", value: "PAK" },
  { label: "PAF (Penolong Amil Fitrah)", value: "PAF" },
  { label: "PAP (Penolong Amil Padi)", value: "PAP" },
  { label: "PAK+ (Penolong Amil Komuniti)", value: "PAK+" },
]);

// Dynamic Jawatan Options (from database)
const jawatanOptions = ref([
  { 
    id: 1, 
    code: "PENOLONG_AMIL", 
    name: "Penolong Amil", 
    enabled: true,
    applicable_categories: ["PAK", "PAF", "PAP", "PAK+"]
  },
  { 
    id: 2, 
    code: "KETUA_PENOLONG_AMIL", 
    name: "Ketua Penolong Amil", 
    enabled: true,
    applicable_categories: ["PAK", "PAF", "PAK+"]
  },
]);

// Function to fetch jawatan options from database (for future implementation)
const fetchJawatanOptions = async () => {
  try {
    // TODO: Replace with actual API call when backend is ready
    // const response = await $fetch('/api/bf-pa/konfigurasi/jawatan-penolong-amil');
    // jawatanOptions.value = response.data.map(item => ({
    //   id: item.id,
    //   code: item.code,
    //   name: item.name,
    //   description: item.description,
    //   enabled: item.enabled,
    //   applicable_categories: item.applicable_categories
    // }));
    
    // For now, use mock data
    console.log('Jawatan options loaded:', jawatanOptions.value.length);
  } catch (error) {
    console.error('Error fetching jawatan options:', error);
  }
};

// Function to fetch categories from database (for future implementation)
const fetchKategoriPenolongAmil = async () => {
  try {
    // TODO: Replace with actual API call when backend is ready
    // const response = await $fetch('/api/bf-pa/konfigurasi/kategori-penolong-amil');
    // kategoriPenolongAmilOptions.value = response.data.map(item => ({
    //   label: `${item.code} (${item.name})`,
    //   value: item.code,
    //   disabled: !canSelectCategory(item.code)
    // }));
    
    // For now, use mock data with institution-based filtering
    const mockCategories = [
      { code: "PAK", name: "Penolong Amil Kariah", enabled: true },
      { code: "PAF", name: "Penolong Amil Fitrah", enabled: true },
      { code: "PAP", name: "Penolong Amil Padi", enabled: true },
      { code: "PAK+", name: "Penolong Amil Komuniti", enabled: false },
    ];
    
    kategoriPenolongAmilOptions.value = mockCategories.map(item => ({
      label: `${item.code} (${item.name})`,
      value: item.code,
      disabled: !item.enabled || !canSelectCategory(item.code)
    }));
  } catch (error) {
    console.error('Error fetching kategori penolong amil:', error);
  }
};

// Current date for registration
const currentDate = computed(() => {
  return new Date().toLocaleDateString('ms-MY');
});

// Institution type (for category logic)
const institutionType = ref("masjid"); // "masjid" or "bukan-masjid"

// Current institution data (based on logged-in PIC)
const currentInstitution = ref({
  id: "MASJID_NEGERI_SELANGOR_001",
  name: "Masjid Negeri Selangor",
  type: "masjid",
  location: "Selangor",
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
  jawatanPerKategori: {}, // New field to store jawatan per kategori
  sesiPerKategori: {}, // New field to store sesi per kategori
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
const isImporting = ref(false); // New state for import

// Excel file for import
const excelFile = ref(null);

// Supporting documents for all candidates
const supportingDocuments = ref({
  suratSokongan: null,
});

// Shared pencalonan data for all candidates (removed sesiPerkhidmatan)
const sharedPencalonanData = ref({
  tarikhPendaftaran: currentDate.value,
});

// Computed properties
const isCandidateValid = computed(() => {
  // Check if at least one category is selected
  if (editingCandidate.value.kategoriPenolongAmil.length === 0) {
    return false;
  }

  // Check if all required fields are filled for each category
  for (const kategori of editingCandidate.value.kategoriPenolongAmil) {
    if (!editingCandidate.value.jawatanPerKategori[kategori]) {
      return false;
    }
    if (!editingCandidate.value.sesiPerKategori[kategori]) {
      return false;
    }
  }

  return editingCandidate.value.noKP &&
         editingCandidate.value.namaCalon &&
         editingCandidate.value.emel &&
         editingCandidate.value.telefon;
});

const canSubmit = computed(() => {
  return candidates.value.length > 0 && 
         !candidates.value.some(c => c.isActive) &&
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

// Mock candidates data for import simulation (from V2) - Updated with sesiPerKategori
const mockCandidatesData = [
  {
    jenisPengenalan: "MyKad",
    noKP: "900101031234",
    namaCalon: "Ahmad Bin Abdullah",
    emel: "ahmad.abdullah@email.com",
    telefon: "0123456789",
    kategoriPenolongAmil: ["PAK", "PAF"],
    jawatanPerKategori: {
      "PAK": "PAK-KETUA_PENOLONG_AMIL",
      "PAF": "PAF-PENOLONG_AMIL",
    },
    sesiPerKategori: {
      "PAK": "2025-2027",
      "PAF": "2024-2026",
    },
    salinanKadPengenalan: null,
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
    jawatanPerKategori: {
      "PAK+": "PAK+-KETUA_PENOLONG_AMIL",
    },
    sesiPerKategori: {
      "PAK+": "2024-2026",
    },
    salinanKadPengenalan: null,
    tarikhPendaftaran: currentDate.value,
    isActive: true, // SIMULATION: This candidate is an active Penolong Amil (Tidak Layak)
  },
  {
    jenisPengenalan: "MyKad",
    noKP: "920525081234",
    namaCalon: "Muhammad Syafiq Bin Omar",
    emel: "syafiq.omar@email.com",
    telefon: "0145678901",
    kategoriPenolongAmil: ["PAP"],
    jawatanPerKategori: {
      "PAP": "PAP-PENOLONG_AMIL",
    },
    sesiPerKategori: {
      "PAP": "2024-2026",
    },
    salinanKadPengenalan: null,
    tarikhPendaftaran: currentDate.value,
    isActive: false,
  },
];

// Category selection logic based on institution type
const canSelectCategory = (category) => {
  if (currentInstitution.value.type === "masjid") {
    return ["PAK", "PAF", "PAP"].includes(category);
  } else {
    return category === "PAK+";
  }
};

// Get display name for category
const getKategoriDisplayName = (kategori) => {
  const categoryOption = kategoriPenolongAmilOptions.value.find(option => option.value === kategori);
  return categoryOption ? categoryOption.label : kategori;
};

// Get jawatan options for a specific category
const getJawatanOptionsForKategori = (kategori) => {
  // Filter jawatan options that are applicable to this category
  return jawatanOptions.value
    .filter(jawatan => 
      jawatan.enabled && 
      jawatan.applicable_categories.includes(kategori)
    )
    .map(jawatan => ({
      label: `${jawatan.name}`,
      value: `${kategori}-${jawatan.code}`
    }));
};

// Get sesi options for a specific category
const getSesiOptionsForKategori = (kategori) => {
  return sesiPerkhidmatanOptions[kategori] || [];
};

// Map jawatan code to readable name
const jawatanCodeToName = computed(() => {
  const map = {};
  for (const option of jawatanOptions.value) {
    map[option.code] = option.name;
  }
  return map;
});

const toTitleCase = (str) => {
  if (!str) return '';
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

const formatJawatanEntry = (entry) => {
  if (!entry || typeof entry !== 'string') return '';
  const [kategori, code] = entry.split('-', 2);
  const readableName = jawatanCodeToName.value[code] || toTitleCase(code.replace(/_/g, ' '));
  return `${readableName} (${kategori})`;
};

const formatCandidateJawatan = (candidate) => {
  const entries = Object.values(candidate.jawatanPerKategori || {});
  return entries.map(formatJawatanEntry).filter(Boolean).join(', ');
};

// Get validation error for jawatan
const getJawatanValidationError = (kategori) => {
  if (!editingCandidate.value.jawatanPerKategori[kategori]) {
    return "Sila pilih jawatan untuk kategori ini.";
  }
  return null;
};

// Get validation error for sesi
const getSesiValidationError = (kategori) => {
  if (!editingCandidate.value.sesiPerKategori[kategori]) {
    return "Sila pilih sesi perkhidmatan untuk kategori ini.";
  }
  return null;
};

// Check if candidate is active Penolong Amil
const checkActivePenolongAmil = (noKP) => {
  // Mock check - in real implementation, this would query the database
  const activePenolongAmil = [
    { noKP: "850315071234", kategori: "PAK+", tempoh: "2024-2026" }, // SIMULATION: Active Penolong Amil
    { noKP: "880420082345", kategori: "PAF", tempoh: "2023-2025" },
  ];
  
  const active = activePenolongAmil.find(pa => pa.noKP === noKP);
  return active ? {
    isActive: true,
    kategori: active.kategori,
    tempoh: active.tempoh
  } : { isActive: false };
};

// Add candidate to list with category-specific sesi data
const handleAddCandidate = async () => {
  if (!isCandidateValid.value) {
    alert("Sila lengkapkan semua maklumat calon");
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

    // Add candidate to list with category-specific sesi data
    const newCandidate = {
      ...editingCandidate.value,
      id: Date.now(),
      isActive: false,
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
    jawatanPerKategori: {}, // Clear new field
    sesiPerKategori: {}, // Clear new field
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

// Export functionality - Updated to handle sesiPerKategori
const exportCandidates = () => {
  const exportData = candidates.value.map(candidate => ({
    'Nama': candidate.namaCalon,
    'No KP': candidate.noKP,
    'Emel': candidate.emel,
    'Telefon': candidate.telefon,
    'Kategori': candidate.kategoriPenolongAmil.join(', '),
    'Jawatan': formatCandidateJawatan(candidate),
    'Sesi Perkhidmatan': Object.values(candidate.sesiPerKategori || {}).join(', '),
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
    isImporting.value = true; // Set loading state for import
    showImportModal.value = false;
    
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
    isImporting.value = false; // Reset loading state
  }
};

// Handle modal close - Navigate to PA-PP-PD-01_01: Main Dashboard
const handleModalClose = () => {
  showSuccessModal.value = false;
  navigateTo("/BF-PA/PP/PD");
};

// Handle cancel - Navigate to PA-PP-PD-01_01: Main Dashboard
const handleCancel = () => {
  navigateTo("/BF-PA/PP/PD");
};

// Multi-select dropdown logic
const showKategoriDropdown = ref(false);
const kategoriValidationError = ref(null);

const toggleKategoriDropdown = () => {
  showKategoriDropdown.value = !showKategoriDropdown.value;
  kategoriValidationError.value = null;
};

const clearKategoriSelection = () => {
  editingCandidate.value.kategoriPenolongAmil = [];
  kategoriValidationError.value = null;
};

// Close dropdown when clicking outside
const closeKategoriDropdown = () => {
  showKategoriDropdown.value = false;
};

// Watch for kategori changes to update validation
watch(() => editingCandidate.value.kategoriPenolongAmil, (newKategori) => {
  if (newKategori.length === 0) {
    kategoriValidationError.value = 'Sila pilih sekurang-kurangnya satu kategori';
  } else {
    kategoriValidationError.value = null;
  }
}, { immediate: true });
</script>

<style scoped>
/* Custom styles for RTMF compliance */
</style> 
