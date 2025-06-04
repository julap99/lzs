# QS-1 Implementation Guide

## ✅ COMPLETED: carian-profil.vue

The profile search page has been fully refactored and now includes:

- **URS Compliance**: Real-time ID verification, proper format validation, correct workflow navigation
- **UI/UX Compliance**: Inter font, LZS color scheme, proper typography hierarchy, accessibility features
- **Enhanced Features**: Better validation feedback, loading states, responsive design

## 🔄 IN PROGRESS: pendaftaran-pantas.vue

Key improvements made to the quick registration form:

### URS Compliance Updates:
- ✅ Added missing required fields: `tempatLahir`, `tempohMenetap`
- ✅ Enhanced validation with proper error handling
- ✅ Implemented auto-save functionality (every 30 seconds + on step change)
- ✅ Added proper draft management (24-hour expiry)
- ✅ Profile ID generation following URS spec

### Required Template Updates:

```vue
<!-- Step 1: Add missing fields -->
<div class="nas-field-half">
  <label class="nas-field-label">
    Tempat Lahir <span class="nas-required">*</span>
  </label>
  <input
    v-model="personalInfo.tempatLahir"
    type="text"
    placeholder="Masukkan tempat lahir"
    class="nas-form-input"
    :class="{ 'nas-input-error': errors.tempatLahir }"
    required
  />
  <div v-if="errors.tempatLahir" class="nas-error-message">
    {{ errors.tempatLahir }}
  </div>
</div>

<!-- Step 2: Add tempoh menetap field -->
<div class="nas-field-third">
  <label class="nas-field-label">
    Tempoh Menetap di Selangor <span class="nas-required">*</span>
  </label>
  <select
    v-model="addressInfo.tempohMenetap"
    class="nas-form-select"
    :class="{ 'nas-input-error': errors.tempohMenetap }"
    required
  >
    <option value="">Pilih tempoh</option>
    <option v-for="option in tempohMenetapOptions" :key="option.value" :value="option.value">
      {{ option.label }}
    </option>
  </select>
  <div v-if="errors.tempohMenetap" class="nas-error-message">
    {{ errors.tempohMenetap }}
  </div>
</div>

<!-- Step 3: Enhanced banking section with tunai reasoning -->
<div v-if="bankingInfo.caraBayaran === 'tunai'" class="nas-field-full">
  <label class="nas-field-label">
    Sebab Memilih Tunai <span class="nas-required">*</span>
  </label>
  <textarea
    v-model="bankingInfo.sebabTunai"
    rows="3"
    placeholder="Jelaskan sebab memilih bayaran tunai"
    class="nas-form-textarea"
    :class="{ 'nas-input-error': errors.sebabTunai }"
    required
  ></textarea>
  <div v-if="errors.sebabTunai" class="nas-error-message">
    {{ errors.sebabTunai }}
  </div>
</div>
```

## 📋 TODO: Remaining Files

### permohonan-bantuan.vue Priority Updates:

```javascript
// Enhanced assistance type validation
const jenisBantuanOptions = [
  { value: 'fakir', label: 'Bantuan Kecemasan - Fakir', description: 'Untuk golongan fakir' },
  { value: 'miskin', label: 'Bantuan Kecemasan - Miskin', description: 'Untuk golongan miskin' },
  { value: 'muallaf', label: 'Bantuan Kecemasan - Muallaf', description: 'Untuk mualaf' },
  { value: 'gharimin', label: 'Bantuan Kecemasan - Gharimin', description: 'Untuk gharimin' }
]

// Improved auto-fill from profile
onMounted(() => {
  const profile = getSelectedProfile() || getNewProfile()
  if (profile) {
    formData.value.nama = profile.personalInfo?.nama || profile.nama || ''
    formData.value.noKp = profile.personalInfo?.noKp || profile.noKp || ''
    formData.value.alamat = profile.addressInfo?.alamatPenuh || profile.alamat || ''
    formData.value.telefon = profile.contactInfo?.noTelefon || profile.telefon || ''
  }
})
```

### temubual-ekp.vue Critical Updates:

```javascript
// Complete questionnaire per URS
const questionnaire = ref({
  tinggalSelangor: null,          // Boolean
  statusPerkahwinan: null,        // String from options
  adaTanggungan: null,           // Boolean
  masihBekerja: null,            // Boolean  
  pasanganBekerja: null,         // Boolean
  statusKesihatanDiri: null,     // String
  statusKesihatanPasangan: null, // String
  rumahSewa: null,               // Boolean (true = sewa, false = milik)
  keperluanMendesak: null        // Boolean
})

// Validation must ensure ALL questions answered
const validateQuestionnaire = () => {
  const incomplete = Object.keys(questionnaire.value).filter(key => 
    questionnaire.value[key] === null || questionnaire.value[key] === undefined
  )
  return incomplete.length === 0
}
```

### kelulusan-pkp.vue Integration Updates:

```javascript
// Safe box balance checking
const checkSafeBoxBalance = () => {
  const availableAmount = safeBoxData.value.bakiSemasa - safeBoxData.value.floatMinimum
  if (approvalData.value.jumlahDisetujui > availableAmount) {
    errors.value.jumlahDisetujui = `Jumlah melebihi baki tersedia (RM ${availableAmount.toFixed(2)})`
    return false
  }
  return true
}

// PKP decision workflow
const submitApproval = async () => {
  if (approvalData.value.keputusan === 'lulus' && !checkSafeBoxBalance()) {
    return
  }
  
  // Update application status and proceed to next phase
  const updatedApplication = {
    ...applicationData.value,
    approvalData: approvalData.value,
    status: approvalData.value.keputusan === 'lulus' ? 'Diluluskan' : 'Ditolak',
    approvedBy: getCurrentUser().id,
    approvedAt: new Date().toISOString()
  }
  
  // If approved, proceed to cash disbursement
  // If rejected, return to dashboard with notification
}
```

