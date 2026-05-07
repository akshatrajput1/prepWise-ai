import { useEffect } from "react";
import "./CustomCursor.css";

const CustomCursor = () => {
  useEffect(() => {
    const cursor = document.querySelector(".custom-cursor");

    const moveCursor = (e) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    };

    document.addEventListener("mousemove", moveCursor);

    const hoverElements = document.querySelectorAll(
      "button, a, input, textarea",
    );

    hoverElements.forEach((el) => {
      el.addEventListener("mouseenter", () => {
        cursor.classList.add("expand");
      });

      el.addEventListener("mouseleave", () => {
        cursor.classList.remove("expand");
      });
    });

    return () => {
      document.removeEventListener("mousemove", moveCursor);
    };
  }, []);

  return <div className="custom-cursor"></div>;
};

export default CustomCursor;
