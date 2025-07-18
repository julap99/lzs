<template>
    <div>
      <LayoutsBreadcrumb :items="breadcrumb" />
  
      <rs-card class="mt-4">
        <template #header>
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold">Isi Borang Permohonan Online</h2>
            <rs-button 
              variant="secondary" 
              @click="showImportModal = true"
            >
              <Icon name="mdi:import" class="mr-1" size="1rem" />
              Import
            </rs-button>
          </div>
        </template>
  
        <!-- Import Modal -->
        <rs-modal
          v-model="showImportModal"
          title="Import Data"
          size="md"
        >
          <template #body>
            <div class="p-4">
              <FormKit
                type="form"
                :actions="false"
                @submit="handleImport"
              >
                <FormKit
                  type="file"
                  name="importFile"
                  label="Upload File"
                  accept=".xlsx,.xls,.csv"
                  validation="required"
                  :validation-messages="{
                    required: 'Please upload a file',
                  }"
                  v-model="importFile"
                />
              </FormKit>
            </div>
          </template>
          <template #footer>
            <div class="flex justify-end gap-2">
              <!-- <rs-button -->
                <!-- variant="secondary"
                @click="showImportModal = false"
              >
                Tidak -->
              <!-- </rs-button> -->
              <rs-button
                variant="primary"
                @click="handleImport"
              >
                Import
              </rs-button>
            </div>
          </template>
        </rs-modal>
  
        <template #body>
          <!-- Form Section -->
          <div class="mb-6">
            <FormKit
              type="form"
              :actions="false"
              @submit="handleSubmit"
              :config="{
                submitHandler: (node, e) => {
                  e.preventDefault();
                  handleSubmit();
                }
              }"
              v-model="formData"
            >
              <!-- Maklumat Pemohon -->
              <div>
                <h3 class="text-lg font-medium mb-4">Maklumat Pemohon</h3>
  
                <div
                  v-for="(applicant, index) in formData.applicants"
                  :key="index"
                  class="mb-8 p-4 border border-gray-200 rounded-lg"
                >
                  <div class="flex justify-between items-center mb-4">
                    <h4 class="text-md font-medium">
                      Pemohon #{{ index + 1 }}
                    </h4>
                    <button
                      type="button"
                      @click="removeApplicant(index)"
                      class="text-red-500 hover:text-red-700"
                    >
                      <Icon name="mdi:delete" size="1.25rem" />
                    </button>
                  </div>
  
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- Maklumat Peribadi -->
                    <div class="md:col-span-2">
                      <h4 class="text-md font-medium mb-4">Maklumat Peribadi</h4>
                    </div>

                    <FormKit
                      type="select"
                      :name="`applicant${index}idType`"
                      label="Jenis ID"
                      placeholder="Pilih jenis ID"
                      validation="required"
                      :options="idTypeOptions"
                      v-model="applicant.idType"
                      :validation-messages="{
                        required: 'Jenis ID adalah wajib',
                      }"
                    />

                      <FormKit
                      v-if="applicant.idType"
                        type="file"
                        :name="`applicant${index}idDocument`"
                        :label="getDocumentLabel(applicant.idType)"
                        accept=".pdf,.jpg,.jpeg,.png"
                        v-model="applicant.idDocument"
                        help="Format yang dibenarkan: PDF, JPG, PNG. Saiz maksimum: 5MB"
                        validation="required"
                        :validation-messages="{
                          required: 'Dokumen ID adalah wajib'
                        }"
                      />

                    <FormKit
                      type="text"
                      :name="`applicant${index}newIC`"
                      label="Nombor ID"
                      validation="required"
                      v-model="applicant.newIC"
                      :validation-messages="{
                        required: 'Nombor ID adalah wajib',
                      }"
                      :placeholder="getPlaceholder(applicant.idType)"
                    />

                    <FormKit
                      type="text"
                      :name="`applicant${index}name`"
                      label="Nama"
                      validation="required"
                      v-model="applicant.name"
                      :validation-messages="{
                        required: 'Nama adalah wajib',
                      }"
                    />



                    <FormKit
                      type="text"
                      :name="`applicant${index}passportNo`"
                      label="No Pasport"
                      v-model="applicant.passportNo"
                    />

                    <FormKit
                      type="date"
                      :name="`applicant${index}passportStartDate`"
                      label="Tarikh Mula Pasport"
                      v-model="applicant.passportStartDate"
                    />

                    <FormKit
                      type="date"
                      :name="`applicant${index}passportEndDate`"
                      label="Tarikh Tamat Pasport"
                      v-model="applicant.passportEndDate"
                    />

                    <FormKit
                      type="text"
                      :name="`applicant${index}phone`"
                      label="No Telefon"
                      validation="required"
                      v-model="applicant.phone"
                      :validation-messages="{
                        required: 'No Telefon adalah wajib',
                      }"
                    />

                    <FormKit
                      type="textarea"
                      :name="`applicant${index}address`"
                      label="Alamat"
                      validation="required"
                      v-model="applicant.address"
                      :validation-messages="{
                        required: 'Alamat adalah wajib',
                      }"
                    />

                    <FormKit
                      type="select"
                      :name="`applicant${index}familyCategory`"
                      label="Kategori Keluarga Asnaf"
                      validation="required"
                      :options="[
                        { label: 'Fakir', value: 'fakir' },
                        { label: 'Miskin', value: 'miskin' },
                        { label: 'Amil', value: 'amil' },
                        { label: 'Muallaf', value: 'muallaf' },
                        { label: 'Riqab', value: 'riqab' },
                        { label: 'Gharimin', value: 'gharimin' },
                        { label: 'Fisabilillah', value: 'fisabilillah' },
                        { label: 'Ibnus Sabil', value: 'ibnus-sabil' }
                      ]"
                      placeholder="Pilih kategori keluarga asnaf"
                      v-model="applicant.familyCategory"
                      :validation-messages="{
                        required: 'Kategori Keluarga Asnaf adalah wajib',
                      }"
                    />

                    <!-- Maklumat Bank -->
                    <div class="md:col-span-2 mt-6">
                      <h4 class="text-md font-medium mb-4">Maklumat Bank</h4>
                    </div>

                    <FormKit
                      type="select"
                      :name="`applicant${index}bankName`"
                      label="Nama Bank"
                      validation="required"
                      :options="bankOptions"
                      placeholder="Pilih bank"
                      v-model="applicant.bankName"
                      :validation-messages="{
                        required: 'Nama Bank adalah wajib',
                      }"
                    />

                    <FormKit
                      v-if="applicant.bankName"
                      type="text"
                      :name="`applicant${index}swiftCode`"
                      label="SWIFT Code"
                      :value="getSelectedBankSwiftCode(applicant.bankName)"
                      readonly
                      help="SWIFT Code untuk bank yang dipilih"
                    />

                    <FormKit
                      type="text"
                      :name="`applicant${index}bankAccount`"
                      label="No Akaun Bank"
                      validation="required"
                      v-model="applicant.bankAccount"
                      :validation-messages="{
                        required: 'No Akaun Bank adalah wajib',
                      }"
                    />

                    <FormKit
                      type="text"
                      :name="`applicant${index}bankAccountHolder`"
                      label="Penama Bank Akaun"
                      v-model="applicant.bankAccountHolder"
                    />

                    <FormKit
                      type="select"
                      :name="`applicant${index}paymentMethod`"
                      label="Kaedah Pembayaran"
                      validation="required"
                      :options="paymentMethodOptions"
                      placeholder="Pilih kaedah pembayaran"
                      v-model="applicant.paymentMethod"
                      :validation-messages="{
                        required: 'Kaedah pembayaran adalah wajib'
                      }"
                    />

                    <!-- Conditional checkboxes when Tiada is selected -->
                    <div v-if="applicant.paymentMethod === 'tiada'" class="md:col-span-2">
                      <FormKit
                        type="checkbox"
                        :name="`applicant${index}noPaymentReason`"
                        label="Nyatakan sebab"
                        :options="noPaymentReasonOptions"
                        v-model="applicant.noPaymentReason"
                        validation="required|min:1"
                        :validation-messages="{
                          required: 'Sila pilih sekurang-kurangnya satu sebab',
                          min: 'Sila pilih sekurang-kurangnya satu sebab'
                        }"
                      />
                    </div>

                    <!-- Maklumat Bencana -->
                    <div class="md:col-span-2 mt-6">
                      <h4 class="text-md font-medium mb-4">Maklumat Bencana</h4>
                    </div>

                    <div class="flex gap-2 mb-4">
                      <FormKit
                        type="text"
                        :name="`applicant${index}disasterLocation`"
                        label="Lokasi Bencana"
                        validation="required"
                        placeholder="Lokasi bencana atau klik Dapatkan Lokasi"
                        v-model="applicant.disasterLocation"
                        :validation-messages="{
                          required: 'Lokasi bencana adalah wajib',
                        }"
                        class="flex-1"
                      />
                      <rs-button
                        type="button"
                        variant="primary-outline"
                        class="whitespace-nowrap mt-7"
                        @click="getLocation(index)"
                      >
                        <i class="fas fa-location-dot mr-2"></i>
                        Dapatkan Lokasi
                      </rs-button>
                    </div>

                    <FormKit
                      type="select"
                      :name="`applicant${index}disasterStatus`"
                      label="Senarai Bencana"
                      validation="required"
                      :options="disasterListOptions"
                      placeholder="Pilih senarai bencana"
                      v-model="applicant.disasterStatus"
                      :validation-messages="{
                        required: 'Senarai bencana adalah wajib'
                      }"
                    />

                    <div v-if="applicant.disasterStatus && applicant.disasterStatus !== 'tiada'" class="md:col-span-2">
                      <FormKit
                        type="file"
                        :name="`applicant${index}disasterDocument`"
                        label="Upload Dokumen Bencana"
                        accept=".pdf,.jpg,.jpeg,.png"
                        v-model="applicant.disasterDocument"
                        help="Format yang dibenarkan: PDF, JPG, PNG. Saiz maksimum: 5MB"
                        validation="required"
                        :validation-messages="{
                          required: 'Dokumen bencana adalah wajib'
                        }"
                      />
                    </div>

                    <div v-if="applicant.disasterStatus === 'tiada'" class="md:col-span-2">
                      <FormKit
                        type="textarea"
                        :name="`applicant${index}noDisasterNotes`"
                        label="Catatan"
                        placeholder="Sila nyatakan sebab mengapa tiada bencana"
                        v-model="applicant.noDisasterNotes"
                        validation="required"
                        :validation-messages="{
                          required: 'Catatan adalah wajib'
                        }"
                      />
                    </div>

                    <FormKit
                      type="number"
                      :name="`applicant${index}helpAmount`"
                      label="Amaun Bantuan"
                      validation="required"
                      v-model="applicant.helpAmount"
                      :validation-messages="{
                        required: 'Amaun Bantuan adalah wajib',
                      }"
                    />

                    <div class="md:col-span-2">
                      <FormKit
                        type="file"
                        :name="`applicant${index}policeReport`"
                        label="Upload Laporan Polis"
                        accept=".pdf,.jpg,.jpeg,.png"
                        validation="required"
                        v-model="applicant.policeReport"
                        :validation-messages="{
                          required: 'Laporan Polis adalah wajib',
                        }"
                      />
                    </div>
                  </div>
                </div>
  
                <div class="flex justify-center mt-4">
                  <rs-button
                    variant="secondary"
                    @click="addApplicant"
                    type="button"
                  >
                    <Icon name="mdi:plus" class="mr-1" size="1rem" />
                    Tambah Pemohon
                  </rs-button>
                </div>
              </div>
  
              <div class="flex justify-end mt-6">
                <rs-button
                  type="button"
                  variant="secondary"
                  class="mr-2"
                  @click="handleSave"
                >
                  Simpan
                </rs-button>
                <rs-button
                  type="submit"
                  variant="primary"
                  @click="handleSubmit"
                >
                  Pengesahan
                </rs-button>
              </div>
            </FormKit>
          </div>
        </template>
      </rs-card>
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from "vue";
  import { useRouter } from "vue-router";
  import { useToast } from "vue-toastification";
  
  const toast = useToast();
  const router = useRouter();
  
  definePageMeta({
    title: "Isi Permohonan Ringkas",
  });
  
  const breadcrumb = ref([
    {
      name: "Profiling",
      type: "link",
      path: "/BF-PRF/AS/QB/01",
    },
    {
      name: "Asnaf",
      type: "link",
      path: "/BF-PRF/AS/QB/01",
    },
    {
      name: "Pendaftaran Pantas Pukal",
      type: "current",
      path: "/BF-PRF/AS/QB/01",
    },
  ]);
  
  // import modal state
  const showImportModal = ref(false);
  const importFile = ref(null);

  const handleImport = async () => {
    try {
      if (!importFile.value) {
        toast.error("Please upload a file first");
        return;
      }

      // Generate and fill 5 fake applicants
      formData.value.applicants = generateFakeApplicants(5);
      
      toast.success("Data Berjaya di Import");
      showImportModal.value = false;
    } catch (error) {
      toast.error("Error importing file");
      console.error("Import error:", error);
    }
  };
  
  // Function to generate fake Malaysian IC number
  const generateFakeIC = () => {
    const year = Math.floor(Math.random() * (99 - 50) + 50); // Random year between 50-99
    const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
    const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
    const random = String(Math.floor(Math.random() * 9999)).padStart(4, '0');
    return `${year}${month}${day}-${random}`;
  };

  // Function to generate fake Malaysian phone number
  const generateFakePhone = () => {
    const prefixes = ['010', '011', '012', '013', '014', '016', '017', '018', '019'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const number = String(Math.floor(Math.random() * 10000000)).padStart(7, '0');
    return `${prefix}-${number}`;
  };

  // Function to generate fake bank account
  const generateFakeBankAccount = () => {
    return String(Math.floor(Math.random() * 10000000000)).padStart(10, '0');
  };

  // Function to generate fake applicants
  const generateFakeApplicants = (count) => {
    const bankValues = bankOptions.map(bank => bank.value);
    const familyCategories = ['fakir', 'miskin', 'amil', 'muallaf', 'riqab', 'gharimin', 'fisabilillah', 'ibnus-sabil'];
    const helpCodes = ['A001', 'B002', 'C003', 'D004', 'E005'];
    const paymentMethods = ['akaun', 'tiada'];
    const disasterLocations = [
      'Kuala Lumpur',
      'Selangor',
      'Johor',
      'Penang',
      'Perak'
    ];
    
    const firstNames = ['Ahmad', 'Mohammad', 'Siti', 'Nur', 'Aisyah', 'Ali', 'Fatimah', 'Hassan'];
    const lastNames = ['bin Abdullah', 'binti Ismail', 'bin Omar', 'binti Ahmad', 'bin Hassan'];
    
    const addresses = [
      'No 123, Jalan Merdeka, Taman Perdana, 50000 Kuala Lumpur',
      'No 45, Jalan Sultan Ismail, Taman Tun Dr Ismail, 60000 Kuala Lumpur',
      'No 78, Jalan Pahang, Taman Melawati, 53100 Kuala Lumpur',
      'No 12, Jalan Ipoh, Taman Setapak, 53000 Kuala Lumpur',
      'No 34, Jalan Gombak, Taman Melati, 53100 Kuala Lumpur'
    ];

    return Array.from({ length: count }, () => {
      const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
      const idTypes = ['ic', 'foreign-id', 'polis', 'tentera', 'sijil-lahir'];
      return {
        idType: idTypes[Math.floor(Math.random() * idTypes.length)],
        idDocument: null,
        newIC: generateFakeIC(),
        name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
        passportNo: `A${Math.floor(Math.random() * 1000000)}`,
        passportStartDate: new Date(Date.now() - Math.random() * 10000000000).toISOString().split('T')[0],
        passportEndDate: new Date(Date.now() + Math.random() * 10000000000).toISOString().split('T')[0],
        phone: generateFakePhone(),
        address: addresses[Math.floor(Math.random() * addresses.length)],
        familyCategory: familyCategories[Math.floor(Math.random() * familyCategories.length)],
        bankName: bankValues[Math.floor(Math.random() * bankValues.length)],
        swiftCode: '',
        bankAccount: generateFakeBankAccount(),
        bankAccountHolder: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
        paymentMethod: paymentMethod,
        noPaymentReason: paymentMethod === 'tiada' ? [noPaymentReasonOptions[Math.floor(Math.random() * noPaymentReasonOptions.length)].value] : [],
        disasterLocation: disasterLocations[Math.floor(Math.random() * disasterLocations.length)],
        disasterStatus: disasterListOptions[Math.floor(Math.random() * disasterListOptions.length)].value,
        disasterDocument: null,
        noDisasterNotes: '',
        noDisasterDocument: null,
        helpAmount: Math.floor(Math.random() * 10000),
        policeReport: null
      };
    });
  };
  
  // ID Type Options
  const idTypeOptions = [
    { label: 'Kad Pengenalan', value: 'ic' },
    { label: 'Foreign ID', value: 'foreign-id' },
    { label: 'Sijil Lahir', value: 'sijil-lahir' }
  ];

  // Bank Options
  const bankOptions = [
    { label: "Maybank", value: "maybank", swiftCode: "MBBEMYKL" },
    { label: "CIMB", value: "cimb", swiftCode: "CIBBMYKL" },
    { label: "RHB", value: "rhb", swiftCode: "RHBBMYKL" },
    { label: "Bank Islam", value: "bank-islam", swiftCode: "BIMBMYKL" },
    { label: "Bank Rakyat", value: "bank-rakyat", swiftCode: "BKRMYKL" },
    { label: "Public Bank", value: "public-bank", swiftCode: "PBBEMYKL" },
    { label: "Hong Leong Bank", value: "hong-leong", swiftCode: "HLBBMYKL" },
    { label: "Ambank", value: "ambank", swiftCode: "ARBKMYKL" },
    { label: "BSN", value: "bsn", swiftCode: "BSNAMYKL" },
    { label: "Affin Bank", value: "affin", swiftCode: "PHBMMYKL" },
    { label: "UOB", value: "uob", swiftCode: "UOVBMYKL" },
    { label: "OCBC", value: "ocbc", swiftCode: "OCBCMYKL" },
    { label: "Standard Chartered", value: "standard-chartered", swiftCode: "SCBLMYKL" },
    { label: "Alliance Bank", value: "alliance", swiftCode: "MFBBMYKL" },
    { label: "Agrobank", value: "agrobank", swiftCode: "AGOBMYKL" },
  ];

  // Payment Method Options
  const paymentMethodOptions = [
    { label: 'Akaun', value: 'akaun' },
    { label: 'Tiada', value: 'tiada' }
  ];

  // No Payment Reason Options
  const noPaymentReasonOptions = [
    { label: 'Muflis', value: 'muflis' },
    { label: 'Bukan Warganegara', value: 'bukan-warganegara' }
  ];

  // Disaster List Options
  const disasterListOptions = [
    { label: 'Bencana', value: 'bencana' },
    { label: 'Tiada', value: 'tiada' }
  ];

  // Get SWIFT Code for selected bank
  const getSelectedBankSwiftCode = (bankName) => {
    const selectedBank = bankOptions.find(bank => bank.value === bankName);
    return selectedBank ? selectedBank.swiftCode : '';
  };

  // Get placeholder based on ID type
  const getPlaceholder = (idType) => {
    const placeholders = {
      "ic": "Contoh: 901231025678",
      "foreign-id": "Contoh: A12345678",
      "sijil-lahir": "Contoh: 12345678"
    };
    return placeholders[idType] || "";
  };

  // Get document label based on ID type
  const getDocumentLabel = (idType) => {
    const labels = {
      "ic": "Upload Kad Pengenalan",
      "foreign-id": "Upload Foreign ID",
      "sijil-lahir": "Upload Sijil Lahir"
    };
    return labels[idType] || "";
  };

  // Form data structure
  const formData = ref({
    applicants: [],
  });

  // Watch for bank changes to update SWIFT code
  watch(() => formData.value.applicants, (newApplicants) => {
    newApplicants.forEach((applicant) => {
      if (applicant.bankName) {
        const selectedBank = bankOptions.find(bank => bank.value === applicant.bankName);
        applicant.swiftCode = selectedBank ? selectedBank.swiftCode : '';
      }
    });
  }, { deep: true });
  
  const addApplicant = () => {
    formData.value.applicants.push({
      idType: "",
      idDocument: null,
      newIC: "",
      name: "",
      passportNo: "",
      passportStartDate: "",
      passportEndDate: "",
      phone: "",
      address: "",
      familyCategory: "",
      bankName: "",
      swiftCode: "",
      bankAccount: "",
      bankAccountHolder: "",
      paymentMethod: "",
      noPaymentReason: [],
      disasterLocation: "",
      disasterStatus: "",
      disasterDocument: null,
      noDisasterNotes: "",
      noDisasterDocument: null,
      helpAmount: "",
      policeReport: null,
    });
  };
  
  const removeApplicant = (index) => {
    formData.value.applicants.splice(index, 1);
  };
  
  const handleSubmit = async () => {
    try {
      // Handle form submission
      console.log("Form submitted:", formData.value);
      // Add your submission logic here (API call, etc.)

      toast.success("Pengesahan berjaya dihantar");
      
      // Wait for 2 seconds before navigating
      // setTimeout(() => {
        router.push("/BF-PRF/AS/QB/02");
      // }, 2000);
    } catch (error) {
      toast.error("Ralat! Permohonan tidak berjaya dihantar");
      console.error("Submission error:", error);
    }
  };

  const getLocation = (applicantIndex) => {
    formData.value.applicants[applicantIndex].disasterLocation = 'Lokasi semasa';
    toast.success('Lokasi berjaya diperoleh!');
  };

  const handleSave = async () => {
    try {
      // Handle form saving (draft logic)
      console.log("Form saved as draft:", formData.value);
      toast.success("Permohonan berjaya disimpan sebagai draf");
    } catch (error) {
      toast.error("Ralat! Permohonan tidak berjaya disimpan");
      console.error("Save error:", error);
    }
  };
  </script>
  