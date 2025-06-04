<script setup>
import { ref, computed } from "vue";

definePageMeta({
  title: "Carian Profil Asnaf",
  breadcrumb: [
    {
      name: "Pendaftaran Pantas",
      path: "/BF-PRF/AS/QS-1",
    },
    {
      name: "Carian Profil Asnaf",
      type: "current",
    },
  ],
});

// Search state
const searchTerm = ref("");
const isSearching = ref(false);
const searchError = ref("");
const profileFound = ref(null);
const showResults = ref(false);

// Mock profile data for demonstration - Following URS structure
const mockProfiles = [
  {
    id: "P001",
    noKp: "880514085234",
    nama: "Ahmad bin Hassan",
    telefon: "013-2234567",
    alamat: "No 123, Jalan Setia 1/3, Taman Setia, 43000 Kajang, Selangor",
    lastUpdated: "2023-12-15",
  },
  {
    id: "P002",
    noKp: "920305146789",
    nama: "Siti Aminah binti Abdullah",
    telefon: "019-8876543",
    alamat: "No 456, Jalan Harmoni 2/5, Taman Harmoni, 47100 Puchong, Selangor",
    lastUpdated: "2023-11-28",
  },
];

// Enhanced validation for search input following URS requirements
const isValidSearch = computed(() => {
  const term = searchTerm.value.trim();

  // URS specified patterns
  const icPattern = /^\d{12}$/; // 12 digits for IC (880514085234)
  const passportPattern = /^A\d{8}$/; // A followed by 8 digits
  const policePattern = /^\d{6}$/; // 6 digits for police
  const armyPattern = /^\d{8}$/; // 8 digits for army

  return (
    icPattern.test(term) ||
    passportPattern.test(term) ||
    policePattern.test(term) ||
    armyPattern.test(term)
  );
});

// Search function with real-time system check as per URS
const performSearch = async () => {
  if (!isValidSearch.value) {
    searchError.value =
      "Format ID tidak sah. Sila masukkan No. KP (12 digit), No. Polis (6 digit), No. Tentera (8 digit), atau No. Pasport (A + 8 digit)";
    return;
  }

  searchError.value = "";
  isSearching.value = true;

  // Simulate real-time database check as per URS
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Mock search logic - URS: "NAS semak ID secara real-time dalam pangkalan data"
  const foundProfile = mockProfiles.find(
    (profile) => profile.noKp === searchTerm.value.trim()
  );

  profileFound.value = foundProfile || null;
  showResults.value = true;
  isSearching.value = false;
};

// Clear search function
const clearSearch = () => {
  searchTerm.value = "";
  searchError.value = "";
  profileFound.value = null;
  showResults.value = false;
};

// Navigate functions following URS workflow
const proceedToApplication = () => {
  // URS: "Jika profil wujud: autofill → terus ke permohonan bantuan"
  localStorage.setItem("selectedProfile", JSON.stringify(profileFound.value));
  navigateTo("/BF-PRF/AS/QS-1/permohonan-bantuan");
};

const proceedToRegistration = () => {
  // URS: "Jika tiada profil: → redirect ke borang pendaftaran pantas"
  navigateTo("/BF-PRF/AS/QS-1/pendaftaran-pantas");
};

// Utility to format search term on input
const formatSearchInput = (value) => {
  // Remove all non-alphanumeric characters except 'A' for passport
  return value.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
};

const onSearchInput = (event) => {
  searchTerm.value = formatSearchInput(event.target.value);
  if (searchError.value) {
    searchError.value = "";
  }
};
</script>