## 🎨 CSS Standards Implementation

All pages must implement these consistent styles:

```css
/* NAS Design System - Core Variables */
:root {
  --nas-primary: #005AAD;      /* LZS Primary Blue */
  --nas-secondary: #8DC73D;    /* LZS Secondary Green */
  --nas-accent: #FFF200;       /* LZS Accent Yellow */
  --nas-success: #059669;      /* Success color */
  --nas-error: #D32F2F;        /* Error color */
  --nas-warning: #D97706;      /* Warning color */
  
  --nas-spacing-xs: 4px;
  --nas-spacing-sm: 8px;
  --nas-spacing-md: 12px;
  --nas-spacing-lg: 16px;
  --nas-spacing-xl: 24px;
  --nas-spacing-xxl: 32px;
}

/* Typography Standards */
.nas-container {
  font-family: 'Inter', sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--nas-spacing-xl);
}

.nas-page-title {
  font-size: 24px;
  font-weight: 700;
  line-height: 1.5;
  color: #1F2937;
}

.nas-section-header {
  font-size: 20px;
  font-weight: 600;
  line-height: 1.5;
  color: #374151;
}

.nas-subsection-header {
  font-size: 16px;
  font-weight: 600;
  line-height: 1.5;
  color: var(--nas-primary);
}

/* Form Standards */
.nas-form-input,
.nas-form-select,
.nas-form-textarea {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #E5E7EB;
  border-radius: 8px;
  font-size: 14px;
  font-family: 'Inter', sans-serif;
  transition: border-color 0.2s ease;
}

.nas-form-input:focus,
.nas-form-select:focus,
.nas-form-textarea:focus {
  outline: none;
  border-color: var(--nas-primary);
  box-shadow: 0 0 0 3px rgba(0, 90, 173, 0.1);
}

.nas-input-error {
  border-color: var(--nas-error) !important;
}

.nas-required {
  color: var(--nas-error);
  margin-left: 4px;
}

.nas-error-message {
  display: flex;
  align-items: center;
  margin-top: 8px;
  padding: 8px 12px;
  background-color: #FEF2F2;
  border: 1px solid #FECACA;
  border-radius: 6px;
  font-size: 12px;
  color: var(--nas-error);
}

/* Button Standards */
.nas-button-primary {
  background-color: var(--nas-primary);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  min-height: 44px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.nas-button-primary:hover {
  background-color: #004494;
  transform: translateY(-1px);
}

.nas-button-primary:disabled {
  background-color: #9CA3AF;
  cursor: not-allowed;
  transform: none;
}
```

## 🔧 Utility Functions for All Pages

```javascript
// Common utilities to be used across all pages
export const nasUtils = {
  // Format currency for Malaysian Ringgit
  formatCurrency: (amount) => {
    return new Intl.NumberFormat('ms-MY', {
      style: 'currency',
      currency: 'MYR'
    }).format(amount)
  },

  // Format IC number with dashes
  formatIcNumber: (value) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length >= 6) {
      return numbers.slice(0, 6) + '-' + numbers.slice(6, 8) + '-' + numbers.slice(8, 12)
    }
    return numbers
  },

  // Show toast notification
  showToast: (message, type = 'success') => {
    const toast = document.createElement('div')
    toast.className = `nas-toast nas-toast-${type}`
    toast.textContent = message
    document.body.appendChild(toast)
    
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast)
      }
    }, 3000)
  },

  // Get current user (mock)
  getCurrentUser: () => ({
    id: 'EKP-001',
    name: 'Pegawai EKP',
    role: 'EKP'
  }),

  // Validate Malaysian phone number
  validatePhoneNumber: (phone) => {
    return /^(\+?6?01)[0-46-9]-*[0-9]{7,8}$/.test(phone.replace(/\s/g, ''))
  },

  // Validate email
  validateEmail: (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }
}
```

## ✅ Quality Checklist

Before marking any page as complete, ensure:

- [ ] All URS required fields are present and functional
- [ ] Typography follows exact specifications (Inter font, proper sizes)
- [ ] Colors match LZS corporate scheme
- [ ] Forms have proper validation with error messages
- [ ] Auto-save functionality works (30-second intervals)
- [ ] Mobile responsive design tested
- [ ] Accessibility features implemented (ARIA labels, focus management)
- [ ] Loading states for all async operations
- [ ] Proper breadcrumb navigation
- [ ] Consistent spacing (24px margins, 16px mobile)
- [ ] All buttons meet 44px minimum touch target
- [ ] Error states properly handled
- [ ] Success notifications implemented

## 🚀 Next Steps

1. **Complete pendaftaran-pantas.vue template updates**
2. **Refactor permohonan-bantuan.vue with enhanced validations**
3. **Update temubual-ekp.vue questionnaire**
4. **Enhance kelulusan-pkp.vue safe box integration**
5. **Complete remaining cash flow pages**
6. **Comprehensive testing across all devices**
7. **Final accessibility audit**

This implementation guide ensures every page meets the high standards established in the carian-profil.vue refactoring while maintaining full URS compliance. 