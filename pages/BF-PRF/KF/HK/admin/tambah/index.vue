<!-- pages/BF-PRF/KF/HK/add.vue -->
<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Tambah Konfigurasi Had Kifayah Baharu
          </h2>
          <rs-button
            variant="primary-outline"
            @click="navigateTo('/BF-PRF/KF/HK/admin')"
          >
            <Icon name="mdi:arrow-left" class="mr-1" /> Kembali
          </rs-button>
        </div>
      </template>

      <template #body>
        <!-- Important Notice at Top -->
        <div class="bg-yellow-50 p-3 rounded border border-yellow-200 mb-6">
          <p class="text-yellow-800 text-sm">
            <Icon name="material-symbols:info-outline" class="mr-1" />
            Perhatian: Semua penambahan akan melalui proses kelulusan
            terlebih dahulu sebelum dikuat kuasa.
          </p>
        </div>

        <FormKit
          type="form"
          :actions="false"
          v-model="formData"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Step 1: Category Selection -->
            <FormKit
              type="select"
              name="category"
              label="Kategori Kadar Had Kifayah"
              validation="required"
              :options="kategoriOptions"
              placeholder="Pilih kategori"
              :validation-messages="{
                required: 'Kategori adalah wajib',
              }"
              @input="onCategoryChange"
            />

            <!-- Step 2: Household Type Selection (only shows after category is selected) -->
            <FormKit
              v-if="formData.category"
              type="select"
              name="householdType"
              label="Kategori Isi Rumah"
              validation="required"
              :options="currentHouseholdOptions"
              placeholder="Pilih kategori isi rumah"
              :validation-messages="{
                required: 'Kategori isi rumah adalah wajib',
              }"
              @input="onHouseholdTypeChange"
            />

            <!-- Info message when category is selected but household type not yet -->
            <div 
              v-if="formData.category && !formData.householdType"
              class="bg-blue-50 p-3 rounded border border-blue-200 col-span-2"
            >
              <p class="text-blue-800 text-sm">
                <Icon name="material-symbols:info-outline" class="mr-1" />
                Sila pilih kategori isi rumah untuk meneruskan pengisian kadar.
              </p>
            </div>

            <!-- Step 3: Rate Fields (disabled until both selections are made) -->
            <FormKit
              type="number"
              name="paidHouseRate"
              label="Kadar Kifayah Rumah Berbayar (RM)"
              validation="required|min:0"
              step="0.01"
              :disabled="!canEditRates"
              :validation-messages="{
                required: 'Kadar rumah berbayar adalah wajib',
                min: 'Nilai tidak boleh negatif',
              }"
              :help="!canEditRates ? 'Sila pilih kategori dan jenis isi rumah terlebih dahulu' : 'Nilai akan diisi secara automatik berdasarkan kategori yang dipilih'"
            />

            <FormKit
              type="number"
              name="freeHouseRate"
              label="Kadar Kifayah Rumah Percuma (RM)"
              validation="required|min:0"
              step="0.01"
              :disabled="!canEditRates"
              :validation-messages="{
                required: 'Kadar rumah percuma adalah wajib',
                min: 'Nilai tidak boleh negatif',
              }"
              :help="!canEditRates ? 'Sila pilih kategori dan jenis isi rumah terlebih dahulu' : 'Nilai akan diisi secara automatik berdasarkan kategori yang dipilih'"
            />

            <!-- Success message when rates are auto-filled -->
            <div 
              v-if="ratesAutoFilled"
              class="bg-green-50 p-3 rounded border border-green-200 col-span-2"
            >
              <p class="text-green-800 text-sm">
                <Icon name="material-symbols:check-circle-outline" class="mr-1" />
                ✅ Kadar telah diisi secara automatik berdasarkan kategori <strong>{{ formData.category }}</strong> - <strong>{{ formData.householdType }}</strong>. 
                Anda boleh mengubah nilai jika diperlukan.
              </p>
            </div>

            <!-- Step 4: Date Selection with visual feedback -->
            <FormKit
              type="date"
              name="effectiveDate"
              label="Tarikh Mula Kuat Kuasa"
              validation="required"
              :validation-messages="{
                required: 'Tarikh mula adalah wajib',
              }"
              :help="needsDateSelection ? 'Sila pilih tarikh untuk melengkapkan permohonan' : 'Tarikh kuat kuasa konfigurasi'"
            />

            <!-- Date selection guidance -->
            <div 
              v-if="needsDateSelection"
              class="bg-orange-50 p-3 rounded border border-orange-200 col-span-2"
            >
              <p class="text-orange-800 text-sm">
                <Icon name="material-symbols:calendar-today" class="mr-1" />
                📅 Sila pilih tarikh mula kuat kuasa untuk melengkapkan permohonan konfigurasi.
              </p>
            </div>

            <!-- All steps completed message -->
            <div 
              v-if="allStepsCompleted"
              class="bg-emerald-50 p-3 rounded border border-emerald-200 col-span-2"
            >
              <p class="text-emerald-800 text-sm font-medium">
                <Icon name="material-symbols:task-alt" class="mr-1" />
                🎉 Semua maklumat telah lengkap! Anda boleh hantar permohonan untuk kelulusan.
              </p>
            </div>


          </div>

          <div class="mt-6 flex justify-end gap-4">
            <rs-button
              variant="primary-outline"
              @click="navigateTo('/BF-PRF/KF/HK/admin')"
              type="button"
              :disabled="isSubmitting"
            >
              Batal
            </rs-button>
            <rs-button
              variant="primary"
              type="button"
              @click="showConfirmationModal"
              :disabled="!canSubmit || isSubmitting"
            >
              <span v-if="isSubmitting">
                <Icon name="eos-icons:loading" size="1rem" class="mr-1" />
                Menghantar...
              </span>
              <span v-else>Hantar Untuk Kelulusan</span>
            </rs-button>
          </div>
        </FormKit>
      </template>
    </rs-card>

    <!-- Confirmation Modal -->
    <rs-modal
      v-model="showConfirmModal"
      title="Pengesahan Hantar Permohonan"
      size="lg"
      position="center"
      :hideFooter="true"
    >
      <div class="space-y-4">
        <div class="bg-blue-50 p-4 rounded border border-blue-200">
          <h4 class="font-semibold text-blue-900 mb-2">📋 Ringkasan Permohonan</h4>
          <div class="space-y-2 text-sm text-blue-800">
            <div><strong>Kategori:</strong> {{ formData.category }}</div>
            <div><strong>Jenis Isi Rumah:</strong> {{ formData.householdType }}</div>
            <div><strong>Kadar Rumah Berbayar:</strong> RM {{ formatCurrency(formData.paidHouseRate) }}</div>
            <div><strong>Kadar Rumah Percuma:</strong> RM {{ formatCurrency(formData.freeHouseRate) }}</div>
            <div><strong>Tarikh Mula Kuat Kuasa:</strong> {{ formatDate(formData.effectiveDate) }}</div>
          </div>
        </div>

        <p class="text-gray-700 text-center text-lg">
          Adakah anda pasti ingin tambah Konfigurasi Had Kifayah baharu?
        </p>
      </div>

      <div class="mt-6 flex justify-center gap-4">
        <rs-button
          variant="secondary"
          @click="showConfirmModal = false"
          :disabled="isSubmitting"
        >
          Batal
        </rs-button>
        <rs-button
          variant="primary"
          @click="submitForm"
          :disabled="isSubmitting"
        >
          <span v-if="isSubmitting">
            <Icon name="eos-icons:loading" size="1rem" class="mr-1" />
            Menghantar...
          </span>
          <span v-else>Ya, Tambah Konfigurasi</span>
        </rs-button>
      </div>
    </rs-modal>

    <!-- Success Modal -->
    <rs-modal
      v-model="showSuccessModal"
      title="Berjaya"
      size="md"
      position="center"
      :closable="false"
      :hideFooter="true"
    >
      <div class="text-center space-y-4">
        <div class="text-green-600">
          <Icon name="material-symbols:check-circle" size="4rem" />
        </div>
        
        <div>
          <h4 class="font-semibold text-gray-900 mb-2">Konfigurasi Telah Berjaya Dihantar Untuk Kelulusan!</h4>
          <p class="text-gray-600">
            Permohonan konfigurasi had kifayah baharu telah disimpan dan dihantar untuk proses kelulusan.
          </p>
        </div>
      </div>

      <div class="mt-6 flex justify-center">
        <rs-button
          variant="primary"
          @click="handleSuccessClose"
        >
          Kembali ke Dashboard
        </rs-button>
      </div>
    </rs-modal>
  </div>
