<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Kira Tunai & Sahkan Jumlah Closing mengikut Kaunter (EKP)
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
            <Icon name="mdi:check-circle" class="text-green-500" size="1.5rem" />
            <p class="text-green-600 font-medium">
              Pengesahan closing kaunter berjaya direkodkan
            </p>
          </div>
        </div>

        <!-- Form Section - Always shown -->
        <div class="mb-6">
          <h3 class="text-lg font-medium mb-2">Maklumat Closing Kaunter</h3>
          <FormKit type="form" :actions="false" @submit="handleSubmit">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit
                type="text"
                name="namaKaunter"
                label="Nama Kaunter/ID Kaunter"
                :disabled="true"
                :value="counterDetails.idKaunter"
              />

              <FormKit
                type="date"
                name="tarikhClosing"
                label="Tarikh Closing"
                :disabled="true"
                :value="currentDate"
              />

              <FormKit
                type="time"
                name="masaClosing"
                label="Masa Closing"
                :disabled="true"
                :value="currentTime"
              />

              <FormKit
                type="text"
                name="namaEKP"
                label="Nama EKP"
                :disabled="true"
                :value="currentUserName"
              />

              <FormKit
                type="text"
                name="jumlahTunaiDiterima"
                label="Jumlah Tunai Diterima (RM)"
                :disabled="true"
                :value="formatCurrency(counterDetails.jumlahDiterima)"
              />

              <FormKit
                type="text"
                name="jumlahDiagih"
                label="Jumlah Telah Diagih (RM)"
                :disabled="true"
                :value="formatCurrency(counterDetails.jumlahDiagih)"
              />

              <FormKit
                type="number"
                name="jumlahBaki"
                label="Jumlah Baki di Kaunter (RM)"
                validation="required|min:0"
                :validation-messages="{
                  required: 'Jumlah baki di kaunter adalah wajib',
                  min: 'Jumlah tidak boleh negatif',
                }"
                :disabled="isCompleted"
                v-model="formData.jumlahBaki"
              />

              <div class="md:col-span-2">
                <h4 class="text-base font-medium mb-2 mt-2">Status Pengesahan</h4>
                <div class="flex items-center p-3 bg-blue-50 rounded-md mb-4">
                  <div class="mr-4">
                    <Icon name="mdi:cash-check" class="text-blue-600" size="1.5rem" />
                  </div>
                  <div>
                    <p class="text-sm text-gray-600">Baki Sepatutnya</p>
                    <p class="font-medium">RM {{ formatCurrency(expectedBalance) }}</p>
                  </div>
                  <div class="mx-4 text-gray-400">
                    <Icon name="mdi:arrow-right" size="1.5rem" />
                  </div>
                  <div>
                    <p class="text-sm text-gray-600">Baki Dikira</p>
                    <p class="font-medium">
                      RM
                      {{
                        formData.jumlahBaki ? formatCurrency(formData.jumlahBaki) : "0.00"
                      }}
                    </p>
                  </div>
                  <div class="ml-4">
                    <p
                      class="font-medium rounded-full px-3 py-1 text-sm"
                      :class="{
                        'bg-green-100 text-green-800': isBalanceMatching,
                        'bg-red-100 text-red-800':
                          !isBalanceMatching && formData.jumlahBaki,
                      }"
                    >
                      {{
                        formData.jumlahBaki
                          ? isBalanceMatching
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
                  placeholder="Sila masukkan catatan atau nota tambahan (jika ada ketidakpadanan, sila nyatakan sebab)"
                  :disabled="isCompleted"
                  v-model="formData.catatan"
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
                  :disabled="!formData.jumlahBaki"
                >
                  Sahkan Closing
                </rs-button>
              </div>
            </div>
          </FormKit>
        </div>
      </template>
    </rs-card>

    <!-- Confirmation Modal -->
    <rs-modal
      title="Pengesahan Closing Kaunter"
      v-model="showConfirmationModal"
      ok-title="Sahkan"
      cancel-title="Batal"
      position="center"
    >
      <template #body>
        <p class="mb-4">Adakah anda pasti untuk mengesahkan closing kaunter ini?</p>
        <div class="bg-gray-50 p-4 rounded-lg">
          <p class="font-medium">Nama Kaunter: {{ counterDetails.idKaunter }}</p>
          <p class="font-medium">
            Baki Sepatutnya: RM {{ formatCurrency(expectedBalance) }}
          </p>
          <p class="font-medium">
            Baki Dikira: RM
            {{ formData.jumlahBaki ? formatCurrency(formData.jumlahBaki) : "0.00" }}
          </p>
          <p class="font-medium" :class="{ 'text-red-600': !isBalanceMatching }">
            Status: {{ isBalanceMatching ? "Padan" : "Tidak Padan" }}
          </p>
          <p v-if="!isBalanceMatching" class="text-sm text-red-600 mt-2">
            Amaran: Jumlah baki dikira tidak sama dengan baki sepatutnya!
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
          <span v-else> Sahkan Closing </span>
        </rs-button>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

definePageMeta({
  title: "Kira Tunai & Sahkan Jumlah Closing mengikut Kaunter",
});

const route = useRoute();
const router = useRouter();
const isCompleted = ref(false);
const processing = ref(false);
const showConfirmationModal = ref(false);
const breadcrumb = ref([
  {
    name: "Kira Tunai & Sahkan Jumlah Closing mengikut Kaunter (EKP)",
    type: "current",
    path: "/BF-PTPC/MT/TK/03",
  },
]);

const counterDetails = ref({
  idKaunter: "KTR-001",
  jumlahDiterima: 5000.0,
  jumlahDiagih: 3750.0,
  rujukan: "CLS-" + new Date().toISOString().slice(0, 10).replace(/-/g, ""),
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

const expectedBalance = computed(() => {
  return counterDetails.value.jumlahDiterima - counterDetails.value.jumlahDiagih;
});

const formData = ref({
  namaKaunter: counterDetails.value.idKaunter,
  tarikhClosing: currentDate.value,
  masaClosing: currentTime.value,
  jumlahBaki: null,
  catatan: "",
});

const isBalanceMatching = computed(() => {
  if (!formData.value.jumlahBaki) return false;

  const expectedAmount = expectedBalance.value;
  const countedAmount = parseFloat(formData.value.jumlahBaki) || 0;

  return Math.abs(expectedAmount - countedAmount) < 0.01; // Account for floating point issues
});

const navigateBack = () => {
  router.back();
};

const formatCurrency = (value) => {
  return parseFloat(value)
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const validateAndShowConfirmation = () => {
  if (!formData.value.jumlahBaki) {
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

    router.push("/BF-PTPC/MT/TK/04");
  }, 1500);
};

const handleSubmit = (data) => {
  // Handle form submission
  console.log("Form submitted:", data);
  validateAndShowConfirmation();
};
</script>
