import React, { useContext } from "react";
import FacebookIcon from "@material-ui/icons/Facebook";
import Classes from "./Navigation.module.css";
import Search from "../../components/Navigate/Search/Search";
import CentralBar from "../../components/Navigate/CentralBar/CentralBar";
import LeftBart from "../../components/Navigate/LeftBar/LeftBart";
import { authContext } from "../../store/context";

const Navigation = () => {
  const authState = useContext(authContext);

  return (
    <div className={Classes.Container}>
      <div className={Classes.Left}>
        <FacebookIcon
          fontSize="large"
          color="primary"
          className={Classes.Logo}
        />
        <Search IconName="fas fa-search" placeholder="Search in MoonLight" />
      </div>
      <div className={Classes.CentralBar}>
        <CentralBar />
      </div>
      <div>
        <LeftBart
          username={authState.user.name}
          userId={authState.user._id}
          perfilImage={authState.user.perfil}
        />
      </div>
    </div>
  );
};

export default Navigation;
