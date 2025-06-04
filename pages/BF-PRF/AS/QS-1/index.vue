<script setup>
import { ref, computed, onMounted, watch } from 'vue'

definePageMeta({
  title: "Pendaftaran Pantas - Bantuan Kecemasan",
  breadcrumb: [
    {
      name: "Pendaftaran Pantas",
      type: "current",
    },
  ],
});

const router = useRouter();

// Application state management
const currentApplication = ref(null);
const currentStep = ref("start");
const completedSteps = ref([]);

onMounted(() => {
  initializeApplicationState();
});

// Initialize application state and determine current step
const initializeApplicationState = () => {
  // Check for existing application
  const storedApplication = localStorage.getItem("currentApplication");
  if (storedApplication) {
    currentApplication.value = JSON.parse(storedApplication);
    
    // Determine completed steps and current step based on application data
    updateWorkflowStatus();
  }
};

// Enhanced workflow status determination
const updateWorkflowStatus = () => {
  const app = currentApplication.value;
  const completed = [];
  
  // Step 1: Search - Always completed if we have application data
  if (app) {
    completed.push("search");
  }
  
  // Step 2: Registration - Check if profile was newly created
  if (app.profileData?.profileExists === false || localStorage.getItem("newProfile")) {
    completed.push("registration");
  }
  
  // Step 3: Application - Check if application data exists
  if (app.applicationData || app.jenisBantuan) {
    completed.push("application");
  }
  
  // Step 4: Interview - Check if interview data exists
  if (app.interviewData || app.interviewCompletedAt) {
    completed.push("interview");
  }
  
  // Step 5: Approval - Check if approval data exists
  if (app.approvalData || app.approvalCompletedAt) {
    completed.push("approval");
  }
  
  // Step 6: Disbursement - Check if disbursement data exists
  if (app.disbursementData || app.disbursementCompletedAt) {
    completed.push("disbursement");
  }
  
  // Step 7: Handover - Check if handover data exists
  if (app.handoverData || app.handoverCompletedAt) {
    completed.push("handover");
  }
  
  // Step 8: Receipt - Check if receipt data exists
  if (app.receiptData || app.receiptCompletedAt) {
    completed.push("receipt");
  }
  
  // Step 9: Audit - Check if audit is complete
  if (app.auditCompletedAt || app.status === "Audit Selesai") {
    completed.push("audit");
  }
  
  completedSteps.value = completed;
  
  // Determine current step based on application status and completion
  determineCurrentStep(app, completed);
};

// Determine current active step
const determineCurrentStep = (app, completed) => {
  // If audit is complete, we're done
  if (app.status === "Audit Selesai" || completed.includes("audit")) {
    currentStep.value = "audit";
    return;
  }
  
  // Check each step in reverse order to find current step
  const stepOrder = ["search", "registration", "application", "interview", "approval", "disbursement", "handover", "receipt", "audit"];
  
  // Find the last completed step and set current to next step
  let lastCompleted = -1;
  for (let i = stepOrder.length - 1; i >= 0; i--) {
    if (completed.includes(stepOrder[i])) {
      lastCompleted = i;
      break;
    }
  }
  
  // Set current step to next after last completed
  if (lastCompleted >= 0 && lastCompleted < stepOrder.length - 1) {
    currentStep.value = stepOrder[lastCompleted + 1];
  } else if (lastCompleted === -1) {
    // No steps completed yet
    currentStep.value = "search";
  } else {
    // All steps completed
    currentStep.value = "audit";
  }
  
  // Handle special cases based on status
  if (app.status === "Ditolak") {
    currentStep.value = "rejected";
  } else if (app.status === "Dalam Siasatan") {
    currentStep.value = "interview";
  } else if (app.status === "Menunggu Kelulusan") {
    currentStep.value = "approval";
  } else if (app.status === "Diluluskan") {
    currentStep.value = "disbursement";
  } else if (app.status === "Tunai Disahkan") {
    currentStep.value = "handover";
  } else if (app.status === "Telah Diagih") {
    currentStep.value = "receipt";
  } else if (app.status === "Selesai") {
    currentStep.value = "audit";
  }
};

// Check if a specific step is completed
const isStepCompleted = (stepId) => {
  return completedSteps.value.includes(stepId);
};

// Check if a step is the current active step
const isCurrentStep = (stepId) => {
  return currentStep.value === stepId;
};

