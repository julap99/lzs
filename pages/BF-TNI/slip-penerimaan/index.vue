<<<<<<< HEAD
<script setup>
definePageMeta({
  title: "Slip Penerimaan",
  breadcrumb: [
    {
      name: "Pendaftaran Pantas",
      path: "/BF-PRF/AS/QS-1",
    },
    {
      name: "Slip Penerimaan",
      type: "current",
    },
  ],
});

const router = useRouter();

// Get application data
const handoverData = ref(null);
const isLoading = ref(false);

// Receipt slip data
const receiptData = ref({
  slipNumber: "",
  receiptDate: "", // Will be set properly in onMounted
  applicantSignature: "",
  digitalSignature: "",
  signatureMethod: "manual", // manual or digital
  witnessName: "",
  printedBy: "",
  remarks: "",
});

const applicationData = ref({
  nama: "Siti Aminah binti Abdullah",
  noKp: "900101-14-5678",
  profileData: {
    nama: "Siti Aminah binti Abdullah",
    noKp: "900101-14-5678"
  },
  applicantProfile: {
    nama: "Siti Aminah binti Abdullah",
    noKp: "900101-14-5678"
  },
  id: "PA-2024-999",
  jenisBantuan: "Bantuan Kecemasan",
  approvalData: {
    jumlahDisetujui: 500.00
  },
  handedOverBy: "EKP-002",
  approvedBy: "PKP-001"
});


// Form validation
const errors = ref({});
const isSubmitting = ref(false);
const showSuccessAlert = ref(false);
const isReceiptComplete = ref(false);
const isPrintReady = ref(false);

// Signature canvas
const signatureCanvas = ref(null);
const isDrawing = ref(false);
const signatureData = ref("");

// Helper function to format date for datetime-local input
const formatDateTimeLocal = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

// Initialize signature canvas
const initializeSignatureCanvas = () => {
  if (!signatureCanvas.value) return;

  const canvas = signatureCanvas.value;
  const ctx = canvas.getContext("2d");

  // Set canvas size
  canvas.width = 400;
  canvas.height = 200;

  // Set drawing style
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  // Clear canvas
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};

// Signature canvas events
const startDrawing = (event) => {
  if (receiptData.value.signatureMethod !== "digital") return;

  isDrawing.value = true;
  const canvas = signatureCanvas.value;
  const ctx = canvas.getContext("2d");
  const rect = canvas.getBoundingClientRect();

  ctx.beginPath();
  ctx.moveTo(event.clientX - rect.left, event.clientY - rect.top);
};

const draw = (event) => {
  if (!isDrawing.value || receiptData.value.signatureMethod !== "digital")
    return;

  const canvas = signatureCanvas.value;
  const ctx = canvas.getContext("2d");
  const rect = canvas.getBoundingClientRect();

  ctx.lineTo(event.clientX - rect.left, event.clientY - rect.top);
  ctx.stroke();
};

const stopDrawing = () => {
  if (!isDrawing.value || receiptData.value.signatureMethod !== "digital")
    return;

  isDrawing.value = false;
  signatureData.value = signatureCanvas.value.toDataURL();
};

// Clear signature
const clearSignature = () => {
  if (receiptData.value.signatureMethod === "digital") {
    initializeSignatureCanvas();
    signatureData.value = "";
  } else {
    receiptData.value.applicantSignature = "";
  }
};

// Watch signature method change
watch(
  () => receiptData.value.signatureMethod,
  (newMethod) => {
    nextTick(() => {
      if (newMethod === "digital") {
        initializeSignatureCanvas();
      }
    });
  }
);

// Form validation
const validateForm = () => {
  console.log("validateForm called"); // Debug log
  errors.value = {};

  if (receiptData.value.signatureMethod === "manual") {
    if (!receiptData.value.applicantSignature.trim()) {
      errors.value.applicantSignature =
        "Sila masukkan nama untuk tandatangan manual";
    } else if (receiptData.value.applicantSignature.trim().length < 3) {
      errors.value.applicantSignature =
        "Nama mestilah sekurang-kurangnya 3 aksara";
    }
  } else if (receiptData.value.signatureMethod === "digital") {
    if (!signatureData.value) {
      errors.value.digitalSignature =
        "Sila tandatangan pada ruang yang disediakan";
    }
  }

  console.log("Validation errors:", errors.value); // Debug log
  const isValid = Object.keys(errors.value).length === 0;
  console.log("Form is valid:", isValid); // Debug log

  return isValid;
};

// Submit receipt confirmation
const submitReceipt = async () => {
  console.log("submitReceipt called"); // Debug log
  console.log("Current receiptData:", receiptData.value); // Debug log

  if (!validateForm()) {
    console.log("Form validation failed, errors:", errors.value); // Debug log
    // Focus on first error
    const firstErrorField = Object.keys(errors.value)[0];
    const element = document.querySelector(`[name="${firstErrorField}"]`);
    if (element) {
      element.focus();
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    return;
  }

  console.log("Form validation passed, proceeding with submission"); // Debug log
  isSubmitting.value = true;

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Store signature data
    if (receiptData.value.signatureMethod === "digital") {
      receiptData.value.digitalSignature = signatureData.value;
    }

    // Convert datetime-local format back to ISO string for storage
    const receiptDateTime = new Date(
      receiptData.value.receiptDate
    ).toISOString();

    // Update application data with receipt info
    const updatedApplication = {
      ...applicationData.value,
      receiptData: {
        ...receiptData.value,
        receiptDate: receiptDateTime,
      },
      status: "Selesai",
      receiptCompletedAt: receiptDateTime,
      completedBy: "System",
    };

    localStorage.setItem(
      "currentApplication",
      JSON.stringify(updatedApplication)
    );

    showSuccessAlert.value = true;
    isReceiptComplete.value = true;
    isPrintReady.value = true;

    console.log("Receipt completed successfully"); // Debug log
  } catch (error) {
    console.error("Error submitting receipt:", error);
    // Show error alert
    alert("Ralat berlaku semasa memproses slip penerimaan. Sila cuba lagi.");
  } finally {
    isSubmitting.value = false;
  }
};

// Handle form submit event
const handleFormSubmit = (event) => {
  console.log("Form submit event triggered:", event); // Debug log
  submitReceipt();
};

// Handle button click directly
const handleButtonClick = () => {
  console.log("Button clicked directly"); // Debug log
  submitReceipt();
};

// Print receipt
const printReceipt = () => {
  console.log("Print receipt called"); // Debug log
  window.print();
};

// Complete process and redirect
const completeProcess = () => {
  console.log("Complete process called"); // Debug log
  // Auto redirect after completion notification
  setTimeout(() => {
    router.push("/BF-PRF/AS/QS-1/notifikasi-jejak-audit");
  }, 2000);
};

// Safe access to applicant data
const getApplicantName = () => {
  return ("Imah");
};

const getApplicantIC = () => {
  return ("9999999");
};

const getApplicationId = () => {
  return ("Tidak tersedia");
};

const getAssistanceType = () => {
  return "Bantuan Kecemasan";
};

const getCashAmount = () => {
  return (
    "200"
  );
};

const getHandoverLocation = () => {
  return "Cawangan Kuala Selangor";
};

const getHandoverDateTime = () => {
  return new Date().toISOString();
};

// Format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("ms-MY", {
    style: "currency",
    currency: "MYR",
  }).format(amount);
};

