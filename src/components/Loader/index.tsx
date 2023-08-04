import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";

export const Loader = () => {
  return (
    <LoaderWrap>
      <FontAwesomeIcon icon={faSpinner} spinPulse />
    </LoaderWrap>
  );
};

const LoaderWrap = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.accentColorHover};
  font-size: 80px;
`;
