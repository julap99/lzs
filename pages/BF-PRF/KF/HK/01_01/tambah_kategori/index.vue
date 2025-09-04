<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Tambah Kategori Had Kifayah</h2>
          <rs-button variant="secondary" @click="navigateTo('/BF-PRF/KF/HK/01_01')">
            <Icon name="material-symbols:arrow-back" class="mr-1" /> Kembali
          </rs-button>
        </div>
      </template>

      <template #body>
        <div class="max-w-3xl mx-auto">
          <FormKit
            type="form"
            :actions="false"
            @submit="handleSubmit"
            v-model="formData"
          >
            <!-- Hidden ID Had Kifayah field -->
            <FormKit
              type="hidden"
              name="idHadKifayah"
              :value="selectedId"
            />
            
            <!-- Maklumat Kategori Had Kifayah -->
            <div class="mb-8">
              <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Icon name="mdi:information" class="mr-2 text-blue-600" />
                Maklumat Kategori Had Kifayah
              </h3>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

                <!-- 1. Level Had Kifayah -->
                <div>
                  <FormKit
                    type="select"
                    name="levelHadKifayah"
                    label="Level Had Kifayah"
                    :options="levelOptions"
                    placeholder="Pilih level"
                    validation="required"
                    :validation-messages="{ required: 'Level diperlukan' }"
                  />
                </div>

                <!-- 2. Id Level -->
                <div>
                  <FormKit
                    type="number"
                    name="bil"
                    label="Id Level"
                    placeholder="Contoh: 1, 2, 3"
                    validation="required|number|min:0"
                    :validation-messages="{
                      required: 'Id Level diperlukan',
                      number: 'Masukkan Id Level yang sah',
                      min: 'Nilai mesti >= 0'
                    }"
                  />
                </div>

                <!-- 3. Kategori Had Kifayah -->
                <div>
                  <FormKit
                    type="select"
                    name="kategoriHadKifayah"
                    label="Kategori Had Kifayah"
                    :options="kategoriOptions"
                    placeholder="Pilih kategori"
                    validation="required"
                    :validation-messages="{ required: 'Kategori diperlukan' }"
                  />
                </div>

                <!-- 4. Indicators (Dynamic) -->
                <div class="md:col-span-2">
                  <div class="flex items-center justify-between mb-2">
                    <label class="text-sm font-medium text-gray-700">Indicator</label>
                    <div class="flex gap-2">
                      <rs-button 
                        type="button"
                        variant="outline"
                        size="sm"
                        @click="addIndicator"
                        :disabled="indicators.length >= 5"
                      >
                        <Icon name="mdi:plus" class="mr-1" size="14px" />
                        Tambah Indicator
                      </rs-button>
                      <rs-button 
                        type="button"
                        variant="outline"
                        size="sm"
                        @click="removeIndicator"
                        :disabled="indicators.length <= 1"
                        class="text-red-600 hover:text-red-700"
                      >
                        <Icon name="mdi:minus" class="mr-1" size="14px" />
                        Buang
                      </rs-button>
                    </div>
                  </div>
                  
                  <div class="space-y-3">
                    <div 
                      v-for="(indicator, index) in indicators" 
                      :key="index"
                      class="flex items-center gap-2"
                    >
                      <FormKit
                        type="text"
                        :name="`indicator_${index}`"
                        :label="`Indicator ${index + 1}`"
                        :placeholder="`Contoh: UMUR >= 18`"
                        v-model="indicators[index]"
                        validation="required"
                        :validation-messages="{ required: 'Indicator diperlukan' }"
                        class="flex-1"
                      />
                    </div>
                  </div>
                  
                  <p class="text-xs text-gray-500 mt-2">
                    Minimum 1 indicator, maksimum 5 indicators
                  </p>
                </div>

                <!-- Status (dua checkbox) Aktif / Tidak Aktif -->
                <div class="md:col-span-2">
                  <div class="mb-2">
                    <label class="text-sm font-medium text-gray-700">Status</label>
                  </div>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <FormKit
                      type="checkbox"
                      name="statusAktif"
                      label="Aktif"
                      help="Tandakan jika kategori ini aktif"
                    />
                    <FormKit
                      type="checkbox"
                      name="statusTidakAktif"
                      label="Tidak Aktif"
                      help="Tandakan jika kategori ini tidak aktif"
                    />
                  </div>
                  <p class="text-xs text-gray-500 mt-1">Sila pilih salah satu status sahaja.</p>
                </div>

                <!-- 5. Status Data -->
                <div>
                  <FormKit
                    type="text"
                    name="statusData"
                    label="Status Data"
                    placeholder="Contoh: Draf / Disahkan / Arkib"
                    validation="required"
                    :validation-messages="{ required: 'Status data diperlukan' }"
                  />
                </div>

                <!-- 6. Tarikh Mula -->
                <div>
                  <FormKit
                    type="date"
                    name="tarikhMula"
                    label="Tarikh Mula"
                    validation="required"
                    :validation-messages="{ required: 'Tarikh mula diperlukan' }"
                  />
                </div>

                
              </div>
            </div>

            <!-- Butang Tindakan -->
            <div class="flex justify-end space-x-4 pt-6 border-t">
              <rs-button
                type="button"
                variant="secondary"
                @click="navigateTo('/BF-PRF/KF/HK/01_01')"
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
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";

