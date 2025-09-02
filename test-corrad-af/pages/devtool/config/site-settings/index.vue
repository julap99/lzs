<script setup>
definePageMeta({
  title: "Site Settings",
  middleware: ["auth"],
  requiresAuth: true,
});

const { $swal } = useNuxtApp();
const { siteSettings, updateSiteSettings, applyThemeSettings, updateGlobalMeta } = useSiteSettings();

// Reactive data
const loading = ref(false);
const saving = ref(false);
const activeTab = ref('basic');

const settings = ref({
  siteName: '',
  siteDescription: '',
  siteLogo: '',
  siteLoadingLogo: '',
  siteFavicon: '',
  siteLoginLogo: '',
  customCSS: '',
  selectedTheme: 'biasa',
  showSiteNameInHeader: true,
  siteNameFontSize: 18,
  currentFont: '',
  fontSource: '',
  // SEO fields
  seoTitle: '',
  seoDescription: '',
  seoKeywords: '',
  seoAuthor: '',
  seoOgImage: '',
  seoTwitterCard: 'summary_large_image',
  seoCanonicalUrl: '',
  seoRobots: 'index, follow',
  seoGoogleAnalytics: '',
  seoGoogleTagManager: '',
  seoFacebookPixel: ''
});

const originalSettings = ref({});

// File upload refs
const logoFile = ref(null);
const loadingLogoFile = ref(null);
const faviconFile = ref(null);
const loginLogoFile = ref(null);
const cssFile = ref(null);
const ogImageFile = ref(null);

// Get theme lists
const themes = themeList();
const themes2 = themeList2();
const allThemes = [...themes, ...themes2];

// Popular Google Fonts list
const popularGoogleFonts = [
  { name: 'DM Sans', family: 'DM+Sans', weights: '300,400,500,600,700' },
  { name: 'Inter', family: 'Inter', weights: '300,400,500,600,700' },
  { name: 'Poppins', family: 'Poppins', weights: '300,400,500,600,700' },
  { name: 'Roboto', family: 'Roboto', weights: '300,400,500,700' },
  { name: 'Montserrat', family: 'Montserrat', weights: '300,400,500,600,700' },
  { name: 'Open Sans', family: 'Open+Sans', weights: '300,400,500,600,700' },
  { name: 'Lato', family: 'Lato', weights: '300,400,700' },
  { name: 'Raleway', family: 'Raleway', weights: '300,400,500,600,700' },
  { name: 'Nunito', family: 'Nunito', weights: '300,400,500,600,700' },
  { name: 'Source Sans Pro', family: 'Source+Sans+Pro', weights: '300,400,600,700' },
  { name: 'Ubuntu', family: 'Ubuntu', weights: '300,400,500,700' },
  { name: 'Playfair Display', family: 'Playfair+Display', weights: '400,500,600,700' },
  { name: 'Merriweather', family: 'Merriweather', weights: '300,400,700' },
  { name: 'Oswald', family: 'Oswald', weights: '300,400,500,600,700' },
  { name: 'PT Sans', family: 'PT+Sans', weights: '400,700' }
];

// Selected Google Font
const selectedGoogleFont = ref('');

// Form validation
const errors = ref({});
const validateForm = () => {
  errors.value = {};
  
  if (!settings.value.siteName || settings.value.siteName.trim() === '') {
    errors.value.siteName = 'Site name is required';
  }
  
  return Object.keys(errors.value).length === 0;
};