<template>
  <div>
    <!-- Page Header following Typography Standards -->
    <div class="nas-page-header">
      <div class="nas-header-content">
        <div class="nas-header-icon">
          <Icon name="heroicons:magnifying-glass" class="nas-icon-primary" />
        </div>
        <div class="nas-header-text">
          <h1 class="nas-page-title">Carian Profil Asnaf</h1>
          <p class="nas-page-description">
            Semak kewujudan profil sebelum bantuan boleh dimohon
          </p>
        </div>
      </div>
    </div>

    <!-- Search Card following Card Design Standards -->
    <RsCard class="nas-search-card">
      <template #header>
        <div class="nas-card-header">
          <Icon name="heroicons:user-circle" class="nas-icon-header" />
          <h2 class="nas-section-header">Carian Profil</h2>
        </div>
      </template>

      <div class="nas-card-body">
        <!-- Search Instructions following Alert Standards -->
        <div class="nas-info-alert">
          <div class="nas-alert-content">
            <Icon name="heroicons:information-circle" class="nas-alert-icon" />
            <div class="nas-alert-text">
              <h3 class="nas-subsection-header">Format ID yang Diterima:</h3>
              <ul class="nas-instruction-list">
                <li>
                  <strong>No. Kad Pengenalan:</strong> 12 digit (contoh:
                  880514085234)
                </li>
                <li><strong>No. Polis:</strong> 6 digit (contoh: 123456)</li>
                <li>
                  <strong>No. Tentera:</strong> 8 digit (contoh: 12345678)
                </li>
                <li>
                  <strong>No. Pasport:</strong> A + 8 digit (contoh: A12345678)
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Search Form following Form Design Standards -->
        <div class="nas-form-group">
          <div class="nas-field-group">
            <label for="searchId" class="nas-field-label">
              No Kad Pengenalan / No Polis / No Tentera / No Pasport
              <span class="nas-required-asterisk">*</span>
            </label>
            <div class="nas-input-container">
              <input
                id="searchId"
                :value="searchTerm"
                type="text"
                placeholder="Masukkan ID untuk carian..."
                class="nas-search-input"
                :class="{
                  'nas-input-error': searchError,
                  'nas-input-valid': isValidSearch && searchTerm,
                }"
                @keyup.enter="performSearch"
                @input="onSearchInput"
                maxlength="12"
                autocomplete="off"
              />
              <div class="nas-input-icon">
                <Icon
                  v-if="isValidSearch && searchTerm"
                  name="heroicons:check-circle"
                  class="nas-icon-success"
                />
                <Icon
                  v-else-if="searchTerm && !isValidSearch"
                  name="heroicons:exclamation-circle"
                  class="nas-icon-error"
                />
              </div>
            </div>

            <!-- Error Message following Form Standards -->
            <div v-if="searchError" class="nas-error-message">
              <Icon
                name="heroicons:exclamation-triangle"
                class="nas-error-icon"
              />
              {{ searchError }}
            </div>

            <!-- Real-time validation feedback -->
            <div
              v-if="searchTerm && !searchError"
              class="nas-helper-text"
              :class="{
                'nas-helper-success': isValidSearch,
                'nas-helper-warning': !isValidSearch,
              }"
            >
              <div v-if="isValidSearch" class="nas-validation-feedback">
                <Icon name="heroicons:check-circle" class="nas-feedback-icon" />
                Format ID adalah sah
              </div>
              <div v-else class="nas-validation-feedback">
                <Icon
                  name="heroicons:exclamation-triangle"
                  class="nas-feedback-icon"
                />
                Sila pastikan format ID adalah betul
              </div>
            </div>
            <div v-else-if="!searchTerm" class="nas-helper-text">
              Wajib diisi
            </div>
          </div>

          <!-- Action Buttons following Button Standards -->
          <div class="nas-button-group flex justify-end">
            <RsButton
              variant="secondary-outline"
              size="lg"
              @click="clearSearch"
              :disabled="isSearching"
              class="nas-secondary-button"
            >
              <Icon name="heroicons:x-mark" class="nas-button-icon" />
              Padam
            </RsButton>

            <RsButton
              variant="primary"
              size="lg"
              @click="performSearch"
              :disabled="!isValidSearch || isSearching"
              class="nas-primary-button"
            >
              <div class="nas-button-content">
                <div v-if="isSearching" class="nas-loading-spinner"></div>
                <Icon
                  v-else
                  name="heroicons:magnifying-glass"
                  class="nas-button-icon"
                />
                {{ isSearching ? "Mencari..." : "Cari Profil" }}
              </div>
            </RsButton>
          </div>
        </div>
      </div>
    </RsCard>

    <!-- Search Results following Card and Alert Standards -->
    <div v-if="showResults" class="nas-results-section">
      <!-- Profile Found - Success Card -->
      <RsCard v-if="profileFound" class="nas-success-card">
        <template #header>
          <div class="nas-result-header">
            <div class="nas-result-status">
              <Icon
                name="heroicons:check-circle"
                class="nas-icon-success-large"
              />
              <h2 class="nas-section-header nas-success-text">
                Profil Dijumpai
              </h2>
            </div>
            <div class="nas-profile-badge">ID: {{ profileFound.id }}</div>
          </div>
        </template>

        <div class="nas-card-body">
          <!-- Success Alert -->
          <div class="nas-success-alert">
            <div class="nas-alert-content">
              <Icon
                name="heroicons:information-circle"
                class="nas-alert-icon"
              />
              <div class="nas-alert-text">
                <p class="nas-alert-message">
                  Maklumat profil akan digunakan secara automatik untuk
                  permohonan bantuan.
                </p>
              </div>
            </div>
          </div>

          <!-- Profile Information -->
          <div class="nas-profile-container">
            <h3 class="nas-subsection-header">Maklumat Profil</h3>
            <div class="nas-profile-grid">
              <div class="nas-profile-field">
                <label class="nas-field-meta">Nama Penuh</label>
                <p class="nas-field-value">{{ profileFound.nama }}</p>
              </div>
              <div class="nas-profile-field">
                <label class="nas-field-meta">No. Kad Pengenalan</label>
                <p class="nas-field-value nas-mono">{{ profileFound.noKp }}</p>
              </div>
              <div class="nas-profile-field">
                <label class="nas-field-meta">No. Telefon</label>
                <p class="nas-field-value">{{ profileFound.telefon }}</p>
              </div>
              <div class="nas-profile-field">
                <label class="nas-field-meta">Alamat</label>
                <p class="nas-field-value">{{ profileFound.alamat }}</p>
              </div>
              <div class="nas-profile-field">
                <label class="nas-field-meta">Kemaskini Terakhir</label>
                <p class="nas-field-value">
                  {{
                    new Date(profileFound.lastUpdated).toLocaleDateString(
                      "ms-MY"
                    )
                  }}
                </p>
              </div>
            </div>
          </div>

          <!-- Action Section -->
          <div class="nas-action-section">
            <RsButton
              variant="success"
              size="lg"
              @click="proceedToApplication"
              class="nas-proceed-button"
            >
              <Icon name="heroicons:arrow-right" class="nas-button-icon" />
              Teruskan ke Permohonan Bantuan
            </RsButton>
          </div>
        </div>
      </RsCard>

      <!-- Profile Not Found - Warning Card -->
      <RsCard v-else class="nas-warning-card">
        <template #header>
          <div class="nas-result-header">
            <div class="nas-result-status">
              <Icon
                name="heroicons:exclamation-triangle"
                class="nas-icon-warning-large"
              />
              <h2 class="nas-section-header nas-warning-text">
                Profil Tidak Dijumpai
              </h2>
            </div>
          </div>
        </template>

        <div class="nas-card-body">
          <!-- Warning Alert -->
          <div class="nas-warning-alert">
            <div class="nas-alert-content">
              <Icon
                name="heroicons:exclamation-triangle"
                class="nas-alert-icon"
              />
              <div class="nas-alert-text">
                <p class="nas-alert-message">
                  Tiada profil dijumpai untuk ID:
                  <strong class="nas-mono">{{ searchTerm }}</strong>
                </p>
                <p class="nas-alert-description">
                  Untuk meneruskan permohonan bantuan, sila daftarkan profil
                  baharu.
                </p>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="nas-action-buttons flex justify-end">
            <RsButton
              variant="secondary-outline"
              size="lg"
              @click="clearSearch"
              class="nas-retry-button"
            >
              <Icon name="heroicons:arrow-left" class="nas-button-icon" />
              Cari Semula
            </RsButton>

            <RsButton
              variant="primary"
              size="lg"
              @click="proceedToRegistration"
              class="nas-register-button"
            >
              <Icon name="heroicons:user-plus" class="nas-button-icon" />
              Daftar Profil Baharu
            </RsButton>
          </div>
        </div>
      </RsCard>
    </div>

    <!-- User Context Info - URS: "User Role: EKP (Kaunter)" -->
    <div class="nas-context-info">
      <div class="nas-context-content">
        <div class="nas-user-info">
          <Icon name="heroicons:information-circle" class="nas-context-icon" />
          <span class="nas-context-text">Pengguna: EKP (Kaunter)</span>
        </div>
        <div class="nas-system-info">
          Sistem akan semak ID secara real-time dalam pangkalan data
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* NAS Design System - Following UI/UX Design Specifications v0.2 */

