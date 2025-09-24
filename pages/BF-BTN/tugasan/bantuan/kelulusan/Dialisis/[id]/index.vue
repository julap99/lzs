<template>
    <div class="min-h-screen">
      <div class="">
        <LayoutsBreadcrumb :items="breadcrumb" />
  
        <!-- Page Header -->
        <div class="mt-6 mb-8">
          <div
            class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            <div>
              <h1 class="text-2xl font-bold text-gray-900">Kelulusan Bantuan Perubatan Dialisis</h1>
              <p class="mt-1 text-sm text-gray-600">
                Semak dan nilai maklumat siasatan untuk kelulusan bantuan dialisis
              </p>
            </div>
            <rs-badge
              v-if="formData.statusLawatan"
              :variant="getStatusVariant(formData.statusLawatan)"
              class="text-sm px-4 py-2"
            >
              {{ getStatusText(formData.statusLawatan) }}
            </rs-badge>
          </div>
        </div>
  
        <!-- Full-width sections -->
        <div>
          <!-- Section 1: Maklumat Bantuan Dialisis (Read-only) -->
          <rs-card class="shadow-sm border-0 bg-white">
            <template #header>
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div
                    class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"
                  >
                    <Icon name="ph:user-circle" class="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-gray-900">
                    Maklumat Bantuan Dialisis
                  </h2>
                  <p class="text-sm text-gray-500">
                    Butiran bantuan perubatan dialisis dan status 
                  </p>
                </div>
              </div>
            </template>
  
            <template #body>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-1">
                  <label class="text-sm font-medium text-gray-700"
                    >Aid</label
                  >
                  <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                    <span class="text-sm text-gray-900">{{
                      formData.aid
                    }}</span>
                  </div>
                </div>
  
                <div class="space-y-1 ">
                  <label class="text-sm font-medium text-gray-700">Aid Product</label>
                  <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                    <span class="text-sm text-gray-900">{{
                      formData.aidproduct
                    }}</span>
                  </div>
                </div>
  
                <div class="space-y-1">
                  <label class="text-sm font-medium text-gray-700">Product Package</label>
                  <FormKit
                    type="select"
                    name="productpackage"
                    v-model="formData.productpackage"
                    placeholder="Sila pilih product package"
                    :options="productPackageOptions"
                    searchable="true"
                    class="mt-1"
                  />
                </div>
  
                <div class="space-y-1">
                  <label class="text-sm font-medium text-gray-700">Entitlement Product</label>
                  <!-- Checkboxes for B103 Dialysis -->
                  <div class="mt-2 space-y-2">
                    <div v-for="option in dialysisEntitlementOptions" :key="option.value" class="flex items-center">
                      <input
                        :id="option.value"
                        type="checkbox"
                        :value="option.value"
                        v-model="formData.entitlementProducts"
                        class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label :for="option.value" class="ml-2 text-sm text-gray-700 cursor-pointer">
                        {{ option.label }}
                      </label>
                    </div>
                    <div class="text-xs text-gray-500 mt-2">Selected: {{ formData.entitlementProducts }}</div>
                  </div>
                </div>

                <!-- Tarikh Permohonan (Read Only) -->
                <div class="space-y-1 mt-4">
                  <label class="text-sm font-medium text-gray-700">Tarikh Permohonan</label>
                  <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                    <span class="text-sm text-gray-900">28/8/2025</span>
                  </div>
                </div>
  
                <!-- SLA (Read Only) -->
                <div class="space-y-1 mt-4">
                  <label class="text-sm font-medium text-gray-700">SLA</label>
                  <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                    <span class="text-sm text-gray-900">3 hari lagi</span>
                  </div>
                </div>

                <!-- Toggle Button SEGERA -->
                <div class="mt-6 flex items-center">
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" v-model="formData.segera" class="sr-only peer">
                    <div
                      class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer 
                            peer-checked:bg-green-500 peer-checked:after:translate-x-full 
                            after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                            after:bg-white after:border-gray-300 after:border after:rounded-full 
                            after:h-5 after:w-5 after:transition-all"
                    ></div>
                    <span class="ml-3 text-sm font-medium text-gray-700">SEGERA</span>
                  </label>
                </div>
  
                <!-- Toggle Button Kelulusan Khas -->
                <div class="mt-6 flex items-center">
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" v-model="formData.kelulusankhas" class="sr-only peer">
                    <div
                      class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer 
                            peer-checked:bg-green-500 peer-checked:after:translate-x-full 
                            after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                            after:bg-white after:border-gray-300 after:border after:rounded-full 
                            after:h-5 after:w-5 after:transition-all"
                    ></div>
                    <span class="ml-3 text-sm font-medium text-gray-700">Kelulusan Khas</span>
                  </label>
                </div>
              </div>

              <!-- Nyatakan Sebab (only shown if segera checked) -->
              <div v-if="formData.segera" class="mt-4 space-y-1">
                <label class="text-sm font-medium text-gray-700">Nyatakan Sebab</label>
                <textarea
                  v-model="formData.sebabSegera"
                  rows="3"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Nyatakan sebab kenapa permohonan ini segera..."
                ></textarea>
              </div>

              <!-- Situasi Kelulusan Khas (only shown if kelulusankhas checked) -->
              <div v-if="formData.kelulusankhas" class="mt-4 space-y-1">
                <label class="text-sm font-medium text-gray-700">Situasi Kelulusan Khas</label>
                <FormKit
                  type="select"
                  v-model="formData.situasikelulusankhas"
                  placeholder="Sila pilih situasi kelulusan khas"
                  :options="[
                    'Melebihi kadar Had Kifayah',
                    'Tidak memenuhi syarat minimum permohonan bantuan',
                    'Jenis bantuan tidak tersenarai di dalam GPSKAZ/ Perkara yang melibatkan kepentingan akidah Islam dan nyawa',
                    'Permohonan berulang bagi bantuan yang bersifat sekali kelulusan dalam tempoh masa tertentu'
                  ]"
                />
              </div>
            </template>
          </rs-card>

          <!-- NEW: Maklumat Penerima Manfaat & Kesihatan for B103 -->
          <rs-card class="shadow-sm border-0 bg-white">
            <template #header>
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Icon name="ph:heart" class="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-gray-900">Maklumat Penerima Manfaat & Kesihatan</h2>
                  <p class="text-sm text-gray-500">B103 - Bantuan Perubatan Dialisis (Fakir)</p>
                </div>
              </div>
            </template>

            <template #body>
              <div class="space-y-6">
                <!-- Beneficiary Information -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <FormKit
                      type="select"
                      name="namaPenerima"
                      label="Nama"
                      v-model="formData.healthInfo.namaPenerima"
                      :options="beneficiaryOptions"
                      placeholder="Sila pilih nama penerima"
                      :classes="{ outer: 'mb-0' }"
                    />
                  </div>
                  <div>
                    <FormKit
                      type="select"
                      name="jenisPengenalan"
                      label="Jenis Pengenalan"
                      v-model="formData.healthInfo.jenisPengenalan"
                      :options="[
                        { label: 'MyKad', value: 'MyKad' },
                        { label: 'MyKid', value: 'MyKid' },
                        { label: 'Passport', value: 'Passport' }
                      ]"
                      :classes="{ outer: 'mb-0' }"
                    />
                  </div>
                  <div>
                    <FormKit
                      type="text"
                      name="noPengenalan"
                      label="No Pengenalan"
                      v-model="formData.healthInfo.noPengenalan"
                      :classes="{ outer: 'mb-0' }"
                    />
                  </div>
                  <div>
                    <FormKit
                      type="text"
                      name="hubungan"
                      label="Hubungan"
                      v-model="formData.healthInfo.hubungan"
                      :classes="{ outer: 'mb-0' }"
                    />
                  </div>
                </div>

                <!-- Health Information -->
                <div class="border-t pt-6">
                  <h3 class="text-md font-semibold text-gray-800 mb-4">Maklumat Kesihatan</h3>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <FormKit
                        type="select"
                        name="tahapKesihatan"
                        label="Tahap Kesihatan"
                        v-model="formData.healthInfo.tahapKesihatan"
                        :options="[
                          { label: 'Sihat', value: 'Sihat' },
                          { label: 'Sakit Kronik', value: 'Sakit Kronik' },
                          { label: 'Kurang Upaya', value: 'Kurang Upaya' }
                        ]"
                        :classes="{ outer: 'mb-0' }"
                      />
                    </div>
                    <div v-if="formData.healthInfo.tahapKesihatan && formData.healthInfo.tahapKesihatan !== 'Sihat'">
                      <FormKit
                        type="text"
                        name="jenisPenyakit"
                        label="Jenis Penyakit"
                        v-model="formData.healthInfo.jenisPenyakit"
                        placeholder="Nyatakan jenis penyakit"
                        :classes="{ outer: 'mb-0' }"
                      />
                    </div>
                  </div>
                </div>

                <!-- Chronic Illness Information -->
                <div v-if="formData.healthInfo.tahapKesihatan === 'Sakit Kronik'" class="border-t pt-6">
                  <h4 class="text-md font-semibold text-gray-800 mb-4">Maklumat Sakit Kronik</h4>
                  
                  <div class="space-y-4">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <FormKit
                          type="select"
                          name="keadaanKesihatan"
                          label="Keadaan Kesihatan"
                          v-model="formData.healthInfo.keadaanKesihatan"
                          :options="[
                            { label: 'Tidak Terlantar', value: 'Tidak Terlantar' },
                            { label: 'Separuh Terlantar', value: 'Separuh Terlantar' },
                            { label: 'Terlantar Sepenuhnya', value: 'Terlantar Sepenuhnya' }
                          ]"
                          :classes="{ outer: 'mb-0' }"
                        />
                      </div>
                      <div>
                        <FormKit
                          type="select"
                          name="kosPenjagaan"
                          label="Kos Penjagaan"
                          v-model="formData.healthInfo.kosPenjagaan"
                          :options="[
                            { label: 'Berbayar', value: 'Berbayar' },
                            { label: 'Tidak Berbayar', value: 'Tidak Berbayar' }
                          ]"
                          :classes="{ outer: 'mb-0' }"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <FormKit
                        type="text"
                        name="jumlahPerbelanjaan"
                        label="Jumlah Perbelanjaan Bulanan (RM)"
                        v-model="formData.healthInfo.jumlahPerbelanjaan"
                        placeholder="Format: 9999.99"
                        :classes="{ outer: 'mb-0' }"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </rs-card>

          <!-- NEW: Senarai Entitlement Product Cards -->
          <rs-card class="shadow-sm border-0 bg-white">
            <template #header>
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div class="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Icon name="ph:gift" class="w-6 h-6 text-indigo-600" />
                  </div>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-gray-900">Senarai Entitlement Product</h2>
                  <p class="text-sm text-gray-500">Bantuan yang dipilih berdasarkan checkbox</p>
                </div>
              </div>
            </template>

            <template #body>
              <div class="space-y-4">
                <!-- Entitlement Product Cards -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div 
                    v-for="(product, index) in selectedDialysisProducts" 
                    :key="index"
                    class="relative border rounded-lg p-4 transition-all duration-200 hover:shadow-md"
                    :class="{
                      'border-green-200 bg-green-50': product.status === 'lengkap',
                      'border-blue-200 bg-blue-50': product.status === 'sedang_edit',
                      'border-gray-200 bg-white': product.status === 'baru'
                    }"
                  >
                    <!-- Status Badge -->
                    <div class="absolute top-2 right-2">
                      <rs-badge 
                        :variant="getProductStatusVariant(product.status)"
                        class="text-xs"
                      >
                        {{ getProductStatusText(product.status) }}
                      </rs-badge>
                    </div>

                    <!-- Product Info -->
                    <div class="pr-16">
                      <h3 class="font-medium text-gray-900 text-sm mb-1">{{ product.name }}</h3>
                      <p class="text-xs text-gray-500 mb-2">{{ product.category }}</p>
                    </div>

                    <!-- Action Buttons -->
                    <div class="mt-3 flex gap-2">
                      <rs-button
                        v-if="product.status !== 'sedang_edit'"
                        variant="primary-outline"
                        size="sm"
                        @click="editDialysisProduct(index)"
                        class="text-xs px-2 py-1"
                      >
                        Edit
                      </rs-button>
                      <rs-button
                        v-if="product.status === 'sedang_edit'"
                        variant="success"
                        size="sm"
                        @click="saveDialysisProduct(index)"
                        class="text-xs px-2 py-1"
                      >
                        Simpan
                      </rs-button>
                      <rs-button
                        v-if="product.status === 'sedang_edit'"
                        variant="secondary-outline"
                        size="sm"
                        @click="cancelDialysisEdit()"
                        class="text-xs px-2 py-1"
                      >
                        Batal
                      </rs-button>
                      <rs-button
                        variant="danger-outline"
                        size="sm"
                        @click="removeDialysisProduct(index)"
                        class="text-xs px-2 py-1"
                      >
                        Padam
                      </rs-button>
                    </div>
                  </div>

                  <!-- Empty State -->
                  <div v-if="selectedDialysisProducts.length === 0" class="col-span-full text-center py-8 text-gray-500">
                    <Icon name="ph:gift" class="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p class="text-sm">Tiada entitlement product dipilih. Pilih checkbox di atas untuk menambah.</p>
                  </div>
                </div>
              </div>
            </template>
          </rs-card>

        </div>

        <!-- Two-column layout -->
        <div class="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <!-- Left Column -->
          <div class="col-span-1 space-y-6">
            <!-- Edit Panel for Dialysis Products (B103) -->
            <rs-card
              v-if="editingProductIndex >= 0 && selectedDialysisProducts[editingProductIndex] && 
                    ['HEMODIALISIS','SUNTIKAN_EPO'].includes(selectedDialysisProducts[editingProductIndex]?.code)"
              class="shadow-sm border-0 bg-white"
            >
              <template #body>
                <div class="space-y-6 p-4">
                  <!-- Maklumat Kadar Bantuan -->
                  <div class="mt-4 bg-gray-50 p-4 rounded-lg border">
                    <div class="flex items-center space-x-2 mb-3">
                      <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Icon name="ph:currency-dollar" class="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h4 class="text-sm font-semibold text-gray-700">Maklumat Kadar Bantuan</h4>
                        <p class="text-xs text-gray-500">Nilai kadar bantuan yang dicadangkan</p>
                      </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label class="text-xs font-medium text-gray-600">Kadar Bantuan</label>
                        <input
                          v-model="editingKadarBantuanKadar"
                          type="number"
                          class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label class="text-xs font-medium text-gray-600">Tempoh/Kekerapan</label>
                        <input
                          v-model="editingKadarBantuanTempoh"
                          type="number"
                          class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label class="text-xs font-medium text-gray-600">Tarikh Mula</label>
                        <input
                          v-model="editingKadarBantuanTarikhMula"
                          type="date"
                          class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label class="text-xs font-medium text-gray-600">Tarikh Tamat</label>
                        <input
                          v-model="editingKadarBantuanTarikhTamat"
                          type="date"
                          class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <div class="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                      <div class="flex items-center justify-between">
                        <span class="text-sm font-medium text-green-800">Jumlah Keseluruhan:</span>
                        <span class="text-lg font-bold text-green-900">
                          {{ calculateEditingTotal() }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <!-- Maklumat Penerima Bayaran -->
                  <div class="mt-4 bg-gray-50 p-4 rounded-lg border">
                    <h4 class="text-sm font-semibold text-gray-700 mb-3">Maklumat Penerima Bayaran</h4>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div class="md:col-span-2">
                        <label class="text-xs font-medium text-gray-600">Kategori Penerima <span class="text-red-500">*</span></label>
                        <select
                          v-model="editingPBKategori"
                          @change="loadEditingPenerimaData"
                          class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">-- Sila Pilih --</option>
                          <option value="asnaf">Asnaf</option>
                          <option value="organisasi">Organisasi</option>
                          <option value="third_party">Recipient</option>
                        </select>
                      </div>
                      <!-- No Pendaftaran dropdown for Organisasi/Recipient -->
                      <div class="md:col-span-2" v-if="editingPBKategori === 'organisasi' || editingPBKategori === 'third_party'">
                        <div class="flex items-end gap-2">
                          <div class="flex-1">
                            <label class="text-xs font-medium text-gray-600">No Pengenalan/No Pendaftaran <span class="text-red-500">*</span></label>
                            <select
                              v-model="editingPBNoPendaftaran"
                              @change="loadEditingPenerimaByRegistration"
                              class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="">-- Sila Pilih --</option>
                              <option value="HOS001">HOS001 - Hospital Kuala Selangor</option>
                              <option value="HOS002">HOS002 - Hospital Sungai Buloh</option>
                              <option value="HOS003">HOS003 - Pusat Dialisis Al-Shifa</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div>
                        <label class="text-xs font-medium text-gray-600">Kaedah Pembayaran <span class="text-red-500">*</span></label>
                        <select
                          v-model="editingPBKaedahPembayaran"
                          class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">-- Sila Pilih --</option>
                          <option value="EFT">EFT</option>
                          <option value="Cheque">Cheque</option>
                        </select>
                      </div>
                      <div>
                        <label class="text-xs font-medium text-gray-600">No Kad Pengenalan <span class="text-red-500">*</span></label>
                        <input
                          v-model="editingPBNoKadPengenalan"
                          type="text"
                          class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="000000-00-0000"
                        />
                      </div>
                      <div>
                        <label class="text-xs font-medium text-gray-600">Nama Penerima <span class="text-red-500">*</span></label>
                        <input
                          v-model="editingPBNamaPenerima"
                          type="text"
                          class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Nama penerima bayaran"
                        />
                      </div>
                      <div>
                        <label class="text-xs font-medium text-gray-600">Nama Pemegang Akaun <span class="text-red-500">*</span></label>
                        <input
                          v-model="editingPBNamaPemegangAkaun"
                          type="text"
                          class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Nama pemegang akaun bank"
                        />
                      </div>
                      <div>
                        <label class="text-xs font-medium text-gray-600">Bank <span class="text-red-500">*</span></label>
                        <select
                          v-model="editingPBBank"
                          class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">-- Sila Pilih Bank --</option>
                          <option value="MAYBANK">MAYBANK</option>
                          <option value="CIMB">CIMB</option>
                          <option value="PUBLIC_BANK">PUBLIC BANK</option>
                          <option value="RHB">RHB</option>
                          <option value="HONG_LEONG">HONG LEONG BANK</option>
                        </select>
                      </div>
                      <div>
                        <label class="text-xs font-medium text-gray-600">No Akaun Bank <span class="text-red-500">*</span></label>
                        <input
                          v-model="editingPBNoAkaunBank"
                          type="text"
                          class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="0000000000"
                        />
                      </div>
                    </div>
                  </div>

                  <!-- Action Buttons -->
                  <div class="flex justify-end space-x-3 pt-4 border-t">
                    <rs-button variant="secondary-outline" @click="cancelDialysisEdit">
                      Batal
                    </rs-button>
                    <rs-button variant="success" @click="saveDialysisProductEdit">
                      Simpan Perubahan
                    </rs-button>
                  </div>
                </div>
              </template>
            </rs-card>

            <!-- Section 2: Dokumen Sokongan -->
          <rs-card class="shadow-sm border-0 bg-white">
            <template #header>
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div
                    class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center"
                  >
                    <Icon name="ph:folder-open" class="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-gray-900">
                    Dokumen Sokongan
                  </h2>
                  <p class="text-sm text-gray-500">
                    Dokumen yang dikemukakan oleh pemohon
                  </p>
                </div>
              </div>
            </template>

            <template #body>
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dokumen</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="(dokumen, index) in dokumenSokongan" :key="index" class="hover:bg-gray-50">
                      <td class="px-6 py-4 text-sm text-gray-900 whitespace-normal break-words">{{ dokumen.jenis }}</td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <FormKit type="select" :options="statusDokumenOptions" v-model="dokumen.status" :classes="{ input: 'text-sm px-4 py-3 border-gray-300 rounded-md min-w-[120px]' }" outer-class="mb-0" wrapper-class="mb-0" inner-class="mb-0" />
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div class="flex items-center space-x-2">
                          <rs-button variant="primary" @click="previewDocument(dokumen)"><Icon name="ph:eye" class="w-4 h-4 mr-1" /></rs-button>
                          <rs-button variant="success" @click="downloadDocument(dokumen)"><Icon name="ph:download" class="w-4 h-4 mr-1" /></rs-button>
                  </div>
                      </td>
                    </tr>
                    <tr v-if="dokumenSokongan.length === 0">
                      <td colspan="3" class="px-6 py-4 text-center text-sm text-gray-500">Tiada dokumen dijumpai.</td>
                    </tr>
                  </tbody>
                </table>
                  </div>
            </template>
          </rs-card>
                </div>

          <!-- Right Column -->
          <div class="col-span-1 space-y-6">
            <!-- Section 3: Prosedur Agihan -->
          <rs-card class="shadow-sm border-0 bg-white">
            <template #header>
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div
                    class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center"
                  >
                    <Icon
                      name="iconamoon:check-circle-2-duotone"
                      class="w-6 h-6 text-yellow-600"
                    />
                  </div>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-gray-900">
                    Prosedur Agihan
                  </h2>
                  <p class="text-sm text-gray-500">
                    Laluan Proses Permohonan
                  </p>
                  </div>
                </div>
            </template>

            <template #body>
              <div class="space-y-4">
                <!-- Accordion: Laluan Proses Details -->
                <div class="space-y-3">
                  <!-- Permohonan Accordion Item -->
                  <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      type="button"
                      class="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50"
                      @click="accordionOpen.permohonan = !accordionOpen.permohonan"
                    >
                      <span class="font-medium text-gray-900">Permohonan</span>
                      <Icon
                        :name="accordionOpen.permohonan ? 'ic:round-expand-less' : 'ic:round-expand-more'"
                        class="w-6 h-6 text-gray-500"
                      />
                    </button>
                    <div v-show="accordionOpen.permohonan" class="px-4 pb-4 pt-1">
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label class="block text-sm font-medium text-gray-600 mb-1">Permohonan Dibuat Oleh</label>
                          <p class="text-gray-900">{{ permohonanDetails.dibuatOleh }}</p>
                        </div>
                        <div>
                          <label class="block text-sm font-medium text-gray-600 mb-1">Tarikh Permohonan</label>
                          <p class="text-gray-900">{{ formatDateTime(permohonanDetails.tarikhPermohonan) }}</p>
                        </div>
                        <div class="md:col-span-2">
                          <label class="block text-sm font-medium text-gray-600 mb-1">Sebab Memohon Bantuan</label>
                          <p class="text-gray-900">{{ permohonanDetails.sebabMemohon }}</p>
                        </div>
                      </div>
                  </div>
                </div>

                  <!-- Siasatan Accordion Item -->
                  <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      type="button"
                      class="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50"
                      @click="accordionOpen.siasatan = !accordionOpen.siasatan"
                    >
                      <span class="font-medium text-gray-900">Siasatan</span>
                      <Icon
                        :name="accordionOpen.siasatan ? 'ic:round-expand-less' : 'ic:round-expand-more'"
                        class="w-6 h-6 text-gray-500"
                      />
                    </button>
                    <div v-show="accordionOpen.siasatan" class="px-4 pb-4 pt-1">
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label class="block text-sm font-medium text-gray-600 mb-1">Disiasat Oleh</label>
                          <p class="text-gray-900">{{ siasatanDetails.disiasatOleh }}</p>
                        </div>
                        <div>
                          <label class="block text-sm font-medium text-gray-600 mb-1">Kaedah Siasatan</label>
                          <p class="text-gray-900">{{ siasatanDetails.kaedahSiasatan }}</p>
                        </div>
                        <div>
                          <label class="block text-sm font-medium text-gray-600 mb-1">Status Siasatan</label>
                          <rs-badge :variant="getProcessStatusVariant(siasatanDetails.statusSiasatan)">
                            {{ siasatanDetails.statusSiasatan }}
                          </rs-badge>
                        </div>
                        <div>
                          <label class="block text-sm font-medium text-gray-600 mb-1">Tarikh Selesai Siasatan</label>
                          <p class="text-gray-900">{{ formatDateTime(siasatanDetails.tarikhSelesai) }}</p>
                        </div>
                        <div>
                          <label class="block text-sm font-medium text-gray-600 mb-1">SLA</label>
                          <p class="text-gray-900">{{ siasatanDetails.sla }}</p>
                        </div>
                        <div class="md:col-span-2">
                          <label class="block text-sm font-medium text-gray-600 mb-1">Catatan Siasatan</label>
                          <p class="text-gray-900">{{ siasatanDetails.catatan }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </rs-card>

          <!-- Section 4: Maklumat Bajet -->
          <rs-card class="shadow-sm border-0 bg-white">
            <template #header>
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Icon name="ph:check-circle" class="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-gray-900">Maklumat Bajet</h2>
                  <p class="text-sm text-gray-500">Semakan bajet bantuan</p>
                </div>
              </div>
            </template>

            <template #body>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Kod Bajet</label>
                  <input
                    type="text"
                    v-model="budgetInfo.kodBajet"
                    class="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900"
                    readonly
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Jumlah Bajet Semasa</label>
                  <input
                    type="text"
                    v-model="budgetInfo.jumlahBajetSemasa"
                    class="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900"
                    readonly
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Bajet Mencukupi</label>
                  <div class="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 flex items-center">
                    <rs-badge 
                      v-if="budgetInfo.bajetMencukupi === 'Ya'" 
                      variant="success"
                      class="text-white font-semibold"
                    >
                      YA
                    </rs-badge>
                    <span v-else class="text-gray-900">{{ budgetInfo.bajetMencukupi }}</span>
                  </div>
                </div>
                
                <div class="pt-2">
                  <rs-button variant="success" @click="checkBudget">
                    Semakan Bajet
                  </rs-button>
                </div>
              </div>
            </template>
          </rs-card>

          <!-- Section 5: Maklumat Kelulusan -->
          <rs-card class="shadow-sm border-0 bg-white">
            <template #header>
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Icon name="ph:file-text" class="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-gray-900">Maklumat Kelulusan</h2>
                  <p class="text-sm text-gray-500">Keputusan kelulusan bantuan</p>
                </div>
              </div>
            </template>

            <template #body>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Keputusan Kelulusan</label>
                  <select
                    v-model="approvalInfo.keputusanKelulusan"
                    class="w-full p-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Pilih keputusan kelulusan</option>
                    <option value="lulus">Lulus</option>
                    <option value="tidak_lulus">Tidak Lulus</option>
                  </select>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Catatan
                    <span v-if="approvalInfo.keputusanKelulusan === 'tidak_lulus'" class="text-red-500 ml-1">*</span>
                  </label>
                  <textarea
                    v-model="approvalInfo.catatan"
                    rows="4"
                    :class="[
                      'w-full p-3 bg-white border rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                      approvalInfo.keputusanKelulusan === 'tidak_lulus' && !approvalInfo.catatan?.trim() 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                        : 'border-gray-300'
                    ]"
                    :placeholder="approvalInfo.keputusanKelulusan === 'tidak_lulus' ? 'Catatan diperlukan untuk keputusan Tidak Lulus' : 'Boleh mengisi catatan'"
                  ></textarea>
                  <p v-if="approvalInfo.keputusanKelulusan === 'tidak_lulus' && !approvalInfo.catatan?.trim()" class="text-red-500 text-xs mt-1">
                    Catatan diperlukan untuk keputusan Tidak Lulus
                  </p>
                </div>
              </div>
            </template>
          </rs-card>
          </div>
        </div>

          <!-- Action Buttons -->
          <div class="mt-8 flex justify-end space-x-4">
            <rs-button variant="secondary-outline" @click="goBack">
              Kembali
            </rs-button>
            <rs-button variant="success" @click="handleLulus" :loading="processing">
              Lulus
            </rs-button>
            <rs-button variant="danger" @click="handleTolak" :loading="processing">
              Tolak
            </rs-button>
        </div>
      </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'

definePageMeta({
  title: "Kelulusan Bantuan Dialisis",
})

const router = useRouter()
const route = useRoute()
const toast = useToast()

const breadcrumb = ref([
  {
    name: "Tugasan",
    type: "link",
    path: "/BF-BTN/tugasan",
  },
  {
    name: "Kelulusan",
    type: "link", 
    path: `/BF-BTN/tugasan/bantuan/kelulusan/${route.params.id}`,
  },
  {
    name: "Bantuan Dialisis",
    type: "current",
    path: `/BF-BTN/tugasan/bantuan/kelulusan/dialisis/${route.params.id}`,
  },
])

// Form data
const formData = ref({
  // Bantuan info
  aid: "B103 - (HQ) BANTUAN PERUBATAN DIALISIS (FAKIR)",
  aidproduct: "(HQ) KATEGORI HEMODIALISIS (FAKIR)",
  productpackage: "",
  entitlementproduct: "",
  entitlementProducts: [], // For B103 checkbox selections
  
  // Pemohon info - will be loaded based on route param
  nama: "",
  noPengenalan: "",
  alamat: "",
  noTelefon: "",
  email: "",
  
  // Form states
  segera: false,
  kelulusankhas: false,
  sebabSegera: "",
  situasikelulusankhas: "",
  statusLawatan: "Dalam Semakan",
  
  // Health Information for B103
  healthInfo: {
    namaPenerima: "Nur Najihah binti Mazlan",
    jenisPengenalan: "MyKad",
    noPengenalan: "850315-10-1234",
    hubungan: "Isteri",
    tahapKesihatan: "Sakit Kronik",
    jenisPenyakit: "Sakit Buah Pinggang",
    keadaanKesihatan: "Tidak Terlantar",
    kosPenjagaan: "Berbayar",
    jumlahPerbelanjaan: "300",
  }
})

// Options
const productPackageOptions = [
  { label: '-- Sila Pilih --', value: '' },
  { label: '(GL) (HQ) HEMODIALISIS DAN SUNTIKAN EPO (FAKIR)', value: 'HEMODIALISIS_DAN_EPO' },
  { label: '(GL) (HQ) HEMODIALISIS SAHAJA (FAKIR)', value: 'HEMODIALISIS_SAHAJA' },
  { label: '(GL) (HQ) SUNTIKAN EPO SAHAJA (FAKIR)', value: 'SUNTIKAN_EPO_SAHAJA' },
  { label: '(PTJ) (GL) (HQ) HEMODIALISIS DAN SUNTIKAN EPO (FAKIR)', value: 'PTJ_HEMODIALISIS_DAN_EPO' },
  { label: '(PTJ) (GL) (HQ) HEMODIALISIS SAHAJA (FAKIR)', value: 'PTJ_HEMODIALISIS_SAHAJA' },
  { label: '(PTJ) (GL) (HQ) SUNTIKAN EPO SAHAJA (FAKIR)', value: 'PTJ_SUNTIKAN_EPO_SAHAJA' },
]

const entitlementProductOptions = [
  "(GL) (HQ) HEMODIALISIS (FAKIR)",
  "(GL) (HQ) SUNTIKAN EPO (FAKIR)",
  "(GL) (HQ) HEMODIALISIS + EPO (FAKIR)"
]

// B103 Dialysis Entitlement Product options for checkboxes (same as siasatan)
const dialysisEntitlementOptions = ref([
  { label: '(GL) (HQ) HEMODIALISIS (FAKIR)', value: 'HEMODIALISIS' },
  { label: '(GL) (HQ) SUNTIKAN EPO (FAKIR)', value: 'SUNTIKAN_EPO' }
])

// Beneficiary options for B103
const beneficiaryOptions = ref([
  { label: 'Nur Najihah binti Mazlan (Isteri)', value: 'Nur Najihah binti Mazlan' },
  { label: 'Amir Helmi bin Amirul Hakim (Anak)', value: 'Amir Helmi bin Amirul Hakim' },
  { label: 'Amira Hasya binti Amirul Hakim (Anak)', value: 'Amira Hasya binti Amirul Hakim' },
])

// Beneficiary data mapping
const beneficiaryData = {
  'Nur Najihah binti Mazlan': {
    noPengenalan: '850315-10-1234',
    hubungan: 'Isteri'
  },
  'Amir Helmi bin Amirul Hakim': {
    noPengenalan: '120512-10-5678',
    hubungan: 'Anak'
  },
  'Amira Hasya binti Amirul Hakim': {
    noPengenalan: '150815-10-9012',
    hubungan: 'Anak'
  }
}

const processing = ref(false)
const editingProductIndex = ref(-1)

// Editing form data for Kadar Bantuan
const editingKadarBantuanKadar = ref('')
const editingKadarBantuanTempoh = ref('')
const editingKadarBantuanTarikhMula = ref('')
const editingKadarBantuanTarikhTamat = ref('')

// Editing form data for Penerima Bayaran
const editingPBKategori = ref('')
const editingPBNoPendaftaran = ref('')
const editingPBKaedahPembayaran = ref('EFT')
const editingPBNoKadPengenalan = ref('')
const editingPBNamaPenerima = ref('')
const editingPBNamaPemegangAkaun = ref('')
const editingPBBank = ref('')
const editingPBNoAkaunBank = ref('')

// Dialysis products data for entitlement products (same as siasatan)
const dialysisProductsData = ref([
  {
    code: 'HEMODIALISIS',
    kadarBantuan: '500.00',
    tempohKekerapan: '12',
    jumlahKeseluruhan: '6,000.00'
  },
  {
    code: 'SUNTIKAN_EPO',
    kadarBantuan: '300.00',
    tempohKekerapan: '12',
    jumlahKeseluruhan: '3,600.00'
  }
])

// Selected Dialysis Products (computed from checkbox selections)
const selectedDialysisProducts = computed(() => {
  return formData.value.entitlementProducts.map((value, index) => {
    const option = dialysisEntitlementOptions.value.find(opt => opt.value === value)
    const name = option ? option.label.replace('(GL) (HQ) ', '').replace(' (FAKIR)', '') : value
    
    // Get product data
    const productData = dialysisProductsData.value.find(p => p.code === value)
    
    return {
      name: name,
      code: value,
      category: 'Dialisis',
      status: index === editingProductIndex.value ? 'sedang_edit' : 'lengkap',
      kadarBantuan: productData?.kadarBantuan || '500.00',
      tempohKekerapan: productData?.tempohKekerapan || '12',
      jumlahKeseluruhan: productData?.jumlahKeseluruhan || '6,000.00'
    }
  })
})

// Load applicant data based on route parameter
const loadApplicantData = () => {
  const applicantId = route.params.id
  
  // This should match the data structure from the main kelulusan page
  const applicantDatabase = {
    "B103": {
      nama: "Amirul Hakim bin Zainuddin",
      noPengenalan: "791230104321",
      alamat: "No. 321, Jalan Sejahtera, Taman Al-Taqwa, 45000 Kuala Selangor, Selangor",
      noTelefon: "0187654321",
      email: "amirul.hakim@gmail.com",
    }
  }
  
  const applicantData = applicantDatabase[applicantId]
  if (applicantData) {
    Object.assign(formData.value, applicantData)
  }
}

// Methods
const getStatusVariant = (status) => {
  const variants = {
    "Dalam Semakan": "warning",
    "Lulus": "success", 
    "Ditolak": "danger",
    "Segera": "info"
  }
  return variants[status] || "default"
}

const getStatusText = (status) => {
  return status || "Dalam Semakan"
}

// Product status methods
const getProductStatusVariant = (status) => {
  const variants = {
    'lengkap': 'success',
    'sedang_edit': 'info',
    'baru': 'secondary'
  }
  return variants[status] || 'default'
}

const getProductStatusText = (status) => {
  const statusMap = {
    'lengkap': 'Lengkap',
    'sedang_edit': 'Sedang Edit',
    'baru': 'Baru'
  }
  return statusMap[status] || status
}

// Dialysis product management methods
const editDialysisProduct = (index) => {
  editingProductIndex.value = index
  const product = selectedDialysisProducts.value[index]
  const productData = dialysisProductsData.value.find(p => p.code === product.code)
  
  // Load current data into editing form
  editingKadarBantuanKadar.value = productData?.kadarBantuan || '500.00'
  editingKadarBantuanTempoh.value = productData?.tempohKekerapan || '12'
  editingKadarBantuanTarikhMula.value = '2025-01-01'
  editingKadarBantuanTarikhTamat.value = '2025-12-31'
  
  // Reset penerima bayaran form
  editingPBKategori.value = 'asnaf'
  editingPBKaedahPembayaran.value = 'EFT'
  editingPBNoKadPengenalan.value = '791230104321'
  editingPBNamaPenerima.value = 'Amirul Hakim bin Zainuddin'
  editingPBNamaPemegangAkaun.value = 'Amirul Hakim bin Zainuddin'
  editingPBBank.value = 'MAYBANK'
  editingPBNoAkaunBank.value = '1234567890'
  
  console.log(`Mengedit product: ${product.name}`)
  toast.info(`Mengedit product: ${product.name}`)
}

const saveDialysisProduct = (index) => {
  editingProductIndex.value = -1
  console.log('Product dialisis telah disimpan')
  toast.success('Product telah disimpan')
}

const cancelDialysisEdit = () => {
  editingProductIndex.value = -1
  // Reset all editing form data
  editingKadarBantuanKadar.value = ''
  editingKadarBantuanTempoh.value = ''
  editingKadarBantuanTarikhMula.value = ''
  editingKadarBantuanTarikhTamat.value = ''
  editingPBKategori.value = ''
  editingPBNoPendaftaran.value = ''
  editingPBKaedahPembayaran.value = 'EFT'
  editingPBNoKadPengenalan.value = ''
  editingPBNamaPenerima.value = ''
  editingPBNamaPemegangAkaun.value = ''
  editingPBBank.value = ''
  editingPBNoAkaunBank.value = ''
  console.log('Edit dibatalkan')
  toast.warning('Edit dibatalkan')
}

// Calculate total for editing form
const calculateEditingTotal = () => {
  const kadar = parseFloat(editingKadarBantuanKadar.value) || 0
  const tempoh = parseFloat(editingKadarBantuanTempoh.value) || 0
  const total = kadar * tempoh
  return `RM ${total.toLocaleString('en-MY', { minimumFractionDigits: 2 })}`
}

// Save editing changes
const saveDialysisProductEdit = () => {
  const index = editingProductIndex.value
  if (index >= 0) {
    const product = selectedDialysisProducts.value[index]
    const productData = dialysisProductsData.value.find(p => p.code === product.code)
    
    if (productData) {
      // Update product data
      productData.kadarBantuan = editingKadarBantuanKadar.value
      productData.tempohKekerapan = editingKadarBantuanTempoh.value
      productData.jumlahKeseluruhan = calculateEditingTotal().replace('RM ', '').replace(',', '')
    }
    
    editingProductIndex.value = -1
    console.log('Perubahan telah disimpan')
    toast.success('Perubahan telah disimpan')
  }
}

// Load penerima data based on kategori
const loadEditingPenerimaData = () => {
  if (editingPBKategori.value === 'asnaf') {
    editingPBKaedahPembayaran.value = 'EFT'
    editingPBNoKadPengenalan.value = '791230104321'
    editingPBNamaPenerima.value = 'Amirul Hakim bin Zainuddin'
    editingPBNamaPemegangAkaun.value = 'Amirul Hakim bin Zainuddin'
    editingPBNoPendaftaran.value = ''
    editingPBBank.value = 'MAYBANK'
    editingPBNoAkaunBank.value = '1234567890'
  } else {
    // Reset for organisasi/third party
    editingPBKaedahPembayaran.value = 'EFT'
    editingPBNoKadPengenalan.value = ''
    editingPBNamaPenerima.value = ''
    editingPBNamaPemegangAkaun.value = ''
    editingPBBank.value = ''
    editingPBNoAkaunBank.value = ''
  }
}

// Load penerima data based on registration number
const loadEditingPenerimaByRegistration = () => {
  const registrationData = {
    'HOS001': {
      namaPenerima: 'Hospital Kuala Selangor',
      namaPemegangAkaun: 'Hospital Kuala Selangor',
      bank: 'MAYBANK',
      noAkaunBank: '1111111111'
    },
    'HOS002': {
      namaPenerima: 'Hospital Sungai Buloh',
      namaPemegangAkaun: 'Hospital Sungai Buloh',
      bank: 'CIMB',
      noAkaunBank: '2222222222'
    },
    'HOS003': {
      namaPenerima: 'Pusat Dialisis Al-Shifa',
      namaPemegangAkaun: 'Pusat Dialisis Al-Shifa',
      bank: 'PUBLIC_BANK',
      noAkaunBank: '3333333333'
    }
  }
  
  const data = registrationData[editingPBNoPendaftaran.value]
  if (data) {
    editingPBNamaPenerima.value = data.namaPenerima
    editingPBNamaPemegangAkaun.value = data.namaPemegangAkaun
    editingPBBank.value = data.bank
    editingPBNoAkaunBank.value = data.noAkaunBank
  }
}

const removeDialysisProduct = (index) => {
  if (confirm('Adakah anda pasti mahu memadam entitlement product ini?')) {
    // Remove from checkbox selections
    const productToRemove = selectedDialysisProducts.value[index]
    const valueIndex = formData.value.entitlementProducts.indexOf(productToRemove.code)
    if (valueIndex > -1) {
      formData.value.entitlementProducts.splice(valueIndex, 1)
    }
    
    console.log('Entitlement product telah dipadam')
    toast.success('Entitlement product telah dipadam')
  }
}

const goBack = () => {
  router.push(`/BF-BTN/tugasan/bantuan/kelulusan/siasatan-eoad/btn-004`)
}

const handleLulus = async () => {
  processing.value = true
  try {
    // Implement approval logic here
    console.log("Bantuan dialisis diluluskan", formData.value)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Navigate back or show success message
    await router.push("/BF-BTN/tugasan")
  } catch (error) {
    console.error("Error approving assistance:", error)
  } finally {
    processing.value = false
  }
}

const handleTolak = async () => {
  processing.value = true
  try {
    // Implement rejection logic here
    console.log("Bantuan dialisis ditolak", formData.value)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Navigate back or show success message
    await router.push("/BF-BTN/tugasan")
  } catch (error) {
    console.error("Error rejecting assistance:", error)
  } finally {
    processing.value = false
  }
}

// Dokumen Sokongan data and functions
const dokumenSokongan = ref([
  {
    jenis: "Dokumen akuan/ pengesahan dari pihak hospital/ pusat dialisis (panel LZS)  berkaitan maklumat lengkap pesakit dan rawatan yang diperlukan adalah yang terkini.",
    filename: "borang-pengesahanh.pdf",
    url: "#",
    status: "lengkap",
  },
  {
    jenis: "Salinan dokumen kemasukan yang sah (bukan warganegara sahaja)",
    filename: "salinan-ic.pdf",
    url: "#",
    status: "lengkap",
  },
  {
    jenis: "Sebutharga kos rawatan yang diperlukan dari pusat rawatan.",
    filename: "surat-sebutharga.pdf",
    url: "#",
    status: "lengkap",
  },
  {
    jenis: "Surat pengesahan agensi luar, sekiranya terima tajaan.",
    filename: "surat-pengesahan-agensi.pdf",
    url: "#",
    status: "tidak_lengkap",
  }
])

const statusDokumenOptions = ref([
  { label: "Lengkap", value: "lengkap" },
  { label: "Tidak Lengkap", value: "tidak_lengkap" },
  { label: "Tiada Keperluan", value: "tiada_keperluan" },
])

const previewDocument = (dokumen) => {
  console.log("Previewing document:", dokumen)
  // Implement document preview functionality
}

const downloadDocument = (dokumen) => {
  console.log("Downloading document:", dokumen)
  // Implement document download functionality
}

// Prosedur Agihan - Accordion state and details
const accordionOpen = reactive({
  permohonan: false,
  siasatan: false,
})

const permohonanDetails = ref({
  dibuatOleh: 'Amirul Hakim bin Zainuddin',
  tarikhPermohonan: '2024-12-15 09:00:00',
  sebabMemohon: 'Pemohon memerlukan bantuan perubatan dialisis kerana menghidap penyakit buah pinggang kronik tahap 5 dan memerlukan rawatan dialisis 3 kali seminggu. Keluarga tidak mampu menanggung kos rawatan yang tinggi.'
})

const siasatanDetails = ref({
  disiasatOleh: 'Dr. Siti Aminah binti Hassan',
  kaedahSiasatan: 'Semakan Dokumen & Lawatan Hospital',
  statusSiasatan: 'Sokong',
  tarikhSelesai: '2024-12-18 16:30:00',
  catatan: 'Siasatan telah dilakukan ke hospital dan dokumen perubatan disahkan. Pemohon layak untuk bantuan dialisis.',
  sla: '5 hari bekerja'
})

// Maklumat Bajet
const budgetInfo = ref({
  kodBajet: "A-200400-1000-1-P-1-B103",
  jumlahBajetSemasa: "0.00",
  bajetMencukupi: "",
})

// Maklumat Kelulusan
const approvalInfo = ref({
  keputusanKelulusan: "",
  catatan: "",
})

// Helper functions
const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return '-'
  const date = new Date(dateTimeString)
  return date.toLocaleString('ms-MY')
}

const getProcessStatusVariant = (status) => {
  const variants = {
    'Permohonan': 'info',
    'Semak': 'warning',
    'Sokong': 'primary',
    'Lulus': 'success'
  }
  return variants[status] || 'primary'
}

// Budget check function
const checkBudget = () => {
  // Set budget to 10 million when checking
  budgetInfo.value.jumlahBajetSemasa = "RM 10,000,000.00"
  
  // Always set bajet mencukupi to "Ya"
  budgetInfo.value.bajetMencukupi = "Ya"
  console.log("Bajet mencukupi untuk bantuan dialisis")
}

// Load data on component mount
onMounted(() => {
  loadApplicantData()
})
</script>

<style lang="scss" scoped></style>
