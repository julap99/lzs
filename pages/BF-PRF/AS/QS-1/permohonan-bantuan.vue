<script setup>
definePageMeta({
  title: "Permohonan Bantuan",
  breadcrumb: [
    {
      name: "Pendaftaran Pantas",
      path: "/QS-1",
    },
    {
      name: "Permohonan Bantuan",
      type: "current",
    },
  ],
});

// Check if we have profile data from previous steps
const selectedProfile = ref(null);
const newProfile = ref(null);
const router = useRouter();

// Form data
const formData = ref({
  nama: "",
  noKp: "",
  tarikhPermohonan: new Date().toISOString().split("T")[0],
  jenisBantuan: "",
  keteranganPermohonan: "",
  jumlahDimohon: "",
  catatanEkp: "",
  dokumenSokongan: [],
});

// Form validation state
const errors = ref({});
const isSubmitting = ref(false);
const showSuccessAlert = ref(false);

// Assistance types based on URS requirements
const jenisBantuanOptions = [
  { value: "fakir", label: "Bantuan Kecemasan - Fakir" },
  { value: "miskin", label: "Bantuan Kecemasan - Miskin" },
  { value: "muallaf", label: "Bantuan Kecemasan - Muallaf" },
  { value: "gharimin", label: "Bantuan Kecemasan - Gharimin" },
];

onMounted(() => {
  // Get profile data from localStorage
  const storedProfile = localStorage.getItem("selectedProfile");
  const storedNewProfile = localStorage.getItem("newProfile");

  if (storedProfile) {
    selectedProfile.value = JSON.parse(storedProfile);
  }

  if (storedNewProfile) {
    newProfile.value = JSON.parse(storedNewProfile);
  }

  // Check if we have profile data, if not redirect to profile search
  if (!selectedProfile.value && !newProfile.value) {
    router.push("/BF-PRF/AS/QS-1/carian-profil");
    return;
  }

  // Populate readonly fields from profile data
  const profile = selectedProfile.value || newProfile.value;
  formData.value.nama = profile.nama || profile.personalInfo?.nama || "";
  formData.value.noKp = profile.noKp || profile.personalInfo?.noKp || "";
});

const currentProfile = computed(() => {
  return selectedProfile.value || newProfile.value;
});

// Form validation
const validateForm = () => {
  errors.value = {};

  if (!formData.value.jenisBantuan) {
    errors.value.jenisBantuan = "Sila pilih jenis bantuan";
  }

  if (!formData.value.keteranganPermohonan.trim()) {
    errors.value.keteranganPermohonan = "Sila masukkan keterangan permohonan";
  }

  if (!formData.value.jumlahDimohon || formData.value.jumlahDimohon <= 0) {
    errors.value.jumlahDimohon = "Sila masukkan jumlah yang sah";
  }

  if (formData.value.jumlahDimohon > 5000) {
    errors.value.jumlahDimohon = "Jumlah maksimum adalah RM 5,000";
  }

  return Object.keys(errors.value).length === 0;
};

// Handle file upload
const handleFileUpload = (event) => {
  const files = event.target.files;
  const fileList = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const reader = new FileReader();
    reader.onload = (e) => {
      fileList.push({
        name: file.name,
        size: file.size,
        type: file.type,
        url: e.target.result,
      });
    };
    reader.readAsDataURL(file);
  }
  formData.value.dokumenSokongan = fileList;
};

