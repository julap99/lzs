<script setup>
definePageMeta({
  title: "Sahkan Pengeluaran",
  breadcrumb: [
    {
      name: "Pendaftaran Pantas",
      path: "/BF-PRF/AS/QS-1",
    },
    {
      name: "Sahkan Pengeluaran",
      type: "current",
    },
  ],
});

const router = useRouter();

// Get application data
const applicationData = ref(null);
const applicantProfile = ref(null);
const approvalData = ref(null);

// Cash disbursement data
const disbursementData = ref({
  namaEkp: "",
  noKaunter: "",
  jumlahDiluluskan: "",
  tarikhMasa: "", // Will be set properly in onMounted
  idPetiBesi: "PBS-001",
  jenisAkaun: "Bantuan Kecemasan",
  bakiSemasaSebelum: 0,
  bakiSemasaSelepas: 0,
  slipRekod: "",
  catatanPkp: "",
});

// Form validation
const errors = ref({});
const isSubmitting = ref(false);
const showSuccessAlert = ref(false);
const isDisbursementComplete = ref(false);
const isLoading = ref(true);

// Mock safe box data
const safeBoxData = ref({
  id: "PBS-001",
  jenisAkaun: "Bantuan Kecemasan",
  bakiSemasa: 47500, // Assuming some amount has been deducted from approval
  floatMinimum: 10000,
  lastUpdated: new Date().toISOString(),
});

// EKP counter options
const countersOptions = [
  { value: "KC-001", label: "Kaunter 1" },
  { value: "KC-002", label: "Kaunter 2" },
  { value: "KC-003", label: "Kaunter 3" },
  { value: "KC-004", label: "Kaunter 4" },
  { value: "KC-005", label: "Kaunter 5" },
];

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

onMounted(async () => {
  try {
    console.log("onMounted: Loading application data"); // Debug log
    // Get application data from localStorage
    const storedApplication = localStorage.getItem("currentApplication");
    if (storedApplication) {
      const appData = JSON.parse(storedApplication);
      console.log("onMounted: Application data loaded:", appData); // Debug log
      applicationData.value = appData;

      // Safe access to nested properties
      applicantProfile.value =
        appData.profileData || appData.applicantProfile || null;
      approvalData.value = appData.approvalData || null;

      // Check if this application has been approved
      if (appData.status !== "Diluluskan") {
        console.log("onMounted: Application not approved, redirecting"); // Debug log
        await navigateTo("/BF-PRF/AS/QS-1");
        return;
      }

      // Pre-fill disbursement data with proper validation
      if (appData.approvalData?.jumlahDisetujui) {
        disbursementData.value.jumlahDiluluskan =
          appData.approvalData.jumlahDisetujui;
        disbursementData.value.bakiSemasaSebelum = safeBoxData.value.bakiSemasa;
        disbursementData.value.bakiSemasaSelepas = Math.max(
          0,
          safeBoxData.value.bakiSemasa -
            parseFloat(appData.approvalData.jumlahDisetujui)
        );
      }

      // Set current date and time in proper format for datetime-local
      disbursementData.value.tarikhMasa = formatDateTimeLocal(new Date());

      console.log(
        "onMounted: Disbursement data initialized:",
        disbursementData.value
      ); // Debug log
    } else {
      console.log("onMounted: No application data found, redirecting"); // Debug log
      // Redirect if no application data
      await navigateTo("/BF-PRF/AS/QS-1");
    }
  } catch (error) {
    console.error("Error loading application data:", error);
    await navigateTo("/BF-PRF/AS/QS-1");
  } finally {
    isLoading.value = false;
  }
});

// Watch for changes in jumlahDiluluskan to update bakiSemasaSelepas
watch(
  () => disbursementData.value.jumlahDiluluskan,
  (newAmount) => {
    if (newAmount && !isNaN(parseFloat(newAmount))) {
      disbursementData.value.bakiSemasaSebelum = safeBoxData.value.bakiSemasa;
      disbursementData.value.bakiSemasaSelepas = Math.max(
        0,
        safeBoxData.value.bakiSemasa - parseFloat(newAmount)
      );
      console.log(
        "Amount changed, new balance:",
        disbursementData.value.bakiSemasaSelepas
      ); // Debug log
    }
  }
);

