<script setup>
import { ref, computed, onMounted } from "vue";
import { useUserStore } from "~/stores/user";
import { useToast } from "vue-toastification";

definePageMeta({
  title: "Lengkapkan Profil Penolong Amil",
  layout: "default",
});

const { $swal } = useNuxtApp();
const route = useRoute();
const userStore = useUserStore();
const toast = useToast();

// Breadcrumb
const breadcrumb = [
  { title: "Utama", path: "/" },
  { title: "BF-PA", path: "/BF-PA" },
  { title: "Penolong Amil", path: "/BF-PA/PP/penolong-amil" },
  { title: "Lengkapkan Profil", path: "/BF-PA/PP/penolong-amil/profile-complete" },
];

// ======= View/Edit Mode =======
const isEdit = ref(false);
const startEdit = () => (isEdit.value = true);
const cancelEdit = () => {
  // rollback ke snapshot asal
  Object.assign(profileForm.value, JSON.parse(JSON.stringify(originalSnapshot.value)));
  supportDoc.value = null;
  isEdit.value = false;
};

// ======= Form data (tanpa Pendidikan & Pekerjaan) =======
const profileForm = ref({
  // Maklumat Profil (read-only asal)
  statusLantikan: "Aktif", // Diambil dari konfigurasi NAS (mock)
  nama: "Ahmad bin Abdullah", // read-only
  noKadPengenalan: "800101015432", // read-only, 12 digit tanpa dash
  emel: "ahmad.abdullah@email.com", // optional, valid email
  noTelefon: "03-87345678",
  noTelefonBimbit: "0123456789",

  // Alamat
  alamat1: "No. 15, Jalan Melati",
  alamat2: "Taman Sri Melati",
  alamat3: "Seksyen 3",
  poskod: "43000",
  bandar: "Kajang",
  daerah: "Hulu Langat",
  negeri: "Selangor",

  // Foto (kekalkan seperti asal)
  photo: null,

  // Maklumat Bank (read-only asal; wajib jika status=Aktif)
  namaBank: "Maybank",
  noAkaunBank: "123456789012",
});

// Snapshot untuk cancel
const originalSnapshot = ref({});
onMounted(() => {
  originalSnapshot.value = JSON.parse(JSON.stringify(profileForm.value));

  // Sembunyi sidebar jika perlu
  const vLayout = document.querySelector(".v-layout");
  if (vLayout) vLayout.classList.add("menu-hide");
  const menuOverlay = document.querySelector(".menu-overlay");
  if (menuOverlay) menuOverlay.classList.add("hide");
});

// ======= Derived helpers & validation =======
const alamatGabungan = computed(() => {
  const { alamat1, alamat2, alamat3, poskod, bandar, daerah, negeri } = profileForm.value;
  return [alamat1, alamat2, alamat3, `${poskod} ${bandar}`, daerah, negeri].filter(Boolean).join(", ");
});
const isEmailValid = computed(() =>
  !profileForm.value.emel ||
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileForm.value.emel)
);
const isIdValid = computed(() => /^\d{12}$/.test(profileForm.value.noKadPengenalan));
const isPoskodValid = computed(() => /^\d{5}$/.test(profileForm.value.poskod || ""));
const bankRequired = computed(() => (profileForm.value.statusLantikan || "").toLowerCase() === "aktif");

const canSave = computed(() => {
  if (!isIdValid.value) return false;
  if (!isPoskodValid.value) return false;
  if (!isEmailValid.value) return false;
  if (bankRequired.value) {
    if (!profileForm.value.namaBank || !profileForm.value.noAkaunBank) return false;
  }
  return true;
});

// ======= Upload handlers =======
const supportDoc = ref(null); // Dokumen Sokongan
const handleDocUpload = (e) => {
  const f = e.target.files?.[0];
  if (!f) return;
  const okType = ["application/pdf", "image/jpeg", "image/png"];
  if (!okType.includes(f.type)) {
    toast.error("Hanya PDF/JPEG/PNG dibenarkan.");
    e.target.value = "";
    return;
  }
  if (f.size > 5 * 1024 * 1024) {
    toast.error("Saiz maksimum 5MB.");
    e.target.value = "";
    return;
  }
  supportDoc.value = f;
};

