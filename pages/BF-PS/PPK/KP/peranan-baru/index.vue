<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Tambah Peranan Baru</h2>
        </div>
      </template>

      <template #body>
        <FormKit
          type="form"
          v-model="formData"
          @submit="handleSubmit"
          :disabled="processing"
          :actions="false"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Role Name -->
            <FormKit
              type="text"
              name="name"
              label="Nama Peranan"
              validation="required"
              placeholder="Contoh: EKP"
              help="Masukkan kod singkatan peranan"
            />

            <!-- Display Name -->
            <FormKit
              type="text"
              name="display_name"
              label="Nama Paparan"
              validation="required"
              placeholder="Contoh: Eksekutif Perkhidmatan Pelanggan"
              help="Nama penuh peranan untuk paparan"
            />

            <!-- Description -->
            <FormKit
              type="textarea"
              name="description"
              label="Deskripsi"
              validation="required"
              placeholder="Huraian fungsi peranan ini"
              rows="3"
            />

            <!-- Status -->
            <FormKit
              type="select"
              name="status"
              label="Status"
              validation="required"
              :options="[
                { label: 'Aktif', value: 'active' },
                { label: 'Tidak Aktif', value: 'inactive' },
              ]"
              :value="'active'"
            />
          </div>

          <!-- Form Actions -->
          <!-- <div class="flex justify-end space-x-3 mt-6">
            <rs-button
              variant="primary-outline"
              type="button"
              @click="navigateTo('/BF-PS/PPK/KP')"
            >
              Batal
            </rs-button>
            <rs-button
              variant="primary"
              type="button"
              :loading="processing"
              @click="handleSubmit"
            >
              Simpan
            </rs-button>
          </div> -->

          <div class="flex justify-end space-x-3 mt-6">
            <rs-button
              variant="primary-outline"
              @click="navigateTo('/BF-PS/PPK/KP')"
              >Batal</rs-button
            >
            <FormKit type="submit" label="Simpan" />
          </div>
        </FormKit>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

definePageMeta({
  title: "Tambah Peranan Baru",
});

const router = useRouter();

const breadcrumb = ref([
  {
    name: "Pentadbiran Sistem",
    type: "link",
    path: "/admin/roles",
  },
  {
    name: "Konfigurasi Peranan",
    type: "link",
    path: "/admin/roles",
  },
  {
    name: "Tambah Peranan Baru",
    type: "current",
    path: "/admin/roles/create",
  },
]);

// Form data with defaults
const formData = ref({
  name: "",
  display_name: "",
  description: "",
  status: "active",
});

const processing = ref(false);

// Handle form submission
const handleSubmit = async () => {
  processing.value = true;

  try {
    // In a real app, you would call an API here
    console.log("Creating new role:", formData.value);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    alert("Peranan baru telah dicipta");
    navigateTo("/BF-PS/PPK/KP");
  } catch (error) {
    alert("Gagal mencipta peranan baru");
  } finally {
    processing.value = false;
  }
};
</script>
