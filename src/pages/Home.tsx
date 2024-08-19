import { useSelector } from "react-redux";
import { RootState } from "../common/store";
import TreeList from "../components/TreeList";

export default function Home() {
  let userData: any = {};
  userData = useSelector((state: RootState) => state.user.userData || {});
  // useEffect(() => {
  // }, []);

  return (
    <>
      <div className="home-container">
        <TreeList userData={userData} />
      </div>
    </>
  );
}
