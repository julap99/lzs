<template>
  <div class="role-simulator">
    <div class="bg-gray-100 border-b border-gray-200 px-4 py-2">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <Icon name="ph:user-circle" class="text-gray-600" size="20" />
          <span class="text-sm font-medium text-gray-700">Simulasi Peranan:</span>
        </div>
        <div class="flex items-center space-x-3">
          <div class="min-w-[200px]">
            <FormKit
              type="select"
              v-model="selectedRole"
              :options="roleOptions"
              :classes="{ 
                input: '!py-1.5 !px-3 text-sm !rounded-md !border-gray-300',
                wrapper: '!min-w-0'
              }"
              @change="handleRoleChange"
            />
          </div>
          <rs-button
            variant="secondary-outline"
            size="sm"
            @click="toggleSimulator"
            :class="{ 'bg-blue-100 text-blue-700 border-blue-300': isVisible }"
            class="!px-3 !py-1.5 !text-sm !whitespace-nowrap"
          >
            <Icon name="ph:eye" class="w-3 h-3 mr-1" />
            {{ isVisible ? 'Sembunyi' : 'Tunjuk' }}
          </rs-button>
        </div>
      </div>
      
      <div v-if="isVisible" class="mt-3 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 class="text-sm font-semibold text-gray-900 mb-3">Peranan Semasa:</h4>
            <div class="flex items-center space-x-3">
              <rs-badge :variant="getRoleVariant(currentRole.role)" class="!text-xs">
                {{ currentRole.label }}
              </rs-badge>
              <span class="text-xs text-gray-600">{{ currentRole.description }}</span>
            </div>
          </div>
          <div>
            <h4 class="text-sm font-semibold text-gray-900 mb-3">Kebolehan:</h4>
            <div class="flex flex-wrap gap-2">
              <rs-badge
                v-for="capability in currentRole.capabilities"
                :key="capability"
                variant="secondary"
                size="sm"
                class="!text-xs"
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
  { label: "1 - PYB Institusi", value: "pyb" },
  { label: "2 - Eksekutif Pengurusan Risiko", value: "eksekutif-pengurusan-risiko" },
  { label: "3 - PT", value: "pt" },
  { label: "4 - Eksekutif", value: "eksekutif" },
  { label: "5 - Ketua Jabatan", value: "ketua-jabatan" },
  { label: "6 - Ketua Divisyen", value: "ketua-divisyen" },
];

const roleData = {
  pyb: {
    role: "pyb",
    label: "PYB Institusi",
    description: "Pendaftaran Calon Penolong Amil",
    capabilities: ["Daftar Calon", "Lihat Senarai", "Kemaskini Maklumat"],
  },
  "eksekutif-pengurusan-risiko": {
    role: "eksekutif-pengurusan-risiko",
    label: "Eksekutif Pengurusan Risiko",
    description: "Saringan Risiko dan Pematuhan",
    capabilities: ["Saringan Risiko", "Pematuhan", "Pengesahan Saringan"],
  },
  pt: {
    role: "pt",
    label: "PT",
    description: "Semakan Dokumen PT",
    capabilities: ["Semakan PT", "Pengesahan Awal", "Hantar ke Eksekutif"],
  },
  eksekutif: {
    role: "eksekutif",
    label: "Eksekutif",
    description: "Sokongan Eksekutif",
    capabilities: ["Sokongan", "Upload Surat Sokongan", "Hantar ke Ketua Jabatan"],
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
    capabilities: ["Kelulusan Akhir", "Pelantikan", "Integrasi NAS"],
  },
};

const currentRole = computed(() => {
  return roleData[selectedRole.value] || roleData.pyb;
});

const getRoleVariant = (role) => {
  const variants = {
    pyb: "primary",
    "eksekutif-pengurusan-risiko": "warning",
    pt: "info",
    eksekutif: "success",
    "ketua-jabatan": "purple",
    "ketua-divisyen": "danger",
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