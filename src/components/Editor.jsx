import React from "react";
import Editor from "@monaco-editor/react";

const LANGUAGE_MAP = {
  html: "html",
  css: "css",
  js: "javascript",
};

const TABS = [
  { key: "html", label: "HTML" },
  { key: "css", label: "CSS" },
  { key: "js", label: "JavaScript" },
];

const CodeEditor = ({ activeTab, onTabChange, code, onChange }) => {
  const handleEditorChange = (value) => {
    onChange(value || "");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div className="editor-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={`editor-tab ${activeTab === tab.key ? "active" : ""}`}
            onClick={() => onTabChange(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div style={{ flex: 1 }}>
        <Editor
          height="100%"
          language={LANGUAGE_MAP[activeTab]}
          value={code}
          onChange={handleEditorChange}
          theme="vs-dark"
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            wordWrap: "on",
            tabSize: 2,
          }}
          loading={
            <div style={{ color: "#ccc", padding: "1rem" }}>جاري تحميل المحرر...</div>
          }
        />
      </div>
    </div>
  );
};

export default CodeEditor;
