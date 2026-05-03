<template>
  <div>
    <ToggleButton
      v-model="showOnlyUpdated"
      onLabel="Rādīt visus rezultātus"
      offLabel="Rādīt tikai notikušās spēles"
      class="mb-4"
      size="small"
    />
  </div>
  <div>
    <div class="rotate-phone-overlay">
      <div class="rotate-phone-card">
        <div class="text-4xl mb-3">📱↔️</div>
        <p class="font-semibold text-white">Pagriez telefonu horizontāli</p>
        <p class="text-sm text-gray-300 mt-2">
          Šī tabula ir plaša, tāpēc ainavas režīmā to būs ērtāk pārskatīt.
        </p>
      </div>
    </div>
    <!-- Loading indikator -->
    <div v-if="isLoading" class="text-center text-lg text-gray-600 py-4">
      <span>Loading...</span>
    </div>

    <DataTable
      v-else
      :value="userStatsPrediction"
      dataKey="username"
      size="small"
      :sortField="'totalPoints'"
      :sortOrder="-1"
      scrollable
      tableStyle="min-width: 50rem"
      style="padding: 1rem"
      :rowHover="true"
      :pt="{
        bodyRow: {
          style: {
            background: 'lightgray',
          },
        },
        tableContainer: {
          style: {
            borderRadius: '12px',
          },
        },
      }"
    >
      <!-- Rank Column -->
      <Column
        field="rank"
        header="Vieta"
        alignFrozen="left"
        frozen
        class="font-semibold w-10 text-sm"
      >
        <template #body="slotProps">{{ calculateRank(slotProps.data) }}</template>
      </Column>

      <!-- Username Column -->
      <Column
        field="username"
        header="Lietotājvārds"
        alignFrozen="left"
        frozen
        class="font-semibold w-24 text-sm"
      >
        <template #body="slotProps">
          <div class="flex items-center cursor-pointer" @click="openModal(slotProps.data)">
            <span v-if="calculateRank(slotProps.data) === 1">🥇</span>
            <span v-if="calculateRank(slotProps.data) === 2">🥈</span>
            <span v-if="calculateRank(slotProps.data) === 3">🥉</span>
            {{ slotProps.data.username }}
          </div>
        </template>
      </Column>

      <!-- Columns per Game -->
      <Column v-for="game in gameList" :key="game.gameRef">
        <template #header>
          <div class="flex flex-col items-center text-sm w-[6rem]">
            <p class="text-xs text-gray-600 uppercase">{{ game.homeTeam }}</p>
            <p class="text-xs text-gray-400">vs</p>
            <p class="text-xs text-gray-600 uppercase">{{ game.awayTeam }}</p>
            <p v-if="game.isUpdated" class="font-bold text-md text-blue-600 mt-1 text-xs">
              {{ game.homeScore ?? '-' }} : {{ game.awayScore ?? '-' }}
            </p>
          </div>
        </template>

        <template #body="slotProps">
          <div
            v-if="slotProps.data.predictions[game.gameRef]"
            class="w-[6rem] flex justify-center gap-2"
          >
            <div :style="{ color: getPredictionColor(slotProps.data.predictions, game) }">
              {{ slotProps.data.predictions[game.gameRef].homePrediction ?? '-' }} :
              {{ slotProps.data.predictions[game.gameRef].awayPrediction ?? '-' }}
            </div>
            <!--  -->
            <template v-if="game.isUpdated">
              |
              <div>{{ slotProps.data.predictions[game.gameRef].points ?? 0 }}</div>
            </template>
          </div>
          <span v-else>-</span>
        </template>
      </Column>

      <!-- Total Points Column -->
      <Column header="Punkti" alignFrozen="right" frozen class="font-semibold w-[4rem] text-sm">
        <template #body="slotProps">{{ calculateTotalPointsFromUser(slotProps.data) }}</template>
      </Column>
    </DataTable>

    <Dialog
      v-model:visible="showModal"
      modal
      header="Lietotāja detaļas"
      :style="{ width: '50rem' }"
    >
      <div v-if="selectedUser">
        <p class="font-semibold pb-2">{{ selectedUser.username }}</p>
        <p>Kopējie punkti: {{ selectedUser.totalPoints }}</p>
        <p>Precīzi uzminēti rezultāti: {{ selectedUser.correctCount }}</p>

        <DataTable :value="Object.values(selectedUser.predictions)" size="small">
          <Column field="game.homeTeam" header="Komanda 1" />
          <Column field="game.awayTeam" header="Komanda 2" />
          <Column header="Prognoze">
            <template #body="slotProps">
              {{ slotProps.data.homePrediction ?? '-' }} :
              {{ slotProps.data.awayPrediction ?? '-' }}
            </template>
          </Column>
          <Column field="points" header="Punkti" />
        </DataTable>
      </div>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, PropType, ref, watch } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { useGamesStore } from '../stores/gameStore'
import { UserPrediction } from '../stores/predictionStore'

import ToggleButton from 'primevue/togglebutton'
import Dialog from 'primevue/dialog'

const gamesStore = useGamesStore()

const showOnlyUpdated = ref(false)

onMounted(() => {
  const saved = localStorage.getItem('showOnlyUpdated')
  if (saved !== null) {
    showOnlyUpdated.value = saved === 'true'
  }
})

