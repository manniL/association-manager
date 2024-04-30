
<script setup lang="ts">
import { DatePicker } from 'v-calendar';
import 'v-calendar/dist/style.css';
const { emitFormChange } = useFormGroup();
</script>

<template>
  <DatePicker @update:model-value="emitFormChange" />
</template>