// Form validation
const validateForm = () => {
  console.log("validateForm called"); // Debug log
  errors.value = {};

  if (!disbursementData.value.namaEkp.trim()) {
    errors.value.namaEkp = "Sila masukkan nama EKP";
  } else if (disbursementData.value.namaEkp.trim().length < 3) {
    errors.value.namaEkp = "Nama EKP mestilah sekurang-kurangnya 3 aksara";
  }

  if (!disbursementData.value.noKaunter) {
    errors.value.noKaunter = "Sila pilih nombor kaunter";
  }

  if (
    !disbursementData.value.jumlahDiluluskan ||
    disbursementData.value.jumlahDiluluskan <= 0
  ) {
    errors.value.jumlahDiluluskan = "Jumlah yang sah diperlukan";
  } else if (isNaN(parseFloat(disbursementData.value.jumlahDiluluskan))) {
    errors.value.jumlahDiluluskan = "Jumlah mestilah nombor yang sah";
  }

  // Check safe box balance
  if (
    disbursementData.value.bakiSemasaSelepas < safeBoxData.value.floatMinimum
  ) {
    errors.value.bakiSemasa = "Baki tidak mencukupi untuk pengeluaran ini";
  }

  // Validate datetime
  if (!disbursementData.value.tarikhMasa) {
    errors.value.tarikhMasa = "Tarikh dan masa diperlukan";
  }

  console.log("Validation errors:", errors.value); // Debug log
  const isValid = Object.keys(errors.value).length === 0;
  console.log("Form is valid:", isValid); // Debug log

  return isValid;
};

// Submit cash disbursement
const submitDisbursement = async () => {
  console.log("submitDisbursement called"); // Debug log
  console.log("Current disbursementData:", disbursementData.value); // Debug log

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

    // Convert datetime-local format back to ISO string for storage
    const disbursementDateTime = new Date(
      disbursementData.value.tarikhMasa
    ).toISOString();

    // Update application data with disbursement info
    const updatedApplication = {
      ...applicationData.value,
      disbursementData: {
        ...disbursementData.value,
        tarikhMasa: disbursementDateTime,
      },
      status: "Tunai Disahkan",
      disbursementCompletedAt: disbursementDateTime,
      disbursedBy: "PKP-001", // This would come from logged-in user
    };

    // Update safe box balance
    safeBoxData.value.bakiSemasa = disbursementData.value.bakiSemasaSelepas;
    safeBoxData.value.lastUpdated = disbursementDateTime;

    // Generate slip record reference
    disbursementData.value.slipRekod = "SR-" + Date.now().toString().slice(-8);

    localStorage.setItem(
      "currentApplication",
      JSON.stringify(updatedApplication)
    );
    localStorage.setItem("safeBoxData", JSON.stringify(safeBoxData.value));

    showSuccessAlert.value = true;
    isDisbursementComplete.value = true;

    console.log("Disbursement completed successfully"); // Debug log

    // Auto redirect after 5 seconds
    setTimeout(() => {
      router.push("/BF-PRF/AS/QS-1/serah-terima-tunai");
    }, 5000);
  } catch (error) {
    console.error("Error submitting disbursement:", error);
    // Show error alert
    alert("Ralat berlaku semasa memproses pengeluaran. Sila cuba lagi.");
  } finally {
    isSubmitting.value = false;
  }
};

// Handle form submit event
const handleFormSubmit = (event) => {
  console.log("Form submit event triggered:", event); // Debug log
  submitDisbursement();
};

// Handle button click directly
const handleButtonClick = () => {
  console.log("Button clicked directly"); // Debug log
  submitDisbursement();
};

// Calculate available amount safely
const availableAmount = computed(() => {
  return Math.max(
    0,
    safeBoxData.value.bakiSemasa - safeBoxData.value.floatMinimum
  );
});

