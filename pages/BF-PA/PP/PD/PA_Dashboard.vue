<template>
    <div class="p-6">
      <div class="mb-6 text-center">
        <div class="text-4xl font-bold mb-2 text-gray-800" dir="rtl" lang="ar">اَلسَلامُ عَلَيْكُم وَرَحْمَةُ اَللهِ وَبَرَكاتُهُ‎</div>
        <h2 class="text-3xl font-bold mb-2">Selamat Datang ke New Agihan System (NAS)</h2>
        <p class="text-gray-600">Akses pantas kepada maklumat dan tugasan anda sebagai Penolong Amil Lembaga Zakat Selangor.</p>
      </div>

      <!-- Guest Name (centered) with action buttons -->
      <div class="mb-4 flex flex-col items-center">
        <div class="flex items-center gap-3">
          <div class="inline-block bg-blue-50 text-blue-900 px-6 py-2 rounded-full text-lg font-semibold shadow">
            Ahmad bin Abdullah
          </div>
          <rs-button size="sm" variant="primary-outline" class="rounded-full" @click="showKadTauliah = true" title="Kad Tauliah">
            <Icon name="heroicons:identification" size="22" />
          </rs-button>
          <rs-button size="sm" variant="primary-outline" class="rounded-full" @click="showSuratTawaran = true" title="Surat Tawaran">
            <Icon name="heroicons:document-text" size="22" />
          </rs-button>
        </div>
      </div>
  
      <!-- Cards Section -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div
          v-for="card in cards"
          :key="card.title"
          class="relative cursor-pointer transition transform hover:scale-105 hover:shadow-lg rounded-xl p-5 border-2 shadow group"
          :class="[
            card.color,
            selectedCard && selectedCard.title === card.title ? 'border-blue-600' : 'border-transparent',
            'flex flex-col items-center text-center min-h-[170px]'
          ]"
          @click="openCardModal(card)"
        >
          <div class="flex items-center justify-center mb-2 w-full">
            <Icon :name="card.icon" size="32" class="text-gray-700 group-hover:text-blue-700 transition" />
            <span
              v-if="card.change === 'positive'"
              class="ml-2 px-2 py-0.5 text-xs font-semibold rounded-full bg-green-200 text-green-800"
            ></span>
            <span
              v-else-if="card.change === 'warning'"
              class="ml-2 px-2 py-0.5 text-xs font-semibold rounded-full bg-yellow-200 text-yellow-800"
            >!</span>
            <span
              v-else-if="card.change === 'negative'"
              class="ml-2 px-2 py-0.5 text-xs font-semibold rounded-full bg-red-200 text-red-800"
            ></span>
          </div>
          <div class="text-3xl font-bold text-gray-900 mb-1">{{ card.value }}</div>
          <div class="font-semibold text-base text-gray-700 mb-1">{{ card.title }}</div>
          <div class="text-sm text-gray-600">{{ card.description }}</div>
        </div>
      </div>
  
      <!-- Card Modal -->
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
        <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
          <button class="absolute top-2 right-2 text-gray-400 hover:text-gray-700" @click="closeModal">
            <Icon name="heroicons:x-mark" size="24" />
          </button>
          <h3 class="text-xl font-bold mb-2">{{ selectedCard.title }}</h3>
          <p class="mb-2 text-gray-700">Jumlah: {{ selectedCard.count }}</p>
          <div class="text-gray-600 whitespace-pre-line">{{ selectedCard.details }}</div>
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
  
      <!-- Kad Tauliah Modal -->
      <rs-modal v-model="showKadTauliah" title="Kad Tauliah Digital" size="md" position="center">
        <template #body>
          <div class="flex flex-col items-center p-4">
            <div class="bg-gradient-to-br from-blue-100 to-white rounded-xl shadow-lg p-0 w-full max-w-xs border border-blue-300 relative overflow-hidden">
              <div class="bg-blue-600 h-3 w-full mb-2"></div>
              <div class="flex justify-between items-center mb-2 px-4">
                <img src="https://www.zakatselangor.com.my/wp-content/uploads/2018/10/lzs-logo.png" alt="LZS" class="h-8" />
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPSu8_4ST1QlO2uMoJFrGcLEJpy7dBh0E0BQ&s" alt="Penolong Amil" class="h-8" />
              </div>
              <div class="flex flex-col items-center mb-2 px-4">
                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Penolong Amil" class="w-24 h-24 rounded-full border-2 border-blue-400 mb-2 shadow" />
                <div class="font-bold text-base text-gray-800">MOHD SHAHBAN BIN MOHD NORDIN</div>
                <div class="text-xs text-gray-700 font-semibold">880429-10-5605</div>
                <div class="text-xs text-gray-700 font-semibold">MTWT03</div>
                <div class="text-xs text-gray-700 font-semibold">MAAHAD AL-TAHZIB WA AL-TAALIM</div>
                <div class="text-xs text-gray-700 font-semibold">1 JANUARI 2022 - 31 DISEMBER 2027</div>
              </div>
              <div class="flex justify-center mt-2 mb-4">
                <div class="w-20 h-20 bg-white border border-gray-300 flex items-center justify-center rounded shadow">
                  <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://www.zakatselangor.com.my/wp-content/uploads/2018/10/lzs-logo.png" alt="QR Code" class="w-16 h-16" />
                </div>
              </div>
              <div class="bg-blue-600 h-3 w-full mt-2"></div>
            </div>
          </div>
        </template>
        <template #footer>
          <div class="flex justify-center">
            <rs-button variant="primary-outline" @click="showKadTauliah = false">Tutup</rs-button>
          </div>
        </template>
      </rs-modal>
  
      <!-- Surat Tawaran Modal -->
      <rs-modal v-model="showSuratTawaran" title="Surat Tawaran Pelantikan" size="md" position="center">
        <template #body>
          <div class="flex justify-between items-center px-4">
            <img src="https://www.zakatselangor.com.my/wp-content/uploads/2018/10/lzs-logo.png" alt="LZS" class="h-8" />
          </div>
          <div class="p-4 text-sm text-gray-800">
            <div class="flex-col mb-2">
              <div class="text-right">
                <div class="font-bold">Lembaga Zakat Selangor</div>
                <div>Majlis Agama Islam Selangor</div>
                <div>Menara Selatan, Bangunan Sultan Idris Shah</div>
                <div>Persiaran Masjid, Seksyen 5</div>
                <div>40000 Shah Alam, Selangor</div>
              </div>
              <div class="text-left">
                <div class="font-bold">Kepada:</div>
                <div class="font-semibold">Mohd Shahban bin Mohd Nordin</div>
                <div>880429-10-5605</div>
                <div>MAAHAD AL-TAHZIB WA AL-TAALIM</div>
                <div>Selangor</div>
              </div>
            </div>
            
            <div class="text font-bold text-lg mb-4 mt-2">SURAT TAWARAN PELANTIKAN PENOLONG AMIL</div>
            <div class="mb-4">
              <div class="mb-2"><span class="font-semibold">No. Rujukan Kami:</span> LZS/PA/2022/MTWT03</div>
              <div class="mb-2"><span class="font-semibold">Tarikh:</span> 01 Januari 2022</div>
              <div class="mb-2"><span class="font-semibold">Tempoh Perkhidmatan:</span> 1 Januari 2022 - 31 Disember 2027</div>
              <div class="mb-2"><span class="font-semibold">Kategori:</span> Penolong Amil</div>
            </div>
            <div class="mb-4">
              <div class="font-semibold mb-1">Maklumat Penolong Amil:</div>
              <ul class="list-disc pl-6">
                <li>Nama: Mohd Shahban bin Mohd Nordin</li>
                <li>No. Kad Pengenalan: 880429-10-5605</li>
                <li>Kod: MTWT03</li>
                <li>Institusi: Maahad Al-Tahzib wa Al-Taalim</li>
              </ul>
            </div>
            <div class="mb-4">
              <p class="mb-2">Tuan/Puan,</p>
              <p class="mb-2">Dengan segala hormatnya perkara di atas adalah dirujuk.</p>
              <p class="mb-2">Sukacita dimaklumkan bahawa tuan telah dilantik sebagai <span class="font-semibold">Penolong Amil</span> bagi tempoh yang dinyatakan di atas.</p>
              <ul class="list-disc pl-6 mb-2">
                <li>Sila hadir ke pejabat Lembaga Zakat Selangor untuk pengesahan dokumen dan penerimaan kad tauliah digital.</li>
                <li>Sebarang pertanyaan boleh diajukan ke info@zakatselangor.com.my</li>
              </ul>
              <p class="mb-2">Sekian, terima kasih.</p>
            </div>
            <div class="mt-6">
              <div class="text-left">
                <div>Yang benar,</div>
                <div class="font-bold">Lembaga Zakat Selangor</div>
              </div>
            </div>
          </div>
        </template>
        <template #footer>
          <div class="flex justify-center">
            <rs-button variant="primary-outline" @click="showSuratTawaran = false">Tutup</rs-button>
          </div>
        </template>
      </rs-modal>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';

  const cards = ref([
    {
      title: 'Asnaf Berdaftar',
      value: '150',
      icon: 'ic:baseline-people',
      change: 'positive',
      description: '+10% dari bulan lepas',
      details: 'Senarai asnaf yang telah berdaftar di bawah jagaan anda.\nContoh: \n- Ahmad bin Ali (Fakir)\n- Siti binti Abu (Miskin)\n- ',
      color: 'bg-blue-100',
    },
    {
      title: 'Bantuan',
      value: '75',
      icon: 'ic:baseline-volunteer-activism',
      change: 'warning',
      description: '5 permohonan menunggu kelulusan',
      details: 'Permohonan bantuan yang sedang diproses atau telah diluluskan.\nContoh:\n- Bantuan Kewangan Bulanan\n- Bantuan Pendidikan\n- Bantuan Perubatan',
      color: 'bg-yellow-100',
    },
    {
      title: 'Aktiviti Komuniti',
      value: '50',
      icon: 'ic:baseline-event',
      change: 'warning',
      description: '+3 aktiviti baru',
      details: 'Maklumat tambahan atau statistik lain yang relevan untuk Penolong Amil.\nContoh:\n- Aktiviti komuniti\n- Program latihan',
      color: 'bg-green-100',
    },
    {
      title: 'Notifikasi Penting',
      value: '25',
      icon: 'ic:baseline-notifications-active',
      change: 'warning',
      description: '1 notis perlu tindakan segera',
      details: 'Laporan ringkas atau notifikasi penting berkaitan tugasan anda.\nContoh:\n- Notis mesyuarat\n- Pengumuman terkini',
      color: 'bg-red-100',
    },
  ]);

  const showModal = ref(false);
  const selectedCard = ref(null);

  const openCardModal = (card) => {
    selectedCard.value = card;
    showModal.value = true;
  };
  const closeModal = () => {
    showModal.value = false;
    selectedCard.value = null;
  };

  const navigateTo = (path) => {
    window.location.href = path;
  };

  const showKadTauliah = ref(false);
  const showSuratTawaran = ref(false);
  </script>
  
  <style scoped></style>