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
            <h1 class="text-2xl font-bold text-gray-900">Siasatan Lapangan</h1>
            <p class="mt-1 text-sm text-gray-600">
              Kemaskini maklumat bantuan
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

      <!-- Debug Section (remove this later) -->
      <!-- <div class="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 class="text-sm font-medium text-yellow-800">Debug Info:</h3>
        <p class="text-xs text-yellow-700">Nama: {{ formData.nama }}</p>
        <p class="text-xs text-yellow-700">formData reactive: {{ JSON.stringify(formData) }}</p>
      </div> -->

      <div>
        <!-- Section 1: Maklumat Pemohon (Read-only) -->
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
                  Maklumat Bantuan
                </h2>
                <p class="text-sm text-gray-500">
                  Butiran bantuan dan status 
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

              <!-- <div class="space-y-1">
                <label class="text-sm font-medium text-gray-700"
                  >Product Package</label
                >
                <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                  <span class="text-sm text-gray-900">{{
                    formData.productpackage
                  }}</span>
                </div>
              </div> -->

              <div class="space-y-1">
                <label class="text-sm font-medium text-gray-700">Product Package</label>
                <FormKit
                  type="select"
                  name="productpackage"
                  v-model="formData.productpackage"
                  placeholder="Sila pilih product package"
                  :options="[
                    // '(PEROLEHAN) BINA RUMAH (FAKIR)',
                    // '(WO) 3 BILIK (FAKIR) - TANGGUNGAN 3-6 ORANG',
                    // 'PEMANTAUAN DAN PENGAWASAN TAPAK PROJEK (FAKIR)',
                    // 'PEMANTAUAN DAN PENGAWASAN TAPAK PROJEK (FAKIR)'
                    { label: '-- Sila Pilih --', value: '' }, // 👈 default option
                    { label: '(PEROLEHAN) BINA RUMAH (FAKIR)', value: 'PEROLEHAN' },
                    { label: '(WO) 3 BILIK (FAKIR) - TANGGUNGAN 3-6 ORANG', value: 'WO' },
                    { label: 'PEMANTAUAN DAN PENGAWASAN TAPAK PROJEK (FAKIR)', value: 'PEMANTAUAN1' },
                    { label: 'PEMANTAUAN DAN PENGAWASAN TAPAK PROJEK (FAKIR)', value: 'PEMANTAUAN2' }
                  ]"
                  searchable="true"
                  class="mt-1"
                />
              </div>


              <!-- <div class="space-y-1">
                <label class="text-sm font-medium text-gray-700">Entitlement Product</label>
                <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                  <span class="text-sm font-mono text-gray-900">{{
                    formData.entitlementproduct
                  }}</span>
                </div>
              </div> -->

              <div class="space-y-1">
                <label class="text-sm font-medium text-gray-700">Entitlement Product</label>
                <FormKit
                  type="select"
                  name="entitlementproduct"
                  v-model="formData.entitlementproduct"
                  placeholder="Sila pilih entitlement product"
                  :options="[
                    '-- Sila Pilih --', // 👈 default option
                    '(PEROLEHAN) BINA RUMAH (FAKIR)',
                    '(WO) 3 BILIK (FAKIR) - TANGGUNGAN 3-6 ORANG',
                    '(PEROLEHAN) PEMANTAUAN DAN PENGAWASAN TAPAK PROJEK (FAKIR)',
                    '(WO) PEMANTAUAN DAN PENGAWASAN TAPAK PROJEK (FAKIR)'
                  ]"
                  searchable="true"
                  class="mt-1"
                />
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
          </template>
        </rs-card>
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div class="col-span-1 space-y-6">
          <!-- Section 2: Dokumen Sokongan (Read-only) -->
          <rs-card class="shadow-sm border-0 bg-white">
            <template #header>
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div
                    class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center"
                  >
                    <Icon
                      name="ph:folder-open"
                      class="w-6 h-6 text-green-600"
                    />
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
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Dokumen
                      </th>
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr
                      v-for="(dokumen, index) in dokumenSokongan"
                      :key="index"
                      class="hover:bg-gray-50"
                    >
                      <td
                        class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                      >
                        {{ dokumen.jenis }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <FormKit
                          type="select"
                          :options="statusDokumenOptions"
                          v-model="dokumen.status"
                          :classes="{
                            input: 'text-sm border-gray-300 rounded-md',
                          }"
                          outer-class="mb-0"
                          wrapper-class="mb-0"
                          inner-class="mb-0"
                        />
                      </td>
                      <td
                        class="px-6 py-4 whitespace-nowrap text-sm font-medium"
                      >
                        <div class="flex items-center space-x-2">
                          <rs-button
                            variant="primary"
                            @click="previewDocument(dokumen)"
                          >
                            <Icon name="ph:eye" class="w-4 h-4 mr-1" />
                            Preview
                          </rs-button>
                          <rs-button
                            variant="success"
                            @click="downloadDocument(dokumen)"
                          >
                            <Icon name="ph:download" class="w-4 h-4 mr-1" />
                            Muat Turun
                          </rs-button>
                        </div>
                      </td>
                    </tr>
                    <tr v-if="dokumenSokongan.length === 0">
                      <td
                        colspan="3"
                        class="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        Tiada dokumen dijumpai.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </template>
          </rs-card>

          <!-- BQ, Laporan Gambar, Laporan Teknikal in Tabs -->
          <rs-tab variant="primary" type="card"  default-active="BQ">
            <!-- Tab: BQ -->
            <rs-tab-item title="BQ" active>
              <rs-card class="shadow-sm border-0 bg-white">
                <template #header>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                      <div class="flex-shrink-0">
                        <div
                          class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center"
                        >
                          <Icon
                            name="ph:file-text"
                            class="w-6 h-6 text-purple-600"
                          />
                        </div>
                      </div>
                      <div>
                        <h2 class="text-lg font-semibold text-gray-900">BQ</h2>
                        <p class="text-sm text-gray-500">
                          Bill of Quantity untuk kerja-kerja cadangan
                        </p>
                      </div>
                    </div>
                  </div>
                </template>

                <template #body>
                  <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                      <thead class="bg-gray-50">
                        <tr>
                          <th
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            No BQ
                          </th>
                          <th
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Nama BQ
                          </th>
                          <th
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Jumlah Keseluruhan
                          </th>
                          <th
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Status
                          </th>
                          <th
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="(bq, index) in bqList" :key="index">
                          <td
                            class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                          >
                            {{ bq.noBQ }}
                          </td>
                          <td
                            class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                          >
                            {{ bq.namaBQ }}
                          </td>
                          <td
                            class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                          >
                            {{ bq.jumlahBQ }}
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap">
                            <rs-badge
                              :variant="getBQStatusVariant(bq.status)"
                              class="text-sm"
                            >
                              {{ bq.status }}
                            </rs-badge>
                          </td>
                          <td
                            class="px-6 py-4 whitespace-nowrap text-sm font-medium"
                          >
                            <rs-button variant="primary" @click="editBQ(bq)">
                              Edit
                            </rs-button>
                          </td>
                        </tr>
                        <tr v-if="bqList.length === 0">
                          <td
                            colspan="4"
                            class="px-6 py-4 text-center text-sm text-gray-500"
                          >
                            Tiada BQ dijumpai. Klik butang "Tambah Baru" untuk
                            menambah BQ.
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </template>
              </rs-card>
            </rs-tab-item>

            <!-- Tab: Laporan Gambar -->
            <rs-tab-item title="Laporan Gambar">
              <rs-card class="shadow-sm border-0 bg-white">
                <template #header>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                      <div class="flex-shrink-0">
                        <div
                          class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center"
                        >
                          <Icon
                            name="ph:image"
                            class="w-6 h-6 text-orange-600"
                          />
                        </div>
                      </div>
                      <div>
                        <h2 class="text-lg font-semibold text-gray-900">
                          Laporan Gambar
                        </h2>
                        <p class="text-sm text-gray-500">
                          Gambar lokasi dan dokumentasi kerja
                        </p>
                      </div>
                    </div>
                    <rs-button variant="primary" @click="openLaporanGambar">
                      <Icon name="ph:camera" class="w-4 h-4 mr-2" />
                      Laporan Gambar
                    </rs-button>
                  </div>
                </template>

                <template #body>
                  <div
                    v-if="gambarLokasi.length > 0"
                    class="grid grid-cols-2 md:grid-cols-4 gap-4"
                  >
                    <div
                      v-for="(gambar, index) in gambarLokasi"
                      :key="index"
                      class="relative aspect-square rounded-lg overflow-hidden border border-gray-200"
                    >
                      <img
                        :src="gambar.url"
                        :alt="gambar.catatan"
                        class="w-full h-full object-cover"
                      />
                      <div
                        class="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-opacity"
                      >
                        <div
                          class="absolute bottom-0 left-0 right-0 p-2 bg-black bg-opacity-50 text-white text-sm"
                        >
                          {{ gambar.catatan }}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-else class="text-center py-8 text-gray-500">
                    <Icon
                      name="ph:image"
                      class="w-12 h-12 mx-auto mb-2 text-gray-400"
                    />
                    <p>
                      Tiada gambar dimuat naik. Klik butang "Laporan Gambar"
                      untuk menambah gambar.
                    </p>
                  </div>
                </template>
              </rs-card>
            </rs-tab-item>

            <!-- Tab: Laporan Teknikal -->
            <rs-tab-item title="Laporan Teknikal">
              <rs-card class="shadow-sm border-0 bg-white">
                <template #header>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                      <div class="flex-shrink-0">
                        <div
                          class="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center"
                        >
                          <Icon
                            name="ph:file-doc"
                            class="w-6 h-6 text-teal-600"
                          />
                        </div>
                      </div>
                      <div>
                        <h2 class="text-lg font-semibold text-gray-900">
                          Laporan Teknikal
                        </h2>
                        <p class="text-sm text-gray-500">
                          Analisis teknikal dan cadangan kerja
                        </p>
                      </div>
                    </div>
                    <rs-button variant="primary" @click="openLaporanTeknikal">
                      <Icon name="ph:file-doc" class="w-4 h-4 mr-2" />
                      Laporan Teknikal
                    </rs-button>
                  </div>
                </template>

                <template #body>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-1">
                      <label class="text-sm font-medium text-gray-700"
                        >Latar Belakang</label
                      >
                      <div
                        class="mt-1 p-3 bg-gray-50 rounded-lg border min-h-[100px]"
                      >
                        <span class="text-sm text-gray-900 whitespace-pre-wrap">{{
                          laporanTeknikal.latarBelakang || "Belum diisi"
                        }}</span>
                      </div>
                    </div>

                    <div class="space-y-1">
                      <label class="text-sm font-medium text-gray-700 "
                        >Keperluan</label
                      >
                      <div
                        class="mt-1 p-3 bg-gray-50 rounded-lg border min-h-[100px]"
                      >
                        <span class="text-sm text-gray-900 whitespace-pre-wrap">{{
                          laporanTeknikal.keperluan || "Belum diisi"
                        }}</span>
                      </div>
                    </div>

                    <div class="space-y-1">
                      <label class="text-sm font-medium text-gray-700"
                        >Cadangan</label
                      >
                      <div
                        class="mt-1 p-3 bg-gray-50 rounded-lg border min-h-[100px]"
                      >
                        <span class="text-sm text-gray-900 whitespace-pre-wrap">{{
                          laporanTeknikal.cadangan || "Belum diisi"
                        }}</span>
                      </div>
                    </div>

                    <div class="space-y-1">
                      <label class="text-sm font-medium text-gray-700"
                        >Nilai Kerja Dicadangkan</label
                      >
                      <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                        <span class="text-sm font-medium text-gray-900 whitespace-pre-wrap">
                          RM
                          {{
                            laporanTeknikal.nilaiKerja?.toLocaleString() || "0"
                          }}
                        </span>
                      </div>
                    </div>
                  </div>
                </template>
              </rs-card>
            </rs-tab-item>
          </rs-tab>
          
          <rs-card class="shadow-sm border-0 bg-white">
            <template #header>
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div
                    class="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center"
                  >
                    <Icon
                      name="ph:currency-circle-dollar"
                      class="w-6 h-6 text-emerald-600"
                    />
                  </div>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-gray-900">
                    Maklumat Kadar Bantuan
                  </h2>
                  <p class="text-sm text-gray-500">
                    Nilai kadar bantuan berdasarkan BQ
                  </p>
                </div>
              </div>
            </template>

            <template #body>
              <div class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div class="space-y-1">
                    <!-- <label class="text-sm font-medium text-gray-700"
                      >Kadar Bantuan</label
                    > -->
                    <div class="space-y-1">
                      <label class="text-sm font-medium text-gray-700">Kadar Bantuan</label>
                      <input
                        type="number"
                        v-model="formData.jumlahBantuan"
                        class="mt-1 w-full p-3 bg-white border rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-green-500 focus:outline-none"
                        placeholder="Masukkan jumlah bantuan"
                      />
                      <span class="text-sm text-gray-500">(Diambil dari BQ)</span>
                    </div>
                    <!-- <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                       <span class="text-lg font-semibold text-gray-900">
                        RM {{ jumlahBantuan.toLocaleString() }}
                      </span> 
                      <input
                        type="number"
                        v-model="formData.jumlahBantuan"
                        class="mt-1 w-full p-3 bg-white border rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-green-500 focus:outline-none"
                        placeholder="Masukkan jumlah bantuan"
                      />
                      <span class="text-sm text-gray-500 ml-2"
                        >(Diambil dari BQ)</span
                      >
                    </div> -->
                  </div>

                  <!-- <div class="space-y-1">
                    <label class="text-sm font-medium text-gray-700"
                      >Tempoh/Kekerapan</label
                    >
                    <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                      <span class="text-lg font-semibold text-gray-900">
                        RM {{ jumlahBantuan.toLocaleString() }}
                      </span>
                      <span class="text-sm text-gray-500 ml-2"
                        >(Diambil dari BQ)</span>
                    </div>
                  </div> -->

                  <div class="space-y-1">
                    <label class="text-sm font-medium text-gray-700">Tempoh/Kekerapan</label>
                    <input
                    type="number"
                    v-model="formData.tempohKekerapan"
                    class="mt-1 w-full p-3 bg-white border rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-green-500 focus:outline-none"
                    placeholder="Masukkan bilangan tempoh/kekerapan"
                    />
                  </div>

                </div>

                <!-- Tarikh Mula & Tarikh Tamat side by side -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div class="space-y-1">
                    <label class="text-sm font-medium text-gray-700">Tarikh Mula</label>
                    <input
                      type="date"
                      v-model="formData.tarikhMula"
                      class="w-full p-3 bg-white border rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-green-500 focus:outline-none"
                    />
                  </div>

                  <div class="space-y-1">
                    <label class="text-sm font-medium text-gray-700">Tarikh Tamat</label>
                    <input
                      type="date"
                      v-model="formData.tarikhTamat"
                      class="w-full p-3 bg-white border rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-green-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div class="space-y-1">
                  <label class="text-sm font-medium text-gray-700"
                    >Jumlah Keseluruhan Bantuan akan Diterima</label
                  >
                   <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                    <!-- <span class="text-lg font-semibold text-gray-900">
                      RM {{ jumlahBantuan.toLocaleString() }}
                    </span> -->
                    <span class="text-lg font-semibold text-gray-900">
                      RM {{ jumlahKeseluruhan.toLocaleString() }}
                    </span>
                  </div>
                </div>
                

                <!-- <div class="space-y-1">
                  <label class="text-sm font-medium text-gray-700"
                    >Catatan Pengesyoran</label
                  >
                  <div
                    class="mt-1 p-3 bg-gray-50 rounded-lg border min-h-[80px]"
                  >
                    <span class="text-sm text-gray-900">{{
                      catatanPengesyoran || "Diambil dari BQ"
                    }}</span>
                  </div>
                </div> -->

                <!-- Post-approval buttons (only shown after approval) -->
                <div v-if="isApproved" class="space-y-2 pt-4 border-t">
                  <rs-button
                    variant="success-outline"
                    @click="viewArahanKerja"
                    class="w-full !py-2 text-sm"
                  >
                    <Icon name="ph:file-text" class="w-4 h-4 mr-2" />
                    Lihat Arahan Kerja
                  </rs-button>

                  <rs-button
                    variant="info-outline"
                    @click="urusPemantauan"
                    class="w-full !py-2 text-sm"
                  >
                    <Icon name="ph:monitor" class="w-4 h-4 mr-2" />
                    Urus Pemantauan
                  </rs-button>
                </div>
              </div>

              
            </template>
          </rs-card>

        </div>
        <div class="col-span-1">
          <!-- Section 6: Catatan Lapangan (C/U/V) -->
          <!-- <rs-card class="shadow-sm border-0 bg-white">
            <template #header>
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div
                    class="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center"
                  >
                    <Icon name="ph:notebook" class="w-6 h-6 text-indigo-600" />
                  </div>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-gray-900">
                    Catatan Lapangan
                  </h2>
                  <p class="text-sm text-gray-500">
                    Nota dan dapatan semasa lawatan lapangan
                  </p>
                </div>
              </div>
            </template>

            <template #body>
              <div class="space-y-4">
                <FormKit
                  type="textarea"
                  label="Catatan Lapangan"
                  v-model="catatanLapangan.catatan"
                  rows="6"
                  placeholder="Masukkan catatan, dapatan dan pemerhatian semasa lawatan lapangan..."
                  :classes="{ input: 'text-sm' }"
                />

                <div class="text-xs text-gray-500">
                  <Icon name="ph:clock" class="w-4 h-4 inline mr-1" />
                  Masa/Tarikh: {{ catatanLapangan.masaTarikh }}
                </div>
              </div>
            </template>
          </rs-card> -->

          <!-- Section 7: Status Lawatan -->
          <rs-card class="shadow-sm border-0 bg-white">
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
              <FormKit
                type="select"
                label="Status Sokongan"
                :options="statusLawatanOptions"
                v-model="formData.statusLawatan"
                :classes="{ input: 'text-sm' }"
              />
              <div class="space-y-4">
                <FormKit
                  type="textarea"
                  label="Catatan Lapangan"
                  v-model="catatanLapangan.catatan"
                  rows="6"
                  placeholder="Masukkan catatan, dapatan dan pemerhatian semasa lawatan lapangan..."
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
              </div>
            </template>
            
          </rs-card>

          

          <!-- Section 9: Action Buttons -->
          <rs-card class="p-4">
            <div class="flex flex-col sm:flex-row gap-3 justify-end">
              <rs-button
                variant="success"
                @click="handleSimpan"
                :disabled="processing"
                :loading="processing && actionType === 'simpan'"
              >
                Simpan
              </rs-button>

              <rs-button
                variant="primary"
                @click="handleSelesaiDanHantar"
                :disabled="processing"
                :loading="processing && actionType === 'complete_submit'"
              >
                Hantar Kelulusan
              </rs-button>

              <rs-button
                variant="danger"
                @click="handleBatal"
                :disabled="processing"
                :loading="processing"
              >
                Kembali
              </rs-button>
            </div>
          </rs-card>
        </div>
      </div>
    </div>

    <!-- BQ Modal -->
    <rs-modal v-model="showBQModal" size="xl" :closable="false">
      <template #header>
        <h3 class="text-lg font-semibold">
          {{ editingBQ ? "Edit" : "Tambah" }} BQ
        </h3>
      </template>
      <template #body>
        <!-- BQ form content will be added here -->
        <div class="text-center py-8 text-gray-500">
          <p>
            BQ Form content akan dibangunkan mengikut keperluan dalam
            REQUIREMENTS.md
          </p>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-3">
          <rs-button variant="primary-outline" @click="closeBQModal">
            Batal
          </rs-button>
          <rs-button variant="primary" @click="saveBQ"> Simpan </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>


