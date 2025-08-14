<script setup>
import DraggableNested from "~/components/draggable/nested.vue";
const props = defineProps({
  tasks: {
    required: true,
    type: Array,
  },
});
</script>

<template>
  <draggable
    class="dragArea"
    tag="ul"
    :list="tasks"
    :group="{ name: 'g1' }"
    item-key="name"
  >
    <template #item="{ element }">
      <li>
        <p>{{ element.name }}</p>
        <DraggableNested :tasks="element.tasks" />
      </li>
    </template>
  </draggable>
</template>

<style scoped>
.dragArea {
  min-height: 50px;
  outline: 1px dashed;
}
</style>
