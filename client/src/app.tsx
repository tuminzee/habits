import { BrowserRouter as Router } from "react-router-dom";
import AppRouter from "@/app-router";
import FooterNav from "@/components/footer/footer-nav";
import Header from "./components/header/header";

const App = () => {
  return (
    <Router>
      <Header />
      <AppRouter />
      <FooterNav />
    </Router>
  );
};

export default App;