<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";

const route = useRoute();
const router = useRouter();
const toast = useToast();
const processing = ref(false);
const actionType = ref("");

definePageMeta({
  title: "Siasatan Lapangan",
});

const breadcrumb = ref([
  {
    name: "Tugasan",
    type: "link",
    path: "/BF-BTN/tugasan",
  },
  {
    name: "Siasatan ke Lapangan",
    type: "link",
    path: "/BF-BTN/tugasan",
  },
  {
    name: "Kemaskini Siasatan",
    type: "current",
    path: `/BF-BTN/tugasan/bantuan/siasatan/${route.params.id}`,
  },
]);

// Section 1: Maklumat Pemohon data
const formData = ref({
  aid: "B102	Bantuan Binaan Rumah (Fakir)",
  aidproduct: "Bantuan Binaan Rumah (Fakir)",
  productpackage: "3 Bilik (Fakir) - Tanggungan 3-6 Orang",
  entitlementproduct: "3 Bilik (Fakir) - Tanggungan 3-6 Orang",
  jumlahBantuan: 43000,
  // noTelefon: "0123456789",
  // emel: "rosli@gmail.com",
  // statusKeluarga: "Fakir",
  // statusIndividu: "Fakir",
  // statusMultidimensi: "Asnaf Tidak Produktif",
  // statusLawatan: "belum_selesai",
});

