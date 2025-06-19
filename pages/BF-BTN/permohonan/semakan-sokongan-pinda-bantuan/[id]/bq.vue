<template>
  <div class="min-h-screen">
    <LayoutsBreadcrumb :items="breadcrumb" />
    
    <div class="mt-6 mb-8">
      <h1 class="text-2xl font-bold text-gray-900">Bill of Quantities (BQ)</h1>
      <p class="mt-1 text-sm text-gray-600">Semak BQ dan berikan tandatangan sokongan</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- BQ Table -->
      <div class="lg:col-span-3">
        <rs-card>
          <template #header>
            <h2 class="text-lg font-semibold">Jadual Bill of Quantities</h2>
          </template>
          <template #body>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bil</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Penerangan</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit</th>
                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Kuantiti</th>
                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Harga Unit</th>
                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Jumlah</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="(item, index) in bqItems" :key="index">
                    <td class="px-6 py-4 text-sm">{{ index + 1 }}</td>
                    <td class="px-6 py-4 text-sm">{{ item.description }}</td>
                    <td class="px-6 py-4 text-sm">{{ item.unit }}</td>
                    <td class="px-6 py-4 text-sm text-right">{{ item.quantity }}</td>
                    <td class="px-6 py-4 text-sm text-right">{{ formatCurrency(item.unitPrice) }}</td>
                    <td class="px-6 py-4 text-sm text-right font-medium">{{ formatCurrency(item.total) }}</td>
                  </tr>
                </tbody>
                <tfoot class="bg-gray-50">
                  <tr>
                    <td colspan="5" class="px-6 py-4 text-right font-medium">JUMLAH KESELURUHAN:</td>
                    <td class="px-6 py-4 text-right font-bold text-lg text-blue-600">{{ totalValue }}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </template>
        </rs-card>
      </div>

      <!-- Signature Panel -->
      <div class="lg:col-span-1">
        <rs-card class="sticky top-6">
          <template #header>
            <h2 class="text-lg font-semibold">Tandatangan Sokongan</h2>
          </template>
          <template #body>
            <div class="space-y-4">
              <div v-if="!isSigned" class="space-y-4">
                <canvas
                  ref="signatureCanvas"
                  @mousedown="startDrawing"
                  @mousemove="draw"
                  @mouseup="stopDrawing"
                  class="w-full h-32 bg-white border rounded cursor-crosshair"
                  width="300"
                  height="120"
                ></canvas>
                
                <div class="flex gap-2">
                  <rs-button variant="secondary-outline" size="sm" @click="clearSignature">
                    Padam
                  </rs-button>
                  <rs-button 
                    variant="primary" 
                    size="sm" 
                    @click="signBQ"
                    :disabled="!hasSignature || processing"
                    class="flex-1"
                  >
                    Tandatangan
                  </rs-button>
                </div>
              </div>

              <div v-else class="text-center p-4 bg-green-50 rounded-lg">
                <Icon name="ph:check-circle" class="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p class="text-sm font-medium text-green-800">Telah Ditandatangani</p>
                <p class="text-xs text-green-600 mt-1">{{ signedAt }}</p>
              </div>

              <rs-button variant="primary-outline" @click="goBack" class="w-full">
                Kembali
              </rs-button>
            </div>
          </template>
        </rs-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";

const route = useRoute();
const router = useRouter();
const toast = useToast();

const breadcrumb = ref([
  { name: "Senarai Permohonan", type: "link", path: "/BF-BTN/permohonan/semakan-sokongan-pinda-bantuan" },
  { name: "Semak Permohonan", type: "link", path: `/BF-BTN/permohonan/semakan-sokongan-pinda-bantuan/${route.params.id}` },
  { name: "BQ", type: "current", path: "" },
]);

const signatureCanvas = ref(null);
const hasSignature = ref(false);
const isSigned = ref(false);
const signedAt = ref("");
const processing = ref(false);

let isDrawing = false;
let ctx = null;

const bqItems = ref([
  { description: "Kerja penggalian", unit: "m³", quantity: 150, unitPrice: 25.00, total: 3750.00 },
  { description: "Kerja konkrit", unit: "m³", quantity: 80, unitPrice: 350.00, total: 28000.00 },
  { description: "Kerja besi", unit: "kg", quantity: 2500, unitPrice: 8.50, total: 21250.00 },
]);

const totalValue = computed(() => {
  const total = bqItems.value.reduce((sum, item) => sum + item.total, 0);
  return formatCurrency(total);
});

const formatCurrency = (amount) => {
  return `RM ${parseFloat(amount).toLocaleString('en-MY', { minimumFractionDigits: 2 })}`;
};

const setupCanvas = () => {
  if (signatureCanvas.value) {
    ctx = signatureCanvas.value.getContext("2d");
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
  }
};

const startDrawing = (e) => {
  isDrawing = true;
  const pos = getEventPos(e);
  ctx.beginPath();
  ctx.moveTo(pos.x, pos.y);
};

const draw = (e) => {
  if (!isDrawing) return;
  const pos = getEventPos(e);
  ctx.lineTo(pos.x, pos.y);
  ctx.stroke();
  hasSignature.value = true;
};

const stopDrawing = () => {
  isDrawing = false;
};

const getEventPos = (e) => {
  const rect = signatureCanvas.value.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  };
};

const clearSignature = () => {
  ctx.clearRect(0, 0, signatureCanvas.value.width, signatureCanvas.value.height);
  hasSignature.value = false;
};

const signBQ = async () => {
  if (!hasSignature.value) {
    toast.error("Sila turunkan tandatangan terlebih dahulu");
    return;
  }
  
  processing.value = true;
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    isSigned.value = true;
    signedAt.value = new Date().toLocaleString("ms-MY");
    toast.success("BQ telah berjaya ditandatangani");
  } catch (error) {
    toast.error("Ralat semasa menandatangani BQ");
  } finally {
    processing.value = false;
  }
};

const goBack = () => {
  router.push(`/BF-BTN/permohonan/semakan-sokongan-pinda-bantuan/${route.params.id}`);
};

onMounted(async () => {
  await nextTick();
  setupCanvas();
});
</script> 