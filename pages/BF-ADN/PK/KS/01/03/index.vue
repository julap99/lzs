<template>
  <div>
    <!-- Breadcrumb -->
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Form Card -->
    <rs-card>
      <template #header>
        Kemaskini SLA – {{ slaForm.tahapAduan }}
      </template>

      <template #body>
        <!-- Tahap Aduan -->
        <div class="mb-4">
          <label class="block font-medium mb-1">Tahap Aduan</label>
          <input
            v-model="slaForm.tahapAduan"
            type="text"
            class="w-full border rounded p-2 bg-gray-100"
            disabled
          />
        </div>

        <!-- Tempoh SLA (Jam) -->
        <div class="mb-4">
          <label class="block font-medium mb-1">Tempoh SLA (Jam)</label>
          <input
            v-model="slaForm.tempoh"
            type="number"
            class="w-full border rounded p-2"
          />
        </div>

        <!-- Status Konfigurasi -->
        <div class="mb-4">
          <label class="block font-medium mb-1">Status Konfigurasi</label>
          <div class="flex items-center gap-2">
            <input
              id="status"
              v-model="slaForm.status"
              type="checkbox"
              class="h-5 w-5"
            />
            <span>{{ slaForm.status ? "Aktif" : "Tidak Aktif" }}</span>
          </div>
        </div>

        <!-- Tarikh Mula Kuasa Baharu -->
        <div class="mb-4">
          <label class="block font-medium mb-1">Tarikh Mula Kuasa Baharu</label>
          <input
            v-model="slaForm.tarikhMula"
            type="date"
            class="w-full border rounded p-2"
          />
        </div>

        <!-- Catatan Kemaskini -->
        <div class="mb-4">
          <label class="block font-medium mb-1">Catatan Kemaskini</label>
          <textarea
            v-model="slaForm.catatan"
            rows="3"
            class="w-full border rounded p-2"
            placeholder="Contoh: Peningkatan tempoh SLA kerana bilangan kes meningkat..."
          ></textarea>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-3 justify-end">
          <rs-button variant="secondary" @click="resetForm">
            Set Semula
          </rs-button>
          <rs-button variant="primary" @click="submitForm">
            Hantar Permohonan Kemaskini
          </rs-button>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

definePageMeta({
  title: "Kemaskini SLA",
  path: "/BF-ADN/PK/KS/01/03",
});

const router = useRouter();

const breadcrumb = ref([
  { name: "Pengurusan SLA", type: "link", path: `/BF-ADN/SLA` },
  { name: "Senarai SLA", type: "link", path: `/BF-ADN/PK/KS/01/01` },
  { name: "Butiran SLA", type: "link", path: `/BF-ADN/PK/KS/01/02` },
  { name: "Kemaskini SLA", type: "current", path: "/BF-ADN/PK/KS/01/03" },
]);

// Prefilled SLA form (same as Page 02)
const slaForm = ref({
  tahapAduan: "Kelas 1 (Merah)",
  tempoh: 48,
  status: true,
  tarikhMula: "2025-09-01",
  catatan: "",
});

// Reset form
const resetForm = () => {
  slaForm.value.tempoh = 48;
  slaForm.value.status = true;
  slaForm.value.tarikhMula = "2025-09-01";
  slaForm.value.catatan = "";
};

// Submit form
const submitForm = () => {
  console.log("Submitted SLA update:", slaForm.value);
  alert("Permohonan kemaskini telah dihantar!");
  router.push("/BF-ADN/PK/KS/01/02");
};
</script>