// Section 2: Dokumen Sokongan
const dokumenSokongan = ref([
  // {
  //   jenis: "Quotation (baik pulih)",
  //   filename: "quotation.pdf",
  //   url: "#",
  //   status: "lengkap",
  // },
  {
    jenis: "Geran Tanah",
    filename: "geran_tanah.pdf",
    url: "#",
    status: "lengkap",
  },
  {
    jenis: "Carian Rasmi Pejabat Tanah",
    filename: "carian_rasmi.pdf",
    url: "#",
    status: "lengkap",
  },
]);

// Section 3: Draf BQ
const bqList = ref([
  {
    noBQ: "BQ202508647",
    namaBQ: "BQ MOHD ROSLI BIN SAAD",
    jumlahBQ: "RM43,000",
    status: "Dalam Proses",
  },
]);

const showBQModal = ref(false);
const editingBQ = ref(null);

// Section 4: Laporan Gambar
const gambarLokasi = ref([
  {
    url: "/img/placeholder-image.jpg",
    catatan: "Keadaan semasa rumah",
    masaUpload: new Date().toISOString(),
  },
  {
    url: "/img/placeholder-image.jpg",
    catatan: "Bahagian yang perlu dibaiki",
    masaUpload: new Date().toISOString(),
  },
]);

// Section 5: Laporan Teknikal
const laporanTeknikal = ref({
  latarBelakang: "",
  keperluan: "",
  cadangan: "",
  nilaiKerja: 0,
});

