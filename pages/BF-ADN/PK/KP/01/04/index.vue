<template>
  <div>
    <!-- Breadcrumb -->
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Title -->
    <h2 class="text-xl font-bold mb-6">Kemaskini Konfigurasi Penutupan Aduan</h2>

    <!-- Form -->
    <div class="border rounded p-4 bg-white shadow">
      <h3 class="font-semibold text-lg mb-4 bg-gray-100 p-2 rounded">Maklumat Konfigurasi</h3>

      <form @submit.prevent="kemaskiniKonfigurasi">
        <!-- Sebab Penutupan -->
        <div class="mb-4">
          <label class="block font-medium mb-1">Sebab Penutupan</label>
          <input
            v-model="form.sebab"
            type="text"
            class="w-full border rounded p-2"
            placeholder="Contoh: Bantuan telah diterima daripada agensi lain"
          />
        </div>

        <!-- Status -->
        <div class="mb-4">
          <label class="block font-medium mb-1">Status</label>
          <div class="flex items-center space-x-2">
            <input
              type="checkbox"
              v-model="form.status"
              id="status"
              class="form-checkbox"
            />
            <label for="status">Aktif</label>
          </div>
        </div>

        <!-- Tarikh Mula Kuasa -->
        <div class="mb-4">
          <label class="block font-medium mb-1">Tarikh Mula Kuasa</label>
          <input
            v-model="form.tarikh"
            type="date"
            class="w-full border rounded p-2"
          />
        </div>

        <!-- Catatan -->
        <div class="mb-4">
          <label class="block font-medium mb-1">Catatan</label>
          <textarea
            v-model="form.catatan"
            class="w-full border rounded p-2"
            placeholder="Contoh: Digunakan jika bantuan telah diproses oleh agensi luar"
          ></textarea>
        </div>

        <!-- Buttons -->
        <div class="flex space-x-2">
          <button
            type="submit"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Kemaskini
          </button>
          <NuxtLink
            to="/BF-ADN/KT/KP/01/03"
            class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            Batal
          </NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

definePageMeta({
  title: "Kemaskini Konfigurasi Penutupan Aduan",
  path: "/BF-ADN/PK/KP/01/04",
});

const breadcrumb = ref([
  { name: "Pengurusan SLA", type: "link", path: "/BF-ADN/SLA" },
  { name: "Senarai Konfigurasi Penutupan Aduan", type: "link", path: "/BF-ADN/KT/KP/01/01" },
  { name: "Butiran Konfigurasi", type: "link", path: "/BF-ADN/KT/KP/01/03" },
  { name: "Kemaskini", type: "current", path: "/BF-ADN/KT/KP/01/04" },
]);

const form = ref({
  sebab: "Bantuan telah diterima daripada agensi lain",
  status: true,
  tarikh: "2024-01-01",
  catatan: "Digunakan jika bantuan telah diproses oleh agensi luar",
});

const kemaskiniKonfigurasi = () => {
  alert("Konfigurasi berjaya dikemaskini!");
  console.log("Data dikemaskini:", form.value);
};
</script>