// Format date time
const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleString("ms-MY", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Format date only
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("ms-MY", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
</script>

<template>
  <div>
    <!-- Loading State -->
    <div v-if="isLoading" class="nas-loading-container">
      <div class="nas-loading-content">
        <Icon name="heroicons:arrow-path" class="nas-loading-spinner" />
        <p class="nas-loading-text">Memuat data slip penerimaan...</p>
      </div>
    </div>

    <template v-else>
      <!-- Success Alert -->
      <RsAlert
        v-if="showSuccessAlert"
        type="success"
        class="nas-success-alert"
        dismissible
        role="alert"
        aria-live="polite"
      >
        <template #icon>
          <Icon name="heroicons:check-circle" />
        </template>
        <div>
          <h3 class="nas-alert-title">Slip Penerimaan Berjaya Dijana</h3>
          <p class="nas-alert-description">
            Slip penerimaan bantuan telah berjaya dijana. Proses bantuan
            kecemasan telah selesai.
          </p>
        </div>
      </RsAlert>

      <!-- Page Header -->
      <div class="nas-page-header">
        <div class="nas-header-content">
          <div class="nas-header-icon">
            <Icon name="heroicons:document-text" class="nas-icon-primary" />
          </div>
          <div class="nas-header-text">
            <h1 class="nas-page-title">Slip Penerimaan Bantuan</h1>
            <p class="nas-page-description">
              Pemohon tandatangan & cetak slip penerimaan
            </p>
          </div>
        </div>
      </div>

      <!-- Main Content Layout -->
      <div class="nas-main-layout">
        <!-- Receipt Slip -->
        <div class="nas-receipt-section">
          <RsCard class="nas-receipt-card">
            <template #header>
              <div class="nas-receipt-header">
                <div class="nas-logo-section">
                  <!-- LZS Logo placeholder -->
                  <div class="nas-logo-placeholder">
                    <Icon
                      name="heroicons:building-office-2"
                      class="nas-logo-icon"
                    />
                  </div>
                  <div class="nas-org-info">
                    <h2 class="nas-org-name">LEMBAGA ZAKAT SELANGOR</h2>
                    <p class="nas-org-subtitle">New Agihan System (NAS)</p>
                  </div>
                </div>
                <div class="nas-slip-info">
                  <h3 class="nas-slip-title">SLIP PENERIMAAN BANTUAN</h3>
                  <p class="nas-slip-number">
                    No: {{ receiptData.slipNumber }}
                  </p>
                  <p class="nas-slip-date">
                    Tarikh: {{ formatDate(receiptData.receiptDate) }}
                  </p>
                </div>
              </div>
            </template>

            <div class="nas-receipt-body">
              <!-- Applicant Information -->
              <div class="nas-receipt-section">
                <h4 class="nas-receipt-section-title">MAKLUMAT PEMOHON</h4>
                <div class="nas-receipt-grid">
                  <div class="nas-receipt-item">
                    <span class="nas-receipt-label">Nama:</span>
                    <span class="nas-receipt-value">{{
                      getApplicantName()
                    }}</span>
                  </div>
                  <div class="nas-receipt-item">
                    <span class="nas-receipt-label">No. Kad Pengenalan:</span>
                    <span class="nas-receipt-value">{{
                      getApplicantIC()
                    }}</span>
                  </div>
                  <div class="nas-receipt-item">
                    <span class="nas-receipt-label">ID Permohonan:</span>
                    <span class="nas-receipt-value">{{
                      getApplicationId()
                    }}</span>
                  </div>
                </div>
              </div>

              <!-- Assistance Details -->
              <div class="nas-receipt-section">
                <h4 class="nas-receipt-section-title">BUTIRAN BANTUAN</h4>
                <div class="nas-receipt-grid">
                  <div class="nas-receipt-item">
                    <span class="nas-receipt-label">Jenis Bantuan:</span>
                    <span class="nas-receipt-value">{{
                      getAssistanceType()
                    }}</span>
                  </div>
                  <div class="nas-receipt-item">
                    <span class="nas-receipt-label">Jumlah Bantuan:</span>
                    <span class="nas-receipt-value nas-amount-highlight">
                      {{ formatCurrency(getCashAmount()) }}
                    </span>
                  </div>
                  <div class="nas-receipt-item">
                    <span class="nas-receipt-label">Lokasi Serahan:</span>
                    <span class="nas-receipt-value">{{
                      getHandoverLocation()
                    }}</span>
                  </div>
                  <div class="nas-receipt-item">
                    <span class="nas-receipt-label"
                      >Tarikh & Masa Serahan:</span
                    >
                    <span class="nas-receipt-value">{{
                      formatDateTime(getHandoverDateTime())
                    }}</span>
                  </div>
                </div>
              </div>

              <!-- Official Details -->
              <div class="nas-receipt-section">
                <h4 class="nas-receipt-section-title">MAKLUMAT RASMI</h4>
                <div class="nas-receipt-grid">
                  <div class="nas-receipt-item">
                    <span class="nas-receipt-label">Diluluskan Oleh:</span>
                    <span class="nas-receipt-value">{{
                      applicationData?.approvedBy || "PKP-001"
                    }}</span>
                  </div>
                  <div class="nas-receipt-item">
                    <span class="nas-receipt-label">Diagih Oleh:</span>
                    <span class="nas-receipt-value">{{
                      applicationData?.handedOverBy || "EKP-001"
                    }}</span>
                  </div>
                  <div class="nas-receipt-item">
                    <span class="nas-receipt-label">Saksi:</span>
                    <span class="nas-receipt-value">{{
                      receiptData.witnessName
                    }}</span>
                  </div>
                  <div class="nas-receipt-item">
                    <span class="nas-receipt-label">Dicetak Oleh:</span>
                    <span class="nas-receipt-value">{{
                      receiptData.printedBy
                    }}</span>
                  </div>
                </div>
              </div>

              <!-- Signature Section -->
              <div class="nas-signature-section">
                <h4 class="nas-receipt-section-title">TANDATANGAN PEMOHON</h4>

                <form
                  v-if="!isReceiptComplete"
                  @submit.prevent="handleFormSubmit"
                  class="nas-signature-form"
                  novalidate
                >
                  <!-- Signature Method Selection -->
                  <div class="nas-signature-method">
                    <label class="nas-field-label">Kaedah Tandatangan:</label>
                    <div
                      class="nas-radio-group"
                      role="radiogroup"
                      aria-describedby="signature-method-help"
                    >
                      <label class="nas-radio-item">
                        <input
                          v-model="receiptData.signatureMethod"
                          type="radio"
                          value="manual"
                          class="nas-radio-input"
                          name="signatureMethod"
                        />
                        <span class="nas-radio-label">Manual (Tulis Nama)</span>
                      </label>
                      <label class="nas-radio-item">
                        <input
                          v-model="receiptData.signatureMethod"
                          type="radio"
                          value="digital"
                          class="nas-radio-input"
                          name="signatureMethod"
                        />
                        <span class="nas-radio-label"
                          >Digital (Tandatangan pada Skrin)</span
                        >
                      </label>
                    </div>
                    <div id="signature-method-help" class="nas-helper-text">
                      Pilih kaedah tandatangan yang sesuai
                    </div>
                  </div>

                  <!-- Manual Signature -->
                  <div
                    v-if="receiptData.signatureMethod === 'manual'"
                    class="nas-manual-signature"
                  >
                    <label for="applicantSignature" class="nas-field-label">
                      Nama Pemohon <span class="nas-required">*</span>
                    </label>
                    <input
                      id="applicantSignature"
                      v-model="receiptData.applicantSignature"
                      name="applicantSignature"
                      type="text"
                      placeholder="Sila taip nama anda sebagai tandatangan"
                      class="nas-signature-input"
                      :class="{ 'nas-input-error': errors.applicantSignature }"
                      :aria-invalid="!!errors.applicantSignature"
                      :aria-describedby="
                        errors.applicantSignature
                          ? 'applicantSignature-error'
                          : 'applicantSignature-help'
                      "
                      autocomplete="name"
                    />
                    <div
                      v-if="errors.applicantSignature"
                      id="applicantSignature-error"
                      class="nas-error-text"
                      role="alert"
                    >
                      {{ errors.applicantSignature }}
                    </div>
                    <div
                      v-else
                      id="applicantSignature-help"
                      class="nas-helper-text"
                    >
                      Taip nama anda untuk mengesahkan penerimaan bantuan
                      (minimum 3 aksara)
                    </div>
                  </div>

                  <!-- Digital Signature -->
                  <div
                    v-if="receiptData.signatureMethod === 'digital'"
                    class="nas-digital-signature"
                  >
                    <label class="nas-field-label">
                      Tandatangan Digital <span class="nas-required">*</span>
                    </label>
                    <div class="nas-signature-canvas-container">
                      <canvas
                        ref="signatureCanvas"
                        class="nas-signature-canvas"
                        @mousedown="startDrawing"
                        @mousemove="draw"
                        @mouseup="stopDrawing"
                        @mouseleave="stopDrawing"
                        :aria-label="
                          signatureData
                            ? 'Tandatangan digital telah dibuat'
                            : 'Canvas untuk tandatangan digital'
                        "
                        role="img"
                      ></canvas>
                      <div class="nas-canvas-overlay" v-if="!signatureData">
                        <p class="nas-canvas-instruction">
                          Klik dan drag untuk tandatangan
                        </p>
                      </div>
                    </div>
                    <div
                      v-if="errors.digitalSignature"
                      class="nas-error-text"
                      role="alert"
                    >
                      {{ errors.digitalSignature }}
                    </div>
                    <div v-else class="nas-helper-text">
                      Gunakan mouse atau touch untuk menandatangan pada ruang di
                      atas
                    </div>

                    <RsButton
                      type="button"
                      variant="secondary-outline"
                      size="sm"
                      @click="clearSignature"
                      class="nas-clear-button"
                    >
                      <Icon
                        name="heroicons:arrow-path"
                        class="nas-button-icon"
                      />
                      Kosongkan
                    </RsButton>
                  </div>
                </form>

                <!-- Completed Signature Display -->
                <div v-else class="nas-completed-signature">
                  <div
                    v-if="receiptData.signatureMethod === 'manual'"
                    class="nas-manual-signature-display"
                  >
                    <div class="nas-signature-box">
                      <p class="nas-signature-text">
                        {{ receiptData.applicantSignature }}
                      </p>
                      <div class="nas-signature-line"></div>
                      <p class="nas-signature-caption">Tandatangan Pemohon</p>
                    </div>
                  </div>

                  <div
                    v-if="receiptData.signatureMethod === 'digital'"
                    class="nas-digital-signature-display"
                  >
                    <div class="nas-signature-box">
                      <img
                        :src="receiptData.digitalSignature"
                        alt="Tandatangan Digital"
                        class="nas-signature-image"
                      />
                      <div class="nas-signature-line"></div>
                      <p class="nas-signature-caption">
                        Tandatangan Pemohon (Digital)
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Receipt Footer -->
              <div class="nas-receipt-footer">
                <div class="nas-footer-note">
                  <p class="nas-footer-text">
                    <strong>Nota:</strong> Slip ini adalah bukti rasmi
                    penerimaan bantuan daripada Lembaga Zakat Selangor. Sila
                    simpan slip ini untuk rujukan pada masa hadapan.
                  </p>
                </div>
                <div class="nas-footer-info">
                  <p class="nas-footer-contact">
                    <strong>Hubungi Kami:</strong> 1-800-88-3535 |
                    info@zakatselangor.com.my
                  </p>
                </div>
              </div>
            </div>
          </RsCard>
        </div>

        <!-- Action Panel -->
        <div class="nas-action-panel" v-if="!isReceiptComplete">
          <RsCard class="nas-action-card">
            <template #header>
              <div class="nas-card-header">
                <Icon name="heroicons:pencil-square" class="nas-icon-header" />
                <h3 class="nas-section-header">Pengesahan Penerimaan</h3>
              </div>
            </template>

            <div class="nas-card-body">
              <div class="nas-confirmation-content">
                <div class="nas-confirmation-message">
                  <Icon
                    name="heroicons:information-circle"
                    class="nas-info-icon"
                  />
                  <div class="nas-message-text">
                    <h4 class="nas-message-title">Pengesahan Diperlukan</h4>
                    <p class="nas-message-description">
                      Sila sahkan penerimaan bantuan dengan menandatangani slip
                      penerimaan di atas. Setelah ditandatangani, slip boleh
                      dicetak untuk simpanan.
                    </p>
                  </div>
                </div>

                <!-- Remarks -->
                <div class="nas-remarks-section">
                  <label for="remarks" class="nas-field-label"
                    >Catatan Tambahan (Pilihan)</label
                  >
                  <textarea
                    id="remarks"
                    v-model="receiptData.remarks"
                    name="remarks"
                    placeholder="Sebarang catatan tambahan mengenai penerimaan bantuan"
                    class="nas-form-textarea"
                    rows="3"
                    maxlength="300"
                    :aria-describedby="'remarks-help'"
                  ></textarea>
                  <div id="remarks-help" class="nas-helper-text">
                    Catatan ini akan disimpan bersama rekod bantuan -
                    {{ receiptData.remarks.length }}/300 aksara
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="nas-action-buttons">
                  <RsButton
                    type="button"
                    variant="secondary-outline"
                    size="lg"
                    @click="router.push('/BF-PRF/AS/QS-1/serah-terima-tunai')"
                    :disabled="isSubmitting"
                  >
                    <Icon name="heroicons:arrow-left" class="nas-button-icon" />
                    Kembali
                  </RsButton>

                  <RsButton
                    type="button"
                    variant="success"
                    size="lg"
                    @click="handleButtonClick"
                    :loading="isSubmitting"
                    :disabled="isReceiptComplete || isSubmitting"
                    :aria-describedby="
                      isSubmitting ? 'submit-status' : undefined
                    "
                  >
                    <Icon
                      name="heroicons:check-circle"
                      class="nas-button-icon"
                    />
                    {{ isSubmitting ? "Memproses..." : "Selesai Agihan" }}
                  </RsButton>
                </div>

                <div
                  v-if="isSubmitting"
                  id="submit-status"
                  class="nas-sr-only"
                  aria-live="polite"
                >
                  Sedang memproses pengesahan penerimaan...
                </div>
              </div>
            </div>
          </RsCard>
        </div>

        <!-- Print Panel -->
        <div class="nas-print-panel" v-if="isReceiptComplete && isPrintReady">
          <RsCard class="nas-print-card">
            <template #header>
              <div class="nas-card-header">
                <Icon name="heroicons:printer" class="nas-icon-header" />
                <h3 class="nas-section-header">Cetak Slip</h3>
              </div>
            </template>

            <div class="nas-card-body">
              <div class="nas-print-content">
                <div class="nas-print-message">
                  <Icon
                    name="heroicons:check-circle"
                    class="nas-success-icon"
                  />
                  <div class="nas-message-text">
                    <h4 class="nas-message-title">Slip Penerimaan Sedia</h4>
                    <p class="nas-message-description">
                      Slip penerimaan bantuan telah berjaya dijana dan sedia
                      untuk dicetak.
                    </p>
                  </div>
                </div>

                <!-- Print Actions -->
                <div class="nas-print-actions">
                  <RsButton
                    type="button"
                    variant="primary"
                    size="lg"
                    @click="printReceipt"
                  >
                    <Icon name="heroicons:printer" class="nas-button-icon" />
                    Cetak Slip
                  </RsButton>

                  <RsButton
                    type="button"
                    variant="success"
                    size="lg"
                    @click="completeProcess"
                  >
                    <Icon
                      name="heroicons:arrow-right"
                      class="nas-button-icon"
                    />
                    Selesai
                  </RsButton>
                </div>
              </div>
            </div>
          </RsCard>
        </div>
      </div>
    </template>
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

.nas-page-description {
  font-size: 14px;
  font-weight: 400;
  color: #6b7280;
  line-height: 1.5;
}

/* Page Header */
.nas-page-header {
  margin-bottom: 32px; /* 24px + 8px spacing scale */
}

.nas-header-content {
  display: flex;
  align-items: center;
}

.nas-header-icon {
  width: 48px;
  height: 48px;
  background-color: rgba(
    0,
    90,
    173,
    0.1
  ); /* LZS Primary Blue with 10% opacity */
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

/* Alert Styles */
.nas-success-alert {
  margin-bottom: 24px;
}

.nas-alert-title {
  font-size: 16px;
  font-weight: 600;
  color: #047857; /* Updated to success color per specifications */
  margin-bottom: 4px;
  line-height: 1.5;
}

.nas-alert-description {
  font-size: 14px;
  font-weight: 400;
  color: #047857; /* Updated to success color per specifications */
  line-height: 1.5;
}

/* Main Layout */
.nas-main-layout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px; /* 24px gap per grid specifications */
}

@media (max-width: 1024px) {
  .nas-main-layout {
    grid-template-columns: 1fr;
    gap: 24px; /* Maintain 24px gap on mobile */
  }
}

/* Receipt Card */
.nas-receipt-card {
  border: 2px solid #005aad; /* LZS Primary Blue */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.nas-receipt-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 24px; /* Updated padding per specifications */
  border-bottom: 2px solid #005aad; /* LZS Primary Blue */
}

.nas-logo-section {
  display: flex;
  align-items: center;
}

.nas-logo-placeholder {
  width: 60px;
  height: 60px;
  background-color: #005aad; /* LZS Primary Blue */
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
}

.nas-logo-icon {
  width: 32px;
  height: 32px;
  color: white;
}

.nas-org-name {
  font-size: 18px;
  font-weight: 700;
  color: #005aad; /* LZS Primary Blue */
  margin-bottom: 4px;
  line-height: 1.2;
}

.nas-org-subtitle {
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  line-height: 1.2;
}

.nas-slip-info {
  text-align: right;
}

.nas-slip-title {
  font-size: 16px;
  font-weight: 700;
  color: #005aad; /* LZS Primary Blue */
  margin-bottom: 8px;
  line-height: 1.2;
}

.nas-slip-number,
.nas-slip-date {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 4px;
  line-height: 1.2;
}

/* Receipt Body */
.nas-receipt-body {
  padding: 24px; /* Updated to 24px padding per specifications */
}

.nas-receipt-section {
  padding: 20px 0;
  border-bottom: 1px solid #e5e7eb;
}

.nas-receipt-section:last-child {
  border-bottom: none;
}

.nas-receipt-section-title {
  font-size: 16px;
  font-weight: 600;
  color: #005aad; /* LZS Primary Blue */
  margin-bottom: 16px;
  line-height: 1.5;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.nas-receipt-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px; /* Consistent spacing */
}

@media (max-width: 768px) {
  .nas-receipt-grid {
    grid-template-columns: 1fr;
  }
}

.nas-receipt-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background-color: #f9fafb;
  border-radius: 6px;
  font-size: 14px;
}

.nas-receipt-label {
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  margin-right: 16px;
  flex-shrink: 0;
}

.nas-receipt-value {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  text-align: right;
  flex: 1;
}

.nas-amount-highlight {
  color: #005aad !important; /* LZS Primary Blue */
  font-size: 16px !important;
  font-weight: 700 !important;
  font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
}

/* Signature Section */
.nas-signature-section {
  background-color: rgba(
    0,
    90,
    173,
    0.05
  ); /* LZS Primary Blue with 5% opacity */
  border-radius: 8px;
  padding: 24px; /* Updated padding per specifications */
  margin-top: 16px;
  border: 1px solid rgba(0, 90, 173, 0.1);
}

.nas-signature-form {
  margin-top: 16px;
}

.nas-signature-method {
  margin-bottom: 20px;
}

.nas-field-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px; /* 8px spacing per specifications */
  line-height: 1.5;
}

