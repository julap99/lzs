<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- PDF Preview Card -->
    <rs-card class="mb-6">
      <template #header>
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-medium">Pratonton Dokumen</h3>
        </div>
      </template>

      <template #body>
        <div class="border rounded-md p-6 bg-white">
          <!-- PDF Preview Header -->
          <div class="text-center mb-8">
            <img
              class="h-16 mx-auto mb-4"
              src="@/assets/img/logo/lzs-logo-main.png"
              alt="LZS Logo"
            />
            <h1 class="text-xl font-bold mb-1">LEMBAGA ZAKAT SELANGOR</h1>
            <p class="text-sm mb-1">Menara Selatan, Lembaga Zakat Selangor,</p>
            <p class="text-sm mb-1">
              No. 2, Jalan Universiti, Seksyen 13, 40100 Shah Alam, Selangor
            </p>
            <p class="text-sm">Tel: 03-5514 3400 | www.zakatselangor.com.my</p>
            <hr class="my-4 border-gray-300" />
            <h2 class="text-lg font-bold">SURAT ARAHAN PINDAHAN WANG</h2>
            <p class="text-sm">Rujukan: LZS/APW/{{ generateReference() }}</p>
            <p class="text-sm">Tarikh: {{ formatDate(new Date()) }}</p>
          </div>

          <!-- PDF Preview Content -->
          <div class="mb-6">
            <p class="mb-4">Kepada:</p>
            <p class="font-semibold mb-1">Pengurus</p>
            <p class="mb-1">Maybank {{ transferDetails.cawangan }}</p>
            <p class="mb-4">{{ transferDetails.daerah }}</p>

            <p class="font-semibold mt-6 mb-2">Tuan/Puan,</p>
            <p class="font-semibold mb-4">
              ARAHAN PINDAHAN WANG UNTUK TUJUAN AGIHAN BANTUAN
            </p>

            <p class="mb-4">Dengan segala hormatnya, perkara di atas adalah dirujuk.</p>

            <p class="mb-4">
              2. Dimaklumkan bahawa pihak Lembaga Zakat Selangor (LZS) ingin mengarahkan
              pindahan wang sejumlah
              <span class="font-semibold"
                >RM{{ formatCurrency(transferDetails.jumlahPindahan) }}</span
              >
              untuk tujuan agihan bantuan kepada asnaf di daerah
              {{ transferDetails.daerah }}.
            </p>

            <p class="mb-4">
              3. Berikut adalah butiran pegawai LZS yang diberi kuasa untuk menguruskan
              transaksi ini:
            </p>

            <div class="pl-6 mb-4">
              <p class="mb-1">Nama: {{ transferDetails.namaPegawai }}</p>
              <p class="mb-1">
                No. Kad Pengenalan:
                {{ formatIC(transferDetails.noKadPengenalanPegawai) }}
              </p>
              <p class="mb-1">No. Telefon: {{ transferDetails.noTelefonPegawai }}</p>
            </div>

            <p class="mb-4">
              4. Pindahan ini perlu dilaksanakan pada
              {{ formatFullDateTime(transferDetails.tarikhMasaPindahan) }}.
            </p>

            <p class="mb-4">
              5. Kerjasama pihak tuan/puan dalam melancarkan proses ini amatlah dihargai.
            </p>
          </div>

          <!-- PDF Preview Footer -->
          <div class="mt-12">
            <p class="mb-1">Yang benar,</p>
            <div class="h-16"></div>
            <p class="font-semibold">_________________________</p>
            <p class="font-semibold">(PENGURUS KEWANGAN)</p>
            <p>Lembaga Zakat Selangor</p>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-between gap-4 mt-6">
          <rs-button
            variant="primary"
            size="sm"
            @click="downloadPDF"
            class="flex items-center"
          >
            <span class="mr-2">Muat Turun PDF</span>
            <Icon name="iconamoon:cloud-download-duotone" />
          </rs-button>

          <div class="flex gap-4">
            <rs-button variant="primary-outline" @click="goBack"> Kembali </rs-button>
            <rs-button variant="primary" @click="proceedToNext"> Teruskan </rs-button>
          </div>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { usePDF } from "../composables/usePDF";

definePageMeta({
  title: "Surat Arahan Pindaan Wang",
});

const route = useRoute();
const router = useRouter();
const { generatePDF } = usePDF();

const breadcrumb = ref([
  {
    name: "Jana Senarai Nama dan Jumlah Bantuan",
    type: "link",
    path: "/BF-PTPC/MT/AG/01",
  },
  {
    name: "Sahkan Jumlah Tunai",
    type: "link",
    path: `/BF-PTPC/MT/AG/02/${route.params.id}`,
  },
  {
    name: "Surat Arahan Pindaan Wang",
    type: "current",
    path: "/BF-PTPC/MT/AG/03",
  },
]);

// This would normally come from an API or Vuex/Pinia store
const transferDetails = ref({
  daerah: "Petaling",
  cawangan: "Shah Alam",
  namaPegawai: "Ahmad bin Abdullah",
  noKadPengenalanPegawai: "820112085559",
  noTelefonPegawai: "012-3456789",
  jumlahPindahan: 25000.0,
  tarikhMasaPindahan: new Date("2025-05-10T10:00:00"),
});

// Helper functions
const formatDate = (date) => {
  return date.toLocaleDateString("ms-MY", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const formatFullDateTime = (date) => {
  return (
    date.toLocaleDateString("ms-MY", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }) +
    " " +
    date.toLocaleTimeString("ms-MY", {
      hour: "2-digit",
      minute: "2-digit",
    })
  );
};

const formatCurrency = (value) => {
  return value.toLocaleString("ms-MY", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const formatIC = (ic) => {
  return `${ic.substring(0, 6)}-${ic.substring(6, 8)}-${ic.substring(8)}`;
};

const generateReference = () => {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `${year}/${randomNum}`;
};

const downloadPDF = () => {
  const documentTitle = `Surat_Arahan_Pindahan_Wang_${formatDate(new Date()).replace(
    /\//g,
    "-"
  )}`;

  // This would use the composable to generate and download PDF
  generatePDF(documentTitle, transferDetails.value);
};

const goBack = () => {
  router.push(`/BF-PTPC/MT/AG/02/${route.params.id}`);
};

const proceedToNext = () => {
  // Next step in the process
  router.push(`/BF-PTPC/MT/AG/04/${route.params.id}`);
};

onMounted(async () => {});
</script>
