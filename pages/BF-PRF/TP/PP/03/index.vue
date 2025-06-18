<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Kelulusan Pendaftaran Third Party
          </h2>
          <rs-badge :variant="getStatusBadgeVariant()">{{
            applicationData.status
          }}</rs-badge>
        </div>
      </template>

      <template #body>
        <!-- Application Details Section -->
        <div class="mb-6">
          <h3 class="text-lg font-medium mb-4">Maklumat Permohonan</h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 class="font-medium text-gray-700">Maklumat Asas</h4>
              <div class="mt-3 border rounded-md p-4 bg-gray-50">
                <div class="grid grid-cols-1 gap-3">
                  <div class="flex flex-col">
                    <span class="text-sm text-gray-600">No. Rujukan</span>
                    <span class="font-medium"
                      >ORG{{ applicationData.refNumber }}</span
                    >
                  </div>
                  <div class="flex flex-col">
                    <span class="text-sm text-gray-600">Tarikh Permohonan</span>
                    <span class="font-medium">{{
                      applicationData.applicationDate
                    }}</span>
                  </div>
                  <div class="flex flex-col">
                    <span class="text-sm text-gray-600">Jenis Organisasi</span>
                    <span class="font-medium">{{
                      applicationData.organizationType
                    }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 class="font-medium text-gray-700">Maklumat Organisasi</h4>
              <div class="mt-3 border rounded-md p-4 bg-gray-50">
                <div class="grid grid-cols-1 gap-3">
                  <div class="flex flex-col">
                    <span class="text-sm text-gray-600">Nama Organisasi</span>
                    <span class="font-medium">{{
                      applicationData.organizationName
                    }}</span>
                  </div>
                  <div class="flex flex-col">
                    <span class="text-sm text-gray-600">No. Pendaftaran</span>
                    <span class="font-medium">{{
                      applicationData.registrationNumber
                    }}</span>
                  </div>
                  <div class="flex flex-col">
                    <span class="text-sm text-gray-600">Email</span>
                    <span class="font-medium">{{ applicationData.email }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 class="font-medium text-gray-700">Alamat</h4>
              <div class="mt-3 border rounded-md p-4 bg-gray-50">
                <div class="grid grid-cols-1 gap-3">
                  <div class="flex flex-col">
                    <span class="text-sm text-gray-600">Alamat</span>
                    <span class="font-medium">{{
                      applicationData.address
                    }}</span>
                  </div>
                  <div class="flex flex-col">
                    <span class="text-sm text-gray-600">Bandar</span>
                    <span class="font-medium">{{ applicationData.city }}</span>
                  </div>
                  <div class="flex flex-col">
                    <span class="text-sm text-gray-600">Poskod</span>
                    <span class="font-medium">{{
                      applicationData.postcode
                    }}</span>
                  </div>
                  <div class="flex flex-col">
                    <span class="text-sm text-gray-600">Negeri</span>
                    <span class="font-medium">{{ applicationData.state }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 class="font-medium text-gray-700">Maklumat Hubungan</h4>
              <div class="mt-3 border rounded-md p-4 bg-gray-50">
                <div class="grid grid-cols-1 gap-3">
                  <div class="flex flex-col">
                    <span class="text-sm text-gray-600">Nama Pegawai</span>
                    <span class="font-medium">{{
                      applicationData.contactPerson
                    }}</span>
                  </div>
                  <div class="flex flex-col">
                    <span class="text-sm text-gray-600">No. Telefon</span>
                    <span class="font-medium">{{
                      applicationData.contactPhone
                    }}</span>
                  </div>
                  <div class="flex flex-col">
                    <span class="text-sm text-gray-600">Email</span>
                    <span class="font-medium">{{
                      applicationData.contactEmail
                    }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="mb-6">
            <h4 class="font-medium text-gray-700">Dokumen Sokongan</h4>
            <div class="mt-3 border rounded-md p-4 bg-gray-50">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  v-for="(doc, index) in applicationData.documents"
                  :key="index"
                  class="flex justify-between items-center p-3 bg-white border rounded-md"
                >
                  <div class="flex items-center">
                    <Icon
                      name="mdi:file-document-outline"
                      size="1.5rem"
                      class="text-blue-600 mr-3"
                    />
                    <div>
                      <p class="font-medium">{{ doc.name }}</p>
                      <p class="text-sm text-gray-500">{{ doc.size }}</p>
                    </div>
                  </div>
                  <rs-button variant="secondary-outline" size="sm">
                    <Icon name="mdi:download" size="1rem" class="mr-1" />
                    Muat Turun
                  </rs-button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Approval Section -->
        <div class="mt-8 border-t pt-6">
          <h3 class="text-lg font-medium mb-4">Maklumat Kelulusan</h3>

          <FormKit type="form" :actions="false" @submit="handleApprovalSubmit">
            <div class="grid grid-cols-1 gap-6">
              <FormKit
                type="radio"
                name="approvalStatus"
                label="Status Kelulusan"
                validation="required"
                :options="[
                  { label: 'Lulus', value: 'approved' },
                  { label: 'Tidak Lulus', value: 'rejected' },
                ]"
                v-model="approvalData.status"
                :validation-messages="{
                  required: 'Status kelulusan adalah wajib',
                }"
              />

              <FormKit
                v-if="approvalData.status === 'rejected'"
                type="textarea"
                name="justification"
                label="Justifikasi Penolakan"
                validation="required"
                placeholder="Sila nyatakan sebab penolakan permohonan ini"
                help="Sila berikan alasan terperinci tentang sebab permohonan ini ditolak"
                v-model="approvalData.justification"
                :validation-messages="{
                  required:
                    'Justifikasi adalah wajib untuk permohonan yang tidak diluluskan',
                }"
              />
            </div>

            <div class="mt-6 flex justify-end gap-4">
              <rs-button variant="primary-outline" @click="goBack">
                Kembali
              </rs-button>

              <rs-button
                variant="primary"
                type="submit"
                :disabled="processing"
                @click="handleApprovalSubmit"
              >
                <span v-if="processing">
                  <Icon name="eos-icons:loading" class="ml-1" size="1rem" />
                </span>
                <span v-else>Hantar Keputusan</span>
              </rs-button>
            </div>
          </FormKit>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";

definePageMeta({
  title: "Kelulusan Pendaftaran Organisasi",
});

const toast = useToast();
const router = useRouter();
const processing = ref(false);

const breadcrumb = ref([
  {
    name: "Kelulusan",
    type: "link",
    path: "/BF-PRF/TP/PP/01",
  },
  {
    name: "Kelulusan Pendaftaran Third Party",
    type: "current",
  },
]);

// Mock application data - in real implementation this would be fetched from API
const applicationData = ref({
  refNumber: "2405001",
  applicationDate: "15 Mei 2025",
  status: "Menunggu Kelulusan",
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
    case "Menunggu Kelulusan":
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
