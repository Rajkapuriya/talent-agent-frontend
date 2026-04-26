import { Link } from 'react-router-dom';
import TopBar from './TopBar';

/**
 * Standard page wrapper: TopBar + scrollable content area.
 * @param {string}   title   - Page title shown in TopBar
 * @param {string}   back    - Optional back-link path
 * @param {ReactNode} children
 */
export default function PageWrapper({ title, back, children }) {
  return (
    <div className="min-h-full flex flex-col">
      <TopBar title={title} back={back} />
      <div className="flex-1 px-6 pb-6 pt-5">
        <div className="mx-auto w-full max-w-screen-xl">{children}</div>
      </div>
    </div>
  );
}