// Detect current font
const detectCurrentFont = () => {
  if (process.client) {
    const googleFontLink = document.getElementById('google-font-link');
    const customFontLink = document.getElementById('custom-font-link');
    
    if (customFontLink) {
      settings.value.currentFont = 'Custom Font';
      settings.value.fontSource = customFontLink.href;
    } else if (googleFontLink) {
      const url = new URL(googleFontLink.href);
      const familyParam = url.searchParams.get('family');
      if (familyParam) {
        const fontName = familyParam.split(':')[0].replace(/\+/g, ' ');
        settings.value.currentFont = fontName;
        settings.value.fontSource = googleFontLink.href;
      }
    } else {
      const body = document.body;
      const computedStyle = window.getComputedStyle(body);
      settings.value.currentFont = computedStyle.fontFamily.split(',')[0].replace(/"/g, '');
      settings.value.fontSource = 'System Default';
    }
  }
};

// Load settings
const loadSettings = async () => {
  loading.value = true;
  try {
    const { data } = await $fetch("/api/devtool/config/site-settings", {
      method: "GET",
    });
    
    if (data) {
      settings.value = { 
        ...settings.value,
        ...data,
        showSiteNameInHeader: data.showSiteNameInHeader !== false
      };
      originalSettings.value = { ...settings.value };
      
      // Sync with global site settings
      Object.assign(siteSettings.value, settings.value);
      
      // Detect current font
      detectCurrentFont();
    }
  } catch (error) {
    console.error("Error loading settings:", error);
    alert("Failed to load site settings");
  } finally {
    loading.value = false;
  }
};

// Save settings
const saveSettings = async () => {
  if (!validateForm()) {
    alert("Please fix the validation errors");
    return;
  }
  
  saving.value = true;
  try {
    console.log("[SiteSettingsPage] Calling updateSiteSettings with:", JSON.parse(JSON.stringify(settings.value)));
    const result = await updateSiteSettings(settings.value);
    console.log("[SiteSettingsPage] Received result from updateSiteSettings:", JSON.parse(JSON.stringify(result)));
    
    if (result && result.success) { 
      originalSettings.value = { ...settings.value };
      alert("Settings saved successfully");
      
      // Apply changes
      // applyChanges(); // Temporarily commented out to isolate the error source
      console.log("[SiteSettingsPage] applyChanges() was skipped for testing.");
    } else { 
      // Check if result or result.error is undefined before accessing properties
      let errorMsg = "Failed to save settings. Please check console for details.";
      if (result && result.error && result.error.message) {
        errorMsg = result.error.message;
      } else if (result === undefined) {
        errorMsg = "Failed to save settings: No response from update operation.";
        console.error("[SiteSettingsPage] 'result' from updateSiteSettings was undefined.");
      }
      
      alert(errorMsg);
      
      if (result && result.error && result.error.details) {
        console.error("[SiteSettingsPage] Save settings error details:", result.error.details);
      } else if (result === undefined) {
        // Already logged above
      } else if (result && !result.error) {
        console.error("[SiteSettingsPage] Save settings failed, but no 'error' object in result:", JSON.parse(JSON.stringify(result)));
      }
    }
  } catch (error) {
    // This catch block is for unexpected errors during the saveSettings execution itself,
    // or if updateSiteSettings somehow re-throws an error not caught by its own try-catch.
    console.error("Critical error saving settings:", error);
    alert("A critical error occurred. Failed to save settings.");
  } finally {
    saving.value = false;
  }
};

// Apply font from URL/link
const applyFontFromSource = () => {
  if (process.client && settings.value.fontSource && settings.value.fontSource !== 'System Default') {
    // Remove existing font links
    const existingLinks = document.querySelectorAll('#google-font-link, #custom-font-link');
    existingLinks.forEach(link => link.remove());
    
    // Add new font link
    const link = document.createElement('link');
    link.id = settings.value.fontSource.includes('fonts.googleapis.com') ? 'google-font-link' : 'custom-font-link';
    link.rel = 'stylesheet';
    link.href = settings.value.fontSource;
    document.head.appendChild(link);
    
    // Extract and apply font family
    if (settings.value.fontSource.includes('fonts.googleapis.com')) {
      const url = new URL(settings.value.fontSource);
      const familyParam = url.searchParams.get('family');
      if (familyParam) {
        const fontName = familyParam.split(':')[0].replace(/\+/g, ' ');
        document.documentElement.style.setProperty('--font-family-base', `"${fontName}", sans-serif`);
        settings.value.currentFont = fontName;
      }
    }
    
    alert('Font applied successfully');
  }
};

// File upload handler
const uploadFile = async (file, type) => {
  if (!file) return null;
  
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);
  
  try {
    const response = await $fetch("/api/devtool/config/upload-file", {
      method: "POST",
      body: formData,
    });
    
    return response.data.url;
  } catch (error) {
    console.error(`Error uploading ${type}:`, error);
    alert(`Failed to upload ${type}`);
    return null;
  }
};

// File upload handlers
const handleLogoUpload = async (event) => {
  const file = event.target.files[0];
  if (file) {
    const url = await uploadFile(file, 'logo');
    if (url) {
      settings.value.siteLogo = url;
      alert('Logo uploaded successfully');
    }
  }
};

const handleLoadingLogoUpload = async (event) => {
  const file = event.target.files[0];
  if (file) {
    const url = await uploadFile(file, 'loading-logo');
    if (url) {
      settings.value.siteLoadingLogo = url;
      alert('Loading logo uploaded successfully');
    }
  }
};

const handleFaviconUpload = async (event) => {
  const file = event.target.files[0];
  if (file) {
    const url = await uploadFile(file, 'favicon');
    if (url) {
      settings.value.siteFavicon = url;
      alert('Favicon uploaded successfully');
    }
  }
};

const handleLoginLogoUpload = async (event) => {
  const file = event.target.files[0];
  if (file) {
    const url = await uploadFile(file, 'login-logo');
    if (url) {
      settings.value.siteLoginLogo = url;
      alert('Login logo uploaded successfully');
    }
  }
};

const handleCSSUpload = async (event) => {
  const file = event.target.files[0];
  if (file) {
    if (!file.name.endsWith('.css')) {
      alert('Please upload a valid CSS file');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      settings.value.customCSS = e.target.result;
      alert('CSS file loaded successfully');
    };
    reader.readAsText(file);
  }
};

