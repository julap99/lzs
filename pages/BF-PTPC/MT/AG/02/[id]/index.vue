<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Sahkan Jumlah Tunai</h2>
          <!-- Removed the Sah button from here -->
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

        <!-- Success Message - Only shown after approval -->
        <div v-if="isApproved" class="mb-6">
          <div class="flex items-center gap-2 mb-4">
            <Icon name="mdi:check-circle" class="text-green-500" size="1.5rem" />
            <p class="text-green-600 font-medium">Bantuan telah disahkan</p>
          </div>
        </div>

        <!-- Form Section - Always shown -->
        <div class="mb-6">
          <h3 class="text-lg font-medium mb-2">Maklumat Arahan Pindahan Tunai</h3>
          <FormKit type="form" :actions="false" @submit="handleSubmit">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit
                type="text"
                name="district"
                label="Daerah"
                validation="required"
                :validation-messages="{
                  required: 'Daerah adalah wajib',
                }"
                :disabled="isApproved"
              />

              <FormKit
                type="text"
                name="bankBranch"
                label="Cawangan Maybank"
                validation="required"
                :validation-messages="{
                  required: 'Cawangan Maybank adalah wajib',
                }"
                :disabled="isApproved"
              />

              <FormKit
                type="text"
                name="officerName"
                label="Nama Pegawai LZS Yang Diberi Kuasa"
                validation="required"
                :validation-messages="{
                  required: 'Nama pegawai adalah wajib',
                }"
                :disabled="isApproved"
              />

              <FormKit
                type="text"
                name="officerIC"
                label="No Kad Pengenalan Pegawai LZS Yang Diberi Kuasa"
                validation="required|length:12"
                :validation-messages="{
                  required: 'No Kad Pengenalan adalah wajib',
                  length: 'No Kad Pengenalan mesti 12 digit',
                }"
                :disabled="isApproved"
              />

              <FormKit
                type="tel"
                name="officerPhone"
                label="No Telefon Pegawai LZS Yang Diberi Kuasa"
                validation="required|matches:/^[0-9]{3}-[0-9]{7}$/"
                :validation-messages="{
                  required: 'No telefon adalah wajib',
                  matches: 'Format no telefon tidak sah (xxx-xxxxxxx)',
                }"
                help="Format: xxx-xxxxxxx"
                :disabled="isApproved"
              />

              <FormKit
                type="number"
                name="transferAmount"
                label="Jumlah Pindahan Wang"
                validation="required|min:1"
                :validation-messages="{
                  required: 'Jumlah pindahan adalah wajib',
                  min: 'Jumlah pindahan mesti lebih daripada 0',
                }"
                :disabled="isApproved"
              />

              <FormKit
                type="datetime-local"
                name="transferDateTime"
                label="Tarikh dan Masa Pindahan"
                validation="required"
                :validation-messages="{
                  required: 'Tarikh dan masa pindahan adalah wajib',
                }"
                :disabled="isApproved"
              />
            </div>

            <div class="mt-6 flex justify-end gap-4">
              <div>
                <rs-button
                  variant="primary-outline"
                  v-if="!isApproved"
                  @click="navigateTo('/BF-PTPC/MT/AG/01')"
                >
                  Kembali
                </rs-button>
              </div>

              <div>
                <!-- Sah button moved to bottom right -->
                <rs-button
                  v-if="!isApproved"
                  variant="primary"
                  class="ml-auto"
                  @click="showConfirmationModal = true"
                >
                  Sah
                </rs-button>
              </div>
            </div>
          </FormKit>
        </div>
      </template>
    </rs-card>

    <!-- Confirmation Modal -->
    <rs-modal
      title="Sahkan Bantuan"
      v-model="showConfirmationModal"
      ok-title="Sahkan"
      cancel-title="Batal"
      position="center"
    >
      <template #body>
        <p class="mb-4">Adakah anda pasti untuk sahkan bantuan ini?</p>
        <div class="bg-gray-50 p-4 rounded-lg">
          <p class="font-medium">Jumlah Bantuan: {{ bantuanDetails.jumlahBantuan }}</p>
          <p class="text-sm text-gray-600">
            Pastikan jumlah bantuan adalah betul sebelum disahkan.
          </p>
        </div>
      </template>

      <template #footer>
        <rs-button
          @click="showConfirmationModal = false"
          :disabled="approving"
          variant="primary-outline"
        >
          Tutup
        </rs-button>

        <rs-button @click="handleConfirm()" :disabled="approving">
          <span v-if="approving">
            <Icon name="eos-icons:loading" class="ml-1" size="1rem" />
          </span>
          <span v-else> Sahkan </span>
        </rs-button>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const isApproved = ref(false);
const approving = ref(false);
const showConfirmationModal = ref(false);
const breadcrumb = ref([
  {
    name: "Jana Senarai Nama dan Jumlah Bantuan",
    type: "link",
    path: "/BF-PTPC/MT/AG/01",
  },
  {
    name: "Sahkan Jumlah Tunai",
    type: "current",
    path: "/BF-PTPC/MT/AG/02",
  },
]);
const bantuanDetails = ref({
  namaAsnaf: "",
  noKadPengenalan: "",
  jenisBantuan: "",
  jumlahBantuan: "",
  paNombor: "",
});

definePageMeta({
  title: "Sahkan Jumlah Tunai",
  breadcrumb: [
    {
      name: "Jana Senarai Nama dan Jumlah Bantuan",
      type: "link",
      path: "/BF-PTPC/MT/AG/01",
    },
    {
      name: "Sahkan Jumlah Tunai",
      type: "current",
    },
  ],
});

onMounted(() => {
  // Mock data for bantuan details
  bantuanDetails.value = {
    namaAsnaf: "Ahmad bin Abdullah",
    noKadPengenalan: "800101-01-1234",
    jenisBantuan: "Bantuan Kewangan",
    jumlahBantuan: "RM 1,000.00",
    paNombor: route.params.id,
  };
});

const handleConfirm = async () => {
  console.log("Handle confirm");
  approving.value = true;

  // isApproved.value = true;
  // showConfirmationModal.value = false;

  setTimeout(async () => {
    showConfirmationModal.value = false;
    await navigateTo(`/BF-PTPC/MT/AG/03/${route.params.id}`);
  }, 2000);
};

const handleSubmit = (formData) => {
  // Handle form submission
  console.log("Form submitted:", formData);
  // If this is the final submission after filling the form, you might want to show a success message
};
</script>
