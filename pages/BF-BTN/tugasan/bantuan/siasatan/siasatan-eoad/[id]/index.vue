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
                  >Kariah</label
                >
                <p class="text-gray-900">{{ formData.kariah }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1"
                  >Daerah</label
                >
                <p class="text-gray-900">{{ formData.daerah }}</p>
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

    <div class="mt-8 grid grid-cols-1 xl:grid-cols-2 gap-4">
      <div class="col-span-1">
        <rs-card class="">
          <template #header>
            <div class="flex justify-between items-center">
              <h2 class="text-xl font-semibold">Maklumat Bantuan</h2>
            </div>
          </template>

          <template #body>
            <!-- Main Tabs -->
            <rs-tab variant="primary" type="card">
              <rs-tab-item title="Profiling" active>
                <!-- Profiling Tab Content -->

                <FormKit
                  type="form"
                  :actions="false"
                  @submit="handleProfilingSubmit"
                  v-model="profilingData"
                  class="divide-y divide-gray-200"
                >
                  <!-- Section 1: Search & Basic Info -->
                  <div class="p-6 bg-gray-50">
                    <h4
                      class="text-md font-semibold text-gray-900 mb-4 flex items-center"
                    >
                      <Icon
                        name="ph:magnifying-glass"
                        class="w-5 h-5 mr-2 text-blue-600"
                      />
                      Carian Maklumat
                    </h4>
                    <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
                      <!-- Pengenalan ID with Search -->
                      <div class="lg:col-span-2">
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
                      </div>

                      <!-- Nama -->
                      <div class="lg:col-span-2">
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
                      </div>
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
                          :value="50"
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
                    <div class="flex flex-col sm:flex-row gap-4 justify-end">
                      <rs-button
                        variant="secondary"
                        @click="resetProfilingForm"
                        class="flex items-center justify-center px-6 py-2.5"
                      >
                        <Icon name="ph:arrow-clockwise" class="w-4 h-4 mr-2" />
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
              </rs-tab-item>

              <rs-tab-item title="Bantuan">
                <rs-tab variant="secondary" type="border">
                  <rs-tab-item title="Syor" active>
                    <!-- Syor Sub-tab Content -->
                    <!-- <div
                    class="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400 rounded-lg border border-gray-200 bg-white shadow-sm scroll-indicator"
                  > -->
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
                    <!-- </div> -->

                    <div class="flex justify-end">
                      <rs-button variant="primary">Sahkan</rs-button>
                    </div>
                  </rs-tab-item>

                  <rs-tab-item title="Bantuan daripada Agensi">
                    <!-- Bantuan daripada Agensi Sub-tab Content -->

                    <!-- <div
                    class="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400 rounded-lg border border-gray-200 bg-white shadow-sm scroll-indicator"
                  > -->
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
                    <!-- </div> -->
                  </rs-tab-item>

                  <rs-tab-item title="Bantuan Sedia Ada">
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
                      <template v-slot:kadar="{ text }">RM {{ text }}</template>
                      <template v-slot:jumlah="{ text }"
                        >RM {{ text }}</template
                      >
                      <template v-slot:status="{ text }">
                        <rs-badge :variant="getAssistanceStatusVariant(text)">{{
                          text
                        }}</rs-badge>
                      </template>
                    </rs-table>
                  </rs-tab-item>

                  <rs-tab-item title="Perubahan Bantuan">
                    <div class="space-y-8">
                      <!-- Senarai Bantuan yang mengalami Perubahan Kadar -->
                      <div class="space-y-3">
                        <h3 class="text-md font-semibold text-gray-900">
                          Perubahan Status: Miskin > Fakir
                        </h3>
                        <h4 class="text-md font-semibold text-gray-900">
                          Senarai Bantuan yang mengalami Perubahan Kadar
                        </h4>

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

                        <div class="flex justify-end">
                          <rs-button variant="primary">Sahkan</rs-button>
                        </div>
                      </div>
                    </div>

                    <hr class="my-4" />

                    <!-- Senarai Bantuan Sedia Ada yang akan dibatalkan -->
                    <div class="space-y-3">
                      <h4 class="text-md font-semibold text-gray-900">
                        Senarai Bantuan Sedia Ada yang akan dibatalkan
                      </h4>

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
                        <template #header-batalBantuan>
                          <div class="flex items-center gap-2" @click.stop>
                            <FormKit
                              type="checkbox"
                              v-model="selectAllPembatalan"
                              @change="toggleSelectAllPembatalan"
                              outer-class="mb-0"
                            />
                            <span class="text-sm">Pilih Semua</span>
                          </div>
                        </template>
                        <template v-slot:batalBantuan="{ value }">
                          <FormKit
                            type="checkbox"
                            v-model="value.batalBantuan"
                            outer-class="mb-0"
                          />
                        </template>
                      </rs-table>

                      <div class="flex justify-end">
                        <rs-button variant="primary">Sahkan</rs-button>
                      </div>
                    </div>
                  </rs-tab-item>

                  <rs-tab-item title="Bantuan Baru">
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
                        <rs-badge :variant="getAssistanceStatusVariant(text)">{{
                          text
                        }}</rs-badge>
                      </template>

                      <template v-slot:actions="{ value }">
                        <rs-button
                          variant="primary"
                          @click="editAssistance(value)"
                        >
                          Edit
                        </rs-button>
                      </template>
                    </rs-table>
                  </rs-tab-item>
                </rs-tab>
              </rs-tab-item>
            </rs-tab>
          </template>
        </rs-card>
      </div>

      <div class="col-span-1">
        <rs-card class="">
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
              <div class="space-y-8">
                <!-- Ringkasan Profil -->
                <div class="bg-gray-50 p-4 rounded-lg">
                  <h3 class="text-sm font-medium text-gray-700 mb-3">
                    Ringkasan Profil
                  </h3>
                  <ul class="text-sm space-y-1 text-gray-600">
                    <li>
                      • Jenis Pekerjaan:
                      {{
                        investigationData.jenisPekerjaan ||
                        "Bekerja sebagai tukang sapu di sekolah"
                      }}
                    </li>
                    <li>
                      • Status Kediaman:
                      {{ investigationData.statusKediaman || "Rumah Sewa" }}
                    </li>
                    <li>
                      • Jumlah bayaran rumah:
                      {{ investigationData.jumlahBayaranRumah || "RM500" }}
                    </li>
                    <li>
                      • Bil Tanggungan:
                      {{ investigationData.bilTanggungan || "2 Orang (Anak)" }}
                    </li>
                    <li>
                      • Status Tanggungan:
                      {{
                        investigationData.statusTanggungan ||
                        "Masih Bersekolah, Tidak Bekerja"
                      }}
                    </li>
                  </ul>
                  
                </div>

                <!-- Keadaan Siasatan -->
                <div>
                  <FormKit
                    type="select"
                    name="keadaanSiasatan"
                    label="Kaedah Siasatan"
                    :options="keadaanSiasatanOptions"
                    placeholder="--Sila Pilih--"
                    validation="required"
                    :validation-messages="{
                      required: 'Sila pilih kaedah siasatan untuk meneruskan',
                    }"
                  />
                </div>

                <div v-if="showLawatanFields" class="flex gap-4">
                  <!-- Tarikh Lawatan -->
                  <div class="flex-1">
                    <FormKit
                      type="date"
                      name="tarikhLawatan"
                      label="Tarikh Lawatan"
                      :validation="showLawatanFields ? 'required' : ''"
                      :validation-messages="{
                        required: 'Sila pilih tarikh lawatan',
                      }"
                      placeholder="dd/mm/yyyy"
                    />
                  </div>

                  <!-- Masa Lawatan -->
                  <div class="flex-1">
                    <FormKit
                      type="time"
                      name="masaLawatan"
                      label="Masa Lawatan"
                      :validation="showLawatanFields ? 'required' : ''"
                      :validation-messages="{
                        required: 'Sila pilih masa lawatan',
                      }"
                      placeholder="--:--:--"
                    />
                  </div>

                  
                </div>

                <div v-if="showLawatanFields">
                  <FormKit
                    type="select"
                    name="StatusPengesahanLawatan"
                    label="Status Pengesahan Lawatan"
                    :options="statuspengesahanlawatanOptions"
                    :validation="showLawatanFields ? 'required' : ''"
                    :validation-messages="{
                      required: 'Sila pilih status pengesahan lawatan',
                    }"
                  />
                </div>


                <!-- Catatan Penilaian Awal -->
                <!-- <div>
                  <FormKit
                    type="textarea"
                    name="catatanPenilaianAwal"
                    label="Catatan Penilaian Awal"
                    rows="4"
                    placeholder="Enter text..."
                    :classes="{
                      input: '!py-2',
                    }"
                  />
                </div> -->

                <!-- Gambar Lokasi/Bukti Visual - Only show when kaedah siasatan is "Lapangan" -->
                <div v-if="showLawatanFields">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Gambar Lokasi/Bukti Visual
                  </label>

                  <!-- Custom File Upload Area -->
                  <div class="space-y-4">
                    <!-- Upload Dropzone -->
                    <div
                      @click="triggerFileInput"
                      @dragover.prevent
                      @dragenter.prevent
                      @drop.prevent="handleFileDrop"
                      class="border-2 border-dashed border-blue-300 rounded-xl p-8 text-center hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 cursor-pointer bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 group"
                    >
                      <div class="space-y-2">
                        <Icon
                          name="ph:upload"
                          class="w-12 h-12 text-blue-400 group-hover:text-blue-500 transition-colors duration-300 group-hover:scale-110 transform mx-auto"
                        />
                        <div>
                          <p class="text-sm text-gray-600">
                            <span
                              class="font-medium text-blue-600 hover:text-blue-500"
                              >Klik untuk pilih fail</span
                            >
                            atau seret dan lepas di sini
                          </p>
                          <p class="text-xs text-gray-500 mt-1">
                            PNG, JPG, GIF sehingga 5MB setiap fail
                          </p>
                        </div>
                      </div>
                    </div>

                    <!-- Hidden File Input -->
                    <input
                      ref="fileInputRef"
                      type="file"
                      accept="image/*"
                      multiple
                      @change="handleFileInputChange"
                      class="hidden"
                    />

                    <!-- Upload Progress -->
                    <div v-if="uploadProgress.length > 0" class="space-y-2">
                      <div
                        v-for="(progress, index) in uploadProgress"
                        :key="index"
                        class="bg-white rounded-lg border border-gray-200 p-3"
                      >
                        <div class="flex items-center justify-between mb-2">
                          <span class="text-sm font-medium text-gray-700">{{
                            progress.filename
                          }}</span>
                          <span class="text-xs text-gray-500">{{
                            formatFileSize(progress.size)
                          }}</span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2">
                          <div
                            class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            :style="{ width: `${progress.progress}%` }"
                          ></div>
                        </div>
                      </div>
                    </div>

                    <!-- Image Preview Gallery -->
                    <div
                      v-if="uploadedImages.length > 0"
                      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
                    >
                      <div
                        v-for="(image, index) in uploadedImages"
                        :key="index"
                        class="group relative bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm scroll-indicator hover:shadow-md transition-shadow"
                      >
                        <!-- Image Preview -->
                        <div class="aspect-square bg-gray-100 relative">
                          <img
                            :src="image.url"
                            :alt="`Gambar ${index + 1}`"
                            class="w-full h-full object-cover cursor-pointer"
                            @click="previewImage(image)"
                          />

                          <!-- Overlay Actions -->
                          <div
                            class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center"
                          >
                            <div
                              class="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2"
                            >
                              <button
                                @click.stop="previewImage(image)"
                                class="bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-700 p-2 rounded-full shadow-md transition-all"
                                type="button"
                                title="Preview"
                              >
                                <Icon name="ph:eye" class="w-4 h-4" />
                              </button>
                              <button
                                @click.stop="removeImage(index)"
                                class="bg-red-500 bg-opacity-90 hover:bg-opacity-100 text-white p-2 rounded-full shadow-md transition-all"
                                type="button"
                                title="Padam"
                              >
                                <Icon name="ph:trash" class="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <!-- Loading Indicator -->
                          <div
                            v-if="image.loading"
                            class="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center"
                          >
                            <Icon
                              name="ph:spinner"
                              class="w-6 h-6 text-blue-600 animate-spin"
                            />
                          </div>
                        </div>

                        <!-- Image Info -->
                        <div class="p-3 space-y-2">
                          <!-- File Name -->
                          <div class="flex items-center justify-between">
                            <span
                              class="text-xs text-gray-500 truncate flex-1"
                              :title="image.filename"
                            >
                              {{ image.filename }}
                            </span>
                            <span class="text-xs text-gray-400 ml-2">
                              {{ formatFileSize(image.size) }}
                            </span>
                          </div>

                          <!-- Image Caption -->
                          <FormKit
                            type="text"
                            :name="`imageCaption_${index}`"
                            v-model="image.caption"
                            placeholder="Tambah keterangan..."
                            :classes="{
                              outer: 'mb-0',
                              input: 'text-xs !py-1.5 !text-gray-700',
                            }"
                          />
                        </div>
                      </div>
                    </div>

                    <!-- Sample Image Placeholder -->
                    <div
                      v-if="uploadedImages.length === 0"
                      class="mt-6 border border-gray-300 rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-slate-100 shadow-sm scroll-indicator"
                    >
                      <div
                        class="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center"
                      >
                        <div class="text-center">
                          <Icon
                            name="ph:image"
                            class="w-12 h-12 text-gray-400 mx-auto mb-2"
                          />
                          <p class="text-sm text-gray-500">
                            Tiada gambar dimuat naik lagi
                          </p>
                          <p class="text-xs text-gray-400 mt-1">
                            Gambar anda akan dipaparkan di sini
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Catatan Lawatan ETD -->
                <div>
                  <FormKit
                    type="textarea"
                    name="catatanLawatanETD"
                    label="Catatan Siasatan"
                    rows="4"
                    placeholder="Enter text..."
                    :classes="{
                      input: '!py-2',
                    }"
                  />
                </div>

                <!-- <div>
                  <FormKit
                    type="select"
                    name="statusSiasatan"
                    label="Status Siasatan"
                    :options="statusSiasatanOptions"
                    placeholder="--Sila Pilih--"
                    validation="required"
                    :validation-messages="{
                      required: 'Sila pilih status siasatan untuk meneruskan',
                    }"
                  />
                </div> -->

                <!-- Status Lawatan -->
                <!-- <div>
                  <FormKit
                    type="select"
                    name="statusLawatan"
                    label="Status Lawatan"
                    :options="statusLawatanOptions"
                    placeholder="--Sila Pilih--"
                    validation="required"
                    :validation-messages="{
                      required: 'Sila pilih status lawatan',
                    }"
                  />
                </div> -->

                <!-- Action Buttons -->
                <div
                  class="flex flex-col sm:flex-row gap-4 pt-8 border-t border-gray-200"
                >
                  <rs-button
                    variant="success"
                    @click="handleSimpan"
                    :disabled="processing"
                    :loading="processing && actionType === 'save'"
                    class="flex-1 !py-3 text-sm font-medium"
                  >
                    <Icon name="ph:floppy-disk" class="w-5 h-5 mr-2" />
                    Simpan
                  </rs-button>

                  <rs-button
                    variant="primary"
                    @click="handleHantarKelulusan"
                    :disabled="processing || !canSubmitForApproval"
                    :loading="processing && actionType === 'submit'"
                    class="flex-1 !py-3 text-sm font-medium"
                  >
                    <Icon name="ph:paper-plane-tilt" class="w-5 h-5 mr-2" />
                    Hantar Kelulusan
                  </rs-button>

                  <rs-button
                    variant="danger"
                    @click="handleKembali"
                    class="flex-1 !py-3 text-sm font-medium"
                  >
                    <Icon name="ph:arrow-left" class="w-5 h-5 mr-2" />
                    Kembali
                  </rs-button>
                </div>
              </div>
            </FormKit>
          </template>
        </rs-card>
      </div>
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
          <div
            class="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 space-y-4"
          >
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
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

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
    name: "Siasatan EOAD",
    type: "current",
    path: `/BF-BTN/tugasan/bantuan/siasatan/siasatan-eoad/${route.params.id}`,
  },
]);

