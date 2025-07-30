<!-- 
  RTMF SCREEN: PA-PP-PD-06_02
  PURPOSE: Division Head Approval Detail - Paparan Terperinci Kelulusan
  DESCRIPTION: Detailed division head approval view for final candidate approval
  ROUTE: /BF-PA/PP/pra-daftar-v3/ketua-divisyen/detail/[rujukan]
-->
<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Compact Workflow Widget -->
    <div class="mb-4">
      <rs-card>
        <template #header>
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold text-gray-900">
              Proses Verifikasi Calon Penolong Amil
            </h3>
            <rs-badge variant="primary">Ketua Divisyen</rs-badge>
          </div>
        </template>
        <template #body>
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <div 
                v-for="(step, index) in workflowSteps" 
                :key="step.key"
                class="flex items-center"
              >
                <div class="flex flex-col items-center">
                  <div 
                    :class="[
                      'w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium',
                      getStepVariant(step.key)
                    ]"
                  >
                    <Icon 
                      v-if="step.icon" 
                      :name="step.icon" 
                      class="w-4 h-4"
                    />
                    <span v-else>{{ index + 1 }}</span>
                  </div>
                  <span class="text-xs mt-1 text-center max-w-16">{{ step.label }}</span>
                </div>
                <div 
                  v-if="index < workflowSteps.length - 1"
                  :class="[
                    'h-1 w-8 mx-1',
                    getStepLineVariant(step.key)
                  ]"
                ></div>
              </div>
            </div>
          </div>
        </template>
      </rs-card>
    </div>

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Kelulusan Ketua Divisyen - Maklumat Terperinci
          </h2>
          <rs-button
            variant="secondary-outline"
            @click="handleBack"
          >
            <Icon name="ph:arrow-left" class="w-4 h-4 mr-1" />
            Kembali
          </rs-button>
        </div>
      </template>

      <template #body>
        <div class="p-4">
          <!-- Application Status -->
          <div class="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <div class="flex justify-between items-center">
              <div>
                <h3 class="text-lg font-semibold text-gray-900">
                  Status Kelulusan Ketua Divisyen
                </h3>
                <p class="text-sm text-gray-600">
                  Rujukan: {{ application.rujukan }}
                </p>
              </div>
              <div class="flex gap-2">
                <rs-badge :variant="getStatusPendaftaranVariant(application.statusPendaftaran)">
                  {{ getLocalizedStatus(application.statusPendaftaran) }}
                </rs-badge>
                <rs-badge :variant="getApprovalStatusVariant(approvalData.statusKelulusan)">
                  {{ approvalData.statusKelulusan }}
                </rs-badge>
              </div>
            </div>
          </div>

          <!-- Personal Information -->
          <div class="mb-6 p-6 border border-gray-200 rounded-lg">
            <h3 class="text-lg font-semibold mb-4 text-gray-900">
              Maklumat Peribadi
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
                  Jantina
                </label>
                <p class="text-gray-900">{{ application.jantina }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Bangsa
                </label>
                <p class="text-gray-900">{{ application.bangsa }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Agama
                </label>
                <p class="text-gray-900">{{ application.agama }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Alamat Emel
                </label>
                <p class="text-gray-900">{{ application.emel }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Nombor Telefon
                </label>
                <p class="text-gray-900">{{ application.telefon }}</p>
              </div>
            </div>
          </div>

          <!-- Address Information -->
          <div class="mb-6 p-6 border border-gray-200 rounded-lg">
            <h3 class="text-lg font-semibold mb-4 text-gray-900">
              Maklumat Alamat
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Alamat Rumah
                </label>
                <p class="text-gray-900">{{ application.alamatRumah }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Poskod
                </label>
                <p class="text-gray-900">{{ application.poskod }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Bandar
                </label>
                <p class="text-gray-900">{{ application.bandar }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Negeri
                </label>
                <p class="text-gray-900">{{ application.negeri }}</p>
              </div>
            </div>
          </div>

          <!-- Service Information -->
          <div class="mb-6 p-6 border border-gray-200 rounded-lg">
            <h3 class="text-lg font-semibold mb-4 text-gray-900">
              Maklumat Perkhidmatan
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Kategori Penolong Amil
                </label>
                <p class="text-gray-900">{{ application.kategoriPenolongAmil }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Jawatan
                </label>
                <p class="text-gray-900">{{ application.jawatan }}</p>
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

          <!-- Documents Section -->
          <div class="mb-6 p-6 border border-gray-200 rounded-lg">
            <h3 class="text-lg font-semibold mb-4 text-gray-900">
              Dokumen Sokongan
            </h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Salinan Kad Pengenalan -->
              <div>
                <h4 class="font-medium mb-3">Salinan Kad Pengenalan</h4>
                <div class="border border-gray-200 rounded-md">
                  <div class="bg-gray-50 p-3 border-b border-gray-200 flex justify-between items-center">
                    <div class="flex items-center">
                      <Icon name="heroicons:document-text" class="text-blue-600 mr-2" size="20" />
                      <span>{{ application.salinanKadPengenalan }}</span>
                    </div>
                    <rs-button size="sm" variant="primary-outline" @click="previewDocument('salinanKadPengenalan')">
                      <Icon name="heroicons:eye" class="mr-1" size="16" />
                      Lihat Dokumen
                    </rs-button>
                  </div>
                  <div class="p-3 bg-gray-50 text-sm text-gray-500">
                    Dimuat naik oleh {{ application.nama }} pada {{ application.uploadDate }}
                  </div>
                </div>
              </div>

              <!-- Surat Sokongan (if exists) -->
              <div v-if="application.suratSokongan">
                <h4 class="font-medium mb-3">Surat Sokongan</h4>
                <div class="border border-gray-200 rounded-md">
                  <div class="bg-gray-50 p-3 border-b border-gray-200 flex justify-between items-center">
                    <div class="flex items-center">
                      <Icon name="heroicons:document-text" class="text-blue-600 mr-2" size="20" />
                      <span>{{ application.suratSokongan }}</span>
                    </div>
                    <rs-button size="sm" variant="primary-outline" @click="previewDocument('suratSokongan')">
                      <Icon name="heroicons:eye" class="mr-1" size="16" />
                      Lihat Dokumen
                    </rs-button>
                  </div>
                  <div class="p-3 bg-gray-50 text-sm text-gray-500">
                    Dimuat naik oleh {{ application.nama }} pada {{ application.uploadDate }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Review History -->
          <div class="mb-6 p-6 border border-gray-200 rounded-lg">
            <h3 class="text-lg font-semibold mb-4 text-gray-900">
              Sejarah Semakan
            </h3>
            
            <div class="space-y-4">
              <!-- PYB Institusi Review -->
              <div class="flex items-start justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                <div class="flex items-start">
                  <Icon name="ph:user-plus" class="w-5 h-5 mr-3 text-green-500 mt-1" />
                  <div class="flex-1">
                    <div class="flex items-center justify-between mb-2">
                      <h4 class="font-semibold text-green-900">PYB Institusi</h4>
                      <rs-badge variant="success">Selesai</rs-badge>
                    </div>
                    <p class="text-sm text-green-700 mb-2">Mendaftar calon penolong amil</p>
                    <div class="text-xs text-green-600 space-y-1">
                      <p><strong>Disemak oleh:</strong> Ahmad Abdullah (PYB)</p>
                      <p><strong>Tarikh:</strong> 15/01/2024 10:30 AM</p>
                      <p><strong>Catatan:</strong> Calon berjaya didaftarkan dengan maklumat lengkap</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Jabatan Pengurusan Risiko Review -->
              <div class="flex items-start justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                <div class="flex items-start">
                  <Icon name="ph:shield-check" class="w-5 h-5 mr-3 text-green-500 mt-1" />
                  <div class="flex-1">
                    <div class="flex items-center justify-between mb-2">
                      <h4 class="font-semibold text-green-900">Jabatan Pengurusan Risiko</h4>
                      <rs-badge variant="success">Selesai</rs-badge>
                    </div>
                    <p class="text-sm text-green-700 mb-2">Saringan risiko calon</p>
                    <div class="text-xs text-green-600 space-y-1">
                      <p><strong>Disemak oleh:</strong> Siti Fatimah binti Omar (Eksekutif Risiko)</p>
                      <p><strong>Tarikh:</strong> 20/01/2024 14:15 PM</p>
                      <p><strong>Catatan:</strong> Calon lulus saringan risiko. Tiada rekod jenayah atau masalah kewangan</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- PT Review -->
              <div class="flex items-start justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                <div class="flex items-start">
                  <Icon name="ph:clipboard-text" class="w-5 h-5 mr-3 text-green-500 mt-1" />
                  <div class="flex-1">
                    <div class="flex items-center justify-between mb-2">
                      <h4 class="font-semibold text-green-900">Pegawai Tadbir</h4>
                      <rs-badge variant="success">Selesai</rs-badge>
                    </div>
                    <p class="text-sm text-green-700 mb-2">Semakan dokumen dan kelayakan</p>
                    <div class="text-xs text-green-600 space-y-1">
                      <p><strong>Disemak oleh:</strong> Mohd Ali bin Hassan (Pegawai Tadbir)</p>
                      <p><strong>Tarikh:</strong> 25/01/2024 09:45 AM</p>
                      <p><strong>Catatan:</strong> Dokumen lengkap dan memenuhi syarat. Disyorkan untuk sokongan eksekutif</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Eksekutif Review -->
              <div class="flex items-start justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                <div class="flex items-start">
                  <Icon name="ph:thumbs-up" class="w-5 h-5 mr-3 text-green-500 mt-1" />
                  <div class="flex-1">
                    <div class="flex items-center justify-between mb-2">
                      <h4 class="font-semibold text-green-900">Eksekutif</h4>
                      <rs-badge variant="success">Selesai</rs-badge>
                    </div>
                    <p class="text-sm text-green-700 mb-2">Sokongan eksekutif</p>
                    <div class="text-xs text-green-600 space-y-1">
                      <p><strong>Disemak oleh:</strong> Dr. Aminah binti Abdullah (Eksekutif)</p>
                      <p><strong>Tarikh:</strong> 30/01/2024 11:20 AM</p>
                      <p><strong>Catatan:</strong> Calon layak dan disokong untuk pengesahan ketua jabatan</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Ketua Jabatan Review -->
              <div class="flex items-start justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                <div class="flex items-start">
                  <Icon name="ph:check-circle" class="w-5 h-5 mr-3 text-green-500 mt-1" />
                  <div class="flex-1">
                    <div class="flex items-center justify-between mb-2">
                      <h4 class="font-semibold text-green-900">Ketua Jabatan</h4>
                      <rs-badge variant="success">Selesai</rs-badge>
                    </div>
                    <p class="text-sm text-green-700 mb-2">Pengesahan ketua jabatan</p>
                    <div class="text-xs text-green-600 space-y-1">
                      <p><strong>Disemak oleh:</strong> Prof. Dr. Ismail bin Ahmad (Ketua Jabatan)</p>
                      <p><strong>Tarikh:</strong> 05/04/2024 14:30 PM</p>
                      <p><strong>Catatan:</strong> Calon disahkan oleh ketua jabatan. Sedia untuk kelulusan akhir ketua divisyen</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Ketua Divisyen Review (Current) -->
              <div class="flex items-start justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div class="flex items-start">
                  <Icon name="ph:star" class="w-5 h-5 mr-3 text-orange-500 mt-1" />
                  <div class="flex-1">
                    <div class="flex items-center justify-between mb-2">
                      <h4 class="font-semibold text-orange-900">Ketua Divisyen</h4>
                      <rs-badge variant="warning">Dalam Proses</rs-badge>
                    </div>
                    <p class="text-sm text-orange-700 mb-2">Kelulusan akhir ketua divisyen</p>
                    <div class="text-xs text-orange-600 space-y-1">
                      <p><strong>Disemak oleh:</strong> {{ currentUser.name }} ({{ currentUser.role }})</p>
                      <p><strong>Tarikh:</strong> {{ currentDate }}</p>
                      <p><strong>Status:</strong> Menunggu keputusan kelulusan akhir</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Division Head Approval Form -->
          <div class="mb-6 p-6 border border-blue-200 rounded-lg bg-blue-50">
            <h3 class="text-lg font-semibold mb-4 text-blue-900">
              Keputusan Kelulusan Ketua Divisyen
            </h3>
            
            <div class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Approval Decision -->
                <div class="md:col-span-2">
                  <FormKit
                    type="select"
                    name="statusKelulusan"
                    label="Keputusan Kelulusan *"
                    :options="approvalDecisionOptions"
                    validation="required"
                    :validation-messages="{
                      required: 'Keputusan kelulusan diperlukan',
                    }"
                    v-model="approvalForm.statusKelulusan"
                    :classes="{
                      input: '!py-2',
                    }"
                  />
                </div>

                <!-- Approval Date (Auto-filled, cannot edit) -->
                <div>
                  <FormKit
                    type="date"
                    name="tarikhKelulusan"
                    label="Tarikh Kelulusan *"
                    validation="required"
                    :validation-messages="{
                      required: 'Tarikh kelulusan diperlukan',
                    }"
                    v-model="approvalForm.tarikhKelulusan"
                    :classes="{
                      input: '!py-2 bg-gray-100',
                    }"
                    :disabled="true"
                  />
                </div>

                <!-- Approver Name (Auto-filled, cannot edit) -->
                <div>
                  <FormKit
                    type="text"
                    name="diluluskanOleh"
                    label="Diluluskan Oleh *"
                    validation="required"
                    :validation-messages="{
                      required: 'Nama pelulus diperlukan',
                    }"
                    v-model="approvalForm.diluluskanOleh"
                    :classes="{
                      input: '!py-2 bg-gray-100',
                    }"
                    :disabled="true"
                  />
                </div>

                <!-- Approval Comments -->
                <div class="md:col-span-2">
                  <FormKit
                    type="textarea"
                    name="catatanKelulusan"
                    label="Catatan Kelulusan *"
                    placeholder="Sila berikan catatan kelulusan anda..."
                    validation="required"
                    :validation-messages="{
                      required: 'Catatan kelulusan diperlukan',
                    }"
                    v-model="approvalForm.catatanKelulusan"
                    :classes="{
                      input: 'min-h-[120px] !py-2',
                    }"
                  />
                </div>

                <!-- Additional Documents -->
                <div class="md:col-span-2">
                  <FormKit
                    type="file"
                    name="additionalDocuments"
                    label="Dokumen Tambahan (Jika Ada)"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    multiple
                    :classes="{
                      input: '!py-2',
                    }"
                    v-model="approvalForm.additionalDocuments"
                    help="Format: PDF, DOC, DOCX, JPG, JPEG, PNG. Saiz maksimum 10MB"
                  />
                </div>
              </div>

              <!-- Submit Buttons -->
              <div class="flex justify-end gap-4 mt-6">
                <rs-button
                  type="button"
                  variant="secondary-outline"
                  @click="handleBack"
                  :disabled="isSubmitting"
                >
                  Batal
                </rs-button>
                <rs-button
                  type="button"
                  variant="primary"
                  :disabled="isSubmitting || !isFormValid"
                  @click="showConfirmationModal = true"
                >
                  <Icon
                    v-if="isSubmitting"
                    name="ph:spinner"
                    class="w-4 h-4 mr-2 animate-spin"
                  />
                  {{ isSubmitting ? 'Menghantar...' : 'Hantar Keputusan' }}
                </rs-button>
              </div>
            </div>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Confirmation Modal -->
    <rs-modal
      v-model="showConfirmationModal"
      title="Sahkan Keputusan"
      size="md"
    >
      <template #body>
        <div class="text-center">
          <Icon name="ph:warning-circle" class="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h3 class="text-lg font-semibold text-gray-900 mb-2">
            Adakah anda pasti?
          </h3>
          <p class="text-gray-600 mb-4">
            Anda akan menghantar keputusan kelulusan divisyen untuk permohonan ini. 
            Tindakan ini tidak boleh dibatalkan.
          </p>
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <p class="text-sm text-blue-800">
              <strong>Keputusan:</strong> {{ approvalForm.statusKelulusan || 'Belum dipilih' }}
            </p>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-3">
          <rs-button
            variant="secondary-outline"
            @click="showConfirmationModal = false"
          >
            Batal
          </rs-button>
          <rs-button
            variant="primary"
            @click="confirmSubmit"
            :loading="isSubmitting"
          >
            <Icon name="ph:check" class="w-4 h-4 mr-2" />
            Ya, Hantar Keputusan
          </rs-button>
        </div>
      </template>
    </rs-modal>

    <!-- Success Modal -->
    <rs-modal
      v-model="showSuccessModal"
      title="Kelulusan Berjaya"
      size="sm"
    >
      <template #body>
        <div class="text-center">
          <Icon name="ph:check-circle" class="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 class="text-lg font-semibold text-gray-900 mb-2">
            Kelulusan Ketua Divisyen Berjaya
          </h3>
          <p class="text-gray-600 mb-4">
            Keputusan kelulusan anda telah berjaya dihantar dan direkodkan dalam sistem.
          </p>
          <div class="bg-gray-50 p-3 rounded-lg mb-4">
            <p class="text-sm text-gray-700">
              <strong>Status:</strong> {{ approvalForm.statusKelulusan }}
            </p>
            <p class="text-sm text-gray-700">
              <strong>Tarikh:</strong> {{ approvalForm.tarikhKelulusan }}
            </p>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-3">
          <rs-button
            variant="primary"
            @click="handleSuccessConfirm"
          >
            Kembali ke Senarai
          </rs-button>
        </div>
      </template>
    </rs-modal>

    <!-- Error Modal -->
    <rs-modal
      v-model="showErrorModal"
      title="Ralat"
      size="sm"
    >
      <template #body>
        <div class="text-center">
          <Icon name="ph:warning" class="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 class="text-lg font-semibold text-gray-900 mb-2">
            Ralat Semasa Menghantar
          </h3>
          <p class="text-gray-600">
            {{ errorMessage }}
          </p>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-3">
          <rs-button
            variant="secondary-outline"
            @click="showErrorModal = false"
          >
            Tutup
          </rs-button>
          <rs-button
            variant="primary"
            @click="retrySubmission"
          >
            Cuba Lagi
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

