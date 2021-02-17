import React from "react";
import styled from "styled-components";
import { Colors } from "../../../constants/generalStyles";

const CardDiv = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 12px;
  background: ${Colors.backgroundPost};
  padding: 0.8rem;
  position: relative;
  margin-top: 1rem;
  box-shadow: -1px 1px 1px 1px rgba(0, 0, 0, 0.4);
`;

const Card: React.FC = (props) => {
  return <CardDiv>{props.children}</CardDiv>;
};

export default Card;
