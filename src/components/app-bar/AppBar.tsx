import MuiAppBar from '@mui/material/AppBar';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { MenuItem, Select } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const StyledAppBar = styled(MuiAppBar)`
  height: 64px;
  padding: 12px 30px;
  flex-direction: row;
`;

export type AppBarProps = {
  title: string;
};

export const AppBar = ({ title }: AppBarProps) => {
  const navigate = useNavigate()

  return (
    <StyledAppBar>
      <Typography
        component="h1"
        variant="h6"
        color="inherit"
        noWrap
        sx={{ flexGrow: 1, alignSelf: 'center', cursor: 'pointer' }}
        onClick={() => navigate('/')}
      >
        { title }
      </Typography>

      {/* TODO */}
      <Select>
        <MenuItem>Today</MenuItem>
        <MenuItem>Yesterday</MenuItem>
        <MenuItem>Last seven days</MenuItem>
        <MenuItem>This month</MenuItem>
      </Select>
    </StyledAppBar>
  );
};
