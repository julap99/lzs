<template>
  <div>
    <LayoutsBreadcrumb />
    <rs-card>
      <template #header>
        <h5>Cipta Profil</h5>
      </template>
      <template #body>
        <div class="text-center">
          <Icon
            name="material-symbols:info-outline"
            class="text-blue-500 text-5xl mb-4"
          />
          <h3 class="text-lg font-medium mb-2">Halaman Cipta Profil</h3>
          <p class="text-gray-600 mb-6">
            Halaman ini akan mengandungi borang untuk cipta profil. Untuk tujuan
            mock, sila klik butang "Teruskan" untuk ke halaman seterusnya.
          </p>
          <div class="flex justify-center gap-4">
            <rs-button variant="primary-outline" @click="navigateBack">
              Kembali
            </rs-button>
            <rs-button variant="primary" @click="navigateNext">
              Teruskan
            </rs-button>
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
  title: "Cipta Profil",
  description: "Halaman untuk cipta profil pengguna",
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
    name: "Cipta Profil",
    type: "current",
    path: "/BF-ADN/PA/DA/02",
  },
]);

const navigateNext = () => {
  router.push("/BF-ADN/PA/DA/04");
};

const navigateBack = () => {
  router.push("/BF-ADN/PA/DA/01");
};
</script>
