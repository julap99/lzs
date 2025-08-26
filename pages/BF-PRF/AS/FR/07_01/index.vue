<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Maklumat Pemohon</h2>
          <rs-badge
            v-if="formData.status"
            :variant="getStatusVariant(formData.status)"
          >
            {{ formData.status }}
          </rs-badge>
        </div>
      </template>

      <template #body>
        <FormKit
          type="form"
          :actions="false"
          @submit="handleSubmit"
          v-model="formData"
        >
          <!-- Section 1: Maklumat Pemohon -->
          <rs-fieldset class="mb-6">
            <template #legend>
              <h3 class="text-lg font-medium">Information</h3>
            </template>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Nama</label
                >
                <p class="text-gray-900">{{ formData.nama }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Alamat</label
                >
                <p class="text-gray-900">{{ formData.alamat }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Jenis Pengenalan</label
                >
                <p class="text-gray-900">{{ formData.jenisPengenalan }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >No Pengenalan</label
                >
                <p class="text-gray-900">{{ formData.noPengenalan }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >No Telefon</label
                >
                <p class="text-gray-900">{{ formData.noTelefon }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >E-mel</label
                >
                <p class="text-gray-900">{{ formData.email }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Status Keluarga</label
                >
                <p class="text-gray-900">{{ formData.statusKeluarga }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Status Individu</label
                >
                <p class="text-gray-900">{{ formData.statusIndividu }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Status Multidimensi</label
                >
                <p class="text-gray-900">{{ formData.statusMultidimensi }}</p>
              </div>
            </div>
          </rs-fieldset>
        </FormKit>
      </template>
    </rs-card>

    <div class="flex flex-col lg:flex-row gap-4 mt-4">
      <rs-card class="flex-1">
        <template #header>
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold">Maklumat di lapangan</h2>
          </div>
        </template>

        <template #body>
          <!-- Main Tabs -->
          <rs-tab variant="primary" type="card">
            <rs-tab-item title="Profiling" active>
              <!-- Profiling Tab Content -->
              <div class="space-y-6">
                                 <!-- <h3 class="text-lg font-semibold mb-4 text-gray-800">
                   Pengesahan Status
                 </h3> -->

                <!-- Profiling Form -->
                <div
                  class="bg-white border border-gray-200 rounded-lg overflow-hidden"
                >
                  <FormKit
                    type="form"
                    :actions="false"
                    @submit="handleProfilingSubmit"
                    v-model="profilingData"
                    class="divide-y divide-gray-200"
                  >
                                         <!-- Section 1: Search & Basic Info -->
                     <div class="p-6 bg-gray-50">
                       
                       <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                         <!-- Pengenalan ID with Search - Hidden -->
                         <!-- <div class="lg:col-span-2">
                           <div class="flex gap-3">
                             <FormKit
                               type="text"
                               name="pengenalanId"
                               label="Pengenalan ID"
                               placeholder="Masukkan nombor pengenalan"
                               :classes="{
                                 outer: 'flex-1',
                                 input: '!py-2.5',
                                 label: 'text-sm font-medium text-gray-700',
                               }"
                             />
                             <rs-button
                               variant="primary"
                               class="mt-7 px-6 h-fit"
                               @click="searchPengenalanId"
                               :loading="searchingId"
                             >
                               <Icon
                                 name="ph:magnifying-glass"
                                 class="w-4 h-4 mr-1"
                               />
                               Cari
                             </rs-button>
                           </div>
                         </div> -->

                         <!-- Nama - Hidden -->
                         <!-- <div class="lg:col-span-2">
                           <FormKit
                             type="text"
                             name="nama"
                             label="Nama Penuh"
                             placeholder="Nama akan dipaparkan setelah carian"
                             :classes="{
                               input: '!py-2.5',
                               label: 'text-sm font-medium text-gray-700',
                             }"
                             :disabled="!profilingData.pengenalanId"
                           />
                         </div> -->
                       </div>
                     </div>

                    <!-- Section 2: Maklumat Syor -->
                    <div class="p-6">
                      <h4
                        class="text-md font-semibold text-gray-900 mb-4 flex items-center"
                      >
                        <Icon
                          name="ph:clipboard-text"
                          class="w-5 h-5 mr-2 text-green-600"
                        />
                        Maklumat Syor
                      </h4>
                      <div class="grid grid-cols-1 lg:grid-cols-1 gap-6">
                        <!-- Left Column - Syor -->
                        <div class="space-y-4">
                          <FormKit
                            type="number"
                            name="hadKifayahSyor"
                             v-model="formData.hadKifayahSyor"
                            label="%Had Kifayah (Syor)"
                            placeholder="0"
                            :classes="{
                              input: '!py-2.5',
                              label: 'text-sm font-medium text-gray-700',
                            }"
                            min="0"
                            max="100"
                            step="0.01"
                          />

                          <FormKit
                            type="text"
                            name="kategoriKeluargaAsnafSyor"
                            label="Kategori Keluarga Asnaf (Syor)"
                            placeholder="Kategori keluarga"
                            :classes="{
                              input: '!py-2.5',
                              label: 'text-sm font-medium text-gray-700',
                            }"
                          />

                          <FormKit
                            type="text"
                            name="kategoriAsnafSyor"
                            label="Kategori Asnaf (Syor)"
                            placeholder="Kategori asnaf"
                            :classes="{
                              input: '!py-2.5',
                              label: 'text-sm font-medium text-gray-700',
                            }"
                          />

                          <FormKit
                            type="date"
                            name="tarikhPengesyoran"
                            label="Tarikh Pengesyoran"
                            :classes="{
                              input: '!py-2.5',
                              label: 'text-sm font-medium text-gray-700',
                            }"
                          />
                        </div>

                        <!-- Right Column - Tanggungan Syor -->
                        <div class="space-y-4">
                          <FormKit
                            type="text"
                            name="kategoriTanggunganSyor"
                            label="Kategori Tanggungan (Syor)"
                            placeholder="Kategori tanggungan"
                            :classes="{
                              input: '!py-2.5',
                              label: 'text-sm font-medium text-gray-700',
                            }"
                          />

                          <!-- Pengenalan ID Tanggungan Group -->
                          <div class="bg-gray-50 p-4 rounded-lg border">
                            <label
                              class="block text-sm font-medium text-gray-700 mb-3"
                            >
                              Pengenalan ID Tanggungan
                            </label>
                            <div class="space-y-3">
                              <FormKit
                                type="text"
                                name="pengenalanIdTanggungan1"
                                placeholder="ID Tanggungan 1"
                                :classes="{
                                  outer: 'mb-0',
                                  input: '!py-2 text-sm',
                                }"
                              />
                              <FormKit
                                type="text"
                                name="pengenalanIdTanggungan2"
                                placeholder="ID Tanggungan 2"
                                :classes="{
                                  outer: 'mb-0',
                                  input: '!py-2 text-sm',
                                }"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                                         <!-- Section 3: Assignment -->
                     <div class="p-6 bg-amber-50">
                       <h4
                         class="text-md font-semibold text-gray-900 mb-4 flex items-center"
                       >
                         <Icon
                           name="ph:user-gear"
                           class="w-5 h-5 mr-2 text-amber-600"
                         />
                         Tugasan Siasatan
                       </h4>
                       <FormKit
                         type="select"
                         name="assignSiasatan"
                         label="Assign Siasatan"
                         :options="assignSiasatanOptions"
                         placeholder="Pilih petugas siasatan"
                         :classes="{
                           input: '!py-2.5',
                           label: 'text-sm font-medium text-gray-700',
                         }"
                       />
                       <div class="mt-4 flex justify-end">
                         <rs-button
                           variant="primary"
                           @click="handleTugasanHantar"
                           class="px-6 py-2.5"
                         >
                           <Icon name="ph:paper-plane-right" class="w-4 h-4 mr-2" />
                           Hantar
                         </rs-button>
                       </div>
                     </div>

                    <!-- Section 4: Maklumat Disahkan -->
                    <div class="p-6">
                      <h4
                        class="text-md font-semibold text-gray-900 mb-4 flex items-center"
                      >
                        <Icon
                          name="ph:check-circle"
                          class="w-5 h-5 mr-2 text-blue-600"
                        />
                        Maklumat Disahkan
                      </h4>
                      <div class="grid grid-cols-1 lg:grid-cols-1 gap-6">
                        <!-- Left Column - Sah -->
                        <div class="space-y-4">
                          <FormKit
                            type="number"
                            name="hadKifayahSah"
                            label="%Had Kifayah (Sah)"
                            placeholder="0"
                            :classes="{
                              input: '!py-2.5',
                              label: 'text-sm font-medium text-gray-700',
                            }"
                            min="0"
                            max="100"
                            step="0.01"
                          />

                          <FormKit
                            type="text"
                            name="kategoriKeluargaAsnafSah"
                            label="Kategori Keluarga Asnaf (Sah)"
                            placeholder="Kategori keluarga disahkan"
                            :classes="{
                              input: '!py-2.5',
                              label: 'text-sm font-medium text-gray-700',
                            }"
                          />

                          <FormKit
                            type="text"
                            name="kategoriAsnafSah"
                            label="Kategori Asnaf (Sah)"
                            placeholder="Kategori asnaf disahkan"
                            :classes="{
                              input: '!py-2.5',
                              label: 'text-sm font-medium text-gray-700',
                            }"
                          />
                        </div>

                        <!-- Right Column - Tanggungan Sah -->
                        <div class="space-y-4">
                          <!-- Pengenalan ID Tanggungan (Sah) -->
                          <div
                            class="bg-blue-50 p-4 rounded-lg border border-blue-200"
                          >
                            <label
                              class="block text-sm font-medium text-gray-700 mb-3"
                            >
                              Pengenalan ID Tanggungan (Sah)
                            </label>
                            <div class="space-y-3">
                              <FormKit
                                type="text"
                                name="pengenalanIdTanggunganSah1"
                                placeholder="ID Tanggungan Sah 1"
                                :classes="{
                                  outer: 'mb-0',
                                  input: '!py-2 text-sm',
                                }"
                              />
                              <FormKit
                                type="text"
                                name="pengenalanIdTanggunganSah2"
                                placeholder="ID Tanggungan Sah 2"
                                :classes="{
                                  outer: 'mb-0',
                                  input: '!py-2 text-sm',
                                }"
                              />
                            </div>
                          </div>

                          <!-- Kategori Tanggungan (Sah) -->
                          <div
                            class="bg-blue-50 p-4 rounded-lg border border-blue-200"
                          >
                            <label
                              class="block text-sm font-medium text-gray-700 mb-3"
                            >
                              Kategori Tanggungan (Sah)
                            </label>
                            <div class="space-y-3">
                              <FormKit
                                type="text"
                                name="kategoriTanggunganSah1"
                                placeholder="Kategori Tanggungan Sah 1"
                                :classes="{
                                  outer: 'mb-0',
                                  input: '!py-2 text-sm',
                                }"
                              />
                              <FormKit
                                type="text"
                                name="kategoriTanggunganSah2"
                                placeholder="Kategori Tanggungan Sah 2"
                                :classes="{
                                  outer: 'mb-0',
                                  input: '!py-2 text-sm',
                                }"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Pelarasan (Sah) -->
                      <div class="mt-6">
                        <label
                          class="block text-sm font-medium text-gray-700 mb-3"
                        >
                          Pelarasan (Sah)
                        </label>
                        <div
                          class="bg-gray-50 border border-gray-200 rounded-lg p-4"
                        >
                          <div class="grid grid-cols-3 gap-4 text-center">
                            <div class="flex flex-col items-center">
                              <Icon
                                name="ph:x-circle"
                                class="w-6 h-6 text-red-500 mb-2"
                              />
                              <span class="text-sm font-medium text-gray-700"
                                >Status 1</span
                              >
                              <span class="text-sm text-red-600 font-medium"
                                >FALSE</span
                              >
                            </div>
                            <div class="flex flex-col items-center">
                              <Icon
                                name="ph:x-circle"
                                class="w-6 h-6 text-red-500 mb-2"
                              />
                              <span class="text-sm font-medium text-gray-700"
                                >Status 2</span
                              >
                              <span class="text-sm text-red-600 font-medium"
                                >FALSE</span
                              >
                            </div>
                            <div class="flex flex-col items-center">
                              <Icon
                                name="ph:x-circle"
                                class="w-6 h-6 text-red-500 mb-2"
                              />
                              <span class="text-sm font-medium text-gray-700"
                                >Status 3</span
                              >
                              <span class="text-sm text-red-600 font-medium"
                                >FALSE</span
                              >
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Section 5: Komen & Tarikh -->
                    <div class="p-6 bg-gray-50">
                      <h4
                        class="text-md font-semibold text-gray-900 mb-4 flex items-center"
                      >
                        <Icon
                          name="ph:note"
                          class="w-5 h-5 mr-2 text-purple-600"
                        />
                        Komen & Finalisasi
                      </h4>
                      <div class="space-y-4">
                        <!-- Komen Pengesahan -->
                        <FormKit
                          type="textarea"
                          name="komenPengesahan"
                          label="Komen Pengesahan"
                          rows="4"
                          placeholder="Masukkan komen pengesahan..."
                          :classes="{
                            input: '!py-3',
                            label: 'text-sm font-medium text-gray-700',
                          }"
                        />

                        <!-- Tarikh Pengesyoran (Bottom) -->
                        <div class="max-w-md">
                          <FormKit
                            type="date"
                            name="tarikhPengesyoranBottom"
                            label="Tarikh Pengesyoran Akhir"
                            :classes="{
                              input: '!py-2.5',
                              label: 'text-sm font-medium text-gray-700',
                            }"
                          />
                        </div>
                      </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="p-6 bg-white border-t border-gray-200">
                      <div class="flex flex-col sm:flex-row gap-3 justify-end">
                        <rs-button
                          variant="secondary"
                          @click="resetProfilingForm"
                          class="flex items-center justify-center px-6 py-2.5"
                        >
                          <Icon
                            name="ph:arrow-clockwise"
                            class="w-4 h-4 mr-2"
                          />
                          Reset
                        </rs-button>
                        <rs-button
                          variant="primary-outline"
                          @click="saveProfilingDraft"
                          :loading="savingDraft"
                          class="flex items-center justify-center px-6 py-2.5"
                        >
                          <Icon name="ph:floppy-disk" class="w-4 h-4 mr-2" />
                          Simpan Draf
                        </rs-button>
                        <rs-button
                          variant="primary"
                          @click="submitProfiling"
                          :loading="submittingProfile"
                          :disabled="!isProfilingFormValid"
                          class="flex items-center justify-center px-6 py-2.5"
                        >
                          <Icon name="ph:check-circle" class="w-4 h-4 mr-2" />
                          Sahkan & Simpan
                        </rs-button>
                      </div>
                    </div>
                  </FormKit>
                </div>
              </div>
            </rs-tab-item>

            <rs-tab-item title="Bantuan" v-if="false">
              <!-- Bantuan Tab Content with Sub-tabs -->
              <div>
                <h3 class="text-lg font-semibold mb-4 text-gray-800">
                  Maklumat Bantuan
                </h3>

                <!-- Sub-tabs for Bantuan -->
                <rs-tab variant="secondary" type="border" class="mb-6">
                  <rs-tab-item title="Syor" active>
                    <!-- Syor Sub-tab Content -->
                    <div class="space-y-4">
                      <div class="w-full overflow-x-auto">
                        <rs-table
                          :data="recommendedAid"
                          :columns="recommendedAidColumns"
                          :showNoColumn="true"
                          :options="{
                            variant: 'default',
                            striped: true,
                            hover: true,
                          }"
                          :options-advanced="{
                            sortable: true,
                            filterable: false,
                          }"
                          advanced
                        >
                          <template #header-terimaCadangan>
                            <div class="flex items-center gap-2" @click.stop>
                              <FormKit
                                type="checkbox"
                                v-model="selectAllSyor"
                                @change="toggleSelectAllSyor"
                                outer-class="mb-0"
                              />
                              <span class="text-sm">Pilih Semua</span>
                            </div>
                          </template>
                          <template v-slot:kadarDicadangkan="{ text }"
                            >RM {{ text }}</template
                          >
                          <template v-slot:skorAI="{ text }">
                            <rs-badge :variant="getScoreVariant(text)"
                              >{{ text }}%</rs-badge
                            >
                          </template>
                          <template v-slot:terimaCadangan="{ value }">
                            <FormKit
                              type="checkbox"
                              v-model="value.terimaCadangan"
                              outer-class="mb-0"
                            />
                          </template>
                        </rs-table>
                      </div>

                      <div class="flex justify-end">
                        <rs-button variant="primary">Sahkan</rs-button>
                      </div>
                    </div>
                  </rs-tab-item>

                  <rs-tab-item title="Bantuan daripada Agensi">
                    <!-- Bantuan daripada Agensi Sub-tab Content -->
                    <div class="space-y-3">
                      <div class="flex justify-end">
                        <span
                          class="text-sm text-gray-600 bg-gray-100 rounded-full px-3 py-1"
                          >{{ otherAgencyAssistance.length }} records / 50
                          max</span
                        >
                      </div>

                      <div class="w-full overflow-x-auto">
                        <rs-table
                          :data="otherAgencyAssistance"
                          :columns="otherAgencyColumns"
                          :showNoColumn="true"
                          :options="{
                            variant: 'default',
                            striped: true,
                            hover: true,
                          }"
                          :options-advanced="{
                            sortable: true,
                            filterable: false,
                          }"
                          advanced
                        >
                          <template v-slot:jumlah="{ text }"
                            >RM {{ text }}</template
                          >
                        </rs-table>
                      </div>
                    </div>
                  </rs-tab-item>

                  <rs-tab-item title="Bantuan Sedia Ada">
                    <!-- Bantuan Sedia Ada Sub-tab Content -->
                    <div class="space-y-3">
                      <div class="flex justify-end">
                        <span
                          class="text-sm text-gray-600 bg-gray-100 rounded-full px-3 py-1"
                          >{{ existingAssistance.length }} records</span
                        >
                      </div>

                      <div class="w-full overflow-x-auto">
                        <rs-table
                          :data="existingAssistance"
                          :columns="existingAssistanceColumns"
                          :showNoColumn="true"
                          :options="{
                            variant: 'default',
                            striped: true,
                            hover: true,
                          }"
                          :options-advanced="{
                            sortable: true,
                            filterable: false,
                          }"
                          advanced
                        >
                          <template v-slot:kadar="{ text }"
                            >RM {{ text }}</template
                          >
                          <template v-slot:jumlah="{ text }"
                            >RM {{ text }}</template
                          >
                          <template v-slot:status="{ text }">
                            <rs-badge
                              :variant="getAssistanceStatusVariant(text)"
                              >{{ text }}</rs-badge
                            >
                          </template>
                        </rs-table>
                      </div>
                    </div>
                  </rs-tab-item>

                  <rs-tab-item title="Perubahan Bantuan">
                    <!-- Perubahan Bantuan Sub-tab Content -->
                    <div class="space-y-8">
                      <!-- Senarai Bantuan yang mengalami Perubahan Kadar -->
                      <div class="space-y-3">
                        <h3 class="text-md font-semibold text-gray-900">
                          Perubahan Status: Mikin > Fakir
                        </h3>
                        <h4 class="text-md font-semibold text-gray-900">
                          Senarai Bantuan yang mengalami Perubahan Kadar
                        </h4>

                        <div class="w-full overflow-x-auto">
                          <rs-table
                            :data="bantuanPerubahanKadar"
                            :columns="perubahanColumns"
                            :showNoColumn="true"
                            :options="{
                              variant: 'default',
                              striped: true,
                              hover: true,
                            }"
                            :options-advanced="{
                              sortable: true,
                              filterable: false,
                            }"
                            advanced
                          >
                            <template #header-terimaCadangan>
                              <div class="flex items-center gap-2" @click.stop>
                                <FormKit
                                  type="checkbox"
                                  v-model="selectAllPerubahan"
                                  @change="toggleSelectAllPerubahan"
                                  outer-class="mb-0"
                                />
                                <span class="text-sm">Pilih Semua</span>
                              </div>
                            </template>
                            <template v-slot:terimaCadangan="{ value }">
                              <FormKit
                                type="checkbox"
                                v-model="value.terimaCadangan"
                                outer-class="mb-0"
                              />
                            </template>
                          </rs-table>
                        </div>

                        <div class="flex justify-end">
                          <rs-button variant="primary">Sahkan</rs-button>
                        </div>
                      </div>

                      <!-- Senarai Bantuan Sedia Ada yang akan dibatalkan -->
                      <div class="space-y-3">
                        <h4 class="text-md font-semibold text-gray-900">
                          Senarai Bantuan Sedia Ada yang akan dibatalkan
                        </h4>
                        <div class="flex items-center gap-2">
                          <FormKit
                            type="checkbox"
                            v-model="selectAllPembatalan"
                            @change="toggleSelectAllPembatalan"
                            outer-class="mb-0"
                          />
                          <span class="text-sm">Pilih Semua</span>
                        </div>

                        <div class="w-full overflow-x-auto">
                          <rs-table
                            :data="bantuanPembatalan"
                            :columns="pembatalanColumns"
                            :showNoColumn="true"
                            :options="{
                              variant: 'default',
                              striped: true,
                              hover: true,
                            }"
                            :options-advanced="{
                              sortable: true,
                              filterable: false,
                            }"
                            advanced
                          >
                            <template v-slot:batalBantuan="{ value }">
                              <FormKit
                                type="checkbox"
                                v-model="value.batalBantuan"
                                outer-class="mb-0"
                              />
                            </template>
                          </rs-table>
                        </div>

                        <div class="flex justify-end">
                          <rs-button variant="primary">Sahkan</rs-button>
                        </div>
                      </div>
                    </div>
                  </rs-tab-item>

                  <rs-tab-item title="Bantuan Baru">
                    <!-- Bantuan Baru Sub-tab Content -->
                    <div class="space-y-4">
                      <h4 class="text-md font-semibold text-gray-900">
                        Senarai Bantuan Yang Akan Diterima
                      </h4>

                      <div class="w-full overflow-x-auto">
                        <rs-table
                          :data="assistanceApplications"
                          :columns="assistanceColumns"
                          :showNoColumn="true"
                          :options="{
                            variant: 'default',
                            striped: true,
                            hover: true,
                          }"
                          :options-advanced="{
                            sortable: true,
                            filterable: false,
                          }"
                          advanced
                        >
                          <template v-slot:status="{ text }">
                            <rs-badge
                              :variant="getAssistanceStatusVariant(text)"
                              >{{ text }}</rs-badge
                            >
                          </template>

                          <template v-slot:actions="{ value }">
                            <rs-button
                              variant="primary-outline"
                              size="sm"
                              class="!px-2"
                              @click="editAssistance(value)"
                            >
                              <Icon name="mdi:pencil" class="w-4 h-4" />
                            </rs-button>
                          </template>
                        </rs-table>
                      </div>
                    </div>
                  </rs-tab-item>
                </rs-tab>
              </div>
            </rs-tab-item>
          </rs-tab>
        </template>
      </rs-card>

             <!-- Maklumat Lawatan & Siasatan section - Only show when data is submitted from 09 -->
       <rs-card v-if="hasSubmittedData" class="flex-1">
         <template #header>
           <div class="flex justify-between items-center">
             <h2 class="text-xl font-semibold">Maklumat Lawatan & Siasatan</h2>
           </div>
         </template>

         <template #body>
           <FormKit
             type="form"
             :actions="false"
             @submit="handleSubmitLawatan"
             v-model="investigationData"
           >
             <div class="space-y-6">
               <!-- Ringkasan Profil -->
               <div class="bg-blue-50 p-4 rounded-lg border border-blue-200">
                 <h4 class="text-sm font-semibold text-blue-900 mb-3">Ringkasan Profil</h4>
                 <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                   <div>
                     <span class="font-medium text-blue-800">Jenis Pekerjaan:</span>
                     <p class="mt-1 text-gray-900">{{ investigationData.jenisPekerjaan }}</p>
                   </div>
                   <div>
                     <span class="font-medium text-blue-800">Status Kediaman:</span>
                     <p class="mt-1 text-gray-900">{{ investigationData.statusKediaman }}</p>
                   </div>
                   <div>
                     <span class="font-medium text-blue-800">Jumlah Bayaran Rumah:</span>
                     <p class="mt-1 text-gray-900">{{ investigationData.jumlahBayaranRumah }}</p>
                   </div>
                   <div>
                     <span class="font-medium text-blue-800">Bilangan Tanggungan:</span>
                     <p class="mt-1 text-gray-900">{{ investigationData.bilTanggungan }}</p>
                   </div>
                   <div class="md:col-span-2">
                     <span class="font-medium text-blue-800">Status Tanggungan:</span>
                     <p class="mt-1 text-gray-900">{{ investigationData.statusTanggungan }}</p>
                   </div>
                 </div>
               </div>

               <!-- Keadaan Siasatan -->
               <div>
                 <h4 class="text-sm font-semibold text-gray-900 mb-3">Keadaan Siasatan</h4>
                 <FormKit
                   type="select"
                   name="keadaanSiasatan"
                   placeholder="Pilih keadaan siasatan"
                   :options="keadaanSiasatanOptions"
                   :classes="{ input: '!py-2.5' }"
                 />
               </div>

               <!-- Tarikh & Masa Lawatan -->
               <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                   <h4 class="text-sm font-semibold text-gray-900 mb-3">Tarikh Lawatan</h4>
                   <FormKit type="date" name="tarikhLawatan" :classes="{ input: '!py-2.5' }" />
                 </div>
                 <div>
                   <h4 class="text-sm font-semibold text-gray-900 mb-3">Masa Lawatan</h4>
                   <FormKit type="time" name="masaLawatan" :classes="{ input: '!py-2.5' }" />
                 </div>
               </div>

               <!-- Catatan Penilaian Awal -->
               <div>
                 <h4 class="text-sm font-semibold text-gray-900 mb-3">Catatan Penilaian Awal</h4>
                 <FormKit
                   type="textarea"
                   name="catatanPenilianAwal"
                   placeholder="Catatan penilaian awal..."
                   rows="4"
                   :classes="{ input: '!py-2.5' }"
                 />
               </div>

               <!-- Catatan Lawatan -->
               <div>
                 <h4 class="text-sm font-semibold text-gray-900 mb-3">Catatan Lawatan</h4>
                 <FormKit
                   type="textarea"
                   name="catatanLawatanETD"
                   placeholder="Catatan lawatan..."
                   rows="3"
                   :classes="{ input: '!py-2.5' }"
                 />
               </div>

               <!-- Status Lawatan -->
               <div>
                 <h4 class="text-sm font-semibold text-gray-900 mb-3">Status Lawatan</h4>
                 <FormKit
                   type="select"
                   name="statusLawatan"
                   placeholder="Pilih status lawatan"
                   :options="statusLawatanOptions"
                   :classes="{ input: '!py-2.5' }"
                 />
               </div>
             </div>
           </FormKit>
         </template>
       </rs-card>

       <!-- Message when no data is submitted yet -->
       <rs-card v-else class="flex-1">
         <template #header>
           <div class="flex justify-between items-center">
             <h2 class="text-xl font-semibold">Maklumat Lawatan & Siasatan</h2>
           </div>
         </template>

         <template #body>
           <div class="text-center py-12">
             <Icon name="ph:info" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
             <h3 class="text-lg font-medium text-gray-900 mb-2">Tiada Data Siasatan</h3>
                           <p class="text-gray-500">
                Data siasatan akan dipaparkan di sini selepas ia dihantar dari halaman Siasatan di Lapangan.
              </p>
           </div>
         </template>
       </rs-card>
    </div>

    <!-- Image Preview Modal -->
    <rs-modal v-model="showPreviewModal" size="xl" :closable="true">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium text-gray-900">Preview Gambar</h3>
          <div v-if="previewingImage" class="flex items-center gap-3">
            <span class="text-sm text-gray-500">{{
              formatFileSize(previewingImage.size)
            }}</span>
            <rs-button
              variant="primary-outline"
              size="sm"
              @click="downloadImage(previewingImage)"
            >
              <Icon name="ph:download" class="w-4 h-4 mr-1" />
              Muat Turun
            </rs-button>
          </div>
        </div>
      </template>
      <template #body>
        <div v-if="previewingImage" class="space-y-4">
          <!-- Image Container -->
          <div class="relative bg-gray-100 rounded-lg overflow-hidden">
            <img
              :src="previewingImage.url"
              :alt="previewingImage.filename"
              class="w-full h-auto max-h-96 object-contain mx-auto"
              style="max-height: 70vh"
            />
          </div>

          <!-- Image Details -->
          <div class="bg-gray-50 rounded-lg p-4 space-y-3">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Nama Fail</label
                >
                <p class="text-sm text-gray-900 bg-white p-2 rounded border">
                  {{ previewingImage.filename }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Saiz Fail</label
                >
                <p class="text-sm text-gray-900 bg-white p-2 rounded border">
                  {{ formatFileSize(previewingImage.size) }}
                </p>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Keterangan</label
              >
              <FormKit
                type="textarea"
                v-model="previewingImage.caption"
                placeholder="Tambah keterangan untuk gambar ini..."
                rows="3"
                :classes="{
                  outer: 'mb-0',
                  input: 'text-sm !py-2',
                }"
              />
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-3">
          <rs-button variant="secondary" @click="showPreviewModal = false">
            Tutup
          </rs-button>
          <rs-button variant="primary" @click="saveImageCaption">
            Simpan Keterangan
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useInvestigationStore } from "~/stores/investigation";

