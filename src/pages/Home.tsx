import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ApiLoader from "../components/ApiLoader";
import TreeList from "../components/TreeList";
import { createTree } from "../service/attacktree.service";
import { RootState } from "../common/store";
import Logout from "../auth/Logout";

export default function Home() {
  const navigate = useNavigate();
  let userData: any = {};
  userData = useSelector((state: RootState) => state.user.userData || {});
  // useEffect(() => {
  // }, []);
  const userId = userData?._id || "";

  const createNewAttackTree = async () => {
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

  return (
    <div>
      <ApiLoader />
      <Logout />
      <button onClick={createNewAttackTree}>Create an Attack Tree</button>
      <TreeList userData={userData} />
    </div>
  );
}
