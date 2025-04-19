import { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import './AuthPage.css';

function AuthPage({ onLogin, onRegister }) {
  const [showLogin, setShowLogin] = useState(true);
  
  return (
    <div className="auth-page">
      <h1>Travel Planner</h1>
      
      <div className="auth-container">
        {showLogin ? (
          <>
            <h2>Log in</h2>
            <LoginForm onLogin={onLogin} />
            <div className="divider">
              <hr className="line" />
              <span>OR</span>
              <hr className="line" />
            </div>
            <div className="auth-switch">
              <p>Don't have an account? <button onClick={() => setShowLogin(false)}>Sign up</button></p>
            </div>
          </>
        ) : (
          <>
            <h2>Sign up</h2>
            <RegisterForm onRegister={onRegister} />
            <div className="divider">
              <hr className="line" />
              <span>OR</span>
              <hr className="line" />
            </div>
            <div className="auth-switch">
              <p>Already have an account? <button onClick={() => setShowLogin(true)}>Log in</button></p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AuthPage;
