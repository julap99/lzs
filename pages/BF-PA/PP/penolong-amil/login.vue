<script setup>
import { useUserStore } from "~/stores/user";

definePageMeta({
  title: "Login Penolong Amil",
  layout: "empty",
  middleware: ["dashboard"],
});

const { $swal } = useNuxtApp();
const username = ref("");
const password = ref("");
const userStore = useUserStore();

const togglePasswordVisibility = ref(false);

const login = async () => {
  // Check for blocked user (case-insensitive)
  const blockedUsernames = ["padigantung", "pa_digantung", "pa-digantung", "penolongamil_digantung"];
  const currentUsername = username.value.toLowerCase().trim();
  
  if (blockedUsernames.includes(currentUsername)) {
    try {
      // Show blocked user alert
      await $swal.fire({
        title: "Akses Ditolak",
        html: `
          <div class="text-center">
            <div class="mb-4">
              <Icon name="ph:warning-circle" class="text-red-500 text-6xl mx-auto mb-4" />
            </div>
            <p class="text-lg font-semibold text-gray-800 mb-3">
              Akses anda telah dibatalkan
            </p>
            <p class="text-gray-600 mb-4">
              Akaun Penolong Amil anda telah dihentikan kerana pelanggaran peraturan atau tindakan yang tidak sesuai.
            </p>
            <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p class="text-sm text-red-700 font-medium mb-2">
                Untuk maklumat lanjut, sila hubungi:
              </p>
              <p class="text-sm text-red-600">
                • PYB atau PIC masjid anda<br/>
                • Lembaga Zakat Selangor hotline: 03-5514 1800
              </p>
            </div>
          </div>
        `,
        icon: "error",
        confirmButtonText: "Tutup",
        confirmButtonColor: "#dc2626",
        allowOutsideClick: true,
        allowEscapeKey: true,
        showCloseButton: true,
        showConfirmButton: true,
        customClass: {
          popup: 'swal-wide',
          title: 'text-red-600',
          confirmButton: 'px-6 py-2'
        }
      });
      
      return; // Prevent further execution
    } catch (error) {
      // Fallback: show simple alert if SweetAlert fails
      alert("Akses Ditolak\n\nAkaun Penolong Amil anda telah dihentikan kerana pelanggaran peraturan atau tindakan yang tidak sesuai.\n\nUntuk maklumat lanjut, sila hubungi PYB atau PIC masjid anda atau Lembaga Zakat Selangor hotline: 03-5514 1800");
      return;
    }
  }

  // Normal login flow for non-blocked users
  userStore.setUsername("penolong_amil_user");
  userStore.setRoles(["penolong-amil"]);
  userStore.setIsAuthenticated(true);
  
  // Redirect to Penolong Amil welcome page
  navigateTo("/BF-PA/PP/penolong-amil");
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
            Selamat Datang ke Sistem Penolong Amil
          </h1>
          <p class="text-slate-500 text-sm">
            Log masuk ke akaun Penolong Amil anda
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

<style scoped>
/* Custom styles for Penolong Amil login */
.rs-card {
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
}
</style>

<style>
/* SweetAlert custom styles for blocked user modal */
.swal-wide {
  width: 500px !important;
  max-width: 90vw !important;
}

.swal-wide .swal2-html-container {
  margin: 0 !important;
  padding: 0 !important;
}

.swal-wide .swal2-title {
  margin-bottom: 1rem !important;
  font-size: 1.5rem !important;
  font-weight: 600 !important;
}

.swal-wide .swal2-confirm {
  font-weight: 500 !important;
  border-radius: 0.5rem !important;
}
</style> 