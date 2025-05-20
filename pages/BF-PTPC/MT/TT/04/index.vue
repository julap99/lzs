<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Terima Bantuan & Slip Penerimaan Bantuan & Notifikasi
          </h2>
        </div>
      </template>

      <template #body>
        <!-- Info Details Section -->
        <div class="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 class="text-lg font-medium mb-4">Maklumat Aktiviti</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-600">Nama EKP</p>
              <p class="font-medium">{{ currentUserName }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Tarikh</p>
              <p class="font-medium">{{ formattedCurrentDate }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Status Agihan</p>
              <p
                class="font-medium text-lg"
                :class="bantuanDetails.statusClass"
              >
                {{ bantuanDetails.status }}
              </p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Rujukan</p>
              <p class="font-medium">{{ bantuanDetails.rujukan }}</p>
            </div>
          </div>
        </div>

        <!-- Success Message - Only shown after completion -->
        <div class="mb-6">
          <div class="flex items-center gap-2 mb-4">
            <Icon
              name="mdi:check-circle"
              class="text-green-500"
              size="1.5rem"
            />
            <p class="text-green-600 font-medium">
              Pengagihan bantuan tunai berjaya direkodkan
            </p>
          </div>

          <!-- Slip Penerimaan & Notification Section - shown after completion -->
          <div class="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div class="flex items-center gap-2 mb-4">
              <Icon name="mdi:receipt" class="text-blue-500" size="1.5rem" />
              <h3 class="text-lg font-medium text-blue-800">
                Slip Penerimaan & Notifikasi
              </h3>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p class="text-sm text-blue-700">
                  Slip penerimaan telah dijana
                </p>
                <div class="flex mt-2">
                  <rs-button
                    @click="printReceipt"
                    variant="primary-outline"
                    class="mr-2"
                  >
                    <Icon name="mdi:printer" class="mr-1" />
                    Cetak Slip
                  </rs-button>
                  <rs-button @click="downloadReceipt" variant="primary-outline">
                    <Icon name="mdi:download" class="mr-1" />
                    Muat Turun PDF
                  </rs-button>
                </div>
              </div>

              <div>
                <p class="text-sm text-blue-700">Status Notifikasi</p>
                <div class="flex items-center mt-2">
                  <Icon
                    name="mdi:check-circle"
                    class="text-green-500 mr-1"
                    size="1rem"
                  />
                  <span class="text-green-600 font-medium"
                    >Notifikasi Dihantar</span
                  >
                </div>
                <p class="text-xs text-gray-600 mt-1">
                  SMS & Emel dihantar kepada {{ formData.namaPemohon }} pada
                  {{ notificationTimestamp }}
                </p>
              </div>
            </div>

            <!-- Preview of receipt -->
            <div class="mt-4 border border-gray-200 rounded-lg p-4 bg-white">
              <h4 class="text-center font-semibold mb-4">
                Pratonton Slip Penerimaan
              </h4>
              <div class="receipt-preview">
                <div class="text-center mb-4">
                  <h5 class="font-bold">SLIP PENERIMAAN BANTUAN</h5>
                  <p>Bantuan Asnaf Sejahtera (BatuNAS)</p>
                </div>

                <div class="receipt-content">
                  <table class="w-full text-sm">
                    <tbody>
                      <tr>
                        <td class="py-1 font-medium">No. Rujukan:</td>
                        <td>{{ bantuanDetails.rujukan }}</td>
                      </tr>
                      <tr>
                        <td class="py-1 font-medium">Tarikh & Masa:</td>
                        <td>
                          {{ formData.tarikhAgihan }} {{ formData.masaAgihan }}
                        </td>
                      </tr>
                      <tr>
                        <td class="py-1 font-medium">Nama Penerima:</td>
                        <td>{{ formData.namaPemohon }}</td>
                      </tr>
                      <tr>
                        <td class="py-1 font-medium">No. Kad Pengenalan:</td>
                        <td>{{ formData.noKadPengenalan }}</td>
                      </tr>
                      <tr>
                        <td class="py-1 font-medium">Cawangan:</td>
                        <td>{{ cawangan }}</td>
                      </tr>
                      <tr>
                        <td class="py-1 font-medium">Nama Pegawai:</td>
                        <td>{{ currentUserName }}</td>
                      </tr>
                      <tr>
                        <td class="py-1 font-medium">Jenis Bantuan:</td>
                        <td>
                          {{ getJenisBantuanLabel(formData.jenisBantuan) }}
                        </td>
                      </tr>
                      <tr>
                        <td class="py-1 font-medium">Jumlah Diterima:</td>
                        <td class="font-bold">
                          RM {{ formData.jumlahDigunakan }}
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <div class="mt-6 text-center">
                    <div class="border-t border-gray-300 pt-4 mt-4">
                      <p class="text-xs">
                        Ini adalah cetakan komputer. Tandatangan tidak
                        diperlukan.
                      </p>
                      <p class="text-xs">
                        Sila simpan slip ini sebagai bukti penerimaan bantuan.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Navigation buttons after completion -->
        <div class="flex justify-end gap-4 mt-6">
          <rs-button variant="primary-outline" @click="navigateToList">
            Kembali ke Senarai
          </rs-button>

          <rs-button variant="primary" @click="navigateToNextApplication">
            Bantuan Seterusnya
          </rs-button>
        </div>
      </template>
    </rs-card>

    <!-- Confirmation Modal -->
    <rs-modal
      title="Sahkan Pengagihan Bantuan Tunai"
      v-model="showConfirmationModal"
      ok-title="Sahkan"
      cancel-title="Batal"
      position="center"
    >
      <template #body>
        <p class="mb-4">
          Adakah anda pasti untuk mengesahkan pengagihan bantuan tunai ini?
        </p>
        <div class="bg-gray-50 p-4 rounded-lg">
          <p class="font-medium">Nama Pemohon: {{ formData.namaPemohon }}</p>
          <p class="font-medium">
            No. Kad Pengenalan: {{ formData.noKadPengenalan }}
          </p>
          <p class="font-medium">
            Jenis Bantuan: {{ getJenisBantuanLabel(formData.jenisBantuan) }}
          </p>
          <p class="font-medium">
            Jumlah Diluluskan: RM {{ formData.jumlahDiluluskan || "0.00" }}
          </p>
          <p class="font-medium">
            Jumlah Diagihkan: RM {{ formData.jumlahDigunakan || "0.00" }}
          </p>
          <p class="text-sm text-gray-600 mt-2">
            Pastikan butiran penerima dan jumlah yang diagihkan adalah tepat
            sebelum mengesahkan.
          </p>
        </div>
      </template>

      <template #footer>
        <rs-button
          @click="showConfirmationModal = false"
          :disabled="processing"
          variant="primary-outline"
        >
          Tutup
        </rs-button>

        <rs-button @click="handleConfirm()" :disabled="processing">
          <span v-if="processing">
            <Icon name="eos-icons:loading" class="ml-1" size="1rem" />
          </span>
          <span v-else> Sah & Rekod </span>
        </rs-button>
      </template>
    </rs-modal>

    <!-- Receipt Modal -->
    <rs-modal
      title="Slip Penerimaan Bantuan"
      v-model="showReceiptModal"
      position="center"
      size="lg"
    >
      <template #body>
        <div
          class="receipt-full p-4 border border-gray-200 rounded bg-white"
          ref="receiptToPrint"
        >
          <div class="text-center mb-4">
            <h3 class="font-bold text-xl">SLIP PENERIMAAN BANTUAN</h3>
            <p class="text-gray-600">Bantuan Asnaf Sejahtera (BatuNAS)</p>
          </div>

          <div class="receipt-content mt-6">
            <table class="w-full">
              <tbody>
                <tr class="border-b border-gray-200">
                  <td class="py-2 font-medium">No. Rujukan:</td>
                  <td>{{ bantuanDetails.rujukan }}</td>
                </tr>
                <tr class="border-b border-gray-200">
                  <td class="py-2 font-medium">Tarikh & Masa:</td>
                  <td>{{ formData.tarikhAgihan }} {{ formData.masaAgihan }}</td>
                </tr>
                <tr class="border-b border-gray-200">
                  <td class="py-2 font-medium">Nama Penerima:</td>
                  <td>{{ formData.namaPemohon }}</td>
                </tr>
                <tr class="border-b border-gray-200">
                  <td class="py-2 font-medium">No. Kad Pengenalan:</td>
                  <td>{{ formData.noKadPengenalan }}</td>
                </tr>
                <tr class="border-b border-gray-200">
                  <td class="py-2 font-medium">Cawangan:</td>
                  <td>{{ cawangan }}</td>
                </tr>
                <tr class="border-b border-gray-200">
                  <td class="py-2 font-medium">Nama Pegawai:</td>
                  <td>{{ currentUserName }}</td>
                </tr>
                <tr class="border-b border-gray-200">
                  <td class="py-2 font-medium">Jenis Bantuan:</td>
                  <td>{{ getJenisBantuanLabel(formData.jenisBantuan) }}</td>
                </tr>
                <tr class="border-b border-gray-200">
                  <td class="py-2 font-medium">Jumlah Diterima:</td>
                  <td class="font-bold">RM {{ formData.jumlahDigunakan }}</td>
                </tr>
              </tbody>
            </table>

            <div class="mt-8 flex justify-center">
              <div class="text-center">
                <div
                  class="signature-box h-24 w-48 border border-gray-300 mx-auto mb-2"
                ></div>
                <p class="text-sm">Tandatangan Penerima</p>
              </div>
            </div>

            <div class="mt-8 text-center">
              <div class="border-t border-gray-300 pt-4 mt-4">
                <p class="text-xs mb-1">
                  Ini adalah cetakan komputer yang dijana oleh Sistem Bantuan
                  Asnaf Sejahtera (BatuNAS).
                </p>
                <p class="text-xs">
                  Sila simpan slip ini sebagai bukti penerimaan bantuan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </template>

      <template #footer>
        <rs-button @click="showReceiptModal = false" variant="primary-outline">
          Tutup
        </rs-button>

        <rs-button @click="printReceiptFromModal">
          <Icon name="mdi:printer" class="mr-1" />
          Cetak
        </rs-button>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

definePageMeta({
  title: "Sahkan Jumlah & Agih Bantuan",
});

const route = useRoute();
const router = useRouter();
const isCompleted = ref(false);
const processing = ref(false);
const showConfirmationModal = ref(false);
const showReceiptModal = ref(false);
const receiptToPrint = ref(null);
const cawangan = ref("Batu 7, Gombak");
const notificationTimestamp = ref("");

const breadcrumb = ref([
  {
    name: "Pengurusan Tunai",
    type: "link",
    path: `/BF-PTPC/MT/TT/01`,
  },
  {
    name: "Agih Tunai Kaunter",
    type: "link",
    path: `/BF-PTPC/MT/TT/01`,
  },
  {
    name: "Terima Bantuan & Slip Penerimaan Bantuan & Notifikasi",
    type: "current",
    path: "/BF-PTPC/MT/TT/04",
  },
]);

const bantuanDetails = ref({
  status: "Belum Diagihkan",
  statusClass: "text-gray-600",
  rujukan: "AGH-" + new Date().toISOString().slice(0, 10).replace(/-/g, ""),
});

const currentUserName = ref("Noor Aisyah binti Abdullah");
const currentDate = computed(() => {
  return new Date().toISOString().slice(0, 10);
});
const currentTime = computed(() => {
  return new Date().toTimeString().slice(0, 5);
});
const formattedCurrentDate = computed(() => {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date().toLocaleDateString("ms-MY", options);
});

const jenisbantuanOptions = [
  { label: "Sila Pilih", value: "" },
  { label: "Bantuan Kewangan Bulanan", value: "bulanan" },
  { label: "Bantuan Kecemasan", value: "kecemasan" },
  { label: "Bantuan Perubatan", value: "perubatan" },
  { label: "Bantuan Pendidikan", value: "pendidikan" },
  { label: "Bantuan Bencana", value: "bencana" },
];

const formData = ref({
  noKadPengenalan: "880101015555",
  namaPemohon: "Muhammad bin Ibrahim",
  jenisBantuan: "bulanan",
  jumlahDiluluskan: 500,
  jumlahDigunakan: 500,
  tarikhAgihan: currentDate.value,
  masaAgihan: currentTime.value,
  statusSerahan: "",
  pengesahanIdentiti: false,
  pengesahanJumlah: false,
  sendSMS: true,
  sendEmail: true,
  catatan: "",
});

const getJenisBantuanLabel = (value) => {
  const option = jenisbantuanOptions.find((opt) => opt.value === value);
  return option ? option.label : value;
};

const navigateBack = () => {
  router.back();
};

const navigateToList = () => {
  router.push(`/BF-PTPC/MT/TT/01`);
};

const navigateToNextApplication = () => {
  // Navigate to the next pending application
  router.push(`/BF-PTPC/MT/TT/01`);
};

const validateAndShowConfirmation = () => {
  // Validation checks
  // if (!formData.value.pengesahanIdentiti) {
  //   alert("Sila lakukan pengesahan identiti terlebih dahulu");
  //   return;
  // }

  // if (!formData.value.pengesahanJumlah) {
  //   alert("Sila sahkan jumlah wang tunai terlebih dahulu");
  //   return;
  // }

  // if (!formData.value.statusSerahan) {
  //   alert("Sila pilih status serahan");
  //   return;
  // }

  // if (formData.value.jumlahDigunakan <= 0) {
  //   alert("Jumlah diagihkan mesti lebih daripada sifar");
  //   return;
  // }

  // if (formData.value.jumlahDigunakan > formData.value.jumlahDiluluskan) {
  //   alert("Jumlah diagihkan tidak boleh melebihi jumlah diluluskan");
  //   return;
  // }

  showConfirmationModal.value = true;
};

const handleConfirm = async () => {
  processing.value = true;

  // Simulate API call to save the distribution data
  setTimeout(async () => {
    processing.value = false;
    showConfirmationModal.value = false;
    isCompleted.value = true;
    bantuanDetails.value.status = "Bantuan Diagihkan";
    bantuanDetails.value.statusClass = "text-green-600";

    // Generate timestamp for notification
    const now = new Date();
    notificationTimestamp.value = `${now.toLocaleDateString(
      "ms-MY"
    )} ${now.toLocaleTimeString("ms-MY")}`;

    // Generate and send notifications (SMS/Email)
    if (formData.value.sendSMS) {
      // Simulate sending SMS
      console.log("SMS notification sent to recipient");
    }

    if (formData.value.sendEmail) {
      // Simulate sending Email
      console.log("Email notification sent to recipient");
    }
  }, 1500);
};

const handleSubmit = (data) => {
  // Handle form submission
  console.log("Form submitted:", data);
  validateAndShowConfirmation();
};

const printReceipt = () => {
  showReceiptModal.value = true;
};

const printReceiptFromModal = () => {
  if (!receiptToPrint.value) return;

  // Prepare printing
  const printWindow = window.open("", "_blank");
  printWindow.document.write(
    "<html><head><title>Slip Penerimaan Bantuan</title>"
  );
  printWindow.document.write("<style>");
  printWindow.document.write(`
    body { font-family: Arial, sans-serif; padding: 20px; }
    .receipt-full { max-width: 700px; margin: 0 auto; }
    table { width: 100%; border-collapse: collapse; }
    td { padding: 8px 4px; }
    .signature-box { height: 100px; border: 1px solid #ddd; margin: 20px auto; width: 200px; }
  `);
  printWindow.document.write("</style></head><body>");
  printWindow.document.write(receiptToPrint.value.outerHTML);
  printWindow.document.write("</body></html>");

  printWindow.document.close();
  printWindow.focus();

  // Print after a short delay to ensure content is loaded
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 250);
};

const downloadReceipt = () => {
  // In a real implementation, this would generate a PDF file
  // For simulation purposes, we'll just open the print modal
  alert("Fungsi muat turun PDF akan diaktifkan dalam versi penuh sistem");
  printReceipt();
};
</script>

<style>
.receipt-preview {
  font-size: 0.875rem;
  border: 1px dashed #ccc;
  padding: 1rem;
  background-color: #fcfcfc;
}

.receipt-content table {
  width: 100%;
  border-collapse: collapse;
}

.receipt-content table td {
  padding: 0.25rem 0;
}

.signature-box {
  border: 1px solid #ddd;
  position: relative;
}
</style>
