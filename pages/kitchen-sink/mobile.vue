<script setup>
definePageMeta({
  title: "Mobile Kitchen Sink",
  breadcrumb: [
    {
      name: "Kitchen Sink",
      path: "/kitchen-sink",
    },
    {
      name: "Mobile Kitchen Sink",
      type: "current",
    },
  ],
});

// Status Badge Helper Function for Malay terms
const getStatusVariant = (status) => {
  const variants = {
    'Lulus': 'success',      // Green
    'Menunggu': 'warning',   // Orange
    'Ditolak': 'danger',     // Red
    'Draf': 'secondary',     // Grey
    'Baru': 'info',          // Blue
    'Aktif': 'primary'       // Dark Blue
  };
  return variants[status] || 'secondary';
};

// Demo data for Asnaf Zakat users (recipients)
const exampleData = ref({
  headerTitle: "Dashboard Zakat",
  profileExpanded: false,
  showNotifications: false,
  currentSection: 'dashboard',
  previousSection: null,
  showBackButton: false,
  subSection: null,
  
  // Data untuk metrik utama dashboard
  keyMetrics: [
    { 
      title: "Jumlah Agihan Zakat", 
      value: "RM 284.5 J", 
      icon: "ic:baseline-volunteer-activism",
      change: "positive",
      description: "+18.3% berbanding tahun lepas"
    },
    { 
      title: "Jumlah Penerima", 
      value: "412,674", 
      icon: "ic:baseline-people",
      change: "positive",
      description: "+12.4% berbanding tahun lepas"
    },
    { 
      title: "Kadar Pengagihan", 
      value: "92.4%", 
      icon: "ic:baseline-donut-large",
      change: "positive",
      description: "+3.2% berbanding sasaran"
    },
    { 
      title: "Permohonan Diluluskan", 
      value: "38,245", 
      icon: "ic:baseline-fact-check",
      change: "neutral",
      description: "+5.8% berbanding suku tahun"
    }
  ],
  
  // Data untuk kategori agihan zakat mengikut asnaf
  asnafDistribution: [
    { category: "Fakir", percentage: 28.5, amount: 81.1 },
    { category: "Miskin", percentage: 32.7, amount: 93.1 },
    { category: "Amil", percentage: 12.5, amount: 35.6 },
    { category: "Muallaf", percentage: 5.8, amount: 16.5 },
    { category: "Gharimin", percentage: 6.2, amount: 17.6 },
    { category: "Fisabilillah", percentage: 10.2, amount: 29.0 },
    { category: "Ibnu Sabil", percentage: 2.4, amount: 6.8 },
    { category: "Riqab", percentage: 1.7, amount: 4.8 }
  ],

  // Data agihan bulanan
  monthlyDistribution: [
    {
      name: "Agihan 2023",
      data: [18.5, 19.2, 22.4, 24.8, 26.5, 28.2, 29.4, 31.6, 28.8, 25.4, 16.2, 13.5]
    },
    {
      name: "Agihan 2022",
      data: [15.8, 16.4, 19.2, 20.6, 21.8, 23.5, 24.8, 26.3, 24.5, 22.1, 14.6, 11.8]
    }
  ],

  // Data program agihan zakat
  zakatPrograms: [
    { program: "Bantuan Pendidikan", beneficiaries: 98450, amount: 62.8, disbursed: 93.5 },
    { program: "Bantuan Kesihatan", beneficiaries: 74280, amount: 48.5, disbursed: 87.2 },
    { program: "Bantuan Sara Hidup", beneficiaries: 85640, amount: 52.4, disbursed: 95.8 },
    { program: "Bantuan Perumahan", beneficiaries: 28450, amount: 36.2, disbursed: 82.4 }
  ],

  // Data prestasi KPI
  kpiData: [
    { metric: "Kadar Pengagihan Dana Zakat", actual: 92.4, target: 85, status: "Cemerlang" },
    { metric: "Masa Pemprosesan Permohonan", actual: 12, target: 14, status: "Cemerlang" },
    { metric: "Kepuasan Asnaf", actual: 94.2, target: 90, status: "Cemerlang" }
  ],
  demoPages: [
    { 
      id: 'dashboard',
      title: 'Utama',
      icon: 'ic:outline-home'
    },
    { 
      id: 'permohonan',
      title: 'Permohonan',
      icon: 'ic:outline-article'
    },
    { 
      id: 'bantuan',
      title: 'Bantuan',
      icon: 'ic:outline-volunteer-activism'
    },
    { 
      id: 'notifikasi',
      title: 'Notifikasi',
      icon: 'ic:outline-notifications'
    },
    { 
      id: 'profile',
      title: 'Profil',
      icon: 'ic:outline-person'
    }
  ],
  permohonanTabs: [
    { id: 'active', title: 'Aktif' },
    { id: 'draft', title: 'Draf' },
    { id: 'history', title: 'Sejarah' }
  ],
  activeTab: 'active',
  showMenu: false,
  searchQuery: "",
  showEmptyState: false,
  isLoading: false,
  showFabMenu: false,
  
  // User profile data
  userProfile: {
    name: "Muhammad bin Daud",
    id: "860215-14-5732",
    email: "muhammad.daud@example.com",
    phone: "019-8765432",
    address: "No. 45, Jalan Gemilang, Taman Bahagia, 40100 Shah Alam, Selangor",
    position: "Penerima Bantuan",
    department: "Asnaf Fakir",
    joinDate: "10 Jan 2018",
    avatar: "M",
    actions: [
      { name: "Tetapan Akaun", icon: "ic:baseline-settings", action: "settings" },
      { name: "Bantuan", icon: "ic:baseline-help-outline", action: "help" },
      { name: "Log Aktiviti", icon: "ic:baseline-history", action: "activity" }
    ]
  },
  
  // Dashboard data
  dashboardData: {
    totalBantuan: "RM 3,450",
    nextPayment: "15 Jun 2023",
    bantuanBulan: "RM 700",
    totalPendidikan: "RM 200",
    announcements: [
      { 
        id: 1, 
        title: "Program Bantuan Sekolah 2023",
        content: "Permohonan bantuan persekolahan untuk anak-anak asnaf kini dibuka sehingga 30 Jun 2023.",
        date: "10 Jun 2023",
        image: "school-aid.jpg"
      },
      { 
        id: 2, 
        title: "Kursus Kemahiran Digital",
        content: "Kursus percuma untuk asnaf yang berminat dalam kemahiran digital. Tempat terhad!",
        date: "08 Jun 2023",
        image: "digital-course.jpg"
      }
    ],
    upcomingEvents: [
      {
        id: 1,
        title: "Agihan Bantuan Ramadan",
        date: "20 Jun 2023",
        time: "9:00 pagi",
        location: "Kompleks Zakat Selangor"
      },
      {
        id: 2,
        title: "Sesi Kaunseling Kewangan",
        date: "25 Jun 2023",
        time: "10:00 pagi",
        location: "Pusat Komuniti Petaling Jaya"
      }
    ]
  },
  
  // Permohonan (application) data
  permohonanData: {
    activeApplications: [
      { 
        id: "APP-2023-1234", 
        pemohon: "Ahmad bin Hassan",
        noIC: "901122-14-5523",
        alamat: "No. 12, Jalan Maju, 40000 Shah Alam",
        telefon: "019-1234567",
        type: "Bantuan Pendidikan",
        amount: "RM 2,500",
        submissionDate: "12 Mei 2023",
        status: "DALAM PROSES" 
      },
      { 
        id: "APP-2023-2345", 
        pemohon: "Siti Aminah",
        noIC: "891215-14-5123",
        alamat: "No. 45, Jalan Berjaya, 40100 Shah Alam",
        telefon: "012-3456789",
        type: "Bantuan Sara Hidup",
        amount: "RM 1,200",
        submissionDate: "18 Mei 2023",
        status: "DALAM PROSES" 
      },
      { 
        id: "APP-2023-3456", 
        pemohon: "Kamal bin Johari",
        noIC: "850430-14-7851",
        alamat: "No. 78, Jalan Harmoni, 40200 Shah Alam",
        telefon: "017-9876543",
        type: "Bantuan Perniagaan",
        amount: "RM 5,000",
        submissionDate: "25 Mei 2023",
        status: "MENUNGGU" 
      }
    ],
    draftApplications: [
      { 
        id: "DRAFT-2023-5678",
        pemohon: "Zahir bin Omar",
        noIC: "880517-14-5123",
        type: "Bantuan Pendidikan",
        lastUpdated: "15 Mei 2023"
      }
    ],
    historicalApplications: [
      { 
        id: "APP-2022-9012", 
        pemohon: "Farid bin Razali",
        noIC: "790222-14-5123",
        type: "Bantuan Perniagaan",
        amount: "RM 7,500",
        submissionDate: "10 Jan 2023",
        status: "LULUS" 
      },
      { 
        id: "APP-2022-3456", 
        pemohon: "Noraini binti Aziz",
        noIC: "881115-14-5553",
        type: "Bantuan Perubatan",
        amount: "RM 3,200",
        submissionDate: "15 Mar 2023",
        status: "DITOLAK",
        reason: "Dokumen tidak lengkap"
      },
      { 
        id: "APP-2022-7890", 
        pemohon: "Zulkifli bin Hasan",
        noIC: "751020-14-7123",
        type: "Bantuan Pendidikan",
        amount: "RM 1,800",
        submissionDate: "22 Feb 2023",
        status: "LULUS" 
      }
    ],
    applicationTypes: [
      { id: "BSH", name: "Bantuan Sara Hidup" },
      { id: "PEND", name: "Bantuan Pendidikan" },
      { id: "PERU", name: "Bantuan Perubatan" },
      { id: "PERNI", name: "Bantuan Perniagaan" },
      { id: "RURUN", name: "Bantuan Rumah" }
    ]
  },
  
  // Bantuan Saya (My Aid) data
  bantuanData: {
    activeBantuan: [
      {
        id: "BAN-2023-1234",
        type: "Bantuan Sara Hidup",
        amount: "RM 500/bulan",
        startDate: "Jan 2023",
        endDate: "Dis 2023",
        nextPayment: "15 Jun 2023"
      },
      {
        id: "BAN-2023-5678",
        type: "Bantuan Pendidikan Anak",
        amount: "RM 200/bulan",
        startDate: "Feb 2023",
        endDate: "Nov 2023",
        nextPayment: "15 Jun 2023"
      }
    ],
    paymentHistory: [
      { id: "PMT-0012", date: "15 Mei 2023", amount: "RM 700", type: "Bantuan Bulanan", status: "Selesai" },
      { id: "PMT-0011", date: "15 Apr 2023", amount: "RM 700", type: "Bantuan Bulanan", status: "Selesai" },
      { id: "PMT-0010", date: "15 Mac 2023", amount: "RM 700", type: "Bantuan Bulanan", status: "Selesai" }
    ],
    timeline: [
      { step: 'Permohonan Dihantar', date: '10/05/2023', time: '09:30', completed: true },
      { step: 'Verifikasi Dokumen', date: '11/05/2023', time: '14:45', completed: true },
      { step: 'Semakan Pegawai', date: '12/05/2023', time: '11:20', completed: true },
      { step: 'Kelulusan', date: '20/05/2023', time: '10:15', completed: true },
      { step: 'Agihan Bantuan', date: '01/06/2023', time: '09:00', completed: true }
    ]
  },
  
  // Notification data
  notificationData: {
    unread: 3,
    items: [
      { id: 1, title: "Pembayaran Bantuan", content: "Bantuan bulanan sebanyak RM 700 telah dikreditkan ke akaun anda", time: "2 jam lalu", unread: true, type: "success" },
      { id: 2, title: "Dokumen Tambahan Diperlukan", content: "Sila kemukakan salinan surat pengesahan pendapatan untuk permohonan #APP-2023-1234", time: "5 jam lalu", unread: true, type: "warning" },
      { id: 3, title: "Peringatan Temuduga", content: "Temuduga untuk permohonan bantuan akan diadakan pada 18 Jun 2023, 10:00 pagi", time: "1 hari lalu", unread: true, type: "info" },
      { id: 4, title: "Program Asnaf", content: "Program Latihan Kemahiran untuk Asnaf akan bermula pada 20 Jun 2023", time: "2 hari lalu", unread: false, type: "info" },
      { id: 5, title: "Status Permohonan", content: "Permohonan #APP-2022-3456 telah ditolak. Sila semak maklumat lanjut dalam sistem.", time: "3 hari lalu", unread: false, type: "error" }
    ]
  },
  
  // Form data for application
  newApplicationForm: {
    type: "",
    fullName: "",
    idNumber: "",
    phone: "",
    email: "",
    address: "",
    reason: "",
    dependents: 0,
    monthlyIncome: "",
    documents: []
  },
  formErrors: {
    type: false,
    fullName: false,
    idNumber: false,
    phone: false,
    email: false,
    monthlyIncome: false
  },
  
  // Form validation states
  formIsValid: false,
  formSubmitted: false,
  formSubmitting: false,
  
  // Active detail views
  activeApplicationDetail: null,
  activeBantuanDetail: null,
  editApplicationId: null
});

// Animation states
const animationStates = ref({
  menuExpanded: false,
  profileExpanded: false,
  fabExpanded: false,
  pageTransition: false
});

// Toggle functions for demo
const toggleMenu = () => {
  exampleData.value.showMenu = !exampleData.value.showMenu;
  animationStates.value.menuExpanded = exampleData.value.showMenu;
  
  // Add/remove body-locked class to disable scrolling when menu is open
  // Only affect the mobile-content element, not the entire document
  const mobileContent = document.querySelector('.mobile-content');
  if (exampleData.value.showMenu && mobileContent) {
    mobileContent.classList.add('body-locked');
  } else if (mobileContent) {
    mobileContent.classList.remove('body-locked');
  }
};

const toggleProfileDropdown = () => {
  exampleData.value.profileExpanded = !exampleData.value.profileExpanded;
  animationStates.value.profileExpanded = exampleData.value.profileExpanded;
  // Close notifications panel if open
  if (exampleData.value.showNotifications) {
    exampleData.value.showNotifications = false;
  }
};

const toggleNotifications = () => {
  exampleData.value.showNotifications = !exampleData.value.showNotifications;
  // Close profile dropdown if open
  if (exampleData.value.profileExpanded) {
    exampleData.value.profileExpanded = false;
    animationStates.value.profileExpanded = false;
  }
};

const toggleFabMenu = () => {
  exampleData.value.showFabMenu = !exampleData.value.showFabMenu;
  animationStates.value.fabExpanded = exampleData.value.showFabMenu;
};

