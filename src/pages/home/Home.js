import './Home.css';
import React, { Suspense, lazy } from 'react';
import Loader from '../../componentes/Loader/Loader';

import Navbar1 from '../../componentes/Navbar/Navbar1';
import Footer from '../../componentes/Footer/Footer';

const Page1 = lazy(() => import('../Page1/Page1'));

function Home() {
  return (
    <div className="homeAll">
      <nav>
        <Navbar1/>
      </nav>

        <section className='container mx-auto'>
          <Suspense fallback={<Loader />}>
            <Page1/>
          </Suspense>
        </section>

        {/* <section className='container mx-auto'>
          <Page1/>
        </section>
        <section className='container mx-auto'>
          <Page1/>
        </section>
        <section className='container mx-auto'>
          <Page1/>
        </section> */}
        
        <Footer />
    </div>
  );
}

export default Home;
