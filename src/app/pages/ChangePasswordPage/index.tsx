import React, { useState, useRef } from 'react';
import styled from 'styled-components/macro';
import FormModalChangePw from './FormModalChangPw';
import { useTranslation } from 'react-i18next';
import { messages } from './messages';

export const ChangePasswordPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <Wrapper>
      <Title>Change Password Modal</Title>

      <div>
        <button
          type="button"
          className="btn btn-primary"
          data-toggle="modal"
          data-target="#openModalChangePw"
        >
          Change Password
        </button>
        <div
          className="modal fade"
          id="openModalChangePw"
          tabIndex={-1}
          role="dialog"
          aria-labelledby="exampleModalCenterTitle"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLongTitle">
                  {t(messages.changePasswordButton())}
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                  id="closeModal"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body">
                <FormModalChangePw />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default ChangePasswordPage;

const Wrapper = styled.div`
  width: 50%;
  margin: 10% auto;
  text-align: center;
`;

const Title = styled.h2``;
