<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Edit Tuntutan GL (Draf)</h2>
          <div class="flex gap-2">
            <rs-button
              variant="secondary"
              @click="handleBack"
            >
              <Icon name="material-symbols:arrow-back" class="w-4 h-4 mr-1" />
              Kembali
            </rs-button>
            <rs-button
              variant="danger"
              @click="handleDelete"
            >
              <Icon name="material-symbols:delete" class="w-4 h-4 mr-1" />
              Padam Draf
            </rs-button>
          </div>
        </div>
      </template>

      <template #body>
        <form @submit.prevent="handleSubmit">

          <!-- Section 2: Maklumat Bantuan -->
          <div class="mb-8">
            <h3 class="text-lg font-medium mb-4">Maklumat Bantuan</h3>
            <div class="bg-gray-50 p-4 rounded-lg mb-6">
              <h4 class="text-md font-medium mb-4">Butiran Asas Jenis Bantuan</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormKit
                  v-model="formData.kodBantuan"
                  type="text"
                  label="Kod Bantuan"
                  disabled
                />

                <FormKit
                  v-model="formData.jenisBantuan"
                  type="text"
                  label="Jenis Bantuan"
                  disabled
                />

                <FormKit
                  v-model="formData.bahanBantuan"
                  type="text"
                  label="Bahan Bantuan"
                  disabled
                />

                <FormKit
                  v-model="formData.pakejBantuan"
                  type="text"
                  label="Pakej Bantuan"
                  disabled
                />

                <FormKit
                  v-model="formData.kelayakanBantuan"
                  type="text"
                  label="Kelayakan Bantuan"
                  disabled
                />
              </div>
            </div>
          </div>

          <!-- Section 3: Maklumat Tuntutan -->
          <div class="mb-8">
            <h3 class="text-lg font-medium mb-4">Maklumat Tuntutan</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormKit
                v-model="formData.noGL"
                type="text"
                label="No. GL"
                disabled
              />

              <FormKit
                v-model="formData.amaunTuntutan"
                type="number"
                label="Amaun Tuntutan (RM)"
                validation="required|number|min:0"
                :validation-messages="{
                  required: 'Sila masukkan amaun tuntutan',
                  number: 'Sila masukkan nilai yang sah',
                  min: 'Amaun tidak boleh negatif'
                }"
                step="0.01"
                min="0"
              />

              <FormKit
                v-model="formData.tarikh"
                type="date"
                label="Tarikh"
                validation="required"
                :validation-messages="{
                  required: 'Sila pilih tarikh'
                }"
              />

              <FormKit
                v-model="formData.catatanTambahan"
                type="textarea"
                label="Catatan Tambahan"
                rows="3"
                placeholder="Masukkan catatan tambahan jika perlu..."
              />
            </div>
          </div>

          <!-- Section 4: Muat Naik Dokumen Sokongan -->
          <div class="mb-8">
            <h3 class="text-lg font-medium mb-4">Muat Naik Dokumen Sokongan</h3>
            <div class="grid grid-cols-1 gap-6">
              <FormKit
                v-model="formData.dokumenSokongan"
                type="file"
                label="Upload Dokumen"
                accept=".pdf,.jpg,.jpeg,.png"
                multiple
                validation="required"
                :validation-messages="{
                  required: 'Sila muat naik sekurang-kurangnya satu dokumen sokongan'
                }"
                help="Format yang diterima: PDF, JPG, JPEG, PNG. Saiz maksimum: 5MB. Dokumen default akan dipilih secara automatik berdasarkan GL yang dipilih."
              />
            </div>
          </div>

          <!-- Section 5: Action & Status -->
          <div class="flex justify-end gap-4">
            <rs-button
              type="button"
              variant="secondary"
              @click="handleSaveDraft"
            >
              <Icon name="material-symbols:save" class="w-4 h-4 mr-1" />
              Simpan Draf
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
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useNuxtApp } from "#app";

definePageMeta({
  title: "Edit Tuntutan GL (Draf)",
});

const { $swal } = useNuxtApp();
const route = useRoute();

const breadcrumb = ref([
  {
    name: "Tuntutan dengan Siasatan",
    type: "link",
    path: "/BF-BTN/tuntutan-dengan-siasatan/senarai-tuntutan",
  },
  {
    name: "Senarai Tuntutan",
    type: "link",
    path: "/BF-BTN/tuntutan-dengan-siasatan/senarai-tuntutan",
  },
  {
    name: "Edit Tuntutan Draf",
    type: "current",
    path: `/BF-BTN/tuntutan-dengan-siasatan/senarai-tuntutan/${route.params.id}/view-draf`,
  },
]);

// Form data
const formData = ref({
  noGL: "",
  kodBantuan: "",
  jenisBantuan: "",
  bahanBantuan: "",
  pakejBantuan: "",
  kelayakanBantuan: "",
  amaunTuntutan: "",
  tarikh: "",
  catatanTambahan: "",
  dokumenSokongan: [],
});

