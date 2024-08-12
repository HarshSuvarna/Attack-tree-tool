import { Handle, NodeProps, Position } from "@xyflow/react";
import "../../styles/top-gate-node.css";
import ParametersText from "./ParametersText";
import GateDropdown from "./GateDropdown";

export default function TopGateNode({
  data: { gate, description },
  id,
}: NodeProps<any>) {
  // const upateGate
  return (
    <div className="container">
      <div className="text-container flex">
        <ParametersText description={description} id={id} />
      </div>
      {/* <div className="floating">adfaff</div> */}

      <div className="gate-container flex">
        <GateDropdown gate={gate} id={id} />
      </div>
      <Handle id="bottom" type="source" position={Position.Bottom} />
    </div>
  );
}
