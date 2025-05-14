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
        <!-- Progress Steps -->
        <div class="mb-6">
          <ol class="flex items-center w-full">
            <template v-for="(step, index) in formSteps" :key="index">
              <li
                class="flex items-center"
                :class="{ 'flex-auto': index < formSteps.length - 1 }"
              >
                <div
                  class="flex items-center justify-center w-8 h-8 rounded-full shrink-0"
                  :class="{
                    'bg-blue-600 text-white': currentStep > index,
                    'bg-blue-100 text-blue-600': currentStep === index,
                    'bg-gray-100 text-gray-600': currentStep < index,
                  }"
                >
                  <span v-if="currentStep > index">
                    <Icon name="mdi:check" size="1rem" />
                  </span>
                  <span v-else>{{ index + 1 }}</span>
                </div>
                <span
                  class="ml-2 text-sm font-medium hidden md:inline"
                  :class="{
                    'text-blue-600': currentStep >= index,
                    'text-gray-500': currentStep < index,
                  }"
                >
                  {{ step.label }}
                </span>
                <div
                  v-if="index < formSteps.length - 1"
                  class="flex-auto border-t mx-4"
                  :class="{
                    'border-blue-600': currentStep > index,
                    'border-gray-200': currentStep <= index,
                  }"
                ></div>
              </li>
            </template>
          </ol>
        </div>

        <!-- Form Section -->
        <div class="mb-6">
          <FormKit type="form" :actions="false" @submit="handleSubmit">
            <!-- Step 1: Maklumat Peribadi Asnaf -->
            <div v-if="currentStep === 0">
              <h3 class="text-lg font-medium mb-4">Maklumat Peribadi Asnaf</h3>
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
                  label="Nama Ketua Keluarga"
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
                  name="maritalStatus"
                  label="Status Perkahwinan"
                  validation="required"
                  :options="maritalStatusOptions"
                  placeholder="Pilih status"
                  v-model="formData.personalInfo.maritalStatus"
                  :validation-messages="{
                    required: 'Status Perkahwinan adalah wajib',
                  }"
                />

                <FormKit
                  type="select"
                  name="healthStatus"
                  label="Status Kesihatan"
                  validation="required"
                  :options="healthStatusOptions"
                  placeholder="Pilih status kesihatan"
                  v-model="formData.personalInfo.healthStatus"
                  :validation-messages="{
                    required: 'Status Kesihatan adalah wajib',
                  }"
                />

                <div v-if="isMuallaf">
                  <FormKit
                    type="date"
                    name="islamDate"
                    label="Tarikh Masuk Islam"
                    validation="required"
                    v-model="formData.personalInfo.islamDate"
                    :validation-messages="{
                      required: 'Tarikh Masuk Islam adalah wajib',
                    }"
                  />
                </div>

                <div v-if="isMuallaf">
                  <FormKit
                    type="date"
                    name="kfamDate"
                    label="Tarikh Masuk KFAM"
                    validation="required"
                    v-model="formData.personalInfo.kfamDate"
                    :validation-messages="{
                      required: 'Tarikh Masuk KFAM adalah wajib',
                    }"
                  />
                </div>
              </div>
            </div>

            <!-- Step 2: Maklumat Pasangan -->
            <div v-if="currentStep === 1">
              <h3 class="text-lg font-medium mb-4">Maklumat Pasangan</h3>

              <div v-if="hasSpouse" class="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                <FormKit
                  type="tel"
                  name="spousePhone"
                  label="No Telefon Pasangan"
                  validation="required"
                  v-model="formData.spouseInfo.phone"
                  :validation-messages="{
                    required: 'No Telefon adalah wajib',
                  }"
                />

                <FormKit
                  type="text"
                  name="spouseBankName"
                  label="Nama Bank Pasangan"
                  v-model="formData.spouseInfo.bankName"
                />

                <FormKit
                  type="text"
                  name="spouseBankAccount"
                  label="No Akaun Bank Pasangan"
                  v-model="formData.spouseInfo.bankAccount"
                />

                <FormKit
                  type="select"
                  name="spouseHealthStatus"
                  label="Status Kesihatan Pasangan"
                  validation="required"
                  :options="healthStatusOptions"
                  placeholder="Pilih status kesihatan"
                  v-model="formData.spouseInfo.healthStatus"
                  :validation-messages="{
                    required: 'Status Kesihatan adalah wajib',
                  }"
                />

                <div v-if="isMuallaf">
                  <FormKit
                    type="date"
                    name="spouseIslamDate"
                    label="Tarikh Masuk Islam Pasangan"
                    v-model="formData.spouseInfo.islamDate"
                  />
                </div>

                <div v-if="isMuallaf">
                  <FormKit
                    type="date"
                    name="spouseKfamDate"
                    label="Tarikh Masuk KFAM Pasangan"
                    v-model="formData.spouseInfo.kfamDate"
                  />
                </div>
              </div>

              <div v-else class="bg-gray-50 p-4 rounded-lg">
                <p>
                  Tiada maklumat pasangan diperlukan berdasarkan status perkahwinan yang
                  dipilih.
                </p>
              </div>
            </div>

            <!-- Step 3: Maklumat Alamat -->
            <div v-if="currentStep === 2">
              <h3 class="text-lg font-medium mb-4">Maklumat Alamat</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="md:col-span-2">
                  <FormKit
                    type="textarea"
                    name="address"
                    label="Alamat Terkini"
                    validation="required"
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
                  v-if="formData.addressInfo.residenceStatus === 'milik-sendiri'"
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
            </div>

            <!-- Step 4: Maklumat Tanggungan Sedang Bersekolah -->
            <div v-if="currentStep === 3">
              <h3 class="text-lg font-medium mb-4">
                Maklumat Tanggungan Sedang Bersekolah
              </h3>

              <div
                v-for="(dependent, index) in formData.schoolDependents"
                :key="index"
                class="mb-8 p-4 border border-gray-200 rounded-lg"
              >
                <div class="flex justify-between items-center mb-4">
                  <h4 class="text-md font-medium">Tanggungan #{{ index + 1 }}</h4>
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
                    :name="`schoolDependent${index}Name`"
                    label="Nama"
                    validation="required"
                    v-model="dependent.name"
                    :validation-messages="{
                      required: 'Nama adalah wajib',
                    }"
                  />

                  <FormKit
                    type="text"
                    :name="`schoolDependent${index}IdNumber`"
                    label="No Kad Pengenalan"
                    validation="required"
                    v-model="dependent.idNumber"
                    :validation-messages="{
                      required: 'No Kad Pengenalan adalah wajib',
                    }"
                  />

                  <FormKit
                    type="select"
                    :name="`schoolDependent${index}EducationLevel`"
                    label="Tahun/Tingkatan"
                    validation="required"
                    :options="educationLevelOptions"
                    placeholder="Pilih tahap pendidikan"
                    v-model="dependent.educationLevel"
                    :validation-messages="{
                      required: 'Tahap pendidikan adalah wajib',
                    }"
                  />

                  <FormKit
                    type="radio"
                    :name="`schoolDependent${index}Hostel`"
                    label="Asrama"
                    :options="[
                      { label: 'Ya', value: 'Y' },
                      { label: 'Tidak', value: 'T' },
                    ]"
                    v-model="dependent.hostel"
                  />

                  <FormKit
                    type="date"
                    :name="`schoolDependent${index}IslamDate`"
                    label="Tarikh Masuk Islam"
                    v-model="dependent.islamDate"
                  />

                  <FormKit
                    type="select"
                    :name="`schoolDependent${index}HealthStatus`"
                    label="Status Kesihatan"
                    validation="required"
                    :options="healthStatusOptions"
                    placeholder="Pilih status kesihatan"
                    v-model="dependent.healthStatus"
                    :validation-messages="{
                      required: 'Status kesihatan adalah wajib',
                    }"
                  />
                </div>
              </div>

              <div class="flex justify-center mt-4">
                <rs-button variant="secondary" @click="addSchoolDependent" type="button">
                  <Icon name="mdi:plus" class="mr-1" size="1rem" />
                  Tambah Tanggungan Bersekolah
                </rs-button>
              </div>
            </div>

            <!-- Step 5: Maklumat Tanggungan Tidak Bersekolah -->
            <div v-if="currentStep === 4">
              <h3 class="text-lg font-medium mb-4">
                Maklumat Tanggungan Tidak Bersekolah
              </h3>

              <div
                v-for="(dependent, index) in formData.nonSchoolDependents"
                :key="index"
                class="mb-8 p-4 border border-gray-200 rounded-lg"
              >
                <div class="flex justify-between items-center mb-4">
                  <h4 class="text-md font-medium">Tanggungan #{{ index + 1 }}</h4>
                  <button
                    type="button"
                    @click="removeNonSchoolDependent(index)"
                    class="text-red-500 hover:text-red-700"
                  >
                    <Icon name="mdi:delete" size="1.25rem" />
                  </button>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormKit
                    type="text"
                    :name="`nonSchoolDependent${index}Name`"
                    label="Nama"
                    validation="required"
                    v-model="dependent.name"
                    :validation-messages="{
                      required: 'Nama adalah wajib',
                    }"
                  />

                  <FormKit
                    type="text"
                    :name="`nonSchoolDependent${index}IdNumber`"
                    label="No Kad Pengenalan"
                    validation="required"
                    v-model="dependent.idNumber"
                    :validation-messages="{
                      required: 'No Kad Pengenalan adalah wajib',
                    }"
                  />

                  <FormKit
                    type="select"
                    :name="`nonSchoolDependent${index}Relationship`"
                    label="Hubungan"
                    validation="required"
                    :options="relationshipOptions"
                    placeholder="Pilih hubungan"
                    v-model="dependent.relationship"
                    :validation-messages="{
                      required: 'Hubungan adalah wajib',
                    }"
                  />

                  <FormKit
                    type="number"
                    :name="`nonSchoolDependent${index}Age`"
                    label="Umur"
                    validation="required|number|min:0"
                    v-model="dependent.age"
                    :validation-messages="{
                      required: 'Umur adalah wajib',
                      number: 'Sila masukkan nombor yang sah',
                      min: 'Umur mestilah nilai positif',
                    }"
                  />

                  <FormKit
                    type="date"
                    :name="`nonSchoolDependent${index}IslamDate`"
                    label="Tarikh Masuk Islam"
                    v-model="dependent.islamDate"
                  />

                  <FormKit
                    type="select"
                    :name="`nonSchoolDependent${index}HealthStatus`"
                    label="Status Kesihatan"
                    validation="required"
                    :options="healthStatusOptionsExtended"
                    placeholder="Pilih status kesihatan"
                    v-model="dependent.healthStatus"
                    :validation-messages="{
                      required: 'Status kesihatan adalah wajib',
                    }"
                  />

                  <FormKit
                    type="radio"
                    :name="`nonSchoolDependent${index}LivingWithFamily`"
                    label="Tinggal Bersama Keluarga"
                    :options="[
                      { label: 'Ya', value: 'Y' },
                      { label: 'Tidak', value: 'T' },
                    ]"
                    v-model="dependent.livingWithFamily"
                  />

                  <div class="md:col-span-2">
                    <FormKit
                      type="textarea"
                      :name="`nonSchoolDependent${index}Notes`"
                      label="Catatan"
                      v-model="dependent.notes"
                    />
                  </div>
                </div>
              </div>

              <div class="flex justify-center mt-4">
                <rs-button
                  variant="secondary"
                  @click="addNonSchoolDependent"
                  type="button"
                >
                  <Icon name="mdi:plus" class="mr-1" size="1rem" />
                  Tambah Tanggungan Tidak Bersekolah
                </rs-button>
              </div>
            </div>

            <!-- Step 6: Maklumat Perakuan Asnaf -->
            <div v-if="currentStep === 5">
              <h3 class="text-lg font-medium mb-4">Maklumat Perakuan Asnaf</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="md:col-span-2">
                  <FormKit
                    type="radio"
                    name="hasLZSRelationship"
                    label="Hubungan kekeluargaan dengan kakitangan LZS?"
                    :options="[
                      { label: 'Ya', value: 'Y' },
                      { label: 'Tidak', value: 'T' },
                    ]"
                    v-model="formData.declaration.hasLZSRelationship"
                  />
                </div>

                <div
                  v-if="formData.declaration.hasLZSRelationship === 'Y'"
                  class="md:col-span-2"
                >
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormKit
                      type="text"
                      name="lzsStaffName"
                      label="Nama Kakitangan"
                      validation="required"
                      v-model="formData.declaration.staffName"
                      :validation-messages="{
                        required: 'Nama kakitangan adalah wajib',
                      }"
                    />

                    <FormKit
                      type="text"
                      name="lzsStaffPosition"
                      label="Jawatan"
                      validation="required"
                      v-model="formData.declaration.staffPosition"
                      :validation-messages="{
                        required: 'Jawatan adalah wajib',
                      }"
                    />

                    <FormKit
                      type="text"
                      name="lzsStaffOffice"
                      label="Pejabat"
                      validation="required"
                      v-model="formData.declaration.staffOffice"
                      :validation-messages="{
                        required: 'Pejabat adalah wajib',
                      }"
                    />

                    <FormKit
                      type="text"
                      name="lzsStaffRelationship"
                      label="Hubungan"
                      validation="required"
                      v-model="formData.declaration.relationship"
                      :validation-messages="{
                        required: 'Hubungan adalah wajib',
                      }"
                    />
                  </div>
                </div>

                <div class="md:col-span-2">
                  <FormKit
                    type="date"
                    name="declarationDate"
                    label="Tarikh Perakuan"
                    validation="required"
                    v-model="formData.declaration.date"
                    :validation-messages="{
                      required: 'Tarikh perakuan adalah wajib',
                    }"
                  />
                </div>
              </div>
            </div>

            <!-- Step 7: Maklumat Pengesahan Asnaf dan Tanggungan -->
            <div v-if="currentStep === 6">
              <h3 class="text-lg font-medium mb-4">
                Maklumat Pengesahan Asnaf dan Tanggungan
              </h3>
              <div class="mb-4 p-4 bg-blue-50 rounded-lg">
                <p class="text-sm text-blue-700">
                  * Pengesahan boleh dibuat oleh: Wakil Rakyat / Penghulu / Ketua Kampung
                  / Ketua Penduduk / Nazir Masjid / Pengerusi Surau / Penolong Amil / Guru
                  Pembimbing Asnaf Muallaf / Eksekutif LZS / Ketua Operasi Agihan Daerah
                  LZS / Ketua Jabatan LZS / Pengurus LZS / Ketua Cawangan LZS.
                </p>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="md:col-span-2">
                  <FormKit
                    type="textarea"
                    name="verificationComments"
                    label="Ulasan"
                    validation="required"
                    v-model="formData.verification.comments"
                    :validation-messages="{
                      required: 'Ulasan adalah wajib',
                    }"
                  />
                </div>

                <FormKit
                  type="text"
                  name="verifierName"
                  label="Nama"
                  validation="required"
                  v-model="formData.verification.name"
                  :validation-messages="{
                    required: 'Nama adalah wajib',
                  }"
                />

                <FormKit
                  type="text"
                  name="verifierPosition"
                  label="Jawatan"
                  validation="required"
                  v-model="formData.verification.position"
                  :validation-messages="{
                    required: 'Jawatan adalah wajib',
                  }"
                />

                <FormKit
                  type="tel"
                  name="verifierPhone"
                  label="No Telefon"
                  validation="required"
                  v-model="formData.verification.phone"
                  :validation-messages="{
                    required: 'No Telefon adalah wajib',
                  }"
                />
              </div>
            </div>

            <!-- Step 8: Maklumat Pendapatan Ketua Keluarga dan Isi Rumah -->
            <div v-if="currentStep === 7">
              <h3 class="text-lg font-medium mb-4">
                Maklumat Pendapatan Ketua Keluarga dan Isi Rumah
              </h3>
              <div class="mb-4 p-4 bg-blue-50 rounded-lg">
                <p class="text-sm text-blue-700">* Sila lampirkan slip gaji/pendapatan</p>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormKit
                  type="text"
                  name="familyHeadName"
                  label="Nama Ketua Keluarga"
                  validation="required"
                  v-model="formData.income.familyHeadName"
                  :validation-messages="{
                    required: 'Nama ketua keluarga adalah wajib',
                  }"
                />

                <FormKit
                  type="text"
                  name="familyHeadIdNumber"
                  label="No Kad Pengenalan Ketua Keluarga"
                  validation="required"
                  v-model="formData.income.familyHeadIdNumber"
                  :validation-messages="{
                    required: 'No Kad Pengenalan adalah wajib',
                  }"
                />

                <FormKit
                  type="radio"
                  name="employmentStatus"
                  label="Status Pekerjaan"
                  :options="[
                    { label: 'Bekerja', value: 'Bekerja' },
                    { label: 'Tidak Bekerja', value: 'Tidak Bekerja' },
                  ]"
                  validation="required"
                  v-model="formData.income.employmentStatus"
                  :validation-messages="{
                    required: 'Status pekerjaan adalah wajib',
                  }"
                />

                <FormKit
                  type="select"
                  name="incomeSource"
                  label="Sumber Pendapatan"
                  validation="required"
                  :options="incomeSourceOptions"
                  placeholder="Pilih sumber pendapatan"
                  v-model="formData.income.incomeSource"
                  :validation-messages="{
                    required: 'Sumber pendapatan adalah wajib',
                  }"
                />

                <div v-if="formData.income.employmentStatus === 'Bekerja'">
                  <FormKit
                    type="select"
                    name="employmentSector"
                    label="Sektor Pekerjaan"
                    :options="employmentSectorOptions"
                    placeholder="Pilih sektor pekerjaan"
                    v-model="formData.income.employmentSector"
                  />
                </div>

                <div v-if="formData.income.employmentStatus === 'Bekerja'">
                  <FormKit
                    type="text"
                    name="jobType"
                    label="Jenis Pekerjaan"
                    v-model="formData.income.jobType"
                  />
                </div>

                <div v-if="formData.income.employmentStatus === 'Bekerja'">
                  <FormKit
                    type="select"
                    name="positionStatus"
                    label="Status Jawatan"
                    :options="positionStatusOptions"
                    placeholder="Pilih status jawatan"
                    v-model="formData.income.positionStatus"
                  />
                </div>

                <div v-if="formData.income.employmentStatus === 'Bekerja'">
                  <FormKit
                    type="text"
                    name="employerName"
                    label="Nama Majikan"
                    v-model="formData.income.employerName"
                  />
                </div>

                <FormKit
                  type="number"
                  name="incomeAmount"
                  label="Pendapatan (RM)"
                  validation="required|number|min:0"
                  v-model="formData.income.incomeAmount"
                  :validation-messages="{
                    required: 'Pendapatan adalah wajib',
                    number: 'Sila masukkan nombor yang sah',
                    min: 'Pendapatan mestilah nilai positif',
                  }"
                />

                <FormKit
                  type="date"
                  name="incomeDeclarationDate"
                  label="Tarikh Perakuan"
                  validation="required"
                  v-model="formData.income.declarationDate"
                  :validation-messages="{
                    required: 'Tarikh perakuan adalah wajib',
                  }"
                />
              </div>

              <!-- File upload for income slip -->
              <div class="mt-6">
                <FormKit
                  type="file"
                  name="incomeSlip"
                  label="Lampiran Slip Gaji/Pendapatan"
                  help="Sila muat naik slip gaji/pendapatan"
                  accept=".pdf,.jpg,.jpeg,.png"
                  :validation-messages="{
                    required: 'Slip gaji/pendapatan adalah wajib',
                  }"
                />
              </div>
            </div>
          </FormKit>
        </div> </template
    ></rs-card>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

