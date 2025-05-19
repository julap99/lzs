<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Butiran Peranan</h2>
        </div>
      </template>

      <template #body>
        <div>
          <!-- Role Details Section -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <p class="text-gray-600">Peranan</p>
              <h3 class="text-lg">{{ roleDetails.peranan }}</h3>
            </div>
            <div>
              <p class="font-semibold text-gray-600">Deskripsi</p>
              <h3 class="text-lg">{{ roleDetails.deskripsi }}</h3>
            </div>
            <div>
              <p class="font-semibold text-gray-600">Status</p>
              <rs-badge :variant="getStatusVariant(roleDetails.status)">
                {{ roleDetails.status }}
              </rs-badge>
            </div>
            <div>
              <p class="font-semibold text-gray-600">Tarikh Dicipta</p>
              <h3 class="text-lg">{{ formatDate(roleDetails.createdAt) }}</h3>
            </div>
          </div>

          <!-- Tabs -->
          <rs-tab v-model="activeTab" class="mt-4">
            <rs-tab-item title="Modul">
              <!-- Module Content -->
              <div class="mt-4">
                <div class="flex justify-between items-center mb-4">
                  <h3 class="text-lg font-semibold">Modul & Submodul</h3>
                  <rs-button
                    variant="primary-outline"
                    size="sm"
                    @click="exportModuleDetails"
                    :disabled="!modules.length"
                  >
                    <Icon name="mdi:file-export" class="mr-1" size="1rem" />
                    Eksport
                  </rs-button>
                </div>

                <rs-empty-state
                  v-if="!modules.length"
                  label="Tiada modul ditemui"
                />

                <rs-table
                  v-else
                  :data="modules"
                  :options="{
                    variant: 'default',
                    hover: true,
                    responsive: true,
                  }"
                >
                  <template v-slot:tindakan="data">
                    <div class="flex flex-wrap gap-2">
                      <rs-badge
                        v-for="action in data.text"
                        :key="action"
                        variant="outline"
                      >
                        {{ action }}
                      </rs-badge>
                    </div>
                  </template>
                </rs-table>
              </div>
            </rs-tab-item>

            <rs-tab-item title="Audit Trail">
              <!-- Audit Trail Content -->
              <div class="mt-4">
                <div class="flex justify-between items-center mb-4">
                  <h3 class="text-lg font-semibold">Sejarah Perubahan</h3>
                  <rs-button
                    variant="primary-outline"
                    size="sm"
                    @click="exportAuditTrail"
                    :disabled="!auditTrails.length"
                  >
                    <Icon name="mdi:file-export" class="mr-1" size="1rem" />
                    Eksport
                  </rs-button>
                </div>

                <rs-empty-state
                  v-if="!auditTrails.length"
                  label="Tiada sejarah perubahan"
                />

                <rs-table
                  v-else
                  :data="auditTrails"
                  :options="{
                    variant: 'default',
                    hover: true,
                    responsive: true,
                  }"
                >
                  <template v-slot:perubahan="data">
                    <div class="grid grid-cols-1 gap-1">
                      <div v-for="(change, index) in data.text" :key="index">
                        <span class="font-medium">{{ change.field }}:</span>
                        <span class="line-through text-red-500 ml-1">{{
                          change.from || "-"
                        }}</span>
                        <span class="text-green-500 ml-1">{{
                          change.to || "-"
                        }}</span>
                      </div>
                    </div>
                  </template>
                </rs-table>
              </div>
            </rs-tab-item>
          </rs-tab>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const roleId = computed(() => route.params.id);
const activeTab = ref("modul");
const isLoading = ref(true);

// Breadcrumb configuration
const breadcrumb = computed(() => [
  {
    name: "Pentadbiran",
    type: "link",
    path: "/BF-PS/PPK/KKP/nas",
  },
  {
    name: "Kebenaran Akses",
    type: "link",
    path: "/BF-PS/PPK/KKP/nas",
  },
  {
    name: "Kumpulan Pengguna",
    type: "link",
    path: "/BF-PS/PPK/KKP/nas",
  },
  {
    name: "Butiran Pengguna",
    type: "current",
    path: `/BF-PS/PPK/KKP/nas/${roleId.value}`,
  },
]);

