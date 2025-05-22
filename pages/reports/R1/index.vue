<template>
  <div>
    <LayoutsBreadcrumb :item="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex flex-col gap-1">
          <div class="flex justify-between items-center">
            <h1 class="text-xl font-bold uppercase text-center flex-1">
              Laporan Prestasi Agihan Disember 2024
            </h1>
            <div class="flex gap-2">
              <rs-button
                variant="primary-outline"
                size="sm"
                @click="downloadExcel"
                class="flex items-center"
              >
                <Icon name="mdi:microsoft-excel" class="mr-1" size="15" />
                Excel
              </rs-button>
              <rs-button
                variant="primary"
                size="sm"
                @click="downloadPDF"
                class="flex items-center"
              >
                <Icon name="mdi:file-pdf-box" class="mr-1" size="15" />
                PDF
              </rs-button>
            </div>
          </div>
        </div>
      </template>
      <template #body>
        <!-- Filter Controls -->
        <div class="bg-white rounded-md shadow-sm border border-gray-100 mb-4">
          <div class="flex items-center gap-3 px-3 py-2">
            <div class="flex items-center gap-1.5">
              <Icon
                name="ic:baseline-filter-list"
                class="text-gray-400 text-sm"
              />
              <span class="text-xs font-medium text-gray-500">Filter</span>
            </div>
            <div class="flex-1 flex items-center gap-2">
              <!-- Bantuan Select -->
              <div class="custom-select relative w-56">
                <button
                  @click="isBantuanOpen = !isBantuanOpen"
                  class="w-full h-8 px-2 text-xs text-left bg-white border border-gray-200 rounded hover:border-primary focus:outline-none focus:border-primary flex items-center justify-between"
                >
                  <span>{{ selectedBantuan || "Jenis Bantuan" }}</span>
                  <Icon
                    name="ic:baseline-keyboard-arrow-down"
                    class="text-gray-400 transition-transform"
                    :class="{ 'rotate-180': isBantuanOpen }"
                  />
                </button>
                <div
                  v-if="isBantuanOpen"
                  class="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-auto"
                >
                  <div
                    v-for="bantuan in uniqueBantuan"
                    :key="bantuan"
                    @click="
                      selectedBantuan = bantuan;
                      isBantuanOpen = false;
                    "
                    class="px-2 py-1.5 text-xs hover:bg-gray-50 cursor-pointer"
                    :class="{
                      'bg-primary/5 text-primary': selectedBantuan === bantuan,
                    }"
                  >
                    {{ bantuan }}
                  </div>
                </div>
              </div>

              <!-- Kategori Select -->
              <div class="custom-select relative w-36">
                <button
                  @click="isKategoriOpen = !isKategoriOpen"
                  class="w-full h-8 px-2 text-xs text-left bg-white border border-gray-200 rounded hover:border-primary focus:outline-none focus:border-primary flex items-center justify-between"
                >
                  <span>{{ selectedKategori || "Kategori" }}</span>
                  <Icon
                    name="ic:baseline-keyboard-arrow-down"
                    class="text-gray-400 transition-transform"
                    :class="{ 'rotate-180': isKategoriOpen }"
                  />
                </button>
                <div
                  v-if="isKategoriOpen"
                  class="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-auto"
                >
                  <div
                    v-for="kategori in kategoriOptions"
                    :key="kategori.value"
                    @click="
                      selectedKategori = kategori.value;
                      isKategoriOpen = false;
                    "
                    class="px-2 py-1.5 text-xs hover:bg-gray-50 cursor-pointer"
                    :class="{
                      'bg-primary/5 text-primary':
                        selectedKategori === kategori.value,
                    }"
                  >
                    {{ kategori.label }}
                  </div>
                </div>
              </div>

              <!-- Jenis Select -->
              <div class="custom-select relative w-28">
                <button
                  @click="isJenisOpen = !isJenisOpen"
                  class="w-full h-8 px-2 text-xs text-left bg-white border border-gray-200 rounded hover:border-primary focus:outline-none focus:border-primary flex items-center justify-between"
                >
                  <span>{{ selectedJenis || "Jenis" }}</span>
                  <Icon
                    name="ic:baseline-keyboard-arrow-down"
                    class="text-gray-400 transition-transform"
                    :class="{ 'rotate-180': isJenisOpen }"
                  />
                </button>
                <div
                  v-if="isJenisOpen"
                  class="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-auto"
                >
                  <div
                    v-for="jenis in jenisOptions"
                    :key="jenis.value"
                    @click="
                      selectedJenis = jenis.value;
                      isJenisOpen = false;
                    "
                    class="px-2 py-1.5 text-xs hover:bg-gray-50 cursor-pointer"
                    :class="{
                      'bg-primary/5 text-primary':
                        selectedJenis === jenis.value,
                    }"
                  >
                    {{ jenis.label }}
                  </div>
                </div>
              </div>
            </div>
            <div class="flex items-center gap-1.5">
              <rs-button
                @click="resetFilters"
                variant="primary-outline"
                size="sm"
              >
                <Icon name="ic:baseline-refresh" class="text-xs" />
                Reset
              </rs-button>
            </div>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table
            class="min-w-full border border-gray-300 bg-white text-sm"
            aria-label="Laporan Prestasi Agihan Disember 2024"
          >
            <thead class="sticky top-0 z-10 bg-gray-100">
              <tr>
                <th
                  class="border px-4 py-2 text-left align-middle whitespace-nowrap"
                >
                  Nama Bantuan
                </th>
                <th
                  class="border px-4 py-2 text-center align-middle whitespace-nowrap"
                ></th>
                <th
                  class="border px-4 py-2 text-right align-middle whitespace-nowrap"
                >
                  Fakir
                </th>
                <th
                  class="border px-4 py-2 text-right align-middle whitespace-nowrap"
                >
                  Miskin
                </th>
                <th
                  class="border px-4 py-2 text-right align-middle whitespace-nowrap"
                >
                  Muallaf
                </th>
                <th
                  class="border px-4 py-2 text-right align-middle whitespace-nowrap"
                >
                  Gharim
                </th>
                <th
                  class="border px-4 py-2 text-right align-middle whitespace-nowrap"
                >
                  Fisabillillah
                </th>
                <th
                  class="border px-4 py-2 text-right align-middle whitespace-nowrap"
                >
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              <template v-for="(bantuan, i) in filteredTableData" :key="i">
                <tr class="bg-slate-50 hover:bg-blue-50 transition">
                  <th
                    class="border px-4 py-2 align-middle text-left font-semibold"
                    :rowspan="2"
                    scope="row"
                  >
                    {{ bantuan.nama }}
                  </th>
                  <td
                    class="border px-4 py-2 text-center font-bold text-blue-700 bg-blue-50"
                  >
                    Bil
                  </td>
                  <td class="border px-4 py-2 text-right">
                    {{ bantuan.rows[0].fakir }}
                  </td>
                  <td class="border px-4 py-2 text-right">
                    {{ bantuan.rows[0].miskin }}
                  </td>
                  <td class="border px-4 py-2 text-right">
                    {{ bantuan.rows[0].muallaf }}
                  </td>
                  <td class="border px-4 py-2 text-right">
                    {{ bantuan.rows[0].gharim }}
                  </td>
                  <td class="border px-4 py-2 text-right">
                    {{ bantuan.rows[0].fisabillillah }}
                  </td>
                  <td class="border px-4 py-2 text-right font-bold">
                    {{ bantuan.rows[0].total }}
                  </td>
                </tr>
                <tr class="hover:bg-blue-50 transition">
                  <td
                    class="border px-4 py-2 text-center font-bold text-green-700 bg-green-50"
                  >
                    RM
                  </td>
                  <td class="border px-4 py-2 text-right">
                    {{ bantuan.rows[1].fakir }}
                  </td>
                  <td class="border px-4 py-2 text-right">
                    {{ bantuan.rows[1].miskin }}
                  </td>
                  <td class="border px-4 py-2 text-right">
                    {{ bantuan.rows[1].muallaf }}
                  </td>
                  <td class="border px-4 py-2 text-right">
                    {{ bantuan.rows[1].gharim }}
                  </td>
                  <td class="border px-4 py-2 text-right">
                    {{ bantuan.rows[1].fisabillillah }}
                  </td>
                  <td class="border px-4 py-2 text-right font-bold">
                    {{ bantuan.rows[1].total }}
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";

