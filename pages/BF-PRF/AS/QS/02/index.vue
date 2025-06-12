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
                  name="idType"
                  label="Jenis ID"
                  validation="required"
                  :options="idTypeOptions"
                  placeholder="Pilih jenis ID"
                  v-model="formData.personalInfo.idType"
                  :validation-messages="{
                    required: 'Jenis ID adalah wajib',
                  }"
                />

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
                  type="text"
                  name="bankName"
                  label="Nama Bank"
                  validation="required"
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
                  type="date"
                  name="islamDate"
                  label="Tarikh Masuk Islam"
                  v-model="formData.personalInfo.islamDate"
                  :validation-messages="{
                    required: 'Tarikh masuk Islam adalah wajib',
                  }"
                />

                <FormKit
                  type="date"
                  name="kfamDate"
                  label="Tarikh Masuk KFAM"
                  v-model="formData.personalInfo.kfamDate"
                  :validation-messages="{
                    required: 'Tarikh masuk KFAM adalah wajib',
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
                  name="assistanceType"
                  label="Saluran Bantuan (jika login as kaunter, option yang akan dilihat hanya Bencana)"
                  validation="required"
                  :options="[
                    { label: 'Bencana', value: 'bencana' },
                    { label: 'Tunai Kaunter(Express)', value: 'express' },
                    { label: 'Tunai Lapangan)', value: 'lapangan' },
                  ]"
                  placeholder="Pilih bantuan"
                  v-model="formData.personalInfo.assistanceType"
                  :validation-messages="{ 
                    required: 'Jenis bantuan adalah wajib'
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
              <h3 class="text-lg font-medium mb-4">C) Maklumat Pasangan</h3>

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

              <div
                v-if="statusKahwin == 'Berkahwin'"
                class="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <FormKit
                  type="select"
                  name="spouseIdType"
                  label="Jenis ID Pasangan"
                  validation="required"
                  :options="idTypeOptions"
                  placeholder="Pilih jenis ID"
                  v-model="formData.spouseInfo.idType"
                  :validation-messages="{
                    required: 'Jenis ID adalah wajib',
                  }"
                />

                <FormKit
                  type="text"
                  name="spouseIdNumber"
                  label="Nombor ID Pasangan"
                  validation="required"
                  v-model="formData.spouseInfo.idNumber"
                  :validation-messages="{
                    required: 'Nombor ID adalah wajib',
                  }"
                />

                <FormKit
                  type="text"
                  name="spouseName"
                  label="Nama Pasangan"
                  validation="required"
                  v-model="formData.spouseInfo.name"
                  :validation-messages="{
                    required: 'Nama adalah wajib',
                  }"
                />
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
                  type="text"
                  name="district"
                  label="Daerah"
                  validation="required"
                  v-model="formData.addressInfo.district"
                  :validation-messages="{
                    required: 'Daerah adalah wajib',
                  }"
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
                  type="text"
                  name="kariah"
                  label="Kariah"
                  validation="required"
                  v-model="formData.addressInfo.kariah"
                  :validation-messages="{
                    required: 'Kariah adalah wajib',
                  }"
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
                  type="select"
                  name="state"
                  label="Negeri"
                  validation="required"
                  :options="[
                    { label: 'Selangor', value: 'selangor' },
                    { label: 'Kuala Lumpur', value: 'kl' },
                    { label: 'Putrajaya', value: 'putrajaya' },
                    { label: 'Negeri Sembilan', value: 'ns' },
                    { label: 'Melaka', value: 'melaka' },
                    { label: 'Johor', value: 'johor' },
                    { label: 'Pahang', value: 'pahang' },
                    { label: 'Terengganu', value: 'terengganu' },
                    { label: 'Kelantan', value: 'kelantan' },
                    { label: 'Perak', value: 'perak' },
                    { label: 'Perlis', value: 'perlis' },
                    { label: 'Kedah', value: 'kedah' },
                    { label: 'Pulau Pinang', value: 'penang' },
                    { label: 'Sabah', value: 'sabah' },
                    { label: 'Sarawak', value: 'sarawak' },
                    { label: 'Labuan', value: 'labuan' }
                  ]"
                  placeholder="Pilih negeri"
                  v-model="formData.addressInfo.state"
                  :validation-messages="{
                    required: 'Negeri adalah wajib'
                  }"
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

                <FormKit
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
                    v-model="dependent.kkid"
                    :validation-messages="{
                      required: 'KKID adalah wajib',
                    }"
                  />

                  <FormKit
                    type="text"
                    :name="`dependent${index}NewIC`"
                    label="No Kad Pengenalan (baru) / Foreign ID"
                    validation="required"
                    v-model="dependent.newIC"
                    :validation-messages="{
                      required: 'No Kad Pengenalan adalah wajib',
                    }"
                  />

                  <FormKit
                    type="text"
                    :name="`dependent${index}OtherID`"
                    label="No Polis/No Tentera/No Pasport/No Sijil Lahir"
                    validation="required"
                    v-model="dependent.otherID"
                    :validation-messages="{
                      required: 'No ID adalah wajib',
                    }"
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

              <div class="mb-6">
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
                    type="text"
                    name="nama_penolong_amil_bantuan"
                    label="Nama Penolong Amil"
                    validation="required"
                    v-model="formData.verification.namaPenolongAmil"
                  />
                  <FormKit
                    type="text"
                    name="kariah_bantuan"
                    label="Kariah"
                    validation="required"
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
                <rs-button type="submit" variant="primary" @click="nextStep"
                  >Seterusnya ke Maklumat Pengesah Bermastautin</rs-button
                >
              </div>
            </div>

            <!-- Step 9: Maklumat Pengesah Bermastautin -->
            <div v-if="currentStep === 9">
              <h3 class="text-lg font-medium mb-4">I) Maklumat Pengesah Bermastautin</h3>
              <p class="text-sm text-gray-600 mb-4">
                *(Wakil Rakyat/Penghulu/Ketua Kampung/Ketua Penduduk/Nazir Masjid/Pengerusi Surau/Penolong Amil/Guru Pembimbing Asnaf Muallaf/Eksekutif LZS/Ketua Operasi Agihan Daerah LZS/Ketua Jabatan LZS/Pengurus LZS/Ketua Cawangan LZS.)
              </p>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormKit
                  type="textarea"
                  name="ulasan_pengesahan"
                  label="Ulasan"
                  validation="required"
                  v-model="formData.verification.ulasanPengesahan"
                />

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
          </FormKit>
        </div>
      </template></rs-card
    >
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
    name: "Profiling",
    type: "link",
    path: "/dashboard",
  },
  {
    name: "Borang Permohonan",
    type: "current",
    path: "/BF-PRF/AS/QS/02",
  },
]);

