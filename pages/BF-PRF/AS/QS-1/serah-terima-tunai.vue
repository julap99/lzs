<script setup>
definePageMeta({
  title: "Serah Terima Tunai",
  breadcrumb: [
    {
      name: "Pendaftaran Pantas",
      path: "/BF-PRF/AS/QS-1",
    },
    {
      name: "Serah Terima Tunai",
      type: "current",
    },
  ],
});

const router = useRouter();

// Get application data
const applicationData = ref(null);
const applicantProfile = ref(null);
const disbursementData = ref(null);

// Cash handover data
const handoverData = ref({
  idPermohonan: "",
  namaPemohon: "",
  noKp: "",
  jumlahTunaiDiagih: "",
  lokasiSerahan: "",
  tarikhMasa: "", // Will be set properly in onMounted
  catatanEkp: "",
  statusAgihan: "pending", // pending, completed
});

// Form validation
const errors = ref({});
const isSubmitting = ref(false);
const showSuccessAlert = ref(false);
const isHandoverComplete = ref(false);
const isLoading = ref(true);

// Location options for cash distribution
const lokasiSerahanOptions = [
  { value: "kaunter-1", label: "Kaunter 1 - Tingkat 1" },
  { value: "kaunter-2", label: "Kaunter 2 - Tingkat 1" },
  { value: "kaunter-3", label: "Kaunter 3 - Tingkat 2" },
  { value: "kaunter-4", label: "Kaunter 4 - Tingkat 2" },
  { value: "bilik-vip", label: "Bilik VIP - Tingkat 2" },
  { value: "ruang-khas", label: "Ruang Khas - Tingkat 1" },
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
      applicantProfile.value =
        appData.profileData || appData.applicantProfile || null;
      disbursementData.value = appData.disbursementData;

      // Check if cash has been disbursed by PKP
      if (appData.status !== "Tunai Disahkan") {
        console.log("onMounted: Cash not disbursed, redirecting"); // Debug log
        await navigateTo("/BF-PRF/AS/QS-1");
        return;
      }

      // Pre-fill handover data with safe access
      handoverData.value.idPermohonan =
        appData.id || "APP-" + Date.now().toString().slice(-6);
      handoverData.value.namaPemohon =
        appData.nama ||
        appData.profileData?.nama ||
        appData.applicantProfile?.nama ||
        "Tidak tersedia";
      handoverData.value.noKp =
        appData.noKp ||
        appData.profileData?.noKp ||
        appData.applicantProfile?.noKp ||
        "Tidak tersedia";
      handoverData.value.jumlahTunaiDiagih =
        appData.disbursementData?.jumlahDiluluskan || "0";

      // Set current date and time in proper format for datetime-local
      handoverData.value.tarikhMasa = formatDateTimeLocal(new Date());

      console.log("onMounted: Handover data initialized:", handoverData.value); // Debug log
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

// Form validation
const validateForm = () => {
  console.log("validateForm called"); // Debug log
  errors.value = {};

  if (!handoverData.value.lokasiSerahan) {
    errors.value.lokasiSerahan = "Sila pilih lokasi serahan";
  }

  if (!handoverData.value.catatanEkp.trim()) {
    errors.value.catatanEkp = "Sila masukkan catatan EKP";
  } else if (handoverData.value.catatanEkp.trim().length < 10) {
    errors.value.catatanEkp =
      "Catatan EKP mestilah sekurang-kurangnya 10 aksara";
  }

  console.log("Validation errors:", errors.value); // Debug log
  const isValid = Object.keys(errors.value).length === 0;
  console.log("Form is valid:", isValid); // Debug log

  return isValid;
};

// Submit cash handover
const submitHandover = async () => {
  console.log("submitHandover called"); // Debug log
  console.log("Current handoverData:", handoverData.value); // Debug log

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
    const handoverDateTime = new Date(
      handoverData.value.tarikhMasa
    ).toISOString();

    // Update application data with handover info
    const updatedApplication = {
      ...applicationData.value,
      handoverData: {
        ...handoverData.value,
        tarikhMasa: handoverDateTime,
      },
      status: "Telah Diagih",
      handoverCompletedAt: handoverDateTime,
      handedOverBy: "EKP-001", // This would come from logged-in user
    };

    handoverData.value.statusAgihan = "completed";

    localStorage.setItem(
      "currentApplication",
      JSON.stringify(updatedApplication)
    );

    showSuccessAlert.value = true;
    isHandoverComplete.value = true;

    console.log("Handover completed successfully"); // Debug log

    // Auto redirect after 5 seconds
    setTimeout(() => {
      router.push("/BF-PRF/AS/QS-1/slip-penerimaan");
    }, 5000);
  } catch (error) {
    console.error("Error submitting handover:", error);
    // Show error alert
    alert("Ralat berlaku semasa memproses agihan. Sila cuba lagi.");
  } finally {
    isSubmitting.value = false;
  }
};

