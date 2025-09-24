<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

     <!-- Page-specific Role Switcher -->
     <div class="px-4 py-2 mt-0">
      <div class="flex items-center space-x-3">
        <div class="flex items-center space-x-2">
          <Icon name="ic:baseline-account-circle" class="text-gray-600" size="20" />
          <span class="text-sm font-medium text-gray-700">Simulasi Peranan:</span>
        </div>
        <select
          v-model="currentRole"
          @change="handleRoleChange"
          class="py-1.5 px-3 text-sm rounded-md border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option 
            v-for="option in roleOptions" 
            :key="option.value" 
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
      </div>
    </div>

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Penilaian Awal</h2>
        </div>
      </template>

      <template #body>
        <FormKit type="form" :actions="false" @submit="handleNext">
          <!-- <h3 class="text-lg font-semibold mb-4">Penilaian Awal</h3> -->
          <div class="space-y-6">
            <!-- Maklumat Individu Section -->
            <div v-if="currentRole !== 'existing_user'" 
              class="space-y-4">
              <h4 class="text-lg font-semibold mb-4">Maklumat Peribadi</h4>
              
              <!-- Nama Penuh -->
              <FormKit
                type="text"
                name="nama_penuh"
                label="Nama Penuh"
                v-model="formData.nama_penuh"
                readonly
              />

              <!-- Jenis Pengenalan & No Pengenalan Row -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Jenis Pengenalan -->
                <FormKit
                  type="select"
                  name="jenis_pengenalan"
                  label="Jenis Pengenalan"
                  v-model="formData.jenis_pengenalan"
                  :options="[
                    { label: 'Mykad/MyKid', value: 'mykad' },
                    { label: 'NRIC (lama)/Tentera/Polis', value: 'nric_lama' },
                    { label: 'ID Luar Negara', value: 'id_luar_negara' },
                    { label: 'No. Sijil Beranak', value: 'sijil_beranak' }
                  ]"
                  readonly
                />

                <!-- No Pengenalan -->
                <FormKit
                  type="text"
                  name="no_pengenalan"
                  label="No Pengenalan"
                  v-model="formData.no_pengenalan"
                  readonly
                />
              </div>

              <!-- Emel & No Telefon Row -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Emel -->
                <FormKit
                  type="email"
                  name="emel"
                  label="Emel"
                  v-model="formData.emel"
                  placeholder="email@example.com"
                  readonly
                />

                <!-- No Telefon -->
                <FormKit
                  type="text"
                  name="no_telefon"
                  label="No Telefon"
                  v-model="formData.no_telefon"
                  readonly
                />
              </div>
            </div>

            <!-- Question 1 -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">
                Adakah tuan/puan mempunyai komitmen dan pembiayaan melibatkan
                kos yang tinggi?
              </label>
              <FormKit
                type="radio"
                name="komitmen_tinggi"
                v-model="formData.komitmen_tinggi"
                :options="[
                  { label: 'Ya', value: 'Y' },
                  { label: 'Tidak', value: 'T' },
                ]"
                validation="required"
                validation-label="Jawapan"
              />
            </div>

            <!-- Question 2 -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">
                Apakah keperluan tuan/puan mendesak sekarang ini?
              </label>
              
              <!-- Level 1: Main Categories -->
              <div class="space-y-3">
                <!-- Merah Option -->
                <div>
                  <label class="flex items-center space-x-2">
                    <input
                      type="radio"
                      v-model="formData.keperluan_kategori"
                      value="merah"
                      class="text-primary focus:ring-primary"
                    />
                    <span class="text-sm font-medium text-gray-700">
                      Terputus bekalan makanan / Tiada tempat tinggal
                    </span>
                  </label>
                  
                  <!-- Sub Options for Merah -->
                  <div v-if="formData.keperluan_kategori === 'merah'" class="mt-2 ml-6 space-y-2">
                    <FormKit
                      type="radio"
                      name="keperluan_mendesak"
                      v-model="formData.keperluan_mendesak"
                      :options="getSubOptions('merah')"
                      validation="required"
                      validation-label="Jawapan"
                      validation-messages="{
                        required: 'Sila pilih satu jawapan'
                      }"
                    />
                  </div>
                </div>

                <!-- Kuning Option -->
                <div>
                  <label class="flex items-center space-x-2">
                    <input
                      type="radio"
                      v-model="formData.keperluan_kategori"
                      value="kuning"
                      class="text-primary focus:ring-primary"
                    />
                    <span class="text-sm font-medium text-gray-700">
                      Masih ada bekalan makanan / Mempunyai tempat tinggal / Tiada sumber pendapatan
                    </span>
                  </label>
                  
                  <!-- Sub Options for Kuning -->
                  <div v-if="formData.keperluan_kategori === 'kuning'" class="mt-2 ml-6 space-y-2">
                    <FormKit
                      type="radio"
                      name="keperluan_mendesak"
                      v-model="formData.keperluan_mendesak"
                      :options="getSubOptions('kuning')"
                      validation="required"
                      validation-label="Jawapan"
                      validation-messages="{
                        required: 'Sila pilih satu jawapan'
                      }"
                    />
                  </div>
                </div>

                <!-- Hijau Option -->
                <div>
                  <label class="flex items-center space-x-2">
                    <input
                      type="radio"
                      v-model="formData.keperluan_kategori"
                      value="hijau"
                      class="text-primary focus:ring-primary"
                    />
                    <span class="text-sm font-medium text-gray-700">
                      Pendapatan berkurangan / Keperluan lain
                    </span>
                  </label>
                  
                  <!-- Sub Options for Hijau -->
                  <div v-if="formData.keperluan_kategori === 'hijau'" class="mt-2 ml-6 space-y-2">
                    <FormKit
                      type="radio"
                      name="keperluan_mendesak"
                      v-model="formData.keperluan_mendesak"
                      :options="getSubOptions('hijau')"
                      validation="required"
                      validation-label="Jawapan"
                      validation-messages="{
                        required: 'Sila pilih satu jawapan'
                      }"
                    />
                  </div>
                </div>
              </div>

              <!-- Additional input for "Keperluan Lain / Selain dari di atas" -->
              <div v-if="showLainInput" class="mt-4">
                <FormKit
                  type="text"
                  name="lain_keperluan"
                  label="Sila nyatakan keperluan:"
                  validation="required"
                  validation-label="Keperluan lain"
                  validation-messages="{
                    required: 'Sila nyatakan keperluan lain'
                  }"
                />
              </div>
            </div>
            
            <FormKit type="textarea" name="penyataan_masalah" label="Penyataan Masalah" />

            <!-- Conditional Documents Info + Dokumen Sokongan Table -->
            <div v-if="shouldShowDocInfo" class="mt-6 space-y-4">
              <!-- Perubatan Kritikal Documents -->
              <div
                v-if="isPerubatanKritikal"
                class="rounded border border-gray-300 p-4 bg-gray-50"
              >
                <h4 class="font-semibold mb-2">Wajib</h4>
                <ol class="list-decimal ml-6 space-y-1 text-sm">
                  <li>
                    Borang Pengesahan Kesihatan (sah dalam tempoh 6 bulan)
                    (diisi oleh Pihak Hospital/Klinik)
                  </li>
                  <li>Pengesahan Pendapatan / Slip Gaji Terkini</li>
                </ol>
                <h4 class="font-semibold mt-4 mb-2">Dokumen Tambahan</h4>
                <ol class="list-decimal ml-6 space-y-1 text-sm">
                  <li>
                    Pengesahan Pegawai Dietetik/Rehab (Wajib bagi permohonan
                    Susu Khas/Peralatan)
                  </li>
                  <li>Penyata KWSP (Wajib bagi yang ada/pernah mencarum)</li>
                  <li>
                    GL/Surat Kelulusan sebelum ini untuk bantuan penyambungan
                    (jika berkaitan)
                  </li>
                  <li>Sebut Harga (jika ada)</li>
                </ol>
              </div>

              <!-- Other Cases Documents -->
              <div v-else class="rounded border border-gray-300 p-4 bg-gray-50">
                <h4 class="font-semibold mb-2">Wajib</h4>
                <ol class="list-decimal ml-6 space-y-1 text-sm">
                  <li>Pengesahan Pendapatan / Slip Gaji Terkini</li>
                </ol>
                <h4 class="font-semibold mt-4 mb-2">Dokumen Tambahan</h4>
                <ol class="list-decimal ml-6 space-y-1 text-sm">
                  <li>
                    Dokumen/surat temujanji perubatan berkaitan yang membuktikan
                    tujuan perjalanan pemohon dan anggaran tambang yang
                    diperlukan (jika berkenaan).
                  </li>
                  <li>
                    Bil utiliti (TNB/Syabas/Penyelenggaraan/Cukai Pintu/Cukai
                    Tanah) yang tidak melebihi satu tahun dari tarikh
                    permohonan.
                  </li>
                  <li>
                    Bil-bil/resit terkini berkaitan permohonan (jika berkenaan).
                  </li>
                  <li>
                    Surat tuntutan hutang dari pihak yang berkenaan (jika
                    berkenaan).
                  </li>
                  <li>Penyata KWSP (Wajib bagi yang ada/pernah mencarum).</li>
                  <li>
                    Salinan laporan pihak polis/bomba/pihak berkuasa (Wajib jika
                    berkaitan bencana).
                  </li>
                  <li>
                    1 Gambar semasa kejadian / bukti kejadian (Wajib jika
                    berkaitan bencana).
                  </li>
                </ol>
              </div>

              <div>
                <h4 class="font-semibold mb-2">Dokumen</h4>
                <div class="overflow-x-auto">
                  <table class="min-w-full border border-gray-400 text-sm">
                    <thead>
                      <tr class="bg-gray-100">
                        <th
                          class="border border-gray-400 px-2 py-1 w-16 text-center"
                        >
                          No
                        </th>
                        <th class="border border-gray-400 px-2 py-1">
                          Jenis Dokumen
                        </th>
                        <th class="border border-gray-400 px-2 py-1">
                          Keterangan
                        </th>
                        <th class="border border-gray-400 px-2 py-1">
                          Muat Naik Fail
                        </th>
                        <th
                          class="border border-gray-400 px-2 py-1 text-center"
                        >
                          Muat Turun Borang
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(row, i) in dokumenSokonganRows" :key="row.id">
                        <td
                          class="border border-gray-400 px-2 py-1 text-center"
                        >
                          {{ i + 1 }}
                        </td>
                        <td class="border border-gray-400 px-2 py-1">
                          <select
                            v-model="row.jenis"
                            class="w-full border-gray-300 rounded px-2 py-1"
                          >
                            <option value="" disabled>Pilih jenis</option>
                            <option
                              v-for="opt in jenisDokumenOptions"
                              :key="opt.value"
                              :value="opt.value"
                            >
                              {{ opt.label }}
                            </option>
                          </select>
                        </td>
                        <td class="border border-gray-400 px-2 py-1">
                          <input
                            v-model="row.keterangan"
                            type="text"
                            class="w-full border-gray-300 rounded px-2 py-1"
                            placeholder="Keterangan ringkas"
                          />
                        </td>
                        <td class="border border-gray-400 px-2 py-1">
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            @change="onFileChange(i, $event)"
                            class="block w-full text-sm"
                          />
                        </td>
                        <td
                          class="border border-gray-400 px-2 py-1 text-center"
                        >
                          <button
                            class="text-primary underline disabled:text-gray-400"
                            :disabled="!getTemplateUrl(row.jenis)"
                            type="button"
                            @click="downloadTemplate(row.jenis)"
                          >
                            Muat Turun
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="flex gap-3 mt-3 justify-end">
                  <rs-button
                    type="button"
                    variant="primary"
                    @click="addDokumenRow"
                    >Tambah</rs-button
                  >
                  <rs-button
                    type="button"
                    variant="danger"
                    @click="removeDokumenRow"
                    :disabled="dokumenSokonganRows.length <= 1"
                    >Buang</rs-button
                  >
                </div>
              </div>
            </div>
            
            

            <div class="flex justify-between gap-3 mt-6">
              <rs-button type="button" variant="secondary" @click="handleSave"
                >Simpan</rs-button
              >
              <rs-button 
                type="button"
                variant="primary"
                :disabled="!isPenilaianAwalComplete"
                @click="handleNext"
                >Seterusnya</rs-button
              >
            </div>
          </div>
        </FormKit>
      </template>
    </rs-card>

    <!-- Confirmation Modal for New User -->
    <rs-modal
      v-model="showNewUserModal"
      title="Penilaian Awal Berjaya"
      position="center"
      size="md"
    >
      <template #body>
        <div class="p-4">
          <p class="text-gray-700 mb-4">
            Maklumat penilaian awal anda telah berjaya dihantar. Untuk memudahkan urusan bantuan, 
            anda boleh melengkapkan borang pendaftaran secara lengkap.
          </p>
          <p class="text-gray-700">
            Adakah anda ingin meneruskan proses melengkapkan borang pendaftaran tersebut?
          </p>
        </div>
      </template>

      <template #footer>
        <div class="p-4 flex justify-end gap-3">
          <rs-button variant="secondary" @click="onNewUserCancel">Tidak</rs-button>
          <rs-button variant="primary" @click="onNewUserContinue">Ya, Teruskan</rs-button>
        </div>
      </template>
    </rs-modal>

    <!-- Confirmation Modal for Existing User -->
    <rs-modal
      v-model="showExistingUserModal"
      title="Penilaian Awal Berjaya"
      position="center"
      size="md"
    >
      <template #body>
        <div class="p-4">
          <p class="text-gray-700">
            Penilaian awal anda telah berjaya dihantar. Sila kemaskini maklumat anda untuk 
            memastikan rekod yang terkini dan tepat.
          </p>
        </div>
      </template>

      <template #footer>
        <div class="p-4 flex justify-end gap-3">
          <rs-button variant="primary" @click="onExistingUserContinue">Kemaskini Maklumat</rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useToast } from "vue-toastification";

