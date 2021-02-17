import React from "react";
import RowImage from "../../components/UI/RowImage/RowImage";
import image from "../../assets/publicity1.jpg";
import Classes from "./HomeRight.module.css";

const HomeRight = () => {
  return (
    <div className={Classes.Container}>
      <h2 className={Classes.Title}>Publicity</h2>
      <hr />
      <RowImage
        Title="DataCamp Sale On Today"
        messege="datacamp.com"
        image={image}
      />
      <RowImage
        Title="DataCamp Sale On Today"
        messege="datacamp.com"
        image={image}
      />
      <RowImage
        Title="DataCamp Sale On Today"
        messege="datacamp.com"
        image={image}
      />
      <RowImage
        Title="DataCamp Sale On Today"
        messege="datacamp.com"
        image={image}
      />
    </div>
  );
};

export default HomeRight;
