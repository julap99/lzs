<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <div class="space-y-6 mt-4">
      <!-- Section 1: Maklumat Bantuan -->
      <rs-card>
        <template #header>
          <div class="flex items-center">
            <Icon name="material-symbols:info-outline" class="mr-2" />
            Maklumat Bantuan
          </div>
        </template>
        <template #body>
          <div class="bg-gray-50 p-4 rounded-lg mb-6">
            <h4 class="text-md font-medium mb-4">Butiran Asas Jenis Bantuan</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Kod Bantuan
                </label>
                <div class="text-gray-900">{{ bantuanData.kodBantuan }}</div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Jenis Bantuan
                </label>
                <div class="text-gray-900">{{ bantuanData.jenisBantuan }}</div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Bahan Bantuan
                </label>
                <div class="text-gray-900">{{ bantuanData.bahanBantuan }}</div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Pakej Bantuan
                </label>
                <div class="text-gray-900">{{ bantuanData.pakejBantuan }}</div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Kelayakan Bantuan
                </label>
                <div class="text-gray-900">{{ bantuanData.kelayakanBantuan }}</div>
              </div>
            </div>
          </div>
        </template>
      </rs-card>

      <!-- Section 2: Maklumat Tuntutan -->
      <rs-card>
        <template #header>
          <div class="flex items-center">
            <Icon name="material-symbols:info-outline" class="mr-2" />
            Maklumat Tuntutan
          </div>
        </template>
        <template #body>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                ID Permohonan Tuntutan
              </label>
              <div class="text-gray-900">{{ tuntutan.idPermohonan }}</div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                No. GL
              </label>
              <div class="text-gray-900">{{ tuntutan.noGL }}</div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Amaun Tuntutan
              </label>
              <div class="text-gray-900">
                RM {{ formatNumber(tuntutan.amaunTuntutan) }}
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Tarikh Permohonan
              </label>
              <div class="text-gray-900">
                {{ formatDate(tuntutan.tarikhPermohonan) }}
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Pegawai ETD/EOAD
              </label>
              <div class="text-gray-900">{{ tuntutan.pegawaiETD }}</div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Dokumen Sokongan
              </label>
              <div class="flex items-center space-x-2">
                <a
                  v-for="(doc, index) in tuntutan.dokumenSokongan"
                  :key="index"
                  :href="doc.url"
                  target="_blank"
                  class="text-primary-600 hover:text-primary-800 flex items-center"
                >
                  <Icon
                    name="material-symbols:file-present-outline"
                    class="mr-1"
                  />
                  {{ doc.name }}
                </a>
              </div>
            </div>
          </div>
        </template>
      </rs-card>

      <!-- Section 3: Semakan Maklumat -->
      <rs-card>
        <template #header>
          <div class="flex items-center">
            <Icon name="material-symbols:fact-check-outline" class="mr-2" />
            Semakan Maklumat
          </div>
        </template>
        <template #body>
          <div class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Status GL
              </label>
              <rs-badge
                :variant="tuntutan.statusGL === 'Valid' ? 'success' : 'danger'"
              >
                {{ tuntutan.statusGL }}
              </rs-badge>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Perbandingan Amaun GL vs Tuntutan
              </label>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="p-4 bg-gray-50 rounded-lg">
                  <div class="text-sm text-gray-500">Amaun GL</div>
                  <div class="text-lg font-semibold">
                    RM {{ formatNumber(tuntutan.amaunGL) }}
                  </div>
                </div>
                <div class="p-4 bg-gray-50 rounded-lg">
                  <div class="text-sm text-gray-500">Amaun Tuntutan</div>
                  <div class="text-lg font-semibold">
                    RM {{ formatNumber(tuntutan.amaunTuntutan) }}
                  </div>
                </div>
                <div class="p-4 bg-gray-50 rounded-lg">
                  <div class="text-sm text-gray-500">Perbezaan</div>
                  <div
                    class="text-lg font-semibold"
                    :class="{
                      'text-danger': tuntutan.amaunTuntutan > tuntutan.amaunGL,
                      'text-success':
                        tuntutan.amaunTuntutan <= tuntutan.amaunGL,
                    }"
                  >
                    RM
                    {{
                      formatNumber(
                        Math.abs(tuntutan.amaunGL - tuntutan.amaunTuntutan)
                      )
                    }}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Tarikh & Dokumen Perkhidmatan
              </label>
              <div class="space-y-2">
                <div>Tarikh: {{ formatDate(tuntutan.tarikhPerkhidmatan) }}</div>
                <div class="flex items-center space-x-2">
                  <a
                    v-for="(doc, index) in tuntutan.dokumenPerkhidmatan"
                    :key="index"
                    :href="doc.url"
                    target="_blank"
                    class="text-primary-600 hover:text-primary-800 flex items-center"
                  >
                    <Icon
                      name="material-symbols:file-present-outline"
                      class="mr-1"
                    />
                    {{ doc.name }}
                  </a>
                </div>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Lampiran Lain
              </label>
              <div class="flex items-center space-x-2">
                <a
                  v-for="(doc, index) in tuntutan.lampiranLain"
                  :key="index"
                  :href="doc.url"
                  target="_blank"
                  class="text-primary-600 hover:text-primary-800 flex items-center"
                >
                  <Icon
                    name="material-symbols:file-present-outline"
                    class="mr-1"
                  />
                  {{ doc.name }}
                </a>
              </div>
            </div>
          </div>
        </template>
      </rs-card>

      <!-- Section 4: Keputusan Kelulusan -->
      <rs-card>
        <template #header>
          <div class="flex items-center">
            <Icon name="material-symbols:approval-outline" class="mr-2" />
            Keputusan Kelulusan
          </div>
        </template>
        <template #body>
          <div class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Status Kelulusan
                </label>
                <rs-badge variant="success" class="text-lg">
                  Diluluskan
                </rs-badge>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Pegawai Meluluskan
                </label>
                <div class="text-gray-900">{{ currentUser.name }}</div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Tarikh Keputusan Kelulusan
                </label>
                <div class="text-gray-900">{{ formatDate(tuntutan.tarikhKelulusan) }}</div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Catatan Semakan
                </label>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <p class="text-gray-900">{{ tuntutan.catatanSemakan }}</p>
                </div>
              </div>
            </div>
          </div>
        </template>
      </rs-card>
    </div>

    <!-- Back Button -->
    <div class="mt-6 flex justify-end">
      <rs-button
        variant="secondary"
        @click="handleBack"
      >
        <Icon name="material-symbols:arrow-back" class="mr-1" />
        Kembali ke Senarai
      </rs-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

