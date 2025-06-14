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

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormKit
              type="text"
              name="nama_ketua_keluarga"
              label="1. Nama Ketua Keluarga (Untuk Mualaf nama mengikut pengenalan)"
              validation="required"
            />

            <FormKit
              type="select"
              name="jenis_pengenalan"
              label="2. Jenis Pengenalan"
              :options="[
                'MyKad',
                'MyKid',
                'Pasport',
                'Polis',
                'Tentera',
                'Sijil Beranak',
              ]"
              validation="required"
            />

            <FormKit
              type="text"
              name="no_pengenalan"
              label="3. No Kad Pengenalan/No Polis/No Tentera/No Pasport/No Sijil Beranak"
              validation="required"
            />

            <FormKit
              type="select"
              name="warganegara"
              label="4. Warganegara"
              :options="['Warganegara', 'Bukan Warganegara']"
              validation="required"
            />

            <FormKit
              type="select"
              name="jantina"
              label="5. Jantina"
              :options="['Lelaki', 'Perempuan']"
              validation="required"
            />

            <FormKit
              type="select"
              name="bangsa"
              label="6. Bangsa"
              :options="['Melayu', 'Cina', 'India', 'Lain-lain']"
              validation="required"
            />

            <FormKit
              type="select"
              name="bersekolah"
              label="7. Bersekolah"
              :options="['Ya', 'Tidak']"
              validation="required"
            />

            <FormKit
              type="select"
              name="pendidikan_tertinggi"
              label="8. Pendidikan Tertinggi"
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
            />

            <FormKit
              type="date"
              name="tarikh_masuk_islam"
              label="9. *Tarikh Masuk Islam"
              help="Format: dd-mm-yyyy"
              validation="required"
            />

            <FormKit
              type="date"
              name="tarikh_masuk_kfam"
              label="10. *Tarikh Masuk Kelas Fardu Ain Muallaf (KFAM)"
              help="Format: dd-mm-yyyy"
              validation="required"
            />

            <FormKit
              type="select"
              name="status_perkahwinan"
              label="11. Status Perkahwinan"
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
            label="1. Tahap Kesihatan"
            :options="['Sihat', 'Sakit Kronik', 'OKU', 'Uzur']"
            validation="required"
            v-model="healthStatus"
          />

          <div v-if="healthStatus === 'Sakit Kronik'" class="ml-6 mt-2">
            <FormKit
              type="select"
              name="keadaan_kesihatan_sakit"
              label="a. Keadaan Kesihatan"
              :options="['Terlantar', 'Tidak Terlantar']"
            />

            <FormKit
              type="select"
              name="kos_penjagaan_sakit"
              label="b. Kos Penjagaan"
              :options="['Berbayar', 'Tidak berbayar']"
            />

            <FormKit
              type="number"
              name="perbelanjaan_bulanan_sakit"
              label="c. Jumlah Perbelanjaan Bulanan (RM)"
              step="0.01"
              min="0"
            />
          </div>

          <div v-if="healthStatus === 'OKU'" class="ml-6 mt-2">
            <FormKit
              type="select"
              name="kesempurnaan_fizikal"
              label="a. Kesempurnaan Fizikal"
              :options="['Sempurna', 'Cacat Mental', 'Cacat Fizikal']"
            />

            <FormKit
              type="select"
              name="sebab_kecacatan"
              label="b. Sebab Kecacatan (Jika Cacat)"
              :options="['Sejak Lahir', 'Musibah']"
            />

            <FormKit
              type="select"
              name="tahap_kecacatan"
              label="c. Tahap Kecacatan"
              :options="['Terlantar', 'Tidak Terlantar']"
            />

            <FormKit
              type="number"
              name="perbelanjaan_bulanan_oku"
              label="d. Jumlah Perbelanjaan Bulanan (RM)"
              step="0.01"
              min="0"
            />
          </div>

          <div v-if="healthStatus === 'Uzur'" class="ml-6 mt-2">
            <FormKit
              type="select"
              name="keadaan_kesihatan_uzur"
              label="a. Keadaan Kesihatan"
              :options="['Terlantar', 'Tidak Terlantar']"
            />

            <FormKit
              type="select"
              name="kos_penjagaan_uzur"
              label="b. Kos Penjagaan"
              :options="['Berbayar', 'Tidak berbayar']"
            />

            <FormKit
              type="number"
              name="perbelanjaan_bulanan_uzur"
              label="c. Jumlah Perbelanjaan Bulanan (RM)"
              step="0.01"
              min="0"
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

          <FormKit
            type="select"
            name="status_kediaman"
            label="1. Status Kediaman/Tempat Tinggal"
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
          />

          <FormKit
            type="select"
            name="tapak_rumah"
            label="2. Tapak Rumah"
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
            label="3. Jenis Rumah"
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
            label="4. Binaan Rumah"
            :options="['Batu', 'Kayu', 'Separa Batu', 'Lain-lain']"
            validation="required"
          />

          <FormKit
            type="select"
            name="keadaan_kediaman"
            label="5. Keadaan Kediaman"
            :options="['Baik/Sempurna', 'Uzur', 'Separa Uzur']"
            validation="required"
          />

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <FormKit
                type="select"
                name="bekalan_air"
                label="6. Kemudahan Asas Bekalan Air"
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
            label="1. Nama Institusi/Individu Pemberi Pinjaman"
          />

          <FormKit
            type="text"
            name="jenis_pinjaman"
            label="2. Jenis Pinjaman"
          />

          <FormKit
            type="number"
            name="bayaran_bulanan"
            label="3. Amaun Bayaran Bulanan (RM)"
            step="0.01"
            min="0"
          />

          <FormKit
            type="number"
            name="jumlah_perbelanjaan"
            label="4. Jumlah Keseluruhan Perbelanjaan (RM)"
            step="0.01"
            min="0"
          />

          <FormKit
            type="date"
            name="tahun_mula_pinjaman"
            label="5. Tahun Mula Pinjaman"
          />

          <FormKit
            type="date"
            name="tahun_akhir_pinjaman"
            label="6. Tahun Akhir Pinjaman"
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

          <h4 class="font-medium mb-2">1. Aset Cair:</h4>
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

          <h4 class="font-medium mb-2 mt-4">2. Aset Tidak Cair:</h4>
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
              >Seterusnya ke Pengesahan</rs-button
            >
          </div>
        </FormKit>

        <!-- Section G Form -->
        <FormKit
          v-if="currentStepA === 7"
          type="form"
          @submit="nextStepA"
          :actions="false"
          id="sectionG"
        >
          <h3 class="text-lg font-semibold mb-4">
            G. Pengesahan
          </h3>

          <div class="mb-6">
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
                type="text"
                name="nama_penolong_amil_bantuan"
                label="Nama Penolong Amil"
                validation="required"
              />
              <FormKit
                type="text"
                name="kariah_bantuan"
                label="Kariah"
                validation="required"
              />

              <FormKit
                type="date"
                name="tarikh_bantuan"
                label="Tarikh Bantuan"
                validation="required"
              />
            </div>
          </div>

          <div class="mb-6">
            <h4 class="font-medium mb-3">2. Maklumat Perakuan Pemohon</h4>
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

        <!-- Section H Form - Pengesahan Bermastautin -->
        <FormKit
          v-if="currentStepA === 8"
          type="form"
          @submit="nextStepA"
          :actions="false"
          id="sectionH"
        >
          <h3 class="text-lg font-semibold mb-4">
            H. Pengesahan Bermastautin
          </h3>

          <div class="mb-6">
            <h4 class="font-medium mb-3">Maklumat Pengesahan Permastautin</h4>
            <p class="text-sm text-gray-600 mb-4">
              *(Wakil Rakyat/Penghulu/Ketua Kampung/Ketua Penduduk/Nazir Masjid/Pengerusi Surau/Penolong Amil/Guru Pembimbing Asnaf Muallaf/Eksekutif LZS/Ketua Operasi Agihan Daerah LZS/Ketua Jabatan LZS/Pengurus LZS/Ketua Cawangan LZS.)
            </p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit
                type="textarea"
                name="ulasan_pengesahan"
                label="Ulasan"
                validation="required"
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
              >Seterusnya ke Maklumat Penolong Amil</rs-button
            >
          </div>
        </FormKit>

        <!-- Section I Form -->
        <FormKit
          v-if="currentStepA === 9"
          type="form"
          @submit="nextStepA"
          :actions="false"
          id="sectionI"
        >
          <h3 class="text-lg font-semibold mb-4">
            I. Maklumat Penolong Amil (login sebagai penolong amil)
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormKit
              type="select"
              name="nama_penolong_amil"
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
              name="jenis_permohonan"
              label="Jenis Permohonan"
              placeholder="Pilih jenis permohonan"
              :options="['Baru', 'Review']"
              validation="required"
            />

            <FormKit
              type="date"
              name="tarikh_proses"
              label="Tarikh Proses"
              validation="required"
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
              class="text-center flex-1"
              :class="{ 'font-semibold': currentStepB >= step.id }"
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
                label="1. Hubungan dengan Pemohon/Asnaf"
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
              />

              <FormKit
                type="text"
                name="nama_tanggungan"
                label="2. Nama (Untuk Mualaf nama mengikut pengenalan)"
                validation="required"
              />

              <FormKit
                type="select"
                name="jenis_pengenalan_tanggungan"
                label="3. Jenis Pengenalan"
                :options="[
                  'MyKad',
                  'MyKid',
                  'Pasport',
                  'Polis',
                  'Tentera',
                  'Sijil Beranak',
                ]"
                validation="required"
              />

              <FormKit
                type="text"
                name="no_pengenalan_tanggungan"
                label="4. No Kad Pengenalan/No Polis/No Tentera/No Pasport/No Sijil Beranak"
                validation="required"
              />

              <FormKit
                type="select"
                name="jantina_tanggungan"
                label="5. Jantina"
                :options="['Lelaki', 'Perempuan']"
                validation="required"
              />

              <FormKit
                type="date"
                name="tarikh_lahir_tanggungan"
                label="6. Tarikh Lahir"
                validation="required"
              />

              <FormKit
                type="text"
                name="tempat_lahir_tanggungan"
                label="7. Tempat Lahir"
                validation="required"
              />

              <FormKit
                type="select"
                name="bangsa_tanggungan"
                label="8. Bangsa"
                :options="['Melayu', 'Cina', 'India', 'Lain-lain Nyatakan']"
                validation="required"
              />

              <FormKit
                type="select"
                name="status_perkahwinan_tanggungan"
                label="9. Status Perkahwinan"
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
                name="tarikh_masuk_islam_tanggungan"
                label="10. *Tarikh Masuk Islam"
                help="Format: dd-mm-yyyy"
              />

              <FormKit
                type="date"
                name="tarikh_masuk_kfam_tanggungan"
                label="11. *Tarikh Masuk Kelas Fardu Ain Muallaf (KFAM)"
                help="Format: dd-mm-yyyy"
              />

              <FormKit
                type="select"
                name="warganegara_tanggungan"
                label="12. Warganegara"
                :options="['Warganegara', 'Bukan Warganegara']"
                validation="required"
              />

              <FormKit
                type="number"
                name="tempoh_menetap_selangor"
                label="13. Tempoh Menetap Di Selangor (Tahun)"
                min="0"
              />

              <FormKit
                type="text"
                name="no_telefon_tanggungan"
                label="14. No Telefon/Telefon Bimbit"
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
                label="1. Nama Pemegang Akaun"
              />

              <FormKit type="text" name="bank" label="2. Bank" />

              <FormKit
                type="text"
                name="no_akaun_bank"
                label="3. No Akaun Bank"
              />

              <FormKit
                type="select"
                name="cara_pembayaran"
                label="4. Cara Pembayaran"
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
                label="1. Bersekolah"
                :options="['Ya', 'Tidak']"
              />

              <FormKit
                type="select"
                name="pendidikan_tertinggi_tanggungan"
                label="2. Pendidikan Tertinggi"
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
                label="3. Jenis Sekolah"
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
                  4. Nama dan Alamat Sekolah/Institusi (SEK.MEN/SRK/IPTA/IPTS)
                </h5>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormKit
                    type="text"
                    name="nama_sekolah"
                    label="Nama Sekolah"
                  />

                  <FormKit type="text" name="alamat_sekolah" label="Alamat" />

                  <FormKit type="text" name="daerah_sekolah" label="Daerah" />

                  <FormKit type="text" name="negeri_sekolah" label="Negeri" />

                  <FormKit type="text" name="poskod_sekolah" label="Poskod" />
                </div>
              </div>

              <div class="col-span-full">
                <h5 class="font-medium mb-2">
                  5. Nama dan Alamat Sekolah/Institusi (SRA/KAFA)
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
                label="6. Tinggal Bersama Keluarga"
                :options="['Ya', 'Tidak', 'Asrama']"
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
                label="1. Tahap Kesihatan"
                :options="['Sihat', 'Sakit Kronik', 'OKU', 'Uzur']"
                v-model="healthStatusTanggungan"
              />

              <div
                v-if="healthStatusTanggungan === 'Sakit Kronik'"
                class="col-span-full ml-6"
              >
                <h5 class="font-medium mb-2">2. Sakit Kronik</h5>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormKit
                    type="select"
                    name="keadaan_kesihatan_sakit_tanggungan"
                    label="a. Keadaan Kesihatan"
                    :options="['Terlantar', 'Tidak Terlantar']"
                  />

                  <FormKit
                    type="select"
                    name="kos_penjagaan_sakit_tanggungan"
                    label="b. Kos Penjagaan"
                    :options="['Berbayar', 'Tidak berbayar']"
                  />

                  <FormKit
                    type="number"
                    name="perbelanjaan_bulanan_sakit_tanggungan"
                    label="c. Jumlah Perbelanjaan Bulanan (RM)"
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>

              <div
                v-if="healthStatusTanggungan === 'OKU'"
                class="col-span-full ml-6"
              >
                <h5 class="font-medium mb-2">3. OKU</h5>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormKit
                    type="select"
                    name="kesempurnaan_fizikal_tanggungan"
                    label="a. Kesempurnaan Fizikal"
                    :options="['Sempurna', 'Cacat Mental', 'Cacat Fizikal']"
                  />

                  <FormKit
                    type="select"
                    name="sebab_kecacatan_tanggungan"
                    label="b. Sebab Kecacatan (Jika Cacat)"
                    :options="['Sejak Lahir', 'Musibah']"
                  />

                  <FormKit
                    type="select"
                    name="tahap_kecacatan_tanggungan"
                    label="c. Tahap Kecacatan"
                    :options="['Terlantar', 'Tidak Terlantar']"
                  />

                  <FormKit
                    type="number"
                    name="perbelanjaan_bulanan_oku_tanggungan"
                    label="d. Jumlah Perbelanjaan Bulanan (RM)"
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>

              <div
                v-if="healthStatusTanggungan === 'Uzur'"
                class="col-span-full ml-6"
              >
                <h5 class="font-medium mb-2">4. Uzur</h5>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormKit
                    type="select"
                    name="keadaan_kesihatan_uzur_tanggungan"
                    label="a. Keadaan Kesihatan"
                    :options="['Terlantar', 'Tidak Terlantar']"
                  />

                  <FormKit
                    type="select"
                    name="kos_penjagaan_uzur_tanggungan"
                    label="b. Kos Penjagaan"
                    :options="['Berbayar', 'Tidak berbayar']"
                  />

                  <FormKit
                    type="number"
                    name="perbelanjaan_bulanan_uzur_tanggungan"
                    label="c. Jumlah Perbelanjaan Bulanan (RM)"
                    step="0.01"
                    min="0"
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
                label="1. Pekerjaan"
                :options="[
                  'Bekerja Nyatakan Jawatan',
                  'Tidak Bekerja Nyatakan',
                ]"
              />

              <FormKit
                type="select"
                name="sektor_pekerjaan"
                label="3. Sektor"
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
                label="4. Nama Majikan"
              />

              <FormKit
                type="text"
                name="no_tel_majikan"
                label="5. No Tel Majikan"
              />

              <FormKit
                type="text"
                name="alamat_majikan"
                label="6. Alamat Majikan"
              />

              <FormKit type="text" name="bandar_majikan" label="7. Bandar" />

              <FormKit type="text" name="poskod_majikan" label="8. Poskod" />

              <FormKit type="text" name="daerah_majikan" label="9. Daerah" />

              <FormKit type="text" name="negeri_majikan" label="10. Negeri" />

              <FormKit type="text" name="jawatan" label="11. Jawatan" />

              <FormKit type="text" name="negara_pekerjaan" label="12. Negara" />

              <FormKit
                type="select"
                name="status_jawatan"
                label="13. Status Jawatan"
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
import { ref, computed } from "vue";
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