definePageMeta({
  title: "Tambah Kategori Had Kifayah",
});

// Get query parameters
const route = useRoute();
const selectedId = route.query.id;

const breadcrumb = ref([
  {
    name: "Profiling",
    type: "link",
    path: "/BF-PRF/KF/HK/admin",
  },
  {
    name: "Konfigurasi Had Kifayah",
    type: "link",
    path: "/BF-PRF/KF/HK/01_01",
  },
  {
    name: "Tambah Kategori",
    type: "current",
    path: "/BF-PRF/KF/HK/01_01/tambah_kategori",
  },
]);

const formData = reactive({
  idHadKifayah: selectedId || "",
  levelHadKifayah: "",
  bil: "",
  kategoriHadKifayah: "",
  statusAktif: false,
  statusTidakAktif: false,
  statusData: "",
  tarikhMula: "",
});

// Dynamic indicators array
const indicators = ref([""]);

const isSubmitting = ref(false);

const levelOptions = [
  { label: 'A: Belanja keluarga sebulan', value: 'A: Belanja keluarga sebulan' },
  { label: 'B: Tambahan', value: 'B: Tambahan' },
];

const kategoriOptions = [
  { label: 'rumah berbayar', value: 'rumah berbayar' },
  { label: 'rumah tidak berbayar', value: 'rumah tidak berbayar' },
  { label: 'dewasa bekerja', value: 'dewasa bekerja' },
  { label: 'dewasa tidak bekerja', value: 'dewasa tidak bekerja' },
  { label: 'tanggungan belajar IPT', value: 'tanggungan belajar IPT' },
  { label: 'tanggungan 7-17 tahun', value: 'tanggungan 7-17 tahun' },
  { label: 'tanggungan 6 tahun kebawah', value: 'tanggungan 6 tahun kebawah' },
  { label: 'tanggungan/anak OKU', value: 'tanggungan/anak OKU' },
  { label: 'Kos penjagaan anak/tanggungan', value: 'Kos penjagaan anak/tanggungan' },
  { label: 'kos perubatan sakit kronik', value: 'kos perubatan sakit kronik' },
];

const loadExistingCategories = () => {
  try {
    const saved = localStorage.getItem('kifayahCategories');
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Error loading categories:', e);
  }
  return [];
};

// Methods for managing indicators
const addIndicator = () => {
  if (indicators.value.length < 5) {
    indicators.value.push("");
  }
};

const removeIndicator = () => {
  if (indicators.value.length > 1) {
    indicators.value.pop();
  }
};

// no auto-id required for these fields

const handleSubmit = async (payload) => {
  isSubmitting.value = true;
  try {
    // Validate status mutual exclusivity
    const bothChecked = (payload.statusAktif && payload.statusTidakAktif);
    if (bothChecked) {
      alert('Sila pilih hanya salah satu: Aktif atau Tidak Aktif.');
      isSubmitting.value = false;
      return;
    }

    const existing = loadExistingCategories();
    // Enforce mutual exclusivity on status checkboxes
    const isAktif = payload.statusAktif === true || payload.statusAktif === 'true';
    const isTidakAktif = payload.statusTidakAktif === true || payload.statusTidakAktif === 'true';
    const resolvedStatusAktif = isAktif && !isTidakAktif ? true : (!isAktif && isTidakAktif ? false : isAktif);

    // Combine all indicators into a single string
    const combinedIndicators = indicators.value.filter(ind => ind.trim() !== "").join("; ");
    
    const record = {
      idHadKifayah: selectedId || payload.idHadKifayah,
      levelHadKifayah: payload.levelHadKifayah,
      bil: Number(payload.bil),
      kategoriHadKifayah: payload.kategoriHadKifayah,
      indicator: combinedIndicators,
      statusAktif: resolvedStatusAktif,
      statusData: payload.statusData,
      tarikhMula: payload.tarikhMula,
    };
    existing.push(record);
    localStorage.setItem('kifayahCategories', JSON.stringify(existing));
    alert('Kategori Had Kifayah berjaya disimpan!');
    // Redirect back to the detail page with the same ID
    await navigateTo(`/BF-PRF/KF/HK/01_02?id=${selectedId}`);
  } catch (e) {
    console.error('Error saving category:', e);
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(() => {
  // Initialize form data with selected ID
  if (selectedId) {
    formData.idHadKifayah = selectedId;
  }
});
</script>

<style scoped>
:deep(.formkit-label) {
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

:deep(.formkit-help) {
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

:deep(.formkit-messages) {
  margin-top: 0.25rem;
}

:deep(.formkit-message) {
  font-size: 0.875rem;
  color: #dc2626;
}

:deep(.formkit-input) {
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  padding: 0.75rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

:deep(.formkit-input:focus) {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  outline: none;
}

:deep(.formkit-input[aria-invalid="true"]) {
  border-color: #dc2626;
}

:deep(.formkit-input[aria-invalid="true"]:focus) {
  border-color: #dc2626;
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
}
</style>

