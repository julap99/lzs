<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Isi Borang Permohonan Online</h2>
        </div>
      </template>

      <template #body>
        <!-- Progress indicator -->
        <div class="mb-6">
          <div class="w-full bg-gray-200 rounded-full h-2.5">
            <div
              class="bg-primary h-2.5 rounded-full"
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
                <FormKit
                  type="select"
                  name="idValue"
                  label="Jenis ID"
                  placeholder="Pilih jenis ID"
                  validation="required"
                  :options="[
                    { label: 'Kad Pengenalan', value: 'ic' },
                    { label: 'Foreign ID', value: 'foreign-id' }
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
                    :label="formData.personalInfo.idValue === 'ic' ? 'Upload Kad Pengenalan' : 'Upload Foreign ID'"
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
                  name="otherIdNumber"
                  label="No Polis/No Tentera/No Sijil Lahir"
                  v-model="formData.personalInfo.otherIdNumber"
                  :validation-messages="{
                    required: 'No Polis/No Tentera/No Sijil Lahir adalah wajib',
                  }"
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
                  type="text"
                  name="islamName"
                  label="Nama Selepas Islam(Mualaf)"
                  v-model="formData.personalInfo.islamName"
                  :validation-messages="{
                    required: 'Nama selepas Islam adalah wajib',
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

                <FormKit
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
                />

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
                <FormKit
                      type="text"
                      name="nopassport"
                      label="No Passport"  
                    />

                    <FormKit
                      type="date"
                      name="passportStartDate"
                      label="Tarikh mula passport"
                      v-model="formData.personalInfo.passportStartDate"
                    />
                    <FormKit
                      type="date"
                      name="passportEndDate"
                      label="Tarikh tamat passport"
                      v-model="formData.personalInfo.passportEndDate"
                    />

                <!-- Islamic Information Section -->
                <div class="md:col-span-2">
                  <h4 class="text-md font-medium mb-3">Maklumat Islam</h4>
                </div>
                <FormKit
                  type="date"
                  name="islamDate"
                  label="Tarikh Masuk Islam"
                  v-model="formData.personalInfo.islamDate"
                  :validation-messages="{
                    required: 'Tarikh masuk Islam adalah wajib',
                  }"
                />

                <div v-if="formData.personalInfo.islamDate" class="md:col-span-2">
                  <FormKit
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
                </div>

                <FormKit
                  type="date"
                  name="kfamDate"
                  label="Tarikh Masuk KFAM"
                  v-model="formData.personalInfo.kfamDate"
                  :validation-messages="{
                    required: 'Tarikh masuk KFAM adalah wajib',
                  }"
                />

                <!-- Marital Status Section -->
                <div class="md:col-span-2">
                  <h4 class="text-md font-medium mb-3">Status Perkahwinan</h4>
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
                  label="Cara Pembayaran"
                  validation="required"
                  :options="[
                    { label: 'Akaun', value: 'akaun' },
                    { label: 'Cek', value: 'cek' },
                    { label: 'Tunai', value: 'tunai' }
                  ]"
                  placeholder="Pilih cara pembayaran"
                  v-model="formData.personalInfo.paymentMethod"
                  :validation-messages="{
                    required: 'Cara pembayaran adalah wajib'
                  }"
                />

                <!-- Cash Payment Reason (Conditional) -->
                <div v-if="formData.personalInfo.paymentMethod === 'tunai'" class="md:col-span-2">
                  <FormKit
                    type="select"
                    name="cashPaymentReason"
                    label="Nyatakan sebab"
                    validation="required"
                    :options="[
                      { label: 'Uzur', value: 'uzur' },
                      { label: 'Sakit', value: 'sakit' },
                      { label: 'Muflis', value: 'muflis' },
                      { label: 'Disenarai hitam', value: 'disenarai-hitam' }
                    ]"
                    placeholder="Pilih sebab"
                    v-model="formData.personalInfo.cashPaymentReason"
                    :validation-messages="{
                      required: 'Sebab adalah wajib'
                    }"
                  />
                </div>

                <!-- Location Information Section -->
                <div class="md:col-span-2">
                  <h4 class="text-md font-medium mb-3">Maklumat Lokasi</h4>
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
              </div>

              <div class="flex justify-end">
                <rs-button type="submit" variant="primary" @click="nextStep"
                  >Seterusnya ke Maklumat Kesihatan</rs-button
                >
              </div>
            </div>

            <!-- Step 2: Maklumat Kesihatan -->
            <div v-if="currentStep === 2">
              <h3 class="text-lg font-medium mb-4">B) Maklumat Kesihatan</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormKit
                  type="select"
                  name="healthStatus"
                  label="Kesihatan"
                  validation="required"
                  :options="[
                    { label: 'Sihat', value: 'sihat' },
                    { label: 'Sakit', value: 'sakit' },
                    { label: 'Cacat', value: 'cacat' }
                  ]"
                  placeholder="Pilih status kesihatan"
                  v-model="formData.healthInfo.status"
                  :validation-messages="{
                    required: 'Status kesihatan adalah wajib'
                  }"
                />

                <div v-if="formData.healthInfo.status === 'sakit' || formData.healthInfo.status === 'cacat'" class="md:col-span-2">
                  <FormKit
                    type="textarea"
                    name="healthDetails"
                    label="Nyatakan"
                    validation="required"
                    v-model="formData.healthInfo.details"
                    :validation-messages="{
                      required: 'Sila nyatakan butiran kesihatan'
                    }"
                  />
                </div>

                <div v-if="formData.healthInfo.status === 'sakit'" class="md:col-span-2">
                  <FormKit
                    type="file"
                    name="chronicIllnessDoc"
                    label="Upload dokumen sakit kronik"
                    accept=".pdf,.jpg,.jpeg,.png"
                    v-model="formData.healthInfo.chronicIllnessDoc"
                  />
                </div>

                <div v-if="formData.healthInfo.status === 'cacat'" class="md:col-span-2">
                  <FormKit
                    type="file"
                    name="disabilityDoc"
                    label="Upload dokumen cacat"
                    accept=".pdf,.jpg,.jpeg,.png"
                    v-model="formData.healthInfo.disabilityDoc"
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
                  >Seterusnya ke Maklumat Pasangan</rs-button
                >
              </div>
            </div>

            <!-- Step 3: Maklumat Pasangan -->
            <div v-if="currentStep === 3">
              <h3 class="text-lg font-medium mb-4">C) Maklumat Pasangan(Jika tinggal bersama Di alamat yang sama)</h3>

              <FormKit
                type="select"
                name="status_perkahwinan"
                label="Status Perkahwinan"
                :options="[
                  '-- pilih --',
                  'Berkahwin',
                  'Bujang',
                  'Janda',
                  'Ibu Tinggal',
                  'Bapa Tinggal',
                  'Duda',
                  'Balu',
                ]"
                validation="required"
                v-model="statusKahwin"
              />

              <div v-if="statusKahwin == 'Berkahwin'">
                <div v-for="(spouse, idx) in formData.spouseInfo" :key="idx" class="mb-8 p-4 border border-gray-200 rounded-lg">
                  <div class="flex justify-between items-center mb-4">
                    <h4 class="text-md font-medium">
                      <span>Pasangan #</span>
                      <span>{{ idx + 1 }}</span>
                    </h4>
                    <button type="button" @click="removeSpouse(idx)" class="text-red-500 hover:text-red-700">
                      <Icon name="mdi:delete" size="1.25rem" />
                    </button>
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormKit
                      type="select"
                      :name="`spouseIdType${idx}`"
                      label="Jenis ID Pasangan"
                      validation="required"
                      :options="idTypeOptions"
                      placeholder="Pilih jenis ID"
                      v-model="spouse.idType"
                      :validation-messages="{ required: 'Jenis ID adalah wajib' }"
                    />

                    <div v-if="spouse.idType" class="md:col-span-2">
                      <FormKit
                        type="file"
                        :name="`spouseIdDocument${idx}`"
                        :label="spouse.idType === 'ic' ? 'Upload Kad Pengenalan Pasangan' : 'Upload Foreign ID Pasangan'"
                        accept=".pdf,.jpg,.jpeg,.png"
                        v-model="spouse.idDocument"
                        help="Format yang dibenarkan: PDF, JPG, PNG. Saiz maksimum: 5MB"
                        validation="required"
                        :validation-messages="{
                          required: 'Dokumen ID pasangan adalah wajib'
                        }"
                      />
                    </div>

                    <FormKit
                      type="text"
                      :name="`spouseIdNumber${idx}`"
                      label="Nombor ID Pasangan"
                      validation="required"
                      v-model="spouse.idNumber"
                      :validation-messages="{ required: 'Nombor ID adalah wajib' }"
                    />
                    <FormKit
                      type="text"
                      name="nopassport"
                      label="No Passport"  
                    />
                    <FormKit
                      type="date"
                      :name="`spousePassportStartDate${idx}`"
                      label="Tarikh Mula Passport"
                      v-model="spouse.passportStartDate"
                    />
                    <FormKit
                      type="date"
                      :name="`spousePassportEndDate${idx}`"
                      label="Tarikh Akhir Passport"
                      v-model="spouse.passportEndDate"
                    />
                    <FormKit
                      type="text"
                      :name="`spouseName${idx}`"
                      label="Nama Pasangan"
                      validation="required"
                      v-model="spouse.name"
                      :validation-messages="{ required: 'Nama adalah wajib' }"
                    />
                    <FormKit
                      type="file"
                      :name="`spouseSupportDoc${idx}`"
                      label="Muat naik dokumen sokongan pasangan"
                      accept=".pdf,.jpg,.jpeg,.png"
                      v-model="spouse.supportDoc"
                      help="Format yang dibenarkan: PDF, JPG, PNG. Saiz maksimum: 5MB"
                    />
                  </div>
                </div>
                <div class="flex justify-center mt-4">
                  <rs-button variant="secondary" @click="addSpouse" type="button">
                    <Icon name="mdi:plus" class="mr-1" size="1rem" />
                    Tambah Pasangan
                  </rs-button>
                </div>
              </div>
              <div v-else class="bg-gray-50 p-4 rounded-lg">
                <p>
                  Tiada maklumat pasangan diperlukan berdasarkan status
                  perkahwinan yang dipilih.
                </p>
              </div>
              <div class="flex justify-between gap-3 mt-6">
                <rs-button
                  type="button"
                  variant="primary-outline"
                  @click="prevStep"
                  >Kembali</rs-button
                >
                <rs-button type="submit" variant="primary" @click="nextStep"
                  >Seterusnya ke Maklumat Alamat</rs-button
                >
              </div>
            </div>

            <!-- Step 4: Maklumat Alamat -->
            <div v-if="currentStep === 4">
              <h3 class="text-lg font-medium mb-4">D) Maklumat Alamat</h3>
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
                  label="Tempoh menetap (Tahun)"
                  validation="required|number|min:0|max:99"
                  v-model="formData.addressInfo.residenceYears"
                  :validation-messages="{
                    required: 'Tempoh menetap adalah wajib',
                    number: 'Sila masukkan nombor yang sah',
                    min: 'Tempoh menetap tidak boleh kurang daripada 0',
                    max: 'Tempoh menetap tidak boleh melebihi 99'
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
                  >Seterusnya ke Maklumat Pekerjaan</rs-button
                >
              </div>
            </div>

            <!-- Step 5: Maklumat Pekerjaan -->
            <div v-if="currentStep === 5">
              <h3 class="text-lg font-medium mb-4">E) Maklumat Pekerjaan</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormKit
                  type="select"
                  name="employmentStatus"
                  label="Pekerjaan"
                  validation="required"
                  :options="[
                    { label: 'Bekerja', value: 'bekerja' },
                    { label: 'Tidak Bekerja', value: 'tidak-bekerja' }
                  ]"
                  placeholder="Pilih status pekerjaan"
                  v-model="formData.employmentInfo.status"
                  :validation-messages="{
                    required: 'Status pekerjaan adalah wajib'
                  }"
                />

                <div v-if="formData.employmentInfo.status === 'bekerja'" class="md:col-span-2">
                  <FormKit
                    type="text"
                    name="jobPosition"
                    label="Jawatan"
                    validation="required"
                    v-model="formData.employmentInfo.jobPosition"
                    :validation-messages="{
                      required: 'Jawatan adalah wajib'
                    }"
                  />
                </div>

                <div v-if="formData.employmentInfo.status === 'tidak-bekerja'" class="md:col-span-2">
                  <FormKit
                    type="textarea"
                    name="unemploymentReason"
                    label="Nyatakan"
                    validation="required"
                    v-model="formData.employmentInfo.unemploymentReason"
                    :validation-messages="{
                      required: 'Sila nyatakan sebab tidak bekerja'
                    }"
                  />
                </div>

                <FormKit
                  type="select"
                  name="sector"
                  label="Sektor"
                  validation="required"
                  :options="[
                    { label: 'Kerajaan', value: 'kerajaan' },
                    { label: 'Swasta', value: 'swasta' },
                    { label: 'Badan Berkanun', value: 'badan-berkanun' },
                    { label: 'Kerja Sendiri', value: 'kerja-sendiri' }
                  ]"
                  placeholder="Pilih sektor"
                  v-model="formData.employmentInfo.sector"
                  :validation-messages="{
                    required: 'Sektor adalah wajib'
                  }"
                />

                <div v-if="formData.employmentInfo.sector" class="md:col-span-2">
                  <FormKit
                    type="text"
                    name="sectorDetails"
                    label="Nyatakan"
                    validation="required"
                    v-model="formData.employmentInfo.sectorDetails"
                    :validation-messages="{
                      required: 'Sila nyatakan butiran sektor'
                    }"
                  />
                </div>

                <FormKit
                  type="text"
                  name="employerName"
                  label="Nama Majikan"
                  validation="required"
                  v-model="formData.employmentInfo.employerName"
                  :validation-messages="{
                    required: 'Nama majikan adalah wajib'
                  }"
                />

                <div class="md:col-span-2">
                  <FormKit
                    type="textarea"
                    name="employerAddress"
                    label="Alamat Majikan"
                    validation="required"
                    v-model="formData.employmentInfo.employerAddress"
                    :validation-messages="{
                      required: 'Alamat majikan adalah wajib'
                    }"
                  />
                </div>

                <FormKit
                  type="tel"
                  name="employerPhone"
                  label="No Telefon Majikan"
                  validation="required"
                  v-model="formData.employmentInfo.employerPhone"
                  :validation-messages="{
                    required: 'No telefon majikan adalah wajib'
                  }"
                />

                <FormKit
                  type="number"
                  name="grossIncome"
                  label="Pendapatan Kasar"
                  validation="required|number|min:0"
                  v-model="formData.employmentInfo.grossIncome"
                  :validation-messages="{
                    required: 'Pendapatan kasar adalah wajib',
                    number: 'Sila masukkan nombor yang sah',
                    min: 'Pendapatan kasar tidak boleh kurang daripada 0'
                  }"
                />

                <!-- <FormKit
                  type="number"
                  name="dependentsCount"
                  label="Bilangan Tanggungan"
                  validation="required|number|min:0"
                  v-model="formData.employmentInfo.dependentsCount"
                  :validation-messages="{
                    required: 'Bilangan tanggungan adalah wajib',
                    number: 'Sila masukkan nombor yang sah',
                    min: 'Bilangan tanggungan tidak boleh kurang daripada 0'
                  }"
                /> -->
              </div>

              <div class="flex justify-between gap-3 mt-6">
                <rs-button
                  type="button"
                  variant="primary-outline"
                  @click="prevStep"
                  >Kembali</rs-button
                >
                <rs-button type="submit" variant="primary" @click="nextStep"
                  >Seterusnya ke Maklumat Tanggungan</rs-button
                >
              </div>
            </div>

            <!-- Step 6: Maklumat Tanggungan  -->
            <div v-if="currentStep === 6">
              <h3 class="text-lg font-medium mb-4">F) Maklumat Tanggungan</h3>

              <div
                v-for="(dependent, index) in formData.schoolDependents"
                :key="index"
                class="mb-8 p-4 border border-gray-200 rounded-lg"
              >
                <div class="flex justify-between items-center mb-4">
                  <h4 class="text-md font-medium">
                    Tanggungan #{{ index + 1 }}
                  </h4>
                  <button
                    type="button"
                    @click="removeSchoolDependent(index)"
                    class="text-red-500 hover:text-red-700"
                  >
                    <Icon name="mdi:delete" size="1.25rem" />
                  </button>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormKit
                    type="text"
                    :name="`dependent${index}KKID`"
                    label="KKID"
                    validation="required"
                    disabled
                    v-model="dependent.kkid"
                    :validation-messages="{
                      required: 'KKID adalah wajib',
                    }"
                  />

                  <FormKit
                    type="text"
                    :name="`dependent${index}NewIC`"
                    label="No Kad Pengenalan / Foreign ID"
                    validation="required"
                    v-model="dependent.newIC"
                    :validation-messages="{
                      required: 'No Kad Pengenalan adalah wajib',
                    }"
                  />

                  <div class="md:col-span-2">
                    <FormKit
                      type="file"
                      :name="`dependent${index}IdDocument`"
                      label="Upload ID/Foreign ID/MyKid Tanggungan"
                      accept=".pdf,.jpg,.jpeg,.png"
                      v-model="dependent.idDocument"
                      help="Format yang dibenarkan: PDF, JPG, PNG. Saiz maksimum: 5MB"
                      validation="required"
                      :validation-messages="{
                        required: 'Dokumen ID tanggungan adalah wajib'
                      }"
                    />
                  </div>

                  <FormKit
                    type="text"
                    :name="`dependent${index}OtherID`"
                    label="No Polis/No Tentera/No Sijil Lahir"
                    validation="required"
                    v-model="dependent.otherID"
                    :validation-messages="{
                      required: 'No ID adalah wajib',
                    }"
                  />
                   <FormKit
                      type="text"
                      name="nopassport"
                      label="No Passport"  
                    />

                  <FormKit
                    type="date"
                    :name="`dependent${index}PassportStartDate`"
                    label="Tarikh mula passport"
                    v-model="dependent.passportStartDate"
                  />

                  <FormKit
                    type="date"
                    :name="`dependent${index}PassportEndDate`"
                    label="Tarikh tamat passport"
                    v-model="dependent.passportEndDate"
                  />

                  <FormKit
                    type="text"
                    :name="`dependent${index}Name`"
                    label="Nama"
                    validation="required"
                    v-model="dependent.name"
                    :validation-messages="{
                      required: 'Nama adalah wajib',
                    }"
                  />

                  <FormKit
                    type="select"
                    :name="`dependent${index}Relationship`"
                    label="Hubungan"
                    validation="required"
                    :options="[
                      { label: 'Anak', value: 'anak' },
                      { label: 'Ibu Bapa', value: 'ibu-bapa' },
                      { label: 'Adik-beradik', value: 'adik-beradik' },
                      { label: 'Saudara-mara', value: 'saudara-mara' },
                      { label: 'Lain-lain', value: 'lain-lain' }
                    ]"
                    placeholder="Pilih hubungan"
                    v-model="dependent.relationship"
                    :validation-messages="{
                      required: 'Hubungan adalah wajib',
                    }"
                  />

                  <FormKit
                    type="number"
                    :name="`dependent${index}Age`"
                    label="Umur"
                    validation="required|number|min:0|max:120"
                    v-model="dependent.age"
                    :validation-messages="{
                      required: 'Umur adalah wajib',
                      number: 'Sila masukkan nombor yang sah',
                      min: 'Umur tidak boleh kurang daripada 0',
                      max: 'Umur tidak boleh melebihi 120'
                    }"
                  />

                  <FormKit
                    type="select"
                    :name="`dependent${index}Status`"
                    label="Status"
                    validation="required"
                    :options="[
                      { label: 'Sekolah', value: 'sekolah' },
                      { label: 'Universiti', value: 'universiti' },
                      { label: 'Tidak Bekerja', value: 'tidak-bekerja' },
                      { label: 'Bekerja', value: 'bekerja' },
                      { label: 'Pusat Jagaan Anak', value: 'pusat-jagaan' }
                    ]"
                    placeholder="Pilih status"
                    v-model="dependent.status"
                    :validation-messages="{
                      required: 'Status adalah wajib',
                    }"
                  />

                  <div class="md:col-span-2">
                  <FormKit
                      type="file"
                      :name="`dependent${index}SupportDoc`"
                      label="Muat naik dokumen sokongan untuk status tanggungan"
                      accept=".pdf,.jpg,.jpeg,.png"
                      v-model="dependent.supportDoc"
                    />
                  </div>

                  <div class="md:col-span-2">
                    <FormKit
                      type="textarea"
                      :name="`dependent${index}LivingCost`"
                      label="Nyatakan Kos Saraan mengikut Status"
                      validation="required"
                      v-model="dependent.livingCost"
                      :validation-messages="{
                        required: 'Kos saraan adalah wajib',
                      }"
                    />
                  </div>

                  <FormKit
                    type="select"
                    :name="`dependent${index}HealthStatus`"
                    label="Kesihatan"
                    validation="required"
                    :options="[
                      { label: 'Sihat', value: 'sihat' },
                      { label: 'Kronik', value: 'kronik' },
                      { label: 'Cacat', value: 'cacat' }
                    ]"
                    placeholder="Pilih status kesihatan"
                    v-model="dependent.healthStatus"
                    :validation-messages="{
                      required: 'Status kesihatan adalah wajib',
                    }"
                  />

                  <div v-if="dependent.healthStatus === 'kronik'" class="md:col-span-2">
                    <FormKit
                      type="file"
                      :name="`dependent${index}ChronicDoc`"
                      label="Upload dokumen sakit kronik"
                      accept=".pdf,.jpg,.jpeg,.png"
                      v-model="dependent.chronicDoc"
                    />
                  </div>

                  <div v-if="dependent.healthStatus === 'cacat'" class="md:col-span-2">
                    <FormKit
                      type="file"
                      :name="`dependent${index}DisabilityDoc`"
                      label="Upload dokumen cacat"
                      accept=".pdf,.jpg,.jpeg,.png"
                      v-model="dependent.disabilityDoc"
                  />
                  </div>

                  <div class="md:col-span-2">
                    <FormKit
                      type="textarea"
                      :name="`dependent${index}HealthCost`"
                      label="Nyatakan Kos Saraan mengikut kategori kesihatan"
                      validation="required"
                      v-model="dependent.healthCost"
                      :validation-messages="{
                        required: 'Kos saraan kesihatan adalah wajib',
                      }"
                    />
                  </div>
                </div>
              </div>

              <div class="flex justify-center mt-4">
                <rs-button
                  variant="secondary"
                  @click="addSchoolDependent"
                  type="button"
                >
                  <Icon name="mdi:plus" class="mr-1" size="1rem" />
                  Tambah Tanggungan
                </rs-button>
              </div>

              <div class="flex justify-between gap-3 mt-6">
                <rs-button
                  type="button"
                  variant="primary-outline"
                  @click="prevStep"
                  >Kembali</rs-button
                >
                <rs-button type="submit" variant="primary" @click="nextStep"
                  >Seterusnya ke Maklumat Waris</rs-button
                >
              </div>
            </div>

            <!-- Step 7: Maklumat Waris -->
            <div v-if="currentStep === 7">
              <h3 class="text-lg font-medium mb-4">G) Maklumat Waris</h3>

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
                  @click="prevStep"
                  >Kembali</rs-button
                >
                <rs-button type="submit" variant="primary" @click="nextStep"
                  >Seterusnya ke Pengesahan</rs-button
                >
              </div>
            </div>

            <!-- Step 8: Pengesahan -->
            <div v-if="currentStep === 8">
              <h3 class="text-lg font-medium mb-4">H) Pengesahan</h3>

              <!-- <div class="mb-6">
                <h4 class="font-medium mb-3">1. Bantuan Penolong Amil</h4>
                <div class="flex flex-col gap-2">
                  <label class="font-medium">Adakah anda dibantu oleh penolong Amil</label>
                  <FormKit
                    type="radio"
                    name="dibantu_penolong_amil"
                    :options="['Ya', 'Tidak']"
                    validation="required"
                    v-model="formData.verification.dibantuPenolongAmil"
                  />
                </div>

                <div v-if="formData.verification.dibantuPenolongAmil === 'Ya'" class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <FormKit
                    type="select"
                    name="nama_penolong_amil_bantuan"
                    label="Nama Penolong Amil"
                    validation="required"
                    :options="[
                      { label: 'Ahmad bin Abdullah', value: 'ahmad_abdullah' },
                      { label: 'Mohd Ali bin Hassan', value: 'mohd_ali_hassan' },
                      { label: 'Siti Aminah binti Omar', value: 'siti_aminah_omar' },
                      { label: 'Abdul Rahman bin Ismail', value: 'abdul_rahman_ismail' },
                      { label: 'Nor Azizah binti Yusof', value: 'nor_azizah_yusof' },
                      { label: 'Mohd Fadzil bin Ibrahim', value: 'mohd_fadzil_ibrahim' },
                      { label: 'Fatimah binti Ahmad', value: 'fatimah_ahmad' },
                      { label: 'Zulkifli bin Mohd', value: 'zulkifli_mohd' },
                      { label: 'Nurul Huda binti Kamal', value: 'nurul_huda_kamal' },
                      { label: 'Mohd Hafiz bin Abdullah', value: 'mohd_hafiz_abdullah' }
                    ]"
                    placeholder="Pilih nama penolong amil"
                    v-model="formData.verification.namaPenolongAmil"
                    :validation-messages="{
                      required: 'Nama penolong amil adalah wajib'
                    }"
                  />

                  <FormKit
                    type="select"
                    name="kariah_bantuan"
                    label="Kariah"
                    validation="required"
                    :options="kariahOptions"
                    v-model="formData.verification.kariahBantuan"
                  />

                  <FormKit
                    type="date"
                    name="tarikh_bantuan"
                    label="Tarikh Bantuan"
                    validation="required"
                    v-model="formData.verification.tarikhBantuan"
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
                  <!-- <rs-button type="button" variant="secondary" @click="handleSave"
                    >Simpan</rs-button
                  > -->
                  <rs-button type="button" variant="primary" @click="nextStep"
                    >Seterusnya ke Pengesahan Bermastautin</rs-button
                  >
                </div>
              </div>
            </div>

            <!-- Step 9: Maklumat Pengesah Bermastautin -->
            <div v-if="currentStep === 9">
              <h3 class="text-lg font-medium mb-4">I) Maklumat Pengesah Bermastautin</h3>
              <p class="text-sm text-gray-600 mb-4">
                *(Wakil Rakyat/Penghulu/Ketua Kampung/Ketua Penduduk/Nazir Masjid/Pengerusi Surau/Penolong Amil/Guru Pembimbing Asnaf Muallaf/Eksekutif LZS/Ketua Operasi Agihan Daerah LZS/Ketua Jabatan LZS/Pengurus LZS/Ketua Cawangan LZS.)
              </p>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- <FormKit
                  type="textarea"
                  name="ulasan_pengesahan"
                  label="Ulasan"
                  validation="required"
                  v-model="formData.verification.ulasanPengesahan"
                /> -->

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

            <!-- Step 10: Pegawai Pendaftar -->
            <div v-if="currentStep === 10">
              <h3 class="text-lg font-medium mb-4">J) Pegawai Pendaftar</h3>
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
                  <rs-button type="submit" variant="primary" @click="nextStep"
                    >Seterusnya ke Penilaian Awal</rs-button
                  >
                </div>
              </div>
            </div>

            <!-- Step 11: Penilaian Awal -->
            <div v-if="currentStep === 11">
              <h3 class="text-lg font-medium mb-4">K) Penilaian Awal</h3>
              <div class="space-y-6">
                <!-- Question 1 -->
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">
                    1. Adakah tuan/puan mempunyai komitmen dan pembiayaan melibatkan kos yang tinggi?*
                  </label>
                  <FormKit
                    type="radio"
                    v-model="formData.initialAssessment.komitmenTinggi"
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
                    v-model="formData.initialAssessment.keperluanMendesak"
                    :options="[
                      { label: 'Perubatan Kritikal', value: 'perubatan', disabled: isTidakMendesakSelected },
                      { label: 'Bencana', value: 'bencana', disabled: isTidakMendesakSelected },
                      { label: 'Kematian', value: 'kematian', disabled: isTidakMendesakSelected },
                      { label: 'Konflik Keluarga (tiada tempat bergantung)', value: 'konflik', disabled: isTidakMendesakSelected },
                      { label: 'Tiada Tempat Tinggal', value: 'tiadaRumah', disabled: isTidakMendesakSelected },
                      { label: 'Tunggakan Bil Utiliti', value: 'tunggakanUtiliti', disabled: isTidakMendesakSelected },
                      { label: 'Selain dari di atas', value: 'lain', disabled: isTidakMendesakSelected },
                      { label: 'Tidak mendesak', value: 'tidakMendesak' }
                    ]"
                    validation="required|min:1"
                    validation-label="Jawapan"
                    validation-messages="{
                      required: 'Sila pilih sekurang-kurangnya satu jawapan',
                      min: 'Sila pilih sekurang-kurangnya satu jawapan'
                    }"
                    @input="handleKeperluanChange"
                  />

                  <!-- Additional input for "Selain dari di atas" -->
                  <div v-if="showLainInput" class="mt-4">
                    <FormKit
                      type="text"
                      v-model="formData.initialAssessment.lainKeperluan"
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
                    v-model="formData.initialAssessment.documents"
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

                <div class="space-y-2">
                  <FormKit
                    type="textarea"
                    v-model="formData.initialAssessment.additionalNotes"
                    label="Catatan Tambahan"
                    placeholder="Sila masukkan sebarang catatan tambahan yang berkaitan dengan permohonan ini"
                    validation="required"
                    validation-label="Catatan tambahan"
                    validation-messages="{
                      required: 'Sila masukkan catatan tambahan'
                    }"
                  />
                </div>

                <div class="flex justify-between gap-3 mt-6">
                  <rs-button
                    type="button"
                    variant="primary-outline"
                    @click="prevStep"
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
            </div>
          </FormKit>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";

