import Payment from 'payment';

function clearNumber(value = '') {
  return value.replace(/\D+/g, '');
}

export function formatCreditCardNumber(value) {
  if (!value) {
    return value;
  }

  const issuer = Payment.fns.cardType(value);
  const clearValue = clearNumber(value);
  let nextValue;

  switch (issuer) {
    case 'amex':
      nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(
        4,
        10,
      )} ${clearValue.slice(10, 15)}`;
      break;
    case 'dinersclub':
      nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(
        4,
        10,
      )} ${clearValue.slice(10, 14)}`;
      break;
    default:
      nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(
        4,
        8,
      )} ${clearValue.slice(8, 12)} ${clearValue.slice(12, 19)}`;
      break;
  }

  return nextValue.trim();
}

export function formatCVC(value, ccnumber) {
  const clearValue = clearNumber(value);
  let maxLength = 4;

  if (ccnumber) {
    const issuer = Payment.fns.cardType(ccnumber);
    maxLength = issuer === 'amex' ? 4 : 3;
  }
  return clearValue.slice(0, maxLength);
}

export function formatExpirationDate(value) {
  const clearValue = clearNumber(value);

  if(parseInt(clearValue.slice(0, 2)) > 12)
    return clearValue.slice(0, 1);
  // if(parseInt(clearValue.slice(0, 2)) > 12)
  //   return "0" + clearValue.slice(0, 1) + "/" + clearValue.slice(1, 2);
  if (clearValue.length >= 3) {
    return `${clearValue.slice(0, 2)}/${clearValue.slice(2, 4)}`;
  }

  return clearValue;
}

export function formatFormData(data) {
  return Object.keys(data).map(d => `${d}: ${data[d]}`);
}
