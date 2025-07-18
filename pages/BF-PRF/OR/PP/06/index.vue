<template>
  <div>
    <!-- Breadcrumb -->
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Card: Kemaskini Permohonan -->
    <rs-card>
      <template #header>Kemaskini Permohonan</template>

      <template #body>
        <!-- Section 1: Maklumat Permohonan (Read-only) -->
        <div class="space-y-2 mb-6">
          <rs-table
            :data="[permohonan]"
            :showNoColumn="false"
            :pageSize="1"
            :options="{ hover: false }"
          >
            <template v-slot:idPermohonan="data">
              {{ data.text }}
            </template>
            <template v-slot:namaPemohon="data">
              {{ data.text }}
            </template>
            <template v-slot:tarikhPermohonan="data">
              {{ formatDate(data.text) }}
            </template>
            <template v-slot:statusPermohonan="data">
              <rs-badge :variant="getStatusVariant(data.text)">
                {{ data.text }}
              </rs-badge>
            </template>
          </rs-table>
        </div>

        <!-- Section 2: Ulasan EOAD (Read-only) -->
        <div class="mb-6">
          <label class="block font-semibold mb-1">Ulasan EOAD</label>
          <div class="p-3 border rounded bg-gray-50">
            {{ ulasanEoad }}
          </div>
        </div>

        <!-- Section 3: Borang Kemaskini -->
        <div class="mb-6 space-y-4">
          <rs-input
            v-model="formData.field1"
            label="Alamat Organisasi"
            placeholder="Masukkan alamat organisasi"
            :rules="['required']"
          />
          <rs-input
            v-model="formData.field2"
            label="No Telefon Organisasi"
            placeholder="Masukkan no telefon organisasi"
            :rules="['required']"
          />
        </div>

        <!-- Section 4: Upload Dokumen (optional) -->
        <div class="mb-6">
          <rs-upload
            v-model="uploadedFile"
            label="Muat Naik Dokumen Terkini (jika perlu)"
          />
        </div>

        <!-- Section 5: Action Button -->
        <div class="flex gap-2">
          <rs-button variant="primary" @click="submitForm" :disabled="loading || isSubmitted">
            <span v-if="!loading">Hantar Semula Permohonan</span>
            <span v-else>Memuatkan...</span>
          </rs-button>
          <rs-button variant="secondary" @click="cancelForm" :disabled="loading || isSubmitted">
            Batal
          </rs-button>
        </div>

        <!-- Success Message -->
        <div v-if="successMessage" class="mt-4 text-green-600 font-semibold">
          {{ successMessage }}
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref } from "vue";

definePageMeta({
  title: "Kemaskini Permohonan",
});

// Breadcrumb
const breadcrumb = ref([
  {
    name: "Home",
    type: "link",
    path: `/`,
  },
  {
    name: "Kemaskini Permohonan",
    type: "current",
    path: "/BF-PRF/OR/PP/06",
  },
]);

// Simulated data → ganti dengan API GET permohonan
const permohonan = ref({
  idPermohonan: "PRF-2025-001",
  namaPemohon: "Ahmad bin Ali",
  tarikhPermohonan: "2025-06-12",
  statusPermohonan: "Perlu Pembetulan",
});

// Ulasan EOAD → ganti dengan API GET ulasan
const ulasanEoad = ref(
  "Sila kemaskini alamat organisasi & no telefon. Muat naik dokumen terkini jika perlu."
);

// Form data
const formData = ref({
  field1: "",
  field2: "",
});

// Upload Dokumen
const uploadedFile = ref(null);

// Status handling
const loading = ref(false);
const successMessage = ref("");
const isSubmitted = ref(false);

// Helper
const formatDate = (date) => {
  return new Date(date).toLocaleDateString("ms-MY", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const getStatusVariant = (status) => {
  const variants = {
    "Perlu Pembetulan": "warning",
    "Telah Dikemaskini": "success",
    Diluluskan: "success",
  };
  return variants[status] || "default";
};

// Actions
const submitForm = async () => {
  loading.value = true;
  successMessage.value = "";

  try {
    // Simulate API update permohonan
    await fetch("/api/update-permohonan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        idPermohonan: permohonan.value.idPermohonan,
        field1: formData.value.field1,
        field2: formData.value.field2,
        uploadedFile: uploadedFile.value, // implement as needed
      }),
    });

    // Simulate Audit Trail
    await fetch("/api/audit-trail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        idPermohonan: permohonan.value.idPermohonan,
        userId: "Anonymous", // from token if available
        tarikhMasaKemaskini: new Date().toISOString(),
        statusLama: permohonan.value.statusPermohonan,
        statusBaru: "Telah Dikemaskini",
        perubahan: {
          field1: formData.value.field1,
          field2: formData.value.field2,
        },
      }),
    });

    // Update status local
    permohonan.value.statusPermohonan = "Telah Dikemaskini";
    successMessage.value =
      "Permohonan telah dikemaskini & dihantar semula kepada EOAD untuk semakan.";

    // Lock form
    isSubmitted.value = true;
  } catch (error) {
    console.error("Error during update:", error);
    successMessage.value = "Ralat semasa kemaskini. Sila cuba lagi.";
  } finally {
    loading.value = false;
  }
};

const cancelForm = () => {
  // Redirect to home / close page
  window.location.href = "/";
};
</script>

<style lang="scss" scoped></style>
