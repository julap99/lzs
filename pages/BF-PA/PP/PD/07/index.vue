<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Surat Tawaran Penolong Amil
          </h2>
        </div>
      </template>

      <template #body>
        <div class="p-4">
          <div v-if="!offerLetterSent" class="space-y-6">
            <div class="bg-blue-50 p-4 rounded-lg">
              <p class="text-blue-800">
                Sila klik butang di bawah untuk menjana dan menghantar surat tawaran.
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
                @click="generateAndSendOfferLetter"
              >
                Jana & Hantar Surat Tawaran
              </rs-button>
            </div>
          </div>

          <div v-else class="space-y-6">
            <div class="bg-green-50 p-4 rounded-lg">
              <p class="text-green-800">
                Surat tawaran telah dijana dan dihantar. Sila klik butang di bawah untuk teruskan.
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
                @click="navigateTo('/BF-PA/PP/PD/08')"
              >
                Teruskan
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
  title: "Surat Tawaran Penolong Amil",
  description: "Jana dan hantar surat tawaran penolong amil",
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
    name: "Surat Tawaran",
    type: "current",
    path: "/BF-PA/PP/PD/07",
  },
]);

// Mock data - in real implementation, this would be an API call
const offerLetterSent = ref(false);

const generateAndSendOfferLetter = () => {
  // Mock API call to generate and send offer letter
  offerLetterSent.value = true;
};

const goBack = () => {
  navigateTo('/BF-PA/PP/PD/06');
};
</script> 