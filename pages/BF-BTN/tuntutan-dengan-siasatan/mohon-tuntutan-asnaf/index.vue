<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

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
    path: "/BF-BTN/tuntutan-dengan-siasatan/mohon-tuntutan-asnaf",
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
