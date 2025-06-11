<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Tambah / Kemaskini Jawatan
          </h2>
        </div>
      </template>

      <template #body>
        <div class="p-4">
          <p class="mb-4 text-gray-700">
            Sila isi maklumat jawatan berikut:
          </p>

          <!-- FormKit Form -->
          <FormKit
            type="form"
            id="positionForm"
            :actions="false"
          >
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Nama Jawatan -->
              <FormKit
                type="text"
                name="namaJawatan"
                label="Nama Jawatan"
                placeholder="Contoh: Ketua Penolong Amil Komuniti"
                validation="required"
                :validation-messages="{
                  required: 'Nama jawatan diperlukan',
                }"
              />

              <!-- Kategori Amil -->
              <FormKit
                type="select"
                name="kategoriAmil"
                label="Kategori Amil"
                placeholder="Pilih Kategori Amil"
                :options="[
                  { label: 'Fitrah', value: 'FITRAH' },
                  { label: 'Padi', value: 'PADI' },
                  { label: 'Kariah', value: 'KARIAH' },
                  { label: 'Komuniti', value: 'KOMUNITI' },
                ]"
                validation="required"
                :validation-messages="{
                  required: 'Kategori amil diperlukan',
                }"
              />

              <!-- Status -->
              <FormKit
                type="select"
                name="status"
                label="Status"
                placeholder="Pilih Status"
                :options="[
                  { label: 'Aktif', value: 'AKTIF' },
                  { label: 'Tidak Aktif', value: 'TIDAK_AKTIF' },
                ]"
                validation="required"
                :validation-messages="{
                  required: 'Status diperlukan',
                }"
              />

              <!-- Tempoh Perkhidmatan -->
              <FormKit
                type="date"
                name="tempohPerkhidmatan"
                label="Tempoh Perkhidmatan"
                validation="required"
                :validation-messages="{
                  required: 'Tempoh perkhidmatan diperlukan',
                }"
              />
            </div>

            <!-- Submit Button -->
            <div class="mt-6 flex justify-end space-x-3">
              <rs-button
                variant="primary"
                @click="handleClick"
              >
                Simpan & Hantar
              </rs-button>
            </div>
          </FormKit>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref } from "vue";

definePageMeta({
  title: "Tambah / Kemaskini Jawatan",
  description: "Tambah atau kemaskini maklumat jawatan",
});

const breadcrumb = ref([
  {
    name: "Konfigurasi",
    type: "link",
    path: "/BF-PA/KF",
  },
  {
    name: "Jawatan",
    type: "link",
    path: "/BF-PA/KF/KJ",
  },
  {
    name: "Tambah / Kemaskini Jawatan",
    type: "current",
    path: "/BF-PA/KF/KJ/01",
  },
]);

// Simple click handler
const handleClick = () => {
  alert("Maklumat sudah berjaya dihantar");
  navigateTo("/BF-PA/KF/KJ/02");
};
</script> 