definePageMeta({
  title: "Isi Permohonan Ringkas",
});

const breadcrumb = ref([
  {
    name: "Dashboard",
    type: "link",
    path: "/dashboard",
  },
  {
    name: "Borang Permohonan",
    type: "current",
    path: "/BF-PRF/AS/QS/02",
  },
]);

const currentStep = ref(0);

// Form steps
const formSteps = ref([
  { label: "Maklumat Peribadi" },
  { label: "Maklumat Pasangan" },
  { label: "Maklumat Alamat" },
  { label: "Tanggungan Bersekolah" },
  { label: "Tanggungan Tidak Bersekolah" },
  { label: "Perakuan Asnaf" },
  { label: "Pengesahan" },
  { label: "Pendapatan" },
]);

// Form data structure
const formData = ref({
  personalInfo: {
    idType: "",
    idNumber: "",
    name: "",
    phone: "",
    bankName: "",
    bankAccount: "",
    maritalStatus: "",
    healthStatus: "",
    islamDate: "",
    kfamDate: "",
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
    comments: "",
    name: "",
    position: "",
    phone: "",
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
});

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
  { label: "Sihat", value: "healthy" },
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
  { label: "Pra Sekolah", value: "pre-school" },
  { label: "Tahun 1", value: "year-1" },
  { label: "Tahun 2", value: "year-2" },
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
    name: "",
    idNumber: "",
    educationLevel: "",
    hostel: "",
    islamDate: "",
    healthStatus: "",
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

const handleSubmit = () => {
  // Handle form submission
  console.log("Form submitted:", formData.value);
  // Add your submission logic here (API call, etc.)
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
