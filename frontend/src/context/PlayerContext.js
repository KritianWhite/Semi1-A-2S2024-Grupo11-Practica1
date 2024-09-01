import React, { createContext, useState } from 'react';

export const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [playerHeight, setPlayerHeight] = useState(60); // Altura inicial del reproductor

  const playSong = (song) => {
    setCurrentSong(song);
  };

  const resetSong = () => {
    setCurrentSong(null);
  };

  return (
    <PlayerContext.Provider value={{ currentSong, playSong, resetSong, playerHeight, setPlayerHeight }}>
      {children}
    </PlayerContext.Provider>
  );
};