const breadcrumb = [
  {
    name: "Reports",
    type: "link",
    path: "/reports",
  },
  {
    name: "Prestasi Agihan Disember 2024",
    type: "link",
    path: "/reports/R1",
  },
];

const tableKey = ref(0);
const selectedBantuan = ref("");
const selectedKategori = ref("");
const selectedJenis = ref("");

// Dropdown states
const isBantuanOpen = ref(false);
const isKategoriOpen = ref(false);
const isJenisOpen = ref(false);

// Filter options
const kategoriOptions = [
  { label: "Semua Kategori", value: "" },
  { label: "Fakir", value: "fakir" },
  { label: "Miskin", value: "miskin" },
  { label: "Muallaf", value: "muallaf" },
  { label: "Gharim", value: "gharim" },
  { label: "Fisabillillah", value: "fisabillillah" },
];

const jenisOptions = [
  { label: "Semua Jenis", value: "" },
  { label: "Bil", value: "Bil" },
  { label: "RM", value: "RM" },
];

// Get unique bantuan names for filter
const uniqueBantuan = computed(() => {
  return [...new Set(tableData.value.map((item) => item.nama))];
});

// Filtered table data
const filteredTableData = computed(() => {
  return tableData.value.filter((bantuan) => {
    // Filter by bantuan name
    if (selectedBantuan.value && bantuan.nama !== selectedBantuan.value) {
      return false;
    }

    // Filter by kategori and jenis
    const hasMatchingRow = bantuan.rows.some((row) => {
      if (selectedJenis.value && row.type !== selectedJenis.value) {
        return false;
      }

      if (selectedKategori.value) {
        const value = row[selectedKategori.value];
        return value && value !== "" && value !== "0";
      }

      return true;
    });

    return hasMatchingRow;
  });
});

