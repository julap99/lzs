<template>
  <div>
    <LayoutsBreadcrumb />
    <rs-card>
      <template #header>
        <h5>Pengesanan Tahap Aduan</h5>
      </template>
      <template #body>
        <div class="text-center">
          <Icon
            name="material-symbols:info-outline"
            class="text-blue-500 text-5xl mb-4"
          />
          <h3 class="text-lg font-medium mb-2">
            Sistem NAS Mengenalpasti Tahap Aduan
          </h3>
          <div class="max-w-2xl mx-auto text-left space-y-4 mb-6">
            <p class="text-gray-600">
              Sistem NAS akan mengenalpasti tahap aduan anda berdasarkan
              kriteria yang ditetapkan:
            </p>
            <div class="space-y-3">
              <div class="flex items-center gap-2">
                <div class="w-4 h-4 rounded-full bg-red-500"></div>
                <p class="text-gray-700">
                  <span class="font-medium">Merah:</span> Terus ke proses Cipta
                  Profil
                </p>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-4 h-4 rounded-full bg-yellow-500"></div>
                <p class="text-gray-700">
                  <span class="font-medium">Kuning:</span> Perlu mendaftar
                  secara pantas
                </p>
              </div>
              <div class="flex items-center gap-2">
                <div class="w-4 h-4 rounded-full bg-green-500"></div>
                <p class="text-gray-700">
                  <span class="font-medium">Hijau:</span> Perlu mendaftar secara
                  lengkap
                </p>
              </div>
            </div>
          </div>
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
