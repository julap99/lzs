<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card>
      <template #header>Keluarkan Arahan Pindahan Tunai</template>
      <template #body>
        <FormKit
          type="form"
          @submit="handleTransferSubmit"
          :actions="false"
          class="max-w-3xl mx-auto"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormKit
              type="select"
              name="daerah"
              label="Daerah"
              validation="required"
              placeholder="Pilih daerah"
              :options="daerahOptions"
              v-model="transferData.daerah"
              :validation-messages="{
                required: 'Sila pilih daerah',
              }"
            />

            <FormKit
              type="select"
              name="lokasiPengambilan"
              label="Lokasi Pengambilan"
              validation="required"
              placeholder="Pilih lokasi pengambilan"
              :options="lokasiOptions"
              v-model="transferData.lokasiPengambilan"
              :validation-messages="{
                required: 'Sila pilih lokasi pengambilan',
              }"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormKit
              type="text"
              name="namaPegawai"
              label="Nama Pegawai LZS Yang Diberi Kuasa"
              validation="required"
              placeholder="Masukkan nama pegawai"
              v-model="transferData.namaPegawai"
              :validation-messages="{
                required: 'Nama pegawai diperlukan',
              }"
            />

            <FormKit
              type="text"
              name="noKadPengenalan"
              label="No Kad Pengenalan Pegawai LZS"
              validation="required|length:12"
              placeholder="Masukkan no kad pengenalan"
              v-model="transferData.noKadPengenalan"
              :validation-messages="{
                required: 'No kad pengenalan diperlukan',
                length: 'No kad pengenalan mesti 12 digit',
              }"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormKit
              type="tel"
              name="noTelefon"
              label="No Telefon Pegawai LZS"
              validation="required"
              placeholder="Masukkan no telefon"
              v-model="transferData.noTelefon"
              :validation-messages="{
                required: 'No telefon diperlukan',
                matches: 'No telefon tidak sah',
              }"
            />

            <FormKit
              type="number"
              name="jumlahPindahan"
              label="Jumlah Pindahan Wang"
              validation="required|min:0"
              placeholder="Masukkan jumlah pindahan"
              v-model="transferData.jumlahPindahan"
              :validation-messages="{
                required: 'Jumlah pindahan diperlukan',
                min: 'Jumlah pindahan mesti lebih daripada 0',
              }"
            />
          </div>

          <div class="grid grid-cols-1 gap-4">
            <FormKit
              type="datetime-local"
              name="tarikhMasaPindahan"
              label="Tarikh dan Masa Pindahan"
              validation="required"
              v-model="transferData.tarikhMasaPindahan"
              :validation-messages="{
                required: 'Tarikh dan masa pindahan diperlukan',
              }"
            />
          </div>

          <div class="flex justify-end gap-4 mt-6">
            <rs-button variant="primary-outline" @click="resetTransferForm"
              >Reset</rs-button
            >
            <rs-button
              type="submit"
              variant="primary"
              @click="handleTransferSubmit"
              :loading="isGeneratingPDF"
              >{{
                isGeneratingPDF ? "Menjana PDF..." : "Keluarkan Arahan"
              }}</rs-button
            >
          </div>
        </FormKit>

        <!-- Letter Preview -->
        <div v-if="showPreview" class="mt-8 border rounded-lg p-6 bg-white">
          <div class="text-center mb-8">
            <img
              class="h-16 mx-auto mb-4"
              src="https://www.zakatselangor.com.my/wp-content/uploads/2018/10/lzs-logo.png"
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

          <div class="mb-6">
            <p class="mb-4">Kepada:</p>
            <p class="font-semibold mb-1">Pengurus</p>
            <p class="mb-1">Maybank {{ transferData.lokasiPengambilan }}</p>
            <p class="mb-4">{{ transferData.daerah }}</p>

            <p class="font-semibold mt-6 mb-2">Tuan/Puan,</p>
            <p class="font-semibold mb-4">ARAHAN PINDAHAN TUNAI</p>

            <p class="mb-4">
              Dengan segala hormatnya, perkara di atas adalah dirujuk.
            </p>

            <p class="mb-4">
              2. Dimaklumkan bahawa pihak Lembaga Zakat Selangor (LZS) ingin
              mengarahkan pindahan tunai sejumlah
              <span class="font-semibold"
                >RM{{ formatCurrency(transferData.jumlahPindahan) }}</span
              >
              untuk tujuan agihan bantuan kepada asnaf di daerah
              {{ transferData.daerah }}.
            </p>

            <p class="mb-4">
              3. Berikut adalah butiran pegawai LZS yang diberi kuasa untuk
              menguruskan transaksi ini:
            </p>

            <div class="pl-6 mb-4">
              <p class="mb-1">Nama: {{ transferData.namaPegawai }}</p>
              <p class="mb-1">
                No. Kad Pengenalan:
                {{ formatIC(transferData.noKadPengenalan) }}
              </p>
              <p class="mb-1">No. Telefon: {{ transferData.noTelefon }}</p>
            </div>

            <p class="mb-4">
              4. Pindahan ini perlu dilaksanakan pada
              {{ formatFullDateTime(transferData.tarikhMasaPindahan) }}.
            </p>

            <p class="mb-4">
              5. Kerjasama pihak tuan/puan dalam melancarkan proses ini amatlah
              dihargai.
            </p>
          </div>

          <div class="mt-12">
            <p class="mb-1">Yang benar,</p>
            <div class="h-16"></div>
            <p class="font-semibold">_________________________</p>
            <p class="font-semibold">(PENGURUS KEWANGAN)</p>
            <p>Lembaga Zakat Selangor</p>
          </div>

          <div class="flex justify-end gap-4 mt-6">
            <rs-button
              variant="primary"
              @click="handleDownloadPDF"
              :loading="isGeneratingPDF"
            >
              {{ isGeneratingPDF ? "Menjana PDF..." : "Muat Turun PDF" }}
            </rs-button>

            <rs-button
              variant="primary-outline"
              @click="navigateTo('/BF-PTPC/PC/BE/04')"
              >Seterusnya</rs-button
            >
          </div>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import jsPDF from "jspdf";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";

