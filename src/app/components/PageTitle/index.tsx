import styled from 'styled-components/macro';

interface PageTitleProps {
  className?: string;
}

export const PageTitle = styled.div`
  padding: 1rem;
  background-color: white;
  border-radius: 10px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${(props: PageTitleProps) =>
    props.className !== 'no-responsive' &&
    `
  @media screen and (max-width: 700px) {
    flex-direction: column;
    align-items: flex-start;
    .children {
      margin-top: 10px;
      max-width: 100%;
      width: 100%;
    }
  }
  `}
`;

export const Title = styled.p`
  font-size: 25px;
  line-height: 30px;
  color: rgb(112 112 112);
  padding: 0;
  margin: 0;
`;

interface PageTitleHeaderProps {
  title: string;
  children?: any;
  className?: string;
}

const PageTitleHeader = ({
  title,
  children,
  className = 'children',
}: PageTitleHeaderProps) => {
  return (
    <PageTitle className={className}>
      <Title>{title}</Title>
      {children && (
        <div
          className={`${
            className && className !== 'no-responsive'
              ? className + ' ant-col ant-col-xs-24 ant-col-sm-14'
              : ''
          }`}
        >
          {children}
        </div>
      )}
    </PageTitle>
  );
};

export default PageTitleHeader;
