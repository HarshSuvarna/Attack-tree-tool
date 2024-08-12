interface Props {
  shouldShow: boolean;
  onRequestClose: () => void;
  children: any;
  nodeId?: string;
}

export const Modal = ({ shouldShow, onRequestClose, children }: Props) => {
  return shouldShow ? (
    <>
      <div className="modal-background" onClick={onRequestClose} />
      <div
        className="modal-box"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <button className="" onClick={onRequestClose}>
          X
        </button>
        {children}
      </div>
    </>
  ) : null;
};
