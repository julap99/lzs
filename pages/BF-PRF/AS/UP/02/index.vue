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
              @click="navigateToStepA(step.id)"
            >
              {{ step.label }}
            </div>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2.5 relative">
            <div
              class="bg-primary h-2.5 rounded-full"
              :style="`width: ${(currentStepA / totalStepsA) * 100}%`"
            ></div>
            <!-- Clickable progress bar -->
            <div 
              class="absolute inset-0 cursor-pointer"
              @click="handleProgressBarClickA"
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
            A. Maklumat Peribadi Asnaf (*untuk muallaf)
          </h3>

          <!-- Personal Information Section -->
          <div class="mb-6">
            <h4 class="text-md font-medium mb-3">I. Maklumat Peribadi</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">


              <FormKit
                type="select"
                name="jenis_id"
                label="Jenis ID"
                :options="['Kad Pengenalan', 'Foreign ID','Sijil Lahir']"
                validation="required"
                v-model="jenisId"
                value="Kad Pengenalan"
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
                name="nombor_id"
                label="Nombor ID"
                validation="required"
                value="123456789"
              />

              <FormKit
                type="text"
                name="nama"
                label="Nama"
                validation="required"
                value="Ahmad bin Ali"
              />

              <FormKit
                type="text"
                name="nopassport"
                label="No Passport"  
                value="A12345678"
              />

              <FormKit
                type="date"
                name="passportStartDate"
                label="Tarikh mula passport"
                value="2025-01-01"
              />
              <FormKit
                type="date"
                name="passportEndDate"
                label="Tarikh tamat passport"
                value="2026-01-01"
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
                value="2000-01-01"
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
                value="Islam"
              />

              <FormKit
                type="email"
                name="emel"
                label="Emel"
                validation="required|email"
                value="ahmad@gmail.com"
              />

              <FormKit
                type="text"
                name="no_telefon"
                label="No Telefon"
                value="0123456789"
              />

              <FormKit
                type="select"
                name="warganegara"
                label="Warganegara"
                :options="['Warganegara', 'Bukan Warganegara']"
                validation="required"
                value="Warganegara"
              />

              <FormKit
                type="select"
                name="jantina"
                label="Jantina"
                :options="['Lelaki', 'Perempuan']"
                validation="required"
                value="Lelaki"
              />

              <FormKit
                type="select"
                name="bangsa"
                label="Bangsa"
                :options="['Melayu', 'Cina', 'India', 'Lain-lain']"
                validation="required"
                value="Melayu"
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
                value="Ya"
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
                value="SPM"
              />
            </div>
          </div>

          <!-- Islamic Information Section -->
          <div class="mb-6">
            <h4 class="text-md font-medium mb-3">Maklumat Islam</h4>
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
                v-model="tarikhMasukIslam"
                value="2025-01-01"
              />

              <!-- Conversion Document (Conditional) -->
              <FormKit
                v-if="tarikhMasukIslam"
                type="file"
                name="dokumen_masuk_islam"
                label="Upload surat keislaman dari MAIS"
                accept=".pdf,.jpg,.jpeg,.png"
                help="Format yang dibenarkan: PDF, JPG, PNG. Saiz maksimum: 5MB"
                validation="required|max:5|mime:application/pdf,image/jpeg,image/png"
              />

              <FormKit
                type="date"
                name="tarikh_masuk_kfam"
                label="Tarikh Masuk Kelas Fardu Ain Muallaf (KFAM)"
                help="Format: dd-mm-yyyy"
                validation="required"
                value="2025-01-01"
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
                value="Berkahwin"
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
                value="Tidak"
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
                v-model="formData.nama_bank"
                value="Bank Islam"
              />

                <FormKit
                  v-if="formData.nama_bank"
                  type="text"
                  name="swift_code"
                  label="SWIFT Code"
                  v-model="formData.swift_code"
                  :value="selectedBankSwiftCode"
                  readonly
                  help="SWIFT Code untuk bank yang dipilih"
                />
              

              <FormKit
                type="text"
                name="nama_pemegang_akaun"
                label="Nama Pemegang Akaun Bank"
                validation="required"
                v-model="formData.nama_pemegang_akaun"
                value="Ahmad bin Ali"
              />

              <FormKit
                type="select"
                name="kaedah_pembayaran"
                label="Kaedah Pembayaran"
                validation="required"
                :options="paymentMethodOptions"
                v-model="formData.kaedah_pembayaran"
                :validation-messages="{
                  required: 'Kaedah pembayaran adalah wajib'
                }"
                value="akaun"
              />

              <!-- Conditional checkboxes when Tiada is selected -->
              <div v-if="formData.kaedah_pembayaran === 'tiada'" class="md:col-span-2">
                <FormKit
                  type="checkbox"
                  name="noPaymentReason"
                  label="Nyatakan sebab"
                  :options="noPaymentReasonOptions"
                  v-model="formData.noPaymentReason"
                  validation="required|min:1"
                  :validation-messages="{
                    required: 'Sila pilih sekurang-kurangnya satu sebab',
                    min: 'Sila pilih sekurang-kurangnya satu sebab'
                  }"
                />
              </div>
            </div>

            <!-- Multiple Bank Account Numbers -->
            <div class="mt-4">
              <h5 class="font-medium mb-3">No Akaun Bank</h5>
              
              <div v-for="(accountNumber, index) in formData.bankAccountNumbers" :key="index" class="mb-3">
                <div class="flex gap-2 items-end">
                  <div class="flex-1">
                    <FormKit
                      type="text"
                      :name="`no_akaun_bank_${index}`"
                      :label="`No Akaun Bank ${index + 1}`"
                      validation="required"
                      v-model="accountNumber.number"
                      :validation-messages="{
                        required: 'No akaun bank adalah wajib'
                      }"
                    />
                  </div>
                  <button
                    v-if="formData.bankAccountNumbers.length > 1"
                    type="button"
                    @click="removeBankAccountNumber(index)"
                    class="text-red-500 hover:text-red-700 mb-2"
                  >
                    <Icon name="mdi:delete" size="1.25rem" />
                  </button>
                </div>
              </div>

              <!-- Add Bank Account Number Button -->
              <div class="flex justify-center mt-4">
                <rs-button
                  variant="secondary"
                  @click="addBankAccountNumber"
                  type="button"
                >
                  <Icon name="mdi:plus" class="mr-1" size="1rem" />
                  Tambah No Akaun Bank
                </rs-button>
              </div>
            </div>
          </div>

          <!-- Death Information Section -->
          <div class="mb-6">
            <h4 class="text-md font-medium mb-3">Maklumat Kematian</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit
                type="select"
                name="jenis_id_kematian"
                label="Jenis ID"
                :options="['Kad Pengenalan', 'Foreign ID', 'Sijil Lahir']"
                v-model="formData.jenis_id_kematian"
                value="Kad Pengenalan"
              />

              <FormKit
                type="text"
                name="no_id_kematian"
                label="No ID"
                v-model="formData.no_id_kematian"
                value=""
              />

              <FormKit
                type="text"
                name="nama_kematian"
                label="Nama"
                v-model="formData.nama_kematian"
                value=""
              />
            </div>
          </div>

          <div class="flex justify-between gap-3 mt-6">
            <rs-button type="button" variant="secondary" @click="handleSaveStepA1"
              >Simpan</rs-button
            >
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
          <h3 class="text-lg font-semibold mb-4">II. Maklumat Kesihatan</h3>

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

            <FormKit
              type="file"
              name="dokumen_sakit_kronik"
              label="d. Upload Dokumen Sakit Kronik"
              accept=".pdf,.jpg,.jpeg,.png"
              help="Format yang dibenarkan: PDF, JPG, PNG. Saiz maksimum: 5MB"
              validation="required|max:5|mime:application/pdf,image/jpeg,image/png"
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

            <FormKit
              type="file"
              name="dokumen_oku"
              label="e. Upload Dokumen OKU"
              accept=".pdf,.jpg,.jpeg,.png"
              help="Format yang dibenarkan: PDF, JPG, PNG. Saiz maksimum: 5MB"
              validation="required|max:5|mime:application/pdf,image/jpeg,image/png"
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

            <FormKit
              type="file"
              name="dokumen_uzur"
              label="d. Upload Dokumen Uzur"
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
            <div class="flex gap-3">
              <rs-button type="button" variant="secondary" @click="handleSaveStepA2"
                >Simpan</rs-button
              >
              <rs-button type="submit" variant="primary" @click="nextStepA"
                >Seterusnya ke Maklumat Kemahiran</rs-button
              >
            </div>
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
          <h3 class="text-lg font-semibold mb-4">III. Kemahiran</h3>

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
            <div class="flex gap-3">
              <rs-button type="button" variant="secondary" @click="handleSaveStepA3"
                >Simpan</rs-button
              >
              <rs-button type="submit" variant="primary" @click="nextStepA"
                >Seterusnya ke Maklumat Kediaman</rs-button
              >
            </div>
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
            IV. Maklumat Kediaman/Tempat Tinggal
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
                  v-model="formData.addressInfo.alamat1"
                  :validation-messages="{
                    required: 'Alamat 1 adalah wajib',
                  }"
                  value="Jalan Bukit Bintang 1, Taman Bukit Bintang, 57000 Kuala Lumpur"
                />

                <FormKit
                  type="textarea"
                  name="alamat2"
                  label="Alamat 2"
                  v-model="formData.addressInfo.alamat2"
                  value="Jalan Bukit Bintang 2, Taman Bukit Bintang, 57000 Kuala Lumpur"
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
                value="12345"
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
                value="1"
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
                value="Ada"
              />
            </div>

              <FormKit
                type="select"
                name="bekalan_elektrik"
                label="Bekalan Elektrik"
                :options="['Ada', 'Tiada']"
                validation="required"
                value="Ada"
              />

            <div>
              <FormKit
                type="select"
                name="penyelenggaraan"
                label="Bil Penyelenggaraan"
                :options="['Ada', 'Tiada']"
                validation="required"
                value="Ada"
              />
              <FormKit
                type="number"
                name="bil_penyelenggaraan"
                label="Anggaran Bil Sebulan (RM)"
                step="0.01"
                min="0"
                value="20"
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
              <rs-button type="button" variant="secondary" @click="handleSaveStepA4"
                >Simpan</rs-button
              >
              <rs-button type="submit" variant="primary" @click="nextStepA"
                >Seterusnya ke Maklumat Pinjaman</rs-button
              >
            </div>
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
          <h3 class="text-lg font-semibold mb-4">V. Maklumat Pinjaman Harta</h3>

          <FormKit
            type="text"
            name="pemberi_pinjaman"
            label="Nama Institusi/Individu Pemberi Pinjaman"
            v-model="pemberiPinjaman"
            value="Bank Rakyat"
          />

          <FormKit
            type="text"
            name="jenis_pinjaman"
            label="Jenis Pinjaman"
            v-model="jenisPinjaman"
            value="Perumahan"
          />

          <FormKit
            type="number"
            name="bayaran_bulanan"
            label="Amaun Bayaran Bulanan (RM)"
            step="0.01"
            min="0"
            v-model="bayaranBulanan"
            value="500"
          />

          <FormKit
            type="number"
            name="jumlah_perbelanjaan"
            label="Jumlah Keseluruhan Perbelanjaan (RM)"
            step="0.01"
            min="0"
            v-model="jumlahPerbelanjaan"
            value="6000"
          />

          <FormKit
            type="date"
            name="tahun_mula_pinjaman"
            label="Tahun Mula Pinjaman"
            v-model="tahunMulaPinjaman"
            value="2018-01-01"
          />

          <FormKit
            type="date"
            name="tahun_akhir_pinjaman"
            label="Tahun Akhir Pinjaman"
            v-model="tahunAkhirPinjaman"
            value="2028-01-01"
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
              <rs-button type="button" variant="secondary" @click="handleSaveStepA5"
                >Simpan</rs-button
              >
              <rs-button type="submit" variant="primary" @click="nextStepA"
                >Seterusnya ke Maklumat Pemilikan</rs-button
              >
            </div>
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
          <h3 class="text-lg font-semibold mb-4">VI. Maklumat Pemilikan</h3>

          <h4 class="font-medium mb-2">Aset Cair</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormKit
              type="number"
              name="wang_simpanan"
              label="Jumlah wang simpanan (RM)"
              help="*sertakan penyata bank"
              step="0.01"
              min="0"
              value="2000"
            />

            <FormKit
              type="number"
              name="emas"
              label="Emas (gram)"
              step="0.01"
              min="0"
              value="10"
            />

            <FormKit
              type="number"
              name="saham"
              label="Saham (RM)"
              step="0.01"
              min="0"
              value="5000"
            />
          </div>

          <h4 class="font-medium mb-2 mt-4">Aset Tidak Cair</h4>
          <FormKit
            type="text"
            name="kenderaan"
            label="Kenderaan (Nyatakan Unit)"
            help="Contoh: Basikal 1, Kereta 1"
            value="Kereta 1"
          />

          <FormKit
            type="number"
            name="rumah_kedai"
            label="Rumah Kedai (unit)"
            min="0"
            value="0"
          />

          <FormKit
            type="number"
            name="tanah_sawah"
            label="Tanah/Sawah (ekar)"
            step="0.01"
            min="0"
            value="1"
          />

          <div class="flex justify-between gap-3 mt-6">
            <rs-button
              type="button"
              variant="primary-outline"
              @click="prevStepA"
              >Kembali</rs-button
            >
            <div class="flex gap-3">
              <rs-button type="button" variant="secondary" @click="handleSaveStepA6"
                >Simpan</rs-button
              >
              <rs-button type="submit" variant="primary" @click="nextStepA"
                >Seterusnya ke Maklumat Waris</rs-button
              >
            </div>
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
            VII. Maklumat Waris
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
              <rs-button type="button" variant="secondary" @click="handleSaveStepA7"
                >Simpan</rs-button
              >
              <rs-button type="submit" variant="primary" @click="nextStepA"
                >Seterusnya ke Pengesahan</rs-button
              >
            </div>
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
            VIII. Pengesahan
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
                value="Ya"
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
            <h4 class="font-medium mb-3">Hubungan dengan PAK</h4>
            <div class="flex flex-col gap-2">
              <label class="font-medium">Adakah anda mempunyai hubungan dengan Penolong Amil Kariah (PAK)?</label>
              <FormKit
                type="radio"
                name="hubungan_pak"
                :options="['Ya', 'Tidak']"
                validation="required"
                v-model="hubunganPAK"
                value="Tidak"
              />
            </div>

            <div v-if="hubunganPAK === 'Ya'" class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <FormKit
                type="select"
                name="kariah_hubungan_pak"
                label="Kariah"
                :options="kariahOptions"
                placeholder="Pilih kariah"
                validation="required"
                v-model="formData.pengesahan.kariah_hubungan_pak"
              />
              <FormKit
                type="select"
                name="nama_pak_hubungan"
                label="Nama PAK"
                :options="pakOfficersOptionsHubungan"
                placeholder="Pilih nama PAK"
                validation="required"
                v-model="formData.pengesahan.nama_pak_hubungan"
              />

              <FormKit
                type="text"
                name="jenis_hubungan_pak"
                label="Jenis Hubungan"
                placeholder="Contoh: Keluarga, Jiran, dll"
                validation="required"
                v-model="formData.pengesahan.jenis_hubungan_pak"
              />

              <FormKit
                type="date"
                name="tarikh_hubungan_pak"
                label="Tarikh Pengesahan"
                validation="required"
                v-model="formData.pengesahan.tarikh_hubungan_pak"
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
              @click="prevStepA"
              >Kembali</rs-button
            >
            <div class="flex gap-3">
              <rs-button type="button" variant="secondary" @click="handleSaveStepA8"
                >Simpan</rs-button
              >
              <rs-button type="submit" variant="primary" @click="nextStepA"
                >Seterusnya ke Pengesahan Bermastautin</rs-button
              >
            </div>
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
            IX. Pengesahan Bermastautin
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
              @click="prevStepA"
              >Kembali</rs-button
            >
            <div class="flex gap-3">
              <rs-button type="button" variant="secondary" @click="handleSaveStepA9"
                >Simpan</rs-button
              >
              <rs-button type="submit" variant="primary" @click="nextStepA"
                >Seterusnya ke Maklumat Pegawai Pendaftar</rs-button
              >
            </div>
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
            X. Maklumat Pegawai Pendaftar
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
              value="Review"
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
            <div class="flex gap-3">
              <rs-button type="button" variant="secondary" @click="handleSaveStepA10"
                >Simpan</rs-button
              >
              <rs-button type="submit" variant="primary" @click="nextStepA"
                >Seterusnya ke Maklumat Peribadi Tanggungan</rs-button
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
              @click="navigateToStepB(step.id)"
            >
              {{ step.label }}
            </div>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2.5 relative">
            <div
              class="bg-primary h-2.5 rounded-full transition-all duration-300"
              :style="`width: ${(currentStepB / totalStepsB) * 100}%`"
            ></div>
            <!-- Clickable progress bar -->
            <div 
              class="absolute inset-0 cursor-pointer"
              @click="handleProgressBarClickB"
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

          <h3 class="text-lg font-semibold mb-4">B. Maklumat Peribadi Tanggungan</h3>

          <!-- I. Maklumat Peibadi Tanggungan -->
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
                value="Ali bin Ahmad"
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
                  :label="`Upload ${jenisIdTanggungan}`"
                  accept=".pdf,.jpg,.jpeg,.png"
                  help="Format yang dibenarkan: PDF, JPG, PNG. Saiz maksimum: 5MB"
                  validation="required|max:5|mime:application/pdf,image/jpeg,image/png"
                />

              <FormKit
                type="text"
                name="no_id_tanggungan"
                label="No ID"
                value="010101011111"
              />

              <FormKit
                type="text"
                name="nopassport"
                label="No Passport"
                value="B12345678"
              />

              <FormKit
                type="date"
                name="passportStartDate"
                label="Tarikh mula passport"
                value="2023-01-01"
              />

              <FormKit
                type="date"
                name="passportEndDate"
                label="Tarikh tamat passport"
                value="2028-01-01"
              />

              <FormKit
                type="select"
                name="jantina_tanggungan"
                label="Jantina"
                :options="['Lelaki', 'Perempuan']"
                validation="required"
                value="Lelaki"
              />

              <FormKit
                type="date"
                name="tarikh_lahir_tanggungan"
                label="Tarikh Lahir"
                validation="required"
                value="2010-01-01"
              />

              <FormKit
                type="text"
                name="tempat_lahir_tanggungan"
                label="Tempat Lahir"
                validation="required"
                value="Kuala Lumpur"
              />

              <FormKit
                type="select"
                name="bangsa_tanggungan"
                label="Bangsa"
                :options="['Melayu', 'Cina', 'India', 'Lain-lain Nyatakan']"
                validation="required"
                value="Melayu"
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
                value="Bujang"
              />



              <FormKit
                type="select"
                name="warganegara_tanggungan"
                label="Warganegara"
                :options="['Warganegara', 'Bukan Warganegara']"
                validation="required"
                value="Warganegara"
              />

              <FormKit
                type="number"
                name="tempoh_menetap_selangor"
                label="Tempoh Menetap Di Selangor (Tahun)"
                min="0"
                value="10"
              />

              <FormKit
                type="text"
                name="no_telefon_tanggungan"
                label="No Telefon"
                value="0191234567"
              />
            </div>
          </div>

          <!-- B. Maklumat Islam -->
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
                value="2020-02-01"
              />
            </div>
          </div>

          <!-- Maklumat Bank -->
          <div class="mb-6">
            <h4 class="text-md font-medium mb-3">Maklumat Bank</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit
                type="select"
                name="nama_bank_tanggungan"
                label="Nama Bank"
                placeholder="Pilih nama bank"
                :options="bankOptions"
                validation="required"
                v-model="formData.nama_bank_tanggungan"
              />

              <FormKit
                v-if="formData.nama_bank_tanggungan"
                type="text"
                name="swift_code_tanggungan"
                label="SWIFT Code"
                v-model="formData.swift_code_tanggungan"
                :value="selectedBankSwiftCodeTanggungan"
                readonly
                help="SWIFT Code untuk bank yang dipilih"
              />

              <FormKit
                type="text"
                name="nama_pemegang_akaun_tanggungan"
                label="Nama Pemegang Akaun Bank"
                validation="required"
                v-model="formData.nama_pemegang_akaun_tanggungan"
              />

              <FormKit
                type="select"
                name="kaedah_pembayaran_tanggungan"
                label="Kaedah Pembayaran"
                validation="required"
                :options="paymentMethodOptions"
                placeholder="Pilih kaedah pembayaran"
                v-model="formData.kaedah_pembayaran_tanggungan"
                :validation-messages="{
                  required: 'Kaedah pembayaran adalah wajib'
                }"
              />

              <!-- Conditional checkboxes when Tiada is selected -->
              <div v-if="formData.kaedah_pembayaran_tanggungan === 'tiada'" class="md:col-span-2">
                <FormKit
                  type="checkbox"
                  name="noPaymentReasonTanggungan"
                  label="Nyatakan sebab"
                  :options="noPaymentReasonOptions"
                  v-model="formData.noPaymentReasonTanggungan"
                  validation="required|min:1"
                  :validation-messages="{
                    required: 'Sila pilih sekurang-kurangnya satu sebab',
                    min: 'Sila pilih sekurang-kurangnya satu sebab'
                  }"
                />
              </div>
            </div>

            <!-- Multiple Bank Account Numbers for Tanggungan -->
            <div class="mt-4">
              <h5 class="font-medium mb-3">No Akaun Bank</h5>
              
              <div v-for="(accountNumber, index) in formData.bankAccountNumbersTanggungan" :key="index" class="mb-3">
                <div class="flex gap-2 items-end">
                  <div class="flex-1">
                    <FormKit
                      type="text"
                      :name="`no_akaun_bank_tanggungan_${index}`"
                      :label="`No Akaun Bank ${index + 1}`"
                      validation="required"
                      v-model="accountNumber.number"
                      :validation-messages="{
                        required: 'No akaun bank adalah wajib'
                      }"
                    />
                  </div>
                  <button
                    v-if="formData.bankAccountNumbersTanggungan.length > 1"
                    type="button"
                    @click="removeBankAccountNumberTanggungan(index)"
                    class="text-red-500 hover:text-red-700 mb-2"
                  >
                    <Icon name="mdi:delete" size="1.25rem" />
                  </button>
                </div>
              </div>

              <!-- Add Bank Account Number Button for Tanggungan -->
              <div class="flex justify-center mt-4">
                <rs-button
                  variant="secondary"
                  @click="addBankAccountNumberTanggungan"
                  type="button"
                >
                  <Icon name="mdi:plus" class="mr-1" size="1rem" />
                  Tambah No Akaun Bank
                </rs-button>
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
              <rs-button type="button" variant="secondary" @click="handleSaveStepB1"
                >Simpan</rs-button
              >
              <rs-button type="submit" variant="primary" @click="nextStepB"
                >Seterusnya ke Maklumat Pendidikan Tanggungan</rs-button
              >
            </div>
          </div>
        </FormKit>

        <FormKit
          v-if="currentStepB === 2"
          type="form"
          @submit="nextStepB"
          :actions="false"
        >
          <!-- II. Maklumat Pendidikan Tanggungan -->
          <div class="mb-6">
            <h4 class="font-medium mb-3">II. Maklumat Pendidikan Tanggungan</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit
                type="select"
                name="bersekolah_tanggungan"
                label="Bersekolah"
                :options="['Ya', 'Tidak']"
                value="Ya"
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
                value="SPM"
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
                value="Sekolah Menengah Kebangsaan"
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
                    value="SMK Bukit Bintang"
                  />

                  <FormKit type="text" name="alamat_sekolah" label="Alamat" value="Jalan BB 1" />

                  <FormKit type="text" name="daerah_sekolah" :options="daerahOptions" label="Daerah" value="gombak" />

                  <FormKit type="text" name="negeri_sekolah" :options="negeriOptions" label="Negeri" value="Selangor" />

                  <FormKit type="text" name="poskod_sekolah" label="Poskod" value="57000" />
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
                    value="SRA Bukit Bintang"
                  />

                  <FormKit
                    type="text"
                    name="alamat_sekolah_agama"
                    label="Alamat"
                    value="Jalan BB 2"
                  />

                  <FormKit
                    type="text"
                    name="daerah_sekolah_agama"
                    label="Daerah"
                    value="gombak"
                  />

                  <FormKit
                    type="text"
                    name="negeri_sekolah_agama"
                    label="Negeri"
                    value="Selangor"
                  />

                  <FormKit
                    type="text"
                    name="poskod_sekolah_agama"
                    label="Poskod"
                    value="57000"
                  />
                </div>
              </div>

              <FormKit
                type="select"
                name="tinggal_bersama_keluarga"
                label="Tinggal Bersama Keluarga"
                :options="['Ya', 'Tidak', 'Asrama']"
                value="Ya"
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
            <div class="flex gap-3">
              <rs-button type="button" variant="secondary" @click="handleSaveStepB2"
                >Simpan</rs-button
              >
              <rs-button type="submit" variant="primary" @click="nextStepB"
                >Seterusnya ke Maklumat Kesihatan Tanggungan</rs-button
              >
            </div>
          </div>
        </FormKit>

        <FormKit
          v-if="currentStepB === 3"
          type="form"
          @submit="nextStepB"
          :actions="false"
        >
          <!-- III. Maklumat Kesihatan Tanggungan -->
          <div class="mb-6">
            <h4 class="font-medium mb-3">III. Maklumat Kesihatan Tanggungan</h4>
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

                  <FormKit
                    type="file"
                    name="dokumen_uzur_tanggungan"
                    label="d. Upload Dokumen Uzur"
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
            <div class="flex gap-3">
              <rs-button type="button" variant="secondary" @click="handleSaveStepB3"
                >Simpan</rs-button
              >
              <rs-button type="submit" variant="primary" @click="nextStepB"
                >Seterusnya ke Maklumat Kemahiran Tanggungan</rs-button
              >
            </div>
          </div>
        </FormKit>

        <FormKit
          v-if="currentStepB === 4"
          type="form"
          @submit="nextStepB"
          :actions="false"
        >
          <!-- IV. Maklumat Kemahiran Tanggungan -->
          <div class="mb-6">
            <h4 class="font-medium mb-3">IV. Maklumat Kemahiran Tanggungan</h4>
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
              value="Pertanian"
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
              <rs-button type="button" variant="secondary" @click="handleSaveStepB4"
                >Simpan</rs-button
              >
              <rs-button type="submit" variant="primary" @click="nextStepB"
                >Seterusnya ke Maklumat Pekerjaan Tanggungan</rs-button
              >
            </div>
          </div>
        </FormKit>

        <FormKit
          v-if="currentStepB === 5"
          type="form"
          @submit="nextStepB"
          :actions="false"
        >
          <!-- V. Maklumat Pekerjaan Tanggungan -->
          <div class="mb-6">
            <h4 class="font-medium mb-3">V. Maklumat Pekerjaan Tanggungan</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit
                type="select"
                name="pekerjaan_status"
                label="Pekerjaan"
                :options="[
                  'Bekerja Nyatakan Jawatan',
                  'Tidak Bekerja Nyatakan',
                ]"
                value="Bekerja Nyatakan Jawatan"
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
                value="Swasta"
              />

              <FormKit
                type="text"
                name="nama_majikan"
                label="Nama Majikan"
                value="ABC Sdn Bhd"
              />

              <FormKit
                type="text"
                name="no_tel_majikan"
                label="No Tel Majikan"
                value="034567890"
              />

              <FormKit
                type="text"
                name="alamat_majikan"
                label="Alamat Majikan"
                value="Jalan Raja"
              />

              <FormKit type="text" name="bandar_majikan" label="Bandar" value="Kuala Lumpur" />

              <FormKit type="text" name="poskod_majikan" label="Poskod" value="50000" />

              <FormKit type="text" name="daerah_majikan" label="Daerah" value="gombak" />

              <FormKit type="text" name="negeri_majikan" label="Negeri" value="Selangor" />

              <FormKit type="text" name="jawatan" label="Jawatan" value="Eksekutif" />

              <FormKit type="text" name="negara_pekerjaan" label="Negara" value="Malaysia" />

              <FormKit
                type="select"
                name="status_jawatan"
                label="Status Jawatan"
                :options="['Tetap', 'Kontrak', 'Sementara']"
                value="Tetap"
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
              <rs-button type="button" variant="secondary" @click="handleSaveStepB5"
                >Simpan</rs-button
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
            C. Penilaian Awal
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
                value="Y"
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
                value="['perubatan']"
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
    name: "Self Service Kemaskini",
    type: "current",
    path: "/BF-PRF/AS/UP-S/02",
  },
]);