// Watch, lai saglabātu localStorage katru reizi, kad mainās toggle
watch(showOnlyUpdated, (newVal) => {
  localStorage.setItem('showOnlyUpdated', newVal.toString())
})

const showModal = ref(false)
const selectedUser = ref<any>(null)

function openModal(user: any) {
  selectedUser.value = user
  showModal.value = true
}

const props = defineProps({
  data: {
    type: Array as PropType<UserPrediction[]>,
    required: true,
  },
})

const isLoading = computed(() => false) // Pielāgo pēc vajadzības

// Krāsas predikcijām
const PREDICTION_COLOR = {
  correct: '#3b82f6',
  partial: '#10b981',
  incorrect: '#ef4444',
  unknown: '#9ca3af',
  notUpdated: '#6b7280',
}

// Game list
const gameList = computed(() =>
  [...gamesStore.games]
    .filter((game) => (showOnlyUpdated.value ? game.isUpdated : true))
    .sort((a, b) => a.gameRef - b.gameRef),
)

// User-centric map ar predikcijām
const userStatsPrediction = computed(() => {
  const userMap: Record<
    string,
    {
      username: string
      totalPoints: number
      predictions: Record<number, UserPrediction>
      correctCount: number
    }
  > = {}

  for (const pred of props.data) {
    const userId = pred.user.id
    if (!userMap[userId]) {
      userMap[userId] = {
        username: pred.user.username,
        totalPoints: 0,
        predictions: {},
        correctCount: 0,
      }
    }
    userMap[userId].predictions[pred.game.gameRef] = pred
    userMap[userId].totalPoints += pred.points ?? 0
  }

  // Aprēķināt precizitāti
  for (const userId in userMap) {
    const user = userMap[userId]
    let correct = 0,
      partial = 0,
      total = 0
    for (const pred of Object.values(user.predictions)) {
      total++
      const game = (gamesStore.games ?? []).find((g) => g.gameRef === pred.game.gameRef)
      if (!game || !game.isUpdated) {
        total--
        continue
      }
      const isCorrect =
        pred.homePrediction === game.homeScore && pred.awayPrediction === game.awayScore
      if (isCorrect) {
        correct++
      } else {
        const predictedOutcome =
          (pred.homePrediction ?? 0) > (pred.awayPrediction ?? 0)
            ? 'home'
            : (pred.homePrediction ?? 0) < (pred.awayPrediction ?? 0)
              ? 'away'
              : 'draw'
        const actualOutcome =
          (game.homeScore ?? 0) > (game.awayScore ?? 0)
            ? 'home'
            : (game.homeScore ?? 0) < (game.awayScore ?? 0)
              ? 'away'
              : 'draw'
        const oneScoreCorrect =
          pred.homePrediction === game.homeScore || pred.awayPrediction === game.awayScore
        if (predictedOutcome === actualOutcome || oneScoreCorrect) partial++
      }
    }
    user.correctCount = correct
  }

  return Object.values(userMap).sort((a, b) => b.totalPoints - a.totalPoints)
})

// Predikcijas krāsa
function getPredictionColor(
  userPredictions: Record<number, UserPrediction>,
  game: { gameRef: number; homeScore: number | null; awayScore: number | null; isUpdated: boolean },
) {
  if (!game.isUpdated) return PREDICTION_COLOR.notUpdated
  const pred = userPredictions[game.gameRef]
  if (!pred || game.homeScore === null || game.awayScore === null) return PREDICTION_COLOR.unknown

  const correct = pred.homePrediction === game.homeScore && pred.awayPrediction === game.awayScore
  const predictedOutcome =
    (pred.homePrediction ?? 0) > (pred.awayPrediction ?? 0)
      ? 'homeWin'
      : (pred.homePrediction ?? 0) < (pred.awayPrediction ?? 0)
        ? 'awayWin'
        : 'draw'
  const actualOutcome =
    (game.homeScore ?? 0) > (game.awayScore ?? 0)
      ? 'homeWin'
      : (game.homeScore ?? 0) < (game.awayScore ?? 0)
        ? 'awayWin'
        : 'draw'
  const partialCorrect =
    pred.homePrediction === game.homeScore ||
    pred.awayPrediction === game.awayScore ||
    predictedOutcome === actualOutcome

  return correct
    ? PREDICTION_COLOR.correct
    : partialCorrect
      ? PREDICTION_COLOR.partial
      : PREDICTION_COLOR.incorrect
}

// Total points
function calculateTotalPointsFromUser(user: { totalPoints: number }) {
  return user.totalPoints
}

// Rank by total points
function calculateRank(user: { totalPoints: number }) {
  const users = userStatsPrediction.value
  const sorted = [...users].sort((a, b) => b.totalPoints - a.totalPoints)
  return sorted.findIndex((u) => u.totalPoints === user.totalPoints) + 1
}
</script>
<style>
.rotate-phone-overlay {
  display: none;
}

@media (max-width: 768px) and (orientation: portrait) {
  .rotate-phone-overlay {
    position: fixed;
    inset: 0;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    background: rgba(0, 0, 0, 0.75);
    backdrop-filter: blur(8px);
  }

  .rotate-phone-card {
    max-width: 320px;
    border-radius: 18px;
    border: 1px solid rgba(255, 255, 255, 0.14);
    background: rgba(15, 23, 42, 0.92);
    padding: 24px;
    text-align: center;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.45);
  }
}
</style>
