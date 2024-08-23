import {
  Background,
  Connection,
  Controls,
  Panel,
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { GateEnum } from "../enums/gate.enum";
import { Node_Type_Enum } from "../enums/nodeTypes.enum";
import { getAnimatedEdges } from "../service/attacktree.service";
import {
  addNode,
  addTreeEdge,
  editNodeData,
  setNodeConnections,
} from "../slice/treeSlice";
import { nodeTypes } from "../workflow.constants";
import ButtonEdge from "./edges/buttonEdge";
import { RootState } from "../common/store";
import { toggleLoading } from "../slice/loaderSlice";

// import useCursorStateSynced from "../collaboration/useCursorStateSynced";
// import useEdgesStateSynced from "../collaboration/useEdgeStateSynced";
// import useNodesStateSynced from "../collaboration/useNodeStateSynced";

export interface Props {
  initialNodes: Array<any>;
  initialEdges: Array<any>;
  treeId: string;
  updatedAt: Date | undefined;
  showPath: boolean;
  showPossiblePath: boolean;
  parameter: string;
  updating: boolean;
  isTemplate: boolean;
}

const DesignView = ({
  initialNodes,
  initialEdges,
  treeId,
  updatedAt,
  showPath,
  showPossiblePath,
  parameter,
  updating,
  isTemplate,
}: Props) => {
  const [nodes, setNodes] = useNodesState(initialNodes);
  const [edges, setEdges] = useEdgesState(initialEdges);
  // const [possiblePath, setPossiblePath] = useState<any>();
  // const [allPath, setAllPath] = useState<any>(initialEdges);
  const [backupEdges, setbackupedges] = useState(initialEdges);
  const userData = useSelector((state: RootState) => state.user.userData || {});

  const dispatch = useDispatch();

  // const [cursors, onMouseMove] = useCursorStateSynced();

  const { screenToFlowPosition } = useReactFlow();

  // const proOptions = {
  //   account: "paid-pro",
  //   hideAttribution: true,
  // };
  // useEffect(() => {
  //   console.log("updating :>> ", updating);
  // }, [updating]);
  const showAnimatedEdges = async () => {
    try {
      // if (parameter === "" && showPossiblePath) {
      //   parameter = "possible ";
      // }
      const result: any = await getAnimatedEdges(
        treeId,
        parameter,
        showPossiblePath
      );
      // setPossiblePath(result.possibleAnimatedEdges);
      // setAllPath(result.animatedEdges);
      setEdges(
        showPossiblePath ? result.possibleAnimatedEdges : result.animatedEdges
      );
    } catch (error) {
    } finally {
      dispatch(toggleLoading(false));
    }
  };

  // useEffect(() => {
  //   console.log("showPath :>> ", showPath);
  // }, [showPath]);

  useEffect(() => {
    if (showPath) {
      showAnimatedEdges();
    } else {
      setEdges(backupEdges);
    }
  }, [showPath]);

  // useEffect(() => {
  //   if (showPossiblePath) {
  //     setEdges(possiblePath);
  //   } else {
  //     setEdges(allPath);
  //   }
  // }, [showPossiblePath]);

  const onConnect = useCallback((connection: Connection) => {
    const edge = {
      ...connection,
      id: `${connection?.source}-${connection?.target}`,
      animated: false,
      style: { stroke: "white" },
      type: "buttonEdge",
    };
    setEdges((prevEdge) => addEdge(edge, prevEdge || []));
    setbackupedges((prev) => [...prev, edge]);
    dispatch(addTreeEdge(edge));
    dispatch(
      setNodeConnections({
        sourceNodeId: connection?.source,
        targetNodeId: connection?.target,
      })
    );
  }, []);

  const onNodesChange = (changes: any) => {
    dispatch(
      editNodeData({
        change: changes[0],
      })
    );

    setNodes((nds) => applyNodeChanges(changes, nds));
  };
  const onEdgesChange = (changes: any) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  };

  const onDragOver = useCallback((event: any) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: any) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow");

      // check if the dropped element is valid
      if (typeof type === "undefined" || !type) {
        return;
      } else if (
        type === Node_Type_Enum.TOP_GATE &&
        (nodes || []).findIndex(
          (n: any) => n.type === Node_Type_Enum.TOP_GATE
        ) > -1
      ) {
        return;
      }
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      // const measured = {};
      // type === Node_Type_Enum.TOP_GATE || type === Node_Type_Enum.INTERMEDIATE
      //   ? { width: 126, height: 111 }
      //   : type === Node_Type_Enum.EVENT
      //   ? { width: 1000, height: 161 }
      //   : {};
      const newNode = {
        id: uuidv4(),
        type,
        position,
        // measured,
        data: { gate: GateEnum.OR },
        treeId,
      };
      dispatch(addNode({ newNode, userId: userData._id }));
      setNodes([...nodes, newNode]);
    },
    [nodes]
  );

  // const onNodeClick: NodeMouseHandler = useCallback(
  //   (_, clicked) => {
  //     setNodes((prev) =>
  //       prev.map((node) =>
  //         node.id === clicked.id ? { ...node, className: "blink" } : node
  //       )
  //     );

  //     window.setTimeout(() => {
  //       setNodes((prev) =>
  //         prev.map((node) =>
  //           node.id === clicked.id ? { ...node, className: undefined } : node
  //         )
  //       );
  //     }, 3000);
  //   },
  //   [setNodes]
  // );
  const edgeTypes = {
    buttonEdge: ButtonEdge,
  };
  return (
    <div className="diagram-box flex">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        // onNodeClick={onNodeClick}
        onDrop={onDrop}
        onDragOver={onDragOver}
        fitView
        edgesFocusable={!isTemplate && !showPath}
        nodesDraggable={!isTemplate && !showPath}
        nodesConnectable={!isTemplate && !showPath}
        nodesFocusable={!isTemplate && !showPath}
        // draggable={!isTemplate}
        panOnDrag={!isTemplate && !showPath}
        elementsSelectable={!isTemplate && !showPath}
        // proOptions={proOptions}
      >
        <Background color="gray" />
        <Controls showInteractive={true} />

        <Panel position="top-right">
          <p
            className="update-text-loader"
            style={{
              fontSize: "10px",
              color: "white",
            }}
          >
            <span
              style={{ visibility: updating ? "visible" : "hidden" }}
              className="update-loader"
            />
            Last updated: {updatedAt?.toString() || ""}
          </p>
        </Panel>
      </ReactFlow>
    </div>
  );
};

export default ({
  initialNodes,
  initialEdges,
  treeId,
  updatedAt,
  showPath,
  showPossiblePath,
  parameter,
  updating,
  isTemplate,
}: Props) => (
  <ReactFlowProvider>
    <DesignView
      initialNodes={initialNodes}
      initialEdges={initialEdges}
      treeId={treeId}
      updatedAt={updatedAt}
      showPath={showPath}
      showPossiblePath={showPossiblePath}
      parameter={parameter}
      updating={updating}
      isTemplate={isTemplate}
    />
  </ReactFlowProvider>
);
