<template>
  <div>
    <q-btn label="Générer facture QR" @click="generateQrBill" color="primary" />
    <div v-if="qrSvg" v-html="qrSvg" class="q-mt-md" style="max-width: 300px" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { generate_creditor_reference } from 'src/utils/creditor'
import { QrCode } from 'qrcodegen'

const qrSvg = ref(null)

function generateQrBill() {
  const creditor = {
    iban: 'CH1234567890123456789',
    name: 'ARCA Musica',
    address: 'Rue de l’École 5',
    zip: '1028',
    city: 'Préverenges',
    country: 'CH',
  }

  const debtor = {
    name: 'Famille Dupont',
    address: 'Rue des Lilas 12',
    zip: '1000',
    city: 'Lausanne',
    country: 'CH',
  }

  const amount = '350.00'
  const currency = 'CHF'
  const info = 'Cours de musique - mai 2025'

  const refBase = 'DUPO123456789'
  const reference = generate_creditor_reference(refBase)

  const payload = [
    'SPC',
    '0200',
    '1',
    formatAddress(creditor),
    '',
    '',
    '',
    amount,
    currency,
    formatAddress(debtor),
    'SCOR',
    reference,
    info,
    'EPD',
  ].join('\r\n')

  const qr = QrCode.encodeText(payload, QrCode.Ecc.MEDIUM)
  qrSvg.value = qr.toSvgString(1)
}

function formatAddress(person) {
  return [
    person.iban || '',
    person.name,
    person.address,
    '',
    person.zip + ' ' + person.city,
    person.country,
  ].join('\r\n')
}
</script>
