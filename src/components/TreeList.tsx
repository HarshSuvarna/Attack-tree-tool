import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTemplateTree } from "../common/createTemplateTree";
import {
  createTree,
  deleteTree,
  getAllTrees,
} from "../service/attacktree.service";
import "../styles/home.css";
import { useDispatch } from "react-redux";
import { toggleLoading } from "../slice/loaderSlice";
import { notifyError, notifySuccess } from "./customToast";
export default function TreeList({ userData }: Props) {
  const [trees, setTrees] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [sharedTrees, setSharedTrees] = useState([]);
  const [hoverTreeIndex, setHoverTreeIndex] = useState<number | null>(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const getUserTrees = async () => {
    try {
      dispatch(toggleLoading(true));
      const res: any = await getAllTrees(userData?._id);
      const userTrees: any = [];
      const sharedTrees: any = [];
      (res?.userTrees || []).forEach((t: any) => {
        if (t?.ownerId === userData?._id) {
          userTrees.push(t);
        } else {
          sharedTrees.push(t);
        }
      });
      dispatch(toggleLoading(false));
      setTrees(userTrees || []);
      setSharedTrees(sharedTrees || []);
      setTemplates(res?.templates || []);
    } catch (error) {
      dispatch(toggleLoading(false));
    } finally {
      dispatch(toggleLoading(false));
    }
  };

  const createNewAttackTree = async () => {
    try {
      const userId = userData._id;
      const params = {
        users: [userId],
        nodes: [],
        edges: [],
        name: "New Attack Tree",
        ownerId: userId,
      };
      dispatch(toggleLoading(true));
      const res: any = await createTree(params);
      notifySuccess("New Attack Tree Created!");
      navigate(`/design/${res?._id}`);
      dispatch(toggleLoading(false));
    } catch (error) {
      dispatch(toggleLoading(false));
    } finally {
      dispatch(toggleLoading(false));
    }
  };
  useEffect(() => {
    getUserTrees();
  }, []);

  const handleDeleteClick = async (tree: any) => {
    try {
      console.log("herei");
      const newTrees = trees.filter((t: any) => t._id !== tree._id);
      setTrees([...newTrees]);
      await deleteTree(tree._id);
      notifySuccess(`Tree ${tree.name} deleted`);
    } catch (error) {
      notifyError("Cannot delete tree");
    }
  };

  const createNewTreeUsingTempalte = async (template: any) => {
    try {
      dispatch(toggleLoading(true));

      const res: any = await createTemplateTree(template, userData._id);
      notifySuccess("New Attack Tree Created using template");

      navigate(`/design/${res?._id}`);
      dispatch(toggleLoading(false));
    } catch (error) {
    } finally {
      dispatch(toggleLoading(false));
    }
  };
  return (
    <div className="tree-list-container">
      <div className="create-new-container">
        <button className="create-new-btn" onClick={createNewAttackTree}>
          <i className="fa-solid fa-plus"></i>
          Create new Attack Tree
        </button>
      </div>
      <p>My Trees</p>
      <div className="my-tree-container">
        {trees.length < 1 && (
          <div className="no-tree-text">
            Click on Create new Attack Tree and get started!
          </div>
        )}
        {trees.map((t: any, i) => (
          <div
            key={i}
            onMouseEnter={() => setHoverTreeIndex(i)}
            onMouseLeave={() => setHoverTreeIndex(null)}
            className="my-tree 1"
            onClick={() => navigate(`/design/${t._id}`)}
          >
            {t?.name || "Untitled Tree"}
            {t.users.length - 1 > 0 && (
              <p>Shared with {t.users.length - 1} others</p>
            )}
            <div
              style={{
                visibility: hoverTreeIndex === i ? "visible" : "hidden",
              }}
              onClick={(e: any) => {
                e.stopPropagation();
                handleDeleteClick(t);
              }}
              className="delete-icon"
            >
              <i className="fa-solid fa-x"></i>
            </div>
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
              <p>Author:{t?.ownerData[0]?.firstName}</p>
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
        {sharedTrees.length < 1 && (
          <div className="no-tree-text">No Trees shared with you yet...</div>
        )}
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
