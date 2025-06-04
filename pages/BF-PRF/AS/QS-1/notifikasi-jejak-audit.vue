<script setup>
definePageMeta({
  title: "Notifikasi & Jejak Audit",
  breadcrumb: [
    {
      name: "Pendaftaran Pantas",
      path: "/BF-PRF/AS/QS-1",
    },
    {
      name: "Notifikasi & Jejak Audit",
      type: "current",
    },
  ],
});

const router = useRouter();

// Application state management
const applicationData = ref(null);
const auditTrail = ref([]);
const notifications = ref([]);

// Notification data structure following URS Phase 7 requirements
const notificationData = ref({
  namaPemohon: "",
  noKp: "",
  jenisBantuan: "",
  lokasiSerahan: "",
  jumlahTunaiDiagih: "",
  tarikhMasa: "",
  statusNotifikasi: "pending", // pending, sent, delivered, failed
  emailSent: false,
  smsSent: false,
  dashboardNotified: false,
});

// System state management
const isLoadingAudit = ref(false);
const isSendingNotifications = ref(false);
const showSuccessAlert = ref(false);
const auditComplete = ref(false);
const exportInProgress = ref(false);

// Enhanced audit trail columns with proper URS structure
const auditColumns = [
  { key: "timestamp", label: "Tarikh & Masa", sortable: true },
  { key: "phase", label: "Fasa", sortable: true },
  { key: "action", label: "Tindakan", sortable: false },
  { key: "user", label: "Pengguna", sortable: true },
  { key: "status", label: "Status", sortable: true },
  { key: "details", label: "Butiran", sortable: false },
];

// Component lifecycle
onMounted(async () => {
  await initializeAuditProcess();
});

// Initialize the complete audit process
const initializeAuditProcess = async () => {
  try {
    // Get application data from localStorage
    const storedApplication = localStorage.getItem("currentApplication");

    if (!storedApplication) {
      // Redirect if no application data
      router.push("/BF-PRF/AS/QS-1");
      return;
    }

    const appData = JSON.parse(storedApplication);
    applicationData.value = appData;

    // URS Requirement: Only show audit if application is completed
    // if (appData.status !== "Selesai") {
    //   router.push("/BF-PRF/AS/QS-1");
    //   return;
    // }

    // Initialize notification data structure
    initializeNotificationData(appData);

    // Generate comprehensive audit trail
    await generateAuditTrail(appData);

    // Auto-send notifications per URS requirements
    await sendNotifications();
  } catch (error) {
    console.error("Error initializing audit process:", error);
    showToast("Gagal memulakan proses audit", "error");
  }
};

// Initialize notification data from application data
const initializeNotificationData = (appData) => {
  notificationData.value = {
    namaPemohon: appData.nama,
    noKp: appData.noKp,
    jenisBantuan: appData.jenisBantuan,
    lokasiSerahan: appData.handoverData?.lokasiSerahan || "",
    jumlahTunaiDiagih: appData.disbursementData?.jumlahDiluluskan || "",
    tarikhMasa: appData.handoverData?.tarikhMasa || "",
    statusNotifikasi: "pending",
    emailSent: false,
    smsSent: false,
    dashboardNotified: false,
  };
};

