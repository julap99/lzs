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
          <h3 class="text-lg font-medium mb-4">Bantuan Sedia Ada dengan Perubahan</h3>
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
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="(perubahan, index) in existingBantuanChanges" :key="index">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ perubahan.bantuanSediaAda }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ perubahan.statusPerubahan }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    RM {{ perubahan.kadarBaru }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ perubahan.justifikasi }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end space-x-4">
          <rs-button variant="secondary" @click="handleCancel">
            Batal / Kembali ke Permohonan
          </rs-button>
          <rs-button variant="primary" @click="handleConfirm">
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
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";

definePageMeta({
  title: "Papar Syor Bantuan",
  description: "Papar dan sahkan syor bantuan yang dijana oleh sistem",
});

const router = useRouter();
const toast = useToast();
const showConfirmationModal = ref(false);

// Mock user profile data - replace with actual data from your auth system
const userProfile = ref({
  nama: "Ahmad bin Abdullah",
  noKadPengenalan: "901231012345",
  statusHousehold: "Miskin",
  statusIndividu: "Asnaf Fakir",
  multidimensiAsnaf: "Fakir Miskin",
});

// Mock suggested bantuan data - replace with actual data from your API
const suggestedBantuan = ref([
  {
    jenisBantuan: "Bantuan Bulanan",
    kategoriBantuan: "Asasi",
    kadarBantuan: 800,
    butiranKelayakan: "1 pek 3 bulan",
    skorAI: 95,
    status: "Disyorkan",
  },
  {
    jenisBantuan: "Bantuan Pendidikan",
    kategoriBantuan: "Utama",
    kadarBantuan: 1200,
    butiranKelayakan: "Sekali setahun",
    skorAI: 85,
    status: "Disyorkan",
  },
]);

// Mock existing bantuan changes - replace with actual data from your API
const existingBantuanChanges = ref([
  {
    bantuanSediaAda: "Bantuan Bulanan",
    statusPerubahan: "Miskin → Fakir",
    kadarBaru: 800,
    justifikasi: "Perubahan status berdasarkan profil terkini",
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
    name: "Papar Syor Bantuan",
    type: "current",
    path: "/BF-BTN/PB/syor-bantuan",
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
</script>

<style lang="scss" scoped>
// Add any custom styles here
</style> 