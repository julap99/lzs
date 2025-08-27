<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <div class="flex items-center justify-between mt-6 mb-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Pengesahan Pendaftaran Cawangan</h1>
        <p class="text-sm text-gray-500">No. Rujukan: {{ applicationData.refNumber }}</p>
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
              <FormKit type="text" label="Jenis Permohonan" :value="'Pendaftaran Cawangan'" disabled />
            </div>
          </template>
        </rs-card>

        <!-- Maklumat Cawangan -->
        <rs-card>
          <template #header>
            <h2 class="text-md font-semibold text-gray-900">Maklumat Cawangan</h2>
          </template>
          <template #body>
            <div class="space-y-4">
              <FormKit type="text" label="Nama Cawangan" :value="applicationData.namaCawangan" disabled />
              <FormKit type="text" label="Nama Organisasi Induk" :value="applicationData.namaHQ" disabled />
              <FormKit type="text" label="Pengurus Cawangan" :value="applicationData.pengurusCawangan" disabled />
            </div>
          </template>
        </rs-card>

        <!-- Alamat Cawangan -->
        <rs-card>
          <template #header>
            <h2 class="text-md font-semibold text-gray-900">Alamat Cawangan</h2>
          </template>
          <template #body>
            <div class="space-y-4">
              <FormKit type="text" label="Alamat" :value="applicationData.alamat.jalan" disabled />
              <FormKit type="text" label="Bandar / Poskod" :value="`${applicationData.alamat.bandar} - ${applicationData.alamat.poskod}`" disabled />
              <FormKit type="text" label="Negeri" :value="applicationData.alamat.negeri" disabled />
            </div>
          </template>
        </rs-card>

        <!-- Maklumat Hubungan -->
        <rs-card>
          <template #header>
            <h2 class="text-md font-semibold text-gray-900">Maklumat Hubungan</h2>
          </template>
          <template #body>
            <div class="space-y-4">
              <FormKit type="text" label="Emel" :value="applicationData.emel" disabled />
              <FormKit type="text" label="No. Telefon" :value="applicationData.noTelefon" disabled />
              <FormKit type="text" label="Daerah" :value="applicationData.daerah" disabled />
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
                <rs-button variant="secondary-outline" size="sm" @click="viewDocument(doc.id)">
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
                  placeholder="Sila nyatakan sebab penolakan permohonan cawangan ini"
                  v-model="approvalData.justification"
                  :validation-messages="{ required: 'Justifikasi diperlukan untuk penolakan' }"
                />

                <FormKit
                  v-if="approvalData.status"
                  type="textarea"
                  name="comments"
                  label="Catatan Tambahan (Pilihan)"
                  placeholder="Tambah catatan atau ulasan..."
                  v-model="approvalData.comments"
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
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

definePageMeta({ 
  title: 'Pengesahan Pendaftaran Cawangan' 
});

const toast = useToast();
const router = useRouter();
const processing = ref(false);

const breadcrumb = ref([
  { name: 'Pengesahan', type: 'link', path: '/BF-PRF/OR/PB' },
  { name: 'Senarai Cawangan', type: 'link', path: '/BF-PRF/OR/PB' },
  { name: 'Pengesahan Pendaftaran Cawangan', type: 'current' },
]);

// Application data (mock data - in real implementation this would be fetched from API)
const applicationData = ref({
  refNumber: 'PB-240511',
  applicationDate: '25 Jun 2025',
  status: 'Menunggu Pengesahan',
  namaCawangan: 'Cawangan Seri Damai',
  namaHQ: 'Yayasan Insan Malaysia',
  pengurusCawangan: 'Ahmad Bin Hassan',
  daerah: 'Kuala Lumpur',
  emel: 'cawangan.serindamai@yayasaninsan.org.my',
  noTelefon: '03-9876 5432',
  alamat: {
    jalan: 'No. 123, Jalan Seri Damai 1/2',
    poskod: '53100',
    bandar: 'Kuala Lumpur',
    negeri: 'Kuala Lumpur'
  },
  documents: [
    { id: 1, name: 'Surat Sokongan HQ', size: '2.3 MB' },
    { id: 2, name: 'Surat Kebenaran Premis', size: '1.8 MB' },
    { id: 3, name: 'Sijil Syarikat Cawangan', size: '1.2 MB' },
    { id: 4, name: 'Pelan Lantai Premis', size: '3.1 MB' }
  ]
});

const approvalData = ref({
  status: '',
  justification: '',
  comments: ''
});

const getStatusBadgeVariant = () => {
  switch (applicationData.value.status) {
    case 'Diluluskan':
      return 'success';
    case 'Ditolak':
      return 'danger';
    case 'Menunggu Pengesahan':
      return 'warning';
    default:
      return 'info';
  }
};

const viewDocument = (documentId) => {
  // Mock function to view document
  console.log('View document:', documentId);
  // In real implementation, this would open the document in a new tab or modal
};

const handleApprovalSubmit = async () => {
  // Validate justification if rejection
  if (approvalData.value.status === 'rejected' && !approvalData.value.justification) {
    return;
  }

  processing.value = true;

  // Simulate API call to submit approval decision
  try {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Update application status based on approval decision
    if (approvalData.value.status === 'approved') {
      applicationData.value.status = 'Diluluskan';
      toast.success('Permohonan cawangan telah berjaya diluluskan');
    } else {
      applicationData.value.status = 'Ditolak';
      toast.success('Keputusan penolakan telah direkodkan');
    }

    // In real implementation, we would redirect to a list page after a short delay
    setTimeout(() => {
      processing.value = false;
      goBack();
    }, 1000);
  } catch (error) {
    processing.value = false;
    showErrorNotification('Ralat semasa memproses keputusan');
  }
};

const showErrorNotification = (message) => {
  toast.error(message);
};

const goBack = () => {
  // Navigate back to cawangan list
  router.push('/BF-PRF/OR/PB');
};
</script>

<style scoped></style>
