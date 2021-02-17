import React from "react";
import { useRouteMatch, Link } from "react-router-dom";
import Classes from "./ButtonNav.module.css";

interface IProps {
  to: string;
  icon: string;
  IconSize: number;
  label?: string;
  exact?: boolean;
}

const ButtonNav = ({ to, icon, IconSize, exact = true, label }: IProps) => {
  let match = useRouteMatch({
    path: to,
    exact: exact,
  });
  return (
    <div className={match ? Classes.ActiveContainer : Classes.Container}>
      <Link className={match ? Classes.ActiveLink : Classes.Link} to={to}>
        <i className={icon} style={{ fontSize: IconSize }}></i>
      </Link>
    </div>
  );
};

export default ButtonNav;