</template>

<script setup>
definePageMeta({
  title: "Tambah Konfigurasi Had Kifayah",
});

const router = useRouter();

const breadcrumb = ref([
  {
    name: "Profiling",
    type: "link",
    path: "/BF-PRF/KF/HK/admin",
  },
  {
    name: "Konfigurasi Had Kifayah",
    type: "link",
    path: "/BF-PRF/KF/HK/admin",
  },
  {
    name: "Tambah Baharu",
    type: "current",
    path: "/BF-PRF/KF/HK/admin/tambah",
  },
]);

// Form state
const isSubmitting = ref(false);
const ratesAutoFilled = ref(false);
const showConfirmModal = ref(false);
const showSuccessModal = ref(false);

const formData = ref({
  category: "",
  householdType: "",
  paidHouseRate: 0,
  freeHouseRate: 0,
  effectiveDate: "",
});

// Options
const kategoriOptions = [
  { label: "Utama", value: "Utama" },
  { label: "Tambahan", value: "Tambahan" },
];

// Predefined rate data based on documentation
const rateData = {
  Utama: {
    "Ketua Keluarga": { paidHouseRate: 1215.00, freeHouseRate: 780.00 },
    "Dewasa Bekerja": { paidHouseRate: 412.00, freeHouseRate: 412.00 },
    "Dewasa Tidak Bekerja": { paidHouseRate: 167.00, freeHouseRate: 167.00 },
    "Tanggungan IPT": { paidHouseRate: 613.00, freeHouseRate: 613.00 },
    "Tanggungan 7-17 Tahun": { paidHouseRate: 408.00, freeHouseRate: 408.00 },
    "Tanggungan 6 Tahun ke Bawah": { paidHouseRate: 175.00, freeHouseRate: 175.00 },
    // Additional Utama categories
    "Penjaga Bukan Keluarga": { paidHouseRate: 400.00, freeHouseRate: 400.00 },
    "Tanggungan Tahfiz": { paidHouseRate: 350.00, freeHouseRate: 350.00 },
    "Anak Angkat": { paidHouseRate: 300.00, freeHouseRate: 300.00 },
    "Ibu Bapa Tiri": { paidHouseRate: 500.00, freeHouseRate: 500.00 },
    "Saudara Kandung": { paidHouseRate: 250.00, freeHouseRate: 250.00 },
    "Nenek/Datuk": { paidHouseRate: 600.00, freeHouseRate: 600.00 },
    "Cucu": { paidHouseRate: 200.00, freeHouseRate: 200.00 },
    "Penjaga Khas": { paidHouseRate: 450.00, freeHouseRate: 450.00 },
    "Tanggungan Dewasa OKU": { paidHouseRate: 550.00, freeHouseRate: 550.00 },
    "Anak Yatim Piatu": { paidHouseRate: 380.00, freeHouseRate: 380.00 },
  },
  Tambahan: {
    "OKU": { paidHouseRate: 247.00, freeHouseRate: 247.00 },
    "Pesakit Kronik": { paidHouseRate: 243.00, freeHouseRate: 243.00 },
    "Penjagaan Anak < 12 Tahun": { paidHouseRate: 330.00, freeHouseRate: 330.00 },
    // Additional Tambahan categories
    "Warga Emas": { paidHouseRate: 280.00, freeHouseRate: 280.00 },
    "Keperluan Terapi": { paidHouseRate: 320.00, freeHouseRate: 320.00 },
    "Keperluan Pemulihan": { paidHouseRate: 350.00, freeHouseRate: 350.00 },
    "Bantuan Perubatan": { paidHouseRate: 400.00, freeHouseRate: 400.00 },
    "Keperluan Diet Khas": { paidHouseRate: 200.00, freeHouseRate: 200.00 },
    "Alat Bantu Mobility": { paidHouseRate: 500.00, freeHouseRate: 500.00 },
    "Keperluan Pendidikan Khas": { paidHouseRate: 300.00, freeHouseRate: 300.00 },
    "Rawatan Jangka Panjang": { paidHouseRate: 450.00, freeHouseRate: 450.00 },
    "Keperluan Penjagaan Harian": { paidHouseRate: 380.00, freeHouseRate: 380.00 },
    "Bantuan Teknologi Assistive": { paidHouseRate: 600.00, freeHouseRate: 600.00 },
  }
};

