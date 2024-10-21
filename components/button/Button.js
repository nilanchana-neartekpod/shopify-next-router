import React from "react";
import styles from "./Button.module.scss"; // Import CSS module
import { Icon } from "react-feather";

export function Button({
  label = "Okay",
  icon = Icon,
  iconPosition = "start",
  iconColor = undefined,
  iconFill = false,
  buttonStyle = "regular",
  ...rest
}) {
  const StartIcon = iconPosition === "start" ? icon : null;
  const EndIcon = iconPosition === "end" ? icon : null;
  const classList = [styles.button]; // Add the button class from the CSS Module

  if (iconColor) {
    classList.push(
      styles[`icon${iconColor.charAt(0).toUpperCase() + iconColor.slice(1)}`]
    );
  }
  if (iconFill) {
    classList.push(styles.iconFill);
  }
  classList.push(
    styles[
      `buttonStyle${buttonStyle.charAt(0).toUpperCase() + buttonStyle.slice(1)}`
    ]
  );

  return (
    <button data-component="Button" className={classList.join(" ")} {...rest}>
      {StartIcon && (
        <span className={`${styles.icon} ${styles.iconStart}`}>
          <StartIcon />
        </span>
      )}
      <span className="label">{label}</span>
      {EndIcon && (
        <span className={`${styles.icon} ${styles.iconEnd}`}>
          <EndIcon />
        </span>
      )}
    </button>
  );
}
