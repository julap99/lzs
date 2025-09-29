<template>
  <div>
    <!-- Breadcrumb + Kembali button -->
    <div class="flex justify-between items-center mb-6">
      <LayoutsBreadcrumb :items="breadcrumb" />
      <NuxtLink to="/BF-ADN/PK/KS/02/01">
        <rs-button variant="secondary" size="sm">
          Kembali
        </rs-button>
      </NuxtLink>
    </div>

    <!-- Two-column layout -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <!-- Card Tindakan -->
      <rs-card>
        <template #header>
          <span class="font-semibold">Tindakan</span>
        </template>
        <template #body>
          <div class="space-y-4">
            <!-- Status dropdown -->
            <div>
              <label class="block font-medium mb-1">Status Permohonan</label>
              <select v-model="tindakan.status" class="w-full border rounded p-2">
                <option disabled value="">Pilih status</option>
                <option value="Lengkap">Lengkap</option>
                <option value="Tidak Lengkap">Tidak Lengkap</option>
              </select>
            </div>

            <!-- Catatan -->
            <div>
              <label class="block font-medium mb-1">Catatan Pegawai</label>
              <textarea
                v-model="tindakan.catatan"
                rows="3"
                class="w-full border rounded p-2"
                placeholder="Masukkan catatan pegawai (wajib jika Tidak Lengkap)"
              ></textarea>
            </div>

            <!-- Tarikh -->
            <div>
              <label class="block font-medium mb-1">Tarikh Semak</label>
              <input
                v-model="tindakan.tarikh"
                type="date"
                class="w-full border rounded p-2"
              />
            </div>

            <!-- Action buttons -->
            <div class="flex flex-col gap-2 mt-4">
              <rs-button variant="success" @click="sahkanKelulusan">
                ✔ Sahkan Kelulusan
              </rs-button>
              <NuxtLink to="/BF-ADN/PK/KS/02/01">
                <rs-button variant="secondary">
                  ← Batal / Kembali
                </rs-button>
              </NuxtLink>
            </div>
          </div>
        </template>
      </rs-card>

      <!-- Right column: Konfigurasi + Permohonan -->
      <div class="space-y-6">
        <!-- Konfigurasi SLA Semasa -->
        <rs-card>
          <template #header>
            <span class="font-semibold">Konfigurasi SLA Semasa</span>
          </template>
          <template #body>
            <div class="space-y-2">
              <p><b>Tahap Aduan:</b> {{ slaSemasa.tahapAduan }}</p>
              <p><b>Tempoh SLA (Jam):</b> {{ slaSemasa.tempoh }}</p>
              <p><b>Status:</b> {{ slaSemasa.status }}</p>
            </div>
          </template>
        </rs-card>

        <!-- Permohonan Baharu -->
        <rs-card>
          <template #header>
            <span class="font-semibold">Permohonan Baharu</span>
          </template>
          <template #body>
            <div class="space-y-2">
              <p><b>Tahap Aduan:</b> {{ slaBaru.tahapAduan }}</p>
              <p><b>Tempoh SLA (Jam):</b> {{ slaBaru.tempoh }}</p>
              <p><b>Status:</b> {{ slaBaru.status }}</p>
              <p><b>Tarikh Mula:</b> {{ formatDate(slaBaru.tarikhMula) }}</p>
              <p><b>Catatan:</b> {{ slaBaru.catatan }}</p>
            </div>
          </template>
        </rs-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

definePageMeta({
  title: "Semakan & Kelulusan SLA",
});

const breadcrumb = ref([
  { name: "Pengurusan SLA", type: "link", path: `/BF-ADN/SLA` },
  { name: "Senarai Permohonan Kelulusan SLA", type: "link", path: "/BF-ADN/PK/KS/02/01" },
  { name: "Semakan & Kelulusan SLA", type: "current", path: "/BF-ADN/PK/KS/02/02" },
]);

// SLA sekarang
const slaSemasa = ref({
  tahapAduan: "Kelas 1 (Merah)",
  tempoh: 24,
  status: "Aktif",
});

// SLA baru
const slaBaru = ref({
  tahapAduan: "Kelas 1 (Merah)",
  tempoh: 48,
  status: "Aktif",
  tarikhMula: "2025-09-15",
  catatan: "Peningkatan tempoh SLA kerana bilangan kes bertambah",
});

// Tindakan form
const tindakan = ref({
  status: "",
  catatan: "",
  tarikh: "2025-09-25",
});

// Confirm action
const sahkanKelulusan = () => {
  console.log("✅ Kelulusan disahkan:", tindakan.value);
  alert("Kelulusan berjaya disahkan!");
};
</script>
