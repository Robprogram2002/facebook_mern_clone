import React from "react";
import MoreVertOutlinedIcon from "@material-ui/icons/MoreVertOutlined";
import image from "../../../assets/publicity1.jpg";
import Classes from "./Post.module.css";
import RowIcon from "../../UI/RowIcon/RowIcon";
import ThumbUpAltOutlinedIcon from "@material-ui/icons/ThumbUpAltOutlined";
import MessageOutlinedIcon from "@material-ui/icons/MessageOutlined";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";
import ShareOutlinedIcon from "@material-ui/icons/ShareOutlined";

import {
  PostContainer,
  PostHeader,
  AvatarContainer,
  Avatar,
  UserName,
  PostDate,
  ButtonIcon,
  PostBody,
  PostImage,
  PostVideo,
  PostBodyText,
  ButtonReaction,
  ReactionsContainer,
  PostButtons,
} from "./Post.elemts";

const Post = (props: any) => {
  return (
    <PostContainer>
      <PostHeader>
        <AvatarContainer>
          <div>
            <Avatar src={image} alt="" style={{}} />
          </div>
          <div>
            <UserName>Robert Martz Rivera</UserName>
            <PostDate>Publicado el 20 de mayo de 2020</PostDate>
          </div>
        </AvatarContainer>
        <ButtonIcon color="white">
          <MoreVertOutlinedIcon fontSize="large" />
        </ButtonIcon>
      </PostHeader>
      <PostBody>
        {props.ContentText && (
          <PostBodyText> {props.ContentText} </PostBodyText>
        )}
        {props.image && <PostImage src={props.image} alt="the post picture" />}

        {props.video && (
          <PostVideo src={props.video} controls={true} autoPlay={false} />
        )}
      </PostBody>
      <ReactionsContainer>
        <AvatarContainer>
          <ButtonReaction color="red">
            <i className="fas fa-heart"></i>
          </ButtonReaction>
          <ButtonReaction color="royalblue">
            <i className="fas fa-thumbs-up"></i>
          </ButtonReaction>
          <PostDate style={{ cursor: "pointer" }}>
            {props.reactionNumber}
          </PostDate>
        </AvatarContainer>
        <PostDate style={{ cursor: "pointer" }}>
          {props.commentsNumber} Comments
        </PostDate>
      </ReactionsContainer>
      <PostButtons>
        <RowIcon
          Icon={
            <ThumbUpAltOutlinedIcon
              style={{ color: "#666" }}
              fontSize="default"
            />
          }
          orientation="horizontal"
          Text="Like"
        />
        <RowIcon
          Text="Comment"
          orientation="horizontal"
          Icon={
            <MessageOutlinedIcon style={{ color: "#666" }} fontSize="default" />
          }
        />
        <RowIcon
          Text="Share"
          orientation="horizontal"
          Icon={
            <ShareOutlinedIcon style={{ color: "#666" }} fontSize="default" />
          }
        />
      </PostButtons>
      <div className={Classes.UserCommnet}>
        <Avatar src={image} alt="" style={{}} />
        <div className={Classes.CommentForm}>
          <TextareaAutosize
            className={Classes.InputComment}
            placeholder="Write a comment ..."
          />
          <div className={Classes.IconsContainer}>
            <i className="far fa-smile-beam"></i>
            <i className="fas fa-camera"></i>
            <i className="fas fa-video"></i>
          </div>
        </div>
      </div>
    </PostContainer>
  );
};

export default Post;
