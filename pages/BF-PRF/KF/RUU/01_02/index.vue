<template>
    <div>
      <LayoutsBreadcrumb :items="breadcrumb" />
  
      <rs-card class="mt-4">
        <template #header>
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold">Kategori Maklumat</h2>
          </div>
        </template>
  
        <template #body>
          <!-- Kategori Maklumat Dropdown -->
          <div class="mb-6">
            <select
              v-model="selectedKategori"
              @change="handleKategoriChange"
              class="py-2 px-4 text-sm rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-primary min-w-[300px]"
            >
              <option value="">-- Pilih Kategori Maklumat --</option>
              <option
                v-for="kategori in kategoriOptions"
                :key="kategori.value"
                :value="kategori.value"
              >
                {{ kategori.label }}
              </option>
            </select>
          </div>
  
          <!-- Headers-only when no data -->
          <div v-if="ruuFields.length === 0" class="mt-4 border rounded overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama RUU Field</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kaedah Kemaskini</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
            </table>
          </div>
  
          <!-- Data table -->
          <div v-else class="mt-4">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama RUU Field</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kaedah Kemaskini</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="(item, index) in ruuFields" :key="item.id" class="hover:bg-gray-50">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ index + 1 }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <!-- RUU Field: readonly input for existing, editable for new -->
                      <input
                        v-model="item.namaRuuField"
                        type="text"
                        :readonly="!item.isNew"
                        :class="[
                          'py-1 px-2 text-sm border rounded min-w-[260px]',
                          item.isNew 
                            ? 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary' 
                            : 'border-gray-200 bg-gray-50 text-gray-600'
                        ]"
                        :placeholder="item.isNew ? 'Masukkan nama RUU field' : ''"
                      />
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <!-- Kaedah Kemaskini: readonly dropdown for existing, editable for new -->
                      <select
                        v-model="item.kaedahKemaskini"
                        :disabled="!item.isNew"
                        :class="[
                          'py-1 px-2 text-sm border rounded min-w-[220px]',
                          item.isNew 
                            ? 'border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-primary' 
                            : 'border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed'
                        ]"
                      >
                        <option value="">-- Pilih Kaedah --</option>
                        <option v-for="opt in kaedahKemaskiniOptions" :key="opt.id" :value="opt.id">
                          {{ opt.namaKaedah }}
                        </option>
                      </select>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <select
                        v-model="item.status"
                        class="py-1 px-2 text-sm border border-gray-300 rounded bg-white min-w-[160px]"
                      >
                        <option value="Aktif">Aktif</option>
                        <option value="Tidak Aktif">Tidak Aktif</option>
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
  
          <!-- Add New RUU Field Button -->
          <div class="mt-4 flex justify-end">
            <rs-button
              variant="success"
              size="sm"
              @click="tambahRuuField"
              class="flex items-center"
              :disabled="!selectedKategori"
              title="Tambah RUU Field Baru"
            >
              <Icon name="ph:plus" class="w-4 h-4" />
            </rs-button>
          </div>
  
          <!-- Action Buttons -->
          <div v-if="ruuFields.length > 0" class="mt-6 flex justify-end space-x-3">
            <rs-button
              variant="secondary"
              size="sm"
              @click="simpanData"
              class="flex items-center"
              title="Simpan Data"
            >
              <Icon name="ph:floppy-disk" class="w-4 h-4 mr-2" />
              Simpan
            </rs-button>
            <rs-button
              variant="primary"
              size="sm"
              @click="hantarData"
              class="flex items-center"
              title="Hantar Data"
            >
              <Icon name="ph:paper-plane" class="w-4 h-4 mr-2" />
              Hantar
            </rs-button>
          </div>
        </template>
      </rs-card>
    </div>
  </template>
  
  <script setup>
  import { ref, nextTick, onMounted } from "vue";
  
  definePageMeta({ title: "Konfigurasi Kelulusan Data (RUU)" });
  
  /* ---------- Breadcrumb ---------- */
  const breadcrumb = ref([
    { name: "Profiling", type: "link", path: "/BF-PRF/KF/RUU/admin" },
    { name: "Konfigurasi Kelulusan Data (RUU)", type: "current", path: "/BF-PRF/KF/RUU/admin" },
  ]);
  
  /* ---------- State ---------- */
  const tableKey = ref(0);
  const ruuFields = ref([]);
  const selectedKategori = ref("");
  
  /* ---------- Dropdown options ---------- */
  const kategoriOptions = ref([
    { label: "Maklumat Peribadi Asnaf", value: "maklumat-peribadi-asnaf" },
    { label: "Maklumat Pendidikan", value: "maklumat-pendidikan" },
    { label: "Maklumat Pengislaman", value: "maklumat-pengislaman" },
    { label: "Maklumat Status Perkahwinan", value: "maklumat-status-perkahwinan" },
    { label: "Maklumat Perbankan", value: "maklumat-perbankan" },
    { label: "Maklumat Kesihatan", value: "maklumat-kesihatan" },
    { label: "Maklumat Kemahiran", value: "maklumat-kemahiran" },
    { label: "Maklumat Alamat", value: "maklumat-alamat" },
    { label: "Maklumat Kediaman/Tempat Tinggal", value: "maklumat-kediaman" },
    { label: "Maklumat Pinjaman Harta", value: "maklumat-pinjaman-harta" },
    { label: "Maklumat Pemilikan Aset", value: "maklumat-pemilikan-aset" },
    { label: "Maklumat Pemilikan Barangan Rumah (Kemudahan Domestik)", value: "maklumat-barangan-rumah" },
    { label: "Maklumat Pekerjaan Ketua Keluarga", value: "maklumat-pekerjaan-ketua-keluarga" },
    { label: "Maklumat Pendapatan dan Perbelanjaan Seisi Rumah", value: "maklumat-pendapatan-perbelanjaan" },
    { label: "Maklumat Waris", value: "maklumat-waris" },
    { label: "Maklumat Peribadi Tanggungan", value: "maklumat-peribadi-tanggungan" },
    { label: "Maklumat Pengislaman Tanggungan", value: "maklumat-pengislaman-tanggungan" },
    { label: "Maklumat Perbankan Tanggungan", value: "maklumat-perbankan-tanggungan" },
    { label: "Maklumat Pendidikan Tanggungan", value: "maklumat-pendidikan-tanggungan" },
    { label: "Maklumat Kesihatan Tanggungan", value: "maklumat-kesihatan-tanggungan" },
    { label: "Maklumat Kemahiran Tanggungan", value: "maklumat-kemahiran-tanggungan" },
    { label: "Maklumat Pekerjaan Tanggungan", value: "maklumat-pekerjaan-tanggungan" }
  ]);
  
  const kaedahKemaskiniOptions = ref([
    { id: 'KK001', namaKaedah: 'Asnaf Review' },
    { id: 'KK002', namaKaedah: 'Update asnaf with approval/verify' },
    { id: 'KK003', namaKaedah: 'Update Asnaf without Approval/verify' },
  ]);
  
  /* ---------- Full field mapping: Maklumat Peribadi Asnaf (20+ rows) ---------- */
  const kategoriToFields = {
    "maklumat-peribadi-asnaf": [
      "Jenis Pengenalan",
      "Nombor ID",
      "Nama (Seperti dalam dokumen ID)",
      "Upload dokumen Nombor ID",
      "No Pasport",
      "Tarikh Mula Pasport",
      "Tarikh Tamat Pasport",
      "Warganegara",
      "Taraf Penduduk Tetap",
      "Tarikh Lahir",
      "Umur",
      "Tempat Lahir",
      "Jantina",
      "Agama",
      "Bangsa",
      "No Telefon Bimbit",
      "No Telefon Rumah",
      "Emel",
      "Status Asnaf",
    ],
    "maklumat-pendidikan": [
      "Masih Bersekolah",
      "Pendidikan Tertinggi",
      "Tahap Pendidikan yang dicapai",
      "Upload Sijil Pendidikan yang diperolehi",
    ],
    "maklumat-pengislaman": [
      "Nama Selepas Islam (Muallaf)",
      "Nama Sebelum Islam (Muallaf)",
      "Tarikh Jangkaan Mukalaf",
      "Tarikh Had Taklif",
      "Upload Surat Pengislaman jika tarikh masuk islam diisi",
    ],
    "maklumat-status-perkahwinan": [
      "Status Perkahwinan",
      "Status Poligami",
      "Bilangan",
      "No K/P Pasangan mengikut bilangan",
      "Nama Pasangan mengikut bilangan",
    ],
    "maklumat-perbankan": [
      "Nama Bank",
      "Swiftcode",
      "No Akaun Bank",
      "Nama Pemegang Akaun",
      "Kaedah Pembayaran",
    ],
    "maklumat-kesihatan": [
      "Tahap Kesihatan : Sihat/Sakit Kronik/OKU/Uzur",
      "Sakit Kronik - Keadaan Kesihatan (Terlantar/Tidak Terlantar)",
      "Sakit Kronik - Kos Penjagaan (Berbayar/Tidak berbayar)",
      "Sakit Kronik - Jumlah Perbelanjaan Bulanan (RM)",
      "OKU - Kesempurnaan Fizikal (Sempurna/Cacat Mental/Cacat Fizikal)",
      "OKU - Sebab Kecacatan (Jika Cacat) (Sejak Lahir/Musibah)",
      "OKU - Tahap Kecacatan (Terlantar/Tidak Terlantar)",
      "OKU - Jumlah Perbelanjaan Bulanan (RM)",
      "Uzur - Keadaan Kesihatan (Terlantar/Tidak Terlantar)",
      "Uzur - Kos Penjagaan (Berbayar/Tidak berbayar)",
      "Uzur - Jumlah Perbelanjaan Bulanan (RM)",
      "Upload dokumen sokongan berkaitan kesihatan",
    ],
    "maklumat-kemahiran": [
      "Kemahiran",
    ],
    "maklumat-alamat": [
      "Alamat",
      "Alamat 1",
      "Alamat 2",
      "Alamat 3",
      "Daerah",
      "Poskod",
      "Bandar",
      "Negeri",
      "Kariah",
      "Geolokasi",
      "Tempoh Menetap di Selangor",
    ],
    "maklumat-kediaman": [
      "Status Kediaman/Tempat Tinggal",
      "Keadaan Kediaman",
      "Kemudahan Asas:",
      "Status Kediaman jika Milik Sendiri : Berbayar RM xxx per bulan/Tidak Berbayar",
      "Kediaman jika Sewa : Kadar sewa bulanan RM xxx per bulan",
      "Upload dokumen perjanjian sewa jika status kediaman = Sewa",
    ],
    "maklumat-pinjaman-harta": [
      "Nama Institusi/Individu Pemberi Pinjaman",
      "Jenis Pinjaman Nyatakan",
      "Amaun Bayaran Bulanan (RM)",
      "Jumlah Keseluruhan Perbelanjaan (RM)",
      "Tahun Mula Pinjaman",
      "Tahun Akhir Pinjaman",
      "Upload dokumen pinjaman",
    ],
    "maklumat-pemilikan-aset": [
      "Aset Cair: Jumlah wang simpanan (*sertakan penyata bank) (RM)",
      "Emas (gm)",
      "Saham (RM)",
      "Aset Tidak Cair: Kenderaan (Nyatakan Unit) Basikal/Kereta/Motosikal/'Van/Lori'",
      "Rumah Kedai (unit)",
      "Tanah/Sawah (ekar)",
    ],
    "maklumat-pekerjaan-ketua-keluarga": [
      "Jenis Pekerjaan",
      "Sektor Pekerjaan : Kerajaan/Swasta/Badan Berkanun/Kerja Sendiri Nyatakan",
      "Nama Majikan",
      "No Tel Majikan",
      "Alamat Majikan",
      "Alamat Majikan 1",
      "Alamat Majikan 2",
      "Alamat Majikan 3",
      "Bandar",
      "Poskod",
      "Daerah",
      "Negeri",
      "Negara",
      "Jawatan",
      "Status Jawatan (Tetap/Kontrak/Sementara)",
      "Pendapatan Kasar (RM)",
      "Jumlah diterima",
      "Upload pengesahan pendapatan/penyata gaji ketua keluarga",
    ],
    "maklumat-waris": [
      "Jenis Pengenalan : No Kad Pengenalan/Foreign ID",
      "Nombor ID:",
      "Nama Waris",
      "Hubungan",
      "No Telefon",
    ],
    "maklumat-peribadi-tanggungan": [
      "Hubungan dengan Pemohon/Asnaf ('Pasangan Pemohon'/'Isteri Kedua'/'Isteri Ketiga'/'Isteri Keempat'/Ipar/Abang/Bapa/Ibu/Kakak/Adik/Anak/Cucu/'Bapa Mertua'/'Ibu Mertua'/'Lain-lain Nyatakan')",
      "Jika Hubungan = Pasangan, upload surat nikah",
      "Nama (Nama mengikut pengenalan) :",
      "Jenis Pengenalan : (No Kad Pengenalan/Foreign ID/MyKad/MyKid)",
      "Nombor ID : (No Pengenalan Pasangan/Tanggungan)",
      "Upload dokumen pengenalan diri pasangan/tanggungan",
      "No Pasport",
      "Tarikh Mula Pasport",
      "Tarikh Tamat Pasport",
      "Warganegara: Malaysia/Lain-lain Nyatakan",
      "Taraf Penduduk Tetap",
      "Tarikh Lahir",
      "Umur:",
      "Tempat Lahir :",
      "Jantina",
      "Agama :",
      "Bangsa",
      "No Telefon Bimbit :",
      "Emel",
      "Tempoh Menetap Di Selangor",
      "Status Perkahwinan",
      "Jumlah tanggungan akan dikira dari maklumat pasangan dan tanggungan yang telah dimasukkan. (R)",
    ],
    "maklumat-pengislaman-tanggungan": [
      "Tarikh Masuk Islam",
      "Tarikh Masuk Kelas Fardu Ain Muallaf (KFAM)",
      "Nama Selepas Islam (Muallaf)",
      "Nama Sebelum Islam (Muallaf)",
      "Tarikh Jangkaan Mukalaf",
      "Upload surat pengislaman jika tarikh masuk islam diisi",
    ],
    "maklumat-perbankan-tanggungan": [
      "Bank",
      "Swiftcode",
      "No Akaun Bank",
      "Nama Pemegang Akaun",
      "Kaedah Pembayaran",
      "Nyatakan sebab jika Kaedah Pembayaran = Tiada",
    ],
    "maklumat-pendidikan-tanggungan": [
      "Bersekolah",
      "Pendidikan Tertinggi ('Peringkat Rendah'/'SRP/PMR'/SPM/Sijil/Diploma/STPM/Ijazah/Lain-lain Nyatakan",
      "Jenis Sekolah ('Pra Sekolah'/'Sekolah Rendah Kebangsaan'/'Sekolah Menengah Kebangsaan'/'Sekolah Menengah Agama'/'Sekolah Rendah Kebangsaan dan Agama'/'IPTA/IPTS'/'Maahd Tahfiz')",
      "Upload dokumen sokongan berkaitan Pendidikan mengikut tanggungan",
      "Kategori Sekolah/Institusi (SEK.MEN/SRK/IPTA/IPTS/SRA/KAFA)",
      "Tahun Bersekolah",
      "Tahun/Tingkatan/Tahun Pengajian/Semester",
      "Nama Sekolah/Institusi",
      "Alamat",
      "Alamat 1",
      "Alamat 2",
      "Alamat 3",
      "Daerah",
      "Bandar",
      "Negeri",
      "Poskod",
      "Tinggal Bersama Keluarga Y/T/Asrama . Jika Tidak, nyatakan Asrama/Rumah Sewa",
      "Bidang/Kursus Pengajian: 'Sijil/SKM'/'Diploma'/'Ijazah Sarjana Muda'",
      "Nyatakan Jurusan/Bidang",
      "Pembiayaan Pengajian: JPA/PTPTN/LZS/Tiada/Lain-lain Nyatakan",
    ],
    "maklumat-kesihatan-tanggungan": [
      "Tahap Kesihatan Sihat/Sakit Kronik/OKU/Uzur",
      "Sakit Kronik - Keadaan Kesihatan (Terlantar/Tidak Terlantar)",
      "Sakit Kronik - Kos Penjagaan (Berbayar/Tidak berbayar)",
      "Sakit Kronik - Jumlah Perbelanjaan Bulanan RM XXX.XX",
      "OKU - Kesempurnaan Fizikal (Sempurna/Cacat Mental/Cacat Fizikal)",
      "OKU - Sebab Kecacatan (Jika Cacat) (Sejak Lahir/Musibah)",
      "OKU - Tahap Kecacatan (Terlantar/Tidak Terlantar)",
      "OKU - Jumlah Perbelanjaan Bulanan RM XXX.XX",
      "Uzur - Keadaan Kesihatan (Terlantar/Tidak Terlantar)",
      "Uzur - Kos Penjagaan (Berbayar/Tidak berbayar)",
      "Uzur - Jumlah Perbelanjaan Bulanan RM XXX.XX",
      "Upload dokumen sokongan berkaitan kesihatan",
    ],
    "maklumat-kemahiran-tanggungan": [
      "Kemahiran ('Nelayan/Penternakan/Pertanian'/'Menjahit/Kraftangan/Memasak/Mengasuh'/Perkhidmatan/Pertukangan/Perniagaan/'Lain-lain Nyatakan') - benarkan pelbagai pilihan",
    ],
    "maklumat-pekerjaan-tanggungan": [
      "Pekerjaan : Bekerja/Tidak Bekerja",
      "Sumber Pendapatan: Pengajian/Sumbangan keluarga/Individu/Institusi/Sumbangan Agensi",
      "Lain-lain Sumber Pendapatan",
      "Jenis Pekerjaan",
      "Sektor Kerajaan/Swasta/Badan Berkanun/Kerja Sendiri Nyatakan",
      "Nama Majikan",
      "No Tel Majikan",
      "Alamat Majikan",
      "Alamat Majikan 1",
      "Alamat Majikan 2",
      "Alamat Majikan 3",
      "Bandar",
      "Poskod",
      "Daerah",
      "Negeri",
      "Jawatan",
      "Negara",
      "Status Jawatan (Tetap/Kontrak/Sementara)",
      "Pendapatan Kasar",
      "Jumlah diterima",
      "Upload slip gaji/pendapatan",
      "Gaji / Elaun / Pendapatan Diperoleh",
      "Sumbangan Anak-anak",
      "Pencen / Perkeso",
      "Bantuan Jabatan Kebajikan Masyarakat",
      "Takaful",
      "Sewa Rumah / Tanah / Kedai",
      "Pendapatan Lain-lain",
      "Perbelanjaan Makanan dan Minuman",
      "Sewa / Bayaran Pinjaman Perumahan",
      "Perbelanjaan Persekolahan Anak",
      "Pengangkutan / Tambang Bas Sekolah",
      "Bil Utiliti",
    ],
    // (Add other kategori field lists here later if needed)
  };
  
  /* ---------- Handlers ---------- */
  const handleKategoriChange = () => {
    const key = selectedKategori.value;
  
    if (key && kategoriToFields[key]) {
      // Seed deterministic rows in the same order as mapping with random kaedah kemaskini
      ruuFields.value = kategoriToFields[key].map((label, idx) => {
        const randomKaedah = kaedahKemaskiniOptions.value[Math.floor(Math.random() * kaedahKemaskiniOptions.value.length)];
        return {
          id: `RUU_${key}_${idx + 1}`,
          namaRuuField: label,
          kaedahKemaskini: randomKaedah.id,
          status: "Aktif",
          tindakan: idx + 1,        // show as running number
          isNew: false,             // Mark as existing row (readonly)
        };
      });
    } else {
      ruuFields.value = [];
    }
  
    refreshTable();
  };
  
  const tambahRuuField = () => {
    if (!selectedKategori.value) return;
  
    const nextIndex = ruuFields.value.length + 1;   // always append at the end
    ruuFields.value.push({
      id: `RUU_${selectedKategori.value}_${nextIndex}`,
      namaRuuField: "",
      kaedahKemaskini: "",
      status: "Aktif",  // Default to Aktif for new rows
      tindakan: nextIndex,
      isNew: true,  // Mark as new row for editing
    });
  
    refreshTable();
  };
  
  // Action button handlers
  
  /* ---------- Utils ---------- */
  const refreshTable = () => nextTick(() => { tableKey.value++; });
  
  // Helper function to get kaedah name by ID
  const getKaedahNameById = (id) => {
    if (!id) return "";
    const found = kaedahKemaskiniOptions.value.find(k => k.id === id);
    return found ? found.namaKaedah : id;
  };
  
  // Simpan data function with validation
  const simpanData = () => {
    // Validation: Check if all fields are filled
    const emptyFields = ruuFields.value.filter(field => 
      !field.namaRuuField.trim() || !field.kaedahKemaskini || !field.status
    );
    
    if (emptyFields.length > 0) {
      alert('Semua field wajib diisi. Sila lengkapkan maklumat yang diperlukan.');
      return;
    }
    
    // Check for duplicate field names in current selection
    const fieldNames = ruuFields.value.map(f => f.namaRuuField.trim().toLowerCase());
    const duplicateFields = fieldNames.filter((name, index) => fieldNames.indexOf(name) !== index);
    
    if (duplicateFields.length > 0) {
      alert('Terdapat nama field yang sama. Sila semak dan ubah nama field yang berulang.');
      return;
    }
    
    // Check existing configuration in localStorage (simulating DB check)
    const existingConfigs = JSON.parse(localStorage.getItem('konfigurasi_ruu_fields') || '[]');
    const currentKategori = selectedKategori.value;
    
    // Check for existing field combinations
    const duplicateConfigs = ruuFields.value.filter(field => {
      return existingConfigs.some(existing => 
        existing.kategori === currentKategori && 
        existing.namaRuuField.toLowerCase() === field.namaRuuField.trim().toLowerCase() &&
        existing.kaedahKemaskini === field.kaedahKemaskini
      );
    });
    
    if (duplicateConfigs.length > 0) {
      alert('Terdapat konfigurasi yang sama dalam sistem. Sila semak kombinasi field dan kaedah kemaskini.');
      return;
    }
    
    // Prepare data for saving
    const dataToSave = ruuFields.value.map(field => ({
      id: `RUU_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // Auto-generate ID
      kategori: currentKategori,
      namaRuuField: field.namaRuuField.trim(),
      kaedahKemaskini: field.kaedahKemaskini,
      status: field.status,
      isActive: field.status === 'Aktif',
      statusSemakan: 'Menunggu Semakan',
      createdDate: new Date().toISOString(),
      isNew: false
    }));
    
    // Save to localStorage (simulating DB save)
    const updatedConfigs = [...existingConfigs, ...dataToSave];
    localStorage.setItem('konfigurasi_ruu_fields', JSON.stringify(updatedConfigs));
    
    // Update local data
    ruuFields.value = dataToSave;
    
    alert(`Data berjaya disimpan! ${dataToSave.length} konfigurasi telah disimpan dengan status "Menunggu Semakan".`);
    
    console.log('Data saved:', dataToSave);
  };
  
  // Hantar data function - sends for review by EOAD
  const hantarData = () => {
    if (ruuFields.value.length === 0) {
      alert('Tiada data untuk dihantar. Sila tambah konfigurasi terlebih dahulu.');
      return;
    }
    
    // Check if data has been saved first
    const unsavedData = ruuFields.value.filter(field => field.isNew);
    if (unsavedData.length > 0) {
      alert('Sila simpan data terlebih dahulu sebelum menghantar untuk semakan EOAD.');
      return;
    }
    
    // Simulate sending data for EOAD review
    alert('Data telah dihantar untuk semakan oleh EOAD. Status akan dikemaskini selepas proses semakan.');
    
    // Update status to "Dalam Semakan EOAD"
    ruuFields.value.forEach(field => {
      field.statusSemakan = 'Dalam Semakan EOAD';
      field.reviewedBy = 'EOAD';
      field.submittedDate = new Date().toISOString();
    });
    
    // Update localStorage with new status
    const existingConfigs = JSON.parse(localStorage.getItem('konfigurasi_ruu_fields') || '[]');
    const updatedConfigs = existingConfigs.map(config => {
      const currentField = ruuFields.value.find(field => field.id === config.id);
      if (currentField) {
        return {
          ...config,
          statusSemakan: 'Dalam Semakan EOAD',
          reviewedBy: 'EOAD',
          submittedDate: new Date().toISOString()
        };
      }
      return config;
    });
    localStorage.setItem('konfigurasi_ruu_fields', JSON.stringify(updatedConfigs));
    
    console.log('Data sent for EOAD review:', ruuFields.value);
  };
  
  // Initialize with empty data
  onMounted(() => {
    ruuFields.value = [];
  });
  </script>
  