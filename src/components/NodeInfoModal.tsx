import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../common/store";
import { hideModal } from "../slice/modalSlice";
import { addDocument } from "../slice/treeSlice";
import { useEffect, useState } from "react";
import { getDownloadUrl, getSignedUrl } from "../service/storage.service";
import { toggleLoading } from "../slice/loaderSlice";

function NodeInfoModal() {
  const [file, setFile] = useState();
  const [fileName, setFileName] = useState<string>("");
  const [nodeId, setNodeId] = useState("");
  const [documents, setDocuments] = useState<any>([]);
  const [node, setNode] = useState<any>({});
  const [hasFile, setHasFile] = useState(false);
  let treeDetails = useSelector(
    (state: RootState) => state.tree.currentTreeData || {}
  );
  const handleFileChange = (event: any) => {
    let file = event.target.files[0];
    setHasFile(true);
    setFile(file);
    setFileName(file?.name);
  };
  useEffect(() => {
    if (nodeId && treeDetails) {
      let currentNode = (treeDetails?.nodes || []).filter(
        (n: any) => n.id === nodeId
      );
      setNode(currentNode[0]);
      console.log("currentNode :>> ", currentNode);
      setDocuments(currentNode[0]?.documents || []);
    }
  }, [nodeId]);
  const upload = async () => {
    try {
      setDocuments((prev: any) => [...(prev || []), { nodeId, fileName }]);
      const preSigneddUrl: any = await getSignedUrl(nodeId, fileName);
      await fetch(preSigneddUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/octet-stream",
        },
        body: file,
      });
      const downloadUrl: any = await getDownloadUrl(nodeId, fileName);
      dispatch(addDocument({ nodeId, fileName, downloadUrl: downloadUrl[0] }));
      setHasFile(false);
    } catch (error) {
      setHasFile(false);
      console.log("Something went wrong", error)
    } finally {
      dispatch(toggleLoading(false));
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
        className="node-modal-box"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="description-container">
          <p className="description-text">
            {node?.data?.description || "Add a description"}
          </p>
        </div>
        <div className="other-data-container">
          <div>
            <p className="title">Probability</p>
            <p className="value">{node?.data?.probability}</p>
          </div>
          <div>
            <p className="title">Cost</p>
            <p className="value">{node?.data?.cost}</p>
          </div>
          <div>
            <p className="title">Skill</p>
            <p className="value">{node?.data?.skill}</p>
          </div>
          <div>
            <p className="title">Frequency</p>
            <p className="value">{node?.data?.frequency}</p>
          </div>
        </div>
        <div className="upload-container">
          <button className="close-btn" onClick={onRequestClose}>
            X
          </button>
          <div className="input-upload">
            <input
              className="choose-file"
              type="file"
              onChange={handleFileChange}
              accept=".pdf"
            />
            <button
              disabled={!hasFile}
              className="upload-button"
              onClick={upload}
            >
              Upload
            </button>
          </div>
          <div className="document-list">
            {documents.length ? (
              (documents || []).map((d: any, i: number) => (
                <div key={i}>
                  <a
                    href={d?.downloadUrl || ""}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {d?.fileName || `file ${i}`}
                  </a>
                </div>
              ))
            ) : (
              <span style={{ fontSize: "12px", fontWeight: 300 }}>
                No Documents uploaded yet
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default NodeInfoModal;