const handleOgImageUpload = async (event) => {
  const file = event.target.files[0];
  if (file) {
    const url = await uploadFile(file, 'og-image');
    if (url) {
      settings.value.seoOgImage = url;
      alert('OG image uploaded successfully');
    }
  }
};

// Apply changes
const applyChanges = () => {
  Object.assign(siteSettings.value, settings.value);
  applyThemeSettings();
  updateGlobalMeta();
  applyFontFromSource();
};

// Reset settings
const resetSettings = () => {
  settings.value = { ...originalSettings.value };
  errors.value = {};
  applyChanges();
  alert('Settings reset to last saved state');
};

// Check for changes
const hasChanges = computed(() => {
  return JSON.stringify(settings.value) !== JSON.stringify(originalSettings.value);
});

// Get current logo paths
const getCurrentLogo = () => {
  return settings.value.siteLogo || siteSettings.value.siteLogo || '/img/logo/corradAF-logo.svg';
};

const getCurrentLoadingLogo = () => {
  return settings.value.siteLoadingLogo || siteSettings.value.siteLoadingLogo || '/img/logo/corradAF-logo.svg';
};

const getCurrentFavicon = () => {
  return settings.value.siteFavicon || siteSettings.value.siteFavicon || '/favicon.ico';
};

const getCurrentLoginLogo = () => {
  return settings.value.siteLoginLogo || siteSettings.value.siteLoginLogo || '/img/logo/corradAF-logo.svg';
};

// Apply Google Font
const applyGoogleFont = (font) => {
  if (font) {
    const googleFontUrl = `https://fonts.googleapis.com/css2?family=${font.family}:wght@${font.weights}&display=swap`;
    settings.value.fontSource = googleFontUrl;
    settings.value.currentFont = font.name;
    applyFontFromSource();
    alert(`${font.name} font applied successfully`);
    // Reset the dropdown after selection
    selectedGoogleFont.value = '';
  }
};

// Load settings on mount
onMounted(() => {
  loadSettings();
});

// Watch for changes
watch(settings, (newSettings, oldSettings) => {
  // Apply changes immediately for toggle states
  if (newSettings.showSiteNameInHeader !== oldSettings?.showSiteNameInHeader) {
    applyChanges();
  }
  // Apply other changes
  applyChanges();
}, { deep: true });

// Also watch specifically for the site name header toggle
watch(() => settings.value.showSiteNameInHeader, (newValue) => {
  siteSettings.value.showSiteNameInHeader = newValue;
}, { immediate: true });
</script>

