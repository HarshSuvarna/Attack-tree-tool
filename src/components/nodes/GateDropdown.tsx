import { useReactFlow } from "@xyflow/react";
import { GateEnum } from "../../enums/gate.enum";

export interface Props {
  gate: string;
  id: string;
}

export default function GateDropdown({ gate, id }: Props) {
  const { setNodes } = useReactFlow();

  const updateGate = (gate: string) => {
    setNodes((nodes: any) =>
      nodes.map((node: any) =>
        node.id === id
          ? {
              ...node,
              data: {
                ...node.data,
                gate,
              },
            }
          : node
      )
    );
  };
  return (
    <select
      value={gate} // should be set to initail value of gate during first render
      className="nodrag"
      onChange={(e) => updateGate(e?.target?.value || GateEnum.OR)}
    >
      <option key={GateEnum.AND} value={GateEnum.AND}>
        AND
      </option>
      <option key={GateEnum.OR} value={GateEnum.OR}>
        OR
      </option>
    </select>
  );
}
