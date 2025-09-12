<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Main Content -->
    <div class="space-y-6">
      <!-- Header Card -->
      <rs-card>
        <template #header>
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold">Tambah Kuadran</h2>
          </div>
        </template>
      </rs-card>

      <!-- Main Information Card -->
      <rs-card>
        <template #header>
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-semibold">Maklumat Kuadran</h3>
          </div>
        </template>
        <template #body>
          <div class="max-w-4xl mx-auto">
            <FormKit 
              type="form" 
              :actions="false" 
              @submit="handleSubmit"
            >
              <div class="grid grid-cols-1 gap-6">
                <!-- Kuadran -->
                <div>
                  <FormKit
                    type="text"
                    name="kuadran"
                    label="Kuadran"
                    placeholder="Masukkan kuadran"
                    v-model="formData.kuadran"
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
                    v-model="formData.min_merit"
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
                    v-model="formData.max_merit"
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
                    v-model="formData.status_multidimensi"
                    validation="required"
                    :validation-messages="{
                      required: 'Status multidimensi diperlukan'
                    }"
                    help="Masukkan status multidimensi"
                  />
                </div>

                <!-- Status -->
                <div>
                  <FormKit
                    type="select"
                    name="status"
                    label="Status"
                    placeholder="Pilih status"
                    v-model="formData.status"
                    validation="required"
                    :validation-messages="{
                      required: 'Status diperlukan'
                    }"
                    :options="[
                      { label: 'Aktif', value: 'Aktif' },
                      { label: 'Tidak Aktif', value: 'Tidak Aktif' },
                      { label: 'Menunggu Kelulusan', value: 'Menunggu Kelulusan' }
                    ]"
                    help="Pilih status kuadran"
                  />
                </div>

                <!-- Status Data -->
                <div>
                  <FormKit
                    type="text"
                    name="status_data"
                    label="Status Data"
                    placeholder="Masukkan status data"
                    v-model="formData.status_data"
                    validation="required"
                    :validation-messages="{
                      required: 'Status data diperlukan'
                    }"
                    help="Masukkan status data"
                  />
                </div>

                <!-- Tarikh Mula -->
                <div>
                  <FormKit
                    type="date"
                    name="tarikhMula"
                    label="Tarikh Mula"
                    v-model="formData.tarikhMula"
                    validation="required"
                    :validation-messages="{
                      required: 'Tarikh mula diperlukan'
                    }"
                    help="Pilih tarikh mula kuadran"
                  />
                </div>

                <!-- Tarikh Tamat -->
                <div>
                  <FormKit
                    type="date"
                    name="tarikhTamat"
                    label="Tarikh Tamat"
                    v-model="formData.tarikhTamat"
                    validation="required"
                    :validation-messages="{
                      required: 'Tarikh tamat diperlukan'
                    }"
                    help="Pilih tarikh tamat kuadran"
                  />
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex justify-end gap-4 mt-8">
                <rs-button variant="secondary" @click="goBack">
                  Batal
                </rs-button>
                <FormKit type="submit" variant="primary">
                  Simpan
                </FormKit>
              </div>
            </FormKit>
          </div>
        </template>
      </rs-card>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";

definePageMeta({
  title: "Tambah Kuadran",
});

const breadcrumb = ref([
  {
    name: "Profiling",
    type: "link",
    path: "/BF-PRF/KF/MD/01_06",
  },
  {
    name: "Senarai Kuadran",
    type: "link",
    path: "/BF-PRF/KF/MD/01_06",
  },
  {
    name: "Tambah Kuadran",
    type: "current",
    path: "/BF-PRF/KF/MD/01_06/tambah",
  },
]);

// Form data
const formData = reactive({
  kuadran: "",
  min_merit: "",
  max_merit: "",
  status_multidimensi: "",
  status: "",
  status_data: "",
  tarikhMula: "",
  tarikhTamat: "",
});

// Initialize form with default values
const initializeForm = () => {
  formData.kuadran = "";
  formData.min_merit = "";
  formData.max_merit = "";
  formData.status_multidimensi = "";
  formData.status = "";
  formData.status_data = "";
  formData.tarikhMula = "";
  formData.tarikhTamat = "";
};

// Handle form submission
const handleSubmit = (formValues) => {
  try {
    // Get existing data from localStorage
    const existingData = JSON.parse(localStorage.getItem('multidimensi') || '[]');
    
    // Create new record with unique ID
    const newRecord = {
      idHadKifayah: `KQ${Date.now().toString().slice(-6)}`, // Kuadran ID
      kuadran: formValues.kuadran,
      min_merit: formValues.min_merit,
      max_merit: formValues.max_merit,
      status_multidimensi: formValues.status_multidimensi,
      status: formValues.status,
      status_data: formValues.status_data,
      tarikhMula: formValues.tarikhMula,
      tarikhTamat: formValues.tarikhTamat,
      // Add other required fields for compatibility
      namaHadKifayah: formValues.kuadran, // Use kuadran as name
      keterangan: `Kuadran ${formValues.kuadran}`,
    };

    // Add new record to existing data
    existingData.push(newRecord);

    // Save updated data to localStorage
    localStorage.setItem('multidimensi', JSON.stringify(existingData));

    // Show success message
    alert('Data kuadran berjaya disimpan!');

    // Navigate back to list
    navigateTo('/BF-PRF/KF/MD/01_06');
  } catch (error) {
    console.error('Error saving data:', error);
    alert('Ralat semasa menyimpan data. Sila cuba lagi.');
  }
};

// Go back function
const goBack = () => {
  navigateTo('/BF-PRF/KF/MD/01_06');
};

// Initialize form on component mount
initializeForm();
</script>
