<template>
  <div class="">
    <div class="">
      <LayoutsBreadcrumb :items="breadcrumb" />

      <!-- Page Header -->
      <header class="mt-6 mb-8" role="banner">
        <div
          class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div class="flex-1">
            <h1
              class="text-3xl font-bold text-gray-900 tracking-tight"
              id="page-title"
            >
              Sokongan BQ
            </h1>
            <p class="mt-2 text-sm text-gray-600 max-w-2xl" role="doc-subtitle">
              Sokongan Bill of Quantity untuk kerja-kerja cadangan
            </p>
          </div>
          <rs-button
            variant="primary-outline"
            @click="handleBack"
            class="text-sm px-4 py-2 shrink-0"
            :aria-label="'Kembali ke halaman siasatan untuk ' + route.params.id"
          >
            <Icon
              name="ph:arrow-left"
              class="w-4 h-4 mr-2"
              aria-hidden="true"
            />
            Kembali
          </rs-button>
        </div>
      </header>

      <main class="space-y-6" role="main" aria-labelledby="page-title">
        <!-- BQ Header Information -->
        <section aria-labelledby="bq-header-title">
          

        

          <rs-card class="shadow-sm border-0 bg-white">
            <template #header>
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0" aria-hidden="true">
                  <div
                    class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"
                  >
                    <Icon name="ph:file-text" class="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div>
                  <h2
                    class="text-lg font-semibold text-gray-900"
                    id="bq-header-title"
                  >
                    Maklumat BQ
                  </h2>
                  <p class="text-sm text-gray-500">
                    Maklumat asas untuk dokumen BQ
                  </p>
                </div>
              </div>
            </template>

            <template #body>
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                <!-- Auto-generated fields (Read-only) -->
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700"
                    >No Borang BQ / Rujukan</label
                  >
                  <div class="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <span class="text-sm font-mono text-gray-900 break-all">{{
                      formData.noBQ
                    }}</span>
                  </div>
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700"
                    >No BR</label
                  >
                  <div class="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <span class="text-sm font-mono text-gray-900 break-all">{{
                      formData.noBR
                    }}</span>
                  </div>
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700"
                    >Nama Pemohon & Institusi</label
                  >
                  <div class="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <span class="text-sm text-gray-900 break-words">{{
                      formData.namaPemohon
                    }}</span>
                  </div>
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700"
                    >Tarikh Siasatan</label
                  >
                  <div class="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <span class="text-sm text-gray-900">{{
                      formData.tarikhSiasatan
                    }}</span>
                  </div>
                </div>

                <div class="space-y-2 lg:col-span-2">
                  <label class="block text-sm font-medium text-gray-700"
                    >Alamat</label
                  >
                  <div class="p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <span
                      class="text-sm text-gray-900 break-words leading-relaxed"
                      >{{ formData.alamat }}</span
                    >
                  </div>
                </div>
              </div>
            </template>
          </rs-card>
        </section>

        <!-- Table Senarai Item Kerja -->
        <section aria-labelledby="item-kerja-title">
          <rs-card class="shadow-sm border-0 bg-white">
            <template #header>
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <div class="flex-shrink-0" aria-hidden="true">
                    <div
                      class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center"
                    >
                      <Icon name="ph:list" class="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <div>
                    <h2
                      class="text-lg font-semibold text-gray-900"
                      id="item-kerja-title"
                    >
                      Senarai Item Kerja
                    </h2>
                    <p class="text-sm text-gray-500">
                      Senarai kerja dan anggaran kos
                    </p>
                  </div>
                </div>
                <rs-badge variant="info" class="text-sm px-3 py-1">
                  <Icon name="ph:eye" class="w-4 h-4 mr-1" />
                  Mode Semakan
                </rs-badge>
              </div>
            </template>

            <template #body>
              <!-- Mobile Card Layout (sm and below) -->
              <div class="block lg:hidden space-y-4">
                <div
                  v-for="(item, index) in formData.itemKerja"
                  :key="index"
                  class="p-4 border border-gray-200 rounded-lg bg-gray-50"
                >
                  <div class="flex justify-between items-start mb-3">
                    <span class="text-sm font-medium text-gray-600"
                      >Item {{ index + 1 }}</span
                    >
                    <rs-badge variant="secondary" size="sm" class="px-2 py-1">
                      Item {{ index + 1 }}
                    </rs-badge>
                  </div>

                  <div class="grid grid-cols-2 gap-3">
                    <div class="space-y-1">
                      <label class="text-xs font-medium text-gray-700"
                        >REF</label
                      >
                      <div class="p-2 bg-white rounded border border-gray-200">
                        <span class="text-sm text-gray-900">{{
                          item.ref || "-"
                        }}</span>
                      </div>
                    </div>
                    <div class="space-y-1">
                      <label class="text-xs font-medium text-gray-700"
                        >Unit</label
                      >
                      <div class="p-2 bg-white rounded border border-gray-200">
                        <span class="text-sm text-gray-900">{{
                          item.unit || "-"
                        }}</span>
                      </div>
                    </div>
                    <div class="space-y-1">
                      <label class="text-xs font-medium text-gray-700"
                        >Kuantiti</label
                      >
                      <div class="p-2 bg-white rounded border border-gray-200">
                        <span class="text-sm text-gray-900">{{
                          item.kuantiti || 0
                        }}</span>
                      </div>
                    </div>
                    <div class="space-y-1">
                      <label class="text-xs font-medium text-gray-700"
                        >Kadar (RM)</label
                      >
                      <div class="p-2 bg-white rounded border border-gray-200">
                        <span class="text-sm text-gray-900"
                          >RM {{ (item.kadar || 0).toFixed(2) }}</span
                        >
                      </div>
                    </div>
                  </div>

                  <div class="mt-3 space-y-1">
                    <label class="text-xs font-medium text-gray-700"
                      >Keterangan Kerja</label
                    >
                    <div
                      class="p-2 bg-white rounded border border-gray-200 min-h-[50px]"
                    >
                      <span class="text-sm text-gray-900">{{
                        item.keteranganKerja || "Tiada keterangan"
                      }}</span>
                    </div>
                  </div>
                </div>

                <div
                  v-if="formData.itemKerja.length === 0"
                  class="p-8 text-center text-sm text-gray-500 border border-gray-200 rounded-lg"
                >
                  Tiada item kerja. Klik butang "Tambah Item" untuk menambah
                  item kerja.
                </div>
              </div>

              <!-- Desktop Table Layout (lg and above) -->
              <div class="hidden lg:block overflow-x-auto">
                <table
                  class="min-w-full divide-y divide-gray-200"
                  role="table"
                  aria-label="Senarai item kerja untuk BQ"
                >
                  <thead class="bg-gray-50" role="rowgroup">
                    <tr role="row">
                      <th
                        class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16"
                        scope="col"
                        role="columnheader"
                      >
                        Bil
                      </th>
                      <th
                        class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20"
                        scope="col"
                        role="columnheader"
                      >
                        REF
                      </th>
                      <th
                        class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-0"
                        scope="col"
                        role="columnheader"
                      >
                        Keterangan Kerja
                      </th>
                      <th
                        class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20"
                        scope="col"
                        role="columnheader"
                      >
                        Unit
                      </th>
                      <th
                        class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24"
                        scope="col"
                        role="columnheader"
                      >
                        Kuantiti
                      </th>
                      <th
                        class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32"
                        scope="col"
                        role="columnheader"
                      >
                        Kadar (RM)
                      </th>
                    </tr>
                  </thead>
                  <tbody
                    class="bg-white divide-y divide-gray-200"
                    role="rowgroup"
                  >
                    <tr
                      v-for="(item, index) in formData.itemKerja"
                      :key="index"
                      class="hover:bg-gray-50 transition-colors"
                      role="row"
                    >
                      <td
                        class="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                        role="gridcell"
                      >
                        {{ index + 1 }}
                      </td>
                      <td class="px-3 py-4" role="gridcell">
                        <div
                          class="p-2 bg-gray-50 rounded border border-gray-200"
                        >
                          <span class="text-sm text-gray-900">{{
                            item.ref || "-"
                          }}</span>
                        </div>
                      </td>
                      <td class="px-3 py-4" role="gridcell">
                        <div
                          class="p-2 bg-gray-50 rounded border border-gray-200 min-h-[50px]"
                        >
                          <span
                            class="text-sm text-gray-900 whitespace-pre-wrap"
                            >{{
                              item.keteranganKerja || "Tiada keterangan"
                            }}</span
                          >
                        </div>
                      </td>
                      <td class="px-3 py-4" role="gridcell">
                        <div
                          class="p-2 bg-gray-50 rounded border border-gray-200"
                        >
                          <span class="text-sm text-gray-900">{{
                            item.unit || "-"
                          }}</span>
                        </div>
                      </td>
                      <td class="px-3 py-4" role="gridcell">
                        <div
                          class="p-2 bg-gray-50 rounded border border-gray-200"
                        >
                          <span class="text-sm text-gray-900 font-mono">{{
                            (item.kuantiti || 0).toFixed(2)
                          }}</span>
                        </div>
                      </td>
                      <td class="px-3 py-4" role="gridcell">
                        <div
                          class="p-2 bg-gray-50 rounded border border-gray-200"
                        >
                          <span class="text-sm text-gray-900 font-mono"
                            >RM {{ (item.kadar || 0).toFixed(2) }}</span
                          >
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Total Section -->
              <div class="mt-6 border-t border-gray-200 pt-6">
                <div class="flex justify-end">
                  <div
                    class="w-full max-w-sm space-y-3 bg-gray-50 p-4 rounded-lg"
                  >
                    <div
                      class="flex justify-between items-center text-sm text-gray-600"
                    >
                      <span class="font-medium">Subtotal:</span>
                      <span class="font-mono"
                        >RM
                        {{
                          subtotal.toLocaleString("ms-MY", {
                            minimumFractionDigits: 2,
                          })
                        }}</span
                      >
                    </div>
                    <div
                      class="flex justify-between items-center text-lg font-bold text-gray-900 border-t border-gray-300 pt-3"
                    >
                      <span>Jumlah Keseluruhan BQ:</span>
                      <span class="font-mono text-blue-600">
                        RM
                        {{
                          formData.jumlahKeseluruhan.toLocaleString("ms-MY", {
                            minimumFractionDigits: 2,
                          })
                        }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </rs-card>
        </section>

        <!-- Summary & Additional Info -->
        <section aria-labelledby="summary-title">
          <rs-card class="shadow-sm border-0 bg-white">
            <template #header>
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0" aria-hidden="true">
                  <div
                    class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center"
                  >
                    <Icon name="ph:note" class="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <div>
                  <h2
                    class="text-lg font-semibold text-gray-900"
                    id="summary-title"
                  >
                    Ringkasan & Maklumat Tambahan
                  </h2>
                  <p class="text-sm text-gray-500">
                    Ringkasan BQ dan maklumat pengesahan
                  </p>
                </div>
              </div>
            </template>

            <template #body>
              <div class="space-y-6">
                <!-- Read-only Catatan Pengesyoran -->
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">
                    Catatan Pengesyoran
                  </label>
                  <div
                    class="p-3 bg-gray-50 rounded-lg border border-gray-200 min-h-[100px]"
                  >
                    <span class="text-sm text-gray-900 whitespace-pre-wrap">{{
                      formData.catatanPengesyoran ||
                      "Tiada catatan pengesyoran."
                    }}</span>
                  </div>
                </div>

                <!-- Recommendation line mirroring the document -->
                <div class="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p class="text-sm text-green-800 font-medium">
                    💡 Disyorkan kerja-kerja baik pulih dengan nilai RM 
                    {{
                      formData.jumlahKeseluruhan.toLocaleString("ms-MY", {
                        minimumFractionDigits: 2,
                      })
                    }}.
                  </p>
                </div>

                <!-- Catatan Sokongan Hartanah -->
                <!-- <div class="space-y-1">
                  <label class="text-sm font-medium text-gray-700"
                    >Catatan Sokongan Hartanah</label
                  >
                  <FormKit
                    type="textarea"
                    v-model="catatanLapangan.catatanSokonganHartanah"
                    placeholder="Boleh mengisi catatan sokongan atau ulasan pembetulan sekiranya BQ memerlukan rework"
                    rows="4"
                  />
                </div> -->

                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">
                    Catatan Hartanah
                  </label>
                  <textarea
                    v-model="formData.catatansokonganhartanah"
                    class="w-full p-3 bg-white border rounded-lg text-sm text-gray-900 outline-none min-h-[100px]"
                    placeholder="Masukkan catatan hartanah jika perlu kemaskini BQ"
                  ></textarea>
                </div>



                <!-- Digital Signature Section -->
                <div class="border-t border-gray-200 pt-6">
                  <div class="flex items-center space-x-2 mb-6">
                    <Icon name="ph:signature" class="w-5 h-5 text-blue-600" />
                    <h3 class="text-lg font-semibold text-gray-900">
                      Pengesahan Digital
                    </h3>
                    <div
                      class="ml-auto flex items-center space-x-2 text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full"
                    >
                      <Icon name="ph:user-circle" class="w-4 h-4" />
                      <span class="font-medium">{{
                        getCurrentStageDisplay()
                      }}</span>
                    </div>
                  </div>

                  <!-- Dynamic signature display based on current stage -->
                  <div class="max-w-md">
                    <!-- Disediakan Stage -->
                    <div
                      v-if="currentStage === 'disediakan'"
                      class="space-y-3 p-4 bg-green-50 rounded-lg border-2 border-green-300 relative"
                    >
                      <div
                        class="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center"
                      >
                        <Icon name="ph:user" class="w-3 h-3 mr-1" />
                        Anda
                      </div>
                      <label class="block text-sm font-medium text-green-700">
                        <Icon
                          name="ph:pencil-simple"
                          class="w-4 h-4 inline mr-1 text-green-600"
                        />
                        Disediakan
                      </label>
                      <div class="p-3 bg-white rounded border border-green-200">
                        <div class="text-sm font-medium text-gray-900">
                          {{ formData.disediakanOleh }}
                        </div>
                        <div class="text-xs text-gray-500 mt-1">
                          Pegawai Teknikal
                        </div>
                      </div>
                      <div
                        class="text-xs text-green-600 flex items-center font-medium"
                      >
                        <Icon name="ph:calendar" class="w-3 h-3 mr-1" />
                        Tarikh: {{ new Date().toLocaleDateString("ms-MY") }}
                      </div>
                      <div class="text-xs text-green-600 flex items-center">
                        <Icon name="ph:check-circle" class="w-3 h-3 mr-1" />
                        Status: Aktif
                      </div>
                    </div>

                    <!-- Disemak 1 Stage -->
                    <div
                      v-else-if="currentStage === 'disemak1'"
                      class="space-y-3 p-4 bg-blue-50 rounded-lg border-2 border-blue-300 relative"
                    >
                      <div
                        class="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full flex items-center"
                      >
                        <Icon name="ph:user" class="w-3 h-3 mr-1" />
                        Anda
                      </div>
                      <label class="block text-sm font-medium text-blue-700">
                        <Icon
                          name="ph:check-circle"
                          class="w-4 h-4 inline mr-1 text-blue-600"
                        />
                        Disemak 1
                      </label>
                      <div class="p-3 bg-white rounded border border-blue-200">
                        <div class="text-sm font-medium text-gray-900">
                          {{ formData.disemak1 || "Menunggu tindakan anda" }}
                        </div>
                        <div class="text-xs text-gray-500 mt-1">
                          Pegawai Penyemak 1
                        </div>
                      </div>
                      <div
                        class="text-xs text-blue-600 flex items-center font-medium"
                      >
                        <Icon name="ph:calendar" class="w-3 h-3 mr-1" />
                        Tarikh:
                        {{
                          formData.tarikhDisemak1 ||
                          new Date().toLocaleDateString("ms-MY")
                        }}
                      </div>
                      <div class="text-xs text-blue-600 flex items-center">
                        <Icon name="ph:clock" class="w-3 h-3 mr-1" />
                        Status: Sedang Disemak
                      </div>
                    </div>

                    <!-- Disemak 2 Stage -->
                    <div
                      v-else-if="currentStage === 'disemak2'"
                      class="space-y-3 p-4 bg-purple-50 rounded-lg border-2 border-purple-300 relative"
                    >
                      <div
                        class="absolute -top-2 -right-2 bg-purple-500 text-white text-xs px-2 py-1 rounded-full flex items-center"
                      >
                        <Icon name="ph:user" class="w-3 h-3 mr-1" />
                        Anda
                      </div>
                      <label class="block text-sm font-medium text-purple-700">
                        <Icon
                          name="ph:check-circle"
                          class="w-4 h-4 inline mr-1 text-purple-600"
                        />
                        Disemak 2
                      </label>
                      <div
                        class="p-3 bg-white rounded border border-purple-200"
                      >
                        <div class="text-sm font-medium text-gray-900">
                          {{ formData.disemak2 || "Menunggu tindakan anda" }}
                        </div>
                        <div class="text-xs text-gray-500 mt-1">
                          Pegawai Penyemak 2
                        </div>
                      </div>
                      <div
                        class="text-xs text-purple-600 flex items-center font-medium"
                      >
                        <Icon name="ph:calendar" class="w-3 h-3 mr-1" />
                        Tarikh:
                        {{
                          formData.tarikhDisemak2 ||
                          new Date().toLocaleDateString("ms-MY")
                        }}
                      </div>
                      <div class="text-xs text-purple-600 flex items-center">
                        <Icon name="ph:clock" class="w-3 h-3 mr-1" />
                        Status: Sedang Disemak
                      </div>
                    </div>

                    <!-- Diluluskan Stage -->
                    <div
                      v-else-if="currentStage === 'diluluskan'"
                      class="space-y-3 p-4 bg-emerald-50 rounded-lg border-2 border-emerald-300 relative"
                    >
                      <div
                        class="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs px-2 py-1 rounded-full flex items-center"
                      >
                        <Icon name="ph:user" class="w-3 h-3 mr-1" />
                        Anda
                      </div>
                      <label class="block text-sm font-medium text-emerald-700">
                        <Icon
                          name="ph:seal-check"
                          class="w-4 h-4 inline mr-1 text-emerald-600"
                        />
                        Diluluskan
                      </label>
                      <div
                        class="p-3 bg-white rounded border border-emerald-200"
                      >
                        <div class="text-sm font-medium text-gray-900">
                          {{ formData.diluluskan || "Menunggu tindakan anda" }}
                        </div>
                        <div class="text-xs text-gray-500 mt-1">
                          Pegawai Pelulus
                        </div>
                      </div>
                      <div
                        class="text-xs text-emerald-600 flex items-center font-medium"
                      >
                        <Icon name="ph:calendar" class="w-3 h-3 mr-1" />
                        Tarikh:
                        {{
                          formData.tarikhDisahkan ||
                          new Date().toLocaleDateString("ms-MY")
                        }}
                      </div>
                      <div class="text-xs text-emerald-600 flex items-center">
                        <Icon name="ph:seal-check" class="w-3 h-3 mr-1" />
                        Status: Sedang Diluluskan
                      </div>
                    </div>
                  </div>

                  <!-- Workflow Information -->
                  <div
                    class="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200"
                  >
                    <div class="flex items-start space-x-3">
                      <Icon
                        name="ph:info"
                        class="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"
                      />
                      <div>
                        <h4 class="text-sm font-medium text-blue-900 mb-1">
                          Aliran Kerja Pengesahan
                        </h4>
                        <p
                          class="text-sm text-blue-700 leading-relaxed"
                          v-html="getWorkflowStatusMessage()"
                        ></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </rs-card>
        </section>

        <!-- Action Buttons -->
        <section aria-labelledby="actions-title" class="sr-only">
          <h2 id="actions-title">Tindakan BQ</h2>
        </section>

        <rs-card class="p-4">
          <div class="flex flex-col lg:flex-row gap-3 lg:justify-between">
            <div class="flex gap-3">
              <rs-button
                variant="success"
                @click="handleLuluskan"
                :disabled="processing"
                :loading="processing && actionType === 'approve'"
                class="!py-3 text-sm font-medium"
              >
                <Icon name="ph:check-circle" class="w-5 h-5 mr-2" />
                Luluskan BQ
              </rs-button>

              <rs-button
                variant="warning"
                @click="handleMintaKemaskini"
                :disabled="processing"
                :loading="processing && actionType === 'request_update'"
                class="!py-3 text-sm font-medium"
              >
                <Icon name="ph:arrow-counter-clockwise" class="w-5 h-5 mr-2" />
                Minta Kemaskini
              </rs-button>

              <rs-button
                variant="danger"
                @click="handleTolak"
                :disabled="processing"
                :loading="processing && actionType === 'reject'"
                class="!py-3 text-sm font-medium"
              >
                <Icon name="ph:x-circle" class="w-5 h-5 mr-2" />
                Tolak BQ
              </rs-button>
            </div>

            <rs-button
              variant="secondary"
              @click="handleBack"
              class="!py-3 text-sm font-medium"
            >
              <Icon name="ph:arrow-left" class="w-5 h-5 mr-2" />
              Kembali
            </rs-button>
          </div>
        </rs-card>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";

const route = useRoute();
const router = useRouter();
const toast = useToast();
const processing = ref(false);
const actionType = ref("");

definePageMeta({
  title: "Semakan Draf BQ",
});

const breadcrumb = ref([
  {
    name: "Tugasan",
    type: "link",
    path: "/BF-BTN/tugasan",
  },
  {
    name: "Sokongan Siasatan",
    type: "link",
    path: `/BF-BTN/tugasan/bantuan/sokongan/${route.params.id}`,
  },
  {
    name: "Sokongan - BQ",
    type: "current",
    path: `/BF-BTN/tugasan/bantuan/sokongan/${route.params.id}/draf-bq`,
  },
]);

// Check if we're editing an existing BQ
const editingBQ = computed(() => route.query.edit === "true");

// Options for pegawai selection
const pegawaiOptions = ref([
  { label: "Ahmad bin Ali - Pegawai Teknikal", value: "ahmad_ali" },
  { label: "Siti binti Hassan - Pegawai Kanan", value: "siti_hassan" },
  { label: "Mohd bin Ibrahim - Ketua Pegawai", value: "mohd_ibrahim" },
]);

// Form data with better structure
const formData = ref({
  noBQ: "",
  noBR: "",
  namaPemohon: "",
  alamat: "",
  tarikhSiasatan: "",
  itemKerja: [],
  jumlahKeseluruhan: 0,
  ringgiMalaysiaPerkataan: "",
  catatanPengesyoran: "",
  disediakanOleh: "",
  disemak1: "",
  disemak2: "",
  diluluskan: "",
  tarikhDisemak1: "",
  tarikhDisemak2: "",
  tarikhDisahkan: "",
  // Personal Information
  nama: "Mohd Rosli bin Saad",
  alamat: "No. 123, Jalan Merdeka, Taman Sejahtera, 50000 Kuala Lumpur",
  jenisPengenalan: "MyKad",
  noPengenalan: "810101121234",
  noTelefon: "0123456789",
  email: "rosli@gmail.com",
  statusKeluarga: "Fakir",
  statusIndividu: "Fakir",
  statusMultidimensi: "Asnaf Tidak Produktif",
});

// Current workflow stage - in a real app this would come from the document status
const currentStage = ref("disemak1"); // 'disediakan', 'disemak1', 'disemak2', 'diluluskan'


// Utility functions (moved before computed properties to avoid hoisting issues)
const numberToWords = (amount) => {
  if (!amount || amount === 0) return "";

  // Simplified implementation - in production, use a proper number-to-words library
  const thousands = Math.floor(amount / 1000);
  const remainder = Math.round(amount % 1000);

  if (thousands > 0) {
    return `${thousands} ribu ${
      remainder > 0 ? remainder : ""
    } ringgit sahaja`.trim();
  } else {
    return `${Math.round(amount)} ringgit sahaja`;
  }
};

const generateCatatanPengesyoran = (total = 0) => {
  if (total > 0) {
    return `Cadangan kerja baik pulih dengan anggaran kos sebanyak RM ${total.toLocaleString(
      "ms-MY",
      { minimumFractionDigits: 2 }
    )} adalah berpatutan dan dicadangkan untuk kelulusan.`;
  }
  return "";
};

// Helper functions for dynamic signature display
const getCurrentStageDisplay = () => {
  const stageMap = {
    disediakan: "Anda: Disediakan",
    disemak1: "Anda: Disemak 1",
    disemak2: "Anda: Disemak 2",
    diluluskan: "Anda: Diluluskan",
  };
  return stageMap[currentStage.value] || "Status tidak diketahui";
};

const getWorkflowStatusMessage = () => {
  const messages = {
    disediakan:
      "Dokumen BQ ini sedang dalam peringkat <strong>Disediakan</strong>. Setelah selesai disediakan, dokumen akan dikirim untuk semakan dan kelulusan mengikut hierarki yang ditetapkan.",
    disemak1:
      "Dokumen BQ ini sedang dalam peringkat <strong>Disemak 1</strong>. Sila semak kandungan dokumen dan berikan persetujuan atau komen untuk tindakan lanjut.",
    disemak2:
      "Dokumen BQ ini sedang dalam peringkat <strong>Disemak 2</strong>. Sila semak kandungan dokumen dan berikan persetujuan atau komen untuk tindakan lanjut.",
    diluluskan:
      "Dokumen BQ ini sedang dalam peringkat <strong>Kelulusan</strong>. Sila semak keseluruhan dokumen untuk kelulusan akhir.",
  };
  return messages[currentStage.value] || "Status aliran kerja tidak diketahui.";
};

// Computed properties
const subtotal = computed(() => {
  return formData.value.itemKerja.reduce((total, item) => {
    const kuantiti = Number(item.kuantiti) || 0;
    const kadar = Number(item.kadar) || 0;
    return total + kuantiti * kadar;
  }, 0);
});

// Watch for subtotal changes and auto-update totals
watch(
  subtotal,
  (newValue) => {
    formData.value.jumlahKeseluruhan = newValue;
    formData.value.ringgiMalaysiaPerkataan = numberToWords(newValue);
    // Only auto-generate catatan if it's empty (don't overwrite user input)
    if (
      !formData.value.catatanPengesyoran ||
      formData.value.catatanPengesyoran.trim() === ""
    ) {
      formData.value.catatanPengesyoran = generateCatatanPengesyoran(newValue);
    }
  },
  { immediate: true }
);

// Update totals function (now mainly for manual triggers)
const updateTotals = () => {
  // This will trigger the watcher above
  const currentSubtotal = subtotal.value;
  formData.value.jumlahKeseluruhan = currentSubtotal;
};

// Item management methods
const addItem = () => {
  formData.value.itemKerja.push({
    ref: "CMP",
    keteranganKerja: "",
    unit: "",
    kuantiti: 1,
    kadar: 0,
  });
};

const removeItem = (index) => {
  if (index >= 0 && index < formData.value.itemKerja.length) {
    formData.value.itemKerja.splice(index, 1);
  }
};

// Action handlers
const handleLuluskan = async () => {
  if (processing.value) return;

  try {
    processing.value = true;
    actionType.value = "approve";

    // Implement approval functionality
    console.log("Approving BQ:", formData.value);

    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success("BQ telah diluluskan");

    setTimeout(() => {
      handleBack();
    }, 1500);
  } catch (error) {
    toast.error("Ralat semasa meluluskan BQ");
    console.error("Approve error:", error);
  } finally {
    processing.value = false;
    actionType.value = "";
  }
};

const handleMintaKemaskini = async () => {
  if (processing.value) return;

  try {
    processing.value = true;
    actionType.value = "request_update";

    // Implement request update functionality
    console.log("Requesting BQ updates:", formData.value);

    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success("Permintaan kemaskini BQ telah dihantar");

    setTimeout(() => {
      handleBack();
    }, 1500);
  } catch (error) {
    toast.error("Ralat semasa menghantar permintaan kemaskini");
    console.error("Request update error:", error);
  } finally {
    processing.value = false;
    actionType.value = "";
  }
};

const handleTolak = async () => {
  if (processing.value) return;

  try {
    processing.value = true;
    actionType.value = "reject";

    // Implement rejection functionality
    console.log("Rejecting BQ:", formData.value);

    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success("BQ telah ditolak");

    setTimeout(() => {
      handleBack();
    }, 1500);
  } catch (error) {
    toast.error("Ralat semasa menolak BQ");
    console.error("Reject error:", error);
  } finally {
    processing.value = false;
    actionType.value = "";
  }
};

const handleBack = () => {
  router.push(`/BF-BTN/tugasan/bantuan/sokongan/${route.params.id}`);
};

// Generate unique IDs
const generateBQNumber = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const random = String(Math.floor(Math.random() * 1000)).padStart(3, "0");
  return `BQ${year}${month}${random}`;
};

