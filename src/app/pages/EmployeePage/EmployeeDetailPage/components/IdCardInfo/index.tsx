/**
 *
 * IdCardInfo
 *
 */
import React, { memo } from 'react';
import styled from 'styled-components/macro';
import { useTranslation } from 'react-i18next';
import {
  Col,
  DatePicker,
  DatePickerProps,
  Form,
  Input,
  InputProps,
  Row,
  FormInstance,
} from 'antd';
import { UserDetailMessages } from '../../messages';
import { TitlePath } from '../TitlePath';
import config from 'config';

const DATE_FORMAT = config.DATE_FORMAT;
interface IdCardProps {
  isView: boolean;
  isEdit: boolean;
  form: FormInstance;
}
const inputProps: InputProps = {
  bordered: false,
  readOnly: true,
};

const datePickerProps: DatePickerProps = {
  bordered: false,
  inputReadOnly: true,
  allowClear: false,
  suffixIcon: null,
  popupStyle: { display: 'none' },
};

export const IdCardInfo = memo((props: IdCardProps) => {
  const { isView } = props;
  const { t } = useTranslation();

  return (
    <IdCardInfoStyled>
      <TitlePath>
        <b> {t(UserDetailMessages.formIDCardTitle())}</b>
      </TitlePath>
      <Row gutter={[32, 0]}>
        <Col md={isView ? 24 : 8} xs={24}>
          <Row gutter={[0, 12]} align="middle">
            <Col md={isView ? 8 : 24} xs={24}>
              <span className="label">
                {t(UserDetailMessages.formIdNumberLabel())}
              </span>
            </Col>
            <Col md={isView ? 16 : 24} xs={24}>
              <FormItem isView={isView} name="id_number">
                <Input
                  {...(isView ? inputProps : {})}
                  size="large"
                  placeholder={
                    isView
                      ? ''
                      : t(UserDetailMessages.formIdNumberPlaceholder())
                  }
                />
              </FormItem>
            </Col>
          </Row>
        </Col>
        <Col md={isView ? 24 : 8} xs={24}>
          <Row gutter={[0, 12]} align="middle">
            <Col md={isView ? 8 : 24} xs={24}>
              <span className="label">
                {t(UserDetailMessages.formIssuedDateLabel())}
              </span>
            </Col>
            <Col md={isView ? 16 : 24} xs={24}>
              <FormItem isView={isView} name="issued_date">
                <DatePicker
                  {...(isView ? datePickerProps : {})}
                  format={DATE_FORMAT}
                  size="large"
                  placeholder={
                    isView
                      ? ''
                      : t(UserDetailMessages.formIssuedDatePlaceholder())
                  }
                />
              </FormItem>
            </Col>
          </Row>
        </Col>
        <Col md={isView ? 24 : 8} xs={24}>
          <Row gutter={[0, 12]} align="middle">
            <Col md={isView ? 8 : 24} xs={24}>
              <span className="label">
                {t(UserDetailMessages.formIssuedPlaceLabel())}
              </span>
            </Col>
            <Col md={isView ? 16 : 24} xs={24}>
              <FormItem isView={isView} name="issued_place">
                <Input
                  {...(isView ? inputProps : {})}
                  size="large"
                  placeholder={
                    isView
                      ? ''
                      : t(UserDetailMessages.formIssuedPlacePlaceholder())
                  }
                />
              </FormItem>
            </Col>
          </Row>
        </Col>
      </Row>
    </IdCardInfoStyled>
  );
});

interface ScreenProps {
  isView?: boolean;
}

const FormItem = styled(Form.Item)`
  align-items: center;
  margin-bottom: ${(props: ScreenProps) => (props.isView ? '0px' : '12px')};
  div {
    width: 100%;
  }
  label {
    font-weight: 500;
  }
`;

const IdCardInfoStyled = styled.div`
  .label {
    font-weight: 500;
  }
`;
