<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Carian Bantuan</h2>
        </div>
      </template>

      <template #body>
        <FormKit
          type="form"
          @submit="handleSubmit"
          :actions="false"
          class="max-w-2xl mx-auto"
          v-model="formData"
        >
          <div class="grid grid-cols-1 gap-4">
            <!-- No. Bantuan -->
            <FormKit
              type="text"
              name="noBantuan"
              label="No. Bantuan"
              placeholder="Masukkan No. Bantuan"
              validation="required"
              :validation-messages="{
                required: 'Wajib diisi',
              }"
            />

            <!-- Nama Asnaf -->
            <FormKit
              type="text"
              name="namaAsnaf"
              label="Nama Asnaf"
              placeholder="Masukkan Nama Asnaf"
              validation="required"
              :validation-messages="{
                required: 'Wajib diisi',
              }"
            />

            <!-- No. Kad Pengenalan Asnaf -->
            <FormKit
              type="text"
              name="noKpAsnaf"
              label="No. Kad Pengenalan Asnaf"
              placeholder="Masukkan No. Kad Pengenalan Asnaf"
              validation="required"
              :validation-messages="{
                required: 'Wajib diisi',
              }"
            />
          </div>

          <!-- Form Actions -->
          <div class="flex justify-end gap-4 mt-6">
            <rs-button variant="secondary" @click="handleCancel">
              Carian
            </rs-button>
          </div>
        </FormKit>
      </template>
    </rs-card>

    <!-- Import and use the TableComponent here -->
    <TableComponent />
  </div>
</template>

<script setup>
import { ref } from "vue";
import TableComponent from "./TableComponent.vue"; // Make sure the path is correct

definePageMeta({
  title: "Borang Tambah Carian",
  description: "Tambah rekod carian baru",
});

const breadcrumb = ref([
  {
    name: "Pengurusan Bantuan",
    type: "link",
    path: "/BF-BTN/tuntutan-dengan-siasatan",
  },
  {
    name: "Tuntutan",
    type: "link",
    path: "/BF-BTN/tuntutan-dengan-siasatan/carian-tuntutan",
  },
  {
    name: "Mohon Tuntutan",
    type: "current",
    path: "/BF-BTN/tuntutan-dengan-siasatan/carian-tuntutan",
  },
]);

const formData = ref({
  noBantuan: "",
  namaAsnaf: "",
  noKpAsnaf: "",
});

const handleSubmit = async () => {
  // Form submission logic
};

const handleCancel = () => {
  // Handle cancel logic
};
</script>

<style scoped>
/* // Add any custom styles here if needed */
</style>
