import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../common/store";
import { hideModal } from "../slice/modalSlice";
import { addDocument } from "../slice/treeSlice";
import { useEffect, useState } from "react";
import { getDownloadUrl, getSignedUrl } from "../service/storage.service";

function NodeInfoModal() {
  const [file, setFile] = useState();
  // const [fileType, setFileType] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [nodeId, setNodeId] = useState("");
  const [documents, setDocuments] = useState<any>([]);

  let treeDetails = useSelector(
    (state: RootState) => state.tree.currentTreeData || {}
  );
  const handleFileChange = (event: any) => {
    let file = event.target.files[0];
    setFile(file);
    setFileName(file?.name);
    // setFileType(file?.type);
  };
  useEffect(() => {
    if (nodeId && treeDetails) {
      let currentNode = (treeDetails?.nodes || []).filter(
        (n: any) => n.id === nodeId
      );
      setDocuments(currentNode[0]?.documents || []);
    }
  }, [nodeId]);

  const upload = async () => {
    try {
      setDocuments((prev: any) => [...(prev || []), { nodeId, fileName }]);
      const preSigneddUrl: any = await getSignedUrl(nodeId, fileName);
      const result = await fetch(preSigneddUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/octet-stream",
        },
        body: file,
      });
      const downloadUrl: any = await getDownloadUrl(nodeId, fileName);
      dispatch(addDocument({ nodeId, fileName, downloadUrl: downloadUrl[0] }));
      console.log("result :>> ", result);
    } catch (error) {
      console.log("Something went wrong", error);
    }
  };
  const onRequestClose = () => dispatch(hideModal());
  const dispatch = useDispatch();
  const { modalData } = useSelector((state: RootState) => state.modal);
  useEffect(() => {
    setNodeId(modalData?.nodeId);
  }, []);
  return (
    <>
      <div className="modal-background" onClick={onRequestClose}></div>
      <div
        className="modal-box"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="upload-container">
          <button onClick={onRequestClose}>Close Modal</button>
          <input type="file" onChange={handleFileChange} accept=".pdf" />
          <button onClick={upload}>Upload</button>
          {(documents || []).map((d: any, i: number) => (
            <div key={i}>
              <a href={d?.downloadUrl || ""} target="_blank" rel="noreferrer">
                {d?.fileName || `file ${i}`}
              </a>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default NodeInfoModal;
