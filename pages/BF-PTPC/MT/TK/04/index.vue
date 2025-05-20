<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Pengesahan Closing Kaunter oleh PKP
          </h2>
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
              <p class="text-sm text-gray-600">Nama & ID Cawangan</p>
              <p class="font-medium">
                {{ branchDetails.namaCawangan }} ({{
                  branchDetails.idCawangan
                }})
              </p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Rujukan</p>
              <p class="font-medium">{{ branchDetails.rujukan }}</p>
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
              Pengesahan closing kaunter berjaya direkodkan
            </p>
          </div>
        </div>

        <!-- Counter List Section -->
        <div class="mb-6">
          <h3 class="text-lg font-medium mb-4">
            Senarai Kaunter & Status Closing
          </h3>

          <div class="overflow-x-auto">
            <table class="min-w-full bg-white border border-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    class="px-4 py-2 text-left text-sm font-medium text-gray-500"
                  >
                    ID Kaunter
                  </th>
                  <th
                    class="px-4 py-2 text-left text-sm font-medium text-gray-500"
                  >
                    Nama EKP
                  </th>
                  <th
                    class="px-4 py-2 text-left text-sm font-medium text-gray-500"
                  >
                    Jumlah Diterima (RM)
                  </th>
                  <th
                    class="px-4 py-2 text-left text-sm font-medium text-gray-500"
                  >
                    Jumlah Diagih (RM)
                  </th>
                  <th
                    class="px-4 py-2 text-left text-sm font-medium text-gray-500"
                  >
                    Baki Sepatutnya (RM)
                  </th>
                  <th
                    class="px-4 py-2 text-left text-sm font-medium text-gray-500"
                  >
                    Baki Dikira (RM)
                  </th>
                  <th
                    class="px-4 py-2 text-left text-sm font-medium text-gray-500"
                  >
                    Status
                  </th>
                  <th
                    class="px-4 py-2 text-left text-sm font-medium text-gray-500"
                  >
                    Tindakan
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="counter in counters"
                  :key="counter.idKaunter"
                  :class="{
                    'bg-blue-50':
                      selectedCounter &&
                      selectedCounter.idKaunter === counter.idKaunter,
                  }"
                >
                  <td class="border px-4 py-2">{{ counter.idKaunter }}</td>
                  <td class="border px-4 py-2">{{ counter.namaEKP }}</td>
                  <td class="border px-4 py-2">
                    RM {{ formatCurrency(counter.jumlahDiterima) }}
                  </td>
                  <td class="border px-4 py-2">
                    RM {{ formatCurrency(counter.jumlahDiagih) }}
                  </td>
                  <td class="border px-4 py-2">
                    RM {{ formatCurrency(counter.expectedBalance) }}
                  </td>
                  <td class="border px-4 py-2">
                    RM {{ formatCurrency(counter.jumlahBaki) }}
                  </td>
                  <td class="border px-4 py-2">
                    <span
                      class="font-medium rounded-full px-3 py-1 text-sm"
                      :class="{
                        'bg-green-100 text-green-800':
                          counter.status === 'Padan',
                        'bg-red-100 text-red-800':
                          counter.status === 'Tidak Padan',
                        'bg-yellow-100 text-yellow-800':
                          counter.status === 'Belum Disahkan',
                      }"
                    >
                      {{ counter.status }}
                    </span>
                  </td>
                  <td class="border px-4 py-2">
                    <rs-button
                      v-if="
                        !counter.closingDisahkan &&
                        counter.status !== 'Belum Disahkan'
                      "
                      variant="primary"
                      size="sm"
                      @click="selectCounter(counter)"
                    >
                      Semak
                    </rs-button>
                    <span
                      v-else-if="counter.closingDisahkan"
                      class="text-green-600 font-medium text-sm"
                      >Disahkan</span
                    >
                    <span v-else class="text-gray-400 text-sm"
                      >Menunggu EKP</span
                    >
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Branch Summary Section -->
        <div class="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 class="text-lg font-medium mb-4">Ringkasan Cawangan</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p class="text-sm text-gray-600">Jumlah Agihan Harian</p>
              <p class="font-medium">
                RM {{ formatCurrency(branchSummary.jumlahAgihan) }}
              </p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Baki Tunai Seluruh Tabung</p>
              <p class="font-medium">
                RM {{ formatCurrency(branchSummary.bakiTunai) }}
              </p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Status Closing</p>
              <p
                class="font-medium"
                :class="{
                  'text-green-600': branchSummary.statusClosing === 'Lengkap',
                  'text-yellow-600':
                    branchSummary.statusClosing === 'Dalam Proses',
                  'text-red-600': branchSummary.statusClosing === 'Tertangguh',
                }"
              >
                {{ branchSummary.statusClosing }}
              </p>
            </div>
          </div>
        </div>

        <!-- Selected Counter Verification Form - Only visible when a counter is selected -->
        <div v-if="selectedCounter" class="mb-6 border p-4 rounded-lg">
          <h3 class="text-lg font-medium mb-4">
            Pengesahan Closing Kaunter: {{ selectedCounter.idKaunter }}
          </h3>

          <FormKit type="form" :actions="false" @submit="handleSubmit">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-gray-600">Nama EKP</p>
                <p class="font-medium">{{ selectedCounter.namaEKP }}</p>
              </div>

              <div>
                <p class="text-sm text-gray-600">Status Padanan</p>
                <p
                  class="font-medium"
                  :class="{
                    'text-green-600': selectedCounter.status === 'Padan',
                    'text-red-600': selectedCounter.status === 'Tidak Padan',
                  }"
                >
                  {{ selectedCounter.status }}
                </p>
              </div>

              <div>
                <p class="text-sm text-gray-600">Baki Sepatutnya (RM)</p>
                <p class="font-medium">
                  {{ formatCurrency(selectedCounter.expectedBalance) }}
                </p>
              </div>

              <div>
                <p class="text-sm text-gray-600">Baki Dikira (RM)</p>
                <p class="font-medium">
                  {{ formatCurrency(selectedCounter.jumlahBaki) }}
                </p>
              </div>

              <div>
                <p class="text-sm text-gray-600">Perbezaan (RM)</p>
                <p
                  class="font-medium"
                  :class="{ 'text-red-600': selectedCounter.difference !== 0 }"
                >
                  {{ formatCurrency(selectedCounter.difference) }}
                </p>
              </div>

              <div class="md:col-span-2">
                <FormKit
                  type="select"
                  name="statusVerifikasi"
                  label="Status Verifikasi"
                  validation="required"
                  :options="['Disahkan', 'Tertangguh', 'Gagal']"
                  v-model="formData.statusVerifikasi"
                />
              </div>

              <div class="md:col-span-2">
                <FormKit
                  type="textarea"
                  name="catatan"
                  label="Catatan"
                  placeholder="Sila masukkan catatan atau nota tambahan (jika ada ketidakpadanan, sila nyatakan sebab)"
                  v-model="formData.catatan"
                />
              </div>
            </div>

            <div class="mt-6 flex justify-end gap-4">
              <rs-button variant="primary-outline" @click="cancelSelection">
                Batal
              </rs-button>

              <rs-button variant="primary" @click="validateAndShowConfirmation">
                Sahkan Closing
              </rs-button>
            </div>
          </FormKit>
        </div>

        <!-- Form Actions - Only visible when no counter is selected -->
        <div
          v-if="!selectedCounter && !isCompleted"
          class="mt-6 flex justify-end gap-4"
        >
          <rs-button variant="primary-outline" @click="navigateBack">
            Kembali
          </rs-button>

          <rs-button
            variant="primary"
            @click="showFinalConfirmation"
            :disabled="!allCountersVerified"
          >
            Sahkan Semua Closing
          </rs-button>
        </div>

        <!-- Return Button - Only visible after completion -->
        <div v-if="isCompleted" class="mt-6 flex justify-end">
          <rs-button variant="primary" @click="navigateToNext">
            Kembali ke Dashboard
          </rs-button>
        </div>
      </template>
    </rs-card>

    <!-- Counter Confirmation Modal -->
    <rs-modal
      title="Pengesahan Closing Kaunter"
      v-model="showConfirmationModal"
      ok-title="Sahkan"
      cancel-title="Batal"
      position="center"
    >
      <template #body>
        <p class="mb-4">
          Adakah anda pasti untuk mengesahkan closing kaunter ini?
        </p>
        <div class="bg-gray-50 p-4 rounded-lg">
          <p class="font-medium">
            Nama Kaunter: {{ selectedCounter?.idKaunter }}
          </p>
          <p class="font-medium">Nama EKP: {{ selectedCounter?.namaEKP }}</p>
          <p class="font-medium">
            Baki Sepatutnya: RM
            {{
              selectedCounter
                ? formatCurrency(selectedCounter.expectedBalance)
                : "0.00"
            }}
          </p>
          <p class="font-medium">
            Baki Dikira: RM
            {{
              selectedCounter
                ? formatCurrency(selectedCounter.jumlahBaki)
                : "0.00"
            }}
          </p>
          <p
            class="font-medium"
            :class="{
              'text-red-600':
                selectedCounter && selectedCounter.status === 'Tidak Padan',
            }"
          >
            Status: {{ selectedCounter?.status }}
          </p>
          <p class="font-medium">
            Verifikasi PKP: {{ formData.statusVerifikasi }}
          </p>
          <p
            v-if="selectedCounter && selectedCounter.status === 'Tidak Padan'"
            class="text-sm text-red-600 mt-2"
          >
            Amaran: Jumlah baki dikira tidak sama dengan baki sepatutnya!
          </p>
          <p class="text-sm text-gray-600 mt-2">
            Pastikan status verifikasi yang dipilih adalah tepat sebelum
            mengesahkan.
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

        <rs-button @click="handleConfirmCounter()" :disabled="processing">
          <span v-if="processing">
            <Icon name="eos-icons:loading" class="ml-1" size="1rem" />
          </span>
          <span v-else> Sahkan Closing </span>
        </rs-button>
      </template>
    </rs-modal>

    <!-- Final Confirmation Modal -->
    <rs-modal
      title="Pengesahan Closing Semua Kaunter"
      v-model="showFinalConfirmationModal"
      ok-title="Sahkan"
      cancel-title="Batal"
      position="center"
    >
      <template #body>
        <p class="mb-4">
          Adakah anda pasti untuk mengesahkan closing semua kaunter?
        </p>
        <div class="bg-gray-50 p-4 rounded-lg">
          <p class="font-medium">Cawangan: {{ branchDetails.namaCawangan }}</p>
          <p class="font-medium">Jumlah Kaunter: {{ counters.length }}</p>
          <p class="font-medium">Kaunter Disahkan: {{ verifiedCounters }}</p>
          <p class="font-medium">
            Jumlah Agihan Harian: RM
            {{ formatCurrency(branchSummary.jumlahAgihan) }}
          </p>
          <p class="font-medium">
            Baki Tunai Seluruh Tabung: RM
            {{ formatCurrency(branchSummary.bakiTunai) }}
          </p>
          <p class="text-sm text-gray-600 mt-2">
            Tindakan ini akan menyelesaikan proses closing untuk hari ini dan
            merekodkan log untuk tujuan audit.
          </p>
        </div>
      </template>

      <template #footer>
        <rs-button
          @click="showFinalConfirmationModal = false"
          :disabled="processing"
          variant="primary-outline"
        >
          Tutup
        </rs-button>

        <rs-button @click="handleFinalConfirm()" :disabled="processing">
          <span v-if="processing">
            <Icon name="eos-icons:loading" class="ml-1" size="1rem" />
          </span>
          <span v-else> Sahkan Semua Closing </span>
        </rs-button>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