definePageMeta({
  title: "Maklumat Pemohon - Siasatan EOAD",
});

const breadcrumb = ref([
  {
    name: "Tugasan",
    type: "link",
    path: "/BF-BTN/tugasan",
  },
  {
    name: "Siasatan",
    type: "link",
    path: "/BF-BTN/tugasan",
  },
  {
    name: "Maklumat Pemohon",
    type: "current",
    path: "/BF-BTN/tugasan/siasatan-eoad",
  },
]);

// Form data
const formData = ref({
  // Personal Information
  nama: "Adnan bin Abu",
  alamat: "No. 123, Jalan Merdeka, Taman Sejahtera, 50000 Kuala Lumpur",
  jenisPengenalan: "MyKad",
  noPengenalan: "770319035991",
  noTelefon: "0123456789",
  email: "adnan@gmail.com",
  statusKeluarga: "Fakir",
  statusIndividu: "Fakir",
  statusMultidimensi: "Asnaf Tidak Produktif",
  status: "Dalam Siasatan",

  // Investigation fields
  keputusanSiasatan: "",
  tarikhLawatan: "",
  masaLawatan: "",
  catatanPenilianAwal: "",
  gambarLokasi: null,
});

// Investigation form data
const investigationData = ref({
  jenisPekerjaan: "Bekerja sebagai tukang sapu di sekolah",
  statusKediaman: "Rumah Sewa",
  jumlahBayaranRumah: "RM500",
  bilTanggungan: "2 Orang (Anak)",
  statusTanggungan: "Masih Bersekolah, Tidak Bekerja",
  keadaanSiasatan: "",
  tarikhLawatan: "",
  masaLawatan: "",
  catatanPenilianAwal: "",
  gambarLokasi: [],
  catatanLawatanETD: "",
  statusLawatan: "",
});