.nas-radio-group {
  display: flex;
  gap: 16px; /* 16px spacing per specifications */
}

.nas-radio-item {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.nas-radio-input {
  margin-right: 8px;
  color: #005aad; /* LZS Primary Blue */
}

.nas-radio-label {
  font-size: 14px;
  font-weight: 400;
  color: #374151;
}

/* Manual Signature */
.nas-signature-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px; /* Updated to 8px border radius */
  font-size: 16px;
  font-weight: 500;
  color: #1f2937;
  font-family: cursive;
  background-color: #ffffff;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  line-height: 1.5;
}

.nas-signature-input:focus {
  outline: none;
  border-color: #005aad; /* LZS Primary Blue */
  box-shadow: 0 0 0 3px rgba(0, 90, 173, 0.1);
}

/* Digital Signature */
.nas-signature-canvas-container {
  position: relative;
  border: 2px dashed #005aad; /* LZS Primary Blue */
  border-radius: 8px;
  background-color: #ffffff;
  margin-bottom: 12px;
}

.nas-signature-canvas {
  display: block;
  width: 100%;
  height: 200px;
  cursor: crosshair;
  border-radius: 6px;
}

.nas-canvas-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  background-color: rgba(249, 250, 251, 0.8);
  border-radius: 6px;
}

