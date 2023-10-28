import React, { useState, useEffect } from "react";

function Header() {
  const [scrollDirection, setScrollDirection] = useState(
    "You have not scrolled yet"
  );

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY) {
        setScrollDirection("Scrolling Down");
      } else if (currentScrollY < lastScrollY) {
        setScrollDirection("Scrolling Up");
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="tl-header">
      <div className="tl-header-div1 header-active">
        <h1>Para Você</h1>
        <div className="header-active-in"></div>
      </div>
      <div className="tl-header-div2">
        <h1>Seguindo</h1>
      </div>
      <div className="tl-header-filter">
        <div className="tl-header-filter-in">
          <img
            src="https://cdn.discordapp.com/attachments/871728576972615680/1167909847866560643/settings-17-xxl.png?ex=654fd7ce&is=653d62ce&hm=f0fda7a77e21a3e137d47b2556d96ff236cdbbbab707e8042f010a3a4c980a17&"
            alt=""
          />
        </div>
      </div>
    </div>
  );
}

export default Header;
