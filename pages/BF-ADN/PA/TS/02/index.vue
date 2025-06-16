<<<<<<< HEAD
<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <div class="flex justify-between items-start mt-6 mb-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Maklumat Aduan</h1>
        <p class="mt-1 text-sm text-gray-600">Semak dan jalankan tindakan ke atas aduan yang diterima.</p>
      </div>
      <rs-badge variant="warning">Dalam Proses - Siasatan Ringkas</rs-badge>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Kiri: Kandungan Utama -->
      <div class="lg:col-span-2 space-y-6">

        <!-- Maklumat Aduan -->
        <rs-card>
          <template #header>
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Icon name="ph:note" class="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h2 class="text-md font-semibold text-gray-900">Maklumat Aduan</h2>
                <p class="text-sm text-gray-500">Butiran ringkas aduan & kelas</p>
              </div>
            </div>
          </template>
          <template #body>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit type="text" label="No. Aduan" :value="aduan.noAduan" disabled />
              <FormKit type="text" label="Tarikh Aduan" :value="formatDate(aduan.tarikhAduan)" disabled />
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


        <!-- Butiran Aduan -->
        <rs-card>
          <template #header>
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Icon name="ph:file-text" class="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h2 class="text-md font-semibold text-gray-900">Butiran Aduan</h2>
              </div>
            </div>
          </template>
          <template #body>
            <FormKit type="textarea" label="Pernyataan Masalah" :value="aduan.pernyataanMasalah" disabled />
            <FormKit type="textarea" label="Ringkasan Aduan" :value="aduan.ringkasanAduan" disabled class="mt-4" />
          </template>
        </rs-card>

        <!-- Maklumat Individu Dibantu -->
        <rs-card>
          <template #header>
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Icon name="ph:user" class="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 class="text-md font-semibold text-gray-900">Maklumat Individu Dibantu</h2>
                <p class="text-sm text-gray-500">Butiran lengkap individu yang dibantu</p>
              </div>
            </div>
          </template>
          <template #body>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit type="text" label="Nama Penuh" :value="aduan.namaPenuh" disabled />
              <FormKit type="text" label="No. KP" :value="aduan.noKp" disabled />
              <FormKit type="text" label="Emel" :value="aduan.emel" disabled />
              <FormKit type="text" label="No Telefon" :value="aduan.noTelefon" disabled />
              <FormKit type="text" label="Alamat" :value="aduan.alamat" disabled class="md:col-span-2" />
              <FormKit type="text" label="Daerah" :value="aduan.daerah" disabled />
              <FormKit type="text" label="Kariah" :value="aduan.kariah" disabled />
            </div>
          </template>
        </rs-card>

        <!-- Maklumat Pengadu -->
        <rs-card>
          <template #header>
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Icon name="ph:phone" class="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 class="text-md font-semibold text-gray-900">Maklumat Pengadu</h2>
              </div>
            </div>
          </template>
          <template #body>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit type="text" label="Nama Pengadu" :value="aduan.namaPengadu" disabled />
              <FormKit type="text" label="No KP Pengadu" :value="aduan.noKpPengadu" disabled />
              <FormKit type="text" label="Emel Pengadu" :value="aduan.emelPengadu" disabled />
              <FormKit type="text" label="No Telefon Pengadu" :value="aduan.noTelefonPengadu" disabled />
            </div>
          </template>
        </rs-card>

      </div>

      <!-- Kanan: Sidebar Siasatan Ringkas --> 
      <div class="lg:col-span-1 space-y-6">
        <rs-card class="sticky top-6">     
          <template #header>
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Icon name="ph:phone-call" class="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h2 class="text-lg font-semibold text-gray-900">Siasatan Ringkas</h2>
              </div>
            </div>
          </template>

          <template #body>
            <FormKit type="form" :actions="false" @submit="handleSimpan">
              <FormKit
                type="textarea"
                label="Catatan Siasatan"
                v-model="form.catatan"
                placeholder="Contoh: Pengadu sah tiada bekalan makanan..."
                validation="required"
              />

              <FormKit
                type="checkbox"
                label="Tukar Kategori Aduan"
                v-model="form.tukarKategori"
              />

              <div v-if="form.tukarKategori" >
                <FormKit
                  type="select"
                  label="Tahap Keperluan Baru"
                  v-model="form.tahapBaru"
                  :options="[
                    'Masih Ada Bekalan Makanan/Mempunyai Tempat Tinggal/Tiada Sumber Pendapatan (Kelas 2/Kuning)',
                    'Pendapatan Berkurangan/Keperluan Lain (Kelas 3/Hijau)'
                  ]"
                  validation="required"
                />
                 <FormKit
                    v-model="form.pegawaiBaru"
                    type="select"
                    label="Pegawai Baru"
                    :options="senaraiPegawai"
                    validation="required"
                    validation-visibility="dirty"
                  />

                <FormKit
                  type="textarea"
                  label="Catatan Agihan Semula"
                  v-model="form.catatanAgih"
                  class="md:col-span-2"
                />
              </div>

              <!-- Buttons -->
                <div class="flex justify-between items-center mt-6">
                  <rs-button
                    type="button"
                    variant="secondary"
                    @click="router.back()"
                  >
                    Kembali
                  </rs-button>
                  <rs-button type="submit" variant="primary" @click="handleSubmit">
                    <Icon name="material-symbols:save" class="mr-1" size="16" /> Simpan
                  </rs-button>
                </div>

             
            </FormKit>
          </template>
        </rs-card>
      </div>
    </div>

 
     <!-- Confirmation Modal -->
    <rs-modal
      v-model="showConfirmationModal"
      title="Pengesahan"
      position="center"
      :actions="false"
    >
      <template #body>
        <p class="text-gray-700">
          Adakah anda pasti untuk menyimpan dan meneruskan siasatan ringkas ini?
        </p>
      </template>
      <template #footer>
        <div class="flex justify-end gap-4">
          <rs-button
            variant="secondary"
            @click="showConfirmationModal = false"
          >
            Batal
          </rs-button>
          <rs-button
            variant="primary"
            @click="confirmSubmit"
          >
            Ya, Teruskan
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from "vue-router";

