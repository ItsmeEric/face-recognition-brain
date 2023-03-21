import React from "react";

const Navigation = ({ onRouteChange }) => {
  return (
    <nav style={{ display: "flex", justifyContent: "flex-end" }}>
      {/*Using tachyons to style our Sign Out paragraph*/}
      <p
        onClick={onRouteChange}
        className="f3 link dim black underline pa3 pointer"
      >
        Sign Out
      </p>
    </nav>
  );
};

export default Navigation;
