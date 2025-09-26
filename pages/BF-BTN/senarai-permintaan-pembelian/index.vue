<template>
  <div class="">
    <div class="">
      <LayoutsBreadcrumb :items="breadcrumb" />

      <!-- Page Header -->
      <header class="mt-6 mb-8" role="banner">
        <div
          class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div class="flex-1">
            <h1
              class="text-3xl font-bold text-gray-900 tracking-tight"
              id="page-title"
            >
              Senarai Permintaan Pembelian
            </h1>
            <p class="mt-2 text-sm text-gray-600 max-w-2xl" role="doc-subtitle">
              Senarai item-item yang diperlukan untuk pembelian
            </p>
          </div>
          <rs-button
            variant="primary-outline"
            @click="handleBack"
            class="text-sm px-4 py-2 shrink-0"
            aria-label="Kembali ke halaman permohonan"
          >
            <Icon
              name="ph:arrow-left"
              class="w-4 h-4 mr-2"
              aria-hidden="true"
            />
            Kembali
          </rs-button>
        </div>
      </header>

      <main class="space-y-6" role="main" aria-labelledby="page-title">
        <!-- Header Information -->
        <section aria-labelledby="header-title">
          <rs-card class="shadow-sm border-0 bg-white">
            <template #header>
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0" aria-hidden="true">
                  <div
                    class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"
                  >
                    <Icon name="ph:shopping-cart" class="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div>
                  <h2
                    class="text-lg font-semibold text-gray-900"
                    id="header-title"
                  >
                    Maklumat Permintaan
                  </h2>
                  <p class="text-sm text-gray-500">
                    Butiran permintaan pembelian
                  </p>
                </div>
              </div>
            </template>

            <template #body>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-1">
                  <label class="text-sm font-medium text-gray-700">Aid</label>
                  <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                    <span class="text-sm text-gray-900">(HQ) BANTUAN PENGURUSAN BAIT AL-HASANAH (MISKIN)</span>
                  </div>
                </div>

                <div class="space-y-1">
                  <label class="text-sm font-medium text-gray-700">Aid Product</label>
                  <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                    <span class="text-sm text-gray-900">BELANJA KEPERLUAN ASRAMA BAIT AL-HASANAH (MISKIN)</span>
                  </div>
                </div>

                <div class="space-y-1">
                  <label class="text-sm font-medium text-gray-700">Tarikh dan Masa</label>
                  <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                    <span class="text-sm text-gray-900">{{ formatDateTime(new Date()) }}</span>
                  </div>
                </div>
              </div>
            </template>
          </rs-card>
        </section>

        <!-- Table Senarai Item Pembelian -->
        <section aria-labelledby="item-pembelian-title">
          <rs-card class="shadow-sm border-0 bg-white">
            <template #header>
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="flex-shrink-0" aria-hidden="true">
                    <div
                      class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center"
                    >
                      <Icon name="ph:list" class="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <div>
                    <h2
                      class="text-lg font-semibold text-gray-900"
                      id="item-pembelian-title"
                    >
                      Senarai Item Pembelian
                    </h2>
                    <p class="text-sm text-gray-500">
                      Senarai item dan anggaran kos
                    </p>
                  </div>
                </div>
              </div>
            </template>

            <template #body>
              <!-- Mobile Card Layout (sm and below) -->
              <div class="block lg:hidden space-y-4">
                <div
                  v-for="(item, index) in formData.itemPembelian"
                  :key="index"
                  class="p-4 border border-gray-200 rounded-lg bg-gray-50"
                >
                  <div class="flex justify-between items-start mb-3">
                    <span class="text-sm font-medium text-gray-600"
                      >Item {{ index + 1 }}</span
                    >
                    <rs-button
                      variant="danger"
                      size="sm"
                      @click="removeItem(index)"
                      class="!p-2"
                    >
                      <Icon name="ph:trash" class="w-4 h-4" />
                    </rs-button>
                  </div>

                  <div class="grid grid-cols-2 gap-3">
                    <div class="space-y-1">
                      <label class="text-xs font-medium text-gray-700"
                        >Item</label
                      >
                      <FormKit
                        type="text"
                        v-model="item.namaItem"
                        :classes="{ input: 'text-sm !p-2' }"
                        placeholder="Item"
                      />
                    </div>
                    <div class="space-y-1">
                      <label class="text-xs font-medium text-gray-700"
                        >Unit</label
                      >
                      <FormKit
                        type="select"
                        v-model="item.unit"
                        :options="unitOptions"
                        :classes="{ input: 'text-sm !p-2' }"
                      />
                    </div>
                    <div class="space-y-1">
                      <label class="text-xs font-medium text-gray-700"
                        >Kuantiti</label
                      >
                      <FormKit
                        type="number"
                        v-model="item.kuantiti"
                        :classes="{ input: 'text-sm !p-2' }"
                        @input="updateTotals()"
                        min="0"
                        step="1"
                      />
                    </div>
                    <div class="space-y-1">
                      <label class="text-xs font-medium text-gray-700"
                        >Amaun (RM)</label
                      >
                      <FormKit
                        type="number"
                        v-model="item.harga"
                        :classes="{ input: 'text-sm !p-2' }"
                        @input="updateTotals()"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>

                  <div class="mt-3 pt-3 border-t border-gray-200">
                    <div class="flex justify-between text-sm">
                      <span class="text-gray-600">Jumlah Amaun (RM):</span>
                      <span class="font-medium text-gray-900">
                        RM {{ formatCurrency(item.kuantiti * item.harga) }}
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  v-if="formData.itemPembelian.length === 0"
                  class="text-center py-8 text-gray-500"
                >
                  Tiada item pembelian. Klik butang "Tambah Item" untuk menambah
                  item pembelian.
                </div>
              </div>

              <!-- Desktop Table Layout (lg and above) -->
              <div
                class="hidden lg:block overflow-x-auto"
                role="table"
                aria-label="Senarai item pembelian"
              >
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr role="row">
                      <th
                        scope="col"
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        #
                      </th>
                      <th
                        scope="col"
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Item
                      </th>
                      <th
                        scope="col"
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-36"
                      >
                        Unit
                      </th>
                      <th
                        scope="col"
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24"
                      >
                        Kuantiti
                      </th>
                      <th
                        scope="col"
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28"
                      >
                        Amaun (RM)
                      </th>
                      <th
                        scope="col"
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Jumlah Amaun (RM)
                      </th>
                      <th
                        scope="col"
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Tindakan
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr
                      v-for="(item, index) in formData.itemPembelian"
                      :key="index"
                      role="row"
                    >
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {{ index + 1 }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <FormKit
                          type="text"
                          v-model="item.namaItem"
                          :classes="{ input: 'text-sm !p-2 border-gray-300' }"
                          placeholder="Item"
                        />
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <FormKit
                          type="select"
                          v-model="item.unit"
                          :options="unitOptions"
                          :classes="{ input: 'text-sm !p-2 border-gray-300' }"
                        />
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <FormKit
                          type="number"
                          v-model="item.kuantiti"
                          :classes="{ input: 'text-sm !p-2 border-gray-300' }"
                          @input="updateTotals()"
                          min="0"
                          step="1"
                        />
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <FormKit
                          type="number"
                          v-model="item.harga"
                          :classes="{ input: 'text-sm !p-2 border-gray-300' }"
                          @input="updateTotals()"
                          min="0"
                          step="0.01"
                        />
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        RM {{ formatCurrency(item.kuantiti * item.harga) }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <rs-button
                          variant="danger"
                          size="sm"
                          @click="removeItem(index)"
                          class="!p-2"
                        >
                          <Icon name="ph:trash" class="w-4 h-4" />
                        </rs-button>
                      </td>
                    </tr>
                    <tr v-if="formData.itemPembelian.length === 0">
                      <td
                        colspan="6"
                        class="px-6 py-4 text-center text-gray-500"
                      >
                        Tiada item pembelian. Klik butang "Tambah Item" untuk
                        menambah item pembelian.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <!-- Tambah Item Button -->
              <div class="mt-4 flex justify-end">
                <rs-button
                  variant="primary"
                  @click="addItem"
                  aria-label="Tambah item pembelian baru"
                >
                  <Icon
                    name="ph:plus"
                    class="w-4 h-4 mr-2"
                    aria-hidden="true"
                  />
                  Tambah Item
                </rs-button>
              </div>

              <!-- Total Cost Summary -->
              <div class="mt-6 border-t border-gray-200 pt-6">
                <div class="flex justify-end">
                  <div class="w-full max-w-md space-y-3 bg-gray-50 p-4 rounded-lg">
                    <div class="flex justify-between items-center text-lg font-bold text-gray-900 border-t border-gray-300 pt-3">
                      <span class="flex-shrink-0">Jumlah Keseluruhan:</span>
                      <span class="font-mono text-blue-600 whitespace-nowrap ml-4">
                        RM {{ totalKos.toLocaleString("ms-MY", { minimumFractionDigits: 2 }) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </rs-card>
        </section>


        <!-- Action Buttons -->
        <div class="flex justify-end space-x-4">
          <rs-button variant="secondary" @click="handleCancel">
            Batal
          </rs-button>
          <rs-button variant="primary" @click="handleSave">
            Simpan
          </rs-button>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";

definePageMeta({
  title: "Senarai Permintaan Pembelian",
  description: "Halaman untuk menguruskan senarai permintaan pembelian",
});

const router = useRouter();
const route = useRoute();

// Form data
const formData = ref({
  itemPembelian: [],
});

// Unit options - Comprehensive measurement units with category headers
const unitOptions = [
  { label: "-- Pilih Unit --", value: "", disabled: true },
  
  // Unit Kuantiti Asas Header
  { label: "Unit Kuantiti Asas", value: "", disabled: true, attrs: { style: "font-weight: bold; background-color: #f3f4f6;" } },
  { label: "Unit (Unit/pcs)", value: "Unit" },
  { label: "Set", value: "Set" },
  { label: "Paket/Pek", value: "Paket" },
  { label: "Kotak (Box)", value: "Box" },
  { label: "Dozen (Doz)", value: "Dozen" },
  { label: "Karton (Carton)", value: "Karton" },
  { label: "Roll/Gulung", value: "Roll" },
  { label: "Bundle", value: "Bundle" },
  
  // Unit Berat Header
  { label: "Unit Berat", value: "", disabled: true, attrs: { style: "font-weight: bold; background-color: #f3f4f6;" } },
  { label: "Gram (g)", value: "g" },
  { label: "Kilogram (kg)", value: "kg" },
  { label: "Tonne/Metric Ton (t)", value: "t" },
  
  // Unit Panjang Header
  { label: "Unit Panjang", value: "", disabled: true, attrs: { style: "font-weight: bold; background-color: #f3f4f6;" } },
  { label: "Milimeter (mm)", value: "mm" },
  { label: "Sentimeter (cm)", value: "cm" },
  { label: "Meter (m)", value: "m" },
  { label: "Kilometer (km)", value: "km" },
  
  // Unit Luas Header
  { label: "Unit Luas", value: "", disabled: true, attrs: { style: "font-weight: bold; background-color: #f3f4f6;" } },
  { label: "Sentimeter Persegi (cm²)", value: "cm²" },
  { label: "Meter Persegi (m²)", value: "m²" },
  { label: "Hektar (ha)", value: "ha" },
  { label: "Kilometer Persegi (km²)", value: "km²" },
  
  // Unit Isipadu Header
  { label: "Unit Isipadu", value: "", disabled: true, attrs: { style: "font-weight: bold; background-color: #f3f4f6;" } },
  { label: "Mililiter (ml)", value: "ml" },
  { label: "Liter (l)", value: "l" },
  { label: "Meter Padu (m³)", value: "m³" },
  
  // Unit Masa / Kekerapan Header
  { label: "Unit Masa / Kekerapan", value: "", disabled: true, attrs: { style: "font-weight: bold; background-color: #f3f4f6;" } },
  { label: "Hari", value: "Hari" },
  { label: "Minggu", value: "Minggu" },
  { label: "Bulan", value: "Bulan" },
  { label: "Tahun", value: "Tahun" },
  
  // Unit Tenaga / Elektrik Header
  { label: "Unit Tenaga / Elektrik", value: "", disabled: true, attrs: { style: "font-weight: bold; background-color: #f3f4f6;" } },
  { label: "Kilowatt (kW)", value: "kW" },
  { label: "Kilowatt-hour (kWh)", value: "kWh" },
  
  // Unit Khas Header
  { label: "Unit Khas", value: "", disabled: true, attrs: { style: "font-weight: bold; background-color: #f3f4f6;" } },
  { label: "Pair (Pasang)", value: "Pasang" },
  { label: "Lembar", value: "Lembar" },
  { label: "Helai", value: "Helai" },
  { label: "Batang", value: "Batang" },
  { label: "Botol", value: "Botol" },
  { label: "Tin", value: "Tin" },
  { label: "Galon", value: "Galon" },
  { label: "Drum", value: "Drum" },
  { label: "Pack", value: "Pack" },
];

// Generate reference number
const noRujukan = ref(`SPP-${Date.now()}`);

// Computed values
const totalKos = computed(() => {
  return formData.value.itemPembelian.reduce((total, item) => {
    return total + ((Number(item.kuantiti) || 0) * (Number(item.harga) || 0));
  }, 0);
});

// Breadcrumb items
const breadcrumb = ref([
  {
    name: "Permohonan Bantuan",
    type: "link",
    path: "/BF-BTN/mohon-bantuan",
  },
  {
    name: "Senarai Permintaan Pembelian",
    type: "current",
    path: "/BF-BTN/senarai-permintaan-pembelian",
  },
]);

// Helper functions
const formatDate = (date) => {
  return new Intl.DateTimeFormat("ms-MY", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};

const formatDateTime = (date) => {
  return new Intl.DateTimeFormat("ms-MY", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);
};

const formatCurrency = (amount) => {
  return Number(amount || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const updateTotals = () => {
  // This will trigger computed property updates
  // No need for explicit calculation here
};

// Item management functions
const addItem = () => {
  formData.value.itemPembelian.push({
    namaItem: "",
    unit: "",
    kuantiti: 0,
    harga: 0,
  });
};

const removeItem = (index) => {
  if (index >= 0 && index < formData.value.itemPembelian.length) {
    formData.value.itemPembelian.splice(index, 1);
  }
};


// Action handlers
const handleBack = () => {
  router.push("/BF-BTN/mohon-bantuan");
};

const handleCancel = () => {
  router.push("/BF-BTN/mohon-bantuan");
};

const handleSave = () => {
  if (formData.value.itemPembelian.length === 0) {
    alert("Sila tambah sekurang-kurangnya satu item pembelian");
    return;
  }

  // Check if all items have required fields
  const invalidItems = formData.value.itemPembelian.filter(item => 
    !item.namaItem || !item.unit || !item.kuantiti || !item.harga
  );

  if (invalidItems.length > 0) {
    alert("Sila lengkapkan semua maklumat item pembelian");
    return;
  }

  try {
    // Save to localStorage for now
    localStorage.setItem('senaraiPermintaanPembelian', JSON.stringify({
      noRujukan: noRujukan.value,
      itemPembelian: formData.value.itemPembelian,
      totalKos: totalKos.value,
      timestamp: new Date().toISOString()
    }));
    
    alert("Senarai permintaan pembelian berjaya disimpan");
    router.push("/BF-BTN/mohon-bantuan");
  } catch (error) {
    console.error("Error saving data:", error);
    alert("Ralat menyimpan data");
  }
};

// Predefined items list - School Uniform Items with appropriate units and prices
const predefinedItems = [
  { namaItem: "Baju Sekolah Lelaki Putih Saiz M", unit: "Helai", kuantiti: 2, harga: 18.00 },
  { namaItem: "Baju Sekolah Lelaki Putih Saiz L", unit: "Helai", kuantiti: 2, harga: 20.00 },
  { namaItem: "Baju Sekolah Perempuan Putih Saiz M", unit: "Helai", kuantiti: 2, harga: 18.00 },
  { namaItem: "Seluar Sekolah Lelaki Biru Gelap Saiz M", unit: "Helai", kuantiti: 2, harga: 22.00 },
  { namaItem: "Kain Sekolah Perempuan Biru Gelap Saiz M", unit: "Helai", kuantiti: 2, harga: 25.00 },
  { namaItem: "Tali Leher Sekolah", unit: "Helai", kuantiti: 3, harga: 5.00 },
  { namaItem: "Tudung Putih (Saiz M)", unit: "Helai", kuantiti: 2, harga: 12.00 },
  { namaItem: "Stoking Putih (Pasang)", unit: "Pasang", kuantiti: 5, harga: 2.50 },
];

// Load saved data on mount
onMounted(() => {
  try {
    // Always load predefined school items
    formData.value.itemPembelian = [...predefinedItems];
    
    // You can uncomment the code below if you want to restore localStorage functionality later
    /*
    const savedData = localStorage.getItem('senaraiPermintaanPembelian');
    if (savedData) {
      const data = JSON.parse(savedData);
      formData.value.itemPembelian = data.itemPembelian || [];
      noRujukan.value = data.noRujukan || `SPP-${Date.now()}`;
    } else {
      // Load predefined items if no saved data
      formData.value.itemPembelian = [...predefinedItems];
    }
    */
  } catch (error) {
    console.error("Error loading saved data:", error);
    // Fallback to predefined items
    formData.value.itemPembelian = [...predefinedItems];
  }
});
</script>

<style lang="scss" scoped>
// Fix dropdown direction to appear downward
:deep(.formkit-wrapper) {
  .formkit-input[data-type="select"] {
    select {
      // Ensure dropdown opens downward
      position: relative;
    }
  }
}

// Force FormKit select options to appear below
:deep(.formkit-options) {
  position: absolute !important;
  top: 100% !important;
  bottom: auto !important;
  z-index: 50 !important;
  max-height: 200px !important;
  overflow-y: auto !important;
}

// Alternative approach for native select elements
:deep(select) {
  // Force native select to open downward
  transform: none !important;
}

// Ensure parent containers don't cause overflow issues
.overflow-x-auto {
  overflow: visible !important;
}

// Make sure table cells allow dropdown overflow
td {
  overflow: visible !important;
}
</style>
