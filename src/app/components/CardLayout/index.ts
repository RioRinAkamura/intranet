import styled from 'styled-components/macro';

interface CardLayoutProps {
  padding?: string;
}

export const CardLayout = styled.div`
  background-color: white;
  margin-top: 2rem;
  padding: ${(props: CardLayoutProps) => props.padding || '1rem'};
  margin-bottom: 2rem;
  border-radius: 10px;
  width: 100%;
  height: 100%;
`;