const toast = useToast();
const router = useRouter();

definePageMeta({
  title: "Isi Permohonan Ringkas",
});

const breadcrumb = ref([
  {
    name: "Borang Permohonan Perseorangan",
    type: "current",
    path: "/BF-PRF/AS/QS/02",
  },
]);

const currentStep = ref(1);
const totalStep = 11; // Update total steps from 10 to 11

// Form data structure
const formData = ref({
  personalInfo: {
    idValue: "",
    idNumber: "",
    idDocument: null, // Add this line
    name: "",
    islamName: "",
    phone: "",
    religion: "",
    otherIdNumber: "",
    passportStartDate: "",
    passportEndDate: "",
    bankName: "",
    bankAccount: "",
    bankAccountHolder: "",
    paymentMethod: "",
    cashPaymentReason: "",
    maritalStatus: "",
    healthStatus: "",
    islamDate: "",
    islamCertificate: null, // Add this line
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
    dependentsCount: "", // Add this line
  },
  healthInfo: {
    status: "",
    details: "",
    chronicIllnessDoc: null,
    disabilityDoc: null, // Add this line
    disasterDocument: null, // Add this line
  },
  spouseInfo: [
    {
      idType: "",
      idNumber: "",
      name: "",
      supportDoc: null,
      idDocument: null, // Add this line
    }
  ],
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
  schoolDependents: [],
  nonSchoolDependents: [],
  declaration: {
    hasLZSRelationship: "",
    staffName: "",
    staffPosition: "",
    staffOffice: "",
    relationship: "",
    date: "",
  },
  verification: {
    dibantuPenolongAmil: "",
    namaPenolongAmil: "",
    kariahBantuan: "",
    tarikhBantuan: "",
    hubunganKakitanganLZS: "",
    namaKakitangan: "",
    jawatanKakitangan: "",
    pejabatKakitangan: "",
    hubunganKakitangan: "",
    tarikhPerakuan: "",
    ulasanPengesahan: "",
    namaPengesah: "",
    jawatanPengesah: "",
    noTelefonPengesah: "",
    tarikhPengesahanPermastautin: "",
    dokumenPengesahanPermastautin: null
  },
  income: {
    familyHeadName: "",
    familyHeadIdNumber: "",
    employmentStatus: "",
    incomeSource: "",
    employmentSector: "",
    jobType: "",
    positionStatus: "",
    employerName: "",
    incomeAmount: "",
    declarationDate: "",
  },
  employmentInfo: {
    status: "",
    jobPosition: "",
    unemploymentReason: "",
    sector: "",
    sectorDetails: "",
    employerName: "",
    employerAddress: "",
    employerPhone: "",
    grossIncome: "",
    dependentsCount: ""
  },
  heirs: [],
  initialAssessment: {
    komitmenTinggi: '',
    keperluanMendesak: [],
    lainKeperluan: '',
    documents: [],
    additionalNotes: '',
  },
  registrationOfficer: {
    namaPegawai: "",
    jawatan: "",
    pejabat: "",
    tarikhPendaftaran: "",
    ulasan: "",
    dokumenPendaftaran: null
  },
});