// Load submitted investigation data from 09 if available
onMounted(() => {
  const invStore = useInvestigationStore();
  if (invStore.latestSubmission) {
    Object.assign(investigationData.value, invStore.latestSubmission);
    // Optionally clear after consume
    // invStore.clearSubmission();
  }
});

// Profiling form data
const profilingData = ref({
  pengenalanId: "",
  nama: "",
  hadKifayahSyor: "50",
  kategoriKeluargaAsnafSyor: "",
  kategoriAsnafSyor: "",
  tarikhPengesyoran: "",
  pengenalanIdTanggungan1: "",
  pengenalanIdTanggungan2: "",
  kategoriTanggunganSyor: "",
  assignSiasatan: "",
  hadKifayahSah: "",
  kategoriKeluargaAsnafSah: "",
  kategoriAsnafSah: "",
  pengenalanIdTanggunganSah1: "",
  pengenalanIdTanggunganSah2: "",
  kategoriTanggunganSah1: "",
  kategoriTanggunganSah2: "",
  komenPengesahan: "",
  tarikhPengesyoranBottom: "",
});

// State for image handling
const uploadedImages = ref([]);
const showPreviewModal = ref(false);
const previewingImage = ref(null);
const processing = ref(false);
const actionType = ref("");
const uploadProgress = ref([]);
const fileInputRef = ref(null);

