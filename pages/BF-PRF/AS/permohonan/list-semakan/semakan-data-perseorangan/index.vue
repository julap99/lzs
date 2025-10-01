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
            <h2 class="text-xl font-semibold">Semakan Data Permohonan Perseorangan</h2>
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
              class="text-center flex-1 relative group cursor-pointer flex items-center justify-center gap-1"
              :class="{ 'font-semibold': currentStep >= step.id }"
              @click="goToStep(step.id)"
            >
              <span 
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
            <!-- Step 1: Maklumat Peribadi Asnaf -->
            <div v-if="currentStep === 1">
              <h3 class="text-lg font-semibold mb-4">1. Maklumat Peribadi Asnaf</h3>
              
              <!-- Maklumat Peribadi Section -->
              <div class="mb-6">
                <h4 class="text-md font-medium mb-3">Maklumat Peribadi</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormKit
                    type="select"
                    name="idValue"
                    label="Jenis ID"
                    :options="idTypeOptions"
                    v-model="mockData.personalInfo.idValue"
                    :disabled="true"
                  />

                  <FormKit
                    type="text"
                    name="idNumber"
                    label="ID Pengenalan"
                    v-model="mockData.personalInfo.idNumber"
                    :readonly="true"
                  />

                  <FormKit
                    type="text"
                    name="name"
                    label="Nama"
                    v-model="mockData.personalInfo.name"
                    :readonly="true"
                  />

                  <FormKit
                    type="select"
                    name="citizenship"
                    label="Warganegara"
                    :options="citizenshipOptions"
                    v-model="mockData.personalInfo.citizenship"
                    :disabled="true"
                  />

                  <FormKit
                    type="tel"
                    name="phone"
                    label="No Telefon Bimbit"
                    v-model="mockData.personalInfo.phone"
                    :readonly="true"
                  />

                  <FormKit
                    type="email"
                    name="email"
                    label="Emel"
                    v-model="mockData.personalInfo.email"
                    :readonly="true"
                  />
                </div>
              </div>

              <!-- Butiran Peribadi Section -->
              <div class="mb-6">
                <h4 class="text-md font-medium mb-3">Butiran Peribadi</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormKit
                    type="date"
                    name="dateOfBirth"
                    label="Tarikh Lahir"
                    v-model="mockData.personalInfo.dateOfBirth"
                    :readonly="true"
                  />

                  <FormKit
                    type="select"
                    name="gender"
                    label="Jantina"
                    :options="genderOptions"
                    v-model="mockData.personalInfo.gender"
                    :disabled="true"
                  />

                  <FormKit
                    type="select"
                    name="religion"
                    label="Agama"
                    :options="religionOptions"
                    v-model="mockData.personalInfo.religion"
                    :disabled="true"
                  />
                </div>
              </div>

              <!-- Islamic Information Section -->
              <div class="mb-6">
                <h4 class="text-md font-medium mb-3">Maklumat Islam</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormKit
                    type="text"
                    name="islamName"
                    label="Nama Selepas Islam(Mualaf)"
                    v-model="mockData.personalInfo.islamName"
                    :readonly="true"
                  />
                  
                  <FormKit
                    type="date"
                    name="islamDate"
                    label="Tarikh Masuk Islam"
                    v-model="mockData.personalInfo.islamDate"
                    :readonly="true"
                  />
                </div>
              </div>

              <!-- Marital Status Section -->
              <div class="mb-6">
                <h4 class="text-md font-medium mb-3">Maklumat Perkahwinan</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormKit
                    type="select"
                    name="maritalStatus"
                    label="Status Perkahwinan"
                    :options="maritalStatusOptions"
                    v-model="mockData.personalInfo.maritalStatus"
                    :disabled="true"
                  />
                  
                  <FormKit
                    type="number"
                    name="dependentsCount"
                    label="Bilangan Tanggungan"
                    v-model="mockData.personalInfo.dependentsCount"
                    :readonly="true"
                  />
                </div>
              </div>

              <!-- Bank Information Section -->
              <div class="mb-6">
                <h4 class="text-md font-medium mb-3">Maklumat Bank</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormKit
                    type="select"
                    name="bankName"
                    label="Nama Bank"
                    :options="bankOptions"
                    v-model="mockData.personalInfo.bankName"
                    :disabled="true"
                  />
                  
                  <FormKit
                    type="text"
                    name="swiftCode"
                    label="SWIFT Code"
                    v-model="mockData.personalInfo.swiftCode"
                    :readonly="true"
                  />

                  <FormKit
                    type="text"
                    name="bankAccount"
                    label="No Akaun Bank"
                    v-model="mockData.personalInfo.bankAccount"
                    :readonly="true"
                  />

                  <FormKit
                    type="text"
                    name="bankAccountHolder"
                    label="Penama Bank Akaun"
                    v-model="mockData.personalInfo.bankAccountHolder"
                    :readonly="true"
                  />

                  <FormKit
                    type="select"
                    name="paymentMethod"
                    label="Kaedah Pembayaran"
                    :options="paymentMethodOptions"
                    v-model="mockData.personalInfo.paymentMethod"
                    :disabled="true"
                  />
                </div>
              </div>

              <!-- Income Information Section -->
              <div class="mb-6">
                <h4 class="text-md font-medium mb-3">Maklumat Pendapatan</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormKit
                    type="number"
                    name="grossIncome"
                    label="Pendapatan Kasar (RM)"
                    v-model="mockData.personalInfo.grossIncome"
                    :readonly="true"
                  />
                </div>
              </div>

              <!-- Dokumen Lengkap Section -->
              <div class="mb-4 flex flex-col gap-4 border-t pt-4">
                <div>
                  <label class="font-bold block mb-2">Dokumen Lengkap?</label>
                  <FormKit
                    type="radio"
                    name="dokumen_lengkap"
                    v-model="currentDokumenLengkap"
                    :options="[
                      { label: 'Ya', value: 'Ya' },
                      { label: 'Tidak', value: 'Tidak' },
                      { label: 'Tiada Keperluan', value: 'Tiada' },
                    ]"
                  />
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <FormKit
                      type="text"
                      name="disemak_oleh"
                      label="Disemak Oleh"
                      v-model="disemakOleh"
                      :readonly="true"
                    />
                  </div>
                  <div>
                    <FormKit
                      type="text"
                      name="tarikh_semakan"
                      label="Tarikh Semakan"
                      v-model="tarikhSemakan"
                      :readonly="true"
                    />
                  </div>
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
                    @click="handleSaveStep1"
                  >
                    Simpan
                  </rs-button>
                  <rs-button 
                    type="button" 
                    variant="primary" 
                    :disabled="!isDokumenLengkapSelected"
                    @click="nextStep"
                  >
                    Seterusnya ke Alamat
                  </rs-button>
                </div>
              </div>
            </div>

            <!-- Step 2: Maklumat Alamat -->
            <div v-if="currentStep === 2">
              <h3 class="text-lg font-semibold mb-4">2. Maklumat Alamat</h3>
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
                    v-model="mockData.addressInfo.alamat1"
                    :readonly="true"
                  />
                </div>

                <div class="md:col-span-2">
                  <FormKit
                    type="textarea"
                    name="alamat2"
                    label="Alamat 2"
                    v-model="mockData.addressInfo.alamat2"
                    :readonly="true"
                  />
                </div>

                <div class="md:col-span-2">
                  <FormKit
                    type="textarea"
                    name="alamat3"
                    label="Alamat 3"
                    v-model="mockData.addressInfo.alamat3"
                    :readonly="true"
                  />
                </div>

                <FormKit
                  type="text"
                  name="postcode"
                  label="Poskod"
                  v-model="mockData.addressInfo.postcode"
                  :readonly="true"
                />

                <FormKit
                  type="text"
                  name="state"
                  label="Negeri"
                  v-model="mockData.addressInfo.state"
                  :readonly="true"
                />

                <FormKit
                  type="select"
                  name="district"
                  label="Daerah"
                  :options="districtOptions"
                  v-model="mockData.addressInfo.district"
                  :disabled="true"
                />

                <FormKit
                  type="select"
                  name="kariah"
                  label="Kariah"
                  :options="kariahOptions"
                  v-model="mockData.addressInfo.kariah"
                  :disabled="true"
                />

                <FormKit
                  type="number"
                  name="residenceYears"
                  label="Tempoh Bermastautin (Tahun)"
                  v-model="mockData.addressInfo.residenceYears"
                  :readonly="true"
                />

                <div class="md:col-span-2">
                  <FormKit
                    type="select"
                    name="residenceStatus"
                    label="Status Kediaman"
                    :options="residenceStatusOptions"
                    v-model="mockData.addressInfo.residenceStatus"
                    :disabled="true"
                  />
                </div>

                <FormKit
                  type="number"
                  name="rentAmount"
                  label="Kadar Sewa Bulanan (RM)"
                  v-model="mockData.addressInfo.rentAmount"
                  :readonly="true"
                />

                <FormKit
                  type="text"
                  name="location"
                  label="Lokasi"
                  v-model="mockData.addressInfo.location"
                  :readonly="true"
                />
              </div>

              <!-- Dokumen Lengkap Section -->
              <div class="mb-4 flex flex-col gap-4 border-t pt-4 mt-6">
                <div>
                  <label class="font-bold block mb-2">Dokumen Lengkap?</label>
                  <FormKit
                    type="radio"
                    name="dokumen_lengkap"
                    v-model="currentDokumenLengkap"
                    :options="[
                      { label: 'Ya', value: 'Ya' },
                      { label: 'Tidak', value: 'Tidak' },
                      { label: 'Tiada Keperluan', value: 'Tiada' },
                    ]"
                  />
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <FormKit
                      type="text"
                      name="disemak_oleh"
                      label="Disemak Oleh"
                      v-model="disemakOleh"
                      :readonly="true"
                    />
                  </div>
                  <div>
                    <FormKit
                      type="text"
                      name="tarikh_semakan"
                      label="Tarikh Semakan"
                      v-model="tarikhSemakan"
                      :readonly="true"
                    />
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
                    @click="handleSaveStep2"
                  >
                    Simpan
                  </rs-button>
                  <rs-button 
                    type="button" 
                    variant="primary" 
                    :disabled="!isDokumenLengkapSelected"
                    @click="nextStep"
                  >
                    Seterusnya ke Pengesahan
                  </rs-button>
                </div>
              </div>
            </div>

            <!-- Step 3: Pengesahan -->
            <div v-if="currentStep === 3">
              <h3 class="text-lg font-semibold mb-4">3. Pengesahan</h3>

              <div class="mb-6">
                <h4 class="font-medium mb-3">Maklumat Perakuan Pemohon</h4>
                <div class="space-y-4">
                  <FormKit
                    type="radio"
                    name="hubungan_kakitangan_lzs"
                    label="Hubungan kekeluargaan dengan kakitangan LZS?"
                    :options="['Ya', 'Tidak']"
                    v-model="mockData.verification.hubunganKakitanganLZS"
                    :disabled="true"
                  />
                  
                  <FormKit
                    type="radio"
                    name="pak_assistance"
                    label="Adakah PAK membantu semasa pengisian borang permohonan ini?"
                    :options="['Ya', 'Tidak']"
                    v-model="mockData.verification.pakAssistance"
                    :disabled="true"
                  />

                  <FormKit
                    type="radio"
                    name="hubungan_pak"
                    label="Hubungan kekeluargaan dengan PAK?"
                    :options="['Ya', 'Tidak']"
                    v-model="mockData.verification.hubunganPAK"
                    :disabled="true"
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
                      v-model="mockData.verification.pdpaConsent"
                      :disabled="true"
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

              <!-- Dokumen Lengkap Section -->
              <div class="mb-4 flex flex-col gap-4 border-t pt-4">
                <div>
                  <label class="font-bold block mb-2">Dokumen Lengkap?</label>
                  <FormKit
                    type="radio"
                    name="dokumen_lengkap"
                    v-model="currentDokumenLengkap"
                    :options="[
                      { label: 'Ya', value: 'Ya' },
                      { label: 'Tidak', value: 'Tidak' },
                      { label: 'Tiada Keperluan', value: 'Tiada' },
                    ]"
                  />
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <FormKit
                      type="text"
                      name="disemak_oleh"
                      label="Disemak Oleh"
                      v-model="disemakOleh"
                      :readonly="true"
                    />
                  </div>
                  <div>
                    <FormKit
                      type="text"
                      name="tarikh_semakan"
                      label="Tarikh Semakan"
                      v-model="tarikhSemakan"
                      :readonly="true"
                    />
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
                    @click="handleSaveStep3"
                  >
                    Simpan
                  </rs-button>
                  <rs-button 
                    type="button" 
                    variant="primary" 
                    :disabled="!isDokumenLengkapSelected"
                    @click="nextStep"
                  >
                    Seterusnya ke Pengesahan Bermastautin
                  </rs-button>
                </div>
              </div>
            </div>

            <!-- Step 4: Maklumat Pengesah Bermastautin -->
            <div v-if="currentStep === 4">
              <h3 class="text-lg font-semibold mb-4">4. Maklumat Pengesah Bermastautin</h3>

              <!-- PAK Officer Information (Readonly) -->
              <div class="mb-6">
                <h4 class="font-medium mb-3">Maklumat Pegawai PAK yang Mengesahkan</h4>
                <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormKit
                      type="select"
                      name="selected_kariah"
                      label="Kariah"
                      :options="kariahOptions"
                      v-model="mockData.verification.selectedKariah"
                      :disabled="true"
                    />
                    
                    <FormKit
                      type="select"
                      name="selected_pak_officer"
                      label="Nama Pegawai PAK"
                      :options="pakOfficersOptions"
                      v-model="mockData.verification.selectedPakOfficer"
                      :disabled="true"
                    />
                  </div>
                </div>
              </div>

              <!-- Document Information (Readonly) -->
              <div class="mb-6">
                <h4 class="font-medium mb-3">Dokumen yang Dimuat Naik</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="p-4 border rounded-lg flex items-center justify-between bg-white">
                    <div>
                      <p class="font-medium">kad_pengenalan_ahmad.jpg</p>
                      <p class="text-sm text-gray-500">JPEG Image</p>
                      <p class="text-xs text-gray-400">1.5 MB</p>
                    </div>
                    <rs-button
                      variant="primary-outline"
                      size="sm"
                      @click="downloadDocument('kad_pengenalan_ahmad.jpg')"
                    >
                      <Icon name="mdi:download" class="mr-1" />
                      Muat Turun
                    </rs-button>
                  </div>
                  
                  <div class="p-4 border rounded-lg flex items-center justify-between bg-white">
                    <div>
                      <p class="font-medium">surat_keislaman_mais.pdf</p>
                      <p class="text-sm text-gray-500">PDF Document</p>
                      <p class="text-xs text-gray-400">1.0 MB</p>
                    </div>
                    <rs-button
                      variant="primary-outline"
                      size="sm"
                      @click="downloadDocument('surat_keislaman_mais.pdf')"
                    >
                      <Icon name="mdi:download" class="mr-1" />
                      Muat Turun
                    </rs-button>
                  </div>
                  
                  <div class="p-4 border rounded-lg flex items-center justify-between bg-white">
                    <div>
                      <p class="font-medium">slip_gaji_ahmad.pdf</p>
                      <p class="text-sm text-gray-500">PDF Document</p>
                      <p class="text-xs text-gray-400">512 KB</p>
                    </div>
                    <rs-button
                      variant="primary-outline"
                      size="sm"
                      @click="downloadDocument('slip_gaji_ahmad.pdf')"
                    >
                      <Icon name="mdi:download" class="mr-1" />
                      Muat Turun
                    </rs-button>
                  </div>
                  
                  <div class="p-4 border rounded-lg flex items-center justify-between bg-white">
                    <div>
                      <p class="font-medium">surat_sewa_rumah.pdf</p>
                      <p class="text-sm text-gray-500">PDF Document</p>
                      <p class="text-xs text-gray-400">1.2 MB</p>
                    </div>
                    <rs-button
                      variant="primary-outline"
                      size="sm"
                      @click="downloadDocument('surat_sewa_rumah.pdf')"
                    >
                      <Icon name="mdi:download" class="mr-1" />
                      Muat Turun
                    </rs-button>
                  </div>
                  
                  <div class="p-4 border rounded-lg flex items-center justify-between bg-white">
                    <div>
                      <p class="font-medium">pengesahan_bermastautin_ahmad_bin_ali.pdf</p>
                      <p class="text-sm text-gray-500">PDF Document</p>
                      <p class="text-xs text-gray-400">2.0 MB</p>
                    </div>
                    <rs-button
                      variant="primary-outline"
                      size="sm"
                      @click="downloadDocument('pengesahan_bermastautin_ahmad_bin_ali.pdf')"
                    >
                      <Icon name="mdi:download" class="mr-1" />
                      Muat Turun
                    </rs-button>
                  </div>
                </div>
              </div>

              <!-- Original Form Fields (Readonly) -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="bg-gray-50 p-3 rounded">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Nama</label>
                  <div class="text-sm text-gray-900">Ustaz Ahmad bin Abdullah</div>
                </div>

                <div class="bg-gray-50 p-3 rounded">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Jawatan</label>
                  <div class="text-sm text-gray-900">Pegawai PAK</div>
                </div>

                <div class="bg-gray-50 p-3 rounded">
                  <label class="block text-sm font-medium text-gray-700 mb-1">No Telefon</label>
                  <div class="text-sm text-gray-900">012-3456789</div>
                </div>

                <div class="bg-gray-50 p-3 rounded">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Tarikh Pengesahan</label>
                  <div class="text-sm text-gray-900">15-01-2024</div>
                </div>
              </div>

              <!-- Dokumen Lengkap Section -->
              <div class="mb-4 flex flex-col gap-4 border-t pt-4 mt-6">
                <div>
                  <label class="font-bold block mb-2">Dokumen Lengkap?</label>
                  <FormKit
                    type="radio"
                    name="dokumen_lengkap"
                    v-model="currentDokumenLengkap"
                    :options="[
                      { label: 'Ya', value: 'Ya' },
                      { label: 'Tidak', value: 'Tidak' },
                      { label: 'Tiada Keperluan', value: 'Tiada' },
                    ]"
                  />
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <FormKit
                      type="text"
                      name="disemak_oleh"
                      label="Disemak Oleh"
                      v-model="disemakOleh"
                      :readonly="true"
                    />
                  </div>
                  <div>
                    <FormKit
                      type="text"
                      name="tarikh_semakan"
                      label="Tarikh Semakan"
                      v-model="tarikhSemakan"
                      :readonly="true"
                    />
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
                  <rs-button 
                    type="button" 
                    variant="primary" 
                    :disabled="!isDokumenLengkapSelected"
                    @click="nextStep"
                  >
                    Seterusnya ke Pegawai Pendaftar
                  </rs-button>
                </div>
              </div>
            </div>

            <!-- Step 5: Pegawai Pendaftar -->
            <div v-if="currentStep === 5">
              <h3 class="text-lg font-semibold mb-4">5. Maklumat Pegawai Pendaftar</h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormKit
                  type="text"
                  name="nama_pegawai_pendaftar"
                  label="Nama"
                  v-model="mockData.pegawaiPendaftar.nama"
                  :readonly="true"
                />

                <FormKit
                  type="text"
                  name="jenis_permohonan"
                  label="Jenis Permohonan"
                  v-model="mockData.pegawaiPendaftar.jenisPermohonan"
                  :readonly="true"
                />

                <FormKit
                  type="text"
                  name="kategori"
                  label="Kategori"
                  v-model="mockData.pegawaiPendaftar.kategori"
                  :readonly="true"
                />

                <FormKit
                  type="date"
                  name="tarikh_proses"
                  label="Tarikh Proses"
                  v-model="mockData.pegawaiPendaftar.tarikhProses"
                  :readonly="true"
                />
              </div>

              <!-- Dokumen Lengkap Section -->
              <div class="mb-4 flex flex-col gap-4 border-t pt-4 mt-6">
                <div>
                  <label class="font-bold block mb-2">Dokumen Lengkap?</label>
                  <FormKit
                    type="radio"
                    name="dokumen_lengkap"
                    v-model="currentDokumenLengkap"
                    :options="[
                      { label: 'Ya', value: 'Ya' },
                      { label: 'Tidak', value: 'Tidak' },
                      { label: 'Tiada Keperluan', value: 'Tiada' },
                    ]"
                  />
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <FormKit
                      type="text"
                      name="disemak_oleh"
                      label="Disemak Oleh"
                      v-model="disemakOleh"
                      :readonly="true"
                    />
                  </div>
                  <div>
                    <FormKit
                      type="text"
                      name="tarikh_semakan"
                      label="Tarikh Semakan"
                      v-model="tarikhSemakan"
                      :readonly="true"
                    />
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
                    @click="handleSaveStep5"
                  >
                    Simpan
                  </rs-button>
                  <rs-button 
                    type="button" 
                    variant="primary" 
                    :disabled="!isDokumenLengkapSelected"
                    @click="handleSubmit"
                  >
                    Lengkap
                  </rs-button>
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
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";

