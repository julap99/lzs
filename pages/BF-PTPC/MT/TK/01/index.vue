<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Opening & Agihan Tunai ke Kaunter</h2>
        </div>
      </template>

      <template #body>
        <!-- Info Details Section -->
        <div class="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 class="text-lg font-medium mb-4">Maklumat Aktiviti</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-600">Nama PKP</p>
              <p class="font-medium">{{ currentUserName }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Tarikh</p>
              <p class="font-medium">{{ formattedCurrentDate }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Baki Tunai Dalam Tabung</p>
              <p class="font-medium text-lg text-primary-600">
                RM {{ tunaiDetails.bakiTabung }}
              </p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Rujukan</p>
              <p class="font-medium">{{ tunaiDetails.rujukan }}</p>
            </div>
          </div>
        </div>

        <!-- Success Message - Only shown after completion -->
        <div v-if="isCompleted" class="mb-6">
          <div class="flex items-center gap-2 mb-4">
            <Icon name="mdi:check-circle" class="text-green-500" size="1.5rem" />
            <p class="text-green-600 font-medium">
              Agihan tunai ke kaunter berjaya disahkan dan direkodkan
            </p>
          </div>
        </div>

        <!-- Form Section - Always shown -->
        <div class="mb-6">
          <h3 class="text-lg font-medium mb-2">Maklumat Opening Counter</h3>
          <FormKit type="form" :actions="false" @submit="handleSubmit">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit
                type="date"
                name="tarikhPembukaan"
                label="Tarikh Pembukaan"
                validation="required"
                :validation-messages="{
                  required: 'Tarikh pembukaan adalah wajib',
                }"
                :disabled="isCompleted"
                :value="currentDate"
              />

              <FormKit
                type="time"
                name="masaRekod"
                label="Masa Rekod"
                :disabled="isCompleted"
                :value="currentTime"
              />

              <FormKit
                type="text"
                name="namaPKP"
                label="Nama PKP"
                validation="required"
                :validation-messages="{
                  required: 'Nama PKP adalah wajib',
                }"
                :disabled="isCompleted"
                :value="currentUserName"
              />

              <FormKit
                type="number"
                name="jumlahPembukaanTunai"
                label="Jumlah Pembukaan Tunai (RM)"
                validation="required|min:0"
                :validation-messages="{
                  required: 'Jumlah pembukaan tunai adalah wajib',
                  min: 'Jumlah tidak boleh negatif',
                }"
                :disabled="isCompleted"
                v-model="formData.jumlahPembukaanTunai"
              />

              <div class="md:col-span-2">
                <h4 class="text-base font-medium mb-2 mt-2">
                  Maklumat Agihan ke Kaunter
                </h4>
              </div>

              <!-- Kaunter 1 -->
              <div class="md:col-span-2 p-3 border border-gray-200 rounded-md mb-2">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormKit
                    type="text"
                    name="namaEKP0"
                    label="Nama EKP (Kaunter 1)"
                    v-model="formData.agihanKaunter[0].namaEKP"
                    :disabled="isCompleted"
                  />

                  <FormKit
                    type="number"
                    name="jumlahAgihan0"
                    label="Jumlah Agihan (RM)"
                    validation="min:0"
                    :validation-messages="{
                      min: 'Jumlah tidak boleh negatif',
                    }"
                    v-model="formData.agihanKaunter[0].jumlahAgihan"
                    :disabled="isCompleted"
                  />
                </div>
              </div>

              <!-- Kaunter 2 -->
              <div class="md:col-span-2 p-3 border border-gray-200 rounded-md mb-2">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormKit
                    type="text"
                    name="namaEKP1"
                    label="Nama EKP (Kaunter 2)"
                    v-model="formData.agihanKaunter[1].namaEKP"
                    :disabled="isCompleted"
                  />

                  <FormKit
                    type="number"
                    name="jumlahAgihan1"
                    label="Jumlah Agihan (RM)"
                    validation="min:0"
                    :validation-messages="{
                      min: 'Jumlah tidak boleh negatif',
                    }"
                    v-model="formData.agihanKaunter[1].jumlahAgihan"
                    :disabled="isCompleted"
                  />
                </div>
              </div>

              <!-- Kaunter 3 -->
              <div class="md:col-span-2 p-3 border border-gray-200 rounded-md mb-2">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormKit
                    type="text"
                    name="namaEKP2"
                    label="Nama EKP (Kaunter 3)"
                    v-model="formData.agihanKaunter[2].namaEKP"
                    :disabled="isCompleted"
                  />

                  <FormKit
                    type="number"
                    name="jumlahAgihan2"
                    label="Jumlah Agihan (RM)"
                    validation="min:0"
                    :validation-messages="{
                      min: 'Jumlah tidak boleh negatif',
                    }"
                    v-model="formData.agihanKaunter[2].jumlahAgihan"
                    :disabled="isCompleted"
                  />
                </div>
              </div>

              <div class="md:col-span-2">
                <div class="mt-4 p-3 bg-blue-50 rounded-md">
                  <p class="font-medium">Jumlah Agihan: RM {{ totalAgihan }}</p>
                  <p class="font-medium" :class="{ 'text-red-600': isNegativeBalance }">
                    Baki Selepas Agihan: RM {{ remainingBalance }}
                  </p>
                  <p v-if="isNegativeBalance" class="text-sm text-red-600 mt-1">
                    Amaran: Jumlah agihan melebihi jumlah pembukaan tunai!
                  </p>
                </div>
              </div>

              <div class="md:col-span-2">
                <FormKit
                  type="textarea"
                  name="catatan"
                  label="Catatan"
                  placeholder="Sila masukkan catatan atau nota tambahan (jika ada)"
                  :disabled="isCompleted"
                />
              </div>
            </div>

            <div class="mt-6 flex justify-end gap-4">
              <div>
                <rs-button
                  variant="primary-outline"
                  v-if="!isCompleted"
                  @click="navigateBack"
                >
                  Kembali
                </rs-button>
              </div>

              <div>
                <rs-button
                  v-if="!isCompleted"
                  variant="primary"
                  class="ml-auto"
                  @click="validateAndShowConfirmation"
                  :disabled="isNegativeBalance"
                >
                  Sahkan
                </rs-button>
              </div>
            </div>
          </FormKit>
        </div>
      </template>
    </rs-card>

    <!-- Confirmation Modal -->
    <rs-modal
      title="Sahkan Opening & Agihan Tunai"
      v-model="showConfirmationModal"
      ok-title="Sahkan"
      cancel-title="Batal"
      position="center"
    >
      <template #body>
        <p class="mb-4">
          Adakah anda pasti untuk mengesahkan rekod opening dan agihan tunai ini?
        </p>
        <div class="bg-gray-50 p-4 rounded-lg">
          <p class="font-medium">
            Jumlah Pembukaan Tunai: RM
            {{ formData.jumlahPembukaanTunai || "0.00" }}
          </p>
          <p class="font-medium">Jumlah Agihan: RM {{ totalAgihan }}</p>
          <p class="font-medium">Baki Selepas Agihan: RM {{ remainingBalance }}</p>
          <p class="text-sm text-gray-600 mt-2">
            Pastikan jumlah yang direkodkan adalah tepat sebelum mengesahkan.
          </p>
        </div>
      </template>

      <template #footer>
        <rs-button
          @click="showConfirmationModal = false"
          :disabled="processing"
          variant="primary-outline"
        >
          Tutup
        </rs-button>

        <rs-button @click="handleConfirm()" :disabled="processing">
          <span v-if="processing">
            <Icon name="eos-icons:loading" class="ml-1" size="1rem" />
          </span>
          <span v-else> Sah & Rekod </span>
        </rs-button>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

