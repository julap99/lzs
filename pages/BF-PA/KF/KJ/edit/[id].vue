<!-- 
  RTMF SCREEN: PA-KF-KJ-01_03 (Edit Form)
  PURPOSE: Kemaskini maklumat kategori penolong amil
  DESCRIPTION: Edit form for existing Penolong Amil category with tabbed interface (Eksekutif only)
  ROUTE: /BF-PA/KF/KJ/edit/[id]
-->
<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Enhanced Header Section -->
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 flex items-center">
            <Icon name="ph:pencil" class="w-6 h-6 mr-3 text-primary" />
            Kemaskini Kategori Penolong Amil
          </h1>
          <p class="text-gray-600 mt-1">Kemaskini maklumat kategori penolong amil</p>
        </div>
        <div class="flex gap-2">
          <rs-button
            variant="secondary-outline"
            @click="navigateTo('/BF-PA/KF/KJ')"
            class="flex items-center"
          >
            <Icon name="ph:arrow-left" class="w-4 h-4 mr-2" />
            Batal
          </rs-button>
        </div>
      </div>
    </div>

    <!-- Form with Tabbed Interface -->
    <FormKit
      type="form"
      id="editCategoryForm"
      :actions="false"
      @submit="handleSubmit"
    >
      <rs-card>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">Kemaskini Maklumat</h3>
            <div class="text-sm text-gray-500">
              <Icon name="ph:info-fill" class="w-4 h-4 inline mr-1" />
              {{ formData.kategoriPenolongAmil }} - {{ formData.kodSingkatan }}
            </div>
          </div>
        </template>
        
        <template #body>
          <rs-tab v-model="activeTab">
            <!-- Maklumat Kategori Tab -->
            <rs-tab-item title="Maklumat Kategori">
              <div class="p-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormKit
                    type="text"
                    name="kategoriPenolongAmil"
                    label="Kategori Penolong Amil"
                    placeholder="Contoh: Penolong Amil Fitrah"
                    validation="required"
                    :validation-messages="{
                      required: 'Kategori penolong amil diperlukan',
                    }"
                    :value="formData.kategoriPenolongAmil"
                    :disabled="formData.isDefault"
                  />
                  <FormKit
                    type="text"
                    name="kodSingkatan"
                    label="Kod Singkatan"
                    placeholder="Contoh: PAF"
                    validation="required"
                    :validation-messages="{
                      required: 'Kod singkatan diperlukan',
                    }"
                    :value="formData.kodSingkatan"
                    readonly
                  />
                  <FormKit
                    type="select"
                    name="status"
                    label="Status"
                    :options="[
                      { label: 'Aktif', value: 'Aktif' },
                      { label: 'Tidak Aktif', value: 'Tidak Aktif' },
                    ]"
                    validation="required"
                    :validation-messages="{
                      required: 'Status diperlukan',
                    }"
                    :value="formData.status"
                  />
                  <FormKit
                    type="date"
                    name="tarikhKuatkuasa"
                    label="Tarikh Kuatkuasa"
                    validation="required"
                    :validation-messages="{
                      required: 'Tarikh kuatkuasa diperlukan',
                    }"
                    :value="convertToHTMLDateInput(formData.tarikhKuatkuasa)"
                  />
                  <div class="md:col-span-2">
                    <FormKit
                      type="textarea"
                      name="penerangan"
                      label="Penerangan Kategori"
                      placeholder="Huraian ringkas tentang kategori ini..."
                      rows="3"
                      :value="formData.penerangan"
                    />
                  </div>
                </div>
              </div>
            </rs-tab-item>

            <!-- Maklumat Jawatan Tab -->
            <rs-tab-item title="Maklumat Jawatan">
              <div class="p-6">
                <!-- Header -->
                <div class="mb-4">
                  <h4 class="text-lg font-semibold text-gray-900">Jawatan dalam Kategori</h4>
                </div>
                
                <!-- Table for Jawatan -->
                <div class="overflow-x-auto">
                  <table class="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
                    <thead class="bg-gray-50">
                      <tr>
                        <th class="p-3 border text-left text-sm font-medium text-gray-700">Jawatan</th>
                        <th class="p-3 border text-left text-sm font-medium text-gray-700">Kod Singkatan</th>
                        <th class="p-3 border text-left text-sm font-medium text-gray-700">Status</th>
                        <th class="p-3 border text-left text-sm font-medium text-gray-700">Tarikh Kuatkuasa</th>
                        <th class="p-3 border text-left text-sm font-medium text-gray-700">Tindakan</th>
                      </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                      <tr v-for="(jawatan, index) in formData.maklumatJawatan" :key="index">
                        <td class="p-3 border">
                          <input 
                            v-model="jawatan.jawatan" 
                            class="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Contoh: Ketua Penolong Amil"
                          />
                        </td>
                        <td class="p-3 border">
                          <input 
                            v-model="jawatan.kod" 
                            class="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Contoh: PAF"
                          />
                        </td>
                        <td class="p-3 border">
                          <select 
                            v-model="jawatan.status" 
                            class="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="AKTIF">AKTIF</option>
                            <option value="TIDAK AKTIF">TIDAK AKTIF</option>
                          </select>
                        </td>
                        <td class="p-3 border">
                          <input 
                            type="date" 
                            v-model="jawatan.tarikh" 
                            class="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </td>
                        <td class="p-3 border">
                          <rs-button 
                            variant="danger" 
                            size="sm" 
                            @click="hapusJawatan(index)"
                          >
                            <Icon name="ph:trash" class="w-4 h-4" />
                          </rs-button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <!-- Add Button Below Table -->
                <div class="mt-4 flex justify-end">
                  <rs-button variant="secondary" size="sm" @click="tambahJawatan">
                    <Icon name="ph:plus" class="w-4 h-4" />
                  </rs-button>
                </div>
              </div>
            </rs-tab-item>

            <!-- Maklumat Elaun Tab -->
            <rs-tab-item title="Maklumat Elaun">
              <div class="p-6">
                <!-- Header -->
                <div class="mb-4">
                  <h4 class="text-lg font-semibold text-gray-900">Elaun dalam Kategori</h4>
                </div>
                
                <!-- Table for Elaun -->
                <div class="overflow-x-auto">
                  <table class="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
                    <thead class="bg-gray-50">
                      <tr>
                        <th class="p-3 border text-left text-sm font-medium text-gray-700">Jenis Elaun</th>
                        <th class="p-3 border text-left text-sm font-medium text-gray-700">Amaun</th>
                        <th class="p-3 border text-left text-sm font-medium text-gray-700">Kod Bajet</th>
                        <th class="p-3 border text-left text-sm font-medium text-gray-700">Status</th>
                        <th class="p-3 border text-left text-sm font-medium text-gray-700">Tarikh Kuatkuasa</th>
                        <th class="p-3 border text-left text-sm font-medium text-gray-700">Tindakan</th>
                      </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                      <tr v-for="(elaun, index) in formData.maklumatElaun" :key="index">
                        <td class="p-3 border">
                          <input 
                            v-model="elaun.jenis" 
                            class="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Contoh: Bancian Baru: Per Borang Permohonan"
                          />
                        </td>
                        <td class="p-3 border">
                          <input 
                            type="number" 
                            v-model="elaun.amaun" 
                            class="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="0"
                          />
                        </td>
                        <td class="p-3 border">
                          <input 
                            v-model="elaun.kod" 
                            class="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Contoh: B34106"
                          />
                        </td>
                        <td class="p-3 border">
                          <select 
                            v-model="elaun.status" 
                            class="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="AKTIF">AKTIF</option>
                            <option value="TIDAK AKTIF">TIDAK AKTIF</option>
                          </select>
                        </td>
                        <td class="p-3 border">
                          <input 
                            type="date" 
                            v-model="elaun.tarikh" 
                            class="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </td>
                        <td class="p-3 border">
                          <rs-button 
                            variant="danger" 
                            size="sm" 
                            @click="hapusElaun(index)"
                          >
                            <Icon name="ph:trash" class="w-4 h-4" />
                          </rs-button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <!-- Add Button Below Table -->
                <div class="mt-4 flex justify-end">
                  <rs-button variant="secondary" size="sm" @click="tambahElaun">
                    <Icon name="ph:plus" class="w-4 h-4" />
                  </rs-button>
                </div>

                <!-- Elaun Khas Section -->
                <div class="mt-8">
                  <!-- Header -->
                  <div class="mb-4">
                    <h4 class="text-lg font-semibold text-gray-900">Elaun Khas</h4>
                  </div>
                  
                  <!-- Table for Elaun Khas -->
                  <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
                      <thead class="bg-gray-50">
                        <tr>
                          <th class="p-3 border text-left text-sm font-medium text-gray-700">Jenis Elaun</th>
                          <th class="p-3 border text-left text-sm font-medium text-gray-700">Kategori PA</th>
                          <th class="p-3 border text-left text-sm font-medium text-gray-700">Amaun</th>
                          <th class="p-3 border text-left text-sm font-medium text-gray-700">Kod Bajet</th>
                          <th class="p-3 border text-left text-sm font-medium text-gray-700">Status</th>
                          <th class="p-3 border text-left text-sm font-medium text-gray-700">Tarikh Kuatkuasa</th>
                          <th class="p-3 border text-left text-sm font-medium text-gray-700">Target KPI</th>
                          <th class="p-3 border text-left text-sm font-medium text-gray-700">Tindakan</th>
                        </tr>
                      </thead>
                      <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="(elaunKhas, index) in formData.maklumatElaunKhas" :key="index">
                          <td class="p-3 border">
                            <input 
                              v-model="elaunKhas.jenis" 
                              class="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Contoh: KHAS - 48 AKTIVITI/TAHUN"
                            />
                          </td>
                          <td class="p-3 border">
                            <input 
                              v-model="elaunKhas.kategoriPA" 
                              class="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Contoh: PAK+"
                            />
                          </td>
                          <td class="p-3 border">
                            <input 
                              type="number" 
                              v-model="elaunKhas.amaun" 
                              class="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="0"
                            />
                          </td>
                          <td class="p-3 border">
                            <input 
                              v-model="elaunKhas.kod" 
                              class="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Contoh: B31702"
                            />
                          </td>
                          <td class="p-3 border">
                            <select 
                              v-model="elaunKhas.status" 
                              class="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="AKTIF">AKTIF</option>
                              <option value="TIDAK AKTIF">TIDAK AKTIF</option>
                            </select>
                          </td>
                          <td class="p-3 border">
                            <input 
                              type="date" 
                              v-model="elaunKhas.tarikh" 
                              class="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </td>
                          <td class="p-3 border">
                            <input 
                              type="number"
                              v-model="elaunKhas.targetKPI" 
                              class="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="48"
                            />
                          </td>
                                                  <td class="p-3 border">
                                                      <rs-button 
                              variant="danger" 
                              size="sm" 
                              @click="hapusElaunKhas(index)"
                            >
                              <Icon name="ph:trash" class="w-4 h-4" />
                            </rs-button>
                        </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <!-- Add Button Below Table -->
                  <div class="mt-4 flex justify-end">
                    <rs-button variant="secondary" size="sm" @click="tambahElaunKhas">
                      <Icon name="ph:plus" class="w-4 h-4" />
                    </rs-button>
                  </div>
                </div>
              </div>
            </rs-tab-item>

            <!-- Maklumat Sesi Tab -->
            <rs-tab-item title="Maklumat Sesi">
              <div class="p-6">
                <!-- Header -->
                <div class="mb-4">
                  <h4 class="text-lg font-semibold text-gray-900">Sesi dalam Kategori</h4>
                </div>
                
                <!-- Table for Sesi -->
                <div class="overflow-x-auto">
                  <table class="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
                    <thead class="bg-gray-50">
                      <tr>
                        <th class="p-3 border text-left text-sm font-medium text-gray-700">Sesi</th>
                        <th class="p-3 border text-left text-sm font-medium text-gray-700">Tarikh Mula</th>
                        <th class="p-3 border text-left text-sm font-medium text-gray-700">Tarikh Tamat</th>
                        <th class="p-3 border text-left text-sm font-medium text-gray-700">Status</th>
                        <th class="p-3 border text-left text-sm font-medium text-gray-700">Tarikh Kuatkuasa</th>
                        <th class="p-3 border text-left text-sm font-medium text-gray-700">Tindakan</th>
                      </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                      <tr v-for="(sesi, index) in formData.maklumatSesi" :key="index">
                        <td class="p-3 border">
                          <input 
                            v-model="sesi.sesi" 
                            class="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Contoh: SESI 2025-2027"
                          />
                        </td>
                        <td class="p-3 border">
                          <input 
                            type="date" 
                            v-model="sesi.mula" 
                            class="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </td>
                        <td class="p-3 border">
                          <input 
                            type="date" 
                            v-model="sesi.tamat" 
                            class="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </td>
                        <td class="p-3 border">
                          <select 
                            v-model="sesi.status" 
                            class="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="AKTIF">AKTIF</option>
                            <option value="TIDAK AKTIF">TIDAK AKTIF</option>
                          </select>
                        </td>
                        <td class="p-3 border">
                          <input 
                            type="date" 
                            v-model="sesi.tarikh" 
                            class="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </td>
                        <td class="p-3 border">
                          <rs-button 
                            variant="danger" 
                            size="sm" 
                            @click="hapusSesi(index)"
                          >
                            <Icon name="ph:trash" class="w-4 h-4" />
                          </rs-button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <!-- Add Button Below Table -->
                <div class="mt-4 flex justify-end">
                  <rs-button variant="secondary" size="sm" @click="tambahSesi">
                    <Icon name="ph:plus" class="w-4 h-4" />
                  </rs-button>
                </div>
              </div>
            </rs-tab-item>
          </rs-tab>
        </template>
      </rs-card>

      <!-- Maklumat Pegawai Section (Separate from tabs) -->
      <rs-card class="mt-6">
        <template #header>
          <h3 class="text-lg font-semibold text-gray-900 flex items-center">
            <Icon name="ph:user" class="w-5 h-5 mr-2" />
            Maklumat Pegawai (Audit Trail)
          </h3>
        </template>
        <template #body>
          <div class="p-6">
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div class="flex items-center">
                <Icon name="ph:info" class="w-5 h-5 text-blue-600 mr-2" />
                <span class="text-sm text-blue-800 font-medium">Maklumat Audit Trail (Tidak Boleh Diedit)</span>
              </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Dicipta Oleh</label>
                <div class="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                  {{ formData.maklumatPegawai.diciptaOleh }}
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Tarikh Cipta</label>
                <div class="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                  {{ formatDate(formData.maklumatPegawai.tarikhCipta) }}
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Diluluskan Oleh</label>
                <div class="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                  {{ formData.maklumatPegawai.diluluskanOleh || 'Belum diluluskan' }}
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Tarikh Lulus</label>
                <div class="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                  {{ formData.maklumatPegawai.tarikhLulus ? formatDate(formData.maklumatPegawai.tarikhLulus) : 'Belum diluluskan' }}
                </div>
              </div>
            </div>
          </div>
        </template>
      </rs-card>

      <!-- Submit Buttons -->
      <div class="flex justify-end gap-3 mt-6">
        <rs-button
          variant="secondary-outline"
          @click="navigateTo('/BF-PA/KF/KJ')"
        >
          Batal
        </rs-button>
        <rs-button
          variant="primary"
          type="submit"
          :loading="isSubmitting"
        >
          <Icon name="ph:check" class="w-4 h-4 mr-2" />
          Simpan Perubahan
        </rs-button>
      </div>
    </FormKit>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { formatDate, convertToHTMLDateInput } from "~/utils/dateFormatter";