const statusKahwin = ref(null);

// Options for select fields
const idTypeOptions = [
  { label: "Kad Pengenalan", value: "ic" },
  { label: "Foreign Id", value: "foreign-id" },
];

const maritalStatusOptions = [
  { label: "Bujang", value: "single" },
  { label: "Berkahwin", value: "married" },
  { label: "Duda", value: "widower" },
  { label: "Janda", value: "widow" },
  { label: "Bercerai", value: "divorced" },
];

const healthStatusOptions = [
  { label: "Sihat", value: "sihat" },
  { label: "Kurang Upaya", value: "disabled" },
  { label: "Sakit Kronik", value: "chronic-illness" },
];

const healthStatusOptionsExtended = [
  ...healthStatusOptions,
  { label: "OKU", value: "oku" },
  { label: "Warga Emas", value: "elderly" },
];

const residenceStatusOptions = [
  { label: "Milik Sendiri", value: "milik-sendiri" },
  { label: "Sewa", value: "sewa" },
  { label: "Tumpang", value: "tumpang" },
  { label: "Lain-lain", value: "lain-lain" },
];

const educationLevelOptions = [
  { label: "Sekolah", value: "sekolah" },
  { label: "Tidak Bersekolah", value: "tidak-bersekolah" },
  { label: "Bekerja", value: "bekerja" },
  { label: "Tidak Bekerja", value: "tidak-bekerja" },
  // Add more education levels as needed
];

