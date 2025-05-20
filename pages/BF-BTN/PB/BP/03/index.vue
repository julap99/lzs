<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Penciptaan Payment Advice (PA)</h1>

    <rs-card class="mb-6">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-lg font-semibold">Maklumat Bantuan</h2>
          <rs-button type="primary" @click="generatePA" :loading="isGenerating">
            Jana Payment Advice
          </rs-button>
        </div>
      </template>

      <template #body>
      <FormKit
        type="form"
        :actions="false"
        @submit="generatePA"
        v-model="paForm"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormKit
            type="text"
            name="recipientId"
            label="ID Penerima"
            :disabled="true"
            validation="required"
            :validation-messages="{
              required: 'ID Penerima diperlukan',
            }"
          />

          <FormKit
            type="text"
            name="assistanceType"
            label="Jenis Bantuan"
            :disabled="true"
            validation="required"
            :validation-messages="{
              required: 'Jenis Bantuan diperlukan',
            }"
          />

          <FormKit
            type="number"
            name="amount"
            label="Jumlah Bantuan"
            :disabled="true"
            validation="required|min:0"
            :validation-messages="{
              required: 'Jumlah Bantuan diperlukan',
              min: 'Jumlah tidak boleh negatif',
            }"
          />

          <FormKit
            type="date"
            name="approvalDate"
            label="Tarikh Kelulusan"
            :disabled="true"
            validation="required"
            :validation-messages="{
              required: 'Tarikh Kelulusan diperlukan',
            }"
          />

          <FormKit
            type="text"
            name="allocationCode"
            label="Kod Peruntukan"
            :disabled="true"
            validation="required"
            :validation-messages="{
              required: 'Kod Peruntukan diperlukan',
            }"
          />

          <FormKit
            type="text"
            name="paNumber"
            label="Nombor PA"
            :disabled="true"
            />
          </div>
        </FormKit>
      </template>
    </rs-card>

    <rs-card v-if="paStatus" class="mb-6">
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-lg font-semibold">Status Payment Advice</h2>
          <rs-badge :type="paStatus.type">{{ paStatus.message }}</rs-badge>
        </div>
      </template>

      <template #body>
        <div class="flex justify-between items-center">
          <span class="font-medium">Status:</span>
          <span>{{ paStatus.message }}</span>
        </div>
        <div class="flex justify-between items-center">
          <span class="font-medium">Tarikh Dijana:</span>
          <span>{{ paStatus.generatedDate }}</span>
        </div>
      </template>
    </rs-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

interface PAForm {
  recipientId: string
  assistanceType: string
  amount: number
  approvalDate: string
  allocationCode: string
  paNumber: string
}

interface PAStatus {
  type: 'success' | 'warning' | 'info'
  message: string
  generatedDate: string
}

const isGenerating = ref(false)
const paStatus = ref<PAStatus | null>(null)

// Mock data - In real application, this would come from props or API
const paForm = reactive<PAForm>({
  recipientId: 'REC001',
  assistanceType: 'Bantuan Kebajikan',
  amount: 1000.00,
  approvalDate: new Date().toISOString().split('T')[0],
  allocationCode: 'ALLOC001',
  paNumber: 'PA-' + Math.random().toString(36).substr(2, 9).toUpperCase()
})

async function generatePA() {
  try {
    isGenerating.value = true

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    paStatus.value = {
      type: 'success',
      message: 'Sedia untuk Dihantar ke SAP',
      generatedDate: new Date().toLocaleString()
    }
  } catch (error) {
    paStatus.value = {
      type: 'warning',
      message: 'Ralat semasa menjana Payment Advice',
      generatedDate: new Date().toLocaleString()
    }
  } finally {
    isGenerating.value = false
  }
}
</script>

<style scoped>
.rs-card {
  @apply shadow-md;
}
</style>
