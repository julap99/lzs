<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const showConfirmModal = ref(false);

definePageMeta({
  title: "Hantar Aduan",
});

const breadcrumb = ref([
  {
    name: "Pengurusan Aduan",
    type: "link",
    path: "/BF-ADN/PA/DA/01",
  },
  {
    name: "Hantar Aduan",
    type: "current",
    path: "/BF-ADN/PA/DA/01",
  },
]);

const currentStep = ref(1);
const totalSteps = 4;

const steps = [
  { id: 1, label: "Jenis Aduan" },
  { id: 2, label: "Maklumat Individu" },
  { id: 3, label: "Butiran Aduan" },
  { id: 4, label: "Pengesahan" },
];

const formData = ref({
  // Maklumat Individu Dibantu
  namaPenuh: "",
  noKadPengenalan: "",
  emel: "",
  noTelefon: "",
  statusPerkahwinan: "",
  alamatBaris1: "",
  alamatBaris2: "",
  bandar: "",
  poskod: "",
  negeri: "",
  jenisKediaman: "",
  daerah: "",
  lokasi: "",
  penyataanMasalah: "",
  ringkasanAduan: "",
  lampiran: [],

  // Maklumat Pengadu (jika wakil)
  namaPengadu: "",
  noKadPengenalanPengadu: "",
  emelPengadu: "",
  noTelefonPengadu: "",

  // Form control
  isWakil: false,
});

const statusPerkahwinanOptions = [
  { label: "Bujang", value: "bujang" },
  { label: "Berkahwin", value: "berkahwin" },
  { label: "Bercerai", value: "bercerai" },
  { label: "Janda/Duda", value: "janda_duda" },
];

const jenisKediamanOptions = [
  { label: "Rumah Teres", value: "rumah_teres" },
  { label: "Rumah Berkembar", value: "rumah_berkembar" },
  { label: "Rumah Banglo", value: "rumah_banglo" },
  { label: "Pangsapuri", value: "pangsapuri" },
  { label: "Kondominium", value: "kondominium" },
  { label: "Rumah Kampung", value: "rumah_kampung" },
];

const nextStep = () => {
  if (currentStep.value < totalSteps) {
    currentStep.value++;
  }
};

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
};

const handleSubmit = () => {
  showConfirmModal.value = true;
};

const handleConfirm = () => {
  console.log("Form submitted:", formData.value);
  showConfirmModal.value = false;

  // Navigate based on form type
  if (formData.value.isWakil) {
    router.push("/BF-ADN/PA/DA/02");
  } else {
    router.push("/BF-ADN/PA/DA/03");
  }
};

const handleCancel = () => {
  showConfirmModal.value = false;
};
</script>

