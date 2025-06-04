<script setup>
definePageMeta({
  title: "Temubual EKP",
  breadcrumb: [
    {
      name: "Pendaftaran Pantas",
      path: "/QS-1",
    },
    {
      name: "Temubual EKP",
      type: "current",
    },
  ],
});

const router = useRouter();

// Get application data
const applicationData = ref(null);
const applicantProfile = ref(null);

// Interview form data
const interviewData = ref({
  // Checkbox questionnaire
  questionnaire: {
    tinggalSelangor: null,
    statusPerkahwinan: null,
    adaTanggungan: null,
    masihBekerja: null,
    pasanganBekerja: null,
    statusKesihatanDiri: null,
    statusKesihatanPasangan: null,
    rumahSewa: null,
    keperluanMendesak: null,
  },
  // Recommendation
  syorBantuan: null,
  jenisBantuan: "",
  jumlahDicadangkan: "",
  catatan: "",
  dokumenTambahan: [],
});

// Form validation
const errors = ref({});
const isSubmitting = ref(false);
const showSuccessAlert = ref(false);

// Assistance types
const jenisBantuanOptions = [
  { value: "fakir", label: "Bantuan Kecemasan - Fakir" },
  { value: "miskin", label: "Bantuan Kecemasan - Miskin" },
  { value: "muallaf", label: "Bantuan Kecemasan - Muallaf" },
  { value: "gharimin", label: "Bantuan Kecemasan - Gharimin" },
];

onMounted(() => {
  // Get application data from localStorage
  const storedApplication = localStorage.getItem("currentApplication");
  if (storedApplication) {
    applicationData.value = JSON.parse(storedApplication);
    applicantProfile.value = applicationData.value.profileData;

    // Pre-fill form with application data
    interviewData.value.jenisBantuan = applicationData.value.jenisBantuan;
    interviewData.value.jumlahDicadangkan = applicationData.value.jumlahDimohon;
  } else {
    // Redirect if no application data
    router.push("/BF-PRF/AS/QS-1");
  }
});

// Form validation
const validateForm = () => {
  errors.value = {};

  // Check if questionnaire is completed
  const questionnaire = interviewData.value.questionnaire;
  const incompleteQuestions = Object.keys(questionnaire).filter(
    (key) => questionnaire[key] === null || questionnaire[key] === undefined
  );

  if (incompleteQuestions.length > 0) {
    errors.value.questionnaire = "Sila lengkapkan semua soalan dalam temubual";
  }

  if (interviewData.value.syorBantuan === null) {
    errors.value.syorBantuan =
      "Sila buat syor sama ada meluluskan atau menolak bantuan";
  }

  if (interviewData.value.syorBantuan === "ya") {
    if (!interviewData.value.jenisBantuan) {
      errors.value.jenisBantuan = "Sila pilih jenis bantuan";
    }

    if (
      !interviewData.value.jumlahDicadangkan ||
      interviewData.value.jumlahDicadangkan <= 0
    ) {
      errors.value.jumlahDicadangkan = "Sila masukkan jumlah yang sah";
    }

    if (interviewData.value.jumlahDicadangkan > 5000) {
      errors.value.jumlahDicadangkan = "Jumlah maksimum adalah RM 5,000";
    }
  }

  return Object.keys(errors.value).length === 0;
};

