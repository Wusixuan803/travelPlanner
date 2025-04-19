import { MESSAGES } from './constants';
import './Status.css';

function Status({ error }) {
  const message = error?.message || MESSAGES[error] || MESSAGES.default;
  return (
    <div className="status">
      {error && message}
    </div>
  );
}

export default Status;
