<!-- 
  RTMF SCREEN: PL-PROFILE-EDIT-01
  PURPOSE: Profile Edit Page for Pengguna Luar
  DESCRIPTION: Simple profile editing for external users
  ROUTE: /BF-PRF/pengguna-luar/profile/edit
-->
<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Kemaskini Profil</h2>
        </div>
      </template>

      <template #body>
        <FormKit
          type="form"
          :actions="false"
          @submit="handleSubmit"
          #default="{ value }"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormKit
              type="text"
              name="nama"
              label="Nama Penuh"
              validation="required"
              placeholder="Masukkan nama penuh"
              v-model="formData.nama"
              :validation-messages="{ required: 'Nama adalah wajib' }"
            />

            <FormKit
              type="email"
              name="emel"
              label="Emel"
              validation="required|email"
              placeholder="Masukkan emel"
              v-model="formData.emel"
              :validation-messages="{
                required: 'Emel adalah wajib',
                email: 'Format emel tidak sah'
              }"
            />

            <FormKit
              type="tel"
              name="telefon"
              label="Nombor Telefon"
              validation="required"
              placeholder="Contoh: 0123456789"
              v-model="formData.telefon"
              :validation-messages="{ required: 'Nombor telefon adalah wajib' }"
            />

            <FormKit
              type="select"
              name="organisasi"
              label="Jenis Organisasi"
              validation="required"
              placeholder="Pilih jenis organisasi"
              :options="[
                { label: 'Syarikat Swasta', value: 'swasta' },
                { label: 'NGO', value: 'ngo' },
                { label: 'Institusi Pendidikan', value: 'pendidikan' },
                { label: 'Agensi Kerajaan', value: 'kerajaan' },
                { label: 'Lain-lain', value: 'lain' }
              ]"
              v-model="formData.organisasi"
              :validation-messages="{ required: 'Jenis organisasi adalah wajib' }"
            />

            <FormKit
              type="text"
              name="namaOrganisasi"
              label="Nama Organisasi"
              validation="required"
              placeholder="Masukkan nama organisasi"
              v-model="formData.namaOrganisasi"
              :validation-messages="{ required: 'Nama organisasi adalah wajib' }"
            />

            <FormKit
              type="text"
              name="jawatan"
              label="Jawatan"
              validation="required"
              placeholder="Contoh: Pengurus, Eksekutif"
              v-model="formData.jawatan"
              :validation-messages="{ required: 'Jawatan adalah wajib' }"
            />
          </div>

          <div class="mt-6 flex justify-end gap-4">
            <rs-button variant="secondary-outline" @click="navigateTo('/BF-PRF/pengguna-luar/dashboard')">
              Batal
            </rs-button>
            <rs-button variant="primary" :disabled="processing" @click="handleSubmit">
              <span v-if="processing">
                <Icon name="eos-icons:loading" class="animate-spin mr-2" size="1rem" />
                Menyimpan...
              </span>
              <span v-else>Simpan Perubahan</span>
            </rs-button>
          </div>
        </FormKit>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";

definePageMeta({
  title: "Kemaskini Profil - Pengguna Luar",
  description: "Kemaskini maklumat profil pengguna luar",
});

const router = useRouter();
const toast = useToast();

const breadcrumb = ref([
  {
    name: "BF-PRF",
    type: "link",
    path: "/BF-PRF",
  },
  {
    name: "Pengguna Luar",
    type: "link",
    path: "/BF-PRF/pengguna-luar",
  },
  {
    name: "Dashboard",
    type: "link",
    path: "/BF-PRF/pengguna-luar/dashboard",
  },
  {
    name: "Kemaskini Profil",
    type: "current",
    path: "/BF-PRF/pengguna-luar/profile/edit",
  },
]);

const processing = ref(false);

const formData = ref({
  nama: "",
  emel: "",
  telefon: "",
  organisasi: "",
  namaOrganisasi: "",
  jawatan: "",
});

const handleSubmit = async () => {
  processing.value = true;

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Update localStorage
    const userInfo = {
      nama: formData.value.nama,
      emel: formData.value.emel,
      telefon: formData.value.telefon,
      organisasi: formData.value.organisasi,
      namaOrganisasi: formData.value.namaOrganisasi,
      jawatan: formData.value.jawatan,
    };

    localStorage.setItem('userInfo', JSON.stringify(userInfo));

    toast.success("Profil berjaya dikemaskini!");
    
    // Redirect to dashboard
    router.push('/BF-PRF/pengguna-luar/dashboard');
  } catch (error) {
    toast.error("Ralat semasa menyimpan profil. Sila cuba lagi.");
    console.error("Profile update error:", error);
  } finally {
    processing.value = false;
  }
};

const navigateTo = (path) => {
  router.push(path);
};

onMounted(() => {
  // Load existing user data
  const storedUserInfo = localStorage.getItem('userInfo');
  if (storedUserInfo) {
    try {
      const userInfo = JSON.parse(storedUserInfo);
      formData.value = { ...formData.value, ...userInfo };
    } catch (error) {
      console.error('Error parsing user info:', error);
    }
  }
});
</script> 