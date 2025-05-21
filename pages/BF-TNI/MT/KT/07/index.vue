<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">
            Terima & Sahkan Penerimaan Tunai (Cawangan, Daerah, Amil)
          </h2>
        </div>
      </template>

      <template #body>
        <!-- Info Details Section -->
        <div class="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 class="text-lg font-medium mb-4">Maklumat Aktiviti</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-600">Nama Pegawai</p>
              <p class="font-medium">{{ currentUserName }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Tarikh</p>
              <p class="font-medium">{{ formattedCurrentDate }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Rujukan</p>
              <p class="font-medium">{{ transferDetails.rujukan }}</p>
            </div>
          </div>
        </div>

        <!-- Form Section -->
        <FormKit
          type="form"
          :actions="false"
          @submit="handleSubmit"
          v-model="formData"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Kod Cawangan / Peti Besi Asal -->
            <FormKit
              type="text"
              name="kodCawangan"
              label="Kod Cawangan / Peti Besi Asal"
              validation="required"
              :validation-messages="{
                required: 'Kod cawangan adalah wajib',
              }"
            />

            <!-- Jenis Akaun Peti Besi -->
            <FormKit
              type="select"
              name="jenisAkaun"
              label="Jenis Akaun Peti Besi"
              :options="[
                { label: 'Tunai', value: 'tunai' },
                { label: 'Amil', value: 'amil' },
                { label: 'Operasi Daerah', value: 'operasi-daerah' },
              ]"
              validation="required"
              :validation-messages="{
                required: 'Jenis akaun adalah wajib',
              }"
            />

            <!-- Jumlah Tunai -->
            <FormKit
              type="number"
              name="jumlahTunai"
              label="Jumlah Tunai (RM)"
              validation="required|min:0"
              :validation-messages="{
                required: 'Jumlah tunai adalah wajib',
                min: 'Jumlah tidak boleh negatif',
              }"
            />

            <!-- Tarikh & Masa Penerimaan -->
            <FormKit
              type="datetime-local"
              name="tarikhMasaPenerimaan"
              label="Tarikh & Masa Penerimaan"
              validation="required"
              :validation-messages="{
                required: 'Tarikh dan masa penerimaan adalah wajib',
              }"
              :value="currentDateTime"
            />

            <!-- Nama Penerima -->
            <FormKit
              type="text"
              name="namaPenerima"
              label="Nama Penerima (KC)"
              :disabled="true"
              :value="currentUserName"
            />

            <!-- Rujukan Rekod / Surat Arahan -->
            <FormKit
              type="text"
              name="rujukanRekod"
              label="Rujukan Rekod / Surat Arahan"
              placeholder="Masukkan rujukan rekod terdahulu"
            />

            <!-- Status Terimaan -->
            <FormKit
              type="select"
              name="statusTerimaan"
              label="Status Terimaan"
              :options="[
                { label: 'Diterima', value: 'diterima' },
                { label: 'Gagal', value: 'gagal' },
                { label: 'Ditangguh', value: 'ditangguh' },
              ]"
              validation="required"
              :validation-messages="{
                required: 'Status terimaan adalah wajib',
              }"
            />

            <!-- Catatan Tambahan -->
            <div class="md:col-span-2">
              <FormKit
                type="textarea"
                name="catatanTambahan"
                label="Catatan Tambahan"
                placeholder="Masukkan catatan tambahan jika berlaku perbezaan"
              />
            </div>
          </div>

          <div class="flex justify-end gap-4 mt-6">
            <rs-button variant="primary-outline" @click="resetForm">
              Reset
            </rs-button>
            <rs-button
              type="submit"
              variant="primary"
              @click="showConfirmationModal = true"
            >
              Sah & Terima
            </rs-button>
          </div>
        </FormKit>
      </template>
    </rs-card>

    <!-- Confirmation Modal -->
    <rs-modal
      title="Sahkan Penerimaan Tunai"
      v-model="showConfirmationModal"
      position="center"
    >
      <template #body>
        <p class="mb-4">
          Adakah anda pasti untuk mengesahkan penerimaan tunai ini?
        </p>
        <div class="bg-gray-50 p-4 rounded-lg">
          <p class="font-medium">Kod Cawangan: {{ formData.kodCawangan }}</p>
          <p class="font-medium">
            Jenis Akaun: {{ getJenisAkaunLabel(formData.jenisAkaun) }}
          </p>
          <p class="font-medium">
            Jumlah Tunai: RM {{ formData.jumlahTunai || "0.00" }}
          </p>
          <p class="font-medium">
            Status: {{ getStatusLabel(formData.statusTerimaan) }}
          </p>
          <p class="text-sm text-gray-600 mt-2">
            Pastikan butiran penerimaan tunai adalah tepat sebelum mengesahkan.
          </p>
        </div>
      </template>

      <template #footer>
        <rs-button variant="primary-outline" @click="showConfirmationModal = false">
          Batal
        </rs-button>
        <rs-button variant="primary" @click="handleConfirm">
          Sah & Terima
        </rs-button>
      </template>
    </rs-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