const stepsA = [
  { id: 1, label: "Maklumat Peribadi" },
  { id: 2, label: "Kesihatan" },
  { id: 3, label: "Kemahiran" },
  { id: 4, label: "Kediaman" },
  { id: 5, label: "Pinjaman" },
  { id: 6, label: "Pemilikan" },
  { id: 7, label: "Pengesahan" },
  { id: 8, label: "Pengesahan Bermastautin" },
  { id: 9, label: "Penolong Amil" },
];

const currentStepB = ref(1);
const totalStepsB = 6;

const healthStatusTanggungan = ref("");
const paymentMethod = ref("");

const showLainInput = computed(() => {
  return formData.value.keperluanMendesak?.includes('lain');
});

const formData = ref({
  // Section A - Maklumat Peribadi Asnaf
  nama_ketua_keluarga: '',
  jenis_pengenalan: '',
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
  jenis_pengenalan_tanggungan: '',
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
  status_jawatan: ''
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

    toast.success("Permohonan berjaya dihantar");
    
    // Wait for 2 seconds before navigating
    // setTimeout(() => {
      router.push("/BF-PRF/AS/FR/04");
    // }, 2000);
  } catch (error) {
    toast.error("Ralat! Permohonan tidak berjaya dihantar");
    console.error("Submission error:", error);
  }
};
</script>

<style scoped></style>
