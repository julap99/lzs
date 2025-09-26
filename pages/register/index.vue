<script setup>
import { ref } from "vue";
import { RecaptchaV2 } from "vue3-recaptcha-v2";

definePageMeta({
  title: "Register",
  layout: "empty",
  middleware: ["dashboard"],
});

const formData = ref({
  fullName: "",
  idType: "",
  idNumber: "",
  phoneNumber: "",
  password: "",
  confirmPassword: "",
  email: "",
  confirmEmail: "",
  subscribeNewsletter: false,
  agreeTerms: false,
});

const idTypeOptions = [
  { label: "Nombor Mykad", value: "mykad" },
  { label: "Passport", value: "passport" },
  { label: "No Pendaftaran", value: "pendaftaran" },
];

const getIdPlaceholder = () => {
  switch (formData.value.idType) {
    case "mykad":
      return "Contoh: 901231025678";
    case "passport":
      return "Contoh: A12345678";
    case "pendaftaran":
      return "Contoh: REG123456";
    default:
      return "Pilih jenis ID terlebih dahulu";
  }
};

const register = () => {
  // Simulate registration without API call
  console.log("Registration attempted with:", formData.value);
  // Add your registration logic here
};

const handleRecaptcha = (response) => {
  console.log("reCAPTCHA response:", response);
};
</script>

<template>
  <div
    class="flex-none md:flex justify-center text-center items-center h-screen"
  >
    <div class="w-full md:w-3/4 lg:w-1/2 xl:w-2/6 relative">
      <rs-card class="h-screen md:h-auto px-10 md:px-16 py-12 md:py-20 mb-0">
        <div class="text-center mb-8">
          <div class="img-container flex justify-center items-center mb-5">
            <img 
              src="https://www.zakatselangor.com.my/wp-content/uploads/2018/10/lzs-logo.png" 
              class="max-w-[150px]" 
              alt="LZS Logo"
            />
          </div>
          <h2 class="mt-4 text-2xl font-bold text-gray-700">Daftar Akaun</h2>
          <p class="text-sm text-gray-500">Semua medan adalah wajib</p>
        </div>

        <FormKit type="form" :actions="false" @submit="register">
          <FormKit
            type="text"
            name="fullName"
            placeholder="Nama Penuh"
            validation="required"
            :validation-messages="{
              required: 'Nama Penuh wajib diisi',
            }"
          >
            <template #prefixIcon>
              <Icon
                name="ph:user-fill"
                class="!w-5 !h-5 ml-3 text-gray-500"
              ></Icon>
            </template>
          </FormKit>

          <div class="relative">
            <div class="flex border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
              <div class="flex items-center px-3 bg-gray-50 border-r border-gray-300">
                <Icon
                  name="ph:identification-card-fill"
                  class="w-5 h-5 text-gray-500 mr-2"
                />
                <select
                  v-model="formData.idType"
                  class="bg-transparent border-none outline-none text-sm text-gray-700 min-w-[120px]"
                  required
                >
                  <option value="" disabled>Pilih Jenis ID</option>
                  <option v-for="option in idTypeOptions" :key="option.value" :value="option.value">
                    {{ option.label }}
                  </option>
                </select>
              </div>
              <input
                type="text"
                v-model="formData.idNumber"
                :placeholder="getIdPlaceholder()"
                class="flex-1 px-3 py-3 border-none outline-none text-sm"
                required
              />
            </div>
            <div v-if="!formData.idType" class="text-red-500 text-xs mt-1">Jenis ID wajib dipilih</div>
            <div v-if="formData.idType && !formData.idNumber" class="text-red-500 text-xs mt-1">Nombor ID wajib diisi</div>
          </div>

          <FormKit
            type="tel"
            name="phoneNumber"
            placeholder="Nombor Telefon"
            validation="required"
            :validation-messages="{
              required: 'Nombor Telefon wajib diisi',
            }"
          >
            <template #prefixIcon>
              <Icon
                name="ph:device-mobile-camera-fill"
                class="!w-5 !h-5 ml-3 text-gray-500"
              ></Icon>
            </template>
          </FormKit>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-4">
            <FormKit
              type="password"
              name="password"
              placeholder="Kata Laluan"
              validation="required"
              :validation-messages="{
                required: 'Kata Laluan wajib diisi',
              }"
            >
              <template #prefixIcon>
                <Icon
                  name="ph:lock-key-fill"
                  class="!w-5 !h-5 ml-3 text-gray-500"
                ></Icon>
              </template>
            </FormKit>
            <FormKit
              type="password"
              name="confirmPassword"
              placeholder="Pengesahan Kata Laluan"
              validation="required|confirm"
              :validation-messages="{
                required: 'Pengesahan Kata Laluan wajib diisi',
                confirm: 'Kata Laluan tidak sepadan',
              }"
              :validation-rules="{
                confirm: (value) => value === value.password,
              }"
            >
              <template #prefixIcon>
                <Icon
                  name="ph:lock-key-fill"
                  class="!w-5 !h-5 ml-3 text-gray-500"
                ></Icon>
              </template>
            </FormKit>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-4">
            <FormKit
              type="email"
              name="email"
              placeholder="Emel"
              validation="required|email"
              :validation-messages="{
                required: 'Emel wajib diisi',
                email: 'Format emel tidak sah',
              }"
            >
              <template #prefixIcon>
                <Icon
                  name="ph:envelope-fill"
                  class="!w-5 !h-5 ml-3 text-gray-500"
                ></Icon>
              </template>
            </FormKit>
            <FormKit
              type="email"
              name="confirmEmail"
              placeholder="Pengesahan Emel"
              validation="required|confirm"
              :validation-messages="{
                required: 'Pengesahan Emel wajib diisi',
                confirm: 'Emel tidak sepadan',
              }"
              :validation-rules="{
                confirm: (value) => value === value.email,
              }"
            >
              <template #prefixIcon>
                <Icon
                  name="ph:envelope-fill"
                  class="!w-5 !h-5 ml-3 text-gray-500"
                ></Icon>
              </template>
            </FormKit>
          </div>

          <div class="flex justify-start mb-4 mt-2">
            <RecaptchaV2 @verify="handleRecaptcha" />
          </div>

          <FormKit
            type="checkbox"
            name="subscribeNewsletter"
            label="Melanggan ke newsletter bulanan"
          />

          <FormKit
            type="checkbox"
            name="agreeTerms"
            label="Setuju dengan terma perkhidmatan"
            validation="accepted"
            :validation-messages="{
              accepted: 'Anda mesti bersetuju dengan terma perkhidmatan',
            }"
          >
            <template #label>
              Setuju dengan
              <a href="#" class="text-blue-600 ml-1">terma perkhidmatan</a>
            </template>
          </FormKit>

          <rs-button btn-type="submit" class="w-full"> Daftar Akaun </rs-button>
        </FormKit>

        <div class="text-center mt-4">
          <p class="text-sm text-gray-500">
            Sudah mempunyai akaun?
            <nuxt-link to="/login" class="text-blue-600">Log Masuk</nuxt-link>
          </p>
        </div>
      </rs-card>
    </div>
  </div>
</template>
