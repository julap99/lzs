<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Butiran Peranan</h2>
          <div class="flex space-x-2">
            <rs-button variant="danger" @click="confirmDelete">
              <Icon name="mdi:delete-outline" class="mr-1" /> Padam
            </rs-button>
          </div>
        </div>
      </template>

      <template #body>
        <FormKit
          type="form"
          v-model="formData"
          :actions="false"
          @submit="handleSubmit"
          :disabled="processing"
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
            />
          </div>

          <!-- Form Actions -->
          <div class="flex justify-end space-x-3 mt-6">
            <rs-button
              variant="primary-outline"
              type="button"
              @click="navigateTo('/BF-PS/PPK/KP')"
            >
              Batal
            </rs-button>
            <rs-button
              variant="primary"
              type="submit"
              :loading="processing"
              @click="handleSubmit"
            >
              Simpan Perubahan
            </rs-button>
          </div>
        </FormKit>
      </template>
    </rs-card>

    <!-- Delete Confirmation Modal -->
    <rs-modal
      v-model="showDeleteModal"
      title="Sahkan Padam Peranan"
      size="md"
      persistent
      position="center"
    >
      <template #body>
        <p>Adakah anda pasti ingin memadam peranan ini?</p>
        <p class="text-danger-500 mt-2">
          Tindakan ini tidak boleh dipulihkan dan akan menjejaskan pengguna yang
          mempunyai peranan ini.
        </p>
      </template>
      <template #footer>
        <div class="flex justify-end space-x-2">
          <rs-button variant="primary-outline" @click="showDeleteModal = false">
            Batal
          </rs-button>
          <rs-button variant="danger" @click="deleteRole" :loading="processing">
            Sahkan Padam
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

definePageMeta({
  title: "Butiran Peranan",
});

const route = useRoute();
const router = useRouter();
const roleId = route.params.id;

const breadcrumb = computed(() => [
  {
    name: "Pentadbir Sistem",
    type: "link",
    path: "/BF-PS",
  },
  {
    name: "Konfigurasi Peranan",
    type: "link",
    path: "/BF-PS/PPK/KP",
  },
  {
    name: "Edit Peranan",
    type: "current",
    path: `/BF-PS/PPK/KP/${roleId.value}`,
  },
]);

// Form data
const formData = ref({
  id: roleId,
  name: "",
  display_name: "",
  description: "",
  status: "active",
});

// Modal control
const showDeleteModal = ref(false);
const processing = ref(false);

// Fetch role data on mounted
onMounted(() => {
  fetchRoleData();
});

// Sample function to fetch role data
const fetchRoleData = () => {
  // In a real app, you would fetch this from an API
  const sampleRoles = {
    1: {
      name: "EKP",
      display_name: "Eksekutif Perkhidmatan Pelanggan",
      description: "Bertanggungjawab mengurus permohonan pelanggan",
      status: "active",
    },
    2: {
      name: "EOAD",
      display_name: "Eksekutif Operasi & Admin",
      description: "Bertanggungjawab untuk operasi harian sistem",
      status: "active",
    },
    3: {
      name: "KOAD",
      display_name: "Ketua Operasi & Admin",
      description: "Ketua unit operasi dan pentadbiran",
      status: "active",
    },
  };

  if (sampleRoles[roleId]) {
    const roleData = sampleRoles[roleId];
    formData.value = {
      ...formData.value,
      name: roleData.name,
      display_name: roleData.display_name,
      description: roleData.description,
      status: roleData.status,
    };
  }
};

// Handle form submission
const handleSubmit = async () => {
  processing.value = true;

  try {
    // In a real app, you would call an API here
    console.log("Updating role:", formData.value);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    alert("Peranan telah dikemaskini");
    navigateTo("/BF-PS/PPK/KP");
  } catch (error) {
    alert("Gagal mengemaskini peranan");
  } finally {
    processing.value = false;
  }
};

// Delete role functions
const confirmDelete = () => {
  showDeleteModal.value = true;
};

const deleteRole = async () => {
  processing.value = true;

  try {
    // In a real app, you would call an API here
    console.log("Deleting role:", roleId);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    alert("Peranan telah dipadam");
    navigateTo("/BF-PS/PPK/KP");
  } catch (error) {
    alert("Gagal memadam peranan");
  } finally {
    processing.value = false;
    showDeleteModal.value = false;
  }
};
</script>
