<!-- 
  RTMF SCREEN: PL-LOGIN-01
  PURPOSE: Login Page for Pengguna Luar (External Users)
  DESCRIPTION: Login interface for external users to access search functionality
  ROUTE: /BF-PRF/pengguna-luar/login
-->
<template>
  <div class="flex-none md:flex justify-center text-center items-center h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
    <div class="w-full md:w-3/4 lg:w-1/2 xl:w-2/6 relative">
      <rs-card class="h-screen md:h-auto px-10 md:px-16 py-12 md:py-20 mb-0 shadow-xl">
        <div class="img-container flex justify-center items-center mb-5">
          <img
            src="https://www.zakatselangor.com.my/wp-content/uploads/2018/10/lzs-logo.png"
            class="max-w-[150px]"
            alt="LZS Logo"
          />
        </div>

        <!-- Welcome Message -->
        <div class="text-center mb-6">
          <div class="text-2xl font-bold mb-2 text-gray-800" dir="rtl" lang="ar">
            اَلسَلامُ عَلَيْكُم وَرَحْمَةُ اَللهِ وَبَرَكاتُهُ‎
          </div>
          <h1 class="text-xl font-semibold text-gray-900 mb-2">
            Selamat Datang ke Sistem Pengguna Luar
          </h1>
          <p class="text-slate-500 text-sm">
            Log masuk untuk mengakses fungsi carian
          </p>
        </div>

        <div class="space-y-6">
          <FormKit
            type="text"
            v-model="username"
            placeholder="Masukkan ID Pengguna"
            :classes="{
              outer: 'col-span-2',
              label: 'text-left',
              messages: 'text-left',
            }"
          >
            <template #prefixIcon>
              <Icon
                name="ph:user-fill"
                class="!w-5 !h-5 ml-3 text-gray-500"
              ></Icon>
            </template>
          </FormKit>

          <FormKit
            :type="togglePasswordVisibility ? 'text' : 'password'"
            v-model="password"
            placeholder="Masukkan Kata Laluan"
            :classes="{
              outer: 'col-span-2',
              label: 'text-left',
              messages: 'text-left',
            }"
          >
            <template #prefixIcon>
              <Icon
                name="ph:lock-key-fill"
                class="!w-5 !h-5 ml-3 text-gray-500"
              ></Icon>
            </template>
            <template #suffix>
              <button
                type="button"
                @click="togglePasswordVisibility = !togglePasswordVisibility"
                class="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <Icon
                  :name="togglePasswordVisibility ? 'ph:eye-slash' : 'ph:eye'"
                  class="!w-5 !h-5 text-gray-500"
                />
              </button>
            </template>
          </FormKit>

          <rs-button
            variant="primary"
            size="lg"
            class="w-full"
            :loading="false"
            @click="login"
          >
            <Icon name="ph:sign-in" class="mr-2" />
            Log Masuk
          </rs-button>
        </div>

        <!-- Help Section -->
        <div class="mt-8 pt-6 border-t border-gray-200">
          <div class="text-center">
            <p class="text-sm text-gray-600 mb-2">
              Memerlukan bantuan?
            </p>
            <div class="flex justify-center gap-4 text-sm">
              <a href="#" class="text-primary hover:text-primary/80 font-medium">
                Lupa Kata Laluan
              </a>
              <span class="text-gray-400">|</span>
              <a href="#" class="text-primary hover:text-primary/80 font-medium">
                Hubungi Sokongan
              </a>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="mt-8 text-center">
          <p class="text-xs text-gray-500">
            © 2024 Lembaga Zakat Selangor. Hak cipta terpelihara.
          </p>
        </div>
      </rs-card>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from "~/stores/user";

definePageMeta({
  title: "Login Pengguna Luar",
  layout: "empty",
  middleware: ["dashboard"],
});

const { $swal } = useNuxtApp();
const username = ref("");
const password = ref("");
const userStore = useUserStore();

const togglePasswordVisibility = ref(false);

const login = async () => {
  // Match Penolong Amil behavior: simple redirect for presentation
  userStore.setUsername("pengguna_luar_user");
  userStore.setRoles(["PenggunaLuar"]);
  userStore.setIsAuthenticated(true);

  // Redirect to Pengguna Luar dashboard by default
  navigateTo("/BF-PRF/pengguna-luar/dashboard");
};

const handleWidgetId = (widgetId) => {
  console.log("Widget ID: ", widgetId);
};

const handleErrorCalback = () => {
  console.log("Error callback");
};

const handleExpiredCallback = () => {
  console.log("Expired callback");
};

const handleLoadCallback = (response) => {
  console.log("Load callback", response);
};
</script>

<style scoped>
.rs-card {
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
}
</style> 