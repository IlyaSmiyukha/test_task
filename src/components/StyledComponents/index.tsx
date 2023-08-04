import { Link } from "react-router-dom";
import styled, { css } from "styled-components";
export const Container = styled.div<{
  horisontal?: boolean;
  flexEnd?: boolean;
}>`
  display: flex;
  flex-direction: ${({ horisontal }) => (horisontal ? "row" : "column")};
  justify-content: ${({ flexEnd }) => (flexEnd ? "flex-end" : "flex-start")};
  width: 1140px;
  margin: 0 auto;
  padding: 16px;
  max-width: 90%;
`;

export const Button = styled.button<{
  small?: number;
  accent?: number;
}>`
  width: auto;
  padding: ${({ small }) => (small ? "0px 8px" : "0px 16px")};
  height: ${({ small }) => (small ? "28px" : "44px")};
  line-height: ${({ small }) => (small ? "28px" : "44px")};
  font-size: ${({ small }) => (small ? "12px" : "16px")};
  border-radius: 6px;
  color: rgb(255, 255, 255);
  background-color: ${({ theme, accent }) =>
    accent ? theme.accentColor : theme.btnBgColor};
  border: none;
  font-weight: 400;
  cursor: pointer;
  margin-left: 10px;

  &:hover {
    background-color: ${({ theme }) => theme.accentColorHover};
  }

  &:disabled {
    cursor: default;
    opacity: 0.5;

    &:hover {
      background-color: ${({ theme, accent }) =>
        accent ? theme.accentColor : theme.btnBgColor};
    }
  }
`;

export const StyledLink = styled(Link)<{
  small?: number;
  accent?: number;
}>`
  display: inline-block;
  text-decoration: none;
  padding: ${({ small }) => (small ? "0px 8px" : "0px 16px")};
  height: ${({ small }) => (small ? "28px" : "44px")};
  line-height: ${({ small }) => (small ? "28px" : "44px")};
  font-size: ${({ small }) => (small ? "12px" : "16px")};
  border-radius: 6px;
  color: rgb(255, 255, 255);
  background-color: ${({ theme, accent }) =>
    accent ? theme.accentColor : theme.btnBgColor};
  border: none;
  font-weight: 400;
  cursor: pointer;
  margin-left: 10px;
  vertical-align: top;

  &:hover {
    background-color: ${({ theme }) => theme.accentColorHover};
  }

  &.disabled {
    pointer-events: none;
    opacity: 0.5;

    &:hover {
      background-color: ${({ theme, accent }) =>
        accent ? theme.accentColor : theme.btnBgColor};
    }
  }
`;
