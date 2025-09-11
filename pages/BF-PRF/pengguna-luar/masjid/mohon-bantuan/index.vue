<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Permohonan Bantuan Masjid</h2>
        </div>
      </template>

      <template #body>
        <FormKit
          type="form"
          @submit="handleSubmit"
          :actions="false"
          v-model="formData"
        >
          <!-- Section 1: Maklumat Institusi Masjid (Read-Only) -->
          <div class="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div class="flex">
              <Icon name="ph:building" class="w-5 h-5 text-green-400 mt-0.5" />
              <div class="ml-3">
                <h3 class="text-sm font-medium text-green-800">
                  Maklumat Institusi Masjid
                </h3>
                <p class="mt-1 text-sm text-green-700">
                  <strong>{{ mosqueInstitution.name }}</strong>
                </p>
                <p class="mt-1 text-sm text-green-600">
                  PIC: {{ mosqueInstitution.pic }} ({{ mosqueInstitution.picEmail }})
                </p>
                <p class="mt-1 text-sm text-green-600">
                  Lokasi: {{ mosqueInstitution.location }}
                </p>
              </div>
            </div>
          </div>

          <!-- Section 2: Maklumat Permohonan Bantuan -->
          <div class="mb-8">
            <h3 class="text-lg font-medium mb-4">
              Maklumat Permohonan Bantuan
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit
                type="text"
                name="namaPemohon"
                label="Nama Pemohon"
                :value="mosqueInstitution.pic"
                disabled
              />
              <FormKit
                type="text"
                name="noKadPengenalan"
                label="No. Kad Pengenalan"
                :value="mosqueInstitution.picNoKP"
                disabled
              />
              <FormKit
                type="select"
                name="jenisBantuan"
                label="Jenis Bantuan Dipohon"
                :options="jenisBantuanOptions"
                validation="required"
                :validation-messages="{
                  required: 'Sila pilih jenis bantuan',
                }"
              />
              <FormKit
                type="select"
                name="kategoriBantuan"
                label="Kategori Bantuan"
                :options="kategoriBantuanOptions"
                validation="required"
                :validation-messages="{
                  required: 'Sila pilih kategori bantuan',
                }"
                :disabled="!formData.jenisBantuan"
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
              <FormKit
                type="text"
                name="statusPermohonan"
                label="Status Permohonan"
                value="Diterima"
                disabled
              />
            </div>

            <div class="mt-4">
              <FormKit
                type="textarea"
                name="keteranganPermohonan"
                label="Keterangan Permohonan"
                placeholder="Sila nyatakan keperluan bantuan secara terperinci..."
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
                    Surat Permohonan Rasmi
                  </label>
                  <FormKit
                    type="file"
                    name="suratPermohonan"
                    accept=".pdf,.jpg,.jpeg,.png"
                    validation="required"
                    :validation-messages="{
                      required: 'Sila muat naik surat permohonan rasmi',
                    }"
                    help="Format yang diterima: PDF, JPG, JPEG, PNG"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Minit Mesyuarat Jawatankuasa Masjid
                  </label>
                  <FormKit
                    type="file"
                    name="minitMesyuarat"
                    accept=".pdf,.jpg,.jpeg,.png"
                    validation="required"
                    :validation-messages="{
                      required: 'Sila muat naik minit mesyuarat',
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
          <p class="mb-2">Permohonan bantuan masjid anda telah berjaya dihantar.</p>
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
            Kembali ke Dashboard
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
          Adakah anda pasti untuk menghantar permohonan bantuan masjid ini?
        </p>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

definePageMeta({
  title: "Permohonan Bantuan Masjid",
  description: "Halaman untuk memohon bantuan masjid",
});

const router = useRouter();
const formData = ref({});
const showSuccessModal = ref(false);
const showConfirmationModal = ref(false);
const nomorRujukan = ref("");

// Mosque institution data
const mosqueInstitution = ref({
  id: "MASJID_NEGERI_SELANGOR_001",
  name: "Masjid Negeri Selangor",
  type: "masjid",
  location: "Shah Alam, Selangor",
  pic: "Ahmad bin Abdullah",
  picEmail: "ahmad.abdullah@masjidnegeri.gov.my",
  picNoKP: "901231012345",
});

// Mosque-specific aid options
const jenisBantuanOptions = [
  { label: "-- Pilih --", value: "", disabled: true },
  { label: "Pembaikan & Penyelenggaraan", value: "pembaikan" },
  { label: "Peralatan & Kelengkapan", value: "peralatan" },
  { label: "Program & Aktiviti", value: "program" },
  { label: "Infrastruktur", value: "infrastruktur" },
];

const kategoriBantuanOptions = computed(() => {
  if (!formData.value.jenisBantuan) {
    return [{ label: "-- Pilih --", value: "", disabled: true }];
  }

  const options = {
    pembaikan: [
      { label: "Tukar Carpet Masjid", value: "tukar-carpet" },
      { label: "Pembaikan Sistem Audio", value: "audio" },
      { label: "Pembaikan Sistem Pencahayaan", value: "pencahayaan" },
      { label: "Pembaikan Sistem Pengudaraan", value: "pengudaraan" },
      { label: "Pembaikan Bumbung", value: "bumbung" },
    ],
    peralatan: [
      { label: "Peralatan Audio Visual", value: "audio-visual" },
      { label: "Peralatan Dapur", value: "dapur" },
      { label: "Peralatan Kebersihan", value: "kebersihan" },
      { label: "Peralatan Keselamatan", value: "keselamatan" },
    ],
    program: [
      { label: "Program Pendidikan", value: "pendidikan" },
      { label: "Program Sosial", value: "sosial" },
      { label: "Program Keagamaan", value: "keagamaan" },
    ],
    infrastruktur: [
      { label: "Pembinaan Ruang Tambahan", value: "ruang-tambahan" },
      { label: "Naik Taraf Kemudahan", value: "naik-taraf" },
      { label: "Sistem ICT", value: "ict" },
    ],
  };

  const categoryOptions = options[formData.value.jenisBantuan] || [];
  return [
    { label: "-- Pilih --", value: "", disabled: true },
    ...categoryOptions,
  ];
});

// Breadcrumb items
const breadcrumb = ref([
  {
    name: "Pengguna Luar",
    type: "link",
    path: "/BF-PRF/pengguna-luar/dashboard",
  },
  {
    name: "Masjid",
    type: "link",
    path: "/BF-PRF/pengguna-luar/masjid",
  },
  {
    name: "Mohon Bantuan",
    type: "current",
    path: "/BF-PRF/pengguna-luar/masjid/mohon-bantuan",
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
    nomorRujukan.value = `MASJID-${Date.now()}`;
    showConfirmationModal.value = false;
    showSuccessModal.value = true;
  } catch (error) {
    console.error("Error submitting form:", error);
    // TODO: Show error message to user
  }
};

// Cancel handler
const handleCancel = () => {
  router.push("/BF-PRF/pengguna-luar/dashboard");
};

// View status handler
const handleViewStatus = () => {
  showSuccessModal.value = false;
  router.push("/BF-PRF/pengguna-luar/dashboard");
};
</script>

<style lang="scss" scoped>
// Add any custom styles here
</style>
