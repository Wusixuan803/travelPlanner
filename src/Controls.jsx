import "./Controls.css";

function Controls({ onLogout }) {
  return (
    <div className="controls">
      <button onClick={onLogout} className="controls__logout">Logout</button>
    </div>
  );
}

export default Controls;