<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card>
      <template #header>
        <div class="flex justify-between items-center">
          <h1 class="text-2xl font-bold">Hantar Aduan</h1>
          <div class="text-sm text-gray-600">
            Langkah {{ currentStep }} dari {{ totalSteps }}
          </div>
        </div>
      </template>

      <template #body>
        <!-- Progress indicator -->
        <div class="mb-6">
          <div class="flex justify-between mb-2">
            <div
              v-for="step in steps"
              :key="step.id"
              class="text-center flex-1"
              :class="{ 'font-semibold': currentStep >= step.id }"
            >
              {{ step.label }}
            </div>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2.5">
            <div
              class="bg-primary h-2.5 rounded-full"
              :style="`width: ${(currentStep / totalSteps) * 100}%`"
            ></div>
          </div>
        </div>

        <FormKit
          type="form"
          @submit="handleSubmit"
          :actions="false"
          class="space-y-6"
        >
          <!-- Step 1: Jenis Aduan -->
          <div v-if="currentStep === 1" class="space-y-6">
            <h2 class="text-lg font-semibold mb-4">Jenis Aduan</h2>
            <FormKit
              v-model="formData.isWakil"
              type="radio"
              :options="[
                { label: 'Hantar aduan untuk diri sendiri', value: false },
                { label: 'Hantar aduan bagi pihak orang lain', value: true },
              ]"
              :classes="{
                fieldset: 'border-0 !p-0',
                legend: '!font-semibold !text-sm mb-0',
                options: '!flex !flex-col gap-4 mt-3',
              }"
            />
            <div class="flex justify-end mt-6">
              <rs-button type="button" variant="primary" @click="nextStep">
                Seterusnya
              </rs-button>
            </div>
          </div>

          <!-- Step 2: Maklumat Individu -->
          <div v-if="currentStep === 2" class="space-y-6">
            <h2 class="text-lg font-semibold">
              {{
                formData.isWakil
                  ? "Maklumat Individu Dibantu"
                  : "Maklumat Individu"
              }}
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormKit
                v-model="formData.namaPenuh"
                label="Nama Penuh"
                type="text"
                validation="required"
                validation-visibility="dirty"
              />

              <FormKit
                v-model="formData.noKadPengenalan"
                label="No. Kad Pengenalan"
                type="text"
                validation="required|length:12"
                validation-visibility="dirty"
              />

              <FormKit
                v-model="formData.emel"
                label="Emel"
                type="email"
                validation="required|email"
                validation-visibility="dirty"
              />

              <FormKit
                v-model="formData.noTelefon"
                label="No. Telefon"
                type="tel"
                validation="required|matches:/^[0-9]{3}-[0-9]{7}$/"
                validation-visibility="dirty"
                help="Format: xxx-xxxxxxx"
              />
            </div>

            <div class="space-y-4">
              <FormKit
                v-model="formData.alamatBaris1"
                label="Alamat Baris 1"
                type="text"
                validation="required"
                validation-visibility="dirty"
              />

              <FormKit
                v-model="formData.alamatBaris2"
                label="Alamat Baris 2"
                type="text"
              />

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormKit
                  v-model="formData.bandar"
                  label="Bandar"
                  type="text"
                  validation="required"
                  validation-visibility="dirty"
                />

                <FormKit
                  v-model="formData.poskod"
                  label="Poskod"
                  type="text"
                  validation="required|number|length:5"
                  validation-visibility="dirty"
                />

                <FormKit
                  v-model="formData.negeri"
                  label="Negeri"
                  type="text"
                  validation="required"
                  validation-visibility="dirty"
                />
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormKit
                  v-model="formData.daerah"
                  label="Daerah"
                  type="text"
                  validation="required"
                  validation-visibility="dirty"
                />
              </div>

              <FormKit
                v-model="formData.lokasi"
                label="Lokasi"
                type="text"
                validation="required"
                validation-visibility="dirty"
                help="Masukkan koordinat lokasi atau alamat lengkap"
              />
            </div>

            <!-- Maklumat Pengadu (jika wakil) -->
            <div v-if="formData.isWakil" class="space-y-6 mt-6">
              <h2 class="text-lg font-semibold">Maklumat Pengadu</h2>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormKit
                  v-model="formData.namaPengadu"
                  label="Nama"
                  type="text"
                  validation="required"
                  validation-visibility="dirty"
                />

                <FormKit
                  v-model="formData.noKadPengenalanPengadu"
                  label="No. Kad Pengenalan"
                  type="text"
                  validation="required|length:12"
                  validation-visibility="dirty"
                />

                <FormKit
                  v-model="formData.emelPengadu"
                  label="Emel"
                  type="email"
                  validation="required|email"
                  validation-visibility="dirty"
                />

                <FormKit
                  v-model="formData.noTelefonPengadu"
                  label="No. Telefon"
                  type="tel"
                  validation="required|matches:/^[0-9]{3}-[0-9]{7}$/"
                  validation-visibility="dirty"
                  help="Format: xxx-xxxxxxx"
                />
              </div>
            </div>

            <div class="flex justify-between mt-6">
              <rs-button variant="primary-outline" @click="prevStep">
                Kembali
              </rs-button>
              <rs-button type="button" variant="primary" @click="nextStep">
                Seterusnya
              </rs-button>
            </div>
          </div>

          <!-- Step 3: Butiran Aduan -->
          <div v-if="currentStep === 3" class="space-y-6">
            <h2 class="text-lg font-semibold">Butiran Aduan</h2>

            <div class="space-y-4">
              <FormKit
                v-model="formData.penyataanMasalah"
                label="Penyataan Masalah"
                type="textarea"
                rows="4"
                validation="required"
                validation-visibility="dirty"
              />

              <FormKit
                v-model="formData.ringkasanAduan"
                label="Ringkasan Aduan"
                type="textarea"
                rows="4"
                validation="required"
                validation-visibility="dirty"
              />

              <FormKit
                v-model="formData.lampiran"
                label="Lampiran/Gambar"
                type="file"
                multiple
                accept=".jpg,.jpeg,.png,.pdf"
                help="Format yang diterima: JPG, PNG, PDF"
              />
            </div>

            <div class="flex justify-between mt-6">
              <rs-button variant="primary-outline" @click="prevStep">
                Kembali
              </rs-button>
              <rs-button type="button" variant="primary" @click="nextStep">
                Seterusnya
              </rs-button>
            </div>
          </div>

          <!-- Step 4: Pengesahan -->
          <div v-if="currentStep === 4" class="space-y-6">
            <h2 class="text-lg font-semibold">Pengesahan</h2>

            <div class="bg-gray-50 p-6 rounded-lg space-y-4">
              <h3 class="font-medium">Maklumat Individu Dibantu</h3>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-gray-600">Nama Penuh</p>
                  <p class="font-medium">{{ formData.namaPenuh }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600">No. Kad Pengenalan</p>
                  <p class="font-medium">{{ formData.noKadPengenalan }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600">Emel</p>
                  <p class="font-medium">{{ formData.emel }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-600">No. Telefon</p>
                  <p class="font-medium">{{ formData.noTelefon }}</p>
                </div>
              </div>

              <h3 class="font-medium mt-6">Alamat</h3>
              <div class="space-y-2">
                <p class="font-medium">{{ formData.alamatBaris1 }}</p>
                <p class="font-medium">{{ formData.alamatBaris2 }}</p>
                <p class="font-medium">
                  {{ formData.poskod }} {{ formData.bandar }},
                  {{ formData.negeri }}
                </p>
              </div>

              <h3 class="font-medium mt-6">Butiran Aduan</h3>
              <div class="space-y-2">
                <p class="text-sm text-gray-600">Penyataan Masalah</p>
                <p class="font-medium">{{ formData.penyataanMasalah }}</p>
                <p class="text-sm text-gray-600 mt-4">Ringkasan Aduan</p>
                <p class="font-medium">{{ formData.ringkasanAduan }}</p>
              </div>

              <div v-if="formData.isWakil" class="mt-6">
                <h3 class="font-medium">Maklumat Pengadu</h3>
                <div class="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <p class="text-sm text-gray-600">Nama</p>
                    <p class="font-medium">{{ formData.namaPengadu }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-600">No. Kad Pengenalan</p>
                    <p class="font-medium">
                      {{ formData.noKadPengenalanPengadu }}
                    </p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-600">Emel</p>
                    <p class="font-medium">{{ formData.emelPengadu }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-600">No. Telefon</p>
                    <p class="font-medium">{{ formData.noTelefonPengadu }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex justify-between mt-6">
              <rs-button variant="primary-outline" @click="prevStep">
                Kembali
              </rs-button>
              <rs-button type="submit" variant="primary" @click="handleSubmit">
                Hantar Aduan
              </rs-button>
            </div>
          </div>
        </FormKit>
      </template>
    </rs-card>

    <rs-modal
      v-model="showConfirmModal"
      title="Pengesahan"
      :show-close="true"
      @close="handleCancel"
      position="center"
      ok-title="Ya"
      :ok-callback="handleConfirm"
      cancel-title="Tidak"
      :cancel-callback="handleCancel"
    >
      <template #default>
        <p class="text-center mb-6">
          Adakah anda pasti untuk menghantar aduan ini?
        </p>
      </template>

      <!-- <template #footer>
        <div class="flex justify-end gap-4">
          <rs-button variant="primary-outline" @click="handleCancel">
            Tidak
          </rs-button>
          <rs-button variant="primary" @click="handleConfirm"> Ya </rs-button>
        </div>
      </template> -->
    </rs-modal>
  </div>
</template>