const route = useRoute();
const { $swal } = useNuxtApp();

definePageMeta({
  title: "Kelulusan Ketua Divisyen - Maklumat Terperinci",
  description: "Paparan terperinci kelulusan ketua divisyen",
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
    name: "Ketua Divisyen",
    type: "link",
    path: "/BF-PA/PP/pra-daftar-v3",
  },
  {
    name: "Maklumat Terperinci",
    type: "current",
    path: `/BF-PA/PP/pra-daftar-v3/ketua-divisyen/detail/${route.params.rujukan}`,
  },
]);

// Workflow steps for Ketua Divisyen role
const workflowSteps = computed(() => {
  return [
    { key: 'registration', label: 'Pendaftaran', icon: 'ph:user-plus' },
    { key: 'screening', label: 'Saringan', icon: 'ph:shield-check' },
    { key: 'review', label: 'Semakan PT', icon: 'ph:clipboard-text' },
    { key: 'support', label: 'Sokongan', icon: 'ph:thumbs-up' },
    { key: 'confirmation', label: 'Pengesahan', icon: 'ph:check-circle' },
    { key: 'approval', label: 'Kelulusan', icon: 'ph:check-circle' }
  ];
});

// Approval Decision Options
const approvalDecisionOptions = [
  { label: "Sila Pilih Keputusan", value: "" },
  { label: "Lulus", value: "Lulus" },
  { label: "Tidak Lulus", value: "Tidak Lulus" },
  { label: "Telah Disemak dan Perlu Maklumat Tambahan", value: "Perlu Maklumat Tambahan" },
];

