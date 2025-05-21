<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Keluar Tunai & Agih Tunai (EOAD)
          </h2>
          <rs-badge :variant="getStatusBadgeVariant()">
            {{ applicationData?.status || "Diluluskan" }}
          </rs-badge>
        </div>
      </template>

      <template #body>
        <div class="p-4">
          <!-- Maklumat Permohonan -->
          <div class="mb-8">
            <h3 class="text-lg font-semibold mb-4">Maklumat Permohonan</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- ID Permohonan -->
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >ID Permohonan</label
                >
                <p class="mt-1">{{ applicationData.id }}</p>
              </div>

              <!-- Nama & No KP Pemohon (EOAD) -->
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Nama & No KP Pemohon (EOAD)</label
                >
                <p class="mt-1">
                  {{ applicationData.namaPemohon }} ({{ applicationData.noKp }})
                </p>
              </div>

              <!-- Jumlah Tunai Diluluskan (RM) -->
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Jumlah Tunai Diluluskan (RM)</label
                >
                <p class="mt-1">
                  RM {{ formatCurrency(applicationData.jumlahTunai) }}
                </p>
              </div>

              <!-- Baki Peti Besi Semasa -->
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Baki Peti Besi Semasa (RM)</label
                >
                <p class="mt-1">
                  RM {{ formatCurrency(applicationData.bakiPetiBesi) }}
                </p>
              </div>

              <!-- Lokasi / Laluan Agihan -->
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Lokasi / Laluan Agihan</label
                >
                <p class="mt-1">{{ applicationData.lokasiAgihan }}</p>
              </div>

              <!-- Tujuan Bantuan / Catatan Tambahan -->
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Tujuan Bantuan / Catatan Tambahan</label
                >
                <p class="mt-1">{{ applicationData.tujuanBantuan }}</p>
              </div>
            </div>
          </div>

          <!-- Prosedur Keluar Tunai & Agih Tunai -->
          <div class="mt-8 border-t pt-6">
            <h3 class="text-lg font-semibold mb-4">
              Prosedur Keluar Tunai & Agih Tunai
            </h3>
            <div class="space-y-4">
              <div class="bg-gray-50 p-4 rounded-lg">
                <h4 class="font-medium mb-2">1. Rujuk Permohonan Diluluskan</h4>
                <p class="text-gray-700">
                  EOAD log masuk ke NAS dan buka permohonan tunai lapangan yang
                  telah diluluskan.
                </p>
              </div>

              <div class="bg-gray-50 p-4 rounded-lg">
                <h4 class="font-medium mb-2">2. Keluarkan Tunai Fizikal</h4>
                <p class="text-gray-700">
                  EOAD mengeluarkan tunai fizikal berdasarkan amaun diluluskan
                  dari peti besi.
                </p>
              </div>
            </div>
          </div>

          <div class="mt-6 flex justify-end">
            <rs-button
              type="button"
              variant="primary"
              @click="router.push('/BF-TNI/MT/TD/04')"
            >
              Seterusnya
            </rs-button>
          </div>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

definePageMeta({
  title: "Keluar Tunai & Agih Tunai",
});

const router = useRouter();

const breadcrumb = ref([
  {
    name: "Pengurusan Tunai",
    type: "link",
    path: "/BF-TNI/MT/TD/01",
  },
  {
    name: "Tunai Dilapangan",
    type: "link",
    path: "/BF-TNI/MT/TD/01",
  },
  {
    name: "Keluar Tunai & Agih Tunai (EOAD)",
    type: "current",
    path: "/BF-TNI/MT/TD/03",
  },
]);

// Mock data - replace with actual data from API
const applicationData = ref({
  id: "TD-2024-001",
  namaPemohon: "Ahmad bin Abdullah",
  noKp: "880101121234",
  jumlahTunai: 5000.0,
  bakiPetiBesi: 10000.0,
  lokasiAgihan: "Kuala Lumpur",
  tujuanBantuan: "Bantuan Lapangan - Operasi Banjir",
  status: "Diluluskan",
});

const formatCurrency = (value: number) => {
  return value.toLocaleString("ms-MY", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const getStatusBadgeVariant = () => {
  return "success";
};
</script>

<style scoped></style>