const route = useRoute();

definePageMeta({
  title: "Kemaskini Kategori Penolong Amil",
});

const breadcrumb = ref([
  {
    name: "Utama",
    type: "link",
    path: "/"
  },
  {
    name: "BF-PA",
    type: "link",
    path: "/BF-PA"
  },
  {
    name: "Konfigurasi",
    type: "link",
    path: "/BF-PA/KF/KJ"
  },
  {
    name: "Kemaskini Maklumat",
    type: "current",
    path: "/BF-PA/KF/KJ/edit"
  }
]);

// Form state
const isSubmitting = ref(false);
const activeTab = ref('kategori');

// Mock form data (would be fetched from API in real app)
const formData = ref({
  kategoriPenolongAmil: "Penolong Amil Fitrah",
  kodSingkatan: "PAF",
  status: "Aktif",
  tarikhKuatkuasa: "01-01-2024",
  penerangan: "Kategori untuk menguruskan zakat fitrah",
  isDefault: true,
  maklumatJawatan: [
    {
      jawatan: "Ketua Penolong Amil",
      kod: "PAF",
      status: "AKTIF",
      tarikh: "2025-01-01",
    },
    {
      jawatan: "Penolong Amil",
      kod: "PAF",
      status: "AKTIF",
      tarikh: "2025-01-01",
    },
  ],
  maklumatElaun: [
    {
      jenis: "Elaun Bancian Baru : per borang permohonan",
      amaun: 30,
      kod: "B34106",
      status: "AKTIF",
      tarikh: "2025-01-01",
    },
    {
      jenis: "Elaun Kemaskini/permohonan bantuan : per borang permohonan",
      amaun: 20,
      kod: "B34106",
      status: "AKTIF",
      tarikh: "2025-01-01",
    },
    {
      jenis: "Elaun Tahunan KPAK",
      amaun: 500,
      kod: "B34107",
      status: "AKTIF",
      tarikh: "2025-01-01",
    },
    {
      jenis: "Elaun Tahunan KPAF",
      amaun: 300,
      kod: "B34108",
      status: "AKTIF",
      tarikh: "2025-01-01",
    },
  ],
  maklumatElaunKhas: [
    {
      jenis: "KHAS - 48 AKTIVITI/TAHUN",
      kategoriPA: "PAF",
      amaun: 400,
      kod: "B31702",
      status: "AKTIF",
      tarikh: "2025-01-01",
      targetKPI: 48,
    },
  ],
  maklumatSesi: [
    {
      sesi: "SESI 2025-2027",
      mula: "2025-01-01",
      tamat: "2027-12-31",
      status: "AKTIF",
      tarikh: "2025-01-01",
    },
    {
      sesi: "SESI 2022-2024",
      mula: "2022-01-01",
      tamat: "2024-12-31",
      status: "TIDAK AKTIF",
      tarikh: "2022-01-01",
    },
  ],
  maklumatPegawai: {
    diciptaOleh: "Admin User",
    tarikhCipta: "27-10-2023",
    diluluskanOleh: "Manager",
    tarikhLulus: "28-10-2023",
  },
});

