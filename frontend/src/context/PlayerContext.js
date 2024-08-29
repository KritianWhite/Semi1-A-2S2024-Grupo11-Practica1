import React, { createContext, useState } from 'react';

export const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null);

  const playSong = (song) => {
    setCurrentSong(song);
  };

  const resetSong = () => {
    setCurrentSong(null);
  };

  return (
    <PlayerContext.Provider value={{ currentSong, playSong, resetSong }}>
      {children}
    </PlayerContext.Provider>
  );
};
