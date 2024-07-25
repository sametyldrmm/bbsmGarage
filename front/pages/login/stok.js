import React, { useEffect, useState } from 'react'; 
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useLoading } from '../_app';
import withAuth from '../../withAuth';
import { useAuth } from '../../auth-context';

export default function stok() {
    const { fetchWithAuth } = useAuth();
    const { loading, setLoading } = useLoading();
    const [isOpen, setIsOpen] = useState(false);
    const [stokAdi, setStokAdi] = useState('');
    const [adet, setAdet] = useState('');
    const [eklenisTarihi, setEklenisTarihi] = useState('');
    const [info, setInfo] = useState('');
    const [stokListesi, setStokListesi] = useState([]);
    const [filteredStokListesi, setFilteredStokListesi] = useState([]);
    const [selectedStok, setSelectedStok] = useState([]);
    const [allChecked, setAllChecked] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    const handleChange = (e, setter) => {
        const { value } = e.target;
        setter(capitalizeFirstLetter(value));
    };
    const capitalizeWords = (string) => {
      return string.split(' ').map(word => {
        return word.charAt(0).toLocaleUpperCase('tr-TR') + word.slice(1).toLocaleLowerCase('tr-TR');
      }).join(' ');
    };
    

    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
    
    const fetchStokListesi = async () => {
      setLoading(true);
      try {
          const response = await fetchWithAuth("http://13.60.28.234:4000/stok", {
              method: 'GET',
          });
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          if (Array.isArray(data)) {
              setStokListesi(data);
              setFilteredStokListesi(data);
          }
      } catch (error) {
          console.error('Veri getirme hatası:', error);
      }
      setLoading(false);
  };

      useEffect(() => {
          fetchStokListesi();
      }, []);

      const handleSubmit = async (e) => {
        setLoading(true);
          e.preventDefault();
          const yeniStok = {
              "stokAdi": stokAdi,
              "adet": adet,
              "eklenisTarihi": eklenisTarihi,
              "info": info
          };

          try {
              const response = await fetchWithAuth('http://13.60.28.234:4000/stok', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(yeniStok),
              });

              if (!response.ok) {
                  throw new Error(`HTTP error! status: ${response.status}`);
              }

              // Formu sıfırla
              setStokAdi('');
              setAdet('');
              setEklenisTarihi('');
              setInfo('');

              // Stok listesini yeniden fetch et
              fetchStokListesi();
          } catch (error) {
              console.error('Stok ekleme hatası', error);
          }
          setLoading(false);
      };
      
    const handleClearItems = async () => {
      setLoading(true);
      try {
        // Seçilen her bir stok ID'si için ayrı bir DELETE isteği gönder
        const deleteRequests = selectedStok.map(id =>
          fetchWithAuth(`http://13.60.28.234:4000/stok/${id}`, { method: 'DELETE' })
        );
        await Promise.all(deleteRequests);
    
        // UI'dan silinen öğeleri kaldır
        const updatedStokListesi = stokListesi.filter(stok => !selectedStok.includes(stok.id));
        setStokListesi(updatedStokListesi);
        setFilteredStokListesi(updatedStokListesi);
        setSelectedStok([]); // Seçimleri sıfırla
      } catch (error) {
        console.error('Silme işlemi sırasında hata oluştu', error);
      }
      setLoading(false);
    };

    const toggleMenu = () => {
        setIsOpen(prevIsOpen => !prevIsOpen);
      };

    const handleCheckboxChange = (e, id) => {
      if (e.target.checked) {
        setSelectedStok([...selectedStok, id]);
      } else {
        setSelectedStok(selectedStok.filter(stokId => stokId !== id));
      }
    };

    const handleAllChecked = (e) => {
      setAllChecked(e.target.checked);
      setSelectedStok(e.target.checked ? stokListesi.map(stok => stok.id) : []);
    };

    const handleSearch = (e) => {
      const term = e.target.value.toLowerCase();
      setSearchTerm(term);
      setFilteredStokListesi(stokListesi.filter(stok => stok.stokAdi.toLowerCase().includes(term) || stok.info.toLowerCase().includes(term)));
    };
    
  
    return (
      <>
        <Head>
          <title>BBSM Garage - Stok Takibi</title>
          <link rel="icon" href="/BBSM.ico" /> {"/public/BBSM.ico"}
        </Head>

        <aside className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} bg-white border-r border-gray-200 lg:translate-x-0`} aria-label="Sidebar">
          <div className="h-full px-4 pt-6 pb-4 text-center overflow-y-auto bg-my-beyaz">
            <ul className="space-y-4">
              <li>
                <Link href="/login/kartlar" className="block p-2 font-medium text-md text-my-açıkgri focus:border-2 focus:border-my-açıkgri focus:font-bold focus:text-my-4b4b4bgri bg-my-ebbeyaz rounded-xl hover:text-my-beyaz hover:bg-my-siyah group">Kartlar</Link>
              </li>
              <li>
                <Link href="/login/teklif" className="block p-2 font-medium text-md text-my-açıkgri focus:border-2 focus:border-my-açıkgri focus:font-bold focus:text-my-4b4b4bgri bg-my-ebbeyaz rounded-xl hover:text-my-beyaz hover:bg-my-siyah group">Teklif</Link>
              </li>
              <li>
                <Link href="/login/stok" className="block p-2 f text-md border-2 border-my-açıkgri font-bold text-my-4b4b4bgri bg-my-ebbeyaz rounded-xl hover:text-my-beyaz hover:bg-my-siyah group">Stok Takibi</Link>
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
                  <button onClick={toggleMenu} className={`lg:hidden p-3 font-bold text-lg leading-tight antialiased ${isOpen && 'hidden'}`}><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"></path></svg></button>
                  <a href="#" className="flex ml-2 md:mr-8 lg:mr-24">
                  <img src="/images/BBSMlogo.webp" className="h-8 mr-3" alt="logo" />
                  <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap text-my-siyah">BBSM GARAGE</span>
                  </a>
                </div>
                <div className="flex items-center">
                  <button type="button" className="flex items-center text-sm"><span className="sr-only">Open user menu</span><p className="text-center text-my-siyah font-semibold items-center pr-8">Yasin Ufuk ORHANLAR</p><img src="/images/yasin.webp" className="h-16 w-16 rounded-full" alt="Yasin Bey" /></button>
                </div>
              </div>
            </div>
          </nav>

          <div className="p-6 pt-8 lg:ml-64 ">
            <div className="p-6 mt-20 bg-my-beyaz rounded-3xl">
              <div className="flex items-center pb-4">
                <p className="font-bold text-xl text-my-siyah">Stok Ekle</p>
              </div>
              <form onSubmit={handleSubmit} className="p-2">
                <div className="grid gap-6 mb-4 md:grid-cols-3">
                  <div>
                    <label htmlFor="text" className="block mb-2 text-sm font-medium text-gray-900">Stok Adı</label>
                    <input type="text" id="text" className="bg-my-beyaz border border-gray-300 text-gray 900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Stok Adı Giriniz" value={stokAdi} onChange={(e) => handleChange(e, setStokAdi)} required/>
                  </div>
                  <div>
                      <label htmlFor="number" className="block mb-2 text-sm font-medium text-gray-900 ">Adet</label>
                      <input type="number" id="text" className="bg-my-beyaz border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Adet Giriniz" pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}" value={adet}  onChange={(e) => handleChange(e, setAdet)} required/>
                  </div>
                  <div>
                      <label htmlFor="date" className="block mb-2 text-sm font-medium text-gray-900 ">Ekleniş Tarihi</label>
                      <input type="date" id="text" className="bg-my-beyaz border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Ekleniş Tarihi Giriniz" value={eklenisTarihi}  onChange={(e) => handleChange(e, setEklenisTarihi)} required/>
                  </div>
                </div>
                <div className="mb-6">
                    <label htmlFor="text" className="block mb-2 text-sm font-medium text-gray-900">Açıklama</label>
                    <input type="text" id="text" className="bg-my-beyaz border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="Açıklama Giriniz ..." value={info}  onChange={(e) => handleChange(e, setInfo)} required/>
                </div>
                <div className="flex justify-end">
                    <button type="submit" className="text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm w-full sm:w-auto px-5 py-2.5 text-center">Ekle</button>
                </div>
                
            </form>

            </div>
          </div>
          
          <div className="p-6 lg:ml-64 ">
            <div className="p-6 bg-my-beyaz rounded-3xl">
              <div className="flex items-center pb-4 justify-between">
                
                <div className="flex items-center">
                  <div className="pr-4 items-center ">
                    <div className="flex flex-column sm:flex-row flex-wrap items-center justify-between ">
                      <p className="font-bold text-xl text-my-siyah">Stoklarım</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="items-center bg-red-600 p-2 pl-4 pr-4 rounded-full ml-4">
                    <button onClick={handleClearItems} href="" className="font-semibold text-my-beyaz text-md">Seçilenleri Sil</button>
                  </div>

                  <div className="pr-4 items-center pl-4">
                    <div className="flex flex-column sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between">
                      <label htmlFor="table-search" className="sr-only">Search</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 rtl:inset-r-0 rtl:right-0 flex items-center ps-3 pointer-events-none">
                          <svg className="w-5 h-5 text-gray-500 " aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path></svg>
                        </div>
                        <input type="text" id="table-search" className="block p-2 ps-10 text-md text-gray-900 border border-gray-300 rounded-full w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500" placeholder="Search for items" value={searchTerm} onChange={handleSearch}/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <table className="w-full text-sm text-left text-gray-500 font-medium">
                <thead className="text-xs text-gray-600 uppercase bg-my-edbeyaz">
                  <tr>
                    <th scope="col" className="p-4">
                      <div className="flex items-center">
                        <input  type="checkbox" className="w-4 h-4 bg-white border-white text-my-beyaz" checked={allChecked} onChange={handleAllChecked}/>
                          <label htmlFor="checkbox-all-search" className="sr-only">checkbox</label>
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Stok Adı
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Ekleniş Tarihi
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Adet
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Açıklama
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStokListesi.map((stok, index) => (
                    <tr key={stok.id || index}>
                      <td className="w-4 p-4">
                        <div className="flex items-center">
                          <input type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" checked={selectedStok.includes(stok.id)}  onChange={(e) => handleCheckboxChange(e, stok.id)}/>
                          <label htmlFor={`checkbox-table-${index}`} className="sr-only">checkbox</label>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        {capitalizeWords(stok.stokAdi)}
                      </td>
                      <td className="px-6 py-4">
                        {new Date(stok.eklenisTarihi).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-green-500">
                        {stok.adet}
                      </td>
                      <td className="px-6 py-4 uppercase">
                      <textarea
                        readOnly
                        value={stok.info}
                        className="bg-white text-gray-900 text-sm rounded-lg block w-full p-2.5 overflow"
                        style={{ maxHeight: '120px' }}
                      />
                      </td>
                    </tr>
                  ))}
                </tbody>

                
              </table>
             
            </div>
          </div>
        </div>
      
    </>
  );
}