// Reset filters function
const resetFilters = () => {
  selectedBantuan.value = "";
  selectedKategori.value = "";
  selectedJenis.value = "";
};

// Click outside handler
const handleClickOutside = (event) => {
  const target = event.target;
  if (!target.closest(".custom-select")) {
    isBantuanOpen.value = false;
    isKategoriOpen.value = false;
    isJenisOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});

const tableData = ref([
  {
    nama: "BANTUAN KEWANGAN BULANAN",
    rows: [
      {
        type: "Bil",
        fakir: "23,940",
        miskin: "28,481",
        muallaf: "2,744",
        gharim: "",
        fisabillillah: "",
        total: "55,165",
      },
      {
        type: "RM",
        fakir: "#############",
        miskin: "#############",
        muallaf: "8,962,050.00",
        gharim: "",
        fisabillillah: "",
        total: "250,196,900.00",
      },
    ],
  },
  {
    nama: "BANTUAN MAKANAN BULANAN",
    rows: [
      {
        type: "Bil",
        fakir: "10,291",
        miskin: "12,526",
        muallaf: "198",
        gharim: "",
        fisabillillah: "",
        total: "23,015",
      },
      {
        type: "RM",
        fakir: "10,291.00",
        miskin: "12,526.00",
        muallaf: "198.00",
        gharim: "",
        fisabillillah: "",
        total: "21,218",
      },
    ],
  },
  {
    nama: "BANTUAN SEWA RUMAH",
    rows: [
      {
        type: "Bil",
        fakir: "8,471",
        miskin: "11,089",
        muallaf: "938",
        gharim: "",
        fisabillillah: "",
        total: "20,498",
      },
      {
        type: "RM",
        fakir: "57,398,331.80",
        miskin: "79,828,493.00",
        muallaf: "6,312,470.00",
        gharim: "",
        fisabillillah: "",
        total: "143,539,294.00",
      },
    ],
  },
  {
    nama: "BANTUAN KEPERLUAN PENDIDIKAN",
    rows: [
      {
        type: "Bil",
        fakir: "11,424",
        miskin: "22,369",
        muallaf: "323",
        gharim: "",
        fisabillillah: "",
        total: "34,116",
      },
      {
        type: "RM",
        fakir: "10,702,078.80",
        miskin: "19,914,823.16",
        muallaf: "187,391.37",
        gharim: "",
        fisabillillah: "",
        total: "30,804,393.33",
      },
    ],
  },
  {
    nama: "BANTUAN RAMADHAN & HARI RAYA",
    rows: [
      {
        type: "Bil",
        fakir: "26,185",
        miskin: "44,746",
        muallaf: "5,993",
        gharim: "",
        fisabillillah: "",
        total: "76,924",
      },
      {
        type: "RM",
        fakir: "11,907,850.00",
        miskin: "18,727,329.67",
        muallaf: "1,463,500.00",
        gharim: "",
        fisabillillah: "",
        total: "32,098,679.67",
      },
    ],
  },
  {
    nama: "BANTUAN DIALISIS",
    rows: [
      {
        type: "Bil",
        fakir: "",
        miskin: "632",
        muallaf: "",
        gharim: "1,719",
        fisabillillah: "",
        total: "2,740",
      },
      {
        type: "RM",
        fakir: "9,939,736.00",
        miskin: "15,486,311.00",
        muallaf: "44,400.00",
        gharim: "##########",
        fisabillillah: "",
        total: "68,549,307.00",
      },
    ],
  },
  {
    nama: "BANTUAN PERUBATAN",
    rows: [
      {
        type: "Bil",
        fakir: "2,021",
        miskin: "2,486",
        muallaf: "73",
        gharim: "",
        fisabillillah: "5,475",
        total: "10,415",
      },
      {
        type: "RM",
        fakir: "9,241,878.13",
        miskin: "18,201,357.20",
        muallaf: "304,733.60",
        gharim: "",
        fisabillillah: "##########",
        total: "63,716,410.17",
      },
    ],
  },
  {
    nama: "BANTUAN BINA/BELI RUMAH",
    rows: [
      {
        type: "Bil",
        fakir: "27",
        miskin: "62",
        muallaf: "2",
        gharim: "",
        fisabillillah: "",
        total: "91",
      },
      {
        type: "RM",
        fakir: "1,199,398.00",
        miskin: "3,311,334.00",
        muallaf: "13,619.00",
        gharim: "",
        fisabillillah: "",
        total: "4,524,410.51",
      },
    ],
  },
  {
    nama: "BANTUAN BAIKPULIH RUMAH",
    rows: [
      {
        type: "Bil",
        fakir: "5,831",
        miskin: "13,103",
        muallaf: "648",
        gharim: "",
        fisabillillah: "",
        total: "19,583",
      },
      {
        type: "RM",
        fakir: "5,831,539.00",
        miskin: "13,103,087.00",
        muallaf: "648,339.00",
        gharim: "",
        fisabillillah: "",
        total: "19,583,025.00",
      },
    ],
  },
  {
    nama: "BANTUAN MODAL",
    rows: [
      {
        type: "Bil",
        fakir: "29",
        miskin: "83",
        muallaf: "1",
        gharim: "0",
        fisabillillah: "0",
        total: "113",
      },
      {
        type: "RM",
        fakir: "7,790,302.77",
        miskin: "11,649,823.62",
        muallaf: "9,600.00",
        gharim: "",
        fisabillillah: "7,359,055.05",
        total: "27,446,539.59",
      },
    ],
  },
  {
    nama: "BANTUAN KEPERLUAN HIDUP",
    rows: [
      {
        type: "Bil",
        fakir: "5,780",
        miskin: "8,615",
        muallaf: "638",
        gharim: "64",
        fisabillillah: "3,382",
        total: "24,465",
      },
      {
        type: "RM",
        fakir: "128,300.00",
        miskin: "221,650.00",
        muallaf: "5,800.00",
        gharim: "1,650,500.00",
        fisabillillah: "",
        total: "2,006,250.00",
      },
    ],
  },
  {
    nama: "BANTUAN BENCANA",
    rows: [
      {
        type: "Bil",
        fakir: "",
        miskin: "",
        muallaf: "",
        gharim: "",
        fisabillillah: "",
        total: "490",
      },
      {
        type: "RM",
        fakir: "128,300.00",
        miskin: "221,650.00",
        muallaf: "5,800.00",
        gharim: "1,650,500.00",
        fisabillillah: "",
        total: "2,006,250.00",
      },
    ],
  },
  {
    nama: "PROGRAM PENERAPAN NILAI ISLAM",
    rows: [
      {
        type: "Bil",
        fakir: "",
        miskin: "",
        muallaf: "",
        gharim: "",
        fisabillillah: "",
        total: "551",
      },
      {
        type: "RM",
        fakir: "",
        miskin: "",
        muallaf: "",
        gharim: "",
        fisabillillah: "",
        total: "1,423,713.00",
      },
    ],
  },
  {
    nama: "BANTUAN BINA/BAIKPULIH/PERALATAN INSTITUSI AGAMA",
    rows: [
      {
        type: "Bil",
        fakir: "",
        miskin: "",
        muallaf: "",
        gharim: "",
        fisabillillah: "",
        total: "444",
      },
      {
        type: "RM",
        fakir: "",
        miskin: "",
        muallaf: "",
        gharim: "",
        fisabillillah: "",
        total: "15,554,227.03",
      },
    ],
  },
]);

