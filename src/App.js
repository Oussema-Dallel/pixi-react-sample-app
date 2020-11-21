import "./App.css";
import Sharingan from "./sharingan.png";
import Madara from "./madara.png";
import Obito from "./obito.png";
import Sasuke from "./sasuke.png";
import * as PIXI from "pixi.js";
import { useRef, useEffect, useState } from "react";

function App() {
  const canvasElement = useRef();
  const [images, setImages] = useState([Sharingan, Madara, Sasuke]);
  const [activeEye, setActiveEye] = useState(null);
  const [text, setText] = useState("Hahahaha");

  const createApplication = () => {
    const app = new PIXI.Application({ antialias: true });
    app.renderer.autoResize = true;
    app.renderer.resize(
      canvasElement.current.clientWidth,
      canvasElement.current.clientHeight
    );
    app.renderer.view.classList.add("view");
    canvasElement.current.appendChild(app.view);
    app.loader.add(images).load((loader, resources) => {
      console.log(resources);
      // This creates a texture from a 'bunny.png' image

      let array = [];
      Object.keys(resources).map((obj, index) => {
        console.log(index);
        const eye = new PIXI.Sprite(resources[obj].texture);
        eye.interactive = true;
        eye.buttonMode = true;
        eye.on("pointerdown", () => {
          setActiveEye(eye);
          eye.rotation = 0;
          app.ticker.update();
        });
        eye.x = 200 + index * 200;
        eye.y = app.renderer.height / 2;

        eye.width = 128;
        eye.height = 128;
        // Rotate around the center
        eye.anchor.x = 0.5;
        eye.anchor.y = 0.5;
        app.stage.addChild(eye);
        array.push(eye);
        app.ticker.add(() => {
          // each frame we spin the eye around a bit
          eye.rotation += 0.01;
        });
      });
      // Setup the position of the bunny
      console.log(app.ticker);
      // Add the eye to the scene we are building
      const newText = new PIXI.Text(text, {
        fontFamily: "Arial",
        fontSize: 36,
        fontStyle: "italic",
        fontWeight: "bold",
        fill: ["#ffffff", "#00ff99"], // gradient
        stroke: "#4a1850",
        strokeThickness: 5,
        dropShadow: true,
        dropShadowColor: "#000000",
        dropShadowBlur: 4,
        dropShadowAngle: Math.PI / 6,
        dropShadowDistance: 6,
        wordWrap: true,
        wordWrapWidth: 440,
        lineJoin: "round",
      });
      newText.position.set(100, 50);
      app.stage.addChild(newText);

      // Listen for frame updates
    });
  };

  const addElements = () => {
    let imgs = [...images];
    imgs.push(Obito);
    setImages(imgs);
  };

  const stopRotation = () => {
    let eye = activeEye;
    eye.visible = !eye.visible;
  };

  useEffect(() => {
    createApplication();
  }, [images, text]);

  return (
    <div className="App">
      <h1>Pixi React App</h1>
      <input type="text" onChange={(e) => setText(e.target.value)} />
      <button onClick={stopRotation}>Stop</button>
      <button onClick={addElements}>Add</button>
      <div key={[images, text]} ref={canvasElement} className="renderer"></div>
    </div>
  );
}

export default App;
