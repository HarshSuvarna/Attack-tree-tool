import { useState } from "react";
import { Modal } from "./Modal";
import "../styles/uploadButton.css";
import { getSignedUrl } from "../service/storage.service";
import { useDispatch } from "react-redux";
import { addDocument } from "../slice/treeSlice";

interface Props {
  nodeId: string;
}
function ExpandButton({ nodeId }: Props) {
  const [showModal, setshowModal] = useState<boolean>(false);
  const [file, setFile] = useState();
  const [fileType, setFileType] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const dispatch = useDispatch();

  const handleFileChange = (event: any) => {
    let file = event.target.files[0];
    setFile(file);
    setFileName(file?.name);
    setFileType(file?.type);
  };

  const upload = async () => {
    try {
      dispatch(addDocument({ nodeId, fileName }));
      const preSigneddUrl: any = await getSignedUrl(nodeId, fileName);
      const result = await fetch(preSigneddUrl, {
        method: "PUT",
          headers: {
            "Content-Type": fileType || "application/octet-stream",
          },
          body: file,
        });
        console.log("result :>> ", result);
      } catch (error) {
        console.log("Something went wrong", error);
      }
    };
  return (
    <>
      <button onClick={() => setshowModal(true)}>expand</button>;
    </>
  );
}

export default ExpandButton;
