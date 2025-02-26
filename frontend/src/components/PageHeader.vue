<template>
  <Accordion>
    <AccordionPanel value="0">
      <AccordionHeader :pt="{ root: { class: '!bg-gray-200 !h-2 !rounded-none' } }">{{
        title
      }}</AccordionHeader>
      <AccordionContent :pt="{ content: { class: '!bg-gray-200' } }">
        <div class="pt-3 ml-4 text-xs text-gray-600">
          <slot name="legend"></slot>
        </div>
      </AccordionContent>
    </AccordionPanel>
  </Accordion>
</template>
<script setup lang="ts">
import Accordion from 'primevue/accordion'
import AccordionPanel from 'primevue/accordionpanel'
import AccordionHeader from 'primevue/accordionheader'
import AccordionContent from 'primevue/accordioncontent'

// Props
defineProps({
  title: {
    type: String,
    required: true,
  },
})
</script>
#f1f5f9 #f1f5f9
