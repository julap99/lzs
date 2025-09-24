<template>
  <FormKit
    type="form"
    @submit="$emit('next-step')"
    :actions="false"
    id="sectionB3"
  >
    <h3 class="text-lg font-semibold mb-4">
      3. Maklumat Perbankan Tanggungan
    </h3>

    <div class="mb-6">
      <!-- Kaedah Pembayaran -->
      <div class="mb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="block text-sm font-medium text-black-700"
              >Adakah tanggungan mempunyai akaun bank?</label
            >
            <div class="mb-6">
              <FormKit
                type="radio"
                name="ada_akaun_bank_tanggungan"
                :options="[
                  { label: 'Ya', value: 'Y' },
                  { label: 'Tidak', value: 'T' },
                ]"
                validation="required"
                v-model="
                  getCurrentTanggungan().ada_akaun_bank_tanggungan
                "
                :validation-messages="{
                  required:
                    'Sila pilih sama ada tanggungan mempunyai akaun bank',
                }"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Adakah tanggungan muflis/disenarai hitam oleh bank? -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="space-y-2">
          <label class="block text-sm font-medium text-black-700"
            >Adakah tanggungan muflis/disenarai hitam oleh bank?
          </label>
          <div class="mb-6">
            <FormKit
              type="radio"
              name="muflis_disenarai_hitam_tanggungan"
              :options="[
                { label: 'Ya', value: 'Y' },
                { label: 'Tidak', value: 'T' },
              ]"
              v-model="getCurrentTanggungan().muflis_disenarai_hitam"
            />
          </div>
        </div>
      </div>

      <!-- A. Jika mempunyai akaun bank -->
      <div
        v-if="
          getCurrentTanggungan().ada_akaun_bank_tanggungan === 'Y'
        "
        class="mb-6"
      >
        <h5 class="text-md font-medium mb-4">Maklumat Akaun Bank</h5>

        <div
          v-for="(account, index) in getCurrentTanggungan().bank_accounts"
          :key="index"
          class="mb-6 p-4 border border-gray-200 rounded-lg"
        >
          <div class="flex justify-between items-center mb-4">
            <h6 class="text-sm font-medium">
              Akaun Bank #{{ index + 1 }}
            </h6>
            <button
              type="button"
              @click="removeBankAccount(index)"
              class="text-red-500 hover:text-red-700"
            >
              <Icon name="mdi:delete" size="1.1rem" />
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Nama Bank -->
            <FormKit
              type="select"
              :name="`bankTanggungan${index}NamaBank`"
              label="Nama Bank"
              placeholder="Pilih nama bank"
              :options="bankOptions"
              validation="required"
              v-model="account.nama_bank"
            />

            <!-- Swift Code (Read Only) -->
            <!-- <FormKit
              v-if="account.nama_bank"
              type="text"
              :name="`bankTanggungan${index}SwiftCode`"
              label="Swift Code"
              :value="getSwiftCodeForBank(account.nama_bank)"
              readonly
              help="Swift Code dipaparkan secara automatik"
            /> -->

            <!-- No. Akaun Bank -->
            <FormKit
              type="text"
              :name="`bankTanggungan${index}NoAkaun`"
              label="No. Akaun Bank"
              validation="required"
              v-model="account.no_akaun_bank"
            />

            <!-- Nama Pemegang Akaun -->
            <FormKit
              type="text"
              :name="`bankTanggungan${index}NamaPemegang`"
              label="Nama Pemegang Akaun"
              validation="required"
              v-model="account.nama_pemegang_akaun"
            />

            <!-- Jenis Akaun -->
            <FormKit
              type="select"
              :name="`bankTanggungan${index}JenisAkaun`"
              label="Jenis Akaun"
              placeholder="Pilih jenis akaun"
              :options="[
                { label: 'Individu', value: 'individu' },
                { label: 'Bersama', value: 'bersama' },
              ]"
              validation="required"
              v-model="account.jenis_akaun"
            />

            <!-- Multiple Pengenalan IDs (show only if jenis akaun = Bersama) -->
            <div
              v-if="account.jenis_akaun === 'bersama'"
              class="md:col-span-2"
            >
              <label class="block text-sm font-medium text-black-700 mb-4"
                >Maklumat Pengenalan ID (Maksimum 3)</label
              >

              <!-- Existing single fields for backward compatibility -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <FormKit
                  type="text"
                  :name="`bankTanggungan${index}IdPengenalan`"
                  label="Pengenalan Id "
                  validation="required"
                  v-model="account.id_pengenalan"
                />
                <FormKit
                  type="text"
                  :name="`bankTanggungan${index}NamaBersama`"
                  label="Nama "
                  validation="required"
                  v-model="account.nama_bersama"
                />
                <FormKit
                  type="text"
                  :name="`bankTanggungan${index}Hubungan`"
                  label="Hubungan "
                  validation="required"
                  v-model="account.hubungan"
                />
              </div>

              <!-- Multiple pengenalan IDs -->
              <div
                v-for="(pengenalan, idIndex) in account.pengenalan_ids"
                :key="idIndex"
                class="mb-4 p-3 border border-gray-200 rounded-lg"
              >
                <div class="flex justify-end items-center mb-2">
                  <button
                    type="button"
                    @click="removePengenalanId(index, idIndex)"
                    class="text-red-500 hover:text-red-700"
                  >
                    <Icon name="mdi:delete" size="1rem" />
                  </button>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormKit
                    type="text"
                    :name="`bankTanggungan${index}PengenalanId${idIndex}`"
                    label="Pengenalan Id"
                    validation="required"
                    v-model="pengenalan.id"
                  />
                  <FormKit
                    type="text"
                    :name="`bankTanggungan${index}PengenalanNama${idIndex}`"
                    label="Nama"
                    validation="required"
                    v-model="pengenalan.nama"
                  />
                  <FormKit
                    type="text"
                    :name="`bankTanggungan${index}PengenalanHubungan${idIndex}`"
                    label="Hubungan"
                    validation="required"
                    v-model="pengenalan.hubungan"
                  />
                </div>
              </div>

              <!-- Add button for pengenalan ID -->
              <div class="flex justify-center">
                <rs-button
                  v-if="account.pengenalan_ids.length < 2"
                  type="button"
                  variant="secondary"
                  size="sm"
                  @click="addPengenalanId(index)"
                >
                  <Icon name="mdi:plus" class="mr-1" size="0.8rem" />
                  Tambah Pengenalan ID
                </rs-button>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-center mt-4">
          <rs-button
            variant="secondary"
            @click="addBankAccount"
            type="button"
          >
            <Icon name="mdi:plus" class="mr-1" size="1rem" />
            Tambah Akaun Bank
          </rs-button>
        </div>
      </div>

      <!-- B. Jika tidak mempunyai akaun bank -->
      <div
        v-if="
          getCurrentTanggungan().ada_akaun_bank_tanggungan === 'T'
        "
        class="mb-6"
      >
        <h5 class="text-md font-medium mb-4">Sebab Tiada Akaun Bank</h5>
        <div class="md:col-span-2">
          <FormKit
            type="select"
            name="sebab_tiada_akaun_tanggungan"
            label="Sebab"
            :options="noPaymentReasonOptions"
            validation="required"
            placeholder="Pilih sebab tiada akaun bank"
            v-model="getCurrentTanggungan().sebab_tiada_akaun"
            :validation-messages="{
              required: 'Sila pilih sebab tiada akaun bank',
            }"
          />
        </div>

        <!-- Lain-lain Sebab Tiada Akaun -->
        <div v-if="showLainLainSebabTiadaAkaunTanggungan" class="mt-4">
          <FormKit
            type="text"
            name="lain_lain_sebab_tiada_akaun_tanggungan"
            label="Lain-lain Sebab Tiada Akaun"
            placeholder="Sila nyatakan sebab lain"
            validation="required"
            :validation-messages="{
              required: 'Sila nyatakan sebab lain',
            }"
            v-model="getCurrentTanggungan().lain_lain_sebab_tiada_akaun"
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
          >Maklumat Pendidikan</rs-button
        >
      </div>
    </div>
  </FormKit>
