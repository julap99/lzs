<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Kategori Maklumat</h2>
          <rs-button variant="secondary" @click="navigateTo('/BF-PRF/KF/RUU/01_01')">
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
            <!-- Form Fields -->
            <div class="mb-8">
              <div class="grid grid-cols-1 gap-6">

                <!-- Kod -->
                <div>
                  <FormKit
                    type="text"
                    name="kod"
                    label="Kod"
                    placeholder="Contoh: 1"
                    validation="required|matches:/^[a-zA-Z0-9]+$/"
                    :validation-messages="{
                      required: 'Kod diperlukan',
                      matches: 'Hanya huruf dan nombor dibenarkan'
                    }"
                  />
                </div>

                <!-- Kategori Maklumat -->
                <div>
                  <FormKit
                    type="text"
                    name="namaKategori"
                    label="Kategori Maklumat"
                    placeholder="Contoh: Peribadi"
                    validation="required"
                    :validation-messages="{ required: 'Kategori Maklumat diperlukan' }"
                  />
                </div>

                <!-- Status (radio buttons) Aktif / Tidak Aktif -->
                <div>
                  <FormKit
                    type="radio"
                    name="status"
                    label="Status :"
                    :options="[
                      { label: 'Aktif', value: 'Aktif' },
                      { label: 'Tidak Aktif', value: 'Tidak Aktif' }
                    ]"
                    validation="required"
                    :validation-messages="{ required: 'Status diperlukan' }"
                  />
                </div>

                <!-- Status Data -->
                <div>
                  <FormKit
                    type="text"
                    name="statusData"
                    label="Status data :"
                    placeholder="Contoh: Draf"
                    validation="required"
                    :validation-messages="{ required: 'Status data diperlukan' }"
                  />
                </div>

                <!-- Tarikh Mula -->
                <div>
                  <FormKit
                    type="date"
                    name="tarikhMula"
                    label="Tarikh Mula :"
                    validation="required"
                    :validation-messages="{ required: 'Tarikh mula diperlukan' }"
                  />
                </div>

                <!-- Tarikh Tamat -->
                <div>
                  <FormKit
                    type="date"
                    name="tarikhTamat"
                    label="Tarikh Tamat :"
                  />
                </div>

              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-center space-x-4 pt-6 border-t">
              <rs-button
                type="button"
                variant="secondary"
                @click="navigateTo('/BF-PRF/KF/RUU/01_01')"
              >
                Kembali
              </rs-button>
              <rs-button
                type="button"
                variant="primary"
                @click="handleTambahKategori"
                :disabled="isSubmitting"
              >
                <Icon v-if="isSubmitting" name="mdi:loading" class="animate-spin mr-2" />
                <Icon v-else name="mdi:plus" class="mr-2" />
                {{ isSubmitting ? 'Menyimpan...' : 'Tambah Kategori Maklumat' }}
              </rs-button>
              <rs-button
                type="button"
                variant="primary"
                @click="handleTambahMaklumatKelulusan"
                :disabled="isSubmitting"
              >
                <Icon v-if="isSubmitting" name="mdi:loading" class="animate-spin mr-2" />
                <Icon v-else name="mdi:plus" class="mr-2" />
                {{ isSubmitting ? 'Menyimpan...' : 'Tambah Maklumat Kelulusan' }}
              </rs-button>
              <rs-button
                type="button"
                variant="primary"
                @click="handleSimpan"
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
  title: "Kategori Maklumat",
});

const breadcrumb = ref([
  {
    name: "Profiling",
    type: "link",
    path: "/BF-PRF/KF/RUU/admin",
  },
  {
    name: "Konfigurasi Kelulusan Data (RUU)",
    type: "link",
    path: "/BF-PRF/KF/RUU/01_01",
  },
  {
    name: "Kategori Maklumat",
    type: "current",
    path: "/BF-PRF/KF/RUU/01_01/tambah_kategori",
  },
]);

const formData = reactive({
  kod: "1",
  namaKategori: "Peribadi",
  status: "Tidak Aktif",
  statusData: "Draf",
  tarikhMula: "2026-01-01",
  tarikhTamat: "",
});

const isSubmitting = ref(false);

// Handle Tambah Kategori Maklumat
const handleTambahKategori = async () => {
  isSubmitting.value = true;
  try {
    const existing = loadExistingCategories();
    const isAktif = formData.status === 'Aktif';

    const record = {
      kod: formData.kod,
      namaKategori: formData.namaKategori,
      statusAktif: isAktif,
      statusData: formData.statusData,
      tarikhMula: formData.tarikhMula,
      tarikhTamat: formData.tarikhTamat,
    };
    existing.push(record);
    localStorage.setItem('kategoriMaklumat', JSON.stringify(existing));
    alert('Kategori Maklumat berjaya disimpan!');
    await navigateTo('/BF-PRF/KF/RUU/01_01');
  } catch (e) {
    console.error('Error saving category:', e);
  } finally {
    isSubmitting.value = false;
  }
};

// Handle Tambah Maklumat Kelulusan
const handleTambahMaklumatKelulusan = async () => {
  isSubmitting.value = true;
  try {
    // Navigate to approval information form
    await navigateTo('/BF-PRF/KF/RUU/01_01/tambah_maklumat_kelulusan');
  } catch (e) {
    console.error('Error navigating:', e);
  } finally {
    isSubmitting.value = false;
  }
};

// Handle Simpan
const handleSimpan = async () => {
  isSubmitting.value = true;
  try {
    const existing = loadExistingCategories();
    const isAktif = formData.status === 'Aktif';

    const record = {
      kod: formData.kod,
      namaKategori: formData.namaKategori,
      statusAktif: isAktif,
      statusData: formData.statusData,
      tarikhMula: formData.tarikhMula,
      tarikhTamat: formData.tarikhTamat,
    };
    existing.push(record);
    localStorage.setItem('kategoriMaklumat', JSON.stringify(existing));
    alert('Data berjaya disimpan!');
    await navigateTo('/BF-PRF/KF/RUU/01_01');
  } catch (e) {
    console.error('Error saving data:', e);
  } finally {
    isSubmitting.value = false;
  }
};

const loadExistingCategories = () => {
  try {
    const saved = localStorage.getItem('kategoriMaklumat');
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Error loading categories:', e);
  }
  return [];
};

onMounted(() => {
  // Pre-fill form with sample data as shown in image
  formData.kod = "1";
  formData.namaKategori = "Peribadi";
  formData.statusData = "Draf";
  formData.tarikhMula = "2026-01-01";
});
</script>

<style scoped>
:deep(.formkit-outer) {
  margin-bottom: 0 !important;
}
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