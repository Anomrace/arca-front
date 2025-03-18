<template>
  <q-page class="flex flex-center">
    <q-card>
      <q-card-section>
        <q-card-title>
          <h1>Connexion</h1>
        </q-card-title>
      </q-card-section>
      <q-card-section>
        <q-input v-model="email" label="Email" />
        <q-input v-model="password" label="Mot de passe" type="password" />
      </q-card-section>
      <q-card-section>
        <q-btn color="primary" label="Connexion" @click="login" />
      </q-card-section>
    </q-card>
  </q-page>
</template>
