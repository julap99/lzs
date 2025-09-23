<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Maklumat Tuntutan</h2>
          <rs-button
            variant="secondary"
            @click="handleBack"
          >
            <Icon name="material-symbols:arrow-back" class="w-4 h-4 mr-1" />
            Kembali
          </rs-button>
        </div>
      </template>

      <template #body>
        <!-- Section 1: Pilih GL -->
        <div class="mb-8">
          <h3 class="text-lg font-medium mb-4">Pilih GL</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Nombor GL
              </label>
              <p class="text-gray-900">{{ tuntutanData.noGL }}</p>
            </div>
          </div>
        </div>

        <!-- Section 2: Maklumat Bantuan -->
        <div class="mb-8">
          <h3 class="text-lg font-medium mb-4">Maklumat Bantuan</h3>
          <div class="bg-gray-50 p-4 rounded-lg mb-6">
            <h4 class="text-md font-medium mb-4">Butiran Asas Jenis Bantuan</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Kod Bantuan
                </label>
                <p class="text-gray-900">{{ bantuanData.kodBantuan }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Jenis Bantuan
                </label>
                <p class="text-gray-900">{{ bantuanData.jenisBantuan }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Bahan Bantuan
                </label>
                <p class="text-gray-900">{{ bantuanData.bahanBantuan }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Pakej Bantuan
                </label>
                <p class="text-gray-900">{{ bantuanData.pakejBantuan }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Kelayakan Bantuan
                </label>
                <p class="text-gray-900">{{ bantuanData.kelayakanBantuan }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Section 3: Maklumat Tuntutan -->
        <div class="mb-8">
          <h3 class="text-lg font-medium mb-4">Maklumat Tuntutan</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                No. GL
              </label>
              <p class="text-gray-900">{{ tuntutanData.noGL }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Amaun Tuntutan (RM)
              </label>
              <p class="text-gray-900">RM {{ formatNumber(tuntutanData.amaunTuntutan) }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Tarikh
              </label>
              <p class="text-gray-900">{{ formatDate(tuntutanData.tarikh) }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Catatan Tambahan
              </label>
              <p class="text-gray-900">{{ tuntutanData.catatanTambahan || '-' }}</p>
            </div>
          </div>
        </div>

        <!-- Section 4: Muat Naik Dokumen Sokongan -->
        <div class="mb-8">
          <h3 class="text-lg font-medium mb-4">Dokumen Sokongan</h3>
          <div class="space-y-2">
            <div
              v-for="(doc, index) in tuntutanData.dokumenSokongan"
              :key="index"
              class="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
            >
              <span class="text-gray-900">{{ doc.nama }}</span>
              <div class="flex space-x-2">
                <rs-button
                  variant="secondary"
                  size="sm"
                  @click="viewDocument(doc)"
                >
                  <Icon name="material-symbols:visibility" class="mr-1" />
                  Lihat
                </rs-button>
                <rs-button
                  variant="secondary"
                  size="sm"
                  @click="downloadDocument(doc)"
                >
                  <Icon name="material-symbols:download" class="mr-1" />
                  Muat Turun
                </rs-button>
              </div>
            </div>
          </div>
        </div>

        <!-- Section 5: Status & Timeline -->
        <div class="mb-8">
          <h3 class="text-lg font-medium mb-4">Status & Timeline</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Status Semasa
              </label>
              <rs-badge :variant="tuntutanData.status === 'Dalam Semakan' ? 'warning' : 'default'" class="text-lg">
                {{ tuntutanData.status }}
              </rs-badge>

            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Tarikh Hantar
              </label>
              <p class="text-gray-900">{{ formatDate(tuntutanData.tarikhHantar) }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Pemohon
              </label>
              <p class="text-gray-900">{{ tuntutanData.pemohon }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Pegawai Semakan
              </label>
              <p class="text-gray-900">{{ tuntutanData.pegawaiSemakan || 'Belum ditugaskan' }}</p>
            </div>
          </div>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

definePageMeta({
  title: "Maklumat Tuntutan",
});

const route = useRoute();

const breadcrumb = ref([
  {
    name: "Tuntutan dengan Siasatan",
    type: "link",
    path: "/BF-BTN/tuntutan-dengan-siasatan/senarai-tuntutan",
  },
  {
    name: "Senarai Tuntutan",
    type: "link",
    path: "/BF-BTN/tuntutan-dengan-siasatan/senarai-tuntutan",
  },
  {
    name: "Lihat Tuntutan Dalam Semakan",
    type: "current",
    path: `/BF-BTN/tuntutan-dengan-siasatan/senarai-tuntutan/${route.params.id}/view-dalam-semakan`,
  },
]);

/**
 * MOCK DB — keep it in sync with list page data
 * Keyed by id (same as noTuntutan).
 */
const MOCK_DB = {
  "TUN-2024-003": {
    tuntutan: {
      id: "TUN-2024-003",
      noGL: "GL-003",
      amaunTuntutan: 12000.0,
      tarikh: "2024-03-15",
      catatanTambahan: "Catatan untuk TUN-2024-003...",
      tarikhHantar: "2024-03-16T10:30:00",
      pemohon: "PUSAT HEMODIALISIS PERMATA SDN. BHD.",
      pegawaiSemakan: "Siti Aminah binti Omar",
      dokumenSokongan: [
        { id: "DOC-003-1", nama: "GL_Dialisis_GL-003.pdf", url: "/documents/GL_Dialisis_GL-003.pdf" },
        { id: "DOC-003-2", nama: "Invoice_Dialisis_INV-2024-003.pdf", url: "/documents/Invoice_Dialisis_INV-2024-003.pdf" },
      ],
      status: "Dalam Semakan",
    },
    bantuan: {
      kodBantuan: "B103",
      jenisBantuan: "(HQ) BANTUAN PERUBATAN DIALISIS (FAKIR)",
      bahanBantuan: "(HQ) KATEGORI HEMODIALISIS (FAKIR)",
      pakejBantuan: "(GL) (HQ) HEMODIALISIS DAN SUNTIKAN EPO (FAKIR)",
      kelayakanBantuan: "(GL) (HQ) HEMODIALISIS (FAKIR)",
    },
  },

  "TUN-2024-004": {
    tuntutan: {
      id: "TUN-2024-004",
      noGL: "GL-004",
      amaunTuntutan: 3500.0,
      tarikh: "2024-03-12",
      catatanTambahan: "Catatan untuk TUN-2024-004...",
      tarikhHantar: "2024-03-13T09:10:00",
      pemohon: "Surau Kampung Baru",
      pegawaiSemakan: "Belum ditugaskan",
      dokumenSokongan: [
        { id: "DOC-004-1", nama: "GL_SurauKarpet.pdf", url: "/documents/GL_SurauKarpet.pdf" },
      ],
      status: "Dalam Semakan",
    },
    bantuan: {
      kodBantuan: "B400",
      jenisBantuan: "(HQ) BANTUAN SUMBANGAN PERALATAN & BINA/BAIKPULIH INSTITUSI AGAMA",
      bahanBantuan: "(HQ) BANTUAN SUMBANGAN PERALATAN INSTITUSI AGAMA",
      pakejBantuan: "(GL) (HQ) BANTUAN SUMBANGAN KARPET INSTITUSI AGAMA",
      kelayakanBantuan: "(GL) (HQ) BANTUAN SUMBANGAN KARPET INSTITUSI AGAMA",
    },
  },
};

// Page state
const tuntutanData = ref({
  id: "",
  noGL: "",
  amaunTuntutan: 0,
  tarikh: "",
  catatanTambahan: "",
  tarikhHantar: "",
  pemohon: "",
  pegawaiSemakan: "",
  dokumenSokongan: [],
  status: "Dalam Semakan",
});

const bantuanData = ref({
  kodBantuan: "",
  jenisBantuan: "",
  bahanBantuan: "",
  pakejBantuan: "",
  kelayakanBantuan: "",
});

onMounted(async () => {
  await loadTuntutanData();
});

const loadTuntutanData = async () => {
  try {
    const id = String(route.params.id || "");
    const found = MOCK_DB[id];

    if (!found) {
      console.warn("Record not found for id", id);
      return;
    }

    tuntutanData.value = { ...found.tuntutan };
    bantuanData.value = { ...found.bantuan };
  } catch (error) {
    console.error("Error loading tuntutan data:", error);
  }
};

// Utils
const formatDate = (dateString) => new Date(dateString).toLocaleDateString("ms-MY");
const formatNumber = (number) =>
  new Intl.NumberFormat("ms-MY", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(number);

const viewDocument = (doc) => window.open(doc.url, "_blank");

const downloadDocument = (doc) => {
  const link = document.createElement("a");
  link.href = doc.url;
  link.download = doc.nama;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const handleBack = () => {
  navigateTo("/BF-BTN/tuntutan-dengan-siasatan/senarai-tuntutan");
};
</script>


<style lang="scss" scoped>
// Add any additional styles here
</style> 