<template>
    <div>
      <LayoutsBreadcrumb :items="breadcrumb" />
  
      <div class="grid lg:grid-cols-3 gap-6 mt-4">
        <div class="lg:col-span-2 space-y-6">
          <FormKit
            type="form"
            @submit="handleSubmit"
            :actions="false"
            v-model="formData"
          >
            <!-- 3.1 Maklumat Pemohon -->
            <rs-card>
              <template #header>
                <h3 class="text-lg font-medium">Maklumat Pemohon</h3>
              </template>
              <template #body>
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <!-- Left Column -->
                  <div class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Nama</label>
                      <p class="text-sm text-gray-900">{{ userProfile.nama || 'Ali Natasha binti Hussain' }}</p>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Jenis Pengenalan</label>
                      <p class="text-sm text-gray-900">{{ userProfile.jenisPengenalan || 'MyKad' }}</p>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">No Telefon</label>
                      <p class="text-sm text-gray-900">{{ userProfile.noTelefon || '0198765432' }}</p>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Status Keluarga</label>
                      <p class="text-sm text-gray-900">{{ userProfile.statusHousehold || 'Fakir' }}</p>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Status Multidimensi</label>
                      <p class="text-sm text-gray-900">{{ userProfile.statusMultidimensi || 'Asnaf Tidak Produktif' }}</p>
                    </div>
                  </div>
                  
                  <!-- Right Column -->
                  <div class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
                      <p class="text-sm text-gray-900">{{ userProfile.alamat || 'No. 456, Jalan Harmoni, Taman Seri Kembangan, 43300 Seri Kembangan, Selangor' }}</p>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">No Pengenalan</label>
                      <p class="text-sm text-gray-900">{{ userProfile.noKadPengenalan || '971207020568' }}</p>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">E-mel</label>
                      <p class="text-sm text-gray-900">{{ userProfile.emel || 'ali11@gmail.com' }}</p>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">Status Individu</label>
                      <p class="text-sm text-gray-900">{{ userProfile.statusIndividu || 'Fakir' }}</p>
                    </div>
                  </div>
                </div>
              </template>
            </rs-card>

               <!-- 3.2 Maklumat Permohonan Bantuan -->
               <rs-card>
              <template #header>
                <h3 class="text-lg font-medium">Maklumat Permohonan Bantuan</h3>
              </template>
              <template #body>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormKit
                  type="text"
                  name="noBantuan"
                  label="No. Bantuan"
                  :value="noBantuan"
                  disabled
                />

                <FormKit
                  type="select"
                  name="aidType"
                  label="Aid"
                  :options="aidTypeOptions"
                  searchable
                  :search-attributes="['label']"
                  :search-filter="(option, search) => option.label.toLowerCase().includes(search.toLowerCase())"
                  placeholder="Pilih jenis bantuan..."
                  validation="required"
                  :validation-messages="{
                    required: 'Sila pilih jenis bantuan',
                  }"
                  v-model="formData.aidType"
                />

                <FormKit
                  type="select"
                  name="aidProduct"
                  label="Aid Product"
                  :options="aidProductOptionsCustom"
                  searchable
                  :search-attributes="['label']"
                  :search-filter="(option, search) => option.label.toLowerCase().includes(search.toLowerCase())"
                  placeholder="Pilih produk bantuan..."
                  validation="required"
                  :validation-messages="{
                    required: 'Sila pilih produk bantuan',
                  }"
                  :disabled="!formData.aidType"
                  v-model="formData.aidProduct"
                />

                <FormKit
                  type="select"
                  name="productPackage"
                  label="Product Package"
                  :options="productPackageOptionsCustom"
                  searchable
                  :search-attributes="['label']"
                  :search-filter="(option, search) => option.label.toLowerCase().includes(search.toLowerCase())"
                  placeholder="Pilih pakej produk..."
                  validation="required"
                  :validation-messages="{
                    required: 'Sila pilih pakej produk',
                  }"
                  :disabled="!formData.aidProduct"
                  v-model="formData.productPackage"
                />

                <div class="space-y-1">
                  <label class="text-sm font-medium text-gray-700">Entitlement Product</label>
                  <div class="mt-2 space-y-2">
                    <div v-for="option in (entitlementProductOptions || []).filter(opt => !opt.disabled)" :key="option.value" class="flex items-center">
                      <input
                        :id="option.value"
                        type="checkbox"
                        :value="option.value"
                        v-model="formData.entitlementProduct"
                        class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label :for="option.value" class="ml-2 text-sm text-gray-700 cursor-pointer">
                        {{ option.label }}
                      </label>
                    </div>
                    <div class="text-xs text-gray-500 mt-2">Selected: {{ formData.entitlementProduct }}</div>
                  </div>
                </div>

                <CustomSelect
                  v-if="isStaff"
                  v-model="formData.jenisBantuan"
                  :options="jenisBantuanOptions"
                  label="Aid (Untuk paparan pegawai sahaja)"
                  search-placeholder="Cari aid..."
                  :disabled="false"
                />
                <FormKit
                  v-if="isStaff"
                  type="select"
                  name="aidProduct"
                  label="Aid Product (Untuk paparan pegawai sahaja)"
                  :options="aidProductOptions"
                  searchable
                  :search-attributes="['label']"
                  :search-filter="(option, search) => option.label.toLowerCase().includes(search.toLowerCase())"
                  validation="required"
                  :validation-messages="{
                    required: 'Sila pilih aid product',
                  }"
                  :disabled="!formData.jenisBantuan"
                />
                <FormKit
                  v-if="isStaff"
                  type="select"
                  name="productPackage"
                  label="Product Package (Untuk paparan pegawai sahaja)"
                  :options="productPackageOptions"
                  searchable
                  :search-attributes="['label']"
                  :search-filter="(option, search) => option.label.toLowerCase().includes(search.toLowerCase())"
                  validation="required"
                  :validation-messages="{
                    required: 'Sila pilih product package',
                  }"
                  :disabled="!formData.aidProduct"
                />

                <FormKit
                  type="textarea"
                  name="penyataanMasalah"
                  label="Penyataan Masalah"
                  validation="required"
                  :validation-messages="{
                    required: 'Sila masukkan penyataan masalah',
                  }"
                  :rows="4"
                />
                </div>
              </template>
            </rs-card>

            <!-- 3.3 Maklumat Penerima Manfaat (jika tanggungan) -->
            <rs-card>
              <template #header>
                <h3 class="text-lg font-medium">Maklumat Penerima Manfaat (jika tanggungan)</h3>
              </template>
              <template #body>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormKit
                  type="select"
                  name="penerimaManfaatNama"
                  label="Nama"
                  :options="dependentsOptions"
                  v-model="selectedDependentId"
                  @input="onDependentChange"
                />
                <FormKit
                  type="text"
                  name="penerimaManfaatJenisPengenalan"
                  label="Jenis Pengenalan"
                  v-model="penerimaManfaatJenisPengenalan"
                  disabled
                />
                <FormKit
                  type="text"
                  name="penerimaManfaatNoPengenalan"
                  label="No. Pengenalan"
                  v-model="penerimaManfaatNoPengenalan"
                  disabled
                />
                <FormKit
                  type="text"
                  name="penerimaManfaatHubungan"
                  label="Hubungan"
                  v-model="penerimaManfaatHubungan"
                  disabled
                />
                </div>
              </template>
            </rs-card>
  
            <!-- 3.4 Maklumat Kadar Bantuan -->
            <rs-card>
              <template #header>
                <h3 class="text-lg font-medium">Maklumat Kadar Bantuan</h3>
              </template>
              <template #body>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormKit
                  type="number"
                  name="kadarBantuan"
                  label="Kadar Bantuan (RM)"
                  v-model="formData.kadarBantuan"
                  :min="0"
                  :max="maxKadarBantuan"
                  step="0.01"
                  validation="required|number|min:0"
                  :validation-messages="{
                    required: 'Sila masukkan kadar bantuan',
                    number: 'Nilai mesti nombor',
                    min: 'Nilai tidak boleh negatif',
                  }"
                />

                <FormKit
                  type="number"
                  name="tempoh"
                  label="Tempoh / Kekerapan"
                  v-model="formData.tempoh"
                  :min="1"
                  validation="required|number|min:1"
                  :validation-messages="{
                    required: 'Sila masukkan tempoh/kekerapan',
                    number: 'Nilai mesti nombor',
                    min: 'Nilai minimum 1',
                  }"
                />

                <FormKit
                  type="date"
                  name="tarikhMula"
                  label="Tarikh Mula"
                  v-model="formData.tarikhMula"
                  validation="required"
                  :validation-messages="{ required: 'Sila pilih tarikh mula' }"
                  :key="`tarikh-mula-${formData.tarikhMula || 'empty'}`"
                />

                <div class="formkit-outer">
                  <label class="formkit-label">Tarikh Tamat</label>
                  <div class="formkit-wrapper">
                    <input
                      type="date"
                      v-model="formData.tarikhTamat"
                      disabled
                      class="formkit-input"
                    />
                  </div>
                  <div class="formkit-help">Auto diisi berdasarkan tarikh mula dan tempoh</div>
                </div>

                <FormKit
                  type="text"
                  name="jumlahKeseluruhan"
                  label="Jumlah Keseluruhan Bantuan Diterima"
                  :value="jumlahKeseluruhanFormatted"
                  :key="`jumlah-${formData.kadarBantuan || 0}-${formData.tempoh || 0}`"
                  disabled
                  help="Kadar x Tempoh/Kekerapan"
                />
                </div>
              </template>
            </rs-card>

            <!-- 3.5 Maklumat Penerima Bayaran (B103 Style) -->
            <rs-card>
              <template #header>
                <h3 class="text-lg font-medium">Maklumat Penerima Bayaran</h3>
              </template>
              <template #body>
                <div class="bg-gray-50 p-4 rounded-lg">
                  <div class="space-y-4">
                    <!-- Kategori Penerima -->
                    <div>
                      <label class="text-xs font-medium text-gray-600">Kategori Penerima <span class="text-red-500">*</span></label>
                      <select 
                  v-model="formData.kategoriPenerimaBayaran"
                        class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">-- Sila Pilih --</option>
                        <option value="ASNAF">Asnaf</option>
                        <option value="LAIN_LAIN">Lain-lain</option>
                      </select>
                    </div>
                    
                    <!-- No Pendaftaran Dropdown (for Lain-lain) -->
                    <div v-if="showRegistrationDropdown">
                      <label class="text-xs font-medium text-gray-600">No Pendaftaran <span class="text-red-500">*</span></label>
                      <div class="flex items-end gap-2">
                        <div class="flex-1">
                          <select 
                            v-model="selectedRegistration"
                            @change="loadRecipientByRegistration"
                            class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">-- Sila Pilih --</option>
                            <option value="800101101234">800101101234 - Ahmad bin Saif</option>
                            <option value="202201012345">202201012345(1234567-W) - Syarikat Maju Jaya</option>
                            <option value="550303109999">550303109999 - Noraini bt Yusuf</option>
                            <option value="990101019999">990101019999 - Siti Aminah binti Hassan</option>
                            <!-- Dialysis Centers for medical applications -->
                            <option value="DDC001">DDC001 - PUSAT DIALISIS DAVITA TANJUNG KARANG</option>
                            <option value="FDB002">FDB002 - FORESIGHT DIALYSIS BANDAR PUNCAK ALAM</option>
                            <option value="WAN003">WAN003 - KLINIK DAN PUSAT DIALISIS WAQAF AN NUR</option>
                          </select>
                        </div>
                        <rs-badge :variant="registrationStatus === 'belum disahkan' ? 'warning' : 'success'" class="mb-0.5">{{ registrationStatus || 'disahkan' }}</rs-badge>
                        <rs-button variant="primary" class="!py-2" @click="showAddRegistration = true">Tambah Baru</rs-button>
                      </div>
                    </div>
                    
                    <!-- Kaedah Pembayaran -->
                    <div>
                      <label class="text-xs font-medium text-gray-600">Kaedah Pembayaran <span class="text-red-500">*</span></label>
                      <select 
                  v-model="formData.kaedahPembayaran"
                        class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">-- Sila Pilih --</option>
                        <option value="EFT">EFT</option>
                        <option value="VCASH">Vcash</option>
                        <option value="CHEQUE">Cheque</option>
                        <option value="TT">TT</option>
                        <option value="EWALLET">eWallet</option>
                        <option value="TUNAI">Tunai</option>
                        <option value="TUNAI_KAUNTER">Tunai (Kaunter Ekspres)</option>
                        <option value="TUNAI_LAPANGAN">Tunai (Lapangan)</option>
                      </select>
                    </div>
                    
                    <!-- Row 1: No Kad Pengenalan & Nama Penerima -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label class="text-xs font-medium text-gray-600">{{ noIdLabel }} <span class="text-red-500">*</span></label>
                        <input 
                    v-model="formData.noPengenalanPenerima"
                    @blur="autoRetrieveRecipient"
                          class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Masukkan no. kad pengenalan"
                        />
                      </div>
                      <div>
                        <label class="text-xs font-medium text-gray-600">{{ namaLabel }} <span class="text-red-500">*</span></label>
                        <!-- Asnaf Name Dropdown -->
                        <select 
                          v-if="showAsnafNameDropdown"
                  v-model="formData.namaPenerimaBayaran"
                          class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">-- Pilih Nama Asnaf --</option>
                          <option value="Ali Natasha binti Hussain">Ali Natasha binti Hussain</option>
                          <option value="Ahmad bin Abdullah">Ahmad bin Abdullah</option>
                          <option value="Siti binti Rahman">Siti binti Rahman</option>
                          <option value="Muhammad bin Hassan">Muhammad bin Hassan</option>
                          <option value="Fatimah binti Ibrahim">Fatimah binti Ibrahim</option>
                          <option value="Omar bin Ali">Omar bin Ali</option>
                          <option value="Khadijah binti Yusof">Khadijah binti Yusof</option>
                          <option value="Zainab binti Ahmad">Zainab binti Ahmad</option>
                        </select>
                        <!-- Regular Text Input for Non-Asnaf -->
                        <input 
                          v-else
                          v-model="formData.namaPenerimaBayaran"
                          class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Masukkan nama penerima"
                        />
                      </div>
                    </div>
                    
                    <!-- Row 2: Nama Pemegang Akaun & Bank (only show if not cash payment) -->
                    <div v-if="showBankFields" class="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label class="text-xs font-medium text-gray-600">Nama Pemegang Akaun <span class="text-red-500">*</span></label>
                        <input 
                  v-model="formData.namaPemegangAkaun"
                          class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Masukkan nama pemegang akaun"
                        />
                      </div>
                      <div>
                        <label class="text-xs font-medium text-gray-600">Bank <span class="text-red-500">*</span></label>
                        <input 
                  v-model="formData.bank"
                          class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Masukkan nama bank"
                        />
                      </div>
                    </div>
                    
                    <!-- Row 3: No. Akaun Bank (full width, only show if not cash payment) -->
                    <div v-if="showBankFields">
                      <label class="text-xs font-medium text-gray-600">No. Akaun Bank <span class="text-red-500">*</span></label>
                      <input 
                  v-model="formData.noAkaunBank"
                        class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Masukkan no. akaun bank"
                />
                    </div>
                  </div>
                </div>
              </template>
            </rs-card>

            <!-- 3.6 Dokumen Sokongan -->
            <rs-card>
              <template #header>
                <h3 class="text-lg font-medium">Dokumen Sokongan</h3>
                <p class="text-sm text-gray-600">Semak status dokumen yang diperlukan</p>
              </template>
              <template #body>
                <div class="overflow-x-auto">
                <table class="min-w-full text-left text-sm border border-gray-200 rounded-lg table-fixed">
                  <thead class="bg-gray-50">
                    <tr class="border-b">
                      <th class="py-3 px-4 font-medium text-gray-900 w-12">NO.</th>
                      <th class="py-3 px-4 font-medium text-gray-900 w-1/4">DOKUMEN</th>
                      <th class="py-3 px-4 font-medium text-gray-900 w-24">ACTION</th>
                      <th class="py-3 px-4 font-medium text-gray-900 w-72">STATUS</th>
                      <th class="py-3 px-4 font-medium text-gray-900 w-1/3">CATATAN</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="(doc, idx) in documents" :key="doc.id" class="hover:bg-gray-50">
                      <td class="py-3 px-4 text-gray-900">{{ idx + 1 }}</td>
                      <td class="py-3 px-4 text-gray-900 whitespace-normal break-words">{{ doc.nama }}</td>
                      <td class="py-3 px-4">
                        <div class="flex space-x-2">
                          <button 
                            @click="previewDoc(doc)" 
                            class="w-8 h-8 rounded-full border-2 border-teal-500 text-teal-500 hover:bg-teal-50 flex items-center justify-center"
                            :disabled="!doc.files?.length"
                          >
                            <Icon name="ph:eye" class="w-4 h-4" />
                          </button>
                          <button 
                            @click="doc.id === 'DOC5' ? editDocument(doc) : uploadDocument(doc)" 
                            class="w-8 h-8 rounded-full border-2 border-teal-500 text-teal-500 hover:bg-teal-50 flex items-center justify-center"
                          >
                            <Icon :name="doc.id === 'DOC5' ? 'ph:pencil' : 'ph:upload'" class="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                      <td class="py-3 px-4">
                        <FormKit 
                          type="select" 
                          :options="statusDokumenOptions" 
                          v-model="doc.status"
                          placeholder="Pilih"
                          class="w-full"
                        />
                      </td>
                      <td class="py-3 px-4">
                        <FormKit 
                          type="textarea" 
                          v-model="doc.catatan" 
                          placeholder="Masukkan catatan"
                          :rows="2"
                          class="w-full"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
                </div>
              </template>
            </rs-card>

            <!-- 3.7 Dokumen Sokongan Dari LZS -->
            <rs-card>
              <template #header>
                <h3 class="text-lg font-medium">Dokumen Sokongan Dari LZS</h3>
                <p class="text-sm text-gray-600">Dokumen Sokongan untuk paparan pegawai LZS sahaja</p>
              </template>
              <template #body>
                <div class="overflow-x-auto">
                  <table class="min-w-full border border-gray-400 text-sm">
                    <thead>
                      <tr class="bg-gray-100">
                        <th class="border border-gray-400 px-2 py-1 w-16 text-center">No</th>
                        <th class="border border-gray-400 px-2 py-1">Dokumen</th>
                        <th class="border border-gray-400 px-2 py-1 w-40 text-center">Tindakan</th>
                        <th class="border border-gray-400 px-2 py-1">Catatan</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(row, i) in lzsDokumenRows" :key="row.id">
                        <td class="border border-gray-400 px-2 py-1 text-center">
                          {{ i + 1 }}
                        </td>

                        <!-- Dokumen (input text) -->
                        <td class="border border-gray-400 px-2 py-1">
                          <input
                            v-model="row.dokumen"
                            type="text"
                            class="w-full border-gray-300 rounded px-2 py-1"
                            placeholder="Nama/rujukan dokumen"
                          />
                        </td>

                        <!-- Action (Lihat, Upload) -->
                        <td class="border border-gray-400 px-2 py-1">
                          <div class="flex items-center justify-center gap-3">
                            <button
                              type="button"
                              class="text-primary underline disabled:text-gray-400"
                              :disabled="!canViewLzs(row)"
                              @click="viewLzsDoc(row)"
                              title="Lihat"
                            >
                              Lihat
                            </button>

                            <!-- Upload -->
                            <label class="cursor-pointer text-primary underline">
                              <input
                                type="file"
                                class="hidden"
                                accept=".pdf,.jpg,.jpeg,.png"
                                @change="onLzsFileChange(i, $event)"
                              />
                              Upload
                            </label>
                          </div>

                          <!-- Nama fail ringkas bila sudah upload -->
                          <div v-if="row.fileName" class="text-xs text-gray-600 mt-1 truncate">
                            {{ row.fileName }}
                          </div>
                        </td>

                        <!-- Catatan -->
                        <td class="border border-gray-400 px-2 py-1">
                          <input
                            v-model="row.catatan"
                            type="text"
                            class="w-full border-gray-300 rounded px-2 py-1"
                            placeholder="Catatan (jika ada)"
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- (Pilihan) Tambah/Buang baris -->
                <div class="flex gap-3 mt-3 justify-end">
                  <rs-button type="button" variant="primary" @click="addLzsRow">Tambah</rs-button>
                  <rs-button
                    type="button"
                    variant="danger"
                    @click="removeLzsRow"
                    :disabled="lzsDokumenRows.length <= 1"
                  >
                    Buang
                  </rs-button>
                </div>
              </template>
            </rs-card>

          </FormKit>
        </div>

        <div class="lg:col-span-1 space-y-6">
          <!-- 3.7 Maklumat Tindakan (Sidebar) -->
          <rs-card class="shadow-sm border-0 bg-white sticky top-6">
            <template #header>
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <Icon name="ph:clipboard-text" class="w-6 h-6 text-red-600" />
                  </div>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-gray-900">Maklumat Tindakan</h2>
                  <p class="text-sm text-gray-500">Pilih tindakan dan kemaskini catatan</p>
                </div>
              </div>
            </template>
            <template #body>
              <div class="space-y-4">
                <div v-if="showBorangSiasatanButton">
                  <rs-button variant="secondary" @click="openBorangSiasatanTunai">
                    Borang Siasatan Tunai (Kaunter Ekspres)
                  </rs-button>
                </div>

                <FormKit
                  v-if="showTindakanDropdown"
                  type="select"
                  name="tindakan"
                  label="Tindakan"
                  v-model="formData.tindakan"
                  :options="tindakanOptions"
                />

                <FormKit
                  type="text"
                  name="catatan"
                  label="Catatan"
                  v-model="formData.catatan"
                />

                <div class="flex justify-end gap-2 pt-2">
                  <rs-button variant="secondary" @click="onSave">Simpan</rs-button>
                  <rs-button variant="primary" @click="handleSubmit(formData)">Hantar Permohonan</rs-button>
                  <rs-button @click="handleCancel">Kembali</rs-button>
                </div>
              </div>
            </template>
          </rs-card>

          <!-- Senarai Entitlement Product Cards -->
          <rs-card v-if="selectedEntitlementProducts.length > 0" class="shadow-sm border-0 bg-white">
            <template #header>
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div class="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Icon name="ph:gift" class="w-6 h-6 text-indigo-600" style="display: inline-block;" />
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
                    v-for="(product, index) in selectedEntitlementProducts" 
                    :key="index"
                    class="relative border rounded-lg p-4 transition-all duration-200 hover:shadow-md border-gray-200 bg-white"
                  >
                    <!-- Status Badge -->
                    <div class="absolute top-2 right-2">
                      <rs-badge variant="primary" class="text-xs">
                        Dipilih
                      </rs-badge>
                    </div>

                    <!-- Product Info -->
                    <div class="pr-16">
                      <h3 class="font-semibold text-gray-900 text-sm mb-2">{{ product.name }}</h3>
                      <p class="text-xs text-gray-600 mb-1">{{ product.code }}</p>
                      <p class="text-xs text-gray-600 mb-3">{{ product.category }}</p>
                    </div>

                    <!-- Basic Info Display -->
                    <div class="mt-4 space-y-2">
                      <div class="bg-gray-50 p-3 rounded-lg">
                        <div class="flex items-center space-x-2 mb-2">
                          <div class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                            <Icon name="ph:currency-dollar" class="w-4 h-4 text-green-600" style="display: inline-block;" />
                          </div>
                          <h4 class="text-sm font-semibold text-gray-700">Maklumat Bantuan</h4>
                        </div>
                        <div class="text-sm text-gray-600">
                          <p>Jenis: {{ product.name }}</p>
                          <p>Status: Menunggu pemprosesan</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Empty State -->
                  <div v-if="selectedEntitlementProducts.length === 0" class="col-span-full text-center py-8 text-gray-500">
                    <Icon name="ph:gift" class="w-12 h-12 mx-auto mb-2 text-gray-400" style="display: inline-block;" />
                    <p class="text-sm">Tiada entitlement product dipilih. Pilih checkbox di atas untuk menambah.</p>
                  </div>
                </div>
              </div>
            </template>
          </rs-card>
        </div>
      </div>
  
      <!-- Success Modal -->
      <rs-modal v-model="showSuccessModal" position="center">
        <template #header>
          <h3 class="text-lg font-medium">Permohonan Berjaya</h3>
        </template>
        <template #body>
          <div class="text-center">
            <div class="flex justify-center mb-4">
              <Icon
                name="material-symbols:check-circle"
                class="text-green-500"
                size="48"
              />
            </div>
            <p class="mb-2">Permohonan bantuan anda telah berjaya dihantar.</p>
            <p class="text-gray-600">
              Nombor Rujukan: {{ nomorRujukan }}<br />
              Status: Diterima<br />
              Tarikh: {{ formatDate(new Date()) }}
            </p>
          </div>
        </template>
        <template #footer>
          <div class="flex justify-center">
            <rs-button variant="primary" @click="handleViewStatus">
              Pergi ke Senarai Permohonan
            </rs-button>
          </div>
        </template>
      </rs-modal>
  
      <!-- Confirmation Modal -->
      <rs-modal
        v-model="showConfirmationModal"
        title="Pengesahan"
        position="center"
        ok-title="Ya, Hantar"
        :ok-callback="confirmSubmit"
        cancel-title="Batal"
        :cancel-callback="() => (showConfirmationModal = false)"
      >
        <template #default>
          <p class="text-center mb-6">
            Adakah anda pasti untuk menghantar permohonan bantuan ini?
          </p>
        </template>
      </rs-modal>

      <!-- Modal: Tambah Penerima Baharu -->
      <rs-modal v-model="showAddRegistration" title="Tambah Penerima Baharu">
        <div class="space-y-3">
          <!-- Hide existing fields and show only Kategori Penerima -->
          <div>
            <label class="text-xs font-medium text-gray-600">Kategori Penerima <span class="text-red-500">*</span></label>
            <select v-model="newRegistration.kategoriPenerima" class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="">-- Sila Pilih --</option>
              <option value="organisasi">Organisasi</option>
              <option value="syarikat">Syarikat</option>
              <option value="recipient">Recipient</option>
            </select>
          </div>
        </div>
        <template #footer>
          <div class="flex justify-end gap-2">
            <rs-button variant="secondary" @click="showAddRegistration = false">Batal</rs-button>
            <rs-button variant="primary" @click="proceedToNextStep">Seterusnya</rs-button>
          </div>
        </template>
      </rs-modal>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, watch, nextTick } from "vue";
  import { useRouter } from "vue-router";
  import CustomSelect from '~/components/CustomSelect.vue';
  
  definePageMeta({
    title: "Permohonan Bantuan",
    description: "Halaman untuk memohon bantuan",
  });
  
  const router = useRouter();
  const formData = ref({
    tarikhMula: '',
    tempoh: '',
    kadarBantuan: '',
    tarikhTamat: '',
    penerimaManfaatNama: '',
    penerimaManfaatJenisPengenalan: '',
    penerimaManfaatNoPengenalan: '',
    penerimaManfaatHubungan: '',
    entitlementProduct: []
  });
  
  // Separate reactive variable for registration selection
  const selectedRegistration = ref('');
  const showSuccessModal = ref(false);
  const showConfirmationModal = ref(false);
  const nomorRujukan = ref("");
  
  // Mock user profile data - replace with actual data from your auth system
  const userProfile = ref({
    nama: "Muhammad Ali bin Abu",
    noKadPengenalan: "901231012345",
    statusHousehold: "Fakir",
    statusIndividu: "Fakir",
    jenisPengenalan: "MyKad",
    statusMultidimensi: "Asnaf Tidak Produktif",
  });
  
  // Mock staff check - replace with actual auth check
  const isStaff = computed(() => false);
  
  // Load the bantuan data from JSON
  const bantuanData = ref({});
  
  // Import the bantuan data directly
  import bantuanJson from "../PB/mohon-bantuan/Grouped by Aid Code.json";
  
  // Set the bantuan data on component mount
  onMounted(() => {
    try {
      bantuanData.value = bantuanJson;
      console.log("Loaded bantuan data:", bantuanData.value);
    } catch (error) {
      console.error("Error loading bantuan data:", error);
    }
  });

  // 3.2 Dependents (mock data for prototype)
  const dependents = ref([
    {
      id: "",
      nama: "-- Pilih --",
      jenisPengenalan: "",
      noPengenalan: "",
      hubungan: "",
      disabled: true,
    },
    {
      id: "1",
      nama: "Muhammad Ali bin Abu",
      jenisPengenalan: "MyKad",
      noPengenalan: "901231-01-2345",
      hubungan: "Diri Sendiri",
    },
    {
      id: "2",
      nama: "Siti Nurliza binti Ahmad",
      jenisPengenalan: "MyKad",
      noPengenalan: "901215-02-2346",
      hubungan: "Isteri",
    },
    {
      id: "3",
      nama: "Siti binti Muhammad Ali",
      jenisPengenalan: "MyKad",
      noPengenalan: "201203-03-2348",
      hubungan: "Anak",
    },
    {
      id: "4",
      nama: "Ahmadi bin Muhammad Ali",
      jenisPengenalan: "MyKad",
      noPengenalan: "201504-04-2347",
      hubungan: "Anak",
    },
  ]);
  const selectedDependentId = ref("");
  const penerimaManfaatJenisPengenalan = ref("");
  const penerimaManfaatNoPengenalan = ref("");
  const penerimaManfaatHubungan = ref("");
  
  const dependentsOptions = computed(() =>
    dependents.value.map((d) => ({ label: d.nama, value: d.id, disabled: !!d.disabled }))
  );
  const selectedDependent = computed(() => {
    const found = dependents.value.find((d) => d.id === selectedDependentId.value);
    console.log('Selected dependent computed:', found);
    return found;
  });
  const onDependentChange = (value) => {
    selectedDependentId.value = value;
    console.log('Selected dependent ID:', value);
    
    if (value) {
      const selectedDep = dependents.value.find(d => d.id === value);
      if (selectedDep) {
        // Special handling for Muhammad Ali bin Abu - generate random No. Kad Pengenalan
        if (value === "1") { // Muhammad Ali bin Abu
          // Generate realistic Malaysian IC format: YYMMDD-XX-XXXX
          // Last digit should be odd for male
          const year = "90";
          const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
          const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
          const state = String(Math.floor(Math.random() * 99) + 1).padStart(2, '0');
          const randomDigits = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
          const lastDigit = String(Math.floor(Math.random() * 5) * 2 + 1); // Odd number (1,3,5,7,9)
          const randomNo = `${year}${month}${day}-${state}-${randomDigits}${lastDigit}`;
          selectedDep.noPengenalan = randomNo;
          console.log('Updated Muhammad Ali data:', selectedDep);
        }
        
        // Update the form fields
        penerimaManfaatJenisPengenalan.value = selectedDep.jenisPengenalan || '';
        penerimaManfaatNoPengenalan.value = selectedDep.noPengenalan || '';
        penerimaManfaatHubungan.value = selectedDep.hubungan || '';
        
        console.log('Updated form fields:', {
          jenisPengenalan: penerimaManfaatJenisPengenalan.value,
          noPengenalan: penerimaManfaatNoPengenalan.value,
          hubungan: penerimaManfaatHubungan.value
        });
      }
    } else {
      // Clear fields if no selection
      penerimaManfaatJenisPengenalan.value = '';
      penerimaManfaatNoPengenalan.value = '';
      penerimaManfaatHubungan.value = '';
    }
  };
  
  // Compute jenis bantuan options from the JSON data
  const jenisBantuanOptions = computed(() => {
    if (!bantuanData.value.bantuan) return [];
    
    const options = Object.entries(bantuanData.value.bantuan).map(([categoryName]) => ({
      label: categoryName,
      value: categoryName,
    }));
  
    return [
      { label: "-- Pilih --", value: "", disabled: true },
      ...options.sort((a, b) => a.label.localeCompare(b.label))
    ];
  });
  
  // Compute aid product options based on selected jenis bantuan
  const aidProductOptions = computed(() => {
    if (!formData.value.jenisBantuan || !bantuanData.value.bantuan) {
      return [{ label: "-- Pilih --", value: "", disabled: true }];
    }
  
    const category = bantuanData.value.bantuan[formData.value.jenisBantuan];
    if (!category) return [{ label: "-- Pilih --", value: "", disabled: true }];
  
    const options = Object.entries(category).map(([productName]) => ({
      label: productName,
      value: productName,
    }));
  
    return [
      { label: "-- Pilih --", value: "", disabled: true },
      ...options.sort((a, b) => a.label.localeCompare(b.label))
    ];
  });
  
  // Compute product package options based on selected aid product
  const productPackageOptions = computed(() => {
    if (!formData.value.jenisBantuan || !formData.value.aidProduct || !bantuanData.value.bantuan) {
      return [{ label: "-- Pilih --", value: "", disabled: true }];
    }
  
    const category = bantuanData.value.bantuan[formData.value.jenisBantuan];
    if (!category || !category[formData.value.aidProduct]) {
      return [{ label: "-- Pilih --", value: "", disabled: true }];
    }
  
    const options = category[formData.value.aidProduct].map((pkg) => ({
      label: pkg,
      value: pkg,
    }));
  
    return [
      { label: "-- Pilih --", value: "", disabled: true },
      ...options.sort((a, b) => a.label.localeCompare(b.label))
    ];
  });
  
  const kaedahPembayaranOptions = [
    { label: "-- Pilih --", value: "", disabled: true },
    { label: "Tunai", value: "TUNAI" },
    { label: "Bank In", value: "BANK_IN" },
    { label: "Tunai (Kaunter Ekspres)", value: "E_WALLET" },
  ];

  // 3.4 Maklumat Kadar Bantuan helpers
  const maxKadarBantuan = computed(() => {
    // Prototype rule: base on statusHousehold and number of dependents
    const base = userProfile.value.statusHousehold === "Fakir" ? 800 : 600;
    const dependentCount = Math.max(0, dependents.value.length - 1); // exclude placeholder
    return base + dependentCount * 50;
  });
  const computedTarikhTamat = computed(() => {
    try {
      console.log('Computed: tarikhMula =', formData.value.tarikhMula, 'tempoh =', formData.value.tempoh);
      
      if (!formData.value.tarikhMula || !formData.value.tempoh) {
        console.log('Computed: Missing values, returning empty');
        return "";
      }
      
      const start = new Date(formData.value.tarikhMula);
      if (isNaN(start.getTime())) {
        console.log('Computed: Invalid start date');
        return "";
      }
      
      const end = new Date(start);
      const tempohValue = Number(formData.value.tempoh);
      if (isNaN(tempohValue) || tempohValue <= 0) {
        console.log('Computed: Invalid tempoh value:', tempohValue);
        return "";
      }
      
      end.setMonth(end.getMonth() + tempohValue);
      if (isNaN(end.getTime())) {
        console.log('Computed: Invalid end date');
        return "";
      }
      
      const result = end.toISOString().slice(0, 10);
      console.log('Computed: Result =', result);
      return result;
    } catch (error) {
      console.error('Error calculating tarikh tamat:', error);
      return "";
    }
  });

  // Watch for changes in computedTarikhTamat and update formData.tarikhTamat
  watch(computedTarikhTamat, (newValue) => {
    console.log('Watcher: computedTarikhTamat changed to:', newValue);
    formData.value.tarikhTamat = newValue;
    console.log('Watcher: formData.tarikhTamat set to:', formData.value.tarikhTamat);
  }, { immediate: true });

  // Also watch for changes in tarikhMula and tempoh to force update
  watch([() => formData.value.tarikhMula, () => formData.value.tempoh], async () => {
    console.log('Direct update triggered');
    const newValue = computedTarikhTamat.value;
    formData.value.tarikhTamat = newValue;
    console.log('Direct update: formData.tarikhTamat set to:', newValue);
    
    // Force DOM update
    await nextTick();
    console.log('After nextTick: formData.tarikhTamat =', formData.value.tarikhTamat);
  });
  const jumlahKeseluruhan = computed(() => {
    const kadar = Number(formData.value.kadarBantuan || 0);
    const tempoh = Number(formData.value.tempoh || 0);
    return kadar * tempoh;
  });
  const jumlahKeseluruhanFormatted = computed(() => {
    return `RM ${Number(jumlahKeseluruhan.value || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  });

  // 3.3 Maklumat Permohonan Bantuan helpers
  const aidTypeOptions = [
    { label: "-- Pilih Jenis Bantuan --", value: "", disabled: true },
    { label: "B102 - (HQ) BANTUAN BINAAN RUMAH (FAKIR)", value: "B102" },
    { label: "B104 - BANTUAN PEMBELIAN RUMAH KOS RENDAH /SEDERHANA (FAKIR)", value: "B104" },
  ];

  // Aid Product options based on selected Aid Type
  const aidProductOptionsCustom = computed(() => {
    if (!formData.value.aidType) {
      return [{ label: "-- Pilih Aid terlebih dahulu --", value: "", disabled: true }];
    }

    const baseOption = { label: "-- Pilih Produk Bantuan --", value: "", disabled: true };

    if (formData.value.aidType === "B102") {
      return [
        baseOption,
        { label: "(HQ) BANTUAN BINAAN RUMAH (FAKIR)", value: "HQ_BINAAN_RUMAH" },
        { label: "(HQ) BANTUAN PEMBELIAN RUMAH KOS RENDAH/SEDERHANA (FAKIR)", value: "HQ_PEMBELIAN_RUMAH" },
      ];
    }

    if (formData.value.aidType === "B104") {
      return [
        baseOption,
        { label: "KATEGORI PENDIDIKAN (FAKIR)", value: "KATEGORI_PENDIDIKAN" },
        { label: "KATEGORI MAKAN/MINUM (FAKIR)", value: "KATEGORI_MAKAN_MINUM" },
        { label: "KATEGORI RAWATAN/PERUBATAN (FAKIR)", value: "KATEGORI_RAWATAN" },
        { label: "KATEGORI PAKAIAN ASAS (FAKIR)", value: "KATEGORI_PAKAIAN" },
        { label: "KATEGORI PENGANGKUTAN (FAKIR)", value: "KATEGORI_PENGANGKUTAN" },
        { label: "KATEGORI TEMPAT TINGGAL/RUMAH (FAKIR)", value: "KATEGORI_TEMPAT_TINGGAL" },
      ];
    }

    return [{ label: "-- Pilih Aid terlebih dahulu --", value: "", disabled: true }];
  });

  // Watch for changes in Aid Type and reset Aid Product
  watch(() => formData.value.aidType, (newAidType, oldAidType) => {
    if (newAidType !== oldAidType) {
      formData.value.aidProduct = "";
    }
  });

  // Product Package options based on selected Aid Product
  const productPackageOptionsCustom = computed(() => {
    if (!formData.value.aidProduct) {
      return [{ label: "-- Pilih Aid Product terlebih dahulu --", value: "", disabled: true }];
    }

    const baseOption = { label: "-- Pilih Pakej Produk --", value: "", disabled: true };

    if (formData.value.aidProduct === "HQ_BINAAN_RUMAH") {
      return [
        baseOption,
        { label: "(PEROLEHAN) BINA RUMAH (FAKIR)", value: "PEROLEHAN_BINA_RUMAH" },
        { label: "(WO) 3 BILIK (FAKIR) - TANGGUNGAN 3-6 ORANG", value: "WO_3_BILIK" },
        { label: "PEMANTAUAN DAN PENGAWASAN TAPAK PROJEK (FAKIR)", value: "PEMANTAUAN_PENGAWASAN" },
      ];
    }

    if (formData.value.aidProduct === "HQ_PEMBELIAN_RUMAH") {
      return [
        baseOption,
        { label: "(HQ) ANSURAN TERTUNGGAK (FAKIR)", value: "HQ_ANSURAN_TERTUNGGAK" },
        { label: "(HQ) BAKI AKHIR (FAKIR)", value: "HQ_BAKI_AKHIR" },
        { label: "(HQ) BAYARAN DEPOSIT PEMBELIAN(FAKIR)", value: "HQ_BAYARAN_DEPOSIT" },
        { label: "(HQ) PEMBELIAN RUMAH PBT (FAKIR)", value: "HQ_PEMBELIAN_RUMAH_PBT" },
        { label: "(HQ) SEPARA PEMBIAYAAN (FAKIR)", value: "HQ_SEPARA_PEMBIAYAAN" },
      ];
    }

    // For B104 products - specific packages based on categories
    if (formData.value.aidProduct === "KATEGORI_PENDIDIKAN") {
      return [
        baseOption,
        { label: "KECEMASAN (FAKIR) - PENDIDIKAN (PERALATAN DAN KEPERLUAN PEMBELAJARAN)", value: "KECEMASAN_PENDIDIKAN" },
        { label: "KEPERLUAN PENDIDIKAN (FAKIR) - SELEPAS TAHUN PERTAMA", value: "KEPERLUAN_SELEPAS_TAHUN" },
        { label: "KEPERLUAN PENDIDIKAN (FAKIR) - TAHUN PERTAMA", value: "KEPERLUAN_TAHUN_PERTAMA" },
        { label: "TUNGGAKAN YURAN SEKOLAH/IPT (FAKIR)", value: "TUNGGAKAN_YURAN" },
      ];
    }

    if (formData.value.aidProduct === "KATEGORI_MAKAN_MINUM") {
      return [
        baseOption,
        { label: "KEPERLUAN MAKAN/MINUM (FAKIR)", value: "KEPERLUAN_MAKAN_MINUM" },
      ];
    }

    if (formData.value.aidProduct === "KATEGORI_RAWATAN") {
      return [
        baseOption,
        { label: "(PTJ) KEPERLUAN RAWATAN/PERUBATAN (FAKIR) - BIL RAWATAN ASAS SEMASA", value: "PTJ_BIL_RAWATAN_ASAS" },
        { label: "(PTJ) KEPERLUAN RAWATAN/PERUBATAN (FAKIR) - PERALATAN SOKONGAN ASAS PERUBATAN", value: "PTJ_PERALATAN_SOKONGAN" },
        { label: "(PTJ) KEPERLUAN RAWATAN/PERUBATAN (FAKIR) - UBAT-UBATAN", value: "PTJ_UBAT_UBATAN" },
        { label: "BANTUAN BERKHITAN", value: "BANTUAN_BERKHITAN" },
        { label: "BANTUAN CERMIN MATA", value: "BANTUAN_CERMIN_MATA" },
        { label: "KEPERLUAN RAWATAN/PERUBATAN (FAKIR) - BIL RAWATAN ASAS SEMASA", value: "BIL_RAWATAN_ASAS" },
        { label: "KEPERLUAN RAWATAN/PERUBATAN (FAKIR) - PERALATAN SOKONGAN ASAS PERUBATAN", value: "PERALATAN_SOKONGAN" },
        { label: "KEPERLUAN RAWATAN/PERUBATAN (FAKIR) - UBAT-UBATAN", value: "UBAT_UBATAN" },
      ];
    }

    if (formData.value.aidProduct === "KATEGORI_PAKAIAN") {
      return [
        baseOption,
        { label: "KEPERLUAN PAKAIAN ASAS (FAKIR)", value: "KEPERLUAN_PAKAIAN_ASAS" },
      ];
    }

    if (formData.value.aidProduct === "KATEGORI_PENGANGKUTAN") {
      return [
        baseOption,
        { label: "(DIRECT) KEPERLUAN PENGANGKUTAN PERUBATAN (FAKIR)", value: "DIRECT_PENGANGKUTAN_PERUBATAN" },
        { label: "(GL) KEPERLUAN PENGANGKUTAN PERUBATAN (FAKIR)", value: "GL_PENGANGKUTAN_PERUBATAN_1" },
        { label: "(GL) KEPERLUAN PENGANGKUTAN PERUBATAN (FAKIR)", value: "GL_PENGANGKUTAN_PERUBATAN_2" },
      ];
    }

    if (formData.value.aidProduct === "KATEGORI_TEMPAT_TINGGAL") {
      return [
        baseOption,
        { label: "KATEGORI TEMPAT TINGGAL/RUMAH (FAKIR) - DEPOSIT SEWA RUMAH", value: "DEPOSIT_SEWA_RUMAH" },
        { label: "KEPERLUAN TEMPAT TINGGAL/RUMAH (FAKIR)", value: "KEPERLUAN_TEMPAT_TINGGAL" },
        { label: "KEPERLUAN TEMPAT TINGGAL/RUMAH (FAKIR) - TUNGGAKAN SEWA", value: "TUNGGAKAN_SEWA" },
      ];
    }

    // For other B104 products, we can add default packages or return empty for now
    if (formData.value.aidType === "B104") {
      return [
        baseOption,
        { label: "PAKEJ STANDARD", value: "PAKEJ_STANDARD" },
      ];
    }

    return [{ label: "-- Pilih Aid Product terlebih dahulu --", value: "", disabled: true }];
  });

  // Watch for changes in Aid Product and reset Product Package
  watch(() => formData.value.aidProduct, (newAidProduct, oldAidProduct) => {
    if (newAidProduct !== oldAidProduct) {
      formData.value.productPackage = "";
      formData.value.entitlementProduct = [];
    }
  });

  // Entitlement Product options based on selected Product Package
  const entitlementProductOptions = computed(() => {
    if (!formData.value.productPackage) {
      return [{ label: "-- Pilih Product Package terlebih dahulu --", value: "", disabled: true }];
    }

    // B102 Housing Construction - HQ_BINAAN_RUMAH
    if (formData.value.productPackage === "PEROLEHAN_BINA_RUMAH") {
      return [
        { label: "(PEROLEHAN) BINA RUMAH (FAKIR)", value: "PEROLEHAN_BINA_RUMAH_ENTITLEMENT" },
      ];
    }

    if (formData.value.productPackage === "PAKEJ_BINAAN_STANDARD") {
      return [
        { label: "(PEROLEHAN) BINA RUMAH (FAKIR)", value: "PEROLEHAN_BINA_RUMAH" },
      ];
    }

    if (formData.value.productPackage === "WO_3_BILIK") {
      return [
        { label: "(WO) 3 BILIK (FAKIR) - TANGGUNGAN 3-6 ORANG", value: "WO_3_BILIK_TANGGUNGAN_3_6_ENTITLEMENT" },
      ];
    }

    if (formData.value.productPackage === "PEMANTAUAN_PENGAWASAN") {
      return [
        { label: "(PEROLEHAN) PEMANTAUAN DAN PENGAWASAN TAPAK PROJEK (FAKIR)", value: "PEROLEHAN_PEMANTAUAN_PENGAWASAN_ENTITLEMENT" },
        { label: "(WO) PEMANTAUAN DAN PENGAWASAN TAPAK PROJEK (FAKIR)", value: "WO_PEMANTAUAN_PENGAWASAN_ENTITLEMENT" },
      ];
    }

    if (formData.value.productPackage === "PAKEJ_BINAAN_PREMIUM") {
      return [
        { label: "(WO) 3 BILIK (FAKIR) - TANGGUNGAN 3-6 ORANG", value: "WO_3_BILIK_TANGGUNGAN_3_6" },
        { label: "(PEROLEHAN) PEMANTAUAN DAN PENGAWASAN TAPAK PROJEK (FAKIR)", value: "PEROLEHAN_PEMANTAUAN_PENGAWASAN" },
        { label: "(WO) PEMANTAUAN DAN PENGAWASAN TAPAK PROJEK (FAKIR)", value: "WO_PEMANTAUAN_PENGAWASAN" },
      ];
    }

    // B102 Housing Purchase - HQ_PEMBELIAN_RUMAH
    if (formData.value.productPackage === "HQ_ANSURAN_TERTUNGGAK") {
      return [
        { label: "(HQ) ANSURAN TERTUNGGAK (FAKIR)", value: "HQ_ANSURAN_TERTUNGGAK_ENTITLEMENT" },
      ];
    }

    if (formData.value.productPackage === "HQ_BAKI_AKHIR") {
      return [
        { label: "(HQ) BAKI AKHIR (FAKIR)", value: "HQ_BAKI_AKHIR_ENTITLEMENT" },
      ];
    }

    if (formData.value.productPackage === "HQ_BAYARAN_DEPOSIT") {
      return [
        { label: "(HQ) BAYARAN DEPOSIT PEMBELIAN (FAKIR)", value: "HQ_BAYARAN_DEPOSIT_PEMBELIAN_ENTITLEMENT" },
      ];
    }

    if (formData.value.productPackage === "HQ_PEMBELIAN_RUMAH_PBT") {
      return [
        { label: "(DIRECT) LEGAL FEE (FAKIR)", value: "DIRECT_LEGAL_FEE_ENTITLEMENT" },
        { label: "(DIRECT) PEMBAYARAN BAKI 90% (FAKIR)", value: "DIRECT_PEMBAYARAN_BAKI_90_ENTITLEMENT" },
        { label: "(DIRECT) PEMBAYARAN PENDAHULUAN 10% (FAKIR)", value: "DIRECT_PEMBAYARAN_PENDAHULUAN_10_ENTITLEMENT" },
      ];
    }

    if (formData.value.productPackage === "HQ_SEPARA_PEMBIAYAAN") {
      return [
        { label: "(HQ) SEPARA PEMBIAYAAN (FAKIR)", value: "HQ_SEPARA_PEMBIAYAAN_ENTITLEMENT" },
      ];
    }

    if (formData.value.productPackage === "PAKEJ_PEMBELIAN_STANDARD") {
      return [
        { label: "(HQ) INSURAN TERTUNGGAK (FAKIR)", value: "HQ_INSURAN_TERTUNGGAK" },
        { label: "(HQ) BAKI AKHIR (FAKIR)", value: "HQ_BAKI_AKHIR" },
      ];
    }

    if (formData.value.productPackage === "HQ_SEPARA_PEMBIAYAAN") {
      return [
        { label: "(HQ) BAYARAN DEPOSIT PEMBELIAN (FAKIR)", value: "HQ_BAYARAN_DEPOSIT_PEMBELIAN" },
        { label: "(DIRECT) LEGAL FEE (FAKIR)", value: "DIRECT_LEGAL_FEE" },
        { label: "(DIRECT) PEMBAYARAN BAKI 90% (FAKIR)", value: "DIRECT_PEMBAYARAN_BAKI_90" },
        { label: "(DIRECT) PEMBAYARAN PENDAHULUAN 10% (FAKIR)", value: "DIRECT_PEMBAYARAN_PENDAHULUAN_10" },
      ];
    }

    if (formData.value.productPackage === "PAKEJ_PEMBELIAN_PREMIUM") {
      return [
        { label: "(HQ) PEMBELIAN RUMAH PPR (FAKIR)", value: "HQ_PEMBELIAN_RUMAH_PPR" },
      ];
    }

    // B104 Education
    if (formData.value.productPackage === "KECEMASAN_PENDIDIKAN") {
      return [
        { label: "KECEMASAN (FAKIR) - PENDIDIKAN (PERALATAN DAN KEPERLUAN PEMBELAJARAN)", value: "KECEMASAN_PENDIDIKAN_PERALATAN_ENTITLEMENT" },
      ];
    }

    if (formData.value.productPackage === "KEPERLUAN_SELEPAS_TAHUN") {
      return [
        { label: "KEPERLUAN PENDIDIKAN (FAKIR) - KOS YURAN BULANAN SELEPAS TAHUN PERTAMA", value: "KEPERLUAN_PENDIDIKAN_KOS_YURAN_SELEPAS" },
        { label: "KEPERLUAN PENDIDIKAN (FAKIR) - PERALATAN DAN KEPERLUAN PEMBELAJARAN SELEPAS TAHUN PERTAMA", value: "KEPERLUAN_PENDIDIKAN_PERALATAN_SELEPAS" },
      ];
    }

    if (formData.value.productPackage === "KEPERLUAN_TAHUN_PERTAMA") {
      return [
        { label: "KEPERLUAN PENDIDIKAN (FAKIR) - KOS YURAN BULANAN TAHUN PERTAMA", value: "KEPERLUAN_PENDIDIKAN_KOS_YURAN_PERTAMA" },
        { label: "KEPERLUAN PENDIDIKAN (FAKIR) - PERALATAN DAN KEPERLUAN PEMBELAJARAN TAHUN PERTAMA", value: "KEPERLUAN_PENDIDIKAN_PERALATAN_PERTAMA" },
        { label: "KEPERLUAN PENDIDIKAN (FAKIR) - PERSEDIAAN MASUK SEKOLAH ATAU IPT TAHUN PERTAMA", value: "KEPERLUAN_PENDIDIKAN_PERSEDIAAN_PERTAMA" },
      ];
    }

    if (formData.value.productPackage === "TUNGGAKAN_YURAN") {
      return [
        { label: "TUNGGAKAN YURAN SEKOLAH/IPT (FAKIR)", value: "TUNGGAKAN_YURAN_SEKOLAH" },
      ];
    }

    // B104 Food/Drink
    if (formData.value.productPackage === "KEPERLUAN_MAKAN_MINUM") {
      return [
        { label: "KEPERLUAN MAKAN/MINUM (FAKIR)", value: "KEPERLUAN_MAKAN_MINUM_FAKIR" },
      ];
    }

    // B104 Medical/Treatment
    if (formData.value.productPackage === "PTJ_BIL_RAWATAN_ASAS") {
      return [
        { label: "(PTJ) KEPERLUAN RAWATAN/PERUBATAN (FAKIR) - BIL RAWATAN ASAS SEMASA", value: "PTJ_BIL_RAWATAN_ASAS_SEMASA" },
      ];
    }

    if (formData.value.productPackage === "PTJ_PERALATAN_SOKONGAN") {
      return [
        { label: "(PTJ) KEPERLUAN RAWATAN/PERUBATAN (FAKIR) - PERALATAN SOKONGAN ASAS PERUBATAN", value: "PTJ_PERALATAN_SOKONGAN_ASAS" },
      ];
    }

    if (formData.value.productPackage === "PTJ_UBAT_UBATAN") {
      return [
        { label: "(PTJ) KEPERLUAN RAWATAN/PERUBATAN (FAKIR) - UBAT-UBATAN", value: "PTJ_UBAT_UBATAN_RAWATAN" },
      ];
    }

    if (formData.value.productPackage === "BANTUAN_BERKHITAN") {
      return [
        { label: "(DIRECT) BANTUAN BERKHITAN", value: "DIRECT_BANTUAN_BERKHITAN" },
        { label: "(GL) BANTUAN BERKHITAN", value: "GL_BANTUAN_BERKHITAN" },
      ];
    }

    if (formData.value.productPackage === "BANTUAN_CERMIN_MATA") {
      return [
        { label: "(DIRECT) CERMIN MATA", value: "DIRECT_CERMIN_MATA" },
        { label: "(GL) CERMIN MATA", value: "GL_CERMIN_MATA" },
      ];
    }

    if (formData.value.productPackage === "BIL_RAWATAN_ASAS") {
      return [
        { label: "KEPERLUAN RAWATAN/PERUBATAN (FAKIR) - BIL RAWATAN ASAS SEMASA", value: "BIL_RAWATAN_ASAS_SEMASA" },
      ];
    }

    if (formData.value.productPackage === "PERALATAN_SOKONGAN") {
      return [
        { label: "KEPERLUAN RAWATAN/PERUBATAN (FAKIR) - PERALATAN SOKONGAN ASAS PERUBATAN", value: "PERALATAN_SOKONGAN_ASAS_PERUBATAN" },
      ];
    }

    if (formData.value.productPackage === "UBAT_UBATAN") {
      return [
        { label: "KEPERLUAN RAWATAN/PERUBATAN (FAKIR) - UBAT-UBATAN", value: "UBAT_UBATAN_RAWATAN" },
      ];
    }

    // B104 Clothing
    if (formData.value.productPackage === "KEPERLUAN_PAKAIAN_ASAS") {
      return [
        { label: "KEPERLUAN PAKAIAN ASAS (FAKIR)", value: "KEPERLUAN_PAKAIAN_ASAS_FAKIR" },
      ];
    }

    // B104 Transportation
    if (formData.value.productPackage === "DIRECT_PENGANGKUTAN_PERUBATAN") {
      return [
        { label: "(DIRECT) KEPERLUAN PENGANGKUTAN PERUBATAN (FAKIR)", value: "DIRECT_KEPERLUAN_PENGANGKUTAN" },
      ];
    }

    if (formData.value.productPackage === "GL_PENGANGKUTAN_PERUBATAN_1") {
      return [
        { label: "(GL) KEPERLUAN PENGANGKUTAN PERUBATAN (FAKIR)", value: "GL_KEPERLUAN_PENGANGKUTAN_1" },
      ];
    }

    if (formData.value.productPackage === "GL_PENGANGKUTAN_PERUBATAN_2") {
      return [
        { label: "(GL) KEPERLUAN PENGANGKUTAN PERUBATAN (FAKIR)", value: "GL_KEPERLUAN_PENGANGKUTAN_2" },
      ];
    }

    // B104 Housing
    if (formData.value.productPackage === "DEPOSIT_SEWA_RUMAH") {
      return [
        { label: "KATEGORI TEMPAT TINGGAL/RUMAH (FAKIR) - DEPOSIT SEWA RUMAH", value: "KATEGORI_DEPOSIT_SEWA_RUMAH" },
      ];
    }

    if (formData.value.productPackage === "KEPERLUAN_TEMPAT_TINGGAL") {
      return [
        { label: "KEPERLUAN TEMPAT TINGGAL/RUMAH (FAKIR)", value: "KEPERLUAN_TEMPAT_TINGGAL_RUMAH" },
      ];
    }

    if (formData.value.productPackage === "TUNGGAKAN_SEWA") {
      return [
        { label: "KEPERLUAN TEMPAT TINGGAL/RUMAH (FAKIR) - TUNGGAKAN SEWA", value: "KEPERLUAN_TUNGGAKAN_SEWA_RUMAH" },
      ];
    }

    return [{ label: "-- Pilih Product Package terlebih dahulu --", value: "", disabled: true }];
  });

  // Watch for changes in Product Package and reset Entitlement Product
  watch(() => formData.value.productPackage, (newProductPackage, oldProductPackage) => {
    if (newProductPackage !== oldProductPackage) {
      formData.value.entitlementProduct = [];
    }
  });

  // Selected Entitlement Products (computed from checkbox selections)
  const selectedEntitlementProducts = computed(() => {
    if (!Array.isArray(formData.value.entitlementProduct)) return [];
    
    return formData.value.entitlementProduct.map((value, index) => {
      // Find the option from the current entitlement options
      const options = entitlementProductOptions.value || [];
      const option = options.find(opt => opt.value === value);
      const name = option ? option.label.replace('(HQ) ', '').replace('(DIRECT) ', '').replace('(GL) ', '').replace('(PTJ) ', '').replace(' (FAKIR)', '') : value;
      
      return {
        code: value,
        name: name,
        category: formData.value.aidProduct || 'Unknown Category',
        status: 'baru'
      };
    });
  });

  // 3.4 Maklumat Penerima Bayaran helpers
  const paymentCategoryOptions = [
    { label: "-- Pilih --", value: "", disabled: true },
    { label: "Asnaf", value: "ASNAF" },
    { label: "Lain-lain", value: "LAIN_LAIN" },
  ];

  // Asnaf name options for dropdown
  const asnafNameOptions = [
    { label: "-- Pilih Nama Asnaf --", value: "", disabled: true },
    { label: "Ali Natasha binti Hussain", value: "Ali Natasha binti Hussain" },
    { label: "Ahmad bin Abdullah", value: "Ahmad bin Abdullah" },
    { label: "Siti binti Rahman", value: "Siti binti Rahman" },
    { label: "Muhammad bin Hassan", value: "Muhammad bin Hassan" },
    { label: "Fatimah binti Ibrahim", value: "Fatimah binti Ibrahim" },
    { label: "Omar bin Ali", value: "Omar bin Ali" },
    { label: "Khadijah binti Yusof", value: "Khadijah binti Yusof" },
    { label: "Zainab binti Ahmad", value: "Zainab binti Ahmad" },
  ];

  // Check if should show Asnaf name dropdown
  const showAsnafNameDropdown = computed(() => {
    return (formData.value.kategoriPenerimaBayaran || '').toUpperCase() === 'ASNAF';
  });
  const idTypeOptions = [
    { label: "MyKad", value: "MYKAD" },
    { label: "Passport", value: "PASSPORT" },
    { label: "No SSM", value: "SSM" },
    { label: "No ROS", value: "ROS" },
  ];
  const showJenisPengenalan = computed(() => (formData.value.kategoriPenerimaBayaran || '').toUpperCase() !== '');
  const noIdLabel = computed(() => {
    const kategori = (formData.value.kategoriPenerimaBayaran || '').toUpperCase();
    if (kategori === 'ASNAF') return 'No Kad Pengenalan';
    if (kategori === 'LAIN_LAIN') return 'No Kad Pengenalan/No Pendaftaran';
    return 'No Kad Pengenalan';
  });
  const namaLabel = computed(() => {
    const kategori = (formData.value.kategoriPenerimaBayaran || '').toUpperCase();
    if (kategori === 'ASNAF') return 'Nama Asnaf';
    if (kategori === 'LAIN_LAIN') return 'Nama Penerima';
    return 'Nama Penerima';
  });

  // Registration dropdown for Lain-lain (for organizations)
  const showRegistrationDropdown = computed(() => (formData.value.kategoriPenerimaBayaran || '').toUpperCase() === 'LAIN_LAIN');
  const registrationOptions = ref([
    { label: '-- Sila Pilih --', value: '' },
    { label: '800101101234 - Ahmad bin Saif', value: '800101101234' },
    { label: '202201012345(1234567-W) - Syarikat Maju Jaya', value: '202201012345' },
    { label: '550303109999 - Noraini bt Yusuf', value: '550303109999' },
    { label: '990101019999 - Siti Aminah binti Hassan', value: '990101019999' },
    { label: 'DDC001 - PUSAT DIALISIS DAVITA TANJUNG KARANG', value: 'DDC001' },
    { label: 'FDB002 - FORESIGHT DIALYSIS BANDAR PUNCAK ALAM', value: 'FDB002' },
    { label: 'WAN003 - KLINIK DAN PUSAT DIALISIS WAQAF AN NUR', value: 'WAN003' },
  ]);
  const registrationData = {
    '800101101234': { namaPenerima: 'Ahmad bin Saif', namaPemegangAkaun: 'Ahmad bin Saif', bank: 'Maybank', noAkaunBank: '112233445566' },
    '202201012345': { namaPenerima: 'Syarikat Maju Jaya', namaPemegangAkaun: 'Syarikat Maju Jaya', bank: 'Public Bank', noAkaunBank: '223344556677' },
    '550303109999': { namaPenerima: 'Noraini bt Yusuf', namaPemegangAkaun: 'Noraini bt Yusuf', bank: 'CIMB Bank', noAkaunBank: '334455667788' },
    '990101019999': { namaPenerima: 'Siti Aminah binti Hassan', namaPemegangAkaun: 'Siti Aminah binti Hassan', bank: 'RHB Bank', noAkaunBank: '445566778899' },
    'DDC001': { namaPenerima: 'PUSAT DIALISIS DAVITA TANJUNG KARANG', namaPemegangAkaun: 'PUSAT DIALISIS DAVITA TANJUNG KARANG', bank: 'Maybank', noAkaunBank: '556677889900' },
    'FDB002': { namaPenerima: 'FORESIGHT DIALYSIS BANDAR PUNCAK ALAM', namaPemegangAkaun: 'FORESIGHT DIALYSIS BANDAR PUNCAK ALAM', bank: 'Public Bank', noAkaunBank: '667788990011' },
    'WAN003': { namaPenerima: 'KLINIK DAN PUSAT DIALISIS WAQAF AN NUR', namaPemegangAkaun: 'KLINIK DAN PUSAT DIALISIS WAQAF AN NUR', bank: 'CIMB Bank', noAkaunBank: '778899001122' },
  };
  const loadRecipientByRegistration = () => {
    const reg = selectedRegistration.value;
    console.log('loadRecipientByRegistration called with reg:', reg);
    
    if (registrationData[reg]) {
      console.log('Found registration data:', registrationData[reg]);
      formData.value.namaPenerimaBayaran = registrationData[reg].namaPenerima;
      formData.value.namaPemegangAkaun = registrationData[reg].namaPemegangAkaun;
      formData.value.bank = registrationData[reg].bank;
      formData.value.noAkaunBank = registrationData[reg].noAkaunBank;
      // Ensure payment method enables bank fields for demo
      if (!showBankFields.value) {
        formData.value.kaedahPembayaran = 'EFT';
      }
      registrationStatus.value = 'disahkan'; // Set status as verified when data is loaded
      console.log('Updated formData:', {
        namaPenerimaBayaran: formData.value.namaPenerimaBayaran,
        namaPemegangAkaun: formData.value.namaPemegangAkaun,
        bank: formData.value.bank,
        noAkaunBank: formData.value.noAkaunBank
      });
    } else {
      console.log('No registration data found for:', reg);
      registrationStatus.value = 'belum disahkan'; // Set as unverified if no data found
    }
  };

  // Ensure auto-fill also triggers when the selected registration changes
  watch(() => selectedRegistration.value, (val) => {
    if ((formData.value.kategoriPenerimaBayaran || '').toUpperCase() === 'ORGANISASI' && val) {
      loadRecipientByRegistration();
    }
  });
  const paymentMethodOptions = [
    { label: "EFT", value: "EFT" },
    { label: "Vcash", value: "VCASH" },
    { label: "Cheque", value: "CHEQUE" },
    { label: "TT", value: "TT" },
    { label: "eWallet", value: "EWALLET" },
    { label: "Tunai", value: "TUNAI" },
    { label: "Tunai (Kaunter Ekspres)", value: "TUNAI_KAUNTER" },
    { label: "Tunai (Lapangan)", value: "TUNAI_LAPANGAN" },
  ];
  const showBankFields = computed(() => formData.value.kaedahPembayaran && !formData.value.kaedahPembayaran.toString().toUpperCase().startsWith("TUNAI"));
  const autoRetrieveRecipient = () => {
    // Prototype: when noPengenalanPenerima filled, set mock values
    if (formData.value.noPengenalanPenerima) {
      formData.value.namaPenerimaBayaran = "Nama Penerima Mock";
      if (showBankFields.value) {
        formData.value.namaPemegangAkaun = "Nama Penerima Mock";
        formData.value.bank = "Maybank";
        formData.value.noAkaunBank = "1234567890";
      }
    }
  };

  // Prefill recipient fields when category changes (mirror investigation page behavior)
  const prefillRecipientByCategory = (kategori) => {
    const k = (kategori || '').toUpperCase();
    if (k === 'ASNAF') {
      formData.value.jenisPengenalanPenerima = 'MYKAD';
      formData.value.noPengenalanPenerima = userProfile.value.noKadPengenalan || '';
      formData.value.namaPenerimaBayaran = userProfile.value.nama || '';
      formData.value.kaedahPembayaran = 'EFT';
      formData.value.namaPemegangAkaun = formData.value.namaPenerimaBayaran || '';
      formData.value.bank = 'Maybank';
      formData.value.noAkaunBank = '1234567890';
    } else if (k === 'LAIN_LAIN') {
      formData.value.jenisPengenalanPenerima = 'MYKAD';
      formData.value.noPengenalanPenerima = '';
      formData.value.namaPenerimaBayaran = '';
      formData.value.kaedahPembayaran = 'EFT';
      formData.value.namaPemegangAkaun = '';
      formData.value.bank = '';
      formData.value.noAkaunBank = '';
    } else {
      // default reset
      formData.value.jenisPengenalanPenerima = '';
      formData.value.noPengenalanPenerima = '';
      formData.value.namaPenerimaBayaran = '';
      formData.value.kaedahPembayaran = '';
      formData.value.namaPemegangAkaun = '';
      formData.value.bank = '';
      formData.value.noAkaunBank = '';
    }
  };

  watch(() => formData.value.kategoriPenerimaBayaran, (newVal) => {
    prefillRecipientByCategory(newVal);
  });

  // Add new registration modal state and handler (B103 style)
  const showAddRegistration = ref(false);
  const registrationStatus = ref('disahkan'); // disahkan, belum disahkan
  const newRegistration = ref({ 
    kategoriPenerima: '',
    namaPenuh:'', 
    jenisPengenalan:'IC', 
    noPengenalan:'', 
    namaPemegangAkaun:'', 
    bank:'', 
    noAkaun:'' 
  });

  const proceedToNextStep = () => {
    // Validate that kategori penerima is selected
    if (!newRegistration.value.kategoriPenerima) {
      // You can add a toast notification here if needed
      return;
    }
    
    // Close the current modal
    showAddRegistration.value = false;
    
    // Navigate based on selected category (open in new tab)
    if (newRegistration.value.kategoriPenerima === 'organisasi') {
      // Navigate to organisation page in new tab
      window.open('/BF-PRF/OR/PP/kemaskini/ORG-240501', '_blank');
    } else {
      // For syarikat and recipient, navigate to third party page in new tab
      window.open('/BF-PRF/TP/PP/02', '_blank');
    }
    
    // Reset the form
    newRegistration.value = { 
      kategoriPenerima: '',
      namaPenuh:'', 
      jenisPengenalan:'IC', 
      noPengenalan:'', 
      namaPemegangAkaun:'', 
      bank:'', 
      noAkaun:'' 
    };
  };

  // 3.6 Dokumen Sokongan Dari LZS
  const MAX_SIZE_MB = 5;
  const ALLOWED_EXT = ['pdf', 'jpg', 'jpeg', 'png'];

  let lzsSeq = 1;
  const newLzsRow = () => ({
    id: `lzs-${Date.now()}-${lzsSeq++}`,
    dokumen: '',
    catatan: '',
    // simpan fail / pautan untuk "Lihat"
    file: null,           // File object jika muat naik
    fileName: '',         // Paparan nama fail
    fileUrl: '',          // Boleh jadi URL dari server; fallback = URL.createObjectURL(file)
  });

  const lzsDokumenRows = ref([newLzsRow()]);

  /** Boleh lihat jika ada fileUrl atau file */
  const canViewLzs = (row) => Boolean(row.fileUrl || row.file);

  /** Buka dokumen untuk dilihat */
  const viewLzsDoc = (row) => {
    let url = row.fileUrl;
    if (!url && row.file) {
      url = URL.createObjectURL(row.file); // preview local
    }
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  };

  /** Upload handler untuk LZS rows */
  const onLzsFileChange = (index, evt) => {
    const file = evt?.target?.files?.[0];
    if (!file) return;

    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    const sizeMB = file.size / (1024 * 1024);
    if (!ALLOWED_EXT.includes(ext)) {
      alert(`Jenis fail tidak disokong. Benarkan: ${ALLOWED_EXT.join(', ').toUpperCase()}`);
      evt.target.value = '';
      return;
    }
    if (sizeMB > MAX_SIZE_MB) {
      alert(`Saiz fail melebihi had ${MAX_SIZE_MB}MB.`);
      evt.target.value = '';
      return;
    }

    const row = lzsDokumenRows.value[index];
    row.file = file;
    row.fileName = file.name;
    // Jika ada API upload sebenar, gantikan baris di bawah dengan respons URL dari server
    row.fileUrl = URL.createObjectURL(file);
  };

  /** (Pilihan) tambah/buang baris LZS */
  const addLzsRow = () => {
    lzsDokumenRows.value.push(newLzsRow());
  };
  const removeLzsRow = () => {
    if (lzsDokumenRows.value.length > 1) {
      lzsDokumenRows.value.pop();
    }
  };

  // 3.7 Dokumen Sokongan (prototype docs config)
  const documents = ref([
    { 
      id: "DOC1", 
      nama: "Surat tawaran belajar daripada pihak sekolah/surat pengesahan belajar", 
      status: "", 
      catatan: "", 
      files: [] 
    },
    { 
      id: "DOC2", 
      nama: "Salinan akaun bank pelajar yang mengandungi: Nama bank, Nama dan no akaun bank", 
      status: "", 
      catatan: "", 
      files: [] 
    },
    { 
      id: "DOC3", 
      nama: "Salinan kad pengenalan ketua keluarga/ penjaga", 
      status: "", 
      catatan: "", 
      files: [] 
    },
    { 
      id: "DOC4", 
      nama: "Salinan kad pengenalan/surat beranak pelajar", 
      status: "", 
      catatan: "", 
      files: [] 
    },
    { 
      id: "DOC5", 
      nama: "Senarai Permintaan Pembelian", 
      status: "", 
      catatan: "", 
      files: [] 
    },
  ]);
  const statusDokumenOptions = [
    { label: "-- Pilih --", value: "", disabled: true },
    { label: "Lengkap", value: "LENGKAP" },
    { label: "Tidak Lengkap", value: "TIDAK_LENGKAP" },
    { label: "Tiada Keperluan", value: "TIADA_KEPERLUAN" },
  ];
  const getStatusLabel = (val) => statusDokumenOptions.find(o => o.value === val)?.label || '';
  const showReturnFields = computed(() => false); // first application: hidden
  const docInputRefs = new Map();
  const setDocInputRef = (el, id) => {
    if (el) docInputRefs.set(id, el);
  };
  const triggerUpload = (doc) => {
    const input = docInputRefs.get(doc.id);
    if (input) input.click();
  };
  const onDocFilesSelected = (evt, doc) => {
    const files = Array.from(evt.target.files || []);
    doc.files = files;
  };
  const downloadTemplate = (doc) => {
    // Placeholder action for prototype
    alert(`Muat turun templat untuk ${doc.nama}`);
  };
  const previewDoc = (doc) => {
    if (!doc.files || doc.files.length === 0) {
      alert(`Tiada fail untuk dipratonton untuk ${doc.nama}`);
      return;
    }
    alert(`Pratonton ${doc.files.length} fail untuk ${doc.nama}`);
  };

  // 3.6 Maklumat Tindakan helpers
  const showBorangSiasatanButton = computed(() => {
    const method = (formData.value.kaedahPembayaran || '').toUpperCase();
    return method === 'TUNAI_KAUNTER' || method === 'TUNAI_LAPANGAN';
  });
  const showTindakanDropdown = computed(() => {
    // Show only if Aid exactly equals 'Bantuan Perubatan' (case-insensitive)
    return (formData.value.jenisBantuan || '').trim().toLowerCase() === 'bantuan perubatan';
  });
  const tindakanOptions = [
    { label: 'Hantar ke Al-Amal', value: 'AL_AMAL' },
    { label: 'Diproses di NAS', value: 'NAS' },
  ];
  const openBorangSiasatanTunai = () => {
    alert('Buka Borang Siasatan Tunai (Kaunter Ekspres)');
  };
  const onSave = () => {
    try {
      // Create clean copies to avoid circular references
      const cleanFormData = JSON.parse(JSON.stringify(formData.value));
      const cleanDocuments = JSON.parse(JSON.stringify(documents.value));
      
      // Save all form data to localStorage
      const saveData = {
        formData: cleanFormData,
        selectedDependentId: selectedDependentId.value,
        penerimaManfaatJenisPengenalan: penerimaManfaatJenisPengenalan.value,
        penerimaManfaatNoPengenalan: penerimaManfaatNoPengenalan.value,
        penerimaManfaatHubungan: penerimaManfaatHubungan.value,
        selectedRegistration: selectedRegistration.value,
        documents: cleanDocuments,
        timestamp: new Date().toISOString()
      };
      
      localStorage.setItem('mohonBantuanData', JSON.stringify(saveData));
      alert('Permohonan berjaya disimpan');
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      alert('Error menyimpan data');
    }
  };
  
  // Breadcrumb items
  const breadcrumb = ref([
    {
      name: "Permohonan Bantuan",
      type: "link",
      path: "/BF-BTN/PB/senarai",
    },
    {
      name: "Mohon Bantuan Baru",
      type: "current",
      path: "/BF-BTN/PB/mohon-bantuan",
    },
  ]);
  
  // Format date helper
  const formatDate = (date) => {
    return new Intl.DateTimeFormat("ms-MY", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  // Format date as DD-MM-YYYY for read-only field
  const formatDateDMY = (date) => {
    const d = new Date(date);
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  };

  // Auto generate No. Bantuan (mock)
  const noBantuan = ref("AA-2025-000001");
  
  // Form submission handler
  const handleSubmit = async (formData) => {
    showConfirmationModal.value = true;
  };
  
  // Confirm submission handler
  const confirmSubmit = async () => {
    try {
      // TODO: Implement API call to submit form
      // Generate reference number
      nomorRujukan.value = `REF-${Date.now()}`;
      showConfirmationModal.value = false;
      // Redirect to syor page instead of showing success modal
      showSuccessModal.value = true;
    } catch (error) {
      console.error("Error submitting form:", error);
      // TODO: Show error message to user
    }
  };
  
  // Cancel handler
  const handleCancel = () => {
    router.push("/BF-BTN/PB");
  };
  
  // View status handler
  const handleViewStatus = () => {
    showSuccessModal.value = false;
    router.push("/BF-BTN/PB/senarai");
  };

  // Document handlers
  const editDocument = (doc) => {
    // Navigate to Senarai Permintaan Pembelian page for DOC5
    if (doc.id === 'DOC5') {
      router.push('/BF-BTN/senarai-permintaan-pembelian');
    }
  };

  const uploadDocument = (doc) => {
    // Placeholder for upload functionality
    console.log('Upload document:', doc);
    alert(`Upload functionality for ${doc.nama}`);
  };



  
  </script>
  
  <style lang="scss" scoped>
  // Add any custom styles here
  </style>
  