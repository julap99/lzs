<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="p-6">
      <div class="mb-6">
        <!-- Progress indicator -->
        <div class="mb-6">
          <div class="flex justify-between mb-3">
            <div
              v-for="step in steps"
              :key="step.id"
              class="text-center flex-1 cursor-pointer px-2 py-1 rounded transition-all duration-200"
              :class="{ 
                'font-semibold text-primary': currentStep >= step.id,
                'text-gray-600 hover:text-gray-800': currentStep < step.id
              }"
              @click="goToStep(step.id)"
            >
              <div class="text-xs sm:text-sm">{{ step.label }}</div>
            </div>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2.5">
            <div
              class="bg-primary h-2.5 rounded-full transition-all duration-300"
              :style="`width: ${currentStep >= totalSteps ? 100 : (currentStep / totalSteps) * 100}%`"
            ></div>
          </div>
        </div>
      </div>

      <!-- Step A: Maklumat Pendaftaran Organisasi -->
      <div v-if="currentStep === 1" class="space-y-6">
        <FormKit
          type="form"
          :actions="false"
          @submit="nextStep"
          #default="{ value }"
        >
          <!-- BA Requirement 14: Nama dan nombor pendaftaran tidak dibenarkan tukar jika telah hantar -->
          <FormKit
            type="text"
            name="organizationName"
            label="Nama Organisasi"
            validation="required"
            placeholder="Masukkan nama organisasi"
            v-model="formData.organizationName"
            :disabled="isFieldLocked('organizationName')"
            :help="isFieldLocked('organizationName') ? 'Nama organisasi tidak boleh diubah selepas permohonan dihantar. Hanya staf zakat boleh mengubah.' : ''"
          />

          <FormKit
            type="text"
            name="registrationNumber"
            label="Nombor Pendaftaran Organisasi (SSM/ROS)"
            validation="required|matches:/^(\d{12}|PPM-\d{3}-\d{2}-\d{8})$/"
            placeholder="Contoh: 201901000005 (SSM) atau PPM-001-10-14032020 (ROS)"
            help="SSM: 12 digit angka | ROS: PPM-###-##-DDMMYYYY"
            v-model="formData.registrationNumber"
            :disabled="isFieldLocked('registrationNumber')"
            :help="isFieldLocked('registrationNumber') ? 'Nombor pendaftaran tidak boleh diubah selepas permohonan dihantar. Hanya staf zakat boleh mengubah.' : ''"
          />

          <FormKit
            type="select"
            name="organizationType"
            label="Jenis Organisasi"
            validation="required"
            placeholder="Pilih jenis organisasi"
            :options="[
              { label: 'Agensi', value: 'agensi' },
              { label: 'Masjid', value: 'masjid' },
              { label: 'Surau', value: 'surau' },
              { label: 'Institusi', value: 'institusi' },
              { label: 'Badan Berkanun', value: 'badan_berkanun' },
              { label: 'NGO', value: 'ngo' },
              { label: 'Dalaman LZS – Baitul', value: 'dalaman_lzs_baitul' },
            ]"
            v-model="formData.organizationType"
          />

          <FormKit
            v-if="!['masjid','surau'].includes(formData.organizationType)"
            type="select"
            name="registrationStatus"
            label="Status Pendaftaran"
            validation="required"
            placeholder="Pilih status pendaftaran"
            :options="[
              { label: 'Berdaftar', value: 'berdaftar' },
              { label: 'Tidak berdaftar', value: 'tidak_berdaftar' },
            ]"
            v-model="formData.registrationStatus"
          />

          <FormKit
            v-if="!['masjid','surau'].includes(formData.organizationType)"
            type="select"
            name="structure"
            label="Struktur"
            validation="required"
            placeholder="Pilih struktur"
            :options="[
              { label: 'HQ', value: 'hq' },
              { label: 'Cawangan', value: 'cawangan' },
            ]"
            v-model="formData.structure"
          />

          <!-- HQ Dropdown - Show when Structure is Cawangan and Organization Type is not 'Masjid' or 'Surau' -->
          <FormKit
            v-if="showHQDropdown"
            type="select"
            name="hq"
            label="HQ"
            validation="required"
            placeholder="Pilih HQ"
            :options="hqOptions"
            v-model="formData.hq"
          />

          <!-- Kariah - Show when Organization Type is not 'Masjid' -->
          <FormKit
            v-if="showKariah"
            type="text"
            name="kariah"
            label="Kariah"
            validation="required"
            placeholder="Contoh: MASJID PEKAN BANGI"
            v-model="formData.kariah"
          />

          <!-- Zone - Show when Organization Type is Masjid -->
          <FormKit
            v-if="formData.organizationType === 'masjid'"
            type="text"
            name="zone"
            label="Kawasan / Zon (jika berkaitan)"
            placeholder="Masukkan kawasan/zon"
            v-model="formData.zone"
          />

          <!-- Branch - Show when Structure is Cawangan and Organization Type is NOT Masjid or Surau -->
          <FormKit
            v-if="showBranch"
            type="text"
            name="branch"
            label="Branch / Cawangan"
            placeholder="Masukkan cawangan"
            v-model="formData.branch"
          />

          <!-- Zone for Others - Show when Organization Type is NOT Masjid or Surau -->
          <FormKit
            v-if="showZoneForOthers"
            type="text"
            name="zone"
            label="Kawasan / Zon (jika berkaitan)"
            placeholder="Masukkan kawasan/zon"
            v-model="formData.zone"
          />

          <div class="flex justify-end mt-6">
            <rs-button type="submit" @click="nextStep"> Seterusnya </rs-button>
          </div>
        </FormKit>
      </div>

      <!-- Step B: Maklumat Alamat -->
      <div v-if="currentStep === 2" class="space-y-6">
        <FormKit
          type="form"
          :actions="false"
          @submit="nextStep"
          #default="{ value }"
        >
          <!-- Address Layout: Grid 2 columns as per BA requirements -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Negara (Country) -->
            <FormKit
              type="select"
              name="country"
              label="Negara"
              validation="required"
              placeholder="Pilih negara"
              :options="countryOptions"
              v-model="formData.country"
            />
            <FormKit
              type="text"
              name="addressLine1"
              label="Alamat 1"
              validation="required"
              placeholder="Masukkan alamat 1"
              v-model="formData.addressLine1"
            />

            <!-- Negeri (Malaysia) or State/Province (others) -->
            <FormKit
              v-if="isMalaysia"
              type="select"
              name="state"
              label="Negeri"
              validation="required"
              placeholder="Pilih negeri"
              :options="malaysiaStates"
              v-model="formData.state"
            />
            <FormKit
              v-else
              type="text"
              name="state"
              label="State / Province"
              validation="required"
              placeholder="Masukkan negeri / wilayah"
              v-model="formData.state"
            />

            <FormKit
              type="text"
              name="addressLine2"
              label="Alamat 2"
              placeholder="Masukkan alamat 2"
              v-model="formData.addressLine2"
            />

            <!-- Daerah (Malaysia/Selangor only) else free-text -->
            <FormKit
              v-if="isMalaysia && formData.state === 'Selangor'"
              type="select"
              name="district"
              label="Daerah"
              validation="required"
              placeholder="Pilih daerah"
              :options="selangorDistricts"
              v-model="formData.district"
            />
            <FormKit
              v-else
              type="text"
              name="district"
              label="Daerah / Region"
              validation="required"
              placeholder="Masukkan daerah / region"
              v-model="formData.district"
            />

            <FormKit
              type="text"
              name="addressLine3"
              label="Alamat 3"
              placeholder="Masukkan alamat 3"
              v-model="formData.addressLine3"
            />

            <!-- Bandar (Malaysia/Selangor only) else free-text -->
            <FormKit
              v-if="isMalaysia && formData.state === 'Selangor'"
              type="select"
              name="city"
              label="Pilih Bandar"
              validation="required"
              placeholder="Pilih bandar"
              :options="selangorCities"
              v-model="formData.city"
            />
            <FormKit
              v-else
              type="text"
              name="city"
              label="Bandar / City"
              validation="required"
              placeholder="Masukkan bandar / city"
              v-model="formData.city"
            />

            <!-- Poskod (Malaysia) or Postal Code (others) -->
            <FormKit
              v-if="isMalaysia"
              type="text"
              name="postcode"
              label="Poskod"
              validation="required|number|length:5"
              placeholder="Contoh: 43650"
              v-model="formData.postcode"
            />
            <FormKit
              v-else
              type="text"
              name="postcode"
              label="Postal Code"
              validation="required"
              placeholder="Masukkan postal/zip code"
              v-model="formData.postcode"
            />
          </div>

          <div class="flex justify-between mt-6">
            <rs-button variant="primary-outline" @click="prevStep">
              Kembali
            </rs-button>

            <rs-button type="submit" @click="nextStep"> Seterusnya </rs-button>
          </div>
        </FormKit>
      </div>

      <!-- Step C: Maklumat Perhubungan -->
      <div v-if="currentStep === 3" class="space-y-6">
        <FormKit
          type="form"
          :actions="false"
          @submit="nextStep"
          #default="{ value }"
        >
          <div
            v-for="(representative, index) in formData.representatives"
            :key="index"
            class="border p-4 rounded-md space-y-4 mb-6 bg-gray-50"
          >
            <h3 class="font-semibold text-sm text-gray-700">
              Maklumat Wakil {{ index + 1 }}
            </h3>

            <FormKit
              type="text"
              :name="`representativeName${index}`"
              label="Nama Wakil / Pegawai Utama"
              validation="required"
              placeholder="Masukkan nama wakil"
              v-model="representative.name"
            />

            <FormKit
              type="text"
              :name="`representativeIc${index}`"
              label="ID Pengenalan"
              validation="required|length:12"
              placeholder="Contoh: 880101012222"
              v-model="representative.ic"
            />

            <FormKit
              type="tel"
              :name="`phoneNumber${index}`"
              label="No Telefon (Pejabat / HP)"
              validation="required"
              placeholder="Contoh: 012-3456789"
              v-model="representative.phoneNumber"
            />

            <FormKit
              type="email"
              :name="`email${index}`"
              label="Emel (jika ada)"
              validation="email"
              placeholder="Contoh: nama@domain.com"
              v-model="representative.email"
            />
            <!-- Dokumen Sokongan untuk Setiap Wakil-->
            <FormKit
              type="file"
              :name="`supportingLetter${index}`"
              label="Surat Lantikan / Sokongan"
              validation="required"
              accept=".pdf,.jpg,.jpeg,.png"
              help="Muat naik surat lantikan/sokongan bagi wakil ini"
              v-model="representative.supportingLetter"
            />

            <div class="flex justify-end">
              <rs-button
                v-if="formData.representatives.length > 1"
                variant="danger-outline"
                size="sm"
                @click.prevent="removeRepresentative(index)"
              >
                Buang Maklumat Ini
              </rs-button>
            </div>
          </div>

          <rs-button
            variant="primary-outline"
            size="sm"
            @click.prevent="tambahMaklumatWakil"
          >
            + Tambah Wakil
          </rs-button>

          <div class="flex justify-between mt-6">
            <rs-button variant="primary-outline" @click="prevStep">
              Kembali
            </rs-button>

            <rs-button type="submit" @click="nextStep"> Seterusnya </rs-button>
          </div>
        </FormKit>
      </div>

      <!-- Step D: Maklumat Bank -->
      <div v-if="currentStep === 4" class="space-y-6">
        <FormKit
          type="form"
          :actions="false"
          @submit="nextStep"
          #default="{ value }"
        >
          <div class="border p-4 rounded-md space-y-4 mb-6 bg-gray-50">
            <h3 class="font-semibold text-sm text-gray-700">
              Maklumat Bank
            </h3>

            <!-- Bank HQ Logic - Show when Structure is Cawangan -->
            <div v-if="formData.structure === 'cawangan'" class="mb-4">
              <FormKit
                type="radio"
                name="bankSameAsHQ"
                label="Adakah maklumat Bank sama dengan HQ?"
                validation="required"
                :options="[
                  { label: 'Ya', value: 'ya' },
                  { label: 'Tidak', value: 'tidak' }
                ]"
                v-model="formData.bankSameAsHQ"
              />
            </div>

            <!-- HQ Bank Details (Read-only) - Show when bankSameAsHQ is 'ya' -->
            <div v-if="formData.structure === 'cawangan' && formData.bankSameAsHQ === 'ya'" class="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
              <h4 class="font-medium text-blue-800 mb-2">Maklumat Bank HQ</h4>
              <div class="space-y-2 text-sm">
                <div><strong>Nama Bank:</strong> Maybank</div>
                <div><strong>Nombor Akaun:</strong> 1234567890</div>
                <div><strong>Penama Akaun:</strong> UITM Jengka</div>
              </div>
            </div>

            <!-- BA Requirement 11: Bank updates require manual approval -->
            <div v-if="formData.structure !== 'cawangan' || formData.bankSameAsHQ === 'tidak'">
              <!-- Warning for bank updates -->
              <div v-if="isFieldLocked('bankName')" class="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                <div class="flex items-center">
                  <Icon name="mdi:alert-circle" class="text-yellow-600 mr-2" size="1.25rem" />
                  <div class="text-sm text-yellow-800">
                    <p class="font-medium">Kemaskini Maklumat Bank</p>
                    <p>Kemaskini maklumat bank memerlukan pengesahan manual. Sila hubungi staf zakat untuk bantuan.</p>
                  </div>
                </div>
              </div>

              <FormKit
                type="select"
                name="bankName"
                label="Nama Bank"
                placeholder="Pilih bank"
                validation="required"
                :options="[
                  'Maybank',
                  'CIMB Bank',
                  'Public Bank',
                  'RHB Bank',
                  'Hong Leong Bank',
                  'AmBank',
                  'Bank Islam',
                  'Bank Rakyat',
                  'Bank Muamalat',
                  'OCBC Bank',
                  'HSBC Bank',
                  'Standard Chartered Bank',
                  'Citibank',
                  'UOB Bank'
                ]"
                v-model="formData.bankName"
                :disabled="isFieldLocked('bankName')"
                :help="isFieldLocked('bankName') ? 'Kemaskini maklumat bank memerlukan pengesahan manual' : ''"
              />

              <FormKit
                type="text"
                name="bankAccountNumber"
                label="Nombor Akaun Bank"
                validation="required"
                placeholder="Masukkan nombor akaun bank"
                v-model="formData.bankAccountNumber"
                :disabled="isFieldLocked('bankAccountNumber')"
                :help="isFieldLocked('bankAccountNumber') ? 'Kemaskini maklumat bank memerlukan pengesahan manual' : ''"
              />

              <FormKit
                type="text"
                name="penamaBank"
                label="Penama Akaun Bank"
                placeholder="Masukkan penama akaun bank"
                v-model="formData.penamaBank"
                :disabled="isFieldLocked('penamaBank')"
                :help="isFieldLocked('penamaBank') ? 'Kemaskini maklumat bank memerlukan pengesahan manual' : ''"
              />

              <!-- BA Requirement 13: Single account policy -->
              <div v-if="hasExistingAccount" class="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                <div class="flex items-center">
                  <Icon name="mdi:alert-circle" class="text-red-600 mr-2" size="1.25rem" />
                  <div class="text-sm text-red-800">
                    <p class="font-medium">Polisi Akaun Tunggal</p>
                    <p>Organisasi hanya dibenarkan 1 akaun sahaja pada 1 masa. Sila padam akaun sedia ada sebelum menambah yang baru.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-between mt-6">
            <rs-button variant="primary-outline" @click="prevStep">
              Kembali
            </rs-button>

            <rs-button type="submit" @click="nextStep"> Seterusnya </rs-button>
          </div>
        </FormKit>
      </div>

      <!-- Step E: Muat Naik Dokumen Sokongan -->
      <div v-if="currentStep === 5" class="space-y-6">
        <FormKit
          type="form"
          :actions="false"
          @submit="submitForm"
          #default="{ value }"
        >
          <div class="bg-yellow-50 text-yellow-800 p-4 rounded-md mb-4">
            <p class="font-medium">Sila muat naik dokumen berikut:</p>
            <ul class="list-disc ml-5 mt-2">
              <li>Sijil Pendaftaran SSM / ROS</li>
              <li>Bukti pemilikan akaun bank</li>
            </ul>
            <p class="mt-2">Format yang dibenarkan: PDF / JPG / PNG</p>
          </div>

          <FormKit
            type="file"
            name="registrationCertificate"
            label="Sijil Pendaftaran SSM / ROS"
            validation="required"
            accept=".pdf,.jpg,.jpeg,.png"
            help="Muat naik sijil pendaftaran organisasi anda"
            v-model="formData.registrationCertificate"
          />
          <div class="text-sm mt-1">
            <rs-badge :variant="hasRegistrationCert ? 'success' : 'danger'">{{ hasRegistrationCert ? 'Telah dilampirkan' : 'Tiada lampiran' }}</rs-badge>
          </div>

          

          <FormKit
            type="file"
            name="bankProof"
            label="Bukti Pemilikan Akaun Bank"
            validation="required"
            accept=".pdf,.jpg,.jpeg,.png"
            help="Muat naik bukti pemilikan akaun bank seperti penyata bank"
            v-model="formData.bankProof"
          />
          <div class="text-sm mt-1">
            <rs-badge :variant="hasBankProof ? 'success' : 'danger'">{{ hasBankProof ? 'Telah dilampirkan' : 'Tiada lampiran' }}</rs-badge>
          </div>

          <FormKit
            type="file"
            name="additionalDocuments"
            label="Dokumen Tambahan (jika ada)"
            accept=".pdf,.jpg,.jpeg,.png"
            multiple="true"
            help="Muat naik dokumen tambahan yang berkaitan"
            v-model="formData.additionalDocuments"
          />
          <div class="text-sm mt-1">
            <rs-badge :variant="additionalDocsCount > 0 ? 'success' : 'warning'">{{ additionalDocsCount > 0 ? (additionalDocsCount + ' dokumen') : 'Tiada dokumen tambahan' }}</rs-badge>
          </div>

          <div class="flex justify-between mt-6">
            <rs-button variant="primary-outline" @click="prevStep">
              Kembali
            </rs-button>

            <div class="flex gap-3">
              <rs-button type="button" variant="secondary" @click="showDraftModal = true">
                Simpan DRAF
              </rs-button>
              <rs-button type="button" @click="showSubmissionModal">
                Hantar Kemaskini
              </rs-button>
            </div>
          </div>
        </FormKit>
      </div>

      <!-- Submission Success -->
      <div v-if="currentStep === 6" class="text-center py-8">
        <div class="mb-6">
          <div
            class="mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-8 w-8 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
        <h2 class="text-2xl font-bold text-green-600 mb-2">
          Kemaskini Berjaya Dihantar!
        </h2>
        <p class="text-gray-600 mb-4">
          Kemaskini profil organisasi anda telah berjaya dihantar untuk semakan semula.
        </p>
        <div class="bg-gray-100 p-4 rounded-md inline-block mx-auto mb-6">
          <span class="font-mono text-lg font-bold">{{ referenceNumber }}</span>
        </div>
        <p class="text-gray-600 mb-6">
          Maklumat akan melalui proses pengesahan semula dan anda akan menerima notifikasi melalui emel.
        </p>
        <div class="flex justify-center space-x-4">
          <rs-button
            @click="navigateTo('/BF-PRF/OR/PP')"
            variant="primary-outline"
          >
            Kembali ke Senarai
          </rs-button>
          <rs-button
            @click="navigateTo(`/BF-PRF/OR/PP/view/${$route.params.id}`)"
            variant="primary"
          >
            Lihat Maklumat
          </rs-button>
        </div>
      </div>
    </rs-card>

    <!-- Confirmation Modal -->
    <rs-modal
      v-model="showConfirmationModal"
      title="Sahkan Kemaskini"
      size="md"
      position="center"
    >
      <template #body>
        <div class="space-y-4">
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div class="flex items-center space-x-2">
              <Icon name="ic:baseline-info" class="w-5 h-5 text-blue-600" />
              <span class="font-medium text-blue-800">Pengesahan Kemaskini</span>
            </div>
            <p class="text-sm text-blue-700 mt-2">
              Adakah anda pasti semua maklumat adalah benar dan tepat untuk dihantar semakan kemaskini?
            </p>
            <div class="mt-3 text-sm text-blue-600">
              <p><strong>Nota:</strong> Maklumat yang dihantar akan melalui proses pengesahan semula dan tidak boleh diubah semasa dalam proses semakan.</p>
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end space-x-2">
          <rs-button variant="primary-outline" @click="cancelSubmission">
            Batal
          </rs-button>
          <rs-button 
            variant="primary" 
            @click="confirmSubmission"
          >
            Ya, Hantar Kemaskini
          </rs-button>
        </div>
      </template>
    </rs-modal>

    <!-- Simpan DRAF Confirmation Modal -->
    <rs-modal v-model="showDraftModal" title="Sahkan Simpan DRAF" size="lg">
      <template #body>
        <div class="space-y-4">
          <p class="text-sm text-gray-700">Sila semak ringkasan maklumat sebelum simpan:</p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <label class="block text-gray-600 font-medium">Nama Organisasi</label>
              <p class="text-gray-900">{{ formData.organizationName || '-' }}</p>
            </div>
            <div>
              <label class="block text-gray-600 font-medium">Nombor Pendaftaran</label>
              <p class="text-gray-900">{{ formData.registrationNumber || '-' }}</p>
            </div>
            <div>
              <label class="block text-gray-600 font-medium">Jenis Organisasi</label>
              <p class="text-gray-900">{{ formData.organizationType || '-' }}</p>
            </div>
            <div v-if="!['masjid','surau'].includes(formData.organizationType)">
              <label class="block text-gray-600 font-medium">Struktur</label>
              <p class="text-gray-900">{{ formData.structure || '-' }}</p>
            </div>
            <div v-if="showHQDropdown">
              <label class="block text-gray-600 font-medium">HQ</label>
              <p class="text-gray-900">{{ (hqOptions.find(h=>h.value===formData.hq)?.label) || '-' }}</p>
            </div>
            <div v-if="showKariah">
              <label class="block text-gray-600 font-medium">Kariah</label>
              <p class="text-gray-900">{{ formData.kariah || '-' }}</p>
            </div>
            <div v-if="formData.zone">
              <label class="block text-gray-600 font-medium">Zon</label>
              <p class="text-gray-900">{{ formData.zone || '-' }}</p>
            </div>
            <div class="md:col-span-2"><hr class="my-2" /></div>
            <div>
              <label class="block text-gray-600 font-medium">Alamat 1</label>
              <p class="text-gray-900">{{ formData.addressLine1 || '-' }}</p>
            </div>
            <div>
              <label class="block text-gray-600 font-medium">Alamat 2</label>
              <p class="text-gray-900">{{ formData.addressLine2 || '-' }}</p>
            </div>
            <div>
              <label class="block text-gray-600 font-medium">Alamat 3</label>
              <p class="text-gray-900">{{ formData.addressLine3 || '-' }}</p>
            </div>
            <div>
              <label class="block text-gray-600 font-medium">Poskod</label>
              <p class="text-gray-900">{{ formData.postcode || '-' }}</p>
            </div>
            <div>
              <label class="block text-gray-600 font-medium">Daerah</label>
              <p class="text-gray-900">{{ formData.district || '-' }}</p>
            </div>
            <div>
              <label class="block text-gray-600 font-medium">Bandar</label>
              <p class="text-gray-900">{{ formData.city || '-' }}</p>
            </div>
            <div>
              <label class="block text-gray-600 font-medium">Negeri</label>
              <p class="text-gray-900">{{ formData.state || '-' }}</p>
            </div>
          </div>

          <!-- Step 3: Maklumat Perhubungan -->
          <div class="mt-4">
            <h4 class="font-medium text-gray-900 mb-2">Maklumat Perhubungan</h4>
            <div v-if="formData.representatives && formData.representatives.length" class="space-y-3 text-sm">
              <div v-for="(rep, i) in formData.representatives" :key="i" class="p-3 border rounded bg-gray-50">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label class="block text-gray-600 font-medium">Nama Wakil</label>
                    <p class="text-gray-900">{{ rep.name || '-' }}</p>
                  </div>
                  <div>
                    <label class="block text-gray-600 font-medium">ID Pengenalan</label>
                    <p class="text-gray-900">{{ rep.ic || '-' }}</p>
                  </div>
                  <div>
                    <label class="block text-gray-600 font-medium">No Telefon</label>
                    <p class="text-gray-900">{{ rep.phoneNumber || '-' }}</p>
                  </div>
                  <div>
                    <label class="block text-gray-600 font-medium">Emel</label>
                    <p class="text-gray-900">{{ rep.email || '-' }}</p>
                  </div>
                  <div>
                    <label class="block text-gray-600 font-medium">Surat Lantikan/Sokongan</label>
                    <rs-badge :variant="rep.supportingLetter ? 'success' : 'danger'">{{ rep.supportingLetter ? 'Dilampirkan' : 'Tiada' }}</rs-badge>
                  </div>
                </div>
              </div>
            </div>
            <p v-else class="text-sm text-gray-600">Tiada maklumat wakil diisi.</p>
          </div>

          <!-- Step 4: Maklumat Bank -->
          <div class="mt-4">
            <h4 class="font-medium text-gray-900 mb-2">Maklumat Bank</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div v-if="formData.structure === 'cawangan'">
                <label class="block text-gray-600 font-medium">Sama seperti HQ?</label>
                <p class="text-gray-900">{{ formData.bankSameAsHQ === 'ya' ? 'Ya' : (formData.bankSameAsHQ === 'tidak' ? 'Tidak' : '-') }}</p>
              </div>
              <template v-if="formData.structure !== 'cawangan' || formData.bankSameAsHQ === 'tidak'">
                <div>
                  <label class="block text-gray-600 font-medium">Nama Bank</label>
                  <p class="text-gray-900">{{ formData.bankName || '-' }}</p>
                </div>
                <div>
                  <label class="block text-gray-600 font-medium">Nombor Akaun</label>
                  <p class="text-gray-900">{{ formData.bankAccountNumber || '-' }}</p>
                </div>
                <div>
                  <label class="block text-gray-600 font-medium">Penama Akaun</label>
                  <p class="text-gray-900">{{ formData.penamaBank || '-' }}</p>
                </div>
              </template>
            </div>
          </div>

          <!-- Step 5: Dokumen Sokongan -->
          <div class="mt-4">
            <h4 class="font-medium text-gray-900 mb-2">Dokumen Sokongan</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <label class="block text-gray-600 font-medium">Sijil Pendaftaran SSM / ROS</label>
                <rs-badge :variant="hasRegistrationCert ? 'success' : 'danger'">{{ hasRegistrationCert ? 'Dilampirkan' : 'Tiada' }}</rs-badge>
              </div>
              <div>
                <label class="block text-gray-600 font-medium">Surat Lantikan / Sokongan</label>
                <rs-badge :variant="hasAppointmentLetter ? 'success' : 'danger'">{{ hasAppointmentLetter ? 'Dilampirkan' : 'Tiada' }}</rs-badge>
              </div>
              <div>
                <label class="block text-gray-600 font-medium">Bukti Pemilikan Akaun Bank</label>
                <rs-badge :variant="hasBankProof ? 'success' : 'danger'">{{ hasBankProof ? 'Dilampirkan' : 'Tiada' }}</rs-badge>
              </div>
              <div>
                <label class="block text-gray-600 font-medium">Dokumen Tambahan</label>
                <rs-badge :variant="additionalDocsCount > 0 ? 'success' : 'warning'">{{ additionalDocsCount > 0 ? (additionalDocsCount + ' dokumen') : 'Tiada' }}</rs-badge>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <rs-button variant="secondary-outline" @click="showDraftModal = false">Batal</rs-button>
          <rs-button variant="primary" @click="confirmSaveDraft">Ya, Simpan</rs-button>
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

