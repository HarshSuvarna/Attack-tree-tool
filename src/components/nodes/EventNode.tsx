import { Handle, NodeProps, Position, useReactFlow } from "@xyflow/react";
import { useDispatch } from "react-redux";
import { showModal } from "../../slice/modalSlice";
import { deleteSelectedNode } from "../../slice/treeSlice";
import ParametersInput from "./ParametersInput";
import ParametersText from "./ParametersText";

export default function EventNode({
  data: { description, probability, skill, frequency, cost, isPossible },
  id,
}: NodeProps<any>) {
  const { setNodes } = useReactFlow();
  const dispatch = useDispatch();
  const hangelCheckBoxChange = (e: any) => {
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
    <div className="container">
      <div style={{ background: "red" }} className="text-container flex">
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
        <button onClick={deleteNode}>X</button>
        <button onClick={() => dispatch(showModal(id))}>Expand</button>
      </div>
      <input
        type="checkbox"
        checked={isPossible}
        onChange={hangelCheckBoxChange}
      />
      <Handle id="top" type="target" position={Position.Top} />
    </div>
  );
}
