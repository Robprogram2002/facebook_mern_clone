import React from "react";
import HouseIcon from "@material-ui/icons/House";
import OndemandVideoIcon from "@material-ui/icons/OndemandVideo";
import StoreIcon from "@material-ui/icons/Store";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import SportsEsportsIcon from "@material-ui/icons/SportsEsports";
import Classes from "./CentralBar.module.css";
import ButtonNav from "./ButtonNav/ButtonNav";

const CentralBar = () => {
  return (
    <div className={Classes.CentralBarContainer}>
      <ButtonNav icon="fas fa-home" IconSize={32} to="/" />
      <ButtonNav icon="fab fa-youtube" IconSize={32} to="/watch" />
      <ButtonNav icon="fas fa-store-alt" IconSize={32} to="/store" />
      <ButtonNav icon="fas fa-users" IconSize={32} to="/groups" />
      <ButtonNav icon="fas fa-chess-rook" IconSize={32} to="/games" />
    </div>
  );
};

export default CentralBar;
