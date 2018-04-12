/**
 * @author Florencia Acosta <facosta@minutentag.com>
 * @summary A utility function to parse a specific format of phone.
 * @example formatPhone("1245678903")
 * This return "(124) 567-8903".
**/

function formatPhone (phone) {
  if (typeof phone === 'number') {
    phone = phone.toString();
  }

  phone = phone.replace('(', '').replace(')', '').replace('-', '').replace(' ', '').trim() || phone;

  if (phone.length === 10) {
    let arrayPhone = [];
    for (let i = 0; i < phone.length; i++) {
      arrayPhone.push(phone.substr(i, 1));
    }

    let prefix = '(' + arrayPhone[0] + arrayPhone[1] + arrayPhone[2] + ')';

    let sufix = arrayPhone[3] + arrayPhone[4] + arrayPhone[5] + '-' + arrayPhone[6] + arrayPhone[7] + arrayPhone[8] + arrayPhone[9];
    phone = prefix + ' ' + sufix;

    return phone;
  }

  return phone;
}

export {formatPhone};
