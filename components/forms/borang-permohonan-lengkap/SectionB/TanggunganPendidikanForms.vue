<template>
  <FormKit
    type="form"
    @submit="$emit('next-step')"
    :actions="false"
    id="sectionB4"
  >
    <h3 class="text-lg font-semibold mb-4">
      4. Maklumat Pendidikan Tanggungan
    </h3>

    <!-- A. Maklumat Pendidikan Asas -->
    <div class="mb-8">
      <h4 class="text-lg font-semibold mb-4">Maklumat Pendidikan Asas</h4>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- Masih Bersekolah -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-black-700"
            >Masih Belajar</label
          >
          <FormKit
            type="radio"
            name="masih_bersekolah_tanggungan"
            :options="[
              { label: 'Ya', value: 'Y' },
              { label: 'Tidak', value: 'T' },
            ]"
            validation="required"
            v-model="getCurrentTanggungan().masih_bersekolah"
          />
        </div>

        <!-- Pendidikan Tertinggi -->
        <FormKit
          type="select"
          name="pendidikan_tertinggi_tanggungan"
          label="Pendidikan Tertinggi"
          placeholder="Pilih Pendidikan Tertinggi"
          :options="[
            'Peringkat Rendah',
            'SRP/PMR',
            'SPM',
            'Sijil',
            'Diploma',
            'STPM',
            'Ijazah',
            'Lain-lain',
          ]"
          validation="required"
          v-model="getCurrentTanggungan().pendidikan_tertinggi"
        />

        <!-- Lain-lain Pendidikan Tertinggi -->
        <FormKit
          v-if="
            getCurrentTanggungan().pendidikan_tertinggi_tanggungan ===
            'Lain-lain'
          "
          type="text"
          name="lain_pendidikan_tertinggi_tanggungan"
          label="Lain-lain Pendidikan Tertinggi"
          validation="required"
          v-model="getCurrentTanggungan().lain_pendidikan_tertinggi_tanggungan"
        />
      </div>
    </div>

    <!-- Tahap Pendidikan yang Dicapai -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      <div class="space-y-2">
        <label class="block text-sm font-medium text-black-700"
          >Tahap Pendidikan yang Dicapai</label
        >
        <FormKit
          type="checkbox"
          name="tahap_pendidikan_tanggungan"
          placeholder="Pilih Tahap Pendidikan yang Dicapai"
          :options="[
            'Peringkat Rendah',
            'SRP/PMR',
            'SPM',
            'Sijil',
            'Diploma',
            'STPM',
            'Ijazah',
            'Lain-lain',
          ]"
          validation="required|min:1"
          v-model="getCurrentTanggungan().tahap_pendidikan_dicapai"
          :validation-messages="{
            required: 'Sila pilih sekurang-kurangnya satu tahap pendidikan',
            min: 'Sila pilih sekurang-kurangnya satu tahap pendidikan',
          }"
        />
      </div>
    </div>

    <!-- Lain-lain Tahap Pendidikan yang Dicapai -->
    <div
      v-if="
        getCurrentTanggungan().tahap_pendidikan_dicapai &&
        getCurrentTanggungan().tahap_pendidikan_dicapai.includes('Lain-lain')
      "
      class="mt-4"
    >
      <FormKit
        type="text"
        name="lain_tahap_pendidikan_tanggungan"
        label="Lain-lain Tahap Pendidikan yang Dicapai"
        validation="required"
        v-model="getCurrentTanggungan().lain_tahap_pendidikan_dicapai"
      />
    </div>

    <!-- Upload Sijil Pendidikan -->
    <div class="mt-6">
      <FormKit
        type="file"
        name="sijil_pendidikan_tanggungan"
        label="Upload Sijil Pendidikan yang Diperolehi"
        multiple="true"
        accept=".pdf,.jpg,.jpeg,.png"
        help="Format yang diterima: PDF, JPG, JPEG, PNG"
        v-model="getCurrentTanggungan().sijil_pendidikan_tanggungan"
      />
    </div>

    <!-- Maklumat Sekolah / Institusi (if masih bersekolah) -->
    <div v-if="getCurrentTanggungan().masih_bersekolah === 'Y'" class="mb-8">
      <h4 class="text-lg font-semibold mb-4">Maklumat Sekolah / Institusi</h4>

      <div
        v-if="
          getCurrentTanggungan().education_entries &&
          getCurrentTanggungan().education_entries.length > 0
        "
      >
        <div
          v-for="(edu, index) in getCurrentTanggungan().education_entries"
          :key="index"
          class="mb-8 p-4 border border-gray-200 rounded-lg"
        >
          <div class="flex justify-between items-center mb-4">
            <h5 class="text-md font-medium">
              Sekolah / Institusi #{{ index + 1 }}
            </h5>
            <button
              type="button"
              @click="removeEducationEntry(index)"
              class="text-red-500 hover:text-red-700"
            >
              <Icon name="mdi:delete" size="1.1rem" />
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormKit
              type="select"
              :name="`eduTanggungan${index}JenisSekolah`"
              label="Jenis Sekolah / Institusi"
              placeholder="Pilih Peringkat"
              :options="[
                { label: 'Peringkat Rendah', value: 'rendah' },
                { label: 'Peringkat Tinggi', value: 'tinggi' },
              ]"
              v-model="edu.jenis_sekolah"
            />

            <!-- Kategori select is always shown -->
            <FormKit
              type="select"
              :name="`eduTanggungan${index}KategoriSekolah`"
              label="Kategori Sekolah / Institusi"
              placeholder="Pilih Kategori Sekolah / Institusi"
              :options="['SEK.MEN', 'SRK', 'IPT', 'SRA', 'KAFA']"
              v-model="edu.kategori_sekolah"
            />
          </div>

          <div
            v-if="edu.kategori_sekolah === 'IPT'"
            class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4"
          >
            <FormKit
              type="date"
              :name="`eduTanggungan${index}TarikhMulaPengajian`"
              label="Tarikh Mula Pengajian"
              v-model="edu.tarikh_mula_pengajian"
            />
            <FormKit
              type="date"
              :name="`eduTanggungan${index}TarikhTamatPengajian`"
              label="Tarikh Tamat Pengajian"
              v-model="edu.tarikh_tamat_pengajian"
            />
          </div>

          <div v-if="edu.kategori_sekolah" class="mt-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit
                type="text"
                :name="`eduTanggungan${index}TahunBersekolah`"
                label="Tahun Bersekolah (YYYY)"
                validation="required"
                placeholder="Contoh: 2024"
                v-model="edu.tahun_bersekolah"
              />

              <FormKit
                type="text"
                :name="`eduTanggungan${index}Tingkatan`"
                label="Tahun / Tingkatan / Tahun Pengajian / Semester"
                validation="required"
                placeholder="Contoh: Tingkatan 3, Tahun 2, Semester 1"
                v-model="edu.tahun_tingkatan"
              />
            </div>

            <div class="mt-4">
              <FormKit
                type="select"
                :name="`eduTanggungan${index}NamaSekolah`"
                label="Nama Sekolah / Institusi"
                placeholder="Pilih sekolah / institusi"
                :options="getFilteredSchoolOptions(edu.kategori_sekolah)"
                validation="required"
                v-model="edu.nama_sekolah"
                @input="onSelectSchool(index, $event)"
              />
            </div>

            <!-- Kategori Sekolah Rendah - shown when kategori sekolah is SRA or SRK -->
            <div
              v-if="
                edu.kategori_sekolah === 'SRA' || edu.kategori_sekolah === 'SRK'
              "
              class="mt-4"
            >
              <label class="block text-sm font-medium text-black-700 mb-4"
                >Kategori Sekolah Rendah</label
              >
              <FormKit
                type="checkbox"
                :name="`eduTanggungan${index}KategoriRendah`"
                :options="[
                  { label: 'Sekolah Agama', value: 'agama' },
                  { label: 'Sekolah Kebangsaan', value: 'kebangsaan' },
                ]"
                v-model="edu.sekolah_rendah_kategori"
              />
            </div>

            <div class="mt-4">
              <FormKit
                type="text"
                :name="`eduTanggungan${index}Alamat1`"
                label="Alamat 1"
                validation="required"
                v-model="edu.alamat_sekolah_1"
              />

              <FormKit
                type="text"
                :name="`eduTanggungan${index}Alamat2`"
                label="Alamat 2"
                v-model="edu.alamat_sekolah_2"
                v-if="edu.alamat_sekolah_1"
              />

              <div class="mt-4">
                <FormKit
                  type="text"
                  :name="`eduTanggungan${index}Alamat3`"
                  label="Alamat 3"
                  v-model="edu.alamat_sekolah_3"
                  v-if="edu.alamat_sekolah_1"
                />
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <FormKit
                  type="text"
                  :name="`eduTanggungan${index}Daerah`"
                  label="Daerah"
                  validation="required"
                  v-model="edu.daerah_sekolah"
                />

                <FormKit
                  type="text"
                  :name="`eduTanggungan${index}Bandar`"
                  label="Bandar"
                  validation="required"
                  v-model="edu.bandar_sekolah"
                />

                <FormKit
                  type="text"
                  :name="`eduTanggungan${index}Poskod`"
                  label="Poskod"
                  validation="required"
                  v-model="edu.poskod_sekolah"
                />
              </div>
            </div>

            <div class="mt-6">
              <FormKit
                type="select"
                :name="`eduTanggungan${index}BidangKursus`"
                label="Bidang / Kursus Pengajian"
                :options="['Sijil', 'SKM', 'Diploma', 'Ijazah Sarjana Muda']"
                v-model="edu.bidang_kursus"
              />
            </div>

            <div v-if="edu.bidang_kursus" class="mt-4">
              <FormKit
                type="text"
                :name="`eduTanggungan${index}JurusanBidang`"
                label="Jurusan / Bidang"
                validation="required"
                v-model="edu.jurusan_bidang"
              />
            </div>

            <!-- Pembiayaan Pengajian -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div class="space-y-2">
                <label class="block text-sm font-medium text-black-700"
                  >Pembiayaan Pengajian</label
                >
                <FormKit
                  type="checkbox"
                  :name="`eduTanggungan${index}PembiayaanPengajian`"
                  :options="['JPA', 'PTPTN', 'LZS', 'Tiada', 'Lain-lain']"
                  validation="required|min:1"
                  v-model="edu.pembiayaan_pengajian"
                  :validation-messages="{
                    required: 'Sila pilih sekurang-kurangnya satu pembiayaan',
                    min: 'Sila pilih sekurang-kurangnya satu pembiayaan',
                  }"
                />
              </div>
            </div>

            <!-- Lain-lain Pembiayaan Pengajian -->
            <div
              v-if="
                edu.pembiayaan_pengajian &&
                edu.pembiayaan_pengajian.includes('Lain-lain')
              "
              class="mt-4"
            >
              <FormKit
                type="text"
                :name="`eduTanggungan${index}LainPembiayaan`"
                label="Lain-lain Pembiayaan Pengajian"
                validation="required"
                v-model="edu.lain_pembiayaan"
              />
            </div>

            <!-- Catatan -->
            <div class="mt-6">
              <FormKit
                type="textarea"
                :name="`eduTanggungan${index}Catatan`"
                label="Catatan"
                v-model="edu.catatan"
                rows="3"
              />
            </div>
          </div>
        </div>

        <div class="flex justify-center mt-4">
          <rs-button
            variant="secondary"
            @click="addEducationEntry"
            type="button"
          >
            <Icon name="mdi:plus" class="mr-1" size="1rem" />
            Tambah Sekolah / Institusi
          </rs-button>
        </div>
      </div>

      <!-- Show button to add first education entry if none exists -->
      <div
        v-if="
          !getCurrentTanggungan().education_entries ||
          getCurrentTanggungan().education_entries.length === 0
        "
        class="flex justify-center mt-4"
      >
        <rs-button variant="secondary" @click="addEducationEntry" type="button">
          <Icon name="mdi:plus" class="mr-1" size="1rem" />
          Tambah Sekolah / Institusi Pertama
        </rs-button>
      </div>

      <!-- Lain-lain Maklumat -->
      <div class="mb-8 mt-8">
        <h4 class="text-lg font-semibold mb-4">Lain-lain Maklumat</h4>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Tinggal Bersama Keluarga -->
          <div class="space-y-2">
            <label class="block text-sm font-medium text-black-700"
              >Tinggal Bersama Keluarga</label
            >
            <FormKit
              type="radio"
              name="tinggal_bersama_keluarga_tanggungan"
              :options="[
                { label: 'Ya', value: 'Y' },
                { label: 'Tidak', value: 'T' },
              ]"
              validation="required"
              v-model="getCurrentTanggungan().tinggal_bersama_keluarga"
            />
          </div>

          <!-- Asrama/Rumah Sewa -->
          <div v-if="getCurrentTanggungan().tinggal_bersama_keluarga === 'T'">
            <FormKit
              type="text"
              name="asrama_rumah_sewa_tanggungan"
              label="Asrama/Rumah Sewa"
              validation="required"
              v-model="getCurrentTanggungan().asrama_rumah_sewa"
            />
            <FormKit
              class="mt-4"
              type="text"
              name="nama_baitul_tanggungan"
              label="Nama Baitul"
              v-model="getCurrentTanggungan().nama_baitul"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-between gap-3 mt-6">
      <rs-button
        type="button"
        variant="primary-outline"
        @click="$emit('prev-step')"
        >Kembali</rs-button
      >
      <div class="flex gap-3">
        <rs-button type="button" variant="secondary" @click="$emit('save-step')"
          >Simpan</rs-button
        >
        <rs-button type="button" variant="primary" @click="$emit('next-step')"
          >Maklumat Kesihatan</rs-button
        >
      </div>
    </div>
  </FormKit>