.nas-canvas-instruction {
  font-size: 14px;
  color: #6b7280;
  text-align: center;
}

.nas-clear-button {
  margin-top: 8px;
}

/* Completed Signature */
.nas-signature-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px; /* Updated padding per specifications */
  background-color: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  min-height: 120px;
  justify-content: center;
}

.nas-signature-text {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  font-family: cursive;
  margin-bottom: 16px;
}

.nas-signature-image {
  max-width: 200px;
  max-height: 80px;
  margin-bottom: 16px;
}

.nas-signature-line {
  width: 200px;
  height: 1px;
  background-color: #374151;
  margin-bottom: 8px;
}

.nas-signature-caption {
  font-size: 12px;
  font-weight: 500;
  color: #6b7280;
  text-align: center;
}

/* Receipt Footer */
.nas-receipt-footer {
  background-color: rgba(
    0,
    90,
    173,
    0.05
  ); /* LZS Primary Blue with 5% opacity */
  border-radius: 8px;
  padding: 16px;
  margin-top: 20px;
  border: 1px solid rgba(0, 90, 173, 0.1);
}

.nas-footer-note {
  margin-bottom: 12px;
}

.nas-footer-text {
  font-size: 12px;
  color: #374151;
  line-height: 1.5;
}

.nas-footer-contact {
  font-size: 12px;
  color: #6b7280;
  text-align: center;
}

/* Action Panel */
.nas-card-header {
  display: flex;
  align-items: center;
  padding: 24px 24px 0 24px; /* Consistent spacing per specifications */
}

.nas-icon-header {
  width: 24px;
  height: 24px;
  color: #005aad; /* LZS Primary Blue */
  margin-right: 8px;
}

.nas-card-body {
  padding: 24px; /* Updated to 24px padding per specifications */
}

.nas-confirmation-content {
  display: flex;
  flex-direction: column;
  gap: 24px; /* 24px vertical spacing per specifications */
}

.nas-confirmation-message {
  display: flex;
  align-items: flex-start;
  padding: 16px;
  background-color: rgba(
    0,
    90,
    173,
    0.1
  ); /* LZS Primary Blue with 10% opacity */
  border: 1px solid rgba(0, 90, 173, 0.2); /* LZS Primary Blue with 20% opacity */
  border-radius: 8px;
}

.nas-message-title {
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 4px;
  line-height: 1.5;
}

.nas-message-description {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
}

/* Form Elements */
.nas-form-textarea {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px; /* Updated to 8px border radius */
  font-size: 14px;
  font-weight: 400;
  color: #1f2937;
  background-color: #ffffff;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  line-height: 1.5;
  resize: vertical;
}

.nas-form-textarea:focus {
  outline: none;
  border-color: #005aad; /* LZS Primary Blue */
  box-shadow: 0 0 0 3px rgba(0, 90, 173, 0.1);
}

.nas-helper-text {
  font-size: 12px;
  font-weight: 400;
  color: #6b7280;
  margin-top: 4px;
  line-height: 1.5;
}

.nas-error-text {
  font-size: 12px;
  font-weight: 500;
  color: #dc2626; /* Updated to specifications error color */
  margin-top: 4px;
  line-height: 1.5;
}

.nas-input-error {
  border-color: #dc2626; /* Updated to specifications error color */
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
}

.nas-required {
  color: #dc2626; /* Updated to specifications error color */
  margin-left: 2px;
}

/* Action Buttons */
.nas-action-buttons,
.nas-print-actions {
  display: flex;
  justify-content: space-between;
  gap: 16px; /* 16px gap per specifications */
}

@media (max-width: 768px) {
  .nas-action-buttons,
  .nas-print-actions {
    flex-direction: column;
    gap: 16px; /* Maintain 16px gap on mobile */
  }
}

.nas-button-icon {
  width: 20px;
  height: 20px;
  margin-right: 8px;
}

/* Loading State */
.nas-loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
  padding: 48px 24px;
}

.nas-loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.nas-loading-spinner {
  width: 32px;
  height: 32px;
  color: #005aad; /* LZS Primary Blue */
  animation: nas-spin 1s linear infinite;
}

.nas-loading-text {
  font-size: 16px;
  font-weight: 500;
  color: #6b7280;
  margin: 0;
  text-align: center;
}

@keyframes nas-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Screen Reader Only */
.nas-sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Enhanced Focus States for Accessibility */
.nas-signature-input:focus,
.nas-form-textarea:focus {
  outline: none;
  border-color: #005aad; /* LZS Primary Blue */
  box-shadow: 0 0 0 3px rgba(0, 90, 173, 0.1);
  z-index: 1;
  position: relative;
}

/* High Contrast Mode Support */
@media (prefers-contrast: high) {
  .nas-signature-input,
  .nas-form-textarea {
    border-width: 2px;
  }

  .nas-input-error {
    border-width: 3px;
  }
}

/* Reduced Motion Support */
@media (prefers-reduced-motion: reduce) {
  .nas-loading-spinner {
    animation: none;
  }

  .nas-signature-input,
  .nas-form-textarea {
    transition: none;
  }
}

/* Print Styles */
@media print {
  .nas-page-header,
  .nas-action-panel,
  .nas-print-panel,
  .nas-success-alert {
    display: none !important;
  }

  .nas-main-layout {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .nas-receipt-card {
    border: none;
    box-shadow: none;
  }

  .nas-container {
    padding: 0;
    max-width: none;
  }
}

/* Responsive adjustments */
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
    gap: 12px;
  }
}

/* Print Panel */
.nas-print-panel {
  display: flex;
  flex-direction: column;
}

.nas-print-card {
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background-color: #ffffff;
}

.nas-print-content {
  display: flex;
  flex-direction: column;
  gap: 24px; /* 24px vertical spacing per specifications */
}

.nas-print-message {
  display: flex;
  align-items: flex-start;
  padding: 16px;
  background-color: rgba(
    4,
    120,
    87,
    0.1
  ); /* Success color with 10% opacity */
  border: 1px solid rgba(4, 120, 87, 0.2); /* Success color with 20% opacity */
  border-radius: 8px;
}
</style>
=======
<script setup>
definePageMeta({
  title: "Slip Penerimaan",
  breadcrumb: [
    {
      name: "Pendaftaran Pantas",
      path: "/BF-PRF/AS/QS-1",
    },
    {
      name: "Slip Penerimaan",
      type: "current",
    },
  ],
});

