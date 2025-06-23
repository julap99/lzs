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
              class="text-center flex-1 cursor-pointer transition-colors duration-150"
              :class="{ 'font-semibold text-primary': currentStepA >= step.id, 'hover:text-primary': true }"
              @click="goToStepA(step.id)"
            >
              {{ step.label }}
            </div>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2.5">
            <div
              class="bg-primary h-2.5 rounded-full"
              :style="`width: ${(currentStepA / totalStepsA) * 100}%`"
            ></div>
          </div>
        </div>

        <!-- Section A Form -->
        <FormKit
          v-if="currentStepA == 1"
          type="form"
          :actions="false"
          @submit="nextStepA"
        >
          <h3 class="text-lg font-semibold mb-4">
            A. Maklumat Peribadi Asnaf (* untuk muallaf)
          </h3>

          <!-- Personal Information Section -->
          <div class="mb-6">
            <h4 class="text-md font-medium mb-3">Maklumat Peribadi</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit
                type="text"
                name="nama_ketua_keluarga"
                label="Nama Ketua Keluarga (Untuk Mualaf nama mengikut pengenalan)"
                validation="required"
              />

              <FormKit
                type="select"
                name="jenis_id"
                label="Jenis ID"
                placeholder="Pilih jenis ID"
                :options="['Kad Pengenalan', 'Foreign ID']"
                validation="required"
                v-model="jenisId"
              />

              <div v-if="jenisId" class="md:col-span-2">
                <FormKit
                  type="file"
                  name="dokumen_id"
                  :label="`Upload ${jenisId}`"
                  accept=".pdf,.jpg,.jpeg,.png"
                  help="Format yang dibenarkan: PDF, JPG, PNG. Saiz maksimum: 5MB"
                  validation="required|max:5|mime:application/pdf,image/jpeg,image/png"
                />
              </div>

              <FormKit
                type="text"
                name="nombor_id"
                label="Nombor ID"
                validation="required"
              />

              <FormKit
                type="text"
                name="nama"
                label="Nama"
                validation="required"
              />

              <FormKit
                type="text"
                name="nama_selepas_islam"
                label="Nama Selepas Islam (Muallaf)"
              />

              <FormKit
                type="text"
                name="no_pengenalan"
                label="No Polis/No Tentera/No Sijil Lahir"
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
                type="select"
                name="agama"
                label="Agama"
                :options="[
                  'Islam',
                  'Kristian',
                  'Buddha',
                  'Hindu',
                  'Sikh',
                  'Taoisme',
                  'Konfusianisme',
                  'Lain-lain'
                ]"
                validation="required"
              />

              <FormKit
                type="email"
                name="emel"
                label="Emel"
                validation="required|email"
              />

              <FormKit
                type="select"
                name="warganegara"
                label="Warganegara"
                :options="['Warganegara', 'Bukan Warganegara']"
                validation="required"
              />

              <FormKit
                type="select"
                name="jantina"
                label="Jantina"
                :options="['Lelaki', 'Perempuan']"
                validation="required"
              />

              <FormKit
                type="select"
                name="bangsa"
                label="Bangsa"
                :options="['Melayu', 'Cina', 'India', 'Lain-lain']"
                validation="required"
              />
            </div>
          </div>

          <!-- Education Section -->
          <div class="mb-6">
            <h4 class="text-md font-medium mb-3">Maklumat Pendidikan</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit
                type="select"
                name="bersekolah"
                label="Bersekolah"
                :options="['Ya', 'Tidak']"
                validation="required"
              />

              <FormKit
                type="select"
                name="pendidikan_tertinggi"
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

          <!-- Islamic Information Section -->
          <div class="mb-6">
            <h4 class="text-md font-medium mb-3">Maklumat Islam</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit
                type="date"
                name="tarikh_masuk_islam"
                label="*Tarikh Masuk Islam"
                help="Format: dd-mm-yyyy"
                validation="required"
                v-model="tarikhMasukIslam"
              />

              <FormKit
                v-if="tarikhMasukIslam"
                type="file"
                name="dokumen_masuk_islam"
                label="*upload surat keislaman dari MAIS"
                help="Format yang dibenarkan: PDF, JPG, PNG. Saiz maksimum: 5MB"
                accept=".pdf,.jpg,.jpeg,.png"
                validation="required|max:5|mime:application/pdf,image/jpeg,image/png"
              />

              <FormKit
                type="date"
                name="tarikh_masuk_kfam"
                label="*Tarikh Masuk Kelas Fardu Ain Muallaf (KFAM)"
                help="Format: dd-mm-yyyy"
                validation="required"
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

          <!-- Disaster Channel Section -->
          <div class="mb-6">
            <h4 class="text-md font-medium mb-3">Saluran Bencana</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit
                type="select"
                name="saluran_bencana"
                label="Saluran Bencana"
                placeholder="Pilih saluran bencana"
                :options="[
                  { label: 'Bencana', value: 'bencana' },
                  { label: 'Tiada', value: 'tiada' }
                ]"
                validation="required"
                v-model="saluranBencana"
              />

              <div v-if="saluranBencana === 'bencana'" class="md:col-span-2">
                <FormKit
                  type="file"
                  name="dokumen_bencana"
                  label="Upload Dokumen Bencana"
                  accept=".pdf,.jpg,.jpeg,.png"
                  help="Format yang dibenarkan: PDF, JPG, PNG. Saiz maksimum: 5MB"
                  validation="required"
                />
              </div>
            </div>
          </div>

          <!-- Bank Information Section -->
          <div class="mb-6">
            <h4 class="text-md font-medium mb-3">Maklumat Bank</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit
                type="select"
                name="nama_bank"
                label="Nama Bank"
                placeholder="Pilih nama bank"
                :options="bankOptions"
                validation="required"
              />

              <FormKit
                type="text"
                name="no_akaun_bank"
                label="No Akaun Bank"
                validation="required"
              />

              <FormKit
                type="text"
                name="nama_pemegang_akaun"
                label="Nama Pemegang Akaun Bank"
                validation="required"
              />

              <FormKit
                type="select"
                name="cara_pembayaran"
                label="Cara Pembayaran"
                placeholder="Pilih cara pembayaran"
                :options="[
                  { label: 'Akaun', value: 'akaun' },
                  { label: 'Cek', value: 'cek' },
                  { label: 'Tunai', value: 'tunai' }
                ]"
                validation="required"
                v-model="caraPembayaran"
              />

              <FormKit
                v-if="caraPembayaran === 'tunai'"
                type="select"
                name="sebab_tunai"
                label="Sebab Pembayaran Tunai"
                :options="[
                  { label: 'Uzur/Sakit', value: 'uzur' },
                  { label: 'Muflis', value: 'muflis' },
                  { label: 'Disenarai Hitam', value: 'senarai_hitam' }
                ]"
                validation="required"
              />
            </div>
          </div>

          <div class="flex justify-end mt-6">
            <rs-button type="submit" variant="primary" @click="nextStepA"
              >Seterusnya ke Maklumat Kesihatan</rs-button
            >
          </div>
        </FormKit>

        <!-- Section B Form -->
        <FormKit
          v-if="currentStepA === 2"
          type="form"
          @submit="nextStepA"
          :actions="false"
          id="sectionB"
        >
          <h3 class="text-lg font-semibold mb-4">B. Maklumat Kesihatan</h3>

          <FormKit
            type="select"
            name="tahap_kesihatan"
            label="Tahap Kesihatan"
            :options="['Sihat', 'Sakit Kronik', 'OKU', 'Uzur']"
            validation="required"
            v-model="healthStatus"
          />

          <div v-if="healthStatus === 'Sakit Kronik'" class="ml-6 mt-2">
            <FormKit
              type="select"
              name="keadaan_kesihatan_sakit"
              label="Keadaan Kesihatan"
              :options="['Terlantar', 'Tidak Terlantar']"
            />

            <FormKit
              type="select"
              name="kos_penjagaan_sakit"
              label="Kos Penjagaan"
              :options="['Berbayar', 'Tidak berbayar']"
            />

            <FormKit
              type="number"
              name="perbelanjaan_bulanan_sakit"
              label="Jumlah Perbelanjaan Bulanan (RM)"
              step="0.01"
              min="0"
            />

            <FormKit
              type="file"
              name="dokumen_sakit_kronik"
              label="Upload Dokumen Sakit Kronik"
              accept=".pdf,.jpg,.jpeg,.png"
              help="Format yang dibenarkan: PDF, JPG, PNG. Saiz maksimum: 5MB"
              validation="required|max:5|mime:application/pdf,image/jpeg,image/png"
            />
          </div>

          <div v-if="healthStatus === 'OKU'" class="ml-6 mt-2">
            <FormKit
              type="select"
              name="kesempurnaan_fizikal"
              label="Kesempurnaan Fizikal"
              :options="['Sempurna', 'Cacat Mental', 'Cacat Fizikal']"
            />

            <FormKit
              type="select"
              name="sebab_kecacatan"
              label="Sebab Kecacatan (Jika Cacat)"
              :options="['Sejak Lahir', 'Musibah']"
            />

            <FormKit
              type="select"
              name="tahap_kecacatan"
              label="Tahap Kecacatan"
              :options="['Terlantar', 'Tidak Terlantar']"
            />

            <FormKit
              type="number"
              name="perbelanjaan_bulanan_oku"
              label="Jumlah Perbelanjaan Bulanan (RM)"
              step="0.01"
              min="0"
            />

            <FormKit
              type="file"
              name="dokumen_oku"
              label="Upload Dokumen OKU"
              accept=".pdf,.jpg,.jpeg,.png"
              help="Format yang dibenarkan: PDF, JPG, PNG. Saiz maksimum: 5MB"
              validation="required|max:5|mime:application/pdf,image/jpeg,image/png"
            />
          </div>

          <div v-if="healthStatus === 'Uzur'" class="ml-6 mt-2">
            <FormKit
              type="select"
              name="keadaan_kesihatan_uzur"
              label="Keadaan Kesihatan"
              :options="['Terlantar', 'Tidak Terlantar']"
            />

            <FormKit
              type="select"
              name="kos_penjagaan_uzur"
              label="Kos Penjagaan"
              :options="['Berbayar', 'Tidak berbayar']"
            />

            <FormKit
              type="number"
              name="perbelanjaan_bulanan_uzur"
              label="Jumlah Perbelanjaan Bulanan (RM)"
              step="0.01"
              min="0"
            />

            <FormKit
              type="file"
              name="dokumen_uzur"
              label="Upload Dokumen Uzur"
              accept=".pdf,.jpg,.jpeg,.png"
              help="Format yang dibenarkan: PDF, JPG, PNG. Saiz maksimum: 5MB"
              validation="required|max:5|mime:application/pdf,image/jpeg,image/png"
            />
          </div>

          <div class="flex justify-between gap-3 mt-6">
            <rs-button
              type="button"
              variant="primary-outline"
              @click="prevStepA"
              >Kembali</rs-button
            >
            <rs-button type="submit" variant="primary" @click="nextStepA"
              >Seterusnya ke Kemahiran</rs-button
            >
          </div>
        </FormKit>

        <!-- Section C Form -->
        <FormKit
          v-if="currentStepA === 3"
          type="form"
          @submit="nextStepA"
          :actions="false"
          id="sectionC"
        >
          <h3 class="text-lg font-semibold mb-4">C. Kemahiran</h3>

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
          />

          <div class="flex justify-between gap-3 mt-6">
            <rs-button
              type="button"
              variant="primary-outline"
              @click="prevStepA"
              >Kembali</rs-button
            >
            <rs-button type="submit" variant="primary" @click="nextStepA"
              >Seterusnya ke Maklumat Kediaman</rs-button
            >
          </div>
        </FormKit>

        <!-- Section D Form -->
        <FormKit
          v-if="currentStepA === 4"
          type="form"
          @submit="nextStepA"
          :actions="false"
          id="sectionD"
        >
          <h3 class="text-lg font-semibold mb-4">
            D. Maklumat Kediaman/Tempat Tinggal
          </h3>

          <!-- Alamat Section -->
          <div class="mb-6">
            <h4 class="text-md font-medium mb-3">Alamat Terkini</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit
                type="textarea"
                name="alamat_terkini"
                label="Alamat Terkini"
                validation="required"
              />

              <div class="flex gap-2">
                <FormKit
                  v-model="lokasi"
                  label="Lokasi"
                  type="text"
                  validation="required"
                  validation-visibility="dirty"
                  class="flex-1"
                />
                <rs-button
                  type="button"
                  variant="primary-outline"
                  @click="selectLocation"
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
                name="tempoh_menetap"
                label="Tempoh Menetap (Tahun)"
                min="0"
                validation="required|min:0"
              />

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
            <rs-button type="submit" variant="primary" @click="nextStepA"
              >Seterusnya ke Maklumat Pinjaman</rs-button
            >
          </div>
        </FormKit>

        <!-- Section E Form -->
        <FormKit
          v-if="currentStepA === 5"
          type="form"
          @submit="nextStepA"
          :actions="false"
          id="sectionE"
        >
          <h3 class="text-lg font-semibold mb-4">E. Maklumat Pinjaman Harta</h3>

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
            <rs-button type="submit" variant="primary" @click="nextStepA"
              >Seterusnya ke Maklumat Pemilikan</rs-button
            >
          </div>
        </FormKit>

        <!-- Section F Form -->
        <FormKit
          v-if="currentStepA === 6"
          type="form"
          @submit="nextStepA"
          :actions="false"
          id="sectionF"
        >
          <h3 class="text-lg font-semibold mb-4">F. Maklumat Pemilikan</h3>

          <h4 class="font-medium mb-2">Aset Cair:</h4>
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

          <h4 class="font-medium mb-2 mt-4">Aset Tidak Cair:</h4>
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
            <rs-button type="submit" variant="primary" @click="nextStepA"
              >Seterusnya ke Maklumat Waris</rs-button
            >
          </div>
        </FormKit>

        <!-- Section G Form - Maklumat Waris -->
        <FormKit
          v-if="currentStepA === 7"
          type="form"
          @submit="nextStepA"
          :actions="false"
          id="sectionG"
        >
          <h3 class="text-lg font-semibold mb-4">
            G. Maklumat Waris
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
            <rs-button type="submit" variant="primary" @click="nextStepA"
              >Seterusnya ke Pengesahan</rs-button
            >
          </div>
        </FormKit>

        <!-- Section H Form - Pengesahan -->
        <FormKit
          v-if="currentStepA === 8"
          type="form"
          @submit="nextStepA"
          :actions="false"
          id="sectionH"
        >
          <h3 class="text-lg font-semibold mb-4">
            H. Pengesahan
          </h3>

          <!-- <div class="mb-6">
            <h4 class="font-medium mb-3">1. Bantuan Penolong Amil</h4>
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
                name="nama_penolong_amil_bantuan"
                label="Nama Penolong Amil"
                :options="[
                  'Ahmad bin Abdullah',
                  'Siti binti Mohamed',
                  'Mohd Ali bin Hassan',
                  'Nurul Huda binti Ismail',
                  'Abdul Rahman bin Omar',
                  'Fatimah binti Ahmad',
                  'Mohd Yusof bin Ibrahim',
                  'Aminah binti Abdullah',
                  'Hassan bin Mohamed',
                  'Noraini binti Ali'
                ]"
                placeholder="Pilih nama penolong amil"
                validation="required"
              />
              <FormKit
                type="select"
                name="kariah_bantuan"
                label="Kariah"
                :options="[
                  'Masjid Al-Hidayah',
                  'Masjid Al-Ikhlas',
                  'Masjid Al-Amin',
                  'Masjid Al-Muttaqin',
                  'Masjid Al-Muhajirin',
                  'Masjid Al-Ansar',
                  'Masjid Al-Falah',
                  'Masjid Al-Huda',
                  'Masjid Al-Munawwarah',
                  'Masjid Al-Rahman'
                ]"
                placeholder="Pilih kariah"
                validation="required"
              />

              <FormKit
                type="date"
                name="tarikh_bantuan"
                label="Tarikh Bantuan"
                validation="required"
              />
            </div>
          </div> -->

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

          <div class="flex justify-between gap-3 mt-6">
            <rs-button
              type="button"
              variant="primary-outline"
              @click="prevStepA"
              >Kembali</rs-button
            >
            <rs-button type="submit" variant="primary" @click="nextStepA"
              >Seterusnya ke Pengesahan Bermastautin</rs-button
            >
          </div>
        </FormKit>

        <!-- Section I Form - Pengesahan Bermastautin -->
        <FormKit
          v-if="currentStepA === 9"
          type="form"
          @submit="nextStepA"
          :actions="false"
          id="sectionI"
        >
          <h3 class="text-lg font-semibold mb-4">
            I. Pengesahan Bermastautin
          </h3>

          <div class="mb-6">
            <h4 class="font-medium mb-3">Maklumat Pengesahan Permastautin</h4>
            <p class="text-sm text-gray-600 mb-4">
              *(Wakil Rakyat/Penghulu/Ketua Kampung/Ketua Penduduk/Nazir Masjid/Pengerusi Surau/Penolong Amil/Guru Pembimbing Asnaf Muallaf/Eksekutif LZS/Ketua Operasi Agihan Daerah LZS/Ketua Jabatan LZS/Pengurus LZS/Ketua Cawangan LZS.)
            </p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit
                type="file"
                name="surat_pengesahan_bermastautin"
                label="Surat Pengesahan Bermastautin"
                help="Format yang dibenarkan: PDF, JPG, PNG. Saiz maksimum: 5MB"
                validation="required|max:5|mime:application/pdf,image/jpeg,image/png"
                validation-messages="{
                  required: 'Sila muat naik surat pengesahan bermastautin',
                  max: 'Saiz fail tidak boleh melebihi 5MB',
                  mime: 'Format fail tidak dibenarkan'
                }"
              />

              <FormKit
                type="text"
                name="nama_pengesah"
                label="Nama"
                validation="required"
              />

              <FormKit
                type="text"
                name="jawatan_pengesah"
                label="Jawatan"
                validation="required"
              />

              <FormKit
                type="text"
                name="no_telefon_pengesah"
                label="No Telefon"
                validation="required"
              />

              <FormKit
                type="date"
                name="tarikh_pengesahan_permastautin"
                label="Tarikh Pengesahan"
                validation="required"
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
            <rs-button type="submit" variant="primary" @click="nextStepA"
              >Seterusnya ke Maklumat Peribadi Tanggungan</rs-button
            >
          </div>
        </FormKit>

        <!-- Section J Form - Pegawai Pendaftar -->
        <FormKit
          v-if="currentStepA === 10"
          type="form"
          @submit="nextStepA"
          :actions="false"
          id="sectionJ"
        >
          <h3 class="text-lg font-semibold mb-4">
            J. Maklumat Pegawai Pendaftar
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
              @click="prevStepA"
              >Kembali</rs-button
            >
            <rs-button type="submit" variant="primary" @click="nextStepA"
              >Seterusnya ke Maklumat Peribadi Tanggungan</rs-button
            >
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
              class="text-center flex-1 cursor-pointer transition-colors duration-150"
              :class="{ 'font-semibold text-primary': currentStepB >= step.id, 'hover:text-primary': true }"
              @click="goToStepB(step.id)"
            >
              {{ step.label }}
            </div>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2.5">
            <div
              class="bg-primary h-2.5 rounded-full"
              :style="`width: ${(currentStepB / totalStepsB) * 100}%`"
            ></div>
          </div>
        </div>

        <!-- NEW Section B Form - Maklumat Peibadi Tanggungan -->
        <FormKit
          v-if="currentStepB === 1"
          type="form"
          @submit="nextStepB"
          :actions="false"
        >
          <h3 class="text-lg font-semibold mb-4">
            B. Maklumat Peribadi Tanggungan
          </h3>

          <!-- A. Maklumat Peibadi Tanggungan -->
          <div class="mb-6">
            <h4 class="font-medium mb-3">A. Maklumat Peribadi Tanggungan</h4>
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
                label="Nama (asal utk muallaf)"
                validation="required"
              />

              <FormKit
                type="text"
                name="nama_selepas_islam"
                label="Nama Selepas Islam (Muallaf)"
              />

              <FormKit
                type="select"
                name="jenis_id"
                label="Jenis ID"
                placeholder="Pilih jenis ID"
                :options="['Kad Pengenalan', 'Foreign ID']"
                validation="required"
                v-model="jenisIdTanggungan"
              />

              <div v-if="jenisIdTanggungan" class="md:col-span-2">
                <FormKit
                  type="file"
                  name="dokumen_id"
                  :label="`Upload Document`"
                  accept=".pdf,.jpg,.jpeg,.png"
                  help="Format yang dibenarkan: PDF, JPG, PNG. Saiz maksimum: 5MB"
                  validation="required|max:5|mime:application/pdf,image/jpeg,image/png"
                />
              </div>

              <FormKit
                type="text"
                name="no_id_tanggungan"
                label="No ID"
              />

              <FormKit
                type="text"
                name="no_pengenalan_tanggungan"
                label="No Polis/No Tentera/No Sijil Lahir"
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
                type="date"
                name="tarikh_lahir_tanggungan"
                label="Tarikh Lahir"
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
                type="date"
                name="tarikh_masuk_islam"
                label="*Tarikh Masuk Islam"
                help="Format: dd-mm-yyyy"
                validation="required"
                v-model="tarikhMasukIslam"
              />

              <FormKit
                v-if="tarikhMasukIslam"
                type="file"
                name="dokumen_masuk_islam"
                label="*upload surat keislaman dari MAIS"
                help="Format yang dibenarkan: PDF, JPG, PNG. Saiz maksimum: 5MB"
                accept=".pdf,.jpg,.jpeg,.png"
                validation="required|max:5|mime:application/pdf,image/jpeg,image/png"
              />

              <FormKit
                type="date"
                name="tarikh_masuk_kfam_tanggungan"
                label="*Tarikh Masuk Kelas Fardu Ain Muallaf (KFAM)"
                help="Format: dd-mm-yyyy"
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

              <FormKit
                type="text"
                name="no_telefon_tanggungan"
                label="No Telefon/Telefon Bimbit"
              />
            </div>
          </div>

          <!-- Maklumat Perbankan -->
          <div class="mb-6">
            <h4 class="font-medium mb-3">Maklumat Perbankan</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit
                type="text"
                name="nama_pemegang_akaun"
                label="Nama Pemegang Akaun"
              />

              <FormKit type="text" name="bank" label="Bank" />

              <FormKit
                type="text"
                name="no_akaun_bank"
                label="No Akaun Bank"
              />

              <FormKit
                type="select"
                name="cara_pembayaran"
                label="Cara Pembayaran"
                :options="['Akaun', 'Cek', 'Tunai Nyatakan Sebab']"
              />

              <FormKit
                v-if="paymentMethod === 'Tunai Nyatakan Sebab'"
                type="select"
                name="sebab_tunai"
                label="Sebab Pembayaran Tunai"
                :options="['Uzur/Sakit', 'Muflis', 'Disenarai Hitam']"
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
            <rs-button type="submit" variant="primary" @click="nextStepB"
              >Seterusnya ke Pendidikan</rs-button
            >
          </div>
        </FormKit>

        <FormKit
          v-if="currentStepB === 2"
          type="form"
          @submit="nextStepB"
          :actions="false"
        >
          <!-- B. Pendidikan -->
          <div class="mb-6">
            <h4 class="font-medium mb-3">B. Pendidikan</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit
                type="select"
                name="bersekolah_tanggungan"
                label="Bersekolah"
                :options="['Ya', 'Tidak']"
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
              />

              <FormKit
                type="select"
                name="jenis_sekolah"
                label="Jenis Sekolah"
                :options="[
                  'Pra Sekolah',
                  'Sekolah Rendah Kebangsaan',
                  'Sekolah Menengah Kebangsaan',
                  'Sekolah Menengah Agama',
                  'Sekolah Rendah Kebangsaan dan Agama',
                  'IPTA/IPTS',
                  'Maahd Tahfiz',
                ]"
              />

              <div class="col-span-full">
                <h5 class="font-medium mb-2">
                  Nama dan Alamat Sekolah/Institusi (SEK.MEN/SRK/IPTA/IPTS)
                </h5>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormKit
                    type="text"
                    name="nama_sekolah"
                    label="Nama Sekolah"
                  />

                  <FormKit type="text" name="alamat_sekolah" label="Alamat" />

                  <FormKit type="text" name="daerah_sekolah" :options="daerahOptions" label="Daerah" />

                  <FormKit type="text" name="negeri_sekolah" :options="negeriOptions" label="Negeri" />

                  <FormKit type="text" name="poskod_sekolah" label="Poskod" />
                </div>
              </div>

              <div class="col-span-full">
                <h5 class="font-medium mb-2">
                  Nama dan Alamat Sekolah/Institusi (SRA/KAFA)
                </h5>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormKit
                    type="text"
                    name="nama_sekolah_agama"
                    label="Nama Sekolah"
                  />

                  <FormKit
                    type="text"
                    name="alamat_sekolah_agama"
                    label="Alamat"
                  />

                  <FormKit
                    type="text"
                    name="daerah_sekolah_agama"
                    label="Daerah"
                  />

                  <FormKit
                    type="text"
                    name="negeri_sekolah_agama"
                    label="Negeri"
                  />

                  <FormKit
                    type="text"
                    name="poskod_sekolah_agama"
                    label="Poskod"
                  />
                </div>
              </div>

              <FormKit
                type="select"
                name="tinggal_bersama_keluarga"
                label="Tinggal Bersama Keluarga"
                :options="['Ya', 'Tidak', 'Asrama']"
              />

              <FormKit
                type="file"
                name="dokumen_tinggal_bersama_keluarga"
                label="Upload Dokumen"
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
            <rs-button type="submit" variant="primary" @click="nextStepB"
              >Seterusnya ke Kesihatan</rs-button
            >
          </div>
        </FormKit>

        <FormKit
          v-if="currentStepB === 3"
          type="form"
          @submit="nextStepB"
          :actions="false"
        >
          <!-- C. Kesihatan -->
          <div class="mb-6">
            <h4 class="font-medium mb-3">C. Kesihatan</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit
                type="select"
                name="tahap_kesihatan_tanggungan"
                label="Tahap Kesihatan"
                :options="['Sihat', 'Sakit Kronik', 'OKU', 'Uzur']"
                v-model="healthStatusTanggungan"
              />

              <div
                v-if="healthStatusTanggungan === 'Sakit Kronik'"
                class="col-span-full ml-6"
              >
                <h5 class="font-medium mb-2">Sakit Kronik</h5>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                </div>
              </div>

              <div
                v-if="healthStatusTanggungan === 'OKU'"
                class="col-span-full ml-6"
              >
                <h5 class="font-medium mb-2">OKU</h5>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                </div>
              </div>

              <div
                v-if="healthStatusTanggungan === 'Uzur'"
                class="col-span-full ml-6"
              >
                <h5 class="font-medium mb-2">Uzur</h5>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>
          </div>

          <div class="flex justify-between gap-3 mt-6">
            <rs-button
              type="button"
              variant="primary-outline"
              @click="prevStepB"
              >Kembali</rs-button
            >
            <rs-button type="submit" variant="primary" @click="nextStepB"
              >Seterusnya ke Kemahiran</rs-button
            >
          </div>
        </FormKit>

        <FormKit
          v-if="currentStepB === 4"
          type="form"
          @submit="nextStepB"
          :actions="false"
        >
          <!-- D. Kemahiran -->
          <div class="mb-6">
            <h4 class="font-medium mb-3">D. Kemahiran</h4>
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
                'Lain-lain Nyatakan',
              ]"
            />
          </div>

          <div class="flex justify-end gap-3 mt-6">
            <rs-button
              type="button"
              variant="primary-outline"
              @click="prevStepB"
              >Kembali</rs-button
            >
            <rs-button type="submit" variant="primary" @click="nextStepB"
              >Seterusnya ke Pekerjaan</rs-button
            >
          </div>
        </FormKit>

        <FormKit
          v-if="currentStepB === 5"
          type="form"
          @submit="nextStepB"
          :actions="false"
        >
          <!-- E. Maklumat Pekerjaan -->
          <div class="mb-6">
            <h4 class="font-medium mb-3">E. Maklumat Pekerjaan</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit
                type="select"
                name="pekerjaan_status"
                label="Pekerjaan"
                :options="[
                  'Bekerja Nyatakan Jawatan',
                  'Tidak Bekerja Nyatakan',
                ]"
              />

              <FormKit
                type="select"
                name="sektor_pekerjaan"
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
                name="nama_majikan"
                label="Nama Majikan"
              />

              <FormKit
                type="text"
                name="no_tel_majikan"
                label="No Tel Majikan"
              />

              <FormKit
                type="text"
                name="alamat_majikan"
                label="Alamat Majikan"
              />

              <FormKit type="text" name="bandar_majikan" label="Bandar" />

              <FormKit type="text" name="poskod_majikan" label="Poskod" />

              <FormKit type="text" name="daerah_majikan" label="Daerah" />

              <FormKit type="text" name="negeri_majikan" label="Negeri" />

              <FormKit type="text" name="jawatan" label="Jawatan" />

              <FormKit type="text" name="negara_pekerjaan" label="Negara" />

              <FormKit
                type="select"
                name="status_jawatan"
                label="Status Jawatan"
                :options="['Tetap', 'Kontrak', 'Sementara']"
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
            <rs-button
              type="submit"
              variant="primary"
              @click="nextStepB"
              :disabled="processing"
            >
              <span v-if="processing">
                <Icon name="eos-icons:loading" class="ml-1" size="1rem" />
              </span>
              <span v-else>Seterusnya ke Penilaian Awal</span>
            </rs-button>
          </div>
        </FormKit>

        <FormKit
          v-if="currentStepB === 6"
          type="form"
          @submit="submitForm"
          :actions="false"
          id="sectionJ"
        >
          <h3 class="text-lg font-semibold mb-4">
            J. Penilaian Awal
          </h3>

          <div class="space-y-6">
            <!-- Question 1 -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">
                1. Adakah tuan/puan mempunyai komitmen dan pembiayaan melibatkan kos yang tinggi?*
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
                2. Apakah keperluan tuan/puan mendesak sekarang ini?*
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
                3. Muat naik dokumen sokongan (PDF, JPG, PNG)*
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
              <rs-button
                type="button"
                variant="primary-outline"
                @click="prevStepB"
                >Kembali</rs-button
              >
              <div class="flex gap-3">
                    <rs-button type="button" variant="secondary" @click="handleSave"
                      >Simpan</rs-button
                    >
                    <rs-button type="submit" variant="primary" @click="handleSubmit"
                      >Hantar Permohonan</rs-button
                    >
                  </div>
            </div>
          </div>
        </FormKit>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useToast } from "vue-toastification";