// Form Data
const approvalForm = ref({
  statusKelulusan: "",
  tarikhKelulusan: "",
  diluluskanOleh: "",
  catatanKelulusan: "",
  additionalDocuments: null,
});

// State management
const isSubmitting = ref(false);
const showConfirmationModal = ref(false);
const showSuccessModal = ref(false);
const showErrorModal = ref(false);
const errorMessage = ref("");

// Current user data (mock session token)
const currentUser = ref({
  name: "Tan Sri Dato' Dr. Ahmad bin Mohamed",
  role: "Ketua Divisyen",
  id: "KD001",
  department: "Bahagian Pentadbiran"
});

// Current date
const currentDate = ref(new Date().toLocaleDateString('ms-MY'));

// Form validation
const isFormValid = computed(() => {
  return (
    approvalForm.value.statusKelulusan &&
    approvalForm.value.catatanKelulusan
  );
});

// Mock application data based on RTMF requirements
const application = ref({
  rujukan: route.params.rujukan,
  noKP: "901231012345",
  nama: "Ahmad bin Abdullah",
  jantina: "Lelaki",
  bangsa: "Melayu",
  agama: "Islam",
  emel: "ahmad.abdullah@email.com",
  telefon: "0123456789",
  alamatRumah: "No. 123, Jalan Utama, Taman Seri Indah",
  poskod: "50000",
  bandar: "Kuala Lumpur",
  negeri: "Kuala Lumpur",
  kategoriPenolongAmil: "Fitrah",
  jawatan: "Penolong Amil Fitrah",
  institusiKariah: "Masjid Wilayah Persekutuan",
  sesiPerkhidmatan: "Sesi 1",
  statusPendaftaran: "Disahkan Jabatan",
  statusLantikan: "Menunggu",
  salinanKadPengenalan: "salinan_kp_ahmad.pdf",
  suratSokongan: "surat_sokongan_ahmad.pdf",
  dokumenLain: null,
  uploadDate: "15/03/2024",
  timeline: [
    {
      action: "Permohonan Dihantar",
      date: "15/03/2024 10:30 AM",
      notes: "Permohonan berjaya dihantar untuk semakan"
    },
    {
      action: "Dokumen Disemak",
      date: "16/03/2024 02:15 PM",
      notes: "Semua dokumen lengkap dan sah"
    },
    {
      action: "Saringan Selesai",
      date: "17/03/2024 09:00 AM",
      notes: "Saringan telah diselesaikan oleh Jabatan Pengurusan Risiko"
    },
    {
      action: "Semakan PT Selesai",
      date: "18/03/2024 11:30 AM",
      notes: "Semakan PT telah diselesaikan"
    },
    {
      action: "Sokongan Eksekutif Selesai",
      date: "19/03/2024 09:00 AM",
      notes: "Sokongan eksekutif telah diberikan"
    },
    {
      action: "Pengesahan Jabatan Selesai",
      date: "20/03/2024 09:00 AM",
      notes: "Pengesahan jabatan telah diselesaikan"
    },
    {
      action: "Menunggu Kelulusan Divisyen",
      date: "21/03/2024 09:00 AM",
      notes: "Permohonan dalam proses kelulusan divisyen"
    }
  ]
});