const router = useRouter();

// Get application data
const handoverData = ref(null);
const isLoading = ref(false);

// Receipt slip data
const receiptData = ref({
  slipNumber: "",
  receiptDate: "", // Will be set properly in onMounted
  applicantSignature: "",
  digitalSignature: "",
  signatureMethod: "manual", // manual or digital
  witnessName: "",
  printedBy: "",
  remarks: "",
});

const applicationData = ref({
  nama: "Siti Aminah binti Abdullah",
  noKp: "900101-14-5678",
  profileData: {
    nama: "Siti Aminah binti Abdullah",
    noKp: "900101-14-5678"
  },
  applicantProfile: {
    nama: "Siti Aminah binti Abdullah",
    noKp: "900101-14-5678"
  },
  id: "PA-2024-999",
  jenisBantuan: "Bantuan Kecemasan",
  approvalData: {
    jumlahDisetujui: 500.00
  },
  handedOverBy: "EKP-002",
  approvedBy: "PKP-001"
});


// Form validation
const errors = ref({});
const isSubmitting = ref(false);
const showSuccessAlert = ref(false);
const isReceiptComplete = ref(false);
const isPrintReady = ref(false);

// Signature canvas
const signatureCanvas = ref(null);
const isDrawing = ref(false);
const signatureData = ref("");

// Helper function to format date for datetime-local input
const formatDateTimeLocal = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

// Initialize signature canvas
const initializeSignatureCanvas = () => {
  if (!signatureCanvas.value) return;

  const canvas = signatureCanvas.value;
  const ctx = canvas.getContext("2d");

  // Set canvas size
  canvas.width = 400;
  canvas.height = 200;

  // Set drawing style
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  // Clear canvas
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};

// Signature canvas events
const startDrawing = (event) => {
  if (receiptData.value.signatureMethod !== "digital") return;

  isDrawing.value = true;
  const canvas = signatureCanvas.value;
  const ctx = canvas.getContext("2d");
  const rect = canvas.getBoundingClientRect();

  ctx.beginPath();
  ctx.moveTo(event.clientX - rect.left, event.clientY - rect.top);
};

const draw = (event) => {
  if (!isDrawing.value || receiptData.value.signatureMethod !== "digital")
    return;

  const canvas = signatureCanvas.value;
  const ctx = canvas.getContext("2d");
  const rect = canvas.getBoundingClientRect();

  ctx.lineTo(event.clientX - rect.left, event.clientY - rect.top);
  ctx.stroke();
};

const stopDrawing = () => {
  if (!isDrawing.value || receiptData.value.signatureMethod !== "digital")
    return;

  isDrawing.value = false;
  signatureData.value = signatureCanvas.value.toDataURL();
};

// Clear signature
const clearSignature = () => {
  if (receiptData.value.signatureMethod === "digital") {
    initializeSignatureCanvas();
    signatureData.value = "";
  } else {
    receiptData.value.applicantSignature = "";
  }
};

// Watch signature method change
watch(
  () => receiptData.value.signatureMethod,
  (newMethod) => {
    nextTick(() => {
      if (newMethod === "digital") {
        initializeSignatureCanvas();
      }
    });
  }
);

// Form validation
const validateForm = () => {
  console.log("validateForm called"); // Debug log
  errors.value = {};

  if (receiptData.value.signatureMethod === "manual") {
    if (!receiptData.value.applicantSignature.trim()) {
      errors.value.applicantSignature =
        "Sila masukkan nama untuk tandatangan manual";
    } else if (receiptData.value.applicantSignature.trim().length < 3) {
      errors.value.applicantSignature =
        "Nama mestilah sekurang-kurangnya 3 aksara";
    }
  } else if (receiptData.value.signatureMethod === "digital") {
    if (!signatureData.value) {
      errors.value.digitalSignature =
        "Sila tandatangan pada ruang yang disediakan";
    }
  }

  console.log("Validation errors:", errors.value); // Debug log
  const isValid = Object.keys(errors.value).length === 0;
  console.log("Form is valid:", isValid); // Debug log

  return isValid;
};

// Submit receipt confirmation
const submitReceipt = async () => {
  console.log("submitReceipt called"); // Debug log
  console.log("Current receiptData:", receiptData.value); // Debug log

  if (!validateForm()) {
    console.log("Form validation failed, errors:", errors.value); // Debug log
    // Focus on first error
    const firstErrorField = Object.keys(errors.value)[0];
    const element = document.querySelector(`[name="${firstErrorField}"]`);
    if (element) {
      element.focus();
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    return;
  }

  console.log("Form validation passed, proceeding with submission"); // Debug log
  isSubmitting.value = true;

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Store signature data
    if (receiptData.value.signatureMethod === "digital") {
      receiptData.value.digitalSignature = signatureData.value;
    }

    // Convert datetime-local format back to ISO string for storage
    const receiptDateTime = new Date(
      receiptData.value.receiptDate
    ).toISOString();

    // Update application data with receipt info
    const updatedApplication = {
      ...applicationData.value,
      receiptData: {
        ...receiptData.value,
        receiptDate: receiptDateTime,
      },
      status: "Selesai",
      receiptCompletedAt: receiptDateTime,
      completedBy: "System",
    };

    localStorage.setItem(
      "currentApplication",
      JSON.stringify(updatedApplication)
    );

    showSuccessAlert.value = true;
    isReceiptComplete.value = true;
    isPrintReady.value = true;

    console.log("Receipt completed successfully"); // Debug log
  } catch (error) {
    console.error("Error submitting receipt:", error);
    // Show error alert
    alert("Ralat berlaku semasa memproses slip penerimaan. Sila cuba lagi.");
  } finally {
    isSubmitting.value = false;
  }
};

// Handle form submit event
const handleFormSubmit = (event) => {
  console.log("Form submit event triggered:", event); // Debug log
  submitReceipt();
};

// Handle button click directly
const handleButtonClick = () => {
  console.log("Button clicked directly"); // Debug log
  submitReceipt();
};

// Print receipt
const printReceipt = () => {
  console.log("Print receipt called"); // Debug log
  window.print();
};

// Complete process and redirect
const completeProcess = () => {
  console.log("Complete process called"); // Debug log
  // Auto redirect after completion notification
  setTimeout(() => {
    router.push("/BF-PRF/AS/QS-1/notifikasi-jejak-audit");
  }, 2000);
};

// Safe access to applicant data
const getApplicantName = () => {
  return ("Imah");
};

const getApplicantIC = () => {
  return ("9999999");
};

const getApplicationId = () => {
  return ("Tidak tersedia");
};

const getAssistanceType = () => {
  return "Bantuan Kecemasan";
};

const getCashAmount = () => {
  return (
    "200"
  );
};

const getHandoverLocation = () => {
  return "Cawangan Kuala Selangor";
};

const getHandoverDateTime = () => {
  return new Date().toISOString();
};

// Format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("ms-MY", {
    style: "currency",
    currency: "MYR",
  }).format(amount);
};

