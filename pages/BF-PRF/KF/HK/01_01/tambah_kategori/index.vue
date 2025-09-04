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
        <!-- Debug info - remove in production -->
        <div class="mb-4 p-2 bg-blue-50 rounded border border-blue-200">
          <p class="text-sm text-blue-800">
            <strong>Debug Info:</strong> Selected ID: {{ selectedId || 'Not found' }}
          </p>
        </div>
        
        <div class="max-w-3xl mx-auto">
          <FormKit
            type="form"
            :actions="false"
            @submit="handleSubmit"
            v-model="formData"
          >
            <!-- Maklumat Kategori Had Kifayah -->
            <div class="mb-8">
              <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Icon name="mdi:information" class="mr-2 text-blue-600" />
                Maklumat Kategori Had Kifayah
              </h3>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- 0. ID Had Kifayah (Hidden/Read-only) -->
                <div>
                  <FormKit
                    type="text"
                    name="idHadKifayah"
                    label="ID Had Kifayah"
                    :value="selectedId"
                    disabled
                    help="ID Had Kifayah yang dipilih"
                  />
                </div>

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

                <!-- 4. Indicator -->
                <div>
                  <FormKit
                    type="text"
                    name="indicator"
                    label="Indicator"
                    placeholder="Contoh: UMUR >= 18"
                    validation="required"
                    :validation-messages="{ required: 'Indicator diperlukan' }"
                  />
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
  indicator: "",
  statusAktif: false,
  statusTidakAktif: false,
  statusData: "",
  tarikhMula: "",
});

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

    const record = {
      idHadKifayah: selectedId || payload.idHadKifayah,
      levelHadKifayah: payload.levelHadKifayah,
      bil: Number(payload.bil),
      kategoriHadKifayah: payload.kategoriHadKifayah,
      indicator: payload.indicator,
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
    console.log('Selected ID from URL:', selectedId);
    console.log('Form data initialized with ID:', formData.idHadKifayah);
  } else {
    console.warn('No ID found in URL parameters');
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

