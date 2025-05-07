<script setup>
const props = defineProps({
  url: {
    type: String,
    required: true,
  },
});

const url = ref(window.location.origin + props.url);
const params = ref([
  {
    key: "",
    value: "",
  },
]);

const method = ref("POST");
const dropdownMethods = ref([
  {
    label: "GET",
    value: "GET",
  },
  {
    label: "POST",
    value: "POST",
  },
  {
    label: "PUT",
    value: "PUT",
  },
  {
    label: "DELETE",
    value: "DELETE",
  },
]);

const bodyJson = ref("{}");

const response = ref("");

watch(
  params,
  () => {
    const urlParams = new URLSearchParams();
    params.value.forEach((param) => {
      if (param.key !== "") {
        urlParams.append(param.key, param.value);
      }
    });
    url.value = window.location.origin + props.url + "?" + urlParams.toString();
  },
  { deep: true }
);

const addParam = () => {
  params.value.push({
    key: "",
    value: "",
  });
};

const removeParam = (index) => {
  if (params.value.length === 1) return;
  params.value.splice(index, 1);
};

const hitAPI = async () => {
  const res = await useFetch(url.value, {
    method: method.value,
    initialCache: false,
    body: JSON.stringify(bodyJson.value),
  });

  response.value = JSON.stringify(res.data.value, null, 2);
};
</script>

<template>
  <div>
    <FormKit type="text" label="URL" v-model="url" disabled />
    <FormKit
      type="select"
      label="Method"
      :options="dropdownMethods"
      v-model="method"
    />

    <label
      class="formkit-label text-gray-700 dark:text-gray-200 mb-2 font-semibold text-sm formkit-invalid:text-red-500 dark:formkit-invalid:text-danger flex justify-between items-center"
      for="input_8"
      >Parameter
      <rs-button size="sm" @click="addParam()"> Add</rs-button>
    </label>
    <div class="dynamic-params grid grid-cols-3 gap-4">
      <div v-for="(val, index) in params">
        <FormKit type="text" placeholder="Key" v-model="val.key" />
        <FormKit type="text" placeholder="Value" v-model="val.value" />
        <rs-button @click="removeParam(index)"> Remove</rs-button>
      </div>
    </div>

    <br />

    <label
      class="formkit-label text-gray-700 dark:text-gray-200 mb-2 font-semibold text-sm formkit-invalid:text-red-500 dark:formkit-invalid:text-danger flex justify-between items-center"
      for="input_8"
      >Body
    </label>

    <ClientOnly>
      <rs-code-mirror v-model="bodyJson" mode="application/json" height="300px">
      </rs-code-mirror>
    </ClientOnly>

    <br />
    <label
      class="formkit-label text-gray-700 dark:text-gray-200 mb-2 font-semibold text-sm formkit-invalid:text-red-500 dark:formkit-invalid:text-danger flex justify-between items-center"
      for="input_8"
      >Response
    </label>

    <!-- <ClientOnly>
      <rs-code-mirror v-model="response" height="300px" readonly="nocursor">
      </rs-code-mirror>
    </ClientOnly> -->

    <FormKit
      type="textarea"
      :classes="{
        input: '!bg-[#272822] text-white dark:bg-gray-800 dark:text-gray-200',
      }"
      rows="10"
      v-model="response"
      disabled
    ></FormKit>

    <br />

    <div class="flex justify-end">
      <rs-button @click="hitAPI"> Test</rs-button>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