</template>

<script setup>
import { computed } from "vue";
// Props
const props = defineProps({
  getCurrentTanggungan: {
    type: Function,
    required: true,
  },
});

// Emits (navigation + save only)
const emit = defineEmits(["next-step", "prev-step", "save-step"]);

// Local handlers moved from page
const addEducationEntry = () => {
  const current = props.getCurrentTanggungan?.();
  if (!current) return;
  if (!Array.isArray(current.education_entries)) current.education_entries = [];
  current.education_entries.push({
    jenis_sekolah: "",
    kategori_sekolah: "",
    tarikh_mula_pengajian: "",
    tarikh_tamat_pengajian: "",
    tahun_bersekolah: "",
    tahun_tingkatan: "",
    nama_sekolah: "",
    sekolah_rendah_kategori: [],
    alamat_sekolah_1: "",
    alamat_sekolah_2: "",
    alamat_sekolah_3: "",
    daerah_sekolah: "",
    bandar_sekolah: "",
    poskod_sekolah: "",
    bidang_kursus: "",
    jurusan_bidang: "",
    pembiayaan_pengajian: [],
    lain_pembiayaan: "",
    catatan: "",
  });
};

const removeEducationEntry = (index) => {
  const current = props.getCurrentTanggungan?.();
  if (!current || !Array.isArray(current.education_entries)) return;
  current.education_entries.splice(index, 1);
};

