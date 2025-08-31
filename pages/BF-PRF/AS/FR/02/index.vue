<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card v-if="currentSection == 1" class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Borang Permohonan Lengkap Online
          </h2>
          <div class="text-sm text-gray-600">
            Langkah {{ currentStepA }} dari {{ totalStepsA }}
          </div>
        </div>
      </template>

      <template #body>
        <!-- Progress indicator -->
        <div class="mb-6">
          <div class="flex justify-between mb-2">
            <div
              v-for="step in stepsA"
              :key="step.id"
              class="text-center flex-1"
              :class="{ 'font-semibold': currentStepA >= step.id }"
              @click="goToStepA(step.id)"
            >
              {{ step.label }}
            </div>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2.5">
            <div
              class="bg-primary h-2.5 rounded-full transition-all duration-300"
              :style="`width: ${
                currentStepA >= totalStepsA
                  ? 100
                  : (currentStepA / totalStepsA) * 100
              }%`"
            ></div>
          </div>
        </div>

        <!-- Section A Form - Step 1: Maklumat Peribadi -->
        <FormKit
          v-if="currentStepA == 1"
          type="form"
          :actions="false"
          @submit="nextStepA"
        >
          <h3 class="text-lg font-semibold mb-4">A. Maklumat Peribadi Asnaf</h3>

          <h3 class="text-lg font-semibold mb-4">1. Maklumat Peribadi</h3>

          <!-- Personal Information Section -->
          <div class="mb-6">
            <h4 class="text-md font-medium mb-3">Maklumat Peribadi</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit
                type="select"
                name="jenis_id"
                label="Jenis ID"
                placeholder="Pilih jenis ID"
                :options="[
                  { label: 'MyKad', value: 'mykad' },
                  { label: 'Foreign ID', value: 'foreign_id' },
                ]"
                validation="required"
                v-model="formData.jenis_id"
              />

              <FormKit
                v-if="formData.jenis_id"
                type="file"
                name="dokumen_id"
                :label="`Upload ${formData.jenis_id}`"
                accept=".pdf,.jpg,.jpeg,.png"
                help="Format yang dibenarkan: PDF, JPG, PNG. Saiz maksimum: 5MB"
                validation="required|max:5|mime:application/pdf,image/jpeg,image/png"
                v-model="formData.dokumen_id"
              />

              <FormKit
                type="text"
                name="id_pengenalan"
                label="ID Pengenalan"
                help="Mengikut Dokumen Pengenalan"
                validation="required"
                v-model="formData.no_pengenalan"
              />

              <FormKit
                type="text"
                name="nama"
                label="Nama"
                help="Mengikut Dokumen Pengenalan"
                validation="required"
                v-model="formData.nama"
              />

              <FormKit
                type="select"
                name="warganegara"
                label="Warganegara"
                placeholder="Pilih Warganegara"
                :options="['Malaysia', 'Lain-lain']"
                validation="required"
                v-model="formData.warganegara"
              />

              <FormKit
                v-if="formData.warganegara === 'Lain-lain'"
                type="file"
                name="lain_warganegara"
                label="Lain-lain Warganegara"
                help="Format yang dibenarkan: PDF, JPG, PNG. Saiz maksimum: 5MB"
                accept=".pdf,.jpg,.jpeg,.png"
                validation="required|max:5|mime:application/pdf,image/jpeg,image/png"
                v-model="formData.lain_warganegara"
              />

              <div
                class="grid grid-cols-1 md:grid-cols-2 gap-4"
                v-if="formData.warganegara === 'Lain-lain'"
              >
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-black-700"
                    >Taraf Penduduk Tetap</label
                  >
                  <FormKit
                    type="radio"
                    name="taraf_penduduk"
                    :options="[
                      { label: 'Ya', value: 'ya' },
                      { label: 'Tidak', value: 'tidak' },
                    ]"
                    validation="required"
                    v-model="formData.taraf_penduduk"
                  />
                </div>
              </div>
              <FormKit
                v-if="formData.warganegara === 'Lain-lain'"
                type="text"
                name="nopassportlama"
                label="No Passport Lama"
                v-model="formData.nopassportlama"
              />

              <FormKit
                v-if="
                  formData.warganegara === 'Lain-lain' &&
                  formData.jenis_id === 'foreign_id'
                "
                type="date"
                name="passportStartDate"
                label="Tarikh mula passport"
                v-model="formData.passportStartDate"
              />
              <FormKit
                v-if="
                  formData.warganegara === 'Lain-lain' &&
                  formData.jenis_id === 'foreign_id'
                "
                type="date"
                name="passportEndDate"
                label="Tarikh tamat passport"
                v-model="formData.passportEndDate"
              />
            </div>
          </div>

          <!-- Personal Details Section -->
          <div class="mb-6">
            <h4 class="text-md font-medium mb-3">Butiran Peribadi</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit
                type="date"
                name="tarikh_lahir"
                label="Tarikh Lahir"
                help="Format: dd-mm-yyyy"
                validation="required"
                v-model="formData.tarikh_lahir"
              />

              <FormKit
                type="text"
                name="umur"
                label="Umur"
                validation="required"
                v-model="formData.umur"
                readonly
                help="Auto dikira daripada Tarikh Lahir"
              />

              <FormKit
                type="text"
                name="tempat_lahir"
                label="Tempat Lahir"
                validation="required"
                v-model="formData.tempat_lahir"
              />

              <FormKit
                type="select"
                name="jantina"
                label="Jantina"
                :options="['Lelaki', 'Perempuan']"
                placeholder="Pilih Jantina"
                validation="required"
                v-model="formData.jantina"
              />

              <FormKit
                type="select"
                name="agama"
                label="Agama"
                :options="['Islam', 'Kristian', 'Buddha', 'Hindu', 'Lain-lain']"
                placeholder="Pilih Agama"
                validation="required"
                v-model="formData.agama"
              />

              <FormKit
                v-if="formData.agama === 'Lain-lain'"
                type="text"
                name="agama_lain"
                label="Agama Lain"
                validation="required"
                v-model="formData.agama_lain"
              />

              <FormKit
                type="select"
                name="bangsa"
                label="Bangsa"
                :options="['Melayu', 'Cina', 'India', 'Lain-lain']"
                validation="required"
                placeholder="Pilih Bangsa"
                v-model="formData.bangsa"
              />

              <FormKit
                v-if="formData.bangsa === 'Lain-lain'"
                type="text"
                name="bangsa_lain"
                label="Bangsa Lain"
                validation="required"
                v-model="formData.bangsa_lain"
              />

              <FormKit
                type="text"
                name="no_telefon_bimbit"
                label="No Telefon Bimbit"
                v-model="formData.no_telefon_bimbit"
              />

              <FormKit
                type="text"
                name="no_telefon_rumah"
                label="No Telefon Rumah"
                v-model="formData.no_telefon_rumah"
              />

              <FormKit
                type="email"
                name="emel"
                label="Emel"
                validation="required|email"
                v-model="formData.emel"
              />
            </div>
          </div>

          <!-- Marital Status Section -->
          <div class="mb-6">
            <h4 class="text-md font-medium mb-3">Status Perkahwinan</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit
                type="select"
                name="status_perkahwinan"
                placeholder="Pilih Status Perkahwinan"
                label="Status Perkahwinan"
                :options="[
                  'Berkahwin',
                  'Bujang',
                  'Janda',
                  'Ibu Tinggal',
                  'Bapa Tinggal',
                  'Duda',
                  'Balu',
                ]"
                validation="required"
                v-model="formData.status_perkahwinan"
              />

              <FormKit
                type="select"
                name="status_poligami"
                placeholder="Pilih Status Poligami"
                label="Status Poligami"
                :options="[
                  { label: 'Tidak', value: 'tidak' },
                  { label: 'Ya', value: 'ya' },
                ]"
                validation="required"
                v-model="formData.status_poligami"
              />

              <!-- Polygamy Information (Conditional) -->
              <div
                v-if="formData.status_poligami === 'ya'"
                class="md:col-span-2"
              >
                <FormKit
                  type="select"
                  name="bilangan_isteri"
                  label="Bilangan Isteri"
                  placeholder="Pilih bilangan isteri"
                  validation="required"
                  :options="[
                    { label: '2', value: 2 },
                    { label: '3', value: 3 },
                    { label: '4', value: 4 },
                  ]"
                  v-model="formData.bilangan_isteri"
                />
                <div
                  v-for="(isteri, idx) in isteriList"
                  :key="idx"
                  class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4"
                >
                  <FormKit
                    type="text"
                    :name="`no_kp_isteri_${idx}`"
                    :label="`No Kp Pasangan #${idx + 1}`"
                    validation="required"
                    v-model="formData.isteri_list[idx].no_kp"
                  />
                  <FormKit
                    type="text"
                    :name="`nama_isteri_${idx}`"
                    :label="`Nama Pasangan #${idx + 1}`"
                    validation="required"
                    v-model="formData.isteri_list[idx].nama"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-between gap-3 mt-6">
            <rs-button
              type="button"
              variant="secondary"
              @click="handleSaveStepA2"
              >Simpan</rs-button
            >
            <rs-button type="submit" variant="primary" @click="nextStepA"
              >Seterusnya ke Maklumat Pendidikan</rs-button
            >
          </div>
        </FormKit>

        <!-- Section A Form - Step 2: Maklumat Pendidikan -->
        <FormKit
          v-if="currentStepA === 2"
          type="form"
          @submit="nextStepA"
          :actions="false"
          id="sectionA3"
        >
          <h3 class="text-lg font-semibold mb-4">2. Maklumat Pendidikan</h3>

          <!-- A. Maklumat Pendidikan Asas -->
          <div class="mb-8">
            <h4 class="text-lg font-semibold mb-4">Maklumat Pendidikan Asas</h4>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Masih Bersekolah -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-black-700"
                  >Masih Bersekolah</label
                >
                <FormKit
                  type="radio"
                  name="masih_bersekolah"
                  :options="[
                    { label: 'Ya', value: 'Y' },
                    { label: 'Tidak', value: 'T' },
                  ]"
                  validation="required"
                  v-model="formData.masih_bersekolah"
                />
              </div>

              <!-- Pendidikan Tertinggi -->
              <FormKit
                type="select"
                name="pendidikan_tertinggi"
                label="Pendidikan Tertinggi *"
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
                label="Lain-lain Pendidikan Tertinggi *"
                validation="required"
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
                    placeholder="Pilih Jenis Sekolah / Institusi"
                    :options="[
                      'Pra Sekolah',
                      'SRK',
                      'SMK',
                      'SMA',
                      'SRK+Agama',
                      'IPTA',
                      'IPTS',
                      'Maahad Tahfiz',
                    ]"
                    v-model="edu.jenis_sekolah"
                  />

                  <FormKit
                    type="select"
                    :name="`edu${index}KategoriSekolah`"
                    label="Kategori Sekolah / Institusi"
                    placeholder="Pilih Kategori Sekolah / Institusi"
                    :options="['SEK.MEN', 'SRK', 'IPTA', 'IPTS', 'SRA', 'KAFA']"
                    v-model="edu.kategori_sekolah"
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
                      v-model="edu.tahun_bersekolah"
                    />

                    <FormKit
                      type="text"
                      :name="`edu${index}Tingkatan`"
                      label="Tahun / Tingkatan / Tahun Pengajian / Semester"
                      validation="required"
                      placeholder="Contoh: Tingkatan 3, Tahun 2, Semester 1"
                      v-model="edu.tahun_tingkatan"
                    />
                  </div>

                  <div class="mt-4">
                    <FormKit
                      type="text"
                      :name="`edu${index}NamaSekolah`"
                      label="Nama Sekolah / Institusi"
                      validation="required"
                      v-model="edu.nama_sekolah"
                    />
                  </div>

                  <div class="mt-4">
                      <FormKit
                        type="text"
                        :name="`edu${index}Alamat1`"
                        label="Alamat 1"
                        validation="required"
                        v-model="edu.alamat_sekolah_1"
                      />

                      <FormKit
                        type="text"
                        :name="`edu${index}Alamat2`"
                        label="Alamat 2"
                        v-model="edu.alamat_sekolah_2"
                        v-if="edu.alamat_sekolah_1"
                      />
                

                    <div class="mt-4">
                      <FormKit
                        type="text"
                        :name="`edu${index}Alamat3`"
                        label="Alamat 3"
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
                        v-model="edu.daerah_sekolah"
                      />

                      <FormKit
                        type="text"
                        :name="`edu${index}Bandar`"
                        label="Bandar"
                        validation="required"
                        v-model="edu.bandar_sekolah"
                      />

                      <FormKit
                        type="text"
                        :name="`edu${index}Poskod`"
                        label="Poskod"
                        validation="required"
                        v-model="edu.poskod_sekolah"
                      />
                    </div>
                  </div>

                  <!-- <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div class="space-y-2">
                      <label class="block text-sm font-medium text-black-700"
                        >Tinggal Bersama Keluarga?</label
                      >
                      <FormKit
                        type="radio"
                        :name="`edu${index}TinggalBersamaKeluarga`"
                        :options="[
                          { label: 'Ya', value: 'Y' },
                          { label: 'Tidak', value: 'T' },
                        ]"
                        validation="required"
                        v-model="edu.tinggal_bersama_keluarga"
                      />
                    </div>
                  </div>

                  <div v-if="edu.tinggal_bersama_keluarga === 'T'" class="mt-4">
                    <FormKit
                      type="text"
                      :name="`edu${index}AsramaRumahSewa`"
                      label="Asrama / Rumah Sewa"
                      validation="required"
                      v-model="edu.asrama_rumah_sewa"
                    />
                  </div> -->

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
                      v-model="edu.bidang_kursus"
                    />
                  </div>

                  <div v-if="edu.bidang_kursus" class="mt-4">
                    <FormKit
                      type="text"
                      :name="`edu${index}JurusanBidang`"
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
                        :name="`edu${index}PembiayaanPengajian`"
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
                      :name="`edu${index}LainPembiayaan`"
                      label="Lain-lain Pembiayaan Pengajian"
                      validation="required"
                      v-model="edu.lain_pembiayaan"
                    />
                  </div>

                  <!-- Catatan -->
                  <div class="mt-6">
                    <FormKit
                      type="textarea"
                      :name="`edu${index}Catatan`"
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
                    v-model="formData.asrama_rumah_sewa"
                  />
                </div>

              </div>
            </div>


          </div>

          <div class="flex justify-between gap-3 mt-6">
            <rs-button
              type="button"
              variant="primary-outline"
              @click="prevStepA"
              >Kembali</rs-button
            >
            <div class="flex gap-3">
              <rs-button
                type="button"
                variant="secondary"
                @click="handleSaveStepA3"
                >Simpan</rs-button
              >
              <rs-button type="submit" variant="primary" @click="nextStepA"
                >Seterusnya ke Maklumat Islam</rs-button
              >
            </div>
          </div>
        </FormKit>

        <!-- Section A Form - Step 3: Maklumat Islam -->
        <FormKit
          v-if="currentStepA === 3"
          type="form"
          @submit="nextStepA"
          :actions="false"
          id="sectionA4"
        >
          <h3 class="text-lg font-semibold mb-4">3. Maklumat Pengislaman</h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Adakah anda seorang Muallaf? -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="block text-sm font-medium text-black-700"
                  >Adakah anda seorang Muallaf?</label
                >
                <FormKit
                  type="radio"
                  name="adakah_muallaf"
                  :options="[
                    { label: 'Ya', value: 'Y' },
                    { label: 'Tidak', value: 'T' },
                  ]"
                  validation="required"
                  validation-label="Status Muallaf"
                  :validation-messages="{
                    required:
                      'Sila pilih sama ada anda seorang muallaf atau tidak',
                  }"
                  v-model="formData.adakah_muallaf"
                />
              </div>
            </div>

            <!-- Tarikh Masuk Islam -->
            <div v-if="formData.adakah_muallaf === 'Y'">
              <FormKit
                type="date"
                name="tarikh_masuk_islam"
                label="Tarikh Masuk Islam"
                placeholder="DD/MM/YYYY"
                validation-label="Tarikh Masuk Islam"
                :validation-messages="{
                  required: 'Sila masukkan tarikh masuk Islam',
                  matches:
                    'Format tarikh tidak sah. Sila gunakan format DD/MM/YYYY',
                }"
                v-model="formData.tarikh_masuk_islam"
              />
            </div>

            <!-- Tarikh Masuk Kelas Fardu Ain Muallaf (KFAM) -->
            <div v-if="formData.adakah_muallaf === 'Y'">
              <FormKit
                type="date"
                name="tarikh_masuk_kfam"
                label="Tarikh Masuk Kelas Fardu Ain Muallaf (KFAM)"
                placeholder="DD/MM/YYYY"
                validation-label="Tarikh Masuk KFAM"
                :validation-messages="{
                  required:
                    'Sila masukkan tarikh masuk Kelas Fardu Ain Muallaf (KFAM)',
                  matches:
                    'Format tarikh tidak sah. Sila gunakan format DD/MM/YYYY',
                }"
                v-model="formData.tarikh_masuk_kfam"
              />
            </div>

            <!-- Validation error message for Islamic dates -->
            <div
              v-if="
                formData.adakah_muallaf === 'Y' &&
                !islamicDatesValidation.isValid
              "
              class="md:col-span-2 p-3 bg-red-50 border border-red-200 rounded"
            >
              <div class="text-red-600 text-sm">
                <strong>Ralat:</strong> {{ islamicDatesValidation.message }}
              </div>
            </div>

            <!-- Nama Lain -->
            <div v-if="formData.adakah_muallaf === 'Y'">
              <FormKit
                type="text"
                name="nama_lain"
                label="Nama Lain"
                validation="required"
                validation-label="Nama Lain"
                :validation-messages="{
                  required: 'Sila masukkan nama lain',
                }"
                v-model="formData.nama_lain"
              />
            </div>

            <!-- Nama Sebelum Islam -->
            <!-- <div v-if="formData.adakah_muallaf === 'Y'">
              <FormKit
                type="text"
                name="nama_sebelum_islam"
                label="Nama Sebelum Islam"
                validation="required"
                validation-label="Nama Sebelum Islam"
                :validation-messages="{
                  required: 'Sila masukkan nama sebelum Islam',
                }"
                v-model="formData.nama_sebelum_islam"
              />
            </div> -->

            <!-- Tarikh Keluar Muallaf -->
            <!-- <div v-if="formData.adakah_muallaf === 'Y'">
              <FormKit
                type="text"
                name="tarikh_keluar_muallaf"
                label="Tarikh Keluar Muallaf"
                placeholder="DD/MM/YYYY"
                :validation-messages="{
                  required: 'Tarikh Keluar Muallaf diperlukan',
                  matches: 'Format tarikh tidak sah',
                }"
                :model-value="tarikhKeluarMuallaf"
                readonly
              />
            </div> -->

            <!-- Tarikh Keluar KFAM -->
            <!-- <div v-if="formData.adakah_muallaf === 'Y'">
              <FormKit
                type="date"
                name="tarikh_had_taklif_muallaf"
                label="Tarikh Had Taklif"
                :validation-messages="{
                  required: 'Tarikh Had Taklif diperlukan',
                  matches: 'Format tarikh tidak sah',
                }"
                :model-value="tarikhHadTaklifMuallaf"
                readonly
              />
            </div> -->

            <!-- Dokumen Pengislaman -->
            <div v-if="formData.adakah_muallaf === 'Y'">
              <FormKit
                type="file"
                name="dokumen_pengislaman"
                label="Dokumen Pengislaman"
                help="Salinan dokumen rasmi pengislaman. Format: PDF, JPG, PNG. Saiz maksimum: 5MB"
                accept=".pdf,.jpg,.jpeg,.png"
                validation="required|max:5|mime:application/pdf,image/jpeg,image/png"
                validation-label="Dokumen Pengislaman"
                :validation-messages="{
                  required: 'Sila muat naik dokumen pengislaman',
                  max: 'Saiz fail tidak boleh melebihi 5MB',
                  mime: 'Format fail tidak sah. Sila pilih fail PDF, JPG, atau PNG',
                }"
                v-model="formData.dokumen_pengislaman"
              />
            </div>
          </div>



          <div class="flex justify-between gap-3 mt-6">
            <rs-button
              type="button"
              variant="primary-outline"
              @click="prevStepA"
            >
              Kembali
            </rs-button>
            <div class="flex gap-3">
              <rs-button
                type="button"
                variant="secondary"
                @click="handleSaveStepA4"
              >
                Simpan
              </rs-button>
              <rs-button type="submit" variant="primary" @click="nextStepA">
                Seterusnya ke Maklumat Bank
              </rs-button>
            </div>
          </div>
        </FormKit>

        <!-- Section A Form - Step 4: Maklumat Bank -->
        <FormKit
          v-if="currentStepA === 4"
          type="form"
          @submit="nextStepA"
          :actions="false"
          id="sectionA5"
        >
          <h3 class="text-lg font-semibold mb-4">4. Maklumat Perbankan</h3>

          <div class="mb-6">
            <!-- <h4 class="text-md font-medium mb-3">Maklumat Bank</h4> -->

            <!-- Adakah anda mempunyai akaun bank? -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="block text-sm font-medium text-black-700"
                  >Adakah anda mempunyai akaun bank?
                </label>
                <div class="mb-6">
                  <FormKit
                    type="radio"
                    name="kaedah_pembayaran"
                    :options="paymentMethodOptionsMain"
                    validation="required"
                    v-model="formData.kaedah_pembayaran"
                    :validation-messages="{
                      required: 'Sila pilih sama ada anda mempunyai akaun bank',
                    }"
                  />
                </div>
              </div>
            </div>

            <!-- A. Jika mempunyai akaun bank -->
            <div v-if="formData.kaedah_pembayaran === 'ya'" class="mb-6">
              <h5 class="text-md font-medium mb-4">Maklumat Akaun Bank</h5>

              <div
                v-for="(account, index) in formData.bank_accounts"
                :key="index"
                class="mb-6 p-4 border border-gray-200 rounded-lg"
              >
                <div class="flex justify-between items-center mb-4">
                  <h6 class="text-sm font-medium">
                    Akaun Bank #{{ index + 1 }}
                  </h6>
                  <button
                    type="button"
                    @click="removeBankAccount(index)"
                    class="text-red-500 hover:text-red-700"
                  >
                    <Icon name="mdi:delete" size="1.1rem" />
                  </button>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- Nama Bank -->
                  <FormKit
                    type="select"
                    :name="`bank${index}NamaBank`"
                    label="Nama Bank *"
                    placeholder="Pilih nama bank"
                    :options="bankOptions"
                    validation="required"
                    v-model="account.nama_bank"
                  />

                  <!-- Swift Code (Read Only) -->
                  <FormKit
                    v-if="account.nama_bank"
                    type="text"
                    :name="`bank${index}SwiftCode`"
                    label="Swift Code"
                    :value="getSwiftCodeForBank(account.nama_bank)"
                    readonly
                    help="Swift Code dipaparkan secara automatik"
                  />

                  <!-- No. Akaun Bank -->
                  <FormKit
                    type="text"
                    :name="`bank${index}NoAkaun`"
                    label="No. Akaun Bank *"
                    validation="required"
                    v-model="account.no_akaun_bank"
                  />

                  <!-- Nama Pemegang Akaun -->
                  <FormKit
                    type="text"
                    :name="`bank${index}NamaPemegang`"
                    label="Nama Pemegang Akaun *"
                    validation="required"
                    v-model="account.nama_pemegang_akaun"
                  />

                  <!-- Jenis Akaun -->
                  <FormKit
                    type="select"
                    :name="`bank${index}JenisAkaun`"
                    label="Jenis Akaun *"
                    placeholder="Pilih jenis akaun"
                    :options="[
                      { label: 'Individu', value: 'individu' },
                      { label: 'Bersama', value: 'bersama' }
                    ]"
                    validation="required"
                    v-model="account.jenis_akaun"
                  />

                  <!-- ID Pengenalan -->
                  <FormKit
                    type="text"
                    :name="`bank${index}IdPengenalan`"
                    label="ID Pengenalan *"
                    validation="required"
                    v-model="account.id_pengenalan"
                  />

                  <!-- Nama (if Bersama is selected) -->
                  <FormKit
                    v-if="account.jenis_akaun === 'bersama'"
                    type="text"
                    :name="`bank${index}NamaBersama`"
                    label="Nama *"
                    validation="required"
                    v-model="account.nama_bersama"
                  />
                </div>
              </div>

              <div class="flex justify-center mt-4">
                <rs-button
                  variant="secondary"
                  @click="addBankAccount"
                  type="button"
                >
                  <Icon name="mdi:plus" class="mr-1" size="1rem" />
                  Tambah Akaun Bank
                </rs-button>
              </div>
            </div>

            <!-- B. Jika tidak mempunyai akaun bank -->
            <div v-if="formData.kaedah_pembayaran === 'tidak'" class="mb-6">
              <h5 class="text-md font-medium mb-4">Sebab Tiada Akaun Bank</h5>
              <div class="md:col-span-2">
                <FormKit
                  type="select"
                  name="sebab_tiada_akaun"
                  label="Sebab *"
                  :options="noPaymentReasonOptions"
                  validation="required"
                  placeholder="Pilih sebab tiada akaun bank"
                  v-model="formData.sebab_tiada_akaun"
                  :validation-messages="{
                    required: 'Sila pilih sebab tiada akaun bank',
                  }"
                />
              </div>
            </div>
          </div>

          <div class="flex justify-between gap-3 mt-6">
            <rs-button
              type="button"
              variant="primary-outline"
              @click="prevStepA"
              >Kembali</rs-button
            >
            <div class="flex gap-3">
              <rs-button
                type="button"
                variant="secondary"
                @click="handleSaveStepA5"
                >Simpan</rs-button
              >
              <rs-button type="submit" variant="primary" @click="nextStepA"
                >Seterusnya ke Maklumat Kesihatan</rs-button
              >
            </div>
          </div>
        </FormKit>

        <!-- Section A Form - Step 5: Maklumat Kesihatan -->
        <FormKit
          v-if="currentStepA === 5"
          type="form"
          @submit="nextStepA"
          :actions="false"
          id="sectionA6"
        >
          <h3 class="text-lg font-semibold mb-4">5. Maklumat Kesihatan</h3>

          <!-- Tahap Kesihatan -->
          <div class="mb-6">
            <FormKit
              type="select"
              name="tahap_kesihatan"
              label="Tahap Kesihatan *"
              :options="['Sihat', 'Sakit Kronik', 'OKU', 'Uzur']"
              validation="required"
              v-model="formData.tahap_kesihatan"
              placeholder="Pilih tahap kesihatan"
            />
          </div>

          <!-- A. Jika Tahap Kesihatan = "Sakit Kronik" -->
          <div v-if="formData.tahap_kesihatan === 'Sakit Kronik'" class="mb-8">
            <h5 class="text-lg font-semibold mb-4">Maklumat Sakit Kronik</h5>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Keadaan Kesihatan -->
              <FormKit
                type="select"
                name="keadaan_kesihatan_sakit"
                label="Keadaan Kesihatan *"
                :options="['Terlantar', 'Tidak Terlantar']"
                validation="required"
                v-model="formData.keadaan_kesihatan_sakit"
                placeholder="Pilih keadaan kesihatan"
              />

              <!-- Kos Penjagaan -->
              <FormKit
                type="select"
                name="kos_penjagaan_sakit"
                label="Kos Penjagaan *"
                :options="['Berbayar', 'Tidak Berbayar']"
                validation="required"
                v-model="formData.kos_penjagaan_sakit"
                placeholder="Pilih kos penjagaan"
              />
            </div>

            <!-- Jumlah Perbelanjaan Bulanan -->
            <div class="mt-4">
              <FormKit
                type="text"
                name="perbelanjaan_bulanan_sakit"
                label="Jumlah Perbelanjaan Bulanan (RM) *"
                validation="required"
                placeholder="9999.99"
                v-model="formData.perbelanjaan_bulanan_sakit"
                help="Format: 9999.99"
              />
            </div>
          </div>

          <!-- B. Jika Tahap Kesihatan = "OKU" -->
          <div v-if="formData.tahap_kesihatan === 'OKU'" class="mb-8">
            <h5 class="text-lg font-semibold mb-4">Maklumat OKU</h5>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Kesempurnaan Fizikal -->
              <FormKit
                type="select"
                name="kesempurnaan_fizikal"
                label="Kesempurnaan Fizikal *"
                :options="['Sempurna', 'Cacat Mental', 'Cacat Fizikal']"
                validation="required"
                v-model="formData.kesempurnaan_fizikal"
                placeholder="Pilih kesempurnaan fizikal"
              />

              <!-- Sebab Kecacatan -->
              <FormKit
                type="select"
                name="sebab_kecacatan"
                label="Sebab Kecacatan (Jika Cacat) *"
                :options="['Sejak Lahir', 'Musibah']"
                validation="required"
                v-model="formData.sebab_kecacatan"
                placeholder="Pilih sebab kecacatan"
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <!-- Tahap Kecacatan -->
              <FormKit
                type="select"
                name="tahap_kecacatan"
                label="Tahap Kecacatan *"
                :options="['Terlantar', 'Tidak Terlantar']"
                validation="required"
                v-model="formData.tahap_kecacatan"
                placeholder="Pilih tahap kecacatan"
              />

              <!-- Jumlah Perbelanjaan Bulanan -->
              <FormKit
                type="text"
                name="perbelanjaan_bulanan_oku"
                label="Jumlah Perbelanjaan Bulanan (RM) *"
                validation="required"
                placeholder="9999.99"
                v-model="formData.perbelanjaan_bulanan_oku"
                help="Format: 9999.99"
              />
            </div>
          </div>

          <!-- C. Jika Tahap Kesihatan = "Uzur" -->
          <div v-if="formData.tahap_kesihatan === 'Uzur'" class="mb-8">
            <h5 class="text-lg font-semibold mb-4">Maklumat Uzur</h5>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Keadaan Kesihatan -->
              <FormKit
                type="select"
                name="keadaan_kesihatan_uzur"
                label="Keadaan Kesihatan *"
                :options="['Terlantar', 'Tidak Terlantar']"
                validation="required"
                v-model="formData.keadaan_kesihatan_uzur"
                placeholder="Pilih keadaan kesihatan"
              />

              <!-- Kos Penjagaan -->
              <FormKit
                type="select"
                name="kos_penjagaan_uzur"
                label="Kos Penjagaan *"
                :options="['Berbayar', 'Tidak Berbayar']"
                validation="required"
                v-model="formData.kos_penjagaan_uzur"
                placeholder="Pilih kos penjagaan"
              />
            </div>

            <!-- Jumlah Perbelanjaan Bulanan -->
            <div class="mt-4">
              <FormKit
                type="text"
                name="perbelanjaan_bulanan_uzur"
                label="Jumlah Perbelanjaan Bulanan (RM) *"
                validation="required"
                placeholder="9999.99"
                v-model="formData.perbelanjaan_bulanan_uzur"
                help="Format: 9999.99"
              />
            </div>
          </div>

          <!-- D. Upload Dokumen Sokongan (Jika Tahap Kesihatan ≠ "Sihat") -->
          <div
            v-if="
              formData.tahap_kesihatan && formData.tahap_kesihatan !== 'Sihat'
            "
            class="mb-6"
          >
            <h5 class="text-lg font-semibold mb-4">Dokumen Sokongan</h5>

            <FormKit
              type="file"
              name="dokumen_sokongan_kesihatan"
              label="Upload Dokumen Sokongan Berkaitan Kesihatan *"
              accept=".pdf,.jpg,.jpeg,.png"
              multiple="true"
              help="Format yang dibenarkan: PDF, JPG, JPEG, PNG. Saiz maksimum: 5MB"
              validation="required"
              v-model="formData.dokumen_sokongan_kesihatan"
            />
          </div>

          <div class="flex justify-between gap-3 mt-6">
            <rs-button
              type="button"
              variant="primary-outline"
              @click="prevStepA"
              >Kembali</rs-button
            >
            <div class="flex gap-3">
              <rs-button
                type="button"
                variant="secondary"
                @click="handleSaveStepA2"
                >Simpan</rs-button
              >
              <rs-button type="submit" variant="primary" @click="nextStepA"
                >Seterusnya ke Maklumat Kemahiran</rs-button
              >
            </div>
          </div>
        </FormKit>

        <!-- Section A Form - Step 6: Kemahiran -->
        <FormKit
          v-if="currentStepA === 6"
          type="form"
          @submit="nextStepA"
          :actions="false"
          id="sectionA7"
        >
          <h3 class="text-lg font-semibold mb-4">6. Kemahiran</h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <label class="block text-sm font-medium text-black-700"
                >Kemahiran</label
              >
              <FormKit
                type="checkbox"
                name="kemahiran"
                :options="[
                  'Nelayan',
                  'Penternakan',
                  'Pertanian',
                  'Menjahit',
                  'Kraftangan',
                  'Memasak',
                  'Mengasuh',
                  'Perkhidmatan',
                  'Pertukangan',
                  'Perniagaan',
                  'Lain-lain',
                ]"
                validation="required"
                v-model="formData.kemahiran"
                placeholder="Pilih kemahiran"
                :validation-messages="{
                  required: 'Sila pilih kemahiran',
                }"
              />
            </div>
          </div>

          <FormKit
            type="text"
            name="lain_lain_kemahiran"
            label="Lain-lain Kemahiran"
            validation="required"
            v-if="
              formData.kemahiran && formData.kemahiran.includes('Lain-lain')
            "
            placeholder="Nyatakan kemahiran lain"
            v-model="formData.lain_lain_kemahiran"
          />

          <div class="flex justify-between gap-3 mt-6">
            <rs-button
              type="button"
              variant="primary-outline"
              @click="prevStepA"
              >Kembali</rs-button
            >
            <div class="flex gap-3">
              <rs-button
                type="button"
                variant="secondary"
                @click="handleSaveStepA7"
                >Simpan</rs-button
              >
              <rs-button type="submit" variant="primary" @click="nextStepA"
                >Seterusnya ke Maklumat Alamat</rs-button
              >
            </div>
          </div>
        </FormKit>

        <!-- Section A Form - Step 7: Maklumat Alamat -->
        <FormKit
          v-if="currentStepA === 7"
          type="form"
          @submit="nextStepA"
          :actions="false"
          id="sectionA8"
        >
          <h3 class="text-lg font-semibold mb-4">7. Maklumat Alamat</h3>

          <!-- Alamat Section -->
          <div class="mb-6">
            <h4 class="text-md font-medium mb-3">Alamat</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="md:col-span-2">
                <FormKit
                  type="textarea"
                  name="alamat1"
                  label="Alamat 1"
                  validation="required"
                  placeholder="Sila masukkan alamat 1"
                  v-model="formData.addressInfo.alamat1"
                  :validation-messages="{
                    required: 'Alamat 1 adalah wajib',
                  }"
                />

                <FormKit
                  type="textarea"
                  name="alamat2"
                  label="Alamat 2"
                  placeholder="Sila masukkan alamat 2 (tidak wajib)"
                  v-model="formData.addressInfo.alamat2"
                  v-if="formData.addressInfo.alamat1"
                />

                <FormKit
                  type="textarea"
                  name="alamat3"
                  label="Alamat 3"
                  placeholder="Sila masukkan alamat 3 (tidak wajib)"
                  v-model="formData.addressInfo.alamat3"
                  v-if="formData.addressInfo.alamat1"
                />
              </div>

              <FormKit
                type="select"
                name="negeri"
                label="Negeri"
                value="Selangor"
                :options="negeriOptions"
                v-model="formData.addressInfo.negeri"
              />

              <FormKit
                type="select"
                name="daerah"
                label="Daerah"
                placeholder="Pilih daerah"
                :options="daerahOptions"
                validation="required"
                v-model="formData.addressInfo.daerah"
                :validation-messages="{
                  required: 'Daerah adalah wajib',
                }"
              />

              <FormKit
                type="select"
                name="bandar"
                label="Bandar"
                placeholder="Pilih bandar"
                :options="bandarOptions"
                validation="required"
                v-model="formData.addressInfo.bandar"
                :validation-messages="{
                  required: 'Bandar adalah wajib',
                }"
              />

              <FormKit
                type="select"
                name="poskod"
                label="Poskod"
                placeholder="Pilih poskod"
                :options="poskodOptions"
                validation="required"
                v-model="formData.addressInfo.poskod"
                :validation-messages="{
                  required: 'Poskod adalah wajib',
                }"
              />

              <FormKit
                type="select"
                name="kariah"
                label="Kariah"
                placeholder="Pilih kariah"
                :options="kariahOptions"
                validation="required"
                v-model="formData.addressInfo.kariah"
                :validation-messages="{
                  required: 'Kariah adalah wajib',
                }"
              />

              <div class="flex gap-2">
                <FormKit
                  v-model="formData.addressInfo.geolokasi"
                  label="Geolokasi"
                  type="text"
                  class="flex-1"
                />
                <rs-button
                  type="button"
                  variant="primary-outline"
                  @click="getLocation('addressInfo')"
                  class="whitespace-nowrap mt-7"
                >
                  <i class="fas fa-location-dot mr-2"></i>
                  Dapatkan Lokasi
                </rs-button>
              </div>

              <FormKit
                type="number"
                name="tempoh_menetap_selangor"
                label="Tempoh Menetap di Selangor (Tahun)"
                min="0"
                validation="required|min:0"
                v-model="formData.addressInfo.tempoh_menetap_selangor"
                :validation-messages="{
                  required: 'Tempoh menetap adalah wajib',
                  min: 'Tempoh menetap mesti 0 atau lebih',
                }"
              />
            </div>

            <div v-if="formData.adakah_muallaf === 'Y'" class="flex gap-2">
              <FormKit
                type="text"
                name="kursus_terpilih"
                label="Kursus Terpilih"
                placeholder="Pilih kursus dari senarai"
                readonly
                class="flex-1"
                v-model="formData.addressInfo.kursus_terpilih"
              />
              <rs-button
                type="button"
                variant="secondary"
                @click="openKursusModal"
                class="whitespace-nowrap mt-7"
              >
                <i class="fas fa-list mr-2"></i>
                Pilih Kursus
              </rs-button>
            </div>
          </div>

          <!-- Maklumat Tempat Tinggal Section -->
          <div class="mb-6">
            <h4 class="text-md font-medium mb-3">Maklumat Tempat Tinggal</h4>

            <!-- Hidden field for ID type -->
            <FormKit type="hidden" name="jenis_id_alamat" :value="jenisId" />

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit
                type="select"
                name="status_kediaman"
                label="Status Kediaman Tempat Tinggal"
                :options="[
                  'Milik Sendiri Tidak Berbayar',
                  'Milik Sendiri Berbayar',
                  'Sewa',
                  'Kuarters Majikan',
                  'Tumpang Rumah Ibu/Bapa/Mertua',
                  'Pusaka',
                  'Sumbangan LZS / PPRT / RISDA',
                  'Lain-lain',
                ]"
                validation="required"
                v-model="formData.addressInfo.status_kediaman"
                :validation-messages="{
                  required: 'Status kediaman adalah wajib',
                }"
              />

              <FormKit
                type="text"
                name="lain_lain_status_kediaman"
                label="Lain-lain Status Kediaman Tempat Tinggal"
                validation="required"
                v-if="formData.addressInfo.status_kediaman === 'Lain-lain'"
                placeholder="Nyatakan status kediaman lain"
                v-model="formData.addressInfo.lain_lain_status_kediaman"
                :validation-messages="{
                  required: 'Sila nyatakan status kediaman lain',
                }"
              />

              <FormKit
                type="select"
                name="tapak_rumah"
                label="Tapak Rumah"
                :options="[
                  'Milik Sendiri',
                  'Tanah Wakaf',
                  'Tanah Kerajaan / Persendirian / Setinggan (Izin)',
                  'Kebenaran Menduduki Sementara (TOL)',
                  'Menumpang / Sewa / Pajak daripada Orang Lain',
                  'Tanah Keluarga',
                  'Lain-lain',
                ]"
                validation="required"
                v-model="formData.addressInfo.tapak_rumah"
                :validation-messages="{
                  required: 'Tapak rumah adalah wajib',
                }"
              />

              <FormKit
                type="text"
                name="lain_lain_tapak_rumah"
                label="Lain-lain Tapak Rumah"
                validation="required"
                v-if="formData.addressInfo.tapak_rumah === 'Lain-lain'"
                placeholder="Nyatakan tapak rumah lain"
                v-model="formData.addressInfo.lain_lain_tapak_rumah"
                :validation-messages="{
                  required: 'Sila nyatakan tapak rumah lain',
                }"
              />

              <FormKit
                type="select"
                name="jenis_rumah"
                label="Jenis Rumah"
                :options="[
                  'Kos Rendah',
                  'Kos Sederhana',
                  'Pangsapuri/Flat',
                  'Teres',
                  'Lain-lain',
                ]"
                validation="required"
                v-model="formData.addressInfo.jenis_rumah"
                :validation-messages="{
                  required: 'Jenis rumah adalah wajib',
                }"
              />

              <FormKit
                type="text"
                name="lain_lain_jenis_rumah"
                label="Lain-lain Jenis Rumah"
                validation="required"
                v-if="formData.addressInfo.jenis_rumah === 'Lain-lain'"
                placeholder="Nyatakan jenis rumah lain"
                v-model="formData.addressInfo.lain_lain_jenis_rumah"
                :validation-messages="{
                  required: 'Sila nyatakan jenis rumah lain',
                }"
              />

              <FormKit
                type="select"
                name="binaan_rumah"
                label="Binaan Rumah"
                :options="['Batu', 'Kayu', 'Separa Batu', 'Lain-lain']"
                validation="required"
                v-model="formData.addressInfo.binaan_rumah"
                :validation-messages="{
                  required: 'Binaan rumah adalah wajib',
                }"
              />

              <FormKit
                type="text"
                name="lain_lain_binaan_rumah"
                label="Lain-lain Binaan Rumah"
                validation="required"
                v-if="formData.addressInfo.binaan_rumah === 'Lain-lain'"
                placeholder="Nyatakan binaan rumah lain"
                v-model="formData.addressInfo.lain_lain_binaan_rumah"
                :validation-messages="{
                  required: 'Sila nyatakan binaan rumah lain',
                }"
              />

              <FormKit
                type="select"
                name="keadaan_kediaman"
                label="Keadaan Kediaman"
                :options="['Baik', 'Sempurna', 'Uzur', 'Separa Uzur']"
                validation="required"
                v-model="formData.addressInfo.keadaan_kediaman"
                :validation-messages="{
                  required: 'Keadaan kediaman adalah wajib',
                }"
              />
            </div>

            <!-- Kemudahan Asas Section -->
            <div class="mt-6">
              <h5 class="text-md font-medium mb-3">Kemudahan Asas</h5>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700"
                    >Bekalan Air</label
                  >
                  <FormKit
                    type="radio"
                    name="bekalan_air"
                    :options="[
                      { label: 'Ada', value: 'ada' },
                      { label: 'Tiada', value: 'tiada' },
                    ]"
                    validation="required"
                    v-model="formData.addressInfo.bekalan_air"
                    :validation-messages="{
                      required: 'Sila pilih status bekalan air',
                    }"
                  />
                </div>

                <FormKit
                  type="number"
                  name="bil_air"
                  label="Anggaran Bil Air Sebulan (RM)"
                  step="0.01"
                  min="0"
                  validation="required"
                  v-model="formData.addressInfo.bil_air"
                  :validation-messages="{
                    required: 'Anggaran bil air adalah wajib',
                  }"
                />

                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700"
                    >Bekalan Elektrik</label
                  >
                  <FormKit
                    type="radio"
                    name="bekalan_elektrik"
                    :options="[
                      { label: 'Ada', value: 'ada' },
                      { label: 'Tiada', value: 'tiada' },
                    ]"
                    validation="required"
                    v-model="formData.addressInfo.bekalan_elektrik"
                    :validation-messages="{
                      required: 'Sila pilih status bekalan elektrik',
                    }"
                  />
                </div>

                <FormKit
                  type="number"
                  name="bil_elektrik"
                  label="Anggaran Bil Elektrik Sebulan (RM)"
                  step="0.01"
                  min="0"
                  validation="required"
                  v-model="formData.addressInfo.bil_elektrik"
                  :validation-messages="{
                    required: 'Anggaran bil elektrik adalah wajib',
                  }"
                />

                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700"
                    >Bil Penyelenggaraan</label
                  >
                  <FormKit
                    type="radio"
                    name="penyelenggaraan"
                    :options="[
                      { label: 'Ada', value: 'ada' },
                      { label: 'Tiada', value: 'tiada' },
                    ]"
                    validation="required"
                    v-model="formData.addressInfo.penyelenggaraan"
                    :validation-messages="{
                      required: 'Sila pilih status bil penyelenggaraan',
                    }"
                  />
                </div>

                <FormKit
                  type="number"
                  name="bil_penyelenggaraan"
                  label="Anggaran Bil Penyelenggaraan Sebulan (RM)"
                  step="0.01"
                  min="0"
                  validation="required"
                  v-model="formData.addressInfo.bil_penyelenggaraan"
                  :validation-messages="{
                    required: 'Anggaran bil penyelenggaraan adalah wajib',
                  }"
                />
              </div>
            </div>

            <!-- Kos Tempat Tinggal Section -->
            <div class="mt-6">
              <!-- <h5 class="text-md font-medium mb-3">Kos Tempat Tinggal</h5> -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormKit
                  type="number"
                  name="kadar_bayaran_bulanan"
                  label="Status Kediaman jika Milik Sendiri Berbayar"
                  step="0.01"
                  min="0"
                  placeholder="Isi kadar bayaran bulanan (RM)"
                  v-if="
                    formData.addressInfo.status_kediaman ===
                    'Milik Sendiri Berbayar'
                  "
                  v-model="formData.addressInfo.kadar_bayaran_bulanan"
                />

                <FormKit
                  type="number"
                  name="kadar_sewa_bulanan"
                  label="Status Kediaman jika Sewa"
                  step="0.01"
                  min="0"
                  placeholder="Isi kadar sewa bulanan (RM)"
                  v-if="formData.addressInfo.status_kediaman === 'Sewa'"
                  v-model="formData.addressInfo.kadar_sewa_bulanan"
                />

                <FormKit
                  type="file"
                  name="dokumen_perjanjian_sewa"
                  label="Dokumen Perjanjian Sewa"
                  accept=".pdf,.jpg,.jpeg,.png"
                  help="Format yang dibenarkan: PDF, JPG, PNG. Saiz maksimum: 5MB"
                  validation="required|max:5|mime:application/pdf,image/jpeg,image/png"
                  v-if="formData.addressInfo.status_kediaman === 'Sewa'"
                  v-model="formData.addressInfo.dokumen_perjanjian_sewa"
                  :validation-messages="{
                    required:
                      'Dokumen perjanjian sewa adalah wajib untuk status sewa',
                  }"
                />
              </div>
            </div>
          </div>

          <div class="flex justify-between gap-3 mt-6">
            <rs-button
              type="button"
              variant="primary-outline"
              @click="prevStepA"
              >Kembali</rs-button
            >
            <div class="flex gap-3">
              <rs-button
                type="button"
                variant="secondary"
                @click="handleSaveStepA8"
                >Simpan</rs-button
              >
              <rs-button type="submit" variant="primary" @click="nextStepA"
                >Seterusnya ke Maklumat Pinjaman Harta</rs-button
              >
            </div>
          </div>
        </FormKit>

        <!-- Section A Form - Step 8: Maklumat Pinjaman Harta -->
        <FormKit
          v-if="currentStepA === 8"
          type="form"
          @submit="nextStepA"
          :actions="false"
          id="sectionA9"
        >
          <h3 class="text-lg font-semibold mb-4">8. Maklumat Pinjaman Harta</h3>

          <div class="mb-6">
            <h4 class="text-md font-medium mb-3">Maklumat Pinjaman</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit
                type="text"
                name="nama_institusi_pemberi_pinjaman"
                label="Nama Institusi / Individu Pemberi Pinjaman"
                placeholder="Sila masukkan nama institusi atau individu"
                v-model="formData.nama_institusi_pemberi_pinjaman"
              />

              <!-- Conditional fields - only show when nama institusi is filled -->
              <div
                v-if="formData.nama_institusi_pemberi_pinjaman"
                class="md:col-span-2"
              >
                <h4 class="text-md font-medium mb-3">Maklumat Pinjaman</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormKit
                    type="text"
                    name="jenis_pinjaman"
                    label="Jenis Pinjaman"
                    placeholder="Sila masukkan jenis pinjaman"
                    v-model="formData.jenis_pinjaman"
                  />

                  <FormKit
                    type="number"
                    name="amaun_bayaran_bulanan"
                    label="Amaun Bayaran Bulanan (RM)"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    v-model="formData.amaun_bayaran_bulanan"
                  />

                  <FormKit
                    type="number"
                    name="jumlah_keseluruhan_perbelanjaan"
                    label="Jumlah Keseluruhan Perbelanjaan (RM)"
                    step="0.01"
                    min="0"
                    validation="required"
                    placeholder="0.00"
                    v-model="formData.jumlah_keseluruhan_perbelanjaan"
                    :validation-messages="{
                      required: 'Jumlah keseluruhan perbelanjaan adalah wajib',
                    }"
                  />

                  <FormKit
                    type="date"
                    name="tahun_mula_pinjaman"
                    label="Tahun Mula Pinjaman"
                    validation="required"
                    v-model="formData.tahun_mula_pinjaman"
                    :validation-messages="{
                      required: 'Tahun mula pinjaman adalah wajib',
                    }"
                  />

                  <FormKit
                    type="date"
                    name="tahun_akhir_pinjaman"
                    label="Tahun Akhir Pinjaman"
                    validation="required"
                    v-model="formData.tahun_akhir_pinjaman"
                    :validation-messages="{
                      required: 'Tahun akhir pinjaman adalah wajib',
                    }"
                  />

                  <div class="md:col-span-2">
                    <FormKit
                      type="file"
                      name="dokumen_perjanjian_pinjaman"
                      label="Dokumen Perjanjian Pinjaman"
                      accept=".pdf,.jpg,.jpeg,.png"
                      help="Format yang dibenarkan: PDF, JPG, PNG. Saiz maksimum: 5MB"
                      validation="required|max:5|mime:application/pdf,image/jpeg,image/png"
                      v-model="formData.dokumen_perjanjian_pinjaman"
                      :validation-messages="{
                        required: 'Dokumen perjanjian pinjaman adalah wajib',
                        max: 'Saiz fail tidak boleh melebihi 5MB',
                        mime: 'Format fail tidak dibenarkan',
                      }"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-between gap-3 mt-6">
            <rs-button
              type="button"
              variant="primary-outline"
              @click="prevStepA"
              >Kembali</rs-button
            >
            <div class="flex gap-3">
              <rs-button
                type="button"
                variant="secondary"
                @click="handleSaveStepA9"
                >Simpan</rs-button
              >
              <rs-button type="submit" variant="primary" @click="nextStepA"
                >Seterusnya ke Maklumat Pemilikan</rs-button
              >
            </div>
          </div>
        </FormKit>

        <!-- Section A Form - Step 9: Maklumat Pemilikan -->
        <FormKit
          v-if="currentStepA === 9"
          type="form"
          @submit="nextStepA"
          :actions="false"
          id="sectionA10"
        >
          <h3 class="text-lg font-semibold mb-4">9. Maklumat Pemilikan</h3>

          <h4 class="font-medium mb-2">Aset Cair</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormKit
              type="number"
              name="wang_simpanan"
              label="Jumlah wang simpanan (RM)"
              help="*sertakan penyata bank"
              step="0.01"
              min="0"
            />

            <FormKit
              type="number"
              name="emas"
              label="Emas (gram)"
              step="0.01"
              min="0"
            />

            <FormKit
              type="number"
              name="saham"
              label="Saham (RM)"
              step="0.01"
              min="0"
            />
          </div>

          <h4 class="font-medium mb-2 mt-4">Aset Tidak Cair</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <label class="block text-sm font-medium text-black-700"
                >Jenis Kenderaan</label
              >
              <FormKit
                type="checkbox"
                name="jenis_kenderaan"
                :options="['Basikal', 'Kereta', 'Motosikal', 'Van', 'Lori']"
                v-model="formData.jenis_kenderaan"
              />
            </div>
          </div>
          <FormKit
            v-if="
              formData.jenis_kenderaan && formData.jenis_kenderaan.length > 0
            "
            type="number"
            name="kenderaan_total"
            label="Kenderaan (total unit)"
            min="0"
            validation="required|min:1"
            :validation-messages="{
              required: 'Jumlah unit kenderaan diperlukan',
              min: 'Masukkan sekurang-kurangnya 1 unit',
            }"
            v-model="formData.kenderaan_total"
          />

          <FormKit
            type="number"
            name="rumah_kedai"
            label="Rumah Kedai (unit)"
            min="0"
          />

          <FormKit
            type="number"
            name="tanah_sawah"
            label="Tanah/Sawah (ekar)"
            step="0.01"
            min="0"
          />

          <FormKit
            type="file"
            name="dokumen_pemilikan"
            label="Upload dokumen pemilikan"
            accept=".pdf,.jpg,.jpeg,.png"
            help="Jika ada wang simpanan > 0, rumah kedai > 0, atau tanah/sawah > 0, dokumen adalah wajib"
            :validation="
              Number(formData.wang_simpanan) > 0 ||
              Number(formData.rumah_kedai) > 0 ||
              Number(formData.tanah_sawah) > 0
                ? 'required|max:5|mime:application/pdf,image/jpeg,image/png'
                : 'max:5|mime:application/pdf,image/jpeg,image/png'
            "
            :validation-messages="{
              required: 'Dokumen pemilikan adalah wajib',
              max: 'Saiz fail tidak boleh melebihi 5MB',
              mime: 'Format fail tidak dibenarkan',
            }"
            v-model="formData.dokumen_pemilikan"
          />

          <div class="flex justify-between gap-3 mt-6">
            <rs-button
              type="button"
              variant="primary-outline"
              @click="prevStepA"
              >Kembali</rs-button
            >
            <div class="flex gap-3">
              <rs-button
                type="button"
                variant="secondary"
                @click="handleSaveStepA10"
                >Simpan</rs-button
              >
              <rs-button type="submit" variant="primary" @click="nextStepA"
                >Seterusnya ke Maklumat Pemilikan Barangan Rumah</rs-button
              >
            </div>
          </div>
        </FormKit>

        <!-- Section A Form - Step 10: Maklumat Pemilikan Barangan Rumah -->
        <FormKit
          v-if="currentStepA === 10"
          type="form"
          @submit="nextStepA"
          :actions="false"
          id="sectionA11"
        >
          <h3 class="text-lg font-semibold mb-4">
            10. Maklumat Pemilikan Barangan Rumah
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormKit
              type="select"
              name="television"
              label="Television"
              placeholder="Pilih status television"
              :options="[
                { label: 'Ya', value: 'ya' },
                { label: 'Tidak', value: 'tidak' },
              ]"
              v-model="formData.television"
            />

            <FormKit
              type="select"
              name="radio"
              label="Radio"
              placeholder="Pilih status radio"
              :options="[
                { label: 'Ya', value: 'ya' },
                { label: 'Tidak', value: 'tidak' },
              ]"
              v-model="formData.radio"
            />

            <FormKit
              type="select"
              name="perabot"
              label="Perabot"
              placeholder="Pilih status perabot"
              :options="[
                { label: 'Ya', value: 'ya' },
                { label: 'Tidak', value: 'tidak' },
              ]"
              v-model="formData.perabot"
            />

            <FormKit
              type="select"
              name="telefon_bimbit"
              label="Telefon Bimbit"
              placeholder="Pilih status telefon bimbit"
              :options="[
                { label: 'Ya', value: 'ya' },
                { label: 'Tidak', value: 'tidak' },
              ]"
              v-model="formData.telefon_bimbit"
            />

            <FormKit
              type="select"
              name="mesin_basuh"
              label="Mesin Basuh"
              placeholder="Pilih status mesin basuh"
              :options="[
                { label: 'Ya', value: 'ya' },
                { label: 'Tidak', value: 'tidak' },
              ]"
              v-model="formData.mesin_basuh"
            />

            <FormKit
              type="select"
              name="astro"
              label="Astro"
              placeholder="Pilih status astro"
              :options="[
                { label: 'Ya', value: 'ya' },
                { label: 'Tidak', value: 'tidak' },
              ]"
              v-model="formData.astro"
            />

            <FormKit
              type="select"
              name="video_player_cd_dvd"
              label="Video / Player / CD / DVD"
              placeholder="Pilih status video player"
              :options="[
                { label: 'Ya', value: 'ya' },
                { label: 'Tidak', value: 'tidak' },
              ]"
              v-model="formData.video_player_cd_dvd"
            />

            <FormKit
              type="select"
              name="peti_ais"
              label="Peti Ais"
              placeholder="Pilih status peti ais"
              :options="[
                { label: 'Ya', value: 'ya' },
                { label: 'Tidak', value: 'tidak' },
              ]"
              v-model="formData.peti_ais"
            />

            <FormKit
              type="select"
              name="dapur_gas"
              label="Dapur Gas"
              placeholder="Pilih status dapur gas"
              :options="[
                { label: 'Ya', value: 'ya' },
                { label: 'Tidak', value: 'tidak' },
              ]"
              v-model="formData.dapur_gas"
            />
          </div>

          <div class="flex justify-between gap-3 mt-6">
            <rs-button
              type="button"
              variant="primary-outline"
              @click="prevStepA"
              >Kembali</rs-button
            >
            <div class="flex gap-3">
              <rs-button
                type="button"
                variant="secondary"
                @click="handleSaveStepA11"
                >Simpan</rs-button
              >
              <rs-button type="submit" variant="primary" @click="nextStepA"
                >Seterusnya ke Maklumat Pekerjaan</rs-button
              >
            </div>
          </div>
        </FormKit>

        <!-- Section A Form - Step 11: Maklumat Pekerjaan -->
        <FormKit
          v-if="currentStepA === 11"
          type="form"
          @submit="nextStepA"
          :actions="false"
          id="sectionA12"
        >
          <h3 class="text-lg font-semibold mb-4">11. Maklumat Pekerjaan</h3>

          <!-- Hidden field for ID type -->
          <FormKit type="hidden" name="jenis_id_pekerjaan" :value="jenisId" />

          <!-- Employment Status -->
          <div class="mb-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="block text-sm font-medium text-black-700"
                  >Status Pekerjaan
                </label>
                <FormKit
                  type="radio"
                  name="status_pekerjaan"
                  :options="[
                    { label: 'Bekerja', value: 'bekerja' },
                    { label: 'Tidak Bekerja', value: 'tidak_bekerja' },
                  ]"
                  validation="required"
                  v-model="formData.status_pekerjaan"
                  :validation-messages="{
                    required: 'Sila pilih status pekerjaan',
                  }"
                />
              </div>
            </div>
          </div>
          <!-- Employment Details (shown only when working) -->
          <div v-if="formData.status_pekerjaan === 'bekerja'" class="mb-6">
            <h4 class="text-md font-medium mb-3">Butiran Pekerjaan</h4>

            <!-- Income Source (shown only when working) -->
            <div class="mb-6">
              <h5 class="text-md font-medium mb-3">Sumber Pendapatan</h5>
              <FormKit
                type="checkbox"
                name="sumber_pendapatan"
                :options="[
                  'Pengajian',
                  'Sumbangan keluarga',
                  'Individu',
                  'Institusi',
                  'Sumbangan Agensi',
                  'Lain-lain',
                ]"
                validation="required|min:1"
                :validation-messages="{
                  required:
                    'Sila pilih sekurang-kurangnya satu sumber pendapatan',
                  min: 'Sila pilih sekurang-kurangnya satu sumber pendapatan',
                }"
                v-model="formData.sumber_pendapatan"
              />

              <!-- Lain-lain Sumber Pendapatan (shown only when "Lain-lain" is selected) -->
              <div
                v-if="
                  formData.sumber_pendapatan &&
                  formData.sumber_pendapatan.includes('Lain-lain')
                "
                class="mt-4"
              >
                <FormKit
                  type="text"
                  name="lain_lain_sumber_pendapatan"
                  label="Lain-lain Sumber Pendapatan"
                  validation="required"
                  placeholder="Nyatakan sumber pendapatan lain"
                  v-model="formData.lain_lain_sumber_pendapatan"
                  :validation-messages="{
                    required: 'Sila nyatakan sumber pendapatan lain',
                  }"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit
                type="text"
                name="jenis_pekerjaan"
                label="Jenis Pekerjaan"
                validation="required"
                v-model="formData.jenis_pekerjaan"
                :validation-messages="{
                  required: 'Jenis pekerjaan adalah wajib',
                }"
              />

              <FormKit
                type="select"
                name="sektor_pekerjaan"
                label="Sektor Pekerjaan"
                placeholder="Pilih sektor pekerjaan"
                :options="[
                  'Kerajaan',
                  'Swasta',
                  'Badan Berkanun',
                  'Kerja Sendiri',
                  'Lain-lain',
                ]"
                validation="required"
                v-model="formData.sektor_pekerjaan"
                :validation-messages="{
                  required: 'Sektor pekerjaan adalah wajib',
                }"
              />

              <FormKit
                v-if="showLainLainSektor"
                type="text"
                name="lain_lain_sektor"
                label="Lain-lain Sektor Pekerjaan"
                validation="required"
                v-model="formData.lain_lain_sektor"
                :validation-messages="{
                  required: 'Sila nyatakan sektor pekerjaan lain',
                }"
              />

              <FormKit
                type="text"
                name="no_telefon_pejabat"
                label="No. Telefon Pejabat"
                validation="required"
                v-model="formData.no_telefon_pejabat"
                :validation-messages="{
                  required: 'No. telefon pejabat adalah wajib',
                }"
              />

              <FormKit
                type="text"
                name="nama_majikan"
                label="Nama Majikan"
                validation="required"
                v-model="formData.nama_majikan"
                :validation-messages="{
                  required: 'Nama majikan adalah wajib',
                }"
              />

              <FormKit
                type="text"
                name="no_telefon_majikan"
                label="No. Telefon Majikan"
                validation="required"
                v-model="formData.no_telefon_majikan"
                :validation-messages="{
                  required: 'No. telefon majikan adalah wajib',
                }"
              />

              <div class="md:col-span-2">
                <FormKit
                  type="textarea"
                  name="alamat_majikan_1"
                  label="Alamat Majikan 1"
                  validation="required"
                  v-model="formData.alamat_majikan_1"
                  :validation-messages="{
                    required: 'Alamat majikan adalah wajib',
                  }"
                />

                <FormKit
                  type="textarea"
                  name="alamat_majikan_2"
                  label="Alamat Majikan 2"
                  placeholder="(Tidak wajib)"
                  v-model="formData.alamat_majikan_2"
                />

                <FormKit
                  type="textarea"
                  name="alamat_majikan_3"
                  label="Alamat Majikan 3"
                  placeholder="(Tidak wajib)"
                  v-model="formData.alamat_majikan_3"
                />
              </div>

              <FormKit
                type="text"
                name="bandar_majikan"
                label="Bandar"
                validation="required"
                v-model="formData.bandar_majikan"
                :validation-messages="{
                  required: 'Bandar adalah wajib',
                }"
              />

              <FormKit
                type="text"
                name="poskod_majikan"
                label="Poskod"
                validation="required"
                v-model="formData.poskod_majikan"
                :validation-messages="{
                  required: 'Poskod adalah wajib',
                }"
              />

              <FormKit
                type="text"
                name="daerah_majikan"
                label="Daerah"
                validation="required"
                v-model="formData.daerah_majikan"
                :validation-messages="{
                  required: 'Daerah adalah wajib',
                }"
              />

              <FormKit
                type="text"
                name="negeri_majikan"
                label="Negeri"
                validation="required"
                v-model="formData.negeri_majikan"
                :validation-messages="{
                  required: 'Negeri adalah wajib',
                }"
              />

              <FormKit
                type="text"
                name="negara_majikan"
                label="Negara"
                validation="required"
                v-model="formData.negara_majikan"
                :validation-messages="{
                  required: 'Negara adalah wajib',
                }"
              />

              <FormKit
                type="text"
                name="jawatan"
                label="Jawatan"
                validation="required"
                v-model="formData.jawatan"
                :validation-messages="{
                  required: 'Jawatan adalah wajib',
                }"
              />

              <FormKit
                type="select"
                name="status_jawatan"
                label="Status Jawatan"
                placeholder="Pilih status jawatan"
                :options="['Tetap', 'Kontrak', 'Sementara']"
                validation="required"
                v-model="formData.status_jawatan"
                :validation-messages="{
                  required: 'Status jawatan adalah wajib',
                }"
              />

              <FormKit
                type="number"
                name="pendapatan_kasar"
                label="Pendapatan Kasar (RM)"
                step="0.01"
                min="0"
                validation="required"
                v-model="formData.pendapatan_kasar"
                :validation-messages="{
                  required: 'Pendapatan kasar adalah wajib',
                }"
              />

              <div class="md:col-span-2">
                <FormKit
                  type="file"
                  name="pengesahan_pendapatan"
                  label="Muat naik pengesahan pendapatan / penyata gaji ketua keluarga"
                  accept=".pdf,.jpg,.jpeg,.png"
                  help="Format yang dibenarkan: PDF, JPG, PNG. Saiz maksimum: 5MB"
                  validation="required|max:5|mime:application/pdf,image/jpeg,image/png"
                  :validation-messages="{
                    required: 'Dokumen pengesahan pendapatan adalah wajib',
                    max: 'Saiz fail tidak boleh melebihi 5MB',
                    mime: 'Format fail tidak dibenarkan',
                  }"
                />
              </div>
            </div>
          </div>

          <div class="flex justify-between gap-3 mt-6">
            <rs-button
              type="button"
              variant="primary-outline"
              @click="prevStepA"
              >Kembali</rs-button
            >
            <div class="flex gap-3">
              <rs-button
                type="button"
                variant="secondary"
                @click="handleSaveStepA12"
                >Simpan</rs-button
              >
              <rs-button type="submit" variant="primary" @click="nextStepA"
                >Seterusnya ke Maklumat Pendapatan & Perbelanjaan</rs-button
              >
            </div>
          </div>
        </FormKit>

        <!-- Section A Form - Step 12: Maklumat Pendapatan & Perbelanjaan -->
        <FormKit
          v-if="currentStepA === 12"
          type="form"
          @submit="nextStepA"
          :actions="false"
          id="sectionA13"
        >
          <h3 class="text-lg font-semibold mb-4">
            12. Maklumat Pendapatan & Perbelanjaan
          </h3>

          <!-- Income Information -->
          <div class="mb-6">
            <h4 class="text-md font-medium mb-3">
              Maklumat Pendapatan dan Perbelanjaan
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit
                type="number"
                name="gaji_elaun_pendapatan"
                label="Gaji / Elaun / Pendapatan Diperoleh (RM)"
                step="0.01"
                min="0"
                validation="required"
                :validation-messages="{
                  required: 'Gaji / Elaun / Pendapatan Diperoleh adalah wajib',
                }"
                v-model="formData.gaji_elaun_pendapatan"
              />

              <FormKit
                type="number"
                name="pendapatan_isteri_suami_ibubapa_penjaga"
                label="Pendapatan Isteri/Suami/Ibubapa/Penjaga (RM)"
                step="0.01"
                min="0"
                validation="required"
                :validation-messages="{
                  required:
                    'Pendapatan Isteri/Suami/Ibubapa/Penjaga adalah wajib',
                }"
                v-model="formData.pendapatan_isteri_suami_ibubapa_penjaga"
              />

              <FormKit
                type="number"
                name="pencen_perkeso"
                label="Pencen / PERKESO (RM)"
                step="0.01"
                min="0"
                validation="required"
                :validation-messages="{
                  required: 'Pencen / PERKESO adalah wajib',
                }"
                v-model="formData.pencen_perkeso"
              />

              <FormKit
                type="number"
                name="sumbangan_anak_anak"
                label="Sumbangan Anak-anak (RM)"
                step="0.01"
                min="0"
                validation="required"
                :validation-messages="{
                  required: 'Sumbangan Anak-anak adalah wajib',
                }"
                v-model="formData.sumbangan_anak_anak"
              />

              <FormKit
                type="number"
                name="bantuan_jkm"
                label="Bantuan Jabatan Kebajikan Masyarakat (RM)"
                step="0.01"
                min="0"
                validation="required"
                :validation-messages="{
                  required: 'Bantuan Jabatan Kebajikan Masyarakat adalah wajib',
                }"
                v-model="formData.bantuan_jkm"
              />

              <FormKit
                type="number"
                name="takaful"
                label="Takaful (RM)"
                step="0.01"
                min="0"
                validation="required"
                :validation-messages="{
                  required: 'Takaful adalah wajib',
                }"
                v-model="formData.takaful"
              />

              <FormKit
                type="number"
                name="sewa_rumah_tanah_kedai"
                label="Sewa Rumah / Tanah / Kedai (RM)"
                step="0.01"
                min="0"
                validation="required"
                :validation-messages="{
                  required: 'Sewa Rumah / Tanah / Kedai adalah wajib',
                }"
                v-model="formData.sewa_rumah_tanah_kedai"
              />

              <FormKit
                type="number"
                name="pendapatan_tanggungan_serumah"
                label="Pendapatan Tanggungan yang Tinggal Serumah (RM)"
                step="0.01"
                min="0"
                validation="required"
                :validation-messages="{
                  required:
                    'Pendapatan Tanggungan yang Tinggal Serumah adalah wajib',
                }"
                v-model="formData.pendapatan_tanggungan_serumah"
              />

              <FormKit
                type="number"
                name="pendapatan_lain_lain"
                label="Pendapatan Lain-lain (RM)"
                step="0.01"
                min="0"
                validation="required"
                :validation-messages="{
                  required: 'Pendapatan Lain-lain adalah wajib',
                }"
                v-model="formData.pendapatan_lain_lain"
              />

              <FormKit
                type="number"
                name="perbelanjaan_makanan_minuman"
                label="Perbelanjaan Makanan dan Minuman (RM)"
                step="0.01"
                min="0"
                validation="required"
                :validation-messages="{
                  required: 'Perbelanjaan Makanan dan Minuman adalah wajib',
                }"
                v-model="formData.perbelanjaan_makanan_minuman"
              />

              <FormKit
                type="number"
                name="sewa_bayaran_pinjaman_perumahan"
                label="Sewa / Bayaran Pinjaman Perumahan (RM)"
                step="0.01"
                min="0"
                validation="required"
                :validation-messages="{
                  required: 'Sewa / Bayaran Pinjaman Perumahan adalah wajib',
                }"
                v-model="formData.sewa_bayaran_pinjaman_perumahan"
              />

              <FormKit
                type="number"
                name="perbelanjaan_persekolahan_anak"
                label="Perbelanjaan Persekolahan Anak (RM)"
                step="0.01"
                min="0"
                validation="required"
                :validation-messages="{
                  required: 'Perbelanjaan Persekolahan Anak adalah wajib',
                }"
                v-model="formData.perbelanjaan_persekolahan_anak"
              />

              <FormKit
                type="number"
                name="pengangkutan_tambang_bas_sekolah"
                label="Pengangkutan / Tambang Bas Sekolah (RM)"
                step="0.01"
                min="0"
                validation="required"
                :validation-messages="{
                  required: 'Pengangkutan / Tambang Bas Sekolah adalah wajib',
                }"
                v-model="formData.pengangkutan_tambang_bas_sekolah"
              />

              <FormKit
                type="number"
                name="bil_utiliti"
                label="Bil Utiliti (RM)"
                step="0.01"
                min="0"
                validation="required"
                :validation-messages="{
                  required: 'Bil Utiliti adalah wajib',
                }"
                v-model="formData.bil_utiliti"
              />
            </div>
          </div>

          <div class="flex justify-between gap-3 mt-6">
            <rs-button
              type="button"
              variant="primary-outline"
              @click="prevStepA"
              >Kembali</rs-button
            >
            <div class="flex gap-3">
              <rs-button
                type="button"
                variant="secondary"
                @click="handleSaveStepA13"
                >Simpan</rs-button
              >
              <rs-button type="submit" variant="primary" @click="nextStepA"
                >Seterusnya ke Maklumat Waris</rs-button
              >
            </div>
          </div>
        </FormKit>

        <!-- Section A Form - Step 13: Maklumat Waris -->
        <FormKit
          v-if="currentStepA === 13"
          type="form"
          @submit="nextStepA"
          :actions="false"
          id="sectionA14"
        >
          <h3 class="text-lg font-semibold mb-4">13. Maklumat Waris</h3>

          <div
            v-for="(heir, index) in formData.heirs"
            :key="index"
            class="mb-8 p-4 border border-gray-200 rounded-lg"
          >
            <div class="flex justify-between items-center mb-4">
              <h4 class="text-md font-medium">Waris #{{ index + 1 }}</h4>
              <button
                type="button"
                @click="removeHeir(index)"
                class="text-red-500 hover:text-red-700"
              >
                <Icon name="mdi:delete" size="1.25rem" />
              </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit
                type="select"
                :name="`heir${index}JenisId`"
                label="Jenis Id"
                placeholder="Pilih Jenis Id"
                validation="required"
                :options="[
                  { label: 'MyKad', value: 'MyKad' },
                  { label: 'ForeignId', value: 'ForeignId' },
                ]"
                v-model="heir.jenis_pengenalan"
                :validation-messages="{
                  required: 'Jenis Id adalah wajib',
                }"
              />

              <FormKit
                type="text"
                :name="'heir${index}IdPengenalan'"
                label="Id Pengenalan"
                :validation="heir.jenis_pengenalan ? 'required' : ''"
                v-model="heir.id_pengenalan"
                :validation-messages="{
                  required: 'Id Pengenalan adalah wajib',
                }"
              />

              <FormKit
                type="text"
                :name="`heir${index}Name`"
                label="Nama Waris"
                :validation="heir.jenis_pengenalan ? 'required' : ''"
                v-model="heir.name"
                :validation-messages="{
                  required: 'Nama waris adalah wajib',
                }"
              />

              <FormKit
                type="select"
                :name="`heir${index}Relationship`"
                label="Hubungan"
                :validation="heir.jenis_pengenalan ? 'required' : ''"
                placeholder="Pilih Hubungan"
                :options="[
                  'Pasangan Pemohon',
                  'Isteri Kedua',
                  'Isteri Ketiga',
                  'Isteri Keempat',
                  'Ipar',
                  'Abang',
                  'Bapa',
                  'Ibu',
                  'Kakak',
                  'Adik',
                  'Anak',
                  'Cucu',
                  'Bapa Mertua',
                  'Ibu Mertua',
                  'Lain-lain',
                ]"
                v-model="heir.relationship"
                :validation-messages="{
                  required: 'Hubungan adalah wajib',
                }"
              />

              <FormKit
                v-if="heir.relationship === 'Lain-lain'"
                type="text"
                :name="`heir${index}RelationshipOther`"
                label="Lain-lain Hubungan"
                :validation="
                  heir.relationship === 'Lain-lain' && heir.jenis_pengenalan
                    ? 'required'
                    : ''
                "
                v-model="heir.relationship_other"
                :validation-messages="{
                  required: 'Sila nyatakan hubungan lain-lain',
                }"
              />

              <FormKit
                type="tel"
                :name="`heir${index}Phone`"
                label="No. Telefon Waris"
                :validation="heir.jenis_pengenalan ? 'required' : ''"
                v-model="heir.phone"
                :validation-messages="{
                  required: 'No. telefon waris adalah wajib',
                }"
              />
            </div>
          </div>

          <div class="flex justify-center mt-4">
            <rs-button variant="secondary" @click="addHeir" type="button">
              <Icon name="mdi:plus" class="mr-1" size="1rem" />
              Tambah Waris
            </rs-button>
          </div>

          <div class="flex justify-between gap-3 mt-6">
            <rs-button
              type="button"
              variant="primary-outline"
              @click="prevStepA"
              >Kembali</rs-button
            >
            <div class="flex gap-3">
              <rs-button
                type="button"
                variant="secondary"
                @click="handleSaveStepA15"
                >Simpan</rs-button
              >
              <rs-button type="submit" variant="primary" @click="nextStepA"
                >Seterusnya ke Maklumat Tanggungan</rs-button
              >
            </div>
          </div>
        </FormKit>
      </template>
    </rs-card>

    <rs-card v-if="currentSection == 2" class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Borang Tanggungan Asnaf</h2>
          <div class="text-sm text-gray-600">
            Langkah {{ currentStepB }} dari {{ totalStepsB }}
          </div>
        </div>
      </template>

      <template #body>
        <!-- Progress indicator -->
        <div class="mb-6">
          <div class="flex justify-between mb-2">
            <div
              v-for="step in stepsB"
              :key="step.id"
              class="text-center flex-1 cursor-pointer relative group"
              :class="{ 'font-semibold': currentStepB >= step.id }"
              @click="goToStepB(step.id)"
            >
              {{ step.label }}
              <!-- Tooltip for Pengesahan Pendapatan -->
              <div
                v-if="step.tooltip"
                class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 max-w-xs"
              >
                {{ step.tooltip }}
                <!-- Arrow -->
                <div
                  class="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"
                ></div>
              </div>
            </div>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2.5">
            <div
              class="bg-primary h-2.5 rounded-full transition-all duration-300"
              :style="`width: ${
                currentStepB >= totalStepsB
                  ? 100
                  : (currentStepB / totalStepsB) * 100
              }%`"
            ></div>
          </div>
        </div>

        <!-- Section B Form Steps -->

        <!-- Tanggungan Selector and Management (Visible only during Steps 1-7) -->
        <div
          v-if="currentStepB >= 1 && currentStepB <= 7"
          class="mb-6 p-4 bg-gray-50 rounded-lg"
        >
          <div class="flex justify-between items-center mb-4">
            <h4 class="text-lg font-semibold">Senarai Tanggungan</h4>
            <rs-button
              type="button"
              variant="primary"
              @click="addTanggungan"
              class="text-sm"
              :disabled="tanggunganList.length >= 3"
            >
              + Tambah Tanggungan
              {{ tanggunganList.length >= 3 ? "(Maksimum 3)" : "" }}
            </rs-button>
          </div>

          <!-- Tanggungan Cards Display -->
          <div
            v-if="tanggunganList.length > 0"
            class="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <div
              v-for="(tanggungan, index) in tanggunganList"
              :key="tanggungan.id"
              class="p-4 bg-white rounded-lg border cursor-pointer hover:shadow-md transition-all"
              :class="{
                'ring-2 ring-blue-500 border-blue-300':
                  currentTanggunganIndex === index,
                'border-green-300 bg-green-50':
                  isTanggunganComplete(tanggungan) &&
                  currentTanggunganIndex !== index,
                'border-yellow-300 bg-yellow-50':
                  !isTanggunganComplete(tanggungan) &&
                  currentTanggunganIndex !== index,
                'border-gray-200':
                  currentTanggunganIndex !== index &&
                  !isTanggunganComplete(tanggungan),
              }"
              @click="selectTanggungan(index)"
            >
              <!-- Card Header -->
              <div class="flex justify-between items-start mb-3">
                <div class="flex-1 text-center">
                  <!-- <h5 class="font-semibold text-gray-900">
                      Tanggungan {{ index + 1 }}
                    </h5> -->
                  <p class="text-sm text-gray-600">
                    {{ tanggungan.nama_tanggungan || "Nama belum diisi" }}
                  </p>
                </div>

                <!-- Status Badge -->
                <span
                  class="px-2 py-1 text-xs rounded-full"
                  :class="{
                    'bg-green-100 text-green-800':
                      isTanggunganComplete(tanggungan),
                    'bg-yellow-100 text-yellow-800':
                      !isTanggunganComplete(tanggungan),
                  }"
                >
                  {{
                    isTanggunganComplete(tanggungan)
                      ? "Lengkap"
                      : "Tidak Lengkap"
                  }}
                </span>
              </div>

              <!-- Key Information -->
              <!-- <div class="space-y-2 text-sm text-gray-600">
                <div v-if="tanggungan.hubungan_pemohon">
                  <span class="font-medium">Hubungan:</span>
                  {{ tanggungan.hubungan_pemohon }}
                </div>
                <div v-if="tanggungan.jenis_id_tanggungan">
                  <span class="font-medium">ID:</span>
                  {{ tanggungan.jenis_id_tanggungan }}
                </div>
                <div v-if="tanggungan.jantina_tanggungan">
                  <span class="font-medium">Jantina:</span>
                  {{ tanggungan.jantina_tanggungan }}
                </div>
              </div> -->

              <!-- Action Buttons -->
              <div class="flex gap-2 mt-4">
                <button
                  @click.stop="selectTanggungan(index)"
                  class="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                >
                  {{
                    currentTanggunganIndex === index ? "Sedang Edit" : "Edit"
                  }}
                </button>
                <button
                  v-if="tanggunganList.length > 1"
                  @click.stop="removeTanggungan(index)"
                  class="px-3 py-2 text-red-600 hover:text-red-800 text-sm rounded border border-red-300 hover:bg-red-50 transition-colors"
                  title="Buang tanggungan ini"
                >
                  <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <FormKit
          v-if="currentStepB === 1"
          type="form"
          @submit="nextStepB"
          :actions="false"
        >
          <h3 class="text-lg font-semibold mb-4">
            B. Maklumat Peribadi Tanggungan {{ currentTanggunganIndex + 1 }}
          </h3>

          <!-- I. Maklumat Peribadi Tanggungan -->
          <div class="mb-6">
            <h4 class="font-medium mb-3">1. Maklumat Peribadi</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Hubungan dengan Pemohon/Asnaf -->
              <FormKit
                type="select"
                name="hubungan_pemohon"
                label="Hubungan dengan Pemohon/Asnaf *"
                placeholder="Pilih hubungan"
                :options="[
                  'Pasangan Pemohon',
                  'Isteri Kedua',
                  'Isteri Ketiga',
                  'Isteri Keempat',
                  'Ipar',
                  'Abang',
                  'Bapa',
                  'Ibu',
                  'Kakak',
                  'Adik',
                  'Anak',
                  'Cucu',
                  'Bapa Mertua',
                  'Ibu Mertua',
                  'Lain-lain',
                ]"
                validation="required"
                v-model="getCurrentTanggungan().hubungan_pemohon"
              />

              <!-- Lain-lain Hubungan -->
              <FormKit
                v-if="showLainLainHubungan"
                type="text"
                name="lain_lain_hubungan"
                label="Lain-lain Hubungan *"
                placeholder="Nyatakan hubungan lain"
                validation="required"
                v-model="getCurrentTanggungan().lain_lain_hubungan"
              />

              <!-- Dokumen Surat Nikah -->
              <div v-if="showDokumenSuratNikah" class="md:col-span-2">
                <FormKit
                  type="file"
                  name="dokumen_surat_nikah"
                  label="Dokumen Surat Nikah *"
                  accept=".pdf,.jpg,.jpeg,.png"
                  help="Format yang dibenarkan: PDF, JPG, PNG. Saiz maksimum: 5MB"
                  validation="required|max:5|mime:application/pdf,image/jpeg,image/png"
                />
              </div>

              <!-- Nama Mengikut Dokumen Pengenalan -->
              <FormKit
                type="text"
                name="nama_tanggungan"
                label="Nama Mengikut Dokumen Pengenalan *"
                placeholder="Masukkan nama penuh"
                validation="required"
                v-model="getCurrentTanggungan().nama_tanggungan"
              />

              <!-- Jenis Pengenalan -->
              <FormKit
                type="select"
                name="jenis_pengenalan_tanggungan"
                label="Jenis Pengenalan *"
                placeholder="Pilih jenis pengenalan"
                :options="[
                  { label: 'MyKad', value: 'MyKad' },
                  { label: 'ForeignId', value: 'ForeignId' },
                ]"
                validation="required"
                v-model="getCurrentTanggungan().jenis_pengenalan_tanggungan"
              />

              <!-- Pengenalan ID Tanggungan -->
              <FormKit
                type="text"
                name="pengenalan_id_tanggungan"
                label="Pengenalan ID Tanggungan *"
                placeholder="Masukkan nombor ID"
                :validation="
                  getCurrentTanggungan().jenis_pengenalan_tanggungan === 'MyKad'
                    ? 'required|length:12|matches:/^[0-9]{12}$/'
                    : 'required'
                "
                :validation-messages="{
                  required: 'Pengenalan ID Tanggungan adalah wajib',
                  length: 'MyKad mesti 12 digit tanpa tanda sempang',
                  matches: 'MyKad mesti mengandungi nombor sahaja (12 digit)',
                }"
                v-model="getCurrentTanggungan().pengenalan_id_tanggungan"
              />

              <!-- Upload Dokumen Nombor ID -->
              <div class="md:col-span-2">
                <FormKit
                  type="file"
                  name="dokumen_nombor_id"
                  label="Upload Dokumen Nombor ID *"
                  accept=".pdf,.jpg,.jpeg,.png"
                  help="Format yang dibenarkan: PDF, JPG, PNG. Saiz maksimum: 5MB"
                  validation="required|max:5|mime:application/pdf,image/jpeg,image/png"
                />
              </div>

              <!-- Warganegara -->
              <FormKit
                type="select"
                name="warganegara_tanggungan"
                label="Warganegara *"
                placeholder="Pilih warganegara"
                :options="[
                  { label: 'Malaysia', value: 'Malaysia' },
                  { label: 'Lain-lain', value: 'Lain-lain' },
                ]"
                validation="required"
                v-model="getCurrentTanggungan().warganegara_tanggungan"
              />

              <!-- Lain-lain Warganegara -->
              <FormKit
                v-if="showLainLainWarganegara"
                type="text"
                name="lain_lain_warganegara"
                label="Lain-lain Warganegara *"
                placeholder="Nyatakan warganegara"
                validation="required"
                v-model="getCurrentTanggungan().lain_lain_warganegara"
              />

              <!-- Taraf Penduduk Tetap -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-black-700"
                    >Taraf Penduduk Tetap</label
                  >
                  <FormKit
                    type="radio"
                    name="taraf_penduduk_tetap"
                    :options="[
                      { label: 'Ya', value: 'Y' },
                      { label: 'Tidak', value: 'N' },
                    ]"
                    validation="required"
                    v-model="getCurrentTanggungan().taraf_penduduk_tetap"
                  />
                </div>
              </div>
              <!-- No Pasport -->
              <FormKit
                v-if="showPassportFields"
                type="text"
                name="no_pasport"
                label="No Pasport *"
                placeholder="Masukkan nombor pasport"
                validation="required"
                v-model="getCurrentTanggungan().no_pasport"
              />

              <!-- Tarikh Mula Pasport -->
              <FormKit
                v-if="showPassportFields"
                type="date"
                name="tarikh_mula_pasport"
                label="Tarikh Mula Pasport (DD/MM/YYYY) *"
                validation="required"
                v-model="getCurrentTanggungan().tarikh_mula_pasport"
              />

              <!-- Tarikh Tamat Pasport -->
              <FormKit
                v-if="showPassportFields"
                type="date"
                name="tarikh_tamat_pasport"
                label="Tarikh Tamat Pasport (DD/MM/YYYY) *"
                validation="required"
                v-model="getCurrentTanggungan().tarikh_tamat_pasport"
              />

              <!-- Passport Expiry Warning -->
              <div v-if="showPassportExpiryWarning" class="md:col-span-2">
                <div class="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div class="flex items-center gap-2">
                    <i class="fas fa-exclamation-triangle text-red-500"></i>
                    <span class="text-sm text-red-700 font-medium">
                      Amaran: Pasport telah tamat tempoh. Tanggungan ini akan
                      ditandakan sebagai tidak aktif.
                    </span>
                  </div>
                  <p class="text-xs text-red-600 mt-1">
                    Sila kemaskini maklumat pasport baru untuk mengaktifkan
                    semula tanggungan ini.
                  </p>
                </div>
              </div>

              <!-- Tarikh Lahir -->
              <FormKit
                type="date"
                name="tarikh_lahir_tanggungan"
                label="Tarikh Lahir (DD/MM/YYYY) *"
                validation="required"
                v-model="getCurrentTanggungan().tarikh_lahir_tanggungan"
              />

              <!-- Umur (Auto-calculated) -->
              <FormKit
                type="text"
                name="umur_tanggungan"
                label="Umur"
                v-model="getCurrentTanggungan().umur_tanggungan"
                readonly
                help="Umur dari data yang telah ditetapkan"
              />

              <!-- Mohon Ketua Keluarga (for minors) -->
              <FormKit
                v-if="
                  parseInt(
                    calculateAge(getCurrentTanggungan().tarikh_lahir_tanggungan)
                  ) < 18
                "
                type="checkbox"
                name="mohon_ketua_keluarga"
                label="Mohon Ketua Keluarga?"
                v-model="getCurrentTanggungan().mohon_ketua_keluarga"
              />

              <!-- Special Approval for Minors -->
              <div
                v-if="
                  parseInt(
                    calculateAge(getCurrentTanggungan().tarikh_lahir_tanggungan)
                  ) < 18 && getCurrentTanggungan().mohon_ketua_keluarga
                "
                class="md:col-span-2"
              >
                <div
                  class="bg-yellow-50 border border-yellow-200 rounded-lg p-3"
                >
                  <div class="flex items-center gap-2 mb-2">
                    <i class="fas fa-info-circle text-yellow-500"></i>
                    <span class="text-sm text-yellow-700 font-medium">
                      Maklumat Kelulusan Khas Diperlukan
                    </span>
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormKit
                      type="select"
                      name="situasi_kelulusan_khas"
                      placeholder="Pilih situasi"
                      label="Situasi *"
                      :options="[
                        { label: 'Profiling', value: 'Profiling' },
                        { label: 'Permohonan Khas', value: 'Permohonan Khas' },
                        { label: 'Lain-lain', value: 'Lain-lain' },
                      ]"
                      :validation="getCurrentTanggungan().mohon_ketua_keluarga ? 'required' : ''"
                      :disabled="true"
                      v-model="getCurrentTanggungan().situasi_kelulusan_khas"
                    />
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div class="space-y-2">
                        <label class="block text-sm font-medium text-black-700"
                          >Kelulusan Khas</label
                        >
                        <FormKit
                          type="radio"
                          name="kelulusan_khas"
                          :options="[
                            { label: 'Ya', value: 'Y' },
                            { label: 'Tidak', value: 'N' },
                          ]"
                          :validation="getCurrentTanggungan().mohon_ketua_keluarga ? 'required' : ''"
                          :disabled="true"
                          v-model="getCurrentTanggungan().kelulusan_khas"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Tempat Lahir -->
              <FormKit
                type="text"
                name="tempat_lahir_tanggungan"
                label="Tempat Lahir"
                placeholder="Masukkan tempat lahir"
                v-model="getCurrentTanggungan().tempat_lahir_tanggungan"
              />

              <!-- Jantina -->
              <FormKit
                type="select"
                name="jantina_tanggungan"
                label="Jantina"
                placeholder="Pilih jantina"
                :options="[
                  { label: 'Lelaki', value: 'Lelaki' },
                  { label: 'Perempuan', value: 'Perempuan' },
                ]"
                v-model="getCurrentTanggungan().jantina_tanggungan"
              />

              <!-- Agama -->
              <FormKit
                type="select"
                name="agama_tanggungan"
                label="Agama"
                placeholder="Pilih agama"
                :options="[
                  { label: 'Islam', value: 'Islam' },
                  { label: 'Kristian', value: 'Kristian' },
                  { label: 'Buddha', value: 'Buddha' },
                  { label: 'Hindu', value: 'Hindu' },
                  { label: 'Lain-lain', value: 'Lain-lain' },
                ]"
                v-model="getCurrentTanggungan().agama_tanggungan"
              />

              <!-- Lain-lain Agama -->
              <FormKit
                v-if="showLainLainAgama"
                type="text"
                name="lain_lain_agama"
                label="Lain-lain Agama *"
                placeholder="Nyatakan agama lain"
                validation="required"
                v-model="getCurrentTanggungan().lain_lain_agama"
              />

              <!-- Bangsa -->
              <FormKit
                type="select"
                name="bangsa_tanggungan"
                label="Bangsa *"
                placeholder="Pilih bangsa"
                :options="[
                  { label: 'Orang Asli', value: 'Orang Asli' },
                  { label: 'Melayu', value: 'Melayu' },
                  { label: 'Cina', value: 'Cina' },
                  { label: 'India', value: 'India' },
                  { label: 'Kadazan', value: 'Kadazan' },
                  { label: 'Iban', value: 'Iban' },
                  { label: 'Murut', value: 'Murut' },
                  { label: 'Bajau', value: 'Bajau' },
                  { label: 'Lain-lain', value: 'Lain-lain' },
                ]"
                validation="required"
                v-model="getCurrentTanggungan().bangsa_tanggungan"
              />

              <!-- Lain-lain Bangsa -->
              <FormKit
                v-if="showLainLainBangsa"
                type="text"
                name="lain_lain_bangsa"
                label="Lain-lain Bangsa *"
                placeholder="Nyatakan bangsa lain"
                validation="required"
                v-model="getCurrentTanggungan().lain_lain_bangsa"
              />

              <!-- No Telefon Bimbit -->
              <FormKit
                type="text"
                name="no_telefon_bimbit_tanggungan"
                label="No Telefon Bimbit *"
                placeholder="Contoh: 0123456789"
                validation="required|matches:/^(\+?6?01)[0-46-9]-*[0-9]{7,8}$/"
                :validation-messages="{
                  required: 'No Telefon Bimbit adalah wajib',
                  matches:
                    'Format nombor telefon tidak sah. Contoh: 0123456789',
                }"
                v-model="getCurrentTanggungan().no_telefon_bimbit_tanggungan"
              />

              <!-- No Telefon Rumah -->
              <FormKit
                type="text"
                name="no_telefon_rumah_tanggungan"
                label="No Telefon Rumah"
                placeholder="Contoh: 038881234"
                validation="matches:/^(\+?6?0)[0-9]{1,2}-*[0-9]{6,8}$/"
                :validation-messages="{
                  matches: 'Format nombor telefon tidak sah. Contoh: 038881234',
                }"
                v-model="getCurrentTanggungan().no_telefon_rumah_tanggungan"
              />

              <!-- Emel -->
              <FormKit
                type="email"
                name="emel_tanggungan"
                label="Emel"
                placeholder="Contoh: nama@email.com"
                validation="email"
                :validation-messages="{
                  email: 'Format emel tidak sah. Contoh: nama@email.com',
                }"
                v-model="getCurrentTanggungan().emel_tanggungan"
              />

              <!-- Tempoh Menetap di Selangor -->
              <FormKit
                type="number"
                name="tempoh_menetap_selangor_tanggungan"
                label="Tempoh Menetap di Selangor (Tahun) *"
                placeholder="0"
                min="0"
                max="120"
                validation="required|min:0|max:120"
                :validation-messages="{
                  required: 'Tempoh Menetap di Selangor adalah wajib',
                  min: 'Tempoh tidak boleh kurang daripada 0 tahun',
                  max: 'Tempoh tidak boleh melebihi 120 tahun',
                }"
                v-model="
                  getCurrentTanggungan().tempoh_menetap_selangor_tanggungan
                "
              />

              <!-- Status Perkahwinan -->
              <FormKit
                type="select"
                name="status_perkahwinan_tanggungan"
                label="Status Perkahwinan *"
                placeholder="Pilih status perkahwinan"
                :options="[
                  { label: 'Bujang', value: 'Bujang' },
                  { label: 'Berkahwin', value: 'Berkahwin' },
                  { label: 'Lain-lain', value: 'Lain-lain' },
                ]"
                validation="required"
                v-model="getCurrentTanggungan().status_perkahwinan_tanggungan"
              />

              <!-- Lain-lain Status Perkahwinan -->
              <FormKit
                v-if="showLainLainStatusPerkahwinan"
                type="text"
                name="lain_lain_status_perkahwinan"
                label="Lain-lain Status Perkahwinan *"
                placeholder="Nyatakan status perkahwinan lain"
                validation="required"
                v-model="getCurrentTanggungan().lain_lain_status_perkahwinan"
              />

              <!-- Jumlah Tanggungan (Auto-calculated) -->
              <div class="md:col-span-2">
                <FormKit
                  type="text"
                  name="jumlah_tanggungan"
                  label="Jumlah Tanggungan"
                  :value="calculateTotalTanggungan()"
                  readonly
                  help="Dikira secara automatik berdasarkan maklumat pasangan & tanggungan"
                />
              </div>
            </div>
          </div>

          <div class="flex justify-between gap-3 mt-6">
            <rs-button
              type="button"
              variant="primary-outline"
              @click="prevSection"
              >Kembali</rs-button
            >
            <div class="flex gap-3">
              <rs-button
                type="button"
                variant="secondary"
                @click="handleSaveStepB1"
                >Simpan</rs-button
              >
              <rs-button type="submit" variant="primary" @click="nextStepB"
                >Seterusnya ke Maklumat Islam</rs-button
              >
            </div>
          </div>
        </FormKit>

        <!-- Section B Form - Step 2: Maklumat Islam Tanggungan -->
        <FormKit
          v-if="currentStepB === 2"
          type="form"
          @submit="nextStepB"
          :actions="false"
          id="sectionB2"
        >
            <h3 class="text-lg font-semibold mb-4">2. Maklumat Pengislaman</h3>

          <div class="mb-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Adakah tanggungan anda seorang Muallaf? -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-black-700"
                    >Adakah tanggungan anda seorang Muallaf?</label
                  >
                  <div class="md:col-span-2">
                    <FormKit
                      type="radio"
                      name="adakah_muallaf_tanggungan"
                      :options="[
                        { label: 'Ya', value: 'Y' },
                        { label: 'Tidak', value: 'N' },
                      ]"
                      validation="required"
                      v-model="getCurrentTanggungan().adakah_muallaf_tanggungan"
                    />
                  </div>
                </div>
              </div>
              <!-- Muallaf Fields (Conditional) -->
              <div
                v-if="getCurrentTanggungan().adakah_muallaf_tanggungan === 'Y'"
                class="md:col-span-2"
              >
                <h5 class="font-medium mb-3">Maklumat Muallaf</h5>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- Nama Sebelum Islam (Muallaf) -->
                  <FormKit
                    type="text"
                    name="nama_sebelum_islam_tanggungan"
                    label="Nama Sebelum Islam (Muallaf) *"
                    placeholder="Masukkan nama sebelum Islam"
                    validation="required"
                    v-model="
                      getCurrentTanggungan().nama_sebelum_islam_tanggungan
                    "
                  />

                  <!-- Nama Selepas Islam (Muallaf) -->
                  <FormKit
                    type="text"
                    name="nama_selepas_islam_tanggungan"
                    label="Nama Selepas Islam (Muallaf) *"
                    placeholder="Masukkan nama selepas Islam"
                    validation="required"
                    v-model="
                      getCurrentTanggungan().nama_selepas_islam_tanggungan
                    "
                  />

                  <!-- Tarikh Masuk Islam -->
                  <FormKit
                    type="date"
                    name="tarikh_masuk_islam_tanggungan"
                    label="Tarikh Masuk Islam (DD/MM/YYYY) *"
                    validation="required"
                    v-model="
                      getCurrentTanggungan().tarikh_masuk_islam_tanggungan
                    "
                  />

                  <!-- Tarikh Masuk Kelas Fardu Ain Muallaf (KFAM) -->
                  <FormKit
                    type="date"
                    name="tarikh_masuk_kfam_tanggungan"
                    label="Tarikh Masuk Kelas Fardu Ain Muallaf (KFAM) (DD/MM/YYYY) *"
                    validation="required"
                    v-model="
                      getCurrentTanggungan().tarikh_masuk_kfam_tanggungan
                    "
                  />

                  <!-- Islamic Dates Validation Warning -->
                  <div
                    v-if="!islamicDatesValidationTanggungan.isValid"
                    class="md:col-span-2"
                  >
                    <div class="bg-red-50 border border-red-200 rounded-lg p-3">
                      <div class="flex items-center gap-2">
                        <i class="fas fa-exclamation-triangle text-red-500"></i>
                        <span class="text-sm text-red-700 font-medium">
                          {{ islamicDatesValidationTanggungan.message }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <!-- Tarikh Keluar Muallaf (Auto-calculated) -->
                  <FormKit
                    type="text"
                    name="tarikh_keluar_muallaf_tanggungan"
                    label="Tarikh Keluar Muallaf"
                    :value="calculateTarikhKeluarMuallafTanggungan()"
                    readonly
                    help="Dikira secara automatik: Tarikh Masuk Islam + 5 tahun ATAU Tarikh Masuk KFAM + 5 tahun (pilih yang lebih lewat)"
                  />

                  <!-- Dokumen Pengislaman -->
                  <div class="md:col-span-2">
                    <FormKit
                      type="file"
                      name="dokumen_pengislaman_tanggungan"
                      label="Dokumen Pengislaman *"
                      help="Format yang dibenarkan: PDF, JPG, PNG. Saiz maksimum: 5MB"
                      accept=".pdf,.jpg,.jpeg,.png"
                      validation="required|max:5|mime:application/pdf,image/jpeg,image/png"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-between gap-3 mt-6">
            <rs-button
              type="button"
              variant="primary-outline"
              @click="prevStepB"
              >Kembali</rs-button
            >
            <div class="flex gap-3">
              <rs-button
                type="button"
                variant="secondary"
                @click="handleSaveStepB2"
                >Simpan</rs-button
              >
              <rs-button type="submit" variant="primary" @click="nextStepB"
                >Seterusnya ke Maklumat Bank</rs-button
              >
            </div>
          </div>
        </FormKit>

        <!-- Section B Form - Step 3: Maklumat Bank Tanggungan -->
        <FormKit
          v-if="currentStepB === 3"
          type="form"
          @submit="nextStepB"
          :actions="false"
          id="sectionB3"
        >
          <h3 class="text-lg font-semibold mb-4">
            3. Maklumat Perbankan 
          </h3>

          <div class="mb-6">
            <!-- Kaedah Pembayaran -->
            <div class="mb-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-black-700"
                    >Kaedah Pembayaran</label
                  >
                  <FormKit
                    type="radio"
                    name="kaedah_pembayaran_tanggungan"
                    :options="paymentMethodOptions"
                    validation="required"
                    v-model="
                      getCurrentTanggungan().kaedah_pembayaran_tanggungan
                    "
                    :validation-messages="{
                      required: 'Kaedah pembayaran adalah wajib',
                    }"
                  />
                </div>
              </div>
            </div>

            <!-- A. Jika Kaedah Pembayaran = Akaun -->
            <div
              v-if="
                getCurrentTanggungan().kaedah_pembayaran_tanggungan === 'akaun'
              "
              class="mb-6"
            >
              <h5 class="text-md font-medium mb-4">Maklumat Akaun Bank</h5>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Nama Bank -->
                <FormKit
                  type="select"
                  name="nama_bank_tanggungan"
                  label="Nama Bank *"
                  placeholder="Pilih nama bank"
                  :options="bankOptions"
                  validation="required"
                  v-model="getCurrentTanggungan().nama_bank_tanggungan"
                />

                <!-- Swift Code (Read Only) -->
                <FormKit
                  v-if="getCurrentTanggungan().nama_bank_tanggungan"
                  type="text"
                  name="swift_code_tanggungan"
                  label="Swift Code"
                  v-model="getCurrentTanggungan().swift_code_tanggungan"
                  :value="getSelectedBankSwiftCodeTanggungan()"
                  readonly
                  help="Swift Code dipaparkan secara automatik"
                />

                <!-- No. Akaun Bank -->
                <FormKit
                  type="text"
                  name="no_akaun_bank_tanggungan"
                  label="No. Akaun Bank *"
                  validation="required"
                  v-model="getCurrentTanggungan().no_akaun_bank_tanggungan"
                />

                <!-- Nama Pemegang Akaun -->
                <FormKit
                  type="text"
                  name="nama_pemegang_akaun_tanggungan"
                  label="Nama Pemegang Akaun *"
                  validation="required"
                  v-model="
                    getCurrentTanggungan().nama_pemegang_akaun_tanggungan
                  "
                />
              </div>
            </div>

            <!-- B. Jika Kaedah Pembayaran = Tiada -->
            <div
              v-if="
                getCurrentTanggungan().kaedah_pembayaran_tanggungan === 'tiada'
              "
              class="mb-6"
            >
              <h5 class="text-md font-medium mb-4">Sebab Tiada Akaun Bank</h5>
              <div class="md:col-span-2">
                <FormKit
                  type="select"
                  name="sebab_tiada_akaun_tanggungan"
                  label="Sebab *"
                  :options="noPaymentReasonOptions"
                  validation="required"
                  placeholder="Pilih sebab tiada akaun bank"
                  v-model="getCurrentTanggungan().sebab_tiada_akaun_tanggungan"
                  :validation-messages="{
                    required: 'Sila pilih sebab tiada akaun bank',
                  }"
                />
              </div>
            </div>
          </div>

          <div class="flex justify-between gap-3 mt-6">
            <rs-button
              type="button"
              variant="primary-outline"
              @click="prevStepB"
              >Kembali</rs-button
            >
            <div class="flex gap-3">
              <rs-button
                type="button"
                variant="secondary"
                @click="handleSaveStepB3"
                >Simpan</rs-button
              >
              <rs-button type="submit" variant="primary" @click="nextStepB"
                >Seterusnya ke Maklumat Pendidikan</rs-button
              >
            </div>
          </div>
        </FormKit>

        <!-- Section B Form - Step 4: Maklumat Pendidikan Tanggungan -->
        <FormKit
          v-if="currentStepB === 4"
          type="form"
          @submit="nextStepB"
          :actions="false"
          id="sectionB4"
        >
          <!-- IV. Maklumat Pendidikan Tanggungan -->
          <div class="mb-6">
            <h4 class="font-medium mb-3">4. Maklumat Pendidikan </h4>

            <!-- Bahagian A: Maklumat Pendidikan Asas -->
            <div class="mb-6">
              <h5 class="text-md font-medium mb-3">Maklumat Pendidikan Asas</h5>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Adakah Tanggungan Masih Bersekolah? -->
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-black-700"
                    >Adakah Tanggungan Masih Bersekolah?</label
                  >
                  <FormKit
                    type="radio"
                    name="masih_bersekolah"
                    :options="[
                      { label: 'Ya', value: 'Y' },
                      { label: 'Tidak', value: 'T' },
                    ]"
                    validation="required"
                    v-model="getCurrentTanggungan().masih_bersekolah"
                    :disabled="false"
                  />
                </div>
                <!-- Pendidikan Tertinggi -->
                <FormKit
                  type="select"
                  name="pendidikan_tertinggi_tanggungan"
                  label="Pendidikan Tertinggi"
                  placeholder="Pilih pendidikan tertinggi"
                  :options="[
                    'Peringkat Rendah',
                    'SRP-PMR',
                    'SPM',
                    'Sijil',
                    'Diploma',
                    'STPM',
                    'Ijazah',
                    'Lain-lain',
                  ]"
                  validation="required"
                  v-model="
                    getCurrentTanggungan().pendidikan_tertinggi_tanggungan
                  "
                  :disabled="false"
                />
              </div>

              <!-- Lain-lain Pendidikan Tertinggi -->
              <div
                v-if="
                  getCurrentTanggungan().pendidikan_tertinggi_tanggungan ===
                  'Lain-lain'
                "
                class="mt-4"
              >
                <FormKit
                  type="text"
                  name="lain_pendidikan_tertinggi_tanggungan"
                  label="Lain-lain Pendidikan Tertinggi"
                  placeholder="Sila nyatakan pendidikan lain"
                  v-model="
                    getCurrentTanggungan().lain_pendidikan_tertinggi_tanggungan
                  "
                  :disabled="false"
                />
              </div>

              <!-- Tahap Pendidikan yang Dicapai -->
              <div class="mt-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-black-700"
                      >Tahap Pendidikan yang Dicapai</label
                    >
                    <FormKit
                      type="checkbox"
                      name="tahap_pendidikan_dicapai"
                      :options="[
                        'Peringkat Rendah',
                        'SRP-PMR',
                        'SPM',
                        'Sijil',
                        'Diploma',
                        'STPM',
                        'Ijazah',
                        'Lain-lain',
                      ]"
                      validation="required|min:1"
                      validation-label="Tahap Pendidikan"
                      validation-messages="{
                    required: 'Sila pilih sekurang-kurangnya satu tahap pendidikan',
                    min: 'Sila pilih sekurang-kurangnya satu tahap pendidikan'
                  }"
                      v-model="getCurrentTanggungan().tahap_pendidikan_dicapai"
                      :disabled="false"
                    />
                  </div>
                </div>
              </div>
              <!-- Lain-lain Tahap Pendidikan yang Dicapai -->
              <div
                v-if="
                  getCurrentTanggungan().tahap_pendidikan_dicapai &&
                  getCurrentTanggungan().tahap_pendidikan_dicapai.includes(
                    'Lain-lain'
                  )
                "
                class="mt-4"
              >
                <FormKit
                  type="text"
                  name="lain_tahap_pendidikan_dicapai"
                  label="Lain-lain Tahap Pendidikan yang Dicapai"
                  placeholder="Sila nyatakan tahap pendidikan lain"
                  v-model="getCurrentTanggungan().lain_tahap_pendidikan_dicapai"
                  :disabled="false"
                />
              </div>

              <!-- Sijil Pendidikan yang Diperolehi -->
              <div class="mt-4">
                <FormKit
                  type="file"
                  name="sijil_pendidikan_tanggungan"
                  label="Sijil Pendidikan yang Diperolehi"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  help="Format yang dibenarkan: PDF, JPG, PNG. Saiz maksimum: 5MB setiap fail"
                  v-model="getCurrentTanggungan().sijil_pendidikan_tanggungan"
                  :disabled="false"
                />
              </div>
            </div>

            <!-- Bahagian B: Maklumat Sekolah/Institusi -->
            <div
              v-if="getCurrentTanggungan().masih_bersekolah === 'Y'"
              class="mb-6"
            >
              <h5 class="text-md font-medium mb-3">
                Maklumat Sekolah/Institusi
              </h5>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Jenis Sekolah/Institusi -->
                <FormKit
                  type="select"
                  name="jenis_sekolah_institusi"
                  label="Jenis Sekolah/Institusi"
                  placeholder="Pilih jenis sekolah/institusi"
                  :options="[
                    'Pra Sekolah',
                    'SRK',
                    'SMK',
                    'Sekolah Agama',
                    'Gabungan SRK & Agama',
                    'IPTA',
                    'IPTS',
                    'Maahad Tahfiz',
                  ]"
                  v-model="getCurrentTanggungan().jenis_sekolah_institusi"
                  :disabled="false"
                />

                <!-- Kategori Sekolah/Institusi -->
                <FormKit
                  type="select"
                  name="kategori_sekolah_institusi"
                  label="Kategori Sekolah/Institusi"
                  placeholder="Pilih kategori sekolah/institusi"
                  :options="['SEK.MEN', 'SRK', 'IPTA', 'IPTS', 'SRA', 'KAFA']"
                  v-model="getCurrentTanggungan().kategori_sekolah_institusi"
                  :disabled="false"
                />
              </div>

              <!-- Conditional fields based on Kategori Sekolah -->
              <div
                v-if="getCurrentTanggungan().kategori_sekolah_institusi"
                class="mt-4"
              >
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- Tahun Bersekolah -->
                  <FormKit
                    type="text"
                    name="tahun_bersekolah"
                    label="Tahun Bersekolah (YYYY)"
                    placeholder="Contoh: 2024"
                    v-model="getCurrentTanggungan().tahun_bersekolah"
                    :disabled="false"
                  />

                  <!-- Tahun/Tingkatan/Tahun Pengajian/Semester -->
                  <FormKit
                    type="text"
                    name="tahun_tingkatan_pengajian"
                    label="Tahun/Tingkatan/Tahun Pengajian/Semester"
                    placeholder="Contoh: Tingkatan 3 / Tahun 2 / Semester 1"
                    v-model="getCurrentTanggungan().tahun_tingkatan_pengajian"
                    :disabled="false"
                  />

                  <!-- Nama Sekolah/Institusi -->
                  <FormKit
                    type="text"
                    name="nama_sekolah_institusi"
                    label="Nama Sekolah/Institusi"
                    placeholder="Masukkan nama sekolah/institusi"
                    v-model="getCurrentTanggungan().nama_sekolah_institusi"
                    :disabled="false"
                  />

                  <!-- Alamat 1 -->
                  <FormKit
                    type="text"
                    name="alamat1_sekolah"
                    label="Alamat 1"
                    placeholder="Masukkan alamat sekolah/institusi"
                    v-model="getCurrentTanggungan().alamat1_sekolah"
                    :disabled="false"
                  />

                  <!-- Alamat 2 -->
                  <FormKit
                    v-if="getCurrentTanggungan().alamat1_sekolah"
                    type="text"
                    name="alamat2_sekolah"
                    label="Alamat 2"
                    placeholder="Masukkan alamat tambahan (jika ada)"
                    v-model="getCurrentTanggungan().alamat2_sekolah"
                    :disabled="false"
                  />

                  <!-- Alamat 3 -->
                  <FormKit
                    v-if="getCurrentTanggungan().alamat1_sekolah"
                    type="text"
                    name="alamat3_sekolah"
                    label="Alamat 3"
                    placeholder="Masukkan alamat tambahan (jika ada)"
                    v-model="getCurrentTanggungan().alamat3_sekolah"
                    :disabled="false"
                  />

                  <!-- Daerah -->
                  <FormKit
                    type="text"
                    name="daerah_sekolah"
                    label="Daerah"
                    placeholder="Masukkan daerah"
                    v-model="getCurrentTanggungan().daerah_sekolah"
                    :disabled="false"
                  />

                  <!-- Bandar -->
                  <FormKit
                    type="text"
                    name="bandar_sekolah"
                    label="Bandar"
                    placeholder="Masukkan bandar"
                    v-model="getCurrentTanggungan().bandar_sekolah"
                    :disabled="false"
                  />

                  <!-- Poskod -->
                  <FormKit
                    type="text"
                    name="poskod_sekolah"
                    label="Poskod"
                    placeholder="Masukkan poskod"
                    v-model="getCurrentTanggungan().poskod_sekolah"
                    :disabled="false"
                  />
                </div>
              </div>
            </div>

            <!-- Bahagian C: Tempat Tinggal Semasa Belajar -->
            <div
              v-if="getCurrentTanggungan().masih_bersekolah === 'Y'"
              class="mb-6"
            >
              <h5 class="text-md font-medium mb-3">
                Tempat Tinggal Semasa Belajar
              </h5>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Tinggal Bersama Keluarga? -->
                <FormKit
                  type="radio"
                  name="tinggal_bersama_keluarga"
                  label="Tinggal Bersama Keluarga?"
                  :options="[
                    { label: 'Ya', value: 'Y' },
                    { label: 'Tidak', value: 'T' },
                  ]"
                  v-model="getCurrentTanggungan().tinggal_bersama_keluarga"
                  :disabled="false"
                />

                <!-- Asrama/Rumah Sewa -->
                <FormKit
                  v-if="getCurrentTanggungan().tinggal_bersama_keluarga === 'T'"
                  type="text"
                  name="asrama_rumah_sewa"
                  label="Asrama/Rumah Sewa"
                  placeholder="Masukkan maklumat asrama/rumah sewa"
                  v-model="getCurrentTanggungan().asrama_rumah_sewa"
                  :disabled="false"
                />
              </div>
            </div>

            <!-- Bahagian D: Pengajian Tinggi -->
            <div
              v-if="getCurrentTanggungan().masih_bersekolah === 'Y'"
              class="mb-6"
            >
              <h5 class="text-md font-medium mb-3">Pengajian Tinggi</h5>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Bidang/Kursus Pengajian -->
                <FormKit
                  type="select"
                  name="bidang_kursus_pengajian"
                  label="Bidang/Kursus Pengajian"
                  placeholder="Pilih bidang/kursus pengajian"
                  :options="['Sijil', 'SKM', 'Diploma', 'Ijazah Sarjana Muda']"
                  v-model="getCurrentTanggungan().bidang_kursus_pengajian"
                  :disabled="false"
                />

                <!-- Jurusan/Bidang -->
                <FormKit
                  v-if="getCurrentTanggungan().bidang_kursus_pengajian"
                  type="text"
                  name="jurusan_bidang"
                  label="Jurusan/Bidang"
                  placeholder="Masukkan jurusan/bidang pengajian"
                  v-model="getCurrentTanggungan().jurusan_bidang"
                  :disabled="false"
                />
              </div>

              <!-- Pembiayaan Pengajian -->
              <div class="mt-4">
                <FormKit
                  type="checkbox"
                  name="pembiayaan_pengajian"
                  label="Pembiayaan Pengajian"
                  :options="['JPA', 'PTPTN', 'LZS', 'Tiada', 'Lain-lain']"
                  v-model="getCurrentTanggungan().pembiayaan_pengajian"
                  :disabled="false"
                />
              </div>

              <!-- Lain-lain Pembiayaan Pengajian -->
              <div
                v-if="
                  getCurrentTanggungan().pembiayaan_pengajian &&
                  getCurrentTanggungan().pembiayaan_pengajian.includes(
                    'Lain-lain'
                  )
                "
                class="mt-4"
              >
                <FormKit
                  type="text"
                  name="lain_pembiayaan_pengajian"
                  label="Lain-lain Pembiayaan Pengajian"
                  placeholder="Sila nyatakan pembiayaan lain"
                  v-model="getCurrentTanggungan().lain_pembiayaan_pengajian"
                  :disabled="false"
                />
              </div>

              <!-- Catatan -->
              <div class="mt-4">
                <FormKit
                  type="textarea"
                  name="catatan_pendidikan_tanggungan"
                  label="Catatan"
                  placeholder="Masukkan catatan tambahan (jika ada)"
                  rows="3"
                  v-model="getCurrentTanggungan().catatan_pendidikan_tanggungan"
                  :disabled="false"
                />
              </div>
            </div>
          </div>

          <div class="flex justify-between gap-3 mt-6">
            <rs-button
              type="button"
              variant="primary-outline"
              @click="prevStepB"
              >Kembali</rs-button
            >
            <div class="flex gap-3">
              <rs-button
                type="button"
                variant="secondary"
                @click="handleSaveStepB4"
                >Simpan</rs-button
              >
              <rs-button type="submit" variant="primary" @click="nextStepB"
                >Seterusnya ke Maklumat Kesihatan Tanggungan</rs-button
              >
            </div>
          </div>
        </FormKit>

        <!-- Section B Form - Step 5: Maklumat Kesihatan Tanggungan -->
        <FormKit
          v-if="currentStepB === 5"
          type="form"
          @submit="nextStepB"
          :actions="false"
          id="sectionB5"
        >
          <!-- V. Maklumat Kesihatan Tanggungan -->
          <div class="mb-6">
            <h4 class="font-medium mb-3">5. Maklumat Kesihatan  </h4>

            <!-- 1. Tahap Kesihatan -->
            <div class="mb-6">
              <h5 class="text-md font-medium mb-3">Tahap Kesihatan</h5>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormKit
                  type="select"
                  name="tahap_kesihatan_tanggungan"
                  label="Tahap Kesihatan *"
                  placeholder="Pilih tahap kesihatan"
                  :options="['Sihat', 'Sakit Kronik', 'OKU', 'Uzur']"
                  validation="required"
                  validation-label="Tahap Kesihatan"
                  v-model="getCurrentTanggungan().tahap_kesihatan_tanggungan"
                />
              </div>
            </div>

            <!-- 2. Sakit Kronik (Jika Tahap Kesihatan = Sakit Kronik) -->
            <div
              v-if="
                getCurrentTanggungan().tahap_kesihatan_tanggungan ===
                'Sakit Kronik'
              "
              class="mb-6"
            >
              <h5 class="text-md font-medium mb-3">Sakit Kronik</h5>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Keadaan Kesihatan -->
                <FormKit
                  type="select"
                  name="keadaan_kesihatan_sakit_tanggungan"
                  label="Keadaan Kesihatan *"
                  placeholder="Pilih keadaan kesihatan"
                  :options="['Terlantar', 'Tidak Terlantar']"
                  validation="required"
                  validation-label="Keadaan Kesihatan"
                  v-model="
                    getCurrentTanggungan().keadaan_kesihatan_sakit_tanggungan
                  "
                />

                <!-- Kos Penjagaan -->
                <FormKit
                  type="select"
                  name="kos_penjagaan_sakit_tanggungan"
                  label="Kos Penjagaan *"
                  placeholder="Pilih kos penjagaan"
                  :options="['Berbayar', 'Tidak Berbayar']"
                  validation="required"
                  validation-label="Kos Penjagaan"
                  v-model="
                    getCurrentTanggungan().kos_penjagaan_sakit_tanggungan
                  "
                />

                <!-- Jumlah Perbelanjaan Bulanan (RM) -->
                <FormKit
                  type="number"
                  name="perbelanjaan_bulanan_sakit_tanggungan"
                  label="Jumlah Perbelanjaan Bulanan (RM) *"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  validation="required"
                  validation-label="Jumlah Perbelanjaan Bulanan"
                  v-model="
                    getCurrentTanggungan().perbelanjaan_bulanan_sakit_tanggungan
                  "
                />
              </div>
            </div>

            <!-- 3. OKU (Jika Tahap Kesihatan = OKU) -->
            <div
              v-if="getCurrentTanggungan().tahap_kesihatan_tanggungan === 'OKU'"
              class="mb-6"
            >
              <h5 class="text-md font-medium mb-3">OKU</h5>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Kesempurnaan Fizikal -->
                <FormKit
                  type="select"
                  name="kesempurnaan_fizikal_tanggungan"
                  label="Kesempurnaan Fizikal *"
                  placeholder="Pilih kesempurnaan fizikal"
                  :options="['Sempurna', 'Cacat Mental', 'Cacat Fizikal']"
                  validation="required"
                  validation-label="Kesempurnaan Fizikal"
                  v-model="
                    getCurrentTanggungan().kesempurnaan_fizikal_tanggungan
                  "
                />

                <!-- Sebab Kecacatan (Jika Cacat) -->
                <FormKit
                  v-if="
                    getCurrentTanggungan().kesempurnaan_fizikal_tanggungan &&
                    getCurrentTanggungan().kesempurnaan_fizikal_tanggungan !==
                      'Sempurna'
                  "
                  type="select"
                  name="sebab_kecacatan_tanggungan"
                  label="Sebab Kecacatan (Jika Cacat) *"
                  placeholder="Pilih sebab kecacatan"
                  :options="['Sejak Lahir', 'Musibah']"
                  validation="required"
                  validation-label="Sebab Kecacatan"
                  v-model="getCurrentTanggungan().sebab_kecacatan_tanggungan"
                />

                <!-- Tahap Kecacatan -->
                <FormKit
                  v-if="
                    getCurrentTanggungan().kesempurnaan_fizikal_tanggungan &&
                    getCurrentTanggungan().kesempurnaan_fizikal_tanggungan !==
                      'Sempurna'
                  "
                  type="select"
                  name="tahap_kecacatan_tanggungan"
                  label="Tahap Kecacatan *"
                  placeholder="Pilih tahap kecacatan"
                  :options="['Terlantar', 'Tidak Terlantar']"
                  validation="required"
                  validation-label="Tahap Kecacatan"
                  v-model="getCurrentTanggungan().tahap_kecacatan_tanggungan"
                />

                <!-- Jumlah Perbelanjaan Bulanan (RM) -->
                <FormKit
                  type="number"
                  name="perbelanjaan_bulanan_oku_tanggungan"
                  label="Jumlah Perbelanjaan Bulanan (RM) *"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  validation="required"
                  validation-label="Jumlah Perbelanjaan Bulanan"
                  v-model="
                    getCurrentTanggungan().perbelanjaan_bulanan_oku_tanggungan
                  "
                />
              </div>
            </div>

            <!-- 4. Uzur (Jika Tahap Kesihatan = Uzur) -->
            <div
              v-if="
                getCurrentTanggungan().tahap_kesihatan_tanggungan === 'Uzur'
              "
              class="mb-6"
            >
              <h5 class="text-md font-medium mb-3">Uzur</h5>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Keadaan Kesihatan -->
                <FormKit
                  type="select"
                  name="keadaan_kesihatan_uzur_tanggungan"
                  label="Keadaan Kesihatan *"
                  placeholder="Pilih keadaan kesihatan"
                  :options="['Terlantar', 'Tidak Terlantar']"
                  validation="required"
                  validation-label="Keadaan Kesihatan"
                  v-model="
                    getCurrentTanggungan().keadaan_kesihatan_uzur_tanggungan
                  "
                />

                <!-- Kos Penjagaan -->
                <FormKit
                  type="select"
                  name="kos_penjagaan_uzur_tanggungan"
                  label="Kos Penjagaan *"
                  placeholder="Pilih kos penjagaan"
                  :options="['Berbayar', 'Tidak Berbayar']"
                  validation="required"
                  validation-label="Kos Penjagaan"
                  v-model="getCurrentTanggungan().kos_penjagaan_uzur_tanggungan"
                />

                <!-- Jumlah Perbelanjaan Bulanan (RM) -->
                <FormKit
                  type="number"
                  name="perbelanjaan_bulanan_uzur_tanggungan"
                  label="Jumlah Perbelanjaan Bulanan (RM) *"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  validation="required"
                  validation-label="Jumlah Perbelanjaan Bulanan"
                  v-model="
                    getCurrentTanggungan().perbelanjaan_bulanan_uzur_tanggungan
                  "
                />
              </div>
            </div>

            <!-- 5. Dokumen Sokongan Kesihatan -->
            <div
              v-if="
                getCurrentTanggungan().tahap_kesihatan_tanggungan &&
                getCurrentTanggungan().tahap_kesihatan_tanggungan !== 'Sihat'
              "
              class="mb-6"
            >
              <h5 class="text-md font-medium mb-3">
                Dokumen Sokongan Kesihatan
              </h5>
              <div class="grid grid-cols-1 gap-4">
                <!-- Dokumen Sakit Kronik -->
                <FormKit
                  v-if="
                    getCurrentTanggungan().tahap_kesihatan_tanggungan ===
                    'Sakit Kronik'
                  "
                  type="file"
                  name="dokumen_sakit_kronik_tanggungan"
                  label="Upload Dokumen Sakit Kronik *"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  help="Format yang dibenarkan: PDF, JPG, PNG. Saiz maksimum: 5MB setiap fail"
                  validation="required|max:5|mime:application/pdf,image/jpeg,image/png"
                  validation-label="Dokumen Sakit Kronik"
                  validation-messages="{
                    required: 'Sila muat naik dokumen sokongan sakit kronik',
                    max: 'Saiz fail tidak boleh melebihi 5MB',
                    mime: 'Format fail tidak dibenarkan'
                  }"
                />

                <!-- Dokumen OKU -->
                <FormKit
                  v-if="
                    getCurrentTanggungan().tahap_kesihatan_tanggungan === 'OKU'
                  "
                  type="file"
                  name="dokumen_oku_tanggungan"
                  label="Upload Dokumen OKU *"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  help="Format yang dibenarkan: PDF, JPG, PNG. Saiz maksimum: 5MB setiap fail"
                  validation="required|max:5|mime:application/pdf,image/jpeg,image/png"
                  validation-label="Dokumen OKU"
                  validation-messages="{
                    required: 'Sila muat naik dokumen sokongan OKU',
                    max: 'Saiz fail tidak boleh melebihi 5MB',
                    mime: 'Format fail tidak dibenarkan'
                  }"
                />

                <!-- Dokumen Uzur -->
                <FormKit
                  v-if="
                    getCurrentTanggungan().tahap_kesihatan_tanggungan === 'Uzur'
                  "
                  type="file"
                  name="dokumen_uzur_tanggungan"
                  label="Upload Dokumen Uzur *"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  help="Format yang dibenarkan: PDF, JPG, PNG. Saiz maksimum: 5MB setiap fail"
                  validation="required|max:5|mime:application/pdf,image/jpeg,image/png"
                  validation-label="Dokumen Uzur"
                  validation-messages="{
                    required: 'Sila muat naik dokumen sokongan uzur',
                    max: 'Saiz fail tidak boleh melebihi 5MB',
                    mime: 'Format fail tidak dibenarkan'
                  }"
                />
              </div>
            </div>
          </div>

          <div class="flex justify-between gap-3 mt-6">
            <rs-button
              type="button"
              variant="primary-outline"
              @click="prevStepB"
              >Kembali</rs-button
            >
            <div class="flex gap-3">
              <rs-button
                type="button"
                variant="secondary"
                @click="handleSaveStepB5"
                >Simpan</rs-button
              >
              <rs-button type="submit" variant="primary" @click="nextStepB"
                >Seterusnya ke Maklumat Kemahiran Tanggungan</rs-button
              >
            </div>
          </div>
        </FormKit>

        <!-- Section B Form - Step 6: Maklumat Kemahiran Tanggungan -->
        <FormKit
          v-if="currentStepB === 6"
          type="form"
          @submit="nextStepB"
          :actions="false"
          id="sectionB6"
        >
          <!-- VI. Maklumat Kemahiran Tanggungan -->
          <div class="mb-6">
            <h4 class="font-medium mb-3">6. Maklumat Kemahiran </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="block text-sm font-medium text-black-700"
                  >Kemahiran</label
                >
                <FormKit
                  type="checkbox"
                  name="kemahiran_tanggungan"
                  :options="[
                    'Nelayan',
                    'Penternakan',
                    'Pertanian',
                    'Menjahit',
                    'Kraftangan',
                    'Memasak',
                    'Mengasuh',
                    'Perkhidmatan',
                    'Pertukangan',
                    'Perniagaan',
                    'Lain-lain',
                  ]"
                  validation="required"
                  v-model="getCurrentTanggungan().kemahiran_tanggungan"
                />
              </div>
            </div>
          </div>

          <FormKit
            type="text"
            name="lain_kemahiran_tanggungan"
            label="Lain-lain Kemahiran"
            placeholder="Sila nyatakan kemahiran lain"
            v-if="
              getCurrentTanggungan().kemahiran_tanggungan &&
              getCurrentTanggungan().kemahiran_tanggungan.includes('Lain-lain')
            "
            v-model="getCurrentTanggungan().lain_kemahiran_tanggungan"
          />

          <div class="flex justify-between gap-3 mt-6">
            <rs-button
              type="button"
              variant="primary-outline"
              @click="prevStepB"
              >Kembali</rs-button
            >
            <div class="flex gap-3">
              <rs-button
                type="button"
                variant="secondary"
                @click="handleSaveStepB6"
                >Simpan</rs-button
              >
              <rs-button type="submit" variant="primary" @click="nextStepB"
                >Seterusnya ke Maklumat Pekerjaan</rs-button
              >
            </div>
          </div>
        </FormKit>

        <!-- Section B Form - Step 7: Maklumat Pekerjaan Tanggungan -->
        <FormKit
          v-if="currentStepB === 7"
          type="form"
          @submit="nextStepB"
          :actions="false"
          id="sectionB7"
        >
          <!-- VII. Maklumat Pekerjaan Tanggungan -->
          <div class="mb-6">
            <h4 class="font-medium mb-3">7. Maklumat Pekerjaan</h4>

            <!-- 1. Pekerjaan (Wajib) -->
            <div class="mb-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-black-700"
                    >Pekerjaan</label
                  >
                  <FormKit
                    type="radio"
                    name="pekerjaan_status_tanggungan"
                    :options="[
                      { label: 'Bekerja', value: 'Bekerja' },
                      { label: 'Tidak Bekerja', value: 'Tidak Bekerja' },
                    ]"
                    validation="required"
                    validation-label="Status pekerjaan"
                    v-model="getCurrentTanggungan().pekerjaan_status"
                  />
                </div>
              </div>
            </div>

            <!-- 2. Sumber Pendapatan -->
            <div
              v-if="getCurrentTanggungan().pekerjaan_status === 'Bekerja'"
              class="mb-6"
            >
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-black-700"
                    >Sumber Pendapatan</label
                  >
                  <FormKit
                    type="checkbox"
                    name="sumber_pendapatan_tanggungan"
                    :options="[
                      { label: 'Pengajian', value: 'Pengajian' },
                      {
                        label: 'Sumbangan Keluarga',
                        value: 'Sumbangan Keluarga',
                      },
                      {
                        label: 'Individu / Institusi',
                        value: 'Individu / Institusi',
                      },
                      { label: 'Sumbangan Agensi', value: 'Sumbangan Agensi' },
                      { label: 'Lain-lain', value: 'Lain-lain' },
                    ]"
                    validation="required|min:1"
                    validation-label="Sumber pendapatan"
                    validation-messages="{
                    required: 'Sila pilih sekurang-kurangnya satu sumber pendapatan',
                    min: 'Sila pilih sekurang-kurangnya satu sumber pendapatan'
                  }"
                    v-model="getCurrentTanggungan().sumber_pendapatan"
                  />
                </div>
              </div>

              <!-- 2.1 Lain-lain Sumber Pendapatan -->
              <div
                v-if="
                  getCurrentTanggungan().sumber_pendapatan &&
                  getCurrentTanggungan().sumber_pendapatan.includes('Lain-lain')
                "
                class="mt-4"
              >
                <FormKit
                  type="text"
                  name="lain_lain_sumber_pendapatan_tanggungan"
                  label="Lain-lain Sumber Pendapatan *"
                  placeholder="Sila nyatakan sumber pendapatan lain"
                  validation="required"
                  validation-label="Lain-lain sumber pendapatan"
                  v-model="getCurrentTanggungan().lain_lain_sumber_pendapatan"
                />
              </div>
            </div>

            <!-- 3. Butiran Pekerjaan -->
            <div
              v-if="getCurrentTanggungan().pekerjaan_status === 'Bekerja'"
              class="mb-6"
            >
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- 3.1 Jenis Pekerjaan -->
                <FormKit
                  type="text"
                  name="jenis_pekerjaan_tanggungan"
                  label="Jenis Pekerjaan *"
                  placeholder="Contoh: Kerani, Jurutera, Guru"
                  validation="required"
                  validation-label="Jenis pekerjaan"
                  v-model="getCurrentTanggungan().jenis_pekerjaan"
                />

                <!-- 3.2 Sektor Pekerjaan -->
                <FormKit
                  type="select"
                  name="sektor_pekerjaan_tanggungan"
                  label="Sektor Pekerjaan *"
                  placeholder="Pilih sektor pekerjaan"
                  :options="[
                    { label: 'Kerajaan', value: 'Kerajaan' },
                    { label: 'Swasta', value: 'Swasta' },
                    { label: 'Badan Berkanun', value: 'Badan Berkanun' },
                    { label: 'Kerja Sendiri', value: 'Kerja Sendiri' },
                  ]"
                  validation="required"
                  validation-label="Sektor pekerjaan"
                  v-model="getCurrentTanggungan().sektor_pekerjaan"
                />

                <!-- 3.2.1 Lain-lain Sektor Pekerjaan -->
                <div
                  v-if="
                    getCurrentTanggungan().sektor_pekerjaan === 'Kerja Sendiri'
                  "
                  class="md:col-span-2"
                >
                  <FormKit
                    type="text"
                    name="lain_lain_sektor_pekerjaan_tanggungan"
                    label="Lain-lain Sektor Pekerjaan *"
                    placeholder="Sila nyatakan sektor pekerjaan lain"
                    validation="required"
                    validation-label="Lain-lain sektor pekerjaan"
                    v-model="getCurrentTanggungan().lain_lain_sektor_pekerjaan"
                  />
                </div>
              </div>
            </div>

            <!-- 4. Maklumat Majikan -->
            <!-- <div
              v-if="getCurrentTanggungan().pekerjaan_status === 'Bekerja'"
              class="mb-6"
            >
              <h5 class="font-medium mb-3">Maklumat Majikan</h5>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormKit
                  type="text"
                  name="no_telefon_pejabat_tanggungan"
                  label="No Telefon Pejabat *"
                  placeholder="Contoh: 038881234"
                  validation="required"
                  validation-label="No telefon pejabat"
                  v-model="getCurrentTanggungan().no_telefon_pejabat"
                />

                <FormKit
                  type="text"
                  name="nama_majikan_tanggungan"
                  label="Nama Majikan *"
                  placeholder="Nama syarikat atau majikan"
                  validation="required"
                  validation-label="Nama majikan"
                  v-model="getCurrentTanggungan().nama_majikan"
                />

                <FormKit
                  type="text"
                  name="no_tel_majikan_tanggungan"
                  label="No Tel Majikan *"
                  placeholder="Contoh: 038881234"
                  validation="required"
                  validation-label="No tel majikan"
                  v-model="getCurrentTanggungan().no_tel_majikan"
                />

                <FormKit
                  type="text"
                  name="alamat_majikan_1_tanggungan"
                  label="Alamat Majikan 1 *"
                  placeholder="Alamat baris 1"
                  validation="required"
                  validation-label="Alamat majikan 1"
                  v-model="getCurrentTanggungan().alamat_majikan_1"
                />

                <FormKit
                  type="text"
                  name="alamat_majikan_2_tanggungan"
                  label="Alamat Majikan 2"
                  placeholder="Alamat baris 2 (pilihan)"
                  v-model="getCurrentTanggungan().alamat_majikan_2"
                />

                <FormKit
                  type="text"
                  name="alamat_majikan_3_tanggungan"
                  label="Alamat Majikan 3"
                  placeholder="Alamat baris 3 (pilihan)"
                  v-model="getCurrentTanggungan().alamat_majikan_3"
                />

                <FormKit
                  type="text"
                  name="bandar_majikan_tanggungan"
                  label="Bandar *"
                  placeholder="Nama bandar"
                  validation="required"
                  validation-label="Bandar"
                  v-model="getCurrentTanggungan().bandar_majikan"
                />

                <FormKit
                  type="text"
                  name="poskod_majikan_tanggungan"
                  label="Poskod *"
                  placeholder="Contoh: 50000"
                  validation="required"
                  validation-label="Poskod"
                  v-model="getCurrentTanggungan().poskod_majikan"
                />

                <FormKit
                  type="text"
                  name="daerah_majikan_tanggungan"
                  label="Daerah *"
                  placeholder="Nama daerah"
                  validation="required"
                  validation-label="Daerah"
                  v-model="getCurrentTanggungan().daerah_majikan"
                />

                <FormKit
                  type="text"
                  name="negeri_majikan_tanggungan"
                  label="Negeri *"
                  placeholder="Nama negeri"
                  validation="required"
                  validation-label="Negeri"
                  v-model="getCurrentTanggungan().negeri_majikan"
                />

                <FormKit
                  type="text"
                  name="negara_majikan_tanggungan"
                  label="Negara *"
                  placeholder="Nama negara"
                  validation="required"
                  validation-label="Negara"
                  v-model="getCurrentTanggungan().negara_majikan"
                />
              </div>
            </div> -->

            <!-- 5. Jawatan & Status -->
            <!-- <div
              v-if="getCurrentTanggungan().pekerjaan_status === 'Bekerja'"
              class="mb-6"
            >
              <h5 class="font-medium mb-3">Jawatan & Status</h5>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormKit
                  type="text"
                  name="jawatan_tanggungan"
                  label="Jawatan *"
                  placeholder="Contoh: Kerani, Jurutera, Guru"
                  validation="required"
                  validation-label="Jawatan"
                  v-model="getCurrentTanggungan().jawatan"
                />

                <FormKit
                  type="select"
                  name="status_jawatan_tanggungan"
                  label="Status Jawatan *"
                  placeholder="Pilih status jawatan"
                  :options="[
                    { label: 'Tetap', value: 'Tetap' },
                    { label: 'Kontrak', value: 'Kontrak' },
                    { label: 'Sementara', value: 'Sementara' },
                  ]"
                  validation="required"
                  validation-label="Status jawatan"
                  v-model="getCurrentTanggungan().status_jawatan"
                />
              </div>
            </div> -->

            <!-- 6. Pendapatan -->
            <!-- <div
              v-if="getCurrentTanggungan().pekerjaan_status === 'Bekerja'"
              class="mb-6"
            >
              <h5 class="font-medium mb-3">Pendapatan</h5>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormKit
                  type="text"
                  name="pendapatan_kasar_tanggungan"
                  label="Pendapatan Kasar (RM) *"
                  placeholder="Contoh: 2500.00"
                  validation="required|number"
                  validation-label="Pendapatan kasar"
                  validation-messages="{
                    required: 'Pendapatan kasar adalah wajib',
                    number: 'Pendapatan kasar mestilah nombor'
                  }"
                  v-model="getCurrentTanggungan().pendapatan_kasar"
                />

                <FormKit
                  type="file"
                  name="dokumen_pendapatan_tanggungan"
                  label="Upload Dokumen *"
                  accept=".pdf,.jpg,.jpeg,.png"
                  validation="required"
                  validation-label="Dokumen pendapatan"
                  validation-messages="{
                    required: 'Dokumen pendapatan adalah wajib'
                  }"
                  v-model="getCurrentTanggungan().dokumen_pendapatan"
                />
              </div>
            </div> -->
          </div>

          <div class="flex justify-between gap-3 mt-6">
            <div class="flex gap-3">
              <rs-button
                type="button"
                variant="secondary"
                @click="addTanggungan"
              >
                Tambah Tanggungan
              </rs-button>
              <rs-button
                type="button"
                variant="primary-outline"
                @click="prevStepB"
                >Kembali</rs-button
              >
            </div>
            <div class="flex gap-3">
              <rs-button
                type="button"
                variant="secondary"
                @click="handleSaveStepB7"
                >Simpan</rs-button
              >
              <rs-button type="submit" variant="primary" @click="nextStepB"
                >Seterusnya ke Pengesahan</rs-button
              >
            </div>
          </div>
        </FormKit>

        <!-- Section B Form - Step 8: Pengesahan -->
        <FormKit
          v-if="currentStepB === 8"
          type="form"
          @submit="nextStepB"
          :actions="false"
          id="sectionB8"
        >
          <h3 class="text-lg font-semibold mb-4">Maklumat Perakuan Pemohon</h3>

          <div class="mb-6" v-if="screenType === 'selfservice'">
            <h4 class="font-medium mb-3">Bantuan Penolong Amil</h4>
            <div class="flex flex-col gap-2">
              <label class="font-medium"
                >Adakah Penolong Amil membantu semasa pengisian maklumat?</label
              >
              <FormKit
                type="radio"
                name="dibantu_penolong_amil"
                :options="['Ya', 'Tidak']"
                :validation="screenType === 'selfservice' ? 'required' : ''"
                v-model="dibantuPenolongAmil"
              />
            </div>

            <div
              v-if="dibantuPenolongAmil === 'Ya'"
              class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4"
            >
              <FormKit
                type="select"
                name="kariah_bantuan"
                label="Nama Kariah/Institusi"
                :options="kariahOptions"
                placeholder="Pilih kariah"
                :validation="screenType === 'selfservice' ? 'required' : ''"
                v-model="formData.pengesahan.kariah_bantuan"
              />
              <FormKit
                type="select"
                name="nama_penolong_amil_bantuan"
                label="Nama Penolong Amil"
                :options="pakOfficersOptionsBantuan"
                placeholder="Pilih nama penolong amil"
                :validation="screenType === 'selfservice' ? 'required' : ''"
                v-model="formData.pengesahan.nama_penolong_amil_bantuan"
              />

              <FormKit
                type="date"
                name="tarikh_bantuan"
                label="Tarikh Bantuan"
                :validation="screenType === 'selfservice' ? 'required' : ''"
                v-model="formData.pengesahan.tarikh_bantuan"
              />
            </div>
          </div>

          <div class="mb-6">
            <div class="flex flex-col gap-2">
              <label class="font-medium"
                >Hubungan kekeluargaan dengan kakitangan LZS?</label
              >
              <FormKit
                type="radio"
                name="hubungan_kakitangan_lzs"
                :options="['Ya', 'Tidak']"
                validation="required"
                v-model="hubunganKakitanganLZS"
              />
            </div>

            <div
              v-if="hubunganKakitanganLZS === 'Ya'"
              class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4"
            >
              <FormKit
                type="text"
                name="nama_kakitangan"
                label="Nama Kakitangan"
                validation="required"
                v-model="formData.pengesahan.nama_kakitangan"
              />

              <FormKit
                type="text"
                name="jawatan_kakitangan"
                label="Jawatan"
                validation="required"
                v-model="formData.pengesahan.jawatan_kakitangan"
              />

              <FormKit
                type="text"
                name="pejabat_kakitangan"
                label="Pejabat"
                validation="required"
                v-model="formData.pengesahan.pejabat_kakitangan"
              />

              <FormKit
                type="text"
                name="hubungan_kakitangan"
                label="Hubungan"
                validation="required"
                v-model="formData.pengesahan.hubungan_kakitangan"
              />
            </div>

            <div class="flex flex-col gap-2 mt-6">
              <label class="font-medium"
                >Hubungan kekeluargaan dengan Penolong Amil?</label
              >
              <FormKit
                type="radio"
                name="hubungan_penolong_amil"
                :options="['Ya', 'Tidak']"
                validation="required"
                v-model="hubunganPAK"
                @input="formData.pengesahan.hubungan_pak = hubunganPAK"
              />
            </div>

            <div
              v-if="hubunganPAK === 'Ya'"
              class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4"
            >
              <FormKit
                type="select"
                name="kariah_hubungan_pak"
                label="Nama Kariah/Institusi"
                :options="kariahOptions"
                placeholder="Pilih kariah"
                validation="required"
                v-model="formData.pengesahan.kariah_hubungan_pak"
              />

              <FormKit
                type="select"
                name="nama_pak_hubungan"
                label="Nama Penolong Amil"
                :options="pakOfficersOptionsHubungan"
                placeholder="Pilih nama penolong amil"
                validation="required"
                v-model="formData.pengesahan.nama_pak_hubungan"
              />
            </div>
          </div>

          <div class="mb-6">
            <h4 class="font-medium mb-3">Perakuan & Persetujuan</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Card: PDPA Consent -->
              <div
                class="bg-blue-50 border border-blue-200 rounded-lg p-4 h-full flex flex-col justify-between"
              >
                <p class="text-sm leading-relaxed text-gray-800">
                  Dengan nama Allah S.W.T, saya mengesahkan bahawa segala
                  maklumat dan data yang diberikan di dalam Borang Permohonan
                  Agihan dan lampiran adalah BENAR, TEPAT, LENGKAP dan TERKINI.
                  Saya dengan ini bersetuju memberi persetujuan secara nyata
                  (explicit consent) kepada Zakat Selangor untuk mengumpul,
                  memproses, menggunakan data peribadi saya dan tanggungan saya
                  (jika ada) bagi tujuan pentadbiran, kajian, dakwah, promosi
                  dan aktiviti-aktiviti lain berkaitan fungsi Zakat Selangor
                  seperti yang dinyatakan di dalam Notis Privasi Zakat Selangor
                  di https://www.zakatselangor.com.my. Saya juga telah
                  mendapatkan persetujuan daripada pihak ketiga berhubung dengan
                  data dan maklumat pihak ketiga yang akan diserahkan kepada
                  pihak Zakat Selangor.
                </p>
                <div class="mt-4">
                  <label class="font-medium">Saya setuju</label>
                  <FormKit
                    type="checkbox"
                    name="pdpa_consent"
                    :value="true"
                    validation="required"
                    v-model="formData.pengesahan.pdpa_consent"
                  />
                </div>
              </div>

              <!-- Card: Income Confirmation Consent -->
              <div
                class="bg-blue-50 border border-blue-200 rounded-lg p-4 h-full flex flex-col justify-between"
              >
                <p class="text-sm leading-relaxed text-gray-800">
                  Dengan nama Allah S.W.T, saya mengesahkan bahawa segala
                  maklumat dan data yang diberikan di dalam Borang Permohonan
                  dan lampiran adalah BENAR, TEPAT, LENGKAP dan TERKINI.
                </p>
                <div class="mt-4">
                  <label class="font-medium">Saya setuju</label>
                  <FormKit
                    type="checkbox"
                    name="pendapatan_consent"
                    :value="true"
                    validation="required"
                    v-model="formData.pengesahan.pendapatan_consent"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="mb-6">
            <FormKit
              type="date"
              name="tarikh_perakuan"
              label="Tarikh Perakuan"
              validation="required"
              :readonly="true"
              v-model="formData.pengesahan.tarikh_perakuan"
            />
          </div>
          <div class="flex justify-between gap-3 mt-6">
            <rs-button
              type="button"
              variant="primary-outline"
              @click="prevStepB"
              >Kembali</rs-button
            >
            <div class="flex gap-3">
              <rs-button
                type="button"
                variant="secondary"
                @click="handleSaveStepB8"
                >Simpan</rs-button
              >
              <rs-button type="submit" variant="primary" @click="nextStepB"
                >Seterusnya ke Pengesahan Pendapatan</rs-button
              >
            </div>
          </div>
        </FormKit>

        <!-- Section B Form - Step 9: Pengesahan Pendapatan -->
        <FormKit
          v-if="currentStepB === 9"
          type="form"
          @submit="nextStepB"
          :actions="false"
          id="sectionB9"
        >
          <h3 class="text-lg font-semibold mb-4">Pengesahan Pendapatan</h3>

          <!--Maklumat Penolong Amil yang membuat pengesahan pendapatan -->
          <div class="mb-6">
            <h4 class="font-medium mb-3">
              Maklumat Penolong Amil yang membuat pengesahan pendapatan(pemohon)
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit
                type="text"
                name="nama_penolong_amil_pendapatan"
                label="Nama "
                validation="required"
                v-model="formData.pengesahan_pendapatan.nama_penolong_amil"
              />

              <FormKit
                type="text"
                name="jawatan_penolong_amil_pendapatan"
                label="Jawatan"
                validation="required"
                v-model="formData.pengesahan_pendapatan.jawatan_penolong_amil"
              />

              <FormKit
                type="text"
                name="no_telefon_penolong_amil_pendapatan"
                label="No Telefon"
                validation="required"
                v-model="
                  formData.pengesahan_pendapatan.no_telefon_penolong_amil
                "
              />

              <FormKit
                type="date"
                name="tarikh_pengesahan_pendapatan"
                label="Tarikh Pengesahan"
                validation="required"
                v-model="
                  formData.pengesahan_pendapatan.tarikh_pengesahan_pendapatan
                "
              />

              <FormKit
                type="file"
                name="dokumen_pengesahan_pendapatan"
                label="Dokumen pengesahan yang diupload"
                accept=".pdf,.jpg,.jpeg,.png"
                help="Format yang dibenarkan: PDF, JPG, PNG. Saiz maksimum: 5MB"
                validation="required|max:5|mime:application/pdf,image/jpeg,image/png"
                v-model="
                  formData.pengesahan_pendapatan.dokumen_pengesahan_pendapatan
                "
              />
            </div>
          </div>

          <!-- Pegawai LZS yang membuat pengesahan pendapatan -->
          <div class="mb-6">
            <h4 class="font-medium mb-3">
              Pegawai LZS perlu memasukkan nama pegawai yang membuat pengesahan
              pendapatan(pendaftar)
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit
                type="text"
                name="nama_pegawai_lzs_pendapatan"
                label="Nama"
                validation="required"
                v-model="formData.pengesahan_pendapatan.nama_pegawai_lzs"
              />

              <FormKit
                type="text"
                name="jawatan_pegawai_lzs_pendapatan"
                label="Jawatan"
                validation="required"
                v-model="formData.pengesahan_pendapatan.jawatan_pegawai_lzs"
              />

              <FormKit
                type="text"
                name="no_telefon_pegawai_lzs_pendapatan"
                label="No Telefon"
                validation="required"
                v-model="formData.pengesahan_pendapatan.no_telefon_pegawai_lzs"
              />

              <FormKit
                type="date"
                name="tarikh_pengesahan_pegawai_lzs_pendapatan"
                label="Tarikh Pengesahan"
                validation="required"
                v-model="
                  formData.pengesahan_pendapatan.tarikh_pengesahan_pegawai_lzs
                "
              />

              <FormKit
                type="file"
                name="dokumen_pengesahan_pegawai_lzs_pendapatan"
                label="Upload Dokumen pengesahan"
                accept=".pdf,.jpg,.jpeg,.png"
                help="Format yang dibenarkan: PDF, JPG, PNG. Saiz maksimum: 5MB"
                validation="required|max:5|mime:application/pdf,image/jpeg,image/png"
                v-model="
                  formData.pengesahan_pendapatan.dokumen_pengesahan_pegawai_lzs
                "
              />
            </div>
          </div>

          <div class="flex justify-between gap-3 mt-6">
            <rs-button
              type="button"
              variant="primary-outline"
              @click="prevStepB"
              >Kembali</rs-button
            >
            <div class="flex gap-3">
              <rs-button
                type="button"
                variant="secondary"
                @click="handleSaveStepB9"
                >Simpan</rs-button
              >
              <rs-button type="submit" variant="primary" @click="nextStepB"
                >Seterusnya ke Pengesahan Bermastautin</rs-button
              >
            </div>
          </div>
        </FormKit>

        <!-- Section B Form - Step 10: Pengesahan Bermastautin -->
        <FormKit
          v-if="currentStepB === 10"
          type="form"
          @submit="nextStepB"
          :actions="false"
          id="sectionB10"
        >
          <h3 class="text-lg font-semibold mb-4">
            Maklumat Pengesahan Permastautin
          </h3>

          <!-- PAK Officer Information (Readonly) -->
          <h4 class="font-medium mb-3">
            Maklumat Pegawai/Penolong Amil yang Mengesahkan
          </h4>

          <!-- Original Form Fields (Hidden/Readonly) -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormKit
              type="select"
              name="kariah_bermastautin"
              label="Kariah"
              :options="kariahOptions"
              placeholder="Pilih kariah"
              v-model="formData.pengesahan.kariah_bermastautin"
              disabled
            />

            <FormKit
              type="text"
              name="nama_pengesah"
              label="Nama"
              validation="required"
              v-model="formData.pengesahan.nama_pengesah"
              disabled
            />

            <FormKit
              type="text"
              name="jawatan_pengesah"
              label="Jawatan"
              validation="required"
              v-model="formData.pengesahan.jawatan_pengesah"
              disabled
            />

            <FormKit
              type="text"
              name="no_telefon_pengesah"
              label="No Telefon"
              validation="required"
              v-model="formData.pengesahan.no_telefon_pengesah"
              disabled
            />

            <FormKit
              type="date"
              name="tarikh_pengesahan_permastautin"
              label="Tarikh Pengesahan"
              validation="required"
              v-model="formData.pengesahan.tarikh_pengesahan_permastautin"
              disabled
            />

            <!-- Document Information (Readonly) -->
            <div class="mb-6">
              <h4 class="font-medium mb-3">Dokumen yang Dimuat Naik</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  v-for="(doc, index) in uploadedDocuments"
                  :key="index"
                  class="p-4 border rounded-lg flex items-center justify-between bg-white"
                >
                  <div>
                    <p class="font-medium">{{ doc.name }}</p>
                    <p class="text-sm text-gray-500">{{ doc.type }}</p>
                    <p class="text-xs text-gray-400">{{ doc.size }}</p>
                  </div>
                  <rs-button
                    variant="primary-outline"
                    size="sm"
                    @click="downloadDocument(doc)"
                  >
                    <Icon name="mdi:download" class="mr-1" />
                    Muat Turun
                  </rs-button>
                </div>
              </div>
            </div>

            <div class="md:col-span-2">
              <FormKit
                type="file"
                name="surat_pengesahan_bermastautin"
                label="Muat naik dokumen pengesahan bermastautin"
                accept=".pdf,.jpg,.jpeg,.png"
                v-model="formData.pengesahan.surat_pengesahan_bermastautin"
                help="Format yang dibenarkan: PDF, JPG, PNG. Saiz maksimum: 5MB"
                validation="required"
                validation-messages="{
                  required: 'Dokumen pengesahan bermastautin adalah wajib'
                }"
              />
            </div>
          </div>

          <div class="flex justify-between gap-3 mt-6">
            <rs-button
              type="button"
              variant="primary-outline"
              @click="prevStepB"
              >Kembali</rs-button
            >
            <div class="flex gap-3">
              <rs-button
                type="button"
                variant="secondary"
                @click="handleSaveStepB9"
                >Simpan</rs-button
              >
              <rs-button type="submit" variant="primary" @click="nextStepB"
                >Seterusnya ke Pegawai Pendaftar</rs-button
              >
            </div>
          </div>
        </FormKit>

        <!-- Section B Form - Step 11: Pegawai Pendaftar -->
        <FormKit
          v-if="currentStepB === 11"
          type="form"
          @submit="submitForm"
          :actions="false"
          id="sectionB10"
        >
          <h3 class="text-lg font-semibold mb-4">Maklumat Pegawai Pendaftar</h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormKit
              type="text"
              name="nama_penolong_amil"
              label="Nama "
              value="Ahmad bin Abi"
              validation="required"
              disabled
            />

            <FormKit
              type="text"
              name="jenis_permohonan"
              label="Jenis Permohonan"
              value="Baru"
              validation="required"
              disabled
            />
            <FormKit
              type="text"
              name="kategori"
              label="Kategori"
              value="kaunter"
              disabled
            />

            <FormKit
              type="date"
              name="tarikh_proses"
              label="Tarikh Proses"
              validation="required"
              :value="new Date().toISOString().split('T')[0]"
              disabled
            />
          </div>

          <div class="flex justify-between gap-3 mt-6">
            <rs-button
              type="button"
              variant="primary-outline"
              @click="prevStepB"
              >Kembali</rs-button
            >
            <div class="flex gap-3">
              <rs-button
                type="button"
                variant="secondary"
                @click="handleSaveStepB11"
                >Simpan</rs-button
              >
              <rs-button type="submit" variant="primary" @click="handleSubmit"
                >Hantar Permohonan</rs-button
              >
            </div>
          </div>
        </FormKit>
      </template>
    </rs-card>

    <!-- Kursus Modal -->
    <div
      v-if="showKursusModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div
        class="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto"
      >
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold">
            Senarai Kelas Fardu Ain Muallaf (KFAM) Terdekat
          </h3>
          <button
            @click="closeKursusModal"
            class="text-gray-500 hover:text-gray-700"
          >
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>

        <div class="mb-4">
          <p class="text-sm text-gray-600">
            Lokasi:
            <span class="font-medium">{{
              formData.addressInfo.location || "Belum dipilih"
            }}</span>
            | Daerah:
            <span class="font-medium">{{
              selectedDaerah || "Belum dipilih"
            }}</span>
          </p>
        </div>

        <!-- KFAM Classes Table -->
        <div class="overflow-x-auto">
          <table
            class="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden"
          >
            <thead>
              <tr class="bg-gray-50">
                <th
                  class="border border-gray-300 px-4 py-3 text-left font-medium text-gray-700"
                >
                  Nama Pengajar
                </th>
                <th
                  class="border border-gray-300 px-4 py-3 text-left font-medium text-gray-700"
                >
                  No Telefon
                </th>
                <th
                  class="border border-gray-300 px-4 py-3 text-left font-medium text-gray-700"
                >
                  Tempat Mengajar
                </th>
                <th
                  class="border border-gray-300 px-4 py-3 text-left font-medium text-gray-700"
                >
                  Daerah
                </th>
                <th
                  class="border border-gray-300 px-4 py-3 text-left font-medium text-gray-700"
                >
                  Bahasa Penghantar
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="kelas in kfamClassesList"
                :key="kelas.id"
                class="hover:bg-gray-100 cursor-pointer transition-all duration-200 border-l-4 border-l-transparent"
                :class="{
                  'bg-blue-200 border-l-blue-500 shadow-md':
                    selectedKelas?.id === kelas.id,
                }"
                @click="selectKelas(kelas)"
              >
                <td class="border border-gray-300 px-4 py-3">
                  <div class="font-medium">{{ kelas.nama_pengajar }}</div>
                  <div class="text-sm text-gray-600">{{ kelas.kelulusan }}</div>
                </td>
                <td class="border border-gray-300 px-4 py-3">
                  <div class="flex items-center gap-2">
                    <i class="fas fa-phone text-blue-600"></i>
                    <span>{{ kelas.no_telefon }}</span>
                  </div>
                </td>
                <td class="border border-gray-300 px-4 py-3">
                  <div class="font-medium">{{ kelas.tempat_mengajar }}</div>
                  <div class="text-sm text-gray-600">
                    {{ kelas.alamat_tempat }}
                  </div>
                </td>
                <td class="border border-gray-300 px-4 py-3">
                  <span
                    class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {{ kelas.daerah }}
                  </span>
                </td>
                <td class="border border-gray-300 px-4 py-3">
                  <span
                    class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                  >
                    {{ kelas.bahasa_penghantar }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Action Buttons -->
        <div class="mt-6 flex justify-end gap-3">
          <rs-button variant="secondary" @click="closeKursusModal">
            Kembali
          </rs-button>
          <rs-button
            variant="primary"
            @click="confirmKelasSelection"
            :disabled="!selectedKelas"
            class="bg-teal-600 hover:bg-teal-700"
          >
            <i class="fas fa-print mr-2"></i>
            Cetak
          </rs-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useToast } from "vue-toastification";
import { useRouter } from "vue-router";

// ============================================================================
// ROUTER & TOAST SETUP
// ============================================================================
const router = useRouter();
const toast = useToast();

definePageMeta({
  title: "Borang Permohonan Lengkap",
});

// ============================================================================
// BREADCRUMB CONFIGURATION
// ============================================================================
const breadcrumb = ref([
  {
    name: " Pendaftaran Lengkap",
    type: "current",
    path: "/BF-PRF/AS/FR/02",
  },
]);

// ============================================================================
// SECTION & STEP MANAGEMENT
// ============================================================================
const processing = ref(false);
const currentSection = ref(1);

// Section A - Main Form Steps
const currentStepA = ref(1);
const totalStepsA = 13;
const stepsA = [
  { id: 1, label: "Peribadi" },
  { id: 2, label: "Pendidikan" },
  { id: 3, label: "Pengislaman" },
  { id: 4, label: "Perbankan" },
  { id: 5, label: "Kesihatan" },
  { id: 6, label: "Kemahiran" },
  { id: 7, label: "Alamat" },
  { id: 8, label: "Pinjaman Harta" },
  { id: 9, label: "Pemilikan" },
  { id: 10, label: "Pemilikan Barangan Rumah" },
  { id: 11, label: "Pekerjaan" },
  { id: 12, label: "Pendapatan & Perbelanjaan" },
  { id: 13, label: "Waris" },
];

// Section B - Tanggungan Form Steps (11 steps with separate tabs for different info sections)
const currentStepB = ref(1);
const totalStepsB = 11;
const stepsB = [
  { id: 1, label: "Peribadi" },
  { id: 2, label: "Pengislaman" },
  { id: 3, label: "Perbankan" },
  { id: 4, label: "Pendidikan" },
  { id: 5, label: "Kesihatan" },
  { id: 6, label: "Kemahiran" },
  { id: 7, label: "Pekerjaan" },
  { id: 8, label: "Pengesahan" },
  {
    id: 9,
    label: "Pengesahan Pendapatan",
    tooltip:
      "Wakil Rakyat/Penghulu/Ketua Kampung/Ketua Penduduk/Nazir Masjid/Pengerusi Surau/Penolong Amil/Guru Pembimbing Asnaf Muallaf/Eksekutif LZS/Ketua Operasi Agihan Daerah LZS/Ketua Jabatan LZS/Pengurus LZS/Ketua Cawangan LZS",
  },
  { id: 10, label: "Pengesahan Bermastautin" },
  { id: 11, label: "Pegawai Pendaftar" },
];

// ============================================================================
// FORM STATE VARIABLES
// ============================================================================
// Health Status Variables
const healthStatus = ref("");
const healthStatusTanggungan = ref("");

// Relationship Variables
const dibantuPenolongAmil = ref("");
const hubunganKakitanganLZS = ref("");
const hubunganPAK = ref("");
const hubunganPemohon = ref("");

// ID Type Variables
const jenisId = ref(null);
const jenisIdTanggungan = ref("");
const agama = ref("");
const bangsa = ref("");

// Islamic Information Variables
const tarikhMasukIslam = ref(null);
const tarikhMasukIslamTanggungan = ref(null);

// Polygamy Variables
const statusPoligami = ref(null);
const bilanganIsteri = ref(null);
const isteriList = ref([]);

// Payment Variables
const caraPembayaran = ref(null);
const paymentMethod = ref("");

// Modal Variables
const showKursusModal = ref(false);
const selectedKelas = ref(null);

// Employment form reactive variables
const employmentStatus = ref("");
const employmentSector = ref("");
const employmentIncomeSource = ref([]);

// Tanggungan Management Variables
const currentTanggunganIndex = ref(0);
const tanggunganList = ref([]);
const showTanggunganSummary = ref(false);

// Screen context: 'selfservice' or 'pendaftar'
const screenType = ref("pendaftar");

// ============================================================================
// FORM DATA STRUCTURE
// ============================================================================
const formData = ref({
  // Section A - Maklumat Peribadi Asnaf
  jenis_id: "",
  no_pengenalan: "",
  nama: "",
  warganegara: "",
  tarikh_lahir: "",
  umur: "",
  tempat_lahir: "",
  jantina: "",
  agama: "",
  bangsa: "",
  no_telefon_bimbit: "",
  no_telefon_rumah: "",
  emel: "",
  bersekolah: "",
  pendidikan_tertinggi: "",
  status_perkahwinan: "",
  status_poligami: "",
  bilangan_isteri: "",
  isteri_list: [],
  taraf_penduduk: "",
  nopassportlama: "",
  lain_warganegara: "",
  dokumen_id: null,
  agama_lain: "",
  bangsa_lain: "",

  // Section A - Maklumat Pendidikan
  masih_bersekolah: "",
  pendidikan_tertinggi: "",
  lain_pendidikan_tertinggi: "",
  tahap_pendidikan: [],
  lain_tahap_pendidikan: "",
  sijil_pendidikan: null,
  // Multiple education entries (new)
  education_entries: [],
  // Passport dates for foreign IDs (Peribadi)
  passportStartDate: "",
  passportEndDate: "",
  jenis_sekolah: "",
  kategori_sekolah: "",
  tahun_bersekolah: "",
  tahun_tingkatan: "",
  nama_sekolah: "",
  alamat_sekolah_1: "",
  alamat_sekolah_2: "",
  alamat_sekolah_3: "",
  daerah_sekolah: "",
  bandar_sekolah: "",
  poskod_sekolah: "",
  tinggal_bersama_keluarga: "",
  asrama_rumah_sewa: "",
  bidang_kursus: "",
  jurusan_bidang: "",
  pembiayaan_pengajian: [],
  lain_pembiayaan: "",
  catatan_pendidikan: "",

  // Section A - Maklumat Islam
  adakah_muallaf: "",
  tarikh_masuk_islam: "",
  tarikh_masuk_kfam: "",
  nama_selepas_islam: "",
  nama_sebelum_islam: "",
  tarikh_keluar_muallaf: "",
  dokumen_pengislaman: null,

  // Bank Information
  nama_bank: "",
  no_akaun_bank: "",
  nama_pemegang_akaun: "",
  swift_code: "",
  kaedah_pembayaran: "",
  sebab_tiada_akaun: "",
  sebab_tunai: "",
  // Multiple bank accounts (new)
  bank_accounts: [],

  // Section B - Maklumat Kesihatan
  tahap_kesihatan: "",
  keadaan_kesihatan_sakit: "",
  kos_penjagaan_sakit: "",
  perbelanjaan_bulanan_sakit: "",
  kesempurnaan_fizikal: "",
  sebab_kecacatan: "",
  tahap_kecacatan: "",
  perbelanjaan_bulanan_oku: "",
  keadaan_kesihatan_uzur: "",
  kos_penjagaan_uzur: "",
  perbelanjaan_bulanan_uzur: "",
  dokumen_sokongan_kesihatan: null,

  // Section C - Kemahiran
  kemahiran: "",
  lain_lain_kemahiran: "",

  // Section D - Maklumat Pekerjaan
  status_pekerjaan: "",
  jenis_pekerjaan: "",
  sektor_pekerjaan: "",
  lain_lain_sektor: "",
  no_telefon_pejabat: "",
  nama_majikan: "",
  no_telefon_majikan: "",
  alamat_majikan_1: "",
  alamat_majikan_2: "",
  alamat_majikan_3: "",
  bandar_majikan: "",
  poskod_majikan: "",
  daerah_majikan: "",
  negeri_majikan: "",
  negara_majikan: "",
  jawatan: "",
  status_jawatan: "",
  pendapatan_kasar: "",
  pengesahan_pendapatan: [],
  sumber_pendapatan: [],
  lain_lain_sumber_pendapatan: "",

  // Section E - Maklumat Pendapatan
  gaji_elaun_pendapatan: "",
  pendapatan_isteri_suami_ibubapa_penjaga: "",
  pencen_perkeso: "",
  sumbangan_anak_anak: "",
  bantuan_jkm: "",
  takaful: "",
  sewa_rumah_tanah_kedai: "",
  pendapatan_tanggungan_serumah: "",
  pendapatan_lain_lain: "",
  perbelanjaan_makanan_minuman: "",
  sewa_bayaran_pinjaman_perumahan: "",
  perbelanjaan_persekolahan_anak: "",
  pengangkutan_tambang_bas_sekolah: "",
  bil_utiliti: "",

  // Section F - Maklumat Alamat
  addressInfo: {
    alamat1: "",
    alamat2: "",
    alamat3: "",
    location: "",
    negeri: "Selangor",
    daerah: "",
    bandar: "",
    poskod: "",
    kariah: "",
    geolokasi: "",
    tempoh_menetap_selangor: "",
    kursus_terpilih: "",
    selectedKursus: null,
    selectedGuru: null,
    // Maklumat Tempat Tinggal
    status_kediaman: "",
    tapak_rumah: "",
    jenis_rumah: "",
    binaan_rumah: "",
    keadaan_kediaman: "",
    bekalan_air: "",
    bekalan_elektrik: "",
    penyelenggaraan: "",
    bil_air: "",
    bil_elektrik: "",
    kadar_bayaran_bulanan: "",
    kadar_sewa_bulanan: "",
    dokumen_perjanjian_sewa: null,
    lain_lain_status_kediaman: "",
    lain_lain_tapak_rumah: "",
    lain_lain_jenis_rumah: "",
    lain_lain_binaan_rumah: "",
  },

  // Section H - Maklumat Pemilikan
  wang_simpanan: "",
  emas: "",
  saham: "",
  jenis_kenderaan: [],
  kenderaan_total: "",
  rumah_kedai: "",
  tanah_sawah: "",
  dokumen_pemilikan: null,

  // Section H1 - Maklumat Pinjaman Harta
  nama_institusi_pemberi_pinjaman: "",
  jenis_pinjaman: "",
  amaun_bayaran_bulanan: "",
  jumlah_keseluruhan_perbelanjaan: "",
  tahun_mula_pinjaman: "",
  tahun_akhir_pinjaman: "",
  dokumen_perjanjian_pinjaman: null,

  // Section I - Maklumat Barangan Rumah
  television: "",
  radio: "",
  perabot: "",
  telefon_bimbit: "",
  mesin_basuh: "",
  astro: "",
  video_player_cd_dvd: "",
  peti_ais: "",
  dapur_gas: "",

  // Section J - Pengesahan
  pengesahan: {
    dibantu_penolong_amil: "",
    kariah_bantuan: "",
    nama_penolong_amil_bantuan: "",
    tarikh_bantuan: "",
    hubungan_pak: "",
    kariah_hubungan_pak: "",
    nama_pak_hubungan: "",
    jenis_hubungan_pak: "",
    tarikh_hubungan_pak: "",
    pdpa_consent: false,
    pendapatan_consent: false,
    hubungan_kakitangan_lzs: "",
    nama_kakitangan: "",
    jawatan_kakitangan: "",
    pejabat_kakitangan: "",
    hubungan_kakitangan: "",
    tarikh_perakuan: new Date().toISOString().slice(0, 10),
    // Fake data for PAK officer information display in bermastautin
    kariah_bermastautin: "masjid-al-hidayah",
    nama_pak_bermastautin: "ustaz-ahmad-abdullah",
    // Fake data for form fields in bermastautin
    nama_pengesah: "Ustaz Ahmad bin Abdullah",
    jawatan_pengesah: "Pegawai PAK",
    no_telefon_pengesah: "012-3456789",
    tarikh_pengesahan_permastautin: "2024-01-15",
  },

  // Section J1 - Pengesahan Pendapatan
  pengesahan_pendapatan: {
    nama_penolong_amil: "",
    jawatan_penolong_amil: "",
    no_telefon_penolong_amil: "",
    tarikh_pengesahan_pendapatan: "",
    dokumen_pengesahan_pendapatan: null,
    nama_pegawai_lzs: "",
    jawatan_pegawai_lzs: "",
    no_telefon_pegawai_lzs: "",
    tarikh_pengesahan_pegawai_lzs: "",
    dokumen_pengesahan_pegawai_lzs: null,
  },

  // Section K - Pengesahan Bermastautin
  ulasan_pengesahan: "",
  surat_pengesahan_bermastautin: null,

  // Section L - Maklumat Penolong Amil
  nama_penolong_amil: "",
  jenis_permohonan: "",
  tarikh_proses: "",

  // Section M - Penilaian Awal
  komitmen_tinggi: "",
  keperluan_mendesak: [],
  lain_keperluan: "",
  dokumen_sokongan: [],

  // Section B (Tanggungan) - Maklumat Peribadi Tanggungan
  // Note: Individual tanggungan fields are now handled in tanggunganList array
  // These fields are kept for backward compatibility but will be replaced

  // Heirs array
  heirs: [],

  // Tanggungan array for multiple dependents
  tanggungan: [],
});

// ============================================================================
// OPTIONS DATA
// ============================================================================
// Payment Method Options for Main Applicant
const paymentMethodOptionsMain = [
  { label: "Ya", value: "ya" },
  { label: "Tidak", value: "tidak" },
];

// Payment Method Options for Tanggungan (keeping original)
const paymentMethodOptions = [
  { label: "Akaun", value: "akaun" },
  { label: "Tiada", value: "tiada" },
];

// No Payment Reason Options
const noPaymentReasonOptions = [
  { label: "Bawah Umur", value: "bawah-umur" },
  { label: "Muflis", value: "muflis" },
  { label: "Disenarai hitam oleh bank", value: "disenarai-hitam-oleh-bank" },
  { label: "Bukan Warganegara", value: "bukan-warganegara" },
  { label: "Sakit", value: "sakit" },
];

// Bank Options with SWIFT Codes
const bankOptions = [
  { label: "Maybank", value: "maybank", swiftCode: "MBBEMYKL" },
  { label: "CIMB", value: "cimb", swiftCode: "CIBBMYKL" },
  { label: "RHB", value: "rhb", swiftCode: "RHBBMYKL" },
  { label: "Bank Islam", value: "bank-islam", swiftCode: "BIMBMYKL" },
  { label: "Bank Rakyat", value: "bank-rakyat", swiftCode: "BKRMYKL" },
  { label: "Public Bank", value: "public-bank", swiftCode: "PBBEMYKL" },
  { label: "Hong Leong Bank", value: "hong-leong", swiftCode: "HLBBMYKL" },
  { label: "Ambank", value: "ambank", swiftCode: "ARBKMYKL" },
  { label: "BSN", value: "bsn", swiftCode: "BSNAMYKL" },
  { label: "Affin Bank", value: "affin", swiftCode: "PHBMMYKL" },
  { label: "UOB", value: "uob", swiftCode: "UOVBMYKL" },
  { label: "OCBC", value: "ocbc", swiftCode: "OCBCMYKL" },
  {
    label: "Standard Chartered",
    value: "standard-chartered",
    swiftCode: "SCBLMYKL",
  },
  { label: "Alliance Bank", value: "alliance", swiftCode: "MFBBMYKL" },
  { label: "Agrobank", value: "agrobank", swiftCode: "AGOBMYKL" },
];

// District Options
const daerahOptions = [
  { label: "Gombak", value: "gombak" },
  { label: "Hulu Langat", value: "hulu-langat" },
  { label: "Hulu Selangor", value: "hulu-selangor" },
  { label: "Klang", value: "klang" },
  { label: "Kuala Langat", value: "kuala-langat" },
  { label: "Kuala Selangor", value: "kuala-selangor" },
  { label: "Petaling", value: "petaling" },
  { label: "Sabak Bernam", value: "sabak-bernam" },
  { label: "Sepang", value: "sepang" },
];

// City Options based on Districts
const bandarOptions = [
  { label: "Shah Alam", value: "shah-alam", daerah: "petaling" },
  { label: "Petaling Jaya", value: "petaling-jaya", daerah: "petaling" },
  { label: "Subang Jaya", value: "subang-jaya", daerah: "petaling" },
  { label: "Klang", value: "klang", daerah: "klang" },
  { label: "Port Klang", value: "port-klang", daerah: "klang" },
  { label: "Kajang", value: "kajang", daerah: "hulu-langat" },
  { label: "Bangi", value: "bangi", daerah: "hulu-langat" },
  { label: "Hulu Langat", value: "hulu-langat", daerah: "hulu-langat" },
  {
    label: "Kuala Selangor",
    value: "kuala-selangor",
    daerah: "kuala-selangor",
  },
  {
    label: "Tanjung Karang",
    value: "tanjung-karang",
    daerah: "kuala-selangor",
  },
  { label: "Sepang", value: "sepang", daerah: "sepang" },
  { label: "Cyberjaya", value: "cyberjaya", daerah: "sepang" },
  { label: "Putrajaya", value: "putrajaya", daerah: "sepang" },
  { label: "Gombak", value: "gombak", daerah: "gombak" },
  { label: "Rawang", value: "rawang", daerah: "gombak" },
  { label: "Hulu Selangor", value: "hulu-selangor", daerah: "hulu-selangor" },
  {
    label: "Kuala Kubu Bharu",
    value: "kuala-kubu-bharu",
    daerah: "hulu-selangor",
  },
  { label: "Kuala Langat", value: "kuala-langat", daerah: "kuala-langat" },
  { label: "Banting", value: "banting", daerah: "kuala-langat" },
  { label: "Sabak Bernam", value: "sabak-bernam", daerah: "sabak-bernam" },
  { label: "Sekinchan", value: "sekinchan", daerah: "sabak-bernam" },
];

// Postal Code Options based on Cities
const poskodOptions = [
  { label: "40000", value: "40000", bandar: "shah-alam" },
  { label: "41000", value: "41000", bandar: "klang" },
  { label: "42000", value: "42000", bandar: "port-klang" },
  { label: "43000", value: "43000", bandar: "kajang" },
  { label: "44000", value: "44000", bandar: "bangi" },
  { label: "45000", value: "45000", bandar: "kuala-selangor" },
  { label: "46000", value: "46000", bandar: "tanjung-karang" },
  { label: "47000", value: "47000", bandar: "sepang" },
  { label: "48000", value: "48000", bandar: "cyberjaya" },
  { label: "49000", value: "49000", bandar: "putrajaya" },
  { label: "50000", value: "50000", bandar: "gombak" },
  { label: "51000", value: "51000", bandar: "rawang" },
  { label: "52000", value: "52000", bandar: "hulu-selangor" },
  { label: "53000", value: "53000", bandar: "kuala-kubu-bharu" },
  { label: "54000", value: "54000", bandar: "kuala-langat" },
  { label: "55000", value: "55000", bandar: "banting" },
  { label: "56000", value: "56000", bandar: "sabak-bernam" },
  { label: "57000", value: "57000", bandar: "sekinchan" },
];

// Mosque Parish Options
const kariahOptions = [
  { label: "Kariah Masjid Al-Hidayah", value: "masjid-al-hidayah" },
  { label: "Kariah Masjid Al-Ikhlas", value: "masjid-al-ikhlas" },
  { label: "Kariah Masjid Al-Muttaqin", value: "masjid-al-muttaqin" },
  { label: "Kariah Masjid Al-Rahman", value: "masjid-al-rahman" },
  { label: "Kariah Masjid Al-Salam", value: "masjid-al-salam" },
  { label: "Kariah Masjid Al-Taqwa", value: "masjid-al-taqwa" },
  { label: "Kariah Masjid An-Nur", value: "masjid-an-nur" },
  { label: "Kariah Masjid Ar-Rahman", value: "masjid-ar-rahman" },
  { label: "Kariah Masjid As-Salam", value: "masjid-as-salam" },
  { label: "Kariah Masjid At-Taqwa", value: "masjid-at-taqwa" },
];

// PAK Officers by Mosque Parish
const pakOfficersByKariah = {
  "masjid-al-hidayah": [
    { label: "Ustaz Ahmad bin Abdullah", value: "ustaz-ahmad-abdullah" },
    { label: "Ustazah Siti binti Mohamed", value: "ustazah-siti-mohamed" },
    { label: "Ustaz Mohd bin Hassan", value: "ustaz-mohd-hassan" },
  ],
  "masjid-al-ikhlas": [
    { label: "Ustaz Ismail bin Omar", value: "ustaz-ismail-omar" },
    { label: "Ustazah Fatimah binti Ali", value: "ustazah-fatimah-ali" },
    { label: "Ustaz Kamal bin Ibrahim", value: "ustaz-kamal-ibrahim" },
  ],
  "masjid-al-muttaqin": [
    { label: "Ustaz Rahman bin Sulaiman", value: "ustaz-rahman-sulaiman" },
    { label: "Ustazah Aminah binti Yusof", value: "ustazah-aminah-yusof" },
    { label: "Ustaz Zulkifli bin Ahmad", value: "ustaz-zulkifli-ahmad" },
  ],
  "masjid-al-rahman": [
    { label: "Ustaz Aziz bin Mohamed", value: "ustaz-aziz-mohamed" },
    { label: "Ustazah Nor binti Hassan", value: "ustazah-nor-hassan" },
    { label: "Ustaz Hamid bin Abdullah", value: "ustaz-hamid-abdullah" },
  ],
  "masjid-al-salam": [
    { label: "Ustaz Yusof bin Ahmad", value: "ustaz-yusof-ahmad" },
    { label: "Ustazah Mariam binti Omar", value: "ustazah-mariam-omar" },
    { label: "Ustaz Khalid bin Ismail", value: "ustaz-khalid-ismail" },
  ],
  "masjid-al-taqwa": [
    { label: "Ustaz Omar bin Hassan", value: "ustaz-omar-hassan" },
    { label: "Ustazah Zainab binti Ali", value: "ustazah-zainab-ali" },
    { label: "Ustaz Ibrahim bin Mohamed", value: "ustaz-ibrahim-mohamed" },
  ],
  "masjid-an-nur": [
    { label: "Ustaz Hassan bin Abdullah", value: "ustaz-hassan-abdullah" },
    { label: "Ustazah Aishah binti Yusof", value: "ustazah-aishah-yusof" },
    { label: "Ustaz Mohamed bin Khalid", value: "ustaz-mohamed-khalid" },
  ],
  "masjid-ar-rahman": [
    { label: "Ustaz Abdullah bin Omar", value: "ustaz-abdullah-omar" },
    {
      label: "Ustazah Khadijah binti Hassan",
      value: "ustazah-khadijah-hassan",
    },
    { label: "Ustaz Ali bin Ismail", value: "ustaz-ali-ismail" },
  ],
  "masjid-as-salam": [
    { label: "Ustaz Sulaiman bin Ahmad", value: "ustaz-sulaiman-ahmad" },
    {
      label: "Ustazah Safiyah binti Mohamed",
      value: "ustazah-safiyah-mohamed",
    },
    { label: "Ustaz Yusof bin Khalid", value: "ustaz-yusof-khalid" },
  ],
  "masjid-at-taqwa": [
    { label: "Ustaz Khalid bin Abdullah", value: "ustaz-khalid-abdullah" },
    { label: "Ustazah Aminah binti Omar", value: "ustazah-aminah-omar" },
    { label: "Ustaz Ismail bin Hassan", value: "ustaz-ismail-hassan" },
  ],
};

// Negeri Options
const negeriOptions = [
  { label: "Selangor", value: "selangor" },
  { label: "Johor", value: "johor" },
  { label: "Kedah", value: "kedah" },
  { label: "Kelantan", value: "kelantan" },
  { label: "Melaka", value: "melaka" },
  { label: "Negeri Sembilan", value: "negeri-sembilan" },
  { label: "Pahang", value: "pahang" },
  { label: "Perak", value: "perak" },
  { label: "Perlis", value: "perlis" },
  { label: "Sabah", value: "sabah" },
  { label: "Sarawak", value: "sarawak" },
  { label: "Terengganu", value: "terengganu" },
];

// KFAM Classes List Data
const kfamClassesList = ref([
  {
    id: 1,
    nama_pengajar: "Ustaz Ahmad bin Abdullah",
    kelulusan: "Sarjana Syariah, UIAM",
    no_telefon: "012-345 6789",
    tempat_mengajar: "Masjid Al-Hidayah",
    alamat_tempat: "No. 123, Jalan Utama, Taman Seri",
    daerah: "Petaling Jaya",
    bahasa_penghantar: "Bahasa Melayu",
  },
  {
    id: 2,
    nama_pengajar: "Ustazah Siti binti Mohamed",
    kelulusan: "Sarjana Usuluddin, UM",
    no_telefon: "012-987 6543",
    tempat_mengajar: "Surau Al-Iman",
    alamat_tempat: "No. 456, Jalan Kedua, Taman Damai",
    daerah: "Shah Alam",
    bahasa_penghantar: "Bahasa Melayu",
  },
  {
    id: 3,
    nama_pengajar: "Ustaz Mohd Ali bin Hassan",
    kelulusan: "Sarjana Fiqh, UKM",
    no_telefon: "012-555 1234",
    tempat_mengajar: "Masjid Al-Rahman",
    alamat_tempat: "No. 789, Jalan Ketiga, Taman Harmoni",
    daerah: "Klang",
    bahasa_penghantar: "Bahasa Arab",
  },
  {
    id: 4,
    nama_pengajar: "Ustazah Nurul Huda binti Ismail",
    kelulusan: "Sarjana Tafsir, UIA",
    no_telefon: "012-777 8888",
    tempat_mengajar: "Surau Al-Nur",
    alamat_tempat: "No. 321, Jalan Keempat, Taman Ceria",
    daerah: "Subang Jaya",
    bahasa_penghantar: "Bahasa Melayu",
  },
  {
    id: 5,
    nama_pengajar: "Ustaz Abdul Rahman bin Omar",
    kelulusan: "Sarjana Hadith, USM",
    no_telefon: "012-999 0000",
    tempat_mengajar: "Masjid Al-Amin",
    alamat_tempat: "No. 654, Jalan Kelima, Taman Indah",
    daerah: "Kajang",
    bahasa_penghantar: "Bahasa Arab",
  },
]);

// ============================================================================
// COMPUTED PROPERTIES
// ============================================================================
// (Penilaian Awal removed)

const showLainLainSektor = computed(() => {
  return formData.value.sektor_pekerjaan === "Lain-lain";
});

const showLainLainSumberPendapatan = computed(() => {
  return (
    formData.value.sumber_pendapatan &&
    formData.value.sumber_pendapatan.includes("Lain-lain")
  );
});

const selectedBankSwiftCode = computed(() => {
  const selectedBank = bankOptions.find(
    (bank) => bank.value === formData.value.nama_bank
  );
  return selectedBank ? selectedBank.swiftCode : "";
});

// Add/remove multiple bank accounts and helper
const addBankAccount = () => {
  formData.value.bank_accounts.push({
    nama_bank: "",
    no_akaun_bank: "",
    nama_pemegang_akaun: "",
    jenis_akaun: "",
    id_pengenalan: "",
    nama_bersama: "",
  });
};

const removeBankAccount = (index) => {
  formData.value.bank_accounts.splice(index, 1);
};

// Helper to get swift code for a given bank value
const getSwiftCodeForBank = (bankValue) => {
  const selectedBank = bankOptions.find((bank) => bank.value === bankValue);
  return selectedBank ? selectedBank.swiftCode : "";
};

const selectedBankSwiftCodeTanggungan = computed(() => {
  const selectedBank = bankOptions.find(
    (bank) => bank.value === formData.value.nama_bank_tanggungan
  );
  return selectedBank ? selectedBank.swiftCode : "";
});

const selectedDaerah = computed(() => {
  const daerah = daerahOptions.find(
    (d) => d.value === formData.value.addressInfo.daerah
  );
  return daerah ? daerah.label : "";
});

// Show doc info when certain keperluan are selected
const shouldShowDocInfo = computed(() => {
  const list = formData.value.keperluan_mendesak || [];
  const triggerValues = [
    "perubatan_kritikal",
    "bencana",
    "konflik_keluarga",
    "tiada_tempat_tinggal",
    "terputus_bekalan_makanan",
    "masih_ada_bekalan_makanan",
    "tiada_sumber_pendapatan",
    "pendapatan_berkurangan",
    "selain_dari_di_atas",
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
    { label: "Penyata KWSP", value: "penyata_kwsp" },
    { label: "Lain-lain", value: "lain" },
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
        label: "Pengesahan Pegawai Dietetik/Rehab",
        value: "pengesahan_dietetik",
      },
      { label: "Penyata KWSP", value: "penyata_kwsp" },
      { label: "GL/Surat Kelulusan Sebelum Ini", value: "gl_surat_kelulusan" },
      { label: "Sebut Harga", value: "sebut_harga" },
      { label: "Lain-lain", value: "lain" },
    ];
  } else {
    return [
      ...baseOptions,
      { label: "Surat Temujanji Perubatan", value: "surat_temujanji" },
      { label: "Bil Utiliti", value: "bil_utiliti" },
      { label: "Bil/Resit Berkaitan", value: "bil_resit" },
      { label: "Surat Tuntutan Hutang", value: "surat_tuntutan" },
      {
        label: "Laporan Polis/Bomba/Pihak Berkuasa",
        value: "laporan_berkuasa",
      },
      { label: "Gambar Bukti Kejadian", value: "gambar_bukti" },
    ];
  }
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
  // Map jenis to template URLs if available; return empty to disable when not available
  const map = {
    // Perubatan Kritikal templates
    borang_pengesahan_kesihatan: "",
    pengesahan_dietetik: "",
    gl_surat_kelulusan: "",
    sebut_harga: "",
    // Common templates
    pengesahan_pendapatan: "",
    penyata_kwsp: "",
    // Other cases templates
    surat_temujanji: "",
    bil_utiliti: "",
    bil_resit: "",
    surat_tuntutan: "",
    laporan_berkuasa: "",
    gambar_bukti: "",
  };
  return map[jenis] || "";
}

function downloadTemplate(jenis) {
  const url = getTemplateUrl(jenis);
  if (!url) return;
  window.open(url, "_blank");
}

const pakOfficersOptionsBantuan = computed(() => {
  const selectedKariah = formData.value.pengesahan.kariah_bantuan;
  return selectedKariah ? pakOfficersByKariah[selectedKariah] || [] : [];
});

const pakOfficersOptionsHubungan = computed(() => {
  const selectedKariah = formData.value.pengesahan.kariah_hubungan_pak;
  return selectedKariah ? pakOfficersByKariah[selectedKariah] || [] : [];
});

const pakOfficersOptionsBermastautin = computed(() => {
  const selectedKariah = formData.value.pengesahan.kariah_bermastautin;
  return selectedKariah ? pakOfficersByKariah[selectedKariah] || [] : [];
});

const uploadedDocuments = computed(() => {
  const documents = [];

  // Add sample document for demonstration
  if (formData.value.pengesahan.surat_pengesahan_bermastautin) {
    documents.push({
      name: "pengesahan_bermastautin.pdf",
      type: "application/pdf",
      size: "2.0 MB",
    });
  }

  return documents;
});

// Computed properties for tanggungan conditional fields
const showLainLainHubungan = computed(() => {
  const currentTanggungan = getCurrentTanggungan();
  return currentTanggungan?.hubungan_pemohon === "Lain-lain";
});

const showDokumenSuratNikah = computed(() => {
  const currentTanggungan = getCurrentTanggungan();
  return currentTanggungan?.hubungan_pemohon === "Pasangan Pemohon";
});

const showLainLainWarganegara = computed(() => {
  const currentTanggungan = getCurrentTanggungan();
  return currentTanggungan?.warganegara_tanggungan === "Lain-lain";
});

const showPassportFields = computed(() => {
  const currentTanggungan = getCurrentTanggungan();
  return currentTanggungan?.warganegara_tanggungan !== "Malaysia";
});

const showLainLainAgama = computed(() => {
  const currentTanggungan = getCurrentTanggungan();
  return currentTanggungan?.agama_tanggungan === "Lain-lain";
});

const showLainLainBangsa = computed(() => {
  const currentTanggungan = getCurrentTanggungan();
  return currentTanggungan?.bangsa_tanggungan === "Lain-lain";
});

const showLainLainStatusPerkahwinan = computed(() => {
  const currentTanggungan = getCurrentTanggungan();
  return currentTanggungan?.status_perkahwinan_tanggungan === "Lain-lain";
});

// Computed property to check if tanggungan is Muallaf
const isTanggunganMuallaf = computed(() => {
  const currentTanggungan = getCurrentTanggungan();
  return currentTanggungan?.adakah_muallaf_tanggungan === "Y";
});

// Computed property to check if passport is expired
const isPassportExpired = computed(() => {
  const currentTanggungan = getCurrentTanggungan();
  if (
    !currentTanggungan?.tarikh_tamat_pasport ||
    currentTanggungan?.warganegara_tanggungan === "Malaysia"
  ) {
    return false;
  }

  try {
    const expiryDate = new Date(currentTanggungan.tarikh_tamat_pasport);
    const today = new Date();
    return expiryDate < today;
  } catch (error) {
    return false;
  }
});

// Computed property to show passport expiry warning
const showPassportExpiryWarning = computed(() => {
  return isPassportExpired.value;
});

// Helper function to get Swift Code for current tanggungan
const getSelectedBankSwiftCodeTanggungan = () => {
  const currentTanggungan = getCurrentTanggungan();
  if (!currentTanggungan?.nama_bank_tanggungan) return "";
  const selectedBank = bankOptions.find(
    (bank) => bank.value === currentTanggungan.nama_bank_tanggungan
  );
  return selectedBank ? selectedBank.swiftCode : "";
};

// Computed property to validate Islamic dates for tanggungan
const islamicDatesValidationTanggungan = computed(() => {
  const currentTanggungan = getCurrentTanggungan();
  if (
    !currentTanggungan?.adakah_muallaf_tanggungan ||
    currentTanggungan.adakah_muallaf_tanggungan !== "Y"
  ) {
    return { isValid: true, message: "" };
  }

  const tarikhMasukIslam = currentTanggungan.tarikh_masuk_islam_tanggungan;
  const tarikhMasukKFAM = currentTanggungan.tarikh_masuk_kfam_tanggungan;

  if (tarikhMasukIslam && tarikhMasukKFAM) {
    try {
      const islamDate = new Date(tarikhMasukIslam);
      const kfamDate = new Date(tarikhMasukKFAM);

      if (kfamDate < islamDate) {
        return {
          isValid: false,
          message:
            "Tarikh Masuk KFAM tidak boleh lebih awal daripada Tarikh Masuk Islam",
        };
      }
    } catch (error) {
      console.error("Error validating Islamic dates:", error);
    }
  }

  return { isValid: true, message: "" };
});

// Computed property for calculating Tarikh Keluar Muallaf
const tarikhKeluarMuallaf = computed(() => {
  if (formData.value.adakah_muallaf !== "Y") {
    return "";
  }

  const tarikhMasukIslam = formData.value.tarikh_masuk_islam;
  const tarikhMasukKFAM = formData.value.tarikh_masuk_kfam;

  if (!tarikhMasukIslam && !tarikhMasukKFAM) {
    return "";
  }

  // Parse dates and add 5 years
  let tarikhMasukIslamPlus5 = null;
  let tarikhMasukKFAMPlus5 = null;

  if (tarikhMasukIslam) {
    const [day, month, year] = tarikhMasukIslam.split("/");
    if (day && month && year) {
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      // Validate that the date is not in the future
      if (date > new Date()) {
        return "";
      }
      date.setFullYear(date.getFullYear() + 5);
      tarikhMasukIslamPlus5 = date;
    }
  }

  if (tarikhMasukKFAM) {
    const [day, month, year] = tarikhMasukKFAM.split("/");
    if (day && month && year) {
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      // Validate that the date is not in the future
      if (date > new Date()) {
        return "";
      }
      date.setFullYear(date.getFullYear() + 5);
      tarikhMasukKFAMPlus5 = date;
    }
  }

  // Return the later date
  if (tarikhMasukIslamPlus5 && tarikhMasukKFAMPlus5) {
    const laterDate =
      tarikhMasukIslamPlus5 > tarikhMasukKFAMPlus5
        ? tarikhMasukIslamPlus5
        : tarikhMasukKFAMPlus5;
    return `${String(laterDate.getDate()).padStart(2, "0")}/${String(
      laterDate.getMonth() + 1
    ).padStart(2, "0")}/${laterDate.getFullYear()}`;
  } else if (tarikhMasukIslamPlus5) {
    return `${String(tarikhMasukIslamPlus5.getDate()).padStart(
      2,
      "0"
    )}/${String(tarikhMasukIslamPlus5.getMonth() + 1).padStart(
      2,
      "0"
    )}/${tarikhMasukIslamPlus5.getFullYear()}`;
  } else if (tarikhMasukKFAMPlus5) {
    return `${String(tarikhMasukKFAMPlus5.getDate()).padStart(2, "0")}/${String(
      tarikhMasukKFAMPlus5.getMonth() + 1
    ).padStart(2, "0")}/${tarikhMasukKFAMPlus5.getFullYear()}`;
  }

  return "";
});

// Computed property for validating Islamic dates
const islamicDatesValidation = computed(() => {
  if (formData.value.adakah_muallaf !== "Y") {
    return { isValid: true, message: "" };
  }

  const tarikhMasukIslam = formData.value.tarikh_masuk_islam;
  const tarikhMasukKFAM = formData.value.tarikh_masuk_kfam;

  if (tarikhMasukIslam && tarikhMasukKFAM) {
    const [day1, month1, year1] = tarikhMasukIslam.split("/");
    const [day2, month2, year2] = tarikhMasukKFAM.split("/");

    if (day1 && month1 && year1 && day2 && month2 && year2) {
      const islamDate = new Date(
        parseInt(year1),
        parseInt(month1) - 1,
        parseInt(day1)
      );
      const kfamDate = new Date(
        parseInt(year2),
        parseInt(month2) - 1,
        parseInt(day2)
      );

      if (kfamDate < islamDate) {
        return {
          isValid: false,
          message:
            "Tarikh Masuk KFAM tidak boleh lebih awal daripada Tarikh Masuk Islam",
        };
      }
    }
  }

  return { isValid: true, message: "" };
});

// ============================================================================
// WATCHERS
// ============================================================================
// Auto-populate applicant birth date from MyKad
watch(
  () => formData.value.no_pengenalan,
  (newVal) => {
    if (
      newVal &&
      !isInitializingMockData.value &&
      formData.value.jenis_id === "mykad"
    ) {
      if (newVal.length === 12 && /^\d{12}$/.test(newVal)) {
        const year = newVal.substring(0, 2);
        const month = newVal.substring(2, 4);
        const day = newVal.substring(4, 6);

        const century = parseInt(year) <= 29 ? "20" : "19";
        const fullYear = century + year;

        const birthDate = `${fullYear}-${month}-${day}`;
        formData.value.tarikh_lahir = birthDate;
      }
    }
  }
);
watch(
  () => formData.value.tarikh_lahir,
  (newVal) => {
    if (newVal) {
      formData.value.umur = calculateAge(newVal);
    } else {
      formData.value.umur = "";
    }
  },
  { immediate: true }
);
watch(bilanganIsteri, (newVal) => {
  const count = parseInt(newVal) || 0;
  isteriList.value = Array(count).fill({});
});

watch(statusPoligami, (newVal) => {
  if (newVal !== "ya") {
    bilanganIsteri.value = null;
    isteriList.value = [];
  }
});

watch(
  () => formData.value.nama_bank,
  (newVal) => {
    if (newVal) {
      const selectedBank = bankOptions.find((bank) => bank.value === newVal);
      if (selectedBank) {
        formData.value.swift_code = selectedBank.swiftCode;
      }
    } else {
      formData.value.swift_code = "";
    }
  }
);

// Ensure at least one bank account entry when method is 'akaun'
watch(
  () => formData.value.kaedah_pembayaran,
  (method) => {
    if (method === "akaun" && formData.value.bank_accounts.length === 0) {
      addBankAccount();
    }
  },
  { immediate: true }
);

// Seed one education entry when masih_bersekolah === 'Y'
watch(
  () => formData.value.masih_bersekolah,
  (val) => {
    if (val === "Y" && formData.value.education_entries.length === 0) {
      addEducationEntry();
    }
  },
  { immediate: true }
);

watch(
  () => formData.value.nama_bank_tanggungan,
  (newVal) => {
    if (newVal) {
      const selectedBank = bankOptions.find((bank) => bank.value === newVal);
      if (selectedBank) {
        formData.value.swift_code_tanggungan = selectedBank.swiftCode;
      }
    } else {
      formData.value.swift_code_tanggungan = "";
    }
  }
);

// Watch for employment status changes to handle conditional validation
watch(
  () => formData.value.status_pekerjaan,
  (newVal) => {
    if (newVal === "tidak_bekerja") {
      // Clear employment-related fields when not working
      formData.value.jenis_pekerjaan = "";
      formData.value.sektor_pekerjaan = "";
      formData.value.lain_lain_sektor = "";
      formData.value.no_telefon_pejabat = "";
      formData.value.nama_majikan = "";
      formData.value.no_telefon_majikan = "";
      formData.value.alamat_majikan_1 = "";
      formData.value.alamat_majikan_2 = "";
      formData.value.alamat_majikan_3 = "";
      formData.value.bandar_majikan = "";
      formData.value.poskod_majikan = "";
      formData.value.daerah_majikan = "";
      formData.value.negeri_majikan = "";
      formData.value.negara_majikan = "";
      formData.value.jawatan = "";
      formData.value.status_jawatan = "";
      formData.value.pendapatan_kasar = "";
      formData.value.pengesahan_pendapatan = [];
      formData.value.sumber_pendapatan = [];

      // Watch for tanggungan birth date changes to auto-populate age
      watch(
        () => getCurrentTanggungan()?.tarikh_lahir_tanggungan,
        (newVal) => {
          if (newVal && !isInitializingMockData.value) {
            const currentTanggungan = getCurrentTanggungan();
            if (currentTanggungan && !currentTanggungan.umur_tanggungan) {
              // Only calculate age if it's not already set (for mock data)
              currentTanggungan.umur_tanggungan = calculateAge(newVal);
            }
          }
        }
      );

      // Watch for tanggungan MyKad changes to auto-populate birth date for Malaysians
      watch(
        () => getCurrentTanggungan()?.pengenalan_id_tanggungan,
        (newVal) => {
          if (
            newVal &&
            !isInitializingMockData.value &&
            getCurrentTanggungan()?.jenis_pengenalan_tanggungan === "MyKad" &&
            getCurrentTanggungan()?.warganegara_tanggungan === "Malaysia"
          ) {
            const currentTanggungan = getCurrentTanggungan();
            if (newVal.length === 12 && /^\d{12}$/.test(newVal)) {
              // Extract birth date from MyKad (format: YYMMDD)
              const year = newVal.substring(0, 2);
              const month = newVal.substring(2, 4);
              const day = newVal.substring(4, 6);

              // Determine century (00-29 = 2000s, 30-99 = 1900s)
              const century = parseInt(year) <= 29 ? "20" : "19";
              const fullYear = century + year;

              // Format as YYYY-MM-DD for date input
              const birthDate = `${fullYear}-${month}-${day}`;
              currentTanggungan.tarikh_lahir_tanggungan = birthDate;
              // Only calculate age if it's not already set (for mock data)
              if (!currentTanggungan.umur_tanggungan) {
                currentTanggungan.umur_tanggungan = calculateAge(birthDate);
              }
            }
          }
        }
      );

      // Watch for tanggungan Islamic dates changes to auto-calculate Tarikh Keluar Muallaf
      watch(
        () => [
          getCurrentTanggungan()?.adakah_muallaf_tanggungan,
          getCurrentTanggungan()?.tarikh_masuk_islam_tanggungan,
          getCurrentTanggungan()?.tarikh_masuk_kfam_tanggungan,
        ],
        () => {
          const currentTanggungan = getCurrentTanggungan();
          if (currentTanggungan?.adakah_muallaf_tanggungan === "Y") {
            currentTanggungan.tarikh_keluar_muallaf_tanggungan =
              calculateTarikhKeluarMuallafTanggungan();
          }
        },
        { deep: true }
      );

      // Watch mohon_ketua_keluarga for minors to auto-set situasi & kelulusan
      watch(
        () => [
          getCurrentTanggungan()?.mohon_ketua_keluarga,
          getCurrentTanggungan()?.tarikh_lahir_tanggungan,
        ],
        () => {
          const currentTanggungan = getCurrentTanggungan();
          if (!currentTanggungan) return;

          const age = parseInt(
            calculateAge(currentTanggungan.tarikh_lahir_tanggungan)
          );
          if (Number.isFinite(age) && age < 18) {
            if (currentTanggungan.mohon_ketua_keluarga) {
              currentTanggungan.situasi_kelulusan_khas = "Profiling";
              currentTanggungan.kelulusan_khas = "Y";
            } else {
              currentTanggungan.kelulusan_khas = "N";
              currentTanggungan.situasi_kelulusan_khas = "";
            }
          }
        },
        { deep: true }
      );

      // Watch for bank selection to auto-populate Swift Code
      watch(
        () => getCurrentTanggungan()?.nama_bank_tanggungan,
        (newBankName) => {
          const currentTanggungan = getCurrentTanggungan();
          if (currentTanggungan && newBankName) {
            const selectedBank = bankOptions.find(
              (bank) => bank.value === newBankName
            );
            if (selectedBank) {
              currentTanggungan.swift_code_tanggungan = selectedBank.swiftCode;
            }
          }
        },
        { deep: true }
      );
      formData.value.lain_lain_sumber_pendapatan = "";
    }
  }
);

// Watch for Islamic dates changes to automatically calculate Tarikh Keluar Muallaf
watch(
  [
    () => formData.value.tarikh_masuk_islam,
    () => formData.value.tarikh_masuk_kfam,
  ],
  () => {
    if (formData.value.adakah_muallaf === "Y") {
      formData.value.tarikh_keluar_muallaf = tarikhKeluarMuallaf.value;
    }
  }
);

// Watch for muallaf status changes to clear Islamic fields when not muallaf
watch(
  () => formData.value.adakah_muallaf,
  (newVal) => {
    if (newVal === "T") {
      // Clear all Islamic fields when not muallaf
      formData.value.tarikh_masuk_islam = "";
      formData.value.tarikh_masuk_kfam = "";
      formData.value.nama_selepas_islam = "";
      formData.value.nama_sebelum_islam = "";
      formData.value.tarikh_keluar_muallaf = "";
      formData.value.dokumen_pengislaman = null;
    }
  }
);

// ============================================================================
// STEP NAVIGATION FUNCTIONS
// ============================================================================
const nextStepA = () => {
  if (currentStepA.value < totalStepsA) {
    currentStepA.value++;
  } else if (currentStepA.value === totalStepsA) {
    // When Section A is complete, move to Section B
    nextSection();
  }
};

const prevStepA = () => {
  if (currentStepA.value > 1) {
    currentStepA.value--;
  }
};

const nextStepB = () => {
  // Save current tanggungan data before moving to next step
  if (getCurrentTanggungan()) {
    const currentTanggungan = getCurrentTanggungan();
    // Update the tanggunganList with current form data
    tanggunganList.value[currentTanggunganIndex.value] = {
      ...currentTanggungan,
    };
    formData.value.tanggungan = tanggunganList.value;
  }

  if (currentStepB.value < totalStepsB) {
    currentStepB.value++;
  } else {
    // All steps completed, submit form
    submitForm();
  }
};

const prevStepB = () => {
  if (currentStepB.value > 1) {
    currentStepB.value--;
  }
};

const nextSection = () => {
  currentSection.value = 2;
};

const prevSection = () => {
  currentSection.value = 1;
};

const goToPeribadi = () => {
  currentStepB.value = 1;
};

// ============================================================================
// TANGGUNGAN MANAGEMENT FUNCTIONS
// ============================================================================
const addTanggungan = (showNotification = true) => {
  // Prevent adding more than 3 tanggungan
  if (tanggunganList.value.length >= 3) {
    toast.error("Maksimum 3 tanggungan sahaja dibenarkan");
    return;
  }

  const newTanggungan = {
    id: Date.now(), // Unique ID for each tanggungan

    // Step 1: Maklumat Peribadi Tanggungan
    hubungan_pemohon: "",
    lain_lain_hubungan: "",
    nama_tanggungan: "",
    jenis_pengenalan_tanggungan: "",
    pengenalan_id_tanggungan: "",
    warganegara_tanggungan: "",
    lain_lain_warganegara: "",
    taraf_penduduk_tetap: "",
    no_pasport: "",
    tarikh_mula_pasport: "",
    tarikh_tamat_pasport: "",
    tarikh_lahir_tanggungan: "",
    umur_tanggungan: "",
    mohon_ketua_keluarga: false,
    tempat_lahir_tanggungan: "",
    jantina_tanggungan: "",
    agama_tanggungan: "",
    lain_lain_agama: "",
    bangsa_tanggungan: "",
    lain_lain_bangsa: "",
    no_telefon_bimbit_tanggungan: "",
    no_telefon_rumah_tanggungan: "",
    emel_tanggungan: "",
    tempoh_menetap_selangor_tanggungan: "",
    status_perkahwinan_tanggungan: "",
    lain_lain_status_perkahwinan: "",
    jumlah_tanggungan: "",

    // Special Approval for Minors
    situasi_kelulusan_khas: "",
    kelulusan_khas: "",

    // Legacy fields for backward compatibility
    jenis_id_tanggungan: "",
    no_pengenalan_tanggungan: "",
    tempoh_menetap_selangor: "",
    no_telefon_tanggungan: "",

    // Islamic Information (for Step 2)
    adakah_muallaf_tanggungan: "",
    nama_sebelum_islam_tanggungan: "",
    tarikh_masuk_islam_tanggungan: "",
    tarikh_masuk_kfam_tanggungan: "",
    nama_selepas_islam_tanggungan: "",
    tarikh_keluar_muallaf_tanggungan: "",
    dokumen_pengislaman_tanggungan: null,

    // Step 2: Maklumat Perbankan Tanggungan
    nama_bank_tanggungan: "",
    swift_code_tanggungan: "",
    no_akaun_bank_tanggungan: "",
    nama_pemegang_akaun_tanggungan: "",
    kaedah_pembayaran_tanggungan: "",
    sebab_tiada_akaun_tanggungan: "",

    // Step 3: Maklumat Pendidikan Tanggungan
    masih_bersekolah: "",
    bersekolah_tanggungan: "",
    pendidikan_tertinggi_tanggungan: "",
    lain_pendidikan_tertinggi_tanggungan: "",
    tahap_pendidikan_dicapai: [],
    lain_tahap_pendidikan_dicapai: "",
    sijil_pendidikan_tanggungan: null,
    jenis_sekolah_institusi: "",
    kategori_sekolah_institusi: "",
    tahun_bersekolah: "",
    tahun_tingkatan_pengajian: "",
    nama_sekolah_institusi: "",
    alamat1_sekolah: "",
    alamat2_sekolah: "",
    alamat3_sekolah: "",
    daerah_sekolah: "",
    bandar_sekolah: "",
    poskod_sekolah: "",
    tinggal_bersama_keluarga: "",
    asrama_rumah_sewa: "",
    bidang_kursus_pengajian: "",
    jurusan_bidang: "",
    pembiayaan_pengajian: [],
    lain_pembiayaan_pengajian: "",
    catatan_pendidikan_tanggungan: "",
    // Legacy fields for backward compatibility
    jenis_sekolah: "",
    nama_sekolah: "",
    alamat_sekolah: "",
    negeri_sekolah: "",
    nama_sekolah_agama: "",
    alamat_sekolah_agama: "",
    daerah_sekolah_agama: "",
    negeri_sekolah_agama: "",
    poskod_sekolah_agama: "",

    // Step 4: Maklumat Kesihatan Tanggungan
    tahap_kesihatan_tanggungan: "",
    keadaan_kesihatan_sakit_tanggungan: "",
    kos_penjagaan_sakit_tanggungan: "",
    perbelanjaan_bulanan_sakit_tanggungan: "",
    kesempurnaan_fizikal_tanggungan: "",
    sebab_kecacatan_tanggungan: "",
    tahap_kecacatan_tanggungan: "",
    perbelanjaan_bulanan_oku_tanggungan: "",
    keadaan_kesihatan_uzur_tanggungan: "",
    kos_penjagaan_uzur_tanggungan: "",
    perbelanjaan_bulanan_uzur_tanggungan: "",
    // Dokumen Sokongan Kesihatan
    dokumen_sakit_kronik_tanggungan: null,
    dokumen_oku_tanggungan: null,
    dokumen_uzur_tanggungan: null,

    // Step 5: Kemahiran Tanggungan
    kemahiran_tanggungan: "",

    // Step 6: Maklumat Pekerjaan Tanggungan
    pekerjaan_status: "",

    // Sumber Pendapatan
    sumber_pendapatan: [],
    lain_lain_sumber_pendapatan: "",

    // Butiran Pekerjaan
    jenis_pekerjaan: "",
    sektor_pekerjaan: "",
    lain_lain_sektor_pekerjaan: "",

    // Maklumat Majikan
    no_telefon_pejabat: "",
    nama_majikan: "",
    no_tel_majikan: "",
    alamat_majikan_1: "",
    alamat_majikan_2: "",
    alamat_majikan_3: "",
    bandar_majikan: "",
    poskod_majikan: "",
    daerah_majikan: "",
    negeri_majikan: "",
    negara_majikan: "",

    // Jawatan & Status
    jawatan: "",
    status_jawatan: "",

    // Pendapatan
    pendapatan_kasar: "",
    dokumen_pendapatan: null,
  };

  tanggunganList.value.push(newTanggungan);
  currentTanggunganIndex.value = tanggunganList.value.length - 1;
  currentStepB.value = 1;

  // Update formData.tanggungan array
  formData.value.tanggungan = tanggunganList.value;

  // Log to console for debugging
  console.log(
    `Tanggungan ${tanggunganList.value.length} ditambah:`,
    newTanggungan
  );
  console.log("Total tanggungan sekarang:", tanggunganList.value.length);

  // Only show notification if requested
  if (showNotification) {
    toast.success(`Tanggungan ${tanggunganList.value.length} berjaya ditambah`);
  }
};

const removeTanggungan = (index) => {
  if (tanggunganList.value.length > 1) {
    tanggunganList.value.splice(index, 1);
    formData.value.tanggungan = tanggunganList.value;

    if (currentTanggunganIndex.value >= tanggunganList.value.length) {
      currentTanggunganIndex.value = tanggunganList.value.length - 1;
    }

    toast.success("Tanggungan berjaya dibuang");
  } else {
    toast.error("Sekurang-kurangnya satu tanggungan diperlukan");
  }
};

const selectTanggungan = (index) => {
  // Save current tanggungan data before switching
  if (getCurrentTanggungan()) {
    const currentTanggungan = getCurrentTanggungan();
    tanggunganList.value[currentTanggunganIndex.value] = {
      ...currentTanggungan,
    };
    formData.value.tanggungan = tanggunganList.value;
    console.log(
      "Saved data for Tanggungan",
      currentTanggunganIndex.value + 1,
      "before switching"
    );
  }

  currentTanggunganIndex.value = index;
  currentStepB.value = 1;

  // Debug: Log the selected tanggungan data
  const selectedTanggungan = getCurrentTanggungan();
  console.log("Selected Tanggungan:", selectedTanggungan);
  console.log("Selected Tanggungan Name:", selectedTanggungan?.nama_tanggungan);
  console.log(
    "Selected Tanggungan Relationship:",
    selectedTanggungan?.hubungan_pemohon
  );
  console.log("Selected Tanggungan Age:", selectedTanggungan?.umur_tanggungan);
  console.log(
    "Selected Tanggungan Birth Date:",
    selectedTanggungan?.tarikh_lahir_tanggungan
  );
};

const toggleTanggunganSummary = () => {
  showTanggunganSummary.value = !showTanggunganSummary.value;
};

// Helper functions for simplified interface
const isTanggunganComplete = (tanggungan) => {
  return (
    tanggungan.nama_tanggungan &&
    tanggungan.hubungan_pemohon &&
    tanggungan.jenis_id_tanggungan &&
    tanggungan.jantina_tanggungan &&
    tanggungan.tarikh_lahir_tanggungan
  );
};

const getCompletedCount = () => {
  return tanggunganList.value.filter((t) => isTanggunganComplete(t)).length;
};

const getIncompleteCount = () => {
  return tanggunganList.value.filter((t) => !isTanggunganComplete(t)).length;
};

const getCompletionPercentage = () => {
  if (tanggunganList.value.length === 0) return 0;
  return Math.round((getCompletedCount() / tanggunganList.value.length) * 100);
};

const getTanggunganSummary = () => {
  if (tanggunganList.value.length === 3) {
    return {
      total: 3,
      completed: getCompletedCount(),
      incomplete: getIncompleteCount(),
      list: tanggunganList.value.map((t, index) => ({
        number: index + 1,
        name: t.nama_tanggungan || "Nama belum diisi",
        relationship: t.hubungan_pemohon || "Hubungan belum diisi",
        status: isTanggunganComplete(t) ? "Lengkap" : "Tidak Lengkap",
      })),
    };
  }
  return null;
};

const getCurrentTanggungan = () => {
  if (tanggunganList.value.length === 0) {
    // Initialize with first tanggungan if none exists
    addTanggungan(false); // Don't show notification during initialization
  }
  return tanggunganList.value[currentTanggunganIndex.value];
};

// Helper function to calculate age from birth date
const calculateAge = (birthDate) => {
  if (!birthDate) return "";

  try {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age.toString();
  } catch (error) {
    return "";
  }
};

// Helper function to calculate total tanggungan
const calculateTotalTanggungan = () => {
  if (tanggunganList.value.length === 0) return "0";

  // Count active tanggungan (excluding those with expired passports)
  let activeCount = 0;

  tanggunganList.value.forEach((tanggungan) => {
    if (tanggungan.warganegara_tanggungan === "Malaysia") {
      activeCount++;
    } else {
      // Check if passport is expired for non-Malaysians
      if (tanggungan.tarikh_tamat_pasport) {
        try {
          const expiryDate = new Date(tanggungan.tarikh_tamat_pasport);
          const today = new Date();
          if (expiryDate > today) {
            activeCount++;
          }
        } catch (error) {
          // If date parsing fails, count as active
          activeCount++;
        }
      } else {
        activeCount++;
      }
    }
  });

  return activeCount.toString();
};

// Helper function to calculate Tarikh Keluar Muallaf for tanggungan
const calculateTarikhKeluarMuallafTanggungan = () => {
  const currentTanggungan = getCurrentTanggungan();
  if (
    !currentTanggungan?.adakah_muallaf_tanggungan ||
    currentTanggungan.adakah_muallaf_tanggungan !== "Y"
  ) {
    return "";
  }

  const tarikhMasukIslam = currentTanggungan.tarikh_masuk_islam_tanggungan;
  const tarikhMasukKFAM = currentTanggungan.tarikh_masuk_kfam_tanggungan;

  if (!tarikhMasukIslam && !tarikhMasukKFAM) {
    return "";
  }

  // Parse dates and add 5 years
  let tarikhMasukIslamPlus5 = null;
  let tarikhMasukKFAMPlus5 = null;

  if (tarikhMasukIslam) {
    try {
      const date = new Date(tarikhMasukIslam);
      // Validate that the date is not in the future
      if (date > new Date()) {
        return "";
      }
      date.setFullYear(date.getFullYear() + 5);
      tarikhMasukIslamPlus5 = date;
    } catch (error) {
      console.error("Error parsing tarikh masuk Islam:", error);
    }
  }

  if (tarikhMasukKFAM) {
    try {
      const date = new Date(tarikhMasukKFAM);
      // Validate that the date is not in the future
      if (date > new Date()) {
        return "";
      }
      date.setFullYear(date.getFullYear() + 5);
      tarikhMasukKFAMPlus5 = date;
    } catch (error) {
      console.error("Error parsing tarikh masuk KFAM:", error);
    }
  }

  // Return the later date (more recent)
  if (tarikhMasukIslamPlus5 && tarikhMasukKFAMPlus5) {
    const laterDate =
      tarikhMasukIslamPlus5 > tarikhMasukKFAMPlus5
        ? tarikhMasukIslamPlus5
        : tarikhMasukKFAMPlus5;
    return laterDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD
  } else if (tarikhMasukIslamPlus5) {
    return tarikhMasukIslamPlus5.toISOString().split("T")[0];
  } else if (tarikhMasukKFAMPlus5) {
    return tarikhMasukKFAMPlus5.toISOString().split("T")[0];
  }

  return "";
};

// Flag to prevent watchers from running during mock data initialization
const isInitializingMockData = ref(true);

// Initialize with 3 tanggungan by default on component mount
onMounted(() => {
  // Initialize mock data for Section A - Maklumat Peribadi
  formData.value = {
    ...formData.value,
    // Mock data for Maklumat Peribadi
    jenis_id: "mykad",
    no_pengenalan: "770319035991",
    nama: "adnan bin abu",
    warganegara: "Malaysia",
    tarikh_lahir: "1977-03-19",
    umur: "48",
    tempat_lahir: "Kelantan",
    jantina: "Lelaki",
    agama: "Islam",
    bangsa: "Melayu",
    no_telefon_bimbit: "0191105544",
    emel: "adan.abu@gmail.com",
    status_perkahwinan: "Berkahwin",
    status_poligami: "tidak",

    // Mock data for Maklumat Pendidikan
    masih_bersekolah: "T",
    pendidikan_tertinggi: "Peringkat Rendah",
    tahap_pendidikan: ["Peringkat Rendah"],

    // Mock data for Maklumat Islam
    adakah_muallaf: "T",

    // Mock data for Maklumat Perbankan
    kaedah_pembayaran: "ya",
    bank_accounts: [
      {
        nama_bank: "bank-islam",
        no_akaun_bank: "3063020371170",
        nama_pemegang_akaun: "adnan bin abu",
        jenis_akaun: "individu",
        id_pengenalan: "801004035672",
        nama_bersama: "",
      },
    ],

    // Mock data for Maklumat Kesihatan
    tahap_kesihatan: "Sihat",

    // Mock data for Maklumat Kemahiran
    kemahiran: ["Perniagaan"],

    // Mock data for Maklumat Pinjaman Harta
    // nama_institusi_pemberi_pinjaman: "Bank Islam Malaysia Berhad",
    // jenis_pinjaman: "Pinjaman Peribadi",
    // amaun_bayaran_bulanan: "500.00",
    // jumlah_keseluruhan_perbelanjaan: "15000.00",
    // tahun_mula_pinjaman: "2023-01-01",
    // tahun_akhir_pinjaman: "2025-12-31",
    // dokumen_perjanjian_pinjaman: null,

    // Mock data for Maklumat Tempat Tinggal
    addressInfo: {
      ...formData.value.addressInfo,
      alamat1: "32,jalan4/7a",
      alamat2: "bandar baru bangi",
      negeri: "selangor",
      daerah: "hulu langat",
      bandar: "kajang",
      poskod: "43000",
      kariah: "kariah masjid al hidayah",
      geolokasi: "lokasi semasa",
      tempoh_menetap_selangor: "48",
      status_kediaman: "Milik Sendiri Tidak Berbayar",
      tapak_rumah: "Milik Sendiri",
      jenis_rumah: "Teres",
      binaan_rumah: "Batu",
      keadaan_kediaman: "Baik",
      bekalan_air: "ada",
      bekalan_elektrik: "ada",
      penyelenggaraan: "tiada",
      bil_air: "50",
      bil_elektrik: "50",
    },
  };

  if (tanggunganList.value.length === 0) {
    // Add 3 tanggungan by default with mock data
    addTanggungan(false); // First tanggungan
    addTanggungan(false); // Second tanggungan
    addTanggungan(false); // Third tanggungan

    // Set mock data for the 3 tanggungan
    if (tanggunganList.value.length === 3) {
      // First Tanggungan - Pasangan Pemohon
      tanggunganList.value[0] = {
        ...tanggunganList.value[0],
        hubungan_pemohon: "Pasangan Pemohon",
        nama_tanggungan: "ROHANA BINTI AHMAD",
        jenis_pengenalan_tanggungan: "MyKad",
        pengenalan_id_tanggungan: "801004035672",
        warganegara_tanggungan: "Malaysia",
        taraf_penduduk_tetap: "Y",
        tarikh_lahir_tanggungan: "1980-10-04",
        umur_tanggungan: "43",
        tempat_lahir_tanggungan: "Kelantan",
        jantina_tanggungan: "Perempuan",
        agama_tanggungan: "Islam",
        bangsa_tanggungan: "Melayu",
        no_telefon_bimbit_tanggungan: "0138202398",
        no_telefon_rumah_tanggungan: "038881234",
        emel_tanggungan: "rohana@email.com",
        tempoh_menetap_selangor_tanggungan: "20",
        status_perkahwinan_tanggungan: "Berkahwin",

        // Special Approval for Minors
        situasi_kelulusan_khas: "Profiling",
        kelulusan_khas: "Y",

        // Legacy fields for backward compatibility
        jenis_id_tanggungan: "MyKad",
        no_pengenalan_tanggungan: "801004035672",
        tempoh_menetap_selangor: "20",
        no_telefon_tanggungan: "0138202398",

        // Islamic Information
        adakah_muallaf_tanggungan: "Y",
        nama_sebelum_islam_tanggungan: "ROHANA BINTI WONG",
        tarikh_masuk_islam_tanggungan: "1995-01-01",
        tarikh_masuk_kfam_tanggungan: "1995-01-01",
        nama_selepas_islam_tanggungan: "ROHANA BINTI AHMAD",
        tarikh_keluar_muallaf_tanggungan: "2000-01-01",
        dokumen_pengislaman_tanggungan: null,

        // Maklumat Perbankan Tanggungan
        nama_bank_tanggungan: "maybank",
        swift_code_tanggungan: "MBBEMYKL",
        no_akaun_bank_tanggungan: "1234567890",
        nama_pemegang_akaun_tanggungan: "ROHANA BINTI AHMAD",
        kaedah_pembayaran_tanggungan: "akaun",
        sebab_tiada_akaun_tanggungan: "",

        // Pendidikan Tanggungan
        masih_bersekolah: "T",
        bersekolah_tanggungan: "Tidak",
        pendidikan_tertinggi_tanggungan: "Diploma",
        lain_pendidikan_tertinggi_tanggungan: "",
        tahap_pendidikan_dicapai: ["SPM", "Sijil", "Diploma"],
        lain_tahap_pendidikan_dicapai: "",
        sijil_pendidikan_tanggungan: null,
        jenis_sekolah_institusi: "SMK",
        kategori_sekolah_institusi: "SEK.MEN",
        tahun_bersekolah: "2020",
        tahun_tingkatan_pengajian: "Tingkatan 5",
        nama_sekolah_institusi: "SMK Kuala Lumpur",
        alamat1_sekolah: "Jalan Sultan, Kuala Lumpur",
        alamat2_sekolah: "",
        alamat3_sekolah: "",
        daerah_sekolah: "Kuala Lumpur",
        bandar_sekolah: "Kuala Lumpur",
        poskod_sekolah: "50000",
        tinggal_bersama_keluarga: "Y",
        asrama_rumah_sewa: "",
        bidang_kursus_pengajian: "Diploma",
        jurusan_bidang: "Pengurusan Perniagaan",
        pembiayaan_pengajian: ["PTPTN"],
        lain_pembiayaan_pengajian: "",
        catatan_pendidikan_tanggungan: "Tamat pengajian pada tahun 2020",
        // Legacy fields for backward compatibility
        jenis_sekolah: "Sekolah Menengah",
        nama_sekolah: "SMK Kuala Lumpur",
        alamat_sekolah: "Jalan Sultan, Kuala Lumpur",
        negeri_sekolah: "Kuala Lumpur",
        nama_sekolah_agama: "Sekolah Agama Kuala Lumpur",
        alamat_sekolah_agama: "Jalan Agama, Kuala Lumpur",
        daerah_sekolah_agama: "Kuala Lumpur",
        negeri_sekolah_agama: "Kuala Lumpur",
        poskod_sekolah_agama: "50000",

        // Maklumat Kesihatan Tanggungan
        tahap_kesihatan_tanggungan: "Sihat",
        keadaan_kesihatan_sakit_tanggungan: "Tidak",
        kos_penjagaan_sakit_tanggungan: "0",
        perbelanjaan_bulanan_sakit_tanggungan: "0",
        kesempurnaan_fizikal_tanggungan: "Sempurna",
        sebab_kecacatan_tanggungan: "",
        tahap_kecacatan_tanggungan: "",
        perbelanjaan_bulanan_oku_tanggungan: "0",
        keadaan_kesihatan_uzur_tanggungan: "Tidak",
        kos_penjagaan_uzur_tanggungan: "0",
        perbelanjaan_bulanan_uzur_tanggungan: "0",

        // Kemahiran Tanggungan
        kemahiran_tanggungan: "Komputer, Bahasa Inggeris",

        // Maklumat Pekerjaan Tanggungan
        pekerjaan_status: "Bekerja",

        // Sumber Pendapatan
        sumber_pendapatan: ["Pengajian", "Sumbangan Keluarga"],
        lain_lain_sumber_pendapatan: "",

        // Butiran Pekerjaan
        jenis_pekerjaan: "Kerani",
        sektor_pekerjaan: "Swasta",
        lain_lain_sektor_pekerjaan: "",

        // Maklumat Majikan
        no_telefon_pejabat: "038881234",
        nama_majikan: "Syarikat ABC Sdn Bhd",
        no_tel_majikan: "038881234",
        alamat_majikan_1: "Jalan Majikan, Kuala Lumpur",
        alamat_majikan_2: "",
        alamat_majikan_3: "",
        bandar_majikan: "Kuala Lumpur",
        poskod_majikan: "50000",
        daerah_majikan: "Kuala Lumpur",
        negeri_majikan: "Kuala Lumpur",
        negara_majikan: "Malaysia",

        // Jawatan & Status
        jawatan: "Kerani",
        status_jawatan: "Tetap",

        // Pendapatan
        pendapatan_kasar: "2500.00",
        dokumen_pendapatan: null,
      };

      // Second Tanggungan - Anak Perempuan
      tanggunganList.value[1] = {
        ...tanggunganList.value[1],
        hubungan_pemohon: "Anak",
        nama_tanggungan: "NUR NAJWA BINTI ADNAN",
        jenis_pengenalan_tanggungan: "MyKad",
        pengenalan_id_tanggungan: "060802030272",
        warganegara_tanggungan: "Malaysia",
        taraf_penduduk_tetap: "Y",
        tarikh_lahir_tanggungan: "2006-08-02",
        umur_tanggungan: "17",
        tempat_lahir_tanggungan: "Shah Alam",
        jantina_tanggungan: "Perempuan",
        agama_tanggungan: "Islam",
        bangsa_tanggungan: "Melayu",
        no_telefon_bimbit_tanggungan: "0197883456",
        no_telefon_rumah_tanggungan: "038881234",
        emel_tanggungan: "najwa@email.com",
        tempoh_menetap_selangor_tanggungan: "17",
        status_perkahwinan_tanggungan: "Bujang",

        // Special Approval for Minors
        situasi_kelulusan_khas: "Profiling",
        kelulusan_khas: "Y",

        // Legacy fields for backward compatibility
        jenis_id_tanggungan: "MyKad",
        no_pengenalan_tanggungan: "060802030272",
        tempoh_menetap_selangor: "19",
        no_telefon_tanggungan: "0197883456",

        // Islamic Information
        adakah_muallaf_tanggungan: "N",
        nama_sebelum_islam_tanggungan: "",
        tarikh_masuk_islam_tanggungan: "",
        tarikh_masuk_kfam_tanggungan: "",
        nama_selepas_islam_tanggungan: "",
        tarikh_keluar_muallaf_tanggungan: "",
        dokumen_pengislaman_tanggungan: null,

        // Maklumat Perbankan Tanggungan
        nama_bank_tanggungan: "cimb",
        swift_code_tanggungan: "CIBBMYKL",
        no_akaun_bank_tanggungan: "0987654321",
        nama_pemegang_akaun_tanggungan: "NUR NAJWA BINTI ADNAN",
        kaedah_pembayaran_tanggungan: "akaun",
        sebab_tiada_akaun_tanggungan: "",

        // Pendidikan Tanggungan
        masih_bersekolah: "Y",
        bersekolah_tanggungan: "Ya",
        pendidikan_tertinggi_tanggungan: "Sijil Pelajaran Malaysia",
        lain_pendidikan_tertinggi_tanggungan: "",
        tahap_pendidikan_dicapai: ["SRP-PMR", "SPM"],
        lain_tahap_pendidikan_dicapai: "",
        sijil_pendidikan_tanggungan: null,
        jenis_sekolah_institusi: "SMK",
        kategori_sekolah_institusi: "SEK.MEN",
        tahun_bersekolah: "2024",
        tahun_tingkatan_pengajian: "Tingkatan 4",
        nama_sekolah_institusi: "SMK Shah Alam",
        alamat1_sekolah: "Jalan Sekolah, Shah Alam",
        alamat2_sekolah: "",
        alamat3_sekolah: "",
        daerah_sekolah: "Petaling",
        bandar_sekolah: "Shah Alam",
        poskod_sekolah: "40000",
        tinggal_bersama_keluarga: "Y",
        asrama_rumah_sewa: "",
        bidang_kursus_pengajian: "",
        jurusan_bidang: "",
        pembiayaan_pengajian: ["Tiada"],
        lain_pembiayaan_pengajian: "",
        catatan_pendidikan_tanggungan: "Masih bersekolah di Tingkatan 4",
        // Legacy fields for backward compatibility
        jenis_sekolah: "Sekolah Menengah",
        nama_sekolah: "SMK Shah Alam",
        alamat_sekolah: "Jalan Sekolah, Shah Alam",
        negeri_sekolah: "Selangor",
        nama_sekolah_agama: "Sekolah Agama Shah Alam",
        alamat_sekolah_agama: "Jalan Agama, Shah Alam",
        daerah_sekolah_agama: "Petaling",
        negeri_sekolah_agama: "Selangor",
        poskod_sekolah_agama: "40000",

        // Maklumat Kesihatan Tanggungan
        tahap_kesihatan_tanggungan: "Sihat",
        keadaan_kesihatan_sakit_tanggungan: "Tidak",
        kos_penjagaan_sakit_tanggungan: "0",
        perbelanjaan_bulanan_sakit_tanggungan: "0",
        kesempurnaan_fizikal_tanggungan: "Sempurna",
        sebab_kecacatan_tanggungan: "",
        tahap_kecacatan_tanggungan: "",
        perbelanjaan_bulanan_oku_tanggungan: "0",
        keadaan_kesihatan_uzur_tanggungan: "Tidak",
        kos_penjagaan_uzur_tanggungan: "0",
        perbelanjaan_bulanan_uzur_tanggungan: "0",

        // Kemahiran Tanggungan
        kemahiran_tanggungan: "Bahasa Melayu, Matematik, Sains",

        // Maklumat Pekerjaan Tanggungan
        pekerjaan_status: "Tidak Bekerja",

        // Sumber Pendapatan
        sumber_pendapatan: [],
        lain_lain_sumber_pendapatan: "",

        // Butiran Pekerjaan
        jenis_pekerjaan: "",
        sektor_pekerjaan: "",
        lain_lain_sektor_pekerjaan: "",

        // Maklumat Majikan
        no_telefon_pejabat: "",
        nama_majikan: "",
        no_tel_majikan: "",
        alamat_majikan_1: "",
        alamat_majikan_2: "",
        alamat_majikan_3: "",
        bandar_majikan: "",
        poskod_majikan: "",
        daerah_majikan: "",
        negeri_majikan: "",
        negara_majikan: "",

        // Jawatan & Status
        jawatan: "",
        status_jawatan: "",

        // Pendapatan
        pendapatan_kasar: "",
        dokumen_pendapatan: null,
      };

      // Third Tanggungan - Anak Perempuan
      tanggunganList.value[2] = {
        ...tanggunganList.value[2],
        hubungan_pemohon: "Anak",
        nama_tanggungan: "NUR QISTINA BINTI ADNAN",
        jenis_pengenalan_tanggungan: "MyKad",
        pengenalan_id_tanggungan: "091108030442",
        warganegara_tanggungan: "Malaysia",
        taraf_penduduk_tetap: "Y",
        tarikh_lahir_tanggungan: "2009-11-08",
        umur_tanggungan: "14",
        tempat_lahir_tanggungan: "Petaling Jaya",
        jantina_tanggungan: "Perempuan",
        agama_tanggungan: "Islam",
        bangsa_tanggungan: "Melayu",
        no_telefon_bimbit_tanggungan: "01299982378",
        no_telefon_rumah_tanggungan: "038881234",
        emel_tanggungan: "qistina@email.com",
        tempoh_menetap_selangor_tanggungan: "14",
        status_perkahwinan_tanggungan: "Bujang",

        // Special Approval for Minors
        situasi_kelulusan_khas: "Profiling",
        kelulusan_khas: "Y",

        // Legacy fields for backward compatibility
        jenis_id_tanggungan: "MyKad",
        no_pengenalan_tanggungan: "091108030442",
        tempoh_menetap_selangor: "16",
        no_telefon_tanggungan: "01299982378",

        // Islamic Information
        adakah_muallaf_tanggungan: "N",
        nama_sebelum_islam_tanggungan: "",
        tarikh_masuk_islam_tanggungan: "",
        tarikh_masuk_kfam_tanggungan: "",
        nama_selepas_islam_tanggungan: "",
        tarikh_keluar_muallaf_tanggungan: "",
        dokumen_pengislaman_tanggungan: null,

        // Maklumat Perbankan Tanggungan
        nama_bank_tanggungan: "",
        swift_code_tanggungan: "",
        no_akaun_bank_tanggungan: "",
        nama_pemegang_akaun_tanggungan: "",
        kaedah_pembayaran_tanggungan: "tiada",
        sebab_tiada_akaun_tanggungan: "bukan-warganegara",

        // Pendidikan Tanggungan
        masih_bersekolah: "Y",
        bersekolah_tanggungan: "Ya",
        pendidikan_tertinggi_tanggungan: "UPSR",
        lain_pendidikan_tertinggi_tanggungan: "",
        tahap_pendidikan_dicapai: ["Peringkat Rendah"],
        lain_tahap_pendidikan_dicapai: "",
        sijil_pendidikan_tanggungan: null,
        jenis_sekolah_institusi: "SRK",
        kategori_sekolah_institusi: "SRK",
        tahun_bersekolah: "2024",
        tahun_tingkatan_pengajian: "Tahun 6",
        nama_sekolah_institusi: "SK Petaling Jaya",
        alamat1_sekolah: "Jalan Sekolah, Petaling Jaya",
        alamat2_sekolah: "",
        alamat3_sekolah: "",
        daerah_sekolah: "Petaling",
        bandar_sekolah: "Petaling Jaya",
        poskod_sekolah: "46000",
        tinggal_bersama_keluarga: "Y",
        asrama_rumah_sewa: "",
        bidang_kursus_pengajian: "",
        jurusan_bidang: "",
        pembiayaan_pengajian: ["Tiada"],
        lain_pembiayaan_pengajian: "",
        catatan_pendidikan_tanggungan: "Masih bersekolah di Tahun 6",
        // Legacy fields for backward compatibility
        jenis_sekolah: "Sekolah Rendah",
        nama_sekolah: "SK Petaling Jaya",
        alamat_sekolah: "Jalan Sekolah, Petaling Jaya",
        negeri_sekolah: "Selangor",
        nama_sekolah_agama: "Sekolah Agama Petaling Jaya",
        alamat_sekolah_agama: "Jalan Agama, Petaling Jaya",
        daerah_sekolah_agama: "Petaling",
        negeri_sekolah_agama: "Selangor",
        poskod_sekolah_agama: "46000",

        // Maklumat Kesihatan Tanggungan
        tahap_kesihatan_tanggungan: "Sihat",
        keadaan_kesihatan_sakit_tanggungan: "Tidak",
        kos_penjagaan_sakit_tanggungan: "0",
        perbelanjaan_bulanan_sakit_tanggungan: "0",
        kesempurnaan_fizikal_tanggungan: "Sempurna",
        sebab_kecacatan_tanggungan: "",
        tahap_kecacatan_tanggungan: "",
        perbelanjaan_bulanan_oku_tanggungan: "0",
        keadaan_kesihatan_uzur_tanggungan: "Tidak",
        kos_penjagaan_uzur_tanggungan: "0",
        perbelanjaan_bulanan_uzur_tanggungan: "0",

        // Kemahiran Tanggungan
        kemahiran_tanggungan: "Membaca, Menulis, Mengira",

        // Maklumat Pekerjaan Tanggungan
        pekerjaan_status: "Tidak Bekerja",

        // Sumber Pendapatan
        sumber_pendapatan: [],
        lain_lain_sumber_pendapatan: "",

        // Butiran Pekerjaan
        jenis_pekerjaan: "",
        sektor_pekerjaan: "",
        lain_lain_sektor_pekerjaan: "",

        // Maklumat Majikan
        no_telefon_pejabat: "",
        nama_majikan: "",
        no_tel_majikan: "",
        alamat_majikan_1: "",
        alamat_majikan_2: "",
        alamat_majikan_3: "",
        bandar_majikan: "",
        poskod_majikan: "",
        daerah_majikan: "",
        negeri_majikan: "",
        negara_majikan: "",

        // Jawatan & Status
        jawatan: "",
        status_jawatan: "",

        // Pendapatan
        pendapatan_kasar: "",
        dokumen_pendapatan: null,
      };

      // Update formData.tanggungan array
      formData.value.tanggungan = tanggunganList.value;

      // Set flag to false after mock data initialization is complete
      isInitializingMockData.value = false;

      console.log("Mock data loaded for 3 tanggungan:", tanggunganList.value);
      console.log(
        "Rohana relationship:",
        tanggunganList.value[0]?.hubungan_pemohon
      );
      console.log(
        "Najwa relationship:",
        tanggunganList.value[1]?.hubungan_pemohon
      );
      console.log(
        "Qistina relationship:",
        tanggunganList.value[2]?.hubungan_pemohon
      );
    }
  }
});

// ============================================================================
// STEP JUMP FUNCTIONS
// ============================================================================
const goToStepA = (stepNumber) => {
  currentStepA.value = stepNumber;
};

const goToStepB = (stepNumber) => {
  // Allow direct navigation to any step
  currentStepB.value = stepNumber;
};

// ============================================================================
// FORM SUBMISSION FUNCTIONS
// ============================================================================
const submitForm = () => {
  // Save current tanggungan data before submission
  if (getCurrentTanggungan()) {
    const currentTanggungan = getCurrentTanggungan();
    tanggunganList.value[currentTanggunganIndex.value] = {
      ...currentTanggungan,
    };
    formData.value.tanggungan = tanggunganList.value;
  }

  // Log summary of all tanggungan
  console.log(
    `Form submitted with ${tanggunganList.value.length} tanggungan:`,
    tanggunganList.value
  );

  processing.value = true;
  navigateTo(`/BF-PRF/AS/FR/03`);
};

const handleSubmit = async () => {
  try {
    console.log("Form submitted:", formData.value);
    toast.success("Permohonan berjaya dihantar");
    router.push("/BF-PRF/AS/FR/04");
  } catch (error) {
    toast.error("Ralat! Permohonan tidak berjaya dihantar");
    console.error("Submission error:", error);
  }
};

const handleSave = async () => {
  try {
    console.log("Form saved:", formData.value);
    toast.success("Permohonan berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Permohonan tidak berjaya disimpan");
    console.error("Save error:", error);
  }
};

// ============================================================================
// STEP SAVE FUNCTIONS - SECTION A
// ============================================================================
const handleSaveStepA1 = async () => {
  try {
    console.log("Step A1 saved:", formData.value);
    toast.success("Penilaian Awal berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
    console.error("Save Step A1 error:", error);
  }
};

const handleSaveStepA2 = async () => {
  try {
    console.log("Step A2 saved:", formData.value);
    toast.success("Maklumat Peribadi berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
    console.error("Save Step A2 error:", error);
  }
};

const handleSaveStepA3 = async () => {
  try {
    console.log("Step A3 saved:", formData.value);
    toast.success("Maklumat Islam berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
    console.error("Save Step A3 error:", error);
  }
};

const handleSaveStepA4 = async () => {
  try {
    console.log("Step A4 saved:", formData.value);
    toast.success("Maklumat Pendidikan berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
    console.error("Save Step A4 error:", error);
  }
};

const handleSaveStepA5 = async () => {
  try {
    console.log("Step A5 saved:", formData.value);
    toast.success("Maklumat Bank berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
    console.error("Save Step A5 error:", error);
  }
};

const handleSaveStepA6 = async () => {
  try {
    console.log("Step A6 saved:", formData.value);
    toast.success("Maklumat Kesihatan berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
    console.error("Save Step A6 error:", error);
  }
};

const handleSaveStepA7 = async () => {
  try {
    console.log("Step A7 saved:", formData.value);
    toast.success("Maklumat Kemahiran berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
    console.error("Save Step A7 error:", error);
  }
};

const handleSaveStepA8 = async () => {
  try {
    console.log("Step A8 saved:", formData.value);
    toast.success("Maklumat Alamat berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
    console.error("Save Step A8 error:", error);
  }
};

const handleSaveStepA9 = async () => {
  try {
    console.log("Step A9 saved:", formData.value);
    toast.success("Maklumat Pekerjaan berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
    console.error("Save Step A9 error:", error);
  }
};

const handleSaveStepA10 = async () => {
  try {
    console.log("Step A10 saved:", formData.value);
    toast.success("Maklumat Pendapatan berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
    console.error("Save Step A10 error:", error);
  }
};

const handleSaveStepA11 = async () => {
  try {
    console.log("Step A11 saved:", formData.value);
    toast.success("Maklumat Pendapatan berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
    console.error("Save Step A11 error:", error);
  }
};

const handleSaveStepA12 = async () => {
  try {
    console.log("Step A12 saved:", formData.value);
    toast.success("Maklumat Pekerjaan berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
    console.error("Save Step A12 error:", error);
  }
};

const handleSaveStepA13 = async () => {
  try {
    console.log("Step A13 saved:", formData.value);
    toast.success("Maklumat Pemilikan berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
    console.error("Save Step A13 error:", error);
  }
};

const handleSaveStepA14 = async () => {
  try {
    console.log("Step A14 saved:", formData.value);
    toast.success("Maklumat Pemilikan Barangan Rumah berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
    console.error("Save Step A14 error:", error);
  }
};

const handleSaveStepA15 = async () => {
  try {
    console.log("Step A15 saved:", formData.value);
    toast.success("Maklumat Waris berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
    console.error("Save Step A15 error:", error);
  }
};

// ============================================================================
// STEP SAVE FUNCTIONS - SECTION B
// ============================================================================
const handleSaveStepB1 = async () => {
  try {
    // Save current tanggungan data before saving
    if (getCurrentTanggungan()) {
      const currentTanggungan = getCurrentTanggungan();
      // Update the tanggunganList with current form data
      tanggunganList.value[currentTanggunganIndex.value] = {
        ...currentTanggungan,
      };
      formData.value.tanggungan = tanggunganList.value;

      console.log(
        "Step B1 saved for Tanggungan",
        currentTanggunganIndex.value + 1,
        ":",
        currentTanggungan
      );
      console.log("Updated tanggunganList:", tanggunganList.value);
    }

    toast.success("Maklumat Peribadi Tanggungan berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
    console.error("Save Step B1 error:", error);
  }
};

const handleSaveStepB2 = async () => {
  try {
    console.log("Step B2 saved:", formData.value);
    toast.success("Maklumat Islam Tanggungan berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
    console.error("Save Step B2 error:", error);
  }
};

const handleSaveStepB3 = async () => {
  try {
    console.log("Step B3 saved:", formData.value);
    toast.success("Maklumat Bank Tanggungan berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
    console.error("Save Step B3 error:", error);
  }
};

const handleSaveStepB4 = async () => {
  try {
    console.log("Step B4 saved:", formData.value);
    toast.success("Maklumat Pendidikan Tanggungan berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
    console.error("Save Step B4 error:", error);
  }
};

const handleSaveStepB5 = async () => {
  try {
    console.log("Step B5 saved:", formData.value);
    toast.success("Maklumat Kesihatan Tanggungan berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
    console.error("Save Step B5 error:", error);
  }
};

const handleSaveStepB6 = async () => {
  try {
    console.log("Step B6 saved:", formData.value);
    toast.success("Maklumat Kemahiran Tanggungan berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
    console.error("Save Step B6 error:", error);
  }
};

const handleSaveStepB7 = async () => {
  try {
    console.log("Step B7 saved:", formData.value);
    toast.success("Maklumat Pekerjaan Tanggungan berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
    console.error("Save Step B7 error:", error);
  }
};

const handleSaveStepB8 = async () => {
  try {
    console.log("Step B8 saved:", formData.value);
    toast.success("Maklumat Pegawai Pendaftar berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
    console.error("Save Step B8 error:", error);
  }
};

const handleSaveStepB9 = async () => {
  try {
    console.log("Step B9 saved:", formData.value);
    toast.success("Maklumat Pengesahan Pendapatan berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
    console.error("Save Step B9 error:", error);
  }
};

const handleSaveStepB10 = async () => {
  try {
    console.log("Step B10 saved:", formData.value);
    toast.success("Maklumat Pengesahan Bermastautin berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
    console.error("Save Step B10 error:", error);
  }
};

const handleSaveStepB11 = async () => {
  try {
    console.log("Step B11 saved:", formData.value);
    toast.success("Maklumat Pegawai Pendaftar berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
    console.error("Save Step B11 error:", error);
  }
};

// ============================================================================
// HEIRS MANAGEMENT FUNCTIONS
// ============================================================================
const addHeir = () => {
  formData.value.heirs.push({
    name: "",
    relationship: "",
    relationship_other: "",
    phone: "",
  });
};

const removeHeir = (index) => {
  formData.value.heirs.splice(index, 1);
};

// ============================================================================
// EDUCATION ENTRIES MANAGEMENT FUNCTIONS
// ============================================================================
const addEducationEntry = () => {
  formData.value.education_entries.push({
    jenis_sekolah: "",
    kategori_sekolah: "",
    tahun_bersekolah: "",
    tahun_tingkatan: "",
    nama_sekolah: "",
    alamat_sekolah_1: "",
    alamat_sekolah_2: "",
    alamat_sekolah_3: "",
    daerah_sekolah: "",
    bandar_sekolah: "",
    poskod_sekolah: "",
    tinggal_bersama_keluarga: "",
    asrama_rumah_sewa: "",
    bidang_kursus: "",
    jurusan_bidang: "",
    pembiayaan_pengajian: [],
    lain_pembiayaan: "",
    catatan: "",
  });
};

const removeEducationEntry = (index) => {
  formData.value.education_entries.splice(index, 1);
};

// ============================================================================
// LOCATION & UTILITY FUNCTIONS
// ============================================================================
const getLocation = (field) => {
  if (field === "addressInfo") {
    formData.value.addressInfo.geolokasi = "Lokasi semasa";
  } else {
    formData.value[field].geolokasi = "Lokasi semasa";
  }
  toast.success("Lokasi berjaya diperoleh!");
};

// ============================================================================
// KFAM MODAL FUNCTIONS
// ============================================================================
const openKursusModal = () => {
  if (!formData.value.addressInfo.location && !selectedDaerah.value) {
    toast.error("Sila pilih lokasi atau daerah terlebih dahulu");
    return;
  }
  showKursusModal.value = true;
  selectedKelas.value = null;
};

const closeKursusModal = () => {
  showKursusModal.value = false;
  selectedKelas.value = null;
};

const selectKelas = (kelas) => {
  selectedKelas.value = kelas;
};

const confirmKelasSelection = () => {
  if (selectedKelas.value) {
    formData.value.addressInfo.kursus_terpilih = `${selectedKelas.value.nama_pengajar} - ${selectedKelas.value.tempat_mengajar}`;
    formData.value.addressInfo.selectedKelas = selectedKelas.value;
    toast.success("Kelas KFAM berjaya dipilih!");
    closeKursusModal();
  }
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
const getKariahLabel = (value) => {
  const kariah = kariahOptions.find((k) => k.value === value);
  return kariah ? kariah.label : "";
};

const getPakOfficerLabel = (value) => {
  // Search through all PAK officers to find the matching one
  for (const kariah in pakOfficersByKariah) {
    const officer = pakOfficersByKariah[kariah].find((o) => o.value === value);
    if (officer) return officer.label;
  }
  return "";
};

const downloadDocument = (doc) => {
  // This would typically trigger a download
  console.log("Downloading document:", doc.name);
  toast.success(`Muat turun ${doc.name} bermula`);
};
</script>

<style scoped></style>
