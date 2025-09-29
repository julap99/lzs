<template>
  <div>
    <!-- Breadcrumb + Top Bar -->
    <div class="flex justify-between items-center mb-6">
      <LayoutsBreadcrumb :items="breadcrumb" />
      <NuxtLink to="/BF-ADN/PK/KP/01/01">
        <rs-button variant="secondary" size="sm">Kembali</rs-button>
      </NuxtLink>
    </div>

    <!-- Title -->
    <h2 class="text-xl font-bold mb-6">Tambah Konfigurasi Penutupan Aduan</h2>

    <!-- Form Card -->
    <rs-card>
      <template #header>Maklumat Konfigurasi</template>
      <template #body>
        <form @submit.prevent="simpanKonfigurasi" class="space-y-5">
          <!-- Sebab Penutupan -->
          <div>
            <label class="block font-medium mb-1">Sebab Penutupan</label>
            <input
              v-model="form.sebab"
              type="text"
              placeholder="Contoh: Bantuan telah diterima daripada agensi lain"
              class="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-200"
              required
            />
          </div>

          <!-- Status -->
          <div>
            <label class="block font-medium mb-1">Status</label>
            <div class="flex items-center gap-2">
              <input
                id="status"
                type="checkbox"
                v-model="form.status"
                class="h-5 w-5"
              />
              <span>{{ form.status ? "Aktif" : "Tidak Aktif" }}</span>
            </div>
          </div>

          <!-- Tarikh Mula Kuasa -->
          <div>
            <label class="block font-medium mb-1">Tarikh Mula Kuasa</label>
            <input
              v-model="form.tarikh"
              type="date"
              class="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-200"
              required
            />
          </div>

          <!-- Catatan -->
          <div>
            <label class="block font-medium mb-1">Catatan</label>
            <textarea
              v-model="form.catatan"
              placeholder="Contoh: Digunakan jika bantuan telah diproses oleh agensi luar"
              class="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-200"
              rows="3"
            ></textarea>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end gap-3">
            <rs-button type="button" variant="secondary" @click="batal">
              Batal
            </rs-button>
            <rs-button type="submit" variant="primary">
              Hantar Permohonan
            </rs-button>
          </div>
        </form>
      </template>
    </rs-card>
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

const simpanKonfigurasi = () => {
  console.log("Data disimpan:", form.value);
  alert("Konfigurasi berjaya disimpan!");
  navigateTo("/BF-ADN/PK/KP/01/01");
};

const batal = () => {
  navigateTo("/BF-ADN/PK/KP/01/01");
};
</script>
