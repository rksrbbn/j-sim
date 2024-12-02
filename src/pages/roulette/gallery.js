import {useState, useEffect} from 'react';
import { Container, Typography, Divider, Grid, Avatar, Badge, TextField } from "@mui/material";
import FooterApp from "../../components/FooterApp";
import HeaderApp from "../../components/HeaderApp";
import { getHistory, clearHistory } from "../../db";
import { members } from "../../membersData";
import { useNavigate } from 'react-router-dom';

function Gallery() {
    const navigate = useNavigate();
    const [memberList, setMemberList] = useState([]);
    const searchMemberDataByAlias = (alias) => {
        return members.find(member => member.alias.toLowerCase() === alias.toLowerCase());
    };

    useEffect(() => {
        const fetchData = async () => {
            const historyData = await getHistory();
            if (historyData.length > 0) {
                const memberCount = {};
                historyData.forEach((row) => {
                    const memberName = row.memberName.trim().toLowerCase();
                    if (!memberCount[memberName]) {
                        memberCount[memberName] = 1;
                    } else {
                        memberCount[memberName]++;
                    }
                });

                const memberObjects = Object.keys(memberCount).map(memberName => {
                    const memberData = searchMemberDataByAlias(memberName);
                    return memberData ? 
                        { ...memberData, count: memberCount[memberName] } : 
                        { alias: memberName, name: "Unknown", role: "Unknown", count: memberCount[memberName] };
                });

                setMemberList(memberObjects);
            }
        };
        fetchData();
    }, []);

    const clear = () => {
        clearHistory();
        window.location.reload();
    };

    const [searchQuery, setSearchQuery] = useState("");

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredMembers = memberList.filter(member =>
        member.alias.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return(
        <div className='container' style={{ backgroundColor: '#FDECEF', minHeight: '100vh', marginTop: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <HeaderApp />
            <Container className="App" maxWidth="sm" style={{ textAlign: 'center', marginTop:'30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <p style={{ textDecoration: 'underline', cursor: 'pointer', color: '#f50057', fontSize: '12px', textAlign: 'left' }} onClick={() => navigate('/')}>Back to Home</p>
                <p style={{ textDecoration: 'underline', cursor: 'pointer', color: '#f50057', fontSize: '12px', textAlign: 'right' }} onClick={() => {
                    if (window.confirm('Apakah Anda yakin ingin menghapus semua data riwayat?')) {
                        clear();
                    }
                }}>Clear History</p>
            </div>
            
                <Typography variant='h4' style={{ background: 'linear-gradient(to right, red, purple)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
                   Roulette History
                </Typography>
                <small style={{color:'#db5198', marginBottom:'5px'}}>(You Have Obtained <span style={{fontWeight:'bold'}}>{memberList.length}/{members.length}</span> members)</small>
                <Divider sx={{marginTop:'10px'}}/>

                 {/* Search Bar */}
                 <TextField
                    variant="outlined"
                    fullWidth
                    placeholder="Search member..."
                    value={searchQuery}
                    size='small'
                    onChange={handleSearchChange}
                    style={{ marginBottom: '20px', marginTop:'20px' }}
                    InputProps={{
                        style: {
                            border: '2px solid #db5198', // Custom border color and width
                            borderRadius: '4px' // Custom border radius
                        }
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: '#db5198',
                            },
                            '&:hover fieldset': {
                                borderColor: '#db5198',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#db5198',
                            },
                        },
                    }}
                />

                {filteredMembers.length > 0 ?
                <Grid container spacing={2} justifyContent="center" style={{ marginTop: '20px', fontSize: { xs: '10px', sm: '12px', md: '14px', lg: '16px' } }}>
                        {filteredMembers.map((member, index) => (
                        <Grid item xs={3} sm={3} md={3} lg={3} key={member.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                          <Badge badgeContent={'X'+member.count} color="error" anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                          }}>
                          <Avatar
                                src={member.picture}
                                alt={member.alias}
                                style={{ marginBottom: '10px', border: '2px solid #db5198' }}
                                sx={{
                                    width: { xs: 40, sm: 40, md: 50, lg: 55 },
                                    height: { xs: 40, sm: 40, md: 50, lg: 55 }
                                }}
                            />
                            </Badge>
                             <div style={{ textAlign: 'center', width: '100%'}}>
                                <Typography component="div" style={{ color: '#db5198',  backgroundColor: '#fff', borderRadius: '4px', padding: '2px', fontSize: { xs: '10px', sm: '12px', md: '14px', lg: '16px' } }}>
                                    {member.alias}
                                </Typography>
                            </div>
                        </Grid>
                    ))}
                </Grid>
                :
                <div style={{ marginTop: '20px' }}>
                    <Typography variant='h6' style={{ background: 'linear-gradient(to right, red, purple)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>No data found</Typography>
                </div>
                }
            </Container>
        <FooterApp/>
        </div>
    );
}

export default Gallery;