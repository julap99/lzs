<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card>
      <template #header>
        <div class="flex justify-between items-center">
          <h1 class="text-2xl font-bold">Butiran Tugasan</h1>
          <rs-badge :variant="getStatusVariant(aduanData.status)" size="lg">
            {{ aduanData.status }}
          </rs-badge>
        </div>
      </template>

      <template #body>
        <rs-tab type="card" variant="primary">
          <rs-tab-item title="Aduan + Rekod Bukti & Status" :active="true">
            <div class="space-y-8">
              <!-- Section 1: Maklumat Aduan -->
              <div class="bg-white p-6 rounded-lg border border-gray-200">
                <h2 class="text-lg font-semibold mb-6">Maklumat Aduan</h2>
                
                <!-- Basic Information Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <p class="text-sm text-gray-500 mb-1">Nombor Rujukan Aduan</p>
                    <p class="font-medium">{{ aduanData.noRujukan }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500 mb-1">Nama Individu Dibantu</p>
                    <p class="font-medium">{{ aduanData.namaIndividu }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500 mb-1">No. Kad Pengenalan</p>
                    <p class="font-medium">{{ aduanData.noKadPengenalan }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500 mb-1">Kategori Aduan</p>
                    <rs-badge
                      :variant="getKategoriVariant(aduanData.kategori)"
                      size="sm"
                    >
                      {{ aduanData.kategori }}
                    </rs-badge>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500 mb-1">Lokasi</p>
                    <p class="font-medium">{{ aduanData.lokasi }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500 mb-1">SLA</p>
                    <rs-badge :variant="getSLAVariant(aduanData.sla)" size="sm">
                      {{ aduanData.sla }} jam
                    </rs-badge>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500 mb-1">Status Tugasan</p>
                    <rs-badge
                      :variant="getStatusVariant(aduanData.status)"
                      size="sm"
                    >
                      {{ aduanData.status }}
                    </rs-badge>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500 mb-1">Ringkasan Aduan</p>
                    <p class="font-medium">{{ aduanData.ringkasan }}</p>
                  </div>
                </div>

                <!-- Dokumen Sokongan -->
                <div class="border-t border-gray-200 pt-6">
                  <h3 class="text-md font-medium text-gray-700 mb-4">
                    Dokumen Sokongan
                  </h3>
                  <div class="space-y-2">
                    <div
                      v-for="(doc, index) in aduanData.dokumenSokongan"
                      :key="index"
                      class="flex items-center gap-2"
                    >
                      <Icon
                        name="mdi:file-document-outline"
                        class="text-gray-500"
                      />
                      <a
                        :href="doc.url"
                        target="_blank"
                        class="text-blue-600 hover:underline"
                      >
                        {{ doc.nama }}
                      </a>
                    </div>
                  </div>
                </div>

                <!-- Catatan Quick Assessment -->
                <div v-if="aduanData.catatanQuickAssessment" class="border-t border-gray-200 pt-6 mt-6">
                  <h3 class="text-md font-medium text-gray-700 mb-4">
                    Catatan Quick Assessment
                  </h3>
                  <p class="text-gray-700">
                    {{ aduanData.catatanQuickAssessment }}
                  </p>
                </div>
              </div>

              <!-- Section 2: Rekod Bukti & Status -->
              <div class="bg-white p-6 rounded-lg border border-gray-200">
                <h2 class="text-lg font-semibold mb-6">Rekod Bukti & Status</h2>

                <!-- Bukti Siasatan -->
                <div class="mb-8">
                  <h3 class="text-md font-medium text-gray-700 mb-4">
                    Bukti Siasatan
                  </h3>
                  <div class="space-y-6">
                    <!-- Upload Gambar Lokasi -->
                    <FormKit
                      type="file"
                      name="gambarLokasi"
                      label="Upload Gambar Lokasi (WAJIB min. 1 gambar)"
                      accept="image/*"
                      multiple
                      validation="required|min:1"
                      :validation-messages="{
                        required: 'Sekurang-kurangnya satu gambar lokasi diperlukan',
                        min: 'Sekurang-kurangnya satu gambar lokasi diperlukan'
                      }"
                      v-model="buktiSiasatan.gambarLokasi"
                      help="Format yang diterima: JPG, PNG"
                    />

                    <!-- Upload Gambar Pengesahan -->
                    <FormKit
                      type="file"
                      name="gambarPengesahan"
                      label="Upload Gambar Pengesahan"
                      accept="image/*"
                      multiple
                      v-model="buktiSiasatan.gambarPengesahan"
                      help="Format yang diterima: JPG, PNG"
                    />

                    <!-- Tandatangan Digital -->
                    <div v-if="aduanData.kategori === 'Tunai'">
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Tandatangan Penerima Digital
                      </label>
                      <rs-signature-pad v-model="buktiSiasatan.tandatangan" />
                    </div>

                    <!-- Lokasi GPS -->
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Lokasi GPS
                      </label>
                      <div class="flex items-center gap-2">
                        <rs-button
                          variant="secondary"
                          size="sm"
                          @click="captureGPSLocation"
                          :disabled="!isGPSAvailable"
                        >
                          <Icon name="mdi:crosshairs-gps" class="mr-2" />
                          Ambil Lokasi GPS
                        </rs-button>
                        <span
                          v-if="buktiSiasatan.lokasiGPS"
                          class="text-sm text-gray-600"
                        >
                          {{ buktiSiasatan.lokasiGPS }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Kemaskini Status Aduan -->
                <div class="border-t border-gray-200 pt-6">
                  <h3 class="text-md font-medium text-gray-700 mb-4">
                    Kemaskini Status Aduan
                  </h3>
                  <div class="space-y-4">
                    <FormKit
                      type="select"
                      name="status"
                      label="Status"
                      placeholder="Pilih status"
                      :options="statusOptions"
                      v-model="statusAduan.status"
                      validation="required"
                      :validation-messages="{
                        required: 'Status diperlukan'
                      }"
                    />
                    <FormKit
                      type="textarea"
                      name="catatan"
                      label="Catatan Pegawai"
                      placeholder="Masukkan catatan pegawai"
                      v-model="statusAduan.catatan"
                      rows="4"
                      validation="required"
                      :validation-messages="{
                        required: 'Catatan pegawai diperlukan'
                      }"
                    />
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex justify-end gap-4">
                <rs-button
                  variant="primary"
                  :disabled="!isProfileComplete || isLoading"
                  :loading="isLoading"
                  @click="handleSimpanSerah"
                >
                  {{ isLoading ? 'Sedang Menyimpan...' : 'Simpan & Serah' }}
                </rs-button>
              </div>

              <!-- Warning Message -->
              <div
                v-if="!isProfileComplete"
                class="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
              >
                <div class="flex items-center gap-2 text-yellow-600">
                  <Icon name="mdi:alert" class="text-xl" />
                  <span>
                    Sila lengkapkan Profil terlebih dahulu melalui
                    Pendaftaran/Kemaskini Profil di Tab Profil.
                  </span>
                </div>
              </div>
            </div>
          </rs-tab-item>

          <!-- Tab 2: Profil -->
          <rs-tab-item title="Profil">
            <div class="bg-white p-6 rounded-lg border border-gray-200">
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-lg font-semibold">Status Profil</h2>
                <rs-badge
                  :variant="isProfileComplete ? 'success' : 'warning'"
                  size="lg"
                >
                  {{ isProfileComplete ? "Lengkap" : "Tidak Lengkap" }}
                </rs-badge>
              </div>

              <!-- Action Button -->
              <div class="flex justify-end">
                <rs-button variant="primary" @click="navigateToProfile">
                  {{ getProfileButtonText() }}
                </rs-button>
              </div>
            </div>
          </rs-tab-item>
        </rs-tab>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

definePageMeta({
  title: "Butiran Tugasan",
});

const router = useRouter();

const breadcrumb = ref([
  {
    name: "Modul Aduan",
    type: "link",
    path: "/BF-ADN/PA/TS/01",
  },
  {
    name: "Butiran Tugasan",
    type: "current",
    path: "/BF-ADN/PA/TS/04",
  },
]);

// Mock data - replace with actual data from API
const aduanData = ref({
  noRujukan: "ADN-2024-001",
  namaIndividu: "Ahmad bin Abdullah",
  noKadPengenalan: "800101-01-1234",
  kategori: "Keselamatan",
  lokasi: "Kuala Lumpur",
  sla: 24,
  status: "Sedang Diproses",
  ringkasan:
    "Individu ini memerlukan bantuan segera kerana tiada tempat tinggal dan bekalan makanan.",
  dokumenSokongan: [
    { nama: "Dokumen 1.pdf", url: "#" },
    { nama: "Gambar 1.jpg", url: "#" },
  ],
  catatanQuickAssessment: "Perlu bantuan segera",
});

const buktiSiasatan = ref({
  gambarLokasi: [],
  gambarPengesahan: [],
  tandatangan: null,
  lokasiGPS: null,
});

const statusAduan = ref({
  status: "",
  catatan: "",
});

const statusOptions = [
  { label: "Selesai", value: "selesai" },
  { label: "Tidak Layak", value: "tidak_layak" },
  { label: "Rujuk Lanjut", value: "rujuk_lanjut" },
];

const isProfileComplete = ref(true);
const isGPSAvailable = ref(false);
const isLoading = ref(false);

// Methods
const getStatusVariant = (status) => {
  const variants = {
    "Sedang Diproses": "info",
    Selesai: "success",
    "Tidak Layak": "danger",
    "Rujuk Lanjut": "warning",
  };
  return variants[status] || "default";
};

const getKategoriVariant = (kategori) => {
  const variants = {
    Keselamatan: "danger",
    Kebersihan: "warning",
    Infrastruktur: "info",
  };
  return variants[kategori] || "default";
};

const getSLAVariant = (sla) => {
  if (sla <= 24) return "success";
  if (sla <= 48) return "warning";
  return "danger";
};

const handleGambarLokasiUpload = (files) => {
  buktiSiasatan.value.gambarLokasi = files;
};

const handleGambarPengesahanUpload = (files) => {
  buktiSiasatan.value.gambarPengesahan = files;
};

const captureGPSLocation = async () => {
  try {
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });

    buktiSiasatan.value.lokasiGPS = `${position.coords.latitude}, ${position.coords.longitude}`;
  } catch (error) {
    console.error("Error getting GPS location:", error);
  }
};

const getProfileButtonText = () => {
  return aduanData.value.kategori.includes("Kelas 1")
    ? "Pendaftaran Profil (Full Registration)"
    : "Kemaskini Profil";
};

const navigateToProfile = () => {
  router.push("/BF-PRF/AS/FR/02");
};

const handleSimpanSerah = async () => {
  if (!isProfileComplete.value) {
    return;
  }

  try {
    isLoading.value = true;
    // TODO: Implement save and submit logic
    console.log("Saving and submitting...");
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Route to 01 page after successful save
    router.push('/BF-ADN/PA/TS/01');
  } catch (error) {
    console.error('Error saving:', error);
  } finally {
    isLoading.value = false;
  }
};

// Check GPS availability
onMounted(() => {
  if ("geolocation" in navigator) {
    isGPSAvailable.value = true;
  }
});
</script>

<style lang="scss" scoped></style>
