import React, { Component } from "react";
import Navigation from "./components/Navigation/Navigation";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import Logo from "./components/Logo/Logo";
import Rank from "./components/Rank/Rank";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import SignIn from "./components/SignIn/SignIn";
import "./App.css";
import ParticlesBg from "particles-bg";

// This was the old way to add particles
// const particlesOptions = {
//   particles: {
//     number: {
//       value: 30,
//       density: {
//         enable: true,
//         value_area: 800,
//       },
//     },
//   },
// };

const Clarifai = require("clarifai");

const app = new Clarifai.App({
  apiKey: "065c7652ac0a42f4930321614d877ae6",
});

class App extends Component {
  // Create a state to recognize the user input
  constructor() {
    super();
    this.state = {
      input: "",
      imageUrl: "",
      box: {},
      route: "signin",
    };
  }

  //Function to calculate the position of the face in an image
  calculateFaceLocation = (data) => {
    const clarifaiFace =
      data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById("inputImage");
    const width = Number(image.width);
    const height = Number(image.height);
    // Return an object. The box which has the face measures
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - clarifaiFace.right_col * width,
      bottomRow: height - clarifaiFace.bottom_row * height,
    };
  };

  //Method to display face boundaries box
  displayFaceBox = (box) => {
    this.setState({ box: box });
  };

  // Create an event listener to activate when the input changes
  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  };

  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input });
    // console.log("click");

    // We'll be using the new way of the Clarifai API face detection model
    app.models.predict(
      {
        id: "face-detection", //If you want general concepts about image: 'general-image-recognition'
        name: "face-detection", //If you want general concepts about image: 'general-image-recognition'
        version: "065c7652ac0a42f4930321614d877ae6", //If you want general concepts about image: 'aa7f35c01e0642fda5cf400f543e7c40'
        type: "visual-detector",
      },
      this.state.input
    );
    app.models
      .predict("face-detection", this.state.input)
      .then((response) => {
        console.log("hi", response);
        if (response) {
          fetch("http://localhost:3000/image", {
            method: "put",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: this.state.user.id,
            }),
          })
            .then((response) => response.json())
            .then((count) => {
              this.setState(Object.assign(this.state.user, { entries: count }));
            });
        }
        this.displayFaceBox(this.calculateFaceLocation(response));
      })
      .catch((err) => console.log(err));
  };

  onRouteChange = () => {
    this.setState({ route: "home" });
  };

  render() {
    return (
      <div className="App">
        <ParticlesBg type="cobweb" num={150} bg={true} />
        <Navigation />
        {this.state.route === "signin" ? (
          <SignIn onRouteChange={this.onRouteChange} />
        ) : (
          <div>
            <Logo />
            <Rank />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
            />
            <FaceRecognition box={this.state.box} />
          </div>
        )}
      </div>
    );
  }
}

export default App;
