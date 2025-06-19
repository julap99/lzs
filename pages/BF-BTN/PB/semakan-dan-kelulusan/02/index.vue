<template>
  <div class="min-h-screen">
    <LayoutsBreadcrumb :items="breadcrumb" />

    <div class="mt-6 mb-8">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Semakan Permohonan</h1>
        </div>
        <rs-badge :variant="getStatusVariant(permohonan.statusPermohonan)" class="text-sm px-4 py-2">
          {{ permohonan.statusPermohonan }}
        </rs-badge>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Sidebar (Ulasan) -->
      <div class="lg:col-span-1">
        <rs-card class="shadow-sm border-0 bg-white sticky top-6">
          <template #header>
            <div class="flex items-center space-x-3">
              <div class="flex-shrink-0">
                <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <Icon name="ph:clipboard-text" class="w-6 h-6 text-red-600" />
                </div>
              </div>
              <div>
                <h2 class="text-lg font-semibold text-gray-900">Ulasan</h2>
                <p class="text-sm text-gray-500">Status & Catatan Semakan</p>
              </div>
            </div>
          </template>
          <template #body>
            <div class="space-y-6">
              <!-- Status Selection -->
              <div class="space-y-1">
                <FormKit
                  type="select"
                  name="statusPermohonanBaru"
                  label="Status Permohonan"
                  v-model="ulasan.statusPermohonanBaru"
                  :options="statusPermohonanOptions"
                  validation="required"
                  :validation-messages="{ required: 'Status permohonan diperlukan' }"
                  placeholder="Pilih status"
                  :classes="{ outer: 'mb-0' }"
                />
              </div>
              <!-- Catatan Pegawai -->
              <div class="space-y-1">
                <FormKit
                  type="textarea"
                  name="catatanPegawai"
                  label="Catatan Pegawai"
                  rows="4"
                  v-model="ulasan.catatanPegawai"
                  :validation="ulasan.statusPermohonanBaru === 'Tidak Lengkap' ? 'required' : ''"
                  :validation-messages="{ required: 'Catatan diperlukan untuk status Tidak Lengkap' }"
                  placeholder="Masukkan catatan pegawai (wajib jika Tidak Lengkap)"
                  :classes="{ outer: 'mb-0' }"
                />
              </div>
              <!-- Tarikh Semak -->
              <div class="space-y-1">
                <label class="text-sm font-medium text-gray-700">Tarikh Semak</label>
                <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                  <span class="text-sm text-gray-900">{{ tarikhSemak }}</span>
                </div>
              </div>
              <!-- Action Buttons -->
              <div class="space-y-3 pt-4 border-t">
                <rs-button variant="success" class="w-full !py-3 text-sm font-medium" @click="handleSahkan">
                  <Icon name="ph:check-circle" class="w-5 h-5 mr-2" />
                  Sahkan Kelulusan
                </rs-button>
                <rs-button variant="primary-outline" class="w-full !py-3 text-sm font-medium" @click="handleBatal">
                  <Icon name="ph:arrow-left" class="w-5 h-5 mr-2" />
                  Batal / Kembali
                </rs-button>
              </div>
            </div>
          </template>
        </rs-card>
      </div>
      <!-- Main Content -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Maklumat Permohonan -->
        <rs-card class="shadow-sm border-0 bg-white">
          <template #header>
            <div class="flex items-center space-x-3">
              <div class="flex-shrink-0">
                <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Icon name="ph:info" class="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div>
                <h2 class="text-lg font-semibold text-gray-900">Maklumat Permohonan</h2>
                <p class="text-sm text-gray-500">Butiran permohonan</p>
              </div>
            </div>
          </template>
          <template #body>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="text-sm font-medium text-gray-700">ID Permohonan</label>
                <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                  <span class="text-sm text-gray-900">{{ permohonan.idPermohonan }}</span>
                </div>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-700">Nama Pemohon</label>
                <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                  <span class="text-sm text-gray-900">{{ permohonan.namaPemohon }}</span>
                </div>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-700">No. KP Pemohon</label>
                <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                  <span class="text-sm text-gray-900">{{ permohonan.noKpPemohon }}</span>
                </div>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-700">Tarikh Permohonan</label>
                <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                  <span class="text-sm text-gray-900">{{ permohonan.tarikhPermohonan }}</span>
                </div>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-700">Status Permohonan</label>
                <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                  <span class="text-sm text-gray-900">{{ permohonan.statusPermohonan }}</span>
                </div>
              </div>
            </div>
          </template>
        </rs-card>
        <!-- Bantuan Table -->
        <rs-card class="shadow-sm border-0 bg-white">
          <template #header>
            <div class="flex items-center space-x-3">
              <div class="flex-shrink-0">
                <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Icon name="ph:list" class="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div>
                <h2 class="text-lg font-semibold text-gray-900">Bantuan</h2>
                <p class="text-sm text-gray-500">Senarai bantuan permohonan</p>
              </div>
            </div>
          </template>
          <template #body>
            <div class="overflow-x-auto">
              <table class="w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Bantuan</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kadar</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status Kelulusan</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PA No/GL No/PR No</th>
                    <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="(bantuan, idx) in bantuanList" :key="idx" class="hover:bg-gray-50">
                    <td class="px-4 py-3 text-sm text-gray-900">{{ bantuan.namaBantuan }}</td>
                    <td class="px-4 py-3 text-sm text-gray-900">{{ bantuan.kadar }}</td>
                    <td class="px-4 py-3 text-sm">
                      <rs-badge :variant="getKelulusanVariant(bantuan.statusKelulusan)">
                        {{ bantuan.statusKelulusan }}
                      </rs-badge>
                    </td>
                    <td class="px-4 py-3 text-sm">
                      <rs-badge variant="info">{{ bantuan.status }}</rs-badge>
                    </td>
                    <td class="px-4 py-3 text-sm text-gray-900">{{ bantuan.paNo }}</td>
                    <td class="px-4 py-3 text-center">
                      <rs-button variant="primary" size="sm" @click="handleAksi(bantuan)">
                        <Icon name="ph:eye" class="w-4 h-4" />
                        Lihat
                      </rs-button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </template>
        </rs-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const breadcrumb = ref([
  { name: 'Permohonan Bantuan', type: 'link', path: '/BF-BTN/PB/senarai' },
  { name: 'Semakan & Kelulusan', type: 'link', path: '/BF-BTN/PB/semakan-dan-kelulusan/01' },
  { name: 'Maklumat Permohonan', type: 'current', path: '/BF-BTN/PB/semakan-dan-kelulusan/02' },
]);