const generateBRNumber = () => {
  const now = new Date();
  const year = now.getFullYear();
  const random = String(Math.floor(Math.random() * 1000)).padStart(3, "0");
  return `BR-${year}-${random}`;
};

// Initialize form data
const initializeFormData = () => {
  const today = new Date();
  const currentUser = "Ahmad bin Ali"; // This would come from authentication system

  const baseData = {
    noBQ: generateBQNumber(),
    noBR: generateBRNumber(),
    aid: "B102	Bantuan Binaan Rumah (Fakir)",
    aidproduct: "Bantuan Binaan Rumah (Fakir)",
    productpackage: "3 Bilik (Fakir) - Tanggungan 3-6 Orang",
    entitlementproduct: "3 Bilik (Fakir) - Tanggungan 3-6 Orang",
    namaPemohon: "MOHD ROSLI BIN SAAD",
    nama: "Mohd Rosli bin Saad",
    alamat: "No. 123, Jalan Merdeka, Taman Sejahtera, 50000 Kuala Lumpur",
    jenisPengenalan: "MyKad",
    mykad: "810101121234",
    noTelefon: "0123456789",
    emel: "rosli@gmail.com",
    statusKeluarga: "Fakir",
    statusIndividu: "Fakir",
    statusMultidimensi: "Asnaf Tidak Produktif",
    tarikhSiasatan: today.toISOString().split("T")[0],
    itemKerja: [],
    jumlahKeseluruhan: 0,
    ringgiMalaysiaPerkataan: "",
    catatanPengesyoran: "",
    disediakanOleh: currentUser,
    disemak1: "",
    disemak2: "",
    diluluskan: "",
    tarikhDisemak1: "",
    tarikhDisemak2: "",
    tarikhDisahkan: "",
  };

  // Add sample data for checking mode
  baseData.itemKerja = [
    {
      ref: "CMP",
      keteranganKerja:
        "Membaiki kebocoran bumbung - termasuk penggantian gentian yang rosak dan rekaulk sambungan",
      unit: "Pukal",
      kuantiti: 1,
      kadar: 8500,
    },
    {
      ref: "CMP",
      keteranganKerja:
        "Mengecat semula dinding luar rumah - termasuk kerja-kerja scrapping dan primer",
      unit: "Pukal",
      kuantiti: 1,
      kadar: 4200,
    },
    {
      ref: "CMP",
      keteranganKerja:
        "Penggantian papan siling yang rosak di ruang tamu dan bilik",
      unit: "Meter persegi",
      kuantiti: 25.5,
      kadar: 45,
    },
    {
      ref: "CMP",
      keteranganKerja:
        "Baik pulih dan pembersihan longkang di sekeliling rumah",
      unit: "Meter panjang",
      kuantiti: 35,
      kadar: 85,
    },
    {
      ref: "CMP",
      keteranganKerja: "Kerja-kerja kecil dan pembersihan tapak",
      unit: "Pukal",
      kuantiti: 1,
      kadar: 1500,
    },
  ];

  // Set catatan pengesyoran for checking mode
  baseData.catatanPengesyoran =
    "Berdasarkan siasatan lapangan yang telah dijalankan, kerja-kerja baik pulih yang dicadangkan adalah perlu dan mendesak untuk memastikan keselamatan dan keselesaan penghuni. Anggaran kos yang dikemukakan adalah munasabah dan berpatutan mengikut kadar semasa pasaran.";

  return baseData;
};

