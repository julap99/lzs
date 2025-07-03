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
            <h2 class="text-xl font-semibold">Isi Borang Permohonan Online</h2>
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
              class="text-center flex-1 relative group"
              :class="{ 'font-semibold': currentStep >= step.id }"
            >
              <span 
                class="cursor-default"
                :title="step.tooltip"
              >
                {{ step.label }}
              </span>
              <!-- Tooltip for Bermastautin tab -->
              <div 
                v-if="step.tooltip"
                class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10"
                style="max-width: 400px;"
              >
                <span class="italic">{{ step.tooltip }}</span>
                <!-- Tooltip arrow -->
                <div class="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
              </div>
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
            <!-- Step 1: Penilaian Awal -->
            <div v-if="currentStep === 1">
              <h3 class="text-lg font-medium mb-4">I) Penilaian Awal</h3>
              <div class="space-y-6">
                <!-- Question 1 -->
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">
                    1. Adakah tuan/puan mempunyai komitmen dan pembiayaan melibatkan kos yang tinggi?*
                  </label>
                  <FormKit
                    type="radio"
                    v-model="formData.penilaianAwal.komitmenTinggi"
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
                    v-model="formData.penilaianAwal.keperluanMendesak"
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
                      v-model="formData.penilaianAwal.lainKeperluan"
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
                    v-model="formData.penilaianAwal.documents"
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
                    v-model="formData.penilaianAwal.additionalNotes"
                    label="Catatan Tambahan"
                    placeholder="Sila masukkan sebarang catatan tambahan yang berkaitan dengan permohonan ini"
                    validation-label="Catatan tambahan"
                    validation-messages="{
                      required: 'Sila masukkan catatan tambahan'
                    }"
                  />
                </div>
              </div>

              <div class="flex justify-between gap-3 mt-6">
                <!-- <rs-button
                  type="button"
                  variant="primary-outline"
                  @click="goBack"
                  >Kembali</rs-button
                > -->
                <div class="flex gap-3">
                  <rs-button 
                    type="button" 
                    variant="secondary" 
                    @click="handleSaveStep1"
                  >
                    Simpan
                  </rs-button>
                  <rs-button type="submit" variant="primary" @click="nextStep"
                    >Seterusnya ke Maklumat Peribadi</rs-button
                  >
                </div>
              </div>
            </div>

            <!-- Step 2: Maklumat Peribadi Asnaf -->
            <div v-if="currentStep === 2">
              <h3 class="text-lg font-medium mb-4">II) Maklumat Peribadi Asnaf</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Location Information Section - Moved to top -->
                <!-- <div class="md:col-span-2">
                  <h4 class="text-md font-medium mb-3">Maklumat Bencana</h4>
                </div>
                <div class="flex gap-2">
                  <FormKit
                    v-model="formData.personalInfo.location"
                    label="Lokasi"
                    type="text"
                    validation="required"
                    validation-visibility="dirty"
                    class="flex-1"
                    placeholder="Masukkan lokasi"
                  />
                  <rs-button
                    type="button"
                    variant="primary-outline"
                    @click="getLocation('personalInfo')"
                    class="whitespace-nowrap mt-7"
                  >
                    <i class="fas fa-location-dot mr-2"></i>
                    Dapatkan Lokasi
                  </rs-button>
                </div>

                <FormKit
                  type="select"
                  name="healthStatus"
                  label="Senarai Bencana"
                  validation="required"
                  :options="disasterListOptions"
                  placeholder="Pilih senarai bencana"
                  v-model="formData.healthInfo.status"
                  :validation-messages="{
                    required: 'senarai bencana adalah wajib'
                  }"
                />

                <div v-if="formData.healthInfo.status && formData.healthInfo.status !== 'tiada'" class="md:col-span-2">
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

                <div v-if="formData.healthInfo.status === 'tiada'" class="md:col-span-2">
                  <FormKit
                    type="textarea"
                    name="noDisasterNotes"
                    label="Catatan"
                    placeholder="Sila nyatakan sebab mengapa tiada bencana"
                    v-model="formData.healthInfo.noDisasterNotes"
                    validation="required"
                    :validation-messages="{
                      required: 'Catatan adalah wajib'
                    }"
                  />
                </div>

                <div v-if="formData.healthInfo.status === 'tiada'" class="md:col-span-2">
                  <FormKit
                    type="file"
                    name="noDisasterDocument"
                    label="Upload Dokumen Report Polis"
                    accept=".pdf,.jpg,.jpeg,.png"
                    v-model="formData.healthInfo.noDisasterDocument"
                    help="Format yang dibenarkan: PDF, JPG, PNG. Saiz maksimum: 5MB"
                    validation="required"
                    :validation-messages="{
                      required: 'Dokumen sokongan adalah wajib'
                    }"
                  />
                </div> -->

                <!-- Disaster Location (Conditional) -->
                <!-- <div v-if="formData.healthInfo.status && formData.healthInfo.status !== 'tiada'" class="md:col-span-2">
                  <div class="flex gap-2">
                    <FormKit
                      v-model="formData.personalInfo.disasterLocation"
                      label="Lokasi Bencana"
                      type="text"
                      validation="required"
                      validation-visibility="dirty"
                      class="flex-1"
                      placeholder="Masukkan lokasi bencana"
                    />
                    <rs-button
                      type="button"
                      variant="primary-outline"
                      @click="getLocation('personalInfo')"
                      class="whitespace-nowrap mt-7"
                    >
                      <i class="fas fa-location-dot mr-2"></i>
                      Dapatkan Lokasi
                    </rs-button>
                  </div>
                </div> -->

                <div class="md:col-span-2">
                  <h4 class="text-md font-medium mb-3">Maklumat Peribadi</h4>
                </div>

                <FormKit
                  type="select"
                  name="idValue"
                  label="Jenis ID"
                  placeholder="Pilih jenis ID"
                  validation="required"
                  :options="idTypeOptions"
                  v-model="formData.personalInfo.idValue"
                  :validation-messages="{
                    required: 'Jenis ID adalah wajib',
                  }"
                />

                  <FormKit
                    v-if="formData.personalInfo.idValue"
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
                  name="gender"
                  label="Jantina"
                  validation="required"
                  :options="genderOptions"
                  placeholder="Pilih jantina"
                  v-model="formData.personalInfo.gender"
                  :validation-messages="{
                    required: 'Jantina adalah wajib'
                  }"
                />

                <FormKit
                  type="select"
                  name="citizenship"
                  label="Warganegara"
                  validation="required"
                  :options="citizenshipOptions"
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
                  :options="maritalStatusOptions"
                  placeholder="Pilih status perkahwinan"
                  v-model="formData.personalInfo.maritalStatus"
                  :validation-messages="{
                    required: 'Status perkahwinan adalah wajib'
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

                <!-- Spouse/Family Member Information (Conditional) -->
                <div v-if="formData.personalInfo.maritalStatus === 'berkahwin'" class="md:col-span-2">
                  <div class="flex justify-between items-center mb-3">
                    <h4 class="text-md font-medium">Maklumat Pasangan/Ahli Keluarga</h4>
                    <rs-button type="button" variant="primary-outline" @click="addSpouse" class="text-sm">
                      <i class="fas fa-plus mr-2"></i>Tambah
                    </rs-button>
                  </div>
                </div>

                <!-- Spouse/Family Member Entries -->
                <div v-if="formData.personalInfo.maritalStatus === 'berkahwin'" class="md:col-span-2">
                  <div v-for="(spouse, index) in formData.personalInfo.spouses" :key="index" class="border rounded-lg p-4 mb-4 bg-gray-50">
                    <div class="flex justify-between items-center mb-3">
                      <h5 class="font-medium text-gray-700">Ahli Keluarga #{{ index + 1 }}</h5>
                      <rs-button type="button" variant="danger-outline" @click="removeSpouse(index)" class="text-sm" size="sm">
                        <i class="fas fa-trash mr-1"></i>Padam
                      </rs-button>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormKit
                        type="select"
                        :name="`relationship_${index}`"
                        label="Hubungan"
                        validation="required"
                        :options="relationshipOptions"
                        placeholder="Pilih hubungan"
                        v-model="spouse.relationship"
                        :validation-messages="{
                          required: 'Hubungan adalah wajib'
                        }"
                      />

                      <FormKit
                        type="select"
                        :name="`spouseIdType_${index}`"
                        label="Jenis ID"
                        placeholder="Pilih jenis ID"
                        validation="required"
                        :options="idTypeOptions"
                        v-model="spouse.spouseIdType"
                        :validation-messages="{
                          required: 'Jenis ID adalah wajib'
                        }"
                      />

                      <FormKit
                        type="text"
                        :name="`spouseIdNumber_${index}`"
                        label="No ID"
                        validation="required"
                        v-model="spouse.spouseIdNumber"
                        :validation-messages="{
                          required: 'No ID adalah wajib'
                        }"
                        :placeholder="getSpousePlaceholder(index)"
                      />

                      <FormKit
                        type="text"
                        :name="`spouseName_${index}`"
                        label="Nama"
                        validation="required"
                        v-model="spouse.spouseName"
                        :validation-messages="{
                          required: 'Nama adalah wajib'
                        }"
                      />

                      <div v-if="spouse.spouseIdType" class="md:col-span-2">
                        <FormKit
                          type="file"
                          :name="`spouseIdDocument_${index}`"
                          :label="getSpouseDocumentLabel(index)"
                          accept=".pdf,.jpg,.jpeg,.png"
                          v-model="spouse.spouseIdDocument"
                          help="Format yang dibenarkan: PDF, JPG, PNG. Saiz maksimum: 5MB (Tidak wajib)"
                        />
                      </div>
                    </div>
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
                  :options="paymentMethodOptions"
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
                    :options="noPaymentReasonOptions"
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

              <div class="flex justify-between gap-3 mt-6">
                <rs-button
                  type="button"
                  variant="primary-outline"
                  @click="goBack"
                  >Kembali</rs-button
                >
                <div class="flex gap-3">
                  <rs-button 
                    type="button" 
                    variant="secondary" 
                    @click="handleSaveStep2"
                  >
                    Simpan
                  </rs-button>
                  <rs-button type="submit" variant="primary" @click="nextStep"
                    >Seterusnya ke Alamat</rs-button
                  >
                </div>
              </div>
            </div>

            <!-- Step 3: Maklumat Alamat -->
            <div v-if="currentStep === 3">
              <h3 class="text-lg font-medium mb-4">III) Maklumat Alamat</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Fixed Address Fields -->
                <div class="md:col-span-2">
                  <h4 class="text-md font-medium mb-3">Alamat Terkini</h4>
                </div>

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
                    :options="paymentStatusOptions"
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
                  label="Muat naik dokumen sokongan sokongan"
                  accept=".pdf,.jpg,.jpeg,.png"
                  v-model="formData.addressInfo.addressSupportDoc"
                  help="Format yang dibenarkan: PDF, JPG, PNG. Saiz maksimum: 5MB"
                  mul
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
                    @click="getLocation('addressInfo')"
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
                <div class="flex gap-3">
                  <rs-button 
                    type="button" 
                    variant="secondary" 
                    @click="handleSaveStep3"
                  >
                    Simpan
                  </rs-button>
                  <rs-button type="submit" variant="primary" @click="nextStep"
                    >Seterusnya ke Pengesahan</rs-button
                  >
                </div>
              </div>
            </div>

            <!-- Step 4: Pengesahan -->
            <div v-if="currentStep === 4">
              <h3 class="text-lg font-medium mb-4">IV) Pengesahan</h3>

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
                    type="select"
                    name="selected_kariah"
                    label="Pilih Kariah"
                    validation="required"
                    :options="kariahOptions"
                    placeholder="Pilih Kariah"
                    v-model="formData.verification.selectedKariah"
                    :validation-messages="{
                      required: 'Kariah adalah wajib'
                    }"
                  />

                  <FormKit
                    type="select"
                    name="selected_pak_officer"
                    label="Pilih Nama Pegawai PAK"
                    validation="required"
                    :options="pakOfficersOptions"
                    placeholder="Pilih Pegawai PAK"
                    v-model="formData.verification.selectedPakOfficer"
                    :validation-messages="{
                      required: 'Pegawai PAK adalah wajib'
                    }"
                    :disabled="!formData.verification.selectedKariah"
                  />
                </div>

                <div class="flex flex-col gap-2 mt-6">
                  <label class="font-medium">Adakah PAK membantu semasa pengisian borang permohonan ini?</label>
                  <FormKit
                    type="radio"
                    name="pak_assistance"
                    :options="['Ya', 'Tidak']"
                    validation="required"
                    v-model="formData.verification.pakAssistance"
                  />
                </div>

                <div v-if="formData.verification.pakAssistance === 'Ya'" class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <FormKit
                    type="select"
                    name="selected_kariah_assistance"
                    label="Pilih Kariah"
                    validation="required"
                    :options="kariahOptions"
                    placeholder="Pilih Kariah"
                    v-model="formData.verification.selectedKariahAssistance"
                    :validation-messages="{
                      required: 'Kariah adalah wajib'
                    }"
                  />

                  <FormKit
                    type="select"
                    name="selected_pak_officer_assistance"
                    label="Pilih Nama Pegawai PAK"
                    validation="required"
                    :options="pakOfficersOptionsAssistance"
                    placeholder="Pilih Pegawai PAK"
                    v-model="formData.verification.selectedPakOfficerAssistance"
                    :validation-messages="{
                      required: 'Pegawai PAK adalah wajib'
                    }"
                    :disabled="!formData.verification.selectedKariahAssistance"
                  />
                </div>

                <div class="flex flex-col gap-2 mt-6">
                  <label class="font-medium">Hubungan kekeluargaan dengan PAK?</label>
                  <FormKit
                    type="radio"
                    name="hubungan_pak"
                    :options="['Ya', 'Tidak']"
                    validation="required"
                    v-model="formData.verification.hubunganPAK"
                  />
                </div>

                <div v-if="formData.verification.hubunganPAK === 'Ya'" class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <FormKit
                    type="select"
                    name="selected_kariah_pak"
                    label="Pilih Kariah"
                    validation="required"
                    :options="kariahOptions"
                    placeholder="Pilih Kariah"
                    v-model="formData.verification.selectedKariahPAK"
                    :validation-messages="{
                      required: 'Kariah adalah wajib'
                    }"
                  />

                  <FormKit
                    type="select"
                    name="selected_pak_officer_pak"
                    label="Pilih Nama Pegawai PAK"
                    validation="required"
                    :options="pakOfficersOptionsPAK"
                    placeholder="Pilih Pegawai PAK"
                    v-model="formData.verification.selectedPakOfficerPAK"
                    :validation-messages="{
                      required: 'Pegawai PAK adalah wajib'
                    }"
                    :disabled="!formData.verification.selectedKariahPAK"
                  />
                </div>
              </div>

              <!-- PDPA Statement -->
              <div class="mb-6">
                <h4 class="font-medium mb-3">Pengesahan PDPA (Akta Perlindungan Data Peribadi)</h4>
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
                      v-model="formData.verification.pdpaConsent"
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
                  @click="prevStep"
                  >Kembali</rs-button
                >
                <div class="flex gap-3">
                  <rs-button 
                    type="button" 
                    variant="secondary" 
                    @click="handleSaveStep4"
                  >
                    Simpan
                  </rs-button>
                  <rs-button type="submit" variant="primary" @click="nextStep"
                    >Seterusnya ke Pegawai Pendaftar</rs-button
                  >
                </div>
              </div>
            </div>

            <!-- Step 5: Maklumat Pengesah Bermastautin -->
            <div v-if="currentStep === 5">
              <h3 class="text-lg font-medium mb-4">V) Maklumat Pengesah Bermastautin</h3>
              <!-- <p class="text-sm text-gray-600 mb-4">
                *(Wakil Rakyat/Penghulu/Ketua Kampung/Ketua Penduduk/Nazir Masjid/Pengerusi Surau/Penolong Amil/Guru Pembimbing Asnaf Muallaf/Eksekutif LZS/Ketua Operasi Agihan Daerah LZS/Ketua Jabatan LZS/Pengurus LZS/Ketua Cawangan LZS.)
              </p> -->

              <!-- PAK Officer Information (Readonly) -->
              <div class="mb-6">
                <h4 class="font-medium mb-3">Maklumat Pegawai PAK yang Mengesahkan</h4>
                <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Kariah</label>
                      <div class="text-sm text-gray-900 bg-white px-3 py-2 border border-gray-300 rounded">
                        {{ getKariahLabel(formData.verification.selectedKariah) || 'Belum dipilih' }}
                      </div>
                    </div>
                    
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Nama Pegawai PAK</label>
                      <div class="text-sm text-gray-900 bg-white px-3 py-2 border border-gray-300 rounded">
                        {{ getPakOfficerLabel(formData.verification.selectedPakOfficer) || 'Belum dipilih' }}
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
                  v-model="formData.verification.namaPengesah"
                  disabled
                />

                <FormKit
                  type="text"
                  name="jawatan_pengesah"
                  label="Jawatan"
                  validation="required"
                  v-model="formData.verification.jawatanPengesah"
                  disabled
                />

                <FormKit
                  type="text"
                  name="no_telefon_pengesah"
                  label="No Telefon"
                  validation="required"
                  v-model="formData.verification.noTelefonPengesah"
                  disabled
                />

                <FormKit
                  type="date"
                  name="tarikh_pengesahan_permastautin"
                  label="Tarikh Pengesahan"
                  validation="required"
                  v-model="formData.verification.tarikhPengesahanPermastautin"
                  disabled
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
                <div class="flex gap-3">
                  <rs-button 
                    type="button" 
                    variant="secondary" 
                    @click="handleSaveStep5"
                  >
                    Simpan
                  </rs-button>
                  <rs-button type="submit" variant="primary" @click="nextStep"
                    >Seterusnya ke Pegawai Pendaftar</rs-button
                  >
                </div>
              </div>
            </div>

            <!-- Step 6: Pegawai Pendaftar -->
            <div v-if="currentStep === 6">
              <h3 class="text-lg font-medium mb-4">VI) Maklumat Pegawai Pendaftar</h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormKit
                  type="text"
                  name="nama_pegawai_pendaftar"
                  label="Nama"
                  value="Ahmad bin Abi"
                  validation="required"
                  v-model="formData.pegawaiPendaftar.nama"
                  disabled
                />

                <FormKit
                  type="text"
                  name="jenis_permohonan"
                  label="Jenis Permohonan"
                  value="Baru"
                  validation="required"
                  v-model="formData.pegawaiPendaftar.jenisPermohonan"
                  disabled
                />

                <FormKit
                  type="text"
                  name="kategori"
                  label="Kategori"
                  value="kaunter"
                  v-model="formData.pegawaiPendaftar.kategori"
                  disabled
                />

                <FormKit
                  type="date"
                  name="tarikh_proses"
                  label="Tarikh Proses"
                  validation="required"
                  :value="new Date().toISOString().split('T')[0]"
                  v-model="formData.pegawaiPendaftar.tarikhProses"
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
                <div class="flex gap-3">
                  <rs-button 
                    type="button" 
                    variant="secondary" 
                    @click="handleSaveStep6"
                  >
                    Simpan
                  </rs-button>
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
import { ref, computed, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";

// Page Meta
definePageMeta({ title: "Isi Permohonan Ringkas" });

// Composables
const toast = useToast();
const router = useRouter();

// Fix scrolling issue after navigation
onMounted(() => {
  // Force scroll to top and re-enable scrolling
  window.scrollTo(0, 0);
  document.body.style.overflow = 'auto';
  document.documentElement.style.overflow = 'auto';
  
  // Additional fix for some browsers
  setTimeout(() => {
    window.scrollTo(0, 0);
  }, 100);
});

// Reactive State
const currentStep = ref(1);
const totalStep = 6;

const breadcrumb = ref([{
  name: "Borang Permohonan Perseorangan",
  type: "current",
  path: "/BF-PRF/AS/QS/02",
}]);

const steps = [
  { id: 1, label: "Penilaian Awal" },
  { id: 2, label: "Peribadi" },
  { id: 3, label: "Alamat" },
  { id: 4, label: "Pengesahan" },
  { id: 5, label: "Bermastautin", tooltip: "*(Wakil Rakyat/Penghulu/Ketua Kampung/Ketua Penduduk/Nazir Masjid/Pengerusi Surau/Penolong Amil/Guru Pembimbing Asnaf Muallaf/Eksekutif LZS/Ketua Operasi Agihan Daerah LZS/Ketua Jabatan LZS/Pengurus LZS/Ketua Cawangan LZS.)" },
  { id: 6, label: "Pegawai Pendaftar" }
];

// Form Data
const formData = ref({
  penilaianAwal: {
    komitmenTinggi: '',
    keperluanMendesak: [],
    lainKeperluan: '',
    documents: [],
    additionalNotes: '',
  },
  personalInfo: {
    idValue: "", idNumber: "", idDocument: null, name: "", islamName: "", phone: "", religion: "",
    bankName: "", bankAccount: "", bankAccountHolder: "", swiftCode: "", paymentMethod: "", noPaymentReason: [],
    maritalStatus: "", healthStatus: "", islamDate: "", islamCertificate: null, kfamDate: "", email: "",
    citizenship: "", dateOfBirth: "", gender: "", assistanceType: "", disasterLocation: "", polygamyStatus: "",
    wivesCount: "", wives: [], dependentsCount: "", grossIncome: "", incomeDocument: null, location: "",
    // Spouse/Family member fields - now as array
    spouses: [],
  },
  healthInfo: {
    status: "", details: "", chronicIllnessDoc: null, disabilityDoc: null, disasterDocument: null,
    noDisasterNotes: "", noDisasterDocument: null,
  },
  addressInfo: {
    alamat1: "", alamat2: "", alamat3: "", district: "", postcode: "", kariah: "", state: "Selangor", residenceYears: "",
    residenceStatus: "", paymentStatus: "", monthlyPayment: "", rentAmount: "", otherResidenceDetail: "",
    addressSupportDoc: null, location: ""
  },
  verification: {
    hubunganKakitanganLZS: "", namaKakitangan: "", jawatanKakitangan: "", pejabatKakitangan: "",
    hubunganKakitangan: "", tarikhPerakuan: "", namaPengesah: "Ustaz Ahmad bin Abdullah", jawatanPengesah: "Pegawai PAK", noTelefonPengesah: "012-3456789",
    tarikhPengesahanPermastautin: "2024-01-15", dokumenPengesahanPermastautin: {
      name: "pengesahan_bermastautin_ahmad_bin_ali.pdf",
      size: 2048576,
      lastModified: new Date('2024-01-15').getTime(),
      type: "application/pdf"
    }, pdpaConsent: false,
    selectedKariah: "masjid-negeri", selectedPakOfficer: "ustaz-ahmad-abdullah",
    // New PAK relationship fields
    hubunganPAK: "", selectedKariahPAK: "", selectedPakOfficerPAK: "",
    pakAssistance: "", selectedKariahAssistance: "", selectedPakOfficerAssistance: ""
  },
  pegawaiPendaftar: {
    nama: "Ahmad bin Abi",
    jenisPermohonan: "Baru",
    kategori: "kaunter",
    tarikhProses: new Date().toISOString().split('T')[0]
  },
});

// Options Arrays
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

const idTypeOptions = [
  { label: 'Kad Pengenalan', value: 'ic' },
  { label: 'Foreign ID', value: 'foreign-id' },
  { label: 'No Polis', value: 'polis' },
  { label: 'No Tentera', value: 'tentera' },
  { label: 'No Sijil Lahir', value: 'sijil-lahir' }
];

const genderOptions = [
  { label: 'Lelaki', value: 'L' },
  { label: 'Perempuan', value: 'P' }
];

const citizenshipOptions = [
  { label: 'Warganegara', value: 'warganegara' },
  { label: 'Bukan Warganegara', value: 'bukan-warganegara' }
];

const religionOptions = [
  { label: "Islam", value: "islam" },
  { label: "Kristian", value: "kristian" },
  { label: "Buddha", value: "buddha" },
  { label: "Hindu", value: "hindu" },
  { label: "Lain-lain", value: "lain" }
];

const maritalStatusOptions = [
  { label: 'Bujang', value: 'bujang' },
  { label: 'Berkahwin', value: 'berkahwin' },
  { label: 'Bercerai', value: 'bercerai' },
  { label: 'Duda', value: 'duda' },
  { label: 'Janda', value: 'janda' }
];

const yesNoOptions = [
  { label: 'Tidak', value: 'tidak' },
  { label: 'Ya', value: 'ya' }
];

const wivesCountOptions = [
  { label: "2", value: 2 },
  { label: "3", value: 3 },
  { label: "4", value: 4 }
];

const paymentMethodOptions = [
  { label: 'Akaun', value: 'akaun' },
  { label: 'Tiada', value: 'tiada' }
];

const noPaymentReasonOptions = [
  { label: 'Muflis', value: 'muflis' },
  { label: 'Bukan Warganegara', value: 'bukan-warganegara' }
];

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
  { label: 'Masjid Sultan Salahuddin', value: 'masjid-sultan-salahuddin' },
  { label: 'Masjid Al-Azim', value: 'masjid-al-azim' },
  { label: 'Masjid Al-Amin', value: 'masjid-al-amin' }
];