definePageMeta({
  title: "Pengesahan Closing Kaunter oleh PKP",
});

const route = useRoute();
const router = useRouter();
const isCompleted = ref(false);
const processing = ref(false);
const showConfirmationModal = ref(false);
const showFinalConfirmationModal = ref(false);
const selectedCounter = ref(null);

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
    name: "Pengesahan Closing Kaunter oleh PKP",
    type: "current",
    path: "/BF-PTPC/MT/TK/04",
  },
]);

const branchDetails = ref({
  namaCawangan: "Cawangan Putrajaya",
  idCawangan: "CPJY-001",
  rujukan: "CLS-" + new Date().toISOString().slice(0, 10).replace(/-/g, ""),
});

const currentUserName = ref("Ahmad bin Ismail");
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

// Sample counter data
const counters = ref([
  {
    idKaunter: "KTR-001",
    namaEKP: "Sarah binti Omar",
    jumlahDiterima: 5000.0,
    jumlahDiagih: 3750.0,
    expectedBalance: 1250.0,
    jumlahBaki: 1250.0,
    difference: 0,
    status: "Padan",
    closingDisahkan: false,
    catatan: "",
  },
  {
    idKaunter: "KTR-002",
    namaEKP: "Ali bin Hassan",
    jumlahDiterima: 4500.0,
    jumlahDiagih: 3200.0,
    expectedBalance: 1300.0,
    jumlahBaki: 1280.0,
    difference: -20.0,
    status: "Tidak Padan",
    closingDisahkan: false,
    catatan: "",
  },
  {
    idKaunter: "KTR-003",
    namaEKP: "Nurul binti Aziz",
    jumlahDiterima: 6000.0,
    jumlahDiagih: 4800.0,
    expectedBalance: 1200.0,
    jumlahBaki: 1200.0,
    difference: 0,
    status: "Padan",
    closingDisahkan: false,
    catatan: "",
  },
  {
    idKaunter: "KTR-004",
    namaEKP: "Zulkifli bin Rahman",
    jumlahDiterima: 3800.0,
    jumlahDiagih: 2500.0,
    expectedBalance: 1300.0,
    jumlahBaki: null,
    difference: null,
    status: "Belum Disahkan",
    closingDisahkan: false,
    catatan: "",
  },
]);