// Mock data for different records
const mockByNoBantuan = {
  "NAS-2025-0001": {
    // Personal Information
    noBantuan: "NAS-2025-0001",
    nama: "Mohd Rosli bin Saad",
    alamat: "Jalan Rajawali, Kampung Bukit Kuching, 45800 Jeram",
    kariah: "Masjid Al-Taqwa",
    daerah: "Kuala Selangor",
    jenisPengenalan: "MyKad",
    noPengenalan: "810101121234",
    noTelefon: "0123456789",
    email: "rosli@gmail.com",
    statusKeluarga: "Fakir",
    statusIndividu: "Fakir",
    statusMultidimensi: "Asnaf Tidak Produktif",
    status: "Dalam Siasatan",

    // Investigation fields
    keputusanSiasatan: "",
    tarikhLawatan: "",
    masaLawatan: "",
    catatanPenilaianAwal: "Pemohon telah menceritakan masalah mengenai keadaan rumahnya yang semakin uzur akibat dimakan anai-anai dan keadaan bumbung yang bocor. Dipanjangkan kepada pegawai untuk siasat dan mempertimbangkan permohonan ini",
    gambarLokasi: null,
  },
  "NAS-2025-0002": {
    // Personal Information
    noBantuan: "NAS-2025-0002",
    nama: "Siti binti Hassan",
    alamat: "Jalan Merdeka, Taman Seri Indah, 45600 Selangor",
    kariah: "Masjid Al-Ikhlas",
    daerah: "Selangor",
    jenisPengenalan: "MyKad",
    noPengenalan: "850505055678",
    noTelefon: "0198765432",
    email: "siti.hassan@gmail.com",
    statusKeluarga: "Miskin",
    statusIndividu: "Miskin",
    statusMultidimensi: "Asnaf Produktif",
    status: "Dalam Siasatan",

    // Investigation fields
    keputusanSiasatan: "",
    tarikhLawatan: "",
    masaLawatan: "",
    catatanPenilaianAwal: "Pemohon memerlukan bantuan untuk kos perubatan anak yang menghidap penyakit kronik. Keadaan kewangan keluarga sangat teruk dan memerlukan bantuan segera.",
    gambarLokasi: null,
  }
};

