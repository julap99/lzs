<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Sahkan Jumlah Tunai</h2>
          <rs-button
            v-if="!isApproved"
            variant="primary"
            @click="showConfirmationModal = true"
          >
            Sah
          </rs-button>
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

        <!-- Form Section - Only shown after approval -->
        <div v-show="isApproved" class="mb-6">
          <div class="flex items-center gap-2 mb-4">
            <Icon name="mdi:check-circle" class="text-green-500" size="1.5rem" />
            <p class="text-green-600 font-medium">Bantuan telah disahkan</p>
          </div>

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
              />

              <FormKit
                type="text"
                name="bankBranch"
                label="Cawangan Maybank"
                validation="required"
                :validation-messages="{
                  required: 'Cawangan Maybank adalah wajib',
                }"
              />

              <FormKit
                type="text"
                name="officerName"
                label="Nama Pegawai LZS Yang Diberi Kuasa"
                validation="required"
                :validation-messages="{
                  required: 'Nama pegawai adalah wajib',
                }"
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
              />

              <FormKit
                type="datetime-local"
                name="transferDateTime"
                label="Tarikh dan Masa Pindahan"
                validation="required"
                :validation-messages="{
                  required: 'Tarikh dan masa pindahan adalah wajib',
                }"
              />
            </div>

            <div class="mt-6">
              <rs-button type="submit" variant="primary"> Simpan </rs-button>
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
      @ok="handleConfirm"
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
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const isApproved = ref(false);
const showConfirmationModal = ref(false);
const breadcrumb = ref([
  {
    name: "Jana Senarai Nama dan Jumlah Bantuan",
    type: "link",
    path: "/BF-PTPC/MT-AG/01",
  },
  {
    name: "Sahkan Jumlah Tunai",
    type: "current",
    path: "/BF-PTPC/MT-AG/02",
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
      path: "/BF-PTPC/MT-AG/01",
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
    paNombor: "PA-2024-001",
  };
});

const handleConfirm = () => {
  console.log("Before approval:", isApproved.value);
  isApproved.value = true;
  console.log("After approval:", isApproved.value);
  showConfirmationModal.value = false;
};

const handleSubmit = (formData) => {
  // Handle form submission
  console.log("Form submitted:", formData);
};
</script>
