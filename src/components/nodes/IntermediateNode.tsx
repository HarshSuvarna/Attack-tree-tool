import { Handle, NodeProps, Position, useReactFlow } from "@xyflow/react";
import { useDispatch } from "react-redux";
import { deleteSelectedNode } from "../../slice/treeSlice";
import "../../styles/intermediate-node.css";
import GateDropdown from "./GateDropdown";
import ParametersText from "./ParametersText";

export default function IntermediateNode({
  data: { gate, description },
  id,
}: NodeProps<any>) {
  const { setNodes } = useReactFlow();
  const dispatch = useDispatch();

  const deleteNode = () => {
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
    dispatch(deleteSelectedNode(id));
  };
  return (
    <div className="container">
      <div style={{ background: "blue" }} className="text-container flex">
        <ParametersText description={description} id={id} />
      </div>
      <button onClick={deleteNode}>X</button>
      <div className="gate-container flex">
        <GateDropdown gate={gate} id={id} />
      </div>
      <Handle id="top" type="target" position={Position.Top} />
      <Handle id="bottom" type="source" position={Position.Bottom} />
    </div>
  );
}
