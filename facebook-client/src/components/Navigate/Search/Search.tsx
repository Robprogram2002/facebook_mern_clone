import React from "react";
import {
  InputContainer,
  IconContainer,
  Icon,
  SearchInput,
} from "./Search.elements";

interface IProps {
  IconName?: string;
  placeholder: string;
  onClick?: any;
}

const Search = (props: IProps) => {
  return (
    <InputContainer>
      {props.IconName && (
        <IconContainer>
          <Icon className={props.IconName}></Icon>
        </IconContainer>
      )}
      <SearchInput
        type="text"
        name="search"
        id="search"
        placeholder={props.placeholder}
        onClick={props.onClick}
      />
    </InputContainer>
  );
};

export default Search;
