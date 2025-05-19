<template>
  <div>
    <LayoutsBreadcrumb :items="breadcrumb" />

    <rs-card class="mt-4">
      <template #header>
        <div class="flex flex-col">
          <div>
            <div class="flex items-center">
              <h2 class="text-xl font-semibold">
                Konfigurasi Dimensi: {{ dimensionName }}
              </h2>
              <rs-badge
                v-if="dimensionStatus === 'Menunggu Kelulusan'"
                variant="warning"
                class="ml-2"
              >
                Menunggu Persetujuan
              </rs-badge>
            </div>

            <!-- Approval summary panel -->
            <div
              v-if="pendingApprovalItems.length > 0"
              class="mt-3 p-3 border border-yellow-300 bg-yellow-50 rounded"
            >
              <div class="flex items-center text-yellow-700 font-medium mb-2">
                <Icon name="mdi:clock-alert-outline" class="mr-2" size="18" />
                <span>Perubahan Menunggu Persetujuan</span>
              </div>
              <div class="space-y-2">
                <div
                  v-for="item in pendingApprovalItems"
                  :key="item.tindakan"
                  class="flex items-center"
                >
                  <span class="font-medium mr-2">{{ item.item }}:</span>
                  <span class="line-through text-gray-500 mr-1">{{
                    originalValues[item.tindakan]
                  }}</span>
                  <Icon
                    name="mdi:arrow-right"
                    size="16"
                    class="mx-1 text-yellow-600"
                  />
                  <span class="text-yellow-700 font-medium">{{
                    item.skor
                  }}</span>
                </div>
              </div>
              <div v-if="approvalReason" class="mt-2 text-sm">
                <span class="font-medium">Alasan perubahan:</span>
                {{ approvalReason }}
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-3 mt-6">
            <div class="flex items-center mb-2">
              <span class="text-sm text-gray-600 mr-2">Status Dimensi:</span>
              <div class="flex items-center">
                <rs-badge
                  :variant="getStatusBadgeVariant(dimensionStatus)"
                  class="mr-2"
                >
                  {{ dimensionStatus }}
                </rs-badge>
                <FormKit
                  v-if="dimensionStatus !== 'Menunggu Kelulusan'"
                  type="select"
                  v-model="dimensionStatus"
                  :options="statusOptions"
                  :classes="{
                    outer: '!mb-0',
                    input: '!py-1 !h-auto !text-sm !w-36',
                  }"
                  @change="updateDimensionStatus"
                />
              </div>
            </div>
            <rs-button
              variant="primary"
              @click="showAddModal = true"
              :disabled="dimensionStatus === 'Menunggu Kelulusan'"
            >
              <Icon name="mdi:plus" class="mr-1" size="15" /> Tambah
            </rs-button>
          </div>
        </div>
      </template>

      <template #body>
        <!-- Main Configuration Table -->
        <rs-table
          :data="configurationItems"
          :showNoColumn="true"
          :pageSize="10"
          :options="{
            variant: 'default',
            hover: true,
          }"
          class="mt-4"
        >
          <template v-slot:item="data">
            <div class="flex items-center">
              <FormKit
                v-if="editingId === data.value.tindakan"
                type="text"
                v-model="data.text"
                :classes="{ input: '!py-1 !text-sm' }"
                :disabled="dimensionStatus === 'Menunggu Kelulusan'"
              />
              <span v-else>{{ data.text }}</span>

              <rs-badge
                v-if="isPendingApproval(data.value)"
                variant="warning"
                class="ml-2 text-xs"
              >
                Menunggu Persetujuan
              </rs-badge>

              <rs-badge
                v-else-if="isRequiresApproval(data.value)"
                variant="info"
                class="ml-2 text-xs"
              >
                Perlu Persetujuan
              </rs-badge>
            </div>
          </template>

          <template v-slot:skor="data">
            <div class="flex items-center">
              <FormKit
                v-if="editingId === data.value.tindakan"
                type="number"
                v-model="data.text"
                :classes="{ input: '!py-1 !text-sm' }"
                :disabled="dimensionStatus === 'Menunggu Kelulusan'"
              />
              <template v-else-if="isPendingApproval(data.value)">
                <span class="line-through text-gray-500">{{
                  originalValues[data.value.tindakan]
                }}</span>
                <Icon
                  name="mdi:arrow-right"
                  size="16"
                  class="mx-1 text-yellow-600"
                />
                <span class="text-yellow-700 font-medium">{{ data.text }}</span>
              </template>
              <span v-else>{{ data.text }}</span>
            </div>
          </template>

          <template v-slot:tindakan="data">
            <div class="flex space-x-2">
              <template v-if="editingId === data.value.tindakan">
                <rs-button
                  variant="success"
                  size="sm"
                  class="!px-2 !py-1"
                  @click="saveItem(data.value)"
                  :disabled="dimensionStatus === 'Menunggu Kelulusan'"
                >
                  <Icon name="mdi:check" size="15" />
                </rs-button>
                <rs-button
                  variant="danger"
                  size="sm"
                  class="!px-2 !py-1"
                  @click="cancelEdit(data.value)"
                  :disabled="dimensionStatus === 'Menunggu Kelulusan'"
                >
                  <Icon name="mdi:close" size="15" />
                </rs-button>
              </template>
              <template v-else>
                <rs-button
                  variant="primary"
                  size="sm"
                  class="!px-2 !py-1"
                  @click="editItem(data.value)"
                  :disabled="
                    dimensionStatus === 'Menunggu Kelulusan' ||
                    isPendingApproval(data.value) ||
                    data.value.catatan == 'Menunggu kelulusan'
                  "
                  :title="
                    isPendingApproval(data.value)
                      ? 'Menunggu persetujuan'
                      : 'Edit'
                  "
                >
                  <Icon name="mdi:pencil" size="15" />
                </rs-button>
                <rs-button
                  variant="danger"
                  size="sm"
                  class="!px-2 !py-1"
                  @click="deleteItem(data.value)"
                  :disabled="
                    dimensionStatus === 'Menunggu Kelulusan' ||
                    isPendingApproval(data.value) ||
                    isRequiresApproval(data.value) ||
                    data.value.catatan == 'Menunggu kelulusan'
                  "
                  :title="
                    isRequiresApproval(data.value)
                      ? 'Item memerlukan persetujuan khusus'
                      : 'Hapus'
                  "
                >
                  <Icon name="mdi:trash-can-outline" size="15" />
                </rs-button>

                <rs-button
                  v-if="isPendingApproval(data.value)"
                  variant="warning"
                  size="sm"
                  class="!px-2 !py-1"
                  @click="cancelApprovalForItem(data.value)"
                  :title="'Batalkan permintaan persetujuan'"
                >
                  <Icon name="mdi:undo" size="15" />
                </rs-button>
              </template>
            </div>
          </template>
        </rs-table>

        <!-- Approval Modal -->
        <rs-modal
          v-model="showApprovalModal"
          title="Persetujuan Diperlukan"
          size="md"
          position="center"
        >
          <div class="mb-4">
            <p class="mb-4 font-medium">
              Perubahan berikut memerlukan persetujuan:
            </p>
            <div class="border border-gray-200 rounded-md p-3 mb-4 bg-gray-50">
              <table class="w-full">
                <thead>
                  <tr>
                    <th class="text-left pb-2">Item</th>
                    <th class="text-left pb-2">Nilai Saat Ini</th>
                    <th class="text-center pb-2">Perubahan</th>
                    <th class="text-left pb-2">Nilai Baru</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="item in pendingApprovalItems"
                    :key="item.tindakan"
                    class="border-t border-gray-200"
                  >
                    <td class="py-2 font-medium">{{ item.item }}</td>
                    <td class="py-2">{{ originalValues[item.tindakan] }}</td>
                    <td class="py-2 text-center">
                      <Icon
                        name="mdi:arrow-right"
                        size="16"
                        class="text-yellow-600"
                      />
                    </td>
                    <td class="py-2 text-yellow-700 font-medium">
                      {{ item.skor }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <FormKit
              type="textarea"
              v-model="approvalReason"
              label="Alasan Perubahan"
              validation="required"
              placeholder="Jelaskan alasan perubahan ini"
              :help="'Alasan ini akan ditampilkan kepada pihak yang menyetujui'"
            />
          </div>
          <div class="flex justify-end space-x-3 mt-6">
            <rs-button variant="primary-outline" @click="cancelApprovalRequest">
              Batal
            </rs-button>
            <rs-button
              variant="primary"
              @click="submitApprovalRequest"
              :loading="sendingApproval"
            >
              Kirim Permintaan
            </rs-button>
          </div>
        </rs-modal>

        <!-- Add New Item Modal -->
        <rs-modal
          v-model="showAddModal"
          title="Tambah Item Baru"
          size="md"
          position="center"
          :disabled="dimensionStatus === 'Menunggu Kelulusan'"
        >
          <FormKit type="form" @submit="submitNewItem" :actions="false">
            <FormKit
              type="text"
              name="name"
              label="Nama Item"
              placeholder="Contoh: 1-20"
              validation="required"
            />
            <FormKit
              type="number"
              name="score"
              label="Skor"
              placeholder="0"
              validation="required|min:0"
            />
            <FormKit
              type="checkbox"
              name="requiresApproval"
              label="Item ini memerlukan persetujuan untuk perubahan"
            />
            <div class="flex justify-end space-x-3 mt-6">
              <rs-button
                variant="primary-outline"
                @click="showAddModal = false"
              >
                Batal
              </rs-button>
              <rs-button variant="primary" type="submit" :loading="addingItem">
                Tambah
              </rs-button>
            </div>
          </FormKit>
        </rs-modal>

        <!-- Save All Button -->
        <div class="flex justify-end mt-6 gap-3">
          <rs-button
            variant="primary-outline"
            @click="navigateTo('/BF-PRF/KF/MD/admin')"
          >
            Kembali
          </rs-button>

          <rs-button
            v-if="pendingApprovalItems.length > 0"
            variant="warning"
            @click="cancelAllPendingApprovals"
            :disabled="dimensionStatus !== 'Menunggu Kelulusan'"
          >
            <Icon name="mdi:undo" class="mr-1" size="15" /> Batalkan Perubahan
          </rs-button>

          <rs-button
            variant="primary"
            @click="saveAllChanges"
            :loading="savingAll"
            :disabled="dimensionStatus === 'Menunggu Kelulusan' || !hasChanges"
          >
            <Icon name="mdi:content-save" class="mr-1" size="15" /> Simpan
            Perubahan
          </rs-button>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup>
const route = useRoute();
const dimensionId = route.params.id;

// Sample data
const dimensionName = ref("Umur");
const dimensionStatus = ref("Aktif");
const statusOptions = {
  Aktif: "Aktif",
  "Tidak Aktif": "Tidak Aktif",
};

const configurationItems = ref([
  { item: "1-20", skor: 0, tindakan: 1, catatan: null },
  { item: "21-40", skor: 4, tindakan: 2, catatan: "Menunggu kelulusan" },
  { item: "41-50", skor: 3, tindakan: 3, catatan: null },
  { item: "51-60", skor: 5, tindakan: 4, catatan: null },
  { item: "61+", skor: 6, tindakan: 5, catatan: "Menunggu kelulusan" },
]);

const breadcrumb = ref([
  {
    name: "Profiling",
    type: "link",
    path: "/BF-PRF/MD/admin",
  },
  {
    name: "Konfigurasi Multidimensi",
    type: "link",
    path: "/BF-PRF/MD/admin",
  },
  {
    name: `Konfigurasi ${dimensionName.value}`,
    type: "current",
    path: `/BF-PRF/MD/admin/configure/${dimensionId}`,
  },
]);

// Editing state
const editingId = ref(null);
const originalItem = ref(null);
const modifiedItems = ref([]);
const pendingApprovalItems = ref([]);
const originalValues = ref({});
const showApprovalModal = ref(false);
const approvalReason = ref("");
const sendingApproval = ref(false);
const savingAll = ref(false);
const addingItem = ref(false);
const showAddModal = ref(false);

// Computed property to check if there are any changes
const hasChanges = computed(() => {
  return modifiedItems.value.length > 0;
});

// Get status badge variant
const getStatusBadgeVariant = (status) => {
  switch (status) {
    case "Aktif":
      return "success";
    case "Tidak Aktif":
      return "danger";
    case "Menunggu Kelulusan":
      return "warning";
    default:
      return "primary";
  }
};

// Check if item is pending approval
const isPendingApproval = (item) => {
  return pendingApprovalItems.value.some((i) => i.tindakan === item.tindakan);
};

// Check if item requires approval for changes
const isRequiresApproval = (item) => {
  return item.requiresApproval;
};

// Update dimension status
const updateDimensionStatus = async () => {
  try {
    // Simulate API call to update status
    await new Promise((resolve) => setTimeout(resolve, 500));
    alert(`Status dimensi berhasil diubah menjadi ${dimensionStatus.value}`);
  } catch (error) {
    alert("Gagal mengubah status dimensi");
  }
};

// Add new item
const submitNewItem = async (formData) => {
  addingItem.value = true;
  try {
    const newId =
      configurationItems.value.length > 0
        ? Math.max(...configurationItems.value.map((i) => i.tindakan)) + 1
        : 1;

    configurationItems.value.push({
      item: formData.name,
      skor: parseInt(formData.score),
      tindakan: newId,
      requiresApproval: formData.requiresApproval || false,
    });

    showAddModal.value = false;
    alert("Item berhasil ditambahkan");
  } catch (error) {
    alert("Gagal menambahkan item");
  } finally {
    addingItem.value = false;
  }
};

// Edit item
const editItem = (item) => {
  originalItem.value = JSON.parse(JSON.stringify(item));
  editingId.value = item.tindakan;
};

const saveItem = (item) => {
  // Compare if the item has actually changed
  const original = originalItem.value;
  const hasChanged = original.item !== item.item || original.skor !== item.skor;

  if (hasChanged) {
    // Store original values
    if (!originalValues.value[item.tindakan]) {
      originalValues.value[item.tindakan] = original.skor;
    }

    // Add to modified items if not already there
    if (!modifiedItems.value.some((i) => i.tindakan === item.tindakan)) {
      modifiedItems.value.push(item);
    }
  }

  editingId.value = null;
  originalItem.value = null;
};

const cancelEdit = (item) => {
  if (originalItem.value) {
    Object.assign(item, originalItem.value);
  }
  editingId.value = null;
  originalItem.value = null;
};

// Delete item
const deleteItem = (item) => {
  if (item.requiresApproval) {
    alert("Item ini memerlukan persetujuan khusus untuk dihapus.");
    return;
  }

  if (confirm(`Anda yakin ingin menghapus item ${item.item}?`)) {
    const index = configurationItems.value.findIndex(
      (i) => i.tindakan === item.tindakan
    );
    if (index !== -1) {
      configurationItems.value.splice(index, 1);

      // Remove from modified items if present
      const modIndex = modifiedItems.value.findIndex(
        (i) => i.tindakan === item.tindakan
      );
      if (modIndex !== -1) {
        modifiedItems.value.splice(modIndex, 1);
      }

      alert("Item berhasil dihapus");
    }
  }
};

// Save all changes
const saveAllChanges = async () => {
  savingAll.value = true;
  try {
    // Check for items requiring approval
    const itemsNeedingApproval = modifiedItems.value.filter(
      (item) => item.requiresApproval
    );

    if (itemsNeedingApproval.length > 0) {
      pendingApprovalItems.value = itemsNeedingApproval;
      showApprovalModal.value = true;
      savingAll.value = false;
      return;
    }

    // If no approval needed, save directly
    await new Promise((resolve) => setTimeout(resolve, 1000));
    alert("Semua perubahan berhasil disimpan");
    modifiedItems.value = [];
  } catch (error) {
    alert("Gagal menyimpan perubahan");
  } finally {
    savingAll.value = false;
  }
};

// Submit approval request
const submitApprovalRequest = async () => {
  if (!approvalReason.value) {
    alert("Alasan perubahan harus diisi");
    return;
  }

  sendingApproval.value = true;
  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Update dimension status
    dimensionStatus.value = "Menunggu Kelulusan";

    alert(
      "Permintaan persetujuan telah dikirim. Dimensi dikunci sampai persetujuan diberikan."
    );
    showApprovalModal.value = false;
    modifiedItems.value = [];
  } catch (error) {
    alert("Gagal mengirim permintaan persetujuan");
  } finally {
    sendingApproval.value = false;
  }
};

