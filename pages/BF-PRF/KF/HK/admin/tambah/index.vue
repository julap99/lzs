<!-- pages/BF-PRF/KF/HK/add.vue -->
<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Tambah Konfigurasi Had Kifayah Baharu
          </h2>
          <rs-button
            variant="primary-outline"
            @click="navigateTo('/BF-PRF/KF/HK/admin')"
          >
            <Icon name="mdi:arrow-left" class="mr-1" /> Kembali
          </rs-button>
        </div>
      </template>

      <template #body>
        <div class="bg-yellow-50 p-3 rounded border border-yellow-200 mb-6">
          <p class="text-yellow-800 text-sm">
            <Icon name="material-symbols:info-outline" class="mr-1" />
            Perhatian: Semua penambahan akan melalui proses kelulusan terlebih dahulu sebelum dikuat kuasa.
          </p>
        </div>

        <FormKit type="form" :actions="false" @submit="handleSubmit">
          <div class="mb-6">
            <FormKit
              type="select"
              name="seksyen"
              label="Pilih Seksyen"
              validation="required"
              :options="seksyenOptions"
              placeholder="Pilih Seksyen"
              v-model="selectedSeksyen"
            />
          </div>

          <!-- Seksyen A Table -->
          <div v-if="selectedSeksyen === 'A'">
            <h3 class="text-lg font-semibold mt-6">Seksyen A: Konfigurasi Isi Rumah</h3>
            <div class="overflow-x-auto">
              <table class="w-full min-w-[800px] mt-4 border">
                <thead>
                  <tr class="bg-gray-100">
                    <th class="p-2">Kategori Isi Rumah</th>
                    <th class="p-2 text-center">Kadar Rumah Berbayar (RM)</th>
                    <th class="p-2 text-center">Kadar Rumah Percuma (RM)</th>
                    <th class="p-2 text-center">Tindakan</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in sekAData" :key="index">
                    <td><input v-model="item.kategori" type="text" class="w-full border p-2" required /></td>
                    <td class="text-center"><input v-model.number="item.kadarBerbayar" type="number" min="0" class="w-full border p-2 text-center" required /></td>
                    <td class="text-center"><input v-model.number="item.kadarPercuma" type="number" min="0" class="w-full border p-2 text-center" required /></td>
                    <td class="flex justify-center items-center">
                      <rs-button v-if="sekAData.length > 1" @click="confirmRemove('A', index)" variant="danger" size="sm" circle>
                        <Icon name="mdi:delete" />
                      </rs-button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="flex justify-start mt-4">
              <rs-button @click="addCategoryA" variant="success">
                <Icon name="mdi:plus" class="mr-1" />Tambah Kategori
              </rs-button>
            </div>
          </div>

          <!-- Seksyen B Table -->
          <div v-if="selectedSeksyen === 'B'">
            <h3 class="text-lg font-semibold mt-6">Seksyen B: Konfigurasi Tambahan</h3>
            <div class="overflow-x-auto">
              <table class="w-full min-w-[600px] mt-4 border">
                <thead>
                  <tr class="bg-gray-100">
                    <th class="p-2">Jenis Kategori Tambahan</th>
                    <th class="p-2 text-center">Kadar (RM)</th>
                    <th class="p-2 text-center">Tindakan</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in sekBData" :key="index">
                    <td><input v-model="item.jenisKategori" type="text" class="w-full border p-2" required /></td>
                    <td class="text-center"><input v-model.number="item.kadar" type="number" min="0" class="w-full border p-2 text-center" required /></td>
                    <td class="flex justify-center items-center">
                      <rs-button v-if="sekBData.length > 1" @click="confirmRemove('B', index)" variant="danger" size="sm" circle>
                        <Icon name="mdi:delete" />
                      </rs-button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="flex justify-start mt-4">
              <rs-button @click="addCategoryB" variant="success">
                <Icon name="mdi:plus" class="mr-1" />Tambah Kategori
              </rs-button>
            </div>
          </div>
        </FormKit>

        <!-- Submit buttons outside FormKit to avoid validation issues -->
        <div class="mt-6 flex justify-end gap-4">
          <rs-button
            variant="primary-outline"
            @click="navigateTo('/BF-PRF/KF/HK/admin')"
            type="button"
            :disabled="isSubmitting"
          >
            Batal
          </rs-button>
          <rs-button
            variant="primary"
            @click="handleSubmit"
            :disabled="!canSubmit || isSubmitting"
          >
            <span v-if="isSubmitting">
              <Icon name="eos-icons:loading" size="1rem" class="mr-1" />
              Menghantar...
            </span>
            <span v-else>Hantar Untuk Kelulusan</span>
          </rs-button>
        </div>
      </template>
    </rs-card>

    <!-- Remove Confirmation Modal -->
    <rs-modal v-model="showRemoveModal" title="Pengesahan" size="sm" position="center" :hideFooter="true">
      <div class="text-center p-4">
        <Icon name="mdi:alert" class="text-red-500 mb-2" size="2rem" />
        <div class="mb-4 text-lg font-semibold">
          Anda pasti ingin buang kategori ini?
        </div>
        <div class="flex justify-center gap-4 mt-4">
          <rs-button variant="secondary" @click="cancelRemove">Batal</rs-button>
          <rs-button variant="danger" @click="doRemove">Buang</rs-button>
        </div>
      </div>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

