<script setup>
definePageMeta({
  title: "Kitchen Sink",
  breadcrumb: [
    {
      name: "Kitchen Sink",
      type: "current",
    },
  ],
});

const tooltips = ref({});
const showCodeSections = ref({});

// Modal state
const showModal = ref(false);
const showFormModal = ref(false);

// Table state
const showColumnMenu = ref(false);
const currentPage = ref(1);
const tableFields = ref([
  { key: 'id', label: 'ID', visible: true, sortable: true },
  { key: 'nama', label: 'Nama', visible: true, sortable: true },
  { key: 'tarikh', label: 'Tarikh', visible: true, sortable: true },
  { key: 'jenisBantuan', label: 'Jenis Bantuan', visible: true, sortable: true },
  { key: 'status', label: 'Status', visible: true, sortable: true },
  { key: 'actions', label: 'Tindakan', visible: true, sortable: false }
]);
const sortConfig = ref({ key: 'id', direction: 'asc' });
const tableData = ref([
  { id: 'APP-001', nama: 'Ahmad bin Hassan', tarikh: '2023-05-12', jenisBantuan: 'Bantuan Perubatan', status: 'LULUS' },
  { id: 'APP-002', nama: 'Siti Aminah', tarikh: '2023-05-13', jenisBantuan: 'Bantuan Pendidikan', status: 'MENUNGGU' },
  { id: 'APP-003', nama: 'Mohammed Ismail', tarikh: '2023-05-14', jenisBantuan: 'Bantuan Rumah', status: 'DALAM PROSES' },
  { id: 'APP-004', nama: 'Roslinda Othman', tarikh: '2023-05-15', jenisBantuan: 'Bantuan Perubatan', status: 'DITOLAK' }
]);

// Search state
const searchTerm = ref('');
const advancedSearchVisible = ref(false);
const advancedSearch = ref({
  type: 'all',
  status: 'all',
  year: 'all',
  minAmount: '',
  maxAmount: ''
});
const appliedFilters = ref([
  { id: 1, label: 'Bantuan Perubatan', type: 'jenis' },
  { id: 2, label: 'Aktif', type: 'status' }
]);

// Form Field Grouping state
const personalInfo = ref({
  fullName: '',
  idNumber: '',
  birthDate: '',
  gender: 'lelaki',
});

const addressInfo = ref({
  street: '',
  city: '',
  postalCode: '',
  state: '',
});

const contactInfo = ref({
  email: '',
  phone: '',
  preferredContact: [],
});

// Selection controls state
const genderOptions = [
  { label: 'Lelaki', value: 'lelaki' },
  { label: 'Perempuan', value: 'perempuan' },
];

const stateOptions = [
  { label: 'Selangor', value: 'selangor' },
  { label: 'Kuala Lumpur', value: 'kuala_lumpur' },
  { label: 'Johor', value: 'johor' },
  { label: 'Pulau Pinang', value: 'pulau_pinang' },
  { label: 'Sabah', value: 'sabah' },
  { label: 'Sarawak', value: 'sarawak' },
  { label: 'Perak', value: 'perak' },
  { label: 'Negeri Sembilan', value: 'negeri_sembilan' },
  { label: 'Pahang', value: 'pahang' },
  { label: 'Terengganu', value: 'terengganu' },
  { label: 'Kelantan', value: 'kelantan' },
  { label: 'Perlis', value: 'perlis' },
  { label: 'Melaka', value: 'melaka' },
  { label: 'Kedah', value: 'kedah' },
];

const contactMethodOptions = [
  { label: 'Email', value: 'email' },
  { label: 'SMS', value: 'sms' },
  { label: 'Panggilan Telefon', value: 'phone' },
  { label: 'WhatsApp', value: 'whatsapp' },
];

const interestOptions = [
  { label: 'Berita dan Kemaskini', value: 'news' },
  { label: 'Aktiviti Sukarelawan', value: 'volunteer' },
  { label: 'Bantuan Pendidikan', value: 'education' },
  { label: 'Bantuan Perubatan', value: 'medical' },
  { label: 'Bantuan Sara Hidup', value: 'living_expenses' },
  { label: 'Bantuan Perniagaan', value: 'business' },
];

// Radio options with long content
const longContentRadioOptions = [
  { 
    label: 'Permohonan Secara Bulanan: Pemohon akan menerima bantuan secara bulanan selama tempoh yang diluluskan. Bayaran akan dibuat pada 1hb setiap bulan. Pemohon perlu mengemukakan laporan penggunaan pada setiap 3 bulan.', 
    value: 'monthly' 
  },
  { 
    label: 'Permohonan Sekali Bayar: Pemohon akan menerima jumlah bantuan sekaligus dalam satu bayaran. Laporan penggunaan perlu dikemukakan dalam tempoh 30 hari selepas menerima bayaran.', 
    value: 'one_time' 
  },
  { 
    label: 'Permohonan Berperingkat: Bantuan akan diberi dalam 3 peringkat berdasarkan kemajuan yang dicapai. Setiap peringkat perlu dilengkapkan dan disahkan sebelum pembayaran berikutnya dibuat.', 
    value: 'staged' 
  }
];

// Wizard state
const currentWizardStep = ref(1);
const totalWizardSteps = 4;

// Save Draft & Autosave state
const draftSaved = ref(false);
const savingDraft = ref(false);
const autosaveEnabled = ref(true);
const lastSaved = ref(null);
const failedToSave = ref(false);

// Save draft function
const saveDraft = () => {
  savingDraft.value = true;
  // Simulate API call
  setTimeout(() => {
    savingDraft.value = false;
    draftSaved.value = true;
    lastSaved.value = new Date();
    failedToSave.value = false;
    
    // Hide the success message after 3 seconds
    setTimeout(() => {
      draftSaved.value = false;
    }, 3000);
  }, 1000);
};

// Simulate failed save
const simulateFailedSave = () => {
  savingDraft.value = true;
  // Simulate API call that fails
  setTimeout(() => {
    savingDraft.value = false;
    failedToSave.value = true;
    
    // Hide the error message after 5 seconds
    setTimeout(() => {
      failedToSave.value = false;
    }, 5000);
  }, 1000);
};

// Simulate autosave
let autosaveInterval;
onMounted(() => {
  // Set up autosave every 30 seconds
  autosaveInterval = setInterval(() => {
    if (autosaveEnabled.value) {
      saveDraft();
    }
  }, 30000);

  // Add keyboard event listener
  window.addEventListener('keydown', handleKeydown);
  
  // Clean up any potential storage issues
  try {
    // Clear any old tooltips from storage
    for (const key in localStorage) {
      if (key.startsWith('tooltip_') || key.includes('modal_state')) {
        localStorage.removeItem(key);
      }
    }
  } catch (error) {
    console.warn('Storage cleanup error:', error);
  }
});

onBeforeUnmount(() => {
  // Clear interval when component is unmounted
  if (autosaveInterval) {
    clearInterval(autosaveInterval);
  }
  
  // Remove event listener
  window.removeEventListener('keydown', handleKeydown);
});

// Table methods
const toggleColumn = (key) => {
  const field = tableFields.value.find(f => f.key === key);
  if (field) {
    field.visible = !field.visible;
  }
};

const sortTable = (key) => {
  if (!tableFields.value.find(f => f.key === key)?.sortable) return;
  
  if (sortConfig.value.key === key) {
    sortConfig.value.direction = sortConfig.value.direction === 'asc' ? 'desc' : 'asc';
  } else {
    sortConfig.value.key = key;
    sortConfig.value.direction = 'asc';
  }
};

const getSortIcon = (key) => {
  if (sortConfig.value.key !== key) return 'ic:outline-unfold-more';
  return sortConfig.value.direction === 'asc' ? 'ic:outline-arrow-drop-up' : 'ic:outline-arrow-drop-down';
};

const changePage = (page) => {
  currentPage.value = page;
};

// Search methods
const removeFilter = (filterId) => {
  appliedFilters.value = appliedFilters.value.filter(f => f.id !== filterId);
};

const clearAllFilters = () => {
  appliedFilters.value = [];
  advancedSearch.value = {
    type: 'all',
    status: 'all',
    year: 'all',
    minAmount: '',
    maxAmount: ''
  };
};

const copyCode = (codeId) => {
  const codeElement = document.getElementById(codeId);
  if (codeElement) {
    navigator.clipboard
      .writeText(codeElement.textContent)
      .then(() => {
        console.log("Code copied to clipboard");
        showTooltip(codeId, "Code copied!");
      })
      .catch((err) => {
        console.error("Failed to copy code: ", err);
        showTooltip(codeId, "Failed to copy code");
      });
  }
};

// Modify showTooltip to limit storage
const showTooltip = (codeId, message) => {
  // Limit number of stored tooltips to prevent quota issues
  const maxTooltips = 5;
  const tooltipKeys = Object.keys(tooltips.value);
  
  if (tooltipKeys.length >= maxTooltips) {
    // Remove oldest tooltips when limit is reached
    tooltipKeys.slice(0, tooltipKeys.length - maxTooltips + 1).forEach(key => {
      tooltips.value[key] = null;
    });
  }
  
  tooltips.value[codeId] = message;
  setTimeout(() => {
    tooltips.value[codeId] = null;
  }, 2000); // Hide tooltip after 2 seconds
};

const toggleCodeSection = (section) => {
  showCodeSections.value[section] = !showCodeSections.value[section];
};

// Add new variables for the modal design standards example
const modalDemoOpen = ref(false);
const modalFormOpen = ref(false);
const modalHasChanges = ref(false);
const modalWarningOpen = ref(false);
const returnFocusElement = ref(null);
const modalFormData = ref({
  name: '',
  email: '',
  status: 'active'
});
const originalFormData = ref({});

// Function to open modal and manage focus
const openModalDemo = (modalType, event) => {
  if (modalType === 'form') {
    // Store original data for changes detection
    originalFormData.value = { ...modalFormData.value };
    modalFormOpen.value = true;
    returnFocusElement.value = event?.target;
    // Focus will be set on first input after render using nextTick and ref
    nextTick(() => {
      document.getElementById('modal-form-name')?.focus();
    });
  } else if (modalType === 'info') {
    modalDemoOpen.value = true;
    returnFocusElement.value = event?.target;
  }
};

// Function to check for unsaved changes and prompt warning
const tryCloseModalForm = () => {
  const hasChanges = modalFormData.value.name !== originalFormData.value.name ||
    modalFormData.value.email !== originalFormData.value.email ||
    modalFormData.value.status !== originalFormData.value.status;
  
  if (hasChanges) {
    modalWarningOpen.value = true;
    modalHasChanges.value = true;
  } else {
    closeModalForm();
  }
};

// Function to close modal and return focus
const closeModalForm = () => {
  modalFormOpen.value = false;
  modalWarningOpen.value = false;
  modalHasChanges.value = false;
  
  // Return focus to the element that opened the modal
  nextTick(() => {
    returnFocusElement.value?.focus();
  });
};

// Function to save form data and close modal
const saveModalForm = () => {
  // Here you would typically save the data to an API
  // For demo purposes, we just update originalFormData and close
  originalFormData.value = { ...modalFormData.value };
  modalFormOpen.value = false;
  
  // Return focus to the element that opened the modal
  nextTick(() => {
    returnFocusElement.value?.focus();
  });
};

// Function to close info modal
const closeModalDemo = () => {
  modalDemoOpen.value = false;
  
  // Return focus to the element that opened the modal
  nextTick(() => {
    returnFocusElement.value?.focus();
  });
};

