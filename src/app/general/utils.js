

// stops a particular sound
export function stopSound(sound) {
    sound.pause();
    sound.currentTime = 0;
}