definePageMeta({
  title: "Penilaian Awal",
});

const toast = useToast();

const breadcrumb = ref([
  { name: "Profiling", type: "link", path: "/BF-PRF/AS/PA/01" },
  { name: "Asnaf", type: "link", path: "/BF-PRF/AS/PA/01" },
  { name: "Penilaian Awal", type: "current", path: "/BF-PRF/AS/PA/01" },
]);

const currentRole = ref("new_user");

// Modal states
const showNewUserModal = ref(false);
const showExistingUserModal = ref(false);

const formData = ref({
  // Maklumat Individu
  nama_penuh: "Ahmad Bin Abdullah",
  jenis_pengenalan: "mykad",
  no_pengenalan: "901234567890",
  emel: "ahmad.abdullah@email.com",
  no_telefon: "0123456789",
  // Penilaian Awal
  komitmen_tinggi: "",
  keperluan_kategori: "",
  keperluan_mendesak: "",
  lain_keperluan: "",
});

// Page-specific role options for Pra Daftar
const roleOptions = [
  { label: "Pengguna Baru", value: "new_user" },
  { label: "Pengguna Sedia Ada", value: "existing_user" },
];

const handleRoleChange = () => {
  // Role change logic can be added here if needed
  console.log("Role changed to:", currentRole.value);
  
  // Reset to first available tab for the new role
  /* const validTabs = getValidTabsForRole(currentRole.value);
  if (validTabs.length > 0) {
    activeTab.value = validTabs[0];
  }
  
  // Refresh table
  refreshTable(); */
};