const residenceStatusOptions = [
  { label: "Milik Sendiri", value: "milik-sendiri" },
  { label: "Sewa", value: "sewa" },
  { label: "Tumpang", value: "tumpang" },
  { label: "Lain-lain", value: "lain-lain" },
];

const paymentStatusOptions = [
  { label: 'Berbayar', value: 'berbayar' },
  { label: 'Tidak Berbayar', value: 'tidak-berbayar' },
];

const relationshipOptions = [
  { label: 'Pasangan', value: 'pasangan' },
  { label: 'Anak', value: 'anak' },
  { label: 'Ibubapa', value: 'ibubapa' },
  { label: 'Adikberadik', value: 'adikberadik' },
  { label: 'Lain-lain', value: 'lain-lain' }
];



// PAK Officers by Kariah
const pakOfficersByKariah = {
  'masjid-negeri': [
    { label: 'Ustaz Ahmad bin Abdullah', value: 'ustaz-ahmad-abdullah' },
    { label: 'Ustazah Siti binti Mohamed', value: 'ustazah-siti-mohamed' },
    { label: 'Ustaz Mohd bin Hassan', value: 'ustaz-mohd-hassan' }
  ],
  'masjid-sultan-salahuddin': [
    { label: 'Ustaz Ismail bin Omar', value: 'ustaz-ismail-omar' },
    { label: 'Ustazah Fatimah binti Ali', value: 'ustazah-fatimah-ali' },
    { label: 'Ustaz Kamal bin Ibrahim', value: 'ustaz-kamal-ibrahim' }
  ],
  'masjid-al-azim': [
    { label: 'Ustaz Rahman bin Sulaiman', value: 'ustaz-rahman-sulaiman' },
    { label: 'Ustazah Aminah binti Yusof', value: 'ustazah-aminah-yusof' },
    { label: 'Ustaz Zulkifli bin Ahmad', value: 'ustaz-zulkifli-ahmad' }
  ],
  'masjid-al-amin': [
    { label: 'Ustaz Aziz bin Mohamed', value: 'ustaz-aziz-mohamed' },
    { label: 'Ustazah Nor binti Hassan', value: 'ustazah-nor-hassan' },
    { label: 'Ustaz Hamid bin Abdullah', value: 'ustaz-hamid-abdullah' }
  ]
};

