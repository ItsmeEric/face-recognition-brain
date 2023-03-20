import React from "react";

const FaceRecognition = ({ imageUrl }) => {
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
      </div>
    </div>
  );
};

export default FaceRecognition;