// Get sub-options based on selected category
function getSubOptions(category) {
  const options = {
    merah: [
      { label: 'Terputus bekalan makanan', value: 'terputus_bekalan_makanan' },
      { label: 'Tiada tempat tinggal', value: 'tiada_tempat_tinggal' }
    ],
    kuning: [
      { label: 'Masih ada bekalan makanan', value: 'masih_ada_bekalan_makanan' },
      { label: 'Mempunyai tempat tinggal', value: 'mempunyai_tempat_tinggal' },
      { label: 'Tiada sumber pendapatan', value: 'tiada_sumber_pendapatan' }
    ],
    hijau: [
      { label: 'Pendapatan berkurangan', value: 'pendapatan_berkurangan' },
      { label: 'Perubatan Kritikal', value: 'perubatan_kritikal' },
      { label: 'Bencana', value: 'bencana' }
    ]
  };
  return options[category] || [];
}

// Show extra input when "keperluan_lain" is selected (no longer applicable)
const showLainInput = computed(() => {
  return false; // No longer using keperluan_lain option
});

// Show doc info when certain keperluan are selected
const shouldShowDocInfo = computed(() => {
  const value = formData.value.keperluan_mendesak;
  const triggerValues = [
    "terputus_bekalan_makanan",
    "tiada_tempat_tinggal", 
    "masih_ada_bekalan_makanan",
    "mempunyai_tempat_tinggal",
    "tiada_sumber_pendapatan",
    "pendapatan_berkurangan",
    "perubatan_kritikal",
    "bencana"
  ];
  return triggerValues.includes(value);
});

