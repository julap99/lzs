<template>
    <div>
      <LayoutsBreadcrumb :items="breadcrumb" />
  
      <div class="grid lg:grid-cols-3 gap-6 mt-4">
        <div class="lg:col-span-2">
      <rs-card>
        <template #header>
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold">Permohonan Bantuan</h2>
          </div>
        </template>
  
        <template #body>
          <FormKit
            type="form"
            @submit="handleSubmit"
            :actions="false"
            v-model="formData"
          >
            <!-- 3.1 Maklumat Pemohon -->
            <div class="mb-8">
              <h3 class="text-lg font-medium mb-4">3.1 Maklumat Pemohon</h3>
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
            </div>

            <!-- 3.2 Maklumat Penerima Manfaat (jika tanggungan) -->
            <div class="mb-8">
              <h3 class="text-lg font-medium mb-4">3.2 Maklumat Penerima Manfaat (jika tanggungan)</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormKit
                  type="select"
                  name="penerimaManfaatNama"
                  label="Nama"
                  :options="dependentsOptions"
                  :value="selectedDependentId"
                  @input="onDependentChange"
                />
                <FormKit
                  type="text"
                  name="penerimaManfaatJenisPengenalan"
                  label="Jenis Pengenalan"
                  :value="selectedDependent?.jenisPengenalan || ''"
                  disabled
                />
                <FormKit
                  type="text"
                  name="penerimaManfaatNoPengenalan"
                  label="No. Pengenalan"
                  :value="selectedDependent?.noPengenalan || ''"
                  disabled
                />
                <FormKit
                  type="text"
                  name="penerimaManfaatHubungan"
                  label="Hubungan"
                  :value="selectedDependent?.hubungan || ''"
                  disabled
                />
              </div>
            </div>
  
            <!-- 3.3 Maklumat Permohonan Bantuan -->
            <div class="mb-8">
              <h3 class="text-lg font-medium mb-4">3.3 Maklumat Permohonan Bantuan</h3>
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
            </div>

            <!-- 3.4 Maklumat Kadar Bantuan -->
            <div class="mb-8">
              <h3 class="text-lg font-medium mb-4">3.4 Maklumat Kadar Bantuan</h3>
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
                  help="Nilai maksimum: RM {{ maxKadarBantuan.toLocaleString() }}"
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
                />

                <FormKit
                  type="date"
                  name="tarikhTamat"
                  label="Tarikh Tamat"
                  :value="computedTarikhTamat"
                  disabled
                  help="Auto diisi berdasarkan tarikh mula dan tempoh"
                />

                <FormKit
                  type="text"
                  name="jumlahKeseluruhan"
                  label="Jumlah Keseluruhan Bantuan Diterima"
                  :value="jumlahKeseluruhanFormatted"
                  disabled
                  help="Kadar x Tempoh/Kekerapan"
                />
              </div>
            </div>

            <!-- 3.4 Maklumat Penerima Bayaran -->
            <div class="mb-8">
              <h3 class="text-lg font-medium mb-4">3.4 Maklumat Penerima Bayaran</h3>
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
                  type="select"
                  name="jenisPengenalanPenerima"
                  label="Jenis Pengenalan"
                  v-model="formData.jenisPengenalanPenerima"
                  :options="idTypeOptions"
                  validation="required"
                  :validation-messages="{ required: 'Sila pilih jenis pengenalan' }"
                />

                <FormKit
                  type="text"
                  name="noPengenalanPenerima"
                  label="No Pengenalan"
                  v-model="formData.noPengenalanPenerima"
                  validation="required"
                  :validation-messages="{ required: 'Sila masukkan no pengenalan' }"
                  @blur="autoRetrieveRecipient"
                />

                <FormKit
                  type="text"
                  name="namaPenerimaBayaran"
                  label="Nama Penerima Bayaran"
                  v-model="formData.namaPenerimaBayaran"
                  validation="required"
                  :validation-messages="{ required: 'Sila masukkan nama penerima bayaran' }"
                />

                <FormKit
                  v-if="isStaff"
                  type="select"
                  name="kaedahPembayaran"
                  label="Kaedah Pembayaran"
                  v-model="formData.kaedahPembayaran"
                  :options="paymentMethodOptions"
                  validation="required"
                  :validation-messages="{ required: 'Sila pilih kaedah pembayaran' }"
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
            </div>

            <!-- 3.5 Dokumen Sokongan -->
            <div class="mb-8">
              <h3 class="text-lg font-medium mb-4">3.5 Dokumen Sokongan</h3>
              <div class="overflow-x-auto">
                <table class="min-w-full text-left text-sm">
                  <thead>
                    <tr class="border-b">
                      <th class="py-2 px-2">No</th>
                      <th class="py-2 px-2">Dokumen</th>
                      <th class="py-2 px-2">Keterangan Dokumen</th>
                      <th class="py-2 px-2">Keperluan Dokumen</th>
                      <th v-if="showReturnFields" class="py-2 px-2">Status</th>
                      <th v-if="showReturnFields" class="py-2 px-2">Catatan</th>
                      <th class="py-2 px-2">Tindakan</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(doc, idx) in documents" :key="doc.id" class="border-b">
                      <td class="py-2 px-2">{{ idx + 1 }}</td>
                      <td class="py-2 px-2">{{ doc.nama }}</td>
                      <td class="py-2 px-2">{{ doc.keterangan }}</td>
                      <td class="py-2 px-2">{{ doc.keperluan }}</td>
                      <td v-if="showReturnFields" class="py-2 px-2">
                        <FormKit type="select" :options="statusDokumenOptions" v-model="doc.status" />
                      </td>
                      <td v-if="showReturnFields" class="py-2 px-2">
                        <FormKit type="text" placeholder="Catatan" v-model="doc.catatan" />
                      </td>
                      <td class="py-2 px-2 space-x-2">
                        <rs-button size="sm" @click="triggerUpload(doc)">Upload</rs-button>
                        <rs-button size="sm" variant="secondary" v-if="doc.canDownload" @click="downloadTemplate(doc)">Download</rs-button>
                        <rs-button size="sm" variant="secondary" @click="previewDoc(doc)" :disabled="!doc.files?.length">Lihat</rs-button>
                        <rs-button size="sm" variant="secondary" v-if="doc.isDigitalForm" @click="editDigitalForm(doc)">Edit</rs-button>
                        <input class="hidden" type="file" :multiple="true" :ref="el => setDocInputRef(el, doc.id)" @change="onDocFilesSelected($event, doc)" />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- 3.6 Maklumat Tindakan (Sidebar-like section) -->
            <rs-card class="shadow-sm border-0 bg-white sticky top-6 mt-4">
              <template #header>
                <div class="flex items-center space-x-3">
                  <div class="flex-shrink-0">
                    <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <Icon name="ph:clipboard-text" class="w-6 h-6 text-red-600" />
                    </div>
                  </div>
                  <div>
                    <h2 class="text-lg font-semibold text-gray-900">3.6 Maklumat Tindakan</h2>
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
  
            <!-- Action Buttons -->
            <div class="flex justify-end space-x-4">
              <rs-button variant="secondary" @click="handleCancel">
                Batal
              </rs-button>
              <rs-button type="submit" variant="primary" @click="handleSubmit">
                Hantar Permohonan
              </rs-button>
            </div>
          </FormKit>
        </template>
      </rs-card>
        </div>

        <div class="lg:col-span-1 space-y-6">
          <!-- 3.6 Maklumat Tindakan (Sidebar) -->
          <rs-card class="shadow-sm border-0 bg-white sticky top-6">
            <template #header>
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <Icon name="ph:clipboard-text" class="w-6 h-6 text-red-600" />
                  </div>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-gray-900">3.6 Maklumat Tindakan</h2>
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
        :show-close="true"
        @close="handleCancel"
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
  import { ref, computed, onMounted } from "vue";
  import { useRouter } from "vue-router";
  import CustomSelect from '~/components/CustomSelect.vue';
  
  definePageMeta({
    title: "Permohonan Bantuan",
    description: "Halaman untuk memohon bantuan",
  });
  
  const router = useRouter();
  const formData = ref({});
  const showSuccessModal = ref(false);
  const showConfirmationModal = ref(false);
  const nomorRujukan = ref("");
  
  // Mock user profile data - replace with actual data from your auth system
  const userProfile = ref({
    nama: "Ahmad bin Abdullah",
    noKadPengenalan: "901231012345",
    statusHousehold: "Miskin",
    statusIndividu: "Asnaf Fakir",
    jenisPengenalan: "No. Kad Pengenalan",
    statusMultidimensi: "B40",
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
      nama: "Ali bin Abu",
      jenisPengenalan: "No. Kad Pengenalan",
      noPengenalan: "050101010101",
      hubungan: "Anak",
    },
    {
      id: "2",
      nama: "Siti binti Ali",
      jenisPengenalan: "No. Kad Pengenalan",
      noPengenalan: "080202020202",
      hubungan: "Anak",
    },
  ]);
  const selectedDependentId = ref("");
  const dependentsOptions = computed(() =>
    dependents.value.map((d) => ({ label: d.nama, value: d.id, disabled: !!d.disabled }))
  );
  const selectedDependent = computed(() =>
    dependents.value.find((d) => d.id === selectedDependentId.value)
  );
  const onDependentChange = (value) => {
    selectedDependentId.value = value;
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
    const base = userProfile.value.statusHousehold === "Miskin" ? 800 : 600;
    const dependentCount = Math.max(0, dependents.value.length - 1); // exclude placeholder
    return base + dependentCount * 50;
  });
  const computedTarikhTamat = computed(() => {
    if (!formData.value.tarikhMula || !formData.value.tempoh) return "";
    const start = new Date(formData.value.tarikhMula);
    const end = new Date(start);
    end.setMonth(end.getMonth() + Number(formData.value.tempoh));
    return end.toISOString().slice(0, 10);
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
        formData.value.bank = "BANK MOCK";
        formData.value.noAkaunBank = "1234567890";
      }
    }
  };

  // 3.5 Dokumen Sokongan (prototype docs config)
  const documents = ref([
    { id: "DOC1", nama: "BORANG PENGESAHAN PENJAGAAN ANAK", keterangan: "Borang digital", keperluan: "Wajib", isDigitalForm: true, canDownload: false, files: [] },
    { id: "DOC2", nama: "BORANG RANCANGAN PERNIAGAAN", keterangan: "Borang digital", keperluan: "Wajib", isDigitalForm: true, canDownload: false, files: [] },
    { id: "DOC3", nama: "BORANG PERMOHONAN PENGANGKUTAN SEKOLAH", keterangan: "Borang digital", keperluan: "Tambahan", isDigitalForm: true, canDownload: false, files: [] },
    { id: "DOC4", nama: "BORANG PENGESAHAN KESIHATAN", keterangan: "Diisi oleh doktor", keperluan: "Tambahan", isDigitalForm: false, canDownload: true, files: [] },
    { id: "DOC5", nama: "Kertas Kerja Pelaksanaan & Cadangan Program", keterangan: "Diisi oleh agensi", keperluan: "Tambahan", isDigitalForm: false, canDownload: true, files: [] },
  ]);
  const statusDokumenOptions = [
    { label: "Lengkap", value: "LENGKAP" },
    { label: "Tidak Lengkap", value: "TIDAK_LENGKAP" },
    { label: "Tiada Keperluan", value: "TIADA_KEPERLUAN" },
  ];
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
    if (!doc.files || doc.files.length === 0) return;
    alert(`Pratonton ${doc.files.length} fail untuk ${doc.nama}`);
  };
  const editDigitalForm = (doc) => {
    alert(`Buka borang digital: ${doc.nama}`);
  };

  // 3.6 Maklumat Tindakan helpers
  const showBorangSiasatanButton = computed(() => {
    const method = (formData.value.kaedahPembayaran || '').toUpperCase();
    return method === 'TUNAI_KAUNTER' || method === 'TUNAI_LAPANGAN';
  });
  const showTindakanDropdown = computed(() => {
    // Show if Aid equals 'Bantuan Perubatan'
    return (formData.value.jenisBantuan || '').toLowerCase().includes('perubatan');
  });
  const tindakanOptions = [
    { label: 'Hantar ke Al-Amal', value: 'AL_AMAL' },
    { label: 'Diproses di NAS', value: 'NAS' },
  ];
  const openBorangSiasatanTunai = () => {
    alert('Buka Borang Siasatan Tunai (Kaunter Ekspres)');
  };
  const onSave = () => {
    alert('Permohonan disimpan (mock)');
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
  const noBantuan = ref(`NB-${Date.now()}`);
  
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

  // Entitlement Product options (prototype: reuse product package options)
  const entitlementProductOptions = computed(() => productPackageOptions.value || []);
  </script>
  
  <style lang="scss" scoped>
  // Add any custom styles here
  </style>
  