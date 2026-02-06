<template>
  <div class="max-w-3xl mx-auto mt-6 px-4">
    <TimeLeft :startDate="new Date('2026-02-11T17:40:00')" />
    <div class="mt-6 bg-white rounded-md p-6 space-y-5">
      <div class="space-y-2">
        <span
          class="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700"
        >
          Ziemas olimpiskās spēles — hokejs
        </span>
        <h1 class="text-2xl font-bold text-gray-900">Prognožu spēle ar olimpisko garu</h1>
        <p class="text-gray-700">
          Ienāc profesionālā prognožu vidē, kur hokeja rezultātu paredzēšana kļūst par stratēģisku
          izaicinājumu. Tava misija ir precīzi prognozēt spēļu iznākumus un vārtu skaitu pamatlaikā.
        </p>
      </div>

      <div class="border-t border-gray-200 pt-4">
        <h2 class="text-lg font-semibold text-gray-900">Kā darbojas prognozes</h2>
        <ol class="mt-2 list-decimal list-inside text-gray-700 space-y-1">
          <li>Ievadi uzvarētāju un sagaidāmo pamatlaika rezultātu.</li>
          <li>Prognozes tiek salīdzinātas ar spēles pamatlaika iznākumu.</li>
          <li>Punkti tiek piešķirti par precīzu rezultātu un pareizu uzvarētāju.</li>
        </ol>
      </div>

      <div class="rounded-md border border-amber-200 bg-amber-50 p-4">
        <h3 class="font-semibold text-amber-800">Svarīga informācija</h3>
        <p class="text-gray-700 mt-1">
          Vērā tiek ņemts tikai pamatlaika rezultāts. Tas nozīmē, ka neizšķirts ir derīgs prognozes
          iznākums.
        </p>
      </div>

      <div class="border-t border-gray-200 pt-4">
        <h2 class="text-lg font-semibold text-gray-900">Kāpēc piedalīties</h2>
        <ul class="mt-2 list-disc list-inside text-gray-700 space-y-1">
          <li>Attīsti spēju analizēt komandu sniegumu olimpiskajā līmenī.</li>
          <li>Seko līdzi turnīra gaitai un salīdzini sevi ar citiem prognozētājiem.</li>
          <li>Baudi konkurenci un izklaidi vienlaikus.</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import TimeLeft from '../components/TimeLeft.vue'
</script>