const breadcrumb = ref([
  {
    name: "Pengesahan",
    type: "link",
    path: "/BF-PRF/OR/PP",
  },
  {
    name: "Senarai Organisasi",
    type: "link",
    path: "/BF-PRF/OR/PP",
  },
  {
    name: "Kemaskini Organisasi",
    type: "current",
    path: `/BF-PRF/OR/PP/kemaskini/${route.params.id}`,
  },
]);

const totalSteps = 5; // Reduced from 6 to 5 (removed Kariah/Zon step)
const currentStep = ref(1);
const referenceNumber = ref(
  "NAS-ORG-UPDATE-" +
    Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, "0")
);

// Country/state datasets
const countryOptions = [
  'Malaysia', 'Singapore', 'Indonesia', 'Thailand', 'Brunei', 'Philippines',
  'Vietnam', 'Cambodia', 'Laos', 'Myanmar', 'India', 'China', 'Japan', 'South Korea',
  'Australia', 'New Zealand', 'United States', 'United Kingdom', 'Canada', 'Germany',
  'France', 'Netherlands', 'Saudi Arabia', 'United Arab Emirates', 'Qatar'
];
const malaysiaStates = [
  'Selangor', 'Johor', 'Kedah', 'Kelantan', 'Melaka', 'Negeri Sembilan', 'Pahang',
  'Perak', 'Perlis', 'Pulau Pinang', 'Sabah', 'Sarawak', 'Terengganu', 'Kuala Lumpur',
  'Labuan', 'Putrajaya'
];
const selangorDistricts = [
  'Petaling', 'Klang', 'Hulu Langat', 'Sepang', 'Hulu Selangor', 'Kuala Selangor',
  'Sabak Bernam', 'Gombak', 'Kuala Langat'
];
const selangorCities = [
  'Shah Alam','Petaling Jaya','Subang Jaya','Klang','Ampang','Cheras','Kajang','Bangi','Puchong','Selayang','Gombak','Rawang','Sungai Buloh','Batu Caves','Kuala Selangor','Bestari Jaya','Ijok','Tanjong Karang','Sabak Bernam','Sungai Besar','Kuala Kubu Bharu','Batang Kali','Serendah','Hulu Bernam','Semenyih','Beranang','Sepang','Cyberjaya','Dengkil','Banting','Teluk Panglima Garang','Port Klang'
];
const isMalaysia = computed(() => formData.value.country === 'Malaysia');

