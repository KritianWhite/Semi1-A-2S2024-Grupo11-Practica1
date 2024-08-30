import React from 'react';
import { useContext } from 'react';
import { PlayerContext } from '../../context/PlayerContext';

const MainContent = ({ children }) => {
  const { playerHeight } = useContext(PlayerContext);

  return (
    <div style={{ marginBottom: `${playerHeight}px`, transition: 'margin-bottom 0.3s ease' }}>
      {children}
    </div>
  );
};

export default MainContent;
