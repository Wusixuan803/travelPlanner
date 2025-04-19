import { useState } from 'react';
import './RegisterForm.css';

function RegisterForm({ onRegister }) {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (username.trim()) {
      onRegister(username);
      setError('');
    } else {
      setError('Username cannot be empty');
    }
  }

  return (
    <form className="register__form" action="#/register" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="register-username">Username:</label>
        <input 
          id="register-username"
          className="register__username" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Choose a username"
        />
        <small className="form-hint">Use only letters, numbers, and underscores</small>
        {error && <small className="form-error">{error}</small>}
      </div>
      <button className="register__button" type="submit">Sign up</button>
    </form>
  );
}

export default RegisterForm;