// Enhanced audit trail generation following URS workflow phases
const generateAuditTrail = async (appData) => {
  isLoadingAudit.value = true;

  try {
    const trail = [];

    // Phase 1: Profile Search & Registration - URS Phase 1
    if (appData.profileData) {
      trail.push({
        id: 1,
        timestamp: appData.profileSearchedAt || appData.createdAt,
        phase: "Fasa 1",
        action: "Carian Profil",
        user: "EKP-001",
        status: "Selesai",
        details: `Profil ${
          appData.profileData.profileExists ? "dijumpai" : "tidak dijumpai"
        } - ${appData.nama}`,
      });

      if (!appData.profileData.profileExists) {
        trail.push({
          id: 2,
          timestamp: appData.registrationCompletedAt || appData.createdAt,
          phase: "Fasa 1",
          action: "Pendaftaran Pantas",
          user: "EKP-001",
          status: "Selesai",
          details: `Profil baru didaftarkan - ${appData.nama} (${appData.noKp})`,
        });
      }
    }

    // Phase 2: Application Submission - URS Phase 2
    if (appData.applicationData) {
      trail.push({
        id: 3,
        timestamp: appData.applicationSubmittedAt || appData.createdAt,
        phase: "Fasa 2",
        action: "Permohonan Bantuan",
        user: "EKP-001",
        status: "Selesai",
        details: `Permohonan ${appData.jenisBantuan} - RM ${formatCurrency(
          appData.jumlahDimohon
        )}`,
      });
    }

    // Phase 3: EKP Interview & Investigation - URS Phase 3
    if (appData.interviewData) {
      trail.push({
        id: 4,
        timestamp: appData.interviewCompletedAt || appData.createdAt,
        phase: "Fasa 3",
        action: "Temubual & Siasatan EKP",
        user: "EKP-001",
        status: "Selesai",
        details: `Siasatan selesai - Syor: ${
          appData.interviewData.syorBantuan ? "Lulus" : "Tolak"
        }`,
      });
    }

    // Phase 4: PKP Approval - URS Phase 4
    if (appData.approvalData) {
      trail.push({
        id: 5,
        timestamp: appData.approvalCompletedAt || appData.createdAt,
        phase: "Fasa 4",
        action: "Kelulusan PKP",
        user: "PKP-001",
        status:
          appData.approvalData.keputusan === "lulus" ? "Diluluskan" : "Ditolak",
        details:
          appData.approvalData.keputusan === "lulus"
            ? `Diluluskan - RM ${formatCurrency(
                appData.approvalData.jumlahDiluluskan
              )}`
            : `Ditolak - ${appData.approvalData.sebabPenolakan}`,
      });
    }

    // Phase 5: Cash Disbursement - URS Phase 5
    if (appData.disbursementData) {
      trail.push({
        id: 6,
        timestamp: appData.disbursementCompletedAt || appData.createdAt,
        phase: "Fasa 5",
        action: "Sahkan Pengeluaran",
        user: "PKP-001",
        status: "Selesai",
        details: `Tunai disahkan - RM ${formatCurrency(
          appData.disbursementData.jumlahDiluluskan
        )} (${appData.disbursementData.slipRekod})`,
      });
    }

    // Phase 6: Cash Handover - URS Phase 6
    if (appData.handoverData) {
      trail.push({
        id: 7,
        timestamp: appData.handoverCompletedAt || appData.createdAt,
        phase: "Fasa 6",
        action: "Serah Terima Tunai",
        user: appData.handedOverBy || "EKP-001",
        status: "Selesai",
        details: `Tunai diagih di ${getLocationLabel(
          appData.handoverData.lokasiSerahan
        )} - RM ${formatCurrency(appData.handoverData.jumlahTunaiDiagih)}`,
      });
    }

    // Phase 7: Receipt & Completion - URS Phase 7
    if (appData.receiptData) {
      trail.push({
        id: 8,
        timestamp: appData.receiptCompletedAt || appData.createdAt,
        phase: "Fasa 7",
        action: "Slip Penerimaan",
        user: appData.completedBy || "System",
        status: "Selesai",
        details: `Slip dijana - ${appData.receiptData.slipNumber} (${appData.receiptData.signatureMethod})`,
      });
    }

    // Current Phase: Notifications & Audit - URS Phase 7 Final
    trail.push({
      id: 9,
      timestamp: new Date().toISOString(),
      phase: "Fasa 7",
      action: "Notifikasi & Jejak Audit",
      user: "System",
      status: "Sedang Berlangsung",
      details: "Menjana jejak audit dan menghantar notifikasi",
    });

    // Sort by timestamp for chronological order
    auditTrail.value = trail.sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
    );
  } catch (error) {
    console.error("Error generating audit trail:", error);
    showToast("Gagal menjana jejak audit", "error");
  } finally {
    isLoadingAudit.value = false;
  }
};

// Enhanced notification system following URS requirements
const sendNotifications = async () => {
  isSendingNotifications.value = true;

  try {
    // URS Requirement: Send multiple notification types
    await Promise.all([
      sendEmailNotification(),
      sendSMSNotification(),
      sendDashboardNotification(),
    ]);

    // Update notification status
    notificationData.value.statusNotifikasi = "sent";

    // Add audit entry for notifications
    auditTrail.value.push({
      id: auditTrail.value.length + 1,
      timestamp: new Date().toISOString(),
      phase: "Fasa 7",
      action: "Notifikasi Dihantar",
      user: "System",
      status: "Selesai",
      details: `Email: ${
        notificationData.value.emailSent ? "Berjaya" : "Gagal"
      }, SMS: ${
        notificationData.value.smsSent ? "Berjaya" : "Gagal"
      }, Dashboard: ${
        notificationData.value.dashboardNotified ? "Berjaya" : "Gagal"
      }`,
    });

    // Complete audit process
    setTimeout(() => {
      completeAuditProcess();
    }, 3000);
  } catch (error) {
    console.error("Error sending notifications:", error);
    showToast("Gagal menghantar notifikasi", "error");
  } finally {
    isSendingNotifications.value = false;
  }
};

// Complete the audit process
const completeAuditProcess = () => {
  auditComplete.value = true;
  showSuccessAlert.value = true;

  // Add final audit entry
  auditTrail.value.push({
    id: auditTrail.value.length + 1,
    timestamp: new Date().toISOString(),
    phase: "Fasa 7",
    action: "Jejak Audit Selesai",
    user: "System",
    status: "Selesai",
    details: "Jejak audit lengkap telah dijana dan disimpan ke sistem log",
  });

  // Update application status in localStorage
  const updatedApplication = {
    ...applicationData.value,
    auditTrail: auditTrail.value,
    notifications: notifications.value,
    notificationData: notificationData.value,
    status: "Audit Selesai",
    auditCompletedAt: new Date().toISOString(),
  };

  localStorage.setItem(
    "currentApplication",
    JSON.stringify(updatedApplication)
  );
};

// Individual notification functions with enhanced error handling
const sendEmailNotification = async () => {
  try {
    // Simulate API call with realistic timing
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // 90% success rate simulation
    if (Math.random() > 0.1) {
      notificationData.value.emailSent = true;
      notifications.value.push({
        id: 1,
        type: "email",
        status: "success",
        message: `Email dihantar kepada ${notificationData.value.namaPemohon}`,
        timestamp: new Date().toISOString(),
      });
    } else {
      throw new Error("Email service unavailable");
    }
  } catch (error) {
    notifications.value.push({
      id: 1,
      type: "email",
      status: "failed",
      message: "Gagal menghantar email - Perkhidmatan tidak tersedia",
      timestamp: new Date().toISOString(),
    });
  }
};

