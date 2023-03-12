import { PropsWithChildren } from 'react';
import Box from '@mui/material/Box';
import { AppBar } from '../app-bar';
import { Container } from '@mui/material';

export const BaseLayout = ({ children }: PropsWithChildren<{}>) => {
  return (
    <Box>
      <AppBar title='Traffic' />
      <Container
          component="main"
          sx={{marginTop: '64px'}}
        >
          { children }
      </Container>
    </Box>
  );
};