// Branch summary data
const branchSummary = computed(() => {
  const totalAgihan = counters.value.reduce(
    (sum, counter) => sum + counter.jumlahDiagih,
    0
  );
  const totalBaki = counters.value.reduce((sum, counter) => {
    return sum + (counter.jumlahBaki || 0);
  }, 0);

  let status = "Dalam Proses";
  if (allCountersVerified.value) {
    status = "Lengkap";
  } else if (verifiedCounters.value === 0) {
    status = "Tertangguh";
  }

  return {
    jumlahAgihan: totalAgihan,
    bakiTunai: totalBaki,
    statusClosing: status,
  };
});

const formData = ref({
  statusVerifikasi: "Disahkan",
  catatan: "",
});

const verifiedCounters = computed(() => {
  return counters.value.filter((counter) => counter.closingDisahkan).length;
});

const allCountersVerified = computed(() => {
  const pendingCounters = counters.value.filter(
    (counter) => counter.status !== "Belum Disahkan" && !counter.closingDisahkan
  );
  return pendingCounters.length === 0;
});

const navigateBack = () => {
  router.back();
};

const navigateToNext = () => {
  router.push("/dashboard");
};

const formatCurrency = (value) => {
  if (value === null || value === undefined) return "0.00";
  return parseFloat(value)
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const selectCounter = (counter) => {
  selectedCounter.value = counter;
  formData.value.statusVerifikasi =
    counter.status === "Padan" ? "Disahkan" : "Tertangguh";
  formData.value.catatan = counter.catatan || "";
};

const cancelSelection = () => {
  selectedCounter.value = null;
  formData.value.statusVerifikasi = "Disahkan";
  formData.value.catatan = "";
};

const validateAndShowConfirmation = () => {
  if (!formData.value.statusVerifikasi) {
    return;
  }
  showConfirmationModal.value = true;
};

const showFinalConfirmation = () => {
  showFinalConfirmationModal.value = true;
};

const handleConfirmCounter = async () => {
  processing.value = true;

  // Simulate API call to save the data
  setTimeout(() => {
    // Update the counter's verification status
    const counterIndex = counters.value.findIndex(
      (c) => c.idKaunter === selectedCounter.value.idKaunter
    );
    if (counterIndex !== -1) {
      counters.value[counterIndex].closingDisahkan = true;
      counters.value[counterIndex].catatan = formData.value.catatan;
    }

    processing.value = false;
    showConfirmationModal.value = false;
    selectedCounter.value = null;
    formData.value.statusVerifikasi = "Disahkan";
    formData.value.catatan = "";
  }, 1500);
};

const handleFinalConfirm = async () => {
  processing.value = true;

  // Simulate API call to finalize all counter closings
  setTimeout(() => {
    processing.value = false;
    showFinalConfirmationModal.value = false;
    isCompleted.value = true;

    router.push("/BF-PTPC/MT/TK/01");
  }, 1500);
};

const handleSubmit = (data) => {
  // Handle form submission
  console.log("Form submitted:", data);
  validateAndShowConfirmation();
};
</script>