const toggleLoading = () => {
  exampleData.value.isLoading = true;
  setTimeout(() => {
    exampleData.value.isLoading = false;
  }, 2000);
};

const toggleEmptyState = () => {
  exampleData.value.showEmptyState = !exampleData.value.showEmptyState;
};

const simulateError = (field) => {
  exampleData.value.formErrors[field] = true;
  setTimeout(() => {
    exampleData.value.formErrors[field] = false;
  }, 3000);
};

// Navigate to a different section
const navigateTo = (sectionId, subsection = null) => {
  exampleData.value.previousSection = exampleData.value.currentSection;
  exampleData.value.currentSection = sectionId;
  exampleData.value.subSection = subsection;
  
  // Show back button if navigating to a subsection or if navigating to components section
  exampleData.value.showBackButton = subsection !== null || sectionId === 'components';
  
  // Reset scroll position
  setTimeout(() => {
    const mobileContent = document.querySelector('.mobile-content');
    if (mobileContent) {
      mobileContent.scrollTop = 0;
    }
  }, 10);
  
  // Close any open UI elements
  closeAllOverlays();
};

// Navigate back
const navigateBack = () => {
  if (exampleData.value.subSection) {
    // If in a subsection, go back to main section
    exampleData.value.subSection = null;
    exampleData.value.showBackButton = exampleData.value.currentSection === 'components';
  } else if (exampleData.value.currentSection === 'components') {
    // If on components page, go back to dashboard
    exampleData.value.currentSection = 'dashboard';
    exampleData.value.previousSection = null;
    exampleData.value.showBackButton = false;
  } else if (exampleData.value.previousSection) {
    // If have a previous main section, go back to it
    exampleData.value.currentSection = exampleData.value.previousSection;
    exampleData.value.previousSection = null;
    exampleData.value.showBackButton = false;
  }
  
  // Reset scroll position
  if (document.querySelector('.mobile-content')) {
    document.querySelector('.mobile-content').scrollTop = 0;
  }
  
  // Close any open UI elements
  closeAllOverlays();
};

// Close all overlays
const closeAllOverlays = () => {
  exampleData.value.showMenu = false;
  exampleData.value.profileExpanded = false;
  exampleData.value.showNotifications = false;
  exampleData.value.showFabMenu = false;
  
  // Reset animation states
  animationStates.value.menuExpanded = false;
  animationStates.value.profileExpanded = false;
  animationStates.value.fabExpanded = false;
  
  // Remove body lock only from the mobile content
  const mobileContent = document.querySelector('.mobile-content');
  if (mobileContent) {
    mobileContent.classList.remove('body-locked');
  }
};

// Change tab
const changeTab = (tabId) => {
  exampleData.value.activeTab = tabId;
};

// Create new application draft function
const createNewApplication = (type) => {
  // Navigate to the new application form
  navigateTo('permohonan', 'new');
  
  // Set initial form values
  exampleData.value.newApplicationForm = {
    type: type,
    fullName: exampleData.value.userProfile.name,
    idNumber: exampleData.value.userProfile.id,
    phone: exampleData.value.userProfile.phone,
    email: exampleData.value.userProfile.email,
    address: exampleData.value.userProfile.address,
    reason: "",
    dependents: exampleData.value.userProfile.dependents || 0,
    monthlyIncome: "",
    documents: []
  };
  
  // Close FAB menu
  exampleData.value.showFabMenu = false;
  animationStates.value.fabExpanded = false;
};

// Edit application function
const editApplication = (application) => {
  // Navigate to the edit form
  navigateTo('permohonan', 'edit');
  
  // Set form values from the application
  exampleData.value.newApplicationForm = {
    type: application.type,
    fullName: application.pemohon,
    idNumber: application.noIC,
    phone: application.telefon,
    email: exampleData.value.userProfile.email, // Assuming email is not in the application object
    address: application.alamat,
    reason: "",
    dependents: 0,
    monthlyIncome: application.amount.replace("RM ", ""),
    documents: []
  };
  
  // Store the application ID for update
  exampleData.value.editApplicationId = application.id;
};

// Approve application function
const approveApplication = (application) => {
  // Show confirmation dialog (in a real app)
  if (confirm(`Adakah anda pasti untuk meluluskan permohonan ${application.id}?`)) {
    // Update application status
    const index = exampleData.value.permohonanData.activeApplications.findIndex(app => app.id === application.id);
    if (index !== -1) {
      exampleData.value.permohonanData.activeApplications[index].status = 'LULUS';
      
      // Show success notification
      addNotification({
        title: "Permohonan Diluluskan", 
        content: `Permohonan ${application.id} telah berjaya diluluskan.`,
        type: "success"
      });
    }
  }
};

// Delete application function
const deleteApplication = (application) => {
  // Show confirmation dialog (in a real app)
  if (confirm(`Adakah anda pasti untuk memadamkan permohonan ${application.id}?`)) {
    // Remove application from the list
    const index = exampleData.value.permohonanData.activeApplications.findIndex(app => app.id === application.id);
    if (index !== -1) {
      exampleData.value.permohonanData.activeApplications.splice(index, 1);
      
      // Show success notification
      addNotification({
        title: "Permohonan Dipadam", 
        content: `Permohonan ${application.id} telah berjaya dipadam.`,
        type: "success"
      });
    }
  }
};

// Submit application form
const submitApplicationForm = () => {
  // Validate form first
  validateForm();
  
  if (exampleData.value.formIsValid) {
    exampleData.value.formSubmitting = true;
    
    // Simulate form submission
    setTimeout(() => {
      // Add to draft applications
      exampleData.value.permohonanData.draftApplications.unshift({
        id: `DRAFT-2023-${Math.floor(1000 + Math.random() * 9000)}`,
        type: exampleData.value.newApplicationForm.type,
        lastUpdated: new Date().toLocaleDateString('ms-MY', {day: '2-digit', month: 'short', year: 'numeric'})
      });
      
      exampleData.value.formSubmitting = false;
      exampleData.value.formSubmitted = true;
      
      // Show success notification
      addNotification({
        title: "Draf Permohonan Dibuat", 
        content: `Draf permohonan untuk ${exampleData.value.newApplicationForm.type} telah berjaya dibuat.`,
        type: "success"
      });
      
      // Navigate back to permohonan list after delay
      setTimeout(() => {
        navigateTo('permohonan');
        exampleData.value.formSubmitted = false;
        changeTab('draft');
      }, 1500);
    }, 2000);
  }
};

// View application details
const viewApplicationDetails = (applicationId, tab) => {
  const applications = tab === 'active' 
    ? exampleData.value.permohonanData.activeApplications 
    : tab === 'history' 
      ? exampleData.value.permohonanData.historicalApplications
      : exampleData.value.permohonanData.draftApplications;
      
  const application = applications.find(app => app.id === applicationId);
  
  if (application) {
    exampleData.value.activeApplicationDetail = application;
    navigateTo('permohonan', 'details');
  }
};

// View bantuan details
const viewBantuanDetails = (bantuanId) => {
  const bantuan = exampleData.value.bantuanData.activeBantuan.find(b => b.id === bantuanId);
  
  if (bantuan) {
    exampleData.value.activeBantuanDetail = bantuan;
    navigateTo('bantuan', 'details');
  }
};

// Form validation
const validateForm = () => {
  // Reset errors
  Object.keys(exampleData.value.formErrors).forEach(key => {
    exampleData.value.formErrors[key] = false;
  });
  
  // Check required fields
  let isValid = true;
  
  // Required fields validation
  const requiredFields = ['type', 'fullName', 'idNumber', 'phone', 'email', 'monthlyIncome'];
  requiredFields.forEach(field => {
    if (!exampleData.value.newApplicationForm[field]) {
      exampleData.value.formErrors[field] = true;
      isValid = false;
    }
  });
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (exampleData.value.newApplicationForm.email && !emailRegex.test(exampleData.value.newApplicationForm.email)) {
    exampleData.value.formErrors.email = true;
    isValid = false;
  }
  
  // Phone validation
  const phoneRegex = /^01\d-\d{7,8}$/;
  if (exampleData.value.newApplicationForm.phone && !phoneRegex.test(exampleData.value.newApplicationForm.phone)) {
    exampleData.value.formErrors.phone = true;
    isValid = false;
  }
  
  exampleData.value.formIsValid = isValid;
  return isValid;
};

// For notification actions
const markAsRead = (id) => {
  const notification = exampleData.value.notificationData.items.find(n => n.id === id);
  if (notification && notification.unread) {
    notification.unread = false;
    exampleData.value.notificationData.unread -= 1;
  }
};

const markAllAsRead = () => {
  exampleData.value.notificationData.items.forEach(notification => {
    notification.unread = false;
  });
  exampleData.value.notificationData.unread = 0;
};

const deleteNotification = (id) => {
  const index = exampleData.value.notificationData.items.findIndex(n => n.id === id);
  if (index !== -1) {
    const isUnread = exampleData.value.notificationData.items[index].unread;
    if (isUnread) {
      exampleData.value.notificationData.unread -= 1;
    }
    exampleData.value.notificationData.items.splice(index, 1);
  }
};

// Add new notification
const addNotification = (notification) => {
  const newNotification = {
    id: exampleData.value.notificationData.items.length + 1,
    title: notification.title,
    content: notification.content,
    time: "Baru sahaja",
    unread: true,
    type: notification.type || "info"
  };
  
  exampleData.value.notificationData.items.unshift(newNotification);
  exampleData.value.notificationData.unread += 1;
};

// Set page title based on current section
const updatePageTitle = () => {
  const currentSection = exampleData.value.currentSection;
  const page = exampleData.value.demoPages.find(p => p.id === currentSection);
  
  if (exampleData.value.subSection) {
    switch (exampleData.value.subSection) {
      case 'new':
        exampleData.value.headerTitle = 'Permohonan Baru';
        break;
      case 'details':
        exampleData.value.headerTitle = 'Butiran';
        break;
      default:
        exampleData.value.headerTitle = page?.title || 'Portal Asnaf';
    }
  } else {
    exampleData.value.headerTitle = page?.title || 'Portal Asnaf';
  }
};

// Watch for section changes
watch(() => [exampleData.value.currentSection, exampleData.value.subSection], () => {
  updatePageTitle();
  
  // Implement page transition animation
  animationStates.value.pageTransition = true;
  setTimeout(() => {
    animationStates.value.pageTransition = false;
  }, 300);
});

// Initialize page title
onMounted(() => {
  updatePageTitle();
});

// Profile Section
const viewProfile = () => {
  navigateTo('profile');
  exampleData.value.profileExpanded = false;
};

// Mobile Components Showcase
const viewMobileComponents = () => {
  navigateTo('components');
};

// For notification actions
const handleNotificationAction = (notification) => {
  // Navigate to appropriate section based on notification
  if (notification.action === 'view_bantuan') {
    navigateTo('bantuan', 'details');
    if (notification.bantuanId) {
      viewBantuanDetails(notification.bantuanId);
    }
  } else if (notification.action === 'view_permohonan') {
    navigateTo('permohonan', 'details');
    if (notification.permohonanId) {
      viewApplicationDetails(notification.permohonanId, 'active');
    }
  } else if (notification.action === 'rsvp_program') {
    // Show RSVP confirmation dialog - simplified for demo
    alert('Anda telah mendaftar untuk program ini.');
    markAsRead(notification.id);
  }
};

