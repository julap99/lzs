<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">

      <template #body>
        <div class="mb-4">
          <RsTab variant="primary" type="default">
            <RsTabItem title="Maklumat Pemohon" :active="activeTab === 'pemohon'" @click="activeTab = 'pemohon'"/>
            <RsTabItem title="Maklumat Bantuan" :active="activeTab === 'bantuan'" @click="activeTab = 'bantuan'"/>
            <RsTabItem title="Maklumat Tuntutan" :active="activeTab === 'tuntutan'" @click="activeTab = 'tuntutan'"/>
            <RsTabItem title="Dokumen Sokongan" :active="activeTab === 'dokumen'" @click="activeTab = 'dokumen'"/>
          </RsTab>
        </div>

        <form @submit.prevent="handleSubmit">
          <div v-if="activeTab === 'pemohon'">
            <h3 class="text-lg font-medium mb-4">Maklumat Pemohon</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700">Nama</label>
                <p class="mt-1 text-gray-600">{{ formData.namaPemohon }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">No. Kad Pengenalan / No. Vendor</label>
                <p class="mt-1 text-gray-600">{{ formData.noPengenalan }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">No. Telefon</label>
                <p class="mt-1 text-gray-600">{{ formData.noTelefonPemohon }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Kategori Asnaf</label>
                <p class="mt-1 text-gray-600">{{ formData.kategoriAsnaf }}</p>
              </div>
            </div>
          </div>

          <div v-if="activeTab === 'bantuan'">
            <h3 class="text-lg font-medium mb-4">Maklumat Bantuan</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormKit
                v-model="formData.noBtn"
                type="select"
                label="No. Bantuan"
                :options="[{ label: 'Sila Pilih...', value: '' }, ...noBtnOptions]"
                validation="required"
                :validation-messages="{
                  required: 'Sila pilih No. Bantuan'
                }"
                @input="handlenoBtnChange"
              />
             
            </div>
            <div class="bg-gray-50 p-4 rounded-lg mb-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormKit
                  v-model="formData.aid"
                  type="text"
                  label="Aid"
                  disabled
                />
                <FormKit
                  v-model="formData.aidProduct"
                  type="text"
                  label="Aid Product"
                  disabled
                />
                <FormKit
                  v-model="formData.productPackage"
                  type="text"
                  label="Product Package"
                  disabled
                />
                <FormKit
                  v-model="formData.entitlementProduct"
                  type="text"
                  label="Entitlement Product"
                  disabled
                />
                <FormKit
                  v-model="formData.tarikhMula"
                  type="date"
                  label="Tarikh Mula"
                  readonly
                />
                <FormKit
                  v-model="formData.tarikhAkhir"
                  type="date"
                  label="Tarikh Akhir"
                  readonly
                />
              </div>
            </div>
			
			<!-- New Distribution Item Table -->
            <h3 class="text-lg font-medium mt-6 mb-4">Senarai Distribution Item (DI)</h3>
            <div class="overflow-x-auto">
              <table class="min-w-full border-collapse border border-gray-200">
                <thead>
                  <tr>
                    <th class="border border-gray-300 px-4 py-2">No</th>
                    <th class="border border-gray-300 px-4 py-2">DI No</th>
                    <th class="border border-gray-300 px-4 py-2">Entitlement Product</th>
                    <th class="border border-gray-300 px-4 py-2">Penerima</th>
                    <th class="border border-gray-300 px-4 py-2">Bulan</th>
                    <th class="border border-gray-300 px-4 py-2">Tahun</th>
                    <th class="border border-gray-300 px-4 py-2">Status</th>
                    <th class="border border-gray-300 px-4 py-2">Amaun (RM)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in distributionItems" :key="index">
                    <td class="border border-gray-300 px-4 py-2">{{ index + 1 }}</td>
                    <td class="border border-gray-300 px-4 py-2">{{ item.diNo }}</td>
                    <td class="border border-gray-300 px-4 py-2">{{ item.entitlementProduct }}</td>
                    <td class="border border-gray-300 px-4 py-2">{{ item.penerima }}</td>
                    <td class="border border-gray-300 px-4 py-2">{{ item.bulan }}</td>
                    <td class="border border-gray-300 px-4 py-2">{{ item.tahun }}</td>
                    <td class="border border-gray-300 px-4 py-2">{{ item.status }}</td>
                    <td class="border border-gray-300 px-4 py-2">{{ item.amaun }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div v-if="activeTab === 'tuntutan'">
            <h3 class="text-lg font-medium mb-4">Maklumat Tuntutan</h3>
			
			<!-- Guarantee Letter Table -->
			<h3 class="text-lg font-medium mt-6 mb-4">Senarai Guarantee Letter (GL)</h3>
			<div class="overflow-x-auto">
			  <table class="min-w-full border-collapse border border-gray-200">
				<thead>
				  <tr>
					<th class="border border-gray-300 px-4 py-2">No</th>
					<th class="border border-gray-300 px-4 py-2">GL No</th>
					<th class="border border-gray-300 px-4 py-2">DI No</th>
					<th class="border border-gray-300 px-4 py-2">Created Date</th>
					<th class="border border-gray-300 px-4 py-2">Penerima Bayaran</th>
					<th class="border border-gray-300 px-4 py-2">Status</th>
          <th class="border border-gray-300 px-4 py-2">Bulan</th>
          <th class="border border-gray-300 px-4 py-2">Tahun</th>
					<th class="border border-gray-300 px-4 py-2">Amaun (RM)</th>
					<th class="border border-gray-300 px-4 py-2">Balance (RM)</th>
					<th class="border border-gray-300 px-4 py-2">Tindakan</th>
				  </tr>
				</thead>
				<tbody>
				  <tr v-for="(gl, index) in guaranteeLetters" :key="index">
					<td class="border border-gray-300 px-4 py-2">{{ index + 1 }}</td>
					<td class="border border-gray-300 px-4 py-2">{{ gl.glNo }}</td>
					<td class="border border-gray-300 px-4 py-2">{{ gl.diNo }}</td>
					<td class="border border-gray-300 px-4 py-2">{{ gl.createdDate }}</td>
					<td class="border border-gray-300 px-4 py-2">{{ gl.penerimaBayaran }}</td>
          <td class="border border-gray-300 px-4 py-2">{{ gl.status }}</td>
          <td class="border border-gray-300 px-4 py-2">{{ gl.bulan }}</td>
					<td class="border border-gray-300 px-4 py-2">{{ gl.tahun }}</td>
					<td class="border border-gray-300 px-4 py-2">{{ gl.amaun }}</td>
					<td class="border border-gray-300 px-4 py-2">{{ gl.balance }}</td>
					<td class="border border-gray-300 px-4 py-2">
					  <center><rs-button @click="openInvoiceModal(gl.glNo)">Cipta Invoice</rs-button></center>
					</td>
				  </tr>
				</tbody>
			  </table>
			</div>
			
			<!-- Invoice Table -->
			<h3 class="text-lg font-medium mt-6 mb-4">Senarai Invoice</h3>
			<div class="overflow-x-auto">
			  <table class="min-w-full border-collapse border border-gray-200">
				<thead>
				  <tr>
					<th class="border border-gray-300 px-4 py-2">No</th>
					<th class="border border-gray-300 px-4 py-2">Invoice No</th>
					<th class="border border-gray-300 px-4 py-2">Title</th>
					<th class="border border-gray-300 px-4 py-2">Expected Payment Date</th>
					<th class="border border-gray-300 px-4 py-2">DI No</th>
					<th class="border border-gray-300 px-4 py-2">GL No</th>
					<th class="border border-gray-300 px-4 py-2">PA No</th>
					<th class="border border-gray-300 px-4 py-2">Approver Status</th>
					<th class="border border-gray-300 px-4 py-2">Amaun (RM)</th>
				  </tr>
				</thead>
				<tbody>
				  <tr v-for="(invoice, index) in invoices" :key="index">
					<td class="border border-gray-300 px-4 py-2">{{ index + 1 }}</td>
					<td class="border border-gray-300 px-4 py-2">{{ invoice.invoiceNo }}</td>
					<td class="border border-gray-300 px-4 py-2">{{ invoice.title }}</td>
					<td class="border border-gray-300 px-4 py-2">{{ invoice.expectedPaymentDate }}</td>
					<td class="border border-gray-300 px-4 py-2">{{ invoice.diNo }}</td>
					<td class="border border-gray-300 px-4 py-2">{{ invoice.glNo }}</td>
					<td class="border border-gray-300 px-4 py-2">{{ invoice.paNo }}</td>
					<td class="border border-gray-300 px-4 py-2">{{ invoice.approverStatus }}</td>
					<td class="border border-gray-300 px-4 py-2">{{ invoice.amaun }}</td>
				  </tr>
				</tbody>
			  </table>
			</div>
          </div>

          <div v-if="activeTab === 'dokumen'">
            <h3 class="text-lg font-medium mb-4">Dokumen Sokongan</h3>

            <div class="overflow-x-auto">
              <table class="min-w-full border-collapse border border-gray-200">
                <thead>
                  <tr>
                    <th class="border border-gray-300 px-4 py-2">No</th>
                    <th class="border border-gray-300 px-4 py-2">Nama Dokumen</th>
					<th class="border border-gray-300 px-4 py-2">Nama File</th>
                    <th class="border border-gray-300 px-4 py-2">Tarikh Muat Naik</th>
                    <th class="border border-gray-300 px-4 py-2">Tindakan</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(document, index) in documents" :key="index">
                    <td class="border border-gray-300 px-4 py-2">{{ index + 1 }}</td>
                    <td class="border border-gray-300 px-4 py-2">{{ document.name }}</td>
					<td class="border border-gray-300 px-4 py-2">{{ document.nameFile }}</td>
                    <td class="border border-gray-300 px-4 py-2" align="center">{{ document.uploadDate }}</td>
                    <td class="border border-gray-300 px-4 py-2">
                      <center><rs-button
                        variant="primary"
                        size="sm"
                        class="!px-2 !py-1"
                        @click="viewDocument(document.id)"
                      >
                        <Icon name="material-symbols:visibility" class="w-4 h-4 mr-1" />
                        Lihat
                      </rs-button></center>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Section 5: Action & Status -->
          <div class="flex justify-end gap-4 mt-6">
            <rs-button
              type="button"
              variant="secondary"
              @click="handleSaveDraft"
            >
              <Icon name="material-symbols:save" class="w-4 h-4 mr-1" />
              Simpan
            </rs-button>
            <rs-button
              type="button"
              variant="primary"
              @click="handleSubmit"
            >
              <Icon name="material-symbols:send" class="w-4 h-4 mr-1" />
              Hantar Tuntutan
            </rs-button>
          </div>
        </form>
      </template>
    </rs-card>
  </div>
  
	<!-- Invoice Modal -->
	<RsModal
	  v-model="showInvoiceModal"
	  title="Cipta Invoice"
	  size="lr"
	>
	  <template #body>
		<div class="grid grid-cols-1 gap-6">
		  <FormKit
			v-model="newInvoice.invoiceNo"
			type="text"
			label="No. Invois"
			disabled
		  />
		  <FormKit
			v-model="newInvoice.noInvoisPelanggan"
			type="text"
			label="No. Invois Pelanggan"
			required
		  />
		  <FormKit
			v-model="newInvoice.tajuk"
			type="text"
			label="Tajuk"
			required
		  />
		  <FormKit
			v-model="newInvoice.semester"
			type="text"
			label="Semester"
			required
		  />
		  <FormKit
		    v-model="newInvoice.cgpa"
			type="number"
			label="CGPA"
			validation="required|number|min:0|max:4"
			 :validation-messages="{
				required: 'Sila masukkan CGPA',
				number: 'Sila masukkan nilai yang sah',
				min: 'CGPA tidak boleh kurang dari 0',
				max: 'CGPA tidak boleh lebih dari 4'
			 }"
			step="0.01"
			min="0"
			max="4"
		  />
		  <FormKit
			v-model="newInvoice.bulan"
			type="text"
			label="Bulan"
			readonly
		  />
		  <FormKit
			v-model="newInvoice.tahun"
			type="text"
			label="Tahun"
			readonly
		  />
		  <FormKit
			v-model="newInvoice.catatan"
			type="textarea"
			label="Catatan"
			rows="3"
			placeholder="Masukkan catatan tambahan jika perlu..."
		  />
		  <FormKit
			v-model="newInvoice.penerimaBayaran"
			type="text"
			label="Penerima Bayaran"
			readonly
		  />
		  <FormKit
			v-model="newInvoice.mop"
			type="text"
			label="MOP"
			readonly
		  />
		  <FormKit
			v-model="newInvoice.namaPenerima"
			type="text"
			label="Nama Penerima"
			readonly
		  />
		  <FormKit
			v-model="newInvoice.bank"
			type="text"
			label="Bank"
			readonly
		  />
		  <FormKit
			v-model="newInvoice.noAkaun"
			type="text"
			label="No. Akaun"
			readonly
		  />
		  <FormKit
			v-model="newInvoice.tarikhJangkaanPembayaran"
			type="date"
			label="Tarikh Jangkaan Pembayaran"
			required
		  />
		  <!-- <FormKit
			v-model="newInvoice.tarikhDicipta"
			type="text"
			label="Tarikh Dicipta"
			readonly
		  /> -->
		  <FormKit
			v-model="newInvoice.amaun"
			type="number"
			label="Amaun (RM)"
			validation="required|number|min:0"
			:validation-messages="{
			  required: 'Sila masukkan amaun',
			  number: 'Sila masukkan nilai yang sah',
			  min: 'Amaun tidak boleh negatif'
			}"
			step="0.01"
			min="0"
		  />
			<FormKit
			  v-model="newInvoice.lampiran"
			  type="file"
			  label="Muat Naik Lampiran"
			  accept=".pdf,.doc,.docx"
			/>
		</div>
	  </template>
	  <template #footer>
		<rs-button @click="showInvoiceModal = false">Batal</rs-button>
		<rs-button @click="createInvoice">Simpan</rs-button>
	  </template>
	</RsModal>
</template>

<script setup>
import { ref, nextTick } from "vue";
import { useNuxtApp } from "#app";

definePageMeta({
  title: "Mohon Tuntutan (TDS-01)",
});

const { $swal } = useNuxtApp();

const breadcrumb = ref([
  {
    name: "Pengurusan Bantuan",
    type: "link",
    path: "/BF-BTN/tuntutan-dengan-siasatan",
  },
  {
    name: "Tuntutan",
    type: "link",
    path: "/BF-BTN/tuntutan-dengan-siasatan",
  },
  {
    name: "Mohon Tuntutan",
    type: "current",
    path: "/BF-BTN/tuntutan-dengan-siasatan/mohon-tuntutan",
  },
]);

// Form state
const formData = ref({
  namaPemohon: "", // Populate this from session
  noPengenalan: "", // Populate this from session
  emailPemohon: "", // Populate this from session
  noTelefonPemohon: "", // Populate this from session
  kategoriAsnaf: "Fakir", // Default value
  noBtn: "", // New field for reference number
  noGL: "",
  noInvois: "INV-2025-00124",
  kodBantuan: "",
  aid: "",
  aidProduct: "",
  productPackage: "",
  entitlementProduct: "",
  amaunTuntutan: "",
  tarikh: "",
  catatan: "",
  dokumenSokongan: [],
  tarikhMula: "", // New field
  tarikhAkhir: "", // New field
  penerimaBayaran: "", // New field
  mop: "", // New field
  namaPenerima: "", // New field
  bank: "", // New field
  noAkaun: "", // New field
  tarikhJangkaanPembayaran: "", // New field
  tarikhDicipta: "04/04/2025 03:45 PM", // New field
});

// Sample No. Bantuan options - Replace with actual API call
const noBtnOptions = ref([
  { label: "NAS-2025-00012", value: "NAS-2025-00012" },
  { label: "NAS-2025-00014", value: "NAS-2025-00014" },
]);

// Sample distribution items
const distributionItems = ref([
  /*{
    diNo: 'DI-001',
    entitlementProduct: 'BANTUAN SUMBANGAN KARPET',
    penerima: 'INSTITUSI',
    bulan: 'FEB',
    tahun: '2025',
    status: 'Aktif',
    amaun: '5000.00',
  },*/
  {
    diNo: 'DI-002',
    entitlementProduct: 'BANTUAN PERUBATAN DIALISIS',
    penerima: 'VENDOR',
    bulan: 'MAC',
    tahun: '2025',
    status: 'Aktif',
    amaun: '1500.00',
  },
]);

// Sample documents
const documents = ref([
  {
    id: 1,
    name: 'Invoice 940411145465',
	nameFile: 'Invoice 940411145465.pdf',
    uploadDate: '04/04/2025',
  },
]);

// No. Bantuan data mapping
const noBtnDataMapping = {
  'NAS-2025-00012': {
    aid: '(HQ) BANTUAN SUMBANGAN PERALATAN & BINA/BAIKPULIH INSTITUSI AGAMA',
    aidProduct: '(HQ) BANTUAN SUMBANGAN PERALATAN INSTITUSI AGAMA',
    productPackage: '(GL) (HQ) BANTUAN SUMBANGAN KARPET INSTITUSI AGAMA',
    entitlementProduct: '(GL) (HQ) BANTUAN SUMBANGAN KARPET INSTITUSI AGAMA',
    amaunTuntutan: 5000.00,
    dokumenDefault: 'GL_Bantuan_Sumbangan_Karpet.pdf',
    penerimaBayaran: 'INSTITUSI',
    bulan: 'FEB',
    tahun: '2025',
    mop: 'AKAUN',
    namaPenerima: 'MASJID AS-ISLAH',
    bank: 'MALAYAN BANKING BERHAD (MBBEMYKL)',
    noAkaun: '176327471002'
  },
  'NAS-2025-00014': {
    aid: '(HQ) BANTUAN PERUBATAN DIALISIS (FAKIR)',
    aidProduct: '(HQ) KATEGORI HEMODIALISIS (FAKIR)',
    productPackage: '(GL) (HQ) HEMODIALISIS DAN SUNTIKAN EPO (FAKIR)',
    entitlementProduct: '(GL) (HQ) HEMODIALISIS (FAKIR)',
    amaunTuntutan: 1500.00,
    dokumenDefault: 'GL_Bantuan_Perubatan_Dialisis.pdf',
    penerimaBayaran: 'VENDOR',
    bulan: 'MAC',
    tahun: '2025',
    mop: 'AKAUN',
    namaPenerima: 'KIDDOS PLAY LAB REHSB CENTER (MBB 8273)',
    bank: 'MALAYAN BANKING BERHAD (MBBEMYKL)',
    noAkaun: '170017472354'
  }
};

// Track active tab
const activeTab = ref('pemohon');

// Handle No. Bantuan change
const handlenoBtnChange = async (value) => {
  console.log("handlenoBtnChange triggered with value:", value);
  
  // Reset all bantuan fields first
  formData.value.aid = '';
  formData.value.aidProduct = '';
  formData.value.productPackage = '';
  formData.value.entitlementProduct = '';
  formData.value.amaunTuntutan = '';
  formData.value.dokumenSokongan = [];
  formData.value.penerimaBayaran = '';
  formData.value.bulan = '';
  formData.value.tahun = '';
  formData.value.mop = '';
  formData.value.namaPenerima = '';
  formData.value.bank = '';
  formData.value.noAkaun = '';

  // Auto-populate based on selected GL
  if (value && noBtnDataMapping[value]) {
    const noBtnData = noBtnDataMapping[value];
    console.log("Found No. Bantuan data:", noBtnData);
    
    // Use nextTick to ensure reactivity
    await nextTick();

    formData.value.aid = noBtnData.aid;
    formData.value.aidProduct = noBtnData.aidProduct;
    formData.value.productPackage = noBtnData.productPackage;
    formData.value.entitlementProduct = noBtnData.entitlementProduct;
    formData.value.amaunTuntutan = noBtnData.amaunTuntutan;
    formData.value.penerimaBayaran = noBtnData.penerimaBayaran;
    formData.value.bulan = noBtnData.bulan;
    formData.value.tahun = noBtnData.tahun;
    formData.value.mop = noBtnData.mop;
    formData.value.namaPenerima = noBtnData.namaPenerima;
    formData.value.bank = noBtnData.bank;
    formData.value.noAkaun = noBtnData.noAkaun;

    // Set Tarikh Mula and Tarikh Akhir
    formData.value.tarikhMula = new Date().toISOString().split('T')[0]; // Set to today's date
    formData.value.tarikhAkhir = new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]; // Set to one year later

    // Set default document
    if (noBtnData.dokumenDefault) {
      // Create a mock File object for the default document
      const defaultFile = new File([''], noBtnData.dokumenDefault, { type: 'application/pdf' });
      formData.value.dokumenSokongan = [defaultFile];
    }
    
    console.log("Updated formData:", formData.value);
  } else {
    console.log("No. Bantuan data found for value:", value);
  }
};

