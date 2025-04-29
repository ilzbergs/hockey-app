<template>
  <div class="p-4 sm:p-6 max-w-3xl mx-auto">
    <h2 class="text-2xl font-bold mb-6 text-center">Atjaunināt rezultātus</h2>

    <div
      v-for="game in games"
      :key="game.gameRef"
      class="flex flex-col gap-4 rounded-lg p-4 mb-4 border shadow-sm"
      :class="game.isUpdated ? 'bg-green-50' : 'bg-red-50'"
    >
      <!-- Komandu nosaukumi -->
      <div class="font-semibold text-gray-700 text-lg text-center sm:text-left">
        {{ game.homeTeam }} vs {{ game.awayTeam }}
      </div>

      <!-- Rezultāti un poga vienā rindā, bet kolonnā mobilajā -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-6">
        <!-- Rezultāta ievade -->
        <div class="flex justify-center sm:justify-start gap-3 items-center">
          <InputNumber
            v-model="game.homeScore"
            type="number"
            inputId="horizontal-buttons-home"
            showButtons
            buttonLayout="horizontal"
            :step="1"
            :min="0"
            fluid
            size="small"
          >
            <template #incrementbuttonicon>
              <span class="pi pi-plus" />
            </template>
            <template #decrementbuttonicon>
              <span class="pi pi-minus" />
            </template>
          </InputNumber>

          <span class="font-semibold text-xl">:</span>

          <InputNumber
            v-model="game.awayScore"
            type="number"
            inputId="horizontal-buttons-away"
            showButtons
            buttonLayout="horizontal"
            :step="1"
            :min="0"
            fluid
            size="small"
          >
            <template #incrementbuttonicon>
              <span class="pi pi-plus" />
            </template>
            <template #decrementbuttonicon>
              <span class="pi pi-minus" />
            </template>
          </InputNumber>
        </div>

        <!-- Poga -->
        <Button @click="updateGameResults(game)" class="w-full sm:w-28 self-center sm:self-auto">
          Atjaunināt
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Game, useGamesStore } from '../stores/gameStore'
import { InputNumber, Button } from 'primevue'

const gameStore = useGamesStore()
const games = ref<Game[]>([])

onMounted(async () => {
  games.value = await gameStore.fetchGames()
})

/**
 * Updates a game's score in the store and marks the game as updated.
 *
 * @param {Game} game - The game to update.
 */
function updateGameResults(game: Game) {
  if (game.homeScore !== null && game.awayScore !== null) {
    gameStore.updateGameScore(game.id, game.homeScore, game.awayScore)
    game.isUpdated = true
  }
}
</script>
