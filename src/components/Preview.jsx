import React, { useMemo } from "react";
import { combineCode } from "../utils/combineCode";

const Preview = ({ html, css, js }) => {
  const sourceDoc = useMemo(() => combineCode(html, css, js), [html, css, js]);

  return (
    <iframe
      className="preview-iframe"
      title="معاينة الكود"
      sandbox="allow-scripts allow-same-origin"
      srcDoc={sourceDoc}
    />
  );
};

export default Preview;
