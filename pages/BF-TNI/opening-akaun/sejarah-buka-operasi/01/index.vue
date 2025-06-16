<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card>
      <template #header>Maklumat Buka Operasi</template>
      <template #body>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <rs-card variant="secondary">
            <div class="p-2">
              <div class="text-sm text-gray-500">Lokasi / Akaun Peti Besi</div>
              <div class="font-bold">{{ bukaOperasi.lokasi }}</div>
            </div>
          </rs-card>

          <rs-card variant="secondary">
            <div class="p-2">
              <div class="text-sm text-gray-500">Tarikh & Masa Buka</div>
              <div class="font-bold">{{ formatDate(bukaOperasi.tarikhBuka) }}</div>
            </div>
          </rs-card>

          <rs-card variant="secondary">
            <div class="p-2">
              <div class="text-sm text-gray-500">Nama Pengguna</div>
              <div class="font-bold">{{ bukaOperasi.namaPengguna }}</div>
            </div>
          </rs-card>

          <rs-card variant="secondary">
            <div class="p-2 flex flex-col">
              <div class="text-sm text-gray-500">Status Operasi</div>
              <rs-badge :variant="getStatusVariant(bukaOperasi.status)" size="sm">
                {{ bukaOperasi.status }}
              </rs-badge>
            </div>
          </rs-card>
        </div>

        <rs-card variant="secondary">
            <div class="p-2">
              <div class="text-sm text-gray-500">Tarikh & Masa Tutup</div>
              <div class="font-bold">{{ formatDate(bukaOperasi.tarikhTutup) }}</div>
            </div>
        </rs-card>

       

         <!-- Maklumat Kewangan Semasa -->
        <rs-card variant="soft">
          <template #header>Maklumat Tunai Peti Besi</template>
          <template #body>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div class="text-sm text-gray-500">Baki Tunai Semasa</div>
                <div class="font-bold text-lg">RM {{ bukaOperasi.bakiSemasa.toFixed(2) }}</div>
              </div>
              <div>
                <div class="text-sm text-gray-500">Had Minimum Ditetapkan</div>
                <div class="font-bold text-lg">RM {{ bukaOperasi.hadMinimum.toFixed(2) }}</div>
              </div>
              <div>
                <div class="text-sm text-gray-500">Jumlah Tunai Keluar Hari Ini</div>
                <div class="font-bold">RM {{ bukaOperasi.totalKeluar.toFixed(2) }}</div>
              </div>
            </div>
          </template>
        </rs-card>

         <!-- Audit Trail -->
        <div v-if="bukaOperasi.audit && bukaOperasi.audit.length" class="mt-6">
          <h4 class="text-base font-semibold mb-2">Audit Trail</h4>
          <ul class="text-sm text-gray-600 list-disc list-inside">
            <li v-for="(log, i) in bukaOperasi.audit" :key="i">
              {{ formatDate(log.tarikh) }} – {{ log.aktiviti }} oleh {{ log.nama }}
            </li>
          </ul>
        </div>

        <!-- Butang Tindakan -->
        <div class="mt-6 flex justify-end space-x-2">
          <!-- <rs-button
            v-if="bukaOperasi.status === 'Dibuka'"
            variant="danger"
            @click="sahkanTutupOperasi"
          >
            Sahkan Tutup Operasi
          </rs-button> -->
          <rs-button variant="secondary" @click="navigateBack">
            Kembali
          </rs-button>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const breadcrumb = ref([
  { name: 'Pengurusan Tunai', type: 'link', path: '/BF-TNI/MT/OP/01' },
  { name: 'Sejarah Buka Operasi', type: 'link', path: '/BF-TNI/MT/OP/history' },
  { name: 'Maklumat Buka Operasi', type: 'current', path: '/BF-TNI/MT/OP/detail' },
]);

const bukaOperasi = ref({
    lokasi: 'Peti Besi Cawangan Klang',
    tarikhBuka: '2025-06-14T08:00:00',
    tarikhTutup: '2025-06-14T06:00:00',
    namaPengguna: 'Ali bin Ahmad',
    status: 'Dibuka',
    bakiSemasa: 450.00,           // baki semasa dalam peti besi
    hadMinimum: 300.00,           // had minimum yang ditetapkan untuk trigger alert
    totalKeluar: 150.00,          // jumlah tunai keluar sepanjang hari
    audit: [
        { tarikh: '2025-06-14T08:00:00', aktiviti: 'Buka Operasi', nama: 'Ali bin Ahmad' },
        { tarikh: '2025-06-14T08:01:30', aktiviti: 'Sahkan Buka', nama: 'Ali bin Ahmad' },
    ],
});

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleString('ms-MY', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getStatusVariant = (status) => {
  return { Dibuka: 'info', Ditutup: 'success' }[status] || 'default';
};

const sahkanTutupOperasi = () => {
  alert('Sesi operasi telah ditutup!');
  // Real implementation akan update status, tambah audit dan panggil API
};

const navigateBack = () => {
  navigateTo('/BF-TNI/opening-akaun/sejarah-buka-operasi');
};

</script>

<style lang="scss" scoped></style>