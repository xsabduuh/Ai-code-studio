import React, { useState } from "react";
import toast from "react-hot-toast";
import { requestAIAssistance } from "../services/api";

const ACTIONS = [
  { key: "fix", label: "🔧 إصلاح الكود", desc: "تصحيح الأخطاء" },
  { key: "explain", label: "📖 شرح الكود", desc: "شرح مفصل" },
  { key: "generate", label: "✨ توليد كود", desc: "أنشئ من وصف" },
  { key: "optimize", label: "⚡ تحسين الكود", desc: "تحسين الأداء" },
];

const AIAssistant = ({ currentCode, currentLanguage, onApplyCode, onClose }) => {
  const [customInstruction, setCustomInstruction] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastAction, setLastAction] = useState("");

  const handleAssist = async (action) => {
    if (!currentCode.trim()) {
      toast.error("لا يوجد كود لمعالجته.");
      return;
    }
    setLoading(true);
    setResult("");
    setLastAction(action);
    try {
      const data = await requestAIAssistance(currentCode, action, customInstruction);
      if (data.success) {
        const output =
          action === "explain"
            ? data.explanation
            : data.cleanCode || data.fullResponse;
        setResult(output);
        toast.success(`تم الإجراء بنجاح`);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || "فشل الاتصال بالمساعد");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = () => {
    if (result && lastAction !== "explain") {
      onApplyCode(result, currentLanguage);
      toast.success("تم تطبيق الكود");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result).then(() => toast.success("تم النسخ"));
  };

  return (
    <div className="ai-panel">
      <h3>
        🤖 مساعد الذكاء الاصطناعي
        <button className="close-btn" onClick={onClose} title="إغلاق">
          ×
        </button>
      </h3>

      <div className="action-buttons">
        {ACTIONS.map((act) => (
          <button
            key={act.key}
            className="ai-btn"
            onClick={() => handleAssist(act.key)}
            disabled={loading}
            title={act.desc}
          >
            {loading && lastAction === act.key ? (
              <span className="loading-spinner" />
            ) : null}
            {act.label}
          </button>
        ))}
      </div>

      <div className="custom-input">
        <input
          type="text"
          placeholder="تعليمات إضافية (اختياري)..."
          value={customInstruction}
          onChange={(e) => setCustomInstruction(e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="ai-result">
        {loading && <span className="loading-spinner" />}
        {result ? (
          <>
            <button className="copy-result-btn" onClick={handleCopy}>
              نسخ
            </button>
            <div>{result}</div>
            {lastAction !== "explain" && (
              <div style={{ marginTop: "0.8rem", textAlign: "right" }}>
                <button className="toolbar-btn primary" onClick={handleApply}>
                  📥 تطبيق الكود المُقترح
                </button>
              </div>
            )}
          </>
        ) : (
          <span style={{ color: "var(--text-secondary)" }}>
            {loading ? "جارٍ المعالجة..." : "النتيجة ستظهر هنا..."}
          </span>
        )}
      </div>
    </div>
  );
};

export default AIAssistant;
