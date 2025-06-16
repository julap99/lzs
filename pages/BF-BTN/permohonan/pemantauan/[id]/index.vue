<template>
  <div class="min-h-screen">
    <div class="">
      <LayoutsBreadcrumb :items="breadcrumb" />

      <!-- Page Header -->
      <div class="mt-6 mb-8">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Pemantauan Kerja</h1>
            <p class="mt-1 text-sm text-gray-600">
              Senarai dan pengurusan kad pemantauan untuk projek bantuan
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

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Section 1: Maklumat Permohonan (Read-only) -->
          <rs-card class="shadow-sm border-0 bg-white">
            <template #header>
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div
                    class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"
                  >
                    <Icon name="ph:file-text" class="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-gray-900">Maklumat Permohonan</h2>
                  <p class="text-sm text-gray-500">
                    Butiran asas permohonan bantuan (Paparan sahaja)
                  </p>
                </div>
              </div>
            </template>

            <template #body>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-1">
                  <label class="text-sm font-medium text-gray-700">ID Permohonan</label>
                  <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                    <span class="text-sm font-mono text-gray-900">{{
                      permohonanData.idPermohonan
                    }}</span>
                  </div>
                </div>

                <div class="space-y-1">
                  <label class="text-sm font-medium text-gray-700"
                    >Nama Pemohon / Institusi</label
                  >
                  <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                    <span class="text-sm text-gray-900">{{
                      permohonanData.namaPemohon
                    }}</span>
                  </div>
                </div>

                <div class="space-y-1">
                  <label class="text-sm font-medium text-gray-700">Jenis Bantuan</label>
                  <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                    <span class="text-sm text-gray-900">{{
                      permohonanData.jenisBantuan
                    }}</span>
                  </div>
                </div>

                <div class="space-y-1">
                  <label class="text-sm font-medium text-gray-700"
                    >Status Permohonan</label
                  >
                  <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                    <span class="text-sm text-gray-900">{{
                      permohonanData.statusPermohonan
                    }}</span>
                  </div>
                </div>
              </div>
            </template>
          </rs-card>

          <!-- Section 2: Senarai Kad Pemantauan -->
          <rs-card class="shadow-sm border-0 bg-white">
            <template #header>
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="flex-shrink-0">
                    <div
                      class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center"
                    >
                      <Icon name="ph:monitor" class="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <div>
                    <h2 class="text-lg font-semibold text-gray-900">
                      Senarai Kad Pemantauan
                    </h2>
                    <p class="text-sm text-gray-500">
                      Kad pemantauan tersusun mengikut tarikh (terkini di atas)
                    </p>
                  </div>
                </div>
                <rs-button
                  variant="success"
                  @click="addNewKadPemantauan"
                  class="!py-2 !px-4"
                >
                  <Icon name="ph:plus" class="w-4 h-4 mr-2" />
                  Tambah Pemantauan Baru
                </rs-button>
              </div>
            </template>

            <template #body>
              <div class="space-y-4">
                <!-- Kad Pemantauan Items (Collapsible) -->
                <rs-collapse>
                  <rs-collapse-item
                    v-for="(kad, index) in sortedKadPemantauan"
                    :key="kad.id"
                    type="card"
                  >
                    <template #title>
                      <div class="flex items-center justify-between w-full pr-4">
                        <div class="flex items-center space-x-4">
                          <div class="flex items-center space-x-2">
                            <Icon name="ph:calendar" class="w-4 h-4 text-gray-500" />
                            <span class="font-medium text-gray-900">
                              {{ formatDateTime(kad.tarikhMasaPemantauan) }}
                            </span>
                          </div>
                          <rs-badge
                            :variant="getProgressStatusVariant(kad.statusKemajuanKerja)"
                            class="text-xs"
                          >
                            {{ kad.statusKemajuanKerja }}
                          </rs-badge>
                          <rs-badge variant="info" class="text-xs">
                            {{ kad.peratusanKemajuanKerja }}
                          </rs-badge>
                        </div>
                        <div class="flex items-center space-x-2">
                          <Icon
                            v-if="kad.tuntutanBolehDibuat"
                            name="ph:check-circle"
                            class="w-4 h-4 text-green-500"
                            title="Tuntutan Boleh Dibuat"
                          />
                          <span class="text-xs text-gray-500"> #{{ index + 1 }} </span>
                        </div>
                      </div>
                    </template>

                    <!-- Kad Content (Expandable Form) -->
                    <div class="p-6 bg-gray-50 border-t">
                      <FormKit
                        type="form"
                        :actions="false"
                        @submit="handleSaveKadPemantauan(kad.id, $event)"
                      >
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <!-- Tarikh & Masa Pemantauan -->
                          <FormKit
                            type="datetime-local"
                            name="tarikhMasaPemantauan"
                            label="Tarikh & Masa Pemantauan"
                            validation="required"
                            help="Pilih tarikh dan masa pemantauan dilakukan"
                            :value="kad.tarikhMasaPemantauan"
                          />

                          <!-- Status Kemajuan Kerja -->
                          <FormKit
                            type="select"
                            name="statusKemajuanKerja"
                            label="Status Kemajuan Kerja"
                            validation="required"
                            :options="statusKemajuanOptions"
                            :value="kad.statusKemajuanKerja"
                          />

                          <!-- Peratusan Kemajuan Kerja -->
                          <FormKit
                            type="select"
                            name="peratusanKemajuanKerja"
                            label="Peratusan Kemajuan Kerja"
                            validation="required"
                            :options="peratusanKemajuanOptions"
                            :value="kad.peratusanKemajuanKerja"
                          />

                          <!-- Memo Pemantauan -->
                          <div class="space-y-2">
                            <label class="text-sm font-medium text-gray-700">
                              Memo Pemantauan <span class="text-red-500">*</span>
                            </label>
                            <div class="flex items-center space-x-2">
                              <FormKit
                                type="text"
                                name="memoPemantauan"
                                placeholder="Nama dokumen memo"
                                validation="required"
                                :value="kad.memoPemantauan"
                                :classes="{
                                  outer: 'flex-1 mb-0',
                                }"
                              />
                              <rs-button
                                variant="primary-outline"
                                type="button"
                                @click="openMemoDocument(kad.memoPemantauan)"
                                class="!py-2 !px-3"
                              >
                                <Icon name="ph:file-arrow-up" class="w-4 h-4" />
                              </rs-button>
                            </div>
                          </div>
                        </div>

                        <!-- Catatan / Isu Ditemui -->
                        <div class="mt-6">
                          <FormKit
                            type="textarea"
                            name="catatanIsu"
                            label="Catatan / Isu Ditemui"
                            rows="4"
                            help="Catatan mengenai isu, komen atau penemuan semasa pemantauan"
                            :value="kad.catatanIsu"
                          />
                        </div>

                        <!-- Section 3: Lampiran Dokumen -->
                        <div class="mt-8 border-t pt-6">
                          <h3 class="text-lg font-medium text-gray-900 mb-4">
                            <Icon name="ph:paperclip" class="w-5 h-5 mr-2 inline" />
                            Lampiran Dokumen
                          </h3>

                          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <!-- Dropdown Pilihan Dokumen -->
                            <div class="md:col-span-2">
                              <FormKit
                                type="checkbox"
                                name="dokumenLampiran"
                                label="Pilihan Dokumen Lampiran"
                                :options="dokumenLampiranOptions"
                                help="Pilih dokumen yang berkaitan dengan pemantauan ini"
                                :value="kad.dokumenLampiran"
                              />
                            </div>

                            <!-- Checkbox Serah kepada Kontraktor -->
                            <div class="md:col-span-2">
                              <FormKit
                                type="checkbox"
                                name="serahKepadaKontraktor"
                                label="Serah kepada Kontraktor"
                                :options="[
                                  {
                                    label: 'Serah dokumen terpilih kepada Kontraktor',
                                    value: true,
                                  },
                                ]"
                                help="Tandakan jika dokumen perlu diserahkan kepada kontraktor"
                                :value="kad.serahKepadaKontraktor"
                              />
                            </div>

                            <!-- Edit Buttons for Selected Documents -->
                            <div
                              v-if="kad.dokumenLampiran && kad.dokumenLampiran.length > 0"
                              class="md:col-span-2"
                            >
                              <div class="bg-blue-50 p-4 rounded-lg">
                                <h4 class="font-medium text-blue-900 mb-3">
                                  Dokumen Terpilih
                                </h4>
                                <div class="flex flex-wrap gap-2">
                                  <rs-button
                                    v-for="dok in kad.dokumenLampiran"
                                    :key="dok"
                                    variant="primary-outline"
                                    size="sm"
                                    @click="editDocument(dok)"
                                  >
                                    <Icon name="ph:pencil" class="w-3 h-3 mr-1" />
                                    Edit {{ getDokumenLabel(dok) }}
                                  </rs-button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <!-- Section 4: Tuntutan Boleh Dibuat -->
                        <div class="mt-8 border-t pt-6">
                          <h3 class="text-lg font-medium text-gray-900 mb-4">
                            <Icon name="ph:receipt" class="w-5 h-5 mr-2 inline" />
                            Tuntutan Boleh Dibuat
                          </h3>

                          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <!-- Checkbox Tuntutan Boleh Dibuat -->
                            <div class="md:col-span-2">
                              <FormKit
                                type="checkbox"
                                name="tuntutanBolehDibuat"
                                :options="[
                                  {
                                    label:
                                      'Tuntutan Boleh Dibuat (Kontraktor boleh akses Modul Tuntutan di NPS)',
                                    value: true,
                                  },
                                ]"
                                help="Tandakan jika kontraktor dibenarkan membuat tuntutan"
                                :value="kad.tuntutanBolehDibuat"
                              />
                            </div>

                            <!-- Dropdown % Boleh Dituntut -->
                            <FormKit
                              v-if="kad.tuntutanBolehDibuat"
                              type="select"
                              name="peratusanBolehDituntut"
                              label="Peratusan Boleh Dituntut"
                              validation="required"
                              :options="peratusanTuntutanOptions"
                              help="Pilih peratusan yang dibenarkan untuk dituntut"
                              :value="kad.peratusanBolehDituntut"
                            />
                          </div>
                        </div>

                        <!-- Action Buttons -->
                        <div
                          class="mt-8 flex items-center justify-end space-x-4 pt-6 border-t"
                        >
                          <rs-button
                            variant="secondary-outline"
                            type="button"
                            @click="cancelKadEdit(kad.id)"
                          >
                            <Icon name="ph:x" class="w-4 h-4 mr-2" />
                            Batal
                          </rs-button>
                          <rs-button variant="success" type="submit" :loading="isSaving">
                            <Icon name="ph:floppy-disk" class="w-4 h-4 mr-2" />
                            Simpan Kad Pemantauan
                          </rs-button>
                        </div>
                      </FormKit>
                    </div>
                  </rs-collapse-item>
                </rs-collapse>

                <!-- Empty State -->
                <div v-if="kadPemantauanList.length === 0" class="text-center py-12">
                  <Icon name="ph:monitor" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 class="text-lg font-medium text-gray-900 mb-2">
                    Tiada Kad Pemantauan
                  </h3>
                  <p class="text-gray-500 mb-4">
                    Belum ada kad pemantauan yang dibuat untuk permohonan ini.
                  </p>
                  <rs-button variant="primary" @click="addNewKadPemantauan">
                    <Icon name="ph:plus" class="w-4 h-4 mr-2" />
                    Tambah Pemantauan Pertama
                  </rs-button>
                </div>
              </div>
            </template>
          </rs-card>
        </div>

        <!-- Sidebar -->
        <div class="lg:col-span-1 space-y-6">
          <!-- Quick Stats -->
          <rs-card class="shadow-sm border-0 bg-white">
            <template #header>
              <h3 class="text-lg font-semibold text-gray-900">Statistik Pemantauan</h3>
            </template>

            <template #body>
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">Jumlah Pemantauan</span>
                  <span class="font-semibold text-gray-900">{{
                    kadPemantauanList.length
                  }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">Kemajuan Terakhir</span>
                  <span class="font-semibold text-gray-900">{{ latestProgress }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">Status Tuntutan</span>
                  <rs-badge
                    :variant="canMakeClaim ? 'success' : 'warning'"
                    class="text-xs"
                  >
                    {{ canMakeClaim ? "Boleh Tuntut" : "Belum Boleh" }}
                  </rs-badge>
                </div>
              </div>
            </template>
          </rs-card>

          <!-- Recent Activity -->
          <rs-card class="shadow-sm border-0 bg-white">
            <template #header>
              <h3 class="text-lg font-semibold text-gray-900">Aktiviti Terkini</h3>
            </template>

            <template #body>
              <div class="space-y-3">
                <div
                  v-for="activity in recentActivities"
                  :key="activity.id"
                  class="flex items-start space-x-3 text-sm"
                >
                  <div class="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p class="text-gray-900">{{ activity.description }}</p>
                    <p class="text-gray-500 text-xs">
                      {{ formatRelativeTime(activity.timestamp) }}
                    </p>
                  </div>
                </div>

                <div
                  v-if="recentActivities.length === 0"
                  class="text-center text-gray-500 py-4"
                >
                  Tiada aktiviti terkini
                </div>
              </div>
            </template>
          </rs-card>
        </div>
      </div>
    </div>

    <!-- Document Edit Modal -->
    <rs-modal v-model="showDocumentModal" size="lg">
      <template #header>
        <h3 class="text-lg font-semibold">Edit {{ selectedDocumentType }}</h3>
      </template>

      <template #body>
        <div class="p-4">
          <p class="text-gray-600 mb-4">
            Fungsi ini akan membuka paparan penuh untuk mengedit dokumen terpilih.
          </p>
          <div class="bg-blue-50 p-4 rounded-lg">
            <p class="text-blue-800 text-sm">
              <Icon name="ph:info" class="w-4 h-4 mr-1 inline" />
              Dokumen: <strong>{{ selectedDocumentType }}</strong>
            </p>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex justify-end space-x-3">
          <rs-button variant="secondary" @click="showDocumentModal = false">
            Tutup
          </rs-button>
          <rs-button variant="primary" @click="proceedToEditDocument">
            Buka Editor Dokumen
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useToast } from "vue-toastification";
import { useRoute } from "vue-router";

definePageMeta({
  title: "Modul Pemantauan Kerja",
  description: "Pengurusan kad pemantauan untuk projek bantuan",
});

const route = useRoute();
const toast = useToast();

// Loading states
const isSaving = ref(false);
const showDocumentModal = ref(false);
const selectedDocumentType = ref("");

// Breadcrumb
const breadcrumb = ref([
  {
    name: "Permohonan Bantuan",
    type: "link",
    path: "/BF-BTN/permohonan",
  },
  {
    name: "Senarai Pemantauan",
    type: "link",
    path: "/BF-BTN/permohonan/pemantauan",
  },
  {
    name: "Pemantauan Kerja",
    type: "current",
    path: route.path,
  },
]);

// Data
const permohonanData = ref({
  idPermohonan: "BNT-2024-001234",
  namaPemohon: "Masjid Al-Hidayah",
  jenisBantuan: "Bantuan Naik Taraf Bangunan",
  statusPermohonan: "Dalam Pemantauan",
  status: "Aktif",
});

const kadPemantauanList = ref([
  {
    id: 1,
    tarikhMasaPemantauan: "2024-01-15T10:00",
    memoPemantauan: "Memo Pemantauan Pertama",
    statusKemajuanKerja: "Sedang Berjalan",
    peratusanKemajuanKerja: "50%",
    catatanIsu: "Kerja-kerja asas telah siap. Menunggu bahan binaan tambahan.",
    dokumenLampiran: ["borang-laporan-harian", "borang-lawatan-tapak"],
    serahKepadaKontraktor: [true],
    tuntutanBolehDibuat: [true],
    peratusanBolehDituntut: "50%",
  },
  {
    id: 2,
    tarikhMasaPemantauan: "2024-01-08T14:30",
    memoPemantauan: "Memo Pemantauan Awal",
    statusKemajuanKerja: "Belum Mula",
    peratusanKemajuanKerja: "0%",
    catatanIsu: "Projek belum bermula. Menunggu kelulusan permit.",
    dokumenLampiran: ["borang-pemeriksaan-kerja"],
    serahKepadaKontraktor: [],
    tuntutanBolehDibuat: [],
    peratusanBolehDituntut: "0%",
  },
]);

// Options
const statusKemajuanOptions = [
  { label: "Belum Mula", value: "Belum Mula" },
  { label: "Sedang Berjalan", value: "Sedang Berjalan" },
  { label: "Hampir Siap", value: "Hampir Siap" },
  { label: "Siap", value: "Siap" },
];

const peratusanKemajuanOptions = [
  { label: "0%", value: "0%" },
  { label: "50%", value: "50%" },
  { label: "100%", value: "100%" },
];

const peratusanTuntutanOptions = [
  { label: "50%", value: "50%" },
  { label: "95%", value: "95%" },
  { label: "5%", value: "5%" },
];

const dokumenLampiranOptions = [
  {
    label: "Borang Penggunaan & Pemeriksaan Bahan",
    value: "borang-penggunaan-pemeriksaan",
  },
  { label: "Borang Laporan Harian", value: "borang-laporan-harian" },
  { label: "Permohonan Pemeriksaan Kerja", value: "permohonan-pemeriksaan-kerja" },
  { label: "Borang Kepuasan Pelanggan", value: "borang-kepuasan-pelanggan" },
  { label: "Borang Penilaian Prestasi Kontraktor", value: "borang-penilaian-prestasi" },
  {
    label: "Borang Pemeriksaan Kecacatan Bangunan",
    value: "borang-pemeriksaan-kecacatan",
  },
  { label: "Borang Lawatan Tapak", value: "borang-lawatan-tapak" },
  { label: "Surat Serah Kunci", value: "surat-serah-kunci" },
];

const recentActivities = ref([
  {
    id: 1,
    description: "Kad pemantauan baharu ditambah",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    id: 2,
    description: "Status kemajuan dikemaskini kepada 'Sedang Berjalan'",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
  },
  {
    id: 3,
    description: "Dokumen lampiran ditambah",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
  },
]);

// Computed
const sortedKadPemantauan = computed(() => {
  return [...kadPemantauanList.value].sort(
    (a, b) => new Date(b.tarikhMasaPemantauan) - new Date(a.tarikhMasaPemantauan)
  );
});

const latestProgress = computed(() => {
  if (sortedKadPemantauan.value.length > 0) {
    return sortedKadPemantauan.value[0].peratusanKemajuanKerja;
  }
  return "0%";
});

const canMakeClaim = computed(() => {
  return sortedKadPemantauan.value.some(
    (kad) => kad.tuntutanBolehDibuat && kad.tuntutanBolehDibuat.length > 0
  );
});

// Methods
const getStatusVariant = (status) => {
  const variants = {
    Aktif: "success",
    "Dalam Pemantauan": "warning",
    Selesai: "success",
    Ditangguhkan: "danger",
  };
  return variants[status] || "default";
};

const getProgressStatusVariant = (status) => {
  const variants = {
    "Belum Mula": "danger",
    "Sedang Berjalan": "warning",
    "Hampir Siap": "info",
    Siap: "success",
  };
  return variants[status] || "default";
};

const addNewKadPemantauan = () => {
  const newKad = {
    id: Date.now(),
    tarikhMasaPemantauan: new Date().toISOString().slice(0, 16),
    memoPemantauan: "",
    statusKemajuanKerja: "Belum Mula",
    peratusanKemajuanKerja: "0%",
    catatanIsu: "",
    dokumenLampiran: [],
    serahKepadaKontraktor: [],
    tuntutanBolehDibuat: [],
    peratusanBolehDituntut: "0%",
  };

  kadPemantauanList.value.unshift(newKad);

  // Add to recent activities
  recentActivities.value.unshift({
    id: Date.now(),
    description: "Kad pemantauan baharu ditambah",
    timestamp: new Date(),
  });

  toast.success("Kad pemantauan baharu telah ditambah");
};

const handleSaveKadPemantauan = async (kadId, formData) => {
  isSaving.value = true;

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Find and update the kad with form data
    const kadIndex = kadPemantauanList.value.findIndex((k) => k.id === kadId);
    if (kadIndex !== -1) {
      // Update the kad with form data
      kadPemantauanList.value[kadIndex] = {
        ...kadPemantauanList.value[kadIndex],
        ...formData,
      };
    }

    const kad = kadPemantauanList.value[kadIndex];

    // Add to audit trail / recent activities
    recentActivities.value.unshift({
      id: Date.now(),
      description: `Kad pemantauan disimpan - ${kad.statusKemajuanKerja}`,
      timestamp: new Date(),
    });

    // If tuntutan boleh dibuat is checked, trigger integration
    if (kad.tuntutanBolehDibuat && kad.tuntutanBolehDibuat.length > 0) {
      // Simulate NPS integration
      console.log("Triggering NPS integration for claims...");

      recentActivities.value.unshift({
        id: Date.now(),
        description: "Integrasi NPS untuk tuntutan diaktifkan",
        timestamp: new Date(),
      });
    }

    toast.success("Kad pemantauan berjaya disimpan!");
  } catch (error) {
    toast.error("Ralat semasa menyimpan kad pemantauan");
    console.error(error);
  } finally {
    isSaving.value = false;
  }
};