// Check if a step is available (can be accessed)
const isStepAvailable = (stepId) => {
  // Search is always available
  if (stepId === "search") return true;
  
  // Registration is available after search (but conditional)
  if (stepId === "registration") {
    return completedSteps.value.includes("search");
  }
  
  // Other steps require previous steps to be completed
  const stepOrder = ["search", "registration", "application", "interview", "approval", "disbursement", "handover", "receipt", "audit"];
  const stepIndex = stepOrder.indexOf(stepId);
  
  if (stepIndex === -1) return false;
  
  // Check if all previous required steps are completed
  for (let i = 0; i < stepIndex; i++) {
    const requiredStep = stepOrder[i];
    // Registration is optional if profile already exists
    if (requiredStep === "registration" && currentApplication.value?.profileData?.profileExists) {
      continue;
    }
    if (!completedSteps.value.includes(requiredStep)) {
      return false;
    }
  }
  
  return true;
};

// Workflow steps with dynamic status
const workflowSteps = computed(() => [
  {
    id: "search",
    title: "Carian Profil",
    description: "Cari profil asnaf sedia ada atau daftar profil baharu",
    icon: "heroicons:magnifying-glass",
    path: "/BF-PRF/AS/QS-1/carian-profil",
    user: "EKP",
    estimatedTime: "2-5 minit",
  },
  {
    id: "registration",
    title: "Pendaftaran Pantas",
    description: "Daftar profil baharu untuk asnaf (jika diperlukan)",
    icon: "heroicons:user-plus",
    path: "/BF-PRF/AS/QS-1/pendaftaran-pantas",
    user: "EKP",
    estimatedTime: "5-10 minit",
    conditional: true,
  },
  {
    id: "application",
    title: "Permohonan Bantuan",
    description: "Isi borang permohonan bantuan kecemasan",
    icon: "heroicons:document-text",
    path: "/BF-PRF/AS/QS-1/permohonan-bantuan",
    user: "EKP",
    estimatedTime: "10-15 minit",
  },
  {
    id: "interview",
    title: "Temubual & Siasatan",
    description: "Sesi temubual EKP dan buat cadangan bantuan",
    icon: "heroicons:chat-bubble-left-right",
    path: "/BF-PRF/AS/QS-1/temubual-ekp",
    user: "EKP",
    estimatedTime: "15-20 minit",
  },
  {
    id: "approval",
    title: "Kelulusan PKP",
    description: "Semakan dan keputusan kelulusan oleh PKP",
    icon: "heroicons:shield-check",
    path: "/BF-PRF/AS/QS-1/kelulusan-pkp",
    user: "PKP",
    estimatedTime: "5-10 minit",
  },
  {
    id: "disbursement",
    title: "Sahkan Pengeluaran",
    description: "PKP keluarkan tunai dari peti besi dan serah kepada EKP",
    icon: "heroicons:banknotes",
    path: "/BF-PRF/AS/QS-1/sahkan-pengeluaran",
    user: "PKP",
    estimatedTime: "3-5 minit",
  },
  {
    id: "handover",
    title: "Serah Terima Tunai",
    description: "EKP agih tunai kepada pemohon di lokasi yang ditetapkan",
    icon: "heroicons:hand-raised",
    path: "/BF-PRF/AS/QS-1/serah-terima-tunai",
    user: "EKP",
    estimatedTime: "5-10 minit",
  },
  {
    id: "receipt",
    title: "Slip Penerimaan",
    description: "Pemohon tandatangan dan cetak slip penerimaan bantuan",
    icon: "heroicons:document-text",
    path: "/BF-PRF/AS/QS-1/slip-penerimaan",
    user: "EKP/Pemohon",
    estimatedTime: "3-5 minit",
  },
  {
    id: "audit",
    title: "Notifikasi & Jejak Audit",
    description: "Sistem hantar notifikasi dan jana jejak audit lengkap",
    icon: "heroicons:document-magnifying-glass",
    path: "/BF-PRF/AS/QS-1/notifikasi-jejak-audit",
    user: "System",
    estimatedTime: "1-2 minit",
  },
]);

// Start new application
const startNewApplication = () => {
  // Clear any existing application data
  localStorage.removeItem("currentApplication");
  localStorage.removeItem("applicationDraft");
  localStorage.removeItem("selectedProfile");
  localStorage.removeItem("newProfile");
  localStorage.removeItem("registrationDraft");

  // Navigate to profile search
  router.push("/BF-PRF/AS/QS-1/carian-profil");
};