// Submit form
const submitForm = async () => {
  if (!validateForm()) {
    // Focus on first error
    const firstErrorField = Object.keys(errors.value)[0];
    const element = document.querySelector(`[name="${firstErrorField}"]`);
    if (element) {
      element.focus();
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    return;
  }

  isSubmitting.value = true;

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Generate application ID
    const applicationId = `APP-${Date.now().toString().slice(-6)}`;

    // Store application data
    const applicationData = {
      ...formData.value,
      applicationId,
      profileData: currentProfile.value,
      status: "Dalam Siasatan",
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem("currentApplication", JSON.stringify(applicationData));

    showSuccessAlert.value = true;

    // Auto redirect after 3 seconds
    // setTimeout(() => {
    //   router.push('/BF-PRF/AS/QS-1')
    // }, 3000)
  } catch (error) {
    console.error("Error submitting application:", error);
  } finally {
    isSubmitting.value = false;
  }
};

// Auto-save draft functionality
const saveDraft = () => {
  const draftData = {
    ...formData.value,
    lastSaved: new Date().toISOString(),
  };
  localStorage.setItem("applicationDraft", JSON.stringify(draftData));

  // Show toast notification
  const toast = document.createElement("div");
  toast.className = "nas-toast-notification";
  toast.textContent = "Draf disimpan secara automatik";
  document.body.appendChild(toast);

  setTimeout(() => {
    if (document.body.contains(toast)) {
      document.body.removeChild(toast);
    }
  }, 3000);
};

// Auto-save on blur
const autoSave = debounce(saveDraft, 30000);

// Load draft on mount
onMounted(() => {
  const draft = localStorage.getItem("applicationDraft");
  if (draft) {
    const draftData = JSON.parse(draft);
    // Only load draft if it's recent (within 24 hours)
    const draftAge = Date.now() - new Date(draftData.lastSaved).getTime();
    if (draftAge < 24 * 60 * 60 * 1000) {
      Object.assign(formData.value, draftData);
    }
  }
});

// Debounce utility
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Navigate to interview page
const goToInterview = () => {
  router.push("/BF-PRF/AS/QS-1/temubual-ekp");
};
</script>

<template>
  <div>
    <!-- Success Alert -->
    <RsAlert
      v-if="showSuccessAlert"
      type="success"
      class="nas-success-alert"
      dismissible
    >
      <template #icon>
        <Icon name="heroicons:check-circle" />
      </template>
      <div>
        <h3 class="nas-alert-title">Permohonan Berjaya Dihantar</h3>
        <p class="nas-alert-description">
          Permohonan bantuan telah berjaya dihantar untuk siasatan. EKP boleh
          meneruskan dengan temubual atau kembali ke halaman utama.
        </p>
        <div class="nas-alert-actions">
          <RsButton variant="primary" size="sm" @click="goToInterview">
            <Icon
              name="heroicons:chat-bubble-left-right"
              class="nas-button-icon-left"
            />
            Mula Temubual EKP
          </RsButton>
          <RsButton
            variant="outline"
            size="sm"
            @click="router.push('/BF-PRF/AS/QS-1')"
          >
            <Icon name="heroicons:home" class="nas-button-icon-left" />
            Kembali ke Halaman Utama
          </RsButton>
        </div>
      </div>
    </RsAlert>

    <!-- Page Header following Typography Standards -->
    <div class="nas-page-header">
      <div class="nas-header-content">
        <div class="nas-header-icon">
          <Icon name="heroicons:document-text" class="nas-icon-primary" />
        </div>
        <div class="nas-header-text">
          <h1 class="nas-page-title">Borang Permohonan Bantuan</h1>
          <p class="nas-page-description">
            Mohon bantuan kecemasan untuk asnaf yang layak
          </p>
        </div>
      </div>
    </div>

    <!-- Profile Summary Card -->
    <RsCard class="nas-profile-card">
      <template #header>
        <div class="nas-card-header">
          <Icon name="heroicons:user-circle" class="nas-icon-header" />
          <h2 class="nas-section-header">Maklumat Pemohon</h2>
        </div>
      </template>

      <div class="nas-card-body">
        <div v-if="currentProfile" class="nas-profile-summary">
          <div class="nas-profile-grid">
            <div class="nas-profile-field">
              <span class="nas-field-meta">Nama Pemohon:</span>
              <span class="nas-field-value">{{
                currentProfile.nama || currentProfile.personalInfo?.nama
              }}</span>
            </div>
            <div class="nas-profile-field">
              <span class="nas-field-meta">No. Kad Pengenalan:</span>
              <span class="nas-field-value nas-mono">{{
                currentProfile.noKp || currentProfile.personalInfo?.noKp
              }}</span>
            </div>
            <div class="nas-profile-field">
              <span class="nas-field-meta">Tarikh Permohonan:</span>
              <span class="nas-field-value">{{
                new Date().toLocaleDateString("ms-MY")
              }}</span>
            </div>
            <div v-if="currentProfile.profileId" class="nas-profile-field">
              <span class="nas-field-meta">ID Profil:</span>
              <span class="nas-field-value">{{
                currentProfile.profileId
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </RsCard>

    <!-- Application Form -->
    <RsCard class="nas-form-card">
      <template #header>
        <div class="nas-card-header">
          <Icon name="heroicons:document-plus" class="nas-icon-header" />
          <h2 class="nas-section-header">Butiran Permohonan Bantuan</h2>
        </div>
      </template>

      <div class="nas-card-body">
        <form @submit.prevent="submitForm" class="nas-form">
          <!-- Jenis Bantuan Group -->
          <RsFieldset>
            <template #legend>
              <h3 class="nas-subsection-header">
                Jenis Bantuan <span class="nas-required">*</span>
              </h3>
            </template>

            <div class="nas-field-group">
              <FormKit
                type="select"
                name="jenisBantuan"
                label="Jenis Bantuan"
                v-model="formData.jenisBantuan"
                :options="jenisBantuanOptions"
                placeholder="Sila pilih jenis bantuan"
                :validation-visibility="errors.jenisBantuan ? 'live' : 'blur'"
                :validation-messages="{ required: errors.jenisBantuan }"
                help="Pilih kategori bantuan kecemasan yang sesuai dengan keperluan"
                @blur="autoSave"
              />
            </div>
          </RsFieldset>

          <!-- Keterangan Permohonan Group -->
          <RsFieldset>
            <template #legend>
              <h3 class="nas-subsection-header">
                Keterangan Permohonan <span class="nas-required">*</span>
              </h3>
            </template>

            <div class="nas-field-group">
              <FormKit
                type="textarea"
                name="keteranganPermohonan"
                label="Keterangan Permohonan"
                v-model="formData.keteranganPermohonan"
                placeholder="Nyatakan dengan terperinci keperluan dan sebab permohonan bantuan..."
                rows="5"
                maxlength="1000"
                :validation-visibility="
                  errors.keteranganPermohonan ? 'live' : 'blur'
                "
                :validation-messages="{ required: errors.keteranganPermohonan }"
                help="Berikan maklumat terperinci tentang keperluan bantuan (maksimum 1000 aksara)"
                @blur="autoSave"
              />
              <div class="nas-char-counter">
                {{ formData.keteranganPermohonan.length }}/1000 aksara
              </div>
            </div>
          </RsFieldset>

          <!-- Jumlah Bantuan Group -->
          <RsFieldset>
            <template #legend>
              <h3 class="nas-subsection-header">
                Jumlah Bantuan Dimohon <span class="nas-required">*</span>
              </h3>
            </template>

            <div class="nas-field-group">
              <div class="nas-amount-input">
                <span class="nas-currency-prefix">RM</span>
                <FormKit
                  type="number"
                  name="jumlahDimohon"
                  label="Jumlah Bantuan Dimohon"
                  v-model="formData.jumlahDimohon"
                  placeholder="0.00"
                  min="1"
                  max="5000"
                  step="1"
                  :validation-visibility="
                    errors.jumlahDimohon ? 'live' : 'blur'
                  "
                  :validation-messages="{ required: errors.jumlahDimohon }"
                  help="Masukkan jumlah bantuan yang diperlukan (Maksimum: RM 5,000)"
                  @blur="autoSave"
                />
              </div>
            </div>
          </RsFieldset>

          <!-- Catatan EKP Group -->
          <RsFieldset>
            <template #legend>
              <h3 class="nas-subsection-header">Catatan EKP</h3>
            </template>

            <div class="nas-field-group">
              <FormKit
                type="textarea"
                name="catatanEkp"
                label="Catatan EKP"
                v-model="formData.catatanEkp"
                placeholder="Catatan tambahan dari EKP (jika ada)..."
                rows="3"
                maxlength="500"
                help="Catatan tambahan atau pemerhatian dari EKP semasa proses permohonan"
                @blur="autoSave"
              />
              <div class="nas-char-counter">
                {{ formData.catatanEkp.length }}/500 aksara
              </div>
            </div>
          </RsFieldset>

          <!-- Dokumen Sokongan Group -->
          <RsFieldset>
            <template #legend>
              <h3 class="nas-subsection-header">Dokumen Sokongan</h3>
            </template>

            <div class="nas-field-group">
              <FormKit
                type="file"
                name="dokumenSokongan"
                label="Dokumen Sokongan"
                v-model="formData.dokumenSokongan"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                help="Muat naik dokumen sokongan seperti bil elektrik, slip ubat, laporan perubatan, dsb. (Format: PDF, JPG, JPEG, PNG)"
                @change="handleFileUpload"
              />
              <div class="nas-file-help">
                <Icon
                  name="heroicons:information-circle"
                  class="nas-info-icon"
                />
                <span class="nas-help-text"
                  >Maksimum 5 fail, 5MB setiap fail</span
                >
              </div>
            </div>
          </RsFieldset>
        </form>
      </div>

      <!-- Form Footer with Actions -->
      <div class="nas-form-footer">
        <div class="nas-footer-actions">
          <RsButton
            variant="outline"
            size="lg"
            @click="saveDraft"
            :disabled="isSubmitting"
          >
            <Icon
              name="heroicons:document-duplicate"
              class="nas-button-icon-left"
            />
            Simpan Draf
          </RsButton>

          <RsButton
            type="submit"
            variant="primary"
            size="lg"
            @click="submitForm"
            :disabled="isSubmitting"
            :loading="isSubmitting"
          >
            <Icon
              name="heroicons:paper-airplane"
              class="nas-button-icon-left"
            />
            {{ isSubmitting ? "Menghantar..." : "Hantar untuk Siasatan" }}
          </RsButton>
        </div>
      </div>
    </RsCard>

    <!-- Help Section -->
    <RsCard class="nas-help-card">
      <div class="nas-help-content">
        <Icon name="heroicons:information-circle" class="nas-help-icon" />
        <div class="nas-help-text">
          <h3 class="nas-help-title">Panduan Permohonan</h3>
          <ul class="nas-help-list">
            <li>
              Pastikan semua maklumat yang diperlukan diisi dengan lengkap dan
              tepat
            </li>
            <li>Keterangan permohonan hendaklah jelas dan terperinci</li>
            <li>
              Muat naik dokumen sokongan yang berkaitan untuk mempercepatkan
              proses
            </li>
            <li>
              Permohonan akan disemak oleh EKP dalam tempoh 1-2 hari bekerja
            </li>
          </ul>
        </div>
      </div>
    </RsCard>
  </div>
</template>

<style scoped>
/* NAS Design System - Following UI/UX Design Specifications v0.2 */

/* Grid Layout - 12 column system with 24px margins */

/* Typography Hierarchy */
.nas-page-title {
  font-size: 24px;
  font-weight: 700; /* bold */
  color: #1f2937;
  margin-bottom: 4px;
  line-height: 1.5;
}

.nas-section-header {
  font-size: 20px;
  font-weight: 600; /* semibold */
  color: #374151;
  line-height: 1.5;
}

.nas-subsection-header {
  font-size: 16px !important;
  font-weight: 600 !important; /* semibold */
  color: #374151 !important;
  margin-bottom: 16px !important;
  margin-top: 8px !important;
  line-height: 1.5 !important;
  padding-bottom: 8px !important;
  border-bottom: 1px solid #e5e7eb !important;
  display: block !important;
  background-color: #f9fafb !important;
  padding: 8px 0 8px 0 !important;
  border-radius: 4px !important;
}

.nas-body-text {
  font-size: 14px;
  font-weight: 400; /* regular */
  color: #374151;
  line-height: 1.5;
}

.nas-page-description {
  font-size: 14px;
  font-weight: 400;
  color: #6b7280;
  line-height: 1.5;
}

/* Required Field Indicator */
.nas-required {
  color: #dc2626; /* Red for required fields */
  margin-left: 2px;
}

/* LZS Corporate Color Schema */
.nas-page-header {
  margin-bottom: 32px; /* 24px + 8px for visual spacing */
}

.nas-header-content {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.nas-header-icon {
  width: 48px;
  height: 48px;
  background-color: rgba(
    141,
    199,
    61,
    0.1
  ); /* Secondary Green with 10% opacity */
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
}

.nas-icon-primary {
  width: 24px;
  height: 24px;
  color: #8dc73d; /* LZS Secondary Green */
}

/* Card Design Standards */
.nas-profile-card,
.nas-form-card,
.nas-help-card {
  margin-bottom: 24px;
}

.nas-profile-card {
  border-left: 4px solid #005aad; /* LZS Primary Blue */
}

.nas-form-card {
  border-left: 4px solid #8dc73d; /* LZS Secondary Green */
}

.nas-help-card {
  border-left: 4px solid #fff200; /* LZS Accent Yellow */
  background-color: #fffbeb;
}

.nas-card-header {
  display: flex;
  align-items: center;
  padding: 24px 24px 0 24px;
}

.nas-icon-header {
  width: 24px;
  height: 24px;
  color: #005aad; /* LZS Primary Blue */
  margin-right: 8px;
}

.nas-card-body {
  padding: 24px;
}

/* Profile Summary */
.nas-profile-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

@media (max-width: 768px) {
  .nas-profile-grid {
    grid-template-columns: 1fr;
  }
}

.nas-profile-field {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  padding: 12px;
  background-color: #f9fafb;
  border-radius: 6px;
}

.nas-field-meta {
  color: #6b7280;
  font-weight: 400;
  min-width: 120px;
}

.nas-field-value {
  color: #1f2937;
  font-weight: 600;
}

.nas-mono {
  font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
}

/* Form Styling */
.nas-form {
  display: flex;
  flex-direction: column;
  gap: 32px; /* 32px spacing between field groups */
}

.nas-field-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* Amount Input Styling */
.nas-amount-input {
  position: relative;
  display: flex;
  align-items: center;
}

.nas-currency-prefix {
  position: absolute;
  left: 12px;
  top: 46%;
  transform: translateY(-50%);
  color: #6b7280;
  font-weight: 600;
  z-index: 10;
  pointer-events: none;
}

.nas-amount-input :deep(.formkit-wrapper) {
  position: relative;
  width: 100%;
}

.nas-amount-input :deep(.formkit-input) {
  padding-left: 40px !important;
}

.nas-amount-input :deep(input) {
  padding-left: 40px !important;
}

/* Character Counter */
.nas-char-counter {
  font-size: 12px;
  color: #6b7280;
  text-align: right;
  margin-top: 4px;
}

/* File Upload Help */
.nas-file-help {
  display: flex;
  align-items: center;
  margin-top: 8px;
  padding: 8px 12px;
  background-color: #eff6ff;
  border-radius: 6px;
  border: 1px solid #bfdbfe;
}

.nas-info-icon {
  width: 16px;
  height: 16px;
  color: #2563eb;
  margin-right: 6px;
  flex-shrink: 0;
}

.nas-file-help .nas-help-text {
  font-size: 12px;
  color: #1e40af;
  font-weight: 500;
}

/* Form Footer */
.nas-form-footer {
  border-top: 1px solid #e5e7eb;
  background-color: #f9fafb;
  padding: 24px;
  margin-top: 0;
}

.nas-footer-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

@media (max-width: 640px) {
  .nas-footer-actions {
    flex-direction: column;
    width: 100%;
  }

  .nas-footer-actions button {
    width: 100%;
  }
}

/* Button Icons */
.nas-button-icon-left {
  width: 20px;
  height: 20px;
  margin-right: 8px;
}

/* Help Section */
.nas-help-content {
  display: flex;
  align-items: flex-start;
  padding: 16px;
}

.nas-help-icon {
  width: 24px;
  height: 24px;
  color: #f59e0b; /* Amber/Yellow */
  margin-right: 12px;
  margin-top: 2px;
  flex-shrink: 0;
}

.nas-help-text {
  flex: 1;
}

.nas-help-title {
  font-size: 16px;
  font-weight: 600;
  color: #92400e;
  margin-bottom: 8px;
  line-height: 1.5;
}

.nas-help-list {
  margin: 0;
  padding-left: 16px;
  color: #92400e;
  font-size: 14px;
  line-height: 1.6;
}

.nas-help-list li {
  margin-bottom: 4px;
}

/* Success Alert */
.nas-success-alert {
  margin-bottom: 24px;
}

.nas-alert-title {
  font-size: 16px;
  font-weight: 600;
  color: #065f46;
  margin-bottom: 4px;
}

.nas-alert-description {
  font-size: 14px;
  color: #065f46;
  margin: 0 0 16px 0;
}

.nas-alert-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

@media (max-width: 640px) {
  .nas-alert-actions {
    flex-direction: column;
  }

  .nas-alert-actions button {
    width: 100%;
  }
}

/* Toast Notification */
.nas-toast-notification {
  position: fixed;
  bottom: 24px;
  right: 24px;
  background-color: #10b981;
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Error States */
:deep(.formkit-invalid) {
  border-color: #dc2626 !important;
}

:deep(.formkit-message) {
  color: #dc2626;
  font-size: 12px;
  margin-top: 4px;
}

/* Focus States */
:deep(.formkit-input:focus) {
  border-color: #005aad !important;
  box-shadow: 0 0 0 3px rgba(0, 90, 173, 0.1) !important;
}

/* Responsive Design */
@media (max-width: 640px) {
  .nas-header-content {
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
  }

  .nas-header-icon {
    margin-right: 0;
    margin-bottom: 12px;
  }
}

/* Target legend elements specifically */
:deep(legend .nas-subsection-header) {
  font-size: 16px !important;
  font-weight: 600 !important;
  color: #374151 !important;
  margin-bottom: 16px !important;
  margin-top: 8px !important;
  line-height: 1.5 !important;
  padding: 8px 12px !important;
  border-bottom: 1px solid #e5e7eb !important;
  display: block !important;
  background-color: #f9fafb !important;
  border-radius: 4px !important;
  width: 100% !important;
}

/* Target RsFieldset legend */
:deep(.rs-fieldset legend) {
  width: 100% !important;
  padding: 0 !important;
  margin-bottom: 16px !important;
}

:deep(.rs-fieldset legend h3) {
  font-size: 16px !important;
  font-weight: 600 !important;
  color: #374151 !important;
  margin: 0 !important;
  padding: 8px 12px !important;
  background-color: #f9fafb !important;
  border-radius: 4px !important;
  border-bottom: 1px solid #e5e7eb !important;
}

/* Generic legend targeting */
:deep(legend) {
  color: #374151 !important;
  font-size: 16px !important;
  font-weight: 600 !important;
}

:deep(fieldset legend h3) {
  font-size: 16px !important;
  font-weight: 600 !important;
  color: #374151 !important;
  margin: 0 !important;
  padding: 8px 12px !important;
  background-color: #f9fafb !important;
  border-radius: 4px !important;
  border-bottom: 1px solid #e5e7eb !important;
  display: block !important;
}
</style>
