// composables/usePDF.js
import { ref } from "vue";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

export function usePDF() {
  const isGenerating = ref(false);

  /**
   * Format Malaysian IC number with dashes
   * @param {String} ic - IC number
   * @returns {String} Formatted IC
   */
  const formatIC = (ic) => {
    return `${ic.substring(0, 6)}-${ic.substring(6, 8)}-${ic.substring(8)}`;
  };

  /**
   * Format date to Malaysian format
   * @param {Date} date - Date to format
   * @returns {String} Formatted date
   */
  const formatDate = (date) => {
    return date.toLocaleDateString("ms-MY", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  /**
   * Format full date and time in Malaysian format
   * @param {Date} date - Date to format
   * @returns {String} Formatted date and time
   */
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

  /**
   * Format currency to Malaysian Ringgit format
   * @param {Number} value - Amount to format
   * @returns {String} Formatted currency
   */
  const formatCurrency = (value) => {
    return value.toLocaleString("ms-MY", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  /**
   * Generate reference number for the document
   * @returns {String} Generated reference number
   */
  const generateReference = () => {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");
    return `${year}/${randomNum}`;
  };

  /**
   * Generate and download PDF document
   * @param {String} documentTitle - Title for the document
   * @param {Object} transferDetails - Object containing transfer details
   */
  const generatePDF = async (documentTitle, transferDetails) => {
    isGenerating.value = true;

    try {
      // Create new PDF document
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Set document properties
      doc.setProperties({
        title: documentTitle,
        subject: "Surat Arahan Pindahan Wang",
        author: "Lembaga Zakat Selangor",
        creator: "LZS System",
      });

      // Starting position for content
      let yPosition = 20;

      // Directly add logo from image path using HTML Canvas
      try {
        // Create a canvas element
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Create an image element
        const img = new Image();

        // Wait for the image to load
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;

          // Set the source to the local image
          // This is a direct path which should work with Vue's public folder
          img.src = "/img/logo/lzs-logo-main.png"; // Make sure this file exists in the public folder
        });

        // Set canvas dimensions
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw image on canvas
        ctx.drawImage(img, 0, 0);

        // Get base64 string
        const imgData = canvas.toDataURL("image/png");

        // Add to PDF
        const imgWidth = 40; // Width in mm
        const imgHeight = (img.height * imgWidth) / img.width;
        const xOffset = (210 - imgWidth) / 2; // Center horizontally

        doc.addImage(imgData, "PNG", xOffset, yPosition, imgWidth, imgHeight);

        // Update position
        yPosition += imgHeight + 10;
      } catch (error) {
        console.error("Error adding logo:", error);
        // If logo fails, continue without it
        yPosition += 10;
      }

      // Add header - after logo if it exists
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
      doc.text("SURAT ARAHAN PINDAHAN WANG", 105, yPosition, {
        align: "center",
      });
      yPosition += 10;

      // Add reference and date
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Rujukan: LZS/APW/${generateReference()}`, 20, yPosition);
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
      doc.text(`Maybank ${transferDetails.cawangan}`, 20, yPosition);
      yPosition += 5;

      doc.text(`${transferDetails.daerah}`, 20, yPosition);
      yPosition += 10;

      // Add letter content
      doc.setFont("helvetica", "bold");
      doc.text("Tuan/Puan,", 20, yPosition);
      yPosition += 5;

      doc.text(
        "ARAHAN PINDAHAN WANG UNTUK TUJUAN AGIHAN BANTUAN",
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

      let text = `2. Dimaklumkan bahawa pihak Lembaga Zakat Selangor (LZS) ingin mengarahkan pindahan wang sejumlah RM${formatCurrency(
        transferDetails.jumlahPindahan
      )} untuk tujuan agihan bantuan kepada asnaf di daerah ${
        transferDetails.daerah
      }.`;

      // Split text to fit page width
      const splitText = doc.splitTextToSize(text, 170);
      doc.text(splitText, 20, yPosition);
      yPosition += splitText.length * 5 + 5;

      doc.text(
        "3. Berikut adalah butiran pegawai LZS yang diberi kuasa untuk menguruskan transaksi ini:",
        20,
        yPosition
      );
      yPosition += 10;

      doc.text(`Nama: ${transferDetails.namaPegawai}`, 30, yPosition);
      yPosition += 5;

      doc.text(
        `No. Kad Pengenalan: ${formatIC(
          transferDetails.noKadPengenalanPegawai
        )}`,
        30,
        yPosition
      );
      yPosition += 5;

      doc.text(
        `No. Telefon: ${transferDetails.noTelefonPegawai}`,
        30,
        yPosition
      );
      yPosition += 10;

      doc.text(
        `4. Pindahan ini perlu dilaksanakan pada ${formatFullDateTime(
          transferDetails.tarikhMasaPindahan
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
      doc.save(`${documentTitle}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      isGenerating.value = false;
    }
  };

  return {
    isGenerating,
    generatePDF,
  };
}
