<template>
  <Accordion >
    <AccordionPanel value="0">
      <AccordionHeader>{{ title }}</AccordionHeader>
      <AccordionContent>
        <slot name="legend"></slot>
      </AccordionContent>
    </AccordionPanel>
  </Accordion>
</template>
<script setup lang="ts">
import Accordion from 'primevue/accordion'
import AccordionPanel from 'primevue/accordionpanel'
import AccordionHeader from 'primevue/accordionheader'
import AccordionContent from 'primevue/accordioncontent'

defineProps({
  title: {
    type: String,
    required: true,
  },
})
</script>