// Format date time
const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleString("ms-MY", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Format date only
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("ms-MY", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
</script>

<template>
  <div>
    <!-- Loading State -->
    <div v-if="isLoading" class="nas-loading-container">
      <div class="nas-loading-content">
        <Icon name="heroicons:arrow-path" class="nas-loading-spinner" />
        <p class="nas-loading-text">Memuat data slip penerimaan...</p>
      </div>
    </div>

    <template v-else>
      <!-- Success Alert -->
      <RsAlert
        v-if="showSuccessAlert"
        type="success"
        class="nas-success-alert"
        dismissible
        role="alert"
        aria-live="polite"
      >
        <template #icon>
          <Icon name="heroicons:check-circle" />
        </template>
        <div>
          <h3 class="nas-alert-title">Slip Penerimaan Berjaya Dijana</h3>
          <p class="nas-alert-description">
            Slip penerimaan bantuan telah berjaya dijana. Proses bantuan
            kecemasan telah selesai.
          </p>
        </div>
      </RsAlert>

      <!-- Page Header -->
      <div class="nas-page-header">
        <div class="nas-header-content">
          <div class="nas-header-icon">
            <Icon name="heroicons:document-text" class="nas-icon-primary" />
          </div>
          <div class="nas-header-text">
            <h1 class="nas-page-title">Slip Penerimaan Bantuan</h1>
            <p class="nas-page-description">
              Pemohon tandatangan & cetak slip penerimaan
            </p>
          </div>
        </div>
      </div>

      <!-- Main Content Layout -->
      <div class="nas-main-layout">
        <!-- Receipt Slip -->
        <div class="nas-receipt-section">
          <RsCard class="nas-receipt-card">
            <template #header>
              <div class="nas-receipt-header">
                <div class="nas-logo-section">
                  <!-- LZS Logo placeholder -->
                  <div class="nas-logo-placeholder">
                    <Icon
                      name="heroicons:building-office-2"
                      class="nas-logo-icon"
                    />
                  </div>
                  <div class="nas-org-info">
                    <h2 class="nas-org-name">LEMBAGA ZAKAT SELANGOR</h2>
                    <p class="nas-org-subtitle">New Agihan System (NAS)</p>
                  </div>
                </div>
                <div class="nas-slip-info">
                  <h3 class="nas-slip-title">SLIP PENERIMAAN BANTUAN</h3>
                  <p class="nas-slip-number">
                    No: {{ receiptData.slipNumber }}
                  </p>
                  <p class="nas-slip-date">
                    Tarikh: {{ formatDate(receiptData.receiptDate) }}
                  </p>
                </div>
              </div>
            </template>

            <div class="nas-receipt-body">
              <!-- Applicant Information -->
              <div class="nas-receipt-section">
                <h4 class="nas-receipt-section-title">MAKLUMAT PEMOHON</h4>
                <div class="nas-receipt-grid">
                  <div class="nas-receipt-item">
                    <span class="nas-receipt-label">Nama:</span>
                    <span class="nas-receipt-value">{{
                      getApplicantName()
                    }}</span>
                  </div>
                  <div class="nas-receipt-item">
                    <span class="nas-receipt-label">No. Kad Pengenalan:</span>
                    <span class="nas-receipt-value">{{
                      getApplicantIC()
                    }}</span>
                  </div>
                  <div class="nas-receipt-item">
                    <span class="nas-receipt-label">ID Permohonan:</span>
                    <span class="nas-receipt-value">{{
                      getApplicationId()
                    }}</span>
                  </div>
                </div>
              </div>

              <!-- Assistance Details -->
              <div class="nas-receipt-section">
                <h4 class="nas-receipt-section-title">BUTIRAN BANTUAN</h4>
                <div class="nas-receipt-grid">
                  <div class="nas-receipt-item">
                    <span class="nas-receipt-label">Jenis Bantuan:</span>
                    <span class="nas-receipt-value">{{
                      getAssistanceType()
                    }}</span>
                  </div>
                  <div class="nas-receipt-item">
                    <span class="nas-receipt-label">Jumlah Bantuan:</span>
                    <span class="nas-receipt-value nas-amount-highlight">
                      {{ formatCurrency(getCashAmount()) }}
                    </span>
                  </div>
                  <div class="nas-receipt-item">
                    <span class="nas-receipt-label">Lokasi Serahan:</span>
                    <span class="nas-receipt-value">{{
                      getHandoverLocation()
                    }}</span>
                  </div>
                  <div class="nas-receipt-item">
                    <span class="nas-receipt-label"
                      >Tarikh & Masa Serahan:</span
                    >
                    <span class="nas-receipt-value">{{
                      formatDateTime(getHandoverDateTime())
                    }}</span>
                  </div>
                </div>
              </div>

              <!-- Official Details -->
              <div class="nas-receipt-section">
                <h4 class="nas-receipt-section-title">MAKLUMAT RASMI</h4>
                <div class="nas-receipt-grid">
                  <div class="nas-receipt-item">
                    <span class="nas-receipt-label">Diluluskan Oleh:</span>
                    <span class="nas-receipt-value">{{
                      applicationData?.approvedBy || "PKP-001"
                    }}</span>
                  </div>
                  <div class="nas-receipt-item">
                    <span class="nas-receipt-label">Diagih Oleh:</span>
                    <span class="nas-receipt-value">{{
                      applicationData?.handedOverBy || "EKP-001"
                    }}</span>
                  </div>
                  <div class="nas-receipt-item">
                    <span class="nas-receipt-label">Saksi:</span>
                    <span class="nas-receipt-value">{{
                      receiptData.witnessName
                    }}</span>
                  </div>
                  <div class="nas-receipt-item">
                    <span class="nas-receipt-label">Dicetak Oleh:</span>
                    <span class="nas-receipt-value">{{
                      receiptData.printedBy
                    }}</span>
                  </div>
                </div>
              </div>

              <!-- Signature Section -->
              <div class="nas-signature-section">
                <h4 class="nas-receipt-section-title">TANDATANGAN PEMOHON</h4>

                <form
                  v-if="!isReceiptComplete"
                  @submit.prevent="handleFormSubmit"
                  class="nas-signature-form"
                  novalidate
                >
                  <!-- Signature Method Selection -->
                  <div class="nas-signature-method">
                    <label class="nas-field-label">Kaedah Tandatangan:</label>
                    <div
                      class="nas-radio-group"
                      role="radiogroup"
                      aria-describedby="signature-method-help"
                    >
                      <label class="nas-radio-item">
                        <input
                          v-model="receiptData.signatureMethod"
                          type="radio"
                          value="manual"
                          class="nas-radio-input"
                          name="signatureMethod"
                        />
                        <span class="nas-radio-label">Manual (Tulis Nama)</span>
                      </label>
                      <label class="nas-radio-item">
                        <input
                          v-model="receiptData.signatureMethod"
                          type="radio"
                          value="digital"
                          class="nas-radio-input"
                          name="signatureMethod"
                        />
                        <span class="nas-radio-label"
                          >Digital (Tandatangan pada Skrin)</span
                        >
                      </label>
                    </div>
                    <div id="signature-method-help" class="nas-helper-text">
                      Pilih kaedah tandatangan yang sesuai
                    </div>
                  </div>

                  <!-- Manual Signature -->
                  <div
                    v-if="receiptData.signatureMethod === 'manual'"
                    class="nas-manual-signature"
                  >
                    <label for="applicantSignature" class="nas-field-label">
                      Nama Pemohon <span class="nas-required">*</span>
                    </label>
                    <input
                      id="applicantSignature"
                      v-model="receiptData.applicantSignature"
                      name="applicantSignature"
                      type="text"
                      placeholder="Sila taip nama anda sebagai tandatangan"
                      class="nas-signature-input"
                      :class="{ 'nas-input-error': errors.applicantSignature }"
                      :aria-invalid="!!errors.applicantSignature"
                      :aria-describedby="
                        errors.applicantSignature
                          ? 'applicantSignature-error'
                          : 'applicantSignature-help'
                      "
                      autocomplete="name"
                    />
                    <div
                      v-if="errors.applicantSignature"
                      id="applicantSignature-error"
                      class="nas-error-text"
                      role="alert"
                    >
                      {{ errors.applicantSignature }}
                    </div>
                    <div
                      v-else
                      id="applicantSignature-help"
                      class="nas-helper-text"
                    >
                      Taip nama anda untuk mengesahkan penerimaan bantuan
                      (minimum 3 aksara)
                    </div>
                  </div>

                  <!-- Digital Signature -->
                  <div
                    v-if="receiptData.signatureMethod === 'digital'"
                    class="nas-digital-signature"
                  >
                    <label class="nas-field-label">
                      Tandatangan Digital <span class="nas-required">*</span>
                    </label>
                    <div class="nas-signature-canvas-container">
                      <canvas
                        ref="signatureCanvas"
                        class="nas-signature-canvas"
                        @mousedown="startDrawing"
                        @mousemove="draw"
                        @mouseup="stopDrawing"
                        @mouseleave="stopDrawing"
                        :aria-label="
                          signatureData
                            ? 'Tandatangan digital telah dibuat'
                            : 'Canvas untuk tandatangan digital'
                        "
                        role="img"
                      ></canvas>
                      <div class="nas-canvas-overlay" v-if="!signatureData">
                        <p class="nas-canvas-instruction">
                          Klik dan drag untuk tandatangan
                        </p>
                      </div>
                    </div>
                    <div
                      v-if="errors.digitalSignature"
                      class="nas-error-text"
                      role="alert"
                    >
                      {{ errors.digitalSignature }}
                    </div>
                    <div v-else class="nas-helper-text">
                      Gunakan mouse atau touch untuk menandatangan pada ruang di
                      atas
                    </div>

                    <RsButton
                      type="button"
                      variant="secondary-outline"
                      size="sm"
                      @click="clearSignature"
                      class="nas-clear-button"
                    >
                      <Icon
                        name="heroicons:arrow-path"
                        class="nas-button-icon"
                      />
                      Kosongkan
                    </RsButton>
                  </div>
                </form>

                <!-- Completed Signature Display -->
                <div v-else class="nas-completed-signature">
                  <div
                    v-if="receiptData.signatureMethod === 'manual'"
                    class="nas-manual-signature-display"
                  >
                    <div class="nas-signature-box">
                      <p class="nas-signature-text">
                        {{ receiptData.applicantSignature }}
                      </p>
                      <div class="nas-signature-line"></div>
                      <p class="nas-signature-caption">Tandatangan Pemohon</p>
                    </div>
                  </div>

                  <div
                    v-if="receiptData.signatureMethod === 'digital'"
                    class="nas-digital-signature-display"
                  >
                    <div class="nas-signature-box">
                      <img
                        :src="receiptData.digitalSignature"
                        alt="Tandatangan Digital"
                        class="nas-signature-image"
                      />
                      <div class="nas-signature-line"></div>
                      <p class="nas-signature-caption">
                        Tandatangan Pemohon (Digital)
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Receipt Footer -->
              <div class="nas-receipt-footer">
                <div class="nas-footer-note">
                  <p class="nas-footer-text">
                    <strong>Nota:</strong> Slip ini adalah bukti rasmi
                    penerimaan bantuan daripada Lembaga Zakat Selangor. Sila
                    simpan slip ini untuk rujukan pada masa hadapan.
                  </p>
                </div>
                <div class="nas-footer-info">
                  <p class="nas-footer-contact">
                    <strong>Hubungi Kami:</strong> 1-800-88-3535 |
                    info@zakatselangor.com.my
                  </p>
                </div>
              </div>
            </div>
          </RsCard>
        </div>

        <!-- Action Panel -->
        <div class="nas-action-panel" v-if="!isReceiptComplete">
          <RsCard class="nas-action-card">
            <template #header>
              <div class="nas-card-header">
                <Icon name="heroicons:pencil-square" class="nas-icon-header" />
                <h3 class="nas-section-header">Pengesahan Penerimaan</h3>
              </div>
            </template>

            <div class="nas-card-body">
              <div class="nas-confirmation-content">
                <div class="nas-confirmation-message">
                  <Icon
                    name="heroicons:information-circle"
                    class="nas-info-icon"
                  />
                  <div class="nas-message-text">
                    <h4 class="nas-message-title">Pengesahan Diperlukan</h4>
                    <p class="nas-message-description">
                      Sila sahkan penerimaan bantuan dengan menandatangani slip
                      penerimaan di atas. Setelah ditandatangani, slip boleh
                      dicetak untuk simpanan.
                    </p>
                  </div>
                </div>

                <!-- Remarks -->
                <div class="nas-remarks-section">
                  <label for="remarks" class="nas-field-label"
                    >Catatan Tambahan (Pilihan)</label
                  >
                  <textarea
                    id="remarks"
                    v-model="receiptData.remarks"
                    name="remarks"
                    placeholder="Sebarang catatan tambahan mengenai penerimaan bantuan"
                    class="nas-form-textarea"
                    rows="3"
                    maxlength="300"
                    :aria-describedby="'remarks-help'"
                  ></textarea>
                  <div id="remarks-help" class="nas-helper-text">
                    Catatan ini akan disimpan bersama rekod bantuan -
                    {{ receiptData.remarks.length }}/300 aksara
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="nas-action-buttons">
                  <RsButton
                    type="button"
                    variant="secondary-outline"
                    size="lg"
                    @click="router.push('/BF-PRF/AS/QS-1/serah-terima-tunai')"
                    :disabled="isSubmitting"
                  >
                    <Icon name="heroicons:arrow-left" class="nas-button-icon" />
                    Kembali
                  </RsButton>

                  <RsButton
                    type="button"
                    variant="success"
                    size="lg"
                    @click="handleButtonClick"
                    :loading="isSubmitting"
                    :disabled="isReceiptComplete || isSubmitting"
                    :aria-describedby="
                      isSubmitting ? 'submit-status' : undefined
                    "
                  >
                    <Icon
                      name="heroicons:check-circle"
                      class="nas-button-icon"
                    />
                    {{ isSubmitting ? "Memproses..." : "Selesai Agihan" }}
                  </RsButton>
                </div>

                <div
                  v-if="isSubmitting"
                  id="submit-status"
                  class="nas-sr-only"
                  aria-live="polite"
                >
                  Sedang memproses pengesahan penerimaan...
                </div>
              </div>
            </div>
          </RsCard>
        </div>

        <!-- Print Panel -->
        <div class="nas-print-panel" v-if="isReceiptComplete && isPrintReady">
          <RsCard class="nas-print-card">
            <template #header>
              <div class="nas-card-header">
                <Icon name="heroicons:printer" class="nas-icon-header" />
                <h3 class="nas-section-header">Cetak Slip</h3>
              </div>
            </template>

            <div class="nas-card-body">
              <div class="nas-print-content">
                <div class="nas-print-message">
                  <Icon
                    name="heroicons:check-circle"
                    class="nas-success-icon"
                  />
                  <div class="nas-message-text">
                    <h4 class="nas-message-title">Slip Penerimaan Sedia</h4>
                    <p class="nas-message-description">
                      Slip penerimaan bantuan telah berjaya dijana dan sedia
                      untuk dicetak.
                    </p>
                  </div>
                </div>

                <!-- Print Actions -->
                <div class="nas-print-actions">
                  <RsButton
                    type="button"
                    variant="primary"
                    size="lg"
                    @click="printReceipt"
                  >
                    <Icon name="heroicons:printer" class="nas-button-icon" />
                    Cetak Slip
                  </RsButton>

                  <RsButton
                    type="button"
                    variant="success"
                    size="lg"
                    @click="completeProcess"
                  >
                    <Icon
                      name="heroicons:arrow-right"
                      class="nas-button-icon"
                    />
                    Selesai
                  </RsButton>
                </div>
              </div>
            </div>
          </RsCard>
        </div>
      </div>
    </template>
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

.nas-page-description {
  font-size: 14px;
  font-weight: 400;
  color: #6b7280;
  line-height: 1.5;
}

/* Page Header */
.nas-page-header {
  margin-bottom: 32px; /* 24px + 8px spacing scale */
}

.nas-header-content {
  display: flex;
  align-items: center;
}

.nas-header-icon {
  width: 48px;
  height: 48px;
  background-color: rgba(
    0,
    90,
    173,
    0.1
  ); /* LZS Primary Blue with 10% opacity */
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

/* Alert Styles */
.nas-success-alert {
  margin-bottom: 24px;
}

.nas-alert-title {
  font-size: 16px;
  font-weight: 600;
  color: #047857; /* Updated to success color per specifications */
  margin-bottom: 4px;
  line-height: 1.5;
}

.nas-alert-description {
  font-size: 14px;
  font-weight: 400;
  color: #047857; /* Updated to success color per specifications */
  line-height: 1.5;
}

/* Main Layout */
.nas-main-layout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px; /* 24px gap per grid specifications */
}

@media (max-width: 1024px) {
  .nas-main-layout {
    grid-template-columns: 1fr;
    gap: 24px; /* Maintain 24px gap on mobile */
  }
}

/* Receipt Card */
.nas-receipt-card {
  border: 2px solid #005aad; /* LZS Primary Blue */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.nas-receipt-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 24px; /* Updated padding per specifications */
  border-bottom: 2px solid #005aad; /* LZS Primary Blue */
}

.nas-logo-section {
  display: flex;
  align-items: center;
}

.nas-logo-placeholder {
  width: 60px;
  height: 60px;
  background-color: #005aad; /* LZS Primary Blue */
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
}

.nas-logo-icon {
  width: 32px;
  height: 32px;
  color: white;
}

.nas-org-name {
  font-size: 18px;
  font-weight: 700;
  color: #005aad; /* LZS Primary Blue */
  margin-bottom: 4px;
  line-height: 1.2;
}

.nas-org-subtitle {
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  line-height: 1.2;
}

.nas-slip-info {
  text-align: right;
}

.nas-slip-title {
  font-size: 16px;
  font-weight: 700;
  color: #005aad; /* LZS Primary Blue */
  margin-bottom: 8px;
  line-height: 1.2;
}

.nas-slip-number,
.nas-slip-date {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 4px;
  line-height: 1.2;
}

/* Receipt Body */
.nas-receipt-body {
  padding: 24px; /* Updated to 24px padding per specifications */
}

.nas-receipt-section {
  padding: 20px 0;
  border-bottom: 1px solid #e5e7eb;
}

.nas-receipt-section:last-child {
  border-bottom: none;
}

.nas-receipt-section-title {
  font-size: 16px;
  font-weight: 600;
  color: #005aad; /* LZS Primary Blue */
  margin-bottom: 16px;
  line-height: 1.5;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.nas-receipt-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px; /* Consistent spacing */
}

@media (max-width: 768px) {
  .nas-receipt-grid {
    grid-template-columns: 1fr;
  }
}

.nas-receipt-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background-color: #f9fafb;
  border-radius: 6px;
  font-size: 14px;
}

.nas-receipt-label {
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  margin-right: 16px;
  flex-shrink: 0;
}

.nas-receipt-value {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  text-align: right;
  flex: 1;
}

.nas-amount-highlight {
  color: #005aad !important; /* LZS Primary Blue */
  font-size: 16px !important;
  font-weight: 700 !important;
  font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
}

/* Signature Section */
.nas-signature-section {
  background-color: rgba(
    0,
    90,
    173,
    0.05
  ); /* LZS Primary Blue with 5% opacity */
  border-radius: 8px;
  padding: 24px; /* Updated padding per specifications */
  margin-top: 16px;
  border: 1px solid rgba(0, 90, 173, 0.1);
}

.nas-signature-form {
  margin-top: 16px;
}

.nas-signature-method {
  margin-bottom: 20px;
}

.nas-field-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px; /* 8px spacing per specifications */
  line-height: 1.5;
}

