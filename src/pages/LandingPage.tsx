import { Background, ReactFlow } from "@xyflow/react";
import "../styles/landing.css";
import { nodeTypes } from "../workflow.constants";
import { nodes1, edges2, nodes2, node3 } from "../common/helper";

function LandingPage() {
  return (
    <div className="landing-parent">
      <div className="feature-container">
        <p className="feature-text">Visualise the Threat Landscape</p>
        <div className="react-flow-container">
          <ReactFlow
            nodes={nodes1}
            // edges={edges1}
            nodeTypes={nodeTypes}
            fitView
          >
            <Background color="black" />
          </ReactFlow>
        </div>
      </div>
      <div className="feature-container">
        <div className="react-flow-container">
          <ReactFlow
            nodes={nodes2}
            edges={edges2}
            nodeTypes={nodeTypes}
            fitView
          >
            <Background color="black" />
          </ReactFlow>
        </div>
        <p className="feature-text">Identify High-Risk Paths</p>
      </div>
      <div className="feature-container">
        <p className="feature-text">User-Friendly Interface</p>
        <div className="react-flow-container">
          <ReactFlow nodes={node3} edges={edges2} nodeTypes={nodeTypes} fitView>
            <Background color="black" />
          </ReactFlow>
        </div>
      </div>
      {/* <div className="feature-container">
        <div className="react-flow-container">
          <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} fitView>
            <Background color="black" />
          </ReactFlow>
        </div>
        <p className="feature-text">Visualise the Threat Landscape</p>
      </div> */}
    </div>
  );
}

export default LandingPage;
