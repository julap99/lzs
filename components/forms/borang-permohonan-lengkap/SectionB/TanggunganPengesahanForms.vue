<template>
  <FormKit
    type="form"
    @submit="$emit('next-step')"
    :actions="false"
    id="sectionB10">
    <h3 class="text-lg font-semibold mb-4">Maklumat Perakuan Pemohon</h3>

    <div class="mb-6">
      <h4 class="font-medium mb-3">Bantuan Penolong Amil</h4>
      <div class="flex flex-col gap-2">
        <label class="font-medium"
          >Adakah anda dibantu oleh penolong Amil</label
        >
        <FormKit
          type="radio"
          name="dibantu_penolong_amil"
          :options="['Ya', 'Tidak']"
          validation="required"
          v-model="dibantuPenolongAmil" />
      </div>

      <div
        v-if="dibantuPenolongAmil === 'Ya'"
        class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <FormKit
          type="select"
          name="kariah_bantuan"
          label="Kariah"
          :options="kariahOptions"
          placeholder="Pilih kariah"
          validation="required"
          v-model="formData.pengesahan.kariah_bantuan" />
        <FormKit
          type="select"
          name="nama_penolong_amil_bantuan"
          label="Nama Penolong Amil"
          :options="pakOfficersOptionsBantuan"
          placeholder="Pilih nama penolong amil"
          validation="required"
          v-model="formData.pengesahan.nama_penolong_amil_bantuan" />

        <FormKit
          type="date"
          name="tarikh_bantuan"
          label="Tarikh Bantuan"
          validation="required"
          v-model="formData.pengesahan.tarikh_bantuan" />
      </div>
    </div>

    <!-- <div class="mb-6" v-if="screenType === 'selfservice'">
      <h4 class="font-medium mb-3">Bantuan Penolong Amil</h4>
      <div class="flex flex-col gap-2">
        <label class="font-medium"
          >Adakah Penolong Amil membantu semasa pengisian maklumat?</label
        >
        <FormKit
          type="radio"
          name="dibantu_penolong_amil"
          :options="['Ya', 'Tidak']"
          :validation="screenType === 'selfservice' ? 'required' : ''"
          v-model="dibantuPenolongAmil" />
      </div>

      <div
        v-if="dibantuPenolongAmil === 'Ya'"
        class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <FormKit
          type="select"
          name="kariah_bantuan"
          label="Nama Kariah/Institusi"
          :options="kariahOptions"
          placeholder="Pilih kariah"
          :validation="screenType === 'selfservice' ? 'required' : ''"
          v-model="formData.pengesahan.kariah_bantuan" />
        <FormKit
          type="select"
          name="nama_penolong_amil_bantuan"
          label="Nama Penolong Amil"
          :options="pakOfficersOptionsBantuan"
          placeholder="Pilih nama penolong amil"
          :validation="screenType === 'selfservice' ? 'required' : ''"
          v-model="formData.pengesahan.nama_penolong_amil_bantuan" />

        <FormKit
          type="date"
          name="tarikh_bantuan"
          label="Tarikh Bantuan"
          :validation="screenType === 'selfservice' ? 'required' : ''"
          v-model="formData.pengesahan.tarikh_bantuan" />
      </div>
    </div> -->

    <!-- Hubungan kekeluargaan dengan kakitangan LZS? -->
    <div class="mb-6">
      <div class="flex flex-col gap-2">
        <label class="font-medium"
          >Hubungan kekeluargaan dengan kakitangan LZS?</label
        >
        <FormKit
          type="radio"
          name="hubungan_kakitangan_lzs"
          :options="['Ya', 'Tidak']"
          validation="required"
          v-model="hubunganKakitanganLZS" />
      </div>

      <div
        v-if="hubunganKakitanganLZS === 'Ya'"
        class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <FormKit
          type="text"
          name="nama_kakitangan"
          label="Nama Kakitangan"
          validation="required"
          v-model="formData.pengesahan.nama_kakitangan" />

        <FormKit
          type="text"
          name="jawatan_kakitangan"
          label="Jawatan"
          validation="required"
          v-model="formData.pengesahan.jawatan_kakitangan" />

        <FormKit
          type="text"
          name="pejabat_kakitangan"
          label="Pejabat"
          validation="required"
          v-model="formData.pengesahan.pejabat_kakitangan" />

        <FormKit
          type="text"
          name="hubungan_kakitangan"
          label="Hubungan"
          validation="required"
          v-model="formData.pengesahan.hubungan_kakitangan" />
      </div>
    </div>

    <!-- Hubungan kekeluargaan dengan Penolong Amil? -->
    <div class="mb-6">
      <div class="flex flex-col gap-2 mt-6">
        <label class="font-medium"
          >Hubungan kekeluargaan dengan Penolong Amil?</label
        >
        <FormKit
          type="radio"
          name="hubungan_penolong_amil"
          :options="['Ya', 'Tidak']"
          validation="required"
          v-model="hubunganPAK"
          @input="formData.pengesahan.hubungan_pak = hubunganPAK" />
      </div>

      <div
        v-if="hubunganPAK === 'Ya'"
        class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <FormKit
          type="select"
          name="kariah_hubungan_pak"
          label="Nama Kariah/Institusi"
          :options="kariahOptions"
          placeholder="Pilih kariah"
          validation="required"
          v-model="formData.pengesahan.kariah_hubungan_pak" />

        <FormKit
          type="select"
          name="nama_pak_hubungan"
          label="Nama Penolong Amil"
          :options="pakOfficersOptionsHubungan"
          placeholder="Pilih nama penolong amil"
          validation="required"
          v-model="formData.pengesahan.nama_pak_hubungan" />
      </div>
    </div>

    <!-- Perakuan & Persetujuan -->
    <div class="mb-6">
      <h4 class="font-medium mb-3">Perakuan & Persetujuan</h4>

      <!-- PDPA Consent -->
      <div
        class="bg-blue-50 border border-blue-200 rounded-lg p-4 h-full flex flex-col justify-between">
        <p class="text-sm leading-relaxed text-gray-800">
          Dengan nama Allah S.W.T, saya mengesahkan bahawa segala maklumat dan
          data yang diberikan di dalam Borang Permohonan Agihan dan lampiran
          adalah BENAR, TEPAT, LENGKAP dan TERKINI. Saya dengan ini bersetuju
          memberi persetujuan secara nyata (explicit consent) kepada Zakat
          Selangor untuk mengumpul, memproses, menggunakan data peribadi saya
          dan tanggungan saya (jika ada) bagi tujuan pentadbiran, kajian,
          dakwah, promosi dan aktiviti-aktiviti lain berkaitan fungsi Zakat
          Selangor seperti yang dinyatakan di dalam Notis Privasi Zakat Selangor
          di https://www.zakatselangor.com.my.
        </p>
        <div class="mt-4">
          <label class="font-medium">Saya setuju</label>
          <FormKit
            type="checkbox"
            name="pdpa_consent"
            :value="true"
            validation="required"
            v-model="formData.pengesahan.pdpa_consent" />
        </div>
      </div>
    </div>

    <!-- Tandatangan Digital (tiada di rujukan AS/UP/02) -->

    <div class="mb-6">
      <FormKit
        type="date"
        name="tarikh_perakuan"
        label="Tarikh Perakuan"
        validation="required"
        :readonly="true"
        v-model="formData.pengesahan.tarikh_perakuan" />
    </div>

    <div class="flex justify-between gap-3 mt-6">
      <rs-button
        type="button"
        variant="primary-outline"
        @click="$emit('prev-step')"
        >Kembali</rs-button
      >
      <div class="flex gap-3">
        <rs-button type="button" variant="secondary" @click="$emit('save-step')"
          >Simpan</rs-button
        >
        <rs-button type="button" variant="primary" @click="$emit('next-step')"
          >Pengesahan Pendapatan</rs-button
        >
      </div>
    </div>
  </FormKit>