// Check if perubatan kritikal is selected
const isPerubatanKritikal = computed(() => {
  const value = formData.value.keperluan_mendesak;
  return value === "perubatan_kritikal";
});

// Dokumen Sokongan table state
const dokumenSokonganRows = ref([
  { id: 1, jenis: "", keterangan: "", file: null },
]);

const jenisDokumenOptions = computed(() => {
  const baseOptions = [
    {
      label: "Pengesahan Pendapatan / Slip Gaji",
      value: "pengesahan_pendapatan",
    },
  ];
  if (isPerubatanKritikal.value) {
    return [
      {
        label: "Borang Pengesahan Kesihatan",
        value: "borang_pengesahan_kesihatan",
      },
      {
        label: "Pengesahan Pendapatan / Slip Gaji",
        value: "pengesahan_pendapatan",
      },
      {
        label: "GL/Surat Kelulusan (jika berkaitan)",
        value: "gl_surat_kelulusan",
      },
      { label: "Sebut Harga (jika ada)", value: "sebut_harga" },
    ];
  }
  return [
    ...baseOptions,
    {
      label: "Dokumen/Surat Temujanji Perubatan",
      value: "temujanji_perubatan",
    },
    { label: "Bil Utiliti", value: "bil_utiliti" },
    { label: "Bil/Resit Terkini", value: "bil_resit_terkini" },
    { label: "Surat Tuntutan Hutang", value: "surat_tuntutan_hutang" },
    { label: "Penyata KWSP", value: "penyata_kwsp" },
    { label: "Laporan Polis/Bomba/Pihak Berkuasa", value: "laporan_berkuasa" },
    { label: "Gambar Bukti Kejadian", value: "gambar_bukti" },
  ];
});

