<template>
  <div class="container mx-auto px-4 py-6">
    <h1 class="text-3xl font-bold text-gray-900 mb-6">Pengiraan Multidimensi</h1>
    
    <!-- All Fields in Grid Layout -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <!-- Section Heading -->
      <h3 class="text-lg font-semibold text-gray-800 mb-4">Pengiraan Multidimensi Individu</h3>
      
      <!-- Wrapper -->
<div class="flex flex-col items-center space-y-6">

  <!-- First Row -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-center w-full">
    <!-- IC Number Field -->
    <div class="flex flex-col w-full">
      <label class="block text-sm font-medium text-gray-700 mb-2">Id Pengenalan</label>
      <input
        type="text"
        value="770319035991"
        readonly
        class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900"
        placeholder="IC Number dari halaman 04"
      />
      <p class="text-sm text-gray-500 mt-1">
            Masukkan no id pengenalan
          </p>
    </div>

    <!-- Nama Pemohon Field -->
    <div class="flex flex-col w-full">
      <label class="block text-sm font-medium text-gray-700 mb-2">Nama Pemohon</label>
      <input
        type="text"
        value="ADNAN BIN ABU"
        class="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Masukkan nama pemohon"
      />
      <p class="text-sm text-gray-500 mt-1">Masukkan nama lengkap pemohon</p>
    </div>

    <!-- Skor Dimensi Field -->
    <div class="flex flex-col w-full">
      <label class="block text-sm font-medium text-gray-700 mb-2">Skor Dimensi</label>
      <input
        type="number"
        :value="formData.skorDimensi"
        @input="validateSkorDimensi($event, 'skorDimensi')"
        max="1"
        min="0"
        step="0.01"
        class="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Masukkan skor dimensi"
      />
      <p class="text-sm text-gray-500 mt-1">Masukkan skor dimensi dari 0-1</p>
    </div>
  </div>

  <!-- Second Row -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-center w-full">
    <!-- IC Number -->
    <div class="flex flex-col w-full">
      <label class="block text-sm font-medium text-gray-700 mb-2">Id Pengenalan</label>
      <input
        type="text"
        value="801004035672"
        readonly
        class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900"
      />
      <p class="text-sm text-gray-500 mt-1">
            Masukkan no id pengenalan
          </p>
    </div>

    <!-- Pasangan -->
    <div class="flex flex-col w-full">
      <label class="block text-sm font-medium text-gray-700 mb-2">Nama Tanggungan Pertama</label>
      <input
        type="text"
        value="ROHANA BINTI AHMAD"
        class="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Masukkan nama tanggungan 1"
      />
      <p class="text-sm text-gray-500 mt-1">Masukkan nama tanggungan pertama</p>
    </div>

    <!-- Skor Dimensi Field 2 -->
    <div class="flex flex-col w-full">
      <label class="block text-sm font-medium text-gray-700 mb-2">Skor Dimensi</label>
      <input
        type="number"
        :value="formData.skorDimensi2"
        @input="validateSkorDimensi($event, 'skorDimensi2')"
        max="1"
        min="0"
        step="0.01"
        class="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Masukkan skor dimensi"
      />
      <p class="text-sm text-gray-500 mt-1">Masukkan skor dimensi dari 0-1</p>
    </div>
  </div>

  <!-- Third Row -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-center w-full">
    <!-- IC Number -->
    <div class="flex flex-col w-full">
      <label class="block text-sm font-medium text-gray-700 mb-2">Id Pengenalan</label>
      <input
        type="text"
        value="060802030272"
        readonly
        class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900"
      />
      <p class="text-sm text-gray-500 mt-1">
            Masukkan no id pengenalan
          </p>
    </div>

    <!-- Nama Tanggungan 1 -->
    <div class="flex flex-col w-full">
      <label class="block text-sm font-medium text-gray-700 mb-2">Nama Tanggungan Kedua</label>
      <input
        type="text"
        value="NUR NAJWA BINTI ADNAN"
        class="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Masukkan nama tanggungan 2"
      />
      <p class="text-sm text-gray-500 mt-1">Masukkan nama tanggungan kedua</p>
    </div>

    <!-- Skor Dimensi Field 3 -->
    <div class="flex flex-col w-full">
      <label class="block text-sm font-medium text-gray-700 mb-2">Skor Dimensi</label>
      <input
        type="number"
        :value="formData.skorDimensi3"
        @input="validateSkorDimensi($event, 'skorDimensi3')"
        max="1"
        min="0"
        step="0.01"
        class="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Masukkan skor dimensi"
      />
      <p class="text-sm text-gray-500 mt-1">Masukkan skor dimensi dari 0-1</p>
    </div>
  </div>

  <!-- Fourth Row -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-center w-full">
    <!-- IC Number -->
    <div class="flex flex-col w-full">
      <label class="block text-sm font-medium text-gray-700 mb-2">Id Pengenalan</label>
      <input
        type="text"
        value="091108030442"
        readonly
        class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-900"
      />
      <p class="text-sm text-gray-500 mt-1">
            Masukkan no id pengenalan
          </p>
    </div>

    <!-- Nama Tanggungan 2 -->
    <div class="flex flex-col w-full">
      <label class="block text-sm font-medium text-gray-700 mb-2">Nama Tanggungan Ketiga</label>
      <input
        type="text"
        value="NUR QISTINA BINTI ADNAN"
        class="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Masukkan nama tanggungan 3"
      />
      <p class="text-sm text-gray-500 mt-1">Masukkan nama tanggungan ketiga</p>
    </div>

    <!-- Skor Dimensi Field 4 -->
    <div class="flex flex-col w-full">
      <label class="block text-sm font-medium text-gray-700 mb-2">Skor Dimensi</label>
      <input
        type="number"
        :value="formData.skorDimensi4"
        @input="validateSkorDimensi($event, 'skorDimensi4')"
        max="1"
        min="0"
        step="0.01"
        class="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Masukkan skor dimensi"
      />
      <p class="text-sm text-gray-500 mt-1">Masukkan skor dimensi dari 0-1</p>
    </div>
  </div>

