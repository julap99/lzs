<script setup>
import { ref, computed, onMounted, watch } from "vue";

definePageMeta({
  title: "Pendaftaran Pantas",
  breadcrumb: [
    {
      name: "Pendaftaran Pantas",
      path: "/BF-PRF/AS/QS-1",
    },
    {
      name: "Carian Profil",
      path: "/BF-PRF/AS/QS-1/carian-profil",
    },
    {
      name: "Pendaftaran Pantas",
      type: "current",
    },
  ],
});

// Form State Management
const currentStep = ref(1);
const totalSteps = 3;
const isSaving = ref(false);
const showSuccessAlert = ref(false);

// Step Details for Modern Progress Indicator
const stepDetails = ref([
  {
    title: "Maklumat Peribadi",
    description: "Isi data diri dan identiti",
  },
  {
    title: "Alamat & Hubungan",
    description: "Alamat kediaman dan waris",
  },
  {
    title: "Bank & Tanggungan",
    description: "Maklumat bank dan tanggungan",
  },
]);

// URS Required Form Data Structure
const personalInfo = ref({
  nama: "",
  noKp: "",
  tarikhLahir: "",
  tempatLahir: "", // URS required field
  jantina: "",
  statusPerkahwinan: "",
});

const addressInfo = ref({
  alamatPenuh: "",
  negeri: "Selangor", // Fixed as per URS
  daerah: "",
  poskod: "",
  kariah: "",
  tempohMenetap: "", // URS required field
});

const contactInfo = ref({
  noTelefon: "",
  emel: "",
  pekerjaan: "",
  pendapatan: "",
});

const emergencyContact = ref({
  namaWaris: "",
  noTelefonWaris: "",
  hubunganWaris: "",
});

const bankingInfo = ref({
  namaBank: "",
  noAkaun: "",
  caraBayaran: "akaun", // Default to account
  sebabTunai: "", // Required if caraBayaran is 'tunai'
});

// URS Required Dependents Structure
const dependents = ref([
  {
    id: 1,
    nama: "",
    noKpSijil: "",
    hubungan: "",
    umur: "",
    status: "", // Sekolah/Bekerja dsb.
    kosSaraan: "",
    pendapatan: "",
    kesihatan: "",
  },
]);

// Form validation errors
const errors = ref({});

// Options - Following URS specifications
const jantinaOptions = [
  { label: "Lelaki", value: "lelaki" },
  { label: "Perempuan", value: "perempuan" },
];

const statusPerkahwinanOptions = [
  { label: "Bujang", value: "bujang" },
  { label: "Berkahwin", value: "berkahwin" },
  { label: "Janda/Duda", value: "janda_duda" },
  { label: "Bercerai", value: "bercerai" },
];

const daerahOptions = [
  { label: "Klang", value: "klang" },
  { label: "Petaling", value: "petaling" },
  { label: "Shah Alam", value: "shah_alam" },
  { label: "Subang Jaya", value: "subang_jaya" },
  { label: "Kajang", value: "kajang" },
  { label: "Ampang", value: "ampang" },
  { label: "Sepang", value: "sepang" },
  { label: "Hulu Langat", value: "hulu_langat" },
  { label: "Kuala Selangor", value: "kuala_selangor" },
];

const bankOptions = [
  { label: "Maybank", value: "maybank" },
  { label: "CIMB Bank", value: "cimb" },
  { label: "Public Bank", value: "public_bank" },
  { label: "RHB Bank", value: "rhb" },
  { label: "Hong Leong Bank", value: "hong_leong" },
  { label: "AmBank", value: "ambank" },
  { label: "Bank Islam", value: "bank_islam" },
  { label: "Bank Rakyat", value: "bank_rakyat" },
  { label: "BSN", value: "bsn" },
  { label: "Bank Muamalat", value: "bank_muamalat" },
];

const hubunganOptions = [
  { label: "Anak", value: "anak" },
  { label: "Pasangan", value: "pasangan" },
  { label: "Ibu Bapa", value: "ibu_bapa" },
  { label: "Adik Beradik", value: "adik_beradik" },
  { label: "Cucu", value: "cucu" },
  { label: "Lain-lain", value: "lain_lain" },
];

const caraBayaranOptions = [
  { label: "Akaun Bank", value: "akaun" },
  { label: "Cek", value: "cek" },
  { label: "Tunai", value: "tunai" },
];

const tempohMenetapOptions = [
  { label: "Kurang dari 1 tahun", value: "<1" },
  { label: "1-5 tahun", value: "1-5" },
  { label: "6-10 tahun", value: "6-10" },
  { label: "Lebih dari 10 tahun", value: ">10" },
];

