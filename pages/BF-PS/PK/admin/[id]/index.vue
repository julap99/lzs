<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Senarai Kod {{ groupName }}</h2>

          <div class="flex gap-3">
            <rs-button
              variant="primary-outline"
              @click="navigateTo(`/BF-PS/PK/admin`)"
            >
              Kembali
            </rs-button>
            <rs-button variant="primary" @click="showAddModal = true">
              <Icon name="material-symbols:add" class="mr-1" size="15" /> Tambah
              Kod
            </rs-button>
          </div>
        </div>
      </template>

      <template #body>
        <rs-table
          :data="codeList"
          :pageSize="10"
          :showNoColumn="true"
          :options="{
            variant: 'default',
            hover: true,
          }"
        >
          <template v-slot:status="data">
            <rs-badge :variant="getStatusVariant(data.text)">
              {{ data.text }}
            </rs-badge>
          </template>

          <template v-slot:tindakan="data">
            <div class="flex space-x-2">
              <rs-button
                variant="primary"
                size="sm"
                class="!px-2 !py-1"
                @click="editCode(data.item)"
              >
                Kemaskini
              </rs-button>
              <rs-button
                variant="danger"
                size="sm"
                class="!px-2 !py-1"
                @click="confirmDelete(data.item.id)"
              >
                <Icon name="material-symbols:delete-rounded" size="15"></Icon>
              </rs-button>
            </div>
          </template>
        </rs-table>
      </template>
    </rs-card>

    <!-- Add/Edit Modal -->
    <rs-modal
      v-model="showAddModal"
      :title="isEditing ? 'Kemaskini Kod' : 'Tambah Kod Baharu'"
      size="md"
      position="center"
    >
      <template #body>
        <div class="space-y-4">
          <FormKit
            type="text"
            name="kod"
            label="Kod"
            v-model="currentCode.kod"
            placeholder="Masukkan kod"
            validation="required"
          />
          <FormKit
            type="text"
            name="keterangan"
            label="Keterangan"
            v-model="currentCode.keterangan"
            placeholder="Masukkan keterangan"
            validation="required"
          />
          <FormKit
            type="select"
            name="status"
            label="Status"
            v-model="currentCode.status"
            :options="statusOptions"
            validation="required"
          />
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end space-x-2">
          <rs-button variant="primary-outline" @click="showAddModal = false">
            Batal
          </rs-button>
          <rs-button variant="primary" @click="saveCode">
            {{ isEditing ? "Kemaskini" : "Simpan" }}
          </rs-button>
        </div>
      </template>
    </rs-modal>

    <!-- Delete Confirmation Modal -->
    <rs-modal
      v-model="showDeleteModal"
      title="Sahkan Padam"
      size="md"
      position="center"
    >
      <template #body>
        <p>Adakah anda pasti ingin memadam kod ini?</p>
        <p class="text-red-600 font-medium mt-2">
          Amaran: Pemadaman kod mungkin menjejaskan data yang berkaitan.
        </p>
      </template>
      <template #footer>
        <div class="flex justify-end space-x-2">
          <rs-button variant="primary-outline" @click="showDeleteModal = false">
            Batal
          </rs-button>
          <rs-button variant="danger" @click="deleteCode">
            Sahkan Padam
          </rs-button>
        </div>
      </template>
    </rs-modal>
  </div>
</template>

<script setup>
const route = useRoute();
const router = useRouter();

const group = route.params.id;
const groupName = computed(() => {
  const names = {
    1: "Negeri",
    2: "Daerah",
    3: "Status Pendidikan",
    4: "Status Permohonan",
  };
  return names[group] || group;
});

const breadcrumb = computed(() => [
  {
    name: "Pentadbir Sistem",
    type: "link",
    path: "/BF-PS",
  },
  {
    name: "Penyelenggaraan Kod",
    type: "link",
    path: "/BF-PS/PK",
  },
  {
    name: "Admin",
    type: "link",
    path: "/BF-PS/PK/admin",
  },
  {
    name: "Edit Kategori",
    type: "current",
    path: `/BF-PS/PK/admin/${group}`,
  },
]);

// Sample data - in real app, you would fetch this from API
const codeList = ref([]);
const statusOptions = [
  { label: "Aktif", value: "Aktif" },
  { label: "Tidak Aktif", value: "Tidak Aktif" },
];

// Initialize with sample data based on group
onMounted(() => {
  console.log("group:", group);

  switch (parseInt(group)) {
    case 1:
      codeList.value = [
        { kod: "01", keterangan: "Johor", status: "Aktif", tindakan: 1 },
        { kod: "02", keterangan: "Kedah", status: "Aktif", tindakan: 2 },
        { kod: "03", keterangan: "Kelantan", status: "Aktif", tindakan: 3 },
      ];
      break;
    case 2:
      codeList.value = [
        {
          kod: "0101",
          keterangan: "Johor Bahru",
          status: "Aktif",
          tindakan: 1,
        },
        { kod: "0102", keterangan: "Batu Pahat", status: "Aktif", tindakan: 2 },
        { kod: "0201", keterangan: "Alor Setar", status: "Aktif", tindakan: 3 },
      ];
      break;
    case 3:
      codeList.value = [
        {
          kod: "SPM",
          keterangan: "Sijil Pelajaran Malaysia",
          status: "Aktif",
          tindakan: 1,
        },
        { kod: "DIP", keterangan: "Diploma", status: "Aktif", tindakan: 2 },
        {
          kod: "IJAZAH",
          keterangan: "Ijazah Sarjana Muda",
          status: "Aktif",
          tindakan: 3,
        },
      ];
      break;
    case 4:
      codeList.value = [
        {
          kod: "BARU",
          keterangan: "Permohonan Baru",
          status: "Aktif",
          tindakan: 1,
        },
        {
          kod: "PROSES",
          keterangan: "Dalam Proses",
          status: "Aktif",
          tindakan: 2,
        },
        {
          kod: "LULUS",
          keterangan: "Permohonan Lulus",
          status: "Aktif",
          tindakan: 3,
        },
      ];
      break;
  }
});

// Modal controls
const showAddModal = ref(false);
const showDeleteModal = ref(false);
const isEditing = ref(false);
const currentCode = ref({
  id: null,
  kod: "",
  keterangan: "",
  status: "Aktif",
});
const codeToDelete = ref(null);

// Methods
const editCode = (code) => {
  isEditing.value = true;
  currentCode.value = { ...code };
  showAddModal.value = true;
};

const saveCode = () => {
  if (isEditing.value) {
    // Update existing code
    const index = codeList.value.findIndex(
      (c) => c.id === currentCode.value.id
    );
    if (index !== -1) {
      codeList.value[index] = { ...currentCode.value };
    }
  } else {
    // Add new code
    const newId = Math.max(...codeList.value.map((c) => c.id), 0) + 1;
    codeList.value.push({
      id: newId,
      ...currentCode.value,
    });
  }

  resetForm();
  showAddModal.value = false;
};

const confirmDelete = (id) => {
  codeToDelete.value = id;
  showDeleteModal.value = true;
};

const deleteCode = () => {
  codeList.value = codeList.value.filter((c) => c.id !== codeToDelete.value);
  showDeleteModal.value = false;
  codeToDelete.value = null;
};

const resetForm = () => {
  currentCode.value = {
    id: null,
    kod: "",
    keterangan: "",
    status: "Aktif",
  };
  isEditing.value = false;
};

const getStatusVariant = (status) => {
  switch (status) {
    case "Aktif":
      return "success";
    case "Tidak Aktif":
      return "danger";
    default:
      return "default";
  }
};
</script>
