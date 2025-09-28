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
          <!-- BA Requirement 3: New field order -->
          <!-- a) Jenis organisasi -->
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

          <!-- b) Nama organisasi -->
          <FormKit
            type="text"
            name="organizationName"
            label="Nama Organisasi"
            validation="required"
            placeholder="Masukkan nama organisasi"
            v-model="formData.organizationName"
          />

          <!-- c) No pendaftaran organisasi -->
          <FormKit
            type="text"
            name="registrationNumber"
            label="Nombor Pendaftaran Organisasi (SSM/ROS)"
            validation="required|matches:/^(\d{12}|PPM-\d{3}-\d{2}-\d{8})$/"
            placeholder="Contoh: 201901000005 (SSM) atau PPM-001-10-14032020 (ROS)"
            help="SSM: 12 digit angka | ROS: PPM-###-##-DDMMYYYY"
            v-model="formData.registrationNumber"
          />

          <!-- e) Kariah - dropdown (conditional) -->
          <CustomSelect
            v-if="showKariahField"
            v-model="formData.kariah"
            :options="kariahOptions"
            label="Kariah"
            placeholder="Cari kariah..."
            search-placeholder="Taip untuk mencari kariah..."
          />

          <!-- f) Jenis masjid - dropdown (conditional for masjid type) -->
          <FormKit
            v-if="formData.organizationType === 'masjid'"
            type="select"
            name="jenisMasjid"
            label="Jenis Masjid"
            validation="required"
            placeholder="Pilih jenis masjid"
            :options="jenisMasjidOptions"
            v-model="formData.jenisMasjid"
          />

          <!-- Structure field (conditional) -->
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

          <!-- Conditional Fields based on Organization Type and Structure -->
          
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


          <!-- Zone - Show when Organization Type is Masjid -->
          <FormKit
            v-if="showZone"
            type="text"
            name="zone"
            label="Kawasan / Zon (jika berkaitan)"
            placeholder="Masukkan kawasan/zon"
            v-model="formData.zone"
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
            <!-- <FormKit
              type="submit"
              label="Seterusnya"
              input-class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md"
            /> -->

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

            <!-- Negeri (Malaysia only) or State/Province (others) -->
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
            <!-- <FormKit
              type="button"
              label="Kembali"
              @click="prevStep"
              input-class="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-6 rounded-md"
            />
            <FormKit
              type="submit"
              label="Seterusnya"
              input-class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md"
            /> -->
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

            <!-- BA Requirement 7: Add jawatan field -->
            <FormKit
              type="text"
              :name="`jawatan${index}`"
              label="Jawatan"
              validation="required"
              placeholder="Masukkan jawatan"
              v-model="representative.jawatan"
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

            <!-- Editable Bank Fields - Show when bankSameAsHQ is 'tidak' or structure is not Cawangan -->
            <div v-if="formData.structure !== 'cawangan' || formData.bankSameAsHQ === 'tidak'">
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
              />

              <FormKit
                type="text"
                name="bankAccountNumber"
                label="Nombor Akaun Bank"
                validation="required"
                placeholder="Masukkan nombor akaun bank"
                v-model="formData.bankAccountNumber"
              />

              <FormKit
                type="text"
                name="penamaBank"
                label="Penama Akaun Bank"
                placeholder="Masukkan penama akaun bank"
                v-model="formData.penamaBank"
              />
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
          <!-- BA Requirement 1: Mandatory documents warning -->
          <div class="bg-red-50 text-red-800 p-4 rounded-md mb-4 border border-red-200">
            <div class="flex items-center mb-2">
              <Icon name="mdi:alert-circle" class="text-red-600 mr-2" size="1.25rem" />
              <p class="font-medium">Dokumen Sokongan Wajib</p>
            </div>
            <p class="text-sm mb-2">Sila muat naik dokumen berikut (semua adalah wajib):</p>
            <ul class="list-disc ml-5 mt-2 text-sm">
              <li>Sijil Pendaftaran SSM / ROS</li>
              <li>Bukti pemilikan akaun bank</li>
            </ul>
            <p class="mt-2 text-sm">Format yang dibenarkan: PDF / JPG / PNG</p>
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

          <FormKit
            type="file"
            name="bankProof"
            label="Bukti Pemilikan Akaun Bank"
            validation="required"
            accept=".pdf,.jpg,.jpeg,.png"
            help="Muat naik bukti pemilikan akaun bank seperti penyata bank"
            v-model="formData.bankProof"
          />

          <FormKit
            type="file"
            name="additionalDocuments"
            label="Dokumen Tambahan (jika ada)"
            accept=".pdf,.jpg,.jpeg,.png"
            multiple="true"
            help="Muat naik dokumen tambahan yang berkaitan"
            v-model="formData.additionalDocuments"
          />

          <div class="flex justify-between mt-6">
            <rs-button variant="primary-outline" @click="prevStep">
              Kembali
            </rs-button>

            <div class="flex gap-3">
              <rs-button type="button" variant="secondary" @click="showDraftModal = true">
                Simpan DRAF
              </rs-button>
              <rs-button type="submit" @click="submitForm">
                Hantar Permohonan
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
          Permohonan Berjaya Dihantar!
        </h2>
        <p class="text-gray-600 mb-4">
          Permohonan anda telah berjaya dihantar. Sila ambil perhatian terhadap
          nombor rujukan anda:
        </p>
        <div class="bg-gray-100 p-4 rounded-md inline-block mx-auto mb-6">
          <span class="font-mono text-lg font-bold">{{ referenceNumber }}</span>
        </div>
        <p class="text-gray-600 mb-6">
          Kami akan memproses permohonan anda dalam masa 5-7 hari bekerja. Anda
          akan menerima notifikasi melalui emel yang didaftarkan.
        </p>
        <div>
          <FormKit
            type="button"
            label="Cetak Bukti Permohonan"
            @click="printApplication"
            input-class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md mr-4"
          />
          <FormKit
            type="button"
            label="Kembali ke Halaman Utama"
            @click="goToHomepage"
            input-class="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-6 rounded-md"
          />
        </div>
      </div>
    </rs-card>

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
            <div v-if="showKariahField">
              <label class="block text-gray-600 font-medium">Kariah</label>
              <p class="text-gray-900">{{ formData.kariah || '-' }}</p>
            </div>
            <div v-if="showZone || showZoneForOthers">
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
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
// Country options (common + Malaysia default)
const countryOptions = [
  'Malaysia', 'Singapore', 'Indonesia', 'Thailand', 'Brunei', 'Philippines',
  'Vietnam', 'Cambodia', 'Laos', 'Myanmar', 'India', 'China', 'Japan', 'South Korea',
  'Australia', 'New Zealand', 'United States', 'United Kingdom', 'Canada', 'Germany',
  'France', 'Netherlands', 'Saudi Arabia', 'United Arab Emirates', 'Qatar'
];