// Enhanced validation following URS requirements
const validateCurrentStep = () => {
  errors.value = {};

  switch (currentStep.value) {
    case 1: // Personal Information
      if (!personalInfo.value.nama.trim()) {
        errors.value.nama = "Nama penuh adalah wajib";
      }
      if (!personalInfo.value.noKp.trim()) {
        errors.value.noKp = "No. Kad Pengenalan adalah wajib";
      } else if (!/^\d{12}$/.test(personalInfo.value.noKp.replace(/\D/g, ""))) {
        errors.value.noKp = "Format No. KP tidak sah";
      }
      if (!personalInfo.value.tarikhLahir) {
        errors.value.tarikhLahir = "Tarikh lahir adalah wajib";
      }
      if (!personalInfo.value.tempatLahir.trim()) {
        errors.value.tempatLahir = "Tempat lahir adalah wajib";
      }
      if (!personalInfo.value.jantina) {
        errors.value.jantina = "Jantina adalah wajib";
      }
      if (!personalInfo.value.statusPerkahwinan) {
        errors.value.statusPerkahwinan = "Status perkahwinan adalah wajib";
      }
      break;

    case 2: // Address & Contact
      if (!addressInfo.value.alamatPenuh.trim()) {
        errors.value.alamatPenuh = "Alamat penuh adalah wajib";
      }
      if (!addressInfo.value.daerah) {
        errors.value.daerah = "Daerah adalah wajib";
      }
      if (!addressInfo.value.poskod.trim()) {
        errors.value.poskod = "Poskod adalah wajib";
      } else if (!/^\d{5}$/.test(addressInfo.value.poskod)) {
        errors.value.poskod = "Format poskod tidak sah";
      }
      if (!addressInfo.value.tempohMenetap) {
        errors.value.tempohMenetap = "Tempoh menetap di Selangor adalah wajib";
      }
      if (!contactInfo.value.noTelefon.trim()) {
        errors.value.noTelefon = "No. telefon adalah wajib";
      }
      if (!emergencyContact.value.namaWaris.trim()) {
        errors.value.namaWaris = "Nama waris adalah wajib";
      }
      if (!emergencyContact.value.noTelefonWaris.trim()) {
        errors.value.noTelefonWaris = "No. telefon waris adalah wajib";
      }
      if (!emergencyContact.value.hubunganWaris) {
        errors.value.hubunganWaris = "Hubungan waris adalah wajib";
      }
      break;

    case 3: // Banking & Dependents
      if (!bankingInfo.value.namaBank) {
        errors.value.namaBank = "Nama bank adalah wajib";
      }
      if (
        bankingInfo.value.caraBayaran === "akaun" &&
        !bankingInfo.value.noAkaun.trim()
      ) {
        errors.value.noAkaun = "No. akaun bank adalah wajib";
      }
      if (
        bankingInfo.value.caraBayaran === "tunai" &&
        !bankingInfo.value.sebabTunai.trim()
      ) {
        errors.value.sebabTunai = "Sebab memilih tunai adalah wajib";
      }
      break;
  }

  return Object.keys(errors.value).length === 0;
};

const canProceed = computed(() => validateCurrentStep());

// Step Navigation
const nextStep = () => {
  if (validateCurrentStep() && currentStep.value < totalSteps) {
    currentStep.value++;
    // Auto-save on step change
    autoSave();
  } else {
    // Focus on first error field
    const firstError = Object.keys(errors.value)[0];
    if (firstError) {
      const element = document.querySelector(`[name="${firstError}"]`);
      element?.focus();
    }
  }
};

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
};

const goToStep = (step) => {
  if (step <= currentStep.value || validateCurrentStep()) {
    currentStep.value = step;
  }
};

// Dependents Management
const addDependent = () => {
  dependents.value.push({
    id: Date.now(),
    nama: "",
    noKpSijil: "",
    hubungan: "",
    umur: "",
    status: "",
    kosSaraan: "",
    pendapatan: "",
    kesihatan: "",
  });
};

const removeDependent = (index) => {
  if (dependents.value.length > 1) {
    dependents.value.splice(index, 1);
  }
};

// Auto-save functionality per URS requirements
const autoSave = () => {
  const draftData = {
    personalInfo: personalInfo.value,
    addressInfo: addressInfo.value,
    contactInfo: contactInfo.value,
    emergencyContact: emergencyContact.value,
    bankingInfo: bankingInfo.value,
    dependents: dependents.value,
    currentStep: currentStep.value,
    lastSaved: new Date().toISOString(),
  };

  localStorage.setItem("registrationDraft", JSON.stringify(draftData));

  // Show toast notification
  showToast("Draf disimpan secara automatik");
};

