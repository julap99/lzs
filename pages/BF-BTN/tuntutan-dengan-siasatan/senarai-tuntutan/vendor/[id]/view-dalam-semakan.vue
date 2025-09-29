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
                Amaun GL (RM)
              </label>
              <p class="text-gray-900">RM {{ formatNumber(tuntutanData.amaunGL) }}</p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Baki Amaun (RM)
              </label>
              <p class="text-gray-900">RM {{ formatNumber(tuntutanData.bakiAmaun) }}</p>
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
    path: "/BF-BTN/tuntutan-dengan-siasatan/senarai-tuntutan-vendor",
  },
  {
    name: "Senarai Tuntutan",
    type: "link",
    path: "/BF-BTN/tuntutan-dengan-siasatan/senarai-tuntutan-vendor",
  },
  {
    name: "Lihat Tuntutan Dalam Semakan",
    type: "current",
    path: `/BF-BTN/tuntutan-dengan-siasatan/senarai-tuntutan-vendor/${route.params.id}/view-dalam-semakan`,
  },
]);

/**
 * MOCK DB — keep it in sync with list page data
 * Keyed by id (same as noTuntutan).
 */
const MOCK_DB = {
  "TUN-2024-001": {
    tuntutan: {
      id: "TUN-2024-001",
      noGL: "GL-001",
      amaunTuntutan: 5000.0,
      amaunGL: 6000.0,
      bakiAmaun: 1000.0,
      tarikh: "2024-03-20",
      catatanTambahan: "Catatan untuk TUN-2024-001...",
      tarikhHantar: "2024-03-21T08:00:00",
      pemohon: "Ahmad bin Abdullah",
      pegawaiSemakan: "Belum ditugaskan",
      dokumenSokongan: [
        { id: "DOC-001-1", nama: "GL_Bantuan_GL-001.pdf", url: "/documents/GL_Bantuan_GL-001.pdf" },
        { id: "DOC-001-2", nama: "Invoice_INV-2024-001.pdf", url: "/documents/Invoice_INV-2024-001.pdf" },
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

  "TUN-2024-002": {
    tuntutan: {
      id: "TUN-2024-002",
      noGL: "GL-002",
      amaunTuntutan: 8000.0,
      amaunGL: 8500.0,
      bakiAmaun: 500.0,
      tarikh: "2024-03-18",
      catatanTambahan: "Catatan untuk TUN-2024-002...",
      tarikhHantar: "2024-03-19T09:15:00",
      pemohon: "Masjid Al-Hidayah",
      pegawaiSemakan: "Belum ditugaskan",
      dokumenSokongan: [
        { id: "DOC-002-1", nama: "GL_Masjid_GL-002.pdf", url: "/documents/GL_Masjid_GL-002.pdf" },
        { id: "DOC-002-2", nama: "Invoice_Masjid_INV-2024-002.pdf", url: "/documents/Invoice_Masjid_INV-2024-002.pdf" },
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

  "TUN-2024-003": {
    tuntutan: {
      id: "TUN-2024-003",
      noGL: "GL-003",
      amaunTuntutan: 12000.0,
      amaunGL: 12000.0,
      bakiAmaun: 0.0,
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
      amaunGL: 4000.0,
      bakiAmaun: 500.0,
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

  "TUN-2024-005": {
    tuntutan: {
      id: "TUN-2024-005",
      noGL: "GL-005",
      amaunTuntutan: 15000.0,
      amaunGL: 15000.0,
      bakiAmaun: 0.0,
      tarikh: "2024-03-10",
      catatanTambahan: "Catatan untuk TUN-2024-005...",
      tarikhHantar: "2024-03-11T10:30:00",
      pemohon: "Pusat Tahfiz Al-Quran",
      pegawaiSemakan: "Belum ditugaskan",
      dokumenSokongan: [
        { id: "DOC-005-1", nama: "GL_Tahfiz_GL-005.pdf", url: "/documents/GL_Tahfiz_GL-005.pdf" },
        { id: "DOC-005-2", nama: "Invoice_Tahfiz_INV-2024-005.pdf", url: "/documents/Invoice_Tahfiz_INV-2024-005.pdf" },
      ],
      status: "Lulus",
    },
    bantuan: {
      kodBantuan: "B400",
      jenisBantuan: "(HQ) BANTUAN SUMBANGAN PERALATAN & BINA/BAIKPULIH INSTITUSI AGAMA",
      bahanBantuan: "(HQ) BANTUAN SUMBANGAN PERALATAN INSTITUSI AGAMA",
      pakejBantuan: "(GL) (HQ) BANTUAN SUMBANGAN KARPET INSTITUSI AGAMA",
      kelayakanBantuan: "(GL) (HQ) BANTUAN SUMBANGAN KARPET INSTITUSI AGAMA",
    },
  },

  "TUN-2024-006": {
    tuntutan: {
      id: "TUN-2024-006",
      noGL: "GL-006",
      amaunTuntutan: 25000.0,
      amaunGL: 25000.0,
      bakiAmaun: 0.0,
      tarikh: "2024-03-22",
      catatanTambahan: "Catatan untuk TUN-2024-006...",
      tarikhHantar: "2024-03-23T11:45:00",
      pemohon: "Kumpulan Belia Islam",
      pegawaiSemakan: "Belum ditugaskan",
      dokumenSokongan: [
        { id: "DOC-006-1", nama: "GL_Belia_GL-006.pdf", url: "/documents/GL_Belia_GL-006.pdf" },
        { id: "DOC-006-2", nama: "Invoice_Belia_INV-2024-006.pdf", url: "/documents/Invoice_Belia_INV-2024-006.pdf" },
      ],
      status: "Ditolak",
    },
    bantuan: {
      kodBantuan: "B400",
      jenisBantuan: "(HQ) BANTUAN SUMBANGAN PERALATAN & BINA/BAIKPULIH INSTITUSI AGAMA",
      bahanBantuan: "(HQ) BANTUAN SUMBANGAN PERALATAN INSTITUSI AGAMA",
      pakejBantuan: "(GL) (HQ) BANTUAN SUMBANGAN KARPET INSTITUSI AGAMA",
      kelayakanBantuan: "(GL) (HQ) BANTUAN SUMBANGAN KARPET INSTITUSI AGAMA",
    },
  },

  "TUN-2024-007": {
    tuntutan: {
      id: "TUN-2024-007",
      noGL: "GL-007",
      amaunTuntutan: 18000.0,
      amaunGL: 20000.0,
      bakiAmaun: 2000.0,
      tarikh: "2024-03-19",
      catatanTambahan: "Catatan untuk TUN-2024-007...",
      tarikhHantar: "2024-03-20T14:20:00",
      pemohon: "Persatuan Islam Kampung Melayu",
      pegawaiSemakan: "Belum ditugaskan",
      dokumenSokongan: [
        { id: "DOC-007-1", nama: "GL_Persatuan_GL-007.pdf", url: "/documents/GL_Persatuan_GL-007.pdf" },
        { id: "DOC-007-2", nama: "Invoice_Persatuan_INV-2024-007.pdf", url: "/documents/Invoice_Persatuan_INV-2024-007.pdf" },
      ],
      status: "Ditolak",
    },
    bantuan: {
      kodBantuan: "B400",
      jenisBantuan: "(HQ) BANTUAN SUMBANGAN PERALATAN & BINA/BAIKPULIH INSTITUSI AGAMA",
      bahanBantuan: "(HQ) BANTUAN SUMBANGAN PERALATAN INSTITUSI AGAMA",
      pakejBantuan: "(GL) (HQ) BANTUAN SUMBANGAN KARPET INSTITUSI AGAMA",
      kelayakanBantuan: "(GL) (HQ) BANTUAN SUMBANGAN KARPET INSTITUSI AGAMA",
    },
  },

  "TUN-2024-008": {
    tuntutan: {
      id: "TUN-2024-008",
      noGL: "GL-008",
      amaunTuntutan: 15000.0,
      amaunGL: 15000.0,
      bakiAmaun: 0.0,
      tarikh: "2024-03-25",
      catatanTambahan: "Catatan untuk TUN-2024-008...",
      tarikhHantar: "2024-03-26T16:10:00",
      pemohon: "KLINIK DIALISIS NUR HIDAYAH",
      pegawaiSemakan: "Belum ditugaskan",
      dokumenSokongan: [
        { id: "DOC-008-1", nama: "GL_Dialisis_NurHidayah_GL-008.pdf", url: "/documents/GL_Dialisis_NurHidayah_GL-008.pdf" },
        { id: "DOC-008-2", nama: "Invoice_Dialisis_NurHidayah_INV-2024-008.pdf", url: "/documents/Invoice_Dialisis_NurHidayah_INV-2024-008.pdf" },
      ],
      status: "Lulus",
    },
    bantuan: {
      kodBantuan: "B103",
      jenisBantuan: "(HQ) BANTUAN PERUBATAN DIALISIS (FAKIR)",
      bahanBantuan: "(HQ) KATEGORI HEMODIALISIS (FAKIR)",
      pakejBantuan: "(GL) (HQ) HEMODIALISIS DAN SUNTIKAN EPO (FAKIR)",
      kelayakanBantuan: "(GL) (HQ) HEMODIALISIS (FAKIR)",
    },
  },
};

// Page state
const tuntutanData = ref({
  id: "",
  noGL: "",
  amaunTuntutan: 0,
  amaunGL: 0,
  bakiAmaun: 0,
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
  navigateTo("/BF-BTN/tuntutan-dengan-siasatan/senarai-tuntutan-vendor");
};
</script>


<style lang="scss" scoped>
// Add any additional styles here
</style> 