// State for profiling form
const searchingId = ref(false);
const savingDraft = ref(false);
const submittingProfile = ref(false);

// Dropdown options
const keadaanSiasatanOptions = [
  { label: "Boleh ditemui", value: "boleh_ditemui" },
  { label: "Tidak dapat ditemui", value: "tidak_dapat_ditemui" },
  { label: "Alamat tidak tepat", value: "alamat_tidak_tepat" },
  { label: "Berpindah alamat", value: "berpindah_alamat" },
];

const statusLawatanOptions = [
  { label: "Lengkap", value: "lengkap" },
  { label: "Tidak lengkap", value: "tidak_lengkap" },
  { label: "Perlu lawatan semula", value: "perlu_lawatan_semula" },
];

const assignSiasatanOptions = [
  { label: "PAK", value: "pak" },
  { label: "PAK+", value: "pak_plus" },
  { label: "Pegawai LZS", value: "pegawai_lzs" },
];

// Table columns for assistance applications
const assistanceColumns = [
  { key: "jenisBantuan", label: "JENIS BANTUAN", sortable: true },
  { key: "status", label: "STATUS", sortable: true },
  { key: "sla", label: "SLA", sortable: true },
  { key: "actions", label: "ACTIONS", sortable: false },
];

// Table columns for existing assistance
const existingAssistanceColumns = [
  { key: "jan", label: "JAN", sortable: true },
  { key: "kadar", label: "KADAR (RM)", sortable: true },
  { key: "frekuensi", label: "FREKUENSI", sortable: true },
  { key: "jumlah", label: "JUMLAH (RM)", sortable: true },
  { key: "status", label: "STATUS", sortable: true },
];

