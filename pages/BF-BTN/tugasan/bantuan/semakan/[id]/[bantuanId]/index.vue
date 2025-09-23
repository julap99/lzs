													 

<template>
  <div class="min-h-screen">
    <div class="  ">
      <LayoutsBreadcrumb :items="breadcrumb" />

      <!-- Page Header -->
      <div class="mt-6 mb-8">
        <div
          class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 class="text-2xl font-bold text-gray-900">
              Semakan & Input Maklumat Bantuan
            </h1>
            <p class="mt-1 text-sm text-gray-600">
              {{ formData.jenisBantuan }}
            </p>
          </div>
          <rs-badge
            :variant="getStatusVariant(computedStatusPermohonan)"
            class="text-sm px-4 py-2"
          >
            {{ computedStatusPermohonan }}
          </rs-badge>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Section 1: Maklumat Bantuan -->
          <rs-card class="shadow-sm border-0 bg-white">
            <template #header>
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div
                    class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"
                  >
                    <Icon name="ph:info" class="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-gray-900">
                    Maklumat Bantuan
                  </h2>
                  <p class="text-sm text-gray-500">
                    Butiran asas jenis bantuan
                  </p>
                </div>
              </div>
            </template>

            <template #body>
              <FormKit
                type="form"
                :actions="false"
                v-model="formData"
              >
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <!-- <div class="space-y-1">
                    <label class="text-sm font-medium text-gray-700">
                      Jenis Bantuan
                    </label>
                    <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                      <span class="text-sm text-gray-900">{{
                        formData.jenisBantuan
                      }}</span>
                    </div>
                  </div> -->

                  <div class="space-y-1">
                    <FormKit
                      type="text"
                      name="aid"
                      label="Aid"
                      placeholder="Contoh: B125 - Bantuan Baikpulih Rumah (Miskin)"
                      validation="required"
                      :validation-messages="{
                        required: 'Aid diperlukan'
                      }"
                      :classes="{ outer: 'mb-0' }"
                      v-model="formData.aid"
                    />
                  </div>

                  <div class="space-y-1">
                    <FormKit
                      type="text"
                      name="aidProduct"
                      label="Aid Product"
                      placeholder="Contoh: Bantuan Sewaan/Ansuran Rumah (Miskin)"
                      validation="required"
                      :validation-messages="{
                        required: 'Aid Product diperlukan'
                      }"
                      :classes="{ outer: 'mb-0' }"
                      v-model="formData.aidProduct"
                    />
                  </div>

                  <div class="space-y-1" v-if="route.params.bantuanId === 'B135'">
                    <FormKit
                      type="select"
                      name="productPackage"
                      label="Product Package"
                      :options="[
                        { label: '-- Pilih Product Package --', value: '', disabled: true },
                        { label: '(HQ) SAGUHATI GALAKAN SAUDARA BARU', value: '(HQ) SAGUHATI GALAKAN SAUDARA BARU' }
                      ]"
                      validation="required"
                      :validation-messages="{
                        required: 'Product Package diperlukan'
                      }"
                      placeholder="Pilih Product Package"
                      :classes="{ outer: 'mb-0' }"
                      v-model="formData.productPackage"
                    />
                  </div>

                  <div class="space-y-1" v-if="route.params.bantuanId === 'B135'">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
								 
											   
												 
																		 
										   
											 
                      Entitlement Product
                    </label>
                    <div class="flex items-center">
                      <input
                        id="entitlement-hq"
                        type="checkbox"
                      v-model="formData.entitlementProduct"
                        class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label for="entitlement-hq" class="ml-2 text-sm text-gray-700">
                        (HQ) SAGUHATI GALAKAN SAUDARA BARU
                      </label>
                    </div>
                  </div>

                  <!-- <div class="space-y-1 md:col-span-2">
                    <FormKit
                      type="checkbox"
                      name="segera"
                      label="SEGERA"
                      :classes="{ outer: 'mb-0' }"
                    />
                  </div> -->

                  

                  <!-- <div class="space-y-1 md:col-span-2">
                    <FormKit
                      type="checkbox"
                      name="kelulusanKhas"
                      label="Kelulusan Khas"
                      :classes="{ outer: 'mb-0' }"
                    />
                  </div> -->

                  <div class="space-y-1">
                    <label class="text-sm font-medium text-gray-700">
                      Tarikh Permohonan
                    </label>
                    <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                      <span class="text-sm text-gray-900">{{
                        formatDate(formData.tarikhPermohonan)
                      }}</span>
                    </div>
                    <!-- <p class="text-xs text-gray-500">Format: DD-MM-YYYY</p> -->
                  </div>

                  <div class="space-y-1">
                    <label class="text-sm font-medium text-gray-700">
                      SLA
                    </label>
                    <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                      <span class="text-sm text-gray-900">{{ formData.sla }}</span>
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
                        class="w-full p-3 bg-white border rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-green-500 focus:outline-none"
                        placeholder="Nyatakan sebab di sini..."
                      ></textarea>
                    </div>

                    <!-- Situasi Kelulusan Khas -->
                <div v-if="formData.kelulusankhas" class="mt-4 space-y-1">
                  <label class="text-sm font-medium text-gray-700">Situasi</label>
                  <select
                    v-model="formData.situasikelulusankhas"
                    class="w-full p-3 bg-white border rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  >
                    <option disabled value="">-- Sila pilih situasi --</option>
                    <option>Umur, sama ada melebihi atau di bawah umur</option>
                    <option>Tempoh masa terikatnya pemohon dengan sesuatu kelayakan bantuan</option>
                    <option>Tidak memenuhi syarat minimum permohonan bantuan</option>
                    <option>Pendapatan isi rumah yang melebihi jadual kelayakan pendapatan isi rumah yang ditetapkan</option>
                    <option>Melebihi kadar Had Kifayah</option>
                    <option>Lain-lain permohonan yang tidak memenuhi syarat dan kelayakan dalam GPSKAZ</option>
                    <option>Permohonan berulang bagi bantuan yang bersifat sekali kelulusan dalam tempoh masa tertentu</option>
                    <option>Jenis bantuan tidak tersenarai di dalam GPSKAZ/ Perkara yang melibatkan kepentingan akidah Islam dan nyawa</option>
                  </select>
                </div>
              </FormKit>
            </template>
          </rs-card>

          <!-- Section 2: Maklumat Pengislaman -->
          <rs-card v-if="route.params.bantuanId === 'B135'" class="shadow-sm border-0 bg-white">
            <template #header>
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div
                    class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center"
                  >
                    <Icon name="ph:mosque" class="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-gray-900">
                    Maklumat Pengislaman
                  </h2>
                  <p class="text-sm text-gray-500">
                    Butiran pengislaman dan status mualaf
                  </p>
                </div>
              </div>
            </template>

            <template #body>
              <FormKit
                type="form"
                :actions="false"
                v-model="formData"
              >
                <div class="space-y-6">
                  <!-- Question: Adakah anda seorang Mualaf? -->
                  <div class="space-y-3">
                    <label class="block text-sm font-medium text-gray-700">
                      Adakah anda seorang Mualaf?
                    </label>
                    <div class="flex items-center space-x-6">
                      <label class="flex items-center">
                        <input
                          type="radio"
                          name="adakahMualaf"
                          value="yes"
                          v-model="formData.adakahMualaf"
                          class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span class="ml-2 text-sm text-gray-700">Ya</span>
                      </label>
                      <label class="flex items-center">
                        <input
                          type="radio"
                          name="adakahMualaf"
                          value="no"
                          v-model="formData.adakahMualaf"
                          class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span class="ml-2 text-sm text-gray-700">Tidak</span>
                      </label>
                    </div>
                  </div>

                <!-- Conditional Fields when "Ya" is selected -->
                <div v-if="formData.adakahMualaf === 'yes'" class="space-y-6 pt-4 border-t border-gray-200">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-1">
                      <FormKit
                        type="date"
                        name="tarikhMasukIslam"
                        label="Tarikh Masuk Islam"
                        validation="required"
                        :validation-messages="{
                          required: 'Tarikh masuk Islam diperlukan'
                        }"
                        :classes="{ outer: 'mb-0' }"
                        v-model="formData.tarikhMasukIslam"
                      />
                    </div>

                    <div class="space-y-1">
                      <FormKit
                        type="text"
                        name="namaLain"
                        label="Nama Lain"
                        placeholder="Masukkan nama lain (jika ada)"
                        :classes="{ outer: 'mb-0' }"
                        v-model="formData.namaLain"
                      />
                    </div>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-1">
                      <FormKit
                        type="date"
                        name="tarikhMasukKFAM"
                        label="Tarikh Masuk Kelas Fardhu Ain Muallaf (KFAM)"
                        :classes="{ outer: 'mb-0' }"
                        v-model="formData.tarikhMasukKFAM"
                      />
                    </div>

                    <!-- <div class="space-y-1">
                      <FormKit
                        type="file"
                        name="dokumenPengislaman"
                        label="Dokumen Pengislaman"
                        accept=".pdf,.jpg,.jpeg,.png"
                        :classes="{ outer: 'mb-0' }"
                        v-model="formData.dokumenPengislaman"
                      />
                    </div> -->
                  </div>
                </div>
                </div>
              </FormKit>
            </template>
          </rs-card>

          <!-- Section 3: Senarai Entitlement Product -->
          <rs-card v-if="route.params.bantuanId === 'B135'" class="shadow-sm border-0 bg-white">
            <template #header>
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div
                    class="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center"
                  >
                    <Icon name="ph:gift" class="w-6 h-6 text-indigo-600" />
                  </div>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-gray-900">
                    Senarai Entitlement Product
                  </h2>
                  <p class="text-sm text-gray-500">
                    Bantuan yang dipilih berdasarkan checkbox
                  </p>
                </div>
              </div>
            </template>

            <template #body>
              <div class="space-y-4">
                <!-- Show cards when Entitlement Product is checked -->
                <div v-if="formData.entitlementProduct === true">
                  <!-- Entitlement Product Cards -->
                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div 
                      v-for="(product, index) in selectedEntitlements" 
                      :key="product.id || index"
                    class="relative border rounded-lg p-4 transition-all duration-200 hover:shadow-md"
                    :class="{
                      'border-green-200 bg-green-50': product.status === 'Aktif' && !isProductEditing(index),
                      'border-blue-200 bg-blue-50': isProductEditing(index) || (product.status === 'Tersedia' && !isProductEditing(index)),
                      'border-gray-200 bg-white': product.status === 'Tidak Aktif' && !isProductEditing(index)
                    }"
                    >
                      <!-- Status Badge -->
                      <div class="absolute top-2 right-2">
                        <rs-badge 
                          :variant="isProductEditing(index) ? 'primary' : getProductStatusVariant(product.status)"
                          class="text-xs"
                        >
                          {{ isProductEditing(index) ? 'Sedang Edit' : product.status }}
                        </rs-badge>
                      </div>

                      <!-- Product Info -->
                      <div class="pr-16">
                        <h3 class="font-semibold text-gray-900 text-sm mb-2">{{ product.nama }}</h3>
                        <p class="text-xs text-gray-600 mb-3">{{ product.penerangan }}</p>
                      </div>


                      <!-- Action Buttons -->
                      <div class="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
                        <div v-if="isProductEditing(index)" class="flex space-x-2">
                          <rs-button 
                            variant="success" 
                            size="sm"
                            @click="saveProduct(index)"
                          >
                            Simpan
                          </rs-button>
                          <rs-button 
                            variant="secondary" 
                            size="sm"
                            @click="cancelEdit"
                          >
                            Batal
                          </rs-button>
                        </div>
                        <div v-else class="flex space-x-2">
                          <rs-button
                            variant="primary-outline"
                            size="sm"
                            @click="editProduct(index)"
                            class="!px-2 !py-1"
                          >
                            <Icon name="ph:pencil" class="w-3 h-3 mr-1" />
                            Edit
                          </rs-button>
                          <button
                            @click="deleteEntitlement(product, index)"
                            class="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                          >
                            <Icon name="ph:trash" class="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <!-- Empty State when checked but no items selected -->
                    <div v-if="selectedEntitlements.length === 0" class="col-span-full text-center py-8 text-gray-500">
                      <Icon name="ph:gift" class="w-12 h-12 mx-auto mb-2 text-gray-400" />
                      <p class="text-sm">Tiada entitlement product dipilih. Pilih checkbox di atas untuk menambah.</p>
                    </div>
                  </div>
                </div>

                <!-- Show message when Entitlement Product is unchecked -->
                <div v-else class="text-center py-8 text-gray-500">
                  <Icon name="ph:gift" class="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p class="text-sm">Tiada entitlement product dipilih. Pilih checkbox di atas untuk menambah.</p>
                </div>
              </div>
            </template>
          </rs-card>

          <!-- External Edit Panel for B135 -->
          <rs-card
            v-if="route.params.bantuanId === 'B135' && editingProductIndex >= 0"
            ref="externalEditorEl"
            class="shadow-sm border-0 bg-white"
          >
            <template #header>
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Icon name="ph:currency-dollar" class="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-gray-900">
                    Maklumat Kadar Bantuan
                  </h2>
                  <p class="text-sm text-gray-500">
                    Nilai kadar bantuan yang dicadangkan
                  </p>
                </div>
              </div>
            </template>

            <template #body>
              <div class="space-y-6 p-4">
                <!-- Maklumat Kadar Bantuan -->
                <div class="bg-gray-50 p-4 rounded-lg border">
                  <div class="flex items-center space-x-2 mb-3">
                    <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Icon name="ph:currency-dollar" class="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h4 class="text-sm font-semibold text-gray-700">Maklumat Kadar Bantuan</h4>
                      <p class="text-xs text-gray-500">Nilai kadar bantuan yang dicadangkan</p>
                    </div>
                  </div>

                  <div v-if="route.params.bantuanId !== 'B135'" class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label class="text-xs font-medium text-gray-600">Kadar Bantuan</label>
                      <input
                        v-model="getCurrentEditData().kadarBantuan"
                        type="number"
                        class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="0"
                        @input="calculateCurrentProductTotal()"
                      />
                    </div>
                    <div>
                      <label class="text-xs font-medium text-gray-600">Tempoh/Kekerapan</label>
                      <input
                        v-model="getCurrentEditData().tempohKekerapan"
                        type="number"
                        class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="0"
                        @input="calculateCurrentProductTotal()"
                      />
                    </div>
                  </div>

                  <div v-if="route.params.bantuanId !== 'B135'" class="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                    <div>
                      <label class="text-xs font-medium text-gray-600">Tarikh Mula</label>
                      <input
                        v-model="getCurrentEditData().tarikhMula"
                        type="date"
                        class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label class="text-xs font-medium text-gray-600">Tarikh Tamat</label>
                      <input
                        v-model="getCurrentEditData().tarikhTamat"
                        type="date"
                        class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div class="mt-3">
                    <label class="text-xs font-medium text-gray-600">Jumlah Keseluruhan Bantuan akan Diterima</label>
                    <div class="mt-1 p-3 bg-white border rounded-md text-sm">
                      {{ getCurrentEditData().jumlahKeseluruhan }}
                    </div>
                  </div>
                </div>

                <!-- Maklumat Penerima Bayaran -->
                <div class="bg-gray-50 p-4 rounded-lg border">
                  <h4 class="text-sm font-semibold text-gray-700 mb-3">Maklumat Penerima Bayaran</h4>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div class="md:col-span-2">
                      <label class="text-xs font-medium text-gray-600">Kategori Penerima</label>
                      <select
                        v-model="getCurrentEditData().kategoriPenerima"
                        class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        @change="loadPenerimaData()"
                      >
                        <option value="">Pilih kategori penerima</option>
                        <option value="asnaf">Asnaf</option>
                        <option value="vendor">Organisasi</option>
                        <option value="institusi">Recipient</option>
                      </select>
                    </div>

                    <div>
                      <label class="text-xs font-medium text-gray-600">Kaedah Pembayaran</label>
                      <select
                        v-model="getCurrentEditData().kaedahPembayaran"
                        class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Pilih kaedah pembayaran</option>
                        <option value="EFT">EFT</option>
                        <option value="Vcash">Vcash</option>
                        <option value="Cheque">Cheque</option>
                        <option value="TT">TT</option>
                        <option value="eWallet">eWallet</option>
                        <option value="Tunai">Tunai</option>
                        <option value="Tunai (Kaunter Ekspres)">Tunai (Kaunter Ekspres)</option>
                        <option value="Tunai (Lapangan)">Tunai (Lapangan)</option>
                      </select>
                    </div>

                    <div>
                      <label class="text-xs font-medium text-gray-600">No. Kad Pengenalan</label>
                      <input
                        v-model="getCurrentEditData().noKadPengenalan"
                        type="text"
                        class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="010101-01-0101"
                      />
                    </div>

                    <div>
                      <label class="text-xs font-medium text-gray-600">Nama Penerima</label>
                      <input
                        v-model="getCurrentEditData().namaPenerima"
                        type="text"
                        class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Nama Penerima"
                      />
                    </div>

                    <div v-if="getCurrentEditData().kaedahPembayaran !== 'Tunai' && getCurrentEditData().kaedahPembayaran !== 'Tunai (Kaunter Ekspres)' && getCurrentEditData().kaedahPembayaran !== 'Tunai (Lapangan)'">
                      <label class="text-xs font-medium text-gray-600">Nama Pemegang Akaun</label>
                      <input
                        v-model="getCurrentEditData().namaPemegangAkaun"
                        type="text"
                        class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Nama Pemegang Akaun"
                      />
                    </div>

                    <div v-if="getCurrentEditData().kaedahPembayaran !== 'Tunai' && getCurrentEditData().kaedahPembayaran !== 'Tunai (Kaunter Ekspres)' && getCurrentEditData().kaedahPembayaran !== 'Tunai (Lapangan)'">
                      <label class="text-xs font-medium text-gray-600">Bank</label>
                      <select
                        v-model="getCurrentEditData().bank"
                        class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Pilih Bank</option>
                        <option value="Maybank">Maybank</option>
                        <option value="CIMB Bank">CIMB Bank</option>
                        <option value="Public Bank">Public Bank</option>
                        <option value="RHB Bank">RHB Bank</option>
                        <option value="Hong Leong Bank">Hong Leong Bank</option>
                        <option value="AmBank">AmBank</option>
                        <option value="Bank Islam">Bank Islam</option>
                        <option value="Bank Muamalat">Bank Muamalat</option>
                      </select>
                    </div>

                    <div v-if="getCurrentEditData().kaedahPembayaran !== 'Tunai' && getCurrentEditData().kaedahPembayaran !== 'Tunai (Kaunter Ekspres)' && getCurrentEditData().kaedahPembayaran !== 'Tunai (Lapangan)'">
                      <label class="text-xs font-medium text-gray-600">No. Akaun Bank</label>
                      <input
                        v-model="getCurrentEditData().noAkaunBank"
                        type="text"
                        class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="1234567890"
                      />
                    </div>
                  </div>
                </div>

                <div class="flex items-center justify-end gap-2">
                  <rs-button variant="success" @click="saveProduct(editingProductIndex)">Simpan</rs-button>
                  <rs-button variant="secondary" @click="cancelEdit">Batal</rs-button>
                </div>
              </div>
            </template>
          </rs-card>

          <!-- Section 4: Dokumen Sokongan -->
          <rs-card class="shadow-sm border-0 bg-white">
            <template #header>
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div
                    class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center"
                  >
                    <Icon name="ph:files" class="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-gray-900">
                    Dokumen Sokongan
                  </h2>
                  <p class="text-sm text-gray-500">
                    Semak status dokumen yang diperlukan
                  </p>
                </div>
              </div>
            </template>

            <template #body>
              <div class="overflow-x-auto">
                <table class="w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        No.
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dokumen
                      </th>
                       <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Catatan
                      </th>
                     
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr
                      v-for="(dokumen, index) in formData.dokumenSokongan"
                      :key="index"
                      class="hover:bg-gray-50"
                    >
                      <td class="px-6 py-4 whitespace-nowrap">{{ index + 1 }}</td>
                      <td class="px-6 py-4">
                        <div class="text-sm font-medium text-gray-900">
                          {{ dokumen.nama }}
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex gap-2">
                          <rs-button
                            variant="primary-outline"
                            size="sm"
                            @click="viewDocument(dokumen.id)"
                            :disabled="!dokumen.url"
                          >
                            <Icon name="ph:eye" class="w-4 h-4" />
                          </rs-button>
                          <rs-button
                            variant="primary-outline"
                            size="sm"
                            @click="downloadDocument(dokumen.id)"
                            :disabled="!dokumen.url"
                          >
                            <Icon name="ph:download" class="w-4 h-4" />
                          </rs-button>
                        </div>
                      </td>
                      
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="w-48">
                          <FormKit
                            type="select"
                            :name="`dokumenSokongan.${index}.status`"
                            :options="statusDokumenOptions"
                            placeholder="Pilih status"
                            validation="required"
                            :validation-messages="{
                              required: 'Status dokumen diperlukan'
                            }"
                            :classes="{ outer: 'mb-0' }"
                            v-model="dokumen.status"
                          />
                        </div>
                      </td>
                      <td class="px-6 py-4">
                        <FormKit
                          type="textarea"
                          :name="`dokumenSokongan.${index}.catatan`"
                          placeholder="Masukkan catatan"
                          :validation="dokumen.status === 'Tidak Lengkap' ? 'required' : ''"
                          :validation-messages="{ required: 'Catatan diperlukan apabila status Tidak Lengkap' }"
                          :disabled="dokumen.status !== 'Tidak Lengkap'"
                          :classes="{ outer: 'mb-0' }"
                          rows="2"
                          v-model="dokumen.catatan"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </template>
          </rs-card>

          <!-- Section 3: Hasil Siasatan -->
          <!-- <rs-card 
            v-if="showSiasatanSection"
            class="shadow-sm border-0 bg-white"
          >
            <template #header>
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div
                    class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center"
                  >
                    <Icon name="ph:magnifying-glass" class="w-6 h-6 text-orange-600" />
                  </div>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-gray-900">
                    Hasil Siasatan
                  </h2>
                  <p class="text-sm text-gray-500">
                    Keputusan dan catatan hasil siasatan
                  </p>
                </div>
              </div>
            </template>

            <template #body>
              <div class="grid grid-cols-1 gap-6">
                <div class="space-y-1">
                  <FormKit
                    type="select"
                    name="statusSokongan"
                    label="Status Sokongan"
                    v-model="formData.statusSokongan"
                    :options="statusSokonganOptions"
                    validation="required"
                    :validation-messages="{
                      required: 'Status sokongan diperlukan'
                    }"
                    placeholder="Pilih status sokongan"
                    :classes="{ outer: 'mb-0' }"
                  />
                </div>

                <div class="space-y-1">
                  <FormKit
                    type="textarea"
                    name="catatanPengesyoran"
                    label="Catatan Pengesyoran"
                    rows="4"
                    placeholder="Contoh: Pemohon seorang bapa tunggal, mempunyai 4 orang tanggungan..."
                    validation="required"
                    :validation-messages="{
                      required: 'Catatan pengesyoran diperlukan'
                    }"
                    :classes="{ outer: 'mb-0' }"
                    v-model="formData.catatanPengesyoran"
                  />
                </div>
              </div>
            </template>
          </rs-card> -->

          <!-- Section 4: Input Maklumat Bantuan -->
          <rs-card v-if="showBantuanDetails" class="shadow-sm border-0 bg-white">
            <template #header>
              <CardHeader title="Input Maklumat Bantuan" icon="ph:currency-circle-dollar" color="purple" />
            </template>
            <template #body>
              <div v-if="route.params.bantuanId !== 'B135'" class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Kadar Bantuan -->
                <FormKit
                  type="number"
                  name="kadarBantuan"
                  label="Kadar Bantuan (RM)"
                  placeholder="800"
                  v-model="formData.kadarBantuan"
                  validation="required|number|min:0"
                  :validation-messages="{
                    required: 'Kadar bantuan diperlukan',
                    number: 'Sila masukkan nombor',
                    min: 'Minimum RM0'
                  }"
                  @input="calculateTotal"
                  :classes="{ outer: 'mb-0' }"
                />

                <!-- Tempoh -->
                <FormKit
                  type="number"
                  name="tempohBantuan"
                  label="Tempoh / Kekerapan Bantuan (bulan)"
                  placeholder="6"
                  v-model="formData.tempohBantuan"
                  validation="required|number|min:1"
                  @input="calculateTotal"
                  :classes="{ outer: 'mb-0' }"
                />
              </div>
              <div v-if="route.params.bantuanId !== 'B135'" class="grid grid-cols-1 md:grid-cols-2 gap-6">

                <!-- Tarikh Mula -->
                <FormKit
                  type="date"
                  name="tarikhMula"
                  label="Tarikh Mula"
                  v-model="formData.tarikhMula"
                  validation="required"
                  :classes="{ outer: 'mb-0' }"
                />

                <!-- Tarikh Tamat -->
                <FormKit
                  type="date"
                  name="tarikhTamat"
                  label="Tarikh Tamat"
                  v-model="formData.tarikhTamat"
                  validation="required"
                  :classes="{ outer: 'mb-0' }"
                />

                <!-- Jumlah Keseluruhan -->
                <div v-if="route.params.bantuanId !== 'B135'" class="space-y-1 md:col-span-3">
                  <label class="text-sm font-medium text-gray-700">
                    Jumlah Keseluruhan Bantuan (RM)
                  </label>
                  <div class="mt-1 p-3 bg-green-50 rounded-lg border border-green-200">
                    <span class="text-sm font-semibold text-green-800">
                      {{ formData.jumlahKeseluruhan.toLocaleString() }}
                    </span>
                  </div>
                </div>
              </div>
            </template>
          </rs-card>


          <!-- Section 5: Input Maklumat Pembayaran -->
          <rs-card v-if="showBantuanDetails" class="shadow-sm border-0 bg-white">
            <template #header>
              <CardHeader title="Input Maklumat Pembayaran" icon="ph:bank" color="indigo" />
            </template>
            <template #body>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <!-- Penerima -->
                <FormKit
                  type="select"
                  name="penerima"
                  label="Penerima"
                  v-model="formData.penerima"
                  :options="[
                    { label: 'Asnaf', value: 'Asnaf' },
                    { label: 'Third Party', value: 'Third Party' },
                    { label: 'Organisasi', value: 'Organisasi' },
                    { label: 'PAK', value: 'PAK' }
                  ]"
                  validation="required"
                  :classes="{ outer: 'mb-0' }"
                />

                <!-- Nama Penerima -->
                <FormKit
                  type="text"
                  name="namaPenerima"
                  label="Nama Penerima"
                  v-model="formData.namaPenerima"
                  validation="required"
                  placeholder="Masukkan nama penerima"
                  :classes="{ outer: 'mb-0' }"
                />

                <!-- Kaedah Pembayaran -->
                <FormKit
                  type="select"
                  name="kaedahPembayaran"
                  label="Kaedah Pembayaran"
                  v-model="formData.kaedahPembayaran"
                  :options="[
                    { label: '-- Pilih kaedah pembayaran --', value: '', disabled: true },
                    { label: 'EFT', value: 'EFT' },
                    { label: 'Vcash', value: 'Vcash' },
                    { label: 'Cheque', value: 'Cheque' },
                    { label: 'TT', value: 'TT' },
                    { label: 'eWallet', value: 'eWallet' },
                    { label: 'Tunai', value: 'Tunai' },
                    { label: 'Tunai (Kaunter Ekspres)', value: 'Tunai (Kaunter Ekspres)' },
                    { label: 'Tunai (Lapangan)', value: 'Tunai (Lapangan)' }
                  ]"
                  validation="required"
                  :classes="{ outer: 'mb-0' }"
                />

                <!-- Nama Bank -->
                <FormKit
                  v-if="formData.kaedahPembayaran !== 'Tunai' && formData.kaedahPembayaran !== 'Tunai (Kaunter Ekspres)' && formData.kaedahPembayaran !== 'Tunai (Lapangan)'"
                  type="text"
                  name="namaBank"
                  label="Nama Bank"
                  v-model="formData.namaBank"
                  validation="required"
                  placeholder="Contoh: CIMB, Maybank"
                  :classes="{ outer: 'mb-0' }"
                />

                <!-- No Akaun Bank -->
                <FormKit
                  v-if="formData.kaedahPembayaran !== 'Tunai' && formData.kaedahPembayaran !== 'Tunai (Kaunter Ekspres)' && formData.kaedahPembayaran !== 'Tunai (Lapangan)'"
                  type="text"
                  name="noAkaunBank"
                  label="No Akaun Bank"
                  v-model="formData.noAkaunBank"
                  validation="required"
                  placeholder="Contoh: 1234567890"
                  :classes="{ outer: 'mb-0' }"
                />
              </div>
            </template>
          </rs-card>

        </div>

        <!-- Sidebar -->
        <div class="lg:col-span-1 space-y-6">
          <!-- Section: Prosedur Agihan -->
          <rs-card 
            v-if="route.params.bantuanId === 'B135'"
            class="shadow-sm border-0 bg-white"
          >
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
                    Prosedur Agihan Bantuan
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
                      <div class="space-y-3">
                        <div>
                          <label class="block text-sm font-medium text-gray-600 mb-1">Permohonan Dibuat Oleh</label>
                          <p class="text-sm text-gray-900">{{ permohonanDetails.dibuatOleh }}</p>
                        </div>
                        <div>
                          <label class="block text-sm font-medium text-gray-600 mb-1">Tarikh Permohonan</label>
                          <p class="text-sm text-gray-900">{{ formatDateTime(permohonanDetails.tarikhPermohonan) }}</p>
                        </div>
                        <div>
                          <label class="block text-sm font-medium text-gray-600 mb-1">Sebab Memohon Bantuan</label>
                          <p class="text-sm text-gray-900 leading-relaxed">{{ permohonanDetails.sebabMemohon }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </rs-card>

          <!-- Section: Maklumat Lawatan & Siasatan -->
          <rs-card 
            v-if="route.params.bantuanId === 'B135'"
            class="shadow-sm border-0 bg-white"
          >
            <template #header>
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div
                    class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"
                  >
                    <Icon
                      name="ph:clipboard-text"
                      class="w-6 h-6 text-blue-600"
                    />
                  </div>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-gray-900">
                    Maklumat Siasatan
                  </h2>
                  <p class="text-sm text-gray-500">
                    Maklumat siasatan 
                  </p>
                </div>
              </div>
            </template>

            <template #body>
              <div class="space-y-4">
                <!-- Ringkasan Profil -->
                <div class="bg-gray-50 p-4 rounded-lg border">
                  <h3 class="text-sm font-semibold text-gray-700 mb-3">Ringkasan Profil</h3>
                  <ul class="space-y-2 text-sm text-gray-600">
                    <li>• Jenis Pekerjaan: Suri rumah sepenuh masa</li>
                    <li>• Status Kediaman: Rumah Sendiri</li>
                    <li>• Jumlah bayaran rumah: RM0</li>
                    <li>• Bil Tanggungan: 3 Orang (2 Anak + Suami)</li>
                    <li>• Status Tanggungan: Anak sakit kronik, Suami tidak bekerja</li>
                  </ul>
                </div>

                <!-- Kaedah Siasatan -->
                <div class="space-y-3">
                  <!-- <h3 class="text-sm font-semibold text-red-600">Kaedah Siasatan</h3> -->
                  <FormKit
                    type="select"
                    label="Kaedah Siasatan"
                    :options="kaedahSiasatanOptions"
                    v-model="formData.kaedahSiasatan"
                    :classes="{ input: 'text-sm' }"
                  />
                  
                  <!-- <FormKit
                    type="textarea"
                    label="Catatan Tambahan"
                    v-model="formData.catatanSiasatan"
                    rows="3"
                    placeholder="Enter text..."
                    :classes="{ input: 'text-sm' }"
                  /> -->
                </div>
              </div>
            </template>
          </rs-card>

          <!-- Section: Keputusan Siasatan -->
          <rs-card 
            v-if="route.params.bantuanId === 'B135'"
            class="shadow-sm border-0 bg-white"
          >
            <template #header>
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div
                    class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center"
                  >
                    <Icon
                      name="ph:check-circle"
                      class="w-6 h-6 text-yellow-600"
                    />
                  </div>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-gray-900">
                    Keputusan Siasatan
                  </h2>
                  <p class="text-sm text-gray-500">
                    Kemaskini status siasatan lapangan
                  </p>
                </div>
              </div>
            </template>

            <template #body>
              <div class="space-y-4">
                <FormKit
                  type="select"
                  label="Status Sokongan"
                  :options="statusLawatanOptions"
                  v-model="formData.statusLawatan"
                  :classes="{ input: 'text-sm' }"
                />
                
                <FormKit
                  type="textarea"
                  label="Catatan"
                  v-model="catatanLapangan.catatan"
                  rows="4"
                  placeholder="Masukkan catatan, dapatan dan pemerhatian semasa siasatan..."
                  :classes="{ input: 'text-sm' }"
                />

                <FormKit
                  type="select"
                  label="Status Proses"
                  :options="statusprosesOptions"
                  v-model="formData.statusproses"
                  :classes="{ input: 'text-sm' }"
                />

                <div class="text-xs text-gray-500">
                  <Icon name="ph:clock" class="w-4 h-4 inline mr-1" />
                  Masa/Tarikh: {{ catatanLapangan.masaTarikh }}
                </div>

                <!-- Action Buttons -->
                <div class="space-y-3 pt-4 border-t">
                  <rs-button
                    variant="info"
                    @click="handleHantar"
                    class="w-full !py-3 text-sm font-medium"
                  >
                    <Icon name="ph:check-circle" class="w-5 h-5 mr-2" />
                    Hantar
                  </rs-button>

                  <rs-button
                    variant="primary"
                    @click="handleSimpan"
                    class="w-full !py-3 text-sm font-medium"
                  >
                    <Icon name="ph:check-circle" class="w-5 h-5 mr-2" />
                    Simpan
                  </rs-button>

                  <rs-button
                    variant="primary-outline"
                    @click="handleBatal"
                    class="w-full !py-3 text-sm font-medium"
                  >
                    <Icon name="ph:arrow-left" class="w-5 h-5 mr-2" />
                    Batal / Kembali
                  </rs-button>
                </div>
              </div>
            </template>
          </rs-card>
          <!-- Section 6: Status & Catatan Semakan -->
          <rs-card 
            v-if="route.params.bantuanId !== 'B135'"
            class="shadow-sm border-0 bg-white sticky top-6"
          >
            <template #header>
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div
                    class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center"
                  >
                    <Icon
                      name="ph:clipboard-text"
                      class="w-6 h-6 text-red-600"
                    />
                  </div>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-gray-900">
                    Status & Catatan Semakan
                  </h2>
                  <p class="text-sm text-gray-500">
                    Kemaskini status dan catatan
                  </p>
                </div>
              </div>
            </template>

            <template #body>
              <div class="space-y-6">
                <!-- Status Selection -->
                <div class="space-y-1">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Status Permohonan</label>
                  <div class="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-900 flex items-center">
                    <rs-badge 
                      :variant="getStatusVariant(computedStatusPermohonan)"
                      class="text-white font-semibold"
                    >
                      {{ computedStatusPermohonan }}
                    </rs-badge>
                  </div>
                </div>

                <!-- Catatan Pegawai -->
                <div class="space-y-1">
                  <FormKit
                    type="textarea"
                    name="catatanPegawai"
                    label="Catatan Pegawai"
                    rows="4"
                    :validation="formData.statusPermohonanBaru === 'Tidak Lengkap' ? 'required' : ''"
                    :validation-messages="{
                      required: 'Catatan diperlukan untuk status Tidak Lengkap'
                    }"
                    placeholder="Masukkan catatan pegawai (wajib jika Tidak Lengkap)"
                    :classes="{ outer: 'mb-0' }"
                  />
                </div>

                <!-- Tarikh Semak -->
                <div class="space-y-1">
                  <label class="text-sm font-medium text-gray-700">
                    Tarikh Semak
                  </label>
                  <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                    <span class="text-sm text-gray-900">
                      {{ formatDateTime(formData.tarikhSemak) }}
                    </span>
                  </div>
                </div>

                <!-- Section 7: Action Buttons -->
                <div class="space-y-3 pt-4 border-t">
                  <rs-button
                    variant="info"
                    @click="handleSimpan"
                    class="w-full !py-3 text-sm font-medium"
                  >
                    <Icon name="ph:check-circle" class="w-5 h-5 mr-2" />
                    Hantar
                  </rs-button>

                  <rs-button
                    variant="primary"
                    @click="handleSimpan"
                    class="w-full !py-3 text-sm font-medium"
                  >
                    <Icon name="ph:check-circle" class="w-5 h-5 mr-2" />
                    Simpan
                  </rs-button>

                  <rs-button
                    variant="primary-outline"
                    @click="handleBatal"
                    class="w-full !py-3 text-sm font-medium"
                  >
                    <Icon name="ph:arrow-left" class="w-5 h-5 mr-2" />
                    Batal / Kembali
                  </rs-button>
                </div>

                <!-- Information Note -->
                <div class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div class="flex">
                    <Icon
                      name="ph:info"
                      class="w-5 h-5 text-blue-400 mt-0.5"
                    />
                    <div class="ml-3">
                      <h3 class="text-sm font-medium text-blue-800">
                        Maklumat
                      </h3>
                      <p class="mt-1 text-xs text-blue-700">
                        Sekiranya bantuan tanpa siasatan, sistem akan terus ke "Untuk Siasatan".
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </rs-card>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <rs-modal
      v-model="showSuccessModal"
      title="Kemaskini Berjaya"
      size="md"
      position="center"
    >
      <template #body>
        <div class="space-y-6">
          <div class="text-center">
            <div
              class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100"
            >
              <Icon name="ph:check-circle" class="h-8 w-8 text-green-600" />
            </div>
            <h3 class="mt-4 text-lg font-semibold text-gray-900">
              Kemaskini Berjaya
            </h3>
            <p class="mt-2 text-sm text-gray-600">
              Maklumat bantuan telah berjaya dikemaskini.
            </p>
          </div>

          <div class="bg-gray-50 p-4 rounded-lg space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-sm font-medium text-gray-700">Bantuan:</span>
              <span class="text-sm text-gray-900">{{ formData.jenisBantuan }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm font-medium text-gray-700">Status:</span>
              <rs-badge
                :variant="getStatusVariant(formData.statusPermohonanBaru)"
                class="text-xs"
              >
                {{ formData.statusPermohonanBaru }}
              </rs-badge>
            </div>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex justify-center">
          <rs-button variant="primary" @click="handleBackToList">
            OK
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import { formatDate } from "~/utils/dateFormatter.js";

const route = useRoute();
const router = useRouter();
const toast = useToast();

definePageMeta({
  title: "Semakan & Input Maklumat Bantuan",
});

const breadcrumb = ref([
  {
    name: "Tugasan",
    type: "link",
    path: "/BF-BTN/tugasan",
  },
  {
    name: "Senarai untuk Disemak",
    type: "link",
    path: "/BF-BTN/tugasan",
  },
  {
    name: "Semakan Permohonan",
    type: "current",
    path: `/BF-BTN/tugasan/bantuan/${route.params.id}`,
  },
  {
    name: "Bantuan",
    type: "current",
    path: `/BF-BTN/tugasan/bantuan/${route.params.id}/${route.params.bantuanId}`,
  },
]);

// Accordion state and mock details
const accordionOpen = reactive({
  permohonan: false,
  siasatan: false,
})

const permohonanDetails = ref({
  dibuatOleh: 'Ahmad bin Abdullah',
  tarikhPermohonan: '2024-01-01 09:00:00',
  sebabMemohon: 'Pemohon telah menceritakan masalah mengenai keadaan rumahnya yang semakin uzur akibat dimakan anai-anai dan keadaan bumbung yang bocor. Dipanjangkan kepada pegawai untuk siasat dan mempertimbangkan permohonan bantuan bina baru rumah'
})

// Section: Catatan Lapangan
const catatanLapangan = ref({
  catatan: "",
  masaTarikh: new Date().toLocaleString("ms-MY"),
});

// Dropdown options
const statusLawatanOptions = ref([
  { label: "--Sila Pilih--", value: "sila_pilih" },
  { label: "Sokong", value: "sokong" },
  { label: "Tidak Sokong", value: "tidak_sokong" },
]);

// Dropdown options
const statusprosesOptions = ref([
  { label: "--Sila Pilih--", value: "belum_selesai" },
  { label: "Selesai Diproses", value: "selesai" },
  { label: "KIV", value: "kiv" },
]);

// Dropdown options for Kaedah Siasatan
const kaedahSiasatanOptions = ref([
  { label: "--Sila Pilih--", value: "" },
  { label: "Semak Dokumen Sahaja", value: "semak_dokumen" },
  { label: "Telefon", value: "telefon" },
  // { label: "Lapangan", value: "lapangan" },
]);

// Form data
const formData = ref({
  // Section 1: Maklumat Bantuan
  jenisBantuan: "B125 - BANTUAN BAIKPULIH RUMAH (MISKIN)",
  aid: "B125 - BANTUAN BAIKPULIH RUMAH (MISKIN)",
  aidProduct: "BANTUAN BAIKPULIH RUMAH (MISKIN)",
  productPackage: "BAIKPULIH RUMAH (MISKIN)",
  entitlementProduct: "BAIKPULIH RUMAH (MISKIN)",
  segera: false,
  kelulusanKhas: false,
  tarikhPermohonan: new Date().toISOString(),
  sla: "3h",

  // Section 2: Dokumen Sokongan
  dokumenSokongan: [
    { 
      id: "surat-sewa", 
      nama: "Surat Perjanjian Sewa", 
      status: "",
      url: "/path/to/doc1.pdf" // Mock URL for demo
    },
    { 
      id: "bank-tuan-rumah", 
      nama: "Maklumat Bank Tuan Rumah", 
      status: "",
      url: "/path/to/doc2.pdf"
    },
    { 
      id: "bukti-pemilikan", 
      nama: "Bukti Pemilikan (Salinan bil utiliti: Air, Api, Cukai Pintu, atau lain-lain)", 
      status: "",
      url: "/path/to/doc3.pdf"
    },
    { 
      id: "surat-kuasa", 
      nama: "Surat Kuasa Wakil (jika bilik/rumah diurus wakil/ejen, bukan tuan rumah sendiri)", 
      status: "",
      url: "/path/to/doc4.pdf"
    },
  ],

  // Section 3: Hasil Siasatan
  statusSokongan: "",
  catatanPengesyoran: `
    Status: Balu
    Jenis Pekerjaan : Bekerja sebagai tukang sapu di sekolah
    Pendapatan KK : RM1200
    Status Kediaman : Rumah Sewa
    Jumlah bayaran rumah : RM800
    Status Kesihatan KK : Sihat
    Bantuan Agensi Lain : - 
    Bil Tanggungan : 2 Orang(Anak)
    Status Tanggungan : Masih Bersekolah , Tidak Bekerja`,

  // Section 4: Input Maklumat Bantuan
  kadarBantuan: null,
  tempohBantuan: "",
  jumlahKeseluruhan: 0,
  tarikhMula: "",
  tarikhTamat: "",
  jumlahKeseluruhan: 0,

  // Section 5: Input Maklumat Pembayaran
  penerima: "",
  namaPenerima: "",
  kaedahPembayaran: "",
  namaBank: "",
  noAkaunBank: "",

  // Section 6: Status & Catatan
  statusPermohonan: "Dalam Semakan",
  statusPermohonanBaru: "",
  catatanPegawai: "",
  tarikhSemak: new Date(),
  
  // Default empty entitlementProducts array for safety
  entitlementProducts: [],
  // Default values for new Maklumat Pengislaman fields
  tarikhMasukKFAM: null,
  dokumenPengislaman: null,
  
  // New fields for Laluan Proses and Keputusan Siasatan
  statusLawatan: "",
  statusproses: "",
  
  // New fields for Maklumat Lawatan & Siasatan
  kaedahSiasatan: "",
  catatanSiasatan: "",
});

// Mock dataset keyed by bantuanId
const mockByBantuanId = {
  B300: {
    jenisBantuan: "B300 - (HQ) BANTUAN DERMASISWA SEKOLAH ASRAMA (FAKIR)",
    aid: "B300 - (HQ) BANTUAN DERMASISWA SEKOLAH ASRAMA (FAKIR)",
    aidProduct: "BANTUAN DERMASISWA SEKOLAH ASRAMA (FAKIR))",
    productPackage: "DERMASISWA SEKOLAH ASRAMA (FAKIR)",
    entitlementProduct: "DERMASISWA SEKOLAH ASRAMA (FAKIR)",
    segera: false,
    kelulusanKhas: false,
    tarikhPermohonan: new Date().toISOString(),
    sla: "3h",
    dokumenSokongan: [
      { id: "surat-tawaran", nama: "Surat tawaran belajar daripada pihak sekolah/surat pengesahan belajar", status: "", url: "/path/to/doc1.pdf" },
      { id: "salinan-akaun-bank", nama: "Salinan akaun bank pelajar yang mengandungi: Nama bank, Nama dan no akaun bank", status: "", url: "/path/to/doc2.pdf" },
      { id: "kad-pengenalan-ketua-keluarga", nama: "Salinan kad pengenalan ketua keluarga/ penjaga", status: "", url: "/path/to/doc3.pdf" },
      { id: "kad-pengenalan-pelajar", nama: "Salinan kad pengenalan/surat beranak pelajar", status: "", url: "/path/to/doc4.pdf" },
    ],
    statusSokongan: "",
    catatanPengesyoran: "",
    kadarBantuan: null,
    tempohBantuan: "",
    jumlahKeseluruhan: 0,
    tarikhMula: "",
    tarikhTamat: "",
    penerima: "",
    namaPenerima: "",
    kaedahPembayaran: "",
    namaBank: "",
    noAkaunBank: "",
    statusPermohonan: "Dalam Semakan",
    statusPermohonanBaru: "",
    catatanPegawai: "",
    tarikhSemak: new Date(),
  },

  B112: {
    jenisBantuan: "B112 - BANTUAN SEWAAN/ANSURAN RUMAH (FAKIR)",
    aid: "B112 - BANTUAN SEWAAN/ANSURAN RUMAH (FAKIR)",
    aidProduct: "BANTUAN SEWAAN/ANSURAN RUMAH (FAKIR)",
    productPackage: "BANTUAN SEWAAN/ANSURAN RUMAH (FAKIR)",
    entitlementProduct: "BANTUAN SEWAAN/ANSURAN RUMAH (FAKIR)",
    segera: false,
    kelulusanKhas: false,
    tarikhPermohonan: new Date().toISOString(),
    sla: "3h",
    dokumenSokongan: [
      { id: "borang-maklumat", nama: "Borang Maklumat Sewa Rumah/ Tunggakan Sewa Rumah.", status: "", url: "/path/to/doc1.pdf" },
      { id: "salinan-ic", nama: "Salinan kad pengenalan pemilik rumah/wakil/ surat pengesahan institusi atau dokumen perjanjian sewaan rumah/ bilik.", status: "", url: "/path/to/doc2.pdf" },
      { id: "surat-kuasa", nama: "Surat kuasa bagi wakil yang menguruskan bilik/rumah yang disewa daripada tuan rumah (wajib, jika menggunakan wakil/ejen)", status: "", url: "/path/to/doc3.pdf" },
      { id: "maklumat-bank", nama: "Maklumat bank terkini tuan rumah/bilik yang mengandungi: -Nama Bank Nama dan No akaun penerima", status: "", url: "/path/to/doc4.pdf" },
      { id: "bukti-pemilikan", nama: "Bukti pemilikan seperti Salinan Bil Utiliti (Api/Air/Cukai Pintu Rumah Yang Di Sewa atau lain-lain). Jika nama pemilik dan Penerima bayaran berbeza, perlu dilampirkan bukti pertalian (bukti berdokumen).", status: "", url: "/path/to/doc5.pdf" },
    ],
    statusSokongan: "",
    catatanPengesyoran: "",
    kadarBantuan: null,
    tempohBantuan: "",
    jumlahKeseluruhan: 0,
    tarikhMula: "",
    tarikhTamat: "",
    penerima: "",
    namaPenerima: "",
    kaedahPembayaran: "",
    namaBank: "",
    noAkaunBank: "",
    statusPermohonan: "Dalam Semakan",
    statusPermohonanBaru: "",
    catatanPegawai: "",
    tarikhSemak: new Date(),
  },

  B103: {
    jenisBantuan: "B103 - (HQ) BANTUAN PERUBATAN DIALISIS (FAKIR)",
    aid: "B103 - (HQ) BANTUAN PERUBATAN DIALISIS (FAKIR)",
    aidProduct: "(HQ) KATEGORI HEMODIALISIS (FAKIR)",
    productPackage: "BANTUAN SEWAAN/ANSURAN RUMAH (FAKIR)",
    entitlementProduct: "BANTUAN SEWAAN/ANSURAN RUMAH (FAKIR)",
    segera: false,
    kelulusanKhas: false,
    tarikhPermohonan: new Date().toISOString(),
    sla: "3h",
    dokumenSokongan: [
      { id: "borang-pengesahan", nama: "Dokumen akuan/ pengesahan dari pihak hospital/ pusat dialisis (panel LZS)  berkaitan maklumat lengkap pesakit dan rawatan yang diperlukan adalah yang terkini.", status: "", url: "/path/to/doc1.pdf" },
      { id: "salinan-ic", nama: "Salinan dokumen kemasukan yang sah (bukan warganegara sahaja).", status: "", url: "/path/to/doc2.pdf" },
      { id: "surat-sebutharga", nama: "Sebutharga kos rawatan yang diperlukan dari pusat rawatan.", status: "", url: "/path/to/doc3.pdf" },
      { id: "maklumat-agensi", nama: "Surat pengesahan agensi luar, sekiranya terima tajaan.", status: "", url: "/path/to/doc4.pdf" },
      ],
    statusSokongan: "",
    catatanPengesyoran: "",
    kadarBantuan: null,
    tempohBantuan: "",
    jumlahKeseluruhan: 0,
    tarikhMula: "",
    tarikhTamat: "",
    penerima: "",
    namaPenerima: "",
    kaedahPembayaran: "",
    namaBank: "",
    noAkaunBank: "",
    statusPermohonan: "Dalam Semakan",
    statusPermohonanBaru: "",
    catatanPegawai: "",
    tarikhSemak: new Date(),
  },


  B307: {
    jenisBantuan: "B307 - (HQ) DERMASISWA IPT DALAM NEGARA (FAKIR) - IPTA/IPTS",
    aid: "B307 - (HQ) DERMASISWA IPT DALAM NEGARA (FAKIR) - IPTA/IPTS",
    aidProduct: "DERMASISWA IPT DALAM NEGARA (FAKIR)",
    productPackage: "DERMASISWA IPT (FAKIR)",
    entitlementProduct: "DERMASISWA IPT (FAKIR)",
    segera: false,
    kelulusanKhas: false,
    tarikhPermohonan: new Date().toISOString(),
    sla: "2h",
    dokumenSokongan: [
      { id: "surat-tawaran-ipt", nama: "SURAT TAWARAN BELAJAR IPT", status: "", url: "/path/to/doc1.pdf" },
      { id: "struktur-yuran-pengajian", nama: "STRUKTUR YURAN PENGAJIAN", status: "", url: "/path/to/doc2.pdf" },
      { id: "keputusan-spm-diploma", nama: "KEPUTUSAN SPM BAGI PERINGKAT DIPLOMA", status: "", url: "/path/to/doc3.pdf" },
      { id: "salinan-maklumat-akaun-bank", nama: "SALINAN MAKLUMAT AKAUN BANK", status: "", url: "/path/to/doc4.pdf" },
      { id: "sijil-berhenti-sekolah", nama: "SIJIL BERHENTI SEKOLAH BAGI PERMOHONAN 17 TAHUN DAN KE BAWAH", status: "", url: "/path/to/doc5.pdf" },
      { id: "surat-pengesahan-belajar-ipt", nama: "SURAT PENGESAHAN BELAJAR DAN STATUS TAJAAN YANG DIKELUARKAN OLEH IPT", status: "", url: "/path/to/doc6.pdf" },
      { id: "surat-kelulusan-tajaan-lzs", nama: "SURAT KELULUSAN TAJAAN DERMASISWA DARIPADA LZS", status: "", url: "/path/to/doc7.pdf" },
      { id: "invois-yuran-rasmi-ipt", nama: "INVOIS YURAN RASMI DARIPADA IPT", status: "", url: "/path/to/doc8.pdf" },
    ],
    statusSokongan: "",
    catatanPengesyoran: "",
    kadarBantuan: null,
    tempohBantuan: "",
    jumlahKeseluruhan: 0,
    tarikhMula: "",
    tarikhTamat: "",
    penerima: "",
    namaPenerima: "",
    kaedahPembayaran: "",
    namaBank: "",
    noAkaunBank: "",
    statusPermohonan: "Dalam Semakan",
    statusPermohonanBaru: "",
    catatanPegawai: "",
    tarikhSemak: new Date(),
  },

  B201: {
    jenisBantuan: "B201 - BANTUAN KHAS MUALAF (SARA HIDUP)",
    aid: "B201 - BANTUAN KHAS MUALAF (SARA HIDUP)",
    aidProduct: "BANTUAN KHAS MUALAF (SARA HIDUP)",
    productPackage: "BANTUAN SARA HIDUP MUALAF",
    entitlementProduct: "BANTUAN SARA HIDUP MUALAF",
    segera: true,
    kelulusanKhas: false,
    tarikhPermohonan: new Date().toISOString(),
    sla: "1h",
    dokumenSokongan: [
      { id: "sijil-memeluk-islam", nama: "SIJIL MEMELUK ISLAM", status: "", url: "/path/to/doc1.pdf" },
      { id: "salinan-kad-pengenalan", nama: "SALINAN KAD PENGENALAN", status: "", url: "/path/to/doc2.pdf" },
      { id: "surat-pengesahan-kariah", nama: "SURAT PENGESAHAN DARIPADA KARIAH", status: "", url: "/path/to/doc3.pdf" },
      { id: "maklumat-akaun-bank", nama: "MAKLUMAT AKAUN BANK PEMOHON", status: "", url: "/path/to/doc4.pdf" },
      { id: "borang-pernyataan-pendapatan", nama: "BORANG PERNYATAAN PENDAPATAN", status: "", url: "/path/to/doc5.pdf" },
    ],
    statusSokongan: "",
    catatanPengesyoran: `
      Status: Mualaf (Baru memeluk Islam 6 bulan)
      Jenis Pekerjaan: Tidak bekerja (masih dalam proses mencari pekerjaan)
      Pendapatan KK: RM0
      Status Kediaman: Rumah Sewa
      Jumlah bayaran rumah: RM600
      Status Kesihatan KK: Sihat
      Bantuan Agensi Lain: Tiada
      Bil Tanggungan: 2 Orang (Anak)
      Status Tanggungan: Masih bersekolah
      Keperluan Khas: Memerlukan bantuan sara hidup dan panduan agama`,
    kadarBantuan: null,
    tempohBantuan: "",
    jumlahKeseluruhan: 0,
    tarikhMula: "",
    tarikhTamat: "",
    penerima: "",
    namaPenerima: "",
    kaedahPembayaran: "",
    namaBank: "",
    noAkaunBank: "",
    statusPermohonan: "Dalam Semakan",
    statusPermohonanBaru: "",
    catatanPegawai: "",
    tarikhSemak: new Date(),
  },

  B202: {
    jenisBantuan: "B202 - BANTUAN PENDIDIKAN MUALAF",
    aid: "B202 - BANTUAN PENDIDIKAN MUALAF",
    aidProduct: "BANTUAN PENDIDIKAN MUALAF",
    productPackage: "BANTUAN PENDIDIKAN AGAMA MUALAF",
    entitlementProduct: "BANTUAN PENDIDIKAN AGAMA MUALAF",
    segera: false,
    kelulusanKhas: false,
    tarikhPermohonan: new Date().toISOString(),
    sla: "2h",
    dokumenSokongan: [
      { id: "sijil-memeluk-islam", nama: "SIJIL MEMELUK ISLAM", status: "", url: "/path/to/doc1.pdf" },
      { id: "surat-pengesahan-kariah", nama: "SURAT PENGESAHAN DARIPADA KARIAH", status: "", url: "/path/to/doc2.pdf" },
      { id: "surat-tawaran-belajar", nama: "SURAT TAWARAN BELAJAR AGAMA", status: "", url: "/path/to/doc3.pdf" },
      { id: "struktur-yuran", nama: "STRUKTUR YURAN PENGAJIAN AGAMA", status: "", url: "/path/to/doc4.pdf" },
      { id: "maklumat-akaun-bank", nama: "MAKLUMAT AKAUN BANK PEMOHON", status: "", url: "/path/to/doc5.pdf" },
    ],
    statusSokongan: "",
    catatanPengesyoran: `
      Status: Mualaf (Baru memeluk Islam 6 bulan)
      Keperluan Pendidikan: Kelas asas agama Islam
      Tempoh Pengajian: 12 bulan
      Lokasi: Masjid An-Nur, Shah Alam
      Yuran Bulanan: RM200
      Keperluan Tambahan: Buku teks agama dan peralatan tulis`,
    kadarBantuan: null,
    tempohBantuan: "",
    jumlahKeseluruhan: 0,
    tarikhMula: "",
    tarikhTamat: "",
    penerima: "",
    namaPenerima: "",
    kaedahPembayaran: "",
    namaBank: "",
    noAkaunBank: "",
    statusPermohonan: "Dalam Semakan",
    statusPermohonanBaru: "",
    catatanPegawai: "",
    tarikhSemak: new Date(),
  },

  B135: {
    jenisBantuan: "B135 - (HQ) SAGUHATI GALAKAN SAUDARA BARU (MUALAF)",
    aid: "B135 - (HQ) SAGUHATI GALAKAN SAUDARA BARU (MUALAF)",
    aidProduct: "(HQ) SAGUHATI GALAKAN SAUDARA BARU (MUALAF)",
    productPackage: "(HQ) SAGUHATI GALAKAN SAUDARA BARU",
    entitlementProduct: true,
    adakahMualaf: "yes",
    tarikhMasukIslam: "2024-03-15",
    namaLain: "Mary Catherine Johnson",
    tarikhMasukKFAM: "2024-04-01",
    dokumenPengislaman: null,
    entitlementProducts: [
      {
        id: "ent-001",
        nama: "(HQ) SAGUHATI GALAKAN SAUDARA BARU",
        penerangan: "Program galakan dan sokongan untuk saudara baru",
        kategori: "Utama",
        jumlah: 500,
        tempoh: "12 bulan",
        status: "Aktif",
        dipilih: true
      },
      {
        id: "ent-003",
        nama: "Bantuan Pendidikan Agama",
        penerangan: "Bantuan untuk kelas dan bahan pendidikan agama",
        kategori: "Pendidikan",
        jumlah: 200,
        tempoh: "12 bulan",
        status: "Tersedia",
        dipilih: false
      },
      {
        id: "ent-004",
        nama: "Bantuan Kemahiran Vokasional",
        penerangan: "Bantuan kursus kemahiran untuk kebolehpasaran",
        kategori: "Kemahiran",
        jumlah: 1500,
        tempoh: "6 bulan",
        status: "Tersedia",
        dipilih: false
      }
    ],
    segera: false,
    kelulusanKhas: false,
    tarikhPermohonan: new Date().toISOString(),
    sla: "3h",
    dokumenSokongan: [
      { id: "dokumen-pengesahan-islam-mais", nama: "Dokumen pengesahan memeluk Islam yang dikeluarkan oleh MAIS (Surat Pengesahan atau Kad Islam MAIS)", status: "", url: "/path/to/doc1.pdf" },
      { id: "salinan-mykad-pemohon", nama: "Salinan Mykad / Mykid / dokumen kemasukan yang sah bagi pemohon", status: "", url: "/path/to/doc2.pdf" },
      { id: "salinan-mykad-pasangan-tanggungan", nama: "Salinan Mykad / Mykid / dokumen kemasukan yang sah pasangan dan tanggungan", status: "", url: "/path/to/doc3.pdf" },
      { id: "salinan-akaun-bank", nama: "Salinan akaun bank (yang tertera nama bank, nama dan nombor akaun pemohon)", status: "", url: "/path/to/doc4.pdf" },
    ],
    statusSokongan: "",
    catatanPengesyoran: `
      Status: Mualaf (Baru memeluk Islam 6 bulan)
      Jenis Program: Saguhati Galakan Saudara Baru
      Tempoh Program: 12 bulan
      Lokasi: Masjid An-Nur, Shah Alam
      Bantuan Bulanan: RM500
      Aktiviti: Kelas agama, bimbingan rohani, aktiviti kemasyarakatan
      Mentor: Ustaz Ahmad bin Ibrahim
      Objektif: Membantu mualaf beradaptasi dengan kehidupan Islam dan masyarakat
      Sokongan Tambahan: Bantuan makanan, pakaian, dan keperluan asas`,
    kadarBantuan: null,
    tempohBantuan: "",
    jumlahKeseluruhan: 0,
    tarikhMula: "",
    tarikhTamat: "",
    penerima: "",
    namaPenerima: "",
    kaedahPembayaran: "",
    namaBank: "",
    noAkaunBank: "",
    statusPermohonan: "Dalam Semakan",
    statusPermohonanBaru: "",
    catatanPegawai: "",
    tarikhSemak: new Date(),
  },
};

onMounted(() => {
  const bantuanId = String(route.params.bantuanId || "");
  const record = mockByBantuanId[bantuanId];
  if (record) {
    Object.assign(formData.value, record);
  }
});

// Configuration data
const statusDokumenOptions = [
  { label: "-- Pilih Status --", value: "", disabled: true },
  { label: "Lengkap", value: "Lengkap" },
  { label: "Tidak Lengkap", value: "Tidak Lengkap" },
  { label: "Tiada Keperluan", value: "Tiada" },
];

const statusSokonganOptions = [
  { label: "-- Pilih Status --", value: "", disabled: true },
  { label: "Sokong", value: "Sokong" },
  { label: "Tidak Sokong", value: "Tidak Sokong" },
];

const statusPermohonanOptions = [
  { label: "-- Pilih Status --", value: "", disabled: true },
  { label: "Lengkap", value: "Lengkap" },
  { label: "Tidak Lengkap", value: "Tidak Lengkap" },
];

// Modals
const showSuccessModal = ref(false);

// Computed
const showSiasatanSection = computed(() => {
  // Show if not "Bantuan Tanpa Siasatan"
  return !formData.value.jenisBantuan.toLowerCase().includes("tanpa siasatan");
});

const showBantuanDetails = computed(() => {
  // Show if:
  // 1. No siasatan needed (Bantuan Tanpa Siasatan) OR
  // 2. If siasatan is needed and status sokongan is "Sokong"
  return !showSiasatanSection.value || formData.value.statusSokongan === "Sokong";
});

// Computed status permohonan based on document statuses
const computedStatusPermohonan = computed(() => {
  const documents = formData.value.dokumenSokongan || [];
  
  if (documents.length === 0) {
    return "Tiada Dokumen";
  }
  
  // Check if any document is "Tidak Lengkap"
  const hasTidakLengkap = documents.some(doc => doc.status === "Tidak Lengkap");
  if (hasTidakLengkap) {
    return "Tidak Lengkap";
  }
  
  // Check if all documents are "Lengkap" or "Tiada Keperluan" (both are considered complete)
  const allComplete = documents.every(doc => 
    doc.status === "Lengkap" || doc.status === "Tiada"
  );
  if (allComplete) {
    return "Lengkap";
  }
  
  // If some documents are not selected or have other statuses
  return "Dalam Semakan";
});

// Computed properties for Senarai Entitlement Product
const selectedEntitlements = computed(() => {
  if (!formData.value?.entitlementProducts || !Array.isArray(formData.value.entitlementProducts)) return [];
  return formData.value.entitlementProducts.filter(item => item?.dipilih === true);
});

const selectedEntitlementsCount = computed(() => {
  return selectedEntitlements.value.length;
});

const totalSelectedAmount = computed(() => {
  return selectedEntitlements.value.reduce((total, item) => total + (item?.jumlah || 0), 0);
});

// Watch for changes in statusSokongan
watch(() => formData.value.statusSokongan, (newValue) => {
  // If status changes to "Sokong", reset bantuan details fields
  if (newValue === "Sokong") {
    formData.value.kadarBantuan = null;
    formData.value.tempohBantuan = "";
    formData.value.jumlahKeseluruhan = 0;
    formData.value.namaPenerima = "";
    formData.value.namaBank = "";
    formData.value.noAkaunBank = "";
  }
});

// Methods
const getStatusVariant = (status) => {
  const variants = {
    baru: "info",
    "dalam semakan": "warning",
    "tidak lengkap": "danger",
    "untuk siasatan": "secondary",
    lengkap: "success",
    "tiada dokumen": "secondary",
  };
  return variants[status.toLowerCase()] || "default";
};

const formatDateTime = (date) => {
  return new Date(date).toLocaleString("ms-MY", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const viewDocument = (docId) => {
  const doc = formData.value.dokumenSokongan.find(d => d.id === docId);
  if (doc?.url) {
    window.open(doc.url, '_blank');
  }
};

const downloadDocument = (docId) => {
  const doc = formData.value.dokumenSokongan.find(d => d.id === docId);
  if (doc?.url) {
    const link = document.createElement('a');
    link.href = doc.url;
    link.download = doc.nama;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

const calculateTotal = () => {
  const kadar = formData.value.kadarBantuan || 0;
  const tempoh = formData.value.tempohBantuan;
  
  // Extract number from tempoh (e.g., "6 bulan" -> 6)
  const bulan = parseInt(tempoh) || 1;
  formData.value.jumlahKeseluruhan = kadar * bulan;
};

const validateForm = () => {
  // Basic validation
  if (formData.value.statusPermohonanBaru === "Tidak Lengkap" && !formData.value.catatanPegawai) {
    return false;
  }

  // Document validation
  const allDocsHaveStatus = formData.value.dokumenSokongan.every(doc => doc.status);
  if (!allDocsHaveStatus) {
    return false;
  }

  // If showing bantuan details, validate those fields
  if (showBantuanDetails.value) {
    if (!formData.value.kadarBantuan || !formData.value.tempohBantuan || 
        !formData.value.namaPenerima || !formData.value.namaBank || !formData.value.noAkaunBank) {
      return false;
    }
  }

  return true;
};

const handleHantar = () => {
  if (!validateForm()) {
    // Show error message
    return;
  }

  // Set status to "Hantar" if valid
  formData.value.statusPermohonanBaru = "Hantar";
  
  // Show success modal
  showSuccessModal.value = true;
};

const handleSimpan = () => {
  if (!validateForm()) {
    // Show error message
    return;
  }

  // Set status to "Untuk Siasatan" if valid
  formData.value.statusPermohonanBaru = "Untuk Siasatan";
  
  // Show success modal
  showSuccessModal.value = true;
};

const handleBatal = () => {
  router.push(`/BF-BTN/tugasan/bantuan/semakan/${route.params.id}`);
};

const handleBackToList = () => {
  showSuccessModal.value = false;
  router.push(`/BF-BTN/tugasan/bantuan/semakan/${route.params.id}`);
};

// Helper methods for Senarai Entitlement Product
const getKategoriClass = (kategori) => {
  const classes = {
    "Utama": "bg-blue-100 text-blue-800",
    "Sara Hidup": "bg-green-100 text-green-800",
    "Pendidikan": "bg-purple-100 text-purple-800",
    "Kemahiran": "bg-orange-100 text-orange-800",
    "Bimbingan": "bg-yellow-100 text-yellow-800",
  };
  return classes[kategori] || "bg-gray-100 text-gray-800";
};

const getStatusClass = (status) => {
  const classes = {
    "Aktif": "bg-green-100 text-green-800",
    "Tersedia": "bg-blue-100 text-blue-800",
    "Tidak Aktif": "bg-red-100 text-red-800",
    "Pending": "bg-yellow-100 text-yellow-800",
  };
  return classes[status] || "bg-gray-100 text-gray-800";
};

const getProductStatusVariant = (status) => {
  const variants = {
    "Aktif": "success",
    "Tersedia": "info", 
    "Tidak Aktif": "danger",
    "Pending": "warning",
  };
  return variants[status] || "default";
};

// Editing state for entitlement products
const editingProductIndex = ref(-1);

// Storage for editing data
const entitlementEditData = ref({});

// Reference to external editor element
const externalEditorEl = ref(null);

// Helper methods for entitlement product editing
const isProductEditing = (index) => {
  return editingProductIndex.value === index;
};

const editProduct = (index) => {
  editingProductIndex.value = index;
  const product = selectedEntitlements.value[index];
  if (product) {
    console.log(`Mengedit product: ${product.nama}`);
    
    // Initialize edit data for this product if not exists
    if (!entitlementEditData.value[index]) {
      entitlementEditData.value[index] = {
        kadarBantuan: 1500,
        tempohKekerapan: 1,
        tarikhMula: '2024-01-01',
        tarikhTamat: '2024-12-31',
        jumlahKeseluruhan: 'RM 1,500.00',
        kategoriPenerima: 'asnaf',
        kaedahPembayaran: 'EFT',
        noKadPengenalan: '920815-08-2567',
        namaPenerima: 'Maryam binti Abdullah',
        namaPemegangAkaun: 'Maryam binti Abdullah',
        bank: 'Maybank',
        noAkaunBank: '1234567890123'
      };
    }
    
    // Scroll to external editor after it appears
    nextTick(() => {
      if (externalEditorEl.value) {
        externalEditorEl.value.$el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
    
    // Toast notification like in B112
    toast.info(`Mengedit product: ${product.nama}`);
  }
};

const saveProduct = (index) => {
  editingProductIndex.value = -1;
  console.log('Product telah disimpan');
  // Toast notification like in B112
  toast.success('Product telah disimpan');
};

const cancelEdit = () => {
  editingProductIndex.value = -1;
  console.log('Edit dibatalkan');
  // Toast notification like in B112
  toast.info('Edit dibatalkan');
};

const deleteEntitlement = (entitlement, index) => {
  if (confirm(`Adakah anda pasti mahu memadamkan "${entitlement.nama}"?`)) {
    // Find the original index in the full array
    const originalIndex = formData.value.entitlementProducts.findIndex(item => 
      item.nama === entitlement.nama && item.kategori === entitlement.kategori
    );
    if (originalIndex !== -1) {
      formData.value.entitlementProducts[originalIndex].dipilih = false;
    }
    // Reset editing state if we're deleting the currently edited product
    if (editingProductIndex.value === index) {
      editingProductIndex.value = -1;
    }
  }
};

const addEntitlement = () => {
  // TODO: Implement add modal/functionality
  console.log("Add new entitlement");
  // This would typically open a modal to select from available entitlements
};

// Helper method to get edit data for a product
const getProductEditData = (index) => {
  if (!entitlementEditData.value[index]) {
    entitlementEditData.value[index] = {
      kadarBantuan: 500,
      tempohKekerapan: 12,
      tarikhMula: '2024-01-01',
      tarikhTamat: '2024-12-31',
      jumlahKeseluruhan: 'RM 6,000.00',
      kategoriPenerima: 'asnaf',
      kaedahPembayaran: 'EFT',
      noKadPengenalan: '920815-08-2567',
      namaPenerima: 'Maryam binti Abdullah',
      namaPemegangAkaun: 'Maryam binti Abdullah',
      bank: 'Maybank',
      noAkaunBank: '1234567890123'
    };
  }
  return entitlementEditData.value[index];
};

// Calculate total amount when kadar or tempoh changes
const calculateProductTotal = (index) => {
  const editData = getProductEditData(index);
  const kadar = parseFloat(editData.kadarBantuan) || 0;
  const tempoh = parseFloat(editData.tempohKekerapan) || 0;
  const total = kadar * tempoh;
  
  editData.jumlahKeseluruhan = `RM ${total.toLocaleString('en-MY', { minimumFractionDigits: 2 })}`;
};

// Helper method to get current editing data for external box
const getCurrentEditData = () => {
  if (editingProductIndex.value >= 0) {
    return getProductEditData(editingProductIndex.value);
  }
  return {
    kadarBantuan: 0,
    tempohKekerapan: 0,
    tarikhMula: '',
    tarikhTamat: '',
    jumlahKeseluruhan: 'RM 0.00',
    kategoriPenerima: '',
    kaedahPembayaran: '',
    noKadPengenalan: '',
    namaPenerima: '',
    namaPemegangAkaun: '',
    bank: '',
    noAkaunBank: ''
  };
};

// Calculate total for currently editing product
const calculateCurrentProductTotal = () => {
  if (editingProductIndex.value >= 0) {
    calculateProductTotal(editingProductIndex.value);
  }
};

// Load payment recipient data based on category selection
const loadPenerimaData = () => {
  const editData = getCurrentEditData();
  const kategori = editData.kategoriPenerima;
  
  if (kategori === 'asnaf') {
    // Asnaf data
    editData.kaedahPembayaran = 'EFT';
    editData.noKadPengenalan = '920815-08-2567';
    editData.namaPenerima = 'Maryam binti Abdullah';
    editData.namaPemegangAkaun = 'Maryam binti Abdullah';
    editData.bank = 'Maybank';
    editData.noAkaunBank = '1234567890123';
  } else if (kategori === 'vendor') {
    // Vendor data
    editData.kaedahPembayaran = 'EFT';
    editData.noKadPengenalan = 'SSM123456789';
    editData.namaPenerima = 'ABC Trading Sdn Bhd';
    editData.namaPemegangAkaun = 'ABC Trading Sdn Bhd';
    editData.bank = 'CIMB Bank';
    editData.noAkaunBank = '9876543210';
  } else if (kategori === 'institusi') {
    // Institution data
    editData.kaedahPembayaran = 'EFT';
    editData.noKadPengenalan = 'REG987654321';
    editData.namaPenerima = 'Institut Pendidikan Islam';
    editData.namaPemegangAkaun = 'Institut Pendidikan Islam';
    editData.bank = 'Bank Islam';
    editData.noAkaunBank = '5555666677778888';
  } else {
    // Clear data
    editData.kaedahPembayaran = '';
    editData.noKadPengenalan = '';
    editData.namaPenerima = '';
    editData.namaPemegangAkaun = '';
    editData.bank = '';
    editData.noAkaunBank = '';
  }
};

</script>

<style lang="scss" scoped>
// Custom animations and transitions
.group:hover .group-hover\:text-blue-600 {
  transition: color 0.2s ease-in-out;
}

// Enhanced focus states
.focus\:ring-2:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}

// Progress bar animation
.transition-all {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style> 