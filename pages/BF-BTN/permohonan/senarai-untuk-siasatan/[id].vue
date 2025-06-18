<template>
  <div class="min-h-screen">
    <div class="">
      <LayoutsBreadcrumb :items="breadcrumb" />

      <!-- Page Header -->
      <div class="mt-6 mb-8">
        <div
          class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 class="text-2xl font-bold text-gray-900">
              Semakan & Kemaskini Permohonan
            </h1>
            <p class="mt-1 text-sm text-gray-600">
              Semak maklumat permohonan dan kemaskini penilaian awal
            </p>
          </div>
          <rs-badge
            v-if="formData.statusPermohonan"
            :variant="getStatusVariant(formData.statusPermohonan)"
            class="text-sm px-4 py-2"
          >
            {{ getStatusText(formData.statusPermohonan) }}
          </rs-badge>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Section 1: Maklumat Permohonan (Read-only) -->
          <rs-card class="shadow-sm border-0 bg-white">
            <template #header>
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div
                    class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"
                  >
                    <Icon name="ph:user-circle" class="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-gray-900">
                    Maklumat Permohonan
                  </h2>
                  <p class="text-sm text-gray-500">
                    Butiran pemohon dan status permohonan
                  </p>
                </div>
              </div>
            </template>

            <template #body>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-1">
                  <label class="text-sm font-medium text-gray-700"
                    >ID Permohonan</label
                  >
                  <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                    <span class="text-sm font-mono text-gray-900">{{
                      formData.idPermohonan
                    }}</span>
                  </div>
                </div>

                <div class="space-y-1">
                  <label class="text-sm font-medium text-gray-700"
                    >Nama Pemohon</label
                  >
                  <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                    <span class="text-sm text-gray-900">{{
                      formData.namaPemohon
                    }}</span>
                  </div>
                </div>

                <div class="space-y-1">
                  <label class="text-sm font-medium text-gray-700"
                    >Jenis Bantuan</label
                  >
                  <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                    <span class="text-sm text-gray-900">{{
                      formData.jenisBantuan
                    }}</span>
                  </div>
                </div>

                <div class="space-y-1">
                  <label class="text-sm font-medium text-gray-700"
                    >SEGERA</label
                  >
                  <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                    <input 
                      type="checkbox" 
                      :checked="formData.segera" 
                      disabled 
                      class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span class="ml-2 text-sm text-gray-900">
                      {{ formData.segera ? 'Ya' : 'Tidak' }}
                    </span>
                  </div>
                </div>

                <div class="space-y-1">
                  <label class="text-sm font-medium text-gray-700"
                    >Tarikh Permohonan</label
                  >
                  <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                    <span class="text-sm text-gray-900">{{
                      formData.tarikhPermohonan
                    }}</span>
                  </div>
                </div>

                <div class="space-y-1">
                  <label class="text-sm font-medium text-gray-700"
                    >Status Permohonan</label
                  >
                  <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                    <rs-badge
                      :variant="getStatusVariant(formData.statusPermohonan)"
                      class="text-sm"
                    >
                      {{ getStatusText(formData.statusPermohonan) }}
                    </rs-badge>
                  </div>
                </div>
              </div>
            </template>
          </rs-card>

          <!-- Section 2: Semakan Permohonan (Read-only) -->
          <rs-card class="shadow-sm border-0 bg-white">
            <template #header>
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div
                    class="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center"
                  >
                    <Icon name="ph:file-text" class="w-6 h-6 text-indigo-600" />
                  </div>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-gray-900">
                    Semakan Permohonan
                  </h2>
                  <p class="text-sm text-gray-500">
                    Butiran lengkap permohonan
                  </p>
                </div>
              </div>
            </template>

            <template #body>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-1">
                  <label class="text-sm font-medium text-gray-700"
                    >Nama Pemohon</label
                  >
                  <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                    <span class="text-sm text-gray-900">{{
                      permohonanData.namaPemohon
                    }}</span>
                  </div>
                </div>

                <div class="space-y-1">
                  <label class="text-sm font-medium text-gray-700"
                    >No IC</label
                  >
                  <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                    <span class="text-sm font-mono text-gray-900">{{
                      permohonanData.noIc
                    }}</span>
                  </div>
                </div>

                <div class="space-y-1 md:col-span-2">
                  <label class="text-sm font-medium text-gray-700"
                    >Alamat</label
                  >
                  <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                    <span class="text-sm text-gray-900">{{
                      permohonanData.alamat
                    }}</span>
                  </div>
                </div>

                <div class="space-y-1">
                  <label class="text-sm font-medium text-gray-700"
                    >Jenis Bantuan</label
                  >
                  <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                    <span class="text-sm text-gray-900">{{
                      permohonanData.jenisBantuan
                    }}</span>
                  </div>
                </div>

                <div class="space-y-1">
                  <label class="text-sm font-medium text-gray-700"
                    >Kaedah Pembayaran</label
                  >
                  <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                    <span class="text-sm text-gray-900">{{
                      permohonanData.kaedahPembayaran
                    }}</span>
                  </div>
                </div>

                <div class="space-y-1">
                  <label class="text-sm font-medium text-gray-700"
                    >Jumlah Bantuan</label
                  >
                  <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                    <span class="text-sm font-medium text-gray-900">
                      RM {{ permohonanData.jumlahBantuan?.toLocaleString() }}
                    </span>
                  </div>
                </div>

                <div class="space-y-1 md:col-span-2">
                  <label class="text-sm font-medium text-gray-700"
                    >Keterangan Permohonan</label
                  >
                  <div class="mt-1 p-3 bg-gray-50 rounded-lg border">
                    <span class="text-sm text-gray-900">{{
                      permohonanData.keterangan
                    }}</span>
                  </div>
                </div>
              </div>
            </template>
          </rs-card>

          <!-- Section 3: Semakan Dokumen Sokongan (Form) -->
          <rs-card class="shadow-sm border-0 bg-white">
            <template #header>
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div
                    class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center"
                  >
                    <Icon name="ph:folder-open" class="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-gray-900">
                    Semakan Dokumen Sokongan
                  </h2>
                  <p class="text-sm text-gray-500">
                    Semak status dan berikan catatan untuk setiap dokumen
                  </p>
                </div>
              </div>
            </template>

            <template #body>
              <div class="space-y-4">
                <div
                  v-for="(dokumen, index) in dokumenList"
                  :key="index"
                  class="border border-gray-200 rounded-lg p-4 bg-gray-50"
                >
                  <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <!-- Dokumen Info -->
                    <div class="space-y-2">
                      <h4 class="font-medium text-gray-900">
                        {{ dokumen.jenis }}
                      </h4>
                      <div class="flex items-center space-x-2">
                        <rs-button
                          size="xs"
                          variant="primary-outline"
                          @click="previewDocument(dokumen)"
                        >
                          <Icon name="ph:eye" class="w-4 h-4 mr-1" />
                          Preview
                        </rs-button>
                        <rs-button
                          size="xs"
                          variant="success-outline"
                          @click="downloadDocument(dokumen)"
                        >
                          <Icon name="ph:download" class="w-4 h-4 mr-1" />
                          Muat Turun
                        </rs-button>
                      </div>
                    </div>

                    <!-- Status Dropdown -->
                    <div class="space-y-2">
                      <label class="text-sm font-medium text-gray-700">
                        Status Dokumen
                      </label>
                      <FormKit
                        type="select"
                        :options="statusDokumenOptions"
                        v-model="dokumen.status"
                        :classes="{
                          input: 'text-sm'
                        }"
                      />
                    </div>

                    <!-- Catatan Pegawai -->
                    <div class="space-y-2">
                      <label class="text-sm font-medium text-gray-700">
                        Catatan Pegawai
                        <span v-if="formData.segera" class="text-red-500">*</span>
                      </label>
                      <FormKit
                        type="textarea"
                        v-model="dokumen.catatan"
                        rows="3"
                        :validation="formData.segera ? 'required' : ''"
                        :classes="{
                          input: 'text-sm'
                        }"
                        placeholder="Masukkan catatan..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </rs-card>
        </div>

        <!-- Sidebar - Section 4: Kemaskini Permohonan -->
        <div class="lg:col-span-1 space-y-6">
          <rs-card class="shadow-sm border-0 bg-white sticky top-6">
            <template #header>
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <div
                    class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center"
                  >
                    <Icon
                      name="ph:clipboard-text"
                      class="w-6 h-6 text-purple-600"
                    />
                  </div>
                </div>
                <div>
                  <h2 class="text-lg font-semibold text-gray-900">
                    Kemaskini Permohonan
                  </h2>
                  <p class="text-sm text-gray-500">Penilaian dan tindakan</p>
                </div>
              </div>
            </template>

            <template #body>
              <FormKit
                type="form"
                :actions="false"
                @submit="handleSubmit"
                v-model="updateData"
              >
                <div class="space-y-6">
                  <!-- Catatan Penilaian Awal -->
                  <FormKit
                    type="textarea"
                    name="catatanPenilaianAwal"
                    label="Catatan Penilaian Awal"
                    placeholder="Masukkan catatan penilaian awal..."
                    rows="4"
                    v-model="updateData.catatanPenilaianAwal"
                    help="Catatan ini adalah pilihan"
                  />

                  <!-- Kaedah Siasatan -->
                  <FormKit
                    type="select"
                    name="kaedahSiasatan"
                    label="Kaedah Siasatan"
                    :options="kaedahSiasatanOptions"
                    placeholder="Pilih kaedah siasatan"
                    v-model="updateData.kaedahSiasatan"
                    validation="required"
                  />

                  <!-- Tarikh Lawatan -->
                  <FormKit
                    type="date"
                    name="tarikhLawatan"
                    label="Tarikh Lawatan"
                    v-model="updateData.tarikhLawatan"
                    validation="date_after:today"
                    :validation-messages="{
                      date_after: 'Tarikh lawatan mesti selepas hari ini'
                    }"
                  />

                  <!-- Masa Lawatan -->
                  <FormKit
                    type="select"
                    name="masaLawatan"
                    label="Masa Lawatan"
                    :options="masaLawatanOptions"
                    placeholder="Pilih masa lawatan"
                    v-model="updateData.masaLawatan"
                  />

                  <!-- Status Pengesahan Lawatan -->
                  <FormKit
                    type="select"
                    name="statusPengesahanLawatan"
                    label="Status Pengesahan Lawatan"
                    :options="statusPengesahanOptions"
                    placeholder="Pilih status pengesahan"
                    v-model="updateData.statusPengesahanLawatan"
                    validation="required"
                  />

                  <!-- Status Permohonan -->
                  <FormKit
                    type="select"
                    name="statusPermohonan"
                    label="Status Permohonan"
                    :options="statusPermohonanOptions"
                    placeholder="Pilih status permohonan"
                    v-model="updateData.statusPermohonan"
                    validation="required"
                  />

                  <!-- Section 5: Action Buttons -->
                  <div class="space-y-3 pt-4 border-t">
                    <rs-button
                      variant="primary"
                      @click="handleSaveAndUpdateStatus"
                      :disabled="processing"
                      :loading="processing"
                      class="w-full !py-3 text-sm font-medium"
                    >
                      <Icon name="ph:floppy-disk" class="w-5 h-5 mr-2" />
                      Simpan & Kemaskini Status
                    </rs-button>

                    <rs-button
                      variant="primary-outline"
                      @click="handleCancel"
                      class="w-full !py-3 text-sm font-medium"
                    >
                      <Icon name="ph:arrow-left" class="w-5 h-5 mr-2" />
                      Batal
                    </rs-button>
                  </div>
                </div>
              </FormKit>
            </template>
          </rs-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";

