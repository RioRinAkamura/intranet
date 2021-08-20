import { Col, Row, TablePaginationConfig } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';
import styled from 'styled-components/macro';
import { Employee } from '@hdwebsoft/boilerplate-api-sdk/libs/api/hr/models';
import { ProjectOutlined } from '@ant-design/icons';
import { ProjectsMessages } from '../../messages';
import Button from 'app/components/Button';
import { PrivatePath } from 'utils/url.const';

interface HeaderButtonProps {
  pagination?: TablePaginationConfig;
  data?: Employee[];
  selectedRows?: Employee[];
}

export const HeaderButton = (props: HeaderButtonProps) => {
  const { t } = useTranslation();
  const history = useHistory();

  return (
    <Row justify="end">
      <OptionButton>
        <Button
          type="primary"
          onClick={() => history.push(PrivatePath.PROJECTS_CREATE)}
          icon={<ProjectOutlined />}
          size="middle"
        >
          {t(ProjectsMessages.createProjectButton())}
        </Button>
      </OptionButton>
    </Row>
  );
};

const OptionButton = styled(Col)`
  margin-left: 1em;
  margin-bottom: 1em;

  button {
    display: flex;
    align-items: center;
  }
`;
