import { PropsWithChildren } from 'react';
import Box from '@mui/material/Box';
import { AppBar } from '../app-bar';
import { Container } from '@mui/material';
import { useAppState } from '../../state';

export const BaseLayout = ({ children }: PropsWithChildren<{}>) => {

  const {title} = useAppState()

  return (
    <Box>
      <AppBar title={title} />
      <Container
          component="main"
          sx={{marginTop: '64px'}}
        >
          { children }
      </Container>
    </Box>
  );
};