// Computed properties for conditional field visibility
const showKariah = computed(() => {
  return formData.value.organizationType && formData.value.organizationType !== 'masjid';
});

const showZone = computed(() => {
  return formData.value.organizationType === 'masjid';
});

const showBranch = computed(() => {
  return formData.value.structure === 'cawangan' && 
         !['masjid', 'surau'].includes(formData.value.organizationType);
});

const showZoneForOthers = computed(() => {
  return formData.value.organizationType && 
         !['masjid', 'surau'].includes(formData.value.organizationType);
});

const showHQDropdown = computed(() => {
  return formData.value.structure === 'cawangan' && !['masjid','surau'].includes(formData.value.organizationType);
});

// Confirmation modal state
const showConfirmationModal = ref(false);
const showDraftModal = ref(false);

// BA Requirements: Update restrictions and role-based permissions
const currentUserRole = ref('Pemohon'); // Pemohon, Staf Zakat, Eksekutif, etc.
const organizationStatus = ref('Disahkan'); // Status of the organization
const isSubmitted = ref(true); // Whether the organization has been submitted

// BA Requirement 14: Field locking logic
const isFieldLocked = (fieldName) => {
  // Nama dan nombor pendaftaran tidak dibenarkan tukar jika telah hantar
  // Lock for external users (PenggunaLuar), allow Staf Zakat (admin/developer) to edit
  if (['organizationName', 'registrationNumber'].includes(fieldName)) {
    return isSubmitted.value && currentUserRole.value === 'PenggunaLuar';
  }
  
  // Bank updates require manual approval (BA Requirement 11)
  // Lock for external users, allow Staf Zakat to edit
  if (['bankName', 'bankAccountNumber', 'penamaBank'].includes(fieldName)) {
    return organizationStatus.value === 'Disahkan' && currentUserRole.value === 'PenggunaLuar';
  }
  
  return false;
};