// Table columns for other agency assistance
const otherAssistanceColumns = [
  { key: "namaBantuan", label: "NAMA BANTUAN", sortable: true },
  { key: "jumlah", label: "JUMLAH (RM)", sortable: true },
  { key: "kekerapan", label: "KEKERAPAN", sortable: true },
  { key: "tahun", label: "TAHUN", sortable: true },
  { key: "tarikhDiperoleh", label: "TARIKH DATA DIPEROLEH", sortable: true },
  { key: "dataDaripada", label: "DATA DARIPADA", sortable: true },
];

// Table columns for Syor (Recommended Aid)
const recommendedAidColumns = [
  { key: "aid", label: "Aid", sortable: true },
  { key: "aidProduct", label: "Aid Product", sortable: true },
  { key: "productPackage", label: "Product Package", sortable: true },
  { key: "entitlementProduct", label: "Entitlement Product", sortable: true },
  { key: "kadarDicadangkan", label: "Kadar Dicadangkan", sortable: true },
  { key: "skorAI", label: "Skor AI", sortable: true },
  { key: "tarikhSyor", label: "Tarikh Syor", sortable: true },
  { key: "justifikasiSyor", label: "Justifikasi Syor", sortable: false },
  { key: "terimaCadangan", label: "Terima Cadangan", sortable: false },
];

