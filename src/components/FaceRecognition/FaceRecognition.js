import React from "react";
import "./FaceRecognition.css";

const FaceRecognition = ({ imageUrl, box }) => {
  return (
    <div className="center ma">
      <div className="absolute mt2">
        <img
          id="inputImage"
          src={imageUrl}
          alt="Face to be recognized"
          width="500px"
          height="auto"
        />
        <div className="bounding-box"></div>
      </div>
    </div>
  );
};

export default FaceRecognition;
