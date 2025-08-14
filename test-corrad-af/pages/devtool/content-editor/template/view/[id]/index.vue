<script setup>
definePageMeta({
  title: "Template Viewer",
  middleware: ["auth"],
  requiresAuth: true,
});

const id = useRoute().params.id;

const { data: template } = await useFetch(
  `/api/devtool/content/template/get-list`,
  {
    method: "GET",
    params: {
      id: id,
    },
  }
);

console.log(template.value.data);

const templateComponent = defineAsyncComponent(
  () => import(`../../../../../templates/${template.value.data.filename}.vue`)
);
</script>

<template>
  <div>
    <LayoutsBreadcrumb />

    <component :is="templateComponent" />
  </div>
</template>