// Update Bantuan Data with more comprehensive info
exampleData.value.bantuanData = {
  activeBantuan: [
    {
      id: "BAN-2023-1234",
      type: "Bantuan Sara Hidup",
      category: "Fakir",
      amount: "RM 500/bulan",
      startDate: "Jan 2023",
      endDate: "Dis 2023",
      nextPayment: "15 Jun 2023",
      referenceNo: "BSH-23/1234",
      status: "AKTIF",
      details: {
        approvedBy: "Pegawai Zakat Daerah Shah Alam",
        approvalDate: "15 Dis 2022",
        disbursementMethod: "Akaun Bank",
        bankName: "Bank Islam",
        accountNo: "xxxx-xxx-xxxxx",
        totalAmountApproved: "RM 6,000 (RM 500 × 12 bulan)",
        totalDisbursed: "RM 2,500 (5 bulan)",
        remainingAmount: "RM 3,500 (7 bulan)"
      }
    },
    {
      id: "BAN-2023-5678",
      type: "Bantuan Pendidikan Anak",
      category: "Miskin",
      amount: "RM 200/bulan",
      startDate: "Feb 2023",
      endDate: "Nov 2023",
      nextPayment: "15 Jun 2023",
      referenceNo: "BPA-23/5678",
      status: "AKTIF",
      details: {
        approvedBy: "Pegawai Zakat Daerah Shah Alam",
        approvalDate: "20 Jan 2023",
        disbursementMethod: "Akaun Bank",
        bankName: "Bank Islam",
        accountNo: "xxxx-xxx-xxxxx",
        totalAmountApproved: "RM 2,000 (RM 200 × 10 bulan)",
        totalDisbursed: "RM 800 (4 bulan)",
        remainingAmount: "RM 1,200 (6 bulan)",
        children: [
          { name: "Ahmad bin Muhammad", age: 12, school: "SK Taman Sri Muda", level: "Darjah 6" },
          { name: "Nur Aisyah binti Muhammad", age: 15, school: "SMK Taman Sri Muda", level: "Tingkatan 3" }
        ]
      }
    },
    {
      id: "BAN-2023-9012",
      type: "Bantuan Perubatan",
      category: "Fakir",
      amount: "RM 350/bulan",
      startDate: "Apr 2023",
      endDate: "Apr 2024",
      nextPayment: "15 Jun 2023",
      referenceNo: "BPR-23/9012",
      status: "AKTIF",
      details: {
        approvedBy: "Pegawai Zakat Daerah Shah Alam",
        approvalDate: "25 Mar 2023",
        disbursementMethod: "Akaun Bank",
        bankName: "Bank Islam",
        accountNo: "xxxx-xxx-xxxxx",
        totalAmountApproved: "RM 4,200 (RM 350 × 12 bulan)",
        totalDisbursed: "RM 700 (2 bulan)",
        remainingAmount: "RM 3,500 (10 bulan)",
        medicalCondition: "Diabetes & Tekanan Darah Tinggi",
        medicalFacility: "Klinik Kesihatan Seksyen 7"
      }
    }
  ],
  paymentHistory: [
    { id: "PMT-0012", date: "15 Mei 2023", amount: "RM 700", type: "Bantuan Bulanan", status: "Selesai", details: "Bantuan Sara Hidup (RM 500) & Pendidikan (RM 200)" },
    { id: "PMT-0011", date: "15 Apr 2023", amount: "RM 1,050", type: "Bantuan Bulanan", status: "Selesai", details: "Bantuan Sara Hidup (RM 500), Pendidikan (RM 200) & Perubatan (RM 350)" },
    { id: "PMT-0010", date: "15 Mac 2023", amount: "RM 700", type: "Bantuan Bulanan", status: "Selesai", details: "Bantuan Sara Hidup (RM 500) & Pendidikan (RM 200)" },
    { id: "PMT-0009", date: "15 Feb 2023", amount: "RM 700", type: "Bantuan Bulanan", status: "Selesai", details: "Bantuan Sara Hidup (RM 500) & Pendidikan (RM 200)" },
    { id: "PMT-0008", date: "15 Jan 2023", amount: "RM 500", type: "Bantuan Bulanan", status: "Selesai", details: "Bantuan Sara Hidup (RM 500)" }
  ],
  timeline: [
    { step: 'Permohonan Dihantar', date: '10/05/2023', time: '09:30', completed: true },
    { step: 'Verifikasi Dokumen', date: '11/05/2023', time: '14:45', completed: true },
    { step: 'Semakan Pegawai', date: '12/05/2023', time: '11:20', completed: true },
    { step: 'Kelulusan', date: '20/05/2023', time: '10:15', completed: true },
    { step: 'Agihan Bantuan', date: '01/06/2023', time: '09:00', completed: true }
  ],
  bantuanCategories: [
    { id: "BSH", name: "Bantuan Sara Hidup", description: "Bantuan kewangan bulanan untuk memenuhi keperluan asas", eligibility: "Asnaf fakir, miskin" },
    { id: "BPD", name: "Bantuan Pendidikan", description: "Bantuan untuk yuran dan keperluan sekolah", eligibility: "Asnaf fakir, miskin dengan anak bersekolah" },
    { id: "BPR", name: "Bantuan Perubatan", description: "Bantuan untuk rawatan dan ubat-ubatan", eligibility: "Asnaf fakir, miskin yang sakit kronik" },
    { id: "BPK", name: "Bantuan Perniagaan Kecil", description: "Modal untuk memulakan perniagaan kecil", eligibility: "Asnaf fakir, miskin yang berkelayakan" },
    { id: "BRM", name: "Bantuan Rumah", description: "Bantuan untuk sewaan atau baik pulih rumah", eligibility: "Asnaf fakir, miskin tanpa rumah tetap" }
  ],
  nearbyFacilities: [
    { name: "Pejabat Zakat Daerah Shah Alam", type: "Pejabat Zakat", distance: "2.5 KM", address: "Kompleks PKNS, Seksyen 14, 40000 Shah Alam", phone: "03-1234 5678" },
    { name: "Pusat Agihan Zakat Seksyen 7", type: "Pusat Agihan", distance: "1.8 KM", address: "Jalan Plumbum 7/101B, Seksyen 7, 40000 Shah Alam", phone: "03-2345 6789" },
    { name: "Klinik Kesihatan Seksyen 7", type: "Klinik Kesihatan", distance: "2.0 KM", address: "Jalan Plumbum 7/102, Seksyen 7, 40000 Shah Alam", phone: "03-3456 7890" }
  ],
  notifications: [
    { 
      id: 1, 
      title: "Pengagihan Bantuan Jun 2023", 
      content: "Bantuan bulanan anda berjumlah RM 700 akan dikreditkan pada 15 Jun 2023.", 
      date: "08/06/2023"
    },
    { 
      id: 2, 
      title: "Peringatan Kemaskini Maklumat", 
      content: "Sila kemaskini maklumat akaun bank anda sebelum 30 Jun 2023.", 
      date: "05/06/2023"
    }
  ],
  bantuanForm: {
    type: "",
    fullName: "",
    idNumber: "",
    category: "",
    address: "",
    phone: "",
    email: "",
    bankName: "",
    accountNumber: "",
    reason: "",
    documents: []
  }
};

// Add some example notification data with actions
exampleData.value.notificationData.items = [
  { 
    id: 1, 
    title: "Pembayaran Bantuan", 
    content: "Bantuan bulanan sebanyak RM 700 telah dikreditkan ke akaun anda", 
    time: "2 jam lalu", 
    unread: true, 
    type: "success",
    action: "view_bantuan",
    actionText: "Lihat Detail"
  },
  { 
    id: 2, 
    title: "Dokumen Tambahan Diperlukan", 
    content: "Sila kemukakan salinan surat pengesahan pendapatan untuk permohonan #APP-2023-1234", 
    time: "5 jam lalu", 
    unread: true, 
    type: "warning",
    action: "view_permohonan",
    permohonanId: "APP-2023-1234",
    actionText: "Kemaskini"
  },
  { 
    id: 3, 
    title: "Program Kemahiran Digital", 
    content: "Tempat masih dibuka untuk Program Kemahiran Digital pada 25 Jun 2023, 10:00 pagi", 
    time: "1 hari lalu", 
    unread: true, 
    type: "info",
    action: "rsvp_program",
    actionText: "Daftar"
  },
  { 
    id: 4, 
    title: "Program Asnaf", 
    content: "Program Latihan Kemahiran untuk Asnaf akan bermula pada 20 Jun 2023", 
    time: "2 hari lalu", 
    unread: false, 
    type: "info" 
  },
  { 
    id: 5, 
    title: "Status Permohonan", 
    content: "Permohonan #APP-2022-3456 telah ditolak. Sila semak maklumat lanjut dalam sistem.", 
    time: "3 hari lalu", 
    unread: false, 
    type: "error" 
  }
];

// ... more existing code ...

// New methods for Bantuan page
const editBantuan = (bantuan) => {
  // Navigate to edit form
  exampleData.value.bantuanForm = {
    type: bantuan.type,
    fullName: exampleData.value.userProfile.name,
    idNumber: exampleData.value.userProfile.id,
    category: bantuan.category,
    address: exampleData.value.userProfile.address,
    phone: exampleData.value.userProfile.phone,
    email: exampleData.value.userProfile.email,
    bankName: bantuan.details.bankName,
    accountNumber: bantuan.details.accountNo,
    reason: "Kemaskini maklumat akaun bank",
    documents: []
  };
  
  navigateTo('bantuan', 'edit');
};

const createNewBantuan = (type) => {
  // Reset form and navigate to new form
  exampleData.value.bantuanForm = {
    type: type || "",
    fullName: exampleData.value.userProfile.name,
    idNumber: exampleData.value.userProfile.id,
    category: "",
    address: exampleData.value.userProfile.address,
    phone: exampleData.value.userProfile.phone,
    email: exampleData.value.userProfile.email,
    bankName: "",
    accountNumber: "",
    reason: "",
    documents: []
  };
  
  // Reset form errors
  exampleData.value.formErrors = {
    type: false,
    fullName: false,
    idNumber: false,
    phone: false,
    email: false,
    address: false,
    bankName: false,
    accountNumber: false,
    category: false,
    reason: false,
    monthlyIncome: false
  };
  
  navigateTo('bantuan', 'new');
};

const submitBantuanForm = () => {
  // Validate form first
  validateBantuanForm();
  
  if (exampleData.value.formIsValid) {
    // Simulate form submission
    exampleData.value.formSubmitting = true;
    
    setTimeout(() => {
      exampleData.value.formSubmitting = false;
      exampleData.value.formSubmitted = true;
      
      // Add notification
      addNotification({
        title: "Permohonan Dihantar", 
        content: `Permohonan bantuan ${exampleData.value.bantuanForm.type || "Bantuan Sara Hidup"} telah berjaya dihantar.`,
        type: "success"
      });
      
      // Navigate to success page
      navigateTo('bantuan', 'success');
    }, 2000);
  }
};

// Validate Bantuan Form
const validateBantuanForm = () => {
  // Reset errors
  Object.keys(exampleData.value.formErrors).forEach(key => {
    exampleData.value.formErrors[key] = false;
  });
  
  // Check required fields
  let isValid = true;
  
  // Required fields for personal info
  if (exampleData.value.currentSection === 'bantuan' && exampleData.value.subSection === 'new') {
    const requiredFields = ['type', 'fullName', 'idNumber', 'phone', 'address', 'category'];
    requiredFields.forEach(field => {
      if (!exampleData.value.bantuanForm[field]) {
        exampleData.value.formErrors[field] = true;
        isValid = false;
      }
    });
    
    // Email validation if provided
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (exampleData.value.bantuanForm.email && !emailRegex.test(exampleData.value.bantuanForm.email)) {
      exampleData.value.formErrors.email = true;
      isValid = false;
    }
    
    // Phone validation
    const phoneRegex = /^01\d-\d{7,8}$/;
    if (exampleData.value.bantuanForm.phone && !phoneRegex.test(exampleData.value.bantuanForm.phone)) {
      exampleData.value.formErrors.phone = true;
      isValid = false;
    }
  }
  
  // Required fields for bank info in the review step
  if (exampleData.value.currentSection === 'bantuan' && exampleData.value.subSection === 'review') {
    const requiredBankFields = ['bankName', 'accountNumber'];
    requiredBankFields.forEach(field => {
      if (!exampleData.value.bantuanForm[field]) {
        exampleData.value.formErrors[field] = true;
        isValid = false;
      }
    });
    
    // Bank account number validation
    if (exampleData.value.bantuanForm.accountNumber && exampleData.value.bantuanForm.accountNumber.length < 8) {
      exampleData.value.formErrors.accountNumber = true;
      isValid = false;
    }
    
    // Reason is required
    if (!exampleData.value.bantuanForm.reason) {
      exampleData.value.formErrors.reason = true;
      isValid = false;
    }
  }
  
  exampleData.value.formIsValid = isValid;
  return isValid;
};

// ... existing code ...

// Set theme to LZS theme on component mount
onMounted(() => {
  document.documentElement.setAttribute("data-theme", "LZS");
});
</script>

