export function isMuted() {
  try {
    return localStorage.getItem('tetris-react:muted') === '1';
  } catch {
    return false;
  }
}
