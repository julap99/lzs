<template>
  <div>
    <!-- Breadcrumb Navigation -->
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Main Form Card -->
    <rs-card class="mt-4">
      <!-- Form Header -->
      <template #header>
        <div class="flex justify-between items-center">
          <div class="flex items-center">
            <h2 class="text-xl font-semibold">Isi Borang Permohonan Online(Bencana)</h2>
          </div>
          <div class="flex items-center gap-3">
            <div class="text-sm text-gray-600">
              Langkah {{ currentStep }} dari {{ totalStep }}
            </div>
          </div>
        </div>
      </template>

      <!-- Form Body -->
      <template #body>
        <!-- Progress Indicator -->
        <div class="mb-6">
          <div class="flex justify-between mb-2">
            <div
              v-for="step in steps"
              :key="step.id"
              class="text-center flex-1"
              :class="{ 'font-semibold': currentStep >= step.id }"
            >
              {{ step.label }}
            </div>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2.5">
            <div
              class="bg-primary h-2.5 rounded-full transition-all duration-300"
              :style="`width: ${(currentStep / totalStep) * 100}%`"
            ></div>
          </div>
        </div>

        <!-- Form Section -->
        <div class="mb-6">
          <FormKit type="form" :actions="false" @submit="handleSubmit">
            <!-- Step 1: Maklumat Peribadi Asnaf -->
            <div v-if="currentStep === 1">
              <h3 class="text-lg font-medium mb-4">
                A) Maklumat Peribadi Asnaf
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Location Information Section - Moved to top -->
                <div class="md:col-span-2">
                  <h4 class="text-md font-medium mb-3">Maklumat Bencana</h4>
                </div>
                <div class="flex gap-2">
                  <FormKit
                    v-model="formData.personalInfo.assistanceType"
                    label="Lokasi"
                    type="text"
                    validation="required"
                    validation-visibility="dirty"
                    class="flex-1"
                  />
                  <rs-button
                    type="button"
                    variant="primary-outline"
                    @click="selectAssistanceType"
                    class="whitespace-nowrap mt-7"
                  >
                    <i class="fas fa-location-dot mr-2"></i>
                    Dapatkan Lokasi
                  </rs-button>
                </div>

                <FormKit
                  type="select"
                  name="healthStatus"
                  label="Saluran Bencana"
                  validation="required"
                  :options="[
                    { label: 'Bencana', value: 'bencana' },
                    { label: 'Tiada', value: 'tiada' }
                  ]"
                  placeholder="Pilih saluran bencana"
                  v-model="formData.healthInfo.status"
                  :validation-messages="{
                    required: 'Saluran bencana adalah wajib'
                  }"
                />

                <div v-if="formData.healthInfo.status === 'bencana'" class="md:col-span-2">
                  <FormKit
                    type="file"
                    name="disasterDocument"
                    label="Upload Dokumen Bencana"
                    accept=".pdf,.jpg,.jpeg,.png"
                    v-model="formData.healthInfo.disasterDocument"
                    help="Format yang dibenarkan: PDF, JPG, PNG. Saiz maksimum: 5MB"
                    validation="required"
                    :validation-messages="{
                      required: 'Dokumen bencana adalah wajib'
                    }"
                  />
                </div>

                <!-- Disaster Location (Conditional) -->
                <FormKit
                  v-if="formData.personalInfo.assistanceType === 'bencana'"
                  type="select"
                  name="location"
                  label="Lokasi Bencana"
                  validation="required"
                  :options="[
                    { label: 'Gombak', value: 'gombak' },
                    { label: 'Hulu Langat', value: 'hulu-langat' },
                    { label: 'Hulu Selangor', value: 'hulu-selangor' },
                    { label: 'Klang', value: 'klang' },
                    { label: 'Kuala Langat', value: 'kuala-langat' },
                    { label: 'Kuala Selangor', value: 'kuala-selangor' },
                    { label: 'Petaling', value: 'petaling' },
                    { label: 'Sabak Bernam', value: 'sabak-bernam' },
                    { label: 'Sepang', value: 'sepang' },
                    { label: 'Shah Alam', value: 'shah-alam' },
                    { label: 'Tiada di lokasi bencana', value: 'tiada-bencana' },
                  ]"
                  placeholder="Pilih lokasi bencana"
                  v-model="formData.personalInfo.disasterLocation"
                  :validation-messages="{
                    required: 'Lokasi bencana adalah wajib'
                  }"
                />

                <div class="md:col-span-2">
                  <h4 class="text-md font-medium mb-3">Maklumat Peribadi</h4>
                </div>

                <FormKit
                  type="select"
                  name="idValue"
                  label="Jenis ID"
                  placeholder="Pilih jenis ID"
                  validation="required"
                  :options="[
                    { label: 'Kad Pengenalan', value: 'ic' },
                    { label: 'Foreign ID', value: 'foreign-id' },
                    { label: 'No Polis', value: 'polis' },
                    { label: 'No Tentera', value: 'tentera' },
                    { label: 'No Sijil Lahir', value: 'sijil-lahir' }
                  ]"
                  v-model="formData.personalInfo.idValue"
                  :validation-messages="{
                    required: 'Jenis ID adalah wajib',
                  }"
                />

                <div v-if="formData.personalInfo.idValue" class="md:col-span-2">
                  <FormKit
                    type="file"
                    name="idDocument"
                    :label="getDocumentLabel()"
                    accept=".pdf,.jpg,.jpeg,.png"
                    v-model="formData.personalInfo.idDocument"
                    help="Format yang dibenarkan: PDF, JPG, PNG. Saiz maksimum: 5MB"
                    validation="required"
                    :validation-messages="{
                      required: 'Dokumen ID adalah wajib'
                    }"
                  />
                </div>

                <FormKit
                  type="text"
                  name="idNumber"
                  label="Nombor ID"
                  validation="required"
                  v-model="formData.personalInfo.idNumber"
                  :validation-messages="{
                    required: 'Nombor ID adalah wajib',
                  }"
                  :placeholder="getPlaceholder()"
                />

                <FormKit
                  type="text"
                  name="name"
                  label="Nama"
                  validation="required"
                  v-model="formData.personalInfo.name"
                  :validation-messages="{
                    required: 'Nama adalah wajib',
                  }"
                />

                <FormKit
                  type="select"
                  name="gender"
                  label="Jantina"
                  validation="required"
                  :options="[
                    { label: 'Lelaki', value: 'L' },
                    { label: 'Perempuan', value: 'P' }
                  ]"
                  placeholder="Pilih jantina"
                  v-model="formData.personalInfo.gender"
                  :validation-messages="{
                    required: 'Jantina adalah wajib'
                  }"
                />

                <FormKit
                  type="date"
                  name="dateOfBirth"
                  label="Tarikh Lahir"
                  validation="required"
                  v-model="formData.personalInfo.dateOfBirth"
                  :validation-messages="{
                    required: 'Tarikh lahir adalah wajib',
                  }"
                />

                <FormKit
                  type="select"
                  name="citizenship"
                  label="Warganegara"
                  validation="required"
                  :options="[
                    { label: 'Warganegara', value: 'warganegara' },
                    { label: 'Bukan Warganegara', value: 'bukan-warganegara' }
                  ]"
                  placeholder="Pilih status warganegara"
                  v-model="formData.personalInfo.citizenship"
                  :validation-messages="{
                    required: 'Status warganegara adalah wajib',
                  }"
                />

                <FormKit
                  type="select"
                  name="religion"
                  label="Agama"
                  validation="required"
                  :options="religionOptions"
                  placeholder="Pilih agama"
                  v-model="formData.personalInfo.religion"
                  :validation-messages="{
                    required: 'Agama adalah wajib',
                  }"
                />

                <!-- <FormKit
                  type="tel"
                  name="phone"
                  label="No Telefon"
                  validation="required"
                  v-model="formData.personalInfo.phone"
                  :validation-messages="{
                    required: 'No Telefon adalah wajib',
                  }"
                />

                <FormKit
                  type="email"
                  name="email"
                  label="Emel"
                  validation="required|email"
                  v-model="formData.personalInfo.email"
                  :validation-messages="{
                    required: 'Emel adalah wajib',
                    email: 'Sila masukkan emel yang sah'
                  }"
                /> -->

                <!-- Islamic Information Section -->
                <div class="md:col-span-2">
                  <h4 class="text-md font-medium mb-3">Maklumat Islam</h4>
                </div>

                <FormKit
                  type="text"
                  name="islamName"
                  label="Nama Selepas Islam(Mualaf)"
                  v-model="formData.personalInfo.islamName"
                  :validation-messages="{
                    required: 'Nama selepas Islam adalah wajib',
                  }"
                />
                
                <FormKit
                  type="date"
                  name="islamDate"
                  label="Tarikh Masuk Islam"
                  v-model="formData.personalInfo.islamDate"
                  :validation-messages="{
                    required: 'Tarikh masuk Islam adalah wajib',
                  }"
                />

                  <FormKit
                  v-if="formData.personalInfo.islamDate"
                    type="file"
                    name="islamCertificate"
                    label="Upload Surat Keislaman dari MAIS"
                    accept=".pdf,.jpg,.jpeg,.png"
                    v-model="formData.personalInfo.islamCertificate"
                    help="Format yang dibenarkan: PDF, JPG, PNG. Saiz maksimum: 5MB"
                    validation="required"
                    :validation-messages="{
                      required: 'Surat keislaman adalah wajib'
                    }"
                  />

                <!-- <FormKit
                  type="date"
                  name="kfamDate"
                  label="Tarikh Masuk KFAM"
                  v-model="formData.personalInfo.kfamDate"
                  :validation-messages="{
                    required: 'Tarikh masuk KFAM adalah wajib',
                  }"
                /> -->

                <!-- Marital Status Section -->
                <div class="md:col-span-2">
                  <h4 class="text-md font-medium mb-3">Maklumat Perkahwinan</h4>
                </div>
                <FormKit
                  type="select"
                  name="maritalStatus"
                  label="Status Perkahwinan"
                  validation="required"
                  :options="[
                    { label: 'Bujang', value: 'bujang' },
                    { label: 'Berkahwin', value: 'berkahwin' },
                    { label: 'Bercerai', value: 'bercerai' },
                    { label: 'Duda', value: 'duda' },
                    { label: 'Janda', value: 'janda' }
                  ]"
                  placeholder="Pilih status perkahwinan"
                  v-model="formData.personalInfo.maritalStatus"
                  :validation-messages="{
                    required: 'Status perkahwinan adalah wajib'
                  }"
                />

                <FormKit
                  type="select"
                  name="polygamyStatus"
                  label="Status Poligami"
                  validation="required"
                  :options="[
                    { label: 'Tidak', value: 'tidak' },
                    { label: 'Ya', value: 'ya' }
                  ]"
                  placeholder="Pilih status poligami"
                  v-model="formData.personalInfo.polygamyStatus"
                  :validation-messages="{
                    required: 'Status poligami adalah wajib'
                  }"
                />

                <!-- Polygamy Information (Conditional) -->
                <div v-if="formData.personalInfo.polygamyStatus === 'ya'" class="md:col-span-2">
                  <FormKit
                    type="select"
                    name="wivesCount"
                    label="Bilangan Isteri"
                    validation="required"
                    :options="wivesCountOptions"
                    placeholder="Pilih bilangan isteri"
                    v-model="formData.personalInfo.wivesCount"
                    :validation-messages="{
                      required: 'Bilangan isteri adalah wajib'
                    }"
                  />
                  <div v-for="(wife, idx) in formData.personalInfo.wives" :key="idx" class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <FormKit
                      type="text"
                      :name="`wifeIc${idx}`"
                      :label="`No Kp Pasangan #${idx+1}`"
                      validation="required"
                      v-model="wife.ic"
                      :validation-messages="{ required: 'No Kp Pasangan adalah wajib' }"
                    />
                    <FormKit
                      type="text"
                      :name="`wifeName${idx}`"
                      :label="`Nama Pasangan #${idx+1}`"
                      validation="required"
                      v-model="wife.name"
                      :validation-messages="{ required: 'Nama Pasangan adalah wajib' }"
                    />
                  </div>
                </div>

                <FormKit
                  type="number"
                  name="dependentsCount"
                  label="Bilangan Tanggungan"
                  validation="required|number|min:0"
                  v-model="formData.personalInfo.dependentsCount"
                  :validation-messages="{
                    required: 'Bilangan tanggungan adalah wajib',
                    number: 'Sila masukkan nombor yang sah',
                    min: 'Bilangan tanggungan tidak boleh kurang daripada 0'
                  }"
                />

                <!-- Bank Information Section -->
                <div class="md:col-span-2">
                  <h4 class="text-md font-medium mb-3">Maklumat Bank</h4>
                </div>
                <FormKit
                  type="select"
                  name="bankName"
                  label="Nama Bank"
                  validation="required"
                  :options="bankOptions"
                  placeholder="Pilih bank"
                  v-model="formData.personalInfo.bankName"
                  :validation-messages="{
                    required: 'Nama Bank adalah wajib',
                  }"
                />
            
                  <FormKit
                   v-if="formData.personalInfo.bankName"
                    type="text"
                    name="swiftCode"
                    label="SWIFT Code"
                    v-model="formData.personalInfo.swiftCode"
                    :value="selectedBankSwiftCode"
                    readonly
                    help="SWIFT Code untuk bank yang dipilih"
                  />                

                <FormKit
                  type="text"
                  name="bankAccount"
                  label="No Akaun Bank"
                  validation="required"
                  v-model="formData.personalInfo.bankAccount"
                  :validation-messages="{
                    required: 'No Akaun Bank adalah wajib',
                  }"
                />

                <FormKit
                  type="text"
                  name="bankAccountHolder"
                  label="Penama Bank Akaun"
                  v-model="formData.personalInfo.bankAccountHolder"
                />

                <FormKit
                  type="select"
                  name="paymentMethod"
                  label="Kaedah Pembayaran"
                  validation="required"
                  :options="[
                    { label: 'Akaun', value: 'akaun' },
                    { label: 'Tiada', value: 'tiada' }
                  ]"
                  placeholder="Pilih kaedah pembayaran"
                  v-model="formData.personalInfo.paymentMethod"
                  :validation-messages="{
                    required: 'Kaedah pembayaran adalah wajib'
                  }"
                />

                <!-- Conditional checkboxes when Tiada is selected -->
                <div v-if="formData.personalInfo.paymentMethod === 'tiada'" class="md:col-span-2">
                  <FormKit
                    type="checkbox"
                    name="noPaymentReason"
                    label="Nyatakan sebab"
                    :options="[
                      { label: 'Muflis', value: 'muflis' },
                      { label: 'Bukan Warganegara', value: 'bukan-warganegara' }
                    ]"
                    v-model="formData.personalInfo.noPaymentReason"
                    validation="required|min:1"
                    :validation-messages="{
                      required: 'Sila pilih sekurang-kurangnya satu sebab',
                      min: 'Sila pilih sekurang-kurangnya satu sebab'
                    }"
                  />
                </div>

                <!-- Income Information Section -->
                <div class="md:col-span-2">
                  <h4 class="text-md font-medium mb-3">Maklumat Pendapatan</h4>
                </div>

                <FormKit
                  type="number"
                  name="grossIncome"
                  label="Pendapatan Kasar (RM)"
                  validation="required|number|min:0"
                  v-model="formData.personalInfo.grossIncome"
                  :validation-messages="{
                    required: 'Pendapatan kasar adalah wajib',
                    number: 'Sila masukkan nombor yang sah',
                    min: 'Pendapatan kasar tidak boleh kurang daripada 0'
                  }"
                />

                <div class="md:col-span-2">
                  <FormKit
                    type="file"
                    name="incomeDocument"
                    label="Upload dokumen pengesahan pendapatan/slip gaji"
                    accept=".pdf,.jpg,.jpeg,.png"
                    v-model="formData.personalInfo.incomeDocument"
                    help="Format yang dibenarkan: PDF, JPG, PNG. Saiz maksimum: 5MB (Tidak wajib)"
                  />
                </div>
              </div>

              <div class="flex justify-end">
                <rs-button type="submit" variant="primary" @click="nextStep"
                  >Seterusnya ke Maklumat Alamat</rs-button
                >
              </div>
            </div>

            <!-- Step 2: Maklumat Alamat -->
            <div v-if="currentStep === 2">
              <h3 class="text-lg font-medium mb-4">B) Maklumat Alamat</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="md:col-span-2">
                  <FormKit
                    type="textarea"
                    name="address"
                    label="Alamat Terkini"
                    validation="required"
                    placeholder="Sila masukkan alamat"
                    v-model="formData.addressInfo.address"
                    :validation-messages="{
                      required: 'Alamat adalah wajib',
                    }"
                  />
                </div>

                <FormKit
                  type="select"
                  name="district"
                  label="Daerah"
                  validation="required"
                  :options="districtOptions"
                  v-model="formData.addressInfo.district"
                  :validation-messages="{ required: 'Daerah adalah wajib' }"
                />

                <FormKit
                  type="text"
                  name="postcode"
                  label="Poskod"
                  validation="required|length:5"
                  v-model="formData.addressInfo.postcode"
                  :validation-messages="{
                    required: 'Poskod adalah wajib',
                    length: 'Poskod mestilah 5 digit',
                  }"
                />

                <FormKit
                  type="select"
                  name="kariah"
                  label="Kariah"
                  validation="required"
                  :options="kariahOptions"
                  v-model="formData.addressInfo.kariah"
                  :validation-messages="{ required: 'Kariah adalah wajib' }"
                />

                <FormKit
                  type="number"
                  name="residenceYears"
                  label="Tempoh Bermastautin (Tahun)"
                  validation="required|number|min:0|max:99"
                  v-model="formData.addressInfo.residenceYears"
                  :validation-messages="{
                    required: 'Tempoh Bermastautin adalah wajib',
                    number: 'Sila masukkan nombor yang sah',
                    min: 'Tempoh Bermastautin tidak boleh kurang daripada 0',
                    max: 'Tempoh Bermastautin tidak boleh melebihi 99'
                  }"
                />

                <FormKit
                  type="text"
                  name="state"
                  label="Negeri"
                  v-model="formData.addressInfo.state"
                  disabled
                />

                <div class="md:col-span-2">
                  <FormKit
                    type="select"
                    name="residenceStatus"
                    label="Status Kediaman"
                    validation="required"
                    :options="residenceStatusOptions"
                    placeholder="Pilih status kediaman"
                    v-model="formData.addressInfo.residenceStatus"
                    :validation-messages="{
                      required: 'Status Kediaman adalah wajib',
                    }"
                  />
                </div>

                <div
                  v-if="
                    formData.addressInfo.residenceStatus === 'milik-sendiri'
                  "
                  class="md:col-span-2"
                >
                  <FormKit
                    type="radio"
                    name="paymentStatus"
                    label="Status Pembayaran"
                    :options="[
                      { label: 'Berbayar', value: 'berbayar' },
                      { label: 'Tidak Berbayar', value: 'tidak-berbayar' },
                    ]"
                    v-model="formData.addressInfo.paymentStatus"
                  />
                </div>

                <div
                  v-if="
                    formData.addressInfo.residenceStatus === 'milik-sendiri' &&
                    formData.addressInfo.paymentStatus === 'berbayar'
                  "
                >
                  <FormKit
                    type="number"
                    name="monthlyPayment"
                    label="Bayaran Bulanan (RM)"
                    validation="required|number"
                    v-model="formData.addressInfo.monthlyPayment"
                    :validation-messages="{
                      required: 'Bayaran bulanan adalah wajib',
                      number: 'Sila masukkan nombor yang sah',
                    }"
                  />
                </div>

                <div v-if="formData.addressInfo.residenceStatus === 'sewa'">
                  <FormKit
                    type="number"
                    name="rentAmount"
                    label="Kadar Sewa Bulanan (RM)"
                    validation="required|number"
                    v-model="formData.addressInfo.rentAmount"
                    :validation-messages="{
                      required: 'Kadar sewa adalah wajib',
                      number: 'Sila masukkan nombor yang sah',
                    }"
                  />
                </div>

                <div
                  v-if="formData.addressInfo.residenceStatus === 'lain-lain'"
                  class="md:col-span-2"
                >
                  <FormKit
                    type="text"
                    name="otherResidenceDetail"
                    label="Nyatakan"
                    validation="required"
                    v-model="formData.addressInfo.otherResidenceDetail"
                    :validation-messages="{
                      required: 'Maklumat ini adalah wajib',
                    }"
                  />
                </div>

                <FormKit
                  type="file"
                  name="addressSupportDoc"
                  label="Muat naik dokumen sokongan sewaan"
                  accept=".pdf,.jpg,.jpeg,.png"
                  v-model="formData.addressInfo.addressSupportDoc"
                  help="Format yang dibenarkan: PDF, JPG, PNG. Saiz maksimum: 5MB"
                />

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
                    @click="selectAddressLocation"
                    class="whitespace-nowrap mt-7"
                  >
                    <i class="fas fa-location-dot mr-2"></i>
                    Dapatkan Lokasi
                  </rs-button>
                </div>
              </div>

              <div class="flex justify-between gap-3 mt-6">
                <rs-button
                  type="button"
                  variant="primary-outline"
                  @click="prevStep"
                  >Kembali</rs-button
                >
                <rs-button type="submit" variant="primary" @click="nextStep"
                  >Seterusnya ke Pengesahan</rs-button
                >
              </div>
            </div>

            <!-- Step 3: Pengesahan -->
            <div v-if="currentStep === 3">
              <h3 class="text-lg font-medium mb-4">C) Pengesahan</h3>

              <div class="mb-6">
                <h4 class="font-medium mb-3"> Maklumat Perakuan Pemohon</h4>
                <div class="flex flex-col gap-2">
                  <label class="font-medium">Hubungan kekeluargaan dengan kakitangan LZS?</label>
                  <FormKit
                    type="radio"
                    name="hubungan_kakitangan_lzs"
                    :options="['Ya', 'Tidak']"
                    validation="required"
                    v-model="formData.verification.hubunganKakitanganLZS"
                  />
                </div>

                <div v-if="formData.verification.hubunganKakitanganLZS === 'Ya'" class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <FormKit
                    type="text"
                    name="nama_kakitangan"
                    label="Nama Kakitangan"
                    validation="required"
                    v-model="formData.verification.namaKakitangan"
                  />

                  <FormKit
                    type="text"
                    name="jawatan_kakitangan"
                    label="Jawatan"
                    validation="required"
                    v-model="formData.verification.jawatanKakitangan"
                  />

                  <FormKit
                    type="text"
                    name="pejabat_kakitangan"
                    label="Pejabat"
                    validation="required"
                    v-model="formData.verification.pejabatKakitangan"
                  />

                  <FormKit
                    type="text"
                    name="hubungan_kakitangan"
                    label="Hubungan"
                    validation="required"
                    v-model="formData.verification.hubunganKakitangan"
                  />

                  <FormKit
                    type="date"
                    name="tarikh_perakuan"
                    label="Tarikh Perakuan"
                    validation="required"
                    v-model="formData.verification.tarikhPerakuan"
                  />
                </div>
              </div>

              <div class="flex justify-between gap-3 mt-6">
                <rs-button
                  type="button"
                  variant="primary-outline"
                  @click="prevStep"
                  >Kembali</rs-button
                >
                <div class="flex gap-3">
                  <rs-button type="button" variant="primary" @click="nextStep"
                    >Seterusnya ke Pengesahan Bermastautin</rs-button
                  >
                </div>
              </div>
            </div>

            <!-- Step 4: Maklumat Pengesah Bermastautin -->
            <div v-if="currentStep === 4">
              <h3 class="text-lg font-medium mb-4">D) Maklumat Pengesah Bermastautin</h3>
              <p class="text-sm text-gray-600 mb-4">
                *(Wakil Rakyat/Penghulu/Ketua Kampung/Ketua Penduduk/Nazir Masjid/Pengerusi Surau/Penolong Amil/Guru Pembimbing Asnaf Muallaf/Eksekutif LZS/Ketua Operasi Agihan Daerah LZS/Ketua Jabatan LZS/Pengurus LZS/Ketua Cawangan LZS.)
              </p>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormKit
                  type="text"
                  name="nama_pengesah"
                  label="Nama"
                  validation="required"
                  v-model="formData.verification.namaPengesah"
                />

                <FormKit
                  type="text"
                  name="jawatan_pengesah"
                  label="Jawatan"
                  validation="required"
                  v-model="formData.verification.jawatanPengesah"
                />

                <FormKit
                  type="text"
                  name="no_telefon_pengesah"
                  label="No Telefon"
                  validation="required"
                  v-model="formData.verification.noTelefonPengesah"
                />

                <FormKit
                  type="date"
                  name="tarikh_pengesahan_permastautin"
                  label="Tarikh Pengesahan"
                  validation="required"
                  v-model="formData.verification.tarikhPengesahanPermastautin"
                />

                <div class="md:col-span-2">
                  <FormKit
                    type="file"
                    name="dokumen_pengesahan_permastautin"
                    label="Muat naik dokumen pengesahan bermastautin"
                    accept=".pdf,.jpg,.jpeg,.png"
                    v-model="formData.verification.dokumenPengesahanPermastautin"
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
                  @click="prevStep"
                  >Kembali</rs-button
                >
                <rs-button type="submit" variant="primary" @click="nextStep"
                  >Seterusnya ke Pegawai Pendaftar</rs-button
                >
              </div>
            </div>

            <!-- Step 5: Pegawai Pendaftar -->
            <div v-if="currentStep === 5">
              <h3 class="text-lg font-medium mb-4">E) Pegawai Pendaftar</h3>
              <div class="space-y-6">
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
                    @click="prevStep"
                    >Kembali</rs-button
                  >
                  <rs-button type="submit" variant="primary" @click="handleSubmit"
                    >Hantar Permohonan</rs-button
                  >
                </div>
              </div>
            </div>
          </FormKit>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
