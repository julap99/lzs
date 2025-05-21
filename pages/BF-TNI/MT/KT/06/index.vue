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
        <!-- Letter Preview -->
        <div class="border rounded-lg p-6 bg-white">
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
            <h2 class="text-lg font-bold">SURAT ARAHAN PINDAHAN TUNAI</h2>
            <p class="text-sm">Rujukan: {{ generateReference() }}</p>
            <p class="text-sm">Tarikh: {{ formatDate(new Date()) }}</p>
          </div>

          <!-- Letter Content -->
          <div class="mb-6">
            <p class="mb-4">Kepada:</p>
            <p class="font-semibold mb-1">Pengurus</p>
            <p class="mb-1">{{ transferDetails.cawangan }}</p>
            <p class="mb-4">{{ transferDetails.daerah }}</p>

            <p class="font-semibold mt-6 mb-2">Tuan/Puan,</p>
            <p class="font-semibold mb-4">ARAHAN PINDAHAN TUNAI</p>

            <p class="mb-4">
              Dengan segala hormatnya, perkara di atas adalah dirujuk.
            </p>

            <p class="mb-4">
              2. Dimaklumkan bahawa pihak Lembaga Zakat Selangor (LZS) ingin
              mengarahkan pindahan tunai sejumlah
              <span class="font-semibold"
                >RM{{ formatCurrency(transferDetails.jumlahTunai) }}</span
              >
              untuk tujuan agihan bantuan kepada asnaf di daerah
              {{ transferDetails.daerah }}.
            </p>

            <p class="mb-4">
              3. Berikut adalah butiran pegawai LZS yang diberi kuasa untuk
              menguruskan transaksi ini:
            </p>

            <div class="pl-6 mb-4">
              <p class="mb-1">Nama: {{ transferDetails.namaPegawai }}</p>
              <p class="mb-1">
                No. Kad Pengenalan:
                {{ formatIC(transferDetails.noKadPengenalanPegawai) }}
              </p>
              <p class="mb-1">
                No. Telefon: {{ transferDetails.noTelefonPegawai }}
              </p>
            </div>

            <p class="mb-4">
              4. Pindahan ini perlu dilaksanakan pada
              {{ formatFullDateTime(transferDetails.tarikhMasaPengambilan) }}.
            </p>

            <p class="mb-4">
              5. Butiran rujukan peti besi dan ID arahan adalah seperti berikut:
            </p>

            <div class="pl-6 mb-4">
              <p class="mb-1">
                Rujukan Peti Besi: {{ transferDetails.rujukanPetiBesi }}
              </p>
              <p class="mb-1">ID Arahan: {{ transferDetails.idArahan }}</p>
            </div>

            <p class="mb-4">
              6. Kerjasama pihak tuan/puan dalam melancarkan proses ini amatlah
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
            @click="navigateTo('/BF-TNI/MT/KT/07')"
          >
            Seterusnya
          </rs-button>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { jsPDF } from "jspdf";
import { useToast } from "vue-toastification";

definePageMeta({
  title: "Surat Arahan Pindahan Tunai",
});

const toast = useToast();
const isGeneratingPDF = ref(false);

const breadcrumb = ref([
  {
    name: "Pengurusan Tunai",
    type: "link",
    path: `/BF-TNI/MT/KT/01`,
  },
  {
    name: "Kemasukan Tunai",
    type: "link",
    path: `/BF-TNI/MT/KT/01`,
  },
  {
    name: "Surat Arahan Pindahan Tunai",
    type: "current",
    path: "/BF-TNI/MT/KT/06",
  },
]);

// Mock data - replace with actual data from API
const transferDetails = ref({
  daerah: "Petaling",
  cawangan: "Maybank Shah Alam",
  namaPegawai: "Ahmad bin Abdullah",
  noKadPengenalanPegawai: "820112085559",
  noTelefonPegawai: "012-3456789",
  jumlahTunai: 25000.0,
  tarikhMasaPengambilan: new Date("2024-03-20T10:00:00"),
  rujukanPetiBesi: "PB-2024-001",
  idArahan: "ID-2024-001",
});

