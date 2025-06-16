<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Surat Arahan Pindahan Tunai</h2>
        </div>
      </template>

      <template #body>
        <!-- PDF Preview Section -->
        <div class="border rounded-lg p-4 mb-4 bg-gray-50">
          <!-- PDF Preview -->
          <div class="pdf-preview bg-white p-6">
            <div class="text-center mb-6">
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
              <h2 class="text-lg font-bold">SURAT ARAHAN PINDAHAN TUNAI</h2>
              <p class="text-sm">Rujukan: LZS/APT/{{ generateReference() }}</p>
              <p class="text-sm">Tarikh: {{ formatDate(new Date()) }}</p>
            </div>

            <div class="mb-6">
              <p class="mb-4">Kepada:</p>
              <p class="font-semibold mb-1">Pengurus</p>
              <p class="mb-1">Maybank {{ safeBoxInfo.cawangan }}</p>
              <p class="mb-4">{{ safeBoxInfo.daerah }}</p>

              <p class="font-semibold mt-6 mb-2">Tuan/Puan,</p>
              <p class="font-semibold mb-4">
                ARAHAN PINDAHAN TUNAI UNTUK TUJUAN TAMBAH NILAI PETI BESI
              </p>

              <p class="mb-4">
                Dengan segala hormatnya, perkara di atas adalah dirujuk.
              </p>

              <p class="mb-4">
                2. Dimaklumkan bahawa pihak Lembaga Zakat Selangor (LZS) ingin
                mengarahkan pindahan tunai sejumlah
                <span class="font-semibold"
                  >RM{{ formatNumber(safeBoxInfo.jumlahTambahNilai) }}</span
                >
                untuk tujuan tambah nilai peti besi di {{ safeBoxInfo.cawangan }}.
              </p>

              <p class="mb-4">
                3. Berikut adalah butiran pegawai LZS yang diberi kuasa untuk
                menguruskan transaksi ini:
              </p>

              <div class="pl-6 mb-4">
                <p class="mb-1">Nama: {{ safeBoxInfo.namaPegawaiLZS }}</p>
                <p class="mb-1">
                  No. Kad Pengenalan:
                  {{ formatIC(safeBoxInfo.noKPPegawai) }}
                </p>
                <p class="mb-1">
                  No. Telefon: {{ safeBoxInfo.noTelefonPegawai }}
                </p>
              </div>

              <p class="mb-4">
                4. Pindahan ini perlu dilaksanakan pada
                {{ formatFullDateTime(safeBoxInfo.tarikhMasaPindahan) }}.
              </p>

              <p class="mb-4">
                5. Kerjasama pihak tuan/puan dalam melancarkan proses ini amatlah
                dihargai.
              </p>
            </div>

            <!-- Signature -->
            <div class="mt-12">
              <p class="mb-1">Yang benar,</p>
              <div class="h-16"></div>
              <p class="font-semibold">_________________________</p>
              <p class="font-semibold">(PENGURUS KEWANGAN)</p>
              <p>Lembaga Zakat Selangor</p>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end gap-4 mt-6">
          <rs-button
            variant="primary"
            @click="handleDownloadPDF"
            :loading="isGeneratingPDF"
            class="flex items-center"
          >
            <span class="mr-2">Muat Turun PDF</span>
            <Icon name="iconamoon:cloud-download-duotone" />
          </rs-button>

          <rs-button
            variant="primary-outline"
            @click="navigateTo('/BF-TNI/tambah-nilai-tunai/senarai-peti-besi-perlu-tambah-nilai')"
          >
            Kembali ke Senarai
          </rs-button>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { jsPDF } from "jspdf";
import { useToast } from "vue-toastification";

definePageMeta({
  title: "Surat Arahan Pindahan Tunai",
});

const route = useRoute();
const toast = useToast();
const isGeneratingPDF = ref(false);

const breadcrumb = ref([
  {
    name: "Tambah Nilai Tunai",
    type: "link",
    path: "/BF-TNI/tambah-nilai-tunai",
  },
  {
    name: "Senarai Peti Besi Perlu Tambah Nilai",
    type: "link",
    path: "/BF-TNI/tambah-nilai-tunai/senarai-peti-besi-perlu-tambah-nilai",
  },
  {
    name: "Surat Arahan Pindahan Tunai",
    type: "current",
    path: `/BF-TNI/tambah-nilai-tunai/surat-arahan/${route.params.id}`,
  },
]);

// Mock data - In real app, fetch from API
const safeBoxInfo = ref({
  idPetiBesi: "PB001",
  cawangan: "Cawangan Kuala Lumpur (KL001)",
  daerah: "Kuala Lumpur",
  namaPegawaiLZS: "Ahmad bin Abdullah",
  noKPPegawai: "820112085559",
  noTelefonPegawai: "012-3456789",
  jumlahTambahNilai: 10000.00,
  tarikhMasaPindahan: new Date("2024-03-20T10:00:00")
});

// Helper functions
const formatNumber = (number) => {
  return new Intl.NumberFormat("ms-MY", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number);
};

