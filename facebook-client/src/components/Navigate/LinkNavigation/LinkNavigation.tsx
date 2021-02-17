import React from "react";
import { useRouteMatch, Link } from "react-router-dom";
import Classes from "./LinkNavigation.module.css";

const LinkNavigation = ({
  label,
  to,
  size,
  exact = true,
}: {
  label: string;
  to: string;
  size?: number;
  exact?: boolean;
}) => {
  let match = useRouteMatch({
    path: to,
    exact: exact,
  });

  return (
    <div className={match ? Classes.ActiveContainer : Classes.Container}>
      <Link
        style={{ fontSize: size }}
        className={match ? Classes.ActiveLink : Classes.Link}
        to={to}
      >
        {label}
      </Link>
    </div>
  );
};

export default LinkNavigation;
