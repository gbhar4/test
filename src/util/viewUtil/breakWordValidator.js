/**
 * @author Florencia Acosta <facosta@minutentag.com>
 * @summary A utility function to check if a long word should be contain line break
**/

export default function breakWordValidator (name) {
  if (name !== null) {
    if (name.indexOf(' ') === -1) {
      return true;
    } else if (name.indexOf(' ') !== -1) {
      let _name = name.split(' ');
      let isLongWord = false;
      _name.map((word) => {
        /* NOTE: I taken 17 characters because seems be the min length to show ok the name */
        if (word.length > 17) {
          isLongWord = true;
        }
      });
      return isLongWord;
    }
  }

  return false;
}