// Alias for template usage
const otherAgencyColumns = otherAssistanceColumns;

// Perubahan Bantuan - columns
const perubahanColumns = [
  { key: "aid", label: "Aid", sortable: true },
  { key: "aidProduct", label: "Aid Product", sortable: true },
  { key: "productPackage", label: "Product Package", sortable: true },
  { key: "entitlementProduct", label: "Entitlement Product", sortable: true },
  { key: "terimaCadangan", label: "Terima Cadangan", sortable: false },
];

const pembatalanColumns = [
  { key: "aid", label: "Aid", sortable: true },
  { key: "aidProduct", label: "Aid Product", sortable: true },
  { key: "productPackage", label: "Product Package", sortable: true },
  { key: "entitlementProduct", label: "Entitlement Product", sortable: true },
  { key: "batalBantuan", label: "Batal Bantuan", sortable: false },
];

// Mock data for tables
const assistanceApplications = ref([
  {
    jenisBantuan: "B152 - Bantuan Binaan Rumah (Fakir)",
    status: "Dalam Semakan",
    sla: "3 hari lagi",
    actions: "edit",
  },
]);

const existingAssistance = ref([
  {
    jan: "Jan Sewaan/Ansuran Rumah (Fakir)",
    kadar: "800",
    frekuensi: "12",
    jumlah: "9,600",
    status: "Lulus",
  },
  {
    jan: "Jan Pendidikan Dialisis (Fakir)",
    kadar: "2,800",
    frekuensi: "6",
    jumlah: "16,800",
    status: "Lulus",
  },
]);

const otherAgencyAssistance = ref([
  {
    namaBantuan: "Program Kasih Siswa (dKasih)",
    jumlah: "1,300",
    kekerapan: "One-off",
    tahun: "2025",
    tarikhDiperoleh: "8/21/2025",
    dataDaripada: "ICU",
  },
  {
    namaBantuan: "Sumbangan Asas Rahmah (SARA)",
    jumlah: "2,100",
    kekerapan: "Berkala",
    tahun: "2025",
    tarikhDiperoleh: "8/21/2025",
    dataDaripada: "ICU",
  },
]);

// Recommended Aid data (Syor)
const recommendedAid = ref([
  {
    aid: "[B103] (HQ) BANTUAN PERUBATAN DIALISIS (FAKIR)",
    aidProduct: "(HQ) KATEGORI HEMODIALISIS (FAKIR)",
    productPackage: "(GL) (HQ) HEMODIALISIS DAN SUNTIKAN EPO (FAKIR)",
    entitlementProduct: "(GL) (HQ) SUNTIKAN EPO (FAKIR)",
    kadarDicadangkan: "500.00/bulan",
    skorAI: 87,
    tarikhSyor: "2025-08-07",
    justifikasiSyor:
      "Asnaf mempunyai masalah kesihatan dan perlu menjalani rawatan dialisis",
    terimaCadangan: false,
  },
  {
    aid: "[B106] BANTUAN MAKANAN BULANAN (FAKIR)",
    aidProduct: "MAKANAN BULANAN (FAKIR)",
    productPackage: "MAKANAN BULANAN TERAS (FAKIR) - K2",
    entitlementProduct:
      "K2 FAKIR - (10KG BERAS, 2KG TEPUNG, 2KG MINYAK, 2KG GULA, 2 BIHUN, 1 KICAP)",
    kadarDicadangkan: "56.00",
    skorAI: 95,
    tarikhSyor: "2025-08-06",
    justifikasiSyor: "Bantuan Asasi untuk Fakir",
    terimaCadangan: false,
  },
  {
    aid: "[B105] BANTUAN KEWANGAN BULANAN (FAKIR)",
    aidProduct: "BANTUAN KEWANGAN BULANAN (FAKIR)",
    productPackage: "KEWANGAN BULANAN (FAKIR) - T2",
    entitlementProduct: "KEWANGAN BULANAN (FAKIR) - T2",
    kadarDicadangkan: "400.00",
    skorAI: 96,
    tarikhSyor: "2025-08-06",
    justifikasiSyor: "Bantuan Asasi untuk Fakir",
    terimaCadangan: false,
  },
]);