// Mock investigation data
const mockInvestigationData = {
  "NAS-2025-0001": {
    jenisPekerjaan: "Bekerja sebagai tukang sapu di sekolah",
    statusKediaman: "Rumah Sewa",
    jumlahBayaranRumah: "RM500",
    bilTanggungan: "2 Orang (Anak)",
    statusTanggungan: "Masih Bersekolah, Tidak Bekerja",
    keadaanSiasatan: "",
    tarikhLawatan: "",
    masaLawatan: "",
    StatusPengesahanLawatan: "belum_sah",
    catatanPenilaianAwal: "Pemohon telah menceritakan masalah mengenai keadaan rumahnya yang semakin uzur akibat dimakan anai-anai dan keadaan bumbung yang bocor. Dipanjangkan kepada pegawai untuk siasat dan mempertimbangkan permohonan ini",
    gambarLokasi: [],
    catatanLawatanETD: "",
    statusLawatan: "",
  },
  "NAS-2025-0002": {
    jenisPekerjaan: "Suri rumah sepenuh masa",
    statusKediaman: "Rumah Sendiri",
    jumlahBayaranRumah: "RM0",
    bilTanggungan: "3 Orang (2 Anak + Suami)",
    statusTanggungan: "Anak sakit kronik, Suami tidak bekerja",
    keadaanSiasatan: "",
    tarikhLawatan: "",
    masaLawatan: "",
    StatusPengesahanLawatan: "belum_sah",
    catatanPenilaianAwal: "Pemohon memerlukan bantuan untuk kos perubatan anak yang menghidap penyakit kronik. Keadaan kewangan keluarga sangat teruk dan memerlukan bantuan segera.",
    gambarLokasi: [],
    catatanLawatanETD: "",
    statusLawatan: "",
  }
};

