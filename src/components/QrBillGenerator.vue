<template>
  <div ref="qrCodeEl"></div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { generate_creditor_reference } from '@/utils/creditor.js'
import { QrCode } from '@/utils/qrcodegen.js'

const props = defineProps({
  account: String, // format : IBAN,Nom,Rue,Numéro,NPA,Ville
  reference: String, // ex : RF18539007547034
  amount: Number, // ex : 240.5
  currency: {
    type: String,
    default: 'CHF',
  },
  debtor: {
    type: String,
    default: '',
  },
  additionalInfo: {
    type: String,
    default: 'Paiement Arca Musica',
  },
})

const qrCodeEl = ref(null)

function formatTextForQr() {
  const parts = props.account.split(',')
  if (parts.length !== 6) return ''

  const iban = parts[0].replace(/\s/g, '')
  const cdtr = `${iban}\r\n${parts.slice(1).join('\r\n')}\r\nCH`

  const dbtrParts = props.debtor.split(',')
  const dbtr =
    dbtrParts.length === 5 ? `S\r\n${dbtrParts.join('\r\n')}\r\nCH` : '\r\n\r\n\r\n\r\n\r\n\r\n'

  const ref = props.reference?.startsWith('RF')
    ? props.reference.replace(/\s/g, '')
    : generate_creditor_reference(props.reference || '')

  const amt = props.amount?.toFixed(2) || ''
  const ccy = props.currency === 'EUR' ? 'EUR' : 'CHF'
  const info = props.additionalInfo || ''
  const tp = ref ? 'SCOR' : 'NON'

  return (
    `SPC\r\n0200\r\n1\r\n` +
    `${cdtr}\r\n\r\n\r\n\r\n\r\n\r\n\r\n` +
    `${amt}\r\n${ccy}\r\n` +
    `${dbtr}\r\n${tp}\r\n${ref}\r\n${info}\r\nEPD\r\n\r\n\r\n`
  )
}

function generateQrCode() {
  if (!qrCodeEl.value) return

  const text = formatTextForQr()
  const qr = QrCode.encodeText(text, QrCode.Ecc.MEDIUM)
  qrCodeEl.value.innerHTML = qr.toSvgString(0)
}

onMounted(generateQrCode)
watch(() => props, generateQrCode, { deep: true })
</script>
