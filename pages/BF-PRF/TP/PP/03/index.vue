<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <div class="flex justify-between items-start mt-6 mb-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Pengesahan Pendaftaran Recipient</h1>
        <p class="mt-1 text-sm text-gray-600">Semak permohonan recipient dan berikan keputusan pengesahan.</p>
      </div>
      <rs-badge :variant="getStatusBadgeVariant()">{{ applicationData.status }}</rs-badge>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Kiri: Maklumat Permohonan -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Maklumat Recipient -->
        <rs-card>
          <template #header>
            <h2 class="text-md font-semibold text-gray-900">Maklumat Recipient</h2>
          </template>
          <template #body>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit type="text" label="No. Rujukan" :value="'RE-' + applicationData.refNumber" disabled />
              <FormKit type="text" label="Tarikh Permohonan" :value="applicationData.applicationDate" disabled />
              <FormKit type="text" label="Jenis Recipient" :value="applicationData.jenisRecipient" disabled />
              <FormKit 
                v-if="applicationData.jenisRecipient === 'Individu'"
                type="text" 
                label="Nama Penuh" 
                :value="applicationData.namaPenuh" 
                disabled 
              />
              <FormKit 
                v-if="applicationData.jenisRecipient === 'Syarikat'"
                type="text" 
                label="Nama Syarikat" 
                :value="applicationData.namaSyarikat" 
                disabled 
              />
              <FormKit type="text" label="Jenis Pengenalan" :value="applicationData.jenisPengenalan" disabled />
              <FormKit 
                v-if="applicationData.jenisPengenalan !== 'ID Syarikat'"
                type="text" 
                label="ID Pengenalan" 
                :value="applicationData.idPengenalan" 
                disabled 
              />
              <FormKit 
                v-if="applicationData.jenisPengenalan === 'ID Syarikat'"
                type="text" 
                label="ID Syarikat" 
                :value="applicationData.idSyarikat" 
                disabled 
              />
            </div>
          </template>
        </rs-card>

        <!-- Maklumat Akaun Bank -->
        <rs-card>
          <template #header>
            <h2 class="text-md font-semibold text-gray-900">Maklumat Akaun Bank</h2>
          </template>
          <template #body>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit type="text" label="Nama Bank" :value="applicationData.namaBank" disabled />
              <FormKit type="text" label="No Akaun Bank" :value="applicationData.noAkaunBank" disabled />
              <FormKit type="text" label="Penama Akaun Bank" :value="applicationData.penamaAkaunBank" disabled />
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
            <h2 class="text-md font-semibold text-gray-900">Maklumat Pengesahan</h2>
          </template>
          <template #body>
            <FormKit type="form" :actions="false" @submit="handleApprovalSubmit">
              <FormKit
                type="radio"
                name="approvalStatus"
                label="Status Pengesahan"
                validation="required"
                :options="[
                  { label: 'Disahkan', value: 'approved' },
                  { label: 'Perlu Pembetulan', value: 'correction_required' },
                  { label: 'Tidak Sah', value: 'rejected' },
                ]"
                v-model="approvalData.status"
              />

              <FormKit
                v-if="approvalData.status === 'correction_required' || approvalData.status === 'rejected'"
                type="textarea"
                name="justification"
                :label="approvalData.status === 'correction_required' ? 'Ulasan Pembetulan' : 'Justifikasi Penolakan'"
                validation="required"
                :placeholder="approvalData.status === 'correction_required' ? 'Sila nyatakan perkara yang perlu diperbetulkan' : 'Sila nyatakan sebab penolakan'"
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
  title: "Pengesahan Pendaftaran Recipient",
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

// Mock application data - updated to match new structure
const applicationData = ref({
  refNumber: "2406002",
  applicationDate: "18 Jun 2025",
  status: "Menunggu Pengesahan",
  
  // Maklumat Recipient
  jenisRecipient: "Individu", // atau "Syarikat"
  namaPenuh: "Ahmad Bin Abdullah", // for Individu
  namaSyarikat: "", // for Syarikat
  jenisPengenalan: "MyKad", // MyKad, Foreign ID, ID Syarikat
  idPengenalan: "880101-12-3456", // for MyKad/Foreign ID
  idSyarikat: "", // for ID Syarikat
  
  // Maklumat Akaun Bank
  namaBank: "Maybank",
  noAkaunBank: "1234567890123456",
  penamaAkaunBank: "Ahmad Bin Abdullah",
  
  // Dokumen Sokongan
  documents: [
    { name: "Penyata Bank - Bulan Jun 2025", size: "2.2 MB" },
    { name: "Slip Deposit Akaun Bank", size: "1.1 MB" },
  ],
});

const approvalData = ref({
  status: "",
  justification: "",
});

const getStatusBadgeVariant = () => {
  switch (applicationData.value.status) {
    case "Disahkan":
      return "success";
    case "Perlu Pembetulan":
      return "warning";
    case "Tidak Sah":
      return "danger";
    case "Menunggu Pengesahan":
      return "warning";
    default:
      return "info";
  }
};

const handleApprovalSubmit = async () => {
  // Validate justification if correction required or rejection
  if (
    (approvalData.value.status === "correction_required" || approvalData.value.status === "rejected") &&
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
      applicationData.value.status = "Disahkan";
      toast.success("Permohonan telah berjaya disahkan");
    } else if (approvalData.value.status === "correction_required") {
      applicationData.value.status = "Perlu Pembetulan";
      toast.success("Keputusan pembetulan telah direkodkan");
    } else {
      applicationData.value.status = "Tidak Sah";
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
  router.push("/BF-PRF/TP/PP");
};
</script>