// Section 6: Catatan Lapangan
const catatanLapangan = ref({
  catatan: "",
  masaTarikh: new Date().toLocaleString("ms-MY"),
});

// Section 8: Jumlah Bantuan & Catatan Pengesyoran
const jumlahBantuan = ref(25000);
const catatanPengesyoran = ref("");
const isApproved = ref(false); // This will be true after approval

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

const statusDokumenOptions = ref([
  { label: "Lengkap", value: "lengkap" },
  { label: "Tidak Lengkap", value: "tidak_lengkap" },
  { label: "Tiada Keperluan", value: "tiada_keperluan" },
]);



const jumlahKeseluruhan = computed(() => {
  const kadar = parseFloat(formData.value.jumlahBantuan) || 0
  const tempoh = parseInt(formData.value.tempohKekerapan) || 0
  return kadar * tempoh
})


// Methods
const getStatusVariant = (status) => {
  const variants = {
    baru: "info",
    dalam_semakan: "warning",
    tidak_lengkap: "danger",
    lengkap: "success",
    menunggu_siasatan: "warning",
    lawatan_dijadualkan: "info",
    selesai_lawatan: "success",
  };
  return variants[status?.toLowerCase()] || "default";
};

const getStatusText = (status) => {
  const statusMap = {
    baru: "Baru",
    dalam_semakan: "Dalam Semakan",
    tidak_lengkap: "Tidak Lengkap",
    lengkap: "Lengkap",
    menunggu_siasatan: "Menunggu Siasatan Lapangan",
    lawatan_dijadualkan: "Lawatan Dijadualkan",
    selesai_lawatan: "Selesai Lawatan Lapangan",
  };
  return statusMap[status?.toLowerCase()] || status;
};