// ============================================================================
// SECTION & STEP MANAGEMENT
// ============================================================================
const processing = ref(false);
const currentSection = ref(1);

// Section A - Main Form Steps
const currentStepA = ref(1);
const totalStepsA = 10;
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
  { id: 10, label: "Pegawai Pendaftar" }
];

// Section B - Tanggungan Form Steps
const currentStepB = ref(1);
const totalStepsB = 6;
const stepsB = [
  { id: 1, label: "Peribadi" },
  { id: 2, label: "Pendidikan Tanggungan" },
  { id: 3, label: "Kesihatan Tanggungan" },
  { id: 4, label: "Kemahiran Tanggungan" },
  { id: 5, label: "Pekerjaan Tanggungan" },
  { id: 6, label: "Penilaian" }
];

// ============================================================================
// FORM STATE VARIABLES
// ============================================================================
// Health Status Variables
const healthStatus = ref("Sihat");
const healthStatusTanggungan = ref("Sihat");

// Relationship Variables
const dibantuPenolongAmil = ref("Ya");
const hubunganKakitanganLZS = ref("Tidak");
const hubunganPAK = ref("Tidak");
const hubunganPemohon = ref("Anak");

// ID Type Variables
const jenisId = ref("Kad Pengenalan");
const jenisIdTanggungan = ref("Kad Pengenalan");

