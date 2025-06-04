<script setup>
definePageMeta({
  title: "Kelulusan PKP",
  breadcrumb: [
    {
      name: "Pendaftaran Pantas",
      path: "/QS-1",
    },
    {
      name: "Kelulusan PKP",
      type: "current",
    },
  ],
});

const router = useRouter();

// Get application data
const applicationData = ref(null);
const applicantProfile = ref(null);
const interviewData = ref(null);

// PKP decision data
const approvalData = ref({
  keputusan: null, // 'lulus' or 'tolak'
  sebabPenolakan: "",
  jumlahDisetujui: "",
  catatanPkp: "",
  petiBesilId: "PBS-001",
  jenisAkaun: "Bantuan Kecemasan",
  bakiSemasa: 50000,
  floatMinimum: 10000,
});

// Form validation
const errors = ref({});
const isSubmitting = ref(false);
const showSuccessAlert = ref(false);

// Mock safe box data
const safeBoxData = ref({
  id: "PBS-001",
  jenisAkaun: "Bantuan Kecemasan",
  bakiSemasa: 50000,
  floatMinimum: 10000,
  lastUpdated: new Date().toISOString(),
});

onMounted(() => {
  // Get application data from localStorage
  const storedApplication = localStorage.getItem("currentApplication");
  if (storedApplication) {
    const appData = JSON.parse(storedApplication);
    applicationData.value = appData;
    applicantProfile.value = appData.profileData;
    interviewData.value = appData.interviewData;

    // Pre-fill approval amount with EKP recommendation
    if (appData.interviewData && appData.interviewData.syorBantuan === "ya") {
      approvalData.value.jumlahDisetujui =
        appData.interviewData.jumlahDicadangkan;
    } else {
      approvalData.value.jumlahDisetujui = appData.jumlahDimohon;
    }
  } else {
    // Redirect if no application data
    router.push("/BF-PRF/AS/QS-1");
  }
});

// Form validation
const validateForm = () => {
  errors.value = {};

  if (approvalData.value.keputusan === null) {
    errors.value.keputusan =
      "Sila buat keputusan sama ada meluluskan atau menolak";
  }

  if (approvalData.value.keputusan === "lulus") {
    if (
      !approvalData.value.jumlahDisetujui ||
      approvalData.value.jumlahDisetujui <= 0
    ) {
      errors.value.jumlahDisetujui = "Sila masukkan jumlah yang sah";
    }

    if (approvalData.value.jumlahDisetujui > 5000) {
      errors.value.jumlahDisetujui = "Jumlah maksimum adalah RM 5,000";
    }

    if (
      approvalData.value.jumlahDisetujui >
      safeBoxData.value.bakiSemasa - safeBoxData.value.floatMinimum
    ) {
      errors.value.jumlahDisetujui = "Jumlah melebihi baki yang tersedia";
    }
  }

  if (approvalData.value.keputusan === "tolak") {
    if (!approvalData.value.sebabPenolakan.trim()) {
      errors.value.sebabPenolakan = "Sila masukkan sebab penolakan";
    }
  }

  return Object.keys(errors.value).length === 0;
};

// Submit approval decision
const submitApproval = async () => {
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

    // Update application data with approval decision
    const updatedApplication = {
      ...applicationData.value,
      approvalData: approvalData.value,
      status:
        approvalData.value.keputusan === "lulus" ? "Diluluskan" : "Ditolak",
      approvalCompletedAt: new Date().toISOString(),
      approvedBy: "PKP-001", // This would come from logged-in user
    };

    // Update safe box balance if approved
    if (approvalData.value.keputusan === "lulus") {
      safeBoxData.value.bakiSemasa -= parseFloat(
        approvalData.value.jumlahDisetujui
      );
      safeBoxData.value.lastUpdated = new Date().toISOString();
    }

    localStorage.setItem(
      "currentApplication",
      JSON.stringify(updatedApplication)
    );
    localStorage.setItem("safeBoxData", JSON.stringify(safeBoxData.value));

    showSuccessAlert.value = true;

    // Auto redirect after 3 seconds
    setTimeout(() => {
      if (approvalData.value.keputusan === "lulus") {
        // If approved, continue to Phase 5: Cash Disbursement
        router.push("/BF-PRF/AS/QS-1/sahkan-pengeluaran");
      } else {
        // If rejected, go back to dashboard
        router.push("/BF-PRF/AS/QS-1");
      }
    }, 3000);
  } catch (error) {
    console.error("Error submitting approval:", error);
  } finally {
    isSubmitting.value = false;
  }
};

