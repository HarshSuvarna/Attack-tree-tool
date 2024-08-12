import { useState } from "react";
import { Node_Type_Enum } from "../enums/nodeTypes.enum";
import "../styles/sidebar.css";
import { Modal } from "./Modal";
import "../styles/modal.css";
import { debounce } from "lodash";
import { getSearchedUsers } from "../service/user.service";
import { useDispatch } from "react-redux";
import { addUsers, editTreeName } from "../slice/treeSlice";
export interface Props {
  name: string;
  toggleShowPath: () => void;
  showPath: boolean;
  toggleShowPossiblePath: () => void;
  showPossiblePath: boolean;
  setParameter: (param: string) => void;
  treeId: string;
  createTreeFromTemplate: () => void;
  isTemplate: boolean;
  isOwner: boolean;
  setTreeName: (name: string) => any;
}

export default ({
  name,
  setTreeName,
  toggleShowPath,
  showPath,
  toggleShowPossiblePath,
  showPossiblePath,
  setParameter,
  createTreeFromTemplate,
  isTemplate,
  isOwner,
}: Props) => {
  const [showModal, setshowModal] = useState<boolean>(false);
  const [usersList, setUsersList] = useState([]);
  const dispatch = useDispatch();

  const onDragStart = (event: any, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };
  const usersToAdd: string[] = [];
  const setOption = (e: any) => {
    setParameter(e.target.value);
  };
  const selectUser = (event: any, userId: string) => {
    event.target.checked
      ? usersToAdd.push(userId)
      : (usersToAdd || []).splice(
          usersToAdd.findIndex((u) => u === userId),
          1
        );
  };

  const addCollaborators = () => {
    dispatch(addUsers(usersToAdd));
    setshowModal(false);
  };

  const handleUserSearch = debounce(async (e: any) => {
    let searched = e.target.value;
    if (searched.length > 2) {
      const res: any = await getSearchedUsers(searched);
      setUsersList(res);
    }
  }, 2000);

  const updateTreeName = async (e: any) => {
    setTreeName(e.target.value);
    dispatch(editTreeName(e.target.value));
  };
  return (
    <div className="sidebar flex">
      <div className="description">
        You can drag these nodes to the pane on the right.
      </div>
      <div className="node-container">
        <div
          className="dndnode purple"
          onDragStart={(event) => onDragStart(event, Node_Type_Enum.TOP_GATE)}
          draggable
        >
          Top Gate
        </div>
        <div
          className="dndnode blue"
          onDragStart={(event) =>
            onDragStart(event, Node_Type_Enum.INTERMEDIATE)
          }
          draggable
        >
          Intermediate Node
        </div>
        <div
          className="dndnode red"
          onDragStart={(event) => onDragStart(event, Node_Type_Enum.EVENT)}
          draggable
        >
          Event Node
        </div>
      </div>
      <div>
        <input
          type="text"
          placeholder="Untitled tree"
          value={name}
          onChange={updateTreeName}
        />
        <input
          type="radio"
          id="cost"
          value="cost"
          name="parameter"
          onChange={setOption}
        />
        <label htmlFor="cost">Least cost</label>
        <input
          type="radio"
          id="probability"
          value="probability"
          name="parameter"
          onChange={setOption}
        />
        <label htmlFor="probability">Highest Probability</label>
        <input
          type="radio"
          id="frequency"
          value="frequency"
          name="parameter"
          onChange={setOption}
        />
        <label htmlFor="frequency">Higest Frequency</label>
        <input
          type="radio"
          id="skill"
          value="skill"
          name="parameter"
          onChange={setOption}
        />
        <label htmlFor="skill">Lowest Skill</label>

        <button
          style={{ background: showPossiblePath ? "#60f760a8" : "white" }}
          onClick={toggleShowPossiblePath}
          // disabled={!showPath}
        >
          Possible Paths
        </button>
        <button onClick={toggleShowPath}>
          {showPath ? "Back" : "Calculate"}
        </button>
        {isTemplate && (
          <button onClick={() => createTreeFromTemplate}>
            use this template
          </button>
        )}
        {isOwner && (
          <button onClick={() => setshowModal(true)}>Add People</button>
        )}
      </div>
      <Modal
        shouldShow={showModal}
        onRequestClose={() => {
          setshowModal((prev) => !prev);
        }}
      >
        <div className="user-search-container">
          <div className="search-bar">
            <input type="text" onChange={handleUserSearch} />
          </div>
          <div className="search-result-container">
            {usersList.map((u: any, i) => (
              <p key={i}>
                {u.firstName}&nbsp; {u.lastName} &nbsp;
                <span style={{ fontSize: "10px" }}>{u.email}</span>
                <input type="checkbox" onChange={(e) => selectUser(e, u._id)} />
              </p>
            ))}
          </div>
          <button onClick={addCollaborators}>Add users</button>
        </div>
      </Modal>
    </div>
  );
};
