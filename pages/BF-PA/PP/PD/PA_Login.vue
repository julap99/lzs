<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-50">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
      <div class="text-center mb-6">
        <img src="https://www.zakatselangor.com.my/wp-content/uploads/2018/10/lzs-logo.png" alt="LZS" class="h-12 mx-auto mb-2" />
        <h2 class="text-xl font-bold mb-2">Log Masuk Penolong Amil</h2>
        <p class="text-gray-600 text-sm">Sila masukkan maklumat untuk log masuk ke sistem Penolong Amil.</p>
      </div>
      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label class="block text-gray-700 text-sm mb-1">No. Kad Pengenalan</label>
          <input type="text" class="w-full border rounded px-3 py-2 focus:outline-none focus:ring" placeholder="Contoh: 880429105605" v-model="ic" />
        </div>
        <div class="mb-6">
          <label class="block text-gray-700 text-sm mb-1">Kata Laluan</label>
          <input type="password" class="w-full border rounded px-3 py-2 focus:outline-none focus:ring" placeholder="Kata Laluan" v-model="password" />
        </div>
        <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition">Log Masuk</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const ic = ref('');
const password = ref('');
const handleLogin = () => {
  window.location.href = '/BF-PA/PP/PD/PA_Tawaran';
};
</script>

<style scoped></style>