// Format currency
const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return "RM 0.00";
  return new Intl.NumberFormat("ms-MY", {
    style: "currency",
    currency: "MYR",
  }).format(amount);
};

// Format date time for display
const formatDateTime = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleString("ms-MY", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Safe access to applicant data
const getApplicantName = () => {
  return (
    applicationData.value?.nama ||
    applicantProfile.value?.nama ||
    applicantProfile.value?.personalInfo?.nama ||
    "Tidak tersedia"
  );
};

const getApplicantIC = () => {
  return (
    applicationData.value?.noKp ||
    applicantProfile.value?.noKp ||
    applicantProfile.value?.personalInfo?.noKp ||
    "Tidak tersedia"
  );
};
</script>

<template>
  <div>
    <!-- Loading State -->
    <div v-if="isLoading" class="nas-loading-container">
      <div class="nas-loading-content">
        <Icon name="heroicons:arrow-path" class="nas-loading-spinner" />
        <p class="nas-loading-text">Memuat data permohonan...</p>
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
          <h3 class="nas-alert-title">Pengeluaran Tunai Berjaya Disahkan</h3>
          <p class="nas-alert-description">
            Tunai sebanyak
            {{ formatCurrency(disbursementData.jumlahDiluluskan) }} telah
            disahkan untuk pengeluaran. Slip rekod:
            {{ disbursementData.slipRekod }}. Sistem akan membawa anda ke
            langkah seterusnya.
          </p>
        </div>
      </RsAlert>

      <!-- Page Header -->
      <div class="nas-page-header">
        <div class="nas-header-content">
          <div class="nas-header-icon">
            <Icon name="heroicons:banknotes" class="nas-icon-primary" />
          </div>
          <div class="nas-header-text">
            <h1 class="nas-page-title">Sahkan Pengeluaran Tunai (Peti Besi)</h1>
            <p class="nas-page-description">
              Keluarkan tunai dan serahkan kepada EKP
            </p>
          </div>
        </div>
      </div>

      <!-- Main Content Layout -->
      <div class="nas-layout-grid">
        <!-- Left Column: Application Summary -->
        <div class="nas-left-column">
          <RsCard class="nas-summary-card">
            <template #header>
              <div class="nas-card-header">
                <Icon name="heroicons:document-text" class="nas-icon-header" />
                <h2 class="nas-section-header">Ringkasan Permohonan</h2>
              </div>
            </template>

            <div class="nas-card-body">
              <!-- Applicant Information -->
              <div class="nas-info-section">
                <div class="nas-info-group">
                  <h3 class="nas-group-title">Maklumat Pemohon</h3>
                  <div class="nas-info-grid">
                    <div class="nas-info-field">
                      <span class="nas-field-label">Nama:</span>
                      <span class="nas-field-value">{{
                        getApplicantName()
                      }}</span>
                    </div>
                    <div class="nas-info-field">
                      <span class="nas-field-label">No. KP:</span>
                      <span class="nas-field-value nas-mono">{{
                        getApplicantIC()
                      }}</span>
                    </div>
                    <div class="nas-info-field">
                      <span class="nas-field-label">Jenis Bantuan:</span>
                      <span class="nas-field-value">{{
                        applicationData?.jenisBantuan || "Tidak tersedia"
                      }}</span>
                    </div>
                    <div class="nas-info-field">
                      <span class="nas-field-label">Jumlah Diluluskan:</span>
                      <span class="nas-field-value nas-amount-highlight">
                        {{ formatCurrency(approvalData?.jumlahDisetujui) }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Safe Box Information -->
                <div class="nas-info-group">
                  <h3 class="nas-group-title">Paparan Peti Besi</h3>
                  <div class="nas-safebox-info">
                    <div class="nas-safebox-item">
                      <span class="nas-safebox-label">ID Peti Besi:</span>
                      <span class="nas-safebox-value nas-mono">{{
                        safeBoxData.id
                      }}</span>
                    </div>
                    <div class="nas-safebox-item">
                      <span class="nas-safebox-label">Jenis Akaun:</span>
                      <span class="nas-safebox-value">{{
                        safeBoxData.jenisAkaun
                      }}</span>
                    </div>
                    <div class="nas-safebox-item">
                      <span class="nas-safebox-label">Baki Semasa:</span>
                      <span class="nas-safebox-value nas-amount-highlight">
                        {{ formatCurrency(safeBoxData.bakiSemasa) }}
                      </span>
                    </div>
                    <div class="nas-safebox-item">
                      <span class="nas-safebox-label">Float Minimum:</span>
                      <span class="nas-safebox-value">{{
                        formatCurrency(safeBoxData.floatMinimum)
                      }}</span>
                    </div>
                    <div class="nas-safebox-item">
                      <span class="nas-safebox-label">Jumlah Tersedia:</span>
                      <span class="nas-safebox-value nas-available-amount">
                        {{ formatCurrency(availableAmount) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </RsCard>
        </div>

        <!-- Right Column: Disbursement Form -->
        <div class="nas-right-column">
          <RsCard class="nas-form-card">
            <template #header>
              <div class="nas-card-header">
                <Icon
                  name="heroicons:clipboard-document-check"
                  class="nas-icon-header"
                />
                <h2 class="nas-section-header">Borang Pengeluaran Tunai</h2>
              </div>
            </template>

            <div class="nas-card-body">
              <form
                @submit.prevent="handleFormSubmit"
                class="nas-form"
                novalidate
              >
                <!-- EKP Information -->
                <div class="nas-form-section">
                  <h3 class="nas-subsection-header">Maklumat EKP & Kaunter</h3>

                  <div class="nas-field-grid">
                    <!-- Nama EKP -->
                    <div class="nas-field-full">
                      <label for="namaEkp" class="nas-field-label">
                        Nama EKP <span class="nas-required">*</span>
                      </label>
                      <input
                        id="namaEkp"
                        v-model="disbursementData.namaEkp"
                        name="namaEkp"
                        type="text"
                        placeholder="Masukkan nama EKP yang akan menerima tunai"
                        class="nas-form-input"
                        :class="{ 'nas-input-error': errors.namaEkp }"
                        :aria-invalid="!!errors.namaEkp"
                        :aria-describedby="
                          errors.namaEkp ? 'namaEkp-error' : 'namaEkp-help'
                        "
                        autocomplete="name"
                        required
                      />
                      <div
                        v-if="errors.namaEkp"
                        id="namaEkp-error"
                        class="nas-error-text"
                        role="alert"
                      >
                        {{ errors.namaEkp }}
                      </div>
                      <div v-else id="namaEkp-help" class="nas-helper-text">
                        Nama EKP yang bertanggungjawab menerima tunai
                      </div>
                    </div>

                    <!-- No Kaunter -->
                    <div class="nas-field-half">
                      <label for="noKaunter" class="nas-field-label">
                        No. Kaunter <span class="nas-required">*</span>
                      </label>
                      <select
                        id="noKaunter"
                        v-model="disbursementData.noKaunter"
                        name="noKaunter"
                        class="nas-form-select"
                        :class="{ 'nas-input-error': errors.noKaunter }"
                        :aria-invalid="!!errors.noKaunter"
                        :aria-describedby="
                          errors.noKaunter
                            ? 'noKaunter-error'
                            : 'noKaunter-help'
                        "
                        required
                      >
                        <option value="">Sila pilih kaunter</option>
                        <option
                          v-for="counter in countersOptions"
                          :key="counter.value"
                          :value="counter.value"
                        >
                          {{ counter.label }}
                        </option>
                      </select>
                      <div
                        v-if="errors.noKaunter"
                        id="noKaunter-error"
                        class="nas-error-text"
                        role="alert"
                      >
                        {{ errors.noKaunter }}
                      </div>
                      <div v-else id="noKaunter-help" class="nas-helper-text">
                        Lokasi kaunter untuk serahan tunai
                      </div>
                    </div>

                    <!-- Tarikh & Masa -->
                    <div class="nas-field-half">
                      <label for="tarikhMasa" class="nas-field-label"
                        >Tarikh & Masa Serahan</label
                      >
                      <input
                        id="tarikhMasa"
                        v-model="disbursementData.tarikhMasa"
                        name="tarikhMasa"
                        type="datetime-local"
                        class="nas-form-input"
                        :class="{ 'nas-input-error': errors.tarikhMasa }"
                        :aria-invalid="!!errors.tarikhMasa"
                        :aria-describedby="
                          errors.tarikhMasa
                            ? 'tarikhMasa-error'
                            : 'tarikhMasa-help'
                        "
                        readonly
                      />
                      <div
                        v-if="errors.tarikhMasa"
                        id="tarikhMasa-error"
                        class="nas-error-text"
                        role="alert"
                      >
                        {{ errors.tarikhMasa }}
                      </div>
                      <div v-else id="tarikhMasa-help" class="nas-helper-text">
                        Masa serahan tunai (automatik)
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Disbursement Details -->
                <div class="nas-form-section">
                  <h3 class="nas-subsection-header">Butiran Pengeluaran</h3>

                  <div class="nas-field-grid">
                    <!-- Jumlah Diluluskan -->
                    <div class="nas-field-half">
                      <FormKit
                        type="money"
                        name="jumlahDiluluskan"
                        label="Jumlah Tunai Diagihkan"
                        v-model="disbursementData.jumlahDiluluskan"
                        :disabled="true"
                        :validation="'required|min:0'"
                        :validation-messages="{
                          required: 'Jumlah yang sah diperlukan',
                          min: 'Jumlah mestilah lebih dari 0',
                        }"
                        help="Jumlah yang diluluskan oleh PKP"
                      />
                    </div>

                    <!-- Baki Selepas -->
                    <div class="nas-field-half">
                      <FormKit
                        type="money"
                        name="bakiSemasaSelepas"
                        label="Baki Selepas Pengeluaran"
                        v-model="disbursementData.bakiSemasaSelepas"
                        :disabled="true"
                        help="Baki baru selepas pengeluaran"
                      />
                    </div>

                    <!-- Balance Warning -->
                    <div
                      v-if="
                        disbursementData.bakiSemasaSelepas <
                        safeBoxData.floatMinimum
                      "
                      class="nas-field-full"
                    >
                      <RsAlert
                        type="warning"
                        class="nas-balance-warning"
                        role="alert"
                      >
                        <template #icon>
                          <Icon name="heroicons:exclamation-triangle" />
                        </template>
                        <div>
                          <h4 class="nas-alert-title">Amaran Baki Minimum</h4>
                          <p class="nas-alert-description">
                            Baki selepas pengeluaran akan berada di bawah float
                            minimum sebanyak
                            {{ formatCurrency(safeBoxData.floatMinimum) }}.
                          </p>
                        </div>
                      </RsAlert>
                    </div>

                    <!-- Catatan PKP -->
                    <div class="nas-field-full">
                      <label for="catatanPkp" class="nas-field-label"
                        >Catatan PKP</label
                      >
                      <textarea
                        id="catatanPkp"
                        v-model="disbursementData.catatanPkp"
                        name="catatanPkp"
                        placeholder="Masukkan sebarang catatan tambahan untuk pengeluaran ini"
                        class="nas-form-textarea"
                        rows="3"
                        maxlength="500"
                        :aria-describedby="'catatanPkp-help'"
                      ></textarea>
                      <div id="catatanPkp-help" class="nas-helper-text">
                        Catatan tambahan (pilihan) -
                        {{ disbursementData.catatanPkp.length }}/500 aksara
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Slip Information -->
                <div v-if="isDisbursementComplete" class="nas-form-section">
                  <h3 class="nas-subsection-header">Slip Rekod Pengeluaran</h3>
                  <div class="nas-slip-info">
                    <div class="nas-slip-item">
                      <span class="nas-slip-label">No. Slip:</span>
                      <span class="nas-slip-value nas-mono">{{
                        disbursementData.slipRekod
                      }}</span>
                    </div>
                    <div class="nas-slip-item">
                      <span class="nas-slip-label">Tarikh Pengeluaran:</span>
                      <span class="nas-slip-value">{{
                        formatDateTime(disbursementData.tarikhMasa)
                      }}</span>
                    </div>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="nas-form-actions">
                  <RsButton
                    type="button"
                    variant="secondary-outline"
                    size="lg"
                    @click="router.push('/BF-PRF/AS/QS-1/kelulusan-pkp')"
                    :disabled="isSubmitting || isDisbursementComplete"
                  >
                    <Icon name="heroicons:arrow-left" class="nas-button-icon" />
                    Kembali
                  </RsButton>

                  <RsButton
                    type="submit"
                    variant="success"
                    size="lg"
                    :loading="isSubmitting"
                    :disabled="isDisbursementComplete || isSubmitting"
                    :aria-describedby="
                      isSubmitting ? 'submit-status' : undefined
                    "
                    @click="handleButtonClick"
                  >
                    <Icon
                      name="heroicons:check-circle"
                      class="nas-button-icon"
                    />
                    {{ isSubmitting ? "Memproses..." : "Sahkan Pengeluaran" }}
                  </RsButton>

                  <RsButton
                    v-if="isDisbursementComplete"
                    type="button"
                    variant="primary"
                    size="lg"
                    @click="router.push('/BF-PRF/AS/QS-1/serah-terima-tunai')"
                  >
                    <Icon
                      name="heroicons:arrow-right"
                      class="nas-button-icon"
                    />
                    Seterusnya: Serah Terima Tunai
                  </RsButton>
                </div>

                <div
                  v-if="isSubmitting"
                  id="submit-status"
                  class="nas-sr-only"
                  aria-live="polite"
                >
                  Sedang memproses pengeluaran tunai...
                </div>
              </form>
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

.nas-subsection-header {
  font-size: 16px;
  font-weight: 600; /* semibold */
  color: #374151;
  margin-bottom: 16px;
  line-height: 1.5;
  padding-bottom: 8px;
  border-bottom: 1px solid #e5e7eb;
}

.nas-page-description {
  font-size: 14px;
  font-weight: 400;
  color: #6b7280;
  line-height: 1.5;
}

.nas-group-title {
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 12px;
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

/* Layout Grid - Following Grid Layout Standards */
.nas-layout-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px; /* 24px gap per grid specifications */
}

@media (max-width: 1024px) {
  .nas-layout-grid {
    grid-template-columns: 1fr;
    gap: 24px; /* Maintain 24px gap on mobile */
  }
}

/* Card Components - Following Card Design Standards */
.nas-summary-card {
  border-left: 4px solid #005aad; /* LZS Primary Blue */
}

.nas-form-card {
  border-left: 4px solid #8dc73d; /* LZS Secondary Green */
}

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

/* Information Display */
.nas-info-section {
  display: flex;
  flex-direction: column;
  gap: 24px; /* 24px vertical spacing per specifications */
}

.nas-info-group {
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 16px;
}

.nas-info-group:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.nas-info-grid {
  display: grid;
  gap: 8px; /* 8px spacing per specifications */
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
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  flex-shrink: 0;
}

.nas-field-value {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  text-align: right;
}

.nas-mono {
  font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
}

.nas-amount-highlight {
  color: #005aad !important; /* LZS Primary Blue */
  font-size: 16px !important;
  font-weight: 700 !important;
}

.nas-available-amount {
  color: #059669 !important; /* Success color per specifications */
  font-weight: 700 !important;
}

/* Safe Box Information */
.nas-safebox-info {
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px;
}

.nas-safebox-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #e2e8f0;
}

.nas-safebox-item:last-child {
  border-bottom: none;
}

.nas-safebox-label {
  font-size: 14px;
  font-weight: 500;
  color: #64748b;
}

.nas-safebox-value {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}

/* Form Styles - Following Form Design Standards */
.nas-form {
  display: flex;
  flex-direction: column;
  gap: 32px; /* 32px between major sections */
}

.nas-form-section {
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 24px; /* 24px padding per specifications */
}

.nas-form-section:last-of-type {
  border-bottom: none;
  padding-bottom: 0;
}

.nas-field-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px; /* 16px spacing per specifications */
}

.nas-field-full {
  grid-column: 1 / -1;
}

.nas-field-half {
  /* Inherits grid position */
}

@media (max-width: 768px) {
  .nas-field-grid {
    grid-template-columns: 1fr;
  }

  .nas-field-half {
    grid-column: 1;
  }
}

.nas-field-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px; /* 8px spacing per specifications */
  line-height: 1.5;
}

