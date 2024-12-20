import { Button, Container, Typography, Modal, Box, TextField, useMediaQuery, useTheme, Select, MenuItem, InputLabel, Avatar, FormControl } from '@mui/material';
import HeaderApp from '../../components/HeaderApp';
import FooterApp from '../../components/FooterApp';
import { db, getPerson, updatePerson } from '../../db';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid } from '@mui/material';
import { members } from '../../membersData';

function Logs() {
    const navigate = useNavigate();
    const [person, setPerson] = useState([]);
    const [name, setName] = useState("");
    const [oshi, setOshi] = useState("");
    const [oshiObject, setOshiObject] = useState(null);
    const [open, setOpen] = useState(false);
    const isNew = localStorage.getItem('isNew');

    if (isNew == null)
    {
        localStorage.setItem('isNew', 1)
    }

    const updatePersonColumn = async (id, columnName, value) => {
        try {
          await db.person.update(id, {
            [columnName]: value
          });
          const updatedPerson = await getPerson();
        setPerson(updatedPerson); // Perbarui state dengan data terbaru
          console.log(`Kolom ${columnName} berhasil diupdate untuk person dengan id ${id}`);
        } catch (error) {
          console.error(`Error mengupdate kolom ${columnName}:`, error);
        }
    };

    const searchMemberDataByAlias = (alias) => {
        return members.find(member => member.alias === alias);
    };

    useEffect(() => {
        getPerson().then((data) => {
            setPerson(data);
        });

         // Periksa nilai `isNew` di localStorage
        const isNew = localStorage.getItem("isNew");
            if (isNew === "1") {
            setOpen(true); // Tampilkan modal jika `isNew` adalah "1"
        }
    }, []);

    const handleSave = () => {
      if (name.trim() && oshi.trim()) {
        // Simpan nama di localStorage atau state lain
        updatePerson(1,{ 
            id: 1,
            day: 1,
            name: name, 
            age: '20', 
            balance: 100000, 
            health: 80, 
            smart: 90, 
            looks: 70, 
            happiness: 75,
            oshi: oshi
        }); 
        getPerson().then((data) => {
            setPerson(data);
        });
        setOpen(false); // Tutup modal
        localStorage.setItem("isNew", "0"); // Ubah `isNew` ke 0 untuk menandai modal sudah ditampilkan
      } else {
        alert("Name cannot be empty!"); // Validasi jika nama kosong
      }
    };

    const nextDay = async () => {
        try {
            // Tambahkan uang terlebih dahulu
            await updatePersonColumn(1, 'balance', person[0].balance + 25000);
            // Setelah balance diperbarui, perbarui day
            await updatePersonColumn(1, 'day', (person[0].day || 0) + 1);
            console.log("Next day updated successfully");
        } catch (error) {
            console.error("Error in nextDay function:", error);
        }
    };

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const renderStatIcon = (type) => {
    const icons = {
      health: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" id="heart">
          <path fill="#f05542" d="M5.301 3.002c-.889-.047-1.759.247-2.404.893-1.29 1.292-1.175 3.49.26 4.926l.515.515L8.332 14l4.659-4.664.515-.515c1.435-1.437 1.55-3.634.26-4.926-1.29-1.292-3.483-1.175-4.918.262l-.516.517-.517-.517C7.098 3.438 6.19 3.049 5.3 3.002z"></path>
        </svg>
      ),
      looks: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f05542" strokeWidth="2">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ),
      smart: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f05542" strokeWidth="2">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
        </svg>
      ),
      happiness: (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f05542" strokeWidth="2">
          <path d="M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10zm0-12c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM6 12c0 1.1.9 2 2 2s2-.9 2-2-.9-2-2-2-2 .9-2 2z"/>
        </svg>
      )
    };
    return icons[type];
  };

    return (
        <div style={{ backgroundColor: '#FDECEF', minHeight: '100vh', marginTop: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <HeaderApp />
            <Container className="App" maxWidth="lg" style={{ textAlign: 'center', marginTop: '30px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Avatar src={oshiObject.picture} alt={oshiObject.alias} style={{border: '2px solid #db5198'}} />
                    <div>
                        <Typography variant='h4' style={{ background: 'linear-gradient(to right, red, purple)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}> {person.length > 0 ? person[0].name : "Loading..."}</Typography>
                        <small style={{color:'#f50057'}}>Day {person.length > 0 ? person[0].day : "1"}</small>
                    </div>
                    <div></div>
                </div>

                <div style={{ marginTop: '20px', display: 'flex', justifyContent:'space-between', height:'20px', backgroundColor: 'white', borderRadius: '14px', padding: '10px', fontSize: { xs: '10px', sm: '12px', md: '14px', lg: '16px' } }} >
                {person.length > 0 ? (
                    <>
                    {isSmallScreen ? (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                          {renderStatIcon('health')} <Typography color='#f50057'>{person[0].health}</Typography>
                          {renderStatIcon('looks')} <Typography color='#f50057'>{person[0].looks}</Typography>
                          {renderStatIcon('smart')} <Typography color='#f50057'>{person[0].smart}</Typography>
                          {renderStatIcon('happiness')} <Typography color='#f50057'>{person[0].happiness}</Typography>
                          <Typography color='#f50057'>Rp. {person[0].balance.toLocaleString('id-ID')}</Typography>
                        </div>
                      ) : (
                        <>
                          <Typography color='#f50057'>Health: {person[0].health}</Typography>
                          <Typography color='#f50057'>Looks: {person[0].looks}</Typography>
                          <Typography color='#f50057'>Smart: {person[0].smart}</Typography>
                          <Typography color='#f50057'>Happiness: {person[0].happiness}</Typography>
                          <Typography color='#f50057'>Balance: Rp. {person[0].balance.toLocaleString('id-ID')}</Typography>
                        </>
                      )}
                      </>
                ) : (
                    <Typography color='#f50057'>No data available</Typography>
                  )}
                </div>

                <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', height:'250px', overflowY: 'auto', backgroundColor: 'white', borderRadius: '14px', padding: '10px' }}>
                        {person.length > 0 ? (
                        <Typography textAlign={'left'} variant='h7' style={{ background: 'linear-gradient(to right, red, purple)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            [System]: Welcome {person[0].name}. This is your first day as an {person[0].oshi} fan. You will got Rp. 25.000 per day as your daily balance. Spend it wisely!
                        </Typography>
                            
                        ):
                        (
                            <small style={{color:'#f50057'}}>
                                Loading...
                            </small>
                        )}
                </div>

                <Grid container spacing={2} justifyContent="center" style={{ marginTop: '20px', marginBottom:'20px', fontSize: { xs: '10px', sm: '12px', md: '14px', lg: '16px' } }}>
                    <Grid item xs={6} sm={6} md={4} lg={3}>
                        <Button fullWidth variant='outlined' color='error' onClick={() => nextDay()}>Next Day</Button>
                    </Grid>            
                    <Grid item xs={6} sm={6} md={4} lg={3}>
                        <Button fullWidth variant='outlined' color='error' onClick={() => updatePersonColumn(1, 'day', person[0].day + 1)}>ADD</Button>
                    </Grid>            
                    <Grid item xs={6} sm={6} md={4} lg={3}>
                        <Button fullWidth variant='outlined' color='error' onClick={() => navigate('/')}>Phone</Button>
                    </Grid>            
                </Grid>

                <Button fullWidth variant='outlined' color='error' style={{ marginTop: '30px' }} onClick={() => navigate('/')}>HOME</Button>
            </Container>
            <FooterApp/>

            <Modal
                open={open}
                onClose={() => {}}
                disableEscapeKeyDown
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 300,
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                }}
                >
                <Typography id="modal-title" variant="h6" component="h2" color='#f50057'>
                    Welcome!
                </Typography>
                <Typography color='#f50057' id="modal-description" sx={{ mt: 2, mb: 2 }}>
                    Please enter your name to continue.
                </Typography>
                <TextField
                    label="Name"
                    fullWidth
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    color='error'
                    style={{ marginBottom: '10px' }}
                />
                <FormControl fullWidth variant='filled'>
                 <InputLabel id="member-select-label" sx={{ fontSize: { xs: '10px', sm: '12px', md: '14px', lg: '16px' } }}>Oshi</InputLabel>
                <Select
                        labelId="member-select-label"
                        value={oshi}
                        onChange={(event) => {
                            const {
                                target: { value },
                            } = event;
                            setOshi(value);
                            setOshiObject(searchMemberDataByAlias(value));
                        }}
                      
                        MenuProps={{
                            PaperProps: {
                            style: {
                                maxHeight: 48 * 4.5 + 8,
                                width: 250,
                            },
                            },
                        }}
                        >
                        {members.sort((a, b) => a.alias.localeCompare(b.alias)).map((member) => (
                            <MenuItem key={member.name} value={member.alias}>

                            <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar src={member.picture} alt={member.alias} />
                                <p style={{ marginLeft: '10px' }}>{member.alias}</p>
                                </div>
                            </div>

                            </MenuItem>
                        ))}
                        </Select>
                
                <Button
                    variant="contained"
                    sx={{ mt: 2 }}
                    onClick={handleSave}
                    fullWidth
                    color='secondary'
                >
                    Save
                </Button>
                </FormControl>
                </Box>
            </Modal>
        </div>
    );
}

export default Logs;