// Mock approval data
const approvalData = ref({
  statusKelulusan: "Dalam Proses",
  tarikhKelulusan: "",
  diluluskanOleh: "",
  catatanKelulusan: "",
  suratKelulusan: null,
});

// Helper functions
const getStepVariant = (step) => {
  const stepStatus = {
    'registration': 'bg-green-100 text-green-800 border-2 border-green-300',
    'screening': 'bg-green-100 text-green-800 border-2 border-green-300',
    'review': 'bg-green-100 text-green-800 border-2 border-green-300',
    'support': 'bg-green-100 text-green-800 border-2 border-green-300',
    'confirmation': 'bg-green-100 text-green-800 border-2 border-green-300',
    'approval': 'bg-blue-100 text-blue-800 border-2 border-blue-300'
  };
  return stepStatus[step] || 'bg-gray-100 text-gray-400 border-2 border-gray-200';
};

const getStepLineVariant = (step) => {
  const lineStatus = {
    'registration': 'bg-green-300',
    'screening': 'bg-green-300',
    'review': 'bg-green-300',
    'support': 'bg-green-300',
    'confirmation': 'bg-green-300',
    'approval': 'bg-blue-300'
  };
  return lineStatus[step] || 'bg-gray-200';
};

const getStatusPendaftaranVariant = (status) => {
  const statusVariants = {
    Draft: "default",
    Dihantar: "warning",
    "Dalam Semakan": "info",
    Disaring: "info",
    "Disemak PT": "info",
    "Disokong Eksekutif": "success",
    "Disahkan Jabatan": "success",
    "Diluluskan Divisyen": "success",
    Diluluskan: "success",
    Ditolak: "danger",
    Submitted: "warning",
    Pending: "info",
    Approved: "success",
    Rejected: "danger",
  };
  return statusVariants[status] || "default";
};

