<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Mohon Bantuan</h2>
        </div>
      </template>

      <template #body>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Navigation Menu -->
          <div class="space-y-4">
            <rs-button
              variant="primary-outline"
              class="w-full justify-start"
              @click="navigateTo('/BF-BTN/PB/mohon-bantuan/borang')"
            >
              <Icon name="material-symbols:edit-document" class="mr-2" />
              Permohonan Bantuan
            </rs-button>
            <rs-button
              variant="primary-outline"
              class="w-full justify-start"
              @click="navigateTo('/BF-BTN/PB/mohon-bantuan/profil')"
            >
              <Icon name="material-symbols:person" class="mr-2" />
              Profil
            </rs-button>
            <rs-button
              variant="primary-outline"
              class="w-full justify-start"
              @click="navigateTo('/BF-BTN/PB/mohon-bantuan/sejarah')"
            >
              <Icon name="material-symbols:history" class="mr-2" />
              Sejarah Permohonan
            </rs-button>
          </div>

          <!-- Welcome Message -->
          <div class="md:col-span-2">
            <div class="bg-gray-50 p-6 rounded-lg">
              <h3 class="text-lg font-medium mb-4">Selamat Datang ke Sistem Mohon Bantuan</h3>
              <p class="text-gray-600 mb-4">
                Sila pilih menu di sebelah kiri untuk:
              </p>
              <ul class="list-disc list-inside space-y-2 text-gray-600">
                <li>Membuat permohonan bantuan baharu</li>
                <li>Mengemaskini profil anda</li>
                <li>Melihat sejarah permohonan anda</li>
              </ul>
            </div>
          </div>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: "Mohon Bantuan",
});

const breadcrumb = ref([
  {
    name: "Pengurusan Bantuan",
    type: "link",
    path: "/BF-BTN/PB/mohon-bantuan",
  },
  {
    name: "Mohon Bantuan",
    type: "current",
    path: "/BF-BTN/PB/mohon-bantuan",
  },
]);
</script>

<style lang="scss" scoped></style>