// Computed Properties
const selectedBankSwiftCode = computed(() => {
  const selectedBank = bankOptions.find(bank => bank.value === formData.value.personalInfo.bankName);
  return selectedBank ? selectedBank.swiftCode : '';
});

const disasterListOptions = computed(() => {
  return [
    { label: 'Bencana', value: 'bencana' },
    { label: 'Tiada', value: 'tiada' }
  ];
});

const pakOfficersOptions = computed(() => {
  const selectedKariah = formData.value.verification.selectedKariah;
  return selectedKariah ? pakOfficersByKariah[selectedKariah] || [] : [];
});

const pakOfficersOptionsPAK = computed(() => {
  const selectedKariah = formData.value.verification.selectedKariahPAK;
  return selectedKariah ? pakOfficersByKariah[selectedKariah] || [] : [];
});

const pakOfficersOptionsAssistance = computed(() => {
  const selectedKariah = formData.value.verification.selectedKariahAssistance;
  return selectedKariah ? pakOfficersByKariah[selectedKariah] || [] : [];
});

const uploadedDocuments = computed(() => {
  const documents = [];
  
  // Add fake documents for demonstration
  documents.push(
    {
      name: 'pengesahan_bermastautin_ahmad_bin_ali.pdf',
      type: 'PDF Document',
      size: '2.00 MB',
      url: '#'
    },
    {
      name: 'surat_pengesahan_penghulu.jpg',
      type: 'JPEG Image',
      size: '1.25 MB',
      url: '#'
    },
    {
      name: 'dokumen_sokongan_rumah.pdf',
      type: 'PDF Document',
      size: '3.45 MB',
      url: '#'
    },
    // {
    //   name: 'gambar_kediaman.png',
    //   type: 'PNG Image',
    //   size: '856 KB',
    //   url: '#'
    // }
  );
  
  // Add the main verification document if it exists
  if (formData.value.verification.dokumenPengesahanPermastautin) {
    const doc = formData.value.verification.dokumenPengesahanPermastautin;
    documents.push({
      name: getDocumentName(doc),
      type: getDocumentType(doc),
      size: getDocumentSize(doc),
      url: '#'
    });
  }
  
  return documents;
});

