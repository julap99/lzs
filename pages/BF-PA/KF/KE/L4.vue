<template>
    <div>
      <LayoutsBreadcrumb :items="breadcrumb" />
  
      <rs-card class="mt-4">
        <template #header>
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold">
               Kemaskini Maklumat Jawatan
            </h2>
          </div>
        </template>
  
        <template #body>
          <div class="p-4">
            <p class="mb-4 text-gray-700">
              Sila isi maklumat kadar elaun bagi Penolong Amil berdasarkan kategori dan jenis elaun:
            </p>
  
            <!-- FormKit Form -->
            <FormKit
              type="form"
              id="allowanceForm"
              :actions="false"
              v-model="form"
            >
              <div class="grid grid-cols-1 md:grid-cols-1 gap-6">
                <!-- Kategori Amil -->
                <FormKit
                  type="text"
                  name="kategoriAmil"
                  label="Kategori Amil"
                  placeholder="Kategori Amil"
                  validation="required"
                  :validation-messages="{ required: 'Sila pilih kategori amil' }"
                  v-model="form.kategoriAmil"
                />
  
                <!-- Jenis Elaun -->
                <FormKit
                  type="text"
                  name="jenisElaun"
                  label="Jenis Elaun"
                  placeholder="Jenis Elaun"
                  validation="required"
                  :validation-messages="{ required: 'Jenis elaun diperlukan' }"
                  v-model="form.jenisElaun"
                />
  
                <!-- Jenis Jawatan -->
                <FormKit
                  type="text"
                  name="jawatan"
                  label="Jenis Jawatan"
                  placeholder="Jenis Jawatan"
                  validation="required"
                  :validation-messages="{ required: 'Jenis jawatan diperlukan' }"
                  v-model="form.jawatan"
                />
  
                <!-- Kadar Elaun -->
                <FormKit
                  type="number"
                  name="kadarElaun"
                  label="Kadar Elaun (RM)"
                  placeholder="0.00"
                  v-model="form.kadarElaun"
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
                  Kemaskini & Hantar
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
      path: "/BF-PA/KF/KE",
    },
  ]);
  
  const form = ref({
    kategoriAmil: 'Padi',
    jenisElaun: 'Elaun Kemaskini',
    jawatan: 'Penolong Amil',
    kadarElaun: 20,
  });
  
  // Simple click handler
  const handleClick = () => {
    alert("Maklumat Elaun Sudah Berjaya Dikemaskini");
    navigateTo("/BF-PA/KF/KE");
  };
  </script> 