const getBQStatusVariant = (status) => {
  const variants = {
    "Dalam Kelulusan": "warning",
    "Dalam Proses": "info",
    Selesai: "success",
    Ditolak: "danger",
  };
  return variants[status] || "default";
};

const previewDocument = (dokumen) => {
  console.log("Previewing document:", dokumen);
  // Implement document preview functionality
};

const downloadDocument = (dokumen) => {
  console.log("Downloading document:", dokumen);
  // Implement document download functionality
};

// BQ Functions
const openBQForm = () => {
  editingBQ.value = null;
  showBQModal.value = true;
};

const editBQ = (bq) => {
  // Navigate to dedicated BQ drafting/editing page with current id and edit flag
  router.push(
    `/BF-BTN/tugasan/bantuan/siasatan/${route.params.id}/draf-bq?edit=true`
  );
};

const closeBQModal = () => {
  showBQModal.value = false;
  editingBQ.value = null;
};

const saveBQ = () => {
  // Implement BQ save functionality
  toast.success("BQ telah disimpan");
  closeBQModal();
};

// Navigation Functions
const openLaporanGambar = () => {
  router.push(
    `/BF-BTN/tugasan/bantuan/siasatan/${route.params.id}/laporan-gambar`
  );
};

const openLaporanTeknikal = () => {
  router.push(
    `/BF-BTN/tugasan/bantuan/siasatan/${route.params.id}/laporan-teknikal`
  );
};