definePageMeta({
  title: "Keluarkan Arahan Pindahan Tunai",
});

const router = useRouter();
const showPreview = ref(false);
const isGeneratingPDF = ref(false);
const toast = useToast();

const breadcrumb = ref([
  {
    name: "Pengurusan Tunai",
    type: "link",
    path: `/BF-PTPC/PC/BE/01`,
  },
  {
    name: "Petty Cash",
    type: "link",
    path: `/BF-PTPC/PC/BE/01`,
  },
  {
    name: "Keluarkan Arahan Pindahan",
    type: "current",
    path: "/BF-PTPC/PC/BE/03",
  },
]);

// Mock data for options - replace with actual data from API
const daerahOptions = [
  { label: "Daerah A", value: "DA001" },
  { label: "Daerah B", value: "DA002" },
];

const lokasiOptions = [
  { label: "Lokasi A", value: "LA001" },
  { label: "Lokasi B", value: "LA002" },
];

interface TransferData {
  daerah: string;
  lokasiPengambilan: string;
  namaPegawai: string;
  noKadPengenalan: string;
  noTelefon: string;
  jumlahPindahan: string;
  tarikhMasaPindahan: string;
}

// Form data
const transferData = ref<TransferData>({
  daerah: "",
  lokasiPengambilan: "",
  namaPegawai: "",
  noKadPengenalan: "",
  noTelefon: "",
  jumlahPindahan: "0",
  tarikhMasaPindahan: "",
});

// Helper functions
const formatDate = (date: Date) => {
  return date.toLocaleDateString("ms-MY", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const formatFullDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString("ms-MY", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatCurrency = (value: string) => {
  return parseFloat(value).toLocaleString("ms-MY", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const formatIC = (ic: string) => {
  return `${ic.substring(0, 6)}-${ic.substring(6, 8)}-${ic.substring(8)}`;
};

const generateReference = () => {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `LZS/APT/${year}/${randomNum}`;
};

// Form handlers
const handleTransferSubmit = async (formData: TransferData) => {
  try {
    showPreview.value = true;
  } catch (error) {
    console.error("Error:", error);
    toast.error("Ralat. Sila cuba lagi.");
  }
};

const handleDownloadPDF = async () => {
  try {
    isGeneratingPDF.value = true;

    // Generate letter
    const documentTitle = `Surat_Arahan_Pindahan_Tunai_${
      new Date().toISOString().split("T")[0]
    }`;

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
    doc.text(`Maybank ${transferData.value.lokasiPengambilan}`, 20, 125);
    doc.text(`${transferData.value.daerah}`, 20, 130);

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
    const transferDetails = [
      `2. Dimaklumkan bahawa pihak Lembaga Zakat Selangor (LZS) ingin mengarahkan pindahan tunai sejumlah RM${formatCurrency(
        transferData.value.jumlahPindahan
      )} untuk tujuan agihan bantuan kepada asnaf di daerah ${
        transferData.value.daerah
      }.`,
      "3. Berikut adalah butiran pegawai LZS yang diberi kuasa untuk menguruskan transaksi ini:",
      `Nama: ${transferData.value.namaPegawai}`,
      `No. Kad Pengenalan: ${formatIC(transferData.value.noKadPengenalan)}`,
      `No. Telefon: ${transferData.value.noTelefon}`,
      `4. Pindahan ini perlu dilaksanakan pada ${formatFullDateTime(
        transferData.value.tarikhMasaPindahan
      )}.`,
      "5. Kerjasama pihak tuan/puan dalam melancarkan proses ini amatlah dihargai.",
    ];

    let yPosition = 165;
    transferDetails.forEach((text) => {
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
    doc.save(`${documentTitle}.pdf`);

    // Show success notification
    toast.success("PDF berjaya dimuat turun");

    // Navigate to next page
    router.push("/BF-PTPC/PC/BE/05");
  } catch (error) {
    console.error("Error generating PDF:", error);
    toast.error("Ralat semasa menjana PDF. Sila cuba lagi.");
  } finally {
    isGeneratingPDF.value = false;
  }
};

const resetTransferForm = () => {
  transferData.value = {
    daerah: "",
    lokasiPengambilan: "",
    namaPegawai: "",
    noKadPengenalan: "",
    noTelefon: "",
    jumlahPindahan: "0",
    tarikhMasaPindahan: "",
  };
  showPreview.value = false;
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
