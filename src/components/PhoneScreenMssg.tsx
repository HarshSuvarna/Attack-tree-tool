import { useEffect, useState } from "react";
import "../App.css";

function PhoneScreenMssg() {
  const [windowWidth, setwindowWidth] = useState(window.innerWidth);
  const show = windowWidth < 878;

  useEffect(() => {
    function handleResize() {
      setwindowWidth(window.innerWidth);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      style={{ visibility: show ? "visible" : "hidden" }}
      className="phone-screen-mssg"
    >
      <p>Please use Cybersafe on a bigger screen for best Experience.</p>
    </div>
  );
}

export default PhoneScreenMssg;