// Add keyboard event handler to allow Escape key to close modals
const handleKeydown = (e) => {
  if (e.key === 'Escape') {
    if (modalWarningOpen.value) {
      modalWarningOpen.value = false;
    } else if (modalFormOpen.value) {
      tryCloseModalForm();
    } else if (modalDemoOpen.value) {
      closeModalDemo();
    }
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
  <div>
    <LayoutsBreadcrumb />
    
    <h1 class="text-2xl font-bold mb-6">Kitchen Sink</h1>
    <p class="mb-8">A comprehensive showcase of all UI components and styles following the LZS Zakat Management UI/UX System Guidelines.</p>

    <!-- Typography Section -->
    <rs-card class="mb-6">
      <template #header>
        <div class="flex items-center">
          <Icon name="ic:outline-text-fields" class="mr-2" />
          Typography Standards
        </div>
      </template>
      <template #body>
        <p class="mb-4">Typography establishes a clear hierarchy and maximizes readability using the Inter font family with sans-serif fallback.</p>
        
        <div class="space-y-6">
          <div class="p-4 border border-gray-200 rounded-md">
            <h1 class="text-2xl font-bold mb-4">Page Titles (H1): 24px, Bold (font-weight: 700)</h1>
            <h2 class="text-xl font-semibold mb-3">Section Headers (H2): 20px, Semibold (font-weight: 600)</h2>
            <h3 class="text-base font-semibold mb-2">Subsection Headers (H3): 16px, Semibold (font-weight: 600)</h3>
            <p class="text-sm mb-2">Body Text: 14px, Regular (font-weight: 400)</p>
            <p class="text-xs text-gray-600">Captions/Helper Text: 12px, Regular with increased line height (1.5) for legibility</p>
            
            <div class="mt-6 p-3 bg-gray-50 rounded">
              <p class="text-sm font-medium mb-1">Font Family:</p>
              <code class="text-xs bg-gray-100 p-1 rounded">font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;</code>
              
              <p class="text-sm font-medium mt-3 mb-1">Line Heights:</p>
              <ul class="text-xs space-y-1">
                <li>Headings: 1.2-1.3 (tight)</li>
                <li>Body text: 1.5 (improved readability)</li>
                <li>Small text: 1.5-1.6 (enhanced legibility)</li>
              </ul>
              
              <p class="text-sm font-medium mt-3 mb-1">Letter Spacing:</p>
              <ul class="text-xs space-y-1">
                <li>Headings: -0.01em (slightly tighter)</li>
                <li>Body text: normal</li>
                <li>All-caps text: 0.05em (slightly wider)</li>
              </ul>
            </div>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Buttons Section -->
    <rs-card class="mb-6">
      <template #header>
        <div class="flex items-center">
          <Icon name="ic:outline-touch-app" class="mr-2" />
          Button Types and Variants
        </div>
      </template>
      <template #body>
        <p class="mb-4">Buttons are a primary means of user interaction and must be implemented using the framework's <code>&lt;Button&gt;</code> component.</p>
        
        <!-- Button Variants -->
        <div class="mb-6">
          <h3 class="text-base font-semibold mb-4">Button Colors</h3>
          <div class="flex flex-wrap items-center gap-4 mb-4">
            <rs-button variant="primary">Primary</rs-button>
            <rs-button variant="secondary">Secondary</rs-button>
            <rs-button variant="info">Info</rs-button>
            <rs-button variant="success">Success</rs-button>
            <rs-button variant="warning">Warning</rs-button>
            <rs-button variant="danger">Danger</rs-button>
          </div>
        </div>

        <!-- Button Styles -->
        <div class="mb-6">
          <h3 class="text-base font-semibold mb-4">Button Styles</h3>
          
          <div class="mb-4">
            <h4 class="text-sm font-medium mb-2">Filled (Default)</h4>
            <div class="flex flex-wrap items-center gap-4 mb-2">
              <rs-button variant="primary">Primary</rs-button>
              <rs-button variant="danger">Danger</rs-button>
            </div>
          </div>
          
          <div class="mb-4">
            <h4 class="text-sm font-medium mb-2">Outline</h4>
            <div class="flex flex-wrap items-center gap-4 mb-2">
              <rs-button variant="primary-outline">Primary Outline</rs-button>
              <rs-button variant="danger-outline">Danger Outline</rs-button>
            </div>
          </div>
          
          <div class="mb-4">
            <h4 class="text-sm font-medium mb-2">Text</h4>
            <div class="flex flex-wrap items-center gap-4 mb-2">
              <rs-button variant="primary-text">Primary Text</rs-button>
              <rs-button variant="danger-text">Danger Text</rs-button>
            </div>
          </div>
        </div>

        <!-- Button Sizes -->
        <div class="mb-6">
          <h3 class="text-base font-semibold mb-4">Button Sizes</h3>
          <div class="flex flex-wrap items-center gap-4 mb-2">
            <rs-button size="sm">Small</rs-button>
            <rs-button size="md">Medium (Default)</rs-button>
            <rs-button size="lg">Large</rs-button>
          </div>
        </div>

        <!-- Button with Icons -->
        <div class="mb-6">
          <h3 class="text-base font-semibold mb-4">Buttons with Icons</h3>
          <div class="flex flex-wrap items-center gap-4 mb-2">
            <rs-button variant="primary">
              <Icon name="ic:baseline-add" class="mr-1" /> Add User
            </rs-button>
            <rs-button variant="danger">
              <Icon name="ic:outline-delete" class="mr-1" /> Delete
            </rs-button>
            <rs-button variant="info-outline">
              <Icon name="ic:outline-edit" class="mr-1" /> Edit
            </rs-button>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Badges Section -->
    <rs-card class="mb-6">
      <template #header>
        <div class="flex items-center">
          <Icon name="ic:outline-local-offer" class="mr-2" />
          Badge Usage
        </div>
      </template>
      <template #body>
        <p class="mb-4">Badges are used to display status indicators in tables, cards, and lists.</p>
        
        <div class="mb-6">
          <h3 class="text-base font-semibold mb-4">Status Badges</h3>
          <div class="flex flex-wrap items-center gap-4 mb-4">
            <rs-badge variant="success">APPROVED</rs-badge>
            <rs-badge variant="warning">PENDING</rs-badge>
            <rs-badge variant="danger">REJECTED</rs-badge>
            <rs-badge variant="disabled">DRAFT</rs-badge>
            <rs-badge variant="info">NEW</rs-badge>
            <rs-badge variant="primary">ACTIVE</rs-badge>
          </div>
        </div>

        <div class="mb-6">
          <h3 class="text-base font-semibold mb-4">Badges with Icons</h3>
          <div class="flex flex-wrap items-center gap-4 mb-4">
            <rs-badge variant="success" icon="ic:outline-check-circle">APPROVED</rs-badge>
            <rs-badge variant="warning" icon="ic:outline-access-time">PENDING</rs-badge>
            <rs-badge variant="danger" icon="ic:outline-cancel">REJECTED</rs-badge>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Alerts Section -->
    <rs-card class="mb-6">
      <template #header>
        <div class="flex items-center">
          <Icon name="ic:outline-notifications" class="mr-2" />
          Alert Components
        </div>
      </template>
      <template #body>
        <p class="mb-4">Alerts are used to provide feedback messages to users.</p>
        
        <div class="space-y-4">
          <rs-alert variant="primary" icon="ic:outline-info">This is a primary alert with information.</rs-alert>
          <rs-alert variant="success" icon="ic:outline-check-circle">Success! Your changes have been saved.</rs-alert>
          <rs-alert variant="warning" icon="ic:outline-warning">Warning: This action cannot be undone.</rs-alert>
          <rs-alert variant="danger" icon="ic:outline-error">Error! Failed to save changes.</rs-alert>
          <rs-alert variant="info" icon="ic:outline-info">Information: Your session will expire in 10 minutes.</rs-alert>
        </div>
      </template>
    </rs-card>

    <!-- Cards Section -->
    <rs-card class="mb-6">
      <template #header>
        <div class="flex items-center">
          <Icon name="ic:outline-dashboard" class="mr-2" />
          Card Components
        </div>
      </template>
      <template #body>
        <p class="mb-4">Cards are used as containers for grouping related content blocks.</p>
        
        <!-- Summary Cards (Metric Cards) styled like in zakat-management.vue -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <RsCard class="p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Jumlah Permohonan</p>
                <p class="text-2xl font-bold mt-1">1,254</p>
                <p class="text-sm mt-1 text-green-600">+12% bulan ini</p>
              </div>
              <div class="p-3 rounded-full bg-blue-50">
                <Icon name="ic:outline-assignment" size="24" class="text-blue-600" />
              </div>
            </div>
          </RsCard>
          
          <RsCard class="p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Permohonan Baru</p>
                <p class="text-2xl font-bold mt-1">154</p>
                <p class="text-sm mt-1 text-blue-600">43 hari ini</p>
              </div>
              <div class="p-3 rounded-full bg-blue-50">
                <Icon name="ic:outline-fiber-new" size="24" class="text-blue-600" />
              </div>
            </div>
          </RsCard>
          
          <RsCard class="p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Permohonan Menunggu</p>
                <p class="text-2xl font-bold mt-1">367</p>
                <p class="text-sm mt-1 text-yellow-600">Perlu tindakan</p>
              </div>
              <div class="p-3 rounded-full bg-blue-50">
                <Icon name="ic:outline-pending" size="24" class="text-blue-600" />
              </div>
            </div>
          </RsCard>
          
          <RsCard class="p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-600">Permohonan Ditolak</p>
                <p class="text-2xl font-bold mt-1">89</p>
                <p class="text-sm mt-1 text-red-600">Bulan ini</p>
              </div>
              <div class="p-3 rounded-full bg-blue-50">
                <Icon name="ic:outline-cancel" size="24" class="text-blue-600" />
              </div>
            </div>
          </RsCard>
        </div>

        <!-- Card with Footer -->
        <rs-card class="mb-4">
          <template #header>Card with Footer</template>
          <template #body>
            <p>This card includes a footer section with action buttons.</p>
          </template>
          <template #footer>
            <div class="flex justify-end gap-2">
              <rs-button variant="secondary-outline">Cancel</rs-button>
              <rs-button variant="primary">Save</rs-button>
            </div>
          </template>
        </rs-card>
      </template>
    </rs-card>

    <!-- User Management Example -->
    <rs-card class="mb-6">
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <Icon name="ic:outline-people" class="mr-2" />
            User Management Example
          </div>
          <rs-button variant="primary" class="flex items-center">
            <Icon name="ic:baseline-add" class="mr-1" /> Add User
          </rs-button>
        </div>
      </template>
      <template #body>
        <p class="mb-4">A user management interface with action buttons in the table rows, including tooltips for icon buttons.</p>
        
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(user, index) in [
                { id: 'USR-001', name: 'Ahmad bin Hassan', email: 'ahmad@example.com', role: 'Admin', status: 'AKTIF' },
                { id: 'USR-002', name: 'Siti Aminah', email: 'siti@example.com', role: 'Editor', status: 'AKTIF' },
                { id: 'USR-003', name: 'Mohammed Ismail', email: 'ismail@example.com', role: 'Viewer', status: 'BARU' },
                { id: 'USR-004', name: 'Roslinda Othman', email: 'ros@example.com', role: 'Manager', status: 'TIDAK AKTIF' }
              ]" :key="index">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ user.id }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ user.name }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ user.email }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ user.role }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <rs-badge 
                    :variant="user.status === 'AKTIF' ? 'success' : user.status === 'BARU' ? 'info' : 'disabled'"
                  >
                    {{ user.status }}
                  </rs-badge>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex justify-end space-x-2">
                    <!-- Edit button with tooltip -->
                    <div class="relative" @mouseenter="tooltips['edit'+index] = true" @mouseleave="tooltips['edit'+index] = false">
                      <rs-button variant="info-text" class="p-1 w-8 h-8">
                        <Icon name="ic:outline-edit" size="18" />
                      </rs-button>
                      <transition name="tooltip">
                        <span v-if="tooltips['edit'+index]" class="absolute bottom-full mb-2 right-0 bg-gray-800 text-white text-xs rounded py-1 px-2 z-10">
                          Edit
                        </span>
                      </transition>
                    </div>
                    
                    <!-- Reset Password button with tooltip -->
                    <div class="relative" @mouseenter="tooltips['reset'+index] = true" @mouseleave="tooltips['reset'+index] = false">
                      <rs-button variant="warning-text" class="p-1 w-8 h-8">
                        <Icon name="ic:outline-lock-reset" size="18" />
                      </rs-button>
                      <transition name="tooltip">
                        <span v-if="tooltips['reset'+index]" class="absolute bottom-full mb-2 right-0 bg-gray-800 text-white text-xs rounded py-1 px-2 z-10">
                          Reset Password
                        </span>
                      </transition>
                    </div>
                    
                    <!-- Delete button with tooltip -->
                    <div class="relative" @mouseenter="tooltips['delete'+index] = true" @mouseleave="tooltips['delete'+index] = false">
                      <rs-button variant="danger-text" class="p-1 w-8 h-8">
                        <Icon name="ic:outline-delete" size="18" />
                      </rs-button>
                      <transition name="tooltip">
                        <span v-if="tooltips['delete'+index]" class="absolute bottom-full mb-2 right-0 bg-gray-800 text-white text-xs rounded py-1 px-2 z-10">
                          Delete
                        </span>
                      </transition>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Pagination -->
        <div class="mt-4 flex items-center justify-between">
          <div class="text-sm text-gray-500">
            Showing 1 to 4 of 4 records
          </div>
          <div class="flex space-x-2">
            <button
              disabled
              class="px-3 py-1 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium disabled:opacity-50"
            >
              Previous
            </button>
            <button
              disabled
              class="px-3 py-1 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Modals Section -->
    <rs-card class="mb-6">
      <template #header>
        <div class="flex items-center">
          <Icon name="ic:outline-web-asset" class="mr-2" />
          Modal Dialogs
        </div>
      </template>
      <template #body>
        <p class="mb-4">Modals are used for focused interactions that require user attention.</p>
        
        <div class="flex flex-wrap gap-4">
          <!-- Confirmation Modal Example -->
          <rs-button variant="primary" @click="showModal = true">Open Confirmation Modal</rs-button>
          
          <!-- Form Modal Example -->
          <rs-button variant="info" @click="showFormModal = true">Open Form Modal</rs-button>
        </div>
        
        <!-- Confirmation Modal -->
        <rs-modal v-model="showModal" title="Dialog Pengesahan">
          <template #header>
            <div class="p-4 border-b">
              <h3 class="text-lg font-medium">Dialog Pengesahan</h3>
            </div>
          </template>
          
          <div class="p-6">
            <div class="flex items-start">
              <div class="bg-blue-100 rounded-full p-2 mr-4">
                <Icon name="ic:outline-info" size="24" class="text-blue-600" />
              </div>
              <div>
                <p class="mb-4">Adakah anda pasti untuk meneruskan tindakan ini?</p>
                
                <div class="bg-gray-50 p-3 rounded-md mb-4 text-sm">
                  <div class="grid grid-cols-2 gap-2">
                    <div class="text-gray-600">ID Permohonan:</div>
                    <div class="font-medium">APP-001</div>
                    
                    <div class="text-gray-600">Nama Pemohon:</div>
                    <div class="font-medium">Ahmad bin Hassan</div>
                    
                    <div class="text-gray-600">Status Semasa:</div>
                    <div class="font-medium">
                      <RsBadge variant="warning">MENUNGGU</RsBadge>
                    </div>
                  </div>
                </div>
                
                <p class="text-sm text-gray-600">
                  Tindakan ini tidak dapat dibatalkan selepas disahkan.
                </p>
              </div>
            </div>
          </div>
          
          <template #footer>
            <div class="p-4 border-t flex justify-end gap-3">
              <RsButton variant="secondary" @click="showModal = false">Batal</RsButton>
              <RsButton variant="primary" @click="showModal = false">Teruskan</RsButton>
            </div>
          </template>
        </rs-modal>
        
        <!-- Form Modal -->
        <rs-modal v-model="showFormModal" title="Form Modal">
          <template #header>
            <div class="p-4 border-b">
              <h3 class="text-lg font-medium">Edit User</h3>
            </div>
          </template>
          
          <div class="p-6">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium mb-1">Name</label>
                <input type="text" class="w-full border border-gray-300 rounded-md p-2" value="John Doe" />
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">Email</label>
                <input type="email" class="w-full border border-gray-300 rounded-md p-2" value="john.doe@example.com" />
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">Role</label>
                <select class="w-full border border-gray-300 rounded-md p-2">
                  <option>Admin</option>
                  <option selected>User</option>
                  <option>Manager</option>
                </select>
              </div>
            </div>
          </div>
          
          <template #footer>
            <div class="p-4 border-t flex justify-end gap-3">
              <RsButton variant="secondary-outline" @click="showFormModal = false">Cancel</RsButton>
              <RsButton variant="primary" @click="showFormModal = false">Save Changes</RsButton>
            </div>
          </template>
        </rs-modal>
      </template>
    </rs-card>

    <!-- Tabs Section -->
    <rs-card class="mb-6">
      <template #header>
        <div class="flex items-center">
          <Icon name="ph:tabs" class="mr-2" />
          Tabs Component
        </div>
      </template>
      <template #body>
        <p class="mb-4">Tabs are used to organize content into different sections.</p>
        
        <rs-tab>
          <rs-tab-item title="User Information">
            <div class="p-4">
              <h3 class="text-base font-semibold mb-2">User Information</h3>
              <p>This tab contains basic user information like name, email, and contact details.</p>
            </div>
          </rs-tab-item>
          <rs-tab-item title="Application Details">
            <div class="p-4">
              <h3 class="text-base font-semibold mb-2">Application Details</h3>
              <p>This tab contains information about the user's application, including status and submission date.</p>
            </div>
          </rs-tab-item>
          <rs-tab-item title="Documents">
            <div class="p-4">
              <h3 class="text-base font-semibold mb-2">Documents</h3>
              <p>This tab displays the documents attached to the application.</p>
            </div>
          </rs-tab-item>
        </rs-tab>
      </template>
    </rs-card>

    <!-- Collapse Section -->
    <rs-card class="mb-6">
      <template #header>
        <div class="flex items-center">
          <Icon name="ph:arrows-in" class="mr-2" />
          Collapse Components
        </div>
      </template>
      <template #body>
        <p class="mb-4">Collapse components are used to hide and show content.</p>
        
        <rs-collapse>
          <rs-collapse-item title="Section 1">
            <div class="p-4">
              <p>Content for Section 1 goes here. This can include any type of content, like text, forms, or other components.</p>
            </div>
          </rs-collapse-item>
          <rs-collapse-item title="Section 2">
            <div class="p-4">
              <p>Content for Section 2 goes here. Collapse items are useful for FAQs, settings sections, or any content that needs to be toggled.</p>
            </div>
          </rs-collapse-item>
          <rs-collapse-item title="Section 3">
            <div class="p-4">
              <p>Content for Section 3 goes here. The collapse component helps save space and organize information.</p>
            </div>
          </rs-collapse-item>
        </rs-collapse>
      </template>
    </rs-card>

    <!-- Dropdown Section -->
    <rs-card class="mb-6">
      <template #header>
        <div class="flex items-center">
          <Icon name="ph:caret-down" class="mr-2" />
          Dropdown Menus
        </div>
      </template>
      <template #body>
        <p class="mb-4">Dropdowns provide a compact way to present multiple actions or options.</p>
        
        <div class="flex flex-wrap gap-4">
          <rs-dropdown text="Actions" variant="primary">
            <rs-dropdown-item>
              <Icon name="ph:eye" class="mr-2" /> View
            </rs-dropdown-item>
            <rs-dropdown-item>
              <Icon name="ph:pencil" class="mr-2" /> Edit
            </rs-dropdown-item>
            <rs-dropdown-item>
              <Icon name="ph:trash" class="mr-2" color="red" /> Delete
            </rs-dropdown-item>
          </rs-dropdown>
          
          <rs-dropdown text="User Options" variant="secondary-outline">
            <rs-dropdown-item>
              <Icon name="ph:user" class="mr-2" /> Profile
            </rs-dropdown-item>
            <rs-dropdown-item>
              <Icon name="ph:gear" class="mr-2" /> Settings
            </rs-dropdown-item>
            <rs-dropdown-item>
              <Icon name="ph:sign-out" class="mr-2" /> Logout
            </rs-dropdown-item>
          </rs-dropdown>
        </div>
      </template>
    </rs-card>

    <!-- Progress Bar Section -->
    <rs-card class="mb-6">
      <template #header>
        <div class="flex items-center">
          <Icon name="ic:outline-linear-scale" class="mr-2" />
          Progress Indicators
        </div>
      </template>
      <template #body>
        <p class="mb-4">Progress indicators show completion status and provide feedback during long operations.</p>
        
        <div class="space-y-6">
          <div>
            <h3 class="text-base font-semibold mb-2">Basic Progress Bar</h3>
            <rs-progress-bar :value="75" />
          </div>
          
          <div>
            <h3 class="text-base font-semibold mb-2">Progress Bar with Label</h3>
            <rs-progress-bar :value="40" :showValue="true" />
          </div>
          
          <div>
            <h3 class="text-base font-semibold mb-2">Colored Progress Bars</h3>
            <div class="space-y-2">
              <rs-progress-bar :value="90" variant="success" :showValue="true" />
              <rs-progress-bar :value="60" variant="warning" :showValue="true" />
              <rs-progress-bar :value="30" variant="danger" :showValue="true" />
            </div>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Table Section with Column Visibility -->
    <rs-card class="mb-6">
      <template #header>
        <div class="flex items-center">
          <Icon name="ic:outline-table-view" class="mr-2" />
          Data Tables with Column Visibility
        </div>
      </template>
      <template #body>
        <p class="mb-4">Tables display structured data in rows and columns with options to show/hide columns.</p>
        
        <div class="flex justify-between items-center mb-4">
          <div class="text-sm text-gray-500">
            Showing 1 to 4 of 4 records
          </div>
          <div class="relative">
            <button
              @click="showColumnMenu = !showColumnMenu"
              class="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Icon name="ic:outline-view-column" size="20" />
              <span>Columns</span>
            </button>
            
            <!-- Column Visibility Menu -->
            <div
              v-if="showColumnMenu"
              class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-10"
            >
              <div class="py-1">
                <div
                  v-for="field in tableFields"
                  :key="field.key"
                  class="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                  @click="toggleColumn(field.key)"
                >
                  <div class="flex items-center">
                    <input
                      type="checkbox"
                      :checked="field.visible"
                      class="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span>{{ field.label }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  v-for="field in tableFields.filter(f => f.visible)"
                  :key="field.key"
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  @click="sortTable(field.key)"
                >
                  <div class="flex items-center">
                    <span>{{ field.label }}</span>
                    <Icon
                      v-if="field.sortable"
                      :name="getSortIcon(field.key)"
                      class="ml-1"
                      size="16"
                    />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(app, index) in tableData" :key="app.id" class="hover:bg-gray-50">
                <td v-if="tableFields.find(f => f.key === 'id')?.visible" class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ app.id }}
                </td>
                <td v-if="tableFields.find(f => f.key === 'nama')?.visible" class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ app.nama }}
                </td>
                <td v-if="tableFields.find(f => f.key === 'tarikh')?.visible" class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ app.tarikh }}
                </td>
                <td v-if="tableFields.find(f => f.key === 'jenisBantuan')?.visible" class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ app.jenisBantuan }}
                </td>
                <td v-if="tableFields.find(f => f.key === 'status')?.visible" class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full"
                    :class="{
                      'bg-green-100 text-green-800': app.status === 'LULUS',
                      'bg-yellow-100 text-yellow-800': app.status === 'MENUNGGU',
                      'bg-blue-100 text-blue-800': app.status === 'DALAM PROSES',
                      'bg-red-100 text-red-800': app.status === 'DITOLAK'
                    }"
                  >
                    {{ app.status }}
                  </span>
                </td>
                <td v-if="tableFields.find(f => f.key === 'actions')?.visible" class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    @click="showModal = true"
                    class="text-blue-600 hover:text-blue-900"
                  >
                    <Icon name="ic:outline-remove-red-eye" class="mr-1" size="16" />
                    Lihat
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Pagination -->
        <div class="mt-4 flex items-center justify-between">
          <div class="text-sm text-gray-500">
            Showing 1 to 4 of 4 records
          </div>
          <div class="flex space-x-2">
            <button
              @click="changePage(currentPage - 1)"
              disabled
              class="px-3 py-1 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium disabled:opacity-50"
            >
              Previous
            </button>
            <button
              @click="changePage(currentPage + 1)"
              disabled
              class="px-3 py-1 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Advanced Search Component -->
    <rs-card class="mb-6">
      <template #header>
        <div class="flex items-center">
          <Icon name="ic:outline-search" class="mr-2" />
          Advanced Search Component
        </div>
      </template>
      <template #body>
        <p class="mb-4">Advanced search allows users to filter results using multiple criteria.</p>
        
        <!-- Full-width search input with icon -->
        <div class="relative mb-6">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon name="ic:baseline-search" class="text-gray-400" size="20" />
          </div>
          <input
            v-model="searchTerm"
            type="text"
            placeholder="Search by name, ID, or any keyword..."
            class="w-full pl-10 pr-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div class="absolute inset-y-0 right-0 flex items-center">
            <button 
              @click="advancedSearchVisible = !advancedSearchVisible"
              class="px-4 text-sm text-blue-600 hover:text-blue-800 flex items-center"
            >
              <Icon name="ic:baseline-tune" class="mr-1" />
              <span>Advanced Search</span>
            </button>
          </div>
        </div>
        
        <!-- Advanced Search Panel (Collapsible) -->
        <div v-if="advancedSearchVisible" class="mb-6 bg-gray-50 p-4 rounded-md border">
          <h3 class="text-base font-medium mb-4">Advanced Search</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <!-- Type Dropdown -->
            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1">Type</label>
              <select
                v-model="advancedSearch.type"
                class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="medical">Medical Aid</option>
                <option value="education">Education Aid</option>
                <option value="housing">Housing Aid</option>
              </select>
            </div>
            
            <!-- Status Dropdown -->
            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1">Status</label>
              <select
                v-model="advancedSearch.status"
                class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            
            <!-- Year Dropdown -->
            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1">Year</label>
              <select
                v-model="advancedSearch.year"
                class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Years</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                <option value="2021">2021</option>
              </select>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <!-- Amount Minimum -->
            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1">Minimum Amount (RM)</label>
              <input
                v-model="advancedSearch.minAmount"
                type="number"
                placeholder="e.g., 1000"
                class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <!-- Amount Maximum -->
            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1">Maximum Amount (RM)</label>
              <input
                v-model="advancedSearch.maxAmount"
                type="number"
                placeholder="e.g., 5000"
                class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <!-- Applied Filters -->
          <div v-if="appliedFilters.length > 0" class="mb-4">
            <div class="flex flex-wrap items-center gap-2">
              <span class="text-sm text-gray-500">Active Filters:</span>
              
              <!-- Filter chips -->
              <div 
                v-for="filter in appliedFilters" 
                :key="filter.id"
                class="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm"
              >
                <span class="mr-1">{{ filter.label }}</span>
                <button @click="removeFilter(filter.id)" class="text-blue-800 hover:text-blue-900">
                  <Icon name="ic:baseline-close" size="16" />
                </button>
              </div>
              
              <!-- Clear all filters button -->
              <button 
                @click="clearAllFilters"
                class="text-sm text-gray-500 hover:text-gray-700 ml-2"
              >
                Clear All
              </button>
            </div>
          </div>
          
          <div class="flex justify-end space-x-3">
            <rs-button variant="secondary" @click="advancedSearchVisible = false">Close</rs-button>
            <rs-button variant="primary" @click="advancedSearchVisible = false">Apply Filters</rs-button>
          </div>
        </div>
        
        <!-- Search Button -->
        <div class="flex justify-end">
          <rs-button variant="primary">
            <Icon name="ic:baseline-search" class="mr-1" />
            <span>Search</span>
          </rs-button>
        </div>
      </template>
    </rs-card>

    <!-- Form Field Grouping Section -->
    <rs-card class="mb-6">
      <template #header>
        <div class="flex items-center">
          <Icon name="ic:outline-fact-check" class="mr-2" />
          Logical Field Grouping
        </div>
      </template>
      <template #body>
        <p class="mb-4">Organizing form fields into logical groups reduces cognitive load and improves data entry accuracy. Group related fields together within visually distinct containers, such as Card components, to help users understand the context and flow of information.</p>
        
        <div class="space-y-6">
          <!-- Personal Information Card -->
          <rs-card class="p-4">
            <h3 class="text-base font-semibold mb-4">Maklumat Peribadi</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div>
                <label class="block text-sm font-medium text-gray-600 mb-1">Nama Penuh <span class="text-red-500">*</span></label>
                <input
                  v-model="personalInfo.fullName"
                  type="text"
                  class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan nama penuh anda"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-600 mb-1">No. Kad Pengenalan <span class="text-red-500">*</span></label>
                <input
                  v-model="personalInfo.idNumber"
                  type="text"
                  class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: 990101-07-1234"
                />
              </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-600 mb-1">Tarikh Lahir <span class="text-red-500">*</span></label>
                <input
                  v-model="personalInfo.birthDate"
                  type="date"
                  class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-600 mb-1">Jantina <span class="text-red-500">*</span></label>
                <div class="space-x-4 mt-2">
                  <label class="inline-flex items-center">
                    <input
                      type="radio"
                      v-model="personalInfo.gender"
                      value="lelaki"
                      class="mr-2"
                    />
                    <span>Lelaki</span>
                  </label>
                  <label class="inline-flex items-center">
                    <input
                      type="radio"
                      v-model="personalInfo.gender"
                      value="perempuan"
                      class="mr-2"
                    />
                    <span>Perempuan</span>
                  </label>
                </div>
              </div>
            </div>
          </rs-card>
          
          <!-- Address Information Card -->
          <rs-card class="p-4">
            <h3 class="text-base font-semibold mb-4">Alamat Pemohon</h3>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-600 mb-1">Alamat <span class="text-red-500">*</span></label>
              <input
                v-model="addressInfo.street"
                type="text"
                class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="No. rumah dan nama jalan"
              />
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-600 mb-1">Bandar <span class="text-red-500">*</span></label>
                <input
                  v-model="addressInfo.city"
                  type="text"
                  class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: Shah Alam"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-600 mb-1">Poskod <span class="text-red-500">*</span></label>
                <input
                  v-model="addressInfo.postalCode"
                  type="text"
                  class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: 40000"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-600 mb-1">Negeri <span class="text-red-500">*</span></label>
                <select
                  v-model="addressInfo.state"
                  class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled selected>Pilih negeri</option>
                  <option v-for="option in stateOptions" :key="option.value" :value="option.value">
                    {{ option.label }}
                  </option>
                </select>
              </div>
            </div>
          </rs-card>
          
          <!-- Contact Information Card -->
          <rs-card class="p-4">
            <h3 class="text-base font-semibold mb-4">Maklumat Perhubungan</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div>
                <label class="block text-sm font-medium text-gray-600 mb-1">Alamat E-mel <span class="text-red-500">*</span></label>
                <input
                  v-model="contactInfo.email"
                  type="email"
                  class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: nama@emel.com"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-600 mb-1">No. Telefon <span class="text-red-500">*</span></label>
                <input
                  v-model="contactInfo.phone"
                  type="tel"
                  class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: 0123456789"
                />
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-600 mb-1">Kaedah Perhubungan Yang Diutamakan</label>
              <div class="grid grid-cols-1 md:grid-cols-2 mt-2">
                <div v-for="option in contactMethodOptions" :key="option.value" class="mb-2">
                  <label class="inline-flex items-center">
                    <input
                      type="checkbox"
                      v-model="contactInfo.preferredContact"
                      :value="option.value"
                      class="mr-2"
                    />
                    <span>{{ option.label }}</span>
                  </label>
                </div>
              </div>
            </div>
          </rs-card>
          
          <!-- Save Draft & Submit Buttons -->
          <div class="flex justify-end space-x-3">
            <rs-button variant="secondary-outline" @click="saveDraft">Simpan Draf</rs-button>
            <rs-button variant="primary">Hantar</rs-button>
          </div>
          
          <!-- Tips on Field Grouping -->
          <div class="mt-6 p-4 bg-blue-50 rounded-md">
            <h4 class="text-sm font-semibold mb-2">Amalan Terbaik Untuk Pengelompokan Medan:</h4>
            <ul class="text-sm space-y-2 list-disc pl-5">
              <li>Kelompokkan medan yang berkaitan bersama dalam kad atau bahagian yang jelas.</li>
              <li>Gunakan tajuk subseksyen (semibold, 16px) untuk setiap kumpulan, sejajar ke kiri dan gaya yang konsisten.</li>
              <li>Kekalkan jarak menegak 24px antara kumpulan untuk kejelasan.</li>
              <li>Gunakan penjajaran grid dalam kumpulan untuk susun atur yang konsisten.</li>
              <li>Untuk medan pilihan, tunjukkan dalam tajuk subheader (cth. "Maklumat Tambahan (Pilihan)").</li>
              <li>Pastikan kebolehcapaian dengan mengaitkan subheader dengan kumpulan medan menggunakan atribut ARIA yang sesuai.</li>
            </ul>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Placeholder Text Best Practices Section -->
    <rs-card class="mb-6">
      <template #header>
        <div class="flex items-center">
          <Icon name="ic:outline-text-fields" class="mr-2" />
          Placeholder Text Best Practices
        </div>
      </template>
      <template #body>
        <p class="mb-4">Placeholders should be used to provide hints about the expected input format, not as a replacement for labels. They should be concise, clear, and free of unnecessary words.</p>
        
        <div class="space-y-6">
          <!-- Correct Placeholder Usage -->
          <div>
            <h3 class="text-base font-semibold mb-4">Penggunaan Placeholder Yang Betul</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <!-- Date Field Example -->
              <div>
                <label class="block text-sm font-medium text-gray-600 mb-1">Tarikh Lahir <span class="text-red-500">*</span></label>
                <div class="relative">
                  <input
                    type="text"
                    placeholder="DD/MM/YYYY"
                    class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div class="absolute right-2 top-2 text-gray-400">
                    <Icon name="ic:outline-info" class="cursor-help" title="Format: Hari/Bulan/Tahun" />
                  </div>
                </div>
                <p class="text-xs text-gray-500 mt-1">Contoh yang baik: Placeholder menunjukkan format yang diharapkan</p>
              </div>
              
              <!-- Search Field Example -->
              <div>
                <label class="block text-sm font-medium text-gray-600 mb-1">Carian Pemohon</label>
                <div class="relative">
                  <input
                    type="text"
                    placeholder="Masukkan No. KP atau Nama"
                    class="w-full border rounded-md px-3 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div class="absolute left-3 top-2.5 text-gray-400">
                    <Icon name="ic:outline-search" />
                  </div>
                </div>
                <p class="text-xs text-gray-500 mt-1">Contoh yang baik: Placeholder menyatakan jenis input yang diterima</p>
              </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Amount Field Example -->
              <div>
                <label class="block text-sm font-medium text-gray-600 mb-1">Jumlah (RM)</label>
                <input
                  type="text"
                  placeholder="Contoh: 1,000.00"
                  class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p class="text-xs text-gray-500 mt-1">Contoh yang baik: Menunjukkan format angka yang diharapkan</p>
              </div>
              
              <!-- Phone Number Example -->
              <div>
                <label class="block text-sm font-medium text-gray-600 mb-1">No. Telefon</label>
                <input
                  type="tel"
                  placeholder="01x-xxxxxxx"
                  class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p class="text-xs text-gray-500 mt-1">Contoh yang baik: Format nombor telefon yang diharapkan</p>
              </div>
            </div>
          </div>
          
          <!-- Incorrect Placeholder Usage -->
          <div>
            <h3 class="text-base font-semibold mb-4">Penggunaan Placeholder Yang Tidak Betul</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <!-- Placeholder as Label (Bad) -->
              <div>
                <div class="relative">
                  <input
                    type="text"
                    placeholder="Nama Penuh *"
                    class="w-full border border-red-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <p class="text-xs text-red-500 mt-1">Contoh yang tidak baik: Menggunakan placeholder sebagai ganti label</p>
              </div>
              
              <!-- Too Long Placeholder (Bad) -->
              <div>
                <label class="block text-sm font-medium text-gray-600 mb-1">Alamat</label>
                <textarea
                  placeholder="Sila masukkan alamat lengkap anda termasuk nombor rumah, nama jalan, taman perumahan, daerah dan poskod untuk memudahkan proses penghantaran dokumen"
                  class="w-full border border-red-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 h-20"
                ></textarea>
                <p class="text-xs text-red-500 mt-1">Contoh yang tidak baik: Placeholder terlalu panjang dan terperinci</p>
              </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Validation in Placeholder (Bad) -->
              <div>
                <label class="block text-sm font-medium text-gray-600 mb-1">Emel</label>
                <input
                  type="email"
                  placeholder="Emel tidak sah! Format: nama@domain.com"
                  class="w-full border border-red-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <p class="text-xs text-red-500 mt-1">Contoh yang tidak baik: Menyertakan mesej ralat dalam placeholder</p>
              </div>
              
              <!-- ALL CAPS Placeholder (Bad) -->
              <div>
                <label class="block text-sm font-medium text-gray-600 mb-1">Negeri</label>
                <input
                  type="text"
                  placeholder="MASUKKAN NAMA NEGERI DI SINI"
                  class="w-full border border-red-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <p class="text-xs text-red-500 mt-1">Contoh yang tidak baik: Menggunakan huruf besar sepenuhnya</p>
              </div>
            </div>
          </div>
          
          <!-- Placeholder Best Practices Guidelines -->
          <div class="p-4 bg-blue-50 rounded-md">
            <h4 class="text-sm font-semibold mb-2">Amalan Terbaik Untuk Placeholder:</h4>
            <ul class="text-sm space-y-2 list-disc pl-5">
              <li>Gunakan placeholder hanya untuk memperjelas format input atau memberikan contoh ringkas.</li>
              <li>Pastikan placeholder ringkas (di bawah 40 aksara) dan bebas dari perkataan yang tidak perlu.</li>
              <li>Gunakan warna teks yang lebih ringan untuk placeholder (cth. #BDBDBD) untuk membezakannya dari input pengguna.</li>
              <li>Jangan gunakan placeholder sebagai pengganti label yang boleh dilihat.</li>
              <li>Jangan masukkan mesej pengesahan atau petunjuk ralat dalam placeholder.</li>
              <li>Jangan gunakan HURUF BESAR atau tanda baca yang berlebihan.</li>
              <li>Untuk medan dengan keperluan format tertentu, lengkapkan placeholder dengan ikon info dan tooltip untuk panduan tambahan.</li>
            </ul>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Save Draft & Autosave Section -->
    <rs-card class="mb-6">
      <template #header>
        <div class="flex items-center">
          <Icon name="ic:outline-save" class="mr-2" />
          Save Draft & Autosave
        </div>
      </template>
      <template #body>
        <p class="mb-4">The ability to save drafts and autosave is essential for user convenience and data integrity, especially in long forms. This ensures that users don't lose their work due to timeouts, network issues, or accidental navigation away from the page.</p>
        
        <div class="space-y-6">
          <!-- Sample Form with Save Draft -->
          <div>
            <h3 class="text-base font-semibold mb-4">Contoh Borang dengan Ciri Simpan Draf</h3>
            
            <div class="border rounded-md p-4 mb-6">
              <!-- Sample Form -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label class="block text-sm font-medium text-gray-600 mb-1">Nama Projek <span class="text-red-500">*</span></label>
                  <input
                    type="text"
                    value="Projek Bantuan Pendidikan 2023"
                    class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-600 mb-1">Ketua Projek <span class="text-red-500">*</span></label>
                  <input
                    type="text"
                    value="Ahmad bin Hassan"
                    class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-600 mb-1">Keterangan Projek</label>
                <textarea
                  class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 h-20"
                >Program bantuan pendidikan untuk anak-anak asnaf di kawasan Shah Alam.</textarea>
              </div>

              <!-- Autosave Toggle -->
              <div class="mb-6 flex items-center space-x-2">
                <label class="inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="autosaveEnabled" class="sr-only peer">
                  <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all peer-checked:bg-blue-600"></div>
                  <span class="ms-3 text-sm font-medium text-gray-700">Autosave</span>
                </label>
                <div class="text-sm text-gray-500" v-if="lastSaved">
                  Terakhir disimpan: {{ new Date(lastSaved).toLocaleTimeString() }}
                </div>
              </div>
              
              <!-- Status Messages -->
              <div v-if="draftSaved" class="p-3 mb-6 bg-green-50 border border-green-200 rounded-md text-green-700 text-sm flex items-center">
                <Icon name="ic:outline-check-circle" class="mr-2" />
                Draf disimpan secara automatik
              </div>
              
              <div v-if="failedToSave" class="p-3 mb-6 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm flex items-center">
                <Icon name="ic:outline-error" class="mr-2" />
                Gagal menyimpan draf. Sila cuba lagi.
              </div>
              
              <!-- Action Buttons -->
              <div class="flex justify-end space-x-3">
                <rs-button 
                  variant="secondary-outline" 
                  @click="saveDraft"
                  :disabled="savingDraft"
                >
                  <template v-if="savingDraft">
                    <span class="flex items-center">
                      <span class="w-4 h-4 mr-2 border-2 border-t-transparent border-blue-600 rounded-full animate-spin"></span>
                      Menyimpan...
                    </span>
                  </template>
                  <template v-else>
                    <Icon name="ic:outline-save" class="mr-1" />
                    Simpan Draf
                  </template>
                </rs-button>
                <rs-button variant="primary">Hantar</rs-button>
              </div>
            </div>
            
            <!-- Demo Controls -->
            <div class="flex space-x-4 mt-4">
              <rs-button variant="info" size="sm" @click="saveDraft">
                Simulasi Simpan Draf
              </rs-button>
              <rs-button variant="danger" size="sm" @click="simulateFailedSave">
                Simulasi Kegagalan Simpan
              </rs-button>
            </div>
          </div>
          
          <!-- Fixed Save Draft Button -->
          <div>
            <h3 class="text-base font-semibold mb-4">Butang Tetap di Bahagian Bawah</h3>
            
            <div class="border rounded-md p-4 relative">
              <p class="text-sm mb-2">Untuk borang yang panjang, kedudukan butang Simpan Draf harus tetap di bahagian bawah skrin untuk memastikan pengguna sentiasa dapat mencapainya tanpa perlu menatal ke bawah.</p>
              
              <div class="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-md">
                <div class="text-center py-6">Kandungan borang yang panjang</div>
              </div>
              
              <div class="mt-4 border border-blue-200 bg-blue-50 p-3 rounded-md flex items-center justify-between">
                <span class="text-sm text-blue-700">Butang Simpan Draf di bahagian bawah skrin</span>
                <rs-button size="sm" variant="primary-outline">
                  <Icon name="ic:outline-save" class="mr-1" />
                  Simpan Draf
                </rs-button>
              </div>
            </div>
          </div>
          
          <!-- Save Draft & Autosave Best Practices -->
          <div class="p-4 bg-blue-50 rounded-md">
            <h4 class="text-sm font-semibold mb-2">Amalan Terbaik Untuk Ciri Simpan Draf & Autosave:</h4>
            <ul class="text-sm space-y-2 list-disc pl-5">
              <li>Letakkan butang Simpan Draf di bahagian bawah-kanan borang yang panjang.</li>
              <li>Aktifkan autosave pada selang masa 30 saat atau ketika pengguna meniggalkan medan.</li>
              <li>Berikan notifikasi toast yang tidak mengganggu apabila draf disimpan secara automatik.</li>
              <li>Dalam kes kegagalan rangkaian, paparkan amaran dalaman untuk memberitahu pengguna.</li>
              <li>Sediakan cara untuk pengguna mengaktif atau menyahaktifkan ciri autosave.</li>
              <li>Pastikan pengguna tahu kapan maklumat terakhir disimpan dengan penunjuk masa/tarikh.</li>
              <li>Selalu berikan petunjuk visual semasa proses penyimpanan sedang berlaku (separator berputar).</li>
            </ul>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Selection Controls Section -->
    <rs-card class="mb-6">
      <template #header>
        <div class="flex items-center">
          <Icon name="ic:outline-toggle-on" class="mr-2" />
          Selection Controls: Radio Buttons, Checkboxes, and Dropdowns
        </div>
      </template>
      <template #body>
        <p class="mb-4">Choosing the correct selection control is critical for usability and clarity. Use radio buttons for single selection among a small set of options, checkboxes for multi-select scenarios, and dropdowns for single selection when there are many options.</p>
        
        <div class="space-y-8">
          <!-- Radio Buttons -->
          <div>
            <h3 class="text-base font-semibold mb-4">Radio Buttons (Butang Radio)</h3>
            <p class="text-sm mb-4">Gunakan untuk pemilihan tunggal daripada set pilihan yang kecil dan dapat dilihat (idealnya 2-5 pilihan).</p>
            
            <!-- Basic Radio Buttons -->
            <div class="mb-6 p-4 border rounded-md">
              <h4 class="text-sm font-medium mb-3">Contoh Radio Button Asas</h4>
              
              <fieldset>
                <legend class="text-sm font-semibold mb-2">Jenis Bantuan:</legend>
                <div class="space-y-2">
                  <label class="flex items-center">
                    <input type="radio" name="jenisBantuan" value="pendidikan" class="mr-2" checked />
                    <span>Bantuan Pendidikan</span>
                  </label>
                  <label class="flex items-center">
                    <input type="radio" name="jenisBantuan" value="perubatan" class="mr-2" />
                    <span>Bantuan Perubatan</span>
                  </label>
                  <label class="flex items-center">
                    <input type="radio" name="jenisBantuan" value="rumah" class="mr-2" />
                    <span>Bantuan Rumah</span>
                  </label>
                  <label class="flex items-center">
                    <input type="radio" name="jenisBantuan" value="sarahidup" class="mr-2" />
                    <span>Bantuan Sara Hidup</span>
                  </label>
                </div>
              </fieldset>
            </div>
            
            <!-- Horizontal Radio Buttons -->
            <div class="mb-6 p-4 border rounded-md">
              <h4 class="text-sm font-medium mb-3">Radio Button Mendatar (Untuk Pilihan Lebih Pendek)</h4>
              
              <fieldset>
                <legend class="text-sm font-semibold mb-2">Jantina:</legend>
                <div class="flex space-x-6">
                  <label class="flex items-center">
                    <input type="radio" name="jantina" value="lelaki" class="mr-2" checked />
                    <span>Lelaki</span>
                  </label>
                  <label class="flex items-center">
                    <input type="radio" name="jantina" value="perempuan" class="mr-2" />
                    <span>Perempuan</span>
                  </label>
                </div>
              </fieldset>
            </div>
            
            <!-- Radio Buttons with Long Text -->
            <div class="mb-6 p-4 border rounded-md">
              <h4 class="text-sm font-medium mb-3">Radio Button dengan Teks Panjang</h4>
              
              <fieldset>
                <legend class="text-sm font-semibold mb-2">Jenis Permohonan:</legend>
                <div class="space-y-4">
                  <label class="flex items-start">
                    <input type="radio" name="jenisPermohonan" value="monthly" class="mr-2 mt-1" checked />
                    <span class="text-sm">{{ longContentRadioOptions[0].label }}</span>
                  </label>
                  <label class="flex items-start">
                    <input type="radio" name="jenisPermohonan" value="one_time" class="mr-2 mt-1" />
                    <span class="text-sm">{{ longContentRadioOptions[1].label }}</span>
                  </label>
                  <label class="flex items-start">
                    <input type="radio" name="jenisPermohonan" value="staged" class="mr-2 mt-1" />
                    <span class="text-sm">{{ longContentRadioOptions[2].label }}</span>
                  </label>
                </div>
              </fieldset>
            </div>
          </div>
          
          <!-- Checkboxes -->
          <div>
            <h3 class="text-base font-semibold mb-4">Checkboxes (Kotak Semak)</h3>
            <p class="text-sm mb-4">Gunakan untuk senario multi-pilih, di mana pengguna boleh memilih beberapa pilihan, atau untuk togol boolean (on/off).</p>
            
            <!-- Basic Checkboxes -->
            <div class="mb-6 p-4 border rounded-md">
              <h4 class="text-sm font-medium mb-3">Contoh Checkbox Asas</h4>
              
              <fieldset>
                <legend class="text-sm font-semibold mb-2">Minat (Pilih semua yang berkenaan):</legend>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <label class="flex items-center">
                    <input type="checkbox" value="news" class="mr-2" checked />
                    <span>Berita dan Kemaskini</span>
                  </label>
                  <label class="flex items-center">
                    <input type="checkbox" value="volunteer" class="mr-2" />
                    <span>Aktiviti Sukarelawan</span>
                  </label>
                  <label class="flex items-center">
                    <input type="checkbox" value="education" class="mr-2" checked />
                    <span>Bantuan Pendidikan</span>
                  </label>
                  <label class="flex items-center">
                    <input type="checkbox" value="medical" class="mr-2" />
                    <span>Bantuan Perubatan</span>
                  </label>
                  <label class="flex items-center">
                    <input type="checkbox" value="living_expenses" class="mr-2" />
                    <span>Bantuan Sara Hidup</span>
                  </label>
                  <label class="flex items-center">
                    <input type="checkbox" value="business" class="mr-2" />
                    <span>Bantuan Perniagaan</span>
                  </label>
                </div>
              </fieldset>
            </div>
            
            <!-- Toggle Checkbox (Boolean) -->
            <div class="mb-6 p-4 border rounded-md">
              <h4 class="text-sm font-medium mb-3">Checkbox Togol (Boolean)</h4>
              
              <div class="space-y-4">
                <label class="flex items-center">
                  <input type="checkbox" class="mr-2" checked />
                  <span>Tunjuk semua rekod</span>
                </label>
                
                <label class="flex items-center">
                  <input type="checkbox" class="mr-2" />
                  <span>Terima notifikasi emel</span>
                </label>
                
                <label class="inline-flex items-center cursor-pointer">
                  <input type="checkbox" value="" class="sr-only peer" checked>
                  <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all peer-checked:bg-blue-600"></div>
                  <span class="ms-3 text-sm font-medium text-gray-700">Toggle switch</span>
                </label>
              </div>
            </div>
            
            <!-- Checkbox with Select All Option -->
            <div class="mb-6 p-4 border rounded-md">
              <h4 class="text-sm font-medium mb-3">Checkbox dengan Pilihan "Pilih Semua"</h4>
              
              <fieldset>
                <legend class="text-sm font-semibold mb-2">Dokumen Sokongan:</legend>
                
                <div class="mb-2 border-b pb-2">
                  <label class="flex items-center font-medium">
                    <input type="checkbox" class="mr-2" />
                    <span>Pilih Semua</span>
                  </label>
                </div>
                
                <div class="space-y-2 ml-6">
                  <label class="flex items-center">
                    <input type="checkbox" value="ic" class="mr-2" checked />
                    <span>Salinan Kad Pengenalan</span>
                  </label>
                  <label class="flex items-center">
                    <input type="checkbox" value="bank_statement" class="mr-2" />
                    <span>Penyata Bank (3 bulan terkini)</span>
                  </label>
                  <label class="flex items-center">
                    <input type="checkbox" value="salary_slip" class="mr-2" checked />
                    <span>Slip Gaji (3 bulan terkini)</span>
                  </label>
                  <label class="flex items-center">
                    <input type="checkbox" value="utility_bill" class="mr-2" />
                    <span>Bil Utiliti</span>
                  </label>
                </div>
              </fieldset>
            </div>
          </div>
          
          <!-- Dropdowns -->
          <div>
            <h3 class="text-base font-semibold mb-4">Dropdowns (Menu Pilihan)</h3>
            <p class="text-sm mb-4">Gunakan untuk pemilihan tunggal apabila terdapat lebih daripada 5 pilihan, atau apabila ruang terhad.</p>
            
            <!-- Basic Dropdown -->
            <div class="mb-6 p-4 border rounded-md">
              <h4 class="text-sm font-medium mb-3">Contoh Dropdown Asas</h4>
              
              <div>
                <label class="block text-sm font-semibold mb-2">Negeri:</label>
                <select class="w-full border rounded-md p-2">
                  <option value="" disabled selected>Pilih negeri</option>
                  <option v-for="option in stateOptions" :key="option.value" :value="option.value">
                    {{ option.label }}
                  </option>
                </select>
              </div>
            </div>
            
            <!-- Dropdown with Optgroups -->
            <div class="mb-6 p-4 border rounded-md">
              <h4 class="text-sm font-medium mb-3">Dropdown dengan Kumpulan Pilihan</h4>
              
              <div>
                <label class="block text-sm font-semibold mb-2">Kategori Zakat:</label>
                <select class="w-full border rounded-md p-2">
                  <option value="" disabled selected>Pilih kategori</option>
                  <optgroup label="Zakat Pendapatan">
                    <option value="gaji">Gaji</option>
                    <option value="bonus">Bonus</option>
                    <option value="komisen">Komisen</option>
                  </optgroup>
                  <optgroup label="Zakat Perniagaan">
                    <option value="perniagaan_individu">Perniagaan Individu</option>
                    <option value="perniagaan_syarikat">Perniagaan Syarikat</option>
                  </optgroup>
                  <optgroup label="Zakat Harta">
                    <option value="emas">Emas</option>
                    <option value="perak">Perak</option>
                    <option value="simpanan">Simpanan</option>
                    <option value="saham">Saham</option>
                  </optgroup>
                </select>
              </div>
            </div>
            
            <!-- Searchable Dropdown (Placeholder for Vue Select) -->
            <div class="mb-6 p-4 border rounded-md">
              <h4 class="text-sm font-medium mb-3">Dropdown Boleh Cari</h4>
              
              <div class="mb-2">
                <label class="block text-sm font-semibold mb-2">Carian dengan V-Select (component placeholder):</label>
                <div class="border rounded-md p-3 bg-gray-50 text-sm">
                  <p>Untuk set data yang besar, gunakan komponen dropdown boleh cari seperti Vue Select (v-select)</p>
                  <p class="mt-2 text-blue-600">Contoh: &lt;v-select :options="stateOptions" placeholder="Pilih negeri"&gt;&lt;/v-select&gt;</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Selection Control Best Practices -->
          <div class="p-4 bg-blue-50 rounded-md">
            <h4 class="text-sm font-semibold mb-2">Amalan Terbaik Untuk Kawalan Pemilihan:</h4>
            <ul class="text-sm space-y-2 list-disc pl-5">
              <li><strong>Radio Buttons:</strong> Gunakan untuk pemilihan tunggal dari set yang kecil dan terlihat (2-5 pilihan).</li>
              <li><strong>Checkboxes:</strong> Gunakan untuk pemilihan berganda atau nilai boolean (on/off).</li>
              <li><strong>Dropdowns:</strong> Gunakan untuk pemilihan tunggal dengan banyak pilihan (>5) atau ruang terhad.</li>
              <li>Jangan nyahaktifkan pilihan melainkan sangat perlu; sebaliknya, terangkan mengapa pilihan tidak tersedia.</li>
              <li>Pastikan semua kawalan boleh diakses sepenuhnya melalui papan kekunci (Tab, Arrow keys, Space/Enter).</li>
              <li>Berikan tanda yang jelas untuk keadaan dipilih dengan kontras yang cukup.</li>
              <li>Untuk senarai panjang, pertimbangkan untuk mengelompokkan pilihan dengan subheading atau pemisah.</li>
            </ul>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Navigation Components Section -->
    <rs-card class="mb-6">
      <template #header>
        <div class="flex items-center">
          <Icon name="ic:outline-navigation" class="mr-2" />
          Navigation Components
        </div>
      </template>
      <template #body>
        <p class="mb-4">Navigation components help users move through the application efficiently.</p>
        
        <!-- Breadcrumbs Example -->
        <div class="mb-6">
          <h3 class="text-base font-semibold mb-2">Breadcrumbs</h3>
          <nav aria-label="breadcrumb" class="bg-gray-100 p-2 rounded-md">
            <ol class="flex items-center space-x-2 text-sm">
              <li><a href="#" class="text-blue-600 hover:underline">Home</a></li>
              <li class="flex items-center">
                <Icon name="ic:outline-keyboard-arrow-right" class="mx-1" />
                <a href="#" class="text-blue-600 hover:underline">Users</a>
              </li>
              <li class="flex items-center">
                <Icon name="ic:outline-keyboard-arrow-right" class="mx-1" />
                <span class="text-gray-600">Edit User</span>
              </li>
            </ol>
          </nav>
        </div>
        
        <!-- Pagination Example -->
        <div class="mb-6">
          <h3 class="text-base font-semibold mb-2">Pagination</h3>
          <div class="flex items-center justify-center">
            <nav class="inline-flex rounded-md shadow-sm">
              <a href="#" class="px-3 py-2 border border-gray-300 bg-white text-sm font-medium rounded-l-md hover:bg-gray-50">
                <Icon name="ic:outline-chevron-left" />
              </a>
              <a href="#" class="px-3 py-2 border-t border-b border-gray-300 bg-white text-sm font-medium hover:bg-gray-50">1</a>
              <a href="#" class="px-3 py-2 border-t border-b border-gray-300 bg-blue-50 text-blue-600 text-sm font-medium">2</a>
              <a href="#" class="px-3 py-2 border-t border-b border-gray-300 bg-white text-sm font-medium hover:bg-gray-50">3</a>
              <a href="#" class="px-3 py-2 border border-gray-300 bg-white text-sm font-medium rounded-r-md hover:bg-gray-50">
                <Icon name="ic:outline-chevron-right" />
              </a>
            </nav>
          </div>
        </div>
        
        <!-- Wizard Example -->
        <div>
          <h3 class="text-base font-semibold mb-2">Wizard Navigation</h3>
          <div class="mb-4">
            <!-- Step indicators -->
            <div class="mb-10">
              <div class="flex justify-between items-center w-full mb-8">
                <div class="flex flex-col items-center">
                  <div class="rounded-full h-10 w-10 flex items-center justify-center bg-blue-600 text-white text-sm font-medium">
                    1
                  </div>
                  <div class="mt-2 text-xs font-medium text-blue-600">
                    Maklumat
                  </div>
                </div>
                
                <div class="flex-grow h-px bg-blue-600 mx-2"></div>
                
                <div class="flex flex-col items-center">
                  <div class="rounded-full h-10 w-10 flex items-center justify-center bg-blue-600 text-white text-sm font-medium">
                    2
                  </div>
                  <div class="mt-2 text-xs font-medium text-blue-600">
                    Maklumat
                  </div>
                </div>
                
                <div class="flex-grow h-px bg-gray-300 mx-2"></div>
                
                <div class="flex flex-col items-center">
                  <div class="rounded-full h-10 w-10 flex items-center justify-center bg-gray-300 text-gray-600 text-sm font-medium">
                    3
                  </div>
                  <div class="mt-2 text-xs font-medium text-gray-600">
                    Pengiraan
                  </div>
                </div>
                
                <div class="flex-grow h-px bg-gray-300 mx-2"></div>
                
                <div class="flex flex-col items-center">
                  <div class="rounded-full h-10 w-10 flex items-center justify-center bg-gray-300 text-gray-600 text-sm font-medium">
                    4
                  </div>
                  <div class="mt-2 text-xs font-medium text-gray-600">
                    Pembayaran
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Step content -->
            <div class="p-6 border rounded-md">
              <h3 class="font-semibold text-lg mb-4">Step 2: Contact Information</h3>
              
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium mb-1">Email Address <span class="text-red-500">*</span></label>
                  <input type="email" class="w-full border border-gray-300 rounded-md p-2" />
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1">Phone Number <span class="text-red-500">*</span></label>
                  <input type="tel" class="w-full border border-gray-300 rounded-md p-2" />
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1">Address <span class="text-red-500">*</span></label>
                  <textarea class="w-full border border-gray-300 rounded-md p-2" rows="3"></textarea>
                </div>
              </div>
              
              <div class="flex justify-between mt-6">
                <rs-button variant="secondary-outline">Previous</rs-button>
                <rs-button variant="primary">Next</rs-button>
              </div>
            </div>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Icons Usage Section -->
    <rs-card class="mb-6">
      <template #header>
        <div class="flex items-center">
          <Icon name="ph:shapes" class="mr-2" />
          Icons Usage and Best Practices
        </div>
      </template>
      <template #body>
        <p class="mb-4">Icons enhance clarity and speed of recognition for common actions. Use the Material Icons or Phosphor Icons (ph:) sets available in the codebase.</p>

        <!-- Standard Icons -->
        <h3 class="text-base font-semibold mb-4">Standard Icon Set</h3>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          <!-- Common Action Icons -->
          <div class="p-4 border rounded-md flex flex-col items-center">
            <Icon name="material-symbols:edit" size="24" class="mb-2" />
            <div class="text-sm font-medium">Edit</div>
            <div class="text-xs text-gray-500">material-symbols:edit</div>
          </div>
          <div class="p-4 border rounded-md flex flex-col items-center">
            <Icon name="ph:pencil" size="24" class="mb-2" />
            <div class="text-sm font-medium">Edit (Alternative)</div>
            <div class="text-xs text-gray-500">ph:pencil</div>
          </div>
          <div class="p-4 border rounded-md flex flex-col items-center">
            <Icon name="material-symbols:delete" size="24" class="mb-2" />
            <div class="text-sm font-medium">Delete</div>
            <div class="text-xs text-gray-500">material-symbols:delete</div>
          </div>
          <div class="p-4 border rounded-md flex flex-col items-center">
            <Icon name="ph:trash" size="24" class="mb-2" />
            <div class="text-sm font-medium">Delete (Alternative)</div>
            <div class="text-xs text-gray-500">ph:trash</div>
          </div>
          <div class="p-4 border rounded-md flex flex-col items-center">
            <Icon name="material-symbols:visibility" size="24" class="mb-2" />
            <div class="text-sm font-medium">View</div>
            <div class="text-xs text-gray-500">material-symbols:visibility</div>
          </div>
          <div class="p-4 border rounded-md flex flex-col items-center">
            <Icon name="ph:eye" size="24" class="mb-2" />
            <div class="text-sm font-medium">View (Alternative)</div>
            <div class="text-xs text-gray-500">ph:eye</div>
          </div>
          <div class="p-4 border rounded-md flex flex-col items-center">
            <Icon name="material-symbols:add" size="24" class="mb-2" />
            <div class="text-sm font-medium">Add</div>
            <div class="text-xs text-gray-500">material-symbols:add</div>
          </div>
          <div class="p-4 border rounded-md flex flex-col items-center">
            <Icon name="ph:plus" size="24" class="mb-2" />
            <div class="text-sm font-medium">Add (Alternative)</div>
            <div class="text-xs text-gray-500">ph:plus</div>
          </div>
          <div class="p-4 border rounded-md flex flex-col items-center">
            <Icon name="material-symbols:key" size="24" class="mb-2" />
            <div class="text-sm font-medium">Reset Password</div>
            <div class="text-xs text-gray-500">material-symbols:key</div>
          </div>
          <div class="p-4 border rounded-md flex flex-col items-center">
            <Icon name="material-symbols:search" size="24" class="mb-2" />
            <div class="text-sm font-medium">Search</div>
            <div class="text-xs text-gray-500">material-symbols:search</div>
          </div>
          <div class="p-4 border rounded-md flex flex-col items-center">
            <Icon name="material-symbols:check" size="24" class="mb-2" />
            <div class="text-sm font-medium">Approve/Complete</div>
            <div class="text-xs text-gray-500">material-symbols:check</div>
          </div>
          <div class="p-4 border rounded-md flex flex-col items-center">
            <Icon name="material-symbols:close" size="24" class="mb-2" />
            <div class="text-sm font-medium">Cancel/Close</div>
            <div class="text-xs text-gray-500">material-symbols:close</div>
          </div>
        </div>

        <!-- Navigation Icons -->
        <h3 class="text-base font-semibold mb-4">Navigation Icons</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div class="p-4 border rounded-md flex flex-col items-center">
            <Icon name="ph:arrow-up" size="24" class="mb-2" />
            <div class="text-sm font-medium">Arrow Up</div>
            <div class="text-xs text-gray-500">ph:arrow-up</div>
          </div>
          <div class="p-4 border rounded-md flex flex-col items-center">
            <Icon name="ph:arrow-down" size="24" class="mb-2" />
            <div class="text-sm font-medium">Arrow Down</div>
            <div class="text-xs text-gray-500">ph:arrow-down</div>
          </div>
          <div class="p-4 border rounded-md flex flex-col items-center">
            <Icon name="ph:arrow-left" size="24" class="mb-2" />
            <div class="text-sm font-medium">Arrow Left</div>
            <div class="text-xs text-gray-500">ph:arrow-left</div>
          </div>
          <div class="p-4 border rounded-md flex flex-col items-center">
            <Icon name="ph:arrow-right" size="24" class="mb-2" />
            <div class="text-sm font-medium">Arrow Right</div>
            <div class="text-xs text-gray-500">ph:arrow-right</div>
          </div>
        </div>

        <!-- Icon Placement Examples -->
        <h3 class="text-base font-semibold mb-4">Icon Placement in Buttons</h3>
        <div class="space-y-6">
          <!-- Left-aligned Icons in Buttons -->
          <div class="mb-6">
            <h4 class="text-sm font-medium mb-3">Left-aligned Icons (Standard)</h4>
            <div class="flex flex-wrap gap-3">
              <rs-button variant="primary">
                <Icon name="material-symbols:add" class="mr-1" /> Add User
              </rs-button>
              <rs-button variant="info">
                <Icon name="material-symbols:edit" class="mr-1" /> Edit
              </rs-button>
              <rs-button variant="danger">
                <Icon name="ph:trash" class="mr-1" /> Delete
              </rs-button>
              <rs-button variant="success">
                <Icon name="material-symbols:check" class="mr-1" /> Approve
              </rs-button>
            </div>
          </div>

          <!-- Icon-only Buttons with Tooltips -->
          <div class="mb-6">
            <h4 class="text-sm font-medium mb-3">Icon-only Buttons with Tooltips</h4>
            <div class="flex flex-wrap gap-3">
              <!-- Edit button with tooltip -->
              <div class="relative" @mouseenter="tooltips['iconEdit'] = true" @mouseleave="tooltips['iconEdit'] = false">
                <rs-button variant="info-text" class="p-1 w-8 h-8" aria-label="Edit user">
                  <Icon name="material-symbols:edit" size="18" />
                </rs-button>
                <transition name="tooltip">
                  <span v-if="tooltips['iconEdit']" class="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 z-10">
                    Edit
                  </span>
                </transition>
              </div>

              <!-- View button with tooltip -->
              <div class="relative" @mouseenter="tooltips['iconView'] = true" @mouseleave="tooltips['iconView'] = false">
                <rs-button variant="primary-text" class="p-1 w-8 h-8" aria-label="View details">
                  <Icon name="ph:eye" size="18" />
                </rs-button>
                <transition name="tooltip">
                  <span v-if="tooltips['iconView']" class="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 z-10">
                    View
                  </span>
                </transition>
              </div>

              <!-- Reset password button with tooltip -->
              <div class="relative" @mouseenter="tooltips['iconReset'] = true" @mouseleave="tooltips['iconReset'] = false">
                <rs-button variant="warning-text" class="p-1 w-8 h-8" aria-label="Reset password">
                  <Icon name="material-symbols:key" size="18" />
                </rs-button>
                <transition name="tooltip">
                  <span v-if="tooltips['iconReset']" class="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 z-10">
                    Reset Password
                  </span>
                </transition>
              </div>

              <!-- Delete button with tooltip (destructive action) -->
              <div class="relative" @mouseenter="tooltips['iconDelete'] = true" @mouseleave="tooltips['iconDelete'] = false">
                <rs-button variant="danger-text" class="p-1 w-8 h-8" aria-label="Delete user">
                  <Icon name="ph:trash" size="18" class="text-red-600" />
                </rs-button>
                <transition name="tooltip">
                  <span v-if="tooltips['iconDelete']" class="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 z-10">
                    Delete
                  </span>
                </transition>
              </div>
            </div>
          </div>
        </div>

        <!-- Icon in Dropdown Example -->
        <h3 class="text-base font-semibold mb-4">Icons in Dropdown Menu</h3>
        <div class="mb-6">
          <rs-dropdown text="Actions" variant="secondary">
            <rs-dropdown-item>
              <Icon name="ph:eye" class="mr-2" /> View Details
            </rs-dropdown-item>
            <rs-dropdown-item>
              <Icon name="ph:pencil" class="mr-2" /> Edit User
            </rs-dropdown-item>
            <rs-dropdown-item>
              <Icon name="ph:key" class="mr-2" /> Reset Password
            </rs-dropdown-item>
            <rs-dropdown-item>
              <Icon name="ph:plus" class="mr-2" /> Add Field
            </rs-dropdown-item>
            <rs-dropdown-item>
              <Icon name="ph:arrow-up" class="mr-2" /> Move Up
            </rs-dropdown-item>
            <rs-dropdown-item>
              <Icon name="ph:arrow-down" class="mr-2" /> Move Down
            </rs-dropdown-item>
            <rs-dropdown-item>
              <Icon name="ph:trash" class="mr-2 text-red-600" /> Delete User
            </rs-dropdown-item>
          </rs-dropdown>
        </div>

        <!-- Table with Icon Actions -->
        <h3 class="text-base font-semibold mb-4">Table Row Actions with Icons</h3>
        <div class="overflow-x-auto mb-6">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">USR-001</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Ahmad bin Hassan</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">ahmad@example.com</td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex justify-end space-x-2">
                    <div class="relative" @mouseenter="tooltips['rowView'] = true" @mouseleave="tooltips['rowView'] = false">
                      <button class="text-blue-600 hover:text-blue-900" aria-label="View details">
                        <Icon name="ph:eye" size="18" />
                      </button>
                      <transition name="tooltip">
                        <span v-if="tooltips['rowView']" class="absolute bottom-full mb-2 right-0 bg-gray-800 text-white text-xs rounded py-1 px-2 z-10">
                          View
                        </span>
                      </transition>
                    </div>
                    <div class="relative" @mouseenter="tooltips['rowEdit'] = true" @mouseleave="tooltips['rowEdit'] = false">
                      <button class="text-indigo-600 hover:text-indigo-900" aria-label="Edit user">
                        <Icon name="ph:pencil" size="18" />
                      </button>
                      <transition name="tooltip">
                        <span v-if="tooltips['rowEdit']" class="absolute bottom-full mb-2 right-0 bg-gray-800 text-white text-xs rounded py-1 px-2 z-10">
                          Edit
                        </span>
                      </transition>
                    </div>
                    <div class="relative" @mouseenter="tooltips['rowKey'] = true" @mouseleave="tooltips['rowKey'] = false">
                      <button class="text-yellow-600 hover:text-yellow-900" aria-label="Reset password">
                        <Icon name="ph:key" size="18" />
                      </button>
                      <transition name="tooltip">
                        <span v-if="tooltips['rowKey']" class="absolute bottom-full mb-2 right-0 bg-gray-800 text-white text-xs rounded py-1 px-2 z-10">
                          Reset Password
                        </span>
                      </transition>
                    </div>
                    <div class="relative" @mouseenter="tooltips['rowDelete'] = true" @mouseleave="tooltips['rowDelete'] = false">
                      <button class="text-red-600 hover:text-red-900" aria-label="Delete user">
                        <Icon name="ph:trash" size="18" />
                      </button>
                      <transition name="tooltip">
                        <span v-if="tooltips['rowDelete']" class="absolute bottom-full mb-2 right-0 bg-gray-800 text-white text-xs rounded py-1 px-2 z-10">
                          Delete
                        </span>
                      </transition>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Icon Best Practices -->
        <div class="p-4 bg-blue-50 rounded-md">
          <h4 class="text-sm font-semibold mb-2">Icon Best Practices:</h4>
          <ul class="text-sm space-y-2 list-disc pl-5">
            <li><strong>Icon + Text:</strong> Always pair icons with text unless the action is universally understood (e.g., trash for delete).</li>
            <li><strong>Icon-only buttons:</strong> Always include a tooltip and an accessible aria-label.</li>
            <li><strong>Placement:</strong> Place icons to the left of text in buttons.</li>
            <li><strong>Size:</strong> Use consistent sizing - 16-18px for buttons in tables/toolbars, 20-24px for larger buttons and cards/headers.</li>
            <li><strong>Color:</strong> Use red for destructive actions, gray/muted for disabled states.</li>
            <li><strong>Accessibility:</strong> Never rely on color alone to convey meaning. Always include text or tooltips.</li>
          </ul>
          <div class="mt-4 text-center">
            <a href="https://icones.js.org/" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline inline-flex items-center">
              <Icon name="ph:link" class="mr-1" /> View Complete Icon Library
              <Icon name="ph:arrow-up-right" class="ml-1" size="14" />
            </a>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Wizard Component Section -->
    <rs-card class="mb-6">
      <template #header>
        <div class="flex items-center">
          <Icon name="ph:steps" class="mr-2" />
          Wizard Component
        </div>
      </template>
      <template #body>
        <p class="mb-4">Wizard components guide users through complex multi-step processes, showing clear progress and allowing navigation between steps.</p>
        
        <!-- Wizard Example -->
        <div class="mb-6 p-4 border rounded-md">
          <h3 class="text-base font-semibold mb-4">Multi-Step Form Wizard</h3>
          
          <!-- Wizard Step Indicators -->
          <div class="mb-10">
            <div class="flex justify-between items-center w-full mb-8">
              <div class="flex flex-col items-center">
                <div class="rounded-full h-10 w-10 flex items-center justify-center bg-blue-600 text-white text-sm font-medium">
                  1
                </div>
                <div class="mt-2 text-xs font-medium text-blue-600">
                  Maklumat
                </div>
              </div>
              
              <div class="flex-grow h-px bg-blue-600 mx-2"></div>
              
              <div class="flex flex-col items-center">
                <div class="rounded-full h-10 w-10 flex items-center justify-center bg-blue-600 text-white text-sm font-medium">
                  2
                </div>
                <div class="mt-2 text-xs font-medium text-blue-600">
                  Maklumat
                </div>
              </div>
              
              <div class="flex-grow h-px bg-gray-300 mx-2"></div>
              
              <div class="flex flex-col items-center">
                <div class="rounded-full h-10 w-10 flex items-center justify-center bg-gray-300 text-gray-600 text-sm font-medium">
                  3
                </div>
                <div class="mt-2 text-xs font-medium text-gray-600">
                  Pengiraan
                </div>
              </div>
              
              <div class="flex-grow h-px bg-gray-300 mx-2"></div>
              
              <div class="flex flex-col items-center">
                <div class="rounded-full h-10 w-10 flex items-center justify-center bg-gray-300 text-gray-600 text-sm font-medium">
                  4
                </div>
                <div class="mt-2 text-xs font-medium text-gray-600">
                  Pembayaran
                </div>
              </div>
            </div>
          </div>
          
          <!-- Current Step Content (Step 2) -->
          <div class="mb-6 border rounded-md p-6">
            <h3 class="text-lg font-semibold mb-4">Langkah 2: Maklumat Pendapatan</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium mb-1">Jumlah Gaji Bulanan (RM) <span class="text-red-500">*</span></label>
                <input type="number" class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Contoh: 5000" />
                <p class="mt-1 text-sm text-gray-500">Jumlah gaji kasar sebelum potongan</p>
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">Bonus Tahunan (RM)</label>
                <input type="number" class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Contoh: 10000" />
              </div>
              <div>
                <label class="block text-sm font-medium mb-1">Pendapatan Lain (RM)</label>
                <input type="number" class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Contoh: 2000" />
                <p class="mt-1 text-sm text-gray-500">Termasuk pendapatan sewaan, dividen, dll.</p>
              </div>

              <div class="pt-2">
                <label class="block text-sm font-medium mb-1">Potongan Bulanan (RM)</label>
                <div class="space-y-3 pl-2 mt-3 border-l-2 border-gray-200">
                  <div>
                    <label class="block text-sm font-medium mb-1">KWSP/EPF (RM)</label>
                    <input type="number" class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Contoh: 550" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium mb-1">Insurans Perubatan (RM)</label>
                    <input type="number" class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Contoh: 200" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Wizard Navigation -->
          <div class="flex justify-between">
            <rs-button variant="secondary-outline">
              <Icon name="ph:arrow-left" class="mr-1" /> Sebelumnya
            </rs-button>
            <rs-button variant="primary">
              Seterusnya <Icon name="ph:arrow-right" class="ml-1" />
            </rs-button>
          </div>
        </div>
        
        <!-- Wizard Implementation Notes -->
        <div class="border rounded-md p-4 bg-blue-50">
          <h4 class="text-sm font-semibold mb-2">Amalan Terbaik Wizard</h4>
          <ul class="text-sm space-y-2 list-disc pl-5">
            <li>Gunakan komponen <code>&lt;rs-wizard&gt;</code> untuk borang berbilang langkah yang memerlukan penyelesaian berurutan.</li>
            <li>Sediakan penunjuk kemajuan visual yang jelas menunjukkan langkah yang selesai, semasa, dan akan datang.</li>
            <li>Pastikan navigasi papan kekunci dengan Tab, Enter/Space untuk maju, dan kekunci anak panah untuk langkah.</li>
            <li>Sahkan setiap langkah sebelum membenarkan kemajuan atau tunjukkan ralat pengesahan.</li>
            <li>Kekalkan keadaan borang antara langkah dan benarkan navigasi ke langkah yang telah selesai.</li>
            <li>Sediakan butang navigasi jelas pada kedudukan konsisten (Sebelumnya/Seterusnya).</li>
            <li>Tunjukkan medan yang diperlukan pada setiap langkah dengan tanda bintang dan berikan ringkasan ralat.</li>
          </ul>
        </div>
        
        <!-- Wizard Accessibility Features -->
        <div class="mt-4">
          <h3 class="text-base font-semibold mb-3">Ciri-ciri Kebolehcapaian</h3>
          <ul class="text-sm space-y-2 list-disc pl-5">
            <li>Peranan ARIA dan penanda mengenal pasti struktur wizard (<code>role="region"</code> dengan <code>aria-labelledby</code>).</li>
            <li>Pengurusan fokus memastikan input pertama dalam setiap langkah menerima fokus semasa navigasi.</li>
            <li>Penunjuk langkah menggunakan atribut ARIA yang sesuai (<code>aria-current</code>, <code>aria-label</code>).</li>
            <li>Pemberitahuan ralat menggunakan kawasan <code>aria-live</code> untuk pengumuman pembaca skrin.</li>
            <li>Semua elemen interaktif dapat dikendalikan dengan papan kekunci dengan penunjuk fokus yang jelas.</li>
          </ul>
        </div>
      </template>
    </rs-card>

    <!-- Accordion Component Section -->
    <rs-card class="mb-6">
      <template #header>
        <div class="flex items-center">
          <Icon name="ph:stack" class="mr-2" />
          Accordion Component
        </div>
      </template>
      <template #body>
        <p class="mb-4">Accordions provide a way to organize and present content in a limited space, expanding and collapsing sections as needed.</p>
        
        <!-- Basic Accordion Example -->
        <div class="mb-6">
          <h3 class="text-base font-semibold mb-4">Basic Accordion</h3>
          
          <rs-collapse>
            <rs-collapse-item title="Personal Information">
              <div class="p-4 space-y-4">
                <div>
                  <label class="block text-sm font-medium mb-1">Full Name <span class="text-red-500">*</span></label>
                  <input type="text" class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1">IC Number <span class="text-red-500">*</span></label>
                  <input type="text" class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g., 901231-14-5566" />
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1">Date of Birth <span class="text-red-500">*</span></label>
                  <input type="date" class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
            </rs-collapse-item>
            
            <rs-collapse-item title="Contact Details">
              <div class="p-4 space-y-4">
                <div>
                  <label class="block text-sm font-medium mb-1">Email Address <span class="text-red-500">*</span></label>
                  <input type="email" class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1">Phone Number <span class="text-red-500">*</span></label>
                  <input type="tel" class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
            </rs-collapse-item>
            
            <rs-collapse-item title="Address Information">
              <div class="p-4 space-y-4">
                <div>
                  <label class="block text-sm font-medium mb-1">Street Address <span class="text-red-500">*</span></label>
                  <input type="text" class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label class="block text-sm font-medium mb-1">City <span class="text-red-500">*</span></label>
                    <input type="text" class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium mb-1">Postal Code <span class="text-red-500">*</span></label>
                    <input type="text" class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium mb-1">State <span class="text-red-500">*</span></label>
                    <select class="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="" disabled selected>Select state</option>
                      <option value="selangor">Selangor</option>
                      <option value="kl">Kuala Lumpur</option>
                      <option value="penang">Pulau Pinang</option>
                      <option value="johor">Johor</option>
                    </select>
                  </div>
                </div>
              </div>
            </rs-collapse-item>
            
            <rs-collapse-item title="Supporting Documents">
              <div class="p-4 space-y-4">
                <div>
                  <label class="block text-sm font-medium mb-3">Identity Card (Front & Back) <span class="text-red-500">*</span></label>
                  <div class="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                    <Icon name="ph:upload-simple" size="36" class="text-gray-400 mx-auto mb-2" />
                    <p class="text-sm text-gray-500 mb-1">Drag and drop files here, or click to browse</p>
                    <p class="text-xs text-gray-400">Supported formats: JPG, PNG, PDF (Max 2MB)</p>
                  </div>
                </div>
              </div>
            </rs-collapse-item>
          </rs-collapse>
        </div>
        
        <!-- Form Action Buttons -->
        <div class="flex justify-end space-x-3 mt-4">
          <rs-button variant="secondary-outline">Cancel</rs-button>
          <rs-button variant="primary">Submit Application</rs-button>
        </div>
        
        <!-- Accordion Best Practices -->
        <div class="mt-6 border rounded-md p-4 bg-blue-50">
          <h4 class="text-sm font-semibold mb-2">Accordion Best Practices</h4>
          <ul class="text-sm space-y-2 list-disc pl-5">
            <li>Use accordions for long forms to reduce cognitive load by breaking content into manageable sections.</li>
            <li>Single-section expansion is preferred for clarity (only one accordion item open at a time).</li>
            <li>Ensure each section header clearly describes its contents.</li>
            <li>Add visual indicators showing completion status of each section (optional).</li>
            <li>Keep important actions (e.g., Submit button) outside the accordion for visibility.</li>
            <li>Group related fields logically within each accordion section.</li>
          </ul>
        </div>
        
        <!-- Accordion Accessibility Features -->
        <div class="mt-4">
          <h3 class="text-base font-semibold mb-3">Accessibility Features</h3>
          <ul class="text-sm space-y-2 list-disc pl-5">
            <li>Accordion headers use the <code>button</code> element for keyboard and screen reader accessibility.</li>
            <li>ARIA attributes (<code>aria-expanded</code>, <code>aria-controls</code>) indicate state.</li>
            <li>Keyboard operation allows navigating with Tab and toggling with Space/Enter.</li>
            <li>Visible focus indicators highlight the current section being interacted with.</li>
            <li>Proper heading hierarchy within accordion content for semantic structure.</li>
          </ul>
        </div>
      </template>
    </rs-card>

    <!-- Modal Dialog Design Standards -->
    <rs-card class="mb-6">
      <template #header>
        <div class="flex items-center">
          <Icon name="ph:browser" class="mr-2" />
          Modal Dialog Design Standards
        </div>
      </template>
      <template #body>
        <p class="mb-4">Modal dialogs are temporary overlays that appear over the current page to capture user input, confirm actions, or display important messages without requiring page navigation.</p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Left Column: Modal Types and Actions -->
          <div>
            <h3 class="text-base font-semibold mb-4">Modal Examples</h3>
            
            <div class="mb-6 space-y-4">
              <div class="p-4 border rounded-md">
                <h4 class="text-sm font-medium mb-2">Info/Action Modal</h4>
                <p class="text-sm text-gray-600 mb-4">Use for important messages or confirmations that require user attention.</p>
                <rs-button variant="primary" @click="openModalDemo('info', $event)" id="info-modal-button">
                  Open Info Modal
                </rs-button>
              </div>
              
              <div class="p-4 border rounded-md">
                <h4 class="text-sm font-medium mb-2">Form Modal</h4>
                <p class="text-sm text-gray-600 mb-4">Use for short forms or user input that doesn't require a full page.</p>
                <rs-button variant="info" @click="openModalDemo('form', $event)" id="form-modal-button">
                  Open Form Modal
                </rs-button>
              </div>
            </div>
            
            <div class="mt-8">
              <h3 class="text-base font-semibold mb-4">Key Components</h3>
              <div class="border rounded-md p-4 space-y-4">
                <ul class="text-sm space-y-3 list-disc pl-5">
                  <li><span class="font-medium">Clear Title</span>: Use sentence case and be specific about the modal's purpose</li>
                  <li><span class="font-medium">Close Button</span>: Always include a close button (×) at the top-right</li>
                  <li><span class="font-medium">Action Buttons</span>: Place at bottom-right, primary action first</li>
                  <li><span class="font-medium">Focus Management</span>: Set initial focus on first interactive element</li>
                  <li><span class="font-medium">Keyboard Navigation</span>: Support Tab key navigation and Escape to close</li>
                  <li><span class="font-medium">Unsaved Changes</span>: Warn users before closing with unsaved changes</li>
                  <li><span class="font-medium">Accessibility</span>: Include proper ARIA roles and labels</li>
                </ul>
              </div>
            </div>
          </div>
          
          <!-- Right Column: Modal Design Image/Screenshot -->
          <div>
            <h3 class="text-base font-semibold mb-4">Structure & Anatomy</h3>
            <div class="border rounded-md p-6 bg-gray-50">
              <div class="border-2 border-gray-300 rounded-md shadow-sm">
                <!-- Modal Header -->
                <div class="border-b p-4 bg-white rounded-t-md flex items-center justify-between">
                  <h4 class="text-base font-semibold text-gray-800">Update status</h4>
                  <button class="text-gray-500 hover:text-gray-700" aria-label="Close dialog">
                    <Icon name="ph:x" />
                  </button>
                </div>
                
                <!-- Modal Content -->
                <div class="p-6 bg-white">
                  <div class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Current Status</label>
                      <div class="text-sm bg-gray-100 p-2 rounded">Active</div>
                    </div>
                    
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">New Status</label>
                      <select class="w-full border rounded-md p-2 text-sm">
                        <option>Active</option>
                        <option>Pending</option>
                        <option>Suspended</option>
                        <option>Closed</option>
                      </select>
                    </div>
                    
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Comments</label>
                      <textarea class="w-full border rounded-md p-2 text-sm" rows="2"></textarea>
                    </div>
                  </div>
                </div>
                
                <!-- Modal Footer with Actions -->
                <div class="border-t p-4 bg-white rounded-b-md flex justify-end space-x-3">
                  <button class="px-4 py-2 text-sm border border-gray-300 rounded-md">
                    Cancel
                  </button>
                  <button class="px-4 py-2 text-sm bg-blue-600 text-white rounded-md">
                    Update Status
                  </button>
                </div>
              </div>
              
              <!-- Anatomy Labels -->
              <div class="mt-6 space-y-2 text-xs text-gray-600">
                <div class="flex items-center">
                  <div class="w-3 h-3 bg-blue-600 rounded-full mr-2"></div>
                  <span>Header with clear, concise title</span>
                </div>
                <div class="flex items-center">
                  <div class="w-3 h-3 bg-green-600 rounded-full mr-2"></div>
                  <span>Content area with focused, minimal UI</span>
                </div>
                <div class="flex items-center">
                  <div class="w-3 h-3 bg-amber-600 rounded-full mr-2"></div>
                  <span>Action buttons at bottom-right (primary action highlighted)</span>
                </div>
                <div class="flex items-center">
                  <div class="w-3 h-3 bg-red-600 rounded-full mr-2"></div>
                  <span>Close button at top-right corner</span>
                </div>
              </div>
            </div>
            
            <div class="mt-6 bg-blue-50 p-4 rounded-md text-sm">
              <h4 class="font-medium mb-2">When to Use Modals</h4>
              <ul class="space-y-1 text-xs text-gray-700 list-disc pl-5">
                <li>For actions requiring immediate attention</li>
                <li>To collect focused user input without page navigation</li>
                <li>For confirmations of destructive or important actions</li>
                <li>To display quick information that needs acknowledgment</li>
              </ul>
              <h4 class="font-medium mt-3 mb-2">When Not to Use</h4>
              <ul class="space-y-1 text-xs text-gray-700 list-disc pl-5">
                <li>For complex forms requiring multiple steps</li>
                <li>For content that could be displayed inline</li>
                <li>For information that needs to be referenced alongside other page content</li>
                <li>When multiple modals would need to be opened in sequence</li>
              </ul>
            </div>
          </div>
        </div>
        
        <!-- Info Modal Demo (shown when "Open Info Modal" is clicked) -->
        <rs-modal v-model="modalDemoOpen" role="dialog" aria-labelledby="info-modal-title" aria-describedby="info-modal-description" size="md" position="center">
          <template #header>
            <div class="flex items-center w-full">
              <h3 id="info-modal-title" class="text-lg font-semibold text-gray-800">System notification</h3>
            </div>
          </template>
          
          <div class="px-6 py-6">
            <div class="flex items-start">
              <div class="bg-blue-100 rounded-full p-3 mr-4 flex-shrink-0">
                <Icon name="ph:info-fill" size="24" class="text-blue-600" />
              </div>
              <div id="info-modal-description">
                <p class="mb-4 text-gray-800">System maintenance is scheduled for tomorrow at 2:00 AM. The platform will be unavailable for approximately 30 minutes.</p>
                <p class="text-sm text-gray-600">Please save your work and log out before the maintenance window begins.</p>
              </div>
            </div>
          </div>
          
          <template #footer>
            <div class="flex justify-end">
              <rs-button variant="primary" @click="closeModalDemo" autofocus>
                Acknowledge
              </rs-button>
            </div>
          </template>
        </rs-modal>
        
        <!-- Form Modal Demo (shown when "Open Form Modal" is clicked) -->
        <rs-modal v-model="modalFormOpen" role="dialog" aria-labelledby="form-modal-title" size="md" position="center">
          <template #header>
            <div class="flex items-center w-full">
              <h3 id="form-modal-title" class="text-lg font-semibold text-gray-800">Update user information</h3>
            </div>
          </template>
          
          <div class="px-6 py-6">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1" for="modal-form-name">Name <span class="text-red-500">*</span></label>
                <input
                  id="modal-form-name"
                  type="text"
                  v-model="modalFormData.name"
                  class="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter user name"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1" for="modal-form-email">Email <span class="text-red-500">*</span></label>
                <input
                  id="modal-form-email"
                  type="email"
                  v-model="modalFormData.email"
                  class="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="user@example.com"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1" for="modal-form-status">Status</label>
                <select
                  id="modal-form-status"
                  v-model="modalFormData.status"
                  class="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>
          </div>
          
          <template #footer>
            <div class="flex justify-end gap-3">
              <rs-button variant="secondary-outline" @click="tryCloseModalForm">
                Cancel
              </rs-button>
              <rs-button variant="primary" @click="saveModalForm" :disabled="!modalFormData.name || !modalFormData.email">
                Save changes
              </rs-button>
            </div>
          </template>
        </rs-modal>
        
        <!-- Unsaved Changes Warning Modal -->
        <rs-modal v-model="modalWarningOpen" role="dialog" aria-labelledby="warning-modal-title" size="md" position="center">
          <template #header>
            <div class="flex items-center w-full">
              <h3 id="warning-modal-title" class="text-lg font-semibold text-gray-800">Discard changes?</h3>
            </div>
          </template>
          
          <div class="px-6 py-6">
            <div class="flex items-start">
              <div class="bg-amber-100 rounded-full p-3 mr-4 flex-shrink-0">
                <Icon name="ph:warning-circle-fill" size="24" class="text-amber-600" />
              </div>
              <div>
                <p class="mb-2 text-gray-800">You have unsaved changes. Are you sure you want to close this dialog?</p>
                <p class="text-sm text-gray-600">Any changes you've made will be lost if you close without saving.</p>
              </div>
            </div>
          </div>
          
          <template #footer>
            <div class="flex justify-end gap-3">
              <rs-button variant="secondary-outline" @click="modalWarningOpen = false">
                Continue editing
              </rs-button>
              <rs-button variant="danger" @click="closeModalForm" autofocus>
                Discard changes
              </rs-button>
            </div>
          </template>
        </rs-modal>
        
        <!-- Accessibility & Implementation Guidelines -->
        <div class="mt-8 border rounded-md p-4 bg-blue-50">
          <h4 class="text-sm font-semibold mb-2">Modal Implementation Best Practices</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h5 class="text-xs font-medium mb-2">Accessibility Requirements</h5>
              <ul class="text-xs space-y-1 list-disc pl-5">
                <li>Use <code>role="dialog"</code> and <code>aria-labelledby</code> referencing title ID</li>
                <li>Trap keyboard focus within the modal while open</li>
                <li>Support closing with Escape key</li>
                <li>Set initial focus on the first interactive element</li>
                <li>Return focus to the trigger element when closed</li>
                <li>Ensure screen reader users understand modal purpose</li>
              </ul>
            </div>
            <div>
              <h5 class="text-xs font-medium mb-2">User Experience Guidelines</h5>
              <ul class="text-xs space-y-1 list-disc pl-5">
                <li>Warn users if they will lose unsaved changes</li>
                <li>Keep modals simple and focused on a single task</li>
                <li>Make modal title match the button/link that opened it</li>
                <li>Disable scrolling of background content while modal is open</li>
                <li>Use subtle animations for opening/closing (optional)</li>
                <li>For mobile, ensure modals are responsive and touch-friendly</li>
              </ul>
            </div>
          </div>
        </div>
      </template>
    </rs-card>
    
    <!-- UI Feedback and Interaction States Card -->
    <rs-card class="mb-6">
      <template #header>
        <div class="flex items-center">
          <Icon name="ph:cursor-click" class="mr-2" />
          UI Feedback & Interaction States
        </div>
      </template>
      <template #body>
        <p class="mb-6">This example showcases enterprise-grade UI feedback mechanisms and interaction states for optimal user experience.</p>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <!-- Left Column: Form with Validation -->
          <div class="space-y-6 border rounded-lg p-6">
            <h3 class="text-base font-semibold mb-4">Form Validation & Feedback</h3>

            <!-- Valid input field -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Username <span class="text-red-500">*</span></label>
              <div class="relative">
                <input
                  type="text"
                  value="admin_user"
                  class="w-full border border-green-500 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                />
                <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <Icon name="ph:check-circle-fill" class="text-green-500" />
                </div>
              </div>
              <p class="mt-1 text-xs text-green-600">Username is available</p>
            </div>

            <!-- Error input field with validation message -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email Address <span class="text-red-500">*</span></label>
              <div class="relative">
                <input
                  type="text"
                  value="invalid-email"
                  class="w-full border border-red-500 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <p class="mt-1 text-xs text-red-600 flex items-center">
                <Icon name="ph:warning-circle-fill" class="mr-1" /> Please enter a valid email address
              </p>
            </div>

            <!-- Focused input field with outline -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Password <span class="text-red-500">*</span></label>
              <input
                type="password"
                value="password123"
                class="w-full border border-blue-500 rounded-md px-3 py-2 outline-none ring-2 ring-blue-500"
              />
              <p class="mt-1 text-xs text-gray-500">Password must be at least 8 characters</p>
            </div>

            <div class="pt-4 flex items-center justify-between">
              <!-- Success button with checkmark -->
              <div class="relative">
                <rs-button variant="success" class="flex items-center">
                  <Icon name="ph:check-bold" class="mr-1" /> Saved
                </rs-button>
              </div>

              <!-- Button with loading spinner -->
              <rs-button variant="primary" class="flex items-center">
                <span class="flex items-center">
                  <span class="w-4 h-4 mr-2 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
                  Processing...
                </span>
              </rs-button>
            </div>

            <!-- Disabled button state -->
            <div class="pt-2">
              <rs-button variant="primary" class="w-full" disabled>
                Submit Form (Disabled)
              </rs-button>
              <p class="mt-1 text-xs text-gray-500 text-center">Complete all required fields to enable</p>
            </div>
          </div>

          <!-- Right Column: Interactive Elements -->
          <div class="space-y-6 border rounded-lg p-6">
            <h3 class="text-base font-semibold mb-4">Interactive Elements</h3>
            
            <!-- Toast notification example -->
            <div class="mb-6 relative">
              <div class="absolute top-0 right-0 max-w-xs">
                <div class="bg-green-50 border-l-4 border-green-500 p-4 shadow-md rounded-md flex items-start">
                  <Icon name="ph:check-circle-fill" class="text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p class="text-sm font-medium text-green-800">Changes saved successfully!</p>
                    <p class="mt-1 text-xs text-green-700">Your profile has been updated.</p>
                  </div>
                  <button class="ml-auto text-green-500 hover:text-green-700">
                    <Icon name="ph:x-bold" />
                  </button>
                </div>
              </div>
              <p class="text-sm mb-2">Toast notification appears in the top-right corner:</p>
              <div class="bg-gray-50 p-4 rounded-md border border-dashed border-gray-300 flex items-center justify-center h-28">
                <p class="text-center text-gray-500 text-sm">Toast notification area</p>
              </div>
            </div>

            <!-- Hover and Focus Examples -->
            <div class="mb-6">
              <p class="text-sm mb-3">Hover & Focus States:</p>
              <div class="flex flex-wrap gap-3 mb-4">
                <rs-button variant="primary" class="hover:bg-blue-700 transition-colors">
                  Hover me
                </rs-button>
                <rs-button variant="secondary" class="focus:ring-4 focus:ring-gray-300 transition-all">
                  Focus me (Tab)
                </rs-button>
                <rs-button variant="danger-outline" class="hover:bg-red-50 transition-colors">
                  Destructive
                </rs-button>
              </div>
            </div>

            <!-- Destructive Action Button -->
            <div>
              <p class="text-sm mb-3">Destructive Action with Confirmation:</p>
              <rs-button variant="danger" class="flex items-center" @click="showModal = true">
                <Icon name="ph:trash-bold" class="mr-2" /> Delete Account
              </rs-button>
            </div>
            
            <!-- Button States Showcase -->
            <div class="mt-8">
              <p class="text-sm mb-3">Button States:</p>
              <div class="flex flex-wrap gap-4">
                <div class="text-center">
                  <rs-button variant="primary">
                    Normal
                  </rs-button>
                  <p class="mt-2 text-xs text-gray-500">Default</p>
                </div>
                
                <div class="text-center">
                  <rs-button variant="primary" class="opacity-80">
                    Hovered
                  </rs-button>
                  <p class="mt-2 text-xs text-gray-500">On hover</p>
                </div>
                
                <div class="text-center">
                  <rs-button variant="primary" class="ring-2 ring-blue-300">
                    Focused
                  </rs-button>
                  <p class="mt-2 text-xs text-gray-500">Keyboard focus</p>
                </div>
                
                <div class="text-center">
                  <rs-button variant="primary" class="bg-blue-700">
                    Pressed
                  </rs-button>
                  <p class="mt-2 text-xs text-gray-500">On press</p>
                </div>
                
                <div class="text-center">
                  <rs-button variant="primary" disabled>
                    Disabled
                  </rs-button>
                  <p class="mt-2 text-xs text-gray-500">Inactive</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Confirmation Dialog (shown when Delete Account button is clicked) -->
        <rs-modal v-model="showModal">
          <template #header>
            <div class="p-4 border-b">
              <h3 class="text-lg font-semibold text-gray-800">Confirm Account Deletion</h3>
            </div>
          </template>
          
          <div class="p-6">
            <div class="flex items-start">
              <div class="bg-red-100 rounded-full p-2 mr-4">
                <Icon name="ph:warning-circle-fill" size="24" class="text-red-600" />
              </div>
              <div>
                <p class="mb-4 font-medium text-gray-700">Are you sure you want to delete your account?</p>
                <p class="text-sm text-gray-600 mb-4">
                  This action cannot be undone. All of your data will be permanently removed 
                  from our servers forever. This action is irreversible.
                </p>
                
                <div class="bg-gray-50 p-3 rounded-md border border-gray-200 mb-4">
                  <p class="text-sm text-gray-600">
                    To confirm, please type "delete" below:
                  </p>
                  <input type="text" class="mt-2 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="Type 'delete'" />
                </div>
              </div>
            </div>
          </div>
          
          <template #footer>
            <div class="p-4 border-t flex justify-end gap-3">
              <rs-button variant="secondary" @click="showModal = false">Cancel</rs-button>
              <rs-button variant="danger">Permanently Delete</rs-button>
            </div>
          </template>
        </rs-modal>

        <!-- Design System Info -->
        <div class="mt-6 bg-gray-50 p-4 rounded-md border border-gray-200">
          <h4 class="text-sm font-semibold mb-3">Enterprise Design System Specifications</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p class="font-medium">Typography</p>
              <ul class="text-xs space-y-1 mt-1 text-gray-600">
                <li>• Font: Inter, sans-serif</li>
                <li>• Base size: 16px (1rem)</li>
                <li>• Line height: 1.5</li>
              </ul>
            </div>
            <div>
              <p class="font-medium">Color Palette</p>
              <div class="flex items-center mt-2 space-x-2">
                <div class="w-6 h-6 bg-[#0057A6] rounded"></div>
                <span class="text-xs text-gray-600">Primary Blue (#0057A6)</span>
              </div>
              <div class="flex items-center mt-2 space-x-2">
                <div class="w-6 h-6 bg-red-600 rounded"></div>
                <span class="text-xs text-gray-600">Error/Destructive (#DC2626)</span>
              </div>
              <div class="flex items-center mt-2 space-x-2">
                <div class="w-6 h-6 bg-green-600 rounded"></div>
                <span class="text-xs text-gray-600">Success (#16A34A)</span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<style scoped>
.tooltip-enter-active,
.tooltip-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}
.tooltip-enter-from,
.tooltip-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style> 