import { useRouter } from "vue-router";

const router = useRouter();
const toast = useToast();

definePageMeta({
  title: "Borang Permohonan Lengkap",
});

const breadcrumb = ref([
  {
    name: "Borang Permohonan Lengkap",
    type: "current",
    path: "/BF-PRF/AS/FR/02",
  },
]);

const processing = ref(false);
const currentSection = ref(1);

const currentStepA = ref(1);
const totalStepsA = 9;
const healthStatus = ref("");
const dibantuPenolongAmil = ref("");
const hubunganKakitanganLZS = ref("");
const jenisIdTanggungan = ref("");
const hubunganPemohon = ref("");


const stepsA = [
  { id: 1, label: "Maklumat Peribadi" },
  { id: 2, label: "Kesihatan" },
  { id: 3, label: "Kemahiran" },
  { id: 4, label: "Kediaman" },
  { id: 5, label: "Pinjaman" },
  { id: 6, label: "Pemilikan" },
  { id: 7, label: "Waris" },
  { id: 8, label: "Pengesahan" },
  { id: 9, label: "Pengesahan Bermastautin" },
  // { id: 10, label: "Pegawai Pendaftar" }
];

const currentStepB = ref(1);
const totalStepsB = 6;

const healthStatusTanggungan = ref("");
const paymentMethod = ref("");

