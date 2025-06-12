<template>
  <div class="p-6">
    <div class="mb-6 text-center">
      <div class="text-2xl font-bold mb-2 text-gray-800" dir="rtl" lang="ar">اَلسَلامُ عَلَيْكُم وَرَحْمَةُ اَللهِ وَبَرَكاتُهُ‎</div>
      <h2 class="text-2xl font-bold mb-2">Selamat Datang ke Portal Penolong Amil</h2>
      <p class="text-gray-600">Akses pantas kepada maklumat dan tugasan anda sebagai Penolong Amil Lembaga Zakat Selangor.</p>
    </div>
    <div class="flex justify-end mb-6">
      <rs-button variant="primary" @click="navigateTo('/BF-PA/PP/PD')">
        <Icon name="material-symbols:admin-panel-settings" class="mr-2" />
        Login as Admin
      </rs-button>
    </div>
    <!-- Guest Name (centered) -->
    <div class="mb-4 text-center">
      <div class="inline-block bg-blue-50 text-blue-900 px-6 py-2 rounded-full text-lg font-semibold shadow">
        Ahmad bin Abdullah
      </div>
    </div>

    <!-- Tasks Table -->
    <div class="mb-8">
      <h3 class="font-semibold text-lg mb-4">Senarai Tugasan</h3>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 bg-white rounded-lg shadow">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tugasan</th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Tarikh</th>
              <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Tindakan</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <!-- Tugasan Belum Selesai -->
            <tr>
              <td colspan="4" class="bg-blue-50 text-blue-800 font-semibold px-6 py-2">Tugasan Belum Selesai</td>
            </tr>
            <tr>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Lengkapkan Maklumat Peribadi</td>
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <span class="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Tindakan Segera</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-center">01/06/2024</td>
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <rs-button size="sm" variant="primary-outline" class="mx-auto" @click="navigateTo('/BF-PA/PP/PD/09')">
                  <Icon name="heroicons:pencil-square" class="mr-1" size="16" />
                  Lengkapkan
                </rs-button>
              </td>
            </tr>
            <tr>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Muat naik dokumen peribadi</td>
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <span class="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Dalam Proses</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-center">02/06/2024</td>
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <rs-button size="sm" variant="primary-outline" class="mx-auto">
                  <Icon name="heroicons:arrow-up-tray" class="mr-1" size="16" />
                  Muat Naik
                </rs-button>
              </td>
            </tr>
            <tr>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Lengkapkan Borang Penilaian</td>
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <span class="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Dalam Proses</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-center">03/06/2024</td>
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <rs-button size="sm" variant="primary-outline" class="mx-auto">
                  <Icon name="heroicons:document-text" class="mr-1" size="16" />
                  Lengkapkan
                </rs-button>
              </td>
            </tr>
            <!-- Tugasan Sedang Berjalan -->
            <tr>
              <td colspan="4" class="bg-blue-50 text-blue-800 font-semibold px-6 py-2">Tugasan Sedang Berjalan</td>
            </tr>
            <tr>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Sahkan Kehadiran Mesyuarat</td>
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <span class="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">Sedang Berjalan</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-center">04/06/2024</td>
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <rs-button size="sm" variant="primary-outline" class="mx-auto">
                  <Icon name="heroicons:check-circle" class="mr-1" size="16" />
                  Sahkan
                </rs-button>
              </td>
            </tr>
            <tr>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Hantar Laporan Aktiviti</td>
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <span class="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">Sedang Berjalan</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-center">05/06/2024</td>
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <rs-button size="sm" variant="primary-outline" class="mx-auto">
                  <Icon name="heroicons:document-text" class="mr-1" size="16" />
                  Hantar
                </rs-button>
              </td>
            </tr>
            <!-- Tugasan Selesai -->
            <tr>
              <td colspan="4" class="bg-blue-50 text-blue-800 font-semibold px-6 py-2">Tugasan Selesai</td>
            </tr>
            <tr>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Kemaskini Maklumat Diri</td>
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <span class="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Selesai</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-center">06/06/2024</td>
              <td class="px-6 py-4 whitespace-nowrap text-center text-gray-400">-</td>
            </tr>
            <tr>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Hantar Borang Akuan</td>
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <span class="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Selesai</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-center">07/06/2024</td>
              <td class="px-6 py-4 whitespace-nowrap text-center text-gray-400">-</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
const navigateTo = (path) => {
  window.location.href = path;
};
</script>

<style scoped></style>