const router = useRouter();

const breadcrumb = [
  { name: 'Aduan', type: 'link', path: '/aduan' },
  { name: 'Senarai Aduan', type: 'link', path: '/aduan/senarai' },
  { name: 'Maklumat Aduan', type: 'current' }
];

const showAcceptModal = ref(false);
const isAccepted = ref(false);

const aduan = ref({
  noAduan: 'ADN-2024-001',
  tarikhAduan: '2024-03-15T08:00:00',
  namaPenuh: 'Ahmad Zulkifli',
  noKp: '850101-14-5677',
  emel: 'ahmad.zul@email.com',
  noTelefon: '0123456789',
  alamat: 'No 1, Jalan Melati, Taman Harmoni',
  daerah: 'Petaling',
  kariah: 'Kariah Seksyen 7',
  namaPengadu: 'Ahmad Zulkifli',
  noKpPengadu: '850101-14-5677',
  emelPengadu: 'ahmad.zul@email.com',
  noTelefonPengadu: '0123456789',
  pernyataanMasalah: 'Terputus bekalan makanan (Kelas 1/Merah)',
  ringkasanAduan: 'Tiada makanan, tinggal seorang diri dan uzur.',
  status: 'Aduan baru'
});

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleString('ms-MY', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};


const showConfirmationModal = ref(false);

const handleSubmit = async () => {
  showConfirmationModal.value = true;
};

const confirmSubmit = async () => {
  showConfirmationModal.value = false;
  
  // Update status to "Sedang Diproses" if not already
  if (aduanData.value.status === "Belum Selesai") {
    aduanData.value.status = "Sedang Diproses";
  }

  // If pernyataan masalah was updated
  if (siasatanData.value.perluKemaskini === 'perlu' && siasatanData.value.tahapKeperluanBaru) {
    const selectedOption = tahapKeperluanOptions.value.find(
      (opt) => opt.value === siasatanData.value.tahapKeperluanBaru
    );
    if (selectedOption) {
      aduanData.value.pernyataanMasalah = selectedOption.label;
    }
  }

  // Navigate to next step
  router.push("/BF-ADN/PA/TS/04");
};

const getStatusVariant = (status) => {
  const variants = {
    "Aduan Baru": "warning",
    "Dalam Proses - Siasatan Ringkas": "primary",
    "Dalam Proses - Quick Assessment": "primary",
    "Dalam Proses - Siasatan Lapangan": "primary",
    "Menunggu Kelulusan Bantuan": "info",
    "Menunggu Serahan Bantuan": "info",
    "Selesai": "success",
    "Ditutup": "danger",
  };
  return variants[status] || "default";
};

const form = ref({
  catatan: '',
  tukarKategori: false,
  tahapBaru: '',
  pegawaiBaru: '',
  catatanAgih: ''
});

const handleSimpan = () => {
  alert('Maklumat siasatan disimpan.');
};