// BA Requirement 10: Address can be updated directly
const canUpdateAddress = computed(() => {
  return true; // Address updates are always allowed
});

// BA Requirement 12: Contact changes require supporting letter
const canUpdateContact = computed(() => {
  // Allow Staf Zakat (admin/developer) to update, restrict external users
  return currentUserRole.value === 'Staf Zakat' || !isSubmitted.value;
});

// BA Requirement 13: Only one account allowed at a time
const hasExistingAccount = ref(false);

const formData = ref({
  // Step 1: Maklumat Pendaftaran Organisasi
  organizationName: "",
  registrationNumber: "",
  organizationType: "",
  registrationStatus: "",
  structure: "",
  
  // Conditional fields moved from Step 3 to Step 1
  kariah: "",
  branch: "",
  zone: "",
  hq: "", // New field for HQ selection when structure is Cawangan

  // Step 2: Maklumat Alamat
  country: 'Malaysia',
  addressLine1: "",
  addressLine2: "",
  addressLine3: "",
  postcode: "",
  city: "",
  district: "",
  state: "",

  // Step 3: Maklumat Perhubungan (renumbered from Step 4)
  representatives: [
    { name: "", ic: "", phoneNumber: "", email: "", supportingLetter: null },
  ],

  // Step 4: Maklumat Bank (renumbered from Step 5)
  bankName: "",
  bankAccountNumber: "",
  penamaBank: "",
  bankSameAsHQ: "", // New field for bank HQ logic

  // Step 5: Muat Naik Dokumen Sokongan (renumbered from Step 6)
  registrationCertificate: null,
  bankProof: null,
  additionalDocuments: [],
});