// Submit interview
const submitInterview = async () => {
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

    // Update application data with interview results
    const updatedApplication = {
      ...applicationData.value,
      interviewData: interviewData.value,
      status: "Menunggu Kelulusan",
      interviewCompletedAt: new Date().toISOString(),
      interviewBy: "EKP-001", // This would come from logged-in user
    };

    localStorage.setItem(
      "currentApplication",
      JSON.stringify(updatedApplication)
    );

    showSuccessAlert.value = true;

    // Auto redirect after 3 seconds to Phase 4: PKP Approval
    setTimeout(() => {
      router.push("/BF-PRF/AS/QS-1/kelulusan-pkp");
    }, 3000);
  } catch (error) {
    console.error("Error submitting interview:", error);
  } finally {
    isSubmitting.value = false;
  }
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
  interviewData.value.dokumenTambahan = fileList;
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
        <h3 class="nas-alert-title">Temubual Berjaya Diselesaikan</h3>
        <p class="nas-alert-description">
          Temubual EKP telah berjaya diselesaikan. Permohonan kini dalam status
          'Menunggu Kelulusan' oleh PKP.
        </p>
      </div>
    </RsAlert>

    <!-- Page Header -->
    <div class="nas-page-header">
      <div class="nas-header-content">
        <div class="nas-header-icon">
          <Icon
            name="heroicons:chat-bubble-left-right"
            class="nas-icon-primary"
          />
        </div>
        <div class="nas-header-text">
          <h1 class="nas-page-title">Temubual EKP (Bancian/Siasatan Lisan)</h1>
          <p class="nas-page-description">
            Sahkan maklumat pemohon dan buat cadangan bantuan
          </p>
        </div>
      </div>
    </div>

    <!-- Dual-pane Layout -->
    <div class="nas-dual-pane">
      <!-- Left Pane: Applicant Information -->
      <div class="nas-left-pane">
        <RsCard class="nas-info-card">
          <template #header>
            <div class="nas-card-header">
              <Icon name="heroicons:user-circle" class="nas-icon-header" />
              <h2 class="nas-section-header">Maklumat Pemohon</h2>
            </div>
          </template>

          <div class="nas-card-body">
            <div v-if="applicantProfile" class="nas-profile-section">
              <!-- Personal Information -->
              <div class="nas-info-group">
                <h3 class="nas-group-title">Maklumat Peribadi</h3>
                <div class="nas-info-grid">
                  <div class="nas-info-field">
                    <span class="nas-field-label">Nama:</span>
                    <span class="nas-field-value">{{
                      applicantProfile.nama ||
                      applicantProfile.personalInfo?.nama
                    }}</span>
                  </div>
                  <div class="nas-info-field">
                    <span class="nas-field-label">No. KP:</span>
                    <span class="nas-field-value nas-mono">{{
                      applicantProfile.noKp ||
                      applicantProfile.personalInfo?.noKp
                    }}</span>
                  </div>
                  <div class="nas-info-field">
                    <span class="nas-field-label">Jantina:</span>
                    <span class="nas-field-value">{{
                      applicantProfile.personalInfo?.jantina ||
                      "Tidak dinyatakan"
                    }}</span>
                  </div>
                  <div class="nas-info-field">
                    <span class="nas-field-label">Status Perkahwinan:</span>
                    <span class="nas-field-value">{{
                      applicantProfile.personalInfo?.statusPerkahwinan ||
                      "Tidak dinyatakan"
                    }}</span>
                  </div>
                </div>
              </div>

              <!-- Application Details -->
              <div class="nas-info-group" v-if="applicationData">
                <h3 class="nas-group-title">Butiran Permohonan</h3>
                <div class="nas-info-grid">
                  <div class="nas-info-field">
                    <span class="nas-field-label">ID Permohonan:</span>
                    <span class="nas-field-value nas-mono">{{
                      applicationData.applicationId
                    }}</span>
                  </div>
                  <div class="nas-info-field">
                    <span class="nas-field-label">Jenis Bantuan:</span>
                    <span class="nas-field-value">{{
                      applicationData.jenisBantuan
                    }}</span>
                  </div>
                  <div class="nas-info-field">
                    <span class="nas-field-label">Jumlah Dimohon:</span>
                    <span class="nas-field-value"
                      >RM {{ applicationData.jumlahDimohon }}</span
                    >
                  </div>
                  <div class="nas-info-field">
                    <span class="nas-field-label">Status:</span>
                    <RsBadge variant="warning">{{
                      applicationData.status
                    }}</RsBadge>
                  </div>
                </div>
              </div>

              <!-- Application Description -->
              <div
                class="nas-info-group"
                v-if="applicationData?.keteranganPermohonan"
              >
                <h3 class="nas-group-title">Keterangan Permohonan</h3>
                <div class="nas-description-box">
                  <p class="nas-description-text">
                    {{ applicationData.keteranganPermohonan }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </RsCard>
      </div>

      <!-- Right Pane: Interview Form -->
      <div class="nas-right-pane">
        <RsCard class="nas-form-card">
          <template #header>
            <div class="nas-card-header">
              <Icon
                name="heroicons:clipboard-document-check"
                class="nas-icon-header"
              />
              <h2 class="nas-section-header">Borang Temubual EKP</h2>
            </div>
          </template>

          <div class="nas-card-body">
            <form @submit.prevent="submitInterview" class="nas-interview-form">
              <!-- Questionnaire Section -->
              <RsFieldset>
                <template #legend>
                  <h3 class="nas-subsection-header">
                    Soal Selidik <span class="nas-required">*</span>
                  </h3>
                </template>

                <div class="nas-questionnaire">
                  <!-- Question 1 -->
                  <div class="nas-question">
                    <label class="nas-question-label"
                      >Tinggal di Selangor?</label
                    >
                    <div class="nas-radio-group">
                      <FormKit
                        type="radio"
                        name="tinggalSelangor"
                        v-model="interviewData.questionnaire.tinggalSelangor"
                        :options="[
                          { label: 'Ya', value: 'ya' },
                          { label: 'Tidak', value: 'tidak' },
                        ]"
                      />
                    </div>
                  </div>

                  <!-- Question 2 -->
                  <div class="nas-question">
                    <label class="nas-question-label"
                      >Status perkahwinan?</label
                    >
                    <div class="nas-radio-group">
                      <FormKit
                        type="radio"
                        name="statusPerkahwinan"
                        v-model="interviewData.questionnaire.statusPerkahwinan"
                        :options="[
                          { label: 'Bujang', value: 'bujang' },
                          { label: 'Berkahwin', value: 'berkahwin' },
                          { label: 'Duda/Janda', value: 'duda_janda' },
                        ]"
                      />
                    </div>
                  </div>

                  <!-- Question 3 -->
                  <div class="nas-question">
                    <label class="nas-question-label">Ada tanggungan?</label>
                    <div class="nas-radio-group">
                      <FormKit
                        type="radio"
                        name="adaTanggungan"
                        v-model="interviewData.questionnaire.adaTanggungan"
                        :options="[
                          { label: 'Ya', value: 'ya' },
                          { label: 'Tidak', value: 'tidak' },
                        ]"
                      />
                    </div>
                  </div>

                  <!-- Question 4 -->
                  <div class="nas-question">
                    <label class="nas-question-label">Masih bekerja?</label>
                    <div class="nas-radio-group">
                      <FormKit
                        type="radio"
                        name="masihBekerja"
                        v-model="interviewData.questionnaire.masihBekerja"
                        :options="[
                          { label: 'Ya', value: 'ya' },
                          { label: 'Tidak', value: 'tidak' },
                        ]"
                      />
                    </div>
                  </div>

                  <!-- Question 5 -->
                  <div class="nas-question">
                    <label class="nas-question-label">Pasangan bekerja?</label>
                    <div class="nas-radio-group">
                      <FormKit
                        type="radio"
                        name="pasanganBekerja"
                        v-model="interviewData.questionnaire.pasanganBekerja"
                        :options="[
                          { label: 'Ya', value: 'ya' },
                          { label: 'Tidak', value: 'tidak' },
                          { label: 'Tiada Pasangan', value: 'tiada' },
                        ]"
                      />
                    </div>
                  </div>

                  <!-- Question 6 -->
                  <div class="nas-question">
                    <label class="nas-question-label"
                      >Status kesihatan diri?</label
                    >
                    <div class="nas-radio-group">
                      <FormKit
                        type="radio"
                        name="statusKesihatanDiri"
                        v-model="
                          interviewData.questionnaire.statusKesihatanDiri
                        "
                        :options="[
                          { label: 'Sihat', value: 'sihat' },
                          { label: 'Sakit', value: 'sakit' },
                          { label: 'OKU', value: 'oku' },
                        ]"
                      />
                    </div>
                  </div>

                  <!-- Question 7 -->
                  <div class="nas-question">
                    <label class="nas-question-label"
                      >Status kesihatan pasangan?</label
                    >
                    <div class="nas-radio-group">
                      <FormKit
                        type="radio"
                        name="statusKesihatanPasangan"
                        v-model="
                          interviewData.questionnaire.statusKesihatanPasangan
                        "
                        :options="[
                          { label: 'Sihat', value: 'sihat' },
                          { label: 'Sakit', value: 'sakit' },
                          { label: 'OKU', value: 'oku' },
                          { label: 'Tiada Pasangan', value: 'tiada' },
                        ]"
                      />
                    </div>
                  </div>

                  <!-- Question 8 -->
                  <div class="nas-question">
                    <label class="nas-question-label"
                      >Rumah sewa / milik?</label
                    >
                    <div class="nas-radio-group">
                      <FormKit
                        type="radio"
                        name="rumahSewa"
                        v-model="interviewData.questionnaire.rumahSewa"
                        :options="[
                          { label: 'Milik', value: 'milik' },
                          { label: 'Sewa', value: 'sewa' },
                          { label: 'Menumpang', value: 'menumpang' },
                        ]"
                      />
                    </div>
                  </div>

                  <!-- Question 9 -->
                  <div class="nas-question">
                    <label class="nas-question-label"
                      >Keperluan mendesak?</label
                    >
                    <div class="nas-radio-group">
                      <FormKit
                        type="radio"
                        name="keperluanMendesak"
                        v-model="interviewData.questionnaire.keperluanMendesak"
                        :options="[
                          { label: 'Ya', value: 'ya' },
                          { label: 'Tidak', value: 'tidak' },
                        ]"
                      />
                    </div>
                  </div>
                </div>
              </RsFieldset>

              <!-- Recommendation Section -->
              <RsFieldset>
                <template #legend>
                  <h3 class="nas-subsection-header">
                    Syor EKP <span class="nas-required">*</span>
                  </h3>
                </template>

                <div class="nas-recommendation">
                  <!-- Recommendation Decision -->
                  <div class="nas-question">
                    <label class="nas-question-label"
                      >Syor Bantuan Kecemasan:</label
                    >
                    <div class="nas-radio-group">
                      <FormKit
                        type="radio"
                        name="syorBantuan"
                        v-model="interviewData.syorBantuan"
                        :options="[
                          { label: 'Ya - Disyorkan', value: 'ya' },
                          { label: 'Tidak - Tidak Disyorkan', value: 'tidak' },
                        ]"
                      />
                    </div>
                  </div>

                  <!-- Conditional Fields for Approval -->
                  <div
                    v-if="interviewData.syorBantuan === 'ya'"
                    class="nas-approval-fields"
                  >
                    <!-- Type of Assistance -->
                    <div class="nas-field-group">
                      <FormKit
                        type="select"
                        name="jenisBantuan"
                        v-model="interviewData.jenisBantuan"
                        :options="jenisBantuanOptions"
                        label="Jenis Bantuan"
                        placeholder="Sila pilih jenis bantuan"
                        help="Pilih kategori bantuan yang sesuai berdasarkan temubual"
                      />
                    </div>

                    <!-- Recommended Amount -->
                    <div class="nas-field-group">
                      <label class="nas-field-label"
                        >Jumlah Dicadangkan
                        <span class="nas-required">*</span></label
                      >
                      <div class="nas-amount-input">
                        <span class="nas-currency-prefix">RM</span>
                        <FormKit
                          type="number"
                          name="jumlahDicadangkan"
                          v-model="interviewData.jumlahDicadangkan"
                          placeholder="0.00"
                          min="1"
                          max="5000"
                          step="1"
                          help="Cadangkan jumlah bantuan berdasarkan keperluan (Maksimum: RM 5,000)"
                        />
                      </div>
                    </div>
                  </div>

                  <!-- Comments -->
                  <div class="nas-field-group">
                    <FormKit
                      type="textarea"
                      name="catatan"
                      v-model="interviewData.catatan"
                      label="Catatan EKP"
                      placeholder="Catatan dan pemerhatian berdasarkan temubual..."
                      rows="4"
                      maxlength="500"
                      help="Catatan tambahan berdasarkan temubual dan pemerhatian EKP"
                    />
                    <div class="nas-char-counter">
                      {{ interviewData.catatan.length }}/500 aksara
                    </div>
                  </div>
                </div>
              </RsFieldset>

              <!-- Additional Documents -->
              <RsFieldset>
                <template #legend>
                  <h3 class="nas-subsection-header">Dokumen Tambahan</h3>
                </template>

                <div class="nas-field-group">
                  <FormKit
                    type="file"
                    name="dokumenTambahan"
                    v-model="interviewData.dokumenTambahan"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    help="Muat naik dokumen tambahan jika diperlukan (Format: PDF, JPG, JPEG, PNG)"
                    @change="handleFileUpload"
                  />
                </div>
              </RsFieldset>
            </form>
          </div>

          <!-- Form Footer -->
          <div class="nas-form-footer">
            <div class="nas-footer-actions">
              <RsButton
                variant="outline"
                size="lg"
                @click="router.back()"
                :disabled="isSubmitting"
              >
                <Icon
                  name="heroicons:arrow-left"
                  class="nas-button-icon-left"
                />
                Kembali
              </RsButton>

              <RsButton
                type="submit"
                variant="primary"
                size="lg"
                @click="submitInterview"
                :disabled="isSubmitting"
                :loading="isSubmitting"
              >
                <Icon
                  name="heroicons:paper-airplane"
                  class="nas-button-icon-left"
                />
                {{ isSubmitting ? "Menghantar..." : "Hantar untuk Kelulusan" }}
              </RsButton>
            </div>
          </div>
        </RsCard>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* NAS Design System - Following UI/UX Design Specifications v0.2 */

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
  font-size: 16px;
  font-weight: 600; /* semibold */
  color: #374151;
  margin-bottom: 16px;
  line-height: 1.5;
}

