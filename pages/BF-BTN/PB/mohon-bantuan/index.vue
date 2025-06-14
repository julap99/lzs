<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
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
          <!-- Section 1: Maklumat Profil Pemohon (Read-Only) -->
          <div class="mb-8">
            <h3 class="text-lg font-medium mb-4">Maklumat Profil Pemohon</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit
                type="select"
                name="kategori_pemohon"
                label="Kategori Pemohon"
                :options="[
                  { label: '-- Pilih --', value: '', disabled: true },
                  { label: 'Individu', value: 'individu' },
                  { label: 'Institusi', value: 'institusi' }
                ]"
                validation="required"
                :validation-messages="{
                  required: 'Sila pilih kategori pemohon',
                }"
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
                name="noKadPengenalan"
                label="No. Kad Pengenalan"
                :value="userProfile.noKadPengenalan"
                disabled
              />
              <FormKit
                v-if="isStaff"
                type="text"
                name="statusHousehold"
                label="Status Household"
                :value="userProfile.statusHousehold"
                disabled
              />
              <FormKit
                v-if="isStaff"
                type="text"
                name="statusIndividu"
                label="Status Individu"
                :value="userProfile.statusIndividu"
                disabled
              />
            </div>
          </div>

          <!-- Section 2: Maklumat Permohonan Bantuan -->
          <div class="mb-8">
            <h3 class="text-lg font-medium mb-4">
              Maklumat Permohonan Bantuan
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CustomSelect
                v-model="formData.jenisBantuan"
                :options="jenisBantuanOptions"
                label="Jenis Bantuan Dipohon"
                search-placeholder="Cari jenis bantuan..."
                :disabled="false"
              />
              <FormKit
                type="select"
                name="aidProduct"
                label="Aid Product"
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
                type="select"
                name="productPackage"
                label="Product Package"
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
                type="text"
                name="statusPermohonan"
                label="Status Permohonan"
                value="Diterima"
                disabled
              />
              <FormKit
                type="select"
                name="kaedahPembayaran"
                label="Kaedah Pembayaran"
                :options="kaedahPembayaranOptions"
                validation="required"
                :validation-messages="{
                  required: 'Sila pilih kaedah pembayaran',
                }"
                :disabled="!isStaff"
              />
              <FormKit
                type="number"
                name="jumlahBantuan"
                label="Jumlah Bantuan Dipohon (RM)"
                validation="required|number|min:0"
                :validation-messages="{
                  required: 'Sila masukkan jumlah bantuan',
                  number: 'Jumlah bantuan mesti dalam bentuk nombor',
                  min: 'Jumlah bantuan tidak boleh negatif',
                }"
              />
            </div>

            <div class="mt-4">
              <FormKit
                type="textarea"
                name="keteranganPermohonan"
                label="Keterangan Permohonan"
                validation="required"
                :validation-messages="{
                  required: 'Sila masukkan keterangan permohonan',
                }"
                :rows="4"
              />
            </div>

            <div class="mt-4">
              <h4 class="text-sm font-medium text-gray-700 mb-2">Dokumen Sokongan</h4>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Dokumen Geran
                  </label>
                  <FormKit
                    type="file"
                    name="dokumenGeran"
                    accept=".pdf,.jpg,.jpeg,.png"
                    validation="required"
                    :validation-messages="{
                      required: 'Sila muat naik dokumen geran',
                    }"
                    help="Format yang diterima: PDF, JPG, JPEG, PNG"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Dokumen Carian
                  </label>
                  <FormKit
                    type="file"
                    name="dokumenCarian"
                    accept=".pdf,.jpg,.jpeg,.png"
                    validation="required"
                    :validation-messages="{
                      required: 'Sila muat naik dokumen carian',
                    }"
                    help="Format yang diterima: PDF, JPG, JPEG, PNG"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Dokumen Sokongan Lain (Jika Ada)
                  </label>
                  <FormKit
                    type="file"
                    name="dokumenSokonganLain"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    help="Format yang diterima: PDF, JPG, JPEG, PNG"
                  />
                </div>
              </div>
            </div>
          </div>

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
});

// Mock staff check - replace with actual auth check
const isStaff = computed(() => false);

// Load the bantuan data from JSON
const bantuanData = ref({});

// Import the bantuan data directly
import bantuanJson from "./Grouped by Aid Code.json";

// Set the bantuan data on component mount
onMounted(() => {
  try {
    bantuanData.value = bantuanJson;
    console.log("Loaded bantuan data:", bantuanData.value);
  } catch (error) {
    console.error("Error loading bantuan data:", error);
  }
});

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
  { label: "E-Wallet", value: "E_WALLET" },
];

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
</script>

<style lang="scss" scoped>
// Add any custom styles here
</style>