<template>
  <div>
    <div class="wrapper">
      <div class="phone-container">
        <!-- Phone Frame -->
        <div class="mobile-frame">
          <!-- Status Bar -->
          <div class="h-5 bg-black flex items-center justify-between px-5">
            <span class="text-white text-xs">12:45</span>
            <div class="flex space-x-1">
              <Icon name="ic:baseline-signal-cellular-alt" class="text-white" size="14" />
              <Icon name="ic:baseline-wifi" class="text-white" size="14" />
              <Icon name="ic:baseline-battery-full" class="text-white" size="14" />
            </div>
          </div>
          
          <!-- Mobile App -->
          <div class="mobile-content overflow-hidden">
            <!-- Mobile Header -->
            <div class="mobile-header bg-primary shadow-md">
              <div class="flex items-center justify-between px-4 py-3">
                <div class="flex items-center">
                  <button @click="toggleMenu" class="mr-3 text-header-text">
                    <Icon name="ic:baseline-menu" size="24" />
                  </button>
                  <h1 class="text-header-text font-medium">{{ exampleData.headerTitle }}</h1>
                </div>
                <div class="flex items-center space-x-4">
                  <button @click="toggleNotifications" class="relative text-header-text">
                    <Icon name="ic:baseline-notifications" size="24" />
                    <span 
                      v-if="exampleData.notificationData.unread > 0" 
                      class="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full text-primary text-[8px] font-bold flex items-center justify-center"
                    >
                      {{ exampleData.notificationData.unread }}
                    </span>
                  </button>
                  <button @click="toggleProfileDropdown" class="text-header-text w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold">
                      {{ exampleData.userProfile.avatar }}
                  </button>
                </div>
              </div>
              
              <!-- Notifications Panel -->
              <div 
                v-if="exampleData.showNotifications" 
                class="absolute top-12 right-0 w-full max-w-xs bg-white z-20 rounded-b-lg shadow-lg transition-all border border-t-0 border-gray-100 overflow-hidden"
              >
                <div class="p-3 border-b border-gray-100 flex justify-between items-center">
                  <h2 class="text-sm font-medium">Notifikasi <span class="text-xs ml-1">({{ exampleData.notificationData.unread }} baru)</span></h2>
                  <button class="text-xs text-primary">Tandakan semua dibaca</button>
                    </div>
                <div class="max-h-[400px] overflow-y-auto">
                  <div 
                    v-for="notification in exampleData.notificationData.items" 
                    :key="notification.id"
                    class="p-3 border-b border-gray-100 last:border-0 relative hover:bg-gray-50"
                    :class="{ 'bg-blue-50/30': notification.unread }"
                  >
                    <div class="flex">
                      <div class="flex-shrink-0 mr-3">
                        <div class="w-8 h-8 rounded-full flex items-center justify-center" 
                          :class="{
                            'bg-green-100 text-green-600': notification.type === 'success',
                            'bg-yellow-100 text-yellow-600': notification.type === 'warning',
                            'bg-blue-100 text-blue-600': notification.type === 'info',
                            'bg-red-100 text-red-600': notification.type === 'error',
                          }"
                        >
                          <Icon 
                            :name="{
                              'success': 'ic:baseline-check-circle',
                              'warning': 'ic:baseline-warning',
                              'info': 'ic:baseline-info',
                              'error': 'ic:baseline-error',
                            }[notification.type]" 
                            size="16" 
                          />
                        </div>
                      </div>
                      <div>
                        <div class="flex items-start">
                          <p class="font-medium text-sm">{{ notification.title }}</p>
                          <span v-if="notification.unread" class="ml-2 w-2 h-2 rounded-full bg-primary"></span>
                        </div>
                        <p class="text-xs text-gray-600 my-1">{{ notification.content }}</p>
                        <p class="text-xs text-gray-400">{{ notification.time }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                <div class="p-2 border-t border-gray-100 text-center">
                  <button class="text-sm text-primary font-medium">Lihat Semua Notifikasi</button>
                </div>
              </div>
            
              <!-- Profile Dropdown -->
              <div 
                v-if="exampleData.profileExpanded" 
                class="absolute top-12 right-0 w-full max-w-xs bg-white z-20 rounded-b-lg shadow-lg transition-all border border-t-0 border-gray-100 overflow-hidden"
                :class="{ 'expanded': animationStates.profileExpanded }"
              >
                <div class="p-4 border-b border-gray-100">
                  <div class="flex items-center space-x-3 mb-3">
                    <div class="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xl">
                      {{ exampleData.userProfile.avatar }}
                  </div>
                    <div class="flex-1">
                      <h3 class="font-medium">{{ exampleData.userProfile.name }}</h3>
                      <p class="text-xs text-gray-500">{{ exampleData.userProfile.email }}</p>
                    </div>
                  </div>
                  
                  <!-- Profile Details (enhanced) -->
                  <div class="border border-gray-100 rounded-lg p-3 bg-gray-50 mb-3">
                    <div class="text-xs">
                      <div class="flex items-center mb-2">
                        <Icon name="ic:baseline-badge" size="14" class="text-primary mr-2" />
                        <span class="text-gray-600">No. ID:</span>
                        <span class="ml-1 font-medium">{{ exampleData.userProfile.id }}</span>
                        </div>
                      <div class="flex items-center mb-2">
                        <Icon name="ic:baseline-phone" size="14" class="text-primary mr-2" />
                        <span class="text-gray-600">Telefon:</span>
                        <span class="ml-1 font-medium">{{ exampleData.userProfile.phone }}</span>
                        </div>
                      <div class="flex items-start mb-2">
                        <Icon name="ic:baseline-home" size="14" class="text-primary mr-2 mt-0.5" />
                          <div>
                          <span class="text-gray-600">Alamat:</span>
                          <div class="font-medium">{{ exampleData.userProfile.address }}</div>
                          </div>
                        </div>
                      <div class="flex items-center">
                        <Icon name="ic:baseline-category" size="14" class="text-primary mr-2" />
                        <span class="text-gray-600">Status:</span>
                        <span class="ml-1 font-medium">{{ exampleData.userProfile.department }}</span>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Asnaf Status Badge (new) -->
                  <div class="mb-3 py-2 px-3 bg-secondary/10 rounded-lg border border-secondary/20 flex items-center">
                    <Icon name="ic:baseline-verified-user" class="text-secondary mr-2" size="18" />
                            <div>
                      <p class="text-xs font-medium text-gray-700">Status Asnaf:</p>
                      <p class="text-sm font-medium text-secondary">{{ exampleData.userProfile.department }} <span class="text-xs">(sejak {{ exampleData.userProfile.joinDate }})</span></p>
                            </div>
                          </div>
                          </div>
                <div class="divide-y divide-gray-100">
                  <button 
                    v-for="action in exampleData.userProfile.actions" 
                    :key="action.name"
                    class="flex items-center w-full p-3 hover:bg-gray-50 transition-colors"
                  >
                    <Icon :name="action.icon" size="18" class="text-gray-500 mr-3" />
                    <span class="text-sm">{{ action.name }}</span>
                          </button>
                  <button class="flex items-center w-full p-3 hover:bg-gray-50 transition-colors text-red-600">
                    <Icon name="ic:baseline-logout" size="18" class="mr-3" />
                    <span class="text-sm">Log Keluar</span>
                          </button>
                      </div>
                    </div>
                  </div>
                  
            <!-- Mobile Content -->
            <div class="relative min-h-[calc(100%-56px)]">
              <transition name="fade">
                <div :key="exampleData.currentSection" class="content-wrapper">
                  <!-- Dashboard Section - Enhanced with LZS theming -->
                  <div v-if="exampleData.currentSection === 'dashboard'" class="p-4 pb-24">
                    <!-- Asnaf Profile Summary Card - Modernized -->
                    <div class="mb-4 bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                      <div class="bg-primary/5 p-4 border-b border-gray-100">
                        <div class="flex items-center">
                          <div class="w-14 h-14 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xl shadow-sm border border-primary/20">
                            {{ exampleData.userProfile.avatar }}
                        </div>
                          <div class="ml-3">
                            <h3 class="font-medium text-gray-800">{{ exampleData.userProfile.name }}</h3>
                            <div class="flex items-center mt-1">
                              <span class="text-xs bg-secondary/15 text-secondary py-1 px-2 rounded-full font-medium border border-secondary/20">
                                {{ exampleData.userProfile.department }}
                              </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                      <!-- Bantuan Summary -->
                      <div class="p-4">
                        <div class="grid grid-cols-2 gap-4 mb-4">
                          <div class="rounded-lg bg-primary/5 p-3 border border-primary/10">
                            <p class="text-xs text-gray-600 mb-1">Jumlah Bantuan</p>
                            <p class="text-lg font-semibold text-primary">{{ exampleData.dashboardData.totalBantuan }}</p>
                      </div>
                          <div class="rounded-lg bg-secondary/5 p-3 border border-secondary/10">
                            <p class="text-xs text-gray-600 mb-1">Bantuan Bulan Ini</p>
                            <p class="text-lg font-semibold text-secondary">{{ exampleData.dashboardData.bantuanBulan }}</p>
                    </div>
                  </div>
                  
                        <div class="flex items-center justify-between p-3 rounded-lg bg-accent/5 border border-accent/10 mb-4">
                          <div>
                            <p class="text-xs text-gray-600 mb-1">Pembayaran Seterusnya</p>
                            <p class="font-medium">{{ exampleData.dashboardData.nextPayment }}</p>
                    </div>
                          <Icon name="ic:baseline-calendar-today" class="text-accent" size="20" />
                  </div>
                  
                        <button class="w-full py-2.5 px-4 bg-primary text-white font-medium rounded-lg shadow-sm hover:bg-primary-dark transition flex items-center justify-center">
                          <Icon name="ic:baseline-receipt-long" class="mr-2" size="18" />
                          Lihat Semua Bantuan
                        </button>
                      </div>
                    </div>
                    
                    <!-- Dashboard Metrics Cards - Enhanced with LZS theming -->
                    <h3 class="text-base font-medium mb-3 text-gray-800">Metrik Zakat</h3>
                    
                    <div class="grid grid-cols-2 gap-3 mb-6">
                      <div v-for="(metric, index) in exampleData.keyMetrics" :key="index" 
                        class="bg-white rounded-xl p-3 shadow-sm border border-gray-100 flex flex-col justify-between">
                        <div class="flex justify-between items-start mb-2">
                          <div class="w-9 h-9 rounded-md flex items-center justify-center"
                        :class="{
                              'bg-secondary/15 text-secondary': index === 1 || index === 2,
                              'bg-primary/15 text-primary': index === 0 || index === 3
                            }">
                            <Icon :name="metric.icon" size="20" />
                          </div>
                          <div class="text-xs px-1.5 py-0.5 rounded font-medium"
                            :class="{
                              'bg-secondary/15 text-secondary': metric.change === 'positive',
                              'bg-gray-100 text-gray-600': metric.change === 'neutral',
                              'bg-danger/15 text-danger': metric.change === 'negative'
                            }">
                            {{ metric.description }}
                          </div>
                        </div>
                        
                        <div>
                          <p class="text-sm text-gray-600 mb-1">{{ metric.title }}</p>
                          <p class="text-base font-bold" 
                            :class="{
                              'text-secondary': index === 1 || index === 2,
                              'text-primary': index === 0 || index === 3
                            }">
                            {{ metric.value }}
                          </p>
                      </div>
                    </div>
                  </div>

                    <!-- Announcements - Enhanced -->
                    <h3 class="text-base font-medium mb-3 text-gray-800">Pengumuman</h3>
                    
                    <div class="space-y-3 mb-6">
                      <div v-for="announcement in exampleData.dashboardData.announcements" :key="announcement.id"
                        class="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
                        <div class="h-32 bg-gray-200">
                          <!-- We would use actual images here -->
                          <div class="h-full w-full flex items-center justify-center bg-primary/10 text-primary">
                            <Icon name="ic:baseline-image" size="36" />
                      </div>
                        </div>
                        <div class="p-3">
                          <p class="font-medium mb-1.5">{{ announcement.title }}</p>
                          <p class="text-sm text-gray-600 mb-2">{{ announcement.content }}</p>
                          <div class="flex justify-between items-center">
                            <span class="text-xs text-gray-500">{{ announcement.date }}</span>
                            <button class="text-primary text-sm font-medium">Baca Lagi</button>
                          </div>
                      </div>
                    </div>
                  </div>
                  
                    <!-- Upcoming Events - Enhanced -->
                    <h3 class="text-base font-medium mb-3 text-gray-800">Acara Akan Datang</h3>
                    
                    <div class="space-y-3 mb-6">
                      <div v-for="event in exampleData.dashboardData.upcomingEvents" :key="event.id"
                        class="bg-white rounded-xl p-3.5 shadow-sm border border-gray-100 flex items-start">
                        <div class="w-12 h-12 rounded-lg bg-primary/10 flex flex-col items-center justify-center mr-3 border border-primary/20">
                          <span class="text-xs font-medium text-gray-600">{{ event.date.split(' ')[1] }}</span>
                          <span class="text-base font-bold text-primary">{{ event.date.split(' ')[0] }}</span>
                        </div>
                        <div class="flex-1">
                          <p class="font-medium mb-1">{{ event.title }}</p>
                          <div class="flex items-center text-xs text-gray-500 mb-1">
                            <Icon name="ic:baseline-access-time" size="14" class="mr-1" />
                            <span>{{ event.time }}</span>
                        </div>
                          <div class="flex items-center text-xs text-gray-500">
                            <Icon name="ic:baseline-location-on" size="14" class="mr-1" />
                            <span>{{ event.location }}</span>
                        </div>
                        </div>
                        <button class="ml-2 w-7 h-7 rounded-full flex items-center justify-center bg-primary/10 text-primary">
                          <Icon name="ic:baseline-arrow-forward" size="16" />
                        </button>
                      </div>
                      </div>
                    </div>
                    
                  <!-- Permohonan (Applications) Section - Enhanced with LZS theming -->
                  <div v-if="exampleData.currentSection === 'permohonan' && !exampleData.subSection" class="p-4 pb-24">
                    <!-- Tabs - Enhanced -->
                    <div class="flex mb-4 bg-gray-100 p-1 rounded-lg">
                        <button 
                        v-for="tab in exampleData.permohonanTabs" 
                        :key="tab.id"
                        @click="changeTab(tab.id)"
                        class="flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200"
                        :class="exampleData.activeTab === tab.id ? 'bg-white text-primary shadow-sm' : 'text-gray-600'"
                      >
                        {{ tab.title }}
                        </button>
                    </div>
                    
                    <!-- Active Applications Tab -->
                    <div v-if="exampleData.activeTab === 'active'" class="space-y-4">
                      <div 
                        v-for="app in exampleData.permohonanData.activeApplications" 
                        :key="app.id"
                        class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                      >
                        <div class="border-b border-gray-100 p-3 flex justify-between items-center">
                          <div>
                            <h4 class="font-medium">{{ app.id }}</h4>
                            <p class="text-xs text-gray-600">{{ app.submissionDate }}</p>
                  </div>
                          <div class="py-1 px-2.5 rounded-full text-xs font-medium"
                            :class="{
                              'badge-lulus': app.status === 'LULUS',
                              'badge-menunggu': app.status === 'MENUNGGU',
                              'badge-dalam-proses': app.status === 'DALAM PROSES',
                              'badge-ditolak': app.status === 'DITOLAK'
                            }">
                            {{ app.status }}
                        </div>
                      </div>
                        <div class="p-3">
                          <div class="mb-3">
                            <h3 class="font-medium text-gray-800">{{ app.type }}</h3>
                            <p class="text-sm text-gray-600">{{ app.amount }}</p>
                    </div>
                    
                          <div class="space-y-2 mb-3">
                            <div class="flex text-sm">
                              <div class="w-24 text-gray-500">Pemohon</div>
                              <div class="font-medium">{{ app.pemohon }}</div>
                          </div>
                            <div class="flex text-sm">
                              <div class="w-24 text-gray-500">No. IC</div>
                              <div class="font-medium">{{ app.noIC }}</div>
                          </div>
                            <div class="flex text-sm">
                              <div class="w-24 text-gray-500">Telefon</div>
                              <div class="font-medium">{{ app.telefon }}</div>
                      </div>
                    </div>
                    
                          <div class="flex justify-end space-x-2">
                            <button class="p-2 rounded-full bg-primary/10 text-primary">
                              <Icon name="ic:baseline-edit" size="18" />
                      </button>
                            <button class="p-2 rounded-full bg-secondary/10 text-secondary" @click="viewApplicationDetails(app.id, 'active')">
                              <Icon name="ic:baseline-visibility" size="18" />
                      </button>
                            <button class="p-2 rounded-full bg-danger/10 text-danger">
                              <Icon name="ic:baseline-delete" size="18" />
                      </button>
                    </div>
                  </div>
                </div>
                
                      <!-- Empty state for active applications -->
                      <div v-if="exampleData.permohonanData.activeApplications.length === 0" class="text-center py-10">
                        <div class="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-3">
                          <Icon name="ic:baseline-article" size="28" class="text-gray-400" />
                          </div>
                        <h3 class="font-medium text-gray-700 mb-1">Tiada Permohonan Aktif</h3>
                        <p class="text-sm text-gray-500 mb-4">Anda tidak mempunyai sebarang permohonan aktif buat masa ini.</p>
                        <button class="px-4 py-2 bg-primary text-white rounded-lg font-medium shadow-sm">
                          Buat Permohonan Baru
                        </button>
                          </div>
                          </div>
                    
                    <!-- Draft Applications Tab -->
                    <div v-if="exampleData.activeTab === 'draft'" class="space-y-4">
                      <div 
                        v-for="app in exampleData.permohonanData.draftApplications" 
                        :key="app.id"
                        class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                      >
                        <div class="border-b border-gray-100 p-3 flex justify-between items-center">
                          <div>
                            <h4 class="font-medium">{{ app.id }}</h4>
                            <p class="text-xs text-gray-600">Dikemaskini: {{ app.lastUpdated }}</p>
                          </div>
                          <div class="badge-deraf px-2.5 py-1 rounded-full text-xs font-medium">
                            DRAF
                  </div>
                </div>
                
                        <div class="p-3">
                          <h3 class="font-medium text-gray-800 mb-3">{{ app.type }}</h3>
                      
                          <div class="flex justify-end space-x-2">
                            <button class="px-3 py-1.5 rounded-md bg-primary text-white text-sm font-medium shadow-sm">
                              Teruskan
                        </button>
                            <button class="px-3 py-1.5 rounded-md bg-danger/10 text-danger text-sm font-medium">
                              Padam
                        </button>
                      </div>
                  </div>
                </div>
                
                      <!-- Empty state for draft applications -->
                      <div v-if="exampleData.permohonanData.draftApplications.length === 0" class="text-center py-10">
                        <div class="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-3">
                          <Icon name="ic:baseline-draft" size="28" class="text-gray-400" />
                        </div>
                        <h3 class="font-medium text-gray-700 mb-1">Tiada Draf</h3>
                        <p class="text-sm text-gray-500 mb-4">Anda tidak mempunyai sebarang draf permohonan buat masa ini.</p>
                        </div>
                        </div>
                        
                    <!-- History Applications Tab -->
                    <div v-if="exampleData.activeTab === 'history'" class="space-y-4">
                      <div 
                        v-for="app in exampleData.permohonanData.historicalApplications" 
                        :key="app.id"
                        class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                      >
                        <div class="border-b border-gray-100 p-3 flex justify-between items-center">
                        <div>
                            <h4 class="font-medium">{{ app.id }}</h4>
                            <p class="text-xs text-gray-600">{{ app.submissionDate }}</p>
                        </div>
                          <div class="py-1 px-2.5 rounded-full text-xs font-medium"
                            :class="{
                              'badge-lulus': app.status === 'LULUS',
                              'badge-menunggu': app.status === 'MENUNGGU',
                              'badge-dalam-proses': app.status === 'DALAM PROSES',
                              'badge-ditolak': app.status === 'DITOLAK'
                            }">
                            {{ app.status }}
                          </div>
                        </div>
                        
                        <div class="p-3">
                          <div class="mb-3">
                            <h3 class="font-medium text-gray-800">{{ app.type }}</h3>
                            <p class="text-sm text-gray-600">{{ app.amount }}</p>
                </div>
                
                          <div v-if="app.reason" class="p-2 bg-danger/5 rounded-md mb-3 border border-danger/10">
                            <p class="text-sm text-danger">{{ app.reason }}</p>
                      </div>
                      
                          <div class="flex justify-end">
                            <button class="px-3 py-1.5 rounded-md bg-primary/10 text-primary text-sm font-medium">
                              Lihat Butiran
                            </button>
                    </div>
                  </div>
                </div>
                
                      <!-- Empty state for history applications -->
                      <div v-if="exampleData.permohonanData.historicalApplications.length === 0" class="text-center py-10">
                        <div class="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-3">
                          <Icon name="ic:baseline-history" size="28" class="text-gray-400" />
                      </div>
                        <h3 class="font-medium text-gray-700 mb-1">Tiada Sejarah</h3>
                        <p class="text-sm text-gray-500">Anda belum mempunyai sebarang sejarah permohonan.</p>
                        </div>
                        </div>
                      </div>
                      
                  <!-- Bantuan (Aid) Section - Enhanced with LZS theming -->
                  <div v-if="exampleData.currentSection === 'bantuan' && !exampleData.subSection" class="p-4 pb-24">
                    <div class="flex justify-between items-center mb-4">
                      <h3 class="text-base font-medium text-gray-800">Bantuan Aktif</h3>
                      <button 
                        @click="createNewBantuan()" 
                        class="px-3 py-1.5 rounded-md bg-primary text-white text-sm font-medium shadow-sm flex items-center"
                      >
                        <Icon name="ic:baseline-add" size="18" class="mr-1" />
                        Bantuan Baru
                      </button>
                    </div>
                    
                    <!-- Active Aid Cards -->
                    <div class="space-y-4 mb-6">
                      <div 
                        v-for="bantuan in exampleData.bantuanData.activeBantuan" 
                        :key="bantuan.id"
                        class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                      >
                        <div class="border-b border-gray-100 p-3 flex justify-between items-center">
                          <div>
                            <h4 class="font-medium">{{ bantuan.type }}</h4>
                            <p class="text-xs text-gray-600">{{ bantuan.referenceNo }}</p>
                        </div>
                          <div class="badge-aktif py-1 px-2.5 rounded-full text-xs font-medium">
                            {{ bantuan.status }}
                  </div>
                </div>
                
                          <div class="p-3">
                          <div class="mb-3">
                            <div class="grid grid-cols-2 gap-3">
                              <div>
                                <p class="text-xs text-gray-500 mb-1">Jumlah</p>
                                <p class="font-medium text-secondary">{{ bantuan.amount }}</p>
                          </div>
                              <div>
                                <p class="text-xs text-gray-500 mb-1">Kategori</p>
                                <p class="font-medium">{{ bantuan.category }}</p>
                        </div>
                              <div>
                                <p class="text-xs text-gray-500 mb-1">Tarikh Mula</p>
                                <p class="font-medium">{{ bantuan.startDate }}</p>
                      </div>
                              <div>
                                <p class="text-xs text-gray-500 mb-1">Tarikh Tamat</p>
                                <p class="font-medium">{{ bantuan.endDate }}</p>
                            </div>
                        </div>
                      </div>
                      
                          <div class="flex items-center p-2 bg-accent/5 rounded-lg border border-accent/20 mb-3">
                            <Icon name="ic:baseline-calendar-today" class="text-accent mr-2" size="18" />
                            <div>
                              <p class="text-xs text-gray-600 mb-0.5">Pembayaran Seterusnya</p>
                              <p class="font-medium">{{ bantuan.nextPayment }}</p>
                        </div>
                      </div>
                      
                          <div class="flex justify-end space-x-2">
                            <button class="px-3 py-1.5 rounded-md bg-primary/10 text-primary text-sm font-medium" @click="viewBantuanDetails(bantuan.id)">
                              Lihat Butiran
                            </button>
                            <button class="px-3 py-1.5 rounded-md bg-secondary text-white text-sm font-medium shadow-sm">
                              Semak Status
                            </button>
                          </div>
                          </div>
                        </div>
                      </div>
                      
                    <!-- Payment History Section -->
                    <h3 class="text-base font-medium mb-3 text-gray-800">Sejarah Pembayaran</h3>
                    
                    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                      <div class="divide-y divide-gray-100">
                        <div 
                          v-for="payment in exampleData.bantuanData.paymentHistory.slice(0, 3)" 
                          :key="payment.id"
                          class="p-3"
                        >
                          <div class="flex justify-between items-center">
                              <div>
                              <p class="font-medium">{{ payment.amount }}</p>
                              <p class="text-xs text-gray-600">{{ payment.date }}</p>
                              </div>
                            <div class="text-right">
                              <p class="text-sm">{{ payment.type }}</p>
                              <span class="text-xs px-1.5 py-0.5 bg-secondary/10 text-secondary rounded-full">
                                {{ payment.status }}
                              </span>
                            </div>
                            </div>
                          </div>
                              </div>
                      
                      <div class="p-2 border-t border-gray-100 text-center">
                        <button class="text-sm text-primary font-medium">
                          Lihat Semua Pembayaran
                              </button>
                        </div>
                      </div>
                      
                    <!-- Nearby Facilities Section -->
                    <h3 class="text-base font-medium mb-3 text-gray-800">Kemudahan Berdekatan</h3>
                    
                    <div class="space-y-3 mb-6">
                      <div
                        v-for="facility in exampleData.bantuanData.nearbyFacilities"
                        :key="facility.name"
                        class="bg-white rounded-xl p-3 shadow-sm border border-gray-100"
                      >
                        <div class="flex items-start">
                          <div class="bg-primary/10 rounded-md p-2 mr-3">
                            <Icon 
                              :name="facility.type.includes('Pejabat') ? 'ic:baseline-apartment' : 
                                    facility.type.includes('Agihan') ? 'ic:baseline-store' : 
                                    'ic:baseline-local-hospital'"
                              size="20"
                              class="text-primary"
                            />
                            </div>
                          <div class="flex-1">
                            <div class="flex justify-between">
                              <h4 class="font-medium text-gray-800">{{ facility.name }}</h4>
                              <span class="text-xs bg-primary/5 py-0.5 px-1.5 rounded text-primary">{{ facility.distance }}</span>
                            </div>
                            <p class="text-xs text-gray-600 mt-1">{{ facility.address }}</p>
                            <div class="flex justify-between items-center mt-2">
                              <p class="text-xs text-gray-500">{{ facility.type }}</p>
                              <button class="text-xs text-primary flex items-center">
                                <Icon name="ic:baseline-call" size="14" class="mr-1" />
                                Hubungi
                              </button>
                          </div>
                        </div>
                      </div>
                          </div>
                        </div>
                      </div>
                      
                  <!-- Notifications Page - Enhanced with LZS theming -->
                  <div v-if="exampleData.currentSection === 'notifikasi'" class="p-4 pb-24">
                    <div class="flex justify-between items-center mb-4">
                      <h3 class="text-base font-medium text-gray-800">Notifikasi ({{ exampleData.notificationData.items.length }})</h3>
                      <button v-if="exampleData.notificationData.unread > 0" class="text-xs text-primary font-medium" @click="markAllAsRead">
                        Tandakan Semua Dibaca
                            </button>
                      </div>
                      
                        <div class="space-y-3">
                      <div 
                        v-for="notification in exampleData.notificationData.items" 
                        :key="notification.id"
                        class="bg-white rounded-xl shadow-sm border overflow-hidden transition-all"
                        :class="notification.unread ? 'border-l-4 border-l-primary border-gray-100' : 'border-gray-100'"
                      >
                        <div class="p-3.5">
                          <div class="flex items-start">
                            <div class="flex-shrink-0 mr-3">
                              <div class="w-10 h-10 rounded-full flex items-center justify-center" 
                                :class="{
                                  'bg-secondary/15 text-secondary': notification.type === 'success',
                                  'bg-warning/15 text-warning': notification.type === 'warning',
                                  'bg-primary/15 text-primary': notification.type === 'info',
                                  'bg-danger/15 text-danger': notification.type === 'error'
                                }"
                              >
                                <Icon 
                                  :name="{
                                    'success': 'ic:baseline-check-circle',
                                    'warning': 'ic:baseline-warning',
                                    'info': 'ic:baseline-info',
                                    'error': 'ic:baseline-error'
                                  }[notification.type]" 
                                  size="20" 
                                />
                              </div>
                              </div>
                            <div class="flex-1">
                              <div class="flex justify-between items-start">
                                <h4 class="font-medium mb-1">{{ notification.title }}</h4>
                            <div class="flex items-center">
                                  <span v-if="notification.unread" class="w-2.5 h-2.5 bg-primary rounded-full mr-2"></span>
                                  <button @click="deleteNotification(notification.id)" class="text-gray-400">
                                <Icon name="ic:baseline-close" size="18" />
                              </button>
                            </div>
                          </div>
                              <p class="text-sm text-gray-600 mb-2">{{ notification.content }}</p>
                              <div class="flex justify-between items-center">
                                <span class="text-xs text-gray-500">{{ notification.time }}</span>
                                <button 
                                  v-if="notification.action" 
                                  class="text-xs bg-primary/10 text-primary py-1 px-2 rounded-md font-medium"
                                  @click="handleNotificationAction(notification)"
                                >
                                  {{ notification.actionText || 'Lihat' }}
                              </button>
                            </div>
                          </div>
                          </div>
                        </div>
                      </div>
                      
                      <!-- Empty state for notifications -->
                      <div v-if="exampleData.notificationData.items.length === 0" class="text-center py-10">
                        <div class="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-3">
                          <Icon name="ic:baseline-notifications-off" size="28" class="text-gray-400" />
                        </div>
                        <h3 class="font-medium text-gray-700 mb-1">Tiada Notifikasi</h3>
                        <p class="text-sm text-gray-500">Anda tidak mempunyai sebarang notifikasi buat masa ini.</p>
                      </div>
                        </div>
                      </div>
                      
                  <!-- Profile Page - Enhanced with LZS theming -->
                  <div v-if="exampleData.currentSection === 'profile'" class="pb-24">
                    <!-- Profile Header with background -->
                    <div class="bg-primary pb-20 pt-6 px-4 rounded-b-[40px] shadow-md relative">
                      <div class="flex flex-col items-center">
                        <div class="w-20 h-20 rounded-xl bg-white/20 text-white flex items-center justify-center font-bold text-3xl shadow-md border border-white/30">
                          {{ exampleData.userProfile.avatar }}
                          </div>
                        <h2 class="mt-3 text-white font-semibold text-lg">{{ exampleData.userProfile.name }}</h2>
                        <p class="text-white/80 text-sm">{{ exampleData.userProfile.email }}</p>
                        <div class="mt-2 bg-secondary/20 py-1 px-3 rounded-full text-white/90 text-sm flex items-center shadow-sm">
                          <Icon name="ic:baseline-verified-user" class="mr-1.5" size="16" />
                          {{ exampleData.userProfile.department }}
                          </div>
                        </div>
                      </div>
                      
                    <!-- Profile Content -->
                    <div class="px-4 -mt-16">
                      <!-- Personal Information Card -->
                      <div class="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 mb-5">
                        <div class="border-b border-gray-100 p-4">
                          <h3 class="font-medium flex items-center text-gray-800">
                            <Icon name="ic:baseline-person" class="mr-2 text-primary" size="20" />
                            Maklumat Peribadi
                          </h3>
                </div>
                
                        <div class="p-4 space-y-4">
                        <div>
                            <p class="text-xs text-gray-500 mb-1">No. Kad Pengenalan</p>
                            <p class="font-medium">{{ exampleData.userProfile.id }}</p>
                        </div>
                        <div>
                            <p class="text-xs text-gray-500 mb-1">Nombor Telefon</p>
                            <p class="font-medium">{{ exampleData.userProfile.phone }}</p>
                        </div>
                        <div>
                            <p class="text-xs text-gray-500 mb-1">Alamat</p>
                            <p class="font-medium">{{ exampleData.userProfile.address }}</p>
                        </div>
                          <div>
                            <p class="text-xs text-gray-500 mb-1">Jawatan</p>
                            <p class="font-medium">{{ exampleData.userProfile.position }}</p>
                          </div>
                          <div>
                            <p class="text-xs text-gray-500 mb-1">Tarikh Kelulusan</p>
                            <p class="font-medium">{{ exampleData.userProfile.joinDate }}</p>
                          </div>
                        </div>
                        
                        <div class="border-t border-gray-100 p-3 flex justify-end">
                          <button class="text-sm bg-primary/10 text-primary py-1.5 px-3 rounded-lg font-medium">
                            Kemaskini Maklumat
                          </button>
                        </div>
                      </div>
                      
                      <!-- Account Settings Card -->
                      <div class="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 mb-5">
                        <div class="border-b border-gray-100 p-4">
                          <h3 class="font-medium flex items-center text-gray-800">
                            <Icon name="ic:baseline-settings" class="mr-2 text-primary" size="20" />
                            Tetapan Akaun
                          </h3>
                    </div>
                    
                        <div class="divide-y divide-gray-100">
                          <button 
                            v-for="action in exampleData.userProfile.actions" 
                            :key="action.name"
                            class="w-full flex justify-between items-center p-4 hover:bg-gray-50 transition-colors"
                          >
                            <div class="flex items-center">
                              <Icon :name="action.icon" size="20" class="text-gray-500 mr-3" />
                              <span>{{ action.name }}</span>
                            </div>
                            <Icon name="ic:baseline-arrow-forward-ios" size="16" class="text-gray-400" />
                          </button>
                          </div>
                        </div>
                        
                      <!-- Support Card -->
                      <div class="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 mb-5">
                        <div class="border-b border-gray-100 p-4">
                          <h3 class="font-medium flex items-center text-gray-800">
                            <Icon name="ic:baseline-support-agent" class="mr-2 text-primary" size="20" />
                            Sokongan
                          </h3>
                        </div>
                        
                        <div class="p-4">
                          <div class="bg-primary/5 rounded-lg p-3 border border-primary/10 flex items-start mb-3">
                            <Icon name="ic:baseline-info" class="text-primary mr-2 mt-0.5" size="18" />
                        <div>
                              <p class="text-sm font-medium mb-1">Pusat Bantuan</p>
                              <p class="text-xs text-gray-600">Dapatkan jawapan untuk soalan lazim dan bantuan menggunakan aplikasi ini.</p>
                      </div>
                    </div>
                    
                          <div class="bg-gray-100 rounded-lg p-4 flex items-center justify-between">
                            <div>
                              <p class="text-sm font-medium">Hubungi Kami</p>
                              <p class="text-xs text-gray-600">603-9235 5678</p>
                            </div>
                            <button class="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center">
                              <Icon name="ic:baseline-call" size="20" />
                        </button>
                      </div>
                      </div>
                    </div>
                    
                      <!-- Logout Button -->
                      <button class="w-full py-3 bg-danger/10 text-danger rounded-lg font-medium mb-6 flex items-center justify-center">
                        <Icon name="ic:baseline-logout" class="mr-2" size="20" />
                        Log Keluar
                      </button>
                    </div>
                  </div>
                </div>
              </transition>
              
              <!-- Floating Action Button (FAB) -->
              <div 
                class="fab bg-primary text-white shadow-lg hover:bg-primary-dark transition-transform" 
                @click="toggleFabMenu"
                :class="{ 'rotate-45': exampleData.showFabMenu }"
              >
                <Icon name="ic:baseline-add" size="24" />
              </div>
              
              <!-- FAB Menu -->
              <div class="fab-menu" v-if="exampleData.showFabMenu">
                <div 
                  v-for="(type, index) in exampleData.permohonanData.applicationTypes.slice(0, 3)" 
                  :key="type.id"
                  class="fab-item"
                  :class="{ 'expanded': animationStates.fabExpanded }"
                  :style="{ 'transition-delay': `${0.05 * (exampleData.permohonanData.applicationTypes.slice(0, 3).length - index)}s` }"
                >
                  <div class="fab-item-text shadow-md bg-white">{{ type.name }}</div>
                  <button 
                    class="fab-item-button bg-primary text-white shadow-lg hover:bg-primary-dark transition-all"
                    @click="createNewApplication(type.name)"
                  >
                    <Icon name="ic:baseline-add" size="20" />
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Drawer Menu - Move outside mobile-content to ensure it's above the header -->
            <div v-if="exampleData.showMenu" class="mobile-drawer">
              <!-- Overlay -->
              <div 
                class="absolute inset-0 bg-black transition-opacity w-full h-full"
                :class="animationStates.menuExpanded ? 'bg-opacity-50' : 'bg-opacity-0'"
                @click="toggleMenu"
              ></div>
              
              <!-- Drawer Content -->
              <div 
                class="drawer-content absolute left-0 top-0 bottom-0 w-4/5 max-w-[260px] bg-white flex flex-col shadow-2xl"
                :class="{ 'expanded': animationStates.menuExpanded }"
              >
                <!-- User Profile Section - Enhanced -->
                <div class="bg-sidebar p-4 text-white">
                  <div class="flex items-center space-x-3">
                    <div class="w-12 h-12 rounded-full bg-white text-primary flex items-center justify-center font-bold text-xl shadow-md">
                      {{ exampleData.userProfile.avatar }}
                    </div>
                    <div>
                      <p class="font-medium">{{ exampleData.userProfile.name }}</p>
                      <p class="text-xs opacity-80">{{ exampleData.userProfile.email }}</p>
                      <div class="mt-2 bg-accent/20 py-1 px-2 rounded-full inline-flex items-center shadow-sm">
                        <span class="text-xs font-medium text-accent">{{ exampleData.userProfile.department }}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <!-- Menu Items -->
                <div class="overflow-y-auto flex-1">
                  <div class="py-2">
                    <button 
                      v-for="(page, index) in exampleData.demoPages" 
                      :key="index"
                      @click="exampleData.currentSection = page.id; toggleMenu()" 
                      class="w-full flex items-center px-4 py-3 hover:bg-gray-50 transition-colors"
                      :class="{ 'border-l-4 border-accent bg-primary/5': exampleData.currentSection === page.id }"
                    >
                      <Icon :name="page.icon" class="mr-3" size="20" :class="exampleData.currentSection === page.id ? 'text-primary' : 'text-gray-600'" />
                      <span :class="exampleData.currentSection === page.id ? 'text-primary font-medium' : ''">{{ page.title }}</span>
                      <span 
                        v-if="page.id === 'permohonan' && exampleData.permohonanData.activeApplications.length > 0" 
                        class="ml-2 bg-accent text-primary text-xs px-2 py-0.5 rounded-full font-bold"
                      >
                        {{ exampleData.permohonanData.activeApplications.length }}
                      </span>
                    </button>
                    
                    <div class="border-t border-gray-200 my-2"></div>
                    
                    <button class="w-full flex items-center px-4 py-3 hover:bg-gray-50 transition-colors">
                      <Icon name="ic:baseline-help" class="mr-3 text-gray-600" size="20" />
                      <span>Bantuan</span>
                    </button>
                    <button class="w-full flex items-center px-4 py-3 hover:bg-gray-50 transition-colors">
                      <Icon name="ic:baseline-info" class="mr-3 text-gray-600" size="20" />
                      <span>Tentang Kami</span>
                    </button>
                  </div>
                </div>
                
                <!-- Logout Button -->
                <div class="border-t border-gray-200 p-4">
                  <button class="flex items-center text-red-600">
                    <Icon name="ic:baseline-logout" class="mr-2" size="20" />
                    <span>Log Keluar</span>
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Bottom Navigation - Fixed at bottom -->
            <div class="bottom-nav-container">
              <div class="bottom-nav bg-white shadow-lg border-t flex justify-around py-2">
                <button 
                  v-for="page in exampleData.demoPages" 
                  :key="page.id"
                  @click="navigateTo(page.id)"
                  class="flex flex-col items-center p-2 relative" 
                  :class="exampleData.currentSection === page.id ? 'text-primary' : 'text-gray-500'"
                >
                  <div class="w-6 h-6 flex items-center justify-center" :class="exampleData.currentSection === page.id ? 'bg-primary/10 rounded-full' : ''">
                  <Icon :name="page.icon" size="20" />
                  </div>
                  <span class="text-xs mt-1" :class="exampleData.currentSection === page.id ? 'font-medium' : ''">{{ page.title }}</span>
                  <!-- Notification badge for permohonan -->
                  <span 
                    v-if="page.id === 'permohonan' && exampleData.permohonanData.activeApplications.length > 0" 
                    class="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full text-primary text-[8px] font-bold flex items-center justify-center shadow-sm"
                  >
                    {{ exampleData.permohonanData.activeApplications.length }}
                  </span>
                  <!-- Notification badge for notifikasi -->
                  <span 
                    v-if="page.id === 'notifikasi' && exampleData.notificationData.unread > 0" 
                    class="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full text-primary text-[8px] font-bold flex items-center justify-center shadow-sm"
                  >
                    {{ exampleData.notificationData.unread }}
                  </span>
                </button>
              </div>
            </div>
          </div>
          
          <!-- Phone Bottom Bar -->
          <div class="h-4 bg-black pixel-nav-bar flex justify-center items-center">
            <div class="w-1/3 h-1 bg-white rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
          </div>

