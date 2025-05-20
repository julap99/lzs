<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Sahkan Jumlah & Agih Bantuan (EKP)</h2>
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
              <p class="text-sm text-gray-600">Status Agihan</p>
              <p class="font-medium text-lg" :class="bantuanDetails.statusClass">
                {{ bantuanDetails.status }}
              </p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Rujukan</p>
              <p class="font-medium">{{ bantuanDetails.rujukan }}</p>
            </div>
          </div>
        </div>

        <!-- Success Message - Only shown after completion -->
        <div v-if="isCompleted" class="mb-6">
          <div class="flex items-center gap-2 mb-4">
            <Icon name="mdi:check-circle" class="text-green-500" size="1.5rem" />
            <p class="text-green-600 font-medium">
              Pengagihan bantuan tunai berjaya direkodkan
            </p>
          </div>
        </div>

        <!-- Form Section - Always shown -->
        <div class="mb-6">
          <h3 class="text-lg font-medium mb-2">Maklumat Serahan Tunai</h3>
          <FormKit type="form" :actions="false" @submit="handleSubmit">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- 1. Nama & No Kad Pengenalan (Read-only) -->
              <div class="p-3 bg-gray-50 rounded">
                <p class="text-sm text-gray-600">No. Kad Pengenalan</p>
                <p class="font-medium">
                  {{ formData.noKadPengenalan || "880101015555" }}
                </p>
              </div>

              <div class="p-3 bg-gray-50 rounded">
                <p class="text-sm text-gray-600">Nama Pemohon</p>
                <p class="font-medium">
                  {{ formData.namaPemohon || "Muhammad bin Ibrahim" }}
                </p>
              </div>

              <div class="p-3 bg-gray-50 rounded">
                <p class="text-sm text-gray-600">Jenis Bantuan</p>
                <p class="font-medium">
                  {{
                    getJenisBantuanLabel(formData.jenisBantuan) ||
                    "Bantuan Kewangan Bulanan"
                  }}
                </p>
              </div>

              <div class="p-3 bg-gray-50 rounded">
                <p class="text-sm text-gray-600">Jumlah Diluluskan (RM)</p>
                <p class="font-medium">
                  {{ formData.jumlahDiluluskan || "500.00" }}
                </p>
              </div>

              <!-- 2. Jumlah Tunai (Input required) -->
              <FormKit
                type="number"
                name="jumlahDigunakan"
                label="Jumlah Akan Diagihkan (RM)"
                validation="required|min:0|max:jumlahDiluluskan"
                :disabled="isCompleted"
                v-model="formData.jumlahDigunakan"
                :validation-messages="{
                  required: 'Jumlah diagihkan adalah wajib',
                  min: 'Jumlah tidak boleh negatif',
                  max: 'Jumlah melebihi amaun diluluskan',
                }"
              />

              <!-- 3. Tarikh & Masa Serahan (Input required) -->
              <FormKit
                type="date"
                name="tarikhAgihan"
                label="Tarikh Agihan"
                validation="required"
                :validation-messages="{
                  required: 'Tarikh agihan adalah wajib',
                }"
                :disabled="isCompleted"
                :value="currentDate"
              />

              <FormKit
                type="time"
                name="masaAgihan"
                label="Masa Agihan"
                :disabled="isCompleted"
                :value="currentTime"
              />

              <!-- 4. Status (Input required) -->
              <FormKit
                type="select"
                name="statusSerahan"
                label="Status Serahan"
                :options="[
                  { label: 'Sila Pilih', value: '' },
                  { label: 'Selesai', value: 'selesai' },
                  { label: 'Tertunda', value: 'tertunda' },
                  { label: 'Dibatalkan', value: 'dibatalkan' },
                ]"
                validation="required"
                :validation-messages="{
                  required: 'Status serahan adalah wajib',
                }"
                :disabled="isCompleted"
              />

              <div class="md:col-span-2">
                <h4 class="text-base font-medium mb-2 mt-2">Bukti Penerimaan</h4>
              </div>

              <div class="md:col-span-2">
                <FormKit
                  type="checkbox"
                  name="pengesahanIdentiti"
                  label="Pengesahan identiti telah dilakukan dengan kad pengenalan"
                  :disabled="isCompleted"
                />
              </div>

              <div class="md:col-span-2">
                <FormKit
                  type="checkbox"
                  name="pengesahanJumlah"
                  label="Jumlah wang tunai telah disemak dan disahkan"
                  :disabled="isCompleted"
                />
              </div>

              <div class="md:col-span-2">
                <FormKit
                  type="file"
                  name="dokumenPengesahan"
                  label="Muat Naik Bukti Penerimaan (Tandatangan)"
                  accept="image/*,.pdf"
                  help="Sila muat naik imej tandatangan atau dokumen bukti penerimaan"
                  :disabled="isCompleted"
                />
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
                >
                  Sahkan Agihan
                </rs-button>
              </div>
            </div>
          </FormKit>
        </div>
      </template>
    </rs-card>

    <!-- Confirmation Modal -->
    <rs-modal
      title="Sahkan Pengagihan Bantuan Tunai"
      v-model="showConfirmationModal"
      ok-title="Sahkan"
      cancel-title="Batal"
      position="center"
    >
      <template #body>
        <p class="mb-4">
          Adakah anda pasti untuk mengesahkan pengagihan bantuan tunai ini?
        </p>
        <div class="bg-gray-50 p-4 rounded-lg">
          <p class="font-medium">Nama Pemohon: {{ formData.namaPemohon }}</p>
          <p class="font-medium">No. Kad Pengenalan: {{ formData.noKadPengenalan }}</p>
          <p class="font-medium">
            Jenis Bantuan: {{ getJenisBantuanLabel(formData.jenisBantuan) }}
          </p>
          <p class="font-medium">
            Jumlah Diluluskan: RM {{ formData.jumlahDiluluskan || "0.00" }}
          </p>
          <p class="font-medium">
            Jumlah Diagihkan: RM {{ formData.jumlahDigunakan || "0.00" }}
          </p>
          <p class="text-sm text-gray-600 mt-2">
            Pastikan butiran penerima dan jumlah yang diagihkan adalah tepat sebelum
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
  title: "Sahkan Jumlah & Agih Bantuan",
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
    path: `/BF-PTPC/MT/TT/01`,
  },
  {
    name: "Agih Tunai Kaunter",
    type: "link",
    path: `/BF-PTPC/MT/TT/01`,
  },
  {
    name: "Sahkan Jumlah & Agih Bantuan (EKP)",
    type: "current",
    path: "/BF-PTPC/MT/TT/03",
  },
]);