.nas-required {
  color: #dc2626; /* Updated to specifications error color */
  margin-left: 2px;
}

.nas-form-input,
.nas-form-select,
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
}

.nas-form-input:focus,
.nas-form-select:focus,
.nas-form-textarea:focus {
  outline: none;
  border-color: #005aad; /* LZS Primary Blue */
  box-shadow: 0 0 0 3px rgba(0, 90, 173, 0.1);
}

.nas-form-input:read-only {
  background-color: #f9fafb;
  color: #6b7280;
}

.nas-amount-input {
  font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
  font-weight: 600;
  text-align: right;
}

/* Currency Input Styling */
.nas-currency-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.nas-currency-prefix {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  font-weight: 600;
  color: #6b7280;
  background-color: #ffffff;
  padding: 2px 4px;
  border-radius: 4px;
  z-index: 1;
  pointer-events: none;
}

.nas-currency-input {
  padding-left: 56px !important; /* Make room for RM prefix */
  font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
  font-weight: 600;
  text-align: right;
}

.nas-currency-input:read-only .nas-currency-prefix {
  color: #9ca3af;
}

/* FormKit Money Input Styling */
:deep(.formkit-money-wrapper) {
  position: relative;
  display: flex;
  align-items: center;
}

:deep(.formkit-money-prefix) {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  font-weight: 600;
  color: #6b7280;
  background-color: #ffffff;
  padding: 2px 4px;
  border-radius: 4px;
  z-index: 1;
  pointer-events: none;
}

