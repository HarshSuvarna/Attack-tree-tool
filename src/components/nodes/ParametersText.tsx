import { useReactFlow } from "@xyflow/react";
import "../../styles/parameters-components.css";
export interface Props {
  description: string;
  updatedesc?: (desc: string) => void;
  id: string;
}

export default function ParametersText({ description, id }: Props) {
  const { setNodes } = useReactFlow();

  const updateDescription = (description: string) => {
    setNodes((nodes: any) =>
      nodes.map((node: any) =>
        node.id === id
          ? {
              ...node,
              data: {
                ...node.data,
                description,
              },
            }
          : node
      )
    );
  };
  return (
    <textarea
      // className="nodrag"
      placeholder="Description"
      onChange={(e) => updateDescription(e.target.value)}
      value={description || ""}
      maxLength={38}
    />
  );
}
