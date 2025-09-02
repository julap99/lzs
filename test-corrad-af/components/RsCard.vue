<script setup></script>

<template>
  <div class="card">
    <header v-if="!!$slots.header" class="card-header">
      <slot name="header" />
    </header>
    <main><slot></slot></main>
    <div v-if="!!$slots.body" class="card-body">
      <slot name="body" />
    </div>
    <footer v-if="!!$slots.footer" class="card-footer">
      <slot name="footer" />
    </footer>
  </div>
</template>
