<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Papar Syor Bantuan</h2>
          <rs-badge v-if="formData.status" :variant="getStatusVariant(formData.status)">
            {{ formData.status }}
          </rs-badge>
        </div>
      </template>

      <template #body>
        <!-- Section 1: Profil Pemohon (Read-Only) -->
        <div class="mb-8">
          <h3 class="text-lg font-medium mb-4">Profil Pemohon</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormKit
              type="text"
              name="namaPemohon"
              label="Nama Pemohon"
              :value="userProfile.nama"
              disabled
            />
            <FormKit
              type="text"
              name="noKadPengenalan"
              label="No. Kad Pengenalan"
              :value="userProfile.noKadPengenalan"
              disabled
            />
            <FormKit
              type="text"
              name="statusHousehold"
              label="Status Household"
              :value="userProfile.statusHousehold"
              disabled
            />
            <FormKit
              type="text"
              name="statusIndividu"
              label="Status Individu"
              :value="userProfile.statusIndividu"
              disabled
            />
            <FormKit
              type="text"
              name="multidimensiAsnaf"
              label="Multidimensi Asnaf"
              :value="userProfile.multidimensiAsnaf"
              disabled
            />
          </div>
        </div>

        <!-- Section 2: Senarai Bantuan Disyorkan -->
        <div class="mb-8">
          <h3 class="text-lg font-medium mb-4">Senarai Bantuan Disyorkan</h3>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jenis Bantuan
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kategori Bantuan
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kadar Bantuan
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Butiran Kelayakan
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Skor AI
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="(bantuan, index) in suggestedBantuan" :key="index">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ bantuan.jenisBantuan }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ bantuan.kategoriBantuan }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    RM {{ bantuan.kadarBantuan }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ bantuan.butiranKelayakan }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ bantuan.skorAI }}%
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <rs-badge :variant="getStatusVariant(bantuan.status)">
                      {{ bantuan.status }}
                    </rs-badge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Section 3: Bantuan Sedia Ada dengan Perubahan -->
        <div class="mb-8">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium">Bantuan Sedia Ada dengan Perubahan</h3>
            <rs-button variant="primary" @click="addNewBantuan">
              <Icon name="material-symbols:add" class="mr-2" />
              Tambah Bantuan
            </rs-button>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bantuan Sedia Ada
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status Perubahan
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kadar Baru
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Justifikasi
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tindakan
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="(perubahan, index) in existingBantuanChanges" :key="index">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <FormKit
                      type="select"
                      v-model="perubahan.bantuanSediaAda"
                      :options="bantuanOptions"
                      :disabled="!isStaff"
                    />
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <FormKit
                      type="select"
                      v-model="perubahan.statusPerubahan"
                      :options="statusPerubahanOptions"
                      :disabled="!isStaff"
                    />
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <FormKit
                      type="number"
                      v-model="perubahan.kadarBaru"
                      :disabled="!isStaff"
                    />
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <FormKit
                      type="textarea"
                      v-model="perubahan.justifikasi"
                      :disabled="!isStaff"
                      :rows="2"
                    />
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex space-x-2">
                      <rs-button
                        variant="danger"
                        size="sm"
                        @click="removeBantuan(index)"
                        :disabled="!isStaff"
                      >
                        <Icon name="material-symbols:delete" />
                      </rs-button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            
            <!-- Ulasan oleh PAK/EOAD -->
            <div class="mt-6">
              <FormKit
                type="textarea"
                name="ulasanPakEoad"
                v-model="ulasanPakEoad"
                label="Ulasan oleh PAK/EOAD"
                placeholder="Masukkan ulasan..."
                validation="required"
                :rows="4"
                :disabled="!isStaff"
              />
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end space-x-4">
          <rs-button variant="secondary" @click="handleCancel">
            Batal / Kembali ke Permohonan
          </rs-button>
          <rs-button variant="warning" @click="handleSiasatan">
            Siasatan  oleh PAK
          </rs-button>
          <rs-button variant="primary" @click="handleConfirm" :disabled="!isFormValid">
            Sahkan Syor Bantuan
          </rs-button>
        </div>
      </template>
    </rs-card>

    <!-- Confirmation Modal -->
    <rs-modal
      v-model="showConfirmationModal"
      title="Sahkan Syor Bantuan"
      :show-close="true"
      position="center"
    >
      <template #default>
        <p class="text-center mb-6">
          Adakah anda pasti untuk mengesahkan syor bantuan ini?
        </p>
        <p class="text-gray-600 text-sm">
          Setelah disahkan, syor bantuan ini akan dikunci dan diteruskan ke proses seterusnya.
        </p>
      </template>
      <template #footer>
        <div class="flex justify-end space-x-4">
          <rs-button variant="secondary" @click="showConfirmationModal = false">
            Batal
          </rs-button>
          <rs-button variant="primary" @click="confirmSyor">
            Ya, Sahkan
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";

// Import the bantuan data directly
import bantuanJson from './Grouped by Aid Code.json';

definePageMeta({
  title: "Papar Syor Bantuan",
  description: "Papar dan sahkan syor bantuan yang dijana oleh sistem",
});