// Page Meta
definePageMeta({ title: "Semakan Data Permohonan Perseorangan" });

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
const totalStep = 5;

const breadcrumb = ref([{
  name: "Senarai Semakan",
  type: "link",
  path: "/BF-PRF/AS/permohonan/list-semakan",
}, {
  name: "Semakan Data Perseorangan",
  type: "current",
  path: "/BF-PRF/AS/permohonan/list-semakan/semakan-data-perseorangan",
}]);

const steps = [
  { id: 1, label: "Peribadi" },
  { id: 2, label: "Alamat" },
  { id: 3, label: "Pengesahan" },
  { id: 4, label: "Bermastautin", tooltip: "*(Wakil Rakyat/Penghulu/Ketua Kampung/Ketua Penduduk/Nazir Masjid/Pengerusi Surau/Penolong Amil/Guru Pembimbing Asnaf Muallaf/Eksekutif LZS/Ketua Operasi Agihan Daerah LZS/Ketua Jabatan LZS/Pengurus LZS/Ketua Cawangan LZS.)" },
  { id: 5, label: "Pegawai Pendaftar" }
];

// Mock Data Structure
const mockData = ref({
  personalInfo: {
    idValue: "ic",
    idNumber: "123456789",
    name: "Ahmad bin Abdullah",
    citizenship: "warganegara",
    phone: "0123456789",
    email: "ahmad.abdullah@email.com",
    dateOfBirth: "1990-12-31",
    gender: "L",
    religion: "islam",
    islamName: "Ahmad bin Abdullah",
    islamDate: "2020-06-15",
    maritalStatus: "berkahwin",
    dependentsCount: "3",
    bankName: "maybank",
    swiftCode: "MBBEMYKL",
    bankAccount: "123456789",
    bankAccountHolder: "Ahmad bin Abdullah",
    paymentMethod: "akaun",
    grossIncome: "2500"
  },
  addressInfo: {
    alamat1: "No. 123, Jalan Merdeka",
    alamat2: "Taman Seri Indah",
    alamat3: "Seksyen 15",
    postcode: "40000",
    state: "Selangor",
    district: "shah-alam",
    kariah: "masjid-negeri",
    residenceYears: "5",
    residenceStatus: "sewa",
    rentAmount: "800",
    location: "Shah Alam, Selangor"
  },
  verification: {
    hubunganKakitanganLZS: "Tidak",
    pakAssistance: "Ya",
    hubunganPAK: "Tidak",
    pdpaConsent: true,
    selectedKariah: "masjid-negeri",
    selectedPakOfficer: "ustaz-ahmad-abdullah"
  },
  pegawaiPendaftar: {
    nama: "Ahmad bin Abi",
    jenisPermohonan: "Baru",
    kategori: "kaunter",
    tarikhProses: "2024-01-15"
  }
});

