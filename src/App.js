import "./App.css";
import Sharingan from "./sharingan.png";
import Madara from "./madara.png";
import Obito from "./obito.png";
import Sasuke from "./sasuke.png";
import * as PIXI from "pixi.js";
import { useRef, useEffect, useState } from "react";
let app;
let activeEyeRef;
let activeText;
let sceneImages = [Sharingan];

function App() {
  const canvasElement = useRef();
  const [images, setImages] = useState([Madara, Sasuke, Obito]);
  const [activeImage, setActvieImage] = useState(-1);
  const [activeEye, setActiveEye] = useState(null);
  const [editText, setEditText] = useState(false);
  const [text, setText] = useState("Hahahaha");
  const [size, setSize] = useState(36);

  const changeText = () => {
    activeText.text = text;
  };

  const changeSize = (e) => {
    setSize(e.target.value);
    activeText.style.fontSize = Number(e.target.value);
  };

  const onSelectImage = (i) => {
    setActvieImage(i);
  };

  const addElements = () => {
    let imgs = [...images];
    imgs.splice(activeImage, 1);
    setImages(imgs);
    app.loader.add(images[activeImage]).load((loader, resources) => {
      const newEye = new PIXI.Sprite(resources[images[activeImage]].texture);
      newEye.interactive = true;
      newEye.buttonMode = true;
      newEye.canRotate = true;
      newEye.on("pointerdown", () => {
        activeEyeRef = newEye;
        newEye.canRotate = !newEye.canRotate;
        app.ticker.update();
        setActiveEye({ ...newEye });
      });
      newEye.x = 200 + (sceneImages.length - 1) * 200;
      newEye.y = app.renderer.height / 2;

      newEye.width = 128;
      newEye.height = 128;
      newEye.anchor.x = 0.5;
      newEye.anchor.y = 0.5;
      app.stage.addChild(newEye);
      app.ticker.add(() => {
        if (newEye.canRotate) newEye.rotation += 0.01;
      });
    });
    sceneImages.length++;
    setActvieImage(-1);
  };

  const toggleShow = () => {
    activeEyeRef.visible = !activeEyeRef.visible;
    setActiveEye({ ...activeEye, visible: !activeEye.visible });
  };
  useEffect(() => {
    app = new PIXI.Application({ antialias: true });
    app.renderer.autoResize = true;
    app.renderer.resize(
      canvasElement.current.clientWidth,
      canvasElement.current.clientHeight
    );
    app.renderer.view.classList.add("view");
    canvasElement.current.appendChild(app.view);
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
    newText.interactive = true;
    newText.buttonMode = true;
    newText.on("pointerdown", () => {
      setEditText(true);
      activeText = newText;
    });
    newText.position.set(100, 50);
    app.stage.addChild(newText);
    app.loader.add(sceneImages).load((loader, resources) => {
      Object.keys(resources).map((obj, index) => {
        console.log(index);
        const eye = new PIXI.Sprite(resources[obj].texture);
        eye.interactive = true;
        eye.buttonMode = true;
        eye.canRotate = true;
        eye.on("pointerdown", () => {
          eye.canRotate = !eye.canRotate;
          app.ticker.update();
          setActiveEye({ ...eye });
          activeEyeRef = eye;
        });
        eye.x = 200 + index * 200;
        eye.y = app.renderer.height / 2;

        eye.width = 128;
        eye.height = 128;
        eye.anchor.x = 0.5;
        eye.anchor.y = 0.5;
        app.stage.addChild(eye);
        app.ticker.add(() => {
          if (eye.canRotate) eye.rotation += 0.01;
        });
      });
    });
  }, []);

  useEffect(() => {
    if (activeText) changeText();
  }, [text]);

  return (
    <div className="App">
      <h1>Pixi React App</h1>
      <div className="container">
        <div className="gallery">
          {images.map((image, index) => (
            <div
              className={
                activeImage === index ? "gallery-item active" : "gallery-item"
              }
              onClick={() => onSelectImage(index)}
              key={index}
            >
              <img style={{ width: "100%" }} src={image} alt="eye" />
            </div>
          ))}
        </div>
        {editText ? (
          <>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <input type="range" value={size} onChange={changeSize} min={1} />{" "}
          </>
        ) : null}
        {activeEye !== null ? (
          <button onClick={toggleShow}>
            {activeEye.visible ? "Hide" : "Show"}
          </button>
        ) : null}
        {activeImage !== -1 ? (
          <button className="add-image" onClick={addElements}>
            Add
          </button>
        ) : null}
      </div>
      <div ref={canvasElement} className="renderer"></div>
    </div>
  );
}

export default App;