const showLainInput = computed(() => {
  return formData.value.keperluanMendesak?.includes('lain');
});

const tarikhMasukIslam = ref(null);

const statusPoligami = ref(null);
const bilanganIsteri = ref(null);
const isteriList = ref([]);

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

const formData = ref({
  // Section A - Maklumat Peribadi Asnaf
  nama_ketua_keluarga: '',
  jenis_id: '',
  no_pengenalan: '',
  warganegara: '',
  jantina: '',
  bangsa: '',
  bersekolah: '',
  pendidikan_tertinggi: '',
  tarikh_masuk_islam: '',
  tarikh_masuk_kfam: '',
  status_perkahwinan: '',

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

  // Section C - Kemahiran
  kemahiran: '',

  // Section D - Maklumat Kediaman
  status_kediaman: '',
  tapak_rumah: '',
  jenis_rumah: '',
  binaan_rumah: '',
  keadaan_kediaman: '',
  bekalan_air: '',
  bil_air: '',
  bekalan_elektrik: '',
  bil_elektrik: '',
  penyelenggaraan: '',
  bil_penyelenggaraan: '',

  // Section E - Maklumat Pinjaman
  pemberi_pinjaman: '',
  jenis_pinjaman: '',
  bayaran_bulanan: '',
  jumlah_perbelanjaan: '',
  tahun_mula_pinjaman: '',
  tahun_akhir_pinjaman: '',

  // Section F - Maklumat Pemilikan
  wang_simpanan: '',
  emas: '',
  saham: '',
  kenderaan: '',
  rumah_kedai: '',
  tanah_sawah: '',

  // Section G - Pengesahan
  dibantu_penolong_amil: '',
  nama_penolong_amil_bantuan: '',
  kariah_bantuan: '',
  tarikh_bantuan: '',
  hubungan_kakitangan_lzs: '',
  nama_kakitangan: '',
  jawatan_kakitangan: '',
  pejabat_kakitangan: '',
  hubungan_kakitangan: '',
  tarikh_perakuan: '',

  // Section H - Pengesahan Bermastautin
  ulasan_pengesahan: '',
  nama_pengesah: '',
  jawatan_pengesah: '',
  no_telefon_pengesah: '',
  tarikh_pengesahan_permastautin: '',

  // Section I - Maklumat Penolong Amil
  nama_penolong_amil: '',
  jenis_permohonan: '',
  tarikh_proses: '',

  // Section J - Penilaian Awal
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
  nama_pemegang_akaun: '',
  bank: '',
  no_akaun_bank: '',
  cara_pembayaran: '',
  sebab_tunai: '',

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

  // Add this line for heirs array
  heirs: []
});

