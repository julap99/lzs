<script setup>
import { useUserStore } from "~/stores/user";
import { RecaptchaV2 } from "vue3-recaptcha-v2";

definePageMeta({
  title: "Login",
  layout: "empty",
  middleware: ["dashboard"],
});

const { $swal } = useNuxtApp();
const username = ref("");
const password = ref("");
const userStore = useUserStore();

const togglePasswordVisibility = ref(false);

const login = async () => {
  // Bypass all authentication and go straight to dashboard
  // No server-side validation or API calls
  userStore.setUsername("test_user");
  userStore.setIsAuthenticated(true);


    if (username.value === "admin") { 
      userStore.setRoles(["Developer"]);

  navigateTo("/dashboard");

    } else if (username.value === "kitchen") {
      userStore.setRoles(["Kitchen"]);

  navigateTo("/kitchen-sink");

    } else if (username.value === "penolongamil") {
      userStore.setRoles(["PenolongAmil"]);
      navigateTo("/BF-PA/PP/penolong-amil");
    } else if (username.value === "penggunaluar") {
      userStore.setRoles(["PenggunaLuar"]);
      navigateTo("/BF-PRF/pengguna-luar/dashboard");
    }

  // Simple redirect to dashboard
  
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

<template>
  <div
    class="flex-none md:flex justify-center text-center items-center h-screen"
  >
    <div class="w-full md:w-3/4 lg:w-1/2 xl:w-2/6 relative">
      <rs-card class="h-screen md:h-auto px-10 md:px-16 py-12 md:py-20 mb-0">
        <div class="img-container flex justify-center items-center mb-5">
          <img
            src="https://www.zakatselangor.com.my/wp-content/uploads/2018/10/lzs-logo.png"
            class="max-w-[150px]"
            alt="LZS Logo"
          />
        </div>
        <p class="text-slate-500 text-lg mb-6">Log masuk ke akaun anda</p>
        <div class="grid grid-cols-2">
          <FormKit
            type="text"
            v-model="username"
            validation="required"
            placeholder="Masukkan ID Pengguna"
            :classes="{
              outer: 'col-span-2',
              label: 'text-left',
              messages: 'text-left',
            }"
            :validation-messages="{
              required: 'ID Pengguna wajib diisi.',
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
            validation="required"
            placeholder="Masukkan Kata Laluan"
            :classes="{
              outer: 'col-span-2',
              label: 'text-left',
              messages: 'text-left',
            }"
            :validation-messages="{
              required: 'Kata Laluan wajib diisi.',
            }"
          >
            <template #prefixIcon>
              <Icon
                name="ph:lock-key-fill"
                class="!w-5 !h-5 ml-3 text-gray-500"
              ></Icon>
            </template>
            <template #suffix>
              <div
                class="bg-gray-100 hover:bg-slate-200 dark:bg-slate-700 hover:dark:bg-slate-900 h-full rounded-r-md p-3 flex justify-center items-center cursor-pointer"
                @click="togglePasswordVisibility = !togglePasswordVisibility"
              >
                <Icon
                  v-if="!togglePasswordVisibility"
                  name="ion:eye-outline"
                  size="19"
                ></Icon>
                <Icon v-else name="ion:eye-off-outline" size="19"></Icon>
              </div>
            </template>
          </FormKit>
          <div class="col-span-2 mb-4">
            <RecaptchaV2
              @widget-id="handleWidgetId"
              @error-callback="handleErrorCalback"
              @expired-callback="handleExpiredCallback"
              @load-callback="handleLoadCallback"
            />
          </div>
          <NuxtLink
            class="col-span-2 flex items-center justify-end h-5 mt-1 text-primary hover:underline mb-5"
            to="forgot-password"
          >
            Lupa Kata Laluan?
          </NuxtLink>
          <FormKit
            type="button"
            input-class="w-full"
            outer-class="col-span-2"
            @click="login"
          >
            Log Masuk

            <Icon name="ph:caret-circle-right" class="!w-5 !h-5 ml-1"></Icon>
          </FormKit>
        </div>
        <div class="flex justify-center items-center">
          <hr class="w-full" />
          <p class="w-full !text-gray-400">Tiada akaun?</p>
          <hr class="w-full" />
        </div>

        <rs-button
          @click="navigateTo('/register')"
          class="w-full !bg-gray-100 !text-gray-600 border mt-5"
        >
          Daftar / Log masuk kali pertama
        </rs-button>
      </rs-card>
    </div>
  </div>
</template>
