<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Tambah Dimensi Baharu</h2>
        </div>
      </template>

      <template #body>
        <FormKit
          type="form"
          :actions="false"
          @submit="submitForm"
          :classes="{
            messages: 'mb-4',
            form: 'space-y-6',
          }"
        >
          <!-- Nama Dimensi Field -->
          <FormKit
            type="text"
            name="nama"
            label="Nama Dimensi"
            placeholder="Masukkan nama dimensi"
            validation="required"
            :validation-messages="{
              required: 'Nama dimensi diperlukan',
            }"
            help="Contoh: Umur, Pendidikan, Kesihatan"
          />

          <!-- Keterangan Field -->
          <FormKit
            type="textarea"
            name="keterangan"
            label="Keterangan"
            placeholder="Masukkan keterangan dimensi"
            rows="3"
          />

          <!-- Status Field -->
          <FormKit
            type="select"
            name="status"
            label="Status"
            :options="statusOptions"
            validation="required"
            :validation-messages="{
              required: 'Status diperlukan',
            }"
          />

          <!-- Form Actions -->
          <div class="flex justify-end space-x-3 pt-6">
            <rs-button
              variant="primary-outline"
              type="button"
              @click="navigateTo('/BF-PRF/KF/MD/admin')"
            >
              Batal
            </rs-button>
            <rs-button
              variant="primary"
              type="submit"
              :loading="processing"
              @click="submitForm"
            >
              Simpan
            </rs-button>
          </div>
        </FormKit>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
definePageMeta({
  title: "Tambah Dimensi Baharu",
});

const breadcrumb = ref([
  {
    name: "Profiling",
    type: "link",
    path: "/BF-PRF/MD/admin",
  },
  {
    name: "Konfigurasi Multidimensi",
    type: "link",
    path: "/BF-PRF/MD/admin",
  },
  {
    name: "Tambah Baharu",
    type: "current",
    path: "/BF-PRF/MD/admin/tambah",
  },
]);

const statusOptions = [
  { label: "Aktif", value: "Aktif" },
  { label: "Tidak Aktif", value: "Tidak Aktif" },
];

const processing = ref(false);

const submitForm = async (formData) => {
  processing.value = true;

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    alert("Dimensi berhasil ditambahkan");
    navigateTo("/BF-PRF/KF/MD/admin");
  } catch (error) {
    alert("Gagal menambahkan dimensi");
    console.error(error);
  } finally {
    processing.value = false;
  }
};
</script>
