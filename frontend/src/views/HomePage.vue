<template>
  <div class="max-w-4xl mx-auto m-8 px-4 sm:px-6 lg:px-8">
    <!-- Countdown -->
    <TimeLeft :startDate="new Date('2026-05-12T18:00:00')" />

    <!-- Main card -->
    <div class="mt-8 bg-white shadow-lg rounded-xl overflow-hidden">
      <!-- Header -->
      <div class="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
        <h1 class="text-3xl font-bold">Pasaules čempionāts hokejā 2026 – Prognožu spēle</h1>
        <p class="mt-2 text-blue-100 text-lg">
          Pierādi savu ekspertīzi hokeja prognozēšanā un izaicini citus entuziastus visā pasaulē!
        </p>
      </div>

      <!-- Description -->
      <div class="p-6 space-y-6">
        <div class="space-y-3">
          <span
            class="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700"
          >
            Hokeja pasaules čempionāts
          </span>
          <h2 class="text-2xl font-semibold text-gray-900">Izaicini sevi profesionālā līmenī</h2>
          <p class="text-gray-700 leading-relaxed">
            Prognožu spēle piedāvā iespēju paredzēt katras spēles iznākumu, pamatlaika rezultātu un
            sekot līdzi turnīra gaitai reāllaikā. Attīsti analītiskās prasmes un sacenties ar citiem
            faniem.
          </p>
        </div>

        <!-- How it works -->
        <div class="border-t border-gray-200 pt-6 space-y-3">
          <h3 class="text-xl font-semibold text-gray-900">Kā darbojas prognozes</h3>
          <ol class="list-decimal list-inside text-gray-700 space-y-1">
            <li>Ievadi paredzēto uzvarētāju un pamatlaika rezultātu.</li>
            <li>Prognozes tiek automātiski salīdzinātas ar oficiālajiem spēļu rezultātiem.</li>
            <li>Punkti tiek piešķirti par precīzu rezultātu un pareizu uzvarētāju.</li>
            <li>Dalies ar rezultātiem un redzi savu ranking līderu tabulā.</li>
          </ol>
        </div>

        <!-- Important info -->
        <div class="rounded-lg border border-amber-200 bg-amber-50 p-5">
          <h3 class="font-semibold text-amber-800">Svarīga informācija</h3>
          <ul class="list-disc list-inside mt-2 text-gray-700 space-y-1">
            <li>Tiek ņemts vērā tikai pamatlaika rezultātw (neizšķirts ir derīgs).</li>
            <li>Prognozes var iesniegt tikai vienu reizi.</li>
            <li>Punktu sistēma piešķir bonusus par precīzu vārtu skaitu un pareizu uzvarētāju.</li>
          </ul>
        </div>

        <!-- Why participate -->
        <div class="border-t border-gray-200 pt-6 space-y-2">
          <h3 class="text-xl font-semibold text-gray-900">Kāpēc piedalīties</h3>
          <ul class="list-disc list-inside text-gray-700 space-y-1">
            <li>Uzlabot spēju analizēt komandu sniegumu un taktiku.</li>
            <li>
              Sekot līdzi turnīra gaitai un salīdzināt savas prognozes ar citiem dalībniekiem.
            </li>
            <li>Gūt adrenalīnu, sacensības garšu un izklaidi vienlaikus.</li>
            <li>Stiprināt stratēģisko domāšanu un prognozēšanas prasmes.</li>
          </ul>
        </div>

       <!-- Additional pro tips -->
<div class="rounded-lg border border-green-200 bg-green-50 p-5">
  <h3 class="font-semibold text-green-800">Pro padomi prognozētājiem</h3>
  <ul class="list-disc list-inside mt-2 text-gray-700 space-y-1">
    <li>Pētiet komandu statistiku un iepriekšējos spēļu rezultātus.</li>
    <li>Uzvarētāju prognozes var pārbaudīt arī bukmeikeru piedāvājumos, lai salīdzinātu savas prognozes ar ekspertu prognozēm.</li>
    <li>Analizējiet iepriekšējās tikšanās starp komandām – galvenie uzvarētāji bieži atkārtojas.</li>
  </ul>
</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import TimeLeft from '../components/TimeLeft.vue'
</script>
