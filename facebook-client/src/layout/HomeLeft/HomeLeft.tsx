import React from "react";
import SupervisedUserCircleIcon from "@material-ui/icons/SupervisedUserCircle";
import RowIcon from "../../components/UI/RowIcon/RowIcon";
import Classes from "./HomeLeft.module.css";

const HomeLeft = () => {
  return (
    <div className={Classes.Container}>
      <RowIcon
        Icon={
          <SupervisedUserCircleIcon fontSize="large" className={Classes.Icon} />
        }
        Text="Roberto Martinez Rivera"
        orientation="vertical"
      />
      <RowIcon
        Icon={
          <SupervisedUserCircleIcon fontSize="large" className={Classes.Icon} />
        }
        Text="Friends"
        orientation="vertical"
      />
      <RowIcon
        Icon={
          <SupervisedUserCircleIcon fontSize="large" className={Classes.Icon} />
        }
        Text="Groups"
        orientation="vertical"
      />{" "}
      <RowIcon
        Icon={
          <SupervisedUserCircleIcon fontSize="large" className={Classes.Icon} />
        }
        Text="Marketplace"
        orientation="vertical"
      />{" "}
      <RowIcon
        Icon={
          <SupervisedUserCircleIcon fontSize="large" className={Classes.Icon} />
        }
        Text="Videos"
        orientation="vertical"
      />{" "}
      <RowIcon
        Icon={
          <SupervisedUserCircleIcon fontSize="large" className={Classes.Icon} />
        }
        Text="Events"
        orientation="vertical"
      />{" "}
      <RowIcon
        Icon={
          <SupervisedUserCircleIcon fontSize="large" className={Classes.Icon} />
        }
        Text="See More"
        orientation="vertical"
      />
      <RowIcon
        Icon={
          <SupervisedUserCircleIcon fontSize="large" className={Classes.Icon} />
        }
        Text="Marketplace"
        orientation="vertical"
      />{" "}
      <RowIcon
        Icon={
          <SupervisedUserCircleIcon fontSize="large" className={Classes.Icon} />
        }
        Text="Marketplace"
        orientation="vertical"
      />{" "}
      <RowIcon
        Icon={
          <SupervisedUserCircleIcon fontSize="large" className={Classes.Icon} />
        }
        Text="Marketplace"
        orientation="vertical"
      />
    </div>
  );
};

export default HomeLeft;