// Load existing data on mount
onMounted(async () => {
  try {
    formData.value = initializeFormData();
    // Auto-calculation will be triggered by the watcher
  } catch (error) {
    toast.error("Ralat semasa memuatkan data BQ");
    console.error("Initialization error:", error);
  }
});
</script>

<style lang="scss" scoped>
// Enhanced typography and spacing
.text-3xl {
  letter-spacing: -0.025em;
}

// Improved table styling for better readability
.min-w-full {
  font-size: 0.875rem;

  th {
    font-weight: 600;
    letter-spacing: 0.025em;
  }

  td {
    vertical-align: top;
  }
}

// Enhanced form styling
.formkit-wrapper {
  margin: 0;

  .formkit-input {
    transition: all 0.2s ease-in-out;

    &:focus {
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
  }
}

// Improved number formatting with consistent styling
.currency,
.font-mono {
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Consolas,
    "Liberation Mono", Menlo, monospace;
  font-variant-numeric: tabular-nums;
}

// Card hover effects
.rs-card {
  transition: box-shadow 0.2s ease-in-out;

  &:hover {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }
}

// Icon consistency
.icon {
  flex-shrink: 0;
}

// Responsive button improvements
@media (max-width: 1023px) {
  .rs-button {
    justify-content: center;
    text-align: center;
  }
}

// Focus indicators for better accessibility
button:focus,
.formkit-input:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

// Print styles for PDF generation
@media print {
  .sticky {
    position: static !important;
  }

  .shadow-sm,
  .shadow {
    box-shadow: none !important;
  }

  .bg-gray-50 {
    background-color: #f9fafb !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}
</style>