const onSelectSchool = (index, value) => {
  const current = props.getCurrentTanggungan?.();
  if (!current || !Array.isArray(current.education_entries)) return;
  const edu = current.education_entries[index];
  if (!edu) return;

  // Set selected school
  edu.nama_sekolah = value;

  const selected = schoolOptions.find((s) => s.value === value);
  if (!selected) return;

  // Auto-set kategori
  edu.kategori_sekolah = selected.kategori;

  // Auto-check sekolah rendah kategori
  if (selected.kategori === 'SRA' || selected.kategori === 'KAFA') {
    edu.sekolah_rendah_kategori = ['agama'];
  } else if (selected.kategori === 'SRK' || selected.kategori === 'SEK.MEN') {
    edu.sekolah_rendah_kategori = ['kebangsaan'];
  } else if (selected.kategori === 'IPT') {
    edu.sekolah_rendah_kategori = [];
  }

  // Populate address fields
  edu.alamat_sekolah_1 = selected.alamat1 || '';
  edu.alamat_sekolah_2 = selected.alamat2 || '';
  edu.alamat_sekolah_3 = selected.alamat3 || '';
  edu.daerah_sekolah = selected.daerah || '';
  edu.bandar_sekolah = selected.bandar || '';
  edu.poskod_sekolah = selected.poskod || '';
};

