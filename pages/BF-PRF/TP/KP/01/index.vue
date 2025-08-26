<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>Kemaskini Profil Organisasi</template>
      <template #body>
        <!-- Maklumat Read-only -->
        <rs-section title="Maklumat Organisasi">
          <rs-row>
            <rs-col label="Nama Organisasi">
              <p>{{ profileData.namaOrganisasi }}</p>
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
        <rs-section title="Kemaskini Maklumat">
          <rs-form>
            <rs-input v-model="form.alamat" label="Alamat" />
            <rs-input v-model="form.noTelefon" label="No Telefon" />
            <rs-input v-model="form.emel" label="E-mel" />

            <rs-input v-model="form.pic" label="Nama PIC" />
            <rs-input v-model="form.jawatanPic" label="Jawatan PIC" />

            <rs-divider label="Maklumat Bank" />
            <rs-input v-model="form.namaBank" label="Nama Bank" />
            <rs-input v-model="form.noAkaun" label="No Akaun Bank" />
            <rs-input v-model="form.namaPemilik" label="Nama Pemilik Akaun" />
            <rs-input v-model="form.swiftCode" label="SWIFT Code" />
            <rs-select v-model="form.kaedahPembayaran" :options="kaedahOptions" label="Kaedah Pembayaran" />
            <rs-file-upload v-model="form.dokumen" label="Dokumen Sokongan" />
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
  { name: 'Profil Recipient', type: 'link', path: '/profil' },
  { name: 'Kemaskini Profil', type: 'current', path: '/profil/kemaskini' },
]);

const profileData = ref({
  namaOrganisasi: 'Pertubuhan Rahmah Al-Falah',
  status: 'Disahkan',
  tarikhKemaskini: '2025-06-13T10:30:00',
});

const form = ref({
  alamat: '',
  noTelefon: '',
  emel: '',
  pic: '',
  jawatanPic: '',
  namaBank: '',
  noAkaun: '',
  namaPemilik: '',
  swiftCode: '',
  kaedahPembayaran: '',
  dokumen: null,
});

const kaedahOptions = [
  { label: 'IBG', value: 'IBG' },
  { label: 'RENTAS', value: 'RENTAS' },
  { label: 'Manual', value: 'Manual' },
];

const showAlert = ref(false);
const alertVariant = ref('success');
const alertMessage = ref('');

const resetForm = () => {
  for (const key in form.value) form.value[key] = '';
  form.value.dokumen = null;
};

const isBankChanged = () => {
  return (
    form.value.namaBank ||
    form.value.noAkaun ||
    form.value.namaPemilik ||
    form.value.swiftCode ||
    form.value.kaedahPembayaran
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
