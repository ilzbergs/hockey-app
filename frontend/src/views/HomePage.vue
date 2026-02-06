<template>
  <div class="max-w-3xl mx-auto mt-6 px-4">
    <TimeLeft :startDate="new Date('2026-02-11T17:40:00')" />
    <div class="mt-6 bg-white rounded-md p-6 space-y-4">
      <h1 class="text-2xl font-bold text-gray-800">Laipni lūdzam prognožu spēlē!</h1>
      <p class="text-gray-700">
        Šī spēle ir lieliska iespēja pārbaudīt savas hokeja zināšanas un piedalīties aizraujošā
        izaicinājumā. Tava galvenā misija ir prognozēt spēļu rezultātus — precīzi norādot, kura komanda
        uzvarēs un cik daudz vārtu tiks gūti.
      </p>
      <h2 class="text-xl font-semibold text-blue-600">Kā tas darbojas?</h2>
      <ol class="list-decimal list-inside text-gray-700 space-y-1">
        <li>Norādi savu prognozi par komandas uzvaru un iespējamo rezultātu.</li>
        <li>Seko līdzi spēles norisei un redzi, vai tava prognoze bija pareiza.</li>
        <li>Saņem punktus par pareizi uzminētiem rezultātiem un seko līdzi savai pozīcijai tabulā.</li>
      </ol>
      <div class="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded">
        <h3 class="font-semibold text-yellow-700">Svarīga piezīme:</h3>
        <p class="text-gray-700 mt-1">
          Tikai pamatlaika rezultāts tiks ņemts vērā, prognozējot uzvarētāju un rezultātu.
          Tāpēc ir iespējams arī neizšķirts kā rezultāts!
        </p>
      </div>
      <h2 class="text-xl font-semibold text-blue-600">Kāpēc piedalīties?</h2>
      <ul class="list-disc list-inside text-gray-700 space-y-1">
        <li>Pārbaudi un uzlabo savas hokeja zināšanas.</li>
        <li>Sacensties ar citiem spēlētājiem un kļūsti par labāko prognozētāju.</li>
        <li>Vienkāršs un aizraujošs spēles formāts, kas sniedz gan izklaidi, gan iespēju mācīties.</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import TimeLeft from '../components/TimeLeft.vue'
</script>