function addDokumenRow() {
  const nextId = dokumenSokonganRows.value.length
    ? Math.max(...dokumenSokonganRows.value.map((r) => r.id)) + 1
    : 1;
  dokumenSokonganRows.value.push({
    id: nextId,
    jenis: "",
    keterangan: "",
    file: null,
  });
}

function removeDokumenRow() {
  if (dokumenSokonganRows.value.length > 1) {
    dokumenSokonganRows.value.pop();
  }
}

function onFileChange(index, event) {
  const files = event?.target?.files;
  dokumenSokonganRows.value[index].file = files && files[0] ? files[0] : null;
}

function getTemplateUrl(jenis) {
  const map = {
    borang_pengesahan_kesihatan: "",
    pengesahan_pendapatan: "",
  };
  return map[jenis] || "";
}

function downloadTemplate(jenis) {
  const url = getTemplateUrl(jenis);
  if (!url) return;
  window.open(url, "_blank");
}

// Determine if both Penilaian Awal questions are completed
const isPenilaianAwalComplete = computed(() => {
  const answeredKomitmen = !!formData.value.komitmen_tinggi;
  const answeredKategori = !!formData.value.keperluan_kategori;
  const answeredKeperluan = !!formData.value.keperluan_mendesak;
  return answeredKomitmen && answeredKategori && answeredKeperluan;
});

function handleSave() {
  try {
    toast.success("Penilaian Awal berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
    console.error("Save Penilaian Awal error:", error);
  }
}

function handleNext() {
  if (!isPenilaianAwalComplete.value) {
    toast.error("Sila lengkapkan Penilaian Awal terlebih dahulu");
    return;
  }
  
  // Show appropriate modal based on role
  if (currentRole.value === "existing_user") {
    showExistingUserModal.value = true;
  } else if (currentRole.value === "new_user") {
    showNewUserModal.value = true;
  } else {
    // Default fallback
    showExistingUserModal.value = true;
  }
}

// Modal handler functions
function onNewUserContinue() {
  showNewUserModal.value = false;
  
  // Redirect based on urgency level
  if (formData.value.keperluan_kategori === "merah") {
    navigateTo("/BF-PRF/AS/QS/02");
  } else if (formData.value.keperluan_kategori === "kuning" || formData.value.keperluan_kategori === "hijau") {
    navigateTo("/BF-PRF/AS/FR/02");
  } else {
    // Fallback
    navigateTo("/BF-PRF/AS/PA-1/UP");
  }
}

function onNewUserCancel() {
  showNewUserModal.value = false;
  // Could redirect to dashboard or stay on current page
  navigateTo("/dashboard/dashboard-asnaf");
}

function onExistingUserContinue() {
  showExistingUserModal.value = false;
  navigateTo("/BF-PRF/AS/UP/02");
}

</script>