// Options Arrays
const idTypeOptions = [
  { label: 'MyKad', value: 'ic' },
  { label: 'Foreign ID', value: 'foreign-id' }
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

const paymentMethodOptions = [
  { label: 'Akaun', value: 'akaun' },
  { label: 'Tiada', value: 'tiada' }
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
const pakOfficersOptions = computed(() => {
  const selectedKariah = mockData.value.verification.selectedKariah;
  return selectedKariah ? pakOfficersByKariah[selectedKariah] || [] : [];
});

// Dokumen Lengkap tracking
const dokumenLengkapSteps = ref({});

// Computed properties to check if dokumen lengkap is selected for current step
const isDokumenLengkapSelected = computed(() => {
  return (
    dokumenLengkapSteps.value[currentStep.value] &&
    dokumenLengkapSteps.value[currentStep.value] !== ""
  );
});

// Computed property for current step's dokumen lengkap value
const currentDokumenLengkap = computed({
  get() {
    return dokumenLengkapSteps.value[currentStep.value] || "";
  },
  set(value) {
    dokumenLengkapSteps.value[currentStep.value] = value;
  }
});

// Admin review fields
const disemakOleh = ref("Penyemak Admin");
const tarikhSemakan = ref(
  new Date().toLocaleDateString("ms-MY", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
);

// Methods
const goToStep = (stepId) => {
  currentStep.value = stepId;
};

const nextStep = () => {
  if (currentStep.value < totalStep) {
    currentStep.value++;
  }
};

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
};

const goBack = () => {
  navigateTo("/BF-PRF/AS/permohonan/list-semakan");
};

const handleSubmit = async () => {
  try {
    console.log("Form submitted:", dokumenLengkapSteps.value);
    toast.success("Semakan berjaya diselesaikan");
    navigateTo("/BF-PRF/AS/permohonan/list-semakan");
    
  } catch (error) {
    toast.error("Ralat! Semakan tidak berjaya diselesaikan");
    console.error("Submission error:", error);
  }
};

const downloadDocument = (docName) => {
  // For demo, just log the document info
  // In production, you would trigger a real download
  console.log('Download document:', docName);
  toast.info(`Muat turun dokumen: ${docName}`);
};

const handleSaveStep1 = async () => {
  try {
    console.log("Langkah 1 (Peribadi) disimpan:", dokumenLengkapSteps.value[1]);
    toast.success("Maklumat Peribadi berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
    console.error("Save Step 1 error:", error);
  }
};

const handleSaveStep2 = async () => {
  try {
    console.log("Langkah 2 (Alamat) disimpan:", dokumenLengkapSteps.value[2]);
    toast.success("Maklumat Alamat berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
    console.error("Save Step 2 error:", error);
  }
};

const handleSaveStep3 = async () => {
  try {
    console.log("Langkah 3 (Pengesahan) disimpan:", dokumenLengkapSteps.value[3]);
    toast.success("Maklumat Pengesahan berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
    console.error("Save Step 3 error:", error);
  }
};

const handleSaveStep4 = async () => {
  try {
    console.log("Langkah 4 (Bermastautin) disimpan:", dokumenLengkapSteps.value[4]);
    toast.success("Maklumat Pengesah Bermastautin berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
    console.error("Save Step 4 error:", error);
  }
};

const handleSaveStep5 = async () => {
  try {
    console.log("Langkah 5 (Pegawai Pendaftar) disimpan:", dokumenLengkapSteps.value[5]);
    toast.success("Maklumat Pegawai Pendaftar berjaya disimpan");
  } catch (error) {
    toast.error("Ralat! Maklumat tidak berjaya disimpan");
    console.error("Save Step 5 error:", error);
  }
};
</script>