const bantuanDetails = ref({
  status: "Belum Diagihkan",
  statusClass: "text-gray-600",
  rujukan: "AGH-" + new Date().toISOString().slice(0, 10).replace(/-/g, ""),
});

const currentUserName = ref("Noor Aisyah binti Abdullah");
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

const jenisbantuanOptions = [
  { label: "Sila Pilih", value: "" },
  { label: "Bantuan Kewangan Bulanan", value: "bulanan" },
  { label: "Bantuan Kecemasan", value: "kecemasan" },
  { label: "Bantuan Perubatan", value: "perubatan" },
  { label: "Bantuan Pendidikan", value: "pendidikan" },
  { label: "Bantuan Bencana", value: "bencana" },
];

const formData = ref({
  noKadPengenalan: "880101015555",
  namaPemohon: "Muhammad bin Ibrahim",
  jenisBantuan: "bulanan",
  jumlahDiluluskan: 500,
  jumlahDigunakan: 500,
  tarikhAgihan: currentDate.value,
  masaAgihan: currentTime.value,
  statusSerahan: "",
  pengesahanIdentiti: false,
  pengesahanJumlah: false,
  catatan: "",
});

const getJenisBantuanLabel = (value) => {
  const option = jenisbantuanOptions.find((opt) => opt.value === value);
  return option ? option.label : value;
};

const navigateBack = () => {
  router.back();
};

const validateAndShowConfirmation = () => {
  console.log(formData.value);

  // Validation checks
  // if (!formData.value.pengesahanIdentiti) {
  //   alert("Sila lakukan pengesahan identiti terlebih dahulu");
  //   return;
  // }

  // if (!formData.value.pengesahanJumlah) {
  //   alert("Sila sahkan jumlah wang tunai terlebih dahulu");
  //   return;
  // }

  // if (!formData.value.statusSerahan) {
  //   alert("Sila pilih status serahan");
  //   return;
  // }

  // if (formData.value.jumlahDigunakan <= 0) {
  //   alert("Jumlah diagihkan mesti lebih daripada sifar");
  //   return;
  // }

  // if (formData.value.jumlahDigunakan > formData.value.jumlahDiluluskan) {
  //   alert("Jumlah diagihkan tidak boleh melebihi jumlah diluluskan");
  //   return;
  // }

  showConfirmationModal.value = true;
};

const handleConfirm = async () => {
  processing.value = true;

  // Simulate API call to save the distribution data
  setTimeout(async () => {
    processing.value = false;
    showConfirmationModal.value = false;
    isCompleted.value = true;
    bantuanDetails.value.status = "Bantuan Diagihkan";
    bantuanDetails.value.statusClass = "text-green-600";

    // Navigate to confirmation page or next step after successful submission
    router.push(`/BF-PTPC/MT/TT/04`);
  }, 1500);
};

const handleSubmit = (data) => {
  // Handle form submission
  console.log("Form submitted:", data);
  validateAndShowConfirmation();
};
</script>
