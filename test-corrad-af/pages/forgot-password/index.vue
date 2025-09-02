<script setup>
const { siteSettings, loading: siteSettingsLoading } = useSiteSettings();

definePageMeta({
  title: "Reset Password",
  layout: "empty",
  middleware: ["dashboard"],
});

const email = ref("");

// Get login logo with fallback
const getLoginLogo = () => {
  if (siteSettingsLoading.value) {
    return '/img/logo/corradAF-logo.svg';
  }
  return siteSettings.value?.siteLoginLogo || '/img/logo/corradAF-logo.svg';
};

// Get site name with fallback
const getSiteName = () => {
  if (siteSettingsLoading.value) {
    return 'Login Logo';
  }
  return siteSettings.value?.siteName || 'Login Logo';
};

const changePassword = () => {
  // Simulate password change request without API call
  console.log("Password change requested for email:", email.value);
  // Add your password change logic here
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
              :src="getLoginLogo()" 
              :alt="getSiteName()" 
              class="max-w-[180px] max-h-[60px] object-contain"
              @error="$event.target.src = '/img/logo/corradAF-logo.svg'"
            />
          </div>
          <h2 class="mt-4 text-2xl font-bold text-gray-700">
            Tukar kata laluan
          </h2>
          <p class="text-sm text-gray-500">
            Kata laluan sementara akan dihantar ke emel anda.
          </p>
        </div>

        <FormKit type="form" :actions="false" @submit="changePassword">
          <FormKit
            type="email"
            name="email"
            placeholder="Sila masukkan emel anda"
            validation="required|email"
            :validation-messages="{
              required: 'Emel wajib diisi',
              email: 'Format emel tidak sah',
            }"
          >
            <template #prefix>
              <Icon
                name="ph:envelope"
                class="!w-5 !h-5 ml-3 text-gray-500"
              ></Icon>
            </template>
          </FormKit>
        </FormKit>

        <rs-button @click="navigateTo('reset-password')" class="w-full mt-6">
          <Icon name="ph:lock-fill" class="mr-2" />
          Tukar kata laluan
        </rs-button>

        <div class="mt-4">
          Kembali ke
          <nuxt-link to="/login" class="text-sm text-blue-500">
            log masuk
          </nuxt-link>
        </div>
      </rs-card>
    </div>
  </div>
</template>

<style scoped>
/* Add any additional component-specific styles here */
</style>