// Cancel approval request
const cancelApprovalRequest = () => {
  showApprovalModal.value = false;
};

// Cancel approval for a specific item
const cancelApprovalForItem = (item) => {
  if (confirm(`Batalkan permintaan persetujuan untuk item ${item.item}?`)) {
    // Remove from pending approvals
    const index = pendingApprovalItems.value.findIndex(
      (i) => i.tindakan === item.tindakan
    );

    if (index !== -1) {
      // Restore original value
      item.skor = originalValues.value[item.tindakan];

      // Remove from pending approvals
      pendingApprovalItems.value.splice(index, 1);

      // If no more pending approvals, reset status
      if (
        pendingApprovalItems.value.length === 0 &&
        dimensionStatus.value === "Menunggu Kelulusan"
      ) {
        dimensionStatus.value = "Aktif";
      }

      alert(`Permintaan persetujuan untuk item ${item.item} dibatalkan`);
    }
  }
};

// Cancel all pending approvals
const cancelAllPendingApprovals = () => {
  if (confirm("Batalkan semua permintaan persetujuan?")) {
    // Restore original values for all pending items
    pendingApprovalItems.value.forEach((item) => {
      const originalItem = configurationItems.value.find(
        (i) => i.tindakan === item.tindakan
      );
      if (originalItem && originalValues.value[item.tindakan] !== undefined) {
        originalItem.skor = originalValues.value[item.tindakan];
      }
    });

    // Reset status
    dimensionStatus.value = "Aktif";

    // Clear pending approvals
    pendingApprovalItems.value = [];
    approvalReason.value = "";

    alert("Semua permintaan persetujuan dibatalkan");
  }
};
</script>
