<template>
  <div>
    <h2>Atjaunināt rezultātus</h2>
{{ games }}
    <!-- Iterējām pa visām spēlēm -->
    <div v-for="game in games" :key="game.gameRef" class="game-row">
      <span>{{ game.homeTeam }} vs {{ game.awayTeam }}</span>

      <!-- Ievadām rezultātus -->
      <input
        v-model="game.homeScore"
        type="number"
        placeholder="Home Score"

      />
      <input
        v-model="game.awayScore"
        type="number"
        placeholder="Away Score"

      />

      <!-- Saglabāt rezultātus -->
      <button @click="updateGameResults(game)">Atjaunināt</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Game, useGamesStore } from '../stores/gameStore';

const gameStore = useGamesStore()
const games = ref<Game[]>([])
onMounted(async () => {
  games.value = await gameStore.fetchGames()
})

async function updateGameResults(game: Game) {
  console.log('game',game);

  if (game.homeScore !== null && game.awayScore !== null) {
    await gameStore.updateGameScore(game.id, game.homeScore, game.awayScore)
  }
  console.log(game);

}
</script>