<!-- Bantuan Form Page (New) -->
<div v-if="exampleData.currentSection === 'bantuan' && exampleData.subSection === 'new'" class="p-4 pb-24">
  <h3 class="h3 mb-4 text-gray-800">Permohonan Bantuan Baru</h3>
  
  <!-- Stepper / Progress indicator -->
  <div class="mb-6">
    <div class="flex items-center justify-between">
      <div class="flex flex-col items-center">
        <div class="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-medium text-sm shadow-sm">1</div>
        <span class="text-xs font-medium mt-1 text-primary">Maklumat</span>
      </div>
      <div class="flex-1 h-1 mx-2 bg-primary"></div>
      <div class="flex flex-col items-center">
        <div class="w-8 h-8 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center font-medium text-sm">2</div>
        <span class="text-xs font-medium mt-1 text-gray-500">Dokumen</span>
      </div>
      <div class="flex-1 h-1 mx-2 bg-gray-200"></div>
      <div class="flex flex-col items-center">
        <div class="w-8 h-8 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center font-medium text-sm">3</div>
        <span class="text-xs font-medium mt-1 text-gray-500">Pengesahan</span>
      </div>
    </div>
  </div>
  
  <!-- Form Card -->
  <div class="bg-white rounded-xl shadow-md border border-gray-100 mb-5">
    <div class="border-b border-gray-100 p-4">
      <h4 class="h4 flex items-center text-gray-800">
        <Icon name="ic:baseline-person" class="mr-2 text-primary" size="20" />
        Maklumat Peribadi
      </h4>
    </div>
    
    <div class="p-4 space-y-4">
      <!-- Type of Aid -->
      <div>
        <label class="form-label mb-1.5 block">Jenis Bantuan <span class="text-danger">*</span></label>
        <select 
          v-model="exampleData.bantuanForm.type" 
          class="form-input w-full"
          :class="{ 'border-danger': exampleData.formErrors.type }"
        >
          <option value="" disabled selected>-- Pilih Jenis Bantuan --</option>
          <option v-for="type in exampleData.bantuanData.bantuanCategories" :key="type.id" :value="type.name">
            {{ type.name }}
          </option>
        </select>
        <p v-if="exampleData.formErrors.type" class="text-danger text-xs mt-1">Sila pilih jenis bantuan</p>
        
        <!-- Type description if selected -->
        <div v-if="exampleData.bantuanForm.type" class="mt-2 p-2 bg-primary/5 rounded-md text-xs">
          <p class="font-medium mb-1">{{ exampleData.bantuanForm.type }}</p>
          <p class="text-gray-600">
            {{ exampleData.bantuanData.bantuanCategories.find(t => t.name === exampleData.bantuanForm.type)?.description || '' }}
          </p>
        </div>
      </div>
      
      <!-- Asnaf Category -->
      <div>
        <label class="form-label mb-1.5 block">Kategori Asnaf <span class="text-danger">*</span></label>
        <select 
          v-model="exampleData.bantuanForm.category" 
          class="form-input w-full"
          :class="{ 'border-danger': exampleData.formErrors.category }"
        >
          <option value="" disabled selected>-- Pilih Kategori Asnaf --</option>
          <option value="Fakir">Fakir</option>
          <option value="Miskin">Miskin</option>
          <option value="Amil">Amil</option>
          <option value="Muallaf">Muallaf</option>
          <option value="Gharimin">Gharimin</option>
          <option value="Fisabilillah">Fisabilillah</option>
          <option value="Ibnu Sabil">Ibnu Sabil</option>
        </select>
        <p v-if="exampleData.formErrors.category" class="text-danger text-xs mt-1">Sila pilih kategori asnaf</p>
      </div>
      
      <!-- Full Name -->
      <div>
        <label class="form-label mb-1.5 block">Nama Penuh <span class="text-danger">*</span></label>
        <input 
          type="text" 
          v-model="exampleData.bantuanForm.fullName" 
          class="form-input w-full"
          :class="{ 'border-danger': exampleData.formErrors.fullName }"
          placeholder="Masukkan nama penuh" 
        />
        <p v-if="exampleData.formErrors.fullName" class="text-danger text-xs mt-1">Sila masukkan nama penuh</p>
      </div>
      
      <!-- ID Number -->
      <div>
        <label class="form-label mb-1.5 block">No. Kad Pengenalan <span class="text-danger">*</span></label>
        <input 
          type="text" 
          v-model="exampleData.bantuanForm.idNumber" 
          class="form-input w-full"
          :class="{ 'border-danger': exampleData.formErrors.idNumber }"
          placeholder="Cth: 860215-14-5732"
        />
        <p v-if="exampleData.formErrors.idNumber" class="text-danger text-xs mt-1">Sila masukkan nombor kad pengenalan yang sah</p>
      </div>
    </div>
  </div>
  
  <!-- Contact Information Card -->
  <div class="bg-white rounded-xl shadow-md border border-gray-100 mb-5">
    <div class="border-b border-gray-100 p-4">
      <h4 class="h4 flex items-center text-gray-800">
        <Icon name="ic:baseline-contact-phone" class="mr-2 text-primary" size="20" />
        Maklumat Perhubungan
      </h4>
    </div>
    
    <div class="p-4 space-y-4">
      <!-- Phone Number -->
      <div>
        <label class="form-label mb-1.5 block">No. Telefon <span class="text-danger">*</span></label>
        <input 
          type="tel" 
          v-model="exampleData.bantuanForm.phone" 
          class="form-input w-full"
          :class="{ 'border-danger': exampleData.formErrors.phone }"
          placeholder="Cth: 019-8765432"
        />
        <p v-if="exampleData.formErrors.phone" class="text-danger text-xs mt-1">Sila masukkan nombor telefon yang sah</p>
      </div>
      
      <!-- Email -->
      <div>
        <label class="form-label mb-1.5 block">Alamat E-mel</label>
        <input 
          type="email" 
          v-model="exampleData.bantuanForm.email" 
          class="form-input w-full"
          :class="{ 'border-danger': exampleData.formErrors.email }"
          placeholder="Cth: nama@contoh.com"
        />
        <p v-if="exampleData.formErrors.email" class="text-danger text-xs mt-1">Sila masukkan alamat e-mel yang sah</p>
      </div>
      
      <!-- Address -->
      <div>
        <label class="form-label mb-1.5 block">Alamat <span class="text-danger">*</span></label>
        <textarea 
          v-model="exampleData.bantuanForm.address" 
          class="form-input w-full min-h-[80px]"
          :class="{ 'border-danger': exampleData.formErrors.address }"
          placeholder="Masukkan alamat penuh"
        ></textarea>
        <p v-if="exampleData.formErrors.address" class="text-danger text-xs mt-1">Sila masukkan alamat</p>
      </div>
    </div>
  </div>
  
  <!-- Bank Information Card -->
  <div class="bg-white rounded-xl shadow-md border border-gray-100 mb-5">
    <div class="border-b border-gray-100 p-4">
      <h4 class="h4 flex items-center text-gray-800">
        <Icon name="ic:baseline-account-balance" class="mr-2 text-primary" size="20" />
        Maklumat Bank
      </h4>
    </div>
    
    <div class="p-4 space-y-4">
      <!-- Bank Name -->
      <div>
        <label class="form-label mb-1.5 block">Nama Bank <span class="text-danger">*</span></label>
        <select 
          v-model="exampleData.bantuanForm.bankName" 
          class="form-input w-full"
          :class="{ 'border-danger': exampleData.formErrors.bankName }"
        >
          <option value="" disabled selected>-- Pilih Bank --</option>
          <option value="Bank Islam">Bank Islam</option>
          <option value="Maybank">Maybank</option>
          <option value="CIMB Bank">CIMB Bank</option>
          <option value="Bank Rakyat">Bank Rakyat</option>
          <option value="RHB Bank">RHB Bank</option>
        </select>
        <p v-if="exampleData.formErrors.bankName" class="text-danger text-xs mt-1">Sila pilih bank</p>
      </div>
      
      <!-- Account Number -->
      <div>
        <label class="form-label mb-1.5 block">No. Akaun Bank <span class="text-danger">*</span></label>
        <input 
          type="text" 
          v-model="exampleData.bantuanForm.accountNumber" 
          class="form-input w-full"
          :class="{ 'border-danger': exampleData.formErrors.accountNumber }"
          placeholder="Masukkan nombor akaun bank"
        />
        <p v-if="exampleData.formErrors.accountNumber" class="text-danger text-xs mt-1">Sila masukkan nombor akaun yang sah</p>
      </div>
    </div>
  </div>
  
  <!-- Reason Section -->
  <div class="bg-white rounded-xl shadow-md border border-gray-100 mb-5">
    <div class="border-b border-gray-100 p-4">
      <h4 class="h4 flex items-center text-gray-800">
        <Icon name="ic:baseline-info" class="mr-2 text-primary" size="20" />
        Sebab Permohonan
      </h4>
    </div>
    
    <div class="p-4 space-y-4">
      <div>
        <label class="form-label mb-1.5 block">Alasan Memohon <span class="text-danger">*</span></label>
        <textarea 
          v-model="exampleData.bantuanForm.reason" 
          class="form-input w-full min-h-[100px]"
          :class="{ 'border-danger': exampleData.formErrors.reason }"
          placeholder="Sila nyatakan sebab keperluan bantuan dengan terperinci"
        ></textarea>
        <p v-if="exampleData.formErrors.reason" class="text-danger text-xs mt-1">Sila nyatakan alasan permohonan</p>
      </div>
    </div>
  </div>
  
  <!-- Form Action Buttons -->
  <div class="flex justify-between items-center mt-6 mb-4">
    <button class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg flex items-center">
      <Icon name="ic:baseline-save" class="mr-2" size="18" />
      Simpan Draf
    </button>
    <button @click="navigateTo('bantuan', 'documents')" class="px-4 py-2 bg-primary text-white rounded-lg shadow-sm flex items-center">
      Langkah Seterusnya
      <Icon name="ic:baseline-arrow-forward" class="ml-2" size="18" />
    </button>
  </div>
  
  <!-- Help tip -->
  <div class="bg-primary/5 p-3 rounded-lg border border-primary/10 mb-4 flex items-start">
    <Icon name="ic:baseline-info" class="text-primary mr-2 mt-0.5" size="18" />
    <div class="text-xs">
      <p class="font-medium mb-1">Bantuan untuk pengisian</p>
      <p class="text-gray-600">Sila isi semua maklumat yang diperlukan dengan tepat. Medan bertanda <span class="text-danger">*</span> adalah wajib.</p>
    </div>
  </div>
