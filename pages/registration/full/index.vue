<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Pendaftaran Penuh</h2>
        </div>
      </template>

      <template #body>
        <div class="max-w-2xl mx-auto text-center space-y-6">
          <p class="text-gray-600">
            Laman ini adalah untuk pendaftaran penuh sebelum meneruskan proses aduan anda.
          </p>
          
          <div class="flex justify-center mt-8">
            <rs-button
              variant="primary"
              class="min-w-[200px]"
              @click="navigateNext"
            >
              Teruskan
            </rs-button>
          </div>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

definePageMeta({
  title: "Pendaftaran Penuh",
});

const router = useRouter();

const breadcrumb = ref([
  {
    name: "Pengurusan Aduan",
    type: "link",
    path: "/BF-ADN/PA/DA/01",
  },
  {
    name: "Pendaftaran Penuh",
    type: "current",
    path: "/registration/full",
  },
]);

const navigateNext = () => {
  router.push("/BF-ADN/PA/DA/04");
};
</script> 