// Sample GL options - Replace with actual API call
const glOptions = ref([
  { label: "GL-2025-001 - BANTUAN SUMBANGAN KARPET", value: "GL-2025-001" },
  { label: "GL-2025-002 - BANTUAN PERUBATAN DIALISIS", value: "GL-2025-002" },
]);

// GL data mapping
const glDataMapping = {
  'GL-2025-001': {
    kodBantuan: 'B400',
    jenisBantuan: '(HQ) BANTUAN SUMBANGAN PERALATAN & BINA/BAIKPULIH INSTITUSI AGAMA',
    bahanBantuan: '(HQ) BANTUAN SUMBANGAN PERALATAN INSTITUSI AGAMA',
    pakejBantuan: '(GL) (HQ) BANTUAN SUMBANGAN KARPET INSTITUSI AGAMA',
    kelayakanBantuan: '(GL) (HQ) BANTUAN SUMBANGAN KARPET INSTITUSI AGAMA',
    amaunTuntutan: 5000.00,
    dokumenDefault: 'GL_Bantuan_Sumbangan_Karpet.pdf'
  },
  'GL-2025-002': {
    kodBantuan: 'B103',
    jenisBantuan: '(HQ) BANTUAN PERUBATAN DIALISIS (FAKIR)',
    bahanBantuan: '(HQ) KATEGORI HEMODIALISIS (FAKIR)',
    pakejBantuan: '(GL) (HQ) HEMODIALISIS DAN SUNTIKAN EPO (FAKIR)',
    kelayakanBantuan: '(GL) (HQ) HEMODIALISIS (FAKIR)',
    amaunTuntutan: 1500.00,
    dokumenDefault: 'GL_Bantuan_Perubatan_Dialisis.pdf'
  }
};

// Load existing data on mount
onMounted(async () => {
  await loadTuntutanData();
});

// Load tuntutan data
const loadTuntutanData = async () => {
  try {
    // In real app, fetch data from API based on route.params.id
    const mockData = {
      id: route.params.id,
      noGL: "GL-2025-001",
      amaunTuntutan: 5000.00,
      tarikh: "2024-03-20",
      catatanTambahan: "Catatan tambahan untuk draf ini...",
      dokumenSokongan: []
    };

    // Populate form data
    formData.value = {
      ...formData.value,
      ...mockData
    };

    // Trigger GL change to populate bantuan fields
    await handleGLChange(mockData.noGL);
  } catch (error) {
    console.error("Error loading tuntutan data:", error);
  }
};

// Handle GL selection change
const handleGLChange = async (value) => {
  console.log("handleGLChange triggered with value:", value);
  
  // Reset all bantuan fields first
  formData.value.kodBantuan = '';
  formData.value.jenisBantuan = '';
  formData.value.bahanBantuan = '';
  formData.value.pakejBantuan = '';
  formData.value.kelayakanBantuan = '';
  formData.value.amaunTuntutan = '';
  formData.value.dokumenSokongan = [];
  
  // Auto-populate based on selected GL
  if (value && glDataMapping[value]) {
    const glData = glDataMapping[value];
    console.log("Found GL data:", glData);
    
    // Use nextTick to ensure reactivity
    await nextTick();
    
    formData.value.kodBantuan = glData.kodBantuan;
    formData.value.jenisBantuan = glData.jenisBantuan;
    formData.value.bahanBantuan = glData.bahanBantuan;
    formData.value.pakejBantuan = glData.pakejBantuan;
    formData.value.kelayakanBantuan = glData.kelayakanBantuan;
    formData.value.amaunTuntutan = glData.amaunTuntutan;
    
    // Set default document
    if (glData.dokumenDefault) {
      // Create a mock File object for the default document
      const defaultFile = new File([''], glData.dokumenDefault, { type: 'application/pdf' });
      formData.value.dokumenSokongan = [defaultFile];
    }
    
    console.log("Updated formData:", formData.value);
  } else {
    console.log("No GL data found for value:", value);
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

// Handle delete draft
const handleDelete = async () => {
  try {
    const result = await $swal.fire({
      icon: 'warning',
      title: 'Padam Draf',
      text: 'Adakah anda pasti untuk memadamkan draf ini? Tindakan ini tidak dapat dibatalkan.',
      showCancelButton: true,
      confirmButtonText: 'Ya, Padam',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#dc2626',
    });

    if (result.isConfirmed) {
      // Delete draft logic here
      console.log("Deleting draft:", route.params.id);
      
      await $swal.fire({
        icon: 'success',
        title: 'Berjaya!',
        text: 'Draf telah berjaya dipadamkan',
        confirmButtonText: 'OK'
      });
      navigateTo('/BF-BTN/tuntutan-dengan-siasatan/senarai-tuntutan');
    }
  } catch (error) {
    console.error("Error deleting draft:", error);
  }
};

// Handle back
const handleBack = () => {
  navigateTo('/BF-BTN/tuntutan-dengan-siasatan/senarai-tuntutan');
};

// Form validation
const validateForm = async () => {
  // Add form validation logic here
  return true;
};
</script>

<style lang="scss" scoped>
// Add any additional styles here
</style> 