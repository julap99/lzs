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
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormKit
                  type="text"
                  name="tarikhPermohonan"
                  label="Tarikh Permohonan"
                  :value="formatDateDMY(new Date())"
                  disabled
                />
                <FormKit
                  type="text"
                  name="namaPemohon"
                  label="Nama Pemohon"
                  :value="userProfile.nama"
                  disabled
                />
                <FormKit
                  type="text"
                  name="jenisPengenalan"
                  label="Jenis Pengenalan"
                  :value="userProfile.jenisPengenalan"
                  disabled
                />
                <FormKit
                  type="text"
                  name="noPengenalan"
                  label="No. Pengenalan"
                  :value="userProfile.noKadPengenalan"
                  disabled
                />
                <FormKit
                  type="text"
                  name="statusKeluarga"
                  label="Status Keluarga"
                  :value="userProfile.statusHousehold"
                  disabled
                />
                <FormKit
                  type="text"
                  name="statusIndividu"
                  label="Status Individu"
                  :value="userProfile.statusIndividu"
                  disabled
                />
                <FormKit
                  type="text"
                  name="statusMultidimensi"
                  label="Status Multidimensi"
                  :value="userProfile.statusMultidimensi"
                  disabled
                />
                </div>
              </template>
            </rs-card>

            <!-- 3.2 Maklumat Penerima Manfaat (jika tanggungan) -->
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
  
            <!-- 3.3 Maklumat Permohonan Bantuan -->
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
                  v-if="isStaff"
                  type="select"
                  name="entitlementProduct"
                  label="Entitlement Product (Untuk paparan pegawai sahaja)"
                  :options="entitlementProductOptions"
                  searchable
                  :search-attributes="['label']"
                  :search-filter="(option, search) => option.label.toLowerCase().includes(search.toLowerCase())"
                  :disabled="!formData.productPackage"
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

            <!-- 3.5 Maklumat Penerima Bayaran -->
            <rs-card>
              <template #header>
                <h3 class="text-lg font-medium">Maklumat Penerima Bayaran</h3>
              </template>
              <template #body>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormKit
                  type="select"
                  name="kategoriPenerimaBayaran"
                  label="Kategori Penerima Bayaran"
                  v-model="formData.kategoriPenerimaBayaran"
                  :options="paymentCategoryOptions"
                  validation="required"
                  :validation-messages="{ required: 'Sila pilih kategori penerima bayaran' }"
                />

                <FormKit
                  v-if="showJenisPengenalan"
                  type="select"
                  name="jenisPengenalanPenerima"
                  label="Jenis Pengenalan"
                  v-model="formData.jenisPengenalanPenerima"
                  :options="idTypeOptions"
                  validation="required"
                  :validation-messages="{ required: 'Sila pilih jenis pengenalan' }"
                />

                <FormKit
                  type="select"
                  name="kaedahPembayaran"
                  label="Kaedah Pembayaran"
                  v-model="formData.kaedahPembayaran"
                  :options="paymentMethodOptions"
                  validation="required"
                  :validation-messages="{ required: 'Sila pilih kaedah pembayaran' }"
                />

                <template v-if="showRegistrationDropdown">
                  <FormKit
                    type="select"
                    name="noPendaftaran"
                    label="No Pendaftaran"
                    v-model="selectedRegistration"
                    :options="registrationOptions"
                    validation="required"
                    :validation-messages="{ required: 'Sila pilih no pendaftaran' }"
                    @change="loadRecipientByRegistration"
                  />
                </template>
                <template v-else>
                  <FormKit
                    type="text"
                    name="noPengenalanPenerima"
                    :label="noIdLabel"
                    v-model="formData.noPengenalanPenerima"
                    validation="required"
                    :validation-messages="{ required: 'Sila masukkan maklumat ini' }"
                    @blur="autoRetrieveRecipient"
                  />
                </template>

                <FormKit
                  type="text"
                  name="namaPenerimaBayaran"
                  :label="namaLabel"
                  v-model="formData.namaPenerimaBayaran"
                  validation="required"
                  :validation-messages="{ required: 'Sila masukkan maklumat ini' }"
                />

                <FormKit
                  v-if="showBankFields"
                  type="text"
                  name="namaPemegangAkaun"
                  label="Nama Pemegang Akaun"
                  v-model="formData.namaPemegangAkaun"
                  validation="required"
                  :validation-messages="{ required: 'Sila masukkan nama pemegang akaun' }"
                />

                <FormKit
                  v-if="showBankFields"
                  type="text"
                  name="bank"
                  label="Bank"
                  v-model="formData.bank"
                  validation="required"
                  :validation-messages="{ required: 'Sila masukkan nama bank' }"
                />

                <FormKit
                  v-if="showBankFields"
                  type="text"
                  name="noAkaunBank"
                  label="No. Akaun Bank"
                  v-model="formData.noAkaunBank"
                  validation="required"
                  :validation-messages="{ required: 'Sila masukkan no. akaun bank' }"
                />
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
    penerimaManfaatHubungan: ''
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

  // 3.4 Maklumat Penerima Bayaran helpers
  const paymentCategoryOptions = [
    { label: "-- Pilih --", value: "", disabled: true },
    { label: "Asnaf", value: "ASNAF" },
    { label: "Organisasi", value: "ORGANISASI" },
    { label: "Recipient", value: "RECIPIENT" },
  ];
  const idTypeOptions = [
    { label: "MyKad", value: "MYKAD" },
    { label: "Passport", value: "PASSPORT" },
    { label: "No SSM", value: "SSM" },
    { label: "No ROS", value: "ROS" },
  ];
  const showJenisPengenalan = computed(() => (formData.value.kategoriPenerimaBayaran || '').toUpperCase() !== 'RECIPIENT');
  const noIdLabel = computed(() => {
    const kategori = (formData.value.kategoriPenerimaBayaran || '').toUpperCase();
    if (kategori === 'ORGANISASI') return 'No Pendaftaran';
    if (kategori === 'RECIPIENT') return 'No. Rujukan';
    return 'No Kad Pengenalan';
  });
  const namaLabel = computed(() => {
    const kategori = (formData.value.kategoriPenerimaBayaran || '').toUpperCase();
    if (kategori === 'ORGANISASI') return 'Nama Institusi/Syarikat';
    if (kategori === 'RECIPIENT') return 'Nama Penerima';
    return 'Nama Penerima';
  });

  // Registration dropdown for Organisasi (mirror siasatan behavior)
  const showRegistrationDropdown = computed(() => (formData.value.kategoriPenerimaBayaran || '').toUpperCase() === 'ORGANISASI');
  const registrationOptions = ref([
    { label: '-- Sila Pilih --', value: '' },
    { label: 'ABA1234 - SM Sains Kuala Selangor', value: 'ABA1234' },
    { label: 'WBA5678 - SM Sains Hulu Selangor', value: 'WBA5678' },
    { label: 'CBA9012 - Sekolah Seri Puteri, Cyberjaya', value: 'CBA9012' },
    { label: 'DGA3456 - Kolej Islam Sultan Alam Shah (KISAS)', value: 'DGA3456' },
    { label: 'EHA7890 - SBP Integrasi Gombak', value: 'EHA7890' },
    { label: 'UMA1122 - Universiti Malaya (UM)', value: 'UMA1122' },
    { label: 'UPM3344 - Universiti Putra Malaysia (UPM)', value: 'UPM3344' },
    { label: 'UKM5566 - Universiti Kebangsaan Malaysia (UKM)', value: 'UKM5566' },
    { label: 'UITM7788 - Universiti Teknologi MARA (UiTM)', value: 'UITM7788' },
    { label: 'USM9900 - Universiti Sains Malaysia (USM)', value: 'USM9900' },
  ]);
  const registrationData = {
    'ABA1234': { namaPenerima: 'SM Sains Kuala Selangor', namaPemegangAkaun: 'SM Sains Kuala Selangor', bank: 'Maybank', noAkaunBank: '114422336699' },
    'WBA5678': { namaPenerima: 'SM Sains Hulu Selangor', namaPemegangAkaun: 'SM Sains Hulu Selangor', bank: 'Maybank', noAkaunBank: '223344556677' },
    'CBA9012': { namaPenerima: 'Sekolah Seri Puteri, Cyberjaya', namaPemegangAkaun: 'Sekolah Seri Puteri, Cyberjaya', bank: 'Maybank', noAkaunBank: '334455667788' },
    'DGA3456': { namaPenerima: 'Kolej Islam Sultan Alam Shah (KISAS)', namaPemegangAkaun: 'Kolej Islam Sultan Alam Shah (KISAS)', bank: 'Maybank', noAkaunBank: '445566778899' },
    'EHA7890': { namaPenerima: 'SBP Integrasi Gombak', namaPemegangAkaun: 'SBP Integrasi Gombak', bank: 'Maybank', noAkaunBank: '556677889900' },
    'UMA1122': { namaPenerima: 'Universiti Malaya (UM)', namaPemegangAkaun: 'Universiti Malaya (UM)', bank: 'Maybank', noAkaunBank: '667788990011' },
    'UPM3344': { namaPenerima: 'Universiti Putra Malaysia (UPM)', namaPemegangAkaun: 'Universiti Putra Malaysia (UPM)', bank: 'Maybank', noAkaunBank: '778899001122' },
    'UKM5566': { namaPenerima: 'Universiti Kebangsaan Malaysia (UKM)', namaPemegangAkaun: 'Universiti Kebangsaan Malaysia (UKM)', bank: 'Maybank', noAkaunBank: '889900112233' },
    'UITM7788': { namaPenerima: 'Universiti Teknologi MARA (UiTM)', namaPemegangAkaun: 'Universiti Teknologi MARA (UiTM)', bank: 'Maybank', noAkaunBank: '990011223344' },
    'USM9900': { namaPenerima: 'Universiti Sains Malaysia (USM)', namaPemegangAkaun: 'Universiti Sains Malaysia (USM)', bank: 'Maybank', noAkaunBank: '101112131415' },
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
      console.log('Updated formData:', {
        namaPenerimaBayaran: formData.value.namaPenerimaBayaran,
        namaPemegangAkaun: formData.value.namaPemegangAkaun,
        bank: formData.value.bank,
        noAkaunBank: formData.value.noAkaunBank
      });
    } else {
      console.log('No registration data found for:', reg);
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
    } else if (k === 'ORGANISASI') {
      formData.value.jenisPengenalanPenerima = 'SSM';
      formData.value.noPengenalanPenerima = '';
      formData.value.namaPenerimaBayaran = '';
      formData.value.kaedahPembayaran = 'EFT';
      formData.value.namaPemegangAkaun = '';
      formData.value.bank = '';
      formData.value.noAkaunBank = '';
    } else if (k === 'RECIPIENT') {
      formData.value.jenisPengenalanPenerima = '';
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

  // 3.5 Dokumen Sokongan (prototype docs config)
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


  // Entitlement Product options (prototype: reuse product package options)
  const entitlementProductOptions = computed(() => productPackageOptions.value || []);

  
  </script>
  
  <style lang="scss" scoped>
  // Add any custom styles here
  </style>
  