const currentStep = ref(1);
const totalStep = 9;

// Form data structure
const formData = ref({
  personalInfo: {
    idType: "",
    idNumber: "",
    name: "",
    phone: "",
    bankName: "",
    bankAccount: "",
    paymentMethod: "",
    cashPaymentReason: "",
    maritalStatus: "",
    healthStatus: "",
    islamDate: "",
    kfamDate: "",
    email: "",
    citizenship: "",
    dateOfBirth: "",
    gender: "",
    assistanceType: "",
    polygamyStatus: "",
  },
  healthInfo: {
    status: "",
    details: "",
    chronicIllnessDoc: null,
    disabilityDoc: null
  },
  spouseInfo: {
    idType: "",
    idNumber: "",
    name: "",
    phone: "",
    bankName: "",
    bankAccount: "",
    healthStatus: "",
    islamDate: "",
    kfamDate: "",
  },
  addressInfo: {
    address: "",
    district: "",
    postcode: "",
    kariah: "",
    state: "",
    residenceYears: "",
    residenceStatus: "",
    paymentStatus: "",
    monthlyPayment: "",
    rentAmount: "",
    otherResidenceDetail: "",
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
    tarikhPengesahanPermastautin: ""
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
});

const statusKahwin = ref(null);

// Options for select fields
const idTypeOptions = [
  { label: "Kad Pengenalan", value: "ic" },
  { label: "Pasport", value: "passport" },
  { label: "Sijil Lahir", value: "birth-cert" },
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

// Methods
const getPlaceholder = () => {
  switch (formData.value.personalInfo.idType) {
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
    healthCost: ""
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
  });
};

const removeHeir = (index) => {
  formData.value.heirs.splice(index, 1);
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

// Watchers
watch(
  () => formData.value.personalInfo.maritalStatus,
  (newVal) => {
    if (!hasSpouse.value) {
      // Clear spouse info if no spouse
      formData.value.spouseInfo = {
        idType: "",
        idNumber: "",
        name: "",
        phone: "",
        bankName: "",
        bankAccount: "",
        healthStatus: "",
        islamDate: "",
        kfamDate: "",
      };
    }
  }
);
</script>
