import React, { useState, useCallback } from "react";
import { Toaster } from "react-hot-toast";
import Toolbar from "./components/Toolbar";
import Editor from "./components/Editor";
import Preview from "./components/Preview";
import AIAssistant from "./components/AIAssistant";

const DEFAULT_CODES = {
  html: `<h1>مرحباً بك في AI Code Studio</h1>\n<p>ابدأ بكتابة HTML هنا...</p>`,
  css: `body {\n  font-family: 'Segoe UI', sans-serif;\n  background: #1e1e1e;\n  color: #d4d4d4;\n  padding: 2rem;\n}\nh1 {\n  color: #569cd6;\n}`,
  js: `console.log("مرحباً من JavaScript!");\ndocument.querySelector('h1').addEventListener('click', () => {\n  alert('تم النقر!');\n});`,
};

const App = () => {
  const [activeTab, setActiveTab] = useState("html");
  const [codes, setCodes] = useState(DEFAULT_CODES);
  const [previewKey, setPreviewKey] = useState(0);
  const [showAI, setShowAI] = useState(true);

  const updateCode = useCallback((tab, newCode) => {
    setCodes((prev) => ({ ...prev, [tab]: newCode }));
  }, []);

  const handleRunCode = () => {
    setPreviewKey((k) => k + 1);
  };

  const handleApplyAICode = (code, language = "html") => {
    if (["html", "css", "js"].includes(language)) {
      updateCode(language, code);
      setActiveTab(language);
    } else {
      updateCode(activeTab, code);
    }
    handleRunCode();
  };

  return (
    <div className="app">
      <Toaster
        position="bottom-right"
        toastOptions={{ style: { background: "#333", color: "#fff" } }}
      />
      <Toolbar
        onRun={handleRunCode}
        onToggleAI={() => setShowAI((s) => !s)}
        showAI={showAI}
      />
      <div className="main-content">
        <div className="editor-section">
          <Editor
            activeTab={activeTab}
            onTabChange={setActiveTab}
            code={codes[activeTab]}
            onChange={(newCode) => updateCode(activeTab, newCode)}
          />
        </div>
        <div className="preview-section">
          <Preview key={previewKey} html={codes.html} css={codes.css} js={codes.js} />
        </div>
        {showAI && (
          <div className="ai-section">
            <AIAssistant
              currentCode={codes[activeTab]}
              currentLanguage={activeTab}
              onApplyCode={handleApplyAICode}
              onClose={() => setShowAI(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