:deep(.formkit-money-wrapper .formkit-input-text) {
  padding-left: 56px !important;
  font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
  font-weight: 600;
  text-align: right;
}

/* Disabled state for FormKit money inputs */
:deep(.formkit-money-wrapper:has(input:disabled) .formkit-money-prefix) {
  color: #9ca3af;
}

.nas-input-error {
  border-color: #dc2626; /* Updated to specifications error color */
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
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

/* Balance Warning */
.nas-balance-warning {
  margin-top: 16px; /* 16px spacing per specifications */
}

/* Slip Information */
.nas-slip-info {
  background-color: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 8px;
  padding: 16px;
}

.nas-slip-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0; /* 8px vertical spacing */
}

.nas-slip-label {
  font-size: 14px;
  font-weight: 500;
  color: #0c4a6e;
}

.nas-slip-value {
  font-size: 14px;
  font-weight: 600;
  color: #0f172a;
}

/* Action Buttons - Following Button Standards */
.nas-form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px; /* 16px gap per specifications */
  padding-top: 24px; /* 24px padding per specifications */
  border-top: 1px solid #f1f5f9;
}

@media (max-width: 768px) {
  .nas-form-actions {
    flex-direction: column-reverse;
    align-items: stretch;
    gap: 16px; /* Maintain 16px gap on mobile */
  }
}

.nas-button-icon {
  width: 20px;
  height: 20px;
  margin-right: 8px;
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
.nas-form-input:focus,
.nas-form-select:focus,
.nas-form-textarea:focus {
  outline: none;
  border-color: #005aad; /* LZS Primary Blue */
  box-shadow: 0 0 0 3px rgba(0, 90, 173, 0.1);
  z-index: 1;
  position: relative;
}

/* High Contrast Mode Support */
@media (prefers-contrast: high) {
  .nas-form-input,
  .nas-form-select,
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

  .nas-form-input,
  .nas-form-select,
  .nas-form-textarea {
    transition: none;
  }
}
</style>
