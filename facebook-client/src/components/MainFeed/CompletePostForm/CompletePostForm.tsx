import React, { useContext, useState } from "react";
import Classes from "./CompletePostForm.module.css";
import ReactDom from "react-dom";

import { Button } from "@material-ui/core";
import CancelIcon from "@material-ui/icons/Cancel";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import PanoramaIcon from "@material-ui/icons/Panorama";
import DuoIcon from "@material-ui/icons/Duo";
import EmojiEmotionsOutlinedIcon from "@material-ui/icons/EmojiEmotionsOutlined";
import styled from "styled-components";
import { authContext } from "../../../store/context";

const InputFile = styled.input`
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;
`;

const InputFileLabel = styled.label.attrs(({ color }) => ({
  color: color,
}))`
  font-size: 1.4rem;
  font-weight: 700;
  color: white;
  background-color: ${(props) => props.color};
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  padding: 6px 14px;
  width: 70px;
  border-radius: 6px;
  opacity: 0.85;
  transition: all 0.2s ease;

  &:hover {
    opacity: 1;
    transform: scale(1.045);
  }
`;

const CompletePostForm = (props: any) => {
  const authState = useContext(authContext);
  const [currentHover, setCurrentHover] = useState("");

  const [textPost, setTextPost] = useState("");
  const [previusFile, setPreviusFile] = useState("");
  const [previusVideoFile, setPreviusVideoFile] = useState("");

  const handleFileInputChange = React.useCallback((e) => {
    const file = e.target.files[0];
    previerFile(file);
  }, []);

  const previerFile = React.useCallback((file: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      //@ts-ignore
      setPreviusFile(reader.result);
    };
  }, []);

  const handleVideoInputChange = React.useCallback((e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      //@ts-ignore
      setPreviusVideoFile(reader.result);
    };
  }, []);

  const submitPostHanlder = React.useCallback(
    async (e: any) => {
      e.preventDefault();
      if (!previusFile && !textPost && !previusVideoFile) return;

      try {
        const response = await fetch("http://localhost:8080/posts/create", {
          method: "POST",
          body: JSON.stringify({
            contentText: textPost,
            contentImage: previusFile,
            contentVideo: previusVideoFile,
          }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Barear ${authState.userToken}`,
          },
        });

        if (response.status === 500) {
          throw new Error("Something went wrong with the post");
        }
        console.log(await response.json());
        return props.toggleFunction();
      } catch (err) {
        console.error(err);
      }
    },
    [previusFile, authState, previusVideoFile]
  );
  //   <form >
  //   <input
  //     type="file"
  //     name="image"

  //   />
  //   <br />
  //   <button type="submit">Submit</button>
  // </form>

  return ReactDom.createPortal(
    <>
      <div className={Classes.Overlay} onClick={props.toggleFunction}></div>
      <div className={Classes.ToggleContainer}>
        <div className={Classes.FormContainer}>
          <div className={Classes.Header}>
            <h2>Crear Publicacion</h2>
            <button className={Classes.ExitContainer}>
              <CancelIcon className={Classes.ExitIcon} />
            </button>
          </div>
          <hr />
          <div className={Classes.UserData}>
            <AccountCircleIcon className={Classes.Avatar} />
            <span className={Classes.Name}> {props.UserName} </span>
          </div>
          <div className={Classes.InputsContainer}>
            <form onSubmit={submitPostHanlder}>
              <div className={Classes.BodyContainer}>
                <textarea
                  className={Classes.Textarea}
                  placeholder={props.placeholder}
                  value={textPost}
                  onChange={(e) => setTextPost(e.target.value)}
                ></textarea>

                {previusFile && (
                  <div className={Classes.SelectedImageContainer}>
                    <img
                      src={previusFile}
                      alt="chosen media"
                      className={Classes.SelectedImage}
                    />
                  </div>
                )}
                {previusVideoFile && (
                  <div className={Classes.SelectedImageContainer}>
                    <video className={Classes.SelectedImage} controls>
                      <source src={previusVideoFile} />
                    </video>
                  </div>
                )}
              </div>

              <div className={Classes.Footer}>
                <div className={Classes.ButtonsContainer}>
                  <div className={Classes.ButtonContent}>
                    <InputFile
                      type="file"
                      name="imageFile"
                      id="imageFile"
                      onChange={handleFileInputChange}
                      accept="image/png, image/jpeg"
                    />
                    <InputFileLabel
                      htmlFor="imageFile"
                      onMouseOut={() => {
                        setCurrentHover("");
                      }}
                      onMouseOver={() => {
                        setCurrentHover("image");
                      }}
                      color="crimson"
                    >
                      <PanoramaIcon />
                    </InputFileLabel>

                    {currentHover === "image" && (
                      <p className={Classes.PopupText}> Image </p>
                    )}
                  </div>
                  <div className={Classes.ButtonContent}>
                    <InputFile
                      type="file"
                      name="videoFile"
                      id="videoFile"
                      accept="video/*"
                      onChange={handleVideoInputChange}
                    />
                    <InputFileLabel
                      htmlFor="videoFile"
                      onMouseOut={() => {
                        setCurrentHover("");
                      }}
                      onMouseOver={() => {
                        setCurrentHover("video");
                      }}
                      color="royalblue"
                    >
                      <DuoIcon />
                    </InputFileLabel>
                    {currentHover === "video" && (
                      <p className={Classes.PopupText}> Video </p>
                    )}
                  </div>
                  <div className={Classes.ButtonContent}>
                    <Button
                      color="default"
                      variant="contained"
                      onMouseOut={() => {
                        setCurrentHover("");
                      }}
                      onMouseOver={() => {
                        setCurrentHover("tag");
                      }}
                    >
                      <PanoramaIcon />
                    </Button>
                    {currentHover === "tag" && (
                      <p className={Classes.PopupText}> Etiquetar </p>
                    )}
                  </div>
                  <div className={Classes.ButtonContent}>
                    <InputFileLabel
                      color="goldenrod"
                      onMouseOut={() => {
                        setCurrentHover("");
                      }}
                      onMouseOver={() => {
                        setCurrentHover("emotion");
                      }}
                    >
                      <EmojiEmotionsOutlinedIcon />
                    </InputFileLabel>
                    {currentHover === "emotion" && (
                      <p className={Classes.PopupText}> Emotion </p>
                    )}
                  </div>
                </div>
                <button className={Classes.SubmitButton}>Publicar</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>,
    document.getElementById("portal")!
  );
};
export default CompletePostForm;