// Download functions
const downloadPDF = () => {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  // Add title
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Laporan Prestasi Agihan Disember 2024", 148.5, 20, {
    align: "center",
  });

  // Add table headers
  const headers = [
    "Nama Bantuan",
    "Jenis",
    "Fakir",
    "Miskin",
    "Muallaf",
    "Gharim",
    "Fisabillillah",
    "Total",
  ];

  let yPosition = 30;
  const startX = 10;
  const colWidth = 35;

  // Add headers
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  headers.forEach((header, index) => {
    doc.text(header, startX + index * colWidth, yPosition);
  });

  // Add table data
  doc.setFont("helvetica", "normal");
  yPosition += 10;

  filteredTableData.value.forEach((bantuan) => {
    // Add bantuan name
    doc.text(bantuan.nama, startX, yPosition);
    yPosition += 7;

    // Add Bil row
    doc.text("Bil", startX + colWidth, yPosition);
    doc.text(bantuan.rows[0].fakir || "", startX + 2 * colWidth, yPosition);
    doc.text(bantuan.rows[0].miskin || "", startX + 3 * colWidth, yPosition);
    doc.text(bantuan.rows[0].muallaf || "", startX + 4 * colWidth, yPosition);
    doc.text(bantuan.rows[0].gharim || "", startX + 5 * colWidth, yPosition);
    doc.text(
      bantuan.rows[0].fisabillillah || "",
      startX + 6 * colWidth,
      yPosition
    );
    doc.text(bantuan.rows[0].total || "", startX + 7 * colWidth, yPosition);
    yPosition += 7;

    // Add RM row
    doc.text("RM", startX + colWidth, yPosition);
    doc.text(bantuan.rows[1].fakir || "", startX + 2 * colWidth, yPosition);
    doc.text(bantuan.rows[1].miskin || "", startX + 3 * colWidth, yPosition);
    doc.text(bantuan.rows[1].muallaf || "", startX + 4 * colWidth, yPosition);
    doc.text(bantuan.rows[1].gharim || "", startX + 5 * colWidth, yPosition);
    doc.text(
      bantuan.rows[1].fisabillillah || "",
      startX + 6 * colWidth,
      yPosition
    );
    doc.text(bantuan.rows[1].total || "", startX + 7 * colWidth, yPosition);
    yPosition += 10;

    // Add new page if needed
    if (yPosition > 180) {
      doc.addPage();
      yPosition = 20;
    }
  });

  // Save the PDF
  doc.save("Laporan_Prestasi_Agihan_Disember_2024.pdf");
};