const handlePhotoUpload = (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    toast.error("Sila pilih fail gambar sahaja.");
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    toast.error("Saiz maksimum gambar 5MB.");
    return;
  }
  profileForm.value.photo = file;
};

// ======= Save =======
const saveProfile = async () => {
  if (!canSave.value) {
    toast.error("Sila semak semula maklumat (emel/ID/poskod/bank).");
    return;
  }
  // Simulasi simpan
  await new Promise((r) => setTimeout(r, 500));
  originalSnapshot.value = JSON.parse(JSON.stringify(profileForm.value));
  isEdit.value = false;
  toast.success("Profil berjaya dikemaskini.");
};

// ======= Mock data: Sejarah Lantikan =======
const sejarahPerkhidmatan = ref([
  { sesi: "2023", tarikhMula: "2023-01-01", tarikhTamat: "2023-12-31", status: "Selesai" },
  { sesi: "2024", tarikhMula: "2024-01-01", tarikhTamat: "2024-12-31", status: "Berjalan" },
]);

const sejarahTugasan = ref([
  { tarikh: "2024-02-12", jenis: "Siasatan", rujukan: "SI-2024-014", status: "Selesai" },
  { tarikh: "2024-03-05", jenis: "Bancian", rujukan: "BN-2024-221", status: "Selesai" },
  { tarikh: "2024-04-18", jenis: "Review", rujukan: "RV-2024-077", status: "Dalam Semakan" },
]);



const rekodDisiplin = ref([
  { tarikh: "2023-09-10", catatan: "Peringatan lisan lewat serahan laporan", tindakan: "Selesai" },
  // Jika tiada data, kekalkan array kosong []
]);
</script>

