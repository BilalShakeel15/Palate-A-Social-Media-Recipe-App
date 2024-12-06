import React from "react";
import "../../styles/about.css"; // Custom CSS for styling
import BilalPic from "../../images/My pic.jpg"; // Replace with actual images
import ShaheerPic from "../../images/shaheer.jpg"; // Replace with actual images
import TalmeehaPic from "../../images/talmeeha.jpg"; // Replace with actual images
import Navbar from '../navbar.js';

const About = () => {
  return (
    <>
    <Navbar/>
    <div className="about-page">
      {/* Section 1: Bilal Shakeel */}
      <section className="about-section">
        <div className="about-content">
          <div className="about-text">
            <h2>Bilal Shakeel</h2>
            <p>
              Bilal Shakeel is a passionate full-stack developer with expertise
              in MERN stack and .NET Core. As a student at FAST University, he
              has consistently demonstrated academic excellence, being a
              Dean's List achiever. With a strong foundation in web development
              and software engineering, Bilal is dedicated to crafting scalable
              and efficient applications. His expertise spans modern
              technologies, making him a valuable asset in any development
              project.
            </p>
          </div>
          <div className="about-image">
            <img src={BilalPic} alt="Bilal Shakeel" />
          </div>
        </div>
      </section>

      {/* Section 2: Shaheer Khan */}
      <section className="about-section alternate">
        <div className="about-content">
          <div className="about-image">
            <img src={ShaheerPic} alt="Shaheer Khan" />
          </div>
          <div className="about-text">
            <h2>Shaheer Khan</h2>
            <p>
              Shaheer Khan is a skilled full-stack developer with a focus on
              the MERN stack. As a student at FAST University, he has honed his
              abilities in designing and developing dynamic web applications.
              His passion for technology and problem-solving drives him to
              create user-friendly, efficient, and robust solutions. Shaheer's
              dedication to continuous learning ensures he stays updated with
              the latest trends in software development.
            </p>
          </div>
        </div>
      </section>

      {/* Section 3: Talmeeha Tanweer */}
      <section className="about-section">
        <div className="about-content">
          <div className="about-text">
            <h2>Talmeeha Tanweer</h2>
            <p>
              Talmeeha Tanweer is a talented UI/UX designer with expertise in
              Figma, HTML, CSS, JavaScript, and C++. As a student at FAST
              University, she combines technical proficiency with a keen eye
              for aesthetics to deliver exceptional user experiences. Her
              creative approach and strong problem-solving skills make her an
              asset to any design and development team. Talmeeha's passion for
              creating intuitive and visually appealing interfaces sets her
              apart in the field of UI/UX design.
            </p>
          </div>
          <div className="about-image">
            <img src={TalmeehaPic} alt="Talmeeha Tanweer" />
          </div>
        </div>
      </section>
    </div>
    </>
  );
};

export default About;
