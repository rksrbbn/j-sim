import React, { useState, useEffect, useRef } from 'react';
import './index.css';
import { Container, Divider } from '@mui/material';
import HeaderApp from '../../components/HeaderApp';
import FooterApp from '../../components/FooterApp';
import { useNavigate } from 'react-router-dom';
import { Button, Typography } from '@mui/material';
import { members } from '../../membersData';
import { addHistory } from '../../db';

const Roulette = () => {
  const navigate = useNavigate();

  const [number, setNumber] = useState(0);
  const [pickNumber, setPickNumber] = useState(0);
  const [isPicking, setIsPicking] = useState(false);

  const intervalRef = useRef(null);
  const latestNumberRef = useRef(number);

  // const [intervalId, setIntervalId] = useState(null);
  const [lineup, setLineup] = useState([]);

//   set linup dengan 16 member acak dari data members masukkan property alias saja ke dalam lineup
  useEffect(() => {
    const shuffledMembers = members.sort(() => 0.5 - Math.random());
    setLineup(shuffledMembers.slice(0, 16).map(member => member.alias));
  }, []);

  // Fungsi untuk menghasilkan angka acak antara 1 dan 130
  const getRandomNumber = (totalNum=130) => {
    return Math.floor(Math.random() * totalNum) + 1;
  };

  // Fungsi untuk memulai animasi angka acak
  // const startRandomNumber = () => {
  //   const id = setInterval(() => {
  //     setNumber(getRandomNumber(130));
  //   }, 100); // Ubah angka setiap 100ms
  //   setIntervalId(id);
  // };

  const startRandomNumber = () => {
    intervalRef.current = setInterval(() => {
      const newNumber = getRandomNumber(130);
      latestNumberRef.current = newNumber;
      setNumber(newNumber);
    }, 100); // Ubah angka setiap 100ms
  };

  // Fungsi untuk menghentikan animasi dan menampilkan angka yang dipilih
  // const stopRandomNumber = () => {
  //   clearInterval(intervalId);
  //   setPickNumber(number);
  //   setIsPicking(false);
  // };

  const stopRandomNumber = () => {
    clearInterval(intervalRef.current);
    setPickNumber(latestNumberRef.current);
    setIsPicking(false);
  };

  const handleButtonClick = () => {
    if (!isPicking) {
      setIsPicking(true);
      startRandomNumber();
    } else {
      stopRandomNumber();
    }
  };

//   handleReset
  const handleReset = () => {
    setNumber(0);
    setPickNumber(0);
    setIsPicking(false);
    setWinner([]);
    setRouletteResult([]);
    setMemberRoulette('');
    setRNum(0);
    setIsPickRNum(false);
    const shuffledMembers = members.sort(() => 0.5 - Math.random());
    setLineup(shuffledMembers.slice(0, 16).map(member => member.alias));
  }

  const [winner, setWinner] = useState([]);

  const handleWinner = () => {
    const winners = new Set();
    const interval = setInterval(() => {
      const newNumber = getRandomNumber(130);
      if (!winners.has(newNumber)) {
        winners.add(newNumber);
        setWinner(Array.from(winners));
      }
      if (winners.size >= 48) {
        clearInterval(interval);
      }
    }, 100); // Tambahkan angka setiap 100ms
  }

  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [winner]);
  
  const [rNum, setRNum] = useState(0);
  const [isPickRNum, setIsPickRNum] = useState(false);

