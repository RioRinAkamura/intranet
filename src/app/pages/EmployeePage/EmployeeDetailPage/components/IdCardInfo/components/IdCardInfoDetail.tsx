/**
 *
 * IdCardInfo
 *
 */
import { Employee } from '@hdwebsoft/intranet-api-sdk/libs/api/hr/models';
import {
  Col,
  DatePicker,
  DatePickerProps,
  Form,
  Input,
  InputProps,
  Row,
} from 'antd';
import config from 'config';
import moment from 'moment';
import React, { memo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';
import { UserDetailMessages } from '../../../messages';
import { useHandleEmployeeDetail } from '../../../useHandleEmployeeDetail';
import { TitlePath } from '../../TitlePath';

const DATE_FORMAT = config.DATE_FORMAT;
interface IdCardProps {
  isView?: boolean;
  isEdit?: boolean;
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

export const IdCardInfoDetail = memo((props: IdCardProps) => {
  const { isView } = props;
  const { t } = useTranslation();
  const { user } = useHandleEmployeeDetail();
  const [form] = Form.useForm();

  const [data, setData] = React.useState<Employee>();
  React.useEffect(() => {
    if (user) {
      setData(user);
    }
  }, [user]);
  React.useEffect(() => {
    if (data) {
      form.setFieldsValue({
        ...data,
        id: data.id,
        issued_date: data.issued_date && moment(data.issued_date, DATE_FORMAT),
      });
    }
  }, [data, form]);

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
                  defaultValue={moment(moment(), DATE_FORMAT)}
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