// ============================================================================
// IMPORTS
// ============================================================================
import { ref, computed, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";

// ============================================================================
// COMPOSABLES & SETUP
// ============================================================================
const toast = useToast();
const router = useRouter();

// ============================================================================
// PAGE META
// ============================================================================
definePageMeta({
  title: "Isi Permohonan Ringkas",
});

// ============================================================================
// REACTIVE STATE
// ============================================================================
// Form state
const currentStep = ref(1);
const totalStep = 5;

// Breadcrumb
const breadcrumb = ref([
  {
    name: "Borang Permohonan Perseorangan",
    type: "current",
    path: "/BF-PRF/AS/QS-S/02/selfbencana",
  },
]);

// Steps configuration
const steps = [
  { id: 1, label: "Peribadi" },
  { id: 2, label: "Alamat" },
  { id: 3, label: "Pengesahan" },
  { id: 4, label: "Bermastautin" },
  { id: 5, label: "Pegawai" }
];

// ============================================================================
// FORM DATA STRUCTURE
// ============================================================================
const formData = ref({
  personalInfo: {
    idValue: "",
    idNumber: "",
    idDocument: null,
    name: "",
    islamName: "",
    phone: "",
    religion: "",
    bankName: "",
    bankAccount: "",
    bankAccountHolder: "",
    swiftCode: "",
    paymentMethod: "",
    noPaymentReason: [],
    maritalStatus: "",
    healthStatus: "",
    islamDate: "",
    islamCertificate: null,
    kfamDate: "",
    email: "",
    citizenship: "",
    dateOfBirth: "",
    gender: "",
    assistanceType: "",
    disasterLocation: "",
    polygamyStatus: "",
    wivesCount: "",
    wives: [],
    dependentsCount: "",
    grossIncome: "",
    incomeDocument: null,
  },
  healthInfo: {
    status: "",
    details: "",
    chronicIllnessDoc: null,
    disabilityDoc: null,
    disasterDocument: null,
  },
  addressInfo: {
    address: "",
    district: "",
    postcode: "",
    kariah: "",
    state: "Selangor",
    residenceYears: "",
    residenceStatus: "",
    paymentStatus: "",
    monthlyPayment: "",
    rentAmount: "",
    otherResidenceDetail: "",
    addressSupportDoc: null,
    location: ""
  },
  verification: {
    hubunganKakitanganLZS: "",
    namaKakitangan: "",
    jawatanKakitangan: "",
    pejabatKakitangan: "",
    hubunganKakitangan: "",
    tarikhPerakuan: "",
    namaPengesah: "",
    jawatanPengesah: "",
    noTelefonPengesah: "",
    tarikhPengesahanPermastautin: "",
    dokumenPengesahanPermastautin: null
  },
});

// ============================================================================
// OPTIONS & CONFIGURATIONS
// ============================================================================
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
  { label: "Agrobank", value: "agrobank", swiftCode: "AGOBMYKL" },
];

