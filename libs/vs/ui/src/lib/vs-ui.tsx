import styled from '@emotion/styled';

/* eslint-disable-next-line */
export interface VsUiProps {}

const StyledVsUi = styled.div`
  color: pink;
`;

export function VsUi(props: VsUiProps) {
  return (
    <StyledVsUi>
      <h1>Welcome to VsUi!</h1>
    </StyledVsUi>
  );
}

export default VsUi;