const downloadExcel = () => {
  // Prepare data for Excel
  const excelData = [];

  // Add headers
  excelData.push([
    "Nama Bantuan",
    "Jenis",
    "Fakir",
    "Miskin",
    "Muallaf",
    "Gharim",
    "Fisabillillah",
    "Total",
  ]);

  // Add data rows
  filteredTableData.value.forEach((bantuan) => {
    // Add Bil row
    excelData.push([
      bantuan.nama,
      "Bil",
      bantuan.rows[0].fakir || "",
      bantuan.rows[0].miskin || "",
      bantuan.rows[0].muallaf || "",
      bantuan.rows[0].gharim || "",
      bantuan.rows[0].fisabillillah || "",
      bantuan.rows[0].total || "",
    ]);

    // Add RM row
    excelData.push([
      "",
      "RM",
      bantuan.rows[1].fakir || "",
      bantuan.rows[1].miskin || "",
      bantuan.rows[1].muallaf || "",
      bantuan.rows[1].gharim || "",
      bantuan.rows[1].fisabillillah || "",
      bantuan.rows[1].total || "",
    ]);
  });

  // Create worksheet
  const ws = XLSX.utils.aoa_to_sheet(excelData);

  // Create workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Laporan Prestasi Agihan");

  // Save file
  XLSX.writeFile(wb, "Laporan_Prestasi_Agihan_Disember_2024.xlsx");
};
</script>
