import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { useChangePasswordSlice } from '../slice';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { messages } from './../messages';

type Inputs = {
  oldpassword: string;
  newpassword: string;
  retypepassword: string;
};

const FormModalChangePw: React.FC = () => {
  const { actions } = useChangePasswordSlice();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<Inputs>();

  const handleCloseModal = () => {
    let click = document.getElementById('closeModal');
    reset();
    click?.click();
  };

  useEffect(() => {
    window.onkeydown = e => {
      if (e.keyCode == 27) {
        reset();
      }
    };
  });

  const newpassword = useRef({});
  newpassword.current = watch('newpassword', '');

  const onSubmit = data => {
    handleCloseModal();
    dispatch(actions.changePassword(data));
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <div className="form-group" style={{ textAlign: 'left' }}>
        <label htmlFor="exampleInputPasswordOld">
          {t(messages.changePasswordOld())}
        </label>
        <input
          type="password"
          className="form-control"
          id="exampleInputPasswordOld"
          placeholder={t(messages.changePasswordOld())}
          {...register('oldpassword', { required: true })}
        />
        {errors.oldpassword && errors.oldpassword.type === 'required' && (
          <p className="text-danger">
            {t(messages.changePasswordIsRequired())}
          </p>
        )}
      </div>

      <div className="form-group" style={{ textAlign: 'left' }}>
        <label htmlFor="exampleInputPasswordNew">
          {t(messages.changePasswordNew())}
        </label>
        <input
          type="password"
          className="form-control"
          id="exampleInputPasswordNew"
          placeholder={t(messages.changePasswordNew())}
          {...register('newpassword', {
            required: true,
            minLength: 8,
            pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!"#$%&'()*+,-.\/:;<=>?\\@[\]^_`{|}~]).{8,64}$/,
          })}
        />
        {errors.newpassword && errors.newpassword.type === 'required' && (
          <p className="text-danger">
            {t(messages.changePasswordIsRequired())}
          </p>
        )}
        {errors.newpassword && errors.newpassword.type === 'minLength' && (
          <p className="text-danger">{t(messages.changePasswordMinLength())}</p>
        )}
        {errors.newpassword && errors.newpassword.type === 'pattern' && (
          <p className="text-danger">
            {t(messages.changePasswordComplexPassword())}
          </p>
        )}
      </div>

      <div className="form-group" style={{ textAlign: 'left' }}>
        <label htmlFor="exampleInputPasswordRetype">
          {t(messages.changePasswordRetype())}
        </label>
        <input
          type="password"
          className="form-control"
          id="exampleInputPasswordRetype"
          placeholder={t(messages.changePasswordRetype())}
          {...register('retypepassword', {
            required: true,
            validate: value =>
              value === newpassword.current || 'The passwords do not match',
          })}
        />
        {errors.retypepassword && errors.retypepassword.type === 'required' && (
          <p className="text-danger">
            {t(messages.changePasswordIsRequired())}
          </p>
        )}
        {errors.retypepassword && errors.retypepassword.type === 'validate' && (
          <p className="text-danger">
            {t(messages.changePasswordIsNotMatch())}
          </p>
        )}
      </div>

      <div>
        <button
          type="button"
          className="btn btn-secondary mr-3"
          onClick={handleCloseModal}
        >
          {t(messages.changePasswordCancle())}
        </button>
        <button type="submit" className="btn btn-primary">
          {t(messages.changePasswordButton())}
        </button>
      </div>
    </Form>
  );
};

export default FormModalChangePw;

const Form = styled.form``;
