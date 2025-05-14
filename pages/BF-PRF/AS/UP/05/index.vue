<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Salinan Sebelum Kemaskini Profil (NAS)
          </h2>
        </div>
      </template>

      <template #body>
        <!-- PDF Preview Section -->
        <div class="mb-8">
          <p class="text-sm text-gray-600 mb-4">
            Dokumen ini akan dijana sebagai rekod salinan sebelum perubahan
            dilaksanakan.
          </p>

          <div class="border rounded-lg p-4 mb-4 bg-gray-50">
            <!-- PDF Preview -->
            <div ref="pdfPreview" class="pdf-preview bg-white p-6">
              <div class="text-center mb-6">
                <h2 class="text-xl font-bold">SALINAN SEBELUM KEMASKINI</h2>
                <p class="text-sm">No. Rujukan: BF-PRF/AS/UP/06/2023</p>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p class="font-semibold">Tarikh:</p>
                  <p>{{ new Date().toLocaleDateString("ms-MY") }}</p>
                </div>
                <div>
                  <p class="font-semibold">No. Kad Pengenalan:</p>
                  <p>880101121234</p>
                </div>
              </div>

              <h3 class="font-bold border-b border-black mb-2">
                Maklumat Semasa
              </h3>
              <table class="w-full mb-6">
                <tr>
                  <td class="py-1 font-semibold w-1/3">Nama:</td>
                  <td class="py-1">AHMAD BIN ALI</td>
                </tr>
                <tr>
                  <td class="py-1 font-semibold">Alamat:</td>
                  <td class="py-1">
                    NO 12, JALAN MERAK 5, TAMAN BUKIT INDAH, 81200 JOHOR BAHRU,
                    JOHOR
                  </td>
                </tr>
                <tr>
                  <td class="py-1 font-semibold">No. Telefon:</td>
                  <td class="py-1">0123456789</td>
                </tr>
                <tr>
                  <td class="py-1 font-semibold">Emel:</td>
                  <td class="py-1">ahmad.ali@example.com</td>
                </tr>
              </table>

              <h3 class="font-bold border-b border-black mb-2">
                Perubahan Diluluskan
              </h3>
              <table class="w-full mb-6">
                <tr>
                  <td class="py-1 font-semibold w-1/3">Nama:</td>
                  <td class="py-1">AHMAD BIN ALI HAJI</td>
                </tr>
                <tr>
                  <td class="py-1 font-semibold">Alamat:</td>
                  <td class="py-1">
                    NO 15, JALAN MERAK 5, TAMAN BUKIT INDAH, 81200 JOHOR BAHRU,
                    JOHOR
                  </td>
                </tr>
                <tr>
                  <td class="py-1 font-semibold">No. Telefon:</td>
                  <td class="py-1">01123456789</td>
                </tr>
                <tr>
                  <td class="py-1 font-semibold">Emel:</td>
                  <td class="py-1">ahmad.ali.haji@example.com</td>
                </tr>
              </table>

              <div class="mt-8 flex justify-between items-end">
                <div class="text-xs italic">
                  <p>
                    Dokumen ini dijana secara automatik sebagai rekod salinan
                    sebelum kemaskini profil.
                  </p>
                </div>
                <div class="text-right">
                  <p
                    class="font-semibold border-t border-black pt-2 inline-block"
                  >
                    Tandatangan
                  </p>
                  <p class="text-sm">
                    Tarikh: {{ new Date().toLocaleDateString("ms-MY") }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-4 border-t pt-4">
            <rs-button variant="primary-outline" @click="generatePDF">
              <i class="ri-download-line mr-2"></i> Muat Turun Salinan
            </rs-button>
            <rs-button variant="primary" @click="GoToHadKifayah">
              <i class="ri-arrow-left-line mr-2"></i> Kira Had Kifayah
            </rs-button>
          </div>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { jsPDF } from "jspdf";

const breadcrumb = ref([
  {
    name: "Kelulusan",
    type: "parent",
    path: "/approval",
  },
  {
    name: "Salinan Sebelum Kemaskini",
    type: "current",
    path: "/approval/profile-copy",
  },
]);

const generatePDF = () => {
  const doc = new jsPDF();

  // Add logo or header if needed
  // doc.addImage(logo, 'JPEG', 10, 10, 50, 20);

  // Document title
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("SALINAN SEBELUM KEMASKINI", 105, 20, { align: "center" });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("No. Rujukan: BF-PRF/AS/UP/06/2023", 105, 28, { align: "center" });

  // Basic information
  doc.setFontSize(12);
  doc.text(`Tarikh: ${new Date().toLocaleDateString("ms-MY")}`, 20, 40);
  doc.text(`No. Kad Pengenalan: 880101121234`, 105, 40);

  // Current information section
  doc.setFont("helvetica", "bold");
  doc.text("Maklumat Semasa", 20, 50);
  doc.line(20, 52, 190, 52); // Underline
  doc.setFont("helvetica", "normal");

  const currentInfo = [
    "Nama: AHMAD BIN ALI",
    "Alamat: NO 12, JALAN MERAK 5, TAMAN BUKIT INDAH, 81200 JOHOR BAHRU, JOHOR",
    "No. Telefon: 0123456789",
    "Emel: ahmad.ali@example.com",
  ];

  currentInfo.forEach((item, index) => {
    doc.text(item, 20, 60 + index * 10);
  });

  // Approved changes section
  doc.setFont("helvetica", "bold");
  doc.text("Perubahan Diluluskan", 20, 100);
  doc.line(20, 102, 190, 102); // Underline
  doc.setFont("helvetica", "normal");

  const approvedChanges = [
    "Nama: AHMAD BIN ALI HAJI",
    "Alamat: NO 15, JALAN MERAK 5, TAMAN BUKIT INDAH, 81200 JOHOR BAHRU, JOHOR",
    "No. Telefon: 01123456789",
    "Emel: ahmad.ali.haji@example.com",
  ];

  approvedChanges.forEach((item, index) => {
    doc.text(item, 20, 110 + index * 10);
  });

  // Footer
  doc.setFontSize(10);
  doc.text(
    "Dokumen ini dijana secara automatik sebagai rekod salinan sebelum kemaskini profil.",
    20,
    160
  );

  // Signature area
  doc.setFontSize(12);
  doc.text("Tandatangan: ___________________________", 120, 180);
  doc.text(`Tarikh: ${new Date().toLocaleDateString("ms-MY")}`, 120, 190);

  // Save the PDF
  doc.save("Salinan_Sebelum_Kemaskini_BF-PRF_AS_UP_06_2023.pdf");
};

const GoToHadKifayah = () => {
  navigateTo("/BF-PRF/AS/UP/06");
};
</script>

<style scoped>
.pdf-preview {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
  color: #333;
  line-height: 1.5;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
}

.pdf-preview h2 {
  color: #111;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.pdf-preview h3 {
  color: #111;
  font-size: 1.1rem;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
}

.pdf-preview table {
  width: 100%;
  border-collapse: collapse;
}

.pdf-preview table tr td {
  padding: 4px 0;
  vertical-align: top;
}

.pdf-preview .text-xs {
  font-size: 0.75rem;
  line-height: 1rem;
}
</style>
