<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Kandungan Utama -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Maklumat Aduan -->
        <rs-card>
          <template #header>
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Icon name="ph:info" class="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 class="text-lg font-semibold text-gray-900">Maklumat Aduan</h2>
                <p class="text-sm text-gray-500">Butiran aduan semasa siasatan lapangan</p>
              </div>
            </div>
          </template>
          <template #body>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit type="text" label="No. Aduan" :value="aduan.noAduan" disabled />
              <FormKit type="text" label="Nama Pengadu" :value="aduan.nama" disabled />
              <FormKit type="text" label="Tarikh Aduan" :value="aduan.tarikh" disabled />
              <FormKit type="text" label="Kategori" :value="aduan.kategori" disabled />
              <FormKit type="text" label="Status Semasa" :value="aduan.status" disabled />
            </div>
          </template>
        </rs-card>

        <!-- SLA Section -->
        <rs-card>
            <template #header>
                <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Icon name="ph:timer" class="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                    <h2 class="text-lg font-semibold text-gray-900">Pemantauan SLA</h2>
                    <p class="text-sm text-gray-500">Tempoh siasatan yang dibenarkan</p>
                </div>
                </div>
            </template>

            <template #body>
                <div class="space-y-4">
                <div class="text-sm text-gray-600">
                    SLA Ditetapkan: <strong>24 jam</strong><br />
                    Baki Masa: <strong class="text-red-600">5 jam</strong>
                </div>

                <!-- Progress Bar -->
                <div class="w-full bg-gray-200 rounded-full h-3">
                    <div
                    class="bg-indigo-600 h-3 rounded-full"
                    style="width: calc((19 / 24) * 100%)"
                    ></div>
                </div>

                <div class="flex justify-between text-xs text-gray-500 mt-1">
                    <span>24 jam</span>
                    <span>5 jam baki</span>
                </div>
                </div>
            </template>
        </rs-card>

        <!-- Status Profil Pemohon -->
        <!-- Status Pemohon -->
          <rs-card>
  <template #header>
    <div class="flex items-center space-x-3">
      <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
        <Icon name="ph:user-focus" class="w-6 h-6 text-blue-600" />
      </div>
      <div>
        <h2 class="text-lg font-semibold text-gray-900">Status Pemohon</h2>
        <p class="text-sm text-gray-500">Individu ini berdaftar sebagai penerima bantuan zakat (status: {{ aduan?.kategoriAsnaf || 'Belum Dikenalpasti' }})</p>
      </div>
    </div>
  </template>

  <template #body>
    <div class="space-y-3">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <p class="text-sm text-gray-500">Status Profil</p>
          <p class="font-medium text-gray-800">
            {{ aduan?.statusProfil || 'Tidak Diketahui' }}
          </p>
        </div>
        <div>
          <p class="text-sm text-gray-500">Kategori Asnaf</p>
          <p class="font-medium text-gray-800">
            {{ aduan?.kategoriAsnaf || 'Tiada Maklumat' }}
          </p>
        </div>
      </div>

      <div>
        <rs-button
          v-if="aduan?.statusProfil === 'Sudah Berdaftar'"
          variant="primary-outline"
          @click="navigateToKemaskiniProfil"
        >
          Kemaskini Profil
        </rs-button>
        <rs-button
          v-else
          variant="primary"
          @click="navigateToDaftarAsnaf"
        >
          Daftar Asnaf
        </rs-button>
      </div>
    </div>
  </template>