const route = useRoute();
const router = useRouter();
const toast = useToast();
const processing = ref(false);

definePageMeta({
  title: "Semakan & Kemaskini Permohonan",
});

const breadcrumb = ref([
  {
    name: "Permohonan Bantuan",
    type: "link",
    path: "/BF-BTN/permohonan/senarai",
  },
  {
    name: "Untuk Siasatan",
    type: "link",
    path: "/BF-BTN/permohonan/senarai-untuk-siasatan",
  },
  {
    name: "Semakan & Kemaskini",
    type: "current",
    path: `/BF-BTN/permohonan/senarai-untuk-siasatan/${route.params.id}`,
  },
]);

// Section 1: Maklumat Permohonan data
const formData = ref({
  idPermohonan: "",
  namaPemohon: "",
  jenisBantuan: "",
  segera: false,
  tarikhPermohonan: "",
  statusPermohonan: "",
});

// Section 2: Semakan Permohonan data
const permohonanData = ref({
  namaPemohon: "",
  alamat: "",
  noIc: "",
  jenisBantuan: "",
  kaedahPembayaran: "",
  jumlahBantuan: 0,
  keterangan: "",
});

// Section 3: Dokumen list
const dokumenList = ref([
  {
    jenis: "Geran Tanah",
    filename: "geran_tanah.pdf",
    status: "",
    catatan: "",
  },
  {
    jenis: "Carian Rasmi Tanah",
    filename: "carian_rasmi.pdf",
    status: "",
    catatan: "",
  },
  {
    jenis: "Akuan Sumpah",
    filename: "akuan_sumpah.pdf",
    status: "",
    catatan: "",
  },
]);

