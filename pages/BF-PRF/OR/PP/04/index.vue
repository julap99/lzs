<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <div class="flex items-center justify-between mt-6 mb-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Pengesahan Pendaftaran Organisasi</h1>
        <p class="text-sm text-gray-500">No. Rujukan: ORG{{ applicationData.refNumber }}</p>
      </div>
      <rs-badge :variant="getStatusBadgeVariant()">{{ applicationData.status }}</rs-badge>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left Content -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Maklumat Permohonan -->
        <rs-card>
          <template #header>
            <h2 class="text-md font-semibold text-gray-900">Maklumat Permohonan</h2>
          </template>
          <template #body>
            <div class="space-y-4">
              <FormKit type="text" label="Tarikh Permohonan" :value="applicationData.applicationDate" disabled />
              <FormKit type="text" label="Jenis Organisasi" :value="applicationData.organizationType" disabled />
            </div>
          </template>
        </rs-card>

        <!-- Maklumat Organisasi -->
        <rs-card>
          <template #header>
            <h2 class="text-md font-semibold text-gray-900">Maklumat Organisasi</h2>
          </template>
          <template #body>
            <div class="space-y-4">
              <FormKit type="text" label="Nama Organisasi" :value="applicationData.organizationName" disabled />
              <FormKit type="text" label="No. Pendaftaran" :value="applicationData.registrationNumber" disabled />
              <FormKit type="text" label="Email" :value="applicationData.email" disabled />
            </div>
          </template>
        </rs-card>

        <!-- Alamat -->
        <rs-card>
          <template #header>
            <h2 class="text-md font-semibold text-gray-900">Alamat</h2>
          </template>
          <template #body>
            <div class="space-y-4">
              <FormKit type="text" label="Alamat" :value="applicationData.address" disabled />
              <FormKit type="text" label="Bandar / Poskod" :value="`${applicationData.city} - ${applicationData.postcode}`" disabled />
              <FormKit type="text" label="Negeri" :value="applicationData.state" disabled />
            </div>
          </template>
        </rs-card>

        <!-- Maklumat Pegawai Dihubungi -->
        <rs-card>
          <template #header>
            <h2 class="text-md font-semibold text-gray-900">Maklumat Pegawai Dihubungi</h2>
          </template>
          <template #body>
            <div class="space-y-4">
              <FormKit type="text" label="Nama Pegawai" :value="applicationData.contactPerson" disabled />
              <FormKit type="text" label="Telefon" :value="applicationData.contactPhone" disabled />
              <FormKit type="text" label="Email" :value="applicationData.contactEmail" disabled />
            </div>
          </template>
        </rs-card>

        <!-- Dokumen Sokongan -->
        <rs-card>
          <template #header>
            <h2 class="text-md font-semibold text-gray-900">Dokumen Sokongan</h2>
          </template>
          <template #body>
            <ul class="divide-y divide-gray-200">
              <li v-for="(doc, index) in applicationData.documents" :key="index" class="py-4 flex items-center justify-between">
                <div class="flex items-center">
                  <Icon name="mdi:file-document-outline" class="text-blue-600 mr-3" size="1.25rem" />
                  <div>
                    <p class="font-medium text-gray-900">{{ doc.name }}</p>
                    <p class="text-sm text-gray-500">{{ doc.size }}</p>
                  </div>
                </div>
                <rs-button variant="secondary-outline" size="sm">
                  <Icon name="mdi:download" size="1rem" class="mr-1" /> Muat Turun
                </rs-button>
              </li>
            </ul>
          </template>
        </rs-card>
      </div>

      <!-- Sidebar Pengesahan -->
      <div class="lg:col-span-1 space-y-6">
        <rs-card class="sticky top-6">
          <template #header>
            <h2 class="text-md font-semibold text-gray-900">Keputusan Pengesahan</h2>
          </template>
          <template #body>
            <FormKit type="form" :actions="false" @submit="handleApprovalSubmit">
              <div class="grid grid-cols-1 gap-6">
                <FormKit
                  type="radio"
                  name="approvalStatus"
                  label="Status Pengesahan"
                  validation="required"
                  :options="[
                    { label: 'Lulus', value: 'approved' },
                    { label: 'Tidak Lulus', value: 'rejected' }
                  ]"
                  v-model="approvalData.status"
                  :validation-messages="{ required: 'Status pengesahan adalah wajib' }"
                />

                <FormKit
                  v-if="approvalData.status === 'rejected'"
                  type="textarea"
                  name="justification"
                  label="Justifikasi Penolakan"
                  validation="required"
                  placeholder="Sila nyatakan sebab penolakan permohonan ini"
                  v-model="approvalData.justification"
                  :validation-messages="{ required: 'Justifikasi diperlukan untuk penolakan' }"
                />
              </div>

              <div class="mt-6 flex justify-end gap-4">
                <rs-button variant="secondary-outline" @click="goBack">Kembali</rs-button>
                <rs-button variant="primary" type="submit" :disabled="processing">
                  <template v-if="processing">
                    <Icon name="eos-icons:loading" class="animate-spin mr-1" size="1rem" /> Memproses...
                  </template>
                  <template v-else>
                    <Icon name="material-symbols:check-circle" class="mr-1" size="1rem" /> Hantar Keputusan
                  </template>
                </rs-button>
              </div>
            </FormKit>
          </template>
        </rs-card>
      </div>
    </div>
  </div>
