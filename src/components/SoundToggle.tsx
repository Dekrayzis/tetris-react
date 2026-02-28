import React from 'react';
import SoundToggleEqualizer from './SoundToggleEqualizer';
import styles from './SoundToggle.module.scss';

type SoundToggleProps = {
  muted: boolean;
  onToggle: () => void;
};

const SoundToggle = ({ muted, onToggle }: SoundToggleProps) => {
  const columns = 4;

  return (
    <button
      type="button"
      aria-label={muted ? 'Unmute sound' : 'Mute sound'}
      onClick={onToggle}
      className={`${styles.toggleButton} ${muted ? styles.muted : ''}`.trim()}
    >
      <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M3 10v4c0 .55.45 1 1 1h3.6l4.9 4.1c.65.55 1.6.08 1.6-.77V5.56c0-.85-.96-1.32-1.6-.77L7.6 8.9H4c-.55 0-1 .45-1 1Z"
        />
        {!muted ? (
          <path
            fill="currentColor"
            d="M16.5 8.1a1 1 0 0 1 1.4.13 7 7 0 0 1 0 7.55 1 1 0 1 1-1.54-1.28 5 5 0 0 0 0-4.99 1 1 0 0 1 .14-1.41Zm2.6-2.27a1 1 0 0 1 1.41.06 11 11 0 0 1 0 12.22 1 1 0 1 1-1.53-1.3 9 9 0 0 0 0-9.61 1 1 0 0 1 .12-1.37Z"
          />
        ) : (
          <path
            fill="currentColor"
            d="M17.2 8.8a1 1 0 0 1 1.41 0l1.6 1.6 1.6-1.6a1 1 0 1 1 1.41 1.41l-1.6 1.6 1.6 1.6a1 1 0 0 1-1.41 1.41l-1.6-1.6-1.6 1.6a1 1 0 0 1-1.41-1.41l1.6-1.6-1.6-1.6a1 1 0 0 1 0-1.41Z"
          />
        )}
      </svg>

      <SoundToggleEqualizer muted={muted} columns={columns} />
    </button>
  );
};

export default SoundToggle;
