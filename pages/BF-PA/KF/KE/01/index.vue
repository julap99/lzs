<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Tambah / Kemaskini Maklumat Jawatan
          </h2>
        </div>
      </template>

      <template #body>
        <div class="p-4">
          <p class="mb-4 text-gray-700">
            Sila isi maklumat kadar elaun bagi Penolong Amil berdasarkan kategori dan jenis aktiviti:
          </p>

          <!-- FormKit Form -->
          <FormKit
            type="form"
            id="allowanceForm"
            :actions="false"
          >
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  required: 'Sila pilih kategori amil',
                }"
              />

              <!-- Jawatan -->
              <FormKit
                type="text"
                name="jawatan"
                label="Jawatan"
                placeholder="Masukkan jawatan"
                validation="required"
                :validation-messages="{
                  required: 'Jawatan diperlukan',
                }"
              />

              <!-- Jenis Aktiviti -->
              <FormKit
                type="select"
                name="jenisAktiviti"
                label="Jenis Aktiviti"
                placeholder="Pilih Jenis Aktiviti"
                :options="[
                  { label: 'Mesyuarat', value: 'MESYUARAT' },
                  { label: 'Program Luar', value: 'PROGRAM_LUAR' },
                  { label: 'Bancian', value: 'BANCIAN' },
                  { label: 'Aktiviti Rasmi Lain', value: 'AKTIVITI_RASMI' },
                ]"
                validation="required"
                :validation-messages="{
                  required: 'Jenis aktiviti diperlukan',
                }"
              />

              <!-- Kadar Elaun -->
              <FormKit
                type="number"
                name="kadarElaun"
                label="Kadar Elaun (RM)"
                placeholder="0.00"
                validation="required|number|min:0"
                :validation-messages="{
                  required: 'Kadar elaun diperlukan',
                  number: 'Sila masukkan nilai yang sah',
                  min: 'Kadar elaun tidak boleh negatif',
                }"
              />
            </div>

            <!-- Submit Button -->
            <div class="mt-6 flex justify-end space-x-3">
              <rs-button
                variant="primary"
                @click="handleClick"
              >
                Hantar
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
  title: "Tambah / Kemaskini Maklumat Jawatan",
  description: "Konfigurasi kadar elaun bagi Penolong Amil",
});

const breadcrumb = ref([
  {
    name: "Konfigurasi",
    type: "link",
    path: "/BF-PA/KF",
  },
  {
    name: "Elaun",
    type: "link",
    path: "/BF-PA/KF/KE",
  },
  {
    name: "Tambah / Kemaskini Maklumat Jawatan",
    type: "current",
    path: "/BF-PA/KF/KE/01",
  },
]);

// Simple click handler
const handleClick = () => {
  alert("Maklumat sudah berjaya dihantar");
  navigateTo("/BF-PA/KF/KE/02");
};
</script> 