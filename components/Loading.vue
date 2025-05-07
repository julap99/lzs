<script setup>
const showMessage = ref(false);

setTimeout(() => {
  showMessage.value = true;
}, 2000);

const refreshPage = () => {
  // hard refresh
  window.location.reload(true);
};
</script>

<template>
  <div class="rs-loading bg-white absolute z-50 top-0 left-0 w-full h-full">
    <div class="flex justify-center text-center items-center h-screen">
      <div>
        <div class="img-container flex justify-center items-center mb-5">
          <img 
            src="https://www.zakatselangor.com.my/wp-content/uploads/2018/10/lzs-logo.png" 
            class="max-w-[150px]" 
            alt="LZS Logo"
          />
        </div>

        <div
          class="flex justify-center items-center"
          aria-label="Loading..."
          role="status"
        >
          <svg class="h-14 w-14 animate-spin" viewBox="3 3 18 18">
            <path
              class="fill-[#00A59A]/10"
              d="M12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5ZM3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z"
            ></path>
            <path
              class="fill-[#00A59A]"
              d="M16.9497 7.05015C14.2161 4.31648 9.78392 4.31648 7.05025 7.05015C6.65973 7.44067 6.02656 7.44067 5.63604 7.05015C5.24551 6.65962 5.24551 6.02646 5.63604 5.63593C9.15076 2.12121 14.8492 2.12121 18.364 5.63593C18.7545 6.02646 18.7545 6.65962 18.364 7.05015C17.9734 7.44067 17.3403 7.44067 16.9497 7.05015Z"
            ></path>
          </svg>
        </div>
        <div v-if="showMessage" class="my-10 text-gray-500 font-medium">
          If loading takes too long,
          <br />
          please click
          <button @click="refreshPage">
            <span class="text-[#F3586A]">here</span>
          </button>
          or hard refresh your browser.
        </div>
      </div>
    </div>
  </div>
</template>
