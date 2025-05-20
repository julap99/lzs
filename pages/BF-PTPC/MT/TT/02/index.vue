<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Mohon Untuk Ambil Tunai (EKP)</h2>
        </div>
      </template>

      <template #body>
        <!-- Info Details Section -->
        <div class="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 class="text-lg font-medium mb-4">Maklumat Aktiviti</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-600">Nama EKP</p>
              <p class="font-medium">{{ currentUserName }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Tarikh</p>
              <p class="font-medium">{{ formattedCurrentDate }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Keterangan</p>
              <p class="font-medium">
                Pemohon hadir secara fizikal ke cawangan untuk mengambil bantuan
                yang telah diluluskan.
              </p>
            </div>
          </div>
        </div>

        <!-- Verification Result - Only shown after semak -->
        <div v-if="verificationAttempted" class="mb-6">
          <div class="flex items-center gap-2 mb-4" v-if="asnafVerified">
            <Icon
              name="mdi:check-circle"
              class="text-green-500"
              size="1.5rem"
            />
            <p class="text-green-600 font-medium">
              Rekod pemohon ditemui dalam sistem
            </p>
          </div>
          <div class="flex items-center gap-2 mb-4" v-else>
            <Icon name="mdi:alert-circle" class="text-red-500" size="1.5rem" />
            <p class="text-red-600 font-medium">
              Rekod pemohon tidak ditemui dalam sistem
            </p>
          </div>
        </div>

        <!-- Simplified Form Section -->
        <div class="mb-6">
          <h3 class="text-lg font-medium mb-2">Semakan Kad Pengenalan</h3>
          <FormKit type="form" :actions="false" @submit="handleSubmit">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit
                type="text"
                name="noKadPengenalan"
                label="No. Kad Pengenalan"
                validation="required"
                :validation-messages="{
                  required: 'No. Kad Pengenalan adalah wajib',
                }"
                :disabled="processing"
                v-model="formData.noKadPengenalan"
                placeholder="Contoh: 880101015555"
              />

              <div class="flex items-end">
                <rs-button
                  variant="primary-outline"
                  class=""
                  @click="verifyAsnaf"
                  :disabled="processing || !formData.noKadPengenalan"
                >
                  <span v-if="processing">
                    <Icon name="eos-icons:loading" class="mr-1" size="1rem" />
                    Menyemak...
                  </span>
                  <span v-else>Semak</span>
                </rs-button>
              </div>
            </div>

            <!-- Display asnaf details if verified -->
            <div v-if="asnafVerified" class="mt-4 p-4 bg-green-50 rounded-lg">
              <h4 class="text-base font-medium mb-2">Maklumat Pemohon</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-gray-600">Nama</p>
                  <p class="font-medium">{{ formData.namaAsnaf }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600">No. Kad Pengenalan</p>
                  <p class="font-medium">{{ formData.noKadPengenalan }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600">Status Bantuan</p>
                  <p class="font-medium text-green-600">
                    {{ asnafDetails.status }}
                  </p>
                </div>
                <div>
                  <p class="text-sm text-gray-600">Rujukan</p>
                  <p class="font-medium">{{ asnafDetails.rujukan }}</p>
                </div>
              </div>
            </div>

            <div class="mt-6 flex justify-end gap-4">
              <div>
                <rs-button
                  variant="primary-outline"
                  @click="navigateBack"
                  :disabled="processing"
                >
                  Kembali
                </rs-button>
              </div>

              <div>
                <rs-button
                  v-if="asnafVerified"
                  variant="primary"
                  class="ml-auto"
                  @click="proceedToNextPage"
                  :disabled="processing"
                >
                  Teruskan
                </rs-button>
              </div>
            </div>
          </FormKit>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

definePageMeta({
  title: "Mohon Untuk Ambil Tunai",
});

const route = useRoute();
const router = useRouter();
const processing = ref(false);
const asnafVerified = ref(false);
const verificationAttempted = ref(false);
const breadcrumb = ref([
  {
    name: "Pengurusan Tunai",
    type: "link",
    path: `/BF-PTPC/MT/TT/01`,
  },
  {
    name: "Agih Tunai Kaunter",
    type: "link",
    path: `/BF-PTPC/MT/TT/01`,
  },
  {
    name: "Mohon Untuk Ambil Tunai (EKP)",
    type: "current",
    path: "/BF-PTPC/MT/TT/02",
  },
]);

const asnafDetails = ref({
  status: "Diluluskan",
  rujukan: "BTN-" + new Date().toISOString().slice(0, 10).replace(/-/g, ""),
});

const currentUserName = ref("Noor Aisyah binti Abdullah");
const currentDate = computed(() => {
  return new Date().toISOString().slice(0, 10);
});
const formattedCurrentDate = computed(() => {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date().toLocaleDateString("ms-MY", options);
});

const formData = ref({
  noKadPengenalan: "",
  namaAsnaf: "",
});

const navigateBack = () => {
  router.back();
};

const verifyAsnaf = () => {
  if (!formData.value.noKadPengenalan) {
    return;
  }

  processing.value = true;

  // Simulate API call to verify asnaf in NAS system
  setTimeout(() => {
    processing.value = false;
    verificationAttempted.value = true;

    // Simulated verification logic
    // In a real application, this would be an API call to check the database

    asnafVerified.value = true;
    formData.value.namaAsnaf = "Muhammad bin Ibrahim"; // Simulated name from system
  }, 1000);
};

const proceedToNextPage = () => {
  // Navigate to the next page in the process
  // In a real app, you might want to pass the IC number as a parameter

  router.push(`/BF-PTPC/MT/TT/03`);
};

const handleSubmit = (data) => {
  verifyAsnaf();
};
</script>
