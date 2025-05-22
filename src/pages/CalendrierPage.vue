<template>
  <div class="sx-vue-calendar-wrapper">
    <ScheduleXCalendar :calendar-app="calendarApp" />
    <EvenementForm ref="evenementFormRef" />
  </div>
</template>

<script setup>
import { ScheduleXCalendar } from '@schedule-x/vue'
import {
  createCalendar,
  createViewWeek,
  createViewMonthGrid,
  createViewMonthAgenda,
  createViewDay,
} from '@schedule-x/calendar'
import '@schedule-x/theme-default/dist/index.css'

import { ref, onMounted } from 'vue'
import { useEvenementsStore } from 'stores/evenements'
import EvenementForm from 'components/EvenementForm.vue'

// Stores
const store = useEvenementsStore()

// Composant formulaire événement
const evenementFormRef = ref()

// Liste des événements (Schedule-X format)
const events = ref([])

// Récupérer et mapper depuis Supabase
async function loadEvents() {
  await store.fetchEvenements()
  events.value = store.list.map((e) => ({
    id: String(e.id),
    title: e.titre || 'Cours',
    start: `${e.date}T${e.heure_debut}`,
    end: `${e.date}T${e.heure_fin}`,
    // Optionnel : couleurs par discipline
    backgroundColor: e.discipline?.type === 'matiere' ? '#c8e6c9' : '#bbdefb',
  }))
  calendarApp.events = events.value
}

// Création de l'instance calendar
const calendarApp = createCalendar({
  selectedDate: new Date().toISOString().slice(0, 10),
  views: [createViewWeek(), createViewDay(), createViewMonthGrid(), createViewMonthAgenda()],
  defaultView: 'week',
  locale: 'fr-FR',
  firstDayOfWeek: 1,
  isDark: false,
  events: [],
  callbacks: {
    onClickDateTime(dateTime) {
      const [date, time] = dateTime.split(' ')
      evenementFormRef.value?.openAdd(date, time)
    },
    onEventClick(evt) {
      const fullEvt = store.list.find((e) => String(e.id) === String(evt.id))
      if (fullEvt) {
        evenementFormRef.value?.openEdit(fullEvt)
      }
    },
  },
})

// Chargement initial
onMounted(async () => {
  await loadEvents()
})
</script>

<style scoped>
.sx-vue-calendar-wrapper {
  width: 100%;
  height: 800px;
  max-height: 90vh;
}
</style>
