<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <div class="flex justify-between items-start mt-6 mb-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Pengesahan Pendaftaran Recipient</h1>
        <p class="mt-1 text-sm text-gray-600">Semak permohonan organisasi dan berikan keputusan pengesahan.</p>
      </div>
      <rs-badge :variant="getStatusBadgeVariant()">{{ applicationData.status }}</rs-badge>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Kiri: Maklumat Permohonan -->
      <div class="lg:col-span-2 space-y-6">
        <rs-card>
          <template #header>
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Icon name="ph:buildings" class="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 class="text-md font-semibold text-gray-900">Maklumat Permohonan</h2>
                <p class="text-sm text-gray-500">Butiran permohonan dan organisasi</p>
              </div>
            </div>
          </template>
          <template #body>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit type="text" label="No. Rujukan" :value="'ORG' + applicationData.refNumber" disabled />
              <FormKit type="text" label="Tarikh Permohonan" :value="applicationData.applicationDate" disabled />
              <FormKit type="text" label="Jenis Organisasi" :value="applicationData.organizationType" disabled />
              <FormKit type="text" label="Nama Organisasi" :value="applicationData.organizationName" disabled />
              <FormKit type="text" label="No. Pendaftaran" :value="applicationData.registrationNumber" disabled />
              <FormKit type="text" label="Email Organisasi" :value="applicationData.email" disabled />
            </div>
          </template>
        </rs-card>

        <rs-card>
          <template #header>
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Icon name="ph:map-pin" class="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <h2 class="text-md font-semibold text-gray-900">Alamat dan Hubungan</h2>
              </div>
            </div>
          </template>
          <template #body>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit type="text" label="Alamat" :value="applicationData.address" disabled />
              <FormKit type="text" label="Bandar" :value="applicationData.city" disabled />
              <FormKit type="text" label="Poskod" :value="applicationData.postcode" disabled />
              <FormKit type="text" label="Negeri" :value="applicationData.state" disabled />
              <FormKit type="text" label="Nama Pegawai" :value="applicationData.contactPerson" disabled />
              <FormKit type="text" label="No. Telefon" :value="applicationData.contactPhone" disabled />
              <FormKit type="text" label="Email Pegawai" :value="applicationData.contactEmail" disabled />
            </div>
          </template>
        </rs-card>

        <rs-card>
          <template #header>
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Icon name="ph:paperclip" class="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h2 class="text-md font-semibold text-gray-900">Dokumen Sokongan</h2>
              </div>
            </div>
          </template>
          <template #body>
            <ul class="divide-y divide-gray-200">
              <li
                v-for="(doc, index) in applicationData.documents"
                :key="index"
                class="py-4 flex items-center justify-between"
              >
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

      <!-- Kanan: Pengesahan -->
      <div class="lg:col-span-1 space-y-6">
        <rs-card class="sticky top-6">
          <template #header>
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Icon name="ph:check-circle" class="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 class="text-md font-semibold text-gray-900">Maklumat Pengesahan</h2>
              </div>
            </div>
          </template>
          <template #body>
            <FormKit type="form" :actions="false" @submit="handleApprovalSubmit">
              <FormKit
                type="radio"
                name="approvalStatus"
                label="Status Pengesahan"
                validation="required"
                :options="[
                  { label: 'Lulus', value: 'approved' },
                  { label: 'Tidak Lulus', value: 'rejected' },
                ]"
                v-model="approvalData.status"
              />

              <FormKit
                v-if="approvalData.status === 'rejected'"
                type="textarea"
                name="justification"
                label="Justifikasi Penolakan"
                validation="required"
                placeholder="Sila nyatakan sebab penolakan"
                v-model="approvalData.justification"
              />

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
    path: "/BF-PRF/TP/PP/01",
  },
  {
    name: "Pengesahan Pendaftaran Recipient",
    type: "current",
  },
]);

// Mock application data - in real implementation this would be fetched from API
const applicationData = ref({
  refNumber: "2406002",
  applicationDate: "18 Jun 2025",
  status: "Menunggu Pengesahan",
  organizationType: "Third-party (Syarikat)",
  organizationCategory: "Registered", // Atau "Non-Registered"
  organizationStructure: "Induk", // atau "Cawangan"
  organizationName: "Pusat Dialisis Sejahtera",
  registrationNumber: "12345678-X",
  email: "admin@dialisis-sejahtera.my",
  address: "Lot 5, Jalan Rawatan, Taman Sejahtera",
  city: "Shah Alam",
  postcode: "40100",
  state: "Selangor",
  contactPerson: "Dr. Fazira Binti Mohamad",
  contactPhone: "013-9876543",
  contactEmail: "fazira@dialisis-sejahtera.my",
  documents: [
    { name: "Sijil Pendaftaran Syarikat", size: "2.2 MB" },
    { name: "Surat Perakuan LZS", size: "1.5 MB" },
    { name: "Senarai Penerima Manfaat", size: "3.1 MB" },
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
  // Navigate back to applications list
  router.push("/BF-PRF/OR/PP/01");
};
</script>
