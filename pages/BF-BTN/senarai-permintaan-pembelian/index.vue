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
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Unit
                      </th>
                      <th
                        scope="col"
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Kuantiti
                      </th>
                      <th
                        scope="col"
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
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
            </template>
          </rs-card>
        </section>

        <!-- Summary Section -->
        <section aria-labelledby="summary-title">
          <rs-card class="shadow-sm border-0 bg-white">
            <template #header>
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0" aria-hidden="true">
                  <div
                    class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center"
                  >
                    <Icon name="ph:calculator" class="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <div>
                  <h2
                    class="text-lg font-semibold text-gray-900"
                    id="summary-title"
                  >
                    Ringkasan
                  </h2>
                  <p class="text-sm text-gray-500">
                    Jumlah keseluruhan kos pembelian
                  </p>
                </div>
              </div>
            </template>

            <template #body>
              <div class="flex justify-start">
                <div class="bg-blue-50 rounded-lg p-6 text-left min-w-[300px]">
                  <div class="text-lg font-medium text-blue-600 mb-2">Jumlah Keseluruhan (RM)</div>
                  <div class="text-4xl font-bold text-blue-900">
                    {{ formatCurrency(totalKos) }}
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

// Unit options based on Excel sheet
const unitOptions = [
  { label: "-- Pilih Unit --", value: "", disabled: true },
  { label: "Nos", value: "Nos" },
  { label: "Kotak", value: "Kotak" },
  { label: "Box", value: "Box" },
  { label: "Bundle", value: "Bundle" },
  { label: "Liter", value: "Liter" },
  { label: "Kg", value: "Kg" },
  { label: "Meter", value: "Meter" },
  { label: "Set", value: "Set" },
  { label: "Unit", value: "Unit" },
  { label: "Pasang", value: "Pasang" },
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

// Predefined items list based on Excel data
const predefinedItems = [
  { namaItem: "Cat Minyak Seamaster Venus (6406) (5L)", unit: "Nos", kuantiti: 1, harga: 72.00 },
  { namaItem: "Cat Minyak Seamaster Black (5L)", unit: "Nos", kuantiti: 2, harga: 72.00 },
  { namaItem: "Cat Minyak Seamaster Signal Red (6613) (5L)", unit: "Nos", kuantiti: 1, harga: 72.00 },
  { namaItem: "Cat Minyak Seamaster Smoke Grey (BS-0-095) (5L)", unit: "Nos", kuantiti: 1, harga: 72.00 },
  { namaItem: "Cat Minyak Green BS 6074", unit: "Nos", kuantiti: 1, harga: 72.00 },
  { namaItem: "Cat Putih", unit: "Nos", kuantiti: 5, harga: 72.00 },
  { namaItem: "Berus Cat", unit: "Nos", kuantiti: 5, harga: 5.50 },
  { namaItem: "WD40", unit: "Nos", kuantiti: 5, harga: 10.00 },
  { namaItem: "Roller Kecil", unit: "Nos", kuantiti: 40, harga: 1.00 },
  { namaItem: "Handle Roller Kecil", unit: "Nos", kuantiti: 4, harga: 2.00 },
  { namaItem: "Wood Filler 5kg", unit: "Nos", kuantiti: 2, harga: 39.00 },
  { namaItem: "Masking Tape", unit: "Kotak", kuantiti: 1, harga: 53.00 },
  { namaItem: "Kasut Bot Getah (High Cut)", unit: "Nos", kuantiti: 9, harga: 8.00 },
  { namaItem: "Guni", unit: "Nos", kuantiti: 50, harga: 0.60 },
  { namaItem: "Tali Mesin Rumput", unit: "Bundle", kuantiti: 2, harga: 70.00 },
  { namaItem: "Hazard Tape", unit: "Nos", kuantiti: 10, harga: 3.50 },
  { namaItem: "Safety Vest", unit: "Nos", kuantiti: 10, harga: 9.00 },
  { namaItem: "Drywall Screw 2\"", unit: "Box", kuantiti: 1, harga: 11.00 },
  { namaItem: "Drywall Screw 4\"", unit: "Box", kuantiti: 1, harga: 12.00 },
];

// Load saved data on mount
onMounted(() => {
  try {
    const savedData = localStorage.getItem('senaraiPermintaanPembelian');
    if (savedData) {
      const data = JSON.parse(savedData);
      formData.value.itemPembelian = data.itemPembelian || [];
      noRujukan.value = data.noRujukan || `SPP-${Date.now()}`;
    } else {
      // Load predefined items if no saved data
      formData.value.itemPembelian = [...predefinedItems];
    }
  } catch (error) {
    console.error("Error loading saved data:", error);
    // Fallback to predefined items
    formData.value.itemPembelian = [...predefinedItems];
  }
});
</script>

<style lang="scss" scoped>
// Add any custom styles here
</style>
