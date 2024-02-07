import React, { useState } from 'react';
import IlkModal from './IlkModal';
import IkinciModal from './IkinciModal';

const AnaBilesen = ({onClose, onKartEkle}) => {
  const [ilkModalGorunur, setIlkModalGorunur] = useState(true);
  const [ikinciModalGorunur, setIkinciModalGorunur] = useState(false);
  const [girilenBilgi, setGirilenBilgi] = useState('');

  const handleIlkModalSubmit = (bilgi) => {
    // İlk modal submit işlemi sonrasında ikinci modalı aç
    setGirilenBilgi(bilgi);
    setIlkModalGorunur(false);
    setIkinciModalGorunur(true);
  };

  const handleIkinciModalClose = () => {
    // İkinci modal kapatıldığında durumu sıfırla
    setIkinciModalGorunur(false);
    setIlkModalGorunur(true);
  };

  const handleClose = () => {
    setIkinciModalGorunur(false);
    setIlkModalGorunur(false);
    onClose();
  };

  return (
    <div>
      {ilkModalGorunur && (
        <IlkModal
          onIlkModalSubmit={handleIlkModalSubmit}
          onIlkModalClose={() => setIlkModalGorunur(false)}
          onClose={handleClose}
        />
      )}

      {ikinciModalGorunur && (
        <IkinciModal
          ilkModalBilgi={girilenBilgi}
          onIkinciModalClose={handleIkinciModalClose}
          onClose={handleClose}
          onKartEkle={onKartEkle}
        />
      )}
    </div>
  );
};

export default AnaBilesen;
