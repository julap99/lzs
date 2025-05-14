<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Penentuan Status Asnaf (NAS)</h2>
        </div>
      </template>

      <template #body>
        <div class="mb-6">
          <p class="text-sm text-gray-600 mb-4">
            Sahkan maklumat dan tentukan kategori asnaf berdasarkan had kifayah
            yang telah dikira
          </p>

          <!-- Read-Only Information Section -->
          <div class="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 class="font-medium text-gray-700 mb-4">Maklumat Asas</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm text-gray-500"
                  >No. Kad Pengenalan</label
                >
                <div class="font-medium">{{ formData.icNumber }}</div>
              </div>
              <div>
                <label class="block text-sm text-gray-500">Nama</label>
                <div class="font-medium">{{ formData.name }}</div>
              </div>
              <div>
                <label class="block text-sm text-gray-500">Alamat</label>
                <div class="font-medium">{{ formData.address }}</div>
              </div>
            </div>
          </div>

          <!-- Had Kifayah Results (Read Only) -->
          <div class="bg-blue-50 p-4 rounded-lg mb-6">
            <h3 class="font-medium text-gray-700 mb-4">
              Keputusan Had Kifayah
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm text-gray-500">% Had Kifayah</label>
                <div class="text-lg font-semibold">
                  {{ formData.kifayahPercentage }}%
                </div>
              </div>
              <div>
                <label class="block text-sm text-gray-500"
                  >Kategori Cadangan</label
                >
                <div class="text-lg">{{ formData.suggestedCategory }}</div>
              </div>
              <div>
                <label class="block text-sm text-gray-500">Status</label>
                <div class="text-lg">
                  {{ getStatusLabel(formData.suggestedCategory) }}
                </div>
              </div>
            </div>
            <div class="mt-3 text-sm text-gray-600">
              <p>Kriteria Kategori:</p>
              <ul class="list-disc pl-5">
                <li>0-49%: Fakir</li>
                <li>50-100%: Miskin</li>
                <li>>100%: Non-FM</li>
              </ul>
            </div>
          </div>

          <!-- User Input Section -->
          <div class="bg-green-50 p-4 rounded-lg mb-6">
            <h3 class="font-medium text-gray-700 mb-4">Pengkategorian Asnaf</h3>

            <FormKit type="form" @submit="submitForm" :actions="false">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Kategori Keluarga Asnaf Dropdown -->
                <FormKit
                  type="select"
                  name="familyCategory"
                  label="Kategori Keluarga Asnaf*"
                  validation="required"
                  v-model="formData.familyCategory"
                  :options="familyCategoryOptions"
                  placeholder="Pilih kategori keluarga"
                  :validation-messages="{
                    required: 'Sila pilih kategori keluarga',
                  }"
                />

                <!-- Kategori Asnaf Dropdown -->
                <FormKit
                  type="select"
                  name="asnafCategory"
                  label="Kategori Asnaf*"
                  validation="required"
                  v-model="formData.asnafCategory"
                  :options="asnafCategoryOptions"
                  placeholder="Pilih kategori asnaf"
                  :validation-messages="{
                    required: 'Sila pilih kategori asnaf',
                  }"
                />
              </div>

              <div class="mt-6 flex justify-end gap-4">
                <rs-button
                  variant="primary-outline"
                  @click="navigateTo('/BF-PRF/AS/FR/03')"
                >
                  Kembali
                </rs-button>

                <rs-button
                  type="submit"
                  variant="primary"
                  :disabled="processing"
                  @click="submitForm"
                >
                  <span v-if="processing">
                    <Icon name="eos-icons:loading" size="1rem" class="mr-1" />
                    Menyimpan...
                  </span>
                  <span v-else>Simpan</span>
                </rs-button>
              </div>
            </FormKit>
          </div>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref } from "vue";

definePageMeta({
  title: "Penentuan Status Asnaf",
});

const processing = ref(false);

const breadcrumb = ref([
  {
    name: "Analisa Data",
    type: "current",
    path: "/kifayah-analysis",
  },
]);

// Sample data - should come from previous page/API
const formData = ref({
  icNumber: "880101121234",
  name: "Ahmad bin Abdullah",
  address: "No 12, Jalan Merdeka, 43000 Kajang, Selangor",
  kifayahPercentage: 65.25, // Pre-calculated value from previous page
  suggestedCategory: "Miskin", // Pre-determined from calculation
  familyCategory: "miskin", // Auto-set based on suggested category
  asnafCategory: null, // To be selected by admin
});

const familyCategoryOptions = {
  fakir: "Fakir (0-49% Had Kifayah)",
  miskin: "Miskin (50-100% Had Kifayah)",
  non_fm: "Non-FM (>100% Had Kifayah)",
};

const asnafCategoryOptions = {
  fakir: "Fakir",
  miskin: "Miskin",
  fisabilillah: "Fisabilillah",
  gharimin: "Gharimin",
  ibnussabil: "Ibnus Sabil",
  muallaf: "Muallaf",
  amil: "Amil",
};

const getStatusLabel = (category) => {
  switch (category) {
    case "Fakir":
      return "Layak (Fakir)";
    case "Miskin":
      return "Layak (Miskin)";
    default:
      return "Tidak Layak";
  }
};

const submitForm = () => {
  processing.value = true;

  // Simulate form submission
  setTimeout(() => {
    console.log("Form submitted:", {
      ...formData.value,
      finalCategory: {
        family: formData.value.familyCategory,
        asnaf: formData.value.asnafCategory,
      },
    });

    // Navigate after submission
    navigateTo("/BF-PRF/AS/UP/08");
    processing.value = false;
  }, 1000);
};
</script>

<style scoped>
/* Add any custom styles here if needed */
</style>
