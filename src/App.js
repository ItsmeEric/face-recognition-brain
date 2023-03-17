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
    console.log(event);
  };

  render() {
    return (
      <div className="App">
        <ParticlesBg type="cobweb" num={150} bg={true} />
        <Navigation />
        <Logo />
        <Rank />
        {/* Give ImageLinkForm the input change event as props */}
        <ImageLinkForm onInputChange={this.onInputChange} />
        {/*<FaceRecognition />*/}
      </div>
    );
  }
}

export default App;