// Continue existing application
const continueApplication = () => {
  if (currentStep.value === "search") {
    router.push("/BF-PRF/AS/QS-1/carian-profil");
  } else if (currentStep.value === "registration") {
    router.push("/BF-PRF/AS/QS-1/pendaftaran-pantas");
  } else if (currentStep.value === "application") {
    router.push("/BF-PRF/AS/QS-1/permohonan-bantuan");
  } else if (currentStep.value === "interview") {
    router.push("/BF-PRF/AS/QS-1/temubual-ekp");
  } else if (currentStep.value === "approval") {
    router.push("/BF-PRF/AS/QS-1/kelulusan-pkp");
  } else if (currentStep.value === "disbursement") {
    router.push("/BF-PRF/AS/QS-1/sahkan-pengeluaran");
  } else if (currentStep.value === "handover") {
    router.push("/BF-PRF/AS/QS-1/serah-terima-tunai");
  } else if (currentStep.value === "receipt") {
    router.push("/BF-PRF/AS/QS-1/slip-penerimaan");
  } else if (currentStep.value === "audit") {
    router.push("/BF-PRF/AS/QS-1/notifikasi-jejak-audit");
  } else if (currentStep.value === "rejected") {
    // Application was rejected, allow new application
    alert("Permohonan telah ditolak. Sila buat permohonan baharu.");
    startNewApplication();
  } else {
    // Default to current step
    const nextStep = workflowSteps.value.find(step => step.id === currentStep.value);
    if (nextStep) {
      router.push(nextStep.path);
    }
  }
};

// Navigate to specific step
const navigateToStep = (step) => {
  if (isStepAvailable(step.id) || isStepCompleted(step.id)) {
    router.push(step.path);
  } else {
    alert(`Langkah ${step.title} belum tersedia. Sila selesaikan langkah sebelumnya terlebih dahulu.`);
  }
};

// Quick actions
const quickActions = [
  {
    title: "Bantuan Segera",
    description: "Untuk kes kecemasan yang memerlukan bantuan segera",
    icon: "heroicons:exclamation-triangle",
    action: startNewApplication,
    variant: "danger",
  },
  {
    title: "Permohonan Biasa",
    description: "Untuk permohonan bantuan rutin",
    icon: "heroicons:document-plus",
    action: startNewApplication,
    variant: "primary",
  },
];

// Format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("ms-MY", {
    style: "currency",
    currency: "MYR",
  }).format(amount);
};

// Get status badge variant
const getStatusVariant = (status) => {
  const variants = {
    "Dalam Siasatan": "warning",
    "Menunggu Kelulusan": "info",
    Diluluskan: "success",
    Ditolak: "danger",
    "Selesai": "success",
    "Audit Selesai": "success",
  };
  return variants[status] || "default";
};

// Debug function to check localStorage data
const debugApplicationData = () => {
  console.log("Current Application:", currentApplication.value);
  console.log("Completed Steps:", completedSteps.value);
  console.log("Current Step:", currentStep.value);
  console.log("LocalStorage currentApplication:", localStorage.getItem("currentApplication"));
};

// Watch for localStorage changes
watch(() => localStorage.getItem("currentApplication"), (newValue) => {
  if (newValue) {
    currentApplication.value = JSON.parse(newValue);
    updateWorkflowStatus();
  }
}, { immediate: true });
</script>

