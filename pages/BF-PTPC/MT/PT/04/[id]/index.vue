<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Terima & Sahkan Pemulangan Tunai (Kewangan)
          </h2>
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
            <div>
              <p class="text-sm text-gray-600">Rujukan Pemulangan</p>
              <p class="font-medium">{{ bantuanDetails.rujukanPemulangan }}</p>
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
              Pemulangan tunai berjaya disahkan dan diterima
            </p>
          </div>
        </div>

        <!-- Form Section - Always shown -->
        <div class="mb-6">
          <h3 class="text-lg font-medium mb-2">
            Maklumat Penerimaan Pemulangan Tunai
          </h3>
          <FormKit type="form" :actions="false" @submit="handleSubmit">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                type="datetime-local"
                name="tarikhMasaPenerimaan"
                label="Tarikh & Masa Penerimaan"
                validation="required"
                :validation-messages="{
                  required: 'Tarikh dan masa penerimaan adalah wajib',
                }"
                :disabled="isCompleted"
                :value="currentDateTime"
              />

              <FormKit
                type="text"
                name="namaPegawaiPenerima"
                label="Nama Pegawai Penerima (Kewangan)"
                validation="required"
                :validation-messages="{
                  required: 'Nama pegawai penerima adalah wajib',
                }"
                :disabled="isCompleted"
              />

              <FormKit
                type="text"
                name="namaPenyerah"
                label="Nama Penyerah (Cawangan)"
                validation="required"
                :validation-messages="{
                  required: 'Nama penyerah adalah wajib',
                }"
                :disabled="isCompleted"
              />

              <div class="md:col-span-2">
                <FormKit
                  type="select"
                  name="statusPengesahan"
                  label="Status Pengesahan"
                  validation="required"
                  :options="['Sah', 'Tidak Sah']"
                  :validation-messages="{
                    required: 'Status pengesahan adalah wajib',
                  }"
                  :disabled="isCompleted"
                />
              </div>

              <div class="md:col-span-2">
                <FormKit
                  type="file"
                  name="buktiPenerimaan"
                  label="Bukti Penerimaan"
                  accept="image/*, application/pdf"
                  validation="required"
                  :validation-messages="{
                    required: 'Bukti penerimaan adalah wajib',
                  }"
                  :disabled="isCompleted"
                  help="Muat naik gambar atau PDF bukti penerimaan"
                />
              </div>
            </div>

            <div class="mt-4">
              <FormKit
                type="textarea"
                name="catatan"
                label="Catatan Tambahan"
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
      title="Sahkan Penerimaan Tunai"
      v-model="showConfirmationModal"
      ok-title="Sahkan"
      cancel-title="Batal"
      position="center"
    >
      <template #body>
        <p class="mb-4">
          Adakah anda pasti untuk mengesahkan penerimaan pemulangan tunai ini?
        </p>
        <div class="bg-gray-50 p-4 rounded-lg">
          <p class="font-medium">
            Jumlah Tunai:
            {{
              formData.jumlahTunaiDiterima
                ? `RM ${formData.jumlahTunaiDiterima}`
                : "RM 0.00"
            }}
          </p>
          <p class="text-sm text-gray-600">
            Pastikan jumlah yang diterima adalah tepat dan sepadan dengan jumlah
            yang telah disahkan untuk pemulangan.
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
          <span v-else> Sah & Terima </span>
        </rs-button>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

definePageMeta({
  title: "Terima & Sahkan Pemulangan Tunai",
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
    path: `/BF-PTPC/MT/PT/01`,
  },
  {
    name: "Pemulangan Tunai",
    type: "link",
    path: `/BF-PTPC/MT/PT/01`,
  },
  {
    name: "Terima & Sahkan Pemulangan Tunai (Kewangan)",
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
  rujukanPemulangan: "",
});

const formData = ref({
  jumlahTunaiDiterima: null,
  tarikhMasaPenerimaan: "",
  namaPegawaiPenerima: "",
  namaPenyerah: "",
  statusPengesahan: "Sah",
  buktiPenerimaan: null,
  catatan: "",
});

const currentDateTime = computed(() => {
  const now = new Date();
  return now.toISOString().slice(0, 16);
});

onMounted(() => {
  // Mock data for bantuan details
  bantuanDetails.value = {
    namaAsnaf: "Ahmad bin Abdullah",
    noKadPengenalan: "800101-01-1234",
    jenisBantuan: "Bantuan Kewangan",
    jumlahBantuan: "RM 1,000.00",
    paNombor: route.params.id || "PA-2023-001",
    rujukanPemulangan: "REF-" + (route.params.id || "PA-2023-001"),
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
      router.push("/BF-PTPC/MT/PT/01");
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
