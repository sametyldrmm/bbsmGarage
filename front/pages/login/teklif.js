import React, { useState, useEffect } from 'react';
import Head from "next/head";
import Link from "next/link";
import { useLoading } from '../_app';
import withAuth from '../../withAuth';
import { useAuth } from '../../auth-context';

export default function Teklif() {
  const { fetchWithAuth } = useAuth();
  const { loading, setLoading } = useLoading();
  const [isOpen, setIsOpen] = useState(false);
  const [teklifler, setTeklifler] = useState([]);
  const [secilenTeklifler, setSecilenTeklifler] = useState([]);
  const [aramaTerimi, setAramaTerimi] = useState('');

  const DetailPage = (id) => {
    return (id ? `/login/teklifler/detayT?id=${id}` : '/login/teklif');
  };

  const capitalizeWords = (string) => {
    return string.split(' ').map(word => {
      return word.charAt(0).toLocaleUpperCase('tr-TR') + word.slice(1).toLocaleLowerCase('tr-TR');
    }).join(' ');
  };

  const toUpperCase = (string) => {
    return string.toUpperCase();
  };

  const toggleMenu = () => {
    setIsOpen(prevIsOpen => !prevIsOpen);
  };

  const fetchTeklifListesi = async () => {
    setLoading(true);
    try {
      const response = await fetchWithAuth("http://13.60.28.234:4000/teklif", {
        method: 'GET',
        redirect: 'follow'
      });
      const data = await response.json();
      if (Array.isArray(data)) {
        setTeklifler(data);
      }
    } catch (error) {
      console.log('error', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTeklifListesi();
  }, []);

  const handleCheckboxChange = (e, teklifId) => {
    if (e.target.checked) {
      setSecilenTeklifler([...secilenTeklifler, teklifId]);
    } else {
      setSecilenTeklifler(secilenTeklifler.filter(id => id !== teklifId));
    }
  };

  const silSecilenleri = async () => {
    setLoading(true);
    try {
      const deleteRequests = secilenTeklifler.map(teklifId =>
        fetchWithAuth(`http://13.60.28.234:4000/teklif/${teklifId}`, { method: 'DELETE' })
      );
      await Promise.all(deleteRequests);

      const guncellenmisTeklifler = teklifler.filter(teklif => !secilenTeklifler.includes(teklif.teklif_id));
      setTeklifler(guncellenmisTeklifler);
      setSecilenTeklifler([]);
    } catch (error) {
      console.error('Silme işlemi sırasında hata oluştu', error);
    }
    setLoading(false);
  };

  function formatKm(km) {
    return km.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  const handleTeklifEkle = async (teklif) => {
    setLoading(true);
    const updatedTeklif = {
      ...teklif,
      km: teklif.km ? parseInt(teklif.km, 10) : null,
      modelYili: teklif.modelYili ? parseInt(teklif.modelYili, 10) : null,
      adSoyad: teklif.adSoyad || "Tanımsız",
      markaModel: teklif.markaModel || "Tanımsız",
      plaka: teklif.plaka || "Tanımsız",
      sasi: teklif.sasi || "Tanımsız",
      girisTarihi: teklif.girisTarihi || "Tanımsız",
      yapilanlar: teklif.yapilanlar || [],
    };

    console.log("teklif ekle teklif");
    try {
      const [deleteResponse] = await Promise.all([
        fetchWithAuth(`http://13.60.28.234:4000/teklif/${teklif.teklif_id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        })
      ]);

      // POST işlemi başarılı olup olmadığını kontrol et
      if (deleteResponse.ok)
      {
          console.log("delete teklif");
          const [postResponse] = await Promise.all([
            fetchWithAuth('http://13.60.28.234:4000/card', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(updatedTeklif),
            }),
          ]);

          if (postResponse.ok)
          {
            setTeklifler(teklifler.filter(t => t.teklif_id !== teklif.teklif_id));
          } 
          else 
          {
            console.error('Kart eklenirken bir hata oluştu');
          }
      } 
      else 
      {
        console.error('Teklif silinirken bir hata oluştu');
      }
    } catch (error) {
      console.error('İşlem sırasında bir hata oluştu:', error);
    }

    setLoading(false);
  };




  const filtrelenmisTeklifler = teklifler.filter(teklif => {
    const searchLower = aramaTerimi.toLowerCase();
    return (
      (teklif.adSoyad?.toLowerCase().includes(searchLower)) ||
      (teklif.markaModel?.toLowerCase().includes(searchLower)) ||
      (teklif.plaka?.toLowerCase().includes(searchLower)) ||
      (teklif.sasi?.toLowerCase().includes(searchLower)) ||
      (teklif.girisTarihi?.toString().includes(aramaTerimi))
    );
  });


  const handleExcelDownload = async (teklifId) => {
    setLoading(true);

    const teklif = teklifler.find(t => t.teklif_id === teklifId);

    if (!teklif) {
        console.error("Seçilen teklif bulunamadı");
        setLoading(false);
        return;
    }

    const dataToSend = {
        vehicleInfo: {
            adSoyad: teklif.adSoyad,
            telNo: teklif.telNo,
            markaModel: teklif.markaModel,
            plaka: teklif.plaka,
            km: teklif.km,
            modelYili: teklif.modelYili,
            sasi: teklif.sasi,
            renk: teklif.renk,
            girisTarihi: teklif.girisTarihi,
            notlar: teklif.notlar,
            adres: teklif.adres,
        },
        data: teklif.yapilanlar.map(item => ({
            birimAdedi: item.birimAdedi,
            parcaAdi: item.parcaAdi,
            birimFiyati: item.birimFiyati,
            toplamFiyat: item.birimFiyati * item.birimAdedi,
        })),
        notes: teklif.notlar
    };

    try {
        const response = await fetch('http://51.20.254.93:4020/api/excel/download', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSend),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'output.xlsx';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Excel download error:', error);

        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
            console.error('Response headers:', error.response.headers);
        } else if (error.request) {
            console.error('Request data:', error.request);
        } else {
            console.error('Error message:', error.message);
        }
        console.error('Error config:', error.config);
    }
    setLoading(false);
};

const secilenTeklifleriIndir = async () => {
  setLoading(true);

  if (secilenTeklifler.length === 0) {
      console.error("İndirilecek teklif bulunamadı");
      setLoading(false);
      return;
  }

  // Seçilen tüm teklifleri indir
  for (const teklifId of secilenTeklifler) {
      await handleExcelDownload(teklifId);
  }

  setLoading(false);
};

  return (
    <>
      <Head>
        <title>BBSM Garage - Teklifler</title>
        <link rel="icon" href="/BBSM.ico" />
      </Head>

      <aside className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} bg-white border-r border-gray-200 lg:translate-x-0`} aria-label="Sidebar">
        <div className="h-full px-4 pt-6 pb-4 text-center overflow-y-auto bg-my-beyaz">
          <ul className="space-y-4">
            <li>
              <Link href="/login/kartlar" className="block p-2 font-medium text-md text-my-açıkgri focus:border-2 focus:border-my-açıkgri focus:font-bold focus:text-my-4b4b4bgri bg-my-ebbeyaz rounded-xl hover:text-my-beyaz hover:bg-my-siyah group">Kartlar</Link>
            </li>
            <li>
              <Link href="/login/teklif" className="block p-2 text-md border-2 border-my-açıkgri font-bold text-my-4b4b4bgri bg-my-ebbeyaz rounded-xl hover:text-my-beyaz hover:bg-my-siyah group">Teklif</Link>
            </li>
            <li>
              <Link href="/login/stok" className="block p-2 font-medium text-md text-my-açıkgri focus:border-2 focus:border-my-açıkgri focus:font-bold focus:text-my-4b4b4bgri bg-my-ebbeyaz rounded-xl hover:text-my-beyaz hover:bg-my-siyah group">Stok Takibi</Link>
            </li>
            <li>
              <Link href="/login/bizeulasin" className="block p-2 font-medium text-md text-my-açıkgri focus:border-2 focus:border-my-açıkgri focus:font-bold focus:text-my-4b4b4bgri bg-my-ebbeyaz rounded-xl hover:text-my-beyaz hover:bg-my-siyah group">Bize Ulaşın</Link>
            </li>
            <div className="divider mt-10 mb-10"></div>
            <li>
              <Link href="/" className="block p-2 font-medium text-md text-my-açıkgri focus:border-2 focus:border-my-açıkgri focus:font-bold focus:text-my-4b4b4bgri bg-my-ebbeyaz rounded-xl hover:text-my-beyaz hover:bg-my-siyah group">Çıkış Yap</Link>
            </li>
          </ul>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200">
          <div className="px-3 py-3 lg:px-5 lg:pl-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button onClick={toggleMenu} className={`lg:hidden p-3 font-bold text-lg leading-tight antialiased ${isOpen ? 'hidden' : ''}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"></path>
                  </svg>
                </button>
                <a href="#" className="flex ml-2 md:mr-8 lg:mr-24">
                  <img src="/images/BBSMlogo.webp" className="h-8 mr-3" alt="logo" />
                  <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap text-my-siyah">BBSM GARAGE</span>
                </a>
              </div>
              <div className="flex items-center">
                <button type="button" className="flex items-center text-sm">
                  <span className="sr-only">Open user menu</span>
                  <p className="text-center text-my-siyah font-semibold items-center pr-8">Yasin Ufuk ORHANLAR</p>
                  <img src="/images/yasin.webp" className="h-16 w-16 rounded-full" alt="Yasin Bey" />
                </button>
              </div>
            </div>
          </div>
        </nav>

        <div className="p-6 pt-8 lg:ml-64">
          <div className="p-6 mt-20 bg-my-beyaz rounded-3xl">
            <div className="flex items-center pb-4 justify-between">
              <div className="flex items-center">
                <div className="pr-4 items-center ">
                  <div className="flex flex-column sm:flex-row flex-wrap items-center justify-between ">
                    <p className="font-bold text-xl text-my-siyah">Tekliflerim</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <div className="items-center bg-red-600 p-2 pl-4 pr-4 rounded-full ml-4">
                  <button onClick={silSecilenleri} className="font-semibold text-my-beyaz text-md">Seçilenleri Sil</button>
                </div>
                <div className="items-center bg-green-500 p-2 pl-4 pr-4 rounded-full ml-4">
                  <button onClick={secilenTeklifleriIndir} className="font-semibold text-my-beyaz text-md">Seçilenleri İndir</button>
                </div>

                <div className="pr-4 items-center pl-4">
                  <div className="flex flex-column sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between">
                    <label htmlFor="table-search" className="sr-only">Search</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 rtl:inset-r-0 rtl:right-0 flex items-center ps-3 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-500 " aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
                        </svg>
                      </div>
                      <input type="text" id="table-search"
                        className="block p-2 ps-10 text-md text-gray-900 border border-gray-300 rounded-full w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Teklifleri ara"
                        value={aramaTerimi}
                        onChange={(e) => setAramaTerimi(e.target.value)} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-auto h-140">
              <table className="w-full text-sm text-left text-gray-500 font-medium">
                <thead className="text-xs text-gray-600 uppercase bg-my-edbeyaz">
                  <tr>
                    <th scope="col" className="p-4"></th>
                    <th scope="col" className="px-6 py-3">
                      Ad-Soyad
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Marka-Model
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Plaka
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Km
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Şasİ No
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Giriş Tarihi
                    </th>
                    <th scope="col" className=" px-4 py-3">
                      Kartlara Ekle
                    </th>
                    <th scope="col" className="pl-5 px-4 py-3">
                      Görüntüle
                    </th>
                    <th scope="col" className="pl-10 px-4 py-3">
                      İndİr
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filtrelenmisTeklifler.map((teklif) => (
                    <tr key={teklif.teklif_id}>
                      <td className="w-4 p-4">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                            checked={secilenTeklifler.includes(teklif.teklif_id)}
                            onChange={(e) => handleCheckboxChange(e, teklif.teklif_id)}
                          />
                          <label htmlFor={`checkbox-table-${teklif.teklif_id}`} className="sr-only">checkbox</label>
                        </div>
                      </td>
                      <td className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap">
                        {capitalizeWords(teklif.adSoyad || "Tanımsız")}
                      </td>
                      <td className="px-6 py-2">
                        {(teklif.markaModel || "Tanımsız").length > 20 ? `${toUpperCase((teklif.markaModel || "Tanımsız").substring(0, 20))}...` : capitalizeWords(teklif.markaModel || "Tanımsız")}
                      </td>
                      <td className="px-6 py-2 text-green-500">
                        {toUpperCase(teklif.plaka || "Tanımsız")}
                      </td>
                      <td className="px-6 py-2">
                        {teklif.km !== undefined && teklif.km !== null ? formatKm(teklif.km) : "Tanımsız"}
                      </td>
                      <td className="px-6 py-2 uppercase">
                        {(teklif.sasi || "Tanımsız").length > 7 ? `${toUpperCase((teklif.sasi || "Tanımsız").substring(0, 7))}...` : toUpperCase(teklif.sasi || "Tanımsız")}
                      </td>
                      <td className="px-6 py-2 text-blue-500">
                        {teklif.girisTarihi || "Tanımsız"}
                      </td>
                      <td className="px-8 py-2">
                        <button onClick={() => handleTeklifEkle(teklif)} className="bg-blue-500 p-2 pl-6 pr-6 rounded-full font-medium text-my-beyaz hover:underline">Ekle</button>
                      </td>
                      <td className="px-6 py-2">
                        <a href={DetailPage(teklif.teklif_id)} className="bg-yellow-500 p-2 pl-4 pr-4 rounded-full font-medium text-my-siyah hover:underline">Detay</a>
                      </td>
                      <td className="px-6 py-2 ">
                          <button onClick={() => handleExcelDownload(teklif.teklif_id)} className="bg-green-500 p-2 pl-4 pr-4 rounded-full font-medium text-my-beyaz hover:underline">Excel</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
