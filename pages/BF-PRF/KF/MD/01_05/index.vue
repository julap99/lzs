<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Main Content -->
    <div class="space-y-6">
      <!-- Header Card -->
      <rs-card>
        <template #header>
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold">Tambah Kategori Multidimensi</h2>
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
                    help="Pilih tarikh tamat (opsional)"
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
              <div class="flex justify-between pt-6 border-t mt-8">
                <rs-button 
                  type="button" 
                  variant="secondary" 
                  @click="goBack"
                >
                  <Icon name="mdi:arrow-left" class="mr-2" />
                  Kembali
                </rs-button>
                <div class="flex space-x-4">
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
  title: "Tambah Kategori Multidimensi",
});

// Get route for accessing query parameters
const route = useRoute();

const breadcrumb = ref([
  {
    name: "Profiling",
    type: "link",
    path: "/BF-PRF/KF/MD/admin",
  },
  {
    name: "Senarai Multidimensi",
    type: "link",
    path: "/BF-PRF/KF/MD/01_01",
  },
  {
    name: "Maklumat Multidimensi",
    type: "link",
    path: "/BF-PRF/KF/MD/01_02",
  },
  {
    name: "Maklumat Kategori Multidimensi",
    type: "link",
    path: "/BF-PRF/KF/MD/01_03",
  },
  {
    name: "Tambah Kategori Multidimensi",
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
  const route = useRoute();
  const selectedId = route.query.id;
  
  if (selectedId) {
    navigateTo(`/BF-PRF/KF/MD/01_04?id=${selectedId}`);
  } else {
    navigateTo('/BF-PRF/KF/MD/01_03');
  }
};

// Handle form submission
const handleSubmit = async (formValues) => {
  isSubmitting.value = true;
  
  try {
    // Get the selected ID from route query
    const route = useRoute();
    const selectedId = route.query.id;
    
    if (!selectedId) {
      alert('ID tidak ditemukan. Sila kembali dan cuba lagi.');
      return;
    }
    
    // Load existing kuadran data for this multidimensi ID
    const existingKuadranData = JSON.parse(localStorage.getItem('multidimensi_kuadran') || '{}');
    const kuadranList = existingKuadranData[selectedId] || [];
    
    // Generate new ID for the record
    const newId = generateNewId();
    
    // Create new record
    const newRecord = {
      idMultidimensi: selectedId,
      idKuadran: newId,
      kuadran: formValues.kuadran,
      min_merit: formValues.min_merit,
      max_merit: formValues.max_merit,
      status_multidimensi: formValues.status_multidimensi,
      tarikhMula: formValues.tarikhMula,
      tarikhTamat: formValues.tarikhTamat,
      status: formValues.status,
      tindakan: kuadranList.length + 1,
      created_at: new Date().toISOString(),
    };
    
    // Add new record to kuadran data for this multidimensi ID
    kuadranList.push(newRecord);
    existingKuadranData[selectedId] = kuadranList;
    
    // Save to localStorage under multidimensi_kuadran key
    localStorage.setItem('multidimensi_kuadran', JSON.stringify(existingKuadranData));
    
    // Show success message
    console.log('New kuadran record created successfully:', newRecord);
    alert(`Data kuadran berjaya disimpan dengan ID: ${newId}`);
    
    // Navigate back to MD/01_04 to show the kuadran data
    await navigateTo(`/BF-PRF/KF/MD/01_04?id=${selectedId}`);
    
  } catch (error) {
    console.error('Error saving data:', error);
    alert('Ralat semasa menyimpan data.');
  } finally {
    isSubmitting.value = false;
  }
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