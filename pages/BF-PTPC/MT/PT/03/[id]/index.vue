<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Keluarkan Tunai (PKP)</h2>
        </div>
      </template>

      <template #body>
        <!-- Bantuan Details Section -->
        <div class="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 class="text-lg font-medium mb-4">Maklumat Bantuan</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-600">Nama Asnaf</p>
              <p class="font-medium">{{ bantuanDetails.namaAsnaf }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">No. Kad Pengenalan</p>
              <p class="font-medium">{{ bantuanDetails.noKadPengenalan }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Jenis Bantuan</p>
              <p class="font-medium">{{ bantuanDetails.jenisBantuan }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Jumlah Bantuan</p>
              <p class="font-medium text-lg text-primary-600">
                {{ bantuanDetails.jumlahBantuan }}
              </p>
            </div>
            <div>
              <p class="text-sm text-gray-600">No. PA</p>
              <p class="font-medium">{{ bantuanDetails.paNombor }}</p>
            </div>
          </div>
        </div>

        <!-- Success Message - Only shown after completion -->
        <div v-if="isCompleted" class="mb-6">
          <div class="flex items-center gap-2 mb-4">
            <Icon name="mdi:check-circle" class="text-green-500" size="1.5rem" />
            <p class="text-green-600 font-medium">Pengeluaran tunai berjaya direkodkan</p>
          </div>
        </div>

        <!-- Form Section - Always shown -->
        <div class="mb-6">
          <h3 class="text-lg font-medium mb-2">Maklumat Pemulangan Tunai ()</h3>
          <FormKit type="form" :actions="false" @submit="handleSubmit">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit
                type="number"
                name="jumlahTunaiDipulangkan"
                label="Jumlah Tunai Dipulangkan (RM)"
                validation="required|min:0"
                :validation-messages="{
                  required: 'Jumlah tunai dipulangkan adalah wajib',
                  min: 'Jumlah tidak boleh negatif',
                }"
                :disabled="isCompleted"
              />

              <FormKit
                type="datetime-local"
                name="tarikhMasaPengeluaran"
                label="Tarikh & Masa Pengeluaran"
                validation="required"
                :validation-messages="{
                  required: 'Tarikh dan masa pengeluaran adalah wajib',
                }"
                :disabled="isCompleted"
                :value="currentDateTime"
              />

              <FormKit
                type="text"
                name="namaPKP"
                label="Nama PKP yang Mengeluarkan"
                validation="required"
                :validation-messages="{
                  required: 'Nama PKP adalah wajib',
                }"
                :disabled="isCompleted"
              />

              <FormKit
                type="text"
                name="namaPenerima"
                label="Nama Penerima Tunai (Kewangan)"
                validation="required"
                :validation-messages="{
                  required: 'Nama penerima adalah wajib',
                }"
                :disabled="isCompleted"
              />

              <div class="md:col-span-2">
                <FormKit
                  type="text"
                  name="tujuan"
                  label="Tujuan"
                  validation="required"
                  :validation-messages="{
                    required: 'Tujuan adalah wajib',
                  }"
                  :disabled="isCompleted"
                  value="Pemulangan Bantuan Tidak Dituntut"
                />
              </div>

              <div class="md:col-span-2">
                <FormKit
                  type="file"
                  name="slipPengeluaran"
                  label="Slip Pengeluaran"
                  accept="image/*, application/pdf"
                  validation="required"
                  :validation-messages="{
                    required: 'Slip pengeluaran adalah wajib',
                  }"
                  :disabled="isCompleted"
                  help="Muat naik gambar atau PDF slip pengeluaran"
                />
              </div>

              <FormKit
                type="text"
                name="noRujukan"
                label="No. Rujukan / Log Transaksi"
                validation="required"
                :validation-messages="{
                  required: 'No. rujukan adalah wajib',
                }"
                :disabled="isCompleted"
              />
            </div>

            <div class="mt-4">
              <FormKit
                type="textarea"
                name="catatan"
                label="Catatan / Nota"
                placeholder="Sila masukkan catatan atau nota tambahan (jika ada)"
                :disabled="isCompleted"
              />
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
                  @click="showConfirmationModal = true"
                >
                  Hantar
                </rs-button>
              </div>
            </div>
          </FormKit>
        </div>
      </template>
    </rs-card>

    <!-- Confirmation Modal -->
    <rs-modal
      title="Sahkan Pengeluaran Tunai"
      v-model="showConfirmationModal"
      ok-title="Sahkan"
      cancel-title="Batal"
      position="center"
    >
      <template #body>
        <p class="mb-4">Adakah anda pasti untuk mengesahkan pengeluaran tunai ini?</p>
        <div class="bg-gray-50 p-4 rounded-lg">
          <p class="font-medium">
            Jumlah Tunai:
            {{
              formData.jumlahTunaiDipulangkan
                ? `RM ${formData.jumlahTunaiDipulangkan.toFixed(2)}`
                : "RM 0.00"
            }}
          </p>
          <p class="text-sm text-gray-600">
            Pastikan maklumat pengeluaran tunai adalah betul sebelum disahkan.
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
          <span v-else> Sahkan </span>
        </rs-button>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const isCompleted = ref(false);
const processing = ref(false);
const showConfirmationModal = ref(false);
const breadcrumb = ref([
  {
    name: "Senarai Bantuan Tidak Dituntut",
    type: "link",
    path: "/BF-PTPC/MT/PT/01",
  },
  {
    name: "Keluarkan Tunai (PKP)",
    type: "current",
    path: "/BF-PTPC/MT/PT/03",
  },
]);

const bantuanDetails = ref({
  namaAsnaf: "",
  noKadPengenalan: "",
  jenisBantuan: "",
  jumlahBantuan: "",
  paNombor: "",
});

const formData = ref({
  jumlahTunaiDipulangkan: null,
  tarikhMasaPengeluaran: "",
  namaPKP: "",
  namaPenerima: "",
  tujuan: "Pemulangan Bantuan Tidak Dituntut",
  slipPengeluaran: null,
  noRujukan: "",
  catatan: "",
});

const currentDateTime = computed(() => {
  const now = new Date();
  return now.toISOString().slice(0, 16);
});

definePageMeta({
  title: "Keluarkan Tunai",
});

onMounted(() => {
  // Mock data for bantuan details
  bantuanDetails.value = {
    namaAsnaf: "Ahmad bin Abdullah",
    noKadPengenalan: "800101-01-1234",
    jenisBantuan: "Bantuan Kewangan",
    jumlahBantuan: "RM 1,000.00",
    paNombor: route.params.id || "PA-2023-001",
  };
});

const navigateBack = () => {
  router.back();
};

const handleConfirm = async () => {
  processing.value = true;

  // Simulate API call to save the data
  setTimeout(async () => {
    processing.value = false;
    showConfirmationModal.value = false;
    isCompleted.value = true;

    // Show success message for 2 seconds, then redirect
    setTimeout(() => {
      router.push(`/BF-PTPC/MT/PT/04/${route.params.id}`);
    }, 2000);
  }, 1500);
};

const handleSubmit = (data) => {
  // Handle form submission
  console.log("Form submitted:", data);
  formData.value = { ...data };
  showConfirmationModal.value = true;
};
</script>