const steps = computed(() => {
  return [
    { id: 1, label: "Maklumat Organisasi" },
    { id: 2, label: "Alamat" },
    { id: 3, label: "Maklumat Perhubungan" },
    { id: 4, label: "Maklumat Bank" },
    { id: 5, label: "Dokumen Sokongan" },
  ];
});

const goToStep = (stepId) => {
  // Prevent navigation to completion screen (step 7)
  if (stepId <= totalSteps) {
    currentStep.value = stepId;
    window.scrollTo(0, 0);
  }
};

const tambahMaklumatWakil = () => {
  formData.value.representatives.push({ name: "", ic: "", phoneNumber: "", email: "" });
};

const removeRepresentative = (index) => {
  formData.value.representatives.splice(index, 1);
};

const nextStep = () => {
  if (currentStep.value < totalSteps) {
    currentStep.value++;
    window.scrollTo(0, 0);
  }
};

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
    window.scrollTo(0, 0);
  }
};

// Confirmation modal functions
const showSubmissionModal = () => {
  showConfirmationModal.value = true;
};

const cancelSubmission = () => {
  showConfirmationModal.value = false;
};

const saveDraft = () => {
  // Here you would normally handle the draft saving to API
  console.log("Draft data to be saved:", formData.value);

  // Show toast notification
  // In a real implementation, you would use a toast library like vue-toastification
  alert("Maklumat Permohonan telah berjaya disimpan");
  
  // For demo purposes, we'll just log the action
  console.log("Draft saved successfully");
};