// Malaysia states - LZS system only caters to Selangor
const malaysiaStates = [
  'Selangor'
];

// Selangor districts
const selangorDistricts = [
  'Petaling', 'Klang', 'Hulu Langat', 'Sepang', 'Hulu Selangor', 'Kuala Selangor',
  'Sabak Bernam', 'Gombak', 'Kuala Langat'
];

// Selangor cities
const selangorCities = [
  'Shah Alam','Petaling Jaya','Subang Jaya','Klang','Ampang','Cheras','Kajang','Bangi','Puchong','Selayang','Gombak','Rawang','Sungai Buloh','Batu Caves','Kuala Selangor','Bestari Jaya','Ijok','Tanjong Karang','Sabak Bernam','Sungai Besar','Kuala Kubu Bharu','Batang Kali','Serendah','Hulu Bernam','Semenyih','Beranang','Sepang','Cyberjaya','Dengkil','Banting','Teluk Panglima Garang','Port Klang'
];

const isMalaysia = computed(() => formData.value.country === 'Malaysia');

const breadcrumb = ref([
  {
    name: "Organisasi",
    type: "link",
    path: "/BF-PRF/OR/PP/01",
  },
  {
    name: "Pendaftaran Baru",
    type: "current",
    path: "/BF-PRF/OR/PP/02",
  },
]);

