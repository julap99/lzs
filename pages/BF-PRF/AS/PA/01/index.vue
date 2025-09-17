<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Penilaian Awal</h2>
        </div>
      </template>

      <template #body>
        <FormKit type="form" :actions="false" @submit="handleNext">
          <h3 class="text-lg font-semibold mb-4">Penilaian Awal</h3>

          <div class="space-y-6">
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
              <FormKit
                type="checkbox"
                name="keperluan_mendesak"
                v-model="formData.keperluan_mendesak"
                :options="[
                  { label: 'Perubatan kritikal', value: 'perubatan_kritikal' },
                  { label: 'Bencana', value: 'bencana' },
                  { label: 'Kematian', value: 'kematian' },
                  {
                    label: 'Konflik keluarga (tiada tempat bergantung)',
                    value: 'konflik_keluarga',
                  },
                  {
                    label: 'Tiada tempat tinggal',
                    value: 'tiada_tempat_tinggal',
                  },
                  {
                    label: 'Terputus bekalan makanan',
                    value: 'terputus_bekalan_makanan',
                  },
                  {
                    label: 'Masih ada bekalan makanan',
                    value: 'masih_ada_bekalan_makanan',
                  },
                  {
                    label: 'Tiada sumber pendapatan',
                    value: 'tiada_sumber_pendapatan',
                  },
                  {
                    label: 'Mempunyai tempat tinggal',
                    value: 'mempunyai_tempat_tinggal',
                  },
                  {
                    label: 'Pendapatan berkurangan',
                    value: 'pendapatan_berkurangan',
                  },
                  { label: 'Keperluan Lain', value: 'keperluan_lain' },
                  {
                    label: 'Selain dari di atas',
                    value: 'selain_dari_di_atas',
                  },
                ]"
                validation="required|min:1"
                validation-label="Jawapan"
                validation-messages="{
                  required: 'Sila pilih sekurang-kurangnya satu jawapan',
                  min: 'Sila pilih sekurang-kurangnya satu jawapan'
                }"
              />

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
            
            <FormKit type="textarea" name="catatan" label="Catatan" />

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
    
    <!-- Confirmation Modal: Perubahan Maklumat -->
    <rs-modal
      v-model="showChangeConfirm"
      title="Pengesahan"
      position="center"
      size="md"
    >
      <template #body>
        <p class="p-4 text-center">
          Adakah ada perubahan maklumat permohonan asnaf?
        </p>
      </template>

      <template #footer>
        <div class=" p-4 flex justify-end gap-3">
          <rs-button variant="secondary" @click="onChangeNo">Tidak</rs-button>
          <rs-button variant="primary" @click="onChangeYes">Ya</rs-button>
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

const formData = ref({
  // Penilaian Awal
  komitmen_tinggi: "",
  keperluan_mendesak: [],
  lain_keperluan: "",
});

// Show extra input when "keperluan_lain" or "selain_dari_di_atas" is selected
const showLainInput = computed(() => {
  const list = formData.value.keperluan_mendesak;
  if (!Array.isArray(list)) return false;
  return (
    list.includes("keperluan_lain") || list.includes("selain_dari_di_atas")
  );
});

// Show doc info when certain keperluan are selected
const shouldShowDocInfo = computed(() => {
  const list = formData.value.keperluan_mendesak || [];
  const triggerValues = [
    "perubatan_kritikal",
    "bencana",
    "kematian",
    "konflik_keluarga",
    "tiada_tempat_tinggal",
    "terputus_bekalan_makanan",
    "tiada_sumber_pendapatan",
    "pendapatan_berkurangan",
  ];
  return Array.isArray(list) && list.some((v) => triggerValues.includes(v));
});

// Check if perubatan kritikal is selected
const isPerubatanKritikal = computed(() => {
  const list = formData.value.keperluan_mendesak || [];
  return Array.isArray(list) && list.includes("perubatan_kritikal");
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
  const answeredKeperluan = Array.isArray(formData.value.keperluan_mendesak)
    ? formData.value.keperluan_mendesak.length > 0
    : false;
  return answeredKomitmen && answeredKeperluan;
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
  showChangeConfirm.value = true;
}

// Confirmation modal state and actions
const showChangeConfirm = ref(false);

function onChangeYes() {
  showChangeConfirm.value = false;
  navigateTo("/BF-PRF/AS/UP/02");
}

function onChangeNo() {
  showChangeConfirm.value = false;
  navigateTo("/dashboard/dashboard-asnaf");
}
</script>