const sendSMSNotification = async () => {
  try {
    // Simulate API call with realistic timing
    await new Promise((resolve) => setTimeout(resolve, 1200));

    // 85% success rate simulation
    if (Math.random() > 0.15) {
      notificationData.value.smsSent = true;
      notifications.value.push({
        id: 2,
        type: "sms",
        status: "success",
        message: `SMS dihantar kepada ${notificationData.value.namaPemohon}`,
        timestamp: new Date().toISOString(),
      });
    } else {
      throw new Error("SMS service unavailable");
    }
  } catch (error) {
    notifications.value.push({
      id: 2,
      type: "sms",
      status: "failed",
      message: "Gagal menghantar SMS - Perkhidmatan tidak tersedia",
      timestamp: new Date().toISOString(),
    });
  }
};

const sendDashboardNotification = async () => {
  try {
    // Simulate API call with realistic timing
    await new Promise((resolve) => setTimeout(resolve, 800));

    // 95% success rate simulation
    if (Math.random() > 0.05) {
      notificationData.value.dashboardNotified = true;
      notifications.value.push({
        id: 3,
        type: "dashboard",
        status: "success",
        message: "Notifikasi dashboard dikemaskini",
        timestamp: new Date().toISOString(),
      });
    } else {
      throw new Error("Dashboard service unavailable");
    }
  } catch (error) {
    notifications.value.push({
      id: 3,
      type: "dashboard",
      status: "failed",
      message: "Gagal mengemas kini dashboard - Perkhidmatan tidak tersedia",
      timestamp: new Date().toISOString(),
    });
  }
};

// Utility functions
const getLocationLabel = (locationValue) => {
  const locations = {
    "kaunter-1": "Kaunter 1 - Tingkat 1",
    "kaunter-2": "Kaunter 2 - Tingkat 1",
    "kaunter-3": "Kaunter 3 - Tingkat 2",
    "kaunter-4": "Kaunter 4 - Tingkat 2",
    "bilik-vip": "Bilik VIP - Tingkat 2",
    "ruang-khas": "Ruang Khas - Tingkat 1",
  };
  return locations[locationValue] || locationValue;
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("ms-MY", {
    style: "currency",
    currency: "MYR",
  }).format(amount);
};