definePageMeta({
  title: "Terima & Sahkan Penerimaan Tunai",
});

const route = useRoute();
const router = useRouter();
const showConfirmationModal = ref(false);

const breadcrumb = ref([
  {
    name: "Pengurusan Tunai",
    type: "link",
    path: `/BF-TNI/MT/KT/01`,
  },
  {
    name: "Keluaran Tunai",
    type: "link",
    path: "/BF-TNI/MT/KT/01",
  },
  {
    name: "Terima & Sahkan Penerimaan Tunai (Cawangan, Daerah, Amil)",
    type: "current",
    path: "/BF-TNI/MT/KT/07",
  },
]);

const currentUserName = ref("Sarah binti Omar");
const formattedCurrentDate = computed(() => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date().toLocaleDateString("ms-MY", options);
});

const transferDetails = ref({
  rujukan: "TRF-" + new Date().toISOString().slice(0, 10).replace(/-/g, ""),
});

const currentDateTime = computed(() => {
  return new Date().toISOString().slice(0, 16);
});

interface FormData {
  kodCawangan: string;
  jenisAkaun: string;
  jumlahTunai: number;
  tarikhMasaPenerimaan: string;
  namaPenerima: string;
  rujukanRekod: string;
  statusTerimaan: string;
  catatanTambahan: string;
}

const formData = ref<FormData>({
  kodCawangan: "",
  jenisAkaun: "",
  jumlahTunai: 0,
  tarikhMasaPenerimaan: currentDateTime.value,
  namaPenerima: currentUserName.value,
  rujukanRekod: "",
  statusTerimaan: "",
  catatanTambahan: "",
});

const getJenisAkaunLabel = (value: string) => {
  const options = {
    tunai: "Tunai",
    amil: "Amil",
    "operasi-daerah": "Operasi Daerah",
  };
  return options[value as keyof typeof options] || value;
};

const getStatusLabel = (value: string) => {
  const options = {
    diterima: "Diterima",
    gagal: "Gagal",
    ditangguh: "Ditangguh",
  };
  return options[value as keyof typeof options] || value;
};

const resetForm = () => {
  formData.value = {
    kodCawangan: "",
    jenisAkaun: "",
    jumlahTunai: 0,
    tarikhMasaPenerimaan: currentDateTime.value,
    namaPenerima: currentUserName.value,
    rujukanRekod: "",
    statusTerimaan: "",
    catatanTambahan: "",
  };
};

const handleSubmit = async (formData: FormData) => {
  showConfirmationModal.value = true;
};

const handleConfirm = async () => {
  showConfirmationModal.value = false;
  // Add your logic here to handle the confirmation

  navigateTo("/BF-TNI/MT/KT/08");
};
</script>
