import styled from "styled-components";

export const InputContainer = styled.div`
  border-radius: 16px;
  background: rgba(94, 94, 94, 0.712);
  display: flex;
  padding: 8px 10px;
  width: 100%;
`;

export const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Icon = styled.i`
  color: #dbdbdb;
  margin-right: 0.4rem;
`;

export const SearchInput = styled.input`
  outline: none;
  border: none;
  background: transparent;
  width: 100%;
  padding: 3px 6px;
  color: #dbdbdb;
  font-size: 0.9rem;
  font-family: "Roboto", sans-serif;
  cursor: ${(props) =>
    props.onClick !== null || props.onClick !== undefined ? "pointer" : ""};

  /* $::placeholder {
    font-style: italic;
    color: #dbdbdb;
  } */
`;
