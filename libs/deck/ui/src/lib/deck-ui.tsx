import styled from '@emotion/styled';

/* eslint-disable-next-line */
export interface DeckUiProps {}

const StyledDeckUi = styled.div`
  color: pink;
`;

export function DeckUi(props: DeckUiProps) {
  return (
    <StyledDeckUi>
      <h1>Welcome to DeckUi!</h1>
    </StyledDeckUi>
  );
}

export default DeckUi;
