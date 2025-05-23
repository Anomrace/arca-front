export function generate_creditor_reference(ref) {
  if (/^[A-Za-z0-9]{0,21}$/.test(ref)) {
    ref = ref.toUpperCase()

    let cr = ''
    for (let i = 0; i < ref.length; i++) {
      let cc = ref.charCodeAt(i)
      cr += cc < 65 ? cc - 48 : cc - 55
    }

    cr += '271500'
    while (cr.length > 10) {
      cr = (cr.substring(0, 10) % 97) + cr.substring(10)
    }

    return 'RF' + String(98 - (cr % 97)).padStart(2, '0') + ref
  }
  return ''
}

export function check_creditor_reference(ref) {
  if (/^RF\d{2}[A-Za-z0-9]{0,21}$/.test(ref)) {
    ref = ref.toUpperCase()
    ref = ref.substring(4) + ref.substring(0, 4)

    let cr = ''
    for (let i = 0; i < ref.length; i++) {
      let cc = ref.charCodeAt(i)
      cr += cc < 65 ? cc - 48 : cc - 55
    }

    while (cr.length > 10) {
      cr = (cr.substring(0, 10) % 97) + cr.substring(10)
    }

    return cr % 97 === 1
  }
  return false
}