const handleSubmit = async (formData) => {
  isSubmitting.value = true;
  
  try {
    // Log the complete form data structure for backend
    console.log('Form Data for Backend:', {
      kategoriPenolongAmil: formData.kategoriPenolongAmil,
      kodSingkatan: formData.kodSingkatan,
      status: formData.status,
      tarikhKuatkuasa: formData.tarikhKuatkuasa,
      penerangan: formData.penerangan,
      maklumatJawatan: formData.maklumatJawatan, // Array of job positions
      maklumatElaun: formData.maklumatElaun,     // Array of allowances
      maklumatElaunKhas: formData.maklumatElaunKhas, // Array of special allowances
      maklumatSesi: formData.maklumatSesi,       // Array of sessions
      maklumatPegawai: formData.maklumatPegawai
    });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Show success message
    alert("Kategori penolong amil berjaya dikemaskini");
    
    // Navigate back to list
    navigateTo('/BF-PA/KF/KJ');
  } catch (error) {
    console.error('Error updating category:', error);
    alert("Ralat semasa mengemaskini kategori");
  } finally {
    isSubmitting.value = false;
  }
};

const tambahJawatan = () => {
  formData.value.maklumatJawatan.push({
    jawatan: "",
    kod: "",
    status: "AKTIF",
    tarikh: "",
  });
};