const formatDate = (date) => {
  return date.toLocaleDateString("ms-MY", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const formatFullDateTime = (date) => {
  return date.toLocaleString("ms-MY", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
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

const handleDownloadPDF = async () => {
  isGeneratingPDF.value = true;
  try {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Set document properties
    doc.setProperties({
      title: "Surat Arahan Pindahan Tunai",
      subject: "Surat Arahan Pindahan Tunai",
      author: "Lembaga Zakat Selangor",
      creator: "LZS System",
    });

    // Starting position for content
    let yPosition = 20;

    // Add logo
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = "/img/logo/lzs-logo-main.png";
      });

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imgData = canvas.toDataURL("image/png");
      const imgWidth = 40;
      const imgHeight = (img.height * imgWidth) / img.width;
      const xOffset = (210 - imgWidth) / 2;

      doc.addImage(imgData, "PNG", xOffset, yPosition, imgWidth, imgHeight);
      yPosition += imgHeight + 10;
    } catch (error) {
      console.error("Error adding logo:", error);
      yPosition += 10;
    }

    // Add header
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("LEMBAGA ZAKAT SELANGOR", 105, yPosition, { align: "center" });
    yPosition += 5;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Menara Selatan, Lembaga Zakat Selangor,", 105, yPosition, {
      align: "center",
    });
    yPosition += 5;

    doc.text(
      "No. 2, Jalan Universiti, Seksyen 13, 40100 Shah Alam, Selangor",
      105,
      yPosition,
      { align: "center" }
    );
    yPosition += 5;

    doc.text("Tel: 03-5514 3400 | www.zakatselangor.com.my", 105, yPosition, {
      align: "center",
    });
    yPosition += 5;

    // Add horizontal line
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.line(20, yPosition, 190, yPosition);
    yPosition += 10;

    // Add document title
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("SURAT ARAHAN PINDAHAN TUNAI", 105, yPosition, {
      align: "center",
    });
    yPosition += 10;

    // Add reference and date
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Rujukan: LZS/APT/${generateReference()}`, 20, yPosition);
    yPosition += 5;

    doc.text(`Tarikh: ${formatDate(new Date())}`, 20, yPosition);
    yPosition += 10;

    // Add recipient
    doc.text("Kepada:", 20, yPosition);
    yPosition += 5;

    doc.setFont("helvetica", "bold");
    doc.text("Pengurus", 20, yPosition);
    yPosition += 5;

    doc.setFont("helvetica", "normal");
    doc.text(`Maybank ${safeBoxInfo.value.cawangan}`, 20, yPosition);
    yPosition += 5;

    doc.text(`${safeBoxInfo.value.daerah}`, 20, yPosition);
    yPosition += 10;

    // Add letter content
    doc.setFont("helvetica", "bold");
    doc.text("Tuan/Puan,", 20, yPosition);
    yPosition += 5;

    doc.text(
      "ARAHAN PINDAHAN TUNAI UNTUK TUJUAN TAMBAH NILAI PETI BESI",
      20,
      yPosition
    );
    yPosition += 10;

    doc.setFont("helvetica", "normal");
    doc.text(
      "Dengan segala hormatnya, perkara di atas adalah dirujuk.",
      20,
      yPosition
    );
    yPosition += 10;

    let text = `2. Dimaklumkan bahawa pihak Lembaga Zakat Selangor (LZS) ingin mengarahkan pindahan tunai sejumlah RM${formatNumber(
      safeBoxInfo.value.jumlahTambahNilai
    )} untuk tujuan tambah nilai peti besi di ${
      safeBoxInfo.value.cawangan
    }.`;

    const splitText = doc.splitTextToSize(text, 170);
    doc.text(splitText, 20, yPosition);
    yPosition += splitText.length * 5 + 5;

    doc.text(
      "3. Berikut adalah butiran pegawai LZS yang diberi kuasa untuk menguruskan transaksi ini:",
      20,
      yPosition
    );
    yPosition += 10;

    doc.text(`Nama: ${safeBoxInfo.value.namaPegawaiLZS}`, 30, yPosition);
    yPosition += 5;

    doc.text(
      `No. Kad Pengenalan: ${formatIC(safeBoxInfo.value.noKPPegawai)}`,
      30,
      yPosition
    );
    yPosition += 5;

    doc.text(
      `No. Telefon: ${safeBoxInfo.value.noTelefonPegawai}`,
      30,
      yPosition
    );
    yPosition += 10;

    doc.text(
      `4. Pindahan ini perlu dilaksanakan pada ${formatFullDateTime(
        safeBoxInfo.value.tarikhMasaPindahan
      )}.`,
      20,
      yPosition
    );
    yPosition += 10;

    doc.text(
      "5. Kerjasama pihak tuan/puan dalam melancarkan proses ini amatlah dihargai.",
      20,
      yPosition
    );
    yPosition += 20;

    // Add signature
    doc.text("Yang benar,", 20, yPosition);
    yPosition += 20;

    doc.setFont("helvetica", "bold");
    doc.text("_________________________", 20, yPosition);
    yPosition += 5;

    doc.text("(PENGURUS KEWANGAN)", 20, yPosition);
    yPosition += 5;

    doc.setFont("helvetica", "normal");
    doc.text("Lembaga Zakat Selangor", 20, yPosition);

    // Save PDF
    doc.save(`Surat_Arahan_Pindahan_Tunai_${formatDate(new Date()).replace(/\//g, "-")}.pdf`);

    // Show success notification
    toast.success("PDF berjaya dimuat turun");
  } catch (error) {
    console.error("Error generating PDF:", error);
    toast.error("Ralat semasa menjana PDF. Sila cuba lagi.");
  } finally {
    isGeneratingPDF.value = false;
  }
};
</script>

<style scoped>
.pdf-preview {
  font-family: Arial, sans-serif;
  line-height: 1.5;
  color: #333;
}

.pdf-preview h1 {
  color: #111;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.pdf-preview h2 {
  color: #111;
  font-size: 1.1rem;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
}

.pdf-preview hr {
  border-color: #ddd;
  margin: 1rem 0;
}
</style> 