import { useReactFlow } from "@xyflow/react";
import { notifyError } from "../customToast";
export interface Props {
  parameter: number;
  id: string;
  type: string;
}
export default function ParametersInput({ parameter, id, type }: Props) {
  const { setNodes } = useReactFlow();

  const updateParameter = (param: string) => {
    if (
      (type === "probability" &&
      (parseFloat(param) < 0.0 || parseFloat(param) > 1))
    ) {
      notifyError("Probability can take values between 0 and 1")
      return;
    }else if (parseFloat(param)< 0){
      notifyError("Please enter a valid value")
    }
    
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
