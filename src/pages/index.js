import { Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import HeaderApp from '../components/HeaderApp';
import FooterApp from '../components/FooterApp';

function Pages()
{
    const navigate = useNavigate();
    
    return (
        <div style={{ backgroundColor: '#FDECEF', minHeight: '100vh', marginTop: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <HeaderApp />
            <Container className="App" maxWidth="sm" style={{ textAlign: 'center', marginTop: '30px' }}>
                <Typography variant='h6' style={{ background: 'linear-gradient(to right, red, purple)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Welcome to JKT48 Roulette</Typography>

                <div style={{ marginTop: '50px' }}>
                    <div style={{ marginBottom: '30px', cursor: 'pointer', backgroundColor: '#f50057', color: 'white', padding: '10px', borderRadius: '14px' }} onClick={() => navigate('/sim')}>
                        SIM
                    </div>
                    <div style={{ marginBottom: '30px', cursor: 'pointer', backgroundColor: '#f50057', color: 'white', padding: '10px', borderRadius: '14px' }} onClick={() => navigate('/roulette')}>
                        2S Roulette
                    </div>
                    <div style={{ marginBottom: '30px', cursor: 'pointer', backgroundColor: '#f50057', color: 'white', padding: '10px', borderRadius: '14px' }} onClick={() => navigate('/gallery')}>
                        Gallery
                    </div>
                    <div style={{ marginBottom: '30px', cursor: 'pointer', backgroundColor: '#f50057', color: 'white', padding: '10px', borderRadius: '14px' }} onClick={() => navigate('/logs')}>
                        Logs
                    </div>
                </div>
            </Container>
            <FooterApp />
        </div>
    )
}

export default Pages;