const selectAllSyor = ref(false);

// Perubahan Bantuan - mock data
const bantuanPerubahanKadar = ref([
  {
    aid: "[B106] BANTUAN MAKANAN BULANAN (FAKIR)",
    aidProduct: "MAKANAN BULANAN (FAKIR)",
    productPackage: "MAKANAN BULANAN TERAS (FAKIR) - K2",
    entitlementProduct:
      "K2 FAKIR - (10KG BERAS, 2KG TEPUNG, 2KG MINYAK, 2KG GULA, 2 BIHUN, 1 KICAP)",
    terimaCadangan: false,
  },
  {
    aid: "[B105] BANTUAN KEWANGAN BULANAN (FAKIR)",
    aidProduct: "BANTUAN KEWANGAN BULANAN (FAKIR)",
    productPackage: "KEWANGAN BULANAN (FAKIR) - T2",
    entitlementProduct: "KEWANGAN BULANAN (FAKIR) - T2",
    terimaCadangan: false,
  },
  {
    aid: "[B601] BANTUAN PENDIDIKAN (FISABILILLAH)",
    aidProduct: "BANTUAN PENDIDIKAN (FISABILILLAH)",
    productPackage: "(EFT) YURAN PENDIDIKAN (FISABILILLAH)",
    entitlementProduct: "(EFT) YURAN PENDIDIKAN TINGGI (FISABILILLAH)",
    terimaCadangan: false,
  },
  {
    aid: "[B503] BANTUAN MAKANAN BULANAN (FAKIR)",
    aidProduct: "MAKANAN BULANAN (FAKIR)",
    productPackage: "(VCASH) BANTUAN BULANAN (FAKIR)",
    entitlementProduct: "(VCASH) BANTUAN BULANAN KELUARGA (FAKIR)",
    terimaCadangan: false,
  },
  {
    aid: "[B701] BANTUAN BENCANA (MISKIN)",
    aidProduct: "BANTUAN BENCANA (MISKIN)",
    productPackage: "(CASH) BANTUAN SEGERA (MISKIN)",
    entitlementProduct: "(CASH) BENCANA ALAM (MISKIN)",
    terimaCadangan: false,
  },
]);

const bantuanPembatalan = ref([
  {
    aid: "[B601] BANTUAN PENDIDIKAN (FISABILILLAH)",
    aidProduct: "BANTUAN PENDIDIKAN (FISABILILLAH)",
    productPackage: "(EFT) YURAN PENDIDIKAN (FISABILILLAH)",
    entitlementProduct: "(EFT) YURAN PENDIDIKAN TINGGI (FISABILILLAH)",
    batalBantuan: false,
  },
  {
    aid: "[B503] BANTUAN MAKANAN BULANAN (FAKIR)",
    aidProduct: "BANTUAN MAKANAN BULANAN (FAKIR)",
    productPackage: "(VCASH) BANTUAN BULANAN (FAKIR)",
    entitlementProduct: "(VCASH) BANTUAN BULANAN KELUARGA (FAKIR)",
    batalBantuan: false,
  },
  {
    aid: "[B304] BANTUAN KEPERLUAN HIDUP (GHARIMIN)",
    aidProduct: "BANTUAN KEPERLUAN HIDUP (GHARIMIN)",
    productPackage: "(VCASH) BANTUAN BULANAN (GHARIMIN)",
    entitlementProduct: "(VCASH) BAYARAN BULANAN KELUARGA (GHARIMIN)",
    batalBantuan: false,
  },
  {
    aid: "[B701] BANTUAN BENCANA (MISKIN)",
    aidProduct: "BANTUAN BENCANA (MISKIN)",
    productPackage: "(CASH) BANTUAN SEGERA (MISKIN)",
    entitlementProduct: "(CASH) BENCANA ALAM (MISKIN)",
    batalBantuan: false,
  },
  {
    aid: "[B205] BANTUAN PERUBATAN DIALISIS (MISKIN)",
    aidProduct: "BANTUAN PERUBATAN DIALISIS (MISKIN)",
    productPackage: "(GL) BANTUAN BULANAN (MISKIN)",
    entitlementProduct: "(GL) BANTUAN PERUBATAN DIALISIS (MISKIN)",
    batalBantuan: false,
  },
]);

const selectAllPerubahan = ref(false);
const selectAllPembatalan = ref(false);

// Methods
const handleSubmit = (formData) => {
  console.log("Form submitted:", formData);
  // Handle form submission
};

const addNewAssistance = () => {
  console.log("Add new assistance");
  // Handle adding new assistance
};

const editAssistance = (row) => {
  console.log("Edit assistance:", row);
  // Handle editing assistance
};

const saveData = () => {
  console.log("Save data");
  // Handle saving data
};

const saveDraft = () => {
  console.log("Save draft");
  // Handle saving draft
};

const getStatusVariant = (status) => {
  const variants = {
    "dalam siasatan": "warning",
    "selesai siasatan": "success",
    "menunggu siasatan": "info",
  };
  return variants[status.toLowerCase()] || "default";
};

const getScoreVariant = (score) => {
  const value =
    typeof score === "number"
      ? score
      : parseInt(String(score).replace(/[^0-9]/g, ""));
  if (value >= 90) return "success";
  if (value >= 75) return "warning";
  return "danger";
};

const toggleSelectAllSyor = () => {
  recommendedAid.value.forEach((row) => {
    row.terimaCadangan = selectAllSyor.value;
  });
};

const toggleSelectAllPerubahan = () => {
  bantuanPerubahanKadar.value.forEach((row) => {
    row.terimaCadangan = selectAllPerubahan.value;
  });
};

const toggleSelectAllPembatalan = () => {
  bantuanPembatalan.value.forEach((row) => {
    row.batalBantuan = selectAllPembatalan.value;
  });
};

const getAssistanceStatusVariant = (status) => {
  const variants = {
    "dalam semakan": "warning",
    lulus: "success",
    "tidak lulus": "danger",
  };
  return variants[status.toLowerCase()] || "default";
};

// Computed property for form validation
const canSubmitForApproval = computed(() => {
  return (
    investigationData.value.keadaanSiasatan &&
    investigationData.value.tarikhLawatan &&
    investigationData.value.masaLawatan &&
    investigationData.value.statusLawatan
  );
});

// Computed property for profiling form validation
const isProfilingFormValid = computed(() => {
  return (
    profilingData.value.pengenalanId &&
    profilingData.value.nama &&
    profilingData.value.hadKifayahSyor &&
    profilingData.value.assignSiasatan
  );
});

// Computed property to check if investigation data has been submitted from 09
const hasSubmittedData = computed(() => {
  const invStore = useInvestigationStore();
  return invStore.latestSubmission && Object.keys(invStore.latestSubmission).length > 0;
});

