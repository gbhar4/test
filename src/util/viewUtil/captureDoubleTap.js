/**
 * @author Florencia Acosta <facosta@minutentag.com>
 * @summary A utility function to capture double click.
**/

export function onDoubleTap (callback) {
  let touchCount = 0;
  let doubleTap = () => {
    touchCount++;

    setTimeout(() => {
      touchCount = 0;
    }, 500);

    if (touchCount >= 2) {
      touchCount = 0;

      callback();
    }
  };

  return doubleTap;
}