const nextStepA = () => {
  if (currentStepA.value < totalStepsA) {
    currentStepA.value++;
  } else if (currentStepA.value === totalStepsA) {
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

const submitForm = () => {
  processing.value = true;

  // setTimeout(() => {
    navigateTo(`/BF-PRF/AS/FR/03`);
  // }, 1000);
};

const handleSave = async () => {
  try {
    // Handle form saving
    console.log("Form saved:", formData.value);
    // Add your save logic here (API call, etc.)

    toast.success("Permohonan berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Permohonan tidak berjaya disimpan");
    console.error("Save error:", error);
  }
};

const handleSubmit = async () => {
  try {
  // Handle form submission
  console.log("Form submitted:", formData.value);
  // Add your submission logic here (API call, etc.)

    toast.success("Permohonan berjaya dikemaskini");
    
    // Wait for 2 seconds before navigating
    // setTimeout(() => {
      router.push("/BF-PRF/AS/UP/04");
    // }, 2000);
  } catch (error) {
    toast.error("Ralat! Permohonan tidak berjaya dihantar");
    console.error("Submission error:", error);
  }
};

const saluranBencana = ref(null);

const caraPembayaran = ref(null);

const bankOptions = [
  { label: "Maybank", value: "maybank" },
  { label: "CIMB", value: "cimb" },
  { label: "RHB", value: "rhb" },
  { label: "Bank Islam", value: "bank-islam" },
  { label: "Bank Rakyat", value: "bank-rakyat" },
  { label: "Public Bank", value: "public-bank" },
  { label: "Hong Leong Bank", value: "hong-leong" },
  { label: "Ambank", value: "ambank" },
  { label: "BSN", value: "bsn" },
  { label: "Affin Bank", value: "affin" },
  { label: "UOB", value: "uob" },
  { label: "OCBC", value: "ocbc" },
  { label: "Standard Chartered", value: "standard-chartered" },
  { label: "Alliance Bank", value: "alliance" },
  { label: "Agrobank", value: "agrobank" }
];

const jenisId = ref(null);

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

const lokasi = ref('');

const selectLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      () => {
        lokasi.value = 'Lokasi semasa';
        toast.success('Lokasi berjaya diperoleh!');
      },
      (error) => {
        toast.error('Tidak dapat mendapatkan lokasi.');
      }
    );
  } else {
    toast.error('Geolocation tidak disokong oleh pelayar ini.');
  }
};

const statusKediaman = ref(null);

const pemberiPinjaman = ref('');
const jenisPinjaman = ref('');
const bayaranBulanan = ref(null);
const jumlahPerbelanjaan = ref(null);
const tahunMulaPinjaman = ref(null);
const tahunAkhirPinjaman = ref(null);

const hasLoanInfo = computed(() => {
  return pemberiPinjaman.value || 
         jenisPinjaman.value || 
         bayaranBulanan.value || 
         jumlahPerbelanjaan.value || 
         tahunMulaPinjaman.value || 
         tahunAkhirPinjaman.value;
});

// Add these functions for handling heirs
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

const goToStepA = (stepId) => {
  currentStepA.value = stepId;
};
const goToStepB = (stepId) => {
  currentStepB.value = stepId;
};
</script>

<style scoped></style>
