<template>
  <div class="min-h-screen">
    <div class="">
      <LayoutsBreadcrumb :items="breadcrumb" />

      <!-- Page Header -->
      <div class="mt-6 mb-8">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">
              {{ editingBQ ? 'Edit' : 'Tambah' }} Draf BQ
            </h1>
            <p class="mt-1 text-sm text-gray-600">
              Bill of Quantity untuk kerja-kerja cadangan
            </p>
          </div>
          <rs-button
            variant="primary-outline"
            @click="handleBack"
            class="text-sm"
          >
            <Icon name="ph:arrow-left" class="w-4 h-4 mr-2" />
            Kembali
          </rs-button>
        </div>
      </div>

      <div class="space-y-6">
        <!-- BQ Header Information -->
        <rs-card class="shadow-sm border-0 bg-white">
          <template #header>
            <div class="flex items-center space-x-3">
              <div class="flex-shrink-0">
                <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Icon name="ph:file-text" class="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div>
                <h2 class="text-lg font-semibold text-gray-900">
                  Maklumat BQ
                </h2>
                <p class="text-sm text-gray-500">
                  Maklumat asas untuk dokumen BQ
                </p>
              </div>
            </div>
          </template>

          <template #body>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Auto-generated fields (Read-only) -->
              <div class="space-y-1">
                <label class="text-sm font-medium text-gray-700">No Borang BQ / Rujukan</label>
                <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                  <span class="text-sm font-mono text-gray-900">{{ formData.noBQ }}</span>
                </div>
              </div>

              <div class="space-y-1">
                <label class="text-sm font-medium text-gray-700">No BR</label>
                <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                  <span class="text-sm font-mono text-gray-900">{{ formData.noBR }}</span>
                </div>
              </div>

              <div class="space-y-1">
                <label class="text-sm font-medium text-gray-700">Nama Pemohon & Institusi</label>
                <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                  <span class="text-sm text-gray-900">{{ formData.namaPemohon }}</span>
                </div>
              </div>

              <div class="space-y-1">
                <label class="text-sm font-medium text-gray-700">Tarikh Siasatan</label>
                <FormKit
                  type="date"
                  v-model="formData.tarikhSiasatan"
                  :classes="{ input: 'text-sm' }"
                />
              </div>

              <div class="space-y-1 md:col-span-2">
                <label class="text-sm font-medium text-gray-700">Alamat</label>
                <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                  <span class="text-sm text-gray-900">{{ formData.alamat }}</span>
                </div>
              </div>
            </div>
          </template>
        </rs-card>

        <!-- Table Senarai Item Kerja -->
        <rs-card class="shadow-sm border-0 bg-white">
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Icon name="ph:list" class="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-gray-900">
                    Senarai Item Kerja
                  </h2>
                  <p class="text-sm text-gray-500">
                    Senarai kerja dan anggaran kos
                  </p>
                </div>
              </div>
              <rs-button variant="primary" @click="addItem">
                <Icon name="ph:plus" class="w-4 h-4 mr-2" />
                Tambah Item
              </rs-button>
            </div>
          </template>

          <template #body>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                      Bil
                    </th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Jenis Kerja / Perkara
                    </th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                      Unit
                    </th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                      Kuantiti
                    </th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                      Harga Per Unit (RM)
                    </th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                      Jumlah (RM)
                    </th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="(item, index) in formData.itemKerja" :key="index">
                    <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {{ index + 1 }}
                    </td>
                    <td class="px-4 py-4">
                      <FormKit
                        type="textarea"
                        v-model="item.jenisKerja"
                        rows="2"
                        :classes="{ input: 'text-sm !p-2' }"
                        placeholder="Masukkan jenis kerja..."
                      />
                    </td>
                    <td class="px-4 py-4">
                      <FormKit
                        type="text"
                        v-model="item.unit"
                        :classes="{ input: 'text-sm !p-2' }"
                        placeholder="Unit"
                      />
                    </td>
                    <td class="px-4 py-4">
                      <FormKit
                        type="number"
                        v-model="item.kuantiti"
                        :classes="{ input: 'text-sm !p-2' }"
                        @input="calculateItemTotal(index)"
                        min="0"
                        step="0.01"
                      />
                    </td>
                    <td class="px-4 py-4">
                      <FormKit
                        type="number"
                        v-model="item.hargaPerUnit"
                        :classes="{ input: 'text-sm !p-2' }"
                        @input="calculateItemTotal(index)"
                        min="0"
                        step="0.01"
                      />
                    </td>
                    <td class="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      RM {{ item.jumlah.toLocaleString() }}
                    </td>
                    <td class="px-4 py-4">
                      <rs-button
                        size="xs"
                        variant="danger-outline"
                        @click="removeItem(index)"
                      >
                        <Icon name="ph:trash" class="w-4 h-4" />
                      </rs-button>
                    </td>
                  </tr>
                  <tr v-if="formData.itemKerja.length === 0">
                    <td colspan="7" class="px-4 py-8 text-center text-sm text-gray-500">
                      Tiada item kerja. Klik butang "Tambah Item" untuk menambah item kerja.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Total Section -->
            <div class="mt-6 border-t pt-4">
              <div class="flex justify-end">
                <div class="w-64 space-y-2">
                  <div class="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>RM {{ subtotal.toLocaleString() }}</span>
                  </div>
                  <div class="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Jumlah Keseluruhan BQ:</span>
                    <span>RM {{ formData.jumlahKeseluruhan.toLocaleString() }}</span>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </rs-card>

        <!-- Summary & Additional Info -->
        <rs-card class="shadow-sm border-0 bg-white">
          <template #header>
            <div class="flex items-center space-x-3">
              <div class="flex-shrink-0">
                <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Icon name="ph:note" class="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div>
                <h2 class="text-lg font-semibold text-gray-900">
                  Ringkasan & Maklumat Tambahan
                </h2>
                <p class="text-sm text-gray-500">
                  Ringkasan BQ dan maklumat pengesahan
                </p>
              </div>
            </div>
          </template>

          <template #body>
            <div class="space-y-6">
              <!-- Auto-generated fields -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-1">
                  <label class="text-sm font-medium text-gray-700">Ringgit Malaysia (Perkataan)</label>
                  <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                    <span class="text-sm text-gray-900">{{ formData.ringgiMalaysiaPerkataan }}</span>
                  </div>
                </div>

                <div class="space-y-1">
                  <label class="text-sm font-medium text-gray-700">Disediakan Oleh</label>
                  <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                    <span class="text-sm text-gray-900">{{ formData.disediakanOleh }}</span>
                  </div>
                </div>
              </div>

              <!-- Auto-generated Catatan Pengesyoran -->
              <div class="space-y-1">
                <label class="text-sm font-medium text-gray-700">Catatan Pengesyoran</label>
                <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                  <span class="text-sm text-gray-900">{{ formData.catatanPengesyoran }}</span>
                </div>
              </div>

              <!-- Digital Signature Section -->
              <div class="border-t pt-6">
                <h3 class="text-lg font-medium text-gray-900 mb-4">Pengesahan Digital</h3>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <!-- Disemak 1 -->
                  <div class="space-y-2">
                    <label class="text-sm font-medium text-gray-700">Disemak 1</label>
                    <FormKit
                      type="select"
                      :options="pegawaiOptions"
                      v-model="formData.disemak1"
                      placeholder="Pilih pegawai..."
                    />
                    <div v-if="formData.tarikhDisemak1" class="text-xs text-gray-500">
                      Tarikh: {{ formData.tarikhDisemak1 }}
                    </div>
                  </div>

                  <!-- Disemak 2 -->
                  <div class="space-y-2">
                    <label class="text-sm font-medium text-gray-700">Disemak 2</label>
                    <FormKit
                      type="select"
                      :options="pegawaiOptions"
                      v-model="formData.disemak2"
                      placeholder="Pilih pegawai..."
                    />
                    <div v-if="formData.tarikhDisemak2" class="text-xs text-gray-500">
                      Tarikh: {{ formData.tarikhDisemak2 }}
                    </div>
                  </div>

                  <!-- Disahkan Oleh -->
                  <div class="space-y-2">
                    <label class="text-sm font-medium text-gray-700">Disahkan Oleh</label>
                    <FormKit
                      type="select"
                      :options="pegawaiOptions"
                      v-model="formData.disahkanOleh"
                      placeholder="Pilih pegawai..."
                    />
                    <div v-if="formData.tarikhDisahkan" class="text-xs text-gray-500">
                      Tarikh: {{ formData.tarikhDisahkan }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </rs-card>

        <!-- Action Buttons -->
        <rs-card class="shadow-sm border-0 bg-white">
          <template #body>
            <div class="flex flex-col sm:flex-row gap-3 justify-end">
              <rs-button
                variant="primary-outline"
                @click="handleSaveDraft"
                :disabled="processing"
                class="!py-3 text-sm font-medium"
              >
                <Icon name="ph:floppy-disk" class="w-5 h-5 mr-2" />
                Simpan Draf
              </rs-button>

              <rs-button
                variant="success-outline"
                @click="handleGeneratePDF"
                :disabled="processing"
                class="!py-3 text-sm font-medium"
              >
                <Icon name="ph:file-pdf" class="w-5 h-5 mr-2" />
                Jana PDF
              </rs-button>

              <rs-button
                variant="primary"
                @click="handleSaveAndReturn"
                :disabled="processing"
                :loading="processing"
                class="!py-3 text-sm font-medium"
              >
                <Icon name="ph:check" class="w-5 h-5 mr-2" />
                Simpan & Kembali
              </rs-button>
            </div>
          </template>
        </rs-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";

const route = useRoute();
const router = useRouter();
const toast = useToast();
const processing = ref(false);

definePageMeta({
  title: "Draf BQ - Siasatan Lapangan",
});

const breadcrumb = ref([
  {
    name: "Permohonan Bantuan",
    type: "link",
    path: "/BF-BTN/permohonan/senarai",
  },
  {
    name: "Siasatan ke Lapangan",
    type: "link",
    path: "/BF-BTN/permohonan/senarai-siasatan-lapangan",
  },
  {
    name: "Kemaskini Siasatan",
    type: "link",
    path: `/BF-BTN/permohonan/senarai-siasatan-lapangan/${route.params.id}`,
  },
  {
    name: "Draf BQ",
    type: "current",
    path: `/BF-BTN/permohonan/senarai-siasatan-lapangan/${route.params.id}/draf-bq`,
  },
]);

// Check if we're editing an existing BQ
const editingBQ = computed(() => {
  return route.query.edit === 'true';
});

// Form data
const formData = ref({
  noBQ: "",
  noBR: "",
  namaPemohon: "",
  alamat: "",
  tarikhSiasatan: "",
  itemKerja: [],
  jumlahKeseluruhan: 0,
  ringgiMalaysiaPerkataan: "",
  catatanPengesyoran: "",
  disediakanOleh: "",
  disemak1: "",
  disemak2: "",
  disahkanOleh: "",
  tarikhDisemak1: "",
  tarikhDisemak2: "",
  tarikhDisahkan: "",
});

// Options for pegawai selection
const pegawaiOptions = ref([
  { label: "Ahmad bin Ali - Pegawai Teknikal", value: "ahmad_ali" },
  { label: "Siti binti Hassan - Pegawai Kanan", value: "siti_hassan" },
  { label: "Mohd bin Ibrahim - Ketua Pegawai", value: "mohd_ibrahim" },
]);

// Computed properties
const subtotal = computed(() => {
  return formData.value.itemKerja.reduce((total, item) => total + item.jumlah, 0);
});

// Watch subtotal changes and update form data
const updateTotals = () => {
  formData.value.jumlahKeseluruhan = subtotal.value;
  formData.value.ringgiMalaysiaPerkataan = numberToWords(subtotal.value);
  formData.value.catatanPengesyoran = generateCatatanPengesyoran();
};

// Methods
const addItem = () => {
  formData.value.itemKerja.push({
    jenisKerja: "",
    unit: "",
    kuantiti: 0,
    hargaPerUnit: 0,
    jumlah: 0,
  });
};

const removeItem = (index) => {
  formData.value.itemKerja.splice(index, 1);
  updateTotals();
};

const calculateItemTotal = (index) => {
  const item = formData.value.itemKerja[index];
  item.jumlah = (item.kuantiti || 0) * (item.hargaPerUnit || 0);
  updateTotals();
};

const numberToWords = (amount) => {
  // This is a simplified implementation
  // In real app, use a proper number-to-words library
  const thousands = Math.floor(amount / 1000);
  const remainder = amount % 1000;
  
  if (thousands > 0) {
    return `${thousands} ribu ${remainder > 0 ? remainder : ''} ringgit sahaja`.trim();
  } else {
    return `${amount} ringgit sahaja`;
  }
};

const generateCatatanPengesyoran = () => {
  const total = subtotal.value;
  if (total > 0) {
    return `Cadangan kerja baik pulih dengan anggaran kos sebanyak RM ${total.toLocaleString()} adalah berpatutan dan dicadangkan untuk kelulusan.`;
  }
  return "";
};

const handleSaveDraft = async () => {
  try {
    processing.value = true;
    
    // Implement save draft functionality
    console.log("Saving BQ draft:", formData.value);
    
    toast.success("Draf BQ telah disimpan");
  } catch (error) {
    toast.error("Ralat semasa menyimpan draf BQ");
    console.error(error);
  } finally {
    processing.value = false;
  }
};

const handleGeneratePDF = async () => {
  try {
    processing.value = true;
    
    // Implement PDF generation functionality
    console.log("Generating PDF for BQ:", formData.value);
    
    toast.success("PDF BQ telah dijana");
  } catch (error) {
    toast.error("Ralat semasa menjana PDF");
    console.error(error);
  } finally {
    processing.value = false;
  }
};

const handleSaveAndReturn = async () => {
  try {
    await handleSaveDraft();
    handleBack();
  } catch (error) {
    console.error(error);
  }
};

const handleBack = () => {
  router.push(`/BF-BTN/permohonan/senarai-siasatan-lapangan/${route.params.id}`);
};

// Load existing data on mount
onMounted(async () => {
  try {
    // Generate auto fields
    const today = new Date();
    const currentUser = "Ahmad bin Ali"; // This would come from auth
    
    formData.value = {
      noBQ: `BQ${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      noBR: `BR-${today.getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      namaPemohon: "MOHD ROSLI BIN SAAD",
      alamat: "No. 123, Jalan Merdeka, Taman Sejahtera, 50000 Kuala Lumpur",
      tarikhSiasatan: today.toISOString().split('T')[0],
      itemKerja: editingBQ.value ? [
        {
          jenisKerja: "Kerja baik pulih bumbung bocor",
          unit: "m²",
          kuantiti: 50,
          hargaPerUnit: 200,
          jumlah: 10000,
        },
        {
          jenisKerja: "Cat dinding luar",
          unit: "m²",
          kuantiti: 100,
          hargaPerUnit: 15,
          jumlah: 1500,
        },
      ] : [],
      jumlahKeseluruhan: 0,
      ringgiMalaysiaPerkataan: "",
      catatanPengesyoran: "",
      disediakanOleh: currentUser,
      disemak1: "",
      disemak2: "",
      disahkanOleh: "",
      tarikhDisemak1: "",
      tarikhDisemak2: "",
      tarikhDisahkan: "",
    };
    
    // Update totals if editing
    if (editingBQ.value) {
      updateTotals();
    }
    
  } catch (error) {
    toast.error("Ralat semasa memuatkan data BQ");
    console.error(error);
  }
});
</script>

<style lang="scss" scoped>
// Custom table styling
.min-w-full {
  font-size: 0.875rem;
}

// Form input styling within table
.formkit-wrapper {
  margin: 0;
}

// Enhanced number formatting
.currency {
  font-family: 'Courier New', monospace;
  font-weight: 600;
}
</style> 