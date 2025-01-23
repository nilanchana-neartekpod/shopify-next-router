import Header from './Header';
import Subscribe from './Subscribe'
import Footer from './Footer';

export default function Layout({ children }) {
    return (
      <>
        <Header />
            <>{children}</>
            <Subscribe></Subscribe>
        <Footer/>
      </>
    )
}