// Religion Options
const religionOptions = [
  { label: "Islam", value: "islam" },
  { label: "Kristian", value: "kristian" },
  { label: "Buddha", value: "buddha" },
  { label: "Hindu", value: "hindu" },
  { label: "Lain-lain", value: "lain" }
];

// Wives Count Options
const wivesCountOptions = [
  { label: "2", value: 2 },
  { label: "3", value: 3 },
  { label: "4", value: 4 }
];

// District Options
const districtOptions = [
  { label: 'Gombak', value: 'gombak' },
  { label: 'Hulu Langat', value: 'hulu-langat' },
  { label: 'Hulu Selangor', value: 'hulu-selangor' },
  { label: 'Klang', value: 'klang' },
  { label: 'Kuala Langat', value: 'kuala-langat' },
  { label: 'Kuala Selangor', value: 'kuala-selangor' },
  { label: 'Petaling', value: 'petaling' },
  { label: 'Sabak Bernam', value: 'sabak-bernam' },
  { label: 'Sepang', value: 'sepang' },
  { label: 'Shah Alam', value: 'shah-alam' }
];

// Kariah Options
const kariahOptions = [
  { label: 'Masjid Negeri', value: 'masjid-negeri' },
  { label: 'Masjid Sultan Salahuddin Abdul Aziz Shah', value: 'masjid-sultan-salahuddin' },
  { label: 'Masjid Al-Azim Pandan Indah', value: 'masjid-al-azim' },
  { label: 'Masjid Al-Amin Bangi', value: 'masjid-al-amin' },
];