// Islamic Information Variables
const tarikhMasukIslam = ref("2020-01-01");
const tarikhMasukIslamTanggungan = ref("2020-01-01");

// Polygamy Variables
const statusPoligami = ref("tidak");
const bilanganIsteri = ref(null);
const isteriList = ref([]);

// Payment Variables
const caraPembayaran = ref(null);
const paymentMethod = ref("");

// Residence Variables
const statusKediaman = ref("Milik Sendiri Tidak Berbayar");

// Loan Variables
const pemberiPinjaman = ref('Bank Rakyat');
const jenisPinjaman = ref('Perumahan');
const bayaranBulanan = ref(500);
const jumlahPerbelanjaan = ref(6000);
const tahunMulaPinjaman = ref('2018-01-01');
const tahunAkhirPinjaman = ref('2028-01-01');

// Modal Variables
const showKursusModal = ref(false);
const selectedKursus = ref(null);
const selectedGuru = ref(null);

// ============================================================================
// FORM DATA STRUCTURE
// ============================================================================
const formData = ref({
  // Section A - Maklumat Peribadi Asnaf
  jenis_id: 'Kad Pengenalan',
  no_pengenalan: '900101011234',
  warganegara: 'Warganegara',
  jantina: 'Lelaki',
  bangsa: 'Melayu',
  bersekolah: 'Ya',
  pendidikan_tertinggi: 'SPM',
  tarikh_masuk_islam: '2020-01-01',
  tarikh_masuk_kfam: '2020-02-01',
  status_perkahwinan: 'Berkahwin',
  status_poligami: 'tidak',
  bilangan_isteri: null,
  // Bank Information
  nama_bank: 'bank-islam',
  nama_pemegang_akaun: 'Ahmad bin Ali',
  swift_code: 'BIMBMYKL',
  bankAccountNumbers: [
    { number: '1234567890' }
  ],
  kaedah_pembayaran: 'akaun',
  noPaymentReason: ['muflis'],
  sebab_tunai: '',
  // Death Information
  jenis_id_kematian: 'Kad Pengenalan',
  no_id_kematian: '',
  nama_kematian: '',
  // Section B - Maklumat Kesihatan
  tahap_kesihatan: 'Sihat',
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
  kemahiran: 'Pertanian',
  // Section D - Maklumat Kediaman
  addressInfo: {
    alamat1: 'Jalan Bukit Bintang 1, Taman Bukit Bintang, 57000 Kuala Lumpur',
    alamat2: 'Jalan Bukit Bintang 2, Taman Bukit Bintang, 57000 Kuala Lumpur',
    alamat3: 'Apartment 3A',
    location: 'Kuala Lumpur',
    daerah: 'gombak',
    kursus_terpilih: 'Kursus Fardu Ain Asas - Ustaz Ahmad bin Abdullah',
    selectedKursus: { id: 1, nama: 'Kursus Fardu Ain Asas' },
    selectedGuru: { id: 1, nama: 'Ustaz Ahmad bin Abdullah' },
    status_kediaman: 'Milik Sendiri Tidak Berbayar',
    tapak_rumah: 'Milik Sendiri',
    jenis_rumah: 'Kos Rendah',
    binaan_rumah: 'Batu',
    keadaan_kediaman: 'Baik/Sempurna',
    bekalan_air: 'Ada',
    bil_air: 30,
    bekalan_elektrik: 'Ada',
    bil_elektrik: 50,
    penyelenggaraan: 'Ada',
    bil_penyelenggaraan: 20,
  },
  // Section E - Maklumat Pinjaman
  pemberi_pinjaman: 'Bank Rakyat',
  jenis_pinjaman: 'Perumahan',
  bayaran_bulanan: 500,
  jumlah_perbelanjaan: 6000,
  tahun_mula_pinjaman: '2018-01-01',
  tahun_akhir_pinjaman: '2028-01-01',
  // Section F - Maklumat Pemilikan
  wang_simpanan: 2000,
  emas: 10,
  saham: 5000,
  kenderaan: 'Kereta 1',
  rumah_kedai: 0,
  tanah_sawah: 1,
  // Section G - Pengesahan
  pengesahan: {
    dibantu_penolong_amil: 'Ya',
    kariah_bantuan: 'masjid-al-hidayah',
    nama_penolong_amil_bantuan: 'ustaz-ahmad-abdullah',
    tarikh_bantuan: '2024-01-01',
    hubungan_pak: 'Tidak',
    kariah_hubungan_pak: '',
    nama_pak_hubungan: '',
    jenis_hubungan_pak: '',
    tarikh_hubungan_pak: '',
    pdpa_consent: true,
    hubungan_kakitangan_lzs: 'Tidak',
    nama_kakitangan: '',
    jawatan_kakitangan: '',
    pejabat_kakitangan: '',
    hubungan_kakitangan: '',
    tarikh_perakuan: '',
    kariah_bermastautin: 'masjid-al-hidayah',
    nama_pak_bermastautin: 'ustaz-ahmad-abdullah',
    nama_pengesah: 'Ustaz Ahmad bin Abdullah',
    jawatan_pengesah: 'Pegawai PAK',
    no_telefon_pengesah: '012-3456789',
    tarikh_pengesahan_permastautin: '2024-01-15',
    surat_pengesahan_bermastautin: 'mockfile.pdf',
  },
  ulasan_pengesahan: 'Semua maklumat telah disahkan.',
  surat_pengesahan_bermastautin: 'mockfile.pdf',
  nama_penolong_amil: 'Ahmad bin Abi',
  jenis_permohonan: 'Review',
  tarikh_proses: '2024-05-01',
  komitmen_tinggi: 'Y',
  keperluan_mendesak: ['perubatan'],
  lain_keperluan: '',
  dokumen_sokongan: ['mockdoc.pdf'],
  // Section B (Tanggungan)
  hubungan_pemohon: 'Anak',
  nama_tanggungan: 'Ali bin Ahmad',
  jenis_id_tanggungan: 'Kad Pengenalan',
  no_pengenalan_tanggungan: '010101011111',
  jantina_tanggungan: 'Lelaki',
  tarikh_lahir_tanggungan: '2010-01-01',
  tempat_lahir_tanggungan: 'Kuala Lumpur',
  bangsa_tanggungan: 'Melayu',
  status_perkahwinan_tanggungan: 'Bujang',
  tarikh_masuk_islam_tanggungan: '2020-01-01',
  tarikh_masuk_kfam_tanggungan: '2020-02-01',
  warganegara_tanggungan: 'Warganegara',
  tempoh_menetap_selangor: 10,
  no_telefon_tanggungan: '0191234567',
  nama_bank_tanggungan: 'maybank',
  swift_code_tanggungan: 'MBBEMYKL',
  bankAccountNumbersTanggungan: [
    { number: '9876543210' }
  ],
  nama_pemegang_akaun_tanggungan: 'Ali bin Ahmad',
  kaedah_pembayaran_tanggungan: 'akaun',
  noPaymentReasonTanggungan: [],
  bersekolah_tanggungan: 'Ya',
  pendidikan_tertinggi_tanggungan: 'SPM',
  jenis_sekolah: 'Sekolah Menengah Kebangsaan',
  nama_sekolah: 'SMK Bukit Bintang',
  alamat_sekolah: 'Jalan BB 1',
  daerah_sekolah: 'gombak',
  negeri_sekolah: 'Selangor',
  poskod_sekolah: '57000',
  nama_sekolah_agama: 'SRA Bukit Bintang',
  alamat_sekolah_agama: 'Jalan BB 2',
  daerah_sekolah_agama: 'gombak',
  negeri_sekolah_agama: 'Selangor',
  poskod_sekolah_agama: '57000',
  tinggal_bersama_keluarga: 'Ya',
  tahap_kesihatan_tanggungan: 'Sihat',
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
  kemahiran_tanggungan: 'Pertanian',
  pekerjaan_status: 'Bekerja Nyatakan Jawatan',
  sektor_pekerjaan: 'Swasta',
  nama_majikan: 'ABC Sdn Bhd',
  no_tel_majikan: '034567890',
  alamat_majikan: 'Jalan Raja',
  bandar_majikan: 'Kuala Lumpur',
  poskod_majikan: '50000',
  daerah_majikan: 'gombak',
  negeri_majikan: 'Selangor',
  jawatan: 'Eksekutif',
  negara_pekerjaan: 'Malaysia',
  status_jawatan: 'Tetap',
  heirs: [
    { name: 'Fatimah binti Ahmad', relationship: 'Ibu', phone: '0123456789' }
  ]
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
  { label: 'Bukan Warganegara', value: 'bukan-warganegara' }
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

// State Options
const negeriOptions = [
  { label: "Selangor", value: "Selangor" },
  { label: "Kuala Lumpur", value: "Kuala Lumpur" },
  { label: "Putrajaya", value: "Putrajaya" },
  { label: "Negeri Sembilan", value: "Negeri Sembilan" },
  { label: "Perak", value: "Perak" },
  { label: "Pahang", value: "Pahang" },
  { label: "Melaka", value: "Melaka" },
  { label: "Johor", value: "Johor" },
  { label: "Kedah", value: "Kedah" },
  { label: "Kelantan", value: "Kelantan" },
  { label: "Perlis", value: "Perlis" },
  { label: "Pulau Pinang", value: "Pulau Pinang" },
  { label: "Terengganu", value: "Terengganu" },
  { label: "Sabah", value: "Sabah" },
  { label: "Sarawak", value: "Sarawak" }
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

// ============================================================================
// STEP NAVIGATION FUNCTIONS
// ============================================================================
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

const goToPeribadi = () => {
  currentStepB.value = 1;
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
    router.push("/BF-PRF/AS/UP/04");
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
    toast.success("Maklumat Peribadi berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
    console.error("Save Step A1 error:", error);
  }
};

const handleSaveStepA2 = async () => {
  try {
    console.log("Step A2 saved:", formData.value);
    toast.success("Maklumat Kesihatan berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
    console.error("Save Step A2 error:", error);
  }
};

const handleSaveStepA3 = async () => {
  try {
    console.log("Step A3 saved:", formData.value);
    toast.success("Maklumat Kemahiran berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
    console.error("Save Step A3 error:", error);
  }
};

const handleSaveStepA4 = async () => {
  try {
    console.log("Step A4 saved:", formData.value);
    toast.success("Maklumat Kediaman berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
    console.error("Save Step A4 error:", error);
  }
};

const handleSaveStepA5 = async () => {
  try {
    console.log("Step A5 saved:", formData.value);
    toast.success("Maklumat Pinjaman berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
    console.error("Save Step A5 error:", error);
  }
};

const handleSaveStepA6 = async () => {
  try {
    console.log("Step A6 saved:", formData.value);
    toast.success("Maklumat Pemilikan berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
    console.error("Save Step A6 error:", error);
  }
};

const handleSaveStepA7 = async () => {
  try {
    console.log("Step A7 saved:", formData.value);
    toast.success("Maklumat Waris berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
    console.error("Save Step A7 error:", error);
  }
};

const handleSaveStepA8 = async () => {
  try {
    console.log("Step A8 saved:", formData.value);
    toast.success("Maklumat Pengesahan berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
    console.error("Save Step A8 error:", error);
  }
};

const handleSaveStepA9 = async () => {
  try {
    console.log("Step A9 saved:", formData.value);
    toast.success("Maklumat Pengesahan Bermastautin berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
    console.error("Save Step A9 error:", error);
  }
};

const handleSaveStepA10 = async () => {
  try {
    console.log("Step A10 saved:", formData.value);
    toast.success("Maklumat Pegawai Pendaftar berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
    console.error("Save Step A10 error:", error);
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
    toast.success("Maklumat Pendidikan Tanggungan berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
    console.error("Save Step B2 error:", error);
  }
};

const handleSaveStepB3 = async () => {
  try {
    console.log("Step B3 saved:", formData.value);
    toast.success("Maklumat Kesihatan Tanggungan berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
    console.error("Save Step B3 error:", error);
  }
};

const handleSaveStepB4 = async () => {
  try {
    console.log("Step B4 saved:", formData.value);
    toast.success("Maklumat Kemahiran Tanggungan berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
    console.error("Save Step B4 error:", error);
  }
};

const handleSaveStepB5 = async () => {
  try {
    console.log("Step B5 saved:", formData.value);
    toast.success("Maklumat Pekerjaan Tanggungan berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
    console.error("Save Step B5 error:", error);
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
// BANK ACCOUNT NUMBER MANAGEMENT FUNCTIONS
// ============================================================================
const addBankAccountNumber = () => {
  formData.value.bankAccountNumbers.push({
    number: ''
  });
};

const removeBankAccountNumber = (index) => {
  formData.value.bankAccountNumbers.splice(index, 1);
};

const addBankAccountNumberTanggungan = () => {
  formData.value.bankAccountNumbersTanggungan.push({
    number: ''
  });
};

const removeBankAccountNumberTanggungan = (index) => {
  formData.value.bankAccountNumbersTanggungan.splice(index, 1);
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

const navigateToStepA = (stepId) => {
  // Optional: Add validation to prevent jumping to steps that haven't been completed
  // For now, allow free navigation
  currentStepA.value = stepId;
};

const navigateToStepB = (stepId) => {
  // Optional: Add validation to prevent jumping to steps that haven't been completed
  // For now, allow free navigation
  currentStepB.value = stepId;
};

const handleProgressBarClickA = (event) => {
  const progressBar = event.currentTarget;
  const rect = progressBar.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const progressBarWidth = rect.width;
  const clickPercentage = clickX / progressBarWidth;
  const targetStep = Math.ceil(clickPercentage * totalStepsA);
  
  // Ensure the step is within valid range
  const validStep = Math.max(1, Math.min(targetStep, totalStepsA));
  currentStepA.value = validStep;
};

const handleProgressBarClickB = (event) => {
  const progressBar = event.currentTarget;
  const rect = progressBar.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const progressBarWidth = rect.width;
  const clickPercentage = clickX / progressBarWidth;
  const targetStep = Math.ceil(clickPercentage * totalStepsB);
  
  // Ensure the step is within valid range
  const validStep = Math.max(1, Math.min(targetStep, totalStepsB));
  currentStepB.value = validStep;
};
</script>

<style scoped></style>