<template>
  <div>
    <LayoutsBreadcrumb />

    <!-- Info Card -->
    <rs-card>
      <template #header>
        <div class="flex items-center">
          <Icon name="ic:outline-settings" class="mr-2" />
          Site Settings
        </div>
      </template>
      <template #body>
        <p class="leading-relaxed">Configure your platform's branding, appearance, SEO, and functionality.</p>
      </template>
    </rs-card>

    <!-- Main Settings Card -->
    <rs-card>
      <div class="p-6">
        <!-- Header with actions -->
        <div class="flex justify-between items-center mb-8">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Platform Configuration</h1>
            <p class="text-sm text-gray-600 dark:text-gray-400">Manage your site's branding, appearance, and functionality.</p>
          </div>
          <div class="flex items-center space-x-3">
            <rs-button 
              v-if="hasChanges"
              @click="resetSettings"
              variant="outline"
              size="sm"
              class="transition-all duration-200"
            >
              <Icon name="ic:outline-refresh" class="mr-2 w-4 h-4" />
              Reset
            </rs-button>
            <rs-button 
              @click="saveSettings"
              :loading="saving"
              :disabled="!hasChanges"
              variant="primary"
              size="sm"
              class="transition-all duration-200"
            >
              <Icon name="ic:outline-save" class="mr-2 w-4 h-4" />
              Save Changes
            </rs-button>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center py-12">
          <Loading />
        </div>

        <!-- Tabs and Content -->
        <div v-else>
          <!-- Tab Navigation -->
          <div class="border-b border-gray-200 dark:border-gray-700 mb-8">
            <nav class="flex space-x-4" role="tablist">
              <button
                v-for="tab in [
                  { id: 'basic', name: 'Basic', icon: 'ic:outline-info' },
                  { id: 'branding', name: 'Branding', icon: 'ic:outline-image' },
                  { id: 'appearance', name: 'Appearance', icon: 'ic:outline-palette' },
                  { id: 'seo', name: 'SEO', icon: 'ic:outline-search' },
                  { id: 'advanced', name: 'Advanced', icon: 'ic:outline-code' }
                ]"
                :key="tab.id"
                @click="activeTab = tab.id"
                :class="[
                  activeTab === tab.id
                    ? 'border-primary text-primary bg-primary/5'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300',
                  'whitespace-nowrap py-2 px-2 border-b-2 font-medium text-sm flex items-center space-x-2 rounded-t-lg transition-all duration-200'
                ]"
                :aria-selected="activeTab === tab.id"
                role="tab"
              >
                <Icon :name="tab.icon" class="w-4 h-4" />
                <span>{{ tab.name }}</span>
              </button>
            </nav>
          </div>

          <!-- Tab Content -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Main Content -->
            <div class="lg:col-span-2">
              <!-- Basic Information Tab -->
              <div v-if="activeTab === 'basic'" class="space-y-6">
                <!-- Site Name -->
                <rs-card class="!p-0">
                  <div class="p-6 space-y-3">
                    <label class="block text-base font-semibold text-gray-800 dark:text-white">
                      Site Name <span class="text-red-500">*</span>
                    </label>
                    <input
                      v-model="settings.siteName"
                      type="text"
                      :class="[
                        'w-full px-4 py-2.5 border rounded-lg text-sm transition-all duration-200 focus:ring-2 focus:ring-primary/20',
                        errors.siteName 
                          ? 'border-red-300 focus:border-red-500' 
                          : 'border-gray-300 dark:border-gray-700 focus:border-primary'
                      ]"
                      class="dark:bg-gray-700 dark:text-white placeholder-gray-400"
                      placeholder="Enter your platform name"
                    />
                    <p v-if="errors.siteName" class="text-red-500 text-sm font-medium">{{ errors.siteName }}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">Displayed in browser titles and throughout the platform.</p>
                  </div>
                </rs-card>

                <!-- Site Description -->
                <rs-card class="!p-0">
                  <div class="p-6 space-y-3">
                    <label class="block text-base font-semibold text-gray-800 dark:text-white">Site Description</label>
                    <textarea
                      v-model="settings.siteDescription"
                      rows="4"
                      class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 dark:bg-gray-700 dark:text-white text-sm placeholder-gray-400 transition-all duration-200"
                      placeholder="Describe your platform\'s purpose and functionality"
                    ></textarea>
                    <p class="text-xs text-gray-500 dark:text-gray-400">Used for SEO meta descriptions and platform overview.</p>
                  </div>
                </rs-card>

                <!-- Default Theme -->
                <rs-card class="!p-0">
                  <div class="p-6 space-y-3">
                    <label class="block text-base font-semibold text-gray-800 dark:text-white">Default Theme</label>
                    <select
                      v-model="settings.selectedTheme"
                      class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 dark:bg-gray-700 dark:text-white text-sm transition-all duration-200"
                    >
                      <optgroup label="Standard Themes">
                        <option v-for="theme in themes" :key="theme.theme" :value="theme.theme">
                          {{ theme.theme.charAt(0).toUpperCase() + theme.theme.slice(1) }}
                        </option>
                      </optgroup>
                      <optgroup label="Accessibility Themes">
                        <option v-for="theme in themes2" :key="theme.theme" :value="theme.theme">
                          {{ theme.theme.charAt(0).toUpperCase() + theme.theme.slice(1) }}
                        </option>
                      </optgroup>
                    </select>
                    <p class="text-xs text-gray-500 dark:text-gray-400">Default theme for new users and login pages.</p>
                  </div>
                </rs-card>

                <!-- Site Name in Header Toggle -->
                <rs-card class="!p-0">
                  <div class="p-6">
                    <div class="flex items-center justify-between">
                      <div class="flex-1">
                        <h4 class="text-base font-semibold text-gray-800 dark:text-white mb-1">Show site name in header</h4>
                        <p class="text-sm text-gray-500 dark:text-gray-400">Display the site name beside the logo in the navigation bar.</p>
                      </div>
                      <label class="relative inline-flex items-center cursor-pointer ml-4">
                        <input
                          v-model="settings.showSiteNameInHeader"
                          type="checkbox"
                          class="sr-only peer"
                        />
                        <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/30 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  </div>
                </rs-card>
              </div>

              <!-- Branding Tab -->
              <div v-if="activeTab === 'branding'" class="space-y-6">
                <!-- Site Logo -->
                <rs-card class="p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div class="flex items-center mb-6">
                    <div class="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                      <Icon name="ic:outline-image" class="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 class="text-lg font-semibold text-gray-800 dark:text-white">Site Logo</h3>
                      <p class="text-sm text-gray-500 dark:text-gray-400">Main logo displayed in the header navigation.</p>
                    </div>
                  </div>
                  <div class="flex items-center space-x-6">
                    <div class="flex-shrink-0">
                      <div class="w-24 h-24 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center bg-gray-50 dark:bg-gray-700/50">
                        <img 
                          :src="getCurrentLogo()" 
                          alt="Current Logo" 
                          class="max-w-full max-h-full object-contain"
                          @error="$event.target.src = '/img/logo/corradAF-logo.svg'"
                        />
                      </div>
                    </div>
                    <div class="flex-1">
                      <input
                        ref="logoFile"
                        type="file"
                        accept="image/*"
                        @change="handleLogoUpload"
                        class="hidden"
                      />
                      <rs-button @click="$refs.logoFile.click()" variant="outline" size="sm" class="mb-3 border border-gray-300 dark:border-gray-600 hover:border-primary dark:hover:border-primary">
                        <Icon name="ic:outline-upload" class="mr-2 w-4 h-4" />
                        Upload Logo
                      </rs-button>
                      <p class="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, SVG (max 2MB) • Recommended: 200x60px</p>
                    </div>
                  </div>
                </rs-card>

                <!-- Loading Screen Logo -->
                <rs-card class="p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div class="flex items-center mb-6">
                    <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mr-4">
                      <Icon name="ic:outline-refresh" class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 class="text-lg font-semibold text-gray-800 dark:text-white">Loading Screen Logo</h3>
                      <p class="text-sm text-gray-500 dark:text-gray-400">Logo shown during page loads and transitions.</p>
                    </div>
                  </div>
                  <div class="flex items-center space-x-6">
                    <div class="flex-shrink-0">
                      <div class="w-24 h-24 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center bg-gray-50 dark:bg-gray-700/50">
                        <img 
                          :src="getCurrentLoadingLogo()" 
                          alt="Current Loading Logo" 
                          class="max-w-full max-h-full object-contain"
                          @error="$event.target.src = '/img/logo/corradAF-logo.svg'"
                        />
                      </div>
                    </div>
                    <div class="flex-1">
                      <input
                        ref="loadingLogoFile"
                        type="file"
                        accept="image/*"
                        @change="handleLoadingLogoUpload"
                        class="hidden"
                      />
                      <rs-button @click="$refs.loadingLogoFile.click()" variant="outline" size="sm" class="mb-3 border border-gray-300 dark:border-gray-600 hover:border-primary dark:hover:border-primary">
                        <Icon name="ic:outline-upload" class="mr-2 w-4 h-4" />
                        Upload Loading Logo
                      </rs-button>
                      <p class="text-xs text-gray-500 dark:text-gray-400">Same file formats as logo • Recommended: Square format</p>
                    </div>
                  </div>
                </rs-card>

                <!-- Login Logo -->
                <rs-card class="p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div class="flex items-center mb-6">
                    <div class="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mr-4">
                      <Icon name="ic:outline-login" class="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 class="text-lg font-semibold text-gray-800 dark:text-white">Login Logo</h3>
                      <p class="text-sm text-gray-500 dark:text-gray-400">Logo displayed on the login and authentication pages.</p>
                    </div>
                  </div>
                  <div class="flex items-center space-x-6">
                    <div class="flex-shrink-0">
                      <div class="w-24 h-24 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center bg-gray-50 dark:bg-gray-700/50">
                        <img 
                          :src="getCurrentLoginLogo()" 
                          alt="Current Login Logo" 
                          class="max-w-full max-h-full object-contain"
                          @error="$event.target.src = '/img/logo/corradAF-logo.svg'"
                        />
                      </div>
                    </div>
                    <div class="flex-1">
                      <input
                        ref="loginLogoFile"
                        type="file"
                        accept="image/*"
                        @change="handleLoginLogoUpload"
                        class="hidden"
                      />
                      <rs-button @click="$refs.loginLogoFile.click()" variant="outline" size="sm" class="mb-3 border border-gray-300 dark:border-gray-600 hover:border-primary dark:hover:border-primary">
                        <Icon name="ic:outline-upload" class="mr-2 w-4 h-4" />
                        Upload Login Logo
                      </rs-button>
                      <p class="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, SVG (max 2MB) • Used in login page</p>
                    </div>
                  </div>
                </rs-card>

                <!-- Favicon -->
                <rs-card class="p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div class="flex items-center mb-6">
                    <div class="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mr-4">
                      <Icon name="ic:outline-tab" class="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 class="text-lg font-semibold text-gray-800 dark:text-white">Favicon</h3>
                      <p class="text-sm text-gray-500 dark:text-gray-400">Small icon displayed in browser tabs and bookmarks.</p>
                    </div>
                  </div>
                  <div class="flex items-center space-x-6">
                    <div class="flex-shrink-0">
                      <div class="w-16 h-16 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center bg-gray-50 dark:bg-gray-700/50">
                        <img 
                          :src="getCurrentFavicon()" 
                          alt="Current Favicon" 
                          class="max-w-full max-h-full object-contain"
                          @error="$event.target.src = '/favicon.ico'"
                        />
                      </div>
                    </div>
                    <div class="flex-1">
                      <input
                        ref="faviconFile"
                        type="file"
                        accept=".ico,.png"
                        @change="handleFaviconUpload"
                        class="hidden"
                      />
                      <rs-button @click="$refs.faviconFile.click()" variant="outline" size="sm" class="mb-3 border border-gray-300 dark:border-gray-600 hover:border-primary dark:hover:border-primary">
                        <Icon name="ic:outline-upload" class="mr-2 w-4 h-4" />
                        Upload Favicon
                      </rs-button>
                      <p class="text-xs text-gray-500 dark:text-gray-400">ICO or PNG • 16x16, 32x32, or 48x48 pixels</p>
                    </div>
                  </div>
                </rs-card>
              </div>

              <!-- Appearance Tab -->
              <div v-if="activeTab === 'appearance'" class="space-y-6">
                <!-- Site Name Font Size -->
                <rs-card class="p-6">
                  <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-6">Site Name Styling</h3>
                  
                  <div class="space-y-4">
                    <div>
                      <label class="block text-base font-semibold text-gray-800 dark:text-white mb-2">Site Name Font Size</label>
                      <div class="flex items-center space-x-4">
                        <FontSizeStepper 
                          v-model="settings.siteNameFontSize" 
                          :min="12" 
                          :max="36" 
                          :step="1"
                        />
                        <div class="flex-1 text-sm text-gray-500">
                          Preview: 
                          <span :style="{ fontSize: settings.siteNameFontSize + 'px' }" 
                                class="font-semibold ml-2 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                            {{ settings.siteName || 'Site Name' }}
                          </span>
                        </div>
                      </div>
                      <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">Font size for the site name displayed in the header (12px - 36px).</p>
                      
                      <!-- Live size indicator -->
                      <div class="mt-2 flex items-center space-x-2">
                        <span class="text-xs text-gray-400">Current size:</span>
                        <span class="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded">
                          {{ settings.siteNameFontSize }}px
                        </span>
                      </div>
                    </div>
                  </div>
                </rs-card>

                <!-- Font Configuration -->
                <rs-card class="p-6">
                  <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Font Configuration</h3>
                  
                  <div class="space-y-4">
                    <div>
                      <label class="block text-base font-semibold text-gray-800 dark:text-white mb-2">Current Font</label>
                      <div class="p-3 bg-gray-50 dark:bg-gray-800/80 rounded border border-gray-300 dark:border-gray-600">
                        <div class="text-sm font-medium text-gray-800 dark:text-white">{{ settings.currentFont || 'DM Sans' }}</div>
                        <div class="text-xs text-gray-500 dark:text-gray-400">{{ settings.fontSource || 'System Default' }}</div>
                      </div>
                    </div>

                    <!-- Google Fonts Suggestions -->
                    <div>
                      <label class="block text-base font-semibold text-gray-800 dark:text-white mb-2">Popular Google Fonts</label>
                      <select
                        v-model="selectedGoogleFont"
                        @change="applyGoogleFont(popularGoogleFonts.find(f => f.name === selectedGoogleFont))"
                        class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 dark:bg-gray-700 dark:text-white text-sm transition-all duration-200"
                      >
                        <option value="">Select a Google Font</option>
                        <option v-for="font in popularGoogleFonts" :key="font.name" :value="font.name">
                          {{ font.name }}
                        </option>
                      </select>
                      <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Choose from popular Google Fonts or use custom URL below.</p>
                    </div>

                    <div>
                      <label class="block text-base font-semibold text-gray-800 dark:text-white mb-2">Custom Font Source URL</label>
                      <input
                        v-model="settings.fontSource"
                        type="url"
                        class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 dark:bg-gray-700 dark:text-white text-sm placeholder-gray-400 transition-all duration-200"
                        placeholder="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
                      />
                      <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Google Fonts or any CDN font URL.</p>
                    </div>

                    <rs-button @click="applyFontFromSource" variant="outline" size="sm" class="border border-gray-300 dark:border-gray-600 hover:border-primary dark:hover:border-primary">
                      <Icon name="ic:outline-refresh" class="mr-1" />
                      Apply Font
                    </rs-button>
                  </div>
                </rs-card>
              </div>

              <!-- SEO Tab -->
              <div v-if="activeTab === 'seo'" class="space-y-6">
                <rs-card class="!p-0">
                  <div class="p-6 space-y-3">
                    <label class="block text-base font-semibold text-gray-800 dark:text-white mb-0">SEO Title</label>
                    <input
                      v-model="settings.seoTitle"
                      type="text"
                      class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 dark:bg-gray-700 dark:text-white text-sm placeholder-gray-400 transition-all duration-200"
                      placeholder="Your Platform | Tagline"
                    />
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Displayed in search results (50-60 characters).</p>
                  </div>
                </rs-card>

                <rs-card class="!p-0">
                  <div class="p-6 space-y-3">
                    <label class="block text-base font-semibold text-gray-800 dark:text-white mb-0">Meta Description</label>
                    <textarea
                      v-model="settings.seoDescription"
                      rows="3"
                      class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 dark:bg-gray-700 dark:text-white text-sm placeholder-gray-400 transition-all duration-200"
                      placeholder="Brief description for search engines"
                    ></textarea>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Search result description (150-160 characters).</p>
                  </div>
                </rs-card>

                <rs-card class="!p-0">
                  <div class="p-6 space-y-3">
                    <label class="block text-base font-semibold text-gray-800 dark:text-white mb-0">Keywords</label>
                    <input
                      v-model="settings.seoKeywords"
                      type="text"
                      class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 dark:bg-gray-700 dark:text-white text-sm placeholder-gray-400 transition-all duration-200"
                      placeholder="keyword1, keyword2, keyword3"
                    />
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Comma-separated keywords (optional).</p>
                  </div>
                </rs-card>

                <rs-card class="!p-0">
                  <div class="p-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div class="space-y-3">
                        <label class="block text-base font-semibold text-gray-800 dark:text-white mb-0">Author</label>
                        <input
                          v-model="settings.seoAuthor"
                          type="text"
                          class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 dark:bg-gray-700 dark:text-white text-sm placeholder-gray-400 transition-all duration-200"
                          placeholder="Your Name or Company"
                        />
                      </div>

                      <div class="space-y-3">
                        <label class="block text-base font-semibold text-gray-800 dark:text-white mb-0">Robots</label>
                        <select
                          v-model="settings.seoRobots"
                          class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 dark:bg-gray-700 dark:text-white text-sm transition-all duration-200"
                        >
                          <option value="index, follow">Index, Follow</option>
                          <option value="noindex, follow">No Index, Follow</option>
                          <option value="index, nofollow">Index, No Follow</option>
                          <option value="noindex, nofollow">No Index, No Follow</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </rs-card>

                <!-- Open Graph Image -->
                <rs-card>
                  <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-6">Open Graph Image</h3>
                  <div class="flex items-center space-x-6">
                    <div class="flex-shrink-0" v-if="settings.seoOgImage">
                      <img 
                        :src="settings.seoOgImage" 
                        alt="OG Image" 
                        class="w-20 h-12 object-cover border border-gray-200 rounded"
                      />
                    </div>
                    <div class="flex-1">
                      <input
                        ref="ogImageFile"
                        type="file"
                        accept="image/*"
                        @change="handleOgImageUpload"
                        class="hidden"
                      />
                      <rs-button @click="$refs.ogImageFile.click()" variant="outline" size="sm" class="border border-gray-300 dark:border-gray-600 hover:border-primary dark:hover:border-primary">
                        <Icon name="ic:outline-upload" class="mr-2" />
                        Upload OG Image
                      </rs-button>
                      <p class="text-xs text-gray-500 dark:text-gray-400 mt-3 leading-relaxed">1200x630px recommended • Used for social media shares.</p>
                    </div>
                  </div>
                </rs-card>

                <!-- Analytics -->
                <rs-card>
                  <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-6">Analytics & Tracking</h3>
                  <div class="space-y-6">
                    <div>
                      <label class="block text-base font-semibold text-gray-800 dark:text-white mb-2">Google Analytics ID</label>
                      <input
                        v-model="settings.seoGoogleAnalytics"
                        type="text"
                        class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 dark:bg-gray-700 dark:text-white text-sm placeholder-gray-400 transition-all duration-200"
                        placeholder="G-XXXXXXXXXX"
                      />
                    </div>

                    <div>
                      <label class="block text-base font-semibold text-gray-800 dark:text-white mb-2">Google Tag Manager ID</label>
                      <input
                        v-model="settings.seoGoogleTagManager"
                        type="text"
                        class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 dark:bg-gray-700 dark:text-white text-sm placeholder-gray-400 transition-all duration-200"
                        placeholder="GTM-XXXXXXX"
                      />
                    </div>

                    <div>
                      <label class="block text-base font-semibold text-gray-800 dark:text-white mb-2">Facebook Pixel ID</label>
                      <input
                        v-model="settings.seoFacebookPixel"
                        type="text"
                        class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 dark:bg-gray-700 dark:text-white text-sm placeholder-gray-400 transition-all duration-200"
                        placeholder="XXXXXXXXXXXXXXX"
                      />
                    </div>
                  </div>
                </rs-card>
              </div>

              <!-- Advanced Tab -->
              <div v-if="activeTab === 'advanced'" class="space-y-6">
                <rs-card class="p-6">
                  <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-6">Custom CSS</h3>
                  
                  <div class="space-y-6">
                    <!-- CSS Upload -->
                    <div>
                      <input
                        ref="cssFile"
                        type="file"
                        accept=".css"
                        @change="handleCSSUpload"
                        class="hidden"
                      />
                      <rs-button @click="$refs.cssFile.click()" variant="outline" size="sm" class="mb-3 border border-gray-300 dark:border-gray-600 hover:border-primary dark:hover:border-primary">
                        <Icon name="ic:outline-upload" class="mr-1" />
                        Upload CSS File
                      </rs-button>
                      <p class="text-xs text-gray-500 dark:text-gray-400 mb-3">Upload a .css file to automatically load content.</p>
                    </div>

                    <!-- CSS Editor -->
                    <div>
                      <label class="block text-base font-semibold text-gray-800 dark:text-white mb-2">Custom CSS</label>
                      <textarea
                        v-model="settings.customCSS"
                        rows="10"
                        class="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 dark:bg-gray-700 dark:text-white font-mono text-sm placeholder-gray-400 transition-all duration-200"
                        placeholder="/* Add your custom CSS here */
