<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Main Content -->
    <div class="space-y-6">
      <!-- Header Card -->
      <rs-card>
        <template #header>
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold">Tambah Multidimensi</h2>
          </div>
        </template>
      </rs-card>

      <!-- Main Information Card -->
      <rs-card>
        <template #header>
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold">Maklumat Multidimensi</h3>
          </div>
        </template>
        <template #body>
          <div class="max-w-4xl mx-auto">
            <FormKit 
              type="form" 
              :actions="false" 
              @submit="handleSubmit"
              v-model="formData"
            >
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Kuadran -->
                <div>
                  <FormKit
                    type="text"
                    name="kuadran"
                    label="Kuadran"
                    placeholder="Masukkan kuadran"
                    validation="required"
                    :validation-messages="{
                      required: 'Kuadran diperlukan'
                    }"
                    help="Masukkan kuadran multidimensi"
                  />
                </div>

                <!-- Min Merit -->
                <div>
                  <FormKit
                    type="text"
                    name="min_merit"
                    label="Min Merit"
                    placeholder="Masukkan min merit"
                    validation="required"
                    :validation-messages="{
                      required: 'Min merit diperlukan'
                    }"
                    help="Masukkan nilai min merit"
                  />
                </div>

                <!-- Max Merit -->
                <div>
                  <FormKit
                    type="text"
                    name="max_merit"
                    label="Max Merit"
                    placeholder="Masukkan max merit"
                    validation="required"
                    :validation-messages="{
                      required: 'Max merit diperlukan'
                    }"
                    help="Masukkan nilai max merit"
                  />
                </div>

                <!-- Status Multidimensi -->
                <div>
                  <FormKit
                    type="text"
                    name="status_multidimensi"
                    label="Status Multidimensi"
                    placeholder="Masukkan status multidimensi"
                    validation="required"
                    :validation-messages="{
                      required: 'Status multidimensi diperlukan'
                    }"
                    help="Masukkan status multidimensi"
                  />
                </div>

                <!-- Tarikh Mula -->
                <div>
                  <FormKit
                    type="date"
                    name="tarikhMula"
                    label="Tarikh Mula"
                    validation="required"
                    :validation-messages="{
                      required: 'Tarikh mula diperlukan'
                    }"
                    help="Pilih tarikh mula berkuatkuasa"
                  />
                </div>

                <!-- Tarikh Tamat -->
                <div>
                  <FormKit
                    type="date"
                    name="tarikhTamat"
                    label="Tarikh Tamat"
                    validation="required"
                    :validation-messages="{
                      required: 'Tarikh tamat diperlukan'
                    }"
                    help="Pilih tarikh tamat"
                  />
                </div>

                <!-- Status -->
                <div>
                  <FormKit
                    type="select"
                    name="status"
                    label="Status"
                    :options="statusOptions"
                    placeholder="Pilih status"
                    validation="required"
                    :validation-messages="{
                      required: 'Status diperlukan'
                    }"
                    help="Pilih status multidimensi"
                  />
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex justify-end space-x-4 pt-6 border-t mt-8">
                <rs-button 
                  type="button" 
                  variant="secondary" 
                  @click="goBack"
                >
                  Batal
                </rs-button>
                <rs-button 
                  btnType="submit" 
                  variant="primary"
                  :disabled="isSubmitting"
                >
                  <Icon v-if="isSubmitting" name="mdi:loading" class="animate-spin mr-2" />
                  <Icon v-else name="material-symbols:save" class="mr-2" />
                  {{ isSubmitting ? 'Menyimpan...' : 'Simpan' }}
                </rs-button>
              </div>
            </FormKit>
          </div>
        </template>
      </rs-card>

    </div>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";

definePageMeta({
  title: "Tambah Multidimensi",
});

// Read optional No-based id from query for navigation context
const route = useRoute();
const selectedNo = computed(() => {
  const q = route.query?.id;
  const n = Number(q);
  return isNaN(n) ? null : n;
});

const breadcrumb = ref([
  {
    name: "Profiling",
    type: "link",
    path: "/BF-PRF/KF/MD/admin",
  },
  {
    name: "Konfigurasi Had Kifayah",
    type: "link",
    path: "/BF-PRF/KF/MD/01_01",
  },
  {
    name: "Tambah Multidimensi",
    type: "current",
    path: "/BF-PRF/KF/MD/01_05",
  },
]);

// State management
const isSubmitting = ref(false);

// Form data
const formData = reactive({
  kuadran: "",
  min_merit: "",
  max_merit: "",
  status_multidimensi: "",
  tarikhMula: "",
  tarikhTamat: "",
  status: "",
});


// Status options
const statusOptions = [
  { label: "Aktif", value: "Aktif" },
  { label: "Tidak Aktif", value: "Tidak Aktif" },
  { label: "Menunggu Kelulusan", value: "Menunggu Kelulusan" },
];

// Generate new ID for new record
const generateNewId = () => {
  const timestamp = Date.now();
  return `MD${timestamp.toString().slice(-6)}`;
};

// Navigation function
const goBack = () => {
  if (selectedNo.value !== null) {
    navigateTo(`/BF-PRF/KF/MD/01_03?id=${selectedNo.value}`);
  } else {
    navigateTo('/BF-PRF/KF/MD/01_03');
  }
};

// Handle form submission
const handleSubmit = async (formValues) => {
  isSubmitting.value = true;
  
  try {
    // Load existing data
    const existingData = loadExistingData();
    
    // Generate new ID for the record
    const newId = generateNewId();
    
    // Create new record
    const newRecord = {
      idHadKifayah: newId,
      namaHadKifayah: "Multidimensi",
      kuadran: formValues.kuadran,
      min_merit: formValues.min_merit,
      max_merit: formValues.max_merit,
      status_multidimensi: formValues.status_multidimensi,
      tarikhMula: formValues.tarikhMula,
      tarikhTamat: formValues.tarikhTamat,
      status: formValues.status,
      tindakan: existingData.length + 1,
      created_at: new Date().toISOString(),
    };
    
    // Add new record to existing data
    existingData.push(newRecord);
    
    // Save to localStorage
    localStorage.setItem('kifayahLimits', JSON.stringify(existingData));
    
    // Show success message
    console.log('New record created successfully:', newRecord);
    alert(`Data berjaya disimpan dengan ID: ${newId}`);
    
    // Navigate back
    await navigateTo('/BF-PRF/KF/MD/01_02');
    
  } catch (error) {
    console.error('Error saving data:', error);
    alert('Ralat semasa menyimpan data.');
  } finally {
    isSubmitting.value = false;
  }
};

// Function to load existing data from localStorage
const loadExistingData = () => {
  try {
    const savedData = localStorage.getItem('kifayahLimits');
    if (savedData) {
      return JSON.parse(savedData);
    }
  } catch (error) {
    console.error('Error loading existing data:', error);
  }
  return [];
};

// Initialize form for new record
const initializeForm = () => {
  // Reset form data
  formData.kuadran = "";
  formData.min_merit = "";
  formData.max_merit = "";
  formData.status_multidimensi = "";
  formData.tarikhMula = "";
  formData.tarikhTamat = "";
  formData.status = "";
};



// Initialize form when component mounts
onMounted(() => {
  initializeForm();
});

</script>