const confirmSaveDraft = () => {
  saveDraft();
  showDraftModal.value = false;
};

const confirmSubmission = () => {
  showConfirmationModal.value = false;
  submitForm();
};

const submitForm = () => {
  // Here you would normally handle the API submission for updates
  console.log("Updated organisation data to be submitted:", formData.value);

  // For demo purposes, just go to success screen
  currentStep.value = 6;
  window.scrollTo(0, 0);
};

// Load existing organisation data when component mounts
onMounted(async () => {
  // Simulate loading existing organisation data
  // In real implementation, this would fetch data from API based on route.params.id
  await loadExistingData();
});

const loadExistingData = async () => {
  // Simulate API call to load existing organisation data
  setTimeout(() => {
    // Mock existing data based on ID - replace with actual API call
    const mockData = {
      'ORG-202507-0001': {
        organizationName: "Masjid Sultan Salahuddin Abdul Aziz Shah",
        registrationNumber: "PPM-2021-001",
        organizationType: "masjid",
        registrationStatus: "berdaftar",
        structure: "hq",
        country: 'Malaysia',
        addressLine1: "No. 1, Jalan Masjid",
        addressLine2: "Seksyen 14",
        addressLine3: "",
        postcode: "40000",
        city: "Shah Alam",
        district: "Petaling",
        state: "Selangor",
        kariah: "",
        branch: "",
        zone: "Zon A",
        hq: "",
        representatives: [
          { name: "Ustaz Ahmad bin Hassan", ic: "750101014567", phoneNumber: "03-55123456", email: "ahmad.hassan@masjid-selangor.gov.my", supportingLetter: { name: 'surat_lantikan_ahmad.pdf', size: 123456, type: 'application/pdf' } },
          { name: "Siti Zainab binti Omar", ic: "820515023456", phoneNumber: "019-2345678", email: "zainab.omar@masjid-selangor.gov.my", supportingLetter: { name: 'surat_lantikan_zainab.pdf', size: 223344, type: 'application/pdf' } }
        ],
        bankName: "Bank Islam",
        bankAccountNumber: "1234567890123456",
        penamaBank: "Masjid Sultan Salahuddin Abdul Aziz Shah",
        bankSameAsHQ: "",
      },
      'ORG-202506-0002': {
        organizationName: "Masjid Sultan Salahuddin Abdul Aziz Shah",
        registrationNumber: "PPM-2021-002",
        organizationType: "masjid",
        registrationStatus: "berdaftar",
        structure: "hq",
        country: 'Malaysia',
        addressLine1: "No. 88, Jalan Masjid PJ",
        addressLine2: "Taman Masjid Jaya",
        addressLine3: "",
        postcode: "46000",
        city: "Petaling Jaya",
        district: "Petaling",
        state: "Selangor",
        kariah: "",
        branch: "",
        zone: "Zon B",
        hq: "",
        representatives: [
          { name: "Ustaz Ibrahim bin Yusof", ic: "730505045678", phoneNumber: "03-22345678", email: "ibrahim@masjid-pj-selangor.gov.my", supportingLetter: { name: 'surat_lantikan_ibrahim.pdf', size: 198765, type: 'application/pdf' } }
        ],
        bankName: "Maybank",
        bankAccountNumber: "5123456789012",
        penamaBank: "Masjid Sultan Salahuddin Abdul Aziz Shah - Cawangan PJ",
        bankSameAsHQ: "tidak",
      },
      'ORG-202505-0003': {
        organizationName: "Masjid Al-Amin",
        registrationNumber: "PPM-2021-003",
        organizationType: "masjid",
        registrationStatus: "berdaftar",
        structure: "hq",
        country: 'Malaysia',
        addressLine1: "No. 15, Jalan Masjid Klang",
        addressLine2: "Taman Masjid Klang",
        addressLine3: "Seksyen 5",
        postcode: "41000",
        city: "Klang",
        district: "Klang",
        state: "Selangor",
        kariah: "",
        branch: "",
        zone: "Zon C",
        hq: "",
        representatives: [
          { name: "Dr. Ahmad Fauzi bin Abdul Rahman", ic: "650815056789", phoneNumber: "03-33456789", email: "fauzi@masjid-klang-selangor.gov.my", supportingLetter: { name: 'surat_lantikan_fauzi.pdf', size: 156789, type: 'application/pdf' } }
        ],
        bankName: "Bank Islam",
        bankAccountNumber: "2098765432109",
        penamaBank: "Masjid Sultan Salahuddin Abdul Aziz Shah - Cawangan Klang",
        bankSameAsHQ: "tidak",
      },
      'ORG-202507-0004': {
        organizationName: "Masjid Al-Hidayah",
        registrationNumber: "PPM-2021-004",
        organizationType: "masjid",
        registrationStatus: "berdaftar",
        structure: "hq",
        country: 'Malaysia',
        addressLine1: "No. 200, Jalan Masjid Shah Alam",
        addressLine2: "Taman Masjid Shah Alam",
        addressLine3: "Seksyen 3",
        postcode: "40150",
        city: "Shah Alam",
        district: "Petaling",
        state: "Selangor",
        kariah: "",
        branch: "",
        zone: "Zon A",
        hq: "",
        representatives: [
          { name: "Encik Mohd Rashid bin Hassan", ic: "700301067890", phoneNumber: "03-55567890", email: "rashid@masjid-sa-selangor.gov.my", supportingLetter: { name: 'surat_lantikan_rashid.pdf', size: 167890, type: 'application/pdf' } }
        ],
        bankName: "RHB Bank",
        bankAccountNumber: "3456789012345",
        penamaBank: "Masjid Sultan Salahuddin Abdul Aziz Shah - Cawangan Shah Alam",
        bankSameAsHQ: "tidak",
      },
      'ORG-202506-0005': {
        organizationName: "Pertubuhan Kebajikan Islam Selangor",
        registrationNumber: "PPM-2022-001",
        organizationType: "ngo",
        registrationStatus: "berdaftar",
        structure: "hq",
        country: 'Malaysia',
        addressLine1: "No. 77, Jalan Kebajikan 2/4",
        addressLine2: "Pusat Kebajikan Islam",
        addressLine3: "Tingkat 15",
        postcode: "47100",
        city: "Puchong",
        district: "Petaling",
        state: "Selangor",
        kariah: "",
        branch: "Ibu Pejabat",
        zone: "Zon Puchong",
        hq: "",
        representatives: [
          { name: "Azman bin Abdullah", ic: "680220078901", phoneNumber: "03-21234567", email: "azman@pki-selangor.org.my", supportingLetter: { name: 'surat_lantikan_azman.pdf', size: 145678, type: 'application/pdf' } }
        ],
        bankName: "Public Bank",
        bankAccountNumber: "4567890123456",
        penamaBank: "Pertubuhan Kebajikan Islam Selangor",
        bankSameAsHQ: "",
      },
      'ORG-202505-0006': {
        organizationName: "Rumah Anak Yatim Darul Ehsan",
        registrationNumber: "PPM-2022-002",
        organizationType: "ngo",
        registrationStatus: "berdaftar",
        structure: "hq",
        country: 'Malaysia',
        addressLine1: "No. 33, Jalan Anak Yatim 4/2",
        addressLine2: "Taman Anak Yatim Cemerlang",
        addressLine3: "",
        postcode: "47100",
        city: "Puchong",
        district: "Petaling",
        state: "Selangor",
        kariah: "",
        branch: "Ibu Pejabat",
        zone: "Zon Puchong",
        hq: "",
        representatives: [
          { name: "Saudara Fikri bin Omar", ic: "850610089012", phoneNumber: "03-80123456", email: "fikri@ray-selangor.org.my", supportingLetter: { name: 'surat_lantikan_fikri.pdf', size: 134567, type: 'application/pdf' } },
          { name: "Saudari Nurul Ain binti Zaki", ic: "870315091234", phoneNumber: "019-7654321", email: "nurul@ray-selangor.org.my", supportingLetter: { name: 'surat_lantikan_nurul.pdf', size: 178901, type: 'application/pdf' } }
        ],
        bankName: "AmBank",
        bankAccountNumber: "6789012345678",
        penamaBank: "Rumah Anak Yatim Darul Ehsan",
        bankSameAsHQ: "",
      },
      'ORG-202504-0007': {
        organizationName: "Maahad Tahfiz Selangor",
        registrationNumber: "PPM-2023-001",
        organizationType: "institusi",
        registrationStatus: "berdaftar",
        structure: "hq",
        country: 'Malaysia',
        addressLine1: "No. 15, Jalan Tahfiz 5/1",
        addressLine2: "Taman Ilmu Tahfiz",
        addressLine3: "Seksyen 5",
        postcode: "43000",
        city: "Kajang",
        district: "Hulu Langat",
        state: "Selangor",
        kariah: "",
        branch: "Sekolah Utama",
        zone: "Zon Kajang",
        hq: "",
        representatives: [
          { name: "Prof. Dr. Ahmad Fauzi bin Ismail", ic: "601205012345", phoneNumber: "03-33456789", email: "fauzi@maahad-tahfiz-selangor.edu.my", supportingLetter: { name: 'surat_lantikan_fauzi_maahad.pdf', size: 212345, type: 'application/pdf' } }
        ],
        bankName: "HSBC Bank",
        bankAccountNumber: "7890123456789",
        penamaBank: "Maahad Tahfiz Selangor",
        bankSameAsHQ: "",
      },
      'ORG-202508-0008': {
        organizationName: "Pusat Dialisis As-Salam Shah Alam",
        registrationNumber: "PPM-2021-015",
        organizationType: "kesihatan",
        registrationStatus: "berdaftar",
        structure: "cawangan",
        country: 'Malaysia',
        addressLine1: "No. 88, Jalan Kesihatan 2/1",
        addressLine2: "Taman Kesihatan Jaya",
        addressLine3: "Seksyen 2",
        postcode: "40000",
        city: "Shah Alam",
        district: "Petaling",
        state: "Selangor",
        kariah: "",
        branch: "Cawangan Shah Alam",
        zone: "Zon Selangor",
        hq: "pusat_dialisis_as_salam_hq",
        representatives: [
          { name: "Dato Dr. Siti Aisyah binti Hassan", ic: "720315123456", phoneNumber: "03-55123456", email: "aisyah@dialisis-as-salam-selangor.gov.my", supportingLetter: { name: 'surat_lantikan_siti_aisyah.pdf', size: 198765, type: 'application/pdf' } }
        ],
        bankName: "Bank Islam",
        bankAccountNumber: "1234567890123",
        penamaBank: "Pusat Dialisis As-Salam Shah Alam",
        bankSameAsHQ: "tidak",
      },
      'ORG-NEW': {
        organizationName: "",
        registrationNumber: "",
        organizationType: "",
        registrationStatus: "",
        structure: "",
        country: 'Malaysia',
        addressLine1: "",
        addressLine2: "",
        addressLine3: "",
        postcode: "",
        city: "",
        district: "",
        state: "",
        kariah: "",
        branch: "",
        zone: "",
        representatives: [
          { name: "", ic: "", phoneNumber: "", email: "", supportingLetter: null }
        ],
        bankName: "",
        bankAccountNumber: "",
        penamaBank: "",
      }
    };

    // Load data based on route ID
    const id = route.params.id;
    if (mockData[id]) {
      // Attach presentation-only mock attachments so UI shows uploaded state
      const incoming = { ...mockData[id] };
      if (!incoming.registrationCertificate) incoming.registrationCertificate = { name: 'ssm.pdf', size: 123456, type: 'application/pdf' };
      if (!incoming.bankProof) incoming.bankProof = { name: 'penyata_bank.pdf', size: 334455, type: 'application/pdf' };
      if (!incoming.additionalDocuments) incoming.additionalDocuments = [ { name: 'dokumen_tambahan_1.pdf', size: 445566, type: 'application/pdf' } ];
      formData.value = { ...formData.value, ...incoming };
    }
  }, 500);
};

// Computed helpers for attachments (mirror PP/02)
const hasRegistrationCert = computed(() => {
  const f = formData.value.registrationCertificate;
  return !!(f && ((Array.isArray(f) && f.length > 0) || (!Array.isArray(f) && f.name)));
});
const hasBankProof = computed(() => {
  const f = formData.value.bankProof;
  return !!(f && ((Array.isArray(f) && f.length > 0) || (!Array.isArray(f) && f.name)));
});
const additionalDocsCount = computed(() => {
  const f = formData.value.additionalDocuments;
  return Array.isArray(f) ? f.length : (f ? 1 : 0);
});
</script>

<style lang="scss" scoped>
.organization-update {
  background-color: #f3f4f6;
  min-height: 100vh;
}

@media print {
  .organization-update {
    background-color: white;
  }
}
</style> 