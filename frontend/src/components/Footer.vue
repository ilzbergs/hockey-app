<template>
  <footer class="w-full bg-[#0a0f1c] border-t border-white/10 text-gray-300">
    <!-- Top area -->
    <div class="max-w-6xl mx-auto px-6 py-10 text-center">
      <!-- Your original text -->
      <p class="text-gray-300 text-sm leading-relaxed max-w-2xl mx-auto">
        Pievienojies WhatsApp čatam un apspried spēles kopā ar citiem hokeja faniem.
      </p>

      <!-- WhatsApp CTA Button -->
      <div class="flex justify-center mt-5">
        <a
          href="https://chat.whatsapp.com/I6IZjAHo62U5UFREPHssJ4"
          target="_blank"
          class="flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5a] text-white px-6 py-3 rounded-full font-semibold shadow-lg transition transform hover:scale-105"
        >
          <i class="pi pi-whatsapp text-2xl"></i>
          <span>Doties uz WhatsApp</span>
        </a>
      </div>
    </div>

    <!-- Bottom bar -->
    <div class="bg-[#050812] border-t border-white/10 py-4 text-center text-gray-500 text-sm">
      © {{ year }} Hokeja Prognozes. Visas tiesības aizsargātas.
    </div>
  </footer>
</template>

<script setup lang="ts">
const year = new Date().getFullYear()
</script>
