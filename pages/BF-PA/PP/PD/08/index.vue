<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Terima Surat Tawaran
          </h2>
        </div>
      </template>

      <template #body>
        <div class="p-4">
          <div v-if="!hasResponded" class="space-y-6">
            <div class="bg-blue-50 p-4 rounded-lg">
              <p class="text-blue-800">
                Sila pilih tindakan anda untuk surat tawaran:
              </p>
            </div>

            <div class="flex justify-end space-x-3">
              <rs-button
                variant="primary-outline"
                @click="goBack"
              >
                Kembali
              </rs-button>
              <rs-button
                variant="danger"
                @click="declineOffer"
              >
                Tidak Setuju
              </rs-button>
              <rs-button
                variant="primary"
                @click="acceptOffer"
              >
                Setuju & Terima
              </rs-button>
            </div>
          </div>

          <div v-else-if="offerAccepted" class="space-y-6">
            <div class="bg-green-50 p-4 rounded-lg">
              <p class="text-green-800">
                Surat tawaran telah diterima. Kad Tauliah telah dijana. Sila klik butang di bawah untuk lengkapkan maklumat peribadi.
              </p>
            </div>

            <div class="flex justify-end space-x-3">
              <rs-button
                variant="primary-outline"
                @click="goBack"
              >
                Kembali
              </rs-button>
              <rs-button
                variant="primary"
                @click="navigateTo('/BF-PA/PP/PD/09')"
              >
                Teruskan
              </rs-button>
            </div>
          </div>

          <div v-else class="space-y-6">
            <div class="bg-red-50 p-4 rounded-lg">
              <p class="text-red-800">
                Surat tawaran telah ditolak. Status permohonan telah dikemaskini.
              </p>
            </div>

            <div class="flex justify-end">
              <rs-button
                variant="primary"
                @click="navigateTo('/BF-PA/PP/PD')"
              >
                Kembali ke Senarai
              </rs-button>
            </div>
          </div>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref } from 'vue';

definePageMeta({
  title: "Terima Surat Tawaran",
  description: "Terima atau tolak surat tawaran penolong amil",
});

const breadcrumb = ref([
  {
    name: "Penolong Amil",
    type: "link",
    path: "/BF-PA/PP/PM/01",
  },
  {
    name: "Pendaftaran",
    type: "link",
    path: "/BF-PA/PP/PM/01",
  },
  {
    name: "Terima Tawaran",
    type: "current",
    path: "/BF-PA/PP/PD/08",
  },
]);

// Mock data - in real implementation, this would be an API call
const hasResponded = ref(false);
const offerAccepted = ref(false);

const acceptOffer = () => {
  // Mock API call to accept offer and generate Kad Tauliah
  hasResponded.value = true;
  offerAccepted.value = true;
};

const declineOffer = () => {
  // Mock API call to decline offer and update status
  hasResponded.value = true;
  offerAccepted.value = false;
};

const goBack = () => {
  navigateTo('/BF-PA/PP/PD/07');
};
</script> 