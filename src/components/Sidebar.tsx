import { debounce } from "lodash";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../common/store";
import { Node_Type_Enum } from "../enums/nodeTypes.enum";
import { getSearchedUsers } from "../service/user.service";
import { addUsers, editTreeName } from "../slice/treeSlice";
import "../styles/modal.css";
import "../styles/sidebar.css";
import { Modal } from "./Modal";

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
  parameter: string;
}

export default ({
  name,
  setTreeName,
  toggleShowPath,
  showPath,
  toggleShowPossiblePath,
  setParameter,
  showPossiblePath,
  createTreeFromTemplate,
  isTemplate,
  isOwner,
}: Props) => {
  const [showModal, setshowModal] = useState<boolean>(false);
  const [usersList, setUsersList] = useState([]);
  const dispatch = useDispatch();
  const [option, setSelectOption] = useState("");
  const [selected, setSelected] = useState(false);
  let treeDetails = useSelector(
    (state: RootState) => state.tree.currentTreeData || {}
  );
  let numberOfUsers: number = treeDetails?.userDetails?.length || 0;
  let firstUser: any;
  firstUser = treeDetails?.userDetails[0] || undefined;

  const [userListToShow, setUserListToShow] = useState(
    treeDetails?.userDetails || []
  );
  const onDragStart = (event: any, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  let usersToAdd: string[] = [];
  const setOption = (e: any) => {
    const option = e.target.value;
    setSelectOption(option);
    if (option === "default") {
      return;
    }
    setSelected(option === "" ? false : true);
    setParameter(e.target.value);
  };
  const selectUser = (event: any, userId: string) => {
    if (event.target.value.length === 0) {
      setUsersList([]);
      return;
    }
    event.target.checked
      ? usersToAdd.push(userId)
      : (usersToAdd || []).splice(
          usersToAdd.findIndex((u) => u === userId),
          1
        );
  };

  const addCollaborators = (e: any) => {
    e.stopPropagation();
    dispatch(addUsers(usersToAdd));
    setUsersList([]);
    // setshowModal(false);
    const userDetails = usersList.filter((u: any) =>
      usersToAdd.includes(u._id)
    );
    setUserListToShow((prev: any) => [...prev, ...userDetails]);
  };

  const handleUserSearch = debounce(async (e: any) => {
    let searched = e.target.value;
    if (searched.length > 2) {
      const res: any = await getSearchedUsers(searched);
      setUsersList(res);
    } else {
      setUsersList([]);
    }
  }, 2000);

  const updateTreeName = async (e: any) => {
    setTreeName(e.target.value);
    dispatch(editTreeName(e.target.value));
  };
  return (
    <div className="sidebar flex">
      <input
        type="text"
        className="tree-title-input"
        placeholder="Untitled tree"
        value={name}
        onChange={updateTreeName}
      />
      <div className="node-container">
        <div className="description">
          You can drag these nodes to the pane on the right.
        </div>
        <div
          className="dndnode red"
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
          Intermediate
        </div>
        <div
          className="dndnode green"
          onDragStart={(event) => onDragStart(event, Node_Type_Enum.EVENT)}
          draggable
        >
          Event
        </div>
      </div>
      <div className="possible-select">
        <p className="guide-text">Select Path to Analyze with possibility</p>
        <div className="select-param-container">
          <select
            style={{
              background: selected ? "#e7e7e7" : "transparent",
              color: selected ? "#1e1e1e" : "#e7e7e7",
            }}
            className="select-path"
            defaultValue={""}
            value={option}
            onChange={setOption}
            disabled={showPath}
          >
            {/* <option disabled selected value="">
            Select Path to Analyze
            </option> */}
            <option value="">All Paths</option>
            <option value="cost">Lowest Cost</option>
            <option value="probability">Highest Probability</option>
            <option value="frequency">Highest Frequency</option>
            <option value="skill">Lowest Skill</option>
          </select>
          <button
            style={{
              background: showPossiblePath ? "#e7e7e7" : "transparent",
              color: showPossiblePath ? "#1e1e1e" : "#e7e7e7",
            }}
            onClick={() => {
              toggleShowPossiblePath();
            }}
            disabled={showPath}
            className="possible-path-btn"
          >
            Possible Paths
          </button>
        </div>
      </div>

      <div className="calculate-clear-btn-container">
        <button
          disabled={option === "" && !showPossiblePath}
          onClick={() => {
            // if (!showPath && possiblePathClicked) {
            //   toggleShowPossiblePath();
            // }
            toggleShowPath();
          }}
          className="calculate-btn"
        >
          {showPath ? "Back" : "Calculate"}
        </button>
      </div>

      {isTemplate && (
        <button className="add-people" onClick={() => createTreeFromTemplate}>
          use this template
        </button>
      )}
      <div className="user-data">
        {isOwner && !isTemplate && (
          <>
            {firstUser && (
              <div className="user-text">
                {firstUser?.firstName} {firstUser.lastName}{" "}
                {numberOfUsers > 1 && <p> + {numberOfUsers - 1} more</p>}
              </div>
            )}
            <button className="add-people" onClick={() => setshowModal(true)}>
              View Users
            </button>
          </>
        )}
      </div>
      <Modal
        shouldShow={showModal}
        onRequestClose={() => {
          setUsersList([]);
          setshowModal((prev) => !prev);
        }}
      >
        <div className="user-search-container">
          <p style={{ fontSize: "21px" }}>Add collabortors to {name}</p>
          <input
            className="search-user-input"
            type="text"
            placeholder="Search by first name, last name, or email"
            onChange={handleUserSearch}
          />
          {usersList.length > 0 && (
            <div className="search-result-container">
              {usersList.map((u: any, i) => (
                <p className="user-info" key={i}>
                  <p className="name-email">
                    {u.firstName}&nbsp; {u.lastName} &nbsp;
                    <span style={{ fontSize: "14px" }}>{u.email}</span>
                  </p>
                  <input
                    type="checkbox"
                    onChange={(e) => selectUser(e, u._id)}
                  />
                </p>
              ))}
            </div>
          )}
          <button className="add-collabortor-button" onClick={addCollaborators}>
            Add users
          </button>
          <p style={{ fontWeight: 700, textAlign: "start" }}>Collaborators</p>
          {treeDetails?.userDetails?.length > 0 && (
            <div className="search-result-container">
              {(userListToShow || []).map((u: any, i: number) => (
                <p className="user-info" key={i}>
                  <p className="name-email">
                    {u.firstName}&nbsp; {u.lastName} &nbsp;
                    <span style={{ fontSize: "14px" }}>{u.email}</span>
                  </p>
                </p>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};