const viewArahanKerja = () => {
  router.push(
    `/BF-BTN/permohonan/senarai-siasatan-lapangan/${route.params.id}/arahan-kerja`
  );
};

const urusPemantauan = () => {
  router.push(
    `/BF-BTN/permohonan/senarai-siasatan-lapangan/${route.params.id}/pemantauan`
  );
};

// Action Button Functions
const handleSimpanDraf = async () => {
  try {
    processing.value = true;

    // Implement save draft functionality
    console.log("Saving draft...");

    toast.success("Draf telah disimpan");
  } catch (error) {
    toast.error("Ralat semasa menyimpan draf");
    console.error(error);
  } finally {
    processing.value = false;
  }
};

const handleSimpanDrafDanSahkan = async () => {
  try {
    processing.value = true;
    actionType.value = "draft_confirm";

    // Implement save draft and confirm completion functionality
    console.log("Saving draft and confirming completion...");

    // Update status lawatan
    formData.value.statusLawatan = "selesai_lawatan";

    toast.success("Draf telah disimpan dan status lawatan telah dikemaskini");
  } catch (error) {
    toast.error("Ralat semasa menyimpan dan mengesahkan");
    console.error(error);
  } finally {
    processing.value = false;
    actionType.value = "";
  }
};

const handleSelesaiDanHantar = async () => {
  try {
    processing.value = true;
    actionType.value = "complete_submit";

    // Validate required fields before submission
    if (
      !formData.value.statusproses ||
      formData.value.statusproses === "belum_selesai"
    ) {
      toast.error(
        "Sila kemaskini Status Proses"
      );
      return;
    }

    // Implement complete and submit functionality
    console.log("Completing and submitting to approval...");

    toast.success("Siasatan telah selesai dan dihantar untuk kelulusan");

    // Navigate back to list
    router.push("/BF-BTN/tugasan/bantuan/siasatan/siasatan-eoad");
  } catch (error) {
    toast.error("Ralat semasa menyelesaikan dan menghantar");
    console.error(error);
  } finally {
    processing.value = false;
    actionType.value = "";
  }
};