const senaraiPegawai = [
  { label: "En Ali", value: "ali_eoad" },
  { label: "Pn Aliah", value: "aliah_eoad" },
  { label: "En Abu", value: "abu_ssu" },
  { label: "En Ahmad", value: "ahmad_ej" },
];
</script>
=======
<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <div class="flex justify-between items-start mt-6 mb-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Maklumat Aduan</h1>
        <p class="mt-1 text-sm text-gray-600">Semak dan jalankan tindakan ke atas aduan yang diterima.</p>
      </div>
      <rs-badge variant="warning">Dalam Proses - Siasatan Ringkas</rs-badge>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Kiri: Kandungan Utama -->
      <div class="lg:col-span-2 space-y-6">

        <!-- Maklumat Aduan -->
        <rs-card>
          <template #header>
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Icon name="ph:note" class="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h2 class="text-md font-semibold text-gray-900">Maklumat Aduan</h2>
                <p class="text-sm text-gray-500">Butiran ringkas aduan & kelas</p>
              </div>
            </div>
          </template>
          <template #body>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit type="text" label="No. Aduan" :value="aduan.noAduan" disabled />
              <FormKit type="text" label="Tarikh Aduan" :value="formatDate(aduan.tarikhAduan)" disabled />
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


        <!-- Butiran Aduan -->
        <rs-card>
          <template #header>
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Icon name="ph:file-text" class="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h2 class="text-md font-semibold text-gray-900">Butiran Aduan</h2>
              </div>
            </div>
          </template>
          <template #body>
            <FormKit type="textarea" label="Pernyataan Masalah" :value="aduan.pernyataanMasalah" disabled />
            <FormKit type="textarea" label="Ringkasan Aduan" :value="aduan.ringkasanAduan" disabled class="mt-4" />
          </template>
        </rs-card>

        <!-- Maklumat Individu Dibantu -->
        <rs-card>
          <template #header>
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Icon name="ph:user" class="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 class="text-md font-semibold text-gray-900">Maklumat Individu Dibantu</h2>
                <p class="text-sm text-gray-500">Butiran lengkap individu yang dibantu</p>
              </div>
            </div>
          </template>
          <template #body>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit type="text" label="Nama Penuh" :value="aduan.namaPenuh" disabled />
              <FormKit type="text" label="No. KP" :value="aduan.noKp" disabled />
              <FormKit type="text" label="Emel" :value="aduan.emel" disabled />
              <FormKit type="text" label="No Telefon" :value="aduan.noTelefon" disabled />
              <FormKit type="text" label="Alamat" :value="aduan.alamat" disabled class="md:col-span-2" />
              <FormKit type="text" label="Daerah" :value="aduan.daerah" disabled />
              <FormKit type="text" label="Kariah" :value="aduan.kariah" disabled />
            </div>
          </template>
        </rs-card>

        <!-- Maklumat Pengadu -->
        <rs-card>
          <template #header>
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Icon name="ph:phone" class="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 class="text-md font-semibold text-gray-900">Maklumat Pengadu</h2>
              </div>
            </div>
          </template>
          <template #body>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit type="text" label="Nama Pengadu" :value="aduan.namaPengadu" disabled />
              <FormKit type="text" label="No KP Pengadu" :value="aduan.noKpPengadu" disabled />
              <FormKit type="text" label="Emel Pengadu" :value="aduan.emelPengadu" disabled />
              <FormKit type="text" label="No Telefon Pengadu" :value="aduan.noTelefonPengadu" disabled />
            </div>
          </template>
        </rs-card>

      </div>

      <!-- Kanan: Sidebar Siasatan Ringkas --> 
      <div class="lg:col-span-1 space-y-6">
        <rs-card class="sticky top-6">     
          <template #header>
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Icon name="ph:phone-call" class="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h2 class="text-lg font-semibold text-gray-900">Siasatan Ringkas</h2>
              </div>
            </div>
          </template>

          <template #body>
            <FormKit type="form" :actions="false" @submit="handleSimpan">
              <FormKit
                type="textarea"
                label="Catatan Siasatan"
                v-model="form.catatan"
                placeholder="Contoh: Pengadu sah tiada bekalan makanan..."
                validation="required"
              />

              <FormKit
                type="checkbox"
                label="Tukar Kategori Aduan"
                v-model="form.tukarKategori"
              />

              <div v-if="form.tukarKategori" >
                <FormKit
                  type="select"
                  label="Tahap Keperluan Baru"
                  v-model="form.tahapBaru"
                  :options="[
                    'Masih Ada Bekalan Makanan/Mempunyai Tempat Tinggal/Tiada Sumber Pendapatan (Kelas 2/Kuning)',
                    'Pendapatan Berkurangan/Keperluan Lain (Kelas 3/Hijau)'
                  ]"
                  validation="required"
                />
                 <FormKit
                    v-model="form.pegawaiBaru"
                    type="select"
                    label="Pegawai Baru"
                    :options="senaraiPegawai"
                    validation="required"
                    validation-visibility="dirty"
                  />

                <FormKit
                  type="textarea"
                  label="Catatan Agihan Semula"
                  v-model="form.catatanAgih"
                  class="md:col-span-2"
                />
              </div>

              <!-- Buttons -->
                <div class="flex justify-between items-center mt-6">
                  <rs-button
                    type="button"
                    variant="secondary"
                    @click="router.back()"
                  >
                    Kembali
                  </rs-button>
                  <rs-button type="submit" variant="primary" @click="handleSubmit">
                    <Icon name="material-symbols:save" class="mr-1" size="16" /> Simpan
                  </rs-button>
                </div>

             
            </FormKit>
          </template>
        </rs-card>
      </div>
    </div>

 
     <!-- Confirmation Modal -->
    <rs-modal
      v-model="showConfirmationModal"
      title="Pengesahan"
      position="center"
      :actions="false"
    >
      <template #body>
        <p class="text-gray-700">
          Adakah anda pasti untuk menyimpan dan meneruskan siasatan ringkas ini?
        </p>
      </template>
      <template #footer>
        <div class="flex justify-end gap-4">
          <rs-button
            variant="secondary"
            @click="showConfirmationModal = false"
          >
            Batal
          </rs-button>
          <rs-button
            variant="primary"
            @click="confirmSubmit"
          >
            Ya, Teruskan
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from "vue-router";

