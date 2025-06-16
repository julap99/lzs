<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Cipta Profil Pengguna</h2>
        </div>
      </template>

      <template #body>
        <!-- Form Section -->
        <div class="mb-6">
          <h3 class="text-lg font-medium mb-4">Maklumat Pendaftaran Profil</h3>
          <FormKit type="form" :actions="false" @submit="handleSubmit">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Read-only fields -->
              <FormKit
                type="text"
                name="name"
                label="Nama"
                :disabled="true"
                v-model="formData.name"
              />

              <FormKit
                type="text"
                name="icNumber"
                label="No Kad Pengenalan"
                :disabled="true"
                v-model="formData.icNumber"
              />

              <FormKit
                type="email"
                name="email"
                label="Emel"
                :disabled="true"
                v-model="formData.email"
              />

              <FormKit
                type="tel"
                name="phone"
                label="No Telefon"
                :disabled="true"
                v-model="formData.phone"
              />

              <!-- Password field -->
              <FormKit
                type="password"
                name="password"
                label="Kata Laluan"
                validation="required|length:8"
                validation-visibility="live"
                v-model="formData.password"
                :validation-messages="{
                  required: 'Kata laluan adalah wajib',
                  length: 'Kata laluan mestilah sekurang-kurangnya 8 aksara',
                }"
              />

              <FormKit
                type="password"
                name="confirmPassword"
                label="Sahkan Kata Laluan"
                validation="required|confirm:password"
                validation-visibility="live"
                v-model="formData.confirmPassword"
                :validation-messages="{
                  required: 'Pengesahan kata laluan adalah wajib',
                  confirm: 'Kata laluan tidak sepadan',
                }"
              />
            </div>

            <div class="mt-6 flex justify-end gap-4">
              <rs-button variant="primary-outline" @click="resetForm">
                Reset
              </rs-button>
              <rs-button
                variant="primary"
                @click="handleSubmit"
                :disabled="processing"
              >
                <span v-if="processing">
                  <Icon name="eos-icons:loading" class="ml-1" size="1rem" />
                </span>
                <span v-else>Daftar</span>
              </rs-button>
            </div>
          </FormKit>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";

definePageMeta({
  title: "Cipta Profil Pengguna",
});

const route = useRoute();
const router = useRouter();
const processing = ref(false);

const breadcrumb = ref([
  {
    name: "Pengurusan Aduan",
    type: "link",
    path: "/BF-ADN/PA/DA/01",
  },
  {
    name: "Daftar Aduan",
    type: "link",
    path: "/BF-ADN/PA/DA/01",
  },
  {
    name: "Cipta Profil Pengguna",
    type: "current",
    path: "/BF-ADN/PA/DA/04",
  },
]);

// Form data with initial values from previous step
const formData = ref({
  name: "Ahmad bin Abdullah", // Example name
  icNumber: "880101-12-1234", // Example IC number
  email: "ahmad.abdullah@email.com", // Example email
  phone: "012-3456789", // Example phone number
  password: "",
  confirmPassword: "",
});

const resetForm = () => {
  formData.value.password = "";
  formData.value.confirmPassword = "";
};

const handleSubmit = async () => {
  processing.value = true;

  try {
    // TODO: Implement API call to create profile
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulated API call

    // Navigate to next step or success page
    navigateTo("/BF-ADN/PA/DA/05");
  } catch (error) {
    console.error("Error creating profile:", error);
  } finally {
    processing.value = false;
  }
};
</script>
