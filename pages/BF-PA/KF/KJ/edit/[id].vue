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
                <!-- Header with Add Button -->
                <div class="flex justify-between items-center mb-4">
                  <h4 class="text-lg font-semibold text-gray-900">Jawatan dalam Kategori</h4>
                  <rs-button variant="primary" size="sm" @click="tambahJawatan">
                    + Tambah Jawatan
                  </rs-button>
                </div>
                
                <!-- Dynamic Rows -->
                <div v-for="(jawatan, index) in formData.maklumatJawatan" :key="index" class="mb-4 p-4 border border-gray-200 rounded-lg">
                  <div class="flex justify-between items-center mb-3">
                    <h5 class="font-medium text-gray-700">Jawatan #{{ index + 1 }}</h5>
                    <rs-button 
                      v-if="index > 0" 
                      variant="danger" 
                      size="sm" 
                      @click="hapusJawatan(index)"
                    >
                      Hapus
                    </rs-button>
                  </div>
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormKit
                      type="text"
                      :name="`namaJawatan_${index}`"
                      label="Nama Jawatan"
                      placeholder="Contoh: Penolong Amil Fitrah"
                      :value="jawatan.namaJawatan"
                      @input="(value) => updateJawatan(index, 'namaJawatan', value)"
                    />
                    <FormKit
                      type="text"
                      :name="`kodJawatan_${index}`"
                      label="Kod Jawatan"
                      placeholder="Contoh: PAF001"
                      :value="jawatan.kodJawatan"
                      @input="(value) => updateJawatan(index, 'kodJawatan', value)"
                    />
                    <FormKit
                      type="select"
                      :name="`statusJawatan_${index}`"
                      label="Status Jawatan"
                      :options="[
                        { label: 'Aktif', value: 'Aktif' },
                        { label: 'Tidak Aktif', value: 'Tidak Aktif' },
                      ]"
                      :value="jawatan.status"
                      @input="(value) => updateJawatan(index, 'status', value)"
                    />
                    <FormKit
                      type="date"
                      :name="`tarikhKuatkuasaJawatan_${index}`"
                      label="Tarikh Kuatkuasa Jawatan"
                      :value="convertToHTMLDateInput(jawatan.tarikhKuatkuasa)"
                      @input="(value) => updateJawatan(index, 'tarikhKuatkuasa', value)"
                    />
                    <div class="md:col-span-2">
                      <FormKit
                        type="textarea"
                        :name="`tanggungjawab_${index}`"
                        label="Tanggungjawab Jawatan"
                        placeholder="Senaraikan tanggungjawab utama..."
                        rows="3"
                        :value="jawatan.tanggungjawab"
                        @input="(value) => updateJawatan(index, 'tanggungjawab', value)"
                      />
                    </div>
                    <div class="md:col-span-2">
                      <FormKit
                        type="textarea"
                        :name="`kelayakan_${index}`"
                        label="Kelayakan Minimum"
                        placeholder="Syarat kelayakan minimum..."
                        rows="3"
                        :value="jawatan.kelayakan"
                        @input="(value) => updateJawatan(index, 'kelayakan', value)"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </rs-tab-item>

            <!-- Maklumat Elaun Tab -->
            <rs-tab-item title="Maklumat Elaun">
              <div class="p-6">
                <!-- Header with Add Button -->
                <div class="flex justify-between items-center mb-4">
                  <h4 class="text-lg font-semibold text-gray-900">Elaun dalam Kategori</h4>
                  <rs-button variant="primary" size="sm" @click="tambahElaun">
                    + Tambah Elaun
                  </rs-button>
                </div>
                
                <!-- Dynamic Rows -->
                <div v-for="(elaun, index) in formData.maklumatElaun" :key="index" class="mb-4 p-4 border border-gray-200 rounded-lg">
                  <div class="flex justify-between items-center mb-3">
                    <h5 class="font-medium text-gray-700">Elaun #{{ index + 1 }}</h5>
                    <rs-button 
                      v-if="index > 0" 
                      variant="danger" 
                      size="sm" 
                      @click="hapusElaun(index)"
                    >
                      Hapus
                    </rs-button>
                  </div>
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormKit
                      type="select"
                      :name="`jenisElaun_${index}`"
                      label="Jenis Elaun"
                      :options="[
                        { label: 'Elaun Bulanan', value: 'Elaun Bulanan' },
                        { label: 'Elaun Tahunan', value: 'Elaun Tahunan' },
                        { label: 'Elaun Khas', value: 'Elaun Khas' },
                        { label: 'Elaun Perjalanan', value: 'Elaun Perjalanan' },
                      ]"
                      :value="elaun.jenisElaun"
                      @input="(value) => updateElaun(index, 'jenisElaun', value)"
                    />
                    <FormKit
                      type="number"
                      :name="`amaun_${index}`"
                      label="Amaun (RM)"
                      placeholder="0.00"
                      :value="elaun.amaun"
                      @input="(value) => updateElaun(index, 'amaun', value)"
                    />
                    <FormKit
                      type="text"
                      :name="`kodBajet_${index}`"
                      label="Kod Bajet"
                      placeholder="Contoh: B001"
                      :value="elaun.kodBajet"
                      @input="(value) => updateElaun(index, 'kodBajet', value)"
                    />
                    <FormKit
                      type="select"
                      :name="`statusElaun_${index}`"
                      label="Status Elaun"
                      :options="[
                        { label: 'Aktif', value: 'Aktif' },
                        { label: 'Tidak Aktif', value: 'Tidak Aktif' },
                      ]"
                      :value="elaun.status"
                      @input="(value) => updateElaun(index, 'status', value)"
                    />
                    <div class="md:col-span-2">
                      <FormKit
                        type="textarea"
                        :name="`catatanElaun_${index}`"
                        label="Catatan Elaun"
                        placeholder="Maklumat tambahan tentang elaun..."
                        rows="2"
                        :value="elaun.catatanElaun"
                        @input="(value) => updateElaun(index, 'catatanElaun', value)"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </rs-tab-item>

            <!-- Maklumat Sesi Tab -->
            <rs-tab-item title="Maklumat Sesi">
              <div class="p-6">
                <!-- Header with Add Button -->
                <div class="flex justify-between items-center mb-4">
                  <h4 class="text-lg font-semibold text-gray-900">Sesi dalam Kategori</h4>
                  <rs-button variant="primary" size="sm" @click="tambahSesi">
                    + Tambah Sesi
                  </rs-button>
                </div>
                
                <!-- Dynamic Rows -->
                <div v-for="(sesi, index) in formData.maklumatSesi" :key="index" class="mb-4 p-4 border border-gray-200 rounded-lg">
                  <div class="flex justify-between items-center mb-3">
                    <h5 class="font-medium text-gray-700">Sesi #{{ index + 1 }}</h5>
                    <rs-button 
                      v-if="index > 0" 
                      variant="danger" 
                      size="sm" 
                      @click="hapusSesi(index)"
                    >
                      Hapus
                    </rs-button>
                  </div>
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormKit
                      type="select"
                      :name="`jenisSesi_${index}`"
                      label="Jenis Sesi"
                      :options="[
                        { label: 'Sesi Pengajian', value: 'Sesi Pengajian' },
                        { label: 'Sesi Latihan', value: 'Sesi Latihan' },
                        { label: 'Sesi Mesyuarat', value: 'Sesi Mesyuarat' },
                        { label: 'Sesi Lain-lain', value: 'Sesi Lain-lain' },
                      ]"
                      :value="sesi.jenisSesi"
                      @input="(value) => updateSesi(index, 'jenisSesi', value)"
                    />
                    <FormKit
                      type="text"
                      :name="`tempohSesi_${index}`"
                      label="Tempoh Sesi"
                      placeholder="Contoh: 1 jam"
                      :value="sesi.tempohSesi"
                      @input="(value) => updateSesi(index, 'tempohSesi', value)"
                    />
                    <FormKit
                      type="select"
                      :name="`statusSesi_${index}`"
                      label="Status Sesi"
                      :options="[
                        { label: 'Belum Bermula', value: 'Belum Bermula' },
                        { label: 'Sedang Berjalan', value: 'Sedang Berjalan' },
                        { label: 'Selesai', value: 'Selesai' },
                        { label: 'Dibatalkan', value: 'Dibatalkan' },
                      ]"
                      :value="sesi.status"
                      @input="(value) => updateSesi(index, 'status', value)"
                    />
                    <div class="md:col-span-2">
                      <FormKit
                        type="textarea"
                        :name="`catatanSesi_${index}`"
                        label="Catatan Sesi"
                        placeholder="Maklumat tambahan tentang sesi..."
                        rows="2"
                        :value="sesi.catatanSesi"
                        @input="(value) => updateSesi(index, 'catatanSesi', value)"
                      />
                    </div>
                  </div>
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
      namaJawatan: "Penolong Amil Fitrah",
      kodJawatan: "PAF001",
      status: "Aktif",
      tarikhKuatkuasa: "01-01-2024",
      tanggungjawab: "Menguruskan kutipan dan pengagihan zakat fitrah",
      kelayakan: "Sijil SPM, pengalaman dalam kerja sosial",
    },
  ],
  maklumatElaun: [
    {
      jenisElaun: "Elaun Bulanan",
      amaun: "500.00",
      kodBajet: "B001",
      status: "Aktif",
      catatanElaun: "Elaun bulanan termasuk elaun perjalanan",
    },
  ],
  maklumatSesi: [
    {
      jenisSesi: "Sesi Pengajian",
      tempohSesi: "1 jam",
      status: "Belum Bermula",
      catatanSesi: "Sesi pengajian tentang zakat fitrah",
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
    namaJawatan: "",
    kodJawatan: "",
    status: "Aktif",
    tarikhKuatkuasa: "",
    tanggungjawab: "",
    kelayakan: "",
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
    jenisElaun: "Elaun Bulanan",
    amaun: "0.00",
    kodBajet: "",
    status: "Aktif",
    catatanElaun: "",
  });
};

const hapusElaun = (index) => {
  formData.value.maklumatElaun.splice(index, 1);
};

const updateElaun = (index, field, value) => {
  formData.value.maklumatElaun[index][field] = value;
};

const tambahSesi = () => {
  formData.value.maklumatSesi.push({
    jenisSesi: "Sesi Pengajian",
    tempohSesi: "1 jam",
    status: "Belum Bermula",
    catatanSesi: "",
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