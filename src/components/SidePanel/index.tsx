import { css } from 'aphrodite';

import StartGameButton from '../StartGameButton';
import styles from './styles';


const SidePanel = () =>( 
    <div className={css(styles.sidePanel)}>
      <StartGameButton />
    </div>
);

export default SidePanel;
