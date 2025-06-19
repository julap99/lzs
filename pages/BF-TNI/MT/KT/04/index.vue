<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Tentukan Jumlah Tunai
          </h2>
        </div>
      </template>

      <template #body>
        <FormKit
          type="form"
          :actions="false"
          @submit="handleSubmit"
          v-model="formData"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Nama & Kod Cawangan -->
            <FormKit
              type="text"
              name="branchName"
              label="Nama & Kod Cawangan"
              :value="selectedSafeBox?.cawangan"
              disabled
            />

            <!-- Jenis Akaun Peti Besi -->
            <FormKit
              type="select"
              name="accountType"
              label="Jenis Akaun Peti Besi"
              :options="accountTypes"
              validation="required"
            />

            <!-- Nilai Asas Peti Besi -->
            <FormKit
              type="text"
              name="baseValue"
              label="Nilai Asas Peti Besi (RM)"
              :value="selectedSafeBox?.nilaiAsas"
              disabled
            />

            <!-- Baki Semasa Peti Besi -->
            <FormKit
              type="text"
              name="currentBalance"
              label="Baki Semasa Peti Besi (RM)"
              :value="selectedSafeBox?.bakiSemasa"
              disabled
            />

            <!-- Had Minimum Baki -->
            <FormKit
              type="text"
              name="minimumThreshold"
              label="Had Minimum Baki (RM)"
              :value="selectedSafeBox?.ambangMinimum"
              disabled
            />

            <!-- Jumlah Topup -->
            <FormKit
              type="text"
              name="topupAmount"
              label="Jumlah Topup (RM)"
              :value="calculatedTopupAmount"
              disabled
            />

            <!-- Nama Pegawai -->
            <FormKit
              type="text"
              name="officerName"
              label="Nama Pegawai yang Menentukan"
              validation="required"
            />
          </div>

          <div class="flex justify-end mt-6 space-x-2">
            <rs-button variant="primary-outline" @click="navigateTo('/BF-TNI/MT/KT/04')">
              Batal
            </rs-button>
            <rs-button variant="primary" @click="handleCheck">
              Semak
            </rs-button>
          </div>
        </FormKit>
      </template>
    </rs-card>

    <!-- Confirmation Modal -->
    <rs-modal
      v-model="showConfirmModal"
      title="Semak Arahan"
      size="md"
      position="center"
    >
      <template #body>
        <p>Peti besi ini tidak mempunyai sebarang arahan pindaan tunai.</p>
        <div class="mt-4 space-y-2">
          <p class="font-medium">Ringkasan:</p>
          <div class="bg-gray-50 p-3 rounded">
            <p><span class="font-medium">Cawangan:</span> {{ formData.branchName }}</p>
            <p><span class="font-medium">Jenis Akaun:</span> {{ getAccountTypeLabel(formData.accountType) }}</p>
            <p><span class="font-medium">Jumlah Topup:</span> RM {{ formData.topupAmount }}</p>
            <p><span class="font-medium">Pegawai:</span> {{ formData.officerName }}</p>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end space-x-2">
          <rs-button variant="primary-outline" @click="showConfirmModal = false">
            Batal
          </rs-button>
          <rs-button variant="primary" @click="proceedToNextPage">
            Teruskan
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

definePageMeta({
  title: "Tentukan Jumlah Tunai",
  description: "Menentukan jumlah tunai untuk peti besi",
});

const breadcrumb = ref([
  {
    name: "Pengurusan Tunai",
    type: "link",
    path: "/BF-TNI/MT/KT",
  },
  {
    name: "Mengurus Tunai",
    type: "link",
    path: "/BF-TNI/MT/KT/01",
  },
  {
    name: "Tentukan Jumlah Tunai",
    type: "current",
    path: "/BF-TNI/MT/KT/04",
  },
]);

// Mock data for selected safe box
const selectedSafeBox = ref({
  cawangan: "Cawangan Kuala Lumpur",
  jenisAkaun: "Tunai",
  nilaiAsas: 10000,
  bakiSemasa: 5000,
  ambangMinimum: 5000,
});

// Form data
const formData = ref({
  branchName: selectedSafeBox.value.cawangan,
  accountType: "",
  baseValue: selectedSafeBox.value.nilaiAsas,
  currentBalance: selectedSafeBox.value.bakiSemasa,
  minimumThreshold: selectedSafeBox.value.ambangMinimum,
  topupAmount: 0,
  officerName: "",
});

// Account types options
const accountTypes = [
  { label: "Ekspres", value: "ekspres" },
  { label: "Amil", value: "amil" },
  { label: "Operasi Daerah", value: "operasi_daerah" },
];

// Calculate topup amount
const calculatedTopupAmount = computed(() => {
  const baseValue = selectedSafeBox.value.nilaiAsas;
  const currentBalance = selectedSafeBox.value.bakiSemasa;
  return baseValue - currentBalance;
});

// Modal control
const showConfirmModal = ref(false);

// Get account type label
const getAccountTypeLabel = (value) => {
  const account = accountTypes.find(type => type.value === value);
  return account ? account.label : value;
};

// Handle form submission
const handleSubmit = async () => {
  try {
    // Here you would typically make an API call to save the data
    console.log('Form submitted:', formData.value);
    
    // Close the modal
    showConfirmModal.value = false;
    
    // Show success message
    alert('Jumlah tunai berjaya disahkan');
    
    // Navigate back to the list page
    navigateTo('/BF-TNI/MT/KT/05');
  } catch (error) {
    console.error('Error submitting form:', error);
    alert('Ralat: Gagal mengesahkan jumlah tunai');
  }
};

// Handle check for Arahan
const handleCheck = async () => {
  try {
    // Here you would typically make an API call to check for Arahan
    // For now, we'll simulate that there's no Arahan
    const hasArahan = false; // This should come from your API

    if (!hasArahan) {
      showConfirmModal.value = true;
    } else {
      // If there is an Arahan, you might want to show a different message
      alert('Peti besi ini mempunyai arahan pindaan tunai yang aktif.');
    }
  } catch (error) {
    console.error('Error checking Arahan:', error);
    alert('Ralat: Gagal menyemak arahan');
  }
};

// Proceed to next page
const proceedToNextPage = () => {
  showConfirmModal.value = false;
  navigateTo('/BF-TNI/MT/KT/05');
};
</script>
