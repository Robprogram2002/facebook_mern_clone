import React, { useState } from "react";
import Classes from "./PostForm.module.css";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import VideocamIcon from "@material-ui/icons/Videocam";
import PermMediaIcon from "@material-ui/icons/PermMedia";
import RowIcon from "../../UI/RowIcon/RowIcon";
import Search from "../../Navigate/Search/Search";
import { Avatar } from "@material-ui/core";

interface IProps {
  Placeholder: string;
  ToggleFunction: any;
  perfilImage: string;
}

const PostForm = (props: IProps) => {
  return (
    <div className={Classes.Container}>
      <div className={Classes.ToggleSection}>
        <div className={Classes.IconContainer}>
          <Avatar
            src={props.perfilImage}
            className={Classes.Icon}
            alt="the user perfil image"
          />
        </div>
        <Search
          onClick={props.ToggleFunction}
          placeholder="What are in your mind, Robert ?"
        />
      </div>
      <div className={Classes.ButtonsContainer}>
        <RowIcon
          Text="Online Video"
          orientation="vertical"
          Icon={
            <VideocamIcon fontSize="large" className={Classes.OnlineIcon} />
          }
        />
        <RowIcon
          Text="Photo/Video"
          orientation="vertical"
          Icon={
            <PermMediaIcon fontSize="large" className={Classes.PhotoIcon} />
          }
        />
      </div>
    </div>
  );
};

export default PostForm;