</div>

<!-- Bantuan Documents Upload Page -->
<div v-if="exampleData.currentSection === 'bantuan' && exampleData.subSection === 'documents'" class="p-4 pb-24">
  <h3 class="h3 mb-4 text-gray-800">Muat Naik Dokumen</h3>
  
  <!-- Stepper / Progress indicator -->
  <div class="mb-6">
    <div class="flex items-center justify-between">
      <div class="flex flex-col items-center">
        <div class="w-8 h-8 bg-secondary text-white rounded-full flex items-center justify-center font-medium text-sm shadow-sm">
          <Icon name="ic:baseline-check" size="16" />
        </div>
        <span class="text-xs font-medium mt-1 text-secondary">Maklumat</span>
      </div>
      <div class="flex-1 h-1 mx-2 bg-primary"></div>
      <div class="flex flex-col items-center">
        <div class="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-medium text-sm shadow-sm">2</div>
        <span class="text-xs font-medium mt-1 text-primary">Dokumen</span>
      </div>
      <div class="flex-1 h-1 mx-2 bg-gray-200"></div>
      <div class="flex flex-col items-center">
        <div class="w-8 h-8 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center font-medium text-sm">3</div>
        <span class="text-xs font-medium mt-1 text-gray-500">Pengesahan</span>
      </div>
    </div>
  </div>
  
  <!-- Required Documents Card -->
  <div class="bg-white rounded-xl shadow-md border border-gray-100 mb-5">
    <div class="border-b border-gray-100 p-4">
      <h4 class="h4 flex items-center text-gray-800">
        <Icon name="ic:baseline-description" class="mr-2 text-primary" size="20" />
        Dokumen Wajib
      </h4>
    </div>
    
    <div class="p-4">
      <!-- ID Card Document -->
      <div class="mb-4 border border-gray-100 rounded-lg p-3">
        <div class="flex justify-between items-start mb-2">
          <div>
            <h5 class="h5 text-gray-800">Kad Pengenalan</h5>
            <p class="text-xs text-gray-500">Salinan depan dan belakang</p>
          </div>
          <span class="text-xs bg-warning/15 text-warning py-0.5 px-2 rounded-full font-medium">Diperlukan</span>
        </div>
        
        <button class="w-full border border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center bg-gray-50">
          <Icon name="ic:baseline-cloud-upload" size="24" class="text-primary mb-2" />
          <span class="text-sm font-medium text-gray-700">Klik untuk muat naik</span>
          <span class="text-xs text-gray-500 mt-1">Format: JPG, PNG, PDF</span>
        </button>
      </div>
      
      <!-- Income Proof Document -->
      <div class="mb-4 border border-gray-100 rounded-lg p-3">
        <div class="flex justify-between items-start mb-2">
          <div>
            <h5 class="h5 text-gray-800">Bukti Pendapatan</h5>
            <p class="text-xs text-gray-500">Slip gaji / Penyata pencen / Penyata Pendapatan</p>
          </div>
          <span class="text-xs bg-warning/15 text-warning py-0.5 px-2 rounded-full font-medium">Diperlukan</span>
        </div>
        
        <button class="w-full border border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center bg-gray-50">
          <Icon name="ic:baseline-cloud-upload" size="24" class="text-primary mb-2" />
          <span class="text-sm font-medium text-gray-700">Klik untuk muat naik</span>
          <span class="text-xs text-gray-500 mt-1">Format: JPG, PNG, PDF</span>
        </button>
      </div>
      
      <!-- Bank Statement Document -->
      <div class="mb-4 border border-gray-100 rounded-lg p-3">
        <div class="flex justify-between items-start mb-2">
          <div>
            <h5 class="h5 text-gray-800">Penyata Bank</h5>
            <p class="text-xs text-gray-500">Penyata bank 3 bulan terkini</p>
          </div>
          <span class="text-xs bg-warning/15 text-warning py-0.5 px-2 rounded-full font-medium">Diperlukan</span>
        </div>
        
        <button class="w-full border border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center bg-gray-50">
          <Icon name="ic:baseline-cloud-upload" size="24" class="text-primary mb-2" />
          <span class="text-sm font-medium text-gray-700">Klik untuk muat naik</span>
          <span class="text-xs text-gray-500 mt-1">Format: JPG, PNG, PDF</span>
        </button>
      </div>
    </div>
  </div>
  
  <!-- Supporting Documents Card -->
  <div class="bg-white rounded-xl shadow-md border border-gray-100 mb-5">
    <div class="border-b border-gray-100 p-4">
      <h4 class="h4 flex items-center text-gray-800">
        <Icon name="ic:baseline-backup" class="mr-2 text-primary" size="20" />
        Dokumen Sokongan
      </h4>
    </div>
    
    <div class="p-4">
      <!-- Medical Document -->
      <div class="mb-4 border border-gray-100 rounded-lg p-3">
        <div class="flex justify-between items-start mb-2">
          <div>
            <h5 class="h5 text-gray-800">Laporan Perubatan</h5>
            <p class="text-xs text-gray-500">Jika berkenaan</p>
          </div>
          <span class="text-xs bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full font-medium">Pilihan</span>
        </div>
        
        <button class="w-full border border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center bg-gray-50">
          <Icon name="ic:baseline-cloud-upload" size="24" class="text-primary mb-2" />
          <span class="text-sm font-medium text-gray-700">Klik untuk muat naik</span>
          <span class="text-xs text-gray-500 mt-1">Format: JPG, PNG, PDF</span>
        </button>
      </div>
      
      <!-- Add Document Button -->
      <button class="w-full py-2.5 text-sm text-primary flex items-center justify-center">
        <Icon name="ic:baseline-add" size="18" class="mr-1" />
        Tambah Dokumen Lain
      </button>
    </div>
  </div>
  
  <!-- Form Action Buttons -->
  <div class="flex justify-between items-center mt-6 mb-4">
    <button @click="navigateTo('bantuan', 'new')" class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg flex items-center">
      <Icon name="ic:baseline-arrow-back" class="mr-2" size="18" />
      Kembali
    </button>
    <button @click="navigateTo('bantuan', 'review')" class="px-4 py-2 bg-primary text-white rounded-lg shadow-sm flex items-center">
      Langkah Seterusnya
      <Icon name="ic:baseline-arrow-forward" class="ml-2" size="18" />
    </button>
  </div>