/* Typography Hierarchy - Following exact specifications */
.nas-page-title {
  font-size: 24px;
  font-weight: 700; /* H1: bold */
  color: #1f2937;
  margin-bottom: 4px;
  line-height: 1.5; /* Minimum 1.5 line height */
}

.nas-section-header {
  font-size: 20px;
  font-weight: 600; /* H2: semibold */
  color: #374151;
  line-height: 1.5;
}

.nas-subsection-header {
  font-size: 16px;
  font-weight: 600; /* H3: semibold */
  color: #005aad; /* LZS Primary Blue */
  margin-bottom: 4px;
  line-height: 1.5;
}

.nas-page-description,
.nas-body-text {
  font-size: 14px;
  font-weight: 400; /* Body text: regular */
  color: #374151;
  line-height: 1.5;
}

.nas-helper-text {
  font-size: 12px;
  font-weight: 400; /* Captions/Helper text: 12px regular */
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
  margin-bottom: 16px;
}

.nas-header-icon {
  width: 48px;
  height: 48px;
  background-color: rgba(0, 90, 173, 0.1); /* LZS Primary Blue with opacity */
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px; /* 16px spacing per specification */
}

.nas-icon-primary {
  width: 24px;
  height: 24px;
  color: #005aad; /* LZS Primary Blue */
}