// Handle form submission
const handleSubmit = async () => {
  try {
    // Validate form
    const isValid = await validateForm();
    if (!isValid) return;

    // Prepare form data
    const formDataToSubmit = {
      ...formData.value,
      status: "Dalam Semakan",
      tarikhTuntutan: new Date().toISOString(),
    };

    // Submit form data
    console.log("Submitting form:", formDataToSubmit);
    // Add API call here

    // Show success message
    await $swal.fire({
      icon: 'success',
      title: 'Berjaya!',
      text: 'Permohonan tuntutan anda telah berjaya dihantar',
      confirmButtonText: 'OK'
    });
    navigateTo('/BF-BTN/tuntutan-dengan-siasatan/senarai-tuntutan');
  } catch (error) {
    console.error("Error submitting form:", error);
    // Show error message
  }
};

// Handle save as draft
const handleSaveDraft = async () => {
  try {
    // Prepare draft data
    const draftData = {
      ...formData.value,
      status: "Draf",
      tarikhTuntutan: new Date().toISOString(),
    };

    // Save draft
    console.log("Saving draft:", draftData);
    // Add API call here

    // Show success message
    await $swal.fire({
      icon: 'success',
      title: 'Berjaya!',
      text: 'Permohonan tuntutan anda telah berjaya disimpan sebagai "Draf"',
      confirmButtonText: 'OK'
    });
    navigateTo('/BF-BTN/tuntutan-dengan-siasatan/senarai-tuntutan');
  } catch (error) {
    console.error("Error saving draft:", error);
    // Show error message
  }
};

