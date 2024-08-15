import { Handle, NodeProps, Position, useReactFlow } from "@xyflow/react";
import { useDispatch } from "react-redux";
import { deleteSelectedNode } from "../../slice/treeSlice";
import "../../styles/intermediate-node.css";
import GateDropdown from "./GateDropdown";
import ParametersText from "./ParametersText";
import { useState } from "react";

export default function IntermediateNode({
  data: { gate, description },
  id,
}: NodeProps<any>) {
  const { setNodes } = useReactFlow();
  const dispatch = useDispatch();
  const [showOptionButtons, setShowOptionButtons] = useState(false);
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
      <div style={{ background: "#4fb4f9" }} className="text-container flex">
        <ParametersText description={description} id={id} />
      </div>

      <div className="gate-container flex">
        <GateDropdown gate={gate} id={id} />
        <button
          style={{ visibility: showOptionButtons ? "visible" : "hidden" }}
          className="delete-node-btn"
          onClick={deleteNode}
        >
          X
        </button>
      </div>
      <Handle id="top" type="target" position={Position.Top} />
      <Handle id="bottom" type="source" position={Position.Bottom} />
    </div>
  );
}