definePageMeta({
  title: "Lihat Tuntutan Diluluskan",
});

const route = useRoute();

const breadcrumb = ref([
  {
    name: "Tuntutan dengan Siasatan",
    type: "link",
    path: "/BF-BTN/tuntutan-dengan-siasatan/senarai-tuntutan-asnaf",
  },
  {
    name: "Senarai Tuntutan",
    type: "link",
    path: "/BF-BTN/tuntutan-dengan-siasatan/senarai-tuntutan-asnaf",
  },
  {
    name: "Lihat Tuntutan Diluluskan",
    type: "current",
    path: `/BF-BTN/tuntutan-dengan-siasatan/senarai-tuntutan-asnaf/${route.params.id}/view-lulus`,
  },
]);

// Sample data - Replace with actual API call
const tuntutan = ref({
  idPermohonan: "TUN-2024-002",
  noGL: "GL-002",
  amaunTuntutan: 8000.0,
  amaunGL: 10000.0,
  tarikhPermohonan: "2024-03-18T09:30:00",
  tarikhKelulusan: "2024-03-25T14:20:00",
  pegawaiETD: "Siti Aminah binti Abdullah",
  statusGL: "Valid",
  tarikhPerkhidmatan: "2024-03-10T00:00:00",
  catatanSemakan: "Permohonan ini telah disemak dengan teliti dan memenuhi semua kriteria kelayakan. Dokumen sokongan lengkap dan sah. Amaun tuntutan adalah munasabah dan dalam had yang dibenarkan. Permohonan ini disokong untuk kelulusan.",
  dokumenSokongan: [
    { name: "Dokumen 1.pdf", url: "#" },
    { name: "Dokumen 2.pdf", url: "#" },
  ],
  dokumenPerkhidmatan: [{ name: "Perkhidmatan 1.pdf", url: "#" }],
  lampiranLain: [{ name: "Lampiran 1.pdf", url: "#" }],
});

// Sample bantuan data - in real app, this would be fetched from API based on GL
const bantuanData = ref({
  kodBantuan: "B400",
  jenisBantuan: "(HQ) BANTUAN SUMBANGAN PERALATAN & BINA/BAIKPULIH INSTITUSI AGAMA",
  bahanBantuan: "(HQ) BANTUAN SUMBANGAN PERALATAN INSTITUSI AGAMA",
  pakejBantuan: "(GL) (HQ) BANTUAN SUMBANGAN KARPET INSTITUSI AGAMA",
  kelayakanBantuan: "(GL) (HQ) BANTUAN SUMBANGAN KARPET INSTITUSI AGAMA",
});

// Mock current user - Replace with actual user data
const currentUser = ref({
  name: "Ahmad bin Ismail",
  role: "Pelulus",
});

// Utility functions
const formatNumber = (value) => {
  return new Intl.NumberFormat("ms-MY", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("ms-MY");
};

// Action handlers
const handleBack = () => {
  navigateTo("/BF-BTN/tuntutan-dengan-siasatan/senarai-tuntutan-asnaf");
};
</script>

<style lang="scss" scoped>
// Add any custom styles here if needed
</style> 