definePageMeta({
  title: "Tambah Konfigurasi Had Kifayah",
});

const router = useRouter();

const breadcrumb = ref([
  {
    name: "Profiling",
    type: "link",
    path: "/BF-PRF/KF/HK/admin",
  },
  {
    name: "Konfigurasi Had Kifayah",
    type: "link",
    path: "/BF-PRF/KF/HK/admin",
  },
  {
    name: "Tambah Baharu",
    type: "current",
    path: "/BF-PRF/KF/HK/admin/tambah",
  },
]);

const seksyenOptions = [
  { label: 'Seksyen A: Kadar Had Kifayah Utama', value: 'A' },
  { label: 'Seksyen B: Kadar Had Kifayah Tambahan', value: 'B' },
];

const selectedSeksyen = ref('A');

// Seksyen A data
const sekAData = ref([
  { kategori: 'Ketua Keluarga', kadarBerbayar: 1215.00, kadarPercuma: 780.00 },
  { kategori: 'Dewasa Bekerja', kadarBerbayar: 412.00, kadarPercuma: 412.00 },
  { kategori: 'Dewasa Tidak Bekerja', kadarBerbayar: 167.00, kadarPercuma: 167.00 },
  { kategori: 'Tanggungan IPT', kadarBerbayar: 613.00, kadarPercuma: 613.00 },
  { kategori: 'Tanggungan 7-17 Tahun', kadarBerbayar: 408.00, kadarPercuma: 408.00 },
  { kategori: 'Tanggungan 6 Tahun ke Bawah', kadarBerbayar: 175.00, kadarPercuma: 175.00 },
]);

// Seksyen B data
const sekBData = ref([
  { jenisKategori: 'OKU', kadar: 247.00 },
  { jenisKategori: 'Pesakit Kronik', kadar: 243.00 },
  { jenisKategori: 'Penjagaan Anak < 12 Tahun', kadar: 330.00 },
]);

const isSubmitting = ref(false);

// Validation logic to prevent submission with empty data
const canSubmit = computed(() => {
  if (selectedSeksyen.value === 'A') {
    return sekAData.value.length > 0 && 
           sekAData.value.every(row => 
             row.kategori && row.kategori.trim() !== '' && 
             row.kadarBerbayar !== null && row.kadarBerbayar >= 0 && 
             row.kadarPercuma !== null && row.kadarPercuma >= 0
           );
  } else if (selectedSeksyen.value === 'B') {
    return sekBData.value.length > 0 && 
           sekBData.value.every(row => 
             row.jenisKategori && row.jenisKategori.trim() !== '' && 
             row.kadar !== null && row.kadar >= 0
           );
  }
  return false;
});

// Modal state for remove confirmation
const showRemoveModal = ref(false);
const removeTarget = ref({ section: null, index: null });

function confirmRemove(section, index) {
  removeTarget.value = { section, index };
  showRemoveModal.value = true;
}
function doRemove() {
  if (removeTarget.value.section === 'A') {
    if (sekAData.value.length > 1 && removeTarget.value.index !== null) sekAData.value.splice(removeTarget.value.index, 1);
  } else if (removeTarget.value.section === 'B') {
    if (sekBData.value.length > 1 && removeTarget.value.index !== null) sekBData.value.splice(removeTarget.value.index, 1);
  }
  showRemoveModal.value = false;
  removeTarget.value = { section: null, index: null };
}
function cancelRemove() {
  showRemoveModal.value = false;
  removeTarget.value = { section: null, index: null };
}

function addCategoryA() {
  sekAData.value.push({ kategori: '', kadarBerbayar: null, kadarPercuma: null });
}
function addCategoryB() {
  sekBData.value.push({ jenisKategori: '', kadar: null });
}

async function handleSubmit() {
  try {
    isSubmitting.value = true;
    
    // Prepare the data based on selected section
    const submissionData = {
      seksyen: selectedSeksyen.value,
      data: selectedSeksyen.value === 'A' ? sekAData.value : sekBData.value,
      status: 'Menunggu Kelulusan',
      tarikhHantar: new Date().toISOString(),
      // Add other required fields for submission
    };
    
    console.log('Submitting data:', submissionData);
    
    // TODO: Replace with actual API call
    // const response = await $fetch('/api/konfigurasi/hk/submit', {
    //   method: 'POST',
    //   body: submissionData
    // });
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Show success message
    alert('Permohonan konfigurasi telah dihantar untuk kelulusan!');
    
    // Navigate back to admin page
    await navigateTo('/BF-PRF/KF/HK/admin');
    
  } catch (error) {
    console.error('Error submitting form:', error);
    alert('Ralat semasa menghantar permohonan. Sila cuba lagi.');
  } finally {
    isSubmitting.value = false;
  }
}
</script>
