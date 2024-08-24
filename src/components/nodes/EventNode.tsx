import { Handle, NodeProps, Position, useReactFlow } from "@xyflow/react";
import { useDispatch } from "react-redux";
import { showModal } from "../../slice/modalSlice";
import "../../styles/event-node.css";
import { deleteSelectedNode } from "../../slice/treeSlice";
import ParametersInput from "./ParametersInput";
import ParametersText from "./ParametersText";
import { useState } from "react";

export default function EventNode({
  data: { description, probability, skill, frequency, cost, isPossible },
  id,
}: NodeProps<any>) {
  const { setNodes } = useReactFlow();
  const [showOptionButtons, setShowOptionButtons] = useState(false);

  const dispatch = useDispatch();
  const hangelCheckBoxChange = () => {
    setNodes((nodes: any) =>
      nodes.map((node: any) =>
        node.id === id
          ? {
              ...node,
              data: {
                ...node.data,
                isPossible: !node?.data?.isPossible || false,
              },
            }
          : node
      )
    );
  };

  const deleteNode = () => {
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
    dispatch(deleteSelectedNode(id));
  };
  return (
    <div
      className="container"
      onMouseEnter={() => setShowOptionButtons(true)}
      onMouseLeave={() => setShowOptionButtons(false)}
    >
      <div style={{ background: "#8eff17" }} className="text-container flex">
        <ParametersText description={description} id={id} />
      </div>
      {/* <div className="floating">adfaff</div> */}
      <div className="parameters">
        <p>
          P&nbsp;
          <ParametersInput
            type={"probability"}
            parameter={probability}
            id={id}
          />
        </p>
        <p>
          K&nbsp;
          <ParametersInput type={"skill"} parameter={skill} id={id} />
        </p>
        <p>
          F&nbsp;
          <ParametersInput type={"frequency"} parameter={frequency} id={id} />
        </p>
        <p>
          C&nbsp;
          <ParametersInput type={"cost"} parameter={cost} id={id} />
        </p>
        <button
          style={{ visibility: showOptionButtons ? "visible" : "hidden" }}
          className="delete-node-btn"
          onClick={deleteNode}
        >
          X
        </button>
        <div>
          <p>Possible?</p>
          <input
            type="checkbox"
            checked={isPossible}
            onChange={hangelCheckBoxChange}
          />
        </div>
        <button
          className="expand-node-btn"
          onClick={() => dispatch(showModal(id))}
        >
          Expand
        </button>
      </div>
      <Handle id="top" type="target" position={Position.Top} />
    </div>
  );
}