const handleSimpan = async () => {
  try {
    processing.value = true;
    actionType.value = "simpan";

    // Validate required fields before submission
    if (
      !formData.value.statusproses ||
      formData.value.statusproses === "belum_selesai"
    ) {
      toast.error(
        "Sila kemaskini Status Proses"
      );
      return;
    }

    // Implement complete and submit functionality
    console.log("Completing and submitting to approval...");

    toast.success("Maklumat telah berjaya disimpan");

    // Navigate back to list
    //router.push("/BF-BTN/tugasan/bantuan/siasatan/siasatan-eoad");
  } catch (error) {
    toast.error("Ralat semasa menyelesaikan dan menghantar");
    console.error(error);
  } finally {
    processing.value = false;
    actionType.value = "";
  }
};

const handleBatal = () => {
  router.push("/BF-BTN/tugasan/bantuan/siasatan/siasatan-eoad");
};

// Fetch application data on mount
onMounted(() => {
  console.log("onMounted executed"); // Debug log
  
  // Implement API call to fetch application data
  // This is mock data for now
  formData.value = {
    aid: "B102	Bantuan Binaan Rumah (Fakir)",
    aidproduct: "Bantuan Binaan Rumah (Fakir)",
    productpackage: "3 Bilik (Fakir) - Tanggungan 3-6 Orang",
    entitlementproduct: "3 Bilik (Fakir) - Tanggungan 3-6 Orang",
    jumlahBantuan: 43000,
    // nama: "Mohd Rosli bin Saad",
    // alamat: "No. 123, Jalan Merdeka, Taman Sejahtera, 50000 Kuala Lumpur",
    // jenisPengenalan: "No Pengenalan",
    // myKad: "880701121234",
    // noTelefon: "0123456789",
    // emel: "rosli@gmail.com",
    // statusKeluarga: "Fakir",
    // statusIndividu: "Fakir",
    // statusMultidimensi: "Asnaf Tidak Produktif",
    statusLawatan: "Perlu Diproses",
  };

  console.log("formData set:", formData.value); // Debug log

  // Auto-populate laporan teknikal latar belakang from profiling
  laporanTeknikal.value.latarBelakang =
    `1. Keterangan Harta Benda:
Binaan rumah daripada separa batu dan kayu.

2. Status hakmilik tanah seperti berikut :
No Lot : 3439
Mukim : JERAM
Daerah : KUALA SELANGOR
Nama Pemilik : MOHD ROSLI BIN SAAD
ANG Bahagian : 1/14
Luas : 1.1635 HEKTAR
Lain-lain : - NIL-

3. Maklumat Isirumah :
Ketua Keluarga : Pemohon (MISKIN)
Pasangan : 1 orang isteri tinggal bersama
Tanggungan : - NIL-
Lain-lain : - NIL-`;
laporanTeknikal.value.keperluan = `Keadaan rumah separa uzur. Sebahagian besar struktur rumah yang dibina daripada kayu telah uzur dan reput dimakan anal-anal.
Keadaan rumah tidak sempuma.

Pemohon tidak mepunyai pendapatan yang mencukupi untuk membaiki kerosakan yang berlaku dirumahnya.
Untuk rekod, rumah masih dalam keadaan baik untuk diduduki dan sesuai untuk dibaikpulih.`;

laporanTeknikal.value.cadangan = `Dicadangkan kerja-kerja baikpulih berikut :

1. Meroboh bahagian rumah yang rosak dan retak.
2. Membina semula struktur bangunan rumah yang baru.
3. Membaikpulih dan menaiktaraf pendawalan elektrik bahagian rumah yang terlibat.`;

laporanTeknikal.value.nilaiKerja = "43000"
  // Auto-calculate jumlah bantuan from BQ (mock calculation)
  jumlahBantuan.value = 25000;
  catatanPengesyoran.value =
    "Cadangan kerja baik pulih bumbung bocor dan cat dinding luar untuk memastikan keselamatan dan keselesaan pemohon.";
});
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

// Table row hover effect
.hover\:bg-gray-50:hover {
  background-color: #f9fafb;
}

// Document card styling
.border-gray-200 {
  border-color: #e5e7eb;
}

.bg-gray-50 {
  background-color: #f9fafb;
}
</style>