const router = useRouter();

const breadcrumb = [
  { name: 'Aduan', type: 'link', path: '/aduan' },
  { name: 'Senarai Aduan', type: 'link', path: '/aduan/senarai' },
  { name: 'Maklumat Aduan', type: 'current' }
];

const showAcceptModal = ref(false);
const isAccepted = ref(false);

const aduan = ref({
  noAduan: 'ADN-2024-001',
  tarikhAduan: '2024-03-15T08:00:00',
  namaPenuh: 'Ahmad Zulkifli',
  noKp: '850101-14-5677',
  emel: 'ahmad.zul@email.com',
  noTelefon: '0123456789',
  alamat: 'No 1, Jalan Melati, Taman Harmoni',
  daerah: 'Petaling',
  kariah: 'Kariah Seksyen 7',
  namaPengadu: 'Ahmad Zulkifli',
  noKpPengadu: '850101-14-5677',
  emelPengadu: 'ahmad.zul@email.com',
  noTelefonPengadu: '0123456789',
  pernyataanMasalah: 'Terputus bekalan makanan (Kelas 1/Merah)',
  ringkasanAduan: 'Tiada makanan, tinggal seorang diri dan uzur.',
  status: 'Aduan baru'
});

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleString('ms-MY', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};


const showConfirmationModal = ref(false);

const handleSubmit = async () => {
  showConfirmationModal.value = true;
};

const confirmSubmit = async () => {
  showConfirmationModal.value = false;
  
  // Update status to "Sedang Diproses" if not already
  if (aduanData.value.status === "Belum Selesai") {
    aduanData.value.status = "Sedang Diproses";
  }

  // If pernyataan masalah was updated
  if (siasatanData.value.perluKemaskini === 'perlu' && siasatanData.value.tahapKeperluanBaru) {
    const selectedOption = tahapKeperluanOptions.value.find(
      (opt) => opt.value === siasatanData.value.tahapKeperluanBaru
    );
    if (selectedOption) {
      aduanData.value.pernyataanMasalah = selectedOption.label;
    }
  }

  // Navigate to next step
  router.push("/BF-ADN/PA/TS/04");
};

const getStatusVariant = (status) => {
  const variants = {
    "Aduan Baru": "warning",
    "Dalam Proses - Siasatan Ringkas": "primary",
    "Dalam Proses - Quick Assessment": "primary",
    "Dalam Proses - Siasatan Lapangan": "primary",
    "Menunggu Kelulusan Bantuan": "info",
    "Menunggu Serahan Bantuan": "info",
    "Selesai": "success",
    "Ditutup": "danger",
  };
  return variants[status] || "default";
};

const form = ref({
  catatan: '',
  tukarKategori: false,
  tahapBaru: '',
  pegawaiBaru: '',
  catatanAgih: ''
});

const handleSimpan = () => {
  alert('Maklumat siasatan disimpan.');
};

const senaraiPegawai = [
  { label: "En Ali", value: "ali_eoad" },
  { label: "Pn Aliah", value: "aliah_eoad" },
  { label: "En Abu", value: "abu_ssu" },
  { label: "En Ahmad", value: "ahmad_ej" },
];
</script>
>>>>>>> 3dcc227fdaa7aaa5e054a6ffebfa8addde014eae