const permohonan = ref({
  idPermohonan: 'PB-2024-0001',
  namaPemohon: 'Ali bin Abu',
  noKpPemohon: '900101-01-1234',
  tarikhPermohonan: '2024-06-10',
  statusPermohonan: 'Dalam Proses',
});

const bantuanList = ref([
  {
    namaBantuan: 'Bantuan Kewangan Bulanan',
    kadar: 'RM 500',
    statusKelulusan: 'Lulus',
    status: 'Dalam Proses',
    paNo: 'PA-2024-001',
  },
  {
    namaBantuan: 'Bantuan Persekolahan',
    kadar: 'RM 200',
    statusKelulusan: 'Tidak Lulus',
    status: 'Dalam Proses',
    paNo: '-',
  },
  {
    namaBantuan: 'Bantuan Sewa Rumah',
    kadar: 'RM 300',
    statusKelulusan: '-',
    status: 'Dalam Proses',
    paNo: '-',
  },
]);

const ulasan = ref({
  statusPermohonanBaru: '',
  catatanPegawai: '',
});

const statusPermohonanOptions = [
  { label: 'Baru', value: 'Baru' },
  { label: 'Dalam Proses', value: 'Dalam Proses' },
  { label: 'Lulus', value: 'Lulus' },
  { label: 'Tidak Lulus', value: 'Tidak Lulus' },
  { label: 'Tidak Lengkap', value: 'Tidak Lengkap' },
];

const tarikhSemak = new Date().toLocaleDateString('en-GB');

function handleAksi(bantuan) {
  alert(`Lihat bantuan: ${bantuan.namaBantuan}`);
}

function handleSahkan() {
  alert('Sahkan Kelulusan clicked');
}

function handleBatal() {
  alert('Batal / Kembali clicked');
}

function getStatusVariant(status) {
  const variants = {
    'Dalam Proses': 'info',
    'Lulus': 'success',
    'Tidak Lulus': 'danger',
  };
  return variants[status] || 'default';
}

function getKelulusanVariant(status) {
  const variants = {
    'Lulus': 'success',
    'Tidak Lulus': 'danger',
    '-': 'secondary',
  };
  return variants[status] || 'default';
}
</script>

<style lang="scss" scoped>
</style>