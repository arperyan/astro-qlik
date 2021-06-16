import React, { useEffect, useRef } from "react";

const NebBar = ({ qStruc }) => {
  const element = useRef(null);

  useEffect(async () => {
    if (!qStruc) return;
    await qStruc.nebbie.render({
      element: element.current,
      type: "table",
      fields: ["Name", "=sum(Weight)"],
    });
  }, [qStruc]);

  return (
    <div className="chart-container">
      <div className="chart-object" ref={element} />
    </div>
  );
};

export default NebBar;