// Handle form submit event
const handleFormSubmit = (event) => {
  console.log("Form submit event triggered:", event); // Debug log
  submitHandover();
};

// Handle button click directly
const handleButtonClick = () => {
  console.log("Button clicked directly"); // Debug log
  submitHandover();
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

// Get selected location label
const getLocationLabel = computed(() => {
  const selectedLocation = lokasiSerahanOptions.find(
    (option) => option.value === handoverData.value.lokasiSerahan
  );
  return selectedLocation ? selectedLocation.label : "";
});
</script>

<template>
  <div>
    <!-- Loading State -->
    <div v-if="isLoading" class="nas-loading-container">
      <div class="nas-loading-content">
        <Icon name="heroicons:arrow-path" class="nas-loading-spinner" />
        <p class="nas-loading-text">Memuat data agihan...</p>
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
          <h3 class="nas-alert-title">Agihan Tunai Berjaya Disahkan</h3>
          <p class="nas-alert-description">
            Tunai sebanyak
            {{ formatCurrency(handoverData.jumlahTunaiDiagih) }} telah diagih
            kepada pemohon. Sistem akan membawa anda ke slip penerimaan.
          </p>
        </div>
      </RsAlert>

      <!-- Page Header -->
      <div class="nas-page-header">
        <div class="nas-header-content">
          <div class="nas-header-icon">
            <Icon name="heroicons:hand-raised" class="nas-icon-primary" />
          </div>
          <div class="nas-header-text">
            <h1 class="nas-page-title">EKP Terima & Serah Tunai</h1>
            <p class="nas-page-description">
              EKP sahkan terima dari PKP dan agih kepada pemohon
            </p>
          </div>
        </div>
      </div>

      <!-- Main Content Layout -->
      <div class="nas-layout-grid">
        <!-- Left Column: Distribution Summary -->
        <div class="nas-left-column">
          <RsCard class="nas-summary-card">
            <template #header>
              <div class="nas-card-header">
                <Icon
                  name="heroicons:clipboard-document-list"
                  class="nas-icon-header"
                />
                <h2 class="nas-section-header">Maklumat Agihan</h2>
              </div>
            </template>

            <div class="nas-card-body">
              <!-- Distribution Information -->
              <div class="nas-info-section">
                <div class="nas-info-group">
                  <h3 class="nas-group-title">Butiran Pemohon</h3>
                  <div class="nas-info-grid">
                    <div class="nas-info-field">
                      <span class="nas-field-label">ID Permohonan:</span>
                      <span class="nas-field-value nas-mono">{{
                        handoverData.idPermohonan
                      }}</span>
                    </div>
                    <div class="nas-info-field">
                      <span class="nas-field-label">Nama Pemohon:</span>
                      <span class="nas-field-value">{{
                        handoverData.namaPemohon
                      }}</span>
                    </div>
                    <div class="nas-info-field">
                      <span class="nas-field-label">No. KP:</span>
                      <span class="nas-field-value nas-mono">{{
                        handoverData.noKp
                      }}</span>
                    </div>
                    <div class="nas-info-field">
                      <span class="nas-field-label">Jenis Bantuan:</span>
                      <span class="nas-field-value">{{
                        applicationData?.jenisBantuan || "Tidak tersedia"
                      }}</span>
                    </div>
                  </div>
                </div>

                <!-- Cash Distribution Details -->
                <div class="nas-info-group">
                  <h3 class="nas-group-title">Butiran Agihan Tunai</h3>
                  <div class="nas-cash-info">
                    <div class="nas-cash-amount">
                      <span class="nas-amount-label">Jumlah Tunai Diagih:</span>
                      <span class="nas-amount-value">
                        {{ formatCurrency(handoverData.jumlahTunaiDiagih) }}
                      </span>
                    </div>
                    <div class="nas-cash-item">
                      <span class="nas-cash-label">Status PKP:</span>
                      <RsBadge variant="success">Tunai Disahkan</RsBadge>
                    </div>
                    <div class="nas-cash-item">
                      <span class="nas-cash-label">Slip Rekod PKP:</span>
                      <span class="nas-cash-value nas-mono">{{
                        disbursementData?.slipRekod || "Tidak tersedia"
                      }}</span>
                    </div>
                    <div class="nas-cash-item">
                      <span class="nas-cash-label">EKP Penerima:</span>
                      <span class="nas-cash-value">{{
                        disbursementData?.namaEkp || "Tidak tersedia"
                      }}</span>
                    </div>
                    <div class="nas-cash-item">
                      <span class="nas-cash-label">Kaunter PKP:</span>
                      <span class="nas-cash-value">{{
                        disbursementData?.noKaunter || "Tidak tersedia"
                      }}</span>
                    </div>
                  </div>
                </div>

                <!-- Completed Distribution Info -->
                <div v-if="isHandoverComplete" class="nas-info-group">
                  <h3 class="nas-group-title">Maklumat Agihan Selesai</h3>
                  <div class="nas-completed-info">
                    <div class="nas-completed-item">
                      <span class="nas-completed-label">Lokasi Serahan:</span>
                      <span class="nas-completed-value">{{
                        getLocationLabel
                      }}</span>
                    </div>
                    <div class="nas-completed-item">
                      <span class="nas-completed-label">Tarikh & Masa:</span>
                      <span class="nas-completed-value">{{
                        formatDateTime(handoverData.tarikhMasa)
                      }}</span>
                    </div>
                    <div class="nas-completed-item">
                      <span class="nas-completed-label">Status:</span>
                      <RsBadge variant="success">Agihan Selesai</RsBadge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </RsCard>
        </div>

        <!-- Right Column: Handover Form -->
        <div class="nas-right-column">
          <RsCard class="nas-form-card">
            <template #header>
              <div class="nas-card-header">
                <Icon name="heroicons:document-check" class="nas-icon-header" />
                <h2 class="nas-section-header">Borang Agihan Tunai</h2>
              </div>
            </template>

            <div class="nas-card-body">
              <form
                @submit.prevent="handleFormSubmit"
                class="nas-form"
                novalidate
              >
                <!-- Handover Information -->
                <div class="nas-form-section">
                  <h3 class="nas-subsection-header">Maklumat Agihan</h3>

                  <div class="nas-field-grid">
                    <!-- ID Permohonan -->
                    <div class="nas-field-half">
                      <label class="nas-field-label">ID Permohonan</label>
                      <input
                        v-model="handoverData.idPermohonan"
                        type="text"
                        class="nas-form-input"
                        readonly
                      />
                      <div class="nas-helper-text">
                        ID permohonan (automatik)
                      </div>
                    </div>

                    <!-- Nama Pemohon -->
                    <div class="nas-field-half">
                      <label class="nas-field-label">Nama Pemohon</label>
                      <input
                        v-model="handoverData.namaPemohon"
                        type="text"
                        class="nas-form-input"
                        readonly
                      />
                      <div class="nas-helper-text">Nama pemohon</div>
                    </div>

                    <!-- No. KP -->
                    <div class="nas-field-half">
                      <label class="nas-field-label">No. Kad Pengenalan</label>
                      <input
                        v-model="handoverData.noKp"
                        type="text"
                        class="nas-form-input"
                        readonly
                      />
                      <div class="nas-helper-text">No. KP pemohon</div>
                    </div>

                    <!-- Jumlah Tunai -->
                    <div class="nas-field-half">
                      <FormKit
                        type="money"
                        name="jumlahTunaiDiagih"
                        label="Jumlah Tunai Diagih"
                        v-model="handoverData.jumlahTunaiDiagih"
                        :disabled="true"
                        help="Jumlah tunai yang diagih"
                      />
                    </div>

                    <!-- Lokasi Serahan -->
                    <div class="nas-field-full">
                      <label for="lokasiSerahan" class="nas-field-label">
                        Lokasi Serahan <span class="nas-required">*</span>
                      </label>
                      <select
                        id="lokasiSerahan"
                        v-model="handoverData.lokasiSerahan"
                        name="lokasiSerahan"
                        class="nas-form-select"
                        :class="{ 'nas-input-error': errors.lokasiSerahan }"
                        :disabled="isHandoverComplete"
                        :aria-invalid="!!errors.lokasiSerahan"
                        :aria-describedby="
                          errors.lokasiSerahan
                            ? 'lokasiSerahan-error'
                            : 'lokasiSerahan-help'
                        "
                        required
                      >
                        <option value="">Sila pilih lokasi serahan</option>
                        <option
                          v-for="location in lokasiSerahanOptions"
                          :key="location.value"
                          :value="location.value"
                        >
                          {{ location.label }}
                        </option>
                      </select>
                      <div
                        v-if="errors.lokasiSerahan"
                        id="lokasiSerahan-error"
                        class="nas-error-text"
                        role="alert"
                      >
                        {{ errors.lokasiSerahan }}
                      </div>
                      <div
                        v-else
                        id="lokasiSerahan-help"
                        class="nas-helper-text"
                      >
                        Lokasi di mana tunai diserahkan kepada pemohon
                      </div>
                    </div>

                    <!-- Tarikh & Masa -->
                    <div class="nas-field-half">
                      <label for="tarikhMasa" class="nas-field-label"
                        >Tarikh & Masa</label
                      >
                      <input
                        id="tarikhMasa"
                        v-model="handoverData.tarikhMasa"
                        name="tarikhMasa"
                        type="datetime-local"
                        class="nas-form-input"
                        readonly
                      />
                      <div class="nas-helper-text">Masa agihan (automatik)</div>
                    </div>

                    <!-- Status -->
                    <div class="nas-field-half">
                      <label class="nas-field-label">Status Agihan</label>
                      <div class="nas-status-display">
                        <RsBadge
                          :variant="
                            handoverData.statusAgihan === 'completed'
                              ? 'success'
                              : 'warning'
                          "
                        >
                          {{
                            handoverData.statusAgihan === "completed"
                              ? "Selesai"
                              : "Dalam Proses"
                          }}
                        </RsBadge>
                      </div>
                      <div class="nas-helper-text">Status semasa agihan</div>
                    </div>

                    <!-- Catatan EKP -->
                    <div class="nas-field-full">
                      <label for="catatanEkp" class="nas-field-label">
                        Catatan EKP <span class="nas-required">*</span>
                      </label>
                      <textarea
                        id="catatanEkp"
                        v-model="handoverData.catatanEkp"
                        name="catatanEkp"
                        placeholder="Masukkan catatan mengenai agihan tunai ini, termasuk keadaan pemohon dan sebarang pemerhatian"
                        class="nas-form-textarea"
                        :class="{ 'nas-input-error': errors.catatanEkp }"
                        :disabled="isHandoverComplete"
                        :aria-invalid="!!errors.catatanEkp"
                        :aria-describedby="
                          errors.catatanEkp
                            ? 'catatanEkp-error'
                            : 'catatanEkp-help'
                        "
                        rows="4"
                        maxlength="500"
                        required
                      ></textarea>
                      <div
                        v-if="errors.catatanEkp"
                        id="catatanEkp-error"
                        class="nas-error-text"
                        role="alert"
                      >
                        {{ errors.catatanEkp }}
                      </div>
                      <div v-else id="catatanEkp-help" class="nas-helper-text">
                        Catatan EKP mengenai proses agihan (minimum 10 aksara) -
                        {{ handoverData.catatanEkp.length }}/500 aksara
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Instructions -->
                <div class="nas-form-section">
                  <h3 class="nas-subsection-header">Arahan Agihan</h3>
                  <div class="nas-instructions">
                    <div class="nas-instruction-item">
                      <Icon
                        name="heroicons:check-circle"
                        class="nas-instruction-icon"
                      />
                      <span
                        >Pastikan pemohon hadir dengan dokumen pengenalan yang
                        sah</span
                      >
                    </div>
                    <div class="nas-instruction-item">
                      <Icon
                        name="heroicons:check-circle"
                        class="nas-instruction-icon"
                      />
                      <span>Sahkan identiti pemohon sebelum agihan tunai</span>
                    </div>
                    <div class="nas-instruction-item">
                      <Icon
                        name="heroicons:check-circle"
                        class="nas-instruction-icon"
                      />
                      <span>Kira jumlah tunai di hadapan pemohon</span>
                    </div>
                    <div class="nas-instruction-item">
                      <Icon
                        name="heroicons:check-circle"
                        class="nas-instruction-icon"
                      />
                      <span>Minta pemohon menandatangani slip penerimaan</span>
                    </div>
                    <div class="nas-instruction-item">
                      <Icon
                        name="heroicons:check-circle"
                        class="nas-instruction-icon"
                      />
                      <span
                        >Berikan nasihat dan maklumat bantuan lain jika
                        sesuai</span
                      >
                    </div>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="nas-form-actions">
                  <RsButton
                    type="button"
                    variant="secondary-outline"
                    size="lg"
                    @click="router.push('/BF-PRF/AS/QS-1/sahkan-pengeluaran')"
                    :disabled="isSubmitting || isHandoverComplete"
                  >
                    <Icon name="heroicons:arrow-left" class="nas-button-icon" />
                    Kembali
                  </RsButton>

                  <RsButton
                    type="submit"
                    variant="success"
                    size="lg"
                    :loading="isSubmitting"
                    :disabled="isHandoverComplete || isSubmitting"
                    :aria-describedby="
                      isSubmitting ? 'submit-status' : undefined
                    "
                    @click="handleButtonClick"
                  >
                    <Icon
                      name="heroicons:check-circle"
                      class="nas-button-icon"
                    />
                    {{ isSubmitting ? "Memproses..." : "Sahkan Agihan" }}
                  </RsButton>

                  <RsButton
                    v-if="isHandoverComplete"
                    type="button"
                    variant="primary"
                    size="lg"
                    @click="router.push('/BF-PRF/AS/QS-1/slip-penerimaan')"
                  >
                    <Icon
                      name="heroicons:arrow-right"
                      class="nas-button-icon"
                    />
                    Seterusnya: Slip Penerimaan
                  </RsButton>
                </div>

                <div
                  v-if="isSubmitting"
                  id="submit-status"
                  class="nas-sr-only"
                  aria-live="polite"
                >
                  Sedang memproses agihan tunai...
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

/* Cash Information - Updated Colors */
.nas-cash-info {
  background-color: rgba(
    141,
    199,
    61,
    0.1
  ); /* LZS Secondary Green with 10% opacity */
  border: 1px solid #8dc73d; /* LZS Secondary Green */
  border-radius: 8px;
  padding: 16px;
}

.nas-cash-amount {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 2px solid #8dc73d; /* LZS Secondary Green */
  margin-bottom: 12px;
}

.nas-amount-label {
  font-size: 16px;
  font-weight: 600;
  color: #059669; /* Success color per specifications */
}

.nas-amount-value {
  font-size: 20px;
  font-weight: 700;
  color: #005aad; /* LZS Primary Blue */
  font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
}

.nas-cash-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  border-bottom: 1px solid #e5e7eb;
}

