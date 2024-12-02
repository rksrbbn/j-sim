import { Button, Container, Typography } from '@mui/material';
import HeaderApp from '../../components/HeaderApp';
import FooterApp from '../../components/FooterApp';
import { getHistory } from '../../db';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Logs() {
    const navigate = useNavigate();
    const [history, setHistory] = useState([]);
    useEffect(() => {
        getHistory().then((data) => {
            setHistory(data);
        });
    }, []);

    return (
        <div style={{ backgroundColor: '#FDECEF', minHeight: '100vh', marginTop: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <HeaderApp />
            <Container className="App" maxWidth="sm" style={{ textAlign: 'center', marginTop: '30px' }}>
                <Typography variant='h4' style={{ background: 'linear-gradient(to right, red, purple)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Logs</Typography>

                <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center', height:'500px', overflowY: 'auto', backgroundColor: 'white', borderRadius: '14px', padding: '10px', color: '#f50057' }}>
                    {history.length > 0 ? history.map((item, index) => (
                        <small key={index} variant='h6'>[{new Date(item.timestamp).toLocaleString()}] You have Obtained <span style={{ color: '#f50057', fontWeight: 'bold' }}>{item.memberName}</span></small>
                    )) : <Typography variant='h6'>No Data</Typography>}
                </div>

                <Button fullWidth variant='outlined' color='error' style={{ marginTop: '30px' }} onClick={() => navigate('/')}>HOME</Button>
            </Container>
            <FooterApp/>
        </div>
    );
}

export default Logs;