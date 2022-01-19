import styled from 'styled-components/macro';
const Loading = () => {
  return (
    <>
      <StyledSpinning>
        <StyledSpan>
          <StyledIcon></StyledIcon>
          <StyledIcon></StyledIcon>
          <StyledIcon></StyledIcon>
          <StyledIcon></StyledIcon>
        </StyledSpan>
      </StyledSpinning>
    </>
  );
};
export default Loading;

const StyledSpinning = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 4;
  display: block;
  width: 100%;
  height: 100%;
  max-height: 400px;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-size: 14px;
  font-variant: tabular-nums;
  line-height: 1.5715;
  list-style: none;
  font-feature-settings: 'tnum', 'tnum';
  color: #1890ff;
  text-align: center;
  vertical-align: middle;
  opacity: 1;
  transition: transform 0.3s cubic-bezier(0.78, 0.14, 0.15, 0.86);
`;

const StyledSpan = styled.span`
  position: absolute;
  top: 50%;
  left: 50%;
  margin: -10px;
  transform: rotate(45deg);
  animation: antRotate 1.2s infinite linear;
  display: inline-block;
  font-size: 20px;
  width: 1em;
  height: 1em;
  i {
  }
`;
const StyledIcon = styled.i`
  position: absolute;
  display: block;
  width: 9px;
  height: 9px;
  background-color: #1890ff;
  border-radius: 100%;
  transform: scale(0.75);
  transform-origin: 50% 50%;
  opacity: 0.3;
  animation: antSpinMove 1s infinite linear alternate;
  &:nth-child(1) {
    top: 0;
    left: 0;
  }
  &:nth-child(2) {
    top: 0;
    right: 0;
    animation-delay: 0.4s;
  }
  &:nth-child(3) {
    right: 0;
    bottom: 0;
    animation-delay: 0.8s;
  }
  &:nth-child(4) {
    bottom: 0;
    left: 0;
    animation-delay: 1.2s;
  }
`;
