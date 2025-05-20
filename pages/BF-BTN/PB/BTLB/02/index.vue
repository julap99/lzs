<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Semakan Pembatalan Bantuan</h2>
          <rs-badge
            v-if="formData.status"
            :variant="getStatusVariant(formData.status)"
          >
            {{ formData.status }}
          </rs-badge>
        </div>
      </template>

      <template #body>
        <FormKit
          type="form"
          :actions="false"
          @submit="handleSubmit"
          v-model="formData"
        >
          <!-- Basic Information Section -->
          <div class="space-y-6">
            <h3 class="text-lg font-medium">Maklumat Pemohon</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit type="text" name="kariah" label="Kariah" disabled />
              <FormKit
                type="text"
                name="kategoriPemohon"
                label="Kategori Pemohon"
                disabled
              />
              <FormKit
                type="text"
                name="idPemohon"
                label="ID Pemohon"
                disabled
              />
              <FormKit
                type="text"
                name="tarikhKemaskini"
                label="Tarikh Kemaskini Pemohon"
                disabled
              />
              <FormKit
                type="text"
                name="noKadPengenalan"
                label="No Kad Pengenalan"
                disabled
              />
              <FormKit
                type="text"
                name="namaPemohon"
                label="Nama Pemohon"
                disabled
              />
              <FormKit
                type="textarea"
                name="alamatPemohon"
                label="Alamat Pemohon"
                disabled
                class="md:col-span-2"
              />
            </div>
          </div>

          <!-- Bantuan List Section -->
          <div class="space-y-6 mt-8">
            <h3 class="text-lg font-medium">Senarai Bantuan Diterima</h3>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Nama Bantuan
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Jumlah
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Tarikh Mula
                    </th>
                    <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Tarikh Tamat
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr
                    v-for="bantuan in formData.senaraiBantuan"
                    :key="bantuan.id"
                  >
                    <td class="px-6 py-4 whitespace-nowrap">
                      {{ bantuan.nama }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      RM {{ bantuan.jumlah }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <rs-badge :variant="getStatusVariant(bantuan.status)">
                        {{ bantuan.status }}
                      </rs-badge>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      {{ bantuan.tarikhMula }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      {{ bantuan.tarikhTamat }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Remarks Section -->
          <div class="space-y-6 mt-8">
            <h3 class="text-lg font-medium">Ulasan</h3>
            <div class="grid grid-cols-1 gap-4">
              <FormKit
                type="textarea"
                name="remarks"
                label="Ulasan"
                validation="required"
                validation-label="Ulasan"
                placeholder="Sila masukkan ulasan anda..."
              />
            </div>
          </div>

          <!-- Form Actions -->
          <div class="flex justify-end space-x-4 mt-8">
            <rs-button
              variant="primary-outline"
              @click="navigateTo('/BF-BTN/PB/BTLB/01')"
            >
              Kembali
            </rs-button>
            <rs-button variant="primary" @click="handleSubmit">
              Hantar
            </rs-button>
          </div>
        </FormKit>
      </template>
    </rs-card>

    <!-- Confirmation Modal -->
    <rs-modal
      v-model="showSuccessModal"
      title="Hantar ke Pelulus"
      size="md"
      position="center"
    >
      <template #body>
        <div class="text-center">
          <Icon
            name="material-symbols:help-outline"
            class="text-blue-500 text-5xl mb-4"
          />
          <p class="text-lg mb-2">
            Adakah anda pasti untuk menghantar semakan ini kepada pelulus?
          </p>
          <p class="text-gray-600">
            Semakan ini akan dihantar kepada pelulus untuk kelulusan seterusnya.
          </p>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-center space-x-4">
          <rs-button
            variant="primary-outline"
            @click="showSuccessModal = false"
          >
            Batal
          </rs-button>
          <rs-button variant="primary" @click="confirmSubmit">
            Ya, Hantar
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useToast } from "vue-toastification";
import { useRoute } from "vue-router";

definePageMeta({
  title: "Semakan Bantuan",
  description: "Semak dan ulas permohonan bantuan",
});

const route = useRoute();
const toast = useToast();
const showSuccessModal = ref(false);

const breadcrumb = ref([
  {
    name: "Pengurusan Bantuan",
    type: "link",
    path: "/BF-BTN/PB/BTLB/01",
  },
  {
    name: "Semakan Bantuan",
    type: "current",
    path: "/BF-BTN/PB/BTLB/02",
  },
]);

const formData = ref({
  kariah: "",
  kategoriPemohon: "",
  idPemohon: "",
  tarikhKemaskini: "",
  noKadPengenalan: "",
  namaPemohon: "",
  alamatPemohon: "",
  senaraiBantuan: [],
  remarks: "",
  status: "Menunggu Semakan",
});

const getStatusVariant = (status) => {
  const variants = {
    "Menunggu Semakan": "warning",
    Lulus: "success",
    Tolak: "danger",
    "Kembali untuk Pembetulan": "warning",
    "Dalam Pemerhatian": "warning",
  };
  return variants[status] || "default";
};

onMounted(async () => {
  // TODO: Fetch bantuan data based on ID from route.params.id
  // For now using mock data
  const mockData = {
    kariah: "Masjid Al-Hidayah",
    kategoriPemohon: "Asnaf Fakir",
    idPemohon: "P001",
    tarikhKemaskini: "2024-03-15",
    noKadPengenalan: "900101-01-1234",
    namaPemohon: "Ahmad bin Abdullah",
    alamatPemohon: "No 123, Jalan Merdeka, 50000 Kuala Lumpur",
    senaraiBantuan: [
      {
        id: 1,
        nama: "Bantuan Kewangan Bulanan",
        jumlah: "500.00",
        status: "Aktif",
        tarikhMula: "2024-01-01",
        tarikhTamat: "2024-12-31",
      },
      {
        id: 2,
        nama: "Bantuan Pendidikan",
        jumlah: "1000.00",
        status: "Aktif",
        tarikhMula: "2024-01-01",
        tarikhTamat: "2024-12-31",
      },
    ],
    status: "Dalam Pemerhatian",
  };

  formData.value = { ...mockData };
});

const handleSubmit = async (formData) => {
  try {
    // Show confirmation modal
    showSuccessModal.value = true;
  } catch (error) {
    toast.error("Ralat semasa mengemaskini status bantuan");
    console.error("Error updating bantuan status:", error);
  }
};

const confirmSubmit = async () => {
  try {
    // TODO: Implement API call to update bantuan status
    console.log("Updating bantuan status:", formData.value);

    // Close modal
    showSuccessModal.value = false;

    // Show success toast
    toast.success("Semakan telah berjaya dihantar kepada pelulus");

    // Navigate back to list
    // navigateToList();
    navigateTo("/BF-BTN/PB/BTLB/03");
  } catch (error) {
    toast.error("Ralat semasa mengemaskini status bantuan");
    console.error("Error updating bantuan status:", error);
  }
};

const navigateToList = () => {
  navigateTo("/BF-BTN/PB/BTLB/01");
};
</script>
