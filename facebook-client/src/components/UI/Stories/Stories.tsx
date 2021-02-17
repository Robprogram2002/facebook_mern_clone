import React from "react";
import Classes from "./Stories.module.css";
import Story from "./Story/Story";
import image1 from "../../../assets/publicity1.jpg";
import image2 from "../../../assets/publicity2.jpg";
import image3 from "../../../assets/publicity3.jpg";
import image4 from "../../../assets/login.jpg";
import image5 from "../../../assets/login2.jpg";

const Stories = () => {
  return (
    <div className={Classes.StoriesRow}>
      <Story userName="Robert Martz Rivera" image={image1} />
      <Story userName="Robert Martz" image={image2} />
      <Story userName="Robert Martz" image={image3} />
      <Story userName="Robert Martz Rivera" image={image4} />
      <Story userName="Robert Martz" image={image5} />
    </div>
  );
};

export default Stories;
