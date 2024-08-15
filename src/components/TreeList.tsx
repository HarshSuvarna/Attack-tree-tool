import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTemplateTree } from "../common/createTemplateTree";
import { getAllTrees } from "../service/attacktree.service";

export default function TreeList({ userData }: Props) {
  const [trees, setTrees] = useState([]);
  const [templates, setTemplates] = useState([]);
  const navigate = useNavigate();
  const getUserTrees = async () => {
    const res: any = await getAllTrees(userData?._id);
    setTrees(res?.userTrees || []);
    setTemplates(res?.templates || []);
  };

  useEffect(() => {
    getUserTrees();
  }, []);

  const createNewTreeUsingTempalte = async (template: any) => {
    const res: any = await createTemplateTree(template, userData._id);
    navigate(`/design/${res?._id}`);
  };
  return (
    <div>
      {trees.map((t: any, i) => (
        <div onClick={() => navigate(`/design/${t._id}`)} key={i}>
          {t?.name || "Untitled Tree"}
        </div>
      ))}
      <p>Templates</p>
      <div>
        {templates.map((t: any, i: number) => (
          <div key={i} onClick={() => navigate(`/design/${t._id}`)}>
            {`Template:${t?.name}` || t?.name} Author:
            {t.ownerId || ""}
            <button
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
    </div>
  );
}

export interface Props {
  userData: any;
}
