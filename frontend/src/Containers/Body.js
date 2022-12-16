import { useState } from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import AddPanel from '../Components/AddPanel';
import QueryPanel from '../Components/QueryPanel';
import { useScoreCard } from '../hooks/useScoreCard';

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function BasicTabs() {
    const [value, setValue] = useState(0);
    const { clearMessage } = useScoreCard();

    const handleChange = (e, newValue) => {
        setValue(newValue);
        clearMessage([]);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Add" {...a11yProps(0)} />
                    <Tab label="Query" {...a11yProps(1)} />
                </Tabs>
            </Box>
            {
                value === 0 ? <AddPanel /> : <QueryPanel />
            }
        </Box>
    );
}

