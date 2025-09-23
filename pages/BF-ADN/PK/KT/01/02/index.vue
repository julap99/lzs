<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <h2 class="text-xl font-bold mb-6 text-center">Tambah Kategori Masalah</h2>

    <div class="max-w-2xl mx-auto bg-white shadow rounded-lg p-6">
      <form @submit.prevent="hantarPermohonan" class="space-y-4">
        <!-- Tahap Aduan -->
        <div>
          <label for="tahap" class="block font-medium mb-1">Tahap Aduan</label>
          <select
            id="tahap"
            v-model="form.tahap"
            class="w-full border rounded px-3 py-2"
            required
          >
            <option value="">-- Sila Pilih --</option>
            <option value="Merah">Merah</option>
            <option value="Kuning">Kuning</option>
            <option value="Hijau">Hijau</option>
          </select>
        </div>

        <!-- Nama Kategori Masalah -->
        <div>
          <label for="nama" class="block font-medium mb-1">Nama Kategori Masalah</label>
          <input
            id="nama"
            type="text"
            v-model="form.nama"
            placeholder="Contoh: Tiada Tempat Tinggal"
            class="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <!-- Tarikh Kuat Kuasa -->
        <div>
          <label for="tarikh" class="block font-medium mb-1">Tarikh Kuat Kuasa</label>
          <input
            id="tarikh"
            type="date"
            v-model="form.tarikh"
            class="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <!-- Status -->
        <div>
          <label for="status" class="block font-medium mb-1">Status</label>
          <select
            id="status"
            v-model="form.status"
            class="w-full border rounded px-3 py-2"
            required
          >
            <option value="Aktif">Aktif</option>
            <option value="Tidak Aktif">Tidak Aktif</option>
          </select>
        </div>

        <!-- Catatan Permohonan -->
        <div>
          <label for="catatan" class="block font-medium mb-1">Catatan Permohonan</label>
          <textarea
            id="catatan"
            v-model="form.catatan"
            placeholder="Nyatakan tujuan atau sebab tambah kategori"
            class="w-full border rounded px-3 py-2"
            rows="3"
          ></textarea>
        </div>

        <!-- Submit -->
        <div>
          <button
            type="submit"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
          >
            Hantar Permohonan
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

definePageMeta({
  title: "Tambah Kategori Masalah",
});

const breadcrumb = ref([
  { name: "Pengurusan SLA", type: "link", path: `/BF-ADN/SLA` },
  { name: "Kategori Masalah", type: "link", path: `/BF-ADN/PK/KT/01/01` },
  { name: "Tambah Kategori Masalah", type: "current", path: "/BF-ADN/PK/KT/01/02" },
]);

// Form state
const form = ref({
  tahap: "",
  nama: "",
  tarikh: "",
  status: "Aktif",
  catatan: "",
});

// Handle submit
const hantarPermohonan = () => {
  console.log("✅ Data dihantar:", form.value);
  alert("Permohonan berjaya dihantar!");
  // TODO: Add API call to save data
};
</script>