const cancelKadEdit = (kadId) => {
  // Reset form or handle cancel logic
  toast.info("Perubahan dibatalkan");
};

const openMemoDocument = (memoName) => {
  if (!memoName) {
    toast.warning("Sila masukkan nama memo terlebih dahulu");
    return;
  }

  // Simulate opening memo document
  toast.info(`Membuka dokumen memo: ${memoName}`);
};

const editDocument = (documentType) => {
  selectedDocumentType.value = getDokumenLabel(documentType);
  showDocumentModal.value = true;
};

const proceedToEditDocument = () => {
  // Navigate to document editor
  toast.info(`Navigating to edit ${selectedDocumentType.value}...`);
  showDocumentModal.value = false;
};

const getDokumenLabel = (value) => {
  const option = dokumenLampiranOptions.find((opt) => opt.value === value);
  return option ? option.label : value;
};

const formatDateTime = (dateTime) => {
  return new Date(dateTime).toLocaleDateString("ms-MY", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatRelativeTime = (timestamp) => {
  const now = new Date();
  const diff = now - new Date(timestamp);

  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 60) {
    return `${minutes} minit yang lalu`;
  } else if (hours < 24) {
    return `${hours} jam yang lalu`;
  } else {
    return `${days} hari yang lalu`;
  }
};

// Lifecycle
onMounted(() => {
  // Initialize component or fetch data
  console.log("Modul Pemantauan Kerja initialized");
});
</script>

<style lang="scss" scoped>
// Custom styles if needed
.accordion-group {
  transition: all 0.3s ease;
}

.card {
  @apply bg-white rounded-lg shadow-sm border border-gray-200;
}

.card-header {
  @apply p-6 border-b border-gray-200;
}

.card-body {
  @apply p-6;
}

.card-footer {
  @apply p-6 border-t border-gray-200;
}
</style>