// Image handling methods
const triggerFileInput = () => {
  if (fileInputRef.value) {
    fileInputRef.value.click();
  }
};

const handleFileInputChange = (event) => {
  const files = event.target.files;
  if (files && files.length > 0) {
    processFiles(Array.from(files));
  }
  // Reset input value so same file can be selected again
  event.target.value = "";
};

const handleFileDrop = (event) => {
  const files = event.dataTransfer.files;
  if (files && files.length > 0) {
    processFiles(Array.from(files));
  }
};

const processFiles = async (files) => {
  const validFiles = files.filter((file) => {
    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      console.error(`File ${file.name} is too large. Maximum 5MB allowed.`);
      // You could show a toast notification here
      return false;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      console.error(`File ${file.name} is not a valid image format.`);
      // You could show a toast notification here
      return false;
    }

    return true;
  });

  // Process each valid file
  for (const file of validFiles) {
    await processImageFile(file);
  }
};

const processImageFile = async (file) => {
  // Create upload progress entry
  const progressEntry = {
    filename: file.name,
    size: file.size,
    progress: 0,
  };
  uploadProgress.value.push(progressEntry);

  // Create image object with loading state
  const uploadedImage = {
    url: URL.createObjectURL(file),
    filename: file.name,
    caption: "",
    file: file,
    size: file.size,
    loading: true,
  };

  uploadedImages.value.push(uploadedImage);

  // Simulate upload progress
  const progressInterval = setInterval(() => {
    progressEntry.progress += Math.random() * 30;
    if (progressEntry.progress >= 100) {
      progressEntry.progress = 100;
      clearInterval(progressInterval);

      // Remove from progress and update image
      const progressIndex = uploadProgress.value.indexOf(progressEntry);
      if (progressIndex > -1) {
        uploadProgress.value.splice(progressIndex, 1);
      }

      // Mark image as loaded
      uploadedImage.loading = false;
    }
  }, 200);
};

const removeImage = (index) => {
  // Revoke the object URL to free memory
  URL.revokeObjectURL(uploadedImages.value[index].url);
  uploadedImages.value.splice(index, 1);
};

const previewImage = (image) => {
  previewingImage.value = image;
  showPreviewModal.value = true;
};

// Form submission methods
const handleSubmitLawatan = (formData) => {
  console.log("Investigation form submitted:", formData);
  // Handle form submission
};

const handleSimpan = async () => {
  try {
    processing.value = true;
    actionType.value = "save";

    // Implement save functionality
    console.log("Saving investigation data...", investigationData.value);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("Investigation data saved successfully");
  } catch (error) {
    console.error("Error saving investigation data:", error);
  } finally {
    processing.value = false;
    actionType.value = "";
  }
};

const handleHantarKelulusan = async () => {
  try {
    processing.value = true;
    actionType.value = "submit";

    // Validate required fields
    if (!canSubmitForApproval.value) {
      console.error("Please complete all required fields before submitting");
      return;
    }

    // Implement submit for approval functionality
    console.log("Submitting for approval...", investigationData.value);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log("Successfully submitted for approval");

    // Navigate back to list or show success message
    // navigateTo("/BF-BTN/tugasan");
  } catch (error) {
    console.error("Error submitting for approval:", error);
  } finally {
    processing.value = false;
    actionType.value = "";
  }
};

const handleKembali = () => {
  // Navigate back to the task list
  navigateTo("/BF-BTN/tugasan");
};

// Utility function for formatting file sizes
const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// Enhanced modal functions
const downloadImage = (image) => {
  const link = document.createElement("a");
  link.href = image.url;
  link.download = image.filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const saveImageCaption = () => {
  // Caption is already bound to the image object via v-model
  // You could add validation or API call here if needed
  console.log("Caption saved:", previewingImage.value.caption);
  showPreviewModal.value = false;
};

// Profiling form methods
const handleProfilingSubmit = (formData) => {
  console.log("Profiling form submitted:", formData);
  // Handle profiling form submission
};

const searchPengenalanId = async () => {
  if (!profilingData.value.pengenalanId) {
    console.error("Please enter an ID to search");
    return;
  }

  try {
    searchingId.value = true;
    console.log(
      "Searching for Pengenalan ID:",
      profilingData.value.pengenalanId
    );

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock data population (replace with actual API response)
    profilingData.value.nama = "Mohd Ahmad bin Abdullah";
    profilingData.value.hadKifayahSyor = "75.5";
    profilingData.value.kategoriKeluargaAsnafSyor = "Fakir";
    profilingData.value.kategoriAsnafSyor = "Asnaf Produktif";

    console.log("Search completed successfully");
  } catch (error) {
    console.error("Error searching for ID:", error);
  } finally {
    searchingId.value = false;
  }
};

const resetProfilingForm = () => {
  // Reset all form fields to initial state
  Object.keys(profilingData.value).forEach((key) => {
    profilingData.value[key] = "";
  });
  console.log("Profiling form reset");
};

const saveProfilingDraft = async () => {
  try {
    savingDraft.value = true;
    console.log("Saving profiling draft...", profilingData.value);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("Draft saved successfully");
  } catch (error) {
    console.error("Error saving draft:", error);
  } finally {
    savingDraft.value = false;
  }
};

const submitProfiling = async () => {
  if (!isProfilingFormValid.value) {
    console.error("Please complete all required fields");
    return;
  }

  try {
    submittingProfile.value = true;
    console.log("Submitting profiling data...", profilingData.value);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log("Profiling data submitted successfully");
  } catch (error) {
    console.error("Error submitting profiling data:", error);
  } finally {
    submittingProfile.value = false;
  }
};

// Handle Tugasan Siasatan submission and redirect to 07_1
const handleTugasanHantar = () => {
  console.log("Tugasan Siasatan submitted, redirecting to 07_1...");
  navigateTo("/BF-PRF/AS/FR/07_1");
};
</script>

<style lang="scss" scoped>
/* Custom animations for image upload */
.image-upload-enter-active,
.image-upload-leave-active {
  transition: all 0.3s ease;
}

.image-upload-enter-from {
  opacity: 0;
  transform: scale(0.9);
}

.image-upload-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

/* Hover effects for better interactivity */
.group:hover .group-hover\:scale-105 {
  transform: scale(1.05);
}

/* Loading spinner animation */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Smooth transitions for progress bars */
.progress-bar {
  transition: width 0.3s ease-in-out;
}

/* Enhanced focus states for accessibility */
.focus\:ring-2:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}

</style>
<script>
export default {
  data() {
    return {
      formData: {
        hadKifayahSyor: 50, // 👈 default value here
      }
    }
  }
}
</script>