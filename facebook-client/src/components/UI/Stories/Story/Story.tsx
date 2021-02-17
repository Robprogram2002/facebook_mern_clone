import React from "react";
import Classes from "./Story.module.css";

interface Props {
  image: any;
  userName: string;
}

const Story = (props: Props) => {
  return (
    <button className={Classes.StoryContainer}>
      <img src={props.image} alt="" className={Classes.StoryImage} />
      <div className={Classes.Overlay}></div>
      <div className={Classes.UserData}>
        <span className={Classes.Name}>{props.userName}</span>
      </div>
    </button>
  );
};

export default Story;
