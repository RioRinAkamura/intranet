import { createGlobalStyle } from 'styled-components';
/* istanbul ignore next */
export const GlobalStyle = createGlobalStyle`
  html,
  body {
    height: 100%;
    width: 100%;
    line-height: 1.5;
  }

  body {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    background-color: ${p => p.theme.background};
  }

  body.fontLoaded {
    font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  p,
  label {
    line-height: 1.5em;
  }

  input, select, button {
    font-family: inherit;
    font-size: inherit;
  }

  .icon {
    width: 1.5rem;
    height: 1.5rem;
  }

  & .notification-box {
    box-sizing: border-box;
    padding: 0;
    color: rgba(0,0,0,.85);
    font-size: 14px;
    font-variant: tabular-nums;
    line-height: 1.5715;
    list-style: none; 
    font-feature-settings: "tnum";
    position: fixed;
    z-index: 1010;
    margin: 0 24px 0 0;
  }
  & .toast-box{
    width: 100%;
    text-align: -webkit-center;
    box-sizing: border-box;
    padding: 0;
    color: #fff;
    font-size: 14px;
    font-variant: tabular-nums;
    line-height: 1.5715;
    list-style: none; 
    font-feature-settings: "tnum";
    position: fixed;
    z-index: 1010;
  }
    & .top {
      top:120px;
      left: 0px;
    }
    & .bottom {
      bottom:0px;
      left: 0px;
    }


    & .topLeft {
      top: 10px;
      left: 24px;
    };

    & .topRight {
      top: 10px;
      right: 24px;
    };

    & .bottomLeft {
      bottom: 10px;
      left: 15px;
    };

    & .bottomRight {
      bottom: 10px;
      right: 24px;
    };
    & .customClassname {
      width: 500px;
    }
  .custom-note-modal {
    max-width: 800px;
    width: 100% !important;
  }
`;
