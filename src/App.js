import React, { Component } from "react";
import Navigation from "./components/Navigation/Navigation";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import Logo from "./components/Logo/Logo";
import Rank from "./components/Rank/Rank";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import SignIn from "./components/SignIn/SignIn";
import Register from "./components/Register/Register";
import "./App.css";
import ParticlesBg from "particles-bg";

//Credentials for Clarifai Access
const Clarifai = require("clarifai");

const PAT = "065c7652ac0a42f4930321614d877ae6";
const USER_ID = "itsmeeric";
const APP_ID = "my-first-application";
const MODEL_ID = "face-detection";

// Change these to whatever model and image URL you want to use
const MODEL_VERSION_ID = "6dc7e46bc9124c5c8824be4822abe105";

/*
const IMAGE_URL =
  "https://churchanswers.com/wp-content/uploads/2022/03/Blog-Article-Picture-6.png";
*/
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

// We don't need this anymore, because it's outdated
// const app = new Clarifai.App({
//   apiKey: "065c7652ac0a42f4930321614d877ae6",
// });

// Create Initial State for the new users
const InitialState = {
  input: "",
  imageUrl: "",
  box: {},
  route: "signin",
  isSignedIn: false,
  user: {
    id: "",
    name: "",
    email: "",
    entries: 0,
    joined: "",
  },
};

class App extends Component {
  // Create a state to recognize the user input
  constructor() {
    super();
    this.state = InitialState;
  }

  // Create function to update the state and load USER
  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined,
      },
    });
  };

  //Function to calculate the position of the face in an image
  calculateFaceLocation = (data) => {
    const clarifaiFace =
      data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById("inputImage");
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - clarifaiFace.right_col * width,
      bottomRow: height - clarifaiFace.bottom_row * height,
    };
  };

  displayFaceBox = (box) => {
    this.setState({ box: box });
  };

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  };

  onPictureSubmit = () => {
    this.setState({ imageUrl: this.state.input, loading: true });

    //Implementing the Right way to predict faces in images
    const raw = JSON.stringify({
      user_app_id: {
        user_id: USER_ID,
        app_id: APP_ID,
      },
      inputs: [
        {
          data: {
            image: {
              url: this.state.input, // This Image URL is from the input no need to use the declared one (IMAGE_URL)
            },
          },
        },
      ],
    });

    const requestOptions = {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: "Key " + PAT,
      },
      body: raw,
    };
    // Removed the MODEL_VERSION_ID for this case. Felt no need for it (+ "/versions/" + MODEL_VERSION_ID +)
    fetch(
      "https://api.clarifai.com/v2/models/" +
        MODEL_ID +
        "/versions/" +
        MODEL_VERSION_ID +
        "/outputs",
      requestOptions
    )
      .then((response) => response.json())
      .then((response) => {
        this.setState({ loading: false });
        if (response.outputs[0].data) {
          this.displayFaceBox(this.calculateFaceLocation(response));

          fetch("https://localhost:3000/image", {
            method: "put",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: this.state.user.id,
            }),
          })
            .then((response) => response.json())
            .then((count) => {
              this.setState(Object.assign(this.state.user, { entries: count }));
            })
            .catch(console.log);
        } else {
          window.alert("Not a valid Image URL.");
        }
      })
      .catch((error) => console.log("error", error));
  };

  /*
    Decided to change this whole code to the Updated one
    // We'll be using the new way of the Clarifai API face detection model (Found out that this one was OUTDATED too)
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
*/
  // Check the state we're currently in , in our page
  onRouteChange = (route) => {
    if (route === "signout") {
      this.setState(InitialState);
    } else if (route === "home") {
      this.setState({ isSignedIn: true });
    }
    this.setState({ route: route });
  };

  render() {
    // Destructuring the components props
    const { isSignedIn, imageUrl, route, box } = this.state;
    return (
      <div className="App">
        <ParticlesBg type="cobweb" num={150} bg={true} />
        <Navigation
          isSignedIn={isSignedIn}
          onRouteChange={this.onRouteChange}
        />
        {route === "home" ? (
          <div>
            <Logo />
            <Rank
              name={this.state.user.name}
              entries={this.state.user.entries}
            />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onPictureSubmit={this.onPictureSubmit}
            />
            <FaceRecognition box={box} imageUrl={imageUrl} />
          </div>
        ) : route === "signin" ? ( // For the register p tag
          <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        ) : (
          <Register
            loadUser={this.loadUser}
            onRouteChange={this.onRouteChange}
          />
        )}
      </div>
    );
  }
}

export default App;