const relationshipOptions = [
  { label: "Anak", value: "child" },
  { label: "Ibu Bapa", value: "parent" },
  { label: "Adik-beradik", value: "sibling" },
  { label: "Saudara-mara", value: "relative" },
  { label: "Lain-lain", value: "other" },
];

const incomeSourceOptions = [
  { label: "Gaji", value: "salary" },
  { label: "Bekerja Sendiri", value: "self-employed" },
  { label: "Pencen", value: "pension" },
  { label: "Bantuan Kerajaan", value: "government-aid" },
  { label: "Lain-lain", value: "other" },
];

const employmentSectorOptions = [
  { label: "Kerajaan", value: "government" },
  { label: "Swasta", value: "private" },
  { label: "Sendiri", value: "self-employed" },
];

const positionStatusOptions = [
  { label: "Tetap", value: "permanent" },
  { label: "Kontrak", value: "contract" },
  { label: "Sementara", value: "temporary" },
];

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
  { label: "Agrobank", value: "agrobank" },
];

const religionOptions = [
  { label: "Islam", value: "islam" },
  { label: "Kristian", value: "kristian" },
  { label: "Buddha", value: "buddha" },
  { label: "Hindu", value: "hindu" },
  { label: "Lain-lain", value: "lain" }
];

const wivesCountOptions = [
  { label: "2", value: 2 },
  { label: "3", value: 3 },
  { label: "4", value: 4 }
];

