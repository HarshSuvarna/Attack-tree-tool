import { createSlice, current, PayloadAction } from "@reduxjs/toolkit";
import { deleteSelectedEdge } from "../common/deleteEdges";

// interface CurrentTreeData {
//   _id: string;
//   users: Array<string>;
//   nodes: Array<string>;
//   edges: Array<any>;
//   ownerId: Array<any>;
//   name: string;
// }

export interface TreeState {
  currentTreeData: any;
}

const initialState: TreeState = {
  currentTreeData: {},
};

export const treeSlice = createSlice({
  name: "tree",
  initialState,
  reducers: {
    setCurrentTree: (state, action: PayloadAction<Record<string, any>>) => {
      state.currentTreeData = action.payload;
    },
    clearTree: (state) => {
      state.currentTreeData = null;
    },
    addNode: (state, action) => {
      state.currentTreeData.nodes = [
        ...(state?.currentTreeData?.nodes || []),
        action.payload.newNode,
      ];
      state.currentTreeData["logs"] = [
        ...(state.currentTreeData?.logs || []),
        {
          userId: action.payload.userId,
          action: "add-node",
          description: `${action.payload.newNode.type} node added`,
          timeStamp: Date.now(),
        },
      ];
    },
    addUsers: (state, action) => {
      const users = [
        ...(state.currentTreeData.users || []),
        ...(action.payload || []),
      ];
      state.currentTreeData.users = [...new Set(users)];
      state.currentTreeData["logs"] = [
        ...(state.currentTreeData?.logs || []),
        {
          userId: action.payload.userId,
          action: "add-user",
          description: `users ${[...new Set(users)]} added`,
          timeStamp: Date.now(),
        },
      ];
    },
    editNodeData: (state, action) => {
      let change = action.payload.change;
      (state.currentTreeData.nodes || []).map((n: any) => {
        if (n.id === change?.id && change.type === "replace") {
          n.data = change?.item?.data || n?.data || {};
        } else if (n.id === change?.id && change.type === "position") {
          n.position = change?.position || n?.position;
        }
        return n;
      });
    },
    addDocument: (state, action) => {
      const { nodeId, fileName, downloadUrl }: any = action.payload;
      (state.currentTreeData.nodes || []).map((n: any) => {
        if (n.id === nodeId) {
          n["documents"] = [
            ...(n?.documents || []),
            { nodeId, fileName, downloadUrl },
          ];
        }
        return n;
      });
    },
    editTreeName: (state, action) => {
      state.currentTreeData.name = action.payload;
    },
    addTreeEdge: (state, action) => {
      state.currentTreeData.edges = [
        ...state.currentTreeData.edges,
        action.payload,
      ];
      state.currentTreeData["logs"] = [
        ...(state.currentTreeData?.logs || []),
        {
          userId: action.payload.userId,
          action: "add-edge",
          description: `added edge ${action.payload.id}`,
          timeStamp: Date.now(),
        },
      ];
    },
    setNodeConnections: (state, action) => {
      const sourceNodeId = action.payload.sourceNodeId;
      const targetNodeId = action.payload.targetNodeId;
      state.currentTreeData.nodes = (state.currentTreeData.nodes || []).map(
        (node: any) => {
          if (node.id === sourceNodeId) {
            node.children = [...(node.children || []), targetNodeId];
          } else if (node.id === targetNodeId) {
            node.parentNodeId = sourceNodeId;
          }
          return node;
        }
      );
    },
    deleteEdge: (state, action) => {
      deleteSelectedEdge(state, action.payload);
      state.currentTreeData["logs"] = [
        ...(state.currentTreeData?.logs || []),
        {
          userId: action.payload.userId,
          action: "delete-edge",
          description: `deleted edge ${action.payload}`,
          timeStamp: Date.now(),
        },
      ];
    },
    deleteSelectedNode: (state, action) => {
      let node = current(state?.currentTreeData?.nodes || []).find(
        (n: any) => n.id === action.payload
      );
      node = { ...node };
      if (node.type === "topGate") {
        return;
      }
      let edgesToDelete = (node?.children || []).map(
        (cId: any) => `${node.id}-${cId}`
      );
      edgesToDelete.push(`${node.parentNodeId}-${node.id}`);

      for (const edgeId of edgesToDelete) {
        deleteSelectedEdge(state, edgeId);
      }
      let treeData = current(state.currentTreeData);
      let updatedNodes = (treeData?.nodes || []).filter(
        (n: any) => n?.id !== node?.id
      );
      state.currentTreeData.nodes = [...updatedNodes];
      state.currentTreeData["logs"] = [
        ...(state.currentTreeData?.logs || []),
        {
          userId: action.payload.userId,
          action: "delete-node",
          description: `deleted node ${action.payload}`,
          timeStamp: Date.now(),
        },
      ];
    },
    setAnimatedEdges: (state, action) => {
      state.currentTreeData.edges = action.payload;
      // console.log(
      //   "state.currentTreeData.edges :>> ",
      //   state.currentTreeData.edges
      // );
    },
  },
});
export const {
  setCurrentTree,
  clearTree,
  addNode,
  editNodeData,
  editTreeName,
  addTreeEdge,
  setNodeConnections,
  setAnimatedEdges,
  deleteEdge,
  deleteSelectedNode,
  addUsers,
  addDocument,
} = treeSlice.actions;
export default treeSlice.reducer;
