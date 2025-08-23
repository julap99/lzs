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
              class="text-center flex-1 cursor-pointer"
              :class="{ 'font-semibold': currentStepA >= step.id }"
              @click="goToStepA(step.id)"
            >
              {{ step.label }}
            </div>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2.5">
            <div
              class="bg-primary h-2.5 rounded-full transition-all duration-300"
              :style="`width: ${currentStepA >= totalStepsA ? 100 : (currentStepA / totalStepsA) * 100}%`"
            ></div>
          </div>
        </div>

        <!-- Section A Form - Step 1: Penilaian Awal -->
        <FormKit
          v-if="currentStepA == 1"
          type="form"
          :actions="false"
          @submit="nextStepA"
        >
          <h3 class="text-lg font-semibold mb-4">
            A. Penilaian Awal
          </h3>

          <div class="space-y-6">
            <!-- Question 1 -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">
                Adakah tuan/puan mempunyai komitmen dan pembiayaan melibatkan kos yang tinggi?
              </label>
              <FormKit
                type="radio"
                name="komitmen_tinggi"
                :options="[
                  { label: 'Ya', value: 'Y' },
                  { label: 'Tidak', value: 'T' }
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
                :options="[
                  { label: 'Perubatan Kritikal', value: 'perubatan' },
                  { label: 'Bencana', value: 'bencana' },
                  { label: 'Kematian', value: 'kematian' },
                  { label: 'Konflik Keluarga (tiada tempat bergantung)', value: 'konflik' },
                  { label: 'Tiada Tempat Tinggal', value: 'tiadaRumah' },
                  { label: 'Selain dari di atas', value: 'lain' },
                  { label: 'Tidak mendesak', value: 'tidakMendesak' }
                ]"
                validation="required|min:1"
                validation-label="Jawapan"
                validation-messages="{
                  required: 'Sila pilih sekurang-kurangnya satu jawapan',
                  min: 'Sila pilih sekurang-kurangnya satu jawapan'
                }"
              />

              <!-- Additional input for "Selain dari di atas" -->
              <div v-if="showLainInput" class="mt-4">
                <FormKit
                  type="text"
                  name="lain_keperluan"
                  label="Sila nyatakan keperluan lain:"
                  validation="required"
                  validation-label="Keperluan lain"
                  validation-messages="{
                    required: 'Sila nyatakan keperluan lain'
                  }"
                />
              </div>
            </div>

            <!-- File Upload Section -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">
                Muat naik dokumen sokongan (PDF, JPG, PNG)
              </label>
              <FormKit
                type="file"
                name="dokumen_sokongan"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                help="Format yang dibenarkan: PDF, JPG, PNG. Saiz maksimum: 5MB setiap fail"
                validation="required|max:5|mime:application/pdf,image/jpeg,image/png"
                validation-label="Dokumen"
                validation-messages="{
                  required: 'Sila muat naik sekurang-kurangnya satu dokumen',
                  max: 'Saiz fail tidak boleh melebihi 5MB',
                  mime: 'Format fail tidak dibenarkan'
                }"
              />
            </div>

            <div class="flex justify-between gap-3 mt-6">
              <rs-button type="button" variant="secondary" @click="handleSaveStepA1"
                >Simpan</rs-button
              >
              <rs-button type="submit" variant="primary" @click="nextStepA"
                >Seterusnya ke Maklumat Kesihatan</rs-button
              >
            </div>
          </div>
        </FormKit>

        <!-- Section A Form - Step 2: Maklumat Peribadi -->
        <FormKit
          v-if="currentStepA == 2"
          type="form"
          :actions="false"
          @submit="nextStepA"
        >
          <h3 class="text-lg font-semibold mb-4">
            A. Maklumat Peribadi Asnaf (*untuk muallaf)
          </h3>

          <h3 class="text-lg font-semibold mb-4">
            I. Maklumat Peribadi
          </h3>

          <!-- Personal Information Section -->
          <div class="mb-6">
            <h4 class="text-md font-medium mb-3">Maklumat Peribadi</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit
                type="select"
                name="jenis_id"
                label="Jenis ID"
                placeholder="Pilih jenis ID"
                :options="['MyKad', 'Foreign ID']"
                validation="required"
                v-model="jenisId"
              />
              
                <FormKit
                  v-if="jenisId"
                  type="file"
                  name="dokumen_id"
                  :label="`Upload ${jenisId}`"
                  accept=".pdf,.jpg,.jpeg,.png"
                  help="Format yang dibenarkan: PDF, JPG, PNG. Saiz maksimum: 5MB"
                  validation="required|max:5|mime:application/pdf,image/jpeg,image/png"
                />

              <FormKit
                type="text"
                name="id_pengenalan"
                label="ID Pengenalan"
                help="Mengikut Dokumen Pengenalan"
                validation="required"
              />

              <FormKit
                type="text"
                name="nama"
                label="Nama"
                help="Mengikut Dokumen Pengenalan"
                validation="required"
              />

              <FormKit
                type="select"
                name="warganegara"
                label="Warganegara"
                placeholder="Pilih Warganegara"
                :options="['Malaysia', 'Lain-lain']"
                validation="required"
                v-model="malaysia"
              />

              <FormKit
               v-if="malaysia === 'Lain-lain'"
                type="file"
                name="lain_warganegara"
                label="Lain-lain Warganegara"
                help="Format yang dibenarkan: PDF, JPG, PNG. Saiz maksimum: 5MB"
                accept=".pdf,.jpg,.jpeg,.png"
                validation="required|max:5|mime:application/pdf,image/jpeg,image/png"
              />

              <FormKit
                 v-if="malaysia === 'Lain-lain'"
                type="radio"
                name="taraf_penduduk"
                label="Taraf Penduduk Tetap"
                :options="[
                  { label: 'Ya', value: 'ya' },
                  { label: 'Tidak', value: 'tidak' },
                ]"
                validation="required"
              />      

              <FormKit
                v-if="malaysia === 'Malaysia'"
                type="text"
                name="nopassport"
                label="No Passport"  
              />

              <FormKit
                v-if="malaysia === 'Malaysia'"
                type="date"
                name="passportStartDate"
                label="Tarikh mula passport"
              />
              <FormKit
                v-if="malaysia === 'Malaysia'"
                type="date"
                name="passportEndDate"
                label="Tarikh tamat passport"
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
              />

              <FormKit
                type="number"
                name="umur"
                label="Umur"
                validation="required"
              />

              <FormKit
                type="text"
                name="tempat_lahir"
                label="Tempat Lahir"
                validation="required"
              />

              <FormKit
                type="select"
                name="jantina"
                label="Jantina"
                :options="['Lelaki', 'Perempuan']"
                placeholder="Pilih Jantina"
                validation="required"
              />

              <FormKit
                type="select"
                name="agama"
                label="Agama"
                :options="[
                  'Islam',
                  'Kristian',
                  'Buddha',
                  'Hindu',
                  'Lain-lain'
                ]"
                placeholder="Pilih Agama"
                validation="required"
                v-model="agama"
              />

              <FormKit
                v-if="agama === 'Lain-lain'"
                type="text"
                name="agama_lain"
                label="Agama Lain"
                validation="required"
              />

              <FormKit
              v-model="bangsa"
                type="select"
                name="bangsa"
                label="Bangsa"
                :options="['Melayu', 'Cina', 'India', 'Lain-lain']"
                validation="required"
                placeholder="Pilih Bangsa"
              />

              <FormKit
                v-if="bangsa === 'Lain-lain'"
                type="text"
                name="bangsa_lain"
                label="Bangsa Lain"
                validation="required"
              />    

              <FormKit
                type="text"
                name="no_telefon_bimbit"
                label="No Telefon Bimbit"
              />

              <FormKit
                type="text"
                name="no_telefon_rumah"
                label="No Telefon Rumah"
              />

              <FormKit
                type="email"
                name="emel"
                label="Emel"
                validation="required|email"
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
              />

              <FormKit
                type="select"
                name="status_poligami"
                label="Status Poligami"
                :options="[
                  { label: 'Tidak', value: 'tidak' },
                  { label: 'Ya', value: 'ya' }
                ]"
                validation="required"
                v-model="statusPoligami"
              />

              <!-- Polygamy Information (Conditional) -->
              <div v-if="statusPoligami === 'ya'" class="md:col-span-2">
                <FormKit
                  type="select"
                  name="bilangan_isteri"
                  label="Bilangan Isteri"
                  placeholder="Pilih bilangan isteri" 
                  validation="required"
                  :options="[
                    { label: '2', value: 2 },
                    { label: '2', value: 2 },
                    { label: '3', value: 3 },
                    { label: '4', value: 4 }
                  ]"
                  v-model="bilanganIsteri"
                />
                <div v-for="(isteri, idx) in isteriList" :key="idx" class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <FormKit
                    type="text"
                    :name="`no_kp_isteri_${idx}`"
                    :label="`No Kp Pasangan #${idx+1}`"
                    validation="required"
                  />
                  <FormKit
                    type="text"
                    :name="`nama_isteri_${idx}`"
                    :label="`Nama Pasangan #${idx+1}`"
                validation="required"
              />
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-between gap-3 mt-6">
            <rs-button type="button" variant="secondary" @click="handleSaveStepA2"
              >Simpan</rs-button
            >
            <rs-button type="submit" variant="primary" @click="nextStepA"
              >Seterusnya ke Maklumat Islam</rs-button
            >
          </div>
        </FormKit>

        <!-- Section A Form - Step 3: Maklumat Islam -->
        <FormKit
          v-if="currentStepA === 3"
          type="form"
          @submit="nextStepA"
          :actions="false"
          id="sectionA3"
        >
          <h3 class="text-lg font-semibold mb-4">
            A. Maklumat Peribadi Asnaf (*untuk muallaf)
          </h3>

          <h3 class="text-lg font-semibold mb-4">
            II. Maklumat Islam
          </h3>
            <!-- <h4 class="text-md font-medium mb-3 text-gray-800">Maklumat Islam</h4> -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Adakah anda seorang Muallaf? -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-2">
              <label class="block text-sm font-medium text-black-700">Adakah anda seorang Muallaf?</label>
              <FormKit
                type="radio"
                name="adakah_muallaf"
                :options="[
                  { label: 'Ya', value: 'Y' },
                  { label: 'Tidak', value: 'T' }
                ]"
                validation="required"
                validation-label="Status Muallaf"
                :validation-messages="{
                  required: 'Sila pilih sama ada anda seorang muallaf atau tidak'
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
                    matches: 'Format tarikh tidak sah. Sila gunakan format DD/MM/YYYY'
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
                    required: 'Sila masukkan tarikh masuk Kelas Fardu Ain Muallaf (KFAM)',
                    matches: 'Format tarikh tidak sah. Sila gunakan format DD/MM/YYYY'
                  }"
                  v-model="formData.tarikh_masuk_kfam"
                />
              </div>
              
              <!-- Validation error message for Islamic dates -->
              <div v-if="formData.adakah_muallaf === 'Y' && !islamicDatesValidation.isValid" class="md:col-span-2 p-3 bg-red-50 border border-red-200 rounded">
                <div class="text-red-600 text-sm">
                  <strong>Ralat:</strong> {{ islamicDatesValidation.message }}
                </div>
              </div>

              <!-- Nama Selepas Islam -->
              <div v-if="formData.adakah_muallaf === 'Y'">
                <FormKit
                  type="text"
                  name="nama_selepas_islam"
                  label="Nama Selepas Islam"
                  validation="required"
                  validation-label="Nama Selepas Islam"
                  :validation-messages="{
                    required: 'Sila masukkan nama selepas Islam'
                  }"
                  v-model="formData.nama_selepas_islam"
                />
              </div>

              <!-- Nama Sebelum Islam -->
              <div v-if="formData.adakah_muallaf === 'Y'">
                <FormKit
                  type="text"
                  name="nama_sebelum_islam"
                  label="Nama Sebelum Islam"
                  validation="required"
                  validation-label="Nama Sebelum Islam"
                  :validation-messages="{
                    required: 'Sila masukkan nama sebelum Islam'
                  }"
                  v-model="formData.nama_sebelum_islam"
                />
              </div>

              <!-- Tarikh Keluar Muallaf -->
              <div v-if="formData.adakah_muallaf === 'Y'">
                <FormKit
                  type="text"
                  name="tarikh_keluar_muallaf"
                  label="Tarikh Keluar Muallaf"
                  placeholder="DD/MM/YYYY"
                  :validation-messages="{
                    required: 'Tarikh Keluar Muallaf diperlukan',
                    matches: 'Format tarikh tidak sah'
                  }"
                  :model-value="tarikhKeluarMuallaf"
                  readonly
                />
              </div>

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
                    mime: 'Format fail tidak sah. Sila pilih fail PDF, JPG, atau PNG'
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
              >Kembali</rs-button
            >
            <div class="flex gap-3">
              <rs-button type="button" variant="secondary" @click="handleSaveStepA3"
                >Simpan</rs-button
              >
              <rs-button type="submit" variant="primary" @click="nextStepA"
                >Seterusnya ke Maklumat Pendidikan</rs-button
              >
            </div>
          </div>
        </FormKit>

        <!-- Section A Form - Step 4: Maklumat Pendidikan -->
        <FormKit
          v-if="currentStepA === 4"
          type="form"
          @submit="nextStepA"
          :actions="false"
          id="sectionA4"
        >
          <h3 class="text-lg font-semibold mb-4">
            A. Maklumat Peribadi Asnaf (*untuk muallaf)
          </h3>

          <h3 class="text-lg font-semibold mb-4">
            III. Maklumat Pendidikan
          </h3>

          <!-- A. Pendidikan Individu -->
          <div class="mb-8">
            <h4 class="text-lg font-semibold mb-4 text-primary">A. Pendidikan Individu</h4>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Masih Bersekolah -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-2">
              <label class="block text-sm font-medium text-black-700">Adakah anda seorang Muallaf?</label>
              <FormKit
                type="radio"
                name="masih_bersekolah"
                :options="[
                  { label: 'Ya', value: 'Y' },
                  { label: 'Tidak', value: 'T' }
                ]"
                validation="required"
                v-model="formData.masih_bersekolah"
              />
              </div>
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
                  'Lain-lain'
                ]"
                validation="required"
                v-model="formData.pendidikan_tertinggi"
              />
            </div>

            <!-- Lain-lain Pendidikan Tertinggi -->
            <div v-if="formData.pendidikan_tertinggi === 'Lain-lain'" class="mt-4">
              <FormKit
                type="text"
                name="lain_pendidikan_tertinggi"
                label="Lain-lain Pendidikan Tertinggi *"
                validation="required"
                v-model="formData.lain_pendidikan_tertinggi"
              />
            </div>

            <!-- Tahap Pendidikan yang Dicapai -->
            <div class="mt-6">
              <FormKit
                type="checkbox"
                name="tahap_pendidikan"
                label="Tahap Pendidikan yang Dicapai *"
                placeholder="Pilih Tahap Pendidikan yang Dicapai"
                :options="[
                  'Peringkat Rendah',
                  'SRP/PMR',
                  'SPM',
                  'Sijil',
                  'Diploma',
                  'STPM',
                  'Ijazah',
                  'Lain-lain'
                ]"
                validation="required|min:1"
                v-model="formData.tahap_pendidikan"
                :validation-messages="{
                  required: 'Sila pilih sekurang-kurangnya satu tahap pendidikan',
                  min: 'Sila pilih sekurang-kurangnya satu tahap pendidikan'
                }"
              />
            </div>

            <!-- Lain-lain Tahap Pendidikan yang Dicapai -->
            <div v-if="formData.tahap_pendidikan && formData.tahap_pendidikan.includes('Lain-lain')" class="mt-4">
              <FormKit
                type="text"
                name="lain_tahap_pendidikan"
                label="Lain-lain Tahap Pendidikan yang Dicapai *"
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
          </div>

          <!-- B. Maklumat Sekolah / Institusi -->
          <div v-if="formData.masih_bersekolah === 'Y'" class="mb-8">
            <h4 class="text-lg font-semibold mb-4 text-primary">B. Maklumat Sekolah / Institusi</h4>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Jenis Sekolah / Institusi -->
              <FormKit
                type="select"
                name="jenis_sekolah"
                label="Jenis Sekolah / Institusi"
                placeholder="Pilih Jenis Sekolah / Institusi"
                :options="[
                  'Pra Sekolah',
                  'Sekolah Rendah Kebangsaan',
                  'Sekolah Menengah Kebangsaan',
                  'Sekolah Menengah Agama',
                  'Sekolah Rendah Kebangsaan dan Agama',
                  'IPTA',
                  'IPTS',
                  'Maahad Tahfiz'
                ]"
                v-model="formData.jenis_sekolah"
              />

              <!-- Kategori Sekolah / Institusi -->
              <FormKit
                type="select"
                name="kategori_sekolah"
                label="Kategori Sekolah / Institusi"
                placeholder="Pilih Kategori Sekolah / Institusi"
                :options="[
                  'SEK.MEN',
                  'SRK',
                  'IPTA',
                  'IPTS',
                  'SRA',
                  'KAFA'
                ]"
                v-model="formData.kategori_sekolah"
              />
            </div>

            <!-- Conditional fields when Kategori Sekolah is selected -->
            <div v-if="formData.kategori_sekolah" class="mt-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Tahun Bersekolah -->
                <FormKit
                  type="text"
                  name="tahun_bersekolah"
                  label="Tahun Bersekolah (YYYY) *"
                  validation="required"
                  placeholder="Contoh: 2024"
                  v-model="formData.tahun_bersekolah"
                />

                <!-- Tahun / Tingkatan / Tahun Pengajian / Semester -->
                <FormKit
                  type="text"
                  name="tahun_tingkatan"
                  label="Tahun / Tingkatan / Tahun Pengajian / Semester *"
                  validation="required"
                  placeholder="Contoh: Tingkatan 3, Tahun 2, Semester 1"
                  v-model="formData.tahun_tingkatan"
                />
              </div>

              <!-- Nama Sekolah / Institusi -->
              <div class="mt-4">
                <FormKit
                  type="text"
                  name="nama_sekolah"
                  label="Nama Sekolah / Institusi *"
                  validation="required"
                  v-model="formData.nama_sekolah"
                />
              </div>

              <!-- Address fields -->
              <div class="mt-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormKit
                    type="text"
                    name="alamat_sekolah_1"
                    label="Alamat 1 *"
                    validation="required"
                    v-model="formData.alamat_sekolah_1"
                  />

                  <FormKit
                    type="text"
                    name="alamat_sekolah_2"
                    label="Alamat 2"
                    v-model="formData.alamat_sekolah_2"
                  />
                </div>

                <div class="mt-4">
                  <FormKit
                    type="text"
                    name="alamat_sekolah_3"
                    label="Alamat 3"
                    v-model="formData.alamat_sekolah_3"
                  />
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <FormKit
                    type="text"
                    name="daerah_sekolah"
                    label="Daerah *"
                    validation="required"
                    v-model="formData.daerah_sekolah"
                  />

                  <FormKit
                    type="text"
                    name="bandar_sekolah"
                    label="Bandar *"
                    validation="required"
                    v-model="formData.bandar_sekolah"
                  />

                  <FormKit
                    type="text"
                    name="poskod_sekolah"
                    label="Poskod *"
                    validation="required"
                    v-model="formData.poskod_sekolah"
                  />
                </div>
              </div>

              <!-- Tinggal Bersama Keluarga -->
              <div class="mt-6">
                <FormKit
                  type="radio"
                  name="tinggal_bersama_keluarga"
                  label="Tinggal Bersama Keluarga? *"
                  :options="[
                    { label: 'Ya', value: 'Y' },
                    { label: 'Tidak', value: 'T' }
                  ]"
                  validation="required"
                  v-model="formData.tinggal_bersama_keluarga"
                />
              </div>

              <!-- Asrama / Rumah Sewa -->
              <div v-if="formData.tinggal_bersama_keluarga === 'T'" class="mt-4">
                <FormKit
                  type="text"
                  name="asrama_rumah_sewa"
                  label="Asrama / Rumah Sewa *"
                  validation="required"
                  v-model="formData.asrama_rumah_sewa"
                />
              </div>

              <!-- Bidang / Kursus Pengajian -->
              <div class="mt-6">
                <FormKit
                  type="select"
                  name="bidang_kursus"
                  label="Bidang / Kursus Pengajian"
                  :options="[
                    'Sijil',
                    'SKM',
                    'Diploma',
                    'Ijazah Sarjana Muda'
                  ]"
                  v-model="formData.bidang_kursus"
                />
              </div>

              <!-- Jurusan / Bidang -->
              <div v-if="formData.bidang_kursus" class="mt-4">
                <FormKit
                  type="text"
                  name="jurusan_bidang"
                  label="Jurusan / Bidang *"
                  validation="required"
                  v-model="formData.jurusan_bidang"
                />
              </div>

              <!-- Pembiayaan Pengajian -->
              <div class="mt-6">
                <FormKit
                  type="checkbox"
                  name="pembiayaan_pengajian"
                  label="Pembiayaan Pengajian *"
                  :options="[
                    'JPA',
                    'PTPTN',
                    'LZS',
                    'Tiada',
                    'Lain-lain'
                  ]"
                  validation="required|min:1"
                  v-model="formData.pembiayaan_pengajian"
                  :validation-messages="{
                    required: 'Sila pilih sekurang-kurangnya satu pembiayaan',
                    min: 'Sila pilih sekurang-kurangnya satu pembiayaan'
                  }"
                />
              </div>

              <!-- Lain-lain Pembiayaan Pengajian -->
              <div v-if="formData.pembiayaan_pengajian && formData.pembiayaan_pengajian.includes('Lain-lain')" class="mt-4">
                <FormKit
                  type="text"
                  name="lain_pembiayaan"
                  label="Lain-lain Pembiayaan Pengajian *"
                  validation="required"
                  v-model="formData.lain_pembiayaan"
                />
              </div>

              <!-- Catatan -->
              <div class="mt-6">
                <FormKit
                  type="textarea"
                  name="catatan_pendidikan"
                  label="Catatan"
                  v-model="formData.catatan_pendidikan"
                  rows="3"
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
              <rs-button type="button" variant="secondary" @click="handleSaveStepA4"
                >Simpan</rs-button
              >
              <rs-button type="submit" variant="primary" @click="nextStepA"
                >Seterusnya ke Maklumat Bank</rs-button
              >
            </div>
          </div>
        </FormKit>

        <!-- Section A Form - Step 5: Maklumat Bank -->
        <FormKit
          v-if="currentStepA === 5"
          type="form"
          @submit="nextStepA"
          :actions="false"
          id="sectionA5"
        >
          <h3 class="text-lg font-semibold mb-4">
            A. Maklumat Peribadi Asnaf (*untuk muallaf)
          </h3>

          <h3 class="text-lg font-semibold mb-4">
            IV. Maklumat Bank
          </h3>

          <div class="mb-6">
            <!-- <h4 class="text-md font-medium mb-3">Maklumat Bank</h4> -->
            
            <!-- Kaedah Pembayaran -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-2">
              <label class="block text-sm font-medium text-black-700">Kaedah Pembayaran </label>
            <div class="mb-6">
              <FormKit
                type="radio"
                name="kaedah_pembayaran"
                :options="paymentMethodOptions"
                validation="required"
                v-model="formData.kaedah_pembayaran"
                :validation-messages="{
                  required: 'Kaedah pembayaran adalah wajib'
                }"
              />
            </div>
            </div>
            </div>

            <!-- A. Jika Kaedah Pembayaran = Akaun -->
            <div v-if="formData.kaedah_pembayaran === 'akaun'" class="mb-6">
              <h5 class="text-md font-medium mb-4 text-primary">A. Maklumat Akaun Bank</h5>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Nama Bank -->
                <FormKit
                  type="select"
                  name="nama_bank"
                  label="Nama Bank *"
                  placeholder="Pilih nama bank"
                  :options="bankOptions"
                  validation="required"
                  v-model="formData.nama_bank"
                />

                <!-- Swift Code (Read Only) -->
                <FormKit
                  v-if="formData.nama_bank"
                  type="text"
                  name="swift_code"
                  label="Swift Code"
                  v-model="formData.swift_code"
                  :value="selectedBankSwiftCode"
                  readonly
                  help="Swift Code dipaparkan secara automatik"
                />

                <!-- No. Akaun Bank -->
                <FormKit
                  type="text"
                  name="no_akaun_bank"
                  label="No. Akaun Bank *"
                  validation="required"
                  v-model="formData.no_akaun_bank"
                />

                <!-- Nama Pemegang Akaun -->
                <FormKit
                  type="text"
                  name="nama_pemegang_akaun"
                  label="Nama Pemegang Akaun *"
                  validation="required"
                  v-model="formData.nama_pemegang_akaun"
                />
              </div>
            </div>

            <!-- B. Jika Kaedah Pembayaran = Tiada -->
            <div v-if="formData.kaedah_pembayaran === 'tiada'" class="mb-6">
              <h5 class="text-md font-medium mb-4 text-primary">B. Sebab Tiada Akaun Bank</h5>
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
                    required: 'Sila pilih sebab tiada akaun bank'
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
              <rs-button type="button" variant="secondary" @click="handleSaveStepA5"
              >Simpan</rs-button
            >
            <rs-button type="submit" variant="primary" @click="nextStepA"
              >Seterusnya ke Maklumat Kesihatan</rs-button
            >
            </div>
          </div>
        </FormKit>

        <!-- Section A Form - Step 6: Maklumat Kesihatan -->
        <FormKit
          v-if="currentStepA === 6"
          type="form"
          @submit="nextStepA"
          :actions="false"
          id="sectionA6"
        >
          <h3 class="text-lg font-semibold mb-4">V. Maklumat Kesihatan</h3>

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
            <h5 class="text-lg font-semibold mb-4 text-primary">Maklumat Sakit Kronik</h5>
            
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
            <h5 class="text-lg font-semibold mb-4 text-primary"> Maklumat OKU</h5>
            
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
            <h5 class="text-lg font-semibold mb-4 text-primary"> Maklumat Uzur</h5>
            
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
          <div v-if="formData.tahap_kesihatan && formData.tahap_kesihatan !== 'Sihat'" class="mb-6">
            <h5 class="text-lg font-semibold mb-4 text-primary">Dokumen Sokongan</h5>
            
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
              <rs-button type="button" variant="secondary" @click="handleSaveStepA2"
                >Simpan</rs-button
              >
              <rs-button type="submit" variant="primary" @click="nextStepA"
                >Seterusnya ke Maklumat Kediaman</rs-button
              >
            </div>
          </div>
        </FormKit>

        <!-- Section A Form - Step 7: Kemahiran -->
        <FormKit
          v-if="currentStepA === 7"
          type="form"
          @submit="nextStepA"
          :actions="false"
          id="sectionA7"
        >
          <h3 class="text-lg font-semibold mb-4">VI. Kemahiran</h3>

          <FormKit
            type="select"
            name="kemahiran"
            label="Kemahiran"
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
          />

          <FormKit
            type="text"
            name="lain_lain_kemahiran"
            label="Lain-lain Kemahiran"
            validation="required"
            v-if="formData.kemahiran === 'Lain-lain'"
            placeholder="Nyatakan kemahiran lain"
          />

          <div class="flex justify-between gap-3 mt-6">
            <rs-button
              type="button"
              variant="primary-outline"
              @click="prevStepA"
              >Kembali</rs-button
            >
            <div class="flex gap-3">
              <rs-button type="button" variant="secondary" @click="handleSaveStepA7"
                >Simpan</rs-button
              >
              <rs-button type="submit" variant="primary" @click="nextStepA"
                >Seterusnya ke Maklumat Alamat</rs-button
              >
            </div>
          </div>
        </FormKit>

        <!-- Section A Form - Step 8: Maklumat Alamat -->
        <FormKit
          v-if="currentStepA === 8"
          type="form"
          @submit="nextStepA"
          :actions="false"
          id="sectionA8"
        >
          <h3 class="text-lg font-semibold mb-4">VII. Maklumat Alamat</h3>

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
                disabled
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
                  required: 'Daerah adalah wajib'
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
                  required: 'Bandar adalah wajib'
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
                  required: 'Poskod adalah wajib'
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
                  required: 'Kariah adalah wajib'
                }"
              />

              <div class="flex gap-2">
                <FormKit
                  v-model="formData.addressInfo.geolokasi"
                  label="Geolokasi"
                  type="text"
                  placeholder="Auto isi lokasi berdasarkan alamat"
                  class="flex-1"
                  readonly
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
                  min: 'Tempoh menetap mesti 0 atau lebih'
                }"
              />
            </div>
          </div>

          <!-- Maklumat Tempat Tinggal Section -->
          <div class="mb-6">
            <h4 class="text-md font-medium mb-3">Maklumat Tempat Tinggal</h4>
            
            <!-- Hidden field for ID type -->
            <FormKit
              type="hidden"
              name="jenis_id_alamat"
              :value="jenisId"
            />

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
                  'Lain-lain'
                ]"
                validation="required"
                v-model="formData.addressInfo.status_kediaman"
                :validation-messages="{
                  required: 'Status kediaman adalah wajib'
                }"
              />

              <FormKit
                type="text"
                name="lain_lain_status_kediaman"
                label="Lain-lain Status Kediaman Tempat Tinggal"
                validation="required"
                v-if="formData.addressInfo.status_kediaman === 'Lain-lain'"
                placeholder="Nyatakan status kediaman lain"
                :validation-messages="{
                  required: 'Sila nyatakan status kediaman lain'
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
                  'Lain-lain'
                ]"
                validation="required"
                v-model="formData.addressInfo.tapak_rumah"
                :validation-messages="{
                  required: 'Tapak rumah adalah wajib'
                }"
              />

              <FormKit
                type="text"
                name="lain_lain_tapak_rumah"
                label="Lain-lain Tapak Rumah"
                validation="required"
                v-if="formData.addressInfo.tapak_rumah === 'Lain-lain'"
                placeholder="Nyatakan tapak rumah lain"
                :validation-messages="{
                  required: 'Sila nyatakan tapak rumah lain'
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
                  'Lain-lain'
                ]"
                validation="required"
                v-model="formData.addressInfo.jenis_rumah"
                :validation-messages="{
                  required: 'Jenis rumah adalah wajib'
                }"
              />

              <FormKit
                type="text"
                name="lain_lain_jenis_rumah"
                label="Lain-lain Jenis Rumah"
                validation="required"
                v-if="formData.addressInfo.jenis_rumah === 'Lain-lain'"
                placeholder="Nyatakan jenis rumah lain"
                :validation-messages="{
                  required: 'Sila nyatakan jenis rumah lain'
                }"
              />

              <FormKit
                type="select"
                name="binaan_rumah"
                label="Binaan Rumah"
                :options="[
                  'Batu',
                  'Kayu',
                  'Separa Batu',
                  'Lain-lain'
                ]"
                validation="required"
                v-model="formData.addressInfo.binaan_rumah"
                :validation-messages="{
                  required: 'Binaan rumah adalah wajib'
                }"
              />

              <FormKit
                type="text"
                name="lain_lain_binaan_rumah"
                label="Lain-lain Binaan Rumah"
                validation="required"
                v-if="formData.addressInfo.binaan_rumah === 'Lain-lain'"
                    placeholder="Nyatakan binaan rumah lain"
                :validation-messages="{
                  required: 'Sila nyatakan binaan rumah lain'
                }"
              />

              <FormKit
                type="select"
                name="keadaan_kediaman"
                label="Keadaan Kediaman"
                :options="[
                  'Baik',
                  'Sempurna',
                  'Uzur',
                  'Separa Uzur'
                ]"
                validation="required"
                v-model="formData.addressInfo.keadaan_kediaman"
                :validation-messages="{
                  required: 'Keadaan kediaman adalah wajib'
                }"
              />
            </div>

            <!-- Kemudahan Asas Section -->
            <div class="mt-6">
              <h5 class="text-md font-medium mb-3">Kemudahan Asas</h5>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">Bekalan Air</label>
                  <FormKit
                    type="radio"
                    name="bekalan_air"
                    :options="[
                      { label: 'Ada', value: 'ada' },
                      { label: 'Tiada', value: 'tiada' }
                    ]"
                    validation="required"
                    v-model="formData.addressInfo.bekalan_air"
                    :validation-messages="{
                      required: 'Sila pilih status bekalan air'
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
                    required: 'Anggaran bil air adalah wajib'
                  }"
                />

                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">Bekalan Elektrik</label>
                  <FormKit
                    type="radio"
                    name="bekalan_elektrik"
                    :options="[
                      { label: 'Ada', value: 'ada' },
                      { label: 'Tiada', value: 'tiada' }
                    ]"
                    validation="required"
                    v-model="formData.addressInfo.bekalan_elektrik"
                    :validation-messages="{
                      required: 'Sila pilih status bekalan elektrik'
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
                    required: 'Anggaran bil elektrik adalah wajib'
                  }"
                />

                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">Bil Penyelenggaraan</label>
                  <FormKit
                    type="radio"
                    name="penyelenggaraan"
                    :options="[
                      { label: 'Ada', value: 'ada' },
                      { label: 'Tiada', value: 'tiada' }
                    ]"
                    validation="required"
                    v-model="formData.addressInfo.penyelenggaraan"
                    :validation-messages="{
                      required: 'Sila pilih status bil penyelenggaraan'
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
                    required: 'Anggaran bil penyelenggaraan adalah wajib'
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
                  v-if="formData.addressInfo.status_kediaman === 'Milik Sendiri Berbayar'"
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
                    required: 'Dokumen perjanjian sewa adalah wajib untuk status sewa'
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
              <rs-button type="button" variant="secondary" @click="handleSaveStepA8"
                >Simpan</rs-button
              >
              <rs-button type="submit" variant="primary" @click="nextStepA"
                >Seterusnya ke Maklumat Pekerjaan</rs-button
              >
            </div>
          </div>
        </FormKit>

        <!-- Section A Form - Step 9: Maklumat Pekerjaan -->
        <FormKit
          v-if="currentStepA === 9"
          type="form"
          @submit="nextStepA"
          :actions="false"
          id="sectionA9"
        >
          <h3 class="text-lg font-semibold mb-4">VIII. Maklumat Pekerjaan</h3>

          <!-- Hidden field for ID type -->
          <FormKit
            type="hidden"
            name="jenis_id_pekerjaan"
            :value="jenisId"
          />

          <!-- Employment Status -->
          <div class="mb-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-2">
              <label class="block text-sm font-medium text-black-700">Status Pekerjaan </label>
            <FormKit
              type="radio"
              name="status_pekerjaan"
              :options="[
                { label: 'Bekerja', value: 'bekerja' },
                { label: 'Tidak Bekerja', value: 'tidak_bekerja' }
              ]"
              validation="required"
              v-model="formData.status_pekerjaan"
              :validation-messages="{
                required: 'Sila pilih status pekerjaan'
              }"
            />
          </div>
          </div>
          </div>
          <!-- Employment Details (shown only when working) -->
          <div v-if="formData.status_pekerjaan === 'bekerja'" class="mb-6">
            <h4 class="text-md font-medium mb-3">Butiran Pekerjaan</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit
                type="text"
                name="jenis_pekerjaan"
                label="Jenis Pekerjaan"
                validation="required"
                v-model="formData.jenis_pekerjaan"
                :validation-messages="{
                  required: 'Jenis pekerjaan adalah wajib'
                }"
              />

              <FormKit
                type="select"
                name="sektor_pekerjaan"
                label="Sektor Pekerjaan"
                :options="[
                  'Kerajaan',
                  'Swasta',
                  'Badan Berkanun',
                  'Kerja Sendiri',
                  'Lain-lain'
                ]"
                validation="required"
                v-model="formData.sektor_pekerjaan"
                :validation-messages="{
                  required: 'Sektor pekerjaan adalah wajib'
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
                  required: 'Sila nyatakan sektor pekerjaan lain'
                }"
              />

              <FormKit
                type="text"
                name="no_telefon_pejabat"
                label="No. Telefon Pejabat"
                validation="required"
                v-model="formData.no_telefon_pejabat"
                :validation-messages="{
                  required: 'No. telefon pejabat adalah wajib'
                }"
              />

              <FormKit
                type="text"
                name="nama_majikan"
                label="Nama Majikan"
                validation="required"
                v-model="formData.nama_majikan"
                :validation-messages="{
                  required: 'Nama majikan adalah wajib'
                }"
              />

              <FormKit
                type="text"
                name="no_telefon_majikan"
                label="No. Telefon Majikan"
                validation="required"
                v-model="formData.no_telefon_majikan"
                :validation-messages="{
                  required: 'No. telefon majikan adalah wajib'
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
                    required: 'Alamat majikan adalah wajib'
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
                  required: 'Bandar adalah wajib'
                }"
              />

              <FormKit
                type="text"
                name="poskod_majikan"
                label="Poskod"
                validation="required"
                v-model="formData.poskod_majikan"
                :validation-messages="{
                  required: 'Poskod adalah wajib'
                }"
              />

              <FormKit
                type="text"
                name="daerah_majikan"
                label="Daerah"
                validation="required"
                v-model="formData.daerah_majikan"
                :validation-messages="{
                  required: 'Daerah adalah wajib'
                }"
              />

              <FormKit
                type="text"
                name="negeri_majikan"
                label="Negeri"
                validation="required"
                v-model="formData.negeri_majikan"
                :validation-messages="{
                  required: 'Negeri adalah wajib'
                }"
              />

              <FormKit
                type="text"
                name="negara_majikan"
                label="Negara"
                validation="required"
                v-model="formData.negara_majikan"
                :validation-messages="{
                  required: 'Negara adalah wajib'
                }"
              />

              <FormKit
                type="text"
                name="jawatan"
                label="Jawatan"
                validation="required"
                v-model="formData.jawatan"
                :validation-messages="{
                  required: 'Jawatan adalah wajib'
                }"
              />

              <FormKit
                type="select"
                name="status_jawatan"
                label="Status Jawatan"
                :options="[
                  'Tetap',
                  'Kontrak',
                  'Sementara'
                ]"
                validation="required"
                v-model="formData.status_jawatan"
                :validation-messages="{
                  required: 'Status jawatan adalah wajib'
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
                  required: 'Pendapatan kasar adalah wajib'
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
                    mime: 'Format fail tidak dibenarkan'
                  }"
                />
              </div>
            </div>
          </div>

          <!-- Income Source (shown only when working) -->
          <div v-if="formData.status_pekerjaan === 'bekerja'" class="mb-6">
            <h4 class="text-md font-medium mb-3">Sumber Pendapatan</h4>
            <FormKit
              type="checkbox"
              name="sumber_pendapatan"
              :options="[
                'Pengajian',
                'Sumbangan keluarga',
                'Individu',
                'Institusi',
                'Sumbangan Agensi',
                'Lain-lain'
              ]"
              validation="required|min:1"
              :validation-messages="{
                required: 'Sila pilih sekurang-kurangnya satu sumber pendapatan',
                min: 'Sila pilih sekurang-kurangnya satu sumber pendapatan'
              }"
              v-model="formData.sumber_pendapatan"
            />

            <div v-if="showLainLainSumberPendapatan" class="mt-4">
              <FormKit
                type="text"
                name="lain_lain_sumber_pendapatan"
                label="Lain-lain Sumber Pendapatan"
                validation="required"
                v-model="formData.lain_lain_sumber_pendapatan"
                :validation-messages="{
                  required: 'Sila nyatakan sumber pendapatan lain'
                }"
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
              <rs-button type="button" variant="secondary" @click="handleSaveStepA9"
                >Simpan</rs-button
              >
              <rs-button type="submit" variant="primary" @click="nextStepA"
                >Seterusnya ke Maklumat Pendapatan</rs-button
              >
            </div>
          </div>
        </FormKit>

        <!-- Section A Form - Step 10: Maklumat Pendapatan -->
        <FormKit
          v-if="currentStepA === 10"
          type="form"
          @submit="nextStepA"
          :actions="false"
          id="sectionA10"
        >
          <h3 class="text-lg font-semibold mb-4">
            X. Maklumat Pendapatan
          </h3>

          <!-- Income Information -->
          <div class="mb-6">
            <h4 class="text-md font-medium mb-3">Maklumat Pendapatan dan Perbelanjaan</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit
                type="number"
                name="gaji_elaun_pendapatan"
                label="Gaji / Elaun / Pendapatan Diperoleh (RM)"
                step="0.01"
                min="0"
                validation="required"
                :validation-messages="{
                  required: 'Gaji / Elaun / Pendapatan Diperoleh adalah wajib'
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
                  required: 'Pendapatan Isteri/Suami/Ibubapa/Penjaga adalah wajib'
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
                  required: 'Pencen / PERKESO adalah wajib'
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
                  required: 'Sumbangan Anak-anak adalah wajib'
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
                  required: 'Bantuan Jabatan Kebajikan Masyarakat adalah wajib'
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
                  required: 'Takaful adalah wajib'
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
                  required: 'Sewa Rumah / Tanah / Kedai adalah wajib'
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
                  required: 'Pendapatan Tanggungan yang Tinggal Serumah adalah wajib'
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
                  required: 'Pendapatan Lain-lain adalah wajib'
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
                  required: 'Perbelanjaan Makanan dan Minuman adalah wajib'
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
                  required: 'Sewa / Bayaran Pinjaman Perumahan adalah wajib'
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
                  required: 'Perbelanjaan Persekolahan Anak adalah wajib'
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
                  required: 'Pengangkutan / Tambang Bas Sekolah adalah wajib'
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
                  required: 'Bil Utiliti adalah wajib'
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
              <rs-button type="button" variant="secondary" @click="handleSaveStepA9"
                >Simpan</rs-button
              >
              <rs-button type="submit" variant="primary" @click="nextStepA"
                >Seterusnya ke Maklumat Kediaman</rs-button
              >
            </div>
          </div>
        </FormKit>

        <!-- Section A Form - Step 11: Maklumat Kediaman -->
        <FormKit
          v-if="currentStepA === 11"
          type="form"
          @submit="nextStepA"
          :actions="false"
          id="sectionA11"
        >
          <h3 class="text-lg font-semibold mb-4">
            XI. Maklumat Kediaman/Tempat Tinggal
          </h3>

          <!-- Alamat Section -->
          <div class="mb-6">
            <h4 class="text-md font-medium mb-3">Alamat Terkini</h4>
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
                />

                <FormKit
                  type="textarea"
                  name="alamat3"
                  label="Alamat 3"
                  placeholder="Sila masukkan alamat 3 (tidak wajib)"
                  v-model="formData.addressInfo.alamat3"
                />
              </div>

              <div class="flex gap-2">
                <FormKit
                  v-model="formData.addressInfo.location"
                  label="Lokasi"
                  type="text"
                  validation="required"
                  validation-visibility="dirty"
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
                type="select"
                name="daerah"
                label="Daerah"
                placeholder="Pilih daerah"
                :options="daerahOptions"
                validation="required"
                v-model="formData.addressInfo.daerah"
              />

              <FormKit
                type="text"
                name="poskod"
                label="Poskod"
                validation="required|number|length:5"
                validation-messages="{
                  required: 'Poskod diperlukan',
                  number: 'Poskod mesti dalam bentuk nombor',
                  length: 'Poskod mesti 5 digit'
                }"
              />

              <FormKit
                type="select"
                name="kariah"
                label="Kariah"
                placeholder="Pilih kariah"
                :options="kariahOptions"
                validation="required"
              />

              <FormKit
                type="number"
                name="tempoh_bermastautin"
                label="Tempoh Bermastautin (Tahun)"
                min="0"
                validation="required|min:0"
              />

              <div class="flex gap-2">
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

              <FormKit
                type="text"
                name="negeri"
                label="Negeri"
                value="Selangor"
                disabled
              />
            </div>
          </div>

          <FormKit
            type="select"
            name="status_kediaman"
            label="Status Kediaman/Tempat Tinggal"
            :options="[
              'Milik Sendiri Tidak Berbayar',
              'Milik Sendiri Berbayar',
              'Sewa',
              'Kuarters Majikan',
              'Tumpang Rumah Ibu/Bapa/Mertua',
              'Pusaka',
              'Sumbangan LZS/PPRT/RUSDA',
              'Lain-lain',
            ]"
            validation="required"
            v-model="statusKediaman"
          />

          <div v-if="statusKediaman === 'Sewa'" class="mt-4">
            <FormKit
              type="file"
              name="dokumen_sewa"
              label="Upload Dokumen Sewa"
              accept=".pdf,.jpg,.jpeg,.png"
              help="Format yang dibenarkan: PDF, JPG, PNG. Saiz maksimum: 5MB"
              validation="required|max:5|mime:application/pdf,image/jpeg,image/png"
            />
          </div>

          <FormKit
            type="select"
            name="tapak_rumah"
            label="Tapak Rumah"
            :options="[
              'Milik Sendiri',
              'Tanah Wakaf',
              'Tanah Kerajaan/Persendirian',
              'Setinggan (Izin)',
              'Kebenaran Menduduki Sementara (TOL)',
              'Menumpang/Sewa/Pajak Daripada Orang Lain',
              'Tanah Keluarga',
              'Lain-lain',
            ]"
            validation="required"
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
          />

          <FormKit
            type="select"
            name="binaan_rumah"
            label="Binaan Rumah"
            :options="['Batu', 'Kayu', 'Separa Batu', 'Lain-lain']"
            validation="required"
          />

          <FormKit
            type="select"
            name="keadaan_kediaman"
            label="Keadaan Kediaman"
            :options="['Baik/Sempurna', 'Uzur', 'Separa Uzur']"
            validation="required"
          />

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <FormKit
                type="select"
                name="bekalan_air"
                label="Kemudahan Asas Bekalan Air"
                :options="['Ada', 'Tiada']"
                validation="required"
              />
              <FormKit
                type="number"
                name="bil_air"
                label="Anggaran Bil Sebulan (RM)"
                step="0.01"
                min="0"
              />
            </div>

            <div>
              <FormKit
                type="select"
                name="bekalan_elektrik"
                label="Bekalan Elektrik"
                :options="['Ada', 'Tiada']"
                validation="required"
              />
              <FormKit
                type="number"
                name="bil_elektrik"
                label="Anggaran Bil Sebulan (RM)"
                step="0.01"
                min="0"
              />
            </div>

            <div>
              <FormKit
                type="select"
                name="penyelenggaraan"
                label="Bil Penyelenggaraan"
                :options="['Ada', 'Tiada']"
                validation="required"
              />
              <FormKit
                type="number"
                name="bil_penyelenggaraan"
                label="Anggaran Bil Sebulan (RM)"
                step="0.01"
                min="0"
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
              <rs-button type="button" variant="secondary" @click="handleSaveStepA10"
                >Simpan</rs-button
              >
              <rs-button type="submit" variant="primary" @click="nextStepA"
                >Seterusnya ke Maklumat Pinjaman</rs-button
              >
            </div>
          </div>
        </FormKit>

        <!-- Section A Form - Step 12: Maklumat Pinjaman -->
        <FormKit
          v-if="currentStepA === 12"
          type="form"
          @submit="nextStepA"
          :actions="false"
          id="sectionA12"
        >
          <h3 class="text-lg font-semibold mb-4">XII. Maklumat Pinjaman Harta</h3>

          <FormKit
            type="text"
            name="pemberi_pinjaman"
            label="Nama Institusi/Individu Pemberi Pinjaman"
            v-model="pemberiPinjaman"
          />

          <FormKit
            type="text"
            name="jenis_pinjaman"
            label="Jenis Pinjaman"
            v-model="jenisPinjaman"
          />

          <FormKit
            type="number"
            name="bayaran_bulanan"
            label="Amaun Bayaran Bulanan (RM)"
            step="0.01"
            min="0"
            v-model="bayaranBulanan"
          />

          <FormKit
            type="number"
            name="jumlah_perbelanjaan"
            label="Jumlah Keseluruhan Perbelanjaan (RM)"
            step="0.01"
            min="0"
            v-model="jumlahPerbelanjaan"
          />

          <FormKit
            type="date"
            name="tahun_mula_pinjaman"
            label="Tahun Mula Pinjaman"
            v-model="tahunMulaPinjaman"
          />

          <FormKit
            type="date"
            name="tahun_akhir_pinjaman"
            label="Tahun Akhir Pinjaman"
            v-model="tahunAkhirPinjaman"
          />

          <FormKit
            type="file"
            name="dokumen_pinjaman"
            label="Upload Dokumen Pinjaman"
            accept=".pdf,.jpg,.jpeg,.png"
            help="Format yang dibenarkan: PDF, JPG, PNG. Saiz maksimum: 5MB"
            validation="required|max:5|mime:application/pdf,image/jpeg,image/png"
          />

          <div class="flex justify-between gap-3 mt-6">
            <rs-button
              type="button"
              variant="primary-outline"
              @click="prevStepA"
              >Kembali</rs-button
            >
            <div class="flex gap-3">
              <rs-button type="button" variant="secondary" @click="handleSaveStepA13"
                >Simpan</rs-button
              >
              <rs-button type="submit" variant="primary" @click="nextStepA"
                >Seterusnya ke Maklumat Pemilikan</rs-button
              >
            </div>
          </div>
        </FormKit>

        <!-- Section A Form - Step 13: Maklumat Pemilikan -->
        <FormKit
          v-if="currentStepA === 13"
          type="form"
          @submit="nextStepA"
          :actions="false"
          id="sectionA13"
        >
          <h3 class="text-lg font-semibold mb-4">XIII. Maklumat Pemilikan</h3>

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
          <FormKit
            type="text"
            name="kenderaan"
            label="Kenderaan (Nyatakan Unit)"
            help="Contoh: Basikal 1, Kereta 1"
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

          <div class="flex justify-between gap-3 mt-6">
            <rs-button
              type="button"
              variant="primary-outline"
              @click="prevStepA"
              >Kembali</rs-button
            >
            <div class="flex gap-3">
              <rs-button type="button" variant="secondary" @click="handleSaveStepA13"
                >Simpan</rs-button
              >
              <rs-button type="button" variant="primary" @click="nextStepA"
                >Seterusnya ke Maklumat Barangan Rumah</rs-button
              >
            </div>
          </div>
        </FormKit>

        <!-- Section A Form - Step 14: Maklumat Barangan Rumah -->
        <FormKit
          v-if="currentStepA === 14"
          type="form"
          @submit="nextStepA"
          :actions="false"
          id="sectionA14"
        >
          <h3 class="text-lg font-semibold mb-4">
            XIV. Maklumat Pemilikan Barangan Rumah
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormKit
              type="select"
              name="television"
              label="Television"
              :options="[
                { label: 'Ya', value: 'ya' },
                { label: 'Tidak', value: 'tidak' }
              ]"
              v-model="formData.television"
            />

            <FormKit
              type="select"
              name="radio"
              label="Radio"
              :options="[
                { label: 'Ya', value: 'ya' },
                { label: 'Tidak', value: 'tidak' }
              ]"
              v-model="formData.radio"
            />

            <FormKit
              type="select"
              name="perabot"
              label="Perabot"
              :options="[
                { label: 'Ya', value: 'ya' },
                { label: 'Tidak', value: 'tidak' }
              ]"
              v-model="formData.perabot"
            />

            <FormKit
              type="select"
              name="telefon_bimbit"
              label="Telefon Bimbit"
              :options="[
                { label: 'Ya', value: 'ya' },
                { label: 'Tidak', value: 'tidak' }
              ]"
              v-model="formData.telefon_bimbit"
            />

            <FormKit
              type="select"
              name="mesin_basuh"
              label="Mesin Basuh"
              :options="[
                { label: 'Ya', value: 'ya' },
                { label: 'Tidak', value: 'tidak' }
              ]"
              v-model="formData.mesin_basuh"
            />

            <FormKit
              type="select"
              name="astro"
              label="Astro"
              :options="[
                { label: 'Ya', value: 'ya' },
                { label: 'Tidak', value: 'tidak' }
              ]"
              v-model="formData.astro"
            />

            <FormKit
              type="select"
              name="video_player_cd_dvd"
              label="Video / Player / CD / DVD"
              :options="[
                { label: 'Ya', value: 'ya' },
                { label: 'Tidak', value: 'tidak' }
              ]"
              v-model="formData.video_player_cd_dvd"
            />

            <FormKit
              type="select"
              name="peti_ais"
              label="Peti Ais"
              :options="[
                { label: 'Ya', value: 'ya' },
                { label: 'Tidak', value: 'tidak' }
              ]"
              v-model="formData.peti_ais"
            />

            <FormKit
              type="select"
              name="dapur_gas"
              label="Dapur Gas"
              :options="[
                { label: 'Ya', value: 'ya' },
                { label: 'Tidak', value: 'tidak' }
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
              <rs-button type="button" variant="secondary" @click="handleSaveStepA14"
                >Simpan</rs-button
              >
              <rs-button type="submit" variant="primary" @click="nextStepA"
                >Seterusnya ke Maklumat Waris</rs-button
              >
            </div>
          </div>
        </FormKit>

        <!-- Section A Form - Step 15: Maklumat Waris -->
        <FormKit
          v-if="currentStepA === 15"
          type="form"
          @submit="nextStepA"
          :actions="false"
          id="sectionA15"
        >
          <h3 class="text-lg font-semibold mb-4">
            XV. Maklumat Waris
          </h3>

          <div
            v-for="(heir, index) in formData.heirs"
            :key="index"
            class="mb-8 p-4 border border-gray-200 rounded-lg"
          >
            <div class="flex justify-between items-center mb-4">
              <h4 class="text-md font-medium">
                Waris #{{ index + 1 }}
              </h4>
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
                type="text"
                :name="`heir${index}Name`"
                label="Nama Waris"
                validation="required"
                v-model="heir.name"
                :validation-messages="{
                  required: 'Nama waris adalah wajib',
                }"
              />

              <FormKit
                type="text"
                :name="`heir${index}Relationship`"
                label="Hubungan"
                validation="required"
                v-model="heir.relationship"
                :validation-messages="{
                  required: 'Hubungan adalah wajib'
                }"
              />

              <FormKit
                type="tel"
                :name="`heir${index}Phone`"
                label="No. Telefon Waris"
                validation="required"
                v-model="heir.phone"
                :validation-messages="{
                  required: 'No. telefon waris adalah wajib',
                }"
              />
            </div>
          </div>
          
          <div class="flex justify-center mt-4">
            <rs-button
              variant="secondary"
              @click="addHeir"
              type="button"
            >
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
              <rs-button type="button" variant="secondary" @click="handleSaveStepA15"
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
          <h2 class="text-xl font-semibold">
            Borang Permohonan Lengkap Online
          </h2>
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
              class="text-center flex-1 cursor-pointer"
              :class="{ 'font-semibold': currentStepB >= step.id }"
              @click="goToStepB(step.id)"
            >
              {{ step.label }}
            </div>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2.5">
            <div
              class="bg-primary h-2.5 rounded-full transition-all duration-300"
              :style="`width: ${currentStepB >= totalStepsB ? 100 : (currentStepB / totalStepsB) * 100}%`"
            ></div>
          </div>
        </div>

        <!-- Section B Form - Step 1: Maklumat Peribadi Tanggungan -->
        <FormKit
          v-if="currentStepB === 1"
          type="form"
          @submit="nextStepB"
          :actions="false"
        >
        <h3 class="text-lg font-semibold mb-4">
            B. Maklumat Peribadi Tanggungan
          </h3>

          <!-- I. Maklumat Peribadi Tanggungan -->
          <div class="mb-6">
            <h4 class="font-medium mb-3">I. Maklumat Peribadi Tanggungan</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit
                type="select"
                name="hubungan_pemohon"
                label="Hubungan dengan Pemohon/Asnaf"
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
                  'Lain-lain Nyatakan',
                ]"
                validation="required"
                v-model="hubunganPemohon"
              />

              <div v-if="hubunganPemohon === 'Pasangan Pemohon'" class="md:col-span-2">
                <FormKit
                  type="file"
                  name="dokumen_pasangan"
                  label="Upload Dokumen Pasangan"
                  accept=".pdf,.jpg,.jpeg,.png"
                  help="Format yang dibenarkan: PDF, JPG, PNG. Saiz maksimum: 5MB"
                />
              </div>

              <FormKit
                type="text"
                name="nama_tanggungan"
                label="Nama"
                validation="required"
              />

              <FormKit
                type="select"
                name="jenis_id"
                label="Jenis ID"
                placeholder="Pilih jenis ID"
                :options="['Kad Pengenalan', 'Foreign ID','Sijil Lahir']"
                validation="required"
                v-model="jenisIdTanggungan"
              />

                <FormKit
                v-if="jenisIdTanggungan"
                  type="file"
                  name="dokumen_id"
                  :label="`Upload Document`"
                  accept=".pdf,.jpg,.jpeg,.png"
                  help="Format yang dibenarkan: PDF, JPG, PNG. Saiz maksimum: 5MB"
                  validation="required|max:5|mime:application/pdf,image/jpeg,image/png"
                />

              <FormKit
                type="text"
                name="no_id_tanggungan"
                label="No ID"
              />

              <FormKit
                type="text"
                name="nopassport"
                label="No Passport"
              />

              <FormKit
                type="date"
                name="passportStartDate"
                label="Tarikh mula passport"
              />

              <FormKit
                type="date"
                name="passportEndDate"
                label="Tarikh tamat passport"
              />

              <FormKit
                type="text"
                name="no_telefon_tanggungan"
                label="No Telefon/Telefon Bimbit"
              />

              <FormKit
                type="select"
                name="jantina_tanggungan"
                label="Jantina"
                :options="['Lelaki', 'Perempuan']"
                validation="required"
              />

              <FormKit
                type="date"
                name="tarikh_lahir_tanggungan"
                label="Tarikh Lahir"
                validation="required"
              />

              <FormKit
                type="text"
                name="tempat_lahir_tanggungan"
                label="Tempat Lahir"
                validation="required"
              />

              <FormKit
                type="select"
                name="bangsa_tanggungan"
                label="Bangsa"
                :options="['Melayu', 'Cina', 'India', 'Lain-lain Nyatakan']"
                validation="required"
              />

              <FormKit
                type="select"
                name="status_perkahwinan_tanggungan"
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
              />

              <FormKit
                type="select"
                name="warganegara_tanggungan"
                label="Warganegara"
                :options="['Warganegara', 'Bukan Warganegara']"
                validation="required"
              />

              <FormKit
                type="number"
                name="tempoh_menetap_selangor"
                label="Tempoh Menetap Di Selangor (Tahun)"
                min="0"
              />
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
              <rs-button type="button" variant="secondary" @click="handleSaveStepB1"
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
          <h3 class="text-lg font-semibold mb-4">
            B. Maklumat Peribadi Tanggungan
          </h3>

          <h3 class="text-lg font-semibold mb-4">
            II. Maklumat Islam
          </h3>

          <div class="mb-6">
            <h4 class="font-medium mb-3">Maklumat Islam</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit
                type="text"
                name="nama_selepas_islam"
                label="Nama Selepas Islam (Muallaf)"
              />

              <FormKit
                type="date"
                name="tarikh_masuk_islam"
                label="Tarikh Masuk Islam"
                help="Format: dd-mm-yyyy"
                validation="required"
                v-model="tarikhMasukIslamTanggungan"
              />

              <FormKit
                v-if="tarikhMasukIslamTanggungan"
                type="file"
                name="dokumen_masuk_islam"
                label="Upload surat keislaman dari MAIS"
                help="Format yang dibenarkan: PDF, JPG, PNG. Saiz maksimum: 5MB"
                accept=".pdf,.jpg,.jpeg,.png"
                validation="required|max:5|mime:application/pdf,image/jpeg,image/png"
              />

              <FormKit
                type="date"
                name="tarikh_masuk_kfam_tanggungan"
                label="Tarikh Masuk Kelas Fardu Ain Muallaf (KFAM)"
                help="Format: dd-mm-yyyy"
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
              <rs-button type="button" variant="secondary" @click="handleSaveStepB2"
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
            B. Maklumat Peribadi Tanggungan
          </h3>

          <h3 class="text-lg font-semibold mb-4">
            III. Maklumat Bank
          </h3>

          <div class="mb-6">
            <h4 class="text-md font-medium mb-3">Maklumat Bank</h4>
            
            <!-- Kaedah Pembayaran -->
            <div class="mb-6">
              <FormKit
                type="radio"
                name="kaedah_pembayaran_tanggungan"
                label="Kaedah Pembayaran *"
                :options="paymentMethodOptions"
                validation="required"
                v-model="formData.kaedah_pembayaran_tanggungan"
                :validation-messages="{
                  required: 'Kaedah pembayaran adalah wajib'
                }"
              />
            </div>

            <!-- A. Jika Kaedah Pembayaran = Akaun -->
            <div v-if="formData.kaedah_pembayaran_tanggungan === 'akaun'" class="mb-6">
              <h5 class="text-md font-medium mb-4 text-primary">A. Maklumat Akaun Bank</h5>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Nama Bank -->
                <FormKit
                  type="select"
                  name="nama_bank_tanggungan"
                  label="Nama Bank *"
                  placeholder="Pilih nama bank"
                  :options="bankOptions"
                  validation="required"
                  v-model="formData.nama_bank_tanggungan"
                />

                <!-- Swift Code (Read Only) -->
                <FormKit
                  v-if="formData.nama_bank_tanggungan"
                  type="text"
                  name="swift_code_tanggungan"
                  label="Swift Code"
                  v-model="formData.swift_code_tanggungan"
                  :value="selectedBankSwiftCodeTanggungan"
                  readonly
                  help="Swift Code dipaparkan secara automatik"
                />

                <!-- No. Akaun Bank -->
                <FormKit
                  type="text"
                  name="no_akaun_bank_tanggungan"
                  label="No. Akaun Bank *"
                  validation="required"
                  v-model="formData.no_akaun_bank_tanggungan"
                />

                <!-- Nama Pemegang Akaun -->
                <FormKit
                  type="text"
                  name="nama_pemegang_akaun_tanggungan"
                  label="Nama Pemegang Akaun *"
                  validation="required"
                  v-model="formData.nama_pemegang_akaun_tanggungan"
                />
              </div>
            </div>

            <!-- B. Jika Kaedah Pembayaran = Tiada -->
            <div v-if="formData.kaedah_pembayaran_tanggungan === 'tiada'" class="mb-6">
              <h5 class="text-md font-medium mb-4 text-primary">B. Sebab Tiada Akaun Bank</h5>
              <div class="md:col-span-2">
                <FormKit
                  type="select"
                  name="sebab_tiada_akaun_tanggungan"
                  label="Sebab *"
                  :options="noPaymentReasonOptions"
                  validation="required"
                  placeholder="Pilih sebab tiada akaun bank"
                  v-model="formData.sebab_tiada_akaun_tanggungan"
                  :validation-messages="{
                    required: 'Sila pilih sebab tiada akaun bank'
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
              <rs-button type="button" variant="secondary" @click="handleSaveStepB3"
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
            <h4 class="font-medium mb-3">IV. Maklumat Pendidikan Tanggungan</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit
                type="select"
                name="bersekolah_tanggungan"
                label="Bersekolah"
                :options="['Ya', 'Tidak']"
                validation="required"
              />

              <FormKit
                type="select"
                name="pendidikan_tertinggi_tanggungan"
                label="Pendidikan Tertinggi"
                :options="[
                  'Peringkat Rendah',
                  'SRP/PMR',
                  'SPM',
                  'Sijil',
                  'Diploma',
                  'STPM',
                  'Ijazah',
                  'Lain-lain Nyatakan',
                ]"
                validation="required"
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
              <rs-button type="button" variant="secondary" @click="handleSaveStepB4"
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
            <h4 class="font-medium mb-3">V. Maklumat Kesihatan Tanggungan</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit
                type="select"
                name="tahap_kesihatan_tanggungan"
                label="Tahap Kesihatan"
                :options="['Sihat', 'Sakit Kronik', 'OKU', 'Uzur']"
                validation="required"
                v-model="healthStatusTanggungan"
              />

                  <FormKit
                    type="select"
                    name="keadaan_kesihatan_sakit_tanggungan"
                    label="Keadaan Kesihatan"
                    :options="['Terlantar', 'Tidak Terlantar']"
                  />

                  <FormKit
                    type="select"
                    name="kos_penjagaan_sakit_tanggungan"
                    label="Kos Penjagaan"
                    :options="['Berbayar', 'Tidak berbayar']"
                  />

                  <FormKit
                    type="number"
                    name="perbelanjaan_bulanan_sakit_tanggungan"
                    label="Jumlah Perbelanjaan Bulanan (RM)"
                    step="0.01"
                    min="0"
                  />

                  <FormKit
                    type="file"
                    name="dokumen_sakit_kronik_tanggungan"
                    label="Upload Dokumen Sakit Kronik"
                    accept=".pdf,.jpg,.jpeg,.png"
                    help="Format yang dibenarkan: PDF, JPG, PNG. Saiz maksimum: 5MB"
                    validation="required|max:5|mime:application/pdf,image/jpeg,image/png"
                  />

                  <FormKit
                    type="select"
                    name="kesempurnaan_fizikal_tanggungan"
                    label="Kesempurnaan Fizikal"
                    :options="['Sempurna', 'Cacat Mental', 'Cacat Fizikal']"
                  />

                  <FormKit
                    type="select"
                    name="sebab_kecacatan_tanggungan"
                    label="Sebab Kecacatan (Jika Cacat)"
                    :options="['Sejak Lahir', 'Musibah']"
                  />

                  <FormKit
                    type="select"
                    name="tahap_kecacatan_tanggungan"
                    label="Tahap Kecacatan"
                    :options="['Terlantar', 'Tidak Terlantar']"
                  />

                  <FormKit
                    type="number"
                    name="perbelanjaan_bulanan_oku_tanggungan"
                    label="Jumlah Perbelanjaan Bulanan (RM)"
                    step="0.01"
                    min="0"
                  />

                  <FormKit
                    type="file"
                    name="dokumen_oku_tanggungan"
                    label="Upload Dokumen OKU"
                    accept=".pdf,.jpg,.jpeg,.png"
                    help="Format yang dibenarkan: PDF, JPG, PNG. Saiz maksimum: 5MB"
                    validation="required|max:5|mime:application/pdf,image/jpeg,image/png"
                  />

                  <FormKit
                    type="select"
                    name="keadaan_kesihatan_uzur_tanggungan"
                    label="Keadaan Kesihatan"
                    :options="['Terlantar', 'Tidak Terlantar']"
                  />

                  <FormKit
                    type="select"
                    name="kos_penjagaan_uzur_tanggungan"
                label="Kos Penjagaan"
                    :options="['Berbayar', 'Tidak berbayar']"
                  />

                  <FormKit
                    type="number"
                    name="perbelanjaan_bulanan_uzur_tanggungan"
                label="Jumlah Perbelanjaan Bulanan (RM)"
                    step="0.01"
                    min="0"
                  />

                  <FormKit
                    type="file"
                    name="dokumen_uzur_tanggungan"
                label="Upload Dokumen Uzur"
                    accept=".pdf,.jpg,.jpeg,.png"
                    help="Format yang dibenarkan: PDF, JPG, PNG. Saiz maksimum: 5MB"
                    validation="required|max:5|mime:application/pdf,image/jpeg,image/png"
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
              <rs-button type="button" variant="secondary" @click="handleSaveStepB4"
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
            <h4 class="font-medium mb-3">VI. Maklumat Kemahiran Tanggungan</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormKit
              type="select"
              name="kemahiran_tanggungan"
              label="Kemahiran"
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
              <rs-button type="button" variant="secondary" @click="handleSaveStepB6"
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
            <h4 class="font-medium mb-3">VII. Maklumat Pekerjaan Tanggungan</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit
                type="select"
                name="pekerjaan_status_tanggungan"
                label="Pekerjaan"
                :options="[
                  'Bekerja Nyatakan Jawatan',
                  'Tidak Bekerja Nyatakan',
                ]"
              />

              <FormKit
                type="select"
                name="sektor_pekerjaan_tanggungan"
                label="Sektor"
                :options="[
                  'Kerajaan',
                  'Swasta',
                  'Badan Berkanun',
                  'Kerja Sendiri Nyatakan',
                ]"
              />

              <FormKit
                type="text"
                name="nama_majikan_tanggungan"
                label="Nama Majikan"
              />

              <FormKit
                type="text"
                name="no_tel_majikan_tanggungan"
                label="No Tel Majikan"
              />

              <FormKit
                type="text"
                name="alamat_majikan_tanggungan"
                label="Alamat Majikan"
              />

              <FormKit type="text" name="bandar_majikan_tanggungan" label="Bandar" />

              <FormKit type="text" name="poskod_majikan_tanggungan" label="Poskod" />

              <FormKit type="text" name="daerah_majikan_tanggungan" label="Daerah" />

              <FormKit type="text" name="negeri_majikan_tanggungan" label="Negeri" />

              <FormKit type="text" name="jawatan_tanggungan" label="Jawatan" />

              <FormKit type="text" name="negara_pekerjaan_tanggungan" label="Negara" />

              <FormKit
                type="select"
                name="status_jawatan_tanggungan"
                label="Status Jawatan"
                :options="['Tetap', 'Kontrak', 'Sementara']"
              />
            </div>
          </div>

          <div class="flex justify-between gap-3 mt-6">
            <div class="flex gap-3">
              <rs-button
                type="button"
                variant="secondary"
                @click="goToPeribadi"
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
              <rs-button type="button" variant="secondary" @click="handleSaveStepB7"
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
          <h3 class="text-lg font-semibold mb-4">
            VI. Pengesahan
          </h3>

          <div class="mb-6">
            <h4 class="font-medium mb-3">Bantuan Penolong Amil</h4>
            <div class="flex flex-col gap-2">
              <label class="font-medium">Adakah anda dibantu oleh penolong Amil</label>
              <FormKit
                type="radio"
                name="dibantu_penolong_amil"
                :options="['Ya', 'Tidak']"
                validation="required"
                v-model="dibantuPenolongAmil"
              />
            </div>

            <div v-if="dibantuPenolongAmil === 'Ya'" class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <FormKit
                type="select"
                name="kariah_bantuan"
                label="Kariah"
                :options="kariahOptions"
                placeholder="Pilih kariah"
                validation="required"
                v-model="formData.pengesahan.kariah_bantuan"
              />
              <FormKit
                type="select"
                name="nama_penolong_amil_bantuan"
                label="Nama Penolong Amil"
                :options="pakOfficersOptionsBantuan"
                placeholder="Pilih nama penolong amil"
                validation="required"
                v-model="formData.pengesahan.nama_penolong_amil_bantuan"
              />

              <FormKit
                type="date"
                name="tarikh_bantuan"
                label="Tarikh Bantuan"
                validation="required"
                v-model="formData.pengesahan.tarikh_bantuan"
              />
            </div>
          </div>

          <div class="mb-6">
            <h4 class="font-medium mb-3"> Maklumat Perakuan Pemohon</h4>
            <div class="flex flex-col gap-2">
              <label class="font-medium">Hubungan kekeluargaan dengan kakitangan LZS?</label>
              <FormKit
                type="radio"
                name="hubungan_kakitangan_lzs"
                :options="['Ya', 'Tidak']"
                validation="required"
                v-model="hubunganKakitanganLZS"
              />
            </div>

            <div v-if="hubunganKakitanganLZS === 'Ya'" class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <FormKit
                  type="text"
                name="nama_kakitangan"
                label="Nama Kakitangan"
                  validation="required"
              />

              <FormKit
                type="text"
                name="jawatan_kakitangan"
                label="Jawatan"
                validation="required"
              />

              <FormKit
                type="text"
                name="pejabat_kakitangan"
                label="Pejabat"
                validation="required"
              />

              <FormKit
                type="text"
                name="hubungan_kakitangan"
                label="Hubungan"
                validation="required"
              />

              <FormKit
                type="date"
                name="tarikh_perakuan"
                label="Tarikh Perakuan"
                validation="required"
                />
              </div>
            </div>

          <div class="mb-6">
            <h4 class="font-medium mb-3"> Pengesahan PDPA (Akta Perlindungan Data Peribadi)</h4>
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div class="flex items-start gap-3">
                <FormKit
                  type="radio"
                  name="pdpa_consent"
                  label=""
                  :options="[
                    { label: 'Setuju', value: true },
                    { label: 'Tidak Setuju', value: false }
                  ]"
                  validation="required"
                  v-model="formData.pengesahan.pdpa_consent"
                />
                <div class="text-sm text-gray-700">
                  <p class="font-medium mb-2">Saya mengesahkan bahawa:</p>
                  <ul class="list-disc list-inside space-y-1 text-xs">
                    <li>Semua maklumat yang diberikan adalah benar dan tepat</li>
                    <li>Saya memberikan kebenaran kepada Lembaga Zakat Selangor (LZS) untuk memproses dan menyimpan data peribadi saya</li>
                    <li>Saya memahami bahawa data saya akan digunakan untuk tujuan pemprosesan permohonan bantuan</li>
                    <li>Saya bersetuju untuk menerima komunikasi berkaitan permohonan saya</li>
                    <li>Saya boleh menarik balik kebenaran ini pada bila-bila masa</li>
                  </ul>
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
              <rs-button type="button" variant="secondary" @click="handleSaveStepB8"
                >Simpan</rs-button
              >
              <rs-button type="submit" variant="primary" @click="nextStepB"
                >Seterusnya ke Pengesahan Bermastautin</rs-button
              >
            </div>
          </div>
        </FormKit>

        <!-- Section B Form - Step 9: Pengesahan Bermastautin -->
        <FormKit
          v-if="currentStepB === 9"
          type="form"
          @submit="nextStepB"
          :actions="false"
          id="sectionB9"
        >
          <h3 class="text-lg font-semibold mb-4">
            VII. Pengesahan Bermastautin
          </h3>

          <!-- PAK Officer Information (Readonly) -->
          <div class="mb-6">
            <h4 class="font-medium mb-3">Maklumat Pegawai PAK yang Mengesahkan</h4>
            <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Kariah</label>
                  <div class="text-sm text-gray-900 bg-white px-3 py-2 border border-gray-300 rounded">
                    {{ getKariahLabel(formData.pengesahan.kariah_bermastautin) || 'Belum dipilih' }}
                  </div>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Nama Pegawai PAK</label>
                  <div class="text-sm text-gray-900 bg-white px-3 py-2 border border-gray-300 rounded">
                    {{ getPakOfficerLabel(formData.pengesahan.nama_pak_bermastautin) || 'Belum dipilih' }}
                  </div>
                </div>
              </div>
            </div>
          </div>

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

          <!-- Original Form Fields (Hidden/Readonly) -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <rs-button type="button" variant="secondary" @click="handleSaveStepB9"
                      >Simpan</rs-button
                    >
              <rs-button type="submit" variant="primary" @click="nextStepB"
                >Seterusnya ke Pegawai Pendaftar</rs-button
                    >
                  </div>
          </div>
        </FormKit>

        <!-- Section B Form - Step 10: Pegawai Pendaftar -->
        <FormKit
          v-if="currentStepB === 10"
          type="form"
          @submit="submitForm"
          :actions="false"
          id="sectionB10"
        >
          <h3 class="text-lg font-semibold mb-4">
            VIII. Maklumat Pegawai Pendaftar
          </h3>

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
                  <rs-button type="button" variant="secondary" @click="handleSaveStepB10"
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
    <div v-if="showKursusModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold">Senarai Kursus dan Guru Terlibat</h3>
          <button @click="closeKursusModal" class="text-gray-500 hover:text-gray-700">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>
        
        <div class="mb-4">
          <p class="text-sm text-gray-600">
            Lokasi: <span class="font-medium">{{ formData.addressInfo.location || 'Belum dipilih' }}</span> | 
            Daerah: <span class="font-medium">{{ selectedDaerah || 'Belum dipilih' }}</span>
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 class="font-medium mb-3">Senarai Kursus</h4>
            <div class="space-y-2 max-h-60 overflow-y-auto">
              <div
                v-for="kursus in kursusList"
                :key="kursus.id"
                class="p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                :class="{ 'bg-blue-50 border-blue-300': selectedKursus?.id === kursus.id }"
                @click="selectKursus(kursus)"
              >
                <div class="font-medium">{{ kursus.nama }}</div>
                <div class="text-sm text-gray-600">{{ kursus.deskripsi }}</div>
                <div class="text-xs text-gray-500 mt-1">
                  <i class="fas fa-clock mr-1"></i>{{ kursus.durasi }} | 
                  <i class="fas fa-users mr-1"></i>{{ kursus.kapasiti }} peserta
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 class="font-medium mb-3">Senarai Guru</h4>
            <div class="space-y-2 max-h-60 overflow-y-auto">
              <div
                v-for="guru in guruList"
                :key="guru.id"
                class="p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                :class="{ 'bg-green-50 border-green-300': selectedGuru?.id === guru.id }"
                @click="selectGuru(guru)"
              >
                <div class="font-medium">{{ guru.nama }}</div>
                <div class="text-sm text-gray-600">{{ guru.specialization }}</div>
                <div class="text-xs text-gray-500 mt-1">
                  <i class="fas fa-star mr-1"></i>{{ guru.rating }} | 
                  <i class="fas fa-graduation-cap mr-1"></i>{{ guru.pengalaman }} tahun
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-6 flex justify-end gap-3">
          <rs-button variant="secondary" @click="closeKursusModal">
            Batal
          </rs-button>
          <rs-button 
            variant="primary" 
            @click="confirmKursusSelection"
            :disabled="!selectedKursus || !selectedGuru"
          >
            Pilih Kursus & Guru
          </rs-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
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