const router = useRouter();
const toast = useToast();
const showConfirmationModal = ref(false);
const bantuanData = ref(bantuanJson);

// Add ulasan ref for validation
const ulasanPakEoad = ref('');

// Add formData ref with default status
const formData = ref({
  status: "Dalam Semakan"
});

// Mock user profile data - replace with actual data from your auth system
const userProfile = ref({
  nama: "Ahmad bin Abdullah",
  noKadPengenalan: "901231012345",
  statusHousehold: "Fakir",
  statusIndividu: "Fakir",
  multidimensiAsnaf: "Tidak Produktif",
});

// Compute suggested bantuan data based on the JSON structure
const suggestedBantuan = computed(() => {
  const allSuggestions = [];
  if (bantuanData.value.bantuan) {
    for (const [categoryName, category] of Object.entries(bantuanData.value.bantuan)) {
      for (const [productName, packages] of Object.entries(category)) {
        // Add each package as a suggested bantuan
        packages.forEach(pkg => {
          allSuggestions.push({
            jenisBantuan: categoryName,
            kategoriBantuan: productName,
            kadarBantuan: Math.floor(Math.random() * 1000) + 500, // Random amount between 500-1500 for demo
            butiranKelayakan: pkg,
            skorAI: Math.floor(Math.random() * 30) + 70, // Random score between 70-100 for demo
            status: "Disyorkan",
          });
        });
      }
    }
  }

  // Randomly select 2-3 suggestions
  const numSuggestions = Math.floor(Math.random() * 2) + 2; // Random number between 2-3
  const shuffled = [...allSuggestions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numSuggestions);
});

// Mock staff check - replace with actual auth check
const isStaff = computed(() => true); // Set to true for testing

// Check if form is valid (ulasan is filled)
const isFormValid = computed(() => {
  return ulasanPakEoad.value.trim().length > 0;
});

// Compute all available bantuan options for the dropdown
const bantuanOptions = computed(() => {
  const options = [
    { label: '-- Pilih --', value: '', disabled: true }
  ];
  if (bantuanData.value.bantuan) {
    for (const [categoryName, category] of Object.entries(bantuanData.value.bantuan)) {
      for (const [productName, packages] of Object.entries(category)) {
        packages.forEach(pkg => {
          options.push({
            label: `${categoryName} - ${productName} - ${pkg}`,
            value: `${categoryName}|${productName}|${pkg}`
          });
        });
      }
    }
  }
  return options;
});

// Status perubahan options
const statusPerubahanOptions = [
  { label: '-- Pilih --', value: '', disabled: true },
  { label: 'Miskin → Fakir', value: 'Miskin → Fakir' },
  { label: 'Fakir → Miskin', value: 'Fakir → Miskin' },
  { label: 'Tiada Perubahan', value: 'Tiada Perubahan' },
];

// Mock existing bantuan changes - replace with actual data from your API
const existingBantuanChanges = ref([
  {
    bantuanSediaAda: '',
    statusPerubahan: '',
    kadarBaru: 0,
    justifikasi: '',
  },
]);

// Breadcrumb items
const breadcrumb = ref([
  {
    name: "Permohonan Bantuan",
    type: "link",
    path: "/BF-BTN/PB/senarai",
  },
  {
    name: "Mohon Bantuan",
    type: "link",
    path: "/BF-BTN/PB/mohon-bantuan",
  },
  {
    name: "Papar Syor Bantuan",
    type: "current",
    path: "/BF-BTN/PB/mohon-bantuan/syor",
  },
]);

// Status variant helper
const getStatusVariant = (status) => {
  const variants = {
    "Disyorkan": "success",
    "Dalam Semakan": "warning",
    "Ditolak": "danger",
  };
  return variants[status] || "default";
};

// Cancel handler
const handleCancel = () => {
  router.push("/BF-BTN/PB/mohon-bantuan");
};

// Confirm handler
const handleConfirm = () => {
  if (!isFormValid.value) {
    toast.error("Sila isi ulasan oleh PAK/EOAD terlebih dahulu");
    return;
  }
  showConfirmationModal.value = true;
};

// Confirm syor handler
const confirmSyor = async () => {
  try {
    // TODO: Implement API call to confirm syor
    showConfirmationModal.value = false;
    toast.success("Syor bantuan telah berjaya disahkan");
    router.push("/BF-BTN/PB/senarai");
  } catch (error) {
    console.error("Error confirming syor:", error);
    toast.error("Ralat semasa mengesahkan syor bantuan");
  }
};

// Add new bantuan
const addNewBantuan = () => {
  existingBantuanChanges.value.push({
    bantuanSediaAda: '',
    statusPerubahan: '',
    kadarBaru: 0,
    justifikasi: '',
  });
};

// Remove bantuan
const removeBantuan = (index) => {
  existingBantuanChanges.value.splice(index, 1);
};

// Siasatan handler
const handleSiasatan = () => {
  toast.warning("Siasatan oleh PAK/EOAD akan dijalankan");
};
</script>

<style lang="scss" scoped>
// Add any custom styles here
</style> 