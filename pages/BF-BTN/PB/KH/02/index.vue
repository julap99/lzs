<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Kolum Kiri: Semua Maklumat -->
    <div class="space-y-6 lg:col-span-2">
      <!-- 🧾 Maklumat Permohonan -->
      <rs-card>
        <template #header>
          <h3 class="text-lg font-semibold">🧾 Maklumat Permohonan</h3>
        </template>
        <template #body>
          <ul class="grid grid-cols-1 gap-4 list-none">
            <li><strong>No Rujukan:</strong> {{ data.noRujukan }}</li>
            <li><strong>Nama Pemohon:</strong> {{ data.namaPemohon }}</li>
            <li><strong>Status Permohonan:</strong> {{ data.status }}</li>
            <li><strong>Tarikh Terima:</strong> {{ data.tarikhTerima }}</li>
            <li><strong>Pegawai EOAD:</strong> {{ data.pegawai }}</li>
          </ul>
        </template>
      </rs-card>

      <!-- 📂 Justifikasi & Situasi Kelulusan Khas -->
      <rs-card>
        <template #header>
          <h3 class="text-lg font-semibold">📂 Justifikasi & Situasi Kelulusan Khas</h3>
        </template>
        <template #body>
          <ul class="grid grid-cols-1 gap-4 list-none">
            <li><strong>Situasi Kelulusan Khas:</strong> {{ data.situasiKhas }}</li>
            <li><strong>Melibatkan Kadar Bantuan:</strong> {{ data.kadar ? 'Ya' : 'Tidak' }}</li>
          </ul>
        </template>
      </rs-card>

      <!-- 🔍 Hasil Siasatan -->
      <rs-card>
        <template #header>
          <h3 class="text-lg font-semibold">🔍 Hasil Siasatan</h3>
        </template>
        <template #body>
          <ul class="grid grid-cols-1 gap-4 list-none">
            <li><strong>Status Sokongan:</strong> {{ data.sokongan }}</li>
            <li><strong>Catatan Pengesyoran:</strong> {{ data.catatan }}</li>
            <li><strong>Tarikh Lawatan:</strong> {{ data.tarikhLawatan }}</li>
          </ul>
        </template>
      </rs-card>

      <!-- 💵 Maklumat Bantuan -->
      <rs-card>
        <template #header>
          <h3 class="text-lg font-semibold">💵 Maklumat Bantuan</h3>
        </template>
        <template #body>
          <ul class="grid grid-cols-1 gap-4 list-none">
            <li><strong>Kadar Bantuan (RM):</strong> {{ data.kadarBantuan }}</li>
            <li><strong>Tempoh/Kekerapan:</strong> {{ data.tempoh }}</li>
            <li><strong>Tarikh Mula:</strong> {{ data.mula }}</li>
            <li><strong>Tarikh Tamat:</strong> {{ data.tamat }}</li>
          </ul>
        </template>
      </rs-card>

      <!-- 💳 Maklumat Pembayaran -->
      <rs-card>
        <template #header>
          <h3 class="text-lg font-semibold">💳 Maklumat Pembayaran</h3>
        </template>
        <template #body>
          <ul class="grid grid-cols-1 gap-4 list-none">
            <li><strong>Penerima:</strong> {{ data.penerima }}</li>
            <li><strong>Nama Penerima:</strong> {{ data.namaPenerima }}</li>
            <li><strong>Kaedah Pembayaran:</strong> {{ data.kaedah }}</li>
            <li><strong>Nama Bank:</strong> {{ data.bank }}</li>
            <li><strong>No Akaun:</strong> {{ data.akaun }}</li>
          </ul>
        </template>
      </rs-card>
    </div>

    <!-- Kolum Kanan: Sticky Keputusan -->
    <div class="sticky top-24 self-start">
      <rs-card>
        <template #header>
          <h3 class="text-lg font-semibold">🖊️ Keputusan Pelulus</h3>
        </template>
        <template #body>
          <FormKit type="select" label="Status Kelulusan" v-model="keputusan" :options="statusOptions" />
          <FormKit type="textarea" label="Catatan Kelulusan (jika perlu)" v-model="catatan" rows="3" />
          <div class="flex justify-end mt-4 space-x-2">
            <rs-button variant="secondary" @click="handleBatal">Batal</rs-button>
            <rs-button variant="primary" @click="submitApproval">Sahkan</rs-button>
          </div>
        </template>
      </rs-card>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

const router = useRouter();
const toast = useToast();

const keputusan = ref('');
const catatan = ref('');

const statusOptions = [
  { label: '-- Pilih Status --', value: '', disabled: true },
  { label: 'Lulus', value: 'lulus' },
  { label: 'Tidak Lulus', value: 'gagal' },
];

const data = {
  noRujukan: 'PBKH-2025-00123',
  namaPemohon: 'Ahmad bin Abdullah',
  status: 'Untuk Semakan',
  tarikhTerima: '12 Julai 2025',
  pegawai: 'Pn. Salwa',
  situasiKhas: 'Pendapatan melebihi Had Kifayah',
  kadar: true,
  sokongan: 'Sokong',
  catatan: 'Layak dibantu walaupun tidak cukup umur.',
  tarikhLawatan: '10 Julai 2025',
  kadarBantuan: '300.00',
  tempoh: '6 bulan',
  mula: '1 Ogos 2025',
  tamat: '31 Januari 2026',
  penerima: 'Asnaf',
  namaPenerima: 'Ahmad bin Abdullah',
  kaedah: 'EFT',
  bank: 'Bank Islam',
  akaun: '1234567890'
};

const submitApproval = () => {
  if (!keputusan.value) {
    toast.error("Sila pilih status kelulusan dahulu.");
    return;
  }

  toast.success(
    keputusan.value === 'lulus'
      ? 'Permohonan telah diluluskan dengan jayanya.'
      : 'Permohonan tidak diluluskan.',
    { timeout: 4000, position: 'top-right' }
  );

  setTimeout(() => {
    router.push('/BF-BTN/PB/KH/01');
  }, 2000);
};

const handleBatal = () => {
  router.back();
};
</script>

<style scoped>
/* Optional: Animasi untuk notifikasi */
</style>
