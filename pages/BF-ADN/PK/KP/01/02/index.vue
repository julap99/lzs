<template>
  <div>
    <!-- Breadcrumb -->
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Title -->
    <h2 class="text-xl font-bold mb-6">Tambah Konfigurasi Penutupan Aduan</h2>

    <!-- Form Card -->
    <div class="border rounded shadow-sm p-6 bg-white">
      <h3 class="font-semibold text-lg mb-4 bg-gray-100 px-3 py-2 rounded">
        Maklumat Konfigurasi
      </h3>

      <form @submit.prevent="simpanKonfigurasi">
        <!-- Sebab Penutupan -->
        <div class="mb-4">
          <label class="block font-medium mb-1">Sebab Penutupan</label>
          <input
            v-model="form.sebab"
            type="text"
            placeholder="Contoh: Bantuan telah diterima daripada agensi lain"
            class="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <!-- Status -->
        <div class="mb-4">
          <label class="block font-medium mb-1">Status</label>
          <div class="flex items-center space-x-2">
            <input
              id="status"
              type="checkbox"
              v-model="form.status"
              class="toggle-checkbox"
            />
            <label for="status" class="text-sm">
              {{ form.status ? "Aktif" : "Tidak Aktif" }}
            </label>
          </div>
        </div>

        <!-- Tarikh Mula Kuasa -->
        <div class="mb-4">
          <label class="block font-medium mb-1">Tarikh Mula Kuasa</label>
          <input
            v-model="form.tarikh"
            type="date"
            class="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <!-- Catatan -->
        <div class="mb-4">
          <label class="block font-medium mb-1">Catatan</label>
          <textarea
            v-model="form.catatan"
            placeholder="Contoh: Digunakan jika bantuan telah diproses oleh agensi luar"
            class="w-full border rounded px-3 py-2"
            rows="3"
          ></textarea>
        </div>

        <!-- Buttons -->
        <div class="flex space-x-2">
          <button
            type="submit"
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Simpan
          </button>
          <button
            type="button"
            class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            @click="batal"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

definePageMeta({
  title: "Tambah Konfigurasi Penutupan Aduan",
  path: "/BF-ADN/PK/KP/01/02",
});

const breadcrumb = ref([
  { name: "Pengurusan SLA", type: "link", path: "/BF-ADN/SLA" },
  { name: "Senarai Konfigurasi Penutupan Aduan", type: "link", path: "/BF-ADN/PK/KP/01/01" },
  { name: "Tambah Konfigurasi", type: "current", path: "/BF-ADN/PK/KP/01/02" },
]);

const form = ref({
  sebab: "",
  status: true,
  tarikh: "",
  catatan: "",
});

// Save function
const simpanKonfigurasi = () => {
  console.log("Data disimpan:", form.value);
  alert("Konfigurasi berjaya disimpan!");
  navigateTo("/BF-ADN/PK/KP/01/01");
};

// Cancel function
const batal = () => {
  navigateTo("/BF-ADN/PK/KP/01/01");
};
</script>

<style scoped>
.toggle-checkbox {
  width: 18px;
  height: 18px;
}
</style>