// Calculate available amount
const availableAmount = computed(() => {
  return safeBoxData.value.bakiSemasa - safeBoxData.value.floatMinimum;
});

// Format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("ms-MY", {
    style: "currency",
    currency: "MYR",
  }).format(amount);
};

// Get EKP recommendation text
const ekpRecommendation = computed(() => {
  if (interviewData.value && interviewData.value.syorBantuan) {
    return interviewData.value.syorBantuan === "ya"
      ? "Disyorkan"
      : "Tidak Disyorkan";
  }
  return "Tiada Syor";
});
</script>

<template>
  <div class="">
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
        <h3 class="nas-alert-title">Keputusan Berjaya Disimpan</h3>
        <p class="nas-alert-description">
          Keputusan
          {{ approvalData.keputusan === "lulus" ? "kelulusan" : "penolakan" }}
          telah berjaya disimpan. Status permohonan telah dikemaskini.
        </p>
      </div>
    </RsAlert>

    <!-- Page Header -->
    <div class="nas-page-header">
      <div class="nas-header-content">
        <div class="nas-header-icon">
          <Icon name="heroicons:shield-check" class="nas-icon-primary" />
        </div>
        <div class="nas-header-text">
          <h1 class="nas-page-title">Semakan & Kelulusan Bantuan (PKP)</h1>
          <p class="nas-page-description">
            Buat keputusan kelulusan berdasarkan cadangan EKP
          </p>
        </div>
      </div>
    </div>

    <!-- Main Content Layout -->
    <div class="nas-approval-layout">
      <!-- Left Section: Application Summary -->
      <div class="nas-left-section">
        <!-- Application Summary Card -->
        <RsCard class="nas-summary-card">
          <template #header>
            <div class="nas-card-header">
              <Icon name="heroicons:document-text" class="nas-icon-header" />
              <h2 class="nas-section-header">Ringkasan Permohonan</h2>
            </div>
          </template>

          <div class="nas-card-body">
            <div v-if="applicationData" class="nas-summary-section">
              <!-- Applicant Information -->
              <div class="nas-info-group">
                <h3 class="nas-group-title">Maklumat Pemohon</h3>
                <div class="nas-info-grid">
                  <div class="nas-info-field">
                    <span class="nas-field-label">Nama:</span>
                    <span class="nas-field-value">{{
                      applicantProfile?.nama ||
                      applicantProfile?.personalInfo?.nama
                    }}</span>
                  </div>
                  <div class="nas-info-field">
                    <span class="nas-field-label">No. KP:</span>
                    <span class="nas-field-value nas-mono">{{
                      applicantProfile?.noKp ||
                      applicantProfile?.personalInfo?.noKp
                    }}</span>
                  </div>
                  <div class="nas-info-field">
                    <span class="nas-field-label">ID Permohonan:</span>
                    <span class="nas-field-value nas-mono">{{
                      applicationData.applicationId
                    }}</span>
                  </div>
                </div>
              </div>

              <!-- Application Details -->
              <div class="nas-info-group">
                <h3 class="nas-group-title">Butiran Permohonan</h3>
                <div class="nas-info-grid">
                  <div class="nas-info-field">
                    <span class="nas-field-label">Jenis Bantuan:</span>
                    <span class="nas-field-value">{{
                      applicationData.jenisBantuan
                    }}</span>
                  </div>
                  <div class="nas-info-field">
                    <span class="nas-field-label">Jumlah Dimohon:</span>
                    <span class="nas-field-value">{{
                      formatCurrency(applicationData.jumlahDimohon)
                    }}</span>
                  </div>
                  <div class="nas-info-field">
                    <span class="nas-field-label">Syor EKP:</span>
                    <RsBadge
                      :variant="
                        ekpRecommendation === 'Disyorkan' ? 'success' : 'danger'
                      "
                    >
                      {{ ekpRecommendation }}
                    </RsBadge>
                  </div>
                  <div
                    v-if="interviewData?.jumlahDicadangkan"
                    class="nas-info-field"
                  >
                    <span class="nas-field-label">Jumlah Dicadangkan EKP:</span>
                    <span class="nas-field-value">{{
                      formatCurrency(interviewData.jumlahDicadangkan)
                    }}</span>
                  </div>
                </div>
              </div>

              <!-- Application Description -->
              <div class="nas-info-group">
                <h3 class="nas-group-title">Keterangan Permohonan</h3>
                <div class="nas-description-box">
                  <p class="nas-description-text">
                    {{ applicationData.keteranganPermohonan }}
                  </p>
                </div>
              </div>

              <!-- EKP Comments -->
              <div v-if="interviewData?.catatan" class="nas-info-group">
                <h3 class="nas-group-title">Catatan EKP</h3>
                <div class="nas-description-box">
                  <p class="nas-description-text">
                    {{ interviewData.catatan }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </RsCard>

        <!-- Safe Box Status Card -->
        <RsCard class="nas-safebox-card">
          <template #header>
            <div class="nas-card-header">
              <Icon name="heroicons:banknotes" class="nas-icon-header" />
              <h2 class="nas-section-header">Status Peti Besi</h2>
            </div>
          </template>

          <div class="nas-card-body">
            <div class="nas-safebox-section">
              <div class="nas-safebox-grid">
                <div class="nas-safebox-field">
                  <span class="nas-field-label">ID Peti Besi:</span>
                  <span class="nas-field-value nas-mono">{{
                    safeBoxData.id
                  }}</span>
                </div>
                <div class="nas-safebox-field">
                  <span class="nas-field-label">Jenis Akaun:</span>
                  <span class="nas-field-value">{{
                    safeBoxData.jenisAkaun
                  }}</span>
                </div>
                <div class="nas-safebox-field">
                  <span class="nas-field-label">Baki Semasa:</span>
                  <span class="nas-field-value nas-amount">{{
                    formatCurrency(safeBoxData.bakiSemasa)
                  }}</span>
                </div>
                <div class="nas-safebox-field">
                  <span class="nas-field-label">Float Minimum:</span>
                  <span class="nas-field-value">{{
                    formatCurrency(safeBoxData.floatMinimum)
                  }}</span>
                </div>
                <div class="nas-safebox-field nas-available">
                  <span class="nas-field-label">Jumlah Tersedia:</span>
                  <span class="nas-field-value nas-amount-available">{{
                    formatCurrency(availableAmount)
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </RsCard>
      </div>

      <!-- Right Section: Approval Decision -->
      <div class="nas-right-section">
        <RsCard class="nas-decision-card">
          <template #header>
            <div class="nas-card-header">
              <Icon
                name="heroicons:clipboard-document-check"
                class="nas-icon-header"
              />
              <h2 class="nas-section-header">Keputusan PKP</h2>
            </div>
          </template>

          <div class="nas-card-body">
            <form @submit.prevent="submitApproval" class="nas-approval-form">
              <!-- Decision Section -->
              <RsFieldset>
                <template #legend>
                  <h3 class="nas-subsection-header">
                    Keputusan <span class="nas-required">*</span>
                  </h3>
                </template>

                <div class="nas-decision-section">
                  <div class="nas-question">
                    <div class="nas-radio-group">
                      <FormKit
                        type="radio"
                        name="keputusan"
                        v-model="approvalData.keputusan"
                        :options="[
                          { label: 'Luluskan Permohonan', value: 'lulus' },
                          { label: 'Tolak Permohonan', value: 'tolak' },
                        ]"
                      />
                    </div>
                  </div>
                </div>
              </RsFieldset>

              <!-- Conditional Fields for Approval -->
              <div
                v-if="approvalData.keputusan === 'lulus'"
                class="nas-approval-fields"
              >
                <RsFieldset>
                  <template #legend>
                    <h3 class="nas-subsection-header">Butiran Kelulusan</h3>
                  </template>

                  <div class="nas-field-group">
                    <label class="nas-field-label"
                      >Jumlah Disetujui
                      <span class="nas-required">*</span></label
                    >
                    <div class="nas-amount-input">
                      <span class="nas-currency-prefix">RM</span>
                      <FormKit
                        type="number"
                        name="jumlahDisetujui"
                        v-model="approvalData.jumlahDisetujui"
                        placeholder="0.00"
                        min="1"
                        :max="availableAmount"
                        step="1"
                        help="Masukkan jumlah yang disetujui untuk diagihkan"
                      />
                    </div>
                    <div class="nas-amount-info">
                      <Icon
                        name="heroicons:information-circle"
                        class="nas-info-icon"
                      />
                      <span class="nas-info-text">
                        Maksimum tersedia: {{ formatCurrency(availableAmount) }}
                      </span>
                    </div>
                  </div>
                </RsFieldset>
              </div>

              <!-- Conditional Fields for Rejection -->
              <div
                v-if="approvalData.keputusan === 'tolak'"
                class="nas-rejection-fields"
              >
                <RsFieldset>
                  <template #legend>
                    <h3 class="nas-subsection-header">Sebab Penolakan</h3>
                  </template>

                  <div class="nas-field-group">
                    <FormKit
                      type="textarea"
                      name="sebabPenolakan"
                      v-model="approvalData.sebabPenolakan"
                      placeholder="Nyatakan sebab penolakan permohonan ini..."
                      rows="4"
                      maxlength="500"
                      help="Berikan sebab yang jelas untuk penolakan permohonan"
                    />
                    <div class="nas-char-counter">
                      {{ approvalData.sebabPenolakan.length }}/500 aksara
                    </div>
                  </div>
                </RsFieldset>
              </div>

              <!-- PKP Comments -->
              <RsFieldset>
                <template #legend>
                  <h3 class="nas-subsection-header">Catatan PKP</h3>
                </template>

                <div class="nas-field-group">
                  <FormKit
                    type="textarea"
                    name="catatanPkp"
                    v-model="approvalData.catatanPkp"
                    placeholder="Catatan tambahan dari PKP (jika ada)..."
                    rows="3"
                    maxlength="500"
                    help="Catatan tambahan atau pemerhatian dari PKP"
                  />
                  <div class="nas-char-counter">
                    {{ approvalData.catatanPkp.length }}/500 aksara
                  </div>
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
                :variant="
                  approvalData.keputusan === 'lulus' ? 'primary' : 'danger'
                "
                size="lg"
                @click="submitApproval"
                :disabled="isSubmitting"
                :loading="isSubmitting"
              >
                <Icon
                  :name="
                    approvalData.keputusan === 'lulus'
                      ? 'heroicons:check-circle'
                      : 'heroicons:x-circle'
                  "
                  class="nas-button-icon-left"
                />
                {{
                  isSubmitting
                    ? "Menyimpan..."
                    : approvalData.keputusan === "lulus"
                    ? "Luluskan Permohonan"
                    : approvalData.keputusan === "tolak"
                    ? "Tolak Permohonan"
                    : "Simpan Keputusan"
                }}
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
  background-color: rgba(0, 90, 173, 0.1); /* Primary Blue with 10% opacity */
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
}

.nas-icon-primary {
  width: 24px;
  height: 24px;
  color: #005aad; /* LZS Primary Blue */
}

/* Main Layout */
.nas-approval-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

@media (max-width: 1024px) {
  .nas-approval-layout {
    grid-template-columns: 1fr;
  }
}

.nas-left-section,
.nas-right-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Card Design */
.nas-summary-card {
  border-left: 4px solid #005aad; /* LZS Primary Blue */
}

.nas-safebox-card {
  border-left: 4px solid #8dc73d; /* LZS Secondary Green */
}

.nas-decision-card {
  border-left: 4px solid #fff200; /* LZS Accent Yellow */
  position: sticky;
  top: 24px;
  height: fit-content;
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

/* Information Sections */
.nas-summary-section,
.nas-safebox-section {
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

.nas-info-grid,
.nas-safebox-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
}

.nas-info-field,
.nas-safebox-field {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background-color: #f9fafb;
  border-radius: 6px;
  font-size: 14px;
}

.nas-safebox-field.nas-available {
  background-color: #ecfdf5;
  border: 1px solid #a7f3d0;
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

.nas-amount {
  color: #059669;
  font-weight: 700;
}

.nas-amount-available {
  color: #047857;
  font-weight: 700;
  font-size: 16px;
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

/* Approval Form */
.nas-approval-form {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* Decision Section */
.nas-decision-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.nas-question {
  background-color: #f9fafb;
  border-radius: 8px;
  padding: 16px;
  border-left: 3px solid #e5e7eb;
}

.nas-radio-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Conditional Fields */
.nas-approval-fields,
.nas-rejection-fields {
  background-color: #eff6ff;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #bfdbfe;
}

.nas-rejection-fields {
  background-color: #fef2f2;
  border-color: #fecaca;
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

/* Amount Info */
.nas-amount-info {
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

.nas-info-text {
  font-size: 12px;
  color: #1e40af;
  font-weight: 500;
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
  .nas-decision-card {
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
