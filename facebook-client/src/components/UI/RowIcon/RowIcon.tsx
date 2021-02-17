import Classes from "./RowIcon.module.css";

interface IProps {
  Icon: any;
  Text: string;
  orientation: string;
}

const RowIcon = (props: IProps) => {
  return (
    <div
      className={
        props.orientation === "vertical"
          ? Classes.RowVertical
          : Classes.RowHorizontal
      }
    >
      <div className={Classes.IconContainer}>{props.Icon}</div>
      <div className={Classes.TextContainer}>
        <p>{props.Text}</p>
      </div>
    </div>
  );
};

export default RowIcon;