// Load draft on mount
onMounted(() => {
  const draft = localStorage.getItem("registrationDraft");
  if (draft) {
    try {
      const draftData = JSON.parse(draft);
      const draftAge = Date.now() - new Date(draftData.lastSaved).getTime();

      // Load draft if less than 24 hours old
      if (draftAge < 24 * 60 * 60 * 1000) {
        Object.assign(personalInfo.value, draftData.personalInfo || {});
        Object.assign(addressInfo.value, draftData.addressInfo || {});
        Object.assign(contactInfo.value, draftData.contactInfo || {});
        Object.assign(emergencyContact.value, draftData.emergencyContact || {});
        Object.assign(bankingInfo.value, draftData.bankingInfo || {});
        dependents.value = draftData.dependents || [dependents.value[0]];
        currentStep.value = draftData.currentStep || 1;
      }
    } catch (error) {
      console.error("Error loading draft:", error);
    }
  }
});

// Auto-save on blur events
const setupAutoSave = () => {
  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  return debounce(autoSave, 30000); // 30 seconds
};

const debouncedAutoSave = setupAutoSave();

// Form Submission
const submitForm = async () => {
  if (!validateCurrentStep()) {
    return;
  }

  isSaving.value = true;

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Generate profile ID per URS
    const profileId = "P" + Date.now().toString().slice(-6);

    // Complete profile data structure
    const profileData = {
      profileId,
      personalInfo: personalInfo.value,
      addressInfo: addressInfo.value,
      contactInfo: contactInfo.value,
      emergencyContact: emergencyContact.value,
      bankingInfo: bankingInfo.value,
      dependents: dependents.value,
      createdAt: new Date().toISOString(),
      createdBy: "EKP-001", // This would come from logged-in user
    };

    // Store new profile data for next step
    localStorage.setItem("newProfile", JSON.stringify(profileData));

    // Clear draft
    localStorage.removeItem("registrationDraft");

    showSuccessAlert.value = true;

    // Auto redirect to application form per URS workflow
    setTimeout(() => {
      navigateTo("/BF-PRF/AS/QS-1/permohonan-bantuan");
    }, 3000);
  } catch (error) {
    console.error("Error saving profile:", error);
    showToast("Gagal menyimpan profil. Sila cuba lagi.", "error");
  } finally {
    isSaving.value = false;
  }
};

// Utility functions
const formatIcNumber = (value) => {
  const numbers = value.replace(/\D/g, "");
  if (numbers.length >= 6) {
    return (
      numbers.slice(0, 6) +
      "-" +
      numbers.slice(6, 8) +
      "-" +
      numbers.slice(8, 12)
    );
  }
  return numbers;
};

const onIcInput = (event) => {
  personalInfo.value.noKp = formatIcNumber(event.target.value);
  if (errors.value.noKp) {
    delete errors.value.noKp;
  }
};

