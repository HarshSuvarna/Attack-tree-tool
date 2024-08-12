import { createTreeFromTemplate } from "../service/attacktree.service";

export const createTemplateTree = async (template: any, userId: string) => {
  const params = {
    users: [userId.toString()],
    nodeIds: [...(template?.nodeIds || [])],
    edges: [...(template.edges || [])],
    name: `New Attack Tree: ${template?.name || ""}`,
    ownerId: userId,
  };
  delete template?.type;
  return createTreeFromTemplate(params);
};