// Utility functions
const generateReference = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `LZS/APT/${year}${month}${day}/${random}`;
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString("ms-MY", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const formatFullDateTime = (date: Date) => {
  return date.toLocaleString("ms-MY", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatCurrency = (amount: number) => {
  return amount.toLocaleString("ms-MY", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const formatIC = (ic: string) => {
  return ic.replace(/(\d{6})-?(\d{2})-?(\d{4})/, "$1-$2-$3");
};

const handleDownloadPDF = async () => {
  try {
    isGeneratingPDF.value = true;

    // Create PDF document
    const doc = new jsPDF();

    // Add logo
    try {
      const img = new Image();
      img.src = "/img/logo/lzs-logo-main.png";
      await new Promise((resolve) => {
        img.onload = resolve;
      });
      doc.addImage(img, "PNG", 85, 10, 40, 40);
    } catch (error) {
      console.error("Error adding logo:", error);
    }

    // Add header
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("LEMBAGA ZAKAT SELANGOR", 105, 60, { align: "center" });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Menara Selatan, Lembaga Zakat Selangor,", 105, 65, {
      align: "center",
    });
    doc.text(
      "No. 2, Jalan Universiti, Seksyen 13, 40100 Shah Alam, Selangor",
      105,
      70,
      { align: "center" }
    );
    doc.text("Tel: 03-5514 3400 | www.zakatselangor.com.my", 105, 75, {
      align: "center",
    });

    // Add horizontal line
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.line(20, 80, 190, 80);

    // Add document title
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("SURAT ARAHAN PINDAHAN TUNAI", 105, 90, { align: "center" });

    // Add reference and date
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const reference = generateReference();
    doc.text(`Rujukan: ${reference}`, 20, 100);
    doc.text(`Tarikh: ${formatDate(new Date())}`, 20, 105);

    // Add recipient
    doc.text("Kepada:", 20, 115);
    doc.setFont("helvetica", "bold");
    doc.text("Pengurus", 20, 120);
    doc.setFont("helvetica", "normal");
    doc.text(`${transferDetails.value.cawangan}`, 20, 125);
    doc.text(`${transferDetails.value.daerah}`, 20, 130);

    // Add letter content
    doc.setFont("helvetica", "bold");
    doc.text("Tuan/Puan,", 20, 140);
    doc.text("ARAHAN PINDAHAN TUNAI", 20, 145);

    doc.setFont("helvetica", "normal");
    doc.text(
      "Dengan segala hormatnya, perkara di atas adalah dirujuk.",
      20,
      155
    );

    // Add transfer details
    const transferDetailsText = [
      `2. Dimaklumkan bahawa pihak Lembaga Zakat Selangor (LZS) ingin mengarahkan pindahan tunai sejumlah RM${formatCurrency(
        transferDetails.value.jumlahTunai
      )} untuk tujuan agihan bantuan kepada asnaf di daerah ${
        transferDetails.value.daerah
      }.`,
      "3. Berikut adalah butiran pegawai LZS yang diberi kuasa untuk menguruskan transaksi ini:",
      `Nama: ${transferDetails.value.namaPegawai}`,
      `No. Kad Pengenalan: ${formatIC(
        transferDetails.value.noKadPengenalanPegawai
      )}`,
      `No. Telefon: ${transferDetails.value.noTelefonPegawai}`,
      `4. Pindahan ini perlu dilaksanakan pada ${formatFullDateTime(
        transferDetails.value.tarikhMasaPengambilan
      )}.`,
      "5. Butiran rujukan peti besi dan ID arahan adalah seperti berikut:",
      `Rujukan Peti Besi: ${transferDetails.value.rujukanPetiBesi}`,
      `ID Arahan: ${transferDetails.value.idArahan}`,
      "6. Kerjasama pihak tuan/puan dalam melancarkan proses ini amatlah dihargai.",
    ];

    let yPosition = 165;
    transferDetailsText.forEach((text) => {
      const splitText = doc.splitTextToSize(text, 170);
      doc.text(splitText, 20, yPosition);
      yPosition += splitText.length * 5 + 5;
    });

    // Add signature
    yPosition += 10;
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
    doc.save(
      `Surat_Arahan_Pindahan_Tunai_${
        new Date().toISOString().split("T")[0]
      }.pdf`
    );

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
.letter-preview {
  font-family: Arial, sans-serif;
  line-height: 1.5;
  color: #333;
}

.letter-preview h1 {
  color: #111;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.letter-preview h2 {
  color: #111;
  font-size: 1.1rem;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
}

.letter-preview hr {
  border-color: #ddd;
  margin: 1rem 0;
}
</style>
