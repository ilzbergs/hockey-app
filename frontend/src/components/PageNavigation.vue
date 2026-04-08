<template>
  <nav
    class="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-xl border-b border-white/10 shadow-lg"
  >
    <div class="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
      <!-- Logo -->
      <div class="flex items-center gap-3 cursor-pointer" @click="router.push('/home')">
        <img :src="icon" class="h-10 w-10 opacity-90" />
        <span class="text-white font-semibold text-lg tracking-wide">Hokeja Prognozes</span>
      </div>

      <!-- Desktop navigation -->
      <div class="hidden md:flex items-center gap-8">
        <NavItem label="Sākums" path="/home" />
        <NavItem label="Prognozes" path="/predictions" />
        <NavItem label="Turnīra tabula" path="/summary" />
        <NavItem
          v-if="authStore.user?.role === 'admin'"
          label="Spēļu rezultāti"
          path="/results"
        />
      </div>

      <!-- User section -->
      <div class="hidden md:flex items-center gap-4 text-white">
        <span class="pi pi-user"></span>
        <span class="font-medium">
          {{ authStore.user?.firstName }} {{ authStore.user?.lastName }}
        </span>

        <button
          @click="logout"
          class="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition"
        >
          Iziet
        </button>
      </div>

      <!-- Mobile menu toggle -->
      <button class="md:hidden text-white text-2xl" @click="menuOpen = !menuOpen">
        <i class="pi pi-bars"></i>
      </button>
    </div>

    <!-- Mobile dropdown -->
    <transition name="fade">
      <div
        v-if="menuOpen"
        class="md:hidden bg-[#0f1525] border-t border-white/10 px-6 py-4 space-y-4 text-white"
      >
        <NavItem label="Sākums" path="/home" @click="close" />
        <NavItem label="Prognozes" path="/predictions" @click="close" />
        <NavItem label="Turnīra tabula" path="/summary" @click="close" />
        <NavItem
          v-if="authStore.user?.role === 'admin'"
          label="Spēļu rezultāti"
          path="/results"
          @click="close"
        />

        <div class="pt-4 border-t border-white/10 flex items-center justify-between">
          <span class="font-medium">
            {{ authStore.user?.firstName }} {{ authStore.user?.lastName }}
          </span>

          <button
            @click="logout"
            class="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition"
          >
            Iziet
          </button>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import icon from '../assets/images/icon.png'
import NavItem from './NavItem.vue'

const menuOpen = ref(false)
function close() {
  menuOpen.value = false
}

const router = useRouter()
const authStore = useAuthStore()

async function logout() {
  await authStore.logout()
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