// Residence Status Options
const residenceStatusOptions = [
  { label: "Milik Sendiri", value: "milik-sendiri" },
  { label: "Sewa", value: "sewa" },
  { label: "Tumpang", value: "tumpang" },
  { label: "Lain-lain", value: "lain-lain" },
];

// ============================================================================
// COMPUTED PROPERTIES
// ============================================================================
// Get SWIFT code for selected bank
const selectedBankSwiftCode = computed(() => {
  const selectedBank = bankOptions.find(bank => bank.value === formData.value.personalInfo.bankName);
  return selectedBank ? selectedBank.swiftCode : '';
});

// ============================================================================
// METHODS
// ============================================================================
// Form utility methods
const getPlaceholder = () => {
  switch (formData.value.personalInfo.idValue) {
    case "ic":
      return "Contoh: 901231025678";
    case "foreign-id":
      return "Contoh: A12345678";
    case "polis":
      return "Contoh: 123456";
    case "tentera":
      return "Contoh: 12345678";
    case "sijil-lahir":
      return "Contoh: 12345678";
    default:
      return "";
  }
};

const getDocumentLabel = () => {
  switch (formData.value.personalInfo.idValue) {
    case "ic":
      return "Upload Kad Pengenalan";
    case "foreign-id":
      return "Upload Foreign ID";
    case "polis":
      return "Upload No Polis";
    case "tentera":
      return "Upload No Tentera";
    case "sijil-lahir":
      return "Upload No Sijil Lahir";
    default:
      return "";
  }
};