.nas-radio-group {
  display: flex;
  gap: 16px; /* 16px spacing per specifications */
}

.nas-radio-item {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.nas-radio-input {
  margin-right: 8px;
  color: #005aad; /* LZS Primary Blue */
}

.nas-radio-label {
  font-size: 14px;
  font-weight: 400;
  color: #374151;
}

/* Manual Signature */
.nas-signature-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px; /* Updated to 8px border radius */
  font-size: 16px;
  font-weight: 500;
  color: #1f2937;
  font-family: cursive;
  background-color: #ffffff;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  line-height: 1.5;
}

.nas-signature-input:focus {
  outline: none;
  border-color: #005aad; /* LZS Primary Blue */
  box-shadow: 0 0 0 3px rgba(0, 90, 173, 0.1);
}

/* Digital Signature */
.nas-signature-canvas-container {
  position: relative;
  border: 2px dashed #005aad; /* LZS Primary Blue */
  border-radius: 8px;
  background-color: #ffffff;
  margin-bottom: 12px;
}

.nas-signature-canvas {
  display: block;
  width: 100%;
  height: 200px;
  cursor: crosshair;
  border-radius: 6px;
}

.nas-canvas-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  background-color: rgba(249, 250, 251, 0.8);
  border-radius: 6px;
}

