import styled from "styled-components";
import { fontFamalies, Colors } from "../../../constants/generalStyles";

export const PostHeader = styled.div`
  display: grid;
  grid-template-columns: 90% 10%;
  grid-template-rows: 1fr;
  width: 100%;
  height: 60px;
  padding: 1rem;
`;

export const PostContainer = styled.div`
  width: 100%;
  border-radius: 14px;
  box-shadow: -1px 1px 1px 1px rgba(0, 0, 0, 0.4);
  height: 100%;
  background: ${Colors.backgroundPost};
  overflow: hidden;
  margin-top: 1.2rem;
  height: 100%;
  max-height: 1000px;
`;

export const AvatarContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 100%;
`;

export const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 0.75rem;
`;

export const UserName = styled.p`
  color: #ffffff;
  font-family: ${fontFamalies.regular};
  font-size: 1rem;
`;

export const ButtonIcon = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  border: none;
  background-color: transparent;
  outline: none;
  cursor: pointer;
  color: ${(props) => props.color};
  border-radius: 50%;
`;

export const PostDate = styled.span`
  color: #666666;
  font-size: 0.9rem;
  font-style: italic;
  font-family: ${fontFamalies.regular};
`;

export const PostBody = styled.div`
  max-height: 450px;
  width: 100%;
  height: 100%;
  padding: 0;
  margin-top: 0.3rem;
  margin-bottom: 0.5rem;
`;

export const PostImage = styled.img`
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0rem;
  cursor: pointer;
`;

export const PostVideo = styled.video`
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0rem;
`;

export const PostBodyText = styled.p`
  width: 100%;
  color: #dbdbdb;
  font-size: 0.9rem;
  letter-spacing: 1px;
  padding: 1rem;
  font-family: ${fontFamalies.regular};
`;

export const ReactionsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  height: 40px;
`;

export const ButtonReaction = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  border: none;
  background-color: ${(props) => props.color};
  outline: none;
  cursor: pointer;
  color: #fff;
  border-radius: 50%;
  margin: 0 0.2rem;
`;

export const PostButtons = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: 1fr;
  height: 50px;
  padding: 0.4rem;
  margin: 0rem 1.2rem;
  border-top: 0.3px solid #fff;
  border-bottom: 0.3px solid #fff;
`;
