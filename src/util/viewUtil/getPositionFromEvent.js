export function getPositionFromEvent (event) {
  if ('touches' in event) {
    const { pageX, pageY } = event.touches[0];
    return { left: pageX, top: pageY };
  }

  const { screenX, screenY } = event;
  return { left: screenX, top: screenY };
}