// Role details data
const roleDetails = ref({
  peranan: "",
  deskripsi: "",
  status: "",
  createdAt: new Date(),
});

// Module data
const modules = ref([]);

// Audit trail data
const auditTrails = ref([]);

// Fetch role details based on ID
onMounted(async () => {
  try {
    await fetchRoleDetails();
    await Promise.all([fetchModules(), fetchAuditTrail()]);
  } catch (error) {
    alert("Gagal memuat turun data peranan. Sila cuba sebentar lagi.");
    console.error("Error fetching role data:", error);
  } finally {
    isLoading.value = false;
  }
});

// Fetch role details
const fetchRoleDetails = async () => {
  // In a real app, you would fetch this data from an API
  // Simulating API call with setTimeout
  await new Promise((resolve) => setTimeout(resolve, 500));

  const mockRoles = {
    1: {
      peranan: "EKP",
      deskripsi: "Eksekutif Perkhidmatan Pelanggan",
      status: "Aktif",
      createdAt: new Date("2023-01-15"),
    },
    2: {
      peranan: "EOAD",
      deskripsi: "Eksekutif Operasi & Admin",
      status: "Aktif",
      createdAt: new Date("2023-02-20"),
    },
    3: {
      peranan: "KOAD",
      deskripsi: "Ketua Operasi & Admin",
      status: "Aktif",
      createdAt: new Date("2023-03-10"),
    },
  };

  const foundRole = mockRoles[roleId.value];

  if (!foundRole) {
    alert("Peranan tidak ditemui");

    router.push("/BF-PS/PPK/KKP/nas");
    return;
  }

  roleDetails.value = foundRole;
};

// Fetch modules
const fetchModules = async () => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Sample module data
  modules.value = [
    {
      modul: "Pengurusan Pengguna",
      submodul: "Senarai Pengguna",
      tindakan: ["Lihat", "Kemaskini"],
    },
    {
      modul: "Laporan",
      submodul: "Laporan Bulanan",
      tindakan: ["Lihat", "Eksport"],
    },
    {
      modul: "Konfigurasi Sistem",
      submodul: "Peranan",
      tindakan: ["Lihat", "Tambah", "Kemaskini"],
    },
  ];
};

// Fetch audit trail
const fetchAuditTrail = async () => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Sample audit trail data
  auditTrails.value = [
    {
      tarikh: new Date(),
      pengguna: "admin1",
      tindakan: "Kemaskini",
      modul: "Peranan",
      perubahan: [
        { field: "Status", from: "Aktif", to: "Tidak Aktif" },
        { field: "Deskripsi", from: "Deskripsi lama", to: "Deskripsi baru" },
      ],
    },
    {
      tarikh: new Date(Date.now() - 86400000),
      pengguna: "admin2",
      tindakan: "Tambah",
      modul: "Peranan",
      perubahan: [
        { field: "Peranan", from: "", to: "EOAD" },
        { field: "Deskripsi", from: "", to: "Eksekutif Operasi & Admin" },
      ],
    },
  ];
};

// Helper functions
const getStatusVariant = (status) => {
  return status === "Aktif" ? "success" : "danger";
};

const formatDate = (date) => {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("ms-MY", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Export functions with proper error handling
const exportDetails = async () => {
  try {
    // In a real app, implement PDF/Word export logic here
    await new Promise((resolve) => setTimeout(resolve, 800));

    alert(
      `Butiran peranan ${roleDetails.value.peranan} telah berjaya dieksport`
    );
  } catch (error) {
    alert("Gagal mengeksport butiran. Sila cuba sebentar lagi.");
    console.error("Export error:", error);
  }
};

const exportModuleDetails = async () => {
  try {
    // Implement module details export
    await new Promise((resolve) => setTimeout(resolve, 800));

    alert("Maklumat modul telah berjaya dieksport");
  } catch (error) {
    alert("Gagal mengeksport maklumat modul. Sila cuba sebentar lagi.");
    console.error("Export error:", error);
  }
};

const exportAuditTrail = async () => {
  try {
    // Implement audit trail export
    await new Promise((resolve) => setTimeout(resolve, 800));

    alert("Audit trail telah berjaya dieksport");
  } catch (error) {
    alert("Gagal mengeksport audit trail. Sila cuba sebentar lagi.");

    console.error("Export error:", error);
  }
};
</script>