</template>

<script setup>
import { computed } from 'vue'

// Props
const props = defineProps({
  getCurrentTanggungan: {
    type: Function,
    required: true
  },

})

// Emits (navigation + save only)
const emit = defineEmits([
  'next-step', 
  'prev-step', 
  'save-step'
])

// Local options: Sebab Tiada Akaun Bank
const noPaymentReasonOptions = [
  { label: 'Bukan Warganegara', value: 'bukan-warganegara' },
  { label: 'Sakit Terlantar', value: 'sakit' },
  { label: 'Lain-lain', value: 'lain-lain' }
]

// Local options: Bank list with SWIFT codes
const bankOptions = [
  { label: 'Maybank', value: 'maybank', swiftCode: 'MBBEMYKL' },
  { label: 'CIMB', value: 'cimb', swiftCode: 'CIBBMYKL' },
  { label: 'RHB', value: 'rhb', swiftCode: 'RHBBMYKL' },
  { label: 'Bank Islam', value: 'bank-islam', swiftCode: 'BIMBMYKL' },
  { label: 'Bank Rakyat', value: 'bank-rakyat', swiftCode: 'BKRMYKL' },
  { label: 'Public Bank', value: 'public-bank', swiftCode: 'PBBEMYKL' },
  { label: 'Hong Leong Bank', value: 'hong-leong', swiftCode: 'HLBBMYKL' },
  { label: 'Ambank', value: 'ambank', swiftCode: 'ARBKMYKL' },
  { label: 'BSN', value: 'bsn', swiftCode: 'BSNAMYKL' },
  { label: 'Affin Bank', value: 'affin', swiftCode: 'PHBMMYKL' },
  { label: 'UOB', value: 'uob', swiftCode: 'UOVBMYKL' },
  { label: 'OCBC', value: 'ocbc', swiftCode: 'OCBCMYKL' },
  { label: 'Standard Chartered', value: 'standard-chartered', swiftCode: 'SCBLMYKL' },
  { label: 'Alliance Bank', value: 'alliance', swiftCode: 'MFBBMYKL' },
  { label: 'Agrobank', value: 'agrobank', swiftCode: 'AGOBMYKL' }
]

