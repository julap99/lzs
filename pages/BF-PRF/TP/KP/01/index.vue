<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>Kemaskini Profil Recipient</template>
      <template #body>
        <!-- Maklumat Read-only -->
        <rs-section title="Maklumat Recipient">
          <rs-row>
            <rs-col label="Nama Recipient">
              <p>{{ profileData.namaRecipient }}</p>
            </rs-col>
            <rs-col label="Jenis Recipient">
              <p>{{ profileData.jenisRecipient }}</p>
            </rs-col>
            <rs-col label="Jenis Pengenalan">
              <p>{{ profileData.jenisPengenalan }}</p>
            </rs-col>
            <rs-col label="ID Pengenalan">
              <p>{{ profileData.idPengenalan }}</p>
            </rs-col>
            <rs-col label="Status Terkini">
              <rs-badge :variant="getStatusVariant(profileData.status)">
                {{ profileData.status }}
              </rs-badge>
            </rs-col>
            <rs-col label="Tarikh Kemaskini">
              <p>{{ formatDate(profileData.tarikhKemaskini) }}</p>
            </rs-col>
          </rs-row>
        </rs-section>

        <!-- Borang Kemaskini -->
        <rs-section title="Kemaskini Maklumat Akaun Bank">
          <rs-form>
            <rs-input v-model="form.namaBank" label="Nama Bank" />
            <rs-input 
              v-model="form.noAkaunBank" 
              label="No Akaun Bank" 
              help="Format: 10-16 digit"
            />
            <rs-input v-model="form.penamaAkaunBank" label="Penama Akaun Bank" />
            <rs-file-upload 
              v-model="form.dokumenSokongan" 
              label="Dokumen Sokongan Bank" 
              help="Format: PDF, JPG, PNG. Maksimum: 10MB"
            />
          </rs-form>
        </rs-section>

        <!-- Butang Tindakan -->
        <div class="flex justify-end gap-4 mt-6">
          <rs-button variant="ghost" @click="resetForm">Reset</rs-button>
          <rs-button variant="primary" @click="submitForm">Hantar</rs-button>
        </div>

        <!-- Notifikasi Alert -->
        <rs-alert v-if="showAlert" :variant="alertVariant" class="mt-6">
          {{ alertMessage }}
        </rs-alert>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const breadcrumb = ref([
  { name: 'Profil Recipient', type: 'link', path: '/BF-PRF/TP/KP' },
  { name: 'Kemaskini Profil', type: 'current', path: '/BF-PRF/TP/KP/01' },
]);

const profileData = ref({
  namaRecipient: 'Ahmad Bin Abdullah',
  jenisRecipient: 'Individu',
  jenisPengenalan: 'MyKad',
  idPengenalan: '880101-12-3456',
  status: 'Disahkan',
  tarikhKemaskini: '2025-06-13T10:30:00',
});

const form = ref({
  namaBank: '',
  noAkaunBank: '',
  penamaAkaunBank: '',
  dokumenSokongan: null,
});

const showAlert = ref(false);
const alertVariant = ref('success');
const alertMessage = ref('');

const resetForm = () => {
  for (const key in form.value) {
    if (key === 'dokumenSokongan') {
      form.value[key] = null;
    } else {
      form.value[key] = '';
    }
  }
};

const isBankChanged = () => {
  return (
    form.value.namaBank ||
    form.value.noAkaunBank ||
    form.value.penamaAkaunBank
  );
};

const submitForm = () => {
  const now = new Date();
  showAlert.value = true;

  if (isBankChanged()) {
    profileData.value.status = 'Menunggu Pengesahan EOAD';
    alertVariant.value = 'warning';
    alertMessage.value = `Maklumat Bank telah diubah. Menunggu pengesahan EOAD. [${now.toLocaleString()}]`;
  } else {
    profileData.value.status = 'Disahkan';
    alertVariant.value = 'success';
    alertMessage.value = `Maklumat telah dikemaskini. [${now.toLocaleString()}]`;
  }

  profileData.value.tarikhKemaskini = now.toISOString();
};

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleString('ms-MY', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true
  });
};

const getStatusVariant = (status) => {
  return status === 'Disahkan' ? 'success' : 'warning';
};
</script>

<style scoped>
rs-col p {
  margin: 0;
  font-weight: 500;
}
</style>
