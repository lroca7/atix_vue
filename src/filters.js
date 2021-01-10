import numeral from 'numeral'
import moment from 'moment'

const dollarFilter = function(value) {
  if (!value) {
    return '$0'
  }

  return numeral(value).format('($ 0,0[.]00)')
}

const percentFilter = function(value) {
  if (!value) {
    return '0%'
  }

  return `${Number(value).toFixed(2)}%`
}

const formatDate = function(value) {
  let date = ''

  if (value) {
    date = moment(String(value)).format('MM/DD/YYYY hh:mm')
  }
  return date
}

export { dollarFilter, percentFilter, formatDate }
