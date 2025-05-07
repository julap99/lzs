<script setup>
definePageMeta({
  title: "Senarai Mesej",
  breadcrumb: [
    {
      name: "Senarai Mesej",
      type: "current",
    },
  ],
});

const messages = ref([
  {
    id: 1,
    sender: "Admin",
    subject: "Selamat Datang",
    preview: "Selamat datang ke sistem mesej kami...",
    content:
      "Selamat datang ke sistem mesej kami. Kami berharap anda akan menikmati pengalaman menggunakan sistem ini. Jika ada sebarang pertanyaan, sila hubungi kami.",
    date: "1-50 daripada 528",
    isRead: true,
  },
  {
    id: 2,
    sender: "Spotify",
    subject: "Tawaran Istimewa untuk Anda",
    preview: "Dapatkan langganan premium dengan harga istimewa...",
    content:
      "Dapatkan langganan premium dengan harga istimewa! Hanya untuk masa yang terhad, nikmati muzik tanpa had dengan harga yang sangat berpatutan.",
    date: "11:59 malam",
    isRead: false,
  },
  {
    id: 3,
    sender: "Ahmad Zulkifli",
    subject: "Mesyuarat Projek Baru",
    preview: "Sila hadir ke mesyuarat projek baru pada...",
    content:
      "Sila hadir ke mesyuarat projek baru pada hari Isnin, 10 Julai 2023, jam 10 pagi di Bilik Mesyuarat Utama. Kita akan membincangkan perancangan dan pembahagian tugas untuk projek baru ini.",
    date: "10:21 malam",
    isRead: false,
  },
  {
    id: 4,
    sender: "Syarikat ABC",
    subject: "Tawaran Kerja",
    preview: "Kami dengan sukacitanya menawarkan anda jawatan...",
    content:
      "Kami dengan sukacitanya menawarkan anda jawatan Pengaturcara Kanan di Syarikat ABC. Sila baca lampiran untuk maklumat lanjut tentang tawaran ini dan hubungi kami jika anda mempunyai sebarang pertanyaan.",
    date: "8:37 malam",
    isRead: false,
  },
  {
    id: 5,
    sender: "Puan Mariam",
    subject: "Peringatan: Bayaran Bil",
    preview: "Ini adalah peringatan untuk pembayaran bil anda...",
    content:
      "Ini adalah peringatan untuk pembayaran bil anda yang telah tamat tempoh. Sila jelaskan bayaran sebelum 30 Jun 2023 untuk mengelakkan sebarang caj lewat.",
    date: "4:38 petang",
    isRead: false,
  },
]);

const selectedMessages = ref([]);
const currentMessage = ref(null);

const selectMessage = (messageId) => {
  const index = selectedMessages.value.indexOf(messageId);
  if (index === -1) {
    selectedMessages.value.push(messageId);
  } else {
    selectedMessages.value.splice(index, 1);
  }
};

const deleteSelectedMessages = () => {
  messages.value = messages.value.filter(
    (message) => !selectedMessages.value.includes(message.id)
  );
  selectedMessages.value = [];
  currentMessage.value = null;
};

const readMessage = (message) => {
  currentMessage.value = message;
  if (!message.isRead) {
    message.isRead = true;
  }
};

const closeMessage = () => {
  currentMessage.value = null;
};

const addNewMessage = () => {
  const newId = messages.value.length + 1;
  const newMessage = {
    id: newId,
    sender: "New Sender",
    subject: "New Subject",
    preview: "This is a new message...",
    content:
      "This is the full content of the new message. You can edit this to add more details.",
    date: new Date().toLocaleString(),
    isRead: false,
  };
  messages.value.unshift(newMessage);
};
</script>

<template>
  <div class="bg-gray-100 min-h-screen">
    <LayoutsBreadcrumb />

    <div class="container mx-auto">
      <rs-card>
        <div class="flex items-center justify-between p-5">
          <h2 class="text-xl font-semibold text-gray-800">Senarai Mesej</h2>
          <div class="flex space-x-2">
            <rs-button @click="addNewMessage" variant="success">
              Tambah Mesej
            </rs-button>
            <rs-button
              @click="deleteSelectedMessages"
              variant="danger"
              :disabled="selectedMessages.length === 0"
            >
              Buang ({{ selectedMessages.length }})
            </rs-button>
          </div>
        </div>
        <div class="divide-y divide-gray-200">
          <div
            v-for="message in messages"
            :key="message.id"
            @click="readMessage(message)"
            class="flex items-center p-4 hover:bg-gray-50 transition duration-150 ease-in-out cursor-pointer"
            :class="{ 'bg-blue-50': selectedMessages.includes(message.id) }"
          >
            <input
              type="checkbox"
              :checked="selectedMessages.includes(message.id)"
              @click.stop="selectMessage(message.id)"
              class="mr-4 h-5 w-5 text-blue-600"
            />
            <div class="flex-grow">
              <div class="flex items-center justify-between">
                <span
                  class="font-medium text-gray-900"
                  :class="{ 'font-bold': !message.isRead }"
                >
                  {{ message.sender }}
                </span>
                <span class="text-sm text-gray-500">{{ message.date }}</span>
              </div>
              <div class="mt-1">
                <span
                  class="text-sm font-medium text-gray-900"
                  :class="{ 'font-bold': !message.isRead }"
                >
                  {{ message.subject }}
                </span>
                <span class="text-sm text-gray-600">
                  - {{ message.preview }}</span
                >
              </div>
            </div>
          </div>
        </div>
      </rs-card>

      <!-- Message Content Modal -->
      <rs-modal v-model="currentMessage" title="Message Details">
        <template v-if="currentMessage">
          <p class="text-sm text-gray-600 mb-2">
            From: {{ currentMessage.sender }}
          </p>
          <p class="text-sm text-gray-600 mb-4">
            Date: {{ currentMessage.date }}
          </p>
          <div class="border-t pt-4">
            <p class="text-gray-800">{{ currentMessage.content }}</p>
          </div>
        </template>
      </rs-modal>
    </div>
  </div>
</template>

<style scoped>
/* Add any additional styles here */
</style>