const totalSteps = 5; // Reduced from 6 to 5 (removed Kariah/Zon step)
const currentStep = ref(1);
const referenceNumber = ref(
  "NAS-ORG-" +
    Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, "0")
);

// Modal state
const showDraftModal = ref(false);

// HQ options vary by organization type to reflect realistic parents used elsewhere
const hqOptions = computed(() => {
  const type = formData.value.organizationType;
  if (type === 'masjid') {
    return [
      { label: 'Masjid Sultan Salahuddin Abdul Aziz Shah', value: 'masjid_sultan_salahuddin_hq' },
      { label: 'Masjid Negeri', value: 'masjid_negeri_hq' },
    ];
  }
  if (type === 'surau') {
    return [
      { label: 'Surau Induk Daerah', value: 'surau_induk_daerah' },
    ];
  }
  if (type === 'kesihatan') {
    return [
      { label: 'Pusat Dialisis As-Salam HQ', value: 'pusat_dialisis_as_salam_hq' },
    ];
  }
  if (type === 'ngo') {
    return [
      { label: 'Pertubuhan Kebajikan Islam HQ', value: 'pki_hq' },
      { label: 'Rumah Anak Yatim Darul Ehsan HQ', value: 'rayde_hq' },
    ];
  }
  if (type === 'institusi') {
    return [
      { label: 'Maahad Tahfiz Selangor (Sekolah Utama)', value: 'maahad_tahfiz_selangor_hq' },
    ];
  }
  if (type === 'agensi' || type === 'badan_berkanun' || type === 'dalaman_lzs_baitul') {
    return [
      { label: 'Ibu Pejabat', value: 'ibu_pejabat' },
    ];
  }
  return [
    { label: 'Ibu Pejabat', value: 'ibu_pejabat' },
  ];
});

