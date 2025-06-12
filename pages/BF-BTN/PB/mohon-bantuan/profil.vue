<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Profil Pemohon</h2>
          <rs-button
            variant="primary"
            @click="isEditing = !isEditing"
            v-if="!isEditing"
          >
            <Icon name="material-symbols:edit" class="mr-1" />
            Kemaskini Profil
          </rs-button>
        </div>
      </template>

      <template #body>
        <FormKit
          type="form"
          :actions="false"
          @submit="handleSubmit"
          v-model="formData"
        >
          <!-- Personal Information Section -->
          <div class="space-y-6">
            <h3 class="text-lg font-medium">Maklumat Peribadi</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit
                type="text"
                name="nama"
                label="Nama Penuh"
                validation="required"
                validation-label="Nama Penuh"
                :disabled="!isEditing"
              />
              <FormKit
                type="text"
                name="noKadPengenalan"
                label="No Kad Pengenalan"
                validation="required|number|length:12"
                validation-label="No Kad Pengenalan"
                :disabled="!isEditing"
              />
              <FormKit
                type="text"
                name="noTelefon"
                label="No Telefon"
                validation="required|number|length:10,11"
                validation-label="No Telefon"
                :disabled="!isEditing"
              />
              <FormKit
                type="email"
                name="emel"
                label="Emel"
                validation="required|email"
                validation-label="Emel"
                :disabled="!isEditing"
              />
            </div>
          </div>

          <!-- Address Section -->
          <div class="space-y-6 mt-8">
            <h3 class="text-lg font-medium">Alamat</h3>
            <div class="grid grid-cols-1 gap-4">
              <FormKit
                type="textarea"
                name="alamat"
                label="Alamat"
                validation="required"
                validation-label="Alamat"
                :disabled="!isEditing"
              />
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormKit
                  type="text"
                  name="poskod"
                  label="Poskod"
                  validation="required|number|length:5"
                  validation-label="Poskod"
                  :disabled="!isEditing"
                />
                <FormKit
                  type="text"
                  name="bandar"
                  label="Bandar"
                  validation="required"
                  validation-label="Bandar"
                  :disabled="!isEditing"
                />
                <FormKit
                  type="select"
                  name="negeri"
                  label="Negeri"
                  :options="negeriOptions"
                  validation="required"
                  validation-label="Negeri"
                  :disabled="!isEditing"
                />
              </div>
            </div>
          </div>

          <!-- Household Information Section -->
          <div class="space-y-6 mt-8">
            <h3 class="text-lg font-medium">Maklumat Isi Rumah</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit
                type="number"
                name="bilanganAhli"
                label="Bilangan Ahli Isi Rumah"
                validation="required|number|min:1"
                validation-label="Bilangan Ahli Isi Rumah"
                :disabled="!isEditing"
              />
              <FormKit
                type="number"
                name="pendapatanBulanan"
                label="Pendapatan Bulanan (RM)"
                validation="required|number|min:0"
                validation-label="Pendapatan Bulanan"
                :disabled="!isEditing"
              />
            </div>
          </div>

          <!-- Form Actions -->
          <div class="flex justify-end space-x-4 mt-8" v-if="isEditing">
            <rs-button
              variant="primary-outline"
              @click="cancelEdit"
            >
              Batal
            </rs-button>
            <rs-button variant="primary" @click="handleSubmit">
              Simpan
            </rs-button>
          </div>
        </FormKit>
      </template>
    </rs-card>

    <!-- Success Modal -->
    <rs-modal
      v-model="showSuccessModal"
      title="Profil Berjaya Dikemaskini"
      size="md"
      position="center"
    >
      <div class="space-y-4">
        <p class="text-green-600">
          Profil anda telah berjaya dikemaskini.
        </p>
      </div>

      <template #footer>
        <rs-button variant="primary" @click="showSuccessModal = false">
          Tutup
        </rs-button>
      </template>
    </rs-modal>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: "Profil Pemohon",
});

const breadcrumb = ref([
  {
    name: "Pengurusan Bantuan",
    type: "link",
    path: "/BF-BTN/PB/mohon-bantuan",
  },
  {
    name: "Profil Pemohon",
    type: "current",
    path: "/BF-BTN/PB/mohon-bantuan/profil",
  },
]);

// State
const isEditing = ref(false);
const showSuccessModal = ref(false);

const formData = ref({
  nama: "Ahmad bin Abdullah",
  noKadPengenalan: "800101-01-1234",
  noTelefon: "0123456789",
  emel: "ahmad@example.com",
  alamat: "No 123, Jalan Contoh",
  poskod: "50000",
  bandar: "Kuala Lumpur",
  negeri: "WP Kuala Lumpur",
  bilanganAhli: 4,
  pendapatanBulanan: 3000,
});

// Options
const negeriOptions = [
  "Johor",
  "Kedah",
  "Kelantan",
  "Melaka",
  "Negeri Sembilan",
  "Pahang",
  "Pulau Pinang",
  "Perak",
  "Perlis",
  "Selangor",
  "Terengganu",
  "Sabah",
  "Sarawak",
  "WP Kuala Lumpur",
  "WP Labuan",
  "WP Putrajaya",
];

// Methods
const handleSubmit = async () => {
  try {
    // TODO: Implement API call to update profile
    showSuccessModal.value = true;
    isEditing.value = false;
  } catch (error) {
    console.error("Error updating profile:", error);
  }
};

const cancelEdit = () => {
  // Reset form data to original values
  formData.value = {
    nama: "Ahmad bin Abdullah",
    noKadPengenalan: "800101-01-1234",
    noTelefon: "0123456789",
    emel: "ahmad@example.com",
    alamat: "No 123, Jalan Contoh",
    poskod: "50000",
    bandar: "Kuala Lumpur",
    negeri: "WP Kuala Lumpur",
    bilanganAhli: 4,
    pendapatanBulanan: 3000,
  };
  isEditing.value = false;
};
</script>

<style lang="scss" scoped></style> 