// Local computed: show input for Lain-lain sebab
const showLainLainSebabTiadaAkaunTanggungan = computed(() => {
  const current = props.getCurrentTanggungan?.()
  return current?.sebab_tiada_akaun === 'lain-lain' || current?.sebab_tiada_akaun_tanggungan === 'lain-lain'
})

// Local helper to get swift code for selected bank
// const getSwiftCodeForBank = (bankValue) => {
//   const selectedBank = bankOptions.find((bank) => bank.value === bankValue)
//   return selectedBank ? selectedBank.swiftCode : ''
// }

// Local handlers for accounts and pengenalan IDs
const addBankAccount = () => {
  const current = props.getCurrentTanggungan?.()
  if (!current) return
  if (!Array.isArray(current.bank_accounts)) current.bank_accounts = []
  current.bank_accounts.push({
    nama_bank: '',
    no_akaun_bank: '',
    nama_pemegang_akaun: '',
    jenis_akaun: 'individu',
    id_pengenalan: '',
    nama_bersama: '',
    hubungan: '',
    pengenalan_ids: []
  })
}

const removeBankAccount = (index) => {
  const current = props.getCurrentTanggungan?.()
  if (!current || !Array.isArray(current.bank_accounts)) return
  current.bank_accounts.splice(index, 1)
}

const addPengenalanId = (accountIndex) => {
  const current = props.getCurrentTanggungan?.()
  if (!current || !Array.isArray(current.bank_accounts)) return
  const account = current.bank_accounts[accountIndex]
  if (!account) return
  if (!Array.isArray(account.pengenalan_ids)) account.pengenalan_ids = []
  if (account.pengenalan_ids.length >= 2) return
  account.pengenalan_ids.push({ id: '', nama: '', hubungan: '' })
}

const removePengenalanId = (accountIndex, idIndex) => {
  const current = props.getCurrentTanggungan?.()
  if (!current || !Array.isArray(current.bank_accounts)) return
  const account = current.bank_accounts[accountIndex]
  if (!account || !Array.isArray(account.pengenalan_ids)) return
  account.pengenalan_ids.splice(idIndex, 1)
}
</script>
