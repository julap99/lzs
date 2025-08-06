<template>
  <div class="p-6">
    <!-- Guest Name (centered) -->
    <div class="mb-4 flex flex-col items-center">
      <div class="flex items-center gap-3">
        <div class="inline-block bg-blue-50 text-blue-900 px-6 py-2 rounded-full text-lg font-semibold shadow">
          Ahmad bin Abdullah
        </div>
        <rs-button size="sm" variant="primary-outline" class="rounded-full" @click="showSuratTawaran = true" title="Surat Tawaran">
          <Icon name="heroicons:document-text" size="22" />
        </rs-button>
      </div>
    </div>
    <!-- Explanatory Text -->
    <div class="text-center mb-6 text-lg">
      <p class="text-gray-700">Sila baca surat tawaran yang telah dihantar. Setelah membaca, sila pilih tindakan anda di bawah.</p>
    </div>
    <div class="text-center mb-2">
      <p class="text-gray-900 font-semibold text-sm">
        Pilih mana-mana Kategori yang telah ditawarkan kepada anda di bawah:
      </p>
    </div>
    <!-- Kategori Selection -->
    <div class="grid grid-cols-4 gap-4 mb-6">
      <div class="border rounded p-4 text-center cursor-pointer" :class="{ 'bg-blue-100 border-blue-500': selectedKategori.Fitrah }" @click="selectedKategori.Fitrah = !selectedKategori.Fitrah">
        <div class="font-bold text-xl mb-2">Fitrah</div>
        <p class="text-gray-600"><span class="font-semibold">Jenis:</span> Zakat Fitrah</p>
        <p class="text-gray-600"><span class="font-semibold">Institusi:</span> Masjid Wilayah Persekutuan</p>
        <p class="text-gray-600"><span class="font-semibold">Tempoh Lantikan:</span> 2024 - 2027</p>
        <p class="text-gray-600"><span class="font-semibold">Lokasi:</span> Kuala Lumpur</p>
      </div>
      <div class="border rounded p-4 text-center cursor-pointer" :class="{ 'bg-blue-100 border-blue-500': selectedKategori.Padi }" @click="selectedKategori.Padi = !selectedKategori.Padi">
        <div class="font-bold text-xl mb-2">Padi</div>
        <p class="text-gray-600"><span class="font-semibold">Jenis:</span> Zakat Padi</p>
        <p class="text-gray-600"><span class="font-semibold">Institusi:</span> Masjid Al-Khairiyah</p>
        <p class="text-gray-600"><span class="font-semibold">Tempoh Lantikan:</span> 2024 - 2027</p>
        <p class="text-gray-600"><span class="font-semibold">Lokasi:</span> Selangor</p>
      </div>
      <div class="border rounded p-4 text-center cursor-pointer" :class="{ 'bg-blue-100 border-blue-500': selectedKategori.Kariah }" @click="selectedKategori.Kariah = !selectedKategori.Kariah">
        <div class="font-bold text-xl mb-2">Kariah</div>
        <p class="text-gray-600"><span class="font-semibold">Jenis:</span> Zakat Kariah</p>
        <p class="text-gray-600"><span class="font-semibold">Institusi:</span> Masjid Bandar Utama</p>
        <p class="text-gray-600"><span class="font-semibold">Tempoh Lantikan:</span> 2024 - 2027</p>
        <p class="text-gray-600"><span class="font-semibold">Lokasi:</span> Petaling Jaya</p>
      </div>
      <div class="border rounded p-4 text-center cursor-pointer" :class="{ 'bg-blue-100 border-blue-500': selectedKategori.Komuniti }" @click="selectedKategori.Komuniti = !selectedKategori.Komuniti">
        <div class="font-bold text-xl mb-2">Komuniti</div>
        <p class="text-gray-600"><span class="font-semibold">Jenis:</span> Zakat Komuniti</p>
        <p class="text-gray-600"><span class="font-semibold">Institusi:</span> Masjid Damansara Perdana</p>
        <p class="text-gray-600"><span class="font-semibold">Tempoh Lantikan:</span> 2024 - 2027</p>
        <p class="text-gray-600"><span class="font-semibold">Lokasi:</span> Damansara</p>
        <p class="text-gray-600"><span class="font-semibold">Jawatan:</span> (Pilih jawatan selepas terima tawaran)</p>
      </div>
    </div>
    <!-- Accept/Reject Buttons -->
    <div class="flex justify-center gap-4 mt-8">
      <rs-button variant="primary" @click="showAcceptModal = true" :disabled="!isAnyKategoriSelected">Saya, Terima</rs-button>
      <rs-button variant="danger-outline" @click="showRejectModal = true">Saya, Tolak</rs-button>
    </div>
    <!-- Accept Confirmation Modal -->
    <rs-modal v-model="showAcceptModal" title="Pengesahan Terima Tawaran" size="md" position="center">
      <template #body>
        <div class="p-4">
          <p class="mb-4">Saya dengan ini mengesahkan saya terima tawaran ini sebagai Penolong Amil untuk kategori yang dipilih.</p>
          <div class="flex items-center mb-4">
            <input type="checkbox" v-model="acceptConfirmed" class="mr-2" />
            <label>Saya telah membaca dan bersetuju dengan syarat-syarat yang ditetapkan.</label>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-center">
          <rs-button variant="primary" @click="acceptOffer" :disabled="!acceptConfirmed">Hantar</rs-button>
        </div>
      </template>
    </rs-modal>
    <!-- Reject Confirmation Modal -->
    <rs-modal v-model="showRejectModal" title="Pengesahan Tolak Tawaran" size="md" position="center">
      <template #body>
        <div class="p-4">
          <p>Saya tidak berminat meneruskan tawaran ini sebagai Penolong Amil.</p>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-center">
          <rs-button variant="danger" @click="rejectOffer">Hantar</rs-button>
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
              <div class="font-semibold">Ahmad bin Abdullah</div>
              <div>880429-10-5605</div>
              <div>Masjid Wilayah Persekutuan</div>
              <div>Kuala Lumpur</div>
            </div>
          </div>
          <div class="text font-bold text-lg mb-4 mt-2">SURAT TAWARAN PELANTIKAN PENOLONG AMIL</div>
          <div class="mb-4">
            <div class="mb-2"><span class="font-semibold">No. Rujukan Kami:</span> LZS/PA/2024/FITRAH01</div>
            <div class="mb-2"><span class="font-semibold">Tarikh:</span> 01 Januari 2024</div>
            <div class="mb-2"><span class="font-semibold">Tempoh Perkhidmatan:</span> 1 Januari 2024 - 31 Disember 2027</div>
            <div class="mb-2"><span class="font-semibold">Kategori:</span> Penolong Amil</div>
          </div>
          <div class="mb-4">
            <div class="font-semibold mb-1">Maklumat Penolong Amil:</div>
            <ul class="list-disc pl-6">
              <li>Nama: Ahmad bin Abdullah</li>
              <li>No. Kad Pengenalan: 880429-10-5605</li>
              <li>Kod: FITRAH01</li>
              <li>Institusi: Masjid Wilayah Persekutuan</li>
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
import { ref, computed } from 'vue';
const showAcceptModal = ref(false);
const showRejectModal = ref(false);
const acceptConfirmed = ref(false);
const selectedKategori = ref({
  Fitrah: false,
  Padi: false,
  Kariah: false,
  Komuniti: false
});
const isAnyKategoriSelected = computed(() => {
  return Object.values(selectedKategori.value).some(value => value);
});
const acceptOffer = () => {
  window.location.href = '/BF-PA/PP/PD/PA_Dashboard';
};
const rejectOffer = () => {
  alert('Terima kasih kerana berminat.');
  window.location.href = '/BF-PA/PP/PD/PA_Login';
};
const showSuratTawaran = ref(false);
</script>

<style scoped></style>