</div>
</div>

    <!-- Merit Calculation Result -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">Hasil Pengiraan Multidimensi Keluarga</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Merit Value -->
        <div class="bg-blue-50 p-4 rounded-lg">
          <label class="block text-sm font-medium text-blue-900 mb-2">Merit</label>
          <div class="text-2xl font-bold text-blue-700">{{ meritValue }}</div>
          <p class="text-sm text-blue-600 mt-1">Purata skor dimensi ({{ totalSkor }}/4)</p>
        </div>

        <!-- Status Multidimensi -->
        <div class="bg-green-50 p-4 rounded-lg">
          <label class="block text-sm font-medium text-green-900 mb-2">Status Multidimensi</label>
          <div class="text-2xl font-bold text-green-700">{{ statusMultidimensi }}</div>
          <p class="text-sm text-green-600 mt-1">{{ statusDescription }}</p>
        </div>
      </div>
    </div>
  </div>
              
  <div class="flex justify-between items-center">
  <rs-button
    variant="primary-outline"
    @click="navigateTo('/BF-PRF/AS/FR/04')"
  >
    Kembali
  </rs-button>

  <rs-button
    variant="primary"
    @click="navigateTo(`/BF-BTN/tugasan/siasatan-eoad`)"
    :disabled="processing"
  >
    <span v-if="processing">
      <Icon name="eos-icons:loading" class="ml-1" size="1rem" />
    </span>
    <span v-else>Seterusnya</span>
  </rs-button>
</div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const formData = ref({
  icNumber: '000000000000', // Default value from 04 page
  namaPemohon: '', // Applicant name
  skorDimensi: '', // Dimensional score
  isteriPemohon: '', // Applicant's wife name
  skorDimensi2: '', // Second dimensional score
  namaTanggungan1: '', // First dependent name
  skorDimensi3: '', // Third dimensional score
  namaTanggungan2: '', // Second dependent name
  skorDimensi4: '' // Fourth dimensional score
})

// Computed property to calculate total skor
const totalSkor = computed(() => {
  const skor1 = Number(formData.value.skorDimensi) || 0
  const skor2 = Number(formData.value.skorDimensi2) || 0
  const skor3 = Number(formData.value.skorDimensi3) || 0
  const skor4 = Number(formData.value.skorDimensi4) || 0
  
  return skor1 + skor2 + skor3 + skor4
})

// Computed property to calculate merit (total skor / 4)
const meritValue = computed(() => {
  if (totalSkor.value === 0) return '0.00'
  return (totalSkor.value / 4).toFixed(2)
})

// Computed property to determine status based on merit
const statusMultidimensi = computed(() => {
  const merit = Number(meritValue.value)
  
  if (merit >= 0 && merit <= 0.24) return 'Tegar'
  if (merit >= 0.25 && merit <= 0.49) return 'Tidak Produktif'
  if (merit >= 0.5 && merit <= 0.74) return 'Produktif C'
  if (merit >= 0.75 && merit <= 0.99) return 'Produktif B'
  if (merit >= 1) return 'Produktif A'
  
  return 'Tidak Diketahui'
})

// Computed property for status description
const statusDescription = computed(() => {
  const merit = Number(meritValue.value)
  
  if (merit >= 0 && merit <= 0.24) return 'Merit 0 - 0.24'
  if (merit >= 0.25 && merit <= 0.49) return 'Merit 0.25 - 0.49'
  if (merit >= 0.5 && merit <= 0.74) return 'Merit 0.5 - 0.74'
  if (merit >= 0.75 && merit <= 0.99) return 'Merit 0.75 - 0.99'
  if (merit >= 1) return 'Merit 1'
  
  return 'Merit tidak valid'
})

const fetchIcNumber = () => {
  // In a real application, this would fetch data from the 04 page
  // For now, we'll simulate getting the IC number from the previous page
  formData.value.icNumber = '000000000000' // Default value from 04 page
}

// Add validation function
const validateSkorDimensi = (event, fieldName) => {
  let value = parseFloat(event.target.value)
  
  // If value is NaN or empty, set to empty string
  if (isNaN(value) || event.target.value === '') {
    formData.value[fieldName] = ''
    return
  }
  
  // Ensure value is between 0 and 1
  if (value < 0) {
    value = 0
  } else if (value > 1) {
    value = 1
  }
  
  // Update the form data with validated value
  formData.value[fieldName] = value.toString()
  
  // Update the input field to show the validated value
  event.target.value = value.toString()
}

onMounted(() => {
  // Automatically fetch the IC number when the page loads
  fetchIcNumber()
})
</script>
