import { ReactNode } from "react";
import styles from '@/app/page.module.css';

type Prop = { children : ReactNode, modal : ReactNode };

const Layout = ({children, modal}: Prop) => {
  return ( 
    <div className={styles.container}>
      {children}
      {modal}
    </div>
  );
}

export default Layout;