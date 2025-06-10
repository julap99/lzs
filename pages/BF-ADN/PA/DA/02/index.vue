<template>
  <div>
    <LayoutsBreadcrumb />
    <rs-card class="mx-auto pt-4">

      <template #body>
        <div class="text-center">
          <!-- Success Message -->
          <div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
            <div class="flex items-center justify-center gap-2 text-green-600">
              <Icon name="material-symbols:check-circle-outline" class="text-2xl" />
              <span class="font-medium text-lg">Aduan berjaya dihantar!</span>
            </div>
          </div>

          <!-- Main Content -->
          <div class="space-y-6">
            <div>
              <Icon
                name="material-symbols:account-circle-outline"
                class="text-blue-500 text-6xl mb-4"
              />
              <h3 class="text-xl font-medium mb-3">Adakah anda ingin membuat akaun?</h3>
              <p class="text-gray-600">
                Membuat akaun membolehkan anda untuk:
              </p>
            </div>

            <!-- Benefits List -->
            <div class="bg-gray-50 rounded-lg p-6 max-w-md mx-auto">
              <ul class="text-left space-y-3">
                <li class="flex items-start gap-3">
                  <Icon name="material-symbols:check-circle" class="text-green-500 mt-1 flex-shrink-0" />
                  <span>Mengikuti status aduan anda dengan lebih mudah</span>
                </li>
                <li class="flex items-start gap-3">
                  <Icon name="material-symbols:check-circle" class="text-green-500 mt-1 flex-shrink-0" />
                  <span>Mengakses sejarah aduan anda</span>
                </li>
                <li class="flex items-start gap-3">
                  <Icon name="material-symbols:check-circle" class="text-green-500 mt-1 flex-shrink-0" />
                  <span>Menerima notifikasi tentang aduan anda</span>
                </li>
              </ul>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <!-- <rs-button variant="primary-outline" @click="navigateBack" class="w-full sm:w-auto">
                Kembali
              </rs-button> -->
              <rs-button variant="secondary" @click="navigateNext" class="w-full sm:w-auto">
                Teruskan Tanpa Akaun
              </rs-button>
              <rs-button variant="primary" @click="navigateToCreateAccount" class="w-full sm:w-auto">
                Cipta Akaun
              </rs-button>
            </div>
          </div>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

definePageMeta({
  title: "Pilihan Akaun",
  description: "Halaman untuk memilih sama ada untuk membuat akaun atau tidak",
});

const router = useRouter();

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
    name: "Pilihan Akaun",
    type: "current",
    path: "/BF-ADN/PA/DA/02",
  },
]);

const navigateNext = () => {
  router.push("/BF-ADN/PA/DA/05");
};

const navigateBack = () => {
  router.push("/BF-ADN/PA/DA/01");
};

const navigateToCreateAccount = () => {
  router.push("/BF-ADN/PA/DA/04");
};
</script>

<style scoped>
.rs-card {
  @apply shadow-lg;
}
</style>