const showToast = (message, type = "success") => {
  const toast = document.createElement("div");
  toast.className = `nas-toast nas-toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    if (document.body.contains(toast)) {
      document.body.removeChild(toast);
    }
  }, 3000);
};

// Watch for auto-save triggers
watch(
  [personalInfo, addressInfo, contactInfo, emergencyContact, bankingInfo],
  debouncedAutoSave,
  { deep: true }
);
</script>

<template>
  <div>
    <!-- Page Header following Typography Standards -->
    <div class="nas-page-header">
      <div class="nas-header-content">
        <div class="nas-header-icon">
          <Icon name="heroicons:user-plus" class="nas-icon-primary" />
        </div>
        <div class="nas-header-text">
          <h1 class="nas-page-title">Borang Pendaftaran Pantas</h1>
          <p class="nas-page-description">
            Daftar profil baharu untuk permohonan bantuan
          </p>
        </div>
      </div>
    </div>

    <!-- Simple Progress Indicator -->
    <div class="nas-wizard-container">
      <div class="nas-progress-steps">
        <div
          v-for="step in totalSteps"
          :key="step"
          class="nas-step-item"
          :class="{
            'nas-step-completed': step < currentStep,
            'nas-step-active': step === currentStep,
            'nas-step-upcoming': step > currentStep,
          }"
          @click="goToStep(step)"
        >
          <div class="nas-step-circle">
            <Icon
              v-if="step < currentStep"
              name="heroicons:check"
              class="nas-step-icon"
            />
            <span v-else class="nas-step-number">{{ step }}</span>
          </div>
          <div class="nas-step-line" v-if="step < totalSteps"></div>
        </div>
      </div>

      <div class="nas-step-labels">
        <span class="nas-step-label">Maklumat Peribadi</span>
        <span class="nas-step-label">Alamat & Hubungan</span>
        <span class="nas-step-label">Bank & Tanggungan</span>
      </div>

      <div class="nas-step-info">
        Langkah {{ currentStep }} dari {{ totalSteps }}
      </div>
    </div>

    <!-- Form Content following Form Design Standards -->
    <RsCard class="nas-form-card">
      <!-- Step 1: Personal Information -->
      <template v-if="currentStep === 1" #header>
        <div class="nas-form-header">
          <Icon name="heroicons:identification" class="nas-header-icon" />
          <h2 class="nas-section-header">Maklumat Peribadi</h2>
        </div>
      </template>

      <div v-if="currentStep === 1" class="nas-form-body">
        <!-- Logical Field Grouping -->
        <div class="nas-field-section">
          <h3 class="nas-subsection-header">Maklumat Asas</h3>
          <div class="nas-field-grid">
            <!-- Nama -->
            <div class="nas-field-full">
              <label class="nas-field-label">
                Nama Penuh <span class="nas-required">*</span>
              </label>
              <input
                v-model="personalInfo.nama"
                type="text"
                placeholder="Masukkan nama penuh"
                class="nas-form-input"
                required
              />
              <div class="nas-helper-text">Wajib diisi</div>
            </div>

            <!-- No KP -->
            <div class="nas-field-half">
              <label class="nas-field-label">
                No. Kad Pengenalan <span class="nas-required">*</span>
              </label>
              <input
                :value="personalInfo.noKp"
                @input="onIcInput"
                type="text"
                placeholder="123456-78-9012"
                maxlength="14"
                class="nas-form-input nas-mono-input"
                required
              />
              <div class="nas-helper-text">Format: 123456-78-9012</div>
            </div>

            <!-- Tarikh Lahir -->
            <div class="nas-field-half">
              <label class="nas-field-label">
                Tarikh Lahir <span class="nas-required">*</span>
              </label>
              <input
                v-model="personalInfo.tarikhLahir"
                type="date"
                class="nas-form-input"
                required
              />
              <div class="nas-helper-text">Wajib diisi</div>
            </div>

            <!-- Tempat Lahir -->
            <div class="nas-field-half">
              <label class="nas-field-label">
                Tempat Lahir <span class="nas-required">*</span>
              </label>
              <input
                v-model="personalInfo.tempatLahir"
                type="text"
                placeholder="Masukkan tempat lahir"
                class="nas-form-input"
                required
              />
              <div class="nas-helper-text">Wajib diisi</div>
            </div>

            <!-- Jantina -->
            <div class="nas-field-half">
              <label class="nas-field-label">
                Jantina <span class="nas-required">*</span>
              </label>
              <select
                v-model="personalInfo.jantina"
                class="nas-form-select"
                required
              >
                <option value="">Pilih jantina</option>
                <option
                  v-for="option in jantinaOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
              <div class="nas-helper-text">Wajib diisi</div>
            </div>

            <!-- Status Perkahwinan -->
            <div class="nas-field-half">
              <label class="nas-field-label">
                Status Perkahwinan <span class="nas-required">*</span>
              </label>
              <select
                v-model="personalInfo.statusPerkahwinan"
                class="nas-form-select"
                required
              >
                <option value="">Pilih status</option>
                <option
                  v-for="option in statusPerkahwinanOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
              <div class="nas-helper-text">Wajib diisi</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 2: Address & Contact -->
      <template v-if="currentStep === 2" #header>
        <div class="nas-form-header">
          <Icon name="heroicons:map-pin" class="nas-header-icon" />
          <h2 class="nas-section-header">Alamat & Maklumat Hubungan</h2>
        </div>
      </template>

      <div v-if="currentStep === 2" class="nas-form-body">
        <!-- Address Section -->
        <div class="nas-field-section">
          <h3 class="nas-subsection-header">Alamat Pemohon</h3>
          <div class="nas-field-grid">
            <!-- Alamat Penuh -->
            <div class="nas-field-full">
              <label class="nas-field-label">
                Alamat Penuh <span class="nas-required">*</span>
              </label>
              <textarea
                v-model="addressInfo.alamatPenuh"
                rows="3"
                placeholder="Masukkan alamat lengkap"
                class="nas-form-textarea"
                required
              ></textarea>
              <div class="nas-helper-text">Wajib diisi</div>
            </div>

            <!-- Daerah -->
            <div class="nas-field-third">
              <label class="nas-field-label">
                Daerah <span class="nas-required">*</span>
              </label>
              <select
                v-model="addressInfo.daerah"
                class="nas-form-select"
                required
              >
                <option value="">Pilih daerah</option>
                <option
                  v-for="option in daerahOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
              <div class="nas-helper-text">Wajib diisi</div>
            </div>

            <!-- Poskod -->
            <div class="nas-field-third">
              <label class="nas-field-label">
                Poskod <span class="nas-required">*</span>
              </label>
              <input
                v-model="addressInfo.poskod"
                type="text"
                maxlength="5"
                placeholder="43000"
                class="nas-form-input"
                required
              />
              <div class="nas-helper-text">5 digit poskod</div>
            </div>

            <!-- Kariah -->
            <div class="nas-field-third">
              <label class="nas-field-label">Kariah</label>
              <input
                v-model="addressInfo.kariah"
                type="text"
                placeholder="Nama kariah"
                class="nas-form-input"
              />
              <div class="nas-helper-text">Pilihan</div>
            </div>

            <!-- Tempoh Menetap -->
            <div class="nas-field-half">
              <label class="nas-field-label">
                Tempoh Menetap di Selangor <span class="nas-required">*</span>
              </label>
              <select
                v-model="addressInfo.tempohMenetap"
                class="nas-form-select"
                required
              >
                <option value="">Pilih tempoh</option>
                <option
                  v-for="option in tempohMenetapOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
              <div class="nas-helper-text">Wajib diisi</div>
            </div>
          </div>
        </div>

        <!-- Contact Section -->
        <div class="nas-field-section">
          <h3 class="nas-subsection-header">Maklumat Perhubungan</h3>
          <div class="nas-field-grid">
            <!-- No Telefon -->
            <div class="nas-field-half">
              <label class="nas-field-label">
                No. Telefon <span class="nas-required">*</span>
              </label>
              <input
                v-model="contactInfo.noTelefon"
                type="tel"
                placeholder="013-1234567"
                class="nas-form-input"
                required
              />
              <div class="nas-helper-text">Wajib diisi</div>
            </div>

            <!-- Emel -->
            <div class="nas-field-half">
              <label class="nas-field-label">Alamat Emel</label>
              <input
                v-model="contactInfo.emel"
                type="email"
                placeholder="nama@contoh.com"
                class="nas-form-input"
              />
              <div class="nas-helper-text">Pilihan</div>
            </div>

            <!-- Pekerjaan -->
            <div class="nas-field-half">
              <label class="nas-field-label">Pekerjaan</label>
              <input
                v-model="contactInfo.pekerjaan"
                type="text"
                placeholder="Jawatan/Pekerjaan"
                class="nas-form-input"
              />
              <div class="nas-helper-text">Pilihan</div>
            </div>

            <!-- Pendapatan -->
            <div class="nas-field-half">
              <label class="nas-field-label">Pendapatan Bulanan (RM)</label>
              <input
                v-model="contactInfo.pendapatan"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                class="nas-form-input"
              />
              <div class="nas-helper-text">Pilihan</div>
            </div>
          </div>
        </div>

        <!-- Emergency Contact -->
        <div class="nas-field-section">
          <h3 class="nas-subsection-header">Maklumat Waris</h3>
          <div class="nas-field-grid">
            <!-- Nama Waris -->
            <div class="nas-field-half">
              <label class="nas-field-label">
                Nama Waris <span class="nas-required">*</span>
              </label>
              <input
                v-model="emergencyContact.namaWaris"
                type="text"
                placeholder="Nama penuh waris"
                class="nas-form-input"
                required
              />
              <div class="nas-helper-text">Wajib diisi</div>
            </div>

            <!-- No Telefon Waris -->
            <div class="nas-field-half">
              <label class="nas-field-label">
                No. Telefon Waris <span class="nas-required">*</span>
              </label>
              <input
                v-model="emergencyContact.noTelefonWaris"
                type="tel"
                placeholder="013-1234567"
                class="nas-form-input"
                required
              />
              <div class="nas-helper-text">Wajib diisi</div>
            </div>

            <!-- Hubungan Waris -->
            <div class="nas-field-half">
              <label class="nas-field-label">
                Hubungan <span class="nas-required">*</span>
              </label>
              <select
                v-model="emergencyContact.hubunganWaris"
                class="nas-form-select"
                required
              >
                <option value="">Pilih hubungan</option>
                <option
                  v-for="option in hubunganOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
              <div class="nas-helper-text">Wajib diisi</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 3: Banking & Dependents -->
      <template v-if="currentStep === 3" #header>
        <div class="nas-form-header">
          <Icon name="heroicons:credit-card" class="nas-header-icon" />
          <h2 class="nas-section-header">Maklumat Bank & Tanggungan</h2>
        </div>
      </template>

      <div v-if="currentStep === 3" class="nas-form-body">
        <!-- Banking Information -->
        <div class="nas-field-section">
          <h3 class="nas-subsection-header">Maklumat Bank</h3>
          <div class="nas-field-grid">
            <!-- Nama Bank -->
            <div class="nas-field-half">
              <label class="nas-field-label">
                Nama Bank <span class="nas-required">*</span>
              </label>
              <select
                v-model="bankingInfo.namaBank"
                class="nas-form-select"
                required
              >
                <option value="">Pilih bank</option>
                <option
                  v-for="option in bankOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
              <div class="nas-helper-text">Wajib diisi</div>
            </div>

            <!-- Cara Bayaran -->
            <div class="nas-field-half">
              <label class="nas-field-label">
                Cara Bayaran <span class="nas-required">*</span>
              </label>
              <select
                v-model="bankingInfo.caraBayaran"
                class="nas-form-select"
                required
              >
                <option value="akaun">Akaun Bank</option>
                <option value="tunai">Tunai</option>
                <option value="cek">Cek</option>
              </select>
              <div class="nas-helper-text">Wajib diisi</div>
            </div>

            <!-- No Akaun (if not cash) -->
            <div
              v-if="bankingInfo.caraBayaran !== 'tunai'"
              class="nas-field-half"
            >
              <label class="nas-field-label">
                No. Akaun <span class="nas-required">*</span>
              </label>
              <input
                v-model="bankingInfo.noAkaun"
                type="text"
                placeholder="1234567890"
                class="nas-form-input nas-mono-input"
                :required="bankingInfo.caraBayaran !== 'tunai'"
              />
              <div class="nas-helper-text">Wajib diisi</div>
            </div>

            <!-- Sebab Tunai (if cash) -->
            <div
              v-if="bankingInfo.caraBayaran === 'tunai'"
              class="nas-field-full"
            >
              <label class="nas-field-label">
                Sebab Pilih Tunai <span class="nas-required">*</span>
              </label>
              <textarea
                v-model="bankingInfo.sebabTunai"
                rows="2"
                placeholder="Nyatakan sebab memilih bayaran tunai"
                class="nas-form-textarea"
                required
              ></textarea>
              <div class="nas-helper-text">Wajib diisi</div>
            </div>
          </div>
        </div>

        <!-- Dependents Section -->
        <div class="nas-field-section">
          <div class="nas-section-header-with-action">
            <h3 class="nas-subsection-header">Maklumat Tanggungan</h3>
            <RsButton
              variant="info-outline"
              size="sm"
              @click="addDependent"
              class="nas-add-button"
            >
              <Icon name="heroicons:plus" class="nas-button-icon" />
              Tambah
            </RsButton>
          </div>

          <div
            v-for="(dependent, index) in dependents"
            :key="dependent.id"
            class="nas-dependent-card"
          >
            <div class="nas-dependent-header">
              <h4 class="nas-dependent-title">Tanggungan {{ index + 1 }}</h4>
              <RsButton
                v-if="dependents.length > 1"
                variant="danger-outline"
                size="sm"
                @click="removeDependent(index)"
                class="nas-remove-button"
              >
                <Icon name="heroicons:x-mark" class="nas-button-icon" />
              </RsButton>
            </div>

            <div class="nas-dependent-fields">
              <!-- Nama -->
              <div class="nas-field-dependent">
                <label class="nas-field-label-sm">Nama</label>
                <input
                  v-model="dependent.nama"
                  type="text"
                  placeholder="Nama tanggungan"
                  class="nas-form-input-sm"
                />
              </div>

              <!-- No KP/Sijil -->
              <div class="nas-field-dependent">
                <label class="nas-field-label-sm">No. KP/Sijil Lahir</label>
                <input
                  v-model="dependent.noKpSijil"
                  type="text"
                  placeholder="123456-78-9012"
                  class="nas-form-input-sm nas-mono-input"
                />
              </div>

              <!-- Hubungan -->
              <div class="nas-field-dependent">
                <label class="nas-field-label-sm">Hubungan</label>
                <select v-model="dependent.hubungan" class="nas-form-select-sm">
                  <option value="">Pilih</option>
                  <option
                    v-for="option in hubunganOptions"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </option>
                </select>
              </div>

              <!-- Umur -->
              <div class="nas-field-dependent">
                <label class="nas-field-label-sm">Umur</label>
                <input
                  v-model="dependent.umur"
                  type="number"
                  min="0"
                  placeholder="0"
                  class="nas-form-input-sm"
                />
              </div>

              <!-- Status -->
              <div class="nas-field-dependent">
                <label class="nas-field-label-sm">Status</label>
                <input
                  v-model="dependent.status"
                  type="text"
                  placeholder="Sekolah/Bekerja/dsb"
                  class="nas-form-input-sm"
                />
              </div>

              <!-- Kesihatan -->
              <div class="nas-field-dependent">
                <label class="nas-field-label-sm">Kesihatan</label>
                <input
                  v-model="dependent.kesihatan"
                  type="text"
                  placeholder="Sihat/Kronik/dsb"
                  class="nas-form-input-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </RsCard>

    <!-- Navigation Buttons following Button Standards -->
    <div class="nas-form-footer">
      <RsButton
        v-if="currentStep > 1"
        variant="secondary-outline"
        size="lg"
        @click="prevStep"
        class="nas-back-button"
      >
        <Icon name="heroicons:arrow-left" class="nas-button-icon" />
        Kembali
      </RsButton>
      <div v-else></div>

      <div class="nas-form-actions">
        <RsButton
          v-if="currentStep < totalSteps"
          variant="primary"
          size="lg"
          @click="nextStep"
          :disabled="!canProceed"
          class="nas-next-button"
        >
          Seterusnya
          <Icon name="heroicons:arrow-right" class="nas-button-icon" />
        </RsButton>

        <RsButton
          v-else
          variant="success"
          size="lg"
          @click="submitForm"
          :disabled="!canProceed || isSaving"
          class="nas-submit-button"
        >
          <div class="nas-button-content">
            <div v-if="isSaving" class="nas-loading-spinner"></div>
            <Icon v-else name="heroicons:check" class="nas-button-icon" />
            {{ isSaving ? "Menyimpan..." : "Simpan & Teruskan" }}
          </div>
        </RsButton>
      </div>
    </div>

    <!-- Auto-save Info -->
    <div class="nas-context-info">
      <div class="nas-context-content">
        <div class="nas-user-info">
          <Icon name="heroicons:information-circle" class="nas-context-icon" />
          <span class="nas-context-text"
            >Data akan disimpan secara automatik</span
          >
        </div>
        <div class="nas-system-info">Pengguna: EKP/Pendaftar NAS</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Smooth transitions */
input,
select,
textarea {
  transition: all 0.2s ease-in-out;
}

/* Focus styles */
input:focus,
select:focus,
textarea:focus {
  transform: translateY(-1px);
}

/* Step animation */
.step-transition-enter-active,
.step-transition-leave-active {
  transition: all 0.3s ease-in-out;
}

.step-transition-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.step-transition-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

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

/* Simple Progress Indicator */
.nas-wizard-container {
  margin-bottom: 32px;
}

.nas-progress-steps {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  position: relative;
}

.nas-step-item {
  position: relative;
  text-align: center;
  cursor: pointer;
  flex: 1;
  display: flex;
  justify-content: center;
}

.nas-step-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  transition: all 0.2s ease-in-out;
  position: relative;
  z-index: 2;
}

.nas-step-number {
  font-size: 16px;
  font-weight: 600;
  color: #9ca3af;
}

.nas-step-icon {
  width: 18px;
  height: 18px;
  color: white;
}

.nas-step-line {
  position: absolute;
  top: 50%;
  left: 60px;
  right: -60px;
  height: 2px;
  background-color: #e5e7eb;
  z-index: 1;
}

.nas-step-item:last-child .nas-step-line {
  display: none;
}

/* Step States */
.nas-step-completed .nas-step-circle {
  border-color: #16a34a;
  background-color: #16a34a;
}

.nas-step-completed .nas-step-number {
  color: white;
}

.nas-step-completed .nas-step-line {
  background-color: #16a34a;
}

.nas-step-active .nas-step-circle {
  border-color: #005aad;
  background-color: #005aad;
}

.nas-step-active .nas-step-number {
  color: white;
}

.nas-step-upcoming .nas-step-circle {
  border-color: #e5e7eb;
  background-color: white;
}

.nas-step-upcoming .nas-step-number {
  color: #9ca3af;
}

.nas-step-labels {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}

.nas-step-label {
  font-size: 12px;
  font-weight: 500;
  color: #6b7280;
  text-align: center;
  flex: 1;
}

.nas-step-info {
  text-align: center;
  font-size: 14px;
  font-weight: 400;
  color: #6b7280;
  background-color: #f8fafc;
  padding: 8px 16px;
  border-radius: 16px;
  display: inline-block;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .nas-step-circle {
    width: 32px;
    height: 32px;
  }

  .nas-step-number {
    font-size: 14px;
  }

  .nas-step-icon {
    width: 16px;
    height: 16px;
  }

  .nas-step-line {
    left: 48px;
    right: -48px;
  }

  .nas-step-label {
    font-size: 10px;
  }

  .nas-step-info {
    font-size: 12px;
    padding: 6px 12px;
  }
}

/* Form Card */
.nas-form-card {
  margin-bottom: 24px;
}

.nas-form-header {
  display: flex;
  align-items: center;
}

.nas-header-icon {
  width: 20px;
  height: 20px;
  color: #6b7280;
  margin-right: 8px;
}

.nas-form-body {
  padding: 24px;
}

/* Field Sections - Logical Grouping */
.nas-field-section {
  margin-bottom: 32px;
}

.nas-field-section:last-child {
  margin-bottom: 0;
}

.nas-section-header-with-action {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

/* Field Grid Layout */
.nas-field-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(12, 1fr);
}

.nas-field-full {
  grid-column: span 12;
}

.nas-field-half {
  grid-column: span 6;
}

.nas-field-third {
  grid-column: span 4;
}

@media (max-width: 768px) {
  .nas-field-half,
  .nas-field-third {
    grid-column: span 12;
  }
}

/* Form Fields */
.nas-field-label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
  display: block;
  line-height: 1.5;
}

.nas-required {
  color: #d32f2f; /* Exact color from specifications */
  margin-left: 2px;
}

.nas-helper-text {
  font-size: 12px;
  font-weight: 400;
  color: #6b7280;
  margin-top: 4px;
  line-height: 1.5;
}

/* Form Inputs */
.nas-form-input,
.nas-form-select,
.nas-form-textarea {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  font-family: "Inter", sans-serif;
  background-color: #ffffff;
  transition: all 0.2s ease-in-out;
  line-height: 1.5;
}

.nas-form-input:focus,
.nas-form-select:focus,
.nas-form-textarea:focus {
  outline: none;
  border-color: #005aad;
  box-shadow: 0 0 0 3px rgba(0, 90, 173, 0.1);
  transform: translateY(-1px);
}

.nas-form-textarea {
  resize: vertical;
  min-height: 80px;
}

.nas-mono-input {
  font-family: "Monaco", "Menlo", "Ubuntu Mono", monospace;
}

/* Dependents */
.nas-dependent-card {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

.nas-dependent-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.nas-dependent-title {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.nas-dependent-fields {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

@media (max-width: 768px) {
  .nas-dependent-fields {
    grid-template-columns: 1fr;
  }
}

.nas-field-dependent {
  display: flex;
  flex-direction: column;
}

.nas-field-label-sm {
  font-size: 12px;
  font-weight: 500;
  color: #6b7280;
  margin-bottom: 4px;
}

.nas-form-input-sm,
.nas-form-select-sm {
  padding: 8px 12px;
  font-size: 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-family: "Inter", sans-serif;
  background-color: #ffffff;
  transition: all 0.2s ease-in-out;
}

.nas-form-input-sm:focus,
.nas-form-select-sm:focus {
  outline: none;
  border-color: #005aad;
  box-shadow: 0 0 0 2px rgba(0, 90, 173, 0.1);
}

/* Buttons */
.nas-add-button {
  margin-left: 16px;
}

.nas-button-icon {
  width: 16px;
  height: 16px;
  margin-right: 4px;
}

.nas-remove-button .nas-button-icon {
  margin: 0;
  width: 14px;
  height: 14px;
}

/* Form Footer - Button Placement */
.nas-form-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.nas-form-actions {
  display: flex;
  gap: 12px;
}

.nas-button-content {
  display: flex;
  align-items: center;
  justify-content: center;
}

.nas-loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 8px;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Context Information */
.nas-context-info {
  margin-top: 32px;
  padding: 16px;
  background-color: #f9fafb;
  border-radius: 8px;
}

.nas-context-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
}

.nas-user-info {
  display: flex;
  align-items: center;
  color: #6b7280;
}

.nas-context-icon {
  width: 16px;
  height: 16px;
  margin-right: 8px;
}

.nas-context-text {
  font-weight: 400;
}

.nas-system-info {
  color: #9ca3af;
  font-size: 10px;
}

@media (max-width: 640px) {
  .nas-context-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .nas-form-footer {
    flex-direction: column;
    gap: 12px;
  }

  .nas-form-actions {
    width: 100%;
    flex-direction: column;
  }

  .nas-next-button,
  .nas-submit-button,
  .nas-back-button {
    width: 100%;
  }
}
</style>