.nas-cash-item:last-child {
  border-bottom: none;
}

.nas-cash-label {
  font-size: 14px;
  font-weight: 500;
  color: #047857; /* Success color per specifications */
}

.nas-cash-value {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
}

/* Completed Distribution Info - Updated Colors */
.nas-completed-info {
  background-color: rgba(4, 120, 87, 0.1); /* Success color with 10% opacity */
  border: 1px solid #047857; /* Success color per specifications */
  border-radius: 8px;
  padding: 16px;
}

.nas-completed-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  border-bottom: 1px solid rgba(4, 120, 87, 0.2);
}

.nas-completed-item:last-child {
  border-bottom: none;
}

.nas-completed-label {
  font-size: 14px;
  font-weight: 500;
  color: #047857; /* Success color per specifications */
}

.nas-completed-value {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
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

/* Status Display */
.nas-status-display {
  display: flex;
  align-items: center;
  min-height: 44px;
}

/* Instructions - Updated Colors */
.nas-instructions {
  background-color: rgba(
    0,
    90,
    173,
    0.05
  ); /* LZS Primary Blue with 5% opacity */
  border: 1px solid rgba(0, 90, 173, 0.2); /* LZS Primary Blue with 20% opacity */
  border-radius: 8px;
  padding: 16px;
}

.nas-instruction-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  font-size: 14px;
  line-height: 1.5;
  color: #374151;
}

.nas-instruction-item:last-child {
  margin-bottom: 0;
}

.nas-instruction-icon {
  width: 16px;
  height: 16px;
  color: #005aad; /* LZS Primary Blue */
  margin-right: 12px;
  flex-shrink: 0;
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
  .nas-form-input,
  .nas-form-select,
  .nas-form-textarea {
    transition: none;
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
</style>