</template>

<script setup>
import { ref, watch, computed } from "vue";

// Props
const props = defineProps({
  screenType: {
    type: String,
    default: "selfservice",
  },
  // managed locally now
  formData: {
    type: Object,
    required: true,
  },
});

// Emits
const emit = defineEmits(["next-step", "prev-step", "save-step"]);

// Local state synced with formData (to mirror AS/UP/02 behavior)
const hubunganKakitanganLZS = ref(
  props.formData.pengesahan?.hubungan_kakitangan_lzs || ""
);
const hubunganPAK = ref(props.formData.pengesahan?.hubungan_pak || "");
const dibantuPenolongAmil = ref(
  props.formData.pengesahan?.dibantu_penolong_amil || ""
);

watch(hubunganKakitanganLZS, (value) => {
  if (props.formData && props.formData.pengesahan) {
    props.formData.pengesahan.hubungan_kakitangan_lzs = value;
  }
});

// Local options: Kariah and PAK officers mapping
const kariahOptions = [
  { label: "Kariah Masjid Al-Hidayah", value: "masjid-al-hidayah" },
  { label: "Kariah Masjid Al-Ikhlas", value: "masjid-al-ikhlas" },
];

const pakOfficersByKariah = {
  "masjid-al-hidayah": [
    { label: "Ustaz Ahmad bin Abdullah", value: "ustaz-ahmad-abdullah" },
    { label: "Ustazah Siti binti Mohamed", value: "ustazah-siti-mohamed" },
    { label: "Ustaz Mohd bin Hassan", value: "ustaz-mohd-hassan" },
  ],
  "masjid-al-ikhlas": [
    { label: "Ustaz Ismail bin Omar", value: "ustaz-ismail-omar" },
    { label: "Ustazah Fatimah binti Ali", value: "ustazah-fatimah-ali" },
    { label: "Ustaz Kamal bin Ibrahim", value: "ustaz-kamal-ibrahim" },
  ],
};

// Computed options based on selected kariah
const pakOfficersOptionsBantuan = computed(() => {
  const key = props.formData?.pengesahan?.kariah_bantuan;
  return key ? pakOfficersByKariah[key] || [] : [];
});

const pakOfficersOptionsHubungan = computed(() => {
  const key = props.formData?.pengesahan?.kariah_hubungan_pak;
  return key ? pakOfficersByKariah[key] || [] : [];
});

watch(hubunganPAK, (value) => {
  if (props.formData && props.formData.pengesahan) {
    props.formData.pengesahan.hubungan_pak = value;
  }
});

watch(dibantuPenolongAmil, (value) => {
  if (props.formData && props.formData.pengesahan) {
    props.formData.pengesahan.dibantu_penolong_amil = value;
  }
});
</script>
