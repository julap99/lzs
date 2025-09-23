<template>
  <FormKit
    type="form"
    @submit="$emit('next-step')"
    :actions="false"
    id="sectionA5"
  >
    <h3 class="text-lg font-semibold mb-4">5. Maklumat Perbankan</h3>

    <div class="mb-6">
      <!-- Adakah anda mempunyai akaun bank? -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="space-y-2">
          <label class="block text-sm font-medium text-black-700"
            >Adakah anda mempunyai akaun bank?
          </label>
          <div class="mb-6">
            <FormKit
              type="radio"
              name="kaedah_pembayaran"
              :options="paymentMethodOptionsMain"
              validation="required"
              v-model="formData.kaedah_pembayaran"
              :validation-messages="{
                required: 'Sila pilih sama ada anda mempunyai akaun bank',
              }"
            />
          </div>
        </div>
      </div>

      <!-- Adakah anda muflis/disenarai hitam oleh bank? -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="space-y-2">
          <label class="block text-sm font-medium text-black-700"
            >Adakah anda muflis/disenarai hitam oleh bank?
          </label>
          <div class="mb-6">
            <FormKit
              type="radio"
              name="muflis_disenarai_hitam"
              :options="[
                { label: 'Ya', value: 'Y' },
                { label: 'Tidak', value: 'T' },
              ]"
              v-model="formData.muflis_disenarai_hitam"
            />
          </div>
        </div>
      </div>

      <!-- A. Jika mempunyai akaun bank -->
      <div v-if="formData.kaedah_pembayaran === 'ya'" class="mb-6">
        <h5 class="text-md font-medium mb-4">Maklumat Akaun Bank</h5>

        <div
          v-for="(account, index) in formData.bank_accounts"
          :key="index"
          class="mb-6 p-4 border border-gray-200 rounded-lg"
        >
          <div class="flex justify-between items-center mb-4">
            <h6 class="text-sm font-medium">
              Akaun Bank #{{ index + 1 }}
            </h6>
            <button
              type="button"
              @click="$emit('remove-bank-account', index)"
              class="text-red-500 hover:text-red-700"
            >
              <Icon name="mdi:delete" size="1.1rem" />
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Nama Bank -->
            <FormKit
              type="select"
              :name="`bank${index}NamaBank`"
              label="Nama Bank"
              placeholder="Pilih nama bank"
              :options="bankOptions"
              validation="required"
              v-model="account.nama_bank"
            />

            <!-- No. Akaun Bank -->
            <FormKit
              type="text"
              :name="`bank${index}NoAkaun`"
              label="No. Akaun Bank"
              validation="required"
              v-model="account.no_akaun_bank"
            />

            <!-- Nama Pemegang Akaun -->
            <FormKit
              type="text"
              :name="`bank${index}NamaPemegang`"
              label="Nama Pemegang Akaun "
              validation="required"
              v-model="account.nama_pemegang_akaun"
            />

            <!-- Jenis Akaun -->
            <FormKit
              type="select"
              :name="`bank${index}JenisAkaun`"
              label="Jenis Akaun "
              placeholder="Pilih jenis akaun"
              :options="[
                { label: 'Individu', value: 'individu' },
                { label: 'Bersama', value: 'bersama' },
              ]"
              validation="required"
              v-model="account.jenis_akaun"
            />

            <!-- Pengenalan Id (show only if jenis akaun = Bersama) -->
            <FormKit
              v-if="account.jenis_akaun === 'bersama'"
              type="text"
              :name="`bank${index}IdPengenalan`"
              label="Pengenalan Id "
              validation="required"
              v-model="account.id_pengenalan"
            />

            <!-- Nama (show only if jenis akaun = Bersama) -->
            <FormKit
              v-if="account.jenis_akaun === 'bersama'"
              type="text"
              :name="`bank${index}NamaBersama`"
              label="Nama "
              validation="required"
              v-model="account.nama_bersama"
            />

            <!-- Tambah Hubungan (show only if jenis akaun = Bersama) -->
            <FormKit
              v-if="account.jenis_akaun === 'bersama'"
              type="text"
              :name="`bank${index}Hubungan`"
              label="Hubungan "
              validation="required"
              v-model="account.hubungan"
            />
          </div>
        </div>

        <div class="flex justify-center mt-4">
          <rs-button
            variant="secondary"
            @click="$emit('add-bank-account')"
            type="button"
          >
            <Icon name="mdi:plus" class="mr-1" size="1rem" />
            Tambah Akaun Bank
          </rs-button>
        </div>
      </div>

      <!-- B. Jika tidak mempunyai akaun bank -->
      <div v-if="formData.kaedah_pembayaran === 'tidak'" class="mb-6">
        <h5 class="text-md font-medium mb-4">Sebab Tiada Akaun Bank</h5>
        <div class="md:col-span-2">
          <FormKit
            type="select"
            name="sebab_tiada_akaun"
            label="Sebab "
            :options="noPaymentReasonOptions"
            validation="required"
            placeholder="Pilih sebab tiada akaun bank"
            v-model="formData.sebab_tiada_akaun"
            :validation-messages="{
              required: 'Sila pilih sebab tiada akaun bank',
            }"
          />
        </div>

        <!-- Lain-lain Sebab Tiada Akaun -->
        <div v-if="showLainLainSebabTiadaAkaun" class="mt-4">
          <FormKit
            type="text"
            name="lain_lain_sebab_tiada_akaun"
            label="Lain-lain Sebab Tiada Akaun"
            placeholder="Sila nyatakan sebab lain"
            validation="required"
            :validation-messages="{
              required: 'Sila nyatakan sebab lain',
            }"
            v-model="formData.lain_lain_sebab_tiada_akaun"
          />
        </div>
      </div>
    </div>

    <div class="flex justify-between gap-3 mt-6">
      <rs-button
        type="button"
        variant="primary-outline"
        @click="$emit('prev-step')"
        >Kembali</rs-button
      >
      <div class="flex gap-3">
        <rs-button
          type="button"
          variant="secondary"
          @click="$emit('save-step')"
          >Simpan</rs-button
        >
        <rs-button type="button" variant="primary" @click="$emit('next-step')"
          >Maklumat Kesihatan</rs-button
        >
      </div>
    </div>
  </FormKit>
</template>

<script setup>
// Props
const props = defineProps({
  formData: {
    type: Object,
    required: true
  },
  paymentMethodOptionsMain: {
    type: Array,
    default: () => []
  },
  bankOptions: {
    type: Array,
    default: () => []
  },
  noPaymentReasonOptions: {
    type: Array,
    default: () => []
  },
  showLainLainSebabTiadaAkaun: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['next-step', 'prev-step', 'save-step', 'add-bank-account', 'remove-bank-account'])
</script>
