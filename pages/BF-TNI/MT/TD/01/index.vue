<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Hantar Permohonan Keluar Tunai (EPOAD)
          </h2>
        </div>
      </template>

      <template #body>
        <FormKit
          type="form"
          :actions="false"
          @submit="handleSubmit"
          v-model="formData"
          class="max-w-3xl mx-auto"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Nama Pemohon / EOAD (V) -->
            <FormKit
              type="text"
              name="namaPemohon"
              label="Nama Pemohon / EOAD"
              validation="required"
              :validation-messages="{
                required: 'Nama pemohon adalah wajib',
              }"
              :disabled="true"
              :value="currentUserName"
            />

            <!-- Tujuan Pengeluaran Tunai (C/U/V) -->
            <FormKit
              type="select"
              name="tujuanPengeluaran"
              label="Tujuan Pengeluaran Tunai"
              validation="required"
              :validation-messages="{
                required: 'Tujuan pengeluaran adalah wajib',
              }"
              :options="[
                { label: 'Bantuan Lapangan', value: 'BANTUAN_LAPANGAN' },
                { label: 'Operasi Daerah', value: 'OPERASI_DAERAH' },
                { label: 'Kecemasan', value: 'KECEMASAN' },
                { label: 'Lain-lain', value: 'LAIN_LAIN' },
              ]"
            />

            <!-- Jumlah Tunai Dimohon (RM) (C/U/V) -->
            <FormKit
              type="number"
              name="jumlahTunai"
              label="Jumlah Tunai Dimohon (RM)"
              validation="required|min:1"
              :validation-messages="{
                required: 'Jumlah tunai adalah wajib',
                min: 'Jumlah tunai mesti lebih daripada 0',
              }"
              step="0.01"
              min="0"
            />

            <!-- Baki Peti Besi Semasa (V) -->
            <FormKit
              type="text"
              name="bakiPetiBesi"
              label="Baki Peti Besi Semasa (RM)"
              :disabled="true"
              :value="formatCurrency(safeBoxBalance)"
            />

            <!-- Lokasi Lapangan (C/U/V) -->
            <FormKit
              type="select"
              name="lokasiLapangan"
              label="Lokasi Lapangan"
              validation="required"
              :validation-messages="{
                required: 'Lokasi lapangan adalah wajib',
              }"
              :options="fieldLocations"
            />
          </div>

          <div class="flex justify-end gap-4 mt-6">
            <rs-button
              type="button"
              variant="primary-outline"
              @click="resetForm"
            >
              Reset
            </rs-button>
            <rs-button
              type="submit"
              variant="primary"
              :loading="isSubmitting"
              @click="handleSubmit"
            >
              Hantar Permohonan
            </rs-button>
          </div>
        </FormKit>
      </template>
    </rs-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

definePageMeta({
  title: 'Hantar Permohonan Keluar Tunai',
});

const router = useRouter();
const isSubmitting = ref(false);

const breadcrumb = ref([
  {
    name: 'Pengurusan Tunai',
    type: 'link',
    path: '/BF-TNI/MT/TD/01',
  },
  {
    name: 'Tunai Dilapangan',
    type: 'link',
    path: '/BF-TNI/MT/TD/01',
  },
  {
    name: 'Hantar Permohonan Keluar Tunai (EPOAD)',
    type: 'current',
    path: '/BF-TNI/MT/TD/01',
  },
]);

// Mock data - replace with actual data from API
const currentUserName = ref('Ahmad bin Abdullah');
const safeBoxBalance = ref(10000.00);
const fieldLocations = ref([
  { label: 'Kuala Lumpur', value: 'KL' },
  { label: 'Selangor', value: 'SGR' },
  { label: 'Negeri Sembilan', value: 'NS' },
  { label: 'Melaka', value: 'MLK' },
  { label: 'Johor', value: 'JHR' },
]);

const formData = ref({
  namaPemohon: currentUserName.value,
  tujuanPengeluaran: '',
  jumlahTunai: null,
  bakiPetiBesi: safeBoxBalance.value,
  lokasiLapangan: '',
});

const formatCurrency = (value: number) => {
  return value.toLocaleString('ms-MY', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const resetForm = () => {
  formData.value = {
    namaPemohon: currentUserName.value,
    tujuanPengeluaran: '',
    jumlahTunai: null,
    bakiPetiBesi: safeBoxBalance.value,
    lokasiLapangan: '',
  };
};

const handleSubmit = async (formData: any) => {
  try {
    isSubmitting.value = true;
    // TODO: Implement API call to submit cash withdrawal request
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Show success message and redirect
    await router.push('/BF-TNI/MT/TD/02');
  } catch (error) {
    console.error('Error submitting form:', error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped></style>
