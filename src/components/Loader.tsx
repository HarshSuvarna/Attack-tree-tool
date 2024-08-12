import "../styles/loader.css";
// import React from "react";
interface Props {
  dim?: string;
}

export const Loader = ({ dim }: Props) => {
  return (
    <span
      style={{ height: dim || "24px", width: dim || "24px" }}
      className="loader"
    />
  );
};

// export default Loader;
