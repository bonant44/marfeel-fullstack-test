import MuiAppBar from '@mui/material/AppBar';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AppViewMode, useAppState } from '../../state';

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

  const {setViewMode, mode} = useAppState()

  const handleDateChange = (e: SelectChangeEvent<AppViewMode>) => {
    setViewMode(e.target.value as AppViewMode)
  }

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

      <Select onChange={handleDateChange} value={mode}>
        <MenuItem value={'today'}>Today</MenuItem>
        <MenuItem value={'yesterday'}>Yesterday</MenuItem>
        <MenuItem value={'last-week'}>Last seven days</MenuItem>
        <MenuItem value={'month'}>This month</MenuItem>
      </Select>
    </StyledAppBar>
  );
};
