import { current } from "@reduxjs/toolkit";

export const deleteSelectedEdge = (state: any, edgeId: string) => {
  const edgeIndex = (state.currentTreeData.edges || []).findIndex(
    (e: any) => e.id === edgeId
  );
  const edge = (state.currentTreeData.edges || []).find(
    (e: any) => e.id === edgeId
  );
  (state.currentTreeData.edges || []).splice(edgeIndex, 1);
  let sourceNodeId = edge?.source;
  let targetNodeId = edge?.target;

  let targetNode = (state.currentTreeData.nodes || []).find(
    (n: any) => n.id === targetNodeId
  );
  let sourceNode = (state.currentTreeData.nodes || []).find(
    (n: any) => n.id === sourceNodeId
  );
  targetNode = { ...targetNode };
  sourceNode = { ...sourceNode };
  targetNode["parentNodeId"] = null;
  let children = [...(sourceNode?.children || [])];
  children.splice(
    (sourceNode?.children || []).findIndex((i: string) => i === targetNode.id),
    1
  );
  sourceNode.children = [...children];
  state.currentTreeData.nodes = (state.currentTreeData.nodes || []).map(
    (n: any) => {
      if (n.id === sourceNode.id) {
        return sourceNode;
      } else if (n.id === targetNode.id) {
        return targetNode;
      }
      return n;
    }
  );
};
