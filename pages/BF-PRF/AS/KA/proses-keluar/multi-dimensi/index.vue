<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Analisa Data (Multi Dimensi Asnaf) (NAS)</h2>
        </div>
      </template>

      <template #body>
        <!-- Tab Navigation -->
        <div class="mb-6">
          <rs-tab v-model="activeTab">
            <rs-tab-item title="Analisa Individu">
              <div class="pt-4">
                <!-- Individual Analysis Content -->
                <div class="mb-6">
                  <p class="text-sm text-gray-600 mb-4">
                    Proses mengira status multi dimensi asnaf berdasarkan penilaian 8 kategori utama
                  </p>

                  <FormKit type="form" :actions="false" @submit="handleSubmit">
                    <!-- Basic Information -->
                    <div class="bg-blue-50 p-4 rounded-lg mb-6">
                      <h3 class="font-medium text-blue-800 mb-2">Maklumat Asas</h3>
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormKit
                          type="text"
                          name="icNumber"
                          label="No. Kad Pengenalan"
                          validation="required"
                          v-model="formData.icNumber"
                          :validation-messages="{
                            required: 'No. Kad Pengenalan adalah wajib',
                          }"
                          placeholder="Contoh: 880101121234"
                          disabled
                        />
                        <FormKit
                          type="number"
                          name="age"
                          label="Umur"
                          validation="required|min:0|max:120"
                          v-model="formData.age"
                          :validation-messages="{
                            required: 'Umur adalah wajib',
                            min: 'Umur tidak boleh kurang dari 0',
                            max: 'Umur tidak boleh melebihi 120',
                          }"
                          placeholder="Masukkan umur"
                          disabled
                        />
                      </div>
                    </div>

                    <!-- Mock Data Selection -->
                    <div class="bg-yellow-50 p-4 rounded-lg mb-6">
                      <h3 class="font-medium text-yellow-800 mb-2">Pilih Data Contoh</h3>
                      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <rs-button
                          variant="secondary"
                          @click="loadMockData('adult_productive')"
                          :class="{ 'bg-blue-100 border-blue-300': selectedMockData === 'adult_productive' }"
                        >
                          Dewasa Produktif
                        </rs-button>
                        <rs-button
                          variant="secondary"
                          @click="loadMockData('adult_non_productive')"
                          :class="{ 'bg-blue-100 border-blue-300': selectedMockData === 'adult_non_productive' }"
                        >
                          Dewasa Tidak Produktif
                        </rs-button>
                        <rs-button
                          variant="secondary"
                          @click="loadMockData('minor')"
                          :class="{ 'bg-blue-100 border-blue-300': selectedMockData === 'minor' }"
                        >
                          Kanak-kanak
                        </rs-button>
                      </div>
                    </div>

                    <!-- Category Scoring Section -->
                    <div class="space-y-6">
                      <!-- Age Category -->
                      <div class="bg-gray-50 p-4 rounded-lg">
                        <h3 class="font-medium text-gray-700 mb-3">1. Kategori Umur (Pemberat: 10%)</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div class="bg-white p-3 rounded border">
                            <p class="text-sm text-gray-600">Skor Umur:</p>
                            <p class="text-lg font-semibold text-gray-800">
                              {{ formData.categories.age.score }}/10
                            </p>
                          </div>
                          <div class="bg-white p-3 rounded border">
                            <p class="text-sm text-gray-600">Skor berpemberat:</p>
                            <p class="text-lg font-semibold text-blue-600">
                              {{ calculateWeightedScore('age').toFixed(3) }}
                            </p>
                          </div>
                        </div>
                      </div>

                      <!-- Education Category -->
                      <div class="bg-gray-50 p-4 rounded-lg">
                        <h3 class="font-medium text-gray-700 mb-3">2. Kategori Pendidikan Tertinggi (Pemberat: 15%)</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div class="bg-white p-3 rounded border">
                            <p class="text-sm text-gray-600">Skor Pendidikan:</p>
                            <p class="text-lg font-semibold text-gray-800">
                              {{ formData.categories.education.score }}/10
                            </p>
                          </div>
                          <div class="bg-white p-3 rounded border">
                            <p class="text-sm text-gray-600">Skor berpemberat:</p>
                            <p class="text-lg font-semibold text-blue-600">
                              {{ calculateWeightedScore('education').toFixed(3) }}
                            </p>
                          </div>
                        </div>
                      </div>

                      <!-- Health Category -->
                      <div class="bg-gray-50 p-4 rounded-lg">
                        <h3 class="font-medium text-gray-700 mb-3">3. Kategori Tahap Kesihatan (Pemberat: 20%)</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div class="bg-white p-3 rounded border">
                            <p class="text-sm text-gray-600">Skor Kesihatan:</p>
                            <p class="text-lg font-semibold text-gray-800">
                              {{ formData.categories.health.score }}/10
                            </p>
                          </div>
                          <div class="bg-white p-3 rounded border">
                            <p class="text-sm text-gray-600">Skor berpemberat:</p>
                            <p class="text-lg font-semibold text-blue-600">
                              {{ calculateWeightedScore('health').toFixed(3) }}
                            </p>
                          </div>
                        </div>
                      </div>

                      <!-- Job Category (Only for age >= 19) -->
                      <div v-if="formData.age >= 19" class="bg-gray-50 p-4 rounded-lg">
                        <h3 class="font-medium text-gray-700 mb-3">4. Kategori Pekerjaan (Pemberat: 15%)</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div class="bg-white p-3 rounded border">
                            <p class="text-sm text-gray-600">Skor Pekerjaan:</p>
                            <p class="text-lg font-semibold text-gray-800">
                              {{ formData.categories.job.score }}/10
                            </p>
                          </div>
                          <div class="bg-white p-3 rounded border">
                            <p class="text-sm text-gray-600">Skor berpemberat:</p>
                            <p class="text-lg font-semibold text-blue-600">
                              {{ calculateWeightedScore('job').toFixed(3) }}
                            </p>
                          </div>
                        </div>
                      </div>

                      <!-- Disability Category -->
                      <div class="bg-gray-50 p-4 rounded-lg">
                        <h3 class="font-medium text-gray-700 mb-3">
                          {{ formData.age >= 19 ? '5. Kategori Kecacatan (Pemberat: 10%)' : '4. Kategori Kecacatan (Pemberat: 10%)' }}
                        </h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div class="bg-white p-3 rounded border">
                            <p class="text-sm text-gray-600">Skor Kecacatan:</p>
                            <p class="text-lg font-semibold text-gray-800">
                              {{ formData.categories.disability.score }}/10
                            </p>
                          </div>
                          <div class="bg-white p-3 rounded border">
                            <p class="text-sm text-gray-600">Skor berpemberat:</p>
                            <p class="text-lg font-semibold text-blue-600">
                              {{ calculateWeightedScore('disability').toFixed(3) }}
                            </p>
                          </div>
                        </div>
                      </div>

                      <!-- Experience Category (Only for age >= 19) -->
                      <div v-if="formData.age >= 19" class="bg-gray-50 p-4 rounded-lg">
                        <h3 class="font-medium text-gray-700 mb-3">6. Kategori Pengalaman (Pemberat: 10%)</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div class="bg-white p-3 rounded border">
                            <p class="text-sm text-gray-600">Skor Pengalaman:</p>
                            <p class="text-lg font-semibold text-gray-800">
                              {{ formData.categories.experience.score }}/10
                            </p>
                          </div>
                          <div class="bg-white p-3 rounded border">
                            <p class="text-sm text-gray-600">Skor berpemberat:</p>
                            <p class="text-lg font-semibold text-blue-600">
                              {{ calculateWeightedScore('experience').toFixed(3) }}
                            </p>
                          </div>
                        </div>
                      </div>

                      <!-- Skills Category (Only for age >= 19) -->
                      <div v-if="formData.age >= 19" class="bg-gray-50 p-4 rounded-lg">
                        <h3 class="font-medium text-gray-700 mb-3">7. Kategori Kemahiran (Pemberat: 10%)</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div class="bg-white p-3 rounded border">
                            <p class="text-sm text-gray-600">Skor Kemahiran:</p>
                            <p class="text-lg font-semibold text-gray-800">
                              {{ formData.categories.skills.score }}/10
                            </p>
                          </div>
                          <div class="bg-white p-3 rounded border">
                            <p class="text-sm text-gray-600">Skor berpemberat:</p>
                            <p class="text-lg font-semibold text-blue-600">
                              {{ calculateWeightedScore('skills').toFixed(3) }}
                            </p>
                          </div>
                        </div>
                      </div>

                      <!-- Assets Category (Only for age >= 19) -->
                      <div v-if="formData.age >= 19" class="bg-gray-50 p-4 rounded-lg">
                        <h3 class="font-medium text-gray-700 mb-3">8. Kategori Aset (Pemberat: 10%)</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div class="bg-white p-3 rounded border">
                            <p class="text-sm text-gray-600">Skor Aset:</p>
                            <p class="text-lg font-semibold text-gray-800">
                              {{ formData.categories.assets.score }}/10
                            </p>
                          </div>
                          <div class="bg-white p-3 rounded border">
                            <p class="text-sm text-gray-600">Skor berpemberat:</p>
                            <p class="text-lg font-semibold text-blue-600">
                              {{ calculateWeightedScore('assets').toFixed(3) }}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Calculation Results -->
                    <div class="mt-6">
                      <div class="bg-green-50 p-4 rounded-lg">
                        <h3 class="font-medium text-green-800 mb-3">Hasil Pengiraan Multi Dimensi</h3>
                        
                        <div v-if="processing" class="text-center py-8">
                          <div class="inline-flex items-center px-4 py-2 font-semibold leading-6 text-green-800 bg-green-100 rounded-md">
                            <Icon name="eos-icons:loading" class="animate-spin -ml-1 mr-3 h-5 w-5" />
                            Sedang mengira status multi dimensi...
                          </div>
                        </div>
                        
                        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div class="bg-white p-3 rounded border">
                            <p class="text-sm text-gray-600">Jumlah Skor Pemberat:</p>
                            <p class="text-lg font-semibold text-green-600">
                              {{ totalWeightedScore.toFixed(3) }}
                            </p>
                          </div>
                          <div class="bg-white p-3 rounded border">
                            <p class="text-sm text-gray-600">Merit Multi Dimensi:</p>
                            <p class="text-lg font-semibold text-green-600">
                              {{ multiDimensionalMerit.toFixed(3) }}
                            </p>
                          </div>
                        </div>
                        
                        <div v-if="!processing && multiDimensionalStatus" class="mt-3 bg-white p-3 rounded border">
                          <p class="text-sm text-gray-600">Status Multi Dimensi:</p>
                          <p class="text-xl font-bold" :class="statusColorClass">
                            {{ multiDimensionalStatus }}
                          </p>
                        </div>
                      </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="mt-6 flex justify-end gap-4">
                      <div>
                        <rs-button
                          variant="primary"
                          class="ml-auto"
                          @click="calculateMultiDimensionalStatus"
                          :disabled="processing"
                        >
                          <span v-if="processing">
                            <Icon name="eos-icons:loading" class="ml-1" size="1rem" />
                          </span>
                          <span v-else>Kira Status Multi Dimensi</span>
                        </rs-button>
                      </div>
                    </div>
                  </FormKit>
                </div>
              </div>
            </rs-tab-item>

            <rs-tab-item title="Analisa Keluarga">
              <div class="pt-4">
                <!-- Household Analysis Content -->
                <div class="mb-6">
                  <p class="text-sm text-gray-600 mb-4">
                    Analisa status multi dimensi untuk seluruh keluarga dengan pengiraan merit individu dan purata keluarga
                  </p>
                  
                  <!-- Mock Household Data Selection -->
                  <div class="bg-yellow-50 p-4 rounded-lg mb-6">
                    <h3 class="text-lg font-semibold mb-4 text-yellow-800">Pilih Data Contoh Keluarga</h3>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <rs-button
                        variant="secondary"
                        @click="loadMockHousehold('productive_family')"
                        :class="{ 'bg-blue-100 border-blue-300': selectedMockHousehold === 'productive_family' }"
                      >
                        Keluarga Produktif
                      </rs-button>
                      <rs-button
                        variant="secondary"
                        @click="loadMockHousehold('mixed_family')"
                        :class="{ 'bg-blue-100 border-blue-300': selectedMockHousehold === 'mixed_family' }"
                      >
                        Keluarga Campuran
                      </rs-button>
                      <rs-button
                        variant="secondary"
                        @click="loadMockHousehold('struggling_family')"
                        :class="{ 'bg-blue-100 border-blue-300': selectedMockHousehold === 'struggling_family' }"
                      >
                        Keluarga Bermasalah
                      </rs-button>
                    </div>
                  </div>

                  <!-- Family Members List -->
                  <div v-if="householdMembers.length > 0" class="bg-white border rounded-lg p-6 mb-6">
                    <h3 class="text-lg font-semibold mb-4 text-gray-800">Senarai Ahli Keluarga</h3>
                    
                    <div class="overflow-x-auto">
                      <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                          <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Umur</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hubungan</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Merit</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Skor Detail</th>
                          </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                          <tr v-for="(member, index) in householdMembers" :key="index">
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {{ member.name }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {{ member.age }} tahun
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {{ getRelationshipLabel(member.relationship) }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {{ member.merit.toFixed(3) }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                              <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full" :class="getStatusColor(member.status)">
                                {{ member.status }}
                              </span>
                            </td>
                            <td class="px-6 py-4 text-sm text-gray-500">
                              <button
                                @click="showMemberDetails(member)"
                                class="text-indigo-600 hover:text-indigo-900"
                              >
                                Lihat Detail
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <!-- Household Summary -->
                  <div v-if="householdMembers.length > 0" class="bg-green-50 border border-green-200 rounded-lg p-6">
                    <h3 class="text-lg font-semibold mb-4 text-green-800">Ringkasan Status Keluarga</h3>
                    
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div class="bg-white p-4 rounded border">
                        <p class="text-sm text-gray-600">Purata Merit Keluarga:</p>
                        <p class="text-lg font-semibold text-green-600">
                          {{ averageHouseholdMerit.toFixed(3) }}
                        </p>
                      </div>
                      
                      <div class="bg-white p-4 rounded border">
                        <p class="text-sm text-gray-600">Status Keluarga:</p>
                        <p class="text-lg font-semibold" :class="getStatusColor(householdStatus)">
                          {{ householdStatus }}
                        </p>
                      </div>
                      
                      <div class="bg-white p-4 rounded border">
                        <p class="text-sm text-gray-600">Bilangan Ahli:</p>
                        <p class="text-lg font-semibold text-blue-600">
                          {{ householdMembers.length }} orang
                        </p>
                      </div>
                    </div>

                    <!-- Detailed Analysis -->
                    <div class="mt-4 bg-white p-4 rounded border">
                      <h4 class="font-medium text-gray-800 mb-3">Analisis Terperinci</h4>
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p class="text-sm text-gray-600 mb-2">Status Ahli Keluarga:</p>
                          <div class="space-y-1">
                            <div v-for="(member, index) in householdMembers" :key="index" class="flex justify-between">
                              <span class="text-sm">{{ member.name }}:</span>
                              <span class="text-sm font-medium" :class="getStatusColor(member.status)">
                                {{ member.status }}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <p class="text-sm text-gray-600 mb-2">Merit Individu:</p>
                          <div class="space-y-1">
                            <div v-for="(member, index) in householdMembers" :key="index" class="flex justify-between">
                              <span class="text-sm">{{ member.name }}:</span>
                              <span class="text-sm font-medium text-gray-800">
                                {{ member.merit.toFixed(3) }}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </rs-tab-item>
          </rs-tab>
        </div>

        <!-- Navigation Buttons -->
        <div class="mt-6 flex justify-between gap-4">
          <div>
            <rs-button
              variant="primary-outline"
              @click="navigateTo('/BF-PRF/AS/KA/proses-keluar/hadkifayah')"
            >
              Kembali
            </rs-button>
          </div>

          <div v-if="activeTab === 'Analisa Individu' && multiDimensionalStatus">
            <rs-button
              variant="primary"
              @click="navigateTo('/BF-PRF/AS/KA/senarai-kelulusan')"
            >
              Seterusnya
            </rs-button>
          </div>

          <div v-if="activeTab === 'Analisa Keluarga' && householdResult">
            <rs-button
              variant="primary"
              @click="navigateTo('/BF-PRF/AS/KA/senarai-kelulusan')"
            >
              Seterusnya
            </rs-button>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Member Details Modal -->
    <rs-modal v-model="showDetailsModal" title="Detail Ahli Keluarga">
      <div v-if="selectedMember" class="space-y-4">
        <div class="bg-gray-50 p-3 rounded">
          <h4 class="font-medium text-gray-800">{{ selectedMember.name }}</h4>
          <p class="text-sm text-gray-600">{{ selectedMember.age }} tahun - {{ getRelationshipLabel(selectedMember.relationship) }}</p>
        </div>
        
        <div class="grid grid-cols-2 gap-4">
          <div v-for="(score, category) in selectedMember.categories" :key="category" class="bg-white p-3 rounded border">
            <p class="text-sm text-gray-600">{{ getCategoryLabel(category) }}:</p>
            <p class="text-lg font-semibold text-gray-800">{{ score }}/10</p>
          </div>
        </div>
        
        <div class="bg-blue-50 p-3 rounded">
          <p class="text-sm text-gray-600">Merit Multi Dimensi:</p>
          <p class="text-lg font-semibold text-blue-600">{{ selectedMember.merit.toFixed(3) }}</p>
          <p class="text-sm font-medium" :class="getStatusColor(selectedMember.status)">
            Status: {{ selectedMember.status }}
          </p>
        </div>
      </div>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";

definePageMeta({
  title: "Analisa Data Multi Dimensi Asnaf",
});

const processing = ref(false);
const activeTab = ref('Analisa Individu');
const householdMembers = ref([]);
const householdResult = ref(null);
const selectedMockData = ref('');
const selectedMockHousehold = ref('');
const showDetailsModal = ref(false);
const selectedMember = ref(null);

const breadcrumb = ref([
  {
    name: "Analisa Data",
    type: "current",
    path: "/multi-dimensional-analysis",
  },
]);

// Mock household data sets
const mockHouseholdData = {
  productive_family: [
    {
      name: "Ahmad bin Ismail",
      age: 45,
      relationship: "head",
      categories: {
        age: 6,
        education: 8,
        health: 7,
        job: 8,
        disability: 9,
        experience: 8,
        skills: 7,
        assets: 6
      }
    },
    {
      name: "Siti binti Ahmad",
      age: 42,
      relationship: "spouse",
      categories: {
        age: 7,
        education: 7,
        health: 8,
        job: 6,
        disability: 10,
        experience: 6,
        skills: 6,
        assets: 5
      }
    },
    {
      name: "Mohd Ali bin Ahmad",
      age: 18,
      relationship: "child",
      categories: {
        age: 9,
        education: 8,
        health: 9,
        job: 0,
        disability: 10,
        experience: 0,
        skills: 0,
        assets: 0
      }
    }
  ],
  mixed_family: [
    {
      name: "Rahman bin Omar",
      age: 50,
      relationship: "head",
      categories: {
        age: 5,
        education: 5,
        health: 6,
        job: 4,
        disability: 8,
        experience: 5,
        skills: 4,
        assets: 3
      }
    },
    {
      name: "Fatimah binti Rahman",
      age: 15,
      relationship: "child",
      categories: {
        age: 9,
        education: 6,
        health: 8,
        job: 0,
        disability: 10,
        experience: 0,
        skills: 0,
        assets: 0
      }
    },
    {
      name: "Aminah binti Rahman",
      age: 12,
      relationship: "child",
      categories: {
        age: 9,
        education: 7,
        health: 9,
        job: 0,
        disability: 10,
        experience: 0,
        skills: 0,
        assets: 0
      }
    }
  ],
  struggling_family: [
    {
      name: "Hassan bin Ali",
      age: 55,
      relationship: "head",
      categories: {
        age: 4,
        education: 3,
        health: 4,
        job: 2,
        disability: 7,
        experience: 3,
        skills: 2,
        assets: 1
      }
    },
    {
      name: "Mariam binti Hassan",
      age: 52,
      relationship: "spouse",
      categories: {
        age: 4,
        education: 2,
        health: 5,
        job: 1,
        disability: 8,
        experience: 2,
        skills: 1,
        assets: 1
      }
    },
    {
      name: "Ahmad bin Hassan",
      age: 20,
      relationship: "child",
      categories: {
        age: 8,
        education: 4,
        health: 6,
        job: 3,
        disability: 9,
        experience: 2,
        skills: 3,
        assets: 1
      }
    },
    {
      name: "Sara binti Hassan",
      age: 16,
      relationship: "child",
      categories: {
        age: 9,
        education: 5,
        health: 7,
        job: 0,
        disability: 10,
        experience: 0,
        skills: 0,
        assets: 0
      }
    }
  ]
};

// Load mock household data
const loadMockHousehold = (householdType) => {
  selectedMockHousehold.value = householdType;
  const mockData = mockHouseholdData[householdType];
  
  if (mockData) {
    householdMembers.value = mockData.map(member => {
      const calculatedMerit = calculateMemberMerit(member);
      const status = determineStatus(calculatedMerit);
      return {
        ...member,
        merit: calculatedMerit,
        status: status
      };
    });
  }
};

// Calculate merit for a household member
const calculateMemberMerit = (member) => {
  const isAdult = member.age >= 19;
  let totalWeightedScore = 0;
  
  if (isAdult) {
    // All 8 categories for adults
    totalWeightedScore += (member.categories.age / 10) * 0.10;
    totalWeightedScore += (member.categories.education / 10) * 0.15;
    totalWeightedScore += (member.categories.health / 10) * 0.20;
    totalWeightedScore += (member.categories.job / 10) * 0.15;
    totalWeightedScore += (member.categories.disability / 10) * 0.10;
    totalWeightedScore += (member.categories.experience / 10) * 0.10;
    totalWeightedScore += (member.categories.skills / 10) * 0.10;
    totalWeightedScore += (member.categories.assets / 10) * 0.10;
    
    return totalWeightedScore / 19; // Total weight for adults
  } else {
    // Only 4 categories for minors
    totalWeightedScore += (member.categories.age / 10) * 0.10;
    totalWeightedScore += (member.categories.education / 10) * 0.15;
    totalWeightedScore += (member.categories.health / 10) * 0.20;
    totalWeightedScore += (member.categories.disability / 10) * 0.10;
    
    return totalWeightedScore / 14; // Total weight for minors
  }
};

// Calculate average household merit
const averageHouseholdMerit = computed(() => {
  if (householdMembers.value.length === 0) return 0;
  
  const totalMerit = householdMembers.value.reduce((sum, member) => sum + member.merit, 0);
  return totalMerit / householdMembers.value.length;
});

// Determine household status based on average merit
const householdStatus = computed(() => {
  return determineStatus(averageHouseholdMerit.value);
});

// Helper functions
const getRelationshipLabel = (relationship) => {
  const labels = {
    head: "Ketua Keluarga",
    spouse: "Pasangan",
    child: "Anak",
    parent: "Ibu Bapa",
    sibling: "Adik Beradik"
  };
  return labels[relationship] || relationship;
};

const getCategoryLabel = (category) => {
  const labels = {
    age: "Umur",
    education: "Pendidikan",
    health: "Kesihatan",
    job: "Pekerjaan",
    disability: "Kecacatan",
    experience: "Pengalaman",
    skills: "Kemahiran",
    assets: "Aset"
  };
  return labels[category] || category;
};

const getStatusColor = (status) => {
  switch (status) {
    case "Tegar":
      return "bg-red-100 text-red-800";
    case "Tidak Produktif":
      return "bg-orange-100 text-orange-800";
    case "Produktif C":
      return "bg-yellow-100 text-yellow-800";
    case "Produktif B":
      return "bg-blue-100 text-blue-800";
    case "Produktif A":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const showMemberDetails = (member) => {
  selectedMember.value = member;
  showDetailsModal.value = true;
};

// Mock data sets for individual analysis
const mockDataSets = {
  adult_productive: {
    age: 35,
    categories: {
      age: { score: 8, maxScore: 10 },
      education: { score: 9, maxScore: 10 },
      health: { score: 9, maxScore: 10 },
      job: { score: 8, maxScore: 10 },
      disability: { score: 10, maxScore: 10 },
      experience: { score: 8, maxScore: 10 },
      skills: { score: 9, maxScore: 10 },
      assets: { score: 7, maxScore: 10 },
    }
  },
  adult_non_productive: {
    age: 45,
    categories: {
      age: { score: 3, maxScore: 10 },
      education: { score: 2, maxScore: 10 },
      health: { score: 4, maxScore: 10 },
      job: { score: 1, maxScore: 10 },
      disability: { score: 6, maxScore: 10 },
      experience: { score: 2, maxScore: 10 },
      skills: { score: 1, maxScore: 10 },
      assets: { score: 1, maxScore: 10 },
    }
  },
  minor: {
    age: 15,
    categories: {
      age: { score: 9, maxScore: 10 },
      education: { score: 7, maxScore: 10 },
      health: { score: 8, maxScore: 10 },
      job: { score: 0, maxScore: 10 },
      disability: { score: 10, maxScore: 10 },
      experience: { score: 0, maxScore: 10 },
      skills: { score: 0, maxScore: 10 },
      assets: { score: 0, maxScore: 10 },
    }
  }
};

// Load mock data function
const loadMockData = (dataType) => {
  selectedMockData.value = dataType;
  const mockData = mockDataSets[dataType];
  
  if (mockData) {
    formData.value.age = mockData.age;
    formData.value.categories = { ...mockData.categories };
    
    // Auto-calculate after loading mock data
    setTimeout(() => {
      calculateMultiDimensionalStatus();
    }, 100);
  }
};

// Category weights configuration
const categoryWeights = {
  age: 0.10,        // 10%
  education: 0.15,  // 15%
  health: 0.20,     // 20%
  job: 0.15,        // 15%
  disability: 0.10, // 10%
  experience: 0.10, // 10%
  skills: 0.10,     // 10%
  assets: 0.10,     // 10%
};

const formData = ref({
  icNumber: "000000000000",
  age: 25,
  categories: {
    age: { score: 7, maxScore: 10 },
    education: { score: 6, maxScore: 10 },
    health: { score: 8, maxScore: 10 },
    job: { score: 5, maxScore: 10 },
    disability: { score: 9, maxScore: 10 },
    experience: { score: 4, maxScore: 10 },
    skills: { score: 6, maxScore: 10 },
    assets: { score: 3, maxScore: 10 },
  },
});

const multiDimensionalMerit = ref(0);
const multiDimensionalStatus = ref("");

// Calculate weighted score for a specific category
const calculateWeightedScore = (category) => {
  const score = formData.value.categories[category]?.score || 0;
  const maxScore = formData.value.categories[category]?.maxScore || 10;
  const weight = categoryWeights[category] || 0;
  
  return (score / maxScore) * weight;
};

// Calculate total weighted score
const totalWeightedScore = computed(() => {
  const isAdult = formData.value.age >= 19;
  let total = 0;
  
  if (isAdult) {
    // All 8 categories for adults
    Object.keys(categoryWeights).forEach(category => {
      total += calculateWeightedScore(category);
    });
  } else {
    // Only 4 categories for minors: age, education, health, disability
    const minorCategories = ['age', 'education', 'health', 'disability'];
    minorCategories.forEach(category => {
      total += calculateWeightedScore(category);
    });
  }
  
  return total;
});

// Calculate multi-dimensional merit
const calculateMultiDimensionalMerit = () => {
  const isAdult = formData.value.age >= 19;
  
  if (isAdult) {
    // For adults: calculate merit as percentage of total possible score
    const totalPossibleScore = 10; // Max score per category
    const totalActualScore = Object.values(formData.value.categories).reduce((sum, category) => {
      return sum + (category.score || 0);
    }, 0);
    
    // Calculate merit as percentage (0-1 range)
    multiDimensionalMerit.value = totalActualScore / (totalPossibleScore * 8); // 8 categories for adults
  } else {
    // For minors: calculate merit as percentage of total possible score (4 categories)
    const totalPossibleScore = 10; // Max score per category
    const minorCategories = ['age', 'education', 'health', 'disability'];
    const totalActualScore = minorCategories.reduce((sum, category) => {
      return sum + (formData.value.categories[category]?.score || 0);
    }, 0);
    
    // Calculate merit as percentage (0-1 range)
    multiDimensionalMerit.value = totalActualScore / (totalPossibleScore * 4); // 4 categories for minors
  }
};

// Determine status based on merit
const determineStatus = (merit) => {
  if (merit <= 0.2) return "Tegar";
  if (merit <= 0.4) return "Tidak Produktif";
  if (merit <= 0.6) return "Produktif C";
  if (merit <= 0.8) return "Produktif B";
  return "Produktif A";
};

// Status color class
const statusColorClass = computed(() => {
  const status = multiDimensionalStatus.value;
  switch (status) {
    case "Tegar":
      return "text-red-600";
    case "Tidak Produktif":
      return "text-orange-600";
    case "Produktif C":
      return "text-yellow-600";
    case "Produktif B":
      return "text-blue-600";
    case "Produktif A":
      return "text-green-600";
    default:
      return "text-gray-600";
  }
});

// Main calculation function
const calculateMultiDimensionalStatus = () => {
  if (!formData.value.age) {
    return;
  }

  processing.value = true;

  // Simulate calculation process with random variations
  setTimeout(() => {
    // Generate scores that will produce different statuses
    const statusRanges = [
      // Tegar (0-20%): 0-2 scores
      [0, 1, 2],
      // Tidak Produktif (20-40%): 2-4 scores  
      [2, 3, 4],
      // Produktif C (40-60%): 4-6 scores
      [4, 5, 6],
      // Produktif B (60-80%): 6-8 scores
      [6, 7, 8],
      // Produktif A (80-100%): 8-10 scores
      [8, 9, 10]
    ];
    
    // Randomly select a status range
    const selectedRange = statusRanges[Math.floor(Math.random() * statusRanges.length)];
    
    // Generate scores within the selected range
    const newScores = {
      age: selectedRange[Math.floor(Math.random() * selectedRange.length)],
      education: selectedRange[Math.floor(Math.random() * selectedRange.length)],
      health: selectedRange[Math.floor(Math.random() * selectedRange.length)],
      job: selectedRange[Math.floor(Math.random() * selectedRange.length)],
      disability: selectedRange[Math.floor(Math.random() * selectedRange.length)],
      experience: selectedRange[Math.floor(Math.random() * selectedRange.length)],
      skills: selectedRange[Math.floor(Math.random() * selectedRange.length)],
      assets: selectedRange[Math.floor(Math.random() * selectedRange.length)],
    };

    // Apply new scores to current categories
    Object.keys(newScores).forEach(category => {
      if (formData.value.categories[category]) {
        formData.value.categories[category].score = newScores[category];
      }
    });

    // Recalculate merit and status
    calculateMultiDimensionalMerit();
    multiDimensionalStatus.value = determineStatus(multiDimensionalMerit.value);
    processing.value = false;
    
    // Show success notification
    showCalculationComplete();
  }, 1000);
};

// Show calculation complete notification
const showCalculationComplete = () => {
  // You can add a toast notification here if you have a notification system
  console.log('Calculation complete! New status:', multiDimensionalStatus.value);
};

const handleSubmit = (data) => {
  console.log("Form submitted:", data);
  calculateMultiDimensionalStatus();
};

// Auto-calculate when age changes
const watchAge = () => {
  if (formData.value.age < 19) {
    // Reset adult-only categories for minors
    formData.value.categories.job.score = 0;
    formData.value.categories.experience.score = 0;
    formData.value.categories.skills.score = 0;
    formData.value.categories.assets.score = 0;
  }
};

// Watch for age changes
watch(() => formData.value.age, watchAge);

// Load default mock data on component mount
onMounted(() => {
  loadMockData('adult_productive');
  loadMockHousehold('productive_family');
});
</script>

<!-- BF-PRF/AS/KA/proses-keluar/hadkifayah -->