// LZS Kariah Data - Clean list of all Kariah (no district grouping)
const lzsKariahData = [
  "LZS-KAUNTER BANGI",
  "LZS-KAUNTER KUALA LANGAT",
  "LZS-KAUNTER SABAK BERNAM",
  "LZS-KAUNTER SUBANG JAYA",
  "LZS-KAUNTER PUCHONG",
  "LZS-KAUNTER SELAYANG",
  "LZS-KAUNTER KAJANG",
  "LZS-KAUNTER KOMPLEKS MAIS KLANG",
  "LZS-KAUNTER MASJI NEGERI SHAH ALAM",
  "LZS-KAUNTER SEPANG",
  "MADRASATUL MUHAMMADIAH , PETALING JAYA",
  "MADRASAH ISLAMIAH, KELANA JAYA",
  "MADRASAH PERSAUDARAAN ISLAM, KELANA JAYA",
  "MASJID ABU BAKAR ALI BASHAH , BUKIT BERUNTUNG",
  "MASJID AHMADI RANTAU PANJANG",
  "MASJID AL - AMAN LEMBAH JAYA",
  "MASJID AL - AZIM PANDAN INDAH",
  "MASJID AL - MUTTAQIN DUSUN TUA",
  "MASJID AL - UBUDIAH TASIK TAMBAHAN",
  "MASJID AL AMIN, BT 9 KEBUN BAHARU",
  "MASJID AL MARDHIYAH TAMAN MELAWATI",
  "MASJID AL- MUKMINUN USJ 2",
  "MASJID AL-AMIN TAMAN TENAGA",
  "MASJID AL-AMIRIAH, BLOK J SAWAH SEMPADAN",
  "MASJID AL-ANSAR , TAMAN KERAMAT",
  "MASJID AL-FAIZIN , DESA JAYA",
  "MASJID AL-FALAH , ULU YAM BARU",
  "MASJID AL-FALAH RAWANG",
  "MASJID AL-FALAH, KAMPUNG JENJAROM",
  "MASJID AL-FIRDAUS , BANDAR BARU SELAYANG",
  "MASJID AL-HIDAYAH , TAMAN MELAWATI",
  "MASJID AL-HIDAYAH DESA COALFIELDS",
  "MASJID AL-HUDA KG. PAYA JARAS",
  "MASJID AL-HUDA, PAYA JARAS",
  "MASJID AL-IMAN",
  "MASJID AL-ISLAHIAH, BATU 17 3/4",
  "MASJID AL-ISLAMIAH KG LINDUNGAN",
  "MASJID AL-ITTIFAQIYAH TAMAN SRI GOMBAK",
  "MASJID AL-KHAIRIAH AU3, MEDAN SRI KERAMAT",
  "MASJID AL-KHAIRIYAH , TAMAN SERI GOMBAK",
  "MASJID AL-MAKMUR, KG. GHICHING",
  "MASJID AL-MUHSININ, KG SUNGAI KANDIS",
  "MASJID AL-MUJAHIDEEN, DAMANSARA UTAMA",
  "MASJID AL-MUKARRAMAH, BANDAR SRI DAMANSARA",
  "MASJID AL-MUTTAQIN , SELAYANG PANDANG",
  "MASJID AL-RIDHUAN BATU 7 1/2, HULU KELANG",
  "MASJID AL-SHARIF SIMPANG 3 GOMBAK",
  "MASJID AL-SYAKIRIN , KAMPUNG BATU 5 3/4",
  "MASJID AMINAH AL-MUHAIRI , SEAPARK",
  "MASJID AN-NUR , KAMPUNG MELAYU WIRA DAMAI",
  "MASJID AR RAHMAN PANDAMARAN JAYA",
  "MASJID AR-RAHIMAH , TAMAN GREENWOOD",
  "MASJID AR-RAHMAH , KG SUNGAI BUAYA",
  "MASJID AR-RAHMAH, DAMANSARA BARU",
  "MASJID AS-SAJIDIN, BATANG KALI",
  "MASJID AS-SALAM BUKIT SENTOSA",
  "MASJID AS-SOBIRIN , AU 5 LEMBAH KERAMAT",
  "MASJID AT TAUFIQIAH, KAMPUNG PARIT EMPAT",
  "MASJID AT-TAIYYIBIN, TAMAN BIDARA",
  "MASJID AT-TAQWA , KALUMPANG",
  "MASJID ATAUFIKIAH , KAMPUNG SERI SENTOSA",
  "MASJID BANDAR BARU AMPANG",
  "MASJID BANDAR BARU SG. BULOH",
  "MASJID BANDAR BARU SUNGAI BULOH , SUNGAI BULOH",
  "MASJID BANDAR TASIK PUTERI",
  "MASJID BANDAR UTAMA BATANG KALI",
  "MASJID BUKIT ANTARABANGSA",
  "MASJID BUKIT INDAH , JALAN BUKIT INDAH",
  "MASJID CAHAYA IMAN, BANDAR COUNTRY HOMES",
  "MASJID DARUL EHSAN , TAMAN TUN ABDUL RAZAK",
  "MASJID DARUL ULUM",
  "MASJID EH-SANIAH , SUNGAI KAMPUNG MELAYU BATU 16",
  "MASJID FELDA BUKIT CHERAKAH",
  "MASJID GOMBAK UTARA",
  "MASJID IBNU SINA, HOSPITAL SUNGAI BULUH",
  "MASJID JAMEK AL-AMANIAH, BATU CAVES",
  "MASJID JAMEK AL-HIKMAH BATU 20 , KUANG",
  "MASJID JAMEK BATU 12 PUCHONG",
  "MASJID JAMEK BATU ARANG , KUANG",
  "MASJID JAMEK IPP ( FRIM )",
  "MASJID JAMEK KAMPUNG SUNGAI PLONG, KAMPUNG SUNGAI PLONG",
  "MASJID JAMEK KG NAKHODA , BATU CAVES",
  "MASJID JAMEK KOMPLEKS PERTANIAN SERDANG",
  "MASJID JAMEK PEKAN SUNGAI BULOH, BATU 12 1/2",
  "MASJID JAMEK SULTAN ABDUL AZIZ , JALAN TEMPLER",
  "MASJID JAMEK SULTAN IBRAHIM, PEKAN KUALA SELANGOR",
  "MASJID JAMEK SUNGAI SERAI, SUNGAI SERAI",
  "MASJID JAMI'UL HUDA KG MELAYU AMPANG",
  "MASJID JAMIATUS SOLAHIAH , KAMPUNG SUNGAI TUA BARU",
  "MASJID JAMIUL EHSAN, KAMPUNG KUBU GAJAH",
  "MASJID KAMPUNG GOMBAK , BATU 19",
  "MASJID KAMPUNG SUNGAI CHINCHIN , BATU 7",
  "MASJID KEM PAYA JARAS",
  "MASJID KG. TUNKU",
  "MASJID KLANG GATE BHARU , HULU KLANG",
  "MASJID LAMA BATU 6 GOMBAK",
  "MASJID LAPANGAN TERBANG SULTAN ABDUL AZIZ",
  "MASJID MARZUKIAH, LUBOK PUSING",
  "MASJID NURUL AMIN MERBAU SEMPAK",
  "MASJID NURUL EHSAN TAMAN MEDAN",
  "MASJID NURUL HIDAYAH KAMPUNG PANDAN DALAM",
  "MASJID NURUL HUDA BATU 13 PUCHONG",
  "MASJID NURUL IMAN PEKAN RAWANG",
  "MASJID NURUL ISLAMIAH , SUNGAI CHOH",
  "MASJID NURUL YAQIN , KAMPUNG MELAYU SRI KUNDANG",
  "MASJID PUTRA PERDANA",
  "MASJID SAIDINA ALI, BUKIT SENTOSA",
  "MASJID SAUJANA UTAMA",
  "MASJID SELAYANG BARU",
  "MASJID SERI MELATI",
  "MASJID SULTAN AHMAD SHAH (UIA)",
  "MASJID SULTAN HAJI AHMAD SHAH UIA , GOMBAK",
  "MASJID SULTAN SALAHUDDIN ABDUL AZIZ SHAH, SHAH ALAM",
  "MASJID SUNGAI RAMAL LUAR",
  "MASJID UKAY PERDANA",
  "MASJID ZAKARIA GOMBAK UTARA",
  "PEJABAT AGAMA ISLAM DAERAH GOMBAK",
  "SURAU AN-NUR PENJARA SUNGAI BULOH"
  // Note: This is a sample list. In production, all Kariah from all districts would be included here.
];

