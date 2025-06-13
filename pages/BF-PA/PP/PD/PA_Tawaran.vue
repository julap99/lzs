<template>
  <div class="p-6">
    <div class="mb-6 text-center">
      <div class="text-2xl font-bold mb-2 text-gray-800" dir="rtl" lang="ar">اَلسَلامُ عَلَيْكُم وَرَحْمَةُ اَللهِ وَبَرَكاتُهُ‎</div>
      <h2 class="text-2xl font-bold mb-2">Selamat Datang ke New Agihan System (NAS)</h2>
    </div>
    <!-- Guest Name (centered) -->
    <div class="mb-4 flex flex-col items-center">
      <div class="inline-block bg-blue-50 text-blue-900 px-6 py-2 rounded-full text-lg font-semibold shadow">
        Ahmad bin Abdullah
      </div>
    </div>
    <!-- Explanatory Text -->
    <div class="text-center mb-6">
      <p class="text-gray-700">Sila baca surat tawaran yang telah dihantar. Setelah membaca, sila pilih tindakan anda di bawah.</p>
    </div>
    <!-- Accept/Reject Buttons -->
    <div class="flex justify-center gap-4 mt-8">
      <rs-button variant="primary" @click="showAcceptModal = true">Saya, Terima</rs-button>
      <rs-button variant="danger-outline" @click="showRejectModal = true">Saya, Tolak</rs-button>
    </div>
    <!-- Accept Confirmation Modal -->
    <rs-modal v-model="showAcceptModal" title="Pengesahan Terima Tawaran" size="md" position="center">
      <template #body>
        <div class="p-4">
          <p class="mb-4">Saya dengan ini mengesahkan saya terima tawaran ini sebagai Penolong Amil.</p>
          <div class="flex items-center mb-4">
            <input type="checkbox" v-model="acceptConfirmed" class="mr-2" />
            <label>Saya bersetuju dengan syarat-syarat yang ditetapkan.</label>
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
  </div>
</template>

<script setup>
import { ref } from 'vue';
const showAcceptModal = ref(false);
const showRejectModal = ref(false);
const acceptConfirmed = ref(false);
const acceptOffer = () => {
  window.location.href = '/BF-PA/PP/PD/PA_Dashboard';
};
const rejectOffer = () => {
  alert('Terima kasih kerana berminat.');
  window.location.href = '/BF-PA/PP/PD/PA_Login';
};
</script>

<style scoped></style>