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
                    <FormKit
                      type="text"
                      :name="`applicant${index}newIC`"
                      label="No Kad Pengenalan (baru) / No Polis / No Tentera / No Pasport"
                      validation="required"
                      v-model="applicant.newIC"
                      :validation-messages="{
                        required: 'No Kad Pengenalan adalah wajib',
                      }"
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
                      type="text"
                      :name="`applicant${index}bankName`"
                      label="Nama Bank"
                      validation="required"
                      v-model="applicant.bankName"
                      :validation-messages="{
                        required: 'Nama Bank adalah wajib',
                      }"
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
                      type="select"
                      :name="`applicant${index}asnafCategory`"
                      label="Kategori Asnaf"
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
                      placeholder="Pilih kategori asnaf"
                      v-model="applicant.asnafCategory"
                      :validation-messages="{
                        required: 'Kategori Asnaf adalah wajib',
                      }"
                    />

                    <FormKit
                      type="text"
                      :name="`applicant${index}helpCode`"
                      label="Kod Bantuan"
                      v-model="applicant.helpCode"
                    />

                    <div class="md:col-span-2">
                      <FormKit
                        type="file"
                        :name="`applicant${index}supportDoc`"
                        label="Muat naik dokumen sokongan sekiranya diperlukan"
                        accept=".pdf,.jpg,.jpeg,.png"
                        v-model="applicant.supportDoc"
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
                  type="submit" 
                  variant="primary"
                  @click="handleSubmit"
                >
                  Hantar Permohonan
                </rs-button>
              </div>
            </FormKit>
          </div>
        </template>
      </rs-card>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
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
    const banks = ['Maybank', 'CIMB Bank', 'Public Bank', 'RHB Bank', 'AmBank', 'Hong Leong Bank'];
    const asnafCategories = ['fakir', 'miskin', 'amil', 'muallaf', 'riqab', 'gharimin', 'fisabilillah', 'ibnus-sabil'];
    const helpCodes = ['A001', 'B002', 'C003', 'D004', 'E005'];
    
    const firstNames = ['Ahmad', 'Mohammad', 'Siti', 'Nur', 'Aisyah', 'Ali', 'Fatimah', 'Hassan'];
    const lastNames = ['bin Abdullah', 'binti Ismail', 'bin Omar', 'binti Ahmad', 'bin Hassan'];
    
    const addresses = [
      'No 123, Jalan Merdeka, Taman Perdana, 50000 Kuala Lumpur',
      'No 45, Jalan Sultan Ismail, Taman Tun Dr Ismail, 60000 Kuala Lumpur',
      'No 78, Jalan Pahang, Taman Melawati, 53100 Kuala Lumpur',
      'No 12, Jalan Ipoh, Taman Setapak, 53000 Kuala Lumpur',
      'No 34, Jalan Gombak, Taman Melati, 53100 Kuala Lumpur'
    ];

    return Array.from({ length: count }, () => ({
      newIC: generateFakeIC(),
      name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
      phone: generateFakePhone(),
      address: addresses[Math.floor(Math.random() * addresses.length)],
      bankName: banks[Math.floor(Math.random() * banks.length)],
      bankAccount: generateFakeBankAccount(),
      asnafCategory: asnafCategories[Math.floor(Math.random() * asnafCategories.length)],
      helpCode: helpCodes[Math.floor(Math.random() * helpCodes.length)],
      supportDoc: null
    }));
  };
  
  // Form data structure
  const formData = ref({
    applicants: [],
  });
  
  const addApplicant = () => {
    formData.value.applicants.push({
      newIC: "",
      name: "",
      phone: "",
      address: "",
      bankName: "",
      bankAccount: "",
      asnafCategory: "",
      helpCode: "",
      supportDoc: null,
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

      toast.success("Permohonan berjaya dihantar");
      
      // Wait for 2 seconds before navigating
      // setTimeout(() => {
        router.push("/BF-PRF/AS/FR/04");
      // }, 2000);
    } catch (error) {
      toast.error("Ralat! Permohonan tidak berjaya dihantar");
      console.error("Submission error:", error);
    }
  };
  </script>
  