<template>
  <div class="min-h-screen">
    <div class="  ">
      <LayoutsBreadcrumb :items="breadcrumb" />

      <!-- Page Header -->
      <div class="mt-6 mb-8">
        <div
          class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Semakan Permohonan</h1>
            <p class="mt-1 text-sm text-gray-600">
              Semak dan kemaskini status permohonan bantuan
            </p>
          </div>
          <rs-badge
            :variant="getStatusVariant(permohonanData.status)"
            class="text-sm px-4 py-2"
          >
            {{ permohonanData.status }}
          </rs-badge>
        </div>
      </div>

      <div class="space-y-6">
        <!-- Main Content -->
        <div class="space-y-6">
          <!-- Maklumat Pemohon Card -->
          <rs-card class="shadow-sm border-0 bg-white">
            <template #header>
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div
                    class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"
                  >
                    <Icon name="ph:user" class="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-gray-900">
                    Maklumat Pemohon
                  </h2>
                  <p class="text-sm text-gray-500">
                    Butiran pemohon dari profil
                  </p>
                </div>
              </div>
            </template>

            <template #body>
              <FormKit
                type="form"
                :actions="false"
                @submit="handleSubmit"
                v-model="formData"
              >
                <!-- Section 1: Maklumat Pemohon -->
                <rs-fieldset class="mb-6">
                  <template #legend>
                    <h3 class="text-lg font-medium">Information</h3>
                  </template>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div v-if="formData.nama">
                      <label class="block text-sm font-medium text-gray-700 mb-1"
                        >Nama</label
                      >
                      <p class="text-gray-900">{{ formData.nama }}</p>
                    </div>
                    <div v-if="formData.noPendaftaran">
                      <label class="block text-sm font-medium text-gray-700 mb-1"
                        >No Pendaftaran</label
                      >
                      <p class="text-gray-900">{{ formData.noPendaftaran }}</p>
                    </div>
                    <div v-if="formData.struktur">
                      <label class="block text-sm font-medium text-gray-700 mb-1"
                        >Struktur</label
                      >
                      <p class="text-gray-900">{{ formData.struktur }}</p>
                    </div>
                    <div v-if="formData.alamat">
                      <label class="block text-sm font-medium text-gray-700 mb-1"
                      >Alamat</label
                    >
                      <p class="text-gray-900">{{ formData.alamat }}</p>
                    </div>
                    <div v-if="formData.kariah">
                      <label class="block text-sm font-medium text-gray-700 mb-1"
                        >Kariah</label
                      >
                      <p class="text-gray-900">{{ formData.kariah }}</p>
                  </div>
                    <div v-if="formData.daerah">
                      <label class="block text-sm font-medium text-gray-700 mb-1"
                        >Daerah</label
                      >
                      <p class="text-gray-900">{{ formData.daerah }}</p>
                    </div>
                    <div v-if="formData.jenisPengenalan">
                      <label class="block text-sm font-medium text-gray-700 mb-1"
                        >Jenis Pengenalan</label
                      >
                      <p class="text-gray-900">{{ formData.jenisPengenalan }}</p>
                  </div>
                    <div v-if="formData.noPengenalan">
                      <label class="block text-sm font-medium text-gray-700 mb-1"
                        >No Pengenalan</label
                      >
                      <p class="text-gray-900">{{ formData.noPengenalan }}</p>
                    </div>
                    <div v-if="formData.namaWakil">
                      <label class="block text-sm font-medium text-gray-700 mb-1"
                        >Nama Wakil</label
                      >
                      <p class="text-gray-900">{{ formData.namaWakil }}</p>
                    </div>
                    <div v-if="formData.noTelefon">
                      <label class="block text-sm font-medium text-gray-700 mb-1"
                        >No Telefon</label
                      >
                      <p class="text-gray-900">{{ formData.noTelefon }}</p>
                  </div>
                    <div v-if="formData.email">
                      <label class="block text-sm font-medium text-gray-700 mb-1"
                        >E-mel</label
                      >
                      <p class="text-gray-900">{{ formData.email }}</p>
                    </div>
                    <div v-if="formData.statusOrganisasi">
                      <label class="block text-sm font-medium text-gray-700 mb-1"
                        >Status Organisasi</label
                      >
                      <p class="text-gray-900">{{ formData.statusOrganisasi }}</p>
                  </div>
                    <div v-if="formData.statusKeluarga">
                      <label class="block text-sm font-medium text-gray-700 mb-1"
                        >Status Keluarga</label
                      >
                      <p class="text-gray-900">{{ formData.statusKeluarga }}</p>
                  </div>
                    <div v-if="formData.statusIndividu">
                      <label class="block text-sm font-medium text-gray-700 mb-1"
                      >Status Individu</label
                    >
                      <p class="text-gray-900">{{ formData.statusIndividu }}</p>
                    </div>
                    <div v-if="formData.statusMultidimensi">
                      <label class="block text-sm font-medium text-gray-700 mb-1"
                      >Status Multidimensi</label
                    >
                      <p class="text-gray-900">{{ formData.statusMultidimensi }}</p>
                    </div>
                  </div>
                </rs-fieldset>
              </FormKit>
            </template>
          </rs-card>

          <div class="mt-8 grid grid-cols-1 xl:grid-cols-2 gap-6">
          <!-- Senarai Bantuan Card -->
            <div class="col-span-1">
          <rs-card class="shadow-sm border-0 bg-white">
            <template #header>
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div
                    class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center"
                  >
                    <Icon
                      name="ph:list-bullets"
                      class="w-6 h-6 text-purple-600"
                    />
                  </div>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-gray-900">
                    Senarai Bantuan
                  </h2>
                  <p class="text-sm text-gray-500">
                    Bantuan yang dipohon dan status dokumen
                  </p>
                </div>
              </div>
            </template>

            <template #body>
              <div class="overflow-x-auto">
                <table class="w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No.</th>
                          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis Bantuan</th>
                          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SLA</th>
                          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tindakan</th>
                    </tr>
                  </thead>
                      <tbody v-if="formData.senaraiBantuan.length" class="bg-white divide-y divide-gray-200">
                    <tr
                      v-for="(bantuan, index) in formData.senaraiBantuan"
                      :key="bantuan.id"
                      class="hover:bg-gray-50 transition-colors duration-200"
                            :class="getTableRowClass(bantuan.status)"
                          >
                            <td class="px-6 py-4 whitespace-nowrap">{{ index + 1 }}</td>
                            <td class="px-6 py-4 whitespace-nowrap">{{ bantuan.id }}</td>
                      <td class="px-6 py-4 whitespace-nowrap">
                              <div class="flex items-center">
                                <div class="w-3 h-3 rounded-full mr-3 flex-shrink-0" :class="getBantuanIndicatorClass(bantuan.status)"></div>
                                <div class="text-sm font-medium text-gray-900">{{ bantuan.jenisBantuan }}</div>
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                              <rs-badge variant="primary" class="text-xs">{{ (bantuan.status || 'Lengkap').toUpperCase() }}</rs-badge>
                      </td>
                            <td class="px-6 py-4 whitespace-nowrap">{{ bantuan.sla || '-' }}</td>
                      <td class="px-6 py-4 whitespace-nowrap">
                              <rs-button variant="primary-outline" size="sm" class="!px-3 !py-2" @click="editBantuan(bantuan.id)">
                                <Icon name="ph:magnifying-glass" class="w-4 h-4 mr-1" />
                                Semakan
                        </rs-button>
                      </td>
                          </tr>
                        </tbody>
                          <tbody v-else>
                            <tr>
                              <td colspan="6" class="px-6 py-6 text-center text-sm text-gray-500">Tiada rekod bantuan.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </template>
          </rs-card>
        </div>

          <!-- Status Update Card -->
            <div class="col-span-1">
              <rs-card class="shadow-sm border-0 bg-white">
            <template #header>
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div
                    class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center"
                  >
                    <Icon
                      name="ph:clipboard-text"
                      class="w-6 h-6 text-orange-600"
                    />
                  </div>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-gray-900">
                          Maklumat Semakan
                  </h2>
                  <p class="text-sm text-gray-500">
                    Status dan catatan permohonan
                  </p>
                </div>
              </div>
            </template>

            <template #body>
              <div class="space-y-6">
                <!-- General Notes -->
                <div class="space-y-1">
                  <FormKit
                    type="textarea"
                    name="catatanUmumPegawai"
                    label="Catatan Umum Pegawai"
                    rows="4"
                    placeholder="Masukkan catatan umum (pilihan)"
                    :classes="{ outer: 'mb-0' }"
                          v-model="formData.catatanUmumPegawai"
                  />
                </div>

                <!-- Action Buttons -->
                <div class="space-y-3 pt-4 border-t">
                  <rs-button
                    variant="success"
                    @click="handleSimpanLengkap"
                    class="w-full !py-3 text-sm font-medium"
                  >
                    <Icon name="ph:floppy-disk" class="w-5 h-5 mr-2" />
                    Simpan
                  </rs-button>

                  <rs-button
                    variant="primary"
                    @click="handleTandakanTidakLengkap"
                    class="w-full !py-3 text-sm font-medium"
                  >
                    <Icon name="ph:paper-plane" class="w-5 h-5 mr-2" />
                    Hantar
                  </rs-button>

                  <rs-button
                    variant="primary-outline"
                    @click="handleCancel"
                    class="w-full !py-3 text-sm font-medium"
                  >
                    <Icon name="ph:arrow-left" class="w-5 h-5 mr-2" />
                    Batal / Kembali
                  </rs-button>
                </div>

                <!-- Information Note -->
                <div class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div class="flex">
                          <Icon
                            name="ph:info"
                            class="w-5 h-5 text-blue-400 mt-0.5"
                          />
                    <div class="ml-3">
                      <h3 class="text-sm font-medium text-blue-800">
                        Tindakan Permohonan
                      </h3>
                      <p class="mt-1 text-xs text-blue-700">
                              Pilih tindakan yang sesuai berdasarkan semakan dokumen dan maklumat bantuan.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </rs-card>
        </div>
      </div>
    </div>
    </div>

    <!-- Success Modal -->
    <rs-modal
      v-model="showSuccessModal"
      title="Kemaskini Berjaya"
      size="md"
      position="center"
    >
      <template #body>
        <div class="space-y-6">
          <div class="text-center">
            <div
              class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100"
            >
              <Icon name="ph:check-circle" class="h-8 w-8 text-green-600" />
            </div>
            <h3 class="mt-4 text-lg font-semibold text-gray-900">
              Kemaskini Berjaya
            </h3>
            <p class="mt-2 text-sm text-gray-600">
              Status permohonan telah berjaya dikemaskini.
            </p>
          </div>

          <div class="bg-gray-50 p-4 rounded-lg space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-sm font-medium text-gray-700"
                >ID Permohonan:</span
              >
              <span class="text-sm font-mono text-gray-900">{{
                formData.idPermohonan
              }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm font-medium text-gray-700"
                >Status Baharu:</span
              >
              <rs-badge
                :variant="getStatusVariant(formData.statusPermohonanBaru)"
                class="text-xs"
              >
                {{ formData.statusPermohonanBaru }}
              </rs-badge>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm font-medium text-gray-700"
                >Tarikh Kemaskini:</span
              >
              <span class="text-sm text-gray-900">{{
                formatDateTime(new Date())
              }}</span>
            </div>
          </div>

          <div class="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p class="text-sm text-green-800 flex items-center">
              <Icon
                name="ph:check-circle"
                class="w-5 h-5 mr-2 flex-shrink-0 text-green-600"
              />
              Permohonan telah dikemaskini dan siap untuk langkah seterusnya.
            </p>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex justify-center">
          <rs-button variant="primary" @click="handleBackToList">
            OK
          </rs-button>
        </div>
      </template>
    </rs-modal>
      </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

definePageMeta({
  title: "Semakan Permohonan",
});

const breadcrumb = ref([
  {
    name: "Tugasan",
    type: "link",
    path: "/BF-BTN/tugasan",
  },
  {
    name: "Senarai untuk Disemak",
    type: "link",
    path: "/BF-BTN/tugasan",
  },
  {
    name: "Semakan Permohonan",
    type: "current",
    path: `/BF-BTN/tugasan/bantuan/${route.params.id}`,
  },
]);

const permohonanData = ref({
  status: 'Dalam Semakan',
});

const bantuanList = computed(() => {
  const v = formData.value;
  return v && Array.isArray(v.senaraiBantuan) ? v.senaraiBantuan : [];
});

// Mock data - would be replaced with API call
const bantuanColumns = [
  { key: "id", label: "ID", sortable: false },
  { key: "jenisBantuan", label: "Jenis Bantuan", sortable: false },
  { key: "status", label: "Status", sortable: false },
  { key: "sla", label: "SLA", sortable: false },
  { key: "tindakan", label: "Action", sortable: false },
];

// Mock dataset keyed by noRujukan
const mockByNoRujukan = {
  'NAS-2025-0001': {
    noRujukan: 'NAS-2025-0001',
    nama: 'Ahmad bin Abdullah',
    alamat: '10, Jalan SS 7/13, Kelana Jaya, 47301 Petaling Jaya, Selangor',
    kariah: 'Masjid Al-Taqwa',
    daerah: 'Kuala Selangor',
    jenisPengenalan: 'MyKad',
    noPengenalan: '800101-01-1234',
    noTelefon: '0123456789',
    email: 'ahmad@email.com',
    statusKeluarga: 'Fakir',
    statusIndividu: 'Fakir',
    statusMultidimensi: 'Asnaf Tidak Produktif',
    status: 'Dalam Siasatan',
  senaraiBantuan: [
      { id: 'B300', jenisBantuan: 'B300 - (HQ) BANTUAN DERMASISWA SEKOLAH ASRAMA (FAKIR)', status: 'Lengkap', sla: '2h', tindakan: '' },
      { id: 'B307', jenisBantuan: 'B307 - (HQ) DERMASISWA IPT DALAM NEGARA (FAKIR) - IPTA/IPTS', status: 'Lengkap', sla: '3h', tindakan: '' },
    ],
    statusPermohonanBaru: '',
    catatanUmumPegawai: 'Dipanjangkan kepada Jabatan Pendidikan untuk semakan lanjut',
  },
  'NAS-2025-0002': {
    noRujukan: 'NAS-2025-0002',
    nama: 'Mohd bin Ismail',
    alamat: '12, Jalan SS 7/13, Kelana Jaya, 47301 Petaling Jaya, Selangor',
    kariah: 'Masjid Al-Furqan',
    daerah: 'Petaling',
    jenisPengenalan: 'MyKad',
    noPengenalan: '800101-01-5678',
    noTelefon: '0190000000',
    email: 'mohd@email.com',
    statusKeluarga: 'Miskin',
    statusIndividu: 'Miskin',
    statusMultidimensi: 'Asnaf Produktif',
    status: 'Dalam Semakan',
    senaraiBantuan: [
      { id: 'B307', jenisBantuan: 'B307 - (HQ) DERMASISWA IPT DALAM NEGARA (FAKIR) - IPTA/IPTS', status: 'Lengkap', sla: '2h', tindakan: '' },
    ],
    statusPermohonanBaru: '',
    catatanUmumPegawai: 'Dipanjangkan kepada Jabatan Pendidikan untuk semakan lanjut',
  },
  'NAS-2025-0003': {
    noRujukan: 'NAS-2025-0003',
    nama: 'Mohd Amin bin Mohd Ali',
    alamat: '12, Jalan SS 7/13, Petaling Jaya, 47301 Petaling Jaya, Selangor',
    kariah: 'Masjid Al-Furqan',
    daerah: 'Petaling',
    jenisPengenalan: 'MyKad',
    noPengenalan: '650101-01-1234',
    noTelefon: '0190000123',
    email: 'amin@email.com',
    statusKeluarga: 'Miskin',
    statusIndividu: 'Miskin',
    statusMultidimensi: 'Asnaf Produktif',
    status: 'Dalam Semakan',
    senaraiBantuan: [
      { id: 'B112', jenisBantuan: 'B112 - BANTUAN SEWAAN/ANSURAN RUMAH (FAKIR)', status: 'Lengkap', sla: '2h', tindakan: '' },
    ],
    statusPermohonanBaru: '',
    catatanUmumPegawai: 'Dipanjangkan kepada EOAD untuk semakan lanjut',
  },
  'NAS-2025-0004': {
    noRujukan: 'NAS-2025-0004',
    nama: 'Amirul Hakim bin Zainuddin',
    alamat: '12, Jalan SS 7/13, Petaling Jaya, 47301 Petaling Jaya, Selangor',
    kariah: 'Masjid Al-Taqwa',
    daerah: 'Kuala Selangor',
    jenisPengenalan: 'MyKad',
    noPengenalan: '791230104321',
    noTelefon: '0190000123',
    email: 'hakim@email.com',
    statusKeluarga: 'Fakir',
    statusIndividu: 'Fakir',
    statusMultidimensi: 'Asnaf Tidak Produktif',
    status: 'Dalam Semakan',
    senaraiBantuan: [
      { id: 'B103', jenisBantuan: 'B103 - (HQ) BANTUAN PERUBATAN DIALISIS (FAKIR)', status: 'Lengkap', sla: '2h', tindakan: '' },
    ],
    statusPermohonanBaru: '',
    catatanUmumPegawai: 'Dipanjangkan kepada Jabatan Perubatan untuk semakan lanjut',
  },
  'NAS-2025-0005': {
    noRujukan: 'NAS-2025-0005',
    nama: 'Maryam binti Abdullah',
    alamat: '45, Jalan Perdana 2/3, Seksyen 2, 40000 Shah Alam, Selangor',
    kariah: 'Masjid An-Nur',
    daerah: 'Shah Alam',
    jenisPengenalan: 'MyKad',
    noPengenalan: '920815082567',
    noTelefon: '0176543210',
    email: 'maryam@email.com',
    statusKeluarga: 'Miskin',
    statusIndividu: 'Mualaf',
    statusMultidimensi: 'Asnaf Produktif Sementara',
    status: 'Dalam Semakan',
          senaraiBantuan: [
            { id: 'B135', jenisBantuan: 'B135 - (HQ) SAGUHATI GALAKAN SAUDARA BARU (MUALAF)', status: 'Dalam Semakan', sla: '3h', tindakan: '' },
          ],
    statusPermohonanBaru: '',
    catatanUmumPegawai: 'Pemohon baru memeluk Islam 6 bulan yang lalu. Memerlukan bantuan sara hidup dan pendidikan agama.',
  },
  'NAS-2025-0006': {
    noRujukan: 'NAS-2025-0006',
    nama: 'Mohd Kamal bin Mohd Luffy',
    alamat: '60, Jalan Perdana 2/2, Seksyen 1, 40000 Shah Alam, Selangor',
    kariah: 'Masjid Al-Ikhlas',
    daerah: 'Kuala Selangor',
    jenisPengenalan: 'MyKad',
    noPengenalan: '990504082567',
    noTelefon: '0156122314',
    email: 'kamal@email.com',
    statusKeluarga: 'Mualaf',
    statusIndividu: 'Mualaf',
    statusMultidimensi: 'Asnaf Mualaf',
    status: 'Dalam Semakan',
          senaraiBantuan: [
            { id: 'B110', jenisBantuan: 'B110 - (HQ) BANTUAN HUTANG PERUBATAN (JPSK)', status: 'Dalam Semakan', sla: '3h', tindakan: '' },
          ],
    statusPermohonanBaru: '',
    catatanUmumPegawai: 'Pemohon perlukan bantuan untuk membayar hutang perubatan.',
  },
  'NAS-2025-0007': {
    noRujukan: 'NAS-2025-0007',
    nama: 'Majlis Agama Islam Selangor (MAIS)',
    alamat: 'Tingkat 9 & 10, Menara Utara Bangunan Sultan Idris Shah, 40000 Shah Alam, Selangor',
    struktur:'HQ',
    kariah: 'Masjid Bandar Utama',
    daerah: 'Shah Alam',
    noPendaftaran: '254900406XLRQPZSC186',
    namaWakil: 'Muhammad Haziq bin Sujaini',
    noTelefon: '03-55123458',
    email: 'haziq@mais.gov.my', 
    statusOrganisasi: 'Disahkan',
    status: 'Dalam Semakan',
          senaraiBantuan: [
            { id: 'B134', jenisBantuan: 'B134 - BANTUAN PROGRAM PENERAPAN NILAI ISLAM', status: 'Dalam Semakan', sla: '3h', tindakan: '' },
          ],
    statusPermohonanBaru: '',
    catatanUmumPegawai: 'Permohonan dari MAIS untuk program penerapan nilai Islam di sekolah-sekolah.',
  },
};

// Flat reactive form state to be populated from mock
const formData = ref({
  noRujukan: '',
  nama: '',
  alamat: '',
  struktur: '',
  kariah: '',
  daerah: '',
  jenisPengenalan: '',
  noPengenalan: '',
  noPendaftaran: '',
  statusorganisasi: '',
  namaWakil: '',
  noTelefon: '',
  email: '',
  statusKeluarga: '',
  statusIndividu: '',
  statusMultidimensi: '',
  status: '',
  senaraiBantuan: [],
  statusPermohonanBaru: '',
  catatanUmumPegawai: '',
});


onMounted(() => {
  const id = String(route.params.id || '');
  const record = mockByNoRujukan[id];
  if (!record) return;

  // copy all fields
  Object.assign(formData.value, record);

  // ensure the textarea has a value (fallback to empty string)
  formData.value.catatanUmumPegawai =
    typeof record.catatanUmumPegawai === 'string' ? record.catatanUmumPegawai : '';
});

// Configuration data
const statusBantuanOptions = [
  { label: "-- Pilih Status --", value: "", disabled: true },
  { label: "Lengkap", value: "Lengkap" },
  { label: "Tak Lengkap", value: "Tak Lengkap" },
];

// Modals
const showSuccessModal = ref(false);

// Computed
const reviewedBantuan = computed(() => {
  return (
    formData.value.senaraiBantuan?.filter(
      (bantuan) => bantuan.status && bantuan.status !== ""
    ).length || 0
  );
});

// Methods
const getStatusVariant = (status) => {
  const variants = {
    baru: "info",
    "dalam semakan": "warning",
    "tidak lengkap": "danger",
    "untuk siasatan": "secondary",
    lengkap: "success",
    "tidak lengkap - untuk tindakan pemohon / pegawai": "danger",
  };
  return variants[status.toLowerCase()] || "default";
};

const formatDateTime = (date) => {
  return new Date(date).toLocaleString("ms-MY", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// const reviewedBantuan = computed(() => {
//   return (
//     formData.value.senaraiBantuan?.filter((bantuan) => bantuan.status && bantuan.status !== "")
//       .length || 0
//   );
// });

const editBantuan = (bantuanId) => {
  // Navigate to bantuan details page
  router.push(`/BF-BTN/tugasan/bantuan/semakan/${route.params.id}/${bantuanId}`);
};

const getBantuanStatusIcon = (status) => {
  switch (status) {
    case "Lengkap":
      return "ph:check";
    case "Tak Lengkap":
      return "ph:x";
    default:
      return "ph:circle";
  }
};

const getBantuanIndicatorClass = (status) => {
  switch (status) {
    case "Lengkap":
      return "bg-green-500";
    case "Tak Lengkap":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

const getBantuanBorderClass = (status) => {
  if (!status || status === "") return "border-gray-200";

  switch (status) {
    case "Lengkap":
      return "border-green-200 bg-green-50 ring-2 ring-green-500 ring-opacity-20";
    case "Tak Lengkap":
      return "border-red-200 bg-red-50";
    default:
      return "border-gray-200";
  }
};

const getBantuanStatusVariant = (status) => {
  switch (status) {
    case "Lengkap":
      return "success";
    case "Tak Lengkap":
      return "danger";
    default:
      return "default";
  }
};

const handleSimpanLengkap = () => {
  // Set status to "Untuk Siasatan" and save
  formData.value.statusPermohonanBaru = "Untuk Siasatan";
  console.log("Submitting form with status: Untuk Siasatan");

  // Show success modal
  showSuccessModal.value = true;
};

const handleTandakanTidakLengkap = () => {
  // Set status to "Tidak Lengkap - Untuk Tindakan Pemohon / Pegawai" and save
  formData.value.statusPermohonanBaru = "Tidak Lengkap - Untuk Tindakan Pemohon / Pegawai";
  console.log("Submitting form with status: Tidak Lengkap - Untuk Tindakan Pemohon / Pegawai");

  // Show success modal
  showSuccessModal.value = true;
};

const handleCancel = () => {
  router.push("/BF-BTN/tugasan");
};

const handleBackToList = () => {
  showSuccessModal.value = false;
  router.push("/BF-BTN/tugasan");
};

const getTableRowClass = (status) => {
  switch (status) {
    case "Lengkap":
      return "bg-green-50/30";
    case "Tak Lengkap":
      return "bg-red-50/30";
    default:
      return "";
  }
};
</script>

<style lang="scss" scoped>
// Custom animations and transitions
.group:hover .group-hover\:text-blue-600 {
  transition: color 0.2s ease-in-out;
}

// Enhanced focus states
.focus\:ring-2:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}

// Progress bar animation
.transition-all {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