// Methods
const getPlaceholder = () => {
  const placeholders = {
    "ic": "Contoh: 901231025678",
    "foreign-id": "Contoh: A12345678"
  };
  return placeholders[formData.value.personalInfo.idValue] || "";
};

const getDocumentLabel = () => {
  const labels = {
    "ic": "Upload Kad Pengenalan",
    "foreign-id": "Upload Foreign ID",
    "polis": "Upload No Polis",
    "tentera": "Upload No Tentera",
    "sijil-lahir": "Upload No Sijil Lahir"
  };
  return labels[formData.value.personalInfo.idValue] || "";
};

const getSpouseDocumentLabel = (index) => {
  const labels = {
    "ic": "Upload Kad Pengenalan",
    "foreign-id": "Upload Foreign ID",
    "polis": "Upload No Polis",
    "tentera": "Upload No Tentera",
    "sijil-lahir": "Upload No Sijil Lahir"
  };
  return labels[formData.value.personalInfo.spouses[index]?.spouseIdType] || "";
};

const getSpousePlaceholder = (index) => {
  const placeholders = {
    "ic": "Contoh: 901231025678",
    "foreign-id": "Contoh: A12345678",
    "polis": "Contoh: 1234567890",
    "tentera": "Contoh: 1234567890",
    "sijil-lahir": "Contoh: 1234567890"
  };
  return placeholders[formData.value.personalInfo.spouses[index]?.spouseIdType] || "";
};

