<template>
  <div class="min-h-screen">
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Page Header -->
    <div class="mt-6 mb-8">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Buka Operasi Peti Besi</h1>
          <p class="mt-1 text-sm text-gray-600">
            Laksanakan pembukaan dan penutupan operasi tunai harian di lokasi anda.
          </p>
        </div>
        <rs-badge
          :variant="bukaOperasi.status === 'Dibuka' ? 'success' : 'default'"
          class="text-sm px-4 py-2"
        >
          {{ bukaOperasi.status }}
        </rs-badge>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left Content -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Kad Maklumat Operasi -->
        <rs-card class="shadow-sm border-0 bg-white">
          <template #header>
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Icon name="ph:vault" class="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 class="text-lg font-semibold text-gray-900">Maklumat Operasi</h2>
                <p class="text-sm text-gray-500">Butiran sesi operasi semasa</p>
              </div>
            </div>
          </template>

          <template #body>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-1">
                <label class="text-sm font-medium text-gray-700">Tarikh Buka</label>
                <div class="p-3 bg-gray-50 rounded-lg border text-sm">
                  {{ formatDateTime(bukaOperasi.tarikhBuka) }}
                </div>
              </div>

              <div class="space-y-1">
                <label class="text-sm font-medium text-gray-700">Nama Pengguna</label>
                <div class="p-3 bg-gray-50 rounded-lg border text-sm">
                  {{ bukaOperasi.namaPengguna }}
                </div>
              </div>

              <div class="space-y-1">
                <label class="text-sm font-medium text-gray-700">Lokasi</label>
                <div class="p-3 bg-gray-50 rounded-lg border text-sm">
                  {{ bukaOperasi.lokasi }}
                </div>
              </div>

              <div class="space-y-1">
                <label class="text-sm font-medium text-gray-700">Status Operasi</label>
                <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                  <rs-badge :variant="bukaOperasi.status === 'Dibuka' ? 'success' : 'default'" size="sm">
                    {{ bukaOperasi.status }}
                  </rs-badge>
                </div>
              </div>
            </div>
          </template>
        </rs-card>

        <!-- Kad Ringkasan Tunai -->
        <rs-card class="shadow-sm border-0 bg-white">
          <template #header>
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Icon name="ph:wallet" class="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h2 class="text-lg font-semibold text-gray-900">Maklumat Tunai Peti Besi</h2>
                <p class="text-sm text-gray-500">Status semasa tunai harian</p>
              </div>
            </div>
          </template>

          <template #body>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div class="text-sm text-gray-500">Baki Tunai Semasa</div>
                <div class="font-bold text-lg text-gray-800">
                  RM {{ bukaOperasi.bakiSemasa.toFixed(2) }}
                </div>
              </div>
              <div>
                <div class="text-sm text-gray-500">Had Minimum Ditetapkan</div>
                <div class="font-bold text-lg text-gray-800">
                  RM {{ bukaOperasi.hadMinimum.toFixed(2) }}
                </div>
              </div>
              <div>
                <div class="text-sm text-gray-500">Jumlah Tunai Keluar Hari Ini</div>
                <div class="font-bold text-lg text-gray-800">
                  RM {{ bukaOperasi.totalKeluar.toFixed(2) }}
                </div>
              </div>
            </div>
          </template>
        </rs-card>

        <!-- Kad Audit -->
        <rs-card class="shadow-sm border-0 bg-white">
          <template #header>
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Icon name="ph:clock" class="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 class="text-lg font-semibold text-gray-900">Audit Trail</h2>
                <p class="text-sm text-gray-500">Rekod aktiviti pengguna</p>
              </div>
            </div>
          </template>

          <template #body>
            <ul class="text-sm text-gray-700 list-disc list-inside space-y-1">
              <li v-for="(log, index) in bukaOperasi.audit" :key="index">
                {{ formatDateTime(log.tarikh) }} – {{ log.aktiviti }} oleh {{ log.nama }}
              </li>
            </ul>
          </template>
        </rs-card>
      </div>

      <!-- Sidebar Tindakan -->
      <div class="lg:col-span-1 space-y-6">
        <rs-card class="shadow-sm border-0 bg-white sticky top-6 z-10">
          <template #header>
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Icon name="ph:hand" class="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h2 class="text-lg font-semibold text-gray-900">Tindakan Pengguna</h2>
                <p class="text-sm text-gray-500">Masukkan maklumat dan jalankan tindakan</p>
              </div>
            </div>
          </template>

          <template #body>
            <FormKit type="form" :actions="false">
              <div class="space-y-4">
                <FormKit
                  v-if="bukaOperasi.status === 'Tidak Aktif'"
                  type="number"
                  label="Jumlah Tunai Semasa (RM)"
                  placeholder="Contoh: 5000.00"
                  validation="required|min:1"
                  v-model="bukaOperasi.bakiSemasa"
                />

                <rs-button
                  v-if="bukaOperasi.status === 'Tidak Aktif'"
                  variant="success"
                  class="w-full"
                  @click="bukaSesi"
                >
                  Buka Operasi
                </rs-button>


                <rs-button variant="primary-outline" class="w-full" @click="navigateToHistory">
                  ← Lihat Sejarah
                </rs-button>
              </div>
            </FormKit>
          </template>
        </rs-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const breadcrumb = ref([
  { name: "Pengurusan Tunai", type: "link", path: "/BF-TUNAI" },
  { name: "Buka Operasi", type: "current", path: "/BF-TUNAI/OPERASI/BUKA" },
]);

const previousClosing = {
  jumlahTutup: 3520.0,
  tarikh: "2025-06-13T17:45:00",
};

const bukaOperasi = ref({
  lokasi: "Peti Besi Cawangan Klang",
  tarikhBuka: "",
  tarikhTutup: "",
  namaPengguna: "Ali bin Ahmad",
  status: "Tidak Aktif",
  //bakiSemasa: 0,
  bakiSemasa: previousClosing.jumlahTutup,
  hadMinimum: 1000,
  totalKeluar: 0,
  audit: [],
});

const bukaSesi = () => {
  const now = new Date().toISOString();
  bukaOperasi.value.status = "Dibuka";
  bukaOperasi.value.tarikhBuka = now;
  bukaOperasi.value.audit.push({
    tarikh: now,
    aktiviti: "Buka Operasi",
    nama: bukaOperasi.value.namaPengguna,
  });
};


const navigateToHistory = () => {
  navigateTo("/BF-TNI/opening-akaun/sejarah-buka-operasi");
};

const formatDateTime = (str) => {
  if (!str) return "-";
  return new Date(str).toLocaleString("ms-MY", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit"
  });
};


</script>


<style lang="scss" scoped></style>
