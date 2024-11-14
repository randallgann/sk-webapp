import Avatar from './Avatar';
import { GIRL_1_IMAGE, GIRL_2_IMAGE, GIRL_3_IMAGE } from '../utils/images';

export default function Message({ currentUser, children }) {
  const styles = {
    main: currentUser ? 'flex-row-reverse' : '',
    user: currentUser ? 'flex-row-reverse' : '',
    time: currentUser ? 'mr-2' : 'ml-2',
    wrapper: currentUser ? 'pr-3' : 'pl-3',
    alignItems: currentUser ? 'items-end' : 'items-start',
  };

  return (
    <div className={`flex ${styles.main}`}>
      <Avatar srcImage={currentUser ? GIRL_3_IMAGE : GIRL_1_IMAGE} />
      <div className={`${styles.wrapper}`}>
        <div className={`flex items-center mb-3 ${styles.user}`}>
          <span className="font-bold">Putri Tanjak</span>
          <span className={`text-sm text-gray-400 shrink-0 ${styles.time}`}>
            4:30 AM
          </span>
        </div>
        <div className={`flex flex-col gap-3 ${styles.alignItems}`}>
          {children}
        </div>
      </div>
    </div>
  );
}
