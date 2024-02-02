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

// 주소가 localhost:3001일 때는 children-> page.tsx, modal->@modal/default.tsx
// 주소가 localhost:3001/i/flow/login 때는 children -> i/flow/login/page.tsx,  modal->@modal/i/flow/login/page.tsx