<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <div>
            <h2 class="text-xl font-semibold">Maklumat Recipient</h2>
            <p class="text-sm text-gray-600 mt-1">{{ recipientData.noRujukan }}</p>
          </div>
          <rs-badge :variant="getStatusVariant(recipientData.status)">
            {{ recipientData.status }}
          </rs-badge>
        </div>
      </template>

      <template #body>
        <div class="space-y-8">
          <!-- Maklumat Recipient -->
          <div class="space-y-4">
            <h3 class="text-lg font-medium text-gray-900 border-b pb-2">Maklumat Recipient</h3>
            
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div class="space-y-3">
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="font-medium text-gray-600">No. Rujukan:</span>
                  <span class="text-gray-900">{{ recipientData.noRujukan }}</span>
                </div>
                
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="font-medium text-gray-600">Jenis Recipient:</span>
                  <span class="text-gray-900">{{ recipientData.jenisRecipient === 'individu' ? 'Individu' : 'Syarikat' }}</span>
                </div>
                
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="font-medium text-gray-600">Nama:</span>
                  <span class="text-gray-900">{{ recipientData.jenisRecipient === 'individu' ? recipientData.namaPenuh : recipientData.namaSyarikat }}</span>
                </div>
              </div>
              
              <div class="space-y-3">
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="font-medium text-gray-600">Jenis Pengenalan:</span>
                  <span class="text-gray-900">{{ getJenisPengenalanLabel(recipientData.jenisPengenalan) }}</span>
                </div>
                
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="font-medium text-gray-600">ID Pengenalan:</span>
                  <span class="text-gray-900">{{ recipientData.jenisPengenalan === 'id_syarikat' ? recipientData.idSyarikat : recipientData.idPengenalan }}</span>
                </div>
                
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="font-medium text-gray-600">Status:</span>
                  <rs-badge :variant="getStatusVariant(recipientData.status)">
                    {{ recipientData.status }}
                  </rs-badge>
                </div>
              </div>
            </div>
          </div>

          <!-- Maklumat Akaun Bank -->
          <div class="space-y-4">
            <h3 class="text-lg font-medium text-gray-900 border-b pb-2">Maklumat Akaun Bank</h3>
            
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div class="space-y-3">
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="font-medium text-gray-600">Nama Bank:</span>
                  <span class="text-gray-900">{{ recipientData.namaBank }}</span>
                </div>
                
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="font-medium text-gray-600">No. Akaun Bank:</span>
                  <span class="text-gray-900">{{ recipientData.noAkaunBank }}</span>
                </div>
              </div>
              
              <div class="space-y-3">
                <div class="flex justify-between py-2 border-b border-gray-100">
                  <span class="font-medium text-gray-600">Penama Akaun Bank:</span>
                  <span class="text-gray-900">{{ recipientData.penamaAkaunBank }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Dokumen Sokongan -->
          <div class="space-y-4">
            <h3 class="text-lg font-medium text-gray-900 border-b pb-2">Dokumen Sokongan</h3>
            
            <div class="space-y-3">
              <div class="flex justify-between py-2 border-b border-gray-100">
                <span class="font-medium text-gray-600">Dokumen Sokongan Bank:</span>
                <div class="flex items-center space-x-2">
                  <Icon name="mdi:file-document-outline" class="text-blue-600" size="1.25rem" />
                  <span class="text-gray-900">{{ recipientData.dokumenSokongan || 'Dokumen telah dimuat naik' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-start mt-8 pt-6 border-t">
          <rs-button variant="primary-outline" @click="goBack" class="mr-4">
            Kembali
          </rs-button>
          <rs-button variant="primary" @click="editRecipient">
            Kemaskini
          </rs-button>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

definePageMeta({ title: 'Maklumat Recipient' });

const breadcrumb = ref([
  { name: 'Pengesahan', type: 'link', path: '/BF-PRF/TP/PP' },
  { name: 'Senarai Recipient', type: 'link', path: '/BF-PRF/TP/PP' },
  { name: 'Maklumat Recipient', type: 'current', path: `/BF-PRF/TP/PP/view/${route.params.id}` },
]);

// Mock data for the recipient
const recipientData = ref({
  noRujukan: 'RE-240511',
  jenisRecipient: 'individu',
  namaPenuh: 'Ahmad Bin Abdullah',
  namaSyarikat: '',
  jenisPengenalan: 'mykad',
  idPengenalan: '880101011234',
  idSyarikat: '',
  namaBank: 'Maybank',
  noAkaunBank: '1234567890',
  penamaAkaunBank: 'Ahmad Bin Abdullah',
  dokumenSokongan: 'dokumen_sokongan.pdf',
  status: 'Menunggu Pengesahan'
});

const getJenisPengenalanLabel = (jenis) => {
  const labels = {
    'mykad': 'MyKad',
    'foreign_id': 'Foreign ID',
    'id_syarikat': 'ID Syarikat'
  };
  return labels[jenis] || jenis;
};

const getStatusVariant = (status) => {
  const variants = {
    'Menunggu Pengesahan': 'warning',
    'Diluluskan': 'success',
    'Ditolak': 'danger'
  };
  return variants[status] || 'default';
};

const goBack = () => navigateTo('/BF-PRF/TP/PP');
const editRecipient = () => navigateTo(`/BF-PRF/TP/PP/kemaskini/${route.params.id}`);

// Load data based on ID when component mounts
onMounted(() => {
  // In a real implementation, this would fetch data from API based on route.params.id
  loadRecipientData(route.params.id);
});

const loadRecipientData = (id) => {
  // Mock different data based on ID
  const mockData = {
    'RE-240511': {
      noRujukan: 'RE-240511',
      jenisRecipient: 'individu',
      namaPenuh: 'Ahmad Bin Abdullah',
      namaSyarikat: '',
      jenisPengenalan: 'mykad',
      idPengenalan: '880101011234',
      idSyarikat: '',
      namaBank: 'Maybank',
      noAkaunBank: '1234567890',
      penamaAkaunBank: 'Ahmad Bin Abdullah',
      dokumenSokongan: 'dokumen_sokongan.pdf',
      status: 'Menunggu Pengesahan'
    },
    'RE-240512': {
      noRujukan: 'RE-240512',
      jenisRecipient: 'syarikat',
      namaPenuh: '',
      namaSyarikat: 'Pusat Dialisis Al-Falah Sdn Bhd',
      jenisPengenalan: 'id_syarikat',
      idPengenalan: '',
      idSyarikat: '201801023456',
      namaBank: 'Public Bank',
      noAkaunBank: '9876543210',
      penamaAkaunBank: 'Pusat Dialisis Al-Falah Sdn Bhd',
      dokumenSokongan: 'dokumen_syarikat.pdf',
      status: 'Diluluskan'
    },
    'RE-240513': {
      noRujukan: 'RE-240513',
      jenisRecipient: 'individu',
      namaPenuh: 'Siti Fatimah Binti Ali',
      namaSyarikat: '',
      jenisPengenalan: 'foreign_id',
      idPengenalan: 'FID123456789',
      idSyarikat: '',
      namaBank: 'CIMB Bank',
      noAkaunBank: '8765432109',
      penamaAkaunBank: 'Siti Fatimah Binti Ali',
      dokumenSokongan: 'dokumen_foreign.pdf',
      status: 'Ditolak'
    }
  };

  if (mockData[id]) {
    recipientData.value = { ...recipientData.value, ...mockData[id] };
  }
};
</script> 