// Form submission methods
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

// Step navigation methods
const prevStep = () => {
  currentStep.value--;
};

const nextStep = () => {
  currentStep.value++;
};

// Location methods
const selectAssistanceType = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      () => {
        formData.value.personalInfo.assistanceType = 'Lokasi semasa';
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

const selectAddressLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      () => {
        formData.value.addressInfo.location = 'Lokasi semasa';
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

// ============================================================================
// WATCHERS
// ============================================================================
// Watch wives count changes
watch(
  () => formData.value.personalInfo.wivesCount,
  (newVal) => {
    const count = parseInt(newVal) || 0;
    if (count > 0) {
      while (formData.value.personalInfo.wives.length < count) {
        formData.value.personalInfo.wives.push({ ic: "", name: "" });
      }
      formData.value.personalInfo.wives = formData.value.personalInfo.wives.slice(0, count);
    } else {
      formData.value.personalInfo.wives = [];
    }
  }
);

// Watch polygamy status changes
watch(
  () => formData.value.personalInfo.polygamyStatus,
  (newVal) => {
    if (newVal !== "ya") {
      formData.value.personalInfo.wivesCount = "";
      formData.value.personalInfo.wives = [];
    }
  }
);

// Watch bank selection for SWIFT code
watch(
  () => formData.value.personalInfo.bankName,
  (newVal) => {
    if (newVal) {
      const selectedBank = bankOptions.find(bank => bank.value === newVal);
      if (selectedBank) {
        formData.value.personalInfo.swiftCode = selectedBank.swiftCode;
      }
    } else {
      formData.value.personalInfo.swiftCode = '';
    }
  }
);

// ============================================================================
// LIFECYCLE HOOKS
// ============================================================================
onMounted(() => {
  // Initialize form
});
</script>
