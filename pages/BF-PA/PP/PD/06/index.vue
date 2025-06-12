<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Cipta Akaun Login Penolong Amil
          </h2>
        </div>
      </template>

      <template #body>
        <div class="p-4">
          <div v-if="!hasAccount" class="space-y-6">
            <div class="bg-blue-50 p-4 rounded-lg">
              <p class="text-blue-800">
                Akaun login belum wujud. Sila klik butang di bawah untuk mencipta akaun.
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
                @click="createAccount"
              >
                Cipta Akaun
              </rs-button>
            </div>
          </div>

          <div v-else class="space-y-6">
            <div class="bg-green-50 p-4 rounded-lg">
              <p class="text-green-800">
                Akaun login telah wujud. Sila klik butang di bawah untuk teruskan.
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
                @click="navigateTo('/BF-PA/PP/PD/07')"
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
  title: "Cipta Akaun Login Penolong Amil",
  description: "Cipta akaun login untuk penolong amil",
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
    name: "Cipta Akaun",
    type: "current",
    path: "/BF-PA/PP/PD/06",
  },
]);

// Mock data - in real implementation, this would be an API call
const hasAccount = ref(false);

const createAccount = () => {
  // Mock API call to create account
  hasAccount.value = true;
};

const goBack = () => {
  navigateTo('/BF-PA/PP/PD');
};
</script>