const hapusJawatan = (index) => {
  formData.value.maklumatJawatan.splice(index, 1);
};

const updateJawatan = (index, field, value) => {
  formData.value.maklumatJawatan[index][field] = value;
};

const tambahElaun = () => {
  formData.value.maklumatElaun.push({
    jenis: "",
    amaun: 0,
    kod: "",
    status: "AKTIF",
    tarikh: "",
  });
};

const hapusElaun = (index) => {
  formData.value.maklumatElaun.splice(index, 1);
};

const updateElaun = (index, field, value) => {
  formData.value.maklumatElaun[index][field] = value;
};

const tambahElaunKhas = () => {
  formData.value.maklumatElaunKhas.push({
    jenis: "",
    kategoriPA: "",
    amaun: 0,
    kod: "",
    status: "AKTIF",
    tarikh: "",
    targetKPI: 0,
  });
};

const hapusElaunKhas = (index) => {
  formData.value.maklumatElaunKhas.splice(index, 1);
};

const updateElaunKhas = (index, field, value) => {
  formData.value.maklumatElaunKhas[index][field] = value;
};

const tambahSesi = () => {
  formData.value.maklumatSesi.push({
    sesi: "",
    mula: "",
    tamat: "",
    status: "AKTIF",
    tarikh: "",
  });
};

const hapusSesi = (index) => {
  formData.value.maklumatSesi.splice(index, 1);
};

const updateSesi = (index, field, value) => {
  formData.value.maklumatSesi[index][field] = value;
};

onMounted(() => {
  // In real app, fetch category data based on route.params.id
  console.log("Loading category data for editing ID:", route.params.id);
  
  // Role-based access control
  const currentUserRole = "eksekutif"; // This would come from auth system
  if (currentUserRole !== "pt" && currentUserRole !== "eksekutif") {
    alert("Anda tidak mempunyai kebenaran untuk mengemaskini kategori");
    navigateTo('/BF-PA/KF/KJ');
  }
});
</script> 