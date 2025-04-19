import { useState } from 'react';
import './LoginForm.css';
import { SERVER, MESSAGES } from './constants';

function LoginForm({ onLogin }) {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (username.trim()) {
      onLogin(username)
        .catch(err => {
          if (err.error === SERVER.USER_NOT_FOUND) {
            setError(MESSAGES[SERVER.USER_NOT_FOUND]);
          } else {
            setError(MESSAGES[err.error] || MESSAGES.default);
          }
        });
    }
  }

  return (
    <form className="login__form" action="#/login" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="username">Username:</label>
        <input 
          id="username"
          className="login__username" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
        />
        {error && <div className="login-error">{error}</div>}
      </div>
      <button className="login__button" type="submit">Log in</button>
    </form>
  );
}

export default LoginForm;