const getApprovalStatusVariant = (status) => {
  const statusVariants = {
    "Dalam Proses": "warning",
    Lulus: "success",
    "Tidak Lulus": "danger",
  };
  return statusVariants[status] || "default";
};

// Localize status text
const getLocalizedStatus = (status) => {
  const statusMap = {
    'Submitted': 'Dihantar',
    'Pending': 'Menunggu',
    'Approved': 'Diluluskan',
    'Rejected': 'Ditolak',
    'Draft': 'Draf',
    'Dihantar': 'Dihantar',
    'Dalam Semakan': 'Dalam Semakan',
    'Disaring': 'Disaring',
    'Disemak PT': 'Disemak PT',
    'Disokong Eksekutif': 'Disokong Eksekutif',
    'Disahkan Jabatan': 'Disahkan Jabatan',
    'Diluluskan Divisyen': 'Diluluskan Divisyen',
    'Diluluskan': 'Diluluskan',
    'Ditolak': 'Ditolak',
  };
  return statusMap[status] || status;
};

// Action handlers
const handleBack = () => {
  navigateTo("/BF-PA/PP/pra-daftar-v3");
};

const confirmSubmit = async () => {
  showConfirmationModal.value = false;
  await handleSubmit();
};

const handleSubmit = async () => {
  try {
    isSubmitting.value = true;
    
    // Update approval data
    approvalData.value = {
      ...approvalData.value,
      ...approvalForm.value,
      statusKelulusan: approvalForm.value.statusKelulusan,
      tarikhKelulusan: approvalForm.value.tarikhKelulusan,
      diluluskanOleh: approvalForm.value.diluluskanOleh,
    };
    
    // Show success toast notification
    $swal({
      title: "Berjaya!",
      text: `Keputusan kelulusan divisyen berjaya dihantar. Status: ${approvalForm.value.statusKelulusan}`,
      icon: "success",
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
    });
    
    // Navigate back to dashboard after a short delay
    setTimeout(() => {
      navigateTo("/BF-PA/PP/pra-daftar-v3");
    }, 1500);
    
  } catch (error) {
    $swal({
      title: "Ralat!",
      text: "Ralat berlaku semasa menghantar kelulusan divisyen",
      icon: "error",
    });
  } finally {
    isSubmitting.value = false;
  }
};

const handleSuccessConfirm = () => {
  showSuccessModal.value = false;
  navigateTo("/BF-PA/PP/pra-daftar-v3");
};

const retrySubmission = () => {
  showErrorModal.value = false;
  // Retry the submission
  handleSubmit();
};

const previewDocument = (documentType) => {
  // Simulate document preview with proper error handling
  try {
    const documentName = application.value[documentType];
    if (!documentName) {
      throw new Error("Dokumen tidak ditemui");
    }
    
    // In real implementation, this would open a document viewer
    alert(`Melihat dokumen: ${documentName}`);
  } catch (error) {
    alert(`Ralat: ${error.message}`);
  }
};

// Initialize form with current date and user
onMounted(() => {
  // Auto-fill the form with current user and date
  approvalForm.value.tarikhKelulusan = new Date().toISOString().split('T')[0];
  approvalForm.value.diluluskanOleh = currentUser.value.name;
  
  // In real implementation, fetch application and approval data based on rujukan
  console.log("Loading division head approval details for:", route.params.rujukan);
});
</script>

<style scoped>
/* Custom styles for RTMF compliance */
.formkit-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.formkit-input.error {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}
</style> 