/* Card Design Standards */
.nas-search-card {
  margin-bottom: 24px; /* 24px vertical spacing */
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.nas-card-header {
  display: flex;
  align-items: center;
  padding: 24px; /* 24px padding per specification */
  border-bottom: 1px solid #e5e7eb;
}

.nas-icon-header {
  width: 20px;
  height: 20px;
  color: #005aad; /* LZS Primary Blue */
  margin-right: 12px; /* 12px spacing */
}

.nas-card-body {
  padding: 24px; /* 24px padding per specification */
}

/* Alert Design Standards */
.nas-info-alert {
  background-color: #ebf8ff; /* Information alert background */
  border: 1px solid #bfdbfe;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
}

.nas-alert-content {
  display: flex;
  align-items: flex-start;
}

.nas-alert-icon {
  width: 20px;
  height: 20px;
  color: #1d4ed8; /* Information blue */
  margin-right: 12px;
  margin-top: 2px;
  flex-shrink: 0;
}

.nas-alert-text {
  flex: 1;
}

.nas-instruction-list {
  margin: 8px 0 0 0;
  padding-left: 16px;
  list-style: none;
}

.nas-instruction-list li {
  margin-bottom: 6px;
  font-size: 14px;
  color: #1e40af;
  line-height: 1.4;
}

.nas-instruction-list strong {
  font-weight: 600;
  color: #005aad; /* LZS Primary Blue */
}

/* Form Design Standards */
.nas-form-group {
  display: flex;
  flex-direction: column;
  gap: 24px; /* 24px spacing between form sections */
}

.nas-field-group {
  display: flex;
  flex-direction: column;
}

.nas-field-label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
  line-height: 1.5;
}

/* Mandatory Fields - Red asterisk */
.nas-required-asterisk {
  color: #d32f2f; /* Red asterisk per specification */
  margin-left: 4px;
  font-weight: 600;
}

.nas-input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.nas-search-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  font-family: "Inter", sans-serif;
  transition: border-color 0.2s ease;
  background-color: #ffffff;
}

.nas-search-input:focus {
  outline: none;
  border-color: #005aad; /* LZS Primary Blue focus */
  box-shadow: 0 0 0 3px rgba(0, 90, 173, 0.1);
}

.nas-search-input.nas-input-valid {
  border-color: #059669; /* Success color */
}

.nas-search-input.nas-input-error {
  border-color: #dc2626; /* Error color */
}

.nas-input-icon {
  position: absolute;
  right: 12px;
  display: flex;
  align-items: center;
}

.nas-icon-success {
  width: 20px;
  height: 20px;
  color: #059669; /* Success color */
}

.nas-icon-error {
  width: 20px;
  height: 20px;
  color: #dc2626; /* Error color */
}

/* Error Messages */
.nas-error-message {
  display: flex;
  align-items: center;
  margin-top: 8px;
  padding: 8px 12px;
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 6px;
  font-size: 12px;
  color: #dc2626;
  line-height: 1.4;
}

.nas-error-icon {
  width: 16px;
  height: 16px;
  margin-right: 8px;
  flex-shrink: 0;
}

