import axios from "axios";

export const createTree = (params: storeAttackTree) => {
  return axios.post("/tree/create", params);
};

export const createTreeFromTemplate = (params: storeAttackTree) => {
  return axios.post("/tree/create-tree-from-template", params);
};

export const updateTree = (id: string, params: updateTree) => {
  return axios.patch(`/tree/update-tree/${id}`, params);
};

export const getAttackTree = (params: getAttackTree) => {
  return axios.get(`/tree/get-tree-details/${params?.id}`);
};

export const getAllTrees = (userId: string) => {
  return axios.get(`/tree/get-all/${userId}`);
};

export const deleteTree = (treeId: string) => {
  return axios.delete(`/tree/${treeId}`);
};

export const deleteNode = (nodeId: string) => {
  return axios.delete(`/tree/delete-node/${nodeId}`);
};

export const getAnimatedEdges = (
  treeId: any,
  param: string,
  isPossible: boolean
) => {
  return axios.get(
    `/tree/show-path/${treeId}?field=${param}&isPossible=${isPossible}`
  );
};
export interface getAttackTree {
  id: string;
}

export interface storeAttackTree {
  users: Array<any>;
  nodes?: Array<any>;
  edges: Array<any>;
  name: string;
  nodeIds?: Array<string>;
}

export interface updateTree {
  nodes: Array<any>;
  edges?: Array<any>;
  name?: string;
  ownerId: string;
  users: Array<string>;
  _id: string;
}