// Simple Kariah options - all Kariah in one searchable list
const kariahOptions = computed(() => {
  return lzsKariahData.map(kariah => ({
    label: kariah,
    value: kariah
  }));
});


// BA Requirement 3: Jenis Masjid options (updated per BA requirements)
const jenisMasjidOptions = [
  { label: 'Bandar', value: 'bandar' },
  { label: 'Negeri', value: 'negeri' },
  { label: 'Kariah', value: 'kariah' },
  { label: 'Diraja', value: 'diraja' },
  { label: 'Jamek', value: 'jamek' },
  { label: 'Institusi', value: 'institusi' },
  { label: 'Bandar Diraja', value: 'bandar_diraja' },
];

// BA Requirement 3: Updated computed properties for conditional field visibility
const showKariahField = computed(() => {
  // Show kariah field only for Surau organization type (exclude Masjid)
  return formData.value.organizationType && 
         formData.value.organizationType === 'surau';
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
  return formData.value.structure === 'cawangan' && 
         !['masjid', 'surau'].includes(formData.value.organizationType);
});

const formData = ref({
  // Step 1: Maklumat Pendaftaran Organisasi (BA Requirement 3: New field order)
  organizationType: "", // a) Jenis organisasi
  organizationName: "", // b) Nama organisasi
  registrationNumber: "", // c) No pendaftaran organisasi
  kariah: "", // e) Kariah - dropdown
  jenisMasjid: "", // f) Jenis masjid - dropdown (conditional for masjid)
  structure: "", // Structure field (conditional)
  
  // Conditional fields
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
  state: "Selangor", // Default to Selangor for LZS system

  // Step 3: Maklumat Perhubungan (BA Requirement 7: Add jawatan field)
  representatives: [
    { name: "", ic: "", phoneNumber: "", email: "", jawatan: "" },
  ],

  // Step 4: Maklumat Bank (BA Requirement 8: Maklumat Bank Induk)
  bankName: "",
  bankAccountNumber: "",
  penamaBank: "",
  paymentMethod: "",
  bankSameAsHQ: "", // New field for bank HQ logic

  // Step 5: Muat Naik Dokumen Sokongan (BA Requirement 1: Mandatory documents)
  registrationCertificate: null,
  appointmentLetter: null,
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
  // Prevent navigation to completion screen (step 8)
  if (stepId <= totalSteps) {
    currentStep.value = stepId;
    window.scrollTo(0, 0);
  }
};

const tambahMaklumatWakil = () => {
  formData.value.representatives.push({ name: "", ic: "", phoneNumber: "", email: "", jawatan: "" });
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

const saveDraft = () => {
  // Here you would normally handle the draft saving to API
  console.log("Draft data to be saved:", formData.value);

  // Show toast notification
  // In a real implementation, you would use a toast library like vue-toastification
  alert("Maklumat permohonan telah berjaya disimpan");
  
  // For demo purposes, we'll just log the action
  console.log("Draft saved successfully");
};

const confirmSaveDraft = () => {
  saveDraft();
  showDraftModal.value = false;
};

// BA Requirement 4: Duplicate checking function
const checkDuplicateRegistration = async (registrationNumber) => {
  // Simulate API call to check for duplicates
  const mockExistingRegistrations = [
    '201901000005',
    'PPM-001-10-14032020',
    'PPM-2021-001',
    'PPM-2021-002'
  ];
  
  return mockExistingRegistrations.includes(registrationNumber);
};

const submitForm = async () => {
  // BA Requirement 4: Check for duplicate registration number
  const isDuplicate = await checkDuplicateRegistration(formData.value.registrationNumber);
  
  if (isDuplicate) {
    // Show error message for duplicate registration
    alert('Nombor pendaftaran organisasi telah wujud dalam sistem. Sila gunakan nombor pendaftaran yang berbeza.');
    return;
  }

  // Here you would normally handle the API submission
  console.log("Form data to be submitted:", formData.value);

  // For demo purposes, just go to success screen
  currentStep.value = 6;
  window.scrollTo(0, 0);
};

const printApplication = () => {
  window.print();
};

const goToHomepage = () => {
  router.push("/");
};

// Attachment presence helpers for modal rendering
const hasRegistrationCert = computed(() => {
  const f = formData.value.registrationCertificate;
  return !!(f && ((Array.isArray(f) && f.length > 0) || (!Array.isArray(f) && f.name)));
});
const hasAppointmentLetter = computed(() => {
  const f = formData.value.appointmentLetter;
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

// Watch for changes in organization name to clear kariah selection
watch(
  () => formData.value.organizationName,
  () => {
    formData.value.kariah = "";
  }
);
</script>

<style lang="scss" scoped>
.organization-registration {
  background-color: #f3f4f6;
  min-height: 100vh;
}

@media print {
  .organization-registration {
    background-color: white;
  }
}
</style>