definePageMeta({
  title: "Opening & Agihan Tunai ke Kaunter",
});

const route = useRoute();
const router = useRouter();
const isCompleted = ref(false);
const processing = ref(false);
const showConfirmationModal = ref(false);
const breadcrumb = ref([
  {
    name: "Pengurusan Tunai",
    type: "link",
    path: `/BF-PTPC/MT/TK/01`,
  },
  {
    name: "Tunai Kaunter",
    type: "link",
    path: `/BF-PTPC/MT/TK/01`,
  },
  {
    name: "Opening & Agihan Tunai ke Kaunter",
    type: "current",
    path: "/BF-PTPC/MT/TK/01",
  },
]);

const tunaiDetails = ref({
  bakiTabung: "50,000.00",
  rujukan: "OPK-" + new Date().toISOString().slice(0, 10).replace(/-/g, ""),
});

const currentUserName = ref("Ahmad bin Hassan");
const currentDate = computed(() => {
  return new Date().toISOString().slice(0, 10);
});
const currentTime = computed(() => {
  return new Date().toTimeString().slice(0, 5);
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
  tarikhPembukaan: currentDate.value,
  masaRekod: currentTime.value,
  namaPKP: currentUserName.value,
  jumlahPembukaanTunai: null,
  agihanKaunter: [
    { namaEKP: "", jumlahAgihan: null },
    { namaEKP: "", jumlahAgihan: null },
    { namaEKP: "", jumlahAgihan: null },
  ],
  catatan: "",
});

const totalAgihan = computed(() => {
  return formData.value.agihanKaunter
    .reduce((sum, kaunter) => {
      return sum + (parseFloat(kaunter.jumlahAgihan) || 0);
    }, 0)
    .toFixed(2);
});

const remainingBalance = computed(() => {
  const pembukaan = parseFloat(formData.value.jumlahPembukaanTunai) || 0;
  const agihan = parseFloat(totalAgihan.value) || 0;
  return (pembukaan - agihan).toFixed(2);
});

const isNegativeBalance = computed(() => {
  return parseFloat(remainingBalance.value) < 0;
});

const navigateBack = () => {
  router.back();
};

const validateAndShowConfirmation = () => {
  if (isNegativeBalance.value) {
    return;
  }
  showConfirmationModal.value = true;
};

const handleConfirm = async () => {
  processing.value = true;

  // Simulate API call to save the data
  setTimeout(async () => {
    processing.value = false;
    showConfirmationModal.value = false;
    isCompleted.value = true;

    // Show success message for 2 seconds, then redirect
    router.push(`/BF-PTPC/MT/TK/02`);
  }, 1500);
};

const handleSubmit = (data) => {
  // Handle form submission
  console.log("Form submitted:", data);
  validateAndShowConfirmation();
};
</script>