<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <!-- Header / Mode Indicator -->
    <rs-card class="mb-6">
      <template #body>
        <div class="flex items-center justify-between p-4">
          <div class="flex items-center gap-4">
            <div class="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">
              3
            </div>
            <div>
              <h3 class="font-semibold text-gray-900">
                {{ isEdit ? "Kemaskini Profil Penolong Amil" : "Maklumat Profil Penolong Amil" }}
              </h3>
              <p class="text-sm text-gray-600">
                {{ isEdit ? "Mod kemaskini" : "Paparan maklumat" }}
              </p>
            </div>
          </div>
          <rs-badge :variant="profileForm.statusLantikan === 'Aktif' ? 'success' : 'warning'">
            Status: {{ profileForm.statusLantikan }}
          </rs-badge>
        </div>
      </template>
    </rs-card>

    <!-- Maklumat Profil -->
    <rs-card class="mb-6">
      <template #header>
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold">Maklumat Profil</h2>
          <div class="flex items-center gap-2">
            <rs-button v-if="!isEdit" variant="primary" @click="startEdit">
              <Icon name="ph:pencil-simple" class="w-4 h-4 mr-2" /> Kemaskini
            </rs-button>
            <template v-else>
              <rs-button variant="secondary-outline" @click="cancelEdit">Batal</rs-button>
              <rs-button variant="primary" :disabled="!canSave" @click="saveProfile">
                <Icon name="ph:check" class="w-4 h-4 mr-2" /> Simpan
              </rs-button>
            </template>
          </div>
        </div>
      </template>

      <template #body>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Status Lantikan (read-only) -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Status Lantikan</label>
            <div class="px-3 py-2 bg-gray-50 border rounded text-gray-800">
              {{ profileForm.statusLantikan }} <span class="text-xs text-gray-500">(dari konfigurasi NAS)</span>
            </div>
          </div>

          <!-- Nama Penolong Amil (read-only) -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nama Penolong Amil</label>
            <div class="px-3 py-2 bg-gray-50 border rounded text-gray-800">
              {{ profileForm.nama }}
            </div>
          </div>

          <!-- ID Pengenalan (read-only) -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">ID Pengenalan (MyKAD)</label>
            <div class="px-3 py-2 bg-gray-50 border rounded text-gray-800">
              {{ profileForm.noKadPengenalan }}
            </div>
            <p v-if="!isIdValid" class="text-xs text-red-600 mt-1">Mesti 12 digit tanpa dash.</p>
          </div>

          <!-- Emel (optional) -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Emel</label>
            <input
              v-if="isEdit"
              type="email"
              v-model="profileForm.emel"
              class="w-full px-3 py-2 border rounded"
              placeholder="nama@domain.com"
            />
            <div v-else class="px-3 py-2 bg-gray-50 border rounded text-gray-800">
              {{ profileForm.emel || '-' }}
            </div>
            <p v-if="isEdit && !isEmailValid" class="text-xs text-red-600 mt-1">Format emel tidak sah.</p>
          </div>

          <!-- No. Telefon -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">No. Telefon</label>
            <input
              v-if="isEdit"
              type="text"
              v-model="profileForm.noTelefon"
              class="w-full px-3 py-2 border rounded"
            />
            <div v-else class="px-3 py-2 bg-gray-50 border rounded text-gray-800">
              {{ profileForm.noTelefon || '-' }}
            </div>
          </div>

          <!-- No. Telefon Bimbit -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">No. Telefon Bimbit</label>
            <input
              v-if="isEdit"
              type="text"
              v-model="profileForm.noTelefonBimbit"
              class="w-full px-3 py-2 border rounded"
            />
            <div v-else class="px-3 py-2 bg-gray-50 border rounded text-gray-800">
              {{ profileForm.noTelefonBimbit || '-' }}
            </div>
          </div>

          <!-- Alamat -->
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
            <template v-if="isEdit">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" class="w-full px-3 py-2 border rounded" placeholder="Alamat 1" v-model="profileForm.alamat1" />
                <input type="text" class="w-full px-3 py-2 border rounded" placeholder="Alamat 2" v-model="profileForm.alamat2" />
                <input type="text" class="w-full px-3 py-2 border rounded" placeholder="Alamat 3" v-model="profileForm.alamat3" />
                <input type="text" class="w-full px-3 py-2 border rounded" placeholder="Bandar" v-model="profileForm.bandar" />
                <input type="text" class="w-full px-3 py-2 border rounded" placeholder="Daerah" v-model="profileForm.daerah" />
                <input type="text" class="w-full px-3 py-2 border rounded" placeholder="Negeri" v-model="profileForm.negeri" />
                <div>
                  <input type="text" class="w-full px-3 py-2 border rounded" placeholder="Poskod (5 digit)" v-model="profileForm.poskod" />
                  <p v-if="!isPoskodValid" class="text-xs text-red-600 mt-1">Poskod mesti 5 digit.</p>
                </div>
              </div>
            </template>
            <div v-else class="px-3 py-2 bg-gray-50 border rounded text-gray-800">
              {{ alamatGabungan || '-' }}
            </div>
          </div>

          <!-- Foto Profil (kekal) -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Foto Profil</label>
            <div v-if="!isEdit" class="flex items-center gap-3">
              <div class="w-16 h-16 border rounded bg-gray-50 flex items-center justify-center overflow-hidden">
                <img v-if="profileForm.photo" :src="URL.createObjectURL(profileForm.photo)" class="w-full h-full object-cover" />
                <Icon v-else name="ph:user" class="text-gray-400" size="28" />
              </div>
              <span class="text-sm text-gray-500">—</span>
            </div>
            <div v-else>
              <input type="file" accept="image/*" @change="handlePhotoUpload" class="w-full px-3 py-2 border rounded" />
              <p class="text-xs text-gray-500 mt-1">Format: JPG/PNG. Saiz maksimum: 5MB</p>
            </div>
          </div>

          <!-- Dokumen Sokongan -->
          <div class="md:col-span-1">
            <label class="block text-sm font-medium text-gray-700 mb-1">Dokumen Sokongan</label>
            <div v-if="isEdit">
              <input type="file" accept="application/pdf,image/jpeg,image/png" @change="handleDocUpload" class="w-full px-3 py-2 border rounded" />
              <p class="text-xs text-gray-500 mt-1">PDF/JPEG/PNG, maks 5MB.</p>
              <p v-if="supportDoc" class="text-xs text-gray-700 mt-1">Terpilih: {{ supportDoc.name }}</p>
            </div>
            <div v-else class="px-3 py-2 bg-gray-50 border rounded text-gray-800">
              <span class="text-gray-500 text-sm">Tiada dokumen dilampirkan</span>
            </div>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Maklumat Bank -->
    <rs-card class="mb-6">
      <template #header>
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold">Maklumat Bank</h2>
          <rs-button v-if="!isEdit" variant="secondary-outline" @click="startEdit">
            <Icon name="ph:pencil-simple" class="w-4 h-4 mr-2" /> Kemaskini
          </rs-button>
        </div>
      </template>
      <template #body>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Nama Bank -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Nama Bank <span v-if="bankRequired" class="text-red-500">*</span>
            </label>
            <input
              v-if="isEdit"
              type="text"
              v-model="profileForm.namaBank"
              class="w-full px-3 py-2 border rounded"
              :placeholder="bankRequired ? 'Wajib diisi (Status Aktif)' : 'Opsyenal'"
            />
            <div v-else class="px-3 py-2 bg-gray-50 border rounded text-gray-800">
              {{ profileForm.namaBank || '-' }}
            </div>
          </div>

          <!-- No Akaun Bank -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              No. Akaun Bank <span v-if="bankRequired" class="text-red-500">*</span>
            </label>
            <input
              v-if="isEdit"
              type="text"
              v-model="profileForm.noAkaunBank"
              class="w-full px-3 py-2 border rounded"
              placeholder="Nombor sahaja"
            />
            <div v-else class="px-3 py-2 bg-gray-50 border rounded text-gray-800">
              {{ profileForm.noAkaunBank || '-' }}
            </div>
          </div>
        </div>
      </template>
    </rs-card>

    <!-- Maklumat Sejarah Lantikan -->
    <rs-card>
      <template #header>
        <h2 class="text-xl font-semibold">Maklumat Sejarah Lantikan</h2>
      </template>
      <template #body>
        <div class="space-y-8">
          <!-- Sejarah Perkhidmatan -->
          <div>
            <h5 class="font-semibold text-gray-900 mb-2">Sejarah Perkhidmatan (Senarai Sesi)</h5>
            <div class="overflow-x-auto border rounded">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Sesi</th>
                    <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Tarikh Mula</th>
                    <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Tarikh Tamat</th>
                    <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="(row, i) in sejarahPerkhidmatan" :key="'svc-'+i">
                    <td class="px-4 py-2 text-sm text-gray-900">{{ row.sesi }}</td>
                    <td class="px-4 py-2 text-sm text-gray-900">{{ row.tarikhMula }}</td>
                    <td class="px-4 py-2 text-sm text-gray-900">{{ row.tarikhTamat }}</td>
                    <td class="px-4 py-2 text-sm">
                      <rs-badge :variant="row.status === 'Berjalan' ? 'info' : 'success'">{{ row.status }}</rs-badge>
                    </td>
                  </tr>
                  <tr v-if="!sejarahPerkhidmatan.length">
                    <td colspan="4" class="px-4 py-3 text-sm text-gray-500 italic">Tiada rekod.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

         
          
          <!-- Rekod Disiplin -->
          <div>
            <h5 class="font-semibold text-gray-900 mb-2">Rekod Disiplin (Catatan Perubahan Status)</h5>
            <div class="overflow-x-auto border rounded">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Tarikh</th>
                    <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Catatan</th>
                    <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Tindakan/Status</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="(row, i) in rekodDisiplin" :key="'disc-'+i">
                    <td class="px-4 py-2 text-sm text-gray-900">{{ row.tarikh }}</td>
                    <td class="px-4 py-2 text-sm text-gray-900">{{ row.catatan }}</td>
                    <td class="px-4 py-2 text-sm text-gray-900">{{ row.tindakan }}</td>
                  </tr>
                  <tr v-if="!rekodDisiplin.length">
                    <td colspan="3" class="px-4 py-3 text-sm text-gray-500 italic">Tiada rekod.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </template>
    </rs-card>
  </div>
</template>

<style scoped>
/* Custom styles */
</style>