</div>

<!-- Bantuan Review & Submit Page -->
<div v-if="exampleData.currentSection === 'bantuan' && exampleData.subSection === 'review'" class="p-4 pb-24">
  <h3 class="h3 mb-4 text-gray-800">Semak & Hantar</h3>
  
  <!-- Stepper / Progress indicator -->
  <div class="mb-6">
    <div class="flex items-center justify-between">
      <div class="flex flex-col items-center">
        <div class="w-8 h-8 bg-secondary text-white rounded-full flex items-center justify-center font-medium text-sm shadow-sm">
          <Icon name="ic:baseline-check" size="16" />
        </div>
        <span class="text-xs font-medium mt-1 text-secondary">Maklumat</span>
      </div>
      <div class="flex-1 h-1 mx-2 bg-secondary"></div>
      <div class="flex flex-col items-center">
        <div class="w-8 h-8 bg-secondary text-white rounded-full flex items-center justify-center font-medium text-sm shadow-sm">
          <Icon name="ic:baseline-check" size="16" />
        </div>
        <span class="text-xs font-medium mt-1 text-secondary">Dokumen</span>
      </div>
      <div class="flex-1 h-1 mx-2 bg-primary"></div>
      <div class="flex flex-col items-center">
        <div class="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-medium text-sm shadow-sm">3</div>
        <span class="text-xs font-medium mt-1 text-primary">Pengesahan</span>
      </div>
    </div>
  </div>
  
  <!-- Summary Card -->
  <div class="bg-white rounded-xl shadow-md border border-gray-100 mb-5">
    <div class="border-b border-gray-100 p-4">
      <h4 class="h4 flex items-center text-gray-800">
        <Icon name="ic:baseline-summarize" class="mr-2 text-primary" size="20" />
        Ringkasan Permohonan
      </h4>
    </div>
    
    <div class="p-4">
      <!-- Bantuan Details -->
      <div class="mb-4">
        <h5 class="h5 mb-2 text-gray-800">Maklumat Bantuan</h5>
        <div class="bg-gray-50 rounded-lg p-3 space-y-2">
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600">Jenis Bantuan:</span>
            <span class="text-sm font-medium">{{ exampleData.bantuanForm.type || "Bantuan Sara Hidup" }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600">Kategori Asnaf:</span>
            <span class="text-sm font-medium">{{ exampleData.bantuanForm.category || "Fakir" }}</span>
          </div>
        </div>
      </div>
      
      <!-- Personal Details -->
      <div class="mb-4">
        <h5 class="h5 mb-2 text-gray-800">Maklumat Peribadi</h5>
        <div class="bg-gray-50 rounded-lg p-3 space-y-2">
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600">Nama Penuh:</span>
            <span class="text-sm font-medium">{{ exampleData.bantuanForm.fullName || exampleData.userProfile.name }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600">No. Kad Pengenalan:</span>
            <span class="text-sm font-medium">{{ exampleData.bantuanForm.idNumber || exampleData.userProfile.id }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600">No. Telefon:</span>
            <span class="text-sm font-medium">{{ exampleData.bantuanForm.phone || exampleData.userProfile.phone }}</span>
          </div>
          <div class="flex justify-between items-start">
            <span class="text-sm text-gray-600">Alamat:</span>
            <span class="text-sm font-medium text-right max-w-[60%]">{{ exampleData.bantuanForm.address || exampleData.userProfile.address }}</span>
          </div>
        </div>
      </div>
      
      <!-- Bank Details -->
      <div class="mb-4">
        <h5 class="h5 mb-2 text-gray-800">Maklumat Bank</h5>
        <div class="bg-gray-50 rounded-lg p-3 space-y-2">
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600">Nama Bank:</span>
            <span class="text-sm font-medium">{{ exampleData.bantuanForm.bankName || "Bank Islam" }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-600">No. Akaun:</span>
            <span class="text-sm font-medium">{{ exampleData.bantuanForm.accountNumber || "xxxx-xxx-xxxxx" }}</span>
          </div>
        </div>
      </div>
      
      <!-- Documents -->
      <div>
        <h5 class="h5 mb-2 text-gray-800">Dokumen</h5>
        <div class="bg-gray-50 rounded-lg p-3">
          <div class="flex items-center mb-2">
            <Icon name="ic:baseline-check-circle" class="text-secondary mr-2" size="16" />
            <span class="text-sm">Kad Pengenalan (dimuat naik)</span>
          </div>
          <div class="flex items-center mb-2">
            <Icon name="ic:baseline-check-circle" class="text-secondary mr-2" size="16" />
            <span class="text-sm">Bukti Pendapatan (dimuat naik)</span>
          </div>
          <div class="flex items-center">
            <Icon name="ic:baseline-check-circle" class="text-secondary mr-2" size="16" />
            <span class="text-sm">Penyata Bank (dimuat naik)</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Declaration Section -->
  <div class="bg-white rounded-xl shadow-md border border-gray-100 mb-5">
    <div class="border-b border-gray-100 p-4">
      <h4 class="h4 flex items-center text-gray-800">
        <Icon name="ic:baseline-gavel" class="mr-2 text-primary" size="20" />
        Pengakuan
      </h4>
    </div>
    
    <div class="p-4">
      <div class="bg-gray-50 p-3 rounded-lg mb-3 text-sm text-gray-700">
        <p>Saya mengaku bahawa segala maklumat yang diberikan dalam permohonan ini adalah benar dan tepat. Saya faham bahawa sebarang maklumat palsu boleh menyebabkan permohonan ditolak dan tindakan undang-undang diambil.</p>
      </div>
      
      <div class="flex items-center mb-3">
        <input type="checkbox" id="agreement" class="mr-2 h-4 w-4 text-primary focus:ring-primary">
        <label for="agreement" class="text-sm">Saya bersetuju dengan syarat-syarat yang dinyatakan di atas</label>
      </div>
    </div>
  </div>
  
  <!-- Form Action Buttons -->
  <div class="flex justify-between items-center mt-6 mb-4">
    <button @click="navigateTo('bantuan', 'documents')" class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg flex items-center">
      <Icon name="ic:baseline-arrow-back" class="mr-2" size="18" />
      Kembali
    </button>
    <button @click="submitBantuanForm" class="px-5 py-2.5 bg-primary text-white rounded-lg shadow-sm flex items-center font-medium">
      <Icon name="ic:baseline-send" class="mr-2" size="18" />
      Hantar Permohonan
    </button>
  </div>
  
  <!-- Help tip -->
  <div class="bg-warning/5 p-3 rounded-lg border border-warning/10 mb-4 flex items-start">
    <Icon name="ic:baseline-info" class="text-warning mr-2 mt-0.5" size="18" />
    <div class="text-xs">
      <p class="font-medium mb-1">Peringatan Penting</p>
      <p class="text-gray-600">Sila semak semua maklumat dengan teliti sebelum menghantar. Permohonan yang telah dihantar tidak boleh diedit.</p>
    </div>
  </div>
</div>

<!-- Bantuan Application Success Page -->
<div v-if="exampleData.currentSection === 'bantuan' && exampleData.subSection === 'success'" class="p-4 pb-24">
  <div class="text-center py-8">
    <div class="w-20 h-20 bg-secondary/15 rounded-full flex items-center justify-center mx-auto mb-6">
      <Icon name="ic:baseline-check-circle" class="text-secondary" size="48" />
    </div>
    
    <h3 class="h3 mb-2 text-gray-800">Permohonan Berjaya Dihantar!</h3>
    <p class="text-gray-600 mb-6">Terima kasih. Permohonan anda telah berjaya dihantar dan kini dalam proses semakan.</p>
    
    <div class="bg-white rounded-xl shadow-md border border-gray-100 p-4 mb-6 text-left">
      <div class="flex justify-between items-center mb-3">
        <span class="text-sm text-gray-600">Nombor Rujukan:</span>
        <span class="font-bold text-primary">BSH-23/5789</span>
      </div>
      <div class="flex justify-between items-center mb-3">
        <span class="text-sm text-gray-600">Tarikh Permohonan:</span>
        <span class="font-medium">10 Jun 2023</span>
      </div>
      <div class="flex justify-between items-center">
        <span class="text-sm text-gray-600">Status:</span>
        <span class="badge-menunggu py-1 px-2.5 rounded-full text-xs font-medium">MENUNGGU</span>
      </div>
    </div>
    
    <div class="bg-primary/5 p-4 rounded-lg border border-primary/10 mb-6 text-left">
      <h5 class="h5 mb-2 text-primary">Langkah Seterusnya</h5>
      <ul class="text-sm space-y-2">
        <li class="flex items-start">
          <Icon name="ic:baseline-circle" class="text-primary mr-2 mt-1" size="8" />
          <span>Permohonan anda akan disemak dalam tempoh 7-14 hari bekerja.</span>
        </li>
        <li class="flex items-start">
          <Icon name="ic:baseline-circle" class="text-primary mr-2 mt-1" size="8" />
          <span>Anda akan menerima notifikasi sebarang kemajuan melalui SMS atau sistem ini.</span>
        </li>
        <li class="flex items-start">
          <Icon name="ic:baseline-circle" class="text-primary mr-2 mt-1" size="8" />
          <span>Pegawai kami mungkin akan menghubungi anda jika maklumat tambahan diperlukan.</span>
        </li>
      </ul>
    </div>
    
    <div class="flex flex-col space-y-3">
      <button @click="navigateTo('bantuan')" class="w-full py-3 bg-primary text-white rounded-lg shadow-sm font-medium">
        Kembali ke Halaman Bantuan
      </button>
      <button class="w-full py-3 bg-primary/10 text-primary rounded-lg font-medium">
        Semak Status Permohonan
      </button>
    </div>
  </div>
</div>
</template>

<style scoped>
/* Add LZS theme-specific styling */
.bg-primary {
  background-color: rgb(var(--color-primary));
}

.text-primary {
  color: rgb(var(--color-primary));
}

.text-header-text {
  color: rgb(var(--header-text));
}

.bg-primary-dark {
  background-color: rgba(var(--color-primary), 0.9);
}

.bg-accent {
  background-color: rgb(var(--color-accent));
}

.text-accent {
  color: rgb(var(--color-accent));
}

.bg-secondary {
  background-color: rgb(var(--color-secondary));
}

.text-secondary {
  color: rgb(var(--color-secondary));
}

.bg-sidebar {
  background-color: rgb(var(--sidebar));
}

/* Standardized Font Hierarchy */
h1, .h1 {
  font-size: 20px;
  font-weight: 700;
  line-height: 1.4;
}

h2, .h2 {
  font-size: 18px;
  font-weight: 700;
  line-height: 1.4;
}

h3, .h3 {
  font-size: 16px;
  font-weight: 600;
  line-height: 1.4;
}

h4, .h4 {
  font-size: 15px;
  font-weight: 600;
  line-height: 1.4;
}

h5, .h5 {
  font-size: 14px;
  font-weight: 600;
  line-height: 1.4;
}

.body-text {
  font-size: 14px;
  line-height: 1.5;
}

.small-text {
  font-size: 12px;
  line-height: 1.5;
}

.label-text {
  font-size: 12px;
  font-weight: 500;
  line-height: 1.4;
}

/* Enhance existing styles with LZS theme */
.mobile-frame {
  width: 360px;
  height: 720px;
  background-color: #000;
  border-radius: 30px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15), 0 0 40px rgba(0, 0, 0, 0.1) inset;
  border: 10px solid #111;
}

.mobile-content {
  width: 100%;
  height: calc(100% - 39px); /* Account for status bar (24px) and bottom bar (15px) */
  background-color: rgb(var(--bg-1));
  position: relative;
  overflow-y: auto;
}

.mobile-header {
  position: sticky;
  top: 0;
  width: 100%;
  z-index: 10;
}

/* FAB and its components with fixed positioning within mobile-content */
.fab {
  position: absolute;
  bottom: 80px;
  right: 20px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 11;
  transition: transform 0.3s ease;
  box-shadow: 0 4px 12px rgba(var(--color-primary), 0.25);
}

.fab-menu {
  position: absolute;
  bottom: 80px;
  right: 20px;
  z-index: 10;
}

.fab-item {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.3s ease;
}

.fab-item.expanded {
  opacity: 1;
  transform: translateY(0);
}

.fab-item-text {
  padding: 8px 16px;
  background-color: #fff;
  color: #333;
  border-radius: 18px;
  margin-right: 8px;
  font-size: 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
}

.fab-item-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(var(--color-primary), 0.25);
}

/* Drawer menu with enhanced styling - now positioned within mobile-frame */
.mobile-drawer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 20;
}

.drawer-content {
  transform: translateX(-100%);
  transition: transform 0.3s ease-out;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
}

.drawer-content.expanded {
  transform: translateX(0%);
}

/* Bottom navigation - fixed to the bottom of mobile-content */
.bottom-nav-container {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 10;
}

.bottom-nav {
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
}

/* Pixel-style navigation bar */
.pixel-nav-bar {
  position: absolute;
  bottom: 0;
  width: 100%;
}

.wrapper {
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f8;
}

.phone-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* For notification badges */
.badge {
  position: absolute;
  top: 0;
  right: 0;
  min-width: 16px;
  height: 16px;
  border-radius: 8px;
  padding: 0 4px;
  font-size: 10px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Card styles enhancement */
.card {
  background-color: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  margin-bottom: 16px;
}

/* Transition effects */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Prevent scrolling when menu is open */
.body-locked {
  overflow: hidden;
}

/* LZS-themed badges/status styles */
.badge-lulus, .badge-aktif, .status-lulus, .status-aktif {
  background-color: rgba(var(--color-secondary), 0.15);
  color: rgb(var(--color-secondary));
  border: 1px solid rgba(var(--color-secondary), 0.3);
}

.badge-menunggu, .status-menunggu {
  background-color: rgba(var(--color-warning), 0.15);
  color: rgb(87, 65, 16); /* Darker shade for contrast */
  border: 1px solid rgba(var(--color-warning), 0.3);
}

.badge-dalam-proses, .status-dalam-proses {
  background-color: rgba(var(--color-info), 0.15);
  color: rgb(var(--color-info));
  border: 1px solid rgba(var(--color-info), 0.3);
}

.badge-ditolak, .status-ditolak {
  background-color: rgba(var(--color-danger), 0.15);
  color: rgb(var(--color-danger));
  border: 1px solid rgba(var(--color-danger), 0.3);
}

.badge-deraf, .status-deraf {
  background-color: rgba(100, 100, 100, 0.15);
  color: rgb(100, 100, 100);
  border: 1px solid rgba(100, 100, 100, 0.3);
}

.badge-baru, .status-baru {
  background-color: rgba(var(--color-primary), 0.15);
  color: rgb(var(--color-primary));
  border: 1px solid rgba(var(--color-primary), 0.3);
}

/* Enhanced button styles */
.btn-primary {
  background-color: rgb(var(--color-primary));
  color: white;
  font-weight: 500;
  padding: 0.625rem 1.25rem;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
  box-shadow: 0 2px 6px rgba(var(--color-primary), 0.25);
}

.btn-primary:hover, .btn-primary:focus {
  background-color: rgba(var(--color-primary), 0.9);
  box-shadow: 0 4px 8px rgba(var(--color-primary), 0.35);
}

.btn-secondary {
  background-color: rgb(var(--color-secondary));
  color: white;
  font-weight: 500;
  padding: 0.625rem 1.25rem;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
  box-shadow: 0 2px 6px rgba(var(--color-secondary), 0.25);
}

.btn-outline {
  background-color: transparent;
  color: rgb(var(--color-primary));
  border: 1px solid rgb(var(--color-primary));
  font-weight: 500;
  padding: 0.625rem 1.25rem;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
}

.btn-outline:hover, .btn-outline:focus {
  background-color: rgba(var(--color-primary), 0.05);
}

/* Enhanced form input styles */
.form-input {
  border: 1px solid rgba(var(--border-color), 1);
  border-radius: 0.5rem;
  padding: 0.625rem 0.875rem;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  background-color: rgb(var(--bg-2));
}

.form-input:focus {
  border-color: rgb(var(--color-primary));
  box-shadow: 0 0 0 3px rgba(var(--color-primary), 0.15);
  outline: none;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.375rem;
  color: rgba(var(--text-color), 0.8);
}

/* Card with enhanced styling */
.card-lzs {
  background-color: white;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: rgba(var(--color-primary), 0.08) 0px 2px 8px, rgba(var(--color-primary), 0.05) 0px 0px 1px;
  margin-bottom: 1rem;
  border: 1px solid rgba(var(--border-color), 0.3);
}

.card-lzs-header {
  padding: 1rem;
  border-bottom: 1px solid rgba(var(--border-color), 0.5);
  background-color: rgba(var(--bg-1), 0.5);
}

.card-lzs-content {
  padding: 1rem;
}

.card-lzs-footer {
  padding: 0.75rem 1rem;
  background-color: rgba(var(--bg-1), 0.5);
  border-top: 1px solid rgba(var(--border-color), 0.5);
}

/* Timeline styling */
.timeline-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: rgb(var(--color-primary));
  border: 2px solid white;
  box-shadow: 0 0 0 2px rgba(var(--color-primary), 0.2);
}

.timeline-line {
  width: 2px;
  background-color: rgba(var(--color-primary), 0.3);
}

.timeline-dot-active {
  background-color: rgb(var(--color-secondary));
  box-shadow: 0 0 0 2px rgba(var(--color-secondary), 0.2);
  }

.timeline-dot-pending {
  background-color: rgb(var(--border-color));
  box-shadow: 0 0 0 2px rgba(var(--border-color), 0.2);
}

/* Enhanced asnaf profile card */
.asnaf-profile-card {
  background: linear-gradient(to bottom right, rgba(var(--color-primary), 0.05), rgba(var(--color-primary), 0.02));
  border-radius: 0.75rem;
  border: 1px solid rgba(var(--color-primary), 0.1);
  padding: 1rem;
  margin-bottom: 1rem;
}

.asnaf-status-badge {
  background-color: rgba(var(--color-secondary), 0.15);
  color: rgb(var(--color-secondary));
  font-weight: 500;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
}

.asnaf-status-badge .icon {
  margin-right: 0.25rem;
}

/* Add fixed padding at the bottom to accommodate the navigation bar */
.pb-24 {
  padding-bottom: 76px !important; /* Adjusted to ensure content doesn't get hidden behind navbar */
}

/* Ensure content area accommodates bottom nav */
.content-wrapper {
  padding-bottom: 60px;
}
</style> 