import { h } from "preact";
import { useEffect } from "preact/hooks";

const NebBar = ({ qStruc }) => {
  const element = useRef(null);

  useEffect(async () => {
    if (!qStruc) return;
    await qStruc.nebbie.render({
      element: element.current,
      type: "bar",
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