// Household options based on category
const householdOptions = {
  Utama: [
    // Default Utama categories
    { label: "Ketua Keluarga", value: "Ketua Keluarga" },
    { label: "Dewasa Bekerja", value: "Dewasa Bekerja" },
    { label: "Dewasa Tidak Bekerja", value: "Dewasa Tidak Bekerja" },
    { label: "Tanggungan IPT", value: "Tanggungan IPT" },
    { label: "Tanggungan 7-17 Tahun", value: "Tanggungan 7-17 Tahun" },
    { label: "Tanggungan 6 Tahun ke Bawah", value: "Tanggungan 6 Tahun ke Bawah" },
    // Additional Utama categories
    { label: "Penjaga Bukan Keluarga", value: "Penjaga Bukan Keluarga" },
    { label: "Tanggungan Tahfiz", value: "Tanggungan Tahfiz" },
    { label: "Anak Angkat", value: "Anak Angkat" },
    { label: "Ibu Bapa Tiri", value: "Ibu Bapa Tiri" },
    { label: "Saudara Kandung", value: "Saudara Kandung" },
    { label: "Nenek/Datuk", value: "Nenek/Datuk" },
    { label: "Cucu", value: "Cucu" },
    { label: "Penjaga Khas", value: "Penjaga Khas" },
    { label: "Tanggungan Dewasa OKU", value: "Tanggungan Dewasa OKU" },
    { label: "Anak Yatim Piatu", value: "Anak Yatim Piatu" },
  ],
  Tambahan: [
    // Default Tambahan categories
    { label: "OKU", value: "OKU" },
    { label: "Pesakit Kronik", value: "Pesakit Kronik" },
    { label: "Penjagaan Anak < 12 Tahun", value: "Penjagaan Anak < 12 Tahun" },
    // Additional Tambahan categories
    { label: "Warga Emas", value: "Warga Emas" },
    { label: "Keperluan Terapi", value: "Keperluan Terapi" },
    { label: "Keperluan Pemulihan", value: "Keperluan Pemulihan" },
    { label: "Bantuan Perubatan", value: "Bantuan Perubatan" },
    { label: "Keperluan Diet Khas", value: "Keperluan Diet Khas" },
    { label: "Alat Bantu Mobility", value: "Alat Bantu Mobility" },
    { label: "Keperluan Pendidikan Khas", value: "Keperluan Pendidikan Khas" },
    { label: "Rawatan Jangka Panjang", value: "Rawatan Jangka Panjang" },
    { label: "Keperluan Penjagaan Harian", value: "Keperluan Penjagaan Harian" },
    { label: "Bantuan Teknologi Assistive", value: "Bantuan Teknologi Assistive" },
  ]
};