// Local school options (subset can be expanded or replaced with API)
const sekolahAgamaOptions = [
  {
    label: "SRA Al-Amin Kuala Lumpur",
    value: "sra-al-amin-kl",
    kategori: "SRA",
    alamat1: "Jalan Ampang, Kuala Lumpur",
    alamat2: "Wilayah Persekutuan",
    alamat3: "50450 Kuala Lumpur",
    daerah: "Kuala Lumpur",
    bandar: "Kuala Lumpur",
    poskod: "50450",
  },
  {
    label: "SRA Seksyen 7",
    value: "sra-seksyen-7",
    kategori: "SRA",
    alamat1: "Jalan Seksyen 7",
    alamat2: "Shah Alam",
    alamat3: "40000 Shah Alam",
    daerah: "Petaling",
    bandar: "Shah Alam",
    poskod: "40000",
  },
  {
    label: "SRA Seksyen 13",
    value: "sra-seksyen-13",
    kategori: "SRA",
    alamat1: "Jalan Seksyen 13",
    alamat2: "Shah Alam",
    alamat3: "40000 Shah Alam",
    daerah: "Petaling",
    bandar: "Shah Alam",
    poskod: "40000",
  },
  {
    label: "KAFA Masjid Al-Amin",
    value: "kafa-masjid-al-amin",
    kategori: "KAFA",
    alamat1: "Masjid Al-Amin, Jalan Ampang",
    alamat2: "Kuala Lumpur",
    alamat3: "50450 Kuala Lumpur",
    daerah: "Kuala Lumpur",
    bandar: "Kuala Lumpur",
    poskod: "50450",
  },
  {
    label: "KAFA Seksyen 7",
    value: "kafa-seksyen-7",
    kategori: "KAFA",
    alamat1: "Masjid Seksyen 7",
    alamat2: "Shah Alam",
    alamat3: "40000 Shah Alam",
    daerah: "Petaling",
    bandar: "Shah Alam",
    poskod: "40000",
  },
  {
    label: "SMK Seksyen 7",
    value: "smk-seksyen-7",
    kategori: "SEK.MEN",
    alamat1: "Jalan Seksyen 7",
    alamat2: "Shah Alam",
    alamat3: "40000 Shah Alam",
    daerah: "Petaling",
    bandar: "Shah Alam",
    poskod: "40000",
  },
  {
    label: "SMK Seksyen 13",
    value: "smk-seksyen-13",
    kategori: "SEK.MEN",
    alamat1: "Jalan Seksyen 13",
    alamat2: "Shah Alam",
    alamat3: "40000 Shah Alam",
    daerah: "Petaling",
    bandar: "Shah Alam",
    poskod: "40000",
  },
  {
    label: "Universiti Malaya (UM)",
    value: "um",
    kategori: "IPT",
    alamat1: "Jalan Universiti",
    alamat2: "Kuala Lumpur",
    alamat3: "50603 Kuala Lumpur",
    daerah: "Kuala Lumpur",
    bandar: "Kuala Lumpur",
    poskod: "50603",
  },
  {
    label: "Universiti Teknologi MARA (UiTM)",
    value: "uitm",
    kategori: "IPT",
    alamat1: "Jalan Ilmu",
    alamat2: "Shah Alam",
    alamat3: "40450 Shah Alam",
    daerah: "Petaling",
    bandar: "Shah Alam",
    poskod: "40450",
  },
  {
    label: "Universiti Kebangsaan Malaysia (UKM)",
    value: "ukm",
    kategori: "IPT",
    alamat1: "Jalan Bangi",
    alamat2: "Bangi",
    alamat3: "43600 Bangi",
    daerah: "Hulu Langat",
    bandar: "Bangi",
    poskod: "43600",
  },
];

