import { Component } from "react";
import Navigation from "./components/Navigation/Navigation";
import Logo from "./components/Logo/Logo";
import Rank from "./components/Rank/Rank";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
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
    };
  }

  // Create an event listener to activate when the input changes
  onInputChange = (event) => {
    console.log(event.target.value);
  };

  onButtonSubmit = () => {
    console.log("click");

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

  render() {
    return (
      <div className="App">
        <ParticlesBg type="cobweb" num={150} bg={true} />
        <Navigation />
        <Logo />
        <Rank />
        {/* Give ImageLinkForm the input change event as props */}
        <ImageLinkForm
          onInputChange={this.onInputChange}
          onButtonSubmit={this.onButtonSubmit}
        />
        {/*<FaceRecognition />*/}
      </div>
    );
  }
}

export default App;
