import React, { useState } from 'react';
import IlkModal from './IlkModal';
import IkinciModal from './IkinciModal';

const AnaBilesen = ({ onClose, onKartEkle, onTeklifEkle }) => {
  const [ilkModalGorunur, setIlkModalGorunur] = useState(true);
  const [ikinciModalGorunur, setIkinciModalGorunur] = useState(false);
  const [girilenBilgi, setGirilenBilgi] = useState('');

  const handleIlkModalSubmit = (bilgi) => {
    setGirilenBilgi(bilgi);
    setIlkModalGorunur(false);
    setIkinciModalGorunur(true);
  };

  const handleIkinciModalClose = () => {
    setIkinciModalGorunur(false);
    setIlkModalGorunur(true);
  };

  const handleClose = () => {
    setIkinciModalGorunur(false);
    setIlkModalGorunur(false);
    onClose();
  };

  const handleKartEkle = (yeniKart) => {
    const km = parseInt(yeniKart.km, 10) || 0;
    const modelYili = parseInt(yeniKart.modelYili, 10) || 0;

    const kart = {
      ...yeniKart,
      km,
      modelYili
    };

    onKartEkle(kart);
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
          onKartEkle={handleKartEkle}
          onTeklifEkle={onTeklifEkle}
        />
      )}
    </div>
  );
};

export default AnaBilesen;
