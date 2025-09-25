<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <h2 class="text-xl font-bold mb-6 text-center">Senarai Kategori Masalah</h2>

    <!-- Filter and Add Button -->
    <div class="flex justify-between items-center mb-4">
      <div>
        <label for="filter" class="mr-2">Tapis Mengikut Tahap Aduan:</label>
        <select
          id="filter"
          v-model="selectedFilter"
          class="border rounded px-3 py-1"
        >
          <option value="">-- Semua Kelas --</option>
          <option value="Merah">Merah</option>
          <option value="Kuning">Kuning</option>
          <option value="Hijau">Hijau</option>
        </select>
      </div>

      <!-- Tambah Kategori Button -->
      <rs-button variant="primary" @click="tambahKategori">
        + Tambah Kategori
      </rs-button>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="table-auto w-full border-collapse border">
        <thead>
          <tr class="bg-gray-100 text-left">
            <th class="px-3 py-2 border">Bil</th>
            <th class="px-3 py-2 border">Tahap Aduan</th>
            <th class="px-3 py-2 border">Nama Kategori Masalah</th>
            <th class="px-3 py-2 border">Status</th>
            <th class="px-3 py-2 border">Tindakan</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(kategori, index) in filteredKategori"
            :key="index"
            class="hover:bg-gray-50"
          >
            <td class="px-3 py-2 border">{{ index + 1 }}</td>
            <td class="px-3 py-2 border">
              <rs-badge :variant="getBadgeVariant(kategori.tahap)">
                {{ kategori.tahap }}
              </rs-badge>
            </td>
            <td class="px-3 py-2 border">{{ kategori.nama }}</td>
            <td class="px-3 py-2 border">{{ kategori.status }}</td>
            <td class="px-3 py-2 border space-x-2">
              <rs-button size="sm" variant="secondary" @click="kemaskiniKategori(kategori)">
                Kemaskini
              </rs-button>
              <rs-button size="sm" variant="secondary" @click="lihatKategori(kategori)">
                Lihat
              </rs-button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

definePageMeta({
  title: "Senarai Kategori Masalah",
  path: "/BF-ADN/PK/KT/01/01",
});

const breadcrumb = ref([
  { name: "Pengurusan SLA", type: "link", path: `/BF-ADN/SLA` },
  { name: "Senarai Kategori Masalah", type: "current", path: "/BF-ADN/PK/KT/01/01" },
]);

// Dropdown filter
const selectedFilter = ref("");

// Data
const kategoriList = ref([
  { tahap: "Merah", nama: "Tiada Tempat Tinggal", status: "Aktif" },
  { tahap: "Kuning", nama: "Kurang Sumber Pendapatan", status: "Aktif" },
  { tahap: "Hijau", nama: "Masalah Sosial Am", status: "Tidak Aktif" },
]);

// Filtered list
const filteredKategori = computed(() => {
  if (!selectedFilter.value) return kategoriList.value;
  return kategoriList.value.filter((k) => k.tahap === selectedFilter.value);
});

// Badge coloring
const getBadgeVariant = (tahap) => {
  if (tahap === "Merah") return "danger";
  if (tahap === "Kuning") return "warning";
  if (tahap === "Hijau") return "success";
  return "secondary";
};

// Button actions
const tambahKategori = () => {
  // ✅ go to /01/02/index.vue
  navigateTo("/BF-ADN/PK/KT/01/02");
};

const kemaskiniKategori = (kategori) => {
  navigateTo(`/BF-ADN/PK/KT/01/04`);
};

const lihatKategori = (kategori) => {
  navigateTo(`/BF-ADN/PK/KT/01/03`);
};
</script>