</rs-card>


          <!-- Senarai Bantuan Terdahulu -->
          <rs-card>
            <template #header>
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Icon name="mdi:charity" class="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-gray-900">Senarai Bantuan Sebelumnya</h2>
                  <p class="text-sm text-gray-500">Rekod bantuan yang telah diterima pemohon</p>
                </div>
              </div>
            </template>

            <template #body>
              <rs-table
                :data="bantuanList"
                :columns="columns"
                :pageSize="pageSize"
                :showNoColumn="true"
                :options="{
                    variant: 'default',
                    hover: true,
                    striped: true,
                }"
                :options-advanced="{
                    sortable: true,
                    filterable: true,
                }"
                advanced
                >
                <template v-slot:status="{ text }">
                    <rs-badge :variant="text === 'Selesai' ? 'success' : 'warning'">{{ text }}</rs-badge>
                </template>
                
            </rs-table>
            </template>
          </rs-card>


        
      </div>

      <!-- Sidebar Kanan -->
      <div class="space-y-6">
        <!-- Siasatan Lapangan -->
        <rs-card>
          <template #header>
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Icon name="ph:map-pin" class="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h2 class="text-lg font-semibold text-gray-900">Siasatan Lapangan</h2>
                <p class="text-sm text-gray-500">Maklumat hasil lawatan ke lokasi</p>
              </div>
            </div>
          </template>
          <template #body>
            <FormKit type="textarea" label="Nota Siasatan" v-model="formData.notaSiasatan" />
            <FormKit type="text" label="Lokasi Agihan" v-model="formData.lokasiAgihan" />
            <FormKit type="file" label="Lampiran Bukti Bergambar" v-model="formData.buktiGambar" multiple />
          </template>
        </rs-card>

        <!-- Agihan Bantuan Tunai -->
        <rs-card>
          <template #header>
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Icon name="ph:wallet" class="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 class="text-lg font-semibold text-gray-900">Agihan Bantuan Tunai</h2>
                <p class="text-sm text-gray-500">Maklumat pemberian bantuan di lapangan</p>
              </div>
            </div>
          </template>
          <template #body>
            <FormKit type="number" label="Jumlah Bantuan (RM)" v-model="formData.jumlahBantuan" help="Maksimum RM500" />
            <FormKit type="text" label="Tarikh Agihan" :value="formattedNow" disabled />
            <FormKit type="textarea" label="Catatan Tambahan" v-model="formData.catatanBantuan" />
          </template>
        </rs-card>

        <!-- Status dan Simpan -->
        <rs-card>
          <template #header>
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Icon name="ph:check-circle" class="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h2 class="text-lg font-semibold text-gray-900">Kemaskini Status Aduan</h2>
                <p class="text-sm text-gray-500">Tindakan susulan selepas agihan</p>
              </div>
            </div>
          </template>
          <template #body>
            <FormKit type="select" label="Keputusan Siasatan" v-model="formData.keputusan" :options="['Selesai', 'Tidak Layak', 'Rujuk Lanjut']" />
            <FormKit type="textarea" label="Justifikasi / Nota Tambahan" v-model="formData.catatanKeputusan" />
            <div class="flex justify-end gap-4 mt-6">
              <rs-button variant="primary-outline" @click="handleCancel">Batal</rs-button>
              <rs-button variant="primary" @click="handleSubmit">Simpan & Serah</rs-button>
            </div>
          </template>
        </rs-card>
        
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref } from 'vue';

const breadcrumb = [
  { name: 'Pengurusan Aduan', path: '/BF-ADN/PA', type: 'link' },
  { name: 'Siasatan Lapangan & Agih Tunai', type: 'current' }
];

const today = new Date().toLocaleDateString('ms-MY', {
  year: 'numeric', month: 'long', day: 'numeric'
});

const aduan = ref({
  noAduan: 'ADN-2025-004',
  kategori: 'Kelas 1',
  nama: 'Ali bin Ahmad',
  tarikh: '2025-06-12',
  status: 'Dalam Siasatan',
   statusProfil: 'Sudah Berdaftar',
  kategoriAsnaf: 'Fakir'
});

const formData = ref({
  notaSiasatan: '',
  lokasiAgihan: '',
  jumlah: null,
  catatanBantuan: '',
  statusAkhir: '',
  justifikasi: '',
 
});

const handleSubmit = () => {
  alert('Maklumat siasatan dan agihan telah disimpan.');
};

const handleCancel = () => {
  window.history.back();
};

const bantuanList = [
  {
    no: 1,
    rujukan: 'BNT-2023-0045',
    nama: 'Ali bin Ahmad',
    bantuan: 'Bantuan Keperluan Hidup',
    tarikhTerima: '15/12/2023',
    pegawai: 'Nor Azizah',
    tarikhSemakan: '16/12/2023',
    status: 'Selesai'
  },
  {
    no: 2,
    rujukan: 'BNT-2024-0002',
    nama: 'Ali bin Ahmad',
    bantuan: 'Bantuan Bulanan Kewangan',
    tarikhTerima: '10/01/2024',
    pegawai: 'Zulkifli Hasan',
    tarikhSemakan: '11/01/2024',
    status: 'Selesai'
  }
];
</script>