</template>



<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";

definePageMeta({
  title: "Pengesahan Pendaftaran Organisasi",
});

const toast = useToast();
const router = useRouter();
const processing = ref(false);

const breadcrumb = ref([
  {
    name: "Pengesahan",
    type: "link",
    path: "/BF-PRF/OR/AP/01",
  },
  {
    name: "Pengesahan Pendaftaran Organisasi",
    type: "current",
  },
]);

// Mock application data - in real implementation this would be fetched from API
const applicationData = ref({
  refNumber: "2405001",
  applicationDate: "15 Mei 2025",
  status: "Menunggu Pengesahan",
  organizationType: "Swasta",
  organizationName: "Syarikat Teknologi Maju Sdn Bhd",
  registrationNumber: "200301012345",
  email: "admin@tekmas.com.my",
  address: "No. 123, Jalan Teknologi 3/5",
  city: "Cyberjaya",
  postcode: "63000",
  state: "Selangor",
  contactPerson: "Ahmad Bin Abdullah",
  contactPhone: "012-3456789",
  contactEmail: "ahmad@tekmas.com.my",
  documents: [
    { name: "Sijil Pendaftaran Syarikat", size: "2.4 MB" },
    { name: "Surat Perwakilan Kuasa", size: "1.8 MB" },
    { name: "Laporan Tahunan", size: "5.2 MB" },
    { name: "Penyata Bank", size: "1.1 MB" },
  ],
});

const approvalData = ref({
  status: "",
  justification: "",
});

const getStatusBadgeVariant = () => {
  switch (applicationData.value.status) {
    case "Diluluskan":
      return "success";
    case "Ditolak":
      return "danger";
    case "Menunggu Pengesahan":
      return "warning";
    default:
      return "info";
  }
};

const handleApprovalSubmit = async () => {
  // Validate justification if rejection
  if (
    approvalData.value.status === "rejected" &&
    !approvalData.value.justification
  ) {
    return;
  }

  processing.value = true;

  // Simulate API call to submit approval decision
  try {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Update application status based on approval decision
    if (approvalData.value.status === "approved") {
      applicationData.value.status = "Diluluskan";

      toast.success("Permohonann telah berjaya diluluskan");
    } else {
      applicationData.value.status = "Ditolak";

      toast.success("Keputusan penolakan telah direkodkan");
    }

    // In real implementation, we would redirect to a list page after a short delay
    setTimeout(() => {
      processing.value = false;
      goBack();
    }, 1000);
  } catch (error) {
    processing.value = false;
    showErrorNotification("Ralat semasa memproses keputusan");
  }
};

const showErrorNotification = (message) => {
  // In real implementation, this would show a toast notification
  console.error("Error:", message);
};

const goBack = () => {
  // Navigate back to dashboard
  router.push("/BF-PRF/OR/PP");
};
</script>
