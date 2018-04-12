export function getPipe (previousValue) {
  return {
    pipe: (f) => getPipe(f(previousValue)),
    result: previousValue
  };
}

export function passThrough (payload) {
  return payload;
}
