<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Pendaftaran Cawangan Baharu</h2>
        </div>
      </template>

      <template #body>
        <FormKit type="form" :actions="false" @submit="handleSubmit">
          <!-- Section 1: Maklumat Induk -->
          <h3 class="text-lg font-medium mb-2">Maklumat Organisasi Induk</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <rs-input label="Nama Organisasi Induk" v-model="induk.nama" readonly />
            <rs-input label="ROC / ROS / Kod Organisasi" v-model="induk.kod" readonly />
            <rs-input label="Zon / Negeri Induk" v-model="induk.zonNegeri" readonly />
          </div>

          <!-- Section 2: Maklumat Cawangan -->
          <h3 class="text-lg font-medium mb-2">Maklumat Cawangan</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <FormKit type="text" name="namaCawangan" label="Nama Cawangan" validation="required" v-model="form.namaCawangan" />
            <FormKit type="text" name="kodCawangan" label="Kod Cawangan (Opsyenal)" v-model="form.kodCawangan" />
            <FormKit type="text" name="alamat1" label="Alamat Baris 1" validation="required" v-model="form.alamat1" />
            <FormKit type="text" name="alamat2" label="Alamat Baris 2" v-model="form.alamat2" />
            <FormKit type="text" name="alamat3" label="Alamat Baris 3" v-model="form.alamat3" />
            <FormKit type="text" name="poskod" label="Poskod" validation="required" v-model="form.poskod" />
            <FormKit type="text" name="bandar" label="Bandar" validation="required" v-model="form.bandar" />
            <FormKit type="text" name="zon" label="Zon / Daerah" validation="required" v-model="form.zon" />
            <FormKit type="text" name="negeri" label="Negeri" validation="required" v-model="form.negeri" />
            <FormKit type="text" name="negara" label="Negara" v-model="form.negara" />
            <FormKit type="text" name="telefon" label="Telefon Rasmi" validation="required" v-model="form.telefon" />
            <FormKit type="text" name="emel" label="Emel Rasmi" validation="required" v-model="form.emel" />
          </div>

          <!-- Section 3: PIC -->
          <h3 class="text-lg font-medium mb-2">Maklumat PIC / Wakil</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <FormKit type="text" name="namaPic" label="Nama Penuh" validation="required" v-model="form.namaPic" />
            <FormKit type="text" name="jawatan" label="Jawatan" v-model="form.jawatan" />
            <FormKit type="text" name="noKp" label="No Kad Pengenalan" v-model="form.noKp" />
            <FormKit type="text" name="telefonPic" label="Telefon PIC" validation="required" v-model="form.telefonPic" />
            <FormKit type="text" name="emelPic" label="Emel PIC" validation="required" v-model="form.emelPic" />
          </div>

          <!-- Section 4: Bank -->
          <h3 class="text-lg font-medium mb-2">Maklumat Bank</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <FormKit type="text" name="namaBank" label="Nama Bank" v-model="form.namaBank" />
            <FormKit type="text" name="noAkaun" label="No Akaun Bank" v-model="form.noAkaun" />
            <FormKit type="text" name="swift" label="SWIFT Code" v-model="form.swift" />
            <FormKit type="text" name="pemilikAkaun" label="Nama Pemilik Akaun" v-model="form.pemilikAkaun" />
          </div>

          <!-- Section 5: Dokumen -->
          <FormKit type="file" name="dokumen" label="Dokumen Sokongan" help="PDF sahaja. Max 5MB." accept="application/pdf" />

          <!-- Action Buttons -->
          <div class="flex justify-end gap-4 mt-6">
            <rs-button variant="primary-outline" @click="resetForm">Reset</rs-button>
            <rs-button variant="primary" type="submit">Hantar Permohonan</rs-button>
          </div>
        </FormKit>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const breadcrumb = ref([
  { name: 'Pendaftaran Organisasi', type: 'link', path: '/BF-PRF/OR/PP/01' },
  { name: 'Carian Induk', type: 'link', path: '/BF-PRF/OR/PB/01' },
  { name: 'Pendaftaran Cawangan', type: 'current', path: '/BF-PRF/OR/PB/02' },
]);

const induk = ref({
  nama: 'Pertubuhan Amal Harapan',
  kod: 'ROC102938',
  zonNegeri: 'Selangor / Zon Tengah',
});

const form = ref({
  namaCawangan: '',
  kodCawangan: '',
  alamat1: '',
  alamat2: '',
  alamat3: '',
  poskod: '',
  bandar: '',
  zon: '',
  negeri: '',
  negara: 'Malaysia',
  telefon: '',
  emel: '',
  namaPic: '',
  jawatan: '',
  noKp: '',
  telefonPic: '',
  emelPic: '',
  namaBank: '',
  noAkaun: '',
  swift: '',
  pemilikAkaun: '',
});

const handleSubmit = () => {
  alert('Permohonan dihantar! Status: Menunggu Pengesahan EOAD.');
};

const resetForm = () => {
  Object.keys(form.value).forEach((key) => (form.value[key] = key === 'negara' ? 'Malaysia' : ''));
};
</script>