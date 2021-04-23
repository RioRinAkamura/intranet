import { Divider, Select, Tag } from 'antd';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/macro';
import fakeAPI from '../../../../../../utils/fakeAPI';

interface Props {}

interface Tags {
  name: string;
  slug: string;
  id: number;
}
const { Option } = Select;

export const Tags = (props: Props) => {
  const [tags, setTags] = React.useState([]);

  React.useEffect(() => {
    fakeAPI
      .get(`/hr/employees/f2ddcc1f-6960-4894-bbed-e1545872ef57/tags/`)
      .then((response: any) => {
        setTags(response);
      })
      .catch(err => {
        console.log('err', err);
      });
  }, []);

  console.log('tags', tags);

  return (
    <>
      <Divider orientation="left">
        <b>Tags</b>
      </Divider>
      <Wrapper>
        <Select
          mode="multiple"
          showArrow
          style={{ width: '100%' }}
          className="tags"
        >
          {tags?.map((item: Tags) => (
            <Option value={item.name} key={item.id}>
              {item.name}
            </Option>
          ))}
        </Select>
      </Wrapper>
    </>
  );
};

const Wrapper = styled.div`
  .tags {
    span.ant-tag-close-icon {
      transform: translateY(-2px);
    }
  }
`;