// Computed properties
const hasSpouse = computed(() => {
  return ["married", "widower", "widow"].includes(
    formData.value.personalInfo.maritalStatus
  );
});

const isMuallaf = computed(() => {
  // Logic to determine if applicant is muallaf
  // This might need to be adjusted based on your actual requirements
  return false;
});

const isTidakMendesakSelected = computed(() => {
  return formData.value.initialAssessment.keperluanMendesak.includes('tidakMendesak');
});

const showLainInput = computed(() => {
  return formData.value.initialAssessment.keperluanMendesak.includes('lain');
});

// Methods
const getPlaceholder = () => {
  switch (formData.value.personalInfo.idValue) {
    case "ic":
      return "Contoh: 901231025678";
    case "passport":
      return "Contoh: A12345678";
    case "birth-cert":
      return "Contoh: 12345678";
    default:
      return "";
  }
};

const addSchoolDependent = () => {
  formData.value.schoolDependents.push({
    kkid: "",
    newIC: "",
    otherID: "",
    name: "",
    relationship: "",
    age: "",
    status: "",
    supportDoc: null,
    livingCost: "",
    healthStatus: "",
    chronicDoc: null,
    disabilityDoc: null,
    healthCost: "",
    passportStartDate: "",
    passportEndDate: "",
    idDocument: null, // Add this line
  });
};