// Form validation
const validateForm = async () => {
  // Add form validation logic here
  return true;
};

// Populate form data from session (mock example)
const populateFormDataFromSession = () => {
  // Here you would typically fetch user data from a session or API
  formData.value.namaPemohon = "John Doe"; // Replace with actual session data
  formData.value.noPengenalan = "123456-78-9012"; // Replace with actual session data
  formData.value.emailPemohon = "john.doe@example.com"; // Replace with actual session data
  formData.value.noTelefonPemohon = "012-3456789"; // Replace with actual session data
};

// Call the function to populate data on component mount
populateFormDataFromSession();

const guaranteeLetters = ref([
  /*{
    glNo: 'GL-001',
    diNo: 'DI-001',
    createdDate: '15/01/2025',
    penerimaBayaran: 'INSTITUSI A',
    status: 'AKTIF',
    bulan: 'FEB',
    tahun: '2025',
    amaun: '5000.00',
    balance: '0.00',
  }, */
  {
    glNo: 'GL-002',
    diNo: 'DI-002',
    createdDate: '15/01/2025',
    penerimaBayaran: 'VENDOR B',
    status: 'AKTIF',
    bulan: 'MAC',
    tahun: '2025',
    amaun: '1500.00',
    balance: '0.00',
  },
]);

const showInvoiceModal = ref(false);
const newInvoice = ref({
  invoiceNo: '',
  noInvoisPelanggan: '',
  tajuk: '',
  bulan: '',
  tahun: '',
  catatan: '',
  penerimaBayaran: '',
  mop: '',
  namaPenerima: '',
  bank: '',
  noAkaun: '',
  tarikhJangkaanPembayaran: '',
  tarikhDicipta: '',
  amaun: '',
  semester: '', // New field
  cgpa: '', // New field
  lampiran: null, // New field
});

// Function to open the invoice modal
const openInvoiceModal = (glNo) => {
  newInvoice.value.glNo = glNo; // Set GL No for the new invoice
  showInvoiceModal.value = true; // Show the modal
};

</script>

<style lang="scss" scoped>
// Add any additional styles here
</style>