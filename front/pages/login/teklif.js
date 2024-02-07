import { useState } from 'react';
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

export default function teklif() {
    const [isOpen, setIsOpen] = useState(false);
  
    const toggleMenu = () => {
      setIsOpen(prevIsOpen => !prevIsOpen);
    };
  
    return (
      <>
        <Head>
          <title>ESES Garage - Teklifler</title>
          <link rel="icon" href="/ESES.ico" /> {"/public/ESES.ico"}
        </Head>

        <aside className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} bg-white border-r border-gray-200 lg:translate-x-0`} aria-label="Sidebar">
          <div className="h-full px-4 pt-6 pb-4 text-center overflow-y-auto bg-my-beyaz">
            <ul className="space-y-4">
              <li>
                <Link href="/login/kartlar" className="block p-2 font-medium text-md text-my-açıkgri focus:border-2 focus:border-my-açıkgri focus:font-bold focus:text-my-4b4b4bgri bg-my-ebbeyaz rounded-xl hover:text-my-beyaz hover:bg-my-siyah group">Kartlar</Link>
              </li>
              <li>
                <Link href="/login/teklif" className="block p-2 f text-md border-2 border-my-açıkgri font-bold text-my-4b4b4bgri bg-my-ebbeyaz rounded-xl hover:text-my-beyaz hover:bg-my-siyah group">Teklif</Link>
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
                  <button onClick={toggleMenu} className={`lg:hidden p-3 font-bold text-lg leading-tight antialiased ${isOpen && 'hidden'}`}><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"></path></svg></button>
                  <a href="#" className="flex ml-2 md:mr-8 lg:mr-24">
                  <img src="/images/ESESlogo.webp" className="h-8 mr-3" alt="logo" />
                  <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap text-my-siyah">ESES GARAGE</span>
                  </a>
                </div>
                <div className="flex items-center">
                  <button type="button" className="flex items-center text-sm"><span className="sr-only">Open user menu</span><p className="text-center text-my-siyah font-semibold items-center pr-8">Yasin Ufuk ORHANLAR</p><img src="/images/yasin.png" className="h-16 w-16 rounded-full" alt="Yasin Bey" /></button>
                </div>
              </div>
            </div>
          </nav>
          
          <div className="p-6 pt-8 lg:ml-64 ">
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
                    <Link href="" className="font-semibold text-my-beyaz text-md">Seçilenleri Sil</Link>
                  </div>
                  <div className="items-center bg-green-500 p-2 pl-4 pr-4 rounded-full ml-4">
                    <Link href="" className="font-semibold text-my-beyaz text-md">Seçilenleri İndir</Link>
                  </div>
                  <div className="items-center bg-my-mavi p-2 pl-4 pr-4 rounded-full ml-4">
                    <Link href="" className="font-semibold text-my-beyaz text-md">Yeni Teklif Ekle</Link>
                  </div>

                  <div className="pr-4 items-center pl-4">
                    <div className="flex flex-column sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between">
                      <label htmlFor="table-search" className="sr-only">Search</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 rtl:inset-r-0 rtl:right-0 flex items-center ps-3 pointer-events-none">
                          <svg className="w-5 h-5 text-gray-500 " aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path></svg>
                        </div>
                        <input type="text" id="table-search" className="block p-2 ps-10 text-md text-gray-900 border border-gray-300 rounded-full w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500" placeholder="Search for items"/>
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
                        <input id="checkbox-all-search" type="checkbox" className="w-4 h-4 bg-white border-white text-my-beyaz "/>
                          <label htmlFor="checkbox-all-search" className="sr-only">checkbox</label>
                      </div>
                    </th>
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
                      Şasİ No
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Giriş Tarihi
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Kartlara Ekle
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Görüntüle
                    </th>
                    <th scope="col" className="px-6 py-3">
                      İndİr
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="w-4 p-4">
                      <div className="flex items-center">
                        <input id="checkbox-table-search-3" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 "/>
                        <label htmlFor="checkbox-table-search-3" className="sr-only">checkbox</label>
                      </div>
                    </td>
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                      Bilal Orhanlar
                    </th>
                    <td className="px-6 py-4">
                      VW golf
                    </td>
                    <td className="px-6 py-4 text-green-500">
                      34 HB 843 
                    </td>
                    <td className="px-6 py-4 uppercase">
                      sfsa395sd3fsfa2
                    </td>
                    <td className="px-6 py-4 text-blue-500">
                      14.08.2022
                    </td>
                    <td className="px-6 py-4">
                      <a href="#" className="bg-blue-500 p-2 pl-4 pr-4 rounded-full font-medium text-my-beyaz hover:underline">Ekle</a>
                    </td>
                    <td className="px-6 py-4">
                      <a href="#" className="bg-yellow-500 p-2 pl-4 pr-4 rounded-full font-medium text-my-siyah hover:underline">Detay</a>
                    </td>
                    <td className="px-6 py-4">
                      <a href="#" className="bg-green-500 p-2 pl-4 pr-4 rounded-full font-medium text-my-beyaz  hover:underline">Excel</a>
                    </td>
                  </tr>
                  
                  
                </tbody>
                
              </table>
            </div>
          </div>
        </div>
        

        
      

    </>
  );
}

