<template>
  <div>
    <!-- Breadcrumb -->
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Page Title -->
    <h2 class="text-xl font-bold mb-6 text-center">Kemaskini Kategori Masalah</h2>

    <!-- Form Card -->
    <div class="max-w-3xl mx-auto bg-white shadow rounded-xl p-6">
      <form @submit.prevent="submitForm" class="space-y-4">

        <!-- Tahap Aduan -->
        <div>
          <label class="block font-medium mb-1">Tahap Aduan</label>
          <select
            v-model="form.tahap"
            class="w-full border rounded px-3 py-2"
          >
            <option value="Kelas 1 (Merah)">Kelas 1 (Merah)</option>
            <option value="Kelas 2 (Kuning)">Kelas 2 (Kuning)</option>
            <option value="Kelas 3 (Hijau)">Kelas 3 (Hijau)</option>
          </select>
        </div>

        <!-- Nama Kategori Masalah -->
        <div>
          <label class="block font-medium mb-1">Nama Kategori Masalah</label>
          <input
            type="text"
            v-model="form.nama"
            class="w-full border rounded px-3 py-2"
          />
        </div>

        <!-- Penerangan -->
        <div>
          <label class="block font-medium mb-1">Penerangan</label>
          <textarea
            v-model="form.penerangan"
            rows="3"
            class="w-full border rounded px-3 py-2"
          ></textarea>
        </div>

        <!-- Status -->
        <div>
          <label class="block font-medium mb-1">Status</label>
          <select
            v-model="form.status"
            class="w-full border rounded px-3 py-2"
          >
            <option value="Aktif">Aktif</option>
            <option value="Tidak Aktif">Tidak Aktif</option>
          </select>
        </div>

        <!-- Catatan Kemaskini -->
        <div>
          <label class="block font-medium mb-1">Catatan Kemaskini</label>
          <textarea
            v-model="form.catatan"
            rows="2"
            placeholder="Contoh: Kemaskini penerangan atau tukar tahap aduan."
            class="w-full border rounded px-3 py-2"
          ></textarea>
        </div>

        <!-- Submit Button -->
        <div class="pt-4">
          <button
            type="submit"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
          >
            Hantar Permohonan Kemaskini
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

definePageMeta({
  title: "Kemaskini Kategori Masalah",
  path: "/BF-ADN/PK/KT/01/04",
});

const breadcrumb = ref([
  { name: "Pengurusan SLA", type: "link", path: "/BF-ADN/SLA" },
  { name: "Senarai Kategori Masalah", type: "link", path: "/BF-ADN/PK/KT/01/01" },
  { name: "Kemaskini Kategori Masalah", type: "current", path: "/BF-ADN/PK/KT/01/04" },
]);

// Form state
const form = ref({
  tahap: "Kelas 1 (Merah)",
  nama: "Tiada Tempat Tinggal",
  penerangan: "Pemohon tidak mempunyai tempat berteduh atau tempat tinggal tetap.",
  status: "Aktif",
  catatan: "",
});

// Handle form submission
const submitForm = () => {
  console.log("Form submitted:", form.value);
  alert("Permohonan kemaskini dihantar!");
};
</script>