// Section 4: Update data
const updateData = ref({
  catatanPenilaianAwal: "",
  kaedahSiasatan: "",
  tarikhLawatan: "",
  masaLawatan: "",
  statusPengesahanLawatan: "",
  statusPermohonan: "",
});

// Dropdown options
const statusDokumenOptions = ref([
  { label: "Lengkap", value: "lengkap" },
  { label: "Tidak Lengkap", value: "tidak_lengkap" },
]);

const kaedahSiasatanOptions = ref([
  { label: "Telefon", value: "telefon" },
  { label: "Semak Dokumen Sahaja", value: "dokumen" },
  { label: "Lawatan", value: "lawatan" },
]);

const statusPengesahanOptions = ref([
  { label: "Sah", value: "sah" },
  { label: "Belum Sah", value: "belum_sah" },
]);

const statusPermohonanOptions = ref([
  { label: "Menunggu Siasatan Lapangan", value: "menunggu_siasatan" },
  { label: "Lawatan Dijadualkan", value: "lawatan_dijadualkan" },
]);

// Generate time options (9:00 - 18:00, every 30 minutes)
const masaLawatanOptions = computed(() => {
  const times = [];
  for (let hour = 9; hour <= 18; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      if (hour === 18 && minute > 0) break; // Stop at 18:00
      const startTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      const endHour = minute === 30 ? hour + 1 : hour;
      const endMinute = minute === 30 ? 0 : minute + 30;
      const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
      times.push({
        label: `${startTime} - ${endTime}`,
        value: `${startTime}-${endTime}`,
      });
    }
  }
  return times;
});

