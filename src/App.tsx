import { useState, useRef } from 'react';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Hero from './components/Hero';
import MenuSection from './components/MenuSection';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import OrderSuccess from './components/OrderSuccess';

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const homeRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (section: string) => {
    const refs = {
      home: homeRef,
      menu: menuRef,
      about: aboutRef,
      contact: contactRef
    };

    const targetRef = refs[section as keyof typeof refs];
    if (targetRef?.current) {
      const offset = 80;
      const elementPosition = targetRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderSuccess = (orderNum: string) => {
    setOrderNumber(orderNum);
    setIsCheckoutOpen(false);
    setIsSuccessOpen(true);
  };

  const handleSuccessClose = () => {
    setIsSuccessOpen(false);
    scrollToSection('home');
  };

  return (
    <CartProvider>
      <div className="min-h-screen bg-[#1A1A1A]">
        <Header onCartClick={() => setIsCartOpen(true)} onMenuClick={scrollToSection} />

        <main>
          <div ref={homeRef}>
            <Hero onOrderClick={() => scrollToSection('menu')} onCartClick={() => setIsCartOpen(true)} />
          </div>

          <div ref={menuRef}>
            <MenuSection />
          </div>

          <div ref={aboutRef}>
            <About />
          </div>

          <div ref={contactRef}>
            <Contact />
          </div>
        </main>

        <Footer />

        <Cart
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          onCheckout={handleCheckout}
          onMenuClick={() => {
            setIsCartOpen(false);
            setTimeout(() => scrollToSection('menu'), 100);
          }}
        />

        <Checkout
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          onSuccess={handleOrderSuccess}
        />

        <OrderSuccess
          isOpen={isSuccessOpen}
          orderNumber={orderNumber}
          onClose={handleSuccessClose}
        />
      </div>
    </CartProvider>
  );
}

export default App;