const removeSchoolDependent = (index) => {
  formData.value.schoolDependents.splice(index, 1);
};

const addNonSchoolDependent = () => {
  formData.value.nonSchoolDependents.push({
    name: "",
    idNumber: "",
    relationship: "",
    age: "",
    islamDate: "",
    healthStatus: "",
    livingWithFamily: "",
    notes: "",
  });
};

const removeNonSchoolDependent = (index) => {
  formData.value.nonSchoolDependents.splice(index, 1);
};

const addHeir = () => {
  formData.value.heirs.push({
    name: "",
    phone: "",
    relationship: "", // Add this line
  });
};

const removeHeir = (index) => {
  formData.value.heirs.splice(index, 1);
};

const addSpouse = () => {
  formData.value.spouseInfo.push({
    idType: "",
    idNumber: "",
    name: "",
    supportDoc: null,
    idDocument: null, // Add this line
  });
};

const removeSpouse = (index) => {
  formData.value.spouseInfo.splice(index, 1);
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

const prevStep = () => {
  currentStep.value--;
};

const nextStep = () => {
  currentStep.value++;
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

const handleKeperluanChange = (value) => {
  // If "Tidak mendesak" is selected, clear all other selections
  if (value.includes('tidakMendesak')) {
    formData.value.initialAssessment.keperluanMendesak = ['tidakMendesak'];
  }
  
  // If "Selain dari di atas" is unselected, clear the additional input
  if (!value.includes('lain')) {
    formData.value.initialAssessment.lainKeperluan = '';
  }
};

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
const kariahOptions = [
  { label: 'Masjid Negeri', value: 'masjid-negeri' },
  { label: 'Masjid Sultan Salahuddin Abdul Aziz Shah', value: 'masjid-sultan-salahuddin' },
  { label: 'Masjid Al-Azim Pandan Indah', value: 'masjid-al-azim' },
  { label: 'Masjid Al-Amin Bangi', value: 'masjid-al-amin' },
  // ... add more kariah as needed ...
];
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

// Watchers
watch(
  () => formData.value.personalInfo.maritalStatus,
  (newVal) => {
    if (!hasSpouse.value) {
      // Clear spouse info if no spouse
      formData.value.spouseInfo = [];
    }
  }
);

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

watch(
  () => formData.value.personalInfo.polygamyStatus,
  (newVal) => {
    if (newVal !== "ya") {
      formData.value.personalInfo.wivesCount = "";
      formData.value.personalInfo.wives = [];
    }
  }
);

watch(
  () => statusKahwin.value,
  (newVal) => {
    if (newVal !== "Berkahwin") {
      formData.value.spouseInfo = [];
    } else if (formData.value.spouseInfo.length === 0) {
      addSpouse();
    }
  }
);
</script>
