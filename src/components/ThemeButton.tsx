import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";

export const ThemeButton = () => {
  const [newTheme, setNewTheme] = useState("light");
  const [themeHover, setThemeHover] = useState("");

  function getThemeIcon() {
    if (themeHover) {
      return themeHover === "dark" ? faMoon : faSun;
    } else {
      return newTheme === "dark" ? faMoon : faSun;
    }
  }

  useEffect(() => {
    const auxTheme = localStorage.getItem('letmeask-theme');
    if(auxTheme){
        setNewTheme(auxTheme);
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('letmeask-theme', newTheme);
  }, [newTheme])

  function setTheme(theme: string) {

    setNewTheme(theme);

    localStorage.setItem("letmeask-theme",theme);

  }

  return (
    <button
      onMouseEnter={() => {
        setThemeHover(newTheme === "dark" ? "light" : "dark");
      }}
      onMouseLeave={() => setThemeHover("")}
      className={newTheme === "dark" ? "dark" : "light"}
      onClick={() => setTheme(newTheme === "dark" ? "light" : "dark")}
    >
      <FontAwesomeIcon icon={getThemeIcon()} />
    </button>
  );
};