// Computed properties for form state
const currentHouseholdOptions = computed(() => {
  if (!formData.value.category) return [];
  return householdOptions[formData.value.category] || [];
});

const canEditRates = computed(() => {
  return formData.value.category && formData.value.householdType;
});

const needsDateSelection = computed(() => {
  return canEditRates.value && !formData.value.effectiveDate;
});

const allStepsCompleted = computed(() => {
  return formData.value.category && 
         formData.value.householdType && 
         formData.value.paidHouseRate > 0 && 
         formData.value.freeHouseRate > 0 && 
         formData.value.effectiveDate;
});

const canSubmit = computed(() => {
  return allStepsCompleted.value;
});

// Event handlers for autofill functionality
const onCategoryChange = () => {
  console.log('Category changed to:', formData.value.category);
  
  // Reset dependent fields when category changes
  formData.value.householdType = "";
  formData.value.paidHouseRate = 0;
  formData.value.freeHouseRate = 0;
  ratesAutoFilled.value = false;
};

const onHouseholdTypeChange = () => {
  console.log('Household type changed to:', formData.value.householdType);
  
  // Autofill rates based on category and household type
  if (formData.value.category && formData.value.householdType) {
    const rates = rateData[formData.value.category]?.[formData.value.householdType];
    console.log('Found rates:', rates);
    
    if (rates) {
      // Use nextTick to ensure the DOM is updated
      nextTick(() => {
        formData.value.paidHouseRate = rates.paidHouseRate;
        formData.value.freeHouseRate = rates.freeHouseRate;
        ratesAutoFilled.value = true;
        
        console.log('Rates set:', {
          paid: formData.value.paidHouseRate,
          free: formData.value.freeHouseRate
        });
      });
    }
  }
};

// Watch for changes to ensure reactivity
watch(() => formData.value.category, (newVal) => {
  console.log('Watching category change:', newVal);
  onCategoryChange();
});

watch(() => formData.value.householdType, (newVal) => {
  console.log('Watching household type change:', newVal);
  if (newVal) {
    onHouseholdTypeChange();
  }
});

// Methods
const showConfirmationModal = () => {
  showConfirmModal.value = true;
};

const submitForm = async () => {
  isSubmitting.value = true;

  try {
    // Prepare submission data
    const submissionData = {
      ...formData.value,
      paidHouseRate: parseFloat(formData.value.paidHouseRate),
      freeHouseRate: parseFloat(formData.value.freeHouseRate),
      status: "Menunggu Kelulusan",
      submittedAt: new Date().toISOString(),
    };

    // Log the data (in real app, this would be API call)
    console.log("Submitting configuration:", submissionData);

    // Quick buffer/loading state (similar to BF-PS pattern)
    await new Promise(resolve => setTimeout(resolve, 800));

    // Close confirmation modal and show success modal
    showConfirmModal.value = false;
    
    // Small delay before showing success modal for better UX
    setTimeout(() => {
      showSuccessModal.value = true;
    }, 200);

  } catch (error) {
    console.error("Submit error:", error);
    alert("Ralat semasa menambah konfigurasi");
    showConfirmModal.value = false;
  } finally {
    isSubmitting.value = false;
  }
};

const handleSuccessClose = () => {
  showSuccessModal.value = false;
  // Navigate back to admin dashboard
  navigateTo("/BF-PRF/KF/HK/admin");
};

// Helper functions
const formatCurrency = (value) => {
  if (value === undefined || value === null) return "0.00";
  return parseFloat(value).toFixed(2);
};

const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString('ms-MY', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
</script>
