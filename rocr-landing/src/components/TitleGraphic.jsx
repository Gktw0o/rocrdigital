import React from "react";

const TitleGraphic = ({ title = "Designed for the Future." }) => {
    return (
        <section className="title-graphic">
            <h1 className="title-text">{title}</h1>
        </section>
    );
};

export default TitleGraphic;