<template>
  <FormKit
    type="form"
    @submit="$emit('next-step')"
    :actions="false"
    id="sectionA3"
  >
    <h3 class="text-lg font-semibold mb-4">3. Maklumat Pendidikan</h3>

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
            name="masih_bersekolah"
            :options="[
              { label: 'Ya', value: 'Y' },
              { label: 'Tidak', value: 'T' },
            ]"
            validation="required"
          :disabled="readOnly"
            v-model="formData.masih_bersekolah"
          />
        </div>

        <!-- Pendidikan Tertinggi -->
        <FormKit
          type="select"
          name="pendidikan_tertinggi"
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
          :disabled="readOnly"
          v-model="formData.pendidikan_tertinggi"
        />
      </div>

      <!-- Lain-lain Pendidikan Tertinggi -->
      <div
        v-if="formData.pendidikan_tertinggi === 'Lain-lain'"
        class="mt-4"
      >
        <FormKit
          type="text"
          name="lain_pendidikan_tertinggi"
          label="Lain-lain Pendidikan Tertinggi"
          validation="required"
          :disabled="readOnly"
          v-model="formData.lain_pendidikan_tertinggi"
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
          name="tahap_pendidikan"
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
          :disabled="readOnly"
          v-model="formData.tahap_pendidikan"
          :validation-messages="{
            required:
              'Sila pilih sekurang-kurangnya satu tahap pendidikan',
            min: 'Sila pilih sekurang-kurangnya satu tahap pendidikan',
          }"
        />
      </div>
    </div>

    <!-- Lain-lain Tahap Pendidikan yang Dicapai -->
    <div
      v-if="
        formData.tahap_pendidikan &&
        formData.tahap_pendidikan.includes('Lain-lain')
      "
      class="mt-4"
    >
      <FormKit
        type="text"
        name="lain_tahap_pendidikan"
        label="Lain-lain Tahap Pendidikan yang Dicapai"
        validation="required"
        :disabled="readOnly"
        v-model="formData.lain_tahap_pendidikan"
      />
    </div>

    <!-- Upload Sijil Pendidikan -->
    <div class="mt-6">
      <FormKit
        type="file"
        name="sijil_pendidikan"
        label="Upload Sijil Pendidikan yang Diperolehi"
        multiple="true"
        accept=".pdf,.jpg,.jpeg,.png"
        help="Format yang diterima: PDF, JPG, JPEG, PNG"
        :disabled="readOnly"
        v-model="formData.sijil_pendidikan"
      />
    </div>

    <div v-if="formData.masih_bersekolah === 'Y'" class="mb-8">
      <h4 class="text-lg font-semibold mb-4">
        Maklumat Sekolah / Institusi
      </h4>

      <div
        v-if="
          formData.education_entries &&
          formData.education_entries.length > 0
        "
      >
        <div
          v-for="(edu, index) in formData.education_entries"
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
              :name="`edu${index}JenisSekolah`"
              label="Jenis Sekolah / Institusi"
              placeholder="Pilih Peringkat"
              :options="[
                { label: 'Peringkat Rendah', value: 'rendah' },
                { label: 'Peringkat Tinggi', value: 'tinggi' },
              ]"
              :disabled="readOnly"
              v-model="edu.jenis_sekolah"
            />

            <!-- Kategori select is always shown -->
            <FormKit
              type="select"
              :name="`edu${index}KategoriSekolah`"
              label="Kategori Sekolah / Institusi"
              placeholder="Pilih Kategori Sekolah / Institusi"
              :options="['SEK.MEN', 'SRK', 'IPT', 'SRA', 'KAFA']"
              :disabled="readOnly"
              v-model="edu.kategori_sekolah"
            />
          </div>

          <div
            v-if="edu.kategori_sekolah === 'IPT'"
            class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4"
          >
            <FormKit
              type="date"
              :name="`edu${index}TarikhMulaPengajian`"
              label="Tarikh Mula Pengajian"
              :disabled="readOnly"
              v-model="edu.tarikh_mula_pengajian"
            />
            <FormKit
              type="date"
              :name="`edu${index}TarikhTamatPengajian`"
              label="Tarikh Tamat Pengajian"
              :disabled="readOnly"
              v-model="edu.tarikh_tamat_pengajian"
            />
          </div>

          <div v-if="edu.kategori_sekolah" class="mt-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit
                type="text"
                :name="`edu${index}TahunBersekolah`"
                label="Tahun Bersekolah (YYYY)"
                validation="required"
                placeholder="Contoh: 2024"
                :disabled="readOnly"
                v-model="edu.tahun_bersekolah"
              />

              <FormKit
                type="text"
                :name="`edu${index}Tingkatan`"
                label="Tahun / Tingkatan / Tahun Pengajian / Semester"
                validation="required"
                placeholder="Contoh: Tingkatan 3, Tahun 2, Semester 1"
                :disabled="readOnly"
                v-model="edu.tahun_tingkatan"
              />
            </div>

            <div class="mt-4">
              <FormKit
                type="select"
                :name="`edu${index}NamaSekolah`"
                label="Nama Sekolah / Institusi"
                placeholder="Pilih sekolah / institusi"
                :options="getFilteredSchoolOptions(edu.kategori_sekolah)"
                validation="required"
                :disabled="readOnly"
                v-model="edu.nama_sekolah"
                @input="onSelectSchool(index, $event)"
              />
            </div>

            <!-- Kategori Sekolah Rendah - shown when kategori sekolah is SRA or SRK -->
            <div
              v-if="
                edu.kategori_sekolah === 'SRA' ||
                edu.kategori_sekolah === 'SRK'
              "
              class="mt-4"
            >
              <label class="block text-sm font-medium text-black-700 mb-4"
                >Kategori Sekolah Rendah</label
              >
              <FormKit
                type="checkbox"
                :name="`edu${index}KategoriRendah`"
                :options="[
                  { label: 'Sekolah Agama', value: 'agama' },
                  { label: 'Sekolah Kebangsaan', value: 'kebangsaan' },
                ]"
                :disabled="readOnly"
                v-model="edu.sekolah_rendah_kategori"
              />
            </div>

            <div class="mt-4">
              <FormKit
                type="text"
                :name="`edu${index}Alamat1`"
                label="Alamat 1"
                validation="required"
                :disabled="readOnly"
                v-model="edu.alamat_sekolah_1"
              />

              <FormKit
                type="text"
                :name="`edu${index}Alamat2`"
                label="Alamat 2"
                :disabled="readOnly"
                v-model="edu.alamat_sekolah_2"
                v-if="edu.alamat_sekolah_1"
              />

              <div class="mt-4">
                <FormKit
                  type="text"
                  :name="`edu${index}Alamat3`"
                  label="Alamat 3"
                  :disabled="readOnly"
                  v-model="edu.alamat_sekolah_3"
                  v-if="edu.alamat_sekolah_1"
                />
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <FormKit
                  type="text"
                  :name="`edu${index}Daerah`"
                  label="Daerah"
                  validation="required"
                  :disabled="readOnly"
                  v-model="edu.daerah_sekolah"
                />

                <FormKit
                  type="text"
                  :name="`edu${index}Bandar`"
                  label="Bandar"
                  validation="required"
                  :disabled="readOnly"
                  v-model="edu.bandar_sekolah"
                />

                <FormKit
                  type="text"
                  :name="`edu${index}Poskod`"
                  label="Poskod"
                  validation="required"
                  :disabled="readOnly"
                  v-model="edu.poskod_sekolah"
                />
              </div>
            </div>

            <div class="mt-6">
              <FormKit
                type="select"
                :name="`edu${index}BidangKursus`"
                label="Bidang / Kursus Pengajian"
                :options="[
                  'Sijil',
                  'SKM',
                  'Diploma',
                  'Ijazah Sarjana Muda',
                ]"
                :disabled="readOnly"
                v-model="edu.bidang_kursus"
              />
            </div>

            <div v-if="edu.bidang_kursus" class="mt-4">
              <FormKit
                type="text"
                :name="`edu${index}JurusanBidang`"
                label="Jurusan / Bidang"
                validation="required"
                :disabled="readOnly"
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
                  :name="`edu${index}PembiayaanPengajian`"
                  :options="['JPA', 'PTPTN', 'LZS', 'Tiada', 'Lain-lain']"
                  validation="required|min:1"
                  :disabled="readOnly"
                  v-model="edu.pembiayaan_pengajian"
                  :validation-messages="{
                    required:
                      'Sila pilih sekurang-kurangnya satu pembiayaan',
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
                :name="`edu${index}LainPembiayaan`"
                label="Lain-lain Pembiayaan Pengajian"
                validation="required"
                :disabled="readOnly"
                v-model="edu.lain_pembiayaan"
              />
            </div>

            <!-- Catatan -->
            <div class="mt-6">
              <FormKit
                type="textarea"
                :name="`edu${index}Catatan`"
                label="Catatan"
                :disabled="readOnly"
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
            :disabled="readOnly"
          >
            <Icon name="mdi:plus" class="mr-1" size="1rem" />
            Tambah Sekolah / Institusi
          </rs-button>
        </div>
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
              name="tinggal_bersama_keluarga"
              :options="[
                { label: 'Ya', value: 'Y' },
                { label: 'Tidak', value: 'T' },
              ]"
              validation="required"
              :disabled="readOnly"
              v-model="formData.tinggal_bersama_keluarga"
            />
          </div>

          <!-- Asrama/Rumah Sewa -->
          <div v-if="formData.tinggal_bersama_keluarga === 'T'">
            <FormKit
              type="text"
              name="asrama_rumah_sewa"
              label="Asrama/Rumah Sewa"
              validation="required"
              :disabled="readOnly"
              v-model="formData.asrama_rumah_sewa"
            />
            <FormKit
              class="mt-4"
              type="text"
              name="nama_baitul"
              label="Nama Baitul"
              :disabled="readOnly"
              v-model="formData.nama_baitul"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-between gap-3 mt-6" v-if="showFooterButtons">
      <rs-button
        type="button"
        variant="primary-outline"
        @click="$emit('prev-step')"
        :disabled="readOnly"
        >Kembali</rs-button
      >
      <div class="flex gap-3">
        <rs-button
          type="button"
          variant="secondary"
          @click="$emit('save-step')"
          :disabled="readOnly"
          >Simpan</rs-button
        >
        <rs-button type="button" variant="primary" @click="$emit('next-step')" :disabled="readOnly"
          >Maklumat Pengislaman</rs-button
        >
      </div>
    </div>
  </FormKit>
</template>

<script setup>
// Props
const props = defineProps({
  formData: {
    type: Object,
    required: true
  },
  showFooterButtons: {
    type: Boolean,
    default: true
  },
  readOnly: {
    type: Boolean,
    default: false
  }
})

// Education-related functions - moved from parent component
const getFilteredSchoolOptions = (kategori) => {
  if (kategori === "IPT") {
    return ["UM", "UiTM", "UKM"];
  }
  if (kategori === "SRK") {
    return ["SK Seksyen 7", "SK Seksyen 13"];
  }
  if (kategori === "SRA") {
    return ["SRA Seksyen 7", "SRA Seksyen 13"];
  }
  return [];
};

const addEducationEntry = () => {
  if (!props.formData.education_entries) props.formData.education_entries = [];
  props.formData.education_entries.push({
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
  if (props.formData.education_entries) {
    props.formData.education_entries.splice(index, 1);
  }
};

const onSelectSchool = (index, value) => {
  if (
    props.formData.education_entries &&
    props.formData.education_entries[index]
  ) {
    props.formData.education_entries[index].nama_sekolah = value;
  }
};

// Emits
const emit = defineEmits([
  'next-step', 
  'prev-step', 
  'save-step'
])
</script>
