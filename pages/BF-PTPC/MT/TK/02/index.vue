<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Terima & Sahkan Tunai di Kaunter (EKP)
          </h2>
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
              <p class="text-sm text-gray-600">ID Kaunter</p>
              <p class="font-medium">{{ counterDetails.idKaunter }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Rujukan</p>
              <p class="font-medium">{{ counterDetails.rujukan }}</p>
            </div>
          </div>
        </div>

        <!-- Success Message - Only shown after completion -->
        <div v-if="isCompleted" class="mb-6">
          <div class="flex items-center gap-2 mb-4">
            <Icon
              name="mdi:check-circle"
              class="text-green-500"
              size="1.5rem"
            />
            <p class="text-green-600 font-medium">
              Penerimaan tunai di kaunter berjaya disahkan dan direkodkan
            </p>
          </div>
        </div>

        <!-- Form Section - Always shown -->
        <div class="mb-6">
          <h3 class="text-lg font-medium mb-2">Maklumat Pengesahan Kaunter</h3>
          <FormKit type="form" :actions="false" @submit="handleSubmit">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit
                type="text"
                name="namaKaunter"
                label="Nama Kaunter/ID Kaunter"
                validation="required"
                :validation-messages="{
                  required: 'Nama/ID kaunter adalah wajib',
                }"
                :disabled="isCompleted"
                :value="counterDetails.idKaunter"
              />

              <FormKit
                type="date"
                name="tarikhPenerimaan"
                label="Tarikh Penerimaan"
                validation="required"
                :validation-messages="{
                  required: 'Tarikh penerimaan adalah wajib',
                }"
                :disabled="isCompleted"
                :value="currentDate"
              />

              <FormKit
                type="time"
                name="masaPenerimaan"
                label="Masa Penerimaan"
                :disabled="isCompleted"
                :value="currentTime"
              />

              <FormKit
                type="number"
                name="jumlahTunaiDiterima"
                label="Jumlah Tunai Diterima (RM)"
                validation="required|min:0"
                :validation-messages="{
                  required: 'Jumlah tunai diterima adalah wajib',
                  min: 'Jumlah tidak boleh negatif',
                }"
                :disabled="isCompleted"
                v-model="formData.jumlahTunaiDiterima"
              />

              <FormKit
                type="text"
                name="pegawaiMenyerah"
                label="Pegawai Menyerah (PKP)"
                validation="required"
                :validation-messages="{
                  required: 'Nama pegawai menyerah adalah wajib',
                }"
                :disabled="isCompleted"
                v-model="formData.pegawaiMenyerah"
              />

              <FormKit
                type="text"
                name="pegawaiMenerima"
                label="Pegawai Menerima (EKP)"
                validation="required"
                :validation-messages="{
                  required: 'Nama pegawai menerima adalah wajib',
                }"
                :disabled="isCompleted"
                :value="currentUserName"
              />

              <div class="md:col-span-2">
                <h4 class="text-base font-medium mb-2 mt-2">
                  Status Pengesahan
                </h4>
                <div class="flex items-center p-3 bg-blue-50 rounded-md mb-4">
                  <div class="mr-4">
                    <Icon
                      name="mdi:cash-check"
                      class="text-blue-600"
                      size="1.5rem"
                    />
                  </div>
                  <div>
                    <p class="text-sm text-gray-600">
                      Jumlah Sepatutnya (Dari Agihan)
                    </p>
                    <p class="font-medium">
                      RM {{ counterDetails.jumlahAgihan }}
                    </p>
                  </div>
                  <div class="mx-4 text-gray-400">
                    <Icon name="mdi:arrow-right" size="1.5rem" />
                  </div>
                  <div>
                    <p class="text-sm text-gray-600">Jumlah Diterima</p>
                    <p class="font-medium">
                      RM {{ formData.jumlahTunaiDiterima || "0.00" }}
                    </p>
                  </div>
                  <div class="ml-4">
                    <p
                      class="font-medium rounded-full px-3 py-1 text-sm"
                      :class="{
                        'bg-green-100 text-green-800': isCashMatching,
                        'bg-red-100 text-red-800':
                          !isCashMatching && formData.jumlahTunaiDiterima,
                      }"
                    >
                      {{
                        formData.jumlahTunaiDiterima
                          ? isCashMatching
                            ? "Padan"
                            : "Tidak Padan"
                          : "Sila Masukkan Jumlah"
                      }}
                    </p>
                  </div>
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
                  :disabled="!formData.jumlahTunaiDiterima"
                >
                  Terima & Sah
                </rs-button>
              </div>
            </div>
          </FormKit>
        </div>
      </template>
    </rs-card>

    <!-- Confirmation Modal -->
    <rs-modal
      title="Pengesahan Penerimaan Tunai"
      v-model="showConfirmationModal"
      ok-title="Sahkan"
      cancel-title="Batal"
      position="center"
    >
      <template #body>
        <p class="mb-4">
          Adakah anda pasti untuk mengesahkan penerimaan tunai ini?
        </p>
        <div class="bg-gray-50 p-4 rounded-lg">
          <p class="font-medium">
            Nama Kaunter: {{ counterDetails.idKaunter }}
          </p>
          <p class="font-medium">
            Jumlah Sepatutnya: RM {{ counterDetails.jumlahAgihan }}
          </p>
          <p class="font-medium">
            Jumlah Diterima: RM {{ formData.jumlahTunaiDiterima || "0.00" }}
          </p>
          <p class="font-medium" :class="{ 'text-red-600': !isCashMatching }">
            Status: {{ isCashMatching ? "Padan" : "Tidak Padan" }}
          </p>
          <p v-if="!isCashMatching" class="text-sm text-red-600 mt-2">
            Amaran: Jumlah diterima tidak sama dengan jumlah agihan asal!
          </p>
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
          <span v-else> Terima & Sah </span>
        </rs-button>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

definePageMeta({
  title: "Terima & Sahkan Tunai di Kaunter",
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
    name: "Terima & Sahkan Tunai di Kaunter (EKP)",
    type: "current",
    path: "/BF-PTPC/MT/TK/02",
  },
]);

const counterDetails = ref({
  idKaunter: "KTR-001",
  jumlahAgihan: "5,000.00",
  rujukan: "TCK-" + new Date().toISOString().slice(0, 10).replace(/-/g, ""),
});

const currentUserName = ref("Sarah binti Omar");
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
  namaKaunter: counterDetails.value.idKaunter,
  tarikhPenerimaan: currentDate.value,
  masaPenerimaan: currentTime.value,
  jumlahTunaiDiterima: null,
  pegawaiMenyerah: "Ahmad bin Hassan",
  pegawaiMenerima: currentUserName.value,
  catatan: "",
});

const isCashMatching = computed(() => {
  if (!formData.value.jumlahTunaiDiterima) return false;

  const expectedAmount =
    parseFloat(counterDetails.value.jumlahAgihan.replace(/,/g, "")) || 0;
  const receivedAmount = parseFloat(formData.value.jumlahTunaiDiterima) || 0;

  return expectedAmount === receivedAmount;
});

const navigateBack = () => {
  router.back();
};

const validateAndShowConfirmation = () => {
  if (!formData.value.jumlahTunaiDiterima) {
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

    router.push("/BF-PTPC/MT/TK/03");
  }, 1500);
};

const handleSubmit = (data) => {
  // Handle form submission
  console.log("Form submitted:", data);
  validateAndShowConfirmation();
};
</script>
