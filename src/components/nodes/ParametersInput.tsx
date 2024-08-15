import { useReactFlow } from "@xyflow/react";
export interface Props {
  parameter: number;
  id: string;
  type: string;
}
export default function ParametersInput({ parameter, id, type }: Props) {
  const { setNodes } = useReactFlow();

  const updateParameter = (param: string) => {
    setNodes((nodes: any) =>
      nodes.map((node: any) =>
        node.id === id
          ? {
              ...node,
              data: {
                ...node.data,
                [type]: param,
              },
            }
          : node
      )
    );
  };

  return (
    
    <input
      className="param-input"
      type="number"
      value={parameter}
      onChange={(e) => updateParameter(e.target.value)}
    />
  );
}
