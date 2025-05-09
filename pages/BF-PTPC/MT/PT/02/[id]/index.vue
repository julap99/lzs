<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Sahkan Jumlah Tunai (PKP)</h2>
          <!-- Removed the Sah button from here -->
        </div>
      </template>

      <template #body>
        <!-- Keterangan Aktiviti Section -->
        <!-- <div class="mb-6 p-4 bg-blue-50 rounded-lg">
          <h3 class="text-lg font-medium mb-2">Keterangan Aktiviti</h3>
          <p class="text-sm">
            Proses pengesahan untuk memastikan jumlah wang tunai yang masih berada dalam
            pegangan adalah selaras dan padan dengan senarai nama pemohon dan jumlah
            bantuan yang tidak dituntut, seperti yang dijana oleh NAS (>60 hari).
          </p>
        </div> -->

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

        <!-- Penggunaan Maklumat Section -->
        <!-- <div class="mb-6 p-4 bg-yellow-50 rounded-lg">
          <h3 class="text-lg font-medium mb-2">Penggunaan Maklumat</h3>
          <ul class="list-disc ml-5 text-sm">
            <li>Jumlah Bantuan Tidak Dituntut</li>
            <li>Jumlah Tunai Fizikal Dalam Pegangan</li>
            <li>Catatan / Nota</li>
          </ul>
        </div> -->

        <!-- Form Section - Always shown -->
        <div class="mb-6">
          <h3 class="text-lg font-medium mb-2">Maklumat Arahan Pindahan Tunai</h3>
          <FormKit type="form" :actions="false" @submit="handleSubmit">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit
                type="number"
                name="jumlahBantuanTidakDituntut"
                label="Jumlah Bantuan Tidak Dituntut (RM)"
                validation="required|min:0"
                :validation-messages="{
                  required: 'Jumlah bantuan tidak dituntut adalah wajib',
                  min: 'Jumlah tidak boleh negatif',
                }"
                disabled
                v-model="bantuanDetails.jumlah"
              />

              <FormKit
                type="number"
                name="jumlahTunaiFizikal"
                label="Jumlah Tunai Fizikal Dalam Pegangan (RM)"
                validation="required|min:0"
                :validation-messages="{
                  required: 'Jumlah tunai fizikal adalah wajib',
                  min: 'Jumlah tidak boleh negatif',
                }"
                :disabled="isApproved"
              />
            </div>

            <div class="mt-4">
              <FormKit
                type="textarea"
                name="catatan"
                label="Catatan / Nota"
                placeholder="Sila masukkan catatan atau nota tambahan (jika ada)"
                :disabled="isApproved"
              />
            </div>

            <div class="mt-6 flex justify-end gap-4">
              <div>
                <rs-button
                  variant="primary-outline"
                  v-if="!isApproved"
                  @click="navigateTo('/BF-PTPC/MT/PT/01')"
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
        <p class="mb-4">Adakah anda pasti untuk sahkan jumlah tidak dituntut ini?</p>
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
    path: "/BF-PTPC/MT/PT/01",
  },
  {
    name: "Sahkan Jumlah Tunai (PKP)",
    type: "current",
    path: "/BF-PTPC/MT/PT/02",
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
  title: "Sahkan Jumlah Tunai (PKP)",
});

onMounted(() => {
  // Mock data for bantuan details
  bantuanDetails.value = {
    namaAsnaf: "Ahmad bin Abdullah",
    noKadPengenalan: "800101-01-1234",
    jenisBantuan: "Bantuan Kewangan",
    jumlahBantuan: "RM 1,000.00",
    jumlah: 1000,
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
    await navigateTo(`/BF-PTPC/MT/PT/03/${route.params.id}`);
  }, 2000);
};

const handleSubmit = (formData) => {
  // Handle form submission
  console.log("Form submitted:", formData);
  // If this is the final submission after filling the form, you might want to show a success message
};
</script>
