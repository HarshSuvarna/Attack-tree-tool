import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTemplateTree } from "../common/createTemplateTree";
import { createTree, getAllTrees } from "../service/attacktree.service";
import "../styles/home.css";
export default function TreeList({ userData }: Props) {
  const [trees, setTrees] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [sharedTrees, setSharedTrees] = useState([]);
  const navigate = useNavigate();

  const getUserTrees = async () => {
    const res: any = await getAllTrees(userData?._id);
    // console.log("res :>> ", res);
    const userTrees: any = [];
    const sharedTrees: any = [];
    (res?.userTrees || []).forEach((t: any) => {
      if (t?.ownerId === userData?._id) {
        userTrees.push(t);
      } else {
        sharedTrees.push(t);
      }
    });
    setTrees(userTrees || []);
    setSharedTrees(sharedTrees || []);
    setTemplates(res?.templates || []);
  };

  const createNewAttackTree = async () => {
    const userId = userData._id;
    const params = {
      users: [userId],
      nodes: [],
      edges: [],
      name: "New Attack Tree",
      ownerId: userId,
    };
    const res: any = await createTree(params);
    navigate(`/design/${res?._id}`);
  };
  useEffect(() => {
    getUserTrees();
  }, []);

  const createNewTreeUsingTempalte = async (template: any) => {
    const res: any = await createTemplateTree(template, userData._id);
    navigate(`/design/${res?._id}`);
  };
  return (
    <div className="tree-list-container">
      <div className="create-new-container">
        <button className="create-new-btn" onClick={createNewAttackTree}>
          Create new Attack Tree
        </button>
      </div>
      <p>My Trees</p>
      <div className="my-tree-container">
        {trees.map((t: any, i) => (
          <div
            className="my-tree"
            onClick={() => navigate(`/design/${t._id}`)}
            key={i}
          >
            {t?.name || "Untitled Tree"}
          </div>
        ))}
      </div>
      <p>Templates</p>
      <div className="my-tree-container">
        {templates.map((t: any, i: number) => (
          <div
            className="my-tree"
            key={i}
            onClick={() => navigate(`/design/${t._id}`)}
          >
            <div className="name-button">
              {`Template:${t?.name}` || t?.name}
              <p>Author:{t.ownerData[0].firstName}</p>
            </div>
            <button
              className="add-people"
              onClick={(e) => {
                e.stopPropagation();
                createNewTreeUsingTempalte(t);
              }}
            >
              Use this template
            </button>
          </div>
        ))}
      </div>
      <p>Shared with you</p>
      <div className="my-tree-container">
        {sharedTrees.map((t: any, i) => (
          <div
            className="my-tree"
            onClick={() => navigate(`/design/${t._id}`)}
            key={i}
          >
            {t?.name || "Untitled Tree"}
            <p>Author:{t.ownerData[0].firstName}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export interface Props {
  userData: any;
}
