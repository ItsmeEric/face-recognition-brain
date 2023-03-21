import React from "react";

const Navigation = ({ onRouteChange }) => {
  return (
    <nav style={{ display: "flex", justifyContent: "flex-end" }}>
      {/*Using tachyons to style our Sign Out paragraph*/}
      <p
        // Function to make the Sign Out button take us back to the Sign In
        onClick={() => onRouteChange("signin")}
        className="f3 link dim black underline pa3 pointer"
      >
        Sign Out
      </p>
    </nav>
  );
};

export default Navigation;
