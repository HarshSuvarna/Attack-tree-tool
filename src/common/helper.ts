// import { useReactFlow } from "@xyflow/react";

// const { setNodes } = useReactFlow();

// export const updateDescription = (description: string, id: string) => {
//   setNodes((nodes: any) =>
//     nodes.map((node: any) =>
//       node.id === id
//         ? {
//             ...node,
//             data: {
//               ...node.data,
//               description,
//             },
//           }
//         : node
//     )
//   );
// };
export const nodes1 = [
  {
    id: "hidden-1",
    data: { label: "Node 1" },
    position: { x: 250, y: 5 },
    type: "topGate",
  },
  {
    id: "hidden-3",
    type: "intermediate",
    data: { label: "Node 3" },
    position: { x: 250, y: 150 },
  },
  {
    id: "hidden-4",
    type: "event",
    data: { label: "Node 4" },
    position: { x: 250, y: 280 },
  },
];

export const nodes2 = [
  {
    id: "hidden-1",
    data: { label: "Node 1", gate: "or" },
    position: { x: 250, y: 5 },
    type: "topGate",
  },
  {
    id: "hidden-2",
    data: { label: "Node 2", gate: "and" },
    type: "intermediate",
    position: { x: 100, y: 150 },
  },
  {
    id: "hidden-3",
    type: "intermediate",
    data: { label: "Node 3", gate: "or" },
    position: { x: 400, y: 150 },
  },
  {
    id: "hidden-4",
    type: "event",
    data: { label: "Node 4", gate: "or" },
    position: { x: 350, y: 280 },
  },
  {
    id: "hidden-4",
    type: "event",
    data: { label: "Node 4", gate: "or" },
    position: { x: 350, y: 280 },
  },
];

export const edges2 = [
  { id: "hidden-e1-2", source: "hidden-1", target: "hidden-2" },
  { id: "hidden-e1-3", source: "hidden-1", target: "hidden-3", animated: true },
  { id: "hidden-e3-4", source: "hidden-3", target: "hidden-4", animated: true },
];

export const node3 = [
  {
    id: "hidden-4",
    type: "event",
    data: { label: "Node 4", gate: "or" },
    position: { x: 350, y: 280 },
  },
];

export const attackTreeLink =
  "https://www.schneier.com/academic/archives/1999/12/attack_trees.html";