.nas-canvas-instruction {
  font-size: 14px;
  color: #6b7280;
  text-align: center;
}

.nas-clear-button {
  margin-top: 8px;
}

/* Completed Signature */
.nas-signature-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px; /* Updated padding per specifications */
  background-color: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  min-height: 120px;
  justify-content: center;
}

.nas-signature-text {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  font-family: cursive;
  margin-bottom: 16px;
}

.nas-signature-image {
  max-width: 200px;
  max-height: 80px;
  margin-bottom: 16px;
}

.nas-signature-line {
  width: 200px;
  height: 1px;
  background-color: #374151;
  margin-bottom: 8px;
}

.nas-signature-caption {
  font-size: 12px;
  font-weight: 500;
  color: #6b7280;
  text-align: center;
}

/* Receipt Footer */
.nas-receipt-footer {
  background-color: rgba(
    0,
    90,
    173,
    0.05
  ); /* LZS Primary Blue with 5% opacity */
  border-radius: 8px;
  padding: 16px;
  margin-top: 20px;
  border: 1px solid rgba(0, 90, 173, 0.1);
}

.nas-footer-note {
  margin-bottom: 12px;
}

.nas-footer-text {
  font-size: 12px;
  color: #374151;
  line-height: 1.5;
}

.nas-footer-contact {
  font-size: 12px;
  color: #6b7280;
  text-align: center;
}

/* Action Panel */
.nas-card-header {
  display: flex;
  align-items: center;
  padding: 24px 24px 0 24px; /* Consistent spacing per specifications */
}

.nas-icon-header {
  width: 24px;
  height: 24px;
  color: #005aad; /* LZS Primary Blue */
  margin-right: 8px;
}

.nas-card-body {
  padding: 24px; /* Updated to 24px padding per specifications */
}

.nas-confirmation-content {
  display: flex;
  flex-direction: column;
  gap: 24px; /* 24px vertical spacing per specifications */
}

.nas-confirmation-message {
  display: flex;
  align-items: flex-start;
  padding: 16px;
  background-color: rgba(
    0,
    90,
    173,
    0.1
  ); /* LZS Primary Blue with 10% opacity */
  border: 1px solid rgba(0, 90, 173, 0.2); /* LZS Primary Blue with 20% opacity */
  border-radius: 8px;
}

.nas-message-title {
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 4px;
  line-height: 1.5;
}

.nas-message-description {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
}

/* Form Elements */
.nas-form-textarea {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px; /* Updated to 8px border radius */
  font-size: 14px;
  font-weight: 400;
  color: #1f2937;
  background-color: #ffffff;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  line-height: 1.5;
  resize: vertical;
}

.nas-form-textarea:focus {
  outline: none;
  border-color: #005aad; /* LZS Primary Blue */
  box-shadow: 0 0 0 3px rgba(0, 90, 173, 0.1);
}

.nas-helper-text {
  font-size: 12px;
  font-weight: 400;
  color: #6b7280;
  margin-top: 4px;
  line-height: 1.5;
}

.nas-error-text {
  font-size: 12px;
  font-weight: 500;
  color: #dc2626; /* Updated to specifications error color */
  margin-top: 4px;
  line-height: 1.5;
}

.nas-input-error {
  border-color: #dc2626; /* Updated to specifications error color */
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
}

.nas-required {
  color: #dc2626; /* Updated to specifications error color */
  margin-left: 2px;
}

/* Action Buttons */
.nas-action-buttons,
.nas-print-actions {
  display: flex;
  justify-content: space-between;
  gap: 16px; /* 16px gap per specifications */
}

@media (max-width: 768px) {
  .nas-action-buttons,
  .nas-print-actions {
    flex-direction: column;
    gap: 16px; /* Maintain 16px gap on mobile */
  }
}

.nas-button-icon {
  width: 20px;
  height: 20px;
  margin-right: 8px;
}

/* Loading State */
.nas-loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
  padding: 48px 24px;
}

.nas-loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.nas-loading-spinner {
  width: 32px;
  height: 32px;
  color: #005aad; /* LZS Primary Blue */
  animation: nas-spin 1s linear infinite;
}

.nas-loading-text {
  font-size: 16px;
  font-weight: 500;
  color: #6b7280;
  margin: 0;
  text-align: center;
}

@keyframes nas-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Screen Reader Only */
.nas-sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Enhanced Focus States for Accessibility */
.nas-signature-input:focus,
.nas-form-textarea:focus {
  outline: none;
  border-color: #005aad; /* LZS Primary Blue */
  box-shadow: 0 0 0 3px rgba(0, 90, 173, 0.1);
  z-index: 1;
  position: relative;
}

/* High Contrast Mode Support */
@media (prefers-contrast: high) {
  .nas-signature-input,
  .nas-form-textarea {
    border-width: 2px;
  }

  .nas-input-error {
    border-width: 3px;
  }
}

/* Reduced Motion Support */
@media (prefers-reduced-motion: reduce) {
  .nas-loading-spinner {
    animation: none;
  }

  .nas-signature-input,
  .nas-form-textarea {
    transition: none;
  }
}

/* Print Styles */
@media print {
  .nas-page-header,
  .nas-action-panel,
  .nas-print-panel,
  .nas-success-alert {
    display: none !important;
  }

  .nas-main-layout {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .nas-receipt-card {
    border: none;
    box-shadow: none;
  }

  .nas-container {
    padding: 0;
    max-width: none;
  }
}

/* Responsive adjustments */
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
    gap: 12px;
  }
}

/* Print Panel */
.nas-print-panel {
  display: flex;
  flex-direction: column;
}

.nas-print-card {
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background-color: #ffffff;
}

.nas-print-content {
  display: flex;
  flex-direction: column;
  gap: 24px; /* 24px vertical spacing per specifications */
}

.nas-print-message {
  display: flex;
  align-items: flex-start;
  padding: 16px;
  background-color: rgba(
    4,
    120,
    87,
    0.1
  ); /* Success color with 10% opacity */
  border: 1px solid rgba(4, 120, 87, 0.2); /* Success color with 20% opacity */
  border-radius: 8px;
}
</style>
>>>>>>> 3dcc227fdaa7aaa5e054a6ffebfa8addde014eae
