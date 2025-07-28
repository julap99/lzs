<template>
  <div class="role-simulator">
    <div class="bg-gray-100 border-b border-gray-200 px-4 py-2">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <Icon name="ph:user-circle" class="text-gray-600" size="20" />
          <span class="text-sm font-medium text-gray-700">Simulasi Peranan:</span>
        </div>
        <div class="flex items-center space-x-2">
          <FormKit
            type="select"
            v-model="selectedRole"
            :options="roleOptions"
            :classes="{ input: '!py-1 !px-2 text-sm' }"
            @change="handleRoleChange"
          />
          <rs-button
            variant="secondary-outline"
            size="sm"
            @click="toggleSimulator"
            :class="{ 'bg-blue-100 text-blue-700': isVisible }"
          >
            <Icon name="ph:eye" class="w-3 h-3 mr-1" />
            {{ isVisible ? 'Sembunyi' : 'Tunjuk' }}
          </rs-button>
        </div>
      </div>
      
      <div v-if="isVisible" class="mt-2 p-3 bg-white border border-gray-200 rounded-lg">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 class="text-sm font-semibold text-gray-900 mb-2">Peranan Semasa:</h4>
            <div class="flex items-center space-x-2">
              <rs-badge :variant="getRoleVariant(currentRole.role)">
                {{ currentRole.label }}
              </rs-badge>
              <span class="text-xs text-gray-600">{{ currentRole.description }}</span>
            </div>
          </div>
          <div>
            <h4 class="text-sm font-semibold text-gray-900 mb-2">Kebolehan:</h4>
            <div class="flex flex-wrap gap-1">
              <rs-badge
                v-for="capability in currentRole.capabilities"
                :key="capability"
                variant="secondary"
                size="sm"
              >
                {{ capability }}
              </rs-badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  initialRole: {
    type: String,
    default: "pyb",
  },
});

const emit = defineEmits(["role-change"]);

const isVisible = ref(false);
const selectedRole = ref(props.initialRole);

const roleOptions = [
  { label: "PYB Institusi", value: "pyb" },
  { label: "Ketua Amil", value: "ketua-amil" },
  { label: "JPPA", value: "jppa" },
  { label: "PT", value: "pt" },
  { label: "Eksekutif", value: "eksekutif" },
  { label: "Ketua Jabatan", value: "ketua-jabatan" },
  { label: "Ketua Divisyen", value: "ketua-divisyen" },
  { label: "Penolong Amil", value: "penolong-amil" },
];

const roleData = {
  pyb: {
    role: "pyb",
    label: "PYB Institusi",
    description: "Pengurusan Yayasan Baitulmal",
    capabilities: ["Daftar Calon", "Lihat Senarai", "Kemaskini Maklumat"],
  },
  "ketua-amil": {
    role: "ketua-amil",
    label: "Ketua Amil",
    description: "Ketua Amil Institusi",
    capabilities: ["Lihat Senarai", "Semak Calon", "Kelulusan Awal"],
  },
  jppa: {
    role: "jppa",
    label: "JPPA",
    description: "Jawatankuasa Penolong Penolong Amil",
    capabilities: ["Saringan", "Semakan", "Pengesahan"],
  },
  pt: {
    role: "pt",
    label: "PT",
    description: "Pegawai Tadbir",
    capabilities: ["Semakan PT", "Pengesahan Awal", "Hantar ke Eksekutif"],
  },
  eksekutif: {
    role: "eksekutif",
    label: "Eksekutif",
    description: "Sokongan Eksekutif",
    capabilities: ["Sokongan", "Pengesahan", "Hantar ke Ketua Jabatan"],
  },
  "ketua-jabatan": {
    role: "ketua-jabatan",
    label: "Ketua Jabatan",
    description: "Pengesahan Ketua Jabatan",
    capabilities: ["Pengesahan", "Kelulusan", "Hantar ke Ketua Divisyen"],
  },
  "ketua-divisyen": {
    role: "ketua-divisyen",
    label: "Ketua Divisyen",
    description: "Kelulusan Akhir",
    capabilities: ["Kelulusan Akhir", "Pelantikan", "Status Akhir"],
  },
  "penolong-amil": {
    role: "penolong-amil",
    label: "Penolong Amil",
    description: "Calon Penolong Amil",
    capabilities: ["Terima Pelantikan", "Kemaskini Profil", "Lihat Status"],
  },
};

const currentRole = computed(() => {
  return roleData[selectedRole.value] || roleData.pyb;
});

const getRoleVariant = (role) => {
  const variants = {
    pyb: "primary",
    "ketua-amil": "secondary",
    jppa: "warning",
    pt: "info",
    eksekutif: "success",
    "ketua-jabatan": "purple",
    "ketua-divisyen": "danger",
    "penolong-amil": "default",
  };
  return variants[role] || "default";
};

const handleRoleChange = () => {
  emit("role-change", selectedRole.value);
};

const toggleSimulator = () => {
  isVisible.value = !isVisible.value;
};

// Expose current role for parent components
defineExpose({
  currentRole: selectedRole,
  roleData: currentRole,
});
</script>

<style scoped>
.role-simulator {
  position: sticky;
  top: 0;
  z-index: 100;
}
</style> 