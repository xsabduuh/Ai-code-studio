import React from "react";

const Toolbar = ({ onRun, onToggleAI, showAI }) => {
  return (
    <div className="toolbar">
      <span className="logo">AI Code Studio</span>
      <div className="toolbar-actions">
        <button className="toolbar-btn primary" onClick={onRun}>
          ▶ تشغيل
        </button>
        <button className="toolbar-btn" onClick={onToggleAI}>
          {showAI ? "إخفاء المساعد" : "إظهار المساعد"}
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