//   [{id: 1, name: 'Member 1', winners: []}, {id: 2, name: 'Member 2', winners: []}, {id: 3, name: 'Member 3', winners: []}]
  const [rouletteResult, setRouletteResult] = useState([]);
  const [memberRoulette, setMemberRoulette] = useState('');

  const handleRNum = () => {
    setWinner([]);
    setIsPickRNum(true);
    const newRNum = getRandomNumber(48);
    setRNum(newRNum);
  }

  const handleRouletteMember = () => {
    // Menyimpan member dan nomor yang sudah dipilih
    let remainingMembers = [...lineup];
    let remainingNumbers = Array.from({ length: 48 }, (_, i) => i + 1);

    let index = 0;
    const interval = setInterval(() => {
      if (index < 16) { // 16 adalah jumlah member pada lineup
        // Pilih 3 nomor acak dari nomor yang tersisa
        const randomNumbers = remainingNumbers.sort(() => 0.5 - Math.random()).slice(0, 3);
        remainingNumbers = remainingNumbers.filter(num => !randomNumbers.includes(num));

        // Pilih 1 member acak dari member yang tersisa
        const randomMemberIndex = Math.floor(Math.random() * remainingMembers.length);
        const randomMember = remainingMembers[randomMemberIndex];
        remainingMembers.splice(randomMemberIndex, 1); // Hapus member yang sudah dipilih

        if (randomNumbers.includes(rNum)) {
          addHistory({ memberName: randomMember, timestamp: new Date().toISOString() });
          setMemberRoulette(randomMember);
        }
        // Tambahkan hasil roulette ke state
        setRouletteResult(prevResults => [...prevResults, { name: randomMember, winners: randomNumbers }]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 100); // Menambahkan data rouletteResult setiap 100ms
  }

  return (
    <div className='container' style={{ backgroundColor: '#FDECEF', minHeight: '100vh', marginTop: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <HeaderApp />
        <Container className="App" maxWidth="sm" style={{ textAlign: 'center' }}>
        <p style={{ textDecoration: 'underline', cursor: 'pointer', color: '#f50057', fontSize: '12px', textAlign: 'left' }} onClick={() => navigate('/')}>Back to Home</p>

            <Typography variant='h6' style={{ background: 'linear-gradient(to right, red, purple)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>Current Lineup</Typography>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }}>
                <small style={{ background: 'linear-gradient(to right, red, purple)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{lineup.join(', ')}</small>
            </div>


            <Typography variant="h4" style={{color:'#f50057'}}>{number}</Typography>
            {pickNumber === 0 && (
            <Button color='error' onClick={handleButtonClick}>
                {isPicking ? 'Stop Number' : 'Pick Number'}
            </Button>
            )}
            {pickNumber !== 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <small style={{color:'#f50057'}}>Your Queue Number is {pickNumber}!</small>
                    {/* <Button onClick={() => {
                        handleReset();
                    }}>
                        Reset
                    </Button> */}

                    <div style={{ marginTop: '20px', marginBottom: '20px' }}>
                        {winner.length > 0 && (
                            <>
                                <Typography style={{ color: '#f50057', marginTop: '10px' }}>Winners List</Typography>
                                <Divider />
                            </>
                        )}
                        {winner.length === 0 && !isPickRNum ? (
                            <Button onClick={handleWinner} fullWidth variant='contained' color='error'>Start Pick Random Winner</Button>
                        ) : null}
                        {winner.length === 0 && isPickRNum ? (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Typography style={{ color: '#f50057' }}>Your Roulette Number is {rNum}</Typography>
                                {rouletteResult.length === 0 ? (
                                    <Button variant='outlined' color='error' onClick={handleRouletteMember}>Start Roulette Member</Button>
                                ) : null}
                            </div>
                        ) : null}
                    </div>

                    {winner.length > 0 && (
                        <div 
                        className="scroll-container"
                        ref={containerRef}
                        style={{ display: 'flex', width: '100%', flexDirection: 'column', alignItems: 'center', maxHeight: '200px', overflowY: 'auto', backgroundColor: '#fff', padding: '10px', borderRadius: '10px' }}>
                            {winner.map((win, index) => (
                                <small key={index} style={{color: win === pickNumber ? 'gold' : '#f50057', fontWeight: win === pickNumber ? 'bold' : 'normal'}}>
                                    {index + 1}. Number {win} Won a Roulette!
                                </small>
                            ))}
                        </div>
                    )}

                    {rouletteResult.length > 0 && (
                        <div 
                        className="scroll-container"
                        ref={containerRef}
                        style={{ display: 'flex', width: '100%', flexDirection: 'column', alignItems: 'center', maxHeight: '200px', overflowY: 'auto', backgroundColor: '#fff', padding: '10px', borderRadius: '10px' }}>
                            {rouletteResult.map((result, index) => (
                                <small key={index} style={{color: result.winners.includes(rNum) ? 'gold' : '#f50057', fontWeight: result.winners.includes(rNum) ? 'bold' : 'normal'}}>
                                    {index + 1}. [{result.winners.join(',')}] Got {result.name}
                                </small>
                            ))}
                        </div>
                    )}

                    {rouletteResult.length >= 16 && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
                            <small style={{color: '#f50057'}}>Roulette is Finished. You got {memberRoulette}.</small>
                            <Button fullWidth variant='outlined' color='error' onClick={handleReset} style={{marginTop: '10px'}}>Try Again</Button>
                            <Button fullWidth variant='outlined' color='error' onClick={() => navigate('/gallery')} style={{marginTop: '10px'}}>Roulette Gallery</Button>
                        </div>
                    )}

                    

                    {/* {winner.length >= 48 && (
                        <Button onClick={() => setWinner([])}>Reset Winner</Button>
                    )} */}

                    {/* Jika pickNumber tidak ada di dalam winner tampilkan pesan "You Don't Won a Roulette" */}
                    {pickNumber !== 0 && winner.length >= 48 && !winner.includes(pickNumber) ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
                            <small style={{color:'#f50057'}}>Sorry, You didn't win the roulette!</small>
                            <Button variant='outlined' color='error' style={{marginTop: '10px'}} onClick={handleReset}>Try Again</Button>
                        </div>
                    ) : pickNumber !== 0 && winner.length >= 48 && winner.includes(pickNumber) ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
                            <small style={{color:'#f50057'}}>You have Win a Roulette!</small>
                            <Button variant='outlined'  color='error' onClick={handleRNum} style={{marginTop: '10px'}}>Get Your Roulette Number</Button>
                        </div>
                    ) : null}
                </div>
                
            )}

        </Container>
        <FooterApp />
    </div>
  );
};

export default Roulette;