<template>
  <div>
    <!-- Page Header -->
    <div class="nas-page-header">
      <div class="nas-header-content">
        <div class="nas-header-icon">
          <Icon name="heroicons:bolt" class="nas-icon-primary" />
        </div>
        <div class="nas-header-text">
          <h1 class="nas-page-title">Pendaftaran Pantas - Bantuan Kecemasan</h1>
          <p class="nas-page-description">
            Sistem permohonan bantuan kecemasan yang dipantas untuk asnaf
          </p>
        </div>
      </div>
    </div>

    <!-- Current Application Status (if exists) -->
    <div v-if="currentApplication" class="nas-current-application">
      <RsCard class="nas-status-card">
        <template #header>
          <div class="nas-card-header">
            <Icon name="heroicons:document-check" class="nas-icon-header" />
            <h2 class="nas-section-header">Status Permohonan Semasa</h2>
          </div>
        </template>

        <div class="nas-card-body">
          <div class="nas-application-status">
            <div class="nas-status-grid">
              <div class="nas-status-field">
                <span class="nas-field-label">ID Permohonan:</span>
                <span class="nas-field-value nas-mono">{{
                  currentApplication.applicationId
                }}</span>
              </div>
              <div class="nas-status-field">
                <span class="nas-field-label">Pemohon:</span>
                <span class="nas-field-value">{{
                  currentApplication.profileData?.nama ||
                  currentApplication.profileData?.personalInfo?.nama
                }}</span>
              </div>
              <div class="nas-status-field">
                <span class="nas-field-label">Jenis Bantuan:</span>
                <span class="nas-field-value">{{
                  currentApplication.jenisBantuan
                }}</span>
              </div>
              <div class="nas-status-field">
                <span class="nas-field-label">Jumlah:</span>
                <span class="nas-field-value">{{
                  formatCurrency(currentApplication.jumlahDimohon)
                }}</span>
              </div>
              <div class="nas-status-field">
                <span class="nas-field-label">Status:</span>
                <RsBadge :variant="getStatusVariant(currentApplication.status)">
                  {{ currentApplication.status }}
                </RsBadge>
              </div>
              <div class="nas-status-field">
                <span class="nas-field-label">Tarikh Mohon:</span>
                <span class="nas-field-value">{{
                  new Date(currentApplication.createdAt).toLocaleDateString(
                    "ms-MY"
                  )
                }}</span>
              </div>
            </div>

            <div
              v-if="currentStep !== 'completed'"
              class="nas-continue-section"
            >
              <RsButton
                variant="primary"
                size="lg"
                @click="continueApplication"
              >
                <Icon
                  name="heroicons:arrow-right"
                  class="nas-button-icon-left"
                />
                Teruskan Permohonan
              </RsButton>
            </div>
          </div>
        </div>
      </RsCard>
    </div>

    <!-- Quick Actions -->
    <div class="nas-quick-actions">
      <h2 class="nas-section-title">Mula Permohonan Baharu</h2>
      <div class="nas-actions-grid">
        <div
          v-for="action in quickActions"
          :key="action.title"
          class="nas-action-card"
          @click="action.action"
        >
          <div class="nas-action-icon" :class="`nas-${action.variant}`">
            <Icon :name="action.icon" />
          </div>
          <div class="nas-action-content">
            <h3 class="nas-action-title">{{ action.title }}</h3>
            <p class="nas-action-description">{{ action.description }}</p>
          </div>
          <Icon name="heroicons:arrow-right" class="nas-action-arrow" />
        </div>
      </div>
    </div>

    <!-- Workflow Overview -->
    <div class="nas-workflow-section">
      <RsCard class="nas-workflow-card">
        <template #header>
          <div class="nas-card-header">
            <Icon name="heroicons:arrows-right-left" class="nas-icon-header" />
            <h2 class="nas-section-header">Aliran Kerja Pendaftaran Pantas</h2>
          </div>
        </template>

        <div class="nas-card-body">
          <div class="nas-workflow-steps">
            <div
              v-for="(step, index) in workflowSteps"
              :key="step.id"
              class="nas-step-item"
              :class="{
                'nas-step-current': isCurrentStep(step.id),
                'nas-step-completed': isStepCompleted(step.id),
                'nas-step-available': isStepAvailable(step.id),
                'nas-step-conditional': step.conditional && !isStepCompleted(step.id) && currentApplication?.profileData?.profileExists,
                'nas-step-unavailable': !isStepAvailable(step.id) && !isStepCompleted(step.id),
              }"
            >
              <div class="nas-step-indicator">
                <div class="nas-step-icon">
                  <Icon 
                    v-if="isStepCompleted(step.id)"
                    name="heroicons:check"
                  />
                  <Icon 
                    v-else-if="isCurrentStep(step.id)"
                    name="heroicons:arrow-right"
                  />
                  <Icon 
                    v-else
                    :name="step.icon" 
                  />
                </div>
                <div
                  v-if="index < workflowSteps.length - 1"
                  class="nas-step-connector"
                  :class="{
                    'nas-connector-completed': isStepCompleted(step.id),
                    'nas-connector-current': isCurrentStep(step.id),
                  }"
                ></div>
              </div>

              <div class="nas-step-content">
                <div class="nas-step-header">
                  <h3 class="nas-step-title">
                    {{ step.title }}
                    <span v-if="step.conditional && !isStepCompleted(step.id) && currentApplication?.profileData?.profileExists" class="nas-conditional-label">
                      (Dilangkau)
                    </span>
                  </h3>
                  <div class="nas-step-meta">
                    <RsBadge variant="outline" size="sm">{{
                      step.user
                    }}</RsBadge>
                    <span class="nas-step-time">{{ step.estimatedTime }}</span>
                    <RsBadge 
                      v-if="isStepCompleted(step.id)" 
                      variant="success" 
                      size="sm"
                    >
                      Selesai
                    </RsBadge>
                    <RsBadge 
                      v-else-if="isCurrentStep(step.id)" 
                      variant="warning" 
                      size="sm"
                    >
                      Sedang Aktif
                    </RsBadge>
                    <RsBadge 
                      v-else-if="!isStepAvailable(step.id)" 
                      variant="secondary" 
                      size="sm"
                    >
                      Menunggu
                    </RsBadge>
                  </div>
                </div>
                <p class="nas-step-description">{{ step.description }}</p>

                <div class="nas-step-actions">
                  <RsButton
                    :variant="isStepCompleted(step.id) ? 'outline' : isCurrentStep(step.id) ? 'primary' : 'outline'"
                    size="sm"
                    @click="navigateToStep(step)"
                    :disabled="!isStepAvailable(step.id) && !isStepCompleted(step.id)"
                  >
                    <Icon
                      :name="isStepCompleted(step.id) ? 'heroicons:eye' : isCurrentStep(step.id) ? 'heroicons:play' : 'heroicons:arrow-top-right-on-square'"
                      class="nas-button-icon-left"
                    />
                    {{ isStepCompleted(step.id) ? 'Lihat' : isCurrentStep(step.id) ? 'Teruskan' : 'Buka Halaman' }}
                  </RsButton>

                  <!-- Debug button (remove in production) -->
                  <RsButton
                    v-if="step.id === 'search'"
                    variant="ghost"
                    size="sm"
                    @click="debugApplicationData"
                    class="nas-debug-button"
                  >
                    <Icon name="heroicons:bug-ant" class="nas-button-icon-left" />
                    Debug
                  </RsButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </RsCard>
    </div>

    <!-- Help & Guidelines -->
    <div class="nas-help-section">
      <RsCard class="nas-help-card">
        <div class="nas-help-content">
          <Icon name="heroicons:information-circle" class="nas-help-icon" />
          <div class="nas-help-text">
            <h3 class="nas-help-title">Panduan Penggunaan</h3>
            <ul class="nas-help-list">
              <li>
                <strong>Bantuan Segera:</strong> Untuk kes kecemasan yang
                memerlukan tindakan segera (dalam masa 24 jam)
              </li>
              <li>
                <strong>Permohonan Biasa:</strong> Untuk permohonan bantuan
                rutin yang boleh diproses dalam tempoh biasa
              </li>
              <li>
                <strong>EKP:</strong> Bertanggungjawab untuk carian profil,
                pendaftaran, permohonan dan temubual
              </li>
              <li>
                <strong>PKP:</strong> Bertanggungjawab untuk kelulusan akhir
                berdasarkan cadangan EKP
              </li>
              <li>
                <strong>Anggaran Masa:</strong> Keseluruhan proses mengambil
                masa 30-60 minit bergantung kepada kes
              </li>
            </ul>
          </div>
        </div>
      </RsCard>
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