// Section A - Main Form Steps (now 12 steps with separate tabs for different info sections)
const currentStepA = ref(1);
const totalStepsA = 15;
const stepsA = [
  { id: 1, label: "Penilaian Awal" },
  { id: 2, label: "Peribadi" },
  { id: 3, label: "Islam" },
  { id: 4, label: "Pendidikan" },
  { id: 5, label: "Bank" },
  { id: 6, label: "Kesihatan" },
  { id: 7, label: "Kemahiran" },
  { id: 8, label: "Alamat" },
  { id: 9, label: "Pekerjaan" },
  { id: 10, label: "Pendapatan" },
  { id: 11, label: "Kediaman" },
  { id: 12, label: "Pinjaman" },
  { id: 13, label: "Pemilikan" },
  { id: 14, label: "Pemilikan Barangan Rumah" },
  { id: 15, label: "Waris" }
];

// Section B - Tanggungan Form Steps (now 11 steps with separate tabs for different info sections)
const currentStepB = ref(1);
const totalStepsB = 11;
const stepsB = [
  { id: 1, label: "Peribadi Tanggungan" },
  { id: 2, label: "Islam Tanggungan" },
  { id: 3, label: "Bank Tanggungan" },
  { id: 4, label: "Pendidikan Tanggungan" },
  { id: 5, label: "Kesihatan Tanggungan" },
  { id: 6, label: "Kemahiran Tanggungan" },
  { id: 7, label: "Pekerjaan Tanggungan" },
  { id: 8, label: "Pengesahan" },
  { id: 9, label: "Pengesahan Bermastautin" },
  { id: 10, label: "Pegawai Pendaftar" }
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

// Residence Variables
const statusKediaman = ref(null);

// Loan Variables
const pemberiPinjaman = ref('');
const jenisPinjaman = ref('');
const bayaranBulanan = ref(null);
const jumlahPerbelanjaan = ref(null);
const tahunMulaPinjaman = ref(null);
const tahunAkhirPinjaman = ref(null);

// Modal Variables
const showKursusModal = ref(false);
const selectedKursus = ref(null);
const selectedGuru = ref(null);

// Employment form reactive variables
const employmentStatus = ref('');
const employmentSector = ref('');
const employmentIncomeSource = ref([]);

// ============================================================================
// FORM DATA STRUCTURE
// ============================================================================
const formData = ref({
  // Section A - Maklumat Peribadi Asnaf
  jenis_id: '',
  no_pengenalan: '',
  warganegara: '',
  jantina: '',
  bangsa: '',
  bersekolah: '',
  pendidikan_tertinggi: '',
  status_perkahwinan: '',

  // Section A - Maklumat Pendidikan
  masih_bersekolah: '',
  lain_pendidikan_tertinggi: '',
  tahap_pendidikan: [],
  lain_tahap_pendidikan: '',
  sijil_pendidikan: null,
  jenis_sekolah: '',
  kategori_sekolah: '',
  tahun_bersekolah: '',
  tahun_tingkatan: '',
  nama_sekolah: '',
  alamat_sekolah_1: '',
  alamat_sekolah_2: '',
  alamat_sekolah_3: '',
  daerah_sekolah: '',
  bandar_sekolah: '',
  poskod_sekolah: '',
  tinggal_bersama_keluarga: '',
  asrama_rumah_sewa: '',
  bidang_kursus: '',
  jurusan_bidang: '',
  pembiayaan_pengajian: [],
  lain_pembiayaan: '',
  catatan_pendidikan: '',

  // Section A - Maklumat Islam
  adakah_muallaf: '',
  tarikh_masuk_islam: '',
  tarikh_masuk_kfam: '',
  nama_selepas_islam: '',
  nama_sebelum_islam: '',
  tarikh_keluar_muallaf: '',
  dokumen_pengislaman: null,

  // Bank Information
  nama_bank: '',
  no_akaun_bank: '',
  nama_pemegang_akaun: '',
  swift_code: '',
  kaedah_pembayaran: '',
  sebab_tiada_akaun: '',
  sebab_tunai: '',

  // Section B - Maklumat Kesihatan
  tahap_kesihatan: '',
  keadaan_kesihatan_sakit: '',
  kos_penjagaan_sakit: '',
  perbelanjaan_bulanan_sakit: '',
  kesempurnaan_fizikal: '',
  sebab_kecacatan: '',
  tahap_kecacatan: '',
  perbelanjaan_bulanan_oku: '',
  keadaan_kesihatan_uzur: '',
  kos_penjagaan_uzur: '',
  perbelanjaan_bulanan_uzur: '',
  dokumen_sokongan_kesihatan: null,

  // Section C - Kemahiran
  kemahiran: '',
  lain_lain_kemahiran: '',

  // Section D - Maklumat Pekerjaan
  status_pekerjaan: '',
  jenis_pekerjaan: '',
  sektor_pekerjaan: '',
  lain_lain_sektor: '',
  no_telefon_pejabat: '',
  nama_majikan: '',
  no_telefon_majikan: '',
  alamat_majikan_1: '',
  alamat_majikan_2: '',
  alamat_majikan_3: '',
  bandar_majikan: '',
  poskod_majikan: '',
  daerah_majikan: '',
  negeri_majikan: '',
  negara_majikan: '',
  jawatan: '',
  status_jawatan: '',
  pendapatan_kasar: '',
  pengesahan_pendapatan: [],
  sumber_pendapatan: [],
  lain_lain_sumber_pendapatan: '',

  // Section E - Maklumat Pendapatan
  gaji_elaun_pendapatan: '',
  pendapatan_isteri_suami_ibubapa_penjaga: '',
  pencen_perkeso: '',
  sumbangan_anak_anak: '',
  bantuan_jkm: '',
  takaful: '',
  sewa_rumah_tanah_kedai: '',
  pendapatan_tanggungan_serumah: '',
  pendapatan_lain_lain: '',
  perbelanjaan_makanan_minuman: '',
  sewa_bayaran_pinjaman_perumahan: '',
  perbelanjaan_persekolahan_anak: '',
  pengangkutan_tambang_bas_sekolah: '',
  bil_utiliti: '',

  // Section F - Maklumat Kediaman
  addressInfo: {
    alamat1: '',
    alamat2: '',
    alamat3: '',
    location: '',
    negeri: 'Selangor',
    daerah: '',
    bandar: '',
    poskod: '',
    kariah: '',
    geolokasi: '',
    tempoh_menetap_selangor: '',
    kursus_terpilih: '',
    selectedKursus: null,
    selectedGuru: null,
    status_kediaman: '',
    lain_lain_status_kediaman: '',
    tapak_rumah: '',
    lain_lain_tapak_rumah: '',
    jenis_rumah: '',
    lain_lain_jenis_rumah: '',
    binaan_rumah: '',
    lain_lain_binaan_rumah: '',
    keadaan_kediaman: '',
    bekalan_air: '',
    bil_air: '',
    bekalan_elektrik: '',
    bil_elektrik: '',
    penyelenggaraan: '',
    bil_penyelenggaraan: '',
    kadar_bayaran_bulanan: '',
    kadar_sewa_bulanan: '',
    dokumen_perjanjian_sewa: null,
  },

  // Section G - Maklumat Pinjaman
  pemberi_pinjaman: '',
  jenis_pinjaman: '',
  bayaran_bulanan: '',
  jumlah_perbelanjaan: '',
  tahun_mula_pinjaman: '',
  tahun_akhir_pinjaman: '',

  // Section H - Maklumat Pemilikan
  wang_simpanan: '',
  emas: '',
  saham: '',
  kenderaan: '',
  rumah_kedai: '',
  tanah_sawah: '',

  // Section I - Maklumat Barangan Rumah
  television: '',
  radio: '',
  perabot: '',
  telefon_bimbit: '',
  mesin_basuh: '',
  astro: '',
  video_player_cd_dvd: '',
  peti_ais: '',
  dapur_gas: '',

  // Section J - Pengesahan
  pengesahan: {
    dibantu_penolong_amil: '',
    kariah_bantuan: '',
    nama_penolong_amil_bantuan: '',
    tarikh_bantuan: '',
    hubungan_pak: '',
    kariah_hubungan_pak: '',
    nama_pak_hubungan: '',
    jenis_hubungan_pak: '',
    tarikh_hubungan_pak: '',
    pdpa_consent: false,
    hubungan_kakitangan_lzs: '',
    nama_kakitangan: '',
    jawatan_kakitangan: '',
    pejabat_kakitangan: '',
    hubungan_kakitangan: '',
    tarikh_perakuan: '',
    // Fake data for PAK officer information display in bermastautin
    kariah_bermastautin: 'masjid-al-hidayah',
    nama_pak_bermastautin: 'ustaz-ahmad-abdullah',
    // Fake data for form fields in bermastautin
    nama_pengesah: 'Ustaz Ahmad bin Abdullah',
    jawatan_pengesah: 'Pegawai PAK',
    no_telefon_pengesah: '012-3456789',
    tarikh_pengesahan_permastautin: '2024-01-15',
  },

  // Section K - Pengesahan Bermastautin
  ulasan_pengesahan: '',
  surat_pengesahan_bermastautin: null,

  // Section L - Maklumat Penolong Amil
  nama_penolong_amil: '',
  jenis_permohonan: '',
  tarikh_proses: '',

  // Section M - Penilaian Awal
  komitmen_tinggi: '',
  keperluan_mendesak: [],
  lain_keperluan: '',
  dokumen_sokongan: [],

  // Section B (Tanggungan) - Maklumat Peribadi Tanggungan
  hubungan_pemohon: '',
  nama_tanggungan: '',
  jenis_id_tanggungan: '',
  no_pengenalan_tanggungan: '',
  jantina_tanggungan: '',
  tarikh_lahir_tanggungan: '',
  tempat_lahir_tanggungan: '',
  bangsa_tanggungan: '',
  status_perkahwinan_tanggungan: '',
  tarikh_masuk_islam_tanggungan: '',
  tarikh_masuk_kfam_tanggungan: '',
  warganegara_tanggungan: '',
  tempoh_menetap_selangor: '',
  no_telefon_tanggungan: '',

  // Maklumat Perbankan Tanggungan
  nama_bank_tanggungan: '',
  swift_code_tanggungan: '',
  no_akaun_bank_tanggungan: '',
  nama_pemegang_akaun_tanggungan: '',
  kaedah_pembayaran_tanggungan: '',
  sebab_tiada_akaun_tanggungan: '',

  // Pendidikan Tanggungan
  bersekolah_tanggungan: '',
  pendidikan_tertinggi_tanggungan: '',
  jenis_sekolah: '',
  nama_sekolah: '',
  alamat_sekolah: '',
  daerah_sekolah: '',
  negeri_sekolah: '',
  poskod_sekolah: '',
  nama_sekolah_agama: '',
  alamat_sekolah_agama: '',
  daerah_sekolah_agama: '',
  negeri_sekolah_agama: '',
  poskod_sekolah_agama: '',
  tinggal_bersama_keluarga: '',

  // Kesihatan Tanggungan
  tahap_kesihatan_tanggungan: '',
  keadaan_kesihatan_sakit_tanggungan: '',
  kos_penjagaan_sakit_tanggungan: '',
  perbelanjaan_bulanan_sakit_tanggungan: '',
  kesempurnaan_fizikal_tanggungan: '',
  sebab_kecacatan_tanggungan: '',
  tahap_kecacatan_tanggungan: '',
  perbelanjaan_bulanan_oku_tanggungan: '',
  keadaan_kesihatan_uzur_tanggungan: '',
  kos_penjagaan_uzur_tanggungan: '',
  perbelanjaan_bulanan_uzur_tanggungan: '',

  // Kemahiran Tanggungan
  kemahiran_tanggungan: '',

  // Pekerjaan Tanggungan
  pekerjaan_status: '',
  sektor_pekerjaan: '',
  nama_majikan: '',
  no_tel_majikan: '',
  alamat_majikan: '',
  bandar_majikan: '',
  poskod_majikan: '',
  daerah_majikan: '',
  negeri_majikan: '',
  jawatan: '',
  negara_pekerjaan: '',
  status_jawatan: '',

  // Heirs array
  heirs: []
});

// ============================================================================
// OPTIONS DATA
// ============================================================================
// Payment Method Options
const paymentMethodOptions = [
  { label: 'Akaun', value: 'akaun' },
  { label: 'Tiada', value: 'tiada' }
];

// No Payment Reason Options
const noPaymentReasonOptions = [
  { label: 'Muflis', value: 'muflis' },
  { label: 'Senarai Hitam Bank', value: 'senarai-hitam-bank' },
  { label: 'Bukan Warganegara', value: 'bukan-warganegara' },
  { label: 'Sakit', value: 'sakit' }
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
  { label: "Standard Chartered", value: "standard-chartered", swiftCode: "SCBLMYKL" },
  { label: "Alliance Bank", value: "alliance", swiftCode: "MFBBMYKL" },
  { label: "Agrobank", value: "agrobank", swiftCode: "AGOBMYKL" }
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
  { label: "Sepang", value: "sepang" }
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
  { label: "Kuala Selangor", value: "kuala-selangor", daerah: "kuala-selangor" },
  { label: "Tanjung Karang", value: "tanjung-karang", daerah: "kuala-selangor" },
  { label: "Sepang", value: "sepang", daerah: "sepang" },
  { label: "Cyberjaya", value: "cyberjaya", daerah: "sepang" },
  { label: "Putrajaya", value: "putrajaya", daerah: "sepang" },
  { label: "Gombak", value: "gombak", daerah: "gombak" },
  { label: "Rawang", value: "rawang", daerah: "gombak" },
  { label: "Hulu Selangor", value: "hulu-selangor", daerah: "hulu-selangor" },
  { label: "Kuala Kubu Bharu", value: "kuala-kubu-bharu", daerah: "hulu-selangor" },
  { label: "Kuala Langat", value: "kuala-langat", daerah: "kuala-langat" },
  { label: "Banting", value: "banting", daerah: "kuala-langat" },
  { label: "Sabak Bernam", value: "sabak-bernam", daerah: "sabak-bernam" },
  { label: "Sekinchan", value: "sekinchan", daerah: "sabak-bernam" }
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
  { label: "57000", value: "57000", bandar: "sekinchan" }
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
  { label: "Kariah Masjid At-Taqwa", value: "masjid-at-taqwa" }
];

// PAK Officers by Mosque Parish
const pakOfficersByKariah = {
  'masjid-al-hidayah': [
    { label: 'Ustaz Ahmad bin Abdullah', value: 'ustaz-ahmad-abdullah' },
    { label: 'Ustazah Siti binti Mohamed', value: 'ustazah-siti-mohamed' },
    { label: 'Ustaz Mohd bin Hassan', value: 'ustaz-mohd-hassan' }
  ],
  'masjid-al-ikhlas': [
    { label: 'Ustaz Ismail bin Omar', value: 'ustaz-ismail-omar' },
    { label: 'Ustazah Fatimah binti Ali', value: 'ustazah-fatimah-ali' },
    { label: 'Ustaz Kamal bin Ibrahim', value: 'ustaz-kamal-ibrahim' }
  ],
  'masjid-al-muttaqin': [
    { label: 'Ustaz Rahman bin Sulaiman', value: 'ustaz-rahman-sulaiman' },
    { label: 'Ustazah Aminah binti Yusof', value: 'ustazah-aminah-yusof' },
    { label: 'Ustaz Zulkifli bin Ahmad', value: 'ustaz-zulkifli-ahmad' }
  ],
  'masjid-al-rahman': [
    { label: 'Ustaz Aziz bin Mohamed', value: 'ustaz-aziz-mohamed' },
    { label: 'Ustazah Nor binti Hassan', value: 'ustazah-nor-hassan' },
    { label: 'Ustaz Hamid bin Abdullah', value: 'ustaz-hamid-abdullah' }
  ],
  'masjid-al-salam': [
    { label: 'Ustaz Yusof bin Ahmad', value: 'ustaz-yusof-ahmad' },
    { label: 'Ustazah Mariam binti Omar', value: 'ustazah-mariam-omar' },
    { label: 'Ustaz Khalid bin Ismail', value: 'ustaz-khalid-ismail' }
  ],
  'masjid-al-taqwa': [
    { label: 'Ustaz Omar bin Hassan', value: 'ustaz-omar-hassan' },
    { label: 'Ustazah Zainab binti Ali', value: 'ustazah-zainab-ali' },
    { label: 'Ustaz Ibrahim bin Mohamed', value: 'ustaz-ibrahim-mohamed' }
  ],
  'masjid-an-nur': [
    { label: 'Ustaz Hassan bin Abdullah', value: 'ustaz-hassan-abdullah' },
    { label: 'Ustazah Aishah binti Yusof', value: 'ustazah-aishah-yusof' },
    { label: 'Ustaz Mohamed bin Khalid', value: 'ustaz-mohamed-khalid' }
  ],
  'masjid-ar-rahman': [
    { label: 'Ustaz Abdullah bin Omar', value: 'ustaz-abdullah-omar' },
    { label: 'Ustazah Khadijah binti Hassan', value: 'ustazah-khadijah-hassan' },
    { label: 'Ustaz Ali bin Ismail', value: 'ustaz-ali-ismail' }
  ],
  'masjid-as-salam': [
    { label: 'Ustaz Sulaiman bin Ahmad', value: 'ustaz-sulaiman-ahmad' },
    { label: 'Ustazah Safiyah binti Mohamed', value: 'ustazah-safiyah-mohamed' },
    { label: 'Ustaz Yusof bin Khalid', value: 'ustaz-yusof-khalid' }
  ],
  'masjid-at-taqwa': [
    { label: 'Ustaz Khalid bin Abdullah', value: 'ustaz-khalid-abdullah' },
    { label: 'Ustazah Aminah binti Omar', value: 'ustazah-aminah-omar' },
    { label: 'Ustaz Ismail bin Hassan', value: 'ustaz-ismail-hassan' }
  ]
};

// Course List Data
const kursusList = ref([
  {
    id: 1,
    nama: "Kursus Fardu Ain Asas",
    deskripsi: "Kursus asas untuk mempelajari fardu ain",
    durasi: "3 bulan",
    kapasiti: 20
  },
  {
    id: 2,
    nama: "Kursus Tahfiz Al-Quran",
    deskripsi: "Kursus menghafal Al-Quran",
    durasi: "6 bulan",
    kapasiti: 15
  },
  {
    id: 3,
    nama: "Kursus Bahasa Arab",
    deskripsi: "Kursus bahasa Arab untuk pemula",
    durasi: "4 bulan",
    kapasiti: 25
  },
  {
    id: 4,
    nama: "Kursus Fiqh Muamalat",
    deskripsi: "Kursus hukum muamalat Islam",
    durasi: "2 bulan",
    kapasiti: 30
  },
  {
    id: 5,
    nama: "Kursus Tafsir Al-Quran",
    deskripsi: "Kursus memahami tafsir Al-Quran",
    durasi: "5 bulan",
    kapasiti: 18
  }
]);

// Teacher List Data
const guruList = ref([
  {
    id: 1,
    nama: "Ustaz Ahmad bin Abdullah",
    specialization: "Fardu Ain & Fiqh",
    rating: 4.8,
    pengalaman: 10
  },
  {
    id: 2,
    nama: "Ustazah Siti binti Mohamed",
    specialization: "Tahfiz Al-Quran",
    rating: 4.9,
    pengalaman: 15
  },
  {
    id: 3,
    nama: "Ustaz Mohd Ali bin Hassan",
    specialization: "Bahasa Arab",
    rating: 4.7,
    pengalaman: 8
  },
  {
    id: 4,
    nama: "Ustazah Nurul Huda binti Ismail",
    specialization: "Tafsir Al-Quran",
    rating: 4.6,
    pengalaman: 12
  },
  {
    id: 5,
    nama: "Ustaz Abdul Rahman bin Omar",
    specialization: "Fiqh Muamalat",
    rating: 4.5,
    pengalaman: 9
  }
]);

// ============================================================================
// COMPUTED PROPERTIES
// ============================================================================
const showLainInput = computed(() => {
  return formData.value.keperluanMendesak?.includes('lain');
});

const showLainLainSektor = computed(() => {
  return formData.value.sektor_pekerjaan === 'Lain-lain';
});

const showLainLainSumberPendapatan = computed(() => {
  return formData.value.sumber_pendapatan && formData.value.sumber_pendapatan.includes('Lain-lain');
});

const hasLoanInfo = computed(() => {
  return pemberiPinjaman.value || 
         jenisPinjaman.value || 
         bayaranBulanan.value || 
         jumlahPerbelanjaan.value || 
         tahunMulaPinjaman.value || 
         tahunAkhirPinjaman.value;
});

const selectedBankSwiftCode = computed(() => {
  const selectedBank = bankOptions.find(bank => bank.value === formData.value.nama_bank);
  return selectedBank ? selectedBank.swiftCode : '';
});

const selectedBankSwiftCodeTanggungan = computed(() => {
  const selectedBank = bankOptions.find(bank => bank.value === formData.value.nama_bank_tanggungan);
  return selectedBank ? selectedBank.swiftCode : '';
});

const selectedDaerah = computed(() => {
  const daerah = daerahOptions.find(d => d.value === formData.value.addressInfo.daerah);
  return daerah ? daerah.label : '';
});

const pakOfficersOptionsBantuan = computed(() => {
  const selectedKariah = formData.value.pengesahan.kariah_bantuan;
  return selectedKariah ? pakOfficersByKariah[selectedKariah] || [] : [];
});

const pakOfficersOptionsHubungan = computed(() => {
  const selectedKariah = formData.value.pengesahan.kariah_hubungan_pak;
  return selectedKariah ? pakOfficersByKariah[selectedKariah] || [] : [];
});

const uploadedDocuments = computed(() => {
  const documents = [];
  
  // Add sample document for demonstration
  if (formData.value.pengesahan.surat_pengesahan_bermastautin) {
    documents.push({
      name: "pengesahan_bermastautin.pdf",
      type: "application/pdf",
      size: "2.0 MB"
    });
  }
  
  return documents;
});

// Computed property for calculating Tarikh Keluar Muallaf
const tarikhKeluarMuallaf = computed(() => {
  if (formData.value.adakah_muallaf !== 'Y') {
    return '';
  }
  
  const tarikhMasukIslam = formData.value.tarikh_masuk_islam;
  const tarikhMasukKFAM = formData.value.tarikh_masuk_kfam;
  
  if (!tarikhMasukIslam && !tarikhMasukKFAM) {
    return '';
  }
  
  // Parse dates and add 5 years
  let tarikhMasukIslamPlus5 = null;
  let tarikhMasukKFAMPlus5 = null;
  
  if (tarikhMasukIslam) {
    const [day, month, year] = tarikhMasukIslam.split('/');
    if (day && month && year) {
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      // Validate that the date is not in the future
      if (date > new Date()) {
        return '';
      }
      date.setFullYear(date.getFullYear() + 5);
      tarikhMasukIslamPlus5 = date;
    }
  }
  
  if (tarikhMasukKFAM) {
    const [day, month, year] = tarikhMasukKFAM.split('/');
    if (day && month && year) {
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      // Validate that the date is not in the future
      if (date > new Date()) {
        return '';
      }
      date.setFullYear(date.getFullYear() + 5);
      tarikhMasukKFAMPlus5 = date;
    }
  }
  
  // Return the later date
  if (tarikhMasukIslamPlus5 && tarikhMasukKFAMPlus5) {
    const laterDate = tarikhMasukIslamPlus5 > tarikhMasukKFAMPlus5 ? tarikhMasukIslamPlus5 : tarikhMasukKFAMPlus5;
    return `${String(laterDate.getDate()).padStart(2, '0')}/${String(laterDate.getMonth() + 1).padStart(2, '0')}/${laterDate.getFullYear()}`;
  } else if (tarikhMasukIslamPlus5) {
    return `${String(tarikhMasukIslamPlus5.getDate()).padStart(2, '0')}/${String(tarikhMasukIslamPlus5.getMonth() + 1).padStart(2, '0')}/${tarikhMasukIslamPlus5.getFullYear()}`;
  } else if (tarikhMasukKFAMPlus5) {
    return `${String(tarikhMasukKFAMPlus5.getDate()).padStart(2, '0')}/${String(tarikhMasukKFAMPlus5.getMonth() + 1).padStart(2, '0')}/${tarikhMasukKFAMPlus5.getFullYear()}`;
  }
  
  return '';
});

// Computed property for validating Islamic dates
const islamicDatesValidation = computed(() => {
  if (formData.value.adakah_muallaf !== 'Y') {
    return { isValid: true, message: '' };
  }
  
  const tarikhMasukIslam = formData.value.tarikh_masuk_islam;
  const tarikhMasukKFAM = formData.value.tarikh_masuk_kfam;
  
  if (tarikhMasukIslam && tarikhMasukKFAM) {
    const [day1, month1, year1] = tarikhMasukIslam.split('/');
    const [day2, month2, year2] = tarikhMasukKFAM.split('/');
    
    if (day1 && month1 && year1 && day2 && month2 && year2) {
      const islamDate = new Date(parseInt(year1), parseInt(month1) - 1, parseInt(day1));
      const kfamDate = new Date(parseInt(year2), parseInt(month2) - 1, parseInt(day2));
      
      if (kfamDate < islamDate) {
        return { 
          isValid: false, 
          message: 'Tarikh Masuk KFAM tidak boleh lebih awal daripada Tarikh Masuk Islam' 
        };
      }
    }
  }
  
  return { isValid: true, message: '' };
});

// ============================================================================
// WATCHERS
// ============================================================================
watch(bilanganIsteri, (newVal) => {
  const count = parseInt(newVal) || 0;
  isteriList.value = Array(count).fill({});
});

watch(statusPoligami, (newVal) => {
  if (newVal !== 'ya') {
    bilanganIsteri.value = null;
    isteriList.value = [];
  }
});

watch(
  () => formData.value.nama_bank,
  (newVal) => {
    if (newVal) {
      const selectedBank = bankOptions.find(bank => bank.value === newVal);
      if (selectedBank) {
        formData.value.swift_code = selectedBank.swiftCode;
      }
    } else {
      formData.value.swift_code = '';
    }
  }
);

watch(
  () => formData.value.nama_bank_tanggungan,
  (newVal) => {
    if (newVal) {
      const selectedBank = bankOptions.find(bank => bank.value === newVal);
      if (selectedBank) {
        formData.value.swift_code_tanggungan = selectedBank.swiftCode;
      }
    } else {
      formData.value.swift_code_tanggungan = '';
    }
  }
);

// Watch for employment status changes to handle conditional validation
watch(
  () => formData.value.status_pekerjaan,
  (newVal) => {
    if (newVal === 'tidak_bekerja') {
      // Clear employment-related fields when not working
      formData.value.jenis_pekerjaan = '';
      formData.value.sektor_pekerjaan = '';
      formData.value.lain_lain_sektor = '';
      formData.value.no_telefon_pejabat = '';
      formData.value.nama_majikan = '';
      formData.value.no_telefon_majikan = '';
      formData.value.alamat_majikan_1 = '';
      formData.value.alamat_majikan_2 = '';
      formData.value.alamat_majikan_3 = '';
      formData.value.bandar_majikan = '';
      formData.value.poskod_majikan = '';
      formData.value.daerah_majikan = '';
      formData.value.negeri_majikan = '';
      formData.value.negara_majikan = '';
      formData.value.jawatan = '';
      formData.value.status_jawatan = '';
      formData.value.pendapatan_kasar = '';
      formData.value.pengesahan_pendapatan = [];
      formData.value.sumber_pendapatan = [];
      formData.value.lain_lain_sumber_pendapatan = '';
    }
  }
);

// Watch for Islamic dates changes to automatically calculate Tarikh Keluar Muallaf
watch(
  [
    () => formData.value.tarikh_masuk_islam,
    () => formData.value.tarikh_masuk_kfam
  ],
  () => {
    if (formData.value.adakah_muallaf === 'Y') {
      formData.value.tarikh_keluar_muallaf = tarikhKeluarMuallaf.value;
    }
  }
);

// Watch for muallaf status changes to clear Islamic fields when not muallaf
watch(
  () => formData.value.adakah_muallaf,
  (newVal) => {
    if (newVal === 'T') {
      // Clear all Islamic fields when not muallaf
      formData.value.tarikh_masuk_islam = '';
      formData.value.tarikh_masuk_kfam = '';
      formData.value.nama_selepas_islam = '';
      formData.value.nama_sebelum_islam = '';
      formData.value.tarikh_keluar_muallaf = '';
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
  if (currentStepB.value < totalStepsB) {
    currentStepB.value++;
  }
  // Note: When Section B is complete, the form will be submitted
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
// STEP JUMP FUNCTIONS
// ============================================================================
const goToStepA = (stepNumber) => {
  // Allow direct navigation to any step
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
    toast.success("Maklumat Kediaman berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
    console.error("Save Step A11 error:", error);
  }
};

const handleSaveStepA12 = async () => {
  try {
    console.log("Step A12 saved:", formData.value);
    toast.success("Maklumat Pinjaman berjaya disimpan");
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
    toast.success("Maklumat Pemilikan Barangan Rumah berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
    console.error("Save Step A15 error:", error);
  }
};

const handleSaveStepA16 = async () => {
  try {
    console.log("Step A16 saved:", formData.value);
    toast.success("Maklumat Waris berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
    console.error("Save Step A16 error:", error);
  }
};

// ============================================================================
// STEP SAVE FUNCTIONS - SECTION B
// ============================================================================
const handleSaveStepB1 = async () => {
  try {
    console.log("Step B1 saved:", formData.value);
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
    toast.success("Maklumat Pengesahan Bermastautin berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
    console.error("Save Step B9 error:", error);
  }
};

const handleSaveStepB10 = async () => {
  try {
    console.log("Step B10 saved:", formData.value);
    toast.success("Maklumat Pegawai Pendaftar berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
    console.error("Save Step B10 error:", error);
  }
};

// ============================================================================
// HEIRS MANAGEMENT FUNCTIONS
// ============================================================================
const addHeir = () => {
  formData.value.heirs.push({
    name: '',
    relationship: '',
    phone: ''
  });
};

const removeHeir = (index) => {
  formData.value.heirs.splice(index, 1);
};

// ============================================================================
// LOCATION & UTILITY FUNCTIONS
// ============================================================================
const getLocation = (field) => {
  formData.value[field].location = 'Lokasi semasa';
  toast.success('Lokasi berjaya diperoleh!');
};

// ============================================================================
// KURSUS MODAL FUNCTIONS
// ============================================================================
const openKursusModal = () => {
  if (!formData.value.addressInfo.location && !selectedDaerah.value) {
    toast.error('Sila pilih lokasi atau daerah terlebih dahulu');
    return;
  }
  showKursusModal.value = true;
  selectedKursus.value = null;
  selectedGuru.value = null;
};

const closeKursusModal = () => {
  showKursusModal.value = false;
  selectedKursus.value = null;
  selectedGuru.value = null;
};

const selectKursus = (kursus) => {
  selectedKursus.value = kursus;
};

const selectGuru = (guru) => {
  selectedGuru.value = guru;
};

const confirmKursusSelection = () => {
  if (selectedKursus.value && selectedGuru.value) {
    formData.value.addressInfo.kursus_terpilih = `${selectedKursus.value.nama} - ${selectedGuru.value.nama}`;
    formData.value.addressInfo.selectedKursus = selectedKursus.value;
    formData.value.addressInfo.selectedGuru = selectedGuru.value;
    toast.success('Kursus dan guru berjaya dipilih!');
    closeKursusModal();
  }
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
const getKariahLabel = (value) => {
  const kariah = kariahOptions.find(k => k.value === value);
  return kariah ? kariah.label : '';
};

const getPakOfficerLabel = (value) => {
  // Search through all PAK officers to find the matching one
  for (const kariah in pakOfficersByKariah) {
    const officer = pakOfficersByKariah[kariah].find(o => o.value === value);
    if (officer) return officer.label;
  }
  return '';
};

const downloadDocument = (doc) => {
  // This would typically trigger a download
  console.log('Downloading document:', doc.name);
  toast.success(`Muat turun ${doc.name} bermula`);
};
</script>

<style scoped></style>