// Form data
const formData = ref({
  // Personal Information
  noBantuan: "",
  nama: "",
  alamat: "",
  kariah: "",
  daerah: "",
  jenisPengenalan: "",
  noPengenalan: "",
  noTelefon: "",
  email: "",
  statusKeluarga: "",
  statusIndividu: "",
  statusMultidimensi: "",
  status: "",

  // Investigation fields
  keputusanSiasatan: "",
  tarikhLawatan: "",
  masaLawatan: "",
  catatanPenilaianAwal: "",
  gambarLokasi: null,
});

// Investigation form data
const investigationData = ref({
  jenisPekerjaan: "",
  statusKediaman: "",
  jumlahBayaranRumah: "",
  bilTanggungan: "",
  statusTanggungan: "",
  keadaanSiasatan: "",
  tarikhLawatan: "",
  masaLawatan: "",
  StatusPengesahanLawatan: "belum_sah",
  catatanPenilaianAwal: "",
  gambarLokasi: [],
  catatanLawatanETD: "",
  statusLawatan: "",
});

// Profiling form data
const profilingData = ref({
  pengenalanId: "",
  nama: "",
  hadKifayahSyor: "",
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

// Pagination state
const currentPage = ref(1);
const pageSize = ref(10);

// Dropdown options
const keadaanSiasatanOptions = [
  { label: "Semak Dokumen Sahaja", value: "semak" },
  { label: "Telefon", value: "telefon" },
  { label: "Lapangan", value: "lapangan" },
];

const statusSiasatanOptions = [
  { label: "Selesai Siasatan", value: "selesai" },
  { label: "KIV", value: "kiv" },
];

// Dropdown options
const statuspengesahanlawatanOptions = [
  { label: "Belum Sah", value: "belum_sah" },
  { label: "Sah", value: "sah" },
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

// Computed property to show/hide lawatan fields based on kaedah siasatan
const showLawatanFields = computed(() => {
  return investigationData.value.keadaanSiasatan === "lapangan";
});

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
    jenisBantuan: "B102 - Bantuan Binaan Rumah (Fakir)",
    status: "Perlu Diproses",
    sla: "3 hari lagi",
    actions: "/",
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
  router.push(`/BF-BTN/tugasan/bantuan/siasatan/${row.noBantuan}`);
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
    "perlu diproses": "warning",
    lulus: "success",
    "tidak lulus": "danger",
  };
  return variants[status.toLowerCase()] || "default";
};

// Computed property for form validation
const canSubmitForApproval = computed(() => {
  const baseValidation = investigationData.value.keadaanSiasatan;
  
  if (investigationData.value.keadaanSiasatan === "lapangan") {
    return (
      baseValidation &&
      investigationData.value.tarikhLawatan &&
      investigationData.value.masaLawatan &&
      investigationData.value.StatusPengesahanLawatan
    );
  }
  
  return baseValidation;
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

// Load data based on route parameter
onMounted(() => {
  const noBantuan = route.params.id || "NAS-2025-0001"; // Default to first record
  const record = mockByNoBantuan[noBantuan];
  const investigationRecord = mockInvestigationData[noBantuan];
  
  if (record) {
    Object.assign(formData.value, record);
  }
  
  if (investigationRecord) {
    Object.assign(investigationData.value, investigationRecord);
  }
});
</script>

<style lang="scss" scoped>
/* Table responsive enhancements */
.scrollbar-thin {
  scrollbar-width: thin;
  -webkit-overflow-scrolling: touch;
}

.scrollbar-thin::-webkit-scrollbar {
  height: 8px;
  width: 8px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background-color: #f3f4f6;
  border-radius: 9999px;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: #d1d5db;
  border-radius: 9999px;
  transition: background-color 0.2s;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background-color: #9ca3af;
}

/* Enhanced table container */
.table-container {
  position: relative;
}

.table-container::after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 20px;
  background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.8));
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s;
}

.table-container:hover::after {
  opacity: 1;
}

/* Table minimum width for horizontal scrolling */
.table-responsive {
  min-width: 800px;
}

/* Mobile touch scrolling */
@media (max-width: 768px) {
  .scrollbar-thin {
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }

  .scrollbar-thin::-webkit-scrollbar {
    display: none;
  }
}

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