const sekolahKebangsaanOptions = [
  {
    label: "SK Taman Tun Dr Ismail",
    value: "sk-ttdi",
    kategori: "SRK",
    alamat1: "Jalan TTD1, Taman Tun Dr Ismail",
    alamat2: "Kuala Lumpur",
    alamat3: "60000 Kuala Lumpur",
    daerah: "Kuala Lumpur",
    bandar: "Kuala Lumpur",
    poskod: "60000",
  },
  {
    label: "SK Seksyen 7",
    value: "sk-seksyen-7",
    kategori: "SRK",
    alamat1: "Jalan Seksyen 7",
    alamat2: "Shah Alam",
    alamat3: "40000 Shah Alam",
    daerah: "Petaling",
    bandar: "Shah Alam",
    poskod: "40000",
  },
  {
    label: "SK Seksyen 13",
    value: "sk-seksyen-13",
    kategori: "SRK",
    alamat1: "Jalan Seksyen 13",
    alamat2: "Shah Alam",
    alamat3: "40000 Shah Alam",
    daerah: "Petaling",
    bandar: "Shah Alam",
    poskod: "40000",
  },
];

const schoolOptions = [...sekolahAgamaOptions, ...sekolahKebangsaanOptions];

const getFilteredSchoolOptions = (kategoriSekolah) => {
  if (!kategoriSekolah) return schoolOptions;
  return schoolOptions.filter((school) => school.kategori === kategoriSekolah);
};
</script>