.nas-section-title {
  font-size: 20px;
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

/* Current Application Status */
.nas-current-application {
  margin-bottom: 32px;
}

.nas-status-card {
  border-left: 4px solid #8dc73d; /* LZS Secondary Green */
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

.nas-application-status {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.nas-status-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

@media (max-width: 768px) {
  .nas-status-grid {
    grid-template-columns: 1fr;
  }
}

.nas-status-field {
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

.nas-continue-section {
  display: flex;
  justify-content: center;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
}

/* Quick Actions */
.nas-quick-actions {
  margin-bottom: 32px;
}

.nas-actions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

@media (max-width: 768px) {
  .nas-actions-grid {
    grid-template-columns: 1fr;
  }
}

.nas-action-card {
  display: flex;
  align-items: center;
  padding: 24px;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.nas-action-card:hover {
  border-color: #005aad;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.nas-action-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  flex-shrink: 0;
}

.nas-action-icon.nas-danger {
  background-color: rgba(220, 38, 38, 0.1);
  color: #dc2626;
}

.nas-action-icon.nas-primary {
  background-color: rgba(0, 90, 173, 0.1);
  color: #005aad;
}

.nas-action-icon svg {
  width: 24px;
  height: 24px;
}

.nas-action-content {
  flex: 1;
}

.nas-action-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
  line-height: 1.5;
}

.nas-action-description {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
  line-height: 1.4;
}

.nas-action-arrow {
  width: 20px;
  height: 20px;
  color: #9ca3af;
  margin-left: 12px;
}

/* Workflow Section - Enhanced Step States */
.nas-workflow-section {
  margin-bottom: 32px; /* 24px + 8px spacing scale */
}

.nas-workflow-card {
  border-left: 4px solid #005aad; /* LZS Primary Blue */
}

.nas-workflow-steps {
  display: flex;
  flex-direction: column;
  gap: 24px; /* 24px vertical spacing per specifications */
}

.nas-step-item {
  display: flex;
  align-items: flex-start;
  position: relative;
  transition: all 0.3s ease;
}

/* Step States */
.nas-step-completed {
  opacity: 1;
}

.nas-step-current {
  opacity: 1;
  background-color: rgba(0, 90, 173, 0.02);
  border-radius: 8px;
  padding: 12px;
  margin: -12px;
}

.nas-step-available {
  opacity: 1;
}

.nas-step-conditional {
  opacity: 0.6;
}

.nas-step-unavailable {
  opacity: 0.4;
}

.nas-step-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 24px; /* Updated to 24px per specifications */
  flex-shrink: 0;
}

.nas-step-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #f3f4f6;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #e5e7eb;
  transition: all 0.3s ease;
  z-index: 1;
}

.nas-step-icon svg {
  width: 20px;
  height: 20px;
}

/* Completed step icon */
.nas-step-completed .nas-step-icon {
  background-color: #059669; /* Success green */
  color: white;
  border-color: #059669;
}

/* Current step icon */
.nas-step-current .nas-step-icon {
  background-color: #005aad; /* LZS Primary Blue */
  color: white;
  border-color: #005aad;
  box-shadow: 0 0 0 4px rgba(0, 90, 173, 0.1);
}

/* Available step icon */
.nas-step-available .nas-step-icon {
  background-color: #ffffff;
  color: #005aad;
  border-color: #005aad;
}

/* Conditional (skipped) step icon */
.nas-step-conditional .nas-step-icon {
  background-color: #f59e0b;
  color: white;
  border-color: #f59e0b;
}

/* Unavailable step icon */
.nas-step-unavailable .nas-step-icon {
  background-color: #f3f4f6;
  color: #9ca3af;
  border-color: #d1d5db;
}

.nas-step-connector {
  width: 2px;
  height: 40px;
  background-color: #e5e7eb;
  margin-top: 8px;
  transition: all 0.3s ease;
}

.nas-connector-completed {
  background-color: #059669; /* Success green */
}

.nas-connector-current {
  background-color: #005aad; /* LZS Primary Blue */
}

.nas-step-content {
  flex: 1;
  padding-top: 2px;
}

.nas-step-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.nas-step-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  line-height: 1.5;
}

.nas-conditional-label {
  font-size: 12px;
  font-weight: 400;
  color: #f59e0b;
  font-style: italic;
}

.nas-step-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.nas-step-time {
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
}

.nas-step-description {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 12px 0;
  line-height: 1.5;
}

.nas-step-actions {
  margin-top: 8px;
  display: flex;
  gap: 8px;
  align-items: center;
}

/* Debug button styling */
.nas-debug-button {
  opacity: 0.6;
  font-size: 12px;
}

.nas-debug-button:hover {
  opacity: 1;
}

/* Help Section - Following Alert and Card Standards */
.nas-help-section {
  margin-bottom: 32px; /* 24px + 8px spacing scale */
}

.nas-help-card {
  border-left: 4px solid #fff200; /* LZS Accent Yellow */
  background-color: #fffbeb;
}

.nas-help-content {
  display: flex;
  align-items: flex-start;
  padding: 24px; /* Updated to 24px padding per specifications */
}

.nas-help-icon {
  width: 24px;
  height: 24px;
  color: #f59e0b;
  margin-right: 16px; /* Updated to 16px spacing per specifications */
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
  margin-bottom: 6px;
}

.nas-help-list strong {
  font-weight: 600;
}

/* Button Icons */
.nas-button-icon-left {
  width: 20px;
  height: 20px;
  margin-right: 8px;
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

  .nas-step-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .nas-step-meta {
    gap: 8px;
  }
}
</style>
