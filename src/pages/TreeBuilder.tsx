import { diff } from "deep-diff";
import { cloneDeep, set } from "lodash";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { RootState } from "../common/store";
import DesignView from "../components/DesignView";
import Sidebar from "../components/Sidebar";
import {
  deleteNode,
  getAttackTree,
  updateTree,
} from "../service/attacktree.service";
import { setCurrentTree } from "../slice/treeSlice";
import { createTemplateTree } from "../common/createTemplateTree";

export default function TreeBuilder() {
  const { treeId }: any = useParams();
  const [tree, setTree] = useState<any>(null);
  const [treeName, setTreeName] = useState<string>("");
  const [treeNodes, setTreeNodes] = useState<any>([]); // because nodes is a different collection in database
  const dispatch = useDispatch();
  const [updatedAt, setUpdatedAt] = useState<Date>();
  const [showPath, setShowPath] = useState<boolean>(false);
  const [showPossiblePath, setShowPossiblePath] = useState<boolean>(false);
  const [parameter, setParameter] = useState<string>("");
  const [isTemplate, setIsTemplate] = useState(false);
  let originalTreeDetailsFromStore: any;
  const navigate = useNavigate();
  const [isOwner, setIsOwner] = useState(false);

  // let treeDetails: any;
  const getSelectedAttackTree = async () => {
    try {
      const response: any = await getAttackTree({ id: treeId });
      response?.ownerId === userData._id && setIsOwner(true);

      // console.log("response :>> ", response);
      dispatch(setCurrentTree({ ...response }));
      originalTreeDetailsFromStore = cloneDeep({ ...response });
      setTreeNodes(cloneDeep(response?.nodes));
      setTree({ ...response });
      setTreeName(response.name);
      setUpdatedAt(new Date(response.updatedAt));
      if (response.type === "template") {
        setIsTemplate(true);
      }
      // tree && setTreeName(tree?.name || "");
    } catch (error) {
      console.log("couldn't fetch the required tree");
    }
  };
  let treeDetails = useSelector(
    (state: RootState) => state.tree.currentTreeData || {}
  );
  const treeDetailsRef = useRef(treeDetails);
  const treeNodesRef = useRef(treeNodes);
  const userData = useSelector((state: RootState) => state.user.userData || {});

  const originalTreeDetailsRef = useRef(originalTreeDetailsFromStore);
  const [originalTreeDetails, setOriginalTreeDetails] = useState(
    originalTreeDetailsFromStore
  );

  const updateTreeDetails = async () => {
    setTree((prev: any) => ({ ...prev, nodes: treeNodesRef.current }));
    const updatedTree = cloneDeep(treeDetailsRef.current);
    delete updatedTree?.createdAt;
    delete updatedTree?.updatedAt;
    updatedTree.ownerId = userData._id;
    updateTree(updatedTree._id, updatedTree);
  };

  const toggleShowPath = async () => {
    setShowPath(!showPath);
  };

  const toggleShowPossiblePath = async () => {
    setShowPossiblePath(!showPossiblePath);
  };
  useEffect(() => {
    treeNodesRef.current = treeNodes;
  }, [treeNodes]);
  useEffect(() => {
    treeDetailsRef.current = treeDetails;
  }, [treeDetails]);

  useEffect(() => {
    originalTreeDetailsRef.current = originalTreeDetails;
  }, [originalTreeDetails]);

  useEffect(() => {
    getSelectedAttackTree();
    let observeInterval: number;
    // if (originalTreeDetails) {
    observeInterval = setInterval(() => {
      setOriginalTreeDetails(treeDetailsRef.current);
      if (originalTreeDetailsRef.current) {
        const differences: any | undefined = diff(
          originalTreeDetailsRef.current,
          treeDetailsRef.current
        );
        // console.log("treeDetails :>> ", treeDetailsRef.current);
        // console.log("originalTreeDetails :>> ", originalTreeDetailsRef.current);
        console.log("differences :>> ", differences);
        if (differences && differences.length) {
          setOriginalTreeDetails(treeDetailsRef.current);
          dispatch(setCurrentTree(treeDetailsRef.current));
          let newTreeNode = cloneDeep(treeNodesRef.current);
          differences.forEach((diff: any) => {
            if (diff.kind === "A") {
              setTreeNodes((prev: any) => [...(prev || []), diff?.item?.rhs]);
              if (diff?.item?.kind === "D" && diff?.path?.[0] === "nodes") {
                deleteNode(diff?.item?.lhs?.id);
              }
            } else if (diff.kind === "N" || diff.kind === "E") {
              let path =
                diff.path.length > 1
                  ? diff.path.slice(1).join(".")
                  : diff.path[0];
              
              // console.log("newTreeNode :>> ", newTreeNode);
              set(newTreeNode, path, cloneDeep(diff.rhs));
              setTreeNodes(newTreeNode);
              // console.log("treeNodes 2:>> ", treeNodes);
            }
          });
          updateTreeDetails();
          setUpdatedAt(new Date());
        }
      }
    }, 5000);
    // }
    return () => {
      clearInterval(observeInterval);
      console.log("Interval cleared");
    };
  }, []);

  const createTreeFromTemplate = async () => {
    const res: any = await createTemplateTree(tree, userData._id);
    navigate(`/design/${res?._id}`);
  };
  return (
    <div className="design-view">
      {tree && (
        <>
          <Sidebar
            name={treeName}
            setTreeName={setTreeName}
            toggleShowPath={toggleShowPath}
            toggleShowPossiblePath={toggleShowPossiblePath}
            showPossiblePath={showPossiblePath}
            showPath={showPath}
            setParameter={setParameter}
            treeId={tree._id}
            createTreeFromTemplate={createTreeFromTemplate}
            isTemplate={isTemplate}
            isOwner={isOwner}
          />
          <DesignView
            initialNodes={tree?.nodes || []}
            initialEdges={tree?.edges || []}
            treeId={treeId}
            updatedAt={updatedAt}
            showPath={showPath}
            showPossiblePath={showPossiblePath}
            parameter={parameter}
          />
        </>
      )}
    </div>
  );
}