.nas-page-description {
  font-size: 14px;
  font-weight: 400;
  color: #6b7280;
  line-height: 1.5;
}

.nas-required {
  color: #dc2626;
  margin-left: 2px;
}

/* Page Header */
.nas-page-header {
  margin-bottom: 32px;
}

.nas-header-content {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.nas-header-icon {
  width: 48px;
  height: 48px;
  background-color: rgba(141, 199, 61, 0.1);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
}

.nas-icon-primary {
  width: 24px;
  height: 24px;
  color: #8dc73d;
}

/* Dual-pane Layout */
.nas-dual-pane {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

@media (max-width: 1024px) {
  .nas-dual-pane {
    grid-template-columns: 1fr;
  }
}

.nas-left-pane,
.nas-right-pane {
  min-height: fit-content;
}

/* Card Design */
.nas-info-card {
  border-left: 4px solid #005aad;
  height: fit-content;
  position: sticky;
  top: 24px;
}

.nas-form-card {
  border-left: 4px solid #8dc73d;
}

.nas-card-header {
  display: flex;
  align-items: center;
  padding: 24px 24px 0 24px;
}

.nas-icon-header {
  width: 24px;
  height: 24px;
  color: #005aad;
  margin-right: 8px;
}

.nas-card-body {
  padding: 24px;
}

/* Profile Information */
.nas-profile-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.nas-info-group {
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 16px;
}

.nas-info-group:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.nas-group-title {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.nas-info-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
}

.nas-info-field {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background-color: #f9fafb;
  border-radius: 6px;
  font-size: 14px;
}

.nas-field-label {
  color: #6b7280;
  font-weight: 400;
  flex-shrink: 0;
}

.nas-field-value {
  color: #1f2937;
  font-weight: 600;
  text-align: right;
}

.nas-mono {
  font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
}

.nas-description-box {
  background-color: #f9fafb;
  border-radius: 8px;
  padding: 16px;
}

.nas-description-text {
  font-size: 14px;
  color: #374151;
  line-height: 1.6;
  margin: 0;
}

/* Interview Form */
.nas-interview-form {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* Questionnaire */
.nas-questionnaire {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.nas-question {
  background-color: #f9fafb;
  border-radius: 8px;
  padding: 16px;
  border-left: 3px solid #e5e7eb;
}

.nas-question-label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 12px;
  display: block;
}

.nas-radio-group {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

/* Recommendation Section */
.nas-recommendation {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.nas-approval-fields {
  background-color: #eff6ff;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #bfdbfe;
}

.nas-field-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.nas-field-group:last-child {
  margin-bottom: 0;
}

.nas-field-label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

/* Amount Input */
.nas-amount-input {
  position: relative;
  display: flex;
  align-items: center;
}

.nas-currency-prefix {
  position: absolute;
  left: 12px;
  top: 27%;
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

/* Success Alert */
.nas-success-alert {
  margin-bottom: 24px;
}

.nas-alert-title {
  font-size: 16px;
  font-weight: 600;
  color: #047857;
  margin-bottom: 4px;
}

.nas-alert-description {
  font-size: 14px;
  color: #047857;
  margin: 0;
}

/* Focus States */
:deep(.formkit-input:focus) {
  border-color: #005aad !important;
  box-shadow: 0 0 0 3px rgba(0, 90, 173, 0.1) !important;
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

/* Responsive Design */
@media (max-width: 1024px) {
  .nas-info-card {
    position: static;
  }
}

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

  .nas-radio-group {
    flex-direction: column;
  }
}
</style>