// Methods
const getStatusVariant = (status) => {
  const variants = {
    baru: "info",
    dalam_semakan: "warning",
    tidak_lengkap: "danger",
    lengkap: "success",
    menunggu_siasatan: "warning",
    lawatan_dijadualkan: "info",
  };
  return variants[status?.toLowerCase()] || "default";
};

const getStatusText = (status) => {
  const statusMap = {
    baru: "Baru",
    dalam_semakan: "Dalam Semakan",
    tidak_lengkap: "Tidak Lengkap",
    lengkap: "Lengkap",
    menunggu_siasatan: "Menunggu Siasatan Lapangan",
    lawatan_dijadualkan: "Lawatan Dijadualkan",
  };
  return statusMap[status?.toLowerCase()] || status;
};

const previewDocument = (dokumen) => {
  // Implement document preview functionality
  console.log("Previewing document:", dokumen);
  // This could open a modal or navigate to a document viewer
};

const downloadDocument = (dokumen) => {
  // Implement document download functionality
  console.log("Downloading document:", dokumen);
  // This would trigger a file download
};

const handleSaveAndUpdateStatus = async () => {
  try {
    processing.value = true;
    
    // Validate required fields based on SEGERA status
    if (formData.value.segera) {
      const incompleteDocs = dokumenList.value.filter(doc => !doc.catatan.trim());
      if (incompleteDocs.length > 0) {
        toast.error("Catatan pegawai wajib diisi untuk semua dokumen kerana permohonan ini bertanda SEGERA");
        return;
      }
    }
    
    // Prepare data for API
    const payload = {
      ...updateData.value,
      dokumen: dokumenList.value.map(doc => ({
        jenis: doc.jenis,
        status: doc.status,
        catatan: doc.catatan,
      })),
    };
    
    // Implement API call to save updates and trigger workflow
    console.log("Saving data:", payload);
    
    toast.success("Kemaskini telah disimpan dan status telah dikemaskini");
    
    // Navigate back to list after successful save
    router.push("/BF-BTN/permohonan/senarai-untuk-siasatan");
    
  } catch (error) {
    toast.error("Ralat semasa menyimpan kemaskini");
    console.error(error);
  } finally {
    processing.value = false;
  }
};

const handleCancel = () => {
  router.push("/BF-BTN/permohonan/senarai-untuk-siasatan");
};

// Fetch application data on mount
onMounted(async () => {
  try {
    // Implement API call to fetch application data
    // This is mock data for now
    formData.value = {
      idPermohonan: route.params.id,
      namaPemohon: "Ahmad bin Abdullah",
      jenisBantuan: "Bantuan Pendidikan",
      segera: true,
      tarikhPermohonan: "15 Nov 2024",
      statusPermohonan: "dalam_semakan",
    };
    
    permohonanData.value = {
      namaPemohon: "Ahmad bin Abdullah",
      alamat: "No. 123, Jalan Merdeka, Taman Sejahtera, 50000 Kuala Lumpur",
      noIc: "880101-12-1234",
      jenisBantuan: "Bantuan Pendidikan",
      kaedahPembayaran: "Transfer Bank",
      jumlahBantuan: 2500,
      keterangan: "Permohonan bantuan untuk yuran pengajian anak di universiti tempatan",
    };
    
  } catch (error) {
    toast.error("Ralat semasa memuatkan data permohonan");
    console.error(error);
  }
});
</script>

<style lang="scss" scoped>
// Custom animations and transitions
.group:hover .group-hover\:text-blue-600 {
  transition: color 0.2s ease-in-out;
}

// Enhanced focus states
.focus\:ring-2:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}

// Table row hover effect
.hover\:bg-gray-50:hover {
  background-color: #f9fafb;
}

// Document card styling
.border-gray-200 {
  border-color: #e5e7eb;
}

.bg-gray-50 {
  background-color: #f9fafb;
}
</style>
