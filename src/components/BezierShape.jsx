import styles from "./BezierShape.module.css";
import bezierShape from "../assets/bezierShape.svg";

function BezierShape({ positon, color }) {
  const bezierShapeClass = `${styles.default} ${styles[positon]} ${styles[color]}`;
  return (
    <img className={bezierShapeClass} src={bezierShape} />
  );
}

export default BezierShape;