/* Validation Feedback */
.nas-validation-feedback {
  display: flex;
  align-items: center;
  margin-top: 4px;
}

.nas-feedback-icon {
  width: 16px;
  height: 16px;
  margin-right: 6px;
}

.nas-helper-success {
  color: #059669;
}

.nas-helper-warning {
  color: #d97706;
}

/* Button Standards */
.nas-button-group {
  display: flex;
  gap: 12px; /* 12px spacing between buttons */
  margin-top: 16px;
}

.nas-button-content {
  display: flex;
  align-items: center;
  justify-content: center;
}

.nas-button-icon {
  width: 20px;
  height: 20px;
  margin-right: 8px;
}

.nas-loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 8px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Results Section */
.nas-results-section {
  margin-top: 32px;
}

/* Success Card */
.nas-success-card {
  border-left: 4px solid #059669;
  background-color: #f0fdf4;
  border-radius: 8px;
}

/* Warning Card */
.nas-warning-card {
  border-left: 4px solid #d97706;
  background-color: #fffbeb;
  border-radius: 8px;
}

/* Result Header */
.nas-result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
}

.nas-result-status {
  display: flex;
  align-items: center;
}

.nas-icon-success-large,
.nas-icon-warning-large {
  width: 24px;
  height: 24px;
  margin-right: 12px;
}

.nas-icon-success-large {
  color: #059669;
}

.nas-icon-warning-large {
  color: #d97706;
}

.nas-success-text {
  color: #059669;
}

.nas-warning-text {
  color: #d97706;
}

.nas-profile-badge {
  background-color: #005aad;
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
}

/* Alert Styles */
.nas-success-alert,
.nas-warning-alert {
  background-color: rgba(59, 130, 246, 0.05);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
}

.nas-alert-content {
  display: flex;
  align-items: flex-start;
}

.nas-alert-icon {
  width: 20px;
  height: 20px;
  color: #3b82f6;
  margin-right: 12px;
  margin-top: 2px;
  flex-shrink: 0;
}

.nas-alert-text {
  flex: 1;
}

.nas-alert-message {
  font-size: 14px;
  font-weight: 400;
  color: #1e40af;
  margin: 0 0 8px 0;
  line-height: 1.5;
}

.nas-alert-description {
  font-size: 12px;
  color: #6b7280;
  margin: 0;
  line-height: 1.4;
}

/* Profile Container */
.nas-profile-container {
  margin-bottom: 24px;
}

.nas-profile-container .nas-subsection-header {
  margin-bottom: 16px;
}

/* Profile Grid */
.nas-profile-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  padding: 0;
}

.nas-profile-field {
  display: flex;
  flex-direction: column;
}

.nas-field-meta {
  font-size: 12px;
  font-weight: 500;
  color: #6b7280;
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.nas-field-value {
  font-size: 14px;
  font-weight: 400;
  color: #1f2937;
  margin: 0;
  line-height: 1.4;
}

.nas-mono {
  font-family: "SF Mono", "Monaco", "Inconsolata", "Roboto Mono", monospace;
  letter-spacing: 0.05em;
}

/* Action Section */
.nas-action-section {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
}

.nas-action-buttons {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .nas-profile-grid {
    grid-template-columns: 1fr;
  }

  .nas-result-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}

@media (max-width: 640px) {
  .nas-action-buttons {
    flex-direction: column;
  }
}

/* Context Information */
.nas-context-info {
  margin-top: 32px;
  padding: 16px;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.nas-context-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nas-user-info {
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.nas-context-icon {
  width: 16px;
  height: 16px;
  color: #6b7280;
  margin-right: 8px;
}

.nas-context-text {
  color: #005aad; /* LZS Primary Blue */
  font-weight: 600;
}

.nas-system-info {
  font-size: 12px;
  color: #6b7280;
  font-style: italic;
}

/* Focus and Accessibility */
.nas-search-input:focus,
button:focus {
  outline: 2px solid #005aad;
  outline-offset: 2px;
}

/* Ensure minimum touch targets of 44px */
button {
  min-height: 44px;
  min-width: 44px;
}

/* High contrast support */
@media (prefers-contrast: high) {
  .nas-search-input {
    border-width: 3px;
  }

  .nas-icon-primary,
  .nas-icon-success,
  .nas-icon-error {
    filter: contrast(1.5);
  }
}
</style>