const getLocation = (field) => {
  formData.value[field].location = 'Lokasi semasa';
  toast.success('Lokasi berjaya diperoleh!');
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

const prevStep = () => currentStep.value--;
const nextStep = () => currentStep.value++;

// Watchers
watch(() => formData.value.personalInfo.wivesCount, (newVal) => {
  const count = parseInt(newVal) || 0;
  if (count > 0) {
    while (formData.value.personalInfo.wives.length < count) {
      formData.value.personalInfo.wives.push({ ic: "", name: "" });
    }
    formData.value.personalInfo.wives = formData.value.personalInfo.wives.slice(0, count);
  } else {
    formData.value.personalInfo.wives = [];
  }
});

watch(() => formData.value.personalInfo.polygamyStatus, (newVal) => {
  if (newVal !== "ya") {
    formData.value.personalInfo.wivesCount = "";
    formData.value.personalInfo.wives = [];
  }
});

watch(() => formData.value.personalInfo.bankName, (newVal) => {
  if (newVal) {
    const selectedBank = bankOptions.find(bank => bank.value === newVal);
    formData.value.personalInfo.swiftCode = selectedBank ? selectedBank.swiftCode : '';
  } else {
    formData.value.personalInfo.swiftCode = '';
  }
});

watch(() => formData.value.addressInfo.residenceYears, (newVal) => {
  if (newVal && newVal.trim() !== '') {
    toast.info('Notifikasi telah dihantar kepada PAK/Kariah');
  }
});

watch(() => formData.value.personalInfo.maritalStatus, (newVal) => {
  if (newVal === 'berkahwin') {
    // Add first spouse entry if array is empty
    if (formData.value.personalInfo.spouses.length === 0) {
      addSpouse();
    }
  } else {
    // Clear spouses array if not married
    formData.value.personalInfo.spouses = [];
  }
});

watch(() => formData.value.verification.selectedKariah, (newVal) => {
  // Clear selected PAK officer when Kariah changes
  formData.value.verification.selectedPakOfficer = '';
});

watch(() => formData.value.verification.selectedKariahPAK, (newVal) => {
  // Clear selected PAK officer when Kariah changes for PAK relationship
  formData.value.verification.selectedPakOfficerPAK = '';
});

watch(() => formData.value.verification.selectedKariahAssistance, (newVal) => {
  // Clear selected PAK officer when Kariah changes for PAK assistance
  formData.value.verification.selectedPakOfficerAssistance = '';
});

const addSpouse = () => {
  formData.value.personalInfo.spouses.push({
    relationship: "",
    spouseIdType: "",
    spouseIdNumber: "",
    spouseName: "",
    spouseIdDocument: null
  });
};

const removeSpouse = (index) => {
  formData.value.personalInfo.spouses.splice(index, 1);
};

// Helper methods for readonly display
const getKariahLabel = (value) => {
  const kariah = kariahOptions.find(k => k.value === value);
  return kariah ? kariah.label : '';
};

const getPakOfficerLabel = (value) => {
  const selectedKariah = formData.value.verification.selectedKariah;
  const officers = pakOfficersByKariah[selectedKariah] || [];
  const officer = officers.find(o => o.value === value);
  return officer ? officer.label : '';
};

const getDocumentName = (file) => {
  if (!file) return '';
  if (typeof file === 'string') return file;
  if (file instanceof File) return file.name;
  if (file && file.name) return file.name;
  return '';
};

const getDocumentSize = (file) => {
  if (!file) return '';
  if (file instanceof File) {
    const sizeInBytes = file.size;
    const sizeInKB = (sizeInBytes / 1024).toFixed(2);
    const sizeInMB = (sizeInBytes / (1024 * 1024)).toFixed(2);
    if (sizeInMB >= 1) {
      return `${sizeInMB} MB`;
    } else {
      return `${sizeInKB} KB`;
    }
  }
  return '';
};

const getDocumentType = (file) => {
  if (!file) return '';
  if (file instanceof File) {
    const extension = file.name.split('.').pop().toUpperCase();
    const typeMap = {
      'PDF': 'PDF Document',
      'JPG': 'JPEG Image',
      'JPEG': 'JPEG Image',
      'PNG': 'PNG Image'
    };
    return typeMap[extension] || extension;
  }
  return '';
};

const getDocumentUploadDate = (file) => {
  if (!file) return '';
  if (file instanceof File) {
    return new Date(file.lastModified).toLocaleDateString('ms-MY');
  }
  return new Date().toLocaleDateString('ms-MY');
};

const downloadDocument = (doc) => {
  // For demo, just log the document info
  // In production, you would trigger a real download
  console.log('Download document:', doc);
  toast.info(`Muat turun dokumen: ${doc.name}`);
};

const goBack = () => {
  // If we're on step 2 (Maklumat Peribadi), go back to step 1 (Penilaian Awal)
  if (currentStep.value === 2) {
    currentStep.value = 1;
    return;
  }
  
  // For other steps, go back to previous step
  if (currentStep.value > 1) {
    currentStep.value--;
  } else {
    // If we're on step 1, redirect to QS/02
    router.push('/BF-PRF/AS/QS/02');
  }
};

const handleSaveStep1 = async () => {
  try {
    // Save penilaian awal data
    const step1Data = {
      penilaianAwal: formData.value.penilaianAwal
    };
    
    // Here you would typically send this data to your backend
    console.log("Langkah 1 (Penilaian Awal) disimpan:", step1Data);
    
    // Show success message
    toast.success("Maklumat Penilaian Awal berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
    console.error("Save Step 1 error:", error);
  }
};

const handleSaveStep2 = async () => {
  try {
    // Save personal information data
    const step2Data = {
      personalInfo: formData.value.personalInfo,
      healthInfo: formData.value.healthInfo
    };
    
    // Here you would typically send this data to your backend
    console.log("Langkah 2 (Peribadi) disimpan:", step2Data);
    
    // Show success message
    toast.success("Maklumat Peribadi berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
    console.error("Save Step 2 error:", error);
  }
};

const handleSaveStep3 = async () => {
  try {
    // Save address information data
    const step3Data = {
      addressInfo: formData.value.addressInfo
    };
    
    // Here you would typically send this data to your backend
    console.log("Langkah 3 (Alamat) disimpan:", step3Data);
    
    // Show success message
    toast.success("Maklumat Alamat berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
    console.error("Save Step 3 error:", error);
  }
};

const handleSaveStep4 = async () => {
  try {
    // Save verification information data
    const step4Data = {
      verification: {
        hubunganKakitanganLZS: formData.value.verification.hubunganKakitanganLZS,
        selectedKariah: formData.value.verification.selectedKariah,
        selectedPakOfficer: formData.value.verification.selectedPakOfficer,
        pakAssistance: formData.value.verification.pakAssistance,
        selectedKariahAssistance: formData.value.verification.selectedKariahAssistance,
        selectedPakOfficerAssistance: formData.value.verification.selectedPakOfficerAssistance,
        hubunganPAK: formData.value.verification.hubunganPAK,
        selectedKariahPAK: formData.value.verification.selectedKariahPAK,
        selectedPakOfficerPAK: formData.value.verification.selectedPakOfficerPAK,
        pdpaConsent: formData.value.verification.pdpaConsent
      }
    };
    
    // Here you would typically send this data to your backend
    console.log("Langkah 4 (Pengesahan) disimpan:", step4Data);
    
    // Show success message
    toast.success("Maklumat Pengesahan berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
    console.error("Save Step 4 error:", error);
  }
};

const handleSaveStep5 = async () => {
  try {
    // Save final verification data
    const step5Data = {
      verification: {
        namaPengesah: formData.value.verification.namaPengesah,
        jawatanPengesah: formData.value.verification.jawatanPengesah,
        noTelefonPengesah: formData.value.verification.noTelefonPengesah,
        tarikhPengesahanPermastautin: formData.value.verification.tarikhPengesahanPermastautin,
        dokumenPengesahanPermastautin: formData.value.verification.dokumenPengesahanPermastautin
      }
    };
    
    // Here you would typically send this data to your backend
    console.log("Langkah 5 (Bermastautin) disimpan:", step5Data);
    
    // Show success message
    toast.success("Maklumat Pengesah Bermastautin berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
    console.error("Save Step 5 error:", error);
  }
};

const handleSaveStep6 = async () => {
  try {
    // Save pegawai pendaftar data
    const step6Data = {
      pegawaiPendaftar: formData.value.pegawaiPendaftar
    };
    
    // Here you would typically send this data to your backend
    console.log("Langkah 6 (Pegawai Pendaftar) disimpan:", step6Data);
    
    // Show success message
    toast.success("Maklumat Pegawai Pendaftar berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
    console.error("Save Step 6 error:", error);
  }
};

// Penilaian Awal Computed Properties
const isTidakMendesakSelected = computed(() => {
  return formData.value.penilaianAwal.keperluanMendesak.includes('tidakMendesak');
});

const showLainInput = computed(() => {
  return formData.value.penilaianAwal.keperluanMendesak.includes('lain');
});

// Penilaian Awal Methods
const handleKeperluanChange = (value) => {
  if (value.includes('tidakMendesak')) {
    formData.value.penilaianAwal.keperluanMendesak = ['tidakMendesak'];
  }
  
  if (!value.includes('lain')) {
    formData.value.penilaianAwal.lainKeperluan = '';
  }
};
</script>
