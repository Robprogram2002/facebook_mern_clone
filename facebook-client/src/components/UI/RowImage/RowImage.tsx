import React from "react";
import Classes from "./RowImage.module.css";

const RowImage = (props: any) => {
  return (
    <div className={Classes.Row}>
      <div className={Classes.ImageContainer}>
        <img
          src={props.image}
          alt="The content of the publicity"
          className={Classes.Image}
        />
      </div>
      <div className={Classes.Data}>
        <p className={Classes.Title}>{props.Title}</p>
        <span className={Classes.Messege}>{props.messege}</span>
      </div>
    </div>
  );
};

export default RowImage;