.your-custom-class {
  color: #333;
  font-weight: bold;
}"
                      ></textarea>
                      <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">CSS will be injected into the page head.</p>
                    </div>
                  </div>
                </rs-card>
              </div>
            </div>

            <!-- Live Preview Sidebar -->
            <div class="lg:col-span-1">
              <div class="sticky top-6 space-y-6">
                <rs-card class="p-6">
                  <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-6">Live Preview</h3>
                  
                  <!-- Header Preview -->
                  <div class="mb-6">
                    <p class="text-base font-medium text-gray-700 dark:text-gray-300 mb-2">Header</p>
                    <div class="border border-gray-300 dark:border-gray-600 rounded-md p-4 bg-white dark:bg-gray-800/50 flex items-center space-x-3">
                      <img 
                        :src="getCurrentLogo()" 
                        alt="Logo Preview" 
                        class="w-10 h-10 object-contain"
                        @error="$event.target.src = '/img/logo/corradAF-logo.svg'"
                      />
                      <span v-if="settings.showSiteNameInHeader" 
                            class="font-semibold"
                            :style="{ fontSize: (settings.siteNameFontSize || 18) + 'px' }">
                        {{ settings.siteName || 'Your Site Name' }}
                      </span>
                    </div>
                  </div>

                  <!-- Loading Preview -->
                  <div class="mb-6">
                    <p class="text-base font-medium text-gray-700 dark:text-gray-300 mb-2">Loading Screen</p>
                    <div class="border border-gray-300 dark:border-gray-600 rounded-md p-4 bg-white dark:bg-gray-800/50 flex items-center justify-center">
                      <img 
                        :src="getCurrentLoadingLogo()" 
                        alt="Loading Logo Preview" 
                        class="w-20 h-20 object-contain"
                        @error="$event.target.src = '/img/logo/corradAF-logo.svg'"
                      />
                    </div>
                  </div>

                  <!-- Login Logo Preview -->
                  <div class="mb-6">
                    <p class="text-base font-medium text-gray-700 dark:text-gray-300 mb-2">Login Page</p>
                    <div class="border border-gray-300 dark:border-gray-600 rounded-md p-4 bg-white dark:bg-gray-800/50 flex items-center justify-center">
                      <img 
                        :src="getCurrentLoginLogo()" 
                        alt="Login Logo Preview" 
                        class="w-20 h-20 object-contain"
                        @error="$event.target.src = '/img/logo/corradAF-logo.svg'"
                      />
                    </div>
                  </div>

                  <!-- Browser Tab Preview -->
                  <div class="mb-6">
                    <p class="text-base font-medium text-gray-700 dark:text-gray-300 mb-2">Browser Tab</p>
                    <div class="border border-gray-300 dark:border-gray-600 rounded-md p-3 bg-gray-100 dark:bg-gray-700/50 flex items-center space-x-2">
                      <img 
                        :src="getCurrentFavicon()" 
                        alt="Favicon Preview" 
                        class="w-6 h-6"
                        @error="$event.target.src = '/favicon.ico'"
                      />
                      <span class="text-sm truncate">{{ settings.siteName || 'Your Site Name' }}</span>
                    </div>
                  </div>

                  <!-- Font Preview -->
                  <div>
                    <p class="text-base font-medium text-gray-700 dark:text-gray-300 mb-2">Font</p>
                    <div class="border border-gray-300 dark:border-gray-600 rounded-md p-4 bg-white dark:bg-gray-800/50">
                      <p class="text-sm" :style="{ fontFamily: settings.currentFont || 'DM Sans' }">
                        {{ settings.currentFont || 'DM Sans' }}
                      </p>
                      <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ settings.fontSource || 'System Default' }}</p>
                    </div>
                  </div>
                  
                  <!-- Debug Info -->
                  <div class="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg">
                    <p class="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">Debug Info</p>
                    <div class="text-xs text-blue-700 dark:text-blue-300 space-y-1.5">
                      <div><span class="font-medium">Site Name:</span> {{ settings.siteName || 'Not set' }}</div>
                      <div><span class="font-medium">Show in Header:</span> {{ settings.showSiteNameInHeader ? 'Yes' : 'No' }}</div>
                      <div><span class="font-medium">Font Size:</span> {{ settings.siteNameFontSize }}px</div>
                    </div>
                  </div>
                </rs-card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </rs-card>
  </div>
</template>

<style scoped>
/* Custom toggle switch styling */
.toggle {
  @apply relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2;
}

.toggle:checked {
  @apply bg-primary;
}

.toggle:not(:checked) {
  @apply bg-gray-300 dark:bg-gray-600;
}

.toggle::before {
  @apply absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform content-[''];
}

.toggle:checked::before {
  @apply translate-x-5;
}

/* Code mirror custom styling */
.rs-code-mirror {
  @apply border-0;
}
</style> 