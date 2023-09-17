import React from "react";
// import "../bootstrap/css/bootstrap.min.css";
// import "../bootstrap/js/bootstrap.bundle.min.js";
// import "./stylesContato.css";
import { Link } from "react-router-dom";

export function Contato() {
  return (
    <>
      <div className="contato">
        <header className="header-contato" id="header">
          <div className="header-logo-contato">
            <svg
              width="479"
              height="485"
              viewBox="0 0 479 485"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M271.333 4.33334C300.133 12.0667 326.533 30.8666 342 54.7333C349.2 65.9333 412.4 195.933 416.8 208.6C421.467 222.2 423.2 237.667 421.333 250.733C419.333 265.4 415.733 275.4 401.6 304.333L389.6 329L416.267 341.933C441.2 354.2 443.467 355.533 452.667 364.6C462.667 374.733 468.667 384.6 472.533 397.533C475.067 406.333 479.467 459.133 478.133 466.067C477.067 472.067 471.067 479.267 464.8 482.2C460.667 484.2 439.733 484.333 239.333 484.333C38.9333 484.333 18 484.2 13.8666 482.2C7.59997 479.267 1.59999 472.067 0.533319 466.067C-0.800014 459.133 3.59999 406.333 6.13333 397.533C9.86666 385.267 16 374.733 25.2 365.133C33.4666 356.6 35.6 355.267 61.4666 342.467L89.0666 329L75.3333 300.6C59.4666 267.667 56.6666 258.2 56.8 238.333C57.0666 216.867 58.2666 213.667 96.6666 134.333C103.867 119.667 114.533 97.4 120.667 84.8666C133.467 58.3333 139.867 48.4667 152.133 36.0667C169.733 18.6 191.067 7.39998 216.667 2.19998C230.133 -0.466685 257.6 0.60001 271.333 4.33334Z" />
              <path d="M224.4 137.667C182.667 143.533 147.067 172.333 132.933 211.667C125.067 233.8 124.533 262.067 131.867 284.333C136.667 299.133 144.933 313.933 154.533 324.467C166.667 337.933 166.533 342.2 154.267 354.6L146.133 363H196.8C254.267 363 264.133 361.933 281.733 354.333C304.4 344.6 320.267 331.667 332.8 312.867C347.067 291.533 352.933 270.067 351.6 244.333C350.533 225.4 348.4 216.733 340 199.667C321.867 162.733 286.533 139.4 245.067 137.133C238.267 136.867 228.933 137 224.4 137.667ZM218.133 215.4C222 219.933 222.267 224.2 218.533 228.867L215.867 232.333H191.2C168.4 232.333 166.533 232.2 164 229.667C162.533 228.2 161.333 226.067 161.333 225C161.333 221.4 164.933 213.933 167.6 212.467C169.2 211.533 177.867 211.133 192.4 211.267L214.933 211.667L218.133 215.4ZM311.867 213C318 216.067 319.467 224.867 314.667 229.667C312.133 232.2 310.267 232.333 287.467 232.333H262.8L260.133 228.867C256.8 224.6 256.533 220.6 259.467 216.6C262.8 211.8 265.867 211.133 287.733 211.133C303.2 211 309.067 211.533 311.867 213Z" />
            </svg>
            <h1 className="logo-text-contato">Ceferno</h1>
          </div>
          <div className="header-items-contato">
            <div className="header-item-contato">
            <Link style={{ textDecoration: 'none' }} to="/sobre">
              <div className="item-title-contato">
                <h1 className="title-text-contato">Sobre</h1>
              </div>
              </Link>
            </div>
            <div className="header-item-contato">
            <Link style={{ textDecoration: 'none' }} to="/tutorial">
              <div className="item-title-contato">
                <h1 className="title-text-contato">Tutorial</h1>
              </div>
              </Link>
            </div>
            <div className="header-item-contato">
            <Link style={{ textDecoration: 'none' }} to="/contato">
              <div className="item-title-contato">
                <h1 className="title-text-contato contato">Contato</h1>
              </div>
              </Link>
            </div>
            <Link style={{ textDecoration: 'none' }} to="/register">
              <p href="" className="header-link-contato">
                Acesse TheCeferno
              </p>
            </Link>
          </div>
        </header>
        <main className="main-contato" id="main">
          <section id="contact" className="contact">
            <div className="container-fluid" data-aos="fade-up">
              <div className="section-header-contato">
                <h2>Envie aqui suas sugestões!</h2>
              </div>

              <div className="row gx-lg-0 ">
                  <form
                    action=""
                    method="post"
                    role="form"
                    className="form"
                  >
                    <div className="row">
                      <div className="col-12 col-md-6 form-group">
                        <input
                          type="text"
                          name="name"
                          className="form-control"
                          id="name"
                          placeholder="Seu Nome"
                          required
                        />
                      </div>
                      <div className="col-12 col-md-6 form-group mt-3 mt-md-0">
                        <input
                          type="email"
                          className="form-control"
                          name="email"
                          id="email"
                          placeholder="Seu Email"
                          required
                        />
                      </div>
                    </div>
                    <div className="form-group mt-3 mensagem">
                      <textarea
                        className="form-control-contato"
                        name="message"
                        rows="7"
                        placeholder="Sugestão:"
                        required
                      ></textarea>
                    </div>
                    <div className="text-center-contato">
                      <button type="submit">Enviar sugestão</button>
                    </div>
                  </form>
                </div>
              </div>
          </section>
        </main>
      </div>
    </>
  );
}