const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleString("ms-MY", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

const getStatusBadgeVariant = (status) => {
  switch (status) {
    case "Selesai":
    case "Diluluskan":
    case "success":
      return "success";
    case "Ditolak":
    case "failed":
      return "error";
    case "Sedang Berlangsung":
      return "warning";
    default:
      return "secondary";
  }
};

const getNotificationIcon = (type) => {
  switch (type) {
    case "email":
      return "heroicons:envelope";
    case "sms":
      return "heroicons:device-phone-mobile";
    case "dashboard":
      return "heroicons:computer-desktop";
    default:
      return "heroicons:bell";
  }
};

// Navigation functions
const navigateToDashboard = () => {
  router.push("/BF-PRF/AS/QS-1");
};

const startNewApplication = () => {
  // Clear all stored application data
  localStorage.removeItem("currentApplication");
  localStorage.removeItem("applicationDraft");
  localStorage.removeItem("selectedProfile");
  localStorage.removeItem("newProfile");
  localStorage.removeItem("registrationDraft");

  // Navigate to the start of the process
  router.push("/BF-PRF/AS/QS-1/carian-profil");
};

// Enhanced export functionality
const exportAuditTrail = async () => {
  exportInProgress.value = true;

  try {
    const auditData = {
      applicationId: applicationData.value?.id,
      applicantName: applicationData.value?.nama,
      applicantIC: applicationData.value?.noKp,
      assistanceType: applicationData.value?.jenisBantuan,
      totalAmount: applicationData.value?.disbursementData?.jumlahDiluluskan,
      auditTrail: auditTrail.value,
      notifications: notifications.value,
      notificationData: notificationData.value,
      exportedAt: new Date().toISOString(),
      exportedBy: "System",
      version: "1.0",
    };

    const blob = new Blob([JSON.stringify(auditData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-trail-${applicationData.value?.id || "unknown"}-${
      new Date().toISOString().split("T")[0]
    }.json`;
    a.click();
    URL.revokeObjectURL(url);

    showToast("Jejak audit berjaya diexport", "success");
  } catch (error) {
    console.error("Error exporting audit trail:", error);
    showToast("Gagal mengexport jejak audit", "error");
  } finally {
    exportInProgress.value = false;
  }
};

// Toast notification utility
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
        <h3 class="nas-alert-title">Jejak Audit & Notifikasi Selesai</h3>
        <p class="nas-alert-description">
          Jejak audit lengkap telah dijana dan semua notifikasi telah dihantar
          kepada pemohon. Proses Pendaftaran Pantas telah selesai sepenuhnya.
        </p>
      </div>
    </RsAlert>

    <!-- Loading Alert -->
    <RsAlert
      v-if="isLoadingAudit || isSendingNotifications"
      type="info"
      class="nas-loading-alert"
    >
      <template #icon>
        <Icon name="heroicons:arrow-path" class="nas-spinning" />
      </template>
      <div>
        <h3 class="nas-alert-title">
          {{
            isLoadingAudit
              ? "Menjana Jejak Audit..."
              : "Menghantar Notifikasi..."
          }}
        </h3>
        <p class="nas-alert-description">
          {{
            isLoadingAudit
              ? "Sistem sedang menjana jejak audit lengkap untuk semua fasa."
              : "Sistem sedang menghantar notifikasi kepada pemohon melalui pelbagai saluran."
          }}
        </p>
      </div>
    </RsAlert>

    <!-- Page Header -->
    <div class="nas-page-header">
      <div class="nas-header-content">
        <div class="nas-header-icon-wrapper">
          <div class="nas-header-icon">
            <Icon
              name="heroicons:document-magnifying-glass"
              class="nas-icon-primary"
            />
          </div>
        </div>
        <div class="nas-header-text">
          <h1 class="nas-page-title">Notifikasi & Jejak Audit</h1>
          <p class="nas-page-description">
            Jejak audit lengkap dan notifikasi automatik untuk permohonan
            bantuan kecemasan
          </p>
        </div>
      </div>
      <div class="nas-header-actions">
        <RsButton
          variant="outline"
          size="sm"
          @click="exportAuditTrail"
          :disabled="!auditComplete || exportInProgress"
          class="nas-export-button"
        >
          <div v-if="exportInProgress" class="nas-loading-spinner-sm"></div>
          <Icon
            v-else
            name="heroicons:arrow-down-tray"
            class="nas-button-icon"
          />
          {{ exportInProgress ? "Mengexport..." : "Export Audit" }}
        </RsButton>
      </div>
    </div>

    <!-- Main Content Container -->
    <div class="nas-main-container">
      <!-- Content Grid Layout -->
      <div class="flex flex-col gap-4">
        <!-- Left Column: Application Summary & Notifications -->
        <div class="">
          <!-- Application Summary Card -->
          <RsCard class="nas-summary-card">
            <template #header>
              <div class="nas-card-header">
                <div class="nas-header-left">
                  <Icon
                    name="heroicons:clipboard-document-check"
                    class="nas-icon-header"
                  />
                  <h2 class="nas-section-header">Ringkasan Permohonan</h2>
                </div>
                <div class="nas-header-right">
                  <RsBadge
                    :variant="auditComplete ? 'success' : 'warning'"
                    size="sm"
                  >
                    {{ auditComplete ? "Audit Selesai" : "Sedang Berlangsung" }}
                  </RsBadge>
                </div>
              </div>
            </template>

            <div class="nas-card-body">
              <div class="nas-summary-grid">
                <div class="nas-summary-row">
                  <div class="nas-summary-item">
                    <div class="nas-summary-label-wrapper">
                      <Icon name="heroicons:hashtag" class="nas-label-icon" />
                      <span class="nas-summary-label">ID Permohonan</span>
                    </div>
                    <span class="nas-summary-value nas-mono">{{
                      applicationData?.id || "N/A"
                    }}</span>
                  </div>
                  <div class="nas-summary-item">
                    <div class="nas-summary-label-wrapper">
                      <Icon name="heroicons:user" class="nas-label-icon" />
                      <span class="nas-summary-label">Nama Pemohon</span>
                    </div>
                    <span class="nas-summary-value">{{
                      notificationData.namaPemohon || "N/A"
                    }}</span>
                  </div>
                </div>

                <div class="nas-summary-row">
                  <div class="nas-summary-item">
                    <div class="nas-summary-label-wrapper">
                      <Icon
                        name="heroicons:identification"
                        class="nas-label-icon"
                      />
                      <span class="nas-summary-label">No. KP</span>
                    </div>
                    <span class="nas-summary-value nas-mono">{{
                      notificationData.noKp || "N/A"
                    }}</span>
                  </div>
                  <div class="nas-summary-item">
                    <div class="nas-summary-label-wrapper">
                      <Icon name="heroicons:gift" class="nas-label-icon" />
                      <span class="nas-summary-label">Jenis Bantuan</span>
                    </div>
                    <span class="nas-summary-value">{{
                      notificationData.jenisBantuan || "N/A"
                    }}</span>
                  </div>
                </div>

                <div class="nas-summary-row">
                  <div class="nas-summary-item nas-amount-item">
                    <div class="nas-summary-label-wrapper">
                      <Icon
                        name="heroicons:banknotes"
                        class="nas-label-icon nas-icon-success"
                      />
                      <span class="nas-summary-label">Jumlah Diagih</span>
                    </div>
                    <span class="nas-summary-value nas-amount">{{
                      notificationData.jumlahTunaiDiagih
                        ? formatCurrency(notificationData.jumlahTunaiDiagih)
                        : "N/A"
                    }}</span>
                  </div>
                </div>

                <div class="nas-summary-row">
                  <div class="nas-summary-item">
                    <div class="nas-summary-label-wrapper">
                      <Icon name="heroicons:map-pin" class="nas-label-icon" />
                      <span class="nas-summary-label">Lokasi Serahan</span>
                    </div>
                    <span class="nas-summary-value">{{
                      notificationData.lokasiSerahan
                        ? getLocationLabel(notificationData.lokasiSerahan)
                        : "N/A"
                    }}</span>
                  </div>
                </div>

                <div class="nas-summary-row">
                  <div class="nas-summary-item">
                    <div class="nas-summary-label-wrapper">
                      <Icon
                        name="heroicons:calendar-days"
                        class="nas-label-icon"
                      />
                      <span class="nas-summary-label">Tarikh & Masa</span>
                    </div>
                    <span class="nas-summary-value">{{
                      notificationData.tarikhMasa
                        ? formatDateTime(notificationData.tarikhMasa)
                        : "N/A"
                    }}</span>
                  </div>
                </div>
              </div>
            </div>
          </RsCard>

          <!-- Notifications Status Card -->
          <RsCard class="nas-notifications-card">
            <template #header>
              <div class="nas-card-header">
                <div class="nas-header-left">
                  <Icon name="heroicons:bell" class="nas-icon-header" />
                  <h2 class="nas-section-header">Status Notifikasi</h2>
                </div>
                <div class="nas-header-right" v-if="notifications.length > 0">
                  <RsBadge variant="secondary" size="sm">
                    {{ notifications.length }} Notifikasi
                  </RsBadge>
                </div>
              </div>
            </template>

            <div class="nas-card-body">
              <div class="nas-notifications-container">
                <div v-if="notifications.length === 0" class="nas-empty-state">
                  <div class="nas-empty-icon-wrapper">
                    <Icon name="heroicons:clock" class="nas-empty-icon" />
                  </div>
                  <p class="nas-empty-text">Notifikasi sedang diproses...</p>
                </div>

                <div v-else class="nas-notifications-list">
                  <div
                    v-for="notification in notifications"
                    :key="notification.id"
                    class="nas-notification-item"
                  >
                    <div class="nas-notification-icon">
                      <Icon
                        :name="getNotificationIcon(notification.type)"
                        :class="
                          notification.status === 'success'
                            ? 'nas-icon-success'
                            : 'nas-icon-error'
                        "
                      />
                    </div>
                    <div class="nas-notification-content">
                      <p class="nas-notification-message">
                        {{ notification.message }}
                      </p>
                      <p class="nas-notification-time">
                        {{ formatDateTime(notification.timestamp) }}
                      </p>
                    </div>
                    <div class="nas-notification-status">
                      <RsBadge
                        :variant="getStatusBadgeVariant(notification.status)"
                        size="sm"
                      >
                        {{
                          notification.status === "success"
                            ? "Berjaya"
                            : "Gagal"
                        }}
                      </RsBadge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </RsCard>
        </div>

        <!-- Right Column: Audit Trail -->
        <div class="">
          <RsCard class="nas-audit-card">
            <template #header>
              <div class="nas-card-header">
                <div class="nas-header-left">
                  <Icon name="heroicons:list-bullet" class="nas-icon-header" />
                  <h2 class="nas-section-header">Jejak Audit Lengkap</h2>
                </div>
                <div class="nas-header-right">
                  <RsBadge variant="secondary" size="sm">
                    {{ auditTrail.length }} Rekod
                  </RsBadge>
                </div>
              </div>
            </template>

            <div class="nas-card-body nas-audit-body">
              <!-- Responsive Table Notice -->
              <div class="nas-table-notice">
                <Icon
                  name="heroicons:arrow-right-left"
                  class="nas-notice-icon"
                />
                <span class="nas-notice-text"
                  >Scroll secara mendatar untuk melihat semua maklumat</span
                >
              </div>

              <!-- Audit Trail Table -->
              <div class="nas-audit-table-wrapper">
                <div class="nas-audit-table-container">
                  <div class="nas-table-scroll-area">
                    <RsTable
                      :data="auditTrail"
                      :columns="auditColumns"
                      :loading="isLoadingAudit"
                      class="nas-audit-table"
                      striped
                      hoverable
                    >
                      <template #cell-timestamp="{ row }">
                        <div class="nas-timestamp">
                          <Icon
                            name="heroicons:clock"
                            class="nas-timestamp-icon"
                          />
                          <div class="nas-timestamp-content">
                            <span class="nas-timestamp-date">{{
                              formatDateTime(row.timestamp).split(" ")[0]
                            }}</span>
                            <span class="nas-timestamp-time">{{
                              formatDateTime(row.timestamp).split(" ")[1]
                            }}</span>
                          </div>
                        </div>
                      </template>

                      <template #cell-phase="{ row }">
                        <RsBadge
                          variant="secondary"
                          size="sm"
                          class="nas-phase-badge"
                        >
                          {{ row.phase }}
                        </RsBadge>
                      </template>

                      <template #cell-action="{ row }">
                        <span class="nas-action-name">{{ row.action }}</span>
                      </template>

                      <template #cell-user="{ row }">
                        <div class="nas-user-info">
                          <Icon name="heroicons:user" class="nas-user-icon" />
                          <span class="nas-user-name">{{ row.user }}</span>
                        </div>
                      </template>

                      <template #cell-status="{ row }">
                        <RsBadge
                          :variant="getStatusBadgeVariant(row.status)"
                          size="sm"
                          class="nas-status-badge"
                        >
                          {{ row.status }}
                        </RsBadge>
                      </template>

                      <template #cell-details="{ row }">
                        <div class="nas-details-wrapper">
                          <p class="nas-details-text">{{ row.details }}</p>
                        </div>
                      </template>

                      <template #loading>
                        <div class="nas-table-loading">
                          <Icon
                            name="heroicons:arrow-path"
                            class="nas-spinning"
                          />
                          <span>Menjana jejak audit...</span>
                        </div>
                      </template>

                      <template #empty>
                        <div class="nas-table-empty">
                          <Icon
                            name="heroicons:document"
                            class="nas-empty-icon"
                          />
                          <span>Tiada data jejak audit</span>
                        </div>
                      </template>
                    </RsTable>
                  </div>

                  <!-- Mobile Table View -->
                  <div class="nas-mobile-table">
                    <div
                      v-for="row in auditTrail"
                      :key="row.id"
                      class="nas-mobile-row"
                    >
                      <div class="nas-mobile-header">
                        <div class="nas-mobile-phase">
                          <RsBadge variant="secondary" size="sm">
                            {{ row.phase }}
                          </RsBadge>
                        </div>
                        <div class="nas-mobile-status">
                          <RsBadge
                            :variant="getStatusBadgeVariant(row.status)"
                            size="sm"
                          >
                            {{ row.status }}
                          </RsBadge>
                        </div>
                      </div>

                      <div class="nas-mobile-content">
                        <h4 class="nas-mobile-action">{{ row.action }}</h4>
                        <p class="nas-mobile-details">{{ row.details }}</p>

                        <div class="nas-mobile-meta">
                          <div class="nas-mobile-user">
                            <Icon
                              name="heroicons:user"
                              class="nas-mobile-icon"
                            />
                            <span>{{ row.user }}</span>
                          </div>
                          <div class="nas-mobile-time">
                            <Icon
                              name="heroicons:clock"
                              class="nas-mobile-icon"
                            />
                            <span>{{ formatDateTime(row.timestamp) }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </RsCard>
        </div>
      </div>
    </div>

    <!-- Action Buttons Container -->
    <div class="nas-actions-container">
      <div class="nas-page-actions">
        <div class="nas-action-left">
          <RsButton
            variant="outline"
            @click="navigateToDashboard"
            :disabled="isSendingNotifications"
            class="nas-back-button"
          >
            <Icon name="heroicons:arrow-left" class="nas-button-icon" />
            Kembali ke Dashboard
          </RsButton>
        </div>

        <div class="nas-action-right">
          <RsButton
            variant="primary"
            @click="exportAuditTrail"
            :disabled="!auditComplete || exportInProgress"
            class="nas-export-action"
          >
            <div v-if="exportInProgress" class="nas-loading-spinner-sm"></div>
            <Icon
              v-else
              name="heroicons:document-arrow-down"
              class="nas-button-icon"
            />
            {{ exportInProgress ? "Mengexport..." : "Export Jejak Audit" }}
          </RsButton>

          <RsButton
            v-if="auditComplete"
            variant="success"
            @click="startNewApplication"
            class="nas-new-application"
          >
            <Icon name="heroicons:plus-circle" class="nas-button-icon" />
            Permohonan Baharu
          </RsButton>
        </div>
      </div>
    </div>

    <!-- System Context Info -->
    <div class="nas-context-container">
      <div class="nas-context-info">
        <div class="nas-context-content">
          <div class="nas-context-row">
            <div class="nas-user-context">
              <Icon
                name="heroicons:information-circle"
                class="nas-context-icon"
              />
              <span class="nas-context-text"
                >Pengguna: EKP/PKP (Sistem Audit)</span
              >
            </div>
            <div class="nas-system-info">
              Jejak audit ini akan disimpan dalam sistem log untuk tempoh 7
              tahun
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* NAS Design System - Refined Layout & Positioning */

/* Typography Hierarchy */
.nas-page-title {
  font-size: 28px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 6px;
  line-height: 1.3;
}

.nas-section-header {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  line-height: 1.4;
  margin: 0;
}

.nas-page-description {
  font-size: 15px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.5;
  margin: 0;
}

/* Page Header - Enhanced Layout */
.nas-page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
  padding: 28px 32px;
  background: linear-gradient(135deg, #005aad 0%, #0ea5e9 100%);
  border-radius: 16px;
  box-shadow: 0 8px 25px rgba(0, 90, 173, 0.15);
  position: relative;
  overflow: hidden;
}

.nas-page-header::before {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  width: 200px;
  height: 200px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 50%;
  transform: translate(50%, -50%);
}

.nas-header-content {
  display: flex;
  align-items: center;
  gap: 20px;
  position: relative;
  z-index: 1;
}

.nas-header-icon-wrapper {
  position: relative;
}

.nas-header-icon {
  width: 56px;
  height: 56px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.nas-icon-primary {
  width: 28px;
  height: 28px;
  color: white;
}

.nas-header-actions {
  position: relative;
  z-index: 1;
}

.nas-export-button {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  transition: all 0.3s ease;
}

.nas-export-button:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

/* Main Content Container */
.nas-main-container {
  margin-bottom: 32px;
}

/* Enhanced Grid Layout */
.nas-content-grid {
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 28px;
  align-items: start;
}

@media (max-width: 1200px) {
  .nas-content-grid {
    grid-template-columns: 380px 1fr;
    gap: 24px;
  }
}

@media (max-width: 1024px) {
  .nas-content-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}

/* Column Layouts */
.nas-left-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: sticky;
  top: 20px;
}

@media (max-width: 1024px) {
  .nas-left-column {
    position: static;
  }
}

.nas-right-column {
  min-height: 600px;
}

/* Enhanced Card Design */
.nas-summary-card,
.nas-notifications-card,
.nas-audit-card {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
  border: 1px solid #e5e7eb;
  overflow: hidden;
  transition: all 0.3s ease;
}

.nas-summary-card:hover,
.nas-notifications-card:hover,
.nas-audit-card:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 2px 4px rgba(0, 0, 0, 0.06);
  transform: translateY(-1px);
}

/* Card Header Layout */
.nas-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.nas-header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.nas-header-right {
  flex-shrink: 0;
}

.nas-icon-header {
  width: 20px;
  height: 20px;
  color: #005aad;
  flex-shrink: 0;
}

/* Card Body Layout */
.nas-card-body {
  padding: 24px;
}

.nas-audit-body {
  padding: 0;
}

/* Enhanced Summary Grid */
.nas-summary-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.nas-summary-row {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.nas-summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #f1f5f9;
  transition: all 0.2s ease;
}

.nas-summary-item:hover {
  background: #f3f4f6;
  border-color: #e5e7eb;
}

.nas-amount-item {
  background: #f0fdf4;
  border-color: #dcfce7;
}

.nas-amount-item:hover {
  background: #ecfccb;
}

.nas-summary-label-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.nas-label-icon {
  width: 16px;
  height: 16px;
  color: #6b7280;
  flex-shrink: 0;
}

.nas-icon-success {
  color: #059669 !important;
}

.nas-summary-label {
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
}

.nas-summary-value {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  text-align: right;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.nas-mono {
  font-family: "SF Mono", "Monaco", "Inconsolata", "Roboto Mono", monospace;
  letter-spacing: 0.05em;
}

.nas-amount {
  font-size: 18px;
  color: #059669;
  font-weight: 700;
}

/* Notifications Container */
.nas-notifications-container {
  min-height: 120px;
}

.nas-notifications-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Enhanced Empty State */
.nas-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px 20px;
  text-align: center;
}

.nas-empty-icon-wrapper {
  width: 64px;
  height: 64px;
  background: #f3f4f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.nas-empty-icon {
  width: 28px;
  height: 28px;
  color: #9ca3af;
}

.nas-empty-text {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

/* Enhanced Notification Items */
.nas-notification-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #fafbfc;
  transition: all 0.3s ease;
}

.nas-notification-item:hover {
  background: #f1f5f9;
  border-color: #d1d5db;
  transform: translateX(4px);
}

.nas-notification-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.nas-icon-success {
  width: 20px;
  height: 20px;
  color: #059669;
  background: #d1fae5;
}

.nas-icon-error {
  width: 20px;
  height: 20px;
  color: #dc2626;
  background: #fee2e2;
}

.nas-notification-content {
  flex: 1;
  min-width: 0;
}

.nas-notification-message {
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
  margin: 0 0 4px 0;
  line-height: 1.4;
}

.nas-notification-time {
  font-size: 12px;
  color: #6b7280;
  margin: 0;
}

.nas-notification-status {
  flex-shrink: 0;
}

/* Enhanced Responsive Table with Overflow */
.nas-table-notice {
  display: none;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: #fef3c7;
  border-bottom: 1px solid #f59e0b;
  color: #92400e;
  font-size: 13px;
  font-weight: 500;
}

.nas-notice-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.nas-notice-text {
  flex: 1;
}

.nas-audit-table-wrapper {
  background: white;
  border-radius: 0 0 12px 12px;
  overflow: hidden;
}

.nas-audit-table-container {
  position: relative;
}

/* Desktop Table with Horizontal Scroll */
.nas-table-scroll-area {
  overflow-x: auto;
  overflow-y: visible;
  border-radius: 0 0 12px 12px;
  /* Custom scrollbar styling */
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 #f1f5f9;
}

.nas-table-scroll-area::-webkit-scrollbar {
  height: 8px;
}

.nas-table-scroll-area::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 0 0 12px 12px;
}

.nas-table-scroll-area::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.nas-table-scroll-area::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.nas-audit-table {
  width: 100%;
  min-width: 1000px; /* Increased for better column spacing */
  margin: 0;
  border-collapse: separate;
  border-spacing: 0;
}

/* Enhanced Table Cells */
.nas-timestamp {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: #6b7280;
  min-width: 200px;
  white-space: nowrap;
}

.nas-timestamp-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  color: #9ca3af;
}

.nas-timestamp-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.nas-timestamp-date {
  font-weight: 500;
  color: #374151;
  font-size: 13px;
}

.nas-timestamp-time {
  font-size: 11px;
  color: #6b7280;
}

.nas-phase-badge {
  white-space: nowrap;
  min-width: fit-content;
}

.nas-action-name {
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
  min-width: 160px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.nas-user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #6b7280;
  min-width: 100px;
  white-space: nowrap;
}

.nas-user-icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

.nas-user-name {
  font-weight: 500;
}

.nas-status-badge {
  white-space: nowrap;
  min-width: fit-content;
}

.nas-details-wrapper {
  max-width: 300px;
  min-width: 200px;
}

.nas-details-text {
  font-size: 13px;
  color: #4b5563;
  margin: 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Mobile Table View */
.nas-mobile-table {
  display: none;
}

.nas-mobile-row {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 20px;
  transition: background-color 0.2s ease;
}

.nas-mobile-row:hover {
  background: #f9fafb;
}

.nas-mobile-row:last-child {
  border-bottom: none;
  border-radius: 0 0 12px 12px;
}

.nas-mobile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.nas-mobile-phase {
  flex-shrink: 0;
}

.nas-mobile-status {
  flex-shrink: 0;
}

.nas-mobile-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nas-mobile-action {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  line-height: 1.4;
}

.nas-mobile-details {
  font-size: 14px;
  color: #4b5563;
  margin: 0;
  line-height: 1.5;
}

.nas-mobile-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f1f5f9;
}

.nas-mobile-user,
.nas-mobile-time {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #6b7280;
}

.nas-mobile-icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

/* Enhanced Table States */
.nas-table-loading,
.nas-table-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48px 24px;
  text-align: center;
  color: #6b7280;
}

.nas-table-loading .nas-spinning {
  width: 32px;
  height: 32px;
  margin-bottom: 12px;
}

.nas-table-empty .nas-empty-icon {
  width: 40px;
  height: 40px;
  margin-bottom: 12px;
}

/* Enhanced Actions Container */
.nas-actions-container {
  margin-top: 40px;
}

.nas-page-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 28px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.nas-action-left {
  display: flex;
}

.nas-action-right {
  display: flex;
  gap: 12px;
}

.nas-back-button {
  transition: all 0.3s ease;
}

.nas-back-button:hover:not(:disabled) {
  transform: translateX(-2px);
}

.nas-export-action,
.nas-new-application {
  transition: all 0.3s ease;
}

.nas-export-action:hover:not(:disabled),
.nas-new-application:hover {
  transform: translateY(-1px);
}

/* Button Icons and Loading */
.nas-button-icon {
  width: 16px;
  height: 16px;
  margin-right: 8px;
  flex-shrink: 0;
}

.nas-loading-spinner-sm {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-right: 8px;
}

/* Enhanced Context Info */
.nas-context-container {
  margin-top: 32px;
}

.nas-context-info {
  padding: 20px 24px;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
}

.nas-context-content {
  max-width: 1200px;
  margin: 0 auto;
}

.nas-context-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.nas-user-context {
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
  color: #005aad;
  font-weight: 600;
}

.nas-system-info {
  font-size: 12px;
  color: #6b7280;
  font-style: italic;
  text-align: right;
}

/* Animations */
.nas-spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Alert Styles */
.nas-success-alert,
.nas-loading-alert {
  margin-bottom: 24px;
  border-radius: 12px;
}

.nas-alert-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
}

.nas-alert-description {
  font-size: 14px;
  margin: 0;
  line-height: 1.5;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .nas-table-notice {
    display: flex;
  }
}

@media (max-width: 768px) {
  .nas-audit-page {
    padding: 0 16px 32px;
  }

  .nas-page-header {
    flex-direction: column;
    gap: 16px;
    text-align: center;
    padding: 24px 20px;
  }

  .nas-header-actions {
    width: 100%;
    justify-content: center;
  }

  .nas-page-actions {
    flex-direction: column-reverse;
    gap: 16px;
  }

  .nas-action-right {
    flex-direction: column;
    width: 100%;
  }

  .nas-context-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .nas-system-info {
    text-align: left;
  }

  .nas-summary-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .nas-summary-value {
    text-align: left;
    max-width: none;
  }

  .nas-notification-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  /* Show mobile table, hide desktop table */
  .nas-table-scroll-area {
    display: none;
  }

  .nas-mobile-table {
    display: block;
  }

  .nas-table-notice {
    display: none;
  }
}

@media (max-width: 640px) {
  .nas-page-title {
    font-size: 24px;
  }

  .nas-card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .nas-header-right {
    align-self: flex-end;
  }

  .nas-mobile-meta {
    flex-direction: column;
    gap: 6px;
  }
}

/* Print Styles */
@media print {
  .nas-page-actions,
  .nas-context-container,
  .nas-header-actions {
    display: none;
  }

  .nas-page-header {
    background: none;
    color: black;
    box-shadow: none;
  }

  .nas-content-grid {
    grid-template-columns: 1fr;
  }

  .nas-summary-card,
  .nas-notifications-card,
  .nas-audit-card {
    box-shadow: none;
    border: 1px solid #ccc;
  }

  .nas-table-scroll-area {
    overflow: visible;
  }

  .nas-audit-table {
    min-width: auto;
  }

  .nas-mobile-table {
    display: none;
  }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  .nas-spinning {
    animation: none;
  }
}

/* High Contrast Mode */
@media (prefers-contrast: high) {
  .nas-summary-card,
  .nas-notifications-card,
  .nas-audit-card {
    border-width: 2px;
  }

  .nas-page-header {
    border: 2px solid #005aad;
  }
}

/* Focus Styles */
button:focus-visible,
input:focus-visible,
select:focus-visible {
  outline: 2px solid #005aad;
  outline-offset: 2px;
  border-radius: 4px;
}

/* Ensure minimum touch targets */
button {
  min-height: 44px;
  min-width: 44px;
}

/* Toast Notifications */
.nas-toast {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  z-index: 1000;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  animation: slideIn 0.3s ease;
}

.nas-toast-success {
  background: #d1fae5;
  color: #047857;
  border: 1px solid #a7f3d0;
}

.nas-toast-error {
  background: #fee2e2;
  color: #dc2626;
  border: